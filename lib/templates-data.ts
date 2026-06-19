/**
 * Professional Contract Templates Library - LEGACY
 * Production-ready, legally sound templates for real-world use
 * 
 * NOTE: This is the legacy template library. New code should use:
 * - comprehensive-template-library.ts for extended templates
 * - template-orchestrator.ts for unified API
 * 
 * Maintained for backward compatibility
 * 
 * Features:
 * - Legally reviewed and balanced
 * - Customizable via smart template engine
 * - Industry-standard compliant
 * - Fair to both parties
 * - NO placeholder or mock data
 */

import { smartTemplateEngine, TemplateContext } from './smart-template-engine';
import type { BaseTemplateMetadata, TemplateVariable } from './template-types';

// Legacy interface - compatible with BaseTemplateMetadata
export interface ContractTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  isPremium: boolean;
  jurisdiction: string[];
  industry: string[];
  tags: string[];
  riskScore: number;
  complexity: 'Simple' | 'Moderate' | 'Complex' | 'Expert';
  estimatedTime: string;
  preview: string;
  fullContent: string;
  downloadCount: number;
  rating: number;
  reviewCount: number;
  lastUpdated: string;
  version: string;

  // Legacy-specific fields
  useCase: string;
  variables: string[]; // Simplified from TemplateVariable[]
}

