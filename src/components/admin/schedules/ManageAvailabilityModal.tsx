import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, Check, UserX } from 'lucide-react';
import { DoctorScheduleSummary } from '../../../data/schedulesData';

interface ManageAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors: DoctorScheduleSummary[];
  onUpdateDoctors: (updated: DoctorScheduleSummary[]) => void;
}

export const ManageAvailabilityModal: React.FC<ManageAvailabilityModalProps> = ({
  isOpen,
  onClose,
  doctors,
  onUpdateDoctors,
}) => {
  const [localDoctors, setLocalDoctors] = useState<DoctorScheduleSummary[]>(doctors);

  useEffect(() => {
    setLocalDoctors(doctors);
  }, [doctors]);

  if (!isOpen) return null;

  const handleToggleStatus = (id: string) => {
    setLocalDoctors((prev) =>
      prev.map((doc) => {
        if (doc.id === id) {
          const nextStatus: DoctorScheduleSummary['status'] =
            doc.status === 'Available' ? 'In Consultation' : 'Available';
          return { ...doc, status: nextStatus };
        }
        return doc;
      })
    );
  };

  const handleHoursChange = (id: string, hours: string) => {
    setLocalDoctors((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, workingHours: hours } : doc))
    );
  };

  const handleSave = () => {
    onUpdateDoctors(localDoctors);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-[20px] border border-[#DCE9F8] shadow-[0_20px_50px_rgba(13,40,87,0.18)] max-w-xl w-full overflow-hidden text-left">
        <div className="px-6 py-4.5 border-b border-[#EAF2FB] flex items-center justify-between bg-[#F8FBFF]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center shadow-2xs">
              <SlidersHorizontal className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#0D2857]">
                Manage Doctor Availability
              </h3>
              <p className="text-[12px] text-[#5273A8]">
                Adjust working hours and active roster status
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

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {localDoctors.length === 0 ? (
            <div className="py-10 text-center text-[#5273A8]">
              <div className="w-12 h-12 rounded-full bg-[#EAF4FF] text-[#0868F5] flex items-center justify-center mx-auto mb-3">
                <UserX className="w-6 h-6" />
              </div>
              <p className="text-[14px] font-semibold text-[#0D2857]">
                No doctors found in directory
              </p>
              <p className="text-[12px] text-[#8AA3C6] mt-1">
                Doctors added in the Doctors section will be manageable here.
              </p>
            </div>
          ) : (
            localDoctors.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-[12px] border border-[#EAF2FB] bg-[#F8FBFF] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  {doc.avatar ? (
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-[#DCE9F8]"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#EAF4FF] text-[#0868F5] font-bold text-[14px] flex items-center justify-center border border-[#DCE9F8] shrink-0">
                      {doc.name.replace(/^Dr\.\s*/, '').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-[13.5px] font-bold text-[#0D2857]">
                      {doc.name}
                    </h4>
                    <p className="text-[11.5px] text-[#5273A8]">{doc.department}</p>
                    <p className="text-[10.5px] text-[#8AA3C6] mt-0.5">
                      {doc.workingDays}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <input
                    type="text"
                    value={doc.workingHours}
                    onChange={(e) => handleHoursChange(doc.id, e.target.value)}
                    className="h-[34px] px-2.5 w-40 rounded-[8px] border border-[#DCE9F8] text-[12px] text-[#0D2857] bg-white"
                  />

                  <button
                    type="button"
                    onClick={() => handleToggleStatus(doc.id)}
                    className={`h-[34px] px-3 rounded-[8px] text-[11px] font-bold border transition-colors cursor-pointer ${
                      doc.status === 'Available'
                        ? 'bg-[#E8F8F0] text-[#19B879] border-[#B7EDD2]'
                        : 'bg-[#FEF7EA] text-[#C05621] border-[#FDE6C2]'
                    }`}
                  >
                    {doc.status}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#EAF2FB] flex items-center justify-end gap-3 bg-[#F8FBFF]">
          <button
            type="button"
            onClick={onClose}
            className="h-[38px] px-4 rounded-[10px] border border-[#DCE9F8] text-[13px] font-semibold text-[#5273A8] hover:bg-[#F8FBFF] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="h-[38px] px-5 rounded-[10px] bg-[#0868F5] hover:bg-[#075edc] text-white text-[13px] font-semibold shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Availability</span>
          </button>
        </div>
      </div>
    </div>
  );
};
