/**
 * Advanced Analytics and Insights Engine
 * 
 * Features:
 * - Predictive analytics
 * - Contract health monitoring
 * - Risk trending and forecasting
 * - Portfolio analysis
 * - Anomaly detection
 * - Business intelligence dashboards
 */

export interface ContractHealthScore {
  overall: number; // 0-100
  components: {
    legal: number;
    financial: number;
    operational: number;
    compliance: number;
    relationship: number;
  };
  trend: 'improving' | 'stable' | 'declining';
  alerts: HealthAlert[];
  recommendations: string[];
  nextReviewDate: Date;
}

export interface HealthAlert {
  severity: 'info' | 'warning' | 'critical';
  category: string;
  message: string;
  impact: string;
  action: string;
  deadline?: Date;
}

export interface PredictiveInsight {
  type: 'renewal_risk' | 'cost_overrun' | 'compliance_issue' | 'relationship_strain' | 'opportunity';
  probability: number; // 0-100
  confidence: number; // 0-100
  timeframe: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  indicators: string[];
  preventiveActions: string[];
  estimatedCost?: number;
}

export interface PortfolioMetrics {
  totalContracts: number;
  totalValue: number;
  averageHealth: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  byType: Record<string, number>;
  byIndustry: Record<string, number>;
  byStatus: Record<string, number>;
  topRisks: string[];
  upcomingRenewals: number;
  complianceRate: number;
}

export interface RiskTrend {
  metric: string;
  current: number;
  previous: number;
  change: number;
  percentChange: number;
  trend: 'up' | 'down' | 'stable';
  forecast: Array<{
    date: string;
    predicted: number;
    confidence: number;
  }>;
}

export interface ContractAnomaly {
  id: string;
  type: 'unusual_term' | 'outlier_value' | 'pattern_deviation' | 'compliance_gap';
  severity: 'low' | 'medium' | 'high';
  description: string;
  expectedValue: string;
  actualValue: string;
  deviation: number; // Standard deviations from mean
  impact: string;
  similarContracts: number;
  recommendation: string;
}

export interface BenchmarkComparison {
  metric: string;
  yourValue: number;
  industryAverage: number;
  topQuartile: number;
  bottomQuartile: number;
  percentile: number;
  gap: number;
  recommendation: string;
}

export class AdvancedAnalytics {
  /**
   * Calculate comprehensive contract health score
   */
  calculateHealthScore(contractData: {
    riskScore: number;
    complianceIssues: number;
    daysUntilRenewal: number;
    amendmentCount: number;
    disputeCount: number;
    performanceMetrics?: Record<string, number>;
  }): ContractHealthScore {
    // Legal health (40% weight)
    const legalScore = Math.max(0, 100 - contractData.riskScore);
    
    // Financial health (25% weight)
    const financialScore = this.calculateFinancialHealth(contractData.performanceMetrics);
    
    // Operational health (20% weight)
    const operationalScore = Math.max(0, 100 - (contractData.amendmentCount * 10));
    
    // Compliance health (10% weight)
    const complianceScore = Math.max(0, 100 - (contractData.complianceIssues * 20));
    
    // Relationship health (5% weight)
    const relationshipScore = Math.max(0, 100 - (contractData.disputeCount * 25));
    
    const overall = 
      legalScore * 0.4 +
      financialScore * 0.25 +
      operationalScore * 0.2 +
      complianceScore * 0.1 +
      relationshipScore * 0.05;

    const alerts: HealthAlert[] = [];
    
    // Generate alerts
    if (contractData.riskScore > 70) {
      alerts.push({
        severity: 'critical',
        category: 'Legal Risk',
        message: 'High-risk terms detected',
        impact: 'Significant liability exposure',
        action: 'Review and renegotiate risky clauses',
      });
    }
    
    if (contractData.daysUntilRenewal < 30) {
      alerts.push({
        severity: 'warning',
        category: 'Renewal',
        message: 'Contract renewal approaching',
        impact: 'Auto-renewal may occur',
        action: 'Review renewal terms and decide on continuation',
        deadline: new Date(Date.now() + contractData.daysUntilRenewal * 24 * 60 * 60 * 1000),
      });
    }
    
    if (contractData.complianceIssues > 0) {
      alerts.push({
        severity: contractData.complianceIssues > 2 ? 'critical' : 'warning',
        category: 'Compliance',
        message: `${contractData.complianceIssues} compliance issue(s) found`,
        impact: 'Regulatory risk and potential penalties',
        action: 'Address compliance gaps immediately',
      });
    }

    const recommendations: string[] = [];
    if (overall < 70) {
      recommendations.push('Schedule immediate contract review');
    }
    if (legalScore < 60) {
      recommendations.push('Consult legal counsel for risk mitigation');
    }
    if (complianceScore < 80) {
      recommendations.push('Conduct compliance audit');
    }

    return {
      overall: Math.round(overall),
      components: {
        legal: Math.round(legalScore),
        financial: Math.round(financialScore),
        operational: Math.round(operationalScore),
        compliance: Math.round(complianceScore),
        relationship: Math.round(relationshipScore),
      },
      trend: this.determineTrend(overall),
      alerts,
      recommendations,
      nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    };
  }

