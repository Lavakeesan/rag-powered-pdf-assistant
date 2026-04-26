'use client';

import { User, Mail, Shield, Bell, Lock, Camera, Check } from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-top-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Profile Settings</h1>
        <p className="text-slate-400">Manage your account information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-card p-8 rounded-[40px] border border-white/5 text-center flex flex-col items-center h-fit">
          <div className="relative group mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-2xl">AR</div>
            <button className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg border border-[#13111A]"><Camera className="w-4 h-4" /></button>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Alex Rivera</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Student Plan</p>
        </div>

        <div className="lg:col-span-2 glass-card p-8 md:p-10 rounded-[40px] border border-white/5 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 block ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input type="text" defaultValue="Alex Rivera" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 block ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input type="email" defaultValue="alex.rivera@university.edu" className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none opacity-70 cursor-not-allowed" disabled />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5">
            <button className="px-8 py-3 bg-white/5 text-slate-300 hover:text-white rounded-2xl text-sm font-bold transition-all">Cancel</button>
            <button 
              onClick={() => { setIsSaving(true); setTimeout(() => setIsSaving(false), 1500); }}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold transition-all shadow-lg flex items-center gap-2 min-w-[140px] justify-center"
            >
              {isSaving ? 'Saving...' : <>Save Changes <Check className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
