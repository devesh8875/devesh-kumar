'use client';

import React, { useState } from 'react';
import { ChevronDown, Send } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    budget: '',
    country: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://devesh-portfolio-backend.vercel.app';
      const res = await fetch(`${backendUrl}/backend/admin/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully! I will get back to you soon.' });
        setFormData({ name: '', email: '', phone: '', interest: '', budget: '', country: '', message: '' });
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white">Your Name *</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Ex. John Doe" 
            required 
            className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b3d] transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white">Email *</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="example@gmail.com" 
            required 
            className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b3d] transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white">Phone *</label>
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Enter Phone Number" 
            required 
            className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b3d] transition-colors"
          />
        </div>
        <div className="space-y-2 relative">
          <label className="text-sm font-semibold text-white">I'm Interested in *</label>
          <div className="relative">
            <select 
              name="interest" 
              value={formData.interest} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-[#ff6b3d] transition-colors cursor-pointer"
            >
              <option value="" disabled hidden>Select</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Branding">Branding</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>
        </div>
        <div className="space-y-2 relative">
          <label className="text-sm font-semibold text-white">Budget Range (USD) *</label>
          <div className="relative">
            <select 
              name="budget" 
              value={formData.budget} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-[#ff6b3d] transition-colors cursor-pointer"
            >
              <option value="" disabled hidden>Select Range</option>
              <option value="Under $1,000">Under $1,000</option>
              <option value="$1,000 - $5,000">$1,000 - $5,000</option>
              <option value="$5,000 - $10,000">$5,000 - $10,000</option>
              <option value="$10,000+">$10,000+</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>
        </div>
        <div className="space-y-2 relative">
          <label className="text-sm font-semibold text-white">Country *</label>
          <div className="relative">
            <select 
              name="country" 
              value={formData.country} 
              onChange={handleChange} 
              required 
              className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-[#ff6b3d] transition-colors cursor-pointer"
            >
              <option value="" disabled hidden>Select Country</option>
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-white">Your Message *</label>
        <textarea 
          name="message" 
          value={formData.message} 
          onChange={handleChange} 
          placeholder="Enter here.." 
          required 
          rows={5}
          className="w-full px-4 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff6b3d] transition-colors resize-none"
        ></textarea>
      </div>

      {status.message && (
        <div className={`p-4 rounded-xl text-sm font-semibold ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {status.message}
        </div>
      )}

      <button 
        type="submit" 
        disabled={loading}
        className="px-8 py-3 bg-[#ff4a1c] hover:bg-[#ff5b31] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-full transition-colors flex items-center gap-2"
      >
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
