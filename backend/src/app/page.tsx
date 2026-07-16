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
  LogOut,
  AlertTriangle,
  HelpCircle,
  Phone,
  LayoutDashboard
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

interface NotFoundData {
  title: string;
  description: string;
}

interface FaqQuestion {
  id: number;
  question: string;
  answer: string;
}

interface FaqContact {
  title: string;
  subtitle: string;
  buttonText: string;
  phoneText: string;
  phoneNumber: string;
}

interface FaqData {
  headerTitle?: string;
  breadcrumb?: string;
  mainHeading?: string;
  questions: FaqQuestion[];
  contactBox: FaqContact;
}

interface ContactData {
  headerTitle: string;
  breadcrumb: string;
  mainHeading: string;
  addressTitle: string;
  address: string;
  contactTitle: string;
  phone: string;
  email: string;
  socialTitle: string;
}

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

interface PortfolioData {
  homePage: HomePage;
  notFound?: NotFoundData;
  faqData?: FaqData;
  contactData?: ContactData;
  profile: Profile;
  education: Education;
  skills: Skills;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  certifications: Array<{ name: string; issuer: string; link: string }>;
  achievements: string[];
  extracurriculars: string[];
  projectPage?: ProjectPageData;
}

type TabType = 'dashboard' | 'home' | 'notFound' | 'faq' | 'contact' | 'profile' | 'education' | 'skills' | 'experience' | 'projects' | 'achievements' | 'projectPage';

