import Link from 'next/link';
import Navbar from '@/components/Navbar';

export const dynamic = 'force-dynamic';

export default async function NotFound() {
  let title = "Oops! Page not Found";
  let description = "The page you are looking for cannot be found. take a break before trying again";

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://devesh-portfolio-backend.vercel.app';
    const res = await fetch(`${backendUrl}/api/portfolio`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data.notFound) {
        if (data.notFound.title) title = data.notFound.title;
        if (data.notFound.description) description = data.notFound.description;
      }
    }
  } catch (error) {
    console.error("Failed to fetch 404 data", error);
  }

  // Split title if it contains "Oops!" for styling
  const splitIndex = title.indexOf('Oops!');
  let titleFirstPart = "";
  let titleSecondPart = title;

  if (splitIndex !== -1) {
    titleFirstPart = "Oops! ";
    titleSecondPart = title.substring(splitIndex + 5).trim();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-poppins selection:bg-[#ff2e2e]/30 selection:text-white">
      {/* Grid Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6">
        
        {/* Giant 404 */}
        <div className="flex items-center justify-center font-black text-[120px] md:text-[200px] lg:text-[250px] leading-none tracking-tighter mb-4">
          <span className="text-white">4</span>
          
          {/* Sliced Circle for '0' */}
          <div className="relative mx-1 md:mx-4 w-[90px] h-[120px] md:w-[150px] md:h-[200px] lg:w-[180px] lg:h-[250px] flex flex-col justify-between">
            {/* Top Half */}
            <div className="w-full h-[47%] bg-gradient-to-br from-[#ff6b3d] to-[#ff2e2e] rounded-t-full relative overflow-hidden">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[200%] bg-[#0a0a0a] rounded-full"></div>
            </div>
            
            {/* Bottom Half */}
            <div className="w-full h-[47%] bg-gradient-to-tr from-[#ff2e2e] to-[#ff6b3d] rounded-b-full relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[200%] bg-[#0a0a0a] rounded-full"></div>
            </div>
          </div>
          
          <span className="text-white">4</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-center">
          {titleFirstPart && <span className="text-white">{titleFirstPart}</span>}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b3d] to-[#ff2e2e] font-normal italic">{titleSecondPart}</span>
        </h2>

        {/* Subtext */}
        <p className="text-gray-400 text-sm md:text-base max-w-md text-center mb-10 leading-relaxed font-mono tracking-wide">
          {description}
        </p>

        {/* Button */}
        <Link 
          href="/"
          className="bg-gradient-to-r from-[#ff2e2e] to-[#ff6b3d] text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,46,46,0.3)] hover:shadow-[0_0_30px_rgba(255,46,46,0.5)]"
        >
          Go to Home Page
        </Link>
      </main>
    </div>
  );
}
