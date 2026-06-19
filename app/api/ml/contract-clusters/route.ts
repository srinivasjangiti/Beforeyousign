import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getEmbeddingsBatch } from '@/lib/ml/embeddings';
import { kMeans, euclideanDistance } from '@/lib/ml/clustering';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Fetch all contracts
    const contracts = await prisma.analyzedContract.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to avoid timeout on large DBs
    });

    if (contracts.length === 0) {
      return NextResponse.json({ clusters: [] });
    }

    // 2. Prepare text for embeddings
    // We use a blend of contract type and risk score for semantic context
    const textsToEmbed = contracts.map(c => 
      `Contract Type: ${c.contractType}. Risk Score: ${c.riskScore}. Clauses: ${c.clausesCount}. Red Flags: ${c.redFlagsCount}.`
    );

    // 3. Generate embeddings
    const embeddings = await getEmbeddingsBatch(textsToEmbed);

    // 4. Cluster using K-Means
    // Use k=3 or fewer if there are very few contracts
    const k = Math.min(3, contracts.length);
    const rawClusters = kMeans(embeddings, k);

    // 5. Format output
    const clusters = rawClusters.map(cluster => {
      const clusterContracts = cluster.items.map(idx => ({
        id: contracts[idx].id,
        fileName: contracts[idx].fileName,
        contractType: contracts[idx].contractType,
        riskScore: contracts[idx].riskScore
      }));

      // Infer cluster name from majority contract type
      const typeCounts = new Map<string, number>();
      clusterContracts.forEach(c => {
        const cType = c.contractType || "Unknown";
        typeCounts.set(cType, (typeCounts.get(cType) || 0) + 1);
      });
      let primaryType = 'Mixed Documents';
      let maxCount = 0;
      typeCounts.forEach((count, type) => {
        if (count > maxCount) {
          maxCount = count;
          primaryType = type;
        }
      });

      return {
        id: cluster.id,
        name: `Cluster: ${primaryType}`,
        contracts: clusterContracts
      };
    });

    // Clean out empty clusters
    const activeClusters = clusters.filter(c => c.contracts.length > 0);

    return NextResponse.json({ success: true, clusters: activeClusters });
  } catch (error) {
    console.error('Error clustering contracts:', error);
    return NextResponse.json({ success: false, error: 'Failed to cluster contracts' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
