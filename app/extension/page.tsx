'use client';

import Link from 'next/link';
import { Download, Globe, Shield, CheckCircle, Zap, Eye } from 'lucide-react';

export default function ExtensionPage() {
  const steps = [
    {
      num: '01',
      title: 'Start the app locally',
      code: 'npm run dev',
      desc: 'The extension calls your local BeforeYouSign instance at localhost:3000.',
    },
    {
      num: '02',
      title: 'Open Chrome Extensions',
      desc: 'Navigate to',
      link: { label: 'chrome://extensions', href: 'chrome://extensions' },
      suffix: 'and enable Developer Mode (top-right toggle).',
    },
    {
      num: '03',
      title: 'Load Unpacked',
      desc: 'Click "Load unpacked" and select the',
      code: 'browser-extension/',
      suffix: 'folder inside this project.',
    },
    {
      num: '04',
      title: 'Pin & use it!',
      desc: 'Pin BeforeYouSign to your Chrome toolbar. Visit any contract page — highlights appear automatically.',
    },
  ];

  const features = [
    {
      icon: Eye,
      title: 'Auto-detects contracts',
      desc: 'Scans any web page for contract language automatically.',
    },
    {
      icon: Zap,
      title: 'Instant risk highlights',
      desc: 'Wavy colored underlines — red = critical, orange = high, yellow = medium.',
    },
    {
      icon: Shield,
      title: 'Plain-language tooltips',
      desc: 'Hover any underline to get a simple explanation + suggested fix.',
    },
    {
      icon: Globe,
      title: 'Risk gauge popup',
      desc: 'Click the toolbar icon to see an animated risk score + full issue list.',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-5xl mx-auto px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Chrome Extension — Free
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-5 leading-tight">
            Grammarly for Contracts.<br />
            <span className="text-stone-400">Right in your browser.</span>
          </h1>
          <p className="text-lg text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            BeforeYouSign automatically highlights risky clauses on any contract page —
            DocuSign, Google Docs, email attachments — with wavy underlines and instant explanations.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a
              href="/browser-extension.zip"
              download
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-stone-900 text-base font-bold rounded-xl hover:bg-stone-100 transition-all hover:scale-105 shadow-xl"
            >
              <Download className="w-5 h-5" />
              Download Extension (.zip)
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 border-2 border-white/30 text-white text-base font-semibold rounded-xl hover:border-white transition-all"
            >
              View Source Code
            </a>
          </div>
          <p className="text-stone-500 text-sm mt-6">
            Developer mode required · Chrome 88+ · Works with localhost:3000
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-2xl font-bold text-stone-900 text-center mb-10">What it does</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-white border border-stone-200 rounded-xl p-6 flex gap-4">
                <div className="w-10 h-10 bg-stone-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <div className="font-bold text-stone-900 mb-1">{f.title}</div>
                  <div className="text-sm text-stone-500 leading-relaxed">{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Risk color legend */}
      <section className="max-w-5xl mx-auto px-8 pb-12">
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <h3 className="font-bold text-stone-900 mb-4">Risk color legend</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { level: 'Critical', color: '#dc2626', bg: '#fee2e2' },
              { level: 'High', color: '#ea580c', bg: '#ffedd5' },
              { level: 'Medium', color: '#ca8a04', bg: '#fef9c3' },
              { level: 'Low', color: '#16a34a', bg: '#f0fdf4' },
            ].map((r) => (
              <div
                key={r.level}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: r.bg, color: r.color }}
              >
                <span
                  className="inline-block w-16 h-0"
                  style={{ borderBottom: `2.5px wavy ${r.color}` }}
                />
                {r.level} Risk
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Install Steps */}
      <section className="max-w-5xl mx-auto px-8 pb-20">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">How to install</h2>
        <p className="text-stone-500 mb-8 text-sm">
          The extension is not on the Chrome Web Store yet — install it in developer mode (takes 60 seconds).
        </p>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-xl p-6 flex gap-5 items-start">
              <div className="text-3xl font-black text-stone-200 leading-none w-10 flex-shrink-0">{step.num}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-stone-400" />
                  <span className="font-bold text-stone-900">{step.title}</span>
                </div>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {step.desc}
                  {step.code && (
                    <code className="mx-1.5 px-2 py-0.5 bg-stone-100 text-stone-700 rounded font-mono text-xs">
                      {step.code}
                    </code>
                  )}
                  {step.suffix}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Keyboard shortcuts */}
        <div className="mt-8 bg-stone-900 text-white rounded-xl p-6">
          <h3 className="font-bold text-sm uppercase tracking-wider text-stone-400 mb-4">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Ctrl+Shift+B', 'Re-analyze current page'],
              ['Ctrl+Shift+H', 'Toggle highlights on/off'],
              ['Right-click', '"Analyze with BeforeYouSign"'],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-xs whitespace-nowrap">{key}</kbd>
                <span className="text-stone-300">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="/browser-extension.zip"
            download
            className="inline-flex items-center gap-3 px-10 py-4 bg-stone-900 text-white text-base font-bold rounded-xl hover:bg-stone-800 transition-all hover:scale-105 shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download browser-extension.zip
          </a>
          <p className="text-stone-400 text-xs mt-3">
            Extract → Chrome → Load unpacked → Done
          </p>
        </div>
      </section>
    </div>
  );
}
