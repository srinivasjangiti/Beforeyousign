// AI-powered negotiation playbook generator

import { generateText, parseJsonResponse } from './nvidia-client';
import { ContractAnalysis, ClauseAnalysis } from './types';

export interface NegotiationPlaybook {
  overview: {
    totalNegotiationPoints: number;
    estimatedDifficulty: 'easy' | 'moderate' | 'challenging' | 'complex';
    estimatedTimeframe: string;
    overallStrategy: string;
  };
  priorities: Array<{
    rank: number;
    clauseId: string;
    clauseTitle: string;
    importance: 'critical' | 'high' | 'medium';
    reason: string;
    expectedResistance: 'low' | 'medium' | 'high';
  }>;
  negotiationTactics: Array<{
    clauseId: string;
    tactic: string;
    talking_points: string[];
    counterarguments: string[];
    fallback_positions: string[];
    market_data: string;
  }>;
  timeline: Array<{
    phase: string;
    duration: string;
    objectives: string[];
    deliverables: string[];
  }>;
  riskMitigation: {
    dealBreakers: string[];
    mustHaves: string[];
    niceToHaves: string[];
    tradingChips: string[]; // Things you can give up to get what you want
  };
  scripts: {
    openingStatement: string;
    keyPhrases: string[];
    closingStatement: string;
  };
  metadata: {
    generatedAt: string;
    contractType: string;
    estimatedSavings: string;
  };
}

