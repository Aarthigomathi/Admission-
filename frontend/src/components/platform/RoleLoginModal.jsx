import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Building2, Shield, X, ArrowRight, Eye, Sparkles, UserCheck, Lock } from 'lucide-react'
import { getRegisteredColleges, createNewCollegeFromSignup } from '../../lib/collegeStorage'
import { useLanguage } from '../../lib/languageContext'

/**
 * RoleLoginModal - 3 Roles (Student / College / Platform Admin)
 * Used by the header "Demo" button and the shield button.
 *   Login  -> goes to the role's login form (/login?role=...)
 *   Demo   -> instant demo login, straight into that role's dashboard (detailed inside view)
 */

export const DEMO_STUDENT = {
  id: 'demo-student',
  email: 'demo.student@tncolleges.in',
  fullName: 'Demo Student',
  mobile: '9876543210',
  district: 'Coimbatore',
  city: 'Coimbatore',
  educationLevel: '12th',
  schoolName: 'Demo Higher Secondary School',
  percentage: '85',
  groupStream: 'Computer Science',
  interestedCourse: 'B.E Computer Science',
  preferredDistrict: 'Coimbatore',
  collegeType: 'Any',
  hostel: 'Yes',
  transport: 'No',
  role: 'STUDENT',
  profileCompleted: 100,
  isDemo: true
}

export const DEMO_ADMIN = { email: 'admin@tncolleges.in', role: 'PLATFORM_ADMIN', isDemo: true }

// College demo needs a college to manage. Use the first registered one,
// otherwise create a clearly-marked demo college so the CMS can be explored.
export function getOrCreateDemoCollege() {
  const registered = getRegisteredColleges()
  if (registered.length > 0) return registered[0]
  return createNewCollegeFromSignup({
    collegeName: 'Demo Institute of Technology',
    email: 'demo.college@tncolleges.in',
    phone: '9876543210',
    website: 'https://demo.tncolleges.in',
    address: 'Demo Campus Road',
    district: 'Coimbatore',
    city: 'Coimbatore',
    pincode: '641001',
    collegeType: 'Engineering',
    university: 'Anna University',
    establishedYear: '2001',
    principalName: 'Dr. Demo Principal',
    username: 'demo.college@tncolleges.in',
    password: 'demo1234'
  })
}

export function loginAsDemo(role, navigate) {
  if (role === 'STUDENT') {
    localStorage.setItem('tn_current_student', JSON.stringify(DEMO_STUDENT))
    navigate('/student/dashboard')
    return
  }
  if (role === 'COLLEGE') {
    const college = getOrCreateDemoCollege()
    localStorage.setItem('tn_current_college', JSON.stringify(college))
    navigate('/admin')
    return
  }
  localStorage.setItem('tn_platform_admin', JSON.stringify(DEMO_ADMIN))
  navigate('/platform-admin')
}

const ROLES = [
  {
    id: 'STUDENT',
    label: { en: 'Student Login', ta: 'மாணவர் உள்நுழைவு' },
    icon: GraduationCap,
    desc: { en: 'Discover, save, compare, enquire', ta: 'கல்லூரிகளைத் தேடி, சேமித்து, ஒப்பிட்டு, சேர்க்கை விவரங்களைக் கேட்கவும்' },
    points: {
      en: ['Search all TN districts & courses', 'Save, compare 2-4 colleges', 'Enquiry with consent only'],
      ta: ['தமிழ்நாடு மாவட்டங்கள் மற்றும் பாடநெறிகளில் தேடுங்கள்', '2–4 கல்லூரிகளைச் சேமித்து ஒப்பிடுங்கள்', 'உங்கள் ஒப்புதலுடன் மட்டுமே விவரங்கள் பகிரப்படும்']
    }
  },
  {
    id: 'COLLEGE',
    label: { en: 'College Login', ta: 'கல்லூரி உள்நுழைவு' },
    icon: Building2,
    desc: { en: 'Manage your own college A-Z', ta: 'உங்கள் கல்லூரி விவரங்களை முழுமையாக நிர்வகிக்கவும்' },
    points: {
      en: ['Branding, departments & courses', 'Placements, hostel, gallery', 'Own-college analytics only'],
      ta: ['கல்லூரி அடையாளம், துறைகள் மற்றும் பாடநெறிகள்', 'வேலைவாய்ப்பு, விடுதி மற்றும் படத்தொகுப்பு', 'உங்கள் கல்லூரிக்கான புள்ளிவிவரங்கள் மட்டும்']
    }
  },
  {
    id: 'PLATFORM_ADMIN',
    label: { en: 'Platform Admin', ta: 'தள நிர்வாகி' },
    icon: Shield,
    desc: { en: 'Verification, analytics, PDF', ta: 'சரிபார்ப்பு, புள்ளிவிவரங்கள் மற்றும் PDF அறிக்கைகள்' },
    points: {
      en: ['Verify / approve colleges', 'District & course analytics', 'College-wise PDF reports'],
      ta: ['கல்லூரிகளைச் சரிபார்த்து ஒப்புதல் அளிக்கவும்', 'மாவட்ட மற்றும் பாடநெறி புள்ளிவிவரங்கள்', 'கல்லூரி வாரியான PDF அறிக்கைகள்']
    }
  }
]

