'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search,
  Bell,
  Settings,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Menu
} from 'lucide-react';

export default function DashboardHeader({ onMobileMenuOpen }) {
  const [user, setUser] = useState({ fullName: 'Loading...', role: 'Student' });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name || name === 'Loading...') return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('chat_session_id');
    router.push('/');
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-[#13111A]/80 backdrop-blur-md border-b border-white/5 flex-shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="md:hidden flex-1">
          <span className="font-bold text-[22px] text-indigo-100 tracking-tight">PDF Assistant</span>
        </div>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search documents..." 
            className="bg-slate-950/50 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500/50 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="hidden md:flex w-10 h-10 rounded-xl bg-white/5 items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#13111A]" />
        </button>
        
        <div className="hidden md:block h-8 w-[1px] bg-white/5 mx-1" />
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 pl-1 md:pl-2 group focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white leading-none mb-1 group-hover:text-indigo-400 transition-colors">
                {user.fullName}
              </p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {user.role}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full md:rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform text-sm md:text-base border border-indigo-400/30">
                {getInitials(user.fullName)}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </div>
          </button>

          {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#1E1C27] border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 z-50">
                  <div className="px-4 py-3 border-b border-white/5 sm:hidden">
                    <p className="text-sm font-semibold text-white truncate">{user.fullName}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email || user.role}</p>
                  </div>
                  <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                    <UserIcon className="w-4 h-4" /> My Profile
                  </Link>
                  <Link href="/profile" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors">
                    <Settings className="w-4 h-4" /> Account Settings
                  </Link>
                  <div className="h-px bg-white/5 my-2"></div>
                  <button onClick={() => { setIsDropdownOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
        </div>
      </div>
    </header>
  );
}
