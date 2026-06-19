/**
 * Security, Compliance & Audit Trail System
 * 
 * Features:
 * - Comprehensive audit logging
 * - Compliance framework scanning
 * - Security controls and encryption
 * - Access control management
 * - Data privacy compliance (GDPR, CCPA)
 * - Penetration testing helpers
 */

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  changes?: AuditChange[];
  metadata: {
    ipAddress: string;
    userAgent: string;
    sessionId: string;
    success: boolean;
    errorMessage?: string;
  };
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: 'auth' | 'data' | 'config' | 'security' | 'compliance';
}

export type AuditAction =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'export'
  | 'share'
  | 'download'
  | 'analyze'
  | 'permission_change'
  | 'config_change'
  | 'bulk_operation';

export interface AuditChange {
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: Date;
}

export interface ComplianceFramework {
  name: string;
  version: string;
  description: string;
  requirements: ComplianceRequirement[];
  applicability: string[];
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  category: string;
  mandatory: boolean;
  controls: ComplianceControl[];
  evidenceRequired: string[];
  testProcedure: string;
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  implementation: string;
  status: 'implemented' | 'partial' | 'not-implemented' | 'not-applicable';
  evidence: string[];
  lastTested: Date;
  nextReview: Date;
  owner: string;
}

export interface ComplianceScanResult {
  framework: string;
  scanDate: Date;
  overallScore: number; // 0-100
  status: 'compliant' | 'partial' | 'non-compliant';
  findings: ComplianceFinding[];
  recommendations: string[];
  nextScanDate: Date;
  certificationReadiness: number; // 0-100
}

export interface ComplianceFinding {
  id: string;
  requirementId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'pass' | 'fail' | 'warning';
  title: string;
  description: string;
  impact: string;
  remediation: string;
  deadline?: Date;
  assignedTo?: string;
  evidence?: string[];
}

export interface SecurityControl {
  id: string;
  category: 'access' | 'encryption' | 'audit' | 'network' | 'data' | 'application';
  name: string;
  description: string;
  isEnabled: boolean;
  strength: 'weak' | 'moderate' | 'strong';
  lastReviewed: Date;
  configuration: Record<string, any>;
}

export interface PrivacyAssessment {
  contractId: string;
  dataTypes: DataType[];
  processingActivities: ProcessingActivity[];
  legalBasis: LegalBasis[];
  dataSubjects: string[];
  retentionPeriods: Record<string, string>;
  crossBorderTransfers: CrossBorderTransfer[];
  riskLevel: 'low' | 'medium' | 'high';
  dpiaRequired: boolean;
  findings: string[];
  recommendations: string[];
}

export interface DataType {
  category: string;
  examples: string[];
  sensitivity: 'public' | 'internal' | 'confidential' | 'highly-confidential';
  volume: 'small' | 'medium' | 'large';
  retention: string;
}

export interface ProcessingActivity {
  purpose: string;
  legalBasis: string;
  dataCategories: string[];
  recipients: string[];
  safeguards: string[];
}

export interface LegalBasis {
  type: 'consent' | 'contract' | 'legal-obligation' | 'legitimate-interest' | 'vital-interest' | 'public-task';
  description: string;
  documentation: string;
}

export interface CrossBorderTransfer {
  destination: string;
  mechanism: 'adequacy' | 'scc' | 'bcr' | 'certification' | 'other';
  safeguards: string[];
  riskAssessment: string;
}

export class SecurityAuditSystem {
  private auditLogs: AuditLog[] = [];

  /**
   * Log an audit event
   */
  async logAuditEvent(
    userId: string,
    userName: string,
    action: AuditAction,
    resourceType: string,
    resourceId: string,
    ipAddress: string,
    userAgent: string,
    sessionId: string,
    changes?: AuditChange[],
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    const log: AuditLog = {
      id: this.generateAuditId(),
      timestamp: new Date(),
      userId,
      userName,
      action,
      resourceType,
      resourceId,
      changes,
      metadata: {
        ipAddress,
        userAgent,
        sessionId,
        success,
        errorMessage,
      },
      severity: this.determineSeverity(action, success),
      category: this.categorizeAction(action),
    };

    this.auditLogs.push(log);
    
    // In production, this would:
    // 1. Store in database
    // 2. Send to SIEM system
    // 3. Trigger alerts for critical events
    // 4. Maintain immutable audit trail

    if (log.severity === 'critical') {
      await this.triggerSecurityAlert(log);
    }
  }

