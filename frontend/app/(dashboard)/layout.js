'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
// Removed MobileNav and framer-motion imports as they are no longer needed



export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.removeItem('chat_session_id');
    router.push('/');
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0A10] text-slate-200 overflow-hidden font-inter relative">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        isMobileOpen={isMobileMenuOpen}
        closeMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B0A10] relative w-full overflow-hidden">
        <DashboardHeader onMobileMenuOpen={() => setIsMobileMenuOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 lg:p-8 max-w-screen-lg mx-auto w-full pb-20 md:pb-6 lg:pb-8">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
