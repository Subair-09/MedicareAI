import React, { useMemo } from 'react';
import { AdminDoctor } from '../../../types';
import { DepartmentDistributionItem } from '../../../data/doctorsData';

interface DepartmentDistributionCardProps {
  doctors?: AdminDoctor[];
  distribution?: DepartmentDistributionItem[];
  onViewAll?: () => void;
  onSelectDepartment?: (deptName: string) => void;
}

const DEPT_PALETTE: Record<string, string> = {
  'General Medicine': '#0878F9',
  'Cardiology': '#06B6D4',
  'Dermatology': '#10B981',
  'Pediatrics': '#22C55E',
  'Orthopedics': '#8B5CF6',
  'Gynecology': '#EC4899',
  'Radiology': '#3B82F6',
  'Oncology': '#F59E0B',
  'ENT': '#D97706',
  'Surgery': '#EF4444',
  'Neurology': '#6366F1',
};

const FALLBACK_COLORS = ['#0878F9', '#06B6D4', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#3B82F6'];

export const DepartmentDistributionCard: React.FC<DepartmentDistributionCardProps> = ({
  doctors,
  distribution: initialDistribution,
  onViewAll,
  onSelectDepartment,
}) => {
  // Dynamically compute department distribution from live doctors list
  const computedDistribution: DepartmentDistributionItem[] = useMemo(() => {
    if (initialDistribution && initialDistribution.length > 0) {
      return initialDistribution;
    }
    if (!doctors || doctors.length === 0) {
      return [];
    }

    const counts: Record<string, number> = {};
    doctors.forEach((d) => {
      const dept = d.department || 'General Medicine';
      counts[dept] = (counts[dept] || 0) + 1;
    });

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return entries.map(([name, count], index) => ({
      name,
      count,
      color: DEPT_PALETTE[name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    }));
  }, [doctors, initialDistribution]);

  const total = computedDistribution.reduce((acc, cur) => acc + cur.count, 0);

  // SVG donut metrics
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="bg-white border border-[#DCEBFA] rounded-[14px] p-4 sm:p-5 shadow-[0_1px_3px_rgba(16,42,82,0.02)]">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14.5px] font-bold text-[#102A52]">
          Department Distribution
        </h3>
        {total > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-[12px] font-semibold text-[#0878F9] hover:underline cursor-pointer"
          >
            View All
          </button>
        )}
      </div>

      {total === 0 ? (
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-[100px] h-[100px] mb-3 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth="12"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[20px] font-bold text-[#102A52] leading-none">0</span>
              <span className="text-[10px] text-[#5879A6] mt-0.5">Doctors</span>
            </div>
          </div>
          <p className="text-[12.5px] font-medium text-[#5879A6]">
            No doctors registered across departments.
          </p>
        </div>
      ) : (
        /* Donut Chart + Legend Container */
        <div className="flex items-center gap-4 sm:gap-5">
          {/* Left: Donut Chart with Center Text */}
          <div className="relative w-[118px] h-[118px] shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth="15"
              />
              {/* Segments */}
              {computedDistribution.map((item) => {
                const percent = item.count / total;
                const strokeDasharray = `${percent * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedPercent * circumference;
                accumulatedPercent += percent;

                return (
                  <circle
                    key={item.name}
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="15"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-300 hover:opacity-90 cursor-pointer"
                    onClick={() => onSelectDepartment && onSelectDepartment(item.name)}
                  >
                    <title>{`${item.name}: ${item.count} doctors`}</title>
                  </circle>
                );
              })}
            </svg>

            {/* Center Text: Total Doctors */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-[23px] font-bold text-[#102A52] leading-none tracking-tight">
                {total}
              </span>
              <span className="text-[10.5px] font-medium text-[#5879A6] mt-0.5 leading-none">
                Doctors
              </span>
            </div>
          </div>

          {/* Right: Legend Items List */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {computedDistribution.map((item) => (
              <div
                key={item.name}
                onClick={() => onSelectDepartment && onSelectDepartment(item.name)}
                className="flex items-center justify-between text-[12px] group cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[#5879A6] group-hover:text-[#102A52] transition-colors truncate">
                    {item.name}
                  </span>
                </div>
                <span className="font-semibold text-[#102A52] text-[12px] ml-2">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
