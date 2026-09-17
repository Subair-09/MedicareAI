import React from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { STATUS_OPTIONS, AVAILABILITY_OPTIONS } from '../../../data/doctorsData';
import { DoctorStatus } from '../../../types';

interface DoctorFiltersProps {
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  selectedStatus: DoctorStatus | 'All Status';
  onStatusChange: (status: DoctorStatus | 'All Status') => void;
  selectedAvailability: string;
  onAvailabilityChange: (avail: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  departmentOptions?: string[];
}

export const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  selectedDepartment,
  onDepartmentChange,
  selectedStatus,
  onStatusChange,
  selectedAvailability,
  onAvailabilityChange,
  onClearFilters,
  hasActiveFilters,
  departmentOptions = ['All Departments'],
}) => {
  return (
    <div className="bg-white border border-[#DCEBFA] rounded-[12px] p-2.5 sm:px-4 flex flex-wrap items-center justify-between gap-3 shadow-[0_1px_3px_rgba(16,42,82,0.02)]">
      {/* Left side: 3 Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        {/* Department Dropdown */}
        <div className="relative">
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="h-[38px] pl-3.5 pr-8 rounded-[9px] bg-[#F8FBFF] hover:bg-[#F0F6FF] border border-[#DCEBFA] text-[#102A52] text-[13px] font-medium appearance-none focus:outline-none focus:border-[#0878F9] cursor-pointer transition-colors"
          >
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#5879A6] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as DoctorStatus | 'All Status')}
            className="h-[38px] pl-3.5 pr-8 rounded-[9px] bg-[#F8FBFF] hover:bg-[#F0F6FF] border border-[#DCEBFA] text-[#102A52] text-[13px] font-medium appearance-none focus:outline-none focus:border-[#0878F9] cursor-pointer transition-colors"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#5879A6] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
        </div>

        {/* Availability Dropdown */}
        <div className="relative">
          <select
            value={selectedAvailability}
            onChange={(e) => onAvailabilityChange(e.target.value)}
            className="h-[38px] pl-3.5 pr-8 rounded-[9px] bg-[#F8FBFF] hover:bg-[#F0F6FF] border border-[#DCEBFA] text-[#102A52] text-[13px] font-medium appearance-none focus:outline-none focus:border-[#0878F9] cursor-pointer transition-colors"
          >
            {AVAILABILITY_OPTIONS.map((avail) => (
              <option key={avail} value={avail}>
                {avail}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#5879A6] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
        </div>
      </div>

      {/* Right side: Clear Filters */}
      <button
        type="button"
        onClick={onClearFilters}
        disabled={!hasActiveFilters}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-[13px] font-medium transition-colors cursor-pointer ${
          hasActiveFilters
            ? 'text-[#0878F9] hover:bg-[#EAF4FF]'
            : 'text-[#5879A6] hover:text-[#102A52] hover:bg-[#F8FBFF]'
        }`}
      >
        <Filter className="w-3.5 h-3.5 stroke-[2]" />
        <span>Clear Filters</span>
        {hasActiveFilters && <X className="w-3 h-3 ml-0.5" />}
      </button>
    </div>
  );
};
