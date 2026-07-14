'use client';

import React, { useState } from 'react';
import { Plus, Minus, MessageSquare, Phone } from 'lucide-react';

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

interface FaqAccordionProps {
  questions: FaqQuestion[];
  contactBox: FaqContact;
}

export default function FaqAccordion({ questions, contactBox }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(questions.length > 0 ? questions[0].id : null);

  const toggleAccordion = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px-6 z-10 relative">
      
      {/* Left: Accordion */}
      <div className="lg:col-span-2 space-y-4">
        {questions.map((q) => {
          const isOpen = openId === q.id;
          return (
            <div 
              key={q.id} 
              className={`rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-gradient-to-r from-[#ff2e2e] to-[#ff6b3d] text-white shadow-lg' : 'bg-[#111111] border border-white/5 text-gray-200 hover:bg-[#151515]'}`}
            >
              <button 
                onClick={() => toggleAccordion(q.id)} 
                className="w-full flex justify-between items-center p-6 text-left"
              >
                <span className="font-semibold md:text-lg pr-4">{q.question}</span>
                {isOpen ? <Minus className="flex-shrink-0" /> : <Plus className="flex-shrink-0 text-gray-400" />}
              </button>
              
              <div 
                className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 pt-0 text-white/90 text-sm leading-relaxed">
                  {q.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: Contact Cards */}
      <div className="space-y-6">
        
        {/* Dark Box */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center relative overflow-hidden">
          {/* Subtle bottom orange glow similar to design */}
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#ff2e2e]/20 to-transparent pointer-events-none"></div>
          
          <div className="w-16 h-16 bg-[#ff2e2e]/10 rounded-full flex items-center justify-center mb-6">
            <MessageSquare className="text-[#ff6b3d] w-8 h-8" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-3">
            {contactBox.title}
          </h3>
          
          <p className="text-sm text-gray-400 mb-8 max-w-[200px]">
            {contactBox.subtitle}
          </p>
          
          <button className="bg-gradient-to-r from-[#ff2e2e] to-[#ff6b3d] text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider text-sm hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,46,46,0.3)] w-full">
            {contactBox.buttonText}
          </button>
        </div>

        {/* Light Box (Dark theme version) */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 flex items-center gap-5">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center flex-shrink-0">
            <Phone className="text-[#ff6b3d] w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-mono tracking-wider mb-1 uppercase">
              Your Vision, My Craft
            </p>
            <h4 className="text-white font-bold text-lg leading-tight mb-1">
              {contactBox.phoneText}
            </h4>
            <p className="text-gray-400 text-sm">
              {contactBox.phoneNumber}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
