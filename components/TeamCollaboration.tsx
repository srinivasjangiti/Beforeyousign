'use client';

import { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Send,
  AtSign,
  Paperclip,
  MoreVertical,
  Shield,
  Eye,
  Edit,
  UserPlus,
  Bell,
  Search,
  Filter,
  Star,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'reviewer' | 'viewer';
  avatar: string;
  status: 'online' | 'offline' | 'away';
}

interface Comment {
  id: string;
  author: TeamMember;
  content: string;
  clauseTitle: string;
  timestamp: string;
  replies: Comment[];
  mentions: string[];
  attachments?: string[];
  resolved: boolean;
  reactions: { emoji: string; users: string[] }[];
}

interface ApprovalRequest {
  id: string;
  contractName: string;
  requestedBy: TeamMember;
  requestedTo: TeamMember[];
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  createdAt: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  comments: number;
}

const mockTeam: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'owner',
    avatar: 'JD',
    status: 'online'
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@company.com',
    role: 'admin',
    avatar: 'SS',
    status: 'online'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    role: 'reviewer',
    avatar: 'MJ',
    status: 'away'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@company.com',
    role: 'viewer',
    avatar: 'ED',
    status: 'offline'
  }
];

const mockComments: Comment[] = [
  {
    id: 'c1',
    author: mockTeam[1],
    content: '@John Doe This liability cap seems too high. We should negotiate this down to 6 months instead of 12.',
    clauseTitle: 'Liability Limitation',
    timestamp: '2024-12-15T10:30:00',
    replies: [
      {
        id: 'c1-r1',
        author: mockTeam[0],
        content: 'Good catch! I agree. Let me reach out to their legal team.',
        clauseTitle: 'Liability Limitation',
        timestamp: '2024-12-15T11:15:00',
        replies: [],
        mentions: ['Sarah Smith'],
        resolved: false,
        reactions: [{ emoji: '👍', users: ['2', '3'] }]
      }
    ],
    mentions: ['John Doe'],
    resolved: false,
    reactions: [{ emoji: '⚠️', users: ['1', '2', '3'] }]
  },
  {
    id: 'c2',
    author: mockTeam[2],
    content: 'The auto-renewal clause needs immediate attention. We should require 90-day notice instead of automatic renewal.',
    clauseTitle: 'Auto-Renewal Terms',
    timestamp: '2024-12-15T09:45:00',
    replies: [],
    mentions: [],
    resolved: true,
    reactions: [{ emoji: '✅', users: ['1'] }]
  },
  {
    id: 'c3',
    author: mockTeam[1],
    content: 'IP ownership terms look favorable. No concerns here.',
    clauseTitle: 'Intellectual Property',
    timestamp: '2024-12-15T08:20:00',
    replies: [],
    mentions: [],
    resolved: true,
    reactions: [{ emoji: '👍', users: ['1', '2'] }]
  }
];

const mockApprovals: ApprovalRequest[] = [
  {
    id: 'a1',
    contractName: 'Adobe Creative Cloud - Annual Subscription',
    requestedBy: mockTeam[0],
    requestedTo: [mockTeam[1], mockTeam[2]],
    status: 'pending',
    createdAt: '2024-12-14T14:00:00',
    deadline: '2024-12-16T17:00:00',
    priority: 'urgent',
    comments: 3
  },
  {
    id: 'a2',
    contractName: 'Office Space Lease Agreement',
    requestedBy: mockTeam[1],
    requestedTo: [mockTeam[0]],
    status: 'approved',
    createdAt: '2024-12-13T10:00:00',
    deadline: '2024-12-15T17:00:00',
    priority: 'high',
    comments: 7
  },
  {
    id: 'a3',
    contractName: 'SaaS Platform License',
    requestedBy: mockTeam[2],
    requestedTo: [mockTeam[0], mockTeam[1]],
    status: 'changes_requested',
    createdAt: '2024-12-12T09:00:00',
    deadline: '2024-12-17T17:00:00',
    priority: 'medium',
    comments: 12
  }
];

