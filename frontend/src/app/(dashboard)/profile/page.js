'use client';

import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  Lock, 
  LogOut, 
  Camera, 
  Check, 
  ChevronRight,
  Globe,
  Database
} from 'lucide-react';
import { useState } from 'react';

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-top-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Profile Settings</h1>
        <p className="text-slate-400">Manage your account information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-8 rounded-[40px] border border-white/5 text-center flex flex-col items-center">
            <div className="relative group mb-6">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-indigo-500/20">
                AR
              </div>
              <button className="absolute -bottom-2 -right-2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg border border-[#13111A] hover:bg-indigo-500 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Alex Rivera</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Student Plan</p>
            
            <div className="w-full space-y-2 pt-6 border-t border-white/5 text-left">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Status</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Joined</span>
                <span className="text-xs text-white font-bold">Oct 2024</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-4 rounded-3xl border border-white/5 space-y-1">
            {[
              { label: 'General', icon: User, active: true },
              { label: 'Security', icon: Shield },
              { label: 'Notifications', icon: Bell },
              { label: 'Data & Privacy', icon: Database },
            ].map((item, i) => (
              <button 
                key={i} 
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                  item.active ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-bold">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 md:p-10 rounded-[40px] border border-white/5 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 block ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input 
                    type="text" 
                    defaultValue="Alex Rivera"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-400 block ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input 
                    type="email" 
                    defaultValue="alex.rivera@university.edu"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all opacity-70 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                Change Password
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 block ml-1">New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400 block ml-1">Confirm New Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                Preferences
              </h3>
              <div className="flex items-center justify-between p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                <div>
                  <p className="text-sm font-bold text-white">Dark Mode</p>
                  <p className="text-xs text-slate-500">Automatically adjust the theme based on your system.</p>
                </div>
                <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer shadow-inner">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6">
              <button className="px-8 py-3 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 rounded-2xl text-sm font-bold transition-all">
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 min-w-[140px] justify-center"
              >
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>Save Changes <Check className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[40px] border border-red-500/10 bg-red-500/[0.02] flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-red-400">Danger Zone</h3>
              <p className="text-sm text-slate-600">Permanently delete your account and all document data.</p>
            </div>
            <button className="px-6 py-3 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl text-sm font-bold transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
