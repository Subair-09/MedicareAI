import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  FileText,
  Printer,
  Edit2,
  Check,
  Activity,
  HeartPulse,
  Trash2
} from 'lucide-react';
import { AdminPatient } from '../../../types';

interface PatientDetailsModalProps {
  patient: AdminPatient | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdatePatient?: (updated: AdminPatient) => void;
  onPrintReport?: (patient: AdminPatient) => void;
  onDeletePatient?: (patient: AdminPatient) => void;
}

export const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({
  patient,
  isOpen,
  onClose,
  onUpdatePatient,
  onPrintReport,
  onDeletePatient,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(patient?.name || '');
  const [phone, setPhone] = useState(patient?.phone || '');
  const [email, setEmail] = useState(patient?.email || '');
  const [department, setDepartment] = useState(patient?.department || '');
  const [status, setStatus] = useState<AdminPatient['status']>(patient?.status || 'Active');
  const [notes, setNotes] = useState(patient?.notes || '');

  React.useEffect(() => {
    if (patient && isOpen) {
      setName(patient.name || '');
      setPhone(patient.phone || '');
      setEmail(patient.email || '');
      setDepartment(patient.department || '');
      setStatus(patient.status || 'Active');
      setNotes(patient.notes || '');
      setIsEditing(false);
    }
  }, [patient, isOpen]);

  if (!isOpen || !patient) return null;

  const handleSave = () => {
    if (onUpdatePatient) {
      onUpdatePatient({
        ...patient,
        name,
        phone,
        email,
        department,
        status,
        notes,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[20px] border border-[#DCEBFA] shadow-[0_20px_50px_rgba(13,40,87,0.18)] max-w-2xl w-full overflow-hidden text-left">
        {/* Modal Top Bar */}
        <div className="px-6 py-4.5 border-b border-[#E1EDF9] flex items-center justify-between bg-[#F8FBFF]">
          <div className="flex items-center gap-3">
            {patient.avatar ? (
              <img
                src={patient.avatar}
                alt={patient.name}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-2xs"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold text-[14px] flex items-center justify-center border-2 border-white shadow-2xs">
                {patient.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-[#0D2857]">
                  {patient.name}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    patient.status === 'Active'
                      ? 'bg-[#E7F9F0] text-[#19B978]'
                      : patient.status === 'Pending'
                      ? 'bg-[#FFF4E5] text-[#F59E0B]'
                      : 'bg-[#FEECEE] text-[#EF4444]'
                  }`}
                >
                  {patient.status}
                </span>
              </div>
              <p className="text-[12px] text-[#5273A8]">
                {patient.patientId} • {patient.age} years • {patient.gender} • {patient.department}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5273A8] hover:bg-[#EAF4FF] hover:text-[#0D2857] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[72vh] overflow-y-auto">
          {/* Vitals & Clinical Fast-Facts Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-[12px] bg-[#F5FAFF] border border-[#E1EDF9]">
              <span className="text-[11px] font-medium text-[#5273A8] block">Blood Group</span>
              <span className="text-[15px] font-bold text-[#0D2857] mt-0.5 block">
                {patient.bloodGroup || 'O+'}
              </span>
            </div>

            <div className="p-3 rounded-[12px] bg-[#F5FAFF] border border-[#E1EDF9]">
              <span className="text-[11px] font-medium text-[#5273A8] block">Genotype</span>
              <span className="text-[15px] font-bold text-[#0D2857] mt-0.5 block">
                {patient.genotype || 'AA'}
              </span>
            </div>

            <div className="p-3 rounded-[12px] bg-[#F5FAFF] border border-[#E1EDF9]">
              <span className="text-[11px] font-medium text-[#5273A8] block">Last Visit</span>
              <span className="text-[13.5px] font-bold text-[#0D2857] mt-0.5 block truncate">
                {patient.lastVisit}
              </span>
            </div>

            <div className="p-3 rounded-[12px] bg-[#F5FAFF] border border-[#E1EDF9]">
              <span className="text-[11px] font-medium text-[#5273A8] block">Registered</span>
              <span className="text-[13.5px] font-bold text-[#0D2857] mt-0.5 block">
                {patient.registrationDate || '2024'}
              </span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-[#F8FBFF] border border-[#E1EDF9] rounded-[14px] p-4 space-y-3">
            <h4 className="text-[13px] font-bold text-[#0D2857] flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#0868F5]" />
              <span>Contact & Residential Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12.5px]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#5273A8]" />
                <span className="text-[#5273A8]">Phone:</span>
                <span className="font-semibold text-[#0D2857]">{patient.phone}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#5273A8]" />
                <span className="text-[#5273A8]">Email:</span>
                <span className="font-semibold text-[#0D2857] truncate">{patient.email}</span>
              </div>

              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-[#5273A8] shrink-0" />
                <span className="text-[#5273A8] shrink-0">Address:</span>
                <span className="font-semibold text-[#0D2857]">
                  {patient.address || 'Lagos, Nigeria'}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:col-span-2">
                <HeartPulse className="w-3.5 h-3.5 text-[#0868F5] shrink-0" />
                <span className="text-[#5273A8] shrink-0">Emergency Contact:</span>
                <span className="font-semibold text-[#0D2857]">
                  {patient.emergencyContact || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Allergies Warning Strip */}
          <div className="p-3.5 rounded-[12px] bg-[#FFF8EE] border border-[#FDE68A] flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <span className="text-[12px] font-bold text-[#B45309] block">
                Known Drug & Food Allergies:
              </span>
              <span className="text-[12px] text-[#92400E] mt-0.5 block">
                {patient.allergies && patient.allergies.length > 0
                  ? patient.allergies.join(', ')
                  : 'No allergies recorded.'}
              </span>
            </div>
          </div>

          {/* Clinical Case Notes */}
          <div className="p-4 rounded-[14px] bg-white border border-[#E1EDF9]">
            <h4 className="text-[13px] font-bold text-[#0D2857] mb-1.5 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#0868F5]" />
              <span>Attending Physician Notes</span>
            </h4>
            {isEditing ? (
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 border border-[#DCEBFA] rounded-[8px] text-[13px] text-[#0D2857]"
              />
            ) : (
              <p className="text-[12.5px] text-[#5273A8] leading-relaxed">
                {patient.notes ||
                  'Patient visited for scheduled consultation. Physical examination and vital signs recorded in EMR.'}
              </p>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-[#F8FBFF] border-t border-[#E1EDF9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onPrintReport && (
              <button
                type="button"
                onClick={() => onPrintReport(patient)}
                className="px-3.5 py-2 rounded-[8px] bg-white border border-[#DCEBFA] hover:bg-[#F5FAFF] text-[#0D2857] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Printer className="w-4 h-4 text-[#5273A8]" />
                <span>Print Report</span>
              </button>
            )}

            {!isEditing && onDeletePatient && patient && (
              <button
                type="button"
                onClick={() => onDeletePatient(patient)}
                className="px-3.5 py-2 rounded-[8px] bg-white border border-[#FECACA] hover:bg-[#FEF2F2] text-[#DC2626] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Patient</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-[8px] text-[12.5px] font-semibold text-[#5273A8] hover:bg-[#EAF4FF] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Save Changes</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-[8px] bg-[#EAF4FF] hover:bg-[#D8ECFE] text-[#0868F5] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[12.5px] font-semibold transition-colors cursor-pointer shadow-2xs"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
