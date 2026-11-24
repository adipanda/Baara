import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AFRIWORK (Baara) — Pan-African Freelance & Service Marketplace',
  description:
    'Hire verified African digital freelancers and local service providers with Mobile Money & Card escrow.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#ea580c',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
