import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Users, Plus, ChevronRight, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { AdminSidebar, NavItemKey } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { PatientStats } from './patients/PatientStats';
import { PatientTable } from './patients/PatientTable';
import { PatientQuickActions } from './patients/PatientQuickActions';
import { PatientStatsChart } from './patients/PatientStatsChart';
import { RecentPatientsWidget } from './patients/RecentPatientsWidget';
import { AddPatientModal } from './patients/AddPatientModal';
import { PatientDetailsModal } from './patients/PatientDetailsModal';
import { DeletePatientModal } from './patients/DeletePatientModal';
import { PrintReportModal } from './patients/PrintReportModal';
import { AdminPatient, AdminDepartment } from '../../types';
import { api } from '../../services/api';

interface PatientsPageProps {
  adminUser?: {
    email: string;
    name: string;
    role: string;
  };
  onNavigateNav: (nav: NavItemKey) => void;
  onSignOut: () => void;
  onGoToPatientPortal: () => void;
}

export const PatientsPage: React.FC<PatientsPageProps> = ({
  adminUser = { email: 'nuddywale@gmail.com', name: 'Adewale', role: 'Super Administrator' },
  onNavigateNav,
  onSignOut,
  onGoToPatientPortal,
}) => {
  const [patients, setPatients] = useState<AdminPatient[]>([]);
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPatientForDetails, setSelectedPatientForDetails] = useState<AdminPatient | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPatientForPrint, setSelectedPatientForPrint] = useState<AdminPatient | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedPatientForDelete, setSelectedPatientForDelete] = useState<AdminPatient | null>(null);
  const [selectedIdsForDelete, setSelectedIdsForDelete] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch real patient and department data from API
  const loadPatientsData = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setIsLoading(true);
      else setIsRefreshing(true);
      setFetchError(null);

      const [patsData, deptsData] = await Promise.all([
        api.getPatients().catch((err) => {
          console.error('Failed to get patients:', err);
          return [];
        }),
        api.getDepartments().catch((err) => {
          console.error('Failed to get departments:', err);
          return [];
        }),
      ]);

      setPatients(patsData || []);
      setDepartments(deptsData || []);
    } catch (err: any) {
      console.error('Error fetching patients data:', err);
      setFetchError(err.message || 'Failed to load patient records');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPatientsData();
  }, [loadPatientsData]);

  // Derived statistics computed from real patients
  const { totalCount, activeCount, inactiveCount, newCount } = useMemo(() => {
    const total = patients.length;
    const active = patients.filter((p) => p.status === 'Active').length;
    const inactive = patients.filter((p) => p.status === 'Inactive').length;

    // A patient is considered "new" if registered in the last 30 days or pending
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newlyRegistered = patients.filter((p) => {
      if (p.status === 'Pending') return true;
      if (!p.registrationDate) return false;
      const regDate = new Date(p.registrationDate);
      return !isNaN(regDate.getTime()) && regDate >= thirtyDaysAgo;
    }).length;

    return {
      totalCount: total,
      activeCount: active,
      inactiveCount: inactive,
      newCount: newlyRegistered,
    };
  }, [patients]);

  // Handler: Add Patient to Live DB
  const handleSavePatient = async (newPatientData: Omit<AdminPatient, 'id' | 'patientId'>) => {
    try {
      const created = await api.createPatient(newPatientData);
      setPatients((prev) => [created, ...prev]);
      showToast(`Patient "${created.name}" (${created.patientId}) successfully registered!`);
    } catch (err: any) {
      console.error('Error creating patient:', err);
      showToast(err.message || 'Failed to register patient', 'error');
    }
  };

  // Handler: Update Patient in Live DB
  const handleUpdatePatient = async (updatedPatient: AdminPatient) => {
    try {
      const updated = await api.updatePatient(updatedPatient.id, updatedPatient);
      setPatients((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setSelectedPatientForDetails(updated);
      showToast(`Patient "${updated.name}" record updated.`);
    } catch (err: any) {
      console.error('Error updating patient:', err);
      showToast(err.message || 'Failed to update patient record', 'error');
    }
  };

  // Handler: Toggle Status
  const handleToggleStatus = async (patientId: string) => {
    const p = patients.find((item) => item.id === patientId);
    if (!p) return;
    const newStatus = p.status === 'Active' ? 'Inactive' : 'Active';

    try {
      const updated = await api.updatePatient(patientId, { status: newStatus });
      setPatients((prev) =>
        prev.map((item) => (item.id === patientId ? updated : item))
      );
      showToast(`Patient "${p.name}" status changed to ${newStatus}.`, 'info');
    } catch (err: any) {
      console.error('Error toggling patient status:', err);
      showToast(err.message || 'Failed to toggle patient status', 'error');
    }
  };

  // Handlers: Delete Patient & Modals
  const handleOpenDeleteModal = (patient: AdminPatient) => {
    setSelectedPatientForDelete(patient);
    setSelectedIdsForDelete([]);
    setIsDeleteModalOpen(true);
  };

  const handleOpenBulkDeleteModal = (ids: string[]) => {
    setSelectedPatientForDelete(null);
    setSelectedIdsForDelete(ids);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (patientId: string) => {
    try {
      await api.deletePatient(patientId);
      setPatients((prev) => prev.filter((item) => item.id !== patientId));
      if (selectedPatientForDetails?.id === patientId) {
        setIsDetailsModalOpen(false);
        setSelectedPatientForDetails(null);
      }
      showToast('Patient record deleted successfully.');
    } catch (err: any) {
      console.error('Error deleting patient:', err);
      showToast(err.message || 'Failed to delete patient record', 'error');
    }
  };

  const handleConfirmBulkDelete = async (ids: string[]) => {
    try {
      await api.deletePatientsBatch(ids);
      setPatients((prev) => prev.filter((item) => !ids.includes(item.id)));
      if (selectedPatientForDetails && ids.includes(selectedPatientForDetails.id)) {
        setIsDetailsModalOpen(false);
        setSelectedPatientForDetails(null);
      }
      showToast(`${ids.length} patient record(s) deleted successfully.`);
    } catch (err: any) {
      console.error('Error batch deleting patients:', err);
      showToast(err.message || 'Failed to delete selected patients', 'error');
    }
  };

  // Handler: Clear Filters
  const handleClearFilters = () => {
    setTableSearch('');
    setGlobalSearch('');
    setSelectedDepartment('All Departments');
    setSelectedStatus('All Statuses');
    showToast('Filters cleared.', 'info');
  };

  // Handlers for Quick Actions
  const handleFindPatient = () => {
    const searchInput = document.querySelector(
      'input[placeholder="Search by name, phone, email or patient ID..."]'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleOpenPrintModal = (patient?: AdminPatient) => {
    setSelectedPatientForPrint(patient || patients[0] || null);
    setIsPrintModalOpen(true);
  };

  const availableDepartmentNames = useMemo(() => {
    return departments.map((d) => d.name).filter(Boolean);
  }, [departments]);

  return (
    <div className="flex h-screen bg-[#F7FBFF] overflow-hidden text-[#0D2857]">
      {/* 1. Fixed Left Sidebar */}
      <AdminSidebar
        activeItem="patients"
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
          searchPlaceholder="Search patients, doctors, appointments..."
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
          onSignOut={onSignOut}
          onGoToPatientPortal={onGoToPatientPortal}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
        />

        {/* Scrollable Body Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 [scrollbar-width:thin]">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Notification Toast */}
            {toastMessage && (
              <div
                className={`border px-4 py-3 rounded-[12px] flex items-center justify-between shadow-xs animate-fadeIn ${
                  toastMessage.type === 'error'
                    ? 'bg-[#FEECEE] border-[#FECDD3] text-[#B91C1C]'
                    : toastMessage.type === 'info'
                    ? 'bg-[#EBF5FF] border-[#BFDBFE] text-[#1E40AF]'
                    : 'bg-[#E7F9F0] border-[#A7F3D0] text-[#047857]'
                }`}
              >
                <div className="flex items-center gap-2 text-[13.5px] font-medium">
                  {toastMessage.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[#19B978]" />
                  )}
                  <span>{toastMessage.text}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="hover:opacity-75 text-[12px] font-bold cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Error Banner */}
            {fetchError && (
              <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] px-4 py-3 rounded-[12px] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2 text-[13.5px]">
                  <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0" />
                  <span>{fetchError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => loadPatientsData()}
                  className="px-3 py-1 bg-white border border-[#F87171] text-[#DC2626] rounded-md text-[12px] font-semibold hover:bg-[#FEF2F2] cursor-pointer"
                >
                  Retry
                </button>
              </div>
            )}

            {/* 3. Page Breadcrumb */}
            <nav
              className="flex items-center gap-2 text-[13px] text-[#5273A8] font-medium select-none"
              aria-label="Breadcrumb"
            >
              <button
                type="button"
                onClick={() => onNavigateNav('dashboard')}
                className="hover:text-[#0868F5] transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span className="text-[#0868F5] font-semibold">Patients</span>
            </nav>

            {/* 4. Patient Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-[12px] bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center shrink-0 shadow-2xs">
                  <Users className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h1 className="text-[24px] sm:text-[26px] font-bold text-[#0D2857] leading-tight">
                    Patients
                  </h1>
                  <p className="text-[13px] text-[#5273A8] mt-0.5">
                    Live patient records, medical history, and clinical appointments.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={() => loadPatientsData(true)}
                  disabled={isRefreshing || isLoading}
                  title="Synchronize patient records with live database"
                  className="h-[42px] px-3.5 rounded-[10px] bg-white hover:bg-[#F0F6FD] border border-[#DCEBFA] text-[#5273A8] hover:text-[#0868F5] text-[13px] font-medium flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#0868F5]' : ''}`} />
                  <span className="hidden sm:inline">Sync</span>
                </button>

                {/* + Add Patient Blue Button */}
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="h-[42px] px-4 rounded-[10px] bg-[#0868F5] hover:bg-[#075edc] active:scale-[0.99] text-white text-[13.5px] font-semibold flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
                >
                  <Plus className="w-4.5 h-4.5 stroke-[2.5]" />
                  <span>Add Patient</span>
                </button>
              </div>
            </div>

            {/* 5. Four Statistics Cards - Live Dynamic Values */}
            <PatientStats
              totalPatients={totalCount}
              newPatients={newCount}
              activePatients={activeCount}
              inactivePatients={inactiveCount}
              onFilterStatus={(status) => {
                if (status === 'Active') setSelectedStatus('Active');
                else if (status === 'Inactive') setSelectedStatus('Inactive');
                else setSelectedStatus('All Statuses');
              }}
            />

            {/* 6. Main Content Split: Center Table + Right Column Widgets */}
            <div className="flex flex-col xl:flex-row items-start gap-6">
              {/* Center / Left: Patient Table Container */}
              <div className="flex-1 w-full min-w-0">
                {isLoading ? (
                  <div className="bg-white border border-[#DCEBFA] rounded-[16px] p-12 text-center shadow-2xs">
                    <div className="w-10 h-10 border-3 border-[#0868F5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-[14px] font-medium text-[#0D2857]">Loading patient database...</p>
                    <p className="text-[12px] text-[#8AA3C6] mt-1">Connecting to live patient registry</p>
                  </div>
                ) : (
                  <PatientTable
                    patients={patients}
                    availableDepartments={availableDepartmentNames}
                    onSelectPatient={(patient) => {
                      setSelectedPatientForDetails(patient);
                      setIsDetailsModalOpen(true);
                    }}
                    onEditPatient={(patient) => {
                      setSelectedPatientForDetails(patient);
                      setIsDetailsModalOpen(true);
                    }}
                    onViewHistory={(patient) => {
                      setSelectedPatientForDetails(patient);
                      setIsDetailsModalOpen(true);
                    }}
                    onViewAppointments={(patient) => {
                      setSelectedPatientForDetails(patient);
                      setIsDetailsModalOpen(true);
                    }}
                    onToggleStatus={handleToggleStatus}
                    onDeletePatient={handleConfirmDelete}
                    onOpenDeleteModal={handleOpenDeleteModal}
                    onOpenBulkDeleteModal={handleOpenBulkDeleteModal}
                    selectedDepartment={selectedDepartment}
                    onDepartmentChange={setSelectedDepartment}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    searchQuery={tableSearch || globalSearch}
                    onSearchChange={setTableSearch}
                    onClearFilters={handleClearFilters}
                  />
                )}
              </div>

              {/* Right Column: Quick Actions, Live Donut Chart, Recent Patients */}
              <div className="w-full xl:w-[330px] shrink-0 space-y-5">
                {/* Widget 1: Quick Actions */}
                <PatientQuickActions
                  onRegisterPatient={() => setIsAddModalOpen(true)}
                  onFindPatient={handleFindPatient}
                  onViewHistory={() => {
                    if (patients.length > 0) {
                      setSelectedPatientForDetails(patients[0]);
                      setIsDetailsModalOpen(true);
                    } else {
                      showToast('No patient records registered yet.', 'info');
                    }
                  }}
                  onPrintReport={() => {
                    if (patients.length > 0) {
                      handleOpenPrintModal();
                    } else {
                      showToast('No patient records available to print report.', 'info');
                    }
                  }}
                />

                {/* Widget 2: Patient Statistics Live Donut Chart */}
                <PatientStatsChart patients={patients} />

                {/* Widget 3: Recent Patients */}
                <RecentPatientsWidget
                  patients={patients}
                  onSelectPatient={(patient) => {
                    setSelectedPatientForDetails(patient);
                    setIsDetailsModalOpen(true);
                  }}
                  onViewAll={() => {
                    setTableSearch('');
                    setSelectedDepartment('All Departments');
                    setSelectedStatus('All Statuses');
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        availableDepartments={availableDepartmentNames}
        onClose={() => setIsAddModalOpen(false)}
        onSavePatient={handleSavePatient}
      />

      {/* Patient Details Modal */}
      <PatientDetailsModal
        patient={selectedPatientForDetails}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        onUpdatePatient={handleUpdatePatient}
        onDeletePatient={(patient) => {
          setIsDetailsModalOpen(false);
          handleOpenDeleteModal(patient);
        }}
        onPrintReport={(patient) => {
          setIsDetailsModalOpen(false);
          handleOpenPrintModal(patient);
        }}
      />

      {/* Delete Patient Confirmation Modal */}
      <DeletePatientModal
        isOpen={isDeleteModalOpen}
        patient={selectedPatientForDelete}
        selectedIds={selectedIdsForDelete}
        patientsList={patients}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPatientForDelete(null);
          setSelectedIdsForDelete([]);
        }}
        onConfirmDelete={handleConfirmDelete}
        onConfirmBulkDelete={handleConfirmBulkDelete}
      />

      {/* Print Patient Report Modal */}
      <PrintReportModal
        patient={selectedPatientForPrint}
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};
