import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  LogOut,
  Sparkles,
  BookOpen,
  Layers,
  FileCheck2,
  Settings,
  ChevronDown
} from 'lucide-react';

export function Navbar({ currentView, setCurrentView, onOpenAuth }) {
  const { user, logout, switchDemoRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

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
                    👥 Studentenverwaltung
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
                    KI-Bogen Digitalisierung
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

          {/* User Status / Quick Switcher */}
          <div className="flex items-center gap-3">
            {/* Fast Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-medium text-slate-700 transition"
                title="Rolle schnell wechseln für Testzwecke"
              >
                {user?.role === 'admin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                )}
                <span>Rolle: <strong className="capitalize">{user?.role === 'admin' ? 'Admin' : 'Student'}</strong></span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Schnellansicht wechseln
                  </div>
                  <button
                    onClick={() => {
                      switchDemoRole('admin');
                      setCurrentView('admin-students');
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="font-semibold text-indigo-900">Administrator</div>
                      <div className="text-[10px] text-slate-500">Studenten aktivieren & Bögen hochladen</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      switchDemoRole('student');
                      setCurrentView('dashboard');
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-semibold text-emerald-900">Student (Aktiv)</div>
                      <div className="text-[10px] text-slate-500">Voller Zugriff auf alle Teile</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 justify-end">
                    {user.name}
                    {user.role === 'student' && (
                      <span className={`inline-block w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
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
