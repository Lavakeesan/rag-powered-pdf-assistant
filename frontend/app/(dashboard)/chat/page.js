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
  FileUp,
  File,
  Trash2,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const dropzoneInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleFileUpload = async (rawFile) => {
    if (!rawFile || rawFile.type !== 'application/pdf') return;

    const fileId = Math.random().toString(36).substr(2, 9);
    const newFileRecord = {
      id: fileId,
      name: rawFile.name,
      size: (rawFile.size / (1024 * 1024)).toFixed(2) + ' MB',
      status: 'uploading',
      progress: 25
    };

    setUploadedFiles(prev => [newFileRecord, ...prev]);

    try {
      const formData = new FormData();
      formData.append('file', rawFile);

      // Parse user profile from cookies to partition uploads in S3
      try {
        const userCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user='));
        if (userCookie) {
          const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
          if (userData && userData.email) {
            formData.append('email', userData.email);
          }
          if (userData && userData.userId) {
            formData.append('userId', userData.userId);
          }
        }
      } catch (e) {
        console.error("Failed to parse user cookie for S3 partitioning:", e);
      }

      setUploadedFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 60 } : f));

      const uploadRes = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      setUploadedFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 100, status: 'completed' } : f));

      // Append success alert in chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `📚 Processed "${rawFile.name}" successfully! You can now ask questions about this document.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setUploadedFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'error', progress: 0 } : f));
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Error processing "${rawFile.name}". Please check if backend is running or keys are correct.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleDeleteFile = (id, name) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `🗑️ Removed "${name}" reference from current workspace.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { 
      role: 'user', 
      content: userMessage, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    
    setInput('');
    setIsTyping(true);

    try {
      const askRes = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });
      
      if (!askRes.ok) throw new Error('Could not retrieve AI response.');
      
      const data = await askRes.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Sorry, I encountered an error: ${err.message}. Please check if backend is running.`, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex gap-6 relative overflow-hidden animate-in slide-in-from-right-4 duration-700">
      
      {/* 1. Collapsible Documents & Upload Panel */}
      <div 
        className={`${
          isPanelOpen ? 'w-80 border-r border-white/5 opacity-100 pr-4' : 'w-0 opacity-0 overflow-hidden pr-0'
        } transition-all duration-300 flex flex-col h-full space-y-6 flex-shrink-0 z-10 absolute md:relative bg-[#0B0A10]/95 md:bg-transparent`}
      >
        <div className="flex flex-col h-full space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Files className="w-5 h-5 text-indigo-400" /> Documents
            </h3>
            <span className="text-[10px] font-bold bg-white/5 border border-white/10 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {uploadedFiles.length} files
            </span>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileUpload(e.dataTransfer.files[0]); }}
            onClick={() => dropzoneInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center group ${
              isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-indigo-500/30 bg-slate-950/20'
            }`}
          >
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={dropzoneInputRef} 
              onChange={handleFileChange} 
            />
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileUp className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">Upload PDF</p>
            <p className="text-[10px] text-slate-500">Drag & drop or click</p>
          </div>

          {/* List of Uploaded Documents */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {uploadedFiles.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center border border-white/5 rounded-3xl bg-slate-950/10">
                <File className="w-10 h-10 text-slate-600 mb-3" />
                <p className="text-xs font-semibold text-slate-400 mb-1">No documents yet</p>
                <p className="text-[10px] text-slate-600 max-w-[180px] mx-auto leading-relaxed">
                  Upload PDF articles, notes, or manuals to query them with Lumina AI.
                </p>
              </div>
            ) : (
              uploadedFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="glass-card p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-3 hover:border-white/10 transition-colors animate-in fade-in duration-300"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                      <File className="w-5 h-5 text-slate-400" />
                      {file.status === 'uploading' && (
                        <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                          <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{file.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        {file.status === 'completed' ? (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                          </span>
                        ) : file.status === 'error' ? (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-red-400 uppercase tracking-widest">
                            <AlertCircle className="w-2.5 h-2.5" /> Failed
                          </span>
                        ) : (
                          <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{ width: `${file.progress}%` }} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteFile(file.id, file.name)} 
                    className="p-2 hover:bg-red-500/10 text-slate-500 hover:text-red-400 rounded-lg transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 2. Chat Panel */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Chat Header */}
        <div className="flex items-center justify-between mb-4 flex-shrink-0 px-2">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              className="p-2 bg-white/5 border border-white/10 text-slate-300 hover:text-white rounded-xl transition-all"
              title={isPanelOpen ? "Close panel" : "Open documents panel"}
            >
              {isPanelOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Ask AI Workspace
            </h1>
          </div>
          <button 
            className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors" 
            onClick={() => setMessages([])}
            title="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Chat Conversation Box */}
        <div className="flex-1 glass-card rounded-[32px] border border-white/5 flex flex-col overflow-hidden relative">
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative">
            {messages.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center mb-8 border border-indigo-500/20">
                  <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight leading-tight">What do you want<br />to know?</h2>
                <p className="text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed text-sm">
                  Upload PDF articles, notes, or books in the sidebar and chat with Lumina AI to query them seamlessly.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button 
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-colors border border-white/5" 
                    onClick={() => setInput('Summarize the main findings of the uploaded documents')}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Summarize main points
                  </button>
                  <button 
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-slate-300 transition-colors border border-white/5" 
                    onClick={() => setInput('What are the key methodologies used in this analysis?')}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Key methodologies
                  </button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold ${
                      msg.role === 'assistant' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <div className={`max-w-[75%] p-5 rounded-3xl ${
                      msg.role === 'assistant' ? 'bg-white/5 border border-white/5 rounded-tl-none text-slate-300' : 'bg-indigo-600 text-white rounded-tr-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-[9px] font-bold text-slate-500 mt-3 uppercase tracking-widest">{msg.time}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-4 animate-pulse duration-1000">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/50 flex items-center justify-center"><Bot className="w-5 h-5 text-indigo-300" /></div>
                    <div className="bg-white/5 border border-white/5 p-5 rounded-3xl rounded-tl-none flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce delay-100"></span>
                      <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce delay-200"></span>
                      <span className="w-2 h-2 rounded-full bg-slate-500 animate-bounce delay-300"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Bottom Chat Bar */}
          <div className="p-6 bg-[#13111A]/80 backdrop-blur-md border-t border-white/5 flex-shrink-0">
            <form onSubmit={handleSend} className="relative flex items-center gap-3">
              <input 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={(e) => handleFileUpload(e.target.files[0])} 
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()} 
                className="p-4 text-slate-500 hover:text-indigo-400 hover:bg-white/5 rounded-2xl transition-all"
                title="Quick upload PDF"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  placeholder="Type a message or query your PDFs..." 
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-5 pr-14 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder-slate-500" 
                />
                <button 
                  type="submit" 
                  disabled={!input.trim()} 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-500 hover:shadow-indigo-600/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
