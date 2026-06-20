'use client';

import React from 'react';
import type { SensorReading } from '@/types';

interface WellnessTimelineProps {
  readings: SensorReading[];
}

export default function WellnessTimeline({ readings }: WellnessTimelineProps) {
  // Sort readings oldest to newest for plotting left-to-right
  const sorted = [...readings].reverse();
  const dataPoints = sorted.map(r => r.hydration_index ?? 0);

  // Generate SVG path for a smooth Bezier curve
  const width = 500;
  const height = 150;
  const padding = 20;

  let pathData = '';
  if (dataPoints.length > 1) {
    const step = (width - padding * 2) / (dataPoints.length - 1);
    const points = dataPoints.map((val, idx) => ({
      x: padding + idx * step,
      y: height - padding - (val / 100) * (height - padding * 2)
    }));

    pathData = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const cpX1 = points[i].x + step / 2;
      const cpY1 = points[i].y;
      const cpX2 = points[i + 1].x - step / 2;
      const cpY2 = points[i + 1].y;
      pathData += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i + 1].x} ${points[i + 1].y}`;
    }
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.01)] flex flex-col justify-between min-h-[300px]">
      <div>
        <span className="text-xs font-mono tracking-widest text-[#0F7AF3] uppercase font-semibold">Longitudinal Telemetry</span>
        <h4 className="font-display font-medium text-lg text-[#111827] mt-1">Biomarker Trend Curve</h4>
      </div>

      <div className="relative w-full h-[150px] mt-4 flex items-center justify-center">
        {dataPoints.length < 2 ? (
          <div className="text-xs text-[#6B7280] font-light">Insufficient readings to compute baseline curves.</div>
        ) : (
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-[#0F7AF3]">
            {/* Soft gradient fill under the curve */}
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F7AF3" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#0F7AF3" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Render baseline reference guides */}
            <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />

            {/* Filled area */}
            <path
              d={`${pathData} L ${padding + (dataPoints.length - 1) * ((width - padding * 2) / (dataPoints.length - 1))} ${height - padding} L ${padding} ${height - padding} Z`}
              fill="url(#chartGrad)"
            />

            {/* Smooth Bezier Line */}
            <path
              d={pathData}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />

            {/* Highlighted dots */}
            {dataPoints.map((val, idx) => {
              const step = (width - padding * 2) / (dataPoints.length - 1);
              const x = padding + idx * step;
              const y = height - padding - (val / 100) * (height - padding * 2);
              return (
                <circle
                  key={idx}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="white"
                  stroke="#0F7AF3"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-[#6B7280] uppercase tracking-wider mt-4 border-t border-gray-50 pt-3">
        <span>Oldest reading</span>
        <span>Latest scan</span>
      </div>
    </div>
  );
}
