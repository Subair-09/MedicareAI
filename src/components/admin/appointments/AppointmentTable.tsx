import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MoreVertical,
  CheckCircle2,
  CalendarClock,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Check,
  Trash2
} from 'lucide-react';
import { Appointment, AppointmentStatus } from '../../../types';

interface AppointmentTableProps {
  appointments: Appointment[];
  selectedAppointmentId: string | null;
  onSelectAppointment: (appointment: Appointment) => void;
  onOpenRescheduleModal: (appointment: Appointment) => void;
  onOpenCancelModal: (appointment: Appointment) => void;
  onOpenDeleteModal: (appointment: Appointment) => void;
  onOpenBulkDeleteModal?: (ids: string[]) => void;
  onMarkAsCompleted: (appointmentId: string) => void;
  onConfirmAppointment: (appointmentId: string) => void;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  selectedAppointmentId,
  onSelectAppointment,
  onOpenRescheduleModal,
  onOpenCancelModal,
  onOpenDeleteModal,
  onOpenBulkDeleteModal,
  onMarkAsCompleted,
  onConfirmAppointment,
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  const handleToggleSelectAll = () => {
    if (selectedRowIds.length === appointments.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(appointments.map((a) => a.id));
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#ECFDF5] text-[#059669]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Confirmed
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FFFBEB] text-[#D97706]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            Pending
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#EFF6FF] text-[#2563EB]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
            Completed
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-[#FEF2F2] text-[#DC2626]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            Cancelled
          </span>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Emergency':
        return 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
      case 'Specialist Exam':
        return 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]';
      case 'Follow-up':
        return 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]';
      default:
        return 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]';
    }
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="bg-white rounded-[14px] border border-[#E1EDF9] shadow-2xs overflow-hidden flex flex-col justify-between">
      {/* Selected Batch Action Banner */}
      {selectedRowIds.length > 0 && (
        <div className="bg-[#FFF8F8] border-b border-[#FECACA] px-4 py-2.5 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2 text-[13px] text-[#991B1B] font-semibold">
            <span className="w-6 h-6 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center text-[12px] font-bold">
              {selectedRowIds.length}
            </span>
            <span>appointment{selectedRowIds.length > 1 ? 's' : ''} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedRowIds([])}
              className="text-[12px] font-medium text-[#5879A6] hover:text-[#102A52] px-2.5 py-1 rounded-[6px] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
            >
              Deselect All
            </button>
            {onOpenBulkDeleteModal && (
              <button
                type="button"
                onClick={() => onOpenBulkDeleteModal(selectedRowIds)}
                className="h-[32px] px-3 rounded-[8px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-[0.98]"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2.2]" />
                <span>Delete Selected ({selectedRowIds.length})</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table Container with horizontal scroll on small screens */}
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-[#F8FBFF] border-b border-[#E1EDF9] text-[12px] font-bold text-[#5879A6] tracking-wide uppercase">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={
                    appointments.length > 0 &&
                    selectedRowIds.length === appointments.length
                  }
                  onChange={handleToggleSelectAll}
                  className="rounded border-[#CBD5E1] text-[#0878F9] focus:ring-[#0878F9] w-4 h-4 cursor-pointer"
                />
              </th>
              <th className="py-3 px-3">Patient</th>
              <th className="py-3 px-3">Doctor & Dept</th>
              <th className="py-3 px-3">Date & Time</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right w-16">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBF2FA] text-[13px]">
            {appointments.length > 0 ? (
              appointments.map((apt) => {
                const isSelected = selectedAppointmentId === apt.id;
                const isRowChecked = selectedRowIds.includes(apt.id);

                return (
                  <tr
                    key={apt.id}
                    onClick={() => onSelectAppointment(apt)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-[#F0F7FF] hover:bg-[#EAF3FF]'
                        : 'hover:bg-[#F9FCFF]'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isRowChecked}
                        onChange={(e) => handleToggleRow(apt.id, e as unknown as React.MouseEvent)}
                        className="rounded border-[#CBD5E1] text-[#0878F9] focus:ring-[#0878F9] w-4 h-4 cursor-pointer"
                      />
                    </td>

                    {/* Patient Column */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        {apt.patientAvatar ? (
                          <img
                            src={apt.patientAvatar}
                            alt={apt.patientName}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-[#E1EDF9] shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center font-bold text-[13px] border border-[#BFDBFE] shrink-0">
                            {apt.patientName ? apt.patientName.charAt(0).toUpperCase() : 'P'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-[#102A52] group-hover:text-[#0878F9] transition-colors truncate">
                            {apt.patientName}
                          </div>
                          <div className="text-[11.5px] text-[#5879A6] flex items-center gap-1.5 font-medium">
                            <span>{apt.patientId}</span>
                            <span>•</span>
                            <span>{apt.patientGender || 'Patient'}{apt.patientAge ? `, ${apt.patientAge}y` : ''}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Doctor & Dept Column */}
                    <td className="py-3.5 px-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-[#102A52] truncate">
                          {apt.doctorName}
                        </div>
                        <div className="text-[11.5px] text-[#5879A6] truncate font-medium">
                          {apt.department} • {apt.room}
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[#102A52] font-semibold text-[12.5px]">
                          <Calendar className="w-3.5 h-3.5 text-[#5879A6]" />
                          <span>{apt.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#5879A6] text-[11.5px] font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                          <span>{apt.time}</span>
                        </div>
                      </div>
                    </td>

                    {/* Visit Type */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-[6px] text-[11.5px] font-medium border ${getTypeBadge(
                          apt.type
                        )}`}
                      >
                        {apt.type}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      {getStatusBadge(apt.status)}
                    </td>

                    {/* Actions Menu */}
                    <td
                      className="py-3.5 px-4 text-right relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === apt.id ? null : apt.id)
                        }
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#102A52] hover:bg-[#EBF2F9] transition-colors cursor-pointer"
                        aria-label="Appointment actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === apt.id && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setActiveMenuId(null)}
                          />
                          <div className="absolute right-4 top-11 w-48 bg-white rounded-[12px] border border-[#E1EDF9] shadow-xl py-1.5 z-50 text-left text-[12.5px]">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectAppointment(apt);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#102A52] hover:bg-[#F8FBFF] hover:text-[#0878F9] font-medium cursor-pointer"
                            >
                              <Eye className="w-4 h-4 text-[#5879A6]" />
                              <span>View Details</span>
                            </button>

                            {apt.status === 'Pending' && (
                              <button
                                type="button"
                                onClick={() => {
                                  onConfirmAppointment(apt.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#059669] hover:bg-[#ECFDF5] font-medium cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Confirm Appointment</span>
                              </button>
                            )}

                            {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenRescheduleModal(apt);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#102A52] hover:bg-[#F8FBFF] hover:text-[#0878F9] font-medium cursor-pointer"
                              >
                                <CalendarClock className="w-4 h-4 text-[#5879A6]" />
                                <span>Reschedule</span>
                              </button>
                            )}

                            {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  onMarkAsCompleted(apt.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#2563EB] hover:bg-[#EFF6FF] font-medium cursor-pointer"
                              >
                                <Check className="w-4 h-4" />
                                <span>Mark as Completed</span>
                              </button>
                            )}

                            {apt.status !== 'Cancelled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  onOpenCancelModal(apt);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#DC2626] hover:bg-[#FEF2F2] font-medium border-t border-[#F1F5F9] cursor-pointer"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Cancel Appointment</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                onOpenDeleteModal(apt);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3.5 py-2 flex items-center gap-2.5 text-[#DC2626] hover:bg-[#FEF2F2] font-medium border-t border-[#F1F5F9] cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Appointment</span>
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-12 text-center text-[#5879A6]">
                  <div className="w-12 h-12 rounded-full bg-[#F0F5FA] flex items-center justify-center mx-auto mb-3 text-[#94A3B8]">
                    <Calendar className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <div className="text-[14px] font-bold text-[#102A52]">
                    No appointments found
                  </div>
                  <p className="text-[12.5px] text-[#5879A6] mt-1">
                    Try adjusting your search criteria or filter selections.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 sm:px-4 bg-[#F8FBFF] border-t border-[#E1EDF9] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px]">
        {/* Left: Summary and page size selector */}
        <div className="flex items-center gap-3 text-[#5879A6]">
          <span>
            Showing <strong className="text-[#102A52]">{totalCount > 0 ? startIndex : 0}</strong> to{' '}
            <strong className="text-[#102A52]">{endIndex}</strong> of{' '}
            <strong className="text-[#102A52]">{totalCount}</strong> appointments
          </span>

          <div className="hidden md:flex items-center gap-1.5 ml-2 pl-3 border-l border-[#E1EDF9]">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-[#CBD5E1] rounded-[6px] px-2 py-0.5 text-[#102A52] font-medium text-[12px] focus:outline-none"
            >
              <option value={6}>6 per page</option>
              <option value={8}>8 per page</option>
              <option value={12}>12 per page</option>
            </select>
          </div>
        </div>

        {/* Right: Pagination buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="w-8 h-8 rounded-[8px] border border-[#E1EDF9] bg-white flex items-center justify-center text-[#5879A6] hover:text-[#102A52] hover:bg-[#F0F5FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-[8px] text-[12px] font-bold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#0878F9] text-white shadow-2xs'
                    : 'bg-white border border-[#E1EDF9] text-[#5879A6] hover:bg-[#F0F5FA] hover:text-[#102A52]'
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="w-8 h-8 rounded-[8px] border border-[#E1EDF9] bg-white flex items-center justify-center text-[#5879A6] hover:text-[#102A52] hover:bg-[#F0F5FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
