import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import { seedTopics } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the most persistent file path available
function resolveDbFilePath() {
  if (process.env.DATA_PATH) {
    return process.env.DATA_PATH;
  }
  // Common persistent volume paths on Render/Railway/Fly
  if (process.env.DATA_DIR && fs.existsSync(process.env.DATA_DIR)) {
    return path.join(process.env.DATA_DIR, 'database.json');
  }
  if (fs.existsSync('/var/data')) {
    return '/var/data/database.json';
  }
  const defaultPath = path.join(__dirname, 'database.json');
  
  // Test if default directory is writable
  try {
    const testDir = path.dirname(defaultPath);
    fs.accessSync(testDir, fs.constants.W_OK);
    return defaultPath;
  } catch (e) {
    // Read-only filesystem fallback (e.g. serverless functions on Vercel/AWS Lambda)
    console.warn(`Default storage ${defaultPath} is not writable. Falling back to /tmp/database.json`);
    return path.join('/tmp', 'database.json');
  }
}

const DB_FILE = resolveDbFilePath();

const defaultUsers = [
  {
    id: 'admin-1',
    email: 'admin@telc.de',
    passwordHash: bcrypt.hashSync('admin123', 10),
    name: 'Prüfungsleiter Administrator',
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'student-1',
    email: 'student@uni.de',
    passwordHash: bcrypt.hashSync('student123', 10),
    name: 'Alexander Müller',
    role: 'student',
    status: 'active',
    targetExamDate: '2026-11-15',
    createdAt: new Date().toISOString()
  },
  {
    id: 'student-2',
    email: 'sarah.k@stud.tu-berlin.de',
    passwordHash: bcrypt.hashSync('student123', 10),
    name: 'Sarah Klein',
    role: 'student',
    status: 'pending',
    targetExamDate: '2026-12-01',
    createdAt: new Date().toISOString()
  }
];

let dbCache = null;

// MongoDB Atlas Cloud Connection State
let mongoClient = null;
let mongoCollection = null;
let isMongoConnected = false;

export async function initMongo() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('mongodb') ? process.env.DATABASE_URL : null);
  if (!uri) {
    console.log(`ℹ️ [Database] Running with File Storage (${DB_FILE}). Set MONGODB_URI to enable automatic Cloud DB sync.`);
    return;
  }

  try {
    console.log('🔄 [MongoDB] Connecting to MongoDB Atlas Cloud Database...');
    mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
    await mongoClient.connect();
    const dbInstance = mongoClient.db('telc_c1_portal');
    mongoCollection = dbInstance.collection('portal_database');
    isMongoConnected = true;
    console.log('✅ [MongoDB] Connected to MongoDB Atlas Cloud Database successfully!');

    // Fetch existing cloud data
    const cloudDoc = await mongoCollection.findOne({ _id: 'telc_database_main' });
    if (cloudDoc && cloudDoc.data) {
      console.log(`📦 [MongoDB] Restored cloud database with ${cloudDoc.data.users?.length || 0} users from MongoDB Atlas.`);
      dbCache = {
        ...dbCache,
        ...cloudDoc.data,
        users: cloudDoc.data.users || dbCache?.users || defaultUsers
      };
      // Keep local file in sync as fast cache
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf8');
      } catch (e) {}
    } else {
      // First time MongoDB initialization: upload current state
      console.log('🌱 [MongoDB] Seeding initial data into MongoDB Atlas...');
      await mongoCollection.updateOne(
        { _id: 'telc_database_main' },
        { $set: { data: db.read(), updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      console.log('✅ [MongoDB] MongoDB Atlas initialized and seeded!');
    }
  } catch (err) {
    console.error('⚠️ [MongoDB] Could not connect to MongoDB Atlas (falling back to file storage):', err.message);
    isMongoConnected = false;
  }
}

function loadDb() {
  if (dbCache) return dbCache;

  // Check if primary DB_FILE exists
  if (!fs.existsSync(DB_FILE)) {
    // Check if backup or initial exists in project folder
    const fallbackPath = path.join(__dirname, 'database.json');
    if (fs.existsSync(fallbackPath) && fallbackPath !== DB_FILE) {
      try {
        const content = fs.readFileSync(fallbackPath, 'utf8');
        dbCache = JSON.parse(content);
        // Write to DB_FILE
        fs.writeFileSync(DB_FILE, content, 'utf8');
        return dbCache;
      } catch (e) {}
    }

    const initialData = {
      users: defaultUsers,
      topicsData: seedTopics,
      submissions: [],
      exams: []
    };
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to create initial database file:', e);
    }
    dbCache = initialData;
    return dbCache;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(content);
    if (!parsed.topicsData) parsed.topicsData = seedTopics;
    if (!parsed.users) parsed.users = defaultUsers;
    if (!parsed.exams) parsed.exams = [];
    if (!parsed.submissions) parsed.submissions = [];
    dbCache = parsed;
    return dbCache;
  } catch (err) {
    console.error('Error reading database file:', err);
    if (dbCache) return dbCache;
    dbCache = { users: defaultUsers, topicsData: seedTopics, submissions: [], exams: [] };
    return dbCache;
  }
}

