import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

import { db } from './db.js';
import { generateToken, authMiddleware, requireAdmin, requireActiveUser } from './auth.js';
import { digitizeQuestionPaper, evaluateEssay } from './aiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    cb(null, uniqueName);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(uploadDir));

// Initialize DB
db.read();

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, targetExamDate } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, E-Mail und Passwort sind erforderlich' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Diese E-Mail-Adresse ist bereits registriert' });
    }

    const newUser = {
      id: `student-${uuidv4().substring(0, 8)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: bcrypt.hashSync(password, 10),
      role: 'student',
      status: 'pending',
      targetExamDate: targetExamDate || null,
      createdAt: new Date().toISOString()
    };

    db.addUser(newUser);

    return res.status(201).json({
      message: 'Registrierung erfolgreich! Ihr Konto wurde erstellt und muss nun vom Administrator freigeschaltet werden, bevor Sie sich anmelden können.',
      requiresActivation: true
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Interner Serverfehler bei der Registrierung' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten (E-Mail oder Passwort falsch)' });
    }

    const validPassword = bcrypt.compareSync(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten (E-Mail oder Passwort falsch)' });
    }

    // Check if account has been activated by admin
    if (user.role !== 'admin' && user.status !== 'active') {
      return res.status(403).json({
        error: 'Ihr Konto wurde noch nicht vom Administrator freigeschaltet. Bitte warten Sie auf die Freischaltung durch die Prüfungsleitung.',
        isPending: true
      });
    }

    const token = generateToken(user);
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        targetExamDate: user.targetExamDate
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Interner Serverfehler beim Login' });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const { passwordHash, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// ==========================================
// 2. ADMIN USER & STATUS MANAGEMENT
// ==========================================

app.get('/api/admin/users', authMiddleware, requireAdmin, (req, res) => {
  const users = db.getUsers().map(({ passwordHash, ...u }) => u);
  res.json({ users });
});

// Admin creates new user with specific role and privilege
app.post('/api/admin/users', authMiddleware, requireAdmin, (req, res) => {
  try {
    const { name, email, password, role, status, targetExamDate } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, E-Mail und Passwort sind erforderlich' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Diese E-Mail-Adresse ist bereits registriert' });
    }

    const assignedRole = role === 'admin' ? 'admin' : 'student';
    const assignedStatus = status === 'pending' ? 'pending' : 'active';

    const newUser = {
      id: `${assignedRole}-${uuidv4().substring(0, 8)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: bcrypt.hashSync(password, 10),
      role: assignedRole,
      status: assignedStatus,
      targetExamDate: targetExamDate || null,
      createdAt: new Date().toISOString()
    };

    db.addUser(newUser);
    const { passwordHash, ...safeUser } = newUser;

    res.status(201).json({
      message: `Benutzer ${safeUser.name} (${safeUser.role === 'admin' ? 'Administrator' : 'Student'}) erfolgreich angelegt!`,
      user: safeUser
    });
  } catch (err) {
    console.error('Error creating user by admin:', err);
    res.status(500).json({ error: 'Fehler beim Anlegen des Benutzers' });
  }
});

// Admin changes user role / privilege (e.g. promotes to admin or changes to student)
app.patch('/api/admin/users/:id/role', authMiddleware, requireAdmin, (req, res) => {
  try {
    const user = db.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden' });

    const { role } = req.body;
    if (!role || !['admin', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Ungültige Rolle. Erlaubt sind "admin" oder "student".' });
    }

    // Guard: Prevent demoting the last admin
    if (user.role === 'admin' && role === 'student') {
      const adminCount = db.getUsers().filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        return res.status(400).json({ error: 'Der letzte Administrator kann nicht herabgestuft werden.' });
      }
    }

    const updated = db.updateUser(user.id, { role });
    const { passwordHash, ...safeUser } = updated;

    res.json({
      message: `Berechtigung für ${user.name} erfolgreich auf "${role === 'admin' ? 'Administrator' : 'Student'}" aktualisiert!`,
      user: safeUser
    });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Berechtigung' });
  }
});

app.patch('/api/admin/users/:id/toggle-status', authMiddleware, requireAdmin, (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden' });
  if (user.role === 'admin') {
    return res.status(400).json({ error: 'Admin-Status kann nicht geändert werden' });
  }

  const nextStatus = user.status === 'active' ? 'pending' : 'active';
  const updated = db.updateUser(user.id, { status: nextStatus });
  const { passwordHash, ...safeUser } = updated;

  res.json({
    message: `Konto von ${user.name} ist nun ${nextStatus === 'active' ? 'aktiviert' : 'deaktiviert'}.`,
    user: safeUser
  });
});

app.patch('/api/admin/users/:id/status', authMiddleware, requireAdmin, (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden' });
  if (user.role === 'admin') {
    return res.status(400).json({ error: 'Admin-Status kann nicht geändert werden' });
  }

  const newStatus = req.body.status === 'pending' ? 'pending' : 'active';
  const updated = db.updateUser(user.id, { status: newStatus });
  const { passwordHash, ...safeUser } = updated;

  res.json({
    message: `Konto von ${user.name} ist nun ${newStatus === 'active' ? 'aktiviert' : 'deaktiviert'}.`,
    user: safeUser
  });
});

app.delete('/api/admin/users/:id', authMiddleware, requireAdmin, (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Benutzer nicht gefunden' });
  if (user.id === req.user.id) {
    return res.status(400).json({ error: 'Sie können Ihr eigenes Administratorkonto nicht löschen' });
  }
  if (user.role === 'admin') {
    const adminCount = db.getUsers().filter(u => u.role === 'admin').length;
    if (adminCount <= 1) {
      return res.status(400).json({ error: 'Der einzige verbleibende Administrator kann nicht gelöscht werden' });
    }
  }

  db.deleteUser(user.id);
  res.json({ message: 'Benutzer erfolgreich gelöscht' });
});

// Admin CRUD on Exam Topics, Questions & Options
app.put('/api/admin/topics/:section/:subteil/:topicId', authMiddleware, requireAdmin, (req, res) => {
  try {
    const { section, subteil, topicId } = req.params;
    const updatedData = req.body;
    const updated = db.updateTopic(section, subteil, topicId, updatedData);
    if (!updated) {
      return res.status(404).json({ error: 'Thema nicht gefunden' });
    }
    res.json({ message: 'Thema und Aufgaben erfolgreich aktualisiert!', topic: updated });
  } catch (err) {
    console.error('Error updating topic:', err);
    res.status(500).json({ error: 'Fehler beim Speichern der Änderungen' });
  }
});

app.delete('/api/admin/topics/:section/:subteil/:topicId', authMiddleware, requireAdmin, (req, res) => {
  try {
    const { section, subteil, topicId } = req.params;
    db.deleteTopic(section, subteil, topicId);
    res.json({ message: 'Thema erfolgreich gelöscht!' });
  } catch (err) {
    console.error('Error deleting topic:', err);
    res.status(500).json({ error: 'Fehler beim Löschen des Themas' });
  }
});

// Admin Exam Sets & Submissions Endpoints
app.get('/api/admin/exams', authMiddleware, requireAdmin, (req, res) => {
  const exams = db.getExams();
  res.json({ exams });
});

app.post('/api/admin/exams', authMiddleware, requireAdmin, (req, res) => {
  const exam = req.body;
  if (!exam || !exam.id) {
    return res.status(400).json({ error: 'Ungültige Prüfungsdaten' });
  }
  db.saveExam(exam);
  res.status(201).json({ message: 'Prüfungssatz erfolgreich gespeichert', exam });
});

app.delete('/api/admin/exams/:id', authMiddleware, requireAdmin, (req, res) => {
  db.deleteExam(req.params.id);
  res.json({ message: 'Prüfungssatz erfolgreich gelöscht' });
});

app.get('/api/admin/submissions', authMiddleware, requireAdmin, (req, res) => {
  const submissions = db.getSubmissions();
  res.json({ submissions });
});

app.get('/api/admin/stats', authMiddleware, requireAdmin, (req, res) => {
  const users = db.getUsers();
  const exams = db.getExams();
  const submissions = db.getSubmissions();
  const activeStudents = users.filter(u => u.role === 'student' && u.status === 'active').length;
  const pendingStudents = users.filter(u => u.role === 'student' && u.status === 'pending').length;

  res.json({
    totalUsers: users.length,
    activeStudents,
    pendingStudents,
    totalExams: exams.length,
    totalSubmissions: submissions.length
  });
});

// ==========================================
// 3. TOPIC SELECTION & PRACTICE PORTAL
// ==========================================

// Get all sections with their respective sub-teile and available themes/topics
app.get('/api/topics', authMiddleware, requireActiveUser, (req, res) => {
  const data = db.getTopicsData();
  res.json({ topicsData: data });
});

