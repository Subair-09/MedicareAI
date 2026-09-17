import React from 'react';
import { UserPlus, UserCheck, CalendarOff, User, Activity } from 'lucide-react';
import { DoctorActivityItem } from '../../../data/doctorsData';

interface RecentDoctorActivityCardProps {
  activities?: DoctorActivityItem[];
  onViewAll?: () => void;
}

export const RecentDoctorActivityCard: React.FC<RecentDoctorActivityCardProps> = ({
  activities = [],
  onViewAll,
}) => {
  const getActivityIcon = (type: DoctorActivityItem['type']) => {
    switch (type) {
      case 'added':
        return {
          icon: UserPlus,
          bg: 'bg-[#EAF4FF]',
          color: 'text-[#0878F9]',
        };
      case 'updated':
        return {
          icon: UserCheck,
          bg: 'bg-[#EAF4FF]',
          color: 'text-[#0878F9]',
        };
      case 'leave':
        return {
          icon: CalendarOff,
          bg: 'bg-[#FEECEF]',
          color: 'text-[#EF4444]',
        };
      default:
        return {
          icon: User,
          bg: 'bg-[#F0F6FF]',
          color: 'text-[#5879A6]',
        };
    }
  };

  return (
    <div className="bg-white border border-[#DCEBFA] rounded-[14px] p-4 sm:p-5 shadow-[0_1px_3px_rgba(16,42,82,0.02)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="text-[14.5px] font-bold text-[#102A52]">Recent Activity</h3>
        {activities.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-[12px] font-semibold text-[#0878F9] hover:underline cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      {/* Activity List or Empty State */}
      {activities.length === 0 ? (
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[#F0F6FF] flex items-center justify-center text-[#5879A6] mb-2.5">
            <Activity className="w-5 h-5 text-[#0878F9]" />
          </div>
          <p className="text-[13px] font-semibold text-[#102A52]">No recent activity</p>
          <p className="text-[11.5px] text-[#5879A6] mt-0.5 max-w-[210px]">
            Doctor additions, profile edits, and leave events will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#EBF3FB]">
          {activities.map((act) => {
            const iconConfig = getActivityIcon(act.type);
            const Icon = iconConfig.icon;

            return (
              <div
                key={act.id}
                className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Circular icon */}
                  <div
                    className={`w-9 h-9 rounded-full ${iconConfig.bg} ${iconConfig.color} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-4 h-4 stroke-[2]" />
                  </div>

                  <div className="min-w-0">
                    <div className="text-[12.5px] font-semibold text-[#102A52] group-hover:text-[#0878F9] transition-colors truncate">
                      {act.title}
                    </div>
                    <div className="text-[11.5px] text-[#5879A6] truncate">
                      {act.description}
                    </div>
                  </div>
                </div>

                {/* Time */}
                <span className="text-[11px] text-[#5879A6] whitespace-nowrap shrink-0">
                  {act.time}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
