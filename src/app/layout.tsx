import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'UroSense — AI-Powered Urine Health Monitoring',
    template: '%s | UroSense',
  },
  description:
    'UroSense is an AI-powered health monitoring ecosystem providing real-time urinalysis insights for individuals, clinicians, and smart city operators.',
  keywords: [
    'urinalysis',
    'health monitoring',
    'IoT health',
    'smart city',
    'preventive health',
    'urine analysis',
    'AI health',
  ],
  authors: [{ name: 'UroSense', url: 'https://urosense.com' }],
  creator: 'UroSense',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'UroSense',
    title: 'UroSense — AI-Powered Urine Health Monitoring',
    description:
      'Deploying non-invasive, AI-driven biomonitoring infrastructure inside airports, transit hubs, hospitals, and smart cities.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
