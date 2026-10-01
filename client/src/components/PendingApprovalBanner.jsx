import React from 'react';
import { Clock, ShieldAlert } from 'lucide-react';

export function PendingApprovalBanner() {
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
                Ihr Studentenkonto wartet auf Administrator-Freischaltung
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold uppercase">
                Status: Ausstehend
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-100 mt-1 leading-relaxed max-w-2xl">
              Gemäß telc Prüfungsrichtlinien muss der Administrator Ihr Konto in der Benutzerverwaltung freischalten, bevor Übungen und Prüfungsversuche gewertet werden können. Bitte wenden Sie sich an die Prüfungsleitung (z. B. admin@telc.de).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <div className="px-3.5 py-2 bg-white/15 rounded-xl text-xs font-bold text-white border border-white/20 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-200" />
            Wartet auf Admin-Freigabe
          </div>
        </div>
      </div>
    </div>
  );
}
