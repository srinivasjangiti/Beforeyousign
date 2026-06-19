/**
 * Contract Performance Analytics - REVOLUTIONARY
 * Track which contracts perform best and which clauses cause problems
 * Data-driven insights NO COMPETITOR PROVIDES
 */

export interface ContractPerformance {
  contractId: string;
  contractType: string;
  performanceScore: number; // 0-100
  metrics: {
    onTimeDelivery: number;
    paymentTimeliness: number;
    disputeCount: number;
    amendmentCount: number;
    renewalRate: number;
    satisfactionScore: number;
  };
  financialImpact: {
    revenue: number;
    costs: number;
    profitMargin: number;
    latePaymentCosts: number;
    disputeCosts: number;
  };
  clausePerformance: ClausePerformance[];
  timeline: PerformanceEvent[];
}

export interface ClausePerformance {
  clauseType: string;
  clauseText: string;
  disputes: number;
  amendments: number;
  breaches: number;
  performanceImpact: 'positive' | 'neutral' | 'negative';
  score: number;
  recommendation: string;
}

export interface PerformanceEvent {
  date: Date;
  type: 'execution' | 'payment' | 'delivery' | 'dispute' | 'amendment' | 'renewal' | 'termination';
  description: string;
  impact: number; // -100 to +100
}

export interface BenchmarkComparison {
  yourPerformance: number;
  industryAverage: number;
  topPercentile: number;
  bottomPercentile: number;
  ranking: number; // Your percentile ranking
  gap: number; // Difference from industry average
}

export interface PortfolioAnalytics {
  totalContracts: number;
  activeContracts: number;
  totalValue: number;
  averagePerformance: number;
  topPerformers: ContractPerformance[];
  bottomPerformers: ContractPerformance[];
  riskExposure: {
    total: number;
    byCategory: Record<string, number>;
  };
  recommendations: Array<{
    priority: 'critical' | 'high' | 'medium' | 'low';
    action: string;
    expectedImpact: number;
    affectedContracts: number;
  }>;
}

class ContractPerformanceAnalytics {
  private performanceData: Map<string, ContractPerformance> = new Map();

  /**
   * Track contract performance over time
   */
  async trackPerformance(
    contractId: string,
    event: PerformanceEvent
  ): Promise<void> {
    let performance = this.performanceData.get(contractId);
    
    if (!performance) {
      performance = this.initializePerformance(contractId);
    }

    performance.timeline.push(event);
    this.updateMetrics(performance, event);
    this.updatePerformanceScore(performance);

    this.performanceData.set(contractId, performance);
  }

  /**
   * Analyze contract performance
   */
  async analyzePerformance(contractId: string): Promise<ContractPerformance> {
    const performance = this.performanceData.get(contractId);
    
    if (!performance) {
      throw new Error('No performance data available for this contract');
    }

    return performance;
  }

  /**
   * Compare against industry benchmarks
   */
  async benchmarkAgainstIndustry(
    contractId: string,
    industry: string
  ): Promise<BenchmarkComparison> {
    const performance = this.performanceData.get(contractId);
    
    if (!performance) {
      throw new Error('No performance data available');
    }

    // Simulated industry benchmarks (would come from database in production)
    const industryData = this.getIndustryBenchmarks(industry);

    const ranking = this.calculatePercentileRanking(
      performance.performanceScore,
      industryData
    );

    return {
      yourPerformance: performance.performanceScore,
      industryAverage: industryData.average,
      topPercentile: industryData.top10,
      bottomPercentile: industryData.bottom10,
      ranking,
      gap: performance.performanceScore - industryData.average,
    };
  }

  /**
   * Analyze clause performance across contracts
   */
  async analyzeClauseEffectiveness(
    clauseType: string
  ): Promise<{
    totalContracts: number;
    averagePerformance: number;
    disputeRate: number;
    amendmentRate: number;
    bestPractice: string;
    worstPractice: string;
    improvement: string;
  }> {
    const relevantContracts = Array.from(this.performanceData.values())
      .filter(p => p.clausePerformance.some(c => c.clauseType === clauseType));

    const clauseData = relevantContracts.flatMap(p => 
      p.clausePerformance.filter(c => c.clauseType === clauseType)
    );

    const avgPerformance = clauseData.reduce((sum, c) => sum + c.score, 0) / clauseData.length;
    const disputeRate = (clauseData.reduce((sum, c) => sum + c.disputes, 0) / clauseData.length) * 100;
    const amendmentRate = (clauseData.reduce((sum, c) => sum + c.amendments, 0) / clauseData.length) * 100;

    // Find best and worst performers
    const sorted = clauseData.sort((a, b) => b.score - a.score);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];

