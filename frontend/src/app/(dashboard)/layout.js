'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileUp, 
  Files, 
  MessageSquare, 
  History, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard Home', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Upload PDF', icon: FileUp, href: '/upload' },
  { name: 'My Documents', icon: Files, href: '/documents' },
  { name: 'Ask AI', icon: MessageSquare, href: '/chat' },
  { name: 'Chat History', icon: History, href: '/history' },
  { name: 'Profile Settings', icon: Settings, href: '/profile' },
];

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-[#0B0A10] text-slate-200 flex overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } hidden md:flex flex-col bg-[#13111A] border-r border-white/5 transition-all duration-300 relative z-30`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-white">Lumina AI</span>}
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
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
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:text-white'}`} />
                {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full group">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>

        {/* Sidebar Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white border border-[#0B0A10] shadow-lg hover:bg-indigo-500 transition-colors"
        >
          {isSidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-[#13111A] border-r border-white/5 z-50 transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Lumina AI</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <nav className="px-4 space-y-1 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all w-full">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-[#13111A]/50 backdrop-blur-md border-b border-white/5 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-slate-400"
              onClick={() => setIsMobileMenuOpen(true)}
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
                <p className="text-sm font-semibold text-white leading-none mb-1 group-hover:text-indigo-400 transition-colors">Alex Rivera</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Student</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                AR
              </div>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0B0A10] custom-scrollbar">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
