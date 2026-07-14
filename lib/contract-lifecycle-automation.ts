/**
 * Contract Lifecycle Automation
 * 
 * Comprehensive automation for the entire contract lifecycle:
 * - Automated approval workflows
 * - Smart renewal management
 * - Obligation tracking and alerts
 * - Milestone tracking
 * - Automated compliance checks
 * - Performance monitoring
 * - Relationship intelligence
 */

export interface ContractLifecycle {
  contractId: string;
  
  // Lifecycle stages
  currentStage: LifecycleStage;
  stageHistory: StageTransition[];
  
  // Approval workflow
  approvalWorkflow?: ApprovalWorkflow;
  
  // Obligations
  obligations: Obligation[];
  
  // Milestones
  milestones: Milestone[];
  
  // Renewal management
  renewalTracking?: RenewalTracking;
  
  // Performance tracking
  performanceMetrics: PerformanceMetric[];
  
  // Compliance monitoring
  complianceChecks: ComplianceCheck[];
  
  // Automation rules
  automationRules: AutomationRule[];
  
  // Alerts
  activeAlerts: Alert[];
}

export type LifecycleStage =
  | 'draft'
  | 'internal-review'
  | 'legal-review'
  | 'finance-review'
  | 'executive-approval'
  | 'negotiation'
  | 'signature-pending'
  | 'active'
  | 'amendment-pending'
  | 'renewal-pending'
  | 'expired'
  | 'terminated'
  | 'archived';

export interface StageTransition {
  from: LifecycleStage;
  to: LifecycleStage;
  timestamp: Date;
  triggeredBy: string;
  reason?: string;
  automated: boolean;
}

export interface ApprovalWorkflow {
  id: string;
  workflowType: 'sequential' | 'parallel' | 'conditional';
  steps: ApprovalStep[];
  currentStepIndex: number;
  status: 'pending' | 'in-progress' | 'approved' | 'rejected' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  escalations: Escalation[];
}

export interface ApprovalStep {
  id: string;
  order: number;
  name: string;
  approvers: Approver[];
  approvalType: 'any' | 'all' | 'majority';
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  dueDate: Date;
  responses: ApprovalResponse[];
  conditions?: ApprovalCondition[];
  autoApproveRules?: AutoApproveRule[];
}

export interface Approver {
  userId: string;
  userName: string;
  email: string;
  role: 'legal' | 'finance' | 'executive' | 'department-head' | 'manager' | 'compliance';
  required: boolean;
  delegatedTo?: string;
}

export interface ApprovalResponse {
  approverId: string;
  decision: 'approved' | 'rejected' | 'request-changes';
  timestamp: Date;
  comments?: string;
  attachments?: string[];
  conditionalApproval?: string; // Conditions for approval
}

export interface ApprovalCondition {
  type: 'contract-value' | 'department' | 'risk-level' | 'vendor-tier' | 'custom';
  operator: '>' | '<' | '=' | '!=' | '>=' | '<=';
  value: any;
}

export interface AutoApproveRule {
  condition: string;
  maxValue?: number;
  approvedVendors?: string[];
  preApprovedTerms?: string[];
}

export interface Escalation {
  triggeredAt: Date;
  reason: 'overdue' | 'high-priority' | 'threshold-exceeded' | 'manual';
  escalatedTo: string[];
  resolved: boolean;
  resolvedAt?: Date;
}

export interface Obligation {
  id: string;
  type: 'payment' | 'delivery' | 'reporting' | 'compliance' | 'milestone' | 'renewal' | 'custom';
  title: string;
  description: string;
  
  // Responsibility
  responsibleParty: 'us' | 'counterparty' | 'both';
  assignedTo?: string;
  
  // Timing
  dueDate?: Date;
  frequency?: 'one-time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  nextDueDate?: Date;
  
  // Status
  status: 'upcoming' | 'due-soon' | 'overdue' | 'completed' | 'waived';
  completedDate?: Date;
  completedBy?: string;
  
  // Tracking
  completionEvidence?: string[];
  automatedTracking: boolean;
  trackingSource?: 'api' | 'webhook' | 'manual' | 'email';
  
  // Impact
  criticality: 'low' | 'medium' | 'high' | 'critical';
  penaltyForMiss?: string;
  
  // Automation
  autoReminders: boolean;
  reminderSchedule?: ReminderSchedule[];
}

export interface ReminderSchedule {
  daysBeforeDue: number;
  recipients: string[];
  channels: ('email' | 'slack' | 'teams' | 'sms')[];
  sent: boolean;
  sentAt?: Date;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  completionCriteria: string[];
  
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed' | 'at-risk';
  percentComplete: number;
  actualCompletionDate?: Date;
  
