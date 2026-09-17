import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  UserCheck,
  XCircle
} from 'lucide-react';
import { AppointmentStatus } from '../../../types';

interface AppointmentStatsProps {
  activeStatusFilter?: string;
  onSelectStatus?: (status: AppointmentStatus | 'All') => void;
  counts: {
    total: number;
    confirmed: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
}

export const AppointmentStats: React.FC<AppointmentStatsProps> = ({
  activeStatusFilter = 'All',
  onSelectStatus,
  counts,
}) => {
  const confirmedPercent = counts.total > 0 ? Math.round((counts.confirmed / counts.total) * 100) : 0;
  const pendingPercent = counts.total > 0 ? Math.round((counts.pending / counts.total) * 100) : 0;
  const completedPercent = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;
  const cancelledPercent = counts.total > 0 ? Math.round((counts.cancelled / counts.total) * 100) : 0;

  const cards = [
    {
      id: 'all',
      status: 'All' as const,
      title: 'Total Appointments',
      value: counts.total.toString(),
      badgeText: 'All Records',
      badgeClass: 'bg-[#EAF4FF] text-[#0878F9]',
      subtitle: counts.total === 0 ? 'No appointments registered' : `${counts.total} active appointments in roster`,
      icon: Calendar,
      iconColor: 'text-[#0878F9]',
      iconBg: 'bg-[#EAF4FF]',
    },
    {
      id: 'confirmed',
      status: 'Confirmed' as const,
      title: 'Confirmed',
      value: counts.confirmed.toString(),
      badgeText: `${confirmedPercent}%`,
      badgeClass: 'bg-[#E7F8F1] text-[#20B879]',
      subtitle: counts.confirmed === 0 ? 'No confirmed bookings' : `${counts.confirmed} scheduled & ready`,
      icon: CheckCircle2,
      iconColor: 'text-[#20B879]',
      iconBg: 'bg-[#E7F8F1]',
    },
    {
      id: 'pending',
      status: 'Pending Approval',
      value: counts.pending.toString(),
      badgeText: `${pendingPercent}%`,
      badgeClass: 'bg-[#FFF4DE] text-[#D97706]',
      subtitle: counts.pending === 0 ? 'Zero pending approvals' : `${counts.pending} awaiting triage review`,
      icon: Clock,
      iconColor: 'text-[#F59E0B]',
      iconBg: 'bg-[#FFF4DE]',
    },
    {
      id: 'completed',
      status: 'Completed' as const,
      title: 'Completed',
      value: counts.completed.toString(),
      badgeText: `${completedPercent}%`,
      badgeClass: 'bg-[#EEF2FF] text-[#6366F1]',
      subtitle: counts.completed === 0 ? 'No completed visits' : `${counts.completed} consultations finished`,
      icon: UserCheck,
      iconColor: 'text-[#6366F1]',
      iconBg: 'bg-[#EEF2FF]',
    },
    {
      id: 'cancelled',
      status: 'Cancelled' as const,
      title: 'Cancelled',
      value: counts.cancelled.toString(),
      badgeText: `${cancelledPercent}%`,
      badgeClass: 'bg-[#FFECEF] text-[#EF4444]',
      subtitle: counts.cancelled === 0 ? 'No cancelled bookings' : `${counts.cancelled} cancelled appointments`,
      icon: XCircle,
      iconColor: 'text-[#EF4444]',
      iconBg: 'bg-[#FFECEF]',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeStatusFilter === card.status;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus && onSelectStatus(card.status as any)}
            className={`bg-white border rounded-[14px] p-3.5 sm:p-4 text-left transition-all duration-150 cursor-pointer shadow-2xs group hover:border-[#BFDBFE] hover:shadow-xs ${
              isSelected
                ? 'border-[#0878F9] ring-2 ring-[#0878F9]/15 bg-[#FAFCFF]'
                : 'border-[#E1EDF9]'
            }`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-2.5">
              <span className="text-[12px] sm:text-[13px] font-semibold text-[#5879A6] truncate">
                {card.title}
              </span>
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-[9px] ${card.iconBg} ${card.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
              </div>
            </div>

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-[22px] sm:text-[26px] font-extrabold text-[#102A52] tracking-tight leading-none">
                {card.value}
              </span>
              <span
                className={`inline-flex items-center text-[11px] font-bold px-1.5 py-0.5 rounded-[5px] ${card.badgeClass}`}
              >
                {card.badgeText}
              </span>
            </div>

            <p className="text-[11px] text-[#5879A6] font-medium truncate">
              {card.subtitle}
            </p>
          </button>
        );
      })}
    </div>
  );
};
