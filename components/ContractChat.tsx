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
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract text');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to extract text');
      }

      const text = data.text;
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
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error reading that file. Please try a different document.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    }
    setUploading(false);
  };

  const handleSendMessage = async () => {
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

    // Indicate AI thinking
    setThinking(true);
    
    if (!contract) {
      setTimeout(() => {
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Please upload a contract first so I can help you with specific questions about it.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMsg]);
        setThinking(false);
      }, 500);
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          context: {
            contractText: contract.text
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get chat response');
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response || "I couldn't generate an answer. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to the AI assistant. Please try asking your question again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setThinking(false);
    }
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
