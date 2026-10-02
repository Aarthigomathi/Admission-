import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, GraduationCap, Users, Building2, ArrowUpRight, Star, SlidersHorizontal, Image as ImageIcon, Shield, FileText, BarChart3, Bookmark, GitCompare, MessageCircle } from 'lucide-react'
import CollegeCard from '../../components/platform/CollegeCard'
import { getPublicColleges, syncBackendColleges } from '../../lib/collegeStorage'
import LanguageToggle from '../../components/student/LanguageToggle'
import { useLanguage } from '../../lib/languageContext'

export default function PlatformHome() {
  const [search] = useState('')
  const [district] = useState('All')
  const [type, setType] = useState('All')
  const [colleges, setColleges] = useState([])
  const { t, language, isStudent } = useLanguage()

  useEffect(() => {
    // Backend data (live Spring Boot API when running, cloned seed data otherwise)
    // + colleges that signed up locally via CollegeSignup
    setColleges(getPublicColleges())
    syncBackendColleges().then(ok => { if (ok) setColleges(getPublicColleges()) }).catch(() => {})
    const handleStorage = () => setColleges(getPublicColleges())
    window.addEventListener('storage', handleStorage)
    window.addEventListener('collegeRegistered', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('collegeRegistered', handleStorage)
    }
  }, [])

  const filtered = colleges.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.courses.some(co=>co.name.toLowerCase().includes(search.toLowerCase()))
    const matchDist = district==='All' || c.district===district
    const matchType = type==='All' || c.type.toLowerCase().includes(type.toLowerCase())
    return matchSearch && matchDist && matchType
  })

  return (
    <div className="min-h-screen bg-[#E8E2DB]">
      <div className="relative overflow-hidden border-b-2 border-[#FAB95B]/30 bg-[#E8E2DB]">
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_-20%,#ffffff_0%,#E8E2DB_60%)]" />
        <div className="absolute top-20 right-[10%] h-[400px] w-[400px] rounded-full bg-[#FAB95B]/30 blur-[80px]" />
        <div className="absolute top-40 left-[5%] h-[300px] w-[300px] rounded-full bg-[#547792]/20 blur-[60px]" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1A3263] via-[#547792] to-[#FAB95B]" />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 pt-14 pb-16">
          <div className="max-w-[900px]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A3263] border-2 border-[#FAB95B] shadow-sm text-[11px] font-bold tracking-wide text-[#FAB95B]">
              <span className="h-2 w-2 rounded-full bg-[#FAB95B] animate-pulse" />
              Discover Colleges • Decide
            </div>
            {isStudent && <div className="mt-4"><LanguageToggle variant="default" /></div>}

            <h1 className="font-display text-[48px] lg:text-[84px] font-[700] leading-[0.9] tracking-[-0.03em] mt-8 text-[#1A3263] text-balance">
              Tamil Nadu's
              <span className="font-serif italic font-[400] tracking-tight text-[#547792]"> most trusted </span>
              college discovery platform.
            </h1>
            <p className="mt-6 text-[18px] lg:text-[20px] leading-[1.5] text-[#1A3263]/70 max-w-[700px]">
              Centralized discovery across all districts. Students <span className="font-bold text-[#1A3263]">SIGN UP & discover</span>, Colleges <span className="font-bold text-[#1A3263]">SIGN UP & add/manage own info</span>, Platform <span className="font-bold text-[#1A3263]">securely collects activity & generates college-wise PDF reports</span>. Premium SaaS feel.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/student/signup" className="h-11 px-6 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold text-[13px] inline-flex items-center gap-2"><GraduationCap size={16} /> Student Sign Up - Multi Step</Link>
              <Link to="/college/signup" className="h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#FAB95B] font-bold text-[13px] inline-flex items-center gap-2"><Building2 size={16} /> College Sign Up - Verification</Link>
              <Link to="/login" className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[13px] inline-flex items-center gap-2"><Shield size={16} /> Login - 3 Roles</Link>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-[900px]">
            {[
              { label: "Colleges", value: colleges.length===0 ? "0" : String(colleges.length), sub: colleges.length===0 ? "No data - signup & add" : "From backend data", color: "bg-white border-[#FAB95B]/30" },
              { label: "Students", value: "12.5k+", sub: "Secure tracking", color: "bg-white border-[#E8E2DB]" },
              { label: "Verified", value: String(colleges.filter(c=>c.verificationStatus==='VERIFIED'||c.verified).length), sub: "Verified badge", color: "bg-[#1A3263] text-white border-[#1A3263]" },
              { label: "PDF Reports", value: "Live", sub: "College-wise PDF", color: "bg-[#FAB95B] text-[#1A3263] border-[#FAB95B]" },
            ].map((s,i)=>(
              <div key={i} className={`rounded-[20px] border-2 p-5 flex gap-4 shadow-sm ${s.color}`}>
                <div className="h-11 w-11 rounded-[12px] bg-[#E8E2DB] border-2 border-[#FAB95B]/30 grid place-items-center text-[#1A3263]">
                  <Building2 size={20} />
                </div>
                <div>
                  <div className="font-display text-[22px] font-bold leading-none">{s.value}</div>
                  <div className="text-[11px] font-bold tracking-wide uppercase mt-1 opacity-80">{s.label}</div>
                  <div className="text-[11px] opacity-60">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <footer className="bg-[#1A3263] text-white border-t-4 border-[#FAB95B]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <div className="font-display text-[18px] font-semibold">Tamil Nadu Colleges</div>
            <div className="text-[11px] tracking-widest uppercase text-[#FAB95B] mt-1">Discover Colleges • Decide</div>
          </div>
          <div className="flex flex-wrap gap-3 text-[12px]">
            <Link to="/search" className="hover:text-[#FAB95B]">Explore Colleges</Link>
            <Link to="/student/signup" className="hover:text-[#FAB95B]">Student Sign Up</Link>
            <Link to="/college/signup" className="hover:text-[#FAB95B]">College Sign Up</Link>
            <Link to="/login" className="hover:text-[#FAB95B]">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
