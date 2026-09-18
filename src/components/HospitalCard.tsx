import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

interface HospitalCardProps {
  onClick?: () => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-full max-w-[380px] bg-white rounded-2xl border border-[#E2EEFC] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group text-left"
    >
      {/* Hospital Building Photograph */}
      <div className="relative h-28 xl:h-32 w-full overflow-hidden bg-[#EAF4FF]">
        <img
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80"
          alt="MediCare Hospital modern campus"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A52]/20 to-transparent pointer-events-none" />
      </div>

      {/* Information Area */}
      <div className="p-3 xl:p-3.5 flex items-center justify-between gap-3 bg-white">
        <div className="flex items-start gap-2.5">
          <div className="pt-0.5 text-[#0878F9] shrink-0">
            <MapPin className="w-4.5 h-4.5 fill-[#EAF4FF]" />
          </div>
          <div>
            <h4 className="text-[13.5px] xl:text-[14px] font-bold text-[#102A52] leading-tight">
              Our Hospital
            </h4>
            <p className="text-[11px] xl:text-[11.5px] text-[#64748B] mt-0.5 leading-snug">
              Quality care, advanced technology, compassionate professionals.
            </p>
          </div>
        </div>

        {/* Circular Blue Arrow Button */}
        <button
          type="button"
          className="w-8 h-8 rounded-full bg-[#0878F9] group-hover:bg-[#0768D6] text-white flex items-center justify-center shrink-0 shadow-xs transition-colors"
          title="Learn more about our hospital"
        >
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
