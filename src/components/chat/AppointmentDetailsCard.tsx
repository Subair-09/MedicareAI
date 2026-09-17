import React from 'react';
import { User, Calendar, MapPin, CreditCard, HeartPulse, Phone } from 'lucide-react';

interface AppointmentDetailsCardProps {
  doctorName?: string;
  doctorSpecialty?: string;
  dateStr?: string;
  timeStr?: string;
  location?: string;
  room?: string;
  patientName?: string;
  patientPhone?: string;
  fee?: string;
  reasonForVisit?: string;
}

export const AppointmentDetailsCard: React.FC<AppointmentDetailsCardProps> = ({
  doctorName = 'Consultant Physician',
  doctorSpecialty = 'Specialist',
  dateStr = '',
  timeStr = '',
  location = 'MediCare Hospital',
  room = 'Consultation Suite',
  patientName,
  patientPhone,
  fee = '$150',
  reasonForVisit,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2EEFC] p-3.5 sm:p-4.5 text-left shadow-xs space-y-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAF2FC] gap-3 sm:gap-0">
        
        {/* Col 1: Doctor */}
        <div className="flex items-center gap-3 sm:pr-4">
          <div className="w-9 h-9 rounded-xl bg-[#EAF4FF] flex items-center justify-center text-[#0878F9] shrink-0">
            <User className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-[10.5px] uppercase font-semibold text-[#94A3B8] tracking-wider">
              Doctor
            </div>
            <div className="text-[13.5px] font-bold text-[#102A52] leading-tight mt-0.5">
              {doctorName}
            </div>
            <div className="text-[11.5px] text-[#64748B] mt-0.5">
              {doctorSpecialty}
            </div>
          </div>
        </div>

        {/* Col 2: Date & Time */}
        <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-4">
          <div className="w-9 h-9 rounded-xl bg-[#EAF4FF] flex items-center justify-center text-[#0878F9] shrink-0">
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-[10.5px] uppercase font-semibold text-[#94A3B8] tracking-wider">
              Date & Time
            </div>
            <div className="text-[13.5px] font-bold text-[#102A52] leading-tight mt-0.5">
              {dateStr}
            </div>
            <div className="text-[11.5px] text-[#64748B] mt-0.5">
              {timeStr}
            </div>
          </div>
        </div>

        {/* Col 3: Location & Fee */}
        <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:pl-4">
          <div className="w-9 h-9 rounded-xl bg-[#EAF4FF] flex items-center justify-center text-[#0878F9] shrink-0">
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-[10.5px] uppercase font-semibold text-[#94A3B8] tracking-wider">
              Location & Fee
            </div>
            <div className="text-[13.5px] font-bold text-[#102A52] leading-tight mt-0.5">
              {location}
            </div>
            <div className="text-[11.5px] text-[#64748B] mt-0.5 flex items-center gap-1.5">
              <span>{room}</span>
              <span className="font-semibold text-[#20B879]">({fee})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Patient & Reason Row */}
      {(patientName || reasonForVisit) && (
        <div className="pt-3 border-t border-[#F0F5FA] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[12.5px] bg-[#F8FAFC] -mx-3.5 -mb-3.5 sm:-mx-4.5 sm:-mb-4.5 p-3 rounded-b-2xl">
          {patientName && (
            <div className="flex items-center gap-1.5 text-[#102A52]">
              <span className="font-semibold text-[#64748B]">Patient:</span>
              <span className="font-bold text-[#102A52]">{patientName}</span>
              {patientPhone && (
                <span className="text-[#64748B]">({patientPhone})</span>
              )}
            </div>
          )}
          {reasonForVisit && (
            <div className="flex items-center gap-1.5 text-[#64748B] truncate max-w-md">
              <span className="font-semibold">Reason:</span>
              <span className="truncate italic text-[#102A52]">{reasonForVisit}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
