import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  Calendar, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  Send, 
  Bot, 
  ArrowRight,
  User
} from 'lucide-react';
import { HERO_DOCTOR_IMAGE } from '../data/hospitalData';

interface HeroProps {
  onStartChat: (initialPrompt?: string) => void;
  onExploreDepartments: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartChat, onExploreDepartments }) => {
  const [interactiveInput, setInteractiveInput] = useState('');

  const handleHeroSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (interactiveInput.trim()) {
      onStartChat(interactiveInput.trim());
      setInteractiveInput('');
    } else {
      onStartChat();
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 bg-gradient-to-b from-[#F5FAFF] via-[#FAFCFF] to-white">
      {/* Soft ambient background medical glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#EAF4FF] rounded-full blur-3xl -z-10 opacity-70 pointer-events-none" />
      <div className="absolute top-10 right-10 w-[350px] h-[350px] bg-[#D6EAFE]/40 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Content */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-start text-left z-10">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF4FF] border border-[#D0E6FC] text-[#0878F9] text-[13.5px] font-semibold mb-6 shadow-xs">
              <Bot className="w-4 h-4 text-[#0878F9]" />
              <span>AI-Powered Healthcare</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-[38px] sm:text-[48px] lg:text-[54px] xl:text-[58px] font-black text-[#102A52] leading-[1.12] tracking-tight mb-5">
              Book Your Hospital <br className="hidden sm:block" />
              Appointment with AI
            </h1>

            {/* Description */}
            <p className="text-[16px] sm:text-[18px] text-[#475569] leading-relaxed mb-8 max-w-[560px]">
              Chat with our intelligent assistant to book, reschedule, or cancel appointments — anytime, anywhere. Fast, simple and stress-free.
            </p>

            {/* 4 Feature Items Horizontally with Thin Dividers */}
            <div className="w-full max-w-[560px] grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-2 pt-2 pb-8 border-y border-[#EAF2FC] mb-8">
              {/* Item 1 */}
              <div className="flex flex-col items-start sm:pr-2">
                <div className="w-8 h-8 rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0878F9] mb-2">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-semibold text-[#102A52] leading-snug">
                  Book Appointments
                </span>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col items-start sm:border-l sm:border-[#EAF2FC] sm:pl-3 sm:pr-2">
                <div className="w-8 h-8 rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0878F9] mb-2">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-semibold text-[#102A52] leading-snug">
                  Reschedule or Cancel
                </span>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col items-start sm:border-l sm:border-[#EAF2FC] sm:pl-3 sm:pr-2">
                <div className="w-8 h-8 rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0878F9] mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-semibold text-[#102A52] leading-snug">
                  Get Instant Responses
                </span>
              </div>

              {/* Item 4 */}
              <div className="flex flex-col items-start sm:border-l sm:border-[#EAF2FC] sm:pl-3">
                <div className="w-8 h-8 rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#0878F9] mb-2">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-[13px] font-semibold text-[#102A52] leading-snug">
                  24/7 Support
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-6">
              <button
                onClick={() => onStartChat()}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#0878F9] hover:bg-[#0768D6] text-white text-[15.5px] font-bold shadow-md shadow-[#0878F9]/25 hover:shadow-lg hover:shadow-[#0878F9]/30 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageSquare className="w-4 h-4 fill-white/10" />
                <span>Start Chatting Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreDepartments}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white hover:bg-[#F5FAFF] border border-[#0878F9] text-[#0878F9] text-[15.5px] font-bold transition-all cursor-pointer hover:shadow-sm"
              >
                Explore Departments
              </button>
            </div>

            {/* Trust Indicator */}
            <div className="inline-flex items-center gap-2 text-[14px] text-[#475569] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#20B879] fill-[#20B879]/15 stroke-[2.5]" />
              <span>Trusted by thousands of patients</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Doctor Image & Floating AI Chat Card */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex items-center justify-center mt-6 lg:mt-0">
            {/* Background circular gradient/glow behind doctor */}
            <div className="absolute w-[440px] h-[440px] sm:w-[500px] sm:h-[500px] bg-radial from-[#D9ECFF] via-[#EAF4FF]/70 to-transparent rounded-full -z-10 pointer-events-none" />

            {/* Doctor Photography (Blended smoothly into light blue/white bg) */}
            <div className="relative w-full max-w-[460px] lg:max-w-[500px] flex items-end justify-center">
              <div className="relative overflow-hidden rounded-b-3xl">
                <img
                  src={HERO_DOCTOR_IMAGE}
                  alt="Dr. MediCare smiling African female physician wearing white coat and stethoscope"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[580px] object-cover object-top filter contrast-[1.03] brightness-[1.02] drop-shadow-sm select-none"
                  onError={(e) => {
                    // Fallback to alternative high quality medical doctor image if needed
                    e.currentTarget.src = "https://images.unsplash.com/photo-1594824813689-e58f0003b879?auto=format&fit=crop&w=1200&q=85";
                  }}
                />
                {/* Bottom subtle blend mask */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none" />
              </div>

              {/* OVERLAID FLOATING AI CHAT CARD (Matching exact prompt & reference image) */}
              <div className="absolute -bottom-6 right-0 sm:right-2 md:-right-4 lg:-right-4 w-[280px] sm:w-[310px] bg-white rounded-2xl p-4 shadow-xl shadow-[#102A52]/10 border border-[#E2EEFC] z-20 transition-all hover:shadow-2xl">
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0878F9] flex items-center justify-center text-white">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[12.5px] font-bold text-[#102A52] leading-tight">MediCare AI</div>
                      <div className="text-[10.5px] text-[#20B879] flex items-center gap-1 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#20B879] animate-pulse" />
                        Online
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] bg-[#EAF4FF] text-[#0878F9] px-2 py-0.5 rounded-full font-medium">
                    Assistant
                  </span>
                </div>

                {/* Chat Messages Stream */}
                <div className="space-y-2.5 text-[11.5px] leading-relaxed max-h-[300px] overflow-y-auto pr-1">
                  {/* AI Greeting */}
                  <div className="flex items-start gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#0878F9] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3 h-3" />
                    </div>
                    <div className="bg-[#102A52] text-white rounded-2xl rounded-tl-xs px-3 py-2 text-left shadow-xs">
                      Hi! 👋<br />How can I help you today?
                    </div>
                  </div>

                  {/* Patient Message 1 */}
                  <div className="flex justify-end">
                    <div className="bg-[#EAF4FF] text-[#102A52] rounded-2xl rounded-tr-xs px-3 py-2 text-right font-medium max-w-[85%]">
                      I’d like to book an appointment with a dermatologist.
                    </div>
                  </div>

                  {/* AI Message 2 */}
                  <div className="flex items-start gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#0878F9] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3 h-3" />
                    </div>
                    <div className="bg-[#F5FAFF] border border-[#E2EEFC] text-[#132B52] rounded-2xl rounded-tl-xs px-3 py-2 text-left">
                      Great! We have Dr. Sarah available on Monday at 10:00 AM, 11:30 AM and 2:00 PM. Which time works for you?
                    </div>
                  </div>

                  {/* Patient Message 2 */}
                  <div className="flex justify-end">
                    <div className="bg-[#0878F9] text-white rounded-2xl rounded-tr-xs px-3 py-1.5 text-right font-medium">
                      11:30 AM, please.
                    </div>
                  </div>

                  {/* Confirmation Message with Green Check */}
                  <div className="flex items-start gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#20B879] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-[#F0FDF4] border border-[#DCFCE7] text-[#166534] rounded-2xl rounded-tl-xs px-3 py-2 text-left text-[11px]">
                      Your appointment with Dr. Sarah is booked for Monday at 11:30 AM.<br />
                      <span className="font-bold text-[#15803D]">Your appointment ID is MC-20481.</span>
                    </div>
                  </div>
                </div>

                {/* Input Bar */}
                <form onSubmit={handleHeroSend} className="mt-3 pt-2.5 border-t border-[#F1F5F9] flex items-center gap-2">
                  <input
                    type="text"
                    value={interactiveInput}
                    onChange={(e) => setInteractiveInput(e.target.value)}
                    placeholder="Type your message…"
                    className="flex-1 bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white text-[12px] text-[#102A52] placeholder-[#94A3B8] px-3 py-1.5 rounded-full border border-[#E2E8F0] focus:border-[#0878F9] focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    aria-label="Send message"
                    className="w-7 h-7 rounded-full bg-[#0878F9] hover:bg-[#0768D6] text-white flex items-center justify-center shrink-0 transition-transform active:scale-95 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 -ml-0.5 text-white" />
                  </button>
                </form>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
