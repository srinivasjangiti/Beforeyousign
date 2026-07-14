/**
 * Real-Time Collaboration System
 * 
 * Google Docs-style collaborative editing for contracts:
 * - Live cursors and selections
 * - Real-time text editing with conflict resolution
 * - Presence awareness (who's viewing/editing)
 * - Comments and discussions
 * - Suggested edits and track changes
 * - Live notifications
 * - Session recording and playback
 */

export interface CollaborationSession {
  id: string;
  contractId: string;
  startedAt: Date;
  endedAt?: Date;
  
  // Participants
  participants: Participant[];
  activeUsers: string[]; // Currently online user IDs
  
  // Document state
  documentVersion: number;
  operations: Operation[];
  
  // Comments
  comments: Comment[];
  suggestions: Suggestion[];
  
  // Cursor tracking
  cursors: Map<string, CursorPosition>;
  selections: Map<string, TextSelection>;
  
  // Session recording
  recording: boolean;
  recordedEvents: SessionEvent[];
}

export interface Participant {
  userId: string;
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  role: 'owner' | 'editor' | 'commenter' | 'viewer';
  
  // Presence
  status: 'active' | 'idle' | 'offline';
  lastSeen: Date;
  currentView?: ViewPosition;
  
  // Permissions
  canEdit: boolean;
  canComment: boolean;
  canSuggest: boolean;
  
  // Activity
  joinedAt: Date;
  editCount: number;
  commentCount: number;
}

export interface CursorPosition {
  userId: string;
  position: number; // Character index in document
  timestamp: Date;
  color: string; // User-specific color for cursor
}

export interface TextSelection {
  userId: string;
  start: number;
  end: number;
  timestamp: Date;
  color: string;
}

export interface ViewPosition {
  scrollPosition: number;
  visibleRange: {
    start: number;
    end: number;
  };
}

export interface Operation {
  id: string;
  type: 'insert' | 'delete' | 'replace' | 'format';
  userId: string;
  timestamp: Date;
  
  // Operation details
  position: number;
  content?: string;
  length?: number;
  formatting?: TextFormat;
  
  // Operational transformation
  version: number; // Document version when operation was created
  transformed: boolean;
  originalOperation?: Operation;
  
  // Conflict resolution
  conflictsWith?: string[]; // IDs of conflicting operations
  resolved: boolean;
}

export interface TextFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  color?: string;
  backgroundColor?: string;
  fontSize?: number;
}

export interface Comment {
  id: string;
  threadId: string;
  
  // Author
  userId: string;
  userName: string;
  
  // Content
  text: string;
  timestamp: Date;
  editedAt?: Date;
  
  // Position
  anchorPosition: number;
  anchorText: string; // Text that was commented on
  
  // Thread
  parentId?: string; // For replies
  replies: Comment[];
  
  // Status
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  
  // Reactions
  reactions: Reaction[];
  
  // Metadata
  mentions: string[]; // User IDs mentioned
  attachments?: Attachment[];
}

export interface Suggestion {
  id: string;
  
  // Author
  userId: string;
  userName: string;
  
  // Change details
  type: 'insertion' | 'deletion' | 'replacement';
  position: number;
  originalText?: string;
  suggestedText?: string;
  
  // Metadata
  timestamp: Date;
  reason?: string;
  
  // Review status
  status: 'pending' | 'accepted' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  reviewComment?: string;
  
  // Discussion
  comments: Comment[];
}

export interface Reaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedAt: Date;
}

export interface SessionEvent {
  id: string;
  type: 'join' | 'leave' | 'edit' | 'comment' | 'suggestion' | 'cursor-move' | 'selection-change';
  userId: string;
  timestamp: Date;
  data: any;
}

export interface ConflictResolution {
  conflictId: string;
  operations: Operation[];
  resolution: 'manual' | 'automatic' | 'pending';
  resolvedOperation?: Operation;
  strategy: 'accept-theirs' | 'accept-mine' | 'merge' | 'reject';
}

export class RealtimeCollaborationEngine {
  private sessions: Map<string, CollaborationSession> = new Map();
  private websocketConnections: Map<string, any> = new Map(); // WebSocket per user

