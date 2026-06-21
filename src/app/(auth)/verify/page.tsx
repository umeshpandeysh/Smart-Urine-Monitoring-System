'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginLayout from '@/components/auth/login-layout';
import OtpInput from '@/components/auth/otp-input';
import AuthSuccess from '@/components/auth/auth-success';

export default function VerifyPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Retrieve phone from session storage
  useEffect(() => {
    const storedPhone = sessionStorage.getItem('urosense_phone');
    if (!storedPhone) {
      router.push('/login');
      return;
    }
    setPhone(storedPhone);
  }, [router]);

  // Handle OTP verification using rate-limited endpoint
  const handleVerify = async (otpCode: string) => {
    if (otpCode.length !== 6 || loading || success) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, token: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Verification failed. Please check the code and try again.');
        setLoading(false);
        return;
      }

      // Success transition (session cookies have been set by Next.js response cookies)
      setSuccess(true);
      setLoading(false);
      sessionStorage.removeItem('urosense_phone');

      // Smooth delay before redirecting to allow success animation
      setTimeout(() => {
        router.refresh(); // Refresh page tree to load cookies in server layout
        router.push('/patient-portal');
      }, 2000);
    } catch (err) {
      setError('A network error occurred. Please try again.');
      setLoading(false);
    }
  };

  // Handle OTP resending
  const handleResend = async () => {
    if (!phone) return;
    setError('');
    
    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to resend verification code.');
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend code.');
      throw err;
    }
  };

  return (
    <LoginLayout>
      {success ? (
        <AuthSuccess />
      ) : (
        <OtpInput
          phone={phone}
          onVerify={handleVerify}
          onResend={handleResend}
          loading={loading}
          error={error}
        />
      )}
    </LoginLayout>
  );
}
