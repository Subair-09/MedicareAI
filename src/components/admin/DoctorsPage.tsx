import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  ChevronRight,
  Plus,
  Home,
  Search,
  X,
  Download,
  CheckCircle2,
  AlertCircle,
  Check,
  UserCheck,
  UserX,
  RotateCw,
  Loader2,
} from 'lucide-react';
import { AdminSidebar, NavItemKey } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { DoctorStats } from './doctors/DoctorStats';
import { DoctorFilters } from './doctors/DoctorFilters';
import { DoctorTable } from './doctors/DoctorTable';
import { DoctorQuickActions } from './doctors/DoctorQuickActions';
import { DepartmentDistributionCard } from './doctors/DepartmentDistributionCard';
import { RecentDoctorActivityCard } from './doctors/RecentDoctorActivityCard';
import { AddDoctorModal } from './doctors/AddDoctorModal';
import { EditDoctorModal } from './doctors/EditDoctorModal';
import { DoctorProfileModal } from './doctors/DoctorProfileModal';
import { AvailabilityModal } from './doctors/AvailabilityModal';
import { LeaveModal } from './doctors/LeaveModal';
import { DoctorConfirmationModal } from './doctors/DoctorConfirmationModal';
import { DoctorActivityItem } from '../../data/doctorsData';
import {
  AdminDoctor,
  DoctorStatus,
  WeeklyAvailability,
  SpecificDateAvailability,
  LeaveSchedule,
} from '../../types';
import { api } from '../../services/api';

