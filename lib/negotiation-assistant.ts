/**
 * AI-Powered Contract Negotiation Assistant
 * 
 * Features:
 * - Clause-by-clause negotiation strategies
 * - Alternative language suggestions
 * - Precedent-based recommendations
 * - Risk-aware counter-proposals
 * - Industry benchmarking
 * - Negotiation playbooks
 */

import { generateText, parseJsonResponse } from './nvidia-client';

export interface NegotiationStrategy {
  clauseId: string;
  clauseText: string;
  currentRiskLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Analysis
  issues: string[];
  leverage: 'weak' | 'moderate' | 'strong';
  negotiability: number; // 0-100, how likely to succeed
  
  // Recommendations
  alternatives: ClauseAlternative[];
  counterProposals: CounterProposal[];
  talkingPoints: string[];
  justifications: string[];
  
  // Strategy
  approach: 'aggressive' | 'balanced' | 'collaborative';
  priority: 'must-have' | 'important' | 'nice-to-have' | 'optional';
  walkawayThreshold: string;
  
  // Context
  industryStandard: string;
  precedents: NegotiationPrecedent[];
  estimatedSavings?: string;
  timeEstimate: string;
}

export interface ClauseAlternative {
  id: string;
  title: string;
  text: string;
  riskLevel: 'low' | 'medium' | 'high';
  explanation: string;
  pros: string[];
  cons: string[];
  industryUsage: number; // percentage
  recommendationScore: number; // 0-100
}

export interface CounterProposal {
  id: string;
  originalText: string;
  proposedText: string;
  changes: Array<{
    type: 'addition' | 'deletion' | 'modification';
    description: string;
  }>;
  rationale: string;
  successProbability: number; // 0-100
  impactOnRisk: 'significant-decrease' | 'moderate-decrease' | 'minimal' | 'increase';
  script: string; // What to say when proposing
}

export interface NegotiationPrecedent {
  id: string;
  industry: string;
  contractType: string;
  clause: string;
  outcome: 'accepted' | 'modified' | 'rejected';
  context: string;
  successFactors: string[];
}

export interface NegotiationPlaybook {
  title: string;
  scenario: string;
  objectives: string[];
  strategies: Array<{
    phase: string;
    tactics: string[];
    expectedOutcomes: string[];
  }>;
  redLines: string[]; // Non-negotiable points
  concessionSequence: Array<{
    item: string;
    value: string;
    timing: string;
  }>;
  closingStrategies: string[];
}

export interface NegotiationSession {
  id: string;
  contractId: string;
  startDate: Date;
  participants: string[];
  rounds: NegotiationRound[];
  status: 'active' | 'completed' | 'paused' | 'terminated';
  outcome?: 'agreement' | 'impasse' | 'terminated';
  finalTerms?: string;
}

export interface NegotiationRound {
  roundNumber: number;
  date: Date;
  proposals: Array<{
    party: string;
    clauseId: string;
    proposal: string;
    rationale: string;
  }>;
  counterProposals: Array<{
    party: string;
    clauseId: string;
    counter: string;
    rationale: string;
  }>;
  agreements: string[];
  outstandingIssues: string[];
  nextSteps: string[];
}

export class NegotiationAssistant {
  constructor(_apiKey?: string) {}

