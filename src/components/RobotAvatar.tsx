import React from 'react';

interface RobotAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RobotAvatar: React.FC<RobotAvatarProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-12 h-12 sm:w-14 sm:h-14'
  }[size];

  return (
    <div
      className={`relative rounded-full bg-gradient-to-b from-[#E6F2FF] to-[#D5E8FD] border border-[#C5DFFC] flex items-center justify-center shrink-0 shadow-xs overflow-hidden ${dimensions} ${className}`}
    >
      {/* Friendly futuristic medical AI robot SVG */}
      <svg
        viewBox="0 0 100 100"
        className="w-[85%] h-[85%] drop-shadow-xs"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="robotHeadGrad" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E0EEFD" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="50" y1="35" x2="50" y2="65" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B1E38" />
            <stop offset="100%" stopColor="#142B4E" />
          </linearGradient>
          <linearGradient id="eyeGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Small top antenna */}
        <path d="M50 18 L50 9" stroke="#94BFEF" strokeWidth="3.5" strokeLinecap="round" />
        <circle cx="50" cy="8" r="3.5" fill="#0878F9" />

        {/* Side ear sensors */}
        <rect x="14" y="40" width="6" height="20" rx="3" fill="#B3D5FA" />
        <rect x="80" y="40" width="6" height="20" rx="3" fill="#B3D5FA" />

        {/* Head base */}
        <rect
          x="18"
          y="18"
          width="64"
          height="64"
          rx="22"
          fill="url(#robotHeadGrad)"
          stroke="#B5D7F8"
          strokeWidth="2.5"
        />

        {/* Curved dark visor */}
        <rect
          x="26"
          y="35"
          width="48"
          height="28"
          rx="12"
          fill="url(#visorGrad)"
        />

        {/* Glowing cyan pill eyes */}
        <g filter="url(#glow)">
          <ellipse cx="38" cy="49" rx="4.5" ry="6" fill="url(#eyeGlow)" />
          <ellipse cx="62" cy="49" rx="4.5" ry="6" fill="url(#eyeGlow)" />
          {/* Eye reflections */}
          <circle cx="39.5" cy="46" r="1.5" fill="#FFFFFF" />
          <circle cx="63.5" cy="46" r="1.5" fill="#FFFFFF" />
        </g>

        {/* Cute smile indicator */}
        <path
          d="M44 56 Q50 59 56 56"
          stroke="#38BDF8"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />

        {/* Medical cross detail at bottom chest/collar */}
        <rect x="47" y="73" width="6" height="6" rx="1" fill="#0878F9" />
        <rect x="48.8" y="74" width="2.4" height="4" fill="#FFFFFF" />
        <rect x="47.8" y="75" width="4.4" height="2" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
