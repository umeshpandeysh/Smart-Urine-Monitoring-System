import type { Metadata } from 'next';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — UroSense',
  description: 'UroSense terms of service. Understand the terms governing your use of UroSense health monitoring services.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />
      <main className="pt-32 pb-24 max-w-3xl mx-auto px-6 space-y-12">
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#0D9488]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#0B1B33] tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            Terms of Service
          </h1>
          <p className="text-sm text-[#475569] leading-relaxed">
            Last updated: June 2025
          </p>
        </div>

        <div className="space-y-8 text-[#475569] text-base leading-relaxed divide-y divide-gray-100">
          {[
            {
              title: 'Acceptance of Terms',
              body: 'By accessing or using UroSense services — including kiosk terminals, the User Portal, or any associated applications — you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.',
            },
            {
              title: 'Intended Use',
              body: 'UroSense is a wellness monitoring tool designed to provide biological trend indicators and baseline wellness data. It is not a substitute for professional medical advice, clinical laboratory diagnosis, or physician consultation. Do not use UroSense results as the sole basis for medical decisions.',
            },
            {
              title: 'Account & Verification',
              body: 'Access to your health journal requires mobile phone number verification via one-time password (OTP). You are responsible for maintaining the security of your phone and OTP codes. Sharing OTP codes with others is prohibited.',
            },
            {
              title: 'Intellectual Property',
              body: 'All content, software, sensor technology, analysis algorithms, and trademarks associated with UroSense are proprietary to UroSense Technologies. Unauthorized reproduction, reverse-engineering, or commercial use is strictly prohibited.',
            },
            {
              title: 'Limitation of Liability',
              body: 'UroSense provides wellness data on an "as is" basis. We are not liable for any health outcomes, medical decisions, or consequential damages arising from use or reliance on UroSense data. Wellness indicators do not constitute clinical diagnoses.',
            },
            {
              title: 'Changes to Terms',
              body: 'We reserve the right to update these terms at any time. Continued use of UroSense services after changes constitutes acceptance of the revised terms. We will notify users of material changes via the User Portal.',
            },
            {
              title: 'Contact',
              body: 'For questions about these terms, contact legal@urosense.health.',
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
