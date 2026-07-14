/**
 * Real-Time Negotiation Assistant API
 * 
 * Provides live negotiation support:
 * - Counter-clause generation
 * - Position strength analysis
 * - Success probability predictions
 * - Tactical recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateText, parseJsonResponse } from '@/lib/nvidia-client';

export interface NegotiationRequest {
  contractText: string;
  clause: string;
  currentPosition: string;
  desiredOutcome?: string;
  context?: {
    industry?: string;
    relationshipImportance?: 'low' | 'medium' | 'high';
    timeframe?: string;
    alternatives?: string[];
  };
}

export interface NegotiationResponse {
  analysis: {
    currentStrength: 'weak' | 'moderate' | 'strong';
    leveragePoints: string[];
    risks: string[];
    opportunities: string[];
  };
  recommendations: Array<{
    strategy: string;
    counterProposal: string;
    justification: string;
    successProbability: number;
    expectedPushback: string;
    responseScript: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  tacticalAdvice: {
    timing: string;
    tone: string;
    concessions: string[];
    redLines: string[];
    walkawayPoint: string;
  };
  alternativeLanguage: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: NegotiationRequest = await req.json();
    
    if (!body.contractText || !body.clause) {
      return NextResponse.json(
        { error: 'Contract text and clause are required' },
        { status: 400 }
      );
    }

    const prompt = buildNegotiationPrompt(body);
    const response = await generateText(prompt, undefined, 0.7, 4096);
    const negotiationAdvice = parseNegotiationResponse(response);

    return NextResponse.json(negotiationAdvice);
  } catch (error) {
    console.error('[Negotiation Assistant Error]', error);
    return NextResponse.json(
      { error: 'Failed to generate negotiation advice' },
      { status: 500 }
    );
  }
}

function buildNegotiationPrompt(request: NegotiationRequest): string {
  const { contractText, clause, currentPosition, desiredOutcome, context } = request;

  return `You are an expert contract negotiation strategist with 25+ years of experience in high-stakes business negotiations.

CONTEXT:
${context?.industry ? `Industry: ${context.industry}` : ''}
${context?.relationshipImportance ? `Relationship Importance: ${context.relationshipImportance}` : ''}
${context?.timeframe ? `Timeframe: ${context.timeframe}` : ''}

FULL CONTRACT (for context):
${contractText.substring(0, 3000)}...

SPECIFIC CLAUSE TO NEGOTIATE:
${clause}

CURRENT POSITION:
${currentPosition}

${desiredOutcome ? `DESIRED OUTCOME:\n${desiredOutcome}\n` : ''}

${context?.alternatives?.length ? `ALTERNATIVES:\n${context.alternatives.join('\n')}\n` : ''}

Provide comprehensive negotiation guidance:

1. **Position Analysis**
   - Assess current negotiating strength
   - Identify leverage points
   - Highlight risks and opportunities

2. **Tactical Recommendations** (Provide 3-5 options, ranked by success probability)
   - Specific counter-proposal language
   - Legal/business justification
   - Expected pushback and how to handle it
   - Success probability (0-100%)
   - Ready-to-use response scripts

3. **Strategy**
   - Optimal timing for this negotiation point
   - Recommended tone (collaborative, firm, etc.)
   - Potential concessions to offer
   - Absolute red lines
   - Walk-away conditions

4. **Alternative Language** (3-5 options)
   - Provide complete clause rewrites that achieve desired outcome
   - Vary from conservative to aggressive

Be practical, specific, and actionable. Focus on win-win outcomes when possible, but protect user's interests.

Respond in JSON format:
{
  "analysis": {
    "currentStrength": "weak|moderate|strong",
    "leveragePoints": ["string"],
    "risks": ["string"],
    "opportunities": ["string"]
  },
  "recommendations": [
    {
      "strategy": "string",
      "counterProposal": "string",
      "justification": "string",
      "successProbability": number,
      "expectedPushback": "string",
      "responseScript": "string",
      "priority": "low|medium|high"
    }
  ],
  "tacticalAdvice": {
    "timing": "string",
    "tone": "string",
    "concessions": ["string"],
    "redLines": ["string"],
    "walkawayPoint": "string"
  },
  "alternativeLanguage": ["string"]
}`;
}

function parseNegotiationResponse(response: string): NegotiationResponse {
  try {
    return parseJsonResponse<NegotiationResponse>(response);
  } catch (error) {
    console.error('[Parse Error]', error);
    
    // Fallback response
    return {
      analysis: {
        currentStrength: 'moderate',
        leveragePoints: ['Standard industry practices', 'Mutual benefit'],
        risks: ['Relationship strain', 'Deal falling through'],
        opportunities: ['Win-win outcome', 'Long-term partnership'],
      },
      recommendations: [
        {
          strategy: 'Collaborative Approach',
          counterProposal: 'Suggest mutual review and modification',
          justification: 'Maintains relationship while addressing concerns',
          successProbability: 70,
          expectedPushback: 'Initial resistance to change',
          responseScript: 'I understand your position. Could we explore a middle ground that addresses both our concerns?',
          priority: 'high',
        },
      ],
      tacticalAdvice: {
        timing: 'Early in negotiation process',
        tone: 'Professional and collaborative',
        concessions: ['Minor terms', 'Timeline flexibility'],
        redLines: ['Core business interests', 'Legal compliance'],
        walkawayPoint: 'If fundamental rights are not protected',
      },
      alternativeLanguage: ['See detailed analysis for specific recommendations'],
    };
  }
}
