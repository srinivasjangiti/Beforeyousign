import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { euclideanDistance } from '@/lib/ml/clustering';

const prisma = new PrismaClient();

// Normalization function to ensure features are roughly on the same scale (0-1)
function normalizeMetadata(risk: number, redFlags: number, clauses: number) {
  return [
    risk / 100,           // Risk is 0-100
    Math.min(redFlags / 20, 1), // Assume 20 red flags is max
    Math.min(clauses / 50, 1)   // Assume 50 clauses is max
  ];
}

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
        createdAt: true
      }
    });

    if (allContracts.length <= 1) {
      return NextResponse.json({ success: true, results: [] });
    }

    const target = allContracts.find(c => c.id === contractId);
    if (!target) {
      return NextResponse.json({ error: 'Target contract not found' }, { status: 404 });
    }

    const targetVector = normalizeMetadata(target.riskScore, target.redFlagsCount, target.clausesCount);
    
    // Compute distance and build results
    const results = allContracts
      .filter(c => c.id !== contractId)
      .map(contract => {
        const vector = normalizeMetadata(contract.riskScore, contract.redFlagsCount, contract.clausesCount);
        const distance = euclideanDistance(targetVector, vector);
        
        // Convert distance (0 to ~1.73) to a similarity percentage (0-100)
        // Max theoretical distance is sqrt(1^2 + 1^2 + 1^2) = 1.732
        const maxDist = Math.sqrt(3);
        const similarityScore = Math.max(0, Math.round((1 - (distance / maxDist)) * 100));

        // Generate explainability reasons based on Euclidean feature proximity
        const reasons: string[] = [];
        if (Math.abs(target.riskScore - contract.riskScore) <= 15) {
          reasons.push('Similar overall risk profile');
        }
        if (Math.abs(target.redFlagsCount - contract.redFlagsCount) <= 3) {
          reasons.push('Similar red flag density');
        }
        if (Math.abs(target.clausesCount - contract.clausesCount) <= 10) {
          reasons.push('Similar structural complexity (clause count)');
        }
        if (target.contractType && target.contractType !== 'Unknown' && target.contractType === contract.contractType) {
          reasons.push(`Same identified contract type (${target.contractType})`);
        }
        if (reasons.length === 0) {
          reasons.push('Broad portfolio metadata alignment');
        }

        return {
          id: contract.id,
          fileName: contract.fileName,
          similarityScore,
          reasons
        };
      })
      .sort((a, b) => b.similarityScore - a.similarityScore)
      .slice(0, limit);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Error in similar-contracts API:', error);
    return NextResponse.json({ success: false, error: 'Failed to compute portfolio neighbors' }, { status: 500 });
  }
}
