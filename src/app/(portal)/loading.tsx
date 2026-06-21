import React from 'react';

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col justify-center items-center space-y-4">
      {/* Pulse loading spinner */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute w-full h-full rounded-full border-4 border-blue-100 border-t-[#2563EB] animate-spin" />
        <div className="w-3.5 h-3.5 rounded-full bg-[#0D9488] animate-pulse" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-xs font-bold text-[#0B1B33] uppercase tracking-wider animate-pulse" style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
          Loading Health Data
        </p>
        <p className="text-[11px] text-gray-400 font-medium">Securing patient connection...</p>
      </div>
    </div>
  );
}
