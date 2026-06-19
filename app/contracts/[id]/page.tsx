import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import AnalysisResult from '@/components/AnalysisResult';
import { ContractAnalysis } from '@/lib/types';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

const prisma = new PrismaClient();

export default async function ContractDetailPage({ params }: { params: { id: string } }) {
  const contract = await prisma.analyzedContract.findUnique({
    where: { id: params.id },
  });

  if (!contract) {
    return notFound();
  }

  // Handle draft vs analysis
  let parsedSummary = contract.summary;
  let isDraft = false;
  let fullAnalysis: ContractAnalysis | null = null;

  try {
    const parsed = JSON.parse(contract.summary);
    // If it's a drafted contract
    if (parsed.sections) {
      isDraft = true;
      parsedSummary = `Draft Content:\n\n` + parsed.sections.map((s: any) => `## ${s.title}\n${s.content}`).join('\n\n');
    } else {
      // It might be a full analysis JSON
      if (parsed.clauses) {
         fullAnalysis = parsed;
      }
      if (parsed.summary) {
         parsedSummary = parsed.summary;
      }
    }
  } catch (e) {
    // Standard string summary for legacy records
  }

  const analysis: ContractAnalysis = fullAnalysis || {
    summary: parsedSummary,
    riskScore: contract.riskScore,
    clauses: [], // Not fully persisted in MVP legacy records
    redFlags: Array(contract.redFlagsCount).fill({ id: 'dummy', title: 'Historical red flag', description: 'Detailed data not available for this legacy record.', severity: 'medium', affectedClauses: [], type: 'other', recommendation: 'N/A' }), 
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

      {isDraft ? (
        <div className="max-w-4xl mx-auto mt-8 bg-white p-8 border border-stone-200 rounded-xl prose">
           <h1 className="text-3xl font-bold mb-6">{contract.fileName}</h1>
           <div dangerouslySetInnerHTML={{ __html: parsedSummary.replace(/\n/g, '<br/>') }} />
        </div>
      ) : (
        <AnalysisResult analysis={analysis} />
      )}
    </div>
  );
}
