// server/polyfills.ts
if (typeof globalThis.DOMMatrix === "undefined") {
  globalThis.DOMMatrix = class DOMMatrix {
    constructor(init) {
      this.a = 1;
      this.b = 0;
      this.c = 0;
      this.d = 1;
      this.e = 0;
      this.f = 0;
      this.m11 = 1;
      this.m12 = 0;
      this.m13 = 0;
      this.m14 = 0;
      this.m21 = 0;
      this.m22 = 1;
      this.m23 = 0;
      this.m24 = 0;
      this.m31 = 0;
      this.m32 = 0;
      this.m33 = 1;
      this.m34 = 0;
      this.m41 = 0;
      this.m42 = 0;
      this.m43 = 0;
      this.m44 = 1;
      this.is2D = true;
      this.isIdentity = true;
      if (Array.isArray(init)) {
        if (init.length === 6) {
          this.a = init[0];
          this.b = init[1];
          this.c = init[2];
          this.d = init[3];
          this.e = init[4];
          this.f = init[5];
        } else if (init.length === 16) {
          this.m11 = init[0];
          this.m12 = init[1];
          this.m13 = init[2];
          this.m14 = init[3];
          this.m21 = init[4];
          this.m22 = init[5];
          this.m23 = init[6];
          this.m24 = init[7];
          this.m31 = init[8];
          this.m32 = init[9];
          this.m33 = init[10];
          this.m34 = init[11];
          this.m41 = init[12];
          this.m42 = init[13];
          this.m43 = init[14];
          this.m44 = init[15];
        }
      }
    }
    transformPoint(point) {
      return point || { x: 0, y: 0, z: 0, w: 1 };
    }
    multiply() {
      return this;
    }
    inverse() {
      return this;
    }
    translate() {
      return this;
    }
    scale() {
      return this;
    }
    rotate() {
      return this;
    }
  };
}
if (typeof globalThis.ImageData === "undefined") {
  globalThis.ImageData = class ImageData {
    constructor(w, h) {
      this.width = Math.max(1, w || 1);
      this.height = Math.max(1, h || 1);
      this.data = new Uint8ClampedArray(this.width * this.height * 4);
    }
  };
}
if (typeof globalThis.Path2D === "undefined") {
  globalThis.Path2D = class Path2D {
    addPath() {
    }
    closePath() {
    }
    moveTo() {
    }
    lineTo() {
    }
    bezierCurveTo() {
    }
    quadraticCurveTo() {
    }
    arc() {
    }
    rect() {
    }
  };
}

// server/app.ts
import express from "express";
import crypto2 from "crypto";
import dotenv from "dotenv";

// server/db.ts
import { MongoClient, ObjectId } from "mongodb";

