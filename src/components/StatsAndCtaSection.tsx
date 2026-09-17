import React from 'react';
import { 
  Smile, 
  Users, 
  Building2, 
  Clock, 
  Heart, 
  ArrowRight,
  Activity
} from 'lucide-react';
import { STATS } from '../data/hospitalData';

interface StatsAndCtaSectionProps {
  onStartChat: () => void;
}

export const StatsAndCtaSection: React.FC<StatsAndCtaSectionProps> = ({ onStartChat }) => {
  const getStatIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smile':
        return <Smile className="w-5 h-5 text-[#0878F9]" />;
      case 'Users':
        return <Users className="w-5 h-5 text-[#0878F9]" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-[#0878F9]" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-[#0878F9]" />;
      default:
        return <Smile className="w-5 h-5 text-[#0878F9]" />;
    }
  };

  return (
    <section className="py-10 lg:py-14 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* ==================================================
              LEFT: STATISTICS PANEL (4 stats with dividers)
             ================================================== */}
          <div className="lg:col-span-7 xl:col-span-8 bg-[#F5FAFF] border border-[#E2EEFC] rounded-3xl p-6 sm:p-8 flex items-center justify-center">
            <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-2">
              {STATS.map((stat, idx) => (
                <div
                  key={stat.id}
                  className={`flex flex-col items-center md:items-start text-center md:text-left ${
                    idx !== 0 ? 'md:border-l md:border-[#DDEAFD] md:pl-6' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#EAF4FF] flex items-center justify-center mb-3">
                    {getStatIcon(stat.icon)}
                  </div>
                  <div className="text-[26px] sm:text-[32px] font-black text-[#102A52] tracking-tight leading-tight">
                    {stat.value}
                  </div>
                  <div className="text-[13.5px] font-medium text-[#64748B] mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ==================================================
              RIGHT: CALL TO ACTION CARD
             ================================================== */}
          <div className="lg:col-span-5 xl:col-span-4 bg-[#F5FAFF] border border-[#E2EEFC] rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-left relative overflow-hidden">
            <div>
              {/* Blue healthcare heart icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#0878F9] text-white flex items-center justify-center mb-4 shadow-sm shadow-[#0878F9]/20">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>

              {/* Heading */}
              <h3 className="text-[24px] sm:text-[28px] font-black text-[#102A52] tracking-tight leading-tight mb-2">
                Better Health <br />
                Starts Here
              </h3>

              {/* Description */}
              <p className="text-[14px] text-[#64748B] leading-relaxed mb-6">
                Let our AI assistant help you get the care you need — quickly, easily and securely.
              </p>
            </div>

            {/* Button */}
            <div>
              <button
                onClick={onStartChat}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#102A52] hover:bg-[#0878F9] text-white text-[14.5px] font-bold shadow-sm transition-all duration-200 cursor-pointer group"
              >
                <span>Start Chatting Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
