'use client';

import { useState } from 'react';
import {
  Scan,
  FileText,
  Brain,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Building,
  Mail,
  Phone,
  Hash,
  Tag,
  Eye,
  Layers,
  Sparkles,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function DocumentIntelligence() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>('doc1');

  // Sample extracted documents
  const documents = [
    {
      id: 'doc1',
      name: 'Employment_Agreement_2026.pdf',
      type: 'Employment Contract',
      pages: 8,
      uploadedAt: '2 hours ago',
      status: 'processed',
      confidence: 98.7,
      entities: {
        parties: [
          { name: 'Sarah Johnson', role: 'Employee', confidence: 99.2 },
          { name: 'TechCorp Industries LLC', role: 'Employer', confidence: 99.8 }
        ],
        dates: [
          { value: 'January 15, 2026', type: 'Start Date', confidence: 99.5 },
          { value: 'January 15, 2028', type: 'Contract End Date', confidence: 98.1 },
          { value: '30 days', type: 'Notice Period', confidence: 97.3 }
        ],
        financials: [
          { value: '$125,000', type: 'Annual Salary', confidence: 99.9 },
          { value: '$10,000', type: 'Signing Bonus', confidence: 98.4 },
          { value: '15%', type: 'Target Bonus', confidence: 96.7 }
        ],
        locations: [
          { value: '123 Market Street, San Francisco, CA 94103', type: 'Work Location', confidence: 99.1 },
          { value: 'California, USA', type: 'Governing Law', confidence: 98.8 }
        ],
        contacts: [
          { value: 'hr@techcorp.com', type: 'Email', confidence: 99.4 },
          { value: '+1 (555) 123-4567', type: 'Phone', confidence: 98.9 }
        ]
      },
      clauses: [
        { name: 'Non-Compete', pages: '3-4', risk: 'medium', confidence: 95.2 },
        { name: 'Confidentiality', pages: '5', risk: 'low', confidence: 98.1 },
        { name: 'IP Assignment', pages: '6-7', risk: 'high', confidence: 94.3 },
        { name: 'Termination', pages: '7-8', risk: 'low', confidence: 97.8 }
      ],
      ocrQuality: {
        overall: 98.7,
        byPage: [99.1, 98.9, 98.2, 97.8, 98.5, 99.3, 98.1, 98.4]
      }
    },
    {
      id: 'doc2',
      name: 'Vendor_Agreement_Scan.jpg',
      type: 'Service Agreement',
      pages: 12,
      uploadedAt: '1 day ago',
      status: 'processed',
      confidence: 94.2,
      entities: {
        parties: [
          { name: 'Global Services Inc.', role: 'Vendor', confidence: 96.8 },
          { name: 'Enterprise Solutions Corp', role: 'Client', confidence: 97.3 }
        ],
        dates: [
          { value: 'February 1, 2026', type: 'Effective Date', confidence: 98.2 },
          { value: '12 months', type: 'Initial Term', confidence: 95.7 }
        ],
        financials: [
          { value: '$50,000/month', type: 'Monthly Fee', confidence: 97.1 },
          { value: '$600,000', type: 'Annual Value', confidence: 96.4 }
        ],
        locations: [
          { value: 'New York, NY', type: 'Client Location', confidence: 94.8 }
        ],
        contacts: [
          { value: 'contracts@globalservices.com', type: 'Email', confidence: 96.2 }
        ]
      },
      clauses: [
        { name: 'Payment Terms', pages: '4-5', risk: 'medium', confidence: 92.1 },
        { name: 'Liability Cap', pages: '8-9', risk: 'high', confidence: 89.7 },
        { name: 'SLA Requirements', pages: '10-11', risk: 'medium', confidence: 93.4 }
      ],
      ocrQuality: {
        overall: 94.2,
        byPage: [96.1, 95.2, 93.8, 92.4, 94.1, 95.7, 93.2, 91.8, 94.9, 95.3, 93.6, 92.9]
      }
    },
    {
      id: 'doc3',
      name: 'Handwritten_NDA.png',
      type: 'Non-Disclosure Agreement',
      pages: 3,
      uploadedAt: '3 days ago',
      status: 'processing',
      confidence: 76.4,
      entities: {
        parties: [
          { name: 'John Smith', role: 'Disclosing Party', confidence: 81.3 },
          { name: 'Innovation Labs', role: 'Receiving Party', confidence: 84.7 }
        ],
        dates: [
          { value: 'December 20, 2025', type: 'Effective Date', confidence: 78.2 }
        ],
        financials: [],
        locations: [],
        contacts: []
      },
      clauses: [
        { name: 'Confidentiality Obligations', pages: '1-2', risk: 'low', confidence: 72.8 },
        { name: 'Term', pages: '2', risk: 'low', confidence: 75.3 }
      ],
      ocrQuality: {
        overall: 76.4,
        byPage: [78.2, 75.9, 75.1]
      }
    }
  ];

  // Processing stats
  const stats = {
    totalDocuments: 127,
    entitiesExtracted: 3456,
    avgConfidence: 95.3,
    processingTime: '2.3s avg'
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-600 bg-green-100 border-green-300';
    if (confidence >= 85) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (confidence >= 75) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  const getRiskColor = (risk: string) => {
    if (risk === 'high') return 'text-red-600 bg-red-100 border-red-300';
    if (risk === 'medium') return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-green-600 bg-green-100 border-green-300';
  };

  const selectedDocument = documents.find(d => d.id === selectedDoc);

  return (
    <div className="min-h-screen bg-stone-50 light-section-pattern">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-900 text-white py-12 dark-section-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-teal-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Document Intelligence</h1>
              <p className="text-cyan-200 text-sm uppercase tracking-wider mono mt-1">AI-Powered OCR & Entity Extraction</p>
            </div>
          </div>
          <p className="text-xl text-cyan-100 max-w-3xl">
            Extract structured data from any document format. Advanced OCR, entity recognition, and clause detection.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <Scan className="w-8 h-8 text-teal-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Documents Processed</p>
            <p className="text-3xl font-bold text-stone-900 mb-1">{stats.totalDocuments}</p>
            <p className="text-sm text-stone-600">All time</p>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <Tag className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Entities Extracted</p>
            <p className="text-3xl font-bold text-stone-900 mb-1">{stats.entitiesExtracted.toLocaleString()}</p>
            <p className="text-sm text-stone-600">Structured data points</p>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Avg Confidence</p>
            <p className="text-3xl font-bold text-stone-900 mb-1">{stats.avgConfidence}%</p>
            <p className="text-sm text-stone-600">Extraction accuracy</p>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <Clock className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Processing Speed</p>
            <p className="text-3xl font-bold text-stone-900 mb-1">{stats.processingTime}</p>
            <p className="text-sm text-stone-600">Per document</p>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-300 border-dashed rounded-xl p-8 mb-8 text-center hover:border-teal-600 transition-all cursor-pointer">
          <Upload className="w-12 h-12 text-teal-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-stone-900 mb-2">Upload Document for Processing</h3>
          <p className="text-stone-600 mb-4">PDF, JPG, PNG, or scanned documents • Max 50MB</p>
          <button className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors">
            Select File
          </button>
        </div>

        {/* Documents List & Details */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Document List */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Processed Documents</h2>
            <div className="space-y-3">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc.id)}
                  className={`bg-white border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedDoc === doc.id
                      ? 'border-teal-600 shadow-lg'
                      : 'border-stone-200 hover:border-stone-900'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <FileText className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-stone-900 text-sm truncate">{doc.name}</p>
                      <p className="text-xs text-stone-500">{doc.type} • {doc.pages} pages</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded border font-semibold ${
                      doc.status === 'processed' ? 'bg-green-100 text-green-700 border-green-300' :
                      'bg-blue-100 text-blue-700 border-blue-300'
                    }`}>
                      {doc.status === 'processed' ? <><CheckCircle className="w-3 h-3 inline mr-1" />READY</> : 'PROCESSING...'}
                    </span>
                    <span className="text-xs text-stone-500">{doc.uploadedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Details */}
          <div className="lg:col-span-2">
            {selectedDocument ? (
              <div className="space-y-6">
                <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-stone-900 mb-1">{selectedDocument.name}</h2>
                      <p className="text-stone-600">{selectedDocument.type}</p>
                    </div>
                    <button className="px-4 py-2 border-2 border-stone-200 text-stone-700 rounded-lg font-semibold hover:border-stone-900 transition-colors flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export JSON
                    </button>
                  </div>

                  {/* OCR Quality */}
                  <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-stone-700">OCR Quality Score</p>
                      <span className={`text-xs px-2 py-1 rounded border font-semibold ${getConfidenceColor(selectedDocument.ocrQuality.overall)}`}>
                        {selectedDocument.ocrQuality.overall}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-teal-500 to-blue-500"
                        style={{ width: `${selectedDocument.ocrQuality.overall}%` }}
                      />
                    </div>
                  </div>

                  {/* Extracted Entities */}
                  <div className="space-y-4">
                    {/* Parties */}
                    {selectedDocument.entities.parties.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Users className="w-5 h-5 text-teal-600" />
                          <h3 className="font-bold text-stone-900">Parties ({selectedDocument.entities.parties.length})</h3>
                        </div>
                        <div className="space-y-2">
                          {selectedDocument.entities.parties.map((party, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                              <div>
                                <p className="font-semibold text-stone-900">{party.name}</p>
                                <p className="text-xs text-stone-500">{party.role}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded border font-semibold ${getConfidenceColor(party.confidence)}`}>
                                {party.confidence}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dates */}
                    {selectedDocument.entities.dates.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <h3 className="font-bold text-stone-900">Important Dates ({selectedDocument.entities.dates.length})</h3>
                        </div>
                        <div className="space-y-2">
                          {selectedDocument.entities.dates.map((date, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                              <div>
                                <p className="font-semibold text-stone-900">{date.value}</p>
                                <p className="text-xs text-stone-500">{date.type}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded border font-semibold ${getConfidenceColor(date.confidence)}`}>
                                {date.confidence}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Financials */}
                    {selectedDocument.entities.financials.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <h3 className="font-bold text-stone-900">Financial Terms ({selectedDocument.entities.financials.length})</h3>
                        </div>
                        <div className="space-y-2">
                          {selectedDocument.entities.financials.map((financial, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                              <div>
                                <p className="font-semibold text-stone-900 text-lg">{financial.value}</p>
                                <p className="text-xs text-stone-500">{financial.type}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded border font-semibold ${getConfidenceColor(financial.confidence)}`}>
                                {financial.confidence}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Locations */}
                    {selectedDocument.entities.locations.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <MapPin className="w-5 h-5 text-orange-600" />
                          <h3 className="font-bold text-stone-900">Locations ({selectedDocument.entities.locations.length})</h3>
                        </div>
                        <div className="space-y-2">
                          {selectedDocument.entities.locations.map((location, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                              <div>
                                <p className="font-semibold text-stone-900">{location.value}</p>
                                <p className="text-xs text-stone-500">{location.type}</p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded border font-semibold ${getConfidenceColor(location.confidence)}`}>
                                {location.confidence}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Detected Clauses */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Layers className="w-5 h-5 text-purple-600" />
                        <h3 className="font-bold text-stone-900">Detected Clauses ({selectedDocument.clauses.length})</h3>
                      </div>
                      <div className="space-y-2">
                        {selectedDocument.clauses.map((clause, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold text-stone-900">{clause.name}</p>
                                <span className={`text-xs px-2 py-1 rounded border font-semibold ${getRiskColor(clause.risk)}`}>
                                  {clause.risk.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500">Pages {clause.pages}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded border font-semibold ${getConfidenceColor(clause.confidence)}`}>
                              {clause.confidence}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-stone-200 rounded-xl p-12 text-center">
                <Eye className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                <p className="text-stone-600">Select a document to view extracted data</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
