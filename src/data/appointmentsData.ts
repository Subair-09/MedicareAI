import { Appointment } from '../types';

// Real live database-driven appointment state: starts empty, populated exclusively via API / database
export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const DEPARTMENTS_LIST = [
  'All Departments',
];

export const DOCTORS_LIST = [
  'All Doctors',
  'Dr. Sarah Johnson',
  'Dr. Michael Brown',
  'Dr. Emily Carter',
  'Dr. James Wilson',
  'Dr. Sophia Chen',
  'Dr. David Miller'
];
