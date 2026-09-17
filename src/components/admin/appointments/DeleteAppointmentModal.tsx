import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Loader2, Calendar, Clock, User, UserCheck } from 'lucide-react';
import { Appointment } from '../../../types';

interface DeleteAppointmentModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  selectedIds?: string[];
  appointmentsList?: Appointment[];
  onClose: () => void;
  onConfirmDelete: (appointmentId: string) => Promise<void> | void;
  onConfirmBulkDelete?: (ids: string[]) => Promise<void> | void;
}

export const DeleteAppointmentModal: React.FC<DeleteAppointmentModalProps> = ({
  isOpen,
  appointment,
  selectedIds = [],
  appointmentsList = [],
  onClose,
  onConfirmDelete,
  onConfirmBulkDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isBulk = selectedIds.length > 0 && !appointment;

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (isBulk && onConfirmBulkDelete) {
        await onConfirmBulkDelete(selectedIds);
      } else if (appointment) {
        await onConfirmDelete(appointment.id);
      }
      onClose();
    } catch (err) {
      console.error('Failed to delete appointment:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="bg-white rounded-[16px] border border-[#E1EDF9] shadow-2xl max-w-md w-full p-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E1EDF9]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-[10px] bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center">
              <Trash2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#102A52]">
                {isBulk
                  ? `Delete ${selectedIds.length} Appointments`
                  : 'Delete Appointment Record'}
              </h3>
              <p className="text-[12px] text-[#DC2626] font-medium flex items-center gap-1 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Permanent removal from hospital database
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#102A52] hover:bg-[#F1F5F9] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Details */}
        <div className="mt-4 space-y-4 text-[13px]">
          <p className="text-[#5879A6] text-[12.5px] leading-relaxed">
            {isBulk ? (
              <>
                Are you sure you want to permanently delete{' '}
                <strong className="text-[#102A52]">{selectedIds.length} selected appointments</strong>?{' '}
                This will delete their records and release all reserved time slots.
              </>
            ) : appointment ? (
              <>
                Are you sure you want to permanently delete appointment{' '}
                <strong className="text-[#102A52] font-mono">{appointment.id}</strong>?{' '}
                This will immediately remove it from all doctor schedules and patient logs.
              </>
            ) : null}
          </p>

          {/* Single Appointment Card */}
          {appointment && (
            <div className="p-3.5 rounded-[12px] bg-[#FFF8F8] border border-[#FECACA] space-y-2 text-[12.5px]">
              <div className="flex items-center justify-between pb-2 border-b border-[#FEE2E2]">
                <span className="font-mono font-bold text-[#DC2626] text-[13px]">
                  {appointment.id}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white border border-[#FECACA] text-[#DC2626]">
                  {appointment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div>
                  <span className="text-[#991B1B] text-[11px] block font-medium">Patient</span>
                  <div className="font-bold text-[#102A52] truncate">
                    {appointment.patientName}
                  </div>
                  <div className="text-[#5879A6] text-[11px]">ID: {appointment.patientId}</div>
                </div>
                <div>
                  <span className="text-[#991B1B] text-[11px] block font-medium">Doctor</span>
                  <div className="font-bold text-[#102A52] truncate">
                    {appointment.doctorName}
                  </div>
                  <div className="text-[#5879A6] text-[11px]">{appointment.department}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#FEE2E2] flex items-center justify-between text-[11.5px] text-[#5879A6]">
                <span className="flex items-center gap-1 font-medium text-[#102A52]">
                  <Calendar className="w-3.5 h-3.5 text-[#DC2626]" />
                  {appointment.date}
                </span>
                <span className="flex items-center gap-1 font-medium text-[#102A52]">
                  <Clock className="w-3.5 h-3.5 text-[#DC2626]" />
                  {appointment.time}
                </span>
              </div>
            </div>
          )}

          {/* Bulk IDs preview */}
          {isBulk && selectedIds.length > 0 && (
            <div className="p-3 rounded-[10px] bg-[#F8FBFF] border border-[#E1EDF9] max-h-32 overflow-y-auto space-y-1 text-[12px]">
              <div className="text-[11px] font-bold text-[#5879A6] uppercase tracking-wider mb-1">
                Target Appointment IDs:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedIds.map((id) => (
                  <span
                    key={id}
                    className="px-2 py-0.5 rounded-md bg-white border border-[#CBD5E1] text-[#102A52] font-mono text-[11px] font-medium"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Warning notice */}
          <div className="p-3 rounded-[10px] bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-2.5 text-[12px] text-[#991B1B]">
            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Caution:</strong> Unlike cancelling, deleting removes the entire booking record from the system. If you want to keep an audit trail, consider cancelling instead.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E1EDF9] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="h-[38px] px-4 rounded-[9px] border border-[#E1EDF9] hover:bg-[#F8FBFF] text-[#5879A6] hover:text-[#102A52] font-semibold text-[13px] transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-[38px] px-5 rounded-[9px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-[13px] flex items-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-[0.99] disabled:opacity-70"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 stroke-[2.2]" />
                  <span>{isBulk ? `Delete ${selectedIds.length} Appointments` : 'Delete Permanently'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
