import type { Metadata } from 'next';
import { ArrowRight, AlertTriangle, Scale, FileText, Shield, Zap, Eye, MessageSquare, Users, Lock, TrendingUp, Clock, BookOpen, Globe } from 'lucide-react';
import Link from 'next/link';
import { JsonLd, homepageFaqSchema } from '@/components/JsonLd';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'BeforeYouSign — Free AI Contract Analysis & Risk Detection',
  description:
    'Upload any contract and get instant AI-powered risk analysis. Identify hidden clauses, unlimited liability traps, auto-renewal tricks, and dangerous obligations — free, in under 30 seconds.',
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'BeforeYouSign — Free AI Contract Analysis',
    description:
      'Upload any contract and get instant AI risk analysis, hidden clause detection, and negotiation tips — free in under 30 seconds. No account required.',
    url: BASE_URL,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeforeYouSign — Free AI Contract Analysis',
    description: 'Instant AI contract risk analysis. Free, no account required.',
    images: ['/opengraph-image'],
  },
};

export default function Home() {

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative bg-white border-b-2 border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
          <div className="max-w-5xl">
            <div className="mb-4">
              <span className="mono text-xs text-stone-500 tracking-wider uppercase">Legal Intelligence Platform</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-6 sm:mb-8 leading-[1.1] tracking-tight">
              From issues to answers, <span className="text-stone-600">your legal world made simple</span>
            </h1>

            <div className="border-l-4 border-stone-900 pl-4 sm:pl-6 mb-6 sm:mb-8">
              <p className="text-base text-stone-600 leading-relaxed font-light">
                Upload any contract and get instant analysis of risks, obligations, and hidden clauses.
                Know what you're signing before you sign it.
              </p>
            </div>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all duration-300 group"
            >
              <span>Start Analysis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-stone-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
            <div>
              <div className="mb-4">
                <span className="mono text-xs text-stone-500 tracking-wider uppercase">The Problem</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mb-4 sm:mb-6 leading-tight">
                A Massive, Systemic Asymmetry
              </h3>
              <p className="text-base text-stone-700 leading-relaxed font-light mb-4">
                Hiring a lawyer for every contract is economically impossible. The stronger party's lawyers
                understand every word; the weaker party understands almost none.
              </p>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Ordinary people rely on intuition, Google searches, or misplaced trust when making
                decisions that can fundamentally alter their economic position.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white border-2 border-stone-900 p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-stone-900 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">Trillions in Avoidable Costs</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Global inefficiency from avoidable disputes, lost leverage, and compromised decisions.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-stone-900 p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <Scale className="w-6 h-6 text-stone-900 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">Unbalanced Negotiations</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      One party with institutional knowledge and counsel; the other with hope and a pen.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-stone-900 p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <FileText className="w-6 h-6 text-stone-900 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">Hidden Consequences</h4>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      Critical provisions buried in legalese that shift risk in ways most will never detect.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="bg-white py-12 sm:py-16 border-t-2 border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="mb-4">
              <span className="mono text-xs text-stone-500 tracking-wider uppercase">The Solution</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mb-4 sm:mb-6 leading-tight">
              Democratizing Legal Comprehension
            </h3>
            <p className="text-lg text-stone-600 leading-relaxed font-light">
              <strong className="text-stone-900">Legal comprehension has never been democratized</strong>. Until now.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 mb-12">
            <div className="border-t-2 border-stone-900 pt-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-8 h-8 text-stone-900" />
                <span className="mono text-xs text-stone-400">01</span>
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-3">Risk Detection</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Automated identification of IP transfers, unlimited liability, auto-renewals,
                and hidden penalties.
              </p>
            </div>

            <div className="border-t-2 border-stone-900 pt-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="w-8 h-8 text-stone-900" />
                <span className="mono text-xs text-stone-400">02</span>
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-3">Plain Language</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Legal jargon decoded into clear explanations revealing what you're actually agreeing to.
              </p>
            </div>

            <div className="border-t-2 border-stone-900 pt-6">
              <div className="flex items-center justify-between mb-4">
                <Scale className="w-8 h-8 text-stone-900" />
                <span className="mono text-xs text-stone-400">03</span>
              </div>
              <h4 className="text-xl font-bold text-stone-900 mb-3">Strategic Guidance</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Specific negotiation points and protective measures to level the playing field.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-all duration-300 group"
            >
              <span>Analyze Your Contract</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Revolutionary Features - AI Powered */}
      <section className="bg-stone-900 text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-16">
            <span className="mono text-xs text-stone-400 tracking-wider uppercase mb-4 block">AI-Powered Intelligence</span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Next-Generation Contract Analysis</h3>
            <p className="text-lg text-stone-300 max-w-2xl mx-auto font-light">
              Industry-first AI features that give you negotiation power and risk prediction
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <Link href="/negotiate" className="group">
              <div className="bg-white text-stone-900 border-2 border-white p-6 hover:bg-stone-50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <MessageSquare className="w-6 h-6" />
                  <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold mono">AI</span>
                </div>
                <h4 className="text-lg font-bold mb-2">AI Negotiation</h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  Clause-by-clause negotiation recommendations with counter-proposals.
                </p>
                <div className="flex items-center gap-2 text-xs font-medium group-hover:gap-3 transition-all">
                  <span>Negotiate</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            <Link href="/risk" className="group">
              <div className="bg-white text-stone-900 border-2 border-white p-6 hover:bg-stone-50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Shield className="w-6 h-6" />
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold mono">ML</span>
                </div>
                <h4 className="text-lg font-bold mb-2">Risk Predictor</h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  ML predicts dispute probability with 82-95% accuracy.
                </p>
                <div className="flex items-center gap-2 text-xs font-medium group-hover:gap-3 transition-all">
                  <span>Predict</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            <Link href="/benchmark" className="group">
              <div className="bg-white text-stone-900 border-2 border-white p-6 hover:bg-stone-50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <TrendingUp className="w-6 h-6" />
                  <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold mono">LIVE</span>
                </div>
                <h4 className="text-lg font-bold mb-2">Market Benchmark</h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  Compare terms against thousands of real contracts.
                </p>
                <div className="flex items-center gap-2 text-xs font-medium group-hover:gap-3 transition-all">
                  <span>Compare</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            <Link href="/voice" className="group">
              <div className="bg-white text-stone-900 border-2 border-white p-6 hover:bg-stone-50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <MessageSquare className="w-6 h-6" />
                  <span className="px-2 py-1 bg-stone-900 text-white text-xs font-bold mono">VOICE</span>
                </div>
                <h4 className="text-lg font-bold mb-2">Voice-to-Contract</h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  Speak to create production-ready legal contracts.
                </p>
                <div className="flex items-center gap-2 text-xs font-medium group-hover:gap-3 transition-all">
                  <span>Create</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            <Link href="/blockchain" className="group">
              <div className="bg-white text-stone-900 border-2 border-white p-6 hover:bg-stone-50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Shield className="w-6 h-6" />
                  <span className="px-2 py-1 bg-stone-900 text-white text-xs font-bold mono">WEB3</span>
                </div>
                <h4 className="text-lg font-bold mb-2">Blockchain Registry</h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  Immutable contract verification with cryptographic proof.
                </p>
                <div className="flex items-center gap-2 text-xs font-medium group-hover:gap-3 transition-all">
                  <span>Verify</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            <Link href="/clauses" className="group">
              <div className="bg-white text-stone-900 border-2 border-white p-6 hover:bg-stone-50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <BookOpen className="w-6 h-6" />
                  <span className="px-2 py-1 bg-amber-600 text-white text-xs font-bold mono">5K+</span>
                </div>
                <h4 className="text-lg font-bold mb-2">Clause Library</h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  5,000+ pre-vetted clauses with risk ratings.
                </p>
                <div className="flex items-center gap-2 text-xs font-medium group-hover:gap-3 transition-all">
                  <span>Browse</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            <Link href="/obligations" className="group">
              <div className="bg-white text-stone-900 border-2 border-white p-6 hover:bg-stone-50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="w-6 h-6" />
                  <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold mono">AUTO</span>
                </div>
                <h4 className="text-lg font-bold mb-2">Obligation Tracker</h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  Auto-extract and track all obligations with deadlines.
                </p>
                <div className="flex items-center gap-2 text-xs font-medium group-hover:gap-3 transition-all">
                  <span>Track</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>

            <Link href="/multi-language" className="group">
              <div className="bg-white text-stone-900 border-2 border-white p-6 hover:bg-stone-50 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <Globe className="w-6 h-6" />
                  <span className="px-2 py-1 bg-teal-500 text-white text-xs font-bold mono">50+</span>
                </div>
                <h4 className="text-lg font-bold mb-2">Multi-Language</h4>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  Analyze contracts in 50+ languages with full legal support.
                </p>
                <div className="flex items-center gap-2 text-xs font-medium group-hover:gap-3 transition-all">
                  <span>Translate</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm text-stone-400 mono">Industry-first capabilities • Zero competitors</p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-stone-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="mono text-xs text-stone-500 tracking-wider uppercase mb-4 block">Platform Capabilities</span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 mb-4 sm:mb-6">Everything You Need for Contract Confidence</h3>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Professional-grade tools that protect your interests without legal fees
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-stone-200 rounded-xl p-4 sm:p-6 hover:border-stone-900 transition-all duration-300 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                  <Zap className="w-6 h-6 text-stone-900 group-hover:text-white transition-colors" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-2">Instant Analysis</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Upload any contract and receive comprehensive risk analysis within seconds, not days.
              </p>
            </div>

            <div className="bg-white border-2 border-stone-200 rounded-xl p-4 sm:p-6 hover:border-stone-900 transition-all duration-300 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                  <Eye className="w-6 h-6 text-stone-900 group-hover:text-white transition-colors" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-2">Hidden Clause Detection</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                AI-powered scanning identifies buried risks that even experienced readers might miss.
              </p>
            </div>

            <div className="bg-white border-2 border-stone-200 rounded-xl p-4 sm:p-6 hover:border-stone-900 transition-all duration-300 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                  <MessageSquare className="w-6 h-6 text-stone-900 group-hover:text-white transition-colors" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-2">Ask Questions</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Chat with your contracts to understand specific clauses and implications in plain language.
              </p>
            </div>

            <div className="bg-white border-2 border-stone-200 rounded-xl p-4 sm:p-6 hover:border-stone-900 transition-all duration-300 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                  <Scale className="w-6 h-6 text-stone-900 group-hover:text-white transition-colors" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-2">Lawyer Marketplace</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Connect with verified lawyers for complex issues that need professional review.
              </p>
            </div>

            <div className="bg-white border-2 border-stone-200 rounded-xl p-4 sm:p-6 hover:border-stone-900 transition-all duration-300 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                  <Users className="w-6 h-6 text-stone-900 group-hover:text-white transition-colors" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-2">Team Collaboration</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Share contracts with stakeholders, collect feedback, and make decisions together.
              </p>
            </div>

            <div className="bg-white border-2 border-stone-200 rounded-xl p-4 sm:p-6 hover:border-stone-900 transition-all duration-300 group">
              <div className="mb-4">
                <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center group-hover:bg-stone-900 transition-colors">
                  <Lock className="w-6 h-6 text-stone-900 group-hover:text-white transition-colors" />
                </div>
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-2">Secure & Private</h4>
              <p className="text-sm text-stone-600 leading-relaxed">
                Bank-level encryption ensures your sensitive contracts remain confidential and secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-12 sm:py-16 md:py-20 border-t-2 border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="p-6">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-stone-900" />
              </div>
              <div className="text-4xl font-bold text-stone-900 mb-2">10,000+</div>
              <div className="text-sm text-stone-600">Contracts Analyzed</div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-3">
                <Users className="w-8 h-8 text-stone-900" />
              </div>
              <div className="text-4xl font-bold text-stone-900 mb-2">5,000+</div>
              <div className="text-sm text-stone-600">Protected Users</div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-3">
                <Clock className="w-8 h-8 text-stone-900" />
              </div>
              <div className="text-4xl font-bold text-stone-900 mb-2">&lt;30s</div>
              <div className="text-sm text-stone-600">Average Analysis Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-white py-12 sm:py-16 md:py-20 cta-section">
        <div className="cta-section-bg" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 text-center cta-section-content">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
            Stop Signing Contracts You Don't Understand
          </h3>
          <p className="text-base text-stone-300 leading-relaxed font-light mb-8">
            Every contract you sign without comprehension is a blind risk.
            Level the playing field with institutional-grade intelligence.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-stone-900 font-medium hover:bg-stone-100 transition-all duration-300 group w-full sm:w-auto justify-center"
          >
            <span>Start Free Analysis</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="mt-4 text-xs text-stone-400">No account • Instant results • Free</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
          <div className="grid md:grid-cols-2 gap-10 mb-6">
            <div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">BeforeYouSign</h3>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                Democratizing legal comprehension through institutional-grade contract intelligence.
              </p>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">Legal Notice</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                <span className="font-medium text-stone-900">Disclaimer:</span> This platform provides analytical intelligence
                and does not constitute legal counsel. Material matters should be reviewed by qualified legal counsel.
              </p>
            </div>
          </div>
          <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
            <p className="text-xs text-stone-500 mono">© 2025 BeforeYouSign</p>
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span className="hover:text-stone-900 transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-stone-900 transition-colors cursor-pointer">Terms</span>
            </div>
          </div>
        </div>
      </footer>
      {/* FAQ Section for rich results */}
      <section className="bg-stone-50 py-12 sm:py-16 border-t border-stone-200" aria-label="Frequently Asked Questions">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-10">
            <span className="mono text-xs text-stone-500 tracking-wider uppercase">FAQ</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-2">Frequently Asked Questions</h2>
          </div>
          <dl className="space-y-6">
            {[
              {
                q: 'Is BeforeYouSign free to use?',
                a: 'Yes, the core contract analysis is completely free with no account required. Upload your contract and get instant results.',
              },
              {
                q: 'What types of contracts can I analyze?',
                a: 'BeforeYouSign supports all common contract types including employment agreements, NDAs, lease agreements, SaaS contracts, freelance contracts, and more. Upload PDF or paste plain text.',
              },
              {
                q: 'Is my contract data kept private?',
                a: 'Your contracts are never stored on our servers. All analysis happens in real-time and the document is discarded immediately after processing.',
              },
              {
                q: 'How accurate is the AI contract analysis?',
                a: 'We use Llama 3.1 language models. Our dispute probability predictor achieves 82–95% accuracy on contract risk forecasting.',
              },
              {
                q: 'How long does analysis take?',
                a: 'Most contracts are fully analyzed in under 30 seconds. Streaming output means you see results as they are generated.',
              },
              {
                q: 'Does BeforeYouSign support multiple languages?',
                a: 'Yes — BeforeYouSign can analyze contracts in 50+ languages with full legal support.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white border border-stone-200 p-6">
                <dt className="font-semibold text-stone-900 mb-2">{q}</dt>
                <dd className="text-stone-600 text-sm leading-relaxed">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* JSON-LD structured data */}
      <JsonLd data={homepageFaqSchema()} />
    </div>
  );
}