  /**
   * Generate predictive insights using historical patterns
   */
  generatePredictiveInsights(
    contractHistory: Array<{
      date: Date;
      riskScore: number;
      complianceIssues: number;
      costVariance: number;
      performanceScore: number;
    }>
  ): PredictiveInsight[] {
    const insights: PredictiveInsight[] = [];

    // Analyze risk trend
    const riskTrend = this.analyzeMetricTrend(
      contractHistory.map(h => h.riskScore)
    );
    
    if (riskTrend.isIncreasing && riskTrend.slope > 2) {
      insights.push({
        type: 'compliance_issue',
        probability: Math.min(95, 50 + riskTrend.slope * 10),
        confidence: 75,
        timeframe: '30-60 days',
        impact: riskTrend.slope > 5 ? 'high' : 'medium',
        description: 'Risk score is trending upward, indicating potential compliance issues',
        indicators: [
          'Increasing risk scores over past 90 days',
          'Pattern suggests systematic compliance gaps',
          'Similar contracts have experienced issues',
        ],
        preventiveActions: [
          'Conduct immediate compliance audit',
          'Review and update contract terms',
          'Implement monitoring controls',
        ],
      });
    }

    // Analyze cost variance
    const avgCostVariance = contractHistory.reduce((sum, h) => sum + h.costVariance, 0) / contractHistory.length;
    if (avgCostVariance > 10) {
      insights.push({
        type: 'cost_overrun',
        probability: Math.min(90, avgCostVariance * 5),
        confidence: 80,
        timeframe: 'Next quarter',
        impact: avgCostVariance > 20 ? 'critical' : 'high',
        description: 'Historical cost overruns suggest budget risk',
        indicators: [
          `Average cost variance: ${avgCostVariance.toFixed(1)}%`,
          'Trend indicates continued overspending',
          'Budget controls may be insufficient',
        ],
        preventiveActions: [
          'Review pricing structure',
          'Negotiate cost caps or limits',
          'Implement stricter budget controls',
        ],
        estimatedCost: avgCostVariance * 1000, // Placeholder calculation
      });
    }

    // Analyze performance trend
    const performanceTrend = this.analyzeMetricTrend(
      contractHistory.map(h => h.performanceScore)
    );
    
    if (performanceTrend.isDecreasing) {
      insights.push({
        type: 'relationship_strain',
        probability: 65,
        confidence: 70,
        timeframe: '60-90 days',
        impact: 'medium',
        description: 'Declining performance metrics may indicate relationship issues',
        indicators: [
          'Performance scores declining over time',
          'May lead to termination or non-renewal',
          'Service quality concerns emerging',
        ],
        preventiveActions: [
          'Schedule stakeholder meeting',
          'Review service level agreements',
          'Address performance gaps proactively',
        ],
      });
    }

    return insights;
  }

  /**
   * Analyze entire contract portfolio
   */
  analyzePortfolio(contracts: Array<{
    id: string;
    type: string;
    industry: string;
    value: number;
    riskScore: number;
    status: string;
    renewalDate?: Date;
    complianceRate: number;
  }>): PortfolioMetrics {
    const totalContracts = contracts.length;
    const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
    const averageHealth = contracts.reduce((sum, c) => sum + (100 - c.riskScore), 0) / totalContracts;

    const riskDistribution = {
      low: contracts.filter(c => c.riskScore < 30).length,
      medium: contracts.filter(c => c.riskScore >= 30 && c.riskScore < 60).length,
      high: contracts.filter(c => c.riskScore >= 60 && c.riskScore < 80).length,
      critical: contracts.filter(c => c.riskScore >= 80).length,
    };

    const byType: Record<string, number> = {};
    const byIndustry: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    for (const contract of contracts) {
      byType[contract.type] = (byType[contract.type] || 0) + 1;
      byIndustry[contract.industry] = (byIndustry[contract.industry] || 0) + 1;
      byStatus[contract.status] = (byStatus[contract.status] || 0) + 1;
    }

    // Find top risks
    const topRisks = contracts
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
      .map(c => `${c.type} - Risk Score: ${c.riskScore}`);

    // Count upcoming renewals (next 90 days)
    const ninetyDaysFromNow = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const upcomingRenewals = contracts.filter(c => 
      c.renewalDate && c.renewalDate <= ninetyDaysFromNow
    ).length;

    const avgComplianceRate = contracts.reduce((sum, c) => sum + c.complianceRate, 0) / totalContracts;

    return {
      totalContracts,
      totalValue,
      averageHealth: Math.round(averageHealth),
      riskDistribution,
      byType,
      byIndustry,
      byStatus,
      topRisks,
      upcomingRenewals,
      complianceRate: Math.round(avgComplianceRate),
    };
  }

  /**
   * Detect anomalies in contract terms
   */
  detectAnomalies(
    contract: any,
    similarContracts: any[]
  ): ContractAnomaly[] {
    const anomalies: ContractAnomaly[] = [];

    // Analyze payment terms
    if (contract.paymentTerms) {
      const paymentDays = this.extractPaymentDays(contract.paymentTerms);
      const avgPaymentDays = this.calculateAverage(
        similarContracts.map(c => this.extractPaymentDays(c.paymentTerms))
      );
      
      const deviation = Math.abs(paymentDays - avgPaymentDays) / this.calculateStdDev(
        similarContracts.map(c => this.extractPaymentDays(c.paymentTerms))
      );

      if (deviation > 2) {
        anomalies.push({
          id: `anomaly_payment_${Date.now()}`,
          type: 'outlier_value',
          severity: deviation > 3 ? 'high' : 'medium',
          description: 'Payment terms significantly differ from industry norm',
          expectedValue: `Net ${Math.round(avgPaymentDays)} days`,
          actualValue: `Net ${paymentDays} days`,
          deviation,
          impact: paymentDays > avgPaymentDays 
            ? 'Extended payment period may strain cash flow'
            : 'Shorter payment period may indicate unfavorable terms',
          similarContracts: similarContracts.length,
          recommendation: 'Review and align with industry standards',
        });
      }
    }

    // Analyze liability caps
    if (contract.liabilityCap) {
      const capAmount = this.parseMonetaryValue(contract.liabilityCap);
      const avgCap = this.calculateAverage(
        similarContracts.map(c => this.parseMonetaryValue(c.liabilityCap))
      );

      if (capAmount < avgCap * 0.5) {
        anomalies.push({
          id: `anomaly_liability_${Date.now()}`,
          type: 'unusual_term',
          severity: 'high',
          description: 'Liability cap is unusually low',
          expectedValue: `$${avgCap.toLocaleString()}`,
          actualValue: `$${capAmount.toLocaleString()}`,
          deviation: (avgCap - capAmount) / avgCap,
          impact: 'Insufficient protection against major losses',
          similarContracts: similarContracts.length,
          recommendation: 'Negotiate higher liability cap',
        });
      }
    }

    return anomalies;
  }

  /**
   * Generate risk forecast
   */
  forecastRisk(
    historicalData: Array<{ date: Date; riskScore: number }>,
    daysAhead: number = 90
  ): RiskTrend {
    const scores = historicalData.map(d => d.riskScore);
    const current = scores[scores.length - 1];
    const previous = scores[scores.length - 2] || current;
    
    const trend = this.analyzeMetricTrend(scores);
    
    // Simple linear projection
    const forecast: Array<{ date: string; predicted: number; confidence: number }> = [];
    for (let i = 1; i <= daysAhead; i += 10) {
      const predicted = current + (trend.slope * i / 10);
      const confidence = Math.max(20, 100 - (i / daysAhead) * 50); // Confidence decreases over time
      
      forecast.push({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predicted: Math.max(0, Math.min(100, predicted)),
        confidence: Math.round(confidence),
      });
    }

    return {
      metric: 'Risk Score',
      current,
      previous,
      change: current - previous,
      percentChange: ((current - previous) / previous) * 100,
      trend: current > previous ? 'up' : current < previous ? 'down' : 'stable',
      forecast,
    };
  }

