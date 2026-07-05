'use client';

import { FileText, Download, Copy, Calendar, Tag, BookOpen, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const paperData = {
  title: 'Faithfulness, Robustness, and Generalization in Chain-of-Thought Reasoning',
  subtitle: 'A Critical Evaluation of Large Language Models for High-Stakes Decision Support',
  author: 'Srinivas Jangiti',
  date: 'June 2026',
  abstract: `Chain-of-thought (CoT) prompting has emerged as the dominant paradigm for eliciting multi-step reasoning from large language models (LLMs), yet the practical reliability of the resulting rationales remains contested. This paper presents a critical, mixed-methods evaluation of frontier LLMs across three properties that jointly determine whether CoT outputs are suitable for high-stakes decision support: faithfulness (whether stated reasoning causally drives the answer), robustness (whether outputs are stable under semantically irrelevant perturbations), and generalization (whether reasoning competence transfers across domains, jurisdictions, and populations). We construct a curated benchmark of 2,148 high-stakes items spanning legal contract review, clinical triage, and financial credit analysis; we evaluate five frontier models; and we introduce a suite of faithfulness probes, perturbation protocols, and cross-domain transfer tests. Our results reveal a substantial faithfulness gap: across all evaluated models, stated reasoning trajectories are systematically unfaithful to the underlying decision process, with 31–58% of correct answers remaining correct when the model's own rationale is silently replaced with an irrelevant, incoherent, or adversarial one. We further document non-trivial robustness decay under five classes of surface and semantic perturbation, and we observe a pronounced domain-transfer penalty averaging 14.7 percentage points. We argue that the prevailing assumption — that CoT explanations are self-evidencing of model competence — is empirically untenable in high-stakes contexts, and we propose a concrete evaluation protocol that practitioners can deploy before integrating LLM-generated rationales into consequential workflows.`,
  keywords: [
    'Chain-of-Thought Reasoning',
    'Faithfulness',
    'Robustness',
    'High-Stakes Decision Support',
    'Large Language Models',
    'Mechanistic Interpretability',
  ],
  publication: {
    venue: 'Original Research · AI Evaluation & Safety',
    status: 'Pre-print, under review',
    pages: '29 (including appendices)',
  },
  bibtex: `@article{jangiti2026cot,
  title={Faithfulness, Robustness, and Generalization in Chain-of-Thought Reasoning: A Critical Evaluation of Large Language Models for High-Stakes Decision Support},
  author={Jangiti, Srinivas},
  year={2026},
  month={June},
  journal={Pre-print, under review},
  abstract={Chain-of-thought (CoT) prompting has emerged as the dominant paradigm for eliciting multi-step reasoning from large language models (LLMs), yet the practical reliability of the resulting rationales remains contested. This paper presents a critical, mixed-methods evaluation of frontier LLMs across three properties that jointly determine whether CoT outputs are suitable for high-stakes decision support: faithfulness (whether stated reasoning causally drives the answer), robustness (whether outputs are stable under semantically irrelevant perturbations), and generalization (whether reasoning competence transfers across domains, jurisdictions, and populations).},
  keywords={Chain-of-Thought, Faithfulness, Robustness, High-Stakes Decision Support, Large Language Models, Mechanistic Interpretability}
}`,
  references: [
    'Adebayo et al. (2018). Sanity checks for saliency maps. NeurIPS.',
    'Amann et al. (2020). Explainability for artificial intelligence in healthcare. BMC Medical Informatics.',
    'Hendrycks et al. (2021). CUAD: An expert-annotated NLP dataset for legal contract review. NeurIPS.',
    'Jacovi & Goldberg (2022). Towards faithfully interpretable NLP systems. arXiv.',
    'Kojima et al. (2022). Large language models are zero-shot reasoners. NeurIPS.',
    'Lanham et al. (2023). Measuring faithfulness in chain-of-thought reasoning. arXiv.',
    'Turpin et al. (2024). Language models don\'t always say what they think. NeurIPS.',
    'Wei et al. (2022). Chain-of-thought prompting elicits reasoning in large language models. NeurIPS.',
  ],
};

export default function ResearchPageClient() {
  const [copied, setCopied] = useState(false);

  const copyBibtex = async () => {
    await navigator.clipboard.writeText(paperData.bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative bg-white border-b-2 border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
          <div className="max-w-4xl">
            <div className="mb-4">
              <span className="mono text-xs text-stone-500 tracking-wider uppercase">{paperData.publication.venue}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 mb-4 sm:mb-6 leading-[1.1] tracking-tight">
              {paperData.title}
            </h1>
            
            <p className="text-lg sm:text-xl text-stone-600 italic mb-6 sm:mb-8 leading-relaxed font-light">
              {paperData.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-stone-500" />
                <span className="text-sm font-medium text-stone-700">{paperData.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-stone-500" />
                <span className="text-sm text-stone-600">{paperData.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-stone-100 text-stone-700 rounded-full font-medium">
                  {paperData.publication.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/research-paper.pdf"
                download="faithfulness-robustness-cot-reasoning.pdf"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all duration-300 group"
              >
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                <span>Download PDF</span>
              </a>
              <Link
                href="/research-paper.pdf"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-stone-900 text-stone-900 font-medium hover:bg-stone-50 transition-all duration-300"
              >
                <BookOpen className="w-4 h-4" />
                <span>Read Full Paper</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Abstract Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="mono text-xs text-stone-500 tracking-wider uppercase">Abstract</span>
            </div>
            
            <div className="bg-stone-50/50 border-l-4 border-stone-900 p-6 sm:p-8">
              <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-light">
                {paperData.abstract}
              </p>
            </div>

            <div className="mt-8">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-stone-500" />
                <span className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Keywords</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {paperData.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="text-xs px-3 py-1.5 bg-stone-100 text-stone-700 rounded-full font-medium hover:bg-stone-200 transition-colors"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Citation Section */}
      <section className="bg-stone-50 py-12 sm:py-16 md:py-20 border-t-2 border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="mono text-xs text-stone-500 tracking-wider uppercase">Citation</span>
            </div>
            
            <div className="bg-white border-2 border-stone-200">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">BibTeX Entry</h3>
                  <button
                    onClick={copyBibtex}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors border border-stone-300 rounded ${copied ? 'text-green-700 bg-green-50' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'}`}
                    aria-label="Copy BibTeX to clipboard"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-xs sm:text-sm bg-stone-50 p-4 overflow-x-auto">
                  <code className="font-mono text-stone-700">{paperData.bibtex}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* References Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20 border-t-2 border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="mono text-xs text-stone-500 tracking-wider uppercase">Selected References</span>
            </div>

            <div className="space-y-3">
              {paperData.references.map((ref, index) => (
                <div key={index} className="border-l-2 border-stone-300 pl-4 py-2">
                  <p className="text-sm text-stone-700 font-light">{ref}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-stone-50 border-t-2 border-stone-900">
              <p className="text-sm text-stone-600">
                <strong className="text-stone-900">Note:</strong> The full reference list with 47 citations is available in the PDF. 
                This research contributes to the BeforeYouSign platform's commitment to rigorous, evidence-based AI evaluation 
                for high-stakes contract analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-white py-12 sm:py-16 md:py-20 cta-section">
        <div className="cta-section-bg" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 text-center cta-section-content">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
            Apply Research Insights to Your Contracts
          </h3>
          <p className="text-base text-stone-300 leading-relaxed font-light mb-8">
            Our platform implements rigorous evaluation protocols for LLM-powered contract analysis, 
            ensuring transparency and reliability in high-stakes decisions.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-stone-900 font-medium hover:bg-stone-100 transition-all duration-300 group w-full sm:w-auto justify-center"
          >
            <span>Analyze Your Contract</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-xs text-stone-400">No account required • Instant results</p>
        </div>
      </section>

      {/* Embedded PDF Preview (Lazy-loaded) */}
      <section className="bg-stone-50 py-12 sm:py-16 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="mono text-xs text-stone-500 tracking-wider uppercase">Paper Preview</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">Embedded Document Viewer</h2>
            </div>

            <div className="bg-white border-2 border-stone-200 overflow-hidden">
              <embed
                src="/research-paper.pdf#toolbar=0&view=FitH"
                type="application/pdf"
                className="w-full h-[600px] sm:h-[700px]"
                title="Research Paper: Faithfulness, Robustness, and Generalization in Chain-of-Thought Reasoning"
                aria-label="PDF preview of research paper"
              />
              <div className="p-4 bg-stone-50 border-t border-stone-200 text-center">
                <a
                  href="/research-paper.pdf"
                  download="faithfulness-robustness-cot-reasoning.pdf"
                  className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download full paper for best viewing experience</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}