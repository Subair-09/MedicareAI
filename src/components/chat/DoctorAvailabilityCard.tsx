import React from 'react';
import { Star } from 'lucide-react';

export interface Slot {
  id: string;
  day: string;
  time: string;
}

interface DoctorAvailabilityCardProps {
  doctorName?: string;
  specialty?: string;
  rating?: number;
  reviewsCount?: number;
  imageUrl?: string;
  selectedSlotId?: string;
  onSelectSlot: (slot: Slot) => void;
  slots?: Slot[];
}

export const DoctorAvailabilityCard: React.FC<DoctorAvailabilityCardProps> = ({
  doctorName = 'Specialist Doctor',
  specialty = 'Clinical Specialist',
  rating = 5.0,
  reviewsCount = 0,
  imageUrl = '',
  selectedSlotId,
  onSelectSlot,
  slots
}) => {
  const defaultSlots: Slot[] = React.useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    
    const d1 = new Date(today);
    d1.setDate(today.getDate() + 1);
    const d1Str = `${days[d1.getDay()]}, ${months[d1.getMonth()]} ${d1.getDate()}`;
    
    const d2 = new Date(today);
    d2.setDate(today.getDate() + 2);
    const d2Str = `${days[d2.getDay()]}, ${months[d2.getMonth()]} ${d2.getDate()}`;

    return [
      { id: 'slot-1', day: d1Str, time: '9:00 AM' },
      { id: 'slot-2', day: d1Str, time: '11:30 AM' },
      { id: 'slot-3', day: d1Str, time: '2:00 PM' },
      { id: 'slot-4', day: d2Str, time: '10:00 AM' }
    ];
  }, []);

  const activeSlots = slots && slots.length > 0 ? slots : defaultSlots;

  return (
    <div className="bg-white rounded-2xl border border-[#E2EEFC] p-3.5 sm:p-4 text-left shadow-xs">
      {/* Doctor Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={imageUrl}
            alt={doctorName}
            referrerPolicy="no-referrer"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl object-cover border border-[#E2EEFC] shrink-0"
          />
          <div>
            <h4 className="text-[15px] sm:text-[16px] font-bold text-[#102A52] leading-tight">
              {doctorName}
            </h4>
            <p className="text-[12px] sm:text-[12.5px] text-[#64748B] mt-0.5">
              {specialty}
            </p>
            <div className="flex items-center gap-1 text-[11.5px] text-[#102A52] font-semibold mt-1">
              <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
              <span>{rating}</span>
              <span className="text-[#94A3B8] font-normal">({reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] sm:text-[11.5px] font-semibold bg-[#EAF9F1] text-[#20B879] border border-[#D1F2DF]">
          Available
        </span>
      </div>

      {/* Available Slots Title */}
      <div className="mt-3.5 mb-2">
        <span className="text-[12px] text-[#64748B] font-medium">
          Select preferred consultation time:
        </span>
      </div>

      {/* Slots Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {activeSlots.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onSelectSlot(slot)}
              className={`px-2.5 py-2 rounded-xl text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0878F9] text-white shadow-xs font-bold scale-[1.02]'
                  : 'bg-white hover:bg-[#F5FAFF] text-[#102A52] border border-[#D0E6FC] font-medium'
              }`}
            >
              <div
                className={`text-[11px] ${
                  isSelected ? 'text-white/90' : 'text-[#64748B]'
                }`}
              >
                {slot.day}
              </div>
              <div
                className={`text-[12.5px] font-bold mt-0.5 ${
                  isSelected ? 'text-white' : 'text-[#102A52]'
                }`}
              >
                {slot.time}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
