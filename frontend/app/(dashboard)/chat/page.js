'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Sparkles, 
  User, 
  Bot, 
  RotateCcw, 
  Files,
  ChevronDown,
  FileUp
} from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isTyping]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    const userMessage = input;
    const fileToUpload = selectedFile;

    // 1. Add user message to UI immediately
    let displayContent = userMessage;
    if (fileToUpload && !userMessage.trim()) {
        displayContent = `Uploaded document: ${fileToUpload.name}`;
    } else if (fileToUpload && userMessage.trim()) {
        displayContent = `[Attached: ${fileToUpload.name}] ${userMessage}`;
    }

    setMessages(prev => [...prev, { 
        role: 'user', 
        content: displayContent, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    
    setInput('');
    const fileName = fileToUpload?.name;
    removeFile();
    setIsTyping(true);

    try {
        // 2. If there's a file, upload it first
        if (fileToUpload) {
            const formData = new FormData();
            formData.append('file', fileToUpload);
            const uploadRes = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });
            if (!uploadRes.ok) throw new Error('Failed to upload and process PDF');
        }

        // 3. Ask the question
        const askRes = await fetch('http://localhost:8000/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                question: userMessage || `Please summarize the document: ${fileName}` 
            }),
        });
        
        if (!askRes.ok) throw new Error('Failed to get answer from AI');
        
        const data = await askRes.json();
        
        // 4. Add AI response to UI
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.answer, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
    } catch (err) {
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: `Sorry, I encountered an error: ${err.message}. Please check your backend connection and API keys.`, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col gap-6 animate-in slide-in-from-right-4 duration-700">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Ask AI</h1>
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-slate-300">
            <Files className="w-3.5 h-3.5 text-indigo-400" /> Current_Workspace <ChevronDown className="w-3 h-3" />
          </button>
        </div>
        <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setMessages([])}><RotateCcw className="w-4 h-4" /></button>
      </div>

      <div className="flex-1 glass-card rounded-[32px] border border-white/5 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
          {messages.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center mb-8 border border-indigo-500/20">
                <Sparkles className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">What do you want to know?</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                Upload a PDF document and ask any question. I'll analyze the content and provide accurate, cited answers.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-slate-300 transition-colors border border-white/5" onClick={() => setInput('Summarize the main points of the document')}>
                  <FileUp className="w-4 h-4 text-indigo-400" /> Summarize document
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-slate-300 transition-colors border border-white/5" onClick={() => setInput('Explain the methodology used')}>
                  <Sparkles className="w-4 h-4 text-purple-400" /> Explain methodology
                </button>
              </div>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
        <div className="p-6 bg-[#13111A]/80 backdrop-blur-md border-t border-white/5">
          {selectedFile && (
            <div className="mb-3 flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 w-max px-4 py-2 rounded-xl text-xs font-medium text-indigo-300 animate-in fade-in slide-in-from-bottom-2">
              <Files className="w-4 h-4" />
              <span className="truncate max-w-[200px]">{selectedFile.name}</span>
              <button type="button" onClick={removeFile} className="ml-2 hover:text-white transition-colors text-indigo-400">&times;</button>
            </div>
          )}
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <input 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="relative flex-1">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask a question..." className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all" />
              <button type="submit" disabled={!input.trim() && !selectedFile} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"><Send className="w-4 h-4" /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
