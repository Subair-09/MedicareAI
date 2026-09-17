import React, { useState } from 'react';
import { Calendar, MoreHorizontal, Clock, XCircle, FileText, ChevronRight, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Appointment } from '../../types';
import { api } from '../../services/api';

export type AppointmentFilter = 'All' | 'Booked' | 'Rescheduled' | 'Cancelled';

interface RecentAppointmentsTableProps {
  appointments?: Appointment[];
  onViewAll?: () => void;
  onNavigateAppointments?: () => void;
  onDeleteAppointment?: (id: string) => void;
}

export const RecentAppointmentsTable: React.FC<RecentAppointmentsTableProps> = ({
  appointments = [],
  onViewAll,
  onNavigateAppointments,
  onDeleteAppointment,
}) => {
  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [confirmDeleteApt, setConfirmDeleteApt] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (apt: Appointment) => {
    setIsDeleting(true);
    try {
      await api.deleteAppointment(apt.id);
      if (onDeleteAppointment) {
        onDeleteAppointment(apt.id);
      }
      if (selectedAppointment?.id === apt.id) {
        setSelectedAppointment(null);
      }
      setConfirmDeleteApt(null);
    } catch (err) {
      console.error('Failed to delete appointment:', err);
      if (onDeleteAppointment) {
        onDeleteAppointment(apt.id);
      }
      setConfirmDeleteApt(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Booked') return apt.status === 'Confirmed' || apt.status === 'Pending';
    if (activeFilter === 'Rescheduled') return (apt as any).status === 'Rescheduled';
    if (activeFilter === 'Cancelled') return apt.status === 'Cancelled';
    return true;
  });

  return (
    <div className="bg-white rounded-[12px] border border-[#E1EDF9] p-5 sm:p-5.5 shadow-2xs text-left">
      {/* Header Row: Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[8px] bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center shrink-0">
              <Calendar className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-[15.5px] sm:text-[16px] font-bold text-[#102A52] tracking-tight">
                Recent Appointments
              </h2>
              <p className="text-[11.5px] text-[#5879A6] font-medium">
                Live patient scheduling and consultation roster
              </p>
            </div>
          </div>
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="sm:hidden text-[12.5px] font-semibold text-[#0878F9] hover:underline"
            >
              View All
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(['All', 'Booked', 'Rescheduled', 'Cancelled'] as AppointmentFilter[]).map((tab) => {
              const isActive = activeFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveFilter(tab)}
                  className={`text-[12px] font-semibold px-3 py-1 rounded-[8px] transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0878F9] text-white shadow-2xs'
                      : 'bg-white border border-[#E1EDF9] text-[#5879A6] hover:text-[#102A52] hover:bg-[#F8FBFF]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="hidden sm:inline-block text-[12.5px] font-semibold text-[#0878F9] hover:underline cursor-pointer ml-2 whitespace-nowrap"
            >
              View All
            </button>
          )}
        </div>
      </div>

      {/* Appointment Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr className="border-b border-[#E1EDF9] text-[#5879A6] text-[12px] font-semibold">
              <th className="pb-3 pl-1 font-semibold">Patient</th>
              <th className="pb-3 font-semibold">Doctor</th>
              <th className="pb-3 font-semibold">Department</th>
              <th className="pb-3 font-semibold">Date & Time</th>
              <th className="pb-3 font-semibold">Status</th>
              <th className="pb-3 text-right pr-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F6FB]">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[13px] text-[#94A3B8]">
                  No appointments found for "{activeFilter}" status.
                </td>
              </tr>
            ) : (
              filteredAppointments.map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-[#F9FCFF] transition-colors group"
                >
                  {/* Patient Column */}
                  <td className="py-3.5 pl-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={apt.patientAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80'}
                        alt={apt.patientName}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-[#E1EDF9] shrink-0"
                      />
                      <div>
                        <div className="text-[13.5px] font-bold text-[#102A52] leading-tight">
                          {apt.patientName}
                        </div>
                        <div className="text-[11.5px] text-[#5879A6] font-medium leading-tight mt-0.5">
                          {apt.patientId}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Doctor Column */}
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={apt.doctorAvatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&h=120&q=80'}
                        alt={apt.doctorName}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-[#E1EDF9] shrink-0"
                      />
                      <div>
                        <div className="text-[13.5px] font-bold text-[#102A52] leading-tight">
                          {apt.doctorName}
                        </div>
                        <div className="text-[11.5px] text-[#5879A6] font-normal leading-tight mt-0.5">
                          {apt.doctorSpecialty}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Department Column */}
                  <td className="py-3.5 text-[13px] font-medium text-[#2D3E50]">
                    {apt.department}
                  </td>

                  {/* Date & Time Column */}
                  <td className="py-3.5 text-[13px] font-medium text-[#2D3E50]">
                    {apt.date}, {apt.time}
                  </td>

                  {/* Status Column with Rounded Pill Badge */}
                  <td className="py-3.5">
                    {apt.status === 'Confirmed' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#E7F8F1] text-[#20B879]">
                        Confirmed
                      </span>
                    )}
                    {apt.status === 'Pending' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFF4DE] text-[#D97706]">
                        Pending
                      </span>
                    )}
                    {apt.status === 'Completed' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#EAF4FF] text-[#0878F9]">
                        Completed
                      </span>
                    )}
                    {(apt.status as string) === 'Rescheduled' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#F0EAFF] text-[#7C4DDB]">
                        Rescheduled
                      </span>
                    )}
                    {apt.status === 'Cancelled' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFECEF] text-[#EF4444]">
                        Cancelled
                      </span>
                    )}
                  </td>

                  {/* Action Column with Three-Dot Menu */}
                  <td className="py-3.5 text-right pr-2 relative">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveMenuId(activeMenuId === apt.id ? null : apt.id)
                      }
                      className="p-1.5 rounded-lg text-[#5879A6] hover:text-[#102A52] hover:bg-[#EDF4FA] transition-colors cursor-pointer"
                      aria-label={`Actions for ${apt.patientName}`}
                    >
                      <MoreHorizontal className="w-4.5 h-4.5" />
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuId === apt.id && (
                      <div className="absolute right-2 top-11 w-44 bg-white rounded-[10px] border border-[#E1EDF9] shadow-[0_8px_24px_rgba(20,80,140,0.1)] p-1.5 z-30 text-left animate-fadeIn">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[12px] font-medium text-[#102A52] hover:bg-[#F6FAFF] hover:text-[#0878F9] rounded-[6px] transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                        {onNavigateAppointments && (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onNavigateAppointments();
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[12px] font-medium text-[#102A52] hover:bg-[#F6FAFF] hover:text-[#0878F9] rounded-[6px] transition-colors cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Manage in Roster</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            setConfirmDeleteApt(apt);
                          }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[12px] font-medium text-[#DC2626] hover:bg-[#FEF2F2] rounded-[6px] transition-colors border-t border-[#F1F5F9] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Appointment</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[16px] border border-[#E1EDF9] shadow-2xl max-w-md w-full p-6 text-left animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#E1EDF9]">
              <h3 className="font-bold text-[16px] text-[#102A52]">
                Appointment Record ({selectedAppointment.id})
              </h3>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="text-[#94A3B8] hover:text-[#102A52] text-[18px] font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2.5 text-[13px]">
              <div className="flex items-center justify-between">
                <span className="text-[#5879A6]">Patient:</span>
                <span className="font-bold text-[#102A52]">{selectedAppointment.patientName} ({selectedAppointment.patientId})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5879A6]">Doctor:</span>
                <span className="font-bold text-[#102A52]">{selectedAppointment.doctorName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5879A6]">Specialty:</span>
                <span className="font-bold text-[#102A52]">{selectedAppointment.doctorSpecialty}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5879A6]">Department:</span>
                <span className="font-bold text-[#102A52]">{selectedAppointment.department}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5879A6]">Room:</span>
                <span className="font-bold text-[#102A52]">{selectedAppointment.room || 'General Clinic'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5879A6]">Scheduled Time:</span>
                <span className="font-bold text-[#102A52]">{selectedAppointment.date} at {selectedAppointment.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5879A6]">Consultation Fee:</span>
                <span className="font-bold text-[#20B879]">{(selectedAppointment as any).fee || '$120.00'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5879A6]">Status:</span>
                <span className="font-bold text-[#0878F9]">{selectedAppointment.status}</span>
              </div>
              {selectedAppointment.notes && (
                <div className="pt-2 border-t border-[#F1F6FB]">
                  <span className="text-[#5879A6] block text-[12px] mb-0.5">Clinical Notes:</span>
                  <p className="text-[#2D3E50] text-[12.5px] bg-[#F8FBFF] p-2.5 rounded-[8px] border border-[#E1EDF9]">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#E1EDF9] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  const toDel = selectedAppointment;
                  setSelectedAppointment(null);
                  setConfirmDeleteApt(toDel);
                }}
                className="px-3 py-2 rounded-[8px] border border-[#FECACA] text-[#DC2626] hover:bg-[#FEF2F2] font-semibold text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="px-4 py-2 rounded-[8px] bg-[#0878F9] text-white font-semibold text-[13px] hover:bg-[#0768D6] cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDeleteApt && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[16px] max-w-md w-full p-6 shadow-2xl border border-[#FCA5A5] text-left animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-[17px] font-bold text-[#102A52] mb-1">
              Delete Appointment?
            </h3>
            <p className="text-[13px] text-[#5879A6] leading-relaxed mb-4">
              Are you sure you want to permanently delete appointment{' '}
              <strong className="text-[#102A52] font-mono">{confirmDeleteApt.id}</strong> for{' '}
              <strong className="text-[#102A52]">{confirmDeleteApt.patientName}</strong>? This action cannot be reversed.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setConfirmDeleteApt(null)}
                className="px-4 py-2 rounded-[8px] border border-[#CBD5E1] text-[#475569] text-[13px] font-semibold hover:bg-[#F8FAFC] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDelete(confirmDeleteApt)}
                className="px-4 py-2 rounded-[8px] bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[13px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Permanently Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
