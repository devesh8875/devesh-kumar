import Navbar from '@/components/Navbar';
import FaqAccordion from '@/components/FaqAccordion';

export const dynamic = 'force-dynamic';

export default async function FaqPage() {
  let faqData = {
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

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://devesh-portfolio-backend.vercel.app';
    const res = await fetch(`${backendUrl}/api/portfolio`, {
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data.faqData && data.faqData.questions && data.faqData.contactBox) {
        faqData = data.faqData;
      }
    }
  } catch (error) {
    console.error("Failed to fetch FAQ data", error);
  }

  // Handle breadcrumb splitting (assumes "Something / Something")
  const breadcrumbParts = faqData.breadcrumb.split('/').map(s => s.trim());
  const breadcrumbFirst = breadcrumbParts[0] || '';
  const breadcrumbLast = breadcrumbParts.length > 1 ? breadcrumbParts[breadcrumbParts.length - 1] : '';

  // Handle main heading splitting (to style the second part with gradient)
  const questionMarkIndex = faqData.mainHeading.indexOf('?');
  let headingFirst = faqData.mainHeading;
  let headingSecond = '';
  
  if (questionMarkIndex !== -1) {
    headingFirst = faqData.mainHeading.substring(0, questionMarkIndex + 1);
    headingSecond = faqData.mainHeading.substring(questionMarkIndex + 1).trim();
  }

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

      {/* Header section similar to the design */}
      <div className="pt-32 pb-16 relative z-10 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{faqData.headerTitle}</h1>
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

      <div className="relative z-10 text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-2 text-sm text-gray-400 font-mono uppercase tracking-widest">
          <div className="w-8 h-[1px] bg-[#ff2e2e]"></div>
          <span>{faqData.headerTitle}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">
          {headingFirst} {headingSecond && <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b3d] to-[#ff2e2e] font-normal italic">{headingSecond}</span>}
        </h2>
      </div>

      <FaqAccordion questions={faqData.questions} contactBox={faqData.contactBox} />
    </div>
  );
}
