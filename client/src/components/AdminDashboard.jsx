import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  Users,
  Sparkles,
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Plus,
  BookOpen,
  Send,
  AlertCircle,
  Eye,
  ShieldCheck,
  GraduationCap,
  Layers,
  Save,
  Edit3,
  RefreshCw
} from 'lucide-react';
import { TopicQuestionCrudEditor } from './admin/TopicQuestionCrudEditor.jsx';

export function AdminDashboard({ initialTab = 'students' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'students', 'editor', 'digitizer', 'exams', 'submissions'
  const [users, setUsers] = useState([]);
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI Digitizer Form State
  const [digitizeTitle, setDigitizeTitle] = useState('telc C1 Hochschule – Neuer Übungssatz');
  const [sectionType, setSectionType] = useState('full'); // 'full', 'leseverstehen', 'sprachbausteine', 'hoerverstehen', 'schriftlicherAusdruck'
  const [rawText, setRawText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [digitizedExamPreview, setDigitizedExamPreview] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);

  // User Management State (Add user & privileges)
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    status: 'active',
    targetExamDate: ''
  });
  const [addingUser, setAddingUser] = useState(false);

  const [isRefreshingUsers, setIsRefreshingUsers] = useState(false);

  useEffect(() => {
    loadAllAdminData();
    // Live polling every 5 seconds so newly registered users pop up in real-time
    const interval = setInterval(() => {
      loadUsers(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function loadUsers(silent = false) {
    if (!silent) setIsRefreshingUsers(true);
    try {
      const usersList = await api.getUsers();
      if (Array.isArray(usersList)) {
        setUsers(usersList);
      }
    } catch (err) {
      if (!silent) console.error('Failed to load users:', err);
    } finally {
      if (!silent) setIsRefreshingUsers(false);
    }
  }

  async function loadAllAdminData() {
    setLoading(true);
    try {
      const [usersRes, examsRes, subsRes, statsRes] = await Promise.allSettled([
        api.getUsers(),
        api.getExams(),
        api.getAllSubmissions(),
        api.getAdminStats()
      ]);

      if (usersRes.status === 'fulfilled' && Array.isArray(usersRes.value)) {
        setUsers(usersRes.value);
      }
      if (examsRes.status === 'fulfilled' && Array.isArray(examsRes.value)) {
        setExams(examsRes.value);
      }
      if (subsRes.status === 'fulfilled' && Array.isArray(subsRes.value)) {
        setSubmissions(subsRes.value);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStats(statsRes.value);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    setAddingUser(true);
    try {
      const res = await api.createUser(newUserData);
      setUsers(prev => [...prev, res.user]);
      setShowAddUserModal(false);
      setNewUserData({
        name: '',
        email: '',
        password: '',
        role: 'student',
        status: 'active',
        targetExamDate: ''
      });
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      alert(`Fehler beim Anlegen: ${err.message}`);
    } finally {
      setAddingUser(false);
    }
  }

  async function handleUpdateRole(userId, newRole) {
    try {
      const res = await api.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      alert(`Fehler beim Ändern der Berechtigung: ${err.message}`);
    }
  }

  async function handleToggleStatus(userId) {
    try {
      const res = await api.toggleUserStatus(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, status: res.user.status } : u));
      setStatusMessage({ type: 'success', text: res.message });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      alert(`Fehler: ${err.message}`);
    }
  }

  async function handleDeleteUser(userId) {
    if (!window.confirm('Möchten Sie dieses Studentenkonto wirklich löschen?')) return;
    try {
      await api.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setStatusMessage({ type: 'success', text: 'Studentenkonto erfolgreich gelöscht.' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      alert(`Fehler beim Löschen: ${err.message}`);
    }
  }

  async function handleDeleteExam(examId) {
    if (!window.confirm('Möchten Sie diesen Prüfungssatz löschen?')) return;
    try {
      await api.deleteExam(examId);
      setExams(exams.filter(e => e.id !== examId));
    } catch (err) {
      alert(`Fehler: ${err.message}`);
    }
  }

  async function handleDigitizePaper(e) {
    e.preventDefault();
    if (!rawText.trim() && !selectedFile) {
      alert('Bitte fügen Sie Prüfungstext ein oder laden Sie eine PDF-Datei hoch.');
      return;
    }

    setIsProcessingAI(true);
    setStatusMessage({ type: 'info', text: 'KI analysiert Textstruktur, extrahiert telc Abschnitte und formatiert Fragen...' });

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('paperFile', selectedFile);
      }
      formData.append('rawText', rawText);
      formData.append('sectionType', sectionType);
      formData.append('title', digitizeTitle);
      if (geminiApiKey) {
        formData.append('geminiApiKey', geminiApiKey);
      }

      const res = await api.digitizePaper(formData);
      setDigitizedExamPreview(res.digitizedExam);
      setStatusMessage({ type: 'success', text: 'Prüfungsbogen erfolgreich durch KI digitalisiert! Überprüfen Sie die Vorschau unten.' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: `Fehler bei der Digitalisierung: ${err.message}` });
    } finally {
      setIsProcessingAI(false);
    }
  }

  async function handleSaveDigitizedExam() {
    if (!digitizedExamPreview) return;
    try {
      const res = await api.saveExam(digitizedExamPreview);
      setStatusMessage({ type: 'success', text: 'Prüfungssatz erfolgreich im Portal veröffentlicht!' });
      setDigitizedExamPreview(null);
      setRawText('');
      setSelectedFile(null);
      loadAllAdminData();
    } catch (err) {
      alert(`Fehler beim Speichern: ${err.message}`);
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">telc C1 Prüfungszentrale</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Administrator & Dozenten-Dashboard
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Studentenkonten freischalten, Papierprüfungsbögen via KI digitalisieren und Prüfungskatalog verwalten.
            </p>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur px-4 py-2.5 rounded-2xl border border-white/10 text-center">
                <div className="text-lg font-black text-amber-300">{stats.pendingStudents}</div>
                <div className="text-[10px] text-slate-300">Warten auf Freischaltung</div>
              </div>
              <div className="bg-white/10 backdrop-blur px-4 py-2.5 rounded-2xl border border-white/10 text-center">
                <div className="text-lg font-black text-emerald-300">{stats.activeStudents}</div>
                <div className="text-[10px] text-slate-300">Aktive Studenten</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status notification */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 animate-fadeIn ${
          statusMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : statusMessage.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-blue-50 border-blue-200 text-blue-800'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-blue-600" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => { setActiveTab('students'); loadUsers(); }}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'students' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Benutzer- & Rechteverwaltung ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('editor')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Edit3 className="w-4 h-4 text-emerald-400" />
          Fragen- & Optionen-Editor (CRUD)
        </button>
        <button
          onClick={() => setActiveTab('digitizer')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'digitizer' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          KI-Bogen Digitalisierung
        </button>
        <button
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'exams' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Prüfungskatalog ({exams.length})
        </button>
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
            activeTab === 'submissions' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Prüfungsabgaben ({submissions.length})
        </button>
      </div>

      {/* TAB 1: USER & PRIVILEGE MANAGEMENT */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Benutzer- & Rechteverwaltung</h2>
              <p className="text-xs text-slate-500">
                Verwalten Sie Konten, legen Sie neue Benutzer an und vergeben Sie Administrator- oder Studenten-Berechtigungen.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => loadUsers(false)}
                disabled={isRefreshingUsers}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Benutzerliste neu laden"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingUsers ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
                <span>{isRefreshingUsers ? 'Lädt...' : 'Aktualisieren'}</span>
              </button>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Neuen Benutzer anlegen</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Benutzer</th>
                  <th className="py-3 px-4">E-Mail</th>
                  <th className="py-3 px-4">Berechtigung / Rolle</th>
                  <th className="py-3 px-4">Konto-Status</th>
                  <th className="py-3 px-4 text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map(u => {
                  const isActive = u.status === 'active';
                  const isAdmin = u.role === 'admin';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-2xs ${
                          isAdmin ? 'bg-indigo-600 text-white' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs sm:text-sm">{u.name}</div>
                          <div className="text-[10px] text-slate-400">ID: {u.id}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-mono text-[11px]">{u.email}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                            className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition cursor-pointer ${
                              isAdmin
                                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 focus:ring-2 focus:ring-indigo-400'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                            title="Berechtigung / Rolle ändern"
                          >
                            <option value="student">🎓 Student (Standard)</option>
                            <option value="admin">👑 Administrator (Volle Rechte)</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            Aktiviert
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            Wartet auf Freischaltung
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
                              isActive
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                            }`}
                            title={isActive ? 'Konto sperren' : 'Konto freischalten'}
                          >
                            {isActive ? 'Sperren' : '✓ Freischalten'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Benutzer löschen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add User Modal */}
          {showAddUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative">
                
                <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 text-white relative">
                  <button
                    onClick={() => setShowAddUserModal(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  >
                    ✕
                  </button>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                      Benutzerverwaltung
                    </span>
                  </div>
                  <h3 className="text-lg font-black">Neuen Benutzer anlegen & Rechte vergeben</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Erstellen Sie einen Zugang für Studenten oder weisen Sie Administrator-Rechte zu.
                  </p>
                </div>

                <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Vollständiger Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUserData.name}
                      onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                      placeholder="z. B. Max Mustermann"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      E-Mail-Adresse *
                    </label>
                    <input
                      type="email"
                      required
                      value={newUserData.email}
                      onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                      placeholder="benutzer@uni.de"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Passwort *
                    </label>
                    <input
                      type="password"
                      required
                      value={newUserData.password}
                      onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                      placeholder="Sicheres Passwort eingeben"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Berechtigung / Rolle *
                      </label>
                      <select
                        value={newUserData.role}
                        onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="student">🎓 Student (Prüfungszugriff)</option>
                        <option value="admin">👑 Administrator (Admin-Rechte)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Konto-Status *
                      </label>
                      <select
                        value={newUserData.status}
                        onChange={(e) => setNewUserData({ ...newUserData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="active">✓ Aktiviert (Sofortiger Zugriff)</option>
                        <option value="pending">⏳ Wartet auf Freischaltung</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Geplanter Prüfungstermin (optional)
                    </label>
                    <input
                      type="date"
                      value={newUserData.targetExamDate}
                      onChange={(e) => setNewUserData({ ...newUserData, targetExamDate: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowAddUserModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    >
                      Abbrechen
                    </button>
                    <button
                      type="submit"
                      disabled={addingUser}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-md transition disabled:opacity-50 cursor-pointer"
                    >
                      {addingUser ? 'Wird angelegt...' : 'Benutzer anlegen'}
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB: TOPIC QUESTION & OPTIONS CRUD EDITOR */}
      {activeTab === 'editor' && (
        <TopicQuestionCrudEditor />
      )}

      {/* TAB 2: AI QUESTION PAPER DIGITIZER (Requested by User) */}
      {activeTab === 'digitizer' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Prüfungsbogen hochladen & mit KI digitalisieren
                  </h2>
                  <p className="text-xs text-slate-500">
                    Laden Sie eine PDF-Datei hoch oder fügen Sie den Prüfungstext ein. Das KI-Modell strukturiert die Lücken, Antwortoptionen und Bewertungsmaßstäbe automatisch.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleDigitizePaper} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Prüfungstitel</label>
                  <input
                    type="text"
                    required
                    value={digitizeTitle}
                    onChange={(e) => setDigitizeTitle(e.target.value)}
                    placeholder="z.B. telc Deutsch C1 Hochschule – Modellsatz 2"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ziel-Prüfungsteil</label>
                  <select
                    value={sectionType}
                    onChange={(e) => setSectionType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-slate-800"
                  >
                    <option value="full">Komplette Prüfung (Alle Teile)</option>
                    <option value="leseverstehen">1. Leseverstehen (Teil 1, 2, 3)</option>
                    <option value="sprachbausteine">2. Sprachbausteine (Teil 1)</option>
                    <option value="hoerverstehen">3. Hörverstehen (Teil 1, 2, 3)</option>
                    <option value="schriftlicherAusdruck">4. Schriftlicher Ausdruck (Aufsatz)</option>
                  </select>
                </div>
              </div>

              {/* File Upload Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PDF / Text Prüfungsdokument hochladen
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl p-5 bg-slate-50 text-center transition cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.txt,.md,.doc,.docx"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                    <Upload className="w-8 h-8 text-indigo-500" />
                    <span className="text-xs font-bold text-slate-800">
                      {selectedFile ? selectedFile.name : 'PDF-Prüfungsbogen hier ablegen oder durchsuchen'}
                    </span>
                    <span className="text-[11px] text-slate-400">Unterstützt PDF, TXT und Markdown bis 25 MB</span>
                  </div>
                </div>
              </div>

              {/* Raw Text Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Oder Prüfungstext direkt als Text einfügen:
                </label>
                <textarea
                  rows={6}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Kopieren Sie hier den Aufgabentext, Lückentext oder Multiple-Choice-Fragen hinein..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="text-[11px] text-slate-400">
                  ⚡ Backend verwendet KI-Extraktion und strukturierte JSON-Generierung.
                </div>
                <button
                  type="submit"
                  disabled={isProcessingAI}
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  {isProcessingAI ? 'KI digitalisiert Bogen...' : 'An KI senden & Digitalisieren'}
                </button>
              </div>

            </form>
          </div>

          {/* DIGITIZED PREVIEW & PUBLISH */}
          {digitizedExamPreview && (
            <div className="bg-white rounded-3xl border border-indigo-200 shadow-xl p-6 space-y-5 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Digitalisierte Vorschau: {digitizedExamPreview.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Erkannte Teile: {Object.keys(digitizedExamPreview.sections || {}).join(', ')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleSaveDigitizedExam}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  In Prüfungskatalog veröffentlichen
                </button>
              </div>

              {/* JSON Visual Inspector */}
              <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl text-xs font-mono max-h-96 overflow-y-auto">
                <pre>{JSON.stringify(digitizedExamPreview, null, 2)}</pre>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: EXAM CATALOG */}
      {activeTab === 'exams' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Veröffentlichte Prüfungssätze</h2>
              <p className="text-xs text-slate-500">Alle aktuell für Studenten verfügbaren Prüfungen</p>
            </div>
            <button
              onClick={() => setActiveTab('digitizer')}
              className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Neuen Bogen digitalisieren
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {exams.map(exam => (
              <div key={exam.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{exam.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800">
                      {exam.level || 'C1 Hochschule'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{exam.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDeleteExam(exam.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Prüfung löschen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: STUDENT SUBMISSIONS & AI LOGS */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="pb-3 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Studentische Prüfungsergebnisse</h2>
            <p className="text-xs text-slate-500">Live-Protokoll aller absolvierten Tests und KI-Bewertungen</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Prüfung & Teil</th>
                  <th className="py-3 px-4">Punkte / Prozent</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Zeitpunkt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {submissions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{sub.userName || sub.userId}</td>
                    <td className="py-3.5 px-4 text-slate-700">
                      <div className="font-semibold">{sub.examTitle}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{sub.sectionType} ({sub.teil || 'Gesamt'})</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      {sub.score} / {sub.totalPoints} ({sub.percentage}%)
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        sub.passed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {sub.passed ? 'Bestanden' : 'Nicht bestanden'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(sub.submittedAt).toLocaleString('de-DE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
