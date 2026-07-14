import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  let contactData = {
    headerTitle: 'Contact Me',
    breadcrumb: 'Home / Contact Me',
    mainHeading: 'Lets Talk for Your Next Projects',
    addressTitle: 'Address',
    address: '2464 Royal Ln. Mesa, New Jersey 45463',
    contactTitle: 'Contact',
    phone: '+0123-456-789',
    email: 'example@gmail.com',
    timeTitle: 'Time',
    time1: 'Monday - Friday : 10:00 - 20:00',
    time2: 'Saturday - Sunday : 11:00 - 18:00',
    socialTitle: 'Stay Connected'
  };

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://devesh-portfolio-backend.vercel.app';
    const res = await fetch(`${backendUrl}/backend/admin/api/portfolio`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data.contactData) {
        contactData = data.contactData;
      }
    }
  } catch (error) {
    console.error("Failed to fetch contact data", error);
  }

  const breadcrumbParts = contactData.breadcrumb.split('/').map(s => s.trim());
  const breadcrumbFirst = breadcrumbParts[0] || '';
  const breadcrumbLast = breadcrumbParts.length > 1 ? breadcrumbParts[breadcrumbParts.length - 1] : '';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative overflow-hidden font-poppins selection:bg-[#ff2e2e]/30 selection:text-white pb-20">
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

      {/* Header section */}
      <div className="pt-32 pb-16 relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{contactData.headerTitle}</h1>
        <div className="text-sm font-mono text-gray-500 uppercase tracking-widest flex items-center gap-2">
          {breadcrumbFirst && <span>{breadcrumbFirst}</span>}
          {breadcrumbLast && (
            <>
              <span>/</span>
              <span className="text-[#ff6b3d]">{breadcrumbLast}</span>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-2 text-sm text-gray-400 font-mono uppercase tracking-widest">
          <div className="w-8 h-[1px] bg-[#ff2e2e]"></div>
          <span>{contactData.headerTitle}</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold max-w-2xl mx-auto leading-tight">
          {contactData.mainHeading.split(' ').map((word, i) => {
            const isHighlight = word.toLowerCase() === 'your' || word.toLowerCase() === 'next' || word.toLowerCase() === 'projects';
            return isHighlight ? (
              <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b3d] to-[#ff2e2e] font-normal italic mr-2">{word}</span>
            ) : (
              <span key={i} className="mr-2">{word}</span>
            );
          })}
        </h2>
      </div>

      {/* Main Content Layout */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left Side: Form */}
        <div className="flex-1">
          <ContactForm />
        </div>

        {/* Right Side: Contact Info Card */}
        <div className="lg:w-[400px] flex flex-col rounded-3xl overflow-hidden border border-white/5">
          {/* Black top section */}
          <div className="bg-[#050505] p-10 flex-1 space-y-10">
            <div>
              <h3 className="text-[#ff4a1c] font-bold text-xl mb-4">{contactData.addressTitle}</h3>
              <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{contactData.address}</p>
            </div>
            <div>
              <h3 className="text-[#ff4a1c] font-bold text-xl mb-4">{contactData.contactTitle}</h3>
              <div className="space-y-2 text-gray-400">
                <p><span className="font-semibold text-white">Phone: </span>{contactData.phone}</p>
                <p><span className="font-semibold text-white">Email: </span>{contactData.email}</p>
              </div>
            </div>
            <div>
              <h3 className="text-[#ff4a1c] font-bold text-xl mb-4">{contactData.timeTitle}</h3>
              <div className="space-y-2 text-gray-400">
                <p>{contactData.time1}</p>
                <p>{contactData.time2}</p>
              </div>
            </div>
          </div>
          
          {/* Orange bottom section */}
          <div className="bg-gradient-to-br from-[#ff512f] to-[#dd2476] p-10 relative overflow-hidden">
            {/* Subtle overlay pattern */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            
            <div className="relative z-10">
              <h3 className="text-white font-bold text-xl mb-6">{contactData.socialTitle}</h3>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#ff4a1c] hover:scale-110 transition-transform">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#ff4a1c] hover:scale-110 transition-transform">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#ff4a1c] hover:scale-110 transition-transform">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
