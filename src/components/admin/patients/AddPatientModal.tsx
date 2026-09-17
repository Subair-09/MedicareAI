import React, { useState } from 'react';
import { X, UserPlus, ChevronDown, Check } from 'lucide-react';
import { AdminPatient } from '../../../types';

interface AddPatientModalProps {
  isOpen: boolean;
  availableDepartments?: string[];
  onClose: () => void;
  onSavePatient: (patient: Omit<AdminPatient, 'id' | 'patientId'>) => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({
  isOpen,
  availableDepartments,
  onClose,
  onSavePatient,
}) => {
  const deptList =
    availableDepartments && availableDepartments.length > 0
      ? Array.from(new Set(availableDepartments)).filter((d) => d !== 'All Departments')
      : [];

  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState(deptList[0] || '');
  const [status, setStatus] = useState<'Active' | 'Pending' | 'Inactive'>('Active');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [genotype, setGenotype] = useState('AA');
  const [allergies, setAllergies] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Patient name is required';
    if (!age || Number(age) <= 0) newErrors.age = 'Valid age is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!email.trim()) newErrors.email = 'Email address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Pick avatar by gender
    const defaultMaleAvatar =
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80';
    const defaultFemaleAvatar =
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';

    onSavePatient({
      name: name.trim(),
      avatar: gender === 'Male' ? defaultMaleAvatar : defaultFemaleAvatar,
      age: Number(age),
      gender,
      phone: phone.trim(),
      email: email.trim(),
      department: department || 'General Medicine',
      lastVisit: 'Just registered',
      status,
      address: address.trim() || 'Lagos, Nigeria',
      emergencyContact: emergencyContact.trim() || 'Next of kin',
      bloodGroup,
      genotype,
      allergies: allergies ? allergies.split(',').map((s) => s.trim()) : ['None recorded'],
      notes: notes.trim(),
      registrationDate: new Date().toISOString().split('T')[0],
      recentActivityTime: 'Just now',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[20px] border border-[#DCEBFA] shadow-[0_20px_50px_rgba(13,40,87,0.18)] max-w-xl w-full overflow-hidden text-left">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E1EDF9] flex items-center justify-between bg-[#F8FBFF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center">
              <UserPlus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-[#0D2857]">
                Register New Patient
              </h3>
              <p className="text-[12px] text-[#5273A8]">
                Add a new patient record to MediCare Hospital database.
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

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Full Name */}
          <div>
            <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
              Full Name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chinedu Okafor"
              className={`w-full h-[40px] px-3.5 bg-white border ${
                errors.name ? 'border-[#EF4444]' : 'border-[#DCEBFA]'
              } rounded-[10px] text-[13.5px] text-[#0D2857] focus:outline-none focus:border-[#0868F5]`}
            />
            {errors.name && (
              <p className="text-[11px] text-[#EF4444] mt-1">{errors.name}</p>
            )}
          </div>

          {/* Row 2: Age, Gender & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                Age <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 32"
                className={`w-full h-[40px] px-3.5 bg-white border ${
                  errors.age ? 'border-[#EF4444]' : 'border-[#DCEBFA]'
                } rounded-[10px] text-[13.5px] text-[#0D2857] focus:outline-none focus:border-[#0868F5]`}
              />
              {errors.age && (
                <p className="text-[11px] text-[#EF4444] mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                Gender
              </label>
              <div className="relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                  className="w-full h-[40px] pl-3.5 pr-8 bg-white border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857] focus:outline-none focus:border-[#0868F5] appearance-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5273A8]" />
              </div>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                Department
              </label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-[40px] pl-3.5 pr-8 bg-white border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857] focus:outline-none focus:border-[#0868F5] appearance-none cursor-pointer"
                >
                  {deptList.length === 0 ? (
                    <option value="" disabled>
                      No departments configured
                    </option>
                  ) : (
                    deptList.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#5273A8]" />
              </div>
            </div>
          </div>

          {/* Row 3: Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                Phone Number <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+234 801 234 5678"
                className={`w-full h-[40px] px-3.5 bg-white border ${
                  errors.phone ? 'border-[#EF4444]' : 'border-[#DCEBFA]'
                } rounded-[10px] text-[13.5px] text-[#0D2857] focus:outline-none focus:border-[#0868F5]`}
              />
              {errors.phone && (
                <p className="text-[11px] text-[#EF4444] mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                Email Address <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient@email.com"
                className={`w-full h-[40px] px-3.5 bg-white border ${
                  errors.email ? 'border-[#EF4444]' : 'border-[#DCEBFA]'
                } rounded-[10px] text-[13.5px] text-[#0D2857] focus:outline-none focus:border-[#0868F5]`}
              />
              {errors.email && (
                <p className="text-[11px] text-[#EF4444] mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Row 4: Blood Group, Genotype, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full h-[40px] px-3 bg-white border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857]"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                Genotype
              </label>
              <select
                value={genotype}
                onChange={(e) => setGenotype(e.target.value)}
                className="w-full h-[40px] px-3 bg-white border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857]"
              >
                {['AA', 'AS', 'SS', 'AC', 'SC'].map((gt) => (
                  <option key={gt} value={gt}>
                    {gt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Active' | 'Pending' | 'Inactive')}
                className="w-full h-[40px] px-3 bg-white border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857]"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Row 5: Address & Emergency Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                Residential Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 14 Admiralty Way, Lekki, Lagos"
                className="w-full h-[40px] px-3.5 bg-white border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857]"
              />
            </div>

            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="Name & phone number"
                className="w-full h-[40px] px-3.5 bg-white border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857]"
              />
            </div>
          </div>

          {/* Row 6: Known Allergies */}
          <div>
            <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
              Known Allergies (comma separated)
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Aspirin, Latex (or None)"
              className="w-full h-[40px] px-3.5 bg-white border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857]"
            />
          </div>

          {/* Row 7: Clinical Notes */}
          <div>
            <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1">
              Clinical / Medical Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Initial complaints, past surgical history or notes"
              className="w-full p-3 bg-white border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857] leading-relaxed resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-[#E1EDF9] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-[8px] text-[13px] font-semibold text-[#5273A8] hover:bg-[#EAF4FF] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-[8px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Register Patient</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
