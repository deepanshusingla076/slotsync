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
  { num: '01', title: 'Define Your Rules', body: 'Set your available hours, break times, and meeting durations in minutes.', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg> },
  { num: '02', title: 'Share Your Link', body: 'Send your personal SlotSync URL to anyone who wants to schedule a meeting.', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
  { num: '03', title: 'Get Booked', body: 'Invitees pick a time slot. The event shows up on your calendar instantly.', icon: <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
];

const FEATURES = [
  {
    icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    title: 'Event Types',
    desc: 'Create custom event types with unique durations, colors, and shareable booking links.',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
  },
  {
    icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    title: 'Smart Availability',
    desc: 'Set your weekly schedule once. SlotSync prevents double-bookings automatically.',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    title: 'Zero Friction',
    desc: 'No sign-ups, no credit cards. Share a link and start getting booked immediately.',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
  },
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

      {/* ── Navigation ── */}
      <nav className="fixed top-0 inset-x-0 h-[72px] bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50 flex items-center px-6 md:px-10 justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-[#0066FF] to-[#4F46E5] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
            S
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">SlotSync</span>
        </div>

        <div className="hidden md:flex gap-8 font-medium text-sm text-gray-500">
          <a href="#about" className="hover:text-gray-900 transition-colors">Features</a>
          <a href="#steps" className="hover:text-gray-900 transition-colors">How It Works</a>
          <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
        </div>

        <Link href="/dashboard" className="btn-primary rounded-full px-5 py-2">
          Go to Dashboard
        </Link>
      </nav>

      {/* ── Hero Section ── */}
      <header className="pt-36 pb-28 px-6 md:px-10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-bg opacity-40" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/5 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center relative z-10">

          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-sm font-semibold text-blue-600">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Free scheduling platform
            </div>

            <h1 className="text-5xl md:text-[3.5rem] font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              Easy scheduling{' '}
              <br />
              <span className="gradient-text">ahead</span>
            </h1>

            <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
              SlotSync is your scheduling automation platform for eliminating the back-and-forth emails to find the perfect time — and it&apos;s completely free.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/dashboard" className="btn-primary text-base px-8 py-3.5 rounded-full">
                Start for free
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link href="/book/30-min-meeting" className="btn-secondary text-base px-8 py-3.5 rounded-full">
                View Live Demo
              </Link>
            </div>
            <p className="text-xs text-gray-400 font-medium">No credit card required • No authentication needed</p>
          </div>

          {/* Hero Visual */}
          <div className="relative h-[420px] w-full flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[400px] h-[370px] bg-white rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-100 flex flex-col overflow-hidden">
              <div className="h-12 border-b border-gray-50 flex items-center px-5 gap-2 bg-gray-50/50">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-amber-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
                <span className="ml-3 text-xs text-gray-400 font-medium">SlotSync Booking</span>
              </div>
              <div className="p-6 flex flex-col gap-5 flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">S</div>
                  <div>
                    <div className="h-4 w-28 bg-gray-100 rounded-lg mb-2" />
                    <div className="h-3 w-20 bg-gray-50 rounded-lg" />
                  </div>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="grid grid-cols-7 gap-1">
                  {['S','M','T','W','T','F','S'].map((d,i) => (
                    <div key={i} className="text-[10px] font-semibold text-gray-400 text-center pb-1">{d}</div>
                  ))}
                  {Array(35).fill(0).map((_,i) => (
                    <div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-semibold ${
                      i === 14 ? 'bg-blue-600 text-white shadow-sm' :
                      [10,11,12,17,18,19,24,25,26].includes(i) ? 'bg-blue-50 text-blue-600' :
                      'text-gray-300'
                    }`}>
                      {i < 31 ? i + 1 : ''}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-auto">
                  <div className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg text-center">9:00 AM</div>
                  <div className="flex-1 px-3 py-2 bg-gray-50 text-gray-400 text-xs font-medium rounded-lg text-center">9:30 AM</div>
                  <div className="flex-1 px-3 py-2 bg-gray-50 text-gray-400 text-xs font-medium rounded-lg text-center">10:00 AM</div>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-2 -left-4 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <svg width="16" height="16" fill="none" stroke="#10B981" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Booking Confirmed</p>
                <p className="text-[10px] text-gray-400">Just now</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Features Section ── */}
      <section id="about" className="py-28 px-6 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mt-3">
              Everything you need to{' '}
              <span className="gradient-text">schedule smarter</span>
            </h2>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed">
              Stop the email ping-pong. Set your rules once and let people book you automatically.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((card, i) => (
              <div key={i} className="card p-7 flex flex-col group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className={`bg-gradient-to-br ${card.gradient} bg-clip-text text-transparent`}>
                    {card.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed flex-1 text-[15px]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Steps Section ── */}
      <section id="steps" className="py-28 px-6 md:px-10 bg-gray-50/50">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">How it works</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">Three steps to effortless scheduling</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">Set up your availability once and let the calendar do the heavy lifting.</p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-md flex items-center justify-center text-[#0066FF] mb-6 group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300">
                {s.icon}
              </div>
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Step {s.num}</span>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{s.title}</h3>
              <p className="text-gray-500 leading-relaxed text-[15px]">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Contact Section ── */}
      <section id="contact" className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col md:flex-row gap-16">

          <div className="flex-1">
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Get in Touch</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-6">
              We&apos;d love to hear from you
            </h2>
            <p className="text-gray-500 text-lg mb-10 max-w-md leading-relaxed">
              Have questions, feedback, or feature requests? Reach out and we&apos;ll get back to you quickly.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 flex-shrink-0">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                  <a href="mailto:deepanshusingla0746@gmail.com" className="text-[#0066FF] hover:underline font-medium text-[15px]">
                    deepanshusingla0746@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Live Support</h3>
                  <p className="text-gray-500 text-[15px]">Typical response time under 2 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full max-w-md">
            <form className="card p-8 shadow-xl shadow-gray-100/60 border-gray-100" onSubmit={handleContactSubmit}>

              {status && (
                <div className={`p-4 rounded-xl text-sm font-medium mb-6 flex items-center gap-2 ${status.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
                  {status.type === 'success' ? (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  )}
                  {status.text}
                </div>
              )}

              <div className="flex gap-3 mb-6">
                <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold border px-4 py-2.5 rounded-xl transition-all ${contactForm.type === 'feedback' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <input type="radio" name="type" value="feedback" checked={contactForm.type === 'feedback'} onChange={() => setContactForm(p => ({...p, type: 'feedback'}))} className="hidden" />
                  Feedback
                </label>
                <label className={`flex-1 flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold border px-4 py-2.5 rounded-xl transition-all ${contactForm.type === 'contact' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <input type="radio" name="type" value="contact" checked={contactForm.type === 'contact'} onChange={() => setContactForm(p => ({...p, type: 'contact'}))} className="hidden" />
                  Contact
                </label>
              </div>

              <div className="space-y-4">
                {contactForm.type === 'contact' && (
                  <div>
                    <label className="label">Your Name</label>
                    <input type="text" required={contactForm.type === 'contact'} className="field" placeholder="Jane Doe" value={contactForm.name || ''} onChange={e => setContactForm(p => ({...p, name: e.target.value}))} />
                  </div>
                )}

                <div>
                  <label className="label">Your Email</label>
                  <input type="email" required className="field" placeholder="you@email.com" value={contactForm.email} onChange={e => setContactForm(p => ({...p, email: e.target.value}))} />
                </div>

                {contactForm.type === 'feedback' && (
                  <div>
                    <label className="label">Rating</label>
                    <div className="flex gap-1.5">
                       {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setContactForm(p => ({...p, rating: star}))}
                            className={`text-2xl hover:scale-125 transition-all duration-200 ${
                              (contactForm.rating || 0) >= star ? 'text-amber-400' : 'text-gray-200 hover:text-amber-300'
                            }`}
                          >
                            ★
                          </button>
                       ))}
                    </div>
                  </div>
                )}

                {contactForm.type === 'feedback' && (
                  <div>
                    <label className="label">Topic</label>
                    <select className="select-field" value={contactForm.topic || ''} onChange={e => setContactForm(p => ({...p, topic: e.target.value}))}>
                      <option value="">Select a topic (Optional)</option>
                      <option value="ui">User Interface</option>
                      <option value="performance">Performance</option>
                      <option value="new_feature">New Feature</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="label">Message</label>
                  <textarea required className="field resize-none h-32" placeholder={contactForm.type === 'feedback' ? "Tell us what you're thinking..." : "How can we help you?"} value={contactForm.message} onChange={e => setContactForm(p => ({...p, message: e.target.value}))} />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full py-3 rounded-xl mt-2">
                  {submitting ? (
                    <><span className="spinner" /> Sending...</>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-50 border-t border-gray-100 py-14 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="w-7 h-7 bg-gradient-to-br from-[#0066FF] to-[#4F46E5] rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">S</div>
            <span className="font-bold text-gray-900">SlotSync</span>
          </div>
          <p className="text-sm text-gray-400">© 2026 SlotSync Platform. Built with Next.js, Tailwind CSS, and Node.js.</p>
          <div className="flex justify-center gap-6 mt-5 text-sm text-gray-400">
            <Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link>
            <a href="#about" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
