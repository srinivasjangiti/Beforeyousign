import { NextRequest, NextResponse } from 'next/server';
import { getSharedAnalysis } from '@/lib/share-links';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ shareId: string }> }
) {
  try {
    const { shareId } = await params;
    const body = await request.json();
    const { password } = body;

    const analysis = getSharedAnalysis(shareId, password);

    if (!analysis) {
      // Check if it's a password issue or expired/not found
      const testAnalysis = getSharedAnalysis(shareId);
      if (testAnalysis === null && password === undefined) {
        return NextResponse.json(
          { success: false, error: 'Analysis not found or expired' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { success: false, error: 'Invalid password', passwordRequired: true },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error('Share retrieval error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve shared analysis' },
      { status: 500 }
    );
  }
}