  dependencies: string[]; // IDs of other milestones
  blockers: Blocker[];
  
  owner: string;
  stakeholders: string[];
  
  financialImpact?: number;
}

export interface Blocker {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: string;
}

export interface RenewalTracking {
  renewalDate: Date;
  renewalType: 'auto-renew' | 'manual-renew' | 'renegotiate' | 'terminate';
  renewalTerm: string; // e.g., "12 months", "2 years"
  
  // Timing
  daysUntilRenewal: number;
  noticePeriod: number; // Days before renewal to give notice
  noticeDeadline: Date;
  
  // Decision tracking
  renewalDecision?: 'renew' | 'renegotiate' | 'terminate' | 'pending';
  decisionMaker: string;
  decisionDate?: Date;
  decisionReason?: string;
  
  // Renegotiation
  renegotiationNeeded: boolean;
  renegotiationReasons: string[];
  proposedChanges?: string[];
  
  // Economics
  currentValue: number;
  proposedValue?: number;
  pricingChangePercentage?: number;
  
  // Automation
  autoRenewEnabled: boolean;
  renewalAlertsSent: RenewalAlert[];
  renewalTasksCreated: string[]; // Task IDs
}

export interface RenewalAlert {
  type: 'upcoming' | 'notice-deadline' | 'decision-needed' | 'auto-renew-warning';
  sentAt: Date;
  recipients: string[];
  acknowledged: boolean;
}

export interface PerformanceMetric {
  id: string;
  name: string;
  category: 'financial' | 'operational' | 'quality' | 'compliance' | 'relationship';
  
  // Measurement
  targetValue: number;
  actualValue: number;
  unit: string;
  
  // Status
  onTrack: boolean;
  variance: number; // Percentage difference from target
  trend: 'improving' | 'stable' | 'declining';
  
  // Time series
  measurements: MetricMeasurement[];
  
  // Consequences
  slaAttached: boolean;
  penaltyThreshold?: number;
  bonusThreshold?: number;
}

export interface MetricMeasurement {
  date: Date;
  value: number;
  source: string;
}

export interface ComplianceCheck {
  id: string;
  checkType: 'gdpr' | 'ccpa' | 'hipaa' | 'sox' | 'pci' | 'iso27001' | 'custom';
  description: string;
  
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  lastChecked: Date;
  nextCheck: Date;
  
  status: 'compliant' | 'non-compliant' | 'needs-review' | 'exempt';
  findings: ComplianceFinding[];
  
  automated: boolean;
  automationScript?: string;
}

export interface ComplianceFinding {
  severity: 'info' | 'warning' | 'violation';
  description: string;
  discoveredAt: Date;
  resolvedAt?: Date;
  remediation?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  
  // Trigger
  trigger: AutomationTrigger;
  
  // Conditions
  conditions: AutomationCondition[];
  
  // Actions
  actions: AutomationAction[];
  
  // Execution
  lastExecuted?: Date;
  executionCount: number;
  successRate: number;
}

export interface AutomationTrigger {
  type: 'stage-change' | 'date-based' | 'obligation-due' | 'metric-threshold' | 'approval-status' | 'webhook';
  config: any;
}

export interface AutomationCondition {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'contains' | 'not-contains';
  value: any;
}

export interface AutomationAction {
  type: 'send-email' | 'create-task' | 'update-field' | 'trigger-webhook' | 'escalate' | 'approve' | 'notify';
  config: any;
}

export interface Alert {
  id: string;
  type: 'obligation-due' | 'renewal-upcoming' | 'approval-needed' | 'compliance-issue' | 'performance-risk' | 'custom';
  severity: 'info' | 'warning' | 'critical';
  
  title: string;
  message: string;
  
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  
  actionRequired: boolean;
  actionUrl?: string;
  
  recipients: string[];
  channels: ('email' | 'in-app' | 'slack' | 'teams' | 'sms')[];
}

export class ContractLifecycleManager {
  /**
   * Initialize lifecycle tracking for a new contract
   */
  async initializeLifecycle(contractId: string, contractType: string): Promise<ContractLifecycle> {
    const workflow = this.createDefaultApprovalWorkflow(contractType);
    
    return {
      contractId,
      currentStage: 'draft',
      stageHistory: [{
        from: 'draft' as LifecycleStage,
        to: 'draft' as LifecycleStage,
        timestamp: new Date(),
        triggeredBy: 'system',
        automated: true,
      }],
      approvalWorkflow: workflow,
      obligations: [],
      milestones: [],
      performanceMetrics: [],
      complianceChecks: [],
      automationRules: this.getDefaultAutomationRules(),
      activeAlerts: [],
    };
  }

