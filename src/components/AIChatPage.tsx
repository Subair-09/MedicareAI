import React from 'react';
import { AIChatPanel } from './chat/AIChatPanel';

interface AIChatPageProps {
  onBackToLanding: () => void;
}

export const AIChatPage: React.FC<AIChatPageProps> = ({ onBackToLanding }) => {
  return (
    <div className="min-h-screen w-full bg-[#F1F6FB] relative selection:bg-[#0878F9]/15 flex flex-col">
      
      {/* ====================================================
          1. TOP GLOBAL NAVIGATION BAR (Desktop & Mobile)
          Clean MediCare Hospital brand header
         ==================================================== */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-[#E1EDF9] shadow-xs transition-all">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Brand Logo & Tagline */}
          <div className="flex items-center gap-3 shrink-0">
            <div 
              onClick={onBackToLanding}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="MediCare Hospital"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#0878F9] flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.5 4.5C10.5 3.67157 11.1716 3 12 3C12.8284 3 13.5 3.67157 13.5 4.5V10.5H19.5C20.3284 10.5 21 11.1716 21 12C21 12.8284 20.3284 13.5 19.5 13.5H13.5V19.5C13.5 20.3284 12.8284 21 12 21C11.1716 21 10.5 20.3284 10.5 19.5V13.5H4.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5H10.5V4.5Z" fill="white" />
                </svg>
              </div>
              <div className="text-left">
                <div className="text-[16px] sm:text-[17px] font-extrabold text-[#102A52] tracking-tight leading-none group-hover:text-[#0878F9] transition-colors">
                  MediCare
                </div>
                <div className="text-[10px] sm:text-[11.5px] font-semibold text-[#5A6F8A] leading-tight">
                  Hospital
                </div>
              </div>
            </div>

            <div className="hidden sm:block pl-3 border-l border-[#E2EEFC] text-left">
              <div className="text-[11px] font-semibold text-[#64748B] leading-tight">Better Care.</div>
              <div className="text-[11px] font-semibold text-[#64748B] leading-tight">Healthier Tomorrow.</div>
            </div>
          </div>

          {/* Right: Active Service Badge */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F0F6FE] border border-[#D5E6F7] text-[12px] font-semibold text-[#0878F9]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="hidden sm:inline">24/7 AI Health Assistant</span>
              <span className="sm:hidden">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Subtle curved background SVG waves at the bottom */}
      <div className="absolute -bottom-24 left-0 right-0 h-80 pointer-events-none opacity-30 z-0 overflow-hidden">
        <svg
          viewBox="0 0 1440 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-cover"
        >
          <path
            d="M0,192L60,197.3C120,203,240,213,360,197.3C480,181,600,139,720,138.7C840,139,960,181,1080,181.3C1200,181,1320,139,1380,117.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            fill="#E3EFFC"
          />
          <path
            d="M0,256L80,240C160,224,320,192,480,186.7C640,181,800,203,960,218.7C1120,235,1280,245,1360,250.7L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
            fill="#D5E8FD"
            fillOpacity="0.4"
          />
        </svg>
      </div>

      {/* ====================================================
          2. MAIN CONTENT AREA
          Full-width, centered AI Chat Panel with generous dimensions
         ==================================================== */}
      <main className="relative z-10 w-full flex-1 max-w-[1240px] mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-5 flex flex-col items-center justify-center">
        <section className="w-full h-[calc(100dvh-5.25rem)] min-h-[540px] sm:h-[760px] lg:h-[calc(100vh-6.75rem)] lg:min-h-[640px] lg:max-h-[900px] flex flex-col">
          <AIChatPanel 
            onBackToLanding={onBackToLanding} 
          />
        </section>
      </main>

    </div>
  );
};
