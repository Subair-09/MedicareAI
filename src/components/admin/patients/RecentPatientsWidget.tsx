import React from 'react';
import { UserCheck } from 'lucide-react';
import { AdminPatient } from '../../../types';

interface RecentPatientsWidgetProps {
  patients: AdminPatient[];
  onSelectPatient: (patient: AdminPatient) => void;
  onViewAll: () => void;
}

export const RecentPatientsWidget: React.FC<RecentPatientsWidgetProps> = ({
  patients,
  onSelectPatient,
  onViewAll,
}) => {
  // Take top 5 recent patients
  const recentList = patients.slice(0, 5);

  return (
    <div className="bg-white border border-[#DCEBFA] rounded-[16px] p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-bold text-[#0D2857]">
          Recent Patients
        </h3>
        {recentList.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-[13px] font-semibold text-[#0868F5] hover:underline cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      {/* Patient List or Empty State */}
      {recentList.length === 0 ? (
        <div className="py-6 text-center text-[#5273A8]">
          <div className="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center mx-auto mb-2.5">
            <UserCheck className="w-5 h-5" />
          </div>
          <p className="text-[13px] font-medium text-[#0D2857]">No registered patients</p>
          <p className="text-[11.5px] text-[#8AA3C6] mt-0.5">
            Newly registered patients will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#F1F6FC]">
          {recentList.map((patient) => (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between hover:bg-[#F9FCFF] -mx-2 px-2 rounded-[10px] transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {patient.avatar ? (
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover border border-[#DCEBFA] shrink-0 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold text-[12px] flex items-center justify-center border border-[#DCEBFA] shrink-0 group-hover:scale-105 transition-transform">
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-[13px] font-bold text-[#0D2857] leading-tight">
                    {patient.name}
                  </h4>
                  <p className="text-[11.5px] text-[#5273A8] mt-0.5">
                    {patient.department} • {patient.patientId}
                  </p>
                </div>
              </div>
              <span className="text-[11.5px] font-medium text-[#8AA3C6] shrink-0 ml-2">
                {patient.recentActivityTime || 'Recently'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
