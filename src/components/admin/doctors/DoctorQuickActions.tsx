import React from 'react';
import {
  Zap,
  UserPlus,
  Clock,
  LayoutGrid,
  Calendar,
  ChevronRight
} from 'lucide-react';

interface DoctorQuickActionsProps {
  onAddDoctor: () => void;
  onSetAvailability: () => void;
  onManageDepartments: () => void;
  onViewSchedules: () => void;
}

export const DoctorQuickActions: React.FC<DoctorQuickActionsProps> = ({
  onAddDoctor,
  onSetAvailability,
  onManageDepartments,
  onViewSchedules,
}) => {
  const actions = [
    {
      id: 'add',
      title: 'Add Doctor',
      desc: 'Register a new doctor to the system',
      icon: UserPlus,
      onClick: onAddDoctor,
    },
    {
      id: 'avail',
      title: 'Set Availability',
      desc: 'Configure weekly or specific dates',
      icon: Clock,
      onClick: onSetAvailability,
    },
    {
      id: 'depts',
      title: 'Manage Departments',
      desc: 'View, reschedule or cancel appointments',
      icon: Calendar,
      onClick: onManageDepartments,
    },
    {
      id: 'schedules',
      title: 'View Doctor Schedules',
      desc: 'Check availability and working hours',
      icon: Calendar,
      onClick: onViewSchedules,
    },
  ];

  return (
    <div className="bg-white border border-[#DCEBFA] rounded-[14px] p-4 sm:p-5 shadow-[0_1px_3px_rgba(16,42,82,0.02)]">
      {/* Header with Lightning Bolt */}
      <div className="flex items-center gap-2 mb-3.5">
        <Zap className="w-4 h-4 text-[#0878F9] fill-[#0878F9]" />
        <h3 className="text-[14.5px] font-bold text-[#102A52]">Quick Actions</h3>
      </div>

      {/* Action Items List */}
      <div className="space-y-2.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className="w-full text-left p-2.5 sm:p-3 rounded-[10px] border border-[#EBF3FB] hover:border-[#BFDBFE] hover:bg-[#F8FBFF] flex items-center justify-between gap-3 transition-all duration-150 group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Circular Icon container with light blue tint */}
                <div className="w-9 h-9 rounded-full bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-4.5 h-4.5 stroke-[2]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold text-[#102A52] group-hover:text-[#0878F9] transition-colors truncate">
                    {action.title}
                  </div>
                  <div className="text-[11.5px] text-[#5879A6] truncate">
                    {action.desc}
                  </div>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0878F9] group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
