import React from 'react';
import {
  Search,
  Filter,
  Sparkles,
  MapPin,
  GraduationCap,
  Building,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function HeroSection({
  searchQuery,
  setSearchQuery,
  selectedStream,
  setSelectedStream,
  selectedLocation,
  setSelectedLocation,
  totalColleges,
  language = 'en'
}) {
  const isTamil = language === 'ta';

  const streams = [
    { id: 'all', label: isTamil ? 'அனைத்து பிரிவுகள்' : 'All Streams' },
    { id: 'Engineering', label: isTamil ? 'பொறியியல் (Engineering)' : 'Engineering' },
    { id: 'Arts & Science', label: isTamil ? 'கலை & அறிவியல் (Arts & Science)' : 'Arts & Science' },
    { id: 'Medical', label: isTamil ? 'மருத்துவம் (Medical)' : 'Medical' }
  ];

  const locations = [
    'All Locations',
    'Chennai',
    'Coimbatore',
    'Madurai',
    'Vellore',
    'Thanjavur'
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-600/15 via-indigo-500/20 to-purple-600/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center space-y-6">
        
        {/* Banner Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-sm shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {isTamil ? 'தமிழ்நாடு & இந்தியா கல்லூரி சேர்க்கை போர்டல் 2026-27' : 'Tamil Nadu & India College Admissions 2026-2027'}
          </span>
        </div>

        {/* Hero Heading */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {isTamil ? (
            <>
              ஒவ்வொரு கல்லூரிக்கும் <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Apply UI</span> மூலம்
              <br />
              நேரடியாக அதிகாரப்பூர்வ சேர்க்கை போர்ட்டலுக்குள் இணையுங்கள்!
            </>
          ) : (
            <>
              Explore Colleges, Open the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">Apply UI</span>
              <br />
              & Enroll Directly into the Official College Portal!
            </>
          )}
        </h1>

        {/* 3-Step Flow Explain Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-w-3xl mx-auto pt-1 pb-2 text-left">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0">1</span>
            <span className="text-xs text-slate-200">
              {isTamil ? 'கல்லூரிகள் & லோகோக்களை காண்க' : 'Browse colleges with official logos'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-bold text-xs flex items-center justify-center shrink-0">2</span>
            <span className="text-xs text-slate-200">
              {isTamil ? 'Apply தட்டினால் சேர்க்கை UI திறக்கும்' : 'Click Apply to open Admission UI'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">3</span>
            <span className="text-xs text-slate-200">
              {isTamil ? 'Enroll தட்டினால் போர்ட்டல் இணைப்புக்குள் செல்லும்' : 'Click Enroll to launch official portal'}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto relative mt-2">
          <div className="relative flex items-center bg-white rounded-2xl shadow-xl shadow-slate-950/20 border border-slate-200/80 p-1.5 focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              placeholder={
                isTamil
                  ? 'கல்லூரி பெயர், ஊர் (Chennai, Coimbatore), அல்லது படிப்பு (AI, CSE, MBBS) தேடவும்...'
                  : 'Search by College name, Code (0001), City (Chennai, Kovai), or Course (AI, CSE, Viscom)...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-slate-900 placeholder:text-slate-400 text-sm sm:text-base px-3 py-2.5 bg-transparent border-none focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2.5 py-1 rounded-md hover:bg-slate-100 mr-1"
              >
                Clear
              </button>
            )}
            <div className="hidden sm:flex items-center pr-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-2 rounded-xl">
              {totalColleges} Colleges
            </div>
          </div>
        </div>

        {/* Stream Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {streams.map((stream) => {
            const isSelected = selectedStream === stream.id;
            return (
              <button
                key={stream.id}
                onClick={() => setSelectedStream(stream.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-white text-indigo-900 shadow-md scale-105 font-bold'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15'
                }`}
              >
                {stream.label}
              </button>
            );
          })}
        </div>

        {/* Location Quick Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-300 pt-1">
          <span className="text-slate-400 flex items-center gap-1 mr-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            {isTamil ? 'மாவட்டம்:' : 'Location:'}
          </span>
          {locations.map((loc) => {
            const isSelected = (selectedLocation === 'All Locations' && loc === 'All Locations') || selectedLocation === loc;
            return (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc === 'All Locations' ? '' : loc)}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] transition-colors ${
                  isSelected || (loc === 'All Locations' && !selectedLocation)
                    ? 'bg-indigo-500/40 text-white font-bold border border-indigo-400/50'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
