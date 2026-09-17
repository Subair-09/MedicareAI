import React from 'react';
import { CalendarPlus, SlidersHorizontal, Calendar, Download } from 'lucide-react';

interface ScheduleQuickActionsProps {
  onAddSchedule: () => void;
  onManageAvailability: () => void;
  onViewCalendar: () => void;
  onExportSchedule: () => void;
}

export const ScheduleQuickActions: React.FC<ScheduleQuickActionsProps> = ({
  onAddSchedule,
  onManageAvailability,
  onViewCalendar,
  onExportSchedule,
}) => {
  const actions = [
    {
      id: 'action-add',
      title: 'Add Schedule',
      description: 'Create a new schedule',
      icon: CalendarPlus,
      onClick: onAddSchedule,
    },
    {
      id: 'action-availability',
      title: 'Manage Availability',
      description: 'Set doctor working hours',
      icon: SlidersHorizontal,
      onClick: onManageAvailability,
    },
    {
      id: 'action-calendar',
      title: 'View Calendar',
      description: 'Open full calendar view',
      icon: Calendar,
      onClick: onViewCalendar,
    },
    {
      id: 'action-export',
      title: 'Export Schedule',
      description: 'Download schedule (PDF/Excel)',
      icon: Download,
      onClick: onExportSchedule,
    },
  ];

  return (
    <div className="bg-white rounded-[16px] border border-[#DCE9F8] p-5 shadow-[0_2px_8px_rgba(13,40,87,0.03)] text-left">
      <h3 className="text-[15px] font-bold text-[#0D2857] pb-3.5 border-b border-[#EAF2FB]">
        Quick Actions
      </h3>

      <div className="divide-y divide-[#EAF2FB]">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={action.onClick}
            className="w-full py-3.5 flex items-center gap-3.5 hover:bg-[#F9FCFF] -mx-2 px-2 rounded-[10px] transition-colors text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center shrink-0 group-hover:bg-[#0868F5] group-hover:text-white transition-colors">
              <action.icon className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-bold text-[#0D2857] group-hover:text-[#0868F5] transition-colors leading-snug">
                {action.title}
              </div>
              <div className="text-[11.5px] text-[#5273A8] leading-tight mt-0.5">
                {action.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const ScheduleInfoCard: React.FC = () => {
  return (
    <div className="bg-[#F0F6FE] border border-[#DCE9F8] rounded-[16px] p-5 shadow-[0_2px_8px_rgba(13,40,87,0.02)] text-left">
      <div className="flex items-start gap-3.5">
        <div className="w-11 h-11 rounded-full bg-white border border-[#D0E3F9] text-[#0868F5] flex items-center justify-center shrink-0 shadow-2xs">
          <Calendar className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div>
          <h4 className="text-[14.5px] font-bold text-[#0D2857] leading-snug">
            Efficient Scheduling,<br />Better Care
          </h4>
          <p className="text-[12px] text-[#5273A8] mt-1.5 leading-relaxed">
            Keep your hospital running smoothly with smart scheduling tools.
          </p>
        </div>
      </div>
    </div>
  );
};
