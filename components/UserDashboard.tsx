'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
    const [summary, setSummary] = useState<ContractSummary>(sampleSummary);
    const [activities, setActivities] = useState<ActivityItem[]>(sampleActivities);
    const [healthScore, setHealthScore] = useState<number>(76);
    const [riskDistribution, setRiskDistribution] = useState<any[]>([]);
    const [contractTypes, setContractTypes] = useState<any[]>([]);
    const [highestRiskContracts, setHighestRiskContracts] = useState<any[]>([]);
    const [riskTrends, setRiskTrends] = useState<any[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
        fetch('/api/dashboard')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSummary(data.summary);
                    setHealthScore(data.healthScore);
                    setRiskDistribution(data.riskDistribution || []);
                    setContractTypes(data.contractTypes || []);
                    setHighestRiskContracts(data.highestRiskContracts || []);
                    setRiskTrends(data.riskTrends || []);
                    setActivities(data.activities.map((a: any) => ({
                        ...a,
                        timestamp: new Date(a.timestamp)
                    })));
                }
            })
            .catch(err => console.error("Failed to load dashboard data:", err));
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
                                    <AlertTriangle className="w-4 h-4 text-stone-500" />
                                    <span className="text-xs text-stone-500 font-medium">Total Flags</span>
                                </div>
                                <p className="text-2xl font-bold text-stone-900">{(summary as any).totalRedFlags || 0}</p>
                                <p className="text-xs text-stone-500">detected across all</p>
                            </div>

                            <div className="bg-white border-2 border-stone-200 p-4 hover:border-stone-900 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-stone-500" />
                                    <span className="text-xs text-stone-500 font-medium">Recent</span>
                                </div>
                                <p className="text-2xl font-bold text-stone-900">{summary.recentlyAnalyzed}</p>
                                <p className="text-xs text-stone-500">analyzed in 7 days</p>
                            </div>

                            <div className="bg-white border-2 border-stone-200 p-4 hover:border-stone-900 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    <span className="text-xs text-stone-500 font-medium">High Risk</span>
                                </div>
                                <p className="text-2xl font-bold text-stone-900">{summary.highRisk}</p>
                                <p className="text-xs text-stone-500">score {'>'}= 70</p>
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
                                    View Repository <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                            <div className="divide-y divide-stone-100">
                                {activities.length === 0 ? (
                                    <div className="p-8 text-center text-stone-500 text-sm">No recent activity</div>
                                ) : activities.map((activity) => {
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

                        {/* Risk Trends Line Chart */}
                        <div className="bg-white border-2 border-stone-200 overflow-hidden">
                            <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-stone-700" />
                                    <h2 className="text-lg font-bold text-stone-900">Historical Risk Trends</h2>
                                </div>
                            </div>
                            <div className="p-5 h-64">
                                {riskTrends.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={riskTrends}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#78716c', fontSize: 12}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#78716c', fontSize: 12}} domain={[0, 100]} />
                                            <Tooltip 
                                                contentStyle={{backgroundColor: '#1c1917', border: 'none', borderRadius: '8px', color: '#fff'}}
                                                itemStyle={{color: '#fff'}}
                                            />
                                            <Line type="monotone" dataKey="score" stroke="#1c1917" strokeWidth={3} dot={{r: 4, fill: '#1c1917'}} activeDot={{r: 6}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-stone-500 text-sm">No trend data available</div>
                                )}
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
                                    <div className="flex gap-1 h-2 overflow-hidden mb-2">
                                        {riskDistribution.map((rd, i) => (
                                            <div 
                                                key={i} 
                                                style={{ width: `${summary.total > 0 ? (rd.value / summary.total) * 100 : 0}%`, backgroundColor: rd.color }} 
                                                title={rd.name} 
                                            />
                                        ))}
                                        {summary.total === 0 && <div className="bg-stone-200 w-full" />}
                                    </div>
                                    <div className="flex justify-between mt-2 text-[10px] text-stone-500">
                                        {riskDistribution.map((rd, i) => (
                                            <span key={i}>{rd.name.split(' ')[0]} ({rd.value})</span>
                                        ))}
                                        {summary.total === 0 && <span>No data</span>}
                                    </div>
                                </div>
                                <div className="mt-6 w-full pt-4 border-t border-stone-100">
                                    <div className="text-xs text-stone-500 mb-2">Top Contract Types</div>
                                    <div className="space-y-2">
                                        {contractTypes.length === 0 ? <div className="text-xs text-stone-400">No data available</div> : null}
                                        {contractTypes.map((ct, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-stone-700 truncate">{ct.name}</span>
                                                <span className="font-bold text-stone-900">{ct.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
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
                                {sampleDeadlines.map((deadline) => (
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
