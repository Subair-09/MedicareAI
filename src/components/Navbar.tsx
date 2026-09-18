import React, { useState } from 'react';
import { MessageSquare, Plus, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenChat: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenChat,
  activeSection = 'home',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#EAF2FC] transition-all">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[68px] flex items-center justify-between">
        {/* Left: Brand Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-[#0878F9] flex items-center justify-center text-white shadow-sm shadow-[#0878F9]/20 transition-transform group-hover:scale-105">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[20px] font-bold text-[#102A52] tracking-tight">MediCare</span>
            <span className="text-[12px] font-medium text-[#64748B] -mt-0.5">Hospital</span>
          </div>
        </a>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          <a
            href="#home"
            className={`text-[15px] font-medium transition-colors relative py-1 ${
              activeSection === 'home' ? 'text-[#0878F9]' : 'text-[#334155] hover:text-[#0878F9]'
            }`}
          >
            Home
            {activeSection === 'home' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#0878F9] rounded-full" />
            )}
          </a>
          <a
            href="#departments"
            className="text-[15px] font-medium text-[#334155] hover:text-[#0878F9] transition-colors py-1"
          >
            Departments
          </a>
          <a
            href="#doctors"
            className="text-[15px] font-medium text-[#334155] hover:text-[#0878F9] transition-colors py-1"
          >
            Doctors
          </a>
          <a
            href="#about"
            className="text-[15px] font-medium text-[#334155] hover:text-[#0878F9] transition-colors py-1"
          >
            About
          </a>
          <a
            href="#faqs"
            className="text-[15px] font-medium text-[#334155] hover:text-[#0878F9] transition-colors py-1"
          >
            FAQs
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0878F9] hover:bg-[#0768D6] text-white text-[14.5px] font-semibold shadow-sm shadow-[#0878F9]/25 hover:shadow-md hover:shadow-[#0878F9]/30 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <MessageSquare className="w-4 h-4 fill-white/10" />
            <span>Chat with AI</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={onOpenChat}
            className="px-3 py-1.5 rounded-full bg-[#0878F9] text-white text-[12.5px] font-semibold flex items-center gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="p-2 text-[#102A52] hover:bg-[#F5FAFF] rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#EAF2FC] px-5 py-4 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <a
            href="#home"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[15px] font-medium text-[#0878F9] py-1.5"
          >
            Home
          </a>
          <a
            href="#departments"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[15px] font-medium text-[#334155] hover:text-[#0878F9] py-1.5"
          >
            Departments
          </a>
          <a
            href="#doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[15px] font-medium text-[#334155] hover:text-[#0878F9] py-1.5"
          >
            Doctors
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[15px] font-medium text-[#334155] hover:text-[#0878F9] py-1.5"
          >
            About
          </a>
          <a
            href="#faqs"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[15px] font-medium text-[#334155] hover:text-[#0878F9] py-1.5"
          >
            FAQs
          </a>
          <div className="pt-3 border-t border-[#EAF2FC] space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="w-full py-2.5 rounded-full bg-[#0878F9] text-white text-center text-[15px] font-semibold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat with AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
