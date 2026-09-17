import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Plus,
  MoreHorizontal,
  Eye,
  Edit2,
  Users,
  Calendar,
  Power,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Stethoscope
} from 'lucide-react';
import { AdminDepartment } from '../../../types';
import { DepartmentIcon } from './DepartmentIcon';

interface DepartmentTableProps {
  departments: AdminDepartment[];
  onAddDepartmentClick: () => void;
  onViewDepartment: (dept: AdminDepartment, initialTab?: 'overview' | 'edit' | 'doctors') => void;
  onEditDepartment: (dept: AdminDepartment) => void;
  onManageDoctors?: (dept: AdminDepartment) => void;
  onViewSchedule?: (dept: AdminDepartment) => void;
  onToggleStatus: (deptId: string) => void;
  onDeleteDepartment: (deptId: string) => void;
  selectedDepartmentFilter: string;
  onDepartmentFilterChange: (deptName: string) => void;
  selectedStatusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  onAddDepartmentClick,
  onViewDepartment,
  onEditDepartment,
  onManageDoctors,
  onViewSchedule,
  onToggleStatus,
  onDeleteDepartment,
  selectedDepartmentFilter,
  onDepartmentFilterChange,
  selectedStatusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

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

  // Filtered dataset
  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.headDoctor.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDepartmentFilter === 'all' ||
      selectedDepartmentFilter === 'All Departments' ||
      dept.name === selectedDepartmentFilter;

    const matchesStatus =
      selectedStatusFilter === 'all' ||
      selectedStatusFilter === 'All Statuses' ||
      dept.status.toLowerCase() === selectedStatusFilter.toLowerCase();

    return matchesSearch && matchesDept && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDepartments.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const displayedDepartments = filteredDepartments.slice(startIndex, startIndex + pageSize);