  /**
   * Benchmark against industry standards
   */
  generateBenchmarks(
    contractMetrics: Record<string, number>,
    industryData: Record<string, { avg: number; topQuartile: number; bottomQuartile: number }>
  ): BenchmarkComparison[] {
    const comparisons: BenchmarkComparison[] = [];

    for (const [metric, value] of Object.entries(contractMetrics)) {
      const industry = industryData[metric];
      if (!industry) continue;

      const percentile = this.calculatePercentile(value, industry);
      const gap = value - industry.avg;

      comparisons.push({
        metric,
        yourValue: value,
        industryAverage: industry.avg,
        topQuartile: industry.topQuartile,
        bottomQuartile: industry.bottomQuartile,
        percentile,
        gap,
        recommendation: this.generateBenchmarkRecommendation(metric, percentile, gap),
      });
    }

    return comparisons;
  }

  // Private helper methods

  private calculateFinancialHealth(metrics?: Record<string, number>): number {
    if (!metrics) return 80; // Default score
    
    const costVariance = metrics.costVariance || 0;
    const paymentOnTime = metrics.paymentOnTime || 100;
    const budgetAdherence = metrics.budgetAdherence || 100;
    
    return (paymentOnTime + budgetAdherence - costVariance) / 2;
  }

  private determineTrend(score: number): 'improving' | 'stable' | 'declining' {
    // This would compare to historical scores
    // For now, use score ranges
    if (score >= 80) return 'stable';
    if (score >= 60) return 'stable';
    return 'declining';
  }

  private analyzeMetricTrend(values: number[]): {
    isIncreasing: boolean;
    isDecreasing: boolean;
    slope: number;
  } {
    if (values.length < 2) {
      return { isIncreasing: false, isDecreasing: false, slope: 0 };
    }

    // Simple linear regression
    const n = values.length;
    const xSum = (n * (n + 1)) / 2;
    const ySum = values.reduce((a, b) => a + b, 0);
    const xySum = values.reduce((sum, y, i) => sum + (i + 1) * y, 0);
    const x2Sum = (n * (n + 1) * (2 * n + 1)) / 6;

    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);

    return {
      isIncreasing: slope > 0.5,
      isDecreasing: slope < -0.5,
      slope,
    };
  }

  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private calculateStdDev(values: number[]): number {
    const avg = this.calculateAverage(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = this.calculateAverage(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }

  private extractPaymentDays(terms: string): number {
    const match = terms.match(/net\s+(\d+)/i);
    return match ? parseInt(match[1]) : 30;
  }

  private parseMonetaryValue(value: string): number {
    const match = value.match(/[\d,]+/);
    return match ? parseInt(match[0].replace(/,/g, '')) : 0;
  }

  private calculatePercentile(value: number, industry: any): number {
    if (value >= industry.topQuartile) return 75;
    if (value >= industry.avg) return 50;
    if (value >= industry.bottomQuartile) return 25;
    return 10;
  }

  private generateBenchmarkRecommendation(metric: string, percentile: number, gap: number): string {
    if (percentile >= 75) {
      return `Excellent - You're in the top quartile for ${metric}`;
    } else if (percentile >= 50) {
      return `Good - Above industry average for ${metric}`;
    } else {
      return `Opportunity - Consider improving ${metric} by ${Math.abs(gap).toFixed(1)} to reach industry average`;
    }
  }
}

// Utility functions for UI

export function getHealthColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

export function getHealthBadge(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

export function getTrendIcon(trend: string): string {
  const icons = {
    'improving': '📈',
    'stable': '➡️',
    'declining': '📉',
  };
  return icons[trend as keyof typeof icons] || '➡️';
}

export function formatProbability(probability: number): string {
  if (probability >= 80) return 'Very Likely';
  if (probability >= 60) return 'Likely';
  if (probability >= 40) return 'Possible';
  if (probability >= 20) return 'Unlikely';
  return 'Very Unlikely';
}
