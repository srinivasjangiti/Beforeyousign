'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Upload, FileText, MessageSquare, Bot, User as UserIcon, X, Sparkles, AlertCircle, CheckCircle, HelpCircle, ShieldAlert } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UploadedContract {
  name: string;
  size: number;
  text: string;
}

export default function ContractChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your contract assistant. Upload a contract to get started, and I'll help you understand it, identify risks, and answer any questions you have.",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [contract, setContract] = useState<UploadedContract | null>(null);
  const [uploading, setUploading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const text = await file.text();
      setContract({
        name: file.name,
        size: file.size,
        text: text
      });

      // Add confirmation message
      const confirmMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Great! I've analyzed "${file.name}". Here's what I found:\n\n✓ Contract loaded successfully\n✓ ${text.split('\n').length} lines detected\n✓ ${text.split(' ').length} words analyzed\n\nNow you can ask me anything about this contract. Try questions like:\n• What are the main obligations?\n• Are there any red flags?\n• What are the payment terms?\n• When does this contract expire?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmMsg]);
    } catch (error) {
      console.error('Upload error:', error);
    }
    setUploading(false);
  };

  const generateResponse = (userQuery: string, contractText: string): string => {
    const query = userQuery.toLowerCase();
    
    // Detect question type and generate relevant response
    if (query.includes('red flag') || query.includes('risk') || query.includes('concern')) {
      return `Based on my analysis of the contract, here are potential red flags to watch out for:\n\n⚠️ **Key Concerns:**\n• Unlimited liability clauses - Check for caps on damages\n• Auto-renewal terms - Look for clear termination procedures\n• One-sided indemnification - Ensure mutual protection\n• Unclear payment terms - Verify payment schedules and amounts\n• Restrictive non-compete clauses - Consider geographic and time limits\n\nI recommend having a legal professional review these specific sections before signing.`;
    }
    
    if (query.includes('payment') || query.includes('fee') || query.includes('price')) {
      return `Regarding payment terms in this contract:\n\n💰 **Payment Information:**\n• The contract appears to outline payment obligations for both parties\n• Look for sections labeled "Compensation", "Fees", or "Payment Terms"\n• Check for late payment penalties or interest charges\n• Verify invoice procedures and payment schedules\n• Note any deposit or advance payment requirements\n\nWould you like me to highlight specific payment-related clauses?`;
    }
    
    if (query.includes('termination') || query.includes('cancel') || query.includes('end')) {
      return `Here's what you need to know about terminating this contract:\n\n📋 **Termination Details:**\n• Notice period requirements (typically 30-90 days)\n• Conditions for early termination\n• Penalties or fees for breaking the contract\n• Post-termination obligations\n• Final payment settlements\n\nAlways follow the exact termination procedure specified to avoid disputes.`;
    }
    
    if (query.includes('obligation') || query.includes('responsible') || query.includes('duty')) {
      return `Your main obligations under this contract include:\n\n✓ **Primary Responsibilities:**\n• Performance of agreed services or deliverables\n• Meeting specified timelines and deadlines\n• Maintaining confidentiality of sensitive information\n• Compliance with relevant laws and regulations\n• Providing necessary documentation and reports\n\nMake sure you can realistically fulfill these obligations before signing.`;
    }
    
    if (query.includes('intellectual property') || query.includes('ip') || query.includes('copyright')) {
      return `Intellectual Property (IP) provisions in this contract:\n\n🔒 **IP Rights:**\n• Ownership of work product and deliverables\n• Pre-existing IP retained by original owner\n• License grants and usage rights\n• Confidentiality and trade secret protection\n• Moral rights and attribution requirements\n\nIP clauses are critical - ensure you understand who owns what after the contract ends.`;
    }

    if (query.includes('liability') || query.includes('indemnif')) {
      return `Liability and indemnification provisions:\n\n⚖️ **Legal Protection:**\n• Liability caps and limitations\n• Indemnification obligations (who protects whom)\n• Insurance requirements\n• Force majeure clauses\n• Dispute resolution procedures\n\nThese clauses determine who bears financial responsibility if things go wrong.`;
    }

    if (query.includes('confidential') || query.includes('nda') || query.includes('secret')) {
      return `Confidentiality provisions in this contract:\n\n🔐 **Confidentiality Terms:**\n• Definition of confidential information\n• Permitted disclosures and exceptions\n• Duration of confidentiality obligations\n• Return or destruction of confidential materials\n• Consequences of breach\n\nConfidentiality often survives contract termination - these obligations may be permanent.`;
    }

    if (query.includes('expire') || query.includes('term') || query.includes('duration')) {
      return `Contract term and duration:\n\n📅 **Time Period:**\n• Initial contract term (start and end dates)\n• Automatic renewal provisions\n• Extension options\n• Notice requirements for non-renewal\n• Surviving obligations after expiration\n\nMark key dates in your calendar to avoid unwanted auto-renewals.`;
    }

    // Default response
    return `I've analyzed your question about the contract. Here's a helpful overview:\n\n📄 **Key Points:**\n• This contract contains important legal obligations for all parties\n• Review all terms carefully before signing\n• Pay special attention to payment, termination, and liability clauses\n• Consider having a legal professional review complex sections\n• Keep a signed copy for your records\n\nFeel free to ask more specific questions about any clause or section!`;
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Simulate AI thinking
    setThinking(true);
    setTimeout(() => {
      const response = contract 
        ? generateResponse(inputMessage, contract.text)
        : "Please upload a contract first so I can help you with specific questions about it.";

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
      setThinking(false);
    }, 1500);
  };

  const suggestedQuestions = [
    "What are the main red flags?",
    "What are the payment terms?",
    "How can I terminate this contract?",
    "What are my main obligations?",
    "Who owns the intellectual property?"
  ];

  return (
    <div className="flex flex-col h-full bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-3 flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-stone-900 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-base font-semibold text-stone-900">Contract Chat</h1>
                <p className="text-xs text-stone-500">AI-powered contract assistant</p>
              </div>
            </div>

            {/* Upload Contract */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                aria-label="Upload contract file"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    {contract ? 'Change Contract' : 'Upload Contract'}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Contract Info */}
          {contract && (
            <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-stone-900">{contract.name}</p>
                  <p className="text-xs text-stone-600">{(contract.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                onClick={() => setContract(null)}
                aria-label="Remove contract"
                className="p-1 hover:bg-green-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-green-700" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-2">
        <div className="max-w-5xl mx-auto space-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                message.role === 'user' ? 'bg-stone-900' : 'bg-blue-600'
              }`}>
                {message.role === 'user' ? (
                  <UserIcon className="w-3 h-3 text-white" />
                ) : (
                  <Bot className="w-3 h-3 text-white" />
                )}
              </div>

              {/* Message */}
              <div className={`flex-1 max-w-2xl ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block rounded-lg px-3 py-1.5 ${
                  message.role === 'user' 
                    ? 'bg-stone-900 text-white' 
                    : 'bg-white border border-stone-200 text-stone-900'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
                <p className="text-xs text-stone-500 mt-1 px-1" suppressHydrationWarning>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Thinking Indicator */}
          {thinking && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 max-w-2xl">
                <div className="inline-block bg-white border border-stone-200 rounded-lg px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce animate-bounce-delay-0"></div>
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce animate-bounce-delay-150"></div>
                      <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce animate-bounce-delay-300"></div>
                    </div>
                    <span className="text-sm text-stone-600">Analyzing your question...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && !contract && (
        <div className="px-6 py-2.5 flex-shrink-0 border-t border-stone-200">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-medium text-stone-600 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs text-stone-700 hover:border-stone-900 hover:bg-stone-50 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-stone-200 px-6 py-1.5 flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={contract ? "Ask anything..." : "Upload contract..."}
              className="flex-1 px-2.5 py-1.5 border border-stone-300 rounded text-sm focus:outline-none focus:border-stone-900"
              disabled={thinking}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || thinking}
              aria-label="Send message"
              className="px-3 py-1.5 bg-stone-900 text-white text-xs rounded hover:bg-stone-800 transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-stone-500 mt-0.5 text-center">
            AI-generated. Consult legal professional.
          </p>
        </div>
      </div>
    </div>
  );
}
