import React from 'react';
import {
  Calendar,
  Users,
  UserCheck,
  Settings,
  BarChart3,
  MessageSquare,
  Shield
} from 'lucide-react';
import { HospitalCrossLogo } from './HospitalCrossLogo';

interface AdminBrandPanelProps {
  onBackToLanding?: () => void;
}

export const AdminBrandPanel: React.FC<AdminBrandPanelProps> = ({ onBackToLanding }) => {
  const adminFeatures = [
    {
      id: 'f-apt',
      title: 'Appointment Management',
      icon: Calendar,
    },
    {
      id: 'f-patients',
      title: 'Patient Records',
      icon: Users,
    },
    {
      id: 'f-doctors',
      title: 'Doctor Management',
      icon: UserCheck,
    },
    {
      id: 'f-settings',
      title: 'Hospital Settings',
      icon: Settings,
    },
    {
      id: 'f-analytics',
      title: 'Analytics & Reports',
      icon: BarChart3,
    },
    {
      id: 'f-ai',
      title: 'AI Assistant Control',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="w-full h-full bg-[#EAF5FF] flex flex-col justify-between relative overflow-hidden text-left select-none min-h-[580px]">
      {/* Upper Content Section */}
      <div className="p-6 sm:p-8 xl:p-10 pb-2 z-10 space-y-4 sm:space-y-4.5">
        {/* Top Logo */}
        <div className="flex items-center justify-between">
          <HospitalCrossLogo
            size="md"
            onClick={onBackToLanding}
          />
        </div>

        {/* ADMIN PORTAL Label */}
        <div className="pt-1">
          <span className="text-[12.5px] sm:text-[13px] font-bold uppercase tracking-[0.18em] text-[#5577A6]">
            ADMIN PORTAL
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-[28px] sm:text-[34px] xl:text-[38px] font-extrabold tracking-tight leading-[1.14] text-[#102A52]">
          Manage Your Hospital <br />
          <span className="text-[#0878F9]">Smarter with AI</span>
        </h1>

        {/* Description */}
        <p className="text-[14px] sm:text-[15px] text-[#5577A6] leading-relaxed max-w-[460px]">
          Access appointments, manage doctors, monitor patient activity and more — all in one place.
        </p>

        {/* 2-Column Feature Grid (6 Items) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 sm:gap-y-3 pt-1">
          {adminFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.id} className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-[#D9EDFF] flex items-center justify-center text-[#0878F9] shrink-0 shadow-2xs">
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span className="text-[13px] sm:text-[13.5px] font-semibold text-[#102A52]">
                  {feat.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lower Portion: Hospital Photograph with Facade Signage & Layered Wave Overlays */}
      <div className="relative w-full h-[180px] sm:h-[200px] xl:h-[220px] mt-2 shrink-0 overflow-hidden">
        {/* Hospital Building Image */}
        <div className="relative w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=85"
            alt="MediCare Hospital Campus Architecture"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />

          {/* Facade Branding Tag on Building Glass (Matches Reference Facade Sign) */}
          <div className="absolute top-8 left-1/3 -translate-x-1/2 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-lg border border-[#CCE3FB] shadow-sm flex items-center gap-2">
            <div className="w-4 h-4 rounded-xs bg-[#0878F9] flex items-center justify-center text-white">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.5 4.5C10.5 3.67157 11.1716 3 12 3C12.8284 3 13.5 3.67157 13.5 4.5V10.5H19.5C20.3284 10.5 21 11.1716 21 12C21 12.8284 20.3284 13.5 19.5 13.5H13.5V19.5C13.5 20.3284 12.8284 21 12 21C11.1716 21 10.5 20.3284 10.5 19.5V13.5H4.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5H10.5V4.5Z" />
              </svg>
            </div>
            <span className="text-[12px] font-extrabold text-[#102A52] tracking-tight">
              MediCare Hospital
            </span>
          </div>

          {/* Subtle Top Gradient to smoothly blend into the light-blue panel */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#EAF5FF] to-transparent pointer-events-none" />
        </div>

        {/* Decorative Smooth Flowing Waves at the Bottom */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-10">
          <svg
            viewBox="0 0 800 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto object-cover transform translate-y-1"
          >
            {/* Wave Layer 1: Soft Light Blue */}
            <path
              d="M0,150 C180,80 320,180 520,120 C640,80 720,100 800,90 L800,240 L0,240 Z"
              fill="#5BA6FE"
              fillOpacity="0.45"
            />
            {/* Wave Layer 2: Medium Blue */}
            <path
              d="M0,175 C140,110 340,170 540,130 C660,105 740,120 800,115 L800,240 L0,240 Z"
              fill="#1884FF"
              fillOpacity="0.75"
            />
            {/* Wave Layer 3: Solid Primary Blue */}
            <path
              d="M0,195 C160,140 380,210 560,165 C680,140 750,150 800,145 L800,240 L0,240 Z"
              fill="#0878F9"
            />
          </svg>
        </div>

        {/* Security Badge: "Secure • Reliable • Always On" overlaid on the bottom waves */}
        <div className="absolute bottom-4 sm:bottom-5 left-6 sm:left-10 z-20 flex items-center gap-2 text-white">
          <Shield className="w-4.5 h-4.5 stroke-[2.3] text-white shrink-0 drop-shadow-xs" />
          <span className="text-[13px] sm:text-[14px] font-medium tracking-wide drop-shadow-xs">
            Secure • Reliable • Always On
          </span>
        </div>
      </div>
    </div>
  );
};
