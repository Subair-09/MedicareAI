import { Doctor, Department, FeatureItem, StatItem } from '../types';

export const HERO_DOCTOR_IMAGE = "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=85";
export const HERO_DOCTOR_IMAGE_ALT = "https://images.unsplash.com/photo-1594824813689-e58f0003b879?auto=format&fit=crop&w=1200&q=85";

export const DOCTORS: Doctor[] = [
  {
    id: "dr-sarah-johnson",
    name: "Dr. Sarah Johnson",
    specialty: "Dermatologist",
    experience: "10+ years experience",
    imageUrl: "https://images.unsplash.com/photo-1594824813689-e58f0003b879?auto=format&fit=crop&w=600&h=600&q=80",
    education: "MD, Johns Hopkins University School of Medicine",
    bio: "Specializing in advanced clinical dermatology, skin health restoration, and pediatric skin care with over a decade of hospital clinical experience.",
    availableDays: ["Monday", "Wednesday", "Friday"],
    rating: 4.9
  },
  {
    id: "dr-michael-brown",
    name: "Dr. Michael Brown",
    specialty: "Cardiologist",
    experience: "12+ years experience",
    imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&h=600&q=80",
    education: "MD, Harvard Medical School / Cardiology Fellow",
    bio: "Dedicated cardiovascular specialist focusing on preventive cardiology, non-invasive cardiac diagnostics, and post-operative cardiac rehabilitation.",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    rating: 5.0
  },
  {
    id: "dr-amina-bello",
    name: "Dr. Amina Bello",
    specialty: "Pediatrician",
    experience: "8+ years experience",
    imageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&h=600&q=80",
    education: "MBBS, MD Pediatrics, King's College Hospital",
    bio: "Passionate child health advocate with extensive background in newborn care, developmental assessments, and acute pediatric management.",
    availableDays: ["Monday", "Tuesday", "Thursday"],
    rating: 4.95
  }
];

export const FEATURES: FeatureItem[] = [
  {
    id: "feat-1",
    title: "Book Appointments",
    description: "Find the right doctor, choose a time, and book instantly.",
    icon: "Calendar",
    bgColor: "bg-[#EAF4FF]",
    iconColor: "text-[#0878F9]"
  },
  {
    id: "feat-2",
    title: "Reschedule Appointments",
    description: "Need a different time? Change your appointment with ease.",
    icon: "RefreshCw",
    bgColor: "bg-[#E6F9F0]",
    iconColor: "text-[#20B879]"
  },
  {
    id: "feat-3",
    title: "Cancel Appointments",
    description: "Can’t make it? Cancel your appointment in just a few steps.",
    icon: "ClipboardX",
    bgColor: "bg-[#FFF0F2]",
    iconColor: "text-[#FF4D6D]"
  },
  {
    id: "feat-4",
    title: "View Appointments",
    description: "Check your upcoming and past appointments anytime.",
    icon: "Clock",
    bgColor: "bg-[#F0EAFF]",
    iconColor: "text-[#7C3AED]"
  },
  {
    id: "feat-5",
    title: "Ask Hospital Questions",
    description: "Get instant answers about our services, departments, doctors and more.",
    icon: "MessageSquare",
    bgColor: "bg-[#EAF4FF]",
    iconColor: "text-[#0878F9]"
  },
  {
    id: "feat-6",
    title: "Find Doctors & Departments",
    description: "Explore our specialists and available departments.",
    icon: "User",
    bgColor: "bg-[#F0EAFF]",
    iconColor: "text-[#8B5CF6]"
  },
  {
    id: "feat-7",
    title: "Get Reminders",
    description: "Receive SMS or email reminders for your appointments.",
    icon: "Bell",
    bgColor: "bg-[#FFF7E5]",
    iconColor: "text-[#F59E0B]"
  },
  {
    id: "feat-8",
    title: "Secure & Private",
    description: "Your information is safe and protected with us.",
    icon: "ShieldCheck",
    bgColor: "bg-[#E6F9F0]",
    iconColor: "text-[#20B879]"
  }
];