  /**
   * Generate negotiation strategy for a specific clause
   */
  async generateClauseStrategy(
    clauseText: string,
    clauseCategory: string,
    contractType: string,
    userRole: 'buyer' | 'seller' | 'employer' | 'employee' | 'vendor' | 'client',
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
  ): Promise<NegotiationStrategy> {
    const prompt = `You are an expert contract negotiation advisor. Analyze this clause and provide a comprehensive negotiation strategy.

Clause Category: ${clauseCategory}
Contract Type: ${contractType}
User Role: ${userRole}
Current Risk Level: ${riskLevel}

Clause Text:
${clauseText}

Provide a detailed negotiation strategy in JSON format with:
1. Key issues with this clause
2. Your leverage position (weak/moderate/strong)
3. Negotiability score (0-100)
4. 3-5 alternative clause formulations with pros/cons
5. 2-4 specific counter-proposals with exact wording
6. Talking points and justifications
7. Recommended approach (aggressive/balanced/collaborative)
8. Priority level (must-have/important/nice-to-have/optional)
9. Walk-away threshold
10. Industry standard language
11. Estimated savings or value
12. Time to negotiate estimate

Format as JSON following this structure:
{
  "issues": ["issue1", "issue2"],
  "leverage": "moderate",
  "negotiability": 75,
  "alternatives": [
    {
      "title": "Standard Market Terms",
      "text": "exact clause text",
      "riskLevel": "medium",
      "explanation": "why this works",
      "pros": ["pro1", "pro2"],
      "cons": ["con1"],
      "industryUsage": 60,
      "recommendationScore": 85
    }
  ],
  "counterProposals": [
    {
      "originalText": "current text",
      "proposedText": "new text",
      "changes": [{"type": "modification", "description": "what changed"}],
      "rationale": "why this is better",
      "successProbability": 80,
      "impactOnRisk": "significant-decrease",
      "script": "I'd like to propose modifying this clause because..."
    }
  ],
  "talkingPoints": ["point1", "point2"],
  "justifications": ["legal precedent", "industry standard"],
  "approach": "balanced",
  "priority": "important",
  "walkawayThreshold": "description of minimum acceptable terms",
  "industryStandard": "standard clause text",
  "estimatedSavings": "$X,000 - $Y,000",
  "timeEstimate": "1-2 negotiation rounds"
}`;

    try {
      const response = await generateText(prompt);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = parseJsonResponse<any>(response);

      return {
        clauseId: this.generateClauseId(clauseText),
        clauseText,
        currentRiskLevel: riskLevel,
        issues: data.issues || [],
        leverage: data.leverage || 'moderate',
        negotiability: data.negotiability || 50,
        alternatives: data.alternatives?.map((alt: any, idx: number) => ({
          id: `alt_${idx}`,
          ...alt,
        })) || [],
        counterProposals: data.counterProposals?.map((cp: any, idx: number) => ({
          id: `cp_${idx}`,
          ...cp,
        })) || [],
        talkingPoints: data.talkingPoints || [],
        justifications: data.justifications || [],
        approach: data.approach || 'balanced',
        priority: data.priority || 'important',
        walkawayThreshold: data.walkawayThreshold || 'Not specified',
        industryStandard: data.industryStandard || '',
        precedents: [], // Would be populated from database
        estimatedSavings: data.estimatedSavings,
        timeEstimate: data.timeEstimate || 'Unknown',
      };
    } catch (error) {
      console.error('Error generating negotiation strategy:', error);
      throw error;
    }
  }

  /**
   * Generate complete negotiation playbook for entire contract
   */
  async generatePlaybook(
    contractText: string,
    contractType: string,
    userRole: string,
    objectives: string[]
  ): Promise<NegotiationPlaybook> {
    const prompt = `You are an expert contract negotiation strategist. Create a comprehensive negotiation playbook for this contract.

Contract Type: ${contractType}
User Role: ${userRole}
Objectives: ${objectives.join(', ')}

Contract Text:
${contractText.substring(0, 5000)}...

Create a detailed negotiation playbook in JSON format with:
1. Clear title
2. Scenario description
3. Key objectives
4. Phase-by-phase strategies (Opening, Middle, Closing)
5. Specific tactics for each phase
6. Expected outcomes
7. Red lines (non-negotiable points)
8. Concession sequence (what to give up and when)
9. Closing strategies

Format as JSON:
{
  "title": "Playbook Title",
  "scenario": "description",
  "objectives": ["obj1", "obj2"],
  "strategies": [
    {
      "phase": "Opening",
      "tactics": ["tactic1", "tactic2"],
      "expectedOutcomes": ["outcome1"]
    }
  ],
  "redLines": ["red line 1", "red line 2"],
  "concessionSequence": [
    {
      "item": "payment terms",
      "value": "net 30 to net 45",
      "timing": "if they agree to liability cap"
    }
  ],
  "closingStrategies": ["strategy1", "strategy2"]
}`;

    try {
      const response = await generateText(prompt);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return parseJsonResponse<any>(response) as NegotiationPlaybook;
    } catch (error) {
      console.error('Error generating playbook:', error);
      throw error;
    }
  }

