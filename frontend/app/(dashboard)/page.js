'use client';
// app/(dashboard)/page.js — Landing Page at /

import Link from 'next/link';
import { useState, useEffect } from 'react';

/* ── Feature cards data ─────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="#006BFF" strokeWidth="1.75" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    title: 'Event Types',
    desc: 'Create custom event types with unique booking links. Set durations, colours, and descriptions.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="#10B981" strokeWidth="1.75" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: 'Smart Availability',
    desc: 'Define your weekly hours once. Slots outside your schedule are automatically blocked.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="#8B5CF6" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Instant Booking',
    desc: 'Invitees pick a slot, fill in their details, and get confirmed instantly — no back-and-forth.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="#F59E0B" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
    title: 'No Double Booking',
    desc: 'Overlap detection prevents two people from booking the same slot simultaneously.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="#EF4444" strokeWidth="1.75" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Meetings Dashboard',
    desc: 'See all upcoming meetings at a glance. Cancel with one click if plans change.',
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" stroke="#06B6D4" strokeWidth="1.75" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: 'Timezone Aware',
    desc: 'Set your timezone in one place. All bookings respect your local working hours.',
  },
];

/* ── Steps ──────────────────────────────────────── */
const STEPS = [
  { num: '01', title: 'Create an Event Type', desc: 'Name it, set the duration, pick a colour. Your booking link is ready instantly.' },
  { num: '02', title: 'Set Your Availability', desc: 'Choose which days and hours you\'re open. Weekdays 9–5 or custom — up to you.' },
  { num: '03', title: 'Share Your Link', desc: 'Send /book/your-event to anyone. They pick a time, you get the meeting.' },
];

/* ── Stats ──────────────────────────────────────── */
const STATS = [
  { value: '3 min', label: 'Setup time' },
  { value: '0', label: 'Double bookings' },
  { value: '100%', label: 'Free to use' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* ── NAV ─────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#006BFF] rounded-[10px] flex items-center justify-center shadow-sm">
              <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-[17px] tracking-tight">SlotSync</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium">How it works</a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="hidden sm:inline-flex text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Sign in
            </Link>
            <Link href="/dashboard" className="btn-primary text-sm px-4 py-2">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6 text-center relative overflow-hidden">
        {/* Background gradient blob */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-50/80 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
          <div className="w-2 h-2 bg-[#006BFF] rounded-full animate-pulse" />
          <span className="text-sm font-medium text-[#006BFF]">Calendly-style scheduling — free forever</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-6 max-w-4xl mx-auto">
          Schedule meetings
          <span className="text-[#006BFF]"> effortlessly</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Create event types, set your availability, and share your booking link. Your invitees pick a slot — you just show up.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/dashboard"
            className="btn-primary px-8 py-3.5 text-base rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Start Scheduling Free
          </Link>
          <Link
            href="/book/30-min-meeting"
            className="btn-secondary px-8 py-3.5 text-base rounded-xl"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
            </svg>
            See Live Demo
          </Link>
        </div>

        {/* Stats bar */}
        <div className="inline-flex items-center divide-x divide-gray-200 bg-white border border-gray-200 rounded-2xl shadow-sm px-2">
          {STATS.map((s, i) => (
            <div key={i} className="px-8 py-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to get booked</h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">Built for professionals who want to eliminate the scheduling back-and-forth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Up and running in minutes</h2>
            <p className="text-lg text-gray-500">Three simple steps to start accepting bookings.</p>
          </div>

          <div className="space-y-8">
            {STEPS.map((s, i) => (
              <div key={i} className="flex gap-8 items-start">
                {/* Number */}
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-[#006BFF]">{s.num}</span>
                </div>
                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{s.desc}</p>
                  {/* Connector line (except last) */}
                  {i < STEPS.length - 1 && (
                    <div className="mt-6 ml-[-42px] w-px h-8 bg-gradient-to-b from-blue-200 to-transparent hidden sm:block" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────── */}
      <section className="py-24 px-6 bg-gradient-to-br from-[#006BFF] to-[#0052CC]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to simplify your scheduling?
          </h2>
          <p className="text-blue-100 mb-10 text-lg">
            Set up your scheduling page in under 3 minutes. No credit card required.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-[#006BFF] font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-xl"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Open Dashboard
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#006BFF] rounded-[8px] flex items-center justify-center">
              <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900">SlotSync</span>
          </div>

          <p className="text-sm text-gray-400">
            © 2026 SlotSync · Built as a placement assignment · Calendly Clone
          </p>

          <div className="flex items-center gap-5">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Dashboard</Link>
            <Link href="/book/30-min-meeting" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">Book a Demo</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
