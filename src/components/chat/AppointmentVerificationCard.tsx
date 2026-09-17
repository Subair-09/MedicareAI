import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, Loader2, CheckCircle2, AlertCircle, RefreshCw, Lock } from 'lucide-react';
import { api } from '../../services/api';

interface AppointmentVerificationCardProps {
  appointmentId: string;
  purpose: 'reschedule' | 'cancel';
  patientName?: string;
  maskedEmail?: string;
  doctorName?: string;
  department?: string;
  date?: string;
  time?: string;
  initialCode?: string;
  onVerified: (verificationToken: string) => void;
  onCancel?: () => void;
}

export const AppointmentVerificationCard: React.FC<AppointmentVerificationCardProps> = ({
  appointmentId,
  purpose,
  patientName,
  maskedEmail,
  doctorName,
  department,
  date,
  time,
  initialCode = '',
  onVerified,
  onCancel,
}) => {
  const [code, setCode] = useState(initialCode);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const actionVerb = purpose === 'cancel' ? 'cancel' : 'reschedule';
  const actionTitle = purpose === 'cancel' ? 'Cancellation' : 'Reschedule';

  // Cooldown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = code.trim().replace(/\s+/g, '');
    if (!cleanCode) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    if (cleanCode.length !== 6) {
      setErrorMessage('Verification code must be exactly 6 digits.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const res = await api.verifyAppointmentCode(appointmentId, cleanCode, purpose);
      if (res.verified && res.verificationToken) {
        setSuccessNotice('Identity successfully verified!');
        setTimeout(() => {
          onVerified(res.verificationToken!);
        }, 500);
      } else {
        setErrorMessage(res.error || 'Invalid code. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;
    setIsResending(true);
    setErrorMessage(null);

    try {
      const res = await api.sendAppointmentVerification(appointmentId, purpose);
      if (res.success) {
        setSuccessNotice(`New code dispatched to ${res.maskedEmail || maskedEmail || 'your email'}`);
        setCooldown(30); // 30 seconds cooldown
        setTimeout(() => setSuccessNotice(null), 4000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#BFDBFE] shadow-sm overflow-hidden text-left max-w-lg w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-4.5 py-3.5 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0878F9]/20 border border-[#0878F9]/40 flex items-center justify-center text-[#60A5FA]">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#93C5FD]">
              Identity Security Verification
            </div>
            <h4 className="text-[14.5px] font-bold text-white leading-tight">
              Authorize Appointment {actionTitle}
            </h4>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
            purpose === 'cancel' ? 'bg-[#DC2626]/30 text-[#FCA5A5] border border-[#DC2626]/50' : 'bg-[#0878F9]/30 text-[#93C5FD] border border-[#0878F9]/50'
          }`}
        >
          {purpose}
        </span>
      </div>

      {/* Appointment context summary */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[13px] text-[#334155]">
          <div className="flex items-center justify-between font-semibold pb-2 border-b border-[#E2E8F0] mb-2">
            <span className="text-[#64748B]">Reference Number:</span>
            <span className="font-bold text-[#0878F9] font-mono">{appointmentId}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[12.5px]">
            <div>
              <span className="text-[#64748B] block text-[11px]">Specialist:</span>
              <span className="font-semibold text-[#1E293B]">{doctorName || 'Consultant Specialist'}</span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[11px]">Department:</span>
              <span className="font-semibold text-[#1E293B]">{department || 'Outpatient Clinic'}</span>
            </div>
            {date && time && (
              <div className="col-span-2 pt-1 border-t border-[#F1F5F9]">
                <span className="text-[#64748B] block text-[11px]">Current Slot:</span>
                <span className="font-semibold text-[#1E293B]">{date} at {time}</span>
              </div>
            )}
          </div>
        </div>

        {/* Instructions banner */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-[12.5px] text-[#1E40AF]">
          <Mail className="w-4 h-4 text-[#0878F9] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Security code dispatched via Resend</span> to{' '}
            <strong className="text-[#0F172A]">{maskedEmail || 'your registered email'}</strong>.
            <div className="text-[11.5px] text-[#3B82F6] mt-0.5">
              Please enter the 6-digit code below to confirm you are authorized to {actionVerb} this appointment.
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleVerify} className="space-y-3">
          <div>
            <label className="block text-[12px] font-bold text-[#1E293B] uppercase tracking-wider mb-1.5">
              Enter 6-Digit Code
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6));
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="• • • • • •"
                className="w-full h-[48px] text-center text-[22px] tracking-[8px] font-mono font-bold text-[#0F172A] bg-white border-2 border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#0878F9] focus:ring-3 focus:ring-[#0878F9]/10 transition-all placeholder:text-[#CBD5E1]"
                autoFocus
              />
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] text-[12.5px] text-[#B91C1C]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F0FDF4] border border-[#86EFAC] text-[12.5px] text-[#15803D]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              type="submit"
              disabled={isVerifying || code.trim().length !== 6}
              className="flex-1 h-[42px] rounded-xl bg-[#0878F9] hover:bg-[#0768D6] disabled:bg-[#94A3B8] text-white text-[13.5px] font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Continue</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className="h-[42px] px-3.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] disabled:opacity-60 text-[#475569] text-[12.5px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Resend code via email"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>{cooldown > 0 ? `${cooldown}s` : 'Resend'}</span>
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="h-[42px] px-3 rounded-xl border border-transparent hover:bg-[#F1F5F9] text-[#64748B] text-[12.5px] font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
