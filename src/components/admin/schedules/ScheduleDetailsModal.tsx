import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  XCircle,
  Printer,
  Trash2,
} from 'lucide-react';
import { ScheduleAppointment, ScheduleStatus } from '../../../types';

interface ScheduleDetailsModalProps {
  appointment: ScheduleAppointment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (appointmentId: string, newStatus: ScheduleStatus) => void;
  onDeleteSchedule?: (appointmentId: string) => void;
  onPrintSlip?: (appointment: ScheduleAppointment) => void;
}

export const ScheduleDetailsModal: React.FC<ScheduleDetailsModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onUpdateStatus,
  onDeleteSchedule,
  onPrintSlip,
}) => {
  if (!isOpen || !appointment) return null;

  const handlePrint = () => {
    if (onPrintSlip) {
      onPrintSlip(appointment);
    } else {
      window.print();
    }
  };

  const handleDelete = () => {
    if (onDeleteSchedule) {
      onDeleteSchedule(appointment.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[20px] border border-[#DCE9F8] shadow-[0_20px_50px_rgba(13,40,87,0.18)] max-w-lg w-full overflow-hidden text-left">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#EAF2FB] flex items-center justify-between bg-[#F8FBFF]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center shadow-2xs">
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#0D2857]">
                Appointment Details
              </h3>
              <p className="text-[12px] text-[#5273A8]">
                Schedule Slot: {appointment.date} • {appointment.time}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5273A8] hover:bg-[#EAF4FF] hover:text-[#0D2857] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Patient Card */}
          <div className="bg-[#F8FBFF] border border-[#EAF2FB] rounded-[14px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {appointment.patientAvatar ? (
                <img
                  src={appointment.patientAvatar}
                  alt={appointment.patientName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border border-[#DCE9F8]"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold text-[16px] flex items-center justify-center border border-[#DCE9F8] shrink-0">
                  {appointment.patientName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <span className="text-[11px] font-semibold text-[#0868F5] uppercase tracking-wider block">
                  Patient
                </span>
                <h4 className="text-[16px] font-bold text-[#0D2857]">
                  {appointment.patientName}
                </h4>
                <p className="text-[12px] text-[#5273A8]">
                  {appointment.department}
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 text-[11px] font-bold rounded-full border ${
                appointment.status === 'Confirmed'
                  ? 'bg-[#E8F8F0] text-[#19B879] border-[#B7EDD2]'
                  : appointment.status === 'Pending'
                  ? 'bg-[#FEF7EA] text-[#C05621] border-[#FDE6C2]'
                  : appointment.status === 'Checked-in'
                  ? 'bg-[#EEF6FF] text-[#0868F5] border-[#CDE3FF]'
                  : appointment.status === 'Rescheduled'
                  ? 'bg-[#F4F0FF] text-[#6938EF] border-[#DDD0FF]'
                  : 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
              }`}
            >
              {appointment.status}
            </span>
          </div>

          {/* Schedule Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <div className="p-3 bg-[#FAFCFF] rounded-[10px] border border-[#EAF2FB]">
              <div className="flex items-center gap-2 text-[#5273A8] text-[11.5px] mb-1">
                <Stethoscope className="w-4 h-4 text-[#0868F5]" />
                <span>Doctor</span>
              </div>
              <span className="font-bold text-[#0D2857]">
                {appointment.doctorName || 'Dr. Sarah Johnson'}
              </span>
            </div>

            <div className="p-3 bg-[#FAFCFF] rounded-[10px] border border-[#EAF2FB]">
              <div className="flex items-center gap-2 text-[#5273A8] text-[11.5px] mb-1">
                <Clock className="w-4 h-4 text-[#0868F5]" />
                <span>Time & Duration</span>
              </div>
              <span className="font-bold text-[#0D2857]">
                {appointment.time} ({appointment.duration || '30 mins'})
              </span>
            </div>

            <div className="p-3 bg-[#FAFCFF] rounded-[10px] border border-[#EAF2FB]">
              <div className="flex items-center gap-2 text-[#5273A8] text-[11.5px] mb-1">
                <Calendar className="w-4 h-4 text-[#0868F5]" />
                <span>Date & Day</span>
              </div>
              <span className="font-bold text-[#0D2857]">
                {appointment.dayOfWeek}, {appointment.date}
              </span>
            </div>

            <div className="p-3 bg-[#FAFCFF] rounded-[10px] border border-[#EAF2FB]">
              <div className="flex items-center gap-2 text-[#5273A8] text-[11.5px] mb-1">
                <MapPin className="w-4 h-4 text-[#0868F5]" />
                <span>Room / Clinic</span>
              </div>
              <span className="font-bold text-[#0D2857]">
                {appointment.room || 'Suite 402 - Heart Center'}
              </span>
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="p-3.5 bg-[#F8FBFF] rounded-[12px] border border-[#EAF2FB] space-y-1">
            <span className="text-[11.5px] font-bold text-[#5273A8] uppercase tracking-wider block">
              Consultation Notes
            </span>
            <p className="text-[12.5px] text-[#0D2857] leading-relaxed">
              {appointment.notes ||
                'Routine clinical appointment scheduled via hospital management system.'}
            </p>
          </div>

          {/* Quick Status Action Buttons */}
          <div>
            <span className="text-[12px] font-bold text-[#0D2857] block mb-2">
              Update Appointment Status
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onUpdateStatus(appointment.id, 'Checked-in')}
                className={`px-3 py-2 rounded-[8px] text-[11.5px] font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  appointment.status === 'Checked-in'
                    ? 'bg-[#0868F5] text-white border-[#0868F5]'
                    : 'bg-[#EEF6FF] text-[#0868F5] border-[#CDE3FF] hover:bg-[#E0EFFF]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Check-in</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateStatus(appointment.id, 'Confirmed')}
                className={`px-3 py-2 rounded-[8px] text-[11.5px] font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  appointment.status === 'Confirmed'
                    ? 'bg-[#19B879] text-white border-[#19B879]'
                    : 'bg-[#E8F8F0] text-[#19B879] border-[#B7EDD2] hover:bg-[#D7F4E5]'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateStatus(appointment.id, 'Rescheduled')}
                className={`px-3 py-2 rounded-[8px] text-[11.5px] font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  appointment.status === 'Rescheduled'
                    ? 'bg-[#7C4DFF] text-white border-[#7C4DFF]'
                    : 'bg-[#F4F0FF] text-[#6938EF] border-[#DDD0FF] hover:bg-[#ECE5FF]'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reschedule</span>
              </button>

              <button
                type="button"
                onClick={() => onUpdateStatus(appointment.id, 'Cancelled')}
                className={`px-3 py-2 rounded-[8px] text-[11.5px] font-semibold border flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  appointment.status === 'Cancelled'
                    ? 'bg-[#EF4444] text-white border-[#EF4444]'
                    : 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA] hover:bg-[#FEE2E2]'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EAF2FB] flex items-center justify-between bg-[#F8FBFF]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="h-[38px] px-3.5 rounded-[8px] border border-[#DCE9F8] bg-white hover:bg-[#F0F6FE] text-[#0868F5] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
            {onDeleteSchedule && (
              <button
                type="button"
                onClick={handleDelete}
                className="h-[38px] px-3.5 rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-[38px] px-5 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[12.5px] font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
