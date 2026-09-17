import {
  KnowledgeBaseDocument,
  KnowledgeDocumentCategory,
  Appointment,
  AdminDoctor,
  AdminDepartment,
  AdminPatient,
  ScheduleAppointment,
} from '../types';

export interface DbStatusResponse {
  connected: boolean;
  provider: 'mongodb' | 'memory-fallback';
  database: string;
  collections: {
    name: string;
    count: number;
  }[];
  connectionUri: string;
  lastConnectedAt?: string;
  error?: string;
}

export interface CloudinaryStatusResponse {
  configured: boolean;
  cloudName: string;
  hasApiKey: boolean;
  hasApiSecret: boolean;
  uploadFolder: string;
  error?: string;
}

export interface CloudinaryUploadResponse {
  message: string;
  result: {
    url: string;
    secureUrl: string;
    publicId: string;
    format: string;
    bytes: number;
    resourceType: 'image' | 'raw' | 'video' | 'auto';
    originalFilename?: string;
  };
}

export interface AdminLoginResponse {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
  expiresAt?: number;
  lockoutSeconds?: number;
  remainingAttempts?: number;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  user?: {
    email: string;
    name: string;
    role: string;
    systemAccess?: string;
    authenticatedAt?: string;
  };
}

export const api = {
  // --- Admin Authentication ---
  async adminLogin(email: string, password: string): Promise<AdminLoginResponse> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        const errorMsg = data.error || 'Access denied: Invalid administrator credentials.';
        const errObj: any = new Error(errorMsg);
        errObj.fieldErrors = data.fieldErrors;
        errObj.lockoutSeconds = data.lockoutSeconds;
        errObj.remainingAttempts = data.remainingAttempts;
        throw errObj;
      }
      return data;
    } catch (err: any) {
      if (err.fieldErrors || err.lockoutSeconds !== undefined) {
        throw err;
      }
      throw new Error(err.message || 'Access denied: Invalid administrator credentials.');
    }
  },

  async verifyAdminSession(token: string): Promise<{ valid: boolean; user?: any }> {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });
      return await res.json();
    } catch {
      return { valid: false };
    }
  },

  async adminLogout(token?: string): Promise<void> {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    } catch {
      // ignore logout network errors
    }
  },

  // --- Cloudinary Storage Status & Upload ---
  async getCloudinaryStatus(): Promise<CloudinaryStatusResponse> {
    try {
      const res = await fetch('/api/cloudinary/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return {
        configured: false,
        cloudName: 'Offline',
        hasApiKey: false,
        hasApiSecret: false,
        uploadFolder: 'medicare_hospital',
        error: err.message || 'Could not reach Cloudinary endpoint',
      };
    }
  },

  async uploadToCloudinary(
    fileDataUri: string,
    options: {
      filename?: string;
      folder?: string;
      resourceType?: 'auto' | 'image' | 'raw';
    } = {}
  ): Promise<CloudinaryUploadResponse> {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: fileDataUri,
        filename: options.filename,
        folder: options.folder,
        resourceType: options.resourceType,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(err.error || 'Failed to upload to Cloudinary');
    }

    return await res.json();
  },

  // --- Database Status & Reseed ---

  async getDbStatus(): Promise<DbStatusResponse> {
    try {
      const res = await fetch('/api/db/status');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err: any) {
      return {
        connected: false,
        provider: 'memory-fallback',
        database: 'medicare_db',
        collections: [],
        connectionUri: 'Offline / Connecting...',
        error: err.message || 'Could not reach server API',
      };
    }
  },

  async seedDatabase(): Promise<{ message: string; status: DbStatusResponse }> {
    const res = await fetch('/api/db/seed', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to seed MongoDB');
    return await res.json();
  },

  // --- Knowledge Base Documents ---
  async getDocuments(category?: string, search?: string): Promise<KnowledgeBaseDocument[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All Categories') params.append('category', category);
      if (search && search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/documents?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.documents || [];
    } catch (err) {
      console.warn('API getDocuments error, returning fallback:', err);
      throw err;
    }
  },

  async getDocumentById(id: string): Promise<KnowledgeBaseDocument | null> {
    const res = await fetch(`/api/documents/${id}`);
    if (!res.ok) return null;
    return await res.json();
  },

  async createDocument(doc: Partial<KnowledgeBaseDocument> & { pdfBase64?: string }): Promise<KnowledgeBaseDocument> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doc),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create document');
    }
    const data = await res.json();
    return data.document;
  },

  async extractPdfOcr(pdfBase64: string, filename: string): Promise<{
    extractedText: string;
    summary: string;
    keyTopics: string[];
    pageCount: number;
    extractedChunks: number;
    ocrEngine: string;
  }> {
    const res = await fetch('/api/documents/ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfBase64, filename }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to extract text from PDF via OCR');
    }
    return await res.json();
  },

  async reprocessDocumentOcr(id: string, pdfBase64?: string): Promise<{
    message: string;
    document: KnowledgeBaseDocument;
    ocrResult: any;
  }> {
    const res = await fetch(`/api/documents/${id}/ocr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfBase64 }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to re-process document OCR');
    }
    return await res.json();
  },

  async updateDocument(id: string, updates: Partial<KnowledgeBaseDocument>): Promise<KnowledgeBaseDocument> {
    const { _id, ...safeUpdates } = updates as any;
    const res = await fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safeUpdates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update document');
    }
    const data = await res.json();
    return data.document;
  },

  async deleteDocument(id: string): Promise<boolean> {
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  // --- Appointments ---
  async getAppointments(): Promise<Appointment[]> {
    const res = await fetch('/api/appointments');
    if (!res.ok) throw new Error('Failed to fetch appointments');
    const data = await res.json();
    return data.appointments || [];
  },

  async createAppointment(appt: Partial<Appointment>): Promise<Appointment> {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appt),
    });
    if (!res.ok) throw new Error('Failed to create appointment');
    const data = await res.json();
    return data.appointment;
  },

  async updateAppointment(id: string, updates: Partial<Appointment>): Promise<Appointment> {
    const { _id, ...safeUpdates } = updates as any;
    const res = await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safeUpdates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update appointment');
    }
    const data = await res.json();
    return data.appointment;
  },

  async deleteAppointment(id: string): Promise<boolean> {
    const res = await fetch(`/api/appointments/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return res.ok;
  },

  async deleteAppointmentsBatch(ids: string[]): Promise<{ message: string; deletedCount: number }> {
    const res = await fetch('/api/appointments/batch-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Failed to delete appointments');
    return res.json();
  },

  // --- Doctors, Departments, Patients, Schedules ---
  async getDoctors(): Promise<AdminDoctor[]> {
    const res = await fetch('/api/doctors');
    if (!res.ok) throw new Error('Failed to fetch doctors');
    const data = await res.json();
    return data.doctors || [];
  },

  async createDoctor(doctor: Partial<AdminDoctor>): Promise<AdminDoctor> {
    const res = await fetch('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctor),
    });
    if (!res.ok) throw new Error('Failed to register doctor');
    const data = await res.json();
    return data.doctor || data;
  },

  async updateDoctor(id: string, updates: Partial<AdminDoctor>): Promise<AdminDoctor> {
    const { _id, ...safeUpdates } = updates as any;
    const res = await fetch(`/api/doctors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safeUpdates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update doctor');
    }
    const data = await res.json();
    return data.doctor || data;
  },

  async deleteDoctor(id: string): Promise<boolean> {
    const res = await fetch(`/api/doctors/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async getDepartments(): Promise<AdminDepartment[]> {
    const res = await fetch('/api/departments');
    if (!res.ok) throw new Error('Failed to fetch departments');
    const data = await res.json();
    return data.departments || [];
  },

  async createDepartment(dept: Partial<AdminDepartment>): Promise<AdminDepartment> {
    const res = await fetch('/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dept),
    });
    if (!res.ok) throw new Error('Failed to create department');
    const data = await res.json();
    return data.department;
  },

  async updateDepartment(id: string, updates: Partial<AdminDepartment>): Promise<AdminDepartment> {
    const { _id, ...safeUpdates } = updates as any;
    const res = await fetch(`/api/departments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safeUpdates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update department');
    }
    const data = await res.json();
    return data.department;
  },

  async deleteDepartment(id: string): Promise<boolean> {
    const res = await fetch(`/api/departments/${id}`, { method: 'DELETE' });
    return res.ok;
  },

  async getPatients(): Promise<AdminPatient[]> {
    const res = await fetch('/api/patients');
    if (!res.ok) throw new Error('Failed to fetch patients');
    const data = await res.json();
    return data.patients || [];
  },

  async createPatient(patient: Partial<AdminPatient>): Promise<AdminPatient> {
    const res = await fetch('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patient),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create patient');
    }
    const data = await res.json();
    return data.patient;
  },

  async updatePatient(id: string, update: Partial<AdminPatient>): Promise<AdminPatient> {
    const { _id, ...safeUpdate } = update as any;
    const res = await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safeUpdate),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update patient');
    }
    const data = await res.json();
    return data.patient;
  },

  async deletePatient(id: string): Promise<boolean> {
    const res = await fetch(`/api/patients/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete patient');
    }
    return true;
  },

  async deletePatientsBatch(ids: string[]): Promise<boolean> {
    const res = await fetch('/api/patients/batch-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to batch delete patients');
    }
    return true;
  },

  async getSchedules(): Promise<ScheduleAppointment[]> {
    const res = await fetch('/api/schedules');
    if (!res.ok) throw new Error('Failed to fetch schedules');
    const data = await res.json();
    return data.schedules || [];
  },

  async createSchedule(schedule: Omit<ScheduleAppointment, 'id'>): Promise<ScheduleAppointment> {
    const res = await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to create schedule appointment');
    }
    const data = await res.json();
    return data.schedule;
  },

  async updateSchedule(id: string, updates: Partial<ScheduleAppointment>): Promise<ScheduleAppointment> {
    const { _id, ...safeUpdates } = updates as any;
    const res = await fetch(`/api/schedules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(safeUpdates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to update schedule appointment');
    }
    const data = await res.json();
    return data.schedule;
  },

  async deleteSchedule(id: string): Promise<boolean> {
    const res = await fetch(`/api/schedules/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete schedule appointment');
    }
    return true;
  },

  // --- MediCare AI Conversational Assistant ---
  async sendAIChat(params: {
    message: string;
    history?: { role: 'user' | 'model'; content: string }[];
    currentContext?: any;
  }): Promise<any> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'AI conversation error');
    }
    return res.json();
  },

  async getDoctorAvailability(doctorId: string): Promise<{ doctorId: string; doctorName: string; slots: any[]; count: number }> {
    const res = await fetch(`/api/doctors/${doctorId}/availability`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch doctor availability');
    }
    return res.json();
  },

  async bookAppointment(bookingData: {
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    patientAge?: number;
    patientGender?: 'Male' | 'Female' | 'Other';
    patientBloodGroup?: string;
    doctorId?: string;
    doctorName: string;
    department: string;
    date: string;
    time: string;
    reasonForVisit?: string;
    fee?: string;
  }): Promise<{ success: boolean; appointment: Appointment; patient: AdminPatient; message: string }> {
    const res = await fetch('/api/appointments/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to book appointment');
    }
    return res.json();
  },

  async rescheduleAppointment(id: string, date: string, time: string): Promise<{ success: boolean; appointment: Appointment; message: string }> {
    const res = await fetch(`/api/appointments/${id}/reschedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to reschedule appointment');
    }
    return res.json();
  },

  async cancelAppointment(id: string, reason?: string): Promise<{ success: boolean; appointment: Appointment; message: string }> {
    const res = await fetch(`/api/appointments/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to cancel appointment');
    }
    return res.json();
  },

  async lookupAppointment(query: string): Promise<{ appointments: Appointment[]; count: number }> {
    const res = await fetch(`/api/appointments/lookup?query=${encodeURIComponent(query)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to search appointments');
    }
    return res.json();
  },

  // 2FA Security Verification for Reschedule and Cancel
  async sendAppointmentVerification(
    appointmentId: string,
    purpose: 'reschedule' | 'cancel'
  ): Promise<{
    success: boolean;
    maskedEmail?: string;
    expiresAt?: number;
    appointment?: Appointment;
    simulated?: boolean;
    error?: string;
  }> {
    const res = await fetch('/api/appointments/verification/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointmentId, purpose }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Failed to send verification code');
    }
    return data;
  },

  async verifyAppointmentCode(
    appointmentId: string,
    code: string,
    purpose?: 'reschedule' | 'cancel'
  ): Promise<{
    success: boolean;
    verified: boolean;
    verificationToken?: string;
    appointmentId?: string;
    error?: string;
  }> {
    const res = await fetch('/api/appointments/verification/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointmentId, code, purpose }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'Invalid verification code');
    }
    return data;
  },

  async getDashboardStats(): Promise<{
    todayAppointments: number;
    upcomingAppointments: number;
    cancelledAppointments: number;
    totalDoctors: number;
    totalDepartments: number;
    totalPatients: number;
    totalAppointments: number;
  }> {
    const res = await fetch('/api/dashboard/stats');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch dashboard stats');
    }
    return res.json();
  },

  async getActivityLog(): Promise<{ activities: any[]; count: number }> {
    const res = await fetch('/api/activity');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch activity log');
    }
    return res.json();
  },

  async getEmailStatus(): Promise<{
    configured: boolean;
    maskedApiKey?: string;
    fromEmail: string;
    isResendDev?: boolean;
    hint?: string;
    recentLogs: Array<{
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
    }>;
  }> {
    const res = await fetch('/api/email/status');
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch email service status');
    }
    return res.json();
  },

  async sendTestEmail(recipient?: string): Promise<{
    success: boolean;
    simulated?: boolean;
    messageId?: string;
    error?: string;
  }> {
    const res = await fetch('/api/email/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipient }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to send test email');
    }
    return res.json();
  },
};
