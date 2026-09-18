import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BrandHeaderProps {
  onBackToLanding?: () => void;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({ onBackToLanding }) => {
  return (
    <div className="w-full space-y-3.5">
      {/* Back to landing page button with arrow */}
      {onBackToLanding && (
        <button
          type="button"
          onClick={onBackToLanding}
          id="back-to-landing-btn"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#EAF4FF] text-[#102A52] hover:text-[#0878F9] border border-[#D5E6F8] shadow-2xs text-[13px] font-semibold transition-all cursor-pointer group"
          title="Return to MediCare Hospital landing page"
        >
          <ArrowLeft className="w-4 h-4 text-[#0878F9] transition-transform group-hover:-translate-x-1" />
          <span>Back to Landing Page</span>
        </button>
      )}

      <div className="flex items-start justify-between w-full">
        {/* Logo (clickable to return to landing page) */}
        <div
          onClick={onBackToLanding}
          className={`flex items-center gap-3 ${onBackToLanding ? 'cursor-pointer group' : ''}`}
          title={onBackToLanding ? "Go to MediCare Landing Page" : undefined}
        >
          {/* Blue squircle with white medical cross */}
          <div className="w-11 h-11 rounded-2xl bg-[#0878F9] flex items-center justify-center text-white shadow-sm shadow-[#0878F9]/25 shrink-0 group-hover:scale-105 transition-transform">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M10.5 4.5C10.5 3.67157 11.1716 3 12 3C12.8284 3 13.5 3.67157 13.5 4.5V10.5H19.5C20.3284 10.5 21 11.1716 21 12C21 12.8284 20.3284 13.5 19.5 13.5H13.5V19.5C13.5 20.3284 12.8284 21 12 21C11.1716 21 10.5 20.3284 10.5 19.5V13.5H4.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5H10.5V4.5Z"
                fill="white"
              />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[22px] font-black tracking-tight text-[#102A52] leading-tight group-hover:text-[#0878F9] transition-colors">
              MediCare
            </span>
            <span className="text-[12.5px] font-medium text-[#64748B] -mt-0.5 tracking-wide">
              Hospital
            </span>
          </div>
        </div>

        {/* Top right tag */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right text-[12px] font-medium text-[#4B729F] leading-tight">
            <div>Better Care.</div>
            <div>Healthier Tomorrow.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
