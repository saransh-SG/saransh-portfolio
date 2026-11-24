import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Saransh Goswami | AI + Backend Engineer', description: 'AI and backend engineer building intelligent systems, distributed platforms, and production-grade software.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
