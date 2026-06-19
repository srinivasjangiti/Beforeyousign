import { NextRequest, NextResponse } from 'next/server';
import { SmartTemplateBuilder, TemplateBuilder } from '@/lib/smart-template-builder';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, template, ...data } = body;

    const builder = new SmartTemplateBuilder();

    switch (action) {
      case 'recommendations': {
        const { contractType, industry, userRole, riskTolerance } = data;
        const result = await builder.getRecommendations(
          template,
          { contractType, industry, userRole, riskTolerance }
        );
        return NextResponse.json(result);
      }

      case 'incompatibilities': {
        const clauseIds = data.clauseIds || [];
        const result = builder.detectIncompatibilities(clauseIds);
        return NextResponse.json(result);
      }

      case 'completeness': {
        const result = builder.calculateCompleteness(template);
        return NextResponse.json(result);
      }

      case 'compile': {
        const result = await builder.compileTemplate(template);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Template builder API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
