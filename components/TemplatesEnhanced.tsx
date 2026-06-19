'use client';

import { FileText, Star, Download, Copy, Eye, Search, Filter, TrendingUp, Users, Building, Briefcase, Lock, Code, Home, Handshake, DollarSign, Globe, Shield, Award, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import { contractTemplates, searchTemplates, getTemplateCategories } from '@/lib/templates-data';

export default function TemplatesEnhanced() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedComplexity, setSelectedComplexity] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const categories = getTemplateCategories();

  const categoryIcons: Record<string, any> = {
    'Software & Technology': Code,
    'Employment & HR': Briefcase,
    'Confidentiality': Lock,
    'Freelance/Consulting': Users,
    'Real Estate': Home,
    'Business': Building,
    'Sales': DollarSign,
    'Marketing': TrendingUp,
    'Creative': Award,
    'Financial': DollarSign,
    'Legal': Shield,
  };

  const complexityColors = {
    Simple:   { bg: 'bg-stone-100', text: 'text-stone-900', border: 'border-stone-300' },
    Moderate: { bg: 'bg-stone-100', text: 'text-stone-900', border: 'border-stone-400' },
    Complex:  { bg: 'bg-stone-900', text: 'text-white',     border: 'border-stone-900' },
  };

  const filteredTemplates = contractTemplates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'all' || t.complexity === selectedComplexity;
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const handleDownload = (templateId: string) => {
    const template = contractTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Generate template overview
    const content = `${template.name}\n\n${template.description}\n\nCategory: ${template.category}\nComplexity: ${template.complexity}\nRating: ${template.rating}/5 (${template.downloadCount.toLocaleString()} downloads)\n\nThis template provides a framework for ${template.name.toLowerCase()}. Customize based on your specific needs and have it reviewed by a legal professional.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (templateId: string) => {
    const template = contractTemplates.find(t => t.id === templateId);
    if (!template) return;
    const content = `${template.name}\n\n${template.description}`;
    navigator.clipboard.writeText(content);
    alert('Template copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Contract Templates Library</h1>
          <p className="text-stone-600">45+ pre-built, customizable contract templates for every use case</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-stone-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-stone-900" />
              <span className="text-sm font-semibold text-stone-700">Total Templates</span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{contractTemplates.length}</p>
          </div>
          <div className="bg-white border border-stone-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Download className="w-5 h-5 text-stone-900" />
              <span className="text-sm font-semibold text-stone-700">Total Downloads</span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{(contractTemplates.reduce((sum, t) => sum + t.downloadCount, 0) / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-white border border-stone-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-stone-900" />
              <span className="text-sm font-semibold text-stone-700">Avg Rating</span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{(contractTemplates.reduce((sum, t) => sum + t.rating, 0) / contractTemplates.length).toFixed(1)}</p>
          </div>
          <div className="bg-white border border-stone-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <Building className="w-5 h-5 text-stone-900" />
              <span className="text-sm font-semibold text-stone-700">Categories</span>
            </div>
            <p className="text-3xl font-bold text-stone-900">{categories.length - 1}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-stone-200 p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates by name or description..."
                className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-sm font-semibold text-stone-700 mb-2 block">Filter by Category</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All ({contractTemplates.length})
                </button>
                {categories.map((cat) => {
                  const Icon = categoryIcons[cat] || FileText;
                  const count = contractTemplates.filter(t => t.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                        selectedCategory === cat
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complexity Filter */}
            <div>
              <label className="text-sm font-semibold text-stone-700 mb-2 block">Filter by Complexity</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedComplexity('all')}
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    selectedComplexity === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  All
                </button>
                {Object.keys(complexityColors).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedComplexity(diff)}
                    className={`px-4 py-2 rounded-lg font-semibold ${
                      selectedComplexity === diff
                        ? `${complexityColors[diff as keyof typeof complexityColors].bg} ${complexityColors[diff as keyof typeof complexityColors].text} border-2 ${complexityColors[diff as keyof typeof complexityColors].border}`
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = categoryIcons[template.category] || FileText;
            const diffColor = complexityColors[template.complexity as keyof typeof complexityColors];
            
            return (
              <div key={template.id} className="bg-white border border-stone-200 p-6 hover:border-stone-900 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-stone-100 flex items-center justify-center flex-shrink-0 transition-transform`}>
                    <Icon className="w-6 h-6 text-stone-900" />
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold border-2 ${diffColor.bg} ${diffColor.text} ${diffColor.border}`}>
                    {template.complexity}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-stone-900 mb-2">{template.name}</h3>
                <p className="text-sm text-stone-600 mb-4 line-clamp-2">{template.description}</p>

                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-stone-200">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-stone-900 fill-stone-900" />
                    <span className="text-sm font-bold text-stone-900">{template.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-600">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-semibold">{template.downloadCount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => setPreviewTemplate(template.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 text-white font-semibold hover:bg-stone-800 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button 
                    onClick={() => handleCopy(template.id)}
                    aria-label="Copy template"
                    title="Copy template to clipboard"
                    className="p-2.5 border-2 border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    <Copy className="w-4 h-4 text-stone-600" />
                  </button>
                  <button 
                    onClick={() => handleDownload(template.id)}
                    aria-label="Download template"
                    className="p-2.5 border-2 border-green-300 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Download className="w-4 h-4 text-green-600" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 bg-white border border-stone-200 rounded-xl">
            <Search className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-stone-900 mb-2">No templates found</p>
            <p className="text-stone-500">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Results Count */}
        {filteredTemplates.length > 0 && (
          <div className="mt-6 text-center text-sm text-stone-600">
            Showing <span className="font-bold text-stone-900">{filteredTemplates.length}</span> of <span className="font-bold text-stone-900">{contractTemplates.length}</span> templates
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setPreviewTemplate(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {(() => {
              const template = contractTemplates.find((t: any) => t.id === previewTemplate);
              if (!template) return null;
              const Icon = categoryIcons[template.category] || FileText;
              
              return (
                <>
                  <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-stone-900">{template.name}</h2>
                        <p className="text-sm text-stone-600">{template.category} • {template.complexity}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setPreviewTemplate(null)}
                      aria-label="Close preview modal"
                      title="Close"
                      className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-bold text-stone-900 mb-4">Template Preview</h3>
                      <div className="bg-stone-50 border border-stone-200 rounded-lg p-6 mb-6">
                        <p className="text-stone-700 mb-4">{template.description}</p>
                        <div className="space-y-4 text-sm">
                          <p><strong>Category:</strong> {template.category}</p>
                          <p><strong>Complexity Level:</strong> {template.complexity}</p>
                          <p><strong>Rating:</strong> {template.rating} ⭐ ({template.downloadCount.toLocaleString()} downloads)</p>
                          <p><strong>Use Cases:</strong> This template is ideal for establishing clear terms and protecting both parties in {template.category.toLowerCase()} agreements.</p>
                        </div>
                      </div>
                      
                      <div className="bg-white border-2 border-blue-200 rounded-lg p-6 mb-4">
                        <h4 className="font-bold text-stone-900 mb-3">Key Sections Included:</h4>
                        <ul className="space-y-2 text-sm text-stone-700">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Parties and definitions
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Scope of work/services
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Payment terms and schedule
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Intellectual property rights
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Confidentiality provisions
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Termination clauses
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Dispute resolution
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            Governing law and jurisdiction
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <p className="text-sm text-amber-800">
                          <strong>Note:</strong> This is a preview. Download the full template to customize for your specific needs. Always consult with a legal professional before using any contract.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-stone-200 flex gap-3">
                    <button 
                      onClick={() => handleDownload(template.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-all"
                    >
                      <Download className="w-5 h-5" />
                      Download Template
                    </button>
                    <button 
                      onClick={() => handleCopy(template.id)}
                      className="flex items-center gap-2 px-6 py-3 border-2 border-stone-300 rounded-lg font-semibold hover:bg-stone-50 transition-colors"
                    >
                      <Copy className="w-5 h-5" />
                      Copy
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
