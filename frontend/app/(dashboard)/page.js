// app/(dashboard)/page.js
// Redirect the root URL to /dashboard
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
}
