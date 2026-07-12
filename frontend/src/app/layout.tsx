import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Devesh Kumar | UI/UX & Graphic Designer Portfolio',
  description: 'Aspiring UI/UX designer and graphic designer leveraging design skills and innovative mindsets to drive creative solution in the field of design.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="scroll-smooth font-sans"
      suppressHydrationWarning
    >
      <body 
        className="bg-[#030303] text-gray-100 min-h-screen flex flex-col relative selection:bg-cyan-500 selection:text-black"
        suppressHydrationWarning
      >
        {/* Main Content Area */}
        <main className="flex-grow">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-white/5 py-8 bg-[#020202] z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Devesh Kumar. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/#about" className="hover:text-white transition-colors">About</Link>
              <Link href="/#projects" className="hover:text-white transition-colors">Projects</Link>
              <a href="mailto:designerdevesh8875@gmail.com" className="hover:text-white transition-colors">Email</a>
              <Link href="/backend/admin/login" className="hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
