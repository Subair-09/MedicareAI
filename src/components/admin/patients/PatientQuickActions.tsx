import React from 'react';
import { Zap, UserPlus, Search, ClipboardList, Printer, ChevronRight } from 'lucide-react';

interface PatientQuickActionsProps {
  onRegisterPatient: () => void;
  onFindPatient: () => void;
  onViewHistory: () => void;
  onPrintReport: () => void;
}

export const PatientQuickActions: React.FC<PatientQuickActionsProps> = ({
  onRegisterPatient,
  onFindPatient,
  onViewHistory,
  onPrintReport,
}) => {
  const actions = [
    {
      id: 'register',
      title: 'Register New Patient',
      desc: 'Add a new patient to the system',
      icon: UserPlus,
      onClick: onRegisterPatient,
    },
    {
      id: 'find',
      title: 'Find Patient',
      desc: 'Search existing patient records',
      icon: Search,
      onClick: onFindPatient,
    },
    {
      id: 'history',
      title: 'View Patient History',
      desc: 'Check medical history and visits',
      icon: ClipboardList,
      onClick: onViewHistory,
    },
    {
      id: 'print',
      title: 'Print Patient Report',
      desc: 'Generate and print patient details',
      icon: Printer,
      onClick: onPrintReport,
    },
  ];

  return (
    <div className="bg-white border border-[#DCEBFA] rounded-[16px] p-5 shadow-2xs">
      {/* Header with Lightning Icon */}
      <div className="flex items-center gap-2 mb-4">
        <div className="text-[#0868F5]">
          <Zap className="w-5 h-5 fill-[#0868F5]" />
        </div>
        <h3 className="text-[16px] font-bold text-[#0D2857]">
          Quick Actions
        </h3>
      </div>

      {/* Action Rows */}
      <div className="space-y-2.5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className="w-full p-3 rounded-[12px] border border-[#EAF2FA] hover:border-[#C4DCF6] hover:bg-[#F9FCFF] transition-all flex items-center justify-between group cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[10px] bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-[#0D2857] leading-tight">
                    {action.title}
                  </h4>
                  <p className="text-[11.5px] text-[#5273A8] mt-0.5 leading-snug">
                    {action.desc}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8AA3C6] group-hover:text-[#0868F5] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
