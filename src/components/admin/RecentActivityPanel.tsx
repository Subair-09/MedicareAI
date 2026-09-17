import React, { useMemo } from 'react';
import {
  Activity,
  CheckCircle2,
  RefreshCw,
  XCircle,
  UserCheck,
  Clock
} from 'lucide-react';
import { Appointment, AdminDoctor } from '../../types';

interface RecentActivityPanelProps {
  appointments?: Appointment[];
  doctors?: AdminDoctor[];
  onViewAll?: () => void;
}

interface ActivityItem {
  id: string;
  title: string;
  time: string;
  description: string;
  icon: any;
  iconBg: string;
  iconColor: string;
}

export const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({
  appointments = [],
  doctors = [],
  onViewAll,
}) => {
  const activities: ActivityItem[] = useMemo(() => {
    const list: ActivityItem[] = [];

    // Derive activities from actual appointments
    appointments.slice(0, 4).forEach((apt) => {
      if (apt.status === 'Cancelled') {
        list.push({
          id: `act-cancel-${apt.id}`,
          title: 'Appointment cancelled',
          time: apt.time || 'Today',
          description: `Patient ${apt.patientName} (${apt.patientId}) cancelled with ${apt.doctorName} (${apt.department})`,
          icon: XCircle,
          iconBg: 'bg-[#FFECEF]',
          iconColor: 'text-[#EF4444]',
        });
      } else if (apt.status === 'Confirmed') {
        list.push({
          id: `act-confirm-${apt.id}`,
          title: 'Appointment confirmed',
          time: apt.time || 'Today',
          description: `Patient ${apt.patientName} booked with ${apt.doctorName} in ${apt.department}`,
          icon: CheckCircle2,
          iconBg: 'bg-[#E7F8F1]',
          iconColor: 'text-[#20B879]',
        });
      } else if (apt.status === 'Completed') {
        list.push({
          id: `act-comp-${apt.id}`,
          title: 'Consultation completed',
          time: apt.time || 'Recent',
          description: `Dr. ${apt.doctorName} completed session for ${apt.patientName}`,
          icon: Clock,
          iconBg: 'bg-[#EAF4FF]',
          iconColor: 'text-[#0878F9]',
        });
      } else {
        list.push({
          id: `act-pending-${apt.id}`,
          title: 'Appointment scheduled',
          time: apt.time || 'Pending',
          description: `Patient ${apt.patientName} scheduled visit for ${apt.department}`,
          icon: RefreshCw,
          iconBg: 'bg-[#FFF4DE]',
          iconColor: 'text-[#F59E0B]',
        });
      }
    });

    // Derive activity from doctors if available
    if (doctors.length > 0) {
      const topDoc = doctors[0];
      list.push({
        id: `act-doc-${topDoc.id}`,
        title: 'Specialist on duty',
        time: 'Active',
        description: `${topDoc.name} (${topDoc.specialty}) active in ${topDoc.department}`,
        icon: UserCheck,
        iconBg: 'bg-[#F0EAFF]',
        iconColor: 'text-[#7C4DDB]',
      });
    }

    return list;
  }, [appointments, doctors]);

  return (
    <div className="bg-white rounded-[12px] border border-[#E1EDF9] p-5 sm:p-5.5 shadow-2xs text-left">
      {/* Header with Activity Icon & View All link */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[8px] bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center shrink-0">
            <Activity className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-[15.5px] sm:text-[16px] font-bold text-[#102A52] tracking-tight">
              Recent Activity
            </h2>
            <p className="text-[11.5px] text-[#5879A6] font-medium">
              Real-time administrative feed
            </p>
          </div>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-[12.5px] font-semibold text-[#0878F9] hover:underline cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-[12.5px] text-[#94A3B8] py-4 text-center">
            No administrative activities recorded yet.
          </div>
        ) : (
          activities.map((act) => {
            const Icon = act.icon;

            return (
              <div key={act.id} className="flex items-start gap-3 group">
                {/* Circular Icon Container */}
                <div
                  className={`w-8 h-8 rounded-full ${act.iconBg} ${act.iconColor} flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>

                {/* Title, Time, and Description */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[13.5px] font-bold text-[#102A52] leading-tight">
                      {act.title}
                    </span>
                    <span className="text-[11.5px] font-medium text-[#94A3B8] ml-2 shrink-0">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#5879A6] leading-relaxed mt-1">
                    {act.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
