import React from 'react';

export default function Logo({ variant = 'dark', height = 46, showText = true }) {
  // variant='dark' is for light backgrounds (Navbar)
  // variant='light' is for dark backgrounds (Footer)
  
  const isLight = variant === 'light';

  if (!showText) {
    return (
      <svg 
        width={height} 
        height={height} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0, display: 'block' }}
      >
        {/* Shield / Container Card */}
        <rect 
          x="4" 
          y="4" 
          width="92" 
          height="92" 
          rx="20" 
          fill={isLight ? "url(#bgGradLight)" : "url(#bgGradDark)"} 
          shadow="0 4px 12px rgba(0,0,0,0.15)"
        />
        
        {/* Cargo Vessel / Wings Geometry */}
        {/* Main Hull / Container Block */}
        <path 
          d="M 24 36 L 76 36 L 68 62 L 32 62 Z" 
          fill={isLight ? "#ffffff" : "#ffffff"} 
        />
        {/* Speed Wings Top */}
        <path 
          d="M 20 28 L 80 28 L 68 40 L 32 40 Z" 
          fill="#f59e0b" 
        />
        {/* Lower Hull Keystone */}
        <path 
          d="M 32 62 L 68 62 L 60 76 L 40 76 Z" 
          fill={isLight ? "#38bdf8" : "#0284c7"} 
        />
        {/* Water wave / Speed accent */}
        <path 
          d="M 20 84 Q 50 78 80 84" 
          stroke={isLight ? "#ffffff" : "#0f172a"} 
          strokeWidth="4" 
          strokeLinecap="round"
          opacity="0.7"
        />

        <defs>
          <linearGradient id="bgGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="bgGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <svg 
        width={height} 
        height={height} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Shield / Container Card */}
        <rect 
          x="4" 
          y="4" 
          width="92" 
          height="92" 
          rx="20" 
          fill={isLight ? "url(#bgGradLight)" : "url(#bgGradDark)"} 
          shadow="0 4px 12px rgba(0,0,0,0.15)"
        />
        
        {/* Cargo Vessel / Wings Geometry */}
        {/* Main Hull / Container Block */}
        <path 
          d="M 24 36 L 76 36 L 68 62 L 32 62 Z" 
          fill={isLight ? "#ffffff" : "#ffffff"} 
        />
        {/* Speed Wings Top */}
        <path 
          d="M 20 28 L 80 28 L 68 40 L 32 40 Z" 
          fill="#f59e0b" 
        />
        {/* Lower Hull Keystone */}
        <path 
          d="M 32 62 L 68 62 L 60 76 L 40 76 Z" 
          fill={isLight ? "#38bdf8" : "#0284c7"} 
        />
        {/* Water wave / Speed accent */}
        <path 
          d="M 20 84 Q 50 78 80 84" 
          stroke={isLight ? "#ffffff" : "#0f172a"} 
          strokeWidth="4" 
          strokeLinecap="round"
          opacity="0.7"
        />

        <defs>
          <linearGradient id="bgGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="bgGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: height > 40 ? '1.25rem' : '1.1rem',
          color: isLight ? '#ffffff' : '#0f172a',
          letterSpacing: '-0.02em',
          lineHeight: 1.15
        }}>
          PRESTIGE CARGO
        </span>
        <span style={{
          fontSize: '0.7rem',
          color: isLight ? '#38bdf8' : '#0284c7',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}>
          CARGO & TRANSPORT SOLUTION
        </span>
      </div>
    </div>
  );
}
