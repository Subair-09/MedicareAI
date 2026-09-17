import React from 'react';

export const AdminFooter: React.FC = () => {
  return (
    <footer className="h-12 border-t border-[#E1EDF9] bg-white px-4 sm:px-6 lg:px-8 flex items-center justify-between text-[12px] text-[#5879A6] shrink-0 mt-8">
      <div className="flex items-center gap-2">
        <span className="font-medium">MediCare Hospital</span>
        <span>•</span>
        <span>Admin Dashboard</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 font-medium text-[#20B879]">
          <span className="w-2 h-2 rounded-full bg-[#20B879] animate-pulse" />
          <span>System Online</span>
        </div>
        <span className="text-[#94A3B8]">v1.0.0</span>
      </div>
    </footer>
  );
};
