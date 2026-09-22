import { useLanguage } from '../../lib/languageContext'
import { Globe, Languages } from 'lucide-react'

export default function LanguageToggle({ variant = 'default', className = '' }) {
  const { language, setLanguage, isStudent, t } = useLanguage()

  // Only show for student - studentkku mattum Tamil or English toggle
  if (!isStudent) return null

  const toggle = () => {
    setLanguage(language === 'en' ? 'ta' : 'en')
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={toggle}
        className={`h-9 px-3 rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#FAB95B] font-bold text-[11px] flex items-center gap-1.5 hover:brightness-110 transition-all ${className}`}
        title={language === 'en' ? 'Switch to Tamil - தமிழுக்கு மாறு' : 'Switch to English - ஆங்கிலத்திற்கு மாறு'}
      >
        <Languages size={14} />
        <span>{language === 'en' ? 'EN' : 'தமிழ்'}</span>
        <span className="text-[9px] opacity-80">| {language === 'en' ? 'தமிழ்' : 'EN'}</span>
      </button>
    )
  }

  if (variant === 'pill') {
    return (
      <div className={`flex items-center gap-1 rounded-full bg-white border-2 border-[#E8E2DB] p-1 ${className}`}>
        <button
          onClick={() => setLanguage('en')}
          className={`h-7 px-3 rounded-full text-[11px] font-bold transition-all ${language === 'en' ? 'bg-[#1A3263] text-[#FAB95B]' : 'text-[#547792] hover:text-[#1A3263]'}`}
        >
          English
        </button>
        <button
          onClick={() => setLanguage('ta')}
          className={`h-7 px-3 rounded-full text-[11px] font-bold transition-all ${language === 'ta' ? 'bg-[#FAB95B] text-[#1A3263]' : 'text-[#547792] hover:text-[#1A3263]'}`}
        >
          தமிழ்
        </button>
      </div>
    )
  }

  // default - premium toggle with globe
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="hidden md:flex items-center gap-1.5 text-[10px] font-bold uppercase text-[#547792]">
        <Globe size={12} className="text-[#FAB95B]" />
        {t('language')}:
      </div>
      <div className="flex items-center gap-1 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] p-1">
        <button
          onClick={() => setLanguage('en')}
          className={`h-8 px-4 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${language === 'en' ? 'bg-[#1A3263] text-[#FAB95B] shadow-sm' : 'text-[#1A3263] hover:bg-white/50'}`}
        >
          🇬🇧 English
        </button>
        <button
          onClick={() => setLanguage('ta')}
          className={`h-8 px-4 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${language === 'ta' ? 'bg-[#FAB95B] text-[#1A3263] shadow-sm' : 'text-[#1A3263] hover:bg-white/50'}`}
        >
          🇮🇳 தமிழ்
        </button>
      </div>
    </div>
  )
}

// Always visible version for student pages header - even if isStudent check fails on initial render, show if on student path
export function StudentLanguageToggleAlways({ variant = 'default', className = '' }) {
  const { language, setLanguage } = useLanguage()

  const toggle = () => setLanguage(language === 'en' ? 'ta' : 'en')

  if (variant === 'compact') {
    return (
      <button
        onClick={toggle}
        className={`h-9 px-3 rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#FAB95B] font-bold text-[11px] flex items-center gap-1.5 hover:brightness-110 transition-all ${className}`}
      >
        <Languages size={14} />
        <span>{language === 'en' ? 'EN' : 'தமிழ்'}</span>
        <span className="text-[9px] opacity-80">| {language === 'en' ? 'தமிழ்' : 'EN'}</span>
      </button>
    )
  }

  return (
    <div className={`flex items-center gap-1 rounded-full bg-white border-2 border-[#E8E2DB] p-1 ${className}`}>
      <button
        onClick={() => setLanguage('en')}
        className={`h-7 px-3 rounded-full text-[11px] font-bold transition-all ${language === 'en' ? 'bg-[#1A3263] text-[#FAB95B]' : 'text-[#547792]'}`}
      >
        English
      </button>
      <button
        onClick={() => setLanguage('ta')}
        className={`h-7 px-3 rounded-full text-[11px] font-bold transition-all ${language === 'ta' ? 'bg-[#FAB95B] text-[#1A3263]' : 'text-[#547792]'}`}
      >
        தமிழ்
      </button>
    </div>
  )
}
