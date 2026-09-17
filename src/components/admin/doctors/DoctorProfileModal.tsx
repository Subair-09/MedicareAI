import React from 'react';
import {
  X,
  Clock,
  Mail,
  Phone,
  Award,
  DollarSign,
  Calendar,
  Building,
  MapPin,
  Star,
  Edit2,
  CalendarOff,
  CheckCircle2
} from 'lucide-react';
import { AdminDoctor } from '../../../types';

interface DoctorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: AdminDoctor | null;
  onEdit: (doctor: AdminDoctor) => void;
  onSetAvailability: (doctor: AdminDoctor) => void;
  onSetLeave: (doctor: AdminDoctor) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onEdit,
  onSetAvailability,
  onSetLeave,
}) => {
  if (!isOpen || !doctor) return null;

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ] as const;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-[18px] border border-[#DCEBFA] shadow-[0_25px_60px_rgba(16,42,82,0.2)] overflow-hidden my-6 animate-fadeIn">
        {/* Header with Cover / Gradient Banner */}
        <div className="relative bg-gradient-to-r from-[#0878F9] to-[#06B6D4] px-6 pt-6 pb-14 text-white">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[12px] font-medium backdrop-blur-xs">
            <span>{doctor.department}</span>
            <span>·</span>
            <span>{doctor.id}</span>
          </div>
        </div>

        {/* Profile Card Header overlay */}
        <div className="px-6 -mt-10 mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            {doctor.imageUrl ? (
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md shrink-0 bg-white"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#EAF4FF] text-[#0878F9] font-bold text-2xl flex items-center justify-center border-4 border-white shadow-md shrink-0">
                {doctor.name ? doctor.name.replace(/^Dr\.\s*/, '').charAt(0) : 'D'}
              </div>
            )}
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-[#102A52] leading-tight">
                  {doctor.name}
                </h2>
                {doctor.status === 'Active' && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EAF8F1] text-[#20B879]">
                    Active
                  </span>
                )}
                {doctor.status === 'On Leave' && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFF3DC] text-[#D97706]">
                    On Leave
                  </span>
                )}
                {doctor.status === 'Inactive' && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFECEF] text-[#EF4444]">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#5879A6] font-medium">{doctor.specialty}</p>
            </div>
          </div>

          {/* Quick Action buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => onEdit(doctor)}
              className="h-[34px] px-3.5 rounded-[8px] border border-[#DCEBFA] bg-white hover:bg-[#F8FBFF] text-[#102A52] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#5879A6]" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => onSetAvailability(doctor)}
              className="h-[34px] px-3.5 rounded-[8px] bg-[#0878F9] hover:bg-[#0768D6] text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Availability</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-2 space-y-5 max-h-[60vh] overflow-y-auto text-[13px]">
          {/* Key Metrics strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-[10px] bg-[#F8FBFF] border border-[#DCEBFA]">
              <div className="text-[11.5px] text-[#5879A6]">Experience</div>
              <div className="text-[15px] font-bold text-[#102A52]">{doctor.experienceText}</div>
            </div>
            <div className="p-3 rounded-[10px] bg-[#F8FBFF] border border-[#DCEBFA]">
              <div className="text-[11.5px] text-[#5879A6]">Consultation Fee</div>
              <div className="text-[15px] font-bold text-[#102A52]">{doctor.feeText}</div>
            </div>
            <div className="p-3 rounded-[10px] bg-[#F8FBFF] border border-[#DCEBFA]">
              <div className="text-[11.5px] text-[#5879A6]">Patient Rating</div>
              <div className="text-[15px] font-bold text-[#102A52] flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                <span>{doctor.rating || 4.9}</span>
              </div>
            </div>
            <div className="p-3 rounded-[10px] bg-[#F8FBFF] border border-[#DCEBFA]">
              <div className="text-[11.5px] text-[#5879A6]">Appointments</div>
              <div className="text-[15px] font-bold text-[#102A52]">
                {doctor.upcomingAppointmentsCount || 12} upcoming
              </div>
            </div>
          </div>

          {/* Contact Details & Room */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-[12px] bg-white border border-[#EBF3FB]">
            <div className="flex items-center gap-3 text-[#102A52]">
              <Mail className="w-4 h-4 text-[#0878F9] shrink-0" />
              <div>
                <div className="text-[11px] text-[#5879A6]">Email</div>
                <div className="font-medium text-[12.5px]">{doctor.email}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#102A52]">
              <Phone className="w-4 h-4 text-[#0878F9] shrink-0" />
              <div>
                <div className="text-[11px] text-[#5879A6]">Phone</div>
                <div className="font-medium text-[12.5px]">{doctor.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#102A52]">
              <Award className="w-4 h-4 text-[#0878F9] shrink-0" />
              <div>
                <div className="text-[11px] text-[#5879A6]">License Number</div>
                <div className="font-medium text-[12.5px]">{doctor.licenseNumber}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[#102A52]">
              <MapPin className="w-4 h-4 text-[#0878F9] shrink-0" />
              <div>
                <div className="text-[11px] text-[#5879A6]">Clinic Location</div>
                <div className="font-medium text-[12.5px]">
                  {doctor.room || 'Room 304 - Specialty Wing'}
                </div>
              </div>
            </div>
          </div>

          {/* Leave Banner if on leave */}
          {doctor.leaveSchedule && (
            <div className="p-3.5 rounded-[12px] bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-3">
              <CalendarOff className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
              <div>
                <div className="text-[13px] font-bold text-[#92400E]">
                  Scheduled Leave: {doctor.leaveSchedule.startDate} to {doctor.leaveSchedule.endDate}
                </div>
                <div className="text-[12px] text-[#B45309] mt-0.5">
                  Reason: {doctor.leaveSchedule.reason}
                </div>
              </div>
            </div>
          )}

          {/* About / Bio */}
          <div>
            <h4 className="text-[13px] font-bold text-[#102A52] mb-1.5">About Doctor</h4>
            <p className="text-[12.5px] text-[#5879A6] leading-relaxed bg-[#F8FBFF] p-3.5 rounded-[10px] border border-[#DCEBFA]">
              {doctor.bio}
            </p>
          </div>

          {/* Weekly Schedule Overview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[13px] font-bold text-[#102A52] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#0878F9]" />
                <span>Weekly Working Hours</span>
              </h4>
              <span className="text-[12px] font-semibold text-[#0878F9]">
                {doctor.availabilityDisplay.days} · {doctor.availabilityDisplay.hours}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {days.map((day) => {
                const conf = doctor.weeklyAvailability?.[day];
                const isWorkDay = conf?.enabled;
                return (
                  <div
                    key={day}
                    className={`flex items-center justify-between px-3 py-2 rounded-[8px] text-[12px] border ${
                      isWorkDay
                        ? 'bg-[#F0FDF4] border-[#DCFCE7] text-[#166534]'
                        : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#94A3B8]'
                    }`}
                  >
                    <span className="font-semibold">{day}</span>
                    <span>
                      {isWorkDay ? `${conf.startTime} - ${conf.endTime}` : 'Off Duty'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#DCEBFA] bg-[#F8FBFF] flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSetLeave(doctor)}
            className="text-[12.5px] font-semibold text-[#D97706] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <CalendarOff className="w-4 h-4" />
            <span>{doctor.status === 'On Leave' ? 'Edit Leave' : 'Set Leave'}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-[38px] px-5 rounded-[9px] bg-[#102A52] hover:bg-[#1C3B6B] text-white text-[12.5px] font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
