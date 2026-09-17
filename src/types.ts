export type DoctorStatus = 'Active' | 'On Leave' | 'Inactive';

export interface WeeklyScheduleDay {
  enabled: boolean;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "16:00"
}

export interface WeeklyAvailability {
  Monday: WeeklyScheduleDay;
  Tuesday: WeeklyScheduleDay;
  Wednesday: WeeklyScheduleDay;
  Thursday: WeeklyScheduleDay;
  Friday: WeeklyScheduleDay;
  Saturday: WeeklyScheduleDay;
  Sunday: WeeklyScheduleDay;
}

export interface SpecificDateAvailability {
  id: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  type: 'Available' | 'Unavailable' | 'Leave';
  note?: string;
}

export interface LeaveSchedule {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  approvedAt?: string;
}

export interface AdminDoctor {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  imageUrl: string;
  departmentId: string;
  department: string;
  specialty: string;
  yearsOfExperience: number;
  experienceText: string;
  consultationFee: number;
  feeText: string;
  bio: string;
  status: DoctorStatus;
  availabilityDisplay: {
    days: string; // e.g. "Mon - Fri"
    hours: string; // e.g. "9:00 AM - 4:00 PM"
  };
  weeklyAvailability: WeeklyAvailability;
  specificAvailability?: SpecificDateAvailability[];
  leaveSchedule?: LeaveSchedule;
  upcomingAppointmentsCount?: number;
  completedAppointmentsCount?: number;
  room?: string;
  rating?: number;
  createdAt?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  imageUrl: string;
  education?: string;
  bio?: string;
  availableDays?: string[];
  rating?: number;
}

export interface Department {
  id: string;
  name: string;
  iconName: string;
  description?: string;
  doctorCount?: number;
  bgTint: string;
  iconColor: string;
}

export interface AdminDepartment {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconType:
    | 'stethoscope'
    | 'heart'
    | 'sparkles'
    | 'baby'
    | 'female'
    | 'bone'
    | 'scan'
    | 'ribbon'
    | 'ear'
    | 'urology'
    | 'stomach'
    | 'brain'
    | 'general';
  bgTint: string;
  iconColor: string;
  headDoctor: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  totalDoctors: number;
  status: 'Active' | 'Inactive';
  consultationLocation?: string;
  createdAt?: string;
}

export interface AdminPatient {
  id: string;
  patientId: string;
  name: string;
  avatar?: string;
  age: number;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  department: string;
  lastVisit: string;
  status: 'Active' | 'Pending' | 'Inactive';
  address?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  genotype?: string;
  allergies?: string[];
  recentActivityTime?: string;
  notes?: string;
  registrationDate?: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'patient' | 'system';
  text: string;
  timestamp?: string;
  isConfirmation?: boolean;
  appointmentId?: string;
}

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
export type AppointmentType =
  | 'Routine Checkup'
  | 'Follow-up'
  | 'Consultation'
  | 'Emergency'
  | 'Specialist Exam';

export type ScheduleStatus =
  | 'Confirmed'
  | 'Pending'
  | 'Checked-in'
  | 'Rescheduled'
  | 'Cancelled';

export interface ScheduleAppointment {
  id: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  date: string; // e.g. 'Sep 15, 2025'
  time: string; // e.g. '8:00 AM'
  timeSlot: string; // '8:00 AM', '9:00 AM', etc.
  patientName: string;
  patientAvatar?: string;
  department: string;
  doctorName?: string;
  doctorAvatar?: string;
  status: ScheduleStatus;
  duration?: string;
  room?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  patientGender: 'Male' | 'Female' | 'Other';
  patientAge: number;
  patientBloodGroup: string;
  patientPhone: string;
  patientEmail: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  department: string;
  room: string;
  date: string; // e.g., '2025-10-14' or 'Oct 14, 2025'
  time: string; // e.g., '09:30 AM'
  duration?: string; // e.g. '45 mins'
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  fee?: string;
  insuranceProvider?: string;
  emergencyContact?: string;
  createdAt?: string;
}

export type KnowledgeDocumentCategory =
  | 'General'
  | 'Cardiology'
  | 'Dermatology'
  | 'Pediatrics'
  | 'Orthopedics'
  | 'Radiology'
  | 'Pharmacy'
  | 'Emergency';

export interface KnowledgeBaseDocument {
  id: string;
  title: string;
  filename: string;
  category: KnowledgeDocumentCategory;
  size: string;
  sizeBytes?: number;
  uploadedBy: {
    name: string;
    role: string;
    avatar: string;
  };
  dateAdded: string;
  timeAdded: string;
  status: 'Active' | 'Archived' | 'Processing';
  extractedChunks?: number;
  description?: string;
  fileUrl?: string;
  cloudinaryPublicId?: string;
  storageProvider?: 'cloudinary' | 'local' | 'mongodb';
  extractedText?: string;
  summary?: string;
  ocrStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  pageCount?: number;
  extractedKeywords?: string[];
}


