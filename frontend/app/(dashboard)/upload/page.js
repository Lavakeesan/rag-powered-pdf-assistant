'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect immediately to the merged workspace
    router.replace('/chat');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 animate-pulse">
        <Sparkles className="w-8 h-8 text-indigo-400" />
      </div>
      <h2 className="text-xl font-bold text-white tracking-tight">Redirecting to Workspace...</h2>
      <p className="text-sm text-slate-500">We have merged the Upload PDF and Ask AI sections for a seamless experience.</p>
      <Loader2 className="w-5 h-5 text-indigo-500 animate-spin mt-2" />
    </div>
  );
}
