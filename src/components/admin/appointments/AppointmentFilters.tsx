import React from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { AppointmentStatus } from '../../../types';
import { DEPARTMENTS_LIST, DOCTORS_LIST } from '../../../data/appointmentsData';

interface AppointmentFiltersProps {
  activeStatus: AppointmentStatus | 'All';
  onStatusChange: (status: AppointmentStatus | 'All') => void;
  statusCounts: {
    total: number;
    confirmed: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  selectedDoctor: string;
  onDoctorChange: (doctor: string) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  departments?: string[];
  doctors?: string[];
  availableDates?: string[];
}

export const AppointmentFilters: React.FC<AppointmentFiltersProps> = ({
  activeStatus,
  onStatusChange,
  statusCounts,
  searchQuery,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  selectedDoctor,
  onDoctorChange,
  selectedDate,
  onDateChange,
  onResetFilters,
  hasActiveFilters,
  departments = DEPARTMENTS_LIST,
  doctors = DOCTORS_LIST,
  availableDates = [],
}) => {
  const tabs: { key: AppointmentStatus | 'All'; label: string; count: number }[] = [
    { key: 'All', label: 'All Appointments', count: statusCounts.total },
    { key: 'Confirmed', label: 'Confirmed', count: statusCounts.confirmed },
    { key: 'Pending', label: 'Pending', count: statusCounts.pending },
    { key: 'Completed', label: 'Completed', count: statusCounts.completed },
    { key: 'Cancelled', label: 'Cancelled', count: statusCounts.cancelled },
  ];

  return (
    <div className="space-y-3.5">
      {/* 1. Status Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#E1EDF9] pb-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {tabs.map((tab) => {
            const isActive = activeStatus === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onStatusChange(tab.key)}
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-[8px] text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0878F9] text-white shadow-2xs'
                    : 'text-[#5879A6] hover:text-[#102A52] hover:bg-[#F0F5FA]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#EBF2F9] text-[#5879A6]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[12px] font-semibold text-[#EF4444] hover:text-[#DC2626] flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-[6px] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* 2. Search & Select Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 items-center">
        {/* Search Input */}
        <div className="sm:col-span-2 lg:col-span-5 relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 stroke-[2]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search patient name, ID, or doctor..."
            className="w-full h-[40px] pl-10 pr-9 rounded-[10px] bg-white border border-[#E1EDF9] text-[13px] text-[#102A52] placeholder-[#94A3B8] focus:outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/15 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#102A52] p-0.5 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Department Dropdown */}
        <div className="sm:col-span-1 lg:col-span-3 relative">
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="w-full h-[40px] px-3 pr-8 rounded-[10px] bg-white border border-[#E1EDF9] text-[13px] font-medium text-[#102A52] focus:outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/15 appearance-none cursor-pointer shadow-2xs"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Doctor Dropdown */}
        <div className="sm:col-span-1 lg:col-span-2 relative">
          <select
            value={selectedDoctor}
            onChange={(e) => onDoctorChange(e.target.value)}
            className="w-full h-[40px] px-3 pr-8 rounded-[10px] bg-white border border-[#E1EDF9] text-[13px] font-medium text-[#102A52] focus:outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/15 appearance-none cursor-pointer shadow-2xs"
          >
            {doctors.map((doc) => (
              <option key={doc} value={doc}>
                {doc}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Date Filter Dropdown */}
        <div className="sm:col-span-2 lg:col-span-2 relative">
          <select
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full h-[40px] px-3 pr-8 rounded-[10px] bg-white border border-[#E1EDF9] text-[13px] font-medium text-[#102A52] focus:outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/15 appearance-none cursor-pointer shadow-2xs"
          >
            <option value="All">All Dates</option>
            {availableDates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
