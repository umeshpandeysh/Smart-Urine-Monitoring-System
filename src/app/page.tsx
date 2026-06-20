import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UroSense — Autonomous Diagnostic Layer for Population Health',
  description:
    'AI-driven biomonitoring infrastructure inside airports, transit hubs, hospitals, and smart cities. Get real-time urine health insights.',
};

const features = [
  {
    icon: '🔬',
    title: 'Multi-Parameter Analysis',
    description:
      'Simultaneously measures pH, TDS, turbidity, temperature, and 10-parameter colorimetric strip readings in under 60 seconds.',
  },
  {
    icon: '🧠',
    title: 'AI Health Intelligence',
    description:
      'GPT-4o powered health summaries translate raw biomarkers into plain-language insights and personalized recommendations.',
  },
  {
    icon: '⚡',
    title: 'Real-Time Telemetry',
    description:
      'Sub-second device status updates via Supabase Realtime. Live dashboard updates without page refresh.',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    description:
      'Row-Level Security on every table. JWT-based OTP auth. Cryptographically signed PDF reports with QR verification.',
  },
  {
    icon: '🌍',
    title: 'Multi-Tenant Platform',
    description:
      'Supports hospitals, airports, transit hubs, and smart cities in a single unified platform with per-org data isolation.',
  },
  {
    icon: '📊',
    title: 'Smart PDF Reports',
    description:
      'Automated clinical-grade PDF reports with AI summary, parameter charts, trend lines, and HMAC-SHA256 signatures.',
  },
];

const stats = [
  { value: '7', label: 'Sensors per device' },
  { value: '10', label: 'Strip parameters' },
  { value: '<60s', label: 'Analysis time' },
  { value: '99.9%', label: 'Uptime target' },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-sm">U</span>
          </div>
          <span className="font-display font-bold text-xl text-foreground">UroSense</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
          <Link href="https://github.com/umeshpandeysh/Smart-Urine-Monitoring-System" className="hover:text-foreground transition-colors">GitHub</Link>
          <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
        </div>
        <Link
          href="/login"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Get Started
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          AI-Powered Health Monitoring Ecosystem
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
          Smart Urinalysis
          <br />
          <span className="gradient-text">for Everyone</span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed mb-10">
          UroSense deploys ESP32-powered sensor arrays in public restrooms, connecting real-time
          biomarker data to an AI-driven cloud platform. From airports to smart cities, proactive
          health monitoring at scale.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 glow-primary transition-all duration-200 hover:-translate-y-0.5"
          >
            Access Portal
          </Link>
          <Link
            href="https://github.com/umeshpandeysh/Smart-Urine-Monitoring-System"
            className="px-8 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-all duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub →
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-6 text-center card-hover">
              <div className="font-display text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Built for Production
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every layer engineered for reliability, security, and scale — from the ESP32 edge node
            to the cloud-native SaaS platform.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="glass rounded-xl p-6 card-hover">
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            How UroSense Works
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Scan & Analyze', desc: 'User scans QR code. ESP32 sensor array captures 7 physical parameters and reads 10-parameter colorimetric strip.' },
            { step: '02', title: 'AI Processing', desc: 'Raw biomarker data is transmitted to the cloud. AI generates health summary, flags anomalies, and calculates hydration index.' },
            { step: '03', title: 'Insights & Reports', desc: 'User receives signed PDF report, trend charts, and personalized health recommendations through the secure portal.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                <span className="font-mono text-primary font-bold text-lg">{item.step}</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="glass rounded-2xl p-12 text-center glow-primary">
          <h2 className="font-display text-4xl font-bold text-foreground mb-4">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Access the UroSense portal, explore demo data, or deploy the ESP32 firmware to your own hardware.
          </p>
          <Link
            href="/login"
            className="inline-block px-10 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 glow-primary transition-all duration-200 hover:-translate-y-0.5"
          >
            Access UroSense Portal
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 UroSense. Built by <a href="https://github.com/umeshpandeysh" className="text-primary hover:underline">umeshpandeysh</a>.</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-foreground transition-colors">Portal</Link>
            <Link href="https://github.com/umeshpandeysh/Smart-Urine-Monitoring-System" className="hover:text-foreground transition-colors">GitHub</Link>
            <Link href="/admin/dashboard" className="hover:text-foreground transition-colors">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
