'use client';

import Link from 'next/link';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { useEffect, useState } from 'react';
import * as api from '@/lib/api';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const BRAND_PILLS = ['Google Calendar', 'Outlook', 'Zoom', 'Teams', 'Meet', 'Slack'];
const STAGGER = ['stagger-1', 'stagger-2', 'stagger-3', 'stagger-4'];

const FEATURE_CARDS = [
  { title: 'Instant booking links', body: 'Create and share personalized booking pages in seconds.' },
  { title: 'Smart availability', body: 'Set your working hours and avoid double-bookings automatically.' },
  { title: 'Meeting reminders', body: 'Reduce no-shows with clear, timely reminders for attendees.' },
  { title: 'Custom event types', body: 'Offer 15-minute, 30-minute, or custom sessions with ease.' },
  { title: 'Simple dashboard', body: 'Track upcoming and past meetings from one organized workspace.' },
  { title: 'Built for speed', body: 'Clean UX and quick setup so teams can start booking instantly.' },
];

const STEPS = [
  {
    title: 'Create event types',
    body: 'Define sessions and durations that match your workflow.',
  },
  {
    title: 'Share your link',
    body: 'Send one booking URL to clients or teammates.',
  },
  {
    title: 'Get booked',
    body: 'Attendees pick a slot and meetings get scheduled quickly.',
  },
];

