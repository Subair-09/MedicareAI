import React from 'react';

interface HospitalCrossLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const HospitalCrossLogo: React.FC<HospitalCrossLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick
}) => {
  const iconSizes = {
    sm: 'w-9 h-9 rounded-xl',
    md: 'w-11 h-11 sm:w-12 sm:h-12 rounded-2xl',
    lg: 'w-14 h-14 rounded-2xl',
  };

  const titleSizes = {
    sm: 'text-[20px]',
    md: 'text-[28px] sm:text-[34px]',
    lg: 'text-[36px] sm:text-[40px]',
  };

  const subSizes = {
    sm: 'text-[12px]',
    md: 'text-[16px] sm:text-[20px]',
    lg: 'text-[18px] sm:text-[22px]',
  };

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3.5 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Medical Cross with Heartbeat / ECG Line Inside */}
      <div
        className={`${iconSizes[size]} bg-[#0878F9] flex items-center justify-center text-white shadow-md shadow-[#0878F9]/25 shrink-0 relative overflow-hidden transition-transform duration-200 group-hover:scale-105`}
      >
        {/* Subtle Radial Glow */}
        <div className="absolute inset-0 bg-radial from-white/20 to-transparent pointer-events-none" />

        {/* Medical Cross SVG with integrated ECG heartbeat line */}
        <svg
          viewBox="0 0 48 48"
          className="w-8 h-8 sm:w-8.5 sm:h-8.5 text-white"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Rounded Cross Base */}
          <path
            d="M20 6C20 4.89543 20.8954 4 22 4H26C27.1046 4 28 4.89543 28 6V18H40C41.1046 18 42 18.8954 42 20V24C42 25.1046 41.1046 26 40 26H28V38C28 39.1046 27.1046 40 26 40H22C20.8954 40 20 39.1046 20 38V26H8C6.89543 26 6 25.1046 6 24V20C6 18.8954 6.89543 18 8 18H20V6Z"
            fill="white"
            fillOpacity="0.18"
          />
          {/* Solid White Rounded Cross Outline and Fill */}
          <path
            d="M19 8C19 6.89543 19.8954 6 21 6H27C28.1046 6 29 6.89543 29 8V19H40C41.1046 19 42 19.8954 42 21V27C42 28.1046 41.1046 29 40 29H29V40C29 41.1046 28.1046 42 27 42H21C19.8954 42 19 41.1046 19 40V29H8C6.89543 29 6 28.1046 6 27V21C6 19.8954 6.89543 19 8 19H19V8Z"
            fill="currentColor"
          />
          {/* Heartbeat ECG Line cutout through the cross in blue */}
          <path
            d="M8 24H16L18.5 19L22.5 30L26.5 15L29.5 26.5L32 24H40"
            stroke="#0878F9"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span
            className={`${titleSizes[size]} font-extrabold tracking-tight text-[#102A52] leading-[1.05] group-hover:text-[#0878F9] transition-colors`}
          >
            MediCare
          </span>
          <span
            className={`${subSizes[size]} font-medium text-[#5577A6] tracking-normal -mt-0.5 leading-snug`}
          >
            Hospital
          </span>
        </div>
      )}
    </div>
  );
};
