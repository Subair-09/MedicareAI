import React from 'react';
import { 
  Calendar, 
  RefreshCw, 
  ClipboardX, 
  Clock, 
  MessageSquare, 
  User, 
  Bell, 
  ShieldCheck 
} from 'lucide-react';
import { FEATURES } from '../data/hospitalData';

interface FeaturesSectionProps {
  onFeatureClick?: (featureId: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onFeatureClick }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calendar':
        return <Calendar className="w-5 h-5 text-[#0878F9]" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5 text-[#20B879]" />;
      case 'ClipboardX':
        return <ClipboardX className="w-5 h-5 text-[#FF4D6D]" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-[#7C3AED]" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-[#0878F9]" />;
      case 'User':
        return <User className="w-5 h-5 text-[#8B5CF6]" />;
      case 'Bell':
        return <Bell className="w-5 h-5 text-[#F59E0B]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#20B879]" />;
      default:
        return <Calendar className="w-5 h-5 text-[#0878F9]" />;
    }
  };

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-left mb-12 max-w-2xl">
          <h2 className="text-[32px] sm:text-[38px] font-black text-[#102A52] tracking-tight leading-tight mb-3">
            Everything You Need, In One Place
          </h2>
          <p className="text-[16px] text-[#64748B] leading-relaxed">
            Our AI assistant makes it easy to manage your health appointments while giving you quick access to hospital information.
          </p>
        </div>

        {/* 4-Column Grid for 8 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.id}
              onClick={() => onFeatureClick && onFeatureClick(feature.id)}
              className="group p-6 rounded-2xl bg-white border border-[#E2EEFC] hover:border-[#BFDBFE] hover:shadow-md hover:shadow-[#0878F9]/5 transition-all duration-200 transform hover:-translate-y-1 flex flex-col justify-start cursor-pointer text-left"
            >
              {/* Colored Circular Icon Container */}
              <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-105`}>
                {getIcon(feature.icon)}
              </div>

              {/* Title */}
              <h3 className="text-[17px] font-bold text-[#102A52] mb-2 leading-snug group-hover:text-[#0878F9] transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-[14px] text-[#64748B] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
