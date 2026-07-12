import Link from 'next/link';
import ThreeBackground from '@/components/ThreeBackground';
import TiltCard from '@/components/TiltCard';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink, 
  ArrowRight, 
  Award, 
  GraduationCap, 
  Palette, 
  MousePointerClick,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const dynamic = 'force-dynamic';

interface PortfolioData {
  homePage?: {
    hero: {
      greeting: string;
      firstName: string;
      role: string;
      description: string;
      location: string;
      education: string;
      work: string;
      button1Text: string;
      button1Url: string;
      button2Text: string;
      button2Url: string;
      linkedin: string;
      behance: string;
      figma: string;
      email: string;
      portraitUrl: string;
    };
  };
  profile: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    objective: string;
    linkedin: string;
    behance: string;
    figma: string;
    github: string;
    cvLink: string;
  };
  education: {
    degree: string;
    school: string;
    location: string;
    cgpa: string;
    graduation: string;
  };
  skills: {
    designSkills: string[];
    otherSkills: string[];
    tools: string[];
  };
  experience: Array<{
    id: number;
    role: string;
    company: string;
    location: string;
    duration: string;
    details: string[];
  }>;
  projects: Array<{
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
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    link: string;
  }>;
  achievements: string[];
  extracurriculars: string[];
}

