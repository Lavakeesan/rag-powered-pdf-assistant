import FeatureCard from './FeatureCard';
import { FileUp, Search, Layers, Rocket, ShieldCheck, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: FileUp,
    title: 'AI PDF Chat',
    description: 'Ask natural language questions directly to your PDFs and receive accurate answers.'
  },
  {
    icon: Search,
    title: 'Smart Document Search',
    description: 'Lightning‑fast semantic search across all uploaded documents.'
  },
  {
    icon: Layers,
    title: 'RAG‑Powered Answers',
    description: 'Combines retrieval‑augmented generation for context‑aware responses.'
  },
  {
    icon: ShieldCheck,
    title: 'Secure Cloud Storage',
    description: 'Your PDFs are stored encrypted in AWS S3 with fine‑grained access controls.'
  },
  {
    icon: Rocket,
    title: 'Fast Response System',
    description: 'Low‑latency inference powered by Gemini Flash and Pinecone vector DB.'
  },
  {
    icon: MessageSquare,
    title: 'Multi‑Document Support',
    description: 'Chat across dozens of PDFs simultaneously, no limits.'
  }
];

export default function Features() {
  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-6 lg:px-12">
        <h2 className="text-3xl font-bold text-center text-darkText mb-12">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <FeatureCard
              key={idx}
              icon={feat.icon}
              title={feat.title}
              description={feat.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
