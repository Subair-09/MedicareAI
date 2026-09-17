import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

export interface HeaderNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread?: boolean;
}

interface AdminHeaderProps {
  adminName?: string;
  adminRole?: string;
  adminEmail?: string;
  searchPlaceholder?: string;
  onOpenSearch?: () => void;
  onSignOut?: () => void;
  onGoToPatientPortal?: () => void;
  onToggleMobileMenu?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  notifications?: HeaderNotification[];
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminName = 'Adewale',
  adminRole = 'Super Administrator',
  adminEmail = 'nuddywale@gmail.com',
  searchPlaceholder = 'Search departments, doctors, appointments...',
  onOpenSearch,
  onSignOut,
  onGoToPatientPortal,
  onToggleMobileMenu,
  searchQuery,
  onSearchChange,
  notifications = [],
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="h-[74px] bg-white border-b border-[#E1EDF9] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 shrink-0">
      {/* Left Area: Mobile Menu Toggle + Search Bar */}
      <div className="flex items-center gap-3 w-full max-w-[560px]">
        {/* Mobile Hamburger Menu button */}
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-[#5879A6] hover:bg-[#F0F5FA] transition-colors shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Global Search Bar */}
        <div className="relative w-full">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none">
            <Search className="w-4.5 h-4.5 stroke-[2]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={onOpenSearch}
            placeholder={searchPlaceholder}
            className="w-full h-[44px] pl-10 pr-18 bg-white border border-[#E1EDF9] rounded-[12px] text-[13.5px] text-[#102A52] placeholder-[#94A3B8] focus:outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/10 transition-all shadow-2xs"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center">
            <span className="text-[11px] font-semibold text-[#64748B] bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 rounded-[6px]">
              Ctrl + K
            </span>
          </div>
        </div>
      </div>

      {/* Right Area: Notification Bell & Admin Profile */}
      <div className="flex items-center gap-4 sm:gap-5 shrink-0 ml-3">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 rounded-full bg-[#EAF4FF] hover:bg-[#DDEEFE] text-[#0878F9] flex items-center justify-center relative transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 stroke-[2]" />
            {/* Real Unread Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-[#EF4444] text-white text-[10.5px] font-bold flex items-center justify-center border-2 border-white shadow-2xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-92 bg-white rounded-[14px] border border-[#E1EDF9] shadow-[0_12px_36px_rgba(20,80,140,0.12)] p-4 z-50 text-left animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1EDF9]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[14px] text-[#102A52]">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-[#FFECEF] text-[#EF4444] text-[11px] font-bold">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    type="button"
                    className="text-[12px] font-semibold text-[#0878F9] hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-[#F1F5F9] max-h-72 overflow-y-auto mt-2">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif.id} className="py-2.5 hover:bg-[#F8FBFF] px-2 rounded-lg transition-colors">
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-semibold text-[#102A52]">{notif.title}</p>
                        <span className="text-[11px] text-[#94A3B8]">{notif.time}</span>
                      </div>
                      <p className="text-[12px] text-[#5879A6] mt-0.5">{notif.detail}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-[12.5px] text-[#5879A6]">
                    No new notifications.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown Trigger */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-[#F6FAFF] transition-colors cursor-pointer text-left"
          >
            {/* Admin Avatar */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&h=160&q=80"
                alt="Hospital Administrator Profile"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-[#E1EDF9]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#20B879] border-2 border-white" />
            </div>

            {/* Admin Info */}
            <div className="hidden sm:block">
              <div className="text-[13.5px] font-bold text-[#102A52] leading-tight">
                {adminName}
              </div>
              <div className="text-[11.5px] text-[#5879A6] font-normal leading-tight mt-0.5">
                {adminRole}
              </div>
            </div>

            {/* Chevron Icon */}
            <ChevronDown className={`w-4 h-4 text-[#5879A6] transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Menu Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white rounded-[14px] border border-[#E1EDF9] shadow-[0_12px_36px_rgba(20,80,140,0.12)] p-2 z-50 text-left animate-fadeIn">
              <div className="p-3 border-b border-[#E1EDF9]">
                <div className="font-bold text-[13.5px] text-[#102A52]">{adminName}</div>
                <div className="text-[11.5px] text-[#5879A6] font-medium break-all">{adminEmail}</div>
                <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full bg-[#EAF4FF] text-[#0878F9] text-[10.5px] font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  Super Administrator
                </span>
              </div>

              <div className="py-1.5 space-y-0.5">
                {onGoToPatientPortal && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      onGoToPatientPortal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-semibold text-[#102A52] hover:bg-[#EAF4FF] hover:text-[#0878F9] rounded-lg transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-[#0878F9]" />
                    <span>View Patient Portal</span>
                  </button>
                )}

                {onSignOut && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
