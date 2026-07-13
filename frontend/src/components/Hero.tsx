import { ArrowRight } from 'lucide-react';

interface HeroProps {
  heroData: {
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
  profile: {
    name: string;
    title: string;
    objective: string;
    email: string;
    linkedin: string;
    behance: string;
    figma: string;
  };
}

export default function Hero({ heroData, profile }: HeroProps) {
  return (
    <section className="relative h-screen flex flex-col justify-between items-center overflow-hidden bg-transparent py-10 px-6">
      
      {/* Glow Backlight behind portrait */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-[#ff2e2e]/10 blur-3xl pointer-events-none z-0"></div>

      {/* Giant Centered First Name Background Typography */}
      <div className="w-full flex flex-col items-center justify-center select-none pointer-events-none z-10 mt-6 md:mt-20">
        <p className="text-gray-400 text-[18px] font-mono tracking-[0.2em] uppercase">
          {heroData.greeting}
        </p>
        <h1 
          className="text-[16vw] md:text-[20vw] font-black tracking-[0.036em] text-transparent bg-clip-text bg-gradient-to-r from-[#ff2e2e] to-[#ff6b3d] leading-none uppercase font-poppins text-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] mt-[-1.5vw] md:mt-[-2vw]"
          style={{ 
            marginRight: '-0.04em',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 80%)'
          }}
        >
          {heroData.firstName}
        </h1>
      </div>

      {/* Overlapping Grayscale Portrait in the Center */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[380px] md:w-[540px] md:h-[65%] lg:w-[600px] lg:h-[70%] z-20 flex justify-center items-end pointer-events-none">
        <img 
          src={heroData.portraitUrl} 
          alt={profile.name} 
          className="w-full h-full object-contain filter grayscale contrast-125 brightness-90"
          style={{
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)'
          }}
        />
      </div>

      {/* Dynamic Content Grid (Left & Right columns) */}
      <div className="relative w-full max-w-7xl mx-auto flex-grow flex flex-col justify-end pb-8 z-30">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          
          {/* Left Column Content */}
          <div className="col-span-1 md:col-span-4 text-left filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
            <p className="text-[#ffffff] font-extrabold tracking-wider uppercase text-[24px] mb-1">
              {heroData.role}
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              {heroData.description}
            </p>

            {/* Inline CTAs */}
            <div className="flex gap-4">
              <a
                href={heroData.button1Url}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#ff2e2e] text-white font-extrabold hover:bg-[#ff4444] transition-all text-[11px] tracking-wider uppercase"
              >
                {heroData.button1Text}
                <ArrowRight size={12} />
              </a>
              <a
                href={heroData.button2Url}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 transition-all font-bold text-[11px] tracking-wider uppercase"
              >
                {heroData.button2Text}
              </a>
            </div>
          </div>

          {/* Middle Spacer for Portrait */}
          <div className="col-span-1 md:col-span-4 h-24 md:h-0"></div>

          {/* Right Column Details */}
          <div className="col-span-1 md:col-span-4 flex flex-col items-start md:items-end gap-5 text-xs uppercase font-mono tracking-widest text-gray-400 md:text-right filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
            <div className="border-b border-white/10 pb-2 w-full md:w-auto">
              <span className="text-[10px] text-gray-500 block">based in</span>
              <span className="text-white font-bold text-sm tracking-wide">{heroData.location}</span>
            </div>
            <div className="border-b border-white/10 pb-2 w-full md:w-auto">
              <span className="text-[10px] text-gray-500 block">Education</span>
              <span className="text-white font-bold text-sm tracking-wide">{heroData.education}</span>
            </div>
            <div className="border-b border-white/10 pb-2 w-full md:w-auto">
              <span className="text-[10px] text-gray-500 block">Work in</span>
              <span className="text-white font-bold text-sm tracking-wide">{heroData.work}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Footer social icons & email */}
      <div className="absolute bottom-6 left-10 right-10 hidden md:flex justify-between items-center z-30 text-gray-500 text-[10px] tracking-widest uppercase">
        <div className="flex items-center gap-4">
          <a href={heroData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#ff2e2e] transition-colors">LinkedIn</a>
          <span>•</span>
          <a href={heroData.behance} target="_blank" rel="noopener noreferrer" className="hover:text-[#ff2e2e] transition-colors">Behance</a>
          <span>•</span>
          <a href={heroData.figma} target="_blank" rel="noopener noreferrer" className="hover:text-[#ff2e2e] transition-colors">Figma</a>
        </div>
        <div>
          <a href={`mailto:${heroData.email}`} className="hover:text-[#ff2e2e] transition-colors">{heroData.email}</a>
        </div>
      </div>

    </section>
  );
}
