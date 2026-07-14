'use client';

import { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    Bookmark,
    BookmarkCheck,
    Briefcase,
    MessageSquare,
    Scale,
    TrendingUp,
    TrendingDown,
    Minus,
    Copy,
    Check,
    AlertTriangle,
    Shield,
    FileText
} from 'lucide-react';

interface IndustryComparison {
    averageStrictness: number;
    percentile: number;
    commonAlternatives?: string[];
    fairerVersion?: string;
}

interface ClauseCardProps {
    index: number;
    title: string;
    originalText: string;
    plainLanguage: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    concerns: string[];
    industryComparison?: IndustryComparison;
    isBookmarked: boolean;
    onBookmark: () => void;
    onNegotiate?: () => void;
    onAskAI?: () => void;
    note?: string;
    onNoteChange?: (note: string) => void;
}

export default function ClauseCard({
    index,
    title,
    originalText,
    plainLanguage,
    riskLevel,
    concerns,
    industryComparison,
    isBookmarked,
    onBookmark,
    onNegotiate,
    onAskAI,
    note,
    onNoteChange,
}: ClauseCardProps) {
    const [isExpanded, setIsExpanded] = useState(riskLevel === 'critical' || riskLevel === 'high');
    const [showOriginal, setShowOriginal] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showNoteInput, setShowNoteInput] = useState(false);

    const riskStyles = {
        critical: {
            border: 'border-l-red-600',
            badge: 'bg-red-600 text-white',
            glow: 'shadow-red-200',
            icon: <AlertTriangle className="w-4 h-4" />,
        },
        high: {
            border: 'border-l-orange-500',
            badge: 'bg-orange-500 text-white',
            glow: 'shadow-orange-200',
            icon: <AlertTriangle className="w-4 h-4" />,
        },
        medium: {
            border: 'border-l-yellow-500',
            badge: 'bg-yellow-500 text-white',
            glow: 'shadow-yellow-100',
            icon: <Shield className="w-4 h-4" />,
        },
        low: {
            border: 'border-l-green-500',
            badge: 'bg-green-500 text-white',
            glow: 'shadow-green-100',
            icon: <Check className="w-4 h-4" />,
        },
    };

    const style = riskStyles[riskLevel];

    const copyText = async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const getStrictnessIndicator = () => {
        if (!industryComparison) return null;
        const strictness = industryComparison.averageStrictness;
        if (strictness > 60) {
            return { icon: <TrendingUp className="w-4 h-4 text-stone-900" />, text: 'Stricter than average', color: 'text-stone-900' };
        } else if (strictness < 40) {
            return { icon: <TrendingDown className="w-4 h-4 text-stone-600" />, text: 'More favorable', color: 'text-stone-600' };
        }
        return { icon: <Minus className="w-4 h-4 text-stone-500" />, text: 'Industry standard', color: 'text-stone-500' };
    };

    const strictnessInfo = getStrictnessIndicator();

    return (
        <div
            className={`
        group bg-white border-l-4 ${style.border} border border-stone-200
        overflow-hidden transition-all duration-300
        ${isExpanded ? '' : 'hover:translate-x-1'}
      `}
        >
            {/* Header - Always visible */}
            <div
                className="p-5 cursor-pointer select-none"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Index number */}
                        <div className="flex-shrink-0 w-8 h-8 bg-stone-100 flex items-center justify-center">
                            <span className="text-sm font-mono text-stone-500">{String(index).padStart(2, '0')}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-bold text-stone-900 truncate">{title}</h4>
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${style.badge}`}>
                                    {style.icon}
                                    {riskLevel}
                                </span>
                            </div>

                            {/* Preview text when collapsed */}
                            {!isExpanded && (
                                <p className="text-sm text-stone-600 line-clamp-2">{plainLanguage}</p>
                            )}

                            {/* Industry comparison quick view */}
                            {strictnessInfo && !isExpanded && (
                                <div className={`flex items-center gap-2 mt-2 text-xs font-medium ${strictnessInfo.color}`}>
                                    {strictnessInfo.icon}
                                    <span>{strictnessInfo.text}</span>
                                    <span className="text-stone-400">•</span>
                                    <span className="text-stone-500">Top {industryComparison?.percentile}% strictness</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onBookmark();
                            }}
                            className={`p-2 transition-all duration-200 ${isBookmarked
                                    ? 'bg-stone-900 text-white hover:bg-stone-700'
                                    : 'bg-stone-100 text-stone-400 hover:bg-stone-200 hover:text-stone-600'
                                }`}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark clause'}
                        >
                            {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>

                        {(riskLevel === 'critical' || riskLevel === 'high') && onNegotiate && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNegotiate();
                                }}
                                className="p-2 bg-stone-900 text-white hover:bg-stone-700 transition-all duration-200"
                                title="Generate negotiation script"
                            >
                                <Briefcase className="w-4 h-4" />
                            </button>
                        )}

                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 text-stone-400 hover:text-stone-600"
                        >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            <div
                className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
            >
                <div className="px-5 pb-5 space-y-4 border-t border-stone-100">
                    {/* Toggle between original and plain language */}
                    <div className="pt-4">
                        <div className="flex items-center gap-2 mb-3">
                            <button
                                onClick={() => setShowOriginal(false)}
                                className={`px-3 py-1.5 text-sm font-medium transition-colors ${!showOriginal
                                        ? 'bg-stone-900 text-white'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                            >
                                Plain English
                            </button>
                            <button
                                onClick={() => setShowOriginal(true)}
                                className={`px-3 py-1.5 text-sm font-medium transition-colors ${showOriginal
                                        ? 'bg-stone-900 text-white'
                                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                    }`}
                            >
                                Original Text
                            </button>
                            <button
                                onClick={() => copyText(showOriginal ? originalText : plainLanguage)}
                                className="ml-auto p-2 text-stone-400 hover:text-stone-600 transition-colors"
                                title="Copy text"
                            >
                                {copied ? <Check className="w-4 h-4 text-stone-900" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <div className={`p-4 transition-colors duration-300 ${showOriginal
                                ? 'bg-stone-50 border-l-2 border-stone-300 font-serif italic text-stone-600'
                                : 'bg-white border-l-2 border-stone-900 text-stone-800'
                            }`}>
                            <p className="leading-relaxed">
                                {showOriginal ? `"${originalText}"` : plainLanguage}
                            </p>
                        </div>
                    </div>

                    {/* Industry Comparison */}
                    {industryComparison && (
                        <div className="bg-stone-50 border border-stone-200 p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Scale className="w-4 h-4 text-stone-900" />
                                <span className="text-sm font-bold text-stone-900 uppercase tracking-wider">Industry Benchmark</span>
                            </div>

                            {/* Strictness meter */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-stone-700">Strictness Level</span>
                                    <span className="text-sm font-bold text-stone-900">{industryComparison.averageStrictness}/100</span>
                                </div>
                                <div className="h-2 bg-stone-200 overflow-hidden">
                                    <div
                                        className="h-full transition-all duration-700 ease-out bg-stone-900"
                                        style={{ width: `${industryComparison.averageStrictness}%` }}
                                    />
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    {strictnessInfo?.icon}
                                    <span className={`text-xs font-medium ${strictnessInfo?.color}`}>
                                        {strictnessInfo?.text} • Stricter than {industryComparison.percentile}% of similar contracts
                                    </span>
                                </div>
                            </div>

                            {/* Fairer Version */}
                            {industryComparison.fairerVersion && (
                                <div className="bg-white p-3 border-l-2 border-stone-900">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-3 h-3 text-stone-900" />
                                        <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">Suggested Alternative</span>
                                    </div>
                                    <p className="text-sm text-stone-700 italic">"{industryComparison.fairerVersion}"</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Concerns */}
                    {concerns.length > 0 && (
                        <div>
                            <h5 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Strategic Considerations</h5>
                            <ul className="space-y-2">
                                {concerns.map((concern, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-stone-700">
                                        <span className="text-stone-400 mt-0.5">—</span>
                                        <p className="text-sm leading-relaxed">{concern}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                        {onAskAI && (
                            <button
                                onClick={onAskAI}
                                className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white hover:bg-stone-700 transition-colors text-sm font-medium"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Ask AI about this
                            </button>
                        )}

                        <button
                            onClick={() => setShowNoteInput(!showNoteInput)}
                            className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors text-sm font-medium"
                        >
                            <FileText className="w-4 h-4" />
                            {note ? 'Edit Note' : 'Add Note'}
                        </button>
                    </div>

                    {/* Note input */}
                    {showNoteInput && onNoteChange && (
                        <div className="mt-3">
                            <textarea
                                value={note || ''}
                                onChange={(e) => onNoteChange(e.target.value)}
                                placeholder="Add your notes about this clause..."
                                className="w-full px-4 py-3 text-sm border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
                                rows={3}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