  /**
   * Create or join a collaboration session
   */
  async joinSession(
    contractId: string,
    userId: string,
    userName: string,
    role: Participant['role']
  ): Promise<CollaborationSession> {
    let session = Array.from(this.sessions.values())
      .find(s => s.contractId === contractId && !s.endedAt);

    if (!session) {
      session = this.createNewSession(contractId);
    }

    // Add participant
    const existingParticipant = session.participants.find(p => p.userId === userId);
    
    if (!existingParticipant) {
      session.participants.push({
        userId,
        userName,
        userEmail: `${userId}@example.com`,
        role,
        status: 'active',
        lastSeen: new Date(),
        canEdit: role === 'owner' || role === 'editor',
        canComment: role !== 'viewer',
        canSuggest: role !== 'viewer',
        joinedAt: new Date(),
        editCount: 0,
        commentCount: 0,
      });
    } else {
      existingParticipant.status = 'active';
      existingParticipant.lastSeen = new Date();
    }

    session.activeUsers.push(userId);

    // Record join event
    session.recordedEvents.push({
      id: `event-${Date.now()}`,
      type: 'join',
      userId,
      timestamp: new Date(),
      data: { userName },
    });

    // Notify other participants
    this.broadcastToSession(session, {
      type: 'user-joined',
      userId,
      userName,
    });

    return session;
  }

  /**
   * Leave a collaboration session
   */
  async leaveSession(contractId: string, userId: string): Promise<void> {
    const session = Array.from(this.sessions.values())
      .find(s => s.contractId === contractId && !s.endedAt);

    if (!session) return;

    // Update participant status
    const participant = session.participants.find(p => p.userId === userId);
    if (participant) {
      participant.status = 'offline';
      participant.lastSeen = new Date();
    }

    // Remove from active users
    session.activeUsers = session.activeUsers.filter(id => id !== userId);

    // Remove cursor and selection
    session.cursors.delete(userId);
    session.selections.delete(userId);

    // Record leave event
    session.recordedEvents.push({
      id: `event-${Date.now()}`,
      type: 'leave',
      userId,
      timestamp: new Date(),
      data: {},
    });

    // Notify others
    this.broadcastToSession(session, {
      type: 'user-left',
      userId,
    });
  }

  /**
   * Apply an edit operation with operational transformation
   */
  async applyOperation(
    sessionId: string,
    userId: string,
    operation: Omit<Operation, 'id' | 'timestamp' | 'version' | 'transformed' | 'resolved'>
  ): Promise<Operation> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const participant = session.participants.find(p => p.userId === userId);
    if (!participant || !participant.canEdit) {
      throw new Error('User does not have edit permission');
    }

    // Create full operation
    const fullOperation: Operation = {
      ...operation,
      id: `op-${Date.now()}-${userId}`,
      timestamp: new Date(),
      version: session.documentVersion,
      transformed: false,
      resolved: true,
    };

    // Apply operational transformation for concurrent edits
    const transformedOp = this.transformOperation(fullOperation, session);

    // Add to session operations
    session.operations.push(transformedOp);
    session.documentVersion++;

    // Update participant stats
    participant.editCount++;

    // Record event
    session.recordedEvents.push({
      id: `event-${Date.now()}`,
      type: 'edit',
      userId,
      timestamp: new Date(),
      data: { operation: transformedOp },
    });

    // Broadcast to all participants
    this.broadcastToSession(session, {
      type: 'operation',
      operation: transformedOp,
    });

