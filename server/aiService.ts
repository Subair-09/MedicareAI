import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';
import { mongoDb } from './db';
import { emailService } from './emailService';

export interface Slot {
  id: string;
  day: string; // e.g. "Wed, Sep 17"
  dateStr: string; // e.g. "2026-09-17"
  time: string; // e.g. "10:00 AM"
}

export interface AIChatResponse {
  reply: string;
  intent:
    | 'greeting'
    | 'triage'
    | 'doctor_recommendation'
    | 'show_slots'
    | 'collect_info'
    | 'summary_confirmation'
    | 'booked'
    | 'reschedule'
    | 'cancel'
    | 'knowledge'
    | 'emergency'
    | 'general';
  departmentName?: string;
  doctor?: {
    id: string;
    name: string;
    specialty: string;
    department: string;
    imageUrl: string;
    rating: number;
    reviewsCount: number;
    feeText: string;
    room: string;
    slots?: Slot[];
  };
  appointmentSummary?: {
    doctorName: string;
    doctorSpecialty: string;
    department: string;
    dateStr: string;
    timeStr: string;
    location: string;
    room: string;
    fee: string;
    patientName?: string;
    patientPhone?: string;
    patientEmail?: string;
    reasonForVisit?: string;
  };
  emergencyAlert?: {
    isEmergency: boolean;
    title: string;
    message: string;
    hotline: string;
    action: string;
  };
  suggestedQuickReplies?: string[];
  patientFormDetails?: {
    patientName?: string;
    patientPhone?: string;
    patientEmail?: string;
    patientAge?: number;
    patientGender?: 'Male' | 'Female' | 'Other';
    patientBloodGroup?: string;
    reasonForVisit?: string;
    preferredDoctor?: string;
    preferredSlot?: string;
  };
  bookingSuccess?: {
    appointmentId: string;
    date: string;
    time: string;
    doctorName: string;
    department: string;
  };
}

class AIService {
  private groqClient: Groq | null = null;
  private aiClient: GoogleGenAI | null = null;

  private getGroqClient(): Groq | null {
    const apiKey = (process.env.GROQ_API_KEY || '').trim();
    if (!apiKey) return null;
    if (!this.groqClient) {
      this.groqClient = new Groq({
        apiKey,
      });
    }
    return this.groqClient;
  }

