import { ScheduleAppointment } from '../types';

export interface DoctorScheduleSummary {
  id: string;
  name: string;
  department: string;
  workingDays: string;
  workingHours: string;
  status: 'Available' | 'In Consultation' | 'Off Duty' | 'On Leave';
  avatar?: string;
  room?: string;
}

export const INITIAL_SCHEDULE_DOCTORS: DoctorScheduleSummary[] = [];

export const INITIAL_SCHEDULE_APPOINTMENTS: ScheduleAppointment[] = [];