  /**
   * Perform comprehensive compliance scan
   */
  async performComplianceScan(
    framework: 'GDPR' | 'CCPA' | 'HIPAA' | 'SOC2' | 'ISO27001',
    contractData: any
  ): Promise<ComplianceScanResult> {
    const frameworkConfig = this.getFrameworkConfig(framework);
    const findings: ComplianceFinding[] = [];
    let totalScore = 0;
    let maxScore = 0;

    for (const requirement of frameworkConfig.requirements) {
      maxScore += 10;
      const finding = await this.testRequirement(requirement, contractData);
      findings.push(finding);
      
      if (finding.status === 'pass') {
        totalScore += 10;
      } else if (finding.status === 'warning') {
        totalScore += 5;
      }
    }

    const overallScore = Math.round((totalScore / maxScore) * 100);
    const status = overallScore >= 90 ? 'compliant' : overallScore >= 70 ? 'partial' : 'non-compliant';

    const recommendations = this.generateComplianceRecommendations(findings);

    return {
      framework,
      scanDate: new Date(),
      overallScore,
      status,
      findings,
      recommendations,
      nextScanDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      certificationReadiness: overallScore,
    };
  }

  /**
   * Assess privacy compliance (GDPR/CCPA)
   */
  async assessPrivacyCompliance(
    contractText: string,
    jurisdiction: string
  ): Promise<PrivacyAssessment> {
    const dataTypes = this.identifyDataTypes(contractText);
    const processingActivities = this.identifyProcessingActivities(contractText);
    const legalBasis = this.determineLegalBasis(contractText);
    const crossBorderTransfers = this.identifyCrossBorderTransfers(contractText);
    
    const riskLevel = this.assessPrivacyRisk(dataTypes, processingActivities, crossBorderTransfers);
    const dpiaRequired = this.requiresDPIA(dataTypes, processingActivities, riskLevel);

    const findings: string[] = [];
    const recommendations: string[] = [];

    // Check for required clauses
    if (!contractText.toLowerCase().includes('data protection')) {
      findings.push('Missing data protection clause');
      recommendations.push('Add comprehensive data protection and privacy terms');
    }

    if (jurisdiction.includes('EU') && !contractText.toLowerCase().includes('gdpr')) {
      findings.push('GDPR compliance not explicitly addressed');
      recommendations.push('Include GDPR-specific terms and data subject rights');
    }

    if (jurisdiction.includes('CA') && !contractText.toLowerCase().includes('ccpa')) {
      findings.push('CCPA compliance not explicitly addressed');
      recommendations.push('Include CCPA-specific consumer rights and disclosures');
    }

    if (crossBorderTransfers.length > 0 && !contractText.toLowerCase().includes('standard contractual clauses')) {
      findings.push('Cross-border transfers without proper safeguards');
      recommendations.push('Implement Standard Contractual Clauses or other approved transfer mechanisms');
    }

    return {
      contractId: 'temp_id',
      dataTypes,
      processingActivities,
      legalBasis,
      dataSubjects: ['customers', 'employees', 'vendors'], // Would be extracted from contract
      retentionPeriods: {
        'Personal Data': '7 years',
        'Financial Data': '10 years',
        'Marketing Data': '2 years',
      },
      crossBorderTransfers,
      riskLevel,
      dpiaRequired,
      findings,
      recommendations,
    };
  }

