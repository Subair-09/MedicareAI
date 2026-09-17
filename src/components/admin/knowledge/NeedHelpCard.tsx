import React from 'react';
import { Lightbulb } from 'lucide-react';

interface NeedHelpCardProps {
  onContactSupport: () => void;
}

export const NeedHelpCard: React.FC<NeedHelpCardProps> = ({ onContactSupport }) => {
  return (
    <div className="bg-[#F6FAFE] border border-[#DCE9F8] rounded-[18px] p-5.5 text-center shadow-[0_2px_8px_rgba(13,40,87,0.02)]">
      {/* Lightbulb Icon in white circular container */}
      <div className="w-11 h-11 rounded-full bg-white border border-[#DCE9F8] text-[#0868F5] flex items-center justify-center mx-auto mb-3 shadow-xs">
        <Lightbulb className="w-5 h-5 stroke-[2.2]" />
      </div>

      <h4 className="text-[15px] font-bold text-[#0B285C]">
        Need Help?
      </h4>
      <p className="text-[12px] text-[#5475A7] mt-1.5 leading-relaxed max-w-[240px] mx-auto">
        Upload hospital documents or contact support for assistance.
      </p>

      <button
        type="button"
        onClick={onContactSupport}
        className="mt-4 w-full py-2 px-4 rounded-[8px] bg-white border border-[#0868F5] text-[#0868F5] hover:bg-[#EAF4FF] active:scale-[0.99] text-[13px] font-semibold transition-all shadow-2xs cursor-pointer"
      >
        Contact Support
      </button>
    </div>
  );
};
