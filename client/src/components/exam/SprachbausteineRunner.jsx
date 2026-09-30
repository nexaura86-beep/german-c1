import React, { useState } from 'react';
import { Layers, CheckCircle, ArrowLeft, Send } from 'lucide-react';
import { api } from '../../services/api.js';
import { InstantScorecardModal } from './InstantScorecardModal.jsx';

export function SprachbausteineRunner({ topicData, onBack, onChooseOtherTheme }) {
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [instantScorecard, setInstantScorecard] = useState(null);

  if (!topicData) {
    return <div className="p-8 text-center text-slate-500">Kein Thema ausgewählt.</div>;
  }

  const handleSelectAnswer = (id, optionKey) => {
    setAnswers(prev => ({
      ...prev,
      [id]: optionKey
    }));
  };

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const scorecard = await api.evaluateInstant({
        section: 'sprachbausteine',
        subteil: 'teil1',
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
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-extrabold uppercase rounded bg-indigo-100 text-indigo-800">
                Sprachbausteine Teil 1
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {topicData.items?.length || 22} Lücken • C1 Grammatik
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {topicData.themeTitle || topicData.title}
            </h1>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          {submitting ? 'Werte aus...' : 'Sprachbausteine auswerten & Scorecard'}
        </button>
      </div>

      {/* Main Grid: Left Academic text with drop-downs | Right Options List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Text Area */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-3 mb-4">
            <h2 className="text-base font-bold text-slate-900">Lückentext</h2>
            <p className="text-xs text-slate-500 mt-0.5">{topicData.instructions}</p>
          </div>

          <div className="prose max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
            {topicData.textTemplate?.split('\n\n').map((para, pIdx) => {
              const parts = para.split(/(\[\d+\]|___\d+___)/g);
              return (
                <p key={pIdx} className="leading-loose">
                  {parts.map((part, partIdx) => {
                    const match = part.match(/(?:\[|___)(\d+)(?:\]|___)/);
                    if (match) {
                      const id = match[1];
                      const item = topicData.items?.find(i => String(i.id) === String(id));
                      const selectedVal = answers[id];
                      const selectedOption = item?.options?.find(o => o.key.toLowerCase() === selectedVal?.toLowerCase());

                      if (selectedOption) {
                        return (
                          <span
                            key={partIdx}
                            onClick={() => {
                              const el = document.getElementById(`sb-item-${id}`);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                            className="inline-flex items-center my-0.5 mx-1 px-2.5 py-1 rounded-xl bg-indigo-50 border-2 border-indigo-400 text-slate-900 font-medium text-xs sm:text-sm shadow-sm align-middle cursor-pointer hover:bg-indigo-100 transition"
                            title="Klicken, um Auswahl zu ändern"
                          >
                            <span className="inline-flex items-center gap-1 font-extrabold text-white bg-indigo-600 px-1.5 py-0.5 rounded-md text-[11px] mr-1.5 shrink-0">
                              <span>[{id}]</span>
                              <span>• {selectedOption.key.toUpperCase()}</span>
                            </span>
                            <span className="font-bold text-indigo-950 text-xs sm:text-sm underline decoration-indigo-400 decoration-2 underline-offset-2">
                              „{selectedOption.text}“
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectAnswer(id, '');
                              }}
                              className="ml-2 px-1 py-0.2 rounded text-[10px] font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Auswahl entfernen"
                            >
                              ✕
                            </button>
                          </span>
                        );
                      }

                      return (
                        <span
                          key={partIdx}
                          onClick={() => {
                            const el = document.getElementById(`sb-item-${id}`);
                            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className="inline-flex items-center gap-1.5 my-0.5 mx-1 px-2.5 py-1 rounded-xl bg-amber-50 border-2 border-dashed border-amber-300 text-amber-900 text-xs font-bold cursor-pointer hover:bg-amber-100 hover:border-amber-400 transition align-middle shadow-xs"
                          title="Klicken, um Optionen für diese Lücke zu sehen"
                        >
                          <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-black shrink-0">
                            {id}
                          </span>
                          <span className="text-amber-800 font-medium italic text-[11px]">
                            [Lücke {id}: a–d wählen]
                          </span>
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

        {/* Options Palette */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-20">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Antwortoptionen (a, b, c, d)</h3>

            <div className="space-y-3.5 max-h-[65vh] overflow-y-auto pr-1">
              {topicData.items?.map(item => {
                const selected = answers[item.id];

                return (
                  <div
                    key={item.id}
                    id={`sb-item-${item.id}`}
                    className={`p-3 rounded-xl border transition text-xs space-y-2 ${
                      selected ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">
                          {item.id}
                        </span>
                        <span>Lücke [{item.id}]</span>
                      </span>
                      {selected && (
                        <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                          Ausgewählt: {selected.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {item.options?.map(opt => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleSelectAnswer(item.id, opt.key)}
                          className={`p-2 rounded-xl text-left border transition text-xs flex items-center gap-1.5 ${
                            selected === opt.key
                              ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-bold shrink-0">{opt.key})</span>
                          <span className="truncate">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

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
