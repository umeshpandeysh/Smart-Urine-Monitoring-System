# UroSense Phase 17 Landing Page Implementation
*Version 1.0.0 — Production next.js 15 app router architecture & high-fidelity marketing components*

This document defines the complete production-grade implementation details for the **UroSense** landing page. Built on **Next.js 15 App Router, TypeScript, TailwindCSS v3.4, and Framer Motion**, this implementation establishes a premium, clinical-grade public health infrastructure presence designed to satisfy government procurement officers, enterprise healthcare directors, and Series A investors.

---

# 1. Route & File Structure

The marketing layout operates under a grouped marketing route group `(marketing)` to separate it from the main user and admin portals.

```
src/
└── app/
    └── (marketing)/
        ├── layout.tsx      # Frosted navbar, footer, container styling
        ├── page.tsx        # Landing page entry orchestrating sections
        ├── Hero.tsx
        ├── ProductOverview.tsx
        ├── UserJourney.tsx
        ├── Analytics.tsx
        ├── FAQ.tsx
        └── Contact.tsx
```

---

# 2. Main Page Orchestration (`src/app/(marketing)/page.tsx`)

This is the main server-side entry point for the landing page. It defines global metadata, structured JSON-LD data for SEO, and imports the section components.

```tsx
import { Metadata } from 'next';
import Hero from './Hero';
import ProductOverview from './ProductOverview';
import UserJourney from './UserJourney';
import Analytics from './Analytics';
import FAQ from './FAQ';
import Contact from './Contact';

export const metadata: Metadata = {
  title: 'UroSense — Autonomous Diagnostic Layer for Population Health',
  description: 'Deploying non-invasive, AI-driven biomonitoring infrastructure inside the world’s major airports, transit hubs, hospitals, and smart cities.',
  alternates: {
    canonical: 'https://urosense.com',
  },
  openGraph: {
    title: 'UroSense — Autonomous Diagnostic Layer for Population Health',
    description: 'Deploying non-invasive, AI-driven biomonitoring infrastructure inside the world’s major airports, transit hubs, hospitals, and smart cities.',
    url: 'https://urosense.com',
    siteName: 'UroSense',
    images: [
      {
        url: 'https://urosense.com/static/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UroSense Public Health Diagnostic Infrastructure',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UroSense — Autonomous Diagnostic Layer for Population Health',
    description: 'Deploying non-invasive, AI-driven biomonitoring infrastructure inside the world’s major airports, transit hubs, hospitals, and smart cities.',
    images: ['https://urosense.com/static/og-image.jpg'],
  },
};

export default function MarketingPage() {
  // Structured JSON-LD Data for search engines (Government & Institutional search optimization)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "UroSense Inc.",
    "url": "https://urosense.com",
    "logo": "https://urosense.com/static/logo.png",
    "description": "Developer of automated non-invasive physical health monitoring infrastructure and preventive clinical telemetry layers for smart cities and medical facilities.",
    "knowsAbout": ["Urinalysis", "Preventive Medicine", "Biometric Telemetry", "Medical IoT", "Population Health"],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative bg-background text-foreground overflow-hidden">
        {/* Decorative background gradients for dark-mode depth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[600px] pointer-events-none overflow-hidden opacity-30 select-none">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[140px]" />
        </div>

        <Hero />
        <ProductOverview />
        <UserJourney />
        <Analytics />
        <FAQ />
        <Contact />
      </main>
    </>
  );
}
```

---

# 3. High-Fidelity React Component Implementations

These components utilize **Framer Motion** for premium micro-interactions and follow standard layouts.

## 3.1 Hero Component (`src/app/(marketing)/Hero.tsx`)

```tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-6 lg:px-8 border-b border-border">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Staggered Typography */}
        <motion.div 
          className="lg:col-span-6 space-y-8 text-left z-10"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Infrastructure Specification v1.1 Active
          </motion.div>

          <motion.h1 
            variants={itemVariants} 
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-none text-foreground"
          >
            The Autonomous Diagnostic Layer for <span className="text-primary bg-clip-text">Population Health.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-muted-foreground max-w-xl font-normal leading-relaxed"
          >
            Deploying non-invasive, AI-driven biomonitoring infrastructure inside the world’s major airports, transit networks, and smart cities. Continuous screening for early metabolic, renal, and infectious disease signals, at scale.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
          >
            <Link 
              href="#contact" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-glow"
            >
              Deploy Infrastructure
            </Link>
            <Link 
              href="#technology" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-border bg-card/50 text-foreground font-semibold text-sm hover:bg-muted active:scale-[0.98] transition-all duration-200"
            >
              Access Technical Specification
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={itemVariants} className="pt-8 border-t border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Institutional Compliance Standards
            </p>
            <div className="flex flex-wrap gap-4 opacity-60">
              <span className="px-3 py-1 rounded border border-border text-[10px] font-mono font-bold tracking-wider">HIPAA COMPLIANT</span>
              <span className="px-3 py-1 rounded border border-border text-[10px] font-mono font-bold tracking-wider">SOC 2 TYPE II</span>
              <span className="px-3 py-1 rounded border border-border text-[10px] font-mono font-bold tracking-wider">FDA REGISTERED</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Premium WebGL Render Placeholder / Hardware Visualizer */}
        <motion.div 
          className="lg:col-span-6 flex justify-center z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <div className="relative w-full max-w-[500px] aspect-square rounded-2xl border border-border bg-gradient-to-br from-card/80 to-muted/20 backdrop-blur-md p-6 flex flex-col justify-between overflow-hidden group shadow-lg">
            {/* Visual grid overlay to represent CAD precision */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-mono text-muted-foreground uppercase">IoT Node: Standard Enclosure</p>
                <h3 className="font-display font-semibold text-lg">UroSense-T20</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-mono font-bold uppercase tracking-wider">
                Online & Calibrated
              </span>
            </div>

            {/* Glowing cyan concentric scanner rings */}
            <div className="relative flex items-center justify-center w-full aspect-square max-h-[260px] my-4 select-none">
              <div className="absolute w-[200px] h-[200px] rounded-full border border-primary/20 animate-[ping_3s_infinite]" />
              <div className="absolute w-[140px] h-[140px] rounded-full border border-primary/40 animate-[pulse_2s_infinite]" />
              <div className="w-[80px] h-[80px] rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center shadow-glow">
                <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v17.792M14.25 3.104v17.792M3 9.75h18M3 14.25h18" />
                </svg>
              </div>
            </div>

            <div className="flex justify-between text-[11px] font-mono text-muted-foreground pt-4 border-t border-border/50">
              <div>
                <p className="font-semibold text-foreground">500 SCANS</p>
                <p>REAGENT LIFESPAN</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">12V DC / PoE</p>
                <p>POWER INPUT</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

## 3.2 ProductOverview Component (`src/app/(marketing)/ProductOverview.tsx`)

```tsx
'use client';

import { motion } from 'framer-motion';

const FEATURES = [
  {
    title: 'Smart Urinal Sensors',
    description: 'Maintenance-free, non-contact optical sensors measuring turbidity, specific gravity, and fluid dynamics during voiding.',
    stat: '99.98% Hardware Uptime',
  },
  {
    title: 'Edge AI Classification',
    description: 'Calibrated spectral analytics run locally on microcontrollers, performing RGB reagent pad matching in under 2 seconds.',
    stat: 'Local 2s Latency',
  },
  {
    title: 'Secure Health Reports',
    description: 'Biochemical parameters compiled into structured, clinical-grade PDFs, ready to export directly into hospital EHR systems.',
    stat: 'HIPAA compliant PDF',
  },
  {
    title: 'Macro Analytics Engine',
    description: 'Aggregates regional trends into map overlays, helping city administrators track dehydration and health index shifts.',
    stat: 'Cohort Floor: N=50',
  },
];

