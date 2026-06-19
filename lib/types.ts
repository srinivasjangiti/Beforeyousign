// Core types for contract analysis

export interface ContractAnalysis {
  summary: string;
  riskScore: number; // 0-100
  clauses: ClauseAnalysis[];
  redFlags: RedFlag[];
  recommendations: string[];
  insights?: ContractInsights;
  metadata: ContractMetadata;
  industryBenchmark?: IndustryBenchmark;
  comparativeInsights?: ComparativeInsight[];
  confidence?: AnalysisConfidence;
}

export interface ClauseAnalysis {
  id: string;
  title: string;
  originalText: string;
  plainLanguage: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  category: ClauseCategory;
  concerns: string[];
  recommendation?: string;
  position: {
    start: number;
    end: number;
  };
  fairnessScore?: number; // 0-100, how fair/balanced this clause is
  industryComparison?: {
    averageStrictness: number; // 0-100, how strict this clause is compared to industry average
    percentile: number; // where this clause falls (0-100)
    commonAlternatives?: string[];
    fairerVersion?: string;
  };
  negotiationStrategy?: {
    priority: 'high' | 'medium' | 'low';
    leverage: 'strong' | 'moderate' | 'weak';
    suggestedApproach?: string;
    fallbackPositions?: string[];
    marketPrecedents?: string[];
  };
}

// Alias for compatibility
export type ContractClause = ClauseAnalysis;

export interface RedFlag {
  id: string;
  type: RedFlagType;
  severity: 'warning' | 'danger' | 'critical';
  title: string;
  description: string;
  affectedClauses: string[];
  recommendation: string;
}

export type RedFlagType =
  | 'ip_transfer'
  | 'unlimited_liability'
  | 'auto_renewal'
  | 'restricted_termination'
  | 'one_sided_amendment'
  | 'venue_forum'
  | 'waiver_of_rights'
  | 'confidentiality_overreach'
  | 'indemnification'
  | 'non_compete'
  | 'payment_terms'
  | 'dispute_resolution'
  | 'other';

export type ClauseCategory =
  | 'payment'
  | 'termination'
  | 'liability'
  | 'intellectual_property'
  | 'confidentiality'
  | 'dispute_resolution'
  | 'warranties'
  | 'indemnification'
  | 'non_compete'
  | 'general'
  | 'other';

export interface ContractMetadata {
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  documentType?: string;
  parties?: string[];
  effectiveDate?: string;
  expirationDate?: string;
  governingLaw?: string;
  contractValue?: string;
  autoRenewal?: boolean;
}

export interface ContractInsights {
  missingClauses: string[]; // Important protections absent from this contract
  contradictions: Array<{
    clause1: string;
    clause2: string;
    issue: string;
  }>;
  unusualTerms: Array<{
    clauseId: string;
    reason: string;
  }>;
  strengthsToKeep: string[]; // Favorable terms worth preserving
}

export interface AnalysisRequest {
  contractText: string;
  fileName: string;
  fileSize: number;
  documentType?: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis?: ContractAnalysis;
  error?: string;
  requestId?: string;
}

export interface IndustryBenchmark {
  industry: string;
  averageRiskScore: number;
  comparisonSummary: string;
  keyDifferences: {
    clause: string;
    yourContract: string;
    industryStandard: string;
    multiplier?: number; // e.g., "3x stricter"
  }[];
}

export interface ComparativeInsight {
  id: string;
  type: 'stricter' | 'fairer' | 'standard' | 'unusual';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  clauseId?: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  riskScore: number;
  useCase: string;
  downloadUrl?: string;
  preview?: string;
}

export interface ClauseAlternative {
  originalClause: string;
  fairerVersion: string;
  explanation: string;
  votes: number;
  source: 'community' | 'expert' | 'legal_standard';
  contributor?: string;
}

export interface AnalysisConfidence {
  overall: number; // 0-100
  riskScoreConfidence: number;
  clauseAnalysisConfidence: number;
  model: string;
  modelVersion: string;
  analysisDate: string;
  notes?: string[];
}
