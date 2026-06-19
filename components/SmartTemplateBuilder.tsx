'use client';

import { useState, useEffect } from 'react';
import { Search, Star, BarChart2, Grid, List, SaveAll, Upload, Eye, AlertTriangle, X } from 'lucide-react';
import { SmartTemplateBuilder, ClauseLibraryItem, ClauseCategory, TemplateBuilder } from '@/lib/smart-template-builder';

export default function SmartTemplateBuilderComponent() {
  const [builder] = useState(() => {
    const b = new SmartTemplateBuilder();
    return b;
  });
  const [selectedCategory, setSelectedCategory] = useState<ClauseCategory>('preamble');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [template, setTemplate] = useState<TemplateBuilder>({
    id: 'new-template',
    name: 'Untitled Contract',
    description: '',
    contractType: 'General',
    industry: 'General',
    sections: [],
    variables: [],
    createdBy: 'user',
    createdAt: new Date(),
    lastModified: new Date(),
    version: 1,
    status: 'draft',
    completeness: 0,
    riskScore: 50,
    missingRecommendedClauses: [],
    incompatibilities: [],
    collaborators: [],
    comments: [],
    changeHistory: [],
  });

  const categories: ClauseCategory[] = [
    'preamble',
    'scope',
    'payment',
    'deliverables',
    'timeline',
    'intellectual-property',
    'confidentiality',
    'data-protection',
    'warranties',
    'liability',
    'indemnification',
    'insurance',
    'termination',
    'dispute-resolution',
    'force-majeure',
    'assignment',
    'amendment',
    'notices',
    'governing-law',
    'miscellaneous',
    'definitions'
  ];

  const clauses = searchQuery
    ? builder.searchClauses(searchQuery)
    : builder.getClausesByCategory(selectedCategory);

  const handleAddClause = (clause: ClauseLibraryItem) => {
    const newSection = {
      id: `section-${Date.now()}`,
      order: template.sections.length,
      title: clause.category,
      clauses: [{
        id: `clause-${Date.now()}`,
        clauseLibraryId: clause.id,
        variables: {},
        order: 0,
        locked: false,
        modified: false,
      }],
      optional: false,
      collapsible: true,
    };

    setTemplate({
      ...template,
      sections: [...template.sections, newSection],
      lastModified: new Date(),
    });
  };

  const handleRemoveClause = (sectionId: string, clauseId: string) => {
    setTemplate({
      ...template,
      sections: template.sections.map(section =>
        section.id === sectionId
          ? { ...section, clauses: section.clauses.filter(c => c.id !== clauseId) }
          : section
      ).filter(section => section.clauses.length > 0),
      lastModified: new Date(),
    });
  };

  const completeness = builder.calculateCompleteness(template);

  return (
    <div className="h-screen flex bg-stone-50">
      {/* Clause Library Sidebar - Premium Design */}
      <div className="w-[420px] bg-white border-r border-stone-200 overflow-hidden flex flex-col">
        {/* Sticky Header */}
        <div className="p-6 border-b border-stone-200 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-stone-900">
                Clause Library
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                <span className="font-semibold text-stone-900">{clauses.length}</span> professional clauses
              </p>
            </div>
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
              className="p-2 hover:bg-stone-100 transition-colors"
              title={viewMode === 'list' ? 'Grid view' : 'List view'}
            >
              {viewMode === 'list' ? <Grid className="w-4 h-4 text-stone-600" /> : <List className="w-4 h-4 text-stone-600" />}
            </button>
          </div>
          
          {/* Search Bar - Enhanced */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clauses..."
              className="w-full pl-10 pr-4 py-3 border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-all bg-white"
            />
          </div>

          {/* Category Filter - Improved */}
          {!searchQuery && (
            <div className="mt-4">
              <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wider">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ClauseCategory)}
                className="w-full px-4 py-3 border border-stone-300 text-sm focus:ring-2 focus:ring-stone-900 focus:border-stone-900 bg-white font-medium text-stone-700 cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Clause List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-3' : 'space-y-3'}>
            {clauses.length === 0 && (
              <div className="text-center py-16 px-4">
                <div className="w-20 h-20 bg-stone-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-stone-400" />
                </div>
                <p className="text-sm font-semibold text-stone-700 mb-1">No clauses found</p>
                <p className="text-xs text-stone-500">Try a different category or search term</p>
              </div>
            )}
            {clauses.slice(0, 20).map(clause => (
              <div
                key={clause.id}
                className="group bg-white p-5 border border-stone-200 hover:border-stone-900 transition-all duration-200 cursor-pointer relative overflow-hidden"
                onClick={() => handleAddClause(clause)}
              >
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-stone-50 opacity-0 group-hover:opacity-50 transition-all duration-200" />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-sm text-stone-900 pr-2 leading-tight">
                      {clause.title}
                    </h3>
                    <span className="text-xs px-2.5 py-1 font-bold whitespace-nowrap border border-stone-900 text-stone-900">
                      {clause.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mb-4 line-clamp-2 leading-relaxed">
                    {clause.text.substring(0, 140)}...
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-stone-600 font-medium">
                      <Star className="w-3.5 h-3.5 text-stone-500" />
                      {clause.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1.5 text-stone-600 font-medium">
                      <BarChart2 className="w-3.5 h-3.5 text-stone-500" />
                      {clause.popularity}%
                    </span>
                    <span className="text-stone-500 font-medium">
                      {(clause.usageCount / 1000).toFixed(1)}k uses
                    </span>
                  </div>
                  {/* Add icon */}
                  <div className="absolute bottom-3 right-3 w-7 h-7 bg-stone-900 flex items-center justify-center text-white text-lg opacity-0 group-hover:opacity-100 transition-all">
                    +
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Template Builder - Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Bar - Premium */}
        <div className="bg-white border-b border-stone-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1 max-w-2xl">
                <input
                  type="text"
                  value={template.name}
                  onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  className="text-3xl font-bold border-none outline-none focus:ring-0 w-full text-stone-900 placeholder-stone-400 bg-transparent"
                  placeholder="Contract Title..."
                />
                <input
                  type="text"
                  value={template.description}
                  onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                  className="text-base text-stone-600 border-none outline-none focus:ring-0 mt-2 w-full placeholder-stone-400 bg-transparent"
                  placeholder="Add description (optional)..."
                />
              </div>
              
              {/* Stats Cards */}
              <div className="flex gap-4 ml-8">
                <div className="bg-stone-900 text-white px-6 py-4 min-w-[100px]">
                  <div className="text-4xl font-black mb-1">{completeness.score}%</div>
                  <div className="text-xs font-semibold opacity-90 uppercase tracking-wide">Complete</div>
                </div>
                <div className="bg-stone-700 text-white px-6 py-4 min-w-[100px]">
                  <div className="text-4xl font-black mb-1">{template.sections.length}</div>
                  <div className="text-xs font-semibold opacity-90 uppercase tracking-wide">Clauses</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-all">
                <SaveAll className="w-4 h-4" />
                Save Draft
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 font-semibold text-sm hover:bg-stone-200 transition-all">
                <Upload className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 font-semibold text-sm hover:bg-stone-200 transition-all">
                <Eye className="w-4 h-4" />
                Preview
              </button>
            </div>

            {/* Missing Clauses Warning */}
            {completeness.missing.length > 0 && (
              <div className="mt-4 bg-stone-50 border border-stone-300 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-stone-700 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-stone-900 mb-1">Missing Essential Clauses</p>
                    <p className="text-xs text-stone-700 font-medium">{completeness.missing.join(', ')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Template Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {template.sections.length === 0 ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center max-w-xl">
                <div className="relative mb-8">
                  <div className="w-32 h-32 bg-stone-100 flex items-center justify-center mx-auto">
                    <SaveAll className="w-12 h-12 text-stone-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-black text-stone-900 mb-4">
                  Build Your Perfect Contract
                </h3>
                <p className="text-stone-600 mb-8 text-lg leading-relaxed">
                  Click any clause from the library to add it to your contract.<br/>
                  Mix and match professional clauses to create the perfect agreement.
                </p>
                
                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 bg-white px-4 py-3 border border-stone-200">
                    <span className="w-8 h-8 bg-stone-900 text-white flex items-center justify-center font-black">1</span>
                    <span className="text-sm font-semibold text-stone-700">Browse</span>
                  </div>
                  <span className="text-stone-400 font-bold">→</span>
                  <div className="flex items-center gap-2 bg-white px-4 py-3 border border-stone-200">
                    <span className="w-8 h-8 bg-stone-700 text-white flex items-center justify-center font-black">2</span>
                    <span className="text-sm font-semibold text-stone-700">Click to Add</span>
                  </div>
                  <span className="text-stone-400 font-bold">→</span>
                  <div className="flex items-center gap-2 bg-white px-4 py-3 border border-stone-200">
                    <span className="w-8 h-8 bg-stone-500 text-white flex items-center justify-center font-black">3</span>
                    <span className="text-sm font-semibold text-stone-700">Export</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto p-10">
              <div className="bg-white border border-stone-200 p-10">
                <div className="prose prose-lg max-w-none">
                  <h1 className="text-4xl font-black text-stone-900 mb-3 leading-tight">{template.name}</h1>
                  {template.description && (
                    <p className="text-lg text-stone-600 italic mb-8 pb-8 border-b-2 border-stone-200">{template.description}</p>
                  )}

                  {template.sections.map((section, sectionIdx) => (
                    <div key={section.id} className="mb-10">
                      <h2 className="text-2xl font-black text-stone-900 capitalize mb-6 pb-3 border-b-2 border-stone-200 flex items-center gap-3">
                        <span className="w-8 h-8 bg-stone-900 text-white flex items-center justify-center text-sm font-bold">
                          {sectionIdx + 1}
                        </span>
                        {section.title.replace(/-/g, ' ')}
                      </h2>
                      {section.clauses.map((clauseInstance) => {
                        const clause = builder['clauseLibrary'].get(clauseInstance.clauseLibraryId);
                        if (!clause) return null;

                        return (
                          <div key={clauseInstance.id} className="mb-6 p-6 bg-stone-50 border border-stone-200 relative group hover:border-stone-900 transition-all">
                            <button
                              onClick={() => handleRemoveClause(section.id, clauseInstance.id)}
                              aria-label="Remove clause"
                              className="absolute top-4 right-4 w-8 h-8 bg-stone-900 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <h3 className="font-black mb-4 text-base text-stone-900 uppercase tracking-wide">{clause.title}</h3>
                            <p className="text-base text-stone-800 leading-relaxed">{clause.text}</p>
                            {clause.variables.length > 0 && (
                              <div className="mt-5 pt-5 border-t-2 border-stone-200">
                                <p className="text-xs text-stone-600 mb-3 font-bold uppercase tracking-wide">Customize Variables:</p>
                                <div className="flex flex-wrap gap-2">
                                  {clause.variables.map(v => (
                                    <span key={v.name} className="text-xs bg-stone-900 text-white px-3 py-1.5 font-bold">
                                      [{v.name}]
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-stone-200 p-4">
          <div className="flex gap-3 justify-end">
            <button className="px-6 py-2 bg-stone-100 text-stone-800 hover:bg-stone-200">
              Save Draft
            </button>
            <button className="px-6 py-2 bg-stone-900 text-white hover:bg-stone-800">
              Generate Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
