/**
 * Unified Template Types
 * Central type definitions for the template system
 */

// ============================================================================
// CORE TEMPLATE TYPES
// ============================================================================

export interface BaseTemplateMetadata {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  description: string;
  
  // Pricing
  price: number;
  isPremium: boolean;
  tier?: 'free' | 'pro' | 'enterprise';
  
  // Legal
  jurisdiction: string[];
  industry: string[];
  tags: string[];
  
  // Metrics
  riskScore: number;
  complexity: 'Simple' | 'Moderate' | 'Complex' | 'Expert';
  estimatedTime: string;
  
  // Content
  preview: string;
  fullContent: string;
  variables: TemplateVariable[];
  
  // Stats
  downloadCount: number;
  rating: number;
  reviewCount: number;
  
  // Metadata
  lastUpdated: string;
  version: string;
}

export interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'textarea' | 'currency' | 'percentage' | 'boolean';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    message?: string;
  };
  helpText?: string;
  placeholder?: string;
  conditional?: {
    showIf: string;
    equals: any;
  };
}

export interface ConditionalClause {
  id: string;
  title: string;
  content: string;
  condition: {
    variable: string;
    operator: '==' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'not-contains';
    value: any;
  };
  category: 'required' | 'recommended' | 'optional';
}

// Extended template for marketplace and advanced features
export interface ExtendedTemplateMetadata extends BaseTemplateMetadata {
  // Creator info
  creatorId?: string;
  creatorType?: 'lawyer' | 'law-firm' | 'legal-tech' | 'platform';
  creatorName?: string;
  
  // Additional legal metadata
  supportedJurisdictions: {
    code: string;
    name: string;
    variations?: string;
  }[];
  lastLegalReview: string;
  reviewedBy?: string;
  
  // Extended usage info
  useCase: string[];
  
  // AI & Advanced features
  aiEnhanced: boolean;
  multiLanguage: string[];
  clauseLibrarySize: number;
  customizableFields: number;
  
  // Performance
  successRate?: number;
  
  // Content
  conditionalClauses: ConditionalClause[];
  sampleOutputs?: string[];
  longDescription?: string;
  
  // SEO
  searchKeywords: string[];
  relatedTemplates: string[];
  
  // Versioning
  changelog?: string[];
  
  // Marketplace
  featured?: boolean;
  promoted?: boolean;
  creditsRequired?: number;
  
  // Quality
  quality?: {
    status: 'pending' | 'in-review' | 'approved' | 'rejected';
    legalReviewScore?: number;
    qualityChecks?: { check: string; passed: boolean; notes?: string }[];
    certifications?: string[];
  };
  
  // Compliance
  compliance?: {
    jurisdiction: string;
    lastLegalUpdate: Date;
    nextReviewDate: Date;
    complianceNotes?: string;
  };
}

// Legacy compatibility - maps to BaseTemplateMetadata
export type ContractTemplate = BaseTemplateMetadata;

// ============================================================================
// AI TEMPLATE ENGINE TYPES
// ============================================================================

export interface AITemplateContext {
  parties: {
    name: string;
    type: 'individual' | 'corporation' | 'llc' | 'partnership' | 'nonprofit';
    jurisdiction: string;
    industry?: string;
  }[];
  
  contractType: string;
  value?: number;
  duration?: string;
  renewalTerms?: 'auto' | 'manual' | 'none';
  
  jurisdiction: string;
  regulatoryCompliance?: string[];
  industryRegulations?: string[];
  
  riskTolerance: 'low' | 'medium' | 'high';
  disputeResolution: 'litigation' | 'arbitration' | 'mediation' | 'mixed';
  
  businessModel?: string;
  customerType?: 'b2b' | 'b2c' | 'both';
  serviceDelivery?: 'online' | 'offline' | 'hybrid';
  
  customFields?: Record<string, any>;
}

export interface AIClause {
  id: string;
  title: string;
  content: string;
  category: 'essential' | 'recommended' | 'optional';
  riskLevel: 'low' | 'medium' | 'high';
  applicability: number;
  reasoning: string;
  alternatives?: {
    variant: string;
    content: string;
    pros: string[];
    cons: string[];
  }[];
  legalCitations?: string[];
  industryBestPractices?: string[];
}

