import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { seedTopics } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

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

function loadDb() {
  if (dbCache) return dbCache;

  if (!fs.existsSync(DB_FILE)) {
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
    try {
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  },
  
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
