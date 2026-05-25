"use client";
import { 
  FileUp, 
  MessageSquare, 
  FolderOpen, 
  ArrowUpRight, 
  Clock, 
  Zap, 
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [userName, setUserName] = useState('');
  const [totalPdfs, setTotalPdfs] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='));
      if (userCookie) {
        try {
          const userJson = decodeURIComponent(userCookie.split('=')[1]);
          const user = JSON.parse(userJson);
          setUserName(user.fullName || user.email?.split('@')[0] || 'User');
          // Fetch total PDFs for this user
          const fetchTotal = async () => {
            try {
              const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/documents?email=${encodeURIComponent(user.email)}`);
              if (resp.ok) {
                const docs = await resp.json();
                setTotalPdfs(Array.isArray(docs) ? docs.length : 0);
              } else {
                console.error('Failed to fetch documents', resp.status);
              }
            } catch (err) {
              console.error('Error fetching documents', err);
            }
          };
          fetchTotal();
        } catch (e) {
          console.error('Failed to parse user cookie', e);
        }
      }
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome back, {userName || 'User'} 👋</h1>
          <p className="text-slate-400">Here's what's happening with your documents today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/upload" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20">
            <FileUp className="w-4 h-4" />
            Upload PDF
          </Link>

        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { label: 'Total PDFs Uploaded', value: totalPdfs, icon: FolderOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Questions Asked', value: '154', icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'AI Responses Generated', value: '148', icon: Zap, color: 'text-amber-400', bg: 'bg-amber-400/10' },
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
    </div>
  );
}
