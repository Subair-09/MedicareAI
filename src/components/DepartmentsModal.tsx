import React from 'react';
import { X, ArrowRight, Stethoscope, HeartPulse, Sparkles, Baby, UserCheck, Bone, Scan, Scissors, MessageSquare } from 'lucide-react';
import { DEPARTMENTS } from '../data/hospitalData';
import { Department } from '../types';

interface DepartmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDepartment: (dept: Department) => void;
}

export const DepartmentsModal: React.FC<DepartmentsModalProps> = ({
  isOpen,
  onClose,
  onSelectDepartment
}) => {
  if (!isOpen) return null;

  const getDepartmentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope': return <Stethoscope className="w-5 h-5 text-[#0878F9]" />;
      case 'HeartPulse': return <HeartPulse className="w-5 h-5 text-[#0878F9]" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#0878F9]" />;
      case 'Baby': return <Baby className="w-5 h-5 text-[#0878F9]" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-[#0878F9]" />;
      case 'Bone': return <Bone className="w-5 h-5 text-[#0878F9]" />;
      case 'Scan': return <Scan className="w-5 h-5 text-[#0878F9]" />;
      case 'Scissors': return <Scissors className="w-5 h-5 text-[#0878F9]" />;
      default: return <Stethoscope className="w-5 h-5 text-[#0878F9]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A52]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E2EEFC] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#102A52] text-white p-6 flex items-center justify-between">
          <div>
            <h3 className="text-[20px] font-bold">MediCare Hospital Departments</h3>
            <p className="text-[13px] text-[#94A3B8] mt-0.5">
              Select any department to book or inquire with our AI assistant.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DEPARTMENTS.map((dept) => (
            <div
              key={dept.id}
              onClick={() => {
                onClose();
                onSelectDepartment(dept);
              }}
              className="p-4 rounded-2xl border border-[#E2EEFC] hover:border-[#0878F9] hover:bg-[#F5FAFF] transition-all cursor-pointer flex items-start gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] flex items-center justify-center shrink-0">
                {getDepartmentIcon(dept.iconName)}
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-bold text-[#102A52] group-hover:text-[#0878F9] transition-colors">
                  {dept.name}
                </h4>
                <p className="text-[12.5px] text-[#64748B] mt-1 leading-snug line-clamp-2">
                  {dept.description}
                </p>
                <div className="mt-2 text-[12px] font-bold text-[#0878F9] flex items-center gap-1">
                  <span>Consult with AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
