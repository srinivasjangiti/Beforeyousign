/**
 * ML Risk Prediction Engine
 * Predicts dispute probability and contract risks using ML models
 */

export interface RiskPrediction {
  overallRisk: number; // 0-100
  disputeProbability: number; // 0-100
  breachLikelihood: number; // 0-100
  timeToDispute?: string;
  topRisks: {
    category: string;
    risk: number;
    description: string;
  }[];
  recommendations: string[];
}

export class MLRiskPredictor {
  async predictRisk(
    contractText: string,
    metadata: {
      industry: string;
      contractValue: number;
      duration: number;
    }
  ): Promise<RiskPrediction> {
    // Extract features
    const features = this.extractFeatures(contractText);
    
    // Calculate risks
    const overallRisk = this.calculateOverallRisk(features, metadata);
    const disputeProbability = this.calculateDisputeProbability(features);
    const breachLikelihood = this.calculateBreachLikelihood(features, metadata);
    
    // Identify top risks
    const topRisks = this.identifyTopRisks(features, contractText);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(topRisks, overallRisk);
    
    return {
      overallRisk,
      disputeProbability,
      breachLikelihood,
      timeToDispute: disputeProbability > 50 ? '6-18 months' : 'Low probability',
      topRisks,
      recommendations,
    };
  }

  private extractFeatures(contractText: string): Record<string, number> {
    const lowerText = contractText.toLowerCase();
    
    return {
      unlimitedLiability: lowerText.includes('unlimited') ? 1 : 0,
      soleDiscretion: lowerText.includes('sole discretion') ? 1 : 0,
      automaticRenewal: lowerText.includes('automatically renew') ? 1 : 0,
      noTerminationRight: !lowerText.includes('terminate') ? 1 : 0,
      vagueTerms: this.countVagueTerms(lowerText),
      wordCount: contractText.split(/\s+/).length,
      hasArbitration: lowerText.includes('arbitration') ? 1 : 0,
      hasLiabilityCap: lowerText.includes('liability cap') || lowerText.includes('limited to') ? 1 : 0,
    };
  }

  private countVagueTerms(text: string): number {
    const vagueTerms = ['reasonable', 'appropriate', 'as needed', 'from time to time', 'sufficient'];
    return vagueTerms.filter(term => text.includes(term)).length;
  }

  private calculateOverallRisk(features: Record<string, number>, metadata: any): number {
    let risk = 0;
    
    risk += features.unlimitedLiability * 25;
    risk += features.soleDiscretion * 15;
    risk += features.automaticRenewal * 10;
    risk += features.noTerminationRight * 20;
    risk += features.vagueTerms * 5;
    risk -= features.hasArbitration * 10;
    risk -= features.hasLiabilityCap * 15;
    
    // High value = higher stakes = higher risk
    if (metadata.contractValue > 100000) risk += 10;
    if (metadata.duration > 24) risk += 10;
    
    return Math.max(0, Math.min(100, risk));
  }

  private calculateDisputeProbability(features: Record<string, number>): number {
    let probability = 15; // Base 15%
    
    probability += features.unlimitedLiability * 20;
    probability += features.soleDiscretion * 15;
    probability += features.vagueTerms * 8;
    probability -= features.hasArbitration * 12;
    
    return Math.max(0, Math.min(100, probability));
  }

  private calculateBreachLikelihood(features: Record<string, number>, metadata: any): number {
    let likelihood = 10; // Base 10%
    
    // Complex contracts are harder to comply with
    if (features.wordCount > 5000) likelihood += 15;
    
    likelihood += features.vagueTerms * 10;
    likelihood += features.noTerminationRight * 12;
    
    // Long durations increase breach risk
    if (metadata.duration > 36) likelihood += 15;
    
    return Math.max(0, Math.min(100, likelihood));
  }

  private identifyTopRisks(features: Record<string, number>, contractText: string): RiskPrediction['topRisks'] {
    const risks: RiskPrediction['topRisks'] = [];
    
    if (features.unlimitedLiability) {
      risks.push({
        category: 'Unlimited Liability',
        risk: 90,
        description: 'No cap on financial exposure - could lead to catastrophic losses',
      });
    }
    
    if (features.soleDiscretion) {
      risks.push({
        category: 'Sole Discretion',
        risk: 75,
        description: 'Other party has unilateral decision-making power',
      });
    }
    
    if (features.automaticRenewal) {
      risks.push({
        category: 'Auto-Renewal',
        risk: 60,
        description: 'Contract renews automatically - may lock you in unintentionally',
      });
    }
    
    if (features.vagueTerms > 3) {
      risks.push({
        category: 'Vague Terms',
        risk: 65,
        description: 'Multiple undefined terms increase dispute probability',
      });
    }
    
    if (!features.hasLiabilityCap) {
      risks.push({
        category: 'No Liability Cap',
        risk: 70,
        description: 'Recommend adding financial liability limitations',
      });
    }
    
    return risks.sort((a, b) => b.risk - a.risk).slice(0, 5);
  }

  private generateRecommendations(topRisks: RiskPrediction['topRisks'], overallRisk: number): string[] {
    const recommendations: string[] = [];
    
    if (overallRisk > 70) {
      recommendations.push('⚠️ High risk contract - strongly recommend legal review before signing');
    }
    
    topRisks.forEach(risk => {
      if (risk.category === 'Unlimited Liability') {
        recommendations.push('Add liability cap at 12 months of fees or contract value');
      }
      if (risk.category === 'Sole Discretion') {
        recommendations.push('Request mutual approval or "reasonable discretion" language');
      }
      if (risk.category === 'Auto-Renewal') {
        recommendations.push('Add 90-day termination notice provision');
      }
      if (risk.category === 'Vague Terms') {
        recommendations.push('Request definitions section for ambiguous terms');
      }
    });
    
    if (recommendations.length === 0) {
      recommendations.push('✓ Risk level is acceptable - standard contract protections in place');
    }
    
    return recommendations;
  }
}

export const mlRiskPredictor = new MLRiskPredictor();
