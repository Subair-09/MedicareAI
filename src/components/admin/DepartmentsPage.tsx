import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LayoutGrid,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { AdminSidebar, NavItemKey } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { DepartmentStats } from './departments/DepartmentStats';
import { DepartmentTable } from './departments/DepartmentTable';
import { AddDepartmentPanel } from './departments/AddDepartmentPanel';
import { DepartmentViewModal } from './departments/DepartmentViewModal';
import { AdminDepartment, AdminDoctor } from '../../types';
import { api } from '../../services/api';

interface DepartmentsPageProps {
  adminUser?: {
    email: string;
    name: string;
    role: string;
  };
  onNavigateNav: (nav: NavItemKey) => void;
  onSignOut: () => void;
  onGoToPatientPortal: () => void;
}

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({
  adminUser = { email: 'nuddywale@gmail.com', name: 'Adewale', role: 'Super Administrator' },
  onNavigateNav,
  onSignOut,
  onGoToPatientPortal,
}) => {
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [totalAppointmentsCount, setTotalAppointmentsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All Departments');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Statuses');
  const [selectedDeptForModal, setSelectedDeptForModal] = useState<AdminDepartment | null>(null);
  const [modalInitialTab, setModalInitialTab] = useState<'overview' | 'edit' | 'doctors'>('overview');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<AdminDepartment | null>(null);
  const [isDeletingDept, setIsDeletingDept] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load departments, doctors, and appointments from live backend
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const [deptRes, docsRes, apptRes] = await Promise.all([
        api.getDepartments().catch((err) => {
          console.error('Error fetching departments:', err);
          return [] as AdminDepartment[];
        }),
        api.getDoctors().catch((err) => {
          console.error('Error fetching doctors:', err);
          return [] as AdminDoctor[];
        }),
        api.getAppointments().catch((err) => {
          console.error('Error fetching appointments:', err);
          return [];
        }),
      ]);

      setDepartments(deptRes);
      setDoctors(docsRes);
      setTotalAppointmentsCount(apptRes.length);
    } catch (err: any) {
      console.error('Failed to load department records:', err);
      showToast('Failed to load department records from server.', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler: Add new department from right panel
  const handleSaveNewDepartment = async (newDeptData: Omit<AdminDepartment, 'id' | 'slug' | 'createdAt'>) => {
    setIsSubmitting(true);
    try {
      const savedDept = await api.createDepartment(newDeptData);

      // If a registered doctor was selected as head doctor, associate them with this department
      if (
        savedDept.headDoctor?.id &&
        savedDept.headDoctor.id !== 'unassigned' &&
        !savedDept.headDoctor.id.startsWith('doc-custom')
      ) {
        try {
          await api.updateDoctor(savedDept.headDoctor.id, {
            department: savedDept.name,
            departmentId: savedDept.id,
          });
          setDoctors((prev) =>
            prev.map((d) =>
              d.id === savedDept.headDoctor?.id
                ? { ...d, department: savedDept.name, departmentId: savedDept.id }
                : d
            )
          );
        } catch (docErr) {
          console.error('Failed to associate doctor with new department:', docErr);
        }
      }

      setDepartments((prev) => [savedDept, ...prev]);
      showToast(`Department "${savedDept.name}" has been successfully added to database!`);
      loadData(true);
    } catch (err: any) {
      console.error('Error creating department:', err);
      showToast(err.message || 'Failed to save department', 'error');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler: Update existing department
  const handleUpdateDepartment = async (updatedDept: AdminDepartment) => {
    try {
      const saved = await api.updateDepartment(updatedDept.id, updatedDept);

      // If a registered doctor was selected as head doctor, update their department affiliation
      if (
        saved.headDoctor?.id &&
        saved.headDoctor.id !== 'unassigned' &&
        !saved.headDoctor.id.startsWith('doc-custom')
      ) {
        try {
          await api.updateDoctor(saved.headDoctor.id, {
            department: saved.name,
            departmentId: saved.id,
          });
          setDoctors((prev) =>
            prev.map((d) =>
              d.id === saved.headDoctor?.id
                ? { ...d, department: saved.name, departmentId: saved.id }
                : d
            )
          );
        } catch (docErr) {
          console.error('Failed to associate doctor with department:', docErr);
        }
      }

      setDepartments((prev) =>
        prev.map((d) => (d.id === saved.id ? saved : d))
      );
      setSelectedDeptForModal(saved);
      showToast(`Department "${saved.name}" updated successfully.`);
      loadData(true);
    } catch (err: any) {
      console.error('Error updating department:', err);
      showToast(err.message || 'Failed to update department', 'error');
      throw err;
    }
  };

  // Handler: Toggle status (Active / Inactive / Deactivate)
  const handleToggleStatus = async (deptId: string) => {
    const dept = departments.find((d) => d.id === deptId);
    if (!dept) return;

    const newStatus: 'Active' | 'Inactive' = dept.status === 'Active' ? 'Inactive' : 'Active';
    try {
      // Optimistic update
      setDepartments((prev) =>
        prev.map((d) => (d.id === deptId ? { ...d, status: newStatus } : d))
      );
      setSelectedDeptForModal((prev) =>
        prev && prev.id === deptId ? { ...prev, status: newStatus } : prev
      );

      const updated = await api.updateDepartment(deptId, { status: newStatus });
      setDepartments((prev) =>
        prev.map((d) => (d.id === deptId ? { ...d, status: updated.status } : d))
      );
      showToast(
        `Department "${dept.name}" is now ${newStatus}.`,
        newStatus === 'Active' ? 'success' : 'info'
      );
    } catch (err: any) {
      console.error('Error updating department status:', err);
      showToast('Failed to update department status', 'error');
      await loadData(true);
    }
  };

  // Handler: Request delete department (opens confirmation modal)
  const handleRequestDeleteDepartment = (deptId: string) => {
    const targetDept = enrichedDepartments.find((d) => d.id === deptId) || departments.find((d) => d.id === deptId);
    if (targetDept) {
      setDeptToDelete(targetDept);
    }
  };

  // Handler: Execute confirmed deletion
  const handleConfirmDeleteDepartment = async () => {
    if (!deptToDelete) return;
    setIsDeletingDept(true);
    try {
      await api.deleteDepartment(deptToDelete.id);

      // Unassign any doctors currently affiliated with this department
      const affectedDocs = doctors.filter(
        (doc) =>
          (doc.department || '').trim().toLowerCase() === (deptToDelete.name || '').trim().toLowerCase() ||
          doc.departmentId === deptToDelete.id ||
          deptToDelete.headDoctor?.id === doc.id
      );

      for (const doc of affectedDocs) {
        try {
          await api.updateDoctor(doc.id, { department: '', departmentId: '' });
        } catch (docErr) {
          console.warn('Failed to unassign doctor upon department deletion:', docErr);
        }
      }

      setDepartments((prev) => prev.filter((d) => d.id !== deptToDelete.id));
      setDoctors((prev) =>
        prev.map((d) =>
          affectedDocs.some((ad) => ad.id === d.id)
            ? { ...d, department: '', departmentId: '' }
            : d
        )
      );

      if (selectedDeptForModal?.id === deptToDelete.id) {
        setIsViewModalOpen(false);
        setSelectedDeptForModal(null);
      }

      showToast(`Department "${deptToDelete.name}" was permanently removed from hospital records.`);
      setDeptToDelete(null);
    } catch (err: any) {
      console.error('Error deleting department:', err);
      showToast(err.message || 'Failed to delete department from database', 'error');
    } finally {
      setIsDeletingDept(false);
    }
  };

  // Handler: View/Edit/Manage department modal
  const handleViewDepartment = (
    dept: AdminDepartment,
    initialTab: 'overview' | 'edit' | 'doctors' = 'overview'
  ) => {
    setSelectedDeptForModal(dept);
    setModalInitialTab(initialTab);
    setIsViewModalOpen(true);
  };

  // Computed departments with real-time dynamic totalDoctors count from doctors state
  const enrichedDepartments = useMemo(() => {
    return departments.map((dept) => {
      const deptNameNorm = (dept.name || '').trim().toLowerCase();
      const count = doctors.filter((doc) => {
        const docDeptNorm = (doc.department || '').trim().toLowerCase();
        const isNameMatch = docDeptNorm.length > 0 && docDeptNorm === deptNameNorm;
        const isIdMatch = Boolean(dept.id && doc.departmentId && doc.departmentId === dept.id);
        const isHeadDoc = Boolean(
          dept.headDoctor?.id &&
          dept.headDoctor.id !== 'unassigned' &&
          dept.headDoctor.id === doc.id
        );
        return isNameMatch || isIdMatch || isHeadDoc;
      }).length;

      return {
        ...dept,
        totalDoctors: count,
      };
    });
  }, [departments, doctors]);

  // Active modal department kept continuously in sync with live counts
  const activeModalDept = useMemo(() => {
    if (!selectedDeptForModal) return null;
    const found = enrichedDepartments.find((d) => d.id === selectedDeptForModal.id);
    return found ? { ...selectedDeptForModal, ...found } : selectedDeptForModal;
  }, [selectedDeptForModal, enrichedDepartments]);

  // Handler: Assign doctor to department
  const handleAssignDoctor = async (doctorId: string, deptName: string) => {
    try {
      const doc = doctors.find((d) => d.id === doctorId);
      if (!doc) return;
      const targetDept = departments.find(
        (d) => (d.name || '').trim().toLowerCase() === deptName.trim().toLowerCase()
      );
      
      const updatedDoctor = await api.updateDoctor(doctorId, {
        department: deptName,
        departmentId: targetDept?.id || '',
      });

      const actualUpdatedDoc = updatedDoctor || {
        ...doc,
        department: deptName,
        departmentId: targetDept?.id || '',
      };

      // Optimistically update doctors state
      setDoctors((prev) => prev.map((d) => (d.id === doctorId ? actualUpdatedDoc : d)));

      showToast(`Dr. ${doc.name} was successfully assigned to ${deptName}!`);
      loadData(true);
    } catch (err: any) {
      console.error('Error assigning doctor:', err);
      showToast('Failed to assign doctor to department', 'error');
      throw err;
    }
  };

  // Handler: Unassign doctor from department
  const handleRemoveDoctorFromDept = async (doctorId: string) => {
    try {
      const doc = doctors.find((d) => d.id === doctorId);
      if (!doc) return;
      const prevDept = doc.department;

      // Check if this doctor was also assigned as the head doctor of any department
      const affectedDept = departments.find((d) => d.headDoctor?.id === doctorId);
      if (affectedDept) {
        try {
          await api.updateDepartment(affectedDept.id, {
            headDoctor: {
              id: 'unassigned',
              name: 'To Be Assigned',
              role: 'Pending Assignment',
            },
          });
          setDepartments((prev) =>
            prev.map((d) =>
              d.id === affectedDept.id
                ? {
                    ...d,
                    headDoctor: {
                      id: 'unassigned',
                      name: 'To Be Assigned',
                      role: 'Pending Assignment',
                    },
                  }
                : d
            )
          );
        } catch (headErr) {
          console.error('Error updating head doctor on unassignment:', headErr);
        }
      }

      // Fully unassign the doctor (clear department & departmentId)
      const updatedDoctor = await api.updateDoctor(doctorId, {
        department: '',
        departmentId: '',
      });

      const actualUpdatedDoc = updatedDoctor || {
        ...doc,
        department: '',
        departmentId: '',
      };

      // Optimistically update doctors state
      setDoctors((prev) => prev.map((d) => (d.id === doctorId ? actualUpdatedDoc : d)));

      showToast(`Dr. ${doc.name} was successfully unassigned from ${prevDept || 'department'}.`);
      loadData(true);
    } catch (err: any) {
      console.error('Error unassigning doctor from department:', err);
      showToast('Failed to unassign doctor', 'error');
      throw err;
    }
  };

  // Calculated stats based on live data
  const totalDepartments = enrichedDepartments.length;
  const activeCount = enrichedDepartments.filter((d) => d.status === 'Active').length;
  const totalDoctorsCount = doctors.length;

  // Focus add department on button click
  const handleAddDepartmentClick = () => {
    const inputEl = document.querySelector('input[placeholder="e.g. Cardiology"]') as HTMLInputElement;
    if (inputEl) {
      inputEl.focus();
      inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex h-screen bg-[#F5FAFF] overflow-hidden text-[#0D2857]">
      {/* 1. Fixed Left Sidebar */}
      <AdminSidebar
        activeItem="departments"
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
          searchPlaceholder="Search departments, doctors, appointments..."
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
                    ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]'
                    : toastMessage.type === 'info'
                    ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]'
                    : 'bg-[#E7F9F0] border-[#A7F3D0] text-[#047857]'
                }`}
              >
                <div className="flex items-center gap-2 text-[13.5px] font-medium">
                  {toastMessage.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
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

            {/* 3. Page Breadcrumb */}
            <nav className="flex items-center gap-2 text-[13px] text-[#5273A8] font-medium select-none" aria-label="Breadcrumb">
              <button
                type="button"
                onClick={() => onNavigateNav('dashboard')}
                className="hover:text-[#0868F5] transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span className="text-[#0868F5] font-semibold">Departments</span>
            </nav>

            {/* 4. Page Title Area */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-[12px] bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center shrink-0 shadow-2xs">
                  <LayoutGrid className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h1 className="text-[24px] sm:text-[26px] font-bold text-[#0D2857] leading-tight">
                    Departments
                  </h1>
                  <p className="text-[13px] text-[#5273A8] mt-0.5">
                    Manage hospital departments, their doctors and clinical services.
                  </p>
                </div>
              </div>

              {/* Sync / Refresh Button */}
              <button
                type="button"
                onClick={() => loadData(true)}
                disabled={isRefreshing || isLoading}
                className="self-start sm:self-auto h-[38px] px-3.5 rounded-[10px] bg-white hover:bg-[#F5FAFF] border border-[#DCEBFA] text-[13px] font-medium text-[#5273A8] hover:text-[#0868F5] flex items-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0868F5]' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Sync Database'}</span>
              </button>
            </div>

            {/* 5. Top Statistics Cards */}
            <DepartmentStats
              totalDepartments={totalDepartments}
              totalDoctors={totalDoctorsCount}
              totalAppointments={totalAppointmentsCount}
              activeDepartments={activeCount}
              onFilterStatus={(status) => {
                if (status === 'Active') setSelectedStatusFilter('Active');
                else setSelectedStatusFilter('All Statuses');
              }}
            />

            {/* Main Content Split: Table on Left + Add Department Panel on Right */}
            <div className="flex flex-col xl:flex-row items-start gap-6">
              {/* Left / Center Table Section */}
              <div className="flex-1 w-full min-w-0">
                {isLoading ? (
                  <div className="bg-white border border-[#DCEBFA] rounded-[16px] p-16 text-center shadow-2xs">
                    <Loader2 className="w-8 h-8 text-[#0868F5] animate-spin mx-auto mb-3" />
                    <p className="text-[15px] font-semibold text-[#0D2857]">
                      Loading departments from database...
                    </p>
                    <p className="text-[13px] text-[#5273A8] mt-1">
                      Retrieving real-time hospital records.
                    </p>
                  </div>
                ) : (
                  <DepartmentTable
                    departments={enrichedDepartments}
                    onAddDepartmentClick={handleAddDepartmentClick}
                    onViewDepartment={handleViewDepartment}
                    onEditDepartment={(dept) => handleViewDepartment(dept, 'edit')}
                    onManageDoctors={(dept) => handleViewDepartment(dept, 'doctors')}
                    onToggleStatus={handleToggleStatus}
                    onDeleteDepartment={handleRequestDeleteDepartment}
                    selectedDepartmentFilter={selectedDeptFilter}
                    onDepartmentFilterChange={setSelectedDeptFilter}
                    selectedStatusFilter={selectedStatusFilter}
                    onStatusFilterChange={setSelectedStatusFilter}
                    searchQuery={tableSearch || globalSearch}
                    onSearchChange={setTableSearch}
                  />
                )}
              </div>

              {/* 6. Right-Side Add Department Panel */}
              <AddDepartmentPanel
                onSaveDepartment={handleSaveNewDepartment}
                availableDoctors={doctors}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Department Detail / Edit Modal */}
      <DepartmentViewModal
        department={activeModalDept}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onUpdateDepartment={handleUpdateDepartment}
        availableDoctors={doctors}
        initialTab={modalInitialTab}
        onAssignDoctor={handleAssignDoctor}
        onRemoveDoctor={handleRemoveDoctorFromDept}
        onRemoveDoctorFromDept={handleRemoveDoctorFromDept}
        onToggleStatus={handleToggleStatus}
        onDeleteDepartment={handleRequestDeleteDepartment}
      />

      {/* Delete Department Confirmation Modal */}
      {deptToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1A33]/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-[20px] max-w-md w-full p-6 shadow-[0_20px_50px_rgba(13,40,87,0.25)] border border-[#E2E8F0] space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0 text-[#DC2626]">
                <Trash2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-[#0D2857]">
                  Delete Department
                </h3>
                <p className="text-[12.5px] text-[#5273A8]">
                  This action permanently removes the department.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-[12px] bg-[#FEF2F2]/60 border border-[#FECACA] space-y-1.5">
              <p className="text-[13px] font-semibold text-[#991B1B]">
                Are you sure you want to delete <span className="font-bold underline">{deptToDelete.name}</span>?
              </p>
              <p className="text-[12px] text-[#B91C1C] leading-relaxed">
                The department will be deleted from hospital listings, booking routes, and directory navigation.
              </p>
            </div>

            {(deptToDelete.totalDoctors || 0) > 0 && (
              <div className="p-3 rounded-[10px] bg-[#FFFBEB] border border-[#FDE68A] text-[12px] text-[#92400E] flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <span>
                  <strong>{deptToDelete.totalDoctors} specialist(s)</strong> are currently assigned to this department. They will be unassigned and available to join other departments.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#F1F6FC]">
              <button
                type="button"
                disabled={isDeletingDept}
                onClick={() => setDeptToDelete(null)}
                className="px-4 py-2 rounded-[9px] text-[13px] font-semibold text-[#5273A8] hover:bg-[#F0F5FA] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingDept}
                onClick={handleConfirmDeleteDepartment}
                className="px-4 py-2 rounded-[9px] bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-60 text-white text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                {isDeletingDept ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Department</span>
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
