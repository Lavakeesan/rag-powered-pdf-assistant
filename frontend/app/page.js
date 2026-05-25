"use client";
import {
  ArrowRight,
  Play,
  FileUp,
  MessageSquare,
  Zap,
  ShieldCheck,
  Cpu,
  History,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import Navbar from "../components/Navbar";


export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Now Powered by GPT-4o & RAG</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            AI-Powered PDF<br />
            <span className="gradient-text-pink-blue">Learning</span>{' '}
            <span className="gradient-text-blue-cyan">Assistant</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Upload PDFs, ask questions, and get instant AI explanations using RAG technology.
            Transform dense documents into clear, conversational insights in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-white w-full sm:w-auto"
            >
              Get started free <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="flex items-center gap-2 px-8 py-4 rounded-2xl text-lg font-bold text-white border border-slate-800 hover:bg-slate-900 transition-colors w-full sm:w-auto">
              Try Demo <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center"><Play className="w-3 h-3 text-cyan-400 fill-cyan-400" /></div>
            </button>
          </div>

          <div className="flex flex-col items-center gap-4 mb-20">
            <div className="flex -space-x-3">
              {[
                { name: 'A', bg: 'bg-indigo-600' },
                { name: 'S', bg: 'bg-purple-600' },
                { name: 'R', bg: 'bg-cyan-600' },
                { name: 'M', bg: 'bg-pink-600' },
              ].map((user, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full border-2 border-background ${user.bg} flex items-center justify-center text-white text-sm font-bold`}
                >
                  {user.name}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400">
              Trusted by <span className="text-white font-semibold">10,000+ researchers</span> worldwide
            </p>
          </div>

          {/* Chat Mockup */}
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] -z-10 group-hover:bg-indigo-500/20 transition-colors" />
            <div className="glass-card rounded-3xl overflow-hidden p-6 text-left border border-white/10 shadow-2xl">
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">Research_Paper_v2.pdf</h3>
                    <p className="text-[10px] text-slate-500">By AI • Uploaded 2 mins ago</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex justify-end">
                  <div className="bg-indigo-600/10 border border-indigo-500/20 px-4 py-3 rounded-2xl rounded-tr-none max-w-md">
                    <p className="text-sm text-slate-300 font-medium">Can you explain the statistical requirements?</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex-shrink-0 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-900/50 border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none max-w-md">
                    <p className="text-[10px] uppercase font-bold text-indigo-400 mb-2">ASKMYPDF AI</p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      According to page 14, the research paper mentions that for the test, characteristics of both naturally-defined names and performative...
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about this document..."
                  className="w-full bg-slate-950/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intelligent document understanding section */}
      <section className="py-20 px-6 bg-slate-950/30">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Intelligent document<br />understanding</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Built for speed and accuracy. AskMyPDF AI uses retrieval-augmented generation (RAG) to ensure every answer is grounded in your source material.
          </p>
        </div>

        <div id="features" className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature Card 1 */}
          <div className="glass-card p-10 rounded-[40px] border border-white/5 flex flex-col items-start text-left group">
            <div className="w-16 h-16 rounded-[24px] bg-purple-600/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <FileUp className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Smart PDF Upload</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Drag and drop any research paper, legal contract, or textbook. Our AI engine processes even the most complex layouts instantly.
            </p>
            <div className="flex gap-4 w-full">
              {/* removed feature cards */}
            </div>
          </div>

          {/* Feature Card 2 */}
          <div className="glass-card p-10 rounded-[40px] border border-white/5 flex flex-col items-start text-left group">
            <div className="w-16 h-16 rounded-[24px] bg-cyan-600/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">AI Q&A</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Ask questions in plain English. AskMyPDF AI understands context, nuances, and technical jargon across all languages.
            </p>
          </div>

          {/* Feature Card 3 */}
          <div className="glass-card p-10 rounded-[40px] border border-white/5 flex flex-col items-start text-left group">
            <div className="w-16 h-16 rounded-[24px] bg-indigo-600/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Cpu className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Contextual RAG</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              No hallucinations. Every answer is retrieved directly from your document's unique content using vector search.
            </p>
          </div>

          {/* Feature Card 4 */}
          <div className="glass-card p-10 rounded-[40px] border border-white/5 flex flex-col items-start text-left group">
            <div className="w-16 h-16 rounded-[24px] bg-blue-600/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Fast & Smart Assistant</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Experience sub-second response times. Our hyper-modern infrastructure is built for high performance knowledge work.
            </p>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden mb-2">
              <div className="h-full w-2/3 bg-gradient-to-r from-indigo-500 to-purple-500" />
            </div>
          </div>
        </div>
      </section>

{/* About Section */}
<section id="about" className="py-20 bg-surface">
  <div className="container mx-auto px-6 lg:px-12 text-center">
    <h2 className="text-3xl font-bold text-darkText mb-6">About SmartDoc RAG Assistant</h2>
    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">Our AI‑powered platform lets you upload PDFs and instantly ask questions. Built with Retrieval‑Augmented Generation (RAG) for accurate, source‑grounded answers.</p>
    <Link href="/about" className="inline-block btn-primary px-6 py-3 rounded-xl text-white">Learn More</Link>
  </div>
</section>

{/* Pricing Section */}
<section id="pricing" className="py-20 bg-surface">
  <div className="container mx-auto px-6 lg:px-12 text-center">
    <h2 className="text-3xl font-bold text-darkText mb-6">Pricing</h2>
    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">Free tier includes unlimited PDF uploads and chat. Pro tier adds team collaboration and priority support.</p>
    <Link href="/pricing" className="inline-block btn-primary px-6 py-3 rounded-xl text-white">See Plans</Link>
  </div>
</section>



      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto glass-card p-16 rounded-[60px] border border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 blur-[80px]" />
          <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to study smarter?</h2>
          <p className="text-lg text-slate-400 mb-12 max-w-xl mx-auto">
            Join thousands of students and researchers who are using AskMyPDF AI to master complex subjects in half the time.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Link
              href="/register"
              className="btn-primary px-10 py-5 rounded-2xl text-xl font-bold text-white w-full sm:w-auto"
            >
              Create Free Account
            </Link>
            <button className="px-10 py-5 rounded-2xl text-lg font-bold text-white border border-slate-800 hover:bg-slate-900 transition-colors w-full sm:w-auto">
              Book a Demo
            </button>
          </div>
        </div>
      </section>


    </main>
  );
}
