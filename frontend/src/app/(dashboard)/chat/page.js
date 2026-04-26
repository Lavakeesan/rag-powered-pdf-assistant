'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  User, 
  Bot, 
  RotateCcw, 
  Info,
  Files,
  ChevronDown
} from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! Select a document and ask me anything. I'll provide grounded answers with citations.", time: '10:42 AM' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: "Based on the uploaded document, the key concepts involve RAG technology and vector search for accurate information retrieval.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col gap-6 animate-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Ask AI</h1>
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-300">
            <Files className="w-3.5 h-3.5 text-indigo-400" /> Quantum_Physics.pdf <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg"><RotateCcw className="w-4 h-4" /></button>
      </div>

      <div className="flex-1 glass-card rounded-[32px] border border-white/5 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold ${msg.role === 'assistant' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-800 text-slate-300'}`}>
                {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] p-5 rounded-3xl ${msg.role === 'assistant' ? 'bg-white/5 border border-white/10 rounded-tl-none' : 'bg-indigo-600 text-white rounded-tr-none'}`}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-wider">{msg.time}</p>
              </div>
            </div>
          ))}
          {isTyping && <div className="flex gap-4 animate-pulse"><div className="w-10 h-10 rounded-2xl bg-indigo-600" /><div className="bg-white/5 p-4 rounded-3xl">Typing...</div></div>}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-6 bg-[#13111A]/80 backdrop-blur-md border-t border-white/5">
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <button type="button" className="p-3 text-slate-500 hover:text-white"><Paperclip className="w-5 h-5" /></button>
            <div className="relative flex-1">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all" />
              <button type="submit" disabled={!input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-500 transition-all"><Send className="w-4 h-4" /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
