import React from 'react';
import { GridPixel } from '@/src/types';

interface GraphPreviewProps {
  pixels: GridPixel[];
  className?: string;
}

const THEME = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

export function GraphPreview({ pixels, className = "" }: GraphPreviewProps) {
  // SVG viewBox represents the full 53 weeks x 7 days grid (approx 530x70 internally)
  // Each block will be 10x10 with 2px gap (8x8 rect). Total dimensions:
  // width: 53 * 10 = 530, height: 7 * 10 = 70
  
  return (
    <div className={`flex items-center justify-center p-4 w-full h-full ${className}`}>
      <svg 
        viewBox="0 0 530 70" 
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full drop-shadow-sm opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-300"
      >
        {/* Fill background grid with empty blocks (level 0) */}
        {Array.from({ length: 53 }).map((_, w) =>
          Array.from({ length: 7 }).map((_, d) => (
            <rect 
              key={`bg-${w}-${d}`}
              x={w * 10}
              y={d * 10}
              width="8"
              height="8"
              rx="2"
              fill={THEME[0]}
            />
          ))
        )}

        {/* Overlay active pixels */}
        {pixels.map((p, idx) => {
          if (p.level === 0) return null;
          return (
            <rect
              key={`pixel-${p.w}-${p.d}-${idx}`}
              x={p.w * 10}
              y={p.d * 10}
              width="8"
              height="8"
              rx="2"
              fill={THEME[Math.min(4, p.level)] || THEME[4]}
            />
          );
        })}
      </svg>
    </div>
  );
}
