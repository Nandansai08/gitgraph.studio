import React from 'react';

// Simple FNV-1a Hash for deterministic identicons
function fnv1a(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

const PALETTES = [
  ['#f0f6fc', '#238636'], // Green (Default GitHub)
  ['#f0f6fc', '#8957e5'], // Purple
  ['#f0f6fc', '#d29922'], // Yellow
  ['#f0f6fc', '#da3633'], // Red
  ['#f0f6fc', '#316dca'], // Blue
  ['#f0f6fc', '#bf3989'], // Pink
  ['#f0f6fc', '#e36209'], // Orange
  ['#f0f6fc', '#0550ae'], // Deep Blue
];

interface IdenticonProps {
  username: string;
  className?: string;
}

export function Identicon({ username, className = "w-6 h-6 rounded-full" }: IdenticonProps) {
  const hash = fnv1a(username || 'anonymous');
  
  // Choose color palette based on hash
  const palette = PALETTES[hash % PALETTES.length];
  const bg = palette[0];
  const fg = palette[1];

  // Generate 5x5 grid (symmetric across middle column)
  const grid = Array(5).fill(0).map(() => Array(5).fill(false));
  let currentHash = hash;

  for (let col = 0; col < 3; col++) {
    for (let row = 0; row < 5; row++) {
      const isSolid = (currentHash & 1) === 1;
      grid[row][col] = isSolid;
      // mirror
      grid[row][4 - col] = isSolid;
      currentHash = currentHash >> 1;
    }
  }

  return (
    <svg 
      viewBox="0 0 5 5" 
      shapeRendering="crispEdges" 
      className={`overflow-hidden ${className}`}
      style={{ backgroundColor: bg }}
    >
      {grid.map((row, r) =>
        row.map((isSolid, c) => 
          isSolid ? (
            <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill={fg} />
          ) : null
        )
      )}
    </svg>
  );
}
