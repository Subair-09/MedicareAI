import React from 'react';
import { ScheduleAppointment, ScheduleStatus } from '../../../types';
import { Clock, MapPin, Stethoscope, CalendarX } from 'lucide-react';

interface DayCalendarProps {
  appointments: ScheduleAppointment[];
  onSelectAppointment: (appointment: ScheduleAppointment) => void;
  selectedDateText?: string;
  selectedDepartment: string;
  selectedDoctor: string;
}

const getStatusBadge = (status: ScheduleStatus) => {
  switch (status) {
    case 'Confirmed':
      return 'bg-[#E8F8F0] text-[#19B879] border-[#B7EDD2]';
    case 'Pending':
      return 'bg-[#FEF7EA] text-[#C05621] border-[#FDE6C2]';
    case 'Checked-in':
      return 'bg-[#EEF6FF] text-[#0868F5] border-[#CDE3FF]';
    case 'Rescheduled':
      return 'bg-[#F4F0FF] text-[#6938EF] border-[#DDD0FF]';
    case 'Cancelled':
      return 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]';
    default:
      return 'bg-[#F8FBFF] text-[#0868F5] border-[#DCE9F8]';
  }
};

export const DayCalendar: React.FC<DayCalendarProps> = ({
  appointments,
  onSelectAppointment,
  selectedDateText = 'Monday, Sep 15, 2025',
  selectedDepartment,
  selectedDoctor,
}) => {
  // Filter for matching department/doctor and day
  const dayAppointments = appointments.filter((apt) => {
    if (apt.dayOfWeek !== 'Monday') return false;
    if (selectedDepartment !== 'All Departments' && apt.department !== selectedDepartment)
      return false;
    if (selectedDoctor !== 'All Doctors' && apt.doctorName !== selectedDoctor) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-[16px] border border-[#DCE9F8] shadow-[0_2px_8px_rgba(13,40,87,0.03)] p-6 text-left">
      <div className="flex items-center justify-between pb-4 border-b border-[#EAF2FB] mb-6">
        <div>
          <h3 className="text-[17px] font-bold text-[#0D2857]">{selectedDateText}</h3>
          <p className="text-[12.5px] text-[#5273A8] mt-0.5">
            {dayAppointments.length} scheduled clinical consultations
          </p>
        </div>
      </div>

      {dayAppointments.length === 0 ? (
        <div className="py-12 text-center text-[#5273A8]">
          <div className="w-12 h-12 rounded-full bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center mx-auto mb-3">
            <CalendarX className="w-6 h-6" />
          </div>
          <p className="text-[14px] font-semibold text-[#0D2857]">
            No appointments scheduled for this day
          </p>
          <p className="text-[12px] text-[#8AA3C6] mt-1">
            Use the "Add Schedule" button to book an appointment.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {dayAppointments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => onSelectAppointment(apt)}
              className="p-4 rounded-[12px] border border-[#EAF2FB] hover:border-[#BBD8F5] hover:bg-[#F9FCFF] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group"
            >
              {/* Left: Time & Patient */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-14 rounded-[10px] bg-[#EAF4FF] text-[#0868F5] flex flex-col items-center justify-center font-bold text-[12px] shrink-0 border border-[#D0E3F9]">
                  <Clock className="w-4 h-4 mb-0.5" />
                  <span>{apt.time}</span>
                </div>

                <div className="flex items-center gap-3">
                  {apt.patientAvatar ? (
                    <img
                      src={apt.patientAvatar}
                      alt={apt.patientName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-[#DCE9F8]"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold text-[14px] flex items-center justify-center border border-[#DCE9F8] shrink-0">
                      {apt.patientName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-[14px] font-bold text-[#0D2857] group-hover:text-[#0868F5] transition-colors">
                      {apt.patientName}
                    </h4>
                    <div className="flex items-center gap-2 text-[12px] text-[#5273A8] mt-0.5">
                      <span className="font-medium text-[#0868F5]">{apt.department}</span>
                      <span>•</span>
                      <span>{apt.duration || '30 mins'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Middle: Doctor & Room */}
              <div className="flex items-center gap-6 text-[12.5px]">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#5273A8]" />
                  <span className="text-[#0D2857] font-semibold">
                    {apt.doctorName || 'Attending Physician'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[#5273A8]">
                  <MapPin className="w-3.5 h-3.5 text-[#8AA3C6]" />
                  <span>{apt.room || 'Suite 402'}</span>
                </div>
              </div>

              {/* Right: Status */}
              <div>
                <span
                  className={`inline-block text-[11px] font-bold px-3 py-1 rounded-full border ${getStatusBadge(
                    apt.status
                  )}`}
                >
                  {apt.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
