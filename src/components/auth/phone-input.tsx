'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Phone, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PhoneInputProps {
  phone: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

const COUNTRIES = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'USA', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
];

export default function PhoneInput({
  phone,
  onChange,
  onSubmit,
  loading,
  error,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // default to India (+91)
  const [nationalNumber, setNationalNumber] = useState('');

  // Synchronize internal state with external phone prop
  useEffect(() => {
    if (!phone) return;
    // Check if phone matches any known country prefix
    const matched = COUNTRIES.find(c => phone.startsWith(c.code));
    if (matched) {
      setSelectedCountry(matched);
      setNationalNumber(phone.replace(matched.code, ''));
    }
  }, [phone]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    const country = COUNTRIES.find(c => c.code === code);
    if (country) {
      setSelectedCountry(country);
      onChange(`${country.code}${nationalNumber.replace(/\D/g, '')}`);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/\D/g, ''); // strip non-numeric
    setNationalNumber(num);
    onChange(`${selectedCountry.code}${num}`);
  };

  const isValid = phone.length >= 10; // country code + at least 8 digits

  return (
    <div className="space-y-6">
      
      {/* Mobile-Only Header Branding */}
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[#0A2540] flex items-center justify-center">
          <span className="text-white font-display font-bold text-sm">U</span>
        </div>
        <span className="font-display font-bold text-base text-[#0A2540] tracking-tight">
          UroSense
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="font-display font-semibold text-3xl text-[#0A2540] tracking-tight">
          Patient Portal
        </h2>
        <p className="text-xs text-[#6B7280] font-light leading-relaxed">
          Sign in or register your account using your mobile number to view and download your health reports.
        </p>
      </div>

      {/* Main Login Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-[10px] font-mono font-semibold uppercase tracking-wider text-[#6B7280]">
            Mobile Number
          </label>
          <div className="relative flex items-center rounded-xl bg-white border border-[#E5E7EB] px-3 py-1 focus-within:ring-1 focus-within:ring-[#0A2540] focus-within:border-[#0A2540] transition-all duration-200">
            
            {/* Phone Icon */}
            <Phone className="w-4 h-4 text-[#9CA3AF] ml-2 mr-1 shrink-0" />
            
            {/* Country Selector Dropdown */}
            <div className="relative flex items-center border-r border-[#E5E7EB] pr-2 mr-2">
              <span className="text-sm mr-1">{selectedCountry.flag}</span>
              <select
                disabled={loading}
                value={selectedCountry.code}
                onChange={handleCountryChange}
                className="bg-transparent text-sm font-mono font-semibold text-[#0A2540] outline-none cursor-pointer pr-1"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Field */}
            <input
              id="phone"
              type="tel"
              required
              disabled={loading}
              value={nationalNumber}
              onChange={handleNumberChange}
              placeholder="99999 99999"
              className="w-full bg-transparent border-0 py-2.5 text-sm font-mono text-[#1B1F26] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-0"
              autoFocus
            />

          </div>
          <p className="text-[10px] text-[#9CA3AF] font-light leading-relaxed">
            Choose your country prefix and enter your number. Your 6-digit confirmation code will be sent via SMS.
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-xs text-red-700 leading-relaxed flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <div>
              <p className="font-semibold">Authentication failure</p>
              <p className="font-light mt-0.5 text-[11px] opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !isValid}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0A2540] text-white text-sm font-semibold hover:bg-[#0A2540]/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Requesting Code...</span>
            </>
          ) : (
            <>
              <span>Send OTP Code</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

      {/* Privacy Notice */}
      <div className="border-t border-[#E5E7EB] pt-5 space-y-4">
        <div className="flex gap-2.5 items-start">
          <ShieldCheck className="w-4 h-4 text-[#167041] mt-0.5 shrink-0" />
          <p className="text-[10px] text-[#6B7280] leading-relaxed font-light">
            Diagnostics are fully secure and HIPAA/DPDP-compliant. Telemetry readings are stored cryptographically and accessed only via secure authentication sessions.
          </p>
        </div>

        <p className="text-center text-[10px] font-mono text-[#9CA3AF]">
          <Link href="/" className="hover:text-[#0A2540] transition-colors">
            &larr; BACK TO HOME
          </Link>
        </p>
      </div>

    </div>
  );
}
