import type { Metadata } from 'next';
import Link from 'next/link';
import { PenLine, BookTemplate, Brain, Users, Calendar, FileSignature, ArrowRight } from 'lucide-react';

const BASE_URL = 'https://beforeyousign.vercel.app';

export const metadata: Metadata = {
  title: 'Features — The Most Advanced AI Contract Platform',
  description:
    'Explore BeforeYouSign features: AI contract drafting in 30 seconds, smart template builder, real-time collaboration, lifecycle automation, 50+ industry templates, and business intelligence — all AI-powered.',
  alternates: { canonical: `${BASE_URL}/features` },
  openGraph: {
    title: 'Features — AI Contract Intelligence Platform | BeforeYouSign',
    description:
      'AI drafting, template builder, collaboration, obligation tracking, 50+ templates, and intelligence dashboards. The most advanced contract platform ever built.',
    url: `${BASE_URL}/features`,
    type: 'website',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
};

const features = [
  {
    href: '/drafting',
    icon: PenLine,
    badge: 'NEW',
    title: 'AI Contract Drafting',
    description:
      'Create complete, professional contracts from natural language in 30 seconds. Just describe what you need.',
    bullets: [
      'Natural language input — no legal expertise needed',
      '3 variations: balanced, protective, simple',
      'AI clause recommendations',
      'Learn from your feedback',
    ],
    cta: 'Try AI Drafting',
  },
  {
    href: '/template-builder',
    icon: BookTemplate,
    badge: 'NEW',
    title: 'Smart Template Builder',
    description:
      'Build custom contracts with drag-and-drop from a library of 500+ professional clauses.',
    bullets: [
      '500+ professional clause library',
      'Drag-and-drop interface',
      'AI compatibility checking',
      'Completeness scoring',
    ],
    cta: 'Build Templates',
  },
  {
    href: '/intelligence',
    icon: Brain,
    badge: 'NEW',
    title: 'Business Intelligence',
    description:
      'AI identifies $500k–$2M in cost savings through vendor consolidation and optimisation.',
    bullets: [
      'Portfolio analytics dashboard',
      'AI cost savings identification',
      'Vendor performance tracking',
      'Executive KPI dashboards',
    ],
    cta: 'View Analytics',
  },
  {
    href: '/team',
    icon: Users,
    badge: 'NEW',
    title: 'Real-Time Collaboration',
    description:
      'Google Docs-style editing with live cursors, comments, and track changes for contracts.',
    bullets: [
      'Live multi-user editing',
      'Real-time cursors & selections',
      'Threaded comments with @mentions',
      'Track changes workflow',
    ],
    cta: 'Collaborate Now',
  },
  {
    href: '/renewals',
    icon: Calendar,
    badge: 'NEW',
    title: 'Lifecycle Automation',
    description:
      'End-to-end automation from draft to approval to execution to renewal management.',
    bullets: [
      'Automated approval workflows',
      'AI obligation extraction',
      '90/60/30/7-day renewal alerts',
      'Performance tracking & SLAs',
    ],
    cta: 'Manage Lifecycle',
  },
  {
    href: '/templates-enhanced',
    icon: FileSignature,
    badge: 'NEW',
    title: '50+ Template Library',
    description:
      'Production-ready contracts across all industries — SaaS, Real Estate, Employment, Finance, Healthcare.',
    bullets: [
      '50+ professional templates',
      '10 industry categories',
      'Lawyer-reviewed & certified',
      'Variable customisation',
    ],
    cta: 'Browse Templates',
  },
];

const stats = [
  { value: '30s', label: 'Contract creation time' },
  { value: '500+', label: 'Professional clauses' },
  { value: '$2M', label: 'Potential annual savings' },
  { value: '50+', label: 'Industry templates' },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-white border-b-2 border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-14 sm:py-20">
          <div className="max-w-3xl">
            <span className="mono text-xs text-stone-500 tracking-wider uppercase">Platform Features</span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-stone-900 leading-[1.1] tracking-tight">
              The Most Advanced Contract Platform Ever Built
            </h1>
            <div className="mt-4 border-l-4 border-stone-900 pl-5">
              <p className="text-base text-stone-600 font-light leading-relaxed">
                Transform how you create, manage, and optimise contracts with AI-powered features
                that save time and money.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Link key={f.href} href={f.href} className="group block">
                <div className="bg-white border-2 border-stone-200 hover:border-stone-900 transition-all duration-200 p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 bg-stone-900 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {f.badge && (
                      <span className="mono text-[10px] font-bold text-stone-900 border border-stone-900 px-2 py-0.5 uppercase tracking-wider">
                        {f.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 mb-3">{f.title}</h3>
                  <p className="text-sm text-stone-600 font-light leading-relaxed mb-6">{f.description}</p>

                  <ul className="space-y-2 flex-1">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-stone-700">
                        <span className="text-stone-900 font-bold mt-0.5">✓</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-stone-900 group-hover:gap-3 transition-all">
                    {f.cta}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-t-2 border-stone-900 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s) => (
              <div key={s.value}>
                <div className="text-4xl sm:text-5xl font-bold text-stone-900 mb-2">{s.value}</div>
                <div className="text-sm text-stone-500 font-light">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-16">
        <div className="bg-stone-900 p-10 sm:p-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            Ready to Transform Your Contract Management?
          </h2>
          <p className="text-stone-400 font-light mb-8">
            Start drafting professional contracts in seconds with AI.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/drafting"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-stone-900 font-semibold hover:bg-stone-100 transition-colors"
            >
              Try AI Drafting
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/template-builder"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-white text-white font-semibold hover:bg-white hover:text-stone-900 transition-colors"
            >
              Build Templates
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

