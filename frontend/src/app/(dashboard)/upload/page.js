'use client';

import { useState } from 'react';
import { 
  FileUp, 
  File, 
  Trash2, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      status: 'uploading',
      progress: 0
    }));
    setFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach(file => simulateUpload(file.id));
  };

  const simulateUpload = (id) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress: 100, status: 'completed' } : f));
      } else {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, progress } : f));
      }
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Upload Documents</h1>
        <p className="text-slate-400">Upload your PDF files and start asking questions instantly.</p>
      </div>

      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange({ target: { files: e.dataTransfer.files } }); }}
        className={`glass-card rounded-[40px] border-2 border-dashed transition-all duration-300 p-12 flex flex-col items-center justify-center text-center cursor-pointer group ${
          isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/20'
        }`}
      >
        <input type="file" multiple accept=".pdf" onChange={handleFileChange} className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <div className="w-20 h-20 rounded-[28px] bg-indigo-600/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileUp className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Drag and drop files here</h3>
          <p className="text-slate-500 mb-6">Support for PDF documents up to 50MB</p>
          <div className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
            Select Files
          </div>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white px-2">Uploaded Files</h2>
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="glass-card p-4 rounded-3xl border border-white/5 flex items-center justify-between group animate-in fade-in duration-500">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center relative overflow-hidden">
                    <File className="w-6 h-6 text-slate-500" />
                    {file.status === 'uploading' && (
                      <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-white truncate pr-4">{file.name}</h4>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{file.size}</span>
                    </div>
                    {file.status === 'uploading' ? (
                      <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${file.progress}%` }} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        Ready to analyze
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {file.status === 'completed' && (
                    <button className="p-3 rounded-xl bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 text-xs font-bold">
                      Start Chat <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  <button onClick={() => setFiles(prev => prev.filter(f => f.id !== file.id))} className="p-3 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
