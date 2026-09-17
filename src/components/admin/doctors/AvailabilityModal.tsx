import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { AdminDoctor, WeeklyAvailability, SpecificDateAvailability } from '../../../types';

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: AdminDoctor | null;
  onSaveAvailability: (
    doctor: AdminDoctor,
    weekly: WeeklyAvailability,
    specific: SpecificDateAvailability[]
  ) => void;
}

export const AvailabilityModal: React.FC<AvailabilityModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onSaveAvailability,
}) => {
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyAvailability | null>(null);
  const [specificDates, setSpecificDates] = useState<SpecificDateAvailability[]>([]);

  // Form for adding a specific date override
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState<'Available' | 'Unavailable' | 'Leave'>('Available');
  const [newStart, setNewStart] = useState('09:00');
  const [newEnd, setNewEnd] = useState('17:00');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (doctor) {
      setWeeklySchedule({ ...doctor.weeklyAvailability });
      setSpecificDates(doctor.specificAvailability ? [...doctor.specificAvailability] : []);
    }
  }, [doctor]);

  if (!isOpen || !doctor || !weeklySchedule) return null;

  const handleDayToggle = (day: keyof WeeklyAvailability) => {
    setWeeklySchedule((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [day]: {
          ...prev[day],
          enabled: !prev[day].enabled,
        },
      };
    });
  };

  const handleTimeChange = (
    day: keyof WeeklyAvailability,
    field: 'startTime' | 'endTime',
    value: string
  ) => {
    setWeeklySchedule((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [day]: {
          ...prev[day],
          [field]: value,
        },
      };
    });
  };

  const handleAddSpecificDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) return;
    const item: SpecificDateAvailability = {
      id: `override-${Date.now()}`,
      date: newDate,
      type: newType,
      startTime: newType === 'Available' ? newStart : undefined,
      endTime: newType === 'Available' ? newEnd : undefined,
      note: newNote || undefined,
    };
    setSpecificDates((prev) => [...prev, item]);
    setNewDate('');
    setNewNote('');
  };

  const handleRemoveSpecificDate = (id: string) => {
    setSpecificDates((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (!weeklySchedule) return;
    onSaveAvailability(doctor, weeklySchedule, specificDates);
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
              <Clock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#102A52]">Set Availability Schedule</h2>
              <p className="text-[12.5px] text-[#5879A6]">
                {doctor.name} · {doctor.department}
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-[13px]">
          {/* Weekly Repeating Hours */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-[14px] font-bold text-[#102A52]">Weekly Repeating Schedule</h3>
              <span className="text-[11.5px] text-[#5879A6]">Toggle days active & work shifts</span>
            </div>

            <div className="space-y-2">
              {daysList.map((day) => {
                const conf = weeklySchedule[day];
                return (
                  <div
                    key={day}
                    className={`flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-[9px] border transition-colors ${
                      conf.enabled
                        ? 'bg-[#F9FCFF] border-[#BFDBFE]'
                        : 'bg-[#FAFAFA] border-[#E2E8F0] opacity-75'
                    }`}
                  >
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={conf.enabled}
                        onChange={() => handleDayToggle(day)}
                        className="w-4 h-4 text-[#0878F9] rounded cursor-pointer"
                      />
                      <span
                        className={`text-[13px] font-semibold ${
                          conf.enabled ? 'text-[#102A52]' : 'text-[#94A3B8]'
                        }`}
                      >
                        {day}
                      </span>
                    </label>

                    {conf.enabled ? (
                      <div className="flex items-center gap-2 text-[12px] text-[#5879A6]">
                        <input
                          type="time"
                          value={conf.startTime}
                          onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                          className="h-[32px] px-2 rounded border border-[#DCEBFA] text-[#102A52] text-[12px] bg-white font-medium"
                        />
                        <span>to</span>
                        <input
                          type="time"
                          value={conf.endTime}
                          onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                          className="h-[32px] px-2 rounded border border-[#DCEBFA] text-[#102A52] text-[12px] bg-white font-medium"
                        />
                      </div>
                    ) : (
                      <span className="text-[12px] text-[#94A3B8] font-medium pr-2">Unavailable</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Specific Date Exceptions & Overrides */}
          <div className="pt-2 border-t border-[#EBF3FB]">
            <h3 className="text-[14px] font-bold text-[#102A52] mb-1">
              Specific Date Overrides & Special Hours
            </h3>
            <p className="text-[12px] text-[#5879A6] mb-3">
              Add custom availability or temporary unavailability on specific calendar dates.
            </p>

            {/* List existing overrides */}
            {specificDates.length > 0 && (
              <div className="mb-4 space-y-2">
                {specificDates.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-[8px] bg-[#F8FBFF] border border-[#DCEBFA]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#0878F9]" />
                      <span className="font-semibold text-[#102A52]">{item.date}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          item.type === 'Available'
                            ? 'bg-[#EAF8F1] text-[#20B879]'
                            : item.type === 'Leave'
                            ? 'bg-[#FFF3DC] text-[#D97706]'
                            : 'bg-[#FFECEF] text-[#EF4444]'
                        }`}
                      >
                        {item.type}
                      </span>
                      {item.startTime && (
                        <span className="text-[11.5px] text-[#5879A6]">
                          ({item.startTime} - {item.endTime})
                        </span>
                      )}
                      {item.note && (
                        <span className="text-[11.5px] text-[#5879A6] italic">
                          - {item.note}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecificDate(item.id)}
                      className="p-1 text-[#EF4444] hover:bg-[#FFECEF] rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Date Override Form */}
            <form
              onSubmit={handleAddSpecificDate}
              className="p-3.5 rounded-[10px] bg-[#F8FBFF] border border-[#DCEBFA] space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11.5px] font-medium text-[#5879A6] mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full h-[34px] px-2 rounded border border-[#DCEBFA] bg-white text-[12.5px] text-[#102A52]"
                  />
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium text-[#5879A6] mb-1">
                    Override Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) =>
                      setNewType(e.target.value as 'Available' | 'Unavailable' | 'Leave')
                    }
                    className="w-full h-[34px] px-2 rounded border border-[#DCEBFA] bg-white text-[12.5px] text-[#102A52]"
                  >
                    <option value="Available">Available (Custom Hours)</option>
                    <option value="Unavailable">Unavailable / Off</option>
                    <option value="Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11.5px] font-medium text-[#5879A6] mb-1">
                    Optional Note
                  </label>
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="e.g. Morning surgery only"
                    className="w-full h-[34px] px-2 rounded border border-[#DCEBFA] bg-white text-[12.5px] text-[#102A52]"
                  />
                </div>
              </div>

              {newType === 'Available' && (
                <div className="flex items-center gap-2 text-[12px] text-[#5879A6]">
                  <span>Custom Hours:</span>
                  <input
                    type="time"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="h-[30px] px-2 rounded border border-[#DCEBFA] bg-white text-[#102A52] text-[12px]"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="h-[30px] px-2 rounded border border-[#DCEBFA] bg-white text-[#102A52] text-[12px]"
                  />
                </div>
              )}

              <button
                type="submit"
                className="h-[32px] px-3.5 rounded-[7px] bg-white border border-[#DCEBFA] hover:border-[#0878F9] text-[#0878F9] text-[12px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Override</span>
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#DCEBFA] bg-[#F8FBFF] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-[40px] px-5 rounded-[10px] border border-[#DCEBFA] bg-white text-[#5879A6] hover:text-[#102A52] text-[13px] font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-[40px] px-6 rounded-[10px] bg-[#0878F9] hover:bg-[#0768D6] text-white text-[13px] font-bold shadow-2xs transition-all cursor-pointer"
          >
            Save Availability
          </button>
        </div>
      </div>
    </div>
  );
};