  /**
   * Analyze negotiation leverage and power dynamics
   */
  async analyzeLeverage(
    contractText: string,
    userRole: string,
    marketConditions?: string
  ): Promise<{
    overallLeverage: 'weak' | 'moderate' | 'strong';
    leverageFactors: Array<{
      factor: string;
      impact: 'positive' | 'negative' | 'neutral';
      strength: number;
      description: string;
    }>;
    recommendations: string[];
    powerDynamics: string;
  }> {
    const prompt = `Analyze the negotiation leverage in this contract.

User Role: ${userRole}
Market Conditions: ${marketConditions || 'Standard'}

Contract excerpt:
${contractText.substring(0, 3000)}

Analyze and provide JSON:
{
  "overallLeverage": "moderate",
  "leverageFactors": [
    {
      "factor": "Market position",
      "impact": "positive",
      "strength": 7,
      "description": "Strong market demand"
    }
  ],
  "recommendations": ["recommendation1", "recommendation2"],
  "powerDynamics": "Description of who has more power and why"
}`;

    try {
      const response = await generateText(prompt);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return parseJsonResponse<any>(response);
    } catch (error) {
      console.error('Error analyzing leverage:', error);
      throw error;
    }
  }

  /**
   * Generate email template for proposing changes
   */
  generateNegotiationEmail(
    recipientName: string,
    counterProposals: CounterProposal[],
    tone: 'formal' | 'friendly' | 'assertive'
  ): string {
    const toneMap = {
      formal: {
        greeting: 'Dear',
        opening: 'I hope this message finds you well.',
        closing: 'Best regards',
      },
      friendly: {
        greeting: 'Hi',
        opening: 'Thanks for sharing the contract!',
        closing: 'Thanks',
      },
      assertive: {
        greeting: 'Hello',
        opening: 'Thank you for the opportunity to review the contract.',
        closing: 'Regards',
      },
    };

    const style = toneMap[tone];
    
    let email = `${style.greeting} ${recipientName},\n\n`;
    email += `${style.opening}\n\n`;
    email += `I've reviewed the contract and have a few suggestions that I believe will make the agreement more balanced and mutually beneficial:\n\n`;

    counterProposals.forEach((proposal, index) => {
      email += `${index + 1}. **Proposed Change:**\n`;
      email += `   Current: "${proposal.originalText.substring(0, 100)}..."\n`;
      email += `   Proposed: "${proposal.proposedText.substring(0, 100)}..."\n`;
      email += `   Rationale: ${proposal.rationale}\n\n`;
    });

    email += `I believe these changes align with industry standards and create a fair agreement for both parties. `;
    email += `I'm happy to discuss these suggestions at your convenience.\n\n`;
    email += `${style.closing}`;

    return email;
  }

  /**
   * Track negotiation history and learn from outcomes
   */
  async recordNegotiationOutcome(
    clauseId: string,
    strategy: string,
    outcome: 'accepted' | 'modified' | 'rejected',
    notes: string
  ): Promise<void> {
    // This would store in database for future ML learning
    const record = {
      clauseId,
      strategy,
      outcome,
      notes,
      timestamp: new Date(),
    };
    
    // Would save to database
    console.log('Recording negotiation outcome:', record);
  }

  private generateClauseId(text: string): string {
    return `clause_${text.substring(0, 20).replace(/\W/g, '_')}_${Date.now()}`;
  }
}

// Utility functions

export function getPriorityColor(priority: string): string {
  const colors = {
    'must-have': 'text-red-600',
    'important': 'text-orange-600',
    'nice-to-have': 'text-yellow-600',
    'optional': 'text-gray-600',
  };
  return colors[priority as keyof typeof colors] || 'text-gray-600';
}

export function getLeverageIcon(leverage: string): string {
  const icons = {
    'weak': '📉',
    'moderate': '📊',
    'strong': '📈',
  };
  return icons[leverage as keyof typeof icons] || '📊';
}

export function formatSuccessProbability(probability: number): string {
  if (probability >= 80) return 'Very Likely';
  if (probability >= 60) return 'Likely';
  if (probability >= 40) return 'Moderate';
  if (probability >= 20) return 'Unlikely';
  return 'Very Unlikely';
}