export default function RoleLoginModal({ open, onClose }) {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const isTamil = language === 'ta'

  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const goLogin = role => {
    onClose()
    navigate(`/login?role=${role.toLowerCase()}`)
  }
  const goDemo = role => {
    onClose()
    loginAsDemo(role, navigate)
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] grid place-items-center overflow-y-auto bg-[#1A3263]/60 backdrop-blur-sm p-3 sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="role-login-title"
        className="relative my-0 w-full max-w-[1000px] max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] overflow-y-auto rounded-[24px] sm:rounded-[28px] bg-[#E8E2DB] border-2 border-[#FAB95B]/50 shadow-[0_24px_80px_rgba(26,50,99,0.35)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative rounded-t-[22px] sm:rounded-t-[26px] bg-[#1A3263] px-5 sm:px-8 py-6 sm:py-7 overflow-hidden">
          <div className="absolute top-0 right-0 h-[180px] w-[180px] rounded-full bg-[#FAB95B]/20 blur-[60px]" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FAB95B] via-[#547792] to-[#FAB95B]" />
          <button
            onClick={onClose}
            aria-label={isTamil ? 'மூடு' : 'Close'}
            className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="relative flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAB95B] text-[#1A3263] text-[10px] font-bold uppercase tracking-wide"><Lock size={11} /> {isTamil ? 'பாதுகாப்பானது • பங்கு அடிப்படையில்' : 'Secure • Role Based'}</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wide text-[#FAB95B]"><Sparkles size={11} /> {isTamil ? 'மாதிரி பார்வை + உண்மையான உள்நுழைவு' : 'Demo + Real Login'}</span>
          </div>
          <h2 id="role-login-title" className="relative font-display text-[24px] sm:text-[32px] font-bold leading-[1.05] mt-4 text-white">
            {isTamil ? <>3 வகை உள்நுழைவுகள் - <span className="text-[#FAB95B]">மாணவர் / கல்லூரி / தள நிர்வாகி</span></> : <>3 Logins - <span className="text-[#FAB95B]">Student / College / Platform Admin</span></>}
          </h2>
          <p className="relative text-[12px] sm:text-[13px] text-[#E8E2DB]/75 mt-2 max-w-[660px] leading-[1.6]">
            {isTamil
              ? <>பாதுகாப்பாக உள்நுழைய <b className="text-white">உள்நுழைவு</b> என்பதைத் தேர்ந்தெடுக்கவும். மாதிரித் தரவுகளுடன் தளத்தைப் பார்க்க <b className="text-white">மாதிரி பார்வை</b> என்பதைத் தேர்ந்தெடுக்கவும்.</>
              : <>Choose <b className="text-white">Login</b> for the secure sign-in form, or <b className="text-white">Demo View</b> to explore the portal with sample data.</>}
          </p>
        </div>

        {/* Role cards */}
        <div className="p-4 sm:p-8 grid md:grid-cols-3 gap-4">
          {ROLES.map(r => (
            <div key={r.id} className="flex flex-col rounded-[20px] bg-white border-2 border-[#E8E2DB] hover:border-[#FAB95B] transition-colors p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-[13px] bg-[#1A3263] text-[#FAB95B] grid place-items-center shrink-0"><r.icon size={20} /></div>
                <div className="min-w-0">
                  <div className="font-bold text-[14px] text-[#1A3263] leading-tight">{r.label[language] || r.label.en}</div>
                  <div className="text-[11px] text-[#547792] truncate">{r.desc[language] || r.desc.en}</div>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 flex-1">
                {(r.points[language] || r.points.en).map(p => (
                  <div key={p} className="flex items-start gap-2 text-[11.5px] text-[#1A3263]/75 leading-[1.5]">
                    <UserCheck size={12} className="text-[#FAB95B] mt-[3px] shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2">
                <button
                  onClick={() => goLogin(r.id)}
                  className="w-full h-11 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12.5px] flex items-center justify-center gap-2 hover:bg-[#1A3263]/90 transition-colors"
                >
                  {r.label[language] || r.label.en} <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => goDemo(r.id)}
                  className="w-full h-10 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold text-[12px] flex items-center justify-center gap-2 hover:brightness-105 transition-all"
                >
                  <Eye size={14} /> {isTamil ? 'மாதிரி தளத்தைப் பாருங்கள்' : 'Demo View'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-8 pb-6">
          <div className="rounded-[16px] bg-[#FAB95B]/15 border-2 border-[#FAB95B]/30 p-4 text-[11px] sm:text-[11.5px] text-[#1A3263]/80 leading-[1.6] flex items-start gap-2">
            <Shield size={13} className="text-[#FAB95B] mt-[2px] shrink-0" />
            <span>
              {isTamil
                ? <>தனியுரிமை: மாணவர்களின் தனிப்பட்ட பார்வைச் செயல்பாடுகள் கல்லூரிகளுடன் பகிரப்படாது; தொகுக்கப்பட்ட புள்ளிவிவரங்கள் மட்டுமே காட்டப்படும். மாணவர் சேர்க்கை விவரங்களைக் கேட்கத் தேர்ந்தெடுத்து ஒப்புதல் அளித்தால் மட்டுமே தொடர்புடைய தகவல்கள் பகிரப்படும். மாதிரித் தரவுகள் இந்த உலாவியின் உள்ளக சேமிப்பில் மட்டுமே இருக்கும்.</>
                : <>Privacy: a student’s individual browsing activity is not shared with colleges; only aggregated statistics are shown. Relevant details are shared only when the student chooses to enquire and gives consent. Demo data is stored only in this browser.</>}
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
