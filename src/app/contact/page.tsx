'use client';

import React, { useState } from 'react';
import Navbar from '@/components/landing/navbar';
import Footer from '@/components/landing/footer';
import { Mail, Phone, Send, CheckCircle2, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', inquiryType: 'General Inquiry', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    await new Promise(r => setTimeout(r, 1000));
    setStatus('sent');
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
      <Navbar />
      <main className="pt-28 pb-24">
        <div className="max-w-6xl mx-auto px-6 md:px-12">

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
              Rapid Response Support
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0B1B33] tracking-tight"
              style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
              Get in Touch with UroSense
            </h1>
            <p className="text-[#6B7280] text-base leading-relaxed">
              Have questions regarding station deployments, health report access, or corporate health partnerships? Our technical support team is here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

            {/* Left — Info Cards */}
            <div className="lg:col-span-2 space-y-5">
              {[
                {
                  icon: Mail,
                  color: '#2563EB',
                  bg: '#EFF6FF',
                  title: 'Email Support',
                  detail: 'support@urosense.health',
                  note: 'Our team typically responds within 4 business hours.',
                },
                {
                  icon: Phone,
                  color: '#0D9488',
                  bg: '#F0FDFA',
                  title: 'Direct Helpline',
                  detail: '+91 1800 000 876',
                  note: 'Mon–Sat, 9:00 AM to 6:00 PM IST',
                },
                {
                  icon: MapPin,
                  color: '#7C3AED',
                  bg: '#F5F3FF',
                  title: 'Headquarters',
                  detail: 'New Delhi, India',
                  note: 'Pan-India kiosk deployment operations',
                },
                {
                  icon: ShieldCheck,
                  color: '#059669',
                  bg: '#ECFDF5',
                  title: 'Data Confidentiality',
                  detail: '100% Private & Secure',
                  note: 'Inquiries are encrypted and never shared.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-0.5">{item.title}</p>
                    <p className="font-bold text-[#0B1B33] text-base" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>{item.detail}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.note}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Contact Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8 md:p-10">
                {status === 'sent' ? (
                  <div className="text-center py-12 space-y-5">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-[#059669]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                      Message Received!
                    </h3>
                    <p className="text-[#6B7280] text-sm max-w-md mx-auto leading-relaxed">
                      Thank you for contacting UroSense. Your inquiry has been routed to our support specialist. Our team typically responds within <strong className="text-[#0B1B33]">4 business hours</strong>.
                    </p>
                    <button
                      onClick={() => { setForm({ name: '', email: '', phone: '', inquiryType: 'General Inquiry', message: '' }); setStatus('idle'); }}
                      className="mt-4 px-7 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-[#0B1B33] hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-[#0B1B33]" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
                        Send Us a Message
                      </h2>
                      <p className="text-sm text-[#6B7280] mt-1">Fill in the details below and our team will get back to you shortly.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-[#0B1B33] uppercase tracking-wider mb-1.5">
                          Full Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="name" name="name" type="text" required
                          value={form.name} onChange={handleChange}
                          placeholder="Your full name"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0B1B33] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors bg-gray-50/50"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-[#0B1B33] uppercase tracking-wider mb-1.5">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <input
                          id="email" name="email" type="email" required
                          value={form.email} onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0B1B33] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors bg-gray-50/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phone" className="block text-xs font-semibold text-[#0B1B33] uppercase tracking-wider mb-1.5">
                          Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                          id="phone" name="phone" type="tel"
                          value={form.phone} onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0B1B33] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors bg-gray-50/50"
                        />
                      </div>
                      <div>
                        <label htmlFor="inquiryType" className="block text-xs font-semibold text-[#0B1B33] uppercase tracking-wider mb-1.5">
                          Inquiry Topic
                        </label>
                        <select
                          id="inquiryType" name="inquiryType"
                          value={form.inquiryType} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0B1B33] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors bg-gray-50/50 cursor-pointer"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Hospital Deployment">Hospital & Clinic Deployment</option>
                          <option value="Transit Kiosk Operations">Transit & Airport Operations</option>
                          <option value="Corporate Wellness">Corporate Wellness Partnership</option>
                          <option value="Technical Support">Technical Support</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold text-[#0B1B33] uppercase tracking-wider mb-1.5">
                        Message Details <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="message" name="message" required rows={4}
                        value={form.message} onChange={handleChange}
                        placeholder="Please describe your inquiry or location interest..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[#0B1B33] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-colors bg-gray-50/50 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] text-white font-bold text-base hover:bg-[#1d4ed8] shadow-lg shadow-blue-500/20 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
                    >
                      {status === 'sending' ? (
                        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Transmitting Inquiry...</>
                      ) : (
                        <><Send className="w-4 h-4" />Submit Request</>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-2">
                      🔒 Your contact details are stored securely and encrypted under HIPAA / DISHA guidelines.
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
