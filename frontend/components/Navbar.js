'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-background">
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3 rounded-2xl">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">AskMyPDF AI</span>
        </Link>
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</Link>
          <Link href="#about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</Link>
          <Link href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</Link>
        </div>
        {/* Mobile Menu Button */}
        <button className="md:hidden text-slate-300 hover:text-white" onClick={toggle} aria-label="Toggle navigation">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        {/* Mobile Links */}
        {open && (
          <div className="absolute top-full left-0 w-full bg-background glass-card rounded-b-2xl md:hidden">
            <div className="flex flex-col items-center py-4 space-y-4">
              <Link href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" onClick={toggle}>Features</Link>
              <Link href="#about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" onClick={toggle}>About</Link>
              <Link href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" onClick={toggle}>Pricing</Link>
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors" onClick={toggle}>Log in</Link>
              <Link href="/register" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white" onClick={toggle}>Get Started</Link>
            </div>
          </div>
        )}
        {/* Auth Links for desktop */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log in</Link>
          <Link href="/register" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white">Get Started</Link>
        </div>
      </div>
    </nav>
  );
}
