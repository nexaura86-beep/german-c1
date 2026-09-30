import React from 'react';
import { AlertCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export function PendingApprovalBanner({ onSwitchToAdmin }) {
  const { switchDemoRole } = useAuth();

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white p-4 sm:p-5 rounded-2xl shadow-lg mb-8 border border-amber-400/40">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur shrink-0">
            <Clock className="w-6 h-6 text-amber-100 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                Dein Studentenkonto wartet auf Administrator-Freischaltung
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold uppercase">
                Status: Ausstehend
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 leading-relaxed max-w-2xl">
              Gemäß telc Prüfungsrichtlinien muss der Administrator dein Konto freischalten, bevor Prüfungsversuche gewertet werden. Du kannst Prüfungen im Vorschaumodus ansehen oder als Administrator wechseln, um das Konto sofort zu aktivieren.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={() => {
              switchDemoRole('admin');
              if (onSwitchToAdmin) onSwitchToAdmin();
            }}
            className="px-4 py-2 bg-white hover:bg-amber-50 text-amber-900 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Als Admin freischalten
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
