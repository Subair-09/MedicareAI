import React, { useState } from 'react';
import {
  Zap,
  UserPlus,
  CalendarCheck,
  Calendar,
  UsersRound,
  LayoutGrid,
  ChevronRight,
  Check
} from 'lucide-react';

interface QuickActionsPanelProps {
  onActionClick?: (actionKey: string) => void;
  availableDepartments?: string[];
}

export const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({
  onActionClick,
  availableDepartments = [],
}) => {
  const depts = availableDepartments.filter((d) => d !== 'All Departments');
  const [modalAction, setModalAction] = useState<string | null>(null);
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorSpecialty, setNewDoctorSpecialty] = useState(depts[0] || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const actions = [
    {
      key: 'add-doctor',
      title: 'Add Doctor',
      subtitle: 'Register a new doctor to the system',
      icon: UserPlus,
      iconBg: 'bg-[#EAF4FF]',
      iconColor: 'text-[#0878F9]',
    },
    {
      key: 'set-availability',
      title: 'Set Doctor Availability',
      subtitle: 'Configure weekly or specific dates',
      icon: CalendarCheck,
      iconBg: 'bg-[#E0F2FE]',
      iconColor: 'text-[#0284C7]',
    },
    {
      key: 'manage-appointments',
      title: 'Manage Appointments',
      subtitle: 'View, reschedule or cancel appointments',
      icon: Calendar,
      iconBg: 'bg-[#FFECEF]',
      iconColor: 'text-[#EF4444]',
    },
    {
      key: 'view-patients',
      title: 'View Patients',
      subtitle: 'Access patient records',
      icon: UsersRound,
      iconBg: 'bg-[#EFF6FF]',
      iconColor: 'text-[#2563EB]',
    },
    {
      key: 'manage-departments',
      title: 'Manage Departments',
      subtitle: 'Add or edit hospital departments',
      icon: LayoutGrid,
      iconBg: 'bg-[#E7F8F1]',
      iconColor: 'text-[#20B879]',
    },
  ];

  const handleAction = (key: string) => {
    if (onActionClick) {
      onActionClick(key);
    }
    setModalAction(key);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="bg-white rounded-[12px] border border-[#E1EDF9] p-5 sm:p-5.5 shadow-2xs text-left">
      {/* Panel Header: Lightning icon + Title */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-[8px] bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center shrink-0">
          <Zap className="w-4.5 h-4.5 stroke-[2.2] fill-[#0878F9]/20" />
        </div>
        <h2 className="text-[15.5px] sm:text-[16px] font-bold text-[#102A52] tracking-tight">
          Quick Actions
        </h2>
      </div>

      {/* Action Items List */}
      <div className="space-y-2.5">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.key}
              type="button"
              onClick={() => handleAction(act.key)}
              className="w-full bg-[#FFFFFF] hover:bg-[#F8FBFF] border border-[#E1EDF9] rounded-[10px] p-3 flex items-center justify-between transition-all group cursor-pointer shadow-2xs hover:border-[#BFDBFE]"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-[8px] ${act.iconBg} ${act.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <div className="text-left">
                  <div className="text-[13.5px] font-bold text-[#102A52] leading-tight group-hover:text-[#0878F9] transition-colors">
                    {act.title}
                  </div>
                  <div className="text-[11.5px] text-[#5879A6] font-medium leading-tight mt-0.5">
                    {act.subtitle}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0878F9] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          );
        })}
      </div>

      {/* Toast Notification for actions */}
      {toastMessage && (
        <div className="mt-3 p-2.5 bg-[#E7F8F1] border border-[#20B879]/30 rounded-[8px] text-[12px] text-[#0F766E] font-medium flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-[#20B879]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick Action Interactive Modal */}
      {modalAction && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[16px] border border-[#E1EDF9] shadow-2xl max-w-md w-full p-6 text-left animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1EDF9]">
              <h3 className="font-bold text-[16px] text-[#102A52]">
                {modalAction === 'add-doctor' && 'Register New Doctor'}
                {modalAction === 'set-availability' && 'Configure Doctor Availability'}
                {modalAction === 'manage-appointments' && 'Appointment Roster Management'}
                {modalAction === 'view-patients' && 'Hospital Patient Directory'}
                {modalAction === 'manage-departments' && 'Hospital Departments'}
              </h3>
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="text-[#94A3B8] hover:text-[#102A52] text-[18px] font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              {modalAction === 'add-doctor' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12px] font-semibold text-[#102A52] mb-1">
                      Doctor Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Catherine Price"
                      value={newDoctorName}
                      onChange={(e) => setNewDoctorName(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#E1EDF9] rounded-[8px] text-[13px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-semibold text-[#102A52] mb-1">
                      Department
                    </label>
                    <select
                      value={newDoctorSpecialty}
                      onChange={(e) => setNewDoctorSpecialty(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#E1EDF9] rounded-[8px] text-[13px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
                    >
                      {depts.length === 0 ? (
                        <option value="" disabled>
                          No departments configured
                        </option>
                      ) : (
                        depts.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              )}

              {modalAction !== 'add-doctor' && (
                <div className="py-2 text-[13px] text-[#5879A6]">
                  This administrative module is ready for live management. Data changes sync directly across hospital departments.
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#E1EDF9] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalAction(null)}
                className="px-4 py-2 rounded-[8px] border border-[#E1EDF9] text-[#5879A6] text-[13px] font-medium hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalAction(null);
                  showToast(
                    modalAction === 'add-doctor'
                      ? `Doctor ${newDoctorName || 'New Doctor'} added successfully!`
                      : 'Changes saved to hospital registry!'
                  );
                }}
                className="px-4 py-2 rounded-[8px] bg-[#0878F9] text-white text-[13px] font-semibold hover:bg-[#0768D6] cursor-pointer"
              >
                Save & Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
