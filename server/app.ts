import './polyfills';
import express from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { mongoDb } from './db';
import { cloudinaryService } from './cloudinary';
import { aiService } from './aiService';
import { emailService } from './emailService';
import { verificationService } from './verificationService';
import { ocrService } from './ocrService';

dotenv.config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serverless and reverse-proxy URL normalization middleware
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith('/api') && (
    req.url.startsWith('/cloudinary') ||
    req.url.startsWith('/upload') ||
    req.url.startsWith('/admin') ||
    req.url.startsWith('/doctors') ||
    req.url.startsWith('/departments') ||
    req.url.startsWith('/appointments') ||
    req.url.startsWith('/patients') ||
    req.url.startsWith('/hospital') ||
    req.url.startsWith('/ai') ||
    req.url.startsWith('/send-email') ||
    req.url.startsWith('/verification') ||
    req.url.startsWith('/schedule-appointments')
  )) {
    req.url = '/api' + req.url;
  }
  next();
});
  // ==========================================
  // Cloudinary Storage API Endpoints
  // ==========================================

  // Get Cloudinary integration status
  app.get('/api/cloudinary/status', (req, res) => {
    try {
      const status = cloudinaryService.getStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to check Cloudinary status' });
    }
  });

  // Direct upload for Images & PDFs to Cloudinary
  app.post('/api/upload', async (req, res) => {
    try {
      const { file, filename, folder, resourceType } = req.body;
      if (!file) {
        return res.status(400).json({ error: 'No file data provided (expected base64 Data URI or URL)' });
      }

      const result = await cloudinaryService.upload(file, {
        filename,
        folder: folder || 'medicare_hospital',
        resourceType: resourceType || 'auto',
      });

      res.status(200).json({
        message: 'File successfully uploaded to Cloudinary',
        result,
      });
    } catch (error: any) {
      console.error('Upload endpoint error:', error);
      res.status(500).json({ error: error.message || 'Cloudinary upload failed' });
    }
  });

  // ==========================================
  // Administrator Authentication Endpoints
  // Environment-driven administrator credentials (ADMIN_EMAIL, ADMIN_PASSWORD)
  // ==========================================
  const getAuthorizedAdminConfig = () => {
    const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const password = (process.env.ADMIN_PASSWORD || '').trim();
    const name = (process.env.ADMIN_NAME || 'Administrator').trim();
    return { email, password, name };
  };

  // In-memory failed attempt tracking (Rate limiting & brute-force defense)
  interface LoginAttempt {
    count: number;
    lockoutUntil?: number;
    lastAttempt: number;
  }
  const failedAttempts = new Map<string, LoginAttempt>();

  // In-memory valid admin session tokens (Token -> expiration timestamp)
  const activeSessions = new Map<string, { email: string; createdAt: number; expiresAt: number }>();

  // Helper to purge expired sessions periodically (unref so it does not keep serverless event loops open)
  const purgeInterval = setInterval(() => {
    const now = Date.now();
    for (const [token, session] of activeSessions.entries()) {
      if (session.expiresAt <= now) {
        activeSessions.delete(token);
      }
    }
  }, 10 * 60 * 1000);
  if (purgeInterval && typeof purgeInterval.unref === 'function') {
    purgeInterval.unref();
  }

  app.post('/api/admin/login', (req, res) => {
    try {
      const clientIp = req.ip || req.socket.remoteAddress || 'client';
      const { email, password } = req.body || {};
      const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
      const rawPassword = typeof password === 'string' ? password : '';

      const now = Date.now();
      const attemptKey = `${clientIp}_${normalizedEmail}`;
      const attemptRecord = failedAttempts.get(attemptKey);

      // Check brute-force lockout
      if (attemptRecord && attemptRecord.lockoutUntil && attemptRecord.lockoutUntil > now) {
        const remainingSeconds = Math.ceil((attemptRecord.lockoutUntil - now) / 1000);
        return res.status(429).json({
          success: false,
          error: `Security Alert: Too many failed attempts. Account temporarily locked for ${remainingSeconds} seconds.`,
          lockoutSeconds: remainingSeconds,
        });
      }

      // Server-side Form Validation with strict email checks
      const fieldErrors: { email?: string; password?: string } = {};

      if (!normalizedEmail) {
        fieldErrors.email = 'Email address is required.';
      } else if (normalizedEmail.length > 254) {
        fieldErrors.email = 'Email address cannot exceed 254 characters.';
      } else if (normalizedEmail.includes('..')) {
        fieldErrors.email = 'Email cannot contain consecutive dots (..).';
      } else {
        const parts = normalizedEmail.split('@');
        if (parts.length !== 2) {
          fieldErrors.email = 'Please enter a valid email address with a single @ symbol.';
        } else {
          const [local, domain] = parts;
          const localRegex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*$/;
          const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

          if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.') || !localRegex.test(local)) {
            fieldErrors.email = 'Email username contains invalid characters or consecutive dots.';
          } else if (!domain || !domainRegex.test(domain)) {
            fieldErrors.email = 'Please enter a valid email domain (e.g., hospital.com).';
          }
        }
      }

      if (!rawPassword) {
        fieldErrors.password = 'Password is required.';
      } else if (rawPassword.length < 6) {
        fieldErrors.password = 'Password must be at least 6 characters long.';
      }

      if (Object.keys(fieldErrors).length > 0) {
        return res.status(400).json({
          success: false,
          error: fieldErrors.email || fieldErrors.password || 'Invalid input data.',
          fieldErrors,
        });
      }

      const adminConfig = getAuthorizedAdminConfig();

      if (!adminConfig.password || !adminConfig.email) {
        return res.status(503).json({
          success: false,
          error: 'Administrator credentials are not configured on the server. Please set ADMIN_EMAIL and ADMIN_PASSWORD in environment variables.',
        });
      }

      // Verify configured administrator credentials
      if (normalizedEmail === adminConfig.email && rawPassword === adminConfig.password) {
        // Reset failed attempt counter on success
        failedAttempts.delete(attemptKey);

        // Generate cryptographically secure session token
        const token = `mcare_adm_${crypto.randomBytes(32).toString('hex')}`;
        const expiresAt = now + 24 * 60 * 60 * 1000; // 24 hours validity

        activeSessions.set(token, {
          email: adminConfig.email,
          createdAt: now,
          expiresAt,
        });

        return res.status(200).json({
          success: true,
          message: 'Administrator authentication successful.',
          token,
          expiresAt,
          user: {
            email: adminConfig.email,
            name: adminConfig.name,
            role: 'Super Administrator',
            systemAccess: 'FULL_ADMIN_CONTROL',
            authenticatedAt: new Date(now).toISOString(),
          },
        });
      } else {
        // Record failed attempt
        const prevCount = attemptRecord ? attemptRecord.count : 0;
        const newCount = prevCount + 1;
        let lockoutUntil: number | undefined;

        if (newCount >= 5) {
          lockoutUntil = now + 45 * 1000; // 45 seconds lockout after 5 consecutive failures
        }

        failedAttempts.set(attemptKey, {
          count: newCount,
          lastAttempt: now,
          lockoutUntil,
        });

        const remainingAttempts = Math.max(0, 5 - newCount);
        return res.status(401).json({
          success: false,
          error:
            newCount >= 5
              ? 'Security Alert: Maximum attempts exceeded. Portal temporarily locked for 45 seconds.'
              : `Access denied: Invalid administrator credentials.${
                  remainingAttempts > 0 ? ` ${remainingAttempts} attempts remaining before temporary lockout.` : ''
                }`,
          remainingAttempts,
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err.message || 'Internal server authentication error.',
      });
    }
  });

  // Verify active session token
  app.post('/api/admin/verify', (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = (req.body?.token || authHeader.replace(/^Bearer\s+/i, '')).trim();

      if (!token) {
        return res.status(401).json({ valid: false, error: 'No authentication token provided.' });
      }

      const session = activeSessions.get(token);
      if (!session || session.expiresAt <= Date.now()) {
        if (session) activeSessions.delete(token);
        return res.status(401).json({ valid: false, error: 'Session has expired or is invalid.' });
      }

      const adminConfig = getAuthorizedAdminConfig();
      return res.status(200).json({
        valid: true,
        user: {
          email: session.email,
          name: adminConfig.name,
          role: 'Super Administrator',
          systemAccess: 'FULL_ADMIN_CONTROL',
        },
      });
    } catch (err: any) {
      return res.status(500).json({ valid: false, error: err.message });
    }
  });

  // Admin Logout: invalidate session token
  app.post('/api/admin/logout', (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = (req.body?.token || authHeader.replace(/^Bearer\s+/i, '')).trim();
      if (token) {
        activeSessions.delete(token);
      }
      return res.status(200).json({ success: true, message: 'Logged out successfully.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/admin/me', (req, res) => {
    const adminConfig = getAuthorizedAdminConfig();
    res.json({
      authorizedAdmin: adminConfig.email || 'Configured via ADMIN_EMAIL',
    });
  });

  // ==========================================
  // MongoDB & Database API Endpoints
  // ==========================================

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 2. MongoDB Database Connection Status & Collection Stats
  app.get('/api/db/status', async (req, res) => {
    try {
      const status = await mongoDb.getStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to retrieve database status' });
    }
  });

  // 3. Reseed or Reset MongoDB Database
  app.post('/api/db/seed', async (req, res) => {
    try {
      await mongoDb.seedAll();
      const status = await mongoDb.getStatus();
      res.json({ message: 'MongoDB collections successfully initialized and seeded!', status });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to seed MongoDB collections' });
    }
  });

  // ==========================================
  // Knowledge Base Documents API Endpoints
  // ==========================================

  // List all documents with optional category and search filters
  app.get('/api/documents', async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const documents = await mongoDb.getDocuments(category, search);
      res.json({ documents, count: documents.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch documents' });
    }
  });

  // Get single document
  app.get('/api/documents/:id', async (req, res) => {
    try {
      const doc = await mongoDb.getDocumentById(req.params.id);
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json(doc);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch document' });
    }
  });

  // Direct OCR & Text Extraction Endpoint for PDF Documents
  app.post('/api/documents/ocr', async (req, res) => {
    try {
      const { pdfBase64, filename } = req.body || {};
      if (!pdfBase64) {
        return res.status(400).json({ error: 'pdfBase64 data is required for OCR processing' });
      }

      console.log(`📑 [API] Running OCR extraction for uploaded PDF: "${filename || 'document.pdf'}"`);
      const ocrResult = await ocrService.extractTextFromPdf(pdfBase64, filename || 'hospital_document.pdf');
      
      res.json({
        success: true,
        message: 'PDF OCR text extraction completed successfully',
        ...ocrResult,
      });
    } catch (error: any) {
      console.error('❌ [API] OCR extraction error:', error);
      res.status(500).json({ error: error.message || 'Failed to extract text from PDF via OCR' });
    }
  });

  // Create / Upload new Knowledge Base document (with automated OCR integration)
  app.post('/api/documents', async (req, res) => {
    try {
      const body = req.body;
      if (!body.title || !body.category) {
        return res.status(400).json({ error: 'Title and category are required' });
      }

      let docPayload = { ...body };

      // If raw PDF base64 is provided and text hasn't been extracted yet, run OCR immediately
      if (body.pdfBase64 && (!body.extractedText || body.extractedText.trim().length === 0)) {
        try {
          console.log(`🤖 [API] Auto-triggering OCR for newly uploaded document: "${body.filename || body.title}"`);
          const ocrResult = await ocrService.extractTextFromPdf(body.pdfBase64, body.filename || `${body.title}.pdf`);
          docPayload.extractedText = ocrResult.extractedText;
          docPayload.summary = ocrResult.summary;
          docPayload.extractedKeywords = ocrResult.keyTopics;
          docPayload.extractedChunks = ocrResult.extractedChunks;
          docPayload.pageCount = ocrResult.pageCount;
          docPayload.ocrStatus = 'completed';
          // Clean up large raw base64 string from database storage payload
          delete docPayload.pdfBase64;
        } catch (ocrErr: any) {
          console.warn('⚠️ [API] Inline OCR error during document creation:', ocrErr.message);
          docPayload.ocrStatus = 'failed';
        }
      } else if (body.extractedText) {
        docPayload.ocrStatus = 'completed';
        if (!docPayload.extractedChunks) {
          docPayload.extractedChunks = Math.max(1, Math.ceil(body.extractedText.length / 450));
        }
        delete docPayload.pdfBase64;
      }

      const newDoc = await mongoDb.createDocument(docPayload);
      res.status(201).json({
        message: 'Document added to MongoDB Knowledge Base & activated in AI Assistant memory',
        document: newDoc,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create document' });
    }
  });

  // Re-run OCR on an existing document
  app.post('/api/documents/:id/ocr', async (req, res) => {
    try {
      const doc = await mongoDb.getDocumentById(req.params.id);
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }

      const { pdfBase64 } = req.body || {};
      let base64ToUse = pdfBase64;

      if (!base64ToUse && doc.fileUrl) {
        try {
          const fetchRes = await fetch(doc.fileUrl);
          const arrayBuf = await fetchRes.arrayBuffer();
          base64ToUse = Buffer.from(arrayBuf).toString('base64');
        } catch (fetchErr: any) {
          console.warn('Could not fetch fileUrl for OCR:', fetchErr.message);
        }
      }

      if (!base64ToUse) {
        return res.status(400).json({
          error: 'Cannot perform OCR: No PDF binary data or accessible file URL found for this document.',
        });
      }

      const ocrResult = await ocrService.extractTextFromPdf(base64ToUse, doc.filename || `${doc.title}.pdf`);

      const updated = await mongoDb.updateDocument(req.params.id, {
        extractedText: ocrResult.extractedText,
        summary: ocrResult.summary,
        extractedKeywords: ocrResult.keyTopics,
        extractedChunks: ocrResult.extractedChunks,
        pageCount: ocrResult.pageCount,
        ocrStatus: 'completed',
      });

      res.json({
        message: 'Document OCR text successfully extracted and updated in AI memory',
        document: updated,
        ocrResult,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to re-run OCR' });
    }
  });

  // Update / Rename / Change category of a document
  app.put('/api/documents/:id', async (req, res) => {
    try {
      const updated = await mongoDb.updateDocument(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Document not found' });
      }
      res.json({ message: 'Document updated in MongoDB', document: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update document' });
    }
  });

  // Delete document
  app.delete('/api/documents/:id', async (req, res) => {
    try {
      const success = await mongoDb.deleteDocument(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Document not found or already deleted' });
      }
      res.json({ message: 'Document removed from MongoDB' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete document' });
    }
  });

  // ==========================================
  // MediCare AI Assistant Endpoints
  // ==========================================

  // Intelligent Conversational Chat Assistant (Server-Side Gemini API)
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history, currentContext } = req.body || {};
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'A valid message string is required.' });
      }
      const response = await aiService.handleChat({ message, history, currentContext });
      return res.status(200).json(response);
    } catch (error: any) {
      console.error('AI chat endpoint error:', error);
      return res.status(500).json({
        reply: "I apologize, I'm experiencing a brief system delay. You can continue describing your symptoms, or directly choose from our clinical departments.",
        intent: 'general',
        suggestedQuickReplies: ['Book appointment', 'View doctors', 'Hospital hours'],
        error: error.message,
      });
    }
  });

  // Get real-time availability slots for a specific doctor
  app.get('/api/doctors/:id/availability', async (req, res) => {
    try {
      const docId = req.params.id;
      const [doctors, appointments] = await Promise.all([
        mongoDb.getDoctors(),
        mongoDb.getAppointments(),
      ]);
      const doctor = doctors.find((d) => d.id === docId || d._id?.toString() === docId);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found.' });
      }
      const slots = aiService.calculateDoctorSlots(doctor, appointments);
      return res.json({ doctorId: docId, doctorName: doctor.name, slots, count: slots.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to calculate doctor availability' });
    }
  });

  // ==========================================
  // Appointments API Endpoints
  // ==========================================

  app.get('/api/appointments', async (req, res) => {
    try {
      const appointments = await mongoDb.getAppointments();
      res.json({ appointments, count: appointments.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to fetch appointments' });
    }
  });

  // Search/Lookup appointment by ID, patient phone, or email
  app.get('/api/appointments/lookup', async (req, res) => {
    try {
      const q = ((req.query.query || req.query.q || '') as string).toLowerCase().trim();
      if (!q) {
        return res.status(400).json({ error: 'Search query parameter is required.' });
      }
      const appointments = await mongoDb.getAppointments();
      const matched = appointments.filter((apt) => {
        const idMatch = apt.id?.toLowerCase().includes(q);
        const nameMatch = apt.patientName?.toLowerCase().includes(q);
        const phoneMatch = apt.patientPhone?.replace(/[^0-9]/g, '').includes(q.replace(/[^0-9]/g, ''));
        const emailMatch = apt.patientEmail?.toLowerCase().includes(q);
        return idMatch || nameMatch || phoneMatch || emailMatch;
      });
      return res.json({ appointments: matched, count: matched.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Lookup failed.' });
    }
  });

  // Get single appointment by ID
  app.get('/api/appointments/:id', async (req, res) => {
    try {
      const appointments = await mongoDb.getAppointments();
      const appt = appointments.find((a) => a.id === req.params.id || a._id?.toString() === req.params.id);
      if (!appt) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }
      return res.json({ appointment: appt });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to retrieve appointment' });
    }
  });

  // Request 2FA Verification Code for Appointment Rescheduling or Cancellation
  app.post('/api/appointments/verification/send', async (req, res) => {
    try {
      const { appointmentId, purpose } = req.body || {};
      if (!appointmentId) {
        return res.status(400).json({ success: false, error: 'Appointment Reference ID is required.' });
      }

      const result = await verificationService.requestVerification({
        appointmentId,
        purpose: purpose === 'cancel' ? 'cancel' : 'reschedule',
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (err: any) {
      console.error('[Error in /api/appointments/verification/send]:', err);
      return res.status(500).json({ success: false, error: err.message || 'Internal server error processing verification' });
    }
  });

  // Verify 2FA Verification Code
  app.post('/api/appointments/verification/verify', async (req, res) => {
    try {
      const { appointmentId, code, purpose } = req.body || {};
      if (!appointmentId || !code) {
        return res.status(400).json({ success: false, error: 'Both appointment ID and verification code are required.' });
      }

      const result = verificationService.verifyCode({
        appointmentId,
        code,
        purpose,
      });

      if (!result.success) {
        return res.status(400).json(result);
      }

      return res.status(200).json(result);
    } catch (err: any) {
      console.error('[Error in /api/appointments/verification/verify]:', err);
      return res.status(500).json({ success: false, error: err.message || 'Internal server error verifying code' });
    }
  });

  // Production MediCare AI booking endpoint: validates & records appointment, patient, and schedule in MongoDB
  app.post('/api/appointments/book', async (req, res) => {
    try {
      const result = await aiService.bookAppointment(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Appointment booking failed.' });
    }
  });

  // Reschedule existing appointment
  app.post('/api/appointments/:id/reschedule', async (req, res) => {
    try {
      const { id } = req.params;
      const { date, time } = req.body || {};
      if (!date || !time) {
        return res.status(400).json({ error: 'New date and time are required for rescheduling.' });
      }

      const appointments = await mongoDb.getAppointments();
      const target = appointments.find((a) => a.id === id || a._id?.toString() === id);
      if (!target) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      if (target.status === 'Cancelled') {
        return res.status(400).json({ error: 'Cannot reschedule a cancelled appointment. Please book a new consultation.' });
      }

      const updated = await mongoDb.updateAppointment(target.id, {
        date,
        time,
        status: 'Confirmed',
        notes: `${target.notes ? `${target.notes} | ` : ''}Rescheduled to ${date} at ${time}`,
      });

      // Update schedule record if exists
      const schedules = await mongoDb.getSchedules();
      const sch = schedules.find((s) => s.patientName === target.patientName && s.doctorName === target.doctorName);
      if (sch) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const parsedDate = new Date(date);
        const dayName = !isNaN(parsedDate.getTime()) ? daysOfWeek[parsedDate.getDay()] : 'Monday';
        await mongoDb.updateSchedule(sch.id, { date, time, timeSlot: time, dayOfWeek: dayName, status: 'Rescheduled' });
      }

      // Trigger automated Resend reschedule notification email
      emailService
        .sendRescheduleConfirmation({
          id: target.id,
          patientName: target.patientName,
          patientEmail: target.patientEmail,
          doctorName: target.doctorName,
          department: target.department,
          newDate: date,
          newTime: time,
          previousDate: target.date,
          previousTime: target.time,
          room: target.room,
        })
        .catch((e) => console.warn('[Resend] Reschedule email warning:', e?.message || e));

      // Clear any temporary verification session
      verificationService.consume(id);

      return res.json({
        success: true,
        message: `Appointment ${id} successfully rescheduled to ${date} at ${time}.`,
        appointment: updated,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to reschedule appointment.' });
    }
  });

  // Cancel existing appointment
  app.post('/api/appointments/:id/cancel', async (req, res) => {
    try {
      const { id } = req.params;
      const { reason } = req.body || {};

      const appointments = await mongoDb.getAppointments();
      const target = appointments.find((a) => a.id === id || a._id?.toString() === id);
      if (!target) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      const updated = await mongoDb.updateAppointment(target.id, {
        status: 'Cancelled',
        notes: `${target.notes ? `${target.notes} | ` : ''}Cancelled${reason ? `: ${reason}` : ''}`,
      });

      // Update schedule record if exists
      const schedules = await mongoDb.getSchedules();
      const sch = schedules.find((s) => s.patientName === target.patientName && s.doctorName === target.doctorName);
      if (sch) {
        await mongoDb.updateSchedule(sch.id, { status: 'Cancelled' });
      }

      // Trigger automated Resend cancellation notification email
      emailService
        .sendCancellationConfirmation({
          id: target.id,
          patientName: target.patientName,
          patientEmail: target.patientEmail,
          doctorName: target.doctorName,
          department: target.department,
          date: target.date,
          time: target.time,
          reason: reason || 'Cancelled upon patient request',
        })
        .catch((e) => console.warn('[Resend] Cancellation email warning:', e?.message || e));

      // Clear any temporary verification session
      verificationService.consume(id);

      return res.json({
        success: true,
        message: `Appointment ${id} has been cancelled successfully.`,
        appointment: updated,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to cancel appointment.' });
    }
  });

  // Standard legacy POST /api/appointments
  app.post('/api/appointments', async (req, res) => {
    try {
      const newAppt = await mongoDb.createAppointment(req.body);

      // Trigger automated Resend booking confirmation email
      if (newAppt.patientEmail) {
        emailService
          .sendBookingConfirmation({
            id: newAppt.id,
            patientName: newAppt.patientName,
            patientEmail: newAppt.patientEmail,
            doctorName: newAppt.doctorName,
            department: newAppt.department,
            date: newAppt.date,
            time: newAppt.time,
            room: newAppt.room,
            fee: newAppt.fee,
            notes: newAppt.notes,
          })
          .catch((e) => console.warn('[Resend] Booking email warning:', e?.message || e));
      }

      res.status(201).json({ message: 'Appointment booked successfully', appointment: newAppt });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to book appointment' });
    }
  });

  app.put('/api/appointments/:id', async (req, res) => {
    try {
      const previousAppts = await mongoDb.getAppointments();
      const previous = previousAppts.find((a) => a.id === req.params.id || a._id?.toString() === req.params.id);

      const updated = await mongoDb.updateAppointment(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      // Check if status transitioned to Cancelled
      if (req.body?.status === 'Cancelled' && previous?.status !== 'Cancelled' && updated.patientEmail) {
        emailService
          .sendCancellationConfirmation({
            id: updated.id,
            patientName: updated.patientName,
            patientEmail: updated.patientEmail,
            doctorName: updated.doctorName,
            department: updated.department,
            date: updated.date,
            time: updated.time,
            reason: req.body?.notes || 'Updated by hospital staff',
          })
          .catch((e) => console.warn('[Resend] Cancel email warning:', e?.message || e));
      } else if (
        (req.body?.date && req.body.date !== previous?.date) ||
        (req.body?.time && req.body.time !== previous?.time)
      ) {
        // Rescheduled
        if (updated.patientEmail) {
          emailService
            .sendRescheduleConfirmation({
              id: updated.id,
              patientName: updated.patientName,
              patientEmail: updated.patientEmail,
              doctorName: updated.doctorName,
              department: updated.department,
              newDate: updated.date,
              newTime: updated.time,
              previousDate: previous?.date,
              previousTime: previous?.time,
              room: updated.room,
            })
            .catch((e) => console.warn('[Resend] Reschedule email warning:', e?.message || e));
        }
      }

      res.json({ message: 'Appointment updated', appointment: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update appointment' });
    }
  });

  // ==========================================
  // Resend Email Integration Endpoints
  // ==========================================
  app.get('/api/email/status', (req, res) => {
    try {
      const status = emailService.getStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to check Resend email status' });
    }
  });

  app.post('/api/email/test', async (req, res) => {
    try {
      const { recipient } = req.body || {};
      const targetEmail = recipient?.trim() || 'nuddywale@gmail.com';
      const result = await emailService.sendTestEmail(targetEmail);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to send test email' });
    }
  });

  app.delete('/api/appointments/:id', async (req, res) => {
    try {
      const success = await mongoDb.deleteAppointment(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json({ message: 'Appointment deleted successfully', id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete appointment' });
    }
  });

  app.post('/api/appointments/batch-delete', async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'ids array required' });
      }
      let deletedCount = 0;
      for (const id of ids) {
        const ok = await mongoDb.deleteAppointment(id);
        if (ok) deletedCount++;
      }
      res.json({ message: `${deletedCount} appointment(s) deleted`, deletedCount, ids });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete appointments' });
    }
  });

  // Dashboard Live Stats Aggregator
  app.get('/api/dashboard/stats', async (req, res) => {
    try {
      const [appointments, doctors, departments, patients] = await Promise.all([
        mongoDb.getAppointments(),
        mongoDb.getDoctors(),
        mongoDb.getDepartments(),
        mongoDb.getPatients(),
      ]);

      const now = new Date();
      const todayY = now.getFullYear();
      const todayM = now.getMonth();
      const todayD = now.getDate();

      const todayAppointments = appointments.filter((a) => {
        if (a.status === 'Cancelled') return false;
        const parsed = new Date(a.date);
        if (!isNaN(parsed.getTime())) {
          return (
            parsed.getFullYear() === todayY &&
            parsed.getMonth() === todayM &&
            parsed.getDate() === todayD
          );
        }
        return false;
      }).length;

      const upcomingAppointments = appointments.filter(
        (a) => a.status === 'Confirmed' || a.status === 'Pending'
      ).length;

      const cancelledAppointments = appointments.filter(
        (a) => a.status === 'Cancelled'
      ).length;

      return res.json({
        todayAppointments,
        upcomingAppointments,
        cancelledAppointments,
        totalDoctors: doctors.length,
        totalDepartments: departments.length,
        totalPatients: patients.length,
        totalAppointments: appointments.length,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to aggregate dashboard stats' });
    }
  });

  // Activity Feed
  app.get('/api/activity', async (req, res) => {
    try {
      const appointments = await mongoDb.getAppointments();
      const activities = appointments.slice(0, 10).map((apt) => ({
        id: `act-${apt.id}`,
        title: apt.status === 'Cancelled' ? 'Appointment cancelled' : 'Appointment booked',
        description: `${apt.patientName} with ${apt.doctorName} (${apt.department})`,
        time: apt.date || 'Recent',
        status: apt.status,
      }));
      return res.json({ activities, count: activities.length });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Failed to fetch activity log' });
    }
  });

  // ==========================================
  // Doctors, Patients, Departments, Schedules
  // ==========================================

  app.get('/api/doctors', async (req, res) => {
    try {
      const doctors = await mongoDb.getDoctors();
      res.json({ doctors, count: doctors.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/doctors', async (req, res) => {
    try {
      const doctor = await mongoDb.createDoctor(req.body);
      res.status(201).json({ message: 'Doctor registered successfully', doctor });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to register doctor' });
    }
  });

  app.put('/api/doctors/:id', async (req, res) => {
    try {
      const updated = await mongoDb.updateDoctor(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.json({ message: 'Doctor updated successfully', doctor: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update doctor' });
    }
  });

  app.delete('/api/doctors/:id', async (req, res) => {
    try {
      const success = await mongoDb.deleteDoctor(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.json({ message: 'Doctor removed from records' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete doctor' });
    }
  });

  app.get('/api/departments', async (req, res) => {
    try {
      const departments = await mongoDb.getDepartments();
      res.json({ departments, count: departments.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/departments', async (req, res) => {
    try {
      const deptData = req.body;
      if (!deptData.name) {
        return res.status(400).json({ error: 'Department name is required' });
      }
      const newDepartment = await mongoDb.createDepartment(deptData);
      res.status(201).json({ message: 'Department created successfully', department: newDepartment });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create department' });
    }
  });

  app.put('/api/departments/:id', async (req, res) => {
    try {
      const updated = await mongoDb.updateDepartment(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Department not found' });
      }
      res.json({ message: 'Department updated successfully', department: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update department' });
    }
  });

  app.delete('/api/departments/:id', async (req, res) => {
    try {
      const success = await mongoDb.deleteDepartment(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Department not found' });
      }
      res.json({ message: 'Department removed from records' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete department' });
    }
  });

  app.get('/api/patients', async (req, res) => {
    try {
      const patients = await mongoDb.getPatients();
      res.json({ patients, count: patients.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/patients', async (req, res) => {
    try {
      const patient = await mongoDb.createPatient(req.body);
      res.status(201).json({ patient });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to create patient record' });
    }
  });

  app.put('/api/patients/:id', async (req, res) => {
    try {
      const updated = await mongoDb.updatePatient(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json({ patient: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to update patient record' });
    }
  });

  app.delete('/api/patients/:id', async (req, res) => {
    try {
      const deleted = await mongoDb.deletePatient(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json({ message: 'Patient record removed successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete patient record' });
    }
  });

  app.post('/api/patients/batch-delete', async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'ids array required' });
      }
      let deletedCount = 0;
      for (const id of ids) {
        const ok = await mongoDb.deletePatient(id);
        if (ok) deletedCount++;
      }
      res.json({ message: `${deletedCount} patient(s) deleted`, deletedCount, ids });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to delete patients in batch' });
    }
  });

  app.get('/api/schedules', async (req, res) => {
    try {
      const schedules = await mongoDb.getSchedules();
      res.json({ schedules, count: schedules.length });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/schedules', async (req, res) => {
    try {
      const { patientName, department, time, date } = req.body;
      if (!patientName || !department) {
        return res.status(400).json({ error: 'Patient name and department are required' });
      }
      const schedule = await mongoDb.createSchedule(req.body);
      res.status(201).json({ schedule });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put('/api/schedules/:id', async (req, res) => {
    try {
      const updated = await mongoDb.updateSchedule(req.params.id, req.body);
      res.json({ schedule: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/schedules/:id', async (req, res) => {
    try {
      const success = await mongoDb.deleteSchedule(req.params.id);
      if (!success) {
        return res.status(404).json({ error: 'Schedule appointment not found' });
      }
      res.json({ message: 'Schedule appointment removed successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

export { app };
export default app;
