'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Mail, Lock, User, GraduationCap, Sparkles, ChevronDown, History, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleResponse = async (response) => {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8000/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        setError(resData.detail || 'Google registration failed. Please try again.');
        return;
      }

      // Store user and token in cookies
      document.cookie = `user=${encodeURIComponent(JSON.stringify(resData.user))}; path=/; max-age=86400`;
      document.cookie = `token=${resData.token}; path=/; max-age=86400`;
      
      // Registration and Login successful - redirect to chat interface
      router.push('/chat');
    } catch (err) {
      setError('Could not connect to the server. Please check your network or ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const initGoogle = () => {
    if (typeof window !== 'undefined' && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      const btn = document.getElementById("google-signup-btn");
      if (btn) {
        window.google.accounts.id.renderButton(
          btn,
          { 
            theme: "outline", 
            size: "large", 
            text: "signup_with", 
            width: "380", 
            shape: "rectangular",
            logo_alignment: "left"
          }
        );
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      initGoogle();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        setError(resData.detail || 'Registration failed. Please try again.');
        return;
      }

      router.push('/login?message=Registration successful! Please login.');
    } catch (err) {
      setError('Could not connect to the server. Please check your network or ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <Script 
        src="https://accounts.google.com/gsi/client?hl=en" 
        strategy="afterInteractive"
        onLoad={initGoogle}
      />
      {/* Background Gradients */}
      <div className="absolute -top-20 -right-20 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-[140px] -z-10" />
      <div className="absolute -bottom-20 -left-20 w-1/2 h-1/2 bg-indigo-600/10 rounded-full blur-[140px] -z-10" />

      <div className="w-full max-w-lg">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-cyan-400" />
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">Lumina AI</span>
          </Link>
        </div>

        <div className="glass-card rounded-[40px] p-8 md:p-12 border border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Create Your<br />Account</h1>
            <p className="text-slate-400 font-medium">Join the frontier of ethereal intelligence.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 block ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 block ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 block ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 block ml-1">Confirm Password</label>
                <div className="relative">
                  <History className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 block ml-1">I am a...</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-10 py-4 text-sm focus:outline-none focus:border-indigo-500 appearance-none transition-colors text-white"
                >
                  <option value="Student" className="bg-slate-950">Student</option>
                  <option value="Admin" className="bg-slate-950">Admin</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-5 rounded-2xl text-xl font-bold text-white shadow-xl hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1 mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background/80 px-4 text-slate-500 font-bold tracking-widest">or continue with</span>
            </div>
          </div>

          <div className="w-full flex justify-center py-1">
            <div id="google-signup-btn"></div>
          </div>

          <p className="text-center mt-10 text-slate-400">
            Already have an account? <Link href="/login" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Login</Link>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          {['AI Insights', 'Secure Data', 'Fast Analysis'].map((item) => (
            <div key={item} className="glass-card py-4 rounded-2xl border border-white/5 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-8">
          <p className="text-[10px] text-slate-700 text-center uppercase tracking-[0.2em] leading-relaxed max-w-xs">
            © 2024 LUMINA AI. ETHEREAL INTELLIGENCE FOR MODERN RESEARCHERS.
          </p>
          <div className="flex gap-8">
            {['PRIVACY', 'TERMS', 'API', 'SUPPORT'].map((link) => (
              <Link key={link} href="#" className="text-[10px] text-slate-700 hover:text-slate-500 transition-colors tracking-widest">{link}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
