import React from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, Sparkles, X, BookOpen } from 'lucide-react';

export function InstantScorecardModal({ scorecard, onClose, onRetry, onChooseOtherTheme }) {
  if (!scorecard) return null;

  const {
    section,
    subteil,
    themeTitle,
    score,
    totalPoints,
    percentage,
    passed,
    itemBreakdown
  } = scorecard;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Scorecard Header */}
        <div className={`p-6 text-white relative ${
          passed
            ? 'bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900'
            : 'bg-gradient-to-r from-amber-600 via-orange-700 to-slate-900'
        }`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Sofortige telc C1 Auswertung
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black">{themeTitle}</h2>
              <p className="text-xs text-white/80 mt-0.5 capitalize">
                Abschnitt: {section} • {subteil || 'Teil 1'}
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center shrink-0">
              <div className="text-3xl font-black text-white">{score} / {totalPoints}</div>
              <div className="text-xs font-bold text-amber-200">{percentage}%</div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center gap-2">
            {passed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-xs font-extrabold border border-emerald-400/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Bestanden (≥60% telc C1 Standard)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/30 text-amber-100 text-xs font-extrabold border border-amber-400/40">
                <XCircle className="w-4 h-4 text-amber-300" />
                Nicht bestanden (Mindestpunktzahl: 60%)
              </span>
            )}
          </div>
        </div>

        {/* Breakdown Items List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Detaillierte Aufgaben-Auswertung ({itemBreakdown?.length} Fragen)
            </h3>
            <span className="text-xs text-slate-400">Richtige Antworten & Erklärungen</span>
          </div>

          <div className="space-y-3">
            {itemBreakdown?.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition text-xs space-y-2 ${
                  item.isCorrect
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-red-50/70 border-red-200 text-red-950'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-bold flex items-center gap-2">
                    {item.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{item.label}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                    item.isCorrect ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                  }`}>
                    {item.isCorrect ? 'Korrekt (+1)' : 'Falsch (0)'}
                  </span>
                </div>

                {item.questionText && (
                  <p className="text-slate-700 font-medium pl-6 leading-snug">{item.questionText}</p>
                )}

                <div className="pl-6 space-y-1 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Ihre Antwort: </span>
                    <strong className={item.isCorrect ? 'text-emerald-800' : 'text-red-800'}>
                      {item.userAnswer}
                    </strong>
                  </div>
                  {!item.isCorrect && (
                    <div>
                      <span className="text-slate-500 font-medium">Richtige Lösung: </span>
                      <strong className="text-emerald-700">{item.correctAnswer}</strong>
                    </div>
                  )}
                </div>

                {item.explanation && (
                  <div className="ml-6 p-2 bg-white/80 rounded-xl border border-slate-200/60 text-[11px] text-slate-600">
                    <strong className="text-blue-800">Erklärung: </strong>{item.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Diesen Text wiederholen
          </button>

          <button
            onClick={onChooseOtherTheme}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            Anderes Thema wählen
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
