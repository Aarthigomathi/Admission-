import React, { useState, useEffect, useMemo } from 'react';
import { initialColleges } from './data/colleges';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CollegeCard from './components/CollegeCard';
import AdmissionModal from './components/AdmissionModal';
import CollegeDetailsModal from './components/CollegeDetailsModal';
import ApplicationsDrawer from './components/ApplicationsDrawer';
import AddCollegeModal from './components/AddCollegeModal';
import {
  GraduationCap,
  Sparkles,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Building2,
  Bookmark,
  Layers,
  ArrowRight,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function App() {
  // Colleges state (initial + custom from localStorage)
  const [colleges, setColleges] = useState(() => {
    try {
      const savedCustom = localStorage.getItem('custom_colleges');
      if (savedCustom) {
        const parsed = JSON.parse(savedCustom);
        return [...initialColleges, ...parsed];
      }
    } catch (e) {
      console.warn('Error loading custom colleges', e);
    }
    return initialColleges;
  });

  // Enrolled applications state
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('my_admissions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('college_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStream, setSelectedStream] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [language, setLanguage] = useState('en');

  // Modals & Drawer states
  const [activeApplyCollege, setActiveApplyCollege] = useState(null);
  const [activeDetailsCollege, setActiveDetailsCollege] = useState(null);
  const [isApplicationsDrawerOpen, setIsApplicationsDrawerOpen] = useState(false);
  const [isAddCollegeOpen, setIsAddCollegeOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Toggle Bookmark
  const handleToggleBookmark = (id) => {
    setBookmarks(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(item => item !== id) : [...prev, id];
      try {
        localStorage.setItem('college_bookmarks', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      showToast(exists ? 'Removed from bookmarks' : 'Added to bookmarks ⭐');
      return updated;
    });
  };

  // Add Custom College
  const handleAddCollege = (newCollege) => {
    setColleges(prev => {
      const updated = [newCollege, ...prev];
      try {
        const customColleges = updated.filter(c => c.isCustom);
        localStorage.setItem('custom_colleges', JSON.stringify(customColleges));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    showToast(`Added ${newCollege.name} successfully with direct admission link!`);
  };

  // Remove application
  const handleRemoveApplication = (appId) => {
    setApplications(prev => {
      const updated = prev.filter(app => app.applicationId !== appId);
      try {
        localStorage.setItem('my_admissions', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
    showToast('Application record removed');
  };

  // Clear all applications
  const handleClearAllApplications = () => {
    if (window.confirm('Are you sure you want to clear your application history?')) {
      setApplications([]);
      try {
        localStorage.removeItem('my_admissions');
      } catch (e) {
        console.warn(e);
      }
      showToast('All applications cleared');
    }
  };

  // On successful enrollment from modal
  const handleEnrollSuccess = (newRecord) => {
    setApplications(prev => {
      const filtered = prev.filter(item => item.collegeId !== newRecord.collegeId || item.course !== newRecord.course);
      return [newRecord, ...filtered];
    });
    showToast(`Enrolled in ${newRecord.collegeShortName}! Launching official portal...`);
  };

  // Filtered colleges list
  const filteredColleges = useMemo(() => {
    return colleges.filter(college => {
      // Bookmarks filter
      if (showBookmarksOnly && !bookmarks.includes(college.id)) {
        return false;
      }

      // Stream filter
      if (selectedStream !== 'all' && college.stream !== selectedStream) {
        return false;
      }

      // Location filter
      if (selectedLocation && !college.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = college.name.toLowerCase().includes(q);
        const matchesTamil = college.tamilName && college.tamilName.toLowerCase().includes(q);
        const matchesShort = college.shortName && college.shortName.toLowerCase().includes(q);
        const matchesCode = college.code && college.code.toLowerCase().includes(q);
        const matchesLocation = college.location.toLowerCase().includes(q);
        const matchesCourses = college.courses?.some(c => c.name.toLowerCase().includes(q));

        if (!matchesName && !matchesTamil && !matchesShort && !matchesCode && !matchesLocation && !matchesCourses) {
          return false;
        }
      }

      return true;
    });
  }, [colleges, bookmarks, showBookmarksOnly, selectedStream, selectedLocation, searchQuery]);

  const isTamil = language === 'ta';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-slideUp text-xs sm:text-sm max-w-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="flex-1">{toast.message}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar
        language={language}
        onToggleLanguage={() => setLanguage(prev => prev === 'en' ? 'ta' : 'en')}
        applicationCount={applications.length}
        onOpenApplications={() => setIsApplicationsDrawerOpen(true)}
        bookmarkCount={bookmarks.length}
        showBookmarksOnly={showBookmarksOnly}
        onToggleBookmarksOnly={() => setShowBookmarksOnly(prev => !prev)}
        onOpenAddCollege={() => setIsAddCollegeOpen(true)}
      />

      {/* Hero Header with Search & Filters */}
      <HeroSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStream={selectedStream}
        setSelectedStream={setSelectedStream}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        totalColleges={filteredColleges.length}
        language={language}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-6">
        
        {/* Results Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-600" />
              <span>
                {isTamil ? 'அங்கீகரிக்கப்பட்ட கல்லூரிகள்' : 'Participating Colleges & Universities'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold ml-1">
                {filteredColleges.length}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {isTamil
                ? 'கல்லூரி லோகோ மற்றும் "Apply & Enroll" பட்டனை அழுத்தி சேர்க்கை UI-யை திறந்து நேரடியாக போர்ட்டலுக்குள் இணையவும்'
                : 'Click "Apply & Enroll Now" on any college card to open the admission UI and proceed directly into their portal'}
            </p>
          </div>

          {/* Quick Active Filter Badges */}
          <div className="flex flex-wrap items-center gap-1.5 self-end sm:self-auto">
            {showBookmarksOnly && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800 flex items-center gap-1">
                <Bookmark className="w-3 h-3 fill-amber-600" />
                Bookmarks Only
                <button onClick={() => setShowBookmarksOnly(false)} className="hover:text-amber-950 font-bold ml-1">×</button>
              </span>
            )}

            {selectedStream !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-800 flex items-center gap-1">
                Stream: {selectedStream}
                <button onClick={() => setSelectedStream('all')} className="hover:text-indigo-950 font-bold ml-1">×</button>
              </span>
            )}

            {selectedLocation && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-100 text-rose-800 flex items-center gap-1">
                Location: {selectedLocation}
                <button onClick={() => setSelectedLocation('')} className="hover:text-rose-950 font-bold ml-1">×</button>
              </span>
            )}

            {(showBookmarksOnly || selectedStream !== 'all' || selectedLocation || searchQuery) && (
              <button
                onClick={() => {
                  setShowBookmarksOnly(false);
                  setSelectedStream('all');
                  setSelectedLocation('');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* College Cards Grid */}
        {filteredColleges.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No colleges matched your filters</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Try modifying your search term or clearing the filters to view all Tamil Nadu & Indian colleges.
            </p>
            <button
              onClick={() => {
                setShowBookmarksOnly(false);
                setSelectedStream('all');
                setSelectedLocation('');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              <span>Show All Colleges</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredColleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onApply={(clg) => setActiveApplyCollege(clg)}
                onViewDetails={(clg) => setActiveDetailsCollege(clg)}
                isBookmarked={bookmarks.includes(college.id)}
                onToggleBookmark={handleToggleBookmark}
                language={language}
              />
            ))}
          </div>
        )}

        {/* Informational Guidance Banner */}
        <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mt-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="lg:col-span-2 space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-indigo-200 border border-white/20 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Single Window & Direct Enrollment Flow
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                {isTamil 
                  ? 'கல்லூரி விண்ணப்பம் மற்றும் சேர்க்கை செயல்முறை விளக்கம்' 
                  : 'How the Direct College Admission & Enrollment Flow Works'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isTamil
                  ? 'ஒவ்வொரு கல்லூரி அட்டையிலும் உள்ள "Apply & சேர்க்கை UI" பட்டனை கிளிக் செய்தால் விண்ணப்ப படிவம் தோன்றும். அதில் உங்கள் படிப்பு மற்றும் விவரங்களை உள்ளிட்ட பிறகு "Enroll Now" பட்டனை தட்டினால், அந்த குறிப்பிட்ட கல்லூரியின் அதிகாரப்பூர்வ சேர்க்கை போர்ட்டல் (Official Portal Link) நேரடியாக திறக்கப்படும்.'
                  : 'Every college has an authenticated admission link. Clicking "Apply & Enroll Now" opens our dedicated Admission Modal. After selecting your preferred course and quota, clicking "Enroll Now" saves your application reference and navigates you straight into that institution\'s official online admission system.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => setIsApplicationsDrawerOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-950 font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors shadow-md"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>View Enrolled Applications ({applications.length})</span>
              </button>

              <button
                onClick={() => setIsAddCollegeOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-colors"
              >
                <span>Add Another College Link</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-16 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-base">AdmissionPortal TN & India</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-400">
              <span className="hover:text-white cursor-pointer">TNEA Information</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">NIRF Rankings</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">NEET UG Updates</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">Anna University Affiliations</span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
            <p>© 2026-2027 College Admission & Direct Enrollment Portal. Built for students seeking higher education.</p>
            <p>Direct official portal links redirect to verified university domains.</p>
          </div>
        </div>
      </footer>

      {/* Admission / Apply Modal - The primary requested feature */}
      <AdmissionModal
        college={activeApplyCollege}
        isOpen={!!activeApplyCollege}
        onClose={() => setActiveApplyCollege(null)}
        onEnrollSuccess={handleEnrollSuccess}
      />

      {/* College Full Details Modal */}
      <CollegeDetailsModal
        college={activeDetailsCollege}
        isOpen={!!activeDetailsCollege}
        onClose={() => setActiveDetailsCollege(null)}
        onApplyNow={(clg) => setActiveApplyCollege(clg)}
      />

      {/* My Applications Drawer */}
      <ApplicationsDrawer
        isOpen={isApplicationsDrawerOpen}
        onClose={() => setIsApplicationsDrawerOpen(false)}
        applications={applications}
        onRemoveApplication={handleRemoveApplication}
        onClearAll={handleClearAllApplications}
      />

      {/* Add Custom College Modal */}
      <AddCollegeModal
        isOpen={isAddCollegeOpen}
        onClose={() => setIsAddCollegeOpen(false)}
        onAddCollege={handleAddCollege}
      />

    </div>
  );
}
