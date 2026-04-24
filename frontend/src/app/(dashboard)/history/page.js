'use client';

import { useState } from 'react';
import { 
  History, 
  Search, 
  MessageSquare, 
  Trash2, 
  ArrowUpRight, 
  Clock, 
  Calendar,
  ChevronRight,
  MoreVertical,
  Filter
} from 'lucide-react';
import Link from 'next/link';

const historyItems = [
  { id: 1, title: 'Quantum Mechanics Basics', lastMsg: 'Explain the Schrödinger equation', date: 'Today, 10:45 AM', doc: 'Quantum_Physics_Notes.pdf' },
  { id: 2, title: 'Macroeconomics Trends', lastMsg: 'What is the current inflation rate?', date: 'Yesterday, 02:20 PM', doc: 'Macro_Final_Report.pdf' },
  { id: 3, title: 'Renaissance Art History', lastMsg: 'Impact of Leonardo da Vinci', date: 'Oct 22, 2024', doc: 'Art_History_Summary.pdf' },
  { id: 4, title: 'Organic Chemistry Prep', lastMsg: 'List of all functional groups', date: 'Oct 20, 2024', doc: 'Chemistry_Review.pdf' },
  { id: 5, title: 'World War II Timeline', lastMsg: 'Key turning points in 1942', date: 'Oct 18, 2024', doc: 'History_Notes.pdf' },
  { id: 6, title: 'Intro to Algorithms', lastMsg: 'Space complexity of Merge Sort', date: 'Oct 15, 2024', doc: 'Algo_Handout.pdf' },
];

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = historyItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.lastMsg.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Chat History</h1>
          <p className="text-slate-400">Revisit your previous conversations with AI.</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search conversations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all shadow-xl"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-4 bg-slate-950/50 border border-white/10 rounded-2xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-900 transition-all">
          <Filter className="w-4 h-4" />
          Filter By Date
        </button>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <div key={item.id} className="glass-card p-6 rounded-[32px] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                      <span className="w-1 h-1 bg-slate-700 rounded-full" />
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {item.doc}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <p className="text-sm text-slate-400 italic sm:max-w-[200px] truncate hidden lg:block">"{item.lastMsg}"</p>
                  <div className="flex items-center gap-2">
                    <Link href="/chat" className="px-5 py-2.5 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2">
                      Open Chat <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                    <button className="p-2.5 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card p-20 rounded-[40px] border border-white/5 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-[32px] bg-slate-900 flex items-center justify-center mb-6">
              <History className="w-10 h-10 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No conversations found</h3>
            <p className="text-slate-500 max-w-sm">Start a new chat to begin your learning journey with Lumina AI.</p>
          </div>
        )}
      </div>
    </div>
  );
}