export default function ProductOverview() {
  return (
    <section className="py-24 px-6 lg:px-8 border-b border-border bg-card/20 relative">
      <div className="max-w-7xl w-full mx-auto space-y-16">
        
        <div className="max-w-3xl text-left space-y-4">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Platform Core Capability</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
            Integrated Diagnostics. Institutional Scale.
          </h2>
          <p className="text-muted-foreground max-w-2xl text-sm sm:text-base leading-relaxed">
            UroSense represents the transition from retroactive medical diagnostics to proactive population health infrastructure, keeping public spaces safe, healthy, and informed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, idx) => (
            <motion.div 
              key={idx}
              className="border border-border bg-card/50 backdrop-blur-sm rounded-lg p-6 flex flex-col justify-between hover:border-primary/40 transition-colors duration-300"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="space-y-4">
                <span className="text-[10px] font-mono text-primary font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                  SYSTEM CORE 0{idx + 1}
                </span>
                <h3 className="font-display font-semibold text-lg pt-2">{feat.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
              </div>
              <div className="pt-6 mt-6 border-t border-border/50 text-[11px] font-mono font-semibold text-foreground tracking-wider uppercase">
                {feat.stat}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## 3.3 UserJourney Component (`src/app/(marketing)/UserJourney.tsx`)

```tsx
'use client';

import { motion } from 'framer-motion';

const STEPS = [
  { step: '01', title: 'Restroom Entry', text: 'Secure NFC check-in terminal allows patients to link authentication codes.' },
  { step: '02', title: 'Passive Capture', text: 'Diagnostic sensors record physical volume and spectral data contactlessly.' },
  { step: '03', title: 'QR Generation', text: 'Device generates a temporary, highly secure QR access code on the wall panel.' },
  { step: '04', title: 'SMS OTP Verification', text: 'User scans the QR, enters their phone number, and inputs the one-time passcode.' },
  { step: '05', title: 'Report Delivery', text: 'Encrypted clinical-grade laboratory PDF is securely pushed to the patient portal.' }
];

export default function UserJourney() {
  return (
    <section className="py-24 px-6 lg:px-8 border-b border-border bg-background relative">
      <div className="max-w-7xl w-full mx-auto space-y-16">
        
        <div className="max-w-3xl text-left space-y-4">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Citizen Experience</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
            10 Seconds to Longitudinal Wellness
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed">
            Urinalysis is traditionally slow and invasive. UroSense makes it a seamless, hygienic component of standard everyday sanitation.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative">
          {STEPS.map((s, idx) => (
            <div key={idx} className="relative space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center font-mono text-sm text-primary font-bold shadow-glow">
                  {s.step}
                </span>
                {idx < 4 && (
                  <div className="hidden lg:block absolute top-5 left-[60px] w-[calc(100%-60px)] h-[1px] bg-border" />
                )}
              </div>
              <h3 className="font-display font-semibold text-base pt-2">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## 3.4 Analytics Component (`src/app/(marketing)/Analytics.tsx`)

```tsx
'use client';

import { motion } from 'framer-motion';

const STATS = [
  { label: 'Cumulative Screenings', value: '12,450,210' },
  { label: 'Devices Deployed', value: '3,842' },
  { label: 'Active Smart Cities', value: '64' },
  { label: 'Early Renal Risks Flagged', value: '45,231' }
];

export default function Analytics() {
  return (
    <section className="py-24 px-6 lg:px-8 border-b border-border bg-card/10 relative">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-5 space-y-6">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Efficacy Validation</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
            Preventive Telemetry at Scale
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Our diagnostic nodes operate daily across major travel networks, hospitals, and campuses. By downsampling raw data points and enforcing strict anonymization thresholds, we deliver population insights safely.
          </p>
        </div>

        {/* Large Metric Counters */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {STATS.map((stat, idx) => (
            <motion.div 
              key={idx}
              className="border border-border bg-card/30 rounded-lg p-8 flex flex-col justify-between"
              initial={{ scale: 0.98, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
            >
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                METRIC INDEX 0{idx + 1}
              </p>
              <h3 className="text-3xl sm:text-4xl font-display font-bold tracking-tight text-primary mt-2">
                {stat.value}
              </h3>
              <p className="text-xs font-semibold text-foreground pt-4 mt-4 border-t border-border/30">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## 3.5 FAQ Component (`src/app/(marketing)/FAQ.tsx`)

```tsx
'use client';

import { useState } from 'react';

const FAQS = [
  { q: 'How is physical node hygiene and sanitization maintained?', a: 'Every UroSense node features automated flushing cycles and self-cleaning hydrophobic optical coatings, running automatically after every void event to ensure zero sample carry-over.' },
  { q: 'Who retains ownership of the biological and telemetry data?', a: 'The individual user owns their medical health records. UroSense acts as a data custodian. Personal data is isolated under HIPAA guidelines, and users can opt-in or withdraw consent at any time.' },
  { q: 'What compliance certifications has the hardware achieved?', a: 'UroSense hardware is FDA Class I Registered, holds the CE Mark for smart infrastructure installations, and is certified compliant under SOC 2 Type II and HIPAA frameworks.' },
  { q: 'Does UroSense link biometric results to credit cards or payment systems?', a: 'No. Biometric data is strictly separated from financial payment details. User profiles are verified using secure OTP checks over SMS, keeping transactions completely anonymous.' },
  { q: 'How are the hardware devices retrofitted into existing plumbing?', a: 'UroSense nodes feature standard thread fittings compatible with GSA schedule public urinals and wall pipes. They require standard 12V DC power inputs or Power-over-Ethernet (PoE).' },
  { q: 'What is the lifespan of the diagnostic reagent cartridges?', a: 'Each cartridge supports up to 500 scans. Fleet managers receive automated low-chemical alerts via the operations console when cartridges drop below 10% capacity.' },
  { q: 'What biomarkers does the edge ML engine classify?', a: 'The spectral sensor reads pH levels, specific gravity (hydration), ketones (metabolic stress), protein (renal index), and indicators of hematuria or infection.' },
  { q: 'How is user data protected against intercept during wireless transit?', a: 'All data is encrypted at the edge using AES-256 before transmission over secure, authenticated TLS channels (MQTT/HTTPS) directly to our AWS connection pool.' },
  { q: 'Is there a minimum cohort size for mapping community wellness insights?', a: 'Yes. To protect patient privacy and comply with GDPR, UroSense enforces an anonymization floor of 50 active screenings per location per hour before coordinates are plotted on public heatmaps.' },
  { q: 'Can the sensor detect cheated or non-urine fluid inputs?', a: 'Yes. The optical turbidity and specific gravity sensors run real-time consistency checks, automatically flagging and discarding non-urine samples.' },
  { q: 'How do clinical physicians access patient report files?', a: 'Patients can generate password-protected, encrypted download links or authorize clinicians mapped to their specific location roster to review reports.' },
  { q: 'What is the role structure used for municipal administrators?', a: 'UroSense utilizes RBAC: Users (public screening), Operators (device fleet maintenance), Admins (clinical report audits), and Super Admins (global configuration).' },
  { q: 'Does UroSense support integration with EHR hospital software?', a: 'Yes. The UroSense platform provides HL7 and FHIR API connectors, allowing clinical reports to sync directly into Epic, Cerner, and other EHR systems.' },
  { q: 'What is the default data retention policy for raw telemetry?', a: 'Raw spectral sensor waveforms are retained for 30 days during clinical analysis. Post-processing, the Triton AI engine encrypts the biomarker details and raw values are purged.' },
  { q: 'How does the hardware handle connection dropouts in transit hubs?', a: 'The ESP32 microcontroller features local flash memory caching, storing up to 100 scans locally and flushing them automatically once network connectivity is re-established.' }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 lg:px-8 border-b border-border bg-background relative">
      <div className="max-w-4xl w-full mx-auto space-y-12">
        
        <div className="text-center space-y-4">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Procurement FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
            Technical & Compliance Inquiries
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx} 
              className="border border-border bg-card/20 rounded-lg overflow-hidden transition-colors duration-200"
            >
              <button
                className="w-full text-left px-6 py-4 flex justify-between items-center font-display font-semibold text-sm sm:text-base text-foreground hover:bg-muted/40 transition-colors"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <span>{faq.q}</span>
                <span className="text-primary text-xl ml-4 select-none">
                  {openIdx === idx ? '−' : '+'}
                </span>
              </button>
              
              {openIdx === idx && (
                <div className="px-6 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-4 bg-card/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## 3.6 Contact Component (`src/app/(marketing)/Contact.tsx`)

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const contactFormSchema = z.zod.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid work email'),
  organizationType: z.enum(['AIRPORT', 'MUNICIPALITY', 'HOSPITAL', 'CAMPUS', 'OTHER']),
  inquiryType: z.enum(['DEMO', 'PARTNERSHIP', 'GOVERNMENT']),
  message: z.string().min(10, 'Please provide more details (min 10 chars)'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Submit lead details to Next.js API / Supabase CRM ingestion endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert('Lead inquiry submitted. Our regional infrastructure director will reach out shortly.');
  };

  return (
    <section id="contact" className="py-24 px-6 lg:px-8 bg-card/10 relative">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Office info */}
        <div className="lg:col-span-5 space-y-6">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest">Get in touch</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
            Request an Installation Feasibility Study
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Our engineers provide complete physical plumbing reviews, network mapping support (BLE/Wi-Fi/Cellular), and integration specifications for public hubs.
          </p>

          <div className="pt-6 space-y-4 text-xs font-mono text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground">HEADQUARTERS</p>
              <p>450 Sutter St, San Francisco, CA 94108</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">EMAIL</p>
              <p>infrastructure@urosense.com</p>
            </div>
          </div>
        </div>

        {/* Right Column: Lead Form */}
        <div className="lg:col-span-7 bg-card/50 border border-border rounded-lg p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Name</label>
                <input 
                  type="text" 
                  {...register('name')} 
                  className="w-full h-11 px-3 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                {errors.name && <p className="text-[10px] text-health-critical font-mono">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Work Email</label>
                <input 
                  type="email" 
                  {...register('email')} 
                  className="w-full h-11 px-3 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                {errors.email && <p className="text-[10px] text-health-critical font-mono">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Organization Type</label>
                <select 
                  {...register('organizationType')} 
                  className="w-full h-11 px-3 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="AIRPORT">Airport Terminal Authority</option>
                  <option value="MUNICIPALITY">Municipality / Smart City</option>
                  <option value="HOSPITAL">Hospital Network</option>
                  <option value="CAMPUS">University Campus</option>
                  <option value="OTHER">Other Enterprise Campus</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Inquiry Type</label>
                <select 
                  {...register('inquiryType')} 
                  className="w-full h-11 px-3 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="DEMO">Request Pilot Demo</option>
                  <option value="PARTNERSHIP">Partnership Inquiry</option>
                  <option value="GOVERNMENT">Government Procurement (GSA)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground uppercase tracking-wide">Message details</label>
              <textarea 
                {...register('message')} 
                rows={4}
                className="w-full p-3 rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              {errors.message && <p className="text-[10px] text-health-critical font-mono">{errors.message.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-11 inline-flex items-center justify-center bg-primary text-primary-foreground font-semibold text-sm rounded hover:brightness-110 active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting request...' : 'Request Feasibility Review'}
            </button>

          </form>
        </div>
      </div>
    </section>
  );
}
```

---

# 4. Motion & Animation Strategy

To mirror the Apple and Stripe layouts, all animations use short duration, spring-type curves rather than linear loops.

### 4.1 Global Section Transitions
As pages load, components stagger their vertical layouts.
*   **Page Mount**: The entire viewport fades in over 300ms using `ease-out-expo`.
*   **Staggered Scroll Reveals**: Sections use Framer Motion's `whileInView` with a offset constraint:
    ```typescript
    export const scrollRevealVariants = {
      initial: { opacity: 0, y: 15 },
      animate: { 
        opacity: 1, 
        y: 0, 
        transition: { 
          duration: 0.5, 
          ease: [0.16, 1, 0.3, 1] 
        } 
      }
    };
    ```

### 4.2 Reagent Strip Scanning Animation
When highlighting the "How UroSense Works" optical scanning phase, the visual strip renders a sweeping linear gradient glow (representing the optical array pass):
```css
@keyframes sweep {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(200%); }
}

.scanner-beam {
  background: linear-gradient(to bottom, transparent, hsl(var(--primary)), transparent);
  animation: sweep 2.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
}
```

---

# 5. Web Performance Strategy (Lighthouse > 95)

To maintain instant PageSpeed metrics on mobile devices over cellular networks, the landing page layout implements strict runtime controls.

### 5.1 Optimization Rules

1.  **Code Splitting via Next.js Dynamic Imports**:
    Heavy elements (such as chart libraries and interactive WebGL 3D model loaders) are loaded lazily. They are omitted from the initial HTML chunk:
    ```typescript
    import dynamic from 'next/dynamic';

    const DynamicTelemetryChart = dynamic(
      () => import('@/components/charts/telemetry-chart'),
      { ssr: false, loading: () => <div className="h-80 bg-muted/20 animate-pulse rounded-lg" /> }
    );
    ```
2.  **Next.js 15 Image Optimization**:
    All static brand graphics use the `next/image` component to enforce webp conversions and device-specific resizing:
    ```tsx
    import Image from 'next/image';

    <Image
      src="/static/enclosure.jpg"
      alt="UroSense Hardware Enclosure"
      width={500}
      height={500}
      priority={true} // Priority loading on hero assets
      className="object-cover rounded-lg"
    />
    ```
3.  **Third-Party Script Isolation**:
    Analytical tracking scripts (like Google Analytics or Hotjar) use the `next/script` component with the `lazyOnload` loading strategy, keeping the browser's thread clear during page paint.
