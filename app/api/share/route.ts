import { NextRequest, NextResponse } from 'next/server';
import { createShareableLink } from '@/lib/share-links';
import { ContractAnalysis } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysis, expiresInDays, password } = body;

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis data is required' },
        { status: 400 }
      );
    }

    const shareId = createShareableLink(
      analysis as ContractAnalysis,
      expiresInDays || 7,
      password
    );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    request.headers.get('origin') || 
                    'http://localhost:3000';

    const shareUrl = `${baseUrl}/share/${shareId}`;

    return NextResponse.json({
      success: true,
      shareId,
      shareUrl,
      expiresInDays: expiresInDays || 7,
    });
  } catch (error) {
    console.error('Share link creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create share link' },
      { status: 500 }
    );
  }
}