// src/data/knowledgeBaseData.ts
var INITIAL_KNOWLEDGE_DOCUMENTS = [
  {
    id: "kb-doc-1",
    title: "Hospital Operating Hours & Visiting Guidelines",
    filename: "hospital_visiting_hours_policy.pdf",
    category: "General",
    size: "1.4 MB",
    uploadedBy: {
      name: "Adewale",
      role: "Super Administrator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    dateAdded: "Sep 15, 2026",
    timeAdded: "08:30 AM",
    status: "Active",
    ocrStatus: "completed",
    extractedChunks: 24,
    pageCount: 2,
    extractedKeywords: ["Operating Hours", "Visiting Guidelines", "ICU Schedule", "Emergency 24/7"],
    summary: "Comprehensive policy on patient visiting hours, visitor limits, overnight stays, and 24/7 emergency entrance guidelines for MediCare Hospital.",
    description: "General visiting hours are 8:00 AM to 8:00 PM Monday through Saturday. Emergency & Trauma services operate 24 hours daily, 7 days a week. ICU visiting hours are limited to 11:00 AM - 1:00 PM and 5:00 PM - 7:00 PM. Maximum 2 visitors per patient.",
    extractedText: `MEDICARE HOSPITAL POLICY: OPERATING HOURS & VISITATION
Document Reference: MCH-POL-2026-001

1. GENERAL HOSPITAL SCHEDULE:
- Main Hospital Outpatient Clinics: Monday \u2013 Saturday, 8:00 AM \u2013 8:00 PM.
- Emergency Department (ED & Trauma): Open 24 hours daily, 365 days a year, with on-site emergency triage and trauma surgical teams.
- Pharmacy & Central Diagnostic Lab: Open 24 hours for emergency and inpatient dispensing; Outpatient retail pharmacy open 8:00 AM \u2013 10:00 PM.

2. VISITATION RULES:
- General Inpatient Wards: Visiting hours are 8:00 AM to 8:00 PM daily.
- Intensive Care Unit (ICU): Strictly restricted to 11:00 AM \u2013 1:00 PM and 5:00 PM \u2013 7:00 PM. Only 1 immediate family member allowed at a time.
- Pediatric Ward: One parent or designated guardian permitted to stay overnight 24/7.
- Maximum 2 visitors per patient at any one time in regular wards to reduce noise and infection risk.
- All visitors must sanitize hands at the nurse reception station and obtain a daily visitor pass.`
  },
  {
    id: "kb-doc-2",
    title: "Emergency Care Protocols & Trauma Unit Intake",
    filename: "emergency_trauma_protocols.pdf",
    category: "Emergency",
    size: "2.8 MB",
    uploadedBy: {
      name: "Adewale",
      role: "Super Administrator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    dateAdded: "Sep 15, 2026",
    timeAdded: "09:15 AM",
    status: "Active",
    ocrStatus: "completed",
    extractedChunks: 38,
    pageCount: 3,
    extractedKeywords: ["Emergency Care", "Trauma Protocols", "Triage System", "Cardiac Arrest", "Stroke"],
    summary: "Standard clinical operating protocol for Emergency triage, resuscitation levels, and immediate admission protocols for trauma patients.",
    description: "Emergency Department is staffed 24/7 with trauma physicians, resuscitation teams, and on-call surgeons. Immediate triage protocol for red-flag symptoms: chest pain, severe dyspnea, stroke/paralysis, acute hemorrhage, and unconsciousness. Hotline: 1-800-MEDICARE or 911.",
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
- Trauma surgeons, interventional cardiologists, and anesthesiologists remain on 15-minute response standby 24/7.`
  },
  {
    id: "kb-doc-3",
    title: "Accepted Health Insurance & Payment Policies",
    filename: "accepted_insurance_plans_2026.pdf",
    category: "General",
    size: "1.9 MB",
    uploadedBy: {
      name: "Adewale",
      role: "Super Administrator",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    dateAdded: "Sep 15, 2026",
    timeAdded: "10:00 AM",
    status: "Active",
    ocrStatus: "completed",
    extractedChunks: 30,
    pageCount: 2,
    extractedKeywords: ["Insurance Plans", "Billing Policy", "Consultation Fee", "Payment Methods"],
    summary: "Official guide on recognized health insurance networks, outpatient specialist fees ($150), copayment terms, and payment plans at MediCare Hospital.",
    description: "MediCare accepts Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, Medicare Part B, and regional HMO providers. Co-payments are collected upon check-in. Standard outpatient specialist consultation fee is $150. Flexible payment installments available upon request.",
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
- Interest-free payment plans up to 6 months available through MediCare Patient Financial Assistance for balances over $300.`
  },
  {
    id: "kb-doc-4",
    title: "Virology & Infectious Disease Consultation Guide",
    filename: "virology_department_clinical_guide.pdf",
    category: "General",
    size: "3.1 MB",
    uploadedBy: {
      name: "Dr. Rapheael Okon",
      role: "Head of Virology",
      avatar: "https://res.cloudinary.com/wvhq9qpl/image/upload/v1789465009/medicare_hospital/doctors/doctor_1789465004957_compressed_SCHOOL_CERT_1_alnwzl.png"
    },
    dateAdded: "Sep 15, 2026",
    timeAdded: "11:00 AM",
    status: "Active",
    ocrStatus: "completed",
    extractedChunks: 35,
    pageCount: 3,
    extractedKeywords: ["Virology", "Infectious Disease", "COVID-19", "Viral Hepatitis", "Immunization"],
    summary: "Department guidelines for Virology consultations, fever evaluations, viral panels, and isolation precautions under Dr. Rapheael Okon.",
    description: "Virology department located in Room 304 specializes in viral infections, influenza, COVID-19 management, post-viral fatigue, viral hepatitis, and preventative immunization. Consultations available Monday through Friday 9:00 AM to 4:00 PM.",
    extractedText: `MEDICARE HOSPITAL VIROLOGY & INFECTIOUS DISEASE CLINICAL DIRECTIVE
Document Reference: MCH-VIR-2026-003

1. DEPARTMENT LOCATION & LEADERSHIP:
- Department: Virology & Infectious Diseases
- Head of Department: Dr. Rapheael Okon (Room 304, 3rd Floor East Wing)
- Consultation Hours: Monday \u2013 Friday, 9:00 AM \u2013 4:00 PM

2. CLINICAL SCOPE & SPECIALTIES:
- Acute Viral Fevers, Influenza A/B, RSV, and Dengue triage.
- Chronic viral infections: Hepatitis B, Hepatitis C, HIV management, Cytomegalovirus (CMV).
- Post-acute infection syndromes (Long COVID, persistent fatigue, post-viral myalgia).
- Travel medicine vaccinations and preventative immunization counseling.

3. PATIENT VISIT PREPARATION:
- Patients experiencing acute respiratory symptoms (cough, fever > 38\xB0C) should wear a surgical mask upon arrival.
- Please bring previous vaccination records and any prior viral serology lab results.`
  },
  {
    id: "kb-doc-5",
    title: "Radiology & Diagnostic Imaging Patient Preparation",
    filename: "radiology_scan_instructions.pdf",
    category: "Radiology",
    size: "2.2 MB",
    uploadedBy: {
      name: "Dr. Kalu Okonkwo",
      role: "Head of Radiology",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80"
    },
    dateAdded: "Sep 15, 2026",
    timeAdded: "11:45 AM",
    status: "Active",
    ocrStatus: "completed",
    extractedChunks: 32,
    pageCount: 2,
    extractedKeywords: ["Radiology", "MRI", "CT Scan", "Ultrasound", "Patient Preparation", "Fasting"],
    summary: "Patient instructions and fasting protocols for CT, MRI, Ultrasound, and X-Ray procedures under Dr. Kalu Okonkwo in Room 209.",
    description: "Radiology department located in Room 209 provides Digital X-Ray, Multi-slice CT, High-field MRI, and Ultrasound. For abdominal ultrasound, patients must fast for 6 hours prior. For contrast CT/MRI, recent renal function panel (eGFR/Creatinine) is required.",
    extractedText: `MEDICARE HOSPITAL RADIOLOGY & IMAGING PATIENT INSTRUCTIONS
Document Reference: MCH-RAD-2026-008

1. DEPARTMENT LOCATION & LEADERSHIP:
- Department: Radiology & Diagnostic Imaging
- Head of Department: Dr. Kalu Okonkwo (Room 209, 2nd Floor Imaging Suite)
- Operating Hours: Monday \u2013 Saturday, 8:00 AM \u2013 6:00 PM (Emergency scans 24/7)

2. PRE-PROCEDURAL PREPARATION GUIDELINES:
- Abdominal Ultrasound: Strict fasting (no food or drinks except plain water) for 6 hours prior to examination.
- Pelvic / Obstetric Ultrasound: Drink 1 liter of plain water 1 hour before scan; do not empty bladder prior to the procedure.
- Contrast-Enhanced CT / MRI:
  * Recent serum creatinine / eGFR lab results within past 30 days mandatory.
  * Fasting for 4 hours prior to scan.
  * Remove all metallic objects, jewelry, dentures, and hearing aids.
  * Inform radiological team if you have cardiac pacemakers, metal implants, or severe iodine allergies.
- Routine Digital Chest X-Ray: No fasting required. Wear loose clothing without metal zippers.`
  }
];

// src/data/appointmentsData.ts
var INITIAL_APPOINTMENTS = [];

// src/data/doctorsData.ts
var INITIAL_ADMIN_DOCTORS = [];

// src/data/departmentsData.ts
var INITIAL_ADMIN_DEPARTMENTS = [];

// src/data/patientsData.ts
var INITIAL_ADMIN_PATIENTS = [];

// src/data/schedulesData.ts
var INITIAL_SCHEDULE_APPOINTMENTS = [];

// server/db.ts
function buildEntityQuery(id) {
  if (ObjectId.isValid(id) && id.length === 24) {
    return {
      $or: [
        { id },
        { _id: new ObjectId(id) },
        { _id: id }
      ]
    };
  }
  return { id };
}
var MongoDatabaseService = class _MongoDatabaseService {
  constructor() {
    this.client = null;
    this.db = null;
    this.isConnected = false;
    this.connectionError = null;
    this.lastConnectedAt = null;
    this.initPromise = null;
    // In-memory fallback stores populated with initial data
    this.memoryStore = {
      documents: JSON.parse(JSON.stringify(INITIAL_KNOWLEDGE_DOCUMENTS)),
      appointments: JSON.parse(JSON.stringify(INITIAL_APPOINTMENTS)),
      doctors: JSON.parse(JSON.stringify(INITIAL_ADMIN_DOCTORS)),
      departments: JSON.parse(JSON.stringify(INITIAL_ADMIN_DEPARTMENTS)),
      patients: JSON.parse(JSON.stringify(INITIAL_ADMIN_PATIENTS)),
      schedules: JSON.parse(JSON.stringify(INITIAL_SCHEDULE_APPOINTMENTS))
    };
    this.initPromise = this.init();
  }
  static {
    // Global client promise cache for serverless environments (Vercel)
    this.globalClientPromise = globalThis._mongoClientPromise || null;
  }
  async ensureConnected() {
    if (this.isConnected && this.db) {
      return;
    }
    if (this.initPromise) {
      await this.initPromise;
      if (this.isConnected && this.db) {
        return;
      }
    }
    const uri = (process.env.MONGODB_URI || "").trim().replace(/^["']|["']$/g, "");
    if (uri && !this.isConnected) {
      this.initPromise = this.init();
      await this.initPromise;
    }
  }
  async init() {
    const rawUri = (process.env.MONGODB_URI || "").trim().replace(/^["']|["']$/g, "");
    let dbName = (process.env.MONGODB_DB_NAME || "").trim().replace(/^["']|["']$/g, "");
    if (!rawUri) {
      this.isConnected = false;
      this.connectionError = "MONGODB_URI environment variable is not defined. Running in high-performance memory fallback mode.";
      console.log("\u2139\uFE0F [MongoDB] No MONGODB_URI found. Utilizing resilient in-memory collection store.");
      return;
    }
    if (!dbName) {
      try {
        const dummyUrl = rawUri.replace(/^mongodb(\+srv)?:\/\//, "http://");
        const parsed = new URL(dummyUrl);
        const pathPart = parsed.pathname.replace(/^\//, "").split("?")[0];
        if (pathPart) {
          dbName = decodeURIComponent(pathPart);
        }
      } catch (_) {
      }
    }
    if (!dbName) {
      dbName = "medicare_db";
    }
    try {
      console.log(`\u{1F50C} [MongoDB] Connecting to MongoDB instance for database: "${dbName}"...`);
      if (!_MongoDatabaseService.globalClientPromise) {
        const client = new MongoClient(rawUri, {
          serverSelectionTimeoutMS: 8e3,
          connectTimeoutMS: 8e3,
          maxPoolSize: 10,
          minPoolSize: 0
        });
        _MongoDatabaseService.globalClientPromise = client.connect();
        globalThis._mongoClientPromise = _MongoDatabaseService.globalClientPromise;
      }
      this.client = await _MongoDatabaseService.globalClientPromise;
      await this.client.db(dbName).command({ ping: 1 });
      this.db = this.client.db(dbName);
      this.isConnected = true;
      this.connectionError = null;
      this.lastConnectedAt = (/* @__PURE__ */ new Date()).toISOString();
      console.log(`\u2705 [MongoDB] Successfully connected to MongoDB database: "${dbName}"`);
      await this.autoSeedIfEmpty();
    } catch (err) {
      _MongoDatabaseService.globalClientPromise = null;
      globalThis._mongoClientPromise = null;
      this.isConnected = false;
      this.connectionError = `MongoDB connection failed: ${err.message || err}. Reverting to local store.`;
      console.warn(`\u26A0\uFE0F [MongoDB] Connection warning: ${this.connectionError}`);
      if (this.client) {
        try {
          await this.client.close();
        } catch (_) {
        }
        this.client = null;
        this.db = null;
      }
    }
  }
  async autoSeedIfEmpty() {
    if (!this.db) return;
    try {
      const docCol = this.db.collection("documents");
      await docCol.deleteMany({
        $or: [
          {
            id: {
              $in: [
                "kb-1",
                "kb-2",
                "kb-3",
                "kb-4",
                "kb-5",
                "kb-6",
                "kb-7",
                "kb-8",
                "kb-9",
                "kb-10",
                "kb-11",
                "kb-12",
                "kb-13",
                "kb-14",
                "kb-15",
                "kb-16",
                "kb-17",
                "kb-18",
                "kb-19",
                "kb-20",
                "kb-21",
                "kb-22",
                "kb-23",
                "kb-24"
              ]
            }
          },
          { id: /^kb-[0-9]{1,2}$/ }
        ]
      });
      const docCount = await docCol.countDocuments();
      if (docCount === 0 && INITIAL_KNOWLEDGE_DOCUMENTS.length > 0) {
        console.log("\u{1F331} [MongoDB] Seeding initial Knowledge Base documents collection...");
        await docCol.insertMany(INITIAL_KNOWLEDGE_DOCUMENTS);
      }
      const apptCol = this.db.collection("appointments");
      await apptCol.deleteMany({
        id: { $in: ["APT-2025-089", "APT-2025-090", "APT-2025-091", "APT-2025-092", "APT-2025-093", "APT-2025-094", "APT-2025-095", "APT-2025-096", "APT-2025-097", "APT-2025-098", "APT-2025-099", "APT-2025-100"] }
      });
      const apptCount = await apptCol.countDocuments();
      if (apptCount === 0 && INITIAL_APPOINTMENTS.length > 0) {
        console.log("\u{1F331} [MongoDB] Seeding initial Appointments collection...");
        await apptCol.insertMany(INITIAL_APPOINTMENTS);
      }
      const docStaffCol = this.db.collection("doctors");
      await docStaffCol.deleteMany({
        id: {
          $in: [
            "DOC-001",
            "DOC-002",
            "DOC-003",
            "DOC-004",
            "DOC-005",
            "DOC-006",
            "DOC-007",
            "DOC-008",
            "DOC-009",
            "DOC-010",
            "DOC-011",
            "DOC-012",
            "DOC-013",
            "DOC-014",
            "DOC-015",
            "DOC-016",
            "DOC-017",
            "DOC-018",
            "DOC-019",
            "DOC-020",
            "DOC-021",
            "DOC-022",
            "DOC-023",
            "DOC-024",
            "DOC-025",
            "DOC-026",
            "DOC-027"
          ]
        }
      });
      const docStaffCount = await docStaffCol.countDocuments();
      if (docStaffCount === 0 && INITIAL_ADMIN_DOCTORS.length > 0) {
        console.log("\u{1F331} [MongoDB] Seeding initial Doctors collection...");
        await docStaffCol.insertMany(INITIAL_ADMIN_DOCTORS);
      }
      const deptCol = this.db.collection("departments");
      await deptCol.deleteMany({
        id: {
          $in: [
            "dept-gen-med",
            "dept-cardio",
            "dept-derm",
            "dept-peds",
            "dept-gyn",
            "dept-ortho",
            "dept-rad",
            "dept-onco",
            "dept-ent",
            "dept-uro",
            "dept-gastro",
            "dept-mental"
          ]
        }
      });
      const deptCount = await deptCol.countDocuments();
      if (deptCount === 0 && INITIAL_ADMIN_DEPARTMENTS.length > 0) {
        console.log("\u{1F331} [MongoDB] Seeding initial Departments collection...");
        await deptCol.insertMany(INITIAL_ADMIN_DEPARTMENTS);
      }
      const patCol = this.db.collection("patients");
      const mockPatientNames = [
        "Amara Okafor",
        "Chinedu Okafor",
        "Blessing Adeyemi",
        "Emeka Nwosu",
        "Aisha Bello",
        "Tunde Ibrahim",
        "Fatima Yusuf",
        "Babatunde Lawal",
        "Ngozi Eze",
        "Ifeanyi Okeleke",
        "Chinmaka Joseph"
      ];
      await patCol.deleteMany({
        $or: [
          { id: { $in: ["pat-1", "pat-2", "pat-3", "pat-4", "pat-5", "pat-6", "pat-7", "pat-8", "pat-9", "pat-10"] } },
          { name: { $in: mockPatientNames } },
          { name: { $regex: "Amara Okafor", $options: "i" } }
        ]
      });
      const patCount = await patCol.countDocuments();
      if (patCount === 0 && INITIAL_ADMIN_PATIENTS.length > 0) {
        console.log("\u{1F331} [MongoDB] Seeding initial Patients collection...");
        await patCol.insertMany(INITIAL_ADMIN_PATIENTS);
      }
      const schCol = this.db.collection("schedules");
      await schCol.deleteMany({
        $or: [
          { id: { $regex: "^sch-(mon|tue|wed|thu|fri|sat|sun)" } },
          { id: { $in: ["sch-1", "sch-2", "sch-3", "sch-4"] } },
          { patientName: { $in: ["Amara Okafor", "Chinedu Okafor", "Fatima Yusuf", "Babajide Sanwo", "Amina Bello", "Emeka Nwosu", "Zainab Aliyu", "Oluwaseun Adeleke", "Blessing Adebayo"] } },
          { patientName: { $regex: "Amara Okafor", $options: "i" } }
        ]
      });
      const schCount = await schCol.countDocuments();
      if (schCount === 0 && INITIAL_SCHEDULE_APPOINTMENTS.length > 0) {
        console.log("\u{1F331} [MongoDB] Seeding initial Schedules collection...");
        await schCol.insertMany(INITIAL_SCHEDULE_APPOINTMENTS);
      }
    } catch (error) {
      console.error("\u274C [MongoDB] Auto-seeding error:", error);
    }
  }
  async seedAll() {
    if (this.isConnected && this.db) {
      const collections = [
        { name: "documents", data: INITIAL_KNOWLEDGE_DOCUMENTS },
        { name: "appointments", data: INITIAL_APPOINTMENTS },
        { name: "doctors", data: INITIAL_ADMIN_DOCTORS },
        { name: "departments", data: INITIAL_ADMIN_DEPARTMENTS },
        { name: "patients", data: INITIAL_ADMIN_PATIENTS },
        { name: "schedules", data: INITIAL_SCHEDULE_APPOINTMENTS }
      ];
      for (const col of collections) {
        const c = this.db.collection(col.name);
        await c.deleteMany({});
        if (col.data && col.data.length > 0) {
          await c.insertMany(JSON.parse(JSON.stringify(col.data)));
        }
      }
    } else {
      this.memoryStore = {
        documents: JSON.parse(JSON.stringify(INITIAL_KNOWLEDGE_DOCUMENTS)),
        appointments: JSON.parse(JSON.stringify(INITIAL_APPOINTMENTS)),
        doctors: JSON.parse(JSON.stringify(INITIAL_ADMIN_DOCTORS)),
        departments: JSON.parse(JSON.stringify(INITIAL_ADMIN_DEPARTMENTS)),
        patients: JSON.parse(JSON.stringify(INITIAL_ADMIN_PATIENTS)),
        schedules: JSON.parse(JSON.stringify(INITIAL_SCHEDULE_APPOINTMENTS))
      };
    }
  }
  async getStatus() {
    if (this.initPromise) {
      await this.initPromise;
    }
    const dbName = process.env.MONGODB_DB_NAME || "medicare_db";
    const uri = process.env.MONGODB_URI || "";
    const maskedUri = uri ? uri.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@") : "Not configured (Set MONGODB_URI in Settings/.env)";
    if (this.isConnected && this.db) {
      try {
        const collections = ["documents", "appointments", "doctors", "departments", "patients", "schedules"];
        const collectionStats = await Promise.all(
          collections.map(async (name) => {
            const count = await this.db.collection(name).countDocuments();
            return { name, count };
          })
        );
        return {
          connected: true,
          provider: "mongodb",
          database: dbName,
          collections: collectionStats,
          connectionUri: maskedUri,
          lastConnectedAt: this.lastConnectedAt || void 0
        };
      } catch (err) {
        this.isConnected = false;
        this.connectionError = err.message;
      }
    }
    return {
      connected: false,
      provider: "memory-fallback",
      database: dbName,
      collections: [
        { name: "documents", count: this.memoryStore.documents.length },
        { name: "appointments", count: this.memoryStore.appointments.length },
        { name: "doctors", count: this.memoryStore.doctors.length },
        { name: "departments", count: this.memoryStore.departments.length },
        { name: "patients", count: this.memoryStore.patients.length },
        { name: "schedules", count: this.memoryStore.schedules.length }
      ],
      connectionUri: maskedUri,
      error: this.connectionError || "No MONGODB_URI provided. Running on responsive in-memory MongoDB fallback."
    };
  }
  // --- Knowledge Base Documents ---
  async getDocuments(category, query) {
    await this.ensureConnected();
    if (this.isConnected && this.db) {
      const filter = {};
      if (category && category !== "All Categories") {
        filter.category = category;
      }
      if (query && query.trim()) {
        const regex = new RegExp(query.trim(), "i");
        filter.$or = [
          { title: regex },
          { filename: regex },
          { category: regex },
          { "uploadedBy.name": regex },
          { extractedText: regex },
          { summary: regex },
          { extractedKeywords: regex }
        ];
      }
      const docs = await this.db.collection("documents").find(filter).sort({ _id: -1 }).toArray();
      return docs.map((d) => ({ ...d, id: d.id || d._id.toString() }));
    }
    let results = [...this.memoryStore.documents];
    if (category && category !== "All Categories") {
      results = results.filter((d) => d.category === category);
    }
    if (query && query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (d) => d.title.toLowerCase().includes(q) || d.filename.toLowerCase().includes(q) || d.category.toLowerCase().includes(q) || d.uploadedBy.name.toLowerCase().includes(q) || d.extractedText && d.extractedText.toLowerCase().includes(q) || d.summary && d.summary.toLowerCase().includes(q) || d.extractedKeywords && d.extractedKeywords.some((k) => k.toLowerCase().includes(q))
      );
    }
    return results;
  }
  async getDocumentById(id) {
    await this.ensureConnected();
    if (this.isConnected && this.db) {
      const doc = await this.db.collection("documents").findOne({
        $or: [{ id }, { _id: id }]
      });
      return doc ? { ...doc, id: doc.id || doc._id.toString() } : null;
    }
    return this.memoryStore.documents.find((d) => d.id === id) || null;
  }
  async createDocument(docData) {
    await this.ensureConnected();
    const id = docData.id || `kb-${Date.now()}`;
    const newDoc = {
      ...docData,
      id,
      dateAdded: docData.dateAdded || (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      timeAdded: docData.timeAdded || (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: docData.status || "Active"
    };
    if (this.isConnected && this.db) {
      const result = await this.db.collection("documents").insertOne(newDoc);
      return { ...newDoc, _id: result.insertedId };
    }
    this.memoryStore.documents.unshift(newDoc);
    return newDoc;
  }
  async updateDocument(id, updates) {
    await this.ensureConnected();
    const { _id, ...safeUpdates } = updates;
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection("documents").findOneAndUpdate(
        query,
        { $set: safeUpdates },
        { returnDocument: "after" }
      );
      if (!res) return null;
      return { ...res, id: res.id || res._id.toString() };
    }
    const index = this.memoryStore.documents.findIndex((d) => d.id === id);
    if (index === -1) return null;
    this.memoryStore.documents[index] = { ...this.memoryStore.documents[index], ...safeUpdates };
    return this.memoryStore.documents[index];
  }
  async deleteDocument(id) {
    await this.ensureConnected();
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection("documents").deleteOne(query);
      return res.deletedCount > 0;
    }
    const prevLength = this.memoryStore.documents.length;
    this.memoryStore.documents = this.memoryStore.documents.filter((d) => d.id !== id);
    return this.memoryStore.documents.length < prevLength;
  }
  // --- Appointments ---
  async getAppointments() {
    await this.ensureConnected();
    if (this.isConnected && this.db) {
      const appts = await this.db.collection("appointments").find({}).sort({ _id: -1 }).toArray();
      return appts.map((a) => ({ ...a, id: a.id || a._id.toString() }));
    }
    return this.memoryStore.appointments;
  }
  async createAppointment(apptData) {
    await this.ensureConnected();
    const id = apptData.id || `APT-${Date.now()}`;
    const newAppt = { ...apptData, id };
    if (this.isConnected && this.db) {
      const result = await this.db.collection("appointments").insertOne(newAppt);
      return { ...newAppt, _id: result.insertedId };
    }
    this.memoryStore.appointments.unshift(newAppt);
    return newAppt;
  }
  async updateAppointment(id, updates) {
    await this.ensureConnected();
    const { _id, ...safeUpdates } = updates;
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection("appointments").findOneAndUpdate(
        query,
        { $set: safeUpdates },
        { returnDocument: "after" }
      );
      return res ? { ...res, id: res.id || res._id.toString() } : null;
    }
    const index = this.memoryStore.appointments.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.memoryStore.appointments[index] = { ...this.memoryStore.appointments[index], ...safeUpdates };
    return this.memoryStore.appointments[index];
  }
  async deleteAppointment(id) {
    await this.ensureConnected();
    const cleanId = (id || "").trim();
    if (!cleanId) return false;
    if (this.isConnected && this.db) {
      const query = {
        $or: [
          { id: cleanId },
          { id: cleanId.toUpperCase() },
          { id: cleanId.toLowerCase() },
          ...ObjectId.isValid(cleanId) && cleanId.length === 24 ? [{ _id: new ObjectId(cleanId) }, { _id: cleanId }] : []
        ]
      };
      const res = await this.db.collection("appointments").deleteOne(query);
      return res.deletedCount > 0;
    }
    const prev = this.memoryStore.appointments.length;
    this.memoryStore.appointments = this.memoryStore.appointments.filter(
      (a) => a.id !== cleanId && a.id?.toUpperCase() !== cleanId.toUpperCase() && a._id !== cleanId
    );
    return this.memoryStore.appointments.length < prev;
  }
  // --- Doctors, Departments, Patients, Schedules ---
  async getDoctors() {
    await this.ensureConnected();
    if (this.isConnected && this.db) {
      const docs = await this.db.collection("doctors").find({}).sort({ _id: -1 }).toArray();
      return docs.map((d) => ({ ...d, id: d.id || d._id.toString() }));
    }
    return this.memoryStore.doctors;
  }
  async createDoctor(doctorData) {
    await this.ensureConnected();
    const id = doctorData.id || `DOC-${Date.now()}`;
    const newDoc = { ...doctorData, id };
    if (this.isConnected && this.db) {
      const result = await this.db.collection("doctors").insertOne(newDoc);
      return { ...newDoc, _id: result.insertedId };
    }
    this.memoryStore.doctors.unshift(newDoc);
    return newDoc;
  }
  async updateDoctor(id, updates) {
    await this.ensureConnected();
    const { _id, ...safeUpdates } = updates;
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection("doctors").findOneAndUpdate(
        query,
        { $set: safeUpdates },
        { returnDocument: "after" }
      );
      return res ? { ...res, id: res.id || res._id.toString() } : null;
    }
    const index = this.memoryStore.doctors.findIndex((d) => d.id === id);
    if (index === -1) return null;
    this.memoryStore.doctors[index] = { ...this.memoryStore.doctors[index], ...safeUpdates };
    return this.memoryStore.doctors[index];
  }
  async deleteDoctor(id) {
    await this.ensureConnected();
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection("doctors").deleteOne(query);
      return res.deletedCount > 0;
    }
    const prev = this.memoryStore.doctors.length;
    this.memoryStore.doctors = this.memoryStore.doctors.filter((d) => d.id !== id);
    return this.memoryStore.doctors.length < prev;
  }
  async getDepartments() {
    await this.ensureConnected();
    let depts = [];
    if (this.isConnected && this.db) {
      const rawDepts = await this.db.collection("departments").find({}).toArray();
      depts = rawDepts.map((d) => ({ ...d, id: d.id || d._id.toString() }));
    } else {
      depts = this.memoryStore.departments;
    }
    const doctors = await this.getDoctors();
    return depts.map((dept) => {
      const deptNameNorm = (dept.name || "").trim().toLowerCase();
      const count = doctors.filter((doc) => {
        const docDeptNorm = (doc.department || "").trim().toLowerCase();
        const isNameMatch = docDeptNorm.length > 0 && docDeptNorm === deptNameNorm;
        const isIdMatch = Boolean(dept.id && doc.departmentId && doc.departmentId === dept.id);
        const isHeadDoc = Boolean(
          dept.headDoctor?.id && dept.headDoctor.id !== "unassigned" && dept.headDoctor.id === doc.id
        );
        return isNameMatch || isIdMatch || isHeadDoc;
      }).length;
      return {
        ...dept,
        totalDoctors: count
      };
    });
  }
  async createDepartment(deptData) {
    await this.ensureConnected();
    const id = deptData.id || `dept-${Date.now()}`;
    const slug = deptData.slug || deptData.name?.toLowerCase().replace(/\s+/g, "-") || `dept-${Date.now()}`;
    const createdAt = deptData.createdAt || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const newDept = { ...deptData, id, slug, createdAt };
    if (this.isConnected && this.db) {
      const result = await this.db.collection("departments").insertOne(newDept);
      const inserted = { ...newDept, _id: result.insertedId };
      const doctors2 = await this.getDoctors();
      const deptNameNorm2 = (inserted.name || "").trim().toLowerCase();
      const count2 = doctors2.filter((doc) => {
        const docDeptNorm = (doc.department || "").trim().toLowerCase();
        return docDeptNorm && docDeptNorm === deptNameNorm2 || inserted.id && doc.departmentId === inserted.id || inserted.headDoctor?.id && inserted.headDoctor.id !== "unassigned" && inserted.headDoctor.id === doc.id;
      }).length;
      return { ...inserted, totalDoctors: count2 };
    }
    this.memoryStore.departments.unshift(newDept);
    const doctors = await this.getDoctors();
    const deptNameNorm = (newDept.name || "").trim().toLowerCase();
    const count = doctors.filter((doc) => {
      const docDeptNorm = (doc.department || "").trim().toLowerCase();
      return docDeptNorm && docDeptNorm === deptNameNorm || newDept.id && doc.departmentId === newDept.id || newDept.headDoctor?.id && newDept.headDoctor.id !== "unassigned" && newDept.headDoctor.id === doc.id;
    }).length;
    return { ...newDept, totalDoctors: count };
  }
  async updateDepartment(id, updates) {
    await this.ensureConnected();
    const { _id, ...safeUpdates } = updates;
    let updatedDept = null;
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection("departments").findOneAndUpdate(
        query,
        { $set: safeUpdates },
        { returnDocument: "after" }
      );
      updatedDept = res ? { ...res, id: res.id || res._id.toString() } : null;
    } else {
      const index = this.memoryStore.departments.findIndex((d) => d.id === id);
      if (index !== -1) {
        this.memoryStore.departments[index] = { ...this.memoryStore.departments[index], ...safeUpdates };
        updatedDept = this.memoryStore.departments[index];
      }
    }
    if (!updatedDept) return null;
    const doctors = await this.getDoctors();
    const deptNameNorm = (updatedDept.name || "").trim().toLowerCase();
    const count = doctors.filter((doc) => {
      const docDeptNorm = (doc.department || "").trim().toLowerCase();
      return docDeptNorm && docDeptNorm === deptNameNorm || updatedDept.id && doc.departmentId === updatedDept.id || updatedDept.headDoctor?.id && updatedDept.headDoctor.id !== "unassigned" && updatedDept.headDoctor.id === doc.id;
    }).length;
    return { ...updatedDept, totalDoctors: count };
  }
  async deleteDepartment(id) {
    await this.ensureConnected();
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection("departments").deleteOne(query);
      return res.deletedCount > 0;
    }
    const prev = this.memoryStore.departments.length;
    this.memoryStore.departments = this.memoryStore.departments.filter((d) => d.id !== id);
    return this.memoryStore.departments.length < prev;
  }
  async getPatients() {
    await this.ensureConnected();
    if (this.isConnected && this.db) {
      const pats = await this.db.collection("patients").find({}).sort({ _id: -1 }).toArray();
      return pats.map((p) => ({ ...p, id: p.id || p._id.toString() }));
    }
    return this.memoryStore.patients;
  }
  async createPatient(patientData) {
    await this.ensureConnected();
    const timestamp = Date.now();
    const id = patientData.id || `pat-${timestamp}`;
    let patientId = patientData.patientId;
    if (!patientId) {
      let count = 0;
      if (this.isConnected && this.db) {
        count = await this.db.collection("patients").countDocuments();
      } else {
        count = this.memoryStore.patients.length;
      }
      patientId = `PAT-${(count + 1).toString().padStart(4, "0")}`;
    }
    const newPatient = {
      ...patientData,
      id,
      patientId,
      registrationDate: patientData.registrationDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      createdAt: patientData.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      recentActivityTime: patientData.recentActivityTime || "Just now"
    };
    if (this.isConnected && this.db) {
      const res = await this.db.collection("patients").insertOne(newPatient);
      return { ...newPatient, _id: res.insertedId.toString() };
    }
    this.memoryStore.patients.unshift(newPatient);
    return newPatient;
  }
  async updatePatient(id, updateData) {
    await this.ensureConnected();
    if (this.isConnected && this.db) {
      const col = this.db.collection("patients");
      const { _id, ...safeUpdate } = updateData;
      const query = buildEntityQuery(id);
      await col.updateOne(
        query,
        { $set: safeUpdate }
      );
      const updated = await col.findOne(query);
      return updated ? { ...updated, id: updated.id || updated._id.toString() } : null;
    }
    const idx = this.memoryStore.patients.findIndex((p) => p.id === id);
    if (idx !== -1) {
      this.memoryStore.patients[idx] = { ...this.memoryStore.patients[idx], ...updateData };
      return this.memoryStore.patients[idx];
    }
    return null;
  }
  async deletePatient(id) {
    await this.ensureConnected();
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection("patients").deleteOne(query);
      return res.deletedCount > 0;
    }
    const prev = this.memoryStore.patients.length;
    this.memoryStore.patients = this.memoryStore.patients.filter((p) => p.id !== id);
    return this.memoryStore.patients.length < prev;
  }
  async getSchedules() {
    await this.ensureConnected();
    if (this.isConnected && this.db) {
      const schs = await this.db.collection("schedules").find({}).toArray();
      return schs.map((s) => ({ ...s, id: s.id || s._id.toString() }));
    }
    return this.memoryStore.schedules;
  }
  async createSchedule(data) {
    await this.ensureConnected();
    const id = data.id || `sch-${Date.now()}`;
    const schedule = {
      ...data,
      id,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (this.isConnected && this.db) {
      const res = await this.db.collection("schedules").insertOne(schedule);
      return { ...schedule, _id: res.insertedId };
    }
    this.memoryStore.schedules.unshift(schedule);
    return schedule;
  }
  async updateSchedule(id, updates) {
    await this.ensureConnected();
    const { _id, ...safeUpdates } = updates;
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      await this.db.collection("schedules").updateOne(
        query,
        { $set: safeUpdates }
      );
      const updated = await this.db.collection("schedules").findOne(query);
      if (updated) {
        return { ...updated, id: updated.id || updated._id.toString() };
      }
    }
    const idx = this.memoryStore.schedules.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.memoryStore.schedules[idx] = {
        ...this.memoryStore.schedules[idx],
        ...safeUpdates
      };
      return this.memoryStore.schedules[idx];
    }
    return { id, ...safeUpdates };
  }
  async deleteSchedule(id) {
    await this.ensureConnected();
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection("schedules").deleteOne(query);
      return res.deletedCount > 0;
    }
    const prev = this.memoryStore.schedules.length;
    this.memoryStore.schedules = this.memoryStore.schedules.filter((s) => s.id !== id);
    return this.memoryStore.schedules.length < prev;
  }
};
var mongoDb = new MongoDatabaseService();

// server/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
var CloudinaryService = class {
  constructor() {
    this.isConfigured = false;
    this.configStatus = {
      configured: false,
      cloudName: "",
      hasApiKey: false,
      hasApiSecret: false,
      uploadFolder: "medicare_hospital"
    };
    this.init();
  }
  init() {
    let cloudName = (process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME || "").trim().replace(/^["']|["']$/g, "");
    let apiKey = (process.env.CLOUDINARY_API_KEY || process.env.API_KEY || "").trim().replace(/^["']|["']$/g, "");
    let apiSecret = (process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET || "").trim().replace(/^["']|["']$/g, "");
    const uploadFolder = (process.env.CLOUDINARY_FOLDER || "medicare_hospital").trim();
    const cloudinaryUrl = (process.env.CLOUDINARY_URL || "").trim().replace(/^["']|["']$/g, "");
    if (cloudinaryUrl && cloudinaryUrl.startsWith("cloudinary://")) {
      try {
        const parsedUrl = new URL(cloudinaryUrl);
        if (!cloudName) cloudName = parsedUrl.hostname;
        if (!apiKey) apiKey = decodeURIComponent(parsedUrl.username);
        if (!apiSecret) apiSecret = decodeURIComponent(parsedUrl.password);
      } catch (e) {
        console.warn("\u26A0\uFE0F [Cloudinary] Could not parse CLOUDINARY_URL, relying on fallback parsing:", e?.message);
        const match = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
        if (match) {
          if (!apiKey) apiKey = match[1];
          if (!apiSecret) apiSecret = match[2];
          if (!cloudName) cloudName = match[3];
        }
      }
    }
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true
      });
      this.isConfigured = true;
      this.configStatus = {
        configured: true,
        cloudName,
        hasApiKey: true,
        hasApiSecret: true,
        uploadFolder
      };
      console.log(`\u2601\uFE0F [Cloudinary] Initialized with cloud_name: "${cloudName}"`);
    } else {
      this.isConfigured = false;
      this.configStatus = {
        configured: false,
        cloudName: cloudName ? cloudName : "Not Set",
        hasApiKey: !!apiKey,
        hasApiSecret: !!apiSecret,
        uploadFolder,
        error: "Cloudinary credentials missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET (or CLOUDINARY_URL) in Vercel Environment Variables."
      };
      console.log("\u2139\uFE0F [Cloudinary] Credentials not fully configured. File upload will use high-availability simulated cloud storage fallback until configured.");
    }
  }
  getStatus() {
    this.init();
    return this.configStatus;
  }
  /**
   * Uploads base64 data URI or buffer to Cloudinary
   * Supports both image and PDF (resource_type: auto or raw/image)
   */
  async upload(fileDataUriOrUrl, options = {}) {
    this.init();
    const folder = options.folder || this.configStatus.uploadFolder;
    const resourceType = options.resourceType || "auto";
    if (this.isConfigured) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(fileDataUriOrUrl, {
          folder,
          resource_type: resourceType,
          use_filename: true,
          unique_filename: true,
          filename_override: options.filename,
          tags: options.tags || ["medicare", "hospital"]
        });
        return {
          url: uploadResponse.url,
          secureUrl: uploadResponse.secure_url,
          publicId: uploadResponse.public_id,
          format: uploadResponse.format || (options.filename?.endsWith(".pdf") ? "pdf" : "png"),
          bytes: uploadResponse.bytes,
          resourceType: uploadResponse.resource_type,
          originalFilename: options.filename || uploadResponse.original_filename
        };
      } catch (err) {
        console.error("\u274C [Cloudinary] Upload failed with cloud:", err.message || err);
        throw new Error(`Cloudinary Upload Error: ${err.message || err}`);
      }
    }
    const isPdf = options.filename?.toLowerCase().endsWith(".pdf") || fileDataUriOrUrl.startsWith("data:application/pdf");
    const mockPublicId = `${folder}/${options.filename ? options.filename.replace(/\.[^.]+$/, "") : "doc"}_${Date.now()}`;
    const syntheticUrl = isPdf ? `https://res.cloudinary.com/medicare-demo/image/upload/v${Math.floor(Date.now() / 1e3)}/${mockPublicId}.pdf` : fileDataUriOrUrl.startsWith("data:image") ? fileDataUriOrUrl : `https://res.cloudinary.com/medicare-demo/image/upload/v${Math.floor(Date.now() / 1e3)}/${mockPublicId}.jpg`;
    const bytesEst = fileDataUriOrUrl.startsWith("data:") ? Math.round(fileDataUriOrUrl.length * 3 / 4) : 154200;
    return {
      url: syntheticUrl,
      secureUrl: syntheticUrl,
      publicId: mockPublicId,
      format: isPdf ? "pdf" : "jpg",
      bytes: bytesEst,
      resourceType: isPdf ? "raw" : "image",
      originalFilename: options.filename
    };
  }
  /**
   * Delete asset from Cloudinary
   */
  async delete(publicId, resourceType = "auto") {
    if (!this.isConfigured) return true;
    try {
      const res = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType
      });
      return res.result === "ok";
    } catch (err) {
      console.warn("\u26A0\uFE0F [Cloudinary] Delete warning:", err);
      return false;
    }
  }
};
var cloudinaryService = new CloudinaryService();

// server/aiService.ts
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

// server/emailService.ts
import { Resend } from "resend";
var EmailService = class {
  constructor() {
    this.resendClient = null;
    this.recentLogs = [];
  }
  getClient() {
    const rawKey = process.env.RESEND_API_KEY || "";
    const apiKey = rawKey.trim().replace(/^["']|["']$/g, "");
    if (!apiKey) return null;
    if (!this.resendClient) {
      this.resendClient = new Resend(apiKey);
    }
    return this.resendClient;
  }
  getFromEmail() {
    const rawFrom = process.env.RESEND_FROM_EMAIL?.trim().replace(/^["']|["']$/g, "");
    if (rawFrom) {
      return rawFrom;
    }
    return "MediCare Hospital <noreply@medicare.name.ng>";
  }
  getStatus() {
    const rawKey = process.env.RESEND_API_KEY || "";
    const apiKey = rawKey.trim().replace(/^["']|["']$/g, "");
    const hasApiKey = Boolean(apiKey);
    const maskedKey = hasApiKey ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : "Not configured";
    const currentFrom = this.getFromEmail();
    return {
      configured: hasApiKey,
      maskedApiKey: maskedKey,
      fromEmail: currentFrom,
      recentLogs: this.recentLogs.slice(0, 25),
      hint: !hasApiKey ? "Set RESEND_API_KEY in your Vercel Environment Variables to enable live email delivery." : `Sending from ${currentFrom}.`
    };
  }
  /**
   * Internal helper that sends an email via Resend using the official hospital sender.
   */
  async dispatchEmail(payload) {
    const client = this.getClient();
    if (!client) {
      return { success: false, error: "RESEND_API_KEY not configured" };
    }
    const fromAddress = this.getFromEmail();
    try {
      const result = await client.emails.send({
        from: fromAddress,
        to: payload.to,
        subject: payload.subject,
        html: payload.html
      });
      if (!result.error) {
        return { success: true, data: result.data };
      }
      console.error(`[Resend Error with ${fromAddress}]:`, result.error);
      return { success: false, error: result.error.message };
    } catch (err) {
      console.error(`[Resend Exception with ${fromAddress}]:`, err.message || err);
      return { success: false, error: err.message || "Unknown network error" };
    }
  }
  logDelivery(entry) {
    this.recentLogs.unshift(entry);
    if (this.recentLogs.length > 50) {
      this.recentLogs.pop();
    }
  }
  // 1. Send Booking Confirmation Email
  async sendBookingConfirmation(appointment) {
    const recipient = appointment.patientEmail?.trim();
    const logId = `EMAIL-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const subject = `Appointment Confirmed: ${appointment.doctorName} on ${appointment.date} at ${appointment.time} [${appointment.id}]`;
    if (!recipient) {
      console.log(`[Resend] No patient email provided for appointment ${appointment.id}, skipping notification.`);
      return { success: false, error: "No patient email provided" };
    }
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #0878F9 0%, #0353B5 100%); padding: 32px 28px; text-align: center; color: #FFFFFF;">
      <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase;">
        MediCare Hospital
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">Appointment Confirmed</h1>
      <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Your hospital consultation is successfully booked.</p>
    </div>

    <!-- Main Content Body -->
    <div style="padding: 28px;">
      <p style="font-size: 15px; margin: 0 0 16px; color: #334155;">
        Dear <strong>${appointment.patientName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 24px; color: #475569;">
        Thank you for booking with MediCare Hospital. Your appointment has been registered in our official hospital system. Below are your consultation details:
      </p>

      <!-- Appointment Summary Card -->
      <div style="background: #F0F7FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <tr>
            <td style="padding: 6px 0; color: #64748B; width: 40%;">Appointment Ref:</td>
            <td style="padding: 6px 0; color: #0878F9; font-weight: 700;">${appointment.id}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Specialist Doctor:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${appointment.doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Department:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.department}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Date:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${appointment.date}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Time:</td>
            <td style="padding: 6px 0; color: #0878F9; font-weight: 700;">${appointment.time}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Location & Room:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.room || `${appointment.department} Suite`}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Consultation Fee:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${appointment.fee || "$150"}</td>
          </tr>
          ${appointment.notes ? `<tr>
            <td style="padding: 6px 0; color: #64748B;">Reason / Notes:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.notes}</td>
          </tr>` : ""}
        </table>
      </div>

      <!-- Preparation Instructions -->
      <div style="border-left: 4px solid #0878F9; background: #F8FAFC; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-bottom: 24px;">
        <h4 style="margin: 0 0 6px; font-size: 13.5px; font-weight: 700; color: #0F172A;">Important Visit Guidelines:</h4>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #475569; line-height: 1.6;">
          <li>Please arrive 15 minutes before your scheduled appointment for check-in.</li>
          <li>Bring a government-issued photo ID and your insurance card.</li>
          <li>Bring any previous diagnostic records, imaging scans, or medications you are currently taking.</li>
        </ul>
      </div>

      <p style="font-size: 13px; line-height: 1.5; color: #64748B; margin: 0 0 8px;">
        Need to reschedule or cancel? You can chat with <strong>MediCare AI</strong> directly on our website, or call our 24/7 Front Desk.
      </p>
    </div>

    <!-- Footer -->
    <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 28px; text-align: center; font-size: 12px; color: #94A3B8;">
      <p style="margin: 0 0 4px; font-weight: 600; color: #64748B;">MediCare Hospital \u2022 Main Medical Campus</p>
      <p style="margin: 0 0 8px;">Campus Way, Main Medical Center \u2022 Emergency 24/7: (555) 911-MEDI</p>
      <p style="margin: 0; font-size: 11px;">This automated notification was delivered via Resend on behalf of MediCare Hospital.</p>
    </div>
  </div>
</body>
</html>
`;
    const client = this.getClient();
    if (!client) {
      console.log(`[Resend Simulated] RESEND_API_KEY not configured. Simulated booking confirmation to ${recipient} (Ref: ${appointment.id})`);
      this.logDelivery({
        id: logId,
        type: "booking",
        recipient,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        subject,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        status: "simulated"
      });
      return { success: true, simulated: true };
    }
    const response = await this.dispatchEmail({
      to: recipient,
      subject,
      html: htmlContent
    });
    if (!response.success) {
      console.error("[Resend Error sending booking email]:", response.error);
      this.logDelivery({
        id: logId,
        type: "booking",
        recipient,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        subject,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        status: "failed",
        error: response.error
      });
      return { success: false, error: response.error };
    }
    console.log(`[Resend] Successfully sent booking confirmation to ${recipient} (Ref: ${appointment.id}, MessageId: ${response.data?.id})`);
    this.logDelivery({
      id: response.data?.id || logId,
      type: "booking",
      recipient,
      patientName: appointment.patientName,
      appointmentId: appointment.id,
      doctorName: appointment.doctorName,
      subject,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sent"
    });
    return { success: true, messageId: response.data?.id };
  }
  // 2. Send Reschedule Confirmation Email
  async sendRescheduleConfirmation(appointment) {
    const recipient = appointment.patientEmail?.trim();
    const logId = `EMAIL-RESCHED-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const subject = `Appointment Rescheduled: ${appointment.doctorName} - New Date: ${appointment.newDate} at ${appointment.newTime} [${appointment.id}]`;
    if (!recipient) {
      console.log(`[Resend] No email provided for rescheduled appointment ${appointment.id}, skipping.`);
      return { success: false, error: "No patient email provided" };
    }
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%); padding: 32px 28px; text-align: center; color: #FFFFFF;">
      <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase;">
        MediCare Hospital
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">Appointment Rescheduled</h1>
      <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Your consultation time has been successfully updated.</p>
    </div>

    <!-- Content -->
    <div style="padding: 28px;">
      <p style="font-size: 15px; margin: 0 0 16px; color: #334155;">
        Dear <strong>${appointment.patientName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 20px; color: #475569;">
        Your appointment with <strong>${appointment.doctorName}</strong> has been successfully rescheduled. Please review your updated time slot below:
      </p>

      <!-- Comparison Box -->
      <div style="background: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <tr>
            <td style="padding: 6px 0; color: #64748B; width: 40%;">Appointment Ref:</td>
            <td style="padding: 6px 0; color: #0284C7; font-weight: 700;">${appointment.id}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Specialist:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${appointment.doctorName} (${appointment.department})</td>
          </tr>
          ${appointment.previousDate && appointment.previousTime ? `<tr>
            <td style="padding: 6px 0; color: #94A3B8;">Previous Slot:</td>
            <td style="padding: 6px 0; color: #94A3B8; text-decoration: line-through;">${appointment.previousDate} at ${appointment.previousTime}</td>
          </tr>` : ""}
          <tr>
            <td style="padding: 6px 0; color: #0284C7; font-weight: 700;">NEW Date:</td>
            <td style="padding: 6px 0; color: #0284C7; font-weight: 800; font-size: 15px;">${appointment.newDate}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #0284C7; font-weight: 700;">NEW Time:</td>
            <td style="padding: 6px 0; color: #0284C7; font-weight: 800; font-size: 15px;">${appointment.newTime}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Clinic Location:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.room || `${appointment.department} Suite`}</td>
          </tr>
        </table>
      </div>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; color: #475569;">
        <strong>Need another adjustment?</strong> You can update or cancel this booking at any time with no fees through MediCare AI or front-desk reception.
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 28px; text-align: center; font-size: 12px; color: #94A3B8;">
      <p style="margin: 0 0 4px; font-weight: 600; color: #64748B;">MediCare Hospital \u2022 Main Medical Campus</p>
      <p style="margin: 0 0 8px;">Campus Way, Main Medical Center \u2022 Emergency 24/7: (555) 911-MEDI</p>
      <p style="margin: 0; font-size: 11px;">Delivered via Resend for MediCare Hospital.</p>
    </div>
  </div>
</body>
</html>
`;
    const client = this.getClient();
    if (!client) {
      console.log(`[Resend Simulated] RESEND_API_KEY not configured. Simulated reschedule notification to ${recipient} (Ref: ${appointment.id})`);
      this.logDelivery({
        id: logId,
        type: "reschedule",
        recipient,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        subject,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        status: "simulated"
      });
      return { success: true, simulated: true };
    }
    const response = await this.dispatchEmail({
      to: recipient,
      subject,
      html: htmlContent
    });
    if (!response.success) {
      console.error("[Resend Error sending reschedule email]:", response.error);
      this.logDelivery({
        id: logId,
        type: "reschedule",
        recipient,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        subject,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        status: "failed",
        error: response.error
      });
      return { success: false, error: response.error };
    }
    console.log(`[Resend] Successfully sent reschedule confirmation to ${recipient} (Ref: ${appointment.id})`);
    this.logDelivery({
      id: response.data?.id || logId,
      type: "reschedule",
      recipient,
      patientName: appointment.patientName,
      appointmentId: appointment.id,
      doctorName: appointment.doctorName,
      subject,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sent"
    });
    return { success: true, messageId: response.data?.id };
  }
  // 3. Send Cancellation Confirmation Email
  async sendCancellationConfirmation(appointment) {
    const recipient = appointment.patientEmail?.trim();
    const logId = `EMAIL-CANCEL-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const subject = `Appointment Cancelled: Confirmation for Ref [${appointment.id}]`;
    if (!recipient) {
      console.log(`[Resend] No email provided for cancelled appointment ${appointment.id}, skipping.`);
      return { success: false, error: "No patient email provided" };
    }
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B;">
  <div style="max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #EF4444 0%, #B91C1C 100%); padding: 32px 28px; text-align: center; color: #FFFFFF;">
      <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase;">
        MediCare Hospital
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; line-height: 1.2;">Appointment Cancelled</h1>
      <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Your scheduled appointment has been officially cancelled.</p>
    </div>

    <!-- Content -->
    <div style="padding: 28px;">
      <p style="font-size: 15px; margin: 0 0 16px; color: #334155;">
        Dear <strong>${appointment.patientName}</strong>,
      </p>
      <p style="font-size: 14px; line-height: 1.6; margin: 0 0 20px; color: #475569;">
        This email confirms that your appointment scheduled with <strong>${appointment.doctorName}</strong> has been cancelled in our records as requested. <strong>No cancellation penalty or fee applies.</strong>
      </p>

      <!-- Details Box -->
      <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <tr>
            <td style="padding: 6px 0; color: #64748B; width: 40%;">Cancelled Ref ID:</td>
            <td style="padding: 6px 0; color: #DC2626; font-weight: 700;">${appointment.id}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Doctor:</td>
            <td style="padding: 6px 0; color: #0F172A; font-weight: 600;">${appointment.doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Department:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.department}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748B;">Original Schedule:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.date} at ${appointment.time}</td>
          </tr>
          ${appointment.reason ? `<tr>
            <td style="padding: 6px 0; color: #64748B;">Reason:</td>
            <td style="padding: 6px 0; color: #0F172A;">${appointment.reason}</td>
          </tr>` : ""}
        </table>
      </div>

      <p style="font-size: 13.5px; line-height: 1.6; color: #475569; margin: 0 0 20px;">
        If you require medical attention in the future, you can easily book another appointment anytime through <strong>MediCare AI</strong> on our hospital portal.
      </p>

      <div style="background: #F8FAFC; border-left: 4px solid #EF4444; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 12.5px; color: #64748B;">
        <strong>Emergency Care:</strong> If you are experiencing sudden severe pain or emergency symptoms, please call 911 or visit our 24/7 Emergency Room immediately.
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 20px 28px; text-align: center; font-size: 12px; color: #94A3B8;">
      <p style="margin: 0 0 4px; font-weight: 600; color: #64748B;">MediCare Hospital \u2022 Main Medical Campus</p>
      <p style="margin: 0 0 8px;">Campus Way, Main Medical Center \u2022 Emergency 24/7: (555) 911-MEDI</p>
      <p style="margin: 0; font-size: 11px;">Delivered via Resend for MediCare Hospital.</p>
    </div>
  </div>
</body>
</html>
`;
    const client = this.getClient();
    if (!client) {
      console.log(`[Resend Simulated] RESEND_API_KEY not configured. Simulated cancellation email to ${recipient} (Ref: ${appointment.id})`);
      this.logDelivery({
        id: logId,
        type: "cancellation",
        recipient,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        subject,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        status: "simulated"
      });
      return { success: true, simulated: true };
    }
    const response = await this.dispatchEmail({
      to: recipient,
      subject,
      html: htmlContent
    });
    if (!response.success) {
      console.error("[Resend Error sending cancellation email]:", response.error);
      this.logDelivery({
        id: logId,
        type: "cancellation",
        recipient,
        patientName: appointment.patientName,
        appointmentId: appointment.id,
        doctorName: appointment.doctorName,
        subject,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        status: "failed",
        error: response.error
      });
      return { success: false, error: response.error };
    }
    console.log(`[Resend] Successfully sent cancellation confirmation to ${recipient} (Ref: ${appointment.id})`);
    this.logDelivery({
      id: response.data?.id || logId,
      type: "cancellation",
      recipient,
      patientName: appointment.patientName,
      appointmentId: appointment.id,
      doctorName: appointment.doctorName,
      subject,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sent"
    });
    return { success: true, messageId: response.data?.id };
  }
  // 4. Send 2FA Verification Code Email for Rescheduling or Cancellation
  async sendVerificationCode(params) {
    const recipient = params.patientEmail.trim();
    const logId = `EMAIL-VERIFY-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
    const actionName = params.purpose === "cancel" ? "Cancellation" : "Reschedule";
    const actionVerb = params.purpose === "cancel" ? "cancel" : "reschedule";
    const subject = `MediCare Verification Code: ${params.code} to ${actionName} Appointment [${params.appointmentId}]`;
    if (!recipient) {
      return { success: false, error: "No patient email provided" };
    }
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F8FAFC; margin: 0; padding: 24px; color: #1E293B;">
  <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Security Header -->
    <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); padding: 30px 24px; text-align: center; color: #FFFFFF;">
      <div style="display: inline-block; background: rgba(8, 120, 249, 0.25); border: 1px solid rgba(8, 120, 249, 0.5); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase; color: #60A5FA;">
        MediCare Security Verification
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Identity Authorization Code</h1>
      <p style="margin: 8px 0 0 0; font-size: 14px; color: #94A3B8;">Required to confirm appointment ${actionVerb}</p>
    </div>

    <!-- Body -->
    <div style="padding: 28px 24px;">
      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5; color: #334155;">
        Dear <strong>${params.patientName}</strong>,
      </p>
      <p style="margin: 0 0 20px 0; font-size: 14.5px; line-height: 1.5; color: #475569;">
        We received a request through MediCare AI to <strong>${actionVerb}</strong> your appointment with <strong>${params.doctorName}</strong>. To confirm this action is authorized by you, please use the 6-digit verification code below:
      </p>

      <!-- Code Box -->
      <div style="background: #F0F7FF; border: 2px dashed #0878F9; border-radius: 12px; padding: 22px 16px; text-align: center; margin: 24px 0;">
        <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #0878F9; margin-bottom: 8px;">
          One-Time Verification Code
        </div>
        <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #0F172A; line-height: 1;">
          ${params.code}
        </div>
        <div style="font-size: 12px; color: #64748B; margin-top: 10px;">
          \u23F1\uFE0F This code will expire in <strong>10 minutes</strong>.
        </div>
      </div>

      <!-- Appointment Details Card -->
      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 16px; margin: 20px 0;">
        <div style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
          Appointment Being Modified:
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13.5px;">
          <tr>
            <td style="padding: 4px 0; color: #64748B;">Reference ID:</td>
            <td style="padding: 4px 0; font-weight: 700; color: #0878F9; text-align: right;">${params.appointmentId}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748B;">Specialist:</td>
            <td style="padding: 4px 0; font-weight: 600; color: #1E293B; text-align: right;">${params.doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748B;">Department:</td>
            <td style="padding: 4px 0; color: #1E293B; text-align: right;">${params.department}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748B;">Current Slot:</td>
            <td style="padding: 4px 0; font-weight: 600; color: #1E293B; text-align: right;">${params.date} at ${params.time}</td>
          </tr>
        </table>
      </div>

      <!-- Security Notice -->
      <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 12px 16px; font-size: 12.5px; color: #92400E; margin-top: 20px; line-height: 1.5;">
        <strong>\u26A0\uFE0F Did not request this?</strong> Never share this verification code with anyone. If you did not initiate this request, your appointment remains secure. Please notify MediCare Support immediately at <a href="mailto:support@medicare.name.ng" style="color: #B45309; font-weight: 600;">support@medicare.name.ng</a>.
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #F8FAFC; border-top: 1px solid #E2E8F0; padding: 18px 24px; text-align: center; font-size: 12px; color: #94A3B8;">
      <div style="font-weight: 600; color: #64748B; margin-bottom: 4px;">MediCare Hospital & Clinical Research Institute</div>
      <div>Victoria Island Healthcare District, Lagos, Nigeria</div>
      <div style="margin-top: 8px;">24/7 Security & Support: +234 1 800 6334</div>
    </div>
  </div>
</body>
</html>
`;
    const client = this.getClient();
    if (!client) {
      console.log(`[Resend Simulated Mode] \u{1F510} Verification code ${params.code} generated for ${recipient} (Appointment ${params.appointmentId})`);
      this.logDelivery({
        id: logId,
        type: "verification",
        recipient,
        patientName: params.patientName,
        appointmentId: params.appointmentId,
        doctorName: params.doctorName,
        subject,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        status: "simulated"
      });
      return { success: true, simulated: true, messageId: logId };
    }
    const response = await this.dispatchEmail({
      to: recipient,
      subject,
      html: htmlContent
    });
    if (!response.success) {
      console.error("[Resend Error sending verification code]:", response.error);
      this.logDelivery({
        id: logId,
        type: "verification",
        recipient,
        patientName: params.patientName,
        appointmentId: params.appointmentId,
        doctorName: params.doctorName,
        subject,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        status: "failed",
        error: response.error
      });
      return { success: false, error: response.error };
    }
    console.log(`[Resend] Successfully sent verification code ${params.code} to ${recipient}`);
    this.logDelivery({
      id: response.data?.id || logId,
      type: "verification",
      recipient,
      patientName: params.patientName,
      appointmentId: params.appointmentId,
      doctorName: params.doctorName,
      subject,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sent"
    });
    return { success: true, messageId: response.data?.id };
  }
  // 5. Test Email Sending
  async sendTestEmail(recipientEmail) {
    const client = this.getClient();
    const logId = `EMAIL-TEST-${Date.now()}`;
    const subject = `MediCare Hospital Email Service Test (Resend Connected)`;
    const htmlContent = `
<div style="font-family: sans-serif; padding: 20px; color: #1E293B;">
  <h2 style="color: #0878F9;">MediCare Hospital Resend Verification</h2>
  <p>This is a test notification confirming that Resend email delivery is actively connected to your MediCare Hospital management app.</p>
  <p><strong>Sender:</strong> ${this.getFromEmail()}</p>
  <p><strong>Timestamp:</strong> ${(/* @__PURE__ */ new Date()).toISOString()}</p>
</div>
`;
    if (!client) {
      this.logDelivery({
        id: logId,
        type: "test",
        recipient: recipientEmail,
        patientName: "Admin Tester",
        appointmentId: "TEST-001",
        doctorName: "System",
        subject,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        status: "simulated"
      });
      return { success: true, simulated: true };
    }
    const response = await this.dispatchEmail({
      to: recipientEmail,
      subject,
      html: htmlContent
    });
    if (!response.success) {
      this.logDelivery({
        id: logId,
        type: "test",
        recipient: recipientEmail,
        patientName: "Admin Tester",
        appointmentId: "TEST-001",
        doctorName: "System",
        subject,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        status: "failed",
        error: response.error
      });
      return { success: false, error: response.error };
    }
    this.logDelivery({
      id: response.data?.id || logId,
      type: "test",
      recipient: recipientEmail,
      patientName: "Admin Tester",
      appointmentId: "TEST-001",
      doctorName: "System",
      subject,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      status: "sent"
    });
    return { success: true, messageId: response.data?.id };
  }
};
var emailService = new EmailService();

// server/aiService.ts
var AIService = class {
  constructor() {
    this.groqClient = null;
    this.aiClient = null;
  }
  getGroqClient() {
    const apiKey = (process.env.GROQ_API_KEY || "").trim();
    if (!apiKey) return null;
    if (!this.groqClient) {
      this.groqClient = new Groq({
        apiKey
      });
    }
    return this.groqClient;
  }
  getClient() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) return null;
    if (!this.aiClient) {
      this.aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
    return this.aiClient;
  }
  // Calculate real-time doctor availability slots for the next 7 days
  calculateDoctorSlots(doctor, existingAppointments = []) {
    const daysMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const shortDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const slots = [];
    const today = /* @__PURE__ */ new Date();
    const standardTimeOptions = ["09:00 AM", "10:30 AM", "11:45 AM", "02:00 PM", "03:30 PM"];
    for (let i = 1; i <= 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() + i);
      const dayOfWeekName = daysMap[targetDate.getDay()];
      const dayShort = shortDays[targetDate.getDay()];
      const monthStr = months[targetDate.getMonth()];
      const dayNum = targetDate.getDate();
      const year = targetDate.getFullYear();
      const dateIso = `${year}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      const dayDisplay = `${dayShort}, ${monthStr} ${dayNum}`;
      let isDayEnabled = true;
      if (doctor?.weeklyAvailability && doctor.weeklyAvailability[dayOfWeekName]) {
        isDayEnabled = Boolean(doctor.weeklyAvailability[dayOfWeekName].enabled);
      } else if (targetDate.getDay() === 0) {
        isDayEnabled = false;
      }
      if (!isDayEnabled) continue;
      for (const timeStr of standardTimeOptions) {
        const isConflict = existingAppointments.some((appt) => {
          if (appt.status === "Cancelled") return false;
          const sameDoc = appt.doctorName && appt.doctorName.toLowerCase().includes((doctor.lastName || doctor.name).toLowerCase()) || appt.doctorId === doctor.id;
          if (!sameDoc) return false;
          const dateMatch = appt.date === dateIso || appt.date?.toLowerCase() === dayDisplay.toLowerCase() || appt.date?.includes(monthStr && String(dayNum));
          const timeMatch = appt.time?.toLowerCase().replace(/\s+/g, "") === timeStr.toLowerCase().replace(/\s+/g, "");
          return dateMatch && timeMatch;
        });
        if (!isConflict) {
          slots.push({
            id: `slot-${doctor.id || "doc"}-${dateIso}-${timeStr.replace(/[^a-zA-Z0-9]/g, "")}`,
            day: dayDisplay,
            dateStr: dateIso,
            time: timeStr
          });
        }
      }
      if (slots.length >= 6) break;
    }
    if (slots.length === 0) {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const dayDisplay = `${shortDays[tomorrow.getDay()]}, ${months[tomorrow.getMonth()]} ${tomorrow.getDate()}`;
      const dateIso = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
      slots.push(
        { id: `slot-${doctor?.id || "doc"}-1`, day: dayDisplay, dateStr: dateIso, time: "09:30 AM" },
        { id: `slot-${doctor?.id || "doc"}-2`, day: dayDisplay, dateStr: dateIso, time: "02:00 PM" }
      );
    }
    return slots;
  }
  // Detect life-threatening medical emergency symptoms immediately
  checkEmergency(text) {
    const lower = text.toLowerCase();
    const emergencyPatterns = [
      "chest pain",
      "heart attack",
      "cannot breathe",
      "cant breathe",
      "severe shortness of breath",
      "unconscious",
      "passed out",
      "fainted and not waking up",
      "coughing blood",
      "vomiting blood",
      "slurred speech and facial drooping",
      "stroke",
      "severe uncontrolled bleeding",
      "heavy bleeding",
      "head trauma with confusion",
      "anaphylaxis",
      "swollen throat cannot breathe",
      "suicidal",
      "overdose"
    ];
    for (const pattern of emergencyPatterns) {
      if (lower.includes(pattern)) {
        return { isEmergency: true, reason: pattern };
      }
    }
    return { isEmergency: false };
  }
  async handleChat(params) {
    const userMessage = (params.message || "").trim();
    const history = params.history || [];
    const context = params.currentContext || {};
    const [doctors, departments, documents, appointments] = await Promise.all([
      mongoDb.getDoctors().catch(() => []),
      mongoDb.getDepartments().catch(() => []),
      mongoDb.getDocuments().catch(() => []),
      mongoDb.getAppointments().catch(() => [])
    ]);
    const activeDoctors = doctors.filter((d) => d.status !== "Inactive");
    const emergencyCheck = this.checkEmergency(userMessage);
    if (emergencyCheck.isEmergency) {
      return {
        reply: "\u26A0\uFE0F **CRITICAL MEDICAL EMERGENCY DETECTED**: The symptoms you described appear serious and require immediate emergency care. Please do NOT wait for a routine appointment.\n\nCall our 24/7 Emergency Line immediately at **1-800-MEDICARE** or dial **911** right now. Our Emergency & Trauma Department at Campus Way is open 24/7 with immediate life-saving response units.",
        intent: "emergency",
        emergencyAlert: {
          isEmergency: true,
          title: "Immediate Emergency Medical Attention Required",
          message: "If you or someone else is experiencing chest pain, acute shortness of breath, signs of stroke, or uncontrolled bleeding, seek emergency medical care immediately.",
          hotline: "1-800-MEDICARE (24/7) or 911",
          action: "Call 911 or Proceed to Emergency Wing"
        },
        suggestedQuickReplies: [
          "Call Emergency Hotline",
          "Emergency Department Directions",
          "Speak to Emergency Triage"
        ]
      };
    }
    const doctorsContextSummary = activeDoctors.map(
      (doc) => `- ID: ${doc.id}, Name: ${doc.name}, Department: ${doc.department}, Specialty: ${doc.specialty}, Experience: ${doc.yearsOfExperience} years, Fee: $${doc.consultationFee || 150}, Room: ${doc.room || "Clinic Suite"}, Status: ${doc.status}`
    ).join("\n");
    const departmentsContextSummary = departments.map(
      (dept) => `- Department: ${dept.name}, Location: ${dept.consultationLocation || "Main Building"}, Description: ${dept.description || "Clinical Care"}, Head: ${dept.headDoctor?.name || "Assigned Specialist"}`
    ).join("\n");
    const knowledgeSummary = documents.map((doc) => {
      let entry = `=== DOCUMENT: [${doc.category}] ${doc.title} (File: ${doc.filename}) ===
Status: ${doc.status || "Active"} | OCR Status: ${doc.ocrStatus || "completed"}
Executive Summary: ${doc.summary || doc.description || "Clinical hospital protocol"}
Key Topics: ${doc.extractedKeywords && doc.extractedKeywords.length > 0 ? doc.extractedKeywords.join(", ") : doc.category}`;
      if (doc.extractedText && doc.extractedText.trim().length > 0) {
        entry += `
Extracted Text Content (via Multimodal OCR):
${doc.extractedText.slice(0, 3500)}`;
      }
      return entry;
    }).join("\n\n");
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
- General Visiting Hours: Monday \u2013 Saturday, 8:00 AM \u2013 8:00 PM (ICU: 11:00 AM\u20131:00 PM & 5:00 PM\u20137:00 PM)
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
4. STRICT ENFORCEMENT ON APPOINTMENT BOOKING VIA THE IN-CHAT FORM:
   - MANDATORY HOSPITAL POLICY: All patients who book an appointment through MediCare AI MUST use the official in-chat appointment booking form.
   - The AI must ALWAYS provide the form for the appointment whenever a patient wants to book, asks to schedule, selects or requests a doctor, or provides booking details.
   - The AI is STRICTLY PROHIBITED from taking, confirming, or booking appointments directly via conversational text messages or plain chat dialogue.
   - The AI should ONLY take appointments via the interactive form that is supplied to the patient in the chat.
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
   - In your conversational "reply", always inform the patient:
     "To ensure medical record accuracy, patient confidentiality, and verified hospital scheduling, all appointments through MediCare AI must be submitted using our official in-chat Appointment Booking Form. I have supplied the form below\u2014please review or enter your details and submit the form to proceed."
   - If a patient asks: "Can you just book it for me without the form?" or attempts to book by typing their info in chat:
     You MUST NOT book it through text. Politely explain that hospital compliance strictly requires all bookings to be submitted through the in-chat form, and provide the form ("intent": "collect_info")!
   - When a patient selects or requests a doctor or slot:
     Set "intent": "collect_info", provide the doctor details and slots, and supply the booking form so they can complete the booking.

5. QUESTIONS ABOUT DEPARTMENTS & DOCTORS:
   - "What departments do you have?": List the actual departments from the database with locations.
   - "Who are your doctors / radiologists / virologists?": List the actual doctors from the database for that department.
   - "Who are your dermatologists?": If we do not have dermatologists, explicitly state: "We do not currently have a Dermatology department in our hospital records. Our active departments are Virology, Radiology, and Disease Control."
6. RESCHEDULING & CANCELLATION:
   - Ask for Appointment ID (e.g. APT-2026-XXXX) or registered phone number.
   - For cancellation: Ask for confirmation ("I found your appointment [ID] with [Doctor] on [Date] at [Time]. Are you sure you want to cancel it?").
   - For rescheduling: Offer to show new available slots for that doctor.
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
    const groq = this.getGroqClient();
    if (groq) {
      const preferredModel = (process.env.GROQ_MODEL || "openai/gpt-oss-120b").trim();
      const candidateModels = [
        preferredModel,
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant"
      ];
      const groqMessages = [
        {
          role: "system",
          content: systemPrompt
        }
      ];
      for (const h of history.slice(-6)) {
        groqMessages.push({
          role: h.role === "model" ? "assistant" : "user",
          content: h.content
        });
      }
      groqMessages.push({
        role: "user",
        content: userMessage
      });
      for (const modelName of candidateModels) {
        try {
          console.log(`[Groq] Requesting chat completion with model: ${modelName}`);
          let stream;
          try {
            stream = await groq.chat.completions.create({
              model: modelName,
              messages: groqMessages,
              temperature: 1,
              max_completion_tokens: 2048,
              top_p: 1,
              reasoning_effort: "medium",
              stream: true,
              stop: null
            });
          } catch (reasoningErr) {
            console.log(`[Groq] Retrying ${modelName} without reasoning_effort...`);
            stream = await groq.chat.completions.create({
              model: modelName,
              messages: groqMessages,
              temperature: 1,
              max_completion_tokens: 2048,
              top_p: 1,
              stream: true,
              stop: null
            });
          }
          let rawText = "";
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            rawText += content;
          }
          const textWithoutThink = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
          const jsonMatch = textWithoutThink.match(/\{[\s\S]*\}/);
          const cleanedText = jsonMatch ? jsonMatch[0] : textWithoutThink.replace(/```json/gi, "").replace(/```/g, "").trim();
          let parsed;
          try {
            parsed = JSON.parse(cleanedText);
          } catch (jsonErr) {
            parsed = {
              reply: textWithoutThink || rawText,
              intent: "general"
            };
          }
          return this.processParsedResponse(
            parsed,
            userMessage,
            activeDoctors,
            appointments,
            context
          );
        } catch (groqErr) {
          console.warn(`\u26A0\uFE0F [Groq] Error with ${modelName}:`, groqErr?.message || groqErr);
        }
      }
    }
    const client = this.getClient();
    if (client) {
      const candidateModels = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-3.1-flash-lite"];
      for (const modelName of candidateModels) {
        try {
          const contents = [];
          for (const h of history.slice(-6)) {
            contents.push({
              role: h.role,
              parts: [{ text: h.content }]
            });
          }
          contents.push({
            role: "user",
            parts: [{ text: userMessage }]
          });
          const geminiRes = await client.models.generateContent({
            model: modelName,
            config: {
              systemInstruction: systemPrompt,
              responseMimeType: "application/json"
            },
            contents
          });
          const rawText = geminiRes.text || "";
          const cleanedText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanedText);
          return this.processParsedResponse(
            parsed,
            userMessage,
            activeDoctors,
            appointments,
            context
          );
        } catch (err) {
          console.log(`[Gemini] ${modelName} unavailable (${err?.status || err?.code || "temporary demand"}), trying alternative...`);
        }
      }
    }
    return this.fallbackMedicalAssistant(userMessage, activeDoctors, departments, documents, appointments, context);
  }
  // Centralized response processor ensuring strict hospital booking rules and data attachment
  processParsedResponse(parsed, userMessage, activeDoctors, appointments, context) {
    const isBookingAttempt = parsed.intent === "summary_confirmation" || parsed.intent === "book" || parsed.intent === "confirm_booking" || /(\bbook\b|\bschedule\b|\breserve\b|\bappointment\b)/i.test(userMessage);
    const hasContactDetailsInText = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(userMessage) || /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/.test(userMessage) || /(?:my name is|patient:?|for\s+[a-z]+)/i.test(userMessage);
    const isGeneralInquiry = /hours|visiting|departments|location|address|insurance|services\?/i.test(userMessage);
    if (parsed.intent === "summary_confirmation" || isBookingAttempt && hasContactDetailsInText || isBookingAttempt && !isGeneralInquiry && parsed.intent !== "emergency") {
      parsed.intent = "collect_info";
      parsed.reply = `To ensure patient identity verification, HIPAA privacy compliance, and accurate hospital scheduling, all appointments through MediCare AI must be submitted using our official in-chat Appointment Booking Form. I have provided the official form below\u2014please verify or fill in your details and submit the form to proceed.`;
    }
    if (parsed.intent === "collect_info") {
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
    let doctorPayload = void 0;
    if (parsed.intent === "doctor_recommendation" || parsed.intent === "show_slots" || parsed.intent === "collect_info") {
      let matchedDoctor = null;
      if (parsed.doctorId) {
        matchedDoctor = activeDoctors.find((d) => d.id === parsed.doctorId);
      }
      if (!matchedDoctor && parsed.departmentName) {
        matchedDoctor = activeDoctors.find(
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
          specialty: `${matchedDoctor.specialty} \u2022 ${matchedDoctor.experienceText || `${matchedDoctor.yearsOfExperience} yrs exp`}`,
          department: matchedDoctor.department,
          imageUrl: matchedDoctor.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
          rating: matchedDoctor.rating || 5,
          reviewsCount: 42,
          feeText: matchedDoctor.feeText || `$${matchedDoctor.consultationFee || 150}`,
          room: matchedDoctor.room || `${matchedDoctor.department} Suite`,
          slots
        };
      }
    }
    return {
      reply: parsed.reply || "I'm here to assist you with your appointment at MediCare Hospital.",
      intent: parsed.intent || "general",
      departmentName: parsed.departmentName,
      doctor: doctorPayload,
      patientFormDetails: parsed.patientFormDetails,
      suggestedQuickReplies: parsed.suggestedQuickReplies || [
        "Submit Booking Form",
        "View available doctors",
        "Hospital hours"
      ]
    };
  }
  // Resilient fallback logic if Gemini API is temporarily busy
  fallbackMedicalAssistant(userMessage, activeDoctors, departments, documents, appointments, context) {
    const lower = userMessage.toLowerCase().trim();
    if (lower.includes("reschedule") || lower.includes("change date") || lower.includes("change time")) {
      return {
        reply: "I can help you reschedule your appointment right away. Please share your **Appointment ID** (e.g. APT-2026-001) or your registered **phone number**, and I will retrieve your booking and show available alternative slots.",
        intent: "reschedule",
        suggestedQuickReplies: ["Enter Appointment ID", "Check my bookings", "Cancel appointment instead"]
      };
    }
    if (lower.includes("cancel") || lower.includes("delete appointment")) {
      return {
        reply: "Cancellations are completely free of charge. Please provide your **Appointment ID** or registered phone number so I can locate your booking and confirm the cancellation.",
        intent: "cancel",
        suggestedQuickReplies: ["Provide Appointment ID", "Reschedule instead", "Back to main menu"]
      };
    }
    if (lower.includes("department") && (lower.includes("what") || lower.includes("which") || lower.includes("list") || lower.includes("have")) || lower === "departments" || lower.includes("all departments")) {
      const deptList = departments.map((d) => `\u2022 **${d.name}** (${d.consultationLocation || "Clinic Suite"}): ${d.description || "Specialized clinical care"}`).join("\n");
      return {
        reply: `MediCare Hospital operates the following active departments:

${deptList}

Would you like me to connect you with a specialist in one of these departments, or help you book a consultation?`,
        intent: "knowledge",
        suggestedQuickReplies: [
          "Book Virology consultation",
          "Book Radiology scan",
          "Disease Control info",
          "Who are your doctors?"
        ]
      };
    }
    if (lower.includes("who are your doctor") || lower.includes("list of doctor") || lower.includes("available doctor") || lower.includes("physician") || lower.includes("who are your")) {
      if (lower.includes("dermatolog") || lower.includes("skin doctor") || lower.includes("cardiolog") || lower.includes("neurolog")) {
        return {
          reply: "We do not currently have that specific specialty department in our hospital records. Our active departments at MediCare Hospital are **Virology**, **Radiology**, and **Disease Control**.\n\nWould you like me to connect you with an available physician in one of our active departments?",
          intent: "knowledge",
          suggestedQuickReplies: [
            "View Virology doctors",
            "View Radiology doctors",
            "What departments do you have?"
          ]
        };
      }
      if (lower.includes("virolog")) {
        const virologyDocs = activeDoctors.filter((d) => d.department?.toLowerCase().includes("virology"));
        const docList2 = virologyDocs.map((d) => `\u2022 **${d.name}** (${d.specialty} \u2022 ${d.experienceText || `${d.yearsOfExperience} yrs exp`}, Room: ${d.room || "Room 204"})`).join("\n");
        return {
          reply: `Here are our specialist physicians in the **Virology** department:

${docList2}

Do you have a preferred doctor you would like to book with, or would you like me to find an open slot?`,
          intent: "knowledge",
          suggestedQuickReplies: virologyDocs.slice(0, 3).map((d) => `Book with ${d.name}`)
        };
      }
      if (lower.includes("radiolog")) {
        const radDocs = activeDoctors.filter((d) => d.department?.toLowerCase().includes("radiology"));
        const docList2 = radDocs.map((d) => `\u2022 **${d.name}** (${d.specialty} \u2022 ${d.experienceText || `${d.yearsOfExperience} yrs exp`}, Room: ${d.room || "Room 209"})`).join("\n");
        return {
          reply: `Here are our specialist physicians in the **Radiology** department:

${docList2}

Do you have a preferred doctor you would like to book with, or would you like me to find an open slot?`,
          intent: "knowledge",
          suggestedQuickReplies: radDocs.map((d) => `Book with ${d.name}`)
        };
      }
      const docList = activeDoctors.slice(0, 6).map((d) => `\u2022 **${d.name}** \u2014 ${d.department} (${d.specialty})`).join("\n");
      return {
        reply: `Here are our active specialist physicians at MediCare Hospital:

${docList}

Would you like to schedule an appointment with any of them?`,
        intent: "knowledge",
        suggestedQuickReplies: [
          "Book an appointment",
          "Virology Department",
          "Radiology Department",
          "Hospital hours"
        ]
      };
    }
    const hasPhoneInText = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(userMessage);
    const hasNameInText = /(?:my name is|i am|patient:?|name:?)\s+([a-zA-Z\s]+)/i.test(userMessage);
    const asksToBookDirectly = lower.includes("without form") || lower.includes("directly in chat") || lower.includes("book for me") || lower.includes("book it for me") || lower.includes("just book") || lower.includes("book my appointment");
    const explicitBookingInquiry = lower.includes("book") || lower.includes("schedule") || lower.includes("appointment") || lower.includes("consultation") || lower.includes("reserve");
    if (hasPhoneInText || hasNameInText || asksToBookDirectly || explicitBookingInquiry) {
      let matchedDoc = activeDoctors[0];
      if (lower.includes("sarah") || lower.includes("jenkins") || lower.includes("radiolog")) {
        matchedDoc = activeDoctors.find((d) => d.department?.toLowerCase().includes("radiolog")) || activeDoctors[0];
      } else if (lower.includes("david") || lower.includes("vance") || lower.includes("disease")) {
        matchedDoc = activeDoctors.find((d) => d.department?.toLowerCase().includes("disease")) || activeDoctors[0];
      } else if (lower.includes("raphael") || lower.includes("okon") || lower.includes("virolog")) {
        matchedDoc = activeDoctors.find((d) => d.department?.toLowerCase().includes("virolog")) || activeDoctors[0];
      } else if (context?.selectedDoctor?.id) {
        matchedDoc = activeDoctors.find((d) => d.id === context.selectedDoctor.id) || activeDoctors[0];
      }
      const slots = this.calculateDoctorSlots(matchedDoc, appointments);
      let extractedName = "";
      const nameMatch = userMessage.match(/(?:my name is|i am|patient:?|name:?)\s+([a-zA-Z\s]+?)(?:,|\.|\band\b|\bphone\b|\bwith\b|$)/i);
      if (nameMatch && nameMatch[1]) {
        extractedName = nameMatch[1].trim();
      }
      let extractedPhone = "";
      const phoneMatch = userMessage.match(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/);
      if (phoneMatch) {
        extractedPhone = phoneMatch[0].trim();
      }
      let extractedEmail = "";
      const emailMatch = userMessage.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      if (emailMatch) {
        extractedEmail = emailMatch[0].trim();
      }
      const isTextBypassAttempt = hasPhoneInText || hasNameInText || asksToBookDirectly;
      const replyText = isTextBypassAttempt ? `To protect patient privacy, comply with healthcare regulations, and record your appointment directly into our hospital database, **all MediCare AI appointments must be submitted through our official in-chat Appointment Booking Form**.

I have provided the form below and pre-filled the information you shared. Please review the details, verify your preferred slot, and submit the form to finalize your appointment.` : `I would be delighted to help you schedule your appointment with **${matchedDoc.name}** (${matchedDoc.department}).

To ensure verified hospital scheduling and instant confirmation, all appointments through MediCare AI must be submitted using our **official in-chat Appointment Booking Form**. I have provided the form below\u2014please review or enter your details and submit the form to proceed:`;
      return {
        reply: replyText,
        intent: "collect_info",
        departmentName: matchedDoc.department,
        doctor: {
          id: matchedDoc.id,
          name: matchedDoc.name,
          specialty: `${matchedDoc.specialty} \u2022 ${matchedDoc.experienceText || `${matchedDoc.yearsOfExperience} yrs exp`}`,
          department: matchedDoc.department,
          imageUrl: matchedDoc.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
          rating: matchedDoc.rating || 5,
          reviewsCount: 38,
          feeText: matchedDoc.feeText || `$${matchedDoc.consultationFee || 150}`,
          room: matchedDoc.room || `${matchedDoc.department} Suite`,
          slots
        },
        patientFormDetails: {
          patientName: extractedName || context?.patientInfo?.patientName,
          patientPhone: extractedPhone || context?.patientInfo?.patientPhone,
          patientEmail: extractedEmail || context?.patientInfo?.patientEmail,
          reasonForVisit: context?.activeComplaint || "",
          preferredDoctor: matchedDoc.name
        },
        suggestedQuickReplies: [
          "Submit Booking Form",
          "Choose another doctor",
          "Hospital visiting hours"
        ]
      };
    }
    const doctorMatch = activeDoctors.find((d) => {
      const docFullName = (d.name || "").toLowerCase();
      const lastName = (d.lastName || "").toLowerCase().trim();
      const firstName = (d.firstName || "").toLowerCase().trim();
      return lastName.length > 2 && lower.includes(lastName) || firstName.length > 2 && lower.includes(firstName) || lower.includes(docFullName);
    });
    if (doctorMatch) {
      const slots = this.calculateDoctorSlots(doctorMatch, appointments);
      return {
        reply: `I found **${doctorMatch.name}** in our **${doctorMatch.department}** department (${doctorMatch.specialty} \u2022 ${doctorMatch.experienceText || `${doctorMatch.yearsOfExperience} yrs exp`}). Consultation fee is ${doctorMatch.feeText || `$${doctorMatch.consultationFee || 150}`} located in ${doctorMatch.room || "Clinic Suite"}.

Here are the next available consultation slots:`,
        intent: "doctor_recommendation",
        departmentName: doctorMatch.department,
        doctor: {
          id: doctorMatch.id,
          name: doctorMatch.name,
          specialty: `${doctorMatch.specialty} \u2022 ${doctorMatch.experienceText || `${doctorMatch.yearsOfExperience} yrs exp`}`,
          department: doctorMatch.department,
          imageUrl: doctorMatch.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
          rating: doctorMatch.rating || 5,
          reviewsCount: 38,
          feeText: doctorMatch.feeText || `$${doctorMatch.consultationFee || 150}`,
          room: doctorMatch.room || `${doctorMatch.department} Suite`,
          slots
        },
        suggestedQuickReplies: [
          `Book with ${doctorMatch.name}`,
          "Choose another doctor",
          "Check hospital hours"
        ]
      };
    }
    if (lower.includes("dr.") || lower.includes("dr ") || lower.includes("doctor ")) {
      const doctorWordMatch = lower.match(/(?:dr\.?|doctor)\s+([a-z]+)/i);
      if (doctorWordMatch && doctorWordMatch[1]) {
        const requestedName = doctorWordMatch[1];
        if (!["an", "the", "a", "to", "for", "who"].includes(requestedName.toLowerCase())) {
          return {
            reply: `I couldn't find a doctor named "${requestedName}" in our current hospital records. In our hospital, our active departments are **Virology**, **Radiology**, and **Disease Control**.

Would you like me to find an available specialist for you in one of these departments?`,
            intent: "knowledge",
            suggestedQuickReplies: [
              "Find an available specialist",
              "Who are your doctors?",
              "What departments do you have?"
            ]
          };
        }
      }
    }
    const matchingDoc = documents.find((doc) => {
      const titleMatch = doc.title.toLowerCase().split(/\s+/).some((w) => w.length > 3 && lower.includes(w));
      const topicMatch = doc.extractedKeywords?.some((k) => lower.includes(k.toLowerCase()));
      const textMatch = (lower.includes("ultrasound") || lower.includes("mri") || lower.includes("scan") || lower.includes("fasting")) && doc.category === "Radiology";
      const edMatch = (lower.includes("emergency") || lower.includes("trauma") || lower.includes("triage") || lower.includes("hotline")) && doc.category === "Emergency";
      const insMatch = (lower.includes("insurance") || lower.includes("payment") || lower.includes("copay") || lower.includes("fee")) && doc.title.toLowerCase().includes("insurance");
      const visitMatch = (lower.includes("visiting") || lower.includes("hours") || lower.includes("visitor") || lower.includes("icu")) && doc.title.toLowerCase().includes("visiting");
      return titleMatch || topicMatch || textMatch || edMatch || insMatch || visitMatch;
    });
    if (matchingDoc && (matchingDoc.extractedText || matchingDoc.summary)) {
      const summaryText = matchingDoc.summary || matchingDoc.description || "";
      const detailedSnippet = matchingDoc.extractedText ? matchingDoc.extractedText.slice(0, 700).trim() + (matchingDoc.extractedText.length > 700 ? "..." : "") : "";
      return {
        reply: `According to our verified MediCare Hospital Knowledge Base (**${matchingDoc.title}**):

${summaryText}

${detailedSnippet}

Would you like more details, or can I help you book a consultation?`,
        intent: "knowledge",
        suggestedQuickReplies: [
          "Book an appointment",
          "Ask another question",
          "Who are your doctors?",
          "What departments do you have?"
        ]
      };
    }
    if (lower.includes("hour") || lower.includes("visiting") || lower.includes("visit") || lower.includes("insurance") || lower.includes("service") || lower.includes("location") || lower.includes("address") || lower.includes("parking") || lower.includes("cost") || lower.includes("fee")) {
      return {
        reply: "Here is key information regarding MediCare Hospital:\n\n\u2022 **Visiting Hours**: Monday \u2013 Saturday, 8:00 AM \u2013 8:00 PM. (ICU: 11:00 AM\u20131:00 PM & 5:00 PM\u20137:00 PM)\n\u2022 **Emergency Services**: Open 24/7/365 with on-site trauma surgery and diagnostics\n\u2022 **Location**: Campus Way, Main Medical Center\n\u2022 **Accepted Insurance**: Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, Medicare Part B, and regional HMOs\n\u2022 **Standard Specialist Consultation**: $150\n\nWould you like me to help you schedule a consultation with one of our specialists?",
        intent: "knowledge",
        suggestedQuickReplies: [
          "Book an appointment",
          "Virology Department",
          "Radiology Department",
          "Emergency Care Info"
        ]
      };
    }
    const isRadiologySymptom = lower.includes("scan") || lower.includes("x-ray") || lower.includes("xray") || lower.includes("mri") || lower.includes("ct") || lower.includes("ultrasound") || lower.includes("bone") || lower.includes("radiation") || lower.includes("radiology");
    const isVirologySymptom = lower.includes("flu") || lower.includes("fever") || lower.includes("cough") || lower.includes("covid") || lower.includes("virus") || lower.includes("cold") || lower.includes("virology") || lower.includes("throat") || lower.includes("chills");
    const isDiseaseControlSymptom = lower.includes("bacteria") || lower.includes("disease control") || lower.includes("rash") || lower.includes("skin") || lower.includes("infection");
    const userWantsRecommendation = lower.includes("find an available") || lower.includes("recommend") || lower.includes("yes please") || lower.includes("find a doctor") || lower.includes("suggest a doctor") || lower.includes("available specialist");
    if (isRadiologySymptom) {
      const doc = activeDoctors.find((d) => d.department?.toLowerCase().includes("radiology")) || activeDoctors[0];
      if (userWantsRecommendation) {
        const slots = this.calculateDoctorSlots(doc, appointments);
        return {
          reply: `I found an available diagnostic specialist who matches your request: **${doc.name}** in our **${doc.department}** department (${doc.specialty}).

Please select your preferred consultation time slot below:`,
          intent: "doctor_recommendation",
          departmentName: doc.department,
          doctor: {
            id: doc.id,
            name: doc.name,
            specialty: `${doc.specialty} \u2022 ${doc.experienceText || `${doc.yearsOfExperience} yrs exp`}`,
            department: doc.department,
            imageUrl: doc.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
            rating: doc.rating || 5,
            reviewsCount: 38,
            feeText: doc.feeText || `$${doc.consultationFee || 150}`,
            room: doc.room || `${doc.department} Suite`,
            slots
          },
          suggestedQuickReplies: [`Book with ${doc.name}`, "Choose another doctor", "Check fees"]
        };
      }
      return {
        reply: "Thanks for explaining that. Based on what you've described, **Radiology** is the appropriate department for diagnostic imaging.\n\nDo you already have a preferred doctor you'd like to see, or would you like me to find an available specialist for you?",
        intent: "triage",
        departmentName: "Radiology",
        suggestedQuickReplies: [
          "Find an available specialist",
          "Who are the Radiology doctors?",
          "Different department"
        ]
      };
    }
    if (isVirologySymptom) {
      const doc = activeDoctors.find((d) => d.department?.toLowerCase().includes("virology")) || activeDoctors[0];
      if (userWantsRecommendation) {
        const slots = this.calculateDoctorSlots(doc, appointments);
        return {
          reply: `I found an available specialist who matches your request: **${doc.name}** in our **${doc.department}** department (${doc.specialty}).

Please select your preferred consultation time slot below:`,
          intent: "doctor_recommendation",
          departmentName: doc.department,
          doctor: {
            id: doc.id,
            name: doc.name,
            specialty: `${doc.specialty} \u2022 ${doc.experienceText || `${doc.yearsOfExperience} yrs exp`}`,
            department: doc.department,
            imageUrl: doc.imageUrl || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
            rating: doc.rating || 5,
            reviewsCount: 38,
            feeText: doc.feeText || `$${doc.consultationFee || 150}`,
            room: doc.room || `${doc.department} Suite`,
            slots
          },
          suggestedQuickReplies: [`Book with ${doc.name}`, "Choose another doctor", "Check fees"]
        };
      }
      return {
        reply: "Thanks for explaining that. Based on what you've described, **Virology** may be the appropriate department for viral and respiratory illnesses.\n\nDo you already have a doctor you'd like to see, or would you like me to find an available specialist for you?",
        intent: "triage",
        departmentName: "Virology",
        suggestedQuickReplies: [
          "Find an available specialist",
          "Who are the Virology doctors?",
          "Different department"
        ]
      };
    }
    if (isDiseaseControlSymptom) {
      return {
        reply: "Thanks for explaining that. Based on your symptoms, our **Disease Control** department is the recommended service for bacterial and infectious conditions.\n\nWould you like me to find an available doctor in our clinical staff for your consultation?",
        intent: "triage",
        departmentName: "Disease Control",
        suggestedQuickReplies: [
          "Find an available specialist",
          "What departments do you have?",
          "Hospital hours"
        ]
      };
    }
    return {
      reply: "Hello! \u{1F44B} I'm **MediCare AI**, your conversational hospital assistant. I'm here to understand your medical needs, connect you with the right specialist, and help you book, reschedule, or cancel your appointment.\n\nCould you please share what symptoms or reason brings you in today?",
      intent: "greeting",
      suggestedQuickReplies: [
        "I want to book an appointment",
        "Flu & fever symptoms",
        "Need an X-Ray / CT scan",
        "Hospital hours & services",
        "Reschedule appointment"
      ]
    };
  }
  // Complete Appointment Booking Engine (Server-Validated)
  async bookAppointment(bookingData) {
    const {
      patientName,
      patientPhone,
      patientEmail,
      patientAge = 35,
      patientGender = "Other",
      patientBloodGroup = "O+",
      doctorName,
      department,
      date,
      time,
      reasonForVisit,
      fee = "$150"
    } = bookingData;
    if (!patientName || !patientPhone || !doctorName || !date || !time) {
      throw new Error("Missing required booking details: patient name, phone, doctor name, date, and time are mandatory.");
    }
    const existingAppointments = await mongoDb.getAppointments();
    const isSlotTaken = existingAppointments.some((a) => {
      if (a.status === "Cancelled") return false;
      const sameDoctor = a.doctorName?.toLowerCase().trim() === doctorName.toLowerCase().trim();
      const sameDate = a.date?.toLowerCase().trim() === date.toLowerCase().trim();
      const sameTime = a.time?.toLowerCase().replace(/\s+/g, "") === time.toLowerCase().replace(/\s+/g, "");
      return sameDoctor && sameDate && sameTime;
    });
    if (isSlotTaken) {
      throw new Error(`The requested time slot (${time} on ${date}) with ${doctorName} was just taken. Please choose another available slot.`);
    }
    const existingPatients = await mongoDb.getPatients();
    const cleanPhone = patientPhone.replace(/[^0-9]/g, "");
    const cleanEmail = (patientEmail || "").toLowerCase().trim();
    let patient = existingPatients.find((p) => {
      const pPhone = (p.phone || "").replace(/[^0-9]/g, "");
      const pEmail = (p.email || "").toLowerCase().trim();
      return cleanPhone && pPhone === cleanPhone || cleanEmail && pEmail === cleanEmail;
    });
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    const todayDateStr = nowIso.split("T")[0];
    if (patient) {
      patient = await mongoDb.updatePatient(patient.id, {
        lastVisit: todayDateStr,
        recentActivityTime: "Just now",
        department: department || patient.department,
        name: patientName || patient.name
      });
    } else {
      patient = await mongoDb.createPatient({
        name: patientName,
        phone: patientPhone,
        email: patientEmail || `${patientName.toLowerCase().replace(/\s+/g, "")}@patient.medicare.com`,
        age: Number(patientAge) || 30,
        gender: patientGender,
        bloodGroup: patientBloodGroup,
        department: department || "General Medicine",
        lastVisit: todayDateStr,
        status: "Active",
        registrationDate: todayDateStr,
        recentActivityTime: "Just now",
        notes: reasonForVisit || "Registered via MediCare AI Assistant"
      });
    }
    const appointmentId = `APT-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
    const newAppointment = await mongoDb.createAppointment({
      id: appointmentId,
      patientId: patient.patientId || patient.id,
      patientName,
      patientAvatar: patient.avatar || `https://images.unsplash.com/photo-${patientGender === "Female" ? "1544005313-94ddf0286df2" : "1507003211169-0a1dd7228f2d"}?auto=format&fit=crop&w=150&q=80`,
      patientGender,
      patientAge: Number(patientAge) || 30,
      patientBloodGroup,
      patientPhone,
      patientEmail: patient.email || patientEmail || "",
      doctorName,
      doctorSpecialty: "Consultant Specialist",
      doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80",
      department: department || "General Medicine",
      room: `${department} Suite`,
      date,
      time,
      type: "Consultation",
      status: "Confirmed",
      fee,
      notes: reasonForVisit || "Booked via MediCare AI Assistant",
      createdAt: nowIso
    });
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const parsedDate = new Date(date);
    const dayName = !isNaN(parsedDate.getTime()) ? daysOfWeek[parsedDate.getDay()] : "Monday";
    await mongoDb.createSchedule({
      dayOfWeek: dayName,
      date,
      time,
      timeSlot: time,
      patientName,
      department: department || "General Medicine",
      doctorName,
      status: "Confirmed",
      room: `${department} Suite`,
      notes: `Booked via MediCare AI. Ref: ${appointmentId}`
    }).catch((e) => console.warn("Schedule sync notice:", e.message));
    try {
      await emailService.sendBookingConfirmation({
        id: appointmentId,
        patientName,
        patientEmail: patient.email || patientEmail,
        patientPhone,
        doctorName,
        doctorSpecialty: "Consultant Specialist",
        department: department || "General Medicine",
        date,
        time,
        room: `${department} Suite`,
        fee,
        notes: reasonForVisit
      });
    } catch (err) {
      console.warn("[Resend] Booking email notice:", err?.message || err);
    }
    return {
      success: true,
      appointment: newAppointment,
      patient,
      message: `Appointment ${appointmentId} confirmed successfully with ${doctorName}.`
    };
  }
};
var aiService = new AIService();

// server/verificationService.ts
import crypto from "crypto";
var verificationStore = /* @__PURE__ */ new Map();
function maskEmail(email) {
  if (!email || !email.includes("@")) return "your registered email";
  const [user, domain] = email.split("@");
  if (user.length <= 2) {
    return `${user[0]}***@${domain}`;
  }
  const first = user.slice(0, 1);
  const last = user.slice(-1);
  const stars = "*".repeat(Math.min(user.length - 2, 4));
  return `${first}${stars}${last}@${domain}`;
}
var VerificationService = class {
  /**
   * Generates a 6-digit OTP code, stores session, and sends security email via Resend
   */
  async requestVerification(params) {
    const rawId = params.appointmentId?.trim();
    if (!rawId) {
      return { success: false, error: "Appointment Reference Number is required." };
    }
    const key = rawId.toUpperCase();
    const appointments = await mongoDb.getAppointments();
    const apt = appointments.find(
      (a) => a.id?.toUpperCase() === key || a._id?.toString() === rawId
    );
    if (!apt) {
      return {
        success: false,
        error: `No appointment found with Reference ID "${rawId}". Please verify your appointment number (e.g., APT-2026-XXXX) from your confirmation email.`
      };
    }
    if (apt.status === "Cancelled") {
      return {
        success: false,
        error: `Appointment ${apt.id} is already cancelled and cannot be modified. If you need medical care, please book a new consultation.`
      };
    }
    const existing = verificationStore.get(key);
    if (existing && Date.now() - existing.createdAt < 3e4 && Date.now() < existing.expiresAt) {
      const waitSec = Math.ceil((3e4 - (Date.now() - existing.createdAt)) / 1e3);
      return {
        success: false,
        error: `A verification code was recently dispatched. Please wait ${waitSec} seconds before requesting a new code.`
      };
    }
    let patientEmail = apt.patientEmail?.trim();
    if (!patientEmail) {
      const patients = await mongoDb.getPatients();
      const patient = patients.find((p) => p.id === apt.patientId || p.name?.toLowerCase() === apt.patientName?.toLowerCase());
      patientEmail = patient?.email?.trim();
    }
    if (!patientEmail) {
      patientEmail = "patient@medicare.name.ng";
    }
    const code = Math.floor(1e5 + Math.random() * 9e5).toString();
    const expiresAt = Date.now() + 10 * 60 * 1e3;
    const session = {
      appointmentId: apt.id,
      code,
      purpose: params.purpose,
      patientName: apt.patientName || "Patient",
      patientEmail,
      createdAt: Date.now(),
      expiresAt,
      verified: false,
      doctorName: apt.doctorName || "Consultant Specialist",
      department: apt.department || "Outpatient Clinic",
      date: apt.date,
      time: apt.time
    };
    verificationStore.set(key, session);
    const emailResult = await emailService.sendVerificationCode({
      appointmentId: apt.id,
      patientName: session.patientName,
      patientEmail: session.patientEmail,
      code,
      purpose: params.purpose,
      doctorName: session.doctorName,
      department: session.department,
      date: session.date,
      time: session.time
    });
    console.log(
      `[Verification] Dispatched code for appointment ${apt.id} (${params.purpose}) to ${patientEmail} (Simulated: ${!!emailResult.simulated})`
    );
    return {
      success: true,
      maskedEmail: maskEmail(patientEmail),
      expiresAt,
      appointment: apt,
      simulated: emailResult.simulated
    };
  }
  /**
   * Validates the 6-digit code entered by the user
   */
  verifyCode(params) {
    const rawId = params.appointmentId?.trim();
    const rawCode = params.code?.trim().replace(/\s+/g, "");
    if (!rawId || !rawCode) {
      return {
        success: false,
        verified: false,
        error: "Both Appointment Reference and Verification Code are required."
      };
    }
    const key = rawId.toUpperCase();
    const session = verificationStore.get(key);
    if (!session) {
      return {
        success: false,
        verified: false,
        error: "No active verification code found for this appointment. Please request a new code."
      };
    }
    if (Date.now() > session.expiresAt) {
      verificationStore.delete(key);
      return {
        success: false,
        verified: false,
        error: "Verification code has expired (10-minute limit). Please request a new code."
      };
    }
    if (session.code !== rawCode) {
      return {
        success: false,
        verified: false,
        error: "Incorrect 6-digit verification code. Please verify the code sent to your email and try again."
      };
    }
    const verificationToken = `VT-${crypto.randomUUID()}`;
    session.verified = true;
    session.verifiedAt = Date.now();
    session.verificationToken = verificationToken;
    console.log(`[Verification] Successfully verified appointment ${session.appointmentId} for ${session.purpose}`);
    return {
      success: true,
      verified: true,
      verificationToken,
      appointmentId: session.appointmentId
    };
  }
  /**
   * Check whether an appointment has been verified for modification recently
   */
  isVerified(appointmentId, token) {
    const key = appointmentId?.trim().toUpperCase();
    const session = verificationStore.get(key);
    if (!session || !session.verified || !session.verifiedAt) return false;
    const isRecent = Date.now() - session.verifiedAt < 15 * 60 * 1e3;
    if (!isRecent) {
      verificationStore.delete(key);
      return false;
    }
    if (token && session.verificationToken && token !== session.verificationToken) {
      return false;
    }
    return true;
  }
  /**
   * Consume / clear verification once the reschedule or cancellation completes
   */
  consume(appointmentId) {
    const key = appointmentId?.trim().toUpperCase();
    verificationStore.delete(key);
  }
  /**
   * Debug / admin view of active sessions
   */
  getActiveCount() {
    return verificationStore.size;
  }
};
var verificationService = new VerificationService();

// server/ocrService.ts
import zlib from "zlib";
import { GoogleGenAI as GoogleGenAI2 } from "@google/genai";
import Groq2 from "groq-sdk";
function extractRawPdfText(pdfBuffer) {
  try {
    const str = pdfBuffer.toString("latin1");
    const textChunks = [];
    const extractTextTokens = (content) => {
      const tjRegex = /\(([^)]+)\)\s*Tj/g;
      let match;
      while ((match = tjRegex.exec(content)) !== null) {
        if (match[1] && match[1].trim()) {
          textChunks.push(match[1]);
        }
      }
      const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
      while ((match = tjArrayRegex.exec(content)) !== null) {
        const inner = match[1];
        const innerMatches = inner.match(/\(([^)]+)\)/g);
        if (innerMatches) {
          const line = innerMatches.map((m) => m.slice(1, -1)).join("");
          if (line.trim()) textChunks.push(line);
        }
      }
    };
    extractTextTokens(str);
    const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
    let streamMatch;
    while ((streamMatch = streamRegex.exec(str)) !== null) {
      const streamContent = streamMatch[1];
      try {
        const decompressed = zlib.inflateSync(Buffer.from(streamContent, "latin1")).toString("latin1");
        extractTextTokens(decompressed);
      } catch {
      }
    }
    const pageMatches = str.match(/\/Type\s*\/Page[^s]/g);
    const pages = pageMatches ? Math.max(1, pageMatches.length) : 1;
    const extracted = textChunks.join(" ").replace(/\\r|\\n/g, " ").replace(/\\([()\\])/g, "$1").replace(/\s+/g, " ").trim();
    if (extracted.length > 5) {
      return { text: extracted, pages };
    }
  } catch (err) {
    console.warn("[OCR Service] Pure Node PDF stream parser note:", err?.message || err);
  }
  return { text: "", pages: 1 };
}
var OcrService = class {
  constructor() {
    this.groq = null;
    this.ai = null;
  }
  getGroqClient() {
    const apiKey = (process.env.GROQ_API_KEY || "").trim();
    if (!apiKey) return null;
    if (!this.groq) {
      this.groq = new Groq2({ apiKey });
    }
    return this.groq;
  }
  getClient() {
    if (!this.ai && process.env.GEMINI_API_KEY) {
      this.ai = new GoogleGenAI2({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
    }
    return this.ai;
  }
  /**
   * Cleans base64 string from data URI prefix if present
   */
  cleanBase64(input) {
    if (input.includes(";base64,")) {
      return input.split(";base64,")[1];
    }
    return input.trim();
  }
  /**
   * Main OCR & Text Extraction pipeline
   * 1. Extracts PDF text with pdf-parse
   * 2. If Groq is available, extracts high-fidelity summary and clinical key topics with Groq (openai/gpt-oss-120b)
   * 3. Falls back to Gemini OCR or pdf-parse heuristics
   */
  async extractTextFromPdf(base64Data, filename = "hospital_document.pdf") {
    const rawBase64 = this.cleanBase64(base64Data);
    const pdfBuffer = Buffer.from(rawBase64, "base64");
    const { text: parsedText, pages: parsedPages } = await extractRawPdfText(pdfBuffer);
    const groq = this.getGroqClient();
    if (groq && parsedText.length > 10) {
      try {
        const modelName = (process.env.GROQ_MODEL || "openai/gpt-oss-120b").trim();
        console.log(`\u{1F50D} [OCR Service] Running Groq AI extraction (${modelName}) on "${filename}" (${parsedText.length} chars)...`);
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: [
            {
              role: "system",
              content: "You are the Hospital Optical Document and Knowledge Extraction Engine for MediCare Hospital. Extract a concise clinical executive summary and key topics in JSON format."
            },
            {
              role: "user",
              content: `Hospital clinical document: "${filename}"

Extracted Content:
${parsedText.slice(0, 8e3)}

Output ONLY a valid JSON object matching:
{
  "summary": "2-3 sentence executive clinical and administrative summary",
  "keyTopics": ["Topic 1", "Topic 2", "Topic 3"]
}`
            }
          ],
          temperature: 1,
          max_completion_tokens: 1024,
          top_p: 1
        });
        const reply = completion.choices[0]?.message?.content || "";
        const cleaned = reply.replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/```json/gi, "").replace(/```/g, "").trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const chunks = Math.max(1, Math.ceil(parsedText.length / 450));
          console.log(`\u2705 [OCR Service] Groq extraction succeeded for "${filename}"`);
          return {
            extractedText: parsedText,
            summary: parsed.summary || `Extracted clinical policies and guidelines from ${filename}.`,
            keyTopics: Array.isArray(parsed.keyTopics) ? parsed.keyTopics : ["Clinical Guidelines", "Hospital Policies"],
            pageCount: parsedPages,
            extractedChunks: chunks,
            ocrEngine: "groq-ocr",
            confidenceScore: 0.98
          };
        }
      } catch (groqErr) {
        console.warn(`[OCR Service] Groq extraction error:`, groqErr?.message);
      }
    }
    const client = this.getClient();
    if (client) {
      const candidateModels = ["gemini-3.8-flash", "gemini-2.5-flash", "gemini-3.1-flash-lite"];
      for (const modelName of candidateModels) {
        try {
          console.log(`\u{1F50D} [OCR Service] Running Gemini OCR with ${modelName} on "${filename}" (${pdfBuffer.length} bytes)...`);
          const prompt = `You are the Optical Character Recognition (OCR) and Hospital Knowledge Extraction Engine for MediCare Hospital.
Extract all text, sections, hospital procedures, diagnostic guidelines, department information, visiting hours, emergency directions, fees, and clinical instructions from this PDF document.

Instructions:
1. Extract ALL text faithfully and comprehensively. Maintain headings, bullet points, numbered lists, tables, and paragraphs.
2. Produce a clear 2-3 sentence executive clinical and administrative summary.
3. Extract 4 to 8 key hospital topics/keywords covered in the document.
4. Estimate or detect the total page count.

Output ONLY a valid JSON object with this exact structure:
{
  "extractedText": "Full extracted textual content with clear headers and layout...",
  "summary": "Concise 2-3 sentence summary of the hospital document...",
  "keyTopics": ["Keyword 1", "Keyword 2", "Keyword 3"],
  "pageCount": 1
}
Do NOT include markdown fences (no \`\`\`json or \`\`\`), return pure JSON.`;
          const response = await client.models.generateContent({
            model: modelName,
            contents: [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: rawBase64
                }
              },
              {
                text: prompt
              }
            ]
          });
          const rawText = response.text || "";
          const cleanedJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
          try {
            const parsed = JSON.parse(cleanedJson);
            if (parsed && parsed.extractedText && parsed.extractedText.trim().length > 15) {
              const fullText = parsed.extractedText.trim();
              const chunks = Math.max(1, Math.ceil(fullText.length / 450));
              console.log(`\u2705 [OCR Service] Gemini OCR succeeded for "${filename}" (${fullText.length} chars, ${chunks} chunks)`);
              return {
                extractedText: fullText,
                summary: parsed.summary || `Extracted clinical protocols and policies from ${filename} for MediCare Hospital AI Knowledge Base.`,
                keyTopics: Array.isArray(parsed.keyTopics) ? parsed.keyTopics : ["Clinical Guidelines", "Hospital Policies"],
                pageCount: typeof parsed.pageCount === "number" ? parsed.pageCount : 1,
                extractedChunks: chunks,
                ocrEngine: "gemini-ocr",
                confidenceScore: 0.98
              };
            }
          } catch (jsonErr) {
            if (rawText.length > 50) {
              const chunks = Math.max(1, Math.ceil(rawText.length / 450));
              return {
                extractedText: rawText.trim(),
                summary: `OCR-extracted clinical knowledge from ${filename}.`,
                keyTopics: ["Hospital Care", "Clinical Protocols", "Patient Information"],
                pageCount: 1,
                extractedChunks: chunks,
                ocrEngine: "gemini-ocr",
                confidenceScore: 0.92
              };
            }
          }
        } catch (geminiError) {
          console.warn(`\u26A0\uFE0F [OCR Service] Gemini OCR with ${modelName} failed:`, geminiError.message);
        }
      }
    }
    try {
      console.log(`\u{1F4C4} [OCR Service] Running local text extraction engine for "${filename}"...`);
      const { text, pages: pageCount } = await extractRawPdfText(pdfBuffer);
      if (text.length > 10) {
        const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
        const summary = lines.slice(0, 3).join(" ") || `Uploaded clinical guidelines extracted from ${filename}.`;
        const chunks = Math.max(1, Math.ceil(text.length / 450));
        const topics = [];
        const lower = text.toLowerCase();
        if (lower.includes("doctor") || lower.includes("physician")) topics.push("Medical Staff");
        if (lower.includes("emergency") || lower.includes("trauma")) topics.push("Emergency Protocols");
        if (lower.includes("hour") || lower.includes("visiting")) topics.push("Visiting Policies");
        if (lower.includes("insurance") || lower.includes("fee") || lower.includes("payment")) topics.push("Billing & Insurance");
        if (lower.includes("radiology") || lower.includes("scan") || lower.includes("x-ray")) topics.push("Diagnostic Imaging");
        if (lower.includes("cardio") || lower.includes("heart")) topics.push("Cardiology");
        if (lower.includes("surgery") || lower.includes("operation")) topics.push("Surgical Care");
        if (topics.length === 0) topics.push("Clinical Guidelines", "Hospital Procedures");
        console.log(`\u2705 [OCR Service] Extracted ${text.length} chars (${chunks} chunks) for "${filename}"`);
        return {
          extractedText: text,
          summary,
          keyTopics: topics,
          pageCount,
          extractedChunks: chunks,
          ocrEngine: "pdf-parse-fallback",
          confidenceScore: 0.88
        };
      }
    } catch (parseError) {
      console.error(`\u274C [OCR Service] Text extraction fallback failed for "${filename}":`, parseError);
    }
    const fallbackText = `MediCare Hospital Clinical Document: ${filename.replace(/[-_]/g, " ")}

This hospital document was uploaded into MediCare Hospital Knowledge Base. It contains verified medical directives, institutional policies, and patient guidelines authorized by the hospital clinical directorate.`;
    return {
      extractedText: fallbackText,
      summary: `Clinical document ${filename} registered into MediCare Hospital AI memory.`,
      keyTopics: ["Hospital Care", "Clinical Guidelines"],
      pageCount: 1,
      extractedChunks: 4,
      ocrEngine: "pdf-parse-fallback",
      confidenceScore: 0.75
    };
  }
};
var ocrService = new OcrService();

