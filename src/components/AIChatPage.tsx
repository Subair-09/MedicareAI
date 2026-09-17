import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BrandHeader } from './BrandHeader';
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

  const handleFeatureSelect = (actionId: string) => {
    setActiveFeature(actionId);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-[#F5FAFF] relative lg:overflow-hidden selection:bg-[#0878F9]/15 flex flex-col">
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

      {/* Main Container - Stationed without outer page shifts */}
      <div className="relative z-10 max-w-[1640px] w-full mx-auto px-5 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 flex-1 flex flex-col justify-between h-full min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-stretch flex-1 h-full min-h-0">
          
          {/* ====================================================
              LEFT COLUMN (~32-34% width / 4 cols on 12-col grid)
             ==================================================== */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-between space-y-5 lg:space-y-4 pr-0 lg:pr-2 h-full lg:overflow-y-auto lg:overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {/* Top: Branding with Back Button */}
            <BrandHeader
              onBackToLanding={onBackToLanding}
              onOpenAdminLogin={onOpenAdminLogin}
            />

            {/* Main Headline */}
            <HeroIntro />

            {/* Feature List (5 items) */}
            <FeatureList onSelectFeature={handleFeatureSelect} />

            {/* Hospital Card */}
            <div className="pt-1">
              <HospitalCard onClick={onBackToLanding} />
            </div>

            {/* Bottom Service Indicators (3 horizontal badges) */}
            <div className="pt-1">
              <ServiceIndicators />
            </div>
          </div>

          {/* ====================================================
              RIGHT COLUMN (~66-68% width / 8 cols on 12-col grid)
             ==================================================== */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col h-[760px] sm:h-[840px] lg:h-full min-h-0">
            <AIChatPanel 
              onBackToLanding={onBackToLanding} 
              externalTrigger={activeFeature} 
            />
          </div>

        </div>
      </div>
    </div>
  );
};
