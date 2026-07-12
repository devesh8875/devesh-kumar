import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeft, 
  ExternalLink, 
  Laptop, 
  Layers, 
  Cpu, 
  Palette, 
  Heart,
  ChevronRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  tech: string[];
  image: string;
  figmaLink?: string;
  behanceLink?: string;
  liveLink?: string;
  longDescription?: string;
  colors?: string[]; // Optional color palette hexes
}

async function getProject(id: string): Promise<Project | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://devesh-portfolio-backend-ibkyyhops.vercel.app';
    const res = await fetch(`${API_URL}/backend/admin/api/portfolio`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch portfolio: ${res.status}`);
    }
    const data = await res.json();
    const project = data.projects.find((p: Project) => p.id === id);
    return project || null;
  } catch (error) {
    console.error('Error fetching project from backend:', error);
    return null;
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  // Provide a default color palette for projects if not defined
  const colors = project.colors || ['#06b6d4', '#a855f7', '#1e293b', '#0f172a'];

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>

        {/* Hero Header */}
        <div className="space-y-4">
          <span className="text-xs bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {project.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
            {project.title}
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            {project.description}
          </p>
        </div>

        {/* Main Cover Image */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-card border-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={project.image} 
            alt={project.title}
            className="object-cover w-full h-full opacity-90"
          />
        </div>

        {/* Project Meta Info & Tech Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
          
          {/* Left Column: Details */}
          <div className="md:col-span-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
                <Layers size={20} className="text-cyan-400" /> Case Study & Concept
              </h2>
              <p className="text-gray-300 leading-relaxed text-base">
                {project.longDescription || project.description}
              </p>
            </div>

            {/* Design Spec: Color Palette (Designer's touch) */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Palette size={18} className="text-purple-400" /> Interface Color Scheme
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {colors.map((color, idx) => (
                  <div key={idx} className="space-y-2">
                    <div 
                      className="aspect-square w-full rounded-xl border border-white/10 shadow-md"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="text-[10px] text-center font-mono text-gray-500 uppercase font-semibold">{color}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Links */}
          <div className="md:col-span-4 space-y-6">
            
            {/* Tech Stack Box */}
            <div className="glass-card p-6 rounded-2xl border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Cpu size={16} className="text-cyan-400" /> Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((techItem, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs font-medium font-mono"
                  >
                    {techItem}
                  </span>
                ))}
              </div>
            </div>

            {/* Links Box */}
            <div className="glass-card p-6 rounded-2xl border-white/5 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider font-mono flex items-center gap-2">
                <Laptop size={16} className="text-purple-400" /> Assets & Deliverables
              </h3>
              <div className="flex flex-col gap-3">
                {project.figmaLink && (
                  <a 
                    href={project.figmaLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0f] border border-white/5 hover:border-cyan-500/30 text-sm font-medium hover:text-cyan-400 transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-500">
                        <path d="M19 0C13.75 0 9.5 4.25 9.5 9.5C9.5 14.75 13.75 19 19 19H28.5V9.5C28.5 4.25 24.25 0 19 0Z" fill="#F24E1E"/>
                        <path d="M9.5 28.5C9.5 23.25 13.75 19 19 19C24.25 19 28.5 23.25 28.5 28.5C28.5 33.75 24.25 38 19 38C13.75 38 9.5 33.75 9.5 28.5Z" fill="#A259FF"/>
                        <path d="M9.5 47.5C9.5 42.25 13.75 38 19 38V57C13.75 57 9.5 52.75 9.5 47.5Z" fill="#0ACF83"/>
                        <path d="M28.5 47.5C28.5 52.75 24.25 57 19 57C13.75 57 9.5 52.75 9.5 47.5C9.5 42.25 13.75 38 19 38H28.5V47.5Z" fill="#1ABCFE"/>
                        <path d="M28.5 19C28.5 13.75 24.25 9.5 19 9.5C19 14.75 23.25 19 28.5 19Z" fill="#FF7262"/>
                      </svg>
                      Figma Design File
                    </span>
                    <ChevronRight size={14} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
                  </a>
                )}
                {project.behanceLink && (
                  <a 
                    href={project.behanceLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0f] border border-white/5 hover:border-purple-500/30 text-sm font-medium hover:text-purple-400 transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink size={16} className="text-blue-500" /> Behance Showcase
                    </span>
                    <ChevronRight size={14} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                  </a>
                )}
                {project.liveLink && (
                  <a 
                    href={project.liveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0f] border border-white/5 hover:border-emerald-500/30 text-sm font-medium hover:text-emerald-400 transition-all group"
                  >
                    <span className="flex items-center gap-2">
                      <Laptop size={16} className="text-emerald-400" /> Live Web Demo
                    </span>
                    <ChevronRight size={14} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                  </a>
                )}
              </div>
            </div>

            {/* Quick interactive note */}
            <div className="text-xs text-gray-500 flex items-center justify-center gap-1.5 pt-2">
              Made with <Heart size={10} className="text-red-500 animate-pulse" /> by Devesh Kumar
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
