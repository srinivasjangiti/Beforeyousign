/**
 * Template Orchestrator - Unified Integration Layer
 * 
 * Integrates all template system components:
 * - AI Template Engine
 * - Analytics Engine
 * - Collaboration Engine
 * - Marketplace
 * - Comprehensive & Legacy Template Libraries
 * 
 * Provides single, consistent API for all template operations
 */

import { aiTemplateEngine } from './ai-template-engine';
import { templateAnalytics } from './template-analytics-engine';
import { collaborationEngine } from './template-collaboration-engine';
import { templateMarketplace } from './template-marketplace';
import { ComprehensiveLibrary } from './comprehensive-template-library';
import { exportManager } from './export-manager';
import type {
  AITemplateContext,
  TemplateGenerationResult,
  ExtendedTemplateMetadata,
  BaseTemplateMetadata,
  ExportOptions,
} from './template-types';

// Import legacy templates
import { searchTemplates as searchLegacy, getTemplateById as getLegacyById, getTemplateCategories as getLegacyCategories } from './templates-data';

export class TemplateOrchestrator {
  /**
   * Unified template search across all libraries
   * Combines results from comprehensive and legacy libraries
   * Ranks by analytics data
   */
  async searchTemplates(query: string, options: {
    includeAnalytics?: boolean;
    includeLegacy?: boolean;
    limit?: number;
  } = {}): Promise<any[]> {
    const {
      includeAnalytics = true,
      includeLegacy = true,
      limit,
    } = options;

    // Search both libraries
    const comprehensiveResults = ComprehensiveLibrary.search(query);
    const legacyResults = includeLegacy ? searchLegacy({ query }) : [];

    // Combine results
    let allResults = [...comprehensiveResults, ...legacyResults];

    // Add analytics if requested
    if (includeAnalytics) {
      allResults = await this.enrichWithAnalytics(allResults);
      // Sort by composite score
      allResults = this.rankByScore(allResults);
    }

    // Apply limit
    if (limit && limit > 0) {
      allResults = allResults.slice(0, limit);
    }

    return allResults;
  }

  /**
   * Get template by ID from any library
   */
  async getTemplate(id: string, options: {
    includeAnalytics?: boolean;
  } = {}): Promise<any | null> {
    const { includeAnalytics = true } = options;

    // Try comprehensive library first
    let template = ComprehensiveLibrary.getById(id);

    // Fallback to legacy
    if (!template) {
      template = getLegacyById(id) as any;
    }

    if (!template) {
      return null;
    }

    // Enrich with analytics
    if (includeAnalytics) {
      const analytics = await templateAnalytics.getTemplateAnalytics(id);
      return { ...template, analytics };
    }

    return template;
  }

  /**
   * Generate contract with AI
   * Tracks analytics and provides real-time insights
   */
  async generateWithAI(context: AITemplateContext): Promise<TemplateGenerationResult> {
    // Generate contract
    const result = await aiTemplateEngine.generateContract(context);

    // Track generation event
    await templateAnalytics.trackEvent({
      templateId: result.templateId,
      type: 'ai-generation',
      userId: context.customFields?.userId || 'anonymous',
      timestamp: new Date(),
      metadata: {
        contractType: context.contractType,
        jurisdiction: context.jurisdiction,
        riskTolerance: context.riskTolerance,
      },
    });

    return result;
  }

  /**
   * Get AI suggestions for existing template
   */
  async getAISuggestions(templateId: string, currentContent: string, context: Partial<AITemplateContext>): Promise<any> {
    const template = await this.getTemplate(templateId, { includeAnalytics: false });

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Get real-time suggestions
    // Default cursor to end of content if not provided
    return aiTemplateEngine.getRealtimeSuggestions(currentContent, currentContent.length, {
      contractType: template.category,
      jurisdiction: context.jurisdiction || 'US',
      ...context,
    } as AITemplateContext);
  }

  /**
   * Start collaboration session
   */
  async startCollaboration(templateId: string, userId: string, userName: string): Promise<any> {
    const template = await this.getTemplate(templateId, { includeAnalytics: false });

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const session = await collaborationEngine.startSession({
      templateId,
      templateName: template.name,
      initiatorId: userId,
      participants: [{ userId, role: 'owner' }]
    });

    // Track collaboration start
    await templateAnalytics.trackEvent({
      templateId,
      type: 'collaboration-started',
      userId,
      timestamp: new Date(),
    });

    return session;
  }

  /**
   * Get popular templates
   * Combines download counts with analytics
   */
  async getPopularTemplates(limit: number = 10): Promise<any[]> {
    const comprehensive = ComprehensiveLibrary.getPopular(limit * 2);

    // Enrich with analytics
    const enriched = await this.enrichWithAnalytics(comprehensive);

    // Re-rank by composite score
    const ranked = this.rankByScore(enriched);

    return ranked.slice(0, limit);
  }

