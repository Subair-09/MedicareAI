import React, { useState, useEffect, useMemo } from 'react';
import {
  Sun,
  Calendar as CalendarIcon,
  Search,
  X,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  UserCheck
} from 'lucide-react';
import { AdminSidebar, NavItemKey } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { StatsCards } from './StatsCards';
import { AppointmentOverviewChart } from './AppointmentOverviewChart';
import { DepartmentDonutChart } from './DepartmentDonutChart';
import { RecentAppointmentsTable } from './RecentAppointmentsTable';
import { QuickActionsPanel } from './QuickActionsPanel';
import { RecentActivityPanel } from './RecentActivityPanel';
import { AdminFooter } from './AdminFooter';
import { AppointmentsPage } from './AppointmentsPage';
import { DoctorsPage } from './DoctorsPage';
import { DepartmentsPage } from './DepartmentsPage';
import { PatientsPage } from './PatientsPage';
import { SchedulesPage } from './SchedulesPage';
import { KnowledgeBasePage } from './KnowledgeBasePage';
import { api } from '../../services/api';
import { Appointment, AdminDoctor, AdminDepartment, AdminPatient } from '../../types';

interface AdminDashboardProps {
  adminUser?: {
    email: string;
    name: string;
    role: string;
  };
  initialNav?: NavItemKey;
  onSignOut: () => void;
  onGoToPatientPortal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser = {
    email: 'nuddywale@gmail.com',
    name: 'Adewale',
    role: 'Super Administrator',
  },
  initialNav = 'dashboard',
  onSignOut,
  onGoToPatientPortal,
}) => {
  const [activeNav, setActiveNav] = useState<NavItemKey>(initialNav);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHospitalProfileOpen, setIsHospitalProfileOpen] = useState(false);

  // Real data state fetched from API
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);
  const [patients, setPatients] = useState<AdminPatient[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Live system date and time
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch real data from backend API
  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      try {
        setIsLoadingData(true);
        const [apptsData, docsData, deptsData, patsData] = await Promise.all([
          api.getAppointments().catch(() => []),
          api.getDoctors().catch(() => []),
          api.getDepartments().catch(() => []),
          api.getPatients().catch(() => []),
        ]);
        if (isMounted) {
          setAppointments(apptsData || []);
          setDoctors(docsData || []);
          setDepartments(deptsData || []);
          setPatients(patsData || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate real metrics for StatsCards dynamically
  const statsCounts = useMemo(() => {
    const now = new Date();
    const todayY = now.getFullYear();
    const todayM = now.getMonth();
    const todayD = now.getDate();

    // Today's appointments: non-cancelled appointments scheduled for today
    const todayAppointmentsCount = appointments.filter((a) => {
      if (a.status === 'Cancelled') return false;
      const raw = (a.date || '').toLowerCase();
      if (raw.includes('today')) return true;
      const parsed = new Date(a.date);
      if (!isNaN(parsed.getTime())) {
        return (
          parsed.getFullYear() === todayY &&
          parsed.getMonth() === todayM &&
          parsed.getDate() === todayD
        );
      }
      return false;
    }).length;

    // Upcoming appointments: status Confirmed or Pending
    const upcomingAppointmentsCount = appointments.filter(
      (a) => a.status === 'Confirmed' || a.status === 'Pending'
    ).length;

    // Total active doctors in the hospital roster
    const totalDoctorsCount = doctors.length;

    // Total active clinical departments
    const departmentsCount = departments.length;

    // Total recorded cancellations
    const cancelledAppointmentsCount = appointments.filter(
      (a) => a.status === 'Cancelled'
    ).length;

    return {
      todayAppointmentsCount,
      upcomingAppointmentsCount,
      totalDoctorsCount,
      departmentsCount,
      cancelledAppointmentsCount,
    };
  }, [appointments, doctors, departments]);

  // Live formatted date and time strings
  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [currentTime]);

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }, [currentTime]);

  const greetingPeriod = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, [currentTime]);

  // Derive notifications directly from real appointment records
  const dashboardNotifications = useMemo(() => {
    return appointments.slice(0, 5).map((apt) => ({
      id: apt.id,
      title: apt.status === 'Cancelled' ? 'Appointment cancelled' : 'Appointment scheduled',
      detail: `${apt.patientName} with ${apt.doctorName} (${apt.department})`,
      time: apt.date || 'Recent',
      unread: apt.status === 'Pending' || apt.status === 'Cancelled',
    }));
  }, [appointments]);

  // Dynamic search dataset populated strictly from live data
  const searchableItems = useMemo(() => {
    const items: { type: string; title: string; subtitle: string; targetNav: NavItemKey }[] = [];

    doctors.forEach((doc) => {
      items.push({
        type: 'Doctor',
        title: doc.name,
        subtitle: `${doc.specialty} • ${doc.department}`,
        targetNav: 'doctors',
      });
    });

    patients.forEach((pat) => {
      items.push({
        type: 'Patient',
        title: pat.name,
        subtitle: `ID: ${pat.patientId || pat.id} • ${pat.phone || pat.email}`,
        targetNav: 'patients',
      });
    });

    departments.forEach((dept) => {
      items.push({
        type: 'Department',
        title: dept.name,
        subtitle: `${dept.headDoctor || 'Clinical Department'} • ${dept.doctorsCount || 0} Specialists`,
        targetNav: 'departments',
      });
    });

    appointments.forEach((apt) => {
      items.push({
        type: 'Appointment',
        title: `${apt.patientName} with ${apt.doctorName}`,
        subtitle: `${apt.date} at ${apt.time} • ${apt.status}`,
        targetNav: 'appointments',
      });
    });

    return items;
  }, [doctors, patients, departments, appointments]);

  const filteredSearch = searchQuery.trim()
    ? searchableItems.filter(
        (i) =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // If on knowledge base page, render dedicated KnowledgeBasePage
  if (activeNav === 'knowledge-base') {
    return (
      <KnowledgeBasePage
        adminUser={adminUser}
        onNavigateNav={(item) => setActiveNav(item)}
        onSignOut={onSignOut}
        onGoToPatientPortal={onGoToPatientPortal}
      />
    );
  }

  // If on schedules page, render dedicated SchedulesPage
  if (activeNav === 'schedules') {
    return (
      <SchedulesPage
        adminUser={adminUser}
        onNavigateNav={(item) => setActiveNav(item)}
        onSignOut={onSignOut}
        onGoToPatientPortal={onGoToPatientPortal}
      />
    );
  }

  // If on patients page, render dedicated PatientsPage
  if (activeNav === 'patients') {
    return (
      <PatientsPage
        adminUser={adminUser}
        onNavigateNav={(item) => setActiveNav(item)}
        onSignOut={onSignOut}
        onGoToPatientPortal={onGoToPatientPortal}
      />
    );
  }

  // If on departments page, render dedicated DepartmentsPage
  if (activeNav === 'departments') {
    return (
      <DepartmentsPage
        adminUser={adminUser}
        onNavigateNav={(item) => setActiveNav(item)}
        onSignOut={onSignOut}
        onGoToPatientPortal={onGoToPatientPortal}
      />
    );
  }

  // If on appointments page, render dedicated AppointmentsPage
  if (activeNav === 'appointments') {
    return (
      <AppointmentsPage
        adminUser={adminUser}
        onNavigateNav={(item) => setActiveNav(item)}
        onSignOut={onSignOut}
        onGoToPatientPortal={onGoToPatientPortal}
      />
    );
  }

  // If on doctors page, render dedicated DoctorsPage
  if (activeNav === 'doctors') {
    return (
      <DoctorsPage
        adminUser={adminUser}
        onNavigateNav={(item) => setActiveNav(item)}
        onSignOut={onSignOut}
        onGoToPatientPortal={onGoToPatientPortal}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FAFF] flex text-[#102A52] font-sans antialiased selection:bg-[#0878F9]/20 selection:text-[#0878F9]">
      {/* 1. Left Sidebar Navigation */}
      <AdminSidebar
        activeItem={activeNav}
        onSelectItem={(item) => setActiveNav(item)}
        onViewHospitalProfile={() => setIsHospitalProfileOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Area: Top Header + Scrollable Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Sticky Top Header */}
        <AdminHeader
          adminName={adminUser.name}
          adminRole={adminUser.role}
          adminEmail={adminUser.email}
          notifications={dashboardNotifications}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q.trim()) setIsSearchOpen(true);
          }}
          onOpenSearch={() => {
            if (searchQuery.trim()) setIsSearchOpen(true);
          }}
          onSignOut={onSignOut}
          onGoToPatientPortal={onGoToPatientPortal}
          onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        {/* Global Search Results Overlay Modal */}
        {isSearchOpen && searchQuery.trim() && (
          <div
            className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-24 px-4 backdrop-blur-xs"
            onClick={() => setIsSearchOpen(false)}
          >
            <div
              className="bg-white rounded-[16px] border border-[#E1EDF9] shadow-2xl max-w-xl w-full p-5 text-left animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E1EDF9]">
                <div className="flex items-center gap-2 text-[#5879A6] text-[13px]">
                  <Search className="w-4 h-4 text-[#0878F9]" />
                  <span>Search results for &ldquo;{searchQuery}&rdquo;</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-lg text-[#94A3B8] hover:text-[#102A52] hover:bg-[#F1F5F9]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 divide-y divide-[#F1F5F9] max-h-80 overflow-y-auto">
                {filteredSearch.length > 0 ? (
                  filteredSearch.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-3 px-2.5 hover:bg-[#F8FBFF] rounded-[8px] flex items-center justify-between transition-colors cursor-pointer"
                      onClick={() => {
                        setActiveNav(item.targetNav);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <div>
                        <div className="text-[13.5px] font-bold text-[#102A52]">
                          {item.title}
                        </div>
                        <div className="text-[12px] text-[#5879A6]">
                          {item.subtitle}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF4FF] text-[#0878F9]">
                        {item.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-[13px] text-[#5879A6]">
                    No matching hospital records found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Content Container */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 space-y-6 max-w-[1680px] w-full mx-auto">
          {/* Active Navigation Indicator banner if on sub-views */}
          {activeNav !== 'dashboard' && (
            <div className="bg-[#EAF4FF] border border-[#BFDBFE] rounded-[12px] p-3.5 flex items-center justify-between">
              <div className="text-[13.5px] font-semibold text-[#0878F9] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0878F9]" />
                <span>Navigated to: <strong className="capitalize">{activeNav.replace('-', ' ')}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setActiveNav('dashboard')}
                className="text-[12px] font-bold text-[#0878F9] hover:underline cursor-pointer"
              >
                Back to Dashboard Overview →
              </button>
            </div>
          )}

          {/* Section 1: Greeting Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Left: Greeting Text with Sun Icon */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#FFF7ED] border border-[#FED7AA]/50 text-[#F59E0B] flex items-center justify-center shrink-0 shadow-2xs">
                <Sun className="w-6 h-6 stroke-[2.2] fill-[#F59E0B]/20" />
              </div>
              <div className="text-left">
                <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[#102A52] tracking-tight leading-tight">
                  {greetingPeriod}, {adminUser.name}
                </h1>
                <p className="text-[13.5px] text-[#5879A6] font-normal mt-0.5">
                  Here&apos;s what&apos;s happening at your hospital today.
                </p>
              </div>
            </div>

            {/* Right: Date & Time Display */}
            <div className="flex items-center gap-2.5 sm:self-center bg-white px-4 py-2 rounded-[10px] border border-[#E1EDF9] shadow-2xs">
              <CalendarIcon className="w-4 h-4 text-[#5879A6] stroke-[2]" />
              <div className="text-left sm:text-right text-[12.5px]">
                <div className="font-semibold text-[#102A52] leading-tight">
                  {formattedDate}
                </div>
                <div className="text-[#5879A6] text-[11px] font-medium leading-tight mt-0.5">
                  {formattedTime}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: 5 Statistics Cards (Real Dynamically Computed Stats) */}
          <StatsCards
            todayAppointmentsCount={statsCounts.todayAppointmentsCount}
            upcomingAppointmentsCount={statsCounts.upcomingAppointmentsCount}
            totalDoctorsCount={statsCounts.totalDoctorsCount}
            departmentsCount={statsCounts.departmentsCount}
            cancelledAppointmentsCount={statsCounts.cancelledAppointmentsCount}
            onCardClick={(statId) => {
              if (
                statId === 'today-appointments' ||
                statId === 'upcoming-appointments' ||
                statId === 'cancelled-appointments'
              ) {
                setActiveNav('appointments');
              } else if (statId === 'total-doctors') {
                setActiveNav('doctors');
              } else if (statId === 'departments') {
                setActiveNav('departments');
              }
            }}
          />

          {/* Section 3: Two Column Main Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Left Column: Charts + Appointments Table (approx 72%) */}
            <div className="lg:col-span-8 xl:col-span-8 space-y-6">
              {/* Row 1: Appointment Overview & Department Donut Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                <div className="h-full">
                  <AppointmentOverviewChart appointments={appointments} />
                </div>
                <div className="h-full">
                  <DepartmentDonutChart
                    appointments={appointments}
                    departmentsList={departments}
                    onViewAll={() => setActiveNav('departments')}
                  />
                </div>
              </div>

              {/* Row 2: Recent Appointments Table */}
              <div>
                <RecentAppointmentsTable
                  appointments={appointments}
                  onViewAll={() => setActiveNav('appointments')}
                  onNavigateAppointments={() => setActiveNav('appointments')}
                  onDeleteAppointment={(id) => setAppointments((prev) => prev.filter((a) => a.id !== id))}
                />
              </div>
            </div>

            {/* Right Column: Quick Actions + Recent Activity Panels (approx 28%) */}
            <div className="lg:col-span-4 xl:col-span-4 space-y-6">
              <QuickActionsPanel
                availableDepartments={departments.map((d) => d.name)}
                onActionClick={(actionKey) => {
                  if (actionKey === 'manage-appointments') {
                    setActiveNav('appointments');
                  } else if (actionKey === 'view-patients') {
                    setActiveNav('patients');
                  } else if (actionKey === 'manage-departments') {
                    setActiveNav('departments');
                  }
                }}
              />
              <RecentActivityPanel
                appointments={appointments}
                doctors={doctors}
                onViewAll={() => setActiveNav('appointments')}
              />
            </div>
          </div>
        </main>

        {/* 4. Bottom Footer */}
        <AdminFooter />
      </div>

      {/* Hospital Profile Modal from Sidebar Card */}
      {isHospitalProfileOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-[20px] border border-[#E1EDF9] shadow-2xl max-w-lg w-full overflow-hidden text-left animate-scaleUp">
            {/* Header Image */}
            <div className="h-40 w-full relative">
              <img
                src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80"
                alt="MediCare Main Campus"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102A52]/80 via-transparent to-transparent" />
              <button
                type="button"
                onClick={() => setIsHospitalProfileOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#102A52] flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-4 text-white">
                <div className="text-[18px] font-extrabold">MediCare Hospital</div>
                <div className="text-[12px] opacity-90">Accredited Tertiary Medical Center</div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-[13px]">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-[#E1EDF9]">
                <div className="bg-[#F8FBFF] p-3 rounded-[10px] border border-[#E1EDF9]">
                  <div className="text-[11px] text-[#5879A6]">Total Capacity</div>
                  <div className="text-[16px] font-extrabold text-[#102A52] mt-0.5">350 Beds</div>
                </div>
                <div className="bg-[#F8FBFF] p-3 rounded-[10px] border border-[#E1EDF9]">
                  <div className="text-[11px] text-[#5879A6]">Active Doctors</div>
                  <div className="text-[16px] font-extrabold text-[#102A52] mt-0.5">
                    {doctors.length > 0 ? `${doctors.length} Specialists` : 'Specialists'}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-[#2D3E50]">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0878F9] shrink-0" />
                  <span>142 Health Science Blvd, Medical City, MC 90210</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#0878F9] shrink-0" />
                  <span>+1 (800) 555-CARE (2273)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#0878F9] shrink-0" />
                  <span>contact@medicare-hospital.org</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#0878F9] shrink-0" />
                  <span>Emergency 24/7 • Outpatient 8:00 AM - 8:00 PM</span>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsHospitalProfileOpen(false)}
                  className="px-4 py-2 rounded-[8px] bg-[#0878F9] text-white text-[13px] font-semibold hover:bg-[#0768D6] cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
