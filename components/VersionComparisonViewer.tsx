'use client';

import { useState } from 'react';
import { ContractVersion, VersionComparison, ContractVersionManager } from '@/lib/contract-versioning';
import { GitBranch, GitCommit, GitMerge, History, Download, Eye, ChevronRight, ChevronDown, AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface VersionComparisonViewerProps {
  versions: ContractVersion[];
  contractId: string;
}

export default function VersionComparisonViewer({ versions, contractId }: VersionComparisonViewerProps) {
  const [selectedVersion1, setSelectedVersion1] = useState<ContractVersion | null>(null);
  const [selectedVersion2, setSelectedVersion2] = useState<ContractVersion | null>(null);
  const [comparison, setComparison] = useState<VersionComparison | null>(null);
  const [viewMode, setViewMode] = useState<'side-by-side' | 'unified'>('side-by-side');
  const [showOnlyChanges, setShowOnlyChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const versionManager = new ContractVersionManager();

  const handleCompare = () => {
    if (selectedVersion1 && selectedVersion2) {
      const comp = versionManager.compareVersions(selectedVersion1, selectedVersion2);
      setComparison(comp);
    }
  };

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const getDiffColor = (type: string) => {
    switch (type) {
      case 'added': return 'bg-green-100 border-l-4 border-green-500';
      case 'removed': return 'bg-red-100 border-l-4 border-red-500';
      case 'modified': return 'bg-yellow-100 border-l-4 border-yellow-500';
      default: return '';
    }
  };

  const getDiffIcon = (type: string) => {
    switch (type) {
      case 'added': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'removed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'modified': return <TrendingUp className="h-4 w-4 text-yellow-600" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Version Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <GitBranch className="h-6 w-6 text-blue-600" />
          Compare Contract Versions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {/* Version 1 Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Version
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSelectedVersion1(versions.find(v => v.id === e.target.value) || null)}
            >
              <option value="">Select version...</option>
              {versions.map(version => (
                <option key={version.id} value={version.id}>
                  v{version.versionNumber} - {new Date(version.createdAt).toLocaleDateString()} 
                  {version.isMajor && ' (Major)'}
                </option>
              ))}
            </select>
            {selectedVersion1 && (
              <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                <p className="text-gray-600">{selectedVersion1.comment}</p>
                <p className="text-gray-500 text-xs mt-1">
                  By {selectedVersion1.createdBy} • {selectedVersion1.metadata.wordCount} words
                </p>
              </div>
            )}
          </div>

          {/* Version 2 Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Updated Version
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSelectedVersion2(versions.find(v => v.id === e.target.value) || null)}
            >
              <option value="">Select version...</option>
              {versions.map(version => (
                <option key={version.id} value={version.id}>
                  v{version.versionNumber} - {new Date(version.createdAt).toLocaleDateString()}
                  {version.isMajor && ' (Major)'}
                </option>
              ))}
            </select>
            {selectedVersion2 && (
              <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                <p className="text-gray-600">{selectedVersion2.comment}</p>
                <p className="text-gray-500 text-xs mt-1">
                  By {selectedVersion2.createdBy} • {selectedVersion2.metadata.wordCount} words
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={!selectedVersion1 || !selectedVersion2}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <GitMerge className="h-5 w-5" />
          Compare Versions
        </button>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <>
          {/* Summary Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Comparison Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-700 mb-1">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">Added</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{comparison.addedLines}</p>
                <p className="text-sm text-green-600">lines</p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 mb-1">
                  <TrendingDown className="h-5 w-5" />
                  <span className="font-semibold">Removed</span>
                </div>
                <p className="text-2xl font-bold text-red-900">{comparison.deletedLines}</p>
                <p className="text-sm text-red-600">lines</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 mb-1">
                  <History className="h-5 w-5" />
                  <span className="font-semibold">Net Change</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{comparison.netChange.toFixed(1)}%</p>
                <p className="text-sm text-blue-600">modified</p>
              </div>

              <div className={`p-4 rounded-lg ${
                comparison.riskImpact === 'increased' ? 'bg-red-50' :
                comparison.riskImpact === 'decreased' ? 'bg-green-50' :
                'bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className={`h-5 w-5 ${
                    comparison.riskImpact === 'increased' ? 'text-red-700' :
                    comparison.riskImpact === 'decreased' ? 'text-green-700' :
                    'text-gray-700'
                  }`} />
                  <span className="font-semibold">Risk Impact</span>
                </div>
                <p className="text-2xl font-bold capitalize">
                  {comparison.riskImpact}
                </p>
              </div>
            </div>

            {/* Major Changes */}
            {comparison.majorChanges.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-red-700 mb-2">⚠️ Major Changes:</h4>
                <ul className="space-y-1">
                  {comparison.majorChanges.map((change, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Minor Changes */}
            {comparison.minorChanges.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700 mb-2">Minor Changes:</h4>
                <ul className="space-y-1">
                  {comparison.minorChanges.slice(0, 5).map((change, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      {change}
                    </li>
                  ))}
                  {comparison.minorChanges.length > 5 && (
                    <li className="text-sm text-gray-500 italic">
                      ...and {comparison.minorChanges.length - 5} more minor changes
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* View Controls */}
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode('side-by-side')}
                className={`px-4 py-2 rounded ${
                  viewMode === 'side-by-side'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Side by Side
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`px-4 py-2 rounded ${
                  viewMode === 'unified'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Unified
              </button>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyChanges}
                onChange={(e) => setShowOnlyChanges(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Show only changes</span>
            </label>
          </div>

          {/* Diff Visualization */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h3 className="font-semibold flex items-center gap-2">
                <Eye className="h-5 w-5 text-gray-600" />
                Detailed Comparison
              </h3>
            </div>

            <div className="p-6">
              {viewMode === 'unified' ? (
                <div className="space-y-2 font-mono text-sm">
                  {comparison.visualDiff.map((segment, idx) => {
                    if (showOnlyChanges && segment.type === 'unchanged') return null;
                    
                    return (
                      <div key={idx} className={`p-2 rounded ${getDiffColor(segment.type)}`}>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400 w-12">{segment.lineNumber}</span>
                          {getDiffIcon(segment.type)}
                          <pre className="flex-1 whitespace-pre-wrap">{segment.text}</pre>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {/* Side by side view would go here */}
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-gray-600">Original</h4>
                    <div className="border border-gray-200 rounded p-4 bg-gray-50 font-mono text-sm">
                      <pre className="whitespace-pre-wrap">{selectedVersion1?.content.substring(0, 500)}...</pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm text-gray-600">Updated</h4>
                    <div className="border border-gray-200 rounded p-4 bg-gray-50 font-mono text-sm">
                      <pre className="whitespace-pre-wrap">{selectedVersion2?.content.substring(0, 500)}...</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Version History Timeline */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <History className="h-6 w-6 text-blue-600" />
          Version History
        </h3>
        
        <div className="space-y-3">
          {versions.sort((a, b) => b.versionNumber - a.versionNumber).map((version, idx) => (
            <div key={version.id} className="flex items-start gap-4 border-l-2 border-gray-300 pl-4 pb-4">
              <div className="flex-shrink-0">
                <GitCommit className={`h-6 w-6 ${version.isMajor ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">
                    Version {version.versionNumber}
                    {version.isMajor && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                        MAJOR
                      </span>
                    )}
                  </h4>
                  <span className="text-sm text-gray-500">
                    {new Date(version.createdAt).toLocaleString()}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mt-1">{version.comment}</p>
                
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>{version.createdBy}</span>
                  <span>•</span>
                  <span>{version.metadata.wordCount} words</span>
                  {version.metadata.clauseCount && (
                    <>
                      <span>•</span>
                      <span>{version.metadata.clauseCount} clauses</span>
                    </>
                  )}
                </div>

                {version.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {version.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  /* Download version */
                }}
                className="p-2 hover:bg-gray-100 rounded"
                title="Download this version"
              >
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
