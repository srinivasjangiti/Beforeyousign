/**
 * Contract Lifecycle Management System
 * 
 * Manages complete contract lifecycle:
 * Draft → Review → Negotiate → Sign → Execute → Monitor → Renew
 */

export interface ContractLifecycleStage {
  id: string;
  name: 'draft' | 'review' | 'negotiate' | 'sign' | 'execute' | 'monitor' | 'renew' | 'complete';
  status: 'pending' | 'in-progress' | 'completed' | 'blocked' | 'overdue';
  startDate?: Date;
  completedDate?: Date;
  dueDate?: Date;
  assignedTo?: string[];
  tasks: ContractTask[];
  notes?: string;
}

export interface ContractTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  dueDate?: Date;
  completedDate?: Date;
  dependencies?: string[];
  automatable: boolean;
  automationRule?: string;
}

export interface Contract {
  id: string;
  title: string;
  type: string;
  parties: Array<{
    name: string;
    role: 'client' | 'vendor' | 'partner' | 'other';
    signatory?: string;
    signed?: boolean;
    signedDate?: Date;
  }>;
  value?: number;
  currency?: string;
  startDate?: Date;
  endDate?: Date;
  renewalDate?: Date;
  autoRenew: boolean;
  currentStage: ContractLifecycleStage['name'];
  stages: ContractLifecycleStage[];
  documents: Array<{
    id: string;
    version: number;
    fileName: string;
    uploadDate: Date;
    uploadedBy: string;
    status: 'draft' | 'final' | 'superseded';
  }>;
  metadata: {
    createdBy: string;
    createdDate: Date;
    lastModified: Date;
    tags: string[];
    category: string;
    confidential: boolean;
  };
  compliance: {
    frameworks: string[];
    status: 'compliant' | 'non-compliant' | 'under-review';
    lastChecked?: Date;
    nextReview?: Date;
  };
  risks: {
    score: number;
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    lastAssessed?: Date;
  };
  notifications: Array<{
    type: 'renewal' | 'expiration' | 'milestone' | 'approval' | 'task';
    date: Date;
    sent: boolean;
    recipients: string[];
  }>;
}

export interface WorkflowAutomation {
  id: string;
  name: string;
  trigger: {
    type: 'stage_change' | 'date' | 'condition' | 'manual';
    value: any;
  };
  conditions?: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  }>;
  actions: Array<{
    type: 'notify' | 'assign' | 'approve' | 'escalate' | 'update' | 'create_task';
    params: any;
  }>;
  enabled: boolean;
}

export class LifecycleManager {
  private contracts: Map<string, Contract> = new Map();
  private automations: Map<string, WorkflowAutomation> = new Map();

  /**
   * Create a new contract in the lifecycle
   */
  createContract(data: Partial<Contract>): Contract {
    const contract: Contract = {
      id: crypto.randomUUID(),
      title: data.title || 'Untitled Contract',
      type: data.type || 'general',
      parties: data.parties || [],
      autoRenew: data.autoRenew ?? false,
      currentStage: 'draft',
      stages: this.initializeStages(),
      documents: [],
      metadata: {
        createdBy: data.metadata?.createdBy || 'system',
        createdDate: new Date(),
        lastModified: new Date(),
        tags: data.metadata?.tags || [],
        category: data.metadata?.category || 'general',
        confidential: data.metadata?.confidential ?? false,
      },
      compliance: {
        frameworks: data.compliance?.frameworks || [],
        status: 'under-review',
      },
      risks: {
        score: 0,
        level: 'low',
        factors: [],
      },
      notifications: [],
    };

    this.contracts.set(contract.id, contract);
    this.scheduleAutomatedTasks(contract);

    return contract;
  }

  /**
   * Initialize default lifecycle stages
   */
  private initializeStages(): ContractLifecycleStage[] {
    const stages: ContractLifecycleStage['name'][] = [
      'draft',
      'review',
      'negotiate',
      'sign',
      'execute',
      'monitor',
      'renew',
    ];

    return stages.map((name, index) => ({
      id: crypto.randomUUID(),
      name,
      status: index === 0 ? 'in-progress' : 'pending',
      tasks: this.getDefaultTasksForStage(name),
    }));
  }