  const isAllSelected =
    displayedDepartments.length > 0 &&
    displayedDepartments.every((d) => selectedIds.includes(d.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayedDepartments.map((d) => d.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-white border border-[#DCEBFA] rounded-[16px] overflow-hidden shadow-2xs">
      {/* Top Filter and Actions Bar */}
      <div className="p-4 sm:p-5 border-b border-[#E8F1FB] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 bg-white">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-sm">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search departments..."
            className="w-full h-[40px] pl-9 pr-4 bg-white border border-[#DCEBFA] rounded-[10px] text-[13px] text-[#0D2857] placeholder-[#94A3B8] focus:outline-none focus:border-[#0868F5] focus:ring-2 focus:ring-[#0868F5]/10 transition-all"
          />
        </div>

        {/* Center & Right: Filter Dropdowns & Add Button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Department Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedDepartmentFilter}
              onChange={(e) => onDepartmentFilterChange(e.target.value)}
              className="h-[40px] pl-3.5 pr-8 bg-white border border-[#DCEBFA] rounded-[10px] text-[13px] font-medium text-[#0D2857] focus:outline-none focus:border-[#0868F5] appearance-none cursor-pointer"
            >
              <option value="All Departments">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
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
              value={selectedStatusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="h-[40px] pl-3.5 pr-8 bg-white border border-[#DCEBFA] rounded-[10px] text-[13px] font-medium text-[#0D2857] focus:outline-none focus:border-[#0868F5] appearance-none cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5273A8]">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>

          {/* Add Department Blue Button */}
          <button
            type="button"
            onClick={onAddDepartmentClick}
            className="h-[40px] px-4 rounded-[10px] bg-[#0868F5] hover:bg-[#075edc] active:scale-[0.99] text-white text-[13px] font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* Main Table Responsive Container */}
      <div className="overflow-x-auto min-h-[300px] pb-8">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-[#F5FAFF] border-b border-[#E8F1FB] text-[12.5px] font-semibold text-[#5273A8]">
              {/* Checkbox Column */}
              <th className="py-3.5 px-4 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-[#C4DCF6] text-[#0868F5] focus:ring-[#0868F5]/20 cursor-pointer accent-[#0868F5]"
                  aria-label="Select all departments"
                />
              </th>
              <th className="py-3.5 px-4 font-semibold text-[#0D2857]">Department</th>
              <th className="py-3.5 px-4 font-semibold text-[#0D2857]">Description</th>
              <th className="py-3.5 px-4 font-semibold text-[#0D2857]">Head Doctor</th>
              <th className="py-3.5 px-4 font-semibold text-[#0D2857] text-center">Total Doctors</th>
              <th className="py-3.5 px-4 font-semibold text-[#0D2857]">Status</th>
              <th className="py-3.5 px-4 font-semibold text-[#0D2857] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8F1FB]">
            {displayedDepartments.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-14 text-center text-[#5273A8]">
                  <div className="w-12 h-12 rounded-full bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center mx-auto mb-3 shadow-2xs">
                    <Stethoscope className="w-6 h-6 stroke-[2]" />
                  </div>
                  <p className="text-[15px] font-bold text-[#0D2857]">
                    {departments.length === 0 ? 'No departments registered yet' : 'No departments found matching your criteria'}
                  </p>
                  <p className="text-[12.5px] mt-1 text-[#5273A8] max-w-sm mx-auto">
                    {departments.length === 0
                      ? 'Use the "Add Department" form to create your first hospital department and assign specialists.'
                      : 'Try adjusting your search query or filter options.'}
                  </p>
                </td>
              </tr>
            ) : (
              displayedDepartments.map((dept, index) => {
                const isSelected = selectedIds.includes(dept.id);
                const isMenuOpen = activeMenuId === dept.id;
                const headDocInitial = (dept.headDoctor?.name || 'D').charAt(0).toUpperCase();

                return (
                  <tr
                    key={dept.id}
                    className={`hover:bg-[#F9FCFF] transition-colors ${
                      isSelected ? 'bg-[#F2F8FF]' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(dept.id)}
                        className="w-4 h-4 rounded border-[#C4DCF6] text-[#0868F5] focus:ring-[#0868F5]/20 cursor-pointer accent-[#0868F5]"
                        aria-label={`Select ${dept.name}`}
                      />
                    </td>

                    {/* Department Name & Icon */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <DepartmentIcon
                          type={dept.iconType}
                          bgTint={dept.bgTint}
                          iconColor={dept.iconColor}
                          size="md"
                        />
                        <span className="font-bold text-[13.5px] text-[#0D2857] whitespace-nowrap">
                          {dept.name}
                        </span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="py-3.5 px-4 max-w-[260px]">
                      <p className="text-[12px] text-[#5273A8] leading-relaxed line-clamp-2">
                        {dept.description}
                      </p>
                    </td>

                    {/* Head Doctor */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        {dept.headDoctor?.avatar ? (
                          <img
                            src={dept.headDoctor.avatar}
                            alt={dept.headDoctor.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-[#DCEBFA] shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold text-[12px] flex items-center justify-center border border-[#DCEBFA] shrink-0">
                            {headDocInitial}
                          </div>
                        )}
                        <div>
                          <div className="text-[13px] font-bold text-[#0D2857] leading-tight whitespace-nowrap">
                            {dept.headDoctor?.name || 'Unassigned'}
                          </div>
                          <div className="text-[11px] text-[#5273A8] whitespace-nowrap">
                            {dept.headDoctor?.role || 'Department Specialist'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Total Doctors */}
                    <td className="py-3.5 px-4 text-center font-semibold text-[13.5px] text-[#0D2857]">
                      <button
                        type="button"
                        onClick={() => (onManageDoctors ? onManageDoctors(dept) : onViewDepartment(dept, 'doctors'))}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0F6FE] hover:bg-[#E0EEFE] text-[#0868F5] transition-colors cursor-pointer"
                        title="Click to view and manage doctors in this department"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{dept.totalDoctors || 0}</span>
                      </button>
                    </td>

                    {/* Status Pill Badge with Direct Interactive Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(dept.id)}
                        title={`Click to ${dept.status === 'Active' ? 'deactivate' : 'activate'} "${dept.name}"`}
                        className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold transition-all cursor-pointer border ${
                          dept.status === 'Active'
                            ? 'bg-[#E7F9F0] text-[#18B978] border-[#A7F3D0]/60 hover:bg-[#FEE2E2] hover:text-[#DC2626] hover:border-[#FECACA]'
                            : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0] hover:bg-[#E7F9F0] hover:text-[#18B978] hover:border-[#A7F3D0]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            dept.status === 'Active'
                              ? 'bg-[#18B978] group-hover:bg-[#DC2626]'
                              : 'bg-[#94A3B8] group-hover:bg-[#18B978]'
                          }`}
                        />
                        <span className="group-hover:hidden">{dept.status}</span>
                        <span className="hidden group-hover:inline">
                          {dept.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </span>
                      </button>
                    </td>

                    {/* Actions: Inline Quick Action Buttons + Three-dot Menu */}
                    <td className="py-3.5 px-4 text-right relative">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick View Button */}
                        <button
                          type="button"
                          onClick={() => onViewDepartment(dept, 'overview')}
                          title="View Department Details"
                          className="w-8 h-8 rounded-lg text-[#5273A8] hover:text-[#0868F5] hover:bg-[#EAF4FF] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Quick Edit Button */}
                        <button
                          type="button"
                          onClick={() => onEditDepartment(dept)}
                          title="Edit Department"
                          className="w-8 h-8 rounded-lg text-[#5273A8] hover:text-[#0868F5] hover:bg-[#EAF4FF] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Quick Manage Doctors Button */}
                        <button
                          type="button"
                          onClick={() => (onManageDoctors ? onManageDoctors(dept) : onViewDepartment(dept, 'doctors'))}
                          title="Manage Assigned Doctors"
                          className="px-2.5 h-8 rounded-lg bg-[#EAF4FF] hover:bg-[#D5E8FE] text-[#0868F5] text-[11.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Doctors</span>
                        </button>

                        {/* Quick Toggle Status (Power) Button */}
                        <button
                          type="button"
                          onClick={() => onToggleStatus(dept.id)}
                          title={dept.status === 'Active' ? 'Deactivate Department' : 'Activate Department'}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                            dept.status === 'Active'
                              ? 'text-[#5273A8] hover:text-[#DC2626] hover:bg-[#FEE2E2]'
                              : 'text-[#18B978] hover:bg-[#E7F9F0]'
                          }`}
                        >
                          <Power className="w-4 h-4" />
                        </button>

                        {/* Quick Delete Button */}
                        <button
                          type="button"
                          onClick={() => onDeleteDepartment(dept.id)}
                          title="Delete Department"
                          className="w-8 h-8 rounded-lg text-[#5273A8] hover:text-[#DC2626] hover:bg-[#FEE2E2] flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Three-dot dropdown toggle */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(isMenuOpen ? null : dept.id);
                          }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                            isMenuOpen
                              ? 'bg-[#0868F5] text-white'
                              : 'text-[#5273A8] hover:text-[#0D2857] hover:bg-[#F0F5FA]'
                          }`}
                          aria-label="Department actions"
                        >
                          <MoreHorizontal className="w-4.5 h-4.5" />
                        </button>
                      </div>

                      {/* Dropdown Menu */}
                      {isMenuOpen && (
                        <div
                          ref={menuRef}
                          className={`absolute right-4 ${
                            index >= Math.max(1, displayedDepartments.length - 2) && displayedDepartments.length > 2
                              ? 'bottom-11'
                              : 'top-12'
                          } w-52 bg-white rounded-[14px] border border-[#DCEBFA] shadow-[0_12px_36px_rgba(13,40,87,0.18)] p-1.5 z-50 text-left animate-fadeIn`}
                        >
                          <div className="px-3 py-1.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                            Department Actions
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onViewDepartment(dept, 'overview');
                            }}
                            className="w-full px-3 py-2 text-[12.5px] font-semibold text-[#0D2857] hover:bg-[#F5FAFF] hover:text-[#0868F5] rounded-[8px] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Eye className="w-4 h-4 text-[#5273A8]" />
                            <span>View Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditDepartment(dept);
                            }}
                            className="w-full px-3 py-2 text-[12.5px] font-semibold text-[#0D2857] hover:bg-[#F5FAFF] hover:text-[#0868F5] rounded-[8px] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-[#5273A8]" />
                            <span>Edit Department</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              if (onManageDoctors) onManageDoctors(dept);
                              else onViewDepartment(dept, 'doctors');
                            }}
                            className="w-full px-3 py-2 text-[12.5px] font-semibold text-[#0D2857] hover:bg-[#F5FAFF] hover:text-[#0868F5] rounded-[8px] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Users className="w-4 h-4 text-[#0868F5]" />
                            <span className="flex-1">Manage Doctors</span>
                            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold">
                              {dept.totalDoctors || 0}
                            </span>
                          </button>

                          {onViewSchedule && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMenuId(null);
                                onViewSchedule(dept);
                              }}
                              className="w-full px-3 py-2 text-[12.5px] font-semibold text-[#0D2857] hover:bg-[#F5FAFF] hover:text-[#0868F5] rounded-[8px] flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <Calendar className="w-4 h-4 text-[#5273A8]" />
                              <span>View Schedule</span>
                            </button>
                          )}

                          <div className="my-1 border-t border-[#F1F6FC]" />

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onToggleStatus(dept.id);
                            }}
                            className="w-full px-3 py-2 text-[12.5px] font-semibold text-[#0D2857] hover:bg-[#F5FAFF] hover:text-[#0868F5] rounded-[8px] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Power className="w-4 h-4 text-[#5273A8]" />
                            <span>
                              {dept.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteDepartment(dept.id);
                            }}
                            className="w-full px-3 py-2 text-[12.5px] font-semibold text-[#EF4444] hover:bg-[#FFF1F2] rounded-[8px] flex items-center gap-2 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-[#EF4444]" />
                            <span>Delete Department</span>
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
      <div className="p-4 sm:px-6 sm:py-4 border-t border-[#E8F1FB] flex items-center justify-between text-[12.5px] text-[#5273A8] bg-white">
        <div>
          {filteredDepartments.length === 0 ? (
            <span>Showing <span className="font-semibold text-[#0D2857]">0</span> departments</span>
          ) : (
            <>
              Showing <span className="font-semibold text-[#0D2857]">{startIndex + 1}</span> –{' '}
              <span className="font-semibold text-[#0D2857]">
                {Math.min(startIndex + pageSize, filteredDepartments.length)}
              </span>{' '}
              of <span className="font-semibold text-[#0D2857]">{filteredDepartments.length}</span>{' '}
              departments
            </>
          )}
        </div>

        {/* Pagination controls */}
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

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              type="button"
              onClick={() => setCurrentPage(pageNum)}
              className={`w-8 h-8 rounded-[8px] text-[13px] font-bold flex items-center justify-center transition-colors cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-[#0868F5] text-white shadow-2xs'
                  : 'border border-[#DCEBFA] bg-white text-[#0D2857] hover:bg-[#F5FAFF]'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
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
