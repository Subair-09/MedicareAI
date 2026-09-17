import React from 'react';
import { AlertTriangle, Trash2, UserX, UserCheck } from 'lucide-react';
import { AdminDoctor } from '../../../types';

interface DoctorConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: AdminDoctor | null;
  type: 'delete' | 'deactivate' | 'activate';
  onConfirm: () => void;
}

export const DoctorConfirmationModal: React.FC<DoctorConfirmationModalProps> = ({
  isOpen,
  onClose,
  doctor,
  type,
  onConfirm,
}) => {
  if (!isOpen || !doctor) return null;

  const config = {
    delete: {
      title: 'Delete Doctor Record',
      description: `Are you sure you want to permanently remove ${doctor.name} (${doctor.id}) from the hospital system? This action cannot be undone.`,
      btnText: 'Delete Doctor',
      btnBg: 'bg-[#EF4444] hover:bg-[#DC2626]',
      icon: Trash2,
      iconBg: 'bg-[#FFECEF]',
      iconColor: 'text-[#EF4444]',
    },
    deactivate: {
      title: 'Deactivate Doctor',
      description: `Are you sure you want to deactivate ${doctor.name}? They will be marked as Inactive and removed from patient booking suggestions.`,
      btnText: 'Deactivate',
      btnBg: 'bg-[#F59E0B] hover:bg-[#D97706]',
      icon: UserX,
      iconBg: 'bg-[#FFF4DE]',
      iconColor: 'text-[#F59E0B]',
    },
    activate: {
      title: 'Activate Doctor',
      description: `Activate ${doctor.name} and restore their profile to active duty for patient bookings and scheduling?`,
      btnText: 'Activate Doctor',
      btnBg: 'bg-[#20B879] hover:bg-[#159A61]',
      icon: UserCheck,
      iconBg: 'bg-[#EAF8F1]',
      iconColor: 'text-[#20B879]',
    },
  }[type];

  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[16px] border border-[#DCEBFA] shadow-[0_20px_50px_rgba(16,42,82,0.18)] p-6 animate-fadeIn">
        <div className="flex items-center gap-3.5 mb-3">
          <div
            className={`w-11 h-11 rounded-full ${config.iconBg} ${config.iconColor} flex items-center justify-center shrink-0`}
          >
            <Icon className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-[#102A52]">{config.title}</h3>
            <p className="text-[12px] text-[#5879A6]">{doctor.department}</p>
          </div>
        </div>

        <p className="text-[13px] text-[#5879A6] leading-relaxed mb-6">
          {config.description}
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-[38px] px-4 rounded-[9px] border border-[#DCEBFA] bg-white text-[#5879A6] hover:text-[#102A52] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`h-[38px] px-5 rounded-[9px] ${config.btnBg} text-white text-[13px] font-bold shadow-2xs transition-colors cursor-pointer`}
          >
            {config.btnText}
          </button>
        </div>
      </div>
    </div>
  );
};
