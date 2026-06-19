/**
 * Template Collaboration & Team Management Suite
 * 
 * COMPETITIVE MOATS:
 * - Real-time multi-user editing
 * - Comment threads and discussions
 * - Approval workflows with routing
 * - Version control and rollback
 * - Team template libraries
 * - Permission management
 * - Activity tracking and audit logs
 */

import type {
  CollaborationSession,
  Participant,
  Change,
  Comment,
  ApprovalWorkflow,
  ApprovalStage,
  ApprovalComment,
  TeamLibrary,
  TeamTemplate,
  TeamPermission,
  TemplateVersion
} from './template-types';

// Re-export for backward compatibility
export type {
  CollaborationSession,
  Participant,
  Change,
  Comment,
  ApprovalWorkflow,
  ApprovalStage,
  ApprovalComment,
  TeamLibrary,
  TeamTemplate,
  TeamPermission,
  TemplateVersion
};

interface SessionState {
  sessions: Map<string, CollaborationSession>;
}

export class TemplateCollaborationEngine {
  private sessions: Map<string, CollaborationSession> = new Map();
  private workflows: Map<string, ApprovalWorkflow> = new Map();
  private libraries: Map<string, TeamLibrary> = new Map();
  private versions: Map<string, TemplateVersion[]> = new Map();

  /**
   * Start collaboration session
   */
  async startSession(params: {
    templateId: string;
    templateName: string;
    initiatorId: string;
    participants: { userId: string; role: string }[];
    duration?: number; // minutes, default 240 (4 hours)
  }): Promise<string> {
    const sessionId = `session-${Date.now()}`;
    const duration = params.duration || 240;
    
    const session: CollaborationSession = {
      id: sessionId,
      templateId: params.templateId,
      templateName: params.templateName,
      participants: params.participants.map(p => ({
        userId: p.userId,
        name: '', // Would fetch from user service
        email: '',
        role: p.role as any,
        joinedAt: new Date(),
        lastActiveAt: new Date(),
      })),
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + duration * 60 * 1000),
      activeEditors: [],
      pendingChanges: [],
      comments: [],
    };
    
    this.sessions.set(sessionId, session);
    
