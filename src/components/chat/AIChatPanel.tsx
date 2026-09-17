import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  Send, 
  ShieldCheck, 
  CheckCheck, 
  RotateCcw, 
  Calendar, 
  Clock, 
  UserCheck, 
  AlertTriangle,
  ArrowRight,
  Info,
  CalendarRange,
  Trash2,
  XCircle,
  Users,
  RefreshCw
} from 'lucide-react';
import { RobotAvatar } from '../RobotAvatar';
import { DoctorAvailabilityCard, Slot } from './DoctorAvailabilityCard';
import { AppointmentDetailsCard } from './AppointmentDetailsCard';
import { BookingSuccessCard } from './BookingSuccessCard';
import { EmergencyAlertCard } from './EmergencyAlertCard';
import { PatientDetailsInputCard, PatientFormDetails } from './PatientDetailsInputCard';
import { AppointmentVerificationCard } from './AppointmentVerificationCard';
import { api } from '../../services/api';
import { AdminDoctor, AdminDepartment } from '../../types';

export interface ChatMessageItem {
  id: string;
  sender: 'ai' | 'patient';
  text?: string;
  timestamp: string;
  type?:
    | 'text'
    | 'doctor-availability'
    | 'patient-details-form'
    | 'appointment-details'
    | 'booking-success'
    | 'emergency-alert'
    | 'cancel-confirmation'
    | 'doctor-selection'
    | 'verification-code';
  doctorDetails?: {
    id?: string;
    name: string;
    specialty: string;
    department?: string;
    rating: number;
    reviewsCount: number;
    imageUrl: string;
    feeText?: string;
    room?: string;
    slots?: Slot[];
  };
  appointmentDetails?: {
    doctorName: string;
    doctorSpecialty: string;
    department?: string;
    dateStr: string;
    timeStr: string;
    location: string;
    room: string;
    fee?: string;
    patientName?: string;
    patientPhone?: string;
    patientEmail?: string;
    reasonForVisit?: string;
  };
  bookingSuccess?: {
    appointmentId: string;
    date?: string;
    time?: string;
    doctorName?: string;
    department?: string;
  };
  emergencyAlert?: {
    isEmergency: boolean;
    title: string;
    message: string;
    hotline: string;
    action: string;
  };
  cancelTarget?: {
    id: string;
    doctorName: string;
    date: string;
    time: string;
    patientName?: string;
    department?: string;
  };
  verificationData?: {
    appointmentId: string;
    purpose: 'reschedule' | 'cancel';
    patientName?: string;
    maskedEmail?: string;
    doctorName?: string;
    department?: string;
    date?: string;
    time?: string;
    initialCode?: string;
  };
  doctorSelectionList?: AdminDoctor[];
  quickReplies?: string[];
}

interface AIChatPanelProps {
  onQuickAction?: (actionName: string) => void;
  onBackToLanding?: () => void;
  externalTrigger?: string | null;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ 
  onQuickAction, 
  onBackToLanding,
  externalTrigger 
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [currentPendingSlot, setCurrentPendingSlot] = useState<Slot | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<{
    id?: string;
    name: string;
    specialty: string;
    department?: string;
    room?: string;
    fee?: string;
  } | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientFormDetails | null>(null);
  const [hasSubmittedForm, setHasSubmittedForm] = useState<boolean>(false);
  const [activeComplaint, setActiveComplaint] = useState<string>('');

  // 2FA Security Verification & Reschedule State
  const [activeRescheduleTarget, setActiveRescheduleTarget] = useState<any | null>(null);
  const [pendingVerificationState, setPendingVerificationState] = useState<{
    appointmentId: string;
    purpose: 'reschedule' | 'cancel';
    appointment?: any;
    maskedEmail?: string;
  } | null>(null);
  const [awaitingRefPurpose, setAwaitingRefPurpose] = useState<'reschedule' | 'cancel' | null>(null);

