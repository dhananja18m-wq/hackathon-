import type { Metadata } from 'next';
import './globals.css';
import { ShellLayout } from '@/components/layout/ShellLayout';

export const metadata: Metadata = {
  title: 'reboard — SECONDLIFE AI Component Intelligence Platform',
  description: "Don't throw it away. Build something new. AI-powered e-waste reuse, component intelligence, and project discovery.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="h-full bg-[#F6F5EE] antialiased">
        <ShellLayout>{children}</ShellLayout>
      </body>
    </html>
  );
}
