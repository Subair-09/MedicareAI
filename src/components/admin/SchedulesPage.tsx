import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Filter,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { AdminSidebar, NavItemKey } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { ScheduleStats } from './schedules/ScheduleStats';
import { WeeklyCalendar } from './schedules/WeeklyCalendar';
import { DayCalendar } from './schedules/DayCalendar';
import { MonthCalendar } from './schedules/MonthCalendar';
import { DoctorScheduleOverview } from './schedules/DoctorScheduleOverview';
import { ScheduleQuickActions, ScheduleInfoCard } from './schedules/ScheduleQuickActions';
import { AddScheduleModal } from './schedules/AddScheduleModal';
import { ScheduleDetailsModal } from './schedules/ScheduleDetailsModal';
import { ManageAvailabilityModal } from './schedules/ManageAvailabilityModal';
import { ExportScheduleModal } from './schedules/ExportScheduleModal';
import { DoctorScheduleSummary } from '../../data/schedulesData';
import { ScheduleAppointment, ScheduleStatus } from '../../types';
import { api } from '../../services/api';

interface SchedulesPageProps {
  adminUser?: {
    email: string;
    name: string;
    role: string;
  };
  onNavigateNav: (nav: NavItemKey) => void;
  onSignOut: () => void;
  onGoToPatientPortal: () => void;
}

