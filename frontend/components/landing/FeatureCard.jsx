import { FileUp, MessageSquare, Search, ShieldCheck, Rocket, Layers } from 'lucide-react';

export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/5 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <Icon className="w-6 h-6 text-primary mr-3" />
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}