  /**
   * Get templates by category
   */
  async getTemplatesByCategory(category: string, options: {
    includeAnalytics?: boolean;
    includeLegacy?: boolean;
  } = {}): Promise<any[]> {
    const { includeAnalytics = true, includeLegacy = true } = options;

    // Get from comprehensive library
    let templates = ComprehensiveLibrary.getByCategory(category);

    // Add legacy templates if requested
    if (includeLegacy) {
      const legacyTemplates = searchLegacy({ category });
      templates = [...templates, ...legacyTemplates] as any[];
    }

    // Enrich with analytics
    if (includeAnalytics) {
      templates = await this.enrichWithAnalytics(templates);
      templates = this.rankByScore(templates);
    }

    return templates;
  }

  /**
   * Get all categories
   */
  async getAllCategories(options: {
    includeLegacy?: boolean;
  } = {}): Promise<string[]> {
    const { includeLegacy = true } = options;

    const comprehensiveCategories = ComprehensiveLibrary.getCategories();
    const legacyCategories = includeLegacy ? getLegacyCategories() : [];

    // Combine and deduplicate
    return [...new Set([...comprehensiveCategories, ...legacyCategories])];
  }

  /**
   * Export template
   */
  async exportTemplate(templateId: string, variables: Record<string, any>, options: Partial<ExportOptions> = {}): Promise<Buffer | string | void> {
    const template = await this.getTemplate(templateId, { includeAnalytics: false });

    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Replace variables in content
    let content = template.fullContent || template.content;
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), value);
    });

    // Export using export manager
    await exportManager.export(content, options);
    const result = content; // Fallback: return content as export manager handles download

    // Track export event
    await templateAnalytics.trackEvent({
      templateId,
      type: 'export',
      userId: variables.userId || 'anonymous',
      timestamp: new Date(),
      metadata: {
        format: options.format || 'pdf',
      },
    });

    return result;
  }

  /**
   * Get marketplace templates
   */
  async getMarketplaceTemplates(options: {
    featured?: boolean;
    category?: string;
    minRating?: number;
    maxPrice?: number;
    limit?: number;
  } = {}): Promise<any[]> {
    return templateMarketplace.searchTemplates(options);
  }

  /**
   * Purchase marketplace template
   */
  async purchaseTemplate(templateId: string, buyerId: string, buyerEmail: string): Promise<any> {
    const purchase = await templateMarketplace.purchaseTemplate({
      templateId,
      buyerId,
      buyerEmail,
      paymentMethod: 'credit_card', // Default
      licenseType: 'standard'      // Default
    });

    // Track purchase
    await templateAnalytics.trackEvent({
      templateId,
      type: 'purchase',
      userId: buyerId,
      timestamp: new Date(),
    });

    return purchase;
  }

  /**
   * Get template analytics
   */
  async getTemplateAnalytics(templateId: string): Promise<any> {
    return templateAnalytics.getTemplateAnalytics(templateId);
  }

  /**
   * Track template usage
   */
  async trackUsage(templateId: string, userId: string, event: string, metadata?: any): Promise<void> {
    await templateAnalytics.trackEvent({
      templateId,
      type: event as any,
      userId,
      timestamp: new Date(),
      metadata,
    });
  }

  /**
   * Get optimization recommendations for template
   */
  async getOptimizationRecommendations(templateId: string): Promise<any[]> {
    return templateAnalytics.generateOptimizationRecommendations(templateId);
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  /**
   * Enrich templates with analytics data
   */
  private async enrichWithAnalytics(templates: any[]): Promise<any[]> {
    return Promise.all(
      templates.map(async (template) => {
        try {
          const analytics = await templateAnalytics.getTemplateAnalytics(template.id);
          return {
            ...template,
            analytics,
            _analyticsScore: this.calculateScore(analytics),
          };
        } catch (error) {
          // If analytics fails, return template without analytics
          return {
            ...template,
            _analyticsScore: 0,
          };
        }
      })
    );
  }

  /**
   * Calculate composite score from analytics
   */
  private calculateScore(analytics: any): number {
    if (!analytics || !analytics.metrics) {
      return 0;
    }

    const {
      rating = 0,
      executionRate = 0,
      downloadCount = 0,
      successRate = 0,
    } = analytics.metrics;

    // Weighted composite score
    return (
      rating * 0.3 +
      executionRate * 0.3 +
      successRate * 0.2 +
      Math.log10(downloadCount + 1) * 0.2
    );
  }

  /**
   * Rank templates by composite score
   */
  private rankByScore(templates: any[]): any[] {
    return [...templates].sort((a, b) => {
      const scoreA = a._analyticsScore || 0;
      const scoreB = b._analyticsScore || 0;
      return scoreB - scoreA;
    });
  }
}

// Singleton instance
export const templateOrchestrator = new TemplateOrchestrator();

// Export commonly used methods
export const {
  searchTemplates,
  getTemplate,
  generateWithAI,
  getPopularTemplates,
  getTemplatesByCategory,
  getAllCategories,
  exportTemplate,
  getMarketplaceTemplates,
  purchaseTemplate,
  getTemplateAnalytics,
  trackUsage,
} = templateOrchestrator;
