import React, { useState } from 'react';
import { X, Calendar, Clock, User, Building2, FileText, CheckCircle2 } from 'lucide-react';
import { Appointment, AppointmentType } from '../../../types';
import { DEPARTMENTS_LIST, DOCTORS_LIST } from '../../../data/appointmentsData';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: (newAppointment: Appointment) => void;
  departments?: string[];
  doctors?: string[];
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  isOpen,
  onClose,
  onBook,
  departments = DEPARTMENTS_LIST.filter((d) => d !== 'All Departments'),
  doctors = DOCTORS_LIST.filter((d) => d !== 'All Doctors'),
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const realDepts = departments.filter((d) => d !== 'All Departments');

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState('30');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [patientBloodGroup, setPatientBloodGroup] = useState('O+');
  const [department, setDepartment] = useState(realDepts[0] || '');
  const [doctorName, setDoctorName] = useState(doctors[0] || 'Doctor On Duty');
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState('09:00 AM');
  const [type, setType] = useState<AppointmentType>('Consultation');
  const [notes, setNotes] = useState('');
  const [fee, setFee] = useState('$100.00');
  const [room, setRoom] = useState('Consultation Room 1');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    // Format date nicely e.g., Oct 14, 2025 or use standard YYYY-MM-DD
    let formattedDate = date;
    try {
      const dObj = new Date(date + 'T00:00:00');
      if (!isNaN(dObj.getTime())) {
        formattedDate = dObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch {
      // keep fallback
    }

    const newId = `APT-${Date.now().toString().slice(-6)}`;
    const newPid = `PID-${Math.floor(10000 + Math.random() * 90000)}`;

    const newAppointment: Appointment = {
      id: newId,
      patientId: newPid,
      patientName: patientName.trim(),
      patientAvatar: '',
      patientGender,
      patientAge: Number(patientAge) || 30,
      patientBloodGroup,
      patientPhone: patientPhone.trim() || '—',
      patientEmail: patientEmail.trim() || '—',
      doctorName,
      doctorSpecialty: department,
      doctorAvatar: '',
      department,
      room: room.trim() || 'Consultation Room',
      date: formattedDate,
      time,
      duration: '30 mins',
      type,
      status: 'Confirmed',
      notes: notes.trim() || 'Booked via Admin Management',
      fee: fee.trim() || '—',
      insuranceProvider: insuranceProvider.trim() || 'Self Pay',
      emergencyContact: emergencyContact.trim() || '—',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    onBook(newAppointment);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[16px] border border-[#E1EDF9] shadow-2xl max-w-xl w-full p-6 text-left max-h-[90vh] overflow-y-auto [scrollbar-width:thin]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E1EDF9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[9px] bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center">
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#102A52]">
                Book New Appointment
              </h3>
              <p className="text-[12px] text-[#5879A6]">
                Schedule a patient visit with hospital specialist
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#94A3B8] hover:text-[#102A52] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-[13px]">
          {/* Patient Details */}
          <div>
            <label className="block font-bold text-[#102A52] mb-1">
              Patient Full Name *
            </label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Samuel Adeniran"
              className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/15"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#102A52] mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="+234 800 000 0000"
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#102A52] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                placeholder="patient@example.com"
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#102A52] mb-1">Age</label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(e.target.value)}
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#102A52] mb-1">Gender</label>
              <select
                value={patientGender}
                onChange={(e) => setPatientGender(e.target.value as any)}
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-[#102A52] mb-1">Blood Group</label>
              <select
                value={patientBloodGroup}
                onChange={(e) => setPatientBloodGroup(e.target.value)}
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              >
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
                <option value="A-">A-</option>
                <option value="B-">B-</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          {/* Department & Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#102A52] mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              >
                {realDepts.length === 0 ? (
                  <option value="" disabled>
                    No departments available
                  </option>
                ) : (
                  realDepts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#102A52] mb-1">
                Assigned Doctor
              </label>
              <select
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              >
                {doctors.filter((d) => d !== 'All Doctors').map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date, Time & Visit Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-[#102A52] mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-[40px] px-2.5 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9] text-[13px]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#102A52] mb-1">Time Slot</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-[40px] px-2.5 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              >
                <option value="08:30 AM">08:30 AM</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="01:00 PM">01:00 PM</option>
                <option value="01:30 PM">01:30 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#102A52] mb-1">Visit Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AppointmentType)}
                className="w-full h-[40px] px-2.5 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              >
                <option value="Consultation">Consultation</option>
                <option value="Routine Checkup">Routine Checkup</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Specialist Exam">Specialist Exam</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          {/* Room & Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#102A52] mb-1">Room / Location</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Clinic Room 3"
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#102A52] mb-1">Consultation Fee</label>
              <input
                type="text"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="e.g. $100.00"
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
          </div>

          {/* Insurance & Emergency */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#102A52] mb-1">Insurance Policy (Optional)</label>
              <input
                type="text"
                value={insuranceProvider}
                onChange={(e) => setInsuranceProvider(e.target.value)}
                placeholder="e.g. Self Pay or Policy #"
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#102A52] mb-1">Emergency Contact (Optional)</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Name & Phone number"
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block font-bold text-[#102A52] mb-1">
              Chief Complaint / Reason for Visit
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Clinical reason, symptoms, or special instructions..."
              className="w-full p-2.5 rounded-[10px] border border-[#E1EDF9] focus:outline-none focus:border-[#0878F9] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E1EDF9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[10px] border border-[#E1EDF9] text-[#5879A6] hover:bg-[#F8FAFC] font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-[10px] bg-[#0878F9] hover:bg-[#0768D6] text-white font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Book</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
