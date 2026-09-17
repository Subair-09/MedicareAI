import React from 'react';
import { Plus } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms, onOpenAdminLogin }) => {
  return (
    <footer className="w-full bg-[#102A52] text-white pt-16 pb-12 border-t border-[#1C3B6E]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#1E3E75] text-left">
          
          {/* Brand & Tagline (Col 1-4) */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#0878F9] flex items-center justify-center text-white shadow-sm">
                <Plus className="w-5 h-5 stroke-[3]" />
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[20px] font-bold tracking-tight text-white">MediCare</span>
                <span className="text-[12px] font-normal text-[#94A3B8] -mt-0.5">Hospital</span>
              </div>
            </div>
            <p className="text-[15px] font-medium text-[#94A3B8] max-w-sm">
              Your Health. Our Priority.
            </p>
            <p className="text-[13.5px] text-[#64748B] mt-3 leading-relaxed max-w-sm">
              Providing compassionate, world-class healthcare with intelligent AI appointment coordination.
            </p>
          </div>

          {/* Quick Links (Col 5-7) */}
          <div className="lg:col-span-3">
            <h4 className="text-[15px] font-bold text-white mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-[14px] text-[#94A3B8]">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#departments" className="hover:text-white transition-colors">
                  Departments
                </a>
              </li>
              <li>
                <a href="#doctors" className="hover:text-white transition-colors">
                  Doctors
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              {onOpenAdminLogin && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenAdminLogin}
                    className="text-[#38BDF8] hover:text-white font-semibold transition-colors text-left cursor-pointer"
                  >
                    Admin Portal Login →
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Support (Col 8-10) */}
          <div className="lg:col-span-3">
            <h4 className="text-[15px] font-bold text-white mb-4 tracking-wide">
              Support
            </h4>
            <ul className="space-y-2.5 text-[14px] text-[#94A3B8]">
              <li>
                <a href="#faqs" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <button 
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenTerms}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Follow Us (Col 11-12) */}
          <div className="lg:col-span-2">
            <h4 className="text-[15px] font-bold text-white mb-4 tracking-wide">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              {/* Facebook */}
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-[#18386B] hover:bg-[#0878F9] text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.582 9 4.615V8z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="#twitter"
                aria-label="Twitter / X"
                className="w-9 h-9 rounded-lg bg-[#18386B] hover:bg-[#0878F9] text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-[#18386B] hover:bg-[#0878F9] text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-[#18386B] hover:bg-[#0878F9] text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.761-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-[#18386B] hover:bg-[#0878F9] text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[13px] text-[#64748B]">
          <div>
            MediCare Hospital & Medical Research Center
          </div>
          <div className="mt-2 sm:mt-0 text-[#94A3B8]">
            © 2025 MediCare Hospital. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