    return transformedOp;
  }

  /**
   * Update cursor position
   */
  async updateCursor(sessionId: string, userId: string, position: number): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.cursors.set(userId, {
      userId,
      position,
      timestamp: new Date(),
      color: this.getUserColor(userId),
    });

    // Broadcast cursor update
    this.broadcastToSession(session, {
      type: 'cursor-update',
      userId,
      position,
    }, [userId]); // Exclude sender
  }

  /**
   * Update text selection
   */
  async updateSelection(
    sessionId: string,
    userId: string,
    start: number,
    end: number
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    if (start === end) {
      session.selections.delete(userId);
    } else {
      session.selections.set(userId, {
        userId,
        start,
        end,
        timestamp: new Date(),
        color: this.getUserColor(userId),
      });
    }

    // Broadcast selection update
    this.broadcastToSession(session, {
      type: 'selection-update',
      userId,
      start,
      end,
    }, [userId]);
  }

  /**
   * Add a comment
   */
  async addComment(
    sessionId: string,
    userId: string,
    userName: string,
    text: string,
    anchorPosition: number,
    anchorText: string,
    parentId?: string
  ): Promise<Comment> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const participant = session.participants.find(p => p.userId === userId);
    if (!participant || !participant.canComment) {
      throw new Error('User does not have comment permission');
    }

    const threadId = parentId 
      ? session.comments.find(c => c.id === parentId)?.threadId || parentId
      : `thread-${Date.now()}`;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      threadId,
      userId,
      userName,
      text,
      timestamp: new Date(),
      anchorPosition,
      anchorText,
      parentId,
      replies: [],
      resolved: false,
      reactions: [],
      mentions: this.extractMentions(text),
    };

    // Add to parent's replies if it's a reply
    if (parentId) {
      const parentComment = session.comments.find(c => c.id === parentId);
      if (parentComment) {
        parentComment.replies.push(comment);
      }
    }

    session.comments.push(comment);
    participant.commentCount++;

    // Record event
    session.recordedEvents.push({
      id: `event-${Date.now()}`,
      type: 'comment',
      userId,
      timestamp: new Date(),
      data: { comment },
    });

    // Broadcast
    this.broadcastToSession(session, {
      type: 'comment-added',
      comment,
    });

    // Notify mentioned users
    this.notifyMentions(comment.mentions, session, comment);

    return comment;
  }

  /**
   * Create a suggestion
   */
  async createSuggestion(
    sessionId: string,
    userId: string,
    userName: string,
    type: Suggestion['type'],
    position: number,
    originalText?: string,
    suggestedText?: string,
    reason?: string
  ): Promise<Suggestion> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const participant = session.participants.find(p => p.userId === userId);
    if (!participant || !participant.canSuggest) {
      throw new Error('User does not have suggestion permission');
    }

    const suggestion: Suggestion = {
      id: `suggestion-${Date.now()}`,
      userId,
      userName,
      type,
      position,
      originalText,
      suggestedText,
      timestamp: new Date(),
      reason,
      status: 'pending',
      comments: [],
    };

    session.suggestions.push(suggestion);

    // Record event
    session.recordedEvents.push({
      id: `event-${Date.now()}`,
      type: 'suggestion',
      userId,
      timestamp: new Date(),
      data: { suggestion },
    });

    // Broadcast
    this.broadcastToSession(session, {
      type: 'suggestion-created',
      suggestion,
    });

    return suggestion;
  }

  /**
   * Review a suggestion (accept/reject)
   */
  async reviewSuggestion(
    sessionId: string,
    suggestionId: string,
    reviewerId: string,
    decision: 'accepted' | 'rejected',
    comment?: string
  ): Promise<Suggestion> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const suggestion = session.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) throw new Error('Suggestion not found');

    suggestion.status = decision;
    suggestion.reviewedBy = reviewerId;
    suggestion.reviewedAt = new Date();
    suggestion.reviewComment = comment;

    // If accepted, apply the change
    if (decision === 'accepted') {
      const operation: Operation = {
        id: `op-suggestion-${suggestionId}`,
        type: suggestion.type === 'insertion' ? 'insert' : suggestion.type === 'deletion' ? 'delete' : 'replace',
        userId: reviewerId,
        timestamp: new Date(),
        position: suggestion.position,
        content: suggestion.suggestedText,
        length: suggestion.originalText?.length,
        version: session.documentVersion,
        transformed: false,
        resolved: true,
      };

      session.operations.push(operation);
      session.documentVersion++;
    }

    // Broadcast
    this.broadcastToSession(session, {
      type: 'suggestion-reviewed',
      suggestion,
    });

    return suggestion;
  }

  /**
   * Resolve a comment thread
   */
  async resolveComment(
    sessionId: string,
    commentId: string,
    resolverId: string
  ): Promise<Comment> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const comment = session.comments.find(c => c.id === commentId);
    if (!comment) throw new Error('Comment not found');

    comment.resolved = true;
    comment.resolvedBy = resolverId;
    comment.resolvedAt = new Date();

    // Resolve entire thread
    const threadComments = session.comments.filter(c => c.threadId === comment.threadId);
    threadComments.forEach(c => {
      c.resolved = true;
      c.resolvedBy = resolverId;
      c.resolvedAt = new Date();
    });

    // Broadcast
    this.broadcastToSession(session, {
      type: 'comment-resolved',
      commentId,
      threadId: comment.threadId,
    });

    return comment;
  }

  /**
   * Get document state with all operations applied
   */
  async getDocumentState(sessionId: string): Promise<{
    content: string;
    version: number;
    operations: Operation[];
  }> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    // Apply all operations to reconstruct document
    let content = ''; // Start with base document (would load from DB)
    
    for (const op of session.operations.sort((a, b) => a.version - b.version)) {
      content = this.applyOperationToText(content, op);
    }

    return {
      content,
      version: session.documentVersion,
      operations: session.operations,
    };
  }

  /**
   * Replay session events for playback
   */
  async replaySession(sessionId: string): Promise<SessionEvent[]> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    return session.recordedEvents.sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
  }

  // Private helper methods

  private createNewSession(contractId: string): CollaborationSession {
    const session: CollaborationSession = {
      id: `session-${Date.now()}`,
      contractId,
      startedAt: new Date(),
      participants: [],
      activeUsers: [],
      documentVersion: 0,
      operations: [],
      comments: [],
      suggestions: [],
      cursors: new Map(),
      selections: new Map(),
      recording: true,
      recordedEvents: [],
    };

    this.sessions.set(session.id, session);
    return session;
  }

  private transformOperation(operation: Operation, session: CollaborationSession): Operation {
    // Operational Transformation algorithm
    // Transform operation against concurrent operations
    
    const concurrentOps = session.operations.filter(
      op => op.version >= operation.version && op.userId !== operation.userId
    );

    let transformedOp = { ...operation };

    for (const concurrentOp of concurrentOps) {
      transformedOp = this.transformPair(transformedOp, concurrentOp);
    }

    transformedOp.transformed = true;
    transformedOp.originalOperation = operation;

    return transformedOp;
  }

  private transformPair(op1: Operation, op2: Operation): Operation {
    // Transform op1 against op2
    // This is a simplified version - full OT is more complex

    if (op1.type === 'insert' && op2.type === 'insert') {
      if (op2.position <= op1.position) {
        op1.position += op2.content?.length || 0;
      }
    } else if (op1.type === 'insert' && op2.type === 'delete') {
      if (op2.position < op1.position) {
        op1.position -= op2.length || 0;
      }
    } else if (op1.type === 'delete' && op2.type === 'insert') {
      if (op2.position <= op1.position) {
        op1.position += op2.content?.length || 0;
      }
    } else if (op1.type === 'delete' && op2.type === 'delete') {
      if (op2.position < op1.position) {
        op1.position -= op2.length || 0;
      }
    }

    return op1;
  }

  private applyOperationToText(text: string, operation: Operation): string {
    switch (operation.type) {
      case 'insert':
        return text.slice(0, operation.position) + 
               (operation.content || '') + 
               text.slice(operation.position);
      
      case 'delete':
        return text.slice(0, operation.position) + 
               text.slice(operation.position + (operation.length || 0));
      
      case 'replace':
        return text.slice(0, operation.position) + 
               (operation.content || '') + 
               text.slice(operation.position + (operation.length || 0));
      
      default:
        return text;
    }
  }

  private broadcastToSession(
    session: CollaborationSession,
    message: any,
    excludeUsers: string[] = []
  ): void {
    session.activeUsers
      .filter(userId => !excludeUsers.includes(userId))
      .forEach(userId => {
        const ws = this.websocketConnections.get(userId);
        if (ws) {
          // ws.send(JSON.stringify(message)); // Would send via WebSocket
        }
      });
  }

  private getUserColor(userId: string): string {
    // Generate consistent color for user
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
      '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];
    
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  private extractMentions(text: string): string[] {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;

    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }

    return mentions;
  }

  private notifyMentions(mentions: string[], session: CollaborationSession, comment: Comment): void {
    // Send notifications to mentioned users
    mentions.forEach(userId => {
      const participant = session.participants.find(p => p.userId === userId);
      if (participant) {
        // Send notification (email, push, etc.)
      }
    });
  }
}

