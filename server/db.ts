import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { INITIAL_KNOWLEDGE_DOCUMENTS } from '../src/data/knowledgeBaseData';
import { INITIAL_APPOINTMENTS } from '../src/data/appointmentsData';
import { INITIAL_ADMIN_DOCTORS } from '../src/data/doctorsData';
import { INITIAL_ADMIN_DEPARTMENTS } from '../src/data/departmentsData';
import { INITIAL_ADMIN_PATIENTS } from '../src/data/patientsData';
import { INITIAL_SCHEDULE_APPOINTMENTS } from '../src/data/schedulesData';

function buildEntityQuery(id: string) {
  if (ObjectId.isValid(id) && id.length === 24) {
    return {
      $or: [
        { id },
        { _id: new ObjectId(id) },
        { _id: id as any },
      ],
    };
  }
  return { id };
}

export interface DbStatus {
  connected: boolean;
  provider: 'mongodb' | 'memory-fallback';
  database: string;
  collections: {
    name: string;
    count: number;
  }[];
  connectionUri: string;
  lastConnectedAt?: string;
  error?: string;
}

class MongoDatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected: boolean = false;
  private connectionError: string | null = null;
  private lastConnectedAt: string | null = null;
  private initPromise: Promise<void> | null = null;

  // In-memory fallback stores populated with initial data
  private memoryStore = {
    documents: JSON.parse(JSON.stringify(INITIAL_KNOWLEDGE_DOCUMENTS)),
    appointments: JSON.parse(JSON.stringify(INITIAL_APPOINTMENTS)),
    doctors: JSON.parse(JSON.stringify(INITIAL_ADMIN_DOCTORS)),
    departments: JSON.parse(JSON.stringify(INITIAL_ADMIN_DEPARTMENTS)),
    patients: JSON.parse(JSON.stringify(INITIAL_ADMIN_PATIENTS)),
    schedules: JSON.parse(JSON.stringify(INITIAL_SCHEDULE_APPOINTMENTS)),
  };

  constructor() {
    // Non-blocking initialization
    this.initPromise = this.init();
  }

  public async init(): Promise<void> {
    const uri = process.env.MONGODB_URI?.trim();
    const dbName = process.env.MONGODB_DB_NAME?.trim() || 'medicare_db';

    if (!uri) {
      this.isConnected = false;
      this.connectionError = 'MONGODB_URI environment variable is not defined. Running in high-performance memory fallback mode.';
      console.log('ℹ️ [MongoDB] No MONGODB_URI found. Utilizing resilient in-memory collection store.');
      return;
    }

    try {
      console.log(`🔌 [MongoDB] Connecting to MongoDB instance for database: "${dbName}"...`);
      this.client = new MongoClient(uri, {
        serverSelectionTimeoutMS: 4000,
        connectTimeoutMS: 4000,
      });

      await this.client.connect();
      // Test ping
      await this.client.db(dbName).command({ ping: 1 });
      this.db = this.client.db(dbName);
      this.isConnected = true;
      this.connectionError = null;
      this.lastConnectedAt = new Date().toISOString();
      console.log(`✅ [MongoDB] Successfully connected to MongoDB database: "${dbName}"`);

      // Seed if collections are empty
      await this.autoSeedIfEmpty();
    } catch (err: any) {
      this.isConnected = false;
      this.connectionError = `MongoDB connection failed: ${err.message || err}. Reverting to local store.`;
      console.warn(`⚠️ [MongoDB] Connection warning: ${this.connectionError}`);
      if (this.client) {
        try {
          await this.client.close();
        } catch (_) {}
        this.client = null;
        this.db = null;
      }
    }
  }

  private async autoSeedIfEmpty(): Promise<void> {
    if (!this.db) return;

    try {
      const docCol = this.db.collection('documents');
      // Clean up any legacy mock documents in MongoDB if present
      await docCol.deleteMany({
        $or: [
          {
            id: {
              $in: [
                'kb-1', 'kb-2', 'kb-3', 'kb-4', 'kb-5', 'kb-6', 'kb-7', 'kb-8',
                'kb-9', 'kb-10', 'kb-11', 'kb-12', 'kb-13', 'kb-14', 'kb-15', 'kb-16',
                'kb-17', 'kb-18', 'kb-19', 'kb-20', 'kb-21', 'kb-22', 'kb-23', 'kb-24',
              ],
            },
          },
          { id: /^kb-[0-9]{1,2}$/ },
        ],
      });
      const docCount = await docCol.countDocuments();
      if (docCount === 0 && INITIAL_KNOWLEDGE_DOCUMENTS.length > 0) {
        console.log('🌱 [MongoDB] Seeding initial Knowledge Base documents collection...');
        await docCol.insertMany(INITIAL_KNOWLEDGE_DOCUMENTS as any);
      }

      const apptCol = this.db.collection('appointments');
      // Clean up any legacy mock appointments in MongoDB if present
      await apptCol.deleteMany({
        id: { $in: ['APT-2025-089', 'APT-2025-090', 'APT-2025-091', 'APT-2025-092', 'APT-2025-093', 'APT-2025-094', 'APT-2025-095', 'APT-2025-096', 'APT-2025-097', 'APT-2025-098', 'APT-2025-099', 'APT-2025-100'] }
      });
      const apptCount = await apptCol.countDocuments();
      if (apptCount === 0 && INITIAL_APPOINTMENTS.length > 0) {
        console.log('🌱 [MongoDB] Seeding initial Appointments collection...');
        await apptCol.insertMany(INITIAL_APPOINTMENTS as any);
      }

      const docStaffCol = this.db.collection('doctors');
      // Clean up legacy mock doctors in MongoDB if present
      await docStaffCol.deleteMany({
        id: {
          $in: [
            'DOC-001', 'DOC-002', 'DOC-003', 'DOC-004', 'DOC-005', 'DOC-006', 'DOC-007', 'DOC-008', 'DOC-009',
            'DOC-010', 'DOC-011', 'DOC-012', 'DOC-013', 'DOC-014', 'DOC-015', 'DOC-016', 'DOC-017', 'DOC-018',
            'DOC-019', 'DOC-020', 'DOC-021', 'DOC-022', 'DOC-023', 'DOC-024', 'DOC-025', 'DOC-026', 'DOC-027'
          ]
        }
      });
      const docStaffCount = await docStaffCol.countDocuments();
      if (docStaffCount === 0 && INITIAL_ADMIN_DOCTORS.length > 0) {
        console.log('🌱 [MongoDB] Seeding initial Doctors collection...');
        await docStaffCol.insertMany(INITIAL_ADMIN_DOCTORS as any);
      }

      const deptCol = this.db.collection('departments');
      // Clean up legacy mock departments in MongoDB if present
      await deptCol.deleteMany({
        id: {
          $in: [
            'dept-gen-med', 'dept-cardio', 'dept-derm', 'dept-peds', 'dept-gyn',
            'dept-ortho', 'dept-rad', 'dept-onco', 'dept-ent', 'dept-uro',
            'dept-gastro', 'dept-mental'
          ]
        }
      });
      const deptCount = await deptCol.countDocuments();
      if (deptCount === 0 && INITIAL_ADMIN_DEPARTMENTS.length > 0) {
        console.log('🌱 [MongoDB] Seeding initial Departments collection...');
        await deptCol.insertMany(INITIAL_ADMIN_DEPARTMENTS as any);
      }

      const patCol = this.db.collection('patients');
      // Purge any legacy mock patients from database
      const mockPatientNames = [
        'Amara Okafor',
        'Chinedu Okafor',
        'Blessing Adeyemi',
        'Emeka Nwosu',
        'Aisha Bello',
        'Tunde Ibrahim',
        'Fatima Yusuf',
        'Babatunde Lawal',
        'Ngozi Eze',
        'Ifeanyi Okeleke',
        'Chinmaka Joseph'
      ];
      await patCol.deleteMany({
        $or: [
          { id: { $in: ['pat-1', 'pat-2', 'pat-3', 'pat-4', 'pat-5', 'pat-6', 'pat-7', 'pat-8', 'pat-9', 'pat-10'] } },
          { name: { $in: mockPatientNames } },
          { name: { $regex: 'Amara Okafor', $options: 'i' } }
        ]
      });
      const patCount = await patCol.countDocuments();
      if (patCount === 0 && INITIAL_ADMIN_PATIENTS.length > 0) {
        console.log('🌱 [MongoDB] Seeding initial Patients collection...');
        await patCol.insertMany(INITIAL_ADMIN_PATIENTS as any);
      }

      const schCol = this.db.collection('schedules');
      // Purge legacy mock schedule records from MongoDB
      await schCol.deleteMany({
        $or: [
          { id: { $regex: '^sch-(mon|tue|wed|thu|fri|sat|sun)' } },
          { id: { $in: ['sch-1', 'sch-2', 'sch-3', 'sch-4'] } },
          { patientName: { $in: ['Amara Okafor', 'Chinedu Okafor', 'Fatima Yusuf', 'Babajide Sanwo', 'Amina Bello', 'Emeka Nwosu', 'Zainab Aliyu', 'Oluwaseun Adeleke', 'Blessing Adebayo'] } },
          { patientName: { $regex: 'Amara Okafor', $options: 'i' } },
        ],
      });
      const schCount = await schCol.countDocuments();
      if (schCount === 0 && INITIAL_SCHEDULE_APPOINTMENTS.length > 0) {
        console.log('🌱 [MongoDB] Seeding initial Schedules collection...');
        await schCol.insertMany(INITIAL_SCHEDULE_APPOINTMENTS as any);
      }
    } catch (error) {
      console.error('❌ [MongoDB] Auto-seeding error:', error);
    }
  }

  public async seedAll(): Promise<void> {
    if (this.isConnected && this.db) {
      const collections = [
        { name: 'documents', data: INITIAL_KNOWLEDGE_DOCUMENTS },
        { name: 'appointments', data: INITIAL_APPOINTMENTS },
        { name: 'doctors', data: INITIAL_ADMIN_DOCTORS },
        { name: 'departments', data: INITIAL_ADMIN_DEPARTMENTS },
        { name: 'patients', data: INITIAL_ADMIN_PATIENTS },
        { name: 'schedules', data: INITIAL_SCHEDULE_APPOINTMENTS },
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
        schedules: JSON.parse(JSON.stringify(INITIAL_SCHEDULE_APPOINTMENTS)),
      };
    }
  }

  public async getStatus(): Promise<DbStatus> {
    if (this.initPromise) {
      await this.initPromise;
    }

    const dbName = process.env.MONGODB_DB_NAME || 'medicare_db';
    const uri = process.env.MONGODB_URI || '';
    const maskedUri = uri
      ? uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
      : 'Not configured (Set MONGODB_URI in Settings/.env)';

    if (this.isConnected && this.db) {
      try {
        const collections = ['documents', 'appointments', 'doctors', 'departments', 'patients', 'schedules'];
        const collectionStats = await Promise.all(
          collections.map(async (name) => {
            const count = await this.db!.collection(name).countDocuments();
            return { name, count };
          })
        );

        return {
          connected: true,
          provider: 'mongodb',
          database: dbName,
          collections: collectionStats,
          connectionUri: maskedUri,
          lastConnectedAt: this.lastConnectedAt || undefined,
        };
      } catch (err: any) {
        this.isConnected = false;
        this.connectionError = err.message;
      }
    }

    return {
      connected: false,
      provider: 'memory-fallback',
      database: dbName,
      collections: [
        { name: 'documents', count: this.memoryStore.documents.length },
        { name: 'appointments', count: this.memoryStore.appointments.length },
        { name: 'doctors', count: this.memoryStore.doctors.length },
        { name: 'departments', count: this.memoryStore.departments.length },
        { name: 'patients', count: this.memoryStore.patients.length },
        { name: 'schedules', count: this.memoryStore.schedules.length },
      ],
      connectionUri: maskedUri,
      error: this.connectionError || 'No MONGODB_URI provided. Running on responsive in-memory MongoDB fallback.',
    };
  }

  // --- Knowledge Base Documents ---
  public async getDocuments(category?: string, query?: string): Promise<any[]> {
    if (this.isConnected && this.db) {
      const filter: any = {};
      if (category && category !== 'All Categories') {
        filter.category = category;
      }
      if (query && query.trim()) {
        const regex = new RegExp(query.trim(), 'i');
        filter.$or = [
          { title: regex },
          { filename: regex },
          { category: regex },
          { 'uploadedBy.name': regex },
          { extractedText: regex },
          { summary: regex },
          { extractedKeywords: regex },
        ];
      }
      const docs = await this.db.collection('documents').find(filter).sort({ _id: -1 }).toArray();
      return docs.map((d: any) => ({ ...d, id: d.id || d._id.toString() }));
    }

    let results = [...this.memoryStore.documents];
    if (category && category !== 'All Categories') {
      results = results.filter((d) => d.category === category);
    }
    if (query && query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.filename.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.uploadedBy.name.toLowerCase().includes(q) ||
          (d.extractedText && d.extractedText.toLowerCase().includes(q)) ||
          (d.summary && d.summary.toLowerCase().includes(q)) ||
          (d.extractedKeywords && d.extractedKeywords.some((k: string) => k.toLowerCase().includes(q)))
      );
    }
    return results;
  }

  public async getDocumentById(id: string): Promise<any | null> {
    if (this.isConnected && this.db) {
      const doc = await this.db.collection('documents').findOne({
        $or: [{ id }, { _id: id as any }],
      });
      return doc ? { ...doc, id: doc.id || doc._id.toString() } : null;
    }
    return this.memoryStore.documents.find((d) => d.id === id) || null;
  }

  public async createDocument(docData: any): Promise<any> {
    const id = docData.id || `kb-${Date.now()}`;
    const newDoc = {
      ...docData,
      id,
      dateAdded: docData.dateAdded || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeAdded: docData.timeAdded || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: docData.status || 'Active',
    };

    if (this.isConnected && this.db) {
      const result = await this.db.collection('documents').insertOne(newDoc);
      return { ...newDoc, _id: result.insertedId };
    }

    this.memoryStore.documents.unshift(newDoc);
    return newDoc;
  }

  public async updateDocument(id: string, updates: any): Promise<any | null> {
    const { _id, ...safeUpdates } = updates;
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection('documents').findOneAndUpdate(
        query,
        { $set: safeUpdates },
        { returnDocument: 'after' }
      );
      if (!res) return null;
      return { ...res, id: res.id || res._id.toString() };
    }

    const index = this.memoryStore.documents.findIndex((d) => d.id === id);
    if (index === -1) return null;
    this.memoryStore.documents[index] = { ...this.memoryStore.documents[index], ...safeUpdates };
    return this.memoryStore.documents[index];
  }

  public async deleteDocument(id: string): Promise<boolean> {
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection('documents').deleteOne(query);
      return res.deletedCount > 0;
    }

    const prevLength = this.memoryStore.documents.length;
    this.memoryStore.documents = this.memoryStore.documents.filter((d) => d.id !== id);
    return this.memoryStore.documents.length < prevLength;
  }

  // --- Appointments ---
  public async getAppointments(): Promise<any[]> {
    if (this.isConnected && this.db) {
      const appts = await this.db.collection('appointments').find({}).sort({ _id: -1 }).toArray();
      return appts.map((a: any) => ({ ...a, id: a.id || a._id.toString() }));
    }
    return this.memoryStore.appointments;
  }

  public async createAppointment(apptData: any): Promise<any> {
    const id = apptData.id || `APT-${Date.now()}`;
    const newAppt = { ...apptData, id };
    if (this.isConnected && this.db) {
      const result = await this.db.collection('appointments').insertOne(newAppt);
      return { ...newAppt, _id: result.insertedId };
    }
    this.memoryStore.appointments.unshift(newAppt);
    return newAppt;
  }

  public async updateAppointment(id: string, updates: any): Promise<any | null> {
    const { _id, ...safeUpdates } = updates;
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection('appointments').findOneAndUpdate(
        query,
        { $set: safeUpdates },
        { returnDocument: 'after' }
      );
      return res ? { ...res, id: res.id || res._id.toString() } : null;
    }

    const index = this.memoryStore.appointments.findIndex((a) => a.id === id);
    if (index === -1) return null;
    this.memoryStore.appointments[index] = { ...this.memoryStore.appointments[index], ...safeUpdates };
    return this.memoryStore.appointments[index];
  }

  public async deleteAppointment(id: string): Promise<boolean> {
    const cleanId = (id || '').trim();
    if (!cleanId) return false;

    if (this.isConnected && this.db) {
      const query = {
        $or: [
          { id: cleanId },
          { id: cleanId.toUpperCase() },
          { id: cleanId.toLowerCase() },
          ...(ObjectId.isValid(cleanId) && cleanId.length === 24
            ? [{ _id: new ObjectId(cleanId) }, { _id: cleanId as any }]
            : []),
        ],
      };
      const res = await this.db.collection('appointments').deleteOne(query);
      return res.deletedCount > 0;
    }
    const prev = this.memoryStore.appointments.length;
    this.memoryStore.appointments = this.memoryStore.appointments.filter(
      (a) =>
        a.id !== cleanId &&
        a.id?.toUpperCase() !== cleanId.toUpperCase() &&
        (a as any)._id !== cleanId
    );
    return this.memoryStore.appointments.length < prev;
  }

  // --- Doctors, Departments, Patients, Schedules ---
  public async getDoctors(): Promise<any[]> {
    if (this.isConnected && this.db) {
      const docs = await this.db.collection('doctors').find({}).sort({ _id: -1 }).toArray();
      return docs.map((d: any) => ({ ...d, id: d.id || d._id.toString() }));
    }
    return this.memoryStore.doctors;
  }

  public async createDoctor(doctorData: any): Promise<any> {
    const id = doctorData.id || `DOC-${Date.now()}`;
    const newDoc = { ...doctorData, id };
    if (this.isConnected && this.db) {
      const result = await this.db.collection('doctors').insertOne(newDoc);
      return { ...newDoc, _id: result.insertedId };
    }
    this.memoryStore.doctors.unshift(newDoc);
    return newDoc;
  }

  public async updateDoctor(id: string, updates: any): Promise<any | null> {
    const { _id, ...safeUpdates } = updates;
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection('doctors').findOneAndUpdate(
        query,
        { $set: safeUpdates },
        { returnDocument: 'after' }
      );
      return res ? { ...res, id: res.id || res._id.toString() } : null;
    }

    const index = this.memoryStore.doctors.findIndex((d) => d.id === id);
    if (index === -1) return null;
    this.memoryStore.doctors[index] = { ...this.memoryStore.doctors[index], ...safeUpdates };
    return this.memoryStore.doctors[index];
  }

  public async deleteDoctor(id: string): Promise<boolean> {
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection('doctors').deleteOne(query);
      return res.deletedCount > 0;
    }
    const prev = this.memoryStore.doctors.length;
    this.memoryStore.doctors = this.memoryStore.doctors.filter((d) => d.id !== id);
    return this.memoryStore.doctors.length < prev;
  }

  public async getDepartments(): Promise<any[]> {
    let depts: any[] = [];
    if (this.isConnected && this.db) {
      const rawDepts = await this.db.collection('departments').find({}).toArray();
      depts = rawDepts.map((d: any) => ({ ...d, id: d.id || d._id.toString() }));
    } else {
      depts = this.memoryStore.departments;
    }

    const doctors = await this.getDoctors();
    return depts.map((dept: any) => {
      const deptNameNorm = (dept.name || '').trim().toLowerCase();
      const count = doctors.filter((doc: any) => {
        const docDeptNorm = (doc.department || '').trim().toLowerCase();
        const isNameMatch = docDeptNorm.length > 0 && docDeptNorm === deptNameNorm;
        const isIdMatch = Boolean(dept.id && doc.departmentId && doc.departmentId === dept.id);
        const isHeadDoc = Boolean(
          dept.headDoctor?.id &&
          dept.headDoctor.id !== 'unassigned' &&
          dept.headDoctor.id === doc.id
        );
        return isNameMatch || isIdMatch || isHeadDoc;
      }).length;

      return {
        ...dept,
        totalDoctors: count,
      };
    });
  }

  public async createDepartment(deptData: any): Promise<any> {
    const id = deptData.id || `dept-${Date.now()}`;
    const slug = deptData.slug || deptData.name?.toLowerCase().replace(/\s+/g, '-') || `dept-${Date.now()}`;
    const createdAt = deptData.createdAt || new Date().toISOString().split('T')[0];
    const newDept = { ...deptData, id, slug, createdAt };

    if (this.isConnected && this.db) {
      const result = await this.db.collection('departments').insertOne(newDept);
      const inserted = { ...newDept, _id: result.insertedId };
      const doctors = await this.getDoctors();
      const deptNameNorm = (inserted.name || '').trim().toLowerCase();
      const count = doctors.filter((doc: any) => {
        const docDeptNorm = (doc.department || '').trim().toLowerCase();
        return (
          (docDeptNorm && docDeptNorm === deptNameNorm) ||
          (inserted.id && doc.departmentId === inserted.id) ||
          (inserted.headDoctor?.id && inserted.headDoctor.id !== 'unassigned' && inserted.headDoctor.id === doc.id)
        );
      }).length;
      return { ...inserted, totalDoctors: count };
    }

    this.memoryStore.departments.unshift(newDept);
    const doctors = await this.getDoctors();
    const deptNameNorm = (newDept.name || '').trim().toLowerCase();
    const count = doctors.filter((doc: any) => {
      const docDeptNorm = (doc.department || '').trim().toLowerCase();
      return (
        (docDeptNorm && docDeptNorm === deptNameNorm) ||
        (newDept.id && doc.departmentId === newDept.id) ||
        (newDept.headDoctor?.id && newDept.headDoctor.id !== 'unassigned' && newDept.headDoctor.id === doc.id)
      );
    }).length;
    return { ...newDept, totalDoctors: count };
  }

  public async updateDepartment(id: string, updates: any): Promise<any | null> {
    const { _id, ...safeUpdates } = updates;
    let updatedDept: any = null;
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection('departments').findOneAndUpdate(
        query,
        { $set: safeUpdates },
        { returnDocument: 'after' }
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
    const deptNameNorm = (updatedDept.name || '').trim().toLowerCase();
    const count = doctors.filter((doc: any) => {
      const docDeptNorm = (doc.department || '').trim().toLowerCase();
      return (
        (docDeptNorm && docDeptNorm === deptNameNorm) ||
        (updatedDept.id && doc.departmentId === updatedDept.id) ||
        (updatedDept.headDoctor?.id && updatedDept.headDoctor.id !== 'unassigned' && updatedDept.headDoctor.id === doc.id)
      );
    }).length;
    return { ...updatedDept, totalDoctors: count };
  }

  public async deleteDepartment(id: string): Promise<boolean> {
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection('departments').deleteOne(query);
      return res.deletedCount > 0;
    }
    const prev = this.memoryStore.departments.length;
    this.memoryStore.departments = this.memoryStore.departments.filter((d) => d.id !== id);
    return this.memoryStore.departments.length < prev;
  }

  public async getPatients(): Promise<any[]> {
    if (this.isConnected && this.db) {
      const pats = await this.db.collection('patients').find({}).sort({ _id: -1 }).toArray();
      return pats.map((p: any) => ({ ...p, id: p.id || p._id.toString() }));
    }
    return this.memoryStore.patients;
  }

  public async createPatient(patientData: any): Promise<any> {
    const timestamp = Date.now();
    const id = patientData.id || `pat-${timestamp}`;
    
    // Generate next patientId if not provided e.g. PAT-0001
    let patientId = patientData.patientId;
    if (!patientId) {
      let count = 0;
      if (this.isConnected && this.db) {
        count = await this.db.collection('patients').countDocuments();
      } else {
        count = this.memoryStore.patients.length;
      }
      patientId = `PAT-${(count + 1).toString().padStart(4, '0')}`;
    }

    const newPatient = {
      ...patientData,
      id,
      patientId,
      registrationDate: patientData.registrationDate || new Date().toISOString().split('T')[0],
      createdAt: patientData.createdAt || new Date().toISOString(),
      recentActivityTime: patientData.recentActivityTime || 'Just now',
    };

    if (this.isConnected && this.db) {
      const res = await this.db.collection('patients').insertOne(newPatient);
      return { ...newPatient, _id: res.insertedId.toString() };
    }

    this.memoryStore.patients.unshift(newPatient);
    return newPatient;
  }

  public async updatePatient(id: string, updateData: any): Promise<any> {
    if (this.isConnected && this.db) {
      const col = this.db.collection('patients');
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

  public async deletePatient(id: string): Promise<boolean> {
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection('patients').deleteOne(query);
      return res.deletedCount > 0;
    }
    const prev = this.memoryStore.patients.length;
    this.memoryStore.patients = this.memoryStore.patients.filter((p) => p.id !== id);
    return this.memoryStore.patients.length < prev;
  }

  public async getSchedules(): Promise<any[]> {
    if (this.isConnected && this.db) {
      const schs = await this.db.collection('schedules').find({}).toArray();
      return schs.map((s: any) => ({ ...s, id: s.id || s._id.toString() }));
    }
    return this.memoryStore.schedules;
  }

  public async createSchedule(data: any): Promise<any> {
    const id = data.id || `sch-${Date.now()}`;
    const schedule = {
      ...data,
      id,
      createdAt: new Date().toISOString(),
    };

    if (this.isConnected && this.db) {
      const res = await this.db.collection('schedules').insertOne(schedule);
      return { ...schedule, _id: res.insertedId };
    }
    this.memoryStore.schedules.unshift(schedule);
    return schedule;
  }

  public async updateSchedule(id: string, updates: any): Promise<any> {
    const { _id, ...safeUpdates } = updates;
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      await this.db.collection('schedules').updateOne(
        query,
        { $set: safeUpdates }
      );
      const updated = await this.db.collection('schedules').findOne(query);
      if (updated) {
        return { ...updated, id: updated.id || updated._id.toString() };
      }
    }
    const idx = this.memoryStore.schedules.findIndex((s) => s.id === id);
    if (idx !== -1) {
      this.memoryStore.schedules[idx] = {
        ...this.memoryStore.schedules[idx],
        ...safeUpdates,
      };
      return this.memoryStore.schedules[idx];
    }
    return { id, ...safeUpdates };
  }

  public async deleteSchedule(id: string): Promise<boolean> {
    if (this.isConnected && this.db) {
      const query = buildEntityQuery(id);
      const res = await this.db.collection('schedules').deleteOne(query);
      return res.deletedCount > 0;
    }
    const prev = this.memoryStore.schedules.length;
    this.memoryStore.schedules = this.memoryStore.schedules.filter((s) => s.id !== id);
    return this.memoryStore.schedules.length < prev;
  }
}

export const mongoDb = new MongoDatabaseService();
