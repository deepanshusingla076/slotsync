// app/book/[slug]/confirmation/page.js
// Server Component — reads booking details from URL query params.
// Shown after a successful booking is submitted.

import Link from 'next/link';

// Format "YYYY-MM-DD" → "Thursday, May 1, 2025"
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

// Format "HH:MM" → "10:00 AM"
function formatTime(timeStr) {
  if (!timeStr) return '';
  return new Date(`2000-01-01T${timeStr}:00`).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit',
  });
}

export const metadata = {
  title: 'Booking Confirmed — SlotSync',
};

export default function ConfirmationPage({ searchParams }) {
  const { name, email, event, date, time, duration } = searchParams;

  const details = [
    { icon: '👤', label: 'Name',     value: name },
    { icon: '📧', label: 'Email',    value: email },
    { icon: '📌', label: 'Event',    value: event },
    { icon: '📅', label: 'Date',     value: formatDate(date) },
    { icon: '🕐', label: 'Time',     value: `${formatTime(time)}  (${duration} min)` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-md">

        {/* Success icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg width="30" height="30" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">You&apos;re confirmed!</h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          A calendar invitation has been sent to your email address.
        </p>

        {/* Booking detail card */}
        <div className="bg-gray-50 rounded-xl p-5 space-y-4 mb-8">
          {details.map(d => d.value && (
            <div key={d.label} className="flex items-start gap-3">
              <span className="text-lg leading-tight">{d.icon}</span>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-0.5">{d.label}</p>
                <p className="text-sm font-medium text-gray-900">{d.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full text-center btn-primary py-3 rounded-xl"
          >
            Back to Home
          </Link>
          <p className="text-xs text-gray-400 text-center">
            Need to reschedule? Contact the host directly.
          </p>
        </div>

      </div>

      {/* Powered by */}
      <p className="mt-6 text-xs text-gray-400">
        Powered by <span className="font-semibold text-gray-500">SlotSync</span>
      </p>

    </div>
  );
}
