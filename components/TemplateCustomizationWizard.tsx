'use client';

import { useState } from 'react';
import { ContractTemplate } from '@/lib/templates-data';
import { ChevronRight, ChevronLeft, Download, FileText, Sparkles } from 'lucide-react';
import { exportAsPDF, exportAsDOCX, exportAsMarkdown } from '@/lib/export-utils';

interface TemplateCustomizationWizardProps {
  template: ContractTemplate;
  onClose: () => void;
}

export default function TemplateCustomizationWizard({ template, onClose }: TemplateCustomizationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [customizedContent, setCustomizedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Variable labels and descriptions
  const variableLabels: Record<string, { label: string; description: string; placeholder: string }> = {
    // SaaS Agreement
    PROVIDER_NAME: { label: 'Provider Company Name', description: 'The name of the company providing the SaaS service', placeholder: 'Acme Software Inc.' },
    CUSTOMER_NAME: { label: 'Customer Company Name', description: 'The name of the company receiving the service', placeholder: 'Widget Corp.' },
    SERVICE_DESCRIPTION: { label: 'Service Description', description: 'Detailed description of the software service being provided', placeholder: 'Cloud-based project management platform...' },
    MONTHLY_FEE: { label: 'Monthly Fee', description: 'Monthly subscription fee in USD', placeholder: '499' },
    SLA_PERCENTAGE: { label: 'SLA Uptime %', description: 'Service level agreement uptime percentage', placeholder: '99.9' },
    TERM_LENGTH: { label: 'Initial Term', description: 'Initial contract term length', placeholder: '12 months' },
    
    // Employment Agreement
    COMPANY_NAME: { label: 'Company Name', description: 'Employer company name', placeholder: 'Tech Innovations LLC' },
    EMPLOYEE_NAME: { label: 'Employee Name', description: 'Full name of the employee', placeholder: 'Jane Smith' },
    POSITION_TITLE: { label: 'Position Title', description: 'Job title of the employee', placeholder: 'Senior Software Engineer' },
    START_DATE: { label: 'Start Date', description: 'Employment start date', placeholder: 'January 15, 2026' },
    SALARY: { label: 'Annual Salary', description: 'Base annual salary in USD', placeholder: '120,000' },
    BENEFITS_SUMMARY: { label: 'Benefits Summary', description: 'Summary of benefits provided', placeholder: 'Health insurance, 401(k) matching, 15 days PTO...' },
    
    // Freelance Agreement
    FREELANCER_NAME: { label: 'Freelancer Name', description: 'Full name of the freelancer/contractor', placeholder: 'John Doe' },
    CLIENT_NAME: { label: 'Client Name', description: 'Name of the client company or individual', placeholder: 'StartupCo Inc.' },
    PROJECT_DESCRIPTION: { label: 'Project Description', description: 'Detailed description of the project', placeholder: 'Design and develop a mobile app for...' },
    PROJECT_FEE: { label: 'Total Project Fee', description: 'Total fee for the project in USD', placeholder: '5,000' },
    PAYMENT_SCHEDULE: { label: 'Payment Schedule', description: 'How and when payments will be made', placeholder: '50% upfront, 50% on completion' },
    DELIVERABLES: { label: 'Deliverables', description: 'List of specific deliverables', placeholder: 'Mobile app, source code, documentation...' },
    DEADLINE: { label: 'Project Deadline', description: 'Final project completion deadline', placeholder: 'March 31, 2026' },
    
    // NDA
    PARTY_A_NAME: { label: 'Party A Name', description: 'First party name', placeholder: 'Alpha Corporation' },
    PARTY_B_NAME: { label: 'Party B Name', description: 'Second party name', placeholder: 'Beta Enterprises' },
    PURPOSE: { label: 'Purpose', description: 'Purpose of the confidential discussions', placeholder: 'Potential partnership to develop...' },
    DURATION_YEARS: { label: 'Duration (Years)', description: 'How many years confidentiality lasts', placeholder: '2' },
    
    // Consulting Agreement
    CONSULTANT_NAME: { label: 'Consultant Name', description: 'Name of consultant/consulting firm', placeholder: 'Strategic Advisors LLC' },
    SERVICES_DESCRIPTION: { label: 'Services Description', description: 'Description of consulting services', placeholder: 'Strategic business planning and market analysis...' },
    COMPENSATION: { label: 'Compensation', description: 'Payment structure and amount', placeholder: '$200/hour or $8,000/month retainer' },
    CONSULTING_TERM_LENGTH: { label: 'Term Length', description: 'Duration of consulting engagement', placeholder: '6 months' },
    
    // Lease Agreement
    LANDLORD_NAME: { label: 'Landlord Name', description: 'Property owner name', placeholder: 'Property Management Co.' },
    TENANT_NAME: { label: 'Tenant Name', description: 'Renter name', placeholder: 'Sarah Johnson' },
    PROPERTY_ADDRESS: { label: 'Property Address', description: 'Full rental property address', placeholder: '123 Main St, Apt 4B, City, State 12345' },
    MONTHLY_RENT: { label: 'Monthly Rent', description: 'Monthly rent amount in USD', placeholder: '1,500' },
    SECURITY_DEPOSIT: { label: 'Security Deposit', description: 'Security deposit amount', placeholder: '1,500' },
    LEASE_TERM: { label: 'Lease Term', description: 'Duration of the lease', placeholder: '12 months' },
    
    // Generic
    EFFECTIVE_DATE: { label: 'Effective Date', description: 'Date the agreement takes effect', placeholder: 'January 1, 2026' },
    GOVERNING_STATE: { label: 'Governing State', description: 'State law that governs the agreement', placeholder: 'Delaware' },
    
    // Content Creation
    CREATOR_NAME: { label: 'Creator Name', description: 'Content creator name', placeholder: 'Creative Studio LLC' },
    CONTENT_TYPE: { label: 'Content Type', description: 'Type of content being created', placeholder: 'Blog articles, social media graphics' },
    
    // Partnership
    PARTNERSHIP_NAME: { label: 'Partnership Name', description: 'Name of the partnership', placeholder: 'Smith & Jones Consulting' },
    PARTNER_1_NAME: { label: 'Partner 1 Name', description: 'First partner name', placeholder: 'Alex Smith' },
    PARTNER_2_NAME: { label: 'Partner 2 Name', description: 'Second partner name', placeholder: 'Jamie Jones' },
    PARTNER_1_PERCENTAGE: { label: 'Partner 1 Ownership %', description: 'First partner ownership percentage', placeholder: '60' },
    PARTNER_2_PERCENTAGE: { label: 'Partner 2 Ownership %', description: 'Second partner ownership percentage', placeholder: '40' },
    INITIAL_CAPITAL: { label: 'Initial Capital', description: 'Total starting capital', placeholder: '50,000' },
    
    // Web Development
    DEVELOPER_NAME: { label: 'Developer Name', description: 'Web developer/agency name', placeholder: 'WebDev Solutions' },
    COMPLETION_DATE: { label: 'Target Completion Date', description: 'When website should be completed', placeholder: 'April 30, 2026' },
    MILESTONES: { label: 'Project Milestones', description: 'Key project milestones and timeline', placeholder: 'Week 1-2: Design, Week 3-6: Development...' },
    
    // MSA
    TERM_YEARS: { label: 'Initial Term (Years)', description: 'Length of initial MSA term', placeholder: '3' },
    LIABILITY_CAP: { label: 'Liability Cap', description: 'Maximum liability amount in USD', placeholder: '100,000' },
  };

  const getVariableInfo = (variable: string) => {
    return variableLabels[variable] || {
      label: variable.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      description: `Enter value for ${variable}`,
      placeholder: `Enter ${variable.toLowerCase()}`
    };
  };

  const handleVariableChange = (variable: string, value: string) => {
    setVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const generateCustomizedTemplate = () => {
    setIsGenerating(true);
    
    // Replace variables in template
    let customized = template.fullContent;
    
    // Replace all variables with user-provided values
    for (const [key, value] of Object.entries(variables)) {
      if (value.trim()) {
        const regex = new RegExp(`\\[${key}\\]`, 'g');
        customized = customized.replace(regex, value);
      }
    }
    
    // Add generation timestamp
    customized = `# ${template.name}\n\n*Generated on ${new Date().toLocaleDateString()}*\n\n${customized}`;
    
    setCustomizedContent(customized);
    setIsGenerating(false);
    setCurrentStep(template.variables.length); // Move to final step
  };

  const handleDownload = async (format: 'markdown' | 'pdf' | 'docx') => {
    try {
      const fileName = `${template.name} - Customized`;
      
      switch (format) {
        case 'pdf':
          await exportAsPDF(fileName, customizedContent);
          break;
        case 'docx':
          await exportAsDOCX(fileName, customizedContent);
          break;
        case 'markdown':
        default:
          exportAsMarkdown(fileName, customizedContent);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const totalSteps = template.variables.length;
  const progress = ((currentStep + 1) / (totalSteps + 1)) * 100;

  // Group variables if showing all at once
  const showAllAtOnce = totalSteps > 10;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white max-w-4xl w-full shadow-2xl border-4 border-stone-900 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-stone-900 text-white p-6 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bold">Customize Template</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-stone-300 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          <div className="mb-2">
            <p className="text-stone-300 text-sm mb-1">{template.name}</p>
            <div className="w-full bg-stone-700 h-2 rounded-full overflow-hidden">
              {/* eslint-disable-next-line react/forbid-dom-props */}
              <div 
                className="bg-amber-400 h-full transition-all duration-300"
                role="progressbar"
                aria-label="Customization progress"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuetext={`Step ${currentStep + 1} of ${totalSteps + 1}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {currentStep < totalSteps && (
            <p className="text-stone-400 text-xs">
              Step {currentStep + 1} of {totalSteps + 1}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="p-8">
          {currentStep < totalSteps ? (
            showAllAtOnce ? (
              /* Show all variables at once for templates with many variables */
              <div>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-stone-900" />
                    <h3 className="text-xl font-bold text-stone-900">Fill in Template Details</h3>
                  </div>
                  <p className="text-stone-600">
                    Complete the form below to customize your {template.name}
                  </p>
                </div>

                <div className="space-y-6 mb-8">
                  {template.variables.map((variable, index) => {
                    const info = getVariableInfo(variable);
                    return (
                      <div key={variable}>
                        <label className="block mb-2">
                          <span className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                            {info.label}
                          </span>
                          <span className="text-xs text-stone-500 block mt-1">
                            {info.description}
                          </span>
                        </label>
                        <input
                          type="text"
                          value={variables[variable] || ''}
                          onChange={(e) => handleVariableChange(variable, e.target.value)}
                          placeholder={info.placeholder}
                          className="w-full px-4 py-3 border-2 border-stone-300 focus:border-stone-900 focus:outline-none font-mono text-sm"
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentStep(totalSteps)}
                    className="flex-1 px-6 py-4 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Generate Customized Template
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-4 border-2 border-stone-900 text-stone-900 font-bold hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Step-by-step for templates with fewer variables */
              <div>
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-stone-900" />
                    <h3 className="text-xl font-bold text-stone-900">
                      {getVariableInfo(template.variables[currentStep]).label}
                    </h3>
                  </div>
                  <p className="text-stone-600">
                    {getVariableInfo(template.variables[currentStep]).description}
                  </p>
                </div>

                <div className="mb-8">
                  <input
                    type="text"
                    value={variables[template.variables[currentStep]] || ''}
                    onChange={(e) => handleVariableChange(template.variables[currentStep], e.target.value)}
                    placeholder={getVariableInfo(template.variables[currentStep]).placeholder}
                    className="w-full px-6 py-4 border-2 border-stone-900 focus:border-amber-500 focus:outline-none text-lg font-mono"
                    autoFocus
                  />
                </div>

                <div className="flex gap-4">
                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 py-3 border-2 border-stone-900 text-stone-900 font-bold hover:bg-stone-100 transition-colors flex items-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Back
                    </button>
                  )}
                  
                  <button
                    onClick={() => {
                      if (currentStep === totalSteps - 1) {
                        generateCustomizedTemplate();
                      } else {
                        setCurrentStep(currentStep + 1);
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {currentStep === totalSteps - 1 ? (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Template
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          ) : (
            /* Final step - show customized template */
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <h3 className="text-2xl font-bold text-stone-900">Your Customized Template is Ready!</h3>
                </div>
                <p className="text-stone-600">
                  Preview your customized {template.name} below and download in your preferred format.
                </p>
              </div>

              {/* Preview */}
              <div className="mb-6 border-2 border-stone-300 p-6 bg-stone-50 max-h-96 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap text-stone-700 font-mono leading-relaxed">
                  {customizedContent.substring(0, 3000)}
                  {customizedContent.length > 3000 && '\n\n... (Download to see full template)'}
                </pre>
              </div>

              {/* Download Options */}
              <div className="mb-6">
                <p className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                  Download As:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleDownload('markdown')}
                    className="px-4 py-3 border-2 border-stone-900 hover:bg-stone-900 hover:text-white transition-colors font-semibold"
                  >
                    📄 Markdown
                  </button>
                  <button
                    onClick={() => handleDownload('pdf')}
                    className="px-4 py-3 border-2 border-stone-900 hover:bg-stone-900 hover:text-white transition-colors font-semibold"
                  >
                    📕 PDF
                  </button>
                  <button
                    onClick={() => handleDownload('docx')}
                    className="px-4 py-3 border-2 border-stone-900 hover:bg-stone-900 hover:text-white transition-colors font-semibold"
                  >
                    📘 Word
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
