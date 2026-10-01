import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { StudentDashboard } from './components/StudentDashboard.jsx';
import { AdminDashboard } from './components/AdminDashboard.jsx';
import { LeseverstehenRunner } from './components/exam/LeseverstehenRunner.jsx';
import { SprachbausteineRunner } from './components/exam/SprachbausteineRunner.jsx';
import { HoerverstehenRunner } from './components/exam/HoerverstehenRunner.jsx';
import { SchriftlicherAusdruckRunner } from './components/exam/SchriftlicherAusdruckRunner.jsx';
import { MuendlicherAusdruckRunner } from './components/exam/MuendlicherAusdruckRunner.jsx';
import { LoginPage } from './components/LoginPage.jsx';
import { Loader2 } from 'lucide-react';

export function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Active Exercise State
  const [activeSection, setActiveSection] = useState('leseverstehen');
  const [activeSubteil, setActiveSubteil] = useState('teil1');
  const [selectedTopicData, setSelectedTopicData] = useState(null);

  useEffect(() => {
    if (user?.role === 'admin' && currentView === 'dashboard') {
      setCurrentView('admin-students');
    } else if (user?.role === 'student' && currentView.startsWith('admin')) {
      setCurrentView('dashboard');
    }
  }, [user?.role]);

  // Handler when a theme is selected from Dashboard
  const handleSelectTopicTheme = (section, subteil, theme) => {
    setActiveSection(section);
    setActiveSubteil(subteil);
    setSelectedTopicData(theme);

    if (section === 'leseverstehen') setCurrentView('runner-leseverstehen');
    else if (section === 'sprachbausteine') setCurrentView('runner-sprachbausteine');
    else if (section === 'hoerverstehen') setCurrentView('runner-hoerverstehen');
    else if (section === 'schriftlicherAusdruck') setCurrentView('runner-schreiben');
    else if (section === 'muendlicherAusdruck') setCurrentView('runner-muendlich');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedTopicData(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-sm font-semibold">Lade telc Deutsch C1 Portal...</span>
        </div>
      </div>
    );
  }

  // Enforce Login Page if user is not authenticated
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Student Dashboard (Select Teil -> Select Theme) */}
        {currentView === 'dashboard' && (
          <StudentDashboard
            onSelectTopicTheme={handleSelectTopicTheme}
            onSwitchToAdmin={() => setCurrentView('admin-students')}
          />
        )}

        {/* Admin Views */}
        {currentView === 'admin-students' && (
          <AdminDashboard initialTab="students" />
        )}
        {currentView === 'admin-digitizer' && (
          <AdminDashboard initialTab="digitizer" />
        )}
        {currentView === 'admin-exams' && (
          <AdminDashboard initialTab="exams" />
        )}

        {/* Active Exercise Runners with Instant Scorecards */}
        {currentView === 'runner-leseverstehen' && selectedTopicData && (
          <LeseverstehenRunner
            subteil={activeSubteil}
            topicData={selectedTopicData}
            onBack={handleBackToDashboard}
            onChooseOtherTheme={handleBackToDashboard}
          />
        )}

        {currentView === 'runner-sprachbausteine' && selectedTopicData && (
          <SprachbausteineRunner
            topicData={selectedTopicData}
            onBack={handleBackToDashboard}
            onChooseOtherTheme={handleBackToDashboard}
          />
        )}

        {currentView === 'runner-hoerverstehen' && selectedTopicData && (
          <HoerverstehenRunner
            subteil={activeSubteil}
            topicData={selectedTopicData}
            onBack={handleBackToDashboard}
            onChooseOtherTheme={handleBackToDashboard}
          />
        )}

        {currentView === 'runner-schreiben' && selectedTopicData && (
          <SchriftlicherAusdruckRunner
            topicData={selectedTopicData}
            onBack={handleBackToDashboard}
            onChooseOtherTheme={handleBackToDashboard}
          />
        )}

        {currentView === 'runner-muendlich' && selectedTopicData && (
          <MuendlicherAusdruckRunner
            subteil={activeSubteil}
            topicData={selectedTopicData}
            onBack={handleBackToDashboard}
            onChooseOtherTheme={handleBackToDashboard}
          />
        )}

      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-semibold text-slate-700">
            telc Deutsch C1 Hochschule Portal & Sofortauswertung
          </div>
          <div className="text-[11px] text-slate-400">
            Prüfungsteile & Themenauswahl mit KI-Digitalisierung
          </div>
        </div>
      </footer>

    </div>
  );
}
