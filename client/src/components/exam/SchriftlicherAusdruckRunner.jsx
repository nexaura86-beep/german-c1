import React, { useState } from 'react';
import { PenTool, Sparkles, ArrowLeft, BookOpen, Clock, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { api } from '../../services/api.js';

export function SchriftlicherAusdruckRunner({ topicData, onBack, onChooseOtherTheme }) {
  const [selectedThemeKey, setSelectedThemeKey] = useState('theme1'); // 'theme1' or 'theme2'
  const [essayText, setEssayText] = useState('');
  const [grading, setGrading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showPhrases, setShowPhrases] = useState(false);

  if (!topicData) {
    return <div className="p-8 text-center text-slate-500">Kein Thema ausgewählt.</div>;
  }

  // Determine active theme (supports both dual-theme format and legacy single format)
  const activeTheme = topicData[selectedThemeKey] || topicData;
  const hasMultipleThemes = Boolean(topicData.theme1 && topicData.theme2);

  const words = essayText.trim().split(/\s+/).filter(Boolean);
  const wordCount = essayText.trim().length === 0 ? 0 : words.length;

  async function handleGradeWithAI() {
    if (wordCount < 20) {
      alert("Bitte schreiben Sie mindestens einen kurzen Text (empfohlen: ca. 350 Wörter).");
      return;
    }

    setGrading(true);
    try {
      const data = await api.gradeEssayWithAI({
        topicTitle: activeTheme.title || topicData.themeTitle,
        topicPrompt: activeTheme.prompt,
        studentEssay: essayText
      });
      setEvaluation(data.evaluation);
    } catch (err) {
      alert(`Fehler bei der KI-Bewertung: ${err.message}`);
    } finally {
      setGrading(false);
    }
  }

  const sampleC1Phrases = [
    { cat: "Einleitung & Problemaufriss", phrases: ["Das Thema ... gewinnt in der gegenwärtigen Debatte zunehmend an Brisanz.", "Im Zentrum der wissenschaftlichen Auseinandersetzung steht die Frage, inwiefern...", "Es lässt sich kaum bestreiten, dass..."] },
    { cat: "Pro- & Contra-Argumentation", phrases: ["Befürworter führen ins Feld, dass...", "Demgegenüber lässt sich einwenden, dass...", "Ein ausschlaggebendes Argument für ... besteht darin, dass...", "Nichtsdestotrotz darf nicht verkannt werden, dass..."] },
    { cat: "Kausalität & Folgerung", phrases: ["Folglich / Demzufolge / In Anbetracht dessen...", "Dies impliziert unweigerlich, dass...", "Aus diesem Sachverhalt ergibt sich die Notwendigkeit..."] },
    { cat: "Synthese & Fazit", phrases: ["Zusammenfassend lässt sich konstatieren, dass...", "Unter Abwägung der vorgebrachten Aspekte plädiere ich für...", "Es bleibt festzuhalten, dass eine differenzierte Betrachtung unerlässlich ist."] }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-extrabold uppercase rounded bg-rose-100 text-rose-800">
                Schriftlicher Ausdruck (70 Min)
              </span>
              <span className="text-xs font-semibold text-slate-400">48 Punkte (Bestehen: ≥ 29 Pkt)</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {topicData.themeTitle || activeTheme.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPhrases(!showPhrases)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            {showPhrases ? 'Redemittel schließen' : 'C1 Redemittel-Hilfe'}
          </button>
          <button
            onClick={onChooseOtherTheme}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>

      {/* Redemittel Drawer */}
      {showPhrases && (
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-xl space-y-4 animate-fadeIn border border-slate-700">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm">Akademische C1 Redemittel</h3>
            </div>
            <span className="text-xs text-slate-400">Klicken zum Einfügen</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {sampleC1Phrases.map((group, idx) => (
              <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 space-y-2">
                <div className="font-bold text-amber-300 text-[11px] uppercase tracking-wider">{group.cat}</div>
                <div className="space-y-1.5">
                  {group.phrases.map((phrase, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => setEssayText(prev => prev ? `${prev} ${phrase} ` : `${phrase} `)}
                      className="w-full text-left p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition text-[11px] leading-snug"
                    >
                      + {phrase}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Left Editor | Right Two Themes Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Editor (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4 text-rose-600" />
                <span className="font-bold text-sm text-slate-900">
                  Aufsatz: {activeTheme.title || 'Schriftlicher Ausdruck'}
                </span>
              </div>
              <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                wordCount >= 350 ? 'bg-emerald-100 text-emerald-800' : wordCount >= 200 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {wordCount} Wörter (Empfohlen: ≥350)
              </div>
            </div>

            <textarea
              rows={16}
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Verfassen Sie hier Ihren Text... Strukturieren Sie ihn mit Einleitung, Pro-/Contra-Argumenten mit konkreten Beispielen und Schlussfolgerung."
              className="w-full p-4 text-sm leading-relaxed text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition resize-y font-sans"
            />

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="text-[11px] text-slate-400">
                Wählen Sie rechts eines der beiden Themen (Thema 1 oder Thema 2) und starten Sie die KI-Korrektur.
              </div>
              <button
                onClick={handleGradeWithAI}
                disabled={grading || wordCount < 20}
                className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-rose-200" />
                {grading ? 'KI analysiert...' : 'Sofortige KI-Korrektur ausführen'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: 2 Themes Selector Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {hasMultipleThemes && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Themenauswahl (1 aus 2 Themen wählen)</h3>
              <p className="text-xs text-slate-500">
                Wählen Sie das Thema, über das Sie schreiben möchten:
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setSelectedThemeKey('theme1'); setEvaluation(null); }}
                  className={`p-3 rounded-xl border text-left transition text-xs space-y-1 ${
                    selectedThemeKey === 'theme1'
                      ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-200'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider text-rose-700 font-extrabold">Option 1</div>
                  <div className="font-bold">{topicData.theme1?.title}</div>
                </button>

                <button
                  type="button"
                  onClick={() => { setSelectedThemeKey('theme2'); setEvaluation(null); }}
                  className={`p-3 rounded-xl border text-left transition text-xs space-y-1 ${
                    selectedThemeKey === 'theme2'
                      ? 'bg-rose-50 border-rose-500 text-rose-950 font-bold ring-2 ring-rose-200'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider text-rose-700 font-extrabold">Option 2</div>
                  <div className="font-bold">{topicData.theme2?.title}</div>
                </button>
              </div>
            </div>
          )}

          {/* Active Theme Prompt & Quotes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">{activeTheme.title}</h3>
              {activeTheme.category && (
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {activeTheme.category}
                </span>
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-normal">
              {activeTheme.prompt}
            </div>
          </div>

          {/* Official Instructions */}
          <div className="bg-rose-50/70 border border-rose-200 p-4 rounded-2xl text-xs text-rose-950 space-y-1.5">
            <div className="font-bold text-rose-900">telc Prüfungshinweis:</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Ihr Text soll mindestens 350 Wörter umfassen. Gliedern Sie Ihren Text klar in Einleitung, Hauptteil (Pro & Contra mit Beispielen) und Schluss/Fazit.
            </p>
          </div>

        </div>

      </div>

      {/* INSTANT AI EVALUATION SCORECARD */}
      {evaluation && (
        <div className="bg-white p-6 rounded-3xl border border-indigo-200 shadow-2xl space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-black text-slate-900">Sofortige KI-Scorecard</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  evaluation.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {evaluation.cefrLevel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{evaluation.overallFeedback}</p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-3xl font-black text-slate-900">{evaluation.totalScore} / 48 Pkt</div>
              <div className="text-xs font-bold text-slate-500">{evaluation.percentage}% ({evaluation.passed ? 'Bestanden' : 'Nicht bestanden'})</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {evaluation.criteriaScores && Object.entries(evaluation.criteriaScores).map(([key, item]) => (
              <div key={key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between font-bold text-xs capitalize text-slate-800">
                  <span>{key}</span>
                  <span className="text-rose-600 font-extrabold">{item.score} / {item.max} Pkt</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">{item.feedback}</p>
              </div>
            ))}
          </div>

          {evaluation.c1VocabularyHighlights?.length > 0 && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
              <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Positiv gewertete C1 Ausdrücke:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {evaluation.c1VocabularyHighlights.map((vh, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white text-emerald-800 text-[11px] font-semibold border border-emerald-300">
                    {vh}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
