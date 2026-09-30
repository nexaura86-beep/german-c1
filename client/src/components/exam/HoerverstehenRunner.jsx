import React, { useState } from 'react';
import { Volume2, Play, Pause, ArrowLeft, Send, FileText, Sparkles } from 'lucide-react';
import { api } from '../../services/api.js';
import { InstantScorecardModal } from './InstantScorecardModal.jsx';

export function HoerverstehenRunner({ subteil = 'teil1', topicData, onBack, onChooseOtherTheme }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [instantScorecard, setInstantScorecard] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);

  if (!topicData) {
    return <div className="p-8 text-center text-slate-500">Kein Thema ausgewählt.</div>;
  }

  const handleSelectAnswer = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
  };

  const handleToggleAudio = () => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const textToRead = topicData.audioTranscript || "Sie hören nun die Audioaufnahme zum Prüfungsteil.";
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'de-DE';
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      } else {
        alert("Audio-Wiedergabe wird im Browser simuliert.");
      }
    }
  };

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const scorecard = await api.evaluateInstant({
        section: 'hoerverstehen',
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
    setShowTranscript(false);
  };

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
              <span className="px-2 py-0.5 text-[11px] font-extrabold uppercase rounded bg-purple-100 text-purple-800">
                Hörverstehen • {subteil === 'teil1' ? 'Teil 1: Global (47–54)' : subteil === 'teil2' ? 'Teil 2: Detail (55–64)' : 'Teil 3: Transfer (65–74)'}
              </span>
              <span className="text-xs font-semibold text-slate-400">telc C1 Hochschule</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {topicData.themeTitle || topicData.title}
            </h1>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          {submitting ? 'Werte aus...' : 'Hörverstehen auswerten & Scorecard'}
        </button>
      </div>

      {/* Audio Controller Bar */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
            <Volume2 className={`w-6 h-6 ${isPlaying ? 'text-purple-300 animate-pulse' : 'text-white'}`} />
          </div>
          <div>
            <div className="text-xs text-purple-200 font-semibold uppercase tracking-wider">Audioaufnahme</div>
            <div className="text-sm font-bold">{topicData.themeTitle || topicData.title}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleAudio}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-400 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            {isPlaying ? 'Audio pausieren' : 'Audio abspielen'}
          </button>
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            {showTranscript ? 'Transkript verbergen' : 'Transkript anzeigen'}
          </button>
        </div>
      </div>

      {/* Transcript Area */}
      {showTranscript && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-950 space-y-2 animate-fadeIn">
          <div className="font-bold text-purple-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Hörtext-Transkription:
          </div>
          <p className="leading-relaxed whitespace-pre-line text-slate-700">
            {topicData.audioTranscript || "Kein Transkript hinterlegt."}
          </p>
        </div>
      )}

      {/* TEIL 1: GLOBALVERSTEHEN (Statements Palette a–j on the right, Speakers 1–8 on the left) */}
      {subteil === 'teil1' && topicData.optionsStatements && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Speakers 1-8 */}
          <div className="lg:col-span-6 space-y-3">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Aufgaben 47–54 (Sprecher 1–8)</h3>
              <p className="text-xs text-slate-500 mb-3">Welche Aussage (a–j) passt zu welcher Person?</p>

              <div className="space-y-3">
                {topicData.items?.map((item) => {
                  const selectedKey = answers[item.id];
                  const selectedStatement = topicData.optionsStatements.find(s => s.key === selectedKey);

                  return (
                    <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{item.id}. {item.prompt}</span>
                        {selectedKey && (
                          <span className="font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                            Gewählt: Aussage [{selectedKey}]
                          </span>
                        )}
                      </div>

                      {selectedStatement && (
                        <p className="text-[11px] text-purple-950 font-semibold italic bg-white p-2 rounded-lg border border-purple-200">
                          „{selectedStatement.text}“
                        </p>
                      )}

                      <div className="flex flex-wrap gap-1 pt-1">
                        {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'].map((optKey) => (
                          <button
                            key={optKey}
                            onClick={() => handleSelectAnswer(item.id, selectedKey === optKey ? '' : optKey)}
                            className={`w-7 h-6 rounded text-xs font-bold transition ${
                              selectedKey === optKey
                                ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-300'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {optKey}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Statements Palette a-j */}
          <div className="lg:col-span-6 space-y-3">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-20">
              <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center justify-between">
                <span>Aussagen a–j</span>
                <span className="text-[11px] text-slate-400">2 Aussagen passen nicht</span>
              </h3>

              <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1 text-xs">
                {topicData.optionsStatements.map((opt) => (
                  <div
                    key={opt.key}
                    className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded bg-purple-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                      {opt.key}
                    </span>
                    <p className="text-slate-800 leading-snug">{opt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TEIL 2 & TEIL 3 */}
      {subteil !== 'teil1' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="space-y-4">
            {topicData.items?.map((item, idx) => {
              const selectedVal = answers[item.id];

              return (
                <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded bg-purple-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {item.id}
                    </span>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {item.question || item.prompt}
                    </div>
                  </div>

                  {/* Multiple Choice Options (Teil 2: a, b, c) */}
                  {item.options && (
                    <div className="space-y-1.5 pl-8">
                      {item.options.map(opt => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => handleSelectAnswer(item.id, opt.key)}
                          className={`w-full text-left p-2 rounded-lg border transition text-xs flex items-start gap-2 ${
                            selectedVal === opt.key
                              ? 'bg-purple-100 border-purple-500 text-purple-950 font-bold'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-bold">{opt.key})</span>
                          <span>{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Free text note completion (Teil 3: Stichworte) */}
                  {item.answerKey && (
                    <div className="pl-8">
                      <input
                        type="text"
                        value={selectedVal || ''}
                        onChange={(e) => handleSelectAnswer(item.id, e.target.value)}
                        placeholder="Ihre stichwortartige Lösung eingeben..."
                        className="w-full sm:w-96 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none font-medium"
                      />
                    </div>
                  )}
                </div>
              );
            })}
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
