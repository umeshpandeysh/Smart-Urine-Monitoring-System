'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginLayout from '@/components/auth/login-layout';
import PhoneInput from '@/components/auth/phone-input';

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 8) return;

    setLoading(true);
    setError('');

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

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
      
      // Auto-advance to OTP verification screen
      router.push('/verify');
    } catch (err) {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <LoginLayout>
      <PhoneInput
        phone={phone}
        onChange={setPhone}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
      />
    </LoginLayout>
  );
}
