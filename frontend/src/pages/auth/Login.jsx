import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Building2, GraduationCap, Shield, Camera, Award, Users } from 'lucide-react'
import { getPublicColleges, getRegisteredColleges } from '../../lib/collegeStorage'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('STUDENT')

  const handleLogin = (e) => {
    e.preventDefault()
    if (role === 'STUDENT') {
      const students = JSON.parse(localStorage.getItem('tn_students') || '[]')
      const student = students.find(s => s.email === email) || { id: 1, email, fullName: 'Demo Student', district: 'Coimbatore', educationLevel: '12th', interestedCourse: 'B.E Computer Science', role: 'STUDENT', percentage: '85', city: 'Coimbatore', preferredDistrict: 'Coimbatore', groupStream: 'Computer Science' }
      localStorage.setItem('tn_current_student', JSON.stringify(student))
      navigate('/student/dashboard')
    } else if (role === 'COLLEGE') {
      const publicColleges = getPublicColleges()
      const registered = getRegisteredColleges()
      const all = [...registered, ...publicColleges.filter(c => !registered.some(r => String(r.id) === String(c.id)))]
      const id = email.trim().toLowerCase()
      const college = all.find(c => (c.loginUsername || '').toLowerCase() === id || (c.email || '').toLowerCase() === id)
      if (!college) {
        alert('College with this username/email not found!\n\nIf you just signed up, use your college email or the username you created. If still not found, please sign up first.')
        navigate('/college/signup')
        return
      }
      if (college.loginPassword && college.loginPassword !== password) {
        alert('Wrong password for ' + college.name + '! Please try again.')
        return
      }
      localStorage.setItem('tn_current_college', JSON.stringify(college))
      navigate('/admin')
    } else {
      localStorage.setItem('tn_platform_admin', JSON.stringify({ email, role: 'PLATFORM_ADMIN' }))
      navigate('/platform-admin')
    }
  }

  return (
    <div className="min-h-screen bg-[#E8E2DB] flex items-center justify-center p-3 sm:p-4 lg:p-6">
      {/* Card - Responsive: mobile full width, tablet centered, laptop max 1100px */}
      <div className="w-full max-w-[1100px] rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-white border-2 border-[#E8E2DB] shadow-[0_16px_64px_rgba(26,50,99,0.12)] overflow-hidden flex flex-col lg:flex-row">

        {/* LEFT PANEL - Dark Academic with Images - Responsive */}
        <div className="lg:w-[440px] xl:w-[480px] bg-[#1A3263] text-white p-6 sm:p-8 lg:p-8 xl:p-10 flex flex-col relative overflow-hidden order-1 lg:order-1">

          {/* Decorative gradient blobs - hidden on mobile for performance */}
          <div className="hidden sm:block absolute top-0 right-0 w-[200px] h-[200px] bg-[#FAB95B]/10 rounded-full blur-[40px]" />
          <div className="hidden sm:block absolute bottom-20 left-0 w-[150px] h-[150px] bg-[#547792]/20 rounded-full blur-[30px]" />

          <div className="relative z-10 flex-1 flex flex-col">
            {/* Logo Header */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-[12px] sm:rounded-[14px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold text-[18px] sm:text-[20px] shrink-0">T</div>
              <div className="min-w-0">
                <div className="font-display font-bold text-[14px] sm:text-[16px] leading-tight">Tamil Nadu Colleges</div>
                <div className="text-[10px] sm:text-[11px] tracking-widest uppercase text-[#FAB95B] truncate">Official Academic Portal</div>
              </div>
            </div>

            {/* Title - Responsive text sizes */}
            <h1 className="font-display text-[26px] sm:text-[30px] lg:text-[28px] xl:text-[32px] font-bold leading-[0.9] mt-6 sm:mt-8 lg:mt-10">
              Welcome Back
              <span className="block text-[#FAB95B] mt-1">Secure Login</span>
            </h1>
            <p className="text-[11px] sm:text-[12px] leading-[1.6] text-[#E8E2DB]/70 mt-3 sm:mt-4 max-w-[360px]">
              Access your personalized dashboard - Students discover colleges, colleges manage their profile, platform admins monitor analytics.
            </p>

            {/* Role Cards - Responsive grid */}
            <div className="mt-6 sm:mt-8 space-y-2.5 sm:space-y-3">
              <div className={`flex items-center gap-3 p-3 rounded-[12px] border transition-all ${role==='STUDENT' ? 'bg-[#FAB95B]/20 border-[#FAB95B]/30' : 'bg-white/5 border-white/10'}`}>
                <div className={`h-9 w-9 rounded-[10px] grid place-items-center shrink-0 ${role==='STUDENT' ? 'bg-[#FAB95B] text-[#1A3263]' : 'bg-white/10 text-white'}`}><GraduationCap size={16} /></div>
                <div className="min-w-0 flex-1">
                  <div className={`font-semibold text-[11px] ${role==='STUDENT' ? 'text-[#FAB95B]' : ''}`}>Student Login</div>
                  <div className="text-[10px] text-white/60 truncate">Discover, save, compare, enquire</div>
                </div>
                {role==='STUDENT' && <div className="h-2 w-2 rounded-full bg-[#FAB95B] animate-pulse shrink-0" />}
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-[12px] border transition-all ${role==='COLLEGE' ? 'bg-[#FAB95B]/20 border-[#FAB95B]/30' : 'bg-white/5 border-white/10'}`}>
                <div className={`h-9 w-9 rounded-[10px] grid place-items-center shrink-0 ${role==='COLLEGE' ? 'bg-[#FAB95B] text-[#1A3263]' : 'bg-white/10 text-white'}`}><Building2 size={16} /></div>
                <div className="min-w-0 flex-1">
                  <div className={`font-semibold text-[11px] ${role==='COLLEGE' ? 'text-[#FAB95B]' : ''}`}>College Login</div>
                  <div className="text-[10px] text-white/60 truncate">Manage profile, courses, facilities</div>
                </div>
                {role==='COLLEGE' && <div className="h-2 w-2 rounded-full bg-[#FAB95B] animate-pulse shrink-0" />}
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-[12px] border transition-all ${role==='PLATFORM_ADMIN' ? 'bg-[#FAB95B]/20 border-[#FAB95B]/30' : 'bg-white/5 border-white/10'}`}>
                <div className={`h-9 w-9 rounded-[10px] grid place-items-center shrink-0 ${role==='PLATFORM_ADMIN' ? 'bg-[#FAB95B] text-[#1A3263]' : 'bg-[#E8E2DB] text-[#1A3263]'}`}><Shield size={16} /></div>
                <div className="min-w-0 flex-1">
                  <div className={`font-semibold text-[11px] ${role==='PLATFORM_ADMIN' ? 'text-[#FAB95B]' : ''}`}>Platform Admin</div>
                  <div className="text-[10px] text-white/60 truncate">Verification, analytics, reports</div>
                </div>
                {role==='PLATFORM_ADMIN' && <div className="h-2 w-2 rounded-full bg-[#FAB95B] animate-pulse shrink-0" />}
              </div>
            </div>

            {/* IMAGES SECTION - Responsive: mobile shows 1 large + 2 small, tablet larger, laptop optimized */}
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center gap-2 mb-3">
                <Camera size={12} className="text-[#FAB95B]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FAB95B]">Campus Life - Official Images from psgtech.edu</span>
              </div>

              {/* Main Campus Image - Responsive height */}
              <div className="relative rounded-[16px] sm:rounded-[20px] overflow-hidden border-2 border-[#FAB95B]/30 shadow-lg group">
                <img
                  src="https://www.psgtech.edu/images/slider/foundationday_2026.jpg"
                  alt="PSG Tech Campus Foundation Day"
                  className="w-full h-[180px] sm:h-[200px] lg:h-[180px] xl:h-[220px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A3263]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#FAB95B] text-[#1A3263] grid place-items-center">
                      <Award size={12} />
                    </div>
                    <div>
                      <div className="font-bold text-[11px] sm:text-[12px] text-white">Official Academic Campus</div>
                      <div className="text-[10px] text-[#FAB95B]">Real images from psgtech.edu</div>
                    </div>
                  </div>
                </div>
                {/* Live badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[10px] font-bold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1A3263] animate-pulse" /> LIVE CAMPUS
                </div>
              </div>

              {/* Secondary Images Grid - 2 images side by side - Responsive */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="relative rounded-[12px] sm:rounded-[14px] overflow-hidden border-2 border-white/10 group">
                  <img
                    src="https://www.psgtech.edu/images/slider/Orientation_2026.jpg"
                    alt="Orientation 2026"
                    className="w-full h-[90px] sm:h-[100px] lg:h-[85px] xl:h-[95px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1.5 left-2 right-2">
                    <div className="text-[10px] font-bold text-white truncate">Orientation Day</div>
                    <div className="text-[9px] text-white/70">Student Welcome</div>
                  </div>
                </div>
                <div className="relative rounded-[12px] sm:rounded-[14px] overflow-hidden border-2 border-white/10 group">
                  <img
                    src="https://www.psgtech.edu/images/slider/TheConfluence-2026.jpg"
                    alt="The Confluence 2026"
                    className="w-full h-[90px] sm:h-[100px] lg:h-[85px] xl:h-[95px] object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1.5 left-2 right-2">
                    <div className="text-[10px] font-bold text-white truncate">Tech Fest</div>
                    <div className="text-[9px] text-white/70">Innovation Hub</div>
                  </div>
                </div>
              </div>

              {/* Stats bar below images - Responsive */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="rounded-[10px] bg-white/5 border border-white/10 p-2.5 text-center">
                  <div className="font-bold text-[14px] sm:text-[16px] text-[#FAB95B]">500+</div>
                  <div className="text-[9px] sm:text-[10px] text-white/60 uppercase font-bold">Colleges</div>
                </div>
                <div className="rounded-[10px] bg-white/5 border border-white/10 p-2.5 text-center">
                  <div className="font-bold text-[14px] sm:text-[16px] text-[#FAB95B]">12k+</div>
                  <div className="text-[9px] sm:text-[10px] text-white/60 uppercase font-bold">Students</div>
                </div>
                <div className="rounded-[10px] bg-[#FAB95B]/20 border border-[#FAB95B]/30 p-2.5 text-center">
                  <div className="font-bold text-[14px] sm:text-[16px] text-[#FAB95B]">98%</div>
                  <div className="text-[9px] sm:text-[10px] text-white/70 uppercase font-bold">Verified</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Responsive */}
          <div className="relative z-10 mt-6 sm:mt-8 flex items-center justify-between">
            <div className="text-[9px] sm:text-[10px] text-white/30">Secure • Role Based • Official Portal</div>
            <div className="flex items-center gap-1.5">
              <Users size={10} className="text-[#FAB95B]" />
              <span className="text-[9px] sm:text-[10px] text-[#FAB95B] font-bold">Trusted Platform</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Login Form - Responsive */}
        <div className="flex-1 p-5 sm:p-8 lg:p-8 xl:p-10 flex flex-col order-2 lg:order-2 bg-white">

          {/* Mobile/Tablet Top Image Banner - Only visible on mobile/tablet, hidden on laptop */}
          <div className="lg:hidden mb-6 rounded-[16px] overflow-hidden border-2 border-[#E8E2DB] relative">
            <img
              src="https://www.psgtech.edu/images/slider/RC2026.jpg"
              alt="Campus Banner Mobile"
              className="w-full h-[140px] sm:h-[160px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A3263]/80 to-transparent" />
            <div className="absolute inset-0 p-4 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[10px] font-bold w-fit">
                <Shield size={10} /> Official Portal
              </div>
              <div className="font-bold text-white text-[14px] sm:text-[16px] mt-2 leading-tight">Tamil Nadu's Most Trusted<br />College Discovery Platform</div>
              <div className="text-[11px] text-[#E8E2DB]/80 mt-1">Real images from psgtech.edu - No AI</div>
            </div>
          </div>

          {/* Form Header */}
          <div className="flex-1">
            <h2 className="font-display text-[20px] sm:text-[22px] lg:text-[22px] font-bold text-[#1A3263]">Login to Your Account</h2>
            <p className="text-[11px] sm:text-[12px] text-[#547792] mt-1.5 sm:mt-2">Select your role and enter credentials to access your dashboard.</p>

            {/* Role Selector - Responsive: mobile 3 cols, tablet same, laptop same */}
            <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-2.5">
              {[
                { id: 'STUDENT', label: 'Student', icon: GraduationCap, desc: 'Discover' },
                { id: 'COLLEGE', label: 'College', icon: Building2, desc: 'Manage' },
                { id: 'PLATFORM_ADMIN', label: 'Admin', icon: Shield, desc: 'Analytics' }
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`h-[64px] sm:h-[72px] lg:h-[68px] xl:h-[72px] rounded-[12px] sm:rounded-[14px] border-2 flex flex-col items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-bold transition-all ${role === r.id ? 'bg-[#1A3263] text-[#FAB95B] border-[#1A3263] shadow-lg scale-[1.02]' : 'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B] hover:bg-[#E8E2DB]/80'}`}
                >
                  <r.icon size={18} className="sm:hidden" />
                  <r.icon size={20} className="hidden sm:block" />
                  <span className="leading-none">{r.label}</span>
                  <span className="text-[9px] opacity-60 font-medium leading-none hidden sm:block">{r.desc}</span>
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="mt-6 sm:mt-7 space-y-4 sm:space-y-5">
              <div>
                <label className="text-[10px] sm:text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5">
                  <Mail size={12} className="text-[#FAB95B]" /> {role === 'COLLEGE' ? 'Username or Email' : 'Email'}
                </label>
                <input
                  required
                  type={role === 'COLLEGE' ? 'text' : 'email'}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={role === 'STUDENT' ? 'student@email.com' : role === 'COLLEGE' ? 'college username or email' : 'admin@platform.com'}
                  className="mt-2 w-full h-11 sm:h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px] sm:text-[14px] transition-colors"
                />
              </div>
              <div>
                <label className="text-[10px] sm:text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5">
                  <Lock size={12} className="text-[#FAB95B]" /> Password
                </label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="mt-2 w-full h-11 sm:h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px] sm:text-[14px] transition-colors"
                />
              </div>

              <button type="submit" className="w-full h-11 sm:h-12 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] sm:text-[14px] flex items-center justify-center gap-2 hover:bg-[#1A3263]/90 transition-colors shadow-lg">
                Login as {role.replace('_', ' ')} <ArrowRight size={16} className="sm:hidden" /><ArrowRight size={18} className="hidden sm:block" />
              </button>

              {/* Sign Up Links - Responsive grid */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-[11px] sm:text-[12px]">
                <Link to="/student/signup" className="h-10 sm:h-11 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] grid place-items-center font-semibold text-[#1A3263] hover:border-[#FAB95B] transition-colors text-center px-2">
                  <span className="hidden sm:inline">Student Sign Up</span>
                  <span className="sm:hidden">Student Sign Up</span>
                </Link>
                <Link to="/college/signup" className="h-10 sm:h-11 rounded-full bg-[#FAB95B] border-2 border-[#FAB95B] grid place-items-center font-semibold text-[#1A3263] hover:brightness-105 transition-all text-center px-2">
                  <span className="hidden sm:inline">College Sign Up</span>
                  <span className="sm:hidden">College Sign Up</span>
                </Link>
              </div>

              {/* Info Box - Responsive */}
              <div className="rounded-[12px] sm:rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-3.5 sm:p-4">
                <div className="text-[10px] sm:text-[11px] font-bold text-[#1A3263] flex items-center gap-1.5">
                  <Shield size={12} className="text-[#FAB95B]" /> How it works:
                </div>
                <div className="text-[10px] sm:text-[11px] text-[#547792] mt-2 leading-[1.5] space-y-1">
                  <div>• <span className="font-semibold text-[#1A3263]">Students:</span> Sign up, discover colleges, save, compare, enquire</div>
                  <div>• <span className="font-semibold text-[#1A3263]">Colleges:</span> Sign up, add complete profile - logo, campus, departments with HOD, courses, facilities</div>
                  <div>• <span className="font-semibold text-[#1A3263]">Platform:</span> Verifies colleges, generates analytics & PDF reports</div>
                  <div className="hidden sm:block">• Only registered colleges appear - No default colleges</div>
                </div>
              </div>
            </form>
          </div>

          {/* Bottom Images Strip - Visible on all devices but responsive */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-[#E8E2DB]/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#547792] flex items-center gap-1.5">
                <Camera size={10} className="text-[#FAB95B]" /> Official Campus Images
              </span>
              <span className="text-[9px] text-[#547792]">Real from psgtech.edu</span>
            </div>
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {[
                "https://www.psgtech.edu/images/slider/foundationday_2026.jpg",
                "https://www.psgtech.edu/images/slider/Orientation_2026.jpg",
                "https://www.psgtech.edu/images/slider/TheConfluence-2026.jpg",
                "https://www.psgtech.edu/images/slider/RC2026.jpg",
                "https://library.psgtech.ac.in/images/logos/about_img_1694408630.jpg",
              ].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Campus ${i + 1}`}
                  className="h-[48px] w-[72px] sm:h-[56px] sm:w-[84px] lg:h-[52px] lg:w-[78px] rounded-[8px] sm:rounded-[10px] object-cover border-2 border-[#E8E2DB] shrink-0 hover:border-[#FAB95B] transition-colors cursor-pointer"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
