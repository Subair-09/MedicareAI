import React, { useState, useEffect } from 'react';
import { X, Edit2 } from 'lucide-react';
import { AdminDoctor, DoctorStatus } from '../../../types';

interface EditDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: AdminDoctor | null;
  onSaveDoctor: (doctor: AdminDoctor) => void;
  departmentOptions?: string[];
}

export const EditDoctorModal: React.FC<EditDoctorModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onSaveDoctor,
  departmentOptions = [],
}) => {
  const realDepts = departmentOptions.filter((d) => d !== 'All Departments');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState(10);
  const [consultationFee, setConsultationFee] = useState(150);
  const [status, setStatus] = useState<DoctorStatus>('Active');
  const [bio, setBio] = useState('');
  const [room, setRoom] = useState('');

  useEffect(() => {
    if (doctor) {
      setFirstName(doctor.firstName);
      setLastName(doctor.lastName);
      setEmail(doctor.email);
      setPhone(doctor.phone);
      setLicenseNumber(doctor.licenseNumber);
      setDepartment(doctor.department);
      setSpecialty(doctor.specialty);
      setYearsOfExperience(doctor.yearsOfExperience);
      setConsultationFee(doctor.consultationFee);
      setStatus(doctor.status);
      setBio(doctor.bio);
      setRoom(doctor.room || '');
    }
  }, [doctor]);

  if (!isOpen || !doctor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminDoctor = {
      ...doctor,
      firstName,
      lastName,
      name: `Dr. ${firstName} ${lastName}`,
      email,
      phone,
      licenseNumber,
      department,
      departmentId: `dept-${department.toLowerCase().replace(/\s+/g, '-')}`,
      specialty,
      yearsOfExperience: Number(yearsOfExperience),
      experienceText: `${yearsOfExperience} years`,
      consultationFee: Number(consultationFee),
      feeText: `$${consultationFee}`,
      status,
      bio,
      room,
    };
    onSaveDoctor(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-[16px] border border-[#DCEBFA] shadow-[0_20px_50px_rgba(16,42,82,0.18)] overflow-hidden my-6 animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCEBFA] flex items-center justify-between bg-[#F8FBFF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center">
              <Edit2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#102A52]">Edit Doctor Profile</h2>
              <p className="text-[12.5px] text-[#5879A6]">{doctor.id} · {doctor.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#EBF3FB] text-[#5879A6] hover:text-[#102A52] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] text-[13.5px] text-[#102A52] focus:border-[#0878F9]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] text-[13.5px] text-[#102A52] focus:border-[#0878F9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-[40px] px-3 rounded-[9px] border border-[#DCEBFA] text-[13px] text-[#102A52] focus:border-[#0878F9]"
              >
                {realDepts.length === 0 && !department ? (
                  <option value="" disabled>
                    No departments configured
                  </option>
                ) : (
                  Array.from(new Set([...(department ? [department] : []), ...realDepts])).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Specialty
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] text-[13.5px] text-[#102A52] focus:border-[#0878F9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DoctorStatus)}
                className="w-full h-[40px] px-3 rounded-[9px] border border-[#DCEBFA] text-[13px] text-[#102A52] focus:border-[#0878F9]"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] text-[13.5px] text-[#102A52] focus:border-[#0878F9]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Consultation Fee ($)
              </label>
              <input
                type="number"
                min={20}
                max={1000}
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] text-[13.5px] text-[#102A52] focus:border-[#0878F9]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] text-[13.5px] text-[#102A52] focus:border-[#0878F9]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] text-[13.5px] text-[#102A52] focus:border-[#0878F9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
              Room / Wing
            </label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] text-[13.5px] text-[#102A52] focus:border-[#0878F9]"
            />
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-[9px] border border-[#DCEBFA] text-[13px] text-[#102A52] focus:border-[#0878F9]"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-[40px] px-5 rounded-[10px] border border-[#DCEBFA] bg-white text-[#5879A6] hover:text-[#102A52] text-[13px] font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[40px] px-6 rounded-[10px] bg-[#0878F9] hover:bg-[#0768D6] text-white text-[13px] font-bold shadow-2xs transition-all cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
