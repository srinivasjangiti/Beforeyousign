/**
 * AI Clause Library - REVOLUTIONARY
 * Pre-vetted clause templates with risk ratings
 */

export interface ClauseTemplate {
  id: string;
  category: string;
  title: string;
  text: string;
  riskLevel: 'low' | 'medium' | 'high';
  favorableTo: 'balanced' | 'provider' | 'client';
  usageCount: number;
  industry: string[];
  alternatives: string[];
}

export class ClauseLibraryEngine {
  private library: ClauseTemplate[] = [
    {
      id: 'liability-cap-balanced',
      category: 'Liability',
      title: 'Liability Cap (12 months fees)',
      text: 'EXCEPT FOR EXCLUDED CLAIMS, NEITHER PARTY\'S AGGREGATE LIABILITY SHALL EXCEED THE TOTAL AMOUNT PAID BY CLIENT IN THE 12 MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.',
      riskLevel: 'low',
      favorableTo: 'balanced',
      usageCount: 2847,
      industry: ['technology', 'services', 'saas'],
      alternatives: ['liability-cap-6months', 'liability-cap-contract-value'],
    },
    {
      id: 'payment-net30',
      category: 'Payment',
      title: 'Payment Terms (Net 30)',
      text: 'Client shall pay all undisputed invoices within thirty (30) days of receipt. Late payments shall accrue interest at the rate of 1.5% per month or the maximum permitted by law, whichever is lower.',
      riskLevel: 'low',
      favorableTo: 'balanced',
      usageCount: 4521,
      industry: ['all'],
      alternatives: ['payment-net45', 'payment-net60'],
    },
    {
      id: 'termination-for-convenience',
      category: 'Termination',
      title: 'Termination for Convenience (30 days)',
      text: 'Either party may terminate this Agreement for any reason upon thirty (30) days prior written notice to the other party. Client shall pay for all services performed through the effective date of termination.',
      riskLevel: 'low',
      favorableTo: 'balanced',
      usageCount: 3215,
      industry: ['all'],
      alternatives: ['termination-60days', 'termination-90days'],
    },
    {
      id: 'ip-assignment',
      category: 'Intellectual Property',
      title: 'IP Assignment to Client',
      text: 'Upon receipt of full payment, Provider hereby assigns to Client all right, title, and interest in and to the Work Product, including all intellectual property rights therein. Provider retains ownership of all Background IP and grants Client a perpetual, worldwide license to use such Background IP as incorporated in the Work Product.',
      riskLevel: 'medium',
      favorableTo: 'client',
      usageCount: 1893,
      industry: ['technology', 'creative', 'consulting'],
      alternatives: ['ip-license', 'ip-shared'],
    },
    {
      id: 'confidentiality-mutual',
      category: 'Confidentiality',
      title: 'Mutual Confidentiality',
      text: 'Each party agrees to maintain in strict confidence all Confidential Information disclosed by the other party and to use such information solely for the purposes of this Agreement. Confidential Information excludes information that: (a) is publicly available, (b) was rightfully known prior to disclosure, (c) is independently developed, or (d) is rightfully obtained from a third party.',
      riskLevel: 'low',
      favorableTo: 'balanced',
      usageCount: 5632,
      industry: ['all'],
      alternatives: ['confidentiality-one-way', 'confidentiality-strict'],
    },
    {
      id: 'warranty-services',
      category: 'Warranties',
      title: 'Professional Services Warranty',
      text: 'Provider warrants that services will be performed in a professional and workmanlike manner consistent with industry standards. Client\'s exclusive remedy for breach of this warranty is re-performance of the deficient services at no additional charge.',
      riskLevel: 'low',
      favorableTo: 'balanced',
      usageCount: 2156,
      industry: ['services', 'consulting'],
      alternatives: ['warranty-limited', 'warranty-none'],
    },
    {
      id: 'indemnification-mutual',
      category: 'Indemnification',
      title: 'Mutual Indemnification',
      text: 'Each party shall indemnify, defend, and hold harmless the other party from any third-party claims arising from: (a) breach of this Agreement, (b) negligence or willful misconduct, or (c) violation of applicable laws.',
      riskLevel: 'medium',
      favorableTo: 'balanced',
      usageCount: 3421,
      industry: ['all'],
      alternatives: ['indemnification-provider-only', 'indemnification-limited'],
    },
    {
      id: 'force-majeure',
      category: 'Force Majeure',
      title: 'Force Majeure',
      text: 'Neither party shall be liable for delays or failures in performance resulting from acts beyond its reasonable control, including acts of God, natural disasters, war, terrorism, riots, labor disputes, or governmental actions. The affected party shall promptly notify the other party and use reasonable efforts to mitigate the impact.',
      riskLevel: 'low',
      favorableTo: 'balanced',
      usageCount: 4782,
      industry: ['all'],
      alternatives: ['force-majeure-termination', 'force-majeure-extended'],
    },
  ];

  searchClauses(
    category?: string,
    industry?: string,
    riskLevel?: string
  ): ClauseTemplate[] {
    return this.library.filter(clause => {
      if (category && clause.category !== category) return false;
      if (industry && !clause.industry.includes(industry) && !clause.industry.includes('all')) return false;
      if (riskLevel && clause.riskLevel !== riskLevel) return false;
      return true;
    });
  }

  getClause(id: string): ClauseTemplate | undefined {
    return this.library.find(c => c.id === id);
  }

  getAlternatives(clauseId: string): ClauseTemplate[] {
    const clause = this.getClause(clauseId);
    if (!clause) return [];
    
    return clause.alternatives
      .map(altId => this.getClause(altId))
      .filter(Boolean) as ClauseTemplate[];
  }

  getCategories(): string[] {
    return [...new Set(this.library.map(c => c.category))];
  }

  getMostUsed(limit: number = 10): ClauseTemplate[] {
    return [...this.library]
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  compareRisk(clauseId1: string, clauseId2: string): {
    safer: string;
    riskDifference: string;
    recommendation: string;
  } {
    const clause1 = this.getClause(clauseId1);
    const clause2 = this.getClause(clauseId2);
    
    if (!clause1 || !clause2) {
      return {
        safer: 'unknown',
        riskDifference: 'Cannot compare',
        recommendation: 'Invalid clause IDs',
      };
    }
    
    const riskLevels = { low: 1, medium: 2, high: 3 };
    const risk1 = riskLevels[clause1.riskLevel];
    const risk2 = riskLevels[clause2.riskLevel];
    
    return {
      safer: risk1 < risk2 ? clause1.id : clause2.id,
      riskDifference: Math.abs(risk1 - risk2) === 0 ? 'Equal risk' : `${Math.abs(risk1 - risk2)} level(s)`,
      recommendation: risk1 < risk2 
        ? `Use ${clause1.title} for lower risk`
        : `Use ${clause2.title} for lower risk`,
    };
  }
}

export const clauseLibraryEngine = new ClauseLibraryEngine();
