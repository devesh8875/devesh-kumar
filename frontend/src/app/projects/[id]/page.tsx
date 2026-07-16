import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowUpRight, Star } from 'lucide-react';
import { notFound } from 'next/navigation';

interface ProjectDetailsData {
  heroImage: string;
  category: string;
  challengeText: string;
  solutionText: string;
  solutionPoints: string[];
  solutionImages: string[];
  impactText: string;
  testimonialAvatar: string;
  testimonialName: string;
  testimonialRole: string;
  testimonialRating: string;
  testimonialText: string;
}

interface ProjectPageProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  client: string;
  duration: string;
  country: string;
  image: string;
  viewDetailsLink: string;
  details?: ProjectDetailsData;
}

interface ProjectPageData {
  headerTitle: string;
  breadcrumb: string;
  mainHeading: string;
  projects: ProjectPageProject[];
}

async function getPortfolioData(): Promise<{ projectPage?: ProjectPageData }> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://devesh-portfolio-backend.vercel.app';
    const res = await fetch(`${backendUrl}/backend/admin/api/portfolio`, {
      cache: 'no-store'
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error('Error fetching project page data:', error);
  }
  return {};
}

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const data = await getPortfolioData();
  const projectPage = data.projectPage;

  if (!projectPage || !projectPage.projects) {
    return notFound();
  }

  const project = projectPage.projects.find(p => p.id === params.id);
  
  if (!project || !project.details) {
    return notFound();
  }

  const details = project.details;

  // Find two other random projects for the footer
  const otherProjects = projectPage.projects.filter(p => p.id !== project.id).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 font-sans selection:bg-[#ff2e2e]/30 pt-16">
      <Navbar />

      {/* Header Section */}
      <section className="py-16 relative border-b border-white/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Project Details</h1>
          <p className="text-sm font-semibold tracking-wider flex items-center gap-2 justify-center">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <Link href="/projects" className="text-gray-400 hover:text-white transition-colors">Projects</Link>
            <span className="text-gray-600">/</span>
            <span className="text-[#ff4a1c]">Project Details</span>
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          
          {/* Hero Image */}
          {details.heroImage && (
            <div className="rounded-3xl overflow-hidden border border-white/10 aspect-video relative group">
              <img src={details.heroImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          )}

          {/* Title and Info Box */}
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-2/3">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {project.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff512f] to-[#dd2476] italic font-serif">Solution</span>
              </h2>
              <p className="text-gray-400 leading-relaxed text-lg">
                {project.description}
              </p>
            </div>
            
            <div className="lg:w-1/3 bg-[#ff4a1c] p-8 rounded-3xl text-white space-y-6 shadow-[0_0_40px_rgba(255,74,28,0.2)]">
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider mb-1">Project Category :</p>
                <p className="font-bold text-lg">{details.category || project.subtitle.replace('- ', '')}</p>
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider mb-1">Client :</p>
                <p className="font-bold text-lg">{project.client}</p>
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider mb-1">Duration :</p>
                <p className="font-bold text-lg">{project.duration}</p>
              </div>
              <div>
                <p className="text-sm font-medium opacity-80 uppercase tracking-wider mb-1">Country :</p>
                <p className="font-bold text-lg">{project.country}</p>
              </div>
            </div>
          </div>

          {/* The Challenge */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">The Challenge</h3>
            <p className="text-gray-400 leading-relaxed">
              {details.challengeText}
            </p>
          </div>

          {/* The Solution */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">The Solution</h3>
              <p className="text-gray-400 leading-relaxed">
                {details.solutionText}
              </p>
            </div>

            {/* Checkpoints */}
            {details.solutionPoints && details.solutionPoints.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.solutionPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-300">
                    <div className="w-5 h-5 rounded-full bg-[#ff4a1c]/20 flex items-center justify-center flex-shrink-0 text-[#ff4a1c]">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Images layout */}
            {details.solutionImages && details.solutionImages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {details.solutionImages.map((img, idx) => (
                  img ? (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-white/10 aspect-video group relative">
                      <img src={img} alt="Solution preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  ) : null
                ))}
              </div>
            )}
          </div>

          {/* The Impact */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">The Impact</h3>
            <p className="text-gray-400 leading-relaxed">
              {details.impactText}
            </p>
          </div>

          {/* Testimonial */}
          {details.testimonialName && (
            <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff4a1c] to-transparent opacity-50"></div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 flex-shrink-0">
                  <img src={details.testimonialAvatar || 'https://via.placeholder.com/150'} alt={details.testimonialName} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{details.testimonialName}</h4>
                  <p className="text-gray-400 text-sm">{details.testimonialRole}</p>
                  
                  {details.testimonialRating && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex text-[#ff4a1c]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="currentColor" />
                        ))}
                      </div>
                      <span className="text-sm font-bold">{details.testimonialRating}</span>
                    </div>
                  )}
                </div>
                
                <div className="ml-auto hidden md:block">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-white/5">
                    <path d="M10 11L8 17H5L7 11H5V7H10V11ZM19 11L17 17H14L16 11H14V7H19V11Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed text-lg italic">
                "{details.testimonialText}"
              </p>
            </div>
          )}

        </div>
      </section>

      {/* View Other Projects Section */}
      {otherProjects.length > 0 && (
        <section className="py-20 bg-black/50 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16 flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 justify-center">
                <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-[#ff4a1c]"></div>
                <span className="text-[#ff4a1c] font-semibold tracking-wider text-sm">View Projects</span>
                <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-[#ff4a1c]"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold">
                View <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff512f] to-[#dd2476] italic font-serif">Other Projects</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherProjects.map(proj => (
                <div key={proj.id} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-colors duration-500 group">
                  <div className="p-6 md:p-8 border-b border-white/5">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                  </div>
                  <div className="p-8 md:p-10">
                    <h3 className="text-2xl font-bold mb-2">
                      {proj.title} <span className="text-[#ff4a1c] font-normal">{proj.subtitle}</span>
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-6 line-clamp-2">
                      {proj.description}
                    </p>
                    <Link href={\`/projects/\${proj.id}\`} className="inline-flex items-center gap-2 text-[#ff4a1c] font-bold text-sm hover:gap-4 transition-all">
                      View Details <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
