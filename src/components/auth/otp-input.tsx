'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader2, RefreshCw, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface OtpInputProps {
  phone: string;
  onVerify: (otp: string) => void;
  onResend: () => Promise<void>;
  loading: boolean;
  error: string;
}

export default function OtpInput({
  phone,
  onVerify,
  onResend,
  loading,
  error,
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on load
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = digits.join('');
    if (code.length === 6 && !loading) {
      onVerify(code);
    }
  };

  const handleChange = (index: number, val: string) => {
    const numericVal = val.replace(/\D/g, '');
    if (!numericVal) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    const singleDigit = numericVal.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = singleDigit;
    setDigits(newDigits);

    // Auto advance to next input cell
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...digits];
    for (let i = 0; i < pasteData.length; i++) {
      newDigits[i] = pasteData[i];
    }
    setDigits(newDigits);

    const focusIdx = Math.min(pasteData.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleResendClick = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    try {
      await onResend();
      setTimer(60);
      setDigits(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch {
      // Errors handled by parent state
    } finally {
      setResending(false);
    }
  };

  const isCodeComplete = digits.join('').length === 6;

  return (
    <div className="space-y-6">
      
      {/* Mobile Header */}
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
          Verify Identity
        </h2>
        <p className="text-xs text-[#6B7280] font-light leading-relaxed">
          We sent a 6-digit confirmation code to{' '}
          <span className="font-mono font-medium text-[#0A2540]">{phone}</span>.
        </p>
      </div>

      {/* OTP Grid Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="flex gap-2.5 sm:gap-3 justify-between">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              disabled={loading}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-12 h-14 md:w-14 md:h-16 text-center text-xl font-mono font-semibold rounded-xl bg-white border border-[#E5E7EB] text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all duration-200"
              placeholder="-"
            />
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="p-3.5 rounded-xl border border-red-200 bg-red-50 text-xs text-red-700 leading-relaxed flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Invalid verification code</p>
              <p className="font-light mt-0.5 text-[11px] opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={!isCodeComplete || loading}
          className="w-full py-3.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm shadow-md shadow-blue-500/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <span>Verify OTP</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Resend & Back Action Panel */}
        <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-5">
          <Link
            href="/login"
            className="group flex items-center gap-1.5 text-xs font-mono text-[#9CA3AF] hover:text-[#0A2540] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>CHANGE PHONE</span>
          </Link>

          <button
            type="button"
            onClick={handleResendClick}
            disabled={timer > 0 || resending}
            className="flex items-center gap-1.5 text-xs font-mono text-[#0A2540] hover:text-[#0A2540]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {resending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5" />
            )}
            <span>
              {timer > 0 ? `RESEND IN ${timer}S` : 'RESEND CODE'}
            </span>
          </button>
        </div>

      </form>

    </div>
  );
}
