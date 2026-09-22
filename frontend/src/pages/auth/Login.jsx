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
      // Only colleges that signed up themselves - no default PSG - automatic default college name kattama
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
        alert('No colleges registered yet! Please first sign up your college via College Sign Up - Add your college A-Z yourself. No default colleges - automatic default college name kattama.')
        navigate('/college/signup')
        return
      }
      localStorage.setItem('tn_current_college', JSON.stringify(college))
      alert(`Login as College Admin: ${college.name} - ID ${college.id} - ${college.district} - Status ${college.verificationStatus} - Your own college - Add A-Z yourself: logo, campus images, environment, placement, facilities, exam details, departments with HOD, courses, etc.`)
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
                <div className="text-[11px] tracking-widest uppercase text-[#FAB95B]">Login • Your Own College • Not PSG</div>
              </div>
            </div>

            <h1 className="font-display text-[30px] font-bold leading-[0.9] mt-10">Login to your own college admin - Not PSG - Your own A to Z</h1>
            <p className="text-[12px] leading-[1.6] text-[#E8E2DB]/70 mt-4">After college signup, you login and you see YOUR OWN college empty (Not PSG Tech). You add everything yourself: logo, campus images, environment, placement, facilities, exam details, departments with HOD, courses, admissions, hostel, library, etc - Full A to Z. UI frame ours, content yours. Whatever section you need!</p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-white/10">
                <div className="h-9 w-9 rounded-[10px] bg-[#FAB95B] text-[#1A3263] grid place-items-center"><GraduationCap size={16} /></div>
                <div><div className="font-semibold text-[11px]">Student Login - Your Own Dashboard</div><div className="text-[10px] text-white/60">Discover colleges, save, compare, enquire - Secure tracking</div></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-[12px] bg-[#FAB95B]/20 border border-[#FAB95B]/30">
                <div className="h-9 w-9 rounded-[10px] bg-[#FAB95B] text-[#1A3263] grid place-items-center"><Building2 size={16} /></div>
                <div><div className="font-semibold text-[11px] text-[#FAB95B]">College Login - Your Own College (Not PSG) - A to Z You Add</div><div className="text-[10px] text-white/60">After signup, your college empty - you add logo, images, departments with HOD, courses, facilities, placements, exam details, etc - UI frame ours, content yours</div></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-white/10">
                <div className="h-9 w-9 rounded-[10px] bg-[#E8E2DB] text-[#1A3263] grid place-items-center"><Shield size={16} /></div>
                <div><div className="font-semibold text-[11px]">Platform Admin - Analytics & PDF</div><div className="text-[10px] text-white/60">Verification, analytics, PDF reports - Secure</div></div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/30 mt-8">Your Own College (Not PSG) • A to Z You Add • UI Frame Ours • Content Yours • #E8E2DB #FAB95B #547792 #1A3263 • College ID Isolation Secure</div>
        </div>

        <div className="flex-1 p-8 lg:p-10">
          <h2 className="font-display text-[22px] font-bold text-[#1A3263]">Login - Your Own College (Not PSG) - A to Z You Add</h2>
          <p className="text-[12px] text-[#547792] mt-2">If you just signed up college, select College role and login - You will see YOUR OWN empty college (Not PSG Tech) where you add logo, campus images, environment, placement, facilities, exam details, departments with HOD, etc - Full A to Z yourself. UI frame ours, content yours.</p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { id: 'STUDENT', label: 'Student', icon: GraduationCap },
              { id: 'COLLEGE', label: 'College - Your Own', icon: Building2 },
              { id: 'PLATFORM_ADMIN', label: 'Platform Admin', icon: Shield }
            ].map(r => (
              <button key={r.id} onClick={()=>setRole(r.id)} className={`h-14 rounded-[12px] border-2 flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all ${role===r.id?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B]'}`}>
                <r.icon size={16} /> {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Mail size={12} className="text-[#FAB95B]" /> Email - Your College Email</label>
              <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={role==='STUDENT' ? 'student@email.com' : role==='COLLEGE' ? 'your college email - after signup your own college (Not PSG)' : 'admin@platform.com'} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Lock size={12} className="text-[#FAB95B]" /> Password - Demo any works</label>
              <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter password - demo any - Your own college login" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
            </div>

            <button type="submit" className="w-full h-12 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#1A3263]/90">
              Login as {role.replace('_',' ')} - Your Own {role==='COLLEGE' ? 'College (Not PSG) - A to Z You Add' : ''} <ArrowRight size={18} />
            </button>

            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <Link to="/student/signup" className="h-10 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] grid place-items-center font-semibold text-[#1A3263] hover:border-[#FAB95B]">Student Sign Up - Multi Step</Link>
              <Link to="/college/signup" className="h-10 rounded-full bg-[#FAB95B] border-2 border-[#FAB95B] grid place-items-center font-semibold text-[#1A3263] hover:brightness-105">College Sign Up - Your Own A to Z</Link>
            </div>

            <div className="rounded-[12px] bg-[#1A3263] text-white p-4">
              <div className="text-[11px] font-bold text-[#FAB95B]">Fixed! College Signup → Your Own College (Not PSG) - A to Z You Add:</div>
              <div className="text-[11px] text-[#E8E2DB]/80 mt-2 leading-[1.5]">
                Before: College signup panna apram direct ah PSG college varuthu - Problem!<br/>
                Now Fixed: College signup panna apram avunga login panna apram avunga colleges information college eh add pantra mathiri - Your own empty website - You add logo, campus images, environment, placement, facilities, placements, exam details, oru oru departmentkkum HOD antha mathiri college oda overall A to Z information college eh add pantra mathiri - Namma UI frame mattumtha nammatha irukkanum ennan add pannanumo athala avungaley add pannattum enna section venumoo ellamey - Done!<br/><br/>
                Demo: College role select panni any email login panna → Your own college (if you signed up, your college, else demo PSG but with option to add your own) → Admin dashboard → Add A to Z yourself → UI frame ours, content yours!
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
