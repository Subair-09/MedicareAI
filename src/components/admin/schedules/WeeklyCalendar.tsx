import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ChevronDown,
} from 'lucide-react';
import { ScheduleAppointment, ScheduleStatus } from '../../../types';

interface WeeklyCalendarProps {
  appointments: ScheduleAppointment[];
  onSelectAppointment: (appointment: ScheduleAppointment) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  selectedDoctor: string;
  onDoctorChange: (doc: string) => void;
  onTodayClick: () => void;
  dateRangeLabel?: string;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  activeStatusFilter?: string;
  availableDepartments?: string[];
  availableDoctors?: string[];
}

const TIME_SLOTS = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
];

const DAYS_OF_WEEK = [
  { name: 'Mon', fullName: 'Monday', date: 'Sep 15' },
  { name: 'Tue', fullName: 'Tuesday', date: 'Sep 16' },
  { name: 'Wed', fullName: 'Wednesday', date: 'Sep 17' },
  { name: 'Thu', fullName: 'Thursday', date: 'Sep 18' },
  { name: 'Fri', fullName: 'Friday', date: 'Sep 19' },
  { name: 'Sat', fullName: 'Saturday', date: 'Sep 20' },
  { name: 'Sun', fullName: 'Sunday', date: 'Sep 21' },
];

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  appointments,
  onSelectAppointment,
  selectedDepartment,
  onDepartmentChange,
  selectedDoctor,
  onDoctorChange,
  onTodayClick,
  dateRangeLabel = 'Sep 15 – Sep 21, 2025',
  onPrevWeek,
  onNextWeek,
  activeStatusFilter = 'All',
  availableDepartments,
  availableDoctors,
}) => {
  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const [isDoctorDropdownOpen, setIsDoctorDropdownOpen] = useState(false);

  const departments = [
    'All Departments',
    ...(availableDepartments && availableDepartments.length > 0
      ? availableDepartments.filter((d) => d !== 'All Departments')
      : []),
  ];

  const doctors = [
    'All Doctors',
    ...(availableDoctors && availableDoctors.length > 0
      ? availableDoctors.filter((d) => d !== 'All Doctors')
      : [
          'Dr. Sarah Johnson',
          'Dr. Michael Brown',
          'Dr. Emily Carter',
          'Dr. James Wilson',
          'Dr. Babatunde Lawal',
          'Dr. Halima Yusuf',
          'Dr. David Adeleke',
          'Dr. Ngozi Eze',
        ]),
  ];

  // Helper: Card styling according to status
  const getCardStyle = (status: ScheduleStatus) => {
    switch (status) {
      case 'Confirmed':
        return {
          cardBg: 'bg-[#EAF8F1] hover:bg-[#DDF3E7] border-[#B7EDD2]',
          badgeBg: 'bg-[#D2F4E3] text-[#0E8A54]',
          timeText: 'text-[#0868F5]',
        };
      case 'Pending':
        return {
          cardBg: 'bg-[#FEF7EA] hover:bg-[#FDF0D9] border-[#FDE6C2]',
          badgeBg: 'bg-[#FEEBC8] text-[#C05621]',
          timeText: 'text-[#C05621]',
        };
      case 'Checked-in':
        return {
          cardBg: 'bg-[#EEF6FF] hover:bg-[#E0EFFF] border-[#CDE3FF]',
          badgeBg: 'bg-[#D9EBFF] text-[#0868F5]',
          timeText: 'text-[#0868F5]',
        };
      case 'Rescheduled':
        return {
          cardBg: 'bg-[#F4F0FF] hover:bg-[#ECE5FF] border-[#DDD0FF]',
          badgeBg: 'bg-[#E8DEFF] text-[#6938EF]',
          timeText: 'text-[#6938EF]',
        };
      case 'Cancelled':
        return {
          cardBg: 'bg-[#FEF2F2] hover:bg-[#FEE2E2] border-[#FECACA]',
          badgeBg: 'bg-[#FEE2E2] text-[#DC2626]',
          timeText: 'text-[#DC2626]',
        };
      default:
        return {
          cardBg: 'bg-[#F8FBFF] hover:bg-[#EAF4FF] border-[#DCE9F8]',
          badgeBg: 'bg-[#EAF4FF] text-[#0868F5]',
          timeText: 'text-[#0868F5]',
        };
    }
  };

  // Filter appointments based on dropdowns & quick stats filter
  const filteredAppointments = appointments.filter((apt) => {
    if (selectedDepartment !== 'All Departments' && apt.department !== selectedDepartment) {
      return false;
    }
    if (selectedDoctor !== 'All Doctors' && apt.doctorName !== selectedDoctor) {
      return false;
    }
    if (activeStatusFilter !== 'All' && apt.status !== activeStatusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="bg-white rounded-[16px] border border-[#DCE9F8] shadow-[0_2px_8px_rgba(13,40,87,0.03)] flex flex-col overflow-hidden text-left">
      {/* 1. Calendar Header Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#EAF2FB] flex flex-wrap items-center justify-between gap-3 bg-white">
        {/* Left: Previous / Next & Date Range */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onPrevWeek}
              className="w-8 h-8 rounded-[8px] border border-[#DCE9F8] flex items-center justify-center text-[#5273A8] hover:text-[#0868F5] hover:bg-[#F0F6FE] transition-colors cursor-pointer"
              title="Previous Week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onNextWeek}
              className="w-8 h-8 rounded-[8px] border border-[#DCE9F8] flex items-center justify-center text-[#5273A8] hover:text-[#0868F5] hover:bg-[#F0F6FE] transition-colors cursor-pointer"
              title="Next Week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[14.5px] sm:text-[15px] font-bold text-[#0D2857] select-none">
            {dateRangeLabel}
          </span>
        </div>

        {/* Right: Department Dropdown, Doctor Dropdown, and Today Button */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Department Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDeptDropdownOpen(!isDeptDropdownOpen);
                setIsDoctorDropdownOpen(false);
              }}
              className="h-[36px] px-3 rounded-[8px] border border-[#DCE9F8] bg-white hover:bg-[#F8FBFF] text-[12.5px] font-medium text-[#0D2857] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>{selectedDepartment}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#5273A8]" />
            </button>

            {isDeptDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsDeptDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-[10px] border border-[#DCE9F8] shadow-lg py-1.5 z-30 max-h-60 overflow-y-auto text-left">
                  {departments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => {
                        onDepartmentChange(dept);
                        setIsDeptDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-[12.5px] text-left transition-colors cursor-pointer ${
                        selectedDepartment === dept
                          ? 'bg-[#EAF4FF] text-[#0868F5] font-semibold'
                          : 'text-[#0D2857] hover:bg-[#F8FBFF]'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Doctor Filter */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsDoctorDropdownOpen(!isDoctorDropdownOpen);
                setIsDeptDropdownOpen(false);
              }}
              className="h-[36px] px-3 rounded-[8px] border border-[#DCE9F8] bg-white hover:bg-[#F8FBFF] text-[12.5px] font-medium text-[#0D2857] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>{selectedDoctor}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#5273A8]" />
            </button>

            {isDoctorDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsDoctorDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-[10px] border border-[#DCE9F8] shadow-lg py-1.5 z-30 max-h-60 overflow-y-auto text-left">
                  {doctors.map((doc) => (
                    <button
                      key={doc}
                      type="button"
                      onClick={() => {
                        onDoctorChange(doc);
                        setIsDoctorDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-1.5 text-[12.5px] text-left transition-colors cursor-pointer ${
                        selectedDoctor === doc
                          ? 'bg-[#EAF4FF] text-[#0868F5] font-semibold'
                          : 'text-[#0D2857] hover:bg-[#F8FBFF]'
                      }`}
                    >
                      {doc}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Today Button */}
          <button
            type="button"
            onClick={onTodayClick}
            className="h-[36px] px-3.5 rounded-[8px] border border-[#0868F5] bg-white hover:bg-[#EAF4FF] text-[#0868F5] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Today</span>
          </button>
        </div>
      </div>

      {/* 2. Scrollable Weekly Grid */}
      <div className="overflow-x-auto [scrollbar-width:thin]">
        <div className="min-w-[850px] w-full select-none">
          {/* Day Headers Row */}
          <div className="grid grid-cols-[68px_repeat(7,1fr)] border-b border-[#EAF2FB] bg-white sticky top-0 z-10">
            {/* Empty corner for time column */}
            <div className="p-3 border-r border-[#EAF2FB]" />

            {/* 7 Day Column Headers */}
            {DAYS_OF_WEEK.map((day) => (
              <div
                key={day.name}
                className="py-3 px-2 text-center border-r border-[#EAF2FB] last:border-r-0"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-[13px] font-bold text-[#0D2857]">
                    {day.name}
                  </span>
                  {day.name === 'Mon' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                  )}
                </div>
                <div className="text-[11.5px] text-[#5273A8] font-normal mt-0.5">
                  {day.date}
                </div>
              </div>
            ))}
          </div>

          {/* Time Slot Rows */}
          <div className="divide-y divide-[#EAF2FB]">
            {TIME_SLOTS.map((timeSlot) => (
              <div
                key={timeSlot}
                className="grid grid-cols-[68px_repeat(7,1fr)] min-h-[72px]"
              >
                {/* Time Label Column */}
                <div className="py-2.5 px-2 text-[11px] font-medium text-[#8AA3C6] border-r border-[#EAF2FB] flex items-start justify-center">
                  <span>{timeSlot}</span>
                </div>

                {/* Day Cells for this Hour */}
                {DAYS_OF_WEEK.map((day) => {
                  // Find appointments that fall in this day and slot
                  const cellAppointments = filteredAppointments.filter(
                    (apt) =>
                      apt.dayOfWeek === day.fullName && apt.timeSlot === timeSlot
                  );

                  return (
                    <div
                      key={day.name}
                      className="p-1 sm:p-1.5 border-r border-[#EAF2FB] last:border-r-0 relative hover:bg-[#FAFCFF] transition-colors"
                    >
                      {cellAppointments.map((apt) => {
                        const style = getCardStyle(apt.status);
                        return (
                          <div
                            key={apt.id}
                            onClick={() => onSelectAppointment(apt)}
                            className={`rounded-[10px] border p-2 shadow-2xs transition-all cursor-pointer group mb-1 ${style.cardBg}`}
                          >
                            {/* Top row: Avatar + Time */}
                            <div className="flex items-center gap-1.5 mb-1">
                              {apt.patientAvatar ? (
                                <img
                                  src={apt.patientAvatar}
                                  alt={apt.patientName}
                                  referrerPolicy="no-referrer"
                                  className="w-5 h-5 rounded-full object-cover shrink-0 border border-white"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-[#0868F5]/15 text-[#0868F5] font-bold text-[9px] flex items-center justify-center shrink-0 border border-white">
                                  {apt.patientName.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span
                                className={`text-[10.5px] font-bold leading-none ${style.timeText}`}
                              >
                                {apt.time}
                              </span>
                            </div>

                            {/* Middle: Patient Name */}
                            <div className="text-[11.5px] font-bold text-[#0D2857] truncate leading-tight group-hover:text-[#0868F5] transition-colors">
                              {apt.patientName}
                            </div>

                            {/* Department */}
                            <div className="text-[10px] text-[#5273A8] truncate leading-tight mt-0.5">
                              {apt.department}
                            </div>

                            {/* Status Badge */}
                            <div className="mt-1.5">
                              <span
                                className={`inline-block text-[9.5px] font-semibold px-2 py-0.5 rounded-full leading-tight ${style.badgeBg}`}
                              >
                                {apt.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Calendar Footer */}
      <div className="p-4 sm:px-6 border-t border-[#EAF2FB] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] bg-white">
        {/* Left: Total Appointments this week */}
        <div className="text-[#5273A8]">
          Total appointments this week:{' '}
          <span className="font-bold text-[#0D2857]">{filteredAppointments.length}</span>
        </div>

        {/* Right: Status Legend with Colored Dots */}
        <div className="flex items-center gap-4 flex-wrap text-[12px] text-[#5273A8]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#19B879]" />
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0868F5]" />
            <span>Checked-in</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7C4DFF]" />
            <span>Rescheduled</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            <span>Cancelled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
