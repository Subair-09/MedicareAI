import React from 'react';
import {
  Home,
  Calendar,
  Users,
  LayoutGrid,
  UsersRound,
  Clock,
  Sparkles,
  BookOpen,
  BarChart3,
  Bell,
  Globe,
  MessageSquare,
  Settings,
  ArrowRight,
  X
} from 'lucide-react';
import { HospitalCrossLogo } from './HospitalCrossLogo';

export type NavItemKey =
  | 'dashboard'
  | 'appointments'
  | 'doctors'
  | 'departments'
  | 'patients'
  | 'schedules'
  | 'ai-assistant'
  | 'knowledge-base'
  | 'analytics'
  | 'notifications'
  | 'website-content'
  | 'support'
  | 'settings';

interface AdminSidebarProps {
  activeItem: NavItemKey;
  onSelectItem: (item: NavItemKey) => void;
  onViewHospitalProfile?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeItem,
  onSelectItem,
  onViewHospitalProfile,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { key: 'dashboard' as NavItemKey, label: 'Dashboard', icon: Home },
    { key: 'appointments' as NavItemKey, label: 'Appointments', icon: Calendar },
    { key: 'doctors' as NavItemKey, label: 'Doctors', icon: Users },
    { key: 'departments' as NavItemKey, label: 'Departments', icon: LayoutGrid },
    { key: 'patients' as NavItemKey, label: 'Patients', icon: UsersRound },
    { key: 'schedules' as NavItemKey, label: 'Schedules', icon: Clock },
    { key: 'ai-assistant' as NavItemKey, label: 'AI Assistant', icon: Sparkles },
    { key: 'knowledge-base' as NavItemKey, label: 'Knowledge Base', icon: BookOpen },
    { key: 'analytics' as NavItemKey, label: 'Analytics', icon: BarChart3 },
    {
      key: 'notifications' as NavItemKey,
      label: 'Notifications',
      icon: Bell,
      badge: 3,
    },
    { key: 'website-content' as NavItemKey, label: 'Website & Content', icon: Globe },
    {
      key: 'support' as NavItemKey,
      label: 'Support & Messages',
      icon: MessageSquare,
      badge: 2,
    },
    { key: 'settings' as NavItemKey, label: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="w-[258px] h-full bg-white flex flex-col justify-between select-none overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1">
      {/* Top Section: Logo + Navigation List */}
      <div className="pt-6 px-4">
        {/* Logo and Close button (for mobile) */}
        <div className="flex items-center justify-between pl-2 pr-1 mb-6">
          <HospitalCrossLogo size="md" />
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#5879A6] hover:bg-[#F0F5FA] transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation items list */}
        <nav className="space-y-0.5" aria-label="Admin Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onSelectItem(item.key);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full h-[40px] px-3.5 rounded-[10px] flex items-center justify-between text-[13.5px] transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E5F1FF] text-[#0878F9] font-semibold'
                    : 'text-[#2D3E50] hover:text-[#0878F9] hover:bg-[#F6FAFF] font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-[19px] h-[19px] stroke-[2] ${
                      isActive ? 'text-[#0878F9]' : 'text-[#64748B]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="w-5 h-5 rounded-full bg-[#EF4444] text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Promo Hospital Card */}
      <div className="p-4 pt-3">
        <div className="w-full bg-[#F8FBFF] border border-[#E1EDF9] rounded-[14px] overflow-hidden shadow-2xs">
          {/* Hospital Building Image */}
          <div className="w-full h-[96px] relative overflow-hidden bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80"
              alt="MediCare Modern Hospital Campus"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Soft gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>

          {/* Card Text Content */}
          <div className="p-3.5 text-left">
            {activeItem === 'knowledge-base' ? (
              <>
                <div className="text-[13px] font-bold leading-snug">
                  <span className="text-[#102A52] block">Build a Smarter</span>
                  <span className="text-[#0878F9]">Healthcare Experience</span>
                </div>
                <p className="text-[11px] text-[#5879A6] font-medium mt-1 mb-3 leading-relaxed">
                  Upload your hospital knowledge and help your team get instant answers.
                </p>
                <button
                  type="button"
                  onClick={onViewHospitalProfile}
                  className="w-full h-[34px] rounded-[8px] bg-[#0878F9] hover:bg-[#0768D6] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-[0.99]"
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </>
            ) : (
              <>
                <div className="text-[13px] font-bold leading-snug">
                  <span className="text-[#102A52] block">Better Healthcare</span>
                  <span className="text-[#0878F9]">Starts with the Right Team</span>
                </div>
                <p className="text-[11px] text-[#5879A6] font-medium mt-1 mb-3 leading-relaxed">
                  Manage your doctors, schedules and departments all in one place.
                </p>
                <button
                  type="button"
                  onClick={onViewHospitalProfile}
                  className="w-full h-[34px] rounded-[8px] bg-[#0878F9] hover:bg-[#0768D6] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-[0.99]"
                >
                  <span>View Help</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Fixed width 258px */}
      <aside className="hidden lg:block w-[258px] shrink-0 h-screen sticky top-0 border-r border-[#E1EDF9] z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 lg:hidden w-[258px] bg-white border-r border-[#E1EDF9] shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
