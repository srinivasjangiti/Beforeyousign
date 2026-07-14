/**
 * Collaborative Workspace
 * 
 * Real-time collaboration features:
 * - Multi-user contract editing
 * - Comment threads on clauses
 * - @mentions and notifications
 * - Approval workflows
 * - Version control with diffs
 * - Activity feed
 * - Team permissions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'online' | 'away' | 'offline';
  lastSeen?: Date;
}

export interface Comment {
  id: string;
  contractId: string;
  clauseId?: string;
  position?: { start: number; end: number };
  author: User;
  content: string;
  mentions: string[]; // user IDs
  createdAt: Date;
  updatedAt?: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  replies: Comment[];
  reactions: Array<{ userId: string; emoji: string }>;
}

export interface Version {
  id: string;
  contractId: string;
  version: number;
  content: string;
  changes: Array<{
    type: 'added' | 'removed' | 'modified';
    position: { start: number; end: number };
    content: string;
    previousContent?: string;
  }>;
  author: User;
  createdAt: Date;
  message: string;
  tags?: string[];
}

export interface ApprovalWorkflow {
  id: string;
  contractId: string;
  name: string;
  stages: Array<{
    id: string;
    name: string;
    order: number;
    approvers: string[]; // user IDs
    requiresAll: boolean; // true = all must approve, false = any one
    status: 'pending' | 'approved' | 'rejected';
    approvals: Array<{
      userId: string;
      decision: 'approved' | 'rejected';
      comment?: string;
      timestamp: Date;
    }>;
  }>;
  currentStage: number;
  status: 'draft' | 'in-review' | 'approved' | 'rejected';
  createdAt: Date;
  completedAt?: Date;
}

export interface Activity {
  id: string;
  contractId: string;
  type:
    | 'created'
    | 'edited'
    | 'commented'
    | 'approved'
    | 'rejected'
    | 'version_created'
    | 'user_added'
    | 'user_removed'
    | 'shared';
  user: User;
  timestamp: Date;
  metadata?: Record<string, any>;
  description: string;
}

export interface Permission {
  userId: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  canEdit: boolean;
  canComment: boolean;
  canApprove: boolean;
  canShare: boolean;
  canDelete: boolean;
}

export interface CollaborativeContract {
  id: string;
  name: string;
  content: string;
  currentVersion: number;
  versions: Version[];
  collaborators: User[];
  permissions: Map<string, Permission>;
  comments: Comment[];
  workflow?: ApprovalWorkflow;
  activities: Activity[];
  locked: boolean;
  lockedBy?: string;
  lockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class CollaborationManager {
  private contracts: Map<string, CollaborativeContract> = new Map();
  private activeUsers: Map<string, User> = new Map();
  private commentThreads: Map<string, Comment[]> = new Map();
  
  // WebSocket connections would be stored here in production
  private connections: Map<string, any> = new Map();

  /**
   * Create a new collaborative contract
   */
  createContract(
    name: string,
    content: string,
    ownerId: string,
    ownerName: string,
    ownerEmail: string
  ): CollaborativeContract {
    const owner: User = {
      id: ownerId,
      name: ownerName,
      email: ownerEmail,
      role: 'owner',
      status: 'online',
    };

    const initialVersion: Version = {
      id: `v-${Date.now()}`,
      contractId: '',
      version: 1,
      content,
      changes: [
        {
          type: 'added',
          position: { start: 0, end: content.length },
          content,
        },
      ],
      author: owner,
      createdAt: new Date(),
      message: 'Initial version',
    };

    const contract: CollaborativeContract = {
      id: `contract-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      content,
      currentVersion: 1,
      versions: [initialVersion],
      collaborators: [owner],
      permissions: new Map([
        [
          ownerId,
          {
            userId: ownerId,
            role: 'owner',
            canEdit: true,
            canComment: true,
            canApprove: true,
            canShare: true,
            canDelete: true,
          },
        ],
      ]),
      comments: [],
      activities: [
        {
          id: `activity-${Date.now()}`,
          contractId: '',
          type: 'created',
          user: owner,
          timestamp: new Date(),
          description: `${owner.name} created this contract`,
        },
      ],
      locked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    initialVersion.contractId = contract.id;
    contract.activities[0].contractId = contract.id;

    this.contracts.set(contract.id, contract);
    this.activeUsers.set(ownerId, owner);

    return contract;
  }

  /**
   * Add collaborator to contract
   */
  addCollaborator(
    contractId: string,
    userId: string,
    userName: string,
    userEmail: string,
    role: 'admin' | 'editor' | 'viewer',
    addedBy: string
  ): void {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    // Check permissions
    const adderPermission = contract.permissions.get(addedBy);
    if (!adderPermission?.canShare) {
      throw new Error('User does not have permission to share');
    }

    const newUser: User = {
      id: userId,
      name: userName,
      email: userEmail,
      role,
      status: 'offline',
    };

    contract.collaborators.push(newUser);

    const permissions: Permission = {
      userId,
      role,
      canEdit: role === 'admin' || role === 'editor',
      canComment: true,
      canApprove: role === 'admin',
      canShare: role === 'admin',
      canDelete: false,
    };

    contract.permissions.set(userId, permissions);

    const adder = contract.collaborators.find((u) => u.id === addedBy)!;
    contract.activities.push({
      id: `activity-${Date.now()}`,
      contractId,
      type: 'user_added',
      user: adder,
      timestamp: new Date(),
      description: `${adder.name} added ${userName} as ${role}`,
      metadata: { addedUserId: userId, addedUserName: userName },
    });

    contract.updatedAt = new Date();

    // In production: send notification to new user
    // In production: broadcast to WebSocket connections
  }

  /**
   * Add comment to contract
   */
  addComment(
    contractId: string,
    userId: string,
    content: string,
    clauseId?: string,
    position?: { start: number; end: number },
    mentions?: string[]
  ): Comment {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    const user = contract.collaborators.find((u) => u.id === userId);
    if (!user) throw new Error('User is not a collaborator');

    const permission = contract.permissions.get(userId);
    if (!permission?.canComment) {
      throw new Error('User does not have permission to comment');
    }

    const comment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contractId,
      clauseId,
      position,
      author: user,
      content,
      mentions: mentions || [],
      createdAt: new Date(),
      resolved: false,
      replies: [],
      reactions: [],
    };

    contract.comments.push(comment);

    contract.activities.push({
      id: `activity-${Date.now()}`,
      contractId,
      type: 'commented',
      user,
      timestamp: new Date(),
      description: `${user.name} added a comment`,
      metadata: { commentId: comment.id, clauseId },
    });

    contract.updatedAt = new Date();

    // In production: send notifications to @mentioned users
    // In production: broadcast to WebSocket connections

    return comment;
  }

  /**
   * Reply to comment
   */
  replyToComment(
    contractId: string,
    commentId: string,
    userId: string,
    content: string,
    mentions?: string[]
  ): Comment {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    const parentComment = contract.comments.find((c) => c.id === commentId);
    if (!parentComment) throw new Error('Comment not found');

    const user = contract.collaborators.find((u) => u.id === userId);
    if (!user) throw new Error('User is not a collaborator');

    const reply: Comment = {
      id: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contractId,
      author: user,
      content,
      mentions: mentions || [],
      createdAt: new Date(),
      resolved: false,
      replies: [],
      reactions: [],
    };

    parentComment.replies.push(reply);
    contract.updatedAt = new Date();

    // In production: send notifications
    // In production: broadcast to WebSocket

    return reply;
  }

  /**
   * Resolve comment thread
   */
  resolveComment(contractId: string, commentId: string, userId: string): void {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    const comment = contract.comments.find((c) => c.id === commentId);
    if (!comment) throw new Error('Comment not found');

    comment.resolved = true;
    comment.resolvedBy = userId;
    comment.resolvedAt = new Date();

    contract.updatedAt = new Date();

    // In production: broadcast to WebSocket
  }

  /**
   * Edit contract content (creates new version)
   */
  editContract(
    contractId: string,
    userId: string,
    newContent: string,
    message: string
  ): Version {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    const permission = contract.permissions.get(userId);
    if (!permission?.canEdit) {
      throw new Error('User does not have permission to edit');
    }

    if (contract.locked && contract.lockedBy !== userId) {
      throw new Error(`Contract is locked by ${contract.lockedBy}`);
    }

    const user = contract.collaborators.find((u) => u.id === userId)!;

    // Calculate diff (simplified)
    const changes = this.calculateChanges(contract.content, newContent);

    const newVersion: Version = {
      id: `v-${Date.now()}`,
      contractId,
      version: contract.currentVersion + 1,
      content: newContent,
      changes,
      author: user,
      createdAt: new Date(),
      message,
    };

    contract.versions.push(newVersion);
    contract.currentVersion = newVersion.version;
    contract.content = newContent;
    contract.updatedAt = new Date();

    contract.activities.push({
      id: `activity-${Date.now()}`,
      contractId,
      type: 'version_created',
      user,
      timestamp: new Date(),
      description: `${user.name} created version ${newVersion.version}`,
      metadata: { versionId: newVersion.id, message },
    });

    // In production: broadcast changes to WebSocket connections
    // In production: save to database

    return newVersion;
  }

  /**
   * Calculate changes between versions
   */
  private calculateChanges(
    oldContent: string,
    newContent: string
  ): Array<{
    type: 'added' | 'removed' | 'modified';
    position: { start: number; end: number };
    content: string;
    previousContent?: string;
  }> {
    // Simplified diff calculation
    // In production: use a proper diff library like diff-match-patch

    const changes: any[] = [];

    if (oldContent !== newContent) {
      changes.push({
        type: 'modified',
        position: { start: 0, end: newContent.length },
        content: newContent,
        previousContent: oldContent,
      });
    }

    return changes;
  }

  /**
   * Create approval workflow
   */
  createApprovalWorkflow(
    contractId: string,
    name: string,
    stages: Array<{
      name: string;
      approvers: string[];
      requiresAll: boolean;
    }>
  ): ApprovalWorkflow {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    const workflow: ApprovalWorkflow = {
      id: `workflow-${Date.now()}`,
      contractId,
      name,
      stages: stages.map((stage, index) => ({
        id: `stage-${index}`,
        name: stage.name,
        order: index,
        approvers: stage.approvers,
        requiresAll: stage.requiresAll,
        status: index === 0 ? 'pending' : 'pending',
        approvals: [],
      })),
      currentStage: 0,
      status: 'in-review',
      createdAt: new Date(),
    };

    contract.workflow = workflow;
    contract.updatedAt = new Date();

    // In production: send notifications to first stage approvers

    return workflow;
  }

  /**
   * Approve/reject workflow stage
   */
  processApproval(
    contractId: string,
    userId: string,
    decision: 'approved' | 'rejected',
    comment?: string
  ): void {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    if (!contract.workflow) throw new Error('No workflow exists');

    const currentStage = contract.workflow.stages[contract.workflow.currentStage];

    if (!currentStage.approvers.includes(userId)) {
      throw new Error('User is not an approver for this stage');
    }

    const user = contract.collaborators.find((u) => u.id === userId)!;

    currentStage.approvals.push({
      userId,
      decision,
      comment,
      timestamp: new Date(),
    });

    // Check if stage is complete
    if (decision === 'rejected') {
      currentStage.status = 'rejected';
      contract.workflow.status = 'rejected';

      contract.activities.push({
        id: `activity-${Date.now()}`,
        contractId,
        type: 'rejected',
        user,
        timestamp: new Date(),
        description: `${user.name} rejected at ${currentStage.name}`,
        metadata: { comment },
      });
    } else {
      // Check if stage requirements met
      const approvalCount = currentStage.approvals.filter(
        (a) => a.decision === 'approved'
      ).length;

      const isStageComplete = currentStage.requiresAll
        ? approvalCount === currentStage.approvers.length
        : approvalCount >= 1;

      if (isStageComplete) {
        currentStage.status = 'approved';

        contract.activities.push({
          id: `activity-${Date.now()}`,
          contractId,
          type: 'approved',
          user,
          timestamp: new Date(),
          description: `${user.name} approved ${currentStage.name}`,
          metadata: { comment },
        });

        // Move to next stage
        if (contract.workflow.currentStage < contract.workflow.stages.length - 1) {
          contract.workflow.currentStage++;
        } else {
          // Workflow complete
          contract.workflow.status = 'approved';
          contract.workflow.completedAt = new Date();
        }
      }
    }

    contract.updatedAt = new Date();

    // In production: send notifications
  }

  /**
   * Lock contract for editing
   */
  lockContract(contractId: string, userId: string): void {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    if (contract.locked && contract.lockedBy !== userId) {
      throw new Error(`Contract is already locked by ${contract.lockedBy}`);
    }

    contract.locked = true;
    contract.lockedBy = userId;
    contract.lockedAt = new Date();

    // In production: broadcast lock status to WebSocket
  }

  /**
   * Unlock contract
   */
  unlockContract(contractId: string, userId: string): void {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    if (contract.lockedBy !== userId) {
      throw new Error('Only the user who locked can unlock');
    }

    contract.locked = false;
    contract.lockedBy = undefined;
    contract.lockedAt = undefined;

    // In production: broadcast unlock status
  }

  /**
   * Get contract activity feed
   */
  getActivityFeed(contractId: string, limit: number = 50): Activity[] {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    return contract.activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Compare versions
   */
  compareVersions(
    contractId: string,
    version1: number,
    version2: number
  ): {
    version1: Version;
    version2: Version;
    differences: Array<{
      type: 'added' | 'removed' | 'modified';
      position: { start: number; end: number };
      content: string;
    }>;
  } {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    const v1 = contract.versions.find((v) => v.version === version1);
    const v2 = contract.versions.find((v) => v.version === version2);

    if (!v1 || !v2) throw new Error('Version not found');

    const differences = this.calculateChanges(v1.content, v2.content);

    return {
      version1: v1,
      version2: v2,
      differences,
    };
  }

  /**
   * Get online collaborators
   */
  getOnlineCollaborators(contractId: string): User[] {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    return contract.collaborators.filter((u) => u.status === 'online');
  }

  /**
   * Update user presence
   */
  updateUserPresence(userId: string, status: 'online' | 'away' | 'offline'): void {
    const user = this.activeUsers.get(userId);
    if (user) {
      user.status = status;
      if (status === 'offline') {
        user.lastSeen = new Date();
      }
    }

    // In production: broadcast presence to all contracts user is in
  }
}

// Export singleton instance
export const collaborationManager = new CollaborationManager();
