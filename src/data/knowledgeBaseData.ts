import { KnowledgeBaseDocument, KnowledgeDocumentCategory } from '../types';

export interface CategoryInfo {
  name: KnowledgeDocumentCategory;
  count: number;
  iconBg: string;
  iconColor: string;
}

export const KNOWLEDGE_BASE_CATEGORIES: CategoryInfo[] = [
  {
    name: 'General',
    count: 0,
    iconBg: 'bg-[#EAF4FF]',
    iconColor: 'text-[#0868F5]',
  },
  {
    name: 'Cardiology',
    count: 0,
    iconBg: 'bg-[#FEECEC]',
    iconColor: 'text-[#EF4444]',
  },
  {
    name: 'Dermatology',
    count: 0,
    iconBg: 'bg-[#F4F0FF]',
    iconColor: 'text-[#7C4DFF]',
  },
  {
    name: 'Pediatrics',
    count: 0,
    iconBg: 'bg-[#E6F9F3]',
    iconColor: 'text-[#0D9488]',
  },
  {
    name: 'Orthopedics',
    count: 0,
    iconBg: 'bg-[#EAF8F1]',
    iconColor: 'text-[#19B879]',
  },
  {
    name: 'Radiology',
    count: 0,
    iconBg: 'bg-[#EBF7FC]',
    iconColor: 'text-[#0284C7]',
  },
  {
    name: 'Pharmacy',
    count: 0,
    iconBg: 'bg-[#F4EEFF]',
    iconColor: 'text-[#8B5CF6]',
  },
  {
    name: 'Emergency',
    count: 0,
    iconBg: 'bg-[#FFF4E5]',
    iconColor: 'text-[#F59E0B]',
  },
];

