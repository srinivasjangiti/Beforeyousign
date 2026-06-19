import { NextRequest, NextResponse } from 'next/server';
import { SmartTemplateBuilder, ClauseCategory } from '@/lib/smart-template-builder';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') as ClauseCategory | null;
    const search = searchParams.get('search');
    const industry = searchParams.get('industry');
    const riskLevel = searchParams.get('riskLevel');
    const minRating = searchParams.get('minRating');

    const builder = new SmartTemplateBuilder();

    if (search) {
      const clauses = builder.searchClauses(search, {
        industry: industry || undefined,
        riskLevel: riskLevel as any,
        minRating: minRating ? parseFloat(minRating) : undefined,
      });
      return NextResponse.json(clauses);
    }

    if (category) {
      const clauses = builder.getClausesByCategory(category);
      return NextResponse.json(clauses);
    }

    return NextResponse.json({ error: 'Category or search required' }, { status: 400 });
  } catch (error) {
    console.error('Clause library API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clauses' },
      { status: 500 }
    );
  }
}
