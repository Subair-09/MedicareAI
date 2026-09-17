import { AdminDoctor, WeeklyAvailability } from '../types';

export const DEFAULT_WEEKLY_AVAILABILITY: WeeklyAvailability = {
  Monday: { enabled: true, startTime: '09:00', endTime: '16:00' },
  Tuesday: { enabled: true, startTime: '09:00', endTime: '16:00' },
  Wednesday: { enabled: true, startTime: '09:00', endTime: '16:00' },
  Thursday: { enabled: true, startTime: '09:00', endTime: '16:00' },
  Friday: { enabled: true, startTime: '09:00', endTime: '16:00' },
  Saturday: { enabled: false, startTime: '09:00', endTime: '13:00' },
  Sunday: { enabled: false, startTime: '09:00', endTime: '13:00' },
};

// Clean initial empty state - all mock doctors removed
export const INITIAL_ADMIN_DOCTORS: AdminDoctor[] = [];

export const DEPARTMENT_OPTIONS = [
  'All Departments',
];

export const STATUS_OPTIONS = ['All Status', 'Active', 'On Leave', 'Inactive'];

export const AVAILABILITY_OPTIONS = [
  'All Availability',
  'Available Today',
  'Available This Week',
  'Unavailable',
  'On Leave',
];

export interface DoctorActivityItem {
  id: string;
  doctorName: string;
  title: string;
  description: string;
  time: string;
  type: 'added' | 'updated' | 'leave' | 'deactivated' | 'activated';
}

// Clean initial empty activities - mock activity logs removed
export const RECENT_DOCTOR_ACTIVITIES: DoctorActivityItem[] = [];

export interface DepartmentDistributionItem {
  name: string;
  count: number;
  color: string;
}

// Dynamic department distribution default empty
export const DEPARTMENT_DISTRIBUTION: DepartmentDistributionItem[] = [];
