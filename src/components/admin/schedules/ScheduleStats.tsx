import React from 'react';
import { Calendar, UserCheck, XCircle, Clock } from 'lucide-react';

interface ScheduleStatsProps {
  totalAppointments?: number | string;
  completed?: number | string;
  cancelled?: number | string;
  pending?: number | string;
  onFilterStatus?: (status: string) => void;
}

export const ScheduleStats: React.FC<ScheduleStatsProps> = ({
  totalAppointments = 0,
  completed = 0,
  cancelled = 0,
  pending = 0,
  onFilterStatus,
}) => {
  const cards = [
    {
      id: 'stat-total',
      title: 'Total Appointments',
      value: totalAppointments,
      subtext: 'Live timetable slots',
      icon: Calendar,
      iconBg: 'bg-[#EAF4FF]',
      iconColor: 'text-[#0868F5]',
      statusKey: 'All',
    },
    {
      id: 'stat-completed',
      title: 'Completed',
      value: completed,
      subtext: 'Confirmed & checked-in',
      icon: UserCheck,
      iconBg: 'bg-[#E8F8F0]',
      iconColor: 'text-[#19B879]',
      statusKey: 'Confirmed',
    },
    {
      id: 'stat-cancelled',
      title: 'Cancelled',
      value: cancelled,
      subtext: 'Voided bookings',
      icon: XCircle,
      iconBg: 'bg-[#FEF2F2]',
      iconColor: 'text-[#EF4444]',
      statusKey: 'Cancelled',
    },
    {
      id: 'stat-pending',
      title: 'Pending',
      value: pending,
      subtext: 'Awaiting triage',
      icon: Clock,
      iconBg: 'bg-[#F4F0FF]',
      iconColor: 'text-[#7C4DFF]',
      statusKey: 'Pending',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => onFilterStatus && onFilterStatus(card.statusKey)}
          className="bg-white rounded-[16px] border border-[#DCE9F8] p-5 shadow-[0_2px_8px_rgba(13,40,87,0.03)] hover:border-[#BBD8F5] transition-all cursor-pointer group select-none"
        >
          <div className="flex items-start justify-between">
            <div
              className={`w-11 h-11 rounded-[12px] ${card.iconBg} ${card.iconColor} flex items-center justify-center transition-transform group-hover:scale-105`}
            >
              <card.icon className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>

          <div className="mt-3">
            <span className="text-[13px] font-medium text-[#5273A8] block">
              {card.title}
            </span>
            <div className="text-[28px] font-bold text-[#0D2857] leading-tight mt-0.5">
              {card.value}
            </div>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[12px]">
            <span className="text-[#8AA3C6] font-normal">{card.subtext}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