    return {
      totalContracts: relevantContracts.length,
      averagePerformance: Math.round(avgPerformance),
      disputeRate: Math.round(disputeRate),
      amendmentRate: Math.round(amendmentRate),
      bestPractice: best?.clauseText || 'None available',
      worstPractice: worst?.clauseText || 'None available',
      improvement: this.generateClauseImprovement(clauseType, avgPerformance),
    };
  }

  /**
   * Portfolio-level analytics
   */
  async analyzePortfolio(): Promise<PortfolioAnalytics> {
    const allContracts = Array.from(this.performanceData.values());
    const activeContracts = allContracts.filter(c => this.isActive(c));

    const totalValue = allContracts.reduce((sum, c) => sum + c.financialImpact.revenue, 0);
    const avgPerformance = allContracts.reduce((sum, c) => sum + c.performanceScore, 0) / allContracts.length;

    const sorted = [...allContracts].sort((a, b) => b.performanceScore - a.performanceScore);
    const topPerformers = sorted.slice(0, 10);
    const bottomPerformers = sorted.slice(-10).reverse();

    const riskExposure = this.calculateRiskExposure(allContracts);
    const recommendations = this.generatePortfolioRecommendations(allContracts);

    return {
      totalContracts: allContracts.length,
      activeContracts: activeContracts.length,
      totalValue,
      averagePerformance: Math.round(avgPerformance),
      topPerformers,
      bottomPerformers,
      riskExposure,
      recommendations,
    };
  }

  /**
   * Predict future performance
   */
  async predictFuturePerformance(
    contractId: string,
    monthsAhead: number
  ): Promise<{
    predictedScore: number;
    confidence: number;
    risks: string[];
    opportunities: string[];
  }> {
    const performance = this.performanceData.get(contractId);
    
    if (!performance) {
      throw new Error('No performance data available');
    }

    // Analyze trends
    const recentEvents = performance.timeline.slice(-10);
    const trend = this.calculateTrend(recentEvents);

    // Project forward
    const predictedScore = Math.max(0, Math.min(100, 
      performance.performanceScore + (trend * monthsAhead)
    ));

    const confidence = Math.max(50, 90 - (monthsAhead * 5)); // Confidence decreases with time

    return {
      predictedScore: Math.round(predictedScore),
      confidence,
      risks: this.identifyFutureRisks(performance, trend),
      opportunities: this.identifyOpportunities(performance, trend),
    };
  }

  /**
   * Generate performance report
   */
  async generateReport(contractId: string): Promise<{
    summary: string;
    keyFindings: string[];
    strengths: string[];
    weaknesses: string[];
    actionItems: Array<{ action: string; impact: string; effort: string }>;
  }> {
    const performance = this.performanceData.get(contractId);
    
    if (!performance) {
      throw new Error('No performance data available');
    }

    const summary = this.generateSummary(performance);
    const keyFindings = this.extractKeyFindings(performance);
    const strengths = this.identifyStrengths(performance);
    const weaknesses = this.identifyWeaknesses(performance);
    const actionItems = this.generateActionItems(performance);

    return {
      summary,
      keyFindings,
      strengths,
      weaknesses,
      actionItems,
    };
  }

  // Private helper methods

  private initializePerformance(contractId: string): ContractPerformance {
    return {
      contractId,
      contractType: 'Unknown',
      performanceScore: 100,
      metrics: {
        onTimeDelivery: 100,
        paymentTimeliness: 100,
        disputeCount: 0,
        amendmentCount: 0,
        renewalRate: 0,
        satisfactionScore: 100,
      },
      financialImpact: {
        revenue: 0,
        costs: 0,
        profitMargin: 0,
        latePaymentCosts: 0,
        disputeCosts: 0,
      },
      clausePerformance: [],
      timeline: [],
    };
  }

  private updateMetrics(performance: ContractPerformance, event: PerformanceEvent): void {
    switch (event.type) {
      case 'dispute':
        performance.metrics.disputeCount++;
        performance.financialImpact.disputeCosts += Math.abs(event.impact) * 1000;
        break;
      
      case 'amendment':
        performance.metrics.amendmentCount++;
        break;
      
      case 'payment':
        if (event.impact < 0) {
          performance.metrics.paymentTimeliness = Math.max(0, performance.metrics.paymentTimeliness - 5);
          performance.financialImpact.latePaymentCosts += Math.abs(event.impact);
        }
        break;
      
      case 'delivery':
        if (event.impact > 0) {
          performance.metrics.onTimeDelivery = Math.min(100, performance.metrics.onTimeDelivery + 2);
        } else {
          performance.metrics.onTimeDelivery = Math.max(0, performance.metrics.onTimeDelivery - 10);
        }
        break;
    }
  }

  private updatePerformanceScore(performance: ContractPerformance): void {
    const weights = {
      onTimeDelivery: 0.25,
      paymentTimeliness: 0.25,
      disputes: 0.20,
      amendments: 0.15,
      satisfaction: 0.15,
    };

    let score = 0;
    score += performance.metrics.onTimeDelivery * weights.onTimeDelivery;
    score += performance.metrics.paymentTimeliness * weights.paymentTimeliness;
    score += (100 - Math.min(100, performance.metrics.disputeCount * 20)) * weights.disputes;
    score += (100 - Math.min(100, performance.metrics.amendmentCount * 10)) * weights.amendments;
    score += performance.metrics.satisfactionScore * weights.satisfaction;

    performance.performanceScore = Math.round(score);
  }

  private getIndustryBenchmarks(industry: string) {
    // Simulated benchmarks - would come from real data
    const benchmarks: Record<string, any> = {
      technology: { average: 78, top10: 92, bottom10: 45 },
      healthcare: { average: 82, top10: 94, bottom10: 58 },
      finance: { average: 85, top10: 96, bottom10: 62 },
      manufacturing: { average: 75, top10: 89, bottom10: 48 },
      default: { average: 75, top10: 90, bottom10: 50 },
    };

    return benchmarks[industry] || benchmarks.default;
  }

  private calculatePercentileRanking(score: number, industryData: any): number {
    if (score >= industryData.top10) return 95;
    if (score >= industryData.average) {
      return 50 + ((score - industryData.average) / (industryData.top10 - industryData.average)) * 45;
    } else {
      return 5 + ((score - industryData.bottom10) / (industryData.average - industryData.bottom10)) * 45;
    }
  }

  private generateClauseImprovement(clauseType: string, avgPerformance: number): string {
    if (avgPerformance < 60) {
      return `${clauseType} clauses need significant improvement. Consider using pre-vetted templates from top performers.`;
    } else if (avgPerformance < 80) {
      return `${clauseType} clauses are adequate but could be optimized. Review best practices.`;
    } else {
      return `${clauseType} clauses are performing well. Maintain current approach.`;
    }
  }

  private calculateRiskExposure(contracts: ContractPerformance[]) {
    const total = contracts.reduce((sum, c) => 
      sum + c.financialImpact.disputeCosts + c.financialImpact.latePaymentCosts, 0
    );

    const byCategory: Record<string, number> = {};
    contracts.forEach(c => {
      byCategory[c.contractType] = (byCategory[c.contractType] || 0) + 
        c.financialImpact.disputeCosts + c.financialImpact.latePaymentCosts;
    });

    return { total, byCategory };
  }

  private generatePortfolioRecommendations(contracts: ContractPerformance[]) {
    const recommendations: PortfolioAnalytics['recommendations'] = [];

    const highDispute = contracts.filter(c => c.metrics.disputeCount > 2);
    if (highDispute.length > 0) {
      recommendations.push({
        priority: 'critical',
        action: 'Review and revise dispute-prone contracts',
        expectedImpact: 30,
        affectedContracts: highDispute.length,
      });
    }

    const latePayments = contracts.filter(c => c.metrics.paymentTimeliness < 70);
    if (latePayments.length > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Implement automated payment reminders and late fees',
        expectedImpact: 25,
        affectedContracts: latePayments.length,
      });
    }

    return recommendations;
  }

  private calculateTrend(events: PerformanceEvent[]): number {
    if (events.length < 2) return 0;

    const impacts = events.map(e => e.impact);
    const avgRecent = impacts.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const avgOlder = impacts.slice(0, -3).reduce((a, b) => a + b, 0) / (impacts.length - 3);

    return avgRecent - avgOlder;
  }

  private identifyFutureRisks(performance: ContractPerformance, trend: number): string[] {
    const risks: string[] = [];

    if (trend < -5) {
      risks.push('Declining performance trend detected');
    }

    if (performance.metrics.disputeCount > 1) {
      risks.push('High dispute frequency may continue');
    }

    if (performance.metrics.paymentTimeliness < 80) {
      risks.push('Payment issues likely to persist without intervention');
    }

    return risks;
  }

  private identifyOpportunities(performance: ContractPerformance, trend: number): string[] {
    const opportunities: string[] = [];

    if (trend > 5) {
      opportunities.push('Positive momentum - good time to expand scope');
    }

    if (performance.metrics.satisfactionScore > 85) {
      opportunities.push('High satisfaction - opportunity for upsell or renewal');
    }

    return opportunities;
  }

  private isActive(contract: ContractPerformance): boolean {
    const lastEvent = contract.timeline[contract.timeline.length - 1];
    if (!lastEvent) return false;

    const daysSinceActivity = (Date.now() - lastEvent.date.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceActivity < 90 && lastEvent.type !== 'termination';
  }

  private generateSummary(performance: ContractPerformance): string {
    return `Contract performance score: ${performance.performanceScore}/100. ` +
           `${performance.metrics.disputeCount} disputes, ` +
           `${performance.metrics.amendmentCount} amendments. ` +
           `Financial impact: $${performance.financialImpact.revenue.toLocaleString()} revenue, ` +
           `$${performance.financialImpact.costs.toLocaleString()} costs.`;
  }

  private extractKeyFindings(performance: ContractPerformance): string[] {
    const findings: string[] = [];

    if (performance.performanceScore > 85) {
      findings.push('Excellent overall performance - contract is operating smoothly');
    } else if (performance.performanceScore < 60) {
      findings.push('Poor performance - immediate attention required');
    }

    if (performance.metrics.disputeCount === 0) {
      findings.push('Zero disputes - strong contract clarity and execution');
    } else if (performance.metrics.disputeCount > 2) {
      findings.push(`High dispute count (${performance.metrics.disputeCount}) - contract terms may need revision`);
    }

    return findings;
  }

  private identifyStrengths(performance: ContractPerformance): string[] {
    const strengths: string[] = [];

    if (performance.metrics.onTimeDelivery > 90) {
      strengths.push('Excellent delivery performance');
    }

    if (performance.metrics.paymentTimeliness > 90) {
      strengths.push('Timely payments');
    }

    if (performance.financialImpact.profitMargin > 30) {
      strengths.push('Strong profit margins');
    }

    return strengths;
  }

  private identifyWeaknesses(performance: ContractPerformance): string[] {
    const weaknesses: string[] = [];

    if (performance.metrics.onTimeDelivery < 70) {
      weaknesses.push('Poor delivery performance');
    }

    if (performance.metrics.disputeCount > 1) {
      weaknesses.push('Frequent disputes');
    }

    if (performance.financialImpact.latePaymentCosts > 10000) {
      weaknesses.push('High late payment costs');
    }

    return weaknesses;
  }

  private generateActionItems(performance: ContractPerformance) {
    const items: Array<{ action: string; impact: string; effort: string }> = [];

    if (performance.metrics.disputeCount > 0) {
      items.push({
        action: 'Review and clarify ambiguous clauses',
        impact: 'High - reduce future disputes',
        effort: 'Medium - 2-3 weeks',
      });
    }

    if (performance.metrics.paymentTimeliness < 80) {
      items.push({
        action: 'Implement automated invoicing and reminders',
        impact: 'High - improve cash flow',
        effort: 'Low - 1 week setup',
      });
    }

    return items;
  }
}

export const performanceAnalytics = new ContractPerformanceAnalytics();
