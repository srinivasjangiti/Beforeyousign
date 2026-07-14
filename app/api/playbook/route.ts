import { NextRequest, NextResponse } from 'next/server';
import { generateNegotiationPlaybook } from '@/lib/negotiation-scripts';
import { ContractAnalysis } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysis } = body as { analysis: ContractAnalysis };

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: 'Missing analysis data' },
        { status: 400 }
      );
    }

    const contractContext = `
Contract: ${analysis.metadata.fileName}
Risk Score: ${analysis.riskScore}/100
Total Clauses: ${analysis.clauses.length}
Red Flags: ${analysis.redFlags.length}
`;

    const playbook = await generateNegotiationPlaybook(
      analysis.clauses,
      contractContext,
      analysis.metadata.fileName
    );

    return NextResponse.json({
      success: true,
      playbook,
    });
  } catch (error) {
    console.error('Error generating negotiation playbook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate negotiation playbook' },
      { status: 500 }
    );
  }
}
