import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Play, Square, Clock, ArrowLeft, Sparkles } from 'lucide-react';

export function MuendlicherAusdruckRunner({ subteil = 'teil1A', topicData, onBack, onChooseOtherTheme }) {
  const [isRecording, setIsRecording] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(subteil === 'teil1A' ? 180 : subteil === 'teil1B' ? 120 : 360);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
      setIsRecording(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  if (!topicData) {
    return <div className="p-8 text-center text-slate-500">Kein Thema ausgewählt.</div>;
  }

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleStartPractice = () => {
    setTimerSeconds(subteil === 'teil1A' ? 180 : subteil === 'teil1B' ? 120 : 360);
    setTimerRunning(true);
    setIsRecording(true);
  };

  const handleStopPractice = () => {
    setTimerRunning(false);
    setIsRecording(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[11px] font-extrabold uppercase rounded bg-teal-100 text-teal-800">
                Mündliche Prüfung • {subteil === 'teil1A' ? 'Teil 1A: Präsentation' : subteil === 'teil1B' ? 'Teil 1B: Nachfragen' : 'Teil 2: Diskussion'}
              </span>
              <span className="text-xs font-semibold text-slate-400">48 Punkte</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {topicData.title || topicData.themeTitle}
            </h1>
          </div>
        </div>

        <button
          onClick={onChooseOtherTheme}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
        >
          Anderes Thema wählen
        </button>
      </div>

      {/* Timer & Speech Simulation Box */}
      <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 border border-teal-800/40">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition ${
            isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-800 text-teal-200'
          }`}>
            {isRecording ? <Mic className="w-7 h-7" /> : <MicOff className="w-7 h-7" />}
          </div>
          <div>
            <div className="text-xs text-teal-300 font-semibold uppercase tracking-wider">Sprech-Simulation</div>
            <div className="text-3xl font-black">{formatTimer(timerSeconds)}</div>
            <div className="text-xs text-slate-300">
              {isRecording ? '🔴 Aufnahme aktiv... Sprechen Sie frei und flüssig.' : 'Bereiten Sie sich vor und starten Sie den Timer.'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {timerRunning ? (
            <button
              onClick={handleStopPractice}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Aufnahme beenden
            </button>
          ) : (
            <button
              onClick={handleStartPractice}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 active:scale-95 text-slate-950 text-xs font-bold rounded-xl shadow transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Timer starten ({subteil === 'teil1A' ? '3 Min' : subteil === 'teil1B' ? '2 Min' : '6 Min'})
            </button>
          )}
        </div>
      </div>

      {/* Task & Phrases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Vortragsthema / Leitfrage</h2>
          <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs font-bold text-teal-950 leading-relaxed">
            {topicData.title || topicData.themeTitle}
          </div>

          {topicData.prompts && (
            <div className="space-y-2">
              <div className="font-bold text-xs text-slate-800">Leitfragen für den Diskurs:</div>
              {topicData.prompts.map((pr, i) => (
                <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                  • {pr}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-sm text-slate-900">Hilfreiche Redemittel</h3>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-teal-900 block text-[11px]">Strukturierung:</strong>
              "Ich möchte meinen Vortrag in drei Kernaspekte untergliedern..."
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="text-teal-900 block text-[11px]">Wissenschaftlicher Beleg:</strong>
              "Empirische Studien weisen darauf hin, dass..."
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
