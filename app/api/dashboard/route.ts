import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all for complex aggregations
    const allContracts = await prisma.analyzedContract.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    const total = allContracts.length;

    let highRiskCount = 0;
    let mediumRiskCount = 0;
    let lowRiskCount = 0;
    
    const typeDistribution: Record<string, number> = {};
    const monthlyData: Record<string, number> = {};
    const riskTrendMap: Record<string, { label: string, totalScore: number, count: number }> = {};
    let totalRedFlags = 0;

    allContracts.forEach(c => {
      // Risk Distribution
      if (c.riskScore >= 70) highRiskCount++;
      else if (c.riskScore >= 40) mediumRiskCount++;
      else lowRiskCount++;

      // Contract Types
      const type = c.contractType || 'Unknown';
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;

      // Monthly Volume & Risk Trends
      const date = new Date(c.createdAt);
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
      
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!riskTrendMap[monthKey]) {
         riskTrendMap[monthKey] = { label: monthYear, totalScore: 0, count: 0 };
      }
      riskTrendMap[monthKey].totalScore += c.riskScore;
      riskTrendMap[monthKey].count += 1;

      // Total Red Flags
      totalRedFlags += c.redFlagsCount;
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyAnalyzed = allContracts.filter(c => new Date(c.createdAt) >= sevenDaysAgo).length;

    // Portfolio Health Score
    const avgRisk = total > 0 ? allContracts.reduce((acc, c) => acc + c.riskScore, 0) / total : 0;
    const healthScore = total > 0 ? Math.round(100 - avgRisk) : 100;

    // Highest Risk Contracts
    const highestRiskContracts = [...allContracts].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5).map(c => ({
      id: c.id,
      name: c.fileName,
      riskScore: c.riskScore,
      type: c.contractType || 'Unknown',
      date: c.createdAt
    }));

    // Format distributions for frontend
    const riskDistribution = [
      { name: 'High Risk', value: highRiskCount, color: '#ef4444' },
      { name: 'Medium Risk', value: mediumRiskCount, color: '#f59e0b' },
      { name: 'Low Risk', value: lowRiskCount, color: '#10b981' }
    ];

    const contractTypes = Object.entries(typeDistribution)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 types

    const monthlyVolume = Object.entries(monthlyData)
      .map(([name, value]) => ({ name, value }))
      .reverse(); // Chronological if it was desc, wait it's a map. Actually let's just send it.

    // Recent Activity Feed
    const activities = allContracts.slice(0, 5).map(record => ({
      id: record.id,
      type: 'analyze',
      title: `${record.fileName} Analyzed`,
      description: `Risk Score: ${record.riskScore}/100. ${record.redFlagsCount} red flags detected.`,
      timestamp: record.createdAt,
      status: record.riskScore >= 70 ? 'warning' : 'completed'
    }));

    const riskTrends = Object.entries(riskTrendMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([_, data]) => ({
         month: data.label,
         score: Math.round(data.totalScore / data.count)
      }));

    return NextResponse.json({
      success: true,
      summary: {
        total,
        pending: 0,
        expiringSoon: 0,
        highRisk: highRiskCount,
        recentlyAnalyzed,
        totalRedFlags
      },
      healthScore,
      riskDistribution,
      contractTypes,
      monthlyVolume,
      highestRiskContracts,
      activities,
      riskTrends
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
