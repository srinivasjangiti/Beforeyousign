'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    FileText,
    Upload,
    Search,
    Edit3,
    FileSignature,
    AlertTriangle,
    Clock,
    CheckCircle,
    TrendingUp,
    Calendar,
    ArrowRight,
    Shield,
    Zap,
    MessageSquare,
    BarChart3,
    FolderOpen,
    Bell,
    Star,
    Activity
} from 'lucide-react';

// Types
interface ContractSummary {
    total: number;
    pending: number;
    expiringSoon: number;
    highRisk: number;
    recentlyAnalyzed: number;
}

interface ActivityItem {
    id: string;
    type: 'upload' | 'analyze' | 'sign' | 'comment' | 'share';
    title: string;
    description: string;
    timestamp: Date;
    status?: 'completed' | 'pending' | 'warning';
}

interface UpcomingDeadline {
    id: string;
    contractName: string;
    type: 'renewal' | 'expiration' | 'obligation' | 'review';
    date: Date;
    priority: 'high' | 'medium' | 'low';
}

// Sample data for demonstration
const sampleSummary: ContractSummary = {
    total: 47,
    pending: 8,
    expiringSoon: 3,
    highRisk: 2,
    recentlyAnalyzed: 12
};

const sampleActivities: ActivityItem[] = [
    {
        id: '1',
        type: 'analyze',
        title: 'Employment Agreement Analyzed',
        description: 'TechCorp Employment Contract - High risk clauses detected',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'warning'
    },
    {
        id: '2',
        type: 'sign',
        title: 'NDA Signed',
        description: 'Mutual NDA with StartupXYZ - Completed',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'completed'
    },
    {
        id: '3',
        type: 'upload',
        title: 'New Contract Uploaded',
        description: 'Service Agreement with Design Agency',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        status: 'pending'
    },
    {
        id: '4',
        type: 'comment',
        title: 'Comment Added',
        description: 'Team member commented on Lease Agreement',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
        status: 'completed'
    }
];

const sampleDeadlines: UpcomingDeadline[] = [
    {
        id: '1',
        contractName: 'Office Lease Agreement',
        type: 'renewal',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        priority: 'high'
    },
    {
        id: '2',
        contractName: 'Software License',
        type: 'expiration',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
        priority: 'medium'
    },
    {
        id: '3',
        contractName: 'Vendor Agreement',
        type: 'obligation',
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 18),
        priority: 'low'
    }
];

// Quick action cards
const quickActions = [
    {
        title: 'Analyze Contract',
        description: 'AI-powered risk analysis',
        icon: Search,
        href: '/analyze',
        badge: 'AI'
    },
    {
        title: 'Draft Contract',
        description: 'Create with AI assistance',
        icon: Edit3,
        href: '/drafting',
        badge: 'NEW'
    },
    {
        title: 'Sign Document',
        description: 'E-signature workflow',
        icon: FileSignature,
        href: '/esignature',
    },
    {
        title: 'Upload Contract',
        description: 'Add to your repository',
        icon: Upload,
        href: '/contracts',
    }
];

// Circular Progress Component
function CircularProgress({ value, size = 120, strokeWidth = 8 }: { value: number; size?: number; strokeWidth?: number }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    const getColor = () => '#1c1917';

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    className="text-stone-200"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className="transition-all duration-1000 ease-out"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="butt"
                    stroke={getColor()}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-stone-900">{value}</span>
                <span className="text-xs text-stone-500 font-medium">Health Score</span>
            </div>
        </div>
    );
}

// Time formatter
function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

function formatDate(date: Date): string {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays <= 7) return `In ${diffDays} days`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Activity icon helper
function getActivityIcon(type: ActivityItem['type']) {
    switch (type) {
        case 'upload': return Upload;
        case 'analyze': return Search;
        case 'sign': return FileSignature;
        case 'comment': return MessageSquare;
        case 'share': return Activity;
        default: return FileText;
    }
}

