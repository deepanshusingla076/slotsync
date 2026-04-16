'use client';
/**
 * Landing Page Component
 * Renders the main entry point for the application, including the hero section,
 * feature highlights, step-by-step guide, and contact form.
 */

import Link from 'next/link';
import { useState } from 'react';
import * as api from '@/lib/api';

const STEPS = [
  { num: '01', title: 'Define Rules', body: 'Set your hours, break times, and meeting locations.' },
  { num: '02', title: 'Share Link', body: 'Send your personal SlotSync URL to anyone.' },
  { num: '03', title: 'Get Booked', body: 'Invitees pick a slot. The event hits your calendar instantly.' },
];

export default function LandingPage() {
  const [contactForm, setContactForm] = useState({ type: 'feedback', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await api.submitContact(contactForm);
      setStatus({ type: 'success', text: 'Message sent successfully!' });
      setContactForm({ ...contactForm, message: '' });
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Failed to send message' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 inset-x-0 h-[72px] bg-white border-b border-gray-200 z-50 flex items-center px-6 md:px-10 justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
            S
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">SlotSync</span>
        </div>

        <div className="hidden md:flex gap-8 font-medium text-sm text-gray-600">
          <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          <a href="#steps" className="hover:text-blue-600 transition-colors">How It Works</a>
          <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
        </div>

        <Link href="/dashboard" className="btn-primary">
          Go to Dashboard
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="pt-32 pb-24 px-6 md:px-10 bg-gradient-to-b from-blue-50/50 to-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Easy scheduling <br/>
              <span className="text-blue-600">ahead</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
              SlotSync is your scheduling automation platform for eliminating the back-and-forth emails to find the perfect time.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/dashboard" className="btn-primary text-base px-8 py-3.5 rounded-full">
                Start for free
              </Link>
              <Link href="/book/30-min-meeting" className="btn-secondary text-base px-8 py-3.5 rounded-full border-gray-300">
                View Live Demo
              </Link>
            </div>
            <p className="text-xs text-gray-500 font-medium">No credit card required. No auth needed.</p>
          </div>

          <div className="relative h-[400px] w-full flex items-center justify-center lg:justify-end">
            {/* Professional Soft Calendar Graphic */}
            <div className="relative w-full max-w-[400px] h-[350px] bg-white rounded-2xl shadow-2xl shadow-blue-900/5 border border-gray-100 flex flex-col overflow-hidden">
              <div className="h-12 border-b border-gray-100 flex items-center px-4 gap-2 bg-gray-50/50">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="h-6 w-1/3 bg-gray-200 rounded-md skeleton" />
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl">S</div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-full bg-gray-100 rounded" />
                    <div className="h-4 w-5/6 bg-gray-100 rounded" />
                    <div className="h-4 w-4/6 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <div className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-semibold rounded-lg">9:00 AM</div>
                  <div className="px-4 py-2 bg-gray-50 text-gray-400 text-sm font-semibold rounded-lg">9:30 AM</div>
                  <div className="px-4 py-2 bg-gray-50 text-gray-400 text-sm font-semibold rounded-lg">10:00 AM</div>
                </div>
                <div className="mt-auto pt-4 flex gap-2">
                  <div className="flex-1 py-3 bg-blue-600 rounded-xl" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 px-6 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">Why Not Just Email?</h2>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Because finding a time to meet shouldn't take more time than the meeting itself.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📅', title: 'Event Types', p: 'Create custom durations and unique links for single meetings.' },
              { icon: '⏱️', title: 'Availability', p: 'Hardcode your weekly rules so nobody can book you at 3 AM.' },
              { icon: '🚀', title: 'Zero Clutter', p: 'Raw, unadulterated performance. Professional UI.' }
            ].map((card, i) => (
              <div key={i} className="card p-8 flex flex-col hover:shadow-lg transition-shadow border-gray-100">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed flex-1">
                  {card.p}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section id="steps" className="py-24 px-6 md:px-10 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Set up your availability and let the calendar do the heavy lifting.</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-6">
                {s.num}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
              <p className="text-gray-600 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row gap-16">
          
          {/* Contact Info Box */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Reach Out</h2>
            <p className="text-gray-600 text-lg mb-10 max-w-md">
              Have questions, feedback, or need support? Reach out via the form or email us directly. 
              Messages are routed instantly.
            </p>
            
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Direct Email</h3>
                <a href="mailto:deepanshusingla0746@gmail.com" className="text-[#006BFF] hover:underline font-medium">
                  deepanshusingla0746@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Feedback/Contact Form */}
          <div className="w-full max-w-md">
            <form className="card p-8 shadow-xl shadow-gray-200/50" onSubmit={handleContactSubmit}>
              
              {status && (
                <div className={`p-4 rounded-lg text-sm font-medium mb-6 ${status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                  {status.text}
                </div>
              )}

              <div className="flex gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input type="radio" name="type" value="feedback" checked={contactForm.type === 'feedback'} onChange={() => setContactForm(p => ({...p, type: 'feedback'}))} className="text-[#006BFF] focus:ring-[#006BFF]" />
                  Feedback
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input type="radio" name="type" value="contact" checked={contactForm.type === 'contact'} onChange={() => setContactForm(p => ({...p, type: 'contact'}))} className="text-[#006BFF] focus:ring-[#006BFF]" />
                  Contact
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label">Your Email</label>
                  <input type="email" required className="field" placeholder="you@email.com" value={contactForm.email} onChange={e => setContactForm(p => ({...p, email: e.target.value}))} />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea required className="field resize-none h-32" placeholder="Tell us what you're thinking..." value={contactForm.message} onChange={e => setContactForm(p => ({...p, message: e.target.value}))} />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full py-3 mt-2">
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 text-center text-gray-500 text-sm flex flex-col items-center">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm mb-4">S</div>
        <p>© 2026 SlotSync Platform. Built with Next.js, Tailwind, and Node.js.</p>
      </footer>

    </div>
  );
}
