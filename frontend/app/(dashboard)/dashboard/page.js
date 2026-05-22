"use client";
import { FileUp, MessageSquare, Files, ArrowUpRight, Clock, Zap, ChevronRight, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total_pdfs: 0, total_questions: 0, total_responses: 0 });
  const [recentDocs, setRecentDocs] = useState([]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('user_email') || '';
    if (storedEmail) {
      const fetchData = async () => {
        try {
          const statsRes = await fetch('/stats');
          const statsData = await statsRes.json();
          setStats(statsData);
          const docsRes = await fetch(`/documents?email=${storedEmail}`);
          const docsData = await docsRes.json();
          setRecentDocs(docsData);
        } catch (e) {
          console.error('Failed to fetch dashboard data', e);
        }
      };
      fetchData();
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back, Alex 👋</h1>
          <p className="text-slate-400">Here's what's happening with your documents today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/upload" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
            <FileUp className="w-4 h-4" />
            Upload PDF
          </Link>
          <Link href="/chat" className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-sm font-bold transition-all">
            <MessageSquare className="w-4 h-4" />
            Ask Question
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total PDFs Uploaded', value: stats.total_pdfs, icon: Files, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Questions Asked', value: stats.total_questions, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'AI Responses Generated', value: stats.total_responses, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl border border-white/5 group hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-400/10 px-2 py-1 rounded-lg">
                <TrendingUp className="w-3 h-3" />
                +12%
              </div>
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
            <Link href="/history" className="text-sm font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="glass-card rounded-[32px] border border-white/5 overflow-hidden">
            <div className="divide-y divide-white/5">
              {[
                { type: 'chat', title: 'Quantum Mechanics Basics', subtitle: 'Asked about Schrödinger equation', time: '2 mins ago' },
                { type: 'upload', title: 'Macroeconomics_Final.pdf', subtitle: 'Successfully processed', time: '1 hour ago' },
                { type: 'chat', title: 'History of Renaissance', subtitle: 'Analyzed art influence', time: '3 hours ago' },
                { type: 'upload', title: 'Biology_Lab_Report.pdf', subtitle: 'Successfully processed', time: 'Yesterday' },
              ].map((activity, i) => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.type === 'chat' ? 'bg-purple-600/10 text-purple-400' : 'bg-blue-600/10 text-blue-400'}`}>
                      {activity.type === 'chat' ? <MessageSquare className="w-5 h-5" /> : <FileUp className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{activity.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{activity.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hidden sm:block">{activity.time}</span>
                    <button className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white px-2">Quick Actions</h2>
          <div className="glass-card p-6 rounded-[32px] border border-white/10 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors" />
            <Sparkles className="w-10 h-10 text-indigo-400 mb-6" />
            <h3 className="text-lg font-bold text-white mb-3">Upgrade to Pro</h3>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Get unlimited PDF uploads, faster AI responses, and advanced RAG features.
            </p>
            <button className="w-full py-3 bg-white text-slate-950 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all">
              Learn More
            </button>
          </div>

          {/* Recent Documents */}
          <div className="glass-card p-6 rounded-[32px] border border-white/5">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Recent Documents
            </h3>
            <div className="space-y-3">
              {recentDocs.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-center">
                      <Files className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">{doc.name}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