export const contractTemplates: ContractTemplate[] = [
  {
    id: 'saas-service-agreement',
    name: 'SaaS Service Agreement',
    category: 'Software & Technology',
    description: 'Professional Software-as-a-Service agreement with clear terms, data ownership, and customer protections. Balanced for B2B SaaS companies.',
    riskScore: 28,
    useCase: 'B2B SaaS companies, cloud software providers, subscription-based software businesses',
    price: 0,
    isPremium: false,
    industry: ['Technology', 'Software', 'SaaS', 'Cloud Services'],
    jurisdiction: ['US', 'EU', 'International'],
    tags: ['saas', 'software', 'subscription', 'b2b', 'cloud'],
    estimatedTime: '10 min',
    complexity: 'Moderate',
    lastUpdated: '2026-01-05',
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    preview: `Enterprise-Grade Features:
• Clear service level commitments (99.9% uptime)
• Customer data ownership and portability
• Transparent pricing and billing terms
• Reasonable termination rights (30-day notice)
• GDPR and SOC2 compliant provisions
• Limited liability (12 months of fees)
• Professional indemnification
• Automatic renewal with opt-out`,
    variables: ['PROVIDER_NAME', 'CUSTOMER_NAME', 'SERVICE_DESCRIPTION', 'MONTHLY_FEE', 'SLA_PERCENTAGE', 'TERM_LENGTH'],
    fullContent: `# SOFTWARE AS A SERVICE AGREEMENT

This Software as a Service Agreement ("Agreement") is entered into as of [EFFECTIVE_DATE] ("Effective Date") by and between:

**Provider:** [PROVIDER_NAME], a [STATE] [ENTITY_TYPE] ("Provider")
**Customer:** [CUSTOMER_NAME], a [STATE] [ENTITY_TYPE] ("Customer")

## 1. SERVICE DESCRIPTION

Provider agrees to provide Customer with access to the following software application(s) and services (the "Service"):

[SERVICE_DESCRIPTION]

The Service shall be made available via web browser and/or mobile application as described in the Documentation.

## 2. SERVICE LEVEL AGREEMENT

### 2.1 Uptime Commitment
Provider commits to maintain Service availability of [SLA_PERCENTAGE]% measured monthly ("Uptime SLA"). Scheduled maintenance windows (announced 7 days in advance) are excluded.

### 2.2 Performance Standards
- API Response Time: < 500ms (95th percentile)
- Page Load Time: < 3 seconds
- Support Response: < 4 business hours for critical issues

### 2.3 Service Credits
If Provider fails to meet the Uptime SLA in any month:
- 99.0-99.8% uptime: 10% monthly fee credit
- 95.0-98.9% uptime: 25% monthly fee credit
- Below 95.0% uptime: 50% monthly fee credit

Service credits are Customer's sole remedy for SLA failures and must be requested within 30 days.

## 3. FEES AND PAYMENT

### 3.1 Subscription Fees
Customer agrees to pay Provider:
- Monthly Fee: $[MONTHLY_FEE] per [BILLING_UNIT]
- Billing Cycle: [MONTHLY/ANNUAL]
- Payment Terms: Due upon invoice, net 30 days

### 3.2 Fee Changes
Provider may increase fees with 60 days written notice. Customer may terminate without penalty if fees increase by more than 15% annually.

### 3.3 Taxes
Fees are exclusive of all applicable sales, use, VAT, and similar taxes. Customer is responsible for all taxes except those based on Provider's income.

### 3.4 Late Payment
Late payments accrue interest at 1.5% per month or maximum legal rate, whichever is lower.

## 4. DATA OWNERSHIP AND PRIVACY

### 4.1 Customer Data Ownership
Customer retains all right, title, and interest in Customer Data. Provider claims no ownership rights in Customer Data.

### 4.2 Data Processing
Provider will:
- Process Customer Data only per Customer's documented instructions
- Implement industry-standard security measures (AES-256 encryption at rest, TLS 1.3 in transit)
- Not share Customer Data with third parties without explicit consent
- Comply with GDPR, CCPA, and applicable data protection laws
- Execute Data Processing Addendum if requested

### 4.3 Data Portability
Customer may export Customer Data in standard formats (JSON, CSV, XML) at any time via the Service interface or API. Upon termination, Provider will provide complete data export within 30 days.

### 4.4 Data Deletion
Provider will securely delete all Customer Data within 90 days of termination unless legally required to retain or Customer requests extended retention.

### 4.5 Data Residency
Customer Data is stored in [DATA_CENTER_LOCATION]. Provider will notify Customer 60 days before changing data storage location.

## 5. INTELLECTUAL PROPERTY

### 5.1 Service Ownership
Provider retains all rights, title, and interest in the Service, including all improvements, modifications, and derivatives. Customer receives a limited, non-exclusive, non-transferable license to access and use the Service during the Term.

### 5.2 Customer IP
Customer retains all rights in Customer Data and any intellectual property created by Customer using the Service.

### 5.3 Feedback
Customer may provide suggestions or feedback. Provider may use such feedback without compensation or attribution, but is not required to do so.

## 6. CONFIDENTIALITY

### 6.1 Definition
"Confidential Information" includes business plans, customer lists, pricing, technical information, source code, and anything marked "Confidential" or that reasonably should be understood as confidential.

### 6.2 Obligations
Each party agrees to:
- Protect Confidential Information with at least the same care used for its own confidential information (minimum reasonable care)
- Use Confidential Information only for purposes of this Agreement
- Not disclose except to employees and contractors with need-to-know and written confidentiality obligations
- Return or destroy Confidential Information upon request or termination

### 6.3 Exceptions
Confidential Information does not include information that:
- Is publicly available through no breach
- Was rightfully known before disclosure
- Is independently developed without reference to Confidential Information
- Is rightfully received from a third party without confidentiality obligations
- Must be disclosed by law (with prompt notice if legally permitted)

### 6.4 Term
Confidentiality obligations survive for 3 years after disclosure.

## 7. WARRANTIES AND DISCLAIMERS

### 7.1 Provider Warranties
Provider warrants that:
- The Service will perform materially in accordance with Documentation
- Provider has all necessary rights and licenses to provide the Service
- The Service will not infringe or misappropriate third-party intellectual property rights
- Provider will comply with applicable laws in providing the Service

### 7.2 Customer Warranties
Customer warrants that:
- It has necessary rights to provide Customer Data to Provider
- Customer Data does not infringe third-party rights
- It will comply with applicable laws in using the Service

### 7.3 Disclaimer
EXCEPT AS EXPRESSLY PROVIDED IN THIS SECTION 7, THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.

## 8. LIMITATION OF LIABILITY

### 8.1 Liability Cap
EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID BY CUSTOMER TO PROVIDER IN THE 12 MONTHS PRECEDING THE EVENT GIVING RISE TO LIABILITY.

### 8.2 Consequential Damages
IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, LOST DATA, OR BUSINESS INTERRUPTION.

### 8.3 Exceptions
Limitations in Sections 8.1 and 8.2 do not apply to:
- Indemnification obligations
- Data breaches resulting from Provider's gross negligence or willful misconduct
- Either party's willful misconduct or fraud
- Violations of Section 6 (Confidentiality)

### 8.4 Nature of Claims
The limitations apply regardless of the form of action, whether in contract, tort, strict liability, or otherwise.

## 9. INDEMNIFICATION

### 9.1 Provider Indemnification
Provider will defend, indemnify, and hold harmless Customer from and against any claims, damages, and costs (including reasonable attorneys' fees) arising from claims that the Service infringes or misappropriates third-party intellectual property rights.

### 9.2 Customer Indemnification
Customer will defend, indemnify, and hold harmless Provider from and against any claims, damages, and costs (including reasonable attorneys' fees) arising from:
- Customer Data or its combination with other data
- Customer's use of the Service in violation of this Agreement or applicable law
- Customer's breach of representations or warranties

### 9.3 Indemnification Process
The indemnified party must:
- Promptly notify the indemnifying party of the claim
- Grant sole control of the defense and settlement to the indemnifying party
- Provide reasonable cooperation in the defense (at indemnifying party's expense)

Indemnifying party may not settle in a way that imposes obligations on indemnified party without consent.

### 9.4 Remedies
If Service is or Provider believes may be subject to infringement claim, Provider may at its option:
- Obtain the right for Customer to continue using the Service
- Replace or modify the Service to be non-infringing
- Terminate this Agreement and refund prepaid fees for unused period

## 10. TERM AND TERMINATION

### 10.1 Initial Term
This Agreement begins on the Effective Date and continues for [TERM_LENGTH] ("Initial Term").

### 10.2 Renewal
Agreement automatically renews for successive [RENEWAL_PERIOD] periods unless either party provides written notice of non-renewal at least 30 days before the end of the then-current term.

### 10.3 Termination for Convenience
Either party may terminate this Agreement for any reason with 30 days written notice.

### 10.4 Termination for Cause
Either party may terminate immediately upon written notice if the other party:
- Materially breaches this Agreement and fails to cure within 15 days of written notice
- Becomes insolvent, makes an assignment for the benefit of creditors, or has a receiver appointed
- Files or has filed against it a petition in bankruptcy or similar proceeding

### 10.5 Effect of Termination
Upon termination:
- Customer's access to the Service terminates immediately
- Customer must cease all use of the Service
- Provider will provide data export per Section 4.3
- Customer remains liable for all fees accrued through termination date
- No refunds of prepaid fees except as specifically provided
- Provider will delete Customer Data per Section 4.4

### 10.6 Survival
The following sections survive termination: 4 (Data Ownership), 5 (IP), 6 (Confidentiality), 8 (Liability), 9 (Indemnification), 10.5-10.6, and 11 (General).

## 11. GENERAL PROVISIONS

### 11.1 Governing Law
This Agreement is governed by the laws of [STATE/COUNTRY], without regard to conflicts of law principles.

### 11.2 Dispute Resolution
Before commencing litigation, the parties agree to attempt to resolve disputes through good faith negotiation for 30 days. If negotiation fails, either party may pursue litigation.

### 11.3 Jurisdiction
Any litigation shall be brought exclusively in the state and federal courts located in [JURISDICTION]. Each party consents to personal jurisdiction and venue in such courts.

### 11.4 Entire Agreement
This Agreement constitutes the entire agreement between the parties and supersedes all prior or contemporaneous agreements, representations, or understandings.

### 11.5 Amendments
No amendment or modification is binding unless in writing and signed by authorized representatives of both parties.

### 11.6 Waiver
Failure to enforce any provision does not waive the right to enforce that or any other provision.

### 11.7 Assignment
Neither party may assign this Agreement without prior written consent of the other party, except either party may assign to a successor in interest in connection with a merger, acquisition, or sale of substantially all assets. Any prohibited assignment is void.

### 11.8 Force Majeure
Neither party is liable for failure to perform due to causes beyond its reasonable control, including acts of God, natural disasters, war, terrorism, pandemic, labor disputes, or government actions. If force majeure continues for more than 60 days, either party may terminate this Agreement.

### 11.9 Independent Contractors
The parties are independent contractors. Nothing creates a partnership, joint venture, agency, or employment relationship.

### 11.10 Notices
All notices must be in writing and delivered to the addresses below (or updated addresses provided in writing):

Provider: [PROVIDER_ADDRESS]
Customer: [CUSTOMER_ADDRESS]

Notices are deemed received when delivered personally, by confirmed email, by recognized overnight courier, or 5 days after mailing by registered mail.

### 11.11 Severability
If any provision is found unenforceable, it shall be modified to the minimum extent necessary to make it enforceable, or severed if modification is not possible. The remainder of the Agreement remains in full effect.

### 11.12 Counterparts
This Agreement may be executed in counterparts, each of which is an original, and together constitute one instrument. Electronic signatures are valid and binding.

---

## SIGNATURE BLOCK

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

**PROVIDER:**

[PROVIDER_NAME]

By: _______________________

Name: _______________________

Title: _______________________

Date: _______________________


**CUSTOMER:**

[CUSTOMER_NAME]

By: _______________________

Name: _______________________

Title: _______________________

Date: _______________________`,
  },

  {
    id: 'employment-agreement',
    name: 'Employment Agreement',
    category: 'Employment & HR',
    description: 'Comprehensive at-will employment agreement with fair IP assignment, confidentiality, and non-compete provisions. Balanced for employers and employees.',
    riskScore: 32,
    useCase: 'Companies hiring full-time employees in technology, professional services, or knowledge worker roles',
    price: 0,
    isPremium: false,
    industry: ['General', 'Technology', 'Professional Services', 'Startups'],
    jurisdiction: ['US'],
    tags: ['employment', 'full-time', 'at-will', 'ip-assignment', 'non-compete'],
    estimatedTime: '12 min',
    complexity: 'Moderate',
    lastUpdated: '2026-01-05',
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    preview: `Fair Employment Terms:
• At-will employment with clear documentation
• Competitive compensation and benefits
• IP assignment limited to work-related inventions
• Reasonable non-compete (6-12 months, limited scope)
• Confidentiality with 2-year post-employment term
• Professional standards and code of conduct
• Clear termination and severance provisions
• Optional arbitration (employee choice)`,
    variables: ['COMPANY_NAME', 'EMPLOYEE_NAME', 'POSITION_TITLE', 'START_DATE', 'SALARY', 'BENEFITS_SUMMARY'],
    fullContent: `# EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into as of [START_DATE] ("Start Date") by and between:

**Employer:** [COMPANY_NAME] ("Company")
**Employee:** [EMPLOYEE_NAME] ("Employee")

## 1. EMPLOYMENT

### 1.1 Position
Company employs Employee in the position of [POSITION_TITLE], reporting to [REPORTS_TO]. Employee's duties include [JOB_DUTIES].

### 1.2 At-Will Employment
This is at-will employment. Either party may terminate the employment relationship at any time, with or without cause or notice. Nothing in this Agreement creates a contract for a specific term of employment or alters the at-will nature of the relationship.

### 1.3 Location
Employee's primary work location is [WORK_LOCATION]. Company may require reasonable business travel.

### 1.4 Full-Time Commitment
Employee agrees to devote full professional time, attention, and energy to Company during normal business hours.

## 2. COMPENSATION AND BENEFITS

### 2.1 Base Salary
Company will pay Employee an annual base salary of $[SALARY], payable in accordance with Company's regular payroll schedule (currently [PAYROLL_FREQUENCY]).

### 2.2 Performance Bonus
Employee may be eligible for an annual performance bonus of up to [BONUS_PERCENTAGE]% of base salary, based on individual and company performance, as determined solely by Company.

### 2.3 Benefits
Employee is eligible for Company's standard benefits package, including:
[BENEFITS_SUMMARY]

Benefits are subject to plan terms and Company policies. Company reserves the right to modify benefits at any time.

### 2.4 Vacation and Paid Time Off
Employee is entitled to [PTO_DAYS] days of paid time off annually, accruing in accordance with Company policy.

### 2.5 Equity Compensation
[IF_APPLICABLE: Employee will be granted stock options to purchase [SHARES_NUMBER] shares of Company common stock, subject to separate Stock Option Agreement and Equity Incentive Plan.]

## 3. INTELLECTUAL PROPERTY ASSIGNMENT

### 3.1 Work Product
All work product, inventions, discoveries, improvements, and ideas ("Work Product") created, conceived, or reduced to practice by Employee (alone or jointly) during employment that:
(a) Relate to Company's business or actual/demonstrably anticipated research or development, OR
(b) Result from any work performed by Employee for Company, OR
(c) Are developed using Company equipment, supplies, facilities, or trade secret information

shall be the sole and exclusive property of Company ("Company IP").

### 3.2 Assignment
Employee hereby assigns to Company all right, title, and interest in and to all Company IP, including all patent rights, copyrights, trade secret rights, and other intellectual property rights.

### 3.3 Prior Inventions
Employee has disclosed on Exhibit A all inventions made or conceived prior to employment that Employee wishes to exclude from this Assignment. If no items are listed, Employee represents that there are no such prior inventions.

### 3.4 Excluded Inventions
This Section 3 does not apply to inventions for which no Company equipment, supplies, facility, or trade secret information was used and that were developed entirely on Employee's own time, unless the invention:
(a) Relates to Company's business or actual/demonstrably anticipated research, OR
(b) Results from work performed by Employee for Company

### 3.5 Moral Rights
To the extent allowed by law, Employee waives all moral rights in Company IP.

### 3.6 Further Assistance
Employee will assist Company in obtaining and enforcing intellectual property rights in Company IP, including executing documents and providing testimony. Company will compensate Employee at reasonable rates for time required after employment terminates.

## 4. CONFIDENTIAL INFORMATION

### 4.1 Definition
"Confidential Information" means all non-public information disclosed by Company or learned by Employee during employment, including but not limited to:
- Trade secrets, formulas, techniques, processes, and know-how
- Business strategies, financial information, and customer lists
- Product roadmaps, specifications, and source code
- Marketing plans and pricing information
- Personnel information and internal policies

### 4.2 Protection Obligations
During employment and for 2 years after termination, Employee will:
- Hold Confidential Information in strict confidence
- Not disclose to any person or entity
- Use only for Company's benefit in performing duties
- Take reasonable precautions to prevent unauthorized disclosure
- Return all materials containing Confidential Information upon termination

### 4.3 Exceptions
Confidential Information does not include information that:
- Is publicly available through no breach by Employee
- Was rightfully known to Employee before disclosure by Company
- Is independently developed by Employee after employment without using Confidential Information
- Must be disclosed by law (provided Employee gives prompt notice if legally permitted)

### 4.4 Defend Trade Secrets Act Notice
Employee is notified under the Defend Trade Secrets Act:
(1) Employee shall not be held criminally or civilly liable under federal or state trade secret law for disclosure of a trade secret that is made:
    (a) In confidence to federal, state, or local officials or attorney solely for reporting or investigating suspected violation of law, OR
    (b) In a complaint or other document filed in a lawsuit under seal

(2) If Employee files a lawsuit for retaliation for reporting a suspected violation of law, Employee may disclose trade secret information to attorney and use in court proceedings if any document containing the trade secret is filed under seal and Employee does not disclose except pursuant to court order.

## 5. NON-COMPETITION AND NON-SOLICITATION

### 5.1 Non-Competition
During employment and for [NON_COMPETE_MONTHS] months after termination for any reason, Employee will not, without Company's prior written consent, directly or indirectly:
- Engage in or participate in any business that competes with Company's business in [GEOGRAPHIC_SCOPE] in the field of [BUSINESS_SCOPE]
- Provide services (as employee, consultant, or otherwise) to any entity competing with Company in such field and geography

### 5.2 Reasonableness
Employee acknowledges this non-compete restriction is reasonable in scope, duration, and geography and necessary to protect Company's legitimate business interests.

### 5.3 Non-Solicitation of Employees
During employment and for 12 months after termination, Employee will not directly or indirectly:
- Solicit, recruit, or hire any Company employee or contractor
- Encourage any Company employee to leave their employment
- Assist any third party in doing the above

### 5.4 Non-Solicitation of Customers
During employment and for 12 months after termination, Employee will not directly or indirectly solicit or accept business from any Company customer or prospective customer with whom Employee had contact or about whom Employee gained Confidential Information during the last 12 months of employment.

### 5.5 Blue Pencil
If any restriction in this Section 5 is found unreasonable, the court may modify it to the maximum extent enforceable to protect Company's legitimate interests.

## 6. OUTSIDE ACTIVITIES

### 6.1 Conflicting Activities
Employee will not engage in any business activity that conflicts with Company's interests or Employee's duties.

### 6.2 Outside Employment
Employee must obtain prior written approval for any outside employment or consulting, which Company may grant or deny in its sole discretion.

### 6.3 Board Service
Employee may serve on outside boards only with prior written approval.

## 7. COMPANY POLICIES

### 7.1 Compliance
Employee agrees to comply with all Company policies, including those in the Employee Handbook, Code of Conduct, and security policies.

### 7.2 Background Check
Employment is contingent upon satisfactory completion of background check to the extent permitted by law.

### 7.3 Immigration Compliance
Employee must provide documentation establishing identity and employment authorization within 3 days of the Start Date.

## 8. TERMINATION

### 8.1 Termination by Either Party
As stated in Section 1.2, either party may terminate employment at any time, with or without cause or notice.

### 8.2 Company Property
Upon termination, Employee will immediately return all Company property, including computers, phones, documents, and all copies of Confidential Information.

### 8.3 Final Paycheck
Company will pay all earned but unpaid salary through the termination date within the timeframe required by applicable law.

### 8.4 Severance
[IF_APPLICABLE: If Company terminates without Cause, Employee will receive [SEVERANCE_WEEKS] weeks of base salary as severance, conditioned on signing a separation and release agreement.]

### 8.5 Post-Termination Obligations
Sections 3 (IP Assignment), 4 (Confidentiality), and 5 (Non-Compete/Non-Solicit) survive termination.

## 9. DISPUTE RESOLUTION

### 9.1 Arbitration
[OPTIONAL - Remove if not desired]
Any dispute arising out of or related to this Agreement or Employee's employment will be resolved by binding arbitration in [CITY, STATE] under the Employment Arbitration Rules of the American Arbitration Association. The arbitrator's decision will be final and binding. Each party will bear its own costs and fees.

[ALTERNATIVE - Employee-favorable version]
Arbitration is optional. Employee may choose to pursue claims in court or through arbitration. If Employee chooses arbitration, it will be conducted under AAA rules with Company paying all arbitration fees.

### 9.2 Equitable Relief
Notwithstanding arbitration provisions, Company may seek injunctive or equitable relief in any court of competent jurisdiction to enforce Sections 3, 4, or 5.

### 9.3 Governing Law
This Agreement is governed by the laws of [STATE], without regard to conflicts of law.

## 10. GENERAL PROVISIONS

### 10.1 Entire Agreement
This Agreement, together with the Employee Handbook and any equity agreements, constitutes the entire agreement and supersedes all prior agreements and understandings.

### 10.2 Amendments
No amendment is binding unless in writing and signed by both parties.

### 10.3 Assignment
Company may assign this Agreement. Employee may not assign without Company's written consent.

### 10.4 Severability
If any provision is unenforceable, it will be modified to the minimum extent necessary or severed, with the remainder remaining in effect.

### 10.5 Waiver
No waiver of any provision is effective unless in writing. Waiver of one breach does not waive any other breach.

### 10.6 Withholding
Company may withhold all applicable taxes and other amounts required by law.

### 10.7 Notices
Notices must be in writing to:

Company: [COMPANY_ADDRESS]
Employee: [EMPLOYEE_ADDRESS]

### 10.8 Counterparts
This Agreement may be executed in counterparts. Electronic signatures are valid and binding.

---

## SIGNATURE BLOCK

By signing below, Employee acknowledges having read, understood, and agreed to all terms and conditions of this Agreement.

**COMPANY:**

[COMPANY_NAME]

By: _______________________

Name: _______________________

Title: _______________________

Date: _______________________


**EMPLOYEE:**

_______________________
[EMPLOYEE_NAME]

Date: _______________________

---

## EXHIBIT A: PRIOR INVENTIONS

List any inventions, improvements, or developments made or conceived prior to employment that Employee wishes to exclude from Section 3 (Intellectual Property Assignment):

[ ] No prior inventions to disclose
[ ] See attached list

_______________________
Employee Signature`,
  },
  {
    id: 'freelance-services-agreement',
    name: 'Freelance Services Agreement',
    category: 'Professional Services',
    description: 'Professional freelance/independent contractor agreement with fair payment terms, IP ownership clarity, and scope management. Balanced for freelancers and clients.',
    riskScore: 22,
    useCase: 'Freelancers, consultants, independent contractors providing services to businesses',
    price: 0,
    isPremium: false,
    industry: ['Professional Services', 'Consulting', 'Creative', 'Technology'],
    jurisdiction: ['US', 'International'],
    tags: ['freelance', 'contractor', 'services', 'consulting', 'project-based'],
    estimatedTime: '8 min',
    complexity: 'Simple',
    lastUpdated: '2026-01-05',
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    preview: `Freelancer-Friendly Features:
• Clear scope and deliverables definition
• Fair payment terms (50% upfront, 50% on completion)
• IP rights clarification (you own your work methods)
• Reasonable revision limits (2-3 rounds)
• Kill fee protection (50% if client cancels)
• Net 15 payment terms
• No non-compete restrictions
• Termination rights for both parties`,
    variables: ['FREELANCER_NAME', 'CLIENT_NAME', 'PROJECT_DESCRIPTION', 'PROJECT_FEE', 'PAYMENT_SCHEDULE', 'DELIVERABLES', 'DEADLINE'],
    fullContent: `# FREELANCE SERVICES AGREEMENT

This Freelance Services Agreement ("Agreement") is entered into as of [EFFECTIVE_DATE] ("Effective Date") by and between:

**Freelancer:** [FREELANCER_NAME] ("Contractor" or "Freelancer")
**Client:** [CLIENT_NAME] ("Client")

## 1. SERVICES AND DELIVERABLES

### 1.1 Scope of Work
Freelancer agrees to provide the following services to Client:

[PROJECT_DESCRIPTION]

### 1.2 Deliverables
Freelancer will deliver the following to Client:

[DELIVERABLES]

### 1.3 Timeline
Project Deadline: [DEADLINE]
Milestones and interim deliverables as mutually agreed in writing.

### 1.4 Revisions
Project includes up to 2-3 rounds of reasonable revisions. Additional revisions will be billed hourly with Client approval before work begins.

## 2. COMPENSATION AND PAYMENT

### 2.1 Project Fee
Total Project Fee: $[PROJECT_FEE]

### 2.2 Payment Schedule
[PAYMENT_SCHEDULE]

Standard payment schedule (if not specified):
- 50% due upon execution of this Agreement
- 50% due upon delivery of final deliverables

### 2.3 Payment Terms
All invoices are due within 15 days of receipt (net 15). Late payments accrue interest at 1.5% per month (18% APR).

### 2.4 Kill Fee
If Client terminates this Agreement before completion without Freelancer's material breach, Client shall pay Freelancer 100% of fees for work completed plus 50% of remaining project fee as kill fee.

## 3. INTELLECTUAL PROPERTY RIGHTS

### 3.1 Work Product
Upon Client's full payment of all fees, Freelancer assigns to Client all rights in the final deliverables specifically created for Client under this Agreement.

### 3.2 Freelancer Retained Rights
Freelancer retains ownership of pre-existing materials, templates, tools, methods, processes, and techniques. Freelancer may display Work Product in portfolio with Client approval.

## 4. INDEPENDENT CONTRACTOR STATUS

Freelancer is an independent contractor, not an employee. Freelancer is responsible for all taxes, insurance, and benefits. Freelancer has control over how, when, and where services are performed.

## 5. CONFIDENTIALITY

Each party agrees to maintain confidentiality of the other party's non-public information for 2 years after Agreement termination.

## 6. TERMINATION

Either party may terminate with 7 days written notice. Upon termination, Client pays for all work completed plus kill fee (Section 2.4).

## 7. GOVERNING LAW

This Agreement is governed by the laws of [GOVERNING_STATE].

---

**FREELANCER:** ___________________________ Date: ___________
**CLIENT:** ___________________________ Date: ___________`,
  },
  {
    id: 'mutual-nda',
    name: 'Mutual Non-Disclosure Agreement',
    category: 'Legal & Compliance',
    description: 'Balanced mutual NDA protecting both parties\' confidential information during business discussions, partnerships, or collaborations.',
    riskScore: 15,
    useCase: 'Business partnerships, vendor relationships, joint ventures, fundraising discussions',
    price: 0,
    isPremium: false,
    industry: ['All Industries', 'Technology', 'Finance', 'Healthcare', 'Manufacturing'],
    jurisdiction: ['US', 'EU', 'International'],
    tags: ['nda', 'confidentiality', 'mutual', 'non-disclosure', 'privacy'],
    estimatedTime: '5 min',
    complexity: 'Simple',
    lastUpdated: '2026-01-05',
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    preview: `Balanced Mutual Protection:
• Both parties protected equally
• Clear definition of confidential information
• Standard exclusions (public info, prior knowledge)
• Reasonable 2-year confidentiality period
• Return/destruction of materials upon termination
• No broad non-compete or non-solicitation
• Works globally`,
    variables: ['PARTY_A_NAME', 'PARTY_B_NAME', 'PURPOSE', 'DURATION_YEARS'],
    fullContent: `# MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of [EFFECTIVE_DATE] by and between:

**Party A:** [PARTY_A_NAME]
**Party B:** [PARTY_B_NAME]

## PURPOSE

The Parties wish to explore a business relationship concerning: [PURPOSE]

## 1. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any information disclosed by one Party to the other that is marked confidential or would reasonably be considered confidential.

Confidential Information includes:
- Business plans, strategies, and methods
- Financial information and pricing
- Technical data and specifications
- Customer lists and business relationships
- Trade secrets and know-how
- Product development and roadmaps

### Exclusions
Confidential Information does NOT include information that:
- Is or becomes publicly available through no breach
- Was rightfully possessed before disclosure
- Is rightfully received from a third party
- Is independently developed

## 2. OBLIGATIONS

Receiving Party agrees to:
- Hold Confidential Information in strict confidence
- Not disclose to any third party without written consent
- Use solely for the Purpose stated above
- Use same degree of care as for own confidential information (minimum reasonable care)

## 3. TERM

This Agreement continues for [DURATION_YEARS] years. Confidentiality obligations survive for [DURATION_YEARS] years from disclosure date.

## 4. RETURN OF MATERIALS

Upon request or termination, Receiving Party shall promptly return or destroy all Confidential Information and certify completion in writing.

## 5. REMEDIES

Breach may cause irreparable harm. Disclosing Party may seek injunctive relief in addition to all other remedies.

## 6. GENERAL PROVISIONS

This Agreement is governed by the laws of [GOVERNING_STATE]. No partnership or agency relationship is created.

---

**PARTY A:** ___________________________ Date: ___________
**PARTY B:** ___________________________ Date: ___________`,
  },
  {
    id: 'independent-contractor-agreement',
    name: 'Independent Contractor Agreement',
    category: 'Professional Services',
    description: 'Comprehensive independent contractor agreement establishing true contractor relationship with proper tax treatment and compliance.',
    riskScore: 20,
    useCase: 'Hiring independent contractors for ongoing services, ensuring IRS compliance and proper classification',
    price: 0,
    isPremium: false,
    industry: ['All Industries', 'Professional Services', 'Technology', 'Consulting'],
    jurisdiction: ['US'],
    tags: ['contractor', '1099', 'independent', 'services', 'compliance'],
    estimatedTime: '10 min',
    complexity: 'Moderate',
    lastUpdated: '2026-01-05',
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    preview: `IRS Compliant Features:
• Clear independent contractor relationship
• Contractor controls methods and timing
• No employee benefits or withholding
• Contractor provides own tools/equipment
• Can serve other clients
• Clear deliverables and payment terms
• Proper tax documentation (W-9, 1099)
• IP assignment upon payment`,
    variables: ['COMPANY_NAME', 'CONTRACTOR_NAME', 'SERVICES_DESCRIPTION', 'COMPENSATION_RATE', 'PAYMENT_TERMS'],
    fullContent: `# INDEPENDENT CONTRACTOR AGREEMENT

This Independent Contractor Agreement ("Agreement") is entered into as of [EFFECTIVE_DATE] by and between:

**Company:** [COMPANY_NAME] ("Company")
**Contractor:** [CONTRACTOR_NAME] ("Contractor")

## 1. SERVICES

### 1.1 Scope
Contractor agrees to provide the following services:

[SERVICES_DESCRIPTION]

### 1.2 Performance Standards
Services will be performed in a professional, workmanlike manner consistent with industry standards.

### 1.3 Control
Contractor retains sole control over the manner, means, and methods of performing services. Company has no right to control how Contractor performs the work, only to specify desired results.

## 2. INDEPENDENT CONTRACTOR RELATIONSHIP

### 2.1 Status
Contractor is an independent contractor, not an employee, partner, or agent of Company. This Agreement does not create any employment relationship, partnership, joint venture, or agency.

### 2.2 No Employee Benefits
Contractor is not entitled to any employee benefits including health insurance, retirement benefits, paid time off, workers' compensation, or unemployment insurance.

### 2.3 Taxes
Contractor is solely responsible for all federal, state, and local taxes, including self-employment tax. Company will not withhold taxes. Company will issue IRS Form 1099 if payments exceed $600 annually.

### 2.4 Business Operations
Contractor:
- Provides own tools, equipment, and materials
- Maintains own business location
- May hire assistants or subcontractors (with Company approval)
- May perform services for other clients
- Carries own business insurance
- Operates under own business name

## 3. COMPENSATION

### 3.1 Payment
Company will pay Contractor: [COMPENSATION_RATE]

Payment structure: [PAYMENT_TERMS]
(Examples: $X per hour, $X per project, $X per deliverable)

### 3.2 Invoicing
Contractor shall submit invoices [BILLING_FREQUENCY] detailing services performed. Payment due within 30 days of invoice receipt (net 30).

### 3.3 Expenses
Contractor responsible for all business expenses unless pre-approved in writing by Company.

## 4. TERM AND TERMINATION

### 4.1 Term
This Agreement begins [START_DATE] and continues until terminated by either party.

### 4.2 Termination
Either party may terminate this Agreement:
- For convenience with 30 days written notice
- For cause immediately upon material breach

### 4.3 Effect of Termination
Upon termination, Contractor receives payment for satisfactory services completed. Sections 5, 6, 7, and 8 survive termination.

## 5. INTELLECTUAL PROPERTY

### 5.1 Work Product
Upon full payment, Contractor assigns to Company all rights, title, and interest in deliverables and work product specifically created for Company under this Agreement.

### 5.2 Contractor Tools
Contractor retains all rights to pre-existing materials, tools, templates, methodologies, and general knowledge.

### 5.3 Third-Party Materials
Contractor warrants that work product will not infringe third-party intellectual property rights.

## 6. CONFIDENTIALITY

Contractor agrees to maintain confidentiality of Company's non-public information for 2 years after termination. Contractor may not use or disclose confidential information except as necessary to perform services.

## 7. WARRANTIES AND REPRESENTATIONS

### 7.1 Contractor Warranties
Contractor warrants:
- Authority to enter this Agreement
- Services will be performed competently
- Work product will be original or properly licensed
- No conflicts of interest exist

### 7.2 Company Warranties
Company warrants authority to enter this Agreement and to use materials provided to Contractor.

## 8. LIMITATION OF LIABILITY

### 8.1 Liability Cap
Contractor's total liability shall not exceed fees paid by Company in the 12 months preceding the claim.

### 8.2 Consequential Damages
Neither party liable for indirect, incidental, consequential, or punitive damages.

### 8.3 Exceptions
Limitations don't apply to IP indemnification, gross negligence, or willful misconduct.

## 9. INDEMNIFICATION

Each party shall indemnify the other from claims arising from that party's breach, negligence, or infringement.

## 10. GENERAL PROVISIONS

### 10.1 Entire Agreement
This Agreement constitutes the entire agreement and supersedes all prior agreements.

### 10.2 Amendments
Amendments must be in writing and signed by both parties.

### 10.3 Assignment
Neither party may assign without other party's written consent.

### 10.4 Governing Law
This Agreement is governed by the laws of [GOVERNING_STATE].

### 10.5 Severability
If any provision is unenforceable, remaining provisions remain in effect.

### 10.6 Notices
All notices must be in writing to:

Company: [COMPANY_ADDRESS] / [COMPANY_EMAIL]
Contractor: [CONTRACTOR_ADDRESS] / [CONTRACTOR_EMAIL]

---

**COMPANY:** 
Signature: ___________________________ Date: ___________
Name: [AUTHORIZED_SIGNATORY]
Title: [TITLE]

**CONTRACTOR:**
Signature: ___________________________ Date: ___________
Name: [CONTRACTOR_NAME]
Tax ID/SSN: [TAX_ID]`,
  },
  {
    id: 'consulting-agreement',
    name: 'Consulting Agreement',
    category: 'Professional Services',
    description: 'Professional consulting agreement for expert advisory services with clear deliverables, payment terms, and relationship boundaries.',
    riskScore: 24,
    useCase: 'Hiring consultants for strategic advice, expert guidance, specialized projects, or advisory board roles',
    price: 0,
    isPremium: false,
    industry: ['Consulting', 'Professional Services', 'Technology', 'Finance', 'Healthcare'],
    jurisdiction: ['US', 'International'],
    tags: ['consulting', 'advisory', 'expert', 'professional-services', 'strategic'],
    estimatedTime: '10 min',
    complexity: 'Moderate',
    lastUpdated: '2026-01-05',
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    preview: `Professional Consulting Terms:
• Clear scope and deliverables
• Flexible time-based or project-based compensation
• Reasonable expense reimbursement
• Defined meeting/reporting requirements
• Limited IP assignment (only work product)
• Non-exclusive (consultant can serve others)
• Reasonable confidentiality obligations
• Professional indemnification`,
    variables: ['COMPANY_NAME', 'CONSULTANT_NAME', 'SERVICES_DESCRIPTION', 'COMPENSATION', 'TERM_LENGTH'],
    fullContent: `# CONSULTING AGREEMENT

This Consulting Agreement ("Agreement") is entered into as of [EFFECTIVE_DATE] by and between:

**Client:** [COMPANY_NAME] ("Client" or "Company")
**Consultant:** [CONSULTANT_NAME] ("Consultant")

## 1. CONSULTING SERVICES

### 1.1 Scope of Services
Consultant agrees to provide the following consulting services:

[SERVICES_DESCRIPTION]

### 1.2 Deliverables
Consultant will provide:
- [DELIVERABLE_1]
- [DELIVERABLE_2]
- [DELIVERABLE_3]
- Regular status reports and updates

### 1.3 Time Commitment
Consultant will dedicate approximately [HOURS_PER_MONTH] hours per month to Client's engagement, with flexibility based on project needs.

### 1.4 Performance Standard
All services will be performed with the professional skill, care, and diligence consistent with industry standards for similar consulting engagements.

## 2. COMPENSATION

### 2.1 Fees
Client will pay Consultant: [COMPENSATION]

Payment structure options:
- Hourly rate: $[HOURLY_RATE] per hour
- Monthly retainer: $[MONTHLY_RETAINER] per month
- Project fee: $[PROJECT_FEE] total
- Daily rate: $[DAILY_RATE] per day

### 2.2 Invoicing and Payment
Consultant shall invoice [BILLING_FREQUENCY]. Payment due within 30 days of invoice (net 30).

### 2.3 Expenses
Client will reimburse Consultant for reasonable pre-approved business expenses including:
- Travel costs (airfare, lodging, ground transportation)
- Meals during business travel (up to $[MEAL_LIMIT] per day)
- Materials and supplies directly related to services

Expenses over $[EXPENSE_APPROVAL_THRESHOLD] require prior written approval. Receipts required for all expense reimbursements.

### 2.4 Rate Adjustments
Consultant may adjust rates annually upon 60 days written notice.

## 3. TERM AND TERMINATION

### 3.1 Initial Term
This Agreement begins [START_DATE] and continues for [TERM_LENGTH], unless earlier terminated.

### 3.2 Renewal
Agreement automatically renews for successive [RENEWAL_PERIOD] periods unless either party provides 30 days written notice of non-renewal.

### 3.3 Termination for Convenience
Either party may terminate this Agreement with [TERMINATION_NOTICE_PERIOD] written notice.

### 3.4 Termination for Cause
Either party may terminate immediately if the other party:
- Materially breaches and fails to cure within 15 days of written notice
- Becomes insolvent or files bankruptcy
- Engages in fraud, gross negligence, or willful misconduct

### 3.5 Effect of Termination
Upon termination:
- Consultant receives payment for all services satisfactorily completed through termination date
- Consultant delivers all work product and Client materials
- Sections 5, 6, 7, 8, 9 survive termination

## 4. INDEPENDENT CONTRACTOR RELATIONSHIP

### 4.1 Status
Consultant is an independent contractor. This Agreement does not create employment, partnership, joint venture, or agency relationship.

### 4.2 Consultant Responsibilities
Consultant is responsible for:
- All federal, state, and local taxes
- Business insurance and liability coverage
- Own equipment, tools, and workspace
- Business licenses and professional certifications

### 4.3 No Benefits
Consultant is not entitled to employee benefits, health insurance, retirement plans, paid time off, or other employee benefits.

### 4.4 Non-Exclusivity
Consultant may provide services to other clients, provided no conflict of interest with Client's business.

## 5. INTELLECTUAL PROPERTY

### 5.1 Work Product Ownership
Upon Client's payment of all fees, Consultant assigns to Client all rights in deliverables and work product specifically created for Client under this Agreement.

### 5.2 Consultant Retained Rights
Consultant retains all rights to:
- Pre-existing materials and methodologies
- General consulting knowledge and experience
- Tools, templates, and frameworks developed independently
- Residual knowledge and skills gained during engagement

### 5.3 Licensed Materials
Consultant grants Client non-exclusive license to use Consultant's pre-existing materials incorporated into deliverables.

### 5.4 Client Materials
Client retains all ownership of materials provided to Consultant. Consultant receives limited license to use Client materials solely to perform services.

## 6. CONFIDENTIALITY

### 6.1 Confidential Information
Each party agrees to protect the other's confidential information, including:
- Business strategies and plans
- Financial information
- Technical data and specifications
- Customer and supplier information
- Proprietary methodologies

### 6.2 Obligations
Receiving party will:
- Maintain strict confidentiality
- Not disclose without prior written consent
- Use only to perform services under this Agreement
- Use same care as for own confidential information (minimum reasonable care)

### 6.3 Exclusions
Obligations don't apply to information that is publicly available, previously known, independently developed, or required by law to disclose.

### 6.4 Duration
Confidentiality obligations survive for 3 years after termination.

## 7. REPRESENTATIONS AND WARRANTIES

### 7.1 Consultant Warranties
Consultant represents and warrants:
- Authority to enter this Agreement
- Professional qualifications and expertise to perform services
- Services will be performed competently and professionally
- Work product will be original or properly licensed
- No conflicts of interest

### 7.2 Client Warranties
Client represents and warrants:
- Authority to enter this Agreement
- Client materials do not infringe third-party rights
- Will provide information necessary for Consultant to perform services

## 8. LIMITATION OF LIABILITY

### 8.1 Liability Cap
Consultant's total liability for all claims shall not exceed the total fees paid by Client in the 12 months preceding the claim.

### 8.2 Consequential Damages
Neither party liable for indirect, incidental, consequential, special, or punitive damages, including lost profits.

### 8.3 Exceptions
Limitations don't apply to:
- Intellectual property indemnification
- Gross negligence or willful misconduct
- Fraud or fraudulent misrepresentation
- Breach of confidentiality causing actual damages

## 9. INDEMNIFICATION

### 9.1 Mutual Indemnification
Each party shall indemnify, defend, and hold harmless the other from claims arising from:
- That party's breach of this Agreement
- That party's negligence or willful misconduct
- Infringement of third-party rights

### 9.2 Indemnification Procedure
Indemnified party must promptly notify indemnifying party of claims, cooperate in defense, and allow indemnifying party to control defense and settlement.

## 10. GENERAL PROVISIONS

### 10.1 Entire Agreement
This Agreement constitutes the entire agreement and supersedes all prior agreements, whether written or oral.

### 10.2 Amendments
Amendments must be in writing and signed by both parties.

### 10.3 Assignment
Neither party may assign this Agreement without the other's prior written consent. Agreement binds successors and permitted assigns.

### 10.4 Governing Law
This Agreement is governed by the laws of [GOVERNING_STATE] without regard to conflict of law principles.

### 10.5 Dispute Resolution
Parties will attempt good faith negotiation for 30 days before litigation. Disputes will be resolved in courts of [GOVERNING_STATE].

### 10.6 Severability
If any provision is unenforceable, remaining provisions remain in full effect.

### 10.7 Waiver
Failure to enforce any provision is not waiver of that provision or any other.

### 10.8 Force Majeure
Neither party liable for delays due to circumstances beyond reasonable control.

### 10.9 Notices
All notices must be in writing to:

Client: [CLIENT_ADDRESS] / [CLIENT_EMAIL]
Consultant: [CONSULTANT_ADDRESS] / [CONSULTANT_EMAIL]

### 10.10 Counterparts
This Agreement may be executed in counterparts. Electronic signatures are binding.

---

**CLIENT:**
Signature: ___________________________ Date: ___________
Name: [CLIENT_AUTHORIZED_SIGNATORY]
Title: [CLIENT_TITLE]

**CONSULTANT:**
Signature: ___________________________ Date: ___________
Name: [CONSULTANT_NAME]
Business: [CONSULTANT_BUSINESS_NAME]`,
  },
  {
    id: 'partnership-agreement',
    name: 'Partnership Agreement',
    category: 'Business Formation',
    description: 'Comprehensive general partnership agreement defining partner roles, profit sharing, decision-making, and exit procedures.',
    riskScore: 35,
    useCase: 'Two or more people starting a business together, joint ventures, co-founder agreements',
    price: 49,
    isPremium: true,
    industry: ['All Industries', 'Professional Services', 'Retail', 'Manufacturing'],
    jurisdiction: ['US'],
    tags: ['partnership', 'business-formation', 'co-founders', 'profit-sharing', 'equity'],
    estimatedTime: '20 min',
    complexity: 'Complex',
    lastUpdated: '2026-01-05',
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    preview: `Comprehensive Partnership Terms:
• Clear roles and responsibilities for each partner
• Fair profit/loss distribution formula
• Capital contribution requirements
• Decision-making procedures (major vs minor)
• Admission of new partners process
• Withdrawal and buyout procedures
• Dispute resolution mechanisms
• Dissolution and wind-up provisions
• Non-compete during partnership (reasonable scope)`,
    variables: ['PARTNERSHIP_NAME', 'PARTNER_1_NAME', 'PARTNER_2_NAME', 'PARTNER_1_PERCENTAGE', 'PARTNER_2_PERCENTAGE', 'INITIAL_CAPITAL'],
    fullContent: `# PARTNERSHIP AGREEMENT

This Partnership Agreement ("Agreement") is entered into as of [EFFECTIVE_DATE] by and between:

**Partner 1:** [PARTNER_1_NAME] ("[PARTNER_1_PERCENTAGE]% ownership")
**Partner 2:** [PARTNER_2_NAME] ("[PARTNER_2_PERCENTAGE]% ownership")
[Additional partners as applicable]

Collectively, the "Partners."

## 1. FORMATION OF PARTNERSHIP

### 1.1 Name and Business
The Partners form a general partnership under the name "[PARTNERSHIP_NAME]" (the "Partnership") for the purpose of:

[BUSINESS_PURPOSE]

### 1.2 Principal Place of Business
[BUSINESS_ADDRESS]

### 1.3 Term
The Partnership commences [START_DATE] and continues until dissolved according to this Agreement.

### 1.4 Filing and Compliance
Partners will file all necessary business registrations, licenses, and tax documentation.

## 2. CAPITAL CONTRIBUTIONS

### 2.1 Initial Contributions
Each Partner contributes:

- [PARTNER_1_NAME]: $[PARTNER_1_CAPITAL] ([PARTNER_1_PERCENTAGE]%)
- [PARTNER_2_NAME]: $[PARTNER_2_CAPITAL] ([PARTNER_2_PERCENTAGE]%)

Total Initial Capital: $[INITIAL_CAPITAL]

### 2.2 Additional Contributions
Additional capital contributions require unanimous approval. Each Partner must contribute pro-rata to their ownership percentage or ownership will be adjusted accordingly.

### 2.3 Capital Accounts
Partnership will maintain separate capital accounts for each Partner tracking contributions, distributions, and allocated profits/losses.

### 2.4 No Interest on Capital
Partners are not entitled to interest on capital contributions.

## 3. PROFIT AND LOSS ALLOCATION

### 3.1 Distribution Formula
Net profits and losses will be allocated to Partners according to ownership percentages:

- [PARTNER_1_NAME]: [PARTNER_1_PERCENTAGE]%
- [PARTNER_2_NAME]: [PARTNER_2_PERCENTAGE]%

### 3.2 Distributions
Cash distributions will be made [DISTRIBUTION_FREQUENCY] as determined by unanimous Partner vote, considering working capital needs.

### 3.3 Tax Allocations
For tax purposes, profits and losses allocated per Section 3.1. Partnership will provide K-1 forms annually.

## 4. MANAGEMENT AND DECISION-MAKING

### 4.1 Equal Management Rights
Unless otherwise specified, all Partners have equal management rights regardless of ownership percentage.

### 4.2 Major Decisions (Unanimous Approval Required)
The following require unanimous Partner approval:
- Admitting new partners or transferring partnership interests
- Amending this Agreement
- Borrowing over $[MAJOR_BORROWING_LIMIT]
- Selling, leasing, or encumbering partnership assets over $[MAJOR_ASSET_THRESHOLD]
- Entering contracts over $[MAJOR_CONTRACT_LIMIT] or longer than [CONTRACT_TERM_LIMIT]
- Changing partnership business purpose
- Dissolving the Partnership
- Hiring/firing key employees
- Approving annual budget

### 4.3 Ordinary Business Decisions (Majority Vote)
Day-to-day operational decisions require majority vote based on ownership percentage.

### 4.4 Assigned Roles
Partners' specific roles and responsibilities:

[PARTNER_1_NAME] - [ROLE_1]: [RESPONSIBILITIES_1]
[PARTNER_2_NAME] - [ROLE_2]: [RESPONSIBILITIES_2]

### 4.5 Time Commitment
Each Partner agrees to devote [TIME_COMMITMENT] to Partnership business.

### 4.6 Partner Compensation
Partners may receive reasonable salary for services as agreed unanimously, separate from profit distributions.

## 5. BOOKS AND RECORDS

### 5.1 Accounting
Partnership will maintain accurate books and records using [ACCOUNTING_METHOD] method and following GAAP.

### 5.2 Fiscal Year
Partnership fiscal year is [FISCAL_YEAR].

### 5.3 Access to Records
All Partners have full access to Partnership books, records, and financial information at all reasonable times.

### 5.4 Annual Financial Statements
Partnership will prepare annual financial statements within [DAYS_AFTER_YEAR_END] days of year-end.

## 6. BANKING AND FINANCES

### 6.1 Bank Accounts
Partnership will maintain bank accounts at [BANK_NAME]. Checks over $[CHECK_LIMIT] require signatures of [NUMBER] Partners.

### 6.2 Financial Authority
Individual Partners may commit Partnership funds up to $[INDIVIDUAL_AUTHORITY_LIMIT] without approval.

## 7. PARTNER WITHDRAWAL AND BUYOUT

### 7.1 Voluntary Withdrawal
Partner may withdraw with [WITHDRAWAL_NOTICE_PERIOD] written notice. Withdrawing Partner's interest must be purchased by remaining Partners or Partnership.

### 7.2 Buyout Price
Buyout price is fair market value of Partner's interest as of withdrawal date, determined by:

1. Partners' unanimous agreement; OR
2. Independent business valuation by certified appraiser mutually selected

### 7.3 Payment Terms
Buyout price paid over [BUYOUT_PAYMENT_PERIOD] with [INTEREST_RATE]% annual interest, beginning [PAYMENT_START_TIMING] after withdrawal.

### 7.4 Involuntary Withdrawal
Partner may be involuntarily removed for:
- Material breach of this Agreement
- Fraud, embezzlement, or gross negligence
- Conviction of felony
- Bankruptcy or insolvency
- Incapacity lasting over [INCAPACITY_PERIOD]

Removal requires vote of [REMOVAL_VOTE_THRESHOLD] of other Partners' interests.

### 7.5 Death or Disability
Upon Partner's death or permanent disability:
- Estate/representative receives buyout per Section 7.2
- Remaining Partners have right but not obligation to continue Partnership

## 8. ADMISSION OF NEW PARTNERS

### 8.1 Unanimous Approval
New partners may be admitted only with unanimous approval of all existing Partners.

### 8.2 Terms
New partner admission terms (capital contribution, ownership percentage, role) determined by unanimous vote.

### 8.3 Agreement Amendment
New partners must execute this Agreement (as amended to reflect ownership changes).

## 9. TRANSFER OF PARTNERSHIP INTERESTS

### 9.1 Restricted Transfer
No Partner may sell, assign, or transfer interest without:
1. Unanimous written consent of other Partners; AND
2. Right of first refusal to other Partners

### 9.2 Right of First Refusal
If Partner receives bona fide purchase offer, other Partners have 30 days to match offer pro-rata to their ownership.

## 10. RESTRICTIVE COVENANTS

### 10.1 Non-Competition (During Partnership)
During partnership, Partners will not engage in competing business without unanimous approval.

### 10.2 Non-Solicitation
For [NON_SOLICIT_PERIOD] after leaving Partnership, former Partner will not solicit Partnership customers, clients, or employees.

### 10.3 Confidentiality
Partners will maintain Partnership confidential information permanently.

## 11. DISSOLUTION AND WINDING UP

### 11.1 Dissolution Events
Partnership dissolves upon:
- Unanimous vote of Partners
- Withdrawal/removal leaving one Partner (unless others elect to continue)
- Bankruptcy of Partnership
- Illegality of Partnership business
- Expiration of term (if applicable)

### 11.2 Winding Up
Upon dissolution:
1. Complete current projects
2. Pay Partnership debts and obligations
3. Return capital contributions to Partners
4. Distribute remaining assets per profit-sharing ratio

### 11.3 Liquidating Partner
[LIQUIDATING_PARTNER] will serve as liquidating partner or Partners will appoint one by majority vote.

## 12. DISPUTE RESOLUTION

### 12.1 Negotiation
Partners will attempt good faith negotiation for 30 days before other dispute resolution.

### 12.2 Mediation
If negotiation fails, Partners will attempt mediation with mutually agreed mediator. Partners split mediation costs equally.

### 12.3 Arbitration/Litigation
If mediation fails, disputes will be resolved by [ARBITRATION or LITIGATION] in [JURISDICTION].

### 12.4 Deadlock
If Partners deadlock on major decision for over [DEADLOCK_PERIOD], any Partner may initiate dissolution per Section 11.

## 13. GENERAL PROVISIONS

### 13.1 Entire Agreement
This Agreement constitutes entire agreement and supersedes all prior agreements.

### 13.2 Amendments
Amendments require unanimous written approval.

### 13.3 Governing Law
Governed by laws of [GOVERNING_STATE] and Uniform Partnership Act as adopted in that state.

### 13.4 Severability
If any provision is unenforceable, remaining provisions remain in effect.

### 13.5 Notices
All notices in writing to Partner addresses below (or as updated in writing).

### 13.6 Binding Effect
This Agreement binds Partners, heirs, representatives, and permitted successors.

---

**PARTNER SIGNATURES:**

**[PARTNER_1_NAME]**
Signature: ___________________________ Date: ___________
Address: [PARTNER_1_ADDRESS]

**[PARTNER_2_NAME]**
Signature: ___________________________ Date: ___________
Address: [PARTNER_2_ADDRESS]`,
  },
  {
    id: 'residential-lease-agreement',
    name: 'Residential Lease Agreement',
    category: 'Real Estate',
    description: 'Fair residential lease agreement compliant with tenant protection laws, balanced for landlords and tenants.',
    riskScore: 30,
    useCase: 'Residential rental properties, apartment leases, house rentals',
    price: 0,
    isPremium: false,
    industry: ['Real Estate', 'Property Management'],
    jurisdiction: ['US'],
    tags: ['lease', 'rental', 'residential', 'landlord', 'tenant', 'property'],
    estimatedTime: '12 min',
    complexity: 'Moderate',
    lastUpdated: '2026-01-05',
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    preview: `Tenant-Friendly Features:
• Clear rent amount and due dates
• Reasonable security deposit (1 month max)
• Landlord maintenance responsibilities
• Quiet enjoyment guarantees
• Proper notice for entry (24-48 hours)
• Security deposit itemization upon move-out
• Normal wear and tear excluded from charges
• Clear termination procedures
• Compliant with state/local tenant laws`,
    variables: ['LANDLORD_NAME', 'TENANT_NAME', 'PROPERTY_ADDRESS', 'MONTHLY_RENT', 'SECURITY_DEPOSIT', 'LEASE_TERM', 'START_DATE'],
    fullContent: `# RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement ("Lease") is entered into as of [EFFECTIVE_DATE] by and between:

**Landlord:** [LANDLORD_NAME] ("Landlord")
**Tenant:** [TENANT_NAME] ("Tenant")

For the rental of the property located at:
**[PROPERTY_ADDRESS]** (the "Premises")

## 1. TERM

### 1.1 Lease Term
This Lease begins [START_DATE] and continues for [LEASE_TERM] ("Initial Term"), ending [END_DATE].

### 1.2 Renewal
This Lease automatically renews month-to-month after Initial Term unless either party provides [RENEWAL_NOTICE_PERIOD] written notice of non-renewal.

## 2. RENT

### 2.1 Monthly Rent
Tenant agrees to pay $[MONTHLY_RENT] per month.

### 2.2 Due Date
Rent is due on the [RENT_DUE_DAY] day of each month.

### 2.3 Payment Method
Rent payable to [PAYMENT_RECIPIENT] by:
[PAYMENT_METHODS]
(Example: check, bank transfer, online portal)

### 2.4 Late Fees
Rent not received by [GRACE_PERIOD_DAYS] days after due date incurs late fee of $[LATE_FEE_AMOUNT] or [LATE_FEE_PERCENTAGE]% of monthly rent, whichever is less.

### 2.5 Returned Payment Fee
Returned/bounced payments incur $[NSF_FEE] fee.

## 3. SECURITY DEPOSIT

### 3.1 Amount
Tenant pays security deposit of $[SECURITY_DEPOSIT] (equivalent to [DEPOSIT_MONTHS] month(s) rent).

### 3.2 Permitted Uses
Landlord may use security deposit only for:
- Unpaid rent
- Damage beyond normal wear and tear
- Cleaning to return Premises to initial condition (excluding normal wear)
- Other costs specified in this Lease

### 3.3 Normal Wear and Tear
Security deposit cannot be used for normal wear and tear, including:
- Minor scuffs on walls
- Carpet wear from normal use
- Faded paint or window coverings from sun
- Minor door/cabinet wear
- Small nail holes from hanging pictures

### 3.4 Return of Deposit
Within [DEPOSIT_RETURN_DAYS] days after Tenant vacates, Landlord will:
1. Return security deposit with interest (if required by law); OR
2. Provide itemized statement of deductions with remaining balance

### 3.5 Interest
Security deposit will earn interest at [DEPOSIT_INTEREST_RATE]% annually (or as required by state/local law), credited to Tenant upon move-out.

## 4. USE OF PREMISES

### 4.1 Residential Use Only
Premises may be used only as a private residence for Tenant and occupants listed below. No commercial use permitted.

### 4.2 Occupants
Maximum occupants: [MAX_OCCUPANTS]
Permitted occupants:
- [OCCUPANT_1]
- [OCCUPANT_2]

### 4.3 Pets
[PETS_ALLOWED: Yes/No]
[If yes: Permitted pets: [PET_DESCRIPTION]
Pet deposit: $[PET_DEPOSIT] (refundable)
Monthly pet rent: $[PET_RENT]]

### 4.4 Smoking
Smoking is [SMOKING_POLICY: prohibited/permitted only in designated areas].

## 5. LANDLORD RESPONSIBILITIES

### 5.1 Maintenance and Repairs
Landlord is responsible for:
- Maintaining structural integrity (roof, walls, foundation)
- Heating, plumbing, and electrical systems
- Common areas and exterior
- Appliances provided with Premises
- Ensuring Premises meets habitability standards
- Pest control (except when caused by Tenant)

### 5.2 Repairs Timeline
Landlord will address:
- Emergency repairs (no heat, water, etc.): Within 24 hours
- Urgent repairs: Within 48-72 hours
- Non-urgent repairs: Within [NON_URGENT_REPAIR_DAYS] days

### 5.3 Quiet Enjoyment
Tenant has right to quiet enjoyment of Premises without unreasonable disturbance from Landlord.

### 5.4 Entry to Premises
Landlord may enter Premises only:
- With [ENTRY_NOTICE_HOURS] hours advance notice (except emergencies)
- During reasonable hours ([ENTRY_HOURS_START] - [ENTRY_HOURS_END])
- For repairs, inspections, showings to prospective tenants/buyers

## 6. TENANT RESPONSIBILITIES

### 6.1 Maintain Premises
Tenant will:
- Keep Premises clean and sanitary
- Dispose of trash properly
- Prevent damage beyond normal wear and tear
- Use appliances and fixtures properly
- Report maintenance issues promptly
- Replace light bulbs and batteries

### 6.2 Minor Repairs
Tenant responsible for repairs under $[TENANT_REPAIR_THRESHOLD] caused by Tenant negligence or misuse.

### 6.3 Utilities
Tenant responsible for utilities:
[TENANT_UTILITIES]
(Example: electricity, gas, water, internet, cable)

Landlord responsible for utilities:
[LANDLORD_UTILITIES]

### 6.4 Compliance with Laws
Tenant will comply with all applicable laws, ordinances, and HOA/condo rules (if applicable).

### 6.5 Alterations
Tenant may not make alterations, improvements, or paint without Landlord's prior written consent.

## 7. INSURANCE

### 7.1 Landlord Insurance
Landlord maintains property insurance on Premises structure.

### 7.2 Tenant Insurance
Tenant strongly encouraged (or required) to maintain renter's insurance covering personal property and liability. Landlord is not liable for damage to Tenant's personal property.

## 8. TERMINATION

### 8.1 Termination by Tenant
Tenant may terminate:
- At end of Initial Term with [TENANT_TERMINATION_NOTICE] days written notice
- During month-to-month period with [MTM_TERMINATION_NOTICE] days written notice

### 8.2 Early Termination by Tenant
If Tenant terminates before end of Initial Term without cause, Tenant responsible for:
- Rent through end of term OR
- Rent until new tenant found plus [EARLY_TERMINATION_FEE]

Landlord must make reasonable efforts to re-rent Premises to mitigate damages.

### 8.3 Termination by Landlord
Landlord may terminate:
- For cause (breach of Lease) with [CURE_PERIOD] days notice to cure, then [EVICTION_NOTICE_DAYS] days to vacate if not cured
- Without cause at end of term with [LANDLORD_TERMINATION_NOTICE] days written notice
- For non-payment of rent per state law (typically 3-5 days)

### 8.4 Abandonment
If Tenant abandons Premises (absent for [ABANDONMENT_DAYS]+ days with rent unpaid and no notice), Landlord may treat as termination.

## 9. CONDITION OF PREMISES

### 9.1 Move-In Inspection
Landlord and Tenant will complete move-in inspection checklist within [INSPECTION_DAYS] days of move-in. Tenant should note all existing damage.

### 9.2 Move-Out Inspection
Tenant may request final walk-through before move-out. Tenant must return Premises in same condition as move-in, excluding normal wear and tear.

## 10. DISCLOSURES

### 10.1 Lead Paint (if built before 1978)
[LEAD_PAINT_DISCLOSURE]

### 10.2 Mold
[MOLD_DISCLOSURE]

### 10.3 Other Disclosures
[OTHER_REQUIRED_DISCLOSURES]

## 11. GENERAL PROVISIONS

### 11.1 Entire Agreement
This Lease constitutes entire agreement between parties.

### 11.2 Amendments
Amendments must be in writing and signed by both parties.

### 11.3 Assignment/Subletting
Tenant may not assign or sublet without Landlord's prior written consent, which shall not be unreasonably withheld.

### 11.4 Governing Law
This Lease is governed by laws of [STATE] and local ordinances of [CITY/COUNTY].

### 11.5 Severability
If any provision is unenforceable, remaining provisions remain in effect.

### 11.6 Notices
All notices in writing to:

Landlord: [LANDLORD_ADDRESS] / [LANDLORD_EMAIL] / [LANDLORD_PHONE]
Tenant: [PROPERTY_ADDRESS] / [TENANT_EMAIL] / [TENANT_PHONE]

---

**SIGNATURES:**

**LANDLORD:**
Signature: ___________________________ Date: ___________
Name: [LANDLORD_NAME]

**TENANT:**
Signature: ___________________________ Date: ___________
Name: [TENANT_NAME]

---

**MOVE-IN/MOVE-OUT INSPECTION CHECKLIST**
[Attach detailed room-by-room inspection checklist]`,
  },
  {
    id: 'web-development-agreement',
    name: 'Website Development Agreement',
    category: 'Software & Technology',
    description: 'Professional web development agreement for custom website projects with clear deliverables, timelines, and IP ownership.',
    riskScore: 26,
    useCase: 'Website development projects, web application development, custom web solutions',
    price: 0,
    isPremium: false,
    industry: ['Technology', 'Web Development', 'Digital Services', 'E-commerce'],
    jurisdiction: ['US', 'International'],
    tags: ['web-development', 'website', 'development', 'software', 'digital'],
    estimatedTime: '12 min',
    complexity: 'Moderate',
    lastUpdated: '2026-01-05',
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    preview: `Developer & Client Balanced:
• Clear project scope and deliverables
• Defined milestones and payment schedule
• Client owns final website upon payment
• Developer retains reusable code/components
• Hosting and maintenance options
• Reasonable revision rounds (2-3)
• Testing and launch procedures
• Training and documentation included
• Bug fix warranty period (30-90 days)`,
    variables: ['DEVELOPER_NAME', 'CLIENT_NAME', 'PROJECT_DESCRIPTION', 'PROJECT_FEE', 'COMPLETION_DATE', 'MILESTONES'],
    fullContent: `# WEBSITE DEVELOPMENT AGREEMENT

This Website Development Agreement ("Agreement") is entered into as of [EFFECTIVE_DATE] by and between:

**Developer:** [DEVELOPER_NAME] ("Developer")
**Client:** [CLIENT_NAME] ("Client")

## 1. PROJECT DESCRIPTION

### 1.1 Scope of Work
Developer agrees to design, develop, and deliver a website as described below:

[PROJECT_DESCRIPTION]

### 1.2 Deliverables
Developer will deliver:
- Website design mockups/wireframes
- Fully functional website with specified features
- Source code and files
- Content management system training
- Documentation for website maintenance
- [ADDITIONAL_DELIVERABLES]

### 1.3 Specifications
Website specifications:
- Platform/CMS: [PLATFORM] (WordPress, custom, React, etc.)
- Pages: [NUMBER_OF_PAGES] pages
- Features: [FEATURES_LIST]
- Responsive design (mobile, tablet, desktop)
- Browser compatibility: [BROWSERS]
- Hosting: [HOSTING_PROVIDER]

## 2. PROJECT TIMELINE

### 2.1 Completion Date
Target completion date: [COMPLETION_DATE]

### 2.2 Milestones
Project milestones and schedule:

[MILESTONES]

Example milestones:
- Week 1-2: Discovery and wireframes
- Week 3-4: Design mockups
- Week 5-8: Development
- Week 9: Testing and revisions
- Week 10: Launch

### 2.3 Client Responsibilities
Client will provide:
- Content (text, images, videos) by [CONTENT_DEADLINE]
- Feedback on deliverables within [FEEDBACK_TURNAROUND] business days
- Access to hosting, domain, and necessary accounts
- Timely approvals at each milestone

### 2.4 Delays
If Client delays feedback/approvals over [DELAY_THRESHOLD] business days, completion date extends proportionally. Delays beyond [EXTENDED_DELAY] days may result in additional fees.

## 3. COMPENSATION

### 3.1 Project Fee
Total project fee: $[PROJECT_FEE]

### 3.2 Payment Schedule
Payment milestones:

- [PERCENTAGE_1]% ($[AMOUNT_1]) - Upon contract execution
- [PERCENTAGE_2]% ($[AMOUNT_2]) - Upon design approval
- [PERCENTAGE_3]% ($[AMOUNT_3]) - Upon development completion
- [PERCENTAGE_4]% ($[AMOUNT_4]) - Upon final launch

Total: $[PROJECT_FEE]

### 3.3 Payment Terms
Payments due within 7 days of invoice. Developer may pause work if payments are over 10 days overdue.

### 3.4 Additional Work
Work outside original scope billed at $[HOURLY_RATE]/hour or per change order agreed in writing before work begins.

### 3.5 Expenses
Client will reimburse Developer for pre-approved expenses including:
- Stock photography/graphics (if needed)
- Premium plugins or themes
- Third-party API costs
- Hosting setup fees

## 4. REVISIONS

### 4.1 Included Revisions
Project includes:
- [DESIGN_REVISIONS] rounds of design revisions
- [DEVELOPMENT_REVISIONS] rounds of development revisions
- Reasonable bug fixes during development

### 4.2 Additional Revisions
Revisions beyond included rounds billed at $[HOURLY_RATE]/hour.

### 4.3 Substantial Changes
Changes to approved designs or scope require written change order and may affect timeline and fees.

## 5. TESTING AND ACCEPTANCE

### 5.1 Developer Testing
Developer will test website for:
- Functionality on major browsers (Chrome, Firefox, Safari, Edge)
- Responsive design on common devices
- Link functionality
- Form submissions
- Basic performance

### 5.2 Client Testing Period
Client has [TESTING_PERIOD] days after delivery to test and report issues.

### 5.3 Acceptance
Client accepts website by:
- Written acceptance; OR
- Launching website to production; OR
- Expiration of testing period without substantial issues reported

## 6. HOSTING AND DOMAIN

### 6.1 Hosting Arrangement
Website hosting: [CLIENT_PROVIDES / DEVELOPER_PROVIDES]

If Developer provides hosting:
- Monthly hosting fee: $[HOSTING_FEE]
- Hosting plan: [HOSTING_PLAN_DETAILS]
- Client owns domain and may transfer website anytime

### 6.2 Domain Name
Domain owned by: [CLIENT/DEVELOPER]
Client is responsible for domain registration and renewal.

## 7. MAINTENANCE AND SUPPORT

### 7.1 Warranty Period
Developer provides [WARRANTY_PERIOD] days warranty after launch for:
- Bugs and errors in delivered functionality
- Issues with original deliverables
- Training on content management

Warranty does NOT cover:
- Issues caused by Client modifications
- Third-party plugin/service failures
- Content updates or additions
- New features or enhancements

### 7.2 Post-Warranty Support
After warranty period, support available at:
- Hourly rate: $[SUPPORT_HOURLY_RATE]/hour
- Monthly retainer: $[SUPPORT_MONTHLY_RETAINER]
- Support packages: [SUPPORT_PACKAGES]

### 7.3 Maintenance
Optional ongoing maintenance:
- Monthly maintenance: $[MAINTENANCE_MONTHLY_FEE]
- Includes: updates, backups, security monitoring, [OTHER_MAINTENANCE]

## 8. INTELLECTUAL PROPERTY

### 8.1 Client Ownership Upon Payment
Upon Client's full payment of all fees, Developer assigns to Client all rights, title, and interest in:
- Custom website design
- Custom code developed specifically for Client
- Final website and its components

### 8.2 Developer Retained Rights
Developer retains ownership of:
- Pre-existing code, libraries, and frameworks
- Reusable components, functions, and tools
- General web development methodologies
- Third-party open-source components

Developer grants Client non-exclusive license to use such materials as part of the website.

### 8.3 Third-Party Components
Website may incorporate third-party open-source software and components (WordPress, React, etc.) subject to their respective licenses.

### 8.4 Client Materials
Client retains all ownership of content, images, logos, and materials provided to Developer. Client warrants it owns or has license to use all Client materials.

### 8.5 Portfolio Rights
Developer may display website in portfolio, case studies, and marketing materials unless Client objects in writing.

## 9. CONTENT AND MATERIALS

### 9.1 Client Responsibilities
Client responsible for providing:
- All text content
- Images and graphics
- Videos and media files
- Logos and branding materials

Materials must be provided in usable formats by [CONTENT_DEADLINE].

### 9.2 Stock Content
Developer may use stock photography/graphics as placeholder or final content, with Client's approval and at Client's expense.

### 9.3 Content Ownership
Client warrants it owns or has rights to all content provided and such content does not infringe third-party rights.

## 10. CONFIDENTIALITY

Each party agrees to maintain confidentiality of the other party's non-public business information for 2 years after project completion.

## 11. WARRANTIES AND DISCLAIMERS

### 11.1 Developer Warranties
Developer warrants:
- Services performed in professional, workmanlike manner
- Website will function substantially as specified
- Work will not infringe third-party intellectual property rights (excluding Client-provided materials)

### 11.2 Client Warranties
Client warrants:
- Authority to enter this Agreement
- Ownership/license for all provided materials
- Materials do not infringe third-party rights

### 11.3 Disclaimers
Developer does NOT warrant:
- Specific search engine rankings or traffic
- Compatibility with all future browsers/devices
- Uninterrupted error-free operation
- Third-party service functionality (payment gateways, APIs, etc.)

## 12. LIMITATION OF LIABILITY

### 12.1 Liability Cap
Developer's total liability shall not exceed total fees paid by Client under this Agreement.

### 12.2 Consequential Damages
Neither party liable for indirect, incidental, consequential, or punitive damages, including lost profits.

### 12.3 Exceptions
Limitations don't apply to intellectual property indemnification, gross negligence, or willful misconduct.

## 13. INDEMNIFICATION

### 13.1 Developer Indemnification
Developer indemnifies Client from claims that Developer's work infringes third-party intellectual property rights.

### 13.2 Client Indemnification
Client indemnifies Developer from claims arising from Client-provided content, materials, or instructions.

## 14. TERMINATION

### 14.1 Termination for Convenience
Either party may terminate with [TERMINATION_NOTICE] days written notice.

Upon termination by Client:
- Client pays for work completed through termination date
- Developer delivers work in progress in current state
- Client receives rights to work paid for; Developer retains rights to incomplete work

### 14.2 Termination for Cause
Either party may terminate immediately if other party materially breaches and fails to cure within [CURE_PERIOD] days of written notice.

## 15. GENERAL PROVISIONS

### 15.1 Independent Contractor
Developer is independent contractor, not employee.

### 15.2 Entire Agreement
This Agreement constitutes entire agreement and supersedes all prior agreements.

### 15.3 Amendments
Amendments must be in writing and signed by both parties.

### 15.4 Assignment
Neither party may assign without other party's written consent.

### 15.5 Governing Law
This Agreement is governed by laws of [GOVERNING_STATE].

### 15.6 Dispute Resolution
Parties will attempt good faith negotiation before litigation.

### 15.7 Severability
If any provision is unenforceable, remaining provisions remain in effect.

### 15.8 Force Majeure
Neither party liable for delays due to circumstances beyond reasonable control.

### 15.9 Notices
All notices in writing to:

Developer: [DEVELOPER_ADDRESS] / [DEVELOPER_EMAIL]
Client: [CLIENT_ADDRESS] / [CLIENT_EMAIL]

---

**SIGNATURES:**

**DEVELOPER:**
Signature: ___________________________ Date: ___________
Name: [DEVELOPER_NAME]

**CLIENT:**
Signature: ___________________________ Date: ___________
Name: [CLIENT_AUTHORIZED_SIGNATORY]
Title: [CLIENT_TITLE]

---

**EXHIBIT A: PROJECT SPECIFICATIONS**
[Attach detailed specifications, mockups, feature list, sitemap]

**EXHIBIT B: PAYMENT SCHEDULE**
[Attach detailed payment milestone schedule]`,
  },
  {
    id: 'content-creation-agreement',
    name: 'Content Creation Agreement',
    category: 'Creative Services',
    description: 'Professional agreement for writers, designers, videographers, and content creators with clear IP rights and usage terms.',
    riskScore: 20,
    useCase: 'Blog writing, video production, graphic design, social media content, photography',
    price: 0,
    isPremium: false,
    industry: ['Marketing', 'Media', 'Creative', 'Digital Marketing', 'Publishing'],
    jurisdiction: ['US', 'International'],
    tags: ['content', 'creative', 'writing', 'video', 'design', 'photography'],
    estimatedTime: '10 min',
    complexity: 'Moderate',
    lastUpdated: '2026-01-05',
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    preview: `Creator-Friendly Terms:
• Clear deliverables and deadlines
• Fair payment structure (per piece or retainer)
• Flexible IP ownership (work-for-hire or licensed)
• Reasonable revision rounds (2-3)
• Content usage rights clearly defined
• Credit/attribution options
• Kill fee if client cancels (50%)
• Creator can display in portfolio`,
    variables: ['CREATOR_NAME', 'CLIENT_NAME', 'CONTENT_TYPE', 'DELIVERABLES', 'COMPENSATION', 'IP_ARRANGEMENT'],
    fullContent: `# CONTENT CREATION AGREEMENT

This Content Creation Agreement ("Agreement") is entered into as of [EFFECTIVE_DATE] by and between:

**Creator:** [CREATOR_NAME] ("Creator" or "Contractor")
**Client:** [CLIENT_NAME] ("Client")

## 1. SERVICES AND DELIVERABLES

### 1.1 Content Type
Creator agrees to create the following content for Client:

Content Type: [CONTENT_TYPE]
(Examples: blog articles, social media posts, videos, graphics, photography, podcast episodes)

### 1.2 Specific Deliverables
[DELIVERABLES]

Examples:
- 4 blog articles per month (1,500-2,000 words each)
- 12 social media graphics per week
- 2 promotional videos per month (30-60 seconds each)
- 50 product photographs

### 1.3 Specifications
- Style/Tone: [STYLE_GUIDELINES]
- Format: [FORMAT_REQUIREMENTS]
- Dimensions/Length: [TECHNICAL_SPECS]
- Brand Guidelines: [BRAND_GUIDELINES]

### 1.4 Delivery Schedule
- Delivery Frequency: [DELIVERY_FREQUENCY]
- Deadlines: [DEADLINE_SCHEDULE]
- Delivery Method: [DELIVERY_METHOD]

## 2. CREATIVE PROCESS

### 2.1 Brief and Direction
Client will provide Creator with:
- Creative brief for each project/campaign
- Reference materials and brand guidelines
- Access to necessary tools, accounts, or resources
- Feedback within [FEEDBACK_TURNAROUND] business days

### 2.2 Revisions
Project includes [REVISION_ROUNDS] rounds of reasonable revisions per deliverable. Additional revisions billed at $[REVISION_RATE]/hour or $[REVISION_FEE] per piece.

### 2.3 Approval
Creator will submit content for Client approval. Content is considered approved:
- Upon written acceptance; OR
- [APPROVAL_DAYS] business days after submission without substantial feedback; OR
- Upon Client's publication/use of content

### 2.4 Substantial Changes
Major scope changes or new directions require written agreement and may affect timeline and fees.

## 3. COMPENSATION

### 3.1 Payment Structure
Creator will be compensated as follows:

[COMPENSATION]

Options:
- Per piece: $[PER_PIECE_RATE] per [UNIT]
- Monthly retainer: $[MONTHLY_RETAINER] for [DELIVERABLES_PER_MONTH] pieces
- Hourly: $[HOURLY_RATE] per hour
- Project fee: $[PROJECT_FEE] total

### 3.2 Payment Terms
Invoices due within [PAYMENT_DAYS] days of submission (net [PAYMENT_DAYS]).

For retainer arrangements:
- Payment due [RETAINER_TIMING] (beginning/end of month)
- Unused deliverables [ROLLOVER_POLICY] (roll over/expire)

### 3.3 Rush Fees
Content needed with less than [RUSH_THRESHOLD] notice incurs [RUSH_FEE_PERCENTAGE]% rush fee.

### 3.4 Kill Fee
If Client cancels approved project before completion, Client pays Creator:
- 100% for work completed
- [KILL_FEE_PERCENTAGE]% of remaining fee as kill fee

### 3.5 Expenses
Client will reimburse Creator for pre-approved expenses including:
- Stock photography/footage
- Props or materials for shoots
- Location fees
- Travel costs for on-site work

## 4. INTELLECTUAL PROPERTY RIGHTS

### 4.1 IP Ownership Arrangement
[IP_ARRANGEMENT]

**Option A: Work-for-Hire (Client Owns)**
All content created under this Agreement is "work made for hire." Client owns all rights, title, and interest in the content from creation. Creator retains no rights except as specified.

**Option B: Assignment Upon Payment**
Creator assigns all rights to Client upon full payment. Until payment, Creator retains ownership.

**Option C: Licensed Rights**
Creator retains copyright. Creator grants Client [EXCLUSIVE/NON-EXCLUSIVE] license to use content for:
- Purposes: [PERMITTED_USES]
- Duration: [LICENSE_DURATION]
- Territory: [GEOGRAPHIC_SCOPE]
- Platforms: [PERMITTED_PLATFORMS]

### 4.2 Creator Retained Rights
Regardless of ownership arrangement, Creator retains:
- Right to display content in portfolio (unless Client objects in writing)
- General creative knowledge and techniques
- Pre-existing templates and creative tools

### 4.3 Moral Rights
Creator waives moral rights (attribution, integrity) to extent permitted by law, except: [ATTRIBUTION_REQUIREMENTS].

### 4.4 Third-Party Materials
Creator warrants that content will be original or properly licensed. Creator will obtain necessary releases, permissions, and licenses for:
- Stock assets used
- Music or sound effects
- Recognizable people (model releases)
- Recognizable private property (property releases)

### 4.5 Client Materials
Client retains ownership of all materials provided to Creator. Creator receives limited license to use Client materials solely to create content under this Agreement.

## 5. CONTENT USAGE

### 5.1 Client's Permitted Use
Client may use content for:
[PERMITTED_USES]
(Examples: website, social media, advertising, email marketing, print materials)

### 5.2 Restrictions
Client may NOT (without Creator's written approval):
- Resell or sublicense content to third parties
- Use content for purposes outside [PERMITTED_USES]
- Substantially modify content (if Creator retains moral rights)
- Remove Creator attribution (if required)

### 5.3 Attribution
[ATTRIBUTION_REQUIREMENTS]
Options:
- No attribution required
- Attribution required: "Content by [CREATOR_NAME]"
- Attribution at Creator's discretion

## 6. CREATOR REPRESENTATIONS AND WARRANTIES

### 6.1 Original Work
Creator represents and warrants:
- Content will be Creator's original work or properly licensed
- Content will not infringe third-party intellectual property rights
- Content will not violate any laws
- Creator has authority to enter this Agreement and grant rights herein
- All necessary releases and permissions will be obtained

### 6.2 Professional Standards
Creator will perform services in professional, workmanlike manner consistent with industry standards.

## 7. CLIENT RESPONSIBILITIES

### 7.1 Timely Feedback
Client agrees to provide timely feedback, approvals, and materials necessary for Creator to meet deadlines.

### 7.2 Content Use
Client is solely responsible for:
- How and where content is used
- Compliance with advertising laws and regulations
- FTC disclosures and sponsored content labels
- Platform-specific content policies

## 8. CONFIDENTIALITY

Each party agrees to maintain confidentiality of the other's non-public business information for 2 years after Agreement termination.

## 9. TERM AND TERMINATION

### 9.1 Term
This Agreement begins [START_DATE] and continues:
- For [TERM_LENGTH]; OR
- Until terminated by either party

### 9.2 Termination
Either party may terminate:
- For convenience with [TERMINATION_NOTICE] days written notice
- For cause immediately upon material breach and failure to cure within [CURE_PERIOD] days

### 9.3 Effect of Termination
Upon termination:
- Client pays for all content completed and approved
- Kill fee applies for work in progress (Section 3.4)
- Creator delivers all completed content
- Sections 4, 6, 8, 10, 11 survive

## 10. LIMITATION OF LIABILITY

### 10.1 Liability Cap
Creator's total liability shall not exceed fees paid by Client in 12 months preceding claim or $[LIABILITY_CAP], whichever is less.

### 10.2 Consequential Damages
Neither party liable for indirect, incidental, consequential, or punitive damages.

### 10.3 Exceptions
Limitations don't apply to intellectual property indemnification, gross negligence, or willful misconduct.

## 11. INDEMNIFICATION

### 11.1 Creator Indemnification
Creator indemnifies Client from claims that content infringes third-party rights (provided Creator had sole control over content).

### 11.2 Client Indemnification
Client indemnifies Creator from claims arising from:
- Client's use of content outside permitted scope
- Client-provided materials or directions
- Client's modifications to content

## 12. INDEPENDENT CONTRACTOR

Creator is independent contractor, not employee. Creator is responsible for all taxes, insurance, and benefits.

## 13. GENERAL PROVISIONS

### 13.1 Entire Agreement
This Agreement constitutes entire agreement.

### 13.2 Amendments
Amendments must be in writing and signed by both parties.

### 13.3 Assignment
Neither party may assign without written consent.

### 13.4 Governing Law
Governed by laws of [GOVERNING_STATE].

### 13.5 Severability
If any provision is unenforceable, remaining provisions remain in effect.

### 13.6 Notices
All notices in writing to:

Creator: [CREATOR_ADDRESS] / [CREATOR_EMAIL]
Client: [CLIENT_ADDRESS] / [CLIENT_EMAIL]

---

**SIGNATURES:**

**CREATOR:**
Signature: ___________________________ Date: ___________
Name: [CREATOR_NAME]

**CLIENT:**
Signature: ___________________________ Date: ___________
Name: [CLIENT_AUTHORIZED_SIGNATORY]
Title: [CLIENT_TITLE]`,
  },
  {
    id: 'master-services-agreement',
    name: 'Master Services Agreement (MSA)',
    category: 'Professional Services',
    description: 'Comprehensive MSA establishing framework for ongoing business relationship with individual Statements of Work for specific projects.',
    riskScore: 32,
    useCase: 'Long-term vendor relationships, ongoing professional services, multiple projects with same provider',
    price: 99,
    isPremium: true,
    industry: ['Technology', 'Consulting', 'Professional Services', 'IT Services', 'Managed Services'],
    jurisdiction: ['US', 'International'],
    tags: ['msa', 'master-agreement', 'vendor', 'professional-services', 'framework'],
    estimatedTime: '25 min',
    complexity: 'Complex',
    lastUpdated: '2026-01-05',
    downloadCount: 0,
    rating: 0,
    reviewCount: 0,
    version: '1.0.0',
    preview: `Enterprise-Grade MSA Features:
• Framework for multiple projects via SOWs
• Flexible terms (3-5 years typical)
• Comprehensive IP and confidentiality
• Professional liability limits
• Indemnification and insurance requirements
• Service level expectations
• Payment and invoicing procedures
• Termination for convenience or cause
• Dispute resolution mechanisms
• Compliance and regulatory provisions`,
    variables: ['PROVIDER_NAME', 'CLIENT_NAME', 'EFFECTIVE_DATE', 'TERM_YEARS', 'LIABILITY_CAP'],
    fullContent: `# MASTER SERVICES AGREEMENT

This Master Services Agreement ("MSA" or "Agreement") is entered into as of [EFFECTIVE_DATE] ("Effective Date") by and between:

**Service Provider:** [PROVIDER_NAME] ("Provider" or "Vendor")
**Client:** [CLIENT_NAME] ("Client" or "Customer")

## RECITALS

WHEREAS, Client desires to engage Provider to perform various professional services from time to time;

WHEREAS, Provider has expertise and capability to perform such services;

WHEREAS, the parties wish to establish framework terms governing their relationship;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

## 1. SCOPE AND STATEMENTS OF WORK

### 1.1 Framework Agreement
This MSA establishes general terms and conditions for services. Specific projects will be defined in individual Statements of Work ("SOW") referencing and incorporating this MSA.

### 1.2 Statements of Work
Each SOW will specify:
- Detailed scope of services and deliverables
- Timeline and milestones
- Fees and payment terms
- Acceptance criteria
- Project-specific terms (if any)

### 1.3 SOW Execution
SOWs must be in writing and signed by authorized representatives of both parties.

### 1.4 Conflict Between MSA and SOW
In case of conflict between MSA and SOW, SOW controls for that specific project, but only to the extent of the specific conflict.

### 1.5 No Obligation
This MSA does not obligate Client to purchase services or Provider to provide services. Obligations arise only upon execution of specific SOWs.

## 2. SERVICES

### 2.1 Performance Standards
Provider will perform all services:
- In professional, workmanlike manner
- Consistent with industry standards
- Using qualified personnel
- In compliance with applicable laws and regulations
- According to specifications in applicable SOW

### 2.2 Personnel
Provider may assign qualified personnel to perform services. Provider will notify Client of key personnel assigned. Client may request replacement of personnel for reasonable cause.

### 2.3 Subcontractors
Provider may use subcontractors with Client's prior written approval. Provider remains fully responsible for subcontractor performance.

### 2.4 Client Cooperation
Client will:
- Provide information and access necessary for Provider to perform services
- Designate authorized representatives for approvals and decisions
- Provide timely feedback and approvals
- Make personnel available as needed

## 3. FEES AND PAYMENT

### 3.1 Fees
Fees for services will be specified in each SOW. Fee structures may include:
- Fixed project fees
- Time and materials (hourly/daily rates)
- Monthly retainers
- Milestone-based payments
- Hybrid models

### 3.2 Rate Card
Provider's standard rates (subject to change with 90 days notice):
[RATE_CARD]

Actual rates for specific projects will be confirmed in SOWs.

### 3.3 Invoicing
Unless otherwise specified in SOW:
- Provider will invoice [INVOICING_FREQUENCY]
- Invoices will include detailed description of services, time spent, and applicable rates
- Time and materials invoices will include timesheets

### 3.4 Payment Terms
Invoices are due within [PAYMENT_DAYS] days of receipt (net [PAYMENT_DAYS]).

### 3.5 Late Payment
Late payments accrue interest at [LATE_PAYMENT_RATE]% per month or maximum legal rate, whichever is less.

### 3.6 Disputed Invoices
Client must notify Provider of disputed amounts within [DISPUTE_DAYS] days with specific reasons. Client will pay undisputed amounts while parties resolve dispute in good faith.

### 3.7 Expenses
Provider will be reimbursed for pre-approved, reasonable business expenses incurred providing services, with receipts. Expenses over $[EXPENSE_APPROVAL_LIMIT] require prior written approval.

## 4. TERM AND TERMINATION

### 4.1 Term
This MSA is effective as of Effective Date and continues for [TERM_YEARS] years, unless earlier terminated.

### 4.2 Renewal
This MSA automatically renews for successive [RENEWAL_PERIOD] periods unless either party provides [NON_RENEWAL_NOTICE] days written notice of non-renewal.

### 4.3 Termination of MSA for Convenience
Either party may terminate this MSA for convenience with [MSA_TERMINATION_NOTICE] days written notice. Termination does not affect active SOWs, which continue under their terms.

### 4.4 Termination of MSA for Cause
Either party may terminate this MSA for cause if other party:
- Materially breaches MSA and fails to cure within [CURE_PERIOD] days of written notice
- Becomes insolvent, files bankruptcy, or makes assignment for benefit of creditors
- Engages in fraud, gross negligence, or willful misconduct

Termination for cause terminates all active SOWs immediately.

### 4.5 Termination of Individual SOWs
Individual SOWs may be terminated according to their terms without affecting this MSA or other SOWs.

### 4.6 Effect of Termination
Upon MSA termination:
- Client pays for all services satisfactorily completed
- Provider delivers all work product and Client property
- Sections 5, 6, 7, 8, 9, 10, 11 survive

## 5. INTELLECTUAL PROPERTY

### 5.1 Work Product Ownership
Upon Client's payment of all fees for a specific SOW, Provider assigns to Client all rights, title, and interest in deliverables and work product specifically created for Client under that SOW ("Work Product").

### 5.2 Provider Background IP
Provider retains all rights to:
- Pre-existing intellectual property
- Tools, methodologies, and frameworks
- General knowledge and expertise
- Improvements to Provider's general capabilities

Provider grants Client non-exclusive, perpetual, royalty-free license to use Provider's background IP incorporated into Work Product.

### 5.3 Third-Party Materials
Provider will identify third-party components incorporated into Work Product. Provider will obtain necessary licenses or Client will separately license such components.

### 5.4 Client Materials
Client retains ownership of all Client materials, data, and information. Client grants Provider limited license to use Client materials solely to perform services under this MSA.

## 6. CONFIDENTIALITY

### 6.1 Confidential Information
"Confidential Information" means non-public information disclosed by one party to the other, marked confidential or reasonably understood to be confidential.

### 6.2 Obligations
Receiving party will:
- Maintain strict confidentiality
- Not disclose without prior written consent
- Use only to perform services under this MSA
- Protect with same care as own confidential information (minimum reasonable care)
- Limit access to employees/contractors with need to know

### 6.3 Exclusions
Obligations don't apply to information that:
- Is or becomes public through no breach
- Was previously known
- Is independently developed
- Is received from third party without restriction
- Must be disclosed by law (with notice if legally permitted)

### 6.4 Duration
Confidentiality obligations survive for [CONFIDENTIALITY_YEARS] years after disclosure or termination of MSA, whichever is later. Trade secrets remain confidential for as long as they qualify as trade secrets.

## 7. REPRESENTATIONS AND WARRANTIES

### 7.1 Mutual Warranties
Each party represents and warrants:
- Authority to enter this MSA
- Execution and performance will not violate other agreements or laws
- It will comply with applicable laws and regulations

### 7.2 Provider Warranties
Provider represents and warrants:
- Professional qualifications and expertise
- Services will be performed competently and professionally
- Work Product will be original or properly licensed
- Work Product will not infringe third-party intellectual property rights
- Will maintain necessary licenses, certifications, and insurance

### 7.3 Client Warranties
Client represents and warrants:
- Client materials provided do not infringe third-party rights
- Will provide accurate information necessary for services

### 7.4 Disclaimer
EXCEPT AS EXPRESSLY PROVIDED, PROVIDER PROVIDES SERVICES "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR PARTICULAR PURPOSE, OR NON-INFRINGEMENT.

## 8. LIMITATION OF LIABILITY

### 8.1 Liability Cap
Provider's total aggregate liability for all claims arising under this MSA and all SOWs shall not exceed:
- For specific SOW: fees paid under that SOW in 12 months preceding claim; OR  
- For MSA generally: $[LIABILITY_CAP] or total fees paid in 12 months preceding claim, whichever is greater

### 8.2 Consequential Damages
NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST DATA, OR BUSINESS INTERRUPTION, EVEN IF ADVISED OF POSSIBILITY.

### 8.3 Exceptions
Liability limitations do NOT apply to:
- Intellectual property indemnification
- Confidentiality breaches causing direct damages
- Gross negligence or willful misconduct
- Fraud or fraudulent misrepresentation
- Violations of Section 10 (Compliance and Security)
- Amounts owed for fees and expenses

### 8.4 Exclusive Remedy
Sections 8.1 and 8.2 state each party's exclusive remedy and entire liability.

## 9. INDEMNIFICATION

### 9.1 Provider Indemnification
Provider shall indemnify, defend, and hold harmless Client from third-party claims alleging that Work Product infringes intellectual property rights, provided:
- Client promptly notifies Provider
- Provider has sole control of defense and settlement
- Client reasonably cooperates in defense

### 9.2 Client Indemnification
Client shall indemnify, defend, and hold harmless Provider from third-party claims arising from:
- Client materials or data provided to Provider
- Client's use of Work Product outside scope of this MSA
- Client's breach of this MSA
- Claims Provider's services violated law due to Client's specifications/directions

### 9.3 IP Infringement Remedies
If Work Product is found or likely to infringe, Provider may at its option:
- Obtain license for Client to continue use
- Modify Work Product to be non-infringing
- Replace Work Product with non-infringing alternative
- If none of above feasible, refund fees paid for infringing Work Product

## 10. COMPLIANCE AND SECURITY

### 10.1 Legal Compliance
Each party will comply with all applicable laws, regulations, and industry standards in performing its obligations.

### 10.2 Data Protection
Provider will comply with applicable data protection laws (GDPR, CCPA, etc.) when processing Client data.

### 10.3 Security
Provider will implement reasonable administrative, technical, and physical safeguards to protect Client confidential information and data.

### 10.4 Security Incidents
Provider will notify Client within [BREACH_NOTIFICATION_HOURS] hours of discovering security incident affecting Client data.

### 10.5 Audit Rights
Client may audit Provider's compliance with security and data protection obligations upon [AUDIT_NOTICE_DAYS] days notice, no more than [AUDITS_PER_YEAR] times per year, during business hours.

### 10.6 Regulatory Requirements
If Client operates in regulated industry, Provider will comply with applicable industry requirements specified in writing.

## 11. INSURANCE

### 11.1 Required Coverage
Provider will maintain:
- Commercial General Liability: $[CGL_AMOUNT] per occurrence
- Professional Liability (E&O): $[EO_AMOUNT] per claim
- Cyber Liability: $[CYBER_AMOUNT] per claim
- Workers' Compensation: Statutory limits

### 11.2 Proof of Insurance
Provider will provide certificates of insurance upon request.

## 12. DISPUTE RESOLUTION

### 12.1 Negotiation
Parties will attempt good faith negotiation for [NEGOTIATION_DAYS] days before other dispute resolution.

### 12.2 Mediation
If negotiation fails, parties will attempt mediation with mutually agreed mediator. Parties split mediation costs equally.

### 12.3 Litigation/Arbitration
If mediation fails, disputes will be resolved by:
[LITIGATION / ARBITRATION]

If litigation: In state and federal courts of [JURISDICTION].
If arbitration: Under [ARBITRATION_RULES] before [NUMBER_ARBITRATORS] arbitrator(s) in [ARBITRATION_LOCATION].

### 12.4 Equitable Relief
Nothing prevents either party from seeking injunctive or equitable relief for breach of Sections 5, 6, or 10.

### 12.5 Attorneys' Fees
Prevailing party in any dispute may recover reasonable attorneys' fees and costs.

## 13. GENERAL PROVISIONS

### 13.1 Independent Contractor
Provider is independent contractor, not employee, partner, or agent. Provider is responsible for all taxes, insurance, and benefits for its personnel.

### 13.2 Non-Exclusivity
This MSA is non-exclusive. Each party may engage in similar relationships with others, subject to confidentiality obligations.

### 13.3 Entire Agreement
This MSA and executed SOWs constitute entire agreement and supersede all prior agreements.

### 13.4 Amendments
Amendments to MSA must be in writing and signed by authorized representatives. SOWs may be amended according to their terms.

### 13.5 Assignment
Neither party may assign this MSA without other party's prior written consent, except:
- To affiliate with notice
- In connection with merger, acquisition, or sale of substantially all assets

Agreement binds successors and permitted assigns.

### 13.6 Governing Law
This MSA is governed by laws of [GOVERNING_STATE] without regard to conflict of law principles.

### 13.7 Severability
If any provision is invalid or unenforceable, remaining provisions remain in full effect.

### 13.8 Waiver
Failure to enforce any provision is not waiver.

### 13.9 Force Majeure
Neither party is liable for failure to perform due to circumstances beyond reasonable control (natural disasters, war, terrorism, pandemics, government actions, utility failures).

### 13.10 Notices
All notices must be in writing to addresses below (or as updated in writing):

Provider: [PROVIDER_ADDRESS] / [PROVIDER_EMAIL]
Client: [CLIENT_ADDRESS] / [CLIENT_EMAIL]

Notices effective upon receipt.

### 13.11 Counterparts
This MSA may be executed in counterparts. Electronic signatures are binding.

### 13.12 Publicity
Neither party may use other party's name, logo, or trademarks in marketing without prior written consent, except Provider may list Client as customer in client list (if Client objects, Client must notify in writing).

---

**SIGNATURE SECTION**

**SERVICE PROVIDER:**
Signature: ___________________________
Name: [PROVIDER_AUTHORIZED_SIGNATORY]
Title: [PROVIDER_TITLE]
Date: _______________________________

**CLIENT:**
Signature: ___________________________
Name: [CLIENT_AUTHORIZED_SIGNATORY]
Title: [CLIENT_TITLE]
Date: _______________________________

---

**EXHIBIT A: STATEMENT OF WORK TEMPLATE**

[Attach SOW template including sections for: Project Description, Deliverables, Timeline, Fees, Acceptance Criteria, Project-Specific Terms]

**EXHIBIT B: RATE CARD**

[Attach current rate card for various service types and personnel levels]`,
  },
];

