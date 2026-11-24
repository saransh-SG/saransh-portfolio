import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Saransh Goswami | AI Platform & Backend Engineer',
  description: 'Portfolio of Saransh Goswami — AI platform engineering, backend systems, distributed fintech, LLM infrastructure, and intelligent automation.',
  openGraph: {
    title: 'Saransh Goswami | AI Platform & Backend Engineer',
    description: 'Engineering dependable financial platforms, LLM infrastructure, and intelligent automation.',
    type: 'website',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
