import React from 'react';

interface RobotAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RobotAvatar: React.FC<RobotAvatarProps> = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'w-8 h-8 sm:w-8.5 sm:h-8.5',
    md: 'w-11 h-11 sm:w-12 sm:h-12',
    lg: 'w-14 h-14 sm:w-16 sm:h-16'
  }[size];

  return (
    <div
      className={`relative rounded-full bg-gradient-to-b from-[#EDF5FF] via-[#E2EFFF] to-[#CFE6FC] border-2 border-[#B9DCFD] flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-0.5 ${dimensions} ${className}`}
      title="MediCare AI Hospital Assistant"
    >
      {/* Friendly futuristic medical AI robot SVG - perfectly positioned and displayed in full */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-xs select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="robotHeadGrad" x1="50" y1="22" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E2EFFD" />
          </linearGradient>
          <linearGradient id="visorGrad" x1="50" y1="38" x2="50" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B1E38" />
            <stop offset="100%" stopColor="#142B4E" />
          </linearGradient>
          <linearGradient id="eyeGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Small top antenna with glowing transmitter tip - shifted down so it is fully displayed */}
        <path d="M50 24 L50 14" stroke="#94BFEF" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="14" r="3.8" fill="#0878F9" />
        <circle cx="50" cy="14" r="1.8" fill="#60A5FA" />

        {/* Side ear audio sensors */}
        <rect x="15" y="42" width="5.5" height="19" rx="2.7" fill="#B3D5FA" stroke="#94BFEF" strokeWidth="1.2" />
        <rect x="79.5" y="42" width="5.5" height="19" rx="2.7" fill="#B3D5FA" stroke="#94BFEF" strokeWidth="1.2" />

        {/* Head base - positioned with generous clearance so corners are never covered by circle */}
        <rect
          x="19.5"
          y="24"
          width="61"
          height="57"
          rx="19"
          fill="url(#robotHeadGrad)"
          stroke="#B5D7F8"
          strokeWidth="2.4"
        />

        {/* Curved dark visor screen */}
        <rect
          x="27.5"
          y="38"
          width="45"
          height="26"
          rx="11"
          fill="url(#visorGrad)"
        />

        {/* Glowing cyan pill eyes */}
        <g filter="url(#glow)">
          <ellipse cx="39" cy="49.5" rx="4.2" ry="5.6" fill="url(#eyeGlow)" />
          <ellipse cx="61" cy="49.5" rx="4.2" ry="5.6" fill="url(#eyeGlow)" />
          {/* Eye reflections */}
          <circle cx="40.5" cy="47" r="1.4" fill="#FFFFFF" />
          <circle cx="62.5" cy="47" r="1.4" fill="#FFFFFF" />
        </g>

        {/* Friendly smile indicator */}
        <path
          d="M44 57 Q50 60.5 56 57"
          stroke="#38BDF8"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* Medical cross detail at bottom chest/collar */}
        <rect x="46.5" y="72.5" width="7" height="6.5" rx="1.5" fill="#0878F9" />
        <rect x="48.8" y="73.8" width="2.4" height="4" fill="#FFFFFF" />
        <rect x="47.6" y="74.6" width="4.8" height="2.4" fill="#FFFFFF" />
      </svg>
    </div>
  );
};
