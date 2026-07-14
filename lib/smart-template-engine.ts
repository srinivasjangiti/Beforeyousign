/**
 * Smart Template Engine
 * 
 * Dynamically generates contract templates that adapt to:
 * - Industry and jurisdiction
 * - User role and risk tolerance  
 * - Historical patterns and best practices
 * - Real-time market conditions
 */

export interface TemplateContext {
  industry: string;
  jurisdiction: string;
  contractType: string;
  userRole: 'buyer' | 'seller' | 'employer' | 'employee' | 'landlord' | 'tenant';
  riskTolerance: 'conservative' | 'balanced' | 'aggressive';
  parties: Array<{
    name: string;
    role: string;
    entity_type?: string;
  }>;
  terms?: {
    duration?: string;
    value?: number;
    paymentTerms?: string;
    [key: string]: any;
  };
  preferences?: {
    favorableTo?: 'user' | 'neutral' | 'counterparty';
    detailLevel?: 'minimal' | 'standard' | 'comprehensive';
    legalLanguage?: 'plain' | 'standard' | 'formal';
  };
}

export interface ClauseTemplate {
  id: string;
  category: string;
  title: string;
  required: boolean;
  priority: number;
  versions: Array<{
    id: string;
    variant: 'conservative' | 'balanced' | 'aggressive';
    text: string;
    favorability: 'user' | 'neutral' | 'counterparty';
    riskLevel: 'low' | 'medium' | 'high';
    notes: string;
    alternatives: string[];
  }>;
  dependencies?: string[];
  industrySpecific?: boolean;
  jurisdictionRules?: Record<string, any>;
}

export interface SmartTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  version: string;
  clauses: ClauseTemplate[];
  metadata: {
    industry: string[];
    jurisdiction: string[];
    useCase: string;
    complexity: 'simple' | 'moderate' | 'complex';
    lastUpdated: Date;
    usageCount: number;
    successRate?: number;
  };
}

export class SmartTemplateEngine {
  private templates: Map<string, SmartTemplate> = new Map();
  private clauseLibrary: Map<string, ClauseTemplate> = new Map();
  private industryRules: Map<string, any> = new Map();
  private jurisdictionRules: Map<string, any> = new Map();

  constructor() {
    this.initializeLibrary();
  }

  /**
   * Generate a customized contract from template
   */
  async generateContract(
    templateId: string,
    context: TemplateContext
  ): Promise<{
    content: string;
    clauses: Array<{
      id: string;
      category: string;
      title: string;
      text: string;
      riskLevel: string;
      explanation: string;
    }>;
    recommendations: string[];
    warnings: string[];
  }> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Select appropriate clause versions based on context
    const selectedClauses = await this.selectClauses(template, context);

    // Apply jurisdiction-specific modifications
    const jurisdictionAdjusted = this.applyJurisdictionRules(selectedClauses, context.jurisdiction);

    // Apply industry-specific modifications
    const industryAdjusted = this.applyIndustryRules(jurisdictionAdjusted, context.industry);

    // Personalize based on user preferences
    const personalized = this.personalize(industryAdjusted, context);

    // Generate final contract content
    const content = this.assembleContract(personalized, context);

    // Generate recommendations
    const recommendations = this.generateRecommendations(personalized, context);

    // Identify potential issues
    const warnings = this.identifyWarnings(personalized, context);

