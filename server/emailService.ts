import { Resend } from 'resend';

export interface EmailLogEntry {
  id: string;
  type: 'booking' | 'reschedule' | 'cancellation' | 'verification' | 'test';
  recipient: string;
  patientName: string;
  appointmentId: string;
  doctorName: string;
  subject: string;
  timestamp: string;
  status: 'sent' | 'simulated' | 'failed';
  error?: string;
}

class EmailService {
  private resendClient: Resend | null = null;
  private recentLogs: EmailLogEntry[] = [];

  private getClient(): Resend | null {
    const rawKey = process.env.RESEND_API_KEY || '';
    const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');
    if (!apiKey) return null;
    if (!this.resendClient) {
      this.resendClient = new Resend(apiKey);
    }
    return this.resendClient;
  }

  private getFromEmail(): string {
    const rawFrom = process.env.RESEND_FROM_EMAIL?.trim().replace(/^["']|["']$/g, '');
    if (rawFrom) {
      return rawFrom;
    }
    return 'MediCare Hospital <noreply@medicare.name.ng>';
  }

  public getStatus() {
    const rawKey = process.env.RESEND_API_KEY || '';
    const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');
    const hasApiKey = Boolean(apiKey);
    const maskedKey = hasApiKey
      ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}`
      : 'Not configured';

    const currentFrom = this.getFromEmail();

    return {
      configured: hasApiKey,
      maskedApiKey: maskedKey,
      fromEmail: currentFrom,
      recentLogs: this.recentLogs.slice(0, 25),
      hint: !hasApiKey
        ? 'Set RESEND_API_KEY in your Vercel Environment Variables to enable live email delivery.'
        : `Sending from ${currentFrom}.`,
    };
  }

  /**
   * Internal helper that sends an email via Resend using the official hospital sender.
   */
  private async dispatchEmail(payload: {
    to: string;
    subject: string;
    html: string;
  }): Promise<{ success: boolean; data?: any; error?: string }> {
    const client = this.getClient();
    if (!client) {
      return { success: false, error: 'RESEND_API_KEY not configured' };
    }

    const fromAddress = this.getFromEmail();

    try {
      const result = await client.emails.send({
        from: fromAddress,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });

      if (!result.error) {
        return { success: true, data: result.data };
      }

      console.error(`[Resend Error with ${fromAddress}]:`, result.error);
      return { success: false, error: result.error.message };
    } catch (err: any) {
      console.error(`[Resend Exception with ${fromAddress}]:`, err.message || err);
      return { success: false, error: err.message || 'Unknown network error' };
    }
  }

  private logDelivery(entry: EmailLogEntry) {
    this.recentLogs.unshift(entry);
    if (this.recentLogs.length > 50) {
      this.recentLogs.pop();
    }
  }

  // 1. Send Booking Confirmation Email
  public async sendBookingConfirmation(appointment: {
    id: string;
    patientName: string;
    patientEmail?: string;
    patientPhone?: string;
    doctorName: string;
    doctorSpecialty?: string;
    department: string;
    date: string;
    time: string;
    room?: string;
    fee?: string;
    notes?: string;
  }): Promise<{ success: boolean; simulated?: boolean; messageId?: string; error?: string }> {
    const recipient = appointment.patientEmail?.trim();
    const logId = `EMAIL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const subject = `Appointment Confirmed: ${appointment.doctorName} on ${appointment.date} at ${appointment.time} [${appointment.id}]`;

    if (!recipient) {
      console.log(`[Resend] No patient email provided for appointment ${appointment.id}, skipping notification.`);
      return { success: false, error: 'No patient email provided' };
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #0878F9 0%, #0353B5 100%); padding: 32px 28px; text-align: center; color: #FFFFFF;">
      <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase;">
        MediCare Hospital
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">Appointment Confirmed</h1>
      <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Your hospital consultation is successfully booked.</p>
    </div>

    <!-- Main Content Body -->
    <div style="padding: 28px;">
      <p style="font-size: 15px; margin: 0 0 16px; color: #334155;">
        Dear <strong>${appointment.patientName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px; color: #475569;">
        Thank you for booking with MediCare Hospital. Your appointment has been registered in our official hospital system. Below are your consultation details:
      </p>

      <!-- Appointment Summary Card -->
      <div style="background: #F0F7FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <tr>
            <td style="padding: 6px 0; color: #64748B; width: 40%;">Appointment Ref:</td>
            <td style="padding: 6px 0; color: #0878F9; font-weight: 700;">${appointment.id}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Specialist Doctor:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${appointment.doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Department:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.department}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Date:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${appointment.date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Time:</td>
            <td style="padding: 6px 0; color: #0878F9; font-weight: 700;">${appointment.time}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Location & Room:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.room || `${appointment.department} Suite`}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Consultation Fee:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${appointment.fee || '$150'}</td>
          </tr>
          ${
            appointment.notes
              ? `<tr>
            <td style="padding: 6px 0; color: #64748B;">Reason / Notes:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.notes}</td>
          </tr>`
              : ''
          }
        </table>
      </div>

      <!-- Preparation Instructions -->
      <div style="border-left: 4px solid #0878F9; background: #F8FAFC; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
        <h4 style="margin: 0 0 6px; font-size: 13.5px; font-weight: 700; color: #0F172A;">Important Visit Guidelines:</h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #475569; line-height: 1.6;">
          <li>Please arrive 15 minutes before your scheduled appointment for check-in.</li>
          <li>Bring a government-issued photo ID and your insurance card.</li>
          <li>Bring any previous diagnostic records, imaging scans, or medications you are currently taking.</li>
        </ul>
      </div>

      <p style="font-size: 13px; line-height: 1.5; color: #64748B; margin: 0 0 8px;">
        Need to reschedule or cancel? You can chat with <strong>MediCare AI</strong> directly on our website, or call our 24/7 Front Desk.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 28px; text-align: center; font-size: 12px; color: #94A3B8;">
      <p style="margin: 0 0 4px; font-weight: 600; color: #64748B;">MediCare Hospital • Main Medical Campus</p>
      <p style="margin: 0 0 8px;">Campus Way, Main Medical Center • Emergency 24/7: (555) 911-MEDI</p>
      <p style="margin: 0; font-size: 11px;">This automated notification was delivered via Resend on behalf of MediCare Hospital.</p>
    </div>
  </div>
</body>
</html>
`;

    const client = this.getClient();
    if (!client) {
      console.log(`[Resend Simulated] RESEND_API_KEY not configured. Simulated booking confirmation to ${recipient} (Ref: ${appointment.id})`);
      this.logDelivery({
        id: logId,
        type: 'booking',
        recipient,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        subject,
        timestamp: new Date().toISOString(),
        status: 'simulated',
      });
      return { success: true, simulated: true };
    }

    const response = await this.dispatchEmail({
      to: recipient,
      subject,
      html: htmlContent,
    });

    if (!response.success) {
      console.error('[Resend Error sending booking email]:', response.error);
      this.logDelivery({
        id: logId,
        type: 'booking',
        recipient,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        subject,
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: response.error,
      });
      return { success: false, error: response.error };
    }

    console.log(`[Resend] Successfully sent booking confirmation to ${recipient} (Ref: ${appointment.id}, MessageId: ${response.data?.id})`);
    this.logDelivery({
      id: response.data?.id || logId,
      type: 'booking',
      recipient,
      patientName: appointment.patientName,
      appointmentId: appointment.id,
      doctorName: appointment.doctorName,
      subject,
      timestamp: new Date().toISOString(),
      status: 'sent',
    });
    return { success: true, messageId: response.data?.id };
  }

  // 2. Send Reschedule Confirmation Email
  public async sendRescheduleConfirmation(appointment: {
    id: string;
    patientName: string;
    patientEmail?: string;
    doctorName: string;
    department: string;
    newDate: string;
    newTime: string;
    previousDate?: string;
    previousTime?: string;
    room?: string;
  }): Promise<{ success: boolean; simulated?: boolean; messageId?: string; error?: string }> {
    const recipient = appointment.patientEmail?.trim();
    const logId = `EMAIL-RESCHED-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const subject = `Appointment Rescheduled: ${appointment.doctorName} - New Date: ${appointment.newDate} at ${appointment.newTime} [${appointment.id}]`;

    if (!recipient) {
      console.log(`[Resend] No email provided for rescheduled appointment ${appointment.id}, skipping.`);
      return { success: false, error: 'No patient email provided' };
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); padding: 32px 28px; text-align: center; color: #FFFFFF;">
      <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase;">
        MediCare Hospital
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">Appointment Rescheduled</h1>
      <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Your consultation time has been successfully updated.</p>
    </div>

    <!-- Content -->
    <div style="padding: 28px;">
      <p style="font-size: 15px; margin: 0 0 16px; color: #334155;">
        Dear <strong>${appointment.patientName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 20px; color: #475569;">
        Your appointment with <strong>${appointment.doctorName}</strong> has been successfully rescheduled. Please review your updated time slot below:
      </p>

      <!-- Comparison Box -->
      <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <tr>
            <td style="padding: 6px 0; color: #64748B; width: 40%;">Appointment Ref:</td>
            <td style="padding: 6px 0; color: #0284C7; font-weight: 700;">${appointment.id}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Specialist:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${appointment.doctorName} (${appointment.department})</td>
          </tr>
          ${
            appointment.previousDate && appointment.previousTime
              ? `<tr>
            <td style="padding: 6px 0; color: #94A3B8;">Previous Slot:</td>
            <td style="padding: 6px 0; color: #94A3B8; text-decoration: line-through;">${appointment.previousDate} at ${appointment.previousTime}</td>
          </tr>`
              : ''
          }
          <tr>
            <td style="padding: 6px 0; color: #0284C7; font-weight: 700;">NEW Date:</td>
            <td style="padding: 6px 0; color: #0284C7; font-weight: 800; font-size: 15px;">${appointment.newDate}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #0284C7; font-weight: 700;">NEW Time:</td>
            <td style="padding: 6px 0; color: #0284C7; font-weight: 800; font-size: 15px;">${appointment.newTime}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Clinic Location:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.room || `${appointment.department} Suite`}</td>
          </tr>
        </table>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; color: #475569;">
        <strong>Need another adjustment?</strong> You can update or cancel this booking at any time with no fees through MediCare AI or front-desk reception.
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 28px; text-align: center; font-size: 12px; color: #94A3B8;">
      <p style="margin: 0 0 4px; font-weight: 600; color: #64748B;">MediCare Hospital • Main Medical Campus</p>
      <p style="margin: 0 0 8px;">Campus Way, Main Medical Center • Emergency 24/7: (555) 911-MEDI</p>
      <p style="margin: 0; font-size: 11px;">Delivered via Resend for MediCare Hospital.</p>
    </div>
  </div>
</body>
</html>
`;

    const client = this.getClient();
    if (!client) {
      console.log(`[Resend Simulated] RESEND_API_KEY not configured. Simulated reschedule notification to ${recipient} (Ref: ${appointment.id})`);
      this.logDelivery({
        id: logId,
        type: 'reschedule',
        recipient,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        subject,
        timestamp: new Date().toISOString(),
        status: 'simulated',
      });
      return { success: true, simulated: true };
    }

    const response = await this.dispatchEmail({
      to: recipient,
      subject,
      html: htmlContent,
    });

    if (!response.success) {
      console.error('[Resend Error sending reschedule email]:', response.error);
      this.logDelivery({
        id: logId,
        type: 'reschedule',
        recipient,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        subject,
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: response.error,
      });
      return { success: false, error: response.error };
    }

    console.log(`[Resend] Successfully sent reschedule confirmation to ${recipient} (Ref: ${appointment.id})`);
    this.logDelivery({
      id: response.data?.id || logId,
      type: 'reschedule',
      recipient,
      patientName: appointment.patientName,
      appointmentId: appointment.id,
      doctorName: appointment.doctorName,
      subject,
      timestamp: new Date().toISOString(),
      status: 'sent',
    });
    return { success: true, messageId: response.data?.id };
  }

  // 3. Send Cancellation Confirmation Email
  public async sendCancellationConfirmation(appointment: {
    id: string;
    patientName: string;
    patientEmail?: string;
    doctorName: string;
    department: string;
    date: string;
    time: string;
    reason?: string;
  }): Promise<{ success: boolean; simulated?: boolean; messageId?: string; error?: string }> {
    const recipient = appointment.patientEmail?.trim();
    const logId = `EMAIL-CANCEL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const subject = `Appointment Cancelled: Confirmation for Ref [${appointment.id}]`;

    if (!recipient) {
      console.log(`[Resend] No email provided for cancelled appointment ${appointment.id}, skipping.`);
      return { success: false, error: 'No patient email provided' };
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%); padding: 32px 28px; text-align: center; color: #FFFFFF;">
      <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase;">
        MediCare Hospital
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">Appointment Cancelled</h1>
      <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Your scheduled appointment has been officially cancelled.</p>
    </div>

    <!-- Content -->
    <div style="padding: 28px;">
      <p style="font-size: 15px; margin: 0 0 16px; color: #334155;">
        Dear <strong>${appointment.patientName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 20px; color: #475569;">
        This email confirms that your appointment scheduled with <strong>${appointment.doctorName}</strong> has been cancelled in our records as requested. <strong>No cancellation penalty or fee applies.</strong>
      </p>

      <!-- Details Box -->
      <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <tr>
            <td style="padding: 6px 0; color: #64748B; width: 40%;">Cancelled Ref ID:</td>
            <td style="padding: 6px 0; color: #DC2626; font-weight: 700;">${appointment.id}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Doctor:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${appointment.doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Department:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.department}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Original Schedule:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.date} at ${appointment.time}</td>
          </tr>
          ${
            appointment.reason
              ? `<tr>
            <td style="padding: 6px 0; color: #64748B;">Reason:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.reason}</td>
          </tr>`
              : ''
          }
        </table>
      </div>

      <p style="font-size: 13.5px; line-height: 1.6; color: #475569; margin: 0 0 20px;">
        If you require medical attention in the future, you can easily book another appointment anytime through <strong>MediCare AI</strong> on our hospital portal.
      </p>

      <div style="background: #F8FAFC; border-left: 4px solid #EF4444; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 12.5px; color: #64748B;">
        <strong>Emergency Care:</strong> If you are experiencing sudden severe pain or emergency symptoms, please call 911 or visit our 24/7 Emergency Room immediately.
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 28px; text-align: center; font-size: 12px; color: #94A3B8;">
      <p style="margin: 0 0 4px; font-weight: 600; color: #64748B;">MediCare Hospital • Main Medical Campus</p>
      <p style="margin: 0 0 8px;">Campus Way, Main Medical Center • Emergency 24/7: (555) 911-MEDI</p>
      <p style="margin: 0; font-size: 11px;">Delivered via Resend for MediCare Hospital.</p>
    </div>
  </div>
</body>
</html>
`;

    const client = this.getClient();
    if (!client) {
      console.log(`[Resend Simulated] RESEND_API_KEY not configured. Simulated cancellation email to ${recipient} (Ref: ${appointment.id})`);
      this.logDelivery({
        id: logId,
        type: 'cancellation',
        recipient,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        subject,
        timestamp: new Date().toISOString(),
        status: 'simulated',
      });
      return { success: true, simulated: true };
    }

    const response = await this.dispatchEmail({
      to: recipient,
      subject,
      html: htmlContent,
    });

    if (!response.success) {
      console.error('[Resend Error sending cancellation email]:', response.error);
      this.logDelivery({
        id: logId,
        type: 'cancellation',
        recipient,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        subject,
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: response.error,
      });
      return { success: false, error: response.error };
    }

    console.log(`[Resend] Successfully sent cancellation confirmation to ${recipient} (Ref: ${appointment.id})`);
    this.logDelivery({
      id: response.data?.id || logId,
      type: 'cancellation',
      recipient,
      patientName: appointment.patientName,
      appointmentId: appointment.id,
      doctorName: appointment.doctorName,
      subject,
      timestamp: new Date().toISOString(),
      status: 'sent',
    });
    return { success: true, messageId: response.data?.id };
  }

  // 4. Send 2FA Verification Code Email for Rescheduling or Cancellation
  public async sendVerificationCode(params: {
    appointmentId: string;
    patientName: string;
    patientEmail: string;
    code: string;
    purpose: 'reschedule' | 'cancel';
    doctorName: string;
    department: string;
    date: string;
    time: string;
  }): Promise<{ success: boolean; simulated?: boolean; messageId?: string; error?: string }> {
    const recipient = params.patientEmail.trim();
    const logId = `EMAIL-VERIFY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const actionName = params.purpose === 'cancel' ? 'Cancellation' : 'Reschedule';
    const actionVerb = params.purpose === 'cancel' ? 'cancel' : 'reschedule';
    const subject = `MediCare Verification Code: ${params.code} to ${actionName} Appointment [${params.appointmentId}]`;

    if (!recipient) {
      return { success: false, error: 'No patient email provided' };
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B;">
  <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Security Header -->
    <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 30px 24px; text-align: center; color: #FFFFFF;">
      <div style="display: inline-block; background: rgba(8, 120, 249, 0.25); border: 1px solid rgba(8, 120, 249, 0.5); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase; color: #60A5FA;">
        MediCare Security Verification
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Identity Authorization Code</h1>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #94A3B8;">Required to confirm appointment ${actionVerb}</p>
    </div>

    <!-- Body -->
    <div style="padding: 28px 24px;">
      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5; color: #334155;">
        Dear <strong>${params.patientName}</strong>,
      </p>
      <p style="margin: 0 0 20px 0; font-size: 14.5px; line-height: 1.5; color: #475569;">
        We received a request through MediCare AI to <strong>${actionVerb}</strong> your appointment with <strong>${params.doctorName}</strong>. To confirm this action is authorized by you, please use the 6-digit verification code below:
      </p>

      <!-- Code Box -->
      <div style="background: #F0F7FF; border: 2px dashed #0878F9; border-radius: 12px; padding: 22px 16px; text-align: center; margin: 24px 0;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0878F9; margin-bottom: 8px;">
          One-Time Verification Code
        </div>
        <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #0F172A; line-height: 1;">
          ${params.code}
        </div>
        <div style="font-size: 12px; color: #64748B; margin-top: 10px;">
          ⏱️ This code will expire in <strong>10 minutes</strong>.
        </div>
      </div>

      <!-- Appointment Details Card -->
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin: 20px 0;">
        <div style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
          Appointment Being Modified:
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <tr>
            <td style="padding: 4px 0; color: #64748B;">Reference ID:</td>
            <td style="padding: 4px 0; font-weight: 700; color: #0878F9; text-align: right;">${params.appointmentId}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748B;">Specialist:</td>
            <td style="padding: 4px 0; font-weight: 600; color: #1E293B; text-align: right;">${params.doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748B;">Department:</td>
            <td style="padding: 4px 0; color: #1E293B; text-align: right;">${params.department}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748B;">Current Slot:</td>
            <td style="padding: 4px 0; font-weight: 600; color: #1E293B; text-align: right;">${params.date} at ${params.time}</td>
          </tr>
        </table>
      </div>

      <!-- Security Notice -->
      <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 12px 16px; font-size: 12.5px; color: #92400E; margin-top: 20px; line-height: 1.5;">
        <strong>⚠️ Did not request this?</strong> Never share this verification code with anyone. If you did not initiate this request, your appointment remains secure. Please notify MediCare Support immediately at <a href="mailto:support@medicare.name.ng" style="color: #B45309; font-weight: 600;">support@medicare.name.ng</a>.
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 18px 24px; text-align: center; font-size: 12px; color: #94A3B8;">
      <div style="font-weight: 600; color: #64748B; margin-bottom: 4px;">MediCare Hospital & Clinical Research Institute</div>
      <div>Victoria Island Healthcare District, Lagos, Nigeria</div>
      <div style="margin-top: 8px;">24/7 Security & Support: +234 1 800 6334</div>
    </div>
  </div>
</body>
</html>
`;

    const client = this.getClient();

    if (!client) {
      console.log(`[Resend Simulated Mode] 🔐 Verification code ${params.code} generated for ${recipient} (Appointment ${params.appointmentId})`);
      this.logDelivery({
        id: logId,
        type: 'verification',
        recipient,
        patientName: params.patientName,
        appointmentId: params.appointmentId,
        doctorName: params.doctorName,
        subject,
        timestamp: new Date().toISOString(),
        status: 'simulated',
      });
      return { success: true, simulated: true, messageId: logId };
    }

    const response = await this.dispatchEmail({
      to: recipient,
      subject,
      html: htmlContent,
    });

    if (!response.success) {
      console.error('[Resend Error sending verification code]:', response.error);
      this.logDelivery({
        id: logId,
        type: 'verification',
        recipient,
        patientName: params.patientName,
        appointmentId: params.appointmentId,
        doctorName: params.doctorName,
        subject,
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: response.error,
      });
      return { success: false, error: response.error };
    }

    console.log(`[Resend] Successfully sent verification code ${params.code} to ${recipient}`);
    this.logDelivery({
      id: response.data?.id || logId,
      type: 'verification',
      recipient,
      patientName: params.patientName,
      appointmentId: params.appointmentId,
      doctorName: params.doctorName,
      subject,
      timestamp: new Date().toISOString(),
      status: 'sent',
    });
    return { success: true, messageId: response.data?.id };
  }

  // 5. Test Email Sending
  public async sendTestEmail(recipientEmail: string): Promise<{ success: boolean; messageId?: string; simulated?: boolean; error?: string }> {
    const client = this.getClient();
    const logId = `EMAIL-TEST-${Date.now()}`;
    const subject = `MediCare Hospital Email Service Test (Resend Connected)`;

    const htmlContent = `
<div style="font-family: sans-serif; padding: 20px; color: #1E293B;">
  <h2 style="color: #0878F9;">MediCare Hospital Resend Verification</h2>
  <p>This is a test notification confirming that Resend email delivery is actively connected to your MediCare Hospital management app.</p>
  <p><strong>Sender:</strong> ${this.getFromEmail()}</p>
  <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
</div>
`;

    if (!client) {
      this.logDelivery({
        id: logId,
        type: 'test',
        recipient: recipientEmail,
        patientName: 'Admin Tester',
        appointmentId: 'TEST-001',
        doctorName: 'System',
        subject,
        timestamp: new Date().toISOString(),
        status: 'simulated',
      });
      return { success: true, simulated: true };
    }

    const response = await this.dispatchEmail({
      to: recipientEmail,
      subject,
      html: htmlContent,
    });

    if (!response.success) {
      this.logDelivery({
        id: logId,
        type: 'test',
        recipient: recipientEmail,
        patientName: 'Admin Tester',
        appointmentId: 'TEST-001',
        doctorName: 'System',
        subject,
        timestamp: new Date().toISOString(),
        status: 'failed',
        error: response.error,
      });
      return { success: false, error: response.error };
    }

    this.logDelivery({
      id: response.data?.id || logId,
      type: 'test',
      recipient: recipientEmail,
      patientName: 'Admin Tester',
      appointmentId: 'TEST-001',
      doctorName: 'System',
      subject,
      timestamp: new Date().toISOString(),
      status: 'sent',
    });
    return { success: true, messageId: response.data?.id };
  }
}

export const emailService = new EmailService();
