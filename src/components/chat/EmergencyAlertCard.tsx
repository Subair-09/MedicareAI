import React from 'react';
import { AlertTriangle, PhoneCall, MapPin, ShieldAlert } from 'lucide-react';

interface EmergencyAlertCardProps {
  title?: string;
  message?: string;
  hotline?: string;
  actionText?: string;
  onCallHotline?: () => void;
  onViewLocation?: () => void;
}

export const EmergencyAlertCard: React.FC<EmergencyAlertCardProps> = ({
  title = 'Immediate Emergency Medical Attention Required',
  message = 'The symptoms you described may indicate an acute life-threatening medical condition. Please do not wait for a routine appointment.',
  hotline = '1-800-MEDICARE or 911',
  actionText = 'Call Emergency Response Now',
  onCallHotline,
  onViewLocation,
}) => {
  return (
    <div className="bg-[#FFF5F5] border-2 border-[#EF4444] rounded-2xl p-4 sm:p-5 text-left shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#DC2626] text-white">
              Critical Alert
            </span>
            <span className="text-[12px] font-semibold text-[#DC2626]">
              24/7 Trauma Protocol
            </span>
          </div>
          <h4 className="text-[15px] sm:text-[16px] font-bold text-[#991B1B] mt-1 leading-snug">
            {title}
          </h4>
          <p className="text-[13px] text-[#7F1D1D] mt-1.5 leading-relaxed">
            {message}
          </p>

          <div className="mt-3.5 p-3 rounded-xl bg-white/80 border border-[#FCA5A5] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="text-[11px] uppercase font-bold text-[#991B1B] tracking-wider">
                Emergency Hotline (Toll-Free 24/7)
              </div>
              <div className="text-[15px] font-extrabold text-[#DC2626]">
                {hotline}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="tel:911"
                className="px-3.5 py-1.5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[12.5px] font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 911</span>
              </a>
              <a
                href="tel:18006334227"
                className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-[#FEF2F2] border border-[#DC2626] text-[#DC2626] text-[12.5px] font-bold flex items-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>1-800-MEDICARE</span>
              </a>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[12px] text-[#991B1B]">
            <MapPin className="w-4 h-4 shrink-0 text-[#DC2626]" />
            <span>
              <strong>MediCare Emergency Department:</strong> Main Campus, Wing E Ground Floor (24 Hours Open)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
