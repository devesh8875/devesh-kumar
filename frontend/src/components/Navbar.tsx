'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-nav px-6' : 'bg-transparent border-b border-transparent px-6'}`}>
      <nav className="max-w-7xl mx-auto h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl font-bold tracking-tight text-white hover:text-[#ff2e2e] transition-all"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          DEVESH KUMAR
        </Link>
        
        <div className="flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-[#ff2e2e] transition-colors">Home</Link>
          <Link href="/#about" className="hover:text-[#ff2e2e] transition-colors">About Me</Link>
          <Link href="/#experience" className="hover:text-[#ff2e2e] transition-colors">Experience</Link>
          <Link href="/#projects" className="hover:text-[#ff2e2e] transition-colors">Projects</Link>
          <Link href="/faq" className="hover:text-[#ff2e2e] transition-colors">FAQs</Link>
          <Link 
            href="/#contact"
            className="px-5 py-1.5 rounded-full btn-gradient-border font-semibold hover:scale-105 shadow-md shadow-red-500/10 hover:shadow-red-500/20"
          >
            Conect with me
          </Link>
        </div>
      </nav>
    </header>
  );
}
