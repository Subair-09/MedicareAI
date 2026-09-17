import React, { useState } from 'react';
import { X, AlertTriangle, XCircle, Mail } from 'lucide-react';
import { Appointment } from '../../../types';

interface CancelAppointmentModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onConfirmCancel: (appointmentId: string, reason: string) => void;
}

export const CancelAppointmentModal: React.FC<CancelAppointmentModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState('Patient requested cancellation');
  const [notes, setNotes] = useState('');

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = notes.trim() ? `${reason} - ${notes.trim()}` : reason;
    onConfirmCancel(appointment.id, finalReason);
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
            <div className="w-9 h-9 rounded-[9px] bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#102A52]">
                Cancel Appointment
              </h3>
              <p className="text-[12px] text-[#5879A6] font-mono">
                {appointment.id} • {appointment.patientName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#102A52] hover:bg-[#F1F5F9]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-[13px]">
          <p className="text-[#5879A6] text-[12.5px] leading-relaxed">
            Are you sure you want to cancel the appointment for{' '}
            <strong className="text-[#102A52]">{appointment.patientName}</strong> on{' '}
            <strong className="text-[#102A52]">{appointment.date} at {appointment.time}</strong>?
            This will release the reserved doctor slot.
          </p>

          <div>
            <label className="block font-bold text-[#102A52] mb-1">
              Cancellation Reason *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#DC2626]"
            >
              <option value="Patient requested cancellation">
                Patient requested cancellation
              </option>
              <option value="Doctor emergency or unavailable">
                Doctor emergency or unavailable
              </option>
              <option value="Duplicate booking">
                Duplicate booking
              </option>
              <option value="Insurance or billing issue">
                Insurance or billing issue
              </option>
              <option value="Patient no-show">
                Patient no-show
              </option>
              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#102A52] mb-1">
              Internal Administrative Note (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add additional details for medical record..."
              className="w-full p-2.5 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#DC2626] text-[12.5px]"
            />
          </div>

          <div className="p-2.5 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] text-[12px] text-[#991B1B] flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span>
              A formal cancellation confirmation email will be delivered to the patient via Resend.
            </span>
          </div>

          <div className="pt-3 border-t border-[#E1EDF9] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[9px] border border-[#E1EDF9] text-[#5879A6] hover:bg-[#F8FBFF] hover:text-[#102A52] font-semibold cursor-pointer"
            >
              Keep Appointment
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-[9px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>Confirm Cancellation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
