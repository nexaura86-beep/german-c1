import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import {
  Save,
  Trash2,
  Plus,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  BookOpen,
  Layers,
  Volume2,
  Play,
  Pause,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
  FileText,
  X,
  Check,
  Headphones
} from 'lucide-react';

export function TopicQuestionCrudEditor() {
  const [topicsData, setTopicsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selection states
  const [selectedSection, setSelectedSection] = useState('hoerverstehen');
  const [selectedSubteil, setSelectedSubteil] = useState('teil1');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [topicSearch, setTopicSearch] = useState('');

  // Working topic state
  const [currentTopic, setCurrentTopic] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Audio preview state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Add topic modal state
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);
  const [newTopicForm, setNewTopicForm] = useState({
    section: 'hoerverstehen',
    subteil: 'teil1',
    themeTitle: ''
  });

  useEffect(() => {
    loadTopics();
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  async function loadTopics() {
    setLoading(true);
    try {
      const data = await api.getTopicsData();
      setTopicsData(data);
      // Auto-select first topic in current section/subteil if available
      const list = getTopicsList(data, selectedSection, selectedSubteil);
      if (list && list.length > 0) {
        setSelectedTopicId(list[0].id);
        setCurrentTopic(JSON.parse(JSON.stringify(list[0])));
      }
    } catch (err) {
      console.error('Error loading topics:', err);
    } finally {
      setLoading(false);
    }
  }

  function getTopicsList(data, sec, sub) {
    if (!data) return [];
    if (sec === 'schriftlicherAusdruck') return data.schriftlicherAusdruck?.topics || [];
    return data[sec]?.[sub]?.topics || [];
  }

  function handleSelectSection(sec, sub) {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    }
    setSelectedSection(sec);
    setSelectedSubteil(sub);
    const list = getTopicsList(topicsData, sec, sub);
    if (list && list.length > 0) {
      setSelectedTopicId(list[0].id);
      setCurrentTopic(JSON.parse(JSON.stringify(list[0])));
    } else {
      setSelectedTopicId('');
      setCurrentTopic(null);
    }
  }

  function handleSelectTopic(topicId) {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    }
    setSelectedTopicId(topicId);
    const list = getTopicsList(topicsData, selectedSection, selectedSubteil);
    const found = list.find(t => t.id === topicId);
    if (found) {
      setCurrentTopic(JSON.parse(JSON.stringify(found)));
    }
  }

  async function handleSaveChanges() {
    if (!currentTopic) return;
    setIsSaving(true);
    try {
      await api.updateAdminTopic(selectedSection, selectedSubteil, currentTopic.id, currentTopic);
      setStatusMessage({ type: 'success', text: `„${currentTopic.themeTitle || currentTopic.title}“ wurde erfolgreich aktualisiert!` });
      setTimeout(() => setStatusMessage(null), 4000);
      // Refresh local topics data
      const refreshed = await api.getTopicsData();
      setTopicsData(refreshed);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Fehler beim Speichern' });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTopic() {
    if (!currentTopic) return;
    if (!window.confirm(`Möchten Sie das Thema „${currentTopic.themeTitle || currentTopic.title}“ wirklich löschen?`)) return;
    try {
      await api.deleteAdminTopic(selectedSection, selectedSubteil, currentTopic.id);
      setStatusMessage({ type: 'success', text: 'Thema wurde gelöscht.' });
      setTimeout(() => setStatusMessage(null), 4000);
      loadTopics();
    } catch (err) {
      alert(`Fehler: ${err.message}`);
    }
  }

  // Audio speech test helper
  const handleToggleAudioTest = () => {
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToRead = currentTopic?.audioTranscript || "Kein Transkript hinterlegt.";
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'de-DE';
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      } else {
        alert("Audio-Wiedergabe wird im Browser nicht unterstützt.");
      }
    }
  };

  // --- Topic Creation ---
  async function handleCreateNewTopic() {
    const title = (newTopicForm.themeTitle || '').trim();
    if (!title) {
      alert('Bitte geben Sie einen Thementitel ein.');
      return;
    }
    const sec = newTopicForm.section;
    const sub = newTopicForm.subteil;
    let template = {
      themeTitle: title,
      difficulty: 'C1 Hochschule'
    };

    if (sec === 'hoerverstehen') {
      if (sub === 'teil1') {
        template.audioTranscript = `Thema: ${title}\nModerator: Willkommen zu unserer Diskussionsrunde über das Thema ${title}. Acht Personen schildern ihre Meinungen.\n\nSprecher 1: ...\nSprecherin 2: ...\nSprecher 3: ...\nSprecherin 4: ...\nSprecher 5: ...\nSprecherin 6: ...\nSprecher 7: ...\nSprecherin 8: ...`;
        template.optionsStatements = [
          { key: 'a', text: 'Erste Aussage zu ' + title },
          { key: 'b', text: 'Zweite Aussage zu ' + title },
          { key: 'c', text: 'Dritte Aussage zu ' + title },
          { key: 'd', text: 'Vierte Aussage zu ' + title },
          { key: 'e', text: 'Fünfte Aussage zu ' + title },
          { key: 'f', text: 'Sechste Aussage zu ' + title },
          { key: 'g', text: 'Siebte Aussage zu ' + title },
          { key: 'h', text: 'Achte Aussage zu ' + title },
          { key: 'i', text: 'Neunte Aussage zu ' + title },
          { key: 'j', text: 'Zehnte Aussage zu ' + title }
        ];
        template.items = [
          { id: '47', prompt: 'Sprecher 1', correctAnswer: 'a', explanation: 'Erklärung zu Sprecher 1' },
          { id: '48', prompt: 'Sprecherin 2', correctAnswer: 'b', explanation: 'Erklärung zu Sprecherin 2' },
          { id: '49', prompt: 'Sprecher 3', correctAnswer: 'c', explanation: 'Erklärung zu Sprecher 3' },
          { id: '50', prompt: 'Sprecherin 4', correctAnswer: 'd', explanation: 'Erklärung zu Sprecherin 4' },
          { id: '51', prompt: 'Sprecher 5', correctAnswer: 'e', explanation: 'Erklärung zu Sprecher 5' },
          { id: '52', prompt: 'Sprecherin 6', correctAnswer: 'f', explanation: 'Erklärung zu Sprecherin 6' },
          { id: '53', prompt: 'Sprecher 7', correctAnswer: 'g', explanation: 'Erklärung zu Sprecher 7' },
          { id: '54', prompt: 'Sprecherin 8', correctAnswer: 'h', explanation: 'Erklärung zu Sprecherin 8' }
        ];
      } else if (sub === 'teil2') {
        template.audioTranscript = `Interview zum Thema: ${title}\n\nInterviewer: Herzlich willkommen zu unserem heutigen Gespräch über ${title}...\nExperte: Vielen Dank für die Einladung...`;
        template.items = Array.from({ length: 10 }, (_, i) => ({
          id: String(55 + i),
          question: `Frage ${55 + i} zum Thema ${title}`,
          options: [
            { key: 'a', text: 'Antwortoption A' },
            { key: 'b', text: 'Antwortoption B' },
            { key: 'c', text: 'Antwortoption C' }
          ],
          correctAnswer: 'a',
          explanation: `Erklärung zu Aufgabe ${55 + i}`
        }));
      } else if (sub === 'teil3') {
        template.audioTranscript = `Fachvortrag zum Thema: ${title}\n\nReferent: Sehr geehrte Damen und Herren, in diesem Vortrag betrachten wir die zentralen Aspekte von ${title}...`;
        template.items = Array.from({ length: 10 }, (_, i) => ({
          id: String(65 + i),
          question: `Stichpunkt ${65 + i}: Wesentlicher Aspekt von ${title}`,
          answerKey: 'Musterantwort / Schlüsselbegriff',
          explanation: `Erklärung zu Aufgabe ${65 + i}`
        }));
      }
    } else if (sec === 'leseverstehen') {
      if (sub === 'teil1') {
        template.readingTime = 'ca. 20 Min';
        template.instructions = 'Welche der Sätze a–h gehören in die Lücken 1–6? Zwei Sätze passen nicht.';
        template.textWithGaps = `Einleitungstext zum Thema ${title}...\n\n[1]\n\nWeiterer Text...\n\n[2]\n\n...`;
        template.options = Array.from({ length: 8 }, (_, i) => ({
          key: String.fromCharCode(97 + i),
          text: `Antwortsatz ${String.fromCharCode(97 + i).toUpperCase()} zu ${title}`
        }));
        template.correctAnswers = { '1': 'a', '2': 'b', '3': 'c', '4': 'd', '5': 'e', '6': 'f' };
        template.explanations = {};
      } else if (sub === 'teil2') {
        template.readingTime = 'ca. 25 Min';
        template.instructions = 'In welchem Text a–e finden Sie die Information?';
        template.statements = Array.from({ length: 6 }, (_, i) => ({
          id: String(7 + i),
          text: `Aussage ${7 + i} zu ${title}`
        }));
        template.texts = [
          { key: 'a', title: 'Text A', content: 'Inhalt von Text A...' },
          { key: 'b', title: 'Text B', content: 'Inhalt von Text B...' },
          { key: 'c', title: 'Text C', content: 'Inhalt von Text C...' },
          { key: 'd', title: 'Text D', content: 'Inhalt von Text D...' },
          { key: 'e', title: 'Text E', content: 'Inhalt von Text E...' }
        ];
        template.correctAnswers = { '7': 'a', '8': 'b', '9': 'c', '10': 'd', '11': 'e', '12': 'a' };
      } else if (sub === 'teil3') {
        template.readingTime = 'ca. 25 Min';
        template.instructions = 'Entscheiden Sie: richtig (a), falsch (b) oder nicht im Text (c).';
        template.articleText = `Wissenschaftlicher Lesetext zum Thema ${title}...\n\nAbschnitt 1...\nAbschnitt 2...`;
        template.questions = Array.from({ length: 10 }, (_, i) => ({
          id: String(13 + i),
          question: `Aussage ${13 + i} zum Text`,
          correctAnswer: 'a',
          explanation: ''
        }));
      }
    } else if (sec === 'sprachbausteine') {
      template.readingTime = 'ca. 30 Min';
      template.instructions = 'Wählen Sie für jede Lücke (25–46) die passende Lösung.';
      template.textTemplate = `Sehr geehrte Damen und Herren,\n\nim Rahmen unserer Forschung zum Thema ${title} möchten wir Sie über folgende Ergebnisse informieren... [25] ... [26] ... [46]`;
      template.items = Array.from({ length: 22 }, (_, i) => ({
        id: String(25 + i),
        options: [
          { key: 'a', text: 'Option a' },
          { key: 'b', text: 'Option b' },
          { key: 'c', text: 'Option c' },
          { key: 'd', text: 'Option d' }
        ],
        correctAnswer: 'a',
        explanation: ''
      }));
    }

    try {
      const res = await api.createAdminTopic(sec, sub, template);
      const created = res.topic || template;
      setShowAddTopicModal(false);
      setNewTopicForm({ section: sec, subteil: sub, themeTitle: '' });
      setSelectedSection(sec);
      setSelectedSubteil(sub);

      const refreshed = await api.getTopicsData();
      setTopicsData(refreshed);
      setSelectedTopicId(created.id);
      setCurrentTopic(created);
      setStatusMessage({ type: 'success', text: `Neues Thema „${created.themeTitle || title}“ wurde erfolgreich angelegt!` });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err) {
      alert(`Fehler beim Erstellen des Themas: ${err.message}`);
    }
  }

  // --- CRUD helpers for specific structures ---

  function updateField(field, value) {
    setCurrentTopic(prev => ({ ...prev, [field]: value }));
  }

  // Lesen Teil 1
  function updateLv1Option(idx, key, text) {
    setCurrentTopic(prev => {
      const opts = [...(prev.options || [])];
      opts[idx] = { ...opts[idx], key, text };
      return { ...prev, options: opts };
    });
  }

  function addLv1Option() {
    setCurrentTopic(prev => {
      const opts = [...(prev.options || [])];
      const nextKey = String.fromCharCode(97 + opts.length);
      opts.push({ key: nextKey, text: 'Neuer Antwortsatz...' });
      return { ...prev, options: opts };
    });
  }

  function deleteLv1Option(idx) {
    setCurrentTopic(prev => {
      const opts = (prev.options || []).filter((_, i) => i !== idx);
      return { ...prev, options: opts };
    });
  }

  function updateLv1Answer(gapNum, optKey) {
    setCurrentTopic(prev => ({
      ...prev,
      correctAnswers: {
        ...(prev.correctAnswers || {}),
        [gapNum]: optKey.toLowerCase()
      }
    }));
  }

  function updateLv1Explanation(gapNum, text) {
    setCurrentTopic(prev => ({
      ...prev,
      explanations: {
        ...(prev.explanations || {}),
        [gapNum]: text
      }
    }));
  }

  // Lesen Teil 2
  function updateLv2Statement(idx, text) {
    setCurrentTopic(prev => {
      const stats = [...(prev.statements || [])];
      stats[idx] = { ...stats[idx], text };
      return { ...prev, statements: stats };
    });
  }

  function updateLv2Answer(qId, secKey) {
    setCurrentTopic(prev => ({
      ...prev,
      correctAnswers: {
        ...(prev.correctAnswers || {}),
        [qId]: secKey.toLowerCase()
      }
    }));
  }

  // Lesen Teil 3
  function updateLv3Question(idx, field, value) {
    setCurrentTopic(prev => {
      const qs = [...(prev.questions || [])];
      qs[idx] = { ...qs[idx], [field]: value };
      return { ...prev, questions: qs };
    });
  }

  function updateLv3Option(qIdx, optIdx, text) {
    setCurrentTopic(prev => {
      const qs = [...(prev.questions || [])];
      const opts = [...(qs[qIdx].options || [])];
      opts[optIdx] = { ...opts[optIdx], text };
      qs[qIdx].options = opts;
      return { ...prev, questions: qs };
    });
  }

  // Sprachbausteine
  function updateSbOption(itemIdx, optIdx, text) {
    setCurrentTopic(prev => {
      const items = [...(prev.items || [])];
      const opts = [...(items[itemIdx].options || [])];
      opts[optIdx] = { ...opts[optIdx], text };
      items[itemIdx].options = opts;
      return { ...prev, items };
    });
  }

  function updateSbAnswer(itemIdx, correctKey) {
    setCurrentTopic(prev => {
      const items = [...(prev.items || [])];
      items[itemIdx] = { ...items[itemIdx], correctAnswer: correctKey.toLowerCase() };
      return { ...prev, items };
    });
  }

  function updateSbExplanation(itemIdx, text) {
    setCurrentTopic(prev => {
      const items = [...(prev.items || [])];
      items[itemIdx] = { ...items[itemIdx], explanation: text };
      return { ...prev, items };
    });
  }

  // Hörverstehen Teil 1: Statements a–j
  function updateHv1OptionStatement(idx, text) {
    setCurrentTopic(prev => {
      const opts = [...(prev.optionsStatements || [])];
      opts[idx] = { ...opts[idx], text };
      return { ...prev, optionsStatements: opts };
    });
  }

  function addHv1OptionStatement() {
    setCurrentTopic(prev => {
      const opts = [...(prev.optionsStatements || [])];
      const nextKey = String.fromCharCode(97 + opts.length);
      opts.push({ key: nextKey, text: 'Neue Aussage...' });
      return { ...prev, optionsStatements: opts };
    });
  }

  function deleteHv1OptionStatement(idx) {
    setCurrentTopic(prev => {
      const opts = (prev.optionsStatements || []).filter((_, i) => i !== idx);
      return { ...prev, optionsStatements: opts };
    });
  }

  // Hörverstehen Teil 1: Sprecher 1–8
  function updateHv1Item(idx, field, value) {
    setCurrentTopic(prev => {
      const items = [...(prev.items || [])];
      items[idx] = { ...items[idx], [field]: value };
      return { ...prev, items };
    });
  }

  // Hörverstehen Teil 2: Items 55–64 (Multiple Choice a, b, c)
  function updateHv2Item(itemIdx, field, value) {
    setCurrentTopic(prev => {
      const items = [...(prev.items || [])];
      items[itemIdx] = { ...items[itemIdx], [field]: value };
      return { ...prev, items };
    });
  }

  function updateHv2ItemOption(itemIdx, optIdx, text) {
    setCurrentTopic(prev => {
      const items = [...(prev.items || [])];
      const opts = [...(items[itemIdx].options || [])];
      opts[optIdx] = { ...opts[optIdx], text };
      items[itemIdx].options = opts;
      return { ...prev, items };
    });
  }

  function addHv2Item() {
    setCurrentTopic(prev => {
      const items = [...(prev.items || [])];
      const nextId = String(55 + items.length);
      items.push({
        id: nextId,
        question: `Frage ${nextId}...`,
        options: [
          { key: 'a', text: 'Option A' },
          { key: 'b', text: 'Option B' },
          { key: 'c', text: 'Option C' }
        ],
        correctAnswer: 'a',
        explanation: ''
      });
      return { ...prev, items };
    });
  }

  function deleteHv2Item(itemIdx) {
    setCurrentTopic(prev => {
      const items = (prev.items || []).filter((_, i) => i !== itemIdx);
      return { ...prev, items };
    });
  }

  // Hörverstehen Teil 3: Items 65–74 (Transfer Stichpunkte)
  function updateHv3Item(itemIdx, field, value) {
    setCurrentTopic(prev => {
      const items = [...(prev.items || [])];
      items[itemIdx] = { ...items[itemIdx], [field]: value };
      return { ...prev, items };
    });
  }

  function addHv3Item() {
    setCurrentTopic(prev => {
      const items = [...(prev.items || [])];
      const nextId = String(65 + items.length);
      items.push({
        id: nextId,
        question: `Stichpunkt ${nextId}...`,
        answerKey: 'Musterlösung...',
        explanation: ''
      });
      return { ...prev, items };
    });
  }

  function deleteHv3Item(itemIdx) {
    setCurrentTopic(prev => {
      const items = (prev.items || []).filter((_, i) => i !== itemIdx);
      return { ...prev, items };
    });
  }

  const rawList = getTopicsList(topicsData, selectedSection, selectedSubteil);
  const filteredTopics = rawList.filter(t => {
    if (!topicSearch) return true;
    const q = topicSearch.toLowerCase();
    return (t.themeTitle || t.title || '').toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Notifications */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold animate-fadeIn ${
          statusMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* 1. Header with Actions */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
            <Edit3 className="w-3.5 h-3.5" />
            Live Prüfungs- & Aufgaben-Verwaltung (CRUD)
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Themen, Aufgaben, Transkripte & Lösungen verwalten
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wählen Sie einen Prüfungsteil aus, um Aufgaben, Audios, Antwortsätze und offizielle telc C1 Hochschule Lösungen zu bearbeiten oder neue Themen anzulegen.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowAddTopicModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Neues Thema anlegen
          </button>

          <button
            onClick={handleDeleteTopic}
            disabled={!currentTopic}
            className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Thema löschen
          </button>
          
          <button
            onClick={handleSaveChanges}
            disabled={!currentTopic || isSaving}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-95"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Speichere...' : 'Änderungen speichern'}
          </button>
        </div>
      </div>

      {/* 2. Navigation & Selector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Section & Subteil & Topic Picker */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Section Tabs */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              1. Prüfungsteil wählen:
            </label>

            {/* Hörverstehen Group (Purple) */}
            <div className="space-y-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                3. Hörverstehen (telc C1)
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => handleSelectSection('hoerverstehen', 'teil1')}
                  className={`p-2 rounded-xl text-[11px] font-bold transition text-center ${
                    selectedSection === 'hoerverstehen' && selectedSubteil === 'teil1'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-900'
                  }`}
                >
                  Teil 1 (47–54)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSection('hoerverstehen', 'teil2')}
                  className={`p-2 rounded-xl text-[11px] font-bold transition text-center ${
                    selectedSection === 'hoerverstehen' && selectedSubteil === 'teil2'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-900'
                  }`}
                >
                  Teil 2 (55–64)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSection('hoerverstehen', 'teil3')}
                  className={`p-2 rounded-xl text-[11px] font-bold transition text-center ${
                    selectedSection === 'hoerverstehen' && selectedSubteil === 'teil3'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-purple-50 hover:bg-purple-100 text-purple-900'
                  }`}
                >
                  Teil 3 (65–74)
                </button>
              </div>
            </div>

            {/* Leseverstehen Group (Blue) */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                1. Leseverstehen
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => handleSelectSection('leseverstehen', 'teil1')}
                  className={`p-2 rounded-xl text-[11px] font-bold transition text-center ${
                    selectedSection === 'leseverstehen' && selectedSubteil === 'teil1'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Lesen Teil 1
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSection('leseverstehen', 'teil2')}
                  className={`p-2 rounded-xl text-[11px] font-bold transition text-center ${
                    selectedSection === 'leseverstehen' && selectedSubteil === 'teil2'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Lesen Teil 2
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSection('leseverstehen', 'teil3')}
                  className={`p-2 rounded-xl text-[11px] font-bold transition text-center ${
                    selectedSection === 'leseverstehen' && selectedSubteil === 'teil3'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Lesen Teil 3
                </button>
              </div>
            </div>

            {/* Sprachbausteine Group (Indigo) */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                2. Sprachbausteine
              </div>
              <button
                type="button"
                onClick={() => handleSelectSection('sprachbausteine', 'teil1')}
                className={`w-full p-2 rounded-xl text-[11px] font-bold transition text-left ${
                  selectedSection === 'sprachbausteine'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Sprachbausteine Teil 1 (Lücken 25–46)
              </button>
            </div>

          </div>

          {/* Topics List with Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                2. Thema wählen ({filteredTopics.length}):
              </label>
              <button
                type="button"
                onClick={() => setShowAddTopicModal(true)}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" />
                Neu
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Thema filtern..."
                value={topicSearch}
                onChange={(e) => setTopicSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="max-h-[55vh] overflow-y-auto space-y-1.5 pr-1">
              {filteredTopics.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Keine Themen gefunden.
                </div>
              ) : (
                filteredTopics.map((t, i) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTopic(t.id)}
                    className={`w-full p-2.5 rounded-xl text-left transition text-xs flex items-center justify-between gap-2 ${
                      selectedTopicId === t.id
                        ? selectedSection === 'hoerverstehen'
                          ? 'bg-purple-50 border border-purple-300 text-purple-900 font-bold shadow-xs'
                          : selectedSection === 'sprachbausteine'
                          ? 'bg-indigo-50 border border-indigo-300 text-indigo-900 font-bold shadow-xs'
                          : 'bg-blue-50 border border-blue-300 text-blue-900 font-bold shadow-xs'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700 font-medium'
                    }`}
                  >
                    <span className="truncate">{i + 1}. {t.themeTitle || t.title}</span>
                    <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${
                      selectedTopicId === t.id
                        ? selectedSection === 'hoerverstehen' ? 'text-purple-600' : 'text-blue-600'
                        : 'text-slate-300'
                    }`} />
                  </button>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right: The Dynamic Question & Options CRUD Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {!currentTopic ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
              Kein Thema ausgewählt. Wählen Sie links einen Prüfungsteil und ein Thema aus, oder legen Sie ein neues Thema an.
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Topic Metadata Header Form */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Titel des Themas</label>
                    <input
                      type="text"
                      value={currentTopic.themeTitle || currentTopic.title || ''}
                      onChange={(e) => updateField('themeTitle', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Schwierigkeit / Niveau</label>
                    <input
                      type="text"
                      value={currentTopic.difficulty || 'C1 Hochschule'}
                      onChange={(e) => updateField('difficulty', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {selectedSection !== 'hoerverstehen' && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Aufgabenanweisung</label>
                    <input
                      type="text"
                      value={currentTopic.instructions || ''}
                      onChange={(e) => updateField('instructions', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* ============================================================== */}
              {/* SECTION SPECIFIC CRUD: HÖRVERSTEHEN (TEIL 1, TEIL 2, TEIL 3)  */}
              {/* ============================================================== */}
              {selectedSection === 'hoerverstehen' && (
                <div className="space-y-6">

                  {/* Audio Transcript & Speech Synthesis Tester */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <Volume2 className="w-4 h-4 text-purple-600" />
                          <span>Hörtext-Transkription (Audioaufnahme)</span>
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Dieser Text wird im Prüfungslauf von der Sprachausgabe vorgelesen und den Prüflingen als Audio präsentiert.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleToggleAudioTest}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                          isPlayingAudio
                            ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                        }`}
                      >
                        {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        {isPlayingAudio ? 'Wiedergabe stoppen' : 'Audio-Vorschau testen'}
                      </button>
                    </div>

                    <textarea
                      rows={8}
                      value={currentTopic.audioTranscript || ''}
                      onChange={(e) => updateField('audioTranscript', e.target.value)}
                      placeholder="Transkription des Hörexemplars..."
                      className="w-full p-3 bg-purple-50/40 border border-purple-200 rounded-2xl text-xs text-purple-950 leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans"
                    />
                  </div>

                  {/* SUBTEIL 1: GLOBALVERSTEHEN (Statements a–j & Sprecher 47–54) */}
                  {selectedSubteil === 'teil1' && (
                    <div className="space-y-6">
                      
                      {/* Statements Palette a-j */}
                      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <span>Aussagen (Optionen a–j)</span>
                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                              {currentTopic.optionsStatements?.length || 0} Aussagen
                            </span>
                          </h3>
                          <button
                            type="button"
                            onClick={addHv1OptionStatement}
                            className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Aussage hinzufügen
                          </button>
                        </div>

                        <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                          {currentTopic.optionsStatements?.map((stmt, idx) => (
                            <div key={stmt.key || idx} className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                                {stmt.key}
                              </span>
                              <input
                                type="text"
                                value={stmt.text}
                                onChange={(e) => updateHv1OptionStatement(idx, e.target.value)}
                                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              />
                              <button
                                type="button"
                                onClick={() => deleteHv1OptionStatement(idx)}
                                className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                                title="Aussage löschen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Items 47-54 (Sprecher 1-8) */}
                      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                          <span>Aufgaben 47–54 (Sprecher 1–8 Zuordnungen)</span>
                          <span className="text-xs text-slate-400 font-normal">8 Sprecher • 2 Distraktoren</span>
                        </h3>

                        <div className="space-y-3">
                          {currentTopic.items?.map((item, idx) => {
                            const matchedStmt = currentTopic.optionsStatements?.find(s => s.key === item.correctAnswer);

                            return (
                              <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-md bg-purple-700 text-white font-black text-xs flex items-center justify-center">
                                      {item.id}
                                    </span>
                                    <input
                                      type="text"
                                      value={item.prompt}
                                      onChange={(e) => updateHv1Item(idx, 'prompt', e.target.value)}
                                      className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                    />
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-500">Lösung (Aussage):</span>
                                    <select
                                      value={item.correctAnswer || 'a'}
                                      onChange={(e) => updateHv1Item(idx, 'correctAnswer', e.target.value.toLowerCase())}
                                      className="px-2.5 py-1 bg-purple-100 border border-purple-400 rounded-lg text-xs font-black text-purple-900 uppercase"
                                    >
                                      {currentTopic.optionsStatements?.map(s => (
                                        <option key={s.key} value={s.key}>
                                          Aussage [{s.key.toUpperCase()}]
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                {matchedStmt && (
                                  <div className="p-2.5 bg-white rounded-xl border border-purple-200 text-xs text-purple-900 italic font-medium">
                                    „{matchedStmt.text}“
                                  </div>
                                )}

                                <input
                                  type="text"
                                  placeholder="Erklärung für die Scorecard..."
                                  value={item.explanation || ''}
                                  onChange={(e) => updateHv1Item(idx, 'explanation', e.target.value)}
                                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* SUBTEIL 2: DETAILVERSTEHEN (Aufgaben 55–64: Multiple Choice a, b, c) */}
                  {selectedSubteil === 'teil2' && (
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>Aufgaben 55–64 (Multiple-Choice a, b, c)</span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                            {currentTopic.items?.length || 0} Fragen
                          </span>
                        </h3>
                        <button
                          type="button"
                          onClick={addHv2Item}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Frage hinzufügen
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                        {currentTopic.items?.map((item, itemIdx) => (
                          <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-md bg-purple-700 text-white font-black text-xs flex items-center justify-center">
                                  {item.id}
                                </span>
                                <span className="text-xs font-bold text-slate-800">Fragetext:</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">Richtige Lösung:</span>
                                <select
                                  value={item.correctAnswer || 'a'}
                                  onChange={(e) => updateHv2Item(itemIdx, 'correctAnswer', e.target.value.toLowerCase())}
                                  className="px-2.5 py-1 bg-purple-100 border border-purple-400 rounded-lg text-xs font-black text-purple-900 uppercase"
                                >
                                  {['a', 'b', 'c'].map(optKey => (
                                    <option key={optKey} value={optKey}>
                                      Option [{optKey.toUpperCase()}]
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => deleteHv2Item(itemIdx)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                                  title="Frage löschen"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={item.question || ''}
                              onChange={(e) => updateHv2Item(itemIdx, 'question', e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />

                            {/* Options a, b, c */}
                            <div className="space-y-1.5 pl-2 border-l-2 border-purple-200">
                              {item.options?.map((opt, optIdx) => (
                                <div key={opt.key} className="flex items-center gap-2">
                                  <span className={`w-5 text-center text-xs font-extrabold uppercase ${opt.key === item.correctAnswer ? 'text-purple-700' : 'text-slate-400'}`}>
                                    {opt.key})
                                  </span>
                                  <input
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) => updateHv2ItemOption(itemIdx, optIdx, e.target.value)}
                                    className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs ${
                                      opt.key === item.correctAnswer
                                        ? 'bg-purple-50 border-purple-300 font-semibold text-purple-950'
                                        : 'bg-white border-slate-200 text-slate-800'
                                    }`}
                                  />
                                </div>
                              ))}
                            </div>

                            <input
                              type="text"
                              placeholder="Erklärung für die Scorecard..."
                              value={item.explanation || ''}
                              onChange={(e) => updateHv2Item(itemIdx, 'explanation', e.target.value)}
                              className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUBTEIL 3: INFORMATIONSTRANSFER (Aufgaben 65–74) */}
                  {selectedSubteil === 'teil3' && (
                    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span>Aufgaben 65–74 (Informationstransfer / Stichpunkte)</span>
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                            {currentTopic.items?.length || 0} Aufgaben
                          </span>
                        </h3>
                        <button
                          type="button"
                          onClick={addHv3Item}
                          className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Aufgabe hinzufügen
                        </button>
                      </div>

                      <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
                        {currentTopic.items?.map((item, itemIdx) => (
                          <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="w-6 h-6 rounded-md bg-purple-700 text-white font-black text-xs flex items-center justify-center">
                                {item.id}
                              </span>
                              <button
                                type="button"
                                onClick={() => deleteHv3Item(itemIdx)}
                                className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition"
                                title="Aufgabe löschen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-slate-500">Stichpunkt / Leitfrage</label>
                              <input
                                type="text"
                                value={item.question || ''}
                                onChange={(e) => updateHv3Item(itemIdx, 'question', e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-slate-500">Musterlösung / Erwartete Schlüsselbegriffe</label>
                              <input
                                type="text"
                                value={item.answerKey || item.correctAnswer || ''}
                                onChange={(e) => updateHv3Item(itemIdx, 'answerKey', e.target.value)}
                                className="w-full px-3 py-1.5 bg-purple-50 border border-purple-300 rounded-xl text-xs font-bold text-purple-950 focus:outline-none focus:ring-1 focus:ring-purple-500"
                              />
                            </div>

                            <input
                              type="text"
                              placeholder="Erklärung..."
                              value={item.explanation || ''}
                              onChange={(e) => updateHv3Item(itemIdx, 'explanation', e.target.value)}
                              className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ============================================================== */}
              {/* SECTION SPECIFIC CRUD: LESEN TEIL 1 (Rekonstruktion a–h)      */}
              {/* ============================================================== */}
              {selectedSection === 'leseverstehen' && selectedSubteil === 'teil1' && (
                <div className="space-y-6">
                  
                  {/* Options CRUD (A–H) */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>Antwortsätze (Optionen a–h)</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          {currentTopic.options?.length || 0} Optionen
                        </span>
                      </h3>
                      <button
                        type="button"
                        onClick={addLv1Option}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Option hinzufügen
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {currentTopic.options?.map((opt, idx) => (
                        <div key={opt.key || idx} className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 uppercase">
                            {opt.key}
                          </span>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => updateLv1Option(idx, opt.key, e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => deleteLv1Option(idx)}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                            title="Option löschen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lücken 1–6 & Offizielle Lösungen */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Offizielle Lösungen & Erklärungen für Lücken [1] bis [6]
                    </h3>

                    <div className="space-y-3">
                      {['1', '2', '3', '4', '5', '6'].map((gapNum) => {
                        const currentAns = (currentTopic.correctAnswers || {})[gapNum] || '';
                        const currentExp = (currentTopic.explanations || {})[gapNum] || '';
                        const matchedOpt = currentTopic.options?.find(o => o.key.toLowerCase() === currentAns.toLowerCase());

                        return (
                          <div key={gapNum} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs text-blue-900">
                                Lücke [{gapNum}]
                              </span>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">Lösung:</span>
                                <select
                                  value={currentAns}
                                  onChange={(e) => updateLv1Answer(gapNum, e.target.value)}
                                  className="px-2.5 py-1 bg-white border border-blue-400 rounded-lg text-xs font-black text-blue-700 uppercase"
                                >
                                  <option value="">--</option>
                                  {currentTopic.options?.map(o => (
                                    <option key={o.key} value={o.key}>
                                      {o.key.toUpperCase()}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {matchedOpt && (
                              <p className="text-xs text-slate-700 italic bg-white p-2 rounded-lg border border-slate-200">
                                „{matchedOpt.text}“
                              </p>
                            )}

                            <input
                              type="text"
                              placeholder="Erklärung für die Scorecard..."
                              value={currentExp}
                              onChange={(e) => updateLv1Explanation(gapNum, e.target.value)}
                              className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lesetext mit Lücken */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">Lesetext mit Lücken-Markierungen [1]–[6]</h3>
                    <textarea
                      rows={10}
                      value={currentTopic.textWithGaps || ''}
                      onChange={(e) => updateField('textWithGaps', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                </div>
              )}

              {/* ============================================================== */}
              {/* SECTION SPECIFIC CRUD: LESEN TEIL 2 (Texte a–e & Aussagen 7–12) */}
              {/* ============================================================== */}
              {selectedSection === 'leseverstehen' && selectedSubteil === 'teil2' && (
                <div className="space-y-6">
                  
                  {/* Statements (7–12) CRUD */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Aussagen 7–12 & Zuordnung zu Texten (A–E oder -)
                    </h3>

                    <div className="space-y-3">
                      {currentTopic.statements?.map((st, idx) => {
                        const currentAns = (currentTopic.correctAnswers || {})[st.id] || '';

                        return (
                          <div key={st.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs text-blue-900 flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                                  {st.id}
                                </span>
                                <span>Aussage {st.id}</span>
                              </span>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-500">Zugeordneter Text:</span>
                                <select
                                  value={currentAns}
                                  onChange={(e) => updateLv2Answer(st.id, e.target.value)}
                                  className="px-2 py-1 bg-white border border-blue-400 rounded-lg text-xs font-black text-blue-700 uppercase"
                                >
                                  <option value="-">- (kein Text)</option>
                                  <option value="a">Text A</option>
                                  <option value="b">Text B</option>
                                  <option value="c">Text C</option>
                                  <option value="d">Text D</option>
                                  <option value="e">Text E</option>
                                </select>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={st.text}
                              onChange={(e) => updateLv2Statement(idx, e.target.value)}
                              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5 Kurztexte (A–E) */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Die 5 wissenschaftlichen Kurztexte (A–E)
                    </h3>

                    <div className="space-y-4">
                      {currentTopic.texts?.map((tObj, idx) => (
                        <div key={tObj.key} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-blue-600 text-white font-black text-xs flex items-center justify-center uppercase">
                              {tObj.key}
                            </span>
                            <input
                              type="text"
                              value={tObj.title}
                              onChange={(e) => {
                                const newTexts = [...currentTopic.texts];
                                newTexts[idx].title = e.target.value;
                                updateField('texts', newTexts);
                              }}
                              className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                            />
                          </div>
                          <textarea
                            rows={4}
                            value={tObj.content}
                            onChange={(e) => {
                              const newTexts = [...currentTopic.texts];
                              newTexts[idx].content = e.target.value;
                              updateField('texts', newTexts);
                            }}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed font-sans"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ============================================================== */}
              {/* SECTION SPECIFIC CRUD: LESEN TEIL 3 (Aufgaben 13–24)          */}
              {/* ============================================================== */}
              {selectedSection === 'leseverstehen' && selectedSubteil === 'teil3' && (
                <div className="space-y-6">
                  
                  {/* Article Text */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">Fachzeitschriftenartikel (Lesetext)</h3>
                    <textarea
                      rows={10}
                      value={currentTopic.articleText || ''}
                      onChange={(e) => updateField('articleText', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                    />
                  </div>

                  {/* 10 Fragen (13–22 & 24) */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Fragen 13–24 & Richtige Antwort (richtig / falsch / nicht im Text)
                    </h3>

                    <div className="space-y-3">
                      {currentTopic.questions?.map((q, idx) => (
                        <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-blue-900 flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">
                                {q.id}
                              </span>
                              <span>Aufgabe {q.id}</span>
                            </span>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-500">Lösung:</span>
                              <select
                                value={q.correctAnswer}
                                onChange={(e) => updateLv3Question(idx, 'correctAnswer', e.target.value)}
                                className="px-2 py-1 bg-white border border-blue-400 rounded-lg text-xs font-black text-blue-700"
                              >
                                {q.id === '24' ? (
                                  <>
                                    <option value="a">a (Überschrift 1)</option>
                                    <option value="b">b (Überschrift 2)</option>
                                    <option value="c">c (Überschrift 3)</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="a">a (richtig)</option>
                                    <option value="b">b (falsch)</option>
                                    <option value="c">c (nicht im Text)</option>
                                  </>
                                )}
                              </select>
                            </div>
                          </div>

                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) => updateLv3Question(idx, 'question', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />

                          {q.id === '24' && q.options && (
                            <div className="space-y-1.5 pl-4 border-l-2 border-blue-200 mt-2">
                              {q.options.map((opt, optIdx) => (
                                <div key={opt.key} className="flex items-center gap-2">
                                  <span className="font-bold text-xs text-blue-700">{opt.key})</span>
                                  <input
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) => updateLv3Option(idx, optIdx, e.target.value)}
                                    className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* ============================================================== */}
              {/* SECTION SPECIFIC CRUD: SPRACHBAUSTEINE (22 Lücken 25–46)      */}
              {/* ============================================================== */}
              {selectedSection === 'sprachbausteine' && (
                <div className="space-y-6">
                  
                  {/* Template text */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">Lückentext-Vorlage</h3>
                    <textarea
                      rows={8}
                      value={currentTopic.textTemplate || ''}
                      onChange={(e) => updateField('textTemplate', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  {/* 22 Items */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Lücken & Antwortoptionen (25–46)
                    </h3>

                    <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                      {currentTopic.items?.map((item, itemIdx) => (
                        <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-indigo-900 flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                                {item.id}
                              </span>
                              <span>Lücke [{item.id}]</span>
                            </span>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-500">Korrekte Option:</span>
                              <select
                                value={item.correctAnswer}
                                onChange={(e) => updateSbAnswer(itemIdx, e.target.value)}
                                className="px-2 py-1 bg-white border border-indigo-400 rounded-lg text-xs font-black text-indigo-700"
                              >
                                {item.options?.map(o => (
                                  <option key={o.key} value={o.key}>
                                    {o.key.toUpperCase()}: {o.text}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {item.options?.map((opt, optIdx) => (
                              <div key={opt.key} className="space-y-1">
                                <span className={`text-[10px] font-extrabold uppercase ${opt.key === item.correctAnswer ? 'text-indigo-600' : 'text-slate-400'}`}>
                                  Option {opt.key.toUpperCase()} {opt.key === item.correctAnswer && '✓'}
                                </span>
                                <input
                                  type="text"
                                  value={opt.text}
                                  onChange={(e) => updateSbOption(itemIdx, optIdx, e.target.value)}
                                  className={`w-full px-2.5 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                                    opt.key === item.correctAnswer ? 'bg-indigo-50/70 border-indigo-300 font-bold text-indigo-950' : 'bg-white border-slate-200 text-slate-800'
                                  }`}
                                />
                              </div>
                            ))}
                          </div>

                          <input
                            type="text"
                            placeholder="Erklärung für die Scorecard..."
                            value={item.explanation || ''}
                            onChange={(e) => updateSbExplanation(itemIdx, e.target.value)}
                            className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}
        </div>

      </div>

      {/* MODAL: Neues Thema anlegen */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Neues Thema anlegen</h3>
              </div>
              <button
                onClick={() => setShowAddTopicModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">1. Prüfungsteil</label>
                <select
                  value={newTopicForm.section}
                  onChange={(e) => {
                    const sec = e.target.value;
                    setNewTopicForm(prev => ({
                      ...prev,
                      section: sec,
                      subteil: 'teil1'
                    }));
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="hoerverstehen">3. Hörverstehen (Audio & Sprecher)</option>
                  <option value="leseverstehen">1. Leseverstehen</option>
                  <option value="sprachbausteine">2. Sprachbausteine</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">2. Unterteil</label>
                <select
                  value={newTopicForm.subteil}
                  onChange={(e) => setNewTopicForm(prev => ({ ...prev, subteil: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {newTopicForm.section === 'hoerverstehen' && (
                    <>
                      <option value="teil1">Teil 1: Globalverstehen (Aufgaben 47–54)</option>
                      <option value="teil2">Teil 2: Detailverstehen (Aufgaben 55–64)</option>
                      <option value="teil3">Teil 3: Informationstransfer (Aufgaben 65–74)</option>
                    </>
                  )}
                  {newTopicForm.section === 'leseverstehen' && (
                    <>
                      <option value="teil1">Teil 1: Rekonstruktion (Lücken 1–6)</option>
                      <option value="teil2">Teil 2: Selektiv (Aussagen 7–12)</option>
                      <option value="teil3">Teil 3: Detailverstehen (Aufgaben 13–24)</option>
                    </>
                  )}
                  {newTopicForm.section === 'sprachbausteine' && (
                    <option value="teil1">Teil 1: Grammatik & Wortschatz (Lücken 25–46)</option>
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">3. Thementitel</label>
                <input
                  type="text"
                  placeholder="z.B. Künstliche Intelligenz im Hochschulalltag"
                  value={newTopicForm.themeTitle}
                  onChange={(e) => setNewTopicForm(prev => ({ ...prev, themeTitle: e.target.value }))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddTopicModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleCreateNewTopic}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Thema anlegen & bearbeiten
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
