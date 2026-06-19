'use client';

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  ArrowRight,
  Zap,
  Target,
  Shield,
  BarChart3,
  Lightbulb,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  NegotiationSession,
  ClauseNegotiationPoint,
  NegotiationMove,
  aiNegotiationAssistant
} from '@/lib/ai-negotiation-assistant';

export default function AINegotiationAssistant() {
  const [session, setSession] = useState<NegotiationSession | null>(null);
  const [selectedClause, setSelectedClause] = useState<ClauseNegotiationPoint | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['strategy']));
  const [aggressiveness, setAggressiveness] = useState<'firm' | 'balanced' | 'conciliatory'>('balanced');
  const [showCounterproposals, setShowCounterproposals] = useState(false);

  // Demo data for visualization
  const demoSession: NegotiationSession = {
    id: 'demo-session',
    contractId: 'contract-123',
    context: {
      contractType: 'SaaS Subscription Agreement',
      industry: 'Technology',
      jurisdiction: 'California',
      partyRole: 'buyer',
      contractValue: 120000,
      urgency: 'medium'
    },
    status: 'active',
    strategy: {
      overallApproach: 'collaborative',
      priorityIssues: [
        'Reduce annual payment to $100k',
        'Cap liability at 1x annual fees',
        'Add 30-day termination for convenience'
      ],
      tradablePoints: [
        'Can accept 60-day payment terms instead of 30',
        'Willing to commit to 24 months instead of 12',
        'Can provide case studies for marketing'
      ],
      walkAwayConditions: [
        'Unlimited liability',
        'No termination rights',
        'Auto-renewal without notice'
      ],
      powerDynamics: {
        yourLeverage: 65,
        theirLeverage: 45,
        marketConditions: 'buyer-market',
        timeFactors: ['Quarter-end pressure on vendor', 'Multiple competitive options available']
      },
      recommendations: [
        {
          phase: 'initial',
          actions: [
            'Lead with data room access and compliance requests',
            'Frame pricing discussion around market benchmarks',
            'Build relationship with technical team'
          ],
          expectedResponses: [
            'May pushback on extensive due diligence',
            'Will likely defend pricing with feature value',
            'Should be receptive to technical engagement'
          ],
          contingencyPlans: [
            'If data room denied, request specific compliance certs',
            'If pricing rigid, negotiate on payment terms and add-ons',
            'If tech team unavailable, request detailed documentation'
          ]
        }
      ]
    },
    clauses: [
      {
        clauseId: 'payment-terms',
        clauseTitle: 'Payment Terms',
        currentText: '$120,000 annually, due within 15 days of invoice',
        issueLevel: 'high',
        issues: [
          'Above market rate for similar tools (avg: $95k)',
          'Payment terms too aggressive (industry standard: 30 days)',
          'No volume discount despite multi-year commitment'
        ],
        counterproposals: [
          {
            suggestion: '$100,000 annually for 2-year commitment, payable within 30 days net',
            rationale: 'Market rate for enterprise SaaS with standard payment terms. 2-year commitment justifies discount.',
            successRate: 78,
            marketStandard: true,
            aggressiveness: 'balanced'
          },
          {
            suggestion: '$95,000 annually, 45-day payment terms',
            rationale: 'Aggressive positioning at lower quartile pricing with buyer-favorable payment terms.',
            successRate: 45,
            marketStandard: false,
            aggressiveness: 'firm'
          },
          {
            suggestion: '$110,000 annually, 30-day payment terms, with option for $10k/year discount if paid annually upfront',
            rationale: 'Moderate discount with incentive structure. Vendor gets cash flow benefit from upfront payment option.',
            successRate: 85,
            marketStandard: true,
            aggressiveness: 'conciliatory'
          }
        ],
        negotiationTactics: [
          {
            tactic: 'Market Anchoring',
            whenToUse: 'In initial response to pricing',
            expectedOutcome: 'Forces vendor to justify premium pricing',
            riskLevel: 'low'
          },
          {
            tactic: 'Bundled Concessions',
            whenToUse: 'When vendor resists price reduction',
            expectedOutcome: 'Trade longer commitment for better price',
            riskLevel: 'medium'
          }
        ],
        benchmarks: {
          industryStandard: '$95k-$105k annually with 30-day payment terms',
          favorability: 'unfavorable',
          commonVariations: [
            'Volume discounts for 100+ users',
            'Multi-year commitments get 10-15% discount',
            'Quarterly payment option at 5% premium'
          ],
          redFlags: [
            'Price 20% above market median',
            '15-day payment terms very aggressive',
            'No mention of price increases or freezes'
          ]
        }
      },
      {
        clauseId: 'liability-cap',
        clauseTitle: 'Limitation of Liability',
        currentText: 'Vendor liability capped at $10,000 for any claims',
        issueLevel: 'critical',
        issues: [
          'Cap is only 8% of annual fee (market: 100% of fees paid)',
          'No carveouts for gross negligence or willful misconduct',
          'Customer pays $120k but vendor only liable for $10k max'
        ],
        counterproposals: [
          {
            suggestion: 'Each party\'s liability capped at the total fees paid in the 12 months preceding the claim, except for: (i) gross negligence or willful misconduct, (ii) breach of confidentiality, (iii) violation of IP rights - which have no cap.',
            rationale: 'Standard market terms. Mutual cap at 1x annual fees with reasonable carveouts for intentional breaches.',
            successRate: 72,
            marketStandard: true,
            aggressiveness: 'balanced'
          },
          {
            suggestion: 'Vendor liability capped at 2x annual fees paid. Customer liability capped at fees paid.',
            rationale: 'Asymmetric cap recognizing vendor has higher risk exposure. More than market standard.',
            successRate: 35,
            marketStandard: false,
            aggressiveness: 'firm'
          }
        ],
        negotiationTactics: [
          {
            tactic: 'Risk Quantification',
            whenToUse: 'When vendor claims risk is low',
            expectedOutcome: 'Concrete examples make inadequate cap obvious',
            riskLevel: 'low'
          }
        ],
        benchmarks: {
          industryStandard: '1x-2x annual fees with carveouts for intentional breaches',
          favorability: 'highly-unfavorable',
          commonVariations: [
            '1x annual fees most common',
            'Some allow 2x for enterprise deals',
            'Uncapped for IP infringement and confidentiality breaches'
          ],
          redFlags: [
            'Extreme imbalance - vendor pays $10k max, customer pays $120k',
            'No carveouts whatsoever',
            'Not reciprocal/mutual'
          ]
        }
      },
      {
        clauseId: 'termination',
        clauseTitle: 'Termination',
        currentText: 'Either party may terminate for material breach with 30 days notice. Customer may not terminate for convenience.',
        issueLevel: 'medium',
        issues: [
          'No termination for convenience for customer',
          'Locked in for full term even if needs change',
          'Vendor can terminate but customer cannot'
        ],
        counterproposals: [
          {
            suggestion: 'Either party may terminate for material breach with 30 days notice. Customer may terminate for convenience with 90 days notice after the first 12 months. Early termination fee: 50% of remaining contract value.',
            rationale: 'Allows customer flexibility after first year with reasonable early termination fee. Vendor still protected.',
            successRate: 68,
            marketStandard: true,
            aggressiveness: 'balanced'
          }
        ],
        negotiationTactics: [],
        benchmarks: {
          industryStandard: 'Termination for convenience with 60-90 days notice and early termination fee',
          favorability: 'unfavorable',
          commonVariations: [],
          redFlags: []
        }
      }
    ],
    history: []
  };

  useEffect(() => {
    setSession(demoSession);
    setSelectedClause(demoSession.clauses[0]);
  }, []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getIssueLevelColor = (level: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-300',
      high: 'bg-orange-100 text-orange-700 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      low: 'bg-blue-100 text-blue-700 border-blue-300',
      acceptable: 'bg-green-100 text-green-700 border-green-300'
    };
    return colors[level as keyof typeof colors] || colors.medium;
  };

  const getFavorabilityColor = (favorability: string) => {
    const colors = {
      'highly-favorable': 'text-green-600',
      'favorable': 'text-green-500',
      'neutral': 'text-stone-500',
      'unfavorable': 'text-orange-500',
      'highly-unfavorable': 'text-red-600'
    };
    return colors[favorability as keyof typeof colors] || colors.neutral;
  };

  if (!session) return <div className="flex items-center justify-center h-96"><RefreshCw className="w-8 h-8 animate-spin text-stone-400" /></div>;

  return (
    <div className="min-h-screen bg-stone-50 light-section-pattern">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-12 dark-section-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-stone-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">AI Negotiation Assistant</h1>
              <p className="text-stone-300 text-sm uppercase tracking-wider mono mt-1">Powered by Market Intelligence</p>
            </div>
          </div>
          <p className="text-xl text-stone-300 max-w-3xl">
            Real-time counterproposals, negotiation tactics, and market benchmarks to help you get better deals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Contract Context */}
        <div className="bg-white border-2 border-stone-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-stone-900 mb-4">Negotiation Context</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold mb-1">Contract Type</p>
              <p className="text-sm font-medium text-stone-900">{session.context.contractType}</p>
            </div>
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold mb-1">Your Role</p>
              <p className="text-sm font-medium text-stone-900 capitalize">{session.context.partyRole}</p>
            </div>
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold mb-1">Contract Value</p>
              <p className="text-sm font-medium text-stone-900">${session.context.contractValue?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold mb-1">Market Conditions</p>
              <p className="text-sm font-medium text-green-600 capitalize">{session.strategy.powerDynamics.marketConditions}</p>
            </div>
          </div>
        </div>

        {/* Power Dynamics */}
        <div className="bg-white border-2 border-stone-200 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-stone-600" />
              Leverage Analysis
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-stone-700">Your Leverage</span>
                <span className="text-2xl font-bold text-green-600">{session.strategy.powerDynamics.yourLeverage}%</span>
              </div>
              <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                  style={{ width: `${session.strategy.powerDynamics.yourLeverage}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-stone-700">Their Leverage</span>
                <span className="text-2xl font-bold text-orange-600">{session.strategy.powerDynamics.theirLeverage}%</span>
              </div>
              <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
                  style={{ width: `${session.strategy.powerDynamics.theirLeverage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <p className="text-sm font-semibold text-green-900 mb-2">✓ Time Factors in Your Favor:</p>
            <ul className="text-sm text-green-800 space-y-1">
              {session.strategy.powerDynamics.timeFactors.map((factor, idx) => (
                <li key={idx}>• {factor}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Strategy Overview */}
        <div className="bg-white border-2 border-stone-200 rounded-xl p-6 mb-6">
          <button
            onClick={() => toggleSection('strategy')}
            className="w-full flex items-center justify-between"
          >
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-stone-600" />
              Negotiation Strategy
            </h3>
            {expandedSections.has('strategy') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {expandedSections.has('strategy') && (
            <div className="mt-6 grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">Priority Issues</p>
                <ul className="space-y-2">
                  {session.strategy.priorityIssues.map((issue, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">Tradable Points</p>
                <ul className="space-y-2">
                  {session.strategy.tradablePoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                      <ArrowRight className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm font-semibold text-stone-700 mb-3 uppercase tracking-wide">Walk-Away Conditions</p>
                <ul className="space-y-2">
                  {session.strategy.walkAwayConditions.map((condition, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                      <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Clause Analysis */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Clause List */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
              <h3 className="text-lg font-bold text-stone-900 mb-4">Contract Clauses</h3>
              <div className="space-y-3">
                {session.clauses.map(clause => (
                  <button
                    key={clause.clauseId}
                    onClick={() => setSelectedClause(clause)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedClause?.clauseId === clause.clauseId
                        ? 'border-stone-900 bg-stone-50'
                        : 'border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-stone-900">{clause.clauseTitle}</p>
                      <span className={`text-xs px-2 py-1 rounded border font-semibold ${getIssueLevelColor(clause.issueLevel)}`}>
                        {clause.issueLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">{clause.issues.length} issues identified</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clause Detail */}
          <div className="lg:col-span-2">
            {selectedClause && (
              <div className="space-y-6">
                {/* Current Text */}
                <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-stone-900 mb-4">{selectedClause.clauseTitle}</h3>
                  <div className="bg-stone-50 border-2 border-stone-200 p-4 rounded-lg mb-4">
                    <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold mb-2">Current Terms</p>
                    <p className="text-sm text-stone-700 leading-relaxed">{selectedClause.currentText}</p>
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-sm font-semibold text-red-900 mb-2">⚠️ Issues Identified:</p>
                    <ul className="space-y-1">
                      {selectedClause.issues.map((issue, idx) => (
                        <li key={idx} className="text-sm text-red-800">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Market Benchmarks */}
                <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-stone-600" />
                    Market Benchmark
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold mb-2">Industry Standard</p>
                      <p className="text-sm text-stone-700">{selectedClause.benchmarks.industryStandard}</p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-500 uppercase tracking-wide font-semibold mb-2">Favorability</p>
                      <p className={`text-lg font-bold ${getFavorabilityColor(selectedClause.benchmarks.favorability)}`}>
                        {selectedClause.benchmarks.favorability.toUpperCase().replace(/-/g, ' ')}
                      </p>
                    </div>
                    {selectedClause.benchmarks.redFlags.length > 0 && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-sm font-semibold text-red-900 mb-2">🚩 Red Flags:</p>
                        <ul className="space-y-1">
                          {selectedClause.benchmarks.redFlags.map((flag, idx) => (
                            <li key={idx} className="text-sm text-red-800">• {flag}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Counterproposals */}
                <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      AI-Generated Counterproposals
                    </h3>
                    <select
                      value={aggressiveness}
                      onChange={(e) => setAggressiveness(e.target.value as any)}
                      className="px-4 py-2 border-2 border-stone-200 rounded-lg text-sm font-semibold focus:outline-none focus:border-stone-900"
                    >
                      <option value="conciliatory">Conciliatory</option>
                      <option value="balanced">Balanced</option>
                      <option value="firm">Firm</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    {selectedClause.counterproposals
                      .filter(cp => aggressiveness === 'balanced' || cp.aggressiveness === aggressiveness)
                      .map((proposal, idx) => (
                        <div 
                          key={idx}
                          className="border-2 border-stone-200 rounded-lg p-4 hover:border-stone-900 transition-all cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded border font-semibold ${
                                proposal.marketStandard 
                                  ? 'bg-green-100 text-green-700 border-green-300'
                                  : 'bg-orange-100 text-orange-700 border-orange-300'
                              }`}>
                                {proposal.marketStandard ? 'MARKET STANDARD' : 'AGGRESSIVE'}
                              </span>
                              <span className="text-xs px-2 py-1 rounded border font-semibold bg-blue-100 text-blue-700 border-blue-300">
                                {proposal.successRate}% Success Rate
                              </span>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded border font-semibold ${
                              proposal.aggressiveness === 'firm' ? 'bg-red-100 text-red-700 border-red-300' :
                              proposal.aggressiveness === 'balanced' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                              'bg-green-100 text-green-700 border-green-300'
                            }`}>
                              {proposal.aggressiveness.toUpperCase()}
                            </span>
                          </div>

                          <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg mb-3">
                            <p className="text-xs text-green-700 uppercase tracking-wide font-semibold mb-2">Suggested Language</p>
                            <p className="text-sm text-green-900 leading-relaxed">{proposal.suggestion}</p>
                          </div>

                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-stone-600">{proposal.rationale}</p>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button className="flex-1 px-4 py-2 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2">
                              <Eye className="w-4 h-4" />
                              Use This
                            </button>
                            <button className="px-4 py-2 border-2 border-stone-200 text-stone-700 rounded-lg font-semibold hover:bg-stone-50 transition-colors">
                              Customize
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Negotiation Tactics */}
                {selectedClause.negotiationTactics.length > 0 && (
                  <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-stone-600" />
                      Recommended Tactics
                    </h3>
                    <div className="space-y-3">
                      {selectedClause.negotiationTactics.map((tactic, idx) => (
                        <div key={idx} className="border-2 border-stone-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-bold text-stone-900">{tactic.tactic}</p>
                            <span className={`text-xs px-2 py-1 rounded border font-semibold ${
                              tactic.riskLevel === 'low' ? 'bg-green-100 text-green-700 border-green-300' :
                              tactic.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                              'bg-red-100 text-red-700 border-red-300'
                            }`}>
                              {tactic.riskLevel.toUpperCase()} RISK
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mb-2">
                            <span className="font-semibold">When to use:</span> {tactic.whenToUse}
                          </p>
                          <p className="text-xs text-stone-600">
                            <span className="font-semibold">Expected outcome:</span> {tactic.expectedOutcome}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
