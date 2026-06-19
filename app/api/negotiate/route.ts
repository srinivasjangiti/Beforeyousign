import { NextRequest, NextResponse } from 'next/server';
import { generateNegotiationScript } from '@/lib/negotiation-scripts';
import { ContractClause } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clause, contractContext } = body as { 
      clause: ContractClause; 
      contractContext: string;
    };

    if (!clause || !contractContext) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const script = await generateNegotiationScript(clause, contractContext);

    return NextResponse.json({
      success: true,
      script,
    });
  } catch (error) {
    console.error('Error generating negotiation script:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate negotiation script' },
      { status: 500 }
    );
  }
}
