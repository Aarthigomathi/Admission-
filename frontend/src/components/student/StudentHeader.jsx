import { Link } from 'react-router-dom'
import { Search, LogOut, GraduationCap, User } from 'lucide-react'
import { useLanguage } from '../../lib/languageContext'
import { StudentLanguageToggleAlways } from './LanguageToggle'

export default function StudentHeader() {
  const { t, language } = useLanguage()
  return (
    <div className="bg-white border-b-2 border-[#E8E2DB] sticky top-0 z-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-[10px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-bold">T</div>
          <div className="hidden md:block leading-[0.9]">
            <div className="font-bold text-[14px] text-[#1A3263]">Tamil Nadu Colleges</div>
            <div className="text-[10px] text-[#547792]">{language==='ta' ? 'மாணவர் பகுதி - தமிழ் / English - Edit Options' : 'Student Area - Tamil / English - Edit Options'} • {t('language')}</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-[#547792] bg-[#E8E2DB] px-3 py-1 rounded-full">
            <span> {language==='ta' ? 'மாணவருக்கு மட்டும் - Edit Options' : 'Only for Student - Edit Options'}</span>
          </div>
          <StudentLanguageToggleAlways variant="pill" />
          <Link to="/student/profile" className="h-9 px-4 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[11px] flex items-center gap-1.5"><User size={14} /> {language==='ta' ? 'சுயவிவரம் - திருத்து' : 'Profile - Edit'}</Link>
          <Link to="/student/dashboard" className="h-9 px-4 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1.5"><GraduationCap size={14} /> {t('dashboard')}</Link>
          <Link to="/search" className="h-9 px-4 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[11px] flex items-center gap-1.5"><Search size={14} /> {t('explore')}</Link>
        </div>
      </div>
    </div>
  )
}
