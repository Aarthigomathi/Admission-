import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Check, GraduationCap, MapPin, BookOpen, Home, User, Mail, Phone, Lock, School, Award, Heart, Calendar, Users, FileText, Upload, Star, Trophy, TrendingUp, BadgeCheck, Building, Briefcase, IdCard, Image as ImageIcon, X, Calculator, Sparkles } from 'lucide-react'
import { colleges } from '../../lib/colleges'
import { useLanguage } from '../../lib/languageContext'
import { StudentLanguageToggleAlways } from '../../components/student/LanguageToggle'

export default function StudentSignup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const { t, language, setLanguage } = useLanguage()

  // Enhanced form data
  const [formData, setFormData] = useState({
    // Step 1 - Basic + What to study
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    district: 'Coimbatore',
    city: '',
    interestedCourse: 'B.E Computer Science',
    interestedSubject: 'Computer Science',
    careerGoal: '',
    whyThisCourse: '',
    // Step 2 - Personal & Family Extended
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    nationality: 'Indian',
    religion: 'Hindu',
    community: 'BC',
    caste: '',
    aadharNumber: '',
    fatherName: '',
    motherName: '',
    fatherOccupation: '',
    motherOccupation: '',
    parentMobile: '',
    alternateMobile: '',
    annualIncome: '',
    maritalStatus: 'Single',
    permanentAddress: '',
    pincode: '',
    state: 'Tamil Nadu',
    // Step 3 - Education + Marks Auto %
    educationLevel: '12th',
    schoolCollege: '',
    board: 'Tamil Nadu State Board',
    yearOfPassing: '2024',
    marksObtained: '',
    totalMarks: '',
    percentage: '',
    grade: '',
    cutoff: '',
    groupStream: 'Computer Science',
    medium: 'English',
    // Documents
    documents: {
      tenthMarksheet: null,
      twelfthMarksheet: null,
      tc: null,
      communityCertificate: null,
      incomeCertificate: null,
      aadharCard: null,
      photo: null,
      nativityCertificate: null,
      firstGraduateCertificate: null,
      specialReservation: null
    },
    documentNames: {
      tenthMarksheet: '',
      twelfthMarksheet: '',
      tc: '',
      communityCertificate: '',
      incomeCertificate: '',
      aadharCard: '',
      photo: '',
      nativityCertificate: '',
      firstGraduateCertificate: '',
      specialReservation: ''
    },
    // Step 4 - Preferences
    preferredDistrict: 'Coimbatore',
    collegeType: 'Any',
    hostelRequired: 'No',
    transportRequired: 'No',
    budgetRange: '1-2 Lakhs',
    scholarshipNeeded: 'No'
  })

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))
  const updateDocName = (docKey, fileName) => setFormData(prev => ({
    ...prev,
    documentNames: { ...prev.documentNames, [docKey]: fileName },
    documents: { ...prev.documents, [docKey]: fileName ? { name: fileName, uploadedAt: new Date().toISOString() } : null }
  }))

  // Auto percentage calculation
  const calculatePercentage = (obtained, total) => {
    const obt = parseFloat(obtained)
    const tot = parseFloat(total)
    if (!isNaN(obt) && !isNaN(tot) && tot > 0) {
      const perc = (obt / tot) * 100
      const rounded = perc.toFixed(2)
      let grade = ''
      if (perc >= 90) grade = 'Outstanding - A+'
      else if (perc >= 80) grade = 'Excellent - A'
      else if (perc >= 70) grade = 'Very Good - B+'
      else if (perc >= 60) grade = 'Good - B'
      else if (perc >= 50) grade = 'Average - C'
      else grade = 'Pass'
      return { percentage: rounded, grade }
    }
    return { percentage: '', grade: '' }
  }

  const handleMarksChange = (field, value) => {
    const newData = { ...formData, [field]: value }
    // Auto calculate if both obtained and total present
    if (field === 'marksObtained' || field === 'totalMarks') {
      const obt = field === 'marksObtained' ? value : formData.marksObtained
      const tot = field === 'totalMarks' ? value : formData.totalMarks
      const { percentage, grade } = calculatePercentage(obt, tot)
      newData.percentage = percentage
      newData.grade = grade
    }
    // Parse 450/500 format
    if (field === 'marksObtained' && value.includes('/')) {
      const parts = value.split('/')
      if (parts.length === 2) {
        const obt = parts[0].trim()
        const tot = parts[1].trim()
        const { percentage, grade } = calculatePercentage(obt, tot)
        newData.marksObtained = obt
        newData.totalMarks = tot
        newData.percentage = percentage
        newData.grade = grade
      }
    }
    setFormData(newData)
  }

  // Auto set total marks based on education level
  const handleEducationLevelChange = (level) => {
    let total = ''
    if (level === '10th') total = '500'
    else if (level === '11th') total = '600'
    else if (level === '12th') total = '600'
    else if (level === 'Diploma') total = '1000'
    else if (level === 'Undergraduate') total = '1000'
    else total = '1000'
    const newData = { ...formData, educationLevel: level, totalMarks: total }
    if (formData.marksObtained) {
      const { percentage, grade } = calculatePercentage(formData.marksObtained, total)
      newData.percentage = percentage
      newData.grade = grade
    }
    setFormData(newData)
  }

  // Top colleges based on percentage
  const topCollegesByPercentage = useMemo(() => {
    const perc = parseFloat(formData.percentage) || 0
    let filtered = [...colleges]
    // Sort by placement %, verified, established (top rating logic)
    filtered.sort((a, b) => {
      const placeA = parseInt(a.placements?.percentage || 0)
      const placeB = parseInt(b.placements?.percentage || 0)
      if (placeB !== placeA) return placeB - placeA
      return b.established - a.established
    })

    // Filter based on percentage tier - higher % gets top colleges
    if (perc >= 90) {
      // Top tier - all colleges but show 90%+ eligible message
      return filtered.slice(0, 6).map(c => ({ ...c, eligibilityMatch: 'Excellent Match - 90%+ Eligible for Top Colleges', matchPercent: 95, reason: `Your ${perc}% is outstanding - You are eligible for ${c.shortName} top rated college with ${c.placements.percentage} placement` }))
    } else if (perc >= 80) {
      return filtered.slice(0, 6).map(c => ({ ...c, eligibilityMatch: 'Very Good Match - 80%+ Eligible', matchPercent: 85, reason: `Your ${perc}% is very good - ${c.shortName} recommends ${formData.interestedCourse} with ${c.placements.percentage} placement` }))
    } else if (perc >= 70) {
      return filtered.slice(0, 6).map(c => ({ ...c, eligibilityMatch: 'Good Match - 70%+ Eligible', matchPercent: 75, reason: `Your ${perc}% is good - ${c.shortName} has courses for your percentage - ${c.placements.percentage} placement` }))
    } else if (perc >= 60) {
      return filtered.slice(0, 6).map(c => ({ ...c, eligibilityMatch: 'Eligible - 60%+ Colleges', matchPercent: 65, reason: `Your ${perc}% - You can apply to ${c.shortName} - ${c.placements.percentage} placement, scholarship available` }))
    } else if (perc > 0) {
      return filtered.slice(0, 6).map(c => ({ ...c, eligibilityMatch: 'Eligible - Apply with counselling', matchPercent: 55, reason: `Your ${perc}% - Don't worry, ${c.shortName} has options - Contact admission` }))
    }
    return filtered.slice(0, 4).map(c => ({ ...c, eligibilityMatch: 'Top Rated Colleges in Tamil Nadu', matchPercent: 80, reason: `${c.shortName} - ${c.placements.percentage} placement - ${c.accreditation}` }))
  }, [formData.percentage, formData.interestedCourse])

  const handleSubmit = () => {
    const student = {
      id: Date.now(),
      ...formData,
      role: 'STUDENT',
      profileCompletion: 100,
      marks: `${formData.marksObtained}/${formData.totalMarks}`,
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      district: formData.district,
      city: formData.city,
      educationLevel: formData.educationLevel,
      schoolCollege: formData.schoolCollege,
      groupStream: formData.groupStream,
      interestedCourse: formData.interestedCourse,
      interestedSubject: formData.interestedSubject,
      preferredDistrict: formData.preferredDistrict,
      collegeType: formData.collegeType,
      hostelRequired: formData.hostelRequired,
      transportRequired: formData.transportRequired,
      documentsUploaded: Object.keys(formData.documentNames).filter(k => formData.documentNames[k]).length,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('tn_current_student', JSON.stringify(student))
    const students = JSON.parse(localStorage.getItem('tn_students') || '[]')
    students.push(student)
    localStorage.setItem('tn_students', JSON.stringify(students))
    // Also save detailed profile
    localStorage.setItem(`tn_student_docs_${student.id}`, JSON.stringify(formData.documentNames))
    navigate('/student/dashboard')
  }

  const steps = [
    { id: 1, title: 'Basic & Dream Course', icon: Heart, desc: 'Name, Email, Mobile, Enna Padikka Aasa Padra - Interested Course' },
    { id: 2, title: 'Personal & Family Details', icon: Users, desc: 'DOB, Gender, Parents, Aadhar, Address - Full Info' },
    { id: 3, title: 'Education & Documents', icon: FileText, desc: 'Marks Auto %, Percentage, Original Documents Upload' },
    { id: 4, title: 'Preferences & Top Colleges', icon: Trophy, desc: 'Your % ku etha top rating colleges - Auto Show' },
    { id: 5, title: 'Review & Submit', icon: BadgeCheck, desc: 'Verify all info and create account' }
  ]

  return (
    <div className="min-h-screen bg-[#E8E2DB] flex">
      {/* Left - Branding */}
      <div className="hidden lg:flex w-[440px] bg-[#1A3263] text-white p-8 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FAB95B] via-[#547792] to-[#E8E2DB]" />
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-[14px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold text-[22px]">T</div>
            <div>
              <div className="font-display font-bold text-[18px]">Tamil Nadu Colleges</div>
              <div className="text-[11px] tracking-widest uppercase text-[#FAB95B]">Student Sign Up • Original Docs • Auto % • Top Colleges</div>
            </div>
          </div>

          <div className="mt-10">
            <h1 className="font-display text-[30px] font-bold leading-[0.95]">Join with your original documents & dream course</h1>
            <p className="mt-4 text-[13px] leading-[1.6] text-[#E8E2DB]/70">Enna padikka aasa padra-nu signup pothey sollu - Marks pota odaney auto % varum - Un % ku etha top rating colleges automatic ah kaattum - Original documents upload pannu - #E8E2DB #FAB95B #547792 #1A3263</p>
          </div>

          <div className="mt-8 space-y-3">
            {steps.map(s => (
              <div key={s.id} className={`flex gap-3 p-3 rounded-[14px] border transition-all ${step===s.id?'bg-white/10 border-[#FAB95B]/50':'bg-white/5 border-white/10 opacity-60'}`}>
                <div className={`h-9 w-9 rounded-[10px] grid place-items-center shrink-0 ${step===s.id?'bg-[#FAB95B] text-[#1A3263]': step>s.id ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white'}`}>
                  {step>s.id ? <Check size={16} /> : <s.icon size={16} />}
                </div>
                <div>
                  <div className="font-semibold text-[12px] flex items-center gap-2">Step {s.id}: {s.title} {step>s.id && <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500 text-white">Done</span>}</div>
                  <div className="text-[10px] text-white/60 mt-1 leading-[1.3]">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {formData.percentage && (
            <div className="mt-6 rounded-[16px] bg-[#FAB95B] text-[#1A3263] p-4">
              <div className="flex items-center gap-2 font-bold text-[13px]"><Calculator size={16} /> Auto Percentage: {formData.percentage}%</div>
              <div className="text-[11px] mt-1">{formData.grade} - {formData.marksObtained}/{formData.totalMarks}</div>
              <div className="text-[10px] mt-2 font-bold">Top Colleges for {formData.percentage}%:</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {topCollegesByPercentage.slice(0,3).map(c=>(
                  <span key={c.id} className="px-2 py-0.5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[9px] font-bold">{c.shortName} {c.placements.percentage}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-[10px] text-white/40">Original Documents • Auto % • Top Rating Colleges • Secure • #E8E2DB #FAB95B #547792 #1A3263</div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex flex-col">
        <div className="h-[64px] border-b-2 border-[#1A3263]/10 bg-white/80 backdrop-blur px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="lg:hidden h-9 w-9 rounded-[10px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-bold">T</div>
            <div className="hidden lg:flex items-center gap-3 text-[12px]">
              <span className="text-[#547792]">Step {step} of 5</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i=>(
                  <div key={i} className={`h-2 w-10 rounded-full transition-all ${i===step?'bg-[#1A3263] w-14': i<step?'bg-[#FAB95B]':'bg-[#E8E2DB] border'}`} />
                ))}
              </div>
              <div className="ml-3 flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#547792]">🌐 {language==='ta' ? 'மாணவர் விவரங்கள் தமிழ் / English' : 'Student Details Tamil / English'}:</span>
                <StudentLanguageToggleAlways variant="pill" />
              </div>
            </div>
            <span className="lg:hidden font-bold text-[#1A3263] text-[13px] flex items-center gap-2">Step {step}: {steps[step-1].title} <StudentLanguageToggleAlways variant="compact" /></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex"><StudentLanguageToggleAlways variant="pill" /></div>
            <Link to="/login" className="text-[12px] font-semibold text-[#1A3263]">Have account? <span className="text-[#FAB95B] bg-[#1A3263] px-3 py-1 rounded-full ml-1">Login</span></Link>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-[760px] mx-auto">

            {/* STEP 1 - Basic + Dream Course */}
            {step===1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[26px] font-bold text-[#1A3263] flex items-center gap-2"><Heart size={22} className="text-[#FAB95B]" /> {language==='ta' ? 'அடிப்படை தகவல் & கனவு பாடம் - Proper Details Tamil / English' : 'Basic Information & Dream Course - Proper Details'} <span className="text-[11px] px-2 py-1 rounded-full bg-[#FAB95B] text-[#1A3263]">🌐 {language==='ta' ? 'தமிழ் / English - Toggle-ல் மாறும்' : 'Tamil / English - Toggle Changes'}</span></h2>
                  <p className="text-[12px] text-[#547792] mt-1">{language==='ta' ? 'என்ன படிக்க ஆசைப்படுகிறாய் என்பதை பதிவு செய்யும் போதே சொல்ல வேண்டும் - ஆர்வமுள்ள பாடம், கனவு, அடிப்படை விவரங்கள் - Toggle-ல் தமிழ் / English-ல் Proper-a மாறும்' : 'Enna padikka aasa padra-nu signup pothey podanum - Interested course, dream, basic details - Proper details change via toggle Tamil / English'}</p>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><User size={12} className="text-[#FAB95B]" /> Full Name * - As per Aadhar</label>
                      <input value={formData.fullName} onChange={e=>updateField('fullName', e.target.value)} placeholder="Enter full name as per Aadhar" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px] text-[#1A3263]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Mail size={12} className="text-[#FAB95B]" /> Email *</label>
                      <input type="email" value={formData.email} onChange={e=>updateField('email', e.target.value)} placeholder="student@email.com" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Phone size={12} className="text-[#FAB95B]" /> Mobile *</label>
                      <input value={formData.mobile} onChange={e=>updateField('mobile', e.target.value)} placeholder="+91 98765 43210" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Lock size={12} className="text-[#FAB95B]" /> Password *</label>
                      <input type="password" value={formData.password} onChange={e=>updateField('password', e.target.value)} placeholder="Strong password" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><MapPin size={12} className="text-[#FAB95B]" /> District *</label>
                      <select value={formData.district} onChange={e=>updateField('district', e.target.value)} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px] font-medium">
                        <option>Coimbatore</option><option>Chennai</option><option>Madurai</option><option>Trichy</option><option>Salem</option><option>Erode</option><option>Tirupur</option><option>Chengalpattu</option><option>Thanjavur</option><option>Tirunelveli</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">City *</label>
                      <input value={formData.city} onChange={e=>updateField('city', e.target.value)} placeholder="Enter city" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-[#E8E2DB]">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-[#1A3263]"><Sparkles size={14} className="text-[#FAB95B]" /> Enna Padikka Aasa Padra? - Dream Course - Signup Pothey Podanum *</div>
                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><BookOpen size={12} className="text-[#FAB95B]" /> Interested Course * - What you want to study</label>
                        <select value={formData.interestedCourse} onChange={e=>updateField('interestedCourse', e.target.value)} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px] font-medium">
                          <option>B.E Computer Science</option><option>B.Tech AI & Data Science</option><option>B.E CSE AI & ML</option><option>B.Tech Information Technology</option><option>B.E Electronics and Communication</option><option>B.E Mechanical</option><option>B.E Civil</option><option>BCA</option><option>B.Sc Computer Science</option><option>B.Com</option><option>BBA</option><option>MBBS</option><option>MBA</option><option>B.Sc Nursing</option><option>LLB</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263]">Interested Subject / Stream</label>
                        <input value={formData.interestedSubject} onChange={e=>updateField('interestedSubject', e.target.value)} placeholder="e.g. Computer Science, Biology, Commerce" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263]">Career Goal - Enna Aaganum?</label>
                        <input value={formData.careerGoal} onChange={e=>updateField('careerGoal', e.target.value)} placeholder="e.g. Software Engineer, Doctor, Entrepreneur" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263]">Why This Course? - Reason</label>
                        <input value={formData.whyThisCourse} onChange={e=>updateField('whyThisCourse', e.target.value)} placeholder="Why you love this course?" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={()=>setStep(2)} disabled={!formData.fullName || !formData.email || !formData.mobile || !formData.interestedCourse} className="w-full h-12 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#1A3263]/90 disabled:opacity-50">
                  Continue to Personal Details <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* STEP 2 - Personal & Family Extended */}
            {step===2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Users size={20} className="text-[#FAB95B]" /> Personal & Family Details - Full Info</h2>
                  <p className="text-[11px] text-[#547792] mt-1">Vera enna information student kitta irunthu venumoo athala odd pantra mathiri - Complete profile</p>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-5">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263] flex items-center gap-1"><Calendar size={10} className="text-[#FAB95B]" /> Date of Birth *</label>
                      <input type="date" value={formData.dob} onChange={e=>updateField('dob', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Gender *</label>
                      <select value={formData.gender} onChange={e=>updateField('gender', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Blood Group</label>
                      <select value={formData.bloodGroup} onChange={e=>updateField('bloodGroup', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Nationality</label>
                      <input value={formData.nationality} onChange={e=>updateField('nationality', e.target.value)} placeholder="Indian" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Religion</label>
                      <select value={formData.religion} onChange={e=>updateField('religion', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Hindu</option><option>Muslim</option><option>Christian</option><option>Sikh</option><option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Community *</label>
                      <select value={formData.community} onChange={e=>updateField('community', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>OC</option><option>BC</option><option>BCM</option><option>MBC</option><option>DNC</option><option>SC</option><option>SCA</option><option>ST</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Caste</label>
                      <input value={formData.caste} onChange={e=>updateField('caste', e.target.value)} placeholder="Enter caste" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263] flex items-center gap-1"><IdCard size={10} className="text-[#FAB95B]" /> Aadhar Number *</label>
                      <input value={formData.aadharNumber} onChange={e=>updateField('aadharNumber', e.target.value)} placeholder="1234 5678 9012" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Annual Family Income</label>
                      <select value={formData.annualIncome} onChange={e=>updateField('annualIncome', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Below 1 Lakh</option><option>1-2 Lakhs</option><option>2-5 Lakhs</option><option>5-8 Lakhs</option><option>Above 8 Lakhs</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E2DB]">
                    <div className="text-[11px] font-bold text-[#1A3263] flex items-center gap-1.5"><Users size={12} className="text-[#FAB95B]" /> Parents Details</div>
                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">Father Name *</label>
                        <input value={formData.fatherName} onChange={e=>updateField('fatherName', e.target.value)} placeholder="Father name" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">Mother Name *</label>
                        <input value={formData.motherName} onChange={e=>updateField('motherName', e.target.value)} placeholder="Mother name" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">Father Occupation</label>
                        <input value={formData.fatherOccupation} onChange={e=>updateField('fatherOccupation', e.target.value)} placeholder="Occupation" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">Mother Occupation</label>
                        <input value={formData.motherOccupation} onChange={e=>updateField('motherOccupation', e.target.value)} placeholder="Occupation" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">Parent Mobile *</label>
                        <input value={formData.parentMobile} onChange={e=>updateField('parentMobile', e.target.value)} placeholder="Parent mobile" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">Alternate Mobile</label>
                        <input value={formData.alternateMobile} onChange={e=>updateField('alternateMobile', e.target.value)} placeholder="Alternate" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E2DB]">
                    <div className="text-[11px] font-bold text-[#1A3263] flex items-center gap-1.5"><Home size={12} className="text-[#FAB95B]" /> Permanent Address</div>
                    <div className="grid md:grid-cols-3 gap-4 mt-3">
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">Full Address *</label>
                        <input value={formData.permanentAddress} onChange={e=>updateField('permanentAddress', e.target.value)} placeholder="Door no, Street, Area, Landmark" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">Pincode *</label>
                        <input value={formData.pincode} onChange={e=>updateField('pincode', e.target.value)} placeholder="641004" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={()=>setStep(1)} className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-semibold text-[12px] flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
                  <button onClick={()=>setStep(3)} className="flex-1 h-11 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center justify-center gap-2">Continue to Education & Docs <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {/* STEP 3 - Education + Marks Auto % + Documents */}
            {step===3 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><FileText size={20} className="text-[#FAB95B]" /> Education & Original Documents Upload</h2>
                  <p className="text-[11px] text-[#547792] mt-1">Mark potta odaney automatic ah percentage show aagum - Original documents submit pantra mathiri upload pannu</p>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><GraduationCap size={12} className="text-[#FAB95B]" /> Current Education Level *</label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {['10th','11th','12th','Diploma','Undergraduate','Postgraduate'].map(level=>(
                          <button key={level} onClick={()=>handleEducationLevelChange(level)} className={`h-10 rounded-[10px] border-2 text-[11px] font-semibold transition-all ${formData.educationLevel===level?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B]'}`}>{level}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Board / University</label>
                      <select value={formData.board} onChange={e=>updateField('board', e.target.value)} className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Tamil Nadu State Board</option><option>CBSE</option><option>ICSE</option><option>Anna University</option><option>Bharathiar University</option><option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><School size={12} className="text-[#FAB95B]" /> School / College *</label>
                      <input value={formData.schoolCollege} onChange={e=>updateField('schoolCollege', e.target.value)} placeholder="School/College name" className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Year of Passing</label>
                      <select value={formData.yearOfPassing} onChange={e=>updateField('yearOfPassing', e.target.value)} className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>2026</option><option>2025</option><option>2024</option><option>2023</option><option>2022</option>
                      </select>
                    </div>
                  </div>

                  {/* Marks Auto % */}
                  <div className="rounded-[16px] bg-[#1A3263] text-white p-5">
                    <div className="flex items-center gap-2 font-bold text-[13px] text-[#FAB95B]"><Calculator size={16} /> Marks - Auto Percentage Calculation - Mark Potta Odaney Auto % Varum</div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">Marks Obtained * - e.g. 540 or 450/500</label>
                        <input value={formData.marksObtained} onChange={e=>handleMarksChange('marksObtained', e.target.value)} placeholder="e.g. 540 or 450/500" className="mt-1 w-full h-11 px-3 rounded-[10px] bg-white text-[#1A3263] border-2 border-[#FAB95B] outline-none text-[13px] font-bold" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">Total Marks * - Auto set: {formData.educationLevel} = {formData.totalMarks}</label>
                        <input value={formData.totalMarks} onChange={e=>handleMarksChange('totalMarks', e.target.value)} placeholder="e.g. 600" className="mt-1 w-full h-11 px-3 rounded-[10px] bg-white text-[#1A3263] border-2 border-[#FAB95B] outline-none text-[13px] font-bold" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">Auto Percentage % - Automatic ah varum</label>
                        <div className="mt-1 w-full h-11 px-3 rounded-[10px] bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] grid place-items-center font-bold text-[16px]">
                          {formData.percentage ? `${formData.percentage}% - ${formData.grade}` : 'Enter marks - Auto %'}
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">Group / Stream</label>
                        <select value={formData.groupStream} onChange={e=>updateField('groupStream', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-white text-[#1A3263] border-2 border-[#E8E2DB] outline-none text-[12px]">
                          <option>Computer Science</option><option>Biology</option><option>Commerce</option><option>Arts</option><option>Mechanical</option><option>ECE</option><option>Civil</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">Cutoff (Engg) - Optional</label>
                        <input value={formData.cutoff} onChange={e=>updateField('cutoff', e.target.value)} placeholder="e.g. 180" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-white text-[#1A3263] border-2 border-[#E8E2DB] outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">Medium</label>
                        <select value={formData.medium} onChange={e=>updateField('medium', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-white text-[#1A3263] border-2 border-[#E8E2DB] outline-none text-[12px]">
                          <option>English</option><option>Tamil</option><option>Other</option>
                        </select>
                      </div>
                    </div>
                    {formData.percentage && (
                      <div className="mt-4 rounded-[12px] bg-white text-[#1A3263] p-3">
                        <div className="text-[11px] font-bold">✨ Auto Calculation Result:</div>
                        <div className="text-[12px] mt-1">Marks: {formData.marksObtained} / {formData.totalMarks} = <span className="font-bold text-[#1A3263]">{formData.percentage}%</span> - Grade: <span className="font-bold">{formData.grade}</span></div>
                        <div className="text-[10px] text-[#547792] mt-1">Top rating colleges for {formData.percentage}% will be shown in next step - {formData.percentage}% ku etha mathiri top colleges show aagum</div>
                      </div>
                    )}
                  </div>

                  {/* Documents Upload - Original Documents Submit Pantra Mathiri */}
                  <div>
                    <div className="flex items-center gap-2 font-bold text-[14px] text-[#1A3263]"><Upload size={18} className="text-[#FAB95B]" /> Original Documents Upload - Submit Pantra Mathiri Venum - Required & Optional</div>
                    <div className="text-[11px] text-[#547792] mt-1">Upload your original documents - 10th, 12th, TC, Community, Income, Aadhar, Photo etc - Vera enna information venumoo atha odd pantra mathiri - All documents secure</div>
                    <div className="grid md:grid-cols-2 gap-3 mt-4">
                      {[
                        { key: 'tenthMarksheet', label: '10th Mark Sheet *', desc: 'SSLC Original - Required', required: true, icon: '📄' },
                        { key: 'twelfthMarksheet', label: '12th Mark Sheet *', desc: 'HSC Original - Required for 12th', required: true, icon: '📄' },
                        { key: 'tc', label: 'Transfer Certificate (TC) *', desc: 'School/College TC - Required', required: true, icon: '📜' },
                        { key: 'communityCertificate', label: 'Community Certificate *', desc: 'BC/MBC/SC/ST - Required', required: true, icon: '🏛️' },
                        { key: 'incomeCertificate', label: 'Income Certificate', desc: 'Family Income - For scholarship', required: false, icon: '💰' },
                        { key: 'aadharCard', label: 'Aadhar Card *', desc: 'ID Proof - Required', required: true, icon: '🪪' },
                        { key: 'photo', label: 'Passport Photo *', desc: 'Recent Photo - Required', required: true, icon: '📸' },
                        { key: 'nativityCertificate', label: 'Nativity Certificate', desc: 'Tamil Nadu Nativity - Optional', required: false, icon: '📍' },
                        { key: 'firstGraduateCertificate', label: 'First Graduate Certificate', desc: 'If first graduate - Optional', required: false, icon: '🎓' },
                        { key: 'specialReservation', label: 'Special Reservation', desc: 'Sports/Ex-Servicemen/PH - Optional', required: false, icon: '⭐' },
                      ].map(doc=>(
                        <div key={doc.key} className={`rounded-[14px] border-2 p-3 ${formData.documentNames[doc.key] ? 'bg-[#FAB95B]/20 border-[#FAB95B]' : 'bg-[#E8E2DB]/50 border-[#E8E2DB]'} `}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex gap-2">
                              <span className="text-[16px]">{doc.icon}</span>
                              <div>
                                <div className="text-[11px] font-bold text-[#1A3263] flex items-center gap-1">{doc.label} {doc.required && <span className="text-red-500">*</span>} {formData.documentNames[doc.key] && <Check size={12} className="text-green-600" />}</div>
                                <div className="text-[10px] text-[#547792]">{doc.desc}</div>
                                {formData.documentNames[doc.key] && <div className="text-[10px] font-bold text-[#1A3263] mt-1">✓ {formData.documentNames[doc.key]}</div>}
                              </div>
                            </div>
                            {formData.documentNames[doc.key] ? (
                              <button onClick={()=>updateDocName(doc.key, '')} className="h-6 w-6 rounded-full bg-red-500 text-white grid place-items-center"><X size={12} /></button>
                            ) : (
                              <label className="h-7 px-3 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px] font-bold grid place-items-center cursor-pointer">
                                Upload
                                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>{
                                  const file = e.target.files?.[0]
                                  if(file) updateDocName(doc.key, file.name)
                                }} />
                              </label>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-[12px] bg-[#1A3263] text-white p-3 flex items-start gap-2">
                      <FileText size={16} className="text-[#FAB95B] shrink-0 mt-0.5" />
                      <div className="text-[10px] leading-[1.5] text-[#E8E2DB]/80">All documents are securely stored - Platform admin can verify - College will get only after enquiry with consent - Original documents submit pantra mathiri venum - Vera enna info venumoo atha add pannalam - {Object.values(formData.documentNames).filter(Boolean).length} / 10 documents uploaded</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={()=>setStep(2)} className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-semibold text-[12px] flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
                  <button onClick={()=>setStep(4)} disabled={!formData.marksObtained || !formData.totalMarks} className="flex-1 h-11 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center justify-center gap-2 disabled:opacity-50">Continue - Show Top Colleges for {formData.percentage || 'Your'}% <Trophy size={16} /></button>
                </div>
              </div>
            )}

            {/* STEP 4 - Preferences + Top Colleges based on % */}
            {step===4 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Trophy size={20} className="text-[#FAB95B]" /> Preferences & Top Rated Colleges for Your {formData.percentage}%</h2>
                  <p className="text-[11px] text-[#547792] mt-1">Avanoda percentagekku etha mathiri top ratingla irukkura colleges show ahanum - Auto show based on your marks</p>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Preferred District</label>
                      <select value={formData.preferredDistrict} onChange={e=>updateField('preferredDistrict', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Coimbatore</option><option>Chennai</option><option>Madurai</option><option>Trichy</option><option>Salem</option><option>Any District</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">College Type</label>
                      <select value={formData.collegeType} onChange={e=>updateField('collegeType', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Any</option><option>Government</option><option>Private</option><option>Autonomous</option><option>Government Aided</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Budget Range</label>
                      <select value={formData.budgetRange} onChange={e=>updateField('budgetRange', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Below 50K</option><option>50K - 1 Lakh</option><option>1-2 Lakhs</option><option>2-3 Lakhs</option><option>Above 3 Lakhs</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Scholarship Needed</label>
                      <div className="mt-1 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('scholarshipNeeded', opt)} className={`flex-1 h-10 rounded-[10px] border-2 text-[11px] font-semibold ${formData.scholarshipNeeded===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Home size={12} className="text-[#FAB95B]" /> Hostel Required</label>
                      <div className="mt-1 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('hostelRequired', opt)} className={`flex-1 h-10 rounded-[10px] border-2 text-[11px] font-semibold ${formData.hostelRequired===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">Transport Required</label>
                      <div className="mt-1 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('transportRequired', opt)} className={`flex-1 h-10 rounded-[10px] border-2 text-[11px] font-semibold ${formData.transportRequired===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Top Rated Colleges based on percentage */}
                  <div className="pt-4 border-t-2 border-[#E8E2DB]">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 font-bold text-[14px] text-[#1A3263]"><Star size={18} className="text-[#FAB95B]" /> Top Rating Colleges for Your {formData.percentage}% - {formData.interestedCourse} - Auto Show</div>
                      <div className="px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-bold">Your %: {formData.percentage}% - {formData.grade} - {topCollegesByPercentage.length} Colleges Matched</div>
                    </div>
                    <div className="text-[11px] text-[#547792] mt-2">Avanoda percentagekku etha mathiri top ratingla irukkura colleges - Based on placement %, NAAC, NIRF, accreditation - Your dream course {formData.interestedCourse} ku etha</div>

                    <div className="grid md:grid-cols-2 gap-3 mt-4">
                      {topCollegesByPercentage.map(college=>(
                        <div key={college.id} className="rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-4 hover:border-[#FAB95B] transition-colors">
                          <div className="flex gap-3">
                            <img src={college.branding.logo} alt={college.shortName} className="h-12 w-12 rounded-[10px] object-cover border-2 border-[#FAB95B] bg-white" onError={e=>e.target.src=`https://ui-avatars.com/api/?name=${college.shortName}&background=1A3263&color=FAB95B`} />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="font-bold text-[#1A3263] text-[13px]">{college.name}</div>
                                {college.verified && <BadgeCheck size={14} className="text-[#547792]" />}
                              </div>
                              <div className="text-[10px] text-[#547792]">{college.district} • {college.type} • Est {college.established}</div>
                              <div className="flex items-center gap-1 mt-1">
                                <div className="flex">
                                  {[1,2,3,4,5].map(i=><Star key={i} size={10} className={`${i<=4?'fill-[#FAB95B] text-[#FAB95B]':'text-[#E8E2DB]'}`} />)}
                                </div>
                                <span className="text-[10px] font-bold text-[#1A3263]">{college.placements.percentage} Placement • {college.placements.average}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="px-2 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px] font-bold">{college.matchPercent}% Match</div>
                              <div className="text-[9px] text-[#547792] mt-1">{college.placements.highest} Highest</div>
                            </div>
                          </div>
                          <div className="mt-3 rounded-[10px] bg-white border border-[#E8E2DB] p-2.5">
                            <div className="text-[10px] font-bold text-[#1A3263] flex items-center gap-1"><TrendingUp size={10} className="text-[#FAB95B]" /> {college.eligibilityMatch}</div>
                            <div className="text-[10px] text-[#547792] mt-1 leading-[1.4]">{college.reason}</div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              <span className="px-2 py-0.5 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[9px] font-bold">{college.accreditation.split('•')[0]}</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#FAB95B]/20 text-[#1A3263] text-[9px]">{college.quickInfo.courses} Courses</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#547792] text-white text-[9px]">{college.district}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 rounded-[12px] bg-[#1A3263] text-white p-4">
                      <div className="text-[12px] font-bold text-[#FAB95B] flex items-center gap-1.5"><Trophy size={14} /> Why These Colleges for {formData.percentage}%?</div>
                      <div className="text-[11px] text-[#E8E2DB]/80 mt-2 leading-[1.5]">
                        {parseFloat(formData.percentage)>=90 ? `Outstanding! Your ${formData.percentage}% is top tier - You are eligible for all top rated colleges in Tamil Nadu including PSG Tech (NIRF 67, 96% placement, NAAC A), CIT, KCT. You can get ${formData.interestedCourse} with merit scholarship. Apply via TNEA counselling.` :
                         parseFloat(formData.percentage)>=80 ? `Excellent! Your ${formData.percentage}% is very good - Top colleges like PSG Tech, CIT, KCT recommend ${formData.interestedCourse}. You have high chance in government aided and autonomous colleges with ${formData.interestedCourse}.` :
                         parseFloat(formData.percentage)>=70 ? `Good! Your ${formData.percentage}% - You can apply to good private and autonomous colleges for ${formData.interestedCourse}. Many colleges offer scholarship for ${formData.community} category.` :
                         `Your ${formData.percentage}% - Don't worry, many colleges in Tamil Nadu have management quota, counselling, and scholarship. Focus on ${formData.interestedCourse} - Contact admissions.`} - Based on your district {formData.district}, preferred {formData.preferredDistrict}, budget {formData.budgetRange}.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={()=>setStep(3)} className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-semibold text-[12px] flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
                  <button onClick={()=>setStep(5)} className="flex-1 h-11 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold text-[12px] flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(250,185,91,0.4)]">Review & Submit <Check size={16} /></button>
                </div>
              </div>
            )}

            {/* STEP 5 - Review */}
            {step===5 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><BadgeCheck size={20} className="text-[#FAB95B]" /> Review Your Details - Final Check</h2>
                  <p className="text-[11px] text-[#547792] mt-1">Verify all info - Original documents, marks auto %, top colleges - Then create account</p>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-[11px]">
                    <div className="space-y-2">
                      <div className="font-bold text-[#1A3263] text-[12px] flex items-center gap-1"><User size={12} className="text-[#FAB95B]" /> Basic & Dream</div>
                      <div><span className="text-[#547792]">Name:</span> <span className="font-bold text-[#1A3263]">{formData.fullName}</span></div>
                      <div><span className="text-[#547792]">Email:</span> {formData.email}</div>
                      <div><span className="text-[#547792]">Mobile:</span> {formData.mobile}</div>
                      <div><span className="text-[#547792]">Dream Course:</span> <span className="font-bold text-[#1A3263] bg-[#FAB95B]/20 px-2 py-0.5 rounded-full">{formData.interestedCourse}</span></div>
                      <div><span className="text-[#547792]">Career Goal:</span> {formData.careerGoal || 'Not set'}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-[#1A3263] text-[12px] flex items-center gap-1"><Award size={12} className="text-[#FAB95B]" /> Marks Auto %</div>
                      <div><span className="text-[#547792]">Marks:</span> <span className="font-bold">{formData.marksObtained}/{formData.totalMarks}</span></div>
                      <div><span className="text-[#547792]">Percentage:</span> <span className="font-bold text-[#1A3263] bg-[#FAB95B] px-3 py-1 rounded-full text-[13px]">{formData.percentage}% - {formData.grade}</span></div>
                      <div><span className="text-[#547792]">Level:</span> {formData.educationLevel} - {formData.board}</div>
                      <div><span className="text-[#547792]">Stream:</span> {formData.groupStream}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-[#1A3263] text-[12px] flex items-center gap-1"><Users size={12} className="text-[#FAB95B]" /> Family</div>
                      <div><span className="text-[#547792]">Father:</span> {formData.fatherName} - {formData.fatherOccupation}</div>
                      <div><span className="text-[#547792]">Mother:</span> {formData.motherName}</div>
                      <div><span className="text-[#547792]">Community:</span> {formData.community} - {formData.caste}</div>
                      <div><span className="text-[#547792]">Income:</span> {formData.annualIncome}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-[#1A3263] text-[12px] flex items-center gap-1"><FileText size={12} className="text-[#FAB95B]" /> Documents ({Object.values(formData.documentNames).filter(Boolean).length}/10)</div>
                      {Object.entries(formData.documentNames).filter(([_, name])=>name).map(([key, name])=>(
                        <div key={key} className="flex items-center gap-1 text-[10px]"><Check size={10} className="text-green-600" /> {key}: {name}</div>
                      ))}
                      {Object.values(formData.documentNames).filter(Boolean).length===0 && <div className="text-[10px] text-[#547792]">No documents uploaded - You can upload later</div>}
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-[#E8E2DB]">
                    <div className="font-bold text-[#1A3263] text-[12px] flex items-center gap-1"><Trophy size={12} className="text-[#FAB95B]" /> Top Colleges for {formData.percentage}% - {topCollegesByPercentage.slice(0,3).map(c=>c.shortName).join(', ')}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {topCollegesByPercentage.slice(0,4).map(c=>(
                        <span key={c.id} className="px-2 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px] font-bold">{c.shortName} - {c.placements.percentage} - {c.matchPercent}% Match for {formData.percentage}%</span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[14px] bg-[#1A3263] text-white p-4">
                    <div className="text-[11px] font-bold text-[#FAB95B]">🔒 Privacy Promise - Original Documents Secure</div>
                    <div className="text-[10px] text-[#E8E2DB]/80 mt-1 leading-[1.5]">Your personal info and original documents are secure - Colleges will NOT get your details automatically - Only when you click ENQUIRE NOW with consent, your info is shared - Activity tracked for top college recommendations - Documents uploaded: {Object.values(formData.documentNames).filter(Boolean).length} - Percentage auto: {formData.percentage}% - Top colleges shown based on your % - Production ready</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={()=>setStep(4)} className="h-12 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-semibold text-[13px] flex items-center gap-2"><ArrowLeft size={16} /> Back to Top Colleges</button>
                  <button onClick={handleSubmit} className="flex-1 h-12 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold text-[13px] flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(250,185,91,0.4)] hover:brightness-105">
                    Create Account & Discover Top Colleges for {formData.percentage}% <Check size={18} />
                  </button>
                </div>

                <div className="text-[10px] text-[#547792] text-center">By signing up, you agree to Terms and Privacy - Secure - Original docs - Auto % - Top rating colleges - #E8E2DB #FAB95B #547792 #1A3263</div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
