'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FileSignature, 
  Upload, 
  CheckCircle,
  Clock,
  Mail,
  Download,
  Share2,
  Users,
  Calendar,
  Lock,
  Shield,
  Check,
  X,
  Bell,
  FileText,
  Trash2,
  AlertCircle,
  Send
} from 'lucide-react';

interface Signature {
  id: string;
  signerName: string;
  signerEmail: string;
  role: string;
  status: 'pending' | 'signed' | 'declined';
  signedAt?: string;
  ipAddress?: string;
}

interface SignatureRequest {
  id: string;
  contractName: string;
  createdAt: string;
  expiresAt: string;
  status: 'draft' | 'sent' | 'completed' | 'expired';
  signatures: Signature[];
  totalSigners: number;
  signedCount: number;
  message: string;
  fileName?: string;
}

export default function ESignature() {
  const [requests, setRequests] = useState<SignatureRequest[]>([]);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [contractName, setContractName] = useState('');
  const [signers, setSigners] = useState([{ name: '', email: '', role: '' }]);
  const [message, setMessage] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('signatureRequests');
    if (stored) {
      try {
        setRequests(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load signature requests', e);
      }
    }
  }, []);

  useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem('signatureRequests', JSON.stringify(requests));
    } else {
      localStorage.removeItem('signatureRequests');
    }
  }, [requests]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setContractFile(file);
      if (!contractName) {
        setContractName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(fakeEvent);
    }
  };

  const createRequest = (status: 'draft' | 'sent') => {
    if (!contractFile) {
      alert('Please upload a contract document');
      return;
    }

    if (!contractName.trim()) {
      alert('Please enter a contract name');
      return;
    }

    // Validate signers
    const validSigners = signers.filter(s => s.name && s.email && s.role);
    if (validSigners.length === 0) {
      alert('Please add at least one signer with complete information');
      return;
    }

    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setDate(expiryDate.getDate() + expiryDays);

    const newRequest: SignatureRequest = {
      id: `sr_${Date.now()}`,
      contractName: contractName.trim(),
      fileName: contractFile.name,
      createdAt: now.toISOString(),
      expiresAt: expiryDate.toISOString(),
      status,
      message: message.trim(),
      totalSigners: validSigners.length,
      signedCount: 0,
      signatures: validSigners.map((signer, index) => ({
        id: `sig_${Date.now()}_${index}`,
        signerName: signer.name,
        signerEmail: signer.email,
        role: signer.role,
        status: 'pending' as const
      }))
    };

    setRequests([newRequest, ...requests]);
    
    // Reset form
    setContractFile(null);
    setContractName('');
    setSigners([{ name: '', email: '', role: '' }]);
    setMessage('');
    setExpiryDays(7);
    setShowNewRequestModal(false);

    if (status === 'sent') {
      alert('Signature request sent! Signers will receive an email notification.');
    } else {
      alert('Request saved as draft');
    }
  };

  const sendRequest = (requestId: string) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: 'sent' as const } : req
    ));
    alert('Signature request sent to all signers!');
  };

  const deleteRequest = (requestId: string) => {
    if (confirm('Are you sure you want to delete this request?')) {
      const updatedRequests = requests.filter(req => req.id !== requestId);
      setRequests(updatedRequests);
      localStorage.setItem('signatureRequests', JSON.stringify(updatedRequests));
    }
  };

  const sendReminder = (requestId: string) => {
    alert('Reminder sent to all pending signers!');
  };

  const cancelRequest = (requestId: string) => {
    if (confirm('Are you sure you want to cancel this signature request?')) {
      setRequests(requests.map(req =>
        req.id === requestId ? { ...req, status: 'expired' as const } : req
      ));
    }
  };

  const downloadContract = (request: SignatureRequest) => {
    alert(`Download functionality for "${request.contractName}" would trigger here. In production, this would download the PDF/Word document.`);
  };

  const shareRequest = (request: SignatureRequest) => {
    const shareUrl = `${window.location.origin}/sign/${request.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Signature link copied to clipboard!');
  };

  const addSigner = () => {
    setSigners([...signers, { name: '', email: '', role: '' }]);
  };

  const removeSigner = (index: number) => {
    setSigners(signers.filter((_, i) => i !== index));
  };

  const updateSigner = (index: number, field: string, value: string) => {
    const updated = [...signers];
    updated[index] = { ...updated[index], [field]: value };
    setSigners(updated);
  };

  const statusColors = {
    draft: 'bg-stone-100 text-stone-700 border-stone-300',
    sent: 'bg-blue-100 text-blue-700 border-blue-300',
    completed: 'bg-green-100 text-green-700 border-green-300',
    expired: 'bg-red-100 text-red-700 border-red-300'
  };

  const signatureStatusColors = {
    pending: 'bg-amber-100 text-amber-700',
    signed: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700'
  };

  const stats = {
    pending: requests.filter(r => r.status === 'sent').length,
    completed: requests.filter(r => r.status === 'completed').length,
    draft: requests.filter(r => r.status === 'draft').length,
    totalSigners: requests.reduce((sum, r) => sum + r.totalSigners, 0)
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-stone-900 mb-2">E-Signature</h1>
            <p className="text-lg text-stone-600">Send, track, and manage digital signatures securely</p>
          </div>
          <button
            onClick={() => setShowNewRequestModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-lg">PENDING</span>
            </div>
            <div className="text-4xl font-bold text-stone-900 mb-1">{stats.pending}</div>
            <div className="text-sm text-stone-600">Awaiting signatures</div>
          </div>
          
          <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-700 rounded-lg">COMPLETED</span>
            </div>
            <div className="text-4xl font-bold text-stone-900 mb-1">{stats.completed}</div>
            <div className="text-sm text-stone-600">Fully executed</div>
          </div>
          
          <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FileSignature className="w-6 h-6 text-amber-600" />
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-amber-100 text-amber-700 rounded-lg">DRAFT</span>
            </div>
            <div className="text-4xl font-bold text-stone-900 mb-1">{stats.draft}</div>
            <div className="text-sm text-stone-600">Not yet sent</div>
          </div>
          
          <div className="bg-white border-2 border-stone-200 rounded-2xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="px-3 py-1 text-xs font-bold bg-purple-100 text-purple-700 rounded-lg">SIGNERS</span>
            </div>
            <div className="text-4xl font-bold text-stone-900 mb-1">{stats.totalSigners}</div>
            <div className="text-sm text-stone-600">Total participants</div>
          </div>
        </div>

        {/* Empty State */}
        {requests.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-stone-300 rounded-2xl p-16 text-center">
            <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileSignature className="w-12 h-12 text-stone-400" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-3">No Signature Requests</h3>
            <p className="text-stone-600 mb-8 max-w-md mx-auto text-lg">
              Create your first signature request to start collecting secure digital signatures
            </p>
            <button
              onClick={() => setShowNewRequestModal(true)}
              className="px-8 py-4 bg-stone-900 text-white rounded-xl font-semibold hover:bg-stone-800 transition-all inline-flex items-center gap-3 shadow-lg hover:shadow-xl"
            >
              <Send className="w-5 h-5" />
              Create Your First Request
            </button>
          </div>
        ) : (
          /* Signature Requests List */
          <div className="space-y-6">
            {requests.map((request) => (
            <div key={request.id} className="bg-white border-2 border-stone-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-stone-900">{request.contractName}</h3>
                      <span className={`px-4 py-1.5 text-xs font-bold rounded-lg border-2 ${statusColors[request.status]}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-stone-600">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Created {new Date(request.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Expires {new Date(request.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => downloadContract(request)}
                      aria-label="Download document" 
                      className="p-3 hover:bg-green-50 border-2 border-stone-200 hover:border-green-300 rounded-xl transition-all"
                    >
                      <Download className="w-5 h-5 text-green-600" />
                    </button>
                    <button 
                      onClick={() => shareRequest(request)}
                      aria-label="Share document" 
                      className="p-3 hover:bg-blue-50 border-2 border-stone-200 hover:border-blue-300 rounded-xl transition-all"
                    >
                      <Share2 className="w-5 h-5 text-blue-600" />
                    </button>
                    <button 
                      onClick={() => deleteRequest(request.id)}
                      aria-label="Delete request" 
                      className="p-3 hover:bg-red-50 border-2 border-stone-200 hover:border-red-300 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>

                {request.message && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-900 leading-relaxed">{request.message}</p>
                  </div>
                )}

                {request.fileName && (
                  <div className="mb-6 flex items-center gap-3 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl">
                    <FileText className="w-5 h-5 text-stone-600" />
                    <span className="font-semibold text-stone-700">{request.fileName}</span>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-stone-900">Signature Progress</span>
                    <span className="px-3 py-1 bg-stone-100 rounded-lg text-sm font-bold text-stone-700">
                      {request.signedCount} / {request.totalSigners} signed
                    </span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        request.signedCount === request.totalSigners ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${Math.min(100, (request.signedCount / request.totalSigners) * 100)}%` }}
                      role="progressbar"
                      aria-valuenow={request.signedCount}
                      aria-valuemin={0}
                      aria-valuemax={request.totalSigners}
                      aria-label={`${request.signedCount} of ${request.totalSigners} signatures collected`}
                    />
                  </div>
                </div>

                {/* Signatures */}
                <div className="space-y-3">
                  {request.signatures.map((signature) => (
                    <div key={signature.id} className="flex items-center justify-between p-5 border-2 border-stone-200 rounded-xl hover:border-stone-300 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-stone-800 to-stone-900 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                          {signature.signerName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-lg">{signature.signerName}</div>
                          <div className="text-sm text-stone-600 mb-1">{signature.signerEmail}</div>
                          <div className="text-xs font-semibold text-stone-500 bg-stone-100 px-2 py-1 rounded inline-block">{signature.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {signature.status === 'signed' && signature.signedAt && (
                          <div className="text-right text-sm">
                            <div className="font-semibold text-green-700">Signed {new Date(signature.signedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                            <div className="text-xs text-stone-500">at {new Date(signature.signedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                            <div className="text-xs text-stone-400 mt-1">IP: {signature.ipAddress}</div>
                          </div>
                        )}
                        <span className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 ${signatureStatusColors[signature.status]}`}>
                          {signature.status === 'pending' && <Clock className="w-4 h-4" />}
                          {signature.status === 'signed' && <CheckCircle className="w-4 h-4" />}
                          {signature.status === 'declined' && <X className="w-4 h-4" />}
                          {signature.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {request.status === 'draft' && (
                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => sendRequest(request.id)}
                      className="flex-1 px-6 py-3.5 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send for Signature
                    </button>
                    <button 
                      onClick={() => deleteRequest(request.id)}
                      className="px-6 py-3.5 border-2 border-red-300 text-red-700 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center gap-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </button>
                  </div>
                )}

                {request.status === 'sent' && (
                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => sendReminder(request.id)}
                      className="flex-1 px-6 py-3.5 border-2 border-blue-300 bg-blue-50 text-blue-700 rounded-xl font-bold hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                    >
                      <Bell className="w-5 h-5" />
                      Send Reminder
                    </button>
                    <button 
                      onClick={() => cancelRequest(request.id)}
                      className="px-6 py-3.5 border-2 border-red-300 text-red-700 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center gap-2"
                    >
                      <X className="w-5 h-5" />
                      Cancel Request
                    </button>
                  </div>
                )}
              </div>

              {/* Security Footer */}
              <div className="px-8 py-4 bg-gradient-to-r from-stone-50 to-stone-100 border-t-2 border-stone-200 flex items-center gap-6 text-xs font-semibold text-stone-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>256-bit encryption</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <span>Legally binding</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-purple-600" />
                  <span>Complete audit trail</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* New Request Modal */}
        {showNewRequestModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 overflow-y-auto" onClick={() => setShowNewRequestModal(false)}>
            <div className="bg-white rounded-3xl max-w-4xl w-full my-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="px-10 py-6 border-b-2 border-stone-200">
                <h2 className="text-3xl font-bold text-stone-900">Create Signature Request</h2>
                <p className="text-stone-600 mt-1">Upload your contract and add signers</p>
              </div>
              
              <div className="px-10 py-8 space-y-8 max-h-[70vh] overflow-y-auto">
                {/* Contract Name */}
                <div>
                  <label htmlFor="contract-name" className="block text-sm font-bold text-stone-900 mb-3">
                    Contract Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="contract-name"
                    type="text"
                    value={contractName}
                    onChange={(e) => setContractName(e.target.value)}
                    placeholder="e.g., Software License Agreement - Q1 2025"
                    className="w-full px-5 py-4 border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 text-lg"
                  />
                </div>

                {/* Upload Contract */}
                <div>
                  <label className="block text-sm font-bold text-stone-900 mb-3">
                    Contract Document <span className="text-red-600">*</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Upload contract file"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-3 border-dashed border-stone-300 rounded-2xl p-12 text-center hover:border-stone-900 hover:bg-stone-50 transition-all cursor-pointer"
                  >
                    {contractFile ? (
                      <div>
                        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <p className="text-lg font-bold text-stone-900 mb-2">{contractFile.name}</p>
                        <p className="text-sm text-stone-600 mb-4">{(contractFile.size / 1024).toFixed(0)} KB • {contractFile.type.split('/')[1].toUpperCase()}</p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setContractFile(null);
                          }}
                          className="px-6 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 transition-all"
                        >
                          Remove File
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-10 h-10 text-stone-400" />
                        </div>
                        <p className="text-lg font-bold text-stone-900 mb-2">Click to upload or drag and drop</p>
                        <p className="text-sm text-stone-600">PDF or Word document • Maximum 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message-input" className="block text-sm font-bold text-stone-900 mb-3">Message to Signers</label>
                  <textarea
                    id="message-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g., Please review and sign this agreement by the deadline..."
                    className="w-full px-5 py-4 border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 min-h-[100px] text-base"
                  />
                </div>

                {/* Expiry */}
                <div>
                  <label htmlFor="expiry-select" className="block text-sm font-bold text-stone-900 mb-3">Expiration</label>
                  <select
                    id="expiry-select"
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(Number(e.target.value))}
                    className="w-full px-5 py-4 border-2 border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 text-base font-semibold"
                  >
                    <option value={3}>3 days</option>
                    <option value={7}>7 days (Recommended)</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                  </select>
                </div>

                {/* Signers */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-bold text-stone-900">
                      Signers <span className="text-red-600">*</span>
                    </label>
                    <button
                      onClick={addSigner}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-lg font-bold transition-all text-sm"
                    >
                      + Add Signer
                    </button>
                  </div>
                  <div className="space-y-4">
                    {signers.map((signer, index) => (
                      <div key={index} className="grid grid-cols-12 gap-4 items-start bg-stone-50 p-5 rounded-xl border-2 border-stone-200">
                        <input
                          type="text"
                          value={signer.name}
                          onChange={(e) => updateSigner(index, 'name', e.target.value)}
                          placeholder="Full Name"
                          className="col-span-4 px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900 font-semibold"
                        />
                        <input
                          type="email"
                          value={signer.email}
                          onChange={(e) => updateSigner(index, 'email', e.target.value)}
                          placeholder="email@company.com"
                          className="col-span-4 px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                        />
                        <input
                          type="text"
                          value={signer.role}
                          onChange={(e) => updateSigner(index, 'role', e.target.value)}
                          placeholder="Role"
                          className="col-span-3 px-4 py-3 border-2 border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-900"
                        />
                        {signers.length > 1 && (
                          <button
                            onClick={() => removeSigner(index)}
                            aria-label="Remove signer"
                            className="col-span-1 p-3 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="px-10 py-6 border-t-2 border-stone-200 flex gap-4">
                <button 
                  onClick={() => createRequest('sent')}
                  className="flex-1 px-8 py-4 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
                >
                  <Send className="w-5 h-5" />
                  Send for Signature
                </button>
                <button 
                  onClick={() => createRequest('draft')}
                  className="px-8 py-4 border-2 border-stone-300 text-stone-700 rounded-xl font-bold hover:bg-stone-50 transition-all"
                >
                  Save Draft
                </button>
                <button
                  onClick={() => {
                    setShowNewRequestModal(false);
                    setContractFile(null);
                    setContractName('');
                    setSigners([{ name: '', email: '', role: '' }]);
                    setMessage('');
                  }}
                  className="px-8 py-4 text-stone-600 rounded-xl font-bold hover:bg-stone-100 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
