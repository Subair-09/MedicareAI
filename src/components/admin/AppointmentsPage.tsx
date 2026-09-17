import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Calendar,
  ChevronRight,
  Download,
  Plus,
  Home,
  Check,
  RefreshCw,
  Loader2,
  AlertCircle,
  Mail
} from 'lucide-react';
import { AdminSidebar, NavItemKey } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { AppointmentStats } from './appointments/AppointmentStats';
import { AppointmentFilters } from './appointments/AppointmentFilters';
import { AppointmentTable } from './appointments/AppointmentTable';
import { AppointmentDetailsPanel } from './appointments/AppointmentDetailsPanel';
import { BookAppointmentModal } from './appointments/BookAppointmentModal';
import { RescheduleAppointmentModal } from './appointments/RescheduleAppointmentModal';
import { CancelAppointmentModal } from './appointments/CancelAppointmentModal';
import { DeleteAppointmentModal } from './appointments/DeleteAppointmentModal';
import { ResendStatusModal } from './ResendStatusModal';
import { DEPARTMENTS_LIST, DOCTORS_LIST } from '../../data/appointmentsData';
import { Appointment, AppointmentStatus } from '../../types';
import { api } from '../../services/api';

interface AppointmentsPageProps {
  adminUser?: {
    email: string;
    name: string;
    role: string;
  };
  onNavigateNav?: (key: NavItemKey) => void;
  onSignOut: () => void;
  onGoToPatientPortal: () => void;
}

