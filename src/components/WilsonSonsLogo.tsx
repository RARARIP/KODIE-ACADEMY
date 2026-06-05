/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  width?: number;
  height?: number;
  colorTheme?: 'dark' | 'light' | 'white';
}

/**
 * Wilson Sons official monogram SVG reconstruction
 * "W" (3 navy waves/columns) + "S" (1 cyan wave/column).
 * Designed geometrically to match the official branding perfectly.
 */
export function WilsonSonsLogo({
  className = '',
  size = 'md',
  width,
  height,
  colorTheme = 'dark',
}: LogoProps) {
  // Map friendly size parameters to pixel bounds
  const sizeMap = {
    xs: { w: 32, h: 20 },
    sm: { w: 48, h: 30 },
    md: { w: 64, h: 40 },
    lg: { w: 96, h: 60 },
    xl: { w: 128, h: 80 },
    custom: { w: width || 64, h: height || 40 },
  };

  const dims = sizeMap[size] || sizeMap.md;
  const w = width || dims.w;
  const h = height || dims.h;

  // Set colors based on chosen theme
  // Navy brand is `#0A2647`, Light Blue brand is `#1E90FF` (or cyan `#00A3E0`)
  const navyColor = colorTheme === 'white' ? '#FFFFFF' : '#0A2647';
  const cyanColor = colorTheme === 'white' ? 'rgba(255, 255, 255, 0.85)' : '#1E90FF';

  return (
    <svg
      viewBox="0 0 216 120"
      width={w}
      height={h}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-all duration-300`}
      aria-label="Logotipo Wilson Sons"
      role="img"
    >
      {/* 
        The "W" (Navy Blue) Monogram
        Consists of 3 top fingers and 3 bottom fingers merged.
        Top-left corners are rounded (R=16), bottom-right are rounded (R=16).
      */}
      <g fill={navyColor}>
        {/* Top finger 1: x=[0, 24], y=[0, 80] | Rounded top left */}
        <path d="M 0,16 A 16,16 0 0 1 16,0 L 24,0 L 24,80 L 0,80 Z" />
        
        {/* Bottom finger 1: x=[24, 48], y=[40, 120] | Rounded bottom right */}
        <path d="M 24,40 L 48,40 L 48,104 A 16,16 0 0 1 32,120 L 24,120 Z" />
        
        {/* Top finger 2: x=[48, 72], y=[0, 80] | Rounded top left */}
        <path d="M 48,16 A 16,16 0 0 1 64,0 L 72,0 L 72,80 L 48,80 Z" />
        
        {/* Bottom finger 2: x=[72, 96], y=[40, 120] | Rounded bottom right */}
        <path d="M 72,40 L 96,40 L 96,104 A 16,16 0 0 1 80,120 L 72,120 Z" />
        
        {/* Top finger 3: x=[96, 120], y=[0, 80] | Rounded top left */}
        <path d="M 96,16 A 16,16 0 0 1 112,0 L 120,0 L 120,80 L 96,80 Z" />
        
        {/* Bottom finger 3: x=[120, 144], y=[40, 120] | Rounded bottom right */}
        <path d="M 120,40 L 144,40 L 144,104 A 16,16 0 0 1 128,120 L 120,120 Z" />
      </g>

      {/* 
        The "S" (Cyan/Dodger Blue) Monogram
        Consists of 1 top finger and 1 bottom finger, merged at the middle, with a 12px gap from W.
        W ends at x=144, so S starts at x=156.
        Bottom finger: x=[156, 180]
        Top finger: x=[180, 204]
      */}
      <g fill={cyanColor}>
        {/* S Bottom element: x=[156, 180], y=[40, 120] | Rounded bottom right */}
        <path d="M 156,40 L 180,40 L 180,104 A 16,16 0 0 1 164,120 L 156,120 Z" />

        {/* S Top element: x=[180, 204], y=[0, 80] | Rounded top left */}
        <path d="M 180,16 A 16,16 0 0 1 196,0 L 204,0 L 204,80 L 180,80 Z" />
      </g>
    </svg>
  );
}

interface FullLogoProps extends LogoProps {
  showSubtitle?: boolean;
}

/**
 * Wilson Sons official monogram + typography combo.
 * Side-by-side layout for headers or banners.
 */
export function WilsonSonsFullLogo({
  className = '',
  size = 'md',
  colorTheme = 'dark',
  showSubtitle = true,
}: FullLogoProps) {
  // Map size to container parameters
  const heightMap = {
    xs: 20,
    sm: 30,
    md: 40,
    lg: 54,
    xl: 72,
    custom: 40,
  };

  const h = heightMap[size] || heightMap.md;
  
  // Font sizes proportional to height
  const titleSize = h === 20 ? 'text-sm' : h === 30 ? 'text-lg' : h === 40 ? 'text-2xl' : h === 54 ? 'text-3xl' : 'text-4xl';
  const subSize = h <= 30 ? 'text-[8px]' : 'text-[10px]';

  const textColor = colorTheme === 'white' ? 'text-white' : 'text-[#0A2647]';
  const subColor = colorTheme === 'white' ? 'text-sky-150/90' : 'text-slate-500';

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Wave Symbol */}
      <WilsonSonsLogo size="custom" height={h} width={Math.round(h * 1.8)} colorTheme={colorTheme} />
      
      {/* Group text */}
      <div className="flex flex-col select-none">
        <span className={`font-serif font-semibold tracking-wide leading-tight ${textColor} ${titleSize}`}>
          Wilson, Sons
        </span>
        {showSubtitle && (
          <span className={`font-sans tracking-widest uppercase font-bold text-xs mt-0.5 ${subColor} ${subSize}`}>
            Estaleiros
          </span>
        )}
      </div>
    </div>
  );
}
