import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  GraduationCap,
  ShieldCheck,
  LogOut,
  Sparkles,
  BookOpen,
  Layers,
  FileCheck2,
  Settings
} from 'lucide-react';

export function Navbar({ currentView, setCurrentView, onOpenAuth }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">telc Deutsch C1</span>
                <span className="px-2 py-0.5 text-xs font-bold uppercase rounded bg-red-100 text-red-700 border border-red-200">Hochschule</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Offizielles Prüfungsportal & AI Practice</p>
            </div>
          </div>

          {/* Quick Navigation / Teil Switchers */}
          {user && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
              {user.role === 'admin' ? (
                <>
                  <button
                    onClick={() => setCurrentView('admin-students')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                      currentView === 'admin-students'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    👥 Benutzerverwaltung
                  </button>
                  <button
                    onClick={() => setCurrentView('admin-digitizer')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition ${
                      currentView === 'admin-digitizer'
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    KI-Digitalisierung
                  </button>
                  <button
                    onClick={() => setCurrentView('admin-exams')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                      currentView === 'admin-exams'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📚 Prüfungskatalog
                  </button>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                      currentView === 'dashboard'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🎓 Prüfungsportal
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                      currentView === 'dashboard'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Übersicht Teile
                  </button>
                  <button
                    onClick={() => setCurrentView('teil-leseverstehen')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      currentView === 'teil-leseverstehen'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📖 Leseverstehen
                  </button>
                  <button
                    onClick={() => setCurrentView('teil-sprachbausteine')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      currentView === 'teil-sprachbausteine'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🧩 Sprachbausteine
                  </button>
                  <button
                    onClick={() => setCurrentView('teil-hoerverstehen')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      currentView === 'teil-hoerverstehen'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🎧 Hörverstehen
                  </button>
                  <button
                    onClick={() => setCurrentView('teil-schreiben')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      currentView === 'teil-schreiben'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    ✍️ Schreiben
                  </button>
                  <button
                    onClick={() => setCurrentView('my-results')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                      currentView === 'my-results'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📊 Ergebnisse
                  </button>
                </>
              )}
            </nav>
          )}

          {/* User Status */}
          <div className="flex items-center gap-3">

            {user ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 justify-end">
                    {user.name}
                    {user.role === 'admin' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3 text-indigo-600" />
                        Admin
                      </span>
                    ) : (
                      <span
                        className={`inline-block w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}
                        title={user.status === 'active' ? 'Freigeschaltet' : 'Wartet auf Freischaltung'}
                      />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {user.role === 'admin' ? 'Prüfungsleitung' : user.status === 'active' ? 'Konto Freigeschaltet' : 'Wartet auf Freischaltung'}
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Abmelden"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
              >
                Anmelden / Registrieren
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
}
