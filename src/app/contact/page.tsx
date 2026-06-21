'use client';

import React, { useState } from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Mail, Phone, MessageSquare, Send, CheckCircle2, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    // Simulate submission — replace with real API call
    await new Promise(r => setTimeout(r, 1200));
    setStatus('sent');
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-manrope), sans-serif' }}>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#2563EB] text-sm font-semibold">
              <MessageSquare className="w-4 h-4" /> Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B1B33] tracking-tight">
              Get in Touch
            </h1>
            <p className="text-[#6B7280] text-lg leading-relaxed">
              Have a question about UroSense, your health report, or our services? We&apos;re here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Left — Info Cards */}
            <div className="lg:col-span-2 space-y-5">
              {[
                {
                  icon: Mail,
                  color: '#2563EB',
                  bg: '#EFF6FF',
                  title: 'Email Support',
                  detail: 'support@urosense.health',
                  note: 'We respond within 24 hours',
                },
                {
                  icon: Phone,
                  color: '#0D9488',
                  bg: '#F0FDFA',
                  title: 'Phone Support',
                  detail: '+91 1800 000 0000',
                  note: 'Mon–Sat, 9am to 6pm IST',
                },
                {
                  icon: MapPin,
                  color: '#7C3AED',
                  bg: '#F5F3FF',
                  title: 'Headquarters',
                  detail: 'New Delhi, India',
                  note: 'Serving pan-India locations',
                },
                {
                  icon: Clock,
                  color: '#D97706',
                  bg: '#FFFBEB',
                  title: 'Response Time',
                  detail: 'Within 24 Business Hours',
                  note: 'For medical concerns, call directly',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-0.5">{item.title}</p>
                    <p className="font-bold text-[#0B1B33] text-base">{item.detail}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                {status === 'sent' ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-[#0D9488]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0B1B33]">Message Sent!</h3>
                    <p className="text-[#6B7280] max-w-sm mx-auto">
                      Thank you for reaching out. Our team will respond to your query within 24 hours.
                    </p>
                    <button
                      onClick={() => { setForm({ name: '', email: '', phone: '', message: '' }); setStatus('idle'); }}
                      className="mt-4 px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-[#0B1B33] hover:bg-gray-50 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-[#0B1B33]">Send Us a Message</h2>
                      <p className="text-sm text-[#6B7280] mt-1">Fill in the form and we&apos;ll get back to you shortly.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-[#0B1B33] mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="name" name="name" type="text" required
                          value={form.name} onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0B1B33] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-[#0B1B33] mb-1.5">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="email" name="email" type="email" required
                          value={form.email} onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0B1B33] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-[#0B1B33] mb-1.5">
                        Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        id="phone" name="phone" type="tel"
                        value={form.phone} onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0B1B33] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-[#0B1B33] mb-1.5">
                        Message <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="message" name="message" required rows={5}
                        value={form.message} onChange={handleChange}
                        placeholder="Tell us how we can help you — ask about your report, our services, or finding a UroSense location near you."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0B1B33] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] text-white font-bold text-base hover:bg-[#1d4ed8] shadow-md shadow-blue-200 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {status === 'sending' ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                      ) : (
                        <><Send className="w-4 h-4" />Submit Request</>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      Your personal information is kept private and never shared with third parties.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