export default function UserDashboard() {
    const [summary] = useState<ContractSummary>(sampleSummary);
    const [activities] = useState<ActivityItem[]>(sampleActivities);
    const [deadlines] = useState<UpcomingDeadline[]>(sampleDeadlines);
    const [healthScore] = useState(76);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className={`min-h-screen bg-stone-50 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="mono text-xs text-stone-500 tracking-wider uppercase">Personal Dashboard</span>
                        <span className="px-2 py-0.5 bg-stone-900 text-white text-[10px] font-bold">LIVE</span>
                    </div>
                    <h1 className="text-4xl font-bold text-stone-900 mb-2">Welcome back</h1>
                    <p className="text-stone-600">Here's an overview of your contract portfolio and recent activity.</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="group relative bg-white border-2 border-stone-200 p-5 hover:border-stone-900 transition-all duration-300 overflow-hidden"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`w-10 h-10 bg-stone-900 flex items-center justify-center`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        {action.badge && (
                                            <span className="px-2 py-0.5 bg-stone-900 text-white text-[10px] font-bold">
                                                {action.badge}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-sm font-bold text-stone-900 mb-1 group-hover:text-stone-900">{action.title}</h3>
                                    <p className="text-xs text-stone-500">{action.description}</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Stats & Health */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white border-2 border-stone-200 p-4 hover:border-stone-900 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <FolderOpen className="w-4 h-4 text-stone-500" />
                                    <span className="text-xs text-stone-500 font-medium">Total</span>
                                </div>
                                <p className="text-2xl font-bold text-stone-900">{summary.total}</p>
                                <p className="text-xs text-stone-500">contracts</p>
                            </div>

                            <div className="bg-white border-2 border-stone-200 p-4 hover:border-stone-900 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-stone-500" />
                                    <span className="text-xs text-stone-500 font-medium">Pending</span>
                                </div>
                                <p className="text-2xl font-bold text-stone-900">{summary.pending}</p>
                                <p className="text-xs text-stone-500">need review</p>
                            </div>

                            <div className="bg-white border-2 border-stone-200 p-4 hover:border-stone-900 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-stone-500" />
                                    <span className="text-xs text-stone-500 font-medium">Expiring</span>
                                </div>
                                <p className="text-2xl font-bold text-stone-900">{summary.expiringSoon}</p>
                                <p className="text-xs text-stone-500">in 30 days</p>
                            </div>

                            <div className="bg-white border-2 border-stone-200 p-4 hover:border-stone-900 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4 text-stone-500" />
                                    <span className="text-xs text-stone-500 font-medium">High Risk</span>
                                </div>
                                <p className="text-2xl font-bold text-stone-900">{summary.highRisk}</p>
                                <p className="text-xs text-stone-500">contracts</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white border-2 border-stone-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-stone-700" />
                                    <h2 className="text-lg font-bold text-stone-900">Recent Activity</h2>
                                </div>
                                <Link href="/contracts" className="text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1">
                                    View All <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="divide-y divide-stone-100">
                                {activities.map((activity) => {
                                    const Icon = getActivityIcon(activity.type);
                                    return (
                                        <div key={activity.id} className="px-5 py-4 hover:bg-stone-50 transition-colors">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 bg-stone-100`}>
                                                    <Icon className="w-4 h-4 text-stone-600" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="text-sm font-semibold text-stone-900 truncate">{activity.title}</p>
                                                        <span className="text-xs text-stone-400 ml-2 flex-shrink-0">{formatTimeAgo(activity.timestamp)}</span>
                                                    </div>
                                                    <p className="text-xs text-stone-500 truncate">{activity.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Health Score & Deadlines */}
                    <div className="space-y-6">
                        {/* Health Score Card */}
                        <div className="bg-white border-2 border-stone-200 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <Shield className="w-5 h-5 text-stone-700" />
                                <h2 className="text-lg font-bold text-stone-900">Portfolio Health</h2>
                            </div>
                            <div className="flex flex-col items-center">
                                <CircularProgress value={healthScore} />
                                <div className="mt-4 w-full">
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <span className="text-stone-500">Risk Distribution</span>
                                    </div>
                                    <div className="flex gap-1 h-2 overflow-hidden">
                                        <div className="bg-stone-400 w-[60%]" title="Low Risk" />
                                        <div className="bg-stone-600 w-[25%]" title="Medium Risk" />
                                        <div className="bg-stone-900 w-[15%]" title="High Risk" />
                                    </div>
                                    <div className="flex justify-between mt-2 text-[10px] text-stone-400">
                                        <span>Low (60%)</span>
                                        <span>Med (25%)</span>
                                        <span>High (15%)</span>
                                    </div>
                                </div>
                            </div>
                            <Link
                                href="/analytics"
                                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-sm font-medium text-stone-700 transition-colors"
                            >
                                <BarChart3 className="w-4 h-4" />
                                View Analytics
                            </Link>
                        </div>

                        {/* Upcoming Deadlines */}
                        <div className="bg-white border-2 border-stone-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-stone-700" />
                                    <h2 className="text-lg font-bold text-stone-900">Upcoming</h2>
                                </div>
                                <Link href="/renewals" className="text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1">
                                    Calendar <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="divide-y divide-stone-100">
                                {deadlines.map((deadline) => (
                                    <div key={deadline.id} className="px-5 py-4 hover:bg-stone-50 transition-colors">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-semibold text-stone-900 truncate">{deadline.contractName}</p>
                                            <span className="px-2 py-0.5 border border-stone-900 text-[10px] font-bold text-stone-900">
                                                {deadline.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-stone-400" />
                                            <span className="text-xs text-stone-500">{formatDate(deadline.date)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pro Tip Card */}
                        <div className="bg-stone-900 p-5 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <Star className="w-4 h-4 text-amber-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Pro Tip</span>
                            </div>
                            <p className="text-sm leading-relaxed mb-4">
                                Use AI Contract Chat to ask questions about any of your contracts in natural language.
                            </p>
                            <Link
                                href="/chat"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-stone-900 text-sm font-medium hover:bg-stone-100 transition-colors"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Try Chat
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
