import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { X, Lock, Mail, User, Calendar, ShieldCheck, GraduationCap, CheckCircle2 } from 'lucide-react';

export function AuthModal({ isOpen, onClose }) {
  const { login, register, switchDemoRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [roleMode, setRoleMode] = useState('student'); // 'student' or 'admin'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    targetExamDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await register(formData);
        setSuccessMsg(res.message || 'Registriert! Ihr Konto wartet auf Freischaltung.');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        await login(formData.email, formData.password);
        onClose();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Aktion fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }

  function handleDemoQuick(role) {
    switchDemoRole(role);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-6 h-6 text-sky-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">telc C1 Hochschule Portal</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            {isRegister ? 'Neues Studentenkonto erstellen' : 'Im Prüfungsportal anmelden'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {isRegister
              ? 'Nach der Registrierung schaltet der Administrator Ihr Konto frei.'
              : 'Greifen Sie auf alle Prüfungsteile oder die Verwaltung zu.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mb-5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              ⚡ Schnell-Login (Demo ohne Passwort)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoQuick('admin')}
                className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold border border-indigo-200 flex items-center justify-center gap-1.5 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                Als Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoQuick('student')}
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 flex items-center justify-center gap-1.5 transition"
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                Als Student
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vollständiger Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="z.B. Max Mustermann"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">E-Mail-Adresse</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@universitaet.de"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Passwort</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Geplanter Prüfungstermin (optional)</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="date"
                    value={formData.targetExamDate}
                    onChange={(e) => setFormData({ ...formData, targetExamDate: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-sm font-bold rounded-xl shadow-md shadow-blue-500/20 transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Verarbeite...' : isRegister ? 'Registrieren (Freischaltung anfordern)' : 'Anmelden'}
            </button>
          </form>

          {/* Toggle Register / Login */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              {isRegister
                ? 'Bereits registriert? Hier anmelden'
                : 'Noch kein Konto? Als Student registrieren'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
