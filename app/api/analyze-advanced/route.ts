/**
 * Advanced Analysis API Endpoint
 * 
 * Uses the multi-model AI engine for comprehensive contract analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { AdvancedAnalyzer } from '@/lib/advanced-analyzer';

export const runtime = 'edge';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractText, contractType, industry, jurisdiction } = body;

    if (!contractText) {
      return NextResponse.json(
        { error: 'Contract text is required' },
        { status: 400 }
      );
    }

    // Initialize advanced analyzer (uses NVIDIA_API_KEY internally)
    const analyzer = new AdvancedAnalyzer();

    // Run comprehensive analysis
    const result = await analyzer.analyzeContract(
      contractText,
      contractType || 'general',
    );

    return NextResponse.json({
      success: true,
      analysis: result,
      metadata: {
        timestamp: new Date().toISOString(),
        analysisType: 'advanced',
        model: 'multi-model',
      },
    });
  } catch (error: any) {
    console.error('Advanced analysis error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Analysis failed',
        message: error.message,
      },
      { status: 500 }
    );
  }
}

// GET endpoint for checking service status
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'operational',
    service: 'advanced-analysis',
    features: [
      'multi-model-ai',
      'risk-prediction',
      'compliance-checking',
      'financial-analysis',
      'benchmarking',
      'negotiation-insights',
      'ml-pattern-detection',
    ],
    timestamp: new Date().toISOString(),
  });
}
