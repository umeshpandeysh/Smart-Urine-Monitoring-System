'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginLayout from '@/components/auth/login-layout';
import PhoneInput from '@/components/auth/phone-input';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 8) return;

    setLoading(true);
    setError('');

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    const redirectTo = searchParams.get('redirect');
    if (redirectTo) {
      sessionStorage.setItem('urosense_redirect', redirectTo);
    } else {
      sessionStorage.removeItem('urosense_redirect');
    }

    try {
      // Send OTP request via our rate-limited Next.js API route
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send verification code.');
        setLoading(false);
        return;
      }

      // Save phone number in sessionStorage for the verification stage
      sessionStorage.setItem('urosense_phone', formattedPhone);
      
      // Auto-advance to OTP verification screen with preserved redirect target
      const verifyUrl = redirectTo ? `/verify?redirect=${encodeURIComponent(redirectTo)}` : '/verify';
      router.push(verifyUrl);
    } catch (err) {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <PhoneInput
      phone={phone}
      onChange={setPhone}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}

export default function LoginPage() {
  return (
    <LoginLayout>
      <Suspense fallback={<div className="font-mono text-xs text-gray-400">Loading screen...</div>}>
        <LoginForm />
      </Suspense>
    </LoginLayout>
  );
}