async function getPortfolioData(): Promise<PortfolioData> {
  try {
    const res = await fetch('http://localhost:5000/backend/admin/api/portfolio', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching portfolio data from backend:', error);
    return {
      homePage: {
        hero: {
          greeting: "HI, I'M",
          firstName: "DEVESH",
          role: "UI/UX DESIGNER",
          description: "Crafting digital experiences that bridge the gap between user needs and business goals.",
          location: "GREATER NOIDA, UP",
          education: "GALGOTIAS UNIVERSITY",
          work: "CSG TECHNOSOL PVT. LTD.",
          button1Text: "PROJECTS",
          button1Url: "#projects",
          button2Text: "CONNECT WITH ME",
          button2Url: "#contact",
          linkedin: "https://www.linkedin.com/in/devesh-kumar-8114k/",
          behance: "https://www.behance.net/",
          figma: "https://www.figma.com/",
          email: "designerdevesh8875@gmail.com",
          portraitUrl: "/devesh-portrait.png"
        }
      },
      profile: { name: 'Devesh Kumar', title: 'UI/UX & Graphic Designer', email: 'designerdevesh8875@gmail.com', phone: '+91 8875697412', location: '', objective: '', linkedin: '', behance: '', figma: '', github: '', cvLink: '' },
      education: { degree: 'B.tech in Computer Science and Engineering', school: 'Galgotias University', location: 'Greater Noida, Uttar Pradesh', cgpa: '6.46', graduation: 'Expected Graduation July 2025' },
      skills: { designSkills: [], otherSkills: [], tools: [] },
      experience: [],
      projects: [],
      certifications: [],
      achievements: [],
      extracurriculars: []
    };
  }
}

export default async function Home() {
  const data = await getPortfolioData();
  const { profile, education, skills, experience, projects, certifications, achievements, homePage } = data;

  // Extract hero data or fallback to defaults
  const heroData = homePage?.hero || {
    greeting: "HI, I'M",
    firstName: profile.name.replace(/=$/, '').trim().split(' ')[0] || 'DEVESH',
    role: profile.title || 'UI/UX DESIGNER',
    description: profile.objective || '',
    location: "GREATER NOIDA, UP",
    education: "GALGOTIAS UNIVERSITY",
    work: "CSG TECHNOSOL PVT. LTD.",
    button1Text: "PROJECTS",
    button1Url: "#projects",
    button2Text: "CONNECT WITH ME",
    button2Url: "#contact",
    linkedin: profile.linkedin,
    behance: profile.behance,
    figma: profile.figma,
    email: profile.email,
    portraitUrl: "/devesh-portrait.png"
  };

  return (
    <div className="relative min-h-screen">
      {/* 3D background behind content */}
      <ThreeBackground />

      {/* Navigation Bar */}
      <Navbar />

      {/* HERO SECTION */}
      <Hero heroData={heroData} profile={profile} />

      {/* ABOUT, EDUCATION & SKILLS SECTION */}
      <section id="about" className="py-24 px-6 relative border-t border-white/5 bg-[#030303]/60 backdrop-blur-md">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Left Column: Bio & Education */}
          <div className="md:col-span-6 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white font-display">About Me</h2>
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
            </div>
            
            {/* Education Glass Box */}
            <div className="glass-card p-6 rounded-2xl border-white/5 space-y-4 glow-card-cyan">
              <div className="flex items-center gap-3 text-cyan-400">
                <GraduationCap size={24} />
                <h3 className="text-xl font-bold text-white font-display">Education</h3>
              </div>
              <div>
                <h4 className="font-semibold text-gray-200">{education.degree}</h4>
                <p className="text-sm text-gray-400">{education.school}</p>
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                  <span>{education.location}</span>
                  <span>CGPA: {education.cgpa}</span>
                </div>
                <div className="text-xs text-cyan-400 mt-1 font-semibold">{education.graduation}</div>
              </div>
            </div>

            {/* Achievements Snippet */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                <Award size={18} className="text-purple-400" /> Key Highlights
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                {achievements.slice(0, 2).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight size={14} className="text-cyan-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column: Skills */}
          <div className="md:col-span-6 space-y-6">
            <h3 className="text-2xl font-bold text-white font-display">Design & Technical Arsenal</h3>
            
            {/* Design Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Core Design Expertise</h4>
              <div className="flex flex-wrap gap-2">
                {skills.designSkills.map((skill, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-gray-300 text-sm transition-all">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400">Tools & Applications</h4>
              <div className="flex flex-wrap gap-2">
                {skills.tools.map((tool, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 text-gray-300 text-sm transition-all font-mono">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Professional Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {skills.otherSkills.map((skill, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* EXPERIENCE TIMELINE SECTION */}
      <section id="experience" className="py-24 px-6 relative bg-gradient-to-b from-[#030303] to-[#010101]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-white font-display">Work Journey</h2>
            <p className="text-gray-400 max-w-md mx-auto">Professional background and internships inside design studios, organizations and freelancing.</p>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full mx-auto"></div>
          </div>

          <div className="relative">
            {/* Timeline backbone line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 timeline-line transform -translate-x-1/2"></div>

            <div className="space-y-12">
              {experience.map((exp, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div key={exp.id} className="relative flex flex-col md:flex-row items-start md:items-center">
                    
                    {/* Timeline Node Point */}
                    <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-2 border-cyan-400 bg-black transform -translate-x-1/2 z-10 shadow-sm shadow-cyan-400"></div>

                    {/* Timeline Content */}
                    <div className={`w-full md:w-1/2 pl-12 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'}`}>
                      <div className="glass-card p-6 rounded-2xl border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/[0.02] transition-all glow-card-cyan">
                        <span className="text-xs text-cyan-400 font-semibold tracking-wider uppercase">{exp.duration}</span>
                        <h3 className="text-xl font-bold text-white mt-1 font-display">{exp.role}</h3>
                        <p className="text-sm text-gray-400 font-medium">{exp.company} &bull; {exp.location}</p>
                        
                        <ul className={`mt-4 space-y-2 text-sm text-gray-400 ${isEven ? 'md:flex md:flex-col md:items-end' : ''}`}>
                          {exp.details.map((detail, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              {!isEven && <ChevronRight size={14} className="text-cyan-400 mt-1 flex-shrink-0" />}
                              <span>{detail}</span>
                              {isEven && <ChevronRight size={14} className="text-cyan-400 mt-1 flex-shrink-0 hidden md:block" />}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="py-24 px-6 relative border-t border-white/5 bg-[#030303]/40 backdrop-blur-md">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white font-display">Featured Projects</h2>
              <p className="text-gray-400">Interactive wireframe layouts, high-fidelity UI designs, and digital experiences.</p>
              <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <TiltCard key={project.id} className="group h-full bg-[#0d0d14]/40 border border-white/5">
                <Link href={`/project/${project.id}`} className="flex flex-col h-full">
                  {/* Project Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
                    <span className="absolute bottom-3 left-3 text-xs bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-semibold px-2.5 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>

                  {/* Project Details */}
                  <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors font-display line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Tech badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tech.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-500">
                            {t}
                          </span>
                        ))}
                        {project.tech.length > 3 && (
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-gray-500">
                            +{project.tech.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        View Study <ChevronRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS & CERTIFICATIONS */}
      <section className="py-24 px-6 relative bg-gradient-to-b from-[#010101] to-[#030303]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Achievements */}
          <div className="md:col-span-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white font-display">Achievements & Awards</h2>
              <div className="w-12 h-1 bg-purple-500 rounded-full"></div>
            </div>
            
            <div className="space-y-4">
              {achievements.map((ach, idx) => (
                <div key={idx} className="glass-card p-4 rounded-xl border-white/5 flex gap-4 items-start glow-card-purple">
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-400">
                    <Award size={20} />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">{ach}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="md:col-span-6 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white font-display">Certifications</h2>
              <div className="w-12 h-1 bg-cyan-500 rounded-full"></div>
            </div>

            <div className="space-y-4">
              {certifications.map((cert, idx) => (
                <a 
                  href={cert.link} 
                  key={idx} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-card p-4 rounded-xl border-white/5 flex items-center justify-between hover:border-cyan-500/30 transition-all group hover:bg-cyan-500/[0.02]"
                >
                  <div className="flex gap-4 items-start">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
                      <GraduationCap size={20} />
                    </div>
                    <div>
                      <h4 className="text-gray-200 text-sm font-semibold">{cert.name}</h4>
                      <p className="text-xs text-gray-500 font-mono mt-0.5">{cert.issuer}</p>
                    </div>
                  </div>
                  <ExternalLink size={16} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
          
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 px-6 relative border-t border-white/5 bg-[#030303]/60 backdrop-blur-md">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Contact details */}
            <div className="md:col-span-5 space-y-6">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white font-display">Let&apos;s Create Together</h2>
                <p className="text-gray-400">Reach out for collaborations, project inquiries, or just to chat about design theories.</p>
                <div className="w-12 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
              </div>

              <div className="space-y-4 pt-4">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors">
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 text-cyan-400">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Email</p>
                    <p className="text-sm font-semibold">{profile.email}</p>
                  </div>
                </a>

                <a href={`tel:${profile.phone}`} className="flex items-center gap-4 text-gray-300 hover:text-cyan-400 transition-colors">
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 text-cyan-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-semibold">{profile.phone}</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 text-gray-300">
                  <div className="p-3 rounded-full bg-white/5 border border-white/10 text-cyan-400">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">Location</p>
                    <p className="text-sm font-semibold">{profile.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Contact form */}
            <div className="md:col-span-7">
              <form className="glass-card p-8 rounded-2xl border-white/5 space-y-4 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase">Your Name</label>
                    <input type="text" id="name" placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" required />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase">Your Email</label>
                    <input type="email" id="email" placeholder="john@example.com" className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" required />
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="subject" className="text-xs font-semibold text-gray-400 uppercase">Subject</label>
                  <input type="text" id="subject" placeholder="Project Inquiry" className="w-full px-4 py-2.5 rounded-xl glass-input text-sm" required />
                </div>
                <div className="space-y-1">
                  <label htmlFor="message" className="text-xs font-semibold text-gray-400 uppercase">Message</label>
                  <textarea id="message" rows={4} placeholder="Hello Devesh, I would love to collaborate..." className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none" required></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all shadow-lg hover:shadow-cyan-500/10 cursor-not-allowed opacity-80"
                >
                  Send Message (Mock)
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
