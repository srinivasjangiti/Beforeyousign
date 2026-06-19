// AI-powered contract analysis using NVIDIA NIM API

import { generateText, parseJsonResponse, NVIDIA_MODELS } from './nvidia-client';
import {
  ContractAnalysis,
  ClauseAnalysis,
  RedFlag,
} from './types';

export class ContractAnalyzer {
  /**
   * Analyze contract text using AI
   */
  static async analyze(
    contractText: string,
    fileName: string,
    fileSize: number,
    jurisdiction: string = 'US'
  ): Promise<ContractAnalysis> {
    const maxRetries = Math.max(1, Number.parseInt(process.env.ANALYZE_MAX_RETRIES || '1', 10));
    const baseDelay = 750;
    // Reduced defaults: smaller prompt + fewer tokens = faster inference (15-25s vs 50-90s)
    const maxPromptChars = Math.max(3000, Number.parseInt(process.env.ANALYZE_MAX_PROMPT_CHARS || '6000', 10));
    const modelOutputTokens = Math.max(512, Number.parseInt(process.env.ANALYZE_MAX_OUTPUT_TOKENS || '1024', 10));
    const trimmedContractText = contractText.length > maxPromptChars
      ? `${contractText.slice(0, maxPromptChars)}\n\n[Contract text truncated for faster analysis due to deployment limits]`
      : contractText;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const prompt = this.buildAnalysisPrompt(trimmedContractText, jurisdiction);
        
        const text = await generateText(prompt, NVIDIA_MODELS.fast, 0.3, modelOutputTokens);
        
        if (!text) {
          throw new Error('No response from AI');
        }

        const analysisData = parseJsonResponse<Record<string, unknown>>(text);
        
        return this.formatAnalysis(analysisData, fileName, fileSize);
      } catch (error: unknown) {
        console.error(`Contract analysis error (attempt ${attempt}/${maxRetries}):`, error);
        const err = error as Error & { message?: string; status?: number };
        
        // Check if it's a rate limit or overload error
        const isRateLimitError = err?.message?.includes('503') || 
                                 err?.message?.includes('429') ||
                                 err?.message?.includes('overloaded') ||
                                 err?.message?.includes('UNAVAILABLE') ||
                                 err?.status === 503 ||
                                 err?.status === 429;
        
        if (isRateLimitError && attempt < maxRetries) {
          // Exponential backoff: wait longer between each retry
          const delay = baseDelay * Math.pow(2, attempt - 1);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // If not a rate limit error or we've exhausted retries
        if (isRateLimitError) {
          throw new Error(
            'The AI service is currently busy. Please wait 1-2 minutes and try again.'
          );
        }
        
        // Check for API key issues
        if (err?.message?.includes('API key') || err?.message?.includes('401') || err?.message?.includes('Unauthorized')) {
          throw new Error(
            'Invalid API key. Please check your NVIDIA_API_KEY in the .env.local file and ensure it is correctly configured.'
          );
        }
        
        throw new Error(
          `Failed to analyze contract: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
    
    throw new Error('Failed to analyze contract after 3 attempts. The API is experiencing heavy load. Please try again in a few minutes.');
  }

  /**
   * Build comprehensive analysis prompt
   */
  public static buildAnalysisPrompt(contractText: string, jurisdiction: string): string {
    // Parse jurisdiction format: "US-California" or "US" or "CA-Ontario"
    const getJurisdictionName = (code: string): string => {
      const countryNames: Record<string, string> = {
        'US': 'United States', 'CA': 'Canada', 'MX': 'Mexico',
        'UK': 'United Kingdom', 'EU': 'European Union', 'DE': 'Germany', 'FR': 'France',
        'ES': 'Spain', 'IT': 'Italy', 'NL': 'Netherlands', 'IE': 'Ireland', 'CH': 'Switzerland',
        'BE': 'Belgium', 'AT': 'Austria', 'SE': 'Sweden', 'NO': 'Norway', 'DK': 'Denmark',
        'FI': 'Finland', 'PT': 'Portugal', 'GR': 'Greece', 'PL': 'Poland', 'CZ': 'Czech Republic',
        'RO': 'Romania', 'HU': 'Hungary',
        'IN': 'India', 'CN': 'China', 'JP': 'Japan', 'KR': 'South Korea', 'SG': 'Singapore',
        'HK': 'Hong Kong', 'TW': 'Taiwan', 'MY': 'Malaysia', 'TH': 'Thailand', 'ID': 'Indonesia',
        'PH': 'Philippines', 'VN': 'Vietnam', 'PK': 'Pakistan', 'BD': 'Bangladesh', 'LK': 'Sri Lanka',
        'AU': 'Australia', 'NZ': 'New Zealand',
        'AE': 'United Arab Emirates', 'SA': 'Saudi Arabia', 'IL': 'Israel', 'TR': 'Turkey',
        'QA': 'Qatar', 'KW': 'Kuwait', 'BH': 'Bahrain', 'OM': 'Oman', 'JO': 'Jordan', 'LB': 'Lebanon',
        'BR': 'Brazil', 'AR': 'Argentina', 'CL': 'Chile', 'CO': 'Colombia', 'PE': 'Peru',
        'VE': 'Venezuela', 'EC': 'Ecuador', 'UY': 'Uruguay',
        'ZA': 'South Africa', 'NG': 'Nigeria', 'EG': 'Egypt', 'KE': 'Kenya', 'MA': 'Morocco',
        'GH': 'Ghana', 'ET': 'Ethiopia', 'TZ': 'Tanzania', 'UG': 'Uganda',
        'CR': 'Costa Rica', 'PA': 'Panama', 'TT': 'Trinidad and Tobago', 'JM': 'Jamaica', 'BB': 'Barbados',
        'RU': 'Russia', 'UA': 'Ukraine',
      };
      
      if (code.includes('-')) {
        const [countryCode, stateName] = code.split('-');
        const countryName = countryNames[countryCode] || countryCode;
        return `${stateName}, ${countryName}`;
      }
      
      return countryNames[code] || code;
    };
    
    const jurisdictionName = getJurisdictionName(jurisdiction);
    return `You are an expert contract lawyer. Analyze the contract below and return a JSON risk assessment. Be concise — keep ALL string values short to fit within token limits.

JURISDICTION: ${jurisdictionName}

CONTRACT TEXT:
${contractText}

INSTRUCTIONS:
- Identify the most important risks and harmful clauses (max 8 clauses total)
- Focus on: IP transfers, liability, auto-renewals, termination, indemnification, non-compete, payment, arbitration
- Flag clauses violating ${jurisdictionName} laws
- Keep ALL text values brief and concise (no long explanations)
- originalText: copy at most 150 characters from the contract (truncate with "..." if longer)
- plainLanguage: max 100 characters
- concerns: max 2 items, max 80 chars each
- recommendations: max 5 items, max 100 chars each
- commonAlternatives: max 2 items, max 80 chars each
- fallbackPositions: max 2 items, max 80 chars each
- marketPrecedents: max 2 items, max 60 chars each

REQUIRED OUTPUT FORMAT (return ONLY this JSON, no markdown, no extra text):
{
  "summary": "2 sentence summary under 200 chars",
  "riskScore": 0,
  "clauses": [
    {
      "id": "c1",
      "title": "Short Clause Title",
      "originalText": "first 150 chars of clause...",
      "plainLanguage": "plain explanation under 100 chars",
      "riskLevel": "low|medium|high|critical",
      "category": "payment|termination|liability|intellectual_property|confidentiality|dispute_resolution|warranties|indemnification|non_compete|general|other",
      "concerns": ["concern 1", "concern 2"],
      "position": {"start": 0, "end": 100},
      "fairnessScore": 50,
      "industryComparison": {
        "averageStrictness": 50,
        "percentile": 50,
        "commonAlternatives": ["alt 1", "alt 2"],
        "fairerVersion": "brief fairer wording"
      },
      "negotiationStrategy": {
        "priority": "high|medium|low",
        "leverage": "strong|moderate|weak",
        "suggestedApproach": "brief tactic under 100 chars",
        "fallbackPositions": ["compromise 1", "compromise 2"],
        "marketPrecedents": ["example 1", "example 2"]
      }
    }
  ],
  "redFlags": [
    {
      "id": "f1",
      "type": "ip_transfer|unlimited_liability|auto_renewal|restricted_termination|one_sided_amendment|venue_forum|waiver_of_rights|confidentiality_overreach|indemnification|non_compete|payment_terms|dispute_resolution|other",
      "severity": "warning|danger|critical",
      "title": "Short Flag Title",
      "description": "brief description under 150 chars",
      "affectedClauses": ["c1"],
      "recommendation": "brief action under 100 chars"
    }
  ],
  "recommendations": ["rec 1", "rec 2", "rec 3"],
  "insights": {
    "missingClauses": ["clause type 1"],
    "contradictions": [{"clause1": "c1", "clause2": "c2", "issue": "brief issue"}],
    "unusualTerms": [{"clauseId": "c1", "reason": "brief reason"}],
    "strengthsToKeep": ["favorable term 1"]
  },
  "metadata": {
    "documentType": "employment|nda|service_agreement|lease|purchase_order|partnership|licensing|consulting|freelance|vendor|subscription|master_service_agreement|sow|other",
    "parties": ["party 1", "party 2"],
    "effectiveDate": null,
    "expirationDate": null,
    "governingLaw": null,
    "contractValue": null,
    "autoRenewal": null
  }
}`;
  }


  /**
   * Format AI response into ContractAnalysis type
   */
  public static formatAnalysis(
    data: Record<string, unknown>,
    fileName: string,
    fileSize: number
  ): ContractAnalysis {
    return {
      summary: (data.summary as string) || 'No summary available',
      riskScore: Math.min(100, Math.max(0, (data.riskScore as number) || 0)),
      clauses: ((data.clauses as Array<Record<string, unknown>>) || []).map((clause, index: number) => ({
        id: clause.id || `clause_${index}`,
        title: clause.title || 'Unnamed Clause',
        originalText: clause.originalText || '',
        plainLanguage: clause.plainLanguage || '',
        riskLevel: clause.riskLevel || 'low',
        category: clause.category || 'other',
        concerns: clause.concerns || [],
        position: clause.position || { start: 0, end: 0 },
        fairnessScore: (clause.fairnessScore as number) || 50,
        industryComparison: clause.industryComparison || undefined,
        negotiationStrategy: clause.negotiationStrategy || undefined,
      })) as ClauseAnalysis[],
      redFlags: ((data.redFlags as Array<Record<string, unknown>>) || []).map((flag, index: number) => ({
        id: flag.id || `flag_${index}`,
        type: flag.type || 'other',
        severity: flag.severity || 'warning',
        title: flag.title || 'Unnamed Risk',
        description: flag.description || '',
        affectedClauses: flag.affectedClauses || [],
        recommendation: flag.recommendation || '',
      })) as RedFlag[],
      recommendations: (data.recommendations as string[]) || [],
      insights: {
        missingClauses: ((data.insights as Record<string, unknown>)?.missingClauses as string[]) || [],
        contradictions: (((data.insights as Record<string, unknown>)?.contradictions as Array<Record<string, unknown>>) || []).map((c: Record<string, unknown>) => ({
          clause1: (c.clause1 as string) || '',
          clause2: (c.clause2 as string) || '',
          issue: (c.issue as string) || '',
        })),
        unusualTerms: (((data.insights as Record<string, unknown>)?.unusualTerms as Array<Record<string, unknown>>) || []).map((t: Record<string, unknown>) => ({
          clauseId: (t.clauseId as string) || '',
          reason: (t.reason as string) || '',
        })),
        strengthsToKeep: ((data.insights as Record<string, unknown>)?.strengthsToKeep as string[]) || [],
      },
      metadata: {
        fileName,
        fileSize,
        uploadedAt: new Date().toISOString(),
        documentType: (data.metadata as Record<string, unknown>)?.documentType as string | undefined,
        parties: (data.metadata as Record<string, unknown>)?.parties as string[] | undefined,
        effectiveDate: (data.metadata as Record<string, unknown>)?.effectiveDate as string | undefined,
        expirationDate: (data.metadata as Record<string, unknown>)?.expirationDate as string | undefined,
        governingLaw: (data.metadata as Record<string, unknown>)?.governingLaw as string | undefined,
        contractValue: (data.metadata as Record<string, unknown>)?.contractValue as string | undefined,
        autoRenewal: (data.metadata as Record<string, unknown>)?.autoRenewal as boolean | undefined,
      },
      confidence: {
        overall: this.calculateOverallConfidence(data),
        riskScoreConfidence: this.calculateRiskConfidence(data),
        clauseAnalysisConfidence: this.calculateClauseConfidence(data),
        model: 'Llama 3.1 405B Instruct',
        modelVersion: NVIDIA_MODELS.primary,
        analysisDate: new Date().toISOString(),
        notes: this.generateConfidenceNotes(data),
      },
    };
  }

  private static calculateOverallConfidence(data: Record<string, unknown>): number {
    // Base confidence on completeness of analysis
    let confidence = 85; // Start with high baseline for Gemini 2.0
    
    if (!(data.summary as string) || (data.summary as string).length < 50) confidence -= 10;
    if (!(data.clauses as Array<unknown>) || (data.clauses as Array<unknown>).length === 0) confidence -= 15;
    if (!(data.redFlags as Array<unknown>) || (data.redFlags as Array<unknown>).length === 0) confidence -= 5;
    if (!(data.recommendations as Array<unknown>) || (data.recommendations as Array<unknown>).length === 0) confidence -= 10;
    
    return Math.max(60, Math.min(95, confidence));
  }

  private static calculateRiskConfidence(data: Record<string, unknown>): number {
    // Confidence in risk score based on depth of analysis
    let confidence = 88;
    
    const flagCount = ((data.redFlags as Array<unknown>) || []).length;
    const clauseCount = ((data.clauses as Array<unknown>) || []).length;
    const riskScore = (data.riskScore as number) || 0;
    
    if (flagCount === 0 && riskScore > 50) confidence -= 15;
    if (clauseCount < 5) confidence -= 10;
    if (riskScore < 10 || riskScore > 90) confidence -= 5; // Extreme scores slightly less confident
    
    return Math.max(70, Math.min(95, confidence));
  }

  private static calculateClauseConfidence(data: Record<string, unknown>): number {
    // Confidence in clause-level analysis
    let confidence = 90;
    
    const clauses = (data.clauses as Array<Record<string, unknown>>) || [];
    const clausesWithComparison = clauses.filter((c) => c.industryComparison).length;
    const clausesWithConcerns = clauses.filter((c) => c.concerns && Array.isArray(c.concerns) && c.concerns.length > 0).length;
    
    if (clauses.length === 0) return 0;
    
    const comparisonRatio = clausesWithComparison / clauses.length;
    const concernsRatio = clausesWithConcerns / clauses.length;
    
    if (comparisonRatio < 0.3) confidence -= 15;
    if (concernsRatio < 0.2) confidence -= 10;
    
    return Math.max(75, Math.min(95, confidence));
  }

  private static generateConfidenceNotes(data: Record<string, unknown>): string[] {
    const notes: string[] = [];
    
    const clauseCount = ((data.clauses as Array<unknown>) || []).length;
    const flagCount = ((data.redFlags as Array<unknown>) || []).length;
    
    if (clauseCount > 10) {
      notes.push('Comprehensive clause-level analysis performed');
    }
    
    if (flagCount > 5) {
      notes.push('Multiple risk factors identified - thorough risk assessment');
    }
    
    const clausesWithBenchmark = ((data.clauses as Array<Record<string, unknown>>) || []).filter((c) => c.industryComparison).length;
    if (clausesWithBenchmark > 0) {
      notes.push(`Industry comparison data available for ${clausesWithBenchmark} clause${clausesWithBenchmark === 1 ? '' : 's'}`);
    }
    
    notes.push('Analysis performed by Llama 3.1 405B Instruct - state-of-the-art reasoning model');
    notes.push('Your contract data is not stored or used for model training');
    
    return notes;
  }
}
