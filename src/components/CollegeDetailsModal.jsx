import React from 'react';
import {
  X,
  MapPin,
  Award,
  GraduationCap,
  ExternalLink,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Building,
  TrendingUp,
  Sparkles,
  DollarSign,
  Layers,
  ArrowRight
} from 'lucide-react';
import CollegeLogo from './CollegeLogo';

export default function CollegeDetailsModal({ college, isOpen, onClose, onApplyNow }) {
  if (!isOpen || !college) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <CollegeLogo college={college} size="xl" className="rounded-2xl shadow-xl ring-2 ring-white/20" />
            
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Admissions Open 2026-27
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-white/15 text-slate-200">
                  Code: {college.code}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-amber-400/20 text-amber-300">
                  {college.accreditation}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {college.name}
              </h2>
              {college.tamilName && (
                <p className="text-xs sm:text-sm text-indigo-200 font-medium">
                  {college.tamilName}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {college.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  Estd. {college.established}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-blue-400" />
                  {college.nirfRank}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-medium text-slate-400 uppercase block">Cutoff Requirement</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">{college.cutoffInfo}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-medium text-slate-400 uppercase block">Average Package</span>
              <span className="text-sm font-bold text-emerald-600 mt-1 block">{college.avgPackage}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-medium text-slate-400 uppercase block">Highest Package</span>
              <span className="text-sm font-bold text-indigo-600 mt-1 block">{college.highestPackage}</span>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-medium text-slate-400 uppercase block">Annual Fees</span>
              <span className="text-sm font-bold text-slate-900 mt-1 block">{college.annualFee}</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Key Institutional Highlights
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {college.highlights?.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Courses Offered */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Accredited Programs & Intake ({college.courses?.length || 0} Courses)
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="p-3">Course / Degree</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Cutoff Benchmark</th>
                    <th className="p-3">Sanctioned Seats</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {college.courses?.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="p-3 font-semibold text-slate-800">{c.name}</td>
                      <td className="p-3 text-slate-600">{c.duration}</td>
                      <td className="p-3 font-mono font-bold text-indigo-600">{c.cutoff}</td>
                      <td className="p-3 text-slate-700 font-medium">{c.seats} Seats</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quotas & Admissions Portal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Eligible Admission Quotas
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {college.quotas?.map((quota, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{quota}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Official Admission Helpdesk
              </h4>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{college.helpline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-blue-600" />
                  <span>{college.email}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <a
                    href={college.admissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline truncate"
                  >
                    {college.admissionUrl}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={college.admissionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors order-2 sm:order-1"
          >
            <span>Visit College Website Directly</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors w-1/3 sm:w-auto"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                if (onApplyNow) onApplyNow(college);
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-indigo-500/25 active:scale-[0.98] transition-all text-xs sm:text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Open Apply UI & Enroll Now ↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
