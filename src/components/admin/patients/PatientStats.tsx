import React from 'react';
import { User, Calendar, Clock, UserX, ArrowUp, ArrowDown } from 'lucide-react';

interface PatientStatsProps {
  totalPatients?: number | string;
  newPatients?: number | string;
  activePatients?: number | string;
  inactivePatients?: number | string;
  onFilterStatus?: (status: string) => void;
}

const formatStatValue = (val: number | string): string => {
  return String(val);
};

export const PatientStats: React.FC<PatientStatsProps> = ({
  totalPatients = 0,
  newPatients = 0,
  activePatients = 0,
  inactivePatients = 0,
  onFilterStatus,
}) => {
  const totalNum = Number(totalPatients) || 0;
  const cards = [
    {
      id: 'total-patients',
      title: 'Total Patients',
      value: formatStatValue(totalPatients),
      trend: totalNum > 0 ? '+100%' : '0%',
      trendDirection: 'up',
      trendText: 'verified records',
      icon: User,
      iconBg: '#EAF4FF',
      iconColor: '#0868F5',
      statusFilter: 'all',
    },
    {
      id: 'new-patients',
      title: 'New Patients',
      value: formatStatValue(newPatients),
      trend: Number(newPatients) > 0 ? `+${newPatients}` : '0',
      trendDirection: 'up',
      trendText: 'recently registered',
      icon: Calendar,
      iconBg: '#EAF8F0',
      iconColor: '#10B981',
      statusFilter: 'all',
    },
    {
      id: 'active-patients',
      title: 'Active Patients',
      value: formatStatValue(activePatients),
      trend: totalNum > 0 ? `${Math.round((Number(activePatients) / totalNum) * 100)}%` : '0%',
      trendDirection: 'up',
      trendText: 'of total cohort',
      icon: Clock,
      iconBg: '#F3EEFD',
      iconColor: '#7C3AED',
      statusFilter: 'Active',
    },
    {
      id: 'inactive-patients',
      title: 'Inactive Patients',
      value: formatStatValue(inactivePatients),
      trend: totalNum > 0 ? `${Math.round((Number(inactivePatients) / totalNum) * 100)}%` : '0%',
      trendDirection: 'down',
      trendText: 'require follow-up',
      icon: UserX,
      iconBg: '#FEECEE',
      iconColor: '#EF4444',
      statusFilter: 'Inactive',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isUp = card.trendDirection === 'up';

        return (
          <div
            key={card.id}
            onClick={() => onFilterStatus && onFilterStatus(card.statusFilter)}
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

            {/* Middle: Title and Value */}
            <div>
              <div className="text-[13px] font-medium text-[#5273A8]">
                {card.title}
              </div>
              <div className="text-[28px] sm:text-[30px] font-bold text-[#0D2857] tracking-tight leading-tight mt-0.5">
                {card.value}
              </div>
            </div>

            {/* Bottom: Trend arrow, percentage, and 'vs. last month' */}
            <div className="flex items-center gap-1 text-[12px] font-medium mt-3.5 pt-2 border-t border-[#F1F6FC]">
              <span
                className={`flex items-center gap-0.5 font-bold ${
                  isUp ? 'text-[#19B978]' : 'text-[#EF4444]'
                }`}
              >
                {isUp ? (
                  <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
                )}
                <span>{card.trend}</span>
              </span>
              <span className="text-[#8AA3C6] font-normal">{card.trendText}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