export default function AdminDashboard() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  
  // Project Page CMS State
  const [projectSubTab, setProjectSubTab] = useState<'cards' | 'details'>('cards');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

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
        
        // Polyfill FAQ Data if missing in MongoDB
        if (!portfolioData.faqData) {
          portfolioData.faqData = {
            headerTitle: 'FAQs',
            breadcrumb: 'Home / FAQs',
            mainHeading: 'Questions? Look here.',
            questions: [
              { id: 1, question: 'Are you available for freelance or contract design work?', answer: 'Yes, I am open to freelance and contract opportunities.' },
              { id: 2, question: 'What industries do you specialize in?', answer: 'I have experience in various industries including tech, e-commerce, and healthcare.' },
              { id: 3, question: 'What design tools do you use in your workflow?', answer: 'I primarily use Figma, Adobe XD, and Illustrator.' }
            ],
            contactBox: {
              title: 'You have different questions? Ask Away!',
              subtitle: 'Your Questions, My Answers. Quick Responses Guaranteed.',
              buttonText: 'Contact Us',
              phoneText: 'Available 24/7',
              phoneNumber: '(000) 000-0000'
            }
          };
        }

        // Polyfill Contact Data
        if (!portfolioData.contactData) {
          portfolioData.contactData = {
            headerTitle: 'Contact Me',
            breadcrumb: 'Home / Contact Me',
            mainHeading: 'Lets Talk for Your Next Projects',
            addressTitle: 'Address',
            address: '2464 Royal Ln. Mesa, New Jersey 45463',
            contactTitle: 'Contact',
            phone: '+0123-456-789',
            email: 'example@gmail.com',
            socialTitle: 'Stay Connected'
          };
        }
        // Polyfill Project Page Data
        if (!portfolioData.projectPage) {
          portfolioData.projectPage = {
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
                viewDetailsLink: '/projects/1',
                details: {
                  heroImage: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop',
                  category: 'App UIUX Design',
                  challengeText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
                  solutionText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
                  solutionPoints: [
                    'Lorem ipsum dolor',
                    'Sed ut perspiciatis',
                    'Vitae dicta sunt explicabo',
                    'Veritatis et quasi architecto'
                  ],
                  solutionImages: [
                    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=500&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=500&auto=format&fit=crop'
                  ],
                  impactText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
                  testimonialAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
                  testimonialName: 'Emma Carter',
                  testimonialRole: 'CEO, Food Recipe App',
                  testimonialRating: '5.0',
                  testimonialText: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem...'
                }
              },
              {
                id: '2',
                title: 'Ebook',
                subtitle: '- Ebook and Audio Book App UI',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
                client: 'Robert Fox',
                duration: '3 Months',
                country: 'United States',
                image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop',
                viewDetailsLink: '#'
              },
              {
                id: '3',
                title: 'Coworking',
                subtitle: '- Coworking Space Website UIUX Design',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.',
                client: 'Lily Morgan',
                duration: '2 Months',
                country: 'United States',
                image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?q=80&w=1000&auto=format&fit=crop',
                viewDetailsLink: '#'
              }
            ]
          };
        }
        
        setData(portfolioData);

        // Load messages
        try {
          const msgRes = await fetch('/backend/admin/api/admin/messages');
          if (msgRes.ok) {
            const msgData = await msgRes.json();
            setMessages(msgData.messages || []);
          }
        } catch (msgErr) {
          console.error("Failed to load messages", msgErr);
        }

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

  const updateNotFound = (field: keyof NotFoundData, value: string) => {
    setData((prev) => prev ? {
      ...prev,
      notFound: {
        ...(prev.notFound || { title: 'Oops! Page not Found', description: 'The page you are looking for cannot be found. take a break before trying again' }),
        [field]: value
      }
    } : null);
  };

  const updateContactData = (field: keyof ContactData, value: string) => {
    if (!data || !data.contactData) return;
    setData({
      ...data,
      contactData: {
        ...data.contactData,
        [field]: value
      }
    });
  };

  const updateFaqHeader = (field: keyof FaqData, value: string) => {
    if (!data || !data.faqData) return;
    setData({
      ...data,
      faqData: {
        ...data.faqData,
        [field]: value
      }
    });
  };

  const updateFaqQuestion = (index: number, field: keyof FaqQuestion, value: string) => {
    if (!data || !data.faqData) return;
    const list = [...data.faqData.questions];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, faqData: { ...data.faqData, questions: list } });
  };

  const addFaqQuestion = () => {
    if (!data || !data.faqData) return;
    const newId = data.faqData.questions.length > 0 ? Math.max(...data.faqData.questions.map(q => q.id)) + 1 : 1;
    setData({
      ...data,
      faqData: {
        ...data.faqData,
        questions: [...data.faqData.questions, { id: newId, question: '', answer: '' }]
      }
    });
  };

  const removeFaqQuestion = (index: number) => {
    if (!data || !data.faqData) return;
    const list = [...data.faqData.questions];
    list.splice(index, 1);
    setData({ ...data, faqData: { ...data.faqData, questions: list } });
  };

  const updateFaqContact = (field: keyof FaqContact, value: string) => {
    if (!data || !data.faqData) return;
    setData({
      ...data,
      faqData: {
        ...data.faqData,
        contactBox: { ...data.faqData.contactBox, [field]: value }
      }
    });
  };

  const updateProjectPageData = (field: keyof ProjectPageData, value: string) => {
    if (!data || !data.projectPage) return;
    setData({
      ...data,
      projectPage: { ...data.projectPage, [field]: value }
    });
  };

  const updateProjectPageProject = (index: number, field: keyof ProjectPageProject, value: string) => {
    if (!data || !data.projectPage) return;
    const list = [...data.projectPage.projects];
    list[index] = { ...list[index], [field]: value };
    setData({ ...data, projectPage: { ...data.projectPage, projects: list } });
  };

  const addProjectPageProject = () => {
    if (!data || !data.projectPage) return;
    const newId = Date.now().toString();
    setData({
      ...data,
      projectPage: {
        ...data.projectPage,
        projects: [...data.projectPage.projects, {
          id: newId,
          title: 'New Project',
          subtitle: '- Subtitle',
          description: '',
          client: '',
          duration: '',
          country: '',
          image: '',
          viewDetailsLink: '#',
          details: {
            heroImage: '',
            category: '',
            challengeText: '',
            solutionText: '',
            solutionPoints: [],
            solutionImages: [],
            impactText: '',
            testimonialAvatar: '',
            testimonialName: '',
            testimonialRole: '',
            testimonialRating: '',
            testimonialText: ''
          }
        }]
      }
    });
  };

  const updateProjectPageProjectDetails = (index: number, field: keyof ProjectDetailsData, value: any) => {
    if (!data || !data.projectPage) return;
    const list = [...data.projectPage.projects];
    const project = list[index];
    if (!project.details) return; // shouldn't happen with polyfill
    project.details = { ...project.details, [field]: value };
    setData({ ...data, projectPage: { ...data.projectPage, projects: list } });
  };


  const removeProjectPageProject = (index: number) => {
    if (!data || !data.projectPage) return;
    const list = [...data.projectPage.projects];
    list.splice(index, 1);
    setData({ ...data, projectPage: { ...data.projectPage, projects: list } });
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
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'home' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Home size={18} /> Home Page
            </button>
            <button
              onClick={() => setActiveTab('notFound')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'notFound' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <AlertTriangle size={18} /> 404 Page
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'faq' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <HelpCircle size={18} /> FAQ Page
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'contact' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Phone size={18} /> Contact Page
            </button>
            <button
              onClick={() => setActiveTab('projectPage')}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'projectPage' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <FolderGit2 size={18} /> Projects Page
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

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 bg-[#0a0a0f] p-4 md:p-8 overflow-y-auto relative">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Form Submissions</h2>
              
              {messages.length === 0 ? (
                <div className="text-gray-500 bg-white/5 p-6 rounded-2xl text-center">No messages received yet.</div>
              ) : (
                <div className="bg-zinc-950/40 rounded-2xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-xs uppercase bg-white/5 text-gray-400 border-b border-white/5">
                        <tr>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Email / Phone</th>
                          <th className="px-6 py-4">Interest</th>
                          <th className="px-6 py-4">Message</th>
                        </tr>
                      </thead>
                      <tbody>
                        {messages.map((msg, i) => (
                          <tr key={msg._id || i} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(msg.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 font-medium text-white">{msg.name}</td>
                            <td className="px-6 py-4">
                              <div>{msg.email}</div>
                              <div className="text-xs text-gray-500">{msg.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div>{msg.interest}</div>
                            </td>
                            <td className="px-6 py-4 max-w-xs truncate" title={msg.message}>{msg.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

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

          {/* 404 PAGE TAB */}
          {activeTab === 'notFound' && (
            <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
              <h2 className="text-lg font-bold text-white">404 Error Page Content</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Title</label>
                  <input type="text" value={data.notFound?.title || 'Oops! Page not Found'} onChange={(e) => updateNotFound('title', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 font-semibold uppercase">Description</label>
                  <textarea rows={3} value={data.notFound?.description || 'The page you are looking for cannot be found. take a break before trying again'} onChange={(e) => updateNotFound('description', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"></textarea>
                </div>
              </div>
            </div>
          )}

          {/* FAQ TAB */}
          {activeTab === 'faq' && data.faqData && (
            <div className="space-y-6">
              <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
                <h2 className="text-lg font-bold text-white">Page Header Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Header Title</label>
                    <input type="text" value={data.faqData.headerTitle || 'FAQs'} onChange={(e) => updateFaqHeader('headerTitle', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Breadcrumb</label>
                    <input type="text" value={data.faqData.breadcrumb || 'Home / FAQs'} onChange={(e) => updateFaqHeader('breadcrumb', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Main Heading</label>
                    <input type="text" value={data.faqData.mainHeading || 'Questions? Look here.'} onChange={(e) => updateFaqHeader('mainHeading', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>
              </div>
              <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white">FAQ Questions</h2>
                  <button onClick={addFaqQuestion} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-sm font-semibold transition-all">
                    <Plus size={16} /> Add Question
                  </button>
                </div>
                <div className="space-y-4">
                  {data.faqData.questions.map((q, idx) => (
                    <div key={q.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-4 relative group">
                      <button onClick={() => removeFaqQuestion(idx)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                      <div className="space-y-1 mr-8">
                        <label className="text-xs text-gray-400 font-semibold uppercase">Question</label>
                        <input type="text" value={q.question} onChange={(e) => updateFaqQuestion(idx, 'question', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-semibold uppercase">Answer</label>
                        <textarea rows={3} value={q.answer} onChange={(e) => updateFaqQuestion(idx, 'answer', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"></textarea>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
                <h2 className="text-lg font-bold text-white">Contact Box Info</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Title</label>
                    <input type="text" value={data.faqData.contactBox.title} onChange={(e) => updateFaqContact('title', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Subtitle</label>
                    <input type="text" value={data.faqData.contactBox.subtitle} onChange={(e) => updateFaqContact('subtitle', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Button Text</label>
                    <input type="text" value={data.faqData.contactBox.buttonText} onChange={(e) => updateFaqContact('buttonText', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Phone Title</label>
                    <input type="text" value={data.faqData.contactBox.phoneText} onChange={(e) => updateFaqContact('phoneText', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Phone Number</label>
                    <input type="text" value={data.faqData.contactBox.phoneNumber} onChange={(e) => updateFaqContact('phoneNumber', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTACT PAGE TAB */}
          {activeTab === 'contact' && data.contactData && (
            <div className="space-y-6">
              <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
                <h2 className="text-lg font-bold text-white">Contact Page Header</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Header Title</label>
                    <input type="text" value={data.contactData.headerTitle} onChange={(e) => updateContactData('headerTitle', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Breadcrumb</label>
                    <input type="text" value={data.contactData.breadcrumb} onChange={(e) => updateContactData('breadcrumb', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Main Heading</label>
                    <input type="text" value={data.contactData.mainHeading} onChange={(e) => updateContactData('mainHeading', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
                <h2 className="text-lg font-bold text-white">Contact Details (Right Card)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Address Box Title</label>
                    <input type="text" value={data.contactData.addressTitle} onChange={(e) => updateContactData('addressTitle', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Address</label>
                    <textarea rows={2} value={data.contactData.address} onChange={(e) => updateContactData('address', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"></textarea>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Contact Box Title</label>
                    <input type="text" value={data.contactData.contactTitle} onChange={(e) => updateContactData('contactTitle', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Phone Number</label>
                    <input type="text" value={data.contactData.phone} onChange={(e) => updateContactData('phone', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Email</label>
                    <input type="email" value={data.contactData.email} onChange={(e) => updateContactData('email', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Social Links Title</label>
                    <input type="text" value={data.contactData.socialTitle} onChange={(e) => updateContactData('socialTitle', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROJECT PAGE TAB */}
          {activeTab === 'projectPage' && data.projectPage && (
            <div className="space-y-6">
              
              <div className="flex gap-4 border-b border-white/5 pb-4">
                <button
                  onClick={() => setProjectSubTab('cards')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${projectSubTab === 'cards' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  Project Cards
                </button>
                <button
                  onClick={() => setProjectSubTab('details')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${projectSubTab === 'details' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  Project Details
                </button>
              </div>

              {projectSubTab === 'cards' && (
                <>
                  <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
                    <h2 className="text-lg font-bold text-white">Project Page Header</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-semibold uppercase">Header Title</label>
                        <input type="text" value={data.projectPage.headerTitle} onChange={(e) => updateProjectPageData('headerTitle', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400 font-semibold uppercase">Breadcrumb</label>
                        <input type="text" value={data.projectPage.breadcrumb} onChange={(e) => updateProjectPageData('breadcrumb', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-xs text-gray-400 font-semibold uppercase">Main Heading</label>
                        <input type="text" value={data.projectPage.mainHeading} onChange={(e) => updateProjectPageData('mainHeading', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-bold text-white">Project Cards List</h2>
                      <button onClick={addProjectPageProject} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-sm font-semibold transition-all">
                        <Plus size={16} /> Add Project
                      </button>
                    </div>
                    <div className="space-y-6">
                      {data.projectPage.projects.map((proj, idx) => (
                        <div key={proj.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white">{proj.title || 'Untitled Project'}</span>
                            <div className="flex gap-4">
                              <button onClick={() => setSelectedProjectId(selectedProjectId === proj.id ? null : proj.id)} className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
                                {selectedProjectId === proj.id ? 'Close' : 'Edit'}
                              </button>
                              <button onClick={() => removeProjectPageProject(idx)} className="text-red-500 hover:text-red-400 text-sm font-semibold">Delete</button>
                            </div>
                          </div>
                          
                          {selectedProjectId === proj.id && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-4">
                              <div className="space-y-1">
                                <label className="text-xs text-gray-400 font-semibold uppercase">Title</label>
                                <input type="text" value={proj.title} onChange={(e) => updateProjectPageProject(idx, 'title', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-gray-400 font-semibold uppercase">Subtitle</label>
                                <input type="text" value={proj.subtitle} onChange={(e) => updateProjectPageProject(idx, 'subtitle', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                              </div>
                              <div className="space-y-1 md:col-span-2">
                                <label className="text-xs text-gray-400 font-semibold uppercase">Description</label>
                                <textarea rows={2} value={proj.description} onChange={(e) => updateProjectPageProject(idx, 'description', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"></textarea>
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-gray-400 font-semibold uppercase">Client</label>
                                <input type="text" value={proj.client} onChange={(e) => updateProjectPageProject(idx, 'client', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-gray-400 font-semibold uppercase">Duration</label>
                                <input type="text" value={proj.duration} onChange={(e) => updateProjectPageProject(idx, 'duration', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-gray-400 font-semibold uppercase">Country</label>
                                <input type="text" value={proj.country} onChange={(e) => updateProjectPageProject(idx, 'country', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs text-gray-400 font-semibold uppercase">View Details Link</label>
                                <input type="text" value={proj.viewDetailsLink} onChange={(e) => updateProjectPageProject(idx, 'viewDetailsLink', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                              </div>
                              <div className="space-y-1 md:col-span-2">
                                <label className="text-xs text-gray-400 font-semibold uppercase">Card Image URL</label>
                                <input type="text" value={proj.image} onChange={(e) => updateProjectPageProject(idx, 'image', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {projectSubTab === 'details' && (
                <div className="bg-zinc-950/40 p-6 rounded-2xl border border-white/5 space-y-6">
                  <h2 className="text-lg font-bold text-white">Edit Project Details</h2>
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-semibold uppercase">Select Project</label>
                    <select 
                      value={selectedProjectId || ''} 
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
                    >
                      <option value="" disabled>Select a project</option>
                      {data.projectPage.projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  {selectedProjectId && data.projectPage.projects.find(p => p.id === selectedProjectId) && (() => {
                    const idx = data.projectPage.projects.findIndex(p => p.id === selectedProjectId);
                    const pData = data.projectPage.projects[idx].details;
                    if (!pData) return null;
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-6">
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs text-gray-400 font-semibold uppercase">Hero Image URL</label>
                          <input type="text" value={pData.heroImage} onChange={(e) => updateProjectPageProjectDetails(idx, 'heroImage', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs text-gray-400 font-semibold uppercase">Category</label>
                          <input type="text" value={pData.category} onChange={(e) => updateProjectPageProjectDetails(idx, 'category', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs text-gray-400 font-semibold uppercase">The Challenge</label>
                          <textarea rows={3} value={pData.challengeText} onChange={(e) => updateProjectPageProjectDetails(idx, 'challengeText', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"></textarea>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs text-gray-400 font-semibold uppercase">The Solution</label>
                          <textarea rows={3} value={pData.solutionText} onChange={(e) => updateProjectPageProjectDetails(idx, 'solutionText', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"></textarea>
                        </div>
                        
                        <div className="space-y-1 md:col-span-2 border border-white/5 p-4 rounded-xl bg-white/[0.02]">
                          <label className="text-xs text-gray-400 font-semibold uppercase block mb-2">Solution Bullets (comma separated)</label>
                          <input 
                            type="text" 
                            value={pData.solutionPoints.join(', ')} 
                            onChange={(e) => updateProjectPageProjectDetails(idx, 'solutionPoints', e.target.value.split(',').map(s => s.trim()).filter(s => s))} 
                            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" 
                            placeholder="Point 1, Point 2, Point 3..."
                          />
                        </div>

                        <div className="space-y-1 border border-white/5 p-4 rounded-xl bg-white/[0.02]">
                          <label className="text-xs text-gray-400 font-semibold uppercase block mb-2">Solution Image 1 URL</label>
                          <input type="text" value={pData.solutionImages[0] || ''} onChange={(e) => updateProjectPageProjectDetails(idx, 'solutionImages', [e.target.value, pData.solutionImages[1] || ''])} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                        </div>
                        <div className="space-y-1 border border-white/5 p-4 rounded-xl bg-white/[0.02]">
                          <label className="text-xs text-gray-400 font-semibold uppercase block mb-2">Solution Image 2 URL</label>
                          <input type="text" value={pData.solutionImages[1] || ''} onChange={(e) => updateProjectPageProjectDetails(idx, 'solutionImages', [pData.solutionImages[0] || '', e.target.value])} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-xs text-gray-400 font-semibold uppercase">The Impact</label>
                          <textarea rows={3} value={pData.impactText} onChange={(e) => updateProjectPageProjectDetails(idx, 'impactText', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"></textarea>
                        </div>

                        <div className="space-y-4 md:col-span-2 border border-white/5 p-4 rounded-xl bg-white/[0.02] mt-4">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Testimonial</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs text-gray-400 font-semibold uppercase">Name</label>
                              <input type="text" value={pData.testimonialName} onChange={(e) => updateProjectPageProjectDetails(idx, 'testimonialName', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-gray-400 font-semibold uppercase">Role (e.g., CEO)</label>
                              <input type="text" value={pData.testimonialRole} onChange={(e) => updateProjectPageProjectDetails(idx, 'testimonialRole', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-gray-400 font-semibold uppercase">Rating (e.g., 5.0)</label>
                              <input type="text" value={pData.testimonialRating} onChange={(e) => updateProjectPageProjectDetails(idx, 'testimonialRating', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs text-gray-400 font-semibold uppercase">Avatar URL</label>
                              <input type="text" value={pData.testimonialAvatar} onChange={(e) => updateProjectPageProjectDetails(idx, 'testimonialAvatar', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500" />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                              <label className="text-xs text-gray-400 font-semibold uppercase">Review Text</label>
                              <textarea rows={3} value={pData.testimonialText} onChange={(e) => updateProjectPageProjectDetails(idx, 'testimonialText', e.target.value)} className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none"></textarea>
                            </div>
                          </div>
                        </div>

                      </div>
                    )
                  })()}
                </div>
              )}

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
