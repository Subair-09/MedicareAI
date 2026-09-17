import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { AdminBrandPanel } from './AdminBrandPanel';
import { AdminLoginForm } from './AdminLoginForm';

interface AdminLoginPageProps {
  onSuccessLogin: (adminInfo: { email: string; name: string; role: string }) => void;
  onBackToLanding: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onSuccessLogin,
  onBackToLanding,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#F2F8FF] relative flex flex-col items-center justify-start lg:justify-center py-4 sm:py-6 px-3 sm:px-6 lg:px-8 selection:bg-[#0878F9]/15 overflow-y-auto">
      {/* Subtle Blue Atmospheric Gradients in Background */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#0878F9]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-[#3D99FE]/6 rounded-full blur-3xl pointer-events-none" />

      {/* Top Floating Return Link */}
      <div className="w-full max-w-[1440px] px-1 sm:px-3 mb-3 sm:mb-3.5 flex items-center justify-between z-10">
        <button
          type="button"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white text-[#102A52] hover:text-[#0878F9] border border-[#D9E9FA] text-[13px] font-semibold transition-all shadow-2xs group cursor-pointer"
          title="Return to Patient Portal"
        >
          <ArrowLeft className="w-4 h-4 text-[#0878F9] transition-transform group-hover:-translate-x-0.5" />
          <span>Return to MediCare Hospital (Patient View)</span>
        </button>

        <div className="text-[12.5px] font-semibold text-[#5577A6] hidden sm:block">
          Hospital Admin Authentication Portal
        </div>
      </div>

      {/* Main Centered Two-Column Container - Fully Displays on All Displays */}
      <div className="w-full max-w-[1440px] bg-white rounded-[20px] sm:rounded-[24px] border border-[#D9E9FA] shadow-[0_16px_50px_rgba(8,120,249,0.08)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative z-10 my-auto">
        
        {/* ====================================================
            LEFT SECTION: Soft Light-Blue Background (#EAF5FF)
            ==================================================== */}
        <div className="w-full h-full border-b lg:border-b-0 lg:border-r border-[#E2EEFC] flex flex-col">
          <AdminBrandPanel onBackToLanding={onBackToLanding} />
        </div>

        {/* ====================================================
            RIGHT SECTION: Pure White Background (#FFFFFF)
            ==================================================== */}
        <div className="w-full h-full bg-white flex flex-col">
          <AdminLoginForm
            onSuccessLogin={onSuccessLogin}
            onBackToLanding={onBackToLanding}
          />
        </div>

      </div>

      {/* Bottom Subtext */}
      <div className="mt-3.5 text-center text-[12px] text-[#7A93B4] font-medium z-10">
        MediCare Hospital Admin Portal • Authorized Healthcare Personnel Only • HIPAA Compliant
      </div>
    </div>
  );
};