interface DoctorsPageProps {
  adminUser?: {
    email: string;
    name: string;
    role: string;
  };
  onNavigateNav?: (key: NavItemKey) => void;
  onSignOut: () => void;
  onGoToPatientPortal: () => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  adminUser = {
    email: 'nuddywale@gmail.com',
    name: 'Adewale',
    role: 'Super Administrator',
  },
  onNavigateNav,
  onSignOut,
  onGoToPatientPortal,
}) => {
  // Navigation & Mobile drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  // Doctors & Activities State - initialized empty for live DB integration
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>(['All Departments']);
  const [activities, setActivities] = useState<DoctorActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState<DoctorStatus | 'All Status'>('All Status');
  const [selectedAvailability, setSelectedAvailability] = useState('All Availability');

  // Selection & Pagination
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<AdminDoctor | null>(null);
  const [profileDoctor, setProfileDoctor] = useState<AdminDoctor | null>(null);
  const [availabilityDoctor, setAvailabilityDoctor] = useState<AdminDoctor | null>(null);
  const [leaveDoctor, setLeaveDoctor] = useState<AdminDoctor | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    doctor: AdminDoctor | null;
    type: 'delete' | 'deactivate' | 'activate';
  }>({
    isOpen: false,
    doctor: null,
    type: 'delete',
  });

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch live doctors and departments from backend
  const fetchLiveDoctors = async (showLoadingState = true) => {
    if (showLoadingState) setIsLoading(true);
    try {
      const [docsData, deptsData] = await Promise.all([
        api.getDoctors().catch(() => []),
        api.getDepartments().catch(() => []),
      ]);
      setDoctors(Array.isArray(docsData) ? docsData : []);
      if (Array.isArray(deptsData) && deptsData.length > 0) {
        const deptNames = ['All Departments', ...deptsData.map((d) => d.name).filter(Boolean)];
        setAvailableDepartments(Array.from(new Set(deptNames)));
      } else {
        setAvailableDepartments(['All Departments']);
      }
    } catch (err: any) {
      console.error('Failed to load doctors from database:', err);
      showToast('Could not fetch live doctor records.', 'warning');
    } finally {
      if (showLoadingState) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLiveDoctors();
  }, []);

  // Filtered doctors computation
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // 1. Search filter (Name, ID, Specialty, Department, Email)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = doc.name ? doc.name.toLowerCase().includes(q) : false;
        const matchesId = doc.id ? doc.id.toLowerCase().includes(q) : false;
        const matchesSpecialty = doc.specialty ? doc.specialty.toLowerCase().includes(q) : false;
        const matchesDept = doc.department ? doc.department.toLowerCase().includes(q) : false;
        const matchesEmail = doc.email ? doc.email.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesId && !matchesSpecialty && !matchesDept && !matchesEmail) {
          return false;
        }
      }

      // 2. Department filter
      if (selectedDepartment !== 'All Departments') {
        if (doc.department !== selectedDepartment) {
          return false;
        }
      }

      // 3. Status filter
      if (selectedStatus !== 'All Status') {
        if (doc.status !== selectedStatus) {
          return false;
        }
      }

      // 4. Availability filter
      if (selectedAvailability !== 'All Availability') {
        if (selectedAvailability === 'Available Today') {
          const dayNames: (keyof WeeklyAvailability)[] = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
          ];
          const todayIndex = new Date().getDay();
          const todayName = dayNames[todayIndex];
          if (!doc.weeklyAvailability?.[todayName]?.enabled || doc.status !== 'Active') {
            return false;
          }
        } else if (selectedAvailability === 'On Leave') {
          if (doc.status !== 'On Leave') {
            return false;
          }
        } else if (selectedAvailability === 'Unavailable') {
          if (doc.status === 'Active') {
            return false;
          }
        }
      }

      return true;
    });
  }, [doctors, searchQuery, selectedDepartment, selectedStatus, selectedAvailability]);

  // Pagination calculation
  const totalCount = filteredDoctors.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedDoctors = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDoctors.slice(startIndex, startIndex + pageSize);
  }, [filteredDoctors, currentPage, pageSize]);

  // Calculate statistics counts
  const statsCounts = useMemo(() => {
    const total = doctors.length;
    const active = doctors.filter((d) => d.status === 'Active').length;
    const onLeave = doctors.filter((d) => d.status === 'On Leave').length;
    const inactive = doctors.filter((d) => d.status === 'Inactive').length;
    return { total, active, onLeave, inactive };
  }, [doctors]);

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (paginatedDoctors.every((d) => selectedDoctorIds.includes(d.id))) {
      // Unselect all on current page
      setSelectedDoctorIds((prev) =>
        prev.filter((id) => !paginatedDoctors.some((d) => d.id === id))
      );
    } else {
      // Select all on current page
      const newIds = new Set([
        ...selectedDoctorIds,
        ...paginatedDoctors.map((d) => d.id),
      ]);
      setSelectedDoctorIds(Array.from(newIds));
    }
  };

  const handleToggleSelectDoctor = (id: string) => {
    setSelectedDoctorIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkActivate = async () => {
    const idsToActivate = [...selectedDoctorIds];
    setDoctors((prev) =>
      prev.map((d) =>
        idsToActivate.includes(d.id) ? { ...d, status: 'Active' as DoctorStatus } : d
      )
    );
    showToast(`${idsToActivate.length} doctors activated.`);
    setSelectedDoctorIds([]);

    // Persist changes in backend
    try {
      await Promise.all(
        idsToActivate.map((id) => api.updateDoctor(id, { status: 'Active' }))
      );
    } catch (e) {
      console.error('Error activating doctors in backend:', e);
    }
  };

  const handleBulkDeactivate = async () => {
    const idsToDeactivate = [...selectedDoctorIds];
    setDoctors((prev) =>
      prev.map((d) =>
        idsToDeactivate.includes(d.id) ? { ...d, status: 'Inactive' as DoctorStatus } : d
      )
    );
    showToast(`${idsToDeactivate.length} doctors deactivated.`, 'warning');
    setSelectedDoctorIds([]);

    // Persist changes in backend
    try {
      await Promise.all(
        idsToDeactivate.map((id) => api.updateDoctor(id, { status: 'Inactive' }))
      );
    } catch (e) {
      console.error('Error deactivating doctors in backend:', e);
    }
  };

  const handleBulkExport = () => {
    const selectedDocs = doctors.filter((d) => selectedDoctorIds.includes(d.id));
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Name,Department,Specialty,Experience,Fee,Status,Email,Phone']
        .concat(
          selectedDocs.map(
            (d) =>
              `"${d.id}","${d.name}","${d.department}","${d.specialty}","${d.experienceText || ''}","${d.feeText || ''}","${d.status}","${d.email}","${d.phone}"`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `medicare_doctors_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${selectedDocs.length} doctor records to CSV.`);
  };

  // Doctor CRUD Operations with live DB sync
  const handleAddDoctor = async (newDoc: AdminDoctor) => {
    try {
      const savedDoc = await api.createDoctor(newDoc);
      const doctorToAdd = savedDoc && savedDoc.id ? savedDoc : newDoc;
      setDoctors((prev) => [doctorToAdd, ...prev]);

      const newActivity: DoctorActivityItem = {
        id: `act-${Date.now()}`,
        doctorName: doctorToAdd.name,
        title: `${doctorToAdd.name} registered`,
        description: `Added to ${doctorToAdd.department}`,
        time: 'Just now',
        type: 'added',
      };
      setActivities((prev) => [newActivity, ...prev]);
      showToast(`${doctorToAdd.name} successfully registered.`);
    } catch (err: any) {
      console.error('Failed to create doctor via API:', err);
      // Fallback local update
      setDoctors((prev) => [newDoc, ...prev]);
      showToast(`${newDoc.name} registered locally.`);
    }
  };

  const handleSaveEditedDoctor = async (updated: AdminDoctor) => {
    try {
      await api.updateDoctor(updated.id, updated);
      setDoctors((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      const newActivity: DoctorActivityItem = {
        id: `act-${Date.now()}`,
        doctorName: updated.name,
        title: `${updated.name} updated`,
        description: 'Profile information modified',
        time: 'Just now',
        type: 'updated',
      };
      setActivities((prev) => [newActivity, ...prev]);
      showToast(`Updated ${updated.name}'s profile.`);
    } catch (err) {
      console.error('Failed to update doctor via API:', err);
      setDoctors((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
      showToast(`Updated ${updated.name} locally.`);
    }
  };

  const handleSaveAvailability = async (
    doc: AdminDoctor,
    weekly: WeeklyAvailability,
    specific: SpecificDateAvailability[]
  ) => {
    const updated: AdminDoctor = {
      ...doc,
      weeklyAvailability: weekly,
      specificAvailability: specific,
    };
    try {
      await api.updateDoctor(doc.id, {
        weeklyAvailability: weekly,
        specificAvailability: specific,
      });
      setDoctors((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
      const newActivity: DoctorActivityItem = {
        id: `act-${Date.now()}`,
        doctorName: doc.name,
        title: `${doc.name} updated`,
        description: 'Availability schedule configured',
        time: 'Just now',
        type: 'updated',
      };
      setActivities((prev) => [newActivity, ...prev]);
      showToast(`Saved availability schedule for ${doc.name}.`);
    } catch (err) {
      setDoctors((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
      showToast(`Saved availability schedule.`);
    }
  };

  const handleSaveLeave = async (doc: AdminDoctor, leave: LeaveSchedule | null) => {
    const updated: AdminDoctor = {
      ...doc,
      leaveSchedule: leave || undefined,
      status: leave ? 'On Leave' : 'Active',
    };
    try {
      await api.updateDoctor(doc.id, {
        leaveSchedule: leave || undefined,
        status: leave ? 'On Leave' : 'Active',
      });
      setDoctors((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
      const newActivity: DoctorActivityItem = {
        id: `act-${Date.now()}`,
        doctorName: doc.name,
        title: leave ? `${doc.name} set on leave` : `${doc.name} returned from leave`,
        description: leave ? 'Leave schedule recorded' : 'Doctor status set to Active',
        time: 'Just now',
        type: leave ? 'leave' : 'activated',
      };
      setActivities((prev) => [newActivity, ...prev]);
      showToast(
        leave ? `Recorded leave for ${doc.name}.` : `${doc.name} is now Active.`
      );
    } catch (err) {
      setDoctors((prev) => prev.map((d) => (d.id === doc.id ? updated : d)));
      showToast(leave ? `Recorded leave for ${doc.name}.` : `${doc.name} is now Active.`);
    }
  };

  const handleToggleStatus = (doc: AdminDoctor) => {
    if (doc.status === 'Inactive') {
      setConfirmModal({
        isOpen: true,
        doctor: doc,
        type: 'activate',
      });
    } else {
      setConfirmModal({
        isOpen: true,
        doctor: doc,
        type: 'deactivate',
      });
    }
  };

  const handleDeleteDoctor = (doc: AdminDoctor) => {
    setConfirmModal({
      isOpen: true,
      doctor: doc,
      type: 'delete',
    });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.doctor) return;
    const doc = confirmModal.doctor;

    if (confirmModal.type === 'delete') {
      try {
        await api.deleteDoctor(doc.id);
        setDoctors((prev) => prev.filter((d) => d.id !== doc.id));
        setSelectedDoctorIds((prev) => prev.filter((id) => id !== doc.id));
        showToast(`Deleted ${doc.name} from hospital records.`, 'warning');
      } catch (err) {
        console.error('Failed to delete doctor via API:', err);
        setDoctors((prev) => prev.filter((d) => d.id !== doc.id));
        setSelectedDoctorIds((prev) => prev.filter((id) => id !== doc.id));
        showToast(`Removed ${doc.name} from view.`);
      }
    } else if (confirmModal.type === 'deactivate') {
      try {
        await api.updateDoctor(doc.id, { status: 'Inactive' });
        setDoctors((prev) =>
          prev.map((d) => (d.id === doc.id ? { ...d, status: 'Inactive' as DoctorStatus } : d))
        );
        showToast(`Deactivated ${doc.name}.`);
      } catch (err) {
        setDoctors((prev) =>
          prev.map((d) => (d.id === doc.id ? { ...d, status: 'Inactive' as DoctorStatus } : d))
        );
      }
    } else if (confirmModal.type === 'activate') {
      try {
        await api.updateDoctor(doc.id, { status: 'Active' });
        setDoctors((prev) =>
          prev.map((d) => (d.id === doc.id ? { ...d, status: 'Active' as DoctorStatus } : d))
        );
        showToast(`Activated ${doc.name}.`);
      } catch (err) {
        setDoctors((prev) =>
          prev.map((d) => (d.id === doc.id ? { ...d, status: 'Active' as DoctorStatus } : d))
        );
      }
    }
    setConfirmModal({ isOpen: false, doctor: null, type: 'delete' });
  };

  const handleClearFilters = () => {
    setSelectedDepartment('All Departments');
    setSelectedStatus('All Status');
    setSelectedAvailability('All Availability');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedDepartment !== 'All Departments' ||
    selectedStatus !== 'All Status' ||
    selectedAvailability !== 'All Availability' ||
    searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-[#F6FAFF] flex font-sans text-[#102A52]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[100] animate-fadeIn flex items-center gap-2.5 px-4 py-3 rounded-[12px] bg-white border border-[#DCEBFA] shadow-[0_10px_30px_rgba(16,42,82,0.14)]">
          {toastMessage.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-[#20B879]" />
          )}
          {toastMessage.type === 'warning' && (
            <AlertCircle className="w-5 h-5 text-[#EF4444]" />
          )}
          {toastMessage.type === 'info' && (
            <Check className="w-5 h-5 text-[#0878F9]" />
          )}
          <span className="text-[13px] font-semibold text-[#102A52]">
            {toastMessage.text}
          </span>
        </div>
      )}

      {/* Sidebar */}
      <AdminSidebar
        activeItem="doctors"
        onSelectItem={(item) => {
          if (onNavigateNav) {
            onNavigateNav(item);
          }
        }}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header */}
        <AdminHeader
          adminName={adminUser.name}
          adminRole={adminUser.role}
          adminEmail={adminUser.email}
          searchQuery={headerSearch}
          onSearchChange={(q) => {
            setHeaderSearch(q);
            setSearchQuery(q);
            setCurrentPage(1);
          }}
          onSignOut={onSignOut}
          onGoToPatientPortal={onGoToPatientPortal}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-7 space-y-5 max-w-[1720px] w-full mx-auto">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[12.5px] text-[#5879A6]">
            <button
              type="button"
              onClick={() => onNavigateNav && onNavigateNav('dashboard')}
              className="flex items-center gap-1.5 hover:text-[#0878F9] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#5879A6]/60" />
            <span className="font-semibold text-[#102A52]">Doctors</span>
          </nav>

          {/* Page Title & Top Actions Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title & Description */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[12px] bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center shrink-0 border border-[#DCEBFA]">
                <Users className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h1 className="text-[22px] sm:text-[25px] font-bold text-[#102A52] leading-tight">
                  Doctors
                </h1>
                <p className="text-[13px] text-[#5879A6] mt-0.5">
                  Manage your hospital&apos;s doctors, their departments and availability.
                </p>
              </div>
            </div>

            {/* Right: Search Input + Sync Button + "+ Add Doctor" Button */}
            <div className="flex items-center gap-2.5 sm:gap-3 self-stretch sm:self-auto">
              {/* Search doctors input */}
              <div className="relative flex-1 sm:w-60 md:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search doctors..."
                  className="w-full h-[40px] pl-9 pr-8 rounded-[10px] bg-white border border-[#DCEBFA] text-[13px] text-[#102A52] placeholder-[#5879A6] focus:outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/10 shadow-[0_1px_2px_rgba(16,42,82,0.02)] transition-all"
                />
                <Search className="w-4 h-4 text-[#5879A6] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#5879A6] hover:text-[#102A52] cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sync Live Database Button */}
              <button
                type="button"
                onClick={() => {
                  setIsRefreshing(true);
                  fetchLiveDoctors(false);
                }}
                title="Sync with live database"
                className="h-[40px] px-3 sm:px-3.5 rounded-[10px] bg-white border border-[#DCEBFA] hover:bg-[#F8FBFF] text-[#5879A6] hover:text-[#0878F9] text-[13px] font-semibold flex items-center gap-1.5 transition-all shadow-[0_1px_2px_rgba(16,42,82,0.02)] cursor-pointer shrink-0"
              >
                <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#0878F9]' : ''}`} />
                <span className="hidden sm:inline">Sync</span>
              </button>

              {/* + Add Doctor Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="h-[40px] px-4 sm:px-5 rounded-[10px] bg-[#0878F9] hover:bg-[#0768D6] text-white text-[13px] font-bold flex items-center gap-2 shadow-[0_2px_8px_rgba(8,120,249,0.25)] transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add Doctor</span>
              </button>
            </div>
          </div>

          {/* Section 1: Doctor Statistics Cards */}
          <DoctorStats
            totalCount={statsCounts.total}
            activeCount={statsCounts.active}
            onLeaveCount={statsCounts.onLeave}
            inactiveCount={statsCounts.inactive}
            activeStatusFilter={selectedStatus === 'All Status' ? 'All' : selectedStatus}
            onSelectStatus={(status) => {
              setSelectedStatus(status === 'All' ? 'All Status' : status);
              setCurrentPage(1);
            }}
          />

          {/* Section 2: Main Grid (Left Table & Filters, Right Sidebar) */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
            {/* Left 8-column Table Area */}
            <div className="xl:col-span-8 2xl:col-span-8 space-y-4 min-w-0">
              {/* Filter Bar */}
              <DoctorFilters
                selectedDepartment={selectedDepartment}
                onDepartmentChange={(dept) => {
                  setSelectedDepartment(dept);
                  setCurrentPage(1);
                }}
                selectedStatus={selectedStatus}
                onStatusChange={(status) => {
                  setSelectedStatus(status);
                  setCurrentPage(1);
                }}
                selectedAvailability={selectedAvailability}
                onAvailabilityChange={(avail) => {
                  setSelectedAvailability(avail);
                  setCurrentPage(1);
                }}
                onClearFilters={handleClearFilters}
                hasActiveFilters={hasActiveFilters}
                departmentOptions={availableDepartments}
              />

              {/* Bulk Selection Bar (appears when 1 or more doctors are checked) */}
              {selectedDoctorIds.length > 0 && (
                <div className="p-3 bg-[#EAF4FF] border border-[#BFDBFE] rounded-[12px] flex flex-wrap items-center justify-between gap-3 text-[13px] animate-fadeIn">
                  <div className="flex items-center gap-2 font-semibold text-[#0878F9]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {selectedDoctorIds.length}{' '}
                      {selectedDoctorIds.length === 1 ? 'doctor' : 'doctors'} selected
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleBulkActivate}
                      className="px-3 py-1.5 rounded-[8px] bg-white border border-[#BFDBFE] hover:bg-[#F0F7FF] text-[#20B879] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Activate</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBulkDeactivate}
                      className="px-3 py-1.5 rounded-[8px] bg-white border border-[#BFDBFE] hover:bg-[#F0F7FF] text-[#64748B] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>Deactivate</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBulkExport}
                      className="px-3 py-1.5 rounded-[8px] bg-white border border-[#BFDBFE] hover:bg-[#F0F7FF] text-[#0878F9] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedDoctorIds([])}
                      className="text-[12px] font-medium text-[#5879A6] hover:text-[#102A52] px-2 py-1 cursor-pointer"
                    >
                      Deselect
                    </button>
                  </div>
                </div>
              )}

              {/* Table or Loading State */}
              {isLoading ? (
                <div className="bg-white border border-[#DCEBFA] rounded-[14px] p-12 flex flex-col items-center justify-center text-center shadow-[0_1px_3px_rgba(16,42,82,0.02)]">
                  <Loader2 className="w-8 h-8 text-[#0878F9] animate-spin mb-3" />
                  <p className="text-[14px] font-semibold text-[#102A52]">Loading doctors...</p>
                  <p className="text-[12px] text-[#5879A6] mt-0.5">Fetching live medical roster from database</p>
                </div>
              ) : (
                <DoctorTable
                  doctors={paginatedDoctors}
                  selectedDoctorIds={selectedDoctorIds}
                  onToggleSelectAll={handleToggleSelectAll}
                  onToggleSelectDoctor={handleToggleSelectDoctor}
                  onViewProfile={(doc) => setProfileDoctor(doc)}
                  onEditDoctor={(doc) => setEditingDoctor(doc)}
                  onSetAvailability={(doc) => setAvailabilityDoctor(doc)}
                  onViewSchedule={(doc) => setAvailabilityDoctor(doc)}
                  onSetLeave={(doc) => setLeaveDoctor(doc)}
                  onToggleStatus={handleToggleStatus}
                  onDeleteDoctor={handleDeleteDoctor}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={totalCount}
                  pageSize={pageSize}
                  onPageChange={(p) => setCurrentPage(p)}
                  onPageSizeChange={(s) => {
                    setPageSize(s);
                    setCurrentPage(1);
                  }}
                />
              )}
            </div>

            {/* Right 4-column Sidebar Area */}
            <div className="xl:col-span-4 2xl:col-span-4 space-y-4">
              {/* Quick Actions Card */}
              <DoctorQuickActions
                onAddDoctor={() => setIsAddModalOpen(true)}
                onSetAvailability={() => {
                  if (doctors.length > 0) {
                    setAvailabilityDoctor(doctors[0]);
                  } else {
                    showToast('Register a doctor first to configure availability.', 'info');
                  }
                }}
                onManageDepartments={() => {
                  if (onNavigateNav) {
                    onNavigateNav('departments');
                  }
                }}
                onViewSchedules={() => {
                  if (doctors.length > 0) {
                    setAvailabilityDoctor(doctors[0]);
                  } else {
                    showToast('Register a doctor first to view schedules.', 'info');
                  }
                }}
              />

              {/* Department Distribution Donut Card - dynamic from live doctors */}
              <DepartmentDistributionCard
                doctors={doctors}
                onViewAll={() => setSelectedDepartment('All Departments')}
                onSelectDepartment={(deptName) => {
                  setSelectedDepartment(deptName === 'Others' ? 'All Departments' : deptName);
                  setCurrentPage(1);
                }}
              />

              {/* Recent Activity Card */}
              <RecentDoctorActivityCard
                activities={activities}
                onViewAll={() => showToast('Displaying recent doctor activity logs.')}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDoctor={handleAddDoctor}
        departmentOptions={availableDepartments.filter((d) => d !== 'All Departments')}
      />

      <EditDoctorModal
        isOpen={!!editingDoctor}
        onClose={() => setEditingDoctor(null)}
        doctor={editingDoctor}
        onSaveDoctor={handleSaveEditedDoctor}
        departmentOptions={availableDepartments.filter((d) => d !== 'All Departments')}
      />

      <DoctorProfileModal
        isOpen={!!profileDoctor}
        onClose={() => setProfileDoctor(null)}
        doctor={profileDoctor}
        onEdit={(doc) => {
          setProfileDoctor(null);
          setEditingDoctor(doc);
        }}
        onSetAvailability={(doc) => {
          setProfileDoctor(null);
          setAvailabilityDoctor(doc);
        }}
        onSetLeave={(doc) => {
          setProfileDoctor(null);
          setLeaveDoctor(doc);
        }}
      />

      <AvailabilityModal
        isOpen={!!availabilityDoctor}
        onClose={() => setAvailabilityDoctor(null)}
        doctor={availabilityDoctor}
        onSaveAvailability={handleSaveAvailability}
      />

      <LeaveModal
        isOpen={!!leaveDoctor}
        onClose={() => setLeaveDoctor(null)}
        doctor={leaveDoctor}
        onSaveLeave={handleSaveLeave}
      />

      <DoctorConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, doctor: null, type: 'delete' })}
        doctor={confirmModal.doctor}
        type={confirmModal.type}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};
