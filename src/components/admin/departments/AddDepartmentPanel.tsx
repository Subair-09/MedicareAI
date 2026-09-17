import React, { useState } from 'react';
import { Plus, UserPlus, Info, ChevronDown, Check, Loader2 } from 'lucide-react';
import { AVAILABLE_LOCATIONS } from '../../../data/departmentsData';
import { AdminDepartment, AdminDoctor } from '../../../types';

interface AddDepartmentPanelProps {
  onSaveDepartment: (dept: Omit<AdminDepartment, 'id' | 'slug' | 'createdAt'>) => Promise<void> | void;
  availableDoctors?: AdminDoctor[];
  isSubmitting?: boolean;
}

const ICON_OPTIONS: Array<{
  type: AdminDepartment['iconType'];
  label: string;
  bg: string;
  color: string;
}> = [
  { type: 'stethoscope', label: 'General / Stethoscope', bg: '#EAF4FF', color: '#0878F9' },
  { type: 'heart', label: 'Cardiology / Heart', bg: '#FEECEE', color: '#EF4444' },
  { type: 'sparkles', label: 'Dermatology / Wellness', bg: '#F3EEFD', color: '#8B5CF6' },
  { type: 'baby', label: 'Pediatrics / Child Care', bg: '#EAF8F0', color: '#10B981' },
  { type: 'female', label: 'Gynecology / Women', bg: '#FDF0F6', color: '#EC4899' },
  { type: 'bone', label: 'Orthopedics / Bone', bg: '#E8F4FD', color: '#0284C7' },
  { type: 'scan', label: 'Radiology / Imaging', bg: '#F3EEFD', color: '#7C3AED' },
  { type: 'ribbon', label: 'Oncology / Cancer', bg: '#FFF3E6', color: '#F97316' },
  { type: 'ear', label: 'ENT / Ear Nose Throat', bg: '#E6FAFA', color: '#06B6D4' },
  { type: 'urology', label: 'Urology / Kidney', bg: '#F3EEFD', color: '#8B5CF6' },
  { type: 'stomach', label: 'Gastroenterology', bg: '#E8FAF7', color: '#0D9488' },
  { type: 'brain', label: 'Mental Health / Brain', bg: '#F3EEFD', color: '#7C3AED' },
];

