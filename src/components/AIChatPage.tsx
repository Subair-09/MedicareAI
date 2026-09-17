import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  PhoneCall, 
  MessageSquare, 
  Info,
  Sparkles
} from 'lucide-react';
import { HeroIntro } from './HeroIntro';
import { FeatureList } from './FeatureList';
import { HospitalCard } from './HospitalCard';
import { ServiceIndicators } from './ServiceIndicators';
import { AIChatPanel } from './chat/AIChatPanel';

interface AIChatPageProps {
  onBackToLanding: () => void;
  onOpenAdminLogin?: () => void;
}

export const AIChatPage: React.FC<AIChatPageProps> = ({ onBackToLanding, onOpenAdminLogin }) => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [mobileActiveTab, setMobileActiveTab] = useState<'chat' | 'info'>('chat');

  const handleFeatureSelect = (actionId: string) => {
    setActiveFeature(actionId);
    setMobileActiveTab('chat');
  };

  return (
    <div className="h-[100dvh] w-full bg-[#F5FAFF] relative overflow-hidden selection:bg-[#0878F9]/15 flex flex-col">
      
      {/* ====================================================
          1. FULL-WIDTH CHAT WITH AI PAGE HEADER (Always visible)
         ==================================================== */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E1EDF9] shadow-2xs shrink-0">
        <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
          
          {/* Left: Back to Landing + Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={onBackToLanding}
              id="chat-header-back-btn"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#F0F6FE] hover:bg-[#E2EEFC] text-[#102A52] hover:text-[#0878F9] border border-[#D0E6FC] text-[12.5px] sm:text-[13px] font-semibold transition-all cursor-pointer group shadow-2xs shrink-0"
              title="Return to MediCare Landing Page"
            >
              <ArrowLeft className="w-4 h-4 text-[#0878F9] transition-transform group-hover:-translate-x-1 shrink-0" />
              <span className="hidden xs:inline font-medium">Landing Page</span>
            </button>

            <div className="h-6 w-[1px] bg-[#E2EEFC] hidden sm:block shrink-0" />

            {/* Brand Title */}
            <div 
              onClick={onBackToLanding}
              className="flex items-center gap-2.5 cursor-pointer group min-w-0"
              title="Go to MediCare Home"
            >
              <div className="w-9 h-9 rounded-xl bg-[#0878F9] flex items-center justify-center text-white shadow-sm shadow-[#0878F9]/25 group-hover:scale-105 transition-transform shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10.5 4.5C10.5 3.67157 11.1716 3 12 3C12.8284 3 13.5 3.67157 13.5 4.5V10.5H19.5C20.3284 10.5 21 11.1716 21 12C21 12.8284 20.3284 13.5 19.5 13.5H13.5V19.5C13.5 20.3284 12.8284 21 12 21C11.1716 21 10.5 20.3284 10.5 19.5V13.5H4.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5H10.5V4.5Z" fill="white" />
                </svg>
              </div>
              <div className="flex flex-col text-left truncate">
                <div className="flex items-center gap-2">
                  <span className="text-[16.5px] sm:text-[18px] font-black tracking-tight text-[#102A52] leading-tight group-hover:text-[#0878F9] transition-colors truncate">
                    MediCare <span className="font-semibold text-[#0878F9]">AI Chat</span>
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-[#E7F8F1] text-[#15803D] border border-[#C6F0DC]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                    Live 24/7
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#64748B] hidden lg:block -mt-0.5">
                  Automated Hospital Consultations & Bookings
                </span>
              </div>
            </div>
          </div>

          {/* Right: Fullscreen Toggle, 911 Emergency, Staff Portal */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Fullscreen / Split Toggle (Desktop / Tablet) */}
            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              id="toggle-fullscreen-chat-btn"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#F0F6FE] text-[#102A52] hover:text-[#0878F9] border border-[#D0E6FC] text-[12px] sm:text-[12.5px] font-semibold transition-all cursor-pointer shadow-2xs"
              title={isFullScreen ? "Restore side-by-side view" : "Expand chat to full screen width"}
            >
              {isFullScreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-[#0878F9]" />
                  <span>Standard View</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-[#0878F9]" />
                  <span>Full Screen</span>
                </>
              )}
            </button>

            {/* Emergency Hotline */}
            <a
              href="tel:911"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#BE123C] border border-[#FECDD3] text-[11.5px] sm:text-[12px] font-bold transition-all shadow-2xs"
              title="Call Emergency 911 immediately"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Emergency 911</span>
            </a>

            {/* Staff Portal Link */}
            {onOpenAdminLogin && (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF5FF] hover:bg-[#DCEEFE] text-[#0878F9] border border-[#D0E6FC] text-[11.5px] sm:text-[12px] font-semibold transition-all cursor-pointer shadow-2xs"
                title="Staff & Doctor Administration Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Staff Portal</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ====================================================
          2. MOBILE SWITCHER TABS (Visible only on < lg screens)
         ==================================================== */}
      <div className="lg:hidden bg-white border-b border-[#E1EDF9] px-4 py-2 shrink-0 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setMobileActiveTab('chat')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer ${
            mobileActiveTab === 'chat'
              ? 'bg-[#0878F9] text-white shadow-xs'
              : 'bg-[#F0F6FE] text-[#475569] hover:bg-[#E2EEFC]'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Live AI Chat</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileActiveTab('info')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-[12.5px] font-bold transition-all cursor-pointer ${
            mobileActiveTab === 'info'
              ? 'bg-[#0878F9] text-white shadow-xs'
              : 'bg-[#F0F6FE] text-[#475569] hover:bg-[#E2EEFC]'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Hospital Info & Actions</span>
        </button>
      </div>

      {/* Subtle curved background SVG waves at the bottom */}
      <div className="absolute -bottom-24 left-0 right-0 h-96 pointer-events-none opacity-40 z-0 overflow-hidden">
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
          3. MAIN CONTENT CONTAINER (Fills Remaining Screen Height)
         ==================================================== */}
      <main className="relative z-10 w-full flex-1 min-h-0 px-2 sm:px-4 lg:px-8 py-2 sm:py-3 lg:py-4 overflow-hidden flex flex-col">
        
        {/* FULL SCREEN MODE */}
        {isFullScreen ? (
          <div className="w-full max-w-[1720px] mx-auto h-full flex flex-col min-h-0">
            <AIChatPanel 
              onBackToLanding={onBackToLanding} 
              externalTrigger={activeFeature} 
            />
          </div>
        ) : (
          /* STANDARD / SPLIT MODE */
          <div className="w-full max-w-[1720px] mx-auto h-full grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 xl:gap-8 items-stretch min-h-0">
            
            {/* LEFT COLUMN: Hospital Intro & Feature Triggers */}
            <div 
              className={`lg:col-span-4 xl:col-span-4 flex flex-col justify-between space-y-4 pr-0 lg:pr-2 h-full overflow-y-auto overscroll-contain [scrollbar-width:thin] ${
                mobileActiveTab === 'info' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              {/* Main Headline */}
              <HeroIntro />

              {/* Feature List (5 Quick Action Triggers) */}
              <FeatureList onSelectFeature={handleFeatureSelect} />

              {/* Hospital Card */}
              <div className="pt-1">
                <HospitalCard onClick={onBackToLanding} />
              </div>

              {/* Service Indicators (Badges) */}
              <div className="pt-1">
                <ServiceIndicators />
              </div>
            </div>

            {/* RIGHT COLUMN: AI Chat Panel */}
            <div 
              className={`lg:col-span-8 xl:col-span-8 flex flex-col h-full min-h-0 ${
                mobileActiveTab === 'chat' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <AIChatPanel 
                onBackToLanding={onBackToLanding} 
                externalTrigger={activeFeature} 
              />
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
