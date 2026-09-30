import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, MapPin, Menu, X, GraduationCap, Building2, Shield, LayoutDashboard } from 'lucide-react'
import { useState, useEffect } from 'react'
import { StudentLanguageToggleAlways } from '../student/LanguageToggle'
import { useLanguage } from '../../lib/languageContext'
import { districts } from '../../lib/colleges'
import RoleLoginModal from './RoleLoginModal'

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Explore', to: '/search' },
  { label: 'Courses', to: '/search' },
  { label: 'Compare', to: '/student/compare' },
  { label: 'Saved', to: '/student/saved' },
]

export default function PlatformHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [currentStudent, setCurrentStudent] = useState(null)
  const [currentCollege, setCurrentCollege] = useState(null)
  const [district, setDistrict] = useState('All')
  const loc = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const isCollegePage = loc.pathname.startsWith('/college/')
  const isAdminPage = loc.pathname.startsWith('/admin') || loc.pathname.startsWith('/platform-admin') || loc.pathname.startsWith('/student')

  useEffect(() => {
    const student = localStorage.getItem('tn_current_student')
    setCurrentStudent(student ? JSON.parse(student) : null)
    const college = localStorage.getItem('tn_current_college')
    setCurrentCollege(college ? JSON.parse(college) : null)
  }, [loc.pathname, loginOpen])

  // Header district dropdown & the search page filter always stay in sync
  useEffect(() => {
    const params = new URLSearchParams(loc.search)
    setDistrict(params.get('district') || 'All')
  }, [loc.search])

  if (isCollegePage || isAdminPage) return null

  const pickDistrict = value => {
    setDistrict(value)
    navigate(value === 'All' ? '/search' : `/search?district=${encodeURIComponent(value)}`)
  }

  const isActive = to =>
    to === '/' ? loc.pathname === '/' : loc.pathname.startsWith(to)

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#FAB95B]/30 bg-[#E8E2DB]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-[12px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-display text-[20px] font-bold tracking-tight border-2 border-[#FAB95B]">T</div>
            <div className="leading-[0.95]">
              <div className="font-display text-[18px] font-semibold tracking-tight text-[#1A3263]">Tamil Nadu</div>
              <div className="text-[10px] font-semibold tracking-[0.14em] uppercase text-[#547792]">Discover • Decide • Dream</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-white p-1 border-2 border-[#E8E2DB] shadow-sm">
            {NAV.map(item => (
              <Link
                key={item.label}
                to={item.to}
                className={`px-5 h-9 grid place-items-center rounded-full text-[13px] transition-colors ${isActive(item.to) ? 'font-bold bg-[#1A3263] text-[#FAB95B]' : 'font-medium text-[#547792] hover:text-[#1A3263]'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Tamil / English toggle - always visible */}
            <div className="hidden md:flex">
              <StudentLanguageToggleAlways variant="pill" />
            </div>

            {/* All districts - 38 */}
            <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-white border-2 border-[#E8E2DB] px-3 h-10">
              <MapPin size={14} className="text-[#547792]" />
              <select
                value={district}
                onChange={e => pickDistrict(e.target.value)}
                className="bg-transparent text-[12px] font-medium outline-none text-[#1A3263] max-w-[150px]"
                aria-label={t('allDistricts')}
              >
                <option value="All">{t('allDistricts')}</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <Link to="/search" className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B]" aria-label="Search colleges">
              <Search size={18} />
            </Link>

            {/* Demo / 3 logins */}
            {currentStudent ? (
              <Link to="/student/dashboard" className="hidden md:inline-flex h-10 px-5 items-center justify-center rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#1A3263] text-[12px] font-bold gap-1.5">
                <GraduationCap size={14} /> {currentStudent.fullName?.split(' ')[0] || t('dashboard')}
              </Link>
            ) : currentCollege ? (
              <Link to="/admin" className="hidden md:inline-flex h-10 px-5 items-center justify-center rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#1A3263] text-[12px] font-bold gap-1.5">
                <LayoutDashboard size={14} /> College Admin
              </Link>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="h-10 px-5 inline-flex items-center justify-center rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#FAB95B] text-[12px] font-bold gap-1.5 hover:brightness-110 transition-all"
              >
                <GraduationCap size={14} /> Demo
              </button>
            )}

            {/* Shield -> 3 role logins */}
            <button
              onClick={() => setLoginOpen(true)}
              title="Login - 3 Roles (Student / College / Platform Admin)"
              aria-label="Login - 3 Roles"
              className="hidden sm:grid h-10 w-10 place-items-center rounded-full bg-[#547792] text-white border-2 border-[#547792] hover:brightness-110 transition-all"
            >
              <Shield size={16} />
            </button>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden h-10 w-10 grid place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263]">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t-2 border-[#E8E2DB] bg-[#E8E2DB] p-6 space-y-4">
          <div className="flex justify-center"><StudentLanguageToggleAlways variant="pill" /></div>

          <div className="flex items-center gap-2 rounded-[14px] bg-white border-2 border-[#E8E2DB] px-4 h-12">
            <MapPin size={16} className="text-[#547792] shrink-0" />
            <select
              value={district}
              onChange={e => { pickDistrict(e.target.value); setMobileOpen(false) }}
              className="flex-1 bg-transparent text-[13px] font-bold outline-none text-[#1A3263]"
              aria-label={t('allDistricts')}
            >
              <option value="All">{t('allDistricts')}</option>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <Link to="/" className="block py-2 font-bold text-[#1A3263]">{t('home')} - Premium</Link>
          <Link to="/search" className="block py-2 font-medium text-[#1A3263]">{t('explore')} - Real</Link>
          <Link to="/search" className="block py-2 font-medium text-[#1A3263]">Courses</Link>
          <Link to="/student/dashboard" className="block py-2 font-medium text-[#1A3263]">{t('dashboard')}</Link>
          <Link to="/student/saved" className="block py-2 font-medium text-[#1A3263]">{t('saved')}</Link>
          <Link to="/student/compare" className="block py-2 font-medium text-[#1A3263]">{t('compare')} 2-4 Colleges</Link>
          <Link to="/student/enquiries" className="block py-2 font-medium text-[#1A3263]">{t('enquiries')} - Consent Only</Link>

          <div className="pt-4 flex flex-col gap-2">
            <button
              onClick={() => { setMobileOpen(false); setLoginOpen(true) }}
              className="h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#FAB95B] font-bold grid place-items-center"
            >
              Demo + Login - 3 Roles
            </button>
            <Link to="/student/signup" className="h-11 px-6 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold grid place-items-center">Student Sign Up - Multi Step</Link>
          </div>
          <div className="pt-4 text-[11px] text-[#547792] leading-[1.5]">Three roles: STUDENT / COLLEGE / PLATFORM_ADMIN • Role-based auth • Student activity tracking secure • Privacy: viewing does NOT auto-send personal info • Only ENQUIRE NOW with consent shares</div>
        </div>
      )}

      <RoleLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  )
}
