'use client';

import { contractTemplates, ContractTemplate } from '@/lib/templates-data';
import { exportAsPDF, exportAsDOCX, exportAsMarkdown } from '@/lib/export-utils';
import TemplateCustomizationWizard from './TemplateCustomizationWizard';
import { Download, FileText, Shield, TrendingDown, Clock, DollarSign, Star, ChevronDown, Wand2 } from 'lucide-react';
import { useState } from 'react';

export default function TemplatesLibrary() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState<string | null>(null);
  const [customizingTemplate, setCustomizingTemplate] = useState<ContractTemplate | null>(null);

  const getRiskColor = (score: number) => {
    if (score >= 60) return 'text-red-600 bg-red-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    if (score >= 20) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'text-green-700 bg-green-50';
      case 'Moderate': return 'text-blue-700 bg-blue-50';
      case 'Complex': return 'text-purple-700 bg-purple-50';
      default: return 'text-stone-700 bg-stone-50';
    }
  };

  const handleDownload = async (templateId: string, format: 'markdown' | 'pdf' | 'docx') => {
    const template = contractTemplates.find(t => t.id === templateId);
    if (!template) return;

    setDownloadMenuOpen(null);

    try {
      switch (format) {
        case 'pdf':
          await exportAsPDF(template.name, template.fullContent);
          break;
        case 'docx':
          await exportAsDOCX(template.name, template.fullContent);
          break;
        case 'markdown':
        default:
          exportAsMarkdown(template.name, template.fullContent);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const categories = Array.from(new Set(contractTemplates.map(t => t.category)));

  return (
    <div className="w-full px-12 py-16">
      {/* Header */}
      <div className="mb-16">
        <div className="mb-4">
          <span className="mono text-xs text-stone-500 tracking-wider uppercase">Contract Templates</span>
        </div>
        <h2 className="text-6xl font-bold text-stone-900 mb-6 leading-tight">Fair Contract Templates</h2>
        <p className="text-xl text-stone-600 leading-relaxed max-w-3xl">
          Vetted, balanced contract templates that protect both parties. 
          <span className="text-stone-900 font-medium"> No hidden traps. No one sided terms.</span>
        </p>
      </div>

      {/* Categories */}
      {categories.map((category) => {
        const templates = contractTemplates.filter(t => t.category === category);
        
        return (
          <div key={category} className="mb-16">
            <div className="mb-6 pb-4">
              <h3 className="text-3xl font-bold text-stone-900">{category}</h3>
              <p className="text-sm text-stone-500 mt-2">{templates.length} templates available</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className="group bg-white border border-stone-300 p-8 hover:shadow-2xl hover:border-stone-900 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-stone-900" />
                      <div>
                        <h4 className="text-2xl font-bold text-stone-900 group-hover:text-stone-700 transition-colors">
                          {template.name}
                        </h4>
                        {template.isPremium && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs text-amber-700 font-semibold">Premium</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className={`w-5 h-5 ${
                        template.riskScore < 30 ? 'text-green-600' : 
                        template.riskScore < 50 ? 'text-yellow-600' : 
                        'text-orange-600'
                      }`} />
                      <span className={`mono text-sm font-bold px-3 py-1 rounded ${getRiskColor(template.riskScore)}`}>
                        {template.riskScore}
                      </span>
                    </div>
                  </div>

                  <p className="text-stone-700 leading-relaxed mb-4">{template.description}</p>

                  {/* Metadata Row */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-stone-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{template.estimatedTime}</span>
                    </div>
                    <div className="w-px h-3 bg-stone-300"></div>
                    <div className={`px-2 py-0.5 rounded font-semibold ${getComplexityColor(template.complexity)}`}>
                      {template.complexity}
                    </div>
                    {template.price > 0 && (
                      <>
                        <div className="w-px h-3 bg-stone-300"></div>
                        <div className="flex items-center gap-1 font-semibold text-stone-700">
                          <DollarSign className="w-3 h-3" />
                          <span>{template.price}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mb-4 p-4 bg-stone-50">
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-bold mb-2">Best For</p>
                    <p className="text-sm text-stone-800">{template.useCase}</p>
                  </div>

                  {/* Industries & Jurisdictions */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {template.industry.slice(0, 3).map((industry) => (
                      <span key={industry} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
                        {industry}
                      </span>
                    ))}
                    {template.industry.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-stone-100 text-stone-600 rounded">
                        +{template.industry.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-bold mb-3">Key Features</p>
                    <div className="text-sm text-stone-700 leading-relaxed whitespace-pre-line font-light">
                      {template.preview}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {/* Customize Button */}
                    <button
                      onClick={() => setCustomizingTemplate(template)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 text-white font-semibold hover:bg-amber-600 transition-colors duration-300 group"
                    >
                      <Wand2 className="w-4 h-4" />
                      Customize
                    </button>
                    
                    {/* Download Menu */}
                    <div className="relative">
                      <button 
                        onClick={() => setDownloadMenuOpen(downloadMenuOpen === template.id ? null : template.id)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-colors duration-300 group"
                        aria-label="Download template"
                        title="Download template"
                      >
                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {/* Download Format Menu */}
                      {downloadMenuOpen === template.id && (
                        <div className="absolute top-full right-0 mt-1 bg-white border-2 border-stone-900 shadow-xl z-10 min-w-[200px]">
                          <button
                            onClick={() => handleDownload(template.id, 'markdown')}
                            className="w-full px-4 py-3 text-left hover:bg-stone-100 transition-colors text-sm font-semibold text-stone-900 border-b border-stone-200"
                          >
                            📄 Markdown
                          </button>
                          <button
                            onClick={() => handleDownload(template.id, 'pdf')}
                            className="w-full px-4 py-3 text-left hover:bg-stone-100 transition-colors text-sm font-semibold text-stone-900 border-b border-stone-200"
                          >
                            📕 PDF
                          </button>
                          <button
                            onClick={() => handleDownload(template.id, 'docx')}
                            className="w-full px-4 py-3 text-left hover:bg-stone-100 transition-colors text-sm font-semibold text-stone-900"
                          >
                            📘 Word
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setSelectedTemplate(selectedTemplate === template.id ? null : template.id)}
                      className="px-6 py-3 border-2 border-stone-900 text-stone-900 font-semibold hover:bg-stone-900 hover:text-white transition-colors duration-300"
                    >
                      Preview
                    </button>
                  </div>

                  {/* Preview Modal */}
                  {selectedTemplate === template.id && (
                    <div className="mt-4 p-4 bg-stone-50 border-2 border-stone-200 max-h-96 overflow-y-auto">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-stone-500 uppercase tracking-wider font-bold">Template Preview</p>
                        <button
                          onClick={() => setSelectedTemplate(null)}
                          className="text-xs text-stone-500 hover:text-stone-900"
                        >
                          Close ×
                        </button>
                      </div>
                      <div className="prose prose-sm prose-stone max-w-none">
                        <pre className="text-xs whitespace-pre-wrap text-stone-700 font-mono">
                          {template.fullContent.substring(0, 2000)}
                          {template.fullContent.length > 2000 && '\n\n... (Download to see full template)'}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Bottom CTA */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-12 border-2 border-stone-900">
        <div className="max-w-3xl mx-auto text-center">
          <TrendingDown className="w-16 h-16 mx-auto mb-6 text-green-400" />
          <h3 className="text-4xl font-bold mb-4">Level the Playing Field</h3>
          <p className="text-xl text-stone-300 font-light leading-relaxed mb-8">
            These templates are designed to be fair to both parties. Unlike one-sided corporate contracts,
            they protect your interests while remaining professional and enforceable.
          </p>
          <div className="flex items-center justify-center gap-6 text-stone-400 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Legally Vetted</span>
            </div>
            <div className="w-px h-4 bg-stone-600"></div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
      
      {/* Customization Wizard Modal */}
      {customizingTemplate && (
        <TemplateCustomizationWizard
          template={customizingTemplate}
          onClose={() => setCustomizingTemplate(null)}
        />
      )}
              <span>Industry Standard</span>
            </div>
            <div className="w-px h-4 bg-stone-600"></div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              <span>Low Risk</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