  /**
   * Create default approval workflow based on contract type and value
   */
  createDefaultApprovalWorkflow(contractType: string, contractValue?: number): ApprovalWorkflow {
    const steps: ApprovalStep[] = [];
    const now = new Date();

    // Legal review (always required)
    steps.push({
      id: 'legal-review',
      order: 1,
      name: 'Legal Review',
      approvers: [{
        userId: 'legal-team',
        userName: 'Legal Team',
        email: 'legal@company.com',
        role: 'legal',
        required: true,
      }],
      approvalType: 'any',
      status: 'pending',
      dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
      responses: [],
    });

    // Finance review (for contracts over $10k)
    if (!contractValue || contractValue > 10000) {
      steps.push({
        id: 'finance-review',
        order: 2,
        name: 'Finance Review',
        approvers: [{
          userId: 'finance-team',
          userName: 'Finance Team',
          email: 'finance@company.com',
          role: 'finance',
          required: true,
        }],
        approvalType: 'any',
        status: 'pending',
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days
        responses: [],
        conditions: [{
          type: 'contract-value',
          operator: '>',
          value: 10000,
        }],
      });
    }

    // Executive approval (for contracts over $100k)
    if (contractValue && contractValue > 100000) {
      steps.push({
        id: 'executive-approval',
        order: 3,
        name: 'Executive Approval',
        approvers: [{
          userId: 'cfo',
          userName: 'CFO',
          email: 'cfo@company.com',
          role: 'executive',
          required: true,
        }],
        approvalType: 'all',
        status: 'pending',
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
        responses: [],
      });
    }

    return {
      id: `workflow-${Date.now()}`,
      workflowType: 'sequential',
      steps,
      currentStepIndex: 0,
      status: 'pending',
      startedAt: now,
      escalations: [],
    };
  }

  /**
   * Process approval response
   */
  async processApproval(
    lifecycle: ContractLifecycle,
    stepId: string,
    approverId: string,
    response: ApprovalResponse
  ): Promise<ContractLifecycle> {
    if (!lifecycle.approvalWorkflow) return lifecycle;

    const step = lifecycle.approvalWorkflow.steps.find(s => s.id === stepId);
    if (!step) throw new Error('Approval step not found');

    step.responses.push(response);

    // Check if step is complete
    const isStepComplete = this.checkStepComplete(step);
    
    if (isStepComplete) {
      if (response.decision === 'approved') {
        step.status = 'approved';
        
        // Move to next step or complete workflow
        lifecycle.approvalWorkflow.currentStepIndex++;
        
        if (lifecycle.approvalWorkflow.currentStepIndex >= lifecycle.approvalWorkflow.steps.length) {
          lifecycle.approvalWorkflow.status = 'approved';
          lifecycle.currentStage = 'active';
          lifecycle.stageHistory.push({
            from: lifecycle.currentStage,
            to: 'active',
            timestamp: new Date(),
            triggeredBy: approverId,
            automated: false,
          });
        }
      } else {
        step.status = 'rejected';
        lifecycle.approvalWorkflow.status = 'rejected';
      }
    }

    return lifecycle;
  }

  /**
   * Extract obligations from contract
   */
  async extractObligations(contractText: string, contractId: string): Promise<Obligation[]> {
    const obligations: Obligation[] = [];
    
    // Use AI to identify obligations in contract text
    // This is a simplified example - would use Gemini AI in production
    
    // Payment obligations
    const paymentMatches = contractText.match(/(?:pay|payment|invoice).{0,200}(?:within|by|on)\s+(\d+)\s+days/gi);
    if (paymentMatches) {
      obligations.push({
        id: `obl-payment-${Date.now()}`,
        type: 'payment',
        title: 'Payment Obligation',
        description: 'Payment due per contract terms',
        responsibleParty: 'us',
        frequency: 'monthly',
        status: 'upcoming',
        criticality: 'high',
        automatedTracking: false,
        autoReminders: true,
        reminderSchedule: [{
          daysBeforeDue: 7,
          recipients: ['finance@company.com'],
          channels: ['email', 'slack'],
          sent: false,
        }],
      });
    }

    // Reporting obligations
    const reportingMatches = contractText.match(/(?:report|reporting|provide|submit).{0,200}(?:monthly|quarterly|annually)/gi);
    if (reportingMatches) {
      obligations.push({
        id: `obl-reporting-${Date.now()}`,
        type: 'reporting',
        title: 'Reporting Obligation',
        description: 'Periodic reporting required',
        responsibleParty: 'us',
        frequency: 'monthly',
        status: 'upcoming',
        criticality: 'medium',
        automatedTracking: false,
        autoReminders: true,
      });
    }

    return obligations;
  }

