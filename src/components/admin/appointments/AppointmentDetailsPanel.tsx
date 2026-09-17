import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  CheckCircle2,
  CalendarClock,
  XCircle,
  Printer,
  X,
  CreditCard,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../../../types';

interface AppointmentDetailsPanelProps {
  appointment: Appointment | null;
  onCloseMobile?: () => void;
  onOpenRescheduleModal: (appointment: Appointment) => void;
  onOpenCancelModal: (appointment: Appointment) => void;
  onOpenDeleteModal: (appointment: Appointment) => void;
  onMarkAsCompleted: (appointmentId: string) => void;
  onConfirmAppointment: (appointmentId: string) => void;
  onPrintSlip: (appointment: Appointment) => void;
}

export const AppointmentDetailsPanel: React.FC<AppointmentDetailsPanelProps> = ({
  appointment,
  onCloseMobile,
  onOpenRescheduleModal,
  onOpenCancelModal,
  onOpenDeleteModal,
  onMarkAsCompleted,
  onConfirmAppointment,
  onPrintSlip,
}) => {
  if (!appointment) {
    return (
      <div className="bg-white rounded-[14px] border border-[#E1EDF9] p-8 text-center shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-[#F0F5FA] flex items-center justify-center mx-auto mb-3 text-[#94A3B8]">
          <FileText className="w-6 h-6 stroke-[1.8]" />
        </div>
        <div className="text-[14px] font-bold text-[#102A52]">
          No appointment selected
        </div>
        <p className="text-[12.5px] text-[#5879A6] mt-1">
          Select any appointment in the table to inspect details and manage booking status.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#ECFDF5] text-[#059669]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#FFFBEB] text-[#D97706]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            Pending Approval
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#EFF6FF] text-[#2563EB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#FEF2F2] text-[#DC2626]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-[14px] border border-[#E1EDF9] shadow-2xs overflow-hidden flex flex-col divide-y divide-[#EBF2FA]">
      {/* 1. Header with Title & Appointment ID */}
      <div className="p-4 sm:p-5 flex items-center justify-between bg-[#F8FBFF]">
        <div>
          <div className="text-[14px] font-bold text-[#102A52] flex items-center gap-2">
            <span>Appointment Details</span>
            {getStatusBadge(appointment.status)}
          </div>
          <div className="text-[12px] font-semibold text-[#0878F9] mt-0.5 font-mono">
            {appointment.id}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPrintSlip(appointment)}
            className="p-1.5 rounded-lg text-[#5879A6] hover:text-[#102A52] hover:bg-[#EBF2F9] transition-colors cursor-pointer"
            title="Print Appointment Slip"
          >
            <Printer className="w-4 h-4" />
          </button>
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#5879A6] hover:text-[#102A52] hover:bg-[#EBF2F9] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Patient Profile Card */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3.5">
          {appointment.patientAvatar ? (
            <img
              src={appointment.patientAvatar}
              alt={appointment.patientName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border-2 border-[#E1EDF9] shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center font-bold text-[18px] border-2 border-[#E1EDF9] shrink-0">
              {appointment.patientName ? appointment.patientName.charAt(0).toUpperCase() : 'P'}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="text-[16px] font-bold text-[#102A52] truncate">
              {appointment.patientName}
            </h3>
            <p className="text-[12px] font-medium text-[#5879A6]">
              Patient ID: <span className="font-semibold text-[#102A52]">{appointment.patientId}</span>
            </p>

            {/* Demographic badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {appointment.patientGender && (
                <span className="px-2 py-0.5 rounded-[5px] bg-[#F1F5F9] text-[#475569] text-[11px] font-semibold">
                  {appointment.patientGender}
                </span>
              )}
              {appointment.patientAge ? (
                <span className="px-2 py-0.5 rounded-[5px] bg-[#F1F5F9] text-[#475569] text-[11px] font-semibold">
                  {appointment.patientAge} Years Old
                </span>
              ) : null}
              {appointment.patientBloodGroup && (
                <span className="px-2 py-0.5 rounded-[5px] bg-[#FEE2E2] text-[#B91C1C] text-[11px] font-bold">
                  Blood: {appointment.patientBloodGroup}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contact info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[12px]">
          {appointment.patientPhone && appointment.patientPhone !== '—' && (
            <a
              href={`tel:${appointment.patientPhone}`}
              className="flex items-center gap-2 p-2 rounded-[8px] bg-[#F8FBFF] border border-[#E1EDF9] text-[#102A52] hover:border-[#0878F9] hover:text-[#0878F9] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#0878F9] shrink-0" />
              <span className="truncate font-medium">{appointment.patientPhone}</span>
            </a>
          )}

          {appointment.patientEmail && appointment.patientEmail !== '—' && (
            <a
              href={`mailto:${appointment.patientEmail}`}
              className="flex items-center gap-2 p-2 rounded-[8px] bg-[#F8FBFF] border border-[#E1EDF9] text-[#102A52] hover:border-[#0878F9] hover:text-[#0878F9] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#0878F9] shrink-0" />
              <span className="truncate font-medium">{appointment.patientEmail}</span>
            </a>
          )}
        </div>

        {appointment.emergencyContact && appointment.emergencyContact !== '—' && (
          <div className="p-2.5 rounded-[8px] bg-[#FFFBEB] border border-[#FEF3C7] text-[11.5px] text-[#92400E] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#D97706]" />
            <span>
              <strong>Emergency:</strong> {appointment.emergencyContact}
            </span>
          </div>
        )}
      </div>

      {/* 3. Appointment Schedule & Doctor Details */}
      <div className="p-4 sm:p-5 space-y-3.5 text-[12.5px]">
        <div className="text-[11px] font-bold text-[#5879A6] uppercase tracking-wider">
          Visit Schedule & Location
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-[#5879A6]">
              <Calendar className="w-4 h-4 text-[#0878F9]" />
              <span>Date</span>
            </div>
            <span className="font-bold text-[#102A52]">{appointment.date}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-[#5879A6]">
              <Clock className="w-4 h-4 text-[#0878F9]" />
              <span>Time Slot</span>
            </div>
            <span className="font-bold text-[#102A52]">
              {appointment.time} {appointment.duration && `(${appointment.duration})`}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-[#F1F5F9]">
            <div className="flex items-center gap-2 text-[#5879A6]">
              <MapPin className="w-4 h-4 text-[#0878F9]" />
              <span>Department & Room</span>
            </div>
            <span className="font-bold text-[#102A52] text-right">
              {appointment.department} {appointment.room ? `• ${appointment.room}` : ''}
            </span>
          </div>

          {/* Assigned Doctor Card */}
          <div className="p-3 rounded-[10px] bg-[#F8FBFF] border border-[#E1EDF9] flex items-center justify-between mt-3">
            <div className="flex items-center gap-2.5">
              {appointment.doctorAvatar ? (
                <img
                  src={appointment.doctorAvatar}
                  alt={appointment.doctorName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-[#BFDBFE]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#EBF4FF] text-[#0878F9] flex items-center justify-center font-bold text-[14px] border border-[#BFDBFE]">
                  {appointment.doctorName ? appointment.doctorName.replace(/^Dr\.\s*/, '').charAt(0) : 'D'}
                </div>
              )}
              <div>
                <div className="font-bold text-[#102A52] text-[13px]">
                  {appointment.doctorName}
                </div>
                <div className="text-[11.5px] text-[#5879A6] font-medium">
                  {appointment.doctorSpecialty || appointment.department}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-[#0878F9] bg-[#EAF4FF] px-2 py-0.5 rounded-[5px]">
              Assigned
            </span>
          </div>

          {/* Payment & Insurance */}
          <div className="p-3 rounded-[10px] bg-[#F8FBFF] border border-[#E1EDF9] text-[12px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#5879A6] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#5879A6]" />
                Consultation Fee
              </span>
              <span className="font-bold text-[#102A52]">{appointment.fee || '—'}</span>
            </div>
            {appointment.insuranceProvider && appointment.insuranceProvider !== '—' && (
              <div className="text-[11px] text-[#5879A6]">
                Insurance: <span className="font-medium text-[#102A52]">{appointment.insuranceProvider}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. Clinical Notes & Visit Reason */}
      <div className="p-4 sm:p-5 space-y-2">
        <div className="text-[11px] font-bold text-[#5879A6] uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#5879A6]" />
          <span>Clinical Reason & Notes</span>
        </div>
        <div className="p-3 rounded-[10px] bg-[#F8FBFF] border border-[#E1EDF9] text-[12px] text-[#2D3E50] leading-relaxed">
          {appointment.notes || 'No specific clinical notes entered for this appointment.'}
        </div>
      </div>

      {/* 5. Action Buttons Footer */}
      <div className="p-4 sm:p-5 bg-[#F8FBFF] space-y-2">
        {appointment.status === 'Pending' && (
          <button
            type="button"
            onClick={() => onConfirmAppointment(appointment.id)}
            className="w-full h-[38px] rounded-[9px] bg-[#059669] hover:bg-[#047857] text-white text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Appointment</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
            <button
              type="button"
              onClick={() => onMarkAsCompleted(appointment.id)}
              className="h-[38px] rounded-[9px] bg-[#0878F9] hover:bg-[#0768D6] text-white text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete</span>
            </button>
          )}

          {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
            <button
              type="button"
              onClick={() => onOpenRescheduleModal(appointment)}
              className="h-[38px] rounded-[9px] bg-white border border-[#BFDBFE] hover:bg-[#F0F5FA] text-[#0878F9] text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <CalendarClock className="w-4 h-4" />
              <span>Reschedule</span>
            </button>
          )}
        </div>

        {appointment.status !== 'Cancelled' && (
          <button
            type="button"
            onClick={() => onOpenCancelModal(appointment)}
            className="w-full h-[36px] rounded-[9px] bg-white border border-[#FECACA] hover:bg-[#FEF2F2] text-[#DC2626] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancel Appointment</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => onOpenDeleteModal(appointment)}
          className="w-full h-[36px] rounded-[9px] bg-white border border-[#FCA5A5] hover:bg-[#FEF2F2] hover:border-[#DC2626] text-[#DC2626] text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Delete Record</span>
        </button>
      </div>
    </div>
  );
};
