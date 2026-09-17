import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  HeartPulse,
  Check,
  ShieldCheck,
  Calendar,
  Clock,
  Stethoscope,
  ChevronDown,
  Lock
} from 'lucide-react';
import { AdminDoctor } from '../../types';

export interface PatientFormDetails {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientBloodGroup?: string;
  reasonForVisit: string;
  doctorId?: string;
  doctorName?: string;
  department?: string;
  room?: string;
  fee?: string;
  slotDay?: string;
  slotTime?: string;
  slotDateStr?: string;
}

interface PatientDetailsInputCardProps {
  initialDetails?: Partial<PatientFormDetails>;
  onSubmitDetails: (details: PatientFormDetails) => void;
  onCancel?: () => void;
  doctorName?: string;
  department?: string;
  selectedSlot?: { day: string; time: string; dateStr?: string };
  availableDoctors?: AdminDoctor[];
}

export const PatientDetailsInputCard: React.FC<PatientDetailsInputCardProps> = ({
  initialDetails,
  onSubmitDetails,
  onCancel,
  doctorName: initialDoctorName,
  department: initialDepartment,
  selectedSlot: initialSelectedSlot,
  availableDoctors = [],
}) => {
  // Default doctor resolution
  const defaultDoc =
    availableDoctors.find(
      (d) => d.name?.toLowerCase() === initialDoctorName?.toLowerCase()
    ) || availableDoctors[0];

  const [selectedDocId, setSelectedDocId] = useState<string>(
    defaultDoc?.id || ''
  );
  const [activeDoctorName, setActiveDoctorName] = useState<string>(
    initialDoctorName || defaultDoc?.name || 'Dr. Rapheael Okon'
  );
  const [activeDepartment, setActiveDepartment] = useState<string>(
    initialDepartment || defaultDoc?.department || 'Virology'
  );

  // Active slot state
  const [activeSlot, setActiveSlot] = useState<{ day: string; time: string; dateStr?: string } | null>(
    initialSelectedSlot || {
      day: 'Thu, Sep 18',
      time: '10:00 AM',
      dateStr: '2026-09-18',
    }
  );

  const [showDoctorSlotPicker, setShowDoctorSlotPicker] = useState<boolean>(
    !initialDoctorName || !initialSelectedSlot
  );

  // Patient info inputs
  const [name, setName] = useState(initialDetails?.patientName || '');
  const [phone, setPhone] = useState(initialDetails?.patientPhone || '');
  const [email, setEmail] = useState(initialDetails?.patientEmail || '');
  const [age, setAge] = useState<number>(initialDetails?.patientAge || 32);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(
    initialDetails?.patientGender || 'Male'
  );
  const [bloodGroup, setBloodGroup] = useState(
    initialDetails?.patientBloodGroup || 'O+'
  );
  const [complaint, setComplaint] = useState(
    initialDetails?.reasonForVisit || ''
  );
  const [errorMsg, setErrorMsg] = useState('');

  // Update if initialDetails changes (e.g. AI parsed from conversational text)
  useEffect(() => {
    if (initialDetails?.patientName && !name) {
      setName(initialDetails.patientName);
    }
    if (initialDetails?.patientPhone && !phone) {
      setPhone(initialDetails.patientPhone);
    }
    if (initialDetails?.patientEmail && !email) {
      setEmail(initialDetails.patientEmail);
    }
    if (initialDetails?.reasonForVisit && !complaint) {
      setComplaint(initialDetails.reasonForVisit);
    }
  }, [initialDetails]);

  // Standard selectable upcoming consultation slots
  const fallbackSlotOptions = [
    { day: 'Thu, Sep 18', time: '10:00 AM', dateStr: '2026-09-18' },
    { day: 'Thu, Sep 18', time: '02:30 PM', dateStr: '2026-09-18' },
    { day: 'Fri, Sep 19', time: '09:15 AM', dateStr: '2026-09-19' },
    { day: 'Fri, Sep 19', time: '11:45 AM', dateStr: '2026-09-19' },
    { day: 'Mon, Sep 22', time: '03:00 PM', dateStr: '2026-09-22' },
  ];

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const docId = e.target.value;
    setSelectedDocId(docId);
    const chosen = availableDoctors.find((d) => d.id === docId);
    if (chosen) {
      setActiveDoctorName(chosen.name);
      setActiveDepartment(chosen.department);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter the patient full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMsg('Please enter a contact phone number.');
      return;
    }
    if (!activeSlot) {
      setErrorMsg('Please select an appointment consultation slot.');
      return;
    }

    const currentDoc = availableDoctors.find((d) => d.id === selectedDocId) || defaultDoc;

    setErrorMsg('');
    onSubmitDetails({
      patientName: name.trim(),
      patientPhone: phone.trim(),
      patientEmail: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@patient.medicare.com`,
      patientAge: Number(age) || 30,
      patientGender: gender,
      patientBloodGroup: bloodGroup,
      reasonForVisit: complaint.trim() || 'Consultation requested via MediCare AI',
      doctorId: currentDoc?.id || selectedDocId || 'DOC-001',
      doctorName: activeDoctorName,
      department: activeDepartment,
      fee: currentDoc?.feeText || `$${currentDoc?.consultationFee || 150}`,
      room: currentDoc?.room || `${activeDepartment} Suite`,
      slotDay: activeSlot.day,
      slotTime: activeSlot.time,
      slotDateStr: activeSlot.dateStr || '2026-09-18',
    });
  };

  return (
    <div className="bg-white border-2 border-[#0878F9]/30 rounded-2xl p-4 sm:p-5 text-left shadow-md">
      {/* Official Form Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#E2EDF8] pb-3 mb-3.5">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EBF4FE] border border-[#BFDBFE] flex items-center justify-center text-[#0878F9] shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[14.5px] sm:text-[15.5px] font-bold text-[#102A52]">
                Official Appointment Booking Form
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#EBF4FE] text-[#0878F9] border border-[#BFDBFE]">
                <Lock className="w-3 h-3" /> Mandatory Form
              </span>
            </div>
            <p className="text-[12px] text-[#5577A6] mt-0.5 leading-relaxed">
              All MediCare AI appointments must be submitted through this form for identity verification and hospital database synchronization.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Doctor & Slot Summary / Editor */}
      <div className="mb-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-[#102A52]">
            <Stethoscope className="w-4 h-4 text-[#0878F9]" />
            <span>Consultation Target:</span>
            <span className="font-bold text-[#0878F9]">{activeDoctorName}</span>
            <span className="text-[#64748B]">({activeDepartment})</span>
          </div>
          <button
            type="button"
            onClick={() => setShowDoctorSlotPicker(!showDoctorSlotPicker)}
            className="text-[11.5px] font-semibold text-[#0878F9] hover:text-[#0768D6] underline cursor-pointer"
          >
            {showDoctorSlotPicker ? 'Hide Selector' : 'Change Doctor / Slot'}
          </button>
        </div>

        {activeSlot && !showDoctorSlotPicker && (
          <div className="mt-2 flex items-center gap-2 text-[12px] text-[#475569]">
            <Calendar className="w-3.5 h-3.5 text-[#0878F9]" />
            <span>Reserved Slot:</span>
            <span className="font-bold text-[#102A52]">
              {activeSlot.day} at {activeSlot.time}
            </span>
          </div>
        )}

        {/* Doctor & Slot Selector Dropdown / Chips */}
        {showDoctorSlotPicker && (
          <div className="mt-3 pt-3 border-t border-[#E2E8F0] space-y-3">
            {availableDoctors.length > 0 && (
              <div>
                <label className="block text-[11.5px] font-semibold text-[#475569] mb-1">
                  Select Doctor / Department:
                </label>
                <div className="relative">
                  <select
                    value={selectedDocId}
                    onChange={handleDoctorChange}
                    className="w-full pl-3 pr-8 py-1.5 rounded-lg border border-[#CBD5E1] text-[12.5px] text-[#102A52] bg-white focus:outline-none focus:border-[#0878F9]"
                  >
                    {availableDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} — {doc.department} ({doc.specialty})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11.5px] font-semibold text-[#475569] mb-1.5">
                Select Consultation Slot:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {fallbackSlotOptions.map((s, idx) => {
                  const isSelected =
                    activeSlot?.day === s.day && activeSlot?.time === s.time;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlot(s)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#0878F9] text-white border-[#0878F9] shadow-xs'
                          : 'bg-white text-[#334155] border-[#CBD5E1] hover:border-[#0878F9]'
                      }`}
                    >
                      <Clock className="w-3 h-3 inline mr-1 opacity-70" />
                      {s.day} • {s.time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="mb-3 p-2.5 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-[12.5px] font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Full Name */}
          <div>
            <label className="block text-[12px] font-semibold text-[#102A52] mb-1">
              Patient Full Name <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8E8FA] text-[13px] text-[#102A52] placeholder-[#94A3B8] focus:outline-none focus:border-[#0878F9] focus:ring-1 focus:ring-[#0878F9]"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[12px] font-semibold text-[#102A52] mb-1">
              Contact Phone Number <span className="text-[#EF4444]">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +1 555-0199"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8E8FA] text-[13px] text-[#102A52] placeholder-[#94A3B8] focus:outline-none focus:border-[#0878F9] focus:ring-1 focus:ring-[#0878F9]"
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[12px] font-semibold text-[#102A52] mb-1">
              Email Address (Optional)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sarah@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8E8FA] text-[13px] text-[#102A52] placeholder-[#94A3B8] focus:outline-none focus:border-[#0878F9] focus:ring-1 focus:ring-[#0878F9]"
              />
            </div>
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[12px] font-semibold text-[#102A52] mb-1">Age</label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#D8E8FA] text-[13px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#102A52] mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8E8FA] text-[13px] text-[#102A52] focus:outline-none focus:border-[#0878F9] bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reason for Visit / Symptoms */}
        <div>
          <label className="block text-[12px] font-semibold text-[#102A52] mb-1">
            Reason for Visit / Symptoms
          </label>
          <div className="relative">
            <HeartPulse className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
            <textarea
              rows={2}
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Describe symptoms, duration, or purpose of consultation..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8E8FA] text-[13px] text-[#102A52] placeholder-[#94A3B8] focus:outline-none focus:border-[#0878F9]"
            />
          </div>
        </div>

        {/* Bottom Submission Notice & Actions */}
        <div className="pt-2 border-t border-[#F1F5F9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11.5px] text-[#64748B] flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Instant sync with Hospital MongoDB Database</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0878F9] hover:bg-[#0768D6] text-white font-bold text-[13px] transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Submit Booking Form</span>
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F5FAFF] border border-[#D0E6FC] text-[#5577A6] text-[13px] font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