export const INITIAL_KNOWLEDGE_DOCUMENTS: KnowledgeBaseDocument[] = [
  {
    id: 'kb-doc-1',
    title: 'Hospital Operating Hours & Visiting Guidelines',
    filename: 'hospital_visiting_hours_policy.pdf',
    category: 'General',
    size: '1.4 MB',
    uploadedBy: {
      name: 'Adewale',
      role: 'Super Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    dateAdded: 'Sep 15, 2026',
    timeAdded: '08:30 AM',
    status: 'Active',
    ocrStatus: 'completed',
    extractedChunks: 24,
    pageCount: 2,
    extractedKeywords: ['Operating Hours', 'Visiting Guidelines', 'ICU Schedule', 'Emergency 24/7'],
    summary: 'Comprehensive policy on patient visiting hours, visitor limits, overnight stays, and 24/7 emergency entrance guidelines for MediCare Hospital.',
    description: 'General visiting hours are 8:00 AM to 8:00 PM Monday through Saturday. Emergency & Trauma services operate 24 hours daily, 7 days a week. ICU visiting hours are limited to 11:00 AM - 1:00 PM and 5:00 PM - 7:00 PM. Maximum 2 visitors per patient.',
    extractedText: `MEDICARE HOSPITAL POLICY: OPERATING HOURS & VISITATION
Document Reference: MCH-POL-2026-001

1. GENERAL HOSPITAL SCHEDULE:
- Main Hospital Outpatient Clinics: Monday – Saturday, 8:00 AM – 8:00 PM.
- Emergency Department (ED & Trauma): Open 24 hours daily, 365 days a year, with on-site emergency triage and trauma surgical teams.
- Pharmacy & Central Diagnostic Lab: Open 24 hours for emergency and inpatient dispensing; Outpatient retail pharmacy open 8:00 AM – 10:00 PM.

2. VISITATION RULES:
- General Inpatient Wards: Visiting hours are 8:00 AM to 8:00 PM daily.
- Intensive Care Unit (ICU): Strictly restricted to 11:00 AM – 1:00 PM and 5:00 PM – 7:00 PM. Only 1 immediate family member allowed at a time.
- Pediatric Ward: One parent or designated guardian permitted to stay overnight 24/7.
- Maximum 2 visitors per patient at any one time in regular wards to reduce noise and infection risk.
- All visitors must sanitize hands at the nurse reception station and obtain a daily visitor pass.`,
  },
  {
    id: 'kb-doc-2',
    title: 'Emergency Care Protocols & Trauma Unit Intake',
    filename: 'emergency_trauma_protocols.pdf',
    category: 'Emergency',
    size: '2.8 MB',
    uploadedBy: {
      name: 'Adewale',
      role: 'Super Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    dateAdded: 'Sep 15, 2026',
    timeAdded: '09:15 AM',
    status: 'Active',
    ocrStatus: 'completed',
    extractedChunks: 38,
    pageCount: 3,
    extractedKeywords: ['Emergency Care', 'Trauma Protocols', 'Triage System', 'Cardiac Arrest', 'Stroke'],
    summary: 'Standard clinical operating protocol for Emergency triage, resuscitation levels, and immediate admission protocols for trauma patients.',
    description: 'Emergency Department is staffed 24/7 with trauma physicians, resuscitation teams, and on-call surgeons. Immediate triage protocol for red-flag symptoms: chest pain, severe dyspnea, stroke/paralysis, acute hemorrhage, and unconsciousness. Hotline: 1-800-MEDICARE or 911.',
    extractedText: `MEDICARE HOSPITAL EMERGENCY & TRAUMA CLINICAL PROTOCOL
Document Reference: MCH-ED-2026-004

1. EMERGENCY CONTACT & ACCESS:
- Emergency Dispatch Hotline: 1-800-MEDICARE (Ext: 911 / 999).
- Emergency Entrance: North Gate, Ambulance Bay, open 24 hours.

2. TRIAGE CATEGORIZATION:
- Category 1 (Resuscitation - Immediate): Cardiac arrest, respiratory failure, severe anaphylaxis, massive hemorrhage, penetrating trauma.
- Category 2 (Emergent - Within 10 minutes): Crushing chest pain, signs of acute stroke (FAST), acute altered mental state, severe asthma attack.
- Category 3 (Urgent - Within 30 minutes): Moderate dyspnea, severe fractures, high fever in infants < 3 months, acute abdominal pain.
- Category 4 (Semi-urgent - Within 60 minutes): Sprains, simple lacerations, persistent vomiting.

3. SPECIALIST ON-CALL ROSTER:
- Trauma surgeons, interventional cardiologists, and anesthesiologists remain on 15-minute response standby 24/7.`,
  },
  {
    id: 'kb-doc-3',
    title: 'Accepted Health Insurance & Payment Policies',
    filename: 'accepted_insurance_plans_2026.pdf',
    category: 'General',
    size: '1.9 MB',
    uploadedBy: {
      name: 'Adewale',
      role: 'Super Administrator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    dateAdded: 'Sep 15, 2026',
    timeAdded: '10:00 AM',
    status: 'Active',
    ocrStatus: 'completed',
    extractedChunks: 30,
    pageCount: 2,
    extractedKeywords: ['Insurance Plans', 'Billing Policy', 'Consultation Fee', 'Payment Methods'],
    summary: 'Official guide on recognized health insurance networks, outpatient specialist fees ($150), copayment terms, and payment plans at MediCare Hospital.',
    description: 'MediCare accepts Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, Medicare Part B, and regional HMO providers. Co-payments are collected upon check-in. Standard outpatient specialist consultation fee is $150. Flexible payment installments available upon request.',
    extractedText: `MEDICARE HOSPITAL BILLING, FEES & HEALTH INSURANCE
Document Reference: MCH-FIN-2026-012

1. RECOGNIZED INSURANCE PROVIDERS:
- Blue Cross Blue Shield (PPO, EPO, Select)
- Aetna Health Network (Open Access, HMO, Choice POS)
- Cigna Healthcare & Cigna Global
- UnitedHealthcare (Choice Plus, Navigate, Medicare Complete)
- Medicare Part A & Part B
- Regional HMO & Corporate Health Plans

2. FEE SCHEDULE & COPAYS:
- Standard Specialist Outpatient Consultation Fee: $150 (payable via debit/credit card, Apple Pay, cash, or insurance co-pay).
- Follow-up Consultation (within 14 days of initial appointment): $75.
- Diagnostic Ultrasound: $120.
- Routine Blood Chemistry / CBC: $45.
- Standard Chest X-Ray: $90.

3. FINANCIAL ASSISTANCE & INSTALLMENT PLANS:
- Interest-free payment plans up to 6 months available through MediCare Patient Financial Assistance for balances over $300.`,
  },
  {
    id: 'kb-doc-4',
    title: 'Virology & Infectious Disease Consultation Guide',
    filename: 'virology_department_clinical_guide.pdf',
    category: 'General',
    size: '3.1 MB',
    uploadedBy: {
      name: 'Dr. Rapheael Okon',
      role: 'Head of Virology',
      avatar: 'https://res.cloudinary.com/wvhq9qpl/image/upload/v1789465009/medicare_hospital/doctors/doctor_1789465004957_compressed_SCHOOL_CERT_1_alnwzl.png',
    },
    dateAdded: 'Sep 15, 2026',
    timeAdded: '11:00 AM',
    status: 'Active',
    ocrStatus: 'completed',
    extractedChunks: 35,
    pageCount: 3,
    extractedKeywords: ['Virology', 'Infectious Disease', 'COVID-19', 'Viral Hepatitis', 'Immunization'],
    summary: 'Department guidelines for Virology consultations, fever evaluations, viral panels, and isolation precautions under Dr. Rapheael Okon.',
    description: 'Virology department located in Room 304 specializes in viral infections, influenza, COVID-19 management, post-viral fatigue, viral hepatitis, and preventative immunization. Consultations available Monday through Friday 9:00 AM to 4:00 PM.',
    extractedText: `MEDICARE HOSPITAL VIROLOGY & INFECTIOUS DISEASE CLINICAL DIRECTIVE
Document Reference: MCH-VIR-2026-003

1. DEPARTMENT LOCATION & LEADERSHIP:
- Department: Virology & Infectious Diseases
- Head of Department: Dr. Rapheael Okon (Room 304, 3rd Floor East Wing)
- Consultation Hours: Monday – Friday, 9:00 AM – 4:00 PM

2. CLINICAL SCOPE & SPECIALTIES:
- Acute Viral Fevers, Influenza A/B, RSV, and Dengue triage.
- Chronic viral infections: Hepatitis B, Hepatitis C, HIV management, Cytomegalovirus (CMV).
- Post-acute infection syndromes (Long COVID, persistent fatigue, post-viral myalgia).
- Travel medicine vaccinations and preventative immunization counseling.

3. PATIENT VISIT PREPARATION:
- Patients experiencing acute respiratory symptoms (cough, fever > 38°C) should wear a surgical mask upon arrival.
- Please bring previous vaccination records and any prior viral serology lab results.`,
  },
  {
    id: 'kb-doc-5',
    title: 'Radiology & Diagnostic Imaging Patient Preparation',
    filename: 'radiology_scan_instructions.pdf',
    category: 'Radiology',
    size: '2.2 MB',
    uploadedBy: {
      name: 'Dr. Kalu Okonkwo',
      role: 'Head of Radiology',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    },
    dateAdded: 'Sep 15, 2026',
    timeAdded: '11:45 AM',
    status: 'Active',
    ocrStatus: 'completed',
    extractedChunks: 32,
    pageCount: 2,
    extractedKeywords: ['Radiology', 'MRI', 'CT Scan', 'Ultrasound', 'Patient Preparation', 'Fasting'],
    summary: 'Patient instructions and fasting protocols for CT, MRI, Ultrasound, and X-Ray procedures under Dr. Kalu Okonkwo in Room 209.',
    description: 'Radiology department located in Room 209 provides Digital X-Ray, Multi-slice CT, High-field MRI, and Ultrasound. For abdominal ultrasound, patients must fast for 6 hours prior. For contrast CT/MRI, recent renal function panel (eGFR/Creatinine) is required.',
    extractedText: `MEDICARE HOSPITAL RADIOLOGY & IMAGING PATIENT INSTRUCTIONS
Document Reference: MCH-RAD-2026-008

1. DEPARTMENT LOCATION & LEADERSHIP:
- Department: Radiology & Diagnostic Imaging
- Head of Department: Dr. Kalu Okonkwo (Room 209, 2nd Floor Imaging Suite)
- Operating Hours: Monday – Saturday, 8:00 AM – 6:00 PM (Emergency scans 24/7)

2. PRE-PROCEDURAL PREPARATION GUIDELINES:
- Abdominal Ultrasound: Strict fasting (no food or drinks except plain water) for 6 hours prior to examination.
- Pelvic / Obstetric Ultrasound: Drink 1 liter of plain water 1 hour before scan; do not empty bladder prior to the procedure.
- Contrast-Enhanced CT / MRI:
  * Recent serum creatinine / eGFR lab results within past 30 days mandatory.
  * Fasting for 4 hours prior to scan.
  * Remove all metallic objects, jewelry, dentures, and hearing aids.
  * Inform radiological team if you have cardiac pacemakers, metal implants, or severe iodine allergies.
- Routine Digital Chest X-Ray: No fasting required. Wear loose clothing without metal zippers.`,
  },
];
