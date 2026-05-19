'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Files, 
  Search, 
  FileText, 
  Trash2, 
  Calendar, 
  Grid, 
  List as ListIcon, 
  CheckCircle2, 
  Loader2,
  FileUp,
  AlertCircle
} from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState('grid');
  const [userEmail, setUserEmail] = useState('');

  // 1. Load user from cookies and fetch documents
  useEffect(() => {
    try {
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='));
      if (userCookie) {
        const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        if (userData && userData.email) {
          setUserEmail(userData.email);
          fetchDocuments(userData.email);
          return;
        }
      }
      setIsLoading(false);
      setError('Please login to view your documents.');
    } catch (e) {
      console.error("Failed to parse user cookie:", e);
      setIsLoading(false);
      setError('Could not verify user login.');
    }
  }, []);

  const fetchDocuments = async (email) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:8000/documents?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error('Failed to load documents');
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      setError('Could not connect to the server or load S3 bucket. Ensure your backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Delete document handler
  const handleDeleteDoc = async (key, filename) => {
    if (!confirm(`Are you sure you want to permanently delete "${filename}" from S3 storage?`)) return;

    try {
      const res = await fetch(`http://localhost:8000/documents?key=${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Deletion failed');
      
      // Update local state
      setDocuments(prev => prev.filter(doc => doc.key !== key));
    } catch (err) {
      alert(`Could not delete document: ${err.message}`);
    }
  };

  // 3. Filter documents by search query
  const filteredDocs = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">My Documents</h1>
          <p className="text-slate-400 text-sm md:text-base">Manage, search, and organize your uploaded study materials stored in S3.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900/60 border border-white/5 p-1 rounded-2xl">
            <button 
              onClick={() => setView('grid')} 
              className={`p-2.5 rounded-xl transition-all ${view === 'grid' ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setView('list')} 
              className={`p-2.5 rounded-xl transition-all ${view === 'list' ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>
          <Link 
            href="/chat" 
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white py-3 px-5 rounded-2xl font-bold hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
          >
            <FileUp className="w-4 h-4" />
            Upload PDF
          </Link>
        </div>
      </div>

      {/* Search Input */}
      {documents.length > 0 && (
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search study documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-medium text-sm"
          />
        </div>
      )}

      {/* Main States rendering */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
          <p className="text-slate-400 font-semibold tracking-wider text-sm">LOADING YOUR S3 WORKSPACE...</p>
        </div>
      ) : error ? (
        <div className="glass-card rounded-[32px] p-8 border border-red-500/10 bg-red-500/5 flex items-center gap-4 text-red-400">
          <AlertCircle className="w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">Failed to sync S3 storage</h3>
            <p className="text-sm text-red-400/80">{error}</p>
          </div>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="glass-card rounded-[40px] p-12 md:p-20 text-center border border-white/5 bg-slate-950/20 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <div className="w-20 h-20 rounded-[28px] bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500">
            <Files className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">No documents found</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              {searchQuery 
                ? `No documents match your search query "${searchQuery}".` 
                : "Your personal S3 cloud storage is currently empty. Upload your study PDFs inside the dynamic Ask AI workspace to get started!"
              }
            </p>
          </div>
          {!searchQuery && (
            <Link 
              href="/chat" 
              className="mt-2 bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Go to Workspace
            </Link>
          )}
        </div>
      ) : view === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id} 
              className="glass-card p-6 rounded-[32px] border border-white/5 group hover:border-cyan-500/30 hover:shadow-cyan-500/5 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-indigo-500 group-hover:text-white transition-all duration-300">
                  <FileText className="w-7 h-7" />
                </div>
                <button 
                  onClick={() => handleDeleteDoc(doc.key, doc.name)}
                  className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-xl"
                  title="Delete from S3"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-cyan-400 transition-colors" title={doc.name}>
                {doc.name}
              </h3>
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {doc.date}
                </div>
                <div className="uppercase tracking-wider">{doc.size}</div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready & Indexed
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="glass-card rounded-[32px] border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-950/20 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="p-6">Document Name</th>
                  <th className="p-6">Upload Date</th>
                  <th className="p-6">Size</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-6 font-semibold text-white flex items-center gap-3">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      <span className="truncate max-w-xs md:max-w-md" title={doc.name}>{doc.name}</span>
                    </td>
                    <td className="p-6 text-slate-400 font-medium">{doc.date}</td>
                    <td className="p-6 text-slate-400 font-medium uppercase tracking-wider">{doc.size}</td>
                    <td className="p-6">
                      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleDeleteDoc(doc.key, doc.name)}
                        className="text-slate-500 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-xl"
                        title="Delete from S3"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
