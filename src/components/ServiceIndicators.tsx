import React from 'react';
import { Clock, Calendar, ShieldCheck } from 'lucide-react';

export const ServiceIndicators: React.FC = () => {
  return (
    <div className="flex items-center justify-between gap-3 w-full max-w-[360px] pt-1">
      {/* 1. Available 24/7 */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0878F9] shrink-0">
          <Clock className="w-4 h-4" />
        </div>
        <div className="text-left text-[11.5px] leading-tight text-[#102A52] font-semibold">
          <div>Available</div>
          <div className="text-[#64748B] font-medium">24/7</div>
        </div>
      </div>

      {/* 2. Fast & Easy Booking */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0878F9] shrink-0">
          <Calendar className="w-4 h-4" />
        </div>
        <div className="text-left text-[11.5px] leading-tight text-[#102A52] font-semibold">
          <div>Fast & Easy</div>
          <div className="text-[#64748B] font-medium">Booking</div>
        </div>
      </div>

      {/* 3. Secure & Private */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0878F9] shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-left text-[11.5px] leading-tight text-[#102A52] font-semibold">
          <div>Secure &</div>
          <div className="text-[#64748B] font-medium">Private</div>
        </div>
      </div>
    </div>
  );
};