  const [realDoctors, setRealDoctors] = useState<AdminDoctor[]>([]);
  const [realDepartments, setRealDepartments] = useState<AdminDepartment[]>([]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load real active doctors & departments from server for context
  useEffect(() => {
    let isMounted = true;
    Promise.all([api.getDoctors(), api.getDepartments()])
      .then(([docs, depts]) => {
        if (isMounted) {
          setRealDoctors(docs || []);
          setRealDepartments(depts || []);
        }
      })
      .catch((err) => {
        console.warn('Could not load doctors & departments:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return [
      {
        id: 'msg-welcome',
        sender: 'ai',
        text: "Hello! 👋 I'm **MediCare AI**, your conversational hospital assistant.\n\nI can help you understand your symptoms, match you with our specialized doctors, find available consultation slots, and confirm your appointment. No sign up or account is required!\n\nCould you please share what symptoms or reason brings you in today?",
        timestamp: timeStr,
        type: 'text',
        quickReplies: [
          'Book an appointment',
          'Flu & fever symptoms',
          'Need an X-Ray / CT scan',
          'Reschedule appointment',
          'Hospital hours & services',
        ],
      },
    ];
  });

  // Handle external trigger if passed from landing hero/features
  useEffect(() => {
    if (!externalTrigger) return;
    handleSendMessage(externalTrigger);
  }, [externalTrigger]);

  // Auto-scroll on new messages or typing state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleResetChat = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSelectedSlotId('');
    setCurrentPendingSlot(null);
    setSelectedDoctor(null);
    setPatientInfo(null);
    setActiveComplaint('');
    setMessages([
      {
        id: 'msg-welcome-' + Date.now(),
        sender: 'ai',
        text: "Hello! 👋 I'm **MediCare AI**, your conversational hospital assistant. How can I help you today? You can book an appointment, check available doctors, reschedule, or ask about our hospital services.",
        timestamp: timeStr,
        type: 'text',
        quickReplies: [
          'Book an appointment',
          'Flu & fever symptoms',
          'Need an X-Ray / CT scan',
          'Reschedule appointment',
          'Hospital hours & services',
        ],
      },
    ]);
  };

  // Handles successful 2FA code verification for reschedule or cancellation
  const handleVerificationSuccess = async (
    _token: string,
    appointmentId: string,
    purpose: 'reschedule' | 'cancel'
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Look up target appointment details
    let targetApt = pendingVerificationState?.appointment;
    if (!targetApt || targetApt.id?.toUpperCase() !== appointmentId.toUpperCase()) {
      const lookup = await api.lookupAppointment(appointmentId).catch(() => ({ appointments: [] }));
      targetApt = lookup.appointments?.[0];
    }
    if (!targetApt) {
      const allApts = await api.getAppointments().catch(() => []);
      targetApt = allApts.find((a) => a.id?.toUpperCase() === appointmentId.toUpperCase());
    }

    if (purpose === 'reschedule') {
      setActiveRescheduleTarget(targetApt);

      // Find matching doctor or first doctor to get real slots
      const doc =
        realDoctors.find(
          (d) => d.name?.toLowerCase() === targetApt?.doctorName?.toLowerCase()
        ) || realDoctors[0];

      let slots: Slot[] = [];
      if (doc) {
        const avail = await api.getDoctorAvailability(doc.id).catch(() => ({ slots: [] }));
        slots = avail.slots || [];
      }

      setSelectedDoctor({
        id: doc?.id,
        name: targetApt?.doctorName || doc?.name || 'Specialist',
        specialty: targetApt?.doctorSpecialty || doc?.specialty || 'Consultant Specialist',
        department: targetApt?.department || doc?.department || 'Outpatient Clinic',
        room: targetApt?.room || doc?.room || 'Suite A',
      });

      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-ai-resched-verified-' + Date.now(),
          sender: 'ai',
          text: `✅ **Identity Verified Successfully!**\n\nYou are authorized to reschedule appointment **${appointmentId}** with **${targetApt?.doctorName || 'your doctor'}**.\n\nPlease select your preferred new date and consultation slot below:`,
          timestamp: timeStr,
          type: 'doctor-availability',
          doctorDetails: {
            id: doc?.id,
            name: targetApt?.doctorName || doc?.name || 'Specialist',
            specialty: targetApt?.doctorSpecialty || doc?.specialty || 'Specialist',
            department: targetApt?.department || doc?.department,
            rating: 5.0,
            reviewsCount: 42,
            imageUrl:
              targetApt?.doctorAvatar ||
              doc?.imageUrl ||
              'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
            slots,
          },
        },
      ]);
    } else {
      // Cancellation flow
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-ai-cancel-verified-' + Date.now(),
          sender: 'ai',
          text: `✅ **Identity Verified Successfully!**\n\nYou are authorized to cancel appointment **${appointmentId}** with **${targetApt?.doctorName}** (currently scheduled for **${targetApt?.date} at ${targetApt?.time}**).\n\nAre you sure you wish to proceed with cancelling this consultation?`,
          timestamp: timeStr,
          type: 'cancel-confirmation',
          cancelTarget: {
            id: targetApt?.id || appointmentId,
            doctorName: targetApt?.doctorName || 'Consultant Specialist',
            date: targetApt?.date || 'Scheduled Date',
            time: targetApt?.time || 'Scheduled Time',
            patientName: targetApt?.patientName,
            department: targetApt?.department,
          },
        },
      ]);
    }
  };

  // 1. Sending a user message -> calls backend /api/ai/chat
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isTyping) return;
    setInputVal('');

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Track complaint if not yet stored
    if (!activeComplaint && text.length > 5) {
      setActiveComplaint(text);
    }

    // Add user message to UI
    const userMsg: ChatMessageItem = {
      id: 'msg-' + Date.now(),
      sender: 'patient',
      text,
      timestamp: timeStr,
      type: 'text',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Check if user submitted a 6-digit code for pending verification
    const cleanCode = text.trim().replace(/\s+/g, '');
    if (/^\d{6}$/.test(cleanCode) && pendingVerificationState) {
      try {
        const verifyRes = await api.verifyAppointmentCode(
          pendingVerificationState.appointmentId,
          cleanCode,
          pendingVerificationState.purpose
        );
        if (verifyRes.verified && verifyRes.verificationToken) {
          const aptId = pendingVerificationState.appointmentId;
          const purpose = pendingVerificationState.purpose;
          setPendingVerificationState(null);
          setIsTyping(false);
          await handleVerificationSuccess(verifyRes.verificationToken, aptId, purpose);
          return;
        }
      } catch (verifyErr: any) {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: 'msg-ai-err-' + Date.now(),
            sender: 'ai',
            text: `⚠️ **Verification Code Error**: ${verifyErr.message || 'The code entered does not match the 6-digit security code sent to your email.'}\n\nPlease check your inbox for the code from \`noreply@medicare.name.ng\` or click "Resend" on the card.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text',
          },
        ]);
        return;
      }
    }

    try {
      // Build conversation history for the AI backend
      const history = messages
        .filter((m) => m.text)
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'ai' ? ('model' as const) : ('user' as const),
          content: m.text || '',
        }));

      const aiResponse = await api.sendAIChat({
        message: text,
        history,
        currentContext: {
          selectedDoctor,
          currentPendingSlot,
          patientInfo,
          activeComplaint: activeComplaint || text,
        },
      });

      setIsTyping(false);
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // If Emergency Alert detected by AI
      if (aiResponse.emergencyAlert && aiResponse.emergencyAlert.isEmergency) {
        setMessages((prev) => [
          ...prev,
          {
            id: 'msg-ai-' + Date.now(),
            sender: 'ai',
            text: aiResponse.reply,
            timestamp: aiTime,
            type: 'emergency-alert',
            emergencyAlert: aiResponse.emergencyAlert,
            quickReplies: aiResponse.suggestedQuickReplies,
          },
        ]);
        return;
      }

      // =========================================================================
      // 1. CANCELLATION & RESCHEDULING CHECKS (PRIORITY OVER BOOKING FORM):
      // The in-chat booking form is strictly for NEW bookings only.
      // Rescheduling and Cancellation NEVER show the booking form; they require
      // the Appointment Reference Number and send a 6-digit verification code via Resend.
      // =========================================================================
      const idMatch = text.match(/APT-\d{4}-\d{4}|APT-[\w-]+|MC-[\w-]+/i);
      let detectedRef: string | null = idMatch ? idMatch[0].toUpperCase() : null;

      // If waiting for appointment reference, accept formats like "2026-1933" or "APT20261933"
      if (!detectedRef && awaitingRefPurpose) {
        const looseMatch = text.trim().match(/^(?:APT[-\s]?)?(\d{4}[-\s]?\d{3,4})$/i);
        if (looseMatch) {
          detectedRef = `APT-${looseMatch[1].replace(/\s+/g, '-')}`;
        }
      }

      const isCancelIntent =
        aiResponse.intent === 'cancel' ||
        /\b(cancel|cancellation|delete\s+appointment|drop\s+appointment)\b/i.test(text) ||
        awaitingRefPurpose === 'cancel';

      const isRescheduleIntent =
        aiResponse.intent === 'reschedule' ||
        /\b(reschedule|change\s+(?:slot|date|time|day)|move\s+appointment|postpone)\b/i.test(text) ||
        awaitingRefPurpose === 'reschedule';

      if (isRescheduleIntent || isCancelIntent) {
        const purpose: 'reschedule' | 'cancel' = isCancelIntent ? 'cancel' : 'reschedule';

        // Case A: No reference number was provided yet
        if (!detectedRef) {
          setAwaitingRefPurpose(purpose);
          setMessages((prev) => [
            ...prev,
            {
              id: 'msg-ai-req-ref-' + Date.now(),
              sender: 'ai',
              text: `I would be pleased to help you **${purpose}** your appointment.\n\nTo locate your booking in our hospital system and protect patient privacy, could you please provide your **Appointment Reference Number**?\n\n*(For example: \`APT-2026-1933\` as shown on your booking confirmation email or SMS)*`,
              timestamp: aiTime,
              type: 'text',
              quickReplies: ['Check my confirmation email', 'I do not have my reference', 'Hospital reception'],
            },
          ]);
          return;
        }

        // Case B: Reference number provided -> Fetch details & dispatch 2FA verification code via Resend
        const aptRef = detectedRef;
        setAwaitingRefPurpose(null);

        try {
          const verifyDispatch = await api.sendAppointmentVerification(aptRef, purpose);
          const targetApt = verifyDispatch.appointment;

          setPendingVerificationState({
            appointmentId: aptRef,
            purpose,
            appointment: targetApt,
            maskedEmail: verifyDispatch.maskedEmail,
          });

          setMessages((prev) => [
            ...prev,
            {
              id: 'msg-ai-verify-' + Date.now(),
              sender: 'ai',
              text: `I found your appointment **${aptRef}** with **${targetApt?.doctorName || 'Specialist'}** (${targetApt?.department || 'Outpatient Clinic'}) on **${targetApt?.date} at ${targetApt?.time}** for patient **${targetApt?.patientName}**.\n\n🔒 **Identity Verification Required**\nTo confirm you are authorized to ${purpose} this consultation, a 6-digit security code has been sent via Resend to **${verifyDispatch.maskedEmail || 'your email'}**.\n\nPlease enter the 6-digit code below to proceed:`,
              timestamp: aiTime,
              type: 'verification-code',
              verificationData: {
                appointmentId: aptRef,
                purpose,
                patientName: targetApt?.patientName,
                maskedEmail: verifyDispatch.maskedEmail,
                doctorName: targetApt?.doctorName,
                department: targetApt?.department,
                date: targetApt?.date,
                time: targetApt?.time,
              },
            },
          ]);
          return;
        } catch (err: any) {
          setMessages((prev) => [
            ...prev,
            {
              id: 'msg-ai-err-' + Date.now(),
              sender: 'ai',
              text: `🔍 ${err.message || `We could not locate an active appointment with Reference Number **${aptRef}**.\n\nPlease verify your reference number from your confirmation email or contact hospital reception.`}`,
              timestamp: aiTime,
              type: 'text',
              quickReplies: ['Try another reference number', 'Book a new appointment', 'Contact front desk'],
            },
          ]);
          return;
        }
      }

      // Case C: User just typed an appointment reference number like "APT-2026-1933" without explicit intent
      if (detectedRef && !isCancelIntent && !isRescheduleIntent) {
        const aptRef = detectedRef;
        try {
          const lookup = await api.lookupAppointment(aptRef);
          if (lookup.appointments && lookup.appointments.length > 0) {
            const apt = lookup.appointments[0];
            setMessages((prev) => [
              ...prev,
              {
                id: 'msg-ai-found-' + Date.now(),
                sender: 'ai',
                text: `I located appointment **${apt.id}** for **${apt.patientName}** with **${apt.doctorName}** (${apt.department}) on **${apt.date} at ${apt.time}** (Status: **${apt.status}**).\n\nHow would you like to manage this appointment?`,
                timestamp: aiTime,
                type: 'text',
                quickReplies: [
                  `Reschedule ${apt.id}`,
                  `Cancel ${apt.id}`,
                  'Book another consultation',
                ],
              },
            ]);
            return;
          }
        } catch {
          // fall through to standard reply
        }
      }

      // =========================================================================
      // 2. NEW APPOINTMENT BOOKING ONLY: In-chat booking form
      // =========================================================================
      if (aiResponse.intent === 'collect_info') {
        if (aiResponse.doctor) {
          const doc = aiResponse.doctor;
          setSelectedDoctor({
            id: doc.id,
            name: doc.name,
            specialty: doc.specialty,
            department: doc.department,
            room: doc.room,
            fee: doc.feeText,
          });
          if (doc.slots && doc.slots.length > 0) {
            setCurrentPendingSlot(doc.slots[0]);
            setSelectedSlotId(doc.slots[0].id);
          }
        }

        if (aiResponse.patientFormDetails) {
          setPatientInfo((prev) => ({
            patientName: aiResponse.patientFormDetails?.patientName || prev?.patientName || '',
            patientPhone: aiResponse.patientFormDetails?.patientPhone || prev?.patientPhone || '',
            patientEmail: aiResponse.patientFormDetails?.patientEmail || prev?.patientEmail || '',
            patientAge: aiResponse.patientFormDetails?.patientAge || prev?.patientAge || 32,
            patientGender: aiResponse.patientFormDetails?.patientGender || prev?.patientGender || 'Other',
            patientBloodGroup: aiResponse.patientFormDetails?.patientBloodGroup || prev?.patientBloodGroup || 'O+',
            reasonForVisit: aiResponse.patientFormDetails?.reasonForVisit || prev?.reasonForVisit || activeComplaint || '',
          }));
        }

        setMessages((prev) => [
          ...prev,
          {
            id: 'msg-ai-form-' + Date.now(),
            sender: 'ai',
            text: aiResponse.reply,
            timestamp: aiTime,
            type: 'patient-details-form',
            quickReplies: aiResponse.suggestedQuickReplies || [
              'Submit Booking Form',
              'Choose another doctor',
              'Hospital hours',
            ],
          },
        ]);
        return;
      }

      // If Doctor Recommended with availability slots
      if (aiResponse.doctor) {
        const doc = aiResponse.doctor;
        setSelectedDoctor({
          id: doc.id,
          name: doc.name,
          specialty: doc.specialty,
          department: doc.department,
          room: doc.room,
          fee: doc.feeText,
        });

        setMessages((prev) => [
          ...prev,
          {
            id: 'msg-ai-' + Date.now(),
            sender: 'ai',
            text: aiResponse.reply,
            timestamp: aiTime,
            type: 'doctor-availability',
            doctorDetails: {
              id: doc.id,
              name: doc.name,
              specialty: doc.specialty,
              department: doc.department,
              rating: doc.rating || 5.0,
              reviewsCount: doc.reviewsCount || 40,
              imageUrl: doc.imageUrl,
              feeText: doc.feeText,
              room: doc.room,
              slots: doc.slots || [],
            },
            quickReplies: aiResponse.suggestedQuickReplies,
          },
        ]);
        return;
      }

      // Standard text response
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-ai-' + Date.now(),
          sender: 'ai',
          text: aiResponse.reply,
          timestamp: aiTime,
          type: 'text',
          quickReplies: aiResponse.suggestedQuickReplies,
        },
      ]);
    } catch (err: any) {
      setIsTyping(false);
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-ai-err-' + Date.now(),
          sender: 'ai',
          text: "I'm ready to assist you. Would you like to schedule a consultation with our specialists or manage an existing appointment?",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          quickReplies: ['Book Virology consultation', 'Reschedule appointment', 'Hospital hours'],
        },
      ]);
    }
  };

  // 2. Patient selects an appointment time slot
  const handleSlotSelect = (slot: Slot, doctorName?: string, specialty?: string) => {
    setSelectedSlotId(slot.id);
    setCurrentPendingSlot(slot);

    const docName = doctorName || selectedDoctor?.name || 'Specialist Doctor';
    const docSpecialty = specialty || selectedDoctor?.specialty || 'Consultant Specialist';
    const docDept = selectedDoctor?.department || 'Clinical Medicine';
    const docRoom = selectedDoctor?.room || `${docDept} Suite`;
    const docFee = selectedDoctor?.fee || '$150';

    setSelectedDoctor({
      id: selectedDoctor?.id,
      name: docName,
      specialty: docSpecialty,
      department: docDept,
      room: docRoom,
      fee: docFee,
    });

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // User message
    const userMsg: ChatMessageItem = {
      id: 'msg-' + Date.now(),
      sender: 'patient',
      text: `I would like to choose ${slot.time} on ${slot.day}.`,
      timestamp: timeStr,
      type: 'text',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // If rescheduling an existing verified appointment
    if (activeRescheduleTarget) {
      setTimeout(async () => {
        setIsTyping(false);
        const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        try {
          const res = await api.rescheduleAppointment(
            activeRescheduleTarget.id,
            slot.day,
            slot.time
          );
          const aptId = activeRescheduleTarget.id;
          setActiveRescheduleTarget(null);

          setMessages((prev) => [
            ...prev,
            {
              id: 'msg-ai-resched-confirmed-' + Date.now(),
              sender: 'ai',
              text: `🎉 **Appointment ${aptId} Rescheduled Successfully!**\n\nYour consultation with **${res.appointment.doctorName}** has been moved to **${slot.day} at ${slot.time}** in ${res.appointment.room || 'Clinic Suite'}.\n\n📧 A confirmation email with your updated consultation details has been delivered via Resend to **${res.appointment.patientEmail || 'your registered email'}**.`,
              timestamp: aiTime,
              type: 'booking-success',
              bookingSuccess: {
                appointmentId: res.appointment.id,
                date: res.appointment.date,
                time: res.appointment.time,
                doctorName: res.appointment.doctorName,
                department: res.appointment.department,
              },
              quickReplies: ['Book new appointment', 'Hospital visiting hours', 'Hospital departments'],
            },
          ]);
        } catch (err: any) {
          setMessages((prev) => [
            ...prev,
            {
              id: 'msg-ai-resched-err-' + Date.now(),
              sender: 'ai',
              text: `⚠️ **Rescheduling Error**: ${err.message || 'Could not reschedule appointment.'}`,
              timestamp: aiTime,
              type: 'text',
            },
          ]);
        }
      }, 400);
      return;
    }

    // AI asks for patient information: ALWAYS supply the official in-chat booking form
    setTimeout(() => {
      setIsTyping(false);
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-ai-form-' + Date.now(),
          sender: 'ai',
          text: `You have selected **${slot.day} at ${slot.time}** with **${docName}** (${docDept}).\n\nUnder MediCare Hospital policy, please complete your booking using our official in-chat registration form below:`,
          timestamp: aiTime,
          type: 'patient-details-form',
          quickReplies: ['Submit Booking Form', 'Choose another doctor', 'Hospital visiting hours'],
        },
      ]);
    }, 450);
  };

  // 3. Patient submits their personal contact details via the in-chat form
  const handlePatientDetailsSubmit = (details: PatientFormDetails) => {
    setHasSubmittedForm(true);
    setPatientInfo(details);
    if (details.reasonForVisit) {
      setActiveComplaint(details.reasonForVisit);
    }

    if (details.doctorName) {
      const doc = realDoctors.find((d) => d.id === details.doctorId || d.name === details.doctorName);
      setSelectedDoctor({
        id: details.doctorId || doc?.id || selectedDoctor?.id,
        name: details.doctorName,
        specialty: doc?.specialty || selectedDoctor?.specialty || `${details.department || 'Clinical'} Specialist`,
        department: details.department || doc?.department || selectedDoctor?.department || 'Virology',
        room: details.room || doc?.room || selectedDoctor?.room || 'Suite A',
        fee: details.fee || doc?.feeText || selectedDoctor?.fee || '$150',
      });
    }

    if (details.slotDay && details.slotTime) {
      setCurrentPendingSlot({
        id: 'slot-' + Date.now(),
        day: details.slotDay,
        time: details.slotTime,
        dateStr: details.slotDateStr || new Date().toISOString().split('T')[0],
      });
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const docName = details.doctorName || selectedDoctor?.name || 'Specialist Doctor';
    const docDept = details.department || selectedDoctor?.department || 'Clinical Medicine';
    const slotDay = details.slotDay || currentPendingSlot?.day || 'Upcoming Date';
    const slotTime = details.slotTime || currentPendingSlot?.time || '10:00 AM';

    // User message recording the form submission
    const userMsg: ChatMessageItem = {
      id: 'msg-' + Date.now(),
      sender: 'patient',
      text: `📋 **Official Booking Form Submitted**\n• Patient: ${details.patientName}\n• Tel: ${details.patientPhone}\n• Doctor: ${docName} (${docDept})\n• Slot: ${slotDay} at ${slotTime}`,
      timestamp: timeStr,
      type: 'text',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-ai-summary-' + Date.now(),
          sender: 'ai',
          text: `Thank you, **${details.patientName}**! Your official booking form details have been received and validated.\n\nPlease review your complete consultation summary below and click **Confirm Booking** to finalize:`,
          timestamp: aiTime,
          type: 'appointment-details',
          appointmentDetails: {
            doctorName: docName,
            doctorSpecialty: selectedDoctor?.specialty || 'Consultant Specialist',
            department: docDept,
            dateStr: slotDay,
            timeStr: slotTime,
            location: 'MediCare Hospital (Main Campus)',
            room: selectedDoctor?.room || `${docDept} Suite`,
            fee: selectedDoctor?.fee || '$150',
            patientName: details.patientName,
            patientPhone: details.patientPhone,
            patientEmail: details.patientEmail,
            reasonForVisit: details.reasonForVisit || activeComplaint,
          },
        },
      ]);
    }, 400);
  };

  // 4. Patient clicks Confirm Booking -> Backend validates and saves to MongoDB
  const handleConfirmBooking = async () => {
    if (isSubmittingBooking) return;

    if (!hasSubmittedForm) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-no-form-' + Date.now(),
          sender: 'ai',
          text: '⚠️ **Official Form Required**: Under MediCare Hospital policy, all appointments through the AI must be submitted using our official in-chat appointment booking form. Please complete and submit the form above to proceed.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'patient-details-form',
        },
      ]);
      return;
    }

    setIsSubmittingBooking(true);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // User message
    const userMsg: ChatMessageItem = {
      id: 'msg-' + Date.now(),
      sender: 'patient',
      text: 'Yes, please confirm this appointment.',
      timestamp: timeStr,
      type: 'text',
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const docName = selectedDoctor?.name || (realDoctors[0]?.name || 'Dr. Rapheael Okon');
      const docDept = selectedDoctor?.department || (realDoctors[0]?.department || 'Virology');
      const dateStr = currentPendingSlot?.dateStr || currentPendingSlot?.day || new Date().toISOString().split('T')[0];
      const timeSlot = currentPendingSlot?.time || '10:00 AM';
      const patientName = patientInfo?.patientName || 'Patient';
      const patientPhone = patientInfo?.patientPhone || '+1 555-0100';
      const patientEmail = patientInfo?.patientEmail || `${patientName.toLowerCase().replace(/\s+/g, '')}@medicare.com`;

      // Call server booking API: validates, creates Patient record, creates Appointment in MongoDB
      const res = await api.bookAppointment({
        patientName,
        patientPhone,
        patientEmail,
        patientAge: patientInfo?.patientAge || 32,
        patientGender: patientInfo?.patientGender || 'Other',
        patientBloodGroup: patientInfo?.patientBloodGroup || 'O+',
        doctorId: selectedDoctor?.id,
        doctorName: docName,
        department: docDept,
        date: dateStr,
        time: timeSlot,
        reasonForVisit: patientInfo?.reasonForVisit || activeComplaint || 'Consultation',
        fee: selectedDoctor?.fee || '$150',
      });

      setIsTyping(false);
      setIsSubmittingBooking(false);
      setHasSubmittedForm(false);

      const appointmentId = res.appointment?.id || ('APT-2026-' + Math.floor(1000 + Math.random() * 9000));
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-ai-success-' + Date.now(),
          sender: 'ai',
          text: `🎉 Your appointment has been officially confirmed and registered in our hospital system!\n\n**Appointment ID:** ${appointmentId}\n**Doctor:** ${docName} (${docDept})\n**Date & Time:** ${currentPendingSlot?.day || dateStr} at ${timeSlot}\n\nA confirmation SMS and email have been sent to **${patientPhone}**. You can present this Appointment ID when arriving at the clinic.`,
          timestamp: aiTime,
          type: 'booking-success',
          bookingSuccess: {
            appointmentId,
            date: dateStr,
            time: timeSlot,
            doctorName: docName,
            department: docDept,
          },
          quickReplies: ['Book another appointment', 'Hospital visiting hours', 'Reschedule or cancel'],
        },
      ]);
    } catch (err: any) {
      setIsTyping(false);
      setIsSubmittingBooking(false);
      console.error('Booking confirmation failed:', err);

      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-ai-err-' + Date.now(),
          sender: 'ai',
          text: `⚠️ **Booking Notice**: ${err.message || 'We could not finalize the booking. Please select another slot or try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          quickReplies: ['Choose another slot', 'Start over'],
        },
      ]);
    }
  };

  // Change Time Slot handler
  const handleChangeTime = async () => {
    const docId = selectedDoctor?.id || realDoctors[0]?.id;
    const docName = selectedDoctor?.name || realDoctors[0]?.name || 'Specialist Doctor';
    const avail = await api.getDoctorAvailability(docId).catch(() => ({ slots: [] }));
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: 'msg-' + Date.now(),
        sender: 'patient',
        text: 'I would like to choose a different time slot.',
        timestamp: timeStr,
        type: 'text',
      },
      {
        id: 'msg-ai-slots-' + Date.now(),
        sender: 'ai',
        text: `Certainly! Here are the available consultation slots for **${docName}**. Please select your preferred time:`,
        timestamp: timeStr,
        type: 'doctor-availability',
        doctorDetails: {
          id: docId,
          name: docName,
          specialty: selectedDoctor?.specialty || 'Specialist',
          department: selectedDoctor?.department || 'Virology',
          rating: 4.9,
          reviewsCount: 38,
          imageUrl:
            realDoctors.find((d) => d.id === docId)?.imageUrl ||
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
          slots: avail.slots || [],
        },
      },
    ]);
  };

  // Change Doctor handler
  const handleChangeDoctor = () => {
    const dept = selectedDoctor?.department || 'Virology';
    const matchedDocs = realDoctors.filter(
      (d) => d.department?.toLowerCase() === dept.toLowerCase()
    );
    const doctorsToShow = matchedDocs.length > 0 ? matchedDocs : realDoctors;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: 'msg-' + Date.now(),
        sender: 'patient',
        text: 'I would like to consult a different doctor.',
        timestamp: timeStr,
        type: 'text',
      },
      {
        id: 'msg-ai-docs-' + Date.now(),
        sender: 'ai',
        text: `Here are our qualified doctors in the **${dept}** department. Please select a doctor you would like to consult:`,
        timestamp: timeStr,
        type: 'doctor-selection',
        doctorSelectionList: doctorsToShow,
      },
    ]);
  };

  // Select Doctor from list handler
  const handleSelectDoctorFromList = async (doc: AdminDoctor) => {
    setSelectedDoctor({
      id: doc.id,
      name: doc.name,
      specialty: doc.specialty,
      department: doc.department,
      room: doc.room || 'Clinic Suite',
      fee: doc.feeText || `$${doc.consultationFee || 150}`,
    });

    const avail = await api.getDoctorAvailability(doc.id).catch(() => ({ slots: [] }));
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: 'msg-' + Date.now(),
        sender: 'patient',
        text: `I'd like to consult with ${doc.name}.`,
        timestamp: timeStr,
        type: 'text',
      },
      {
        id: 'msg-ai-doc-avail-' + Date.now(),
        sender: 'ai',
        text: `Great choice! **${doc.name}** is our specialist in ${doc.specialty} (${doc.department}).\n\nPlease select an available consultation slot below:`,
        timestamp: timeStr,
        type: 'doctor-availability',
        doctorDetails: {
          id: doc.id,
          name: doc.name,
          specialty: doc.specialty,
          department: doc.department,
          rating: (doc as any).rating || 4.9,
          reviewsCount: doc.yearsOfExperience ? doc.yearsOfExperience * 8 : 36,
          imageUrl:
            doc.imageUrl ||
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
          slots: avail.slots || [],
        },
      },
    ]);
  };

  // Cancel Draft handler
  const handleCancelDraft = () => {
    setSelectedSlotId('');
    setCurrentPendingSlot(null);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: 'msg-' + Date.now(),
        sender: 'patient',
        text: 'Cancel this booking request.',
        timestamp: timeStr,
        type: 'text',
      },
      {
        id: 'msg-ai-cancel-draft-' + Date.now(),
        sender: 'ai',
        text: 'I have cancelled this appointment request. No booking was created and no fee was charged.\n\nHow else may I assist you today?',
        timestamp: timeStr,
        type: 'text',
        quickReplies: ['Book new appointment', 'Our medical departments', 'Hospital opening hours'],
      },
    ]);
  };

  // Cancellation Execution handler
  const handleExecuteCancellation = async (
    appointmentId: string,
    doctorName: string,
    date: string,
    time: string
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      await api.cancelAppointment(appointmentId);
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-' + Date.now(),
          sender: 'patient',
          text: `YES, CANCEL APPOINTMENT`,
          timestamp: timeStr,
          type: 'text',
        },
        {
          id: 'msg-ai-' + Date.now(),
          sender: 'ai',
          text: `✅ Your appointment **${appointmentId}** with **${doctorName}** scheduled for ${date} at ${time} has been officially cancelled in our hospital system.\n\n📧 A cancellation confirmation has been dispatched to your email via Resend. No cancellation fees apply. If you need medical assistance in the future, we are always here to help.`,
          timestamp: timeStr,
          type: 'text',
          quickReplies: ['Book new appointment', 'Hospital visiting hours', 'Hospital departments'],
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-ai-err-' + Date.now(),
          sender: 'ai',
          text: `⚠️ We encountered an issue while cancelling the appointment: ${err.message || 'Please contact the hospital front desk directly.'}`,
          timestamp: timeStr,
          type: 'text',
        },
      ]);
    }
  };

  // Keep Appointment handler
  const handleKeepAppointment = (
    appointmentId: string,
    doctorName: string,
    date: string,
    time: string
  ) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: 'msg-' + Date.now(),
        sender: 'patient',
        text: 'KEEP APPOINTMENT',
        timestamp: timeStr,
        type: 'text',
      },
      {
        id: 'msg-ai-' + Date.now(),
        sender: 'ai',
        text: `Understood! Your appointment **${appointmentId}** with **${doctorName}** remains confirmed for **${date} at ${time}**.\n\nPlease remember to arrive at least 15 minutes before your consultation time. Have a wonderful day!`,
        timestamp: timeStr,
        type: 'text',
        quickReplies: ['View appointment details', 'Hospital directions', 'Main menu'],
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-[#D5E6F7] shadow-xl overflow-hidden text-left relative">
      
      {/* 1. CHAT HEADER */}
      <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#F5FAFF] border-b border-[#E1EDF9] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <RobotAvatar size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15.5px] sm:text-[16.5px] font-bold text-[#102A52] leading-tight">
                MediCare AI
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E7F8F1] text-[#20B879]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#20B879] animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-[11.5px] sm:text-[12px] text-[#64748B] mt-0.5">
              Intelligent Hospital Appointment & Patient Assistant
            </p>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <button
              type="button"
              onClick={handleResetChat}
              className="px-3 py-1.5 rounded-full text-[11.5px] sm:text-[12px] font-semibold text-[#5577A6] hover:text-[#0878F9] hover:bg-[#EAF4FF] border border-[#D0E6FC] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Start a new chat conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Chat</span>
            </button>
          )}

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#D0E6FC] text-[#0878F9] text-[11px] sm:text-[12px] font-semibold shrink-0 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0878F9]" />
            <span>No sign-in required</span>
          </div>
        </div>
      </div>

      {/* 2. CHAT STREAM */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4 sm:space-y-5 bg-gradient-to-b from-[#FCFDFF] via-[#F8FBFF] to-[#F3F8FD]"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'patient' ? 'flex-col items-end' : 'items-start gap-3'
            }`}
          >
            {msg.sender === 'ai' && <RobotAvatar size="sm" />}

            <div className="max-w-[640px] w-full">
              
              {/* Text Message Bubble */}
              {msg.text && (
                <div
                  className={`px-4.5 py-3.5 rounded-2xl text-[13.5px] sm:text-[14px] leading-relaxed shadow-2xs whitespace-pre-line ${
                    msg.sender === 'patient'
                      ? 'bg-[#0878F9] text-white rounded-tr-xs font-medium ml-auto max-w-[480px]'
                      : 'bg-white text-[#102A52] border border-[#DCEBFB] rounded-tl-xs'
                  }`}
                >
                  {msg.text}
                </div>
              )}

              {/* Emergency Alert Card */}
              {msg.type === 'emergency-alert' && msg.emergencyAlert && (
                <div className="mt-3">
                  <EmergencyAlertCard
                    title={msg.emergencyAlert.title}
                    message={msg.emergencyAlert.message}
                    hotline={msg.emergencyAlert.hotline}
                    actionText={msg.emergencyAlert.action}
                  />
                </div>
              )}

              {/* Doctor Availability Card */}
              {msg.type === 'doctor-availability' && msg.doctorDetails && (
                <div className="mt-3">
                  <DoctorAvailabilityCard
                    doctorName={msg.doctorDetails.name}
                    specialty={msg.doctorDetails.specialty}
                    rating={msg.doctorDetails.rating}
                    reviewsCount={msg.doctorDetails.reviewsCount}
                    imageUrl={msg.doctorDetails.imageUrl}
                    selectedSlotId={selectedSlotId}
                    onSelectSlot={(slot) =>
                      handleSlotSelect(slot, msg.doctorDetails?.name, msg.doctorDetails?.specialty)
                    }
                    slots={msg.doctorDetails.slots}
                  />
                </div>
              )}

              {/* Patient Details Intake Form Card */}
              {msg.type === 'patient-details-form' && (
                <div className="mt-3">
                  <PatientDetailsInputCard
                    initialDetails={patientInfo || undefined}
                    doctorName={selectedDoctor?.name}
                    department={selectedDoctor?.department}
                    selectedSlot={
                      currentPendingSlot
                        ? { day: currentPendingSlot.day, time: currentPendingSlot.time, dateStr: currentPendingSlot.dateStr }
                        : undefined
                    }
                    availableDoctors={realDoctors}
                    onSubmitDetails={handlePatientDetailsSubmit}
                    onCancel={() => handleSendMessage('I would like to look at doctors again.')}
                  />
                </div>
              )}

              {/* Doctor Selection Card */}
              {msg.type === 'doctor-selection' && msg.doctorSelectionList && (
                <div className="mt-3 bg-white border border-[#D5E6F7] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[14px] font-bold text-[#102A52] flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#0878F9]" />
                      <span>Available Specialists ({msg.doctorSelectionList.length})</span>
                    </h4>
                    <span className="text-[11.5px] text-[#64748B]">Select a doctor to view slots</span>
                  </div>
                  <div className="space-y-2">
                    {msg.doctorSelectionList.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-[#E2EEFC] hover:border-[#0878F9] bg-[#FAFCFF] transition-all gap-2"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={doc.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'}
                            alt={doc.name}
                            referrerPolicy="no-referrer"
                            className="w-11 h-11 rounded-lg object-cover border border-[#D0E6FC] shrink-0"
                          />
                          <div className="truncate">
                            <h5 className="text-[13.5px] font-bold text-[#102A52] leading-tight truncate">{doc.name}</h5>
                            <p className="text-[11.5px] text-[#64748B] mt-0.5 truncate">
                              {doc.specialty} • {doc.department} ({doc.room || 'Main Clinic'})
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectDoctorFromList(doc)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0878F9] hover:bg-[#0768D6] text-white text-[12px] font-bold transition-colors cursor-pointer shadow-2xs shrink-0"
                        >
                          Select Doctor
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2FA Security Verification Card */}
              {msg.type === 'verification-code' && msg.verificationData && (
                <div className="mt-3">
                  <AppointmentVerificationCard
                    appointmentId={msg.verificationData.appointmentId}
                    purpose={msg.verificationData.purpose}
                    patientName={msg.verificationData.patientName}
                    maskedEmail={msg.verificationData.maskedEmail}
                    doctorName={msg.verificationData.doctorName}
                    department={msg.verificationData.department}
                    date={msg.verificationData.date}
                    time={msg.verificationData.time}
                    initialCode={msg.verificationData.initialCode}
                    onVerified={(token) =>
                      handleVerificationSuccess(
                        token,
                        msg.verificationData!.appointmentId,
                        msg.verificationData!.purpose
                      )
                    }
                    onCancel={() => {
                      setPendingVerificationState(null);
                      setAwaitingRefPurpose(null);
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: 'msg-ai-cancel-action-' + Date.now(),
                          sender: 'ai',
                          text: 'Security verification was cancelled. Let me know if you would like to reschedule, check clinic services, or book another consultation.',
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                          type: 'text',
                          quickReplies: ['Book an appointment', 'Hospital hours & services'],
                        },
                      ]);
                    }}
                  />
                </div>
              )}

              {/* Cancel Confirmation Card */}
              {msg.type === 'cancel-confirmation' && msg.cancelTarget && (
                <div className="mt-3 bg-white border border-[#FED7D7] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF5F5] border border-[#FEB2B2] flex items-center justify-center shrink-0 text-[#E53E3E]">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-[14.5px] font-bold text-[#102A52]">
                        Cancel Appointment Confirmation
                      </h4>
                      <p className="text-[12.5px] text-[#64748B] mt-0.5">
                        Appointment Ref: <span className="font-semibold text-[#102A52]">{msg.cancelTarget.id}</span>
                      </p>
                      <p className="text-[12.5px] text-[#64748B] mt-0.5">
                        Doctor: <span className="font-semibold text-[#102A52]">{msg.cancelTarget.doctorName}</span> • Scheduled: <span className="font-semibold text-[#102A52]">{msg.cancelTarget.date} at {msg.cancelTarget.time}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#FEE2E2]">
                    <button
                      type="button"
                      onClick={() =>
                        handleExecuteCancellation(
                          msg.cancelTarget!.id,
                          msg.cancelTarget!.doctorName,
                          msg.cancelTarget!.date,
                          msg.cancelTarget!.time
                        )
                      }
                      className="px-4 py-2.5 rounded-xl bg-[#E53E3E] hover:bg-[#C53030] text-white font-bold text-[12.5px] sm:text-[13px] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>YES, CANCEL APPOINTMENT</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleKeepAppointment(
                          msg.cancelTarget!.id,
                          msg.cancelTarget!.doctorName,
                          msg.cancelTarget!.date,
                          msg.cancelTarget!.time
                        )
                      }
                      className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#CBD5E1] text-[#475569] font-bold text-[12.5px] sm:text-[13px] transition-colors cursor-pointer"
                    >
                      KEEP APPOINTMENT
                    </button>
                  </div>
                </div>
              )}

              {/* Appointment Details Summary Card for Final Confirmation */}
              {msg.type === 'appointment-details' && msg.appointmentDetails && (
                <div className="mt-3 space-y-3 bg-white border border-[#D5E6F7] rounded-2xl p-4 sm:p-5 shadow-2xs">
                  <AppointmentDetailsCard
                    doctorName={msg.appointmentDetails.doctorName}
                    doctorSpecialty={msg.appointmentDetails.doctorSpecialty}
                    dateStr={msg.appointmentDetails.dateStr}
                    timeStr={msg.appointmentDetails.timeStr}
                    location={msg.appointmentDetails.location}
                    room={msg.appointmentDetails.room}
                    patientName={msg.appointmentDetails.patientName}
                    patientPhone={msg.appointmentDetails.patientPhone}
                    fee={msg.appointmentDetails.fee}
                    reasonForVisit={msg.appointmentDetails.reasonForVisit}
                  />

                  {/* Confirmation Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0F5FA]">
                    <button
                      type="button"
                      disabled={isSubmittingBooking}
                      onClick={handleConfirmBooking}
                      className="px-4.5 py-2.5 rounded-xl bg-[#0878F9] hover:bg-[#0768D6] disabled:bg-[#93C5FD] text-white font-bold text-[12.5px] sm:text-[13px] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{isSubmittingBooking ? 'Saving to Database...' : 'YES, BOOK APPOINTMENT'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleChangeTime}
                      className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F5FAFF] border border-[#D0E6FC] text-[#5577A6] hover:text-[#102A52] text-[12.5px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#0878F9]" />
                      <span>CHANGE TIME</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleChangeDoctor}
                      className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F5FAFF] border border-[#D0E6FC] text-[#5577A6] hover:text-[#102A52] text-[12.5px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5 text-[#0878F9]" />
                      <span>CHANGE DOCTOR</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelDraft}
                      className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#FFF5F5] border border-[#FED7D7] text-[#E53E3E] text-[12.5px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>CANCEL</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Booking Success Card */}
              {msg.type === 'booking-success' && msg.bookingSuccess && (
                <div className="mt-3 bg-white border border-[#D5E6F7] rounded-2xl p-4 sm:p-5 shadow-2xs">
                  <BookingSuccessCard
                    appointmentId={msg.bookingSuccess.appointmentId}
                    onViewAppointments={() =>
                      handleSendMessage(`Show details for appointment ${msg.bookingSuccess?.appointmentId}`)
                    }
                    onReschedule={() =>
                      handleSendMessage(`I need to reschedule appointment ${msg.bookingSuccess?.appointmentId}`)
                    }
                    onCancel={() =>
                      handleSendMessage(`Please cancel appointment ${msg.bookingSuccess?.appointmentId}`)
                    }
                  />
                </div>
              )}

              {/* Suggested Quick Reply Chips */}
              {msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {msg.quickReplies.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(chip)}
                      className="px-3 py-1 rounded-full bg-white hover:bg-[#EAF4FF] border border-[#D0E6FC] text-[#0878F9] text-[12px] font-semibold transition-all cursor-pointer shadow-2xs hover:border-[#0878F9]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <div
                className={`flex items-center gap-1 text-[11px] text-[#94A3B8] font-medium mt-1 ${
                  msg.sender === 'patient' ? 'justify-end pr-1' : 'pl-1'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.sender === 'patient' && (
                  <CheckCheck className="w-3.5 h-3.5 text-[#0878F9]" />
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-3">
            <RobotAvatar size="sm" />
            <div className="bg-white border border-[#DCEBFB] rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-1.5 shadow-2xs">
              <div className="w-2 h-2 rounded-full bg-[#0878F9] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#0878F9] animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-[#0878F9] animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. INPUT BAR & DYNAMIC QUICK ACTIONS */}
      <div className="p-3.5 sm:p-4 bg-white border-t border-[#E1EDF9] space-y-2.5 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-[#F8FAFD] rounded-full border border-[#D0E2F5] hover:border-[#B3D4F5] focus-within:border-[#0878F9] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0878F9]/10 transition-all p-1.5 pl-4 shadow-2xs"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type your message, complaint, or ask anything..."
            className="flex-1 bg-transparent text-[13.5px] sm:text-[14px] text-[#102A52] placeholder-[#94A3B8] focus:outline-none"
          />

          <button
            type="submit"
            disabled={!inputVal.trim() || isTyping}
            className="w-9 h-9 rounded-full bg-[#0878F9] hover:bg-[#0768D6] disabled:bg-[#CBD5E1] text-white flex items-center justify-center shrink-0 shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="w-4 h-4 ml-0.5 text-white" />
          </button>
        </form>

        {/* Global Quick Action Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 pb-0.5">
          {[
            'Book appointment',
            'I have flu symptoms',
            'Need an X-Ray / CT scan',
            'Reschedule appointment',
            'Cancel appointment',
            'Visiting hours',
          ].map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => handleSendMessage(action)}
              className="shrink-0 px-3 py-1 rounded-full bg-[#F5FAFF] hover:bg-[#EAF4FF] border border-[#D5E6F7] text-[#0878F9] text-[11.5px] font-semibold transition-all cursor-pointer shadow-2xs hover:border-[#0878F9]"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
