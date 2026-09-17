import React from 'react';
import { CheckCircle2, Mail } from 'lucide-react';

interface BookingSuccessCardProps {
  appointmentId?: string;
  onViewAppointments?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
}

export const BookingSuccessCard: React.FC<BookingSuccessCardProps> = ({
  appointmentId = '',
  onViewAppointments,
  onReschedule,
  onCancel
}) => {
  return (
    <div className="text-left">
      {/* Green Header */}
      <div className="flex items-center gap-2 text-[#20B879]">
        <CheckCircle2 className="w-5 h-5 shrink-0 fill-[#EAF9F1] text-[#20B879]" />
        <h4 className="text-[14.5px] sm:text-[15px] font-bold leading-tight">
          Your appointment has been booked successfully!
        </h4>
      </div>

      {/* Info text */}
      <div className="mt-2 text-[13px] text-[#102A52]">
        <div className="font-semibold text-[#102A52]">
          Appointment ID: <span className="text-[#0878F9]">{appointmentId}</span>
        </div>
        <p className="text-[#64748B] text-[12.5px] mt-1 flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5 text-[#0878F9] shrink-0" />
          <span>A confirmation email with clinic guidelines was sent via Resend.</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-3.5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onViewAppointments}
          className="px-4 py-1.5 rounded-full bg-white hover:bg-[#F5FAFF] border border-[#D0E6FC] text-[#0878F9] text-[12.5px] font-semibold transition-colors cursor-pointer shadow-2xs"
        >
          View My Appointments
        </button>
        <button
          type="button"
          onClick={onReschedule}
          className="px-4 py-1.5 rounded-full bg-white hover:bg-[#F5FAFF] border border-[#D0E6FC] text-[#0878F9] text-[12.5px] font-semibold transition-colors cursor-pointer shadow-2xs"
        >
          Reschedule
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 rounded-full bg-white hover:bg-[#F5FAFF] border border-[#D0E6FC] text-[#0878F9] text-[12.5px] font-semibold transition-colors cursor-pointer shadow-2xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
