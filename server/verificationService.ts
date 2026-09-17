import crypto from 'crypto';
import { mongoDb } from './db';
import { emailService } from './emailService';
import { Appointment } from '../src/types';

export interface VerificationSession {
  appointmentId: string;
  code: string;
  purpose: 'reschedule' | 'cancel';
  patientName: string;
  patientEmail: string;
  createdAt: number;
  expiresAt: number;
  verified: boolean;
  verifiedAt?: number;
  verificationToken?: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
}

// In-memory verification storage indexed by normalized uppercase Appointment ID
const verificationStore = new Map<string, VerificationSession>();

/**
 * Mask an email address for privacy and security display
 * e.g., "nuddywale@gmail.com" -> "n***e@gmail.com"
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return 'your registered email';
  const [user, domain] = email.split('@');
  if (user.length <= 2) {
    return `${user[0]}***@${domain}`;
  }
  const first = user.slice(0, 1);
  const last = user.slice(-1);
  const stars = '*'.repeat(Math.min(user.length - 2, 4));
  return `${first}${stars}${last}@${domain}`;
}

export class VerificationService {
  /**
   * Generates a 6-digit OTP code, stores session, and sends security email via Resend
   */
  public async requestVerification(params: {
    appointmentId: string;
    purpose: 'reschedule' | 'cancel';
  }): Promise<{
    success: boolean;
    error?: string;
    maskedEmail?: string;
    expiresAt?: number;
    appointment?: Appointment;
    simulated?: boolean;
  }> {
    const rawId = params.appointmentId?.trim();
    if (!rawId) {
      return { success: false, error: 'Appointment Reference Number is required.' };
    }

    const key = rawId.toUpperCase();
    const appointments = await mongoDb.getAppointments();
    const apt = appointments.find(
      (a) => a.id?.toUpperCase() === key || a._id?.toString() === rawId
    );

    if (!apt) {
      return {
        success: false,
        error: `No appointment found with Reference ID "${rawId}". Please verify your appointment number (e.g., APT-2026-XXXX) from your confirmation email.`,
      };
    }

    if (apt.status === 'Cancelled') {
      return {
        success: false,
        error: `Appointment ${apt.id} is already cancelled and cannot be modified. If you need medical care, please book a new consultation.`,
      };
    }

    // Rate-limiting check: If an unexpired code was requested within the last 30 seconds
    const existing = verificationStore.get(key);
    if (existing && Date.now() - existing.createdAt < 30000 && Date.now() < existing.expiresAt) {
      const waitSec = Math.ceil((30000 - (Date.now() - existing.createdAt)) / 1000);
      return {
        success: false,
        error: `A verification code was recently dispatched. Please wait ${waitSec} seconds before requesting a new code.`,
      };
    }

    // Determine patient email
    let patientEmail = apt.patientEmail?.trim();
    if (!patientEmail) {
      const patients = await mongoDb.getPatients();
      const patient = patients.find((p) => p.id === apt.patientId || p.name?.toLowerCase() === apt.patientName?.toLowerCase());
      patientEmail = patient?.email?.trim();
    }

    if (!patientEmail) {
      patientEmail = 'patient@medicare.name.ng';
    }

    // Generate secure 6-digit numeric code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    const session: VerificationSession = {
      appointmentId: apt.id,
      code,
      purpose: params.purpose,
      patientName: apt.patientName || 'Patient',
      patientEmail,
      createdAt: Date.now(),
      expiresAt,
      verified: false,
      doctorName: apt.doctorName || 'Consultant Specialist',
      department: apt.department || 'Outpatient Clinic',
      date: apt.date,
      time: apt.time,
    };

    verificationStore.set(key, session);

    // Send email via Resend
    const emailResult = await emailService.sendVerificationCode({
      appointmentId: apt.id,
      patientName: session.patientName,
      patientEmail: session.patientEmail,
      code,
      purpose: params.purpose,
      doctorName: session.doctorName,
      department: session.department,
      date: session.date,
      time: session.time,
    });

    console.log(
      `[Verification] Dispatched code for appointment ${apt.id} (${params.purpose}) to ${patientEmail} (Simulated: ${!!emailResult.simulated})`
    );

    return {
      success: true,
      maskedEmail: maskEmail(patientEmail),
      expiresAt,
      appointment: apt,
      simulated: emailResult.simulated,
    };
  }

  /**
   * Validates the 6-digit code entered by the user
   */
  public verifyCode(params: {
    appointmentId: string;
    code: string;
    purpose?: 'reschedule' | 'cancel';
  }): {
    success: boolean;
    error?: string;
    verified: boolean;
    verificationToken?: string;
    appointmentId?: string;
  } {
    const rawId = params.appointmentId?.trim();
    const rawCode = params.code?.trim().replace(/\s+/g, '');

    if (!rawId || !rawCode) {
      return {
        success: false,
        verified: false,
        error: 'Both Appointment Reference and Verification Code are required.',
      };
    }

    const key = rawId.toUpperCase();
    const session = verificationStore.get(key);

    if (!session) {
      return {
        success: false,
        verified: false,
        error: 'No active verification code found for this appointment. Please request a new code.',
      };
    }

    if (Date.now() > session.expiresAt) {
      verificationStore.delete(key);
      return {
        success: false,
        verified: false,
        error: 'Verification code has expired (10-minute limit). Please request a new code.',
      };
    }

    if (session.code !== rawCode) {
      return {
        success: false,
        verified: false,
        error: 'Incorrect 6-digit verification code. Please verify the code sent to your email and try again.',
      };
    }

    // Code is valid! Issue short-lived verification token (15 mins)
    const verificationToken = `VT-${crypto.randomUUID()}`;
    session.verified = true;
    session.verifiedAt = Date.now();
    session.verificationToken = verificationToken;

    console.log(`[Verification] Successfully verified appointment ${session.appointmentId} for ${session.purpose}`);

    return {
      success: true,
      verified: true,
      verificationToken,
      appointmentId: session.appointmentId,
    };
  }

  /**
   * Check whether an appointment has been verified for modification recently
   */
  public isVerified(appointmentId: string, token?: string): boolean {
    const key = appointmentId?.trim().toUpperCase();
    const session = verificationStore.get(key);
    if (!session || !session.verified || !session.verifiedAt) return false;

    // Must be within 15 minutes of verification
    const isRecent = Date.now() - session.verifiedAt < 15 * 60 * 1000;
    if (!isRecent) {
      verificationStore.delete(key);
      return false;
    }

    if (token && session.verificationToken && token !== session.verificationToken) {
      return false;
    }

    return true;
  }

  /**
   * Consume / clear verification once the reschedule or cancellation completes
   */
  public consume(appointmentId: string): void {
    const key = appointmentId?.trim().toUpperCase();
    verificationStore.delete(key);
  }

  /**
   * Debug / admin view of active sessions
   */
  public getActiveCount(): number {
    return verificationStore.size;
  }
}

export const verificationService = new VerificationService();
