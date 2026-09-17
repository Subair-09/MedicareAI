import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Loader2, User, Phone, Mail, Building } from 'lucide-react';
import { AdminPatient } from '../../../types';

interface DeletePatientModalProps {
  isOpen: boolean;
  patient: AdminPatient | null;
  selectedIds?: string[];
  patientsList?: AdminPatient[];
  onClose: () => void;
  onConfirmDelete: (patientId: string) => Promise<void> | void;
  onConfirmBulkDelete?: (ids: string[]) => Promise<void> | void;
}

export const DeletePatientModal: React.FC<DeletePatientModalProps> = ({
  isOpen,
  patient,
  selectedIds = [],
  patientsList = [],
  onClose,
  onConfirmDelete,
  onConfirmBulkDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isBulk = selectedIds.length > 0 && !patient;

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (isBulk && onConfirmBulkDelete) {
        await onConfirmBulkDelete(selectedIds);
      } else if (patient) {
        await onConfirmDelete(patient.id);
      }
      onClose();
    } catch (err) {
      console.error('Failed to delete patient:', err);
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
                  ? `Delete ${selectedIds.length} Patient Records`
                  : 'Delete Patient Record'}
              </h3>
              <p className="text-[12px] text-[#DC2626] font-medium flex items-center gap-1 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Permanent removal from database
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
                <strong className="text-[#102A52]">{selectedIds.length} selected patients</strong>?{' '}
                This action cannot be undone.
              </>
            ) : patient ? (
              <>
                Are you sure you want to permanently delete the patient file for{' '}
                <strong className="text-[#102A52]">{patient.name}</strong> (
                <span className="font-mono text-[#0868F5]">{patient.patientId || patient.id}</span>)?
              </>
            ) : null}
          </p>

          {/* Single Patient Preview Card */}
          {patient && (
            <div className="bg-[#F8FBFF] rounded-[10px] p-3.5 border border-[#E1EDF9] space-y-2">
              <div className="flex items-center gap-2 text-[#102A52] font-semibold text-[13.5px]">
                <User className="w-4 h-4 text-[#0868F5]" />
                <span>{patient.name}</span>
                {patient.gender && (
                  <span className="text-[11px] font-normal text-[#64748B]">
                    • {patient.gender}, {patient.age || 'N/A'} yrs
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#5879A6]">
                {patient.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#94A3B8]" />
                    <span>{patient.phone}</span>
                  </div>
                )}
                {patient.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#94A3B8]" />
                    <span>{patient.email}</span>
                  </div>
                )}
                {patient.department && (
                  <div className="flex items-center gap-1">
                    <Building className="w-3 h-3 text-[#94A3B8]" />
                    <span>{patient.department}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bulk Summary Card */}
          {isBulk && (
            <div className="bg-[#F8FAFC] rounded-[10px] p-3 border border-[#E2E8F0] max-h-36 overflow-y-auto space-y-1.5 [scrollbar-width:thin]">
              {selectedIds.map((id) => {
                const found = patientsList.find((p) => p.id === id);
                return (
                  <div key={id} className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-[#1E293B]">
                      {found?.name || id}
                    </span>
                    <span className="font-mono text-[11px] text-[#64748B]">
                      {found?.patientId || id}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-[#FFF8F8] border border-[#FECACA] rounded-[10px] p-3 text-[12px] text-[#991B1B] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Permanent Deletion</p>
              <p className="mt-0.5 leading-normal">
                This record will be completely erased from the hospital database and cannot be recovered.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-[8px] border border-[#E1EDF9] text-[#5879A6] hover:bg-[#F8FAFC] hover:text-[#102A52] font-semibold text-[13px] transition-colors cursor-pointer disabled:opacity-50"
          >
            Keep Record
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-[38px] px-4 rounded-[8px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[13px] font-bold flex items-center gap-1.5 transition-all shadow-2xs active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{isBulk ? `Delete ${selectedIds.length} Records` : 'Delete Patient'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