export const DEPARTMENTS: Department[] = [
  {
    id: "general-medicine",
    name: "General Medicine",
    iconName: "Stethoscope",
    description: "Comprehensive primary care, preventative health screenings, and routine physical wellness checks.",
    doctorCount: 14,
    bgTint: "bg-[#EAF4FF]",
    iconColor: "text-[#0878F9]"
  },
  {
    id: "cardiology",
    name: "Cardiology",
    iconName: "HeartPulse",
    description: "Advanced cardiac monitoring, ECGs, blood pressure management, and heart health treatments.",
    doctorCount: 8,
    bgTint: "bg-[#FFF0F2]",
    iconColor: "text-[#0878F9]"
  },
  {
    id: "dermatology",
    name: "Dermatology",
    iconName: "Sparkles",
    description: "Clinical skin condition diagnosis, acne therapy, mole examinations, and dermatological care.",
    doctorCount: 6,
    bgTint: "bg-[#EAF4FF]",
    iconColor: "text-[#0878F9]"
  },
  {
    id: "pediatrics",
    name: "Pediatrics",
    iconName: "Baby",
    description: "Dedicated compassionate medical care from neonatal stages through adolescent development.",
    doctorCount: 10,
    bgTint: "bg-[#F0EAFF]",
    iconColor: "text-[#0878F9]"
  },
  {
    id: "gynecology",
    name: "Gynecology",
    iconName: "UserCheck",
    description: "Women's wellness, prenatal guidance, gynecological surgery, and routine obstetrics.",
    doctorCount: 7,
    bgTint: "bg-[#FFF0F2]",
    iconColor: "text-[#8B5CF6]"
  },
  {
    id: "orthopedics",
    name: "Orthopedics",
    iconName: "Bone",
    description: "Musculoskeletal therapies, fracture recovery, joint replacements, and sports injuries.",
    doctorCount: 9,
    bgTint: "bg-[#EAF4FF]",
    iconColor: "text-[#0878F9]"
  },
  {
    id: "radiology",
    name: "Radiology",
    iconName: "Scan",
    description: "High-precision MRI, CT scanning, digital ultrasound, and modern diagnostic radiography.",
    doctorCount: 5,
    bgTint: "bg-[#F0EAFF]",
    iconColor: "text-[#0878F9]"
  },
  {
    id: "surgery",
    name: "Surgery",
    iconName: "Scissors",
    description: "Minimally invasive laparoscopic procedures, outpatient interventions, and acute surgical care.",
    doctorCount: 11,
    bgTint: "bg-[#EAF4FF]",
    iconColor: "text-[#0878F9]"
  }
];

export const STATS: StatItem[] = [
  {
    id: "stat-1",
    value: "10,000+",
    label: "Happy Patients",
    icon: "Smile"
  },
  {
    id: "stat-2",
    value: "50+",
    label: "Expert Doctors",
    icon: "Users"
  },
  {
    id: "stat-3",
    value: "12",
    label: "Departments",
    icon: "Building2"
  },
  {
    id: "stat-4",
    value: "24/7",
    label: "AI Support",
    icon: "Clock"
  }
];

export const FAQS = [
  {
    question: "Do I need to register or create an account to book an appointment?",
    answer: "No! Unlike traditional platforms, MediCare Hospital allows you to chat directly with our AI assistant to book, reschedule, or cancel your appointment in under 60 seconds without creating a password or logging in first."
  },
  {
    question: "How do I reschedule or cancel my appointment with the AI?",
    answer: "Simply start a chat and type 'Reschedule my appointment' or 'Cancel appointment' along with your appointment ID (e.g. MC-20481) or registered phone number. The assistant will update your slot instantly."
  },
  {
    question: "Is my medical data and personal information secure?",
    answer: "Yes, MediCare Hospital adheres strictly to HIPAA privacy standards, end-to-end data encryption, and confidential patient records. Your conversation data is never shared with third parties."
  },
  {
    question: "Can I choose a specific doctor or medical department?",
    answer: "Absolutely. You can request a specialist by name (such as Dr. Sarah Johnson or Dr. Michael Brown) or tell the AI your symptoms, and it will recommend the best available specialist."
  },
  {
    question: "What if I have an urgent emergency?",
    answer: "Our AI assistant is designed for outpatient consultations and scheduled visits. For severe medical emergencies, please call emergency services (911) or visit MediCare's 24/7 Emergency Trauma Room immediately."
  }
];
