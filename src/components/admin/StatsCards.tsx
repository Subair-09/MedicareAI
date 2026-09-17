import React from 'react';
import {
  Calendar,
  CalendarClock,
  UserRound,
  LayoutGrid,
  XCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface StatsCardsProps {
  todayAppointmentsCount?: number;
  upcomingAppointmentsCount?: number;
  totalDoctorsCount?: number;
  departmentsCount?: number;
  cancelledAppointmentsCount?: number;
  onCardClick?: (statId: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  todayAppointmentsCount = 0,
  upcomingAppointmentsCount = 0,
  totalDoctorsCount = 0,
  departmentsCount = 0,
  cancelledAppointmentsCount = 0,
  onCardClick,
}) => {
  const stats = [
    {
      id: 'today-appointments',
      title: "Today's Appointments",
      value: todayAppointmentsCount.toString(),
      badgeText: todayAppointmentsCount > 0 ? 'Active' : 'None scheduled',
      badgeType: todayAppointmentsCount > 0 ? ('positive' as const) : ('neutral' as const),
      comparison: 'scheduled for today',
      icon: Calendar,
      iconColor: 'text-[#0878F9]',
      iconBg: 'bg-[#EAF4FF]',
    },
    {
      id: 'upcoming-appointments',
      title: 'Upcoming Appointments',
      value: upcomingAppointmentsCount.toString(),
      badgeText: 'Active',
      badgeType: upcomingAppointmentsCount > 0 ? ('positive' as const) : ('neutral' as const),
      comparison: 'confirmed & pending',
      icon: CalendarClock,
      iconColor: 'text-[#20B879]',
      iconBg: 'bg-[#E7F8F1]',
    },
    {
      id: 'total-doctors',
      title: 'Total Doctors',
      value: totalDoctorsCount.toString(),
      badgeText: 'Specialists',
      badgeType: 'neutral' as const,
      comparison: 'active in system',
      icon: UserRound,
      iconColor: 'text-[#7C4DDB]',
      iconBg: 'bg-[#F0EAFF]',
    },
    {
      id: 'departments',
      title: 'Departments',
      value: departmentsCount.toString(),
      badgeText: 'Clinical',
      badgeType: 'neutral' as const,
      comparison: 'hospital departments',
      icon: LayoutGrid,
      iconColor: 'text-[#F59E0B]',
      iconBg: 'bg-[#FFF4DE]',
    },
    {
      id: 'cancelled-appointments',
      title: 'Cancelled Appointments',
      value: cancelledAppointmentsCount.toString(),
      badgeText: cancelledAppointmentsCount > 0 ? 'Recorded' : 'Zero',
      badgeType: cancelledAppointmentsCount > 0 ? ('negative' as const) : ('neutral' as const),
      comparison: 'cancelled records',
      icon: XCircle,
      iconColor: 'text-[#EF4444]',
      iconBg: 'bg-[#FFECEF]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.id}
            onClick={() => onCardClick && onCardClick(stat.id)}
            className="bg-white rounded-[12px] border border-[#E1EDF9] p-4 sm:p-4.5 shadow-2xs hover:shadow-xs transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            {/* Top Row: Icon Container */}
            <div className="flex items-center justify-between">
              <div
                className={`w-10 h-10 rounded-[10px] ${stat.iconBg} ${stat.iconColor} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}
              >
                <Icon className="w-5 h-5 stroke-[2.1]" />
              </div>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  stat.badgeType === 'positive'
                    ? 'bg-[#E7F8F1] text-[#20B879]'
                    : stat.badgeType === 'negative'
                    ? 'bg-[#FFECEF] text-[#EF4444]'
                    : 'bg-[#F1F5F9] text-[#64748B]'
                }`}
              >
                {stat.badgeText}
              </span>
            </div>

            {/* Middle: Title & Main Number */}
            <div className="mt-3">
              <div className="text-[13px] font-medium text-[#5879A6] leading-tight">
                {stat.title}
              </div>
              <div className="text-[28px] sm:text-[30px] font-extrabold text-[#102A52] tracking-tight leading-none mt-1.5">
                {stat.value}
              </div>
            </div>

            {/* Bottom: Context Description */}
            <div className="flex items-center gap-1.5 mt-3 text-[12px]">
              <span className="text-[#5879A6] font-normal">
                {stat.comparison}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
