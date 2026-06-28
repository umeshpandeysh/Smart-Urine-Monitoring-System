import type { Metadata } from 'next';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — UroSense',
  description: 'UroSense privacy policy. Learn how we handle your health data, our zero-persistent storage model, and your rights as a patient.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />
      <main className="pt-32 pb-24 max-w-3xl mx-auto px-6 space-y-12">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B1B33] tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            Privacy Policy
          </h1>
          <p className="text-sm text-[#475569] leading-relaxed">
            Last updated: June 2025
          </p>
        </div>

        <div className="space-y-8 text-[#475569] text-base leading-relaxed divide-y divide-gray-100">
          {[
            {
              title: 'Data Collection',
              body: 'UroSense operates on a zero-persistent storage model. Sensor readings are processed ephemerally on the terminal and are never stored on device hardware. Data is linked to your session only after explicit mobile OTP verification by you.',
            },
            {
              title: 'How We Use Your Data',
              body: 'Your biological data is used exclusively to generate your personal health report and populate your private wellness journal. We do not sell, share, or transmit your data to third parties, advertisers, or insurance providers.',
            },
            {
              title: 'Data Security',
              body: 'All data in transit is encrypted using AES-256 protocols. Reports are linked to your authenticated session identifier only. Session tokens expire automatically. No raw biometric data is stored on any UroSense kiosk hardware.',
            },
            {
              title: 'Your Rights',
              body: 'You may request complete deletion of your health journal at any time through the Patient Portal settings. You may also download a full export of your data as a PDF. We comply with DISHA (Digital Information Security in Healthcare Act) and applicable Indian data privacy regulations.',
            },
            {
              title: 'Contact',
              body: 'For privacy concerns, contact our Data Protection Officer at privacy@urosense.health. We respond to all privacy requests within 72 hours.',
            },
          ].map((section) => (
            <div key={section.title} className="pt-8 space-y-2">
              <h2 className="font-bold text-[#0B1B33] text-lg"
                style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                {section.title}
              </h2>
              <p>{section.body}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