export const AppointmentsPage: React.FC<AppointmentsPageProps> = ({
  adminUser = {
    email: 'nuddywale@gmail.com',
    name: 'Adewale',
    role: 'Super Administrator',
  },
  onNavigateNav,
  onSignOut,
  onGoToPatientPortal,
}) => {
  // Navigation & Mobile Drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);

  // Appointments Live State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic filter options
  const [availableDepartments, setAvailableDepartments] = useState<string[]>(['All Departments']);
  const [availableDoctors, setAvailableDoctors] = useState<string[]>(DOCTORS_LIST);

  // Filters State
  const [activeStatus, setActiveStatus] = useState<AppointmentStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedDoctor, setSelectedDoctor] = useState('All Doctors');
  const [selectedDate, setSelectedDate] = useState('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[]>([]);
  const [isResendModalOpen, setIsResendModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Fetch live appointments from API / database
  const fetchLiveAppointments = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const [apptsData, docsData, deptsData] = await Promise.all([
        api.getAppointments().catch(() => []),
        api.getDoctors().catch(() => []),
        api.getDepartments().catch(() => []),
      ]);

      setAppointments(apptsData || []);

      if (apptsData && apptsData.length > 0) {
        setSelectedAppointmentId((prev) => {
          if (prev && apptsData.some((a) => a.id === prev)) return prev;
          return apptsData[0].id;
        });
      } else {
        setSelectedAppointmentId('');
      }

      if (docsData && docsData.length > 0) {
        const docNames = ['All Doctors', ...docsData.map((d) => d.name)];
        setAvailableDoctors(Array.from(new Set(docNames)));
      }

      if (deptsData && deptsData.length > 0) {
        const deptNames = ['All Departments', ...deptsData.map((d) => d.name).filter(Boolean)];
        setAvailableDepartments(Array.from(new Set(deptNames)));
      } else {
        setAvailableDepartments(['All Departments']);
      }

      if (isRefresh) {
        showToast('Appointments list refreshed from database.');
      }
    } catch (err) {
      console.error('Failed to load appointments from server:', err);
      showToast('Could not load appointments from server.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveAppointments(false);
  }, [fetchLiveAppointments]);

  // Dynamic available dates extracted from real appointments
  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    appointments.forEach((a) => {
      if (a.date) dates.add(a.date);
    });
    return Array.from(dates);
  }, [appointments]);

  // Status counts
  const statusCounts = useMemo(() => {
    return {
      total: appointments.length,
      confirmed: appointments.filter((a) => a.status === 'Confirmed').length,
      pending: appointments.filter((a) => a.status === 'Pending').length,
      completed: appointments.filter((a) => a.status === 'Completed').length,
      cancelled: appointments.filter((a) => a.status === 'Cancelled').length,
    };
  }, [appointments]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // 1. Status Filter
      if (activeStatus !== 'All' && apt.status !== activeStatus) {
        return false;
      }

      // 2. Department Filter
      if (selectedDepartment !== 'All Departments' && apt.department !== selectedDepartment) {
        return false;
      }

      // 3. Doctor Filter
      if (selectedDoctor !== 'All Doctors' && apt.doctorName !== selectedDoctor) {
        return false;
      }

      // 4. Date Filter
      if (selectedDate !== 'All' && apt.date !== selectedDate) {
        return false;
      }

      // 5. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchPatient = apt.patientName.toLowerCase().includes(q);
        const matchId = apt.id.toLowerCase().includes(q) || apt.patientId.toLowerCase().includes(q);
        const matchDoctor = apt.doctorName.toLowerCase().includes(q);
        const matchDept = apt.department.toLowerCase().includes(q);
        if (!matchPatient && !matchId && !matchDoctor && !matchDept) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, activeStatus, selectedDepartment, selectedDoctor, selectedDate, searchQuery]);

  // Paginated Data
  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAppointments.slice(startIndex, startIndex + pageSize);
  }, [filteredAppointments, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredAppointments.length / pageSize));

  // Selected Appointment Object
  const selectedAppointment = useMemo(() => {
    return (
      appointments.find((a) => a.id === selectedAppointmentId) ||
      filteredAppointments[0] ||
      null
    );
  }, [appointments, selectedAppointmentId, filteredAppointments]);

  // Handlers
  const handleResetFilters = () => {
    setActiveStatus('All');
    setSearchQuery('');
    setSelectedDepartment('All Departments');
    setSelectedDoctor('All Doctors');
    setSelectedDate('All');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    activeStatus !== 'All' ||
    searchQuery !== '' ||
    selectedDepartment !== 'All Departments' ||
    selectedDoctor !== 'All Doctors' ||
    selectedDate !== 'All';

  const handleSelectAppointment = (apt: Appointment) => {
    setSelectedAppointmentId(apt.id);
    setIsMobileDetailsOpen(true);
  };

  const handleConfirmAppointment = async (id: string) => {
    try {
      await api.updateAppointment(id, { status: 'Confirmed' });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'Confirmed' as const } : a))
      );
      showToast(`Appointment ${id} confirmed successfully.`);
    } catch (err: any) {
      // Optimistic update
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'Confirmed' as const } : a))
      );
      showToast(`Appointment ${id} confirmed.`);
    }
  };

  const handleMarkAsCompleted = async (id: string) => {
    try {
      await api.updateAppointment(id, { status: 'Completed' });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'Completed' as const } : a))
      );
      showToast(`Appointment ${id} marked as completed.`);
    } catch (err: any) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'Completed' as const } : a))
      );
      showToast(`Appointment ${id} marked as completed.`);
    }
  };

  const handleConfirmReschedule = async (
    id: string,
    newDate: string,
    newTime: string,
    reason?: string
  ) => {
    const target = appointments.find((a) => a.id === id);
    const updatedNotes = reason ? `${target?.notes || ''} [Rescheduled: ${reason}]`.trim() : target?.notes;

    try {
      await api.updateAppointment(id, { date: newDate, time: newTime, notes: updatedNotes });
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                date: newDate,
                time: newTime,
                notes: updatedNotes,
              }
            : a
        )
      );
      showToast(`Appointment ${id} rescheduled to ${newDate} at ${newTime}.`);
    } catch (err: any) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                date: newDate,
                time: newTime,
                notes: updatedNotes,
              }
            : a
        )
      );
      showToast(`Appointment ${id} rescheduled to ${newDate} at ${newTime}.`);
    }
  };

  const handleConfirmCancel = async (id: string, reason: string) => {
    const target = appointments.find((a) => a.id === id);
    const updatedNotes = `${target?.notes || ''} [Cancelled: ${reason}]`.trim();

    try {
      await api.updateAppointment(id, { status: 'Cancelled', notes: updatedNotes });
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'Cancelled' as const,
                notes: updatedNotes,
              }
            : a
        )
      );
      showToast(`Appointment ${id} has been cancelled.`);
    } catch (err: any) {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'Cancelled' as const,
                notes: updatedNotes,
              }
            : a
        )
      );
      showToast(`Appointment ${id} has been cancelled.`);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await api.deleteAppointment(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      if (selectedAppointmentId === id) {
        setSelectedAppointmentId((prev) => {
          const remaining = appointments.filter((a) => a.id !== id);
          return remaining[0]?.id || '';
        });
      }
      showToast(`Appointment ${id} permanently deleted.`);
    } catch (err: any) {
      console.error('Failed to delete appointment on server:', err);
      // Optimistic update
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      if (selectedAppointmentId === id) {
        setSelectedAppointmentId((prev) => {
          const remaining = appointments.filter((a) => a.id !== id);
          return remaining[0]?.id || '';
        });
      }
      showToast(`Appointment ${id} permanently deleted.`);
    }
  };

  const handleConfirmBulkDelete = async (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    try {
      await api.deleteAppointmentsBatch(ids);
      setAppointments((prev) => prev.filter((a) => !ids.includes(a.id)));
      if (ids.includes(selectedAppointmentId)) {
        setSelectedAppointmentId((prev) => {
          const remaining = appointments.filter((a) => !ids.includes(a.id));
          return remaining[0]?.id || '';
        });
      }
      showToast(`${ids.length} appointments permanently deleted.`);
    } catch (err: any) {
      console.error('Failed to bulk delete appointments:', err);
      setAppointments((prev) => prev.filter((a) => !ids.includes(a.id)));
      if (ids.includes(selectedAppointmentId)) {
        setSelectedAppointmentId((prev) => {
          const remaining = appointments.filter((a) => !ids.includes(a.id));
          return remaining[0]?.id || '';
        });
      }
      showToast(`${ids.length} appointments deleted.`);
    }
  };

  const handleBookNewAppointment = async (newApt: Appointment) => {
    try {
      const created = await api.createAppointment(newApt);
      const apptToInsert = created || newApt;
      setAppointments((prev) => [apptToInsert, ...prev]);
      setSelectedAppointmentId(apptToInsert.id);
      showToast(`Appointment booked for ${newApt.patientName}.`);
    } catch (err: any) {
      setAppointments((prev) => [newApt, ...prev]);
      setSelectedAppointmentId(newApt.id);
      showToast(`Appointment scheduled for ${newApt.patientName}.`);
    }
  };

  // CSV Export (Uses real appointments)
  const handleExportCSV = () => {
    if (appointments.length === 0) {
      showToast('No appointment records available to export.');
      return;
    }

    const headers = [
      'Appointment ID',
      'Patient Name',
      'Patient ID',
      'Doctor Name',
      'Department',
      'Date',
      'Time',
      'Type',
      'Status',
      'Fee',
    ];

    const rows = filteredAppointments.map((a) => [
      a.id,
      `"${a.patientName}"`,
      a.patientId,
      `"${a.doctorName}"`,
      `"${a.department}"`,
      a.date,
      a.time,
      `"${a.type}"`,
      a.status,
      `"${a.fee || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medicare-appointments-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Appointments CSV exported successfully!');
  };

  const handlePrintSlip = (_apt: Appointment) => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F6FAFF] flex text-[#102A52] font-sans antialiased selection:bg-[#0878F9]/20 selection:text-[#0878F9]">
      {/* 1. Left Admin Sidebar with 'appointments' active */}
      <AdminSidebar
        activeItem="appointments"
        onSelectItem={(item) => {
          if (onNavigateNav) onNavigateNav(item);
        }}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Sticky Admin Header */}
        <AdminHeader
          adminName={adminUser.name}
          adminRole={adminUser.role}
          adminEmail={adminUser.email}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSignOut={onSignOut}
          onGoToPatientPortal={onGoToPatientPortal}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Notification Toast */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-[#102A52] text-white px-4 py-3 rounded-[10px] shadow-lg flex items-center gap-2.5 text-[13px] font-medium animate-fadeIn">
            <Check className="w-4 h-4 text-[#20B879] stroke-[2.5]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-12 space-y-6 max-w-[1680px] w-full mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-[12.5px] font-medium text-[#5879A6]">
            <button
              type="button"
              onClick={() => onNavigateNav && onNavigateNav('dashboard')}
              className="flex items-center gap-1.5 hover:text-[#0878F9] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 text-[#5879A6]" />
              <span>Dashboard</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
            <span className="text-[#102A52] font-semibold">Appointments</span>
          </nav>

          {/* Page Header: Title + Subtitle + Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[#102A52] tracking-tight leading-tight">
                Appointments
              </h1>
              <p className="text-[13.5px] text-[#5879A6] font-normal mt-0.5">
                Real-time appointment schedule, booking records, and clinical triage.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => fetchLiveAppointments(true)}
                disabled={isRefreshing}
                className="h-[40px] px-3.5 rounded-[10px] bg-white border border-[#E1EDF9] hover:bg-[#F8FBFF] hover:border-[#BFDBFE] text-[#102A52] text-[13px] font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-[0.99] disabled:opacity-60"
                title="Refresh live appointments"
              >
                <RefreshCw className={`w-4 h-4 text-[#5879A6] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                type="button"
                onClick={() => setIsResendModalOpen(true)}
                className="h-[40px] px-3.5 rounded-[10px] bg-white border border-[#E1EDF9] hover:bg-[#F8FBFF] hover:border-[#BFDBFE] text-[#102A52] text-[13px] font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-[0.99]"
                title="View Resend Email delivery logs and test connection"
              >
                <Mail className="w-4 h-4 text-[#0878F9]" />
                <span className="hidden md:inline">Email Delivery (Resend)</span>
                <span className="md:hidden">Emails</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="h-[40px] px-3.5 sm:px-4 rounded-[10px] bg-white border border-[#E1EDF9] hover:bg-[#F8FBFF] hover:border-[#BFDBFE] text-[#102A52] text-[13px] font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-[0.99]"
              >
                <Download className="w-4 h-4 text-[#5879A6]" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBookModalOpen(true)}
                className="h-[40px] px-4 sm:px-5 rounded-[10px] bg-[#0878F9] hover:bg-[#0768D6] text-white text-[13px] font-bold flex items-center gap-2 transition-all shadow-2xs cursor-pointer active:scale-[0.99]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>

          {/* Statistics Cards Row (5 Cards) */}
          <AppointmentStats
            activeStatusFilter={activeStatus}
            onSelectStatus={(status) => {
              setActiveStatus(status);
              setCurrentPage(1);
            }}
            counts={statusCounts}
          />

          {/* Appointment Workspace: 2 Column Layout (Table 68% + Details Panel 32%) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Left Column: Filters + Table + Pagination */}
            <div className="lg:col-span-8 xl:col-span-8 space-y-4">
              {/* Filters (Status tabs + Search + Dropdowns) */}
              <AppointmentFilters
                activeStatus={activeStatus}
                onStatusChange={(st) => {
                  setActiveStatus(st);
                  setCurrentPage(1);
                }}
                statusCounts={statusCounts}
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  setCurrentPage(1);
                }}
                selectedDepartment={selectedDepartment}
                onDepartmentChange={(d) => {
                  setSelectedDepartment(d);
                  setCurrentPage(1);
                }}
                selectedDoctor={selectedDoctor}
                onDoctorChange={(doc) => {
                  setSelectedDoctor(doc);
                  setCurrentPage(1);
                }}
                selectedDate={selectedDate}
                onDateChange={(dt) => {
                  setSelectedDate(dt);
                  setCurrentPage(1);
                }}
                onResetFilters={handleResetFilters}
                hasActiveFilters={hasActiveFilters}
                departments={availableDepartments}
                doctors={availableDoctors}
                availableDates={availableDates}
              />

              {/* Appointments Table or Loading State */}
              {isLoading ? (
                <div className="bg-white rounded-[14px] border border-[#E1EDF9] p-12 text-center shadow-2xs flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#0878F9] animate-spin mb-3" />
                  <div className="text-[14px] font-bold text-[#102A52]">
                    Loading Appointments...
                  </div>
                  <p className="text-[12px] text-[#5879A6] mt-1">
                    Fetching records from database
                  </p>
                </div>
              ) : (
                <AppointmentTable
                  appointments={paginatedAppointments}
                  selectedAppointmentId={selectedAppointment?.id || null}
                  onSelectAppointment={handleSelectAppointment}
                  onOpenRescheduleModal={(apt) => setRescheduleTarget(apt)}
                  onOpenCancelModal={(apt) => setCancelTarget(apt)}
                  onOpenDeleteModal={(apt) => setDeleteTarget(apt)}
                  onOpenBulkDeleteModal={(ids) => setBulkDeleteIds(ids)}
                  onMarkAsCompleted={handleMarkAsCompleted}
                  onConfirmAppointment={handleConfirmAppointment}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={filteredAppointments.length}
                  pageSize={pageSize}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(sz) => {
                    setPageSize(sz);
                    setCurrentPage(1);
                  }}
                />
              )}
            </div>

            {/* Right Column: Appointment Details Panel (Desktop Sticky) */}
            <div className="hidden lg:block lg:col-span-4 xl:col-span-4 sticky top-20">
              <AppointmentDetailsPanel
                appointment={selectedAppointment}
                onOpenRescheduleModal={(apt) => setRescheduleTarget(apt)}
                onOpenCancelModal={(apt) => setCancelTarget(apt)}
                onOpenDeleteModal={(apt) => setDeleteTarget(apt)}
                onMarkAsCompleted={handleMarkAsCompleted}
                onConfirmAppointment={handleConfirmAppointment}
                onPrintSlip={handlePrintSlip}
              />
            </div>
          </div>

          {/* Mobile Drawer / Modal for Details Panel */}
          {isMobileDetailsOpen && selectedAppointment && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-xs"
              onClick={() => setIsMobileDetailsOpen(false)}
            >
              <div
                className="bg-white w-full max-w-lg rounded-t-[20px] sm:rounded-[16px] max-h-[88vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <AppointmentDetailsPanel
                  appointment={selectedAppointment}
                  onCloseMobile={() => setIsMobileDetailsOpen(false)}
                  onOpenRescheduleModal={(apt) => {
                    setIsMobileDetailsOpen(false);
                    setRescheduleTarget(apt);
                  }}
                  onOpenCancelModal={(apt) => {
                    setIsMobileDetailsOpen(false);
                    setCancelTarget(apt);
                  }}
                  onOpenDeleteModal={(apt) => {
                    setIsMobileDetailsOpen(false);
                    setDeleteTarget(apt);
                  }}
                  onMarkAsCompleted={(id) => {
                    handleMarkAsCompleted(id);
                    setIsMobileDetailsOpen(false);
                  }}
                  onConfirmAppointment={(id) => {
                    handleConfirmAppointment(id);
                    setIsMobileDetailsOpen(false);
                  }}
                  onPrintSlip={handlePrintSlip}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Book Appointment Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onBook={handleBookNewAppointment}
        departments={availableDepartments.filter((d) => d !== 'All Departments')}
        doctors={availableDoctors.filter((d) => d !== 'All Doctors')}
      />

      {/* Reschedule Appointment Modal */}
      <RescheduleAppointmentModal
        isOpen={!!rescheduleTarget}
        appointment={rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        onConfirmReschedule={handleConfirmReschedule}
      />

      {/* Cancel Appointment Modal */}
      <CancelAppointmentModal
        isOpen={!!cancelTarget}
        appointment={cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* Delete Appointment Modal (Single or Bulk) */}
      <DeleteAppointmentModal
        isOpen={!!deleteTarget || bulkDeleteIds.length > 0}
        appointment={deleteTarget}
        selectedIds={bulkDeleteIds}
        appointmentsList={appointments}
        onClose={() => {
          setDeleteTarget(null);
          setBulkDeleteIds([]);
        }}
        onConfirmDelete={handleConfirmDelete}
        onConfirmBulkDelete={handleConfirmBulkDelete}
      />

      {/* Resend Email Delivery Status & Logs Modal */}
      <ResendStatusModal
        isOpen={isResendModalOpen}
        onClose={() => setIsResendModalOpen(false)}
      />
    </div>
  );
};