  private getClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) return null;
    if (!this.aiClient) {
      this.aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return this.aiClient;
  }

  // Calculate real-time doctor availability slots for the next 7 days
  public calculateDoctorSlots(doctor: any, existingAppointments: any[] = []): Slot[] {
    const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const slots: Slot[] = [];
    const today = new Date();

    const standardTimeOptions = ['09:00 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:30 PM'];

    // Check next 7 days
    for (let i = 1; i <= 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);

      const dayOfWeekName = daysMap[targetDate.getDay()];
      const dayShort = shortDays[targetDate.getDay()];
      const monthStr = months[targetDate.getMonth()];
      const dayNum = targetDate.getDate();
      const year = targetDate.getFullYear();
      const dateIso = `${year}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dayDisplay = `${dayShort}, ${monthStr} ${dayNum}`;

      // Check doctor's weekly availability
      let isDayEnabled = true;
      if (doctor?.weeklyAvailability && doctor.weeklyAvailability[dayOfWeekName]) {
        isDayEnabled = Boolean(doctor.weeklyAvailability[dayOfWeekName].enabled);
      } else if (targetDate.getDay() === 0) {
        // Sunday default off if not specified
        isDayEnabled = false;
      }

      if (!isDayEnabled) continue;

      // Filter out existing booked appointments for this doctor on this day
      for (const timeStr of standardTimeOptions) {
        const isConflict = existingAppointments.some((appt) => {
          if (appt.status === 'Cancelled') return false;
          const sameDoc =
            (appt.doctorName && appt.doctorName.toLowerCase().includes((doctor.lastName || doctor.name).toLowerCase())) ||
            appt.doctorId === doctor.id;
          if (!sameDoc) return false;

          const dateMatch =
            appt.date === dateIso ||
            appt.date?.toLowerCase() === dayDisplay.toLowerCase() ||
            appt.date?.includes(monthStr && String(dayNum));
          const timeMatch = appt.time?.toLowerCase().replace(/\s+/g, '') === timeStr.toLowerCase().replace(/\s+/g, '');
          return dateMatch && timeMatch;
        });

        if (!isConflict) {
          slots.push({
            id: `slot-${doctor.id || 'doc'}-${dateIso}-${timeStr.replace(/[^a-zA-Z0-9]/g, '')}`,
            day: dayDisplay,
            dateStr: dateIso,
            time: timeStr,
          });
        }
      }

      // Limit to 6 slots max so UI is concise and clean
      if (slots.length >= 6) break;
    }

    // Fallback if schedule is overly constrained
    if (slots.length === 0) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayDisplay = `${shortDays[tomorrow.getDay()]}, ${months[tomorrow.getMonth()]} ${tomorrow.getDate()}`;
      const dateIso = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
      slots.push(
        { id: `slot-${doctor?.id || 'doc'}-1`, day: dayDisplay, dateStr: dateIso, time: '09:30 AM' },
        { id: `slot-${doctor?.id || 'doc'}-2`, day: dayDisplay, dateStr: dateIso, time: '02:00 PM' }
      );
    }

    return slots;
  }

  // Detect life-threatening medical emergency symptoms immediately
  private checkEmergency(text: string): { isEmergency: boolean; reason?: string } {
    const lower = text.toLowerCase();
    const emergencyPatterns = [
      'chest pain',
      'heart attack',
      'cannot breathe',
      'cant breathe',
      'severe shortness of breath',
      'unconscious',
      'passed out',
      'fainted and not waking up',
      'coughing blood',
      'vomiting blood',
      'slurred speech and facial drooping',
      'stroke',
      'severe uncontrolled bleeding',
      'heavy bleeding',
      'head trauma with confusion',
      'anaphylaxis',
      'swollen throat cannot breathe',
      'suicidal',
      'overdose',
    ];

    for (const pattern of emergencyPatterns) {
      if (lower.includes(pattern)) {
        return { isEmergency: true, reason: pattern };
      }
    }
    return { isEmergency: false };
  }

  public async handleChat(params: {
    message: string;
    history?: { role: 'user' | 'model'; content: string }[];
    currentContext?: any;
  }): Promise<AIChatResponse> {
    const userMessage = (params.message || '').trim();
    const history = params.history || [];
    const context = params.currentContext || {};

    // 1. Fetch real-time hospital records
    const [doctors, departments, documents, appointments] = await Promise.all([
      mongoDb.getDoctors().catch(() => []),
      mongoDb.getDepartments().catch(() => []),
      mongoDb.getDocuments().catch(() => []),
      mongoDb.getAppointments().catch(() => []),
    ]);

    // Active doctors only
    const activeDoctors = doctors.filter((d) => d.status !== 'Inactive');

    // 2. Immediate Safety Check
    const emergencyCheck = this.checkEmergency(userMessage);
    if (emergencyCheck.isEmergency) {
      return {
        reply:
          "⚠️ **CRITICAL MEDICAL EMERGENCY DETECTED**: The symptoms you described appear serious and require immediate emergency care. Please do NOT wait for a routine appointment.\n\nCall our 24/7 Emergency Line immediately at **1-800-MEDICARE** or dial **911** right now. Our Emergency & Trauma Department at Campus Way is open 24/7 with immediate life-saving response units.",
        intent: 'emergency',
        emergencyAlert: {
          isEmergency: true,
          title: 'Immediate Emergency Medical Attention Required',
          message:
            'If you or someone else is experiencing chest pain, acute shortness of breath, signs of stroke, or uncontrolled bleeding, seek emergency medical care immediately.',
          hotline: '1-800-MEDICARE (24/7) or 911',
          action: 'Call 911 or Proceed to Emergency Wing',
        },
        suggestedQuickReplies: [
          'Call Emergency Hotline',
          'Emergency Department Directions',
          'Speak to Emergency Triage',
        ],
      };
    }

    // 3. Prepare hospital knowledge & doctors context for Gemini
    const doctorsContextSummary = activeDoctors
      .map(
        (doc) =>
          `- ID: ${doc.id}, Name: ${doc.name}, Department: ${doc.department}, Specialty: ${doc.specialty}, Experience: ${doc.yearsOfExperience} years, Fee: $${doc.consultationFee || 150}, Room: ${doc.room || 'Clinic Suite'}, Status: ${doc.status}`
      )
      .join('\n');

    const departmentsContextSummary = departments
      .map(
        (dept) =>
          `- Department: ${dept.name}, Location: ${dept.consultationLocation || 'Main Building'}, Description: ${dept.description || 'Clinical Care'}, Head: ${dept.headDoctor?.name || 'Assigned Specialist'}`
      )
      .join('\n');

    const knowledgeSummary = documents
      .map((doc) => {
        let entry = `=== DOCUMENT: [${doc.category}] ${doc.title} (File: ${doc.filename}) ===
Status: ${doc.status || 'Active'} | OCR Status: ${doc.ocrStatus || 'completed'}
Executive Summary: ${doc.summary || doc.description || 'Clinical hospital protocol'}
Key Topics: ${(doc.extractedKeywords && doc.extractedKeywords.length > 0) ? doc.extractedKeywords.join(', ') : doc.category}`;

        if (doc.extractedText && doc.extractedText.trim().length > 0) {
          entry += `\nExtracted Text Content (via Multimodal OCR):\n${doc.extractedText.slice(0, 3500)}`;
        }
        return entry;
      })
      .join('\n\n');

    const systemPrompt = `You are "MediCare AI", the intelligent, conversational virtual hospital assistant for MediCare Hospital.

You operate as an intelligent hospital appointment and patient-support assistant connected to MediCare Hospital's real application data and backend services.
Your main responsibility is to understand what the patient needs, have a natural conversation with them, help them find the appropriate hospital service or doctor, check REAL hospital data and availability, collect information required for an appointment, assist with booking/rescheduling/canceling, and provide accurate hospital information.

CORE IDENTITY:
- Intelligent, Conversational, Warm, Professional, Patient, Helpful, Context-aware, Accurate, Proactive.
- You communicate like a highly trained hospital front-desk assistant with direct access to the hospital's digital systems.

MOST CRITICAL RULE:
ALWAYS USE THE REAL DATA AVAILABLE FROM THE MEDICARE HOSPITAL SYSTEM.
NEVER invent information that should come from the hospital database.
Do NOT invent: Doctors, Departments, Appointment slots, Patient IDs, Appointment IDs, Hospital services, Hospital locations, Doctor schedules, Consultation fees, Hospital policies.
If information is not available in the system, state clearly that you do not currently have that information instead of making it up.

ACTIVE HOSPITAL DATA:
Departments in MediCare Hospital:
${departmentsContextSummary}

Physicians currently practicing at MediCare Hospital:
${doctorsContextSummary}

APPROVED MEDICARE HOSPITAL KNOWLEDGE BASE & CLINICAL GUIDELINES (Extracted via OCR from verified Hospital PDFs):
${knowledgeSummary}

Hospital Core Quick-Facts:
- Hospital Address: Campus Way, Main Medical Center
- General Visiting Hours: Monday – Saturday, 8:00 AM – 8:00 PM (ICU: 11:00 AM–1:00 PM & 5:00 PM–7:00 PM)
- Emergency Care: 24/7/365
- Accepted Insurance: Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, Medicare Part B, regional HMOs
- Standard Outpatient Specialist Consultation Fee: $150
- Emergency Dispatch Hotline: 1-800-MEDICARE (Ext: 911 / 999)

CONVERSATIONAL INTELLIGENCE & FLOW:
1. Do not interrogate the patient. Have a natural conversation. Ask one relevant question at a time.
2. Understand context from previous messages. Do not repeatedly ask for information already provided.
3. KNOWLEDGE BASE & PDF OCR MEMORY:
   - You have persistent memory of all uploaded Knowledge Base documents and PDFs extracted via OCR.
   - When patients or staff ask questions concerning MediCare Hospital policies, doctor instructions, scan preparations (e.g. fasting for abdominal ultrasound, metal restrictions for MRI, renal panel for contrast), emergency triage protocols, visiting hours, or accepted insurance, provide accurate answers drawn directly from the extracted document text above.
   - Quote or reference the hospital document naturally (e.g. "According to MediCare Hospital's Diagnostic Imaging Guidelines...").
4. STRICT ENFORCEMENT ON APPOINTMENT BOOKING VIA THE IN-CHAT FORM (NEW BOOKINGS ONLY):
   - MANDATORY HOSPITAL POLICY: All patients who book a NEW consultation through MediCare AI MUST use the official in-chat appointment booking form.
   - The AI must ALWAYS provide the form for NEW appointment bookings whenever a patient wants to book, selects or requests a doctor, or provides booking details.
   - The AI is STRICTLY PROHIBITED from taking, confirming, or booking appointments directly via conversational text messages or plain chat dialogue.
   - The AI should ONLY take NEW bookings via the interactive form that is supplied to the patient in the chat.
   - Whenever the patient wants to book or provides their booking information (e.g., patient name, phone number, email, date, time):
     You MUST set "intent": "collect_info".
     Extract any details they provided into "patientFormDetails": {
       "patientName": "...",
       "patientPhone": "...",
       "patientEmail": "...",
       "patientAge": 32,
       "patientGender": "Male" | "Female" | "Other",
       "reasonForVisit": "...",
       "preferredDoctor": "...",
       "preferredSlot": "..."
     }
     This ensures the official in-chat form is immediately supplied to the patient in the chat and pre-filled with whatever details they provided!
   - In your conversational "reply", inform the patient:
     "To ensure medical record accuracy, patient confidentiality, and verified hospital scheduling, all appointments through MediCare AI must be submitted using our official in-chat Appointment Booking Form. I have supplied the form below—please review or enter your details and submit the form to proceed."
   - CRITICAL RULE: CANCELLATION AND RESCHEDULING NEVER USE THE BOOKING FORM!
     Do NOT supply the booking form, do NOT set "intent": "collect_info", and do NOT provide "patientFormDetails" when a patient asks to cancel or reschedule!

5. QUESTIONS ABOUT DEPARTMENTS & DOCTORS:
   - "What departments do you have?": List the actual departments from the database with locations.
   - "Who are your doctors / radiologists / virologists?": List the actual doctors from the database for that department.
   - "Who are your dermatologists?": If we do not have dermatologists, explicitly state: "We do not currently have a Dermatology department in our hospital records. Our active departments are Virology, Radiology, and Disease Control."
6. RESCHEDULING & CANCELLATION (2FA VERIFICATION CODE LOGIC - NO BOOKING FORM):
   - For CANCELLATION or RESCHEDULING:
     1. Set "intent": "cancel" or "intent": "reschedule".
     2. DO NOT provide the in-chat booking form. Set "doctorId": null, do NOT provide "patientFormDetails".
     3. Ask the patient for their Appointment Reference Number (e.g. APT-2026-1933 or MC-...) if they have not provided it yet.
     4. Explain that for patient privacy, an automated 6-digit security verification code will be sent to their email via Resend to verify identity and authorize the change.
     5. Once verified:
        - For reschedule: The patient will be able to select a new date and time slot.
        - For cancel: The cancellation will be confirmed.
7. HOSPITAL KNOWLEDGE:
   - Use the approved Knowledge Base for hours, location, insurance, and prep.

Current Context:
${JSON.stringify(context, null, 2)}

You MUST respond strictly in valid JSON format matching this schema:
{
  "reply": "Conversational, polite response to the patient",
  "intent": "greeting" | "triage" | "doctor_recommendation" | "show_slots" | "collect_info" | "summary_confirmation" | "reschedule" | "cancel" | "knowledge" | "general",
  "departmentName": "Recommended department name if applicable or null",
  "doctorId": "Recommended doctor ID from the list if intent is doctor_recommendation, show_slots, or collect_info, otherwise null",
  "patientFormDetails": {
    "patientName": "Extracted name or null",
    "patientPhone": "Extracted phone or null",
    "patientEmail": "Extracted email or null",
    "patientAge": 32,
    "patientGender": "Male",
    "patientBloodGroup": "O+",
    "reasonForVisit": "Extracted clinical symptoms or null"
  },
  "suggestedQuickReplies": ["Short chip 1", "Short chip 2", "Short chip 3"]
}
Do not wrap with markdown backticks if possible, return raw JSON string.`;

    // 1. Primary LLM: Groq (with openai/gpt-oss-120b and streaming chunk consumption)
    const groq = this.getGroqClient();
    if (groq) {
      const preferredModel = (process.env.GROQ_MODEL || 'openai/gpt-oss-120b').trim();
      const candidateModels = [
        preferredModel,
        'llama-3.3-70b-versatile',
        'llama-3.1-8b-instant',
      ];

      const groqMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        {
          role: 'system',
          content: systemPrompt,
        },
      ];

      for (const h of history.slice(-6)) {
        groqMessages.push({
          role: h.role === 'model' ? 'assistant' : 'user',
          content: h.content,
        });
      }

      groqMessages.push({
        role: 'user',
        content: userMessage,
      });

      for (const modelName of candidateModels) {
        try {
          console.log(`[Groq] Requesting chat completion with model: ${modelName}`);

          let stream: any;
          try {
            // Invoking Groq chat completion with exact user specified parameters
            stream = await groq.chat.completions.create({
              model: modelName,
              messages: groqMessages,
              temperature: 1,
              max_completion_tokens: 2048,
              top_p: 1,
              reasoning_effort: 'medium' as any,
              stream: true,
              stop: null,
            });
          } catch (reasoningErr: any) {
            // Graceful retry without reasoning_effort if unsupported by specific model
            console.log(`[Groq] Retrying ${modelName} without reasoning_effort...`);
            stream = await groq.chat.completions.create({
              model: modelName,
              messages: groqMessages,
              temperature: 1,
              max_completion_tokens: 2048,
              top_p: 1,
              stream: true,
              stop: null,
            });
          }

          // Consume stream chunks as specified
          let rawText = '';
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            rawText += content;
          }

          // Strip reasoning <think>...</think> tags if present
          const textWithoutThink = rawText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

          // Extract JSON block
          const jsonMatch = textWithoutThink.match(/\{[\s\S]*\}/);
          const cleanedText = jsonMatch
            ? jsonMatch[0]
            : textWithoutThink.replace(/```json/gi, '').replace(/```/g, '').trim();

          let parsed: any;
          try {
            parsed = JSON.parse(cleanedText);
          } catch (jsonErr) {
            parsed = {
              reply: textWithoutThink || rawText,
              intent: 'general',
            };
          }

          return this.processParsedResponse(
            parsed,
            userMessage,
            activeDoctors,
            appointments,
            context
          );
        } catch (groqErr: any) {
          console.warn(`⚠️ [Groq] Error with ${modelName}:`, groqErr?.message || groqErr);
        }
      }
    }

    // 2. Secondary LLM fallback: Google GenAI (if configured)
    const client = this.getClient();
    if (client) {
      const candidateModels = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-3.1-flash-lite'];
      for (const modelName of candidateModels) {
        try {
          const contents: any[] = [];
          for (const h of history.slice(-6)) {
            contents.push({
              role: h.role,
              parts: [{ text: h.content }],
            });
          }
          contents.push({
            role: 'user',
            parts: [{ text: userMessage }],
          });

          const geminiRes = await client.models.generateContent({
            model: modelName,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: 'application/json',
            },
            contents,
          });

          const rawText = geminiRes.text || '';
          const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanedText);

          return this.processParsedResponse(
            parsed,
            userMessage,
            activeDoctors,
            appointments,
            context
          );
        } catch (err: any) {
          console.log(`[Gemini] ${modelName} unavailable (${err?.status || err?.code || 'temporary demand'}), trying alternative...`);
        }
      }
    }

    // 3. Fallback: Intelligent Medical Assistant Rule Engine
    return this.fallbackMedicalAssistant(userMessage, activeDoctors, departments, documents, appointments, context);
  }

  // Centralized response processor ensuring strict hospital booking rules and data attachment
  private processParsedResponse(
    parsed: any,
    userMessage: string,
    activeDoctors: any[],
    appointments: any[],
    context: any
  ): AIChatResponse {
    // 1. CANCELLATION & RESCHEDULING CHECKS FIRST:
    // Cancellation and Rescheduling NEVER use the in-chat booking form!
    // They strictly follow the Appointment Reference Number + 2FA security code flow.
    const isCancelRequest =
      parsed.intent === 'cancel' ||
      /\b(cancel|cancellation|delete\s+appointment|drop\s+appointment)\b/i.test(userMessage);

    const isRescheduleRequest =
      parsed.intent === 'reschedule' ||
      /\b(reschedule|change\s+(?:date|time|slot|day)|move\s+appointment|postpone)\b/i.test(userMessage);

    if (isCancelRequest) {
      delete parsed.patientFormDetails;
      delete parsed.doctorId;
      const refMatch = userMessage.match(/APT-\d{4}-\d{4}|APT-[\w-]+|MC-[\w-]+/i);
      const cleanReply = refMatch
        ? `I have received your cancellation request for appointment **${refMatch[0].toUpperCase()}**. To protect patient records, a 6-digit security code is being dispatched to your registered email to verify your identity and confirm cancellation.`
        : (parsed.reply && !parsed.reply.includes('Appointment Booking Form')
            ? parsed.reply
            : "I can assist you with canceling your appointment. Please provide your **Appointment Reference Number** (e.g. `APT-2026-1933` as shown on your booking confirmation email) so we can locate your record and send a 6-digit security code to verify your identity.");
      return {
        reply: cleanReply,
        intent: 'cancel',
        suggestedQuickReplies: ['Provide Appointment ID', 'Check my confirmation email', 'Hospital reception'],
      };
    }

    if (isRescheduleRequest) {
      delete parsed.patientFormDetails;
      delete parsed.doctorId;
      const refMatch = userMessage.match(/APT-\d{4}-\d{4}|APT-[\w-]+|MC-[\w-]+/i);
      const cleanReply = refMatch
        ? `I have received your reschedule request for appointment **${refMatch[0].toUpperCase()}**. To authorize changing your consultation date or time, a 6-digit verification code is being sent to your registered email.`
        : (parsed.reply && !parsed.reply.includes('Appointment Booking Form')
            ? parsed.reply
            : "I can help you reschedule your appointment to a new date and time. Please provide your **Appointment Reference Number** (e.g. `APT-2026-1933`) so we can retrieve your booking and send a 6-digit security verification code to authorize the change.");
      return {
        reply: cleanReply,
        intent: 'reschedule',
        suggestedQuickReplies: ['Provide Appointment ID', 'Check my confirmation email', 'Keep my current slot'],
      };
    }

    // 2. ENFORCE MANDATORY IN-CHAT FORM FOR NEW BOOKINGS ONLY:
    // Under hospital rules, NEW appointments can NEVER be booked or confirmed via conversational chat text.
    // Any booking attempt, confirmation attempt, or patient detail provision MUST trigger the official form ('collect_info').
    const isBookingAttempt =
      (parsed.intent === 'summary_confirmation' ||
      parsed.intent === 'book' ||
      parsed.intent === 'confirm_booking' ||
      /(\bbook\b|\bbooking\b|\bnew appointment\b|\bbook appointment\b|\bschedule consultation\b|\bschedule an appointment\b)/i.test(userMessage)) &&
      !isCancelRequest &&
      !isRescheduleRequest;

    const hasContactDetailsInText =
      /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(userMessage) ||
      /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/.test(userMessage) ||
      /(?:my name is|patient:?|for\s+[a-z]+)/i.test(userMessage);

    const isGeneralInquiry = /hours|visiting|departments|location|address|insurance|services\?/i.test(userMessage);

    if (
      parsed.intent === 'summary_confirmation' ||
      (isBookingAttempt && hasContactDetailsInText) ||
      (isBookingAttempt && !isGeneralInquiry && parsed.intent !== 'emergency')
    ) {
      parsed.intent = 'collect_info';
      parsed.reply = `To ensure patient identity verification, HIPAA privacy compliance, and accurate hospital scheduling, all appointments through MediCare AI must be submitted using our official in-chat Appointment Booking Form. I have provided the official form below—please verify or fill in your details and submit the form to proceed.`;
    }

    if (parsed.intent === 'collect_info') {
      if (!parsed.patientFormDetails) {
        parsed.patientFormDetails = {};
      }
      const phoneMatch = userMessage.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
      const emailMatch = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const nameMatch = userMessage.match(/(?:my name is|patient(?:\s*name)?\s*[:is]\s*|for\s+)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);

      if (phoneMatch && !parsed.patientFormDetails.patientPhone) {
        parsed.patientFormDetails.patientPhone = phoneMatch[0].trim();
      }
      if (emailMatch && !parsed.patientFormDetails.patientEmail) {
        parsed.patientFormDetails.patientEmail = emailMatch[0].trim();
      }
      if (nameMatch && !parsed.patientFormDetails.patientName) {
        parsed.patientFormDetails.patientName = nameMatch[1].trim();
      }
    }

    // Attach doctorPayload if intent is doctor_recommendation, show_slots, or collect_info
    let doctorPayload: any = undefined;
    if (parsed.intent === 'doctor_recommendation' || parsed.intent === 'show_slots' || parsed.intent === 'collect_info') {
      let matchedDoctor: any = null;
      if (parsed.doctorId) {
        matchedDoctor = activeDoctors.find((d) => d.id === parsed.doctorId);
      }
      if (!matchedDoctor && parsed.departmentName) {
        matchedDoctor =
          activeDoctors.find(
            (d) => d.department?.toLowerCase() === parsed.departmentName?.toLowerCase()
          ) || activeDoctors[0];
      } else if (!matchedDoctor && (context?.selectedDoctor?.id || context?.selectedDoctor?.name)) {
        matchedDoctor = activeDoctors.find(
          (d) => d.id === context?.selectedDoctor?.id || d.name === context?.selectedDoctor?.name
        );
      } else if (!matchedDoctor) {
        matchedDoctor = activeDoctors[0];
      }

      if (matchedDoctor) {
        const slots = this.calculateDoctorSlots(matchedDoctor, appointments);
        doctorPayload = {
          id: matchedDoctor.id,
          name: matchedDoctor.name,
          specialty: `${matchedDoctor.specialty} • ${matchedDoctor.experienceText || `${matchedDoctor.yearsOfExperience} yrs exp`}`,
          department: matchedDoctor.department,
          imageUrl:
            matchedDoctor.imageUrl ||
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
          rating: matchedDoctor.rating || 5.0,
          reviewsCount: 42,
          feeText: matchedDoctor.feeText || `$${matchedDoctor.consultationFee || 150}`,
          room: matchedDoctor.room || `${matchedDoctor.department} Suite`,
          slots,
        };
      }
    }

    return {
      reply: parsed.reply || "I'm here to assist you with your appointment at MediCare Hospital.",
      intent: parsed.intent || 'general',
      departmentName: parsed.departmentName,
      doctor: doctorPayload,
      patientFormDetails: parsed.patientFormDetails,
      suggestedQuickReplies: parsed.suggestedQuickReplies || [
        'Submit Booking Form',
        'View available doctors',
        'Hospital hours',
      ],
    };
  }

  // Resilient fallback logic if Gemini API is temporarily busy
  private fallbackMedicalAssistant(
    userMessage: string,
    activeDoctors: any[],
    departments: any[],
    documents: any[],
    appointments: any[],
    context: any
  ): AIChatResponse {
    const lower = userMessage.toLowerCase().trim();

    // 1. Reschedule flow
    if (lower.includes('reschedule') || lower.includes('change date') || lower.includes('change time')) {
      return {
        reply:
          "I can help you reschedule your appointment right away. Please share your **Appointment ID** (e.g. APT-2026-001) or your registered **phone number**, and I will retrieve your booking and show available alternative slots.",
        intent: 'reschedule',
        suggestedQuickReplies: ['Enter Appointment ID', 'Check my bookings', 'Cancel appointment instead'],
      };
    }

    // 2. Cancel flow
    if (lower.includes('cancel') || lower.includes('delete appointment')) {
      return {
        reply:
          "Cancellations are completely free of charge. Please provide your **Appointment ID** or registered phone number so I can locate your booking and confirm the cancellation.",
        intent: 'cancel',
        suggestedQuickReplies: ['Provide Appointment ID', 'Reschedule instead', 'Back to main menu'],
      };
    }

    // 3. Departments inquiry: "What departments do you have?"
    if (
      (lower.includes('department') && (lower.includes('what') || lower.includes('which') || lower.includes('list') || lower.includes('have'))) ||
      lower === 'departments' ||
      lower.includes('all departments')
    ) {
      const deptList = departments
        .map((d) => `• **${d.name}** (${d.consultationLocation || 'Clinic Suite'}): ${d.description || 'Specialized clinical care'}`)
        .join('\n');
      return {
        reply: `MediCare Hospital operates the following active departments:\n\n${deptList}\n\nWould you like me to connect you with a specialist in one of these departments, or help you book a consultation?`,
        intent: 'knowledge',
        suggestedQuickReplies: [
          'Book Virology consultation',
          'Book Radiology scan',
          'Disease Control info',
          'Who are your doctors?',
        ],
      };
    }

    // 4. Doctors inquiry: "Who are your doctors?", "Who are your virologists / radiologists / dermatologists?"
    if (
      lower.includes('who are your doctor') ||
      lower.includes('list of doctor') ||
      lower.includes('available doctor') ||
      lower.includes('physician') ||
      lower.includes('who are your')
    ) {
      if (lower.includes('dermatolog') || lower.includes('skin doctor') || lower.includes('cardiolog') || lower.includes('neurolog')) {
        return {
          reply:
            "We do not currently have that specific specialty department in our hospital records. Our active departments at MediCare Hospital are **Virology**, **Radiology**, and **Disease Control**.\n\nWould you like me to connect you with an available physician in one of our active departments?",
          intent: 'knowledge',
          suggestedQuickReplies: [
            'View Virology doctors',
            'View Radiology doctors',
            'What departments do you have?',
          ],
        };
      }

      if (lower.includes('virolog')) {
        const virologyDocs = activeDoctors.filter((d) => d.department?.toLowerCase().includes('virology'));
        const docList = virologyDocs
          .map((d) => `• **${d.name}** (${d.specialty} • ${d.experienceText || `${d.yearsOfExperience} yrs exp`}, Room: ${d.room || 'Room 204'})`)
          .join('\n');
        return {
          reply: `Here are our specialist physicians in the **Virology** department:\n\n${docList}\n\nDo you have a preferred doctor you would like to book with, or would you like me to find an open slot?`,
          intent: 'knowledge',
          suggestedQuickReplies: virologyDocs.slice(0, 3).map((d) => `Book with ${d.name}`),
        };
      }

      if (lower.includes('radiolog')) {
        const radDocs = activeDoctors.filter((d) => d.department?.toLowerCase().includes('radiology'));
        const docList = radDocs
          .map((d) => `• **${d.name}** (${d.specialty} • ${d.experienceText || `${d.yearsOfExperience} yrs exp`}, Room: ${d.room || 'Room 209'})`)
          .join('\n');
        return {
          reply: `Here are our specialist physicians in the **Radiology** department:\n\n${docList}\n\nDo you have a preferred doctor you would like to book with, or would you like me to find an open slot?`,
          intent: 'knowledge',
          suggestedQuickReplies: radDocs.map((d) => `Book with ${d.name}`),
        };
      }

      // General doctors list
      const docList = activeDoctors
        .slice(0, 6)
        .map((d) => `• **${d.name}** — ${d.department} (${d.specialty})`)
        .join('\n');
      return {
        reply: `Here are our active specialist physicians at MediCare Hospital:\n\n${docList}\n\nWould you like to schedule an appointment with any of them?`,
        intent: 'knowledge',
        suggestedQuickReplies: [
          'Book an appointment',
          'Virology Department',
          'Radiology Department',
          'Hospital hours',
        ],
      };
    }

    // 5. Booking Requests & Patient Contact Information Enforcement:
    // ALL appointments MUST use the official in-chat booking form; AI only takes appointments via the form!
    const hasPhoneInText = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(userMessage);
    const hasNameInText = /(?:my name is|i am|patient:?|name:?)\s+([a-zA-Z\s]+)/i.test(userMessage);
    const asksToBookDirectly =
      lower.includes('without form') ||
      lower.includes('directly in chat') ||
      lower.includes('book for me') ||
      lower.includes('book it for me') ||
      lower.includes('just book') ||
      lower.includes('book my appointment');

    const explicitBookingInquiry =
      lower.includes('book') ||
      lower.includes('schedule') ||
      lower.includes('appointment') ||
      lower.includes('consultation') ||
      lower.includes('reserve');

    if (hasPhoneInText || hasNameInText || asksToBookDirectly || explicitBookingInquiry) {
      // Find doctor if named, or in context, or default
      let matchedDoc = activeDoctors[0];
      if (lower.includes('sarah') || lower.includes('jenkins') || lower.includes('radiolog')) {
        matchedDoc = activeDoctors.find((d) => d.department?.toLowerCase().includes('radiolog')) || activeDoctors[0];
      } else if (lower.includes('david') || lower.includes('vance') || lower.includes('disease')) {
        matchedDoc = activeDoctors.find((d) => d.department?.toLowerCase().includes('disease')) || activeDoctors[0];
      } else if (lower.includes('raphael') || lower.includes('okon') || lower.includes('virolog')) {
        matchedDoc = activeDoctors.find((d) => d.department?.toLowerCase().includes('virolog')) || activeDoctors[0];
      } else if (context?.selectedDoctor?.id) {
        matchedDoc = activeDoctors.find((d) => d.id === context.selectedDoctor.id) || activeDoctors[0];
      }

      const slots = this.calculateDoctorSlots(matchedDoc, appointments);

      // Extract details if present
      let extractedName = '';
      const nameMatch = userMessage.match(/(?:my name is|i am|patient:?|name:?)\s+([a-zA-Z\s]+?)(?:,|\.|\band\b|\bphone\b|\bwith\b|$)/i);
      if (nameMatch && nameMatch[1]) {
        extractedName = nameMatch[1].trim();
      }

      let extractedPhone = '';
      const phoneMatch = userMessage.match(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/);
      if (phoneMatch) {
        extractedPhone = phoneMatch[0].trim();
      }

      let extractedEmail = '';
      const emailMatch = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        extractedEmail = emailMatch[0].trim();
      }

      const isTextBypassAttempt = hasPhoneInText || hasNameInText || asksToBookDirectly;

      const replyText = isTextBypassAttempt
        ? `To protect patient privacy, comply with healthcare regulations, and record your appointment directly into our hospital database, **all MediCare AI appointments must be submitted through our official in-chat Appointment Booking Form**.\n\nI have provided the form below and pre-filled the information you shared. Please review the details, verify your preferred slot, and submit the form to finalize your appointment.`
        : `I would be delighted to help you schedule your appointment with **${matchedDoc.name}** (${matchedDoc.department}).\n\nTo ensure verified hospital scheduling and instant confirmation, all appointments through MediCare AI must be submitted using our **official in-chat Appointment Booking Form**. I have provided the form below—please review or enter your details and submit the form to proceed:`;

      return {
        reply: replyText,
        intent: 'collect_info',
        departmentName: matchedDoc.department,
        doctor: {
          id: matchedDoc.id,
          name: matchedDoc.name,
          specialty: `${matchedDoc.specialty} • ${matchedDoc.experienceText || `${matchedDoc.yearsOfExperience} yrs exp`}`,
          department: matchedDoc.department,
          imageUrl:
            matchedDoc.imageUrl ||
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
          rating: matchedDoc.rating || 5.0,
          reviewsCount: 38,
          feeText: matchedDoc.feeText || `$${matchedDoc.consultationFee || 150}`,
          room: matchedDoc.room || `${matchedDoc.department} Suite`,
          slots,
        },
        patientFormDetails: {
          patientName: extractedName || context?.patientInfo?.patientName,
          patientPhone: extractedPhone || context?.patientInfo?.patientPhone,
          patientEmail: extractedEmail || context?.patientInfo?.patientEmail,
          reasonForVisit: context?.activeComplaint || '',
          preferredDoctor: matchedDoc.name,
        },
        suggestedQuickReplies: [
          'Submit Booking Form',
          'Choose another doctor',
          'Hospital visiting hours',
        ],
      };
    }

    // 6. Check if user asked about a specific doctor by name (e.g., "Dr. Sarah", "Dr. Rapheael Okon", "Dr. Kalu")
    const doctorMatch = activeDoctors.find((d) => {
      const docFullName = (d.name || '').toLowerCase();
      const lastName = (d.lastName || '').toLowerCase().trim();
      const firstName = (d.firstName || '').toLowerCase().trim();
      return (
        (lastName.length > 2 && lower.includes(lastName)) ||
        (firstName.length > 2 && lower.includes(firstName)) ||
        lower.includes(docFullName)
      );
    });

    if (doctorMatch) {
      const slots = this.calculateDoctorSlots(doctorMatch, appointments);
      return {
        reply: `I found **${doctorMatch.name}** in our **${doctorMatch.department}** department (${doctorMatch.specialty} • ${doctorMatch.experienceText || `${doctorMatch.yearsOfExperience} yrs exp`}). Consultation fee is ${doctorMatch.feeText || `$${doctorMatch.consultationFee || 150}`} located in ${doctorMatch.room || 'Clinic Suite'}.\n\nHere are the next available consultation slots:`,
        intent: 'doctor_recommendation',
        departmentName: doctorMatch.department,
        doctor: {
          id: doctorMatch.id,
          name: doctorMatch.name,
          specialty: `${doctorMatch.specialty} • ${doctorMatch.experienceText || `${doctorMatch.yearsOfExperience} yrs exp`}`,
          department: doctorMatch.department,
          imageUrl:
            doctorMatch.imageUrl ||
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
          rating: doctorMatch.rating || 5.0,
          reviewsCount: 38,
          feeText: doctorMatch.feeText || `$${doctorMatch.consultationFee || 150}`,
          room: doctorMatch.room || `${doctorMatch.department} Suite`,
          slots,
        },
        suggestedQuickReplies: [
          `Book with ${doctorMatch.name}`,
          'Choose another doctor',
          'Check hospital hours',
        ],
      };
    }

    // If patient explicitly named a non-existent doctor (e.g. "Dr. Sarah", "Dr. Smith")
    if (lower.includes('dr.') || lower.includes('dr ') || lower.includes('doctor ')) {
      const doctorWordMatch = lower.match(/(?:dr\.?|doctor)\s+([a-z]+)/i);
      if (doctorWordMatch && doctorWordMatch[1]) {
        const requestedName = doctorWordMatch[1];
        if (!['an', 'the', 'a', 'to', 'for', 'who'].includes(requestedName.toLowerCase())) {
          return {
            reply: `I couldn't find a doctor named "${requestedName}" in our current hospital records. In our hospital, our active departments are **Virology**, **Radiology**, and **Disease Control**.\n\nWould you like me to find an available specialist for you in one of these departments?`,
            intent: 'knowledge',
            suggestedQuickReplies: [
              'Find an available specialist',
              'Who are your doctors?',
              'What departments do you have?',
            ],
          };
        }
      }
    }

    // 6. Hospital services & OCR Knowledge Base search
    const matchingDoc = documents.find((doc) => {
      const titleMatch = doc.title.toLowerCase().split(/\s+/).some((w) => w.length > 3 && lower.includes(w));
      const topicMatch = doc.extractedKeywords?.some((k) => lower.includes(k.toLowerCase()));
      const textMatch =
        (lower.includes('ultrasound') || lower.includes('mri') || lower.includes('scan') || lower.includes('fasting')) &&
        doc.category === 'Radiology';
      const edMatch =
        (lower.includes('emergency') || lower.includes('trauma') || lower.includes('triage') || lower.includes('hotline')) &&
        doc.category === 'Emergency';
      const insMatch =
        (lower.includes('insurance') || lower.includes('payment') || lower.includes('copay') || lower.includes('fee')) &&
        doc.title.toLowerCase().includes('insurance');
      const visitMatch =
        (lower.includes('visiting') || lower.includes('hours') || lower.includes('visitor') || lower.includes('icu')) &&
        doc.title.toLowerCase().includes('visiting');
      return titleMatch || topicMatch || textMatch || edMatch || insMatch || visitMatch;
    });

    if (matchingDoc && (matchingDoc.extractedText || matchingDoc.summary)) {
      const summaryText = matchingDoc.summary || matchingDoc.description || '';
      const detailedSnippet = matchingDoc.extractedText
        ? matchingDoc.extractedText.slice(0, 700).trim() + (matchingDoc.extractedText.length > 700 ? '...' : '')
        : '';

      return {
        reply: `According to our verified MediCare Hospital Knowledge Base (**${matchingDoc.title}**):\n\n${summaryText}\n\n${detailedSnippet}\n\nWould you like more details, or can I help you book a consultation?`,
        intent: 'knowledge',
        suggestedQuickReplies: [
          'Book an appointment',
          'Ask another question',
          'Who are your doctors?',
          'What departments do you have?',
        ],
      };
    }

    if (
      lower.includes('hour') ||
      lower.includes('visiting') ||
      lower.includes('visit') ||
      lower.includes('insurance') ||
      lower.includes('service') ||
      lower.includes('location') ||
      lower.includes('address') ||
      lower.includes('parking') ||
      lower.includes('cost') ||
      lower.includes('fee')
    ) {
      return {
        reply:
          "Here is key information regarding MediCare Hospital:\n\n• **Visiting Hours**: Monday – Saturday, 8:00 AM – 8:00 PM. (ICU: 11:00 AM–1:00 PM & 5:00 PM–7:00 PM)\n• **Emergency Services**: Open 24/7/365 with on-site trauma surgery and diagnostics\n• **Location**: Campus Way, Main Medical Center\n• **Accepted Insurance**: Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, Medicare Part B, and regional HMOs\n• **Standard Specialist Consultation**: $150\n\nWould you like me to help you schedule a consultation with one of our specialists?",
        intent: 'knowledge',
        suggestedQuickReplies: [
          'Book an appointment',
          'Virology Department',
          'Radiology Department',
          'Emergency Care Info',
        ],
      };
    }

    // 8. Triage by symptoms
    const isRadiologySymptom =
      lower.includes('scan') ||
      lower.includes('x-ray') ||
      lower.includes('xray') ||
      lower.includes('mri') ||
      lower.includes('ct') ||
      lower.includes('ultrasound') ||
      lower.includes('bone') ||
      lower.includes('radiation') ||
      lower.includes('radiology');

    const isVirologySymptom =
      lower.includes('flu') ||
      lower.includes('fever') ||
      lower.includes('cough') ||
      lower.includes('covid') ||
      lower.includes('virus') ||
      lower.includes('cold') ||
      lower.includes('virology') ||
      lower.includes('throat') ||
      lower.includes('chills');

    const isDiseaseControlSymptom =
      lower.includes('bacteria') ||
      lower.includes('disease control') ||
      lower.includes('rash') ||
      lower.includes('skin') ||
      lower.includes('infection');

    // If patient explicitly asks for recommendation or says "yes recommend" or "find available specialist"
    const userWantsRecommendation =
      lower.includes('find an available') ||
      lower.includes('recommend') ||
      lower.includes('yes please') ||
      lower.includes('find a doctor') ||
      lower.includes('suggest a doctor') ||
      lower.includes('available specialist');

    if (isRadiologySymptom) {
      const doc = activeDoctors.find((d) => d.department?.toLowerCase().includes('radiology')) || activeDoctors[0];
      if (userWantsRecommendation) {
        const slots = this.calculateDoctorSlots(doc, appointments);
        return {
          reply: `I found an available diagnostic specialist who matches your request: **${doc.name}** in our **${doc.department}** department (${doc.specialty}).\n\nPlease select your preferred consultation time slot below:`,
          intent: 'doctor_recommendation',
          departmentName: doc.department,
          doctor: {
            id: doc.id,
            name: doc.name,
            specialty: `${doc.specialty} • ${doc.experienceText || `${doc.yearsOfExperience} yrs exp`}`,
            department: doc.department,
            imageUrl:
              doc.imageUrl ||
              'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
            rating: doc.rating || 5.0,
            reviewsCount: 38,
            feeText: doc.feeText || `$${doc.consultationFee || 150}`,
            room: doc.room || `${doc.department} Suite`,
            slots,
          },
          suggestedQuickReplies: [`Book with ${doc.name}`, 'Choose another doctor', 'Check fees'],
        };
      }

      return {
        reply:
          "Thanks for explaining that. Based on what you've described, **Radiology** is the appropriate department for diagnostic imaging.\n\nDo you already have a preferred doctor you'd like to see, or would you like me to find an available specialist for you?",
        intent: 'triage',
        departmentName: 'Radiology',
        suggestedQuickReplies: [
          'Find an available specialist',
          'Who are the Radiology doctors?',
          'Different department',
        ],
      };
    }

    if (isVirologySymptom) {
      const doc = activeDoctors.find((d) => d.department?.toLowerCase().includes('virology')) || activeDoctors[0];
      if (userWantsRecommendation) {
        const slots = this.calculateDoctorSlots(doc, appointments);
        return {
          reply: `I found an available specialist who matches your request: **${doc.name}** in our **${doc.department}** department (${doc.specialty}).\n\nPlease select your preferred consultation time slot below:`,
          intent: 'doctor_recommendation',
          departmentName: doc.department,
          doctor: {
            id: doc.id,
            name: doc.name,
            specialty: `${doc.specialty} • ${doc.experienceText || `${doc.yearsOfExperience} yrs exp`}`,
            department: doc.department,
            imageUrl:
              doc.imageUrl ||
              'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
            rating: doc.rating || 5.0,
            reviewsCount: 38,
            feeText: doc.feeText || `$${doc.consultationFee || 150}`,
            room: doc.room || `${doc.department} Suite`,
            slots,
          },
          suggestedQuickReplies: [`Book with ${doc.name}`, 'Choose another doctor', 'Check fees'],
        };
      }

      return {
        reply:
          "Thanks for explaining that. Based on what you've described, **Virology** may be the appropriate department for viral and respiratory illnesses.\n\nDo you already have a doctor you'd like to see, or would you like me to find an available specialist for you?",
        intent: 'triage',
        departmentName: 'Virology',
        suggestedQuickReplies: [
          'Find an available specialist',
          'Who are the Virology doctors?',
          'Different department',
        ],
      };
    }

    if (isDiseaseControlSymptom) {
      return {
        reply:
          "Thanks for explaining that. Based on your symptoms, our **Disease Control** department is the recommended service for bacterial and infectious conditions.\n\nWould you like me to find an available doctor in our clinical staff for your consultation?",
        intent: 'triage',
        departmentName: 'Disease Control',
        suggestedQuickReplies: [
          'Find an available specialist',
          'What departments do you have?',
          'Hospital hours',
        ],
      };
    }

    // Default welcoming response
    return {
      reply:
        "Hello! 👋 I'm **MediCare AI**, your conversational hospital assistant. I'm here to understand your medical needs, connect you with the right specialist, and help you book, reschedule, or cancel your appointment.\n\nCould you please share what symptoms or reason brings you in today?",
      intent: 'greeting',
      suggestedQuickReplies: [
        'I want to book an appointment',
        'Flu & fever symptoms',
        'Need an X-Ray / CT scan',
        'Hospital hours & services',
        'Reschedule appointment',
      ],
    };
  }

  // Complete Appointment Booking Engine (Server-Validated)
  public async bookAppointment(bookingData: {
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
  }): Promise<{ success: boolean; appointment: any; patient: any; message: string }> {
    const {
      patientName,
      patientPhone,
      patientEmail,
      patientAge = 35,
      patientGender = 'Other',
      patientBloodGroup = 'O+',
      doctorName,
      department,
      date,
      time,
      reasonForVisit,
      fee = '$150',
    } = bookingData;

    if (!patientName || !patientPhone || !doctorName || !date || !time) {
      throw new Error('Missing required booking details: patient name, phone, doctor name, date, and time are mandatory.');
    }

    // 1. Conflict Validation
    const existingAppointments = await mongoDb.getAppointments();
    const isSlotTaken = existingAppointments.some((a) => {
      if (a.status === 'Cancelled') return false;
      const sameDoctor =
        a.doctorName?.toLowerCase().trim() === doctorName.toLowerCase().trim();
      const sameDate =
        a.date?.toLowerCase().trim() === date.toLowerCase().trim();
      const sameTime =
        a.time?.toLowerCase().replace(/\s+/g, '') === time.toLowerCase().replace(/\s+/g, '');
      return sameDoctor && sameDate && sameTime;
    });

    if (isSlotTaken) {
      throw new Error(`The requested time slot (${time} on ${date}) with ${doctorName} was just taken. Please choose another available slot.`);
    }

    // 2. Patient Deduplication & Record Management
    const existingPatients = await mongoDb.getPatients();
    const cleanPhone = patientPhone.replace(/[^0-9]/g, '');
    const cleanEmail = (patientEmail || '').toLowerCase().trim();

    let patient = existingPatients.find((p) => {
      const pPhone = (p.phone || '').replace(/[^0-9]/g, '');
      const pEmail = (p.email || '').toLowerCase().trim();
      return (cleanPhone && pPhone === cleanPhone) || (cleanEmail && pEmail === cleanEmail);
    });

    const nowIso = new Date().toISOString();
    const todayDateStr = nowIso.split('T')[0];

    if (patient) {
      // Update existing patient with recent activity
      patient = await mongoDb.updatePatient(patient.id, {
        lastVisit: todayDateStr,
        recentActivityTime: 'Just now',
        department: department || patient.department,
        name: patientName || patient.name,
      });
    } else {
      // Create new patient record
      patient = await mongoDb.createPatient({
        name: patientName,
        phone: patientPhone,
        email: patientEmail || `${patientName.toLowerCase().replace(/\s+/g, '')}@patient.medicare.com`,
        age: Number(patientAge) || 30,
        gender: patientGender,
        bloodGroup: patientBloodGroup,
        department: department || 'General Medicine',
        lastVisit: todayDateStr,
        status: 'Active',
        registrationDate: todayDateStr,
        recentActivityTime: 'Just now',
        notes: reasonForVisit || 'Registered via MediCare AI Assistant',
      });
    }

    // 3. Create Appointment Record
    const appointmentId = `APT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment = await mongoDb.createAppointment({
      id: appointmentId,
      patientId: patient.patientId || patient.id,
      patientName,
      patientAvatar:
        patient.avatar ||
        `https://images.unsplash.com/photo-${patientGender === 'Female' ? '1544005313-94ddf0286df2' : '1507003211169-0a1dd7228f2d'}?auto=format&fit=crop&w=150&q=80`,
      patientGender,
      patientAge: Number(patientAge) || 30,
      patientBloodGroup,
      patientPhone,
      patientEmail: patient.email || patientEmail || '',
      doctorName,
      doctorSpecialty: 'Consultant Specialist',
      doctorAvatar:
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
      department: department || 'General Medicine',
      room: `${department} Suite`,
      date,
      time,
      type: 'Consultation',
      status: 'Confirmed',
      fee,
      notes: reasonForVisit || 'Booked via MediCare AI Assistant',
      createdAt: nowIso,
    });

    // 4. Create Schedule Record so Schedules Page updates synchronously
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const parsedDate = new Date(date);
    const dayName = !isNaN(parsedDate.getTime()) ? daysOfWeek[parsedDate.getDay()] : 'Monday';

    await mongoDb.createSchedule({
      dayOfWeek: dayName,
      date,
      time,
      timeSlot: time,
      patientName,
      department: department || 'General Medicine',
      doctorName,
      status: 'Confirmed',
      room: `${department} Suite`,
      notes: `Booked via MediCare AI. Ref: ${appointmentId}`,
    }).catch((e) => console.warn('Schedule sync notice:', e.message));

    // 5. Trigger automated booking confirmation email via Resend
    try {
      await emailService.sendBookingConfirmation({
        id: appointmentId,
        patientName,
        patientEmail: patient.email || patientEmail,
        patientPhone,
        doctorName,
        doctorSpecialty: 'Consultant Specialist',
        department: department || 'General Medicine',
        date,
        time,
        room: `${department} Suite`,
        fee,
        notes: reasonForVisit,
      });
    } catch (err: any) {
      console.warn('[Resend] Booking email notice:', err?.message || err);
    }

    return {
      success: true,
      appointment: newAppointment,
      patient,
      message: `Appointment ${appointmentId} confirmed successfully with ${doctorName}.`,
    };
  }
}

export const aiService = new AIService();
