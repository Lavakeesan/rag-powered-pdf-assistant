'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  User, 
  Bot, 
  Copy, 
  RotateCcw, 
  ThumbsUp, 
  ThumbsDown,
  Info,
  ExternalLink,
  ChevronDown,
  Files
} from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello Alex! I'm your AI study assistant. Select a document and ask me anything about it. I'll provide grounded answers with citations.", time: '10:42 AM' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      setIsTyping(false);
      const assistantMessage = { 
        role: 'assistant', 
        content: "Based on page 24 of 'Quantum Mechanics Basics', the Schrödinger equation describes how the quantum state of a physical system changes with time. It is a fundamental result in quantum mechanics and its discovery was a significant landmark in the development of the subject.", 
        sources: ['Quantum Mechanics Basics.pdf (pg. 24)', 'Modern Physics.pdf (pg. 112)'],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col gap-6 animate-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Ask AI</h1>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-all group">
            <Files className="w-3.5 h-3.5 text-indigo-400" />
            Quantum_Physics_Notes.pdf
            <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-white transition-all" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Reset Chat">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-all" title="Chat Info">
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 glass-card rounded-[32px] border border-white/5 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-[#13111A] to-transparent z-10 pointer-events-none" />
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pt-10">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold ${
                msg.role === 'assistant' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              
              <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-5 rounded-3xl ${
                  msg.role === 'assistant' 
                    ? 'bg-white/5 border border-white/10 rounded-tl-none text-slate-200' 
                    : 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-600/20'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {msg.sources && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> Sources
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.sources.map((source, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                            {source}
                            <ExternalLink className="w-2.5 h-2.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className={`flex items-center gap-4 mt-2 px-1`}>
                  <span className="text-[10px] font-bold text-slate-600 tracking-wider uppercase">{msg.time}</span>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 text-slate-600 hover:text-slate-400"><Copy className="w-3 h-3" /></button>
                      <button className="p-1 text-slate-600 hover:text-emerald-500"><ThumbsUp className="w-3 h-3" /></button>
                      <button className="p-1 text-slate-600 hover:text-red-500"><ThumbsDown className="w-3 h-3" /></button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 animate-in fade-in duration-300">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex-shrink-0 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-white/5 border border-white/10 p-4 rounded-3xl rounded-tl-none flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-[#13111A]/80 backdrop-blur-md border-t border-white/5">
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <button type="button" className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="relative flex-1 group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question about your documents..."
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all group-hover:border-white/20"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
          <p className="text-center text-[10px] text-slate-600 mt-4 font-bold uppercase tracking-[0.2em]">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
