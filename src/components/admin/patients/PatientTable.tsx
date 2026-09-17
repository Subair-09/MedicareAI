import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Eye,
  Edit2,
  Calendar,
  ClipboardList,
  Power,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { AdminPatient } from '../../../types';

interface PatientTableProps {
  patients: AdminPatient[];
  availableDepartments?: string[];
  onSelectPatient: (patient: AdminPatient) => void;
  onEditPatient: (patient: AdminPatient) => void;
  onViewHistory: (patient: AdminPatient) => void;
  onViewAppointments: (patient: AdminPatient) => void;
  onToggleStatus: (patientId: string) => void;
  onDeletePatient: (patientId: string) => void;
  onOpenDeleteModal?: (patient: AdminPatient) => void;
  onOpenBulkDeleteModal?: (ids: string[]) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onClearFilters: () => void;
}

export const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  availableDepartments,
  onSelectPatient,
  onEditPatient,
  onViewHistory,
  onViewAppointments,
  onToggleStatus,
  onDeletePatient,
  onOpenDeleteModal,
  onOpenBulkDeleteModal,
  selectedDepartment,
  onDepartmentChange,
  selectedStatus,
  onStatusChange,
  searchQuery,
  onSearchChange,
  onClearFilters,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const menuRef = useRef<HTMLDivElement>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, []);

  const deptOptions =
    availableDepartments && availableDepartments.length > 0
      ? ['All Departments', ...Array.from(new Set(availableDepartments)).filter((d) => d !== 'All Departments')]
      : ['All Departments'];

  // Filtered dataset
  const filteredPatients = patients.filter((patient) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      patient.name.toLowerCase().includes(q) ||
      patient.patientId.toLowerCase().includes(q) ||
      patient.phone.toLowerCase().includes(q) ||
      patient.email.toLowerCase().includes(q) ||
      patient.department.toLowerCase().includes(q);

    const matchesDept =
      selectedDepartment === 'all' ||
      selectedDepartment === 'All Departments' ||
      patient.department.toLowerCase() === selectedDepartment.toLowerCase();

    const matchesStatus =
      selectedStatus === 'all' ||
      selectedStatus === 'All Statuses' ||
      patient.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPatients.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const displayedPatients = filteredPatients.slice(startIndex, startIndex + pageSize);

  const isAllSelected =
    displayedPatients.length > 0 &&
    displayedPatients.every((p) => selectedIds.includes(p.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedPatients.map((p) => p.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderStatusBadge = (status: AdminPatient['status']) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-[#E7F9F0] text-[#19B978]">
            Active
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-[#FFF4E5] text-[#F59E0B]">
            Pending
          </span>
        );
      case 'Inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-[#FEECEE] text-[#EF4444]">
            Inactive
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11.5px] font-semibold bg-[#F1F5F9] text-[#64748B]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-[#DCEBFA] rounded-[16px] overflow-hidden shadow-2xs">
      {/* Top Filter and Actions Bar */}
      <div className="p-4 sm:p-5 border-b border-[#E8F1FB] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 bg-white">
        {/* Left: Large Search Field */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8AA3C6] pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, phone, email or patient ID..."
            className="w-full h-[40px] pl-9 pr-4 bg-white border border-[#DCEBFA] rounded-[10px] text-[13px] text-[#0D2857] placeholder-[#8AA3C6] focus:outline-none focus:border-[#0868F5] focus:ring-2 focus:ring-[#0868F5]/10 transition-all"
          />
        </div>

        {/* Center & Right: Filter Dropdowns & Clear Filters */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Department Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="h-[40px] pl-3.5 pr-8 bg-white border border-[#DCEBFA] rounded-[10px] text-[13px] font-medium text-[#0D2857] focus:outline-none focus:border-[#0868F5] appearance-none cursor-pointer"
            >
              {deptOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5273A8]">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="h-[40px] pl-3.5 pr-8 bg-white border border-[#DCEBFA] rounded-[10px] text-[13px] font-medium text-[#0D2857] focus:outline-none focus:border-[#0868F5] appearance-none cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5273A8]">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            type="button"
            onClick={onClearFilters}
            className="h-[40px] px-3.5 rounded-[10px] border border-[#DCEBFA] bg-white hover:bg-[#F5FAFF] text-[#0868F5] text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Clear Filters</span>
          </button>
        </div>
      </div>

      {/* Selected Batch Action Banner */}
      {selectedIds.length > 0 && (
        <div className="bg-[#FFF8F8] border-b border-[#FECACA] px-4 sm:px-6 py-2.5 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-[13px] text-[#991B1B] font-semibold">
            <span className="w-6 h-6 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center text-[12px] font-bold">
              {selectedIds.length}
            </span>
            <span>patient{selectedIds.length > 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-[12px] font-medium text-[#5879A6] hover:text-[#102A52] px-2.5 py-1 rounded-[6px] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              Deselect All
            </button>
            {onOpenBulkDeleteModal && (
              <button
                type="button"
                onClick={() => onOpenBulkDeleteModal(selectedIds)}
                className="h-[32px] px-3 rounded-[8px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Delete Selected ({selectedIds.length})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Table Responsive Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[920px]">
          <thead>
            <tr className="bg-[#F5FAFF] border-b border-[#E8F1FB] text-[12px] font-semibold text-[#0D2857]">
              {/* 1. Checkbox */}
              <th className="py-3.5 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-[#C4DCF6] text-[#0868F5] focus:ring-[#0868F5]/20 cursor-pointer accent-[#0868F5]"
                  aria-label="Select all patients"
                />
              </th>
              {/* 2. Patient */}
              <th className="py-3.5 px-4 font-semibold text-[#0D2857]">Patient</th>
              {/* 3. Patient ID */}
              <th className="py-3.5 px-4 font-semibold text-[#0D2857]">Patient ID</th>
              {/* 4. Phone */}
              <th className="py-3.5 px-4 font-semibold text-[#0D2857]">Phone</th>
              {/* 5. Email */}
              <th className="py-3.5 px-4 font-semibold text-[#0D2857]">Email</th>
              {/* 6. Department */}
              <th className="py-3.5 px-4 font-semibold text-[#0D2857]">Department</th>
              {/* 7. Last Visit */}
              <th className="py-3.5 px-4 font-semibold text-[#0D2857]">Last Visit</th>
              {/* 8. Status */}
              <th className="py-3.5 px-4 font-semibold text-[#0D2857]">Status</th>
              {/* 9. Actions */}
              <th className="py-3.5 px-4 font-semibold text-[#0D2857] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8F1FB]">
            {displayedPatients.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[#5273A8]">
                  {patients.length === 0 ? (
                    <>
                      <p className="text-[14px] font-semibold text-[#0D2857]">No patient records registered yet</p>
                      <p className="text-[12.5px] mt-1 text-[#8AA3C6]">
                        Click the "Add Patient" button above to record your first patient.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[14px] font-medium">No patient records found matching your filters</p>
                      <p className="text-[12px] mt-1 text-[#8AA3C6]">
                        Try clearing filters or changing your search terms.
                      </p>
                    </>
                  )}
                </td>
              </tr>
            ) : (
              displayedPatients.map((patient) => {
                const isSelected = selectedIds.includes(patient.id);
                const isMenuOpen = activeMenuId === patient.id;

                return (
                  <tr
                    key={patient.id}
                    onClick={() => onSelectPatient(patient)}
                    className={`hover:bg-[#F9FCFF] transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#F2F8FF]' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-3.5 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(patient.id)}
                        className="w-4 h-4 rounded border-[#C4DCF6] text-[#0868F5] focus:ring-[#0868F5]/20 cursor-pointer accent-[#0868F5]"
                        aria-label={`Select ${patient.name}`}
                      />
                    </td>

                    {/* Patient Name & Avatar */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt={patient.name}
                            referrerPolicy="no-referrer"
                            className="w-8.5 h-8.5 rounded-full object-cover border border-[#DCEBFA] shrink-0"
                          />
                        ) : (
                          <div className="w-8.5 h-8.5 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold text-[11.5px] flex items-center justify-center border border-[#DCEBFA] shrink-0">
                            {patient.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-[13.5px] text-[#0D2857] leading-tight hover:text-[#0868F5] transition-colors">
                            {patient.name}
                          </div>
                          <div className="text-[11.5px] text-[#5273A8] mt-0.5">
                            {patient.age} years • {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Patient ID */}
                    <td className="py-3.5 px-4 text-[13px] font-semibold text-[#0D2857]">
                      {patient.patientId}
                    </td>

                    {/* Phone */}
                    <td className="py-3.5 px-4 text-[12.5px] text-[#5273A8] font-normal">
                      {patient.phone}
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-4 text-[12.5px] text-[#5273A8] font-normal">
                      {patient.email}
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-4 text-[13px] font-medium text-[#0D2857]">
                      {patient.department}
                    </td>

                    {/* Last Visit */}
                    <td className="py-3.5 px-4 text-[12.5px] text-[#5273A8]">
                      {patient.lastVisit}
                    </td>

                    {/* Status Pill Badge */}
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(patient.status)}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-3.5 px-4 text-right relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveMenuId(isMenuOpen ? null : patient.id)}
                        className="w-8 h-8 rounded-lg text-[#5273A8] hover:text-[#0D2857] hover:bg-[#F0F5FA] flex items-center justify-center transition-colors cursor-pointer ml-auto"
                        aria-label="Patient actions"
                      >
                        <MoreHorizontal className="w-4.5 h-4.5" />
                      </button>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className="absolute right-4 top-12 w-48 bg-white rounded-[12px] border border-[#E1EDF9] shadow-[0_10px_30px_rgba(13,40,87,0.12)] p-1.5 z-30 text-left animate-fadeIn"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onSelectPatient(patient);
                            }}
                            className="w-full px-3 py-2 text-[12.5px] font-medium text-[#0D2857] hover:bg-[#F5FAFF] hover:text-[#0868F5] rounded-[8px] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#5273A8]" />
                            <span>View Patient</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditPatient(patient);
                            }}
                            className="w-full px-3 py-2 text-[12.5px] font-medium text-[#0D2857] hover:bg-[#F5FAFF] hover:text-[#0868F5] rounded-[8px] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#5273A8]" />
                            <span>Edit Patient</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onViewHistory(patient);
                            }}
                            className="w-full px-3 py-2 text-[12.5px] font-medium text-[#0D2857] hover:bg-[#F5FAFF] hover:text-[#0868F5] rounded-[8px] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <ClipboardList className="w-3.5 h-3.5 text-[#5273A8]" />
                            <span>View History</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onViewAppointments(patient);
                            }}
                            className="w-full px-3 py-2 text-[12.5px] font-medium text-[#0D2857] hover:bg-[#F5FAFF] hover:text-[#0868F5] rounded-[8px] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Calendar className="w-3.5 h-3.5 text-[#5273A8]" />
                            <span>View Appointments</span>
                          </button>

                          <div className="my-1 border-t border-[#F1F6FC]" />

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onToggleStatus(patient.id);
                            }}
                            className="w-full px-3 py-2 text-[12.5px] font-medium text-[#0D2857] hover:bg-[#F5FAFF] hover:text-[#0868F5] rounded-[8px] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Power className="w-3.5 h-3.5 text-[#5273A8]" />
                            <span>
                              {patient.status === 'Active' ? 'Deactivate Patient' : 'Activate Patient'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              if (onOpenDeleteModal) {
                                onOpenDeleteModal(patient);
                              } else {
                                onDeletePatient(patient.id);
                              }
                            }}
                            className="w-full px-3 py-2 text-[12.5px] font-medium text-[#EF4444] hover:bg-[#FFF1F2] rounded-[8px] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />
                            <span>Delete Patient</span>
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

      {/* Table Footer with Showing info and Pagination */}
      <div className="p-4 sm:px-6 sm:py-4 border-t border-[#E8F1FB] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-[#5273A8] bg-white">
        <div>
          Showing <span className="font-semibold text-[#0D2857]">{startIndex + 1}</span> –{' '}
          <span className="font-semibold text-[#0D2857]">
            {Math.min(startIndex + pageSize, 1284)}
          </span>{' '}
          of <span className="font-semibold text-[#0D2857]">1,284</span> patients
        </div>

        {/* Pagination controls: < 1 2 3 4 5 ... 129 > */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-[8px] border border-[#DCEBFA] bg-white text-[#5273A8] hover:bg-[#F5FAFF] hover:text-[#0868F5] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page 1 */}
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className={`w-8 h-8 rounded-[8px] text-[13px] font-bold flex items-center justify-center transition-colors cursor-pointer ${
              currentPage === 1
                ? 'bg-[#0868F5] text-white shadow-2xs'
                : 'border border-[#DCEBFA] bg-white text-[#0D2857] hover:bg-[#F5FAFF]'
            }`}
          >
            1
          </button>

          {/* Page 2 */}
          <button
            type="button"
            onClick={() => setCurrentPage(2)}
            className={`w-8 h-8 rounded-[8px] text-[13px] font-semibold flex items-center justify-center transition-colors cursor-pointer ${
              currentPage === 2
                ? 'bg-[#0868F5] text-white shadow-2xs'
                : 'border border-[#DCEBFA] bg-white text-[#0D2857] hover:bg-[#F5FAFF]'
            }`}
          >
            2
          </button>

          {/* Page 3 */}
          <button
            type="button"
            onClick={() => setCurrentPage(3)}
            className={`w-8 h-8 rounded-[8px] text-[13px] font-semibold hidden sm:flex items-center justify-center transition-colors cursor-pointer ${
              currentPage === 3
                ? 'bg-[#0868F5] text-white shadow-2xs'
                : 'border border-[#DCEBFA] bg-white text-[#0D2857] hover:bg-[#F5FAFF]'
            }`}
          >
            3
          </button>

          {/* Page 4 */}
          <button
            type="button"
            onClick={() => setCurrentPage(4)}
            className={`w-8 h-8 rounded-[8px] text-[13px] font-semibold hidden md:flex items-center justify-center transition-colors cursor-pointer ${
              currentPage === 4
                ? 'bg-[#0868F5] text-white shadow-2xs'
                : 'border border-[#DCEBFA] bg-white text-[#0D2857] hover:bg-[#F5FAFF]'
            }`}
          >
            4
          </button>

          {/* Page 5 */}
          <button
            type="button"
            onClick={() => setCurrentPage(5)}
            className={`w-8 h-8 rounded-[8px] text-[13px] font-semibold hidden lg:flex items-center justify-center transition-colors cursor-pointer ${
              currentPage === 5
                ? 'bg-[#0868F5] text-white shadow-2xs'
                : 'border border-[#DCEBFA] bg-white text-[#0D2857] hover:bg-[#F5FAFF]'
            }`}
          >
            5
          </button>

          {/* Ellipsis */}
          <span className="px-1 text-[#8AA3C6] font-bold select-none">...</span>

          {/* Page 129 */}
          <button
            type="button"
            onClick={() => setCurrentPage(129)}
            className={`w-8 h-8 rounded-[8px] text-[13px] font-semibold flex items-center justify-center transition-colors cursor-pointer ${
              currentPage === 129
                ? 'bg-[#0868F5] text-white shadow-2xs'
                : 'border border-[#DCEBFA] bg-white text-[#0D2857] hover:bg-[#F5FAFF]'
            }`}
          >
            129
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, 129))}
            disabled={currentPage === 129}
            className="w-8 h-8 rounded-[8px] border border-[#DCEBFA] bg-white text-[#5273A8] hover:bg-[#F5FAFF] hover:text-[#0868F5] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