// Get a specific topic for exercise
app.get('/api/topics/:section/:subteil/:topicId', authMiddleware, requireActiveUser, (req, res) => {
  const { section, subteil, topicId } = req.params;
  const data = db.getTopicsData();

  let topic = null;
  if (section === 'schriftlicherAusdruck') {
    topic = data.schriftlicherAusdruck?.topics?.find(t => t.id === topicId);
  } else {
    topic = data[section]?.[subteil]?.topics?.find(t => t.id === topicId);
  }

  if (!topic) {
    return res.status(404).json({ error: 'Thema nicht gefunden' });
  }

  res.json({ section, subteil, topic });
});

// INSTANT SCORECARD EVALUATION (Does not require persistence; gives instant scorecard)
app.post('/api/evaluate-instant', authMiddleware, requireActiveUser, (req, res) => {
  try {
    const { section, subteil, topicId, userAnswers, topicData } = req.body;

    let score = 0;
    let totalPoints = 0;
    let itemBreakdown = [];

    if (section === 'leseverstehen') {
      if (subteil === 'teil1') {
        const correctAnswers = topicData?.correctAnswers || {};
        const explanations = topicData?.explanations || {};
        Object.keys(correctAnswers).forEach(gapKey => {
          totalPoints++;
          const userAns = (userAnswers[gapKey] || '').trim().toUpperCase();
          const correctAns = (correctAnswers[gapKey] || '').toUpperCase();
          const isCorrect = userAns === correctAns;
          if (isCorrect) score++;
          itemBreakdown.push({
            label: `Lücke [${gapKey}]`,
            userAnswer: userAns || '(Keine Auswahl)',
            correctAnswer: correctAns,
            isCorrect,
            explanation: explanations[gapKey] || ''
          });
        });
      } else if (subteil === 'teil2') {
        const correctAnswers = topicData?.correctAnswers || {};
        const explanations = topicData?.explanations || {};
        (topicData?.statements || []).forEach(st => {
          totalPoints++;
          const userAns = (userAnswers[st.id] || '').trim().toUpperCase();
          const correctAns = (correctAnswers[st.id] || '').toUpperCase();
          const isCorrect = userAns === correctAns;
          if (isCorrect) score++;
          itemBreakdown.push({
            label: `Aussage ${st.id}`,
            questionText: st.text,
            userAnswer: userAns || '(Keine Zuordnung)',
            correctAnswer: `Text ${correctAns}`,
            isCorrect,
            explanation: explanations[st.id] || ''
          });
        });
      } else if (subteil === 'teil3') {
        (topicData?.questions || []).forEach(q => {
          totalPoints++;
          const userAns = (userAnswers[q.id] || '').trim().toUpperCase();
          const correctAns = (q.correctAnswer || '').toUpperCase();
          const isCorrect = userAns === correctAns;
          if (isCorrect) score++;
          const userOpt = q.options?.find(o => o.key.toUpperCase() === userAns);
          const correctOpt = q.options?.find(o => o.key.toUpperCase() === correctAns);
          itemBreakdown.push({
            label: `Frage ${q.id}`,
            questionText: q.question,
            userAnswer: userAns ? `${userAns}) ${userOpt?.text || ''}` : '(Keine Antwort)',
            correctAnswer: `${correctAns}) ${correctOpt?.text || ''}`,
            isCorrect,
            explanation: q.explanation || ''
          });
        });
      }
    } else if (section === 'sprachbausteine') {
      const items = topicData?.items || [];
      items.forEach(item => {
        totalPoints++;
        const userAns = (userAnswers[item.id] || '').trim().toLowerCase();
        const correctAns = (item.correctAnswer || '').toLowerCase();
        const isCorrect = userAns === correctAns;
        if (isCorrect) score++;
        itemBreakdown.push({
          label: `Lücke [${item.id}]`,
          userAnswer: userAns ? `${userAns}) ${item.options?.find(o => o.key === userAns)?.text || ''}` : '(Keine)',
          correctAnswer: `${correctAns}) ${item.options?.find(o => o.key === correctAns)?.text || ''}`,
          isCorrect,
          explanation: item.explanation || ''
        });
      });
    } else if (section === 'hoerverstehen') {
      const items = topicData?.items || [];
      items.forEach((item, idx) => {
        totalPoints++;
        const userAns = (userAnswers[item.id] || '').trim().toLowerCase();
        const correctAns = (item.correctAnswer || item.answerKey || '').toLowerCase();
        let isCorrect = false;

        if (item.correctAnswer) {
          isCorrect = userAns === correctAns;
        } else if (item.answerKey) {
          isCorrect = userAns.includes(correctAns) || (correctAns.includes(userAns) && userAns.length > 2);
        }

        if (isCorrect) score++;
        itemBreakdown.push({
          label: `Aufgabe ${item.id}`,
          questionText: item.question || item.prompt,
          userAnswer: userAnswers[item.id] ? (item.options?.find(o => o.key === userAnswers[item.id])?.text ? `${userAnswers[item.id]}) ${item.options.find(o => o.key === userAnswers[item.id]).text}` : userAnswers[item.id]) : '(Keine Antwort)',
          correctAnswer: item.correctAnswer ? (item.options?.find(o => o.key === item.correctAnswer)?.text ? `${item.correctAnswer}) ${item.options.find(o => o.key === item.correctAnswer).text}` : item.correctAnswer) : item.answerKey,
          isCorrect,
          explanation: item.explanation || ''
        });
      });
    }

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passed = percentage >= 60;

    const instantScorecard = {
      id: `score-${uuidv4().substring(0, 8)}`,
      section,
      subteil,
      themeTitle: topicData?.themeTitle || topicData?.title || 'Übungssatz',
      score,
      totalPoints,
      percentage,
      passed,
      evaluatedAt: new Date().toISOString(),
      itemBreakdown
    };

    res.json({
      message: 'Sofortauswertung abgeschlossen',
      scorecard: instantScorecard
    });
  } catch (err) {
    console.error('Evaluation error:', err);
    res.status(500).json({ error: 'Fehler bei der Sofortauswertung' });
  }
});

