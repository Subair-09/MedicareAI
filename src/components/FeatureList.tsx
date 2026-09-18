import React from 'react';
import { Calendar, RotateCcw, XCircle, User, Info } from 'lucide-react';

interface FeatureListProps {
  onSelectFeature?: (action: string) => void;
}

export const FeatureList: React.FC<FeatureListProps> = ({ onSelectFeature }) => {
  const features = [
    {
      id: 'book',
      title: 'Book Appointments',
      description: 'Find a doctor and book your preferred time.',
      icon: <Calendar className="w-5 h-5 text-[#0878F9]" strokeWidth={2.2} />
    },
    {
      id: 'reschedule',
      title: 'Reschedule Appointments',
      description: 'Change your appointment when needed.',
      icon: <RotateCcw className="w-5 h-5 text-[#0878F9]" strokeWidth={2.2} />
    },
    {
      id: 'cancel',
      title: 'Cancel Appointments',
      description: 'Cancel your booking easily and get confirmation.',
      icon: <XCircle className="w-5 h-5 text-[#0878F9]" strokeWidth={2.2} />
    },
    {
      id: 'doctors',
      title: 'View Doctors & Departments',
      description: 'Explore our specialists and available departments.',
      icon: <User className="w-5 h-5 text-[#0878F9]" strokeWidth={2.2} />
    },
    {
      id: 'info',
      title: 'Get Hospital Information',
      description: 'Ask about our services, policies, location and more.',
      icon: <Info className="w-5 h-5 text-[#0878F9]" strokeWidth={2.2} />
    }
  ];

  return (
    <div className="space-y-3 xl:space-y-3.5 w-full text-left">
      {features.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectFeature?.(item.id)}
          className="flex items-start gap-3 xl:gap-3.5 group cursor-pointer transition-all duration-150 hover:translate-x-1"
        >
          <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full bg-[#EAF4FF] group-hover:bg-[#D8ECFF] flex items-center justify-center shrink-0 transition-colors shadow-2xs">
            {item.icon}
          </div>
          <div className="pt-0.5">
            <h3 className="text-[13.5px] xl:text-[14.5px] font-bold text-[#102A52] group-hover:text-[#0878F9] transition-colors leading-tight">
              {item.title}
            </h3>
            <p className="text-[11.5px] xl:text-[12px] text-[#64748B] leading-snug mt-0.5">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
