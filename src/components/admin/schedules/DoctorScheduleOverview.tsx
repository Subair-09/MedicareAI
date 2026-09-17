import React from 'react';
import { ChevronRight, Stethoscope } from 'lucide-react';
import { DoctorScheduleSummary } from '../../../data/schedulesData';

interface DoctorScheduleOverviewProps {
  doctors: DoctorScheduleSummary[];
  onSelectDoctor?: (doctor: DoctorScheduleSummary) => void;
  onViewAll?: () => void;
}

export const DoctorScheduleOverview: React.FC<DoctorScheduleOverviewProps> = ({
  doctors,
  onSelectDoctor,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-[16px] border border-[#DCE9F8] p-5 shadow-[0_2px_8px_rgba(13,40,87,0.03)] text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#EAF2FB]">
        <h3 className="text-[15px] font-bold text-[#0D2857]">
          Doctor Schedule Overview
        </h3>
        {doctors.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-[12.5px] font-semibold text-[#0868F5] hover:text-[#075edc] transition-colors cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      {/* Doctor Rows or Empty State */}
      {doctors.length === 0 ? (
        <div className="py-6 text-center text-[#5273A8]">
          <div className="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center mx-auto mb-2.5">
            <Stethoscope className="w-5 h-5" />
          </div>
          <p className="text-[13px] font-medium text-[#0D2857]">No doctor schedules</p>
          <p className="text-[11.5px] text-[#8AA3C6] mt-0.5">
            Registered doctors will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#EAF2FB]">
          {doctors.slice(0, 4).map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDoctor && onSelectDoctor(doc)}
              className="py-3.5 first:pt-3.5 last:pb-1 flex items-center justify-between gap-3 group hover:bg-[#F9FCFF] -mx-2 px-2 rounded-[10px] transition-colors cursor-pointer"
            >
              {/* Avatar & Info */}
              <div className="flex items-center gap-3 min-w-0">
                {doc.avatar ? (
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#DCE9F8]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold text-[13px] flex items-center justify-center border border-[#DCE9F8] shrink-0">
                    {doc.name.replace(/^Dr\.\s*/, '').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-[13px] font-bold text-[#0D2857] group-hover:text-[#0868F5] transition-colors truncate leading-snug">
                    {doc.name}
                  </h4>
                  <p className="text-[11.5px] text-[#5273A8] leading-tight mt-0.5">
                    {doc.department}
                  </p>
                  <p className="text-[10.5px] text-[#8AA3C6] leading-tight mt-0.5">
                    {doc.workingDays} <span className="mx-0.5">|</span> {doc.workingHours}
                  </p>
                  <div className="mt-1.5">
                    <span
                      className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight ${
                        doc.status === 'Available'
                          ? 'bg-[#E8F8F0] text-[#19B879]'
                          : doc.status === 'In Consultation'
                          ? 'bg-[#EEF6FF] text-[#0868F5]'
                          : 'bg-[#FEF2F2] text-[#DC2626]'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Chevron */}
              <ChevronRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0868F5] transition-colors shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
