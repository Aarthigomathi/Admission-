import React from 'react';
import {
  GraduationCap,
  FileText,
  Plus,
  Languages,
  Sparkles,
  Bookmark
} from 'lucide-react';

export default function Navbar({
  language,
  onToggleLanguage,
  applicationCount,
  onOpenApplications,
  bookmarkCount,
  onToggleBookmarksOnly,
  showBookmarksOnly,
  onOpenAddCollege
}) {
  const isTamil = language === 'ta';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-xl text-slate-900 tracking-tight">
                  {isTamil ? 'கல்லூரி சேர்க்கை' : 'AdmissionPortal'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                  2026-27
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-1">
                {isTamil ? 'நேரடி சேர்க்கை & கல்லூரி இணைப்புகள்' : 'Direct College Admission & Enrollment Links'}
              </p>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Language Switch */}
            <button
              onClick={onToggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              title="Change Language"
            >
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isTamil ? 'English' : 'தமிழ்'}</span>
            </button>

            {/* Bookmarks Filter */}
            <button
              onClick={onToggleBookmarksOnly}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                showBookmarksOnly
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Saved Colleges"
            >
              <Bookmark className={`w-3.5 h-3.5 ${showBookmarksOnly ? 'fill-white' : ''}`} />
              <span className="hidden sm:inline">{isTamil ? 'சேமிக்கப்பட்டவை' : 'Saved'}</span>
              {bookmarkCount > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  showBookmarksOnly ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {bookmarkCount}
                </span>
              )}
            </button>

            {/* My Applications Drawer Trigger */}
            <button
              onClick={onOpenApplications}
              className="relative flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-900 hover:bg-indigo-900 text-white text-xs font-bold transition-all shadow-sm"
              title="View Enrolled Applications"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">{isTamil ? 'விண்ணப்பங்கள்' : 'My Enrollments'}</span>
              {applicationCount > 0 ? (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {applicationCount}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 sm:inline hidden">(0)</span>
              )}
            </button>

            {/* Add Custom College Button */}
            <button
              onClick={onOpenAddCollege}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors"
              title="Add a custom college"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isTamil ? 'கல்லூரி சேர்க்க' : 'Add College'}</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
