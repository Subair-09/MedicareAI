import React from 'react';
import { X, Printer, Activity, CheckCircle2 } from 'lucide-react';
import { AdminPatient } from '../../../types';

interface PrintReportModalProps {
  patient: AdminPatient | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  patient,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !patient) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[20px] border border-[#DCEBFA] shadow-[0_25px_60px_rgba(13,40,87,0.2)] max-w-2xl w-full overflow-hidden text-left">
        {/* Action Header */}
        <div className="px-6 py-4 border-b border-[#E1EDF9] flex items-center justify-between bg-[#F8FBFF] print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#0868F5]" />
            <h3 className="text-[16px] font-bold text-[#0D2857]">
              Patient Clinical Summary Report
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold rounded-[8px] flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Document</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#5273A8] hover:bg-[#EAF4FF] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 max-h-[75vh] overflow-y-auto space-y-6 text-[#0D2857]">
          {/* Hospital Letterhead */}
          <div className="flex items-center justify-between border-b-2 border-[#0868F5] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0868F5] flex items-center justify-center text-white font-bold text-xl">
                +
              </div>
              <div>
                <h2 className="text-[20px] font-extrabold text-[#0D2857] leading-none tracking-tight">
                  MediCare Hospital
                </h2>
                <p className="text-[12px] text-[#5273A8] mt-1">
                  Excellence in Healthcare & Patient Management
                </p>
              </div>
            </div>
            <div className="text-right text-[11.5px] text-[#5273A8]">
              <p>Report Date: {new Date().toLocaleDateString()}</p>
              <p>Ref: MED-REP-{patient.patientId}</p>
            </div>
          </div>

          {/* Patient Demographics Table */}
          <div className="bg-[#F8FBFF] border border-[#E1EDF9] rounded-[12px] p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[12.5px]">
              <div>
                <span className="text-[#5273A8] block text-[11px]">Patient Name</span>
                <span className="font-bold text-[#0D2857] text-[14px]">{patient.name}</span>
              </div>
              <div>
                <span className="text-[#5273A8] block text-[11px]">Patient ID</span>
                <span className="font-bold text-[#0D2857]">{patient.patientId}</span>
              </div>
              <div>
                <span className="text-[#5273A8] block text-[11px]">Age & Gender</span>
                <span className="font-semibold text-[#0D2857]">
                  {patient.age} yrs • {patient.gender}
                </span>
              </div>
              <div>
                <span className="text-[#5273A8] block text-[11px]">Department</span>
                <span className="font-semibold text-[#0D2857]">{patient.department}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[12.5px] mt-4 pt-3 border-t border-[#E1EDF9]">
              <div>
                <span className="text-[#5273A8] block text-[11px]">Phone Number</span>
                <span className="font-semibold text-[#0D2857]">{patient.phone}</span>
              </div>
              <div>
                <span className="text-[#5273A8] block text-[11px]">Email Address</span>
                <span className="font-semibold text-[#0D2857] truncate">{patient.email}</span>
              </div>
              <div>
                <span className="text-[#5273A8] block text-[11px]">Blood Group / Genotype</span>
                <span className="font-semibold text-[#0D2857]">
                  {patient.bloodGroup || 'O+'} / {patient.genotype || 'AA'}
                </span>
              </div>
              <div>
                <span className="text-[#5273A8] block text-[11px]">Last Consultation</span>
                <span className="font-semibold text-[#0D2857]">{patient.lastVisit}</span>
              </div>
            </div>
          </div>

          {/* Allergies & Flags */}
          <div className="border border-[#E1EDF9] rounded-[12px] p-4 space-y-2">
            <h4 className="text-[13px] font-bold text-[#0D2857] uppercase tracking-wider text-[11.5px]">
              Clinical Profile & Precautions
            </h4>
            <div className="text-[12.5px] space-y-1">
              <p>
                <strong className="text-[#5273A8]">Allergies:</strong>{' '}
                {patient.allergies?.join(', ') || 'None recorded'}
              </p>
              <p>
                <strong className="text-[#5273A8]">Status:</strong> {patient.status}
              </p>
              <p>
                <strong className="text-[#5273A8]">Address:</strong>{' '}
                {patient.address || 'Lagos, Nigeria'}
              </p>
              <p>
                <strong className="text-[#5273A8]">Emergency Contact:</strong>{' '}
                {patient.emergencyContact || 'Available on request'}
              </p>
            </div>
          </div>

          {/* Clinical Notes & Diagnostic Assessment */}
          <div className="border border-[#E1EDF9] rounded-[12px] p-4 space-y-2">
            <h4 className="text-[13px] font-bold text-[#0D2857] uppercase tracking-wider text-[11.5px]">
              Clinical Progress & Observations
            </h4>
            <p className="text-[12.5px] leading-relaxed text-[#5273A8]">
              {patient.notes ||
                'Patient in stable medical status. Continuous biometric tracking and regular department clinic follow-up recommended.'}
            </p>
          </div>

          {/* Doctor Signature Stamp */}
          <div className="pt-6 flex items-end justify-between text-[12px] text-[#5273A8]">
            <div>
              <p>MediCare Hospital Administration & Records</p>
              <p className="text-[11px] text-[#8AA3C6]">
                This is an authorized electronic hospital record summary.
              </p>
            </div>
            <div className="text-center border-t border-[#CBD5E1] pt-2 w-48">
              <span className="font-semibold text-[#0D2857]">Attending Physician</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
