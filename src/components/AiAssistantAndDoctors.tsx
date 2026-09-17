import React from 'react';
import { 
  Bot, 
  Check, 
  ArrowRight, 
  Send, 
  Wifi, 
  Battery, 
  Sparkles,
  Signal,
  Calendar,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { DOCTORS } from '../data/hospitalData';
import { Doctor } from '../types';

interface AiAssistantAndDoctorsProps {
  onSelectDoctor: (doctor: Doctor) => void;
  onViewAllDoctors: () => void;
  onStartChatWithDoctor?: (doctorName: string) => void;
}

export const AiAssistantAndDoctors: React.FC<AiAssistantAndDoctorsProps> = ({
  onSelectDoctor,
  onViewAllDoctors,
  onStartChatWithDoctor
}) => {
  return (
    <section id="doctors" className="py-12 lg:py-16 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-stretch">
          
          {/* ==================================================
              LEFT: AI ASSISTANT FEATURE SECTION WITH PHONE MOCKUP
             ================================================== */}
          <div className="lg:col-span-5 bg-[#F5FAFF] border border-[#E2EEFC] rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shadow-xs">
            {/* Ambient subtle glow */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#EAF4FF] rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4FF] border border-[#D0E6FC] text-[#0878F9] text-[13px] font-semibold mb-4">
                <Bot className="w-3.5 h-3.5" />
                <span>AI Assistant</span>
              </div>

              {/* Heading */}
              <h2 className="text-[28px] sm:text-[34px] font-black text-[#102A52] leading-[1.18] tracking-tight mb-3">
                Your Personal <br />
                Health Assistant
              </h2>

              {/* Description */}
              <p className="text-[14.5px] text-[#64748B] leading-relaxed mb-6">
                Just type what you need, and our AI will handle the rest — from finding doctors to booking, rescheduling or cancelling appointments.
              </p>

              {/* Checklist Items */}
              <div className="space-y-2.5 mb-8">
                {[
                  "Natural conversations",
                  "Instant responses",
                  "Accurate information",
                  "Available 24/7"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2.5 text-[14px] font-semibold text-[#102A52]">
                    <div className="w-5 h-5 rounded-full bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* REALISTIC SMARTPHONE MOCKUP */}
            <div className="relative z-10 mx-auto w-full max-w-[310px] mt-2">
              <div className="bg-[#102A52] p-2.5 rounded-[36px] shadow-xl shadow-[#0878F9]/10 border-2 border-[#D0E4FC]">
                {/* Screen glass */}
                <div className="bg-white rounded-[28px] overflow-hidden flex flex-col h-[400px] border border-[#E2E8F0]">
                  
                  {/* Phone Status Bar */}
                  <div className="bg-[#F8FAFC] px-4 pt-2.5 pb-1 flex items-center justify-between text-[10px] font-semibold text-[#64748B] border-b border-[#F1F5F9]">
                    <span>9:41</span>
                    <div className="w-16 h-3.5 bg-[#0F172A] rounded-full mx-auto" />
                    <div className="flex items-center gap-1.5 text-[#64748B]">
                      <Signal className="w-2.5 h-2.5" />
                      <Wifi className="w-2.5 h-2.5" />
                      <Battery className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Top Bar inside app */}
                  <div className="bg-white px-3 py-2 border-b border-[#EAF2FC] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0878F9] text-white flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-left leading-none">
                        <div className="text-[11.5px] font-bold text-[#102A52]">MediCare AI</div>
                        <span className="text-[9.5px] text-[#20B879] font-medium">Online</span>
                      </div>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 text-[#0878F9]" />
                  </div>

                  {/* Chat Assistant Live Interface */}
                  <div className="flex-1 p-4 flex flex-col justify-between text-[11px] leading-snug bg-gradient-to-b from-[#FAFCFF] to-white text-center">
                    <div className="my-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center mx-auto shadow-xs border border-[#D0E6FC]">
                        <Bot className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-[#102A52]">
                          MediCare Assistant
                        </h4>
                        <p className="text-[10.5px] text-[#64748B] mt-0.5">
                          Online and ready to assist you
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4FF] text-[#0878F9] text-[10px] font-semibold">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Book Consultations Instantly</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onStartChatWithDoctor?.('')}
                      className="w-full py-2 px-3 rounded-xl bg-[#0878F9] hover:bg-[#0768D6] text-white text-[11.5px] font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Start Chat with AI</span>
                    </button>
                  </div>

                  {/* Input bar inside phone */}
                  <div 
                    onClick={() => onStartChatWithDoctor?.('')}
                    className="p-2 border-t border-[#F1F5F9] bg-white flex items-center gap-1.5 cursor-pointer"
                  >
                    <div className="flex-1 bg-[#F8FAFC] text-[10.5px] text-[#94A3B8] px-2.5 py-1.5 rounded-full border border-[#E2E8F0] text-left">
                      Ask anything...
                    </div>
                    <div className="w-6 h-6 rounded-full bg-[#0878F9] text-white flex items-center justify-center shrink-0">
                      <Send className="w-3 h-3 -ml-0.5" />
                    </div>
                  </div>

                  {/* Home indicator bar */}
                  <div className="pb-1 pt-0.5 flex justify-center bg-white">
                    <div className="w-24 h-1 bg-[#CBD5E1] rounded-full" />
                  </div>

                </div>
              </div>
            </div>

          </div>

          {/* ==================================================
              RIGHT: DOCTORS SECTION (3 CARDS)
             ================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {/* Header with pill, title, and "View All Doctors →" */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4FF] border border-[#D0E6FC] text-[#0878F9] text-[13px] font-semibold mb-2">
                    <span>Our Doctors</span>
                  </div>
                  <h2 className="text-[28px] sm:text-[34px] font-black text-[#102A52] leading-tight tracking-tight">
                    Meet Our Expert Doctors
                  </h2>
                </div>

                <button
                  onClick={onViewAllDoctors}
                  className="inline-flex items-center gap-1.5 text-[14.5px] font-bold text-[#0878F9] hover:text-[#0768D6] transition-colors cursor-pointer group shrink-0"
                >
                  <span>View All Doctors</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              <p className="text-[15px] text-[#64748B] max-w-xl text-left">
                Our team of experienced and qualified doctors are here to provide you with the best care.
              </p>
            </div>

            {/* 3 Doctor Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {DOCTORS.map((doctor) => (
                <div
                  key={doctor.id}
                  className="group bg-white rounded-2xl border border-[#E2EEFC] hover:border-[#BFDBFE] overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-[#0878F9]/8 flex flex-col justify-between text-left"
                >
                  {/* Doctor Image Container */}
                  <div className="relative aspect-square w-full bg-[#F5FAFF] overflow-hidden">
                    <img
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback portrait
                        e.currentTarget.src = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&h=600&q=80";
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[11px] font-bold text-[#102A52] shadow-xs border border-[#E2EEFC]">
                      ★ {doctor.rating}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-[17px] font-bold text-[#102A52] leading-snug group-hover:text-[#0878F9] transition-colors">
                        {doctor.name}
                      </h3>
                      <p className="text-[13.5px] font-medium text-[#64748B] mb-1">
                        {doctor.specialty}
                      </p>
                      <p className="text-[12px] text-[#94A3B8]">
                        {doctor.experience}
                      </p>
                    </div>

                    {/* View Profile Action Link */}
                    <div className="pt-4 mt-4 border-t border-[#F1F5F9] flex items-center justify-between">
                      <button
                        onClick={() => onSelectDoctor(doctor)}
                        className="inline-flex items-center gap-1 text-[13.5px] font-bold text-[#0878F9] hover:text-[#0768D6] transition-colors cursor-pointer group-hover:underline"
                      >
                        <span>View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
