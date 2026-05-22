import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950/50 border-t border-slate-900 pt-20 pb-10 px-6 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">AskMyPDF AI</span>
            </Link>
            <p className="text-slate-400 max-w-sm mb-6">
              Transforming how researchers and students interact with complex documents using state-of-the-art AI.
            </p>
            <div className="flex gap-4">
              {/* Social icons placeholder */}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Features</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Enterprise</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Documentation</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            © 2024 ASKMYPDF AI. ETHEREAL INTELLIGENCE FOR MODERN RESEARCHERS.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-slate-500 hover:text-slate-300 text-sm">PRIVACY</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-300 text-sm">TERMS</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-300 text-sm">API</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-300 text-sm">SUPPORT</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
