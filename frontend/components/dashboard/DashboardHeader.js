'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, 
  Search, 
  Bell 
} from 'lucide-react';

export default function DashboardHeader({ onMobileMenuOpen }) {
  const [user, setUser] = useState({ fullName: 'Loading...', role: 'Student' });

  useEffect(() => {
    const getCookie = (name) => {
      if (typeof document === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
      return null;
    };

    const userCookie = getCookie('user');
    if (userCookie) {
      try {
        setUser(JSON.parse(userCookie));
      } catch (e) {
        console.error('Failed to parse user cookie', e);
      }
    }
  }, []);

  const getInitials = (name) => {
    if (!name || name === 'Loading...') return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#13111A]/80 backdrop-blur-md border-b border-white/5 flex-shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-slate-400 p-2 hover:bg-white/5 rounded-lg transition-colors"
          onClick={onMobileMenuOpen}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#13111A]" />
        </button>
        
        <div className="h-8 w-[1px] bg-white/5 mx-1" />
        
        <Link href="/profile" className="flex items-center gap-3 pl-2 group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white leading-none mb-1 group-hover:text-indigo-400 transition-colors">
              {user.fullName}
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              {user.role}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            {getInitials(user.fullName)}
          </div>
        </Link>
      </div>
    </header>
  );
}