    return sessionId;
  }

  /**
   * Join collaboration session
   */
  async joinSession(sessionId: string, userId: string): Promise<CollaborationSession> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');
    
    const participant = session.participants.find(p => p.userId === userId);
    if (!participant) throw new Error('User not invited to session');
    
    participant.lastActiveAt = new Date();
    
    return session;
  }

  /**
   * Submit change during collaboration
   */
  async submitChange(params: {
    sessionId: string;
    userId: string;
    change: Omit<Change, 'id' | 'userId' | 'userName' | 'timestamp' | 'status'>;
  }): Promise<void> {
    const session = this.sessions.get(params.sessionId);
    if (!session) throw new Error('Session not found');
    
    const participant = session.participants.find(p => p.userId === params.userId);
    if (!participant) throw new Error('User not in session');
    
    const change: Change = {
      ...params.change,
      id: `change-${Date.now()}`,
      userId: params.userId,
      userName: participant.name,
      timestamp: new Date(),
      status: participant.role === 'owner' ? 'accepted' : 'pending',
    };
    
    session.pendingChanges.push(change);
    
    // Notify other participants
    await this.notifyParticipants(session, {
      type: 'change-submitted',
      change,
    });
  }

  /**
   * Review and approve/reject change
   */
  async reviewChange(params: {
    sessionId: string;
    changeId: string;
    reviewerId: string;
    decision: 'accept' | 'reject';
    note?: string;
  }): Promise<void> {
    const session = this.sessions.get(params.sessionId);
    if (!session) throw new Error('Session not found');
    
    const change = session.pendingChanges.find(c => c.id === params.changeId);
    if (!change) throw new Error('Change not found');
    
    const reviewer = session.participants.find(p => p.userId === params.reviewerId);
    if (!reviewer || (reviewer.role !== 'owner' && reviewer.role !== 'editor')) {
      throw new Error('Insufficient permissions to review');
    }
    
    change.status = params.decision === 'accept' ? 'accepted' : 'rejected';
    change.reviewedBy = params.reviewerId;
    change.reviewNote = params.note;
    
    // Notify change author
    await this.notifyUser(change.userId, {
      type: 'change-reviewed',
      decision: params.decision,
      reviewer: reviewer.name,
      note: params.note,
    });
  }

  /**
   * Add comment to template
   */
  async addComment(params: {
    sessionId: string;
    userId: string;
    content: string;
    position: { section: string; offset: number };
    threadId?: string; // For replies
    mentions?: string[];
  }): Promise<string> {
    const session = this.sessions.get(params.sessionId);
    if (!session) throw new Error('Session not found');
    
    const participant = session.participants.find(p => p.userId === params.userId);
    if (!participant) throw new Error('User not in session');
    
    const commentId = `comment-${Date.now()}`;
    const threadId = params.threadId || commentId;
    
    const comment: Comment = {
      id: commentId,
      threadId,
      userId: params.userId,
      userName: participant.name,
      timestamp: new Date(),
      content: params.content,
      mentions: params.mentions || [],
      position: params.position,
      resolved: false,
      replies: [],
      reactions: [],
    };
    
    if (params.threadId) {
      // Reply to existing thread
      const parentComment = session.comments.find(c => c.threadId === params.threadId);
      if (parentComment) {
        parentComment.replies.push(comment);
      }
    } else {
      // New thread
      session.comments.push(comment);
    }
    
    // Notify mentioned users
    for (const mentionedId of comment.mentions) {
      await this.notifyUser(mentionedId, {
        type: 'mentioned-in-comment',
        comment,
        session: session.id,
      });
    }
    
    return commentId;
  }

  /**
   * Resolve comment thread
   */
  async resolveComment(params: {
    sessionId: string;
    threadId: string;
    userId: string;
  }): Promise<void> {
    const session = this.sessions.get(params.sessionId);
    if (!session) throw new Error('Session not found');
    
    const comment = session.comments.find(c => c.threadId === params.threadId);
    if (!comment) throw new Error('Comment thread not found');
    
    comment.resolved = true;
    comment.resolvedBy = params.userId;
    comment.resolvedAt = new Date();
  }

  /**
   * Create approval workflow
   */
  async createWorkflow(params: {
    templateId: string;
    name: string;
    stages: {
      name: string;
      approvers: { userId: string; required: boolean }[];
      type: 'sequential' | 'parallel';
    }[];
    submitterId: string;
  }): Promise<string> {
    const workflowId = `workflow-${Date.now()}`;
    
    const workflow: ApprovalWorkflow = {
      id: workflowId,
      templateId: params.templateId,
      name: params.name,
      stages: params.stages.map((stage, idx) => ({
        id: `stage-${idx}`,
        name: stage.name,
        order: idx,
        approvers: stage.approvers.map(a => ({
          userId: a.userId,
          name: '', // Would fetch from user service
          required: a.required,
        })),
        type: stage.type,
        status: idx === 0 ? 'in-progress' : 'pending',
      })),
      currentStage: 0,
      status: 'in-progress',
      submittedBy: params.submitterId,
      submittedAt: new Date(),
      comments: [],
    };
    
    this.workflows.set(workflowId, workflow);
    
    // Notify first stage approvers
    const firstStage = workflow.stages[0];
    for (const approver of firstStage.approvers) {
      await this.notifyUser(approver.userId, {
        type: 'approval-requested',
        workflow: workflowId,
        stage: firstStage.name,
      });
    }
    
    return workflowId;
  }

  /**
   * Submit approval decision
   */
  async submitApproval(params: {
    workflowId: string;
    stageId: string;
    userId: string;
    decision: 'approve' | 'reject';
    comment?: string;
  }): Promise<void> {
    const workflow = this.workflows.get(params.workflowId);
    if (!workflow) throw new Error('Workflow not found');
    
    const stage = workflow.stages.find(s => s.id === params.stageId);
    if (!stage) throw new Error('Stage not found');
    
    const approver = stage.approvers.find(a => a.userId === params.userId);
    if (!approver) throw new Error('User is not an approver for this stage');
    
    // Record decision
    workflow.comments.push({
      stageId: params.stageId,
      userId: params.userId,
      comment: params.comment || '',
      decision: params.decision,
      timestamp: new Date(),
    });
    
    // Check if stage is complete
    const decisions = workflow.comments.filter(c => c.stageId === params.stageId);
    
    if (params.decision === 'reject') {
      stage.status = 'rejected';
      workflow.status = 'rejected';
      workflow.completedAt = new Date();
      
      // Notify submitter
      await this.notifyUser(workflow.submittedBy, {
        type: 'workflow-rejected',
        workflow: params.workflowId,
        stage: stage.name,
        rejectedBy: approver.name,
        comment: params.comment,
      });
      
      return;
    }
    
    // Check if all required approvers have approved
    const requiredApprovers = stage.approvers.filter(a => a.required);
    const approvedBy = decisions.filter(d => d.decision === 'approve').map(d => d.userId);
    const allRequiredApproved = requiredApprovers.every(a => approvedBy.includes(a.userId));
    
    if (allRequiredApproved) {
      stage.status = 'approved';
      stage.completedAt = new Date();
      
      // Move to next stage or complete workflow
      if (workflow.currentStage < workflow.stages.length - 1) {
        workflow.currentStage++;
        const nextStage = workflow.stages[workflow.currentStage];
        nextStage.status = 'in-progress';
        
        // Notify next stage approvers
        for (const nextApprover of nextStage.approvers) {
          await this.notifyUser(nextApprover.userId, {
            type: 'approval-requested',
            workflow: params.workflowId,
            stage: nextStage.name,
          });
        }
      } else {
        // Workflow complete
        workflow.status = 'approved';
        workflow.completedAt = new Date();
        
        // Notify submitter
        await this.notifyUser(workflow.submittedBy, {
          type: 'workflow-approved',
          workflow: params.workflowId,
        });
      }
    }
  }

  /**
   * Create team library
   */
  async createTeamLibrary(params: {
    teamId: string;
    name: string;
    description: string;
    creatorId: string;
  }): Promise<string> {
    const libraryId = `library-${Date.now()}`;
    
    const library: TeamLibrary = {
      id: libraryId,
      teamId: params.teamId,
      name: params.name,
      description: params.description,
      templates: [],
      permissions: [{
        userId: params.creatorId,
        role: 'admin',
        canAdd: true,
        canModify: true,
        canDelete: true,
        canShare: true,
      }],
      settings: {
        requireApprovalForNew: false,
        allowExternalSharing: true,
        enforceVersionControl: true,
        autoBackup: true,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.libraries.set(libraryId, library);
    
    return libraryId;
  }

  /**
   * Add template to team library
   */
  async addToLibrary(params: {
    libraryId: string;
    templateId: string;
    userId: string;
    category: string;
    tags: string[];
    internalName?: string;
    notes?: string;
  }): Promise<void> {
    const library = this.libraries.get(params.libraryId);
    if (!library) throw new Error('Library not found');
    
    const userPermission = library.permissions.find(p => p.userId === params.userId);
    if (!userPermission || !userPermission.canAdd) {
      throw new Error('Insufficient permissions to add template');
    }
    
    library.templates.push({
      templateId: params.templateId,
      addedBy: params.userId,
      addedAt: new Date(),
      category: params.category,
      tags: params.tags,
      internalName: params.internalName,
      notes: params.notes,
      usageCount: 0,
    });
    
    library.updatedAt = new Date();
  }

  /**
   * Create template version
   */
  async createVersion(params: {
    templateId: string;
    content: string;
    variables: any[];
    changes: string[];
    createdBy: string;
    version?: string; // If not provided, auto-increment
  }): Promise<string> {
    const versions = this.versions.get(params.templateId) || [];
    
    // Determine version number
    let versionNumber = params.version;
    if (!versionNumber) {
      if (versions.length === 0) {
        versionNumber = '1.0.0';
      } else {
        const lastVersion = versions[versions.length - 1].version.split('.').map(Number);
        lastVersion[2]++; // Increment patch
        versionNumber = lastVersion.join('.');
      }
    }
    
    const versionId = `version-${Date.now()}`;
    
    const version: TemplateVersion = {
      id: versionId,
      templateId: params.templateId,
      version: versionNumber,
      content: params.content,
      variables: params.variables,
      changes: params.changes,
      createdBy: params.createdBy,
      createdAt: new Date(),
      status: 'draft',
      usageCount: 0,
    };
    
    // Calculate diff from previous version
    if (versions.length > 0) {
      const previousVersion = versions[versions.length - 1];
      version.diffFromPrevious = this.calculateDiff(previousVersion.content, params.content);
    }
    
    versions.push(version);
    this.versions.set(params.templateId, versions);
    
    return versionId;
  }

  /**
   * Get template versions
   */
  getVersions(templateId: string): TemplateVersion[] {
    return this.versions.get(templateId) || [];
  }

  /**
   * Rollback to previous version
   */
  async rollback(params: {
    templateId: string;
    versionId: string;
    userId: string;
  }): Promise<void> {
    const versions = this.versions.get(params.templateId);
    if (!versions) throw new Error('No versions found');
    
    const targetVersion = versions.find(v => v.id === params.versionId);
    if (!targetVersion) throw new Error('Version not found');
    
    // Create new version based on rollback
    await this.createVersion({
      templateId: params.templateId,
      content: targetVersion.content,
      variables: targetVersion.variables,
      changes: [`Rolled back to version ${targetVersion.version}`],
      createdBy: params.userId,
    });
  }

  /**
   * Helper methods
   */
  private async notifyParticipants(session: CollaborationSession, notification: any): Promise<void> {
    // In production, would use WebSocket or push notification service
    console.log('Notify participants:', session.id, notification);
  }

  private async notifyUser(userId: string, notification: any): Promise<void> {
    // In production, would use notification service
    console.log('Notify user:', userId, notification);
  }

  private calculateDiff(oldContent: string, newContent: string): {
    additions: string[];
    deletions: string[];
    modifications: string[];
  } {
    // Simplified diff - in production, use proper diff algorithm
    return {
      additions: [],
      deletions: [],
      modifications: [],
    };
  }
}

// Export singleton
export const collaborationEngine = new TemplateCollaborationEngine();
