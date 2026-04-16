// app/layout.js
// Root layout — wraps every page in the app.
// Inter font is loaded here once via next/font.

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'SlotSync — Scheduling Made Simple',
  description: 'A Calendly-style scheduling app. Create event types, set availability, and let people book time with you.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
