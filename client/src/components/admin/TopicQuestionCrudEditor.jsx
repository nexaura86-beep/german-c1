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
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
  FileText
} from 'lucide-react';

export function TopicQuestionCrudEditor() {
  const [topicsData, setTopicsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Selection states
  const [selectedSection, setSelectedSection] = useState('leseverstehen');
  const [selectedSubteil, setSelectedSubteil] = useState('teil1');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [topicSearch, setTopicSearch] = useState('');

  // Working topic state
  const [currentTopic, setCurrentTopic] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    loadTopics();
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

  // --- CRUD helpers for specific structures ---

  // Update top-level field
  function updateField(field, value) {
    setCurrentTopic(prev => ({ ...prev, [field]: value }));
  }

  // Option text / key update for Teil 1
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
      const nextKey = String.fromCharCode(97 + opts.length); // a, b, c, ...
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

  // Teil 2 statement update
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

  // Teil 3 question update
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

  // Sprachbausteine option & answer update
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
            Live Aufgaben- & Optionen-Verwaltung (CRUD)
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Fragen, Antwortoptionen & Lösungen bearbeiten
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Wählen Sie ein beliebiges Thema aus, um Fragetexte, Antwortoptionen (a–h, a–e, richtig/falsch), offizielle Lösungen und Erklärungen direkt anzupassen.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
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
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm disabled:opacity-50"
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
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectSection('leseverstehen', 'teil1')}
                className={`p-2 rounded-xl text-xs font-bold transition text-left ${
                  selectedSection === 'leseverstehen' && selectedSubteil === 'teil1' ? 'bg-blue-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Lesen Teil 1
              </button>
              <button
                type="button"
                onClick={() => handleSelectSection('leseverstehen', 'teil2')}
                className={`p-2 rounded-xl text-xs font-bold transition text-left ${
                  selectedSection === 'leseverstehen' && selectedSubteil === 'teil2' ? 'bg-blue-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Lesen Teil 2
              </button>
              <button
                type="button"
                onClick={() => handleSelectSection('leseverstehen', 'teil3')}
                className={`p-2 rounded-xl text-xs font-bold transition text-left ${
                  selectedSection === 'leseverstehen' && selectedSubteil === 'teil3' ? 'bg-blue-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Lesen Teil 3
              </button>
              <button
                type="button"
                onClick={() => handleSelectSection('sprachbausteine', 'teil1')}
                className={`p-2 rounded-xl text-xs font-bold transition text-left ${
                  selectedSection === 'sprachbausteine' ? 'bg-indigo-600 text-white' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                Sprachbausteine
              </button>
            </div>
          </div>

          {/* Topics List with Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                2. Thema auswählen ({filteredTopics.length}):
              </label>
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
              {filteredTopics.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSelectTopic(t.id)}
                  className={`w-full p-2.5 rounded-xl text-left transition text-xs flex items-center justify-between gap-2 ${
                    selectedTopicId === t.id
                      ? 'bg-blue-50 border border-blue-300 text-blue-900 font-bold shadow-xs'
                      : 'hover:bg-slate-50 border border-transparent text-slate-700 font-medium'
                  }`}
                >
                  <span className="truncate">{i + 1}. {t.themeTitle || t.title}</span>
                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${selectedTopicId === t.id ? 'text-blue-600' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right: The Dynamic Question & Options CRUD Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {!currentTopic ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400 text-xs">
              Kein Thema ausgewählt. Wählen Sie links einen Prüfungsteil und ein Thema aus.
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
                    <label className="text-[11px] font-bold text-slate-500 uppercase">Bearbeitungszeit</label>
                    <input
                      type="text"
                      value={currentTopic.readingTime || ''}
                      onChange={(e) => updateField('readingTime', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">Aufgabenanweisung</label>
                  <input
                    type="text"
                    value={currentTopic.instructions || ''}
                    onChange={(e) => updateField('instructions', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

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

                    <div className="space-y-3">
                      {currentTopic.options?.map((opt, idx) => (
                        <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-black uppercase">
                                {opt.key}
                              </span>
                              <span className="text-xs font-bold text-slate-700">Option {opt.key.toUpperCase()}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => deleteLv1Option(idx)}
                              className="text-slate-400 hover:text-red-600 text-xs p-1"
                              title="Option löschen"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <textarea
                            rows={2}
                            value={opt.text}
                            onChange={(e) => updateLv1Option(idx, opt.key, e.target.value)}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium leading-relaxed"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lücken 1–6 Answers & Explanations */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Offizielle Lösungen & Erklärungen für Lücken 1–6
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {['1', '2', '3', '4', '5', '6'].map(gap => {
                        const correctVal = currentTopic.correctAnswers?.[gap] || '';
                        const explanation = currentTopic.explanations?.[gap] || '';

                        return (
                          <div key={gap} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs text-slate-900">
                                Lücke [{gap}]
                              </span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[11px] font-bold text-slate-500">Lösung:</span>
                                <select
                                  value={correctVal}
                                  onChange={(e) => updateLv1Answer(gap, e.target.value)}
                                  className="px-2 py-1 bg-white border border-blue-400 rounded-lg text-xs font-black text-blue-700"
                                >
                                  <option value="">Wähle...</option>
                                  {currentTopic.options?.map(o => (
                                    <option key={o.key} value={o.key}>
                                      Satz {o.key.toUpperCase()}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <input
                              type="text"
                              placeholder="Erklärung / Begründung für die Scorecard..."
                              value={explanation}
                              onChange={(e) => updateLv1Explanation(gap, e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              )}

              {/* ============================================================== */}
              {/* SECTION SPECIFIC CRUD: LESEN TEIL 2 (Aussagen 7–12 -> a–e)    */}
              {/* ============================================================== */}
              {selectedSection === 'leseverstehen' && selectedSubteil === 'teil2' && (
                <div className="space-y-6">
                  
                  {/* Statements 7 to 12 CRUD */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Aussagen / Intentionen 7–12
                    </h3>

                    <div className="space-y-3">
                      {currentTopic.statements?.map((stmt, idx) => {
                        const ans = currentTopic.correctAnswers?.[stmt.id] || '';

                        return (
                          <div key={stmt.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center text-[11px] font-black">
                                  {stmt.id}
                                </span>
                                <span>Aufgabe {stmt.id}</span>
                              </span>

                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-500">Richtig in Absatz:</span>
                                <select
                                  value={ans}
                                  onChange={(e) => updateLv2Answer(stmt.id, e.target.value)}
                                  className="px-2 py-1 bg-white border border-blue-400 rounded-lg text-xs font-black text-blue-700"
                                >
                                  {['a', 'b', 'c', 'd', 'e'].map(sec => (
                                    <option key={sec} value={sec}>
                                      Absatz {sec.toUpperCase()}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <input
                              type="text"
                              value={stmt.text}
                              onChange={(e) => updateLv2Statement(idx, e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Texts a-e */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Textabschnitte (a–e)</h3>
                    {currentTopic.texts?.map((t, idx) => (
                      <div key={t.id} className="space-y-1.5">
                        <label className="text-xs font-bold text-blue-700 uppercase">
                          Absatz {t.id.toUpperCase()}
                        </label>
                        <textarea
                          rows={4}
                          value={t.text}
                          onChange={(e) => {
                            const newTexts = [...currentTopic.texts];
                            newTexts[idx].text = e.target.value;
                            setCurrentTopic(prev => ({ ...prev, texts: newTexts }));
                          }}
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ============================================================== */}
              {/* SECTION SPECIFIC CRUD: LESEN TEIL 3 (Aufgaben 13–24)          */}
              {/* ============================================================== */}
              {selectedSection === 'leseverstehen' && selectedSubteil === 'teil3' && (
                <div className="space-y-6">
                  
                  {/* Reading text */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">Lesetext</h3>
                    <textarea
                      rows={6}
                      value={currentTopic.text || ''}
                      onChange={(e) => updateField('text', e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  {/* Questions 13 to 24 */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">
                      Aufgaben 13–23 (Richtig / Falsch / Nicht im Text) & 24 (Überschrift)
                    </h3>

                    <div className="space-y-3">
                      {currentTopic.questions?.map((q, idx) => (
                        <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-slate-900 flex items-center gap-1.5">
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

                          {/* If question 24, also show the 3 title options */}
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

                          {/* 4 Options Grid */}
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

    </div>
  );
}
