'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileUp,
  FolderOpen,
  MessageSquare,
  History,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { name: 'Ask AI', icon: MessageSquare, href: '/chat' },
  { name: 'My Documents', icon: FolderOpen, href: '/documents' },
  { name: 'History', icon: History, href: '/history' },
  { name: 'Settings', icon: Settings, href: '/profile' },
];

export default function Sidebar({ isOpen, toggleSidebar, isMobileOpen, closeMobile }) {
  const pathname = usePathname();
  const router = useRouter();
  const isExpanded = isOpen || isMobileOpen;

  const handleLogout = async () => {
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('chat_session_id');
    router.push('/');
  };

  return (
    <aside 
      className={`flex flex-col bg-[#13111A] border-r border-white/5 flex-shrink-0 z-50 overflow-hidden transition-all duration-300 ease-in-out
        fixed inset-y-0 left-0 h-full
        md:relative md:translate-x-0
        ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${isOpen ? 'md:w-64' : 'md:w-20'}
      `}
    >
      <div className="p-6 flex items-center gap-3">
        <Image src="/logo.jpg" alt="AskMyPDF Logo" width={32} height={32} className="rounded-lg object-cover shadow-lg shadow-indigo-500/20 flex-shrink-0" />
        {isExpanded && (
          <span className="font-bold text-xl tracking-tight text-white whitespace-nowrap">
            AskMyPDF AI
          </span>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                {isExpanded && (
                  <span className="font-medium text-sm truncate">
                    {item.name}
                  </span>
                )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 flex-shrink-0">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full group overflow-hidden"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
            {isExpanded && (
              <span className="font-medium text-sm whitespace-nowrap">
                Logout
              </span>
            )}
        </button>
      </div>

      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-indigo-600 rounded-full hidden md:flex items-center justify-center text-white border border-[#0B0A10] shadow-lg hover:bg-indigo-500 transition-colors z-40"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </aside>
  );
}
