import React from 'react';
import { ScheduleAppointment } from '../../../types';

interface MonthCalendarProps {
  appointments: ScheduleAppointment[];
  onSelectAppointment: (appointment: ScheduleAppointment) => void;
  onSelectDay: (dayNumber: number) => void;
}

export const MonthCalendar: React.FC<MonthCalendarProps> = ({
  appointments,
  onSelectAppointment,
  onSelectDay,
}) => {
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const weekDayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="bg-white rounded-[16px] border border-[#DCE9F8] shadow-[0_2px_8px_rgba(13,40,87,0.03)] p-6 text-left">
      <div className="pb-4 border-b border-[#EAF2FB] mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-[17px] font-bold text-[#0D2857]">September 2025</h3>
          <p className="text-[12.5px] text-[#5273A8] mt-0.5">
            Overview of monthly clinical loads and patient allocations ({appointments.length} total scheduled)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-[#EAF2FB] text-center pb-2 text-[12.5px] font-bold text-[#0D2857]">
        {weekDayHeaders.map((header) => (
          <div key={header} className="py-2">
            {header}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-[#EAF2FB] border border-[#EAF2FB] rounded-[12px] overflow-hidden mt-2">
        {daysInMonth.map((day) => {
          // Find real appointments for this day of the month
          const dayAppointments = appointments.filter((apt) => {
            if (apt.date) {
              const match = apt.date.match(/\b0?(\d{1,2})\b/);
              if (match && parseInt(match[1], 10) === day) return true;
            }
            return false;
          });
          const count = dayAppointments.length;
          const isToday = day === 15;

          return (
            <div
              key={day}
              onClick={() => {
                if (dayAppointments.length > 0) {
                  onSelectAppointment(dayAppointments[0]);
                } else {
                  onSelectDay(day);
                }
              }}
              className={`min-h-[90px] p-2 transition-colors cursor-pointer text-left bg-white hover:bg-[#F9FCFF] flex flex-col justify-between ${
                isToday ? 'bg-[#F2F8FF]' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[12.5px] font-bold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    isToday
                      ? 'bg-[#0868F5] text-white'
                      : 'text-[#0D2857]'
                  }`}
                >
                  {day}
                </span>
                {count > 0 && (
                  <span className="text-[10.5px] font-semibold text-[#0868F5] bg-[#EAF4FF] px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
              </div>

              {count > 0 ? (
                <div className="space-y-1 mt-1">
                  <div className="text-[10px] bg-[#E8F8F0] text-[#19B879] px-1.5 py-0.5 rounded font-medium truncate">
                    {dayAppointments[0]?.patientName}
                  </div>
                  {count > 1 && (
                    <div className="text-[10px] text-[#5273A8] font-semibold pl-1">
                      +{count - 1} more
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-6" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
