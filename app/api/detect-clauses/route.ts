import { NextRequest, NextResponse } from 'next/server';
import { generateText, NVIDIA_MODELS } from '@/lib/nvidia-client';

export const runtime = 'nodejs';
export const maxDuration = 45;

interface DetectedClause {
  id: string;
  text: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  plainLanguage: string;
  concerns: string[];
  suggestion: string;
  startIndex: number;
  endIndex: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    // Hard limit for extension use (faster turnaround)
    const truncatedText = text.slice(0, 8000);

    const prompt = buildDetectionPrompt(truncatedText);
    const response = await generateText(prompt, NVIDIA_MODELS.primary, 0.2, 4096);

    if (!response) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // Parse the JSON response
    let parsed: { clauses: DetectedClause[] };
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    // Attach real character indices from the original text
    const clauses = (parsed.clauses || []).map((clause, i) => {
      const idx = truncatedText.indexOf(clause.text.slice(0, 60));
      return {
        ...clause,
        id: clause.id || `clause_${i}`,
        startIndex: idx === -1 ? 0 : idx,
        endIndex: idx === -1 ? clause.text.length : idx + clause.text.length,
      };
    });

    // Sort by startIndex for ordered display
    clauses.sort((a, b) => a.startIndex - b.startIndex);

    const riskSummary = {
      total: clauses.length,
      critical: clauses.filter(c => c.riskLevel === 'critical').length,
      high: clauses.filter(c => c.riskLevel === 'high').length,
      medium: clauses.filter(c => c.riskLevel === 'medium').length,
      low: clauses.filter(c => c.riskLevel === 'low').length,
      overallRisk: computeOverallRisk(clauses),
    };

    return NextResponse.json({ success: true, clauses, riskSummary });
  } catch (error) {
    console.error('[detect-clauses] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function computeOverallRisk(clauses: DetectedClause[]): number {
  if (clauses.length === 0) return 0;
  const weights = { critical: 40, high: 20, medium: 8, low: 2 };
  const total = clauses.reduce((sum, c) => sum + (weights[c.riskLevel] || 0), 0);
  return Math.min(100, total);
}

function buildDetectionPrompt(text: string): string {
  return `You are a contract risk detector. Analyze the following text and identify risky or problematic legal clauses.

TEXT TO ANALYZE:
${text}

Your job: find all clauses or phrases that represent legal risks. Focus on:
- Indemnification / liability clauses
- Non-compete / non-solicitation restrictions
- IP ownership transfers
- Auto-renewal traps
- Termination restrictions
- Arbitration / dispute resolution
- Unilateral amendment rights
- Limitation of liability
- Penalty / liquidated damages clauses
- Confidentiality overreach

For each risky clause found, return:
- The EXACT verbatim text snippet (15-100 words) from the document
- Risk level: critical / high / medium / low
- Category: indemnification / non_compete / ip_transfer / auto_renewal / termination / arbitration / amendment / liability / penalty / confidentiality / payment / general
- A plain-language explanation (1-2 sentences, for a non-lawyer)
- 1-2 specific concerns
- A brief suggestion for improvement

Return ONLY this JSON (no markdown):
{
  "clauses": [
    {
      "id": "clause_0",
      "text": "exact verbatim snippet from the document",
      "riskLevel": "critical|high|medium|low",
      "category": "category_name",
      "plainLanguage": "what this means in simple terms",
      "concerns": ["concern 1", "concern 2"],
      "suggestion": "how to make this fairer"
    }
  ]
}

Return an empty clauses array if no risks are found. Return ONLY the JSON.`;
}
