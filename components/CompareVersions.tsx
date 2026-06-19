'use client';

import { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, ArrowRight, Download, X, RefreshCw } from 'lucide-react';

interface ComparisonResult {
  added: string[];
  removed: string[];
  modified: string[];
  unchanged: number;
  totalChanges: number;
}

export default function CompareVersions() {
  const [version1, setVersion1] = useState<File | null>(null);
  const [version2, setVersion2] = useState<File | null>(null);
  const [version1Text, setVersion1Text] = useState<string>('');
  const [version2Text, setVersion2Text] = useState<string>('');
  const [comparing, setComparing] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  const handleFileUpload = async (file: File, version: 1 | 2) => {
    const text = await file.text();
    
    if (version === 1) {
      setVersion1(file);
      setVersion1Text(text);
    } else {
      setVersion2(file);
      setVersion2Text(text);
    }
  };

  const compareVersions = () => {
    setComparing(true);
    
    // Simple line-by-line comparison
    const lines1 = version1Text.split('\n').filter(line => line.trim());
    const lines2 = version2Text.split('\n').filter(line => line.trim());
    
    const added: string[] = [];
    const removed: string[] = [];
    const modified: string[] = [];
    let unchanged = 0;

    // Find removed lines (in v1 but not in v2)
    lines1.forEach(line => {
      if (!lines2.includes(line)) {
        if (lines2.some(l2 => l2.toLowerCase().includes(line.toLowerCase().substring(0, 20)))) {
          modified.push(line);
        } else {
          removed.push(line);
        }
      } else {
        unchanged++;
      }
    });

    // Find added lines (in v2 but not in v1)
    lines2.forEach(line => {
      if (!lines1.includes(line) && !modified.some(m => line.toLowerCase().includes(m.toLowerCase().substring(0, 20)))) {
        added.push(line);
      }
    });

    setResult({
      added: added.slice(0, 10),
      removed: removed.slice(0, 10),
      modified: modified.slice(0, 10),
      unchanged,
      totalChanges: added.length + removed.length + modified.length
    });

    setComparing(false);
  };

  const resetComparison = () => {
    setVersion1(null);
    setVersion2(null);
    setVersion1Text('');
    setVersion2Text('');
    setResult(null);
  };

  const exportReport = () => {
    if (!result) return;

    const report = `
CONTRACT VERSION COMPARISON REPORT
Generated: ${new Date().toLocaleDateString()}

SUMMARY
Total Changes: ${result.totalChanges}
Added Lines: ${result.added.length}
Removed Lines: ${result.removed.length}
Modified Lines: ${result.modified.length}
Unchanged Lines: ${result.unchanged}

ADDED CONTENT
${result.added.map((line, i) => `${i + 1}. ${line}`).join('\n')}

REMOVED CONTENT
${result.removed.map((line, i) => `${i + 1}. ${line}`).join('\n')}

MODIFIED CONTENT
${result.modified.map((line, i) => `${i + 1}. ${line}`).join('\n')}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contract-comparison-report.txt';
    a.click();
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-stone-900 rounded-lg">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-stone-900">Compare Contract Versions</h1>
          </div>
          <p className="text-lg text-stone-600">
            Upload two versions of a contract to see what changed, what was added, and what was removed.
          </p>
        </div>

        {/* Upload Section */}
        {!result && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Version 1 */}
            <div className="bg-white rounded-xl border-2 border-stone-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-stone-900">Original Version</h2>
                {version1 && (
                  <button
                    onClick={() => {
                      setVersion1(null);
                      setVersion1Text('');
                    }}
                    className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                    aria-label="Remove original version"
                  >
                    <X className="w-4 h-4 text-stone-500" />
                  </button>
                )}
              </div>

              {!version1 ? (
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 1)}
                  />
                  <div className="border-2 border-dashed border-stone-300 rounded-xl p-12 hover:border-stone-400 hover:bg-stone-50 transition-all text-center">
                    <Upload className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                    <p className="text-stone-600 font-medium mb-2">Click to upload original contract</p>
                    <p className="text-sm text-stone-500">TXT, PDF, DOC, DOCX</p>
                  </div>
                </label>
              ) : (
                <div className="border-2 border-green-200 bg-green-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-green-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-stone-900">{version1.name}</p>
                      <p className="text-sm text-stone-500">{(version1.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="bg-white rounded-lg p-4 max-h-48 overflow-y-auto">
                    <p className="text-xs text-stone-600 font-mono whitespace-pre-wrap">
                      {version1Text.substring(0, 500)}...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Version 2 */}
            <div className="bg-white rounded-xl border-2 border-stone-200 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-stone-900">Updated Version</h2>
                {version2 && (
                  <button
                    onClick={() => {
                      setVersion2(null);
                      setVersion2Text('');
                    }}
                    className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                    aria-label="Remove updated version"
                  >
                    <X className="w-4 h-4 text-stone-500" />
                  </button>
                )}
              </div>

              {!version2 ? (
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 2)}
                  />
                  <div className="border-2 border-dashed border-stone-300 rounded-xl p-12 hover:border-stone-400 hover:bg-stone-50 transition-all text-center">
                    <Upload className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                    <p className="text-stone-600 font-medium mb-2">Click to upload updated contract</p>
                    <p className="text-sm text-stone-500">TXT, PDF, DOC, DOCX</p>
                  </div>
                </label>
              ) : (
                <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-stone-900">{version2.name}</p>
                      <p className="text-sm text-stone-500">{(version2.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="bg-white rounded-lg p-4 max-h-48 overflow-y-auto">
                    <p className="text-xs text-stone-600 font-mono whitespace-pre-wrap">
                      {version2Text.substring(0, 500)}...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compare Button */}
        {version1 && version2 && !result && (
          <div className="text-center mb-12">
            <button
              onClick={compareVersions}
              disabled={comparing}
              className="inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-white font-semibold text-lg rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              {comparing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Comparing Versions...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Compare Versions
                </>
              )}
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border-2 border-stone-200 p-6">
                <p className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-2">Total Changes</p>
                <p className="text-4xl font-bold text-stone-900">{result.totalChanges}</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                <p className="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">Added</p>
                <p className="text-4xl font-bold text-green-900">{result.added.length}</p>
              </div>
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <p className="text-sm font-semibold text-red-700 uppercase tracking-wide mb-2">Removed</p>
                <p className="text-4xl font-bold text-red-900">{result.removed.length}</p>
              </div>
              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                <p className="text-sm font-semibold text-yellow-700 uppercase tracking-wide mb-2">Modified</p>
                <p className="text-4xl font-bold text-yellow-900">{result.modified.length}</p>
              </div>
            </div>

            {/* Detailed Changes */}
            <div className="bg-white rounded-xl border-2 border-stone-200 p-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-6">Detailed Changes</h2>

              {/* Added Content */}
              {result.added.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-green-500 rounded"></div>
                    <h3 className="text-lg font-bold text-green-900">Added Content</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">
                      {result.added.length} lines
                    </span>
                  </div>
                  <div className="space-y-2">
                    {result.added.map((line, index) => (
                      <div key={index} className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                        <p className="text-sm text-stone-700">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Removed Content */}
              {result.removed.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-red-500 rounded"></div>
                    <h3 className="text-lg font-bold text-red-900">Removed Content</h3>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded">
                      {result.removed.length} lines
                    </span>
                  </div>
                  <div className="space-y-2">
                    {result.removed.map((line, index) => (
                      <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-sm text-stone-700 line-through">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modified Content */}
              {result.modified.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-yellow-500 rounded"></div>
                    <h3 className="text-lg font-bold text-yellow-900">Modified Content</h3>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
                      {result.modified.length} lines
                    </span>
                  </div>
                  <div className="space-y-2">
                    {result.modified.map((line, index) => (
                      <div key={index} className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                        <p className="text-sm text-stone-700">{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={exportReport}
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-semibold rounded-lg hover:bg-stone-800 transition-colors"
              >
                <Download className="w-5 h-5" />
                Export Report
              </button>
              <button
                onClick={resetComparison}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                New Comparison
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        {!result && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 mt-12">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-blue-900 mb-2">How Version Comparison Works</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Upload the original contract and the updated version</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Our system performs a line-by-line comparison to detect changes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Added, removed, and modified content is highlighted for easy review</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>Export a detailed comparison report for your records</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
