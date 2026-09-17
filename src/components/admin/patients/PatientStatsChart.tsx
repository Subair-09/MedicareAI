import React from 'react';
import { AdminPatient } from '../../../types';

interface PatientStatsChartProps {
  patients?: AdminPatient[];
}

export const PatientStatsChart: React.FC<PatientStatsChartProps> = ({ patients = [] }) => {
  const total = patients.length;

  const activeCount = patients.filter((p) => p.status === 'Active').length;
  const pendingCount = patients.filter((p) => p.status === 'Pending').length;
  const inactiveCount = patients.filter((p) => p.status === 'Inactive').length;

  const segments = total > 0 ? [
    {
      name: 'Active Care',
      count: activeCount,
      percentage: Math.round((activeCount / total) * 100),
      color: '#10B981',
    },
    {
      name: 'Pending Triage',
      count: pendingCount,
      percentage: Math.round((pendingCount / total) * 100),
      color: '#F59E0B',
    },
    {
      name: 'Inactive / Follow-up',
      count: inactiveCount,
      percentage: Math.max(0, 100 - Math.round((activeCount / total) * 100) - Math.round((pendingCount / total) * 100)),
      color: '#EF4444',
    },
  ].filter((s) => s.count > 0 || total === 0) : [];

  const radius = 40;
  const circumference = 2 * Math.PI * radius; // ~251.32

  let accumulatedPercent = 0;

  return (
    <div className="bg-white border border-[#DCEBFA] rounded-[16px] p-5 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-bold text-[#0D2857]">
          Patient Distribution
        </h3>
        <span className="text-[12px] font-medium text-[#8AA3C6]">
          Real-time Live
        </span>
      </div>

      {/* Chart and Legend Layout */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* SVG Donut Chart */}
        <div className="relative w-[130px] h-[130px] shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#F1F6FC"
              strokeWidth="14"
            />
            {/* Slices */}
            {total > 0 && segments.map((seg) => {
              const slicePercent = (seg.count / total) * 100;
              const strokeDasharray = `${(slicePercent / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
              accumulatedPercent += slicePercent;

              return (
                <circle
                  key={seg.name}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="14"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500 hover:opacity-90"
                />
              );
            })}
          </svg>

          {/* Donut Center Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[20px] font-bold text-[#0D2857] leading-none">
              {total}
            </span>
            <span className="text-[10px] font-medium text-[#8AA3C6] mt-1">
              Total Patients
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-1.5">
          {total === 0 ? (
            <div className="text-center py-2 text-[#8AA3C6] text-[12px]">
              <p className="font-medium text-[#5273A8]">No patients recorded</p>
              <p className="text-[11px] mt-0.5">Register patients to see status breakdown</p>
            </div>
          ) : (
            segments.map((seg) => (
              <div
                key={seg.name}
                className="flex items-center justify-between text-[12px] py-0.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="text-[#5273A8] font-medium truncate max-w-[110px]">
                    {seg.name}
                  </span>
                </div>
                <span className="font-semibold text-[#0D2857] text-[11.5px]">
                  {seg.count} ({Math.round((seg.count / total) * 100)}%)
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
