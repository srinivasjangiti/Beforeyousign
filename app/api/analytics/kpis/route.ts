import { NextRequest, NextResponse } from 'next/server';
import { BusinessIntelligenceEngine } from '@/lib/business-intelligence';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { contracts } = body;

    if (!contracts || !Array.isArray(contracts)) {
      return NextResponse.json({ error: 'Contracts array required' }, { status: 400 });
    }

    const engine = new BusinessIntelligenceEngine();
    const kpis = await engine.generateExecutiveKPIs(contracts);

    return NextResponse.json(kpis);
  } catch (error) {
    console.error('KPIs API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate KPIs' },
      { status: 500 }
    );
  }
}
