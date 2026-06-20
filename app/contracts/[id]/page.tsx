import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import AnalysisResult from '@/components/AnalysisResult';
import { ContractAnalysis } from '@/lib/types';
import Link from 'next/link';
import { ChevronLeft, FileText, Link2 } from 'lucide-react';
import { euclideanDistance } from '@/lib/ml/clustering';

const prisma = new PrismaClient();

function normalizeMetadata(risk: number, redFlags: number, clauses: number) {
  return [
    risk / 100,
    Math.min(redFlags / 20, 1),
    Math.min(clauses / 50, 1)
  ];
}

export default async function ContractDetailPage({ params }: { params: { id: string } }) {
  const allContracts = await prisma.analyzedContract.findMany({
    select: {
      id: true,
      fileName: true,
      contractType: true,
      riskScore: true,
      redFlagsCount: true,
      clausesCount: true,
      createdAt: true,
      summary: true
    }
  });

  const contract = allContracts.find(c => c.id === params.id);

  if (!contract) {
    return notFound();
  }

  // Calculate Related Contracts (Portfolio Neighbors)
  const targetVector = normalizeMetadata(contract.riskScore, contract.redFlagsCount, contract.clausesCount);
  const maxDist = Math.sqrt(3);
  
  const relatedContracts = allContracts
    .filter(c => c.id !== contract.id)
    .map(other => {
      const vector = normalizeMetadata(other.riskScore, other.redFlagsCount, other.clausesCount);
      const distance = euclideanDistance(targetVector, vector);
      const similarityScore = Math.max(0, Math.round((1 - (distance / maxDist)) * 100));

      const reasons: string[] = [];
      if (Math.abs(contract.riskScore - other.riskScore) <= 15) reasons.push('Similar risk profile');
      if (Math.abs(contract.redFlagsCount - other.redFlagsCount) <= 3) reasons.push('Similar red flag density');
      if (Math.abs(contract.clausesCount - other.clausesCount) <= 10) reasons.push('Similar structural complexity');
      if (contract.contractType && contract.contractType !== 'Unknown' && contract.contractType === other.contractType) {
        reasons.push(`Same identified contract type`);
      }
      if (reasons.length === 0) reasons.push('Broad portfolio metadata alignment');

      return { ...other, similarityScore, reasons };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 3); // Top 3 neighbors

  // Handle draft vs analysis
  let parsedSummary = contract.summary;
  let isDraft = false;
  let fullAnalysis: ContractAnalysis | null = null;

  try {
    const parsed = JSON.parse(contract.summary);
    if (parsed.sections) {
      isDraft = true;
      parsedSummary = `Draft Content:\n\n` + parsed.sections.map((s: any) => `## ${s.title}\n${s.content}`).join('\n\n');
    } else {
      if (parsed.clauses) fullAnalysis = parsed;
      if (parsed.summary) parsedSummary = parsed.summary;
    }
  } catch (e) {
    // Standard string summary for legacy records
  }

  const analysis: ContractAnalysis = fullAnalysis || {
    summary: parsedSummary,
    riskScore: contract.riskScore,
    clauses: [], 
    redFlags: Array(contract.redFlagsCount).fill({ id: 'dummy', title: 'Historical red flag', description: 'Detailed data not available.', severity: 'medium', affectedClauses: [], type: 'other', recommendation: 'N/A' }), 
    recommendations: [],
    metadata: {
      fileName: contract.fileName,
      fileSize: 0,
      documentType: contract.contractType || 'Document',
      parties: [],
      uploadedAt: new Date(contract.createdAt).toISOString()
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-12">
      <div className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/contracts" className="text-stone-500 hover:text-stone-900 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-bold text-stone-900">Historical View: {contract.fileName}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-stone-500">
              Analyzed on {new Date(contract.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {isDraft ? (
            <div className="bg-white p-8 border border-stone-200 rounded-xl prose">
               <h1 className="text-3xl font-bold mb-6">{contract.fileName}</h1>
               <div dangerouslySetInnerHTML={{ __html: parsedSummary.replace(/\n/g, '<br/>') }} />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <AnalysisResult analysis={analysis} />
            </div>
          )}
        </div>

        {/* Portfolio Neighbors Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm sticky top-24">
            <div className="p-4 bg-stone-900 text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-stone-300" />
              <h2 className="font-bold">Portfolio Neighbors</h2>
            </div>
            <div className="p-4 bg-stone-50 border-b border-stone-200 text-sm text-stone-600 leading-relaxed">
              Discovered through nearest-neighbor analysis on contract risk and complexity metrics.
            </div>
            <div className="divide-y divide-stone-100">
              {relatedContracts.length === 0 ? (
                <div className="p-6 text-center text-stone-500 text-sm">
                  Not enough historical contracts to discover neighbors.
                </div>
              ) : (
                relatedContracts.map(related => (
                  <Link key={related.id} href={`/contracts/${related.id}`} className="block p-4 hover:bg-stone-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-stone-400" />
                        <h3 className="font-bold text-sm text-stone-900 truncate max-w-[140px]" title={related.fileName}>
                          {related.fileName}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-stone-900 bg-stone-200 px-2 py-0.5 rounded">
                        {related.similarityScore}%
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <p className="text-[10px] uppercase font-bold text-stone-500 mb-1.5">Why Related?</p>
                      <ul className="space-y-1">
                        {related.reasons.map((reason, idx) => (
                          <li key={idx} className="text-xs text-stone-600 flex items-start gap-1.5">
                            <span className="text-stone-400 mt-0.5">•</span>
                            <span className="leading-snug">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
