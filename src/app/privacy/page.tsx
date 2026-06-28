import type { Metadata } from 'next';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Shield, Lock, CheckCircle2, FileText, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — UroSense',
  description: 'UroSense privacy policy. Learn how we handle your health data, our zero-persistent storage model, and your rights as a user.',
};

export default function PrivacyPage() {
  const summaryTakeaways = [
    { icon: Lock, title: 'Zero-Persistent Hardware Storage', desc: 'Biometric data is processed ephemerally in RAM and wiped from kiosks after session completion.' },
    { icon: Shield, title: 'AES-256 Cryptographic Encryption', desc: 'All data in transit and at rest is protected using medical-grade encryption standards.' },
    { icon: UserCheck, title: 'Full Data Ownership', desc: 'You have complete rights to view, export, or delete your health records at any time.' },
  ];

  const sections = [
    {
      title: '1. Ephemeral Data Capture & Collection',
      body: 'UroSense operates under a strict zero-persistent storage architecture. Biological telemetry captured at public hardware terminals is processed in volatile memory (RAM) and transmitted securely to encrypted cloud databases. No raw biometric sample readings remain on physical kiosk hard drives at any point.',
    },
    {
      title: '2. Purpose of Processing',
      body: 'Your biological trend metrics are utilized exclusively to generate your confidential personal health report and populate your private health journal. UroSense strictly prohibits selling, licensing, or commercializing personal health telemetry to third-party data brokers, advertisers, or insurance providers.',
    },
    {
      title: '3. Cryptographic Security Protocols',
      body: 'All communications between hardware terminals, mobile authentication layers, and database clusters are encrypted via TLS 1.3 and AES-256 cryptographic standards. Access to historical reports requires multi-factor session authentication or mobile OTP validation.',
    },
    {
      title: '4. Regulatory Compliance & User Rights',
      body: 'UroSense complies with India\'s DISHA (Digital Information Security in Healthcare Act) guidelines and applicable data protection frameworks. Users maintain complete autonomy to export their health journal records as signed PDF files or trigger permanent account deletion.',
    },
    {
      title: '5. Data Protection Officer Contact',
      body: 'For questions or formal data privacy requests, please contact our dedicated Data Protection Officer at privacy@urosense.health. Official inquiries receive responses within 72 business hours.',
    },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />
      <main className="pt-28 pb-24 max-w-4xl mx-auto px-6 md:px-12 space-y-12">

        {/* Header */}
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0B1B33] tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            Privacy Policy
          </h1>
          <p className="text-sm font-mono text-[#475569]">
            Effective Date: June 2026 · Standard Privacy Protocol v2.0
          </p>
        </div>

        {/* Quick Summary Banner */}
        <div className="bg-gradient-to-br from-[#EFF6FF] to-[#F8FAFC] border border-blue-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#2563EB] uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Quick Summary & Key Takeaways
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summaryTakeaways.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-2xl p-4 border border-blue-50 space-y-2 shadow-sm">
                  <Icon className="w-5 h-5 text-[#2563EB]" />
                  <h4 className="font-bold text-[#0B1B33] text-xs" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legal Sections */}
        <div className="space-y-8 text-[#475569] text-base leading-relaxed divide-y divide-gray-100">
          {sections.map((section) => (
            <div key={section.title} className="pt-8 space-y-3">
              <h2 className="font-bold text-[#0B1B33] text-xl"
                style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                {section.title}
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-600">
                {section.body}
              </p>
            </div>
          ))}
        </div>

      </main>
      <Footer />
    </div>
  );
}
