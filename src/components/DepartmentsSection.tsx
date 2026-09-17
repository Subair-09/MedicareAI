import React from 'react';
import { 
  Stethoscope, 
  HeartPulse, 
  Sparkles, 
  Baby, 
  UserCheck, 
  Bone, 
  Scan, 
  Scissors, 
  ArrowRight 
} from 'lucide-react';
import { DEPARTMENTS } from '../data/hospitalData';
import { Department } from '../types';

interface DepartmentsSectionProps {
  onSelectDepartment?: (dept: Department) => void;
  onViewAllDepartments?: () => void;
}

export const DepartmentsSection: React.FC<DepartmentsSectionProps> = ({
  onSelectDepartment,
  onViewAllDepartments
}) => {
  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope':
        return <Stethoscope className="w-6 h-6 text-[#0878F9]" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6 text-[#0878F9]" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-[#0878F9]" />;
      case 'Baby':
        return <Baby className="w-6 h-6 text-[#0878F9]" />;
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 text-[#0878F9]" />;
      case 'Bone':
        return <Bone className="w-6 h-6 text-[#0878F9]" />;
      case 'Scan':
        return <Scan className="w-6 h-6 text-[#0878F9]" />;
      case 'Scissors':
        return <Scissors className="w-6 h-6 text-[#0878F9]" />;
      default:
        return <Stethoscope className="w-6 h-6 text-[#0878F9]" />;
    }
  };

  return (
    <section id="departments" className="py-14 lg:py-18 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF4FF] border border-[#D0E6FC] text-[#0878F9] text-[13px] font-semibold mb-2">
              <span>Departments</span>
            </div>
            <h2 className="text-[30px] sm:text-[36px] font-black text-[#102A52] tracking-tight leading-tight">
              Our Departments
            </h2>
            <p className="text-[15px] text-[#64748B] mt-1">
              We offer a wide range of medical services across multiple departments.
            </p>
          </div>

          <button
            onClick={onViewAllDepartments}
            className="inline-flex items-center gap-1.5 text-[14.5px] font-bold text-[#0878F9] hover:text-[#0768D6] transition-colors cursor-pointer group shrink-0"
          >
            <span>View All Departments</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 8 Department Cards (Horizontal layout on desktop, responsive on smaller screens) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5 sm:gap-4">
          {DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              onClick={() => onSelectDepartment && onSelectDepartment(dept)}
              className="group bg-white rounded-2xl border border-[#E2EEFC] hover:border-[#BFDBFE] hover:shadow-md hover:shadow-[#0878F9]/8 p-5 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer transform hover:-translate-y-1 min-h-[140px]"
            >
              {/* Icon Container with subtle hover animation */}
              <div className="w-12 h-12 rounded-xl bg-[#F5FAFF] group-hover:bg-[#EAF4FF] flex items-center justify-center mb-3 transition-colors">
                {getDepartmentIcon(dept.iconName)}
              </div>

              {/* Department Name */}
              <h3 className="text-[13.5px] font-bold text-[#102A52] group-hover:text-[#0878F9] transition-colors leading-snug">
                {dept.name}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
