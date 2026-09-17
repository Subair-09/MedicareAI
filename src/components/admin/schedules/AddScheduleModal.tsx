import React, { useState } from 'react';
import { X, CalendarPlus } from 'lucide-react';
import { ScheduleAppointment, ScheduleStatus } from '../../../types';

interface AddScheduleModalProps {
  isOpen: boolean;
  availableDoctors?: string[];
  availableDepartments?: string[];
  onClose: () => void;
  onAddSchedule: (appointment: Omit<ScheduleAppointment, 'id'>) => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  availableDoctors,
  availableDepartments,
  onClose,
  onAddSchedule,
}) => {
  const deptOptions =
    availableDepartments && availableDepartments.length > 0
      ? Array.from(new Set(availableDepartments)).filter((d) => d !== 'All Departments')
      : [];

  const docOptions =
    availableDoctors && availableDoctors.length > 0
      ? Array.from(new Set(availableDoctors)).filter((d) => d !== 'All Doctors')
      : ['Attending Physician'];

  const [patientName, setPatientName] = useState('');
  const [department, setDepartment] = useState(deptOptions[0] || '');
  const [doctorName, setDoctorName] = useState(docOptions[0] || 'Attending Physician');
  const [dayOfWeek, setDayOfWeek] = useState<ScheduleAppointment['dayOfWeek']>('Monday');
  const [timeSlot, setTimeSlot] = useState('9:00 AM');
  const [exactTime, setExactTime] = useState('9:00 AM');
  const [status, setStatus] = useState<ScheduleStatus>('Confirmed');
  const [room, setRoom] = useState('Room 304');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    // Determine date based on day
    const dayDates: Record<string, string> = {
      Monday: 'Sep 15, 2025',
      Tuesday: 'Sep 16, 2025',
      Wednesday: 'Sep 17, 2025',
      Thursday: 'Sep 18, 2025',
      Friday: 'Sep 19, 2025',
      Saturday: 'Sep 20, 2025',
      Sunday: 'Sep 21, 2025',
    };

    onAddSchedule({
      dayOfWeek,
      date: dayDates[dayOfWeek] || 'Sep 15, 2025',
      time: exactTime || timeSlot,
      timeSlot,
      patientName: patientName.trim(),
      department,
      doctorName,
      status,
      room,
      notes: notes.trim() || 'Scheduled via Admin Dashboard',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[20px] border border-[#DCE9F8] shadow-[0_20px_50px_rgba(13,40,87,0.18)] max-w-lg w-full overflow-hidden text-left">
        {/* Modal Header */}
        <div className="px-6 py-4.5 border-b border-[#EAF2FB] flex items-center justify-between bg-[#F8FBFF]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center shadow-2xs">
              <CalendarPlus className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#0D2857]">
                Add Doctor Schedule
              </h3>
              <p className="text-[12px] text-[#5273A8]">
                Create a scheduled appointment slot
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Patient Name */}
          <div>
            <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1.5">
              Patient Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Kenneth Okonkwo"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full h-[40px] px-3.5 rounded-[10px] border border-[#DCE9F8] focus:border-[#0868F5] focus:outline-hidden text-[13px] text-[#0D2857]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Department */}
            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1.5">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#DCE9F8] focus:border-[#0868F5] focus:outline-hidden text-[13px] text-[#0D2857] bg-white cursor-pointer"
              >
                {deptOptions.length === 0 ? (
                  <option value="" disabled>
                    No departments configured
                  </option>
                ) : (
                  deptOptions.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1.5">
                Attending Doctor
              </label>
              <select
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#DCE9F8] focus:border-[#0868F5] focus:outline-hidden text-[13px] text-[#0D2857] bg-white cursor-pointer"
              >
                {docOptions.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Day of Week */}
            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1.5">
                Day of Week
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) =>
                  setDayOfWeek(e.target.value as ScheduleAppointment['dayOfWeek'])
                }
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#DCE9F8] focus:border-[#0868F5] focus:outline-hidden text-[13px] text-[#0D2857] bg-white cursor-pointer"
              >
                <option value="Monday">Monday (Sep 15)</option>
                <option value="Tuesday">Tuesday (Sep 16)</option>
                <option value="Wednesday">Wednesday (Sep 17)</option>
                <option value="Thursday">Thursday (Sep 18)</option>
                <option value="Friday">Friday (Sep 19)</option>
                <option value="Saturday">Saturday (Sep 20)</option>
                <option value="Sunday">Sunday (Sep 21)</option>
              </select>
            </div>

            {/* Time Slot Row */}
            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1.5">
                Time Slot Row
              </label>
              <select
                value={timeSlot}
                onChange={(e) => {
                  setTimeSlot(e.target.value);
                  setExactTime(e.target.value);
                }}
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#DCE9F8] focus:border-[#0868F5] focus:outline-hidden text-[13px] text-[#0D2857] bg-white cursor-pointer"
              >
                {[
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
                ].map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {/* Status */}
            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ScheduleStatus)}
                className="w-full h-[40px] px-3 rounded-[10px] border border-[#DCE9F8] focus:border-[#0868F5] focus:outline-hidden text-[13px] text-[#0D2857] bg-white cursor-pointer"
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Pending">Pending</option>
                <option value="Checked-in">Checked-in</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Room */}
            <div>
              <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1.5">
                Consultation Room
              </label>
              <input
                type="text"
                placeholder="e.g. Room 304"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-[10px] border border-[#DCE9F8] focus:border-[#0868F5] focus:outline-hidden text-[13px] text-[#0D2857]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[12.5px] font-semibold text-[#0D2857] mb-1.5">
              Consultation Notes / Reason
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Follow-up consultation and lab review..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-[10px] border border-[#DCE9F8] focus:border-[#0868F5] focus:outline-hidden text-[13px] text-[#0D2857] resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#EAF2FB]">
            <button
              type="button"
              onClick={onClose}
              className="h-[38px] px-4 rounded-[10px] border border-[#DCE9F8] text-[13px] font-semibold text-[#5273A8] hover:bg-[#F8FBFF] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-[38px] px-5 rounded-[10px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold shadow-2xs transition-all cursor-pointer"
            >
              Save Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
