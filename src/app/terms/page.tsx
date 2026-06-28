import type { Metadata } from 'next';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { FileText, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — UroSense',
  description: 'UroSense terms of service. Understand the terms governing your use of UroSense health monitoring services.',
};

export default function TermsPage() {
  const summaryTakeaways = [
    { icon: ShieldAlert, title: 'Wellness Indicators Only', desc: 'UroSense provides physiological trend metrics, not formal clinical medical diagnoses.' },
    { icon: CheckCircle2, title: 'Mobile OTP Authentication', desc: 'Access to personal journals is protected via verified one-time mobile passcodes.' },
    { icon: AlertCircle, title: 'Not a Substitue for Doctors', desc: 'Always consult a certified physician regarding physical symptoms or medical concerns.' },
  ];

  const sections = [
    {
      title: '1. Acceptance of Terms',
      body: 'By accessing or utilizing UroSense services — including public kiosk hardware terminals, the digital User Portal, or associated web applications — you agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from utilizing UroSense services.',
    },
    {
      title: '2. Intended Scope & Clinical Boundary',
      body: 'UroSense is an automated wellness monitoring system engineered to provide physiological trend indicators and baseline biological data. Urinalysis metrics do not constitute professional medical advice, formal clinical diagnosis, or laboratory consultation. Users should never use UroSense results as the sole basis for clinical treatment decisions.',
    },
    {
      title: '3. Account Verification & Session Security',
      body: 'Access to your digital health journal requires mobile authentication via encrypted one-time passwords (OTP). Users are responsible for maintaining the confidentiality of their mobile verification codes. Sharing verification credentials with unauthorized third parties is strictly prohibited.',
    },
    {
      title: '4. Intellectual Property Rights',
      body: 'All software algorithms, micro-fluidic hardware designs, spectrograph calibration arrays, trademarks, and visual interfaces associated with UroSense are the exclusive intellectual property of UroSense Platform. Reverse-engineering, unauthorized scraping, or commercial exploitation is prohibited.',
    },
    {
      title: '5. Limitation of Liability',
      body: 'UroSense services and biological trend reports are delivered on an "as is" and "as available" basis. UroSense Platform and its operators assume no liability for individual health outcomes, delayed medical treatments, or external clinical decisions made based on wellness trend indicators.',
    },
    {
      title: '6. Modifications & Contact Information',
      body: 'We reserve the right to revise these Terms of Service to reflect regulatory changes or service enhancements. Material updates will be highlighted in the User Portal. For legal inquiries, contact legal@urosense.health.',
    },
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />
      <main className="pt-28 pb-24 max-w-4xl mx-auto px-6 md:px-12 space-y-12">

        {/* Header */}
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#0D9488]" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#0B1B33] tracking-tight"
            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
            Terms of Service
          </h1>
          <p className="text-sm font-mono text-[#475569]">
            Effective Date: June 2026 · Platform Agreement v2.0
          </p>
        </div>

        {/* Quick Summary Banner */}
        <div className="bg-gradient-to-br from-[#F0FDFA] to-[#F8FAFC] border border-teal-100 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0D9488] uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Quick Summary & Key Takeaways
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {summaryTakeaways.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white rounded-2xl p-4 border border-teal-50 space-y-2 shadow-sm">
                  <Icon className="w-5 h-5 text-[#0D9488]" />
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
