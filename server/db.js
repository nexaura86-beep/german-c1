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

function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      users: defaultUsers,
      topicsData: seedTopics,
      submissions: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(content);
    if (!parsed.topicsData) {
      parsed.topicsData = seedTopics;
      fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf8');
    }
    return parsed;
  } catch (err) {
    console.error('Error reading database, resetting:', err);
    return initDb();
  }
}

export const db = {
  read: () => initDb(),
  write: (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  },
  
  // Users
  getUsers: () => db.read().users,
  getUserById: (id) => db.read().users.find(u => u.id === id),
  getUserByEmail: (email) => db.read().users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  addUser: (user) => {
    const data = db.read();
    data.users.push(user);
    db.write(data);
    return user;
  },
  updateUser: (id, updates) => {
    const data = db.read();
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
    data.users = data.users.filter(u => u.id !== id);
    db.write(data);
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
