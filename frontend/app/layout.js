// app/layout.js
// Root layout — wraps every page in the app.

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'SlotSync — Scheduling Made Simple',
  description: 'A Calendly-style scheduling app. Create event types, set your availability, and let people book time with you.',
  keywords: 'scheduling, calendar, booking, meetings, calendly clone',
  authors: [{ name: 'SlotSync' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