export const AddDepartmentPanel: React.FC<AddDepartmentPanelProps> = ({
  onSaveDepartment,
  availableDoctors = [],
  isSubmitting = false,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [headDoctorChoice, setHeadDoctorChoice] = useState<string>('');
  const [customDocName, setCustomDocName] = useState('');
  const [customDocRole, setCustomDocRole] = useState('');
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<AdminDepartment['iconType']>('stethoscope');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const activeIconDef = ICON_OPTIONS.find((i) => i.type === selectedIcon) || ICON_OPTIONS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Department name is required';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (headDoctorChoice === 'custom' && !customDocName.trim()) {
      newErrors.headDoctor = 'Please provide a head doctor name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    let resolvedHeadDoc: AdminDepartment['headDoctor'];

    if (headDoctorChoice === 'custom') {
      resolvedHeadDoc = {
        id: `doc-${Date.now()}`,
        name: customDocName.trim(),
        role: customDocRole.trim() || 'Head of Department',
      };
    } else if (headDoctorChoice === 'unassigned' || !headDoctorChoice) {
      resolvedHeadDoc = {
        id: 'unassigned',
        name: 'To Be Assigned',
        role: 'Pending Assignment',
      };
    } else {
      const foundDoctor = availableDoctors.find((d) => d.id === headDoctorChoice);
      if (foundDoctor) {
        resolvedHeadDoc = {
          id: foundDoctor.id,
          name: foundDoctor.name,
          role: foundDoctor.specialty || 'Head Specialist',
          avatar: foundDoctor.avatar || foundDoctor.imageUrl,
        };
      } else {
        resolvedHeadDoc = {
          id: 'unassigned',
          name: 'To Be Assigned',
          role: 'Pending Assignment',
        };
      }
    }

    const resolvedLocation =
      location === 'custom'
        ? customLocation.trim() || 'General Medical Wing'
        : location || 'Building A - 1st Floor';

    try {
      await onSaveDepartment({
        name: name.trim(),
        description: description.trim(),
        iconType: selectedIcon,
        bgTint: activeIconDef.bg,
        iconColor: activeIconDef.color,
        headDoctor: resolvedHeadDoc,
        totalDoctors: headDoctorChoice && headDoctorChoice !== 'unassigned' ? 1 : 0,
        status,
        consultationLocation: resolvedLocation,
      });

      // Reset form
      setName('');
      setDescription('');
      setHeadDoctorChoice('');
      setCustomDocName('');
      setCustomDocRole('');
      setLocation('');
      setCustomLocation('');
      setSelectedIcon('stethoscope');
      setStatus('Active');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3500);
    } catch {
      // Error handled by parent
    }
  };

  return (
    <div className="w-full xl:w-[360px] shrink-0 space-y-4">
      {/* Success Notification Banner */}
      {showSuccessToast && (
        <div className="bg-[#E7F9F0] border border-[#A7F3D0] rounded-[12px] p-3 text-[13px] text-[#047857] flex items-center gap-2 animate-fadeIn">
          <div className="w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="font-medium">Department successfully saved and added to database!</span>
        </div>
      )}

      {/* Main Add Department Card */}
      <div className="bg-white border border-[#DCEBFA] rounded-[16px] p-5 sm:p-6 shadow-2xs">
        {/* Header with Circular Blue Plus Icon */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-9 h-9 rounded-full bg-[#0868F5] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-[#0D2857] leading-tight">
              Add Department
            </h2>
            <p className="text-[12px] text-[#5273A8] mt-1 leading-snug">
              Create a new department and assign a head doctor and services.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Field 1: Department Name * */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0D2857] mb-1.5">
              Department Name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
              }}
              placeholder="e.g. Cardiology"
              className={`w-full h-[42px] px-3.5 bg-white border ${
                errors.name ? 'border-[#EF4444]' : 'border-[#DCEBFA]'
              } rounded-[10px] text-[13.5px] text-[#0D2857] placeholder-[#94A3B8] focus:outline-none focus:border-[#0868F5] focus:ring-2 focus:ring-[#0868F5]/10 transition-all`}
            />
            {errors.name && (
              <p className="text-[11.5px] text-[#EF4444] mt-1 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Field 2: Description * */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0D2857] mb-1.5">
              Description <span className="text-[#EF4444]">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder="Brief description of the department's specialties..."
              className={`w-full p-3 bg-white border ${
                errors.description ? 'border-[#EF4444]' : 'border-[#DCEBFA]'
              } rounded-[10px] text-[13.5px] text-[#0D2857] placeholder-[#94A3B8] focus:outline-none focus:border-[#0868F5] focus:ring-2 focus:ring-[#0868F5]/10 transition-all resize-none leading-relaxed`}
            />
            {errors.description && (
              <p className="text-[11.5px] text-[#EF4444] mt-1 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Field 3: Icon & Specialty Category */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0D2857] mb-1.5">
              Specialty Category & Icon
            </label>
            <div className="relative">
              <select
                value={selectedIcon}
                onChange={(e) => setSelectedIcon(e.target.value as any)}
                className="w-full h-[42px] pl-3.5 pr-9 bg-white border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857] focus:outline-none focus:border-[#0868F5] focus:ring-2 focus:ring-[#0868F5]/10 transition-all appearance-none cursor-pointer"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.type} value={opt.type}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5273A8]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Field 4: Head Doctor */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0D2857] mb-1.5">
              Head Doctor
            </label>
            <div className="relative">
              <select
                value={headDoctorChoice}
                onChange={(e) => {
                  setHeadDoctorChoice(e.target.value);
                  if (errors.headDoctor) setErrors((prev) => ({ ...prev, headDoctor: '' }));
                }}
                className={`w-full h-[42px] pl-3.5 pr-9 bg-white border ${
                  errors.headDoctor ? 'border-[#EF4444]' : 'border-[#DCEBFA]'
                } rounded-[10px] text-[13.5px] text-[#0D2857] focus:outline-none focus:border-[#0868F5] focus:ring-2 focus:ring-[#0868F5]/10 transition-all appearance-none cursor-pointer`}
              >
                <option value="">Select head doctor...</option>
                <option value="unassigned">Assign later / No head doctor yet</option>
                {availableDoctors.length > 0 && (
                  <optgroup label="Registered Doctors">
                    {availableDoctors.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} — {doc.specialty}
                      </option>
                    ))}
                  </optgroup>
                )}
                <option value="custom">+ Enter custom doctor info</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5273A8]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            {errors.headDoctor && (
              <p className="text-[11.5px] text-[#EF4444] mt-1 font-medium">{errors.headDoctor}</p>
            )}

            {/* Custom Doctor inputs */}
            {headDoctorChoice === 'custom' && (
              <div className="mt-2.5 p-3 rounded-[10px] bg-[#F5FAFF] border border-[#DCEBFA] space-y-2 animate-fadeIn">
                <input
                  type="text"
                  placeholder="Doctor Name (e.g. Dr. Jane Doe)"
                  value={customDocName}
                  onChange={(e) => setCustomDocName(e.target.value)}
                  className="w-full h-[36px] px-3 bg-white border border-[#DCEBFA] rounded-[8px] text-[13px] text-[#0D2857] focus:outline-none focus:border-[#0868F5]"
                />
                <input
                  type="text"
                  placeholder="Role/Specialty (e.g. Lead Cardiologist)"
                  value={customDocRole}
                  onChange={(e) => setCustomDocRole(e.target.value)}
                  className="w-full h-[36px] px-3 bg-white border border-[#DCEBFA] rounded-[8px] text-[13px] text-[#0D2857] focus:outline-none focus:border-[#0868F5]"
                />
              </div>
            )}
          </div>

          {/* Field 5: Consultation Location */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0D2857] mb-1.5">
              Consultation Location
            </label>
            <div className="relative">
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-[42px] pl-3.5 pr-9 bg-white border border-[#DCEBFA] rounded-[10px] text-[13.5px] text-[#0D2857] focus:outline-none focus:border-[#0868F5] focus:ring-2 focus:ring-[#0868F5]/10 transition-all appearance-none cursor-pointer"
              >
                <option value="">Select location or wing...</option>
                {AVAILABLE_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
                <option value="custom">+ Specify custom location</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#5273A8]">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {location === 'custom' && (
              <input
                type="text"
                placeholder="Enter room or building details"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="mt-2 w-full h-[38px] px-3 bg-white border border-[#DCEBFA] rounded-[8px] text-[13px] text-[#0D2857] focus:outline-none focus:border-[#0868F5]"
              />
            )}
          </div>

          {/* Field 6: Status (Segmented Button ACTIVE | INACTIVE) */}
          <div>
            <label className="block text-[13px] font-semibold text-[#0D2857] mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 p-1 bg-[#F5FAFF] border border-[#DCEBFA] rounded-[11px] gap-1">
              <button
                type="button"
                onClick={() => setStatus('Active')}
                className={`h-[36px] rounded-[8px] text-[13px] font-semibold transition-all flex items-center justify-center cursor-pointer ${
                  status === 'Active'
                    ? 'bg-[#0868F5] text-white shadow-2xs'
                    : 'text-[#0D2857] hover:bg-white/60'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatus('Inactive')}
                className={`h-[36px] rounded-[8px] text-[13px] font-semibold transition-all flex items-center justify-center cursor-pointer ${
                  status === 'Inactive'
                    ? 'bg-[#0868F5] text-white shadow-2xs'
                    : 'text-[#5273A8] hover:bg-white/60'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Large full-width Save Department button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[46px] rounded-[10px] bg-[#0868F5] hover:bg-[#075edc] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 stroke-[2.2]" />
                  <span>Save Department</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Department Information Secondary Card */}
      <div className="bg-[#F8FBFF] border border-[#DCEBFA] rounded-[16px] p-5 shadow-2xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center shrink-0">
            <Info className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
          <h3 className="text-[14px] font-bold text-[#0D2857]">
            Department Management
          </h3>
        </div>
        <p className="text-[12px] text-[#5273A8] leading-relaxed pl-8">
          Departments organize hospital services and clinical teams. All created departments are
          persisted to the live database and instantly available across the booking portal and admin
          schedules.
        </p>
      </div>
    </div>
  );
};
