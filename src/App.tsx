import React, { useState, useEffect } from 'react';
import { AIChatPage } from './components/AIChatPage';
import { LandingPage } from './components/LandingPage';
import { AdminLoginPage } from './components/admin/AdminLoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { api } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState<
    | 'admin-login'
    | 'admin-dashboard'
    | 'admin-appointments'
    | 'admin-doctors'
    | 'admin-departments'
    | 'admin-patients'
    | 'admin-schedules'
    | 'admin-knowledge-base'
    | 'chat'
    | 'landing'
  >(() => {
    const hash = window.location.hash;
    if (hash === '#chat') return 'chat';
    if (hash === '#landing' || hash === '#home') return 'landing';
    if (hash === '#admin-dashboard') return 'admin-dashboard';
    if (hash === '#admin-appointments') return 'admin-appointments';
    if (hash === '#admin-doctors') return 'admin-doctors';
    if (hash === '#admin-departments') return 'admin-departments';
    if (hash === '#admin-patients') return 'admin-patients';
    if (hash === '#admin-schedules') return 'admin-schedules';
    if (hash === '#admin-knowledge-base') return 'admin-knowledge-base';
    if (hash === '#admin-login' || hash === '#admin') return 'admin-login';
    // Default view when app is loaded for the first time
    return 'landing';
  });

  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: string; token?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('medicare_admin_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email?.toLowerCase() === 'nuddywale@gmail.com') {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return null;
  });

  useEffect(() => {
    const syncViewWithHash = () => {
      const hash = window.location.hash;
      if (hash === '#chat') {
        setCurrentView('chat');
      } else if (hash === '#landing' || hash === '#home' || !hash || hash === '#') {
        setCurrentView('landing');
      } else if (hash === '#admin-dashboard') {
        setCurrentView('admin-dashboard');
      } else if (hash === '#admin-appointments' || hash === '#appointments') {
        setCurrentView('admin-appointments');
      } else if (hash === '#admin-doctors' || hash === '#doctors') {
        setCurrentView('admin-doctors');
      } else if (hash === '#admin-departments' || hash === '#departments') {
        setCurrentView('admin-departments');
      } else if (hash === '#admin-patients' || hash === '#patients') {
        setCurrentView('admin-patients');
      } else if (hash === '#admin-schedules' || hash === '#schedules' || hash === '#schedule') {
        setCurrentView('admin-schedules');
      } else if (
        hash === '#admin-knowledge-base' ||
        hash === '#knowledge-base' ||
        hash === '#knowledge'
      ) {
        setCurrentView('admin-knowledge-base');
      } else if (hash === '#admin' || hash === '#admin-login') {
        setCurrentView('admin-login');
      }
    };

    syncViewWithHash();
    window.addEventListener('hashchange', syncViewWithHash);
    return () => window.removeEventListener('hashchange', syncViewWithHash);
  }, []);

  const handleSuccessLogin = (info: { email: string; name: string; role: string }) => {
    setAdminUser(info);
    try {
      localStorage.setItem('medicare_admin_session', JSON.stringify(info));
    } catch (e) {}
    setCurrentView('admin-knowledge-base');
    window.location.hash = '#admin-knowledge-base';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOutAdmin = () => {
    if (adminUser?.token) {
      api.adminLogout(adminUser.token);
    }
    try {
      localStorage.removeItem('medicare_admin_session');
    } catch (e) {}
    setAdminUser(null);
    setCurrentView('admin-login');
    window.location.hash = '#admin-login';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChatPage = (_initialPrompt?: string, _doctorName?: string) => {
    setCurrentView('chat');
    window.location.hash = '#chat';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    window.location.hash = '#landing';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdminLogin = () => {
    setCurrentView('admin-login');
    window.location.hash = '#admin-login';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'admin-login') {
    return (
      <AdminLoginPage
        onSuccessLogin={handleSuccessLogin}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  if (
    currentView === 'admin-dashboard' ||
    currentView === 'admin-appointments' ||
    currentView === 'admin-doctors' ||
    currentView === 'admin-departments' ||
    currentView === 'admin-patients' ||
    currentView === 'admin-schedules' ||
    currentView === 'admin-knowledge-base'
  ) {
    // Strictly require authorized administrator session
    if (!adminUser || adminUser.email.toLowerCase() !== 'nuddywale@gmail.com') {
      return (
        <AdminLoginPage
          onSuccessLogin={handleSuccessLogin}
          onBackToLanding={handleBackToLanding}
        />
      );
    }

    return (
      <AdminDashboard
        initialNav={
          currentView === 'admin-dashboard'
            ? 'dashboard'
            : currentView === 'admin-doctors'
            ? 'doctors'
            : currentView === 'admin-departments'
            ? 'departments'
            : currentView === 'admin-patients'
            ? 'patients'
            : currentView === 'admin-schedules'
            ? 'schedules'
            : currentView === 'admin-knowledge-base'
            ? 'knowledge-base'
            : 'appointments'
        }
        adminUser={adminUser}
        onSignOut={handleSignOutAdmin}
        onGoToPatientPortal={handleBackToLanding}
      />
    );
  }

  if (currentView === 'chat') {
    return (
      <AIChatPage
        onBackToLanding={handleBackToLanding}
        onOpenAdminLogin={handleOpenAdminLogin}
      />
    );
  }

  return (
    <LandingPage
      onOpenChatPage={handleOpenChatPage}
      onOpenAdminLogin={handleOpenAdminLogin}
    />
  );
}


