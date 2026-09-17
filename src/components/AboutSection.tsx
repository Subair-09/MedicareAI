import React from 'react';
import { Award, ShieldCheck, HeartHandshake, Sparkles, Building, Users } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 lg:py-20 bg-white border-t border-[#EAF2FC]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4FF] border border-[#D0E6FC] text-[#0878F9] text-[13px] font-semibold mb-3">
              <Building className="w-3.5 h-3.5" />
              <span>About MediCare Hospital</span>
            </div>
            <h2 className="text-[32px] sm:text-[38px] font-black text-[#102A52] tracking-tight leading-tight mb-4">
              Modern Clinical Excellence Meets Conversational AI
            </h2>
            <p className="text-[16px] text-[#64748B] leading-relaxed mb-4">
              Founded on the belief that healthcare access should never be hindered by complex forms, long phone hold times, or confusing portals, MediCare Hospital has pioneered patient-first care in our region.
            </p>
            <p className="text-[15px] text-[#64748B] leading-relaxed mb-6">
              Our state-of-the-art medical center unites board-certified physicians across 12 specialized departments with an intelligent, conversational booking engine. Patients can secure appointments in seconds — day or night.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#F5FAFF] border border-[#E2EEFC]">
                <ShieldCheck className="w-6 h-6 text-[#20B879] mb-2" />
                <h4 className="text-[14px] font-bold text-[#102A52]">JCI Accredited</h4>
                <p className="text-[12px] text-[#64748B] mt-0.5">Top safety and quality standards</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5FAFF] border border-[#E2EEFC]">
                <HeartHandshake className="w-6 h-6 text-[#0878F9] mb-2" />
                <h4 className="text-[14px] font-bold text-[#102A52]">Patient-First</h4>
                <p className="text-[12px] text-[#64748B] mt-0.5">Compassionate bedside care</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F5FAFF] border border-[#E2EEFC]">
                <Award className="w-6 h-6 text-[#8B5CF6] mb-2" />
                <h4 className="text-[14px] font-bold text-[#102A52]">Ranked #1</h4>
                <p className="text-[12px] text-[#64748B] mt-0.5">Regional Healthcare Excellence</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#E2EEFC]">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
                alt="MediCare Modern Hospital interior clinic"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102A52]/80 via-[#102A52]/20 to-transparent flex items-end p-6 sm:p-8">
                <div className="text-white">
                  <div className="text-[18px] font-bold mb-1">MediCare Health Campus</div>
                  <div className="text-[13px] text-[#CBD5E1]">24/7 Acute Care • 50+ In-House Specialists • Advanced Diagnostics</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
