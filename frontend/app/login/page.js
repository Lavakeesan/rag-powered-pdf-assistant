'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Mail, Lock, Sparkles, Loader2 } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
        setError(resData.detail || 'Google login failed. Please try again.');
        return;
      }

      // Store user and token in cookies
      document.cookie = `user=${encodeURIComponent(JSON.stringify(resData.user))}; path=/; max-age=86400`;
      document.cookie = `token=${resData.token}; path=/; max-age=86400`;
      
      // Login successful - redirect to chat interface
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
      const btn = document.getElementById("google-login-btn");
      if (btn) {
        window.google.accounts.id.renderButton(
          btn,
          { 
            theme: "outline", 
            size: "large", 
            text: "signin_with", 
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
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        setError(resData.detail || 'Invalid email or password. Please try again.');
        return;
      }

      // Store user and token in cookies
      document.cookie = `user=${encodeURIComponent(JSON.stringify(resData.user))}; path=/; max-age=86400`;
      document.cookie = `token=${resData.token}; path=/; max-age=86400`;
      
      // Login successful - redirect to chat interface
      router.push('/chat');
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
            <h1 className="text-5xl font-bold mb-4 tracking-tight">Welcome<br />Back</h1>
            <p className="text-slate-400 font-medium">Sign in to the frontier of ethereal intelligence.</p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-cyan-400 text-sm font-medium text-center">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 block ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full bg-slate-950/40 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-slate-300 block">Password</label>
                <Link href="#" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</Link>
              </div>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-5 rounded-2xl text-xl font-bold text-white shadow-xl hover:shadow-indigo-500/20 transition-all transform hover:-translate-y-1 mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
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
            <div id="google-login-btn"></div>
          </div>

          <p className="text-center mt-10 text-slate-400">
            Don't have an account? <Link href="/register" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">Sign up</Link>
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0B0A10]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
