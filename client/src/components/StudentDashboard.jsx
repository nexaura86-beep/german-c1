import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import {
  BookOpen,
  Layers,
  Volume2,
  PenTool,
  Mic,
  Award,
  Clock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Play,
  FileText,
  HelpCircle,
  FolderOpen,
  Search
} from 'lucide-react';
import { PendingApprovalBanner } from './PendingApprovalBanner.jsx';
import { SprachlicheMerkmaleModal } from './exam/SprachlicheMerkmaleModal.jsx';

export function StudentDashboard({ onSelectTopicTheme, onSwitchToAdmin }) {
  const { user } = useAuth();
  const [topicsData, setTopicsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Selected Section & Subteil state for the theme selector view
  const [activeSection, setActiveSection] = useState('leseverstehen'); // 'leseverstehen', 'sprachbausteine', 'hoerverstehen', 'schriftlicherAusdruck', 'muendlicherAusdruck'
  const [activeSubteil, setActiveSubteil] = useState('teil1'); // 'teil1', 'teil2', 'teil3', etc.

  useEffect(() => {
    loadTopics();
  }, []);

  async function loadTopics() {
    try {
      const data = await api.getTopicsData();
      setTopicsData(data);
    } catch (err) {
      console.error('Failed to load topics:', err);
    } finally {
      setLoading(false);
    }
  }

  const sectionsConfig = [
    {
      id: 'leseverstehen',
      name: '1. Leseverstehen',
      shortName: 'Lesen',
      icon: BookOpen,
      color: 'blue',
      points: '48 Punkte',
      time: '90 Min',
      subteile: [
        { id: 'teil1', label: 'Lesen Teil 1', desc: 'Rekonstruktion eines Textes (Sätze A–H in Lücken 1–6)' },
        { id: 'teil2', label: 'Lesen Teil 2', desc: 'Selektives Verstehen (Zuordnung Aussagen 7–12 zu Texten A–E)' },
        { id: 'teil3', label: 'Lesen Teil 3', desc: 'Detailverstehen (Aufgaben 13–22: richtig / falsch / nicht im Text)' }
      ]
    },
    {
      id: 'sprachbausteine',
      name: '2. Sprachbausteine',
      shortName: 'Sprachbausteine',
      icon: Layers,
      color: 'indigo',
      points: '22 Punkte',
      time: '30 Min',
      subteile: [
        { id: 'teil1', label: 'Sprachbausteine Teil 1', desc: '22 akademische Grammatik- & Wortschatz-Lücken' }
      ]
    },
    {
      id: 'hoerverstehen',
      name: '3. Hörverstehen',
      shortName: 'Hören',
      icon: Volume2,
      color: 'purple',
      points: '48 Punkte',
      time: '40 Min',
      subteile: [
        { id: 'teil1', label: 'Hören Teil 1', desc: 'Globalverstehen (Podiumsdiskussion & Sprecher)' },
        { id: 'teil2', label: 'Hören Teil 2', desc: 'Detailverstehen (Experteninterview Richtig/Falsch)' },
        { id: 'teil3', label: 'Hören Teil 3', desc: 'Informationstransfer (Fachvortrag Stichpunkte)' }
      ]
    },
    {
      id: 'schriftlicherAusdruck',
      name: '4. Schriftlicher Ausdruck',
      shortName: 'Schreiben',
      icon: PenTool,
      color: 'rose',
      points: '48 Punkte',
      time: '70 Min',
      subteile: [
        { id: 'essay', label: 'Schriftlicher Aufsatz', desc: 'Wissenschaftliche Erörterung mit Sofort-KI-Bewertung' }
      ]
    },
    {
      id: 'muendlicherAusdruck',
      name: '5. Mündlicher Ausdruck',
      shortName: 'Sprechen',
      icon: Mic,
      color: 'teal',
      points: '48 Punkte',
      time: '20 Min',
      subteile: [
        { id: 'teil1A', label: 'Sprechen Teil 1A', desc: 'Präsentation (3 Min)' },
        { id: 'teil1B', label: 'Sprechen Teil 1B', desc: 'Nachfragen & Zusammenfassung (2 Min)' },
        { id: 'teil2', label: 'Sprechen Teil 2', desc: 'Kontroverse Diskussion (6 Min)' }
      ]
    }
  ];

  const currentSecConfig = sectionsConfig.find(s => s.id === activeSection) || sectionsConfig[0];

  // Get themes for the active subteil
  let rawThemesList = [];
  if (topicsData) {
    if (activeSection === 'schriftlicherAusdruck') {
      rawThemesList = topicsData.schriftlicherAusdruck?.topics || [];
    } else if (topicsData[activeSection]?.[activeSubteil]?.topics) {
      rawThemesList = topicsData[activeSection][activeSubteil].topics;
    }
  }

  const currentThemesList = rawThemesList.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = (t.themeTitle || t.title || '').toLowerCase();
    const inst = (t.instructions || t.prompt || '').toLowerCase();
    return title.includes(q) || inst.includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn pb-12">
      
      {/* Account Pending Activation Banner (if applicable) */}
      {user?.status === 'pending' && (
        <PendingApprovalBanner onSwitchToAdmin={onSwitchToAdmin} />
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-bold border border-white/10 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              telc Deutsch C1 Hochschule Modulportal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Prüfungsteil wählen & Thema öffnen
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Wählen Sie oben den gewünschten Prüfungsteil (z.B. <strong className="text-white">Lesen 1, 2, 3</strong>) und öffnen Sie direkt das gewünschte Übungsthema. Nach der Bearbeitung erhalten Sie eine <strong className="text-sky-300">sofortige Auswertung (Instant Scorecard)</strong>.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur px-5 py-3 rounded-2xl border border-white/15 text-center shrink-0">
            <div className="text-xs text-sky-200 font-semibold uppercase">Bestehensgrenze</div>
            <div className="text-xl font-black text-white">≥ 60% Punkte</div>
          </div>
        </div>
      </div>

      {/* 1. TOP SECTION SELECTOR (LESEN, SPRACHBAUSTEINE, HÖREN, SCHREIBEN, SPRECHEN) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {sectionsConfig.map(sec => {
          const Icon = sec.icon;
          const isSelected = activeSection === sec.id;

          return (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSection(sec.id);
                setActiveSubteil(sec.subteile[0].id);
              }}
              className={`p-4 rounded-2xl border transition text-left flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/40'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-blue-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {sec.points}
                </span>
              </div>

              <div>
                <div className="font-extrabold text-sm">{sec.name}</div>
                <div className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {sec.subteile.length} {sec.subteile.length === 1 ? 'Teil' : 'Teile (1, 2, 3)'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 2. SUB-TEIL TABS (e.g. If Lesen is selected -> shows LESEN 1, LESEN 2, LESEN 3) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>{currentSecConfig.name}</span>
              <span className="text-xs font-semibold text-slate-400">• Wählen Sie den Prüfungsteil</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Klicken Sie auf einen Teil, um die verfügbaren Themen und Übungstexte anzuzeigen.
            </p>
          </div>

          {/* Subteile Pill buttons */}
          <div className="flex flex-wrap gap-2">
            {currentSecConfig.subteile.map(sub => {
              const isSubActive = activeSubteil === sub.id;

              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubteil(sub.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm ${
                    isSubActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. THEMES / TOPICS LIST FOR THE SELECTED TEIL */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-blue-600" />
              <span>Verfügbare Themen & Texte für {currentSecConfig.subteile.find(s => s.id === activeSubteil)?.label || activeSubteil}:</span>
            </div>
            
            <div className="flex items-center gap-2">
              {activeSection === 'leseverstehen' && activeSubteil === 'teil2' && (
                <button
                  onClick={() => setIsGuideOpen(true)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sprachliche Merkmale (Leitfaden LV2)</span>
                </button>
              )}
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                {currentThemesList.length} {currentThemesList.length === 1 ? 'Thema' : 'Themen'} bereit
              </span>
            </div>
          </div>

          {/* Search bar for topics */}
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Thema nach Titel filtern (z.B. KI, Sprache, Psychologie)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Lade Themenkatalog...</div>
          ) : currentThemesList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              {searchQuery ? 'Keine Themen gefunden, die dem Suchbegriff entsprechen.' : 'Noch keine Themen in diesem Teil vorhanden.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentThemesList.map((theme, idx) => (
                <div
                  key={theme.id || idx}
                  className="bg-slate-50/70 hover:bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between gap-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800">
                        {theme.difficulty || 'C1 Hochschule'}
                      </span>
                      {theme.readingTime && (
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {theme.readingTime}
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition leading-snug">
                      {theme.themeTitle || theme.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {theme.instructions || theme.prompt || 'Originalgetreue Aufgabenstellung nach telc C1 Hochschulstandard.'}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectTopicTheme(activeSection, activeSubteil, theme)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2 group-hover:shadow-md"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    Thema bearbeiten & starten
                    <ChevronRight className="w-4 h-4 text-blue-200 ml-1" />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Sprachliche Merkmale LV2 Modal */}
      <SprachlicheMerkmaleModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}
