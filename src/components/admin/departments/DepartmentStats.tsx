import React from 'react';
import { Stethoscope, Users, Calendar, LayoutGrid, CheckCircle2 } from 'lucide-react';

interface DepartmentStatsProps {
  totalDepartments?: number;
  totalDoctors?: number;
  totalAppointments?: string | number;
  activeDepartments?: number;
  onFilterStatus?: (status: string) => void;
}

export const DepartmentStats: React.FC<DepartmentStatsProps> = ({
  totalDepartments = 0,
  totalDoctors = 0,
  totalAppointments = '0',
  activeDepartments = 0,
  onFilterStatus,
}) => {
  const activeRate = totalDepartments > 0 ? Math.round((activeDepartments / totalDepartments) * 100) : 0;

  const cards = [
    {
      id: 'total-dept',
      title: 'Total Departments',
      value: totalDepartments.toString(),
      subtext: `${totalDepartments} in hospital roster`,
      icon: Stethoscope,
      iconBg: '#EAF4FF',
      iconColor: '#0878F9',
      filter: 'all',
    },
    {
      id: 'total-doc',
      title: 'Total Doctors',
      value: totalDoctors.toString(),
      subtext: `${totalDoctors} assigned specialists`,
      icon: Users,
      iconBg: '#EAF8F0',
      iconColor: '#10B981',
      filter: 'all',
    },
    {
      id: 'total-app',
      title: 'Total Appointments',
      value: totalAppointments.toString(),
      subtext: `${totalAppointments} scheduled visits`,
      icon: Calendar,
      iconBg: '#F3EEFD',
      iconColor: '#8B5CF6',
      filter: 'all',
    },
    {
      id: 'active-dept',
      title: 'Active Departments',
      value: activeDepartments.toString(),
      subtext: `${activeRate}% operational rate`,
      icon: LayoutGrid,
      iconBg: '#FFF3E6',
      iconColor: '#F97316',
      filter: 'Active',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onFilterStatus && onFilterStatus(card.filter)}
            className="bg-white border border-[#DCEBFA] rounded-[16px] p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group"
          >
            {/* Top row: Icon */}
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-11 h-11 rounded-[12px] flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ backgroundColor: card.iconBg, color: card.iconColor }}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>

            {/* Middle: Value and Title */}
            <div>
              <div className="text-[28px] sm:text-[30px] font-bold text-[#0D2857] tracking-tight leading-tight">
                {card.value}
              </div>
              <div className="text-[13px] font-medium text-[#5273A8] mt-0.5">
                {card.title}
              </div>
            </div>

            {/* Bottom: Dynamic status text */}
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#047857] mt-3.5 pt-2 border-t border-[#F1F6FC]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{card.subtext}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
