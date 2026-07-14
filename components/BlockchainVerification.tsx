'use client';

import { useState } from 'react';
import {
  Lock,
  CheckCircle,
  AlertCircle,
  Link as LinkIcon,
  Clock,
  Shield,
  Hash,
  FileText,
  Users,
  Wallet,
  TrendingUp,
  Download,
  Upload,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

export default function BlockchainVerification() {
  const [selectedContract, setSelectedContract] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Verified contracts on blockchain
  const verifiedContracts = [
    {
      id: 'CONTRACT-5678',
      title: 'Enterprise SaaS Agreement - Acme Corp',
      blockchainNetwork: 'Ethereum Mainnet',
      transactionHash: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4',
      blockNumber: 18234567,
      timestamp: '2026-01-10 14:32:18 UTC',
      status: 'verified',
      verificationScore: 100,
      parties: [
        { name: 'BeforeYouSign Inc.', wallet: '0x1a2b3c...4d5e', verified: true },
        { name: 'Acme Corporation', wallet: '0x9f8e7d...6c5b', verified: true }
      ],
      immutableHash: 'QmX5k3j9...8h2g1f',
      smartContractAddress: '0xA1B2C3D4E5F6...789012',
      gasUsed: '0.0023 ETH ($4.87)',
      signatures: 2,
      amendments: 0
    },
    {
      id: 'CONTRACT-5689',
      title: 'Service Level Agreement - TechStart Inc',
      blockchainNetwork: 'Polygon',
      transactionHash: '0x8f3e2d1c0b9a8f7e6d5c4b3a2918f0e1d2c3b4a5',
      blockNumber: 52341289,
      timestamp: '2026-01-12 09:15:42 UTC',
      status: 'verified',
      verificationScore: 100,
      parties: [
        { name: 'BeforeYouSign Inc.', wallet: '0x1a2b3c...4d5e', verified: true },
        { name: 'TechStart Inc.', wallet: '0x5a6b7c...8d9e', verified: true }
      ],
      immutableHash: 'QmY6l4k0...9i3h2g',
      smartContractAddress: '0xF1E2D3C4B5A6...098765',
      gasUsed: '0.0008 MATIC ($0.32)',
      signatures: 2,
      amendments: 1
    },
    {
      id: 'CONTRACT-5701',
      title: 'Multi-Party Partnership Agreement',
      blockchainNetwork: 'Ethereum Mainnet',
      transactionHash: '0x3c4b5a6978e1f0d9c8b7a6958f4e3d2c1b0a9887',
      blockNumber: 18234701,
      timestamp: '2026-01-13 16:48:03 UTC',
      status: 'pending',
      verificationScore: 66,
      parties: [
        { name: 'Alpha Ventures', wallet: '0x2b3c4d...5e6f', verified: true },
        { name: 'Beta Capital', wallet: '0x3c4d5e...6f7g', verified: true },
        { name: 'Gamma Holdings', wallet: '0x4d5e6f...7g8h', verified: false }
      ],
      immutableHash: 'QmZ7m5l1...0j4i3h',
      smartContractAddress: '0xB2C3D4E5F6G7...890123',
      gasUsed: '0.0041 ETH ($8.74)',
      signatures: 2,
      amendments: 0,
      pendingAction: 'Awaiting signature from Gamma Holdings'
    }
  ];

  // Blockchain activity feed
  const activityFeed = [
    {
      time: '5 minutes ago',
      action: 'Contract Verified',
      contract: 'CONTRACT-5689',
      txHash: '0x8f3e2d...',
      network: 'Polygon',
      type: 'success'
    },
    {
      time: '2 hours ago',
      action: 'Amendment Recorded',
      contract: 'CONTRACT-5689',
      txHash: '0x7e2d1c...',
      network: 'Polygon',
      type: 'update'
    },
    {
      time: '1 day ago',
      action: 'Contract Verified',
      contract: 'CONTRACT-5678',
      txHash: '0x742d35...',
      network: 'Ethereum',
      type: 'success'
    },
    {
      time: '2 days ago',
      action: 'Signature Added',
      contract: 'CONTRACT-5701',
      txHash: '0x6d1c0b...',
      network: 'Ethereum',
      type: 'signature'
    }
  ];

  // Benefits of blockchain verification
  const benefits = [
    {
      icon: Lock,
      title: 'Immutable Record',
      description: 'Contracts stored on blockchain cannot be altered or deleted',
      color: 'blue'
    },
    {
      icon: Clock,
      title: 'Timestamp Proof',
      description: 'Cryptographic proof of exact signing time and date',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Tamper-Proof',
      description: 'Any modification is immediately detected via hash mismatch',
      color: 'green'
    },
    {
      icon: Users,
      title: 'Multi-Party Verification',
      description: 'All parties can independently verify contract authenticity',
      color: 'orange'
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    if (status === 'verified') return 'bg-green-100 text-green-700 border-green-300';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-stone-100 text-stone-700 border-stone-300';
  };

  const getNetworkColor = (network: string) => {
    if (network.includes('Ethereum')) return 'bg-purple-100 text-purple-700 border-purple-300';
    if (network.includes('Polygon')) return 'bg-indigo-100 text-indigo-700 border-indigo-300';
    return 'bg-blue-100 text-blue-700 border-blue-300';
  };

  return (
    <div className="min-h-screen bg-stone-50 light-section-pattern">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white py-12 dark-section-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-indigo-900" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Blockchain Verification</h1>
              <p className="text-purple-200 text-sm uppercase tracking-wider mono mt-1">Immutable Smart Contract Registry</p>
            </div>
          </div>
          <p className="text-xl text-purple-100 max-w-3xl">
            Store contracts on blockchain for permanent, tamper-proof verification. Cryptographic proof of authenticity.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <Lock className="w-8 h-8 text-indigo-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Verified Contracts</p>
            <p className="text-3xl font-bold text-stone-900 mb-1">127</p>
            <p className="text-sm text-stone-600">On blockchain</p>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <Hash className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Total Transactions</p>
            <p className="text-3xl font-bold text-stone-900 mb-1">342</p>
            <p className="text-sm text-stone-600">Blockchain writes</p>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <Wallet className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Gas Spent</p>
            <p className="text-3xl font-bold text-stone-900 mb-1">0.87 ETH</p>
            <p className="text-sm text-stone-600">≈ $1,847</p>
          </div>

          <div className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
            <CheckCircle className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Success Rate</p>
            <p className="text-3xl font-bold text-stone-900 mb-1">99.7%</p>
            <p className="text-sm text-stone-600">Verification rate</p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                benefit.color === 'blue' ? 'bg-blue-100' :
                benefit.color === 'purple' ? 'bg-purple-100' :
                benefit.color === 'green' ? 'bg-green-100' :
                'bg-orange-100'
              }`}>
                <benefit.icon className={`w-6 h-6 ${
                  benefit.color === 'blue' ? 'text-blue-600' :
                  benefit.color === 'purple' ? 'text-purple-600' :
                  benefit.color === 'green' ? 'text-green-600' :
                  'text-orange-600'
                }`} />
              </div>
              <h3 className="font-bold text-stone-900 mb-2">{benefit.title}</h3>
              <p className="text-sm text-stone-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Verified Contracts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-stone-900">Blockchain-Verified Contracts</h2>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Verify New Contract
            </button>
          </div>

          <div className="space-y-4">
            {verifiedContracts.map((contract, idx) => (
              <div key={idx} className="bg-white border-2 border-stone-200 rounded-xl p-6 hover:border-stone-900 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-stone-900">{contract.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded border font-semibold ${getStatusColor(contract.status)}`}>
                        {contract.status === 'verified' && <><CheckCircle className="w-3 h-3 inline mr-1" />VERIFIED</>}
                        {contract.status === 'pending' && <><Clock className="w-3 h-3 inline mr-1" />PENDING</>}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded border font-semibold ${getNetworkColor(contract.blockchainNetwork)}`}>
                        {contract.blockchainNetwork}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500 font-mono mb-4">Contract ID: {contract.id}</p>

                    {contract.pendingAction && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded mb-4">
                        <p className="text-sm text-yellow-800">
                          <AlertCircle className="w-4 h-4 inline mr-1" />
                          {contract.pendingAction}
                        </p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {/* Transaction Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-stone-400" />
                          <div className="flex-1">
                            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Transaction Hash</p>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-mono text-blue-600">{contract.transactionHash.substring(0, 20)}...</p>
                              <button
                                onClick={() => copyToClipboard(contract.transactionHash)}
                                className="text-stone-400 hover:text-stone-600"
                              >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              </button>
                              <a href={`https://etherscan.io/tx/${contract.transactionHash}`} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 text-blue-600" />
                              </a>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4 text-stone-400" />
                          <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Block Number</p>
                            <p className="text-sm font-mono text-stone-700">{contract.blockNumber.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-stone-400" />
                          <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Timestamp</p>
                            <p className="text-sm font-mono text-stone-700">{contract.timestamp}</p>
                          </div>
                        </div>
                      </div>

                      {/* Contract Details */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-stone-400" />
                          <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">IPFS Hash</p>
                            <p className="text-sm font-mono text-stone-700">{contract.immutableHash}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-stone-400" />
                          <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Smart Contract</p>
                            <p className="text-sm font-mono text-stone-700">{contract.smartContractAddress.substring(0, 20)}...</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-stone-400" />
                          <div>
                            <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-1">Gas Used</p>
                            <p className="text-sm font-mono text-stone-700">{contract.gasUsed}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Parties */}
                    <div className="mb-4">
                      <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-2">Signing Parties</p>
                      <div className="space-y-2">
                        {contract.parties.map((party, partyIdx) => (
                          <div key={partyIdx} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              {party.verified ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Clock className="w-4 h-4 text-yellow-600" />
                              )}
                              <span className="font-semibold text-stone-900">{party.name}</span>
                            </div>
                            <span className="text-xs font-mono text-stone-500">{party.wallet}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-6 pt-4 border-t border-stone-200">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-stone-400" />
                        <span className="text-sm text-stone-600">
                          {contract.signatures}/{contract.parties.length} signatures
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-stone-400" />
                        <span className="text-sm text-stone-600">
                          {contract.amendments} {contract.amendments === 1 ? 'amendment' : 'amendments'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-stone-400" />
                        <span className="text-sm text-stone-600">
                          Verification Score: {contract.verificationScore}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-2 border-2 border-stone-200 text-stone-700 rounded-lg font-semibold hover:border-stone-900 transition-colors text-sm">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-4">Recent Blockchain Activity</h2>
          <div className="bg-white border-2 border-stone-200 rounded-xl overflow-hidden">
            <div className="divide-y divide-stone-200">
              {activityFeed.map((activity, idx) => (
                <div key={idx} className="p-4 hover:bg-stone-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {activity.type === 'success' && (
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      )}
                      {activity.type === 'update' && (
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                      {activity.type === 'signature' && (
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-stone-900">{activity.action}</p>
                        <p className="text-sm text-stone-500">
                          {activity.contract} • {activity.network}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-stone-500">{activity.time}</p>
                      <p className="text-xs font-mono text-blue-600">{activity.txHash}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
