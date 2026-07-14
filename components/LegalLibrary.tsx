'use client';

import { BookOpen, FileText, Scale, AlertTriangle, Shield, Briefcase, Target, TrendingUp, Users, Gavel } from 'lucide-react';

const libraryCategories = [
  {
    id: 'contract-types',
    title: 'Contract Types',
    description: 'Understanding different contract categories and their purposes',
    icon: FileText,
    items: [
      { name: 'Employment Contracts', description: 'Full-time, part-time, and contractor agreements defining work relationship, compensation, benefits, and termination terms', riskLevel: 'Medium' },
      { name: 'Service Agreements', description: 'Freelance and consulting contracts outlining scope of work, deliverables, payment terms, and IP ownership', riskLevel: 'Low' },
      { name: 'Lease Agreements', description: 'Residential and commercial property rentals including rent terms, maintenance responsibilities, and renewal options', riskLevel: 'High' },
      { name: 'SaaS Agreements', description: 'Software as a Service terms covering usage rights, data ownership, uptime guarantees, and liability limitations', riskLevel: 'Medium' },
      { name: 'Non-Disclosure Agreements', description: 'Confidentiality agreements protecting sensitive business information and trade secrets', riskLevel: 'Medium' },
      { name: 'Partnership Agreements', description: 'Business partnership terms defining equity split, responsibilities, decision-making, and exit strategies', riskLevel: 'High' },
      { name: 'Vendor Agreements', description: 'Supplier contracts specifying product/service delivery, quality standards, and payment terms', riskLevel: 'Low' },
      { name: 'License Agreements', description: 'Rights to use intellectual property, software, or branded materials with usage restrictions', riskLevel: 'Medium' },
      { name: 'Independent Contractor Agreements', description: '1099 worker contracts defining project scope, payment, and clarifying non-employee status', riskLevel: 'Medium' },
      { name: 'Franchise Agreements', description: 'Rights to operate business under established brand with ongoing fees and operational requirements', riskLevel: 'High' },
      { name: 'Distribution Agreements', description: 'Terms for selling or distributing products in specific territories or markets', riskLevel: 'Medium' },
      { name: 'Joint Venture Agreements', description: 'Collaboration between parties for specific project with shared risks and rewards', riskLevel: 'High' }
    ]
  },
  {
    id: 'legal-terms',
    title: 'Legal Terms Glossary',
    description: 'Common legal terminology decoded into plain language',
    icon: BookOpen,
    items: [
      { name: 'Indemnification', description: 'One party agrees to compensate another for losses or damages. Critical clause determining who pays if something goes wrong or lawsuits arise', riskLevel: 'High' },
      { name: 'Liability Cap', description: 'Maximum financial responsibility one party has. Often limited to fees paid or specific dollar amount to protect against unlimited damages', riskLevel: 'Medium' },
      { name: 'Force Majeure', description: 'Unforeseeable events (natural disasters, wars, pandemics) that excuse contract performance without penalty', riskLevel: 'Low' },
      { name: 'Intellectual Property (IP)', description: 'Rights to creations, inventions, designs, and proprietary information. Defines who owns work created under contract', riskLevel: 'High' },
      { name: 'Termination for Convenience', description: 'Right to end contract without cause, usually with notice period. May require paying fees or completing obligations', riskLevel: 'Medium' },
      { name: 'Arbitration', description: 'Dispute resolution outside court system. Binding decision by neutral third party, often faster but limits appeal rights', riskLevel: 'Medium' },
      { name: 'Severability', description: 'If one contract clause is invalid, rest of contract remains enforceable. Prevents entire agreement from failing', riskLevel: 'Low' },
      { name: 'Governing Law', description: 'Which state or country laws apply to contract interpretation and disputes. Can significantly impact your rights', riskLevel: 'Medium' },
      { name: 'Entire Agreement Clause', description: 'Contract represents complete agreement, superseding all prior discussions. Verbal promises may not be enforceable', riskLevel: 'Medium' },
      { name: 'Warranty', description: 'Guarantee that product or service meets certain standards. Breach allows for remedies like refunds or damages', riskLevel: 'Medium' },
      { name: 'Consideration', description: 'Something of value exchanged between parties. Required for valid contract (money, services, promises)', riskLevel: 'Low' },
      { name: 'Material Breach', description: 'Serious contract violation affecting core agreement. Allows injured party to terminate and seek damages', riskLevel: 'High' },
      { name: 'Assignment', description: 'Transferring contract rights or obligations to third party. Often restricted without consent', riskLevel: 'Medium' },
      { name: 'Waiver', description: 'Voluntarily giving up known right. Not enforcing clause once does not mean waiving it permanently', riskLevel: 'Medium' },
      { name: 'Survival Clause', description: 'Provisions that continue after contract ends (confidentiality, IP rights, indemnification)', riskLevel: 'Medium' },
      { name: 'Cure Period', description: 'Time allowed to fix breach before termination or penalties. Usually 15-30 days notice required', riskLevel: 'Low' }
    ]
  },
  {
    id: 'red-flags',
    title: 'Common Red Flags',
    description: 'Warning signs to watch for in contracts',
    icon: AlertTriangle,
    items: [
      { name: 'Unlimited Liability', description: 'No cap on damages you could owe. A single mistake could bankrupt you. Always negotiate liability caps', riskLevel: 'High' },
      { name: 'Auto-Renewal Without Notice', description: 'Contract automatically extends without warning. Locks you in for years. Insist on 60-90 day renewal notices', riskLevel: 'High' },
      { name: 'Broad IP Transfer', description: 'All work created belongs to other party, even unrelated to project. Negotiate to limit IP transfer to specific deliverables', riskLevel: 'High' },
      { name: 'One-Sided Termination', description: 'Only one party can end agreement. You are locked in while they can exit freely. Demand mutual termination rights', riskLevel: 'High' },
      { name: 'Inconvenient Venue', description: 'Must litigate in distant jurisdiction. Makes legal action impractical. Push for neutral or mutual jurisdiction', riskLevel: 'Medium' },
      { name: 'Waiver of Jury Trial', description: 'Give up right to jury, must use judge or arbitration. Limits legal options and appeal rights', riskLevel: 'High' },
      { name: 'No Limitation of Liability', description: 'Other party accepts no responsibility for damages. You bear all risk. Negotiate balanced liability terms', riskLevel: 'High' },
      { name: 'Perpetual Confidentiality', description: 'Information stays secret forever, even after contract ends. Can prevent discussing work or using skills', riskLevel: 'Medium' },
      { name: 'Unilateral Amendment Rights', description: 'Other party can change terms anytime without consent. You must accept or lose service', riskLevel: 'High' },
      { name: 'Mandatory Bundled Services', description: 'Forced to buy unwanted services to get what you need. Inflates costs unnecessarily', riskLevel: 'Medium' },
      { name: 'Payment Net 90+ Days', description: 'Wait 3+ months for payment. Cash flow killer for small businesses. Negotiate 30-day terms', riskLevel: 'Medium' },
      { name: 'Non-Compete Exceeding 1 Year', description: 'Prevents working in industry for years after contract ends. Can destroy career opportunities', riskLevel: 'High' },
      { name: 'Unclear Scope Definition', description: 'Vague deliverables allow unlimited demands. "Additional tasks as needed" is a trap', riskLevel: 'High' },
      { name: 'Unreasonable Insurance Requirements', description: 'Demands expensive insurance policies beyond industry norms. Can be cost-prohibitive', riskLevel: 'Medium' },
      { name: 'Personal Guarantee Required', description: 'Your personal assets at risk for business contract. Puts home, savings at stake', riskLevel: 'High' }
    ]
  },
  {
    id: 'protections',
    title: 'Protective Clauses',
    description: 'Clauses that protect your interests',
    icon: Shield,
    items: [
      { name: 'Capped Liability', description: 'Limits maximum damages to contract value or specific amount. Prevents catastrophic financial loss', riskLevel: 'Low' },
      { name: 'Right to Cure', description: '30-day notice required before termination for breach. Allows opportunity to fix issues and preserve relationship', riskLevel: 'Low' },
      { name: 'Mutual Confidentiality', description: 'Both parties protect sensitive information equally. Balanced protection for trade secrets', riskLevel: 'Low' },
      { name: 'Termination for Cause', description: 'Can exit if other party materially breaches. Protects against non-payment or poor performance', riskLevel: 'Low' },
      { name: 'Clear Payment Terms', description: 'Specific amounts, due dates, and late payment penalties. Prevents payment disputes', riskLevel: 'Low' },
      { name: 'Defined Scope of Work', description: 'Precise deliverables and deadlines. Prevents scope creep and unlimited demands', riskLevel: 'Low' },
      { name: 'Mutual Termination Rights', description: 'Either party can exit with proper notice. Prevents being locked in indefinitely', riskLevel: 'Low' },
      { name: 'Mediation Before Litigation', description: 'Required attempt to resolve disputes amicably. Saves legal costs and time', riskLevel: 'Low' },
      { name: 'Limited IP Assignment', description: 'Transfer only specifically created work, retain prior IP. Protects existing portfolio', riskLevel: 'Low' },
      { name: 'Mutual Indemnification', description: 'Both parties protect each other from third-party claims. Balanced risk allocation', riskLevel: 'Medium' },
      { name: 'Independent Contractor Status', description: 'Clarifies non-employee relationship. Protects from unexpected tax liabilities', riskLevel: 'Low' },
      { name: 'Audit Rights', description: 'Right to verify accuracy of payments or usage reports. Ensures fair dealing', riskLevel: 'Low' },
      { name: 'Change Order Process', description: 'Formal procedure for modifying scope with price adjustments. Prevents free extra work', riskLevel: 'Low' },
      { name: 'Warranty Limitations', description: 'Clear bounds on guarantees (90 days, normal use). Prevents unlimited warranty claims', riskLevel: 'Medium' },
      { name: 'Data Ownership Clause', description: 'Clarifies you own your data, can export it. Prevents vendor lock-in', riskLevel: 'Low' }
    ]
  },
  {
    id: 'negotiation-tips',
    title: 'Negotiation Strategies',
    description: 'Practical tactics for improving contract terms',
    icon: Target,
    items: [
      { name: 'Never Accept First Draft', description: 'Initial contracts favor the drafter. Always propose changes. Even small edits show you review carefully', riskLevel: 'Low' },
      { name: 'Bundle Requests', description: 'Ask for multiple changes at once rather than one by one. Increases likelihood of getting most important terms', riskLevel: 'Low' },
      { name: 'Use Precedent', description: 'Reference industry standards or past agreements. "This is standard in our industry" carries weight', riskLevel: 'Low' },
      { name: 'Red-Line Clearly', description: 'Track changes visibly. Makes review process faster and shows professionalism', riskLevel: 'Low' },
      { name: 'Focus on Deal-Breakers First', description: 'Identify must-have terms before negotiating. Know when to walk away', riskLevel: 'Medium' },
      { name: 'Request Mutual Terms', description: 'If they require something, ask for same protection. "We will add mutual confidentiality"', riskLevel: 'Low' },
      { name: 'Set Caps and Limits', description: 'Propose specific numbers for liability, fees, duration. Unlimited anything is dangerous', riskLevel: 'Medium' },
      { name: 'Build in Flexibility', description: 'Add review periods, escalation clauses, termination rights. Business needs change', riskLevel: 'Low' },
      { name: 'Document Verbal Agreements', description: 'Get promises in writing through email confirmation. Verbal assurances are not enforceable', riskLevel: 'Medium' },
      { name: 'Use Timeouts Strategically', description: 'Take time to review complex terms. Rushed decisions lead to bad deals', riskLevel: 'Low' },
      { name: 'Propose Alternative Language', description: 'Don not just cross out terms, offer replacement text. Shows good faith negotiation', riskLevel: 'Low' },
      { name: 'Know Your BATNA', description: 'Best Alternative To Negotiated Agreement. Knowing options gives negotiating power', riskLevel: 'Low' }
    ]
  },
  {
    id: 'industry-guidance',
    title: 'Industry-Specific Considerations',
    description: 'Special contract issues by sector',
    icon: Briefcase,
    items: [
      { name: 'Tech/SaaS: Data Privacy', description: 'GDPR, CCPA compliance critical. Data processing agreements, breach notification, data residency requirements', riskLevel: 'High' },
      { name: 'Creative: Work for Hire', description: 'Copyright ownership crucial. Specify whether creator retains rights or transfers all IP to client', riskLevel: 'High' },
      { name: 'Healthcare: HIPAA Compliance', description: 'Protected health information requires Business Associate Agreements. Strict security and privacy obligations', riskLevel: 'High' },
      { name: 'Real Estate: Title Issues', description: 'Ensure clean title, survey accuracy, zoning compliance. Include contingencies for inspection, financing', riskLevel: 'High' },
      { name: 'Construction: Change Orders', description: 'Formal process for scope changes with price adjustments. Progress payments tied to milestones', riskLevel: 'Medium' },
      { name: 'Finance: Regulatory Compliance', description: 'Securities laws, banking regulations, anti-money laundering. Heavy penalties for violations', riskLevel: 'High' },
      { name: 'Manufacturing: Quality Standards', description: 'Specify defect rates, testing procedures, warranty terms. Product liability indemnification', riskLevel: 'Medium' },
      { name: 'Retail: Return Policies', description: 'Clear terms for defective products, restocking fees, seasonal returns. Consumer protection laws apply', riskLevel: 'Low' },
      { name: 'Consulting: Scope Creep', description: 'Precise deliverables, hourly rates, expense policies. Change order process for additional work', riskLevel: 'Medium' },
      { name: 'Education: Student Privacy', description: 'FERPA compliance for student records. Parental consent requirements for minors', riskLevel: 'High' },
      { name: 'Food Service: Health Regulations', description: 'FDA, local health department compliance. Liability for foodborne illness, allergen warnings', riskLevel: 'High' },
      { name: 'Transportation: Carrier Liability', description: 'Cargo loss/damage limits, delivery guarantees, insurance requirements. Bill of lading terms', riskLevel: 'Medium' }
    ]
  },
  {
    id: 'common-clauses',
    title: 'Standard Contract Clauses Explained',
    description: 'Understanding typical contract provisions',
    icon: Gavel,
    items: [
      { name: 'Integration Clause', description: 'Contract is complete agreement, no side deals valid. Prevents verbal promises from being enforceable', riskLevel: 'Medium' },
      { name: 'Notice Provisions', description: 'How and where to send legal notices. Usually certified mail to specified addresses. Email may not be sufficient', riskLevel: 'Low' },
      { name: 'Counterparts Clause', description: 'Multiple signed copies all equally valid. Allows signing separate copies rather than passing one document', riskLevel: 'Low' },
      { name: 'Force Majeure', description: 'Excuses performance during unforeseeable events. May not cover financial hardship or market changes', riskLevel: 'Low' },
      { name: 'Attorney Fees Provision', description: 'Who pays legal costs if dispute arises. "Prevailing party" clause makes loser pay both sides', riskLevel: 'Medium' },
      { name: 'Relationship of Parties', description: 'Clarifies no partnership, agency, or employment created. Important for tax and liability purposes', riskLevel: 'Low' },
      { name: 'Further Assurances', description: 'Parties will sign additional documents if needed. Helps enforce agreement and transfer rights', riskLevel: 'Low' },
      { name: 'Successors and Assigns', description: 'Contract binds future owners or heirs. Important if business sold or inherited', riskLevel: 'Low' },
      { name: 'Amendment Procedure', description: 'Changes must be in writing, signed by both parties. Prevents unauthorized modifications', riskLevel: 'Low' },
      { name: 'Execution in Counterparts', description: 'Each signature page considered original. Facilitates remote signing and faster execution', riskLevel: 'Low' },
      { name: 'Time is of the Essence', description: 'Deadlines are critical, not flexible. Missing deadline is material breach', riskLevel: 'Medium' },
      { name: 'No Third-Party Beneficiaries', description: 'Only parties to contract can enforce it. Prevents customers or others from suing', riskLevel: 'Low' }
    ]
  }
];

