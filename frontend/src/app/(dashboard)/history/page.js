'use client';

import { useState } from 'react';
import { History as HistoryIcon, Search, MessageSquare, Trash2, ArrowUpRight, Calendar, Filter } from 'lucide-react';
import Link from 'next/link';

const historyItems = [
  { id: 1, title: 'Quantum Mechanics Basics', lastMsg: 'Explain the Schrödinger equation', date: 'Today, 10:45 AM', doc: 'Quantum_Physics.pdf' },
  { id: 2, title: 'Macroeconomics Trends', lastMsg: 'What is inflation?', date: 'Yesterday, 02:20 PM', doc: 'Macro_Report.pdf' },
];

export default function HistoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Chat History</h1>
        <p className="text-slate-400">Revisit your previous conversations with AI.</p>
      </div>

      <div className="space-y-4">
        {historyItems.map((item) => (
          <div key={item.id} className="glass-card p-6 rounded-[32px] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/10 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all"><MessageSquare className="w-6 h-6" /></div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {item.date}</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full" />
                    <span>{item.doc}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/chat" className="px-5 py-2.5 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2">Open Chat <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                <button className="p-2.5 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
