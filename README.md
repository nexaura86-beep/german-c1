# 🎓 telc Deutsch C1 Hochschule – Interaktives Prüfungsportal & KI-Digitalisierung

Ein modernes, voll funktionsfähiges Webportal zur gezielten Vorbereitung auf die **telc Deutsch C1 Hochschule** Prüfung mit getrennten Prüfungsteilen (*Teile*), Zwei-Rollen-System (*Admin* & *Student*), Kontofreischaltung durch die Prüfungsleitung und **KI-gestützter Digitalisierung von Prüfungsbögen**.

---

## 🌟 Hauptfunktionen & Rollenkonzept

### 1. 👥 Rollensystem

#### 🛡️ Administrator (Prüfungsleitung / Dozent)
- **Studentenverwaltung & Freischaltung**:
  - Übersicht aller registrierten Prüfungsteilnehmer mit Zieldatum.
  - **Ein-Klick-Aktivierung / Sperrung** von Studentenkonten.
- **⚡ KI-Bogen-Digitalisierung (AI Paper Digitizer)**:
  - Hochladen von Prüfungsbögen als **PDF, Textdatei oder Rohtext**.
  - Die Backend-KI extrahiert automatisch Lesetexte, Lücken, Antwortoptionen (A–H / a–d) und Lösungsschlüssel.
  - Interaktive Live-Vorschau und JSON-Inspektor vor der Veröffentlichung im Prüfungskatalog.
- **Prüfungskatalog & Ergebnis-Audit**:
  - Verwalten aller Prüfungssätze und Einsicht in studentische Abgaben inklusive KI-Korrekturberichten.

#### 🎓 Student (Prüfungsteilnehmer)
- **Dashboard mit separaten Prüfungsteilen (*Teile*)**:
  - 📖 **1. Leseverstehen (90 Min gesamt, 48 Pkt)**:
    - *Teil 1: Rekonstruktion eines Textes* (Lücken 1–6 mit Sätzen A–H).
    - *Teil 2: Selektives Verstehen* (Zuordnung von Aussagen 7–12 zu Texten A–D).
    - *Teil 3: Detailverstehen* (10 Multiple-Choice Fragen 13–22 zu Fachtext).
  - 🧩 **2. Sprachbausteine (30 Min, 22 Pkt)**:
    - *Teil 1: 22 akademische Grammatik- und Kollokationslücken* (23–44) mit Erklärungen.
  - 🎧 **3. Hörverstehen (ca. 40 Min, 48 Pkt)**:
    - *Teil 1: Globalverstehen* (Diskussion mit Sprecherzuordnung).
    - *Teil 2: Detailverstehen* (Experteninterview Richtig/Falsch).
    - *Teil 3: Informationstransfer* (Fachvortrag mit Stichpunkt-Notizen).
    - Integrierter Audio-Player & Sprachsynthese-Sprecher.
  - ✍️ **4. Schriftlicher Ausdruck (70 Min, 48 Pkt)**:
    - Themenwahl aus 2 wissenschaftlichen Leitfragen.
    - Texteditor mit Live-Wortzähler (Ziel: ≥350 Wörter) und C1 Redemittel-Hilfe.
    - **Direkte KI-Korrektur** nach den 4 offiziellen telc Kriterien (*Aufgabenbewältigung, Kohärenz, Ausdrucksvermögen, Korrektheit*) mit CEFR-Einstufung und Detailfeedback.
  - 🗣️ **5. Mündlicher Ausdruck (ca. 20 Min, 48 Pkt)**:
    - Teil 1A (Präsentation), Teil 1B (Nachfragen), Teil 2 (Kontroverse Diskussion) mit integriertem Sprech-Timer.
  - 📊 **Persönliche Lernanalyse**:
    - Detaillierte Auswertungen, Bestehensquoten (Bestehensgrenze: 60%) und Fehlerbegründungen.

---

## 🚀 Schnellanleitung zur Inbetriebnahme

### Voraussetzungen
- Node.js (v18+)
- npm

### 1. Server starten (Backend)
```bash
cd server
npm install
npm start
```
*Der Express-Server läuft unter `http://localhost:5000`.*

### 2. Client starten (Frontend)
```bash
cd client
npm install
npm run dev
```
*Das React-Frontend öffnet unter `http://localhost:5173`.*

---

## 🔑 Standard-Zugangsdaten (Demo-Accounts)

Im System sind bereits Test-Accounts und ein vollständiger originalgetreuer C1 Modellsatz hinterlegt:

| Rolle | E-Mail | Passwort | Status |
|---|---|---|---|
| **Administrator** | `admin@telc.de` | `admin123` | Vollzugriff |
| **Student (Aktiv)** | `student@uni.de` | `student123` | Freigeschaltet |
| **Student (Wartend)** | `sarah.k@stud.tu-berlin.de` | `student123` | Wartet auf Freischaltung |

> 💡 *In der oberen Menüleiste befindet sich ein **Schnellwechsler**, mit dem Sie jederzeit ohne Passworteingabe zwischen Admin und Student wechseln können.*

---

## 🤖 KI-Konfiguration (Optional)

Das Backend verfügt über ein intelligentes Heuristik- & Parser-System, das auch **ohne externen API-Schlüssel** sofort funktioniert. 

Für erweiterte generative KI-Analysen kann ein Google Gemini API Key gesetzt werden:
1. In der Datei `server/.env`:
   ```env
   PORT=5000
   JWT_SECRET=telc_c1_hochschule_secret_key_2026_super_secure
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
2. Oder direkt im Administrator-Dashboard im Digitalisierungsformular.

---

## 📁 Projektstruktur

```
├── server/
│   ├── server.js          # Express REST API (Auth, Admin, Exams, AI)
│   ├── aiService.js       # KI-Digitalisierer & telc C1 Essay Grading Engine
│   ├── db.js              # Persistente JSON-Datenbankverwaltung
│   ├── auth.js            # JWT-Token & Rollen-Middleware
│   ├── seedData.js        # Authentischer telc C1 Modellprüfungsdatensatz
│   └── database.json      # Gespeicherte Benutzer, Prüfungen und Abgaben
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx                   # Header mit Rollen-Schnellwechsler
    │   │   ├── StudentDashboard.jsx         # Dashboard mit getrennten Teile-Karten
    │   │   ├── AdminDashboard.jsx           # Studentenaktivierung & KI-Bogen-Upload
    │   │   ├── PendingApprovalBanner.jsx    # Status-Banner für neue Studenten
    │   │   └── exam/
    │   │       ├── LeseverstehenRunner.jsx      # Teil 1, 2, 3 Leseverstehen
    │   │       ├── SprachbausteineRunner.jsx    # Teil 1 22er Lückentext
    │   │       ├── HoerverstehenRunner.jsx      # Hörverstehen mit Audio
    │   │       ├── SchriftlicherAusdruckRunner.jsx # Aufsatz mit KI-Bewertung
    │   │       └── MuendlicherAusdruckRunner.jsx  # Mündliche Prüfung & Timer
    │   ├── context/AuthContext.jsx          # Auth-Status & Rollenverwaltung
    │   └── services/api.js                  # Frontend API Client
```
