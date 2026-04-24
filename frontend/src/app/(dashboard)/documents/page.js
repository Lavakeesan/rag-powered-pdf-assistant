'use client';

import { useState } from 'react';
import { 
  Files, 
  Search, 
  Filter, 
  MoreVertical, 
  FileText, 
  Trash2, 
  ExternalLink,
  Calendar,
  Grid,
  List as ListIcon,
  CheckCircle2,
  Clock,
  ChevronDown
} from 'lucide-react';

const mockDocuments = [
  { id: 1, name: 'Quantum_Physics_Notes.pdf', date: 'Oct 24, 2024', size: '2.4 MB', status: 'processed' },
  { id: 2, name: 'Macroeconomics_Report.pdf', date: 'Oct 22, 2024', size: '4.1 MB', status: 'processed' },
  { id: 3, name: 'Modern_Art_History.pdf', date: 'Oct 20, 2024', size: '1.8 MB', status: 'processing' },
  { id: 4, name: 'Organic_Chemistry_Ch5.pdf', date: 'Oct 15, 2024', size: '8.2 MB', status: 'processed' },
  { id: 5, name: 'Digital_Marketing_Case_Study.pdf', date: 'Oct 12, 2024', size: '1.2 MB', status: 'processed' },
  { id: 6, name: 'Introduction_to_Psychology.pdf', date: 'Oct 10, 2024', size: '3.5 MB', status: 'processed' },
];

export default function DocumentsPage() {
  const [view, setView] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = mockDocuments.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">My Documents</h1>
          <p className="text-slate-400">Manage and organize your uploaded study materials.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-white/5 p-1 rounded-xl">
          <button 
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search by filename..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all shadow-xl"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-slate-950/50 border border-white/10 rounded-2xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-all">
          <Filter className="w-4 h-4" />
          Filters
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Content */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div key={doc.id} className="glass-card p-6 rounded-[32px] border border-white/5 group hover:border-indigo-500/30 transition-all duration-300 relative">
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <FileText className="w-7 h-7" />
                </div>
                <button className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-lg font-bold text-white mb-2 truncate pr-4 group-hover:text-indigo-400 transition-colors">{doc.name}</h3>
              
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-6">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {doc.date}
                </div>
                <div className="flex items-center gap-1.5 uppercase tracking-wider">
                  {doc.size}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${
                  doc.status === 'processed' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {doc.status === 'processed' ? (
                    <><CheckCircle2 className="w-3 h-3" /> Processed</>
                  ) : (
                    <><Clock className="w-3 h-3 animate-pulse" /> Processing</>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-indigo-400 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/5">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Document Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Upload Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Size</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-slate-400 font-medium">{doc.date}</td>
                  <td className="px-6 py-5 text-sm text-slate-500 font-bold uppercase">{doc.size}</td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                      doc.status === 'processed' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-500 hover:text-white transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-500 hover:text-red-400 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
