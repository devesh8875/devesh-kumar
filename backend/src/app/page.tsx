'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Home,
  GraduationCap, 
  Wrench, 
  Briefcase, 
  FolderGit2, 
  Award, 
  Save, 
  Plus, 
  Trash2, 
  LogOut
} from 'lucide-react';
import '@/app/globals.css';

interface HomePage {
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
}

interface Profile {
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
}

interface Education {
  degree: string;
  school: string;
  location: string;
  cgpa: string;
  graduation: string;
}

interface Skills {
  designSkills: string[];
  otherSkills: string[];
  tools: string[];
}

interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  location: string;
  duration: string;
  details: string[];
}

interface ProjectItem {
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
}

interface PortfolioData {
  homePage: HomePage;
  profile: Profile;
  education: Education;
  skills: Skills;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: Array<{ name: string; issuer: string; link: string }>;
  achievements: string[];
  extracurriculars: string[];
}

type TabType = 'home' | 'profile' | 'education' | 'skills' | 'experience' | 'projects' | 'achievements';

export default function AdminDashboard() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        // First check authentication status securely (relative call under basePath)
        const checkRes = await fetch('/backend/admin/api/admin/check');
        if (!checkRes.ok) {
          throw new Error('Not authenticated');
        }

        // Then load portfolio data
        const res = await fetch('/backend/admin/api/portfolio');
        if (!res.ok) {
          throw new Error('Failed to load portfolio');
        }
        const portfolioData = await res.json();
        setData(portfolioData);
      } catch (err) {
        // Silent redirect to login page if unauthenticated
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handlePublish = async () => {
    if (!data) return;
    setSaving(true);
    setStatusMsg('Publishing updates...');

    try {
      const res = await fetch('/backend/admin/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatusMsg('Portfolio updated and published successfully!');
        setTimeout(() => setStatusMsg(''), 4000);
      } else {
        const result = await res.json();
        setStatusMsg(`Error: ${result.error || 'Failed to save updates'}`);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg('Error: Network connection failed.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/backend/admin/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    router.push('/login');
    router.refresh();
  };

  // State handlers for editing
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMsg('Uploading image...');
    setSaving(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/backend/admin/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const result = await res.json();
      if (result.url) {
        updateHomePageHero('portraitUrl', result.url);
        setStatusMsg('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setStatusMsg('Failed to upload image.');
    } finally {
      setSaving(false);
    }
  };

  const updateHomePageHero = (field: keyof HomePage['hero'], value: string) => {
    if (!data) return;
    setData({
      ...data,
      homePage: {
        ...data.homePage,
        hero: { ...data.homePage.hero, [field]: value }
      }
    });
  };

  const updateProfile = (field: keyof Profile, value: string) => {
    if (!data) return;
    setData({
      ...data,
      profile: { ...data.profile, [field]: value }
    });
  };

  const updateEducation = (field: keyof Education, value: string) => {
    if (!data) return;
    setData({
      ...data,
      education: { ...data.education, [field]: value }
    });
  };

  // Skill updates
  const addSkill = (type: keyof Skills, newSkill: string) => {
    if (!data || !newSkill.trim()) return;
    const currentList = data.skills[type];
    if (currentList.includes(newSkill.trim())) return;
    setData({
      ...data,
      skills: {
        ...data.skills,
        [type]: [...currentList, newSkill.trim()]
      }
    });
  };

  const removeSkill = (type: keyof Skills, index: number) => {
    if (!data) return;
    const currentList = [...data.skills[type]];
    currentList.splice(index, 1);
    setData({
      ...data,
      skills: {
        ...data.skills,
        [type]: currentList
      }
    });
  };

  // Experience updates
  const addExperience = () => {
    if (!data) return;
    const newExp: ExperienceItem = {
      id: Date.now(),
      role: 'New Role',
      company: 'New Company',
      location: 'City, Country',
      duration: 'Duration (e.g. June 2025 - Present)',
      details: ['Add accomplishment bullet point here']
    };
    setData({
      ...data,
      experience: [newExp, ...data.experience]
    });
  };

  const updateExperience = (index: number, field: keyof ExperienceItem, value: string | string[]) => {
    if (!data) return;
    const list = [...data.experience];
    list[index] = { ...list[index], [field]: value } as ExperienceItem;
    setData({ ...data, experience: list });
  };

  const deleteExperience = (index: number) => {
    if (!data) return;
    const list = [...data.experience];
    list.splice(index, 1);
    setData({ ...data, experience: list });
  };

  // Projects updates
  const addProject = () => {
    if (!data) return;
    const newProj: ProjectItem = {
      id: `project-${Date.now()}`,
      title: 'New Project Title',
      category: 'UI/UX Design',
      description: 'Brief overview for project cards.',
      tech: ['Figma', 'React'],
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800',
      longDescription: 'Detailed write-up of objectives, color scheme, designs.',
      figmaLink: '',
      behanceLink: '',
      liveLink: ''
    };
    setData({
      ...data,
      projects: [...data.projects, newProj]
    });
  };

  const updateProject = (index: number, field: keyof ProjectItem, value: string | string[]) => {
    if (!data) return;
    const list = [...data.projects];
    list[index] = { ...list[index], [field]: value } as ProjectItem;
    setData({ ...data, projects: list });
  };

  const deleteProject = (index: number) => {
    if (!data) return;
    const list = [...data.projects];
    list.splice(index, 1);
    setData({ ...data, projects: list });
  };

  // Achievements updates
  const addAchievement = (text: string) => {
    if (!data || !text.trim()) return;
    setData({
      ...data,
      achievements: [...data.achievements, text.trim()]
    });
  };

  const deleteAchievement = (index: number) => {
    if (!data) return;
    const list = [...data.achievements];
    list.splice(index, 1);
    setData({ ...data, achievements: list });
  };

  // Certifications updates
  const addCertification = () => {
    if (!data) return;
    const newCert = {
      name: 'New Certification',
      issuer: 'Issuer (e.g. Google)',
      link: ''
    };
    setData({
      ...data,
      certifications: [...data.certifications, newCert]
    });
  };

  const updateCertification = (index: number, field: 'name' | 'issuer' | 'link', value: string) => {
    if (!data) return;
    const list = [...data.certifications];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, certifications: list });
  };

  const deleteCertification = (index: number) => {
    if (!data) return;
    const list = [...data.certifications];
    list.splice(index, 1);
    setData({ ...data, certifications: list });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] text-gray-400 flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-t-cyan-400 border-white/10 animate-spin"></div>
          <span>Loading CMS State...</span>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#030303] text-gray-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#07070a] border-r border-white/5 p-6 flex flex-col justify-between gap-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            <span className="text-sm font-semibold tracking-wider uppercase text-gray-400 font-mono">CMS Console</span>
          </div>

          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'home' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Home size={18} /> Home Page
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'profile' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <User size={18} /> Profile Info
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'education' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <GraduationCap size={18} /> Education
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'skills' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Wrench size={18} /> Skill Tags
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'experience' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Briefcase size={18} /> Experience
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'projects' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <FolderGit2 size={18} /> Projects Grid
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'achievements' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Award size={18} /> Highlights
            </button>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all mt-auto"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </aside>

      {/* Main Form Dashboard */}
      <main className="flex-grow p-6 md:p-10 space-y-6 overflow-y-auto max-h-screen">
        
        {/* Floating status & save header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Manage Portfolio</h1>
            <p className="text-sm text-gray-400 mt-1">Make changes dynamically and publish updates immediately.</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {statusMsg && (
              <span className="text-xs font-semibold text-cyan-400 font-mono py-1.5 px-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                {statusMsg}
              </span>
            )}
            <button
              onClick={handlePublish}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black font-bold hover:bg-cyan-455 transition-colors flex items-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <Save size={16} />
              {saving ? 'Publishing...' : 'Publish Changes'}
            </button>
          </div>
        </div>

        {/* Dynamic form selector based on tabs */}
        <div className="pt-2">
          
          {/* HOME PAGE TAB */}
          {activeTab === 'home' && (
            <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-lg font-bold text-white">Hero Section Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Greeting (e.g. HI, I'M)</label>
                  <input type="text" value={data.homePage?.hero?.greeting || ''} onChange={(e) => updateHomePageHero('greeting', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">First Name</label>
                  <input type="text" value={data.homePage?.hero?.firstName || ''} onChange={(e) => updateHomePageHero('firstName', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Role / Subtitle</label>
                  <input type="text" value={data.homePage?.hero?.role || ''} onChange={(e) => updateHomePageHero('role', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase flex justify-between items-center">
                    Portrait Image URL
                    <label className="cursor-pointer text-cyan-400 hover:text-cyan-300">
                      Upload File
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  </label>
                  <input type="text" value={data.homePage?.hero?.portraitUrl || ''} onChange={(e) => updateHomePageHero('portraitUrl', e.target.value)} placeholder="/devesh-portrait.png" className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Description / Objective</label>
                  <textarea rows={3} value={data.homePage?.hero?.description || ''} onChange={(e) => updateHomePageHero('description', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"></textarea>
                </div>
                {/* Right Column Details */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Location Detail</label>
                  <input type="text" value={data.homePage?.hero?.location || ''} onChange={(e) => updateHomePageHero('location', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Education Detail</label>
                  <input type="text" value={data.homePage?.hero?.education || ''} onChange={(e) => updateHomePageHero('education', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Work Detail</label>
                  <input type="text" value={data.homePage?.hero?.work || ''} onChange={(e) => updateHomePageHero('work', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Email (Footer)</label>
                  <input type="email" value={data.homePage?.hero?.email || ''} onChange={(e) => updateHomePageHero('email', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                {/* Social Links */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">LinkedIn URL</label>
                  <input type="url" value={data.homePage?.hero?.linkedin || ''} onChange={(e) => updateHomePageHero('linkedin', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Behance URL</label>
                  <input type="url" value={data.homePage?.hero?.behance || ''} onChange={(e) => updateHomePageHero('behance', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Figma URL</label>
                  <input type="url" value={data.homePage?.hero?.figma || ''} onChange={(e) => updateHomePageHero('figma', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                {/* Buttons */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Button 1 Text</label>
                  <input type="text" value={data.homePage?.hero?.button1Text || ''} onChange={(e) => updateHomePageHero('button1Text', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Button 1 Redirect URL</label>
                  <input type="text" value={data.homePage?.hero?.button1Url || ''} onChange={(e) => updateHomePageHero('button1Url', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Button 2 Text</label>
                  <input type="text" value={data.homePage?.hero?.button2Text || ''} onChange={(e) => updateHomePageHero('button2Text', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Button 2 Redirect URL</label>
                  <input type="text" value={data.homePage?.hero?.button2Url || ''} onChange={(e) => updateHomePageHero('button2Url', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
            </div>
          )}
          
          {/* PROFILE INFO TAB */}
          {activeTab === 'profile' && (
            <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-lg font-bold text-white">Personal Profile Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Full Name</label>
                  <input type="text" value={data.profile.name} onChange={(e) => updateProfile('name', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Professional Title</label>
                  <input type="text" value={data.profile.title} onChange={(e) => updateProfile('title', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Email Address</label>
                  <input type="email" value={data.profile.email} onChange={(e) => updateProfile('email', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Phone Number</label>
                  <input type="text" value={data.profile.phone} onChange={(e) => updateProfile('phone', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Location Address</label>
                  <input type="text" value={data.profile.location} onChange={(e) => updateProfile('location', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Objective / Pitch Statement</label>
                  <textarea rows={3} value={data.profile.objective} onChange={(e) => updateProfile('objective', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">LinkedIn URL</label>
                  <input type="text" value={data.profile.linkedin} onChange={(e) => updateProfile('linkedin', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Behance Portfolio URL</label>
                  <input type="text" value={data.profile.behance} onChange={(e) => updateProfile('behance', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Figma Profile URL</label>
                  <input type="text" value={data.profile.figma} onChange={(e) => updateProfile('figma', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">GitHub Profile URL</label>
                  <input type="text" value={data.profile.github} onChange={(e) => updateProfile('github', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
            </div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-lg font-bold text-white">Academic Background</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Degree Name</label>
                  <input type="text" value={data.education.degree} onChange={(e) => updateEducation('degree', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">University / School</label>
                  <input type="text" value={data.education.school} onChange={(e) => updateEducation('school', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Location</label>
                  <input type="text" value={data.education.location} onChange={(e) => updateEducation('location', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">CGPA / Score</label>
                  <input type="text" value={data.education.cgpa} onChange={(e) => updateEducation('cgpa', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Graduation Date Info</label>
                  <input type="text" value={data.education.graduation} onChange={(e) => updateEducation('graduation', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Design Skills Editor */}
              <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-4">
                <h2 className="text-lg font-bold text-white">Core Design Skills</h2>
                <div className="flex flex-wrap gap-2 min-h-12 items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  {data.skills.designSkills.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/35 text-cyan-300 text-xs">
                      {skill}
                      <button onClick={() => removeSkill('designSkills', idx)} className="hover:text-red-400 transition-colors cursor-pointer"><Trash2 size={12} /></button>
                    </span>
                  ))}
                  {data.skills.designSkills.length === 0 && <span className="text-xs text-gray-500">No design skills added yet.</span>}
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const input = form.elements.namedItem('newSkill') as HTMLInputElement;
                  addSkill('designSkills', input.value);
                  form.reset();
                }} className="flex gap-2">
                  <input name="newSkill" type="text" placeholder="Add custom design skill (e.g. Wireframing)" className="flex-grow px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  <button type="submit" className="px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold flex items-center justify-center gap-1 cursor-pointer"><Plus size={16} /> Add</button>
                </form>
              </div>

              {/* Tools & Utilities Editor */}
              <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-4">
                <h2 className="text-lg font-bold text-purple-400 font-mono">Tools & Applications</h2>
                <div className="flex flex-wrap gap-2 min-h-12 items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  {data.skills.tools.map((tool, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/35 text-purple-300 text-xs font-mono">
                      {tool}
                      <button onClick={() => removeSkill('tools', idx)} className="hover:text-red-400 transition-colors cursor-pointer"><Trash2 size={12} /></button>
                    </span>
                  ))}
                  {data.skills.tools.length === 0 && <span className="text-xs text-gray-500">No tools listed yet.</span>}
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const input = form.elements.namedItem('newTool') as HTMLInputElement;
                  addSkill('tools', input.value);
                  form.reset();
                }} className="flex gap-2">
                  <input name="newTool" type="text" placeholder="Add design tool (e.g. Figma)" className="flex-grow px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  <button type="submit" className="px-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-black font-semibold flex items-center justify-center gap-1 cursor-pointer"><Plus size={16} /> Add</button>
                </form>
              </div>

              {/* Soft Skills Editor */}
              <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-4">
                <h2 className="text-lg font-bold text-gray-300">Other Professional Skills</h2>
                <div className="flex flex-wrap gap-2 min-h-12 items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  {data.skills.otherSkills.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-gray-300 text-xs">
                      {skill}
                      <button onClick={() => removeSkill('otherSkills', idx)} className="hover:text-red-400 transition-colors cursor-pointer"><Trash2 size={12} /></button>
                    </span>
                  ))}
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const input = form.elements.namedItem('newOther') as HTMLInputElement;
                  addSkill('otherSkills', input.value);
                  form.reset();
                }} className="flex gap-2">
                  <input name="newOther" type="text" placeholder="Add soft skill (e.g. Leadership)" className="flex-grow px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  <button type="submit" className="px-4 rounded-xl bg-white/15 hover:bg-white/20 text-white font-semibold flex items-center justify-center gap-1 cursor-pointer"><Plus size={16} /> Add</button>
                </form>
              </div>
            </div>
          )}

          {/* EXPERIENCE TIMELINE TAB */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Timeline Experience History</h2>
                <button onClick={addExperience} className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer">
                  <Plus size={14} /> Add Experience
                </button>
              </div>

              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={exp.id} className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-4 relative">
                    <button 
                      onClick={() => deleteExperience(idx)}
                      className="absolute top-6 right-6 p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-black transition-all cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Job Role Title</label>
                        <input type="text" value={exp.role} onChange={(e) => updateExperience(idx, 'role', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Company Name</label>
                        <input type="text" value={exp.company} onChange={(e) => updateExperience(idx, 'company', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Location Address</label>
                        <input type="text" value={exp.location} onChange={(e) => updateExperience(idx, 'location', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Duration Period</label>
                        <input type="text" value={exp.duration} onChange={(e) => updateExperience(idx, 'duration', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                    </div>

                    {/* Bullets editor */}
                    <div className="space-y-2">
                      <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Accomplishments / Bullet details</label>
                      <div className="space-y-2">
                        {exp.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex gap-2">
                            <input 
                              type="text" 
                              value={detail} 
                              onChange={(e) => {
                                const newDetails = [...exp.details];
                                newDetails[dIdx] = e.target.value;
                                updateExperience(idx, 'details', newDetails);
                              }}
                              className="flex-grow px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" 
                            />
                            <button 
                              onClick={() => {
                                const newDetails = [...exp.details];
                                newDetails.splice(dIdx, 1);
                                updateExperience(idx, 'details', newDetails);
                              }} 
                              className="p-2 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button 
                        onClick={() => {
                          updateExperience(idx, 'details', [...exp.details, 'New bullet point details']);
                        }}
                        className="text-xs text-cyan-400 font-semibold hover:text-cyan-300 transition-colors flex items-center gap-1 mt-2 cursor-pointer"
                      >
                        <Plus size={12} /> Add Point
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Featured Projects</h2>
                <button onClick={addProject} className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer">
                  <Plus size={14} /> Add Project
                </button>
              </div>

              <div className="space-y-6">
                {data.projects.map((project, idx) => (
                  <div key={project.id} className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-4 relative">
                    <button 
                      onClick={() => deleteProject(idx)}
                      className="absolute top-6 right-6 p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-black transition-all cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Unique Project ID (url slug)</label>
                        <input type="text" value={project.id} onChange={(e) => updateProject(idx, 'id', e.target.value.toLowerCase().replace(/\s+/g, '-'))} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Project Title</label>
                        <input type="text" value={project.title} onChange={(e) => updateProject(idx, 'title', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Visual Category</label>
                        <input type="text" value={project.category} onChange={(e) => updateProject(idx, 'category', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Cover Image URL</label>
                        <input type="text" value={project.image} onChange={(e) => updateProject(idx, 'image', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Brief Summary Card Description</label>
                        <input type="text" value={project.description} onChange={(e) => updateProject(idx, 'description', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Detailed Project Case Study</label>
                        <textarea rows={4} value={project.longDescription} onChange={(e) => updateProject(idx, 'longDescription', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Figma Design File URL</label>
                        <input type="text" value={project.figmaLink || ''} onChange={(e) => updateProject(idx, 'figmaLink', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Behance Showcase URL</label>
                        <input type="text" value={project.behanceLink || ''} onChange={(e) => updateProject(idx, 'behanceLink', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Live Web Demo URL</label>
                        <input type="text" value={project.liveLink || ''} onChange={(e) => updateProject(idx, 'liveLink', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>

                      {/* Tech stack items */}
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Project Tech Stack (comma separated)</label>
                        <input 
                          type="text" 
                          value={project.tech.join(', ')} 
                          onChange={(e) => {
                            const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                            updateProject(idx, 'tech', arr);
                          }}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cyan-500" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {/* Achievements Card */}
              <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
                <h2 className="text-lg font-bold text-white">Highlights & Extra-curriculars</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Achievements list</label>
                    <div className="space-y-2">
                      {data.achievements.map((ach, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text" 
                            value={ach} 
                            onChange={(e) => {
                              const list = [...data.achievements];
                              list[idx] = e.target.value;
                              setData({ ...data, achievements: list });
                            }}
                            className="flex-grow px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" 
                          />
                          <button 
                            onClick={() => deleteAchievement(idx)} 
                            className="p-2.5 rounded-xl bg-white/5 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target as HTMLFormElement;
                      const input = form.elements.namedItem('newAch') as HTMLInputElement;
                      addAchievement(input.value);
                      form.reset();
                    }} className="flex gap-2 pt-2">
                      <input name="newAch" type="text" placeholder="Add new achievement description" className="flex-grow px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      <button type="submit" className="px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold flex items-center gap-1 cursor-pointer"><Plus size={16} /> Add</button>
                    </form>
                  </div>
                </div>
              </div>

              {/* Certifications Card */}
              <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">Professional Certifications</h2>
                  <button onClick={addCertification} className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer">
                    <Plus size={14} /> Add Certification
                  </button>
                </div>
                
                <div className="space-y-6">
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 relative space-y-3">
                      <button 
                        onClick={() => deleteCertification(idx)} 
                        className="absolute top-4 right-4 p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-black transition-all cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Certification Name</label>
                          <input type="text" value={cert.name} onChange={(e) => updateCertification(idx, 'name', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Issuer Authority</label>
                          <input type="text" value={cert.issuer} onChange={(e) => updateCertification(idx, 'issuer', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Link URL</label>
                          <input type="text" value={cert.link} onChange={(e) => updateCertification(idx, 'link', e.target.value)} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
