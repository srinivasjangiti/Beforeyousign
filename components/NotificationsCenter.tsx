'use client';

import { useState } from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileText,
  Users,
  MessageSquare,
  Calendar,
  TrendingUp,
  Settings,
  Check,
  Trash2,
  Filter,
  X
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'contract' | 'renewal' | 'approval' | 'comment' | 'signature' | 'team' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    type: 'signature',
    title: 'Signature Request Pending',
    message: 'Adobe Representative has not yet signed the Creative Cloud agreement. 2 days remaining.',
    timestamp: '2024-12-15T10:30:00',
    read: false,
    priority: 'high',
    actionUrl: '/esignature',
    actionText: 'View Request'
  },
  {
    id: 'n2',
    type: 'renewal',
    title: 'Contract Renewal Alert',
    message: 'Adobe Creative Cloud renews in 30 days. Review terms and consider negotiation.',
    timestamp: '2024-12-15T08:00:00',
    read: false,
    priority: 'urgent',
    actionUrl: '/renewals',
    actionText: 'Review'
  },
  {
    id: 'n3',
    type: 'comment',
    title: 'New Comment on Contract',
    message: 'Sarah Smith mentioned you in a comment on "Liability Limitation" clause.',
    timestamp: '2024-12-15T11:15:00',
    read: false,
    priority: 'medium',
    actionUrl: '/team',
    actionText: 'View Comment'
  },
  {
    id: 'n4',
    type: 'approval',
    title: 'Approval Request',
    message: 'John Doe requested your approval on "SaaS Platform License".',
    timestamp: '2024-12-14T16:00:00',
    read: true,
    priority: 'high',
    actionUrl: '/team',
    actionText: 'Review & Approve'
  },
  {
    id: 'n5',
    type: 'contract',
    title: 'Contract Analysis Complete',
    message: 'Your analysis for "Freelance Service Agreement" is ready with 3 red flags identified.',
    timestamp: '2024-12-14T14:30:00',
    read: true,
    priority: 'medium',
    actionUrl: '/contracts',
    actionText: 'View Analysis'
  },
  {
    id: 'n6',
    type: 'team',
    title: 'New Team Member',
    message: 'Emily Davis joined your team as a Viewer.',
    timestamp: '2024-12-14T09:00:00',
    read: true,
    priority: 'low',
    actionUrl: '/team',
    actionText: 'View Team'
  },
  {
    id: 'n7',
    type: 'system',
    title: 'Weekly Report Available',
    message: 'Your contract analytics report for this week is ready to download.',
    timestamp: '2024-12-13T07:00:00',
    read: true,
    priority: 'low',
    actionUrl: '/analytics',
    actionText: 'View Report'
  }
];

export default function NotificationsCenter() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filterType, setFilterType] = useState<'all' | Notification['type']>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const filteredNotifications = notifications.filter(n => {
    const matchesType = filterType === 'all' || n.type === filterType;
    const matchesRead = !showUnreadOnly || !n.read;
    return matchesType && matchesRead;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const typeIcons = {
    contract: FileText,
    renewal: Calendar,
    approval: CheckCircle,
    comment: MessageSquare,
    signature: FileText,
    team: Users,
    system: Bell
  };

  const typeColors = {
    contract: 'bg-blue-100 text-blue-700',
    renewal: 'bg-amber-100 text-amber-700',
    approval: 'bg-green-100 text-green-700',
    comment: 'bg-purple-100 text-purple-700',
    signature: 'bg-indigo-100 text-indigo-700',
    team: 'bg-pink-100 text-pink-700',
    system: 'bg-stone-100 text-stone-700'
  };

  const priorityBadges = {
    low: 'bg-stone-100 text-stone-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-amber-100 text-amber-700',
    urgent: 'bg-red-100 text-red-700'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-stone-900 mb-2">Notifications</h1>
            <p className="text-lg text-stone-600">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg font-semibold hover:bg-stone-50 transition-colors"
              >
                <Check className="w-4 h-4" />
                Mark All Read
              </button>
            )}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterType === 'all' ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('contract')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterType === 'contract' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                Contracts
              </button>
              <button
                onClick={() => setFilterType('renewal')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterType === 'renewal' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                }`}
              >
                Renewals
              </button>
              <button
                onClick={() => setFilterType('approval')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterType === 'approval' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Approvals
              </button>
              <button
                onClick={() => setFilterType('comment')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filterType === 'comment' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                Comments
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="w-4 h-4 text-stone-900 focus:ring-stone-900 rounded"
              />
              <span className="text-sm font-semibold text-stone-700">Unread only</span>
            </label>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-xl p-12 text-center">
              <Bell className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-stone-900 mb-2">No notifications</h3>
              <p className="text-stone-600">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = typeIcons[notification.type];
              return (
                <div
                  key={notification.id}
                  className={`bg-white border rounded-xl p-5 transition-all hover:shadow-md ${
                    notification.read ? 'border-stone-200' : 'border-stone-300 bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${typeColors[notification.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-stone-900">{notification.title}</h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                            <span className={`px-2 py-0.5 text-xs font-bold rounded ${priorityBadges[notification.priority]}`}>
                              {notification.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-stone-600">{notification.message}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-stone-600" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-stone-500">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            {notification.actionText} →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50" onClick={() => setShowSettings(false)}>
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-stone-900">Notification Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  aria-label="Close settings"
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-4">Email Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Contract Analysis Completed', checked: true },
                      { label: 'Renewal Alerts (30 days before)', checked: true },
                      { label: 'Signature Requests', checked: true },
                      { label: 'Team Comments & Mentions', checked: true },
                      { label: 'Approval Requests', checked: true },
                      { label: 'Weekly Summary Report', checked: false }
                    ].map((item, idx) => (
                      <label key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors">
                        <span className="text-stone-700">{item.label}</span>
                        <input
                          type="checkbox"
                          defaultChecked={item.checked}
                          className="w-5 h-5 text-stone-900 focus:ring-stone-900 rounded"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-stone-900 mb-4">Push Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Urgent Renewal Alerts', checked: true },
                      { label: 'Team Mentions', checked: true },
                      { label: 'Signature Status Updates', checked: false }
                    ].map((item, idx) => (
                      <label key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors">
                        <span className="text-stone-700">{item.label}</span>
                        <input
                          type="checkbox"
                          defaultChecked={item.checked}
                          className="w-5 h-5 text-stone-900 focus:ring-stone-900 rounded"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200">
                  <button className="w-full px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-colors">
                    Save Settings
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