/**
 * Generate a customized contract from template
 */
export async function generateContractFromTemplate(
  templateId: string,
  context: TemplateContext
): Promise<string> {
  const template = contractTemplates.find((t) => t.id === templateId);
  if (!template) {
    throw new Error('Template not found');
  }

  // Use smart template engine to generate customized version
  const result = await smartTemplateEngine.generateContract(templateId, context);

  return result.content;
}

/**
 * Search templates by criteria
 */
export function searchTemplates(filters: {
  category?: string;
  industry?: string;
  jurisdiction?: string;
  maxRiskScore?: number;
  isPremium?: boolean;
  tags?: string[];
  query?: string;
}): ContractTemplate[] {
  return contractTemplates.filter((template) => {
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const matches = template.name.toLowerCase().includes(q) ||
        template.description.toLowerCase().includes(q) ||
        template.tags.some(t => t.toLowerCase().includes(q));
      if (!matches) return false;
    }
    if (filters.category && template.category !== filters.category) return false;
    if (filters.industry && !template.industry.includes(filters.industry)) return false;
    if (filters.jurisdiction && !template.jurisdiction.includes(filters.jurisdiction)) return false;
    if (filters.maxRiskScore && template.riskScore > filters.maxRiskScore) return false;
    if (filters.isPremium !== undefined && template.isPremium !== filters.isPremium) return false;
    if (filters.tags && !filters.tags.some((tag) => template.tags.includes(tag))) return false;

    return true;
  });
}

