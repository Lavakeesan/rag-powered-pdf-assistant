'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileUp, 
  Files, 
  MessageSquare, 
  History, 
  Settings, 
  LogOut, 
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Upload PDF', icon: FileUp, href: '/upload' },
  { name: 'My Documents', icon: Files, href: '/documents' },
  { name: 'Ask AI', icon: MessageSquare, href: '/chat' },
  { name: 'History', icon: History, href: '/history' },
  { name: 'Settings', icon: Settings, href: '/profile' },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would clear cookies/tokens here
    router.push('/');
  };

  return (
    <aside 
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } hidden md:flex flex-col bg-[#13111A] border-r border-white/5 transition-all duration-300 flex-shrink-0 relative z-30`}
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {isOpen && <span className="font-bold text-xl tracking-tight text-white animate-in fade-in duration-300">Lumina AI</span>}
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
              {isOpen && <span className="font-medium text-sm truncate animate-in fade-in duration-300">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 flex-shrink-0">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full group"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="font-medium text-sm animate-in fade-in duration-300">Logout</span>}
        </button>
      </div>

      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white border border-[#0B0A10] shadow-lg hover:bg-indigo-500 transition-colors z-40"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </aside>
  );
}
