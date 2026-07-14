'use client';

import { useState } from 'react';
import { User, Mail, Shield, Bell, Palette, Key, Save, CheckCircle2 } from 'lucide-react';
import { useAuth, getUserInitials } from '@/lib/auth-utils';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [saved, setSaved] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-600">Please sign in to view your profile</p>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'preferences' as const, label: 'Preferences', icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Settings</h1>
          <p className="text-stone-600">Manage your account settings and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-stone-200 rounded-xl p-4 sticky top-24">
              {/* User Info */}
              <div className="flex flex-col items-center pb-4 border-b border-stone-200 mb-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-20 h-20 rounded-full object-cover mb-3"
                  />
                ) : (
                  <div className="w-20 h-20 bg-stone-900 rounded-full flex items-center justify-center mb-3">
                    <span className="text-white text-2xl font-bold">
                      {getUserInitials(user.name)}
                    </span>
                  </div>
                )}
                <h3 className="font-semibold text-stone-900 text-center">{user.name}</h3>
                <p className="text-sm text-stone-500 text-center truncate max-w-full">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-stone-900 text-white'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white border-2 border-stone-200 rounded-xl p-8">
              {/* Success Message */}
              {saved && (
                <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-green-900">Settings saved successfully!</p>
                </div>
              )}

              {activeTab === 'profile' && <ProfileTab user={user} onSave={handleSave} />}
              {activeTab === 'security' && <SecurityTab onSave={handleSave} />}
              {activeTab === 'notifications' && <NotificationsTab onSave={handleSave} />}
              {activeTab === 'preferences' && <PreferencesTab onSave={handleSave} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({ user, onSave }: { user: any; onSave: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-900 mb-6">Profile Information</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Full Name
          </label>
          <input
            type="text"
            defaultValue={user.name}
            className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue={user.email}
            className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 bg-stone-50"
            disabled
          />
          <p className="text-xs text-stone-500 mt-1">Email address cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Company / Organization
          </label>
          <input
            type="text"
            placeholder="Optional"
            className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Role
          </label>
          <select className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-stone-900">
            <option>Freelancer</option>
            <option>Small Business Owner</option>
            <option>Employee</option>
            <option>Tenant</option>
            <option>Legal Professional</option>
            <option>Other</option>
          </select>
        </div>

        <button
          onClick={onSave}
          className="px-6 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}

function SecurityTab({ onSave }: { onSave: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-900 mb-6">Security Settings</h2>
      
      <div className="space-y-6">
        <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Two-Factor Authentication</p>
              <p className="text-xs text-blue-700 mt-1">Add an extra layer of security to your account</p>
            </div>
          </div>
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            Enable 2FA
          </button>
        </div>

        <div>
          <h3 className="font-semibold text-stone-900 mb-4">Change Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-900 mb-2">
                Current Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-900 mb-2">
                New Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-900 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="password"
                  className="w-full pl-11 pr-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            <button
              onClick={onSave}
              className="px-6 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
            >
              Update Password
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200">
          <h3 className="font-semibold text-stone-900 mb-2">Active Sessions</h3>
          <p className="text-sm text-stone-600 mb-4">Manage devices where you're currently signed in</p>
          
          <div className="space-y-3">
            <div className="p-4 border-2 border-stone-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-stone-900">Current Session</p>
                  <p className="text-sm text-stone-600">Windows PC • Chrome</p>
                  <p className="text-xs text-stone-500 mt-1">Last active: Just now</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationsTab({ onSave }: { onSave: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-900 mb-6">Notification Preferences</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-stone-900 mb-4">Email Notifications</h3>
          <div className="space-y-3">
            <NotificationToggle
              label="Contract Analysis Complete"
              description="Get notified when your contract analysis is ready"
              defaultChecked
            />
            <NotificationToggle
              label="Contract Renewals"
              description="Reminders for upcoming contract renewals"
              defaultChecked
            />
            <NotificationToggle
              label="Team Activity"
              description="Updates when team members comment on contracts"
              defaultChecked
            />
            <NotificationToggle
              label="Product Updates"
              description="News about new features and improvements"
            />
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200">
          <h3 className="font-semibold text-stone-900 mb-4">Push Notifications</h3>
          <div className="space-y-3">
            <NotificationToggle
              label="Browser Notifications"
              description="Receive push notifications in your browser"
            />
            <NotificationToggle
              label="Mobile Notifications"
              description="Get notified on your mobile device"
            />
          </div>
        </div>

        <button
          onClick={onSave}
          className="px-6 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
}

function PreferencesTab({ onSave }: { onSave: () => void }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-900 mb-6">App Preferences</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Default Risk Profile
          </label>
          <select className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-stone-900">
            <option>Balanced (Recommended)</option>
            <option>Conservative (More Cautious)</option>
            <option>Aggressive (Flag Everything)</option>
            <option>Custom</option>
          </select>
          <p className="text-sm text-stone-600 mt-2">
            This affects how strictly contracts are analyzed
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Export Format Preference
          </label>
          <select className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-stone-900">
            <option>PDF</option>
            <option>Markdown</option>
            <option>JSON</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Language
          </label>
          <select className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-stone-900">
            <option>English (US)</option>
            <option>English (UK)</option>
            <option>Spanish</option>
            <option>French</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Timezone
          </label>
          <select className="w-full px-4 py-3 border-2 border-stone-200 rounded-lg focus:outline-none focus:border-stone-900">
            <option>Pacific Time (PT)</option>
            <option>Mountain Time (MT)</option>
            <option>Central Time (CT)</option>
            <option>Eastern Time (ET)</option>
          </select>
        </div>

        <button
          onClick={onSave}
          className="px-6 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
}

function NotificationToggle({ label, description, defaultChecked = false }: {
  label: string;
  description: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-start justify-between p-4 border-2 border-stone-200 rounded-lg hover:border-stone-300 transition-colors">
      <div className="flex-1">
        <p className="font-medium text-stone-900">{label}</p>
        <p className="text-sm text-stone-600 mt-1">{description}</p>
      </div>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ml-4 ${
          checked ? 'bg-stone-900' : 'bg-stone-300'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
