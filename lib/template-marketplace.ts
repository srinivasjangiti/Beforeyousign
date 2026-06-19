/**
 * Template Marketplace Platform
 * 
 * COMPETITIVE MOATS:
 * - Lawyer-created premium templates
 * - Quality verification and legal review
 * - Revenue sharing model (70/30 split)
 * - Template performance metrics
 * - Customer reviews and ratings
 * - Automated royalty payments
 * - Exclusive template licensing
 */

import type {
  MarketplaceTemplate,
  TemplateCreator,
  CreatorCredentials,
  CreatorVerification,
  CreatorPerformance,
  PayoutInfo,
  CreatorSettings,
  TemplatePurchase,
  TemplateReview
} from './template-types';

// Re-export for backward compatibility
export type {
  MarketplaceTemplate,
  TemplateCreator,
  CreatorCredentials,
  CreatorVerification,
  CreatorPerformance,
  PayoutInfo,
  CreatorSettings,
  TemplatePurchase,
  TemplateReview
};

interface MarketplaceState {
  id: string;
  
  // Creator info
  creatorId: string;
  creatorType: 'lawyer' | 'law-firm' | 'legal-tech' | 'platform';
  creatorName: string;
  creatorCredentials: {
    barAdmissions: string[];
    yearsExperience: number;
    specializations: string[];
    verified: boolean;
  };
  
  // Template details
  name: string;
  description: string;
  longDescription: string;
  category: string;
  subcategory: string;
  
  // Pricing & licensing
  pricing: {
    model: 'one-time' | 'subscription' | 'usage-based';
    price: number;
    currency: 'USD';
    discounts?: {
      volume: { quantity: number; discount: number }[];
      enterprise: number;
    };
  };
  
  licensing: {
    type: 'single-use' | 'unlimited-use' | 'team' | 'enterprise';
    restrictions?: string[];
    exclusivity?: 'exclusive' | 'non-exclusive';
    transferable: boolean;
  };
  
  // Quality & verification
  quality: {
    status: 'pending' | 'in-review' | 'approved' | 'rejected';
    reviewedBy?: string;
    reviewedAt?: Date;
    legalReviewScore: number; // 0-100
    qualityChecks: {
      check: string;
      passed: boolean;
      notes?: string;
    }[];
    certifications: string[]; // 'ABA-approved', 'SOC2-compliant', etc.
  };
  
  // Performance metrics
  metrics: {
    totalSales: number;
    revenue: number;
    downloadCount: number;
    activeUsers: number;
    
    rating: number;
    reviewCount: number;
    npsScore: number;
    
    successRate: number; // % of contracts executed successfully
    avgTimeToClose: number; // days
    disputeRate: number; // %
    
    returnRate: number; // % of refunds
  };
  
  // Content
  preview: string;
  fullContent: string;
  sampleOutputs: string[]; // Links to sample completed contracts
  
  // SEO & Discovery
  tags: string[];
  jurisdiction: string[];
  industry: string[];
  useCase: string[];
  
  // Compliance
  compliance: {
    jurisdiction: string;
    lastLegalUpdate: Date;
    nextReviewDate: Date;
    complianceNotes?: string;
  };
  
  // Versioning
  version: string;
  changelog: string[];
  
  // Marketplace status
  featured: boolean;
  promoted: boolean;
  exclusiveUntil?: Date;
  
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

// Note: TemplateCreator, TemplatePurchase, and TemplateReview interfaces
// are imported from template-types.ts and re-exported above

export class TemplateMarketplace {
  private templates: Map<string, MarketplaceTemplate> = new Map();
  private creators: Map<string, TemplateCreator> = new Map();
  private purchases: Map<string, TemplatePurchase> = new Map();
  private reviews: Map<string, TemplateReview[]> = new Map();