export default function TeamCollaboration() {
  const [activeTab, setActiveTab] = useState<'comments' | 'approvals' | 'team'>('comments');
  const [filterResolved, setFilterResolved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newComment, setNewComment] = useState('');
  const [selectedClause, setSelectedClause] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'reviewer' | 'viewer'>('reviewer');

  const filteredComments = mockComments.filter(comment => {
    const matchesResolved = filterResolved ? !comment.resolved : true;
    const matchesSearch = searchQuery === '' || 
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.clauseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesResolved && matchesSearch;
  });

  const roleColors = {
    owner: 'bg-purple-100 text-purple-700 border-purple-300',
    admin: 'bg-blue-100 text-blue-700 border-blue-300',
    reviewer: 'bg-green-100 text-green-700 border-green-300',
    viewer: 'bg-stone-100 text-stone-700 border-stone-300'
  };

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-amber-500',
    offline: 'bg-stone-300'
  };

  const approvalStatusColors = {
    pending: 'bg-amber-100 text-amber-700 border-amber-300',
    approved: 'bg-green-100 text-green-700 border-green-300',
    rejected: 'bg-red-100 text-red-700 border-red-300',
    changes_requested: 'bg-blue-100 text-blue-700 border-blue-300'
  };

  const priorityColors = {
    low: 'bg-stone-100 text-stone-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-amber-100 text-amber-700',
    urgent: 'bg-red-100 text-red-700'
  };

  const handleSendComment = () => {
    if (!newComment.trim() || !selectedClause) return;
    // Would send comment to backend
    setNewComment('');
    setSelectedClause('');
  };

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) return;
    // Would send invitation
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-stone-900 mb-2">Team Collaboration</h1>
            <p className="text-lg text-stone-600">Work together on contract reviews and approvals</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors"
          >
            <UserPlus className="w-5 h-5" />
            Invite Team Member
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-stone-200 rounded-xl mb-8">
          <div className="flex border-b border-stone-200">
            <button
              onClick={() => setActiveTab('comments')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'comments'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <MessageSquare className="w-5 h-5 inline mr-2" />
              Comments ({mockComments.length})
            </button>
            <button
              onClick={() => setActiveTab('approvals')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'approvals'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <CheckCircle className="w-5 h-5 inline mr-2" />
              Approvals ({mockApprovals.filter(a => a.status === 'pending').length})
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'team'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Team ({mockTeam.length})
            </button>
          </div>
        </div>

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-6">
            {/* Add Comment Section */}
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Add Comment</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="clause-select" className="block text-sm font-semibold text-stone-700 mb-2">Clause</label>
                  <select
                    id="clause-select"
                    value={selectedClause}
                    onChange={(e) => setSelectedClause(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="">Select a clause...</option>
                    <option value="payment">Payment Terms</option>
                    <option value="liability">Liability Limitation</option>
                    <option value="renewal">Auto-Renewal Terms</option>
                    <option value="ip">Intellectual Property</option>
                    <option value="termination">Termination Rights</option>
                  </select>
                </div>
                <div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Type @ to mention team members..."
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 min-h-[100px]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button aria-label="Mention team member" className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
                      <AtSign className="w-5 h-5 text-stone-600" />
                    </button>
                    <button aria-label="Attach file" className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
                      <Paperclip className="w-5 h-5 text-stone-600" />
                    </button>
                  </div>
                  <button
                    onClick={handleSendComment}
                    disabled={!newComment.trim() || !selectedClause}
                    className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    Send Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-stone-200 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search comments..."
                    className="w-full pl-10 pr-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterResolved}
                    onChange={(e) => setFilterResolved(e.target.checked)}
                    className="w-4 h-4 text-stone-900 focus:ring-stone-900 rounded"
                  />
                  <span className="text-sm text-stone-700">Hide resolved</span>
                </label>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {filteredComments.map((comment) => (
                <div key={comment.id} className="bg-white border border-stone-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {comment.author.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-bold text-stone-900">{comment.author.name}</span>
                          <span className="text-sm text-stone-500 ml-2">
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {comment.resolved && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                              RESOLVED
                            </span>
                          )}
                          <button aria-label="Comment options" className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-stone-600" />
                          </button>
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                          {comment.clauseTitle}
                        </span>
                      </div>
                      <p className="text-stone-700 mb-3">{comment.content}</p>
                      <div className="flex items-center gap-3">
                        {comment.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            className="flex items-center gap-1 px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded text-sm transition-colors"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="text-stone-600">{reaction.users.length}</span>
                          </button>
                        ))}
                        <button className="px-2 py-1 text-sm text-stone-600 hover:bg-stone-100 rounded transition-colors">
                          Reply
                        </button>
                        {!comment.resolved && (
                          <button className="px-2 py-1 text-sm text-green-600 hover:bg-green-50 rounded transition-colors">
                            Mark Resolved
                          </button>
                        )}
                      </div>

                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-stone-200 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-stone-700 text-white rounded-full flex items-center justify-center font-bold text-xs">
                                {reply.author.avatar}
                              </div>
                              <div className="flex-1">
                                <div className="mb-1">
                                  <span className="font-semibold text-stone-900 text-sm">{reply.author.name}</span>
                                  <span className="text-xs text-stone-500 ml-2">
                                    {new Date(reply.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm text-stone-700">{reply.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approvals Tab */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            {mockApprovals.map((approval) => (
              <div key={approval.id} className="bg-white border border-stone-200 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-stone-900">{approval.contractName}</h3>
                      <span className={`px-2 py-1 text-xs font-bold rounded border ${approvalStatusColors[approval.status]}`}>
                        {approval.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 text-xs font-bold rounded ${priorityColors[approval.priority]}`}>
                        {approval.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-stone-600 space-y-1">
                      <div>Requested by: <span className="font-semibold">{approval.requestedBy.name}</span></div>
                      <div>Deadline: <span className="font-semibold">{new Date(approval.deadline).toLocaleString()}</span></div>
                      <div>Reviewers: {approval.requestedTo.map(m => m.name).join(', ')}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Approve
                    </button>
                    <button className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-semibold hover:bg-stone-50 transition-colors">
                      Request Changes
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-stone-600">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {approval.comments} comments
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Created {new Date(approval.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            {mockTeam.map((member) => (
              <div key={member.id} className="bg-white border border-stone-200 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {member.avatar}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[member.status]} border-2 border-white rounded-full`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-lg">{member.name}</h3>
                      <p className="text-sm text-stone-600">{member.email}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded border ${roleColors[member.role]}`}>
                      {member.role.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button aria-label="Send message" className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
                      <MessageSquare className="w-5 h-5 text-stone-600" />
                    </button>
                    <button aria-label="Member options" className="p-2 hover:bg-stone-100 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-stone-600" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="font-semibold text-stone-900">Permissions</div>
                    <div className="text-stone-600 mt-1">
                      {member.role === 'owner' && 'Full access'}
                      {member.role === 'admin' && 'Manage & approve'}
                      {member.role === 'reviewer' && 'Review & comment'}
                      {member.role === 'viewer' && 'View only'}
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="font-semibold text-stone-900">Status</div>
                    <div className="text-stone-600 mt-1 capitalize">{member.status}</div>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <div className="font-semibold text-stone-900">Activity</div>
                    <div className="text-stone-600 mt-1">Active today</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50" onClick={() => setShowInviteModal(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Invite Team Member</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label htmlFor="invite-role-select" className="block text-sm font-semibold text-stone-700 mb-2">Role</label>
                  <select
                    id="invite-role-select"
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="viewer">Viewer - Can view contracts only</option>
                    <option value="reviewer">Reviewer - Can review and comment</option>
                    <option value="admin">Admin - Can manage and approve</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleInviteMember}
                    className="flex-1 px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors"
                  >
                    Send Invitation
                  </button>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="px-6 py-3 border border-stone-300 text-stone-700 rounded-xl font-semibold hover:bg-stone-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
