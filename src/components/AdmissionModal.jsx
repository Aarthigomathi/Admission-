import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  MapPin,
  GraduationCap,
  Building,
  User,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  Copy,
  Printer,
  ChevronRight,
  ShieldCheck,
  Check,
  Clock,
  ArrowRight
} from 'lucide-react';
import CollegeLogo from './CollegeLogo';

export default function AdmissionModal({ college, isOpen, onClose, onEnrollSuccess }) {
  if (!isOpen || !college) return null;

  // Form states
  const [selectedCourse, setSelectedCourse] = useState(
    college.courses && college.courses.length > 0 ? college.courses[0].name : 'Undergraduate Degree'
  );
  const [selectedQuota, setSelectedQuota] = useState(
    college.quotas && college.quotas.length > 0 ? college.quotas[0] : 'General / Single Window Quota'
  );
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [candidateCutoff, setCandidateCutoff] = useState('');
  const [candidateDistrict, setCandidateDistrict] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  // Submission & status states
  const [submittedData, setSubmittedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedAppId, setCopiedAppId] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);

  // Reset when college changes
  useEffect(() => {
    if (college) {
      setSelectedCourse(college.courses && college.courses.length > 0 ? college.courses[0].name : 'Undergraduate Degree');
      setSelectedQuota(college.quotas && college.quotas.length > 0 ? college.quotas[0] : 'General Quota');
      setSubmittedData(null);
      setErrorMsg('');
      setPopupBlocked(false);
    }
  }, [college]);

  const triggerConfettiAnimation = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1']
      });
    } catch {
      // Ignore if confetti fails
    }
  };

  const handleEnrollAndRedirect = (isQuick = false) => {
    setErrorMsg('');

    if (!isQuick) {
      if (!candidateName.trim()) {
        setErrorMsg('Please enter the Student Full Name / மாணவர் பெயரை உள்ளிடவும்');
        return;
      }
      if (!candidatePhone.trim() && !candidateEmail.trim()) {
        setErrorMsg('Please enter either a Mobile Number or Email for registration / மொபைல் எண் அல்லது மின்னஞ்சல் தேவை');
        return;
      }
    }

    setIsSubmitting(true);

    const applicationId = `ADM-${(college.crestInitials || 'TN').toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const record = {
      applicationId,
      collegeId: college.id,
      collegeName: college.name,
      collegeShortName: college.shortName,
      logoUrl: college.logoUrl,
      badgeColor: college.badgeColor,
      crestInitials: college.crestInitials,
      crestSymbol: college.crestSymbol,
      course: selectedCourse,
      quota: selectedQuota,
      candidateName: isQuick ? (candidateName || 'Direct Applicant') : candidateName,
      candidateEmail: candidateEmail || 'N/A',
      candidatePhone: candidatePhone || 'N/A',
      candidateCutoff: candidateCutoff || 'Pending Verification',
      candidateDistrict: candidateDistrict || 'Tamil Nadu',
      appliedAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      timestamp: Date.now(),
      admissionUrl: college.admissionUrl
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('my_admissions') || '[]');
      const updated = [record, ...existing.filter(item => item.collegeId !== college.id || item.course !== selectedCourse)];
      localStorage.setItem('my_admissions', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }

    if (onEnrollSuccess) {
      onEnrollSuccess(record);
    }

    triggerConfettiAnimation();

    // Now navigate / open the college admission link directly!
    let openedWindow = null;
    try {
      openedWindow = window.open(college.admissionUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      console.warn('Failed to open window', e);
    }

    // Check if popup was blocked or successfully opened
    if (!openedWindow || openedWindow.closed || typeof openedWindow.closed === 'undefined') {
      setPopupBlocked(true);
    } else {
      setPopupBlocked(false);
    }

    setIsSubmitting(false);
    setSubmittedData(record);
  };

  const handleCopyApplicationId = () => {
    if (submittedData?.applicationId) {
      navigator.clipboard.writeText(submittedData.applicationId);
      setCopiedAppId(true);
      setTimeout(() => setCopiedAppId(false), 2500);
    }
  };

  const handlePrintAcknowledgement = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-900/75 backdrop-blur-sm animate-fadeIn">
      {/* Modal Dialog Container */}
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with College Brand Gradient */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 pb-6">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
            {/* College Logo */}
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-inner">
              <CollegeLogo college={college} size="lg" className="rounded-xl shadow-md" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Admissions Open 2026-27
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-white/15 text-slate-200">
                  Code: {college.code}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-amber-400/20 text-amber-200 border border-amber-400/30">
                  {college.accreditation}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {college.name}
              </h2>
              {college.tamilName && (
                <p className="text-xs sm:text-sm text-indigo-200/90 font-medium mt-0.5">
                  {college.tamilName}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {college.location}
                </span>
                <span className="text-slate-400">•</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  {college.nirfRank}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* Submission Success State */}
          {submittedData ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800">
                  Enrollment Registered Successfully!
                </h3>
                <p className="text-slate-600 text-sm max-w-lg mx-auto">
                  Your admission interest for <span className="font-semibold text-slate-900">{college.shortName}</span> has been saved. 
                  You are now being redirected to the official college portal.
                </p>

                {/* Application Reference Card */}
                <div className="bg-white rounded-xl p-4 border border-emerald-100 max-w-md mx-auto shadow-sm text-left">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">Application Reference ID</span>
                    <button
                      onClick={handleCopyApplicationId}
                      className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:text-indigo-800"
                    >
                      {copiedAppId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedAppId ? 'Copied!' : 'Copy ID'}
                    </button>
                  </div>
                  <div className="pt-2 text-center">
                    <span className="text-xl font-mono font-bold tracking-wider text-indigo-900">
                      {submittedData.applicationId}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Candidate</span>
                      <span className="font-semibold text-slate-800">{submittedData.candidateName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Course Chosen</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">{submittedData.course}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Link Launcher / Fallback */}
                <div className="pt-2">
                  <a
                    href={college.admissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all text-sm w-full sm:w-auto"
                  >
                    <span>Proceed to Official College Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {popupBlocked && (
                    <p className="text-xs text-amber-700 font-medium mt-2">
                      ⚠️ Note: If your browser prevented opening a new tab automatically, click the button above to go directly.
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrintAcknowledgement}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / Save Application Slip
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors ml-auto"
                >
                  Close & View Applications
                </button>
              </div>
            </div>
          ) : (
            /* Enrollment & Details Form */
            <div className="space-y-6">
              
              {/* Highlight Note */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 flex items-start gap-3 text-xs sm:text-sm text-indigo-900">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block text-indigo-950 mb-0.5">
                    Direct College Enrollment Guarantee (நேரடி சேர்க்கை இணைப்பு)
                  </span>
                  <span>
                    When you click <strong>"Enroll Now & Go to College Portal"</strong>, your preferred course and details are verified, 
                    and you will directly be routed into <strong>{college.name}'s</strong> official application portal at:
                  </span>
                  <div className="mt-1.5 font-mono text-xs text-indigo-700 bg-white/80 p-1.5 rounded border border-indigo-200/60 truncate flex items-center justify-between">
                    <span className="truncate">{college.admissionUrl}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-1 text-indigo-500" />
                  </div>
                </div>
              </div>

              {/* Error message */}
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs sm:text-sm text-rose-700 flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Step 1: Select Desired Course */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <label className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  Select Desired Degree / Course (விரும்பிய படிப்பு)
                  <span className="text-rose-500">*</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {college.courses?.map((course, idx) => {
                    const isSelected = selectedCourse === course.name;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedCourse(course.name)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                            {course.name}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
                          <span>Cutoff: <strong className="text-slate-700">{course.cutoff}</strong></span>
                          <span>Seats: <strong className="text-slate-700">{course.seats}</strong></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Quota Selection & College Cutoff Guidance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Admission Quota / ஒதுக்கீடு
                  </label>
                  <select
                    value={selectedQuota}
                    onChange={(e) => setSelectedQuota(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                  >
                    {college.quotas?.map((quota, idx) => (
                      <option key={idx} value={quota}>
                        {quota}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400">
                    Fee structure: {college.annualFee}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    Expected Cutoff Marks / Score
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 195.5 / 200 or 95%"
                      value={candidateCutoff}
                      onChange={(e) => setCandidateCutoff(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    College Benchmark: <span className="font-semibold text-indigo-700">{college.cutoffInfo}</span>
                  </p>
                </div>
              </div>

              {/* Step 3: Candidate Information Form */}
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-xs sm:text-sm font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-600" />
                  Candidate Information (மாணவர் விவரங்கள்)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Full Name (பெயர்) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="e.g. K. Vignesh Kumar"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Mobile Number / WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="e.g. 98765 43210"
                        value={candidatePhone}
                        onChange={(e) => setCandidatePhone(e.target.value)}
                        className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Email Address (மின்னஞ்சல்)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        placeholder="e.g. student@gmail.com"
                        value={candidateEmail}
                        onChange={(e) => setCandidateEmail(e.target.value)}
                        className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Native District / State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chennai, Coimbatore, Madurai"
                      value={candidateDistrict}
                      onChange={(e) => setCandidateDistrict(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-600 cursor-pointer">
                    I understand this will save my enrollment record and open the official admission portal of <strong>{college.shortName}</strong>.
                  </label>
                </div>
              </div>

              {/* Admission Helpline & Deadlines */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 px-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  Application Deadline: <strong>{college.deadline}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  Helpline: <strong className="text-slate-700">{college.helpline}</strong>
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Primary Enroll Actions */}
        {!submittedData && (
          <div className="bg-white border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => handleEnrollAndRedirect(true)}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 order-2 sm:order-1 transition-colors"
              title="Skip form and immediately open college admission link"
            >
              <span>Quick Direct Open Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors w-1/3 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleEnrollAndRedirect(false)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md shadow-indigo-500/25 active:scale-[0.98] transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Opening Portal...' : 'Enroll Now & Enter College Portal ↗'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
