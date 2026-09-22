import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { colleges as staticColleges } from '../../lib/colleges'
import { getAllCollegesMerged } from '../../lib/collegeStorage'
import { User, Mail, Phone, MapPin, GraduationCap, BookOpen, Heart, Home, Save, ArrowLeft, Edit3, Check, Award, Building2, Star, Trophy, Calculator, Briefcase, IdCard, Calendar } from 'lucide-react'
import { useLanguage } from '../../lib/languageContext'
import { StudentLanguageToggleAlways } from '../../components/student/LanguageToggle'
import StudentHeader from '../../components/student/StudentHeader'

export default function StudentProfile() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [editMode, setEditMode] = useState(null) // null | 'basic' | 'personal' | 'education' | 'preferences' | 'dream'
  const [formData, setFormData] = useState({})
  const [allColleges, setAllColleges] = useState(staticColleges)
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('tn_current_student') || 'null')
    if (!s) {
      navigate('/login')
      return
    }
    setStudent(s)
    setFormData(s)
    setAllColleges(getAllCollegesMerged())
  }, [])

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  const handleSave = (section) => {
    const updated = { ...student, ...formData }
    // Recalculate percentage if marks changed
    if (formData.marksObtained && formData.totalMarks) {
      const obt = parseFloat(formData.marksObtained)
      const tot = parseFloat(formData.totalMarks)
      if (!isNaN(obt) && !isNaN(tot) && tot > 0) {
        const perc = ((obt / tot) * 100).toFixed(2)
        updated.percentage = perc
        let grade = ''
        if (perc >= 90) grade = 'Outstanding - A+'
        else if (perc >= 80) grade = 'Excellent - A'
        else if (perc >= 70) grade = 'Very Good - B+'
        else if (perc >= 60) grade = 'Good - B'
        else grade = 'Average'
        updated.grade = grade
        updated.marks = `${obt}/${tot}`
      }
    }
    localStorage.setItem('tn_current_student', JSON.stringify(updated))
    const students = JSON.parse(localStorage.getItem('tn_students') || '[]')
    const idx = students.findIndex(st => st.id === student.id)
    if (idx >= 0) {
      students[idx] = updated
      localStorage.setItem('tn_students', JSON.stringify(students))
    }
    setStudent(updated)
    setEditMode(null)
    setSavedMessage(section)
    setTimeout(()=>setSavedMessage(''), 3000)
  }

  // Chennai filtering logic: if student says Chennai, Chennai colleges matching details first
  const filteredCollegesByPreference = useMemo(() => {
    if (!student) return []
    const preferredDistrict = formData.preferredDistrict || student.preferredDistrict || 'Coimbatore'
    const interestedCourse = formData.interestedCourse || student.interestedCourse || ''
    const perc = parseFloat(formData.percentage || student.percentage || 0)

    let filtered = [...allColleges]

    // Sort logic: preferred district first, then course match, then percentage match, then placement
    filtered.sort((a, b) => {
      const aIsPreferred = a.district.toLowerCase() === preferredDistrict.toLowerCase() ? 1 : 0
      const bIsPreferred = b.district.toLowerCase() === preferredDistrict.toLowerCase() ? 1 : 0
      if (bIsPreferred !== aIsPreferred) return bIsPreferred - aIsPreferred

      const aCourseMatch = interestedCourse ? (a.courses.some(c => c.name.toLowerCase().includes(interestedCourse.split(' ')[0].toLowerCase())) ? 1 : 0) : 0
      const bCourseMatch = interestedCourse ? (b.courses.some(c => c.name.toLowerCase().includes(interestedCourse.split(' ')[0].toLowerCase())) ? 1 : 0) : 0
      if (bCourseMatch !== aCourseMatch) return bCourseMatch - aCourseMatch

      const aPlace = parseInt(a.placements?.percentage || 0)
      const bPlace = parseInt(b.placements?.percentage || 0)
      return bPlace - aPlace
    })

    // Add match info
    return filtered.map(c => {
      const isPreferredDistrict = c.district.toLowerCase() === preferredDistrict.toLowerCase()
      const courseMatch = interestedCourse ? c.courses.some(co => co.name.toLowerCase().includes(interestedCourse.split(' ')[0].toLowerCase())) : false
      let matchScore = 50
      let reason = ''
      if (isPreferredDistrict) {
        matchScore += 30
        reason += `${preferredDistrict} district match • `
      }
      if (courseMatch) {
        matchScore += 20
        reason += `${interestedCourse} course available • `
      }
      if (perc >= 80) {
        matchScore += 10
        reason += `${perc}% eligible • `
      }
      reason += `${c.placements.percentage} placement • ${c.accreditation}`
      
      return {
        ...c,
        isPreferredDistrict,
        courseMatch,
        matchScore: Math.min(matchScore, 100),
        reason: reason.trim(),
        priorityLabel: isPreferredDistrict ? (language==='ta' ? `${preferredDistrict} - உங்கள் விருப்ப மாவட்டம் - முதலில்` : `${preferredDistrict} - Your Preferred District - First`) : `${c.district} district`
      }
    })
  }, [formData.preferredDistrict, formData.interestedCourse, formData.percentage, student, allColleges, language])

  const chennaiColleges = filteredCollegesByPreference.filter(c => c.district.toLowerCase() === 'chennai')
  const preferredColleges = filteredCollegesByPreference.filter(c => c.isPreferredDistrict)
  const otherColleges = filteredCollegesByPreference.filter(c => !c.isPreferredDistrict)

  if (!student) return <div className="min-h-screen bg-[#E8E2DB] grid place-items-center"><div className="text-[#547792]">Loading...</div></div>

  return (
    <div className="min-h-screen bg-[#E8E2DB]">
      <StudentHeader />
      
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Link to="/student/dashboard" className="h-10 w-10 rounded-full bg-white border-2 border-[#E8E2DB] grid place-items-center text-[#1A3263]"><ArrowLeft size={18} /></Link>
            <div>
              <h1 className="font-display text-[26px] font-bold text-[#1A3263] flex items-center gap-2"><User size={22} className="text-[#FAB95B]" /> {language==='ta' ? 'எனது சுயவிவரம் - Edit Options' : 'My Profile - Edit Options'} <span className="text-[11px] px-2 py-1 rounded-full bg-[#FAB95B] text-[#1A3263]">🌐 {language==='ta' ? 'தமிழ் / English - Proper' : 'Tamil / English - Proper'}</span></h1>
              <p className="text-[11px] text-[#547792] mt-1">{language==='ta' ? 'உங்கள் விவரங்களை மீண்டும் திருத்தலாம் - City க்கு கீழே Dream Course, District மாற்றினால் அந்த District கல்லூரிகள் முதலில் வரும்' : 'You can edit your details again - Dream Course below City, If you change district to Chennai, Chennai colleges matching your details will show first'}</p>
            </div>
          </div>
          <StudentLanguageToggleAlways variant="pill" />
        </div>

        {savedMessage && (
          <div className="mt-6 p-4 rounded-[12px] bg-emerald-50 border-2 border-emerald-200 text-emerald-800 text-[12px] font-bold flex items-center gap-2"><Check size={16} /> {language==='ta' ? `${savedMessage} வெற்றிகரமாக சேமிக்கப்பட்டது!` : `${savedMessage} saved successfully!`} - {language==='ta' ? 'விவரங்கள் புதுப்பிக்கப்பட்டன' : 'Details updated'}</div>
        )}

        <div className="mt-8 grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-6">
            {/* Basic & Dream Course - Citykku Keela */}
            <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1A3263] flex items-center gap-2"><Heart size={16} className="text-[#FAB95B]" /> {language==='ta' ? 'அடிப்படை & கனவு பாடம் - City க்கு கீழே' : 'Basic & Dream Course - Below City'} <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAB95B] text-[#1A3263]">City → Dream Course</span></h3>
                <button onClick={()=>setEditMode(editMode==='basic' ? null : 'basic')} className="h-8 px-3 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[11px] font-bold flex items-center gap-1"><Edit3 size={12} /> {editMode==='basic' ? (language==='ta' ? 'ரத்து' : 'Cancel') : (language==='ta' ? 'திருத்து' : 'Edit')}</button>
              </div>

              {editMode==='basic' ? (
                <div className="mt-5 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('fullName')} *</label>
                      <input value={formData.fullName} onChange={e=>updateField('fullName', e.target.value)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('email')} *</label>
                      <input value={formData.email} onChange={e=>updateField('email', e.target.value)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('mobile')} *</label>
                      <input value={formData.mobile} onChange={e=>updateField('mobile', e.target.value)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('district')} *</label>
                      <select value={formData.district} onChange={e=>updateField('district', e.target.value)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]">
                        <option>Coimbatore</option><option>Chennai</option><option>Madurai</option><option>Trichy</option><option>Salem</option><option>Erode</option><option>Tirupur</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('city')} *</label>
                      <input value={formData.city} onChange={e=>updateField('city', e.target.value)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px] border-b-4 border-b-[#FAB95B]" />
                      <div className="text-[10px] text-[#FAB95B] font-bold mt-1">↓ Below City - Dream Course ↓</div>
                    </div>
                  </div>

                  <div className="rounded-[14px] bg-[#FAB95B]/10 border-2 border-[#FAB95B]/30 p-4">
                    <div className="text-[12px] font-bold text-[#1A3263]">{language==='ta' ? 'என்ன படிக்க ஆசைப்படுகிறாய்? - City க்கு கீழே' : 'What do you want to study? - Below City'} *</div>
                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                      <div className="md:col-span-2">
                        <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('interestedCourse')} *</label>
                        <select value={formData.interestedCourse} onChange={e=>updateField('interestedCourse', e.target.value)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#FAB95B] focus:border-[#1A3263] outline-none text-[13px] font-bold">
                          <option>B.E Computer Science</option><option>B.Tech AI & Data Science</option><option>B.E CSE AI & ML</option><option>B.Tech Information Technology</option><option>B.E ECE</option><option>B.E Mechanical</option><option>BCA</option><option>B.Sc Computer Science</option><option>B.Com</option><option>MBBS</option><option>MBA</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('interestedSubject')}</label>
                        <input value={formData.interestedSubject} onChange={e=>updateField('interestedSubject', e.target.value)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('careerGoal')}</label>
                        <input value={formData.careerGoal} onChange={e=>updateField('careerGoal', e.target.value)} className="mt-1 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" />
                      </div>
                    </div>
                  </div>

                  <button onClick={()=>handleSave('Basic & Dream Course')} className="w-full h-11 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center justify-center gap-2"><Save size={16} /> {language==='ta' ? 'சேமி - City → Dream Course' : 'Save - City → Dream Course'}</button>
                </div>
              ) : (
                <div className="mt-5 space-y-3 text-[12px]">
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelFullName')}:</span><span className="font-bold text-[#1A3263]">{student.fullName}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelEmail')}:</span><span>{student.email}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelMobile')}:</span><span>{student.mobile}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('district')} & {t('city')}:</span><span className="font-bold">{student.district} • {student.city}</span></div>
                  <div className="rounded-[12px] bg-[#FAB95B]/20 border border-[#FAB95B]/30 p-3">
                    <div className="text-[11px] font-bold text-[#1A3263]">📍 City ({student.city}) → Dream Course Below:</div>
                    <div className="font-bold text-[#1A3263] mt-1">{student.interestedCourse} - {student.interestedSubject}</div>
                    <div className="text-[11px] text-[#547792] mt-1">{student.careerGoal}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Personal & Family */}
            <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1A3263] flex items-center gap-2"><User size={16} className="text-[#FAB95B]" /> {t('personalFamily')}</h3>
                <button onClick={()=>setEditMode(editMode==='personal' ? null : 'personal')} className="h-8 px-3 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[11px] font-bold flex items-center gap-1"><Edit3 size={12} /> {editMode==='personal' ? (language==='ta' ? 'ரத்து' : 'Cancel') : (language==='ta' ? 'திருத்து' : 'Edit')}</button>
              </div>
              {editMode==='personal' ? (
                <div className="mt-5 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('fatherName')}</label>
                      <input value={formData.fatherName} onChange={e=>updateField('fatherName', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('motherName')}</label>
                      <input value={formData.motherName} onChange={e=>updateField('motherName', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('community')}</label>
                      <select value={formData.community} onChange={e=>updateField('community', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] outline-none text-[12px]">
                        <option>OC</option><option>BC</option><option>BCM</option><option>MBC</option><option>SC</option><option>ST</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('annualIncome')}</label>
                      <select value={formData.annualIncome} onChange={e=>updateField('annualIncome', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] outline-none text-[12px]">
                        <option>Below 1 Lakh</option><option>1-2 Lakhs</option><option>2-5 Lakhs</option><option>Above 5 Lakhs</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('permanentAddress')}</label>
                      <input value={formData.permanentAddress} onChange={e=>updateField('permanentAddress', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] outline-none text-[12px]" />
                    </div>
                  </div>
                  <button onClick={()=>handleSave('Personal & Family')} className="w-full h-10 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]"><Save size={14} className="inline mr-1" /> {language==='ta' ? 'சேமி' : 'Save'}</button>
                </div>
              ) : (
                <div className="mt-4 space-y-2 text-[12px]">
                  <div className="flex justify-between"><span className="text-[#547792]">{t('fatherName')}:</span><span className="font-medium">{student.fatherName || 'Not set'}</span></div>
                  <div className="flex justify-between"><span className="text-[#547792]">{t('motherName')}:</span><span>{student.motherName || 'Not set'}</span></div>
                  <div className="flex justify-between"><span className="text-[#547792]">{t('community')}:</span><span>{student.community}</span></div>
                  <div className="flex justify-between"><span className="text-[#547792]">{t('annualIncome')}:</span><span>{student.annualIncome || 'Not set'}</span></div>
                </div>
              )}
            </div>

            {/* Education & Marks */}
            <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1A3263] flex items-center gap-2"><Award size={16} className="text-[#FAB95B]" /> {t('educationInfo')} - {t('myMarks')}</h3>
                <button onClick={()=>setEditMode(editMode==='education' ? null : 'education')} className="h-8 px-3 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[11px] font-bold flex items-center gap-1"><Edit3 size={12} /> {editMode==='education' ? (language==='ta' ? 'ரத்து' : 'Cancel') : (language==='ta' ? 'திருத்து' : 'Edit')}</button>
              </div>
              {editMode==='education' ? (
                <div className="mt-5 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('educationLevel')}</label>
                      <select value={formData.educationLevel} onChange={e=>updateField('educationLevel', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] outline-none text-[12px]">
                        <option>10th</option><option>12th</option><option>Diploma</option><option>Undergraduate</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('schoolCollege')}</label>
                      <input value={formData.schoolCollege} onChange={e=>updateField('schoolCollege', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('marksObtained')}</label>
                      <input value={formData.marksObtained} onChange={e=>updateField('marksObtained', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('totalMarks')}</label>
                      <input value={formData.totalMarks} onChange={e=>updateField('totalMarks', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] outline-none text-[12px]" />
                    </div>
                  </div>
                  <button onClick={()=>handleSave('Education & Marks')} className="w-full h-10 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]"><Save size={14} className="inline mr-1" /> {language==='ta' ? 'சேமி & Auto % கணக்கிடு' : 'Save & Auto Calculate %'}</button>
                </div>
              ) : (
                <div className="mt-4 space-y-2 text-[12px]">
                  <div className="flex justify-between"><span className="text-[#547792]">{t('labelEducation')}:</span><span className="font-bold">{student.educationLevel}</span></div>
                  <div className="flex justify-between"><span className="text-[#547792]">{t('labelSchool')}:</span><span>{student.schoolCollege}</span></div>
                  <div className="flex justify-between"><span className="text-[#547792]">{t('labelMarks')}:</span><span className="font-bold">{student.marksObtained}/{student.totalMarks}</span></div>
                  <div className="flex justify-between items-center"><span className="text-[#547792]">{t('labelPercentage')}:</span><span className="px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold">{student.percentage}% - {student.grade}</span></div>
                </div>
              )}
            </div>

            {/* Preferences - Chennai filtering */}
            <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#1A3263] flex items-center gap-2"><MapPin size={16} className="text-[#FAB95B]" /> {t('myPreferences')} - {language==='ta' ? 'Chennai என்றால் Chennai Colleges முதலில்' : 'Chennai Filter - Colleges First'} <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAB95B] text-[#1A3263]">District → Colleges First</span></h3>
                <button onClick={()=>setEditMode(editMode==='preferences' ? null : 'preferences')} className="h-8 px-3 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[11px] font-bold flex items-center gap-1"><Edit3 size={12} /> {editMode==='preferences' ? (language==='ta' ? 'ரத்து' : 'Cancel') : (language==='ta' ? 'திருத்து' : 'Edit')}</button>
              </div>

              {editMode==='preferences' ? (
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-[#1A3263]">{language==='ta' ? 'எங்கே கல்லூரி வேண்டும்? - District' : 'Where do you want college? - District'} * - {language==='ta' ? 'Chennai என்றால் Chennai Colleges முதலில் வரும்' : 'If Chennai, Chennai colleges first'}</label>
                    <select value={formData.preferredDistrict} onChange={e=>updateField('preferredDistrict', e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-white border-2 border-[#FAB95B] focus:border-[#1A3263] outline-none text-[13px] font-bold text-[#1A3263]">
                      <option>Coimbatore</option><option>Chennai</option><option>Madurai</option><option>Trichy</option><option>Salem</option><option>Erode</option><option>Tirupur</option><option>Any District</option>
                    </select>
                    <div className="text-[11px] font-bold text-[#1A3263] mt-2 bg-[#FAB95B]/20 px-3 py-2 rounded-full">📍 {language==='ta' ? `நீங்கள் ${formData.preferredDistrict} தேர்ந்தெடுத்தால் ${formData.preferredDistrict} மாவட்ட கல்லூரிகள் உங்கள் விவரங்களுக்கு ஏற்ப முதலில் காட்டப்படும்` : `If you select ${formData.preferredDistrict}, ${formData.preferredDistrict} district colleges matching your details will show first`}</div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('collegeType')}</label>
                      <select value={formData.collegeType} onChange={e=>updateField('collegeType', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] outline-none text-[12px]">
                        <option>Any</option><option>Government</option><option>Private</option><option>Autonomous</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('budgetRange')}</label>
                      <select value={formData.budgetRange} onChange={e=>updateField('budgetRange', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] outline-none text-[12px]">
                        <option>Below 50K</option><option>1-2 Lakhs</option><option>2-3 Lakhs</option><option>Above 3 Lakhs</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('hostelRequired')}</label>
                      <div className="mt-1 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('hostelRequired', opt)} className={`flex-1 h-10 rounded-[10px] border-2 text-[11px] font-semibold ${formData.hostelRequired===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">{t('transportRequired')}</label>
                      <div className="mt-1 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('transportRequired', opt)} className={`flex-1 h-10 rounded-[10px] border-2 text-[11px] font-semibold ${formData.transportRequired===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={()=>handleSave('Preferences')} className="w-full h-11 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center justify-center gap-2"><Save size={16} /> {language==='ta' ? `சேமி - ${formData.preferredDistrict} Colleges முதலில்` : `Save - ${formData.preferredDistrict} Colleges First`}</button>
                </div>
              ) : (
                <div className="mt-4 space-y-3 text-[12px]">
                  <div className="rounded-[12px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-4">
                    <div className="text-[11px] font-bold text-[#1A3263] flex items-center gap-1"><MapPin size={12} /> {language==='ta' ? 'எங்கே கல்லூரி வேண்டும்?' : 'Where do you want college?'}: <span className="px-3 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] ml-2">{student.preferredDistrict}</span></div>
                    <div className="text-[11px] text-[#1A3263]/80 mt-2">{language==='ta' ? `நீங்கள் ${student.preferredDistrict} என்று சொன்னால் ${student.preferredDistrict} மாவட்டத்தில் உங்கள் விவரங்களுக்கு ஏற்ற கல்லூரிகள் முதலில் காட்டப்படும் - ${student.percentage}% - ${student.interestedCourse}` : `If you say ${student.preferredDistrict}, colleges in ${student.preferredDistrict} district matching your details (${student.percentage}%, ${student.interestedCourse}) will show first`}</div>
                  </div>
                  <div className="flex justify-between"><span className="text-[#547792]">{t('collegeType')}:</span><span>{student.collegeType}</span></div>
                  <div className="flex justify-between"><span className="text-[#547792]">{t('budgetRange')}:</span><span>{student.budgetRange || '1-2 Lakhs'}</span></div>
                  <div className="flex justify-between"><span className="text-[#547792]">{t('hostelRequired')} & {t('transportRequired')}:</span><span>{student.hostelRequired} / {student.transportRequired}</span></div>
                </div>
              )}
            </div>
          </div>

          {/* Right - Chennai Colleges First Preview */}
          <div className="space-y-6">
            <div className="rounded-[20px] bg-[#1A3263] text-white p-6 border-2 border-[#1A3263] sticky top-[80px]">
              <h3 className="font-bold text-[#FAB95B] flex items-center gap-2 text-[14px]"><MapPin size={18} /> {language==='ta' ? `${formData.preferredDistrict || student.preferredDistrict} கல்லூரிகள் - உங்கள் விவரங்களுக்கு ஏற்ப முதலில்` : `${formData.preferredDistrict || student.preferredDistrict} Colleges - Matching Your Details First`}</h3>
              <p className="text-[11px] text-[#E8E2DB]/70 mt-2">{language==='ta' ? `நீங்கள் ${formData.preferredDistrict || student.preferredDistrict} என்று சொன்னால் ${formData.preferredDistrict || student.preferredDistrict} மாவட்ட கல்லூரிகள் உங்கள் ${formData.percentage || student.percentage}% - ${formData.interestedCourse || student.interestedCourse} விவரங்களுக்கு ஏற்ப முதலில் வரும் - Edit Options மூலம் District மாற்றலாம்` : `If you say ${formData.preferredDistrict || student.preferredDistrict}, ${formData.preferredDistrict || student.preferredDistrict} district colleges matching your ${formData.percentage || student.percentage}% - ${formData.interestedCourse || student.interestedCourse} will show first - You can change district via Edit Options`}</p>

              <div className="mt-6 space-y-3 max-h-[600px] overflow-auto pr-1">
                <div className="text-[11px] font-bold text-[#FAB95B]">{language==='ta' ? `முதலில் - ${formData.preferredDistrict || student.preferredDistrict} மாவட்டம் - உங்கள் விவரங்களுக்கு ஏற்றவை` : `First - ${formData.preferredDistrict || student.preferredDistrict} District - Matching Your Details`}</div>
                {preferredColleges.slice(0,4).map(c=>(
                  <div key={c.id} className="rounded-[14px] bg-white text-[#1A3263] p-4 border-2 border-[#FAB95B]">
                    <div className="flex gap-3">
                      <img src={c.branding.logo} className="h-10 w-10 rounded-[10px] object-cover border-2 border-[#FAB95B] bg-[#E8E2DB]" alt="Logo" />
                      <div className="flex-1">
                        <div className="font-bold text-[12px] flex items-center gap-1">{c.name} <span className="px-2 py-0.5 rounded-full bg-[#FAB95B] text-[#1A3263] text-[9px]">{c.priorityLabel}</span></div>
                        <div className="text-[10px] text-[#547792]">{c.district} • {c.type} • {c.placements.percentage} {language==='ta' ? 'வேலைவாய்ப்பு' : 'Placement'}</div>
                        <div className="text-[10px] font-bold mt-1">{c.matchScore}% Match - {c.reason.slice(0,60)}...</div>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[9px] font-bold">{language==='ta' ? 'முதலில்' : 'First'} - {c.district}</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[9px]">{c.courses.length} Courses</span>
                    </div>
                    <Link to={`/college/${c.slug}`} className="mt-3 h-8 w-full rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold grid place-items-center">View - {c.shortName}</Link>
                  </div>
                ))}

                {preferredColleges.length===0 && (
                  <div className="rounded-[12px] bg-white/5 border border-white/10 p-4 text-center text-[11px] text-[#E8E2DB]/70">
                    {language==='ta' ? `${formData.preferredDistrict || student.preferredDistrict} மாவட்டத்தில் கல்லூரிகள் இல்லை - அனைத்து மாவட்டங்களும் காட்டப்படும்` : `No colleges in ${formData.preferredDistrict || student.preferredDistrict} district - showing all districts`}
                  </div>
                )}

                <div className="text-[11px] font-bold text-[#E8E2DB]/70 mt-4">{language==='ta' ? 'மற்ற மாவட்டங்கள் - பின்னர்' : 'Other Districts - Later'}</div>
                {otherColleges.slice(0,3).map(c=>(
                  <div key={c.id} className="rounded-[12px] bg-white/5 border border-white/10 p-3 flex gap-2">
                    <img src={c.branding.logo} className="h-8 w-8 rounded-[8px] object-cover bg-white" alt="Logo" />
                    <div className="flex-1">
                      <div className="font-bold text-[11px] text-white">{c.shortName} - {c.district}</div>
                      <div className="text-[10px] text-[#E8E2DB]/60">{c.matchScore}% Match - {c.placements.percentage} Placement</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[12px] bg-[#FAB95B]/20 border border-[#FAB95B]/30 p-3">
                <div className="text-[11px] font-bold text-[#FAB95B]">🌐 {language==='ta' ? 'Edit Options & Chennai Logic' : 'Edit Options & Chennai Logic'}</div>
                <div className="text-[10px] text-[#E8E2DB]/80 mt-1 leading-[1.5]">{language==='ta' ? 'Students தங்கள் விவரங்களை மீண்டும் திருத்தலாம் - Basic, Personal, Education, Preferences எல்லாம் Edit பண்ணலாம் - எங்கே கல்லூரி வேண்டும் என்று Chennai என்றால் Chennai மாவட்ட கல்லூரிகள் உங்கள் சதவீதம், பாடம், பட்ஜெட் விவரங்களுக்கு ஏற்ப முதலில் காட்டப்படும் - Real filtering logic' : 'Students can edit their details again - Basic, Personal, Education, Preferences all editable - If you say where college you want as Chennai, Chennai district colleges matching your percentage, course, budget details will show first - Real filtering logic'}</div>
              </div>

              <Link to="/search" className="mt-4 w-full h-11 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[12px] grid place-items-center flex items-center justify-center gap-2"><Building2 size={16} /> {language==='ta' ? `${formData.preferredDistrict || student.preferredDistrict} கல்லூரிகளை பார் - முதலில்` : `View ${formData.preferredDistrict || student.preferredDistrict} Colleges - First`}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
