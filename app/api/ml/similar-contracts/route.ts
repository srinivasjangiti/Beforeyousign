import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getContractEmbedding, computeSemanticSimilarity } from '@/lib/ml/portfolio-similarity';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { contractId, limit = 3 } = await request.json();
    
    if (!contractId) {
      return NextResponse.json({ error: 'contractId is required' }, { status: 400 });
    }

    // Fetch all analyzed contracts for the portfolio
    const allContracts = await prisma.analyzedContract.findMany({
      select: {
        id: true,
        fileName: true,
        contractType: true,
        riskScore: true,
        redFlagsCount: true,
        clausesCount: true,
        createdAt: true,
        summary: true
      }
    });

    if (allContracts.length <= 1) {
      return NextResponse.json({ success: true, results: [] });
    }

    const target = allContracts.find(c => c.id === contractId);
    if (!target) {
      return NextResponse.json({ error: 'Target contract not found' }, { status: 404 });
    }

    // Generate/fetch semantic embedding on demand
    const targetVector = await getContractEmbedding(target.id, target.summary);
    
    const candidates = allContracts.filter(c => c.id !== contractId);
    
    // Compute distance and build results using Promise.all to fetch embeddings in parallel
    const resultsPromises = candidates.map(async contract => {
      const vector = await getContractEmbedding(contract.id, contract.summary);
      const similarityScore = computeSemanticSimilarity(targetVector, vector);
      
      // Generate explainability reasons based on Semantic Proximity + Metadata Fallbacks
      const reasons: string[] = [];
      if (similarityScore >= 80) {
        reasons.push('High semantic alignment in executive summary');
      } else if (similarityScore >= 60) {
        reasons.push('Moderate semantic overlap in contractual language');
      } else {
        reasons.push('Broad thematic similarity');
      }
      
      if (target.contractType && target.contractType !== 'Unknown' && target.contractType === contract.contractType) {
        reasons.push(`Same identified contract type (${target.contractType})`);
      }
      if (Math.abs(target.riskScore - contract.riskScore) <= 15) {
        reasons.push('Similar overall risk profile');
      }

      return {
        id: contract.id,
        fileName: contract.fileName,
        similarityScore,
        reasons
      };
    });

    const unsortedResults = await Promise.all(resultsPromises);
    const results = unsortedResults
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error in similar-contracts API:', error);
    return NextResponse.json({ success: false, error: 'Failed to compute semantic portfolio neighbors' }, { status: 500 });
  }
}