export interface TemplateGenerationResult {
  templateId: string;
  content: string;
  metadata: {
    generatedAt: Date;
    confidence: number;
    riskScore: number;
    complianceChecks: ComplianceCheck[];
  };
  suggestedClauses: AIClause[];
  warnings: string[];
  recommendations: string[];
  customizationOptions: CustomizationOption[];
}

export interface ComplianceCheck {
  requirement: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
}

export interface CustomizationOption {
  field: string;
  currentValue: string;
  suggestedAlternatives: string[];
  impact: string;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface TemplateUsageAnalytics {
  templateId: string;
  metrics: {
    views: number;
    downloads: number;
    customizations: number;
    completions: number;
    abandonments: number;
    avgCustomizationTime: number;
    avgTimeToExecution: number;
    executionRate: number;
    disputeRate: number;
    renewalRate: number;
    rating: number;
    reviewCount: number;
    npsScore: number;
  };
  
  byIndustry: Record<string, number>;
  byJurisdiction: Record<string, number>;
  byContractValue: {
    under10k: number;
    from10kTo100k: number;
    from100kTo1m: number;
    over1m: number;
  };
  
  weeklyTrend: {
    week: string;
    downloads: number;
    completions: number;
  }[];
  
  clausePerformance: ClausePerformanceMetrics[];
}

export interface ClausePerformanceMetrics {
  clauseId: string;
  clauseTitle: string;
  inclusionRate: number;
  modificationRate: number;
  removalRate: number;
  disputeCausationScore: number;
  negotiationImpact: number;
  executionImpact: number;
  dealVelocity: number;
  dealSize: number;
  customerSatisfaction: number;
  aiRecommendation: 'always-include' | 'often-include' | 'situational' | 'avoid';
  reasoning: string;
  alternatives: string[];
}

export interface ABTestResult {
  testId: string;
  templateId: string;
  hypothesis: string;
  variants: ABTestVariant[];
  winner?: string;
  confidenceLevel: number;
  statisticalSignificance: boolean;
  recommendations: string[];
  startDate: string;
  endDate?: string;
  status: 'running' | 'completed' | 'paused';
}

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  changes: string[];
  metrics: {
    exposures: number;
    downloads: number;
    completions: number;
    avgTimeToComplete: number;
    executionRate: number;
    userSatisfaction: number;
  };
}

export interface OptimizationRecommendation {
  type: 'add-clause' | 'remove-clause' | 'modify-clause' | 'reorder-sections' | 'simplify-language';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  expectedImpact: {
    executionRate: number;
    timeToClose: number;
    disputeRisk: number;
    customerSatisfaction: number;
  };
  effort: 'low' | 'medium' | 'high';
  confidence: number;
  action: {
    type: string;
    details: any;
  };
}

// ============================================================================
// COLLABORATION TYPES
// ============================================================================

export interface CollaborationSession {
  id: string;
  templateId: string;
  templateName: string;
  participants: Participant[];
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
  expiresAt: Date;
  activeEditors: string[];
  pendingChanges: Change[];
  comments: Comment[];
}

export interface Participant {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'reviewer' | 'viewer';
  joinedAt: Date;
  lastActiveAt: Date;
  cursor?: {
    position: number;
    selection?: { start: number; end: number };
  };
}

export interface Change {
  id: string;
  userId: string;
  userName: string;
  timestamp: Date;
  type: 'insert' | 'delete' | 'modify' | 'format';
  section: string;
  position: number;
  before: string;
  after: string;
  status: 'pending' | 'accepted' | 'rejected';
  reviewedBy?: string;
  reviewNote?: string;
}

export interface Comment {
  id: string;
  threadId: string;
  userId: string;
  userName: string;
  timestamp: Date;
  content: string;
  mentions: string[];
  position: {
    section: string;
    offset: number;
  };
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  replies: Comment[];
  reactions: {
    emoji: string;
    userId: string;
  }[];
}

export interface ApprovalWorkflow {
  id: string;
  templateId: string;
  name: string;
  stages: ApprovalStage[];
  currentStage: number;
  status: 'pending' | 'in-progress' | 'approved' | 'rejected' | 'cancelled';
  submittedBy: string;
  submittedAt: Date;
  completedAt?: Date;
  comments: ApprovalComment[];
}

