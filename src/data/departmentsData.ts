import { AdminDepartment } from '../types';

export const INITIAL_ADMIN_DEPARTMENTS: AdminDepartment[] = [];

export const AVAILABLE_HEAD_DOCTORS: Array<{
  id: string;
  name: string;
  role: string;
  avatar?: string;
}> = [];

export const AVAILABLE_LOCATIONS = [
  'Building A - 1st Floor (General Wing)',
  'Building A - 2nd Floor (Cardiology & Heart Center)',
  'Building A - 3rd Floor (Dermatology & Wellness)',
  'Building B - 1st Floor (Pediatric Care Wing)',
  "Building B - 2nd Floor (Women's Health Pavilion)",
  'Building B - 3rd Floor (Orthopedics & Sports Medicine)',
  'Building C - Ground Floor (Imaging & Radiology Center)',
  'Building C - 2nd Floor (Oncology Care Pavilion)',
  'Building C - 3rd Floor (ENT & Audiology Clinic)',
  'Building D - 1st Floor (Urology & Kidney Center)',
  'Building D - 2nd Floor (Digestive Health Center)',
  'Building E - 4th Floor (Behavioral & Mental Health Wing)',
];