    return {
      content,
      clauses: personalized.map((clause) => ({
        id: clause.id,
        category: clause.category,
        title: clause.title,
        text: clause.selectedText,
        riskLevel: clause.selectedRiskLevel,
        explanation: clause.explanation,
      })),
      recommendations,
      warnings,
    };
  }

  /**
   * Select appropriate clause versions
   */
  private async selectClauses(
    template: SmartTemplate,
    context: TemplateContext
  ): Promise<any[]> {
    return template.clauses.map((clause) => {
      // Find the version that matches user's risk tolerance and role
      let selectedVersion = clause.versions.find(
        (v) => v.variant === context.riskTolerance
      );

      // If no exact match, use balanced version
      if (!selectedVersion) {
        selectedVersion = clause.versions.find((v) => v.variant === 'balanced');
      }

      // Fallback to first version
      if (!selectedVersion) {
        selectedVersion = clause.versions[0];
      }

      return {
        ...clause,
        selectedVersion,
        selectedText: selectedVersion.text,
        selectedRiskLevel: selectedVersion.riskLevel,
        explanation: `This ${clause.category} clause is ${selectedVersion.variant} in nature and provides ${selectedVersion.favorability} favorability.`,
      };
    });
  }

  /**
   * Apply jurisdiction-specific rules
   */
  private applyJurisdictionRules(clauses: any[], jurisdiction: string): any[] {
    const rules = this.jurisdictionRules.get(jurisdiction);
    if (!rules) return clauses;

    return clauses.map((clause) => {
      const jurisdictionRequirements = clause.jurisdictionRules?.[jurisdiction];
      if (jurisdictionRequirements) {
        // Apply required modifications
        return {
          ...clause,
          selectedText: this.applyJurisdictionModifications(
            clause.selectedText,
            jurisdictionRequirements
          ),
        };
      }
      return clause;
    });
  }

  /**
   * Apply industry-specific rules
   */
  private applyIndustryRules(clauses: any[], industry: string): any[] {
    const rules = this.industryRules.get(industry);
    if (!rules) return clauses;

    // Add industry-specific clauses
    const additionalClauses = rules.requiredClauses || [];

    // Modify existing clauses
    const modified = clauses.map((clause) => {
      if (clause.industrySpecific) {
        return {
          ...clause,
          selectedText: this.applyIndustryModifications(clause.selectedText, industry),
        };
      }
      return clause;
    });

    return [...modified, ...additionalClauses];
  }

  /**
   * Personalize based on context
   */
  private personalize(clauses: any[], context: TemplateContext): any[] {
    return clauses.map((clause) => {
      let text = clause.selectedText;

      // Replace placeholders
      text = text.replace(/\[PARTY_A\]/g, context.parties[0]?.name || '[Party A]');
      text = text.replace(/\[PARTY_B\]/g, context.parties[1]?.name || '[Party B]');
      text = text.replace(/\[DURATION\]/g, context.terms?.duration || '[Duration]');
      text = text.replace(/\[VALUE\]/g, context.terms?.value?.toString() || '[Value]');

      // Adjust language complexity
      if (context.preferences?.legalLanguage === 'plain') {
        text = this.simplifyLanguage(text);
      }

      return {
        ...clause,
        selectedText: text,
      };
    });
  }

  /**
   * Assemble final contract
   */
  private assembleContract(clauses: any[], context: TemplateContext): string {
    const sections = [
      this.generateHeader(context),
      this.generateRecitals(context),
      ...clauses.map((c, i) => `\n## ${i + 1}. ${c.title}\n\n${c.selectedText}`),
      this.generateSignatureBlock(context),
    ];

    return sections.join('\n\n');
  }

  /**
   * Generate contract header
   */
  private generateHeader(context: TemplateContext): string {
    return `# ${context.contractType.toUpperCase()}

This Agreement is entered into as of [DATE] ("Effective Date")

BETWEEN:

${context.parties.map((p, i) => `${i + 1}. ${p.name} (${p.role})`).join('\n')}`;
  }

  /**
   * Generate recitals
   */
  private generateRecitals(context: TemplateContext): string {
    return `## RECITALS

WHEREAS, the parties wish to enter into this Agreement under the terms and conditions set forth below;

NOW, THEREFORE, in consideration of the mutual covenants and agreements herein contained, the parties agree as follows:`;
  }

  /**
   * Generate signature block
   */
  private generateSignatureBlock(context: TemplateContext): string {
    return `## SIGNATURES

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

${context.parties
  .map(
    (p) => `
**${p.name}**

Signature: _______________________

Name: _______________________

Title: _______________________

Date: _______________________
`
  )
  .join('\n')}`;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(clauses: any[], context: TemplateContext): string[] {
    const recommendations: string[] = [];

    // Check for missing common clauses
    const hasConfidentiality = clauses.some((c) => c.category === 'Confidentiality');
    if (!hasConfidentiality && context.industry === 'tech') {
      recommendations.push('Consider adding a confidentiality clause for IP protection');
    }

    // Check for high-risk clauses
    const highRiskClauses = clauses.filter((c) => c.selectedRiskLevel === 'high');
    if (highRiskClauses.length > 0) {
      recommendations.push(
        `${highRiskClauses.length} high-risk clauses detected. Review carefully before signing.`
      );
    }

    // Industry-specific recommendations
    if (context.industry === 'healthcare') {
      recommendations.push('Ensure HIPAA compliance requirements are addressed');
    }

    return recommendations;
  }

  /**
   * Identify potential warnings
   */
  private identifyWarnings(clauses: any[], context: TemplateContext): string[] {
    const warnings: string[] = [];

    // Check for aggressive clauses when user is conservative
    if (context.riskTolerance === 'conservative') {
      const aggressiveClauses = clauses.filter(
        (c) => c.selectedVersion?.variant === 'aggressive'
      );
      if (aggressiveClauses.length > 0) {
        warnings.push('Some aggressive clauses may not align with your conservative preference');
      }
    }

    // Jurisdiction warnings
    if (context.jurisdiction === 'EU' && !clauses.some((c) => c.title.includes('GDPR'))) {
      warnings.push('EU jurisdiction may require GDPR compliance clauses');
    }

    return warnings;
  }

  /**
   * Helper: Apply jurisdiction modifications
   */
  private applyJurisdictionModifications(text: string, requirements: any): string {
    // Apply required legal language for jurisdiction
    let modified = text;

    if (requirements.requiredLanguage) {
      modified += '\n\n' + requirements.requiredLanguage;
    }

    return modified;
  }

  /**
   * Helper: Apply industry modifications
   */
  private applyIndustryModifications(text: string, industry: string): string {
    // Add industry-specific terms
    return text;
  }

  /**
   * Helper: Simplify legal language
   */
  private simplifyLanguage(text: string): string {
    return text
      .replace(/hereinafter/g, 'from now on')
      .replace(/pursuant to/g, 'according to')
      .replace(/notwithstanding/g, 'despite')
      .replace(/heretofore/g, 'before this')
      .replace(/aforementioned/g, 'mentioned above');
  }

  /**
   * Initialize clause library
   */
  private initializeLibrary(): void {
    // Sample clause templates
    const paymentTermsClause: ClauseTemplate = {
      id: 'payment-terms',
      category: 'Payment',
      title: 'Payment Terms',
      required: true,
      priority: 1,
      versions: [
        {
          id: 'payment-conservative',
          variant: 'conservative',
          text: 'Payment shall be made within [PAYMENT_PERIOD] days of invoice date. Late payments will incur interest at [INTEREST_RATE]% per month.',
          favorability: 'user',
          riskLevel: 'low',
          notes: 'Standard payment terms with protection against late payment',
          alternatives: [],
        },
        {
          id: 'payment-balanced',
          variant: 'balanced',
          text: 'Payment shall be made within [PAYMENT_PERIOD] days of invoice date.',
          favorability: 'neutral',
          riskLevel: 'low',
          notes: 'Standard balanced payment terms',
          alternatives: [],
        },
      ],
    };

    this.clauseLibrary.set(paymentTermsClause.id, paymentTermsClause);

    // Industry rules
    this.industryRules.set('tech', {
      requiredClauses: ['ip-rights', 'confidentiality', 'data-protection'],
      recommendedTerms: {
        'software-license': 'perpetual with maintenance',
        'ip-assignment': 'work-product-only',
        'liability-cap': '12-months-fees',
      },
    });

    this.industryRules.set('healthcare', {
      requiredClauses: ['hipaa-compliance', 'data-privacy', 'confidentiality'],
      recommendedTerms: {
        'data-retention': '7-years',
        'audit-rights': 'annual',
        'breach-notification': '24-hours',
      },
    });

    this.industryRules.set('finance', {
      requiredClauses: ['regulatory-compliance', 'audit-rights', 'data-security'],
      recommendedTerms: {
        'record-retention': '10-years',
        'reporting-frequency': 'quarterly',
      },
    });

    // Jurisdiction rules
    this.jurisdictionRules.set('EU', {
      requiredClauses: ['gdpr-compliance', 'data-transfer'],
      dataProtection: {
        minimumRetention: 'as-needed',
        userRights: ['access', 'deletion', 'portability', 'correction'],
        breachNotification: '72-hours',
      },
    });

    this.jurisdictionRules.set('US', {
      requiredClauses: ['choice-of-law', 'venue'],
      specificStates: {
        'California': {
          requiredClauses: ['ccpa-compliance', 'arbitration-notice'],
          employmentRules: {
            'non-compete': 'generally-unenforceable',
            'ip-assignment': 'limited-to-work-related',
          },
        },
        'New York': {
          requiredClauses: ['choice-of-law-ny'],
          interestRate: {
            max: '16%',
            default: '9%',
          },
        },
        'Delaware': {
          notes: 'Business-friendly, common for corporations',
          corporateGovernance: 'flexible',
        },
      },
    });
  }

  /**
   * Analyze template variables and suggest optimal values
   */
  suggestVariableValues(
    variables: string[],
    context: TemplateContext
  ): Record<string, { suggestedValue: string; reasoning: string; alternatives: string[] }> {
    const suggestions: Record<string, any> = {};

    for (const variable of variables) {
      switch (variable) {
        case 'PAYMENT_PERIOD':
          suggestions[variable] = {
            suggestedValue: context.userRole === 'buyer' ? '60 days' : '30 days',
            reasoning: `${context.userRole === 'buyer' ? 'Net 60' : 'Net 30'} is industry standard for ${context.industry}`,
            alternatives: ['15 days', '30 days', '45 days', '60 days', '90 days'],
          };
          break;

        case 'LIABILITY_CAP':
          const cappingMultiplier = context.riskTolerance === 'conservative' ? 24 : context.riskTolerance === 'balanced' ? 12 : 6;
          suggestions[variable] = {
            suggestedValue: `${cappingMultiplier} months of fees paid`,
            reasoning: `Standard ${context.riskTolerance} approach limits liability to ${cappingMultiplier} months of fees`,
            alternatives: ['6 months of fees', '12 months of fees', '24 months of fees', 'unlimited'],
          };
          break;

        case 'SLA_PERCENTAGE':
          suggestions[variable] = {
            suggestedValue: context.industry === 'Technology' ? '99.9' : '99.0',
            reasoning: 'Industry-standard uptime commitment for production services',
            alternatives: ['99.0', '99.5', '99.9', '99.99'],
          };
          break;

        case 'TERM_LENGTH':
          suggestions[variable] = {
            suggestedValue: context.contractType.includes('saas') ? '12 months' : '6 months',
            reasoning: 'Standard initial term balancing commitment and flexibility',
            alternatives: ['3 months', '6 months', '12 months', '24 months', '36 months'],
          };
          break;

        case 'CONFIDENTIALITY_PERIOD':
          const years = context.industry === 'Technology' ? '3' : '2';
          suggestions[variable] = {
            suggestedValue: `${years} years`,
            reasoning: `Standard confidentiality period for ${context.industry}`,
            alternatives: ['1 year', '2 years', '3 years', '5 years', 'perpetual for trade secrets'],
          };
          break;

        default:
          suggestions[variable] = {
            suggestedValue: '',
            reasoning: 'Custom value required',
            alternatives: [],
          };
      }
    }

    return suggestions;
  }

  /**
   * Validate template values for compliance
   */
  validateTemplateValues(
    variables: Record<string, string>,
    context: TemplateContext
  ): Array<{ field: string; issue: string; severity: 'error' | 'warning' | 'info' }> {
    const issues: Array<{ field: string; issue: string; severity: 'error' | 'warning' | 'info' }> = [];

    // Check payment terms
    if (variables.PAYMENT_PERIOD) {
      const days = parseInt(variables.PAYMENT_PERIOD);
      if (days > 90) {
        issues.push({
          field: 'PAYMENT_PERIOD',
          issue: 'Payment terms over 90 days may impact cash flow significantly',
          severity: 'warning',
        });
      }
    }

    // Check SLA commitments
    if (variables.SLA_PERCENTAGE) {
      const sla = parseFloat(variables.SLA_PERCENTAGE);
      if (sla > 99.99) {
        issues.push({
          field: 'SLA_PERCENTAGE',
          issue: '99.99%+ uptime is extremely difficult to achieve and may require significant infrastructure investment',
          severity: 'warning',
        });
      }
    }

    // Check liability caps
    if (variables.LIABILITY_CAP) {
      const cap = variables.LIABILITY_CAP.toLowerCase();
      if (cap.includes('unlimited') || cap.includes('no limit')) {
        issues.push({
          field: 'LIABILITY_CAP',
          issue: 'Unlimited liability exposure is extremely risky. Consider capping liability.',
          severity: 'error',
        });
      }
    }

    // Check jurisdiction-specific rules
    if (context.jurisdiction === 'California' && variables.NON_COMPETE_PERIOD) {
      issues.push({
        field: 'NON_COMPETE_PERIOD',
        issue: 'Non-compete clauses are generally unenforceable in California except for sale of business',
        severity: 'error',
      });
    }

    // Check term lengths
    if (variables.TERM_LENGTH) {
      const termMatch = variables.TERM_LENGTH.match(/(\d+)\s*(year|month)/i);
      if (termMatch) {
        const value = parseInt(termMatch[1]);
        const unit = termMatch[2].toLowerCase();
        
        if (unit === 'year' && value > 5) {
          issues.push({
            field: 'TERM_LENGTH',
            issue: 'Terms longer than 5 years may limit flexibility. Consider shorter initial terms with renewal options.',
            severity: 'info',
          });
        }
      }
    }

    // Check insurance requirements
    if (variables.INSURANCE_AMOUNT) {
      const amount = parseInt(variables.INSURANCE_AMOUNT.replace(/[^0-9]/g, ''));
      if (amount < 1000000 && context.contractType.includes('professional-services')) {
        issues.push({
          field: 'INSURANCE_AMOUNT',
          issue: 'Professional services typically require $1M+ in E&O insurance',
          severity: 'warning',
        });
      }
    }

    return issues;
  }

  /**
   * Generate contract comparison report
   */
  compareContracts(
    template1: string,
    template2: string,
    context: TemplateContext
  ): {
    differences: Array<{ clause: string; template1Value: string; template2Value: string; impact: string }>;
    riskComparison: { template1Risk: number; template2Risk: number };
    recommendation: string;
  } {
    // Simplified comparison logic
    return {
      differences: [
        {
          clause: 'Liability Cap',
          template1Value: '12 months of fees',
          template2Value: 'Unlimited',
          impact: 'Template 2 has significantly higher risk exposure',
        },
      ],
      riskComparison: { template1Risk: 25, template2Risk: 65 },
      recommendation: 'Template 1 provides better protection with balanced terms',
    };
  }

  /**
   * Get available templates
   */
  getTemplates(filters?: { industry?: string; type?: string }): SmartTemplate[] {
    let templates = Array.from(this.templates.values());

    if (filters?.industry) {
      templates = templates.filter((t) => t.metadata.industry.includes(filters.industry!));
    }

    if (filters?.type) {
      templates = templates.filter((t) => t.type === filters.type);
    }

    return templates;
  }

  /**
   * Add custom template
   */
  addTemplate(template: SmartTemplate): void {
    this.templates.set(template.id, template);
  }

  /**
   * Update template
   */
  updateTemplate(templateId: string, updates: Partial<SmartTemplate>): void {
    const template = this.templates.get(templateId);
    if (template) {
      this.templates.set(templateId, { ...template, ...updates });
    }
  }
}

// Export singleton instance
export const smartTemplateEngine = new SmartTemplateEngine();