export interface ApprovalStage {
  id: string;
  name: string;
  order: number;
  approvers: {
    userId: string;
    name: string;
    required: boolean;
  }[];
  type: 'sequential' | 'parallel';
  approvalThreshold?: number;
  status: 'pending' | 'in-progress' | 'approved' | 'rejected';
  completedAt?: Date;
}

export interface ApprovalComment {
  stageId: string;
  userId: string;
  comment: string;
  decision: 'approve' | 'reject' | 'comment';
  timestamp: Date;
}

export interface TeamLibrary {
  id: string;
  teamId: string;
  name: string;
  description: string;
  templates: TeamTemplate[];
  permissions: TeamPermission[];
  settings: {
    requireApprovalForNew: boolean;
    allowExternalSharing: boolean;
    enforceVersionControl: boolean;
    autoBackup: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamTemplate {
  templateId: string;
  addedBy: string;
  addedAt: Date;
  category: string;
  tags: string[];
  internalName?: string;
  notes?: string;
  approvedBy?: string[];
  lastUsed?: Date;
  usageCount: number;
}

export interface TeamPermission {
  userId: string;
  role: 'admin' | 'contributor' | 'user';
  canAdd: boolean;
  canModify: boolean;
  canDelete: boolean;
  canShare: boolean;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  version: string;
  content: string;
  variables: any[];
  changes: string[];
  createdBy: string;
  createdAt: Date;
  status: 'draft' | 'review' | 'approved' | 'archived';
  approvedBy?: string;
  approvedAt?: Date;
  diffFromPrevious?: {
    additions: string[];
    deletions: string[];
    modifications: string[];
  };
  usageCount: number;
  lastUsed?: Date;
}

// ============================================================================
// MARKETPLACE TYPES
// ============================================================================

export interface MarketplaceTemplate extends ExtendedTemplateMetadata {
  creatorId: string;
  creatorType: 'lawyer' | 'law-firm' | 'legal-tech' | 'platform';
  creatorName: string;
  creatorCredentials: {
    barAdmissions: string[];
    yearsExperience: number;
    specializations: string[];
    verified: boolean;
  };
  
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
  
  metrics: {
    totalSales: number;
    revenue: number;
    downloadCount: number;
    activeUsers: number;
    rating: number;
    reviewCount: number;
    npsScore: number;
    successRate: number;
    avgTimeToClose: number;
    disputeRate: number;
    returnRate: number;
  };
  
  publishedAt?: Date;
  exclusiveUntil?: Date;
}

export interface TemplateCreator {
  id: string;
  type: 'lawyer' | 'law-firm' | 'legal-tech';
  name: string;
  bio: string;
  profileImage?: string;
  credentials: CreatorCredentials;
  verification: CreatorVerification;
  templates: string[];
  performance: CreatorPerformance;
  payoutInfo: PayoutInfo;
  settings: CreatorSettings;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface CreatorCredentials {
  barAdmissions: {
    state: string;
    number: string;
    admittedYear: number;
    status: 'active' | 'inactive';
  }[];
  lawDegrees: {
    degree: string;
    institution: string;
    year: number;
  }[];
  specializations: string[];
  certifications: string[];
  yearsExperience: number;
}

export interface CreatorVerification {
  status: 'pending' | 'verified' | 'rejected';
  verifiedAt?: Date;
  verifiedBy?: string;
  documents: {
    type: string;
    url: string;
    verified: boolean;
  }[];
}

export interface CreatorPerformance {
  totalSales: number;
  totalRevenue: number;
  avgRating: number;
  totalReviews: number;
  lifetimeEarnings: number;
  currentMonthEarnings: number;
  pendingPayout: number;
  templateQualityScore: number;
  customerSatisfaction: number;
}

export interface PayoutInfo {
  method: 'bank-transfer' | 'paypal' | 'stripe';
  schedule: 'weekly' | 'monthly';
  minimumPayout: number;
  accountDetails: any;
}

export interface CreatorSettings {
  publicProfile: boolean;
  allowMessages: boolean;
  autoApproveReviews: boolean;
}

export interface TemplatePurchase {
  id: string;
  templateId: string;
  templateName: string;
  buyerId: string;
  buyerEmail: string;
  buyerOrganization?: string;
  sellerId: string;
  sellerName: string;
  amount: number;
  currency: 'USD';
  paymentMethod: string;
  transactionId: string;
  revenueShare: {
    platform: number;
    creator: number;
    referral?: number;
  };
  license: {
    type: string;
    validUntil?: Date;
    seats?: number;
    restrictions?: string[];
  };
  status: 'completed' | 'refunded' | 'disputed';
  refundReason?: string;
  refundedAt?: Date;
  purchasedAt: Date;
  downloads: number;
  lastUsed?: Date;
}

export interface TemplateReview {
  id: string;
  templateId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerType: 'customer' | 'peer-lawyer' | 'expert';
  rating: number;
  nps: number;
  dimensions: {
    legalSoundness: number;
    easeOfUse: number;
    valueForMoney: number;
    clarity: number;
    customizability: number;
  };
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  useCase: string;
  jurisdiction: string;
  contractValue?: number;
  executionSuccess: boolean;
  timeToClose?: number;
  hadDisputes: boolean;
  verified: boolean;
  helpful: number;
  notHelpful: number;
  creatorResponse?: {
    content: string;
    respondedAt: Date;
  };
  createdAt: Date;
}

// ============================================================================
// EXPORT & INTEGRATION TYPES
// ============================================================================

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'markdown' | 'latex' | 'epub' | 'plain-text';
  styling?: {
    font?: string;
    fontSize?: number;
    lineSpacing?: number;
    margins?: { top: number; bottom: number; left: number; right: number };
    headerFooter?: boolean;
    pageNumbers?: boolean;
    watermark?: string;
  };
  branding?: {
    logo?: string;
    companyName?: string;
    colors?: {
      primary: string;
      secondary: string;
      text: string;
    };
  };
  output?: {
    filename?: string;
    destination?: 'download' | 'email' | 'cloud' | 'esignature';
    compression?: boolean;
  };
}

export interface ESignatureIntegration {
  provider: 'docusign' | 'adobe-sign' | 'hellosign' | 'pandadoc';
  document: {
    name: string;
    content: string | Buffer;
    format: 'pdf' | 'docx';
  };
  signers: ESignatureSigner[];
  settings?: ESignatureSettings;
  webhooks?: {
    onSigned?: string;
    onDeclined?: string;
    onCompleted?: string;
  };
}

export interface ESignatureSigner {
  name: string;
  email: string;
  role: 'signer' | 'cc' | 'approver';
  order?: number;
  fields?: ESignatureField[];
}

export interface ESignatureField {
  type: 'signature' | 'initial' | 'date' | 'text' | 'checkbox';
  label: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  required: boolean;
}

export interface ESignatureSettings {
  sequential: boolean;
  expirationDays?: number;
  reminderDays?: number;
  emailSubject?: string;
  emailMessage?: string;
  allowDecline?: boolean;
  requireAuthentication?: boolean;
}

export interface CRMIntegration {
  provider: 'salesforce' | 'hubspot' | 'pipedrive' | 'zoho';
  action: 'create-deal' | 'update-deal' | 'attach-document' | 'log-activity';
  deal?: any;
  document?: any;
  activity?: any;
}

export interface CloudStorageIntegration {
  provider: 'google-drive' | 'dropbox' | 'onedrive' | 's3' | 'box';
  action: 'upload' | 'create-folder' | 'share' | 'sync';
  file?: any;
  sharing?: any;
  sync?: any;
}

export interface LegalPMSIntegration {
  provider: 'clio' | 'mycase' | 'practicepanther' | 'smokeball';
  action: 'create-matter' | 'attach-document' | 'log-time' | 'create-task';
  matter?: any;
  document?: any;
  timeEntry?: any;
  task?: any;
}

export interface BulkExportJob {
  id: string;
  name: string;
  templates: {
    templateId: string;
    variables: Record<string, any>;
    outputName: string;
  }[];
  format: string;
  options: ExportOptions;
  destination: {
    type: 'download' | 'email' | 'cloud' | 'ftp';
    config: any;
  };
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
  results?: {
    files: { name: string; url: string }[];
    errors: { template: string; error: string }[];
  };
  createdAt: Date;
  completedAt?: Date;
}
