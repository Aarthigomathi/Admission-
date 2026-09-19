import React from 'react';
import {
  MapPin,
  Award,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckCircle,
  Sparkles,
  Building2,
  Bookmark
} from 'lucide-react';
import CollegeLogo from './CollegeLogo';

export default function CollegeCard({
  college,
  onApply,
  onViewDetails,
  isBookmarked,
  onToggleBookmark,
  language = 'en'
}) {
  const isTamil = language === 'ta';

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Banner Accent with Verified Tag */}
      <div className="relative px-5 pt-5 pb-3 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-transparent">
        <div className="flex items-start justify-between gap-3">
          
          {/* Logo & Basic Info */}
          <div className="flex items-start gap-3.5">
            <CollegeLogo
              college={college}
              size="md"
              className="group-hover:scale-105 transition-transform duration-300 ring-2 ring-slate-100"
            />
            
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {isTamil ? 'சேர்க்கை நடப்பில் உள்ளது' : 'Admissions Open'}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-600">
                  #{college.code}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                {college.name}
              </h3>
              {college.tamilName && (
                <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                  {college.tamilName}
                </p>
              )}
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark && onToggleBookmark(college.id)}
            className={`p-2 rounded-xl transition-colors shrink-0 ${
              isBookmarked
                ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark college'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Location & Accreditation Row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="line-clamp-1">{college.location}</span>
          </span>
          <span className="flex items-center gap-1 text-indigo-700 font-medium bg-indigo-50/70 px-2 py-0.5 rounded-md">
            <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>{college.nirfRank}</span>
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Cutoff & Fees highlight grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block font-medium">Cutoff / தகுதி</span>
            <span className="font-bold text-slate-800 line-clamp-1 text-xs sm:text-[13px] mt-0.5">
              {college.cutoffInfo}
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-400 block font-medium">Avg Package / சம்பளம்</span>
            <span className="font-bold text-emerald-700 text-xs sm:text-[13px] mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              {college.avgPackage}
            </span>
          </div>
        </div>

        {/* Popular Courses Pills */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            {isTamil ? 'முக்கிய படிப்புகள்' : 'Featured Courses'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {college.courses?.slice(0, 3).map((course, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg transition-colors border border-slate-200/60 line-clamp-1"
              >
                {course.name.split(' (')[0]}
              </span>
            ))}
            {college.courses && college.courses.length > 3 && (
              <span className="text-[11px] font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">
                +{college.courses.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Destination Link Preview */}
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="truncate pr-2">Portal: {college.admissionUrl}</span>
          <a
            href={college.admissionUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-0.5 font-semibold shrink-0"
            title="Open portal in new tab"
          >
            <span>Visit</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="px-5 pb-5 pt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(college)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
        >
          {isTamil ? 'விவரம்' : 'Details'}
        </button>

        {/* Primary CTA - Opens the Admission UI Modal */}
        <button
          type="button"
          onClick={() => onApply && onApply(college)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all text-xs sm:text-sm cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{isTamil ? 'Apply & சேர்க்கை UI' : 'Apply & Enroll Now ↗'}</span>
        </button>
      </div>
    </div>
  );
}
