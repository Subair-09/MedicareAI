import React, { useEffect, useState } from 'react';
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Key,
  Shield,
  Send,
  X,
  RefreshCw,
  Clock,
  User,
  Calendar,
  Check,
  AlertTriangle
} from 'lucide-react';
import { api } from '../../services/api';

interface ResendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResendStatusModal: React.FC<ResendStatusModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<{
    configured: boolean;
    fromEmail: string;
    recentLogs: Array<{
      id: string;
      type: 'booking' | 'reschedule' | 'cancellation' | 'test';
      recipient: string;
      patientName: string;
      appointmentId: string;
      doctorName: string;
      subject: string;
      timestamp: string;
      status: 'sent' | 'simulated' | 'failed';
      error?: string;
    }>;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('nuddywale@gmail.com');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    simulated?: boolean;
    message?: string;
    error?: string;
  } | null>(null);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await api.getEmailStatus();
      setStatus(res);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail.trim()) return;
    setTestLoading(true);
    setTestResult(null);
    try {
      const res = await api.sendTestEmail(testEmail.trim());
      setTestResult({
        success: res.success,
        simulated: res.simulated,
        message: res.simulated
          ? 'Email simulated locally (RESEND_API_KEY not yet configured in environment).'
          : 'Confirmation email successfully dispatched via Resend!',
        error: res.error,
      });
      // Refresh delivery logs
      await fetchStatus();
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Failed to dispatch test email',
      });
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] border border-[#E1EDF9] shadow-2xl max-w-2xl w-full p-6 text-left max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E1EDF9] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#EAF4FF] text-[#0878F9] flex items-center justify-center">
              <Mail className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-[17px] text-[#102A52] tracking-tight">
                Resend Email Delivery Center
              </h3>
              <p className="text-[12.5px] text-[#5879A6]">
                Automated booking, rescheduling, and cancellation patient notifications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-[10px] text-[#94A3B8] hover:text-[#102A52] hover:bg-[#F0F5FA] flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto py-4 space-y-4 pr-1 grow">
          {/* Status Alert Banner */}
          <div
            className={`p-4 rounded-[14px] border flex items-start gap-3.5 ${
              status?.configured
                ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                : 'bg-[#EFF6FF] border-[#BFDBFE] text-[#1E40AF]'
            }`}
          >
            {status?.configured ? (
              <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#0878F9] shrink-0 mt-0.5" />
            )}
            <div className="text-[13px] leading-relaxed">
              <span className="font-bold block text-[13.5px]">
                {status?.configured
                  ? 'Resend API Key Connected & Active'
                  : 'Resend Ready (Local Simulator Active)'}
              </span>
              {status?.configured ? (
                <span>
                  Real-time transactional emails are actively dispatched for every booking, reschedule, and cancellation.
                </span>
              ) : (
                <span>
                  Emails are generated and tracked in the hospital activity audit log. Add <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[11px] font-bold text-[#102A52]">RESEND_API_KEY</code> to send live production emails.
                </span>
              )}
            </div>
          </div>

          {/* Configuration Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 mb-1">
                <Key className="w-3.5 h-3.5 text-[#0878F9]" /> Service Provider
              </span>
              <div className="font-bold text-[#102A52] text-[13.5px]">Resend Transactional API</div>
              <div className="text-[11.5px] text-[#64748B]">SDK package installed</div>
            </div>

            <div className="p-3.5 rounded-[12px] bg-[#F8FAFC] border border-[#E2E8F0]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5 mb-1">
                <Shield className="w-3.5 h-3.5 text-[#0878F9]" /> Outbound From Address
              </span>
              <div className="font-bold text-[#102A52] text-[13px] truncate">
                {status?.fromEmail || 'MediCare Hospital <noreply@medicare.name.ng>'}
              </div>
              <div className="text-[11.5px] text-[#64748B]">Configured via RESEND_FROM_EMAIL</div>
            </div>
          </div>

          {/* Test Dispatch Form */}
          <div className="p-4 rounded-[14px] bg-white border border-[#E1EDF9] shadow-2xs">
            <h4 className="font-bold text-[13.5px] text-[#102A52] mb-1 flex items-center gap-1.5">
              <Send className="w-4 h-4 text-[#0878F9]" /> Send Verification Test Email
            </h4>
            <p className="text-[12px] text-[#5879A6] mb-3">
              Verify your Resend connection by sending a hospital verification message to any inbox.
            </p>

            <form onSubmit={handleSendTest} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="recipient@example.com"
                className="grow h-[38px] px-3 rounded-[10px] border border-[#E1EDF9] text-[13px] text-[#102A52] focus:outline-none focus:border-[#0878F9]"
                required
              />
              <button
                type="submit"
                disabled={testLoading}
                className="h-[38px] px-4 rounded-[10px] bg-[#0878F9] hover:bg-[#0768D6] text-white font-bold text-[12.5px] flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 transition-colors"
              >
                {testLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Dispatch Test
                  </>
                )}
              </button>
            </form>

            {testResult && (
              <div
                className={`mt-2.5 p-2.5 rounded-[10px] text-[12px] flex items-center gap-2 ${
                  testResult.success
                    ? 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                    : 'bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]'
                }`}
              >
                {testResult.success ? (
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />
                )}
                <span>{testResult.message || testResult.error}</span>
              </div>
            )}
          </div>

          {/* Recent Delivery Audit Log */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-[13.5px] text-[#102A52] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#5879A6]" /> Recent Patient Notification Dispatches
              </h4>
              <button
                onClick={fetchStatus}
                disabled={isLoading}
                className="text-[11.5px] font-semibold text-[#0878F9] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>

            {(!status?.recentLogs || status.recentLogs.length === 0) ? (
              <div className="p-6 text-center border border-dashed border-[#E2E8F0] rounded-[12px] text-[12.5px] text-[#94A3B8]">
                No email dispatches recorded yet in this session.
                <br />
                Book, reschedule, or cancel an appointment to view real-time delivery logs.
              </div>
            ) : (
              <div className="border border-[#E1EDF9] rounded-[12px] overflow-hidden">
                <div className="max-h-[220px] overflow-y-auto divide-y divide-[#F0F5FA]">
                  {status.recentLogs.map((log) => (
                    <div key={log.id} className="p-3 text-[12.5px] flex items-center justify-between hover:bg-[#F8FAFC]">
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase ${
                              log.type === 'booking'
                                ? 'bg-[#EAF4FF] text-[#0878F9]'
                                : log.type === 'reschedule'
                                ? 'bg-[#EFF6FF] text-[#0284C7]'
                                : log.type === 'cancellation'
                                ? 'bg-[#FEF2F2] text-[#DC2626]'
                                : 'bg-[#F1F5F9] text-[#475569]'
                            }`}
                          >
                            {log.type}
                          </span>
                          <span className="font-semibold text-[#102A52] truncate">
                            {log.patientName} ({log.appointmentId})
                          </span>
                        </div>
                        <div className="text-[#64748B] text-[11.5px] truncate">
                          To: <span className="font-mono text-[#102A52]">{log.recipient}</span> • Dr. {log.doctorName}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                            log.status === 'sent'
                              ? 'text-[#16A34A]'
                              : log.status === 'simulated'
                              ? 'text-[#0284C7]'
                              : 'text-[#DC2626]'
                          }`}
                        >
                          {log.status === 'sent' ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <Clock className="w-3.5 h-3.5" />
                          )}
                          {log.status === 'sent' ? 'Delivered' : log.status === 'simulated' ? 'Simulated' : 'Failed'}
                        </span>
                        <div className="text-[10px] text-[#94A3B8]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3.5 border-t border-[#E1EDF9] flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4.5 py-2 rounded-[10px] bg-[#F0F5FA] hover:bg-[#E1EDF9] text-[#102A52] font-bold text-[13px] cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