  /**
   * Track renewal for contract
   */
  async setupRenewalTracking(
    contractId: string,
    renewalDate: Date,
    renewalTerm: string,
    noticePeriod: number
  ): Promise<RenewalTracking> {
    const now = new Date();
    const daysUntilRenewal = Math.floor((renewalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const noticeDeadline = new Date(renewalDate.getTime() - noticePeriod * 24 * 60 * 60 * 1000);

    return {
      renewalDate,
      renewalType: 'manual-renew',
      renewalTerm,
      daysUntilRenewal,
      noticePeriod,
      noticeDeadline,
      decisionMaker: 'procurement-manager',
      renegotiationNeeded: false,
      renegotiationReasons: [],
      currentValue: 0, // Would be populated from contract
      autoRenewEnabled: false,
      renewalAlertsSent: [],
      renewalTasksCreated: [],
    };
  }

  /**
   * Check for upcoming renewals and create alerts
   */
  async checkRenewals(lifecycles: ContractLifecycle[]): Promise<Alert[]> {
    const alerts: Alert[] = [];
    const now = new Date();

    for (const lifecycle of lifecycles) {
      if (!lifecycle.renewalTracking) continue;

      const renewal = lifecycle.renewalTracking;
      
      // Alert 90 days before
      if (renewal.daysUntilRenewal <= 90 && renewal.daysUntilRenewal > 60) {
        alerts.push({
          id: `alert-renewal-90-${lifecycle.contractId}`,
          type: 'renewal-upcoming',
          severity: 'info',
          title: 'Contract Renewal in 90 Days',
          message: `Contract ${lifecycle.contractId} renews in ${renewal.daysUntilRenewal} days. Begin renewal review.`,
          createdAt: now,
          actionRequired: true,
          actionUrl: `/contracts/${lifecycle.contractId}/renewal`,
          recipients: [renewal.decisionMaker],
          channels: ['email', 'in-app'],
        });
      }

      // Alert at notice deadline
      if (renewal.daysUntilRenewal <= 30) {
        alerts.push({
          id: `alert-renewal-notice-${lifecycle.contractId}`,
          type: 'renewal-upcoming',
          severity: 'warning',
          title: 'Renewal Notice Deadline Approaching',
          message: `Notice deadline for contract ${lifecycle.contractId} is ${renewal.noticeDeadline.toLocaleDateString()}. Decision required.`,
          createdAt: now,
          actionRequired: true,
          actionUrl: `/contracts/${lifecycle.contractId}/renewal`,
          recipients: [renewal.decisionMaker],
          channels: ['email', 'in-app', 'slack'],
        });
      }

      // Critical alert 7 days before auto-renew
      if (renewal.autoRenewEnabled && renewal.daysUntilRenewal <= 7) {
        alerts.push({
          id: `alert-auto-renew-${lifecycle.contractId}`,
          type: 'renewal-upcoming',
          severity: 'critical',
          title: 'Auto-Renewal in 7 Days!',
          message: `Contract ${lifecycle.contractId} will AUTO-RENEW in ${renewal.daysUntilRenewal} days unless action is taken.`,
          createdAt: now,
          actionRequired: true,
          actionUrl: `/contracts/${lifecycle.contractId}/renewal`,
          recipients: [renewal.decisionMaker, 'procurement@company.com'],
          channels: ['email', 'in-app', 'slack', 'sms'],
        });
      }
    }

    return alerts;
  }

  /**
   * Monitor performance metrics
   */
  async updatePerformanceMetrics(
    lifecycle: ContractLifecycle,
    metricId: string,
    newValue: number
  ): Promise<ContractLifecycle> {
    const metric = lifecycle.performanceMetrics.find(m => m.id === metricId);
    if (!metric) return lifecycle;

    // Add new measurement
    metric.measurements.push({
      date: new Date(),
      value: newValue,
      source: 'manual',
    });

    // Update actual value
    metric.actualValue = newValue;

    // Calculate variance
    metric.variance = ((newValue - metric.targetValue) / metric.targetValue) * 100;
    metric.onTrack = Math.abs(metric.variance) <= 10;

    // Determine trend
    if (metric.measurements.length >= 3) {
      const recent = metric.measurements.slice(-3).map(m => m.value);
      const trend = this.calculateTrend(recent);
      metric.trend = trend;
    }

    return lifecycle;
  }

  /**
   * Execute automation rules
   */
  async executeAutomation(lifecycle: ContractLifecycle): Promise<void> {
    for (const rule of lifecycle.automationRules.filter(r => r.enabled)) {
      const shouldExecute = this.checkAutomationTrigger(rule, lifecycle);
      
      if (shouldExecute) {
        const conditionsMet = this.checkAutomationConditions(rule, lifecycle);
        
        if (conditionsMet) {
          await this.executeActions(rule.actions, lifecycle);
          rule.lastExecuted = new Date();
          rule.executionCount++;
        }
      }
    }
  }

  // Private helper methods

  private checkStepComplete(step: ApprovalStep): boolean {
    if (step.approvalType === 'any') {
      return step.responses.some(r => r.decision === 'approved' || r.decision === 'rejected');
    } else if (step.approvalType === 'all') {
      const requiredApprovers = step.approvers.filter(a => a.required);
      return requiredApprovers.every(approver =>
        step.responses.some(r => r.approverId === approver.userId && r.decision === 'approved')
      );
    } else if (step.approvalType === 'majority') {
      const approvals = step.responses.filter(r => r.decision === 'approved').length;
      return approvals > step.approvers.length / 2;
    }
    return false;
  }

  private calculateTrend(values: number[]): 'improving' | 'stable' | 'declining' {
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg * 1.05) return 'improving';
    if (secondAvg < firstAvg * 0.95) return 'declining';
    return 'stable';
  }

  private checkAutomationTrigger(rule: AutomationRule, lifecycle: ContractLifecycle): boolean {
    // Check if trigger conditions are met
    return true; // Simplified
  }

  private checkAutomationConditions(rule: AutomationRule, lifecycle: ContractLifecycle): boolean {
    // Check if all conditions are met
    return true; // Simplified
  }

  private async executeActions(actions: AutomationAction[], lifecycle: ContractLifecycle): Promise<void> {
    // Execute automation actions
    for (const action of actions) {
      // Implementation would depend on action type
    }
  }

  private getDefaultAutomationRules(): AutomationRule[] {
    return [
      {
        id: 'auto-approval-low-value',
        name: 'Auto-approve contracts under $5k',
        description: 'Automatically approve standard contracts under $5,000',
        enabled: true,
        trigger: {
          type: 'stage-change',
          config: { stage: 'internal-review' },
        },
        conditions: [
          { field: 'contract.value', operator: '<', value: 5000 },
          { field: 'contract.type', operator: '=', value: 'standard' },
        ],
        actions: [
          { type: 'approve', config: {} },
          { type: 'send-email', config: { template: 'auto-approved' } },
        ],
        executionCount: 0,
        successRate: 100,
      },
      {
        id: 'renewal-reminder-90days',
        name: 'Renewal reminder at 90 days',
        description: 'Send renewal reminder 90 days before expiration',
        enabled: true,
        trigger: {
          type: 'date-based',
          config: { daysBeforeRenewal: 90 },
        },
        conditions: [],
        actions: [
          { type: 'send-email', config: { template: 'renewal-reminder' } },
          { type: 'create-task', config: { assignee: 'procurement-manager', title: 'Review contract for renewal' } },
        ],
        executionCount: 0,
        successRate: 100,
      },
    ];
  }
}

// Export utilities

export function calculateCompletionPercentage(lifecycle: ContractLifecycle): number {
  const stageWeights: Record<LifecycleStage, number> = {
    'draft': 10,
    'internal-review': 20,
    'legal-review': 30,
    'finance-review': 40,
    'executive-approval': 50,
    'negotiation': 60,
    'signature-pending': 80,
    'active': 100,
    'amendment-pending': 100,
    'renewal-pending': 100,
    'expired': 100,
    'terminated': 100,
    'archived': 100,
  };

  return stageWeights[lifecycle.currentStage] || 0;
}

export function getOverdueObligations(lifecycle: ContractLifecycle): Obligation[] {
  const now = new Date();
  return lifecycle.obligations.filter(obl => 
    obl.dueDate && obl.dueDate < now && obl.status !== 'completed'
  );
}

export function getUpcomingObligations(lifecycle: ContractLifecycle, days: number = 30): Obligation[] {
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  return lifecycle.obligations.filter(obl =>
    obl.dueDate && 
    obl.dueDate >= now &&
    obl.dueDate <= futureDate &&
    obl.status !== 'completed'
  );
}
