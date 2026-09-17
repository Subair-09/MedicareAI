import React, { useState, useEffect } from 'react';
import { X, CalendarOff, Calendar, AlertCircle } from 'lucide-react';
import { AdminDoctor, LeaveSchedule } from '../../../types';

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: AdminDoctor | null;
  onSaveLeave: (doctor: AdminDoctor, leave: LeaveSchedule | null) => void;
}

export const LeaveModal: React.FC<LeaveModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onSaveLeave,
}) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (doctor?.leaveSchedule) {
      setStartDate(doctor.leaveSchedule.startDate);
      setEndDate(doctor.leaveSchedule.endDate);
      setReason(doctor.leaveSchedule.reason);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const inTwoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);
      setStartDate(today);
      setEndDate(inTwoWeeks);
      setReason('Annual Medical Leave / Sabbatical');
    }
  }, [doctor]);

  if (!isOpen || !doctor) return null;

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    const leave: LeaveSchedule = {
      id: doctor.leaveSchedule?.id || `leave-${Date.now()}`,
      startDate,
      endDate,
      reason: reason || 'Scheduled Leave',
      approvedAt: new Date().toISOString().slice(0, 10),
    };

    onSaveLeave(doctor, leave);
    onClose();
  };

  const handleEndLeave = () => {
    onSaveLeave(doctor, null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-[16px] border border-[#DCEBFA] shadow-[0_20px_50px_rgba(16,42,82,0.18)] overflow-hidden my-6 animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#DCEBFA] flex items-center justify-between bg-[#F8FBFF]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FFF3DC] text-[#D97706] flex items-center justify-center">
              <CalendarOff className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-[#102A52]">
                {doctor.status === 'On Leave' ? 'Manage Leave Schedule' : 'Schedule Doctor Leave'}
              </h2>
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

        {/* Body */}
        <form onSubmit={handleApplyLeave} className="p-6 space-y-4 text-[13px]">
          <div className="p-3 rounded-[10px] bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] flex items-start gap-2.5 text-[12px]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#D97706]" />
            <span>
              Setting a doctor on leave will automatically update their status to &ldquo;On Leave&rdquo;
              and mark their consultation slots as unavailable during this period.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                Start Date <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] bg-white text-[13px] text-[#102A52] focus:border-[#0878F9]"
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
                End Date <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-[40px] px-3.5 rounded-[9px] border border-[#DCEBFA] bg-white text-[13px] text-[#102A52] focus:border-[#0878F9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-semibold text-[#102A52] mb-1">
              Reason for Leave
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Annual Academic Conference, Maternity Leave, Medical Leave..."
              className="w-full p-3 rounded-[9px] border border-[#DCEBFA] bg-white text-[13px] text-[#102A52] focus:border-[#0878F9]"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#EBF3FB] flex items-center justify-between">
            {doctor.status === 'On Leave' ? (
              <button
                type="button"
                onClick={handleEndLeave}
                className="h-[38px] px-4 rounded-[9px] bg-[#EAF8F1] hover:bg-[#D1F2E2] text-[#20B879] text-[12.5px] font-bold transition-colors cursor-pointer"
              >
                End Leave & Make Active
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="h-[38px] px-4 rounded-[9px] border border-[#DCEBFA] text-[#5879A6] hover:text-[#102A52] text-[12.5px] font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-[38px] px-5 rounded-[9px] bg-[#D97706] hover:bg-[#B45309] text-white text-[12.5px] font-bold shadow-2xs transition-colors cursor-pointer"
              >
                Save Leave Schedule
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