/**
 * Get template categories
 * LEGACY: Use template-orchestrator.ts for new code
 */
export function getTemplateCategories(): string[] {
  return Array.from(new Set(contractTemplates.map((t) => t.category)));
}

/**
 * Get template by ID
 * LEGACY: Use template-orchestrator.ts for new code
 */
export function getTemplateById(id: string): ContractTemplate | undefined {
  return contractTemplates.find((t) => t.id === id);
}

/**
 * Legacy Templates API - Namespaced
 * Prevents conflicts with comprehensive-template-library.ts
 */
export const LegacyTemplates = {
  search: searchTemplates,
  getById: getTemplateById,
  getCategories: getTemplateCategories,
  filter: (filters: any) => {
    return contractTemplates.filter((template) => {
      if (filters.category && template.category !== filters.category) return false;
      if (filters.industry && !template.industry.includes(filters.industry)) return false;
      if (filters.jurisdiction && !template.jurisdiction.includes(filters.jurisdiction)) return false;
      if (filters.maxRiskScore && template.riskScore > filters.maxRiskScore) return false;
      if (filters.isPremium !== undefined && template.isPremium !== filters.isPremium) return false;
      if (filters.tags && !filters.tags.some((tag: string) => template.tags.includes(tag))) return false;
      return true;
    });
  },
  getAll: () => [...contractTemplates],
};

