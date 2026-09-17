import React from 'react';
import { Users, UserCheck, CalendarOff, UserX, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { DoctorStatus } from '../../../types';

interface DoctorStatsProps {
  totalCount: number;
  activeCount: number;
  onLeaveCount: number;
  inactiveCount: number;
  activeStatusFilter?: DoctorStatus | 'All';
  onSelectStatus?: (status: DoctorStatus | 'All') => void;
}

export const DoctorStats: React.FC<DoctorStatsProps> = ({
  totalCount = 0,
  activeCount = 0,
  onLeaveCount = 0,
  inactiveCount = 0,
  activeStatusFilter = 'All',
  onSelectStatus,
}) => {
  const activePercent = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
  const leavePercent = totalCount > 0 ? Math.round((onLeaveCount / totalCount) * 100) : 0;
  const inactivePercent = totalCount > 0 ? Math.round((inactiveCount / totalCount) * 100) : 0;

  const statCards = [
    {
      id: 'total',
      status: 'All' as const,
      title: 'Total Doctors',
      value: totalCount,
      trend: `${totalCount} registered`,
      trendType: 'neutral' as const,
      icon: Users,
      iconBg: 'bg-[#EAF4FF]',
      iconColor: 'text-[#0878F9]',
      borderColor: activeStatusFilter === 'All' ? 'border-[#0878F9]/40 ring-2 ring-[#0878F9]/10' : 'border-[#DCEBFA]',
    },
    {
      id: 'active',
      status: 'Active' as const,
      title: 'Active Doctors',
      value: activeCount,
      trend: `${activePercent}% of roster`,
      trendType: activePercent > 0 ? 'up' as const : 'neutral' as const,
      icon: UserCheck,
      iconBg: 'bg-[#EAF8F1]',
      iconColor: 'text-[#20B879]',
      borderColor: activeStatusFilter === 'Active' ? 'border-[#20B879]/40 ring-2 ring-[#20B879]/10' : 'border-[#DCEBFA]',
    },
    {
      id: 'on-leave',
      status: 'On Leave' as const,
      title: 'On Leave',
      value: onLeaveCount,
      trend: `${leavePercent}% of roster`,
      trendType: onLeaveCount > 0 ? 'down' as const : 'neutral' as const,
      icon: CalendarOff,
      iconBg: 'bg-[#FEECEF]',
      iconColor: 'text-[#EF4444]',
      borderColor: activeStatusFilter === 'On Leave' ? 'border-[#EF4444]/40 ring-2 ring-[#EF4444]/10' : 'border-[#DCEBFA]',
    },
    {
      id: 'inactive',
      status: 'Inactive' as const,
      title: 'Inactive Doctors',
      value: inactiveCount,
      trend: `${inactivePercent}% of roster`,
      trendType: 'neutral' as const,
      icon: UserX,
      iconBg: 'bg-[#FFF4DE]',
      iconColor: 'text-[#F59E0B]',
      borderColor: activeStatusFilter === 'Inactive' ? 'border-[#F59E0B]/40 ring-2 ring-[#F59E0B]/10' : 'border-[#DCEBFA]',
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5" aria-label="Doctor Statistics">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onSelectStatus && onSelectStatus(card.status)}
            className={`bg-white rounded-[14px] border ${card.borderColor} p-4 sm:p-5 flex items-center gap-4 transition-all duration-200 hover:shadow-sm cursor-pointer shadow-[0_1px_3px_rgba(16,42,82,0.03)]`}
          >
            {/* Left Circular Icon Container (~44px) */}
            <div
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 shadow-2xs`}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
            </div>

            {/* Right Stat Details */}
            <div className="flex-1 min-w-0">
              <div className="text-[12.5px] font-medium text-[#5879A6] leading-none mb-1">
                {card.title}
              </div>
              <div className="text-[26px] sm:text-[28px] font-bold text-[#102A52] leading-tight tracking-tight">
                {card.value}
              </div>

              {/* Trend Tag */}
              <div className="flex items-center gap-1 mt-1 text-[11.5px] font-medium leading-none">
                {card.trendType === 'up' && (
                  <>
                    <ArrowUp className="w-3 h-3 text-[#20B879] stroke-[2.5]" />
                    <span className="text-[#20B879] font-semibold">{card.trend}</span>
                  </>
                )}
                {card.trendType === 'down' && (
                  <>
                    <ArrowDown className="w-3 h-3 text-[#EF4444] stroke-[2.5]" />
                    <span className="text-[#EF4444] font-semibold">{card.trend}</span>
                  </>
                )}
                {card.trendType === 'neutral' && (
                  <>
                    <Minus className="w-3 h-3 text-[#5879A6] stroke-[2.5]" />
                    <span className="text-[#5879A6]">{card.trend}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};