export class NegotiationPlaybookGenerator {
  /**
   * Generate a comprehensive negotiation playbook from contract analysis
   */
  static async generate(
    analysis: ContractAnalysis,
    focusClauses?: string[] // Optional: specific clause IDs to focus on
  ): Promise<NegotiationPlaybook> {
    try {
      const clausesToNegotiate = focusClauses
        ? analysis.clauses.filter(c => focusClauses.includes(c.id))
        : analysis.clauses.filter(c => 
            c.riskLevel === 'critical' || 
            c.riskLevel === 'high' ||
            (c.fairnessScore && c.fairnessScore < 40)
          );

      const prompt = this.buildPlaybookPrompt(analysis, clausesToNegotiate);
      
      const text = await generateText(prompt);
      const playbookData = parseJsonResponse<Record<string, unknown>>(text);
      return this.formatPlaybook(playbookData, analysis);
    } catch (error: unknown) {
      console.error('Negotiation playbook generation error:', error);
      throw new Error(
        `Failed to generate playbook: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Build the playbook generation prompt
   */
  private static buildPlaybookPrompt(
    analysis: ContractAnalysis,
    clausesToNegotiate: ClauseAnalysis[]
  ): string {
    return `You are an expert contract negotiation strategist. Generate a comprehensive negotiation playbook for the following contract.

CONTRACT OVERVIEW:
- Document Type: ${analysis.metadata.documentType || 'Unknown'}
- Risk Score: ${analysis.riskScore}/100
- Total Clauses: ${analysis.clauses.length}
- Red Flags: ${analysis.redFlags.length}
- Clauses to Negotiate: ${clausesToNegotiate.length}

CLAUSES REQUIRING NEGOTIATION:
${clausesToNegotiate.map((clause, idx) => `
${idx + 1}. ${clause.title} (Risk: ${clause.riskLevel}, Fairness: ${clause.fairnessScore || 'N/A'}/100)
   Original: "${clause.originalText}"
   Concerns: ${clause.concerns.join('; ')}
   ${clause.negotiationStrategy ? `
   Current Strategy: ${clause.negotiationStrategy.suggestedApproach}
   Leverage: ${clause.negotiationStrategy.leverage}
   Priority: ${clause.negotiationStrategy.priority}
   ` : ''}
`).join('\n')}

RED FLAGS IDENTIFIED:
${analysis.redFlags.map((flag, idx) => `${idx + 1}. ${flag.title} (${flag.severity}): ${flag.description}`).join('\n')}

AI INSIGHTS:
${analysis.insights ? `
- Missing Clauses: ${analysis.insights.missingClauses.join(', ') || 'None'}
- Contradictions: ${analysis.insights.contradictions.length} found
- Unusual Terms: ${analysis.insights.unusualTerms.length} identified
- Strengths to Keep: ${analysis.insights.strengthsToKeep.join(', ') || 'None'}
` : 'No insights available'}

TASK:
Create a detailed, actionable negotiation playbook that will help the user negotiate better terms. Focus on:
1. Prioritizing negotiation points by impact and achievability
2. Providing specific, proven negotiation tactics for each clause
3. Anticipating counterarguments and preparing responses
4. Creating realistic fallback positions
5. Establishing a clear timeline and strategy
6. Identifying deal-breakers vs. nice-to-haves
7. Providing word-for-word scripts for key conversations

Return your playbook as a JSON object with this exact structure:
{
  "overview": {
    "totalNegotiationPoints": number,
    "estimatedDifficulty": "easy|moderate|challenging|complex",
    "estimatedTimeframe": "string (e.g., '2-3 weeks')",
    "overallStrategy": "string (2-3 sentences on approach)"
  },
  "priorities": [
    {
      "rank": 1,
      "clauseId": "clause_id",
      "clauseTitle": "title",
      "importance": "critical|high|medium",
      "reason": "why this is important to negotiate",
      "expectedResistance": "low|medium|high"
    }
  ],
  "negotiationTactics": [
    {
      "clauseId": "clause_id",
      "tactic": "specific negotiation approach",
      "talking_points": ["point 1", "point 2", "point 3"],
      "counterarguments": ["response to objection 1", "response to objection 2"],
      "fallback_positions": ["fallback 1", "fallback 2"],
      "market_data": "relevant market benchmarks or precedents"
    }
  ],
  "timeline": [
    {
      "phase": "phase name",
      "duration": "timeframe",
      "objectives": ["objective 1", "objective 2"],
      "deliverables": ["deliverable 1"]
    }
  ],
  "riskMitigation": {
    "dealBreakers": ["non-negotiable item 1"],
    "mustHaves": ["critical requirement 1"],
    "niceToHaves": ["preferred term 1"],
    "tradingChips": ["concession you can make 1"]
  },
  "scripts": {
    "openingStatement": "word-for-word opening statement",
    "keyPhrases": ["phrase 1", "phrase 2"],
    "closingStatement": "word-for-word closing statement"
  },
  "metadata": {
    "generatedAt": "${new Date().toISOString()}",
    "contractType": "${analysis.metadata.documentType || 'Unknown'}",
    "estimatedSavings": "estimated financial or risk reduction value"
  }
}

IMPORTANT: Return ONLY the JSON object, no additional text or markdown formatting.`;
  }

  /**
   * Format the playbook data
   */
  private static formatPlaybook(
    data: Record<string, unknown>,
    analysis: ContractAnalysis
  ): NegotiationPlaybook {
    return {
      overview: {
        totalNegotiationPoints: ((data.overview as Record<string, unknown>)?.totalNegotiationPoints as number) || 0,
        estimatedDifficulty: ((data.overview as Record<string, unknown>)?.estimatedDifficulty as 'easy' | 'moderate' | 'challenging' | 'complex') || 'moderate',
        estimatedTimeframe: ((data.overview as Record<string, unknown>)?.estimatedTimeframe as string) || 'Unknown',
        overallStrategy: ((data.overview as Record<string, unknown>)?.overallStrategy as string) || 'No strategy available',
      },
      priorities: ((data.priorities as Array<Record<string, unknown>>) || []).map((p) => ({
        rank: (p.rank as number) || 0,
        clauseId: (p.clauseId as string) || '',
        clauseTitle: (p.clauseTitle as string) || '',
        importance: (p.importance as 'critical' | 'high' | 'medium') || 'medium',
        reason: (p.reason as string) || '',
        expectedResistance: (p.expectedResistance as 'low' | 'medium' | 'high') || 'medium',
      })),
      negotiationTactics: ((data.negotiationTactics as Array<Record<string, unknown>>) || []).map((t) => ({
        clauseId: (t.clauseId as string) || '',
        tactic: (t.tactic as string) || '',
        talking_points: (t.talking_points as string[]) || [],
        counterarguments: (t.counterarguments as string[]) || [],
        fallback_positions: (t.fallback_positions as string[]) || [],
        market_data: (t.market_data as string) || '',
      })),
      timeline: ((data.timeline as Array<Record<string, unknown>>) || []).map((t) => ({
        phase: (t.phase as string) || '',
        duration: (t.duration as string) || '',
        objectives: (t.objectives as string[]) || [],
        deliverables: (t.deliverables as string[]) || [],
      })),
      riskMitigation: {
        dealBreakers: ((data.riskMitigation as Record<string, unknown>)?.dealBreakers as string[]) || [],
        mustHaves: ((data.riskMitigation as Record<string, unknown>)?.mustHaves as string[]) || [],
        niceToHaves: ((data.riskMitigation as Record<string, unknown>)?.niceToHaves as string[]) || [],
        tradingChips: ((data.riskMitigation as Record<string, unknown>)?.tradingChips as string[]) || [],
      },
      scripts: {
        openingStatement: ((data.scripts as Record<string, unknown>)?.openingStatement as string) || '',
        keyPhrases: ((data.scripts as Record<string, unknown>)?.keyPhrases as string[]) || [],
        closingStatement: ((data.scripts as Record<string, unknown>)?.closingStatement as string) || '',
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        contractType: analysis.metadata.documentType || 'Unknown',
        estimatedSavings: ((data.metadata as Record<string, unknown>)?.estimatedSavings as string) || 'Not estimated',
      },
    };
  }
}