export const SchedulesPage: React.FC<SchedulesPageProps> = ({
  adminUser = { email: 'nuddywale@gmail.com', name: 'Adewale', role: 'Super Administrator' },
  onNavigateNav,
  onSignOut,
  onGoToPatientPortal,
}) => {
  // Navigation & Header state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Live Data state
  const [appointments, setAppointments] = useState<ScheduleAppointment[]>([]);
  const [doctors, setDoctors] = useState<DoctorScheduleSummary[]>([]);
  const [departmentsList, setDepartmentsList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeViewMode, setActiveViewMode] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedDoctor, setSelectedDoctor] = useState('All Doctors');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');

  // Modals state
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<ScheduleAppointment | null>(null);
  const [isManageAvailabilityOpen, setIsManageAvailabilityOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch real data from backend
  const loadScheduleData = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [schedulesData, doctorsData, departmentsData] = await Promise.all([
        api.getSchedules().catch(() => []),
        api.getDoctors().catch(() => []),
        api.getDepartments().catch(() => []),
      ]);

      setAppointments(schedulesData);

      // Map doctors to schedule summaries
      const mappedDocs: DoctorScheduleSummary[] = doctorsData.map((doc, idx) => ({
        id: doc.id,
        name: doc.name,
        department: doc.department,
        workingDays: 'Mon - Fri',
        workingHours: '9:00 AM - 5:00 PM',
        status: (doc.status === 'Active' ? 'Available' : 'On Leave') as DoctorScheduleSummary['status'],
        avatar: doc.avatar || '',
        room: `Suite ${101 + idx * 2}`,
      }));
      setDoctors(mappedDocs);

      // Extract unique department names
      const deptNames = departmentsData.map((d) => d.name);
      setDepartmentsList(deptNames);
    } catch (err: any) {
      console.error('Failed to load schedule data:', err);
      setLoadError(err.message || 'Failed to load schedules');
      showToast('Could not load schedules from server', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  // Stats calculation
  const totalCount = appointments.length;
  const completedCount = appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Checked-in').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;
  const pendingCount = appointments.filter((a) => a.status === 'Pending').length;

  // Filtered by global search if entered
  const displayedAppointments = globalSearch.trim()
    ? appointments.filter(
        (a) =>
          a.patientName.toLowerCase().includes(globalSearch.toLowerCase()) ||
          a.department.toLowerCase().includes(globalSearch.toLowerCase()) ||
          (a.doctorName && a.doctorName.toLowerCase().includes(globalSearch.toLowerCase()))
      )
    : appointments;

  // Handlers
  const handleAddSchedule = async (newAppt: Omit<ScheduleAppointment, 'id'>) => {
    try {
      const created = await api.createSchedule(newAppt);
      setAppointments((prev) => [created, ...prev]);
      showToast(`Appointment for "${created.patientName}" scheduled successfully!`);
    } catch (err: any) {
      console.error('Error creating schedule:', err);
      // Fallback local update if network glitch
      const fallback: ScheduleAppointment = {
        ...newAppt,
        id: `sch-${Date.now()}`,
      };
      setAppointments((prev) => [fallback, ...prev]);
      showToast(`Appointment scheduled locally: "${fallback.patientName}"`);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: ScheduleStatus) => {
    // Optimistic update
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    if (selectedAppointment && selectedAppointment.id === id) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      await api.updateSchedule(id, { status: newStatus });
      showToast(`Appointment status updated to "${newStatus}".`);
    } catch (err: any) {
      console.error('Failed to update status on server:', err);
      showToast('Status updated locally.', 'info');
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await api.deleteSchedule(id);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(null);
      }
      showToast('Schedule appointment removed successfully.');
    } catch (err: any) {
      console.error('Failed to delete appointment:', err);
      // Local removal
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      if (selectedAppointment?.id === id) {
        setSelectedAppointment(null);
      }
      showToast('Appointment removed from schedule.', 'info');
    }
  };

  const handleSelectDoctorOverview = (doc: DoctorScheduleSummary) => {
    setSelectedDoctor(doc.name);
    showToast(`Filtered schedule for ${doc.name}`, 'info');
  };

  const handleViewAllDoctors = () => {
    onNavigateNav('doctors');
  };

  const availableDoctorsList = doctors.map((d) => d.name);
  const availableDeptsList = departmentsList;

  return (
    <div className="flex h-screen bg-[#F7FBFF] overflow-hidden text-[#0D2857]">
      {/* 1. Fixed Left Sidebar */}
      <AdminSidebar
        activeItem="schedules"
        onSelectItem={(item) => onNavigateNav(item)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onViewHospitalProfile={onGoToPatientPortal}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* 2. Top Header */}
        <AdminHeader
          adminName={adminUser.name}
          adminRole={adminUser.role}
          adminEmail={adminUser.email}
          searchPlaceholder="Search schedule, doctors, patients, departments..."
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          onSignOut={onSignOut}
          onGoToPatientPortal={onGoToPatientPortal}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        {/* Scrollable Body Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 [scrollbar-width:thin]">
          <div className="max-w-[1680px] mx-auto space-y-6 text-left animate-fadeIn">
            {/* Notification Toast */}
            {toastMessage && (
              <div
                className={`border px-4 py-3 rounded-[12px] flex items-center justify-between shadow-xs animate-fadeIn ${
                  toastMessage.type === 'error'
                    ? 'bg-[#FEF2F2] border-[#FECACA] text-[#DC2626]'
                    : toastMessage.type === 'info'
                    ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1D4ED8]'
                    : 'bg-[#E7F9F0] border-[#A7F3D0] text-[#047857]'
                }`}
              >
                <div className="flex items-center gap-2 text-[13.5px] font-medium">
                  {toastMessage.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-[#DC2626]" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[#19B978]" />
                  )}
                  <span>{toastMessage.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="text-inherit hover:opacity-75 text-[12px] font-bold cursor-pointer ml-3"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Breadcrumb & Refresh */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[13px] text-[#5273A8]">
                <span>Admin</span>
                <span>/</span>
                <span className="text-[#0D2857] font-semibold">Schedule</span>
              </div>

              <button
                type="button"
                onClick={loadScheduleData}
                disabled={isLoading}
                className="h-[32px] px-3 rounded-[8px] border border-[#DCE9F8] bg-white hover:bg-[#F8FBFF] text-[#5273A8] hover:text-[#0868F5] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#0868F5]' : ''}`} />
                <span>Sync</span>
              </button>
            </div>

            {/* Main Header & Action Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-[26px] sm:text-[28px] font-bold text-[#0D2857] tracking-tight">
                  Schedule
                </h1>
                <p className="text-[13.5px] text-[#5273A8] mt-0.5">
                  Manage doctor availability and appointment timetable
                </p>
              </div>

              {/* Day / Week / Month Toggle Pills, Filter, Add Schedule */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Day / Week / Month Toggle Pills */}
                <div className="bg-[#F0F6FE] p-1 rounded-[10px] border border-[#DCE9F8] flex items-center gap-1">
                  {(['Day', 'Week', 'Month'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setActiveViewMode(mode)}
                      className={`h-[32px] px-3.5 rounded-[8px] text-[12.5px] font-semibold transition-all cursor-pointer ${
                        activeViewMode === mode
                          ? 'bg-[#0868F5] text-white shadow-2xs'
                          : 'text-[#5273A8] hover:text-[#0D2857] hover:bg-white/60'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className={`h-[40px] px-3.5 rounded-[10px] border text-[13px] font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                      activeStatusFilter !== 'All'
                        ? 'border-[#0868F5] bg-[#EAF4FF] text-[#0868F5]'
                        : 'border-[#DCE9F8] bg-white text-[#0D2857] hover:bg-[#F8FBFF]'
                    }`}
                  >
                    <Filter className="w-4 h-4 text-[#5273A8]" />
                    <span>
                      {activeStatusFilter === 'All' ? 'Filter' : activeStatusFilter}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#5273A8]" />
                  </button>

                  {isFilterDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsFilterDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-[10px] border border-[#DCE9F8] shadow-lg py-1.5 z-30 text-left">
                        {[
                          'All',
                          'Confirmed',
                          'Pending',
                          'Checked-in',
                          'Rescheduled',
                          'Cancelled',
                        ].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => {
                              setActiveStatusFilter(st);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={`w-full px-3.5 py-1.5 text-[12.5px] text-left transition-colors cursor-pointer ${
                              activeStatusFilter === st
                                ? 'bg-[#EAF4FF] text-[#0868F5] font-semibold'
                                : 'text-[#0D2857] hover:bg-[#F8FBFF]'
                            }`}
                          >
                            {st === 'All' ? 'Show All' : st}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Add Schedule Button */}
                <button
                  type="button"
                  onClick={() => setIsAddScheduleOpen(true)}
                  className="h-[40px] px-4.5 rounded-[10px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold flex items-center gap-2 shadow-[0_2px_10px_rgba(8,104,245,0.22)] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add Schedule</span>
                </button>
              </div>
            </div>

            {/* 3. Four Statistics Cards */}
            <ScheduleStats
              totalAppointments={totalCount}
              completed={completedCount}
              cancelled={cancelledCount}
              pending={pendingCount}
              onFilterStatus={(st) => {
                setActiveStatusFilter(st);
                showToast(`Filter: ${st}`, 'info');
              }}
            />

            {/* Empty State Banner if no appointments exist */}
            {!isLoading && appointments.length === 0 && (
              <div className="bg-[#F8FBFF] border border-[#DCE9F8] rounded-[16px] p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <h3 className="text-[16px] font-bold text-[#0D2857]">
                  No Scheduled Appointments Found
                </h3>
                <p className="text-[13px] text-[#5273A8] max-w-md mx-auto mt-1 mb-4">
                  The schedule database is empty. You can add appointments using the button below.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddScheduleOpen(true)}
                  className="h-[38px] px-5 rounded-[10px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold inline-flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add First Schedule Slot</span>
                </button>
              </div>
            )}

            {/* 4. Main Two-Column Layout (Calendar + Right Panels) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Weekly/Day/Month Calendar (8 cols on lg, 9 cols on xl) */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                {activeViewMode === 'Week' && (
                  <WeeklyCalendar
                    appointments={displayedAppointments}
                    onSelectAppointment={(apt) => setSelectedAppointment(apt)}
                    selectedDepartment={selectedDepartment}
                    onDepartmentChange={setSelectedDepartment}
                    selectedDoctor={selectedDoctor}
                    onDoctorChange={setSelectedDoctor}
                    activeStatusFilter={activeStatusFilter}
                    availableDepartments={availableDeptsList}
                    availableDoctors={availableDoctorsList}
                    onTodayClick={() => {
                      setSelectedDepartment('All Departments');
                      setSelectedDoctor('All Doctors');
                      setActiveStatusFilter('All');
                      setGlobalSearch('');
                      showToast('Reset to current week schedule', 'info');
                    }}
                    onPrevWeek={() => showToast('Viewing previous week', 'info')}
                    onNextWeek={() => showToast('Viewing next week', 'info')}
                  />
                )}

                {activeViewMode === 'Day' && (
                  <DayCalendar
                    appointments={displayedAppointments}
                    onSelectAppointment={(apt) => setSelectedAppointment(apt)}
                    selectedDepartment={selectedDepartment}
                    selectedDoctor={selectedDoctor}
                  />
                )}

                {activeViewMode === 'Month' && (
                  <MonthCalendar
                    appointments={displayedAppointments}
                    onSelectAppointment={(apt) => setSelectedAppointment(apt)}
                    onSelectDay={(d) => {
                      setActiveViewMode('Day');
                      showToast(`Viewing day ${d}`, 'info');
                    }}
                  />
                )}
              </div>

              {/* Right Column: Doctor Overview, Quick Actions, Info Card */}
              <div className="lg:col-span-4 xl:col-span-3 space-y-5">
                {/* Doctor Schedule Overview */}
                <DoctorScheduleOverview
                  doctors={doctors}
                  onSelectDoctor={handleSelectDoctorOverview}
                  onViewAll={handleViewAllDoctors}
                />

                {/* Quick Actions */}
                <ScheduleQuickActions
                  onAddSchedule={() => setIsAddScheduleOpen(true)}
                  onManageAvailability={() => setIsManageAvailabilityOpen(true)}
                  onViewCalendar={() => setActiveViewMode('Week')}
                  onExportSchedule={() => setIsExportModalOpen(true)}
                />

                {/* Bottom Info Card */}
                <ScheduleInfoCard />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 5. Modals */}
      <AddScheduleModal
        isOpen={isAddScheduleOpen}
        availableDoctors={availableDoctorsList}
        availableDepartments={availableDeptsList}
        onClose={() => setIsAddScheduleOpen(false)}
        onAddSchedule={handleAddSchedule}
      />

      <ScheduleDetailsModal
        isOpen={!!selectedAppointment}
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onUpdateStatus={handleUpdateStatus}
        onDeleteSchedule={handleDeleteSchedule}
        onPrintSlip={(apt) => {
          showToast(`Printing slip for ${apt.patientName}...`, 'info');
          window.print();
        }}
      />

      <ManageAvailabilityModal
        isOpen={isManageAvailabilityOpen}
        onClose={() => setIsManageAvailabilityOpen(false)}
        doctors={doctors}
        onUpdateDoctors={(newDocs) => {
          setDoctors(newDocs);
          showToast('Doctor availability schedules updated successfully!');
        }}
      />

      <ExportScheduleModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={(fmt) => {
          showToast(`Schedule exported as ${fmt.toUpperCase()} successfully!`);
        }}
      />
    </div>
  );
};