  /**
   * Get default tasks for each lifecycle stage
   */
  private getDefaultTasksForStage(stage: ContractLifecycleStage['name']): ContractTask[] {
    const taskTemplates: Record<ContractLifecycleStage['name'], Partial<ContractTask>[]> = {
      draft: [
        {
          title: 'Upload initial draft',
          description: 'Upload the contract document for review',
          priority: 'high',
          automatable: false,
        },
        {
          title: 'Complete contract details',
          description: 'Fill in parties, dates, and key terms',
          priority: 'high',
          automatable: false,
        },
        {
          title: 'Initial AI analysis',
          description: 'Run automated analysis on draft contract',
          priority: 'medium',
          automatable: true,
          automationRule: 'auto_analyze_on_upload',
        },
      ],
      review: [
        {
          title: 'Legal review',
          description: 'Review contract for legal compliance and risks',
          priority: 'high',
          automatable: false,
        },
        {
          title: 'Business review',
          description: 'Ensure contract aligns with business objectives',
          priority: 'high',
          automatable: false,
        },
        {
          title: 'Compliance check',
          description: 'Verify compliance with applicable frameworks',
          priority: 'medium',
          automatable: true,
          automationRule: 'auto_compliance_check',
        },
      ],
      negotiate: [
        {
          title: 'Identify negotiation points',
          description: 'List clauses that need negotiation',
          priority: 'high',
          automatable: true,
          automationRule: 'ai_negotiation_points',
        },
        {
          title: 'Prepare counter-proposals',
          description: 'Draft alternative language for key clauses',
          priority: 'medium',
          automatable: true,
          automationRule: 'ai_counter_proposals',
        },
        {
          title: 'Negotiate with counterparty',
          description: 'Exchange proposals and reach agreement',
          priority: 'high',
          automatable: false,
        },
      ],
      sign: [
        {
          title: 'Final review',
          description: 'Review final negotiated version',
          priority: 'high',
          automatable: false,
        },
        {
          title: 'Obtain approvals',
          description: 'Get internal sign-off from stakeholders',
          priority: 'high',
          automatable: true,
          automationRule: 'auto_approval_routing',
        },
        {
          title: 'Execute signatures',
          description: 'Collect signatures from all parties',
          priority: 'urgent',
          automatable: true,
          automationRule: 'esignature_workflow',
        },
      ],
      execute: [
        {
          title: 'Store signed contract',
          description: 'Archive final signed version',
          priority: 'high',
          automatable: true,
          automationRule: 'auto_archive',
        },
        {
          title: 'Notify stakeholders',
          description: 'Inform relevant parties of execution',
          priority: 'medium',
          automatable: true,
          automationRule: 'auto_notify',
        },
        {
          title: 'Set up monitoring',
          description: 'Configure alerts and tracking',
          priority: 'medium',
          automatable: true,
          automationRule: 'auto_monitor_setup',
        },
      ],
      monitor: [
        {
          title: 'Track obligations',
          description: 'Monitor compliance with contract terms',
          priority: 'medium',
          automatable: true,
          automationRule: 'obligation_tracking',
        },
        {
          title: 'Performance review',
          description: 'Assess contract performance',
          priority: 'low',
          automatable: false,
        },
      ],
      renew: [
        {
          title: 'Renewal decision',
          description: 'Decide whether to renew or terminate',
          priority: 'high',
          automatable: false,
        },
        {
          title: 'Renegotiate terms',
          description: 'Update terms for new period if renewing',
          priority: 'medium',
          automatable: false,
        },
      ],
      complete: [],
    };

    const templates = taskTemplates[stage] || [];
    
    return templates.map((template, index) => ({
      id: crypto.randomUUID(),
      title: template.title || '',
      description: template.description || '',
      status: 'pending',
      priority: template.priority || 'medium',
      automatable: template.automatable || false,
      automationRule: template.automationRule,
    }));
  }

  /**
   * Advance contract to next stage
   */
  advanceStage(contractId: string): Contract | null {
    const contract = this.contracts.get(contractId);
    if (!contract) return null;

    const currentStageIndex = contract.stages.findIndex(s => s.name === contract.currentStage);
    const currentStage = contract.stages[currentStageIndex];
    
    // Mark current stage as completed
    currentStage.status = 'completed';
    currentStage.completedDate = new Date();

    // Move to next stage
    const nextStage = contract.stages[currentStageIndex + 1];
    if (nextStage) {
      nextStage.status = 'in-progress';
      nextStage.startDate = new Date();
      contract.currentStage = nextStage.name;
    }

    contract.metadata.lastModified = new Date();
    this.scheduleAutomatedTasks(contract);

    return contract;
  }

  /**
   * Schedule automated tasks based on rules
   */
  private scheduleAutomatedTasks(contract: Contract): void {
    const currentStage = contract.stages.find(s => s.name === contract.currentStage);
    if (!currentStage) return;

    // Find tasks that can be automated
    const automatableTasks = currentStage.tasks.filter(t => t.automatable && t.status === 'pending');

    automatableTasks.forEach(task => {
      // In production, this would trigger actual automation workflows
      console.log(`[Automation] Scheduled: ${task.title} for contract ${contract.id}`);
      
      // Simulate automation completion
      setTimeout(() => {
        this.completeTask(contract.id, task.id, 'system');
      }, 1000);
    });
  }

  /**
   * Complete a task
   */
  completeTask(contractId: string, taskId: string, completedBy: string): boolean {
    const contract = this.contracts.get(contractId);
    if (!contract) return false;

    const currentStage = contract.stages.find(s => s.name === contract.currentStage);
    if (!currentStage) return false;

    const task = currentStage.tasks.find(t => t.id === taskId);
    if (!task) return false;

    task.status = 'completed';
    task.completedDate = new Date();

    // Check if all tasks in stage are completed
    const allCompleted = currentStage.tasks.every(t => t.status === 'completed');
    if (allCompleted) {
      this.advanceStage(contractId);
    }

    return true;
  }

  /**
   * Get contract by ID
   */
  getContract(id: string): Contract | undefined {
    return this.contracts.get(id);
  }

  /**
   * List all contracts with filters
   */
  listContracts(filters?: {
    stage?: ContractLifecycleStage['name'];
    type?: string;
    status?: string;
  }): Contract[] {
    let contracts = Array.from(this.contracts.values());

    if (filters?.stage) {
      contracts = contracts.filter(c => c.currentStage === filters.stage);
    }

    if (filters?.type) {
      contracts = contracts.filter(c => c.type === filters.type);
    }

    return contracts;
  }

  /**
   * Add workflow automation
   */
  addAutomation(automation: WorkflowAutomation): void {
    this.automations.set(automation.id, automation);
  }

  /**
   * Get contracts requiring attention
   */
  getActionRequired(): Contract[] {
    return Array.from(this.contracts.values()).filter(contract => {
      const currentStage = contract.stages.find(s => s.name === contract.currentStage);
      if (!currentStage) return false;

      // Check for overdue tasks
      const overdueTasks = currentStage.tasks.filter(t => 
        t.status !== 'completed' &&
        t.dueDate &&
        t.dueDate < new Date()
      );

      return overdueTasks.length > 0 || currentStage.status === 'blocked';
    });
  }
}

// Singleton instance
export const lifecycleManager = new LifecycleManager();
