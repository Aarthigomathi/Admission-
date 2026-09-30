import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, Building2, Shield, X, ArrowRight, Eye, Sparkles, UserCheck, Lock } from 'lucide-react'
import { getRegisteredColleges, createNewCollegeFromSignup } from '../../lib/collegeStorage'

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
    label: 'Student Login',
    tamil: 'மாணவர்',
    icon: GraduationCap,
    desc: 'Discover, save, compare, enquire',
    points: ['Search all TN districts & courses', 'Save, compare 2-4 colleges', 'Enquiry with consent only']
  },
  {
    id: 'COLLEGE',
    label: 'College Login',
    tamil: 'கல்லூரி',
    icon: Building2,
    desc: 'Manage your own college A-Z',
    points: ['Branding, departments & courses', 'Placements, hostel, gallery', 'Own-college analytics only']
  },
  {
    id: 'PLATFORM_ADMIN',
    label: 'Platform Admin',
    tamil: 'நிர்வாகி',
    icon: Shield,
    desc: 'Verification, analytics, PDF',
    points: ['Verify / approve colleges', 'District & course analytics', 'College-wise PDF reports']
  }
]

export default function RoleLoginModal({ open, onClose }) {
  const navigate = useNavigate()

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

  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center overflow-y-auto bg-[#1A3263]/60 backdrop-blur-sm p-3 sm:p-6" onClick={onClose}>
      <div
        className="relative w-full max-w-[1000px] rounded-[24px] sm:rounded-[28px] bg-[#E8E2DB] border-2 border-[#FAB95B]/50 shadow-[0_24px_80px_rgba(26,50,99,0.35)] my-4 sm:my-0"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative rounded-t-[22px] sm:rounded-t-[26px] bg-[#1A3263] px-5 sm:px-8 py-6 sm:py-7 overflow-hidden">
          <div className="absolute top-0 right-0 h-[180px] w-[180px] rounded-full bg-[#FAB95B]/20 blur-[60px]" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FAB95B] via-[#547792] to-[#FAB95B]" />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 h-9 w-9 grid place-items-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="relative flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAB95B] text-[#1A3263] text-[10px] font-bold uppercase tracking-wide"><Lock size={11} /> Secure • Role Based</span>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wide text-[#FAB95B]"><Sparkles size={11} /> Demo + Real Login</span>
          </div>
          <h2 className="relative font-display text-[24px] sm:text-[32px] font-bold leading-[1.05] mt-4 text-white">
            3 Logins - <span className="text-[#FAB95B]">Student / College / Platform Admin</span>
          </h2>
          <p className="relative text-[12px] sm:text-[13px] text-[#E8E2DB]/75 mt-2 max-w-[660px] leading-[1.6]">
            Ovvoru role-kum <b className="text-white">Login</b> (real form) illa <b className="text-white">Demo View</b> (udane ulla poi full-a paakalaam) - select pannunga.
          </p>
        </div>

        {/* Role cards */}
        <div className="p-4 sm:p-8 grid md:grid-cols-3 gap-4">
          {ROLES.map(r => (
            <div key={r.id} className="flex flex-col rounded-[20px] bg-white border-2 border-[#E8E2DB] hover:border-[#FAB95B] transition-colors p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-[13px] bg-[#1A3263] text-[#FAB95B] grid place-items-center shrink-0"><r.icon size={20} /></div>
                <div className="min-w-0">
                  <div className="font-bold text-[14px] text-[#1A3263] leading-tight">{r.label}</div>
                  <div className="text-[11px] text-[#547792] truncate">{r.desc}</div>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 flex-1">
                {r.points.map(p => (
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
                  {r.label} <ArrowRight size={15} />
                </button>
                <button
                  onClick={() => goDemo(r.id)}
                  className="w-full h-10 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold text-[12px] flex items-center justify-center gap-2 hover:brightness-105 transition-all"
                >
                  <Eye size={14} /> Demo View - ulla po
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
              Privacy: student viewing activity college-kku personal-a pogathu - College-kku aggregated data mattum. Student <b>ENQUIRE NOW</b> + consent kudutha mattum relevant details share aagum. Demo data browser localStorage la mattum irukku.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
