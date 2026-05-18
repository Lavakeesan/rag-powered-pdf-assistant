'use client';

import { useState } from 'react';
import { 
  Files, 
  Search, 
  Filter, 
  FileText, 
  Trash2, 
  ExternalLink,
  Calendar,
  Grid,
  List as ListIcon,
  CheckCircle2,
  Clock
} from 'lucide-react';

const mockDocuments = [
  { id: 1, name: 'Quantum_Physics_Notes.pdf', date: 'Oct 24, 2024', size: '2.4 MB', status: 'processed' },
  { id: 2, name: 'Macroeconomics_Report.pdf', date: 'Oct 22, 2024', size: '4.1 MB', status: 'processed' },
  { id: 3, name: 'Modern_Art_History.pdf', date: 'Oct 20, 2024', size: '1.8 MB', status: 'processing' },
];

export default function DocumentsPage() {
  const [view, setView] = useState('grid');
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">My Documents</h1>
          <p className="text-slate-400">Manage and organize your uploaded study materials.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-white/5 p-1 rounded-xl">
          <button onClick={() => setView('grid')} className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}><Grid className="w-5 h-5" /></button>
          <button onClick={() => setView('list')} className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}><ListIcon className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDocuments.map((doc) => (
          <div key={doc.id} className="glass-card p-6 rounded-[32px] border border-white/5 group hover:border-indigo-500/30 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all"><FileText className="w-7 h-7" /></div>
              <button className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl"><ExternalLink className="w-5 h-5" /></button>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-indigo-400 transition-colors">{doc.name}</h3>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-6">
              <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{doc.date}</div>
              <div className="uppercase tracking-wider">{doc.size}</div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${doc.status === 'processed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {doc.status === 'processed' ? <><CheckCircle2 className="w-3 h-3" /> Processed</> : <><Clock className="w-3 h-3 animate-pulse" /> Processing</>}
              </div>
              <button className="p-2 text-slate-500 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