// Export utilities

export function generateSessionSummary(session: CollaborationSession): {
  duration: number;
  participantCount: number;
  editCount: number;
  commentCount: number;
  suggestionCount: number;
  topContributors: { userId: string; userName: string; contributions: number }[];
} {
  const duration = session.endedAt 
    ? session.endedAt.getTime() - session.startedAt.getTime()
    : Date.now() - session.startedAt.getTime();

  const topContributors = session.participants
    .map(p => ({
      userId: p.userId,
      userName: p.userName,
      contributions: p.editCount + p.commentCount,
    }))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 5);

  return {
    duration,
    participantCount: session.participants.length,
    editCount: session.operations.length,
    commentCount: session.comments.length,
    suggestionCount: session.suggestions.length,
    topContributors,
  };
}

export function detectEditConflicts(operations: Operation[]): ConflictResolution[] {
  const conflicts: ConflictResolution[] = [];
  
  // Group operations by position and time
  const timeWindow = 5000; // 5 seconds
  
  for (let i = 0; i < operations.length; i++) {
    for (let j = i + 1; j < operations.length; j++) {
      const op1 = operations[i];
      const op2 = operations[j];
      
      // Check if operations overlap in position and time
      const timeDiff = Math.abs(op2.timestamp.getTime() - op1.timestamp.getTime());
      const positionOverlap = Math.abs(op2.position - op1.position) < 100;
      
      if (timeDiff < timeWindow && positionOverlap) {
        conflicts.push({
          conflictId: `conflict-${i}-${j}`,
          operations: [op1, op2],
          resolution: 'automatic',
          strategy: 'merge',
        });
      }
    }
  }
  
  return conflicts;
}
