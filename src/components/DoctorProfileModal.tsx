import React from 'react';
import { X, Calendar, Clock, Award, Star, CheckCircle, MessageSquare } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookWithDoctor: (doctorName: string) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  onClose,
  onBookWithDoctor
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#102A52]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E2EEFC] overflow-hidden flex flex-col max-h-[92dvh] animate-in zoom-in-95 duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative bg-[#F5FAFF] p-4 sm:p-6 border-b border-[#EAF2FC] flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-5 text-center sm:text-left">
          <img
            src={doctor.imageUrl}
            alt={doctor.name}
            referrerPolicy="no-referrer"
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1 text-[12px] bg-[#EAF4FF] text-[#0878F9] px-2.5 py-0.5 rounded-full font-semibold mb-1">
              {doctor.specialty}
            </div>
            <h3 className="text-[18px] sm:text-[20px] font-bold text-[#102A52] leading-tight">
              {doctor.name}
            </h3>
            <p className="text-[12.5px] sm:text-[13px] text-[#64748B] mt-0.5">
              {doctor.experience}
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-[12px] font-bold text-[#102A52] mt-1.5">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <span>{doctor.rating} / 5.0</span>
              <span className="text-[#94A3B8] font-normal">• Verified Specialist</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-[#94A3B8] hover:text-[#102A52] hover:bg-[#EAF2FC] rounded-full transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto text-[13.5px] sm:text-[14px]">
          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              Education & Credentials
            </h4>
            <p className="text-[#102A52] font-medium flex items-center gap-2">
              <Award className="w-4 h-4 text-[#0878F9]" />
              {doctor.education || "Board Certified Specialist in Clinical Healthcare"}
            </p>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8] mb-1">
              Clinical Background
            </h4>
            <p className="text-[#475569] leading-relaxed">
              {doctor.bio || "Dedicated to evidence-based healthcare delivery, patient comfort, and continuous preventative medicine."}
            </p>
          </div>

          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-wider text-[#94A3B8] mb-2">
              Available Clinic Days
            </h4>
            <div className="flex flex-wrap gap-2">
              {(doctor.availableDays || ["Monday", "Wednesday", "Friday"]).map((day, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5FAFF] border border-[#E2EEFC] text-[13px] text-[#102A52] font-semibold"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#0878F9]" />
                  {day}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#EAF4FF] rounded-2xl p-4 border border-[#D5E8FD] text-[13px] text-[#102A52] flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-[#0878F9] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Fast AI Booking:</span> You can book an appointment with {doctor.name} directly via our AI assistant without needing a password or account.
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-5 bg-[#F8FAFC] border-t border-[#EAF2FC] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#64748B] hover:text-[#102A52] hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onBookWithDoctor(doctor.name);
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0878F9] hover:bg-[#0768D6] text-white text-[14px] font-bold shadow-sm shadow-[#0878F9]/20 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Book with {doctor.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
