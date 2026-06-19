'use client';

import { useState } from 'react';
import { BookOpen, ChevronRight, Target, AlertTriangle, Shield, TrendingUp, FileText, Briefcase, Home, Code, Users, Scale, CheckCircle2, Download, BookMarked, Lightbulb, DollarSign, Clock, MapPin, MessageSquare, Award } from 'lucide-react';

interface PlaybookStep {
  title: string;
  description: string;
  action: string;
  legalRationale?: string;
  sampleLanguage?: string;
}

interface CaseExample {
  scenario: string;
  outcome: string;
  lesson: string;
}

interface NegotiationScript {
  situation: string;
  opening: string;
  response: string;
  closing: string;
}

interface Playbook {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  keyTactics: string[];
  redFlags: string[];
  steps: PlaybookStep[];
  proTips: string[];
  caseExamples?: CaseExample[];
  negotiationScripts?: NegotiationScript[];
  legalConcepts?: string[];
  budgetConsiderations?: string[];
  jurisdictionNotes?: string[];
  commonMistakes?: string[];
  checklist?: string[];
}

const playbooks: Playbook[] = [
  {
    id: 'employment',
    title: 'Employment Contract Negotiation',
    category: 'Employment',
    icon: <Briefcase className="w-5 h-5" />,
    description: 'Master the art of negotiating employment terms, from salary to equity and everything in between.',
    difficulty: 'Intermediate',
    estimatedTime: '30 min',
    keyTactics: [
      'Always negotiate total compensation, not just base salary - include equity, bonus, 401k match, and benefits in your analysis',
      'Request equity vesting schedules in writing with clear cliff periods and acceleration clauses',
      'Negotiate remote work flexibility upfront with specific language about location requirements',
      'Ask for sign-on bonus to offset equity cliff or relocation costs (typically 10-20% of base)',
      'Clarify IP ownership for side projects - push for carve-outs for pre-existing work and non-competing projects',
      'Negotiate severance packages before starting (common: 1 week per year of service, minimum 3 months)',
      'Request specific performance metrics and review timelines tied to compensation increases',
      'Secure written agreement on title, reporting structure, and role evolution path'
    ],
    redFlags: [
      'Unlimited unpaid overtime clauses without comp time or overtime pay provisions',
      'Non-compete preventing future employment in your industry for > 1 year or > 25 mile radius',
      'Vague job responsibilities that could expand scope without compensation adjustment',
      'No clear termination terms or "at-will" without severance provisions',
      'Automatic IP assignment for all work including nights, weekends, and personal projects',
      'Mandatory arbitration clauses that waive your right to sue or join class actions',
      'Equity without clear vesting schedule or subject to board discretion',
      'Non-solicitation clauses preventing you from working with former colleagues',
      'Garden leave provisions without full salary continuation',
      'Clawback provisions on bonuses already earned and paid'
    ],
    steps: [
      {
        title: 'Review the Initial Offer',
        description: 'Analyze all components: base salary, equity, benefits, and restrictions.',
        action: 'Create a spreadsheet comparing total compensation packages',
        legalRationale: 'Total compensation analysis protects against seemingly high salaries offset by poor benefits or equity terms.',
        sampleLanguage: 'Could you provide a breakdown of the total compensation package including base, target bonus percentage, equity grant details, 401k match, health insurance employer contribution, and any other benefits?'
      },
      {
        title: 'Research Market Rates',
        description: 'Use tools like Levels.fyi, Glassdoor, and industry reports.',
        action: 'Document 3-5 comparable positions with salary data',
        legalRationale: 'Market data provides objective leverage in negotiations and helps identify below-market offers.',
        sampleLanguage: 'Based on my research of comparable roles at [Company A, B, C], the market rate for this position ranges from $X to $Y. I\'d like to discuss how we can align this offer with market standards.'
      },
      {
        title: 'Prioritize Your Asks',
        description: 'Rank what matters most: money, equity, flexibility, title, or growth.',
        action: 'Create a list with "must-haves" and "nice-to-haves"',
        legalRationale: 'Prioritization allows strategic concessions while securing critical terms.',
        sampleLanguage: 'I\'m most focused on [X, Y, Z]. I\'m flexible on [A, B] if we can find alignment on my priority areas.'
      },
      {
        title: 'Make Your Counter',
        description: 'Present data-backed requests with enthusiasm for the role.',
        action: 'Draft email or prepare talking points for negotiation call',
        legalRationale: 'Written communication creates a paper trail and allows careful consideration of language.',
        sampleLanguage: 'I\'m very excited about this opportunity and confident I can deliver significant value. Based on my experience and market research, I\'d like to propose: [specific requests with data backing].'
      },
      {
        title: 'Get Everything in Writing',
        description: 'Ensure all agreed terms are in the final contract.',
        action: 'Review final contract against negotiation notes before signing',
        legalRationale: 'Verbal agreements are unenforceable. Only written contract terms are legally binding.',
        sampleLanguage: 'Thank you for agreeing to [X, Y, Z]. Could you please send an updated offer letter reflecting these terms before I sign?'
      },
      {
        title: 'Review with Legal Counsel',
        description: 'Have an employment attorney review before signing, especially for executive roles.',
        action: 'Budget $500-2000 for attorney review of complex agreements',
        legalRationale: 'Attorney review catches non-standard clauses, unreasonable restrictions, and potential future liabilities.',
        sampleLanguage: 'I\'d like to have my attorney review the agreement. Is there any flexibility on the signing deadline to allow for this review?'
      }
    ],
    proTips: [
      'Never accept the first offer - companies expect negotiation and typically have 10-30% room built in',
      'Negotiate after receiving the offer but before accepting - you have maximum leverage at this point',
      'Use competing offers as leverage (if you have them), but never fabricate - companies verify',
      'Ask "Is there any flexibility on [X]?" instead of demanding - collaborative tone yields better results',
      'Consider total comp over 4 years, not just year one - equity and bonuses compound',
      'For startups, negotiate acceleration clauses: single-trigger for acquisition, double-trigger for termination',
      'Request annual equity refreshers in writing - critical for retention in tech companies',
      'Negotiate title carefully - it affects your market value and future opportunities',
      'Get relocation reimbursement in writing with gross-up for taxes if applicable',
      'For remote roles, clarify tax implications and which state\'s laws govern'
    ],
    caseExamples: [
      {
        scenario: 'Senior Engineer received offer: $180k base, 0.1% equity, standard benefits',
        outcome: 'Negotiated to $200k base, 0.15% equity, $25k sign-on bonus, remote flexibility',
        lesson: 'Used competing offer from FAANG company as leverage, focused on total comp over 4 years, agreed to slightly lower base for more equity'
      },
      {
        scenario: 'VP Sales offered role with aggressive non-compete (2 years, entire industry)',
        outcome: 'Reduced to 1 year, limited to direct competitors within 50 miles, secured 6-month severance',
        lesson: 'Argued that 2-year industry ban would prevent earning a living, showed willingness to walk away, got legal review that highlighted unreasonable restrictions'
      },
      {
        scenario: 'Product Manager facing "at-will" employment with no severance',
        outcome: 'Negotiated 3-month severance package with 6-month COBRA coverage',
        lesson: 'Cited industry norms, emphasized risk of relocating family, agreed to non-disparagement clause in exchange'
      }
    ],
    negotiationScripts: [
      {
        situation: 'Recruiter says "This is our final offer" on first call',
        opening: 'I really appreciate the offer and I\'m excited about the role. I\'d like to take some time to review all the details carefully.',
        response: 'Based on my research and the value I\'ll bring, I was hoping we could discuss [specific ask]. Is there any flexibility here?',
        closing: 'I understand there may be constraints. If we can find alignment on [priority], I\'m ready to move forward quickly.'
      },
      {
        situation: 'Discussing equity for startup role',
        opening: 'Can you help me understand the current valuation, outstanding shares, and how this equity grant fits into the cap table?',
        response: 'For this level of risk, market compensation typically includes [X]% equity. How can we bridge this gap?',
        closing: 'I\'d also like to discuss acceleration clauses for acquisition or termination scenarios to protect my equity.'
      },
      {
        situation: 'Negotiating remote work after pandemic',
        opening: 'I\'ve been highly productive working remotely and would like to continue. Can we include remote work flexibility in the agreement?',
        response: 'I understand the preference for in-office, but I\'m willing to commit to [X days/month] in office if we can formalize the remote arrangement.',
        closing: 'Let\'s put the specific arrangement in writing so we both have clarity on expectations.'
      }
    ],
    legalConcepts: [
      'At-Will Employment: Default in most US states, allows termination without cause. Negotiate exceptions.',
      'Equity Vesting Cliff: Period before any equity vests (typical: 1 year). Negotiate shorter cliffs or sign-on equity.',
      'Acceleration Clauses: Immediate vesting upon acquisition (single-trigger) or termination (double-trigger).',
      'Non-Compete Agreements: Restrictions on working for competitors. Must be reasonable in time, geography, scope.',
      'IP Assignment: Transfer of invention rights to employer. Negotiate carve-outs for side projects.',
      'Constructive Termination: Significant adverse changes to role that allow resignation with benefits.',
      'WARN Act: Federal law requiring 60 days notice for mass layoffs. Affects severance calculations.'
    ],
    budgetConsiderations: [
      'Attorney review: $500-$2,000 for employment contract (executive: $2,000-$5,000)',
      'Relocation costs: Negotiate full coverage or $10,000-$50,000 lump sum',
      'Lost equity from previous job: Calculate vesting schedule impact, ask for replacement',
      'Health insurance gap: COBRA costs can exceed $2,000/month, negotiate coverage or reimbursement',
      'Tax implications of sign-on bonus: Plan for 40-50% withholding in high-tax states'
    ],
    jurisdictionNotes: [
      'California: Non-competes generally unenforceable except for sale of business',
      'New York: Garden leave must include full salary and benefits continuation',
      'Massachusetts: Non-competes limited to 1 year, must compensate during restriction period',
      'Texas: Non-competes must be ancillary to employment agreement and reasonable in scope',
      'Colorado: Extreme restrictions on non-competes, wage disclosure requirements'
    ],
    commonMistakes: [
      'Accepting verbal promises without written confirmation in contract',
      'Not calculating total comp including equity value over vesting period',
      'Signing without understanding restrictive covenants (non-compete, non-solicit)',
      'Failing to negotiate before accepting - acceptance ends negotiation leverage',
      'Ignoring benefits value - health insurance can be worth $15k-$25k annually',
      'Not reviewing stock option details - strike price, valuation, exercise terms matter',
      'Accepting "standard" contract without pushing back - everything is negotiable'
    ],
    checklist: [
      '☐ Request offer in writing before resigning current position',
      '☐ Calculate total compensation over 4 years including equity',
      '☐ Research market rates for role, experience level, and location',
      '☐ Review restrictive covenants (non-compete, non-solicit, IP assignment)',
      '☐ Verify equity details (percentage, valuation, vesting, acceleration)',
      '☐ Confirm remote work arrangements and location requirements',
      '☐ Negotiate severance package and termination terms',
      '☐ Clarify performance review schedule and promotion path',
      '☐ Verify benefits (health, 401k match, PTO, parental leave)',
      '☐ Get attorney review before signing (recommended)',
      '☐ Ensure all negotiated terms appear in final written contract',
      '☐ Keep copy of all offer letters and negotiation correspondence'
    ]
  },
  {
    id: 'saas',
    title: 'SaaS Agreement Optimization',
    category: 'Technology',
    icon: <Code className="w-5 h-5" />,
    description: 'Navigate software licensing, data ownership, and vendor lock-in with confidence.',
    difficulty: 'Advanced',
    estimatedTime: '45 min',
    keyTactics: [
      'Negotiate annual payment terms with discounts',
      'Request data export rights and formats',
      'Cap annual price increases (3-5%)',
      'Demand clear SLA with penalties',
      'Negotiate exit clauses without penalties'
    ],
    redFlags: [
      'Automatic renewal with no opt-out window',
      'Vendor ownership of your data',
      'Unlimited price increase clauses',
      'No SLA or uptime guarantees',
      'Mandatory arbitration in vendor jurisdiction'
    ],
    steps: [
      {
        title: 'Understand Usage Needs',
        description: 'Calculate actual user count, storage, and feature requirements.',
        action: 'Document current and 12-month projected usage'
      },
      {
        title: 'Review Data Terms',
        description: 'Ensure you retain ownership and can export data anytime.',
        action: 'Verify data portability and deletion clauses'
      },
      {
        title: 'Negotiate Pricing',
        description: 'Request volume discounts and annual payment benefits.',
        action: 'Ask for 15-20% discount for annual prepayment'
      },
      {
        title: 'Secure SLA Commitments',
        description: 'Define uptime guarantees and remedies for breaches.',
        action: 'Negotiate 99.9% uptime with service credits'
      },
      {
        title: 'Plan Your Exit',
        description: 'Ensure smooth transition if you need to switch vendors.',
        action: 'Clarify data export process and transition assistance'
      }
    ],
    proTips: [
      'Annual contracts often get 20-30% discounts vs monthly',
      'Negotiate price caps for the next 2-3 renewal periods',
      'Ask for implementation and training to be included',
      'Request custom contract instead of accepting standard ToS',
      'Get commitments for new features in writing'
    ]
  },
  {
    id: 'freelance',
    title: 'Freelance Contract Strategy',
    category: 'Freelance',
    icon: <Users className="w-5 h-5" />,
    description: 'Protect your rights, ensure payment, and set clear boundaries as an independent contractor.',
    difficulty: 'Beginner',
    estimatedTime: '20 min',
    keyTactics: [
      'Require 50% upfront for new clients',
      'Specify exact scope to prevent scope creep',
      'Include rush fee clauses for urgent work',
      'Retain copyright until full payment',
      'Define revision limits clearly'
    ],
    redFlags: [
      'Payment only upon project completion',
      'Unlimited revisions included',
      'Client owns all work before payment',
      'Vague deliverable descriptions',
      'Net 90 or longer payment terms'
    ],
    steps: [
      {
        title: 'Define Scope Precisely',
        description: 'List exact deliverables, file formats, and revision rounds.',
        action: 'Create detailed scope of work document'
      },
      {
        title: 'Set Payment Terms',
        description: 'Specify deposit amount, milestones, and final payment.',
        action: 'Structure 50% upfront, 50% on delivery for small projects'
      },
      {
        title: 'Establish Timeline',
        description: 'Set realistic deadlines with buffer for client feedback.',
        action: 'Create project timeline with client approval checkpoints'
      },
      {
        title: 'Address IP Rights',
        description: 'Clarify when ownership transfers (usually after full payment).',
        action: 'Include clause: "Copyright transfers upon receipt of final payment"'
      },
      {
        title: 'Add Kill Fee Clause',
        description: 'Protect yourself if client cancels mid-project.',
        action: 'Specify 50% kill fee for cancellations after work begins'
      }
    ],
    proTips: [
      'Use contracts even for small projects - they set expectations',
      'Require deposits before starting work (no exceptions)',
      'Define "business days" for response times (excludes weekends)',
      'Add late payment fees (1.5% per month is standard)',
      'Keep copyright until fully paid to ensure leverage'
    ]
  },
  {
    id: 'lease',
    title: 'Commercial Lease Negotiation',
    category: 'Real Estate',
    icon: <Home className="w-5 h-5" />,
    description: 'Secure favorable terms for office or retail space while minimizing long-term risks.',
    difficulty: 'Advanced',
    estimatedTime: '60 min',
    keyTactics: [
      'Negotiate tenant improvement allowance',
      'Request 3-6 month rent abatement for buildout',
      'Cap annual rent increases (CPI or 3%)',
      'Include early termination option with penalty',
      'Clarify common area maintenance charges'
    ],
    redFlags: [
      'Personal guarantee required',
      'No sublease or assignment rights',
      'Triple net lease without cap on expenses',
      'Automatic renewal without notice period',
      'Landlord discretion on unreasonable use restrictions'
    ],
    steps: [
      {
        title: 'Calculate Total Occupancy Cost',
        description: 'Add base rent, CAM, utilities, insurance, and taxes.',
        action: 'Request historical CAM charges for past 3 years'
      },
      {
        title: 'Negotiate Rent-Free Period',
        description: 'Request abatement to cover construction and ramp-up time.',
        action: 'Ask for 1 month free per year of lease term'
      },
      {
        title: 'Review Use Restrictions',
        description: 'Ensure permitted uses cover all your business activities.',
        action: 'Confirm your specific business use is explicitly allowed'
      },
      {
        title: 'Understand Maintenance Obligations',
        description: 'Clarify what landlord vs tenant maintains and repairs.',
        action: 'Negotiate for landlord to cover HVAC and structural repairs'
      },
      {
        title: 'Plan Your Exit Strategy',
        description: 'Negotiate sublease rights and early termination options.',
        action: 'Include termination option after year 3 with 6-month notice'
      }
    ],
    proTips: [
      'Everything is negotiable - especially in soft markets',
      'Avoid personal guarantees by offering higher security deposit',
      'Request audit rights for CAM and tax charges',
      'Negotiate caps on landlord\'s operating expenses pass-through',
      'Get tenant improvement work done by landlord (not cash allowance)'
    ]
  },
  {
    id: 'vendor',
    title: 'Vendor Agreement Mastery',
    category: 'Business',
    icon: <Scale className="w-5 h-5" />,
    description: 'Manage supplier relationships, ensure quality, and protect your business interests.',
    difficulty: 'Intermediate',
    estimatedTime: '40 min',
    keyTactics: [
      'Include quality standards and inspection rights',
      'Negotiate volume-based pricing tiers',
      'Require liability insurance and indemnification',
      'Set clear delivery timelines with penalties',
      'Include termination for convenience clause'
    ],
    redFlags: [
      'No warranties on products or services',
      'Vendor can change prices without notice',
      'Exclusive supplier relationship required',
      'No recourse for late or defective deliveries',
      'Automatic renewal with long notice period'
    ],
    steps: [
      {
        title: 'Define Quality Standards',
        description: 'Specify exact product specs, tolerances, and acceptance criteria.',
        action: 'Create detailed product specification document'
      },
      {
        title: 'Negotiate Pricing Structure',
        description: 'Establish volume discounts and price lock periods.',
        action: 'Request tiered pricing: 5% off at 100 units, 10% at 500 units'
      },
      {
        title: 'Set Delivery Terms',
        description: 'Define lead times, shipping responsibilities, and late penalties.',
        action: 'Include liquidated damages for deliveries over 7 days late'
      },
      {
        title: 'Address Defects and Returns',
        description: 'Establish warranty period and return process for defective goods.',
        action: 'Negotiate 30-day return window for defects with full refund'
      },
      {
        title: 'Plan for Termination',
        description: 'Include exit clauses without lengthy commitments.',
        action: 'Request termination for convenience with 60-day notice'
      }
    ],
    proTips: [
      'Request net 60 or net 90 payment terms for better cash flow',
      'Negotiate early payment discounts (2% for net 10)',
      'Include vendor liability for consequential damages',
      'Require vendor to maintain minimum liability insurance',
      'Reserve right to audit vendor\'s quality processes'
    ]
  },
  {
    id: 'partnership',
    title: 'Partnership Agreement Framework',
    category: 'Business',
    icon: <Target className="w-5 h-5" />,
    description: 'Structure fair, balanced partnerships that prevent future disputes and align incentives.',
    difficulty: 'Advanced',
    estimatedTime: '90 min',
    keyTactics: [
      'Define equity split based on contributions',
      'Include vesting schedules for all founders',
      'Establish clear decision-making authority',
      'Create buy-sell provisions for exits',
      'Address intellectual property ownership'
    ],
    redFlags: [
      'No vesting on founder equity',
      'Unclear decision-making process',
      'No exit or dissolution provisions',
      'Equal split without considering contributions',
      'Missing IP assignment clauses'
    ],
    steps: [
      {
        title: 'Determine Equity Allocation',
        description: 'Consider capital, sweat equity, expertise, and risk.',
        action: 'Use framework: 33% idea, 33% execution, 33% capital'
      },
      {
        title: 'Implement Vesting Schedule',
        description: 'Protect against partners leaving early with full equity.',
        action: 'Standard 4-year vest with 1-year cliff for all partners'
      },
      {
        title: 'Define Roles and Authority',
        description: 'Clarify who makes what decisions and spending limits.',
        action: 'List major decisions requiring unanimous vs majority vote'
      },
      {
        title: 'Create Exit Mechanisms',
        description: 'Plan for voluntary departures, termination, and buyouts.',
        action: 'Include right of first refusal and shotgun clause'
      },
      {
        title: 'Address Intellectual Property',
        description: 'Ensure all IP created belongs to the partnership/company.',
        action: 'All partners sign IP assignment agreement'
      }
    ],
    proTips: [
      'Unequal splits often work better than 50/50 (avoid deadlock)',
      'Have "the tough conversations" before signing, not after',
      'Include drag-along and tag-along rights for future sales',
      'Define what happens if partner becomes disabled or dies',
      'Revisit and adjust equity annually based on contributions'
    ]
  }
];