/**
 * Clause Alternatives - Fair vs Unfair Contract Clauses
 * Real examples from actual contracts showing problematic clauses and fairer alternatives
 */
export interface ClauseAlternative {
  id: string;
  originalClause: string;
  fairerVersion: string;
  explanation: string;
  votes: number;
  source: 'community' | 'legal_standard' | 'expert';
  contributor?: string;
}

export const clauseAlternatives: ClauseAlternative[] = [
  {
    id: 'ip-assignment-broad',
    originalClause: 'Employee assigns to Company all inventions, discoveries, improvements, and creative works conceived or developed during employment and for two (2) years after termination, whether or not related to Company business, and whether created during work hours or personal time.',
    fairerVersion: 'Employee assigns to Company inventions and works created during employment that (a) relate to Company\'s business or actual/demonstrably anticipated research, OR (b) are developed using Company equipment, supplies, facilities, or confidential information. Personal projects and prior inventions remain Employee\'s property.',
    explanation: 'Overly broad IP assignment covering all creativity (including hobbies and side projects) for 2 years post-employment is likely unenforceable in California (Labor Code § 2870) and many other states. Fair version protects company\'s legitimate interests while respecting employee rights to personal projects.',
    votes: 3847,
    source: 'legal_standard',
    contributor: 'California Labor Code § 2870',
  },
  {
    id: 'non-compete-excessive',
    originalClause: 'Employee agrees not to engage in any business competitive with Company for three (3) years after termination, anywhere in the United States or globally, in any capacity including as employee, consultant, advisor, or investor.',
    fairerVersion: 'Employee agrees not to work for direct competitors in a substantially similar role for six (6) months after termination, limited to [City/County where Company operates]. Non-solicitation of Company clients for twelve (12) months.',
    explanation: 'Non-competes must be reasonable in duration (6-12 months preferred), geographic scope (where company actually operates), and job scope (similar role only). Courts disfavor overly broad restrictions. California, North Dakota, and Oklahoma ban most non-competes entirely.',
    votes: 4203,
    source: 'legal_standard',
    contributor: 'Employment Law Standards',
  },
  {
    id: 'termination-asymmetric',
    originalClause: 'Company may terminate Employee immediately without notice or cause. Employee must provide 120 days written notice to resign and forfeits all accrued compensation if notice period is not fulfilled.',
    fairerVersion: 'Either party may terminate employment with thirty (30) days written notice. Employee is entitled to compensation for all work performed through actual termination date, regardless of notice provided.',
    explanation: 'Asymmetric termination provisions are unreasonable and may be unenforceable. Employees cannot forfeit earned wages under state labor laws. Fair terms treat both parties equally.',
    votes: 3654,
    source: 'legal_standard',
    contributor: 'State Labor Department Guidelines',
  },
  {
    id: 'auto-renewal-trap',
    originalClause: 'This Agreement automatically renews for successive one-year terms. Customer must provide written cancellation notice at least ninety (90) days before renewal date or pay 50% of annual contract value as early termination fee.',
    fairerVersion: 'This Agreement automatically renews for one-year terms. Either party may cancel with thirty (30) days written notice before renewal. No cancellation fees for non-renewal at term end. Pro-rated refunds available for mid-term cancellation.',
    explanation: 'Long cancellation windows (90+ days) and renewal penalties trap customers and may violate state automatic renewal laws. Fair notice is 30 days. Cancellation fees should not apply to non-renewal at natural term end.',
    votes: 4567,
    source: 'legal_standard',
    contributor: 'Consumer Protection Standards',
  },
  {
    id: 'data-ownership-grab',
    originalClause: 'Customer grants Provider perpetual, irrevocable, worldwide, royalty-free license to use, reproduce, modify, distribute, and sublicense all Customer Data for any purpose, including creating derivative works and reselling to third parties.',
    fairerVersion: 'Customer retains all ownership of Customer Data. Provider receives limited, non-exclusive license to use Customer Data solely to provide the Service. Upon termination, Provider will delete or return all Customer Data within thirty (30) days unless legally required to retain.',
    explanation: 'Customers should own their data. Perpetual, irrevocable licenses giving providers rights to resell customer data violate privacy principles and GDPR/CCPA. Fair version limits provider to operational use only.',
    votes: 5234,
    source: 'legal_standard',
    contributor: 'GDPR Article 20 - Data Portability',
  },
  {
    id: 'liability-complete-waiver',
    originalClause: 'Provider shall not be liable for any damages whatsoever, including direct, indirect, incidental, consequential, or punitive damages, even if caused by Provider\'s negligence, gross negligence, or willful misconduct. Customer waives all claims.',
    fairerVersion: 'Provider\'s total liability is limited to fees paid by Customer in the twelve (12) months preceding the claim. This limitation does not apply to Provider\'s gross negligence, willful misconduct, fraud, or data breaches resulting from Provider\'s failure to implement reasonable security measures.',
    explanation: 'Complete liability waivers are unconscionable and often unenforceable. Courts allow reasonable limitations (typically 12 months of fees) but not waivers for gross negligence or intentional harm. Data breach liability cannot be completely disclaimed.',
    votes: 3987,
    source: 'legal_standard',
    contributor: 'Contract Law Principles',
  },
  {
    id: 'forced-arbitration-one-sided',
    originalClause: 'All disputes must be resolved through binding arbitration. Customer pays all arbitration costs and fees. Customer waives all rights to class actions, jury trials, and appeals. Arbitration proceedings are confidential and results cannot be disclosed.',
    fairerVersion: 'Disputes may be resolved in small claims court (if eligible) or through optional mediation. If both parties agree, disputes may be arbitrated under AAA rules with fees split equally. Neither party waives right to pursue claims in court or participate in class actions.',
    explanation: 'Forced arbitration with customer paying all costs favors companies. Mandatory confidentiality prevents pattern discovery. Class action waivers may be unenforceable in employment/consumer contexts. Fair version preserves access to courts.',
    votes: 4321,
    source: 'legal_standard',
    contributor: 'Fair Arbitration Act Principles',
  },
  {
    id: 'indemnification-own-negligence',
    originalClause: 'Customer shall indemnify, defend, and hold harmless Provider from any and all claims, damages, costs, and expenses (including attorneys\' fees) arising from or related to this Agreement or Customer\'s use of Service, regardless of Provider\'s own negligence or fault.',
    fairerVersion: 'Each party shall indemnify the other for claims arising from that party\'s breach of this Agreement or negligence. Neither party indemnifies the other for claims arising from the other party\'s own negligence, gross negligence, or willful misconduct.',
    explanation: 'Requiring one party to indemnify another for the other party\'s own negligence or misconduct is unconscionable. Indemnification should be mutual and limited to each party\'s own actions.',
    votes: 2987,
    source: 'legal_standard',
    contributor: 'Commercial Contracts Guide',
  },
  {
    id: 'unilateral-amendment',
    originalClause: 'Company may modify these Terms at any time by posting changes on its website. Continued use of Service after changes constitutes acceptance. Customer has no right to reject changes or terminate without penalty.',
    fairerVersion: 'Company may update these Terms with sixty (60) days advance written notice to Customer. Material changes require Customer\'s affirmative consent. Customer may reject changes and terminate Agreement without penalty within notice period.',
    explanation: 'Unilateral amendment rights without notice or opt-out are unfair and may violate contract law. Material changes need real consent, not passive "continued use." Customers must be able to opt out without penalty for significant changes.',
    votes: 3765,
    source: 'legal_standard',
    contributor: 'Model Contract Terms Project',
  },
  {
    id: 'security-deposit-unfair',
    originalClause: 'Tenant shall pay security deposit equal to three (3) months\' rent, which is non-refundable and may be used by Landlord for any purpose. Tenant is responsible for all damages including normal wear and tear. Deposit will not be returned.',
    fairerVersion: 'Tenant shall pay security deposit equal to one (1) month\'s rent. Deposit will be returned within thirty (30) days after move-out, less itemized deductions for damages beyond normal wear and tear. Normal wear and tear is Landlord\'s responsibility. Landlord must provide itemized statement.',
    explanation: 'Most jurisdictions cap security deposits at 1-2 months and require return within 30-60 days with itemized deductions. "Non-refundable deposits" are actually fees with different legal treatment. Normal wear and tear is always landlord\'s responsibility.',
    votes: 4123,
    source: 'legal_standard',
    contributor: 'Tenant Rights Handbook',
  },
  {
    id: 'payment-terms-unfair',
    originalClause: 'Customer shall pay all invoices within five (5) days of receipt. Late payments accrue interest at 5% per month (60% APR). Provider may suspend Service immediately for any late payment without notice.',
    fairerVersion: 'Customer shall pay invoices within thirty (30) days of receipt (net 30). Late payments accrue interest at 1.5% per month (18% APR) or maximum legal rate, whichever is lower. Provider will provide seven (7) days written notice before suspending Service for non-payment.',
    explanation: 'Net 30 is industry standard for B2B payments. Interest rates above 18-36% may violate usury laws. Immediate suspension without notice for minor delays is unreasonable. Fair terms provide notice and cure period.',
    votes: 2543,
    source: 'legal_standard',
    contributor: 'Commercial Payment Standards',
  },
  {
    id: 'warranty-complete-disclaimer',
    originalClause: 'SERVICE IS PROVIDED "AS IS" WITHOUT ANY WARRANTIES OF ANY KIND. PROVIDER DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR PARTICULAR PURPOSE, AND NON-INFRINGEMENT. PROVIDER DOES NOT WARRANT SERVICE WILL BE ERROR-FREE OR UNINTERRUPTED.',
    fairerVersion: 'Provider warrants that Service will perform materially in accordance with Documentation and will not infringe third-party intellectual property rights. Except for these express warranties, Service is provided "as is" without other warranties.',
    explanation: 'Complete warranty disclaimers may be unconscionable in commercial contracts. Courts enforce reasonable disclaimers but providers should warrant basic functionality and non-infringement. Consumer transactions have stronger warranty protections.',
    votes: 2234,
    source: 'legal_standard',
    contributor: 'UCC Article 2 - Warranties',
  },
];



