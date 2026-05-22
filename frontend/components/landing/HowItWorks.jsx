import { Upload, Cpu, MessageSquare, Zap } from 'lucide-react';

const steps = [
  { icon: Upload, title: 'Upload PDF', description: 'Select your PDF and upload securely to our cloud.' },
  { icon: Cpu, title: 'Process with AI', description: 'We chunk, embed and index your document using Gemini Flash.' },
  { icon: MessageSquare, title: 'Ask Questions', description: 'Enter natural language queries in the chat interface.' },
  { icon: Zap, title: 'Get Answers', description: 'Receive fast, context‑aware responses powered by RAG.' }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl font-bold text-center text-darkText mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="glass-card p-6 rounded-2xl text-center">
              <step.icon className="w-8 h-8 mx-auto text-primary mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
