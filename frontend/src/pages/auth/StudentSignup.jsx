import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Check, GraduationCap, MapPin, BookOpen, Home, User, Mail, Phone, Lock, School, Award, Heart } from 'lucide-react'

export default function StudentSignup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    district: 'Coimbatore',
    city: '',
    educationLevel: '12th',
    schoolCollege: '',
    marks: '',
    percentage: '',
    groupStream: 'Computer Science',
    interestedSubject: '',
    interestedCourse: 'B.E Computer Science',
    preferredDistrict: 'Coimbatore',
    collegeType: 'Any',
    hostelRequired: 'No',
    transportRequired: 'No'
  })

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = () => {
    const student = {
      id: Date.now(),
      ...formData,
      role: 'STUDENT',
      profileCompletion: 100,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('tn_current_student', JSON.stringify(student))
    const students = JSON.parse(localStorage.getItem('tn_students') || '[]')
    students.push(student)
    localStorage.setItem('tn_students', JSON.stringify(students))
    navigate('/student/dashboard')
  }

  const steps = [
    { id: 1, title: 'Basic Information', icon: User, desc: 'Full Name, Email, Mobile, Password, District, City' },
    { id: 2, title: 'Education', icon: GraduationCap, desc: 'Current Level, School/College, Marks, Percentage, Stream' },
    { id: 3, title: 'College Preferences', icon: Heart, desc: 'Interested Course, Preferred District, College Type, Hostel, Transport' }
  ]

  return (
    <div className="min-h-screen bg-[#E8E2DB] flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex w-[420px] bg-[#1A3263] text-white p-10 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FAB95B] via-[#547792] to-[#E8E2DB]" />
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-[14px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold text-[22px]">T</div>
            <div>
              <div className="font-display font-bold text-[18px]">Tamil Nadu Colleges</div>
              <div className="text-[11px] tracking-widest uppercase text-[#FAB95B]">Student Sign Up • Premium</div>
            </div>
          </div>

          <div className="mt-16">
            <h1 className="font-display text-[36px] font-bold leading-[0.9]">Join Tamil Nadu's most trusted college discovery platform</h1>
            <p className="mt-6 text-[14px] leading-[1.6] text-[#E8E2DB]/70">Discover colleges across all districts, get personalized recommendations, save, compare, enquire - all in one place with your colors #E8E2DB #FAB95B #547792 #1A3263</p>
          </div>

          <div className="mt-12 space-y-4">
            {steps.map(s => (
              <div key={s.id} className={`flex gap-4 p-4 rounded-[16px] border transition-all ${step===s.id?'bg-white/10 border-[#FAB95B]/50':'bg-white/5 border-white/10 opacity-60'}`}>
                <div className={`h-10 w-10 rounded-[12px] grid place-items-center shrink-0 ${step===s.id?'bg-[#FAB95B] text-[#1A3263]': step>s.id ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white'}`}>
                  {step>s.id ? <Check size={18} /> : <s.icon size={18} />}
                </div>
                <div>
                  <div className="font-semibold text-[13px] flex items-center gap-2">Step {s.id}: {s.title} {step>s.id && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500 text-white">Done</span>}</div>
                  <div className="text-[11px] text-white/60 mt-1">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-white/40">Secure • Premium • #E8E2DB #FAB95B #547792 #1A3263 • Production Ready</div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex flex-col">
        <div className="h-[64px] border-b-2 border-[#1A3263]/10 bg-white/80 backdrop-blur px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="h-9 w-9 rounded-[10px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-bold">T</div>
            <span className="font-bold text-[#1A3263]">Student Sign Up</span>
          </div>
          <div className="hidden lg:flex items-center gap-2 text-[12px]">
            <span className="text-[#547792]">Step {step} of 3</span>
            <div className="flex gap-1">
              {[1,2,3].map(i=>(
                <div key={i} className={`h-2 w-12 rounded-full transition-all ${i===step?'bg-[#1A3263] w-16': i<step?'bg-[#FAB95B]':'bg-[#E8E2DB] border'}`} />
              ))}
            </div>
          </div>
          <Link to="/login" className="text-[13px] font-semibold text-[#1A3263] hover:text-[#547792]">Already have account? <span className="text-[#FAB95B] bg-[#1A3263] px-3 py-1 rounded-full ml-2">Login</span></Link>
        </div>

        <div className="flex-1 overflow-auto p-6 lg:p-10">
          <div className="max-w-[640px] mx-auto">
            {step===1 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[28px] font-bold text-[#1A3263]">Basic Information</h2>
                  <p className="text-[13px] text-[#547792] mt-2">Let's start with your basic details - Premium secure registration</p>
                </div>

                <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm space-y-5">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wide text-[#1A3263] flex items-center gap-1.5"><User size={12} className="text-[#FAB95B]" /> Full Name *</label>
                    <input value={formData.fullName} onChange={e=>updateField('fullName', e.target.value)} placeholder="Enter your full name" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px] text-[#1A3263]" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Mail size={12} className="text-[#FAB95B]" /> Email *</label>
                      <input type="email" value={formData.email} onChange={e=>updateField('email', e.target.value)} placeholder="student@email.com" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Phone size={12} className="text-[#FAB95B]" /> Mobile Number *</label>
                      <input value={formData.mobile} onChange={e=>updateField('mobile', e.target.value)} placeholder="+91 98765 43210" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Lock size={12} className="text-[#FAB95B]" /> Password *</label>
                    <input type="password" value={formData.password} onChange={e=>updateField('password', e.target.value)} placeholder="Create strong password" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><MapPin size={12} className="text-[#FAB95B]" /> District *</label>
                      <select value={formData.district} onChange={e=>updateField('district', e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px] font-medium">
                        <option>Coimbatore</option><option>Chennai</option><option>Madurai</option><option>Trichy</option><option>Salem</option><option>Erode</option><option>Tirupur</option><option>Chengalpattu</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">City *</label>
                      <input value={formData.city} onChange={e=>updateField('city', e.target.value)} placeholder="Enter city" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                    </div>
                  </div>
                </div>

                <button onClick={()=>setStep(2)} disabled={!formData.fullName || !formData.email || !formData.mobile} className="w-full h-12 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#1A3263]/90 disabled:opacity-50 disabled:cursor-not-allowed">
                  Continue to Education <ArrowRight size={18} />
                </button>
              </div>
            )}

            {step===2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[28px] font-bold text-[#1A3263]">Education Information</h2>
                  <p className="text-[13px] text-[#547792] mt-2">Your academic background helps us recommend best colleges</p>
                </div>

                <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm space-y-5">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><GraduationCap size={12} className="text-[#FAB95B]" /> Current Education Level *</label>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {['10th','11th','12th','Diploma','Undergraduate','Postgraduate'].map(level=>(
                        <button key={level} onClick={()=>updateField('educationLevel', level)} className={`h-11 rounded-[12px] border-2 text-[13px] font-semibold transition-all ${formData.educationLevel===level?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B]'}`}>{level}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><School size={12} className="text-[#FAB95B]" /> School / College *</label>
                    <input value={formData.schoolCollege} onChange={e=>updateField('schoolCollege', e.target.value)} placeholder="Enter your school/college name" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Marks / Percentage *</label>
                      <input value={formData.marks} onChange={e=>updateField('marks', e.target.value)} placeholder="e.g. 450/500" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Award size={12} className="text-[#FAB95B]" /> Percentage</label>
                      <input value={formData.percentage} onChange={e=>updateField('percentage', e.target.value)} placeholder="e.g. 90%" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Group / Stream</label>
                      <select value={formData.groupStream} onChange={e=>updateField('groupStream', e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]">
                        <option>Computer Science</option><option>Biology</option><option>Commerce</option><option>Arts</option><option>Mechanical</option><option>ECE</option><option>Civil</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Interested Subject</label>
                      <input value={formData.interestedSubject} onChange={e=>updateField('interestedSubject', e.target.value)} placeholder="e.g. Computer Science, Biology" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={()=>setStep(1)} className="h-12 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-semibold text-[14px] flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
                  <button onClick={()=>setStep(3)} className="flex-1 h-12 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center justify-center gap-2">Continue to Preferences <ArrowRight size={18} /></button>
                </div>
              </div>
            )}

            {step===3 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[28px] font-bold text-[#1A3263]">College Preferences</h2>
                  <p className="text-[13px] text-[#547792] mt-2">Helps us recommend perfect colleges for you - secure, private</p>
                </div>

                <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm space-y-5">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><BookOpen size={12} className="text-[#FAB95B]" /> Interested Course *</label>
                    <select value={formData.interestedCourse} onChange={e=>updateField('interestedCourse', e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px] font-medium">
                      <option>B.E Computer Science</option><option>B.Tech AI & Data Science</option><option>BCA</option><option>B.Com</option><option>B.Sc Computer Science</option><option>MBA</option><option>MBBS</option><option>B.E Mechanical</option><option>B.E ECE</option><option>BBA</option>
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Preferred District</label>
                      <select value={formData.preferredDistrict} onChange={e=>updateField('preferredDistrict', e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]">
                        <option>Coimbatore</option><option>Chennai</option><option>Madurai</option><option>Trichy</option><option>Salem</option><option>Any District</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">College Type</label>
                      <select value={formData.collegeType} onChange={e=>updateField('collegeType', e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]">
                        <option>Any</option><option>Government</option><option>Private</option><option>Autonomous</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Home size={12} className="text-[#FAB95B]" /> Hostel Required</label>
                      <div className="mt-2 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('hostelRequired', opt)} className={`flex-1 h-11 rounded-[12px] border-2 text-[13px] font-semibold ${formData.hostelRequired===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Bus size={12} className="text-[#FAB95B]" /> Transport Required</label>
                      <div className="mt-2 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('transportRequired', opt)} className={`flex-1 h-11 rounded-[12px] border-2 text-[13px] font-semibold ${formData.transportRequired===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1a3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[16px] bg-[#1A3263] text-white p-5">
                    <div className="text-[12px] font-bold text-[#FAB95B]">🔒 Privacy Promise</div>
                    <div className="text-[11px] text-[#E8E2DB]/80 mt-2 leading-[1.6]">Your personal info is secure. Colleges will NOT automatically get your details when you view them. Only when you click ENQUIRE NOW with consent, your info is shared. Activity is tracked securely for recommendations and platform analytics. Your data belongs to platform and is protected.</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={()=>setStep(2)} className="h-12 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-semibold text-[14px] flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
                  <button onClick={handleSubmit} className="flex-1 h-12 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold text-[14px] flex items-center justify-center gap-2 hover:brightness-105 shadow-[0_4px_20px_rgba(250,185,91,0.4)]">
                    Create Account & Discover Colleges <Check size={18} />
                  </button>
                </div>

                <div className="text-[11px] text-[#547792] text-center">By signing up, you agree to our Terms and Privacy Policy • Secure • Production Ready • #E8E2DB #FAB95B #547792 #1A3263</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Bus({ size, className }) {
  return <span className={className} style={{ fontSize: size }}>🚌</span>
}
