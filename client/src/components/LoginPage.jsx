import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';

export function LoginPage() {
  const { login, register, switchDemoRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetExamDate, setTargetExamDate] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  async function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim() || !email.trim() || !password) {
          throw new Error('Bitte füllen Sie alle Pflichtfelder aus.');
        }
        const res = await register({
          name: name.trim(),
          email: email.trim(),
          password,
          targetExamDate
        });
        setSuccessMsg(res.message || 'Registrierung erfolgreich! Ihr Konto wartet auf Freischaltung durch den Administrator.');
      } else {
        if (!email.trim() || !password) {
          throw new Error('Bitte geben Sie E-Mail und Passwort ein.');
        }
        await login(email.trim(), password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Daten.');
    } finally {
      setLoading(false);
    }
  }

  function handleQuickLogin(role) {
    setErrorMsg('');
    setSuccessMsg('');
    switchDemoRole(role);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        {/* Logo & Seal */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-xl shadow-blue-500/25 mb-4 ring-4 ring-white/10">
          <GraduationCap className="w-8 h-8" />
        </div>

        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-extrabold uppercase tracking-wider">
            telc Deutsch C1 Hochschule
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
            Offizielles Prüfungsportal
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Prüfungsvorbereitung & Auswertung
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300">
          Bitte melden Sie sich an, um auf die Prüfungsteile und Ihre Übungen zuzugreifen.
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-8 rounded-3xl shadow-2xl border border-white/20">
          
          {/* Login / Register Tab Switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                !isRegister
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Anmelden
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setErrorMsg(''); setSuccessMsg(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                isRegister
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Registrieren
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
              <span>⚡ Schnell-Login (1-Klick)</span>
              <span className="text-slate-400 font-normal">Zum direkten Testen</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-2 px-2.5 rounded-xl text-left bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-indigo-950 transition group shadow-2xs"
                title="admin@telc.de / admin123"
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-indigo-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>Prüfungsleiter (Admin)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">admin@telc.de</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('student')}
                className="py-2 px-2.5 rounded-xl text-left bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50/50 text-blue-950 transition group shadow-2xs"
                title="student@uni.de / student123"
              >
                <div className="flex items-center gap-1.5 font-bold text-[11px] text-blue-700">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>Student (Prüfung)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 truncate">student@uni.de</div>
              </button>
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className="bg-white px-2 text-slate-400 font-medium">Oder mit Zugangsdaten</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vollständiger Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="z. B. Alexander Müller"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                E-Mail-Adresse *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@beispiel.de"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Passwort *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                  title={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Geplanter Prüfungstermin (optional)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="date"
                    value={targetExamDate}
                    onChange={(e) => setTargetExamDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? 'Wird bearbeitet...' : isRegister ? 'Konto registrieren' : 'Jetzt anmelden'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Information Notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              {isRegister
                ? 'Hinweis: Nach der Registrierung aktiviert der Administrator Ihr Konto für den vollen Prüfungszugriff.'
                : 'Zugang für Studierende & Prüfungsleiter der telc Deutsch C1 Hochschule.'}
            </p>
          </div>

        </div>

        {/* Feature Badges under card */}
        <div className="mt-6 grid grid-cols-3 gap-2 text-center text-white/80 text-[11px] font-medium">
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <BookOpen className="w-4 h-4 mx-auto text-sky-400 mb-1" />
            <span>Lesen & Sprachbausteine</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <Sparkles className="w-4 h-4 mx-auto text-amber-400 mb-1" />
            <span>Sofortige Scorecard</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <span>Admin-Verwaltung</span>
          </div>
        </div>

      </div>

    </div>
  );
}