  /**
   * Register as template creator
   */
  async registerCreator(params: {
    type: 'lawyer' | 'law-firm' | 'legal-tech';
    name: string;
    bio: string;
    credentials: any;
    documents: { type: string; url: string }[];
  }): Promise<string> {
    const creatorId = `creator-${Date.now()}`;
    
    const creator: TemplateCreator = {
      id: creatorId,
      type: params.type,
      name: params.name,
      bio: params.bio,
      credentials: params.credentials,
      verification: {
        status: 'pending',
        documents: params.documents.map(d => ({ ...d, verified: false })),
      },
      templates: [],
      performance: {
        totalSales: 0,
        totalRevenue: 0,
        avgRating: 0,
        totalReviews: 0,
        lifetimeEarnings: 0,
        currentMonthEarnings: 0,
        pendingPayout: 0,
        templateQualityScore: 0,
        customerSatisfaction: 0,
      },
      payoutInfo: {
        method: 'bank-transfer',
        schedule: 'monthly',
        minimumPayout: 50,
        accountDetails: {},
      },
      settings: {
        publicProfile: true,
        allowMessages: true,
        autoApproveReviews: false,
      },
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };
    
    this.creators.set(creatorId, creator);
    
    // Trigger verification process
    await this.initiateVerification(creatorId);
    
    return creatorId;
  }