export default function Playbooks() {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tactics' | 'redflags' | 'steps' | 'legal' | 'scripts' | 'checklist'>('overview');

  const categories = [...new Set(playbooks.map(p => p.category))];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  if (selectedPlaybook) {
    return (
      <div className="min-h-screen bg-stone-50">
        {/* Header */}
        <div className="bg-white border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <button
              onClick={() => setSelectedPlaybook(null)}
              className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-900 mb-4 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to all playbooks
            </button>
            
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-stone-900 rounded-xl flex items-center justify-center text-white">
                  {selectedPlaybook.icon}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-stone-900">{selectedPlaybook.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(selectedPlaybook.difficulty)}`}>
                      {selectedPlaybook.difficulty}
                    </span>
                  </div>
                  <p className="text-stone-600">{selectedPlaybook.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-sm text-stone-500">📚 {selectedPlaybook.category}</span>
                    <span className="text-sm text-stone-500">⏱️ {selectedPlaybook.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 mt-6 border-b border-stone-200 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === 'overview' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Overview
                {activeTab === 'overview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />}
              </button>
              <button
                onClick={() => setActiveTab('tactics')}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === 'tactics' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Key Tactics
                {activeTab === 'tactics' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />}
              </button>
              <button
                onClick={() => setActiveTab('redflags')}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === 'redflags' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Red Flags
                {activeTab === 'redflags' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />}
              </button>
              <button
                onClick={() => setActiveTab('steps')}
                className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
                  activeTab === 'steps' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Step-by-Step
                {activeTab === 'steps' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />}
              </button>
              {selectedPlaybook.legalConcepts && selectedPlaybook.legalConcepts.length > 0 && (
                <button
                  onClick={() => setActiveTab('legal')}
                  className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'legal' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Legal Concepts
                  {activeTab === 'legal' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />}
                </button>
              )}
              {selectedPlaybook.negotiationScripts && selectedPlaybook.negotiationScripts.length > 0 && (
                <button
                  onClick={() => setActiveTab('scripts')}
                  className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'scripts' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Scripts
                  {activeTab === 'scripts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />}
                </button>
              )}
              {selectedPlaybook.checklist && selectedPlaybook.checklist.length > 0 && (
                <button
                  onClick={() => setActiveTab('checklist')}
                  className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${
                    activeTab === 'checklist' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Checklist
                  {activeTab === 'checklist' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Pro Tips
                </h3>
                <div className="space-y-3">
                  {selectedPlaybook.proTips.map((tip, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-xs font-semibold text-stone-700">
                        {index + 1}
                      </div>
                      <p className="text-sm text-stone-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-stone-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-stone-500 mb-1">Difficulty Level</div>
                    <div className="text-lg font-semibold text-stone-900">{selectedPlaybook.difficulty}</div>
                  </div>
                  <div>
                    <div className="text-sm text-stone-500 mb-1">Estimated Time</div>
                    <div className="text-lg font-semibold text-stone-900">{selectedPlaybook.estimatedTime}</div>
                  </div>
                  <div>
                    <div className="text-sm text-stone-500 mb-1">Key Tactics</div>
                    <div className="text-lg font-semibold text-stone-900">{selectedPlaybook.keyTactics.length} strategies</div>
                  </div>
                  <div>
                    <div className="text-sm text-stone-500 mb-1">Steps to Success</div>
                    <div className="text-lg font-semibold text-stone-900">{selectedPlaybook.steps.length} actionable steps</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tactics' && (
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Key Negotiation Tactics
              </h3>
              <div className="space-y-3">
                {selectedPlaybook.keyTactics.map((tactic, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-stone-900">{tactic}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'redflags' && (
            <div className="bg-white border border-stone-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Red Flags to Watch For
              </h3>
              <div className="space-y-3">
                {selectedPlaybook.redFlags.map((flag, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-stone-900">{flag}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-4">
              {selectedPlaybook.steps.map((step, index) => (
                <div key={index} className="bg-white border border-stone-200 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-stone-900 text-white rounded-lg flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-stone-900 mb-2">{step.title}</h4>
                      <p className="text-sm text-stone-600 mb-3">{step.description}</p>
                      
                      <div className="space-y-3">
                        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3">
                          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Action Item</div>
                          <p className="text-sm text-stone-900">{step.action}</p>
                        </div>
                        
                        {step.legalRationale && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                              <Scale className="w-3 h-3" />
                              Legal Rationale
                            </div>
                            <p className="text-sm text-blue-900">{step.legalRationale}</p>
                          </div>
                        )}
                        
                        {step.sampleLanguage && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                            <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              Sample Language
                            </div>
                            <p className="text-sm text-purple-900 italic">"{step.sampleLanguage}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'legal' && selectedPlaybook.legalConcepts && (
            <div className="space-y-6">
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-600" />
                  Legal Concepts & Terminology
                </h3>
                <div className="space-y-4">
                  {selectedPlaybook.legalConcepts.map((concept, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
                      <p className="text-sm text-stone-900 leading-relaxed">{concept}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPlaybook.jurisdictionNotes && selectedPlaybook.jurisdictionNotes.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    Jurisdiction-Specific Notes
                  </h3>
                  <div className="space-y-3">
                    {selectedPlaybook.jurisdictionNotes.map((note, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <MapPin className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-stone-900">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedPlaybook.budgetConsiderations && selectedPlaybook.budgetConsiderations.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Budget Considerations
                  </h3>
                  <div className="space-y-3">
                    {selectedPlaybook.budgetConsiderations.map((item, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-stone-900">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'scripts' && selectedPlaybook.negotiationScripts && (
            <div className="space-y-6">
              <div className="bg-white border border-stone-200 rounded-xl p-6 mb-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">
                    <strong>Pro Tip:</strong> These scripts are starting points. Adapt the tone, pacing, and specific details to match your personality and situation. Authenticity beats perfect wording every time.
                  </p>
                </div>
              </div>

              {selectedPlaybook.negotiationScripts.map((script, index) => (
                <div key={index} className="bg-white border border-stone-200 rounded-xl p-6">
                  <div className="mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-900 text-white rounded-full text-xs font-semibold mb-3">
                      <MessageSquare className="w-3 h-3" />
                      Scenario {index + 1}
                    </div>
                    <h4 className="text-lg font-semibold text-stone-900">{script.situation}</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="border-l-4 border-green-600 pl-4 py-2 bg-green-50">
                      <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Opening</div>
                      <p className="text-sm text-stone-900">"{script.opening}"</p>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-4 py-2 bg-blue-50">
                      <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Your Response</div>
                      <p className="text-sm text-stone-900">"{script.response}"</p>
                    </div>

                    <div className="border-l-4 border-purple-600 pl-4 py-2 bg-purple-50">
                      <div className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Closing</div>
                      <p className="text-sm text-stone-900">"{script.closing}"</p>
                    </div>
                  </div>
                </div>
              ))}

              {selectedPlaybook.caseExamples && selectedPlaybook.caseExamples.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    Real-World Examples
                  </h3>
                  <div className="space-y-4">
                    {selectedPlaybook.caseExamples.map((example, index) => (
                      <div key={index} className="border border-stone-200 rounded-lg p-4">
                        <div className="mb-3">
                          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">Scenario</div>
                          <p className="text-sm text-stone-700">{example.scenario}</p>
                        </div>
                        <div className="mb-3">
                          <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Outcome</div>
                          <p className="text-sm text-green-900">{example.outcome}</p>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded p-3">
                          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">Key Lesson</div>
                          <p className="text-sm text-amber-900">{example.lesson}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'checklist' && selectedPlaybook.checklist && (
            <div className="space-y-6">
              <div className="bg-white border border-stone-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    Pre-Signing Checklist
                  </h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm rounded-lg hover:bg-stone-800 transition-colors">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedPlaybook.checklist.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 hover:bg-stone-50 rounded-lg transition-colors border border-transparent hover:border-stone-200">
                      <div className="flex-shrink-0 w-5 h-5 border-2 border-stone-300 rounded mt-0.5"></div>
                      <p className="text-sm text-stone-900">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPlaybook.commonMistakes && selectedPlaybook.commonMistakes.length > 0 && (
                <div className="bg-white border border-stone-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-stone-900 mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    Common Mistakes to Avoid
                  </h3>
                  <div className="space-y-3">
                    {selectedPlaybook.commonMistakes.map((mistake, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          ✕
                        </span>
                        <p className="text-sm text-red-900">{mistake}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Negotiation Playbooks</h1>
          </div>
          <p className="text-xl text-stone-300 max-w-3xl">
            Master contract negotiation with battle-tested strategies, tactical frameworks, and step-by-step guidance for every scenario.
          </p>
          <div className="flex gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">{playbooks.length}</div>
              <div className="text-sm text-stone-400">Expert Playbooks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{categories.length}</div>
              <div className="text-sm text-stone-400">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-stone-400">Tactics & Tips</div>
            </div>
          </div>
        </div>
      </div>

      {/* Playbooks Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playbooks.map((playbook) => (
            <div
              key={playbook.id}
              onClick={() => setSelectedPlaybook(playbook)}
              className="bg-white border border-stone-200 rounded-xl p-6 hover:border-stone-900 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-stone-100 rounded-lg flex items-center justify-center text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  {playbook.icon}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(playbook.difficulty)}`}>
                  {playbook.difficulty}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-stone-900 mb-2 group-hover:text-stone-900">
                {playbook.title}
              </h3>
              <p className="text-sm text-stone-600 mb-4 line-clamp-2">{playbook.description}</p>
              
              <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
                <span>⏱️ {playbook.estimatedTime}</span>
                <span>📚 {playbook.category}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <div className="text-xs text-stone-500">
                  {playbook.steps.length} steps • {playbook.keyTactics.length} tactics
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