// AI Essay Grading
app.post('/api/ai/grade-essay', authMiddleware, async (req, res) => {
  try {
    const { topicTitle, topicPrompt, studentEssay, customApiKey } = req.body;
    if (!studentEssay || studentEssay.trim().length < 20) {
      return res.status(400).json({ error: 'Bitte geben Sie einen Text zur Bewertung ein.' });
    }

    const evaluation = await evaluateEssay({
      topicTitle: topicTitle || 'Schriftlicher Ausdruck C1',
      topicPrompt: topicPrompt || 'Diskussionsaufsatz',
      studentEssay,
      apiKey: customApiKey
    });

    res.json({
      message: 'Sofortauswertung durch KI abgeschlossen',
      evaluation
    });
  } catch (err) {
    console.error('Grade essay error:', err);
    res.status(500).json({ error: `Fehler bei der KI-Bewertung: ${err.message}` });
  }
});

// ==========================================
// 4. ADMIN AI PAPER DIGITIZER
// ==========================================

app.post('/api/admin/digitize-paper', authMiddleware, requireAdmin, upload.single('paperFile'), async (req, res) => {
  try {
    let rawText = req.body.rawText || '';
    const sectionType = req.body.sectionType || 'leseverstehen';
    const subteilKey = req.body.subteilKey || 'teil1';
    const title = req.body.title || 'Digitalisierter C1 Prüfungstext';
    const customApiKey = req.body.geminiApiKey;

    if (req.file) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      if (ext === '.pdf') {
        const dataBuffer = fs.readFileSync(req.file.path);
        const parsedPdf = await pdfParse(dataBuffer);
        rawText = parsedPdf.text + '\n' + rawText;
      } else if (ext === '.txt' || ext === '.md') {
        const fileContent = fs.readFileSync(req.file.path, 'utf8');
        rawText = fileContent + '\n' + rawText;
      }
    }

    if (!rawText || rawText.trim().length < 20) {
      return res.status(400).json({
        error: 'Bitte laden Sie eine PDF/Text-Datei hoch oder fügen Sie den Prüfungstext ein.'
      });
    }

    // Call AI Digitizer
    const digitized = await digitizeQuestionPaper({
      rawText,
      sectionType,
      title,
      apiKey: customApiKey
    });

    // Format into a new selectable topic theme
    const newTopic = {
      id: `topic-${uuidv4().substring(0, 8)}`,
      themeTitle: title,
      difficulty: 'C1 Hochschule',
      readingTime: 'ca. 20 Min',
      instructions: 'Digitalisierter Prüfungsteil',
      text: rawText.length > 200 ? rawText : 'Wissenschaftlicher Text...',
      ...digitized.sections?.[sectionType]?.[subteilKey] || {}
    };

    // Add to DB catalog
    db.addTopicToSection(sectionType, subteilKey, newTopic);

    res.json({
      message: 'Prüfungsbogen erfolgreich durch KI digitalisiert und als neues Thema hinzugefügt!',
      newTopic,
      topicsData: db.getTopicsData()
    });
  } catch (err) {
    console.error('Digitization error:', err);
    res.status(500).json({ error: `Digitalisierungsfehler: ${err.message}` });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve frontend build in production
const clientDist = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 telc Deutsch C1 Hochschule Server running on http://localhost:${PORT}`);
});