export const db = {
  read: () => loadDb(),
  
  write: (data) => {
    dbCache = data;

    // 1. Persist to local disk with atomic swap & direct write fallback
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, jsonStr, 'utf8');
      try {
        fs.renameSync(tmpFile, DB_FILE);
      } catch (renameErr) {
        fs.writeFileSync(DB_FILE, jsonStr, 'utf8');
        try { fs.unlinkSync(tmpFile); } catch (e) {}
      }

      // Also maintain a backup copy
      try {
        fs.writeFileSync(`${DB_FILE}.bak`, jsonStr, 'utf8');
      } catch (bakErr) {}
    } catch (err) {
      console.error('Error saving database to file:', err);
      try {
        const fallbackTmp = path.join('/tmp', 'database.json');
        fs.writeFileSync(fallbackTmp, JSON.stringify(data, null, 2), 'utf8');
      } catch (e2) {}
    }

    // 2. Persist to MongoDB Atlas Cloud if connected
    if (mongoCollection) {
      mongoCollection.updateOne(
        { _id: 'telc_database_main' },
        { $set: { data, updatedAt: new Date().toISOString() } },
        { upsert: true }
      ).catch(mongoErr => {
        console.error('⚠️ [MongoDB] Background sync failed:', mongoErr.message);
      });
    }
  },

  getStorageInfo: () => ({
    mode: isMongoConnected ? 'mongodb_cloud' : 'file_storage',
    filePath: DB_FILE,
    isCloudConnected: isMongoConnected,
    isPersistentDisk: DB_FILE.startsWith('/var/data') || DB_FILE.startsWith('/data') || Boolean(process.env.DATA_DIR)
  }),
  
  // Users
  getUsers: () => (db.read().users || []),
  getUserById: (id) => (db.read().users || []).find(u => u.id === id),
  getUserByEmail: (email) => {
    const clean = (email || '').trim().toLowerCase();
    return (db.read().users || []).find(u => (u.email || '').trim().toLowerCase() === clean);
  },
  addUser: (user) => {
    const data = db.read();
    if (!data.users) data.users = [];
    data.users.push(user);
    db.write(data);
    return user;
  },
  updateUser: (id, updates) => {
    const data = db.read();
    if (!data.users) data.users = [];
    const idx = data.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      data.users[idx] = { ...data.users[idx], ...updates };
      db.write(data);
      return data.users[idx];
    }
    return null;
  },
  deleteUser: (id) => {
    const data = db.read();
    if (!data.users) data.users = [];
    data.users = data.users.filter(u => u.id !== id);
    db.write(data);
  },

  // Exams
  getExams: () => db.read().exams || [],
  getExamById: (id) => (db.read().exams || []).find(e => e.id === id),
  saveExam: (exam) => {
    const data = db.read();
    if (!data.exams) data.exams = [];
    const existingIndex = data.exams.findIndex(e => e.id === exam.id);
    if (existingIndex !== -1) {
      data.exams[existingIndex] = exam;
    } else {
      data.exams.push(exam);
    }
    db.write(data);
    return exam;
  },
  deleteExam: (id) => {
    const data = db.read();
    if (data.exams) {
      data.exams = data.exams.filter(e => e.id !== id);
      db.write(data);
    }
  },

  // Submissions
  getSubmissions: () => db.read().submissions || [],
  addSubmission: (submission) => {
    const data = db.read();
    if (!data.submissions) data.submissions = [];
    data.submissions.push(submission);
    db.write(data);
    return submission;
  },

  // Topics Data
  getTopicsData: () => db.read().topicsData || seedTopics,
  updateTopicsData: (newTopics) => {
    const data = db.read();
    data.topicsData = newTopics;
    db.write(data);
  },
  addTopicToSection: (sectionKey, subteilKey, newTopic) => {
    const data = db.read();
    if (!data.topicsData) data.topicsData = seedTopics;
    
    if (sectionKey === 'schriftlicherAusdruck') {
      if (!data.topicsData.schriftlicherAusdruck.topics) data.topicsData.schriftlicherAusdruck.topics = [];
      data.topicsData.schriftlicherAusdruck.topics.push(newTopic);
    } else {
      if (data.topicsData[sectionKey] && data.topicsData[sectionKey][subteilKey]) {
        if (!data.topicsData[sectionKey][subteilKey].topics) {
          data.topicsData[sectionKey][subteilKey].topics = [];
        }
        data.topicsData[sectionKey][subteilKey].topics.push(newTopic);
      }
    }
    db.write(data);
    return newTopic;
  },
  updateTopic: (sectionKey, subteilKey, topicId, updatedTopicData) => {
    const data = db.read();
    if (!data.topicsData) data.topicsData = seedTopics;
    let list = [];
    if (sectionKey === 'schriftlicherAusdruck') {
      list = data.topicsData.schriftlicherAusdruck?.topics || [];
    } else if (data.topicsData[sectionKey]?.[subteilKey]?.topics) {
      list = data.topicsData[sectionKey][subteilKey].topics;
    }
    const idx = list.findIndex(t => t.id === topicId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updatedTopicData };
      db.write(data);
      return list[idx];
    }
    return null;
  },
  deleteTopic: (sectionKey, subteilKey, topicId) => {
    const data = db.read();
    if (!data.topicsData) data.topicsData = seedTopics;
    if (sectionKey === 'schriftlicherAusdruck') {
      if (data.topicsData.schriftlicherAusdruck?.topics) {
        data.topicsData.schriftlicherAusdruck.topics = data.topicsData.schriftlicherAusdruck.topics.filter(t => t.id !== topicId);
      }
    } else if (data.topicsData[sectionKey]?.[subteilKey]?.topics) {
      data.topicsData[sectionKey][subteilKey].topics = data.topicsData[sectionKey][subteilKey].topics.filter(t => t.id !== topicId);
    }
    db.write(data);
    return true;
  }
};
