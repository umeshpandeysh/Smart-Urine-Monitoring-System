'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled production runtime exception caught by Error Boundary:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#0B1B33] flex flex-col items-center justify-center p-6 space-y-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shadow-sm">
        <AlertTriangle className="w-7 h-7 text-rose-600" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h2 className="text-xl font-bold tracking-tight text-[#0B1B33]">Something went unexpected</h2>
        <p className="text-xs text-gray-500 font-mono">
          {error.message || 'A temporary system error occurred. Our team has been notified.'}
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm active:scale-95"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Reload Workspace</span>
      </button>
    </div>
  );
}
