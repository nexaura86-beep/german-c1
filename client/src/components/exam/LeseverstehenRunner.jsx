import React, { useState } from 'react';
import { BookOpen, CheckCircle, ArrowLeft, Send, Sparkles } from 'lucide-react';
import { api } from '../../services/api.js';
import { InstantScorecardModal } from './InstantScorecardModal.jsx';

export function LeseverstehenRunner({ subteil = 'teil1', topicData, onBack, onChooseOtherTheme }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [instantScorecard, setInstantScorecard] = useState(null);

  if (!topicData) {
    return <div className="p-8 text-center text-slate-500">Kein Thema ausgewählt.</div>;
  }

  const handleSelectAnswer = (gapKey, answerValue) => {
    setAnswers(prev => ({
      ...prev,
      [gapKey]: answerValue
    }));
  };

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const scorecard = await api.evaluateInstant({
        section: 'leseverstehen',
        subteil,
        topicId: topicData.id,
        userAnswers: answers,
        topicData
      });
      setInstantScorecard(scorecard);
    } catch (err) {
      alert(`Fehler bei der Auswertung: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  const handleRetry = () => {
    setAnswers({});
    setInstantScorecard(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition"
            title="Zurück zur Themenauswahl"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-extrabold uppercase rounded bg-blue-100 text-blue-800">
                Leseverstehen • {subteil === 'teil1' ? 'Teil 1: Rekonstruktion' : subteil === 'teil2' ? 'Teil 2: Selektiv' : 'Teil 3: Detail'}
              </span>
              <span className="text-xs font-semibold text-slate-400">C1 Hochschule</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {topicData.themeTitle || topicData.title}
            </h1>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          {submitting ? 'Werte aus...' : 'Prüfungsteil abgeben & Scorecard anzeigen'}
        </button>
      </div>

      {/* TEIL 1: REKONSTRUKTION EINES TEXTES */}
      {subteil === 'teil1' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Reading Passage with Gaps */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">Textrekonstruktion</h2>
              <p className="text-xs text-slate-500 mt-0.5">{topicData.instructions}</p>
            </div>

            <div className="prose max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
              {topicData.text?.split('\n\n').map((paragraph, pIdx) => {
                const parts = paragraph.split(/(\[BEISPIEL_0\]|___0___|\[LÜCKE_\d+\]|___\d+___|\[\d+\])/g);
                return (
                  <p key={pIdx} className="leading-loose">
                    {parts.map((part, partIdx) => {
                      if (part === '[BEISPIEL_0]' || part === '___0___' || part === '[0]') {
                        const exampleText = topicData.example?.text || topicData.exampleText || 'Beispielsatz';
                        return (
                          <span
                            key={partIdx}
                            className="inline-block my-1 mx-1 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 text-xs sm:text-sm align-middle shadow-xs"
                          >
                            <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md text-[11px] mr-1.5 shrink-0">
                              <span>Beispiel [0]</span>
                              <span>• Satz z</span>
                            </span>
                            <span className="italic text-slate-700">
                              „{exampleText}“
                            </span>
                          </span>
                        );
                      }

                      const match = part.match(/(?:\[LÜCKE_|___|\[)(\d+)(?:\]|___)/);
                      if (match) {
                        const gapNum = match[1];
                        const selectedVal = answers[gapNum];
                        const selectedOption = topicData.options?.find(o => o.key.toLowerCase() === selectedVal?.toLowerCase());

                        if (selectedOption) {
                          return (
                            <span
                              key={partIdx}
                              className="inline-block my-1 mx-1 px-3 py-2 rounded-xl bg-sky-50 border-2 border-sky-400 text-slate-900 font-medium text-xs sm:text-sm leading-relaxed shadow-sm align-middle"
                            >
                              <span className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                <span className="inline-flex items-center gap-1 font-extrabold text-white bg-blue-600 px-2 py-0.5 rounded-lg text-xs shrink-0">
                                  <span>Lücke [{gapNum}]</span>
                                  <span>• Satz {selectedOption.key.toUpperCase()}</span>
                                </span>
                                <select
                                  value={selectedVal?.toLowerCase() || ''}
                                  onChange={(e) => handleSelectAnswer(gapNum, e.target.value)}
                                  className="text-[11px] font-semibold bg-white border border-sky-300 rounded-md px-1.5 py-0.5 text-slate-700 cursor-pointer hover:border-sky-500"
                                  title="Anderen Satz wählen"
                                >
                                  {topicData.options?.map(opt => (
                                    <option key={opt.key} value={opt.key.toLowerCase()}>
                                      Satz {opt.key.toUpperCase()}: {opt.text.length > 50 ? opt.text.substring(0, 50) + '…' : opt.text}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleSelectAnswer(gapNum, '')}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition"
                                  title="Satz aus dieser Lücke entfernen"
                                >
                                  ✕ Entfernen
                                </button>
                              </span>
                              <span className="font-semibold text-slate-900 text-xs sm:text-sm underline decoration-sky-300 decoration-2 underline-offset-2">
                                „{selectedOption.text}“
                              </span>
                            </span>
                          );
                        }

                        return (
                          <span
                            key={partIdx}
                            className="inline-flex items-center gap-1.5 my-1 mx-1 px-2.5 py-1 rounded-xl bg-amber-50 border-2 border-dashed border-amber-300 text-amber-900 text-xs font-semibold align-middle shadow-xs"
                          >
                            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-black shrink-0">
                              {gapNum}
                            </span>
                            <select
                              value={selectedVal?.toLowerCase() || ''}
                              onChange={(e) => handleSelectAnswer(gapNum, e.target.value)}
                              className="text-xs bg-white font-medium border border-amber-300 rounded-lg px-2 py-1 text-slate-700 hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                            >
                              <option value="">Lücke {gapNum}: Satz a–h wählen...</option>
                              {topicData.options?.map(opt => (
                                <option key={opt.key} value={opt.key.toLowerCase()}>
                                  {opt.key.toUpperCase()}: {opt.text.length > 60 ? opt.text.substring(0, 60) + '…' : opt.text}
                                </option>
                              ))}
                            </select>
                          </span>
                        );
                      }
                      return <span key={partIdx}>{part}</span>;
                    })}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Options Palette (A–H) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-20">
              <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center justify-between">
                <span>Einzufügende Sätze (A–H)</span>
                <span className="text-[11px] text-slate-400">2 Sätze passen nicht</span>
              </h3>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {topicData.options?.map((opt) => {
                  const assignedGap = Object.keys(answers).find(gap => answers[gap]?.toLowerCase() === opt.key.toLowerCase());

                  return (
                    <div
                      key={opt.key}
                      className={`p-3.5 rounded-xl border transition text-xs space-y-2.5 ${
                        assignedGap
                          ? 'border-blue-400 bg-blue-50/70 shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <span className={`w-5 h-5 rounded font-extrabold flex items-center justify-center shrink-0 text-xs ${
                            assignedGap ? 'bg-blue-600 text-white' : 'bg-slate-700 text-white'
                          }`}>
                            {opt.key.toUpperCase()}
                          </span>
                          <p className={`leading-snug ${assignedGap ? 'font-semibold text-slate-900' : 'text-slate-800'}`}>
                            {opt.text}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/80">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-500 font-semibold">Einsetzen in:</span>
                          {[1, 2, 3, 4, 5, 6].map((num) => {
                            const isAssignedHere = answers[num]?.toLowerCase() === opt.key.toLowerCase();
                            return (
                              <button
                                key={num}
                                onClick={() => handleSelectAnswer(num.toString(), isAssignedHere ? '' : opt.key.toLowerCase())}
                                className={`w-6 h-6 rounded text-[11px] font-bold transition ${
                                  isAssignedHere
                                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                {num}
                              </button>
                            );
                          })}
                        </div>

                        {assignedGap && (
                          <button
                            type="button"
                            onClick={() => handleSelectAnswer(assignedGap, '')}
                            className="text-[10px] text-red-600 hover:text-red-800 font-bold"
                          >
                            Lösen ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  {Object.keys(answers).filter(k => answers[k]).length} von 6 zugeordnet
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition"
                >
                  Auswerten
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* TEIL 2: SELEKTIVES VERSTEHEN */}
      {subteil === 'teil2' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">Expertenbeiträge A–E</h2>
              <p className="text-xs text-slate-500 mt-1">{topicData.instructions}</p>
            </div>

            <div className="space-y-4">
              {topicData.texts?.map(t => (
                <div key={t.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                      {t.id}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{t.author}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{t.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-20">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Aussagen 7–12 zuordnen (A–E)</h3>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {topicData.statements?.map(st => {
                  const selectedVal = answers[st.id];
                  const optionsList = topicData.texts?.map(t => t.id) || ['A', 'B', 'C', 'D', 'E'];

                  return (
                    <div key={st.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                          {st.id}
                        </span>
                        <p className="text-slate-800 leading-snug">{st.text}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                        <span className="text-[10px] text-slate-400 font-semibold">Passender Text:</span>
                        <div className="flex items-center gap-1">
                          {optionsList.map(opt => (
                            <button
                              key={opt}
                              onClick={() => handleSelectAnswer(st.id, opt)}
                              className={`w-7 h-6 rounded text-xs font-bold transition ${
                                selectedVal === opt
                                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition"
                >
                  Auswerten
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TEIL 3: DETAILVERSTEHEN */}
      {subteil === 'teil3' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="border-b border-slate-200 pb-3 mb-4">
              <h2 className="text-base font-bold text-slate-900">Wissenschaftlicher Fachtext</h2>
              <p className="text-xs text-slate-500 mt-1">{topicData.instructions}</p>
            </div>
            <div className="prose max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
              {topicData.text?.split('\n\n').map((para, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-900 text-sm">Aufgaben 13–24</h3>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  richtig / falsch / nicht im Text
                </span>
              </div>

              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                {topicData.questions?.map(q => {
                  const selectedVal = answers[q.id];
                  const isTitleQ = q.id === '24' || q.options?.some(o => (o.text?.length || 0) > 15);

                  return (
                    <div key={q.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2.5">
                      <div className="flex items-start gap-2 font-bold text-slate-900">
                        <span className="w-5 h-5 rounded bg-blue-800 text-white text-[11px] flex items-center justify-center shrink-0">
                          {q.id}
                        </span>
                        <span className="leading-snug">{q.question}</span>
                      </div>

                      {isTitleQ ? (
                        <div className="flex flex-col gap-2 pl-7">
                          {q.options?.map(opt => (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, opt.key.toLowerCase())}
                              className={`p-2.5 rounded-xl border text-left transition text-xs flex items-start gap-2.5 ${
                                selectedVal?.toLowerCase() === opt.key.toLowerCase()
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300 font-semibold'
                                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-800'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                selectedVal?.toLowerCase() === opt.key.toLowerCase()
                                  ? 'bg-white text-blue-700'
                                  : 'bg-slate-200 text-slate-700'
                              }`}>
                                {opt.key.toUpperCase()}
                              </span>
                              <span className="leading-snug">{opt.text}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-1.5 pl-7">
                          {q.options?.map(opt => (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, opt.key.toLowerCase())}
                              className={`py-2 px-1.5 rounded-lg border text-center transition text-xs font-semibold ${
                                selectedVal?.toLowerCase() === opt.key.toLowerCase()
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300 font-bold'
                                  : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              <span className="capitalize">{opt.text}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition"
                >
                  Auswerten
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSTANT SCORECARD POPUP */}
      <InstantScorecardModal
        scorecard={instantScorecard}
        onClose={() => setInstantScorecard(null)}
        onRetry={handleRetry}
        onChooseOtherTheme={onChooseOtherTheme}
      />

    </div>
  );
}