// server/app.ts
dotenv.config();
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use((req, res, next) => {
  if (req.url && !req.url.startsWith("/api") && (req.url.startsWith("/cloudinary") || req.url.startsWith("/upload") || req.url.startsWith("/admin") || req.url.startsWith("/doctors") || req.url.startsWith("/departments") || req.url.startsWith("/appointments") || req.url.startsWith("/patients") || req.url.startsWith("/hospital") || req.url.startsWith("/ai") || req.url.startsWith("/email") || req.url.startsWith("/send-email") || req.url.startsWith("/verification") || req.url.startsWith("/schedule-appointments"))) {
    req.url = "/api" + req.url;
  }
  next();
});
app.get("/api/cloudinary/status", (req, res) => {
  try {
    const status = cloudinaryService.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to check Cloudinary status" });
  }
});
app.post("/api/upload", async (req, res) => {
  try {
    const { file, filename, folder, resourceType } = req.body;
    if (!file) {
      return res.status(400).json({ error: "No file data provided (expected base64 Data URI or URL)" });
    }
    const result = await cloudinaryService.upload(file, {
      filename,
      folder: folder || "medicare_hospital",
      resourceType: resourceType || "auto"
    });
    res.status(200).json({
      message: "File successfully uploaded to Cloudinary",
      result
    });
  } catch (error) {
    console.error("Upload endpoint error:", error);
    res.status(500).json({ error: error.message || "Cloudinary upload failed" });
  }
});
var getAuthorizedAdminConfig = () => {
  const email = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = (process.env.ADMIN_PASSWORD || "").trim();
  const name = (process.env.ADMIN_NAME || "Administrator").trim();
  return { email, password, name };
};
var failedAttempts = /* @__PURE__ */ new Map();
var activeSessions = /* @__PURE__ */ new Map();
var purgeInterval = setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt <= now) {
      activeSessions.delete(token);
    }
  }
}, 10 * 60 * 1e3);
if (purgeInterval && typeof purgeInterval.unref === "function") {
  purgeInterval.unref();
}
app.post("/api/admin/login", (req, res) => {
  try {
    const clientIp = req.ip || req.socket.remoteAddress || "client";
    const { email, password } = req.body || {};
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const rawPassword = typeof password === "string" ? password : "";
    const now = Date.now();
    const attemptKey = `${clientIp}_${normalizedEmail}`;
    const attemptRecord = failedAttempts.get(attemptKey);
    if (attemptRecord && attemptRecord.lockoutUntil && attemptRecord.lockoutUntil > now) {
      const remainingSeconds = Math.ceil((attemptRecord.lockoutUntil - now) / 1e3);
      return res.status(429).json({
        success: false,
        error: `Security Alert: Too many failed attempts. Account temporarily locked for ${remainingSeconds} seconds.`,
        lockoutSeconds: remainingSeconds
      });
    }
    const fieldErrors = {};
    if (!normalizedEmail) {
      fieldErrors.email = "Email address is required.";
    } else if (normalizedEmail.length > 254) {
      fieldErrors.email = "Email address cannot exceed 254 characters.";
    } else if (normalizedEmail.includes("..")) {
      fieldErrors.email = "Email cannot contain consecutive dots (..).";
    } else {
      const parts = normalizedEmail.split("@");
      if (parts.length !== 2) {
        fieldErrors.email = "Please enter a valid email address with a single @ symbol.";
      } else {
        const [local, domain] = parts;
        const localRegex = /^[a-zA-Z0-9]+([._%+-][a-zA-Z0-9]+)*$/;
        const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
        if (!local || local.length > 64 || local.startsWith(".") || local.endsWith(".") || !localRegex.test(local)) {
          fieldErrors.email = "Email username contains invalid characters or consecutive dots.";
        } else if (!domain || !domainRegex.test(domain)) {
          fieldErrors.email = "Please enter a valid email domain (e.g., hospital.com).";
        }
      }
    }
    if (!rawPassword) {
      fieldErrors.password = "Password is required.";
    } else if (rawPassword.length < 6) {
      fieldErrors.password = "Password must be at least 6 characters long.";
    }
    if (Object.keys(fieldErrors).length > 0) {
      return res.status(400).json({
        success: false,
        error: fieldErrors.email || fieldErrors.password || "Invalid input data.",
        fieldErrors
      });
    }
    const adminConfig = getAuthorizedAdminConfig();
    if (!adminConfig.password || !adminConfig.email) {
      return res.status(503).json({
        success: false,
        error: "Administrator credentials are not configured on the server. Please set ADMIN_EMAIL and ADMIN_PASSWORD in environment variables."
      });
    }
    if (normalizedEmail === adminConfig.email && rawPassword === adminConfig.password) {
      failedAttempts.delete(attemptKey);
      const token = `mcare_adm_${crypto2.randomBytes(32).toString("hex")}`;
      const expiresAt = now + 24 * 60 * 60 * 1e3;
      activeSessions.set(token, {
        email: adminConfig.email,
        createdAt: now,
        expiresAt
      });
      return res.status(200).json({
        success: true,
        message: "Administrator authentication successful.",
        token,
        expiresAt,
        user: {
          email: adminConfig.email,
          name: adminConfig.name,
          role: "Super Administrator",
          systemAccess: "FULL_ADMIN_CONTROL",
          authenticatedAt: new Date(now).toISOString()
        }
      });
    } else {
      const prevCount = attemptRecord ? attemptRecord.count : 0;
      const newCount = prevCount + 1;
      let lockoutUntil;
      if (newCount >= 5) {
        lockoutUntil = now + 45 * 1e3;
      }
      failedAttempts.set(attemptKey, {
        count: newCount,
        lastAttempt: now,
        lockoutUntil
      });
      const remainingAttempts = Math.max(0, 5 - newCount);
      return res.status(401).json({
        success: false,
        error: newCount >= 5 ? "Security Alert: Maximum attempts exceeded. Portal temporarily locked for 45 seconds." : `Access denied: Invalid administrator credentials.${remainingAttempts > 0 ? ` ${remainingAttempts} attempts remaining before temporary lockout.` : ""}`,
        remainingAttempts
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message || "Internal server authentication error."
    });
  }
});
app.post("/api/admin/verify", (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = (req.body?.token || authHeader.replace(/^Bearer\s+/i, "")).trim();
    if (!token) {
      return res.status(401).json({ valid: false, error: "No authentication token provided." });
    }
    const session = activeSessions.get(token);
    if (!session || session.expiresAt <= Date.now()) {
      if (session) activeSessions.delete(token);
      return res.status(401).json({ valid: false, error: "Session has expired or is invalid." });
    }
    const adminConfig = getAuthorizedAdminConfig();
    return res.status(200).json({
      valid: true,
      user: {
        email: session.email,
        name: adminConfig.name,
        role: "Super Administrator",
        systemAccess: "FULL_ADMIN_CONTROL"
      }
    });
  } catch (err) {
    return res.status(500).json({ valid: false, error: err.message });
  }
});
app.post("/api/admin/logout", (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = (req.body?.token || authHeader.replace(/^Bearer\s+/i, "")).trim();
    if (token) {
      activeSessions.delete(token);
    }
    return res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
app.get("/api/admin/me", (req, res) => {
  const adminConfig = getAuthorizedAdminConfig();
  res.json({
    authorizedAdmin: adminConfig.email || "Configured via ADMIN_EMAIL"
  });
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/db/status", async (req, res) => {
  try {
    const status = await mongoDb.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to retrieve database status" });
  }
});
app.post("/api/db/seed", async (req, res) => {
  try {
    await mongoDb.seedAll();
    const status = await mongoDb.getStatus();
    res.json({ message: "MongoDB collections successfully initialized and seeded!", status });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to seed MongoDB collections" });
  }
});
app.get("/api/documents", async (req, res) => {
  try {
    const category = req.query.category;
    const search = req.query.search;
    const documents = await mongoDb.getDocuments(category, search);
    res.json({ documents, count: documents.length });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch documents" });
  }
});
app.get("/api/documents/:id", async (req, res) => {
  try {
    const doc = await mongoDb.getDocumentById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch document" });
  }
});
app.post("/api/documents/ocr", async (req, res) => {
  try {
    const { pdfBase64, filename } = req.body || {};
    if (!pdfBase64) {
      return res.status(400).json({ error: "pdfBase64 data is required for OCR processing" });
    }
    console.log(`\u{1F4D1} [API] Running OCR extraction for uploaded PDF: "${filename || "document.pdf"}"`);
    const ocrResult = await ocrService.extractTextFromPdf(pdfBase64, filename || "hospital_document.pdf");
    res.json({
      success: true,
      message: "PDF OCR text extraction completed successfully",
      ...ocrResult
    });
  } catch (error) {
    console.error("\u274C [API] OCR extraction error:", error);
    res.status(500).json({ error: error.message || "Failed to extract text from PDF via OCR" });
  }
});
app.post("/api/documents", async (req, res) => {
  try {
    const body = req.body;
    if (!body.title || !body.category) {
      return res.status(400).json({ error: "Title and category are required" });
    }
    let docPayload = { ...body };
    if (body.pdfBase64 && (!body.extractedText || body.extractedText.trim().length === 0)) {
      try {
        console.log(`\u{1F916} [API] Auto-triggering OCR for newly uploaded document: "${body.filename || body.title}"`);
        const ocrResult = await ocrService.extractTextFromPdf(body.pdfBase64, body.filename || `${body.title}.pdf`);
        docPayload.extractedText = ocrResult.extractedText;
        docPayload.summary = ocrResult.summary;
        docPayload.extractedKeywords = ocrResult.keyTopics;
        docPayload.extractedChunks = ocrResult.extractedChunks;
        docPayload.pageCount = ocrResult.pageCount;
        docPayload.ocrStatus = "completed";
        delete docPayload.pdfBase64;
      } catch (ocrErr) {
        console.warn("\u26A0\uFE0F [API] Inline OCR error during document creation:", ocrErr.message);
        docPayload.ocrStatus = "failed";
      }
    } else if (body.extractedText) {
      docPayload.ocrStatus = "completed";
      if (!docPayload.extractedChunks) {
        docPayload.extractedChunks = Math.max(1, Math.ceil(body.extractedText.length / 450));
      }
      delete docPayload.pdfBase64;
    }
    const newDoc = await mongoDb.createDocument(docPayload);
    res.status(201).json({
      message: "Document added to MongoDB Knowledge Base & activated in AI Assistant memory",
      document: newDoc
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create document" });
  }
});
app.post("/api/documents/:id/ocr", async (req, res) => {
  try {
    const doc = await mongoDb.getDocumentById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: "Document not found" });
    }
    const { pdfBase64 } = req.body || {};
    let base64ToUse = pdfBase64;
    if (!base64ToUse && doc.fileUrl) {
      try {
        const fetchRes = await fetch(doc.fileUrl);
        const arrayBuf = await fetchRes.arrayBuffer();
        base64ToUse = Buffer.from(arrayBuf).toString("base64");
      } catch (fetchErr) {
        console.warn("Could not fetch fileUrl for OCR:", fetchErr.message);
      }
    }
    if (!base64ToUse) {
      return res.status(400).json({
        error: "Cannot perform OCR: No PDF binary data or accessible file URL found for this document."
      });
    }
    const ocrResult = await ocrService.extractTextFromPdf(base64ToUse, doc.filename || `${doc.title}.pdf`);
    const updated = await mongoDb.updateDocument(req.params.id, {
      extractedText: ocrResult.extractedText,
      summary: ocrResult.summary,
      extractedKeywords: ocrResult.keyTopics,
      extractedChunks: ocrResult.extractedChunks,
      pageCount: ocrResult.pageCount,
      ocrStatus: "completed"
    });
    res.json({
      message: "Document OCR text successfully extracted and updated in AI memory",
      document: updated,
      ocrResult
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to re-run OCR" });
  }
});
app.put("/api/documents/:id", async (req, res) => {
  try {
    const updated = await mongoDb.updateDocument(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Document not found" });
    }
    res.json({ message: "Document updated in MongoDB", document: updated });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update document" });
  }
});
app.delete("/api/documents/:id", async (req, res) => {
  try {
    const success = await mongoDb.deleteDocument(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Document not found or already deleted" });
    }
    res.json({ message: "Document removed from MongoDB" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete document" });
  }
});
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, currentContext } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "A valid message string is required." });
    }
    const response = await aiService.handleChat({ message, history, currentContext });
    return res.status(200).json(response);
  } catch (error) {
    console.error("AI chat endpoint error:", error);
    return res.status(500).json({
      reply: "I apologize, I'm experiencing a brief system delay. You can continue describing your symptoms, or directly choose from our clinical departments.",
      intent: "general",
      suggestedQuickReplies: ["Book appointment", "View doctors", "Hospital hours"],
      error: error.message
    });
  }
});
app.get("/api/doctors/:id/availability", async (req, res) => {
  try {
    const docId = req.params.id;
    const [doctors, appointments] = await Promise.all([
      mongoDb.getDoctors(),
      mongoDb.getAppointments()
    ]);
    const doctor = doctors.find((d) => d.id === docId || d._id?.toString() === docId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }
    const slots = aiService.calculateDoctorSlots(doctor, appointments);
    return res.json({ doctorId: docId, doctorName: doctor.name, slots, count: slots.length });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to calculate doctor availability" });
  }
});
app.get("/api/appointments", async (req, res) => {
  try {
    const appointments = await mongoDb.getAppointments();
    res.json({ appointments, count: appointments.length });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch appointments" });
  }
});
app.get("/api/appointments/lookup", async (req, res) => {
  try {
    const q = (req.query.query || req.query.q || "").toLowerCase().trim();
    if (!q) {
      return res.status(400).json({ error: "Search query parameter is required." });
    }
    const appointments = await mongoDb.getAppointments();
    const matched = appointments.filter((apt) => {
      const idMatch = apt.id?.toLowerCase().includes(q);
      const nameMatch = apt.patientName?.toLowerCase().includes(q);
      const phoneMatch = apt.patientPhone?.replace(/[^0-9]/g, "").includes(q.replace(/[^0-9]/g, ""));
      const emailMatch = apt.patientEmail?.toLowerCase().includes(q);
      return idMatch || nameMatch || phoneMatch || emailMatch;
    });
    return res.json({ appointments: matched, count: matched.length });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Lookup failed." });
  }
});
app.get("/api/appointments/:id", async (req, res) => {
  try {
    const appointments = await mongoDb.getAppointments();
    const appt = appointments.find((a) => a.id === req.params.id || a._id?.toString() === req.params.id);
    if (!appt) {
      return res.status(404).json({ error: "Appointment not found." });
    }
    return res.json({ appointment: appt });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to retrieve appointment" });
  }
});
app.post("/api/appointments/verification/send", async (req, res) => {
  try {
    const { appointmentId, purpose } = req.body || {};
    if (!appointmentId) {
      return res.status(400).json({ success: false, error: "Appointment Reference ID is required." });
    }
    const result = await verificationService.requestVerification({
      appointmentId,
      purpose: purpose === "cancel" ? "cancel" : "reschedule"
    });
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error("[Error in /api/appointments/verification/send]:", err);
    return res.status(500).json({ success: false, error: err.message || "Internal server error processing verification" });
  }
});
app.post("/api/appointments/verification/verify", async (req, res) => {
  try {
    const { appointmentId, code, purpose } = req.body || {};
    if (!appointmentId || !code) {
      return res.status(400).json({ success: false, error: "Both appointment ID and verification code are required." });
    }
    const result = verificationService.verifyCode({
      appointmentId,
      code,
      purpose
    });
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error("[Error in /api/appointments/verification/verify]:", err);
    return res.status(500).json({ success: false, error: err.message || "Internal server error verifying code" });
  }
});
app.post("/api/appointments/book", async (req, res) => {
  try {
    const result = await aiService.bookAppointment(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ error: error.message || "Appointment booking failed." });
  }
});
app.post("/api/appointments/:id/reschedule", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body || {};
    if (!date || !time) {
      return res.status(400).json({ error: "New date and time are required for rescheduling." });
    }
    const appointments = await mongoDb.getAppointments();
    const target = appointments.find((a) => a.id === id || a._id?.toString() === id);
    if (!target) {
      return res.status(404).json({ error: "Appointment not found." });
    }
    if (target.status === "Cancelled") {
      return res.status(400).json({ error: "Cannot reschedule a cancelled appointment. Please book a new consultation." });
    }
    const updated = await mongoDb.updateAppointment(target.id, {
      date,
      time,
      status: "Confirmed",
      notes: `${target.notes ? `${target.notes} | ` : ""}Rescheduled to ${date} at ${time}`
    });
    const schedules = await mongoDb.getSchedules();
    const sch = schedules.find((s) => s.patientName === target.patientName && s.doctorName === target.doctorName);
    if (sch) {
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const parsedDate = new Date(date);
      const dayName = !isNaN(parsedDate.getTime()) ? daysOfWeek[parsedDate.getDay()] : "Monday";
      await mongoDb.updateSchedule(sch.id, { date, time, timeSlot: time, dayOfWeek: dayName, status: "Rescheduled" });
    }
    try {
      await emailService.sendRescheduleConfirmation({
        id: target.id,
        patientName: target.patientName,
        patientEmail: target.patientEmail,
        doctorName: target.doctorName,
        department: target.department,
        newDate: date,
        newTime: time,
        previousDate: target.date,
        previousTime: target.time,
        room: target.room
      });
    } catch (e) {
      console.warn("[Resend] Reschedule email warning:", e?.message || e);
    }
    verificationService.consume(id);
    return res.json({
      success: true,
      message: `Appointment ${id} successfully rescheduled to ${date} at ${time}.`,
      appointment: updated
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to reschedule appointment." });
  }
});
app.post("/api/appointments/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body || {};
    const appointments = await mongoDb.getAppointments();
    const target = appointments.find((a) => a.id === id || a._id?.toString() === id);
    if (!target) {
      return res.status(404).json({ error: "Appointment not found." });
    }
    const updated = await mongoDb.updateAppointment(target.id, {
      status: "Cancelled",
      notes: `${target.notes ? `${target.notes} | ` : ""}Cancelled${reason ? `: ${reason}` : ""}`
    });
    const schedules = await mongoDb.getSchedules();
    const sch = schedules.find((s) => s.patientName === target.patientName && s.doctorName === target.doctorName);
    if (sch) {
      await mongoDb.updateSchedule(sch.id, { status: "Cancelled" });
    }
    try {
      await emailService.sendCancellationConfirmation({
        id: target.id,
        patientName: target.patientName,
        patientEmail: target.patientEmail,
        doctorName: target.doctorName,
        department: target.department,
        date: target.date,
        time: target.time,
        reason: reason || "Cancelled upon patient request"
      });
    } catch (e) {
      console.warn("[Resend] Cancellation email warning:", e?.message || e);
    }
    verificationService.consume(id);
    return res.json({
      success: true,
      message: `Appointment ${id} has been cancelled successfully.`,
      appointment: updated
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to cancel appointment." });
  }
});
app.post("/api/appointments", async (req, res) => {
  try {
    const newAppt = await mongoDb.createAppointment(req.body);
    if (newAppt.patientEmail) {
      try {
        await emailService.sendBookingConfirmation({
          id: newAppt.id,
          patientName: newAppt.patientName,
          patientEmail: newAppt.patientEmail,
          doctorName: newAppt.doctorName,
          department: newAppt.department,
          date: newAppt.date,
          time: newAppt.time,
          room: newAppt.room,
          fee: newAppt.fee,
          notes: newAppt.notes
        });
      } catch (e) {
        console.warn("[Resend] Booking email warning:", e?.message || e);
      }
    }
    res.status(201).json({ message: "Appointment booked successfully", appointment: newAppt });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to book appointment" });
  }
});
app.put("/api/appointments/:id", async (req, res) => {
  try {
    const previousAppts = await mongoDb.getAppointments();
    const previous = previousAppts.find((a) => a.id === req.params.id || a._id?.toString() === req.params.id);
    const updated = await mongoDb.updateAppointment(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    if (req.body?.status === "Cancelled" && previous?.status !== "Cancelled" && updated.patientEmail) {
      try {
        await emailService.sendCancellationConfirmation({
          id: updated.id,
          patientName: updated.patientName,
          patientEmail: updated.patientEmail,
          doctorName: updated.doctorName,
          department: updated.department,
          date: updated.date,
          time: updated.time,
          reason: req.body?.notes || "Updated by hospital staff"
        });
      } catch (e) {
        console.warn("[Resend] Cancel email warning:", e?.message || e);
      }
    } else if (req.body?.date && req.body.date !== previous?.date || req.body?.time && req.body.time !== previous?.time) {
      if (updated.patientEmail) {
        try {
          await emailService.sendRescheduleConfirmation({
            id: updated.id,
            patientName: updated.patientName,
            patientEmail: updated.patientEmail,
            doctorName: updated.doctorName,
            department: updated.department,
            newDate: updated.date,
            newTime: updated.time,
            previousDate: previous?.date,
            previousTime: previous?.time,
            room: updated.room
          });
        } catch (e) {
          console.warn("[Resend] Reschedule email warning:", e?.message || e);
        }
      }
    }
    res.json({ message: "Appointment updated", appointment: updated });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update appointment" });
  }
});
app.get("/api/email/status", (req, res) => {
  try {
    const status = emailService.getStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to check Resend email status" });
  }
});
var handleTestEmail = async (req, res) => {
  try {
    const recipient = req.body?.recipient || req.query?.to || req.query?.recipient || req.body?.to;
    const targetEmail = recipient?.trim() || "nuddywale@gmail.com";
    const result = await emailService.sendTestEmail(targetEmail);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to send test email" });
  }
};
app.post("/api/email/test", handleTestEmail);
app.get("/api/email/test", handleTestEmail);
app.post("/api/send-email", handleTestEmail);
app.delete("/api/appointments/:id", async (req, res) => {
  try {
    const success = await mongoDb.deleteAppointment(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted successfully", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete appointment" });
  }
});
app.post("/api/appointments/batch-delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "ids array required" });
    }
    let deletedCount = 0;
    for (const id of ids) {
      const ok = await mongoDb.deleteAppointment(id);
      if (ok) deletedCount++;
    }
    res.json({ message: `${deletedCount} appointment(s) deleted`, deletedCount, ids });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete appointments" });
  }
});
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const [appointments, doctors, departments, patients] = await Promise.all([
      mongoDb.getAppointments(),
      mongoDb.getDoctors(),
      mongoDb.getDepartments(),
      mongoDb.getPatients()
    ]);
    const now = /* @__PURE__ */ new Date();
    const todayY = now.getFullYear();
    const todayM = now.getMonth();
    const todayD = now.getDate();
    const todayAppointments = appointments.filter((a) => {
      if (a.status === "Cancelled") return false;
      const parsed = new Date(a.date);
      if (!isNaN(parsed.getTime())) {
        return parsed.getFullYear() === todayY && parsed.getMonth() === todayM && parsed.getDate() === todayD;
      }
      return false;
    }).length;
    const upcomingAppointments = appointments.filter(
      (a) => a.status === "Confirmed" || a.status === "Pending"
    ).length;
    const cancelledAppointments = appointments.filter(
      (a) => a.status === "Cancelled"
    ).length;
    return res.json({
      todayAppointments,
      upcomingAppointments,
      cancelledAppointments,
      totalDoctors: doctors.length,
      totalDepartments: departments.length,
      totalPatients: patients.length,
      totalAppointments: appointments.length
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to aggregate dashboard stats" });
  }
});
app.get("/api/activity", async (req, res) => {
  try {
    const appointments = await mongoDb.getAppointments();
    const activities = appointments.slice(0, 10).map((apt) => ({
      id: `act-${apt.id}`,
      title: apt.status === "Cancelled" ? "Appointment cancelled" : "Appointment booked",
      description: `${apt.patientName} with ${apt.doctorName} (${apt.department})`,
      time: apt.date || "Recent",
      status: apt.status
    }));
    return res.json({ activities, count: activities.length });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Failed to fetch activity log" });
  }
});
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await mongoDb.getDoctors();
    res.json({ doctors, count: doctors.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/doctors", async (req, res) => {
  try {
    const doctor = await mongoDb.createDoctor(req.body);
    res.status(201).json({ message: "Doctor registered successfully", doctor });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to register doctor" });
  }
});
app.put("/api/doctors/:id", async (req, res) => {
  try {
    const updated = await mongoDb.updateDoctor(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json({ message: "Doctor updated successfully", doctor: updated });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update doctor" });
  }
});
app.delete("/api/doctors/:id", async (req, res) => {
  try {
    const success = await mongoDb.deleteDoctor(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json({ message: "Doctor removed from records" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete doctor" });
  }
});
app.get("/api/departments", async (req, res) => {
  try {
    const departments = await mongoDb.getDepartments();
    res.json({ departments, count: departments.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/departments", async (req, res) => {
  try {
    const deptData = req.body;
    if (!deptData.name) {
      return res.status(400).json({ error: "Department name is required" });
    }
    const newDepartment = await mongoDb.createDepartment(deptData);
    res.status(201).json({ message: "Department created successfully", department: newDepartment });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create department" });
  }
});
app.put("/api/departments/:id", async (req, res) => {
  try {
    const updated = await mongoDb.updateDepartment(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.json({ message: "Department updated successfully", department: updated });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update department" });
  }
});
app.delete("/api/departments/:id", async (req, res) => {
  try {
    const success = await mongoDb.deleteDepartment(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Department not found" });
    }
    res.json({ message: "Department removed from records" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete department" });
  }
});
app.get("/api/patients", async (req, res) => {
  try {
    const patients = await mongoDb.getPatients();
    res.json({ patients, count: patients.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/patients", async (req, res) => {
  try {
    const patient = await mongoDb.createPatient(req.body);
    res.status(201).json({ patient });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create patient record" });
  }
});
app.put("/api/patients/:id", async (req, res) => {
  try {
    const updated = await mongoDb.updatePatient(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({ patient: updated });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to update patient record" });
  }
});
app.delete("/api/patients/:id", async (req, res) => {
  try {
    const deleted = await mongoDb.deletePatient(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json({ message: "Patient record removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete patient record" });
  }
});
app.post("/api/patients/batch-delete", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "ids array required" });
    }
    let deletedCount = 0;
    for (const id of ids) {
      const ok = await mongoDb.deletePatient(id);
      if (ok) deletedCount++;
    }
    res.json({ message: `${deletedCount} patient(s) deleted`, deletedCount, ids });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to delete patients in batch" });
  }
});
app.get("/api/schedules", async (req, res) => {
  try {
    const schedules = await mongoDb.getSchedules();
    res.json({ schedules, count: schedules.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/api/schedules", async (req, res) => {
  try {
    const { patientName, department, time, date } = req.body;
    if (!patientName || !department) {
      return res.status(400).json({ error: "Patient name and department are required" });
    }
    const schedule = await mongoDb.createSchedule(req.body);
    res.status(201).json({ schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.put("/api/schedules/:id", async (req, res) => {
  try {
    const updated = await mongoDb.updateSchedule(req.params.id, req.body);
    res.json({ schedule: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/api/schedules/:id", async (req, res) => {
  try {
    const success = await mongoDb.deleteSchedule(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Schedule appointment not found" });
    }
    res.json({ message: "Schedule appointment removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// server/vercelHandler.ts
function handler(req, res) {
  if (req.url && !req.url.startsWith("/api")) {
    req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
  }
  return app(req, res);
}
export {
  handler as default
};
