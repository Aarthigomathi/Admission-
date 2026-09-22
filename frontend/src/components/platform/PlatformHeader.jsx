import { Link, useLocation } from 'react-router-dom'
import { Search, MapPin, Bookmark, GitCompare, Menu, X, GraduationCap, Building2, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'
import LanguageToggle from '../student/LanguageToggle'
import { useLanguage } from '../../lib/languageContext'

export default function PlatformHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState(null)
  const loc = useLocation()
  const { t } = useLanguage()
  const isCollegePage = loc.pathname.startsWith('/college/')
  const isAdminPage = loc.pathname.startsWith('/admin') || loc.pathname.startsWith('/platform-admin') || loc.pathname.startsWith('/student')

  useEffect(() => {
    const student = localStorage.getItem('tn_current_student')
    if (student) setCurrentStudent(JSON.parse(student))
  }, [loc.pathname])

  if (isCollegePage || isAdminPage) return null

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#FAB95B]/30 bg-[#E8E2DB]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[12px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-display text-[20px] font-bold tracking-tight border-2 border-[#FAB95B]">T</div>
            <div className="leading-[0.9]">
              <div className="font-display text-[18px] font-semibold tracking-tight text-[#1A3263]">Tamil Nadu</div>
              <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#547792]">Colleges • Premium • Secure</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-white p-1 border-2 border-[#E8E2DB] shadow-sm">
            <Link to="/" className="px-5 h-9 grid place-items-center rounded-full text-[13px] font-bold bg-[#1A3263] text-[#FAB95B]">Home</Link>
            <Link to="/search" className="px-5 h-9 grid place-items-center rounded-full text-[13px] font-medium text-[#547792] hover:text-[#1A3263]">Explore</Link>
            <Link to="/search" className="px-5 h-9 grid place-items-center rounded-full text-[13px] font-medium text-[#547792] hover:text-[#1A3263]">Courses</Link>
            <Link to="/student/compare" className="px-5 h-9 grid place-items-center rounded-full text-[13px] font-medium text-[#547792] hover:text-[#1A3263]">Compare</Link>
            <Link to="/student/saved" className="px-5 h-9 grid place-items-center rounded-full text-[13px] font-medium text-[#547792] hover:text-[#1A3263]">Saved</Link>
          </nav>

          <div className="flex items-center gap-2">
            {currentStudent && <div className="hidden md:flex"><LanguageToggle variant="pill" /></div>}
            <div className="hidden md:flex items-center gap-1.5 rounded-full bg-white border-2 border-[#E8E2DB] px-3 h-10 mr-1">
              <MapPin size={14} className="text-[#547792]" />
              <select className="bg-transparent text-[12px] font-medium outline-none text-[#1A3263]">
                <option>{t('allDistricts')}</option>
                <option>Coimbatore</option>
                <option>Chennai</option>
                <option>Madurai</option>
              </select>
            </div>
            <Link to="/search" className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B]">
              <Search size={18} />
            </Link>
            {currentStudent ? (
              <Link to="/student/dashboard" className="hidden md:inline-flex h-10 px-5 items-center justify-center rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#1A3263] text-[12px] font-bold gap-1.5"><GraduationCap size={14} /> {currentStudent.fullName?.split(' ')[0] || t('dashboard')}</Link>
            ) : (
              <>
                <Link to="/login" className="hidden md:inline-flex h-10 px-5 items-center justify-center rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] text-[12px] font-bold">{t('login')}</Link>
                <Link to="/student/signup" className="hidden md:inline-flex h-10 px-5 items-center justify-center rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] text-[12px] font-bold">Student Sign Up</Link>
              </>
            )}
            <Link to="/college/signup" className="hidden lg:inline-flex h-10 px-5 items-center justify-center rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#FAB95B] text-[12px] font-bold gap-1.5"><Building2 size={14} /> College Sign Up</Link>
            <Link to="/platform-admin" className="hidden lg:grid h-10 w-10 place-items-center rounded-full bg-[#547792] text-white border-2 border-[#547792]"><Shield size={16} /></Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden h-10 w-10 grid place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263]">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t-2 border-[#E8E2DB] bg-[#E8E2DB] p-6 space-y-4">
          {currentStudent && <div className="flex justify-center"><LanguageToggle variant="pill" /></div>}
          <Link to="/" className="block py-2 font-bold text-[#1A3263]">{t('home')} - Premium</Link>
          <Link to="/search" className="block py-2 font-medium text-[#1A3263]">{t('explore')} - Real</Link>
          <Link to="/student/dashboard" className="block py-2 font-medium text-[#1A3263]">{t('dashboard')}</Link>
          <Link to="/student/saved" className="block py-2 font-medium text-[#1A3263]">{t('saved')}</Link>
          <Link to="/student/compare" className="block py-2 font-medium text-[#1A3263]">{t('compare')} 2-4 Colleges</Link>
          <Link to="/student/enquiries" className="block py-2 font-medium text-[#1A3263]">{t('enquiries')} - Consent Only</Link>
          <div className="pt-4 flex flex-col gap-2">
            <Link to="/student/signup" className="h-11 px-6 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold grid place-items-center">Student Sign Up - Multi Step</Link>
            <Link to="/college/signup" className="h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#FAB95B] font-bold grid place-items-center">College Sign Up - Verification</Link>
            <Link to="/login" className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold grid place-items-center">Login - 3 Roles</Link>
            <Link to="/platform-admin" className="h-11 px-6 rounded-full bg-[#547792] text-white font-bold grid place-items-center">Platform Admin - Analytics & PDF</Link>
            <Link to="/admin" className="h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#FAB95B] font-bold grid place-items-center">College Admin - Manage Own</Link>
          </div>
          <div className="pt-4 text-[11px] text-[#547792] leading-[1.5]">Three roles: STUDENT/COLLEGE/PLATFORM_ADMIN • Role-based auth • Student activity tracking secure • Privacy: viewing does NOT auto-send personal info • Only ENQUIRE NOW with consent shares</div>
        </div>
      )}
    </header>
  )
}
