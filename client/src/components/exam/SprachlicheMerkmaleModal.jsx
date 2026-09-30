import React, { useState } from 'react';
import { BookOpen, X, Search, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

export const SPRACHLICHE_MERKMALE = [
  {
    intention: "Rat / Empfehlung",
    mittel: "Ratschläge oder Tipps geben: Konjunktiv II, ratsam, empfehlenswert, (mit auf den Weg geben: ...), raten, nützlich, man sollte, empfiehlt sich",
    kategorie: "Empfehlung & Vorschlag"
  },
  {
    intention: "Vorschlag / Lösung",
    mittel: "Konjunktiv II, erscheint am sinnvollsten, eine Möglichkeit wäre, man kann, Lösungsansatz",
    kategorie: "Empfehlung & Vorschlag"
  },
  {
    intention: "Appell / Aufforderung",
    mittel: "sollten, wäre sinnvoll, möchte man entgegenrufen: ..., stellen Sie sich vor, muss nun also dringend gehandelt werden!",
    kategorie: "Empfehlung & Vorschlag"
  },
  {
    intention: "Warnung",
    mittel: "Gefahr, Risiken, bedrohen, gefährlich, warnen vor ..., entsteht Manipulationsmöglichkeit, nicht wünschenswert sein, vorsichtig und bedächtig",
    kategorie: "Kritik & Risiko"
  },
  {
    intention: "Polemisch sein",
    mittel: "negative Bezeichnungen, emotionale Ausdrücke, spitz formuliert, attackieren, angreifen mit scharfen Argumenten (z.B. 'einfältige Opfer', 'Körnerfresser')",
    kategorie: "Kritik & Risiko"
  },
  {
    intention: "Abwertend / abfällig / geringschätzig",
    mittel: "über etwas oder jemanden etwas Negatives sagen, schlecht über jemanden oder etwas sprechen, abqualifizieren",
    kategorie: "Kritik & Risiko"
  },
  {
    intention: "Kritisieren / Einwand",
    mittel: "Kritik üben, Vorwurf äußern, negativ gegenüber einem Thema oder einer Person sein, vorwerfen, Missstand anprangern",
    kategorie: "Kritik & Risiko"
  },
  {
    intention: "Definition / Begriffsdefinition",
    mittel: "bezeichnet, bezeichnet als, wird genannt, allgemein bekannt als, es besagt, gemeint sein, das bedeutet: ..., nennt sich, ist definiert als",
    kategorie: "Wissenschaft & Struktur"
  },
  {
    intention: "Deutungsversuch / Erklärung",
    mittel: "gibt eine Erklärung: ..., interpretiert, die Gründe liegen in ..., lässt sich darauf zurückführen, Wissenschaftler erklären das so",
    kategorie: "Wissenschaft & Struktur"
  },
  {
    intention: "Fakten / Informieren",
    mittel: "sachlich schreiben, konkrete Zahlen, Daten, Statistiken, historische Fakten, Prozentangaben ohne emotionale Wertung",
    kategorie: "Wissenschaft & Struktur"
  },
  {
    intention: "Vermutung / Annahme / Theorie",
    mittel: "Konjunktiv II, vermutlich, vielleicht, wahrscheinlich, eventuell, womöglich, spekulieren, möglicherweise, diese Annahme könnte, es ist anzunehmen",
    kategorie: "Hypothesen & Zweifel"
  },
  {
    intention: "Zweifel / Innerer Konflikt",
    mittel: "sich für keine Meinung entscheiden können, fraglich, ist zu bezweifeln, ob ..., möglicherweise auf einem Missverständnis basiert",
    kategorie: "Hypothesen & Zweifel"
  },
  {
    intention: "Zwiespalt / Pro und Kontra abwägen",
    mittel: "nicht eindeutig sein, keine einheitliche Meinung haben, ambivalent, ein Dilemma: ..., einerseits … andererseits ..., zwei Seiten der Medaille",
    kategorie: "Hypothesen & Zweifel"
  },
  {
    intention: "Selbstreflexion / Nachdenken",
    mittel: "Hand aufs Herz, wer ... sich ... selbst? Aber ganz ehrlich, wie sieht es denn bei Ihnen aus? Ich frage mich, ob ...",
    kategorie: "Persönlich & Haltung"
  },
  {
    intention: "Persönlich werden / Eigene Erfahrung",
    mittel: "über private Gefühle, Gedanken oder persönliche Erlebnisse sprechen: ich, mich, mir, mein/e, eigene Erfahrung, als ich ...",
    kategorie: "Persönlich & Haltung"
  },
  {
    intention: "Verwunderung / Erstaunen",
    mittel: "überraschen, überrascht, erstaunen, erstaunlich, verwundert, verwunderlich, staunen, Wer hätte gedacht ..., merkwürdig",
    kategorie: "Emotionen & Stil"
  },
  {
    intention: "Bewunderung / Anerkennung",
    mittel: "jemanden oder eine Sache ganz toll oder wunderbar finden, Achtung, Hochschätzung, zu meinem Helden machte, Respekt empfinden",
    kategorie: "Emotionen & Stil"
  },
  {
    intention: "Ironisieren / Sich spöttisch äußern",
    mittel: "Gegenteil meinen, Verwendung von Ironie zur Darstellung oder Kritik, überzeichnete Bilder, scheinbares Lob mit bissigem Unterton",
    kategorie: "Emotionen & Stil"
  },
  {
    intention: "Amüsieren / Heiterkeit",
    mittel: "lächeln, schmunzeln, froh, Heiterkeit hervorrufen dürfte, mit einem Augenzwinkern erzählen",
    kategorie: "Emotionen & Stil"
  },
  {
    intention: "Schluss / Schlussfolgerung",
    mittel: "Folgern kann man aus alldem also: ..., lässt sich Folgendes daraus ableiten: ..., lässt sich nur folgern, lässt sich resümieren, Zusammenfassend",
    kategorie: "Wissenschaft & Struktur"
  },
  {
    intention: "Wandel / Entwicklung",
    mittel: "verändern sich, im Laufe der Zeit, zuerst / vorher … dann / danach … nun / jetzt, ein neuer Trend zeichnet sich ab",
    kategorie: "Wissenschaft & Struktur"
  },
  {
    intention: "Zukunft / Prognose",
    mittel: "künftig, bald, in Zukunft, zukünftig, wird gewiss schon bald, dürften in Zukunft gewiss, in den nächsten Jahrzehnten",
    kategorie: "Wissenschaft & Struktur"
  }
];

export function SprachlicheMerkmaleModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('Alle');

  if (!isOpen) return null;

  const categories = ['Alle', ...new Set(SPRACHLICHE_MERKMALE.map(m => m.kategorie))];

  const filtered = SPRACHLICHE_MERKMALE.filter(m => {
    const matchesSearch =
      m.intention.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.mittel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'Alle' || m.kategorie === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-sky-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-sky-300 text-[10px] font-bold uppercase mb-1">
                <Sparkles className="w-3 h-3 text-sky-400" />
                telc C1 Hochschule Leitfaden
              </div>
              <h2 className="text-xl font-black">
                Sprachliche Merkmale & Signale (Leseverstehen Teil 2)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Intention oder Signalwort suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCat === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Table / Cards */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          <p className="text-xs text-slate-500 mb-2">
            In <strong>Leseverstehen Teil 2</strong> ordnen Sie Aussagen 7–12 den Textabsätzen a–e zu. Diese Tabelle fasst die typischen Intentionen des Prüfungsformats und die jeweiligen Schlüsselwörter im Text zusammen.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    {item.intention}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold">
                    {item.kategorie}
                  </span>
                </div>
                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl leading-relaxed border border-slate-100 font-mono">
                  {item.mittel}
                </p>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs">
              Keine Merkmale passend zur Suche gefunden.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Quelle: Offizieller telc Deutsch C1 Prüfungskompass & Leitfaden</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition"
          >
            Schließen
          </button>
        </div>

      </div>
    </div>
  );
}
