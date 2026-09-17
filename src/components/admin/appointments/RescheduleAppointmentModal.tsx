import React, { useState } from 'react';
import { X, CalendarClock, Check, Mail } from 'lucide-react';
import { Appointment } from '../../../types';

interface RescheduleAppointmentModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirmReschedule: (appointmentId: string, newDate: string, newTime: string, reason?: string) => void;
}

export const RescheduleAppointmentModal: React.FC<RescheduleAppointmentModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onConfirmReschedule,
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [newDate, setNewDate] = useState(defaultDateStr);
  const [newTime, setNewTime] = useState('10:00 AM');
  const [reason, setReason] = useState('');

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let formattedDate = newDate;
    try {
      const dObj = new Date(newDate + 'T00:00:00');
      if (!isNaN(dObj.getTime())) {
        formattedDate = dObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch {
      // keep fallback
    }

    onConfirmReschedule(appointment.id, formattedDate, newTime, reason.trim() || undefined);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[16px] border border-[#E1EDF9] shadow-2xl max-w-md w-full p-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E1EDF9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[9px] bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center">
              <CalendarClock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#102A52]">
                Reschedule Appointment
              </h3>
              <p className="text-[12px] text-[#5879A6] font-mono">
                {appointment.id} • {appointment.patientName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#102A52] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-[13px]">
          <div className="p-3 rounded-[9px] bg-[#F8FBFF] border border-[#E1EDF9]">
            <span className="text-[11.5px] font-bold text-[#5879A6] uppercase tracking-wider block mb-1">
              Current Booking
            </span>
            <div className="text-[13px] font-semibold text-[#102A52]">
              {appointment.date} at {appointment.time}
            </div>
            <div className="text-[12px] text-[#5879A6]">
              With {appointment.doctorName} ({appointment.department})
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#102A52] mb-1">
              New Date *
            </label>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9] text-[13px]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#102A52] mb-1">
              New Time Slot
            </label>
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
            >
              <option value="08:30 AM">08:30 AM</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="09:30 AM">09:30 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="10:30 AM">10:30 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="01:30 PM">01:30 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="02:30 PM">02:30 PM</option>
              <option value="03:30 PM">03:30 PM</option>
              <option value="04:30 PM">04:30 PM</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#102A52] mb-1">
              Reschedule Reason (Optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Patient schedule conflict, doctor unavailable"
              className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
            />
          </div>

          <div className="p-2.5 rounded-[10px] bg-[#F0F7FF] border border-[#BFDBFE] text-[12px] text-[#1E40AF] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#0878F9] shrink-0" />
            <span>
              An automated reschedule confirmation email will be sent to the patient via Resend.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E1EDF9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[10px] border border-[#E1EDF9] text-[#5879A6] hover:bg-[#F8FAFC] font-semibold cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-4.5 py-2 rounded-[10px] bg-[#0878F9] hover:bg-[#0768D6] text-white font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Confirm New Date</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
