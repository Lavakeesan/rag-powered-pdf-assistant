import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Technology from '@/components/landing/Technology';
import Benefits from '@/components/landing/Benefits';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'SmartDoc RAG Assistant – AI‑Powered PDF Chat',
  description: 'Chat with your PDFs using Retrieval‑Augmented Generation. Fast, secure, multi‑document AI assistant.'
};

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-surface text-darkText font-sans">
      <Hero />
      <Features />
      <HowItWorks />
      <Technology />
      <Benefits />
      <CTA />
      <Footer />
    </main>
  );
}