  /**
   * Submit template to marketplace
   */
  async submitTemplate(params: {
    creatorId: string;
    template: {
      name: string;
      description: string;
      longDescription: string;
      category: string;
      content: string;
      pricing: any;
      licensing: any;
    };
  }): Promise<string> {
    const creator = this.creators.get(params.creatorId);
    if (!creator) throw new Error('Creator not found');
    if (creator.verification.status !== 'verified') {
      throw new Error('Creator must be verified to submit templates');
    }
    
    const templateId = `mkt-template-${Date.now()}`;
    
    const template: MarketplaceTemplate = {
      id: templateId,
      creatorId: params.creatorId,
      creatorType: creator.type,
      creatorName: creator.name,
      creatorCredentials: {
        barAdmissions: creator.credentials.barAdmissions.map(b => b.state),
        yearsExperience: creator.credentials.yearsExperience,
        specializations: creator.credentials.specializations,
        verified: creator.verification.status === 'verified',
      },
      name: params.template.name,
      description: params.template.description,
      longDescription: params.template.longDescription,
      category: params.template.category,
      subcategory: '',
      pricing: params.template.pricing,
      licensing: params.template.licensing,
      quality: {
        status: 'in-review',
        legalReviewScore: 0,
        qualityChecks: [],
        certifications: [],
      },
      metrics: {
        totalSales: 0,
        revenue: 0,
        downloadCount: 0,
        activeUsers: 0,
        rating: 0,
        reviewCount: 0,
        npsScore: 0,
        successRate: 0,
        avgTimeToClose: 0,
        disputeRate: 0,
        returnRate: 0,
      },
      preview: params.template.content.substring(0, 500),
      fullContent: params.template.content,
      sampleOutputs: [],
      tags: [],
      jurisdiction: [],
      industry: [],
      useCase: [],
      compliance: {
        jurisdiction: 'US',
        lastLegalUpdate: new Date(),
        nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
      version: '1.0.0',
      changelog: ['Initial release'],
      featured: false,
      promoted: false,
      updatedAt: new Date(),
    } as any;
    
    this.templates.set(templateId, template);
    creator.templates.push(templateId);
    
    // Trigger quality review process
    await this.initiateQualityReview(templateId);
    
    return templateId;
  }

  /**
   * Purchase template
   */
  async purchaseTemplate(params: {
    templateId: string;
    buyerId: string;
    buyerEmail: string;
    paymentMethod: string;
    licenseType: string;
  }): Promise<string> {
    const template = this.templates.get(params.templateId);
    if (!template) throw new Error('Template not found');
    if (template.quality?.status !== 'approved') {
      throw new Error('Template not approved for sale');
    }
    
    const purchaseId = `purchase-${Date.now()}`;
    const amount = template.pricing.price;
    
    // Calculate revenue split (70/30)
    const creatorShare = amount * 0.70;
    const platformShare = amount * 0.30;
    
    const purchase: TemplatePurchase = {
      id: purchaseId,
      templateId: params.templateId,
      templateName: template.name,
      buyerId: params.buyerId,
      buyerEmail: params.buyerEmail,
      sellerId: template.creatorId,
      sellerName: template.creatorName,
      amount,
      currency: 'USD',
      paymentMethod: params.paymentMethod,
      transactionId: `txn-${Date.now()}`,
      revenueShare: {
        platform: platformShare,
        creator: creatorShare,
      },
      license: {
        type: params.licenseType,
      },
      status: 'completed',
      purchasedAt: new Date(),
      downloads: 0,
    };
    
    this.purchases.set(purchaseId, purchase);
    
    // Update template metrics
    template.metrics.totalSales++;
    template.metrics.revenue += amount;
    
    // Update creator earnings
    const creator = this.creators.get(template.creatorId);
    if (creator) {
      creator.performance.totalSales++;
      creator.performance.totalRevenue += amount;
      creator.performance.lifetimeEarnings += creatorShare;
      creator.performance.currentMonthEarnings += creatorShare;
      creator.performance.pendingPayout += creatorShare;
    }
    
    // Send notifications
    await this.notifyPurchase(purchase);
    
    return purchaseId;
  }

  /**
   * Submit review for template
   */
  async submitReview(params: {
    templateId: string;
    purchaseId: string;
    reviewerId: string;
    rating: number;
    nps: number;
    dimensions: any;
    title: string;
    content: string;
    pros: string[];
    cons: string[];
    outcome: {
      executionSuccess: boolean;
      timeToClose?: number;
      hadDisputes: boolean;
    };
  }): Promise<string> {
    const purchase = this.purchases.get(params.purchaseId);
    if (!purchase) throw new Error('Purchase not found');
    if (purchase.buyerId !== params.reviewerId) {
      throw new Error('Only purchaser can review');
    }
    
    const reviewId = `review-${Date.now()}`;
    
    const review: TemplateReview = {
      id: reviewId,
      templateId: params.templateId,
      reviewerId: params.reviewerId,
      reviewerName: '', // Would fetch from user service
      reviewerType: 'customer',
      rating: params.rating,
      nps: params.nps,
      dimensions: params.dimensions,
      title: params.title,
      content: params.content,
      pros: params.pros,
      cons: params.cons,
      useCase: '',
      jurisdiction: '',
      executionSuccess: params.outcome.executionSuccess,
      timeToClose: params.outcome.timeToClose,
      hadDisputes: params.outcome.hadDisputes,
      verified: true, // Verified purchase
      helpful: 0,
      notHelpful: 0,
      createdAt: new Date(),
    };
    
    const templateReviews = this.reviews.get(params.templateId) || [];
    templateReviews.push(review);
    this.reviews.set(params.templateId, templateReviews);
    
    // Update template metrics
    const template = this.templates.get(params.templateId);
    if (template) {
      const allReviews = templateReviews;
      template.metrics.reviewCount = allReviews.length;
      template.metrics.rating = 
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      template.metrics.npsScore = 
        allReviews.reduce((sum, r) => sum + r.nps, 0) / allReviews.length;
    }
    
    // Notify creator
    await this.notifyCreatorOfReview(template!.creatorId, reviewId);
    
    return reviewId;
  }

  /**
   * Search marketplace templates
   */
  searchTemplates(params: {
    query?: string;
    category?: string;
    jurisdiction?: string;
    priceRange?: { min: number; max: number };
    minRating?: number;
    sortBy?: 'popular' | 'newest' | 'rating' | 'price-low' | 'price-high';
    limit?: number;
  }): MarketplaceTemplate[] {
    let results = Array.from(this.templates.values())
      .filter(t => t.quality?.status === 'approved');
    
    // Apply filters
    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    if (params.category) {
      results = results.filter(t => t.category === params.category);
    }
    
    if (params.jurisdiction) {
      results = results.filter(t => params.jurisdiction && t.jurisdiction.includes(params.jurisdiction));
    }
    
    if (params.priceRange) {
      results = results.filter(t =>
        t.pricing.price >= params.priceRange!.min &&
        t.pricing.price <= params.priceRange!.max
      );
    }
    
    if (params.minRating) {
      results = results.filter(t => t.metrics.rating >= params.minRating!);
    }
    
    // Sort
    switch (params.sortBy) {
      case 'popular':
        results.sort((a, b) => b.metrics.totalSales - a.metrics.totalSales);
        break;
      case 'newest':
        results.sort((a, b) => {
          const aDate = a.publishedAt || new Date(0);
          const bDate = b.publishedAt || new Date(0);
          return bDate.getTime() - aDate.getTime();
        });
        break;
      case 'rating':
        results.sort((a, b) => b.metrics.rating - a.metrics.rating);
        break;
      case 'price-low':
        results.sort((a, b) => a.pricing.price - b.pricing.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.pricing.price - a.pricing.price);
        break;
    }
    
    return results.slice(0, params.limit || 20);
  }

  /**
   * Get creator dashboard
   */
  getCreatorDashboard(creatorId: string): {
    creator: TemplateCreator;
    templates: MarketplaceTemplate[];
    recentSales: TemplatePurchase[];
    earnings: {
      thisMonth: number;
      lastMonth: number;
      lifetime: number;
      pending: number;
    };
    topTemplates: { template: MarketplaceTemplate; sales: number }[];
  } {
    const creator = this.creators.get(creatorId);
    if (!creator) throw new Error('Creator not found');
    
    const templates = creator.templates
      .map(id => this.templates.get(id))
      .filter(t => t !== undefined) as MarketplaceTemplate[];
    
    const purchases = Array.from(this.purchases.values())
      .filter(p => p.sellerId === creatorId);
    
    const recentSales = purchases
      .sort((a, b) => b.purchasedAt.getTime() - a.purchasedAt.getTime())
      .slice(0, 10);
    
    const topTemplates = templates
      .map(t => ({ template: t, sales: t.metrics.totalSales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
    
    return {
      creator,
      templates,
      recentSales,
      earnings: {
        thisMonth: creator.performance.currentMonthEarnings,
        lastMonth: 0, // Would calculate from historical data
        lifetime: creator.performance.lifetimeEarnings,
        pending: creator.performance.pendingPayout,
      },
      topTemplates,
    };
  }

  /**
   * Process monthly payouts
   */
  async processPayouts(): Promise<{
    totalPaid: number;
    payoutCount: number;
    creators: { creatorId: string; amount: number }[];
  }> {
    const payouts: { creatorId: string; amount: number }[] = [];
    let totalPaid = 0;
    
    for (const [creatorId, creator] of this.creators) {
      if (creator.performance.pendingPayout >= creator.payoutInfo.minimumPayout) {
        const amount = creator.performance.pendingPayout;
        
        // Process payout (in production, integrate with payment processor)
        await this.processPayout(creatorId, amount);
        
        // Update creator record
        creator.performance.pendingPayout = 0;
        
        payouts.push({ creatorId, amount });
        totalPaid += amount;
      }
    }
    
    return {
      totalPaid,
      payoutCount: payouts.length,
      creators: payouts,
    };
  }

  /**
   * Helper methods
   */
  private async initiateVerification(creatorId: string): Promise<void> {
    // In production, trigger verification workflow
    console.log('Initiating verification for creator:', creatorId);
  }

  private async initiateQualityReview(templateId: string): Promise<void> {
    // In production, trigger quality review process
    console.log('Initiating quality review for template:', templateId);
  }

  private async notifyPurchase(purchase: TemplatePurchase): Promise<void> {
    // Notify buyer and seller
    console.log('Purchase notification:', purchase.id);
  }

  private async notifyCreatorOfReview(creatorId: string, reviewId: string): Promise<void> {
    // Notify creator of new review
    console.log('Review notification to creator:', creatorId, reviewId);
  }

  private async processPayout(creatorId: string, amount: number): Promise<void> {
    // Integrate with payment processor (Stripe Connect, PayPal, etc.)
    console.log('Processing payout:', creatorId, amount);
  }
}

// Export singleton
export const templateMarketplace = new TemplateMarketplace();
