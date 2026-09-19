import React from 'react';
import {
  X,
  ExternalLink,
  Trash2,
  Printer,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Building,
  ArrowRight,
  FileText
} from 'lucide-react';
import CollegeLogo from './CollegeLogo';

export default function ApplicationsDrawer({
  isOpen,
  onClose,
  applications = [],
  onRemoveApplication,
  onClearAll
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base">My Enrolled Colleges</h3>
                <p className="text-xs text-indigo-200">
                  {applications.length} Application{applications.length !== 1 ? 's' : ''} Recorded
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {applications.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-3">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">No Applications Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Click <strong>"Apply & Enroll"</strong> on any college card to open the enrollment UI and launch their official portal.
                </p>
              </div>
            ) : (
              applications.map((app, idx) => (
                <div
                  key={app.applicationId || idx}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3 hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <CollegeLogo
                        college={{
                          id: app.collegeId,
                          name: app.collegeName,
                          shortName: app.collegeShortName,
                          logoUrl: app.logoUrl,
                          badgeColor: app.badgeColor,
                          crestInitials: app.crestInitials,
                          crestSymbol: app.crestSymbol
                        }}
                        size="sm"
                        className="rounded-lg shadow-sm"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                          {app.collegeShortName || app.collegeName}
                        </h4>
                        <span className="text-[11px] font-mono text-indigo-700 font-semibold">
                          {app.applicationId}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveApplication && onRemoveApplication(app.applicationId)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors"
                      title="Remove from history"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Degree:</span>
                      <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">{app.course}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-400">Applicant:</span>
                      <span className="font-semibold text-slate-800">{app.candidateName}</span>
                    </div>
                    {app.candidateCutoff && (
                      <div className="flex justify-between text-slate-600">
                        <span className="text-slate-400">Cutoff:</span>
                        <span className="font-mono font-semibold text-indigo-600">{app.candidateCutoff}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-200/50">
                      <span>Enrolled On:</span>
                      <span>{app.appliedAt}</span>
                    </div>
                  </div>

                  {/* Direct Portal Launch Button */}
                  <a
                    href={app.admissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors"
                  >
                    <span>Re-visit Official Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {applications.length > 0 && (
            <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={onClearAll}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold p-1"
              >
                Clear All
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print List
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
