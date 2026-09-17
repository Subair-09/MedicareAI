import React, { useState, useRef, useEffect } from 'react';
import {
  MoreHorizontal,
  Clock,
  Eye,
  Edit2,
  Calendar,
  CalendarOff,
  UserCheck,
  UserX,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  CheckSquare,
  Square,
  ShieldCheck,
  Check
} from 'lucide-react';
import { AdminDoctor, DoctorStatus } from '../../../types';

interface DoctorTableProps {
  doctors: AdminDoctor[];
  selectedDoctorIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectDoctor: (id: string) => void;
  onViewProfile: (doc: AdminDoctor) => void;
  onEditDoctor: (doc: AdminDoctor) => void;
  onSetAvailability: (doc: AdminDoctor) => void;
  onViewSchedule: (doc: AdminDoctor) => void;
  onSetLeave: (doc: AdminDoctor) => void;
  onToggleStatus: (doc: AdminDoctor) => void;
  onDeleteDoctor: (doc: AdminDoctor) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortBy?: (column: string) => void;
}

export const DoctorTable: React.FC<DoctorTableProps> = ({
  doctors,
  selectedDoctorIds,
  onToggleSelectAll,
  onToggleSelectDoctor,
  onViewProfile,
  onEditDoctor,
  onSetAvailability,
  onViewSchedule,
  onSetLeave,
  onToggleStatus,
  onDeleteDoctor,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [activeMenuDoctorId, setActiveMenuDoctorId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuDoctorId(null);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const isAllSelected =
    doctors.length > 0 && doctors.every((d) => selectedDoctorIds.includes(d.id));
  const isSomeSelected =
    doctors.some((d) => selectedDoctorIds.includes(d.id)) && !isAllSelected;

  // Department pill color mapping
  const getDepartmentBadgeClass = (dept: string) => {
    switch (dept) {
      case 'Dermatology':
        return 'bg-[#E5F1FF] text-[#0878F9] border-[#BFDBFE]/60';
      case 'Cardiology':
        return 'bg-[#FFECEF] text-[#EF4444] border-[#FECDD3]/60';
      case 'Pediatrics':
        return 'bg-[#EAF8F1] text-[#20B879] border-[#A7F3D0]/60';
      case 'Orthopedics':
        return 'bg-[#EAF2FE] text-[#2563EB] border-[#BFDBFE]/60';
      case 'Gynecology':
        return 'bg-[#F3E8FF] text-[#9333EA] border-[#E9D5FF]/60';
      case 'General Medicine':
        return 'bg-[#E0F7FA] text-[#0284C7] border-[#BAE6FD]/60';
      case 'ENT':
        return 'bg-[#FFF3DC] text-[#D97706] border-[#FDE68A]/60';
      case 'Radiology':
        return 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]/60';
      case 'Oncology':
        return 'bg-[#FCE7F3] text-[#DB2777] border-[#FBCFE8]/60';
      case 'Urology':
        return 'bg-[#E0F2FE] text-[#0891B2] border-[#A5F3FC]/60';
      default:
        return 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]';
    }
  };

  // Status pill color mapping
  const getStatusBadge = (status: DoctorStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-[#EAF8F1] text-[#20B879]">
            Active
          </span>
        );
      case 'On Leave':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-[#FFF3DC] text-[#D97706]">
            On Leave
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-[#FFECEF] text-[#EF4444]">
            Inactive
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#DCEBFA] rounded-[14px] shadow-[0_1px_4px_rgba(16,42,82,0.03)] overflow-hidden flex flex-col">
      {/* Scrollable Table Area */}
      <div className="overflow-x-auto min-h-[380px]">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="bg-[#F8FBFF] border-b border-[#DCEBFA] text-[#5879A6] text-[12px] font-semibold tracking-wide select-none">
              {/* Checkbox column */}
              <th className="py-3.5 pl-4 sm:pl-5 pr-2 w-[44px]">
                <button
                  type="button"
                  onClick={onToggleSelectAll}
                  className="p-1 text-[#5879A6] hover:text-[#0878F9] transition-colors cursor-pointer"
                  aria-label="Select all doctors"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#0878F9]" />
                  ) : isSomeSelected ? (
                    <div className="w-4 h-4 rounded-[4px] border-2 border-[#0878F9] bg-[#0878F9]/10 flex items-center justify-center">
                      <div className="w-2 h-0.5 bg-[#0878F9]" />
                    </div>
                  ) : (
                    <Square className="w-4 h-4 text-[#CBD5E1]" />
                  )}
                </button>
              </th>

              <th className="py-3.5 px-3">Doctor</th>
              <th className="py-3.5 px-3">Department</th>
              <th className="py-3.5 px-3">Specialty</th>
              <th className="py-3.5 px-3">Experience</th>
              <th className="py-3.5 px-3">Consultation Fee</th>
              <th className="py-3.5 px-3">Status</th>
              <th className="py-3.5 px-3">Availability</th>
              <th className="py-3.5 pr-4 sm:pr-5 pl-3 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#EBF3FB] text-[13px]">
            {doctors.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-[#5879A6]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-[#F0F6FF] flex items-center justify-center text-[#0878F9]">
                      <UserX className="w-6 h-6" />
                    </div>
                    <span className="text-[15px] font-bold text-[#102A52]">No doctors found</span>
                    <span className="text-[13px] text-[#5879A6] max-w-xs">
                      Try adjusting your search query or removing active filters.
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              doctors.map((doctor) => {
                const isSelected = selectedDoctorIds.includes(doctor.id);
                const isMenuOpen = activeMenuDoctorId === doctor.id;

                return (
                  <tr
                    key={doctor.id}
                    className={`hover:bg-[#F9FBFF] transition-colors group ${
                      isSelected ? 'bg-[#F0F7FF]' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 pl-4 sm:pl-5 pr-2">
                      <button
                        type="button"
                        onClick={() => onToggleSelectDoctor(doctor.id)}
                        className="p-1 text-[#5879A6] hover:text-[#0878F9] transition-colors cursor-pointer"
                        aria-label={`Select ${doctor.name}`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#0878F9]" />
                        ) : (
                          <Square className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#94A3B8]" />
                        )}
                      </button>
                    </td>

                    {/* Doctor Avatar + Name + ID */}
                    <td className="py-3 px-3">
                      <div
                        onClick={() => onViewProfile(doctor)}
                        className="flex items-center gap-3 cursor-pointer group-hover:opacity-95"
                      >
                        {doctor.imageUrl ? (
                          <img
                            src={doctor.imageUrl}
                            alt={doctor.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 border border-[#DCEBFA]"
                          />
                        ) : (
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#EAF4FF] text-[#0878F9] font-bold text-[13px] flex items-center justify-center shrink-0 border border-[#DCEBFA]">
                            {doctor.name ? doctor.name.replace(/^Dr\.\s*/, '').charAt(0) : 'D'}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-[#102A52] group-hover:text-[#0878F9] transition-colors leading-snug">
                            {doctor.name}
                          </div>
                          <div className="text-[11.5px] font-medium text-[#5879A6] leading-none mt-0.5">
                            {doctor.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department Badge */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-medium border ${getDepartmentBadgeClass(
                          doctor.department
                        )}`}
                      >
                        {doctor.department}
                      </span>
                    </td>

                    {/* Specialty */}
                    <td className="py-3 px-3 text-[#2D3E50] font-normal">
                      {doctor.specialty}
                    </td>

                    {/* Experience */}
                    <td className="py-3 px-3 text-[#2D3E50] font-normal whitespace-nowrap">
                      {doctor.experienceText}
                    </td>

                    {/* Consultation Fee */}
                    <td className="py-3 px-3 text-[#102A52] font-semibold whitespace-nowrap">
                      {doctor.feeText}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getStatusBadge(doctor.status)}
                    </td>

                    {/* Availability */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-start gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#0878F9] shrink-0 mt-0.5 stroke-[2.2]" />
                        <div>
                          <div className="text-[12.5px] font-semibold text-[#102A52] leading-tight">
                            {doctor.availabilityDisplay.days}
                          </div>
                          <div className="text-[11px] text-[#5879A6] leading-tight mt-0.5">
                            {doctor.availabilityDisplay.hours}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3 pr-4 sm:pr-5 pl-3 text-right relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuDoctorId(isMenuOpen ? null : doctor.id);
                        }}
                        className="w-8 h-8 rounded-[8px] hover:bg-[#F0F5FA] text-[#5879A6] hover:text-[#102A52] inline-flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Doctor actions"
                      >
                        <MoreHorizontal className="w-4.5 h-4.5 stroke-[2]" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute right-4 top-11 w-48 bg-white border border-[#DCEBFA] rounded-[12px] shadow-[0_10px_30px_rgba(16,42,82,0.12)] py-1.5 z-50 text-left animate-fadeIn"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuDoctorId(null);
                              onViewProfile(doctor);
                            }}
                            className="w-full px-3.5 py-2 text-[12.5px] text-[#102A52] hover:bg-[#F6FAFF] flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-[#5879A6]" />
                            <span>View Profile</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuDoctorId(null);
                              onEditDoctor(doctor);
                            }}
                            className="w-full px-3.5 py-2 text-[12.5px] text-[#102A52] hover:bg-[#F6FAFF] flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4 text-[#5879A6]" />
                            <span>Edit Doctor</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuDoctorId(null);
                              onSetAvailability(doctor);
                            }}
                            className="w-full px-3.5 py-2 text-[12.5px] text-[#102A52] hover:bg-[#F6FAFF] flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                          >
                            <Clock className="w-4 h-4 text-[#0878F9]" />
                            <span>Set Availability</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuDoctorId(null);
                              onViewSchedule(doctor);
                            }}
                            className="w-full px-3.5 py-2 text-[12.5px] text-[#102A52] hover:bg-[#F6FAFF] flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                          >
                            <Calendar className="w-4 h-4 text-[#5879A6]" />
                            <span>View Schedule</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuDoctorId(null);
                              onSetLeave(doctor);
                            }}
                            className="w-full px-3.5 py-2 text-[12.5px] text-[#D97706] hover:bg-[#FFFBEB] flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                          >
                            <CalendarOff className="w-4 h-4 text-[#D97706]" />
                            <span>{doctor.status === 'On Leave' ? 'Manage Leave' : 'Set Leave'}</span>
                          </button>

                          <div className="my-1 border-t border-[#EBF3FB]" />

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuDoctorId(null);
                              onToggleStatus(doctor);
                            }}
                            className="w-full px-3.5 py-2 text-[12.5px] text-[#5879A6] hover:bg-[#F6FAFF] flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                          >
                            {doctor.status === 'Inactive' ? (
                              <>
                                <UserCheck className="w-4 h-4 text-[#20B879]" />
                                <span className="text-[#20B879]">Activate Doctor</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-4 h-4 text-[#64748B]" />
                                <span>Deactivate Doctor</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuDoctorId(null);
                              onDeleteDoctor(doctor);
                            }}
                            className="w-full px-3.5 py-2 text-[12.5px] text-[#EF4444] hover:bg-[#FFECEF] flex items-center gap-2.5 font-medium transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-[#EF4444]" />
                            <span>Delete Doctor</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar matching the reference exactly */}
      <div className="border-t border-[#DCEBFA] bg-white px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] text-[#5879A6]">
        {/* Showing text */}
        <div>
          Showing{' '}
          <span className="font-semibold text-[#102A52]">
            {totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, totalCount)}
          </span>{' '}
          of <span className="font-semibold text-[#102A52]">{totalCount}</span> doctors
        </div>

        {/* Page navigation controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Previous Page */}
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-8 h-8 rounded-[7px] border border-[#DCEBFA] bg-white hover:bg-[#F8FBFF] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-[#5879A6] hover:text-[#102A52] transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-[7px] text-[13px] font-semibold flex items-center justify-center transition-all cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-[#0878F9] text-white shadow-2xs'
                  : 'bg-white border border-[#DCEBFA] text-[#5879A6] hover:text-[#102A52] hover:bg-[#F8FBFF]'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Next Page */}
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-8 h-8 rounded-[7px] border border-[#DCEBFA] bg-white hover:bg-[#F8FBFF] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-[#5879A6] hover:text-[#102A52] transition-colors cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Page Size Dropdown */}
          <div className="relative ml-2">
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-8 pl-2.5 pr-7 rounded-[7px] bg-white border border-[#DCEBFA] text-[#5879A6] text-[12.5px] font-medium appearance-none focus:outline-none focus:border-[#0878F9] cursor-pointer"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={27}>27 / page</option>
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronRight className="w-3 h-3 text-[#5879A6] rotate-90" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