export default function LegalLibrary() {
  const getRiskColor = (level: string) => {
    if (level === 'High') return 'text-red-600 bg-red-50';
    if (level === 'Medium') return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="w-full px-12 py-16">
      {/* Header */}
      <div className="mb-16">
        <div className="mb-4">
          <span className="mono text-xs text-stone-500 tracking-wider uppercase">Legal Knowledge Base</span>
        </div>
        <h1 className="text-6xl font-bold text-stone-900 mb-6 leading-tight">Legal Library</h1>
        <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
          Comprehensive guides, definitions, and resources to help you understand contract terminology, identify risks, and protect your interests. Everything you need to negotiate with confidence.
        </p>
      </div>

      {/* Categories */}
      {libraryCategories.map((category) => {
        const Icon = category.icon;

        return (
          <div key={category.id} id={category.id} className="mb-20 scroll-mt-24">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-8 h-8 text-stone-900" />
                <h2 className="text-3xl font-bold text-stone-900">{category.title}</h2>
              </div>
              <p className="text-base text-stone-600">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="bg-white border border-stone-300 p-6 hover:shadow-lg hover:border-stone-900 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-stone-900 pr-2">{item.name}</h3>
                    <span className={`mono text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${getRiskColor(item.riskLevel)}`}>
                      {item.riskLevel}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* CTA */}
      <div className="bg-stone-900 text-white p-12 mt-16 dark-section-pattern">
        <div className="max-w-3xl mx-auto text-center">
          <Scale className="w-16 h-16 mx-auto mb-6 text-stone-300" />
          <h3 className="text-4xl font-bold mb-4">Ready to Analyze Your Contract?</h3>
          <p className="text-xl text-stone-300 leading-relaxed mb-8">
            Use our AI-powered analysis to identify risks, understand clauses, and get specific negotiation recommendations tailored to your contract.
          </p>
          <a
            href="/analyze"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-stone-900 font-medium hover:bg-stone-100 transition-colors"
          >
            Start Free Analysis
          </a>
        </div>
      </div>
    </div>
  );
}
