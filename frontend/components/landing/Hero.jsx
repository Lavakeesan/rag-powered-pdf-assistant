import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-r from-primary via-accent to-secondary">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Chat with Your PDF Using AI
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
          Leverage Retrieval‑Augmented Generation to ask natural language questions directly to your documents. Get accurate, context‑aware answers in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/upload"
            className="inline-flex items-center justify-center px-6 py-3 bg-white/10 border border-white/30 text-white font-medium rounded-xl hover:bg-white/20 transition"
          >
            Upload PDF
          </Link>
        </div>
      </div>
      {/* Optional decorative illustration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {/* Placeholder gradient circles */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>
    </section>
  );
}
