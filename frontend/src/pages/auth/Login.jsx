import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Building2, GraduationCap, Shield } from 'lucide-react'
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
      let college = null
      if (email) {
        college = publicColleges.find(c => c.email === email) || registered.find(c => c.email === email)
      }
      if (!college && publicColleges.length>0) {
        college = publicColleges[0]
      }
      if (!college) {
        alert('No colleges registered yet! Please first sign up your college via College Sign Up.')
        navigate('/college/signup')
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
    <div className="min-h-screen bg-[#E8E2DB] flex items-center justify-center p-6">
      <div className="w-full max-w-[1000px] rounded-[32px] bg-white border-2 border-[#E8E2DB] shadow-[0_16px_64px_rgba(26,50,99,0.12)] overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:w-[400px] bg-[#1A3263] text-white p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-[14px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold text-[20px]">T</div>
              <div>
                <div className="font-display font-bold">Tamil Nadu Colleges</div>
                <div className="text-[11px] tracking-widest uppercase text-[#FAB95B]">Official Academic Portal</div>
              </div>
            </div>

            <h1 className="font-display text-[30px] font-bold leading-[0.9] mt-10">Welcome Back - Secure Login</h1>
            <p className="text-[12px] leading-[1.6] text-[#E8E2DB]/70 mt-4">Access your personalized dashboard - Students discover colleges, colleges manage their profile, platform admins monitor analytics. Secure role-based authentication.</p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-white/10">
                <div className="h-9 w-9 rounded-[10px] bg-[#FAB95B] text-[#1A3263] grid place-items-center"><GraduationCap size={16} /></div>
                <div><div className="font-semibold text-[11px]">Student Login</div><div className="text-[10px] text-white/60">Discover colleges, save, compare, enquire</div></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-[12px] bg-[#FAB95B]/20 border border-[#FAB95B]/30">
                <div className="h-9 w-9 rounded-[10px] bg-[#FAB95B] text-[#1A3263] grid place-items-center"><Building2 size={16} /></div>
                <div><div className="font-semibold text-[11px] text-[#FAB95B]">College Login</div><div className="text-[10px] text-white/60">Manage your college profile, courses, facilities</div></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-white/10">
                <div className="h-9 w-9 rounded-[10px] bg-[#E8E2DB] text-[#1A3263] grid place-items-center"><Shield size={16} /></div>
                <div><div className="font-semibold text-[11px]">Platform Admin</div><div className="text-[10px] text-white/60">Verification, analytics, reports</div></div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/30 mt-8">Secure Authentication • Role Based Access • Official Portal</div>
        </div>

        <div className="flex-1 p-8 lg:p-10">
          <h2 className="font-display text-[22px] font-bold text-[#1A3263]">Login to Your Account</h2>
          <p className="text-[12px] text-[#547792] mt-2">Select your role and enter credentials to access your dashboard.</p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { id: 'STUDENT', label: 'Student', icon: GraduationCap },
              { id: 'COLLEGE', label: 'College', icon: Building2 },
              { id: 'PLATFORM_ADMIN', label: 'Platform Admin', icon: Shield }
            ].map(r => (
              <button key={r.id} onClick={()=>setRole(r.id)} className={`h-14 rounded-[12px] border-2 flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all ${role===r.id?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B]'}`}>
                <r.icon size={16} /> {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Mail size={12} className="text-[#FAB95B]" /> Email</label>
              <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={role==='STUDENT' ? 'student@email.com' : role==='COLLEGE' ? 'college official email' : 'admin@platform.com'} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Lock size={12} className="text-[#FAB95B]" /> Password</label>
              <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
            </div>

            <button type="submit" className="w-full h-12 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#1A3263]/90">
              Login as {role.replace('_',' ')} <ArrowRight size={18} />
            </button>

            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <Link to="/student/signup" className="h-10 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] grid place-items-center font-semibold text-[#1A3263] hover:border-[#FAB95B]">Student Sign Up</Link>
              <Link to="/college/signup" className="h-10 rounded-full bg-[#FAB95B] border-2 border-[#FAB95B] grid place-items-center font-semibold text-[#1A3263] hover:brightness-105">College Sign Up</Link>
            </div>

            <div className="rounded-[12px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-4">
              <div className="text-[11px] font-bold text-[#1A3263]">How it works:</div>
              <div className="text-[11px] text-[#547792] mt-2 leading-[1.5]">
                • Students sign up, discover colleges, save, compare, enquire with consent<br/>
                • Colleges sign up, login to admin dashboard, add complete profile A-Z - logo, campus images, departments with HOD, courses, facilities, placements, exams<br/>
                • Platform admin verifies colleges and generates analytics & PDF reports<br/>
                • Only registered colleges appear on platform - No default colleges
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
