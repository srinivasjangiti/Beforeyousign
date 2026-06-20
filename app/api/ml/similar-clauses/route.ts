import { NextResponse } from 'next/server';
import { findSimilarClause } from '@/lib/ml/retrieval';

export async function POST(request: Request) {
  try {
    const { text, topK = 3 } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const retrievalResponse = await findSimilarClause(text, topK);
    
    return NextResponse.json({ 
      success: true, 
      results: retrievalResponse.results,
      predictedCategory: retrievalResponse.predictedCategory,
      confidence: retrievalResponse.confidence
    });
  } catch (error) {
    console.error('Error in semantic search API:', error);
    return NextResponse.json({ success: false, error: 'Semantic search failed' }, { status: 500 });
  }
}
