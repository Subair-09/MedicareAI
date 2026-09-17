import React, { useState, useRef } from 'react';
import { X, UserPlus, Upload, Clock, Calendar, Check, Stethoscope, Cloud, Loader2 } from 'lucide-react';
import { AdminDoctor, WeeklyAvailability } from '../../../types';
import { DEFAULT_WEEKLY_AVAILABILITY } from '../../../data/doctorsData';
import { api } from '../../../services/api';


interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDoctor: (doctor: AdminDoctor) => void;
  departmentOptions?: string[];
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1594824813681-420b9e84b802?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
];

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  isOpen,
  onClose,
  onAddDoctor,
  departmentOptions = [],
}) => {
  const realDepts = departmentOptions.filter((d) => d !== 'All Departments');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [department, setDepartment] = useState(realDepts[0] || '');
  const [specialty, setSpecialty] = useState('General Physician');
  const [yearsOfExperience, setYearsOfExperience] = useState(8);
  const [consultationFee, setConsultationFee] = useState(150);
  const [imageUrl, setImageUrl] = useState(PRESET_AVATARS[0]);
  const [bio, setBio] = useState('');
  const [room, setRoom] = useState('Room 204 - Main Clinic');

  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadStatusText, setUploadStatusText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Availability schedule
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyAvailability>(
    DEFAULT_WEEKLY_AVAILABILITY
  );


  const handleCustomPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadStatusText('Please upload a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setIsUploadingPhoto(true);
    setUploadStatusText('Uploading to Cloudinary...');

    try {
      const base64Uri = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await api.uploadToCloudinary(base64Uri, {
        filename: `doctor_${Date.now()}_${file.name}`,
        folder: 'medicare_hospital/doctors',
        resourceType: 'image',
      });

      setImageUrl(res.result.secureUrl || res.result.url);
      setUploadStatusText('Stored in Cloudinary!');
      setTimeout(() => setUploadStatusText(null), 3000);
    } catch (err: any) {
      console.error('Doctor image upload error:', err);
      setUploadStatusText('Upload failed. Reverted to default avatar.');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  if (!isOpen) return null;

  const handleDayToggle = (day: keyof WeeklyAvailability) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: !prev[day].enabled,
      },
    }));
  };

  const handleTimeChange = (
    day: keyof WeeklyAvailability,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setWeeklySchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    // Generate active days label
    const enabledDays = (
      Object.keys(weeklySchedule) as (keyof WeeklyAvailability)[]
    ).filter((d) => weeklySchedule[d].enabled);

    let daysSummary = 'Mon - Fri';
    if (enabledDays.length === 5 && !weeklySchedule.Saturday.enabled && !weeklySchedule.Sunday.enabled) {
      daysSummary = 'Mon - Fri';
    } else if (enabledDays.length > 0) {
      const shortDays = enabledDays.map((d) => d.slice(0, 3));
      daysSummary = `${shortDays[0]} - ${shortDays[shortDays.length - 1]}`;
    }

    const newDoc: AdminDoctor = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      firstName,
      lastName,
      name: `Dr. ${firstName} ${lastName}`,
      email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@medicare.com`,
      phone: phone || '+1 (555) 000-0000',
      licenseNumber: licenseNumber || `MD-${Math.floor(10000 + Math.random() * 90000)}`,
      imageUrl: imageUrl || PRESET_AVATARS[0],
      departmentId: `dept-${department.toLowerCase().replace(/\s+/g, '-')}`,
      department,
      specialty: specialty || `${department} Specialist`,
      yearsOfExperience: Number(yearsOfExperience),
      experienceText: `${yearsOfExperience} years`,
      consultationFee: Number(consultationFee),
      feeText: `$${consultationFee}`,
      bio: bio || `Specialist in ${department} dedicated to providing compassionate patient care.`,
      status: 'Active',
      availabilityDisplay: {
        days: daysSummary,
        hours: '9:00 AM - 4:00 PM',
      },
      weeklyAvailability: weeklySchedule,
      room,
      rating: 5.0,
      upcomingAppointmentsCount: 0,
      completedAppointmentsCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onAddDoctor(newDoc);
    onClose();
  };

  const daysList: (keyof WeeklyAvailability)[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[16px] border border-[#DCEBFA] shadow-[0_20px_50px_rgba(16,42,82,0.18)] overflow-hidden my-6 animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCEBFA] flex items-center justify-between bg-[#F8FBFF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center">
              <UserPlus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#102A52]">Add New Doctor</h2>
              <p className="text-[12.5px] text-[#5879A6]">
                Register a new doctor to the hospital system.
              </p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Avatar Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[12.5px] font-semibold text-[#102A52]">
                Profile Photo (Cloudinary Storage)
              </label>
              {uploadStatusText && (
                <span className="text-[11.5px] font-medium text-[#0878F9]">
                  {uploadStatusText}
                </span>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCustomPhotoUpload}
              accept="image/*"
              className="hidden"
            />

            <div className="flex items-center gap-3.5 flex-wrap">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Selected preview"
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#0878F9] shadow-xs"
                />
                {isUploadingPhoto && (
                  <div className="absolute inset-0 bg-white/75 rounded-full flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-[#0878F9] animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload to Cloudinary button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="px-3 py-1.5 rounded-[8px] bg-[#EAF4FF] hover:bg-[#D5E8FF] border border-[#BFDBFE] text-[#0868F5] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Upload Custom Photo</span>
              </button>

              <span className="text-[11.5px] text-[#8AA3C6]">or choose preset:</span>

              <div className="flex flex-wrap gap-1.5">
                {PRESET_AVATARS.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(avatar)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform cursor-pointer ${
                      imageUrl === avatar ? 'border-[#0878F9] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={avatar} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>


          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                First Name <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Sarah"
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] bg-white text-[13.5px] text-[#102A52] focus:outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/10"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Last Name <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Johnson"
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] bg-white text-[13.5px] text-[#102A52] focus:outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/10"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@medicare.com"
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] bg-white text-[13.5px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] bg-white text-[13.5px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
          </div>

          {/* Department, Specialty & License */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-[40px] px-3 rounded-[9px] border border-[#DCEBFA] bg-white text-[13px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
              >
                {realDepts.length === 0 ? (
                  <option value="" disabled>
                    No departments configured
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
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Specialty
              </label>
              <input
                type="text"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="e.g. Dermatologist"
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] bg-white text-[13.5px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Medical License
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. MD-84920"
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] bg-white text-[13.5px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
          </div>

          {/* Experience, Fee, Room */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={yearsOfExperience}
                onChange={(e) => setYearsOfExperience(Number(e.target.value))}
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] bg-white text-[13.5px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
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
                step={5}
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] bg-white text-[13.5px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Assigned Clinic / Room
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Room 304 - Specialty Wing"
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] bg-white text-[13.5px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
              Doctor Bio / Clinical Focus
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Provide a summary of professional experience, board certifications, and clinical interests..."
              className="w-full p-3 rounded-[9px] border border-[#DCEBFA] bg-white text-[13px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
            />
          </div>

          {/* Working Days & Schedule */}
          <div className="p-4 rounded-[12px] bg-[#F8FBFF] border border-[#DCEBFA]">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#0878F9]" />
              <span className="text-[13px] font-bold text-[#102A52]">
                Weekly Working Days & Hours
              </span>
            </div>

            <div className="space-y-2">
              {daysList.map((day) => {
                const conf = weeklySchedule[day];
                return (
                  <div
                    key={day}
                    className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-[8px] bg-white border border-[#EBF3FB]"
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={conf.enabled}
                        onChange={() => handleDayToggle(day)}
                        className="w-4 h-4 text-[#0878F9] rounded"
                      />
                      <span
                        className={`text-[13px] font-medium ${
                          conf.enabled ? 'text-[#102A52]' : 'text-[#94A3B8]'
                        }`}
                      >
                        {day}
                      </span>
                    </label>

                    {conf.enabled && (
                      <div className="flex items-center gap-2 text-[12px] text-[#5879A6]">
                        <input
                          type="time"
                          value={conf.startTime}
                          onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                          className="h-[30px] px-2 rounded border border-[#DCEBFA] text-[#102A52] text-[12px]"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={conf.endTime}
                          onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                          className="h-[30px] px-2 rounded border border-[#DCEBFA] text-[#102A52] text-[12px]"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-[40px] px-5 rounded-[10px] border border-[#DCEBFA] bg-white text-[#5879A6] hover:bg-[#F8FBFF] hover:text-[#102A52] text-[13px] font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[40px] px-6 rounded-[10px] bg-[#0878F9] hover:bg-[#0768D6] text-white text-[13px] font-bold shadow-2xs transition-all cursor-pointer"
            >
              Add Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
