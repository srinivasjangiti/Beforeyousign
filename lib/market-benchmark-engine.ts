/**
 * Market Benchmarking Engine
 * Compares contract terms against market standards
 */

export interface MarketBenchmark {
  term: string;
  yourValue: string;
  marketMedian: string;
  yourPercentile: number;
  rating: 'very favorable' | 'favorable' | 'market standard' | 'below market' | 'unfavorable';
  recommendation: string;
}

export interface BenchmarkAnalysis {
  overallCompetitiveness: number;
  benchmarks: MarketBenchmark[];
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
}

export class MarketBenchmarkingEngine {
  async analyzeContract(
    contractText: string,
    industry: string
  ): Promise<BenchmarkAnalysis> {
    const benchmarks: MarketBenchmark[] = [];
    
    // Payment terms
    const paymentTerms = this.extractPaymentTerms(contractText);
    if (paymentTerms) {
      benchmarks.push(this.benchmarkPaymentTerms(paymentTerms, industry));
    }
    
    // Contract length
    const duration = this.extractDuration(contractText);
    if (duration) {
      benchmarks.push(this.benchmarkDuration(duration, industry));
    }
    
    // Liability
    const liability = this.extractLiability(contractText);
    benchmarks.push(this.benchmarkLiability(liability, industry));
    
    // Termination
    const termination = this.extractTermination(contractText);
    benchmarks.push(this.benchmarkTermination(termination));
    
    // Calculate overall competitiveness
    const overallCompetitiveness = this.calculateCompetitiveness(benchmarks);
    
    // SWOT analysis
    const { strengths, weaknesses, opportunities } = this.performSwot(benchmarks);
    
    return {
      overallCompetitiveness,
      benchmarks,
      strengths,
      weaknesses,
      opportunities,
    };
  }

  private extractPaymentTerms(text: string): number | null {
    const match = text.match(/net\s*(\d+)/i);
    return match ? parseInt(match[1]) : null;
  }

  private extractDuration(text: string): number | null {
    const match = text.match(/(\d+)\s*(?:month|year)/i);
    if (match) {
      const value = parseInt(match[1]);
      return text.toLowerCase().includes('year') ? value * 12 : value;
    }
    return null;
  }

  private extractLiability(text: string): string {
    if (text.toLowerCase().includes('unlimited')) return 'unlimited';
    const match = text.match(/(\d+)\s*month.*?fee/i);
    return match ? `${match[1]} months fees` : 'unspecified';
  }

  private extractTermination(text: string): number {
    const match = text.match(/(\d+)\s*day.*?notice/i);
    return match ? parseInt(match[1]) : 0;
  }

  private benchmarkPaymentTerms(days: number, industry: string): MarketBenchmark {
    const marketMedian = 30;
    const percentile = (days / 90) * 100;
    
    return {
      term: 'Payment Terms',
      yourValue: `Net ${days}`,
      marketMedian: 'Net 30',
      yourPercentile: percentile,
      rating: days > 45 ? 'very favorable' : days > 30 ? 'favorable' : 'market standard',
      recommendation: days < 30 
        ? 'Request extension to Net 30 or Net 45 to improve cash flow'
        : 'Payment terms are competitive',
    };
  }

  private benchmarkDuration(months: number, industry: string): MarketBenchmark {
    const marketMedian = 12;
    const percentile = 100 - Math.min((months / 36) * 100, 100);
    
    return {
      term: 'Contract Term',
      yourValue: `${months} months`,
      marketMedian: '12 months',
      yourPercentile: percentile,
      rating: months <= 12 ? 'favorable' : months <= 24 ? 'market standard' : 'below market',
      recommendation: months > 24 
        ? 'Long commitment - negotiate early termination rights'
        : 'Term length provides good flexibility',
    };
  }

  private benchmarkLiability(liability: string, industry: string): MarketBenchmark {
    const isUnlimited = liability === 'unlimited';
    
    return {
      term: 'Liability Cap',
      yourValue: liability,
      marketMedian: '12 months fees',
      yourPercentile: isUnlimited ? 0 : 50,
      rating: isUnlimited ? 'unfavorable' : 'market standard',
      recommendation: isUnlimited
        ? '⚠️ CRITICAL: Add liability cap at 6-12 months of fees'
        : 'Liability terms are reasonable',
    };
  }

  private benchmarkTermination(days: number): MarketBenchmark {
    return {
      term: 'Termination Notice',
      yourValue: days > 0 ? `${days} days` : 'None specified',
      marketMedian: '30 days',
      yourPercentile: days <= 30 ? 75 : 50,
      rating: days <= 30 ? 'favorable' : 'market standard',
      recommendation: days === 0
        ? 'Add 30-day termination notice provision'
        : 'Termination terms provide adequate flexibility',
    };
  }

  private calculateCompetitiveness(benchmarks: MarketBenchmark[]): number {
    const scores = benchmarks.map(b => b.yourPercentile);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  private performSwot(benchmarks: MarketBenchmark[]): {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
  } {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const opportunities: string[] = [];
    
    benchmarks.forEach(b => {
      if (b.rating === 'very favorable' || b.rating === 'favorable') {
        strengths.push(`${b.term}: ${b.yourValue} is better than market average`);
      } else if (b.rating === 'unfavorable' || b.rating === 'below market') {
        weaknesses.push(`${b.term}: ${b.yourValue} is below market standards`);
        opportunities.push(`Negotiate ${b.term} to match market median: ${b.marketMedian}`);
      }
    });
    
    return { strengths, weaknesses, opportunities };
  }
}

export const marketBenchmarkEngine = new MarketBenchmarkingEngine();
