import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Fetch total contracts
    const total = await prisma.analyzedContract.count();

    // 2. Fetch high risk contracts (score >= 70)
    const highRisk = await prisma.analyzedContract.count({
      where: {
        riskScore: {
          gte: 70
        }
      }
    });

    // 3. Fetch recently analyzed (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentlyAnalyzed = await prisma.analyzedContract.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });

    // 4. Calculate Portfolio Health Score
    // Health is 100 - average risk score. If 0 contracts, default to 100.
    const aggregations = await prisma.analyzedContract.aggregate({
      _avg: {
        riskScore: true
      }
    });
    
    const avgRisk = aggregations._avg.riskScore || 0;
    const healthScore = total > 0 ? Math.round(100 - avgRisk) : 100;

    // 5. Fetch Recent Activity Feed (latest 5)
    const recentRecords = await prisma.analyzedContract.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const activities = recentRecords.map(record => ({
      id: record.id,
      type: 'analyze',
      title: `${record.fileName} Analyzed`,
      description: `Risk Score: ${record.riskScore}/100. ${record.redFlagsCount} red flags detected.`,
      timestamp: record.createdAt,
      status: record.riskScore >= 70 ? 'warning' : 'completed'
    }));

    return NextResponse.json({
      success: true,
      summary: {
        total,
        pending: 0, // Mocked for MVP
        expiringSoon: 0, // Mocked for MVP
        highRisk,
        recentlyAnalyzed
      },
      healthScore,
      activities
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
