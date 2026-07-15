import React from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

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
}

interface ProjectPageData {
  headerTitle: string;
  breadcrumb: string;
  mainHeading: string;
  projects: ProjectPageProject[];
}

async function getProjectPageData(): Promise<ProjectPageData> {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://devesh-portfolio-backend.vercel.app';
    const res = await fetch(`${backendUrl}/backend/admin/api/portfolio`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data.projectPage) {
        return data.projectPage;
      }
    }
  } catch (error) {
    console.error('Error fetching project page data:', error);
  }
  
  // Fallback data
  return {
    headerTitle: 'Projects',
    breadcrumb: 'Home / Projects',
    mainHeading: 'Let\'s Have a Look at My Portfolio',
    projects: [
      {
        id: '1',
        title: 'Recipe App',
        subtitle: '- Food Recipe Mobile App Solution',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
        client: 'Ava Mitchell',
        duration: '4 Months',
        country: 'United States',
        image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop',
        viewDetailsLink: '#'
      }
    ]
  };
}

export default async function ProjectsPage() {
  const data = await getProjectPageData();

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 font-sans selection:bg-[#ff2e2e]/30 pt-16">
      <Navbar />

      {/* Header Section */}
      <section className="py-20 relative border-b border-white/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">{data.headerTitle}</h1>
          <p className="text-sm font-semibold tracking-wider flex items-center gap-2 justify-center">
            <span className="text-gray-400">{data.breadcrumb.split('/')[0]}</span>
            <span className="text-gray-600">/</span>
            <span className="text-[#ff4a1c]">{data.breadcrumb.split('/')[1] || data.headerTitle}</span>
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center mb-16 flex flex-col items-center gap-4">
            <div className="flex items-center gap-4 justify-center">
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-[#ff4a1c]"></div>
              <span className="text-[#ff4a1c] font-semibold tracking-wider text-sm">My Portfolio</span>
              <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-[#ff4a1c]"></div>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold">
              {data.mainHeading.split('Look at My Portfolio').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff512f] to-[#dd2476] italic font-serif">Look at My Portfolio</span>}
                </React.Fragment>
              ))}
            </h2>
          </div>

          <div className="space-y-12">
            {data.projects.map((project, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={project.id} className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden hover:border-white/10 transition-colors duration-500">
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-0`}>
                    
                    {/* Image Section */}
                    <div className="lg:w-1/2 p-6 md:p-8">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group border border-white/10">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        {project.title} <span className="text-[#ff4a1c] font-normal">{project.subtitle}</span>
                      </h3>
                      <p className="text-gray-400 leading-relaxed mb-8">
                        {project.description}
                      </p>

                      <div className="bg-[#0a0a0f] rounded-2xl border border-white/5 overflow-hidden mb-8">
                        <div className="flex justify-between p-4 border-b border-white/5">
                          <span className="text-gray-400 font-semibold text-sm">Client</span>
                          <span className="text-white text-sm">{project.client}</span>
                        </div>
                        <div className="flex justify-between p-4 border-b border-white/5">
                          <span className="text-gray-400 font-semibold text-sm">Duration</span>
                          <span className="text-white text-sm">{project.duration}</span>
                        </div>
                        <div className="flex justify-between p-4">
                          <span className="text-gray-400 font-semibold text-sm">Country</span>
                          <span className="text-white text-sm">{project.country}</span>
                        </div>
                      </div>

                      <div>
                        <Link 
                          href={project.viewDetailsLink}
                          className="inline-flex items-center gap-2 text-[#ff4a1c] font-bold text-sm hover:gap-4 transition-all"
                        >
                          View Details <ArrowUpRight size={16} />
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
