'use client';

import { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  FileText, 
  Calendar, 
  DollarSign, 
  AlertTriangle,
  TrendingUp,
  Filter,
  Download,
  Tag,
  Clock,
  ChevronRight,
  Zap,
  Target,
  BookOpen,
  Shield,
  RefreshCw
} from 'lucide-react';
import { contractSearchEngine, SearchResult, SmartSuggestion } from '@/lib/contract-intelligence-search';

export default function ContractIntelligenceSearch() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Demo data
  const demoResults: SearchResult[] = [
    {
      contractId: 'contract-1',
      contractTitle: 'SaaS Subscription Agreement - CloudTech Solutions',
      contractType: 'Software License',
      relevanceScore: 95,
      matches: [
        {
          type: 'clause',
          text: 'Licensee may terminate this Agreement for convenience with 30 days written notice',
          context: 'Section 8. Termination. Either party may terminate this Agreement for convenience with 30 days written notice. Upon termination, Licensee shall immediately cease using...',
          location: {
            section: 'Section 8 - Termination',
            page: 4,
            line: 23
          },
          confidence: 98,
          highlight: 'Licensee may <mark>terminate</mark> this Agreement for <mark>convenience</mark> with <mark>30 days</mark> written notice'
        },
        {
          type: 'amount',
          text: '$120,000 annually, payable within 30 days of invoice',
          context: 'Fees and Payment. Licensee agrees to pay $120,000 annually, payable within 30 days of invoice. Late payments incur 1.5% monthly interest...',
          location: {
            section: 'Section 3 - Fees',
            page: 2,
            line: 15
          },
          confidence: 95,
          highlight: '<mark>$120,000</mark> annually, payable within <mark>30 days</mark> of invoice'
        }
      ],
      summary: 'Software subscription agreement with CloudTech Solutions for annual payment of $120k. Includes 30-day termination for convenience clause.',
      keyPoints: [
        'Annual subscription: $120,000',
        'Payment terms: 30 days',
        'Termination: 30 days notice for convenience',
        'Late payment penalty: 1.5% monthly'
      ],
      relatedContracts: ['contract-5', 'contract-12']
    },
    {
      contractId: 'contract-2',
      contractTitle: 'Marketing Services Agreement - Growth Partners LLC',
      contractType: 'Services Agreement',
      relevanceScore: 87,
      matches: [
        {
          type: 'clause',
          text: 'Either party may terminate this Agreement with 60 days prior written notice',
          context: 'Termination. This Agreement shall continue for an initial term of 12 months. Either party may terminate this Agreement with 60 days prior written notice...',
          location: {
            section: 'Section 9 - Term and Termination',
            page: 5,
            line: 8
          },
          confidence: 92,
          highlight: 'Either party may <mark>terminate</mark> this Agreement with <mark>60 days</mark> prior written notice'
        }
      ],
      summary: 'Marketing services contract with 12-month term and 60-day termination notice requirement.',
      keyPoints: [
        'Initial term: 12 months',
        'Termination notice: 60 days',
        'Auto-renewal: Yes, unless terminated',
        'Services: Digital marketing and SEO'
      ]
    },
    {
      contractId: 'contract-3',
      contractTitle: 'Office Lease Agreement - Downtown Plaza',
      contractType: 'Real Estate Lease',
      relevanceScore: 72,
      matches: [
        {
          type: 'clause',
          text: 'Tenant may terminate lease early with 90 days notice and payment of 2 months rent',
          context: 'Early Termination. Tenant may terminate this lease early with 90 days written notice and payment of penalty equal to 2 months base rent...',
          location: {
            section: 'Section 12 - Early Termination',
            page: 7,
            line: 18
          },
          confidence: 88,
          highlight: 'Tenant may <mark>terminate</mark> lease early with <mark>90 days notice</mark> and payment of <mark>2 months rent</mark>'
        }
      ],
      summary: 'Commercial office lease with early termination option requiring 90-day notice and 2-month penalty.',
      keyPoints: [
        'Lease term: 36 months',
        'Monthly rent: $8,500',
        'Early termination: 90 days + 2 months penalty',
        'Security deposit: $17,000'
      ]
    }
  ];

  const demoSuggestions: SmartSuggestion[] = [
    {
      query: 'termination clauses in active SaaS contracts',
      type: 'refinement',
      description: 'Narrow to active SaaS contracts only',
      reason: 'Excludes expired and non-SaaS agreements for more relevant results'
    },
    {
      query: 'contracts with 30-day notice requirement',
      type: 'similar',
      description: 'Find contracts with specific notice period',
      reason: 'Multiple results had 30-day clauses'
    },
    {
      query: 'all termination for convenience clauses',
      type: 'related',
      description: 'Show all convenience termination rights',
      reason: 'Distinguish from termination for cause'
    }
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setSearching(true);
    
    // Simulate search
    setTimeout(() => {
      setResults(demoResults);
      setSuggestions(demoSuggestions);
      setTotalCount(demoResults.length);
      setProcessingTime(342);
      setSearching(false);
    }, 800);
  };

  const handleSuggestionClick = (suggestion: SmartSuggestion) => {
    setQuery(suggestion.query);
    handleSearch();
  };

  const popularSearches = [
    { query: 'contracts expiring in 90 days', icon: Calendar, color: 'text-blue-600' },
    { query: 'all liability clauses', icon: Shield, color: 'text-red-600' },
    { query: 'payment terms over $100k', icon: DollarSign, color: 'text-green-600' },
    { query: 'auto-renewal contracts', icon: RefreshCw, color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-stone-50 light-section-pattern">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-12 dark-section-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-stone-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Contract Intelligence Search</h1>
              <p className="text-stone-300 text-sm uppercase tracking-wider mono mt-1">AI-Powered Semantic Search</p>
            </div>
          </div>
          <p className="text-xl text-stone-300 max-w-3xl">
            Find anything in your contracts instantly. Ask questions in natural language and get precise answers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="bg-white border-2 border-stone-900 rounded-xl overflow-hidden flex items-center shadow-lg">
            <div className="p-4 border-r-2 border-stone-900">
              <Search className="w-6 h-6 text-stone-900" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask anything... e.g., 'termination clauses in SaaS contracts' or 'show me all payment amounts'"
              className="flex-1 px-4 py-4 text-lg focus:outline-none"
            />
            <button
              onClick={handleSearch}
              disabled={searching || !query.trim()}
              className="px-8 py-4 bg-stone-900 text-white font-semibold hover:bg-stone-800 disabled:bg-stone-300 transition-colors flex items-center gap-2"
            >
              {searching ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Search
                </>
              )}
            </button>
          </div>

          {/* Quick Searches */}
          {results.length === 0 && (
            <div className="mt-6">
              <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-3">Popular Searches</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                {popularSearches.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(item.query);
                        handleSearch();
                      }}
                      className="p-4 bg-white border-2 border-stone-200 rounded-lg hover:border-stone-900 transition-all text-left group"
                    >
                      <Icon className={`w-5 h-5 ${item.color} mb-2`} />
                      <p className="text-sm font-medium text-stone-900 group-hover:text-stone-700">{item.query}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-stone-900">{totalCount} Results</p>
                  <p className="text-sm text-stone-500 mono">Found in {processingTime}ms</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 border-2 border-stone-200 rounded-lg font-semibold text-sm hover:bg-stone-50 transition-colors flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  <button className="px-4 py-2 border-2 border-stone-200 rounded-lg font-semibold text-sm hover:bg-stone-50 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>

            {/* Smart Suggestions */}
            {suggestions.length > 0 && (
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <p className="font-semibold text-blue-900">Smart Suggestions</p>
                </div>
                <div className="grid md:grid-cols-3 gap-3">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-4 bg-white border-2 border-blue-200 rounded-lg hover:border-blue-600 transition-all text-left group"
                    >
                      <p className="text-xs text-blue-600 uppercase tracking-wider font-semibold mb-1">{suggestion.type}</p>
                      <p className="text-sm font-medium text-stone-900 mb-2">{suggestion.description}</p>
                      <p className="text-xs text-stone-500">{suggestion.reason}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results List */}
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.contractId} className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-stone-600 flex-shrink-0" />
                        <h3 className="text-lg font-bold text-stone-900">{result.contractTitle}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-stone-500">
                        <span className="px-2 py-1 bg-stone-100 rounded border border-stone-300 text-stone-700 font-semibold text-xs">
                          {result.contractType}
                        </span>
                        <span className="font-mono">{result.contractId}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg border border-green-300">
                        <Target className="w-4 h-4" />
                        <span className="text-sm font-bold">{result.relevanceScore}% Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-stone-50 border-l-4 border-stone-900 p-4 rounded mb-4">
                    <p className="text-sm text-stone-700 leading-relaxed">{result.summary}</p>
                  </div>

                  {/* Key Points */}
                  <div className="mb-4">
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-2">Key Points</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {result.keyPoints.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                          <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                          {point}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Matches */}
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-3">{result.matches.length} Matching Sections</p>
                    <div className="space-y-3">
                      {result.matches.map((match, idx) => (
                        <div key={idx} className="border-2 border-stone-200 rounded-lg p-4 hover:bg-stone-50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-1 rounded border font-semibold ${
                                match.type === 'clause' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                                match.type === 'amount' ? 'bg-green-100 text-green-700 border-green-300' :
                                match.type === 'date' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                                'bg-stone-100 text-stone-700 border-stone-300'
                              }`}>
                                {match.type.toUpperCase()}
                              </span>
                              <span className="text-xs text-stone-500 font-mono">{match.location.section}</span>
                            </div>
                            <span className="text-xs text-green-600 font-semibold">{match.confidence}% confidence</span>
                          </div>
                          <p 
                            className="text-sm text-stone-700 leading-relaxed mb-2"
                            dangerouslySetInnerHTML={{ __html: match.highlight }}
                          />
                          <p className="text-xs text-stone-500 italic">{match.context}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t-2 border-stone-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Clock className="w-4 h-4" />
                      <span>Last updated 2 days ago</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 text-sm font-semibold text-stone-700 hover:text-stone-900 transition-colors flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        View Full Contract
                      </button>
                      <button className="px-4 py-2 border-2 border-stone-900 text-stone-900 rounded-lg font-semibold text-sm hover:bg-stone-900 hover:text-white transition-colors">
                        Open Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