export default function LandingPage() {
  const [stats, setStats] = useState({
    eventTypes: 0,
    meetings: 0,
    loading: true,
  });

  const [formType, setFormType] = useState('feedback');
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    topic: '',
    rating: 0,
    message: '',
  });

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      try {
        const [eventTypesRes, meetingsRes] = await Promise.all([
          api.getEventTypes(),
          api.getUpcomingMeetings(),
        ]);
        if (!mounted) return;
        setStats({
          eventTypes: Array.isArray(eventTypesRes) ? eventTypesRes.length : 0,
          meetings: Array.isArray(meetingsRes) ? meetingsRes.length : 0,
          loading: false,
        });
      } catch {
        if (!mounted) return;
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    loadStats();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);

    try {
      await api.submitContact({
        type: formType,
        name: form.name,
        email: form.email,
        topic: formType === 'feedback' ? form.topic : '',
        rating: formType === 'feedback' ? form.rating : undefined,
        message: form.message,
      });

      setStatus({ type: 'success', text: 'Thanks! Your message was sent successfully.' });
      setForm({ name: '', email: '', topic: '', rating: 0, message: '' });
    } catch (error) {
      setStatus({ type: 'error', text: error.message || 'Failed to send message.' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <main className={`${jakarta.className} min-h-screen bg-white text-slate-900`}>
      <nav className="sticky top-0 z-40 border-b border-blue-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold text-white">
              S
            </div>
            <span className="text-base font-bold text-slate-900">SlotSync</span>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition-colors hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-blue-600">How it works</a>
            <a href="#contact" className="transition-colors hover:text-blue-600">Contact</a>
            <a href="#faq" className="transition-colors hover:text-blue-600">FAQ</a>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700">
              Go to Dashboard
            </Link>
            <Link href="#contact" className="rounded-full border border-blue-200 px-4 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <header className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_50%)]">
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-5 pb-10 pt-8 md:pt-10 lg:grid-cols-2">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              scheduling platform
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 md:text-5xl">
              Schedule meetings
              <br />
              <span className="text-blue-600">without back-and-forth</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 md:text-base">
              SlotSync lets you share booking links, manage availability, and keep your calendar organized with a simple and professional experience.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href="/dashboard" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700">
                Start for free
              </Link>
              <Link href="/book/30-min-meeting" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                View booking page
              </Link>
            </div>

            <div className="mt-5 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">Event types</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{stats.loading ? '...' : stats.eventTypes}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">Upcoming meetings</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{stats.loading ? '...' : stats.meetings}</p>
              </div>
            </div>
          </div>

          <div className="animate-slide-in-right">
            <div className="relative mx-auto max-w-[370px] rounded-3xl border border-blue-100 bg-[#f4f6fc] p-3.5 shadow-[0_20px_55px_-40px_rgba(37,99,235,0.5)]">
              <div className="mb-3.5 flex items-center gap-2 border-b border-slate-200 pb-2.5">
                <span className="h-3 w-3 rounded-full bg-red-300" />
                <span className="h-3 w-3 rounded-full bg-amber-300" />
                <span className="h-3 w-3 rounded-full bg-emerald-300" />
                <p className="ml-3 text-xs font-semibold text-slate-500">SlotSync Booking</p>
              </div>

              <div className="mb-3.5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-blue-400/30">
                  s
                </div>
                <div className="space-y-2">
                  <div className="h-3.5 w-24 rounded-full bg-slate-200" />
                  <div className="h-2.5 w-20 rounded-full bg-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-y-2 text-center text-xs font-semibold text-slate-400">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, idx) => (
                  <div key={`${d}-${idx}`}>{d}</div>
                ))}
                {[...Array(31)].map((_, i) => {
                  const date = i + 1;
                  const active = date === 15;
                  const highlighted = [11, 12, 13, 18, 19, 20, 25, 26, 27].includes(date);
                  return (
                    <div key={date} className={`mx-auto flex h-7 w-7 items-center justify-center rounded-lg text-[11px] ${active ? 'bg-blue-600 text-white' : highlighted ? 'bg-blue-100 text-blue-700' : 'text-slate-400'}`}>
                      {date}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3.5 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-blue-100 px-2 py-2 text-center text-sm font-bold text-blue-700">9:00 AM</div>
                <div className="rounded-xl bg-slate-100 px-2 py-2 text-center text-sm font-bold text-slate-400">9:30 AM</div>
                <div className="rounded-xl bg-slate-100 px-2 py-2 text-center text-sm font-bold text-slate-400">10:00 AM</div>
              </div>

              <div className="absolute -bottom-5 -left-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Booking Confirmed</p>
                  <p className="text-[11px] text-slate-500">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="border-y border-slate-100 bg-slate-50/80 py-8">
        <div className="mx-auto max-w-6xl px-5">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Works with your existing tool stack
          </p>
          <div className="mt-5 company-marquee">
            <div className="company-marquee-track">
              {[...BRAND_PILLS, ...BRAND_PILLS].map((brand, idx) => (
                <span key={`${brand}-${idx}`} className="company-pill text-base !text-slate-500">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-5 py-20">
        <div className="max-w-2xl animate-fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Features</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Everything you need for professional scheduling
          </h2>
          <p className="mt-4 text-slate-600">
            Built for service teams, creators, and businesses that want a fast booking flow with clean design.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURE_CARDS.map((feature, i) => (
            <article
              key={feature.title}
              className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg animate-fade-in-up ${STAGGER[i % STAGGER.length]}`}
            >
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="bg-blue-50/60 py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">How it works</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Simple flow, clear outcomes
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((item, idx) => (
              <article
                key={item.title}
                className={`rounded-2xl border border-blue-100 bg-white p-6 shadow-sm animate-fade-in-up ${STAGGER[idx % STAGGER.length]}`}
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {idx + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Contact & Feedback</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Tell us what you need
            </h2>
            <p className="mt-4 text-slate-600">
              Share feedback, ask questions, or request help with your scheduling setup. We will get back quickly.
            </p>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-900">Email:</span> deepanshusingla0746@gmail.com</p>
              <p><span className="font-semibold text-slate-900">Support:</span> Typical response time under 2 hours.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {status && (
              <div className={`mb-5 rounded-xl px-4 py-3 text-sm font-medium ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {status.text}
              </div>
            )}

            <div className="mb-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormType('feedback')}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${formType === 'feedback' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                Feedback
              </button>
              <button
                type="button"
                onClick={() => setFormType('contact')}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${formType === 'contact' ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                Contact
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Your name</label>
                <input
                  className="field"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Jane Doe"
                  required={formType === 'contact'}
                />
              </div>

              <div>
                <label className="label">Your email</label>
                <input
                  type="email"
                  className="field"
                  value={form.email}
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="you@domain.com"
                  required
                />
              </div>

              {formType === 'feedback' && (
                <>
                  <div>
                    <label className="label">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                          className={`text-2xl transition ${form.rating >= star ? 'text-amber-400' : 'text-slate-300 hover:text-amber-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="label">Topic</label>
                    <select
                      className="select-field"
                      value={form.topic}
                      onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
                    >
                      <option value="">Select a topic (optional)</option>
                      <option value="ui">User Interface</option>
                      <option value="performance">Performance</option>
                      <option value="feature">New Feature</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="label">Message</label>
                <textarea
                  className="field h-32 resize-none"
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder={formType === 'feedback' ? 'Tell us what you think...' : 'How can we help you?'}
                  required
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full rounded-xl py-3">
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </section>

      <section id="faq" className="bg-slate-50 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Common questions, clear answers
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: 'Can I create multiple event types?',
                a: 'Yes, create as many event types as needed with custom durations.',
              },
              {
                q: 'Will SlotSync prevent double-booking?',
                a: 'Yes, booked slots are tracked so overlapping bookings are blocked.',
              },
              {
                q: 'Can I share a direct booking link?',
                a: 'Yes, each event type can have its own booking URL for quick sharing.',
              },
            ].map((item) => (
              <div key={item.q} className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-slate-900">{item.q}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-900">SlotSync</p>
            <p className="text-xs text-slate-500">Professional scheduling, simplified.</p>
          </div>
          <div className="flex gap-5 text-sm text-slate-600">
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600">How it works</a>
            <a href="#contact" className="hover:text-blue-600">Contact</a>
            <a href="#faq" className="hover:text-blue-600">FAQ</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
