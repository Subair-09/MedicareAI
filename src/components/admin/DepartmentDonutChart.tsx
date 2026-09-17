import React, { useMemo } from 'react';
import { Appointment, AdminDepartment } from '../../types';

interface DepartmentDonutChartProps {
  appointments?: Appointment[];
  departmentsList?: AdminDepartment[];
  onViewAll?: () => void;
}

const PALETTE = [
  '#0878F9', // Blue
  '#20B879', // Green
  '#F59E0B', // Amber
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#94A3B8', // Slate
];

export const DepartmentDonutChart: React.FC<DepartmentDonutChartProps> = ({
  appointments = [],
  departmentsList = [],
  onViewAll,
}) => {
  const { chartDepartments, totalCount } = useMemo(() => {
    const total = appointments.length;

    if (total === 0) {
      // Fallback to department roster if no appointments yet
      if (departmentsList.length > 0) {
        const topDepts = departmentsList.slice(0, 6).map((d, i) => ({
          name: d.name,
          count: 0,
          percent: 0,
          color: PALETTE[i % PALETTE.length],
        }));
        return { chartDepartments: topDepts, totalCount: 0 };
      }
      return { chartDepartments: [], totalCount: 0 };
    }

    // Group appointments by department
    const deptCounts: Record<string, number> = {};
    appointments.forEach((apt) => {
      const deptName = apt.department || 'General Medicine';
      deptCounts[deptName] = (deptCounts[deptName] || 0) + 1;
    });

    const sortedEntries = Object.entries(deptCounts).sort((a, b) => b[1] - a[1]);

    const result = sortedEntries.map(([name, count], index) => {
      const percent = Math.round((count / total) * 100);
      return {
        name,
        count,
        percent,
        color: PALETTE[index % PALETTE.length],
      };
    });

    return { chartDepartments: result, totalCount: total };
  }, [appointments, departmentsList]);

  // Calculate SVG stroke-dasharray and stroke-dashoffset for donut ring
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12
  let accumulatedPercent = 0;

  return (
    <div className="bg-white rounded-[12px] border border-[#E1EDF9] p-5 sm:p-5.5 shadow-2xs text-left flex flex-col justify-between h-full">
      {/* Header with Title and "View All" Link */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-[15.5px] sm:text-[16px] font-bold text-[#102A52] tracking-tight">
            Appointments by Department
          </h2>
          <p className="text-[11.5px] text-[#5879A6] font-medium">
            Clinical distribution of registered appointments
          </p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-[12.5px] font-semibold text-[#0878F9] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Donut Chart and Legend Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 mt-1 flex-1">
        {/* Donut Graphic with Centered Total */}
        <div className="relative w-44 h-44 sm:w-46 sm:h-46 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full transform -rotate-90 select-none"
          >
            {/* Background subtle ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="20"
            />

            {/* Department Arc Segments */}
            {totalCount > 0 &&
              chartDepartments.map((dept) => {
                const strokeDasharray = `${(dept.percent / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
                accumulatedPercent += dept.percent;

                return (
                  <circle
                    key={dept.name}
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="transparent"
                    stroke={dept.color}
                    strokeWidth="20"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 hover:opacity-90"
                  />
                );
              })}
          </svg>

          {/* Centered Total Counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-[22px] sm:text-[24px] font-extrabold text-[#102A52] tracking-tight leading-none">
              {totalCount.toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-[#5879A6] mt-0.5">
              Total Visits
            </span>
          </div>
        </div>

        {/* Legend List on Right */}
        <div className="w-full sm:w-auto flex-1 space-y-2 select-none">
          {chartDepartments.length === 0 ? (
            <div className="text-[12px] text-[#94A3B8] py-4 text-center">
              No department appointments recorded yet
            </div>
          ) : (
            chartDepartments.map((dept) => (
              <div
                key={dept.name}
                className="flex items-center justify-between text-[12.5px] group hover:bg-[#F8FBFF] px-1.5 py-0.5 rounded transition-colors"
              >
                {/* Colored Dot + Name */}
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="font-medium text-[#2D3E50] truncate">
                    {dept.name}
                  </span>
                </div>

                {/* Percentage & Count */}
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {dept.count > 0 && (
                    <span className="text-[11px] text-[#5879A6] font-medium">
                      ({dept.count})
                    </span>
                  )}
                  <span className="font-bold text-[#102A52] min-w-[32px] text-right">
                    {dept.percent}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