  /**
   * Generate security audit report
   */
  async generateSecurityReport(
    startDate: Date,
    endDate: Date
  ): Promise<{
    summary: {
      totalEvents: number;
      criticalEvents: number;
      failedLogins: number;
      unauthorizedAccess: number;
      dataExports: number;
    };
    topUsers: Array<{ userId: string; actions: number }>;
    topActions: Array<{ action: string; count: number }>;
    securityIncidents: AuditLog[];
    recommendations: string[];
  }> {
    const logs = this.auditLogs.filter(
      log => log.timestamp >= startDate && log.timestamp <= endDate
    );

    const summary = {
      totalEvents: logs.length,
      criticalEvents: logs.filter(l => l.severity === 'critical').length,
      failedLogins: logs.filter(l => l.action === 'login' && !l.metadata.success).length,
      unauthorizedAccess: logs.filter(l => !l.metadata.success && l.severity === 'error').length,
      dataExports: logs.filter(l => l.action === 'export' || l.action === 'download').length,
    };

    // Aggregate by user
    const userActions = new Map<string, number>();
    logs.forEach(log => {
      userActions.set(log.userId, (userActions.get(log.userId) || 0) + 1);
    });
    const topUsers = Array.from(userActions.entries())
      .map(([userId, actions]) => ({ userId, actions }))
      .sort((a, b) => b.actions - a.actions)
      .slice(0, 10);

    // Aggregate by action
    const actionCounts = new Map<string, number>();
    logs.forEach(log => {
      actionCounts.set(log.action, (actionCounts.get(log.action) || 0) + 1);
    });
    const topActions = Array.from(actionCounts.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const securityIncidents = logs.filter(
      l => l.severity === 'critical' || l.severity === 'error'
    );

    const recommendations = this.generateSecurityRecommendations(summary, securityIncidents);

    return {
      summary,
      topUsers,
      topActions,
      securityIncidents,
      recommendations,
    };
  }

  /**
   * Implement access control policies
   */
  async enforceAccessControl(
    userId: string,
    resourceId: string,
    action: 'read' | 'write' | 'delete' | 'share',
    resourceType: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    // This would check:
    // 1. User permissions
    // 2. Resource ownership
    // 3. Role-based access control (RBAC)
    // 4. Attribute-based access control (ABAC)
    // 5. Time-based restrictions
    // 6. IP whitelist/blacklist

    // Placeholder implementation
    const hasPermission = true; // Would check actual permissions
    
    if (!hasPermission) {
      await this.logAuditEvent(
        userId,
        'Unknown',
        action as AuditAction,
        resourceType,
        resourceId,
        '0.0.0.0',
        'Unknown',
        'session',
        undefined,
        false,
        'Access denied: Insufficient permissions'
      );
      
      return {
        allowed: false,
        reason: 'You do not have permission to perform this action',
      };
    }

    return { allowed: true };
  }

  // Private helper methods

  private generateAuditId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private determineSeverity(action: AuditAction, success: boolean): 'info' | 'warning' | 'error' | 'critical' {
    if (!success) {
      if (['delete', 'permission_change', 'config_change'].includes(action)) {
        return 'critical';
      }
      return 'error';
    }

    if (['delete', 'permission_change', 'config_change'].includes(action)) {
      return 'warning';
    }

    return 'info';
  }

  private categorizeAction(action: AuditAction): 'auth' | 'data' | 'config' | 'security' | 'compliance' {
    const categoryMap: Record<AuditAction, 'auth' | 'data' | 'config' | 'security' | 'compliance'> = {
      login: 'auth',
      logout: 'auth',
      create: 'data',
      read: 'data',
      update: 'data',
      delete: 'data',
      export: 'compliance',
      share: 'data',
      download: 'data',
      analyze: 'data',
      permission_change: 'security',
      config_change: 'config',
      bulk_operation: 'data',
    };

    return categoryMap[action] || 'data';
  }

  private async triggerSecurityAlert(log: AuditLog): Promise<void> {
    // In production, this would:
    // 1. Send email to security team
    // 2. Create incident ticket
    // 3. Trigger webhook
    // 4. Log to SIEM
    console.warn('SECURITY ALERT:', log);
  }

  private getFrameworkConfig(framework: string): ComplianceFramework {
    // Return framework-specific configuration
    // This would be loaded from database or config files
    return {
      name: framework,
      version: '1.0',
      description: `${framework} compliance framework`,
      requirements: [],
      applicability: [],
    };
  }

  private async testRequirement(
    requirement: ComplianceRequirement,
    data: any
  ): Promise<ComplianceFinding> {
    // Test specific requirement
    // This would have framework-specific test logic
    return {
      id: this.generateAuditId(),
      requirementId: requirement.id,
      severity: 'medium',
      status: 'pass',
      title: requirement.title,
      description: requirement.description,
      impact: 'None',
      remediation: 'N/A',
    };
  }

  private generateComplianceRecommendations(findings: ComplianceFinding[]): string[] {
    const recommendations: string[] = [];
    
    const criticalFindings = findings.filter(f => f.severity === 'critical' && f.status === 'fail');
    if (criticalFindings.length > 0) {
      recommendations.push(`Address ${criticalFindings.length} critical compliance gaps immediately`);
    }

    const highFindings = findings.filter(f => f.severity === 'high' && f.status === 'fail');
    if (highFindings.length > 0) {
      recommendations.push(`Remediate ${highFindings.length} high-priority findings within 30 days`);
    }

    return recommendations;
  }

  private identifyDataTypes(text: string): DataType[] {
    const dataTypes: DataType[] = [];
    
    if (text.toLowerCase().includes('personal data') || text.toLowerCase().includes('pii')) {
      dataTypes.push({
        category: 'Personal Identifiable Information',
        examples: ['names', 'addresses', 'email addresses'],
        sensitivity: 'confidential',
        volume: 'medium',
        retention: '7 years',
      });
    }

    if (text.toLowerCase().includes('financial') || text.toLowerCase().includes('payment')) {
      dataTypes.push({
        category: 'Financial Data',
        examples: ['payment information', 'bank details'],
        sensitivity: 'highly-confidential',
        volume: 'medium',
        retention: '10 years',
      });
    }

    return dataTypes;
  }

  private identifyProcessingActivities(text: string): ProcessingActivity[] {
    return [
      {
        purpose: 'Contract performance',
        legalBasis: 'Contract',
        dataCategories: ['Personal Data'],
        recipients: ['Service Provider', 'Subprocessors'],
        safeguards: ['Encryption', 'Access Controls'],
      },
    ];
  }

  private determineLegalBasis(text: string): LegalBasis[] {
    return [
      {
        type: 'contract',
        description: 'Processing necessary for contract performance',
        documentation: 'Contract between parties',
      },
    ];
  }

  private identifyCrossBorderTransfers(text: string): CrossBorderTransfer[] {
    const transfers: CrossBorderTransfer[] = [];
    
    if (text.toLowerCase().includes('international') || text.toLowerCase().includes('cross-border')) {
      transfers.push({
        destination: 'United States',
        mechanism: 'scc',
        safeguards: ['Standard Contractual Clauses', 'Encryption'],
        riskAssessment: 'Medium risk - US surveillance laws',
      });
    }

    return transfers;
  }

  private assessPrivacyRisk(
    dataTypes: DataType[],
    activities: ProcessingActivity[],
    transfers: CrossBorderTransfer[]
  ): 'low' | 'medium' | 'high' {
    let riskScore = 0;
    
    // Score based on data sensitivity
    dataTypes.forEach(dt => {
      if (dt.sensitivity === 'highly-confidential') riskScore += 3;
      else if (dt.sensitivity === 'confidential') riskScore += 2;
      else if (dt.sensitivity === 'internal') riskScore += 1;
    });

    // Score based on cross-border transfers
    riskScore += transfers.length * 2;

    if (riskScore >= 6) return 'high';
    if (riskScore >= 3) return 'medium';
    return 'low';
  }

  private requiresDPIA(
    dataTypes: DataType[],
    activities: ProcessingActivity[],
    riskLevel: 'low' | 'medium' | 'high'
  ): boolean {
    // DPIA required for high-risk processing
    if (riskLevel === 'high') return true;
    
    // DPIA required for sensitive data at scale
    const hasSensitiveData = dataTypes.some(dt => dt.sensitivity === 'highly-confidential');
    const largeScale = dataTypes.some(dt => dt.volume === 'large');
    
    return hasSensitiveData && largeScale;
  }

  private generateSecurityRecommendations(
    summary: any,
    incidents: AuditLog[]
  ): string[] {
    const recommendations: string[] = [];

    if (summary.failedLogins > 10) {
      recommendations.push('Implement account lockout policy after failed login attempts');
      recommendations.push('Enable multi-factor authentication for all users');
    }

    if (summary.unauthorizedAccess > 0) {
      recommendations.push('Review and update access control policies');
      recommendations.push('Conduct security awareness training');
    }

    if (summary.dataExports > 100) {
      recommendations.push('Implement data loss prevention (DLP) controls');
      recommendations.push('Require approval workflow for bulk data exports');
    }

    return recommendations;
  }
}

// Utility functions

export function getSeverityColor(severity: string): string {
  const colors = {
    'critical': 'text-red-600',
    'high': 'text-orange-600',
    'medium': 'text-yellow-600',
    'low': 'text-blue-600',
  };
  return colors[severity as keyof typeof colors] || 'text-gray-600';
}

export function getStatusBadge(status: string): string {
  const badges = {
    'pass': 'Compliant',
    'fail': 'Non-Compliant',
    'warning': 'Needs Review',
  };
  return badges[status as keyof typeof badges] || status;
}

export function formatAuditAction(action: AuditAction): string {
  return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
