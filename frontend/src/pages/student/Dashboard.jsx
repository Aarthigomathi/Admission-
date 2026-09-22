import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { colleges } from '../../lib/colleges'
import { activityTracker } from '../../lib/activityTracker'
import CollegeCard from '../../components/platform/CollegeCard'
import { GraduationCap, Bookmark, GitCompare, Clock, MapPin, TrendingUp, MessageCircle, Search, BookOpen, Heart, LogOut, User, Mail, Phone, Calendar, IdCard, Home, Award, Building, Briefcase, FileText, Star, Trophy, Calculator, Edit3 } from 'lucide-react'
import { useLanguage } from '../../lib/languageContext'
import { StudentLanguageToggleAlways } from '../../components/student/LanguageToggle'

export default function StudentDashboard() {
  const [student, setStudent] = useState(null)
  const [recentlyViewedIds, setRecentlyViewedIds] = useState([])
  const [saved, setSaved] = useState([])
  const [compare, setCompare] = useState([])
  const { t, language } = useLanguage()
  const [showFullDetails, setShowFullDetails] = useState(false)

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('tn_current_student') || 'null')
    setStudent(s)
    setRecentlyViewedIds(activityTracker.getRecentlyViewed())
    setSaved(JSON.parse(localStorage.getItem('tn_saved_colleges') || '[]'))
    setCompare(JSON.parse(localStorage.getItem('tn_compare_colleges') || '[]'))
  }, [])

  if (!student) {
    return (
      <div className="min-h-screen bg-[#E8E2DB] grid place-items-center p-6">
        <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-12 text-center max-w-[400px]">
          <h2 className="font-bold text-[#1A3263] text-[20px]">{language==='ta' ? 'மாணவராக உள்நுழையவும்' : 'Please login as student'}</h2>
          <p className="text-[13px] text-[#547792] mt-2">{language==='ta' ? 'மாணவர் டாஷ்போர்டுக்கு உள்நுழைவு தேவை' : 'Student dashboard requires login'}</p>
          <Link to="/login" className="mt-6 inline-flex h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold">{t('login')}</Link>
        </div>
      </div>
    )
  }

  const recentlyViewedColleges = recentlyViewedIds.map(id => colleges.find(c => c.id === id)).filter(Boolean)
  // Enhanced: If student says Chennai, Chennai colleges matching details first
  const recommended = useMemo(() => {
    if (!student) return []
    const preferredDistrict = student.preferredDistrict || 'Coimbatore'
    const interestedCourse = student.interestedCourse || ''
    let filtered = [...colleges]
    filtered.sort((a, b) => {
      const aPref = a.district.toLowerCase() === preferredDistrict.toLowerCase() ? 1 : 0
      const bPref = b.district.toLowerCase() === preferredDistrict.toLowerCase() ? 1 : 0
      if (bPref !== aPref) return bPref - aPref
      const aCourse = interestedCourse ? (a.courses.some(c => c.name.toLowerCase().includes(interestedCourse.split(' ')[0].toLowerCase())) ? 1 : 0) : 0
      const bCourse = interestedCourse ? (b.courses.some(c => c.name.toLowerCase().includes(interestedCourse.split(' ')[0].toLowerCase())) ? 1 : 0) : 0
      if (bCourse !== aCourse) return bCourse - aCourse
      return parseInt(b.placements?.percentage || 0) - parseInt(a.placements?.percentage || 0)
    })
    return filtered.slice(0,4)
  }, [student])
  const savedColleges = saved.map(id => colleges.find(c => c.id === id)).filter(Boolean)
  const docsCount = student.documentsUploaded || Object.values(student.documentNames || {}).filter(Boolean).length || 0

  return (
    <div className="min-h-screen bg-[#E8E2DB]">
      {/* Student Header with Tamil/English Toggle - Only for Student */}
      <div className="bg-white border-b-2 border-[#E8E2DB] sticky top-0 z-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-[10px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-bold">T</div>
            <div className="hidden md:block leading-[0.9]">
              <div className="font-bold text-[14px] text-[#1A3263]">Tamil Nadu Colleges</div>
              <div className="text-[10px] text-[#547792]">{language==='ta' ? 'மாணவர் பகுதி - தமிழ் / English - Proper Details' : 'Student Area - Tamil / English - Proper Details'} • {t('language')}: {language==='ta' ? 'தமிழ்' : 'English'}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-bold text-[#547792] bg-[#FAB95B]/20 px-3 py-1 rounded-full border border-[#FAB95B]/30">
              <span>🌐 {language==='ta' ? 'மாணவர் விவரங்கள் தமிழ் / English-ல் Proper-a - Toggle-ல் மாறும்' : 'Student Details Proper in Tamil / English - Toggle Changes'}</span>
            </div>
            <StudentLanguageToggleAlways variant="pill" />
            <Link to="/search" className="h-9 px-4 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[11px] flex items-center gap-1.5"><Search size={14} /> {t('explore')}</Link>
          </div>
        </div>
      </div>

      <div className="bg-[#1A3263] text-white border-b-4 border-[#FAB95B]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="font-display text-[32px] font-bold leading-[0.9]">{t('welcomeStudent', { name: student.fullName || t('student') })}</h1>
              <p className="mt-3 text-[14px] text-[#E8E2DB]/80 max-w-[700px]">{t('profileInfo', { level: student.educationLevel, district: student.district, course: student.interestedCourse, stream: student.groupStream, percentage: student.percentage, hostel: student.hostelRequired, transport: student.transportRequired })}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-bold">{student.educationLevel} - {student.percentage}% - {student.grade}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px]">{student.district} • {student.city}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border text-[11px]">{student.interestedCourse}</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold">{t('profileComplete')} - {docsCount}/10 {t('documents')}</span>
                <span className="px-3 py-1 rounded-full bg-[#FAB95B]/20 border border-[#FAB95B]/30 text-[11px] font-bold text-[#FAB95B]">🌐 {language==='ta' ? 'தமிழ் / English - Proper Details Toggle' : 'Tamil / English - Proper Details Toggle'}</span>
              </div>
              <button onClick={()=>setShowFullDetails(!showFullDetails)} className="mt-4 h-10 px-5 rounded-full bg-white text-[#1A3263] font-bold text-[12px] flex items-center gap-2">
                <User size={14} /> {showFullDetails ? (language==='ta' ? 'விவரங்களை மறை' : 'Hide Full Details') : (language==='ta' ? 'முழு விவரங்களை பார் - தமிழ் / English' : t('viewProfile') + ' - Tamil / English Proper')}
              </button>
              <Link to="/student/profile" className="mt-4 ml-2 inline-flex h-10 px-5 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[12px] items-center gap-2 border-2 border-[#FAB95B]"><Edit3 size={14} /> {language==='ta' ? 'விவரங்களை திருத்து - Edit Options' : 'Edit Details - Edit Options'}</Link>
            </div>
            <div className="flex gap-2 flex-wrap">
              <StudentLanguageToggleAlways variant="compact" />
              <Link to="/search" className="h-11 px-6 rounded-full bg-white text-[#1A3263] font-bold text-[13px] flex items-center gap-2"><Search size={16} /> {t('exploreCollegesNav')}</Link>
              <Link to="/student/saved" className="h-11 px-5 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[13px] flex items-center gap-2"><Bookmark size={16} /> {t('saved')} ({saved.length})</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Proper Student Details - Tamil / English Toggle */}
      {showFullDetails && (
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8">
          <div className="rounded-[24px] bg-white border-2 border-[#FAB95B]/30 p-8 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><User size={22} className="text-[#FAB95B]" /> {t('studentDetails')} - {t('properDetailsTamilEnglish')}</h2>
              <StudentLanguageToggleAlways variant="pill" />
            </div>
            <div className="text-[11px] text-[#547792] mt-2">{language==='ta' ? 'Toggle-ஐ மாற்றினால் அனைத்து விவரங்களும் தமிழ் / English-ல் Proper-a மாறும் - முழு விவரங்கள்' : 'When you change toggle, all details change to Tamil / English properly - Full details'}</div>

            <div className="mt-8 grid lg:grid-cols-2 gap-6">
              {/* Basic + Personal */}
              <div className="rounded-[20px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-6">
                <h3 className="font-bold text-[#1A3263] flex items-center gap-2 text-[14px]"><User size={16} className="text-[#FAB95B]" /> {t('basicInfo')} & {t('personalFamily')}</h3>
                <div className="mt-4 space-y-3 text-[12px]">
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelFullName')}:</span><span className="font-bold text-[#1A3263]">{student.fullName}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelEmail')}:</span><span className="font-medium">{student.email}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelMobile')}:</span><span className="font-medium">{student.mobile} {student.alternateMobile && `/ ${student.alternateMobile}`}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelDob')}:</span><span className="font-medium">{student.dob || 'Not set'}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelGender')}:</span><span className="font-medium">{student.gender ? t(student.gender.toLowerCase()) || student.gender : 'Not set'}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('bloodGroup')}:</span><span className="font-medium">{student.bloodGroup || 'O+'}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelCommunity')}:</span><span className="font-bold">{student.community} {student.caste && `- ${student.caste}`}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelAadhar')}:</span><span className="font-medium">{student.aadharNumber || '**** **** ****'}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelFather')}:</span><span className="font-medium">{student.fatherName || 'Not set'} {student.fatherOccupation && `(${student.fatherOccupation})`}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelMother')}:</span><span className="font-medium">{student.motherName || 'Not set'}</span></div>
                  <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelIncome')}:</span><span className="font-medium">{student.annualIncome || 'Not set'}</span></div>
                  <div className="flex justify-between"><span className="text-[#547792]">{t('labelAddress')}:</span><span className="font-medium text-right max-w-[200px]">{student.permanentAddress || `${student.city}, ${student.district}`} - {student.pincode}</span></div>
                </div>
              </div>

              {/* Education & Marks & Docs */}
              <div className="space-y-6">
                <div className="rounded-[20px] bg-white border-2 border-[#1A3263]/10 p-6">
                  <h3 className="font-bold text-[#1A3263] flex items-center gap-2 text-[14px]"><Award size={16} className="text-[#FAB95B]" /> {t('educationInfo')} & {t('myMarks')}</h3>
                  <div className="mt-4 space-y-3 text-[12px]">
                    <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelEducation')}:</span><span className="font-bold">{student.educationLevel}</span></div>
                    <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelSchool')}:</span><span className="font-medium">{student.schoolCollege}</span></div>
                    <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('board')}:</span><span className="font-medium">{student.board || 'State Board'}</span></div>
                    <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('yearOfPassing')}:</span><span className="font-medium">{student.yearOfPassing || '2024'}</span></div>
                    <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('labelMarks')}:</span><span className="font-bold">{student.marksObtained}/{student.totalMarks}</span></div>
                    <div className="flex justify-between border-b border-[#E8E2DB] pb-2 items-center"><span className="text-[#547792]">{t('labelPercentage')}:</span><span className="font-bold text-[14px] px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263]">{student.percentage}% - {student.grade}</span></div>
                    <div className="flex justify-between border-b border-[#E8E2DB] pb-2"><span className="text-[#547792]">{t('groupStream')}:</span><span className="font-medium">{student.groupStream}</span></div>
                    <div className="flex justify-between"><span className="text-[#547792]">{t('cutoff')}:</span><span className="font-medium">{student.cutoff || 'Not set'}</span></div>
                  </div>
                </div>

                <div className="rounded-[20px] bg-[#1A3263] text-white p-6">
                  <h3 className="font-bold text-[#FAB95B] flex items-center gap-2 text-[14px]"><FileText size={16} /> {t('myDocuments')} - {docsCount}/10 {t('documentsUploaded')}</h3>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                    {[
                      { key: 'tenthMarksheet', label: t('tenthMarksheet') },
                      { key: 'twelfthMarksheet', label: t('twelfthMarksheet') },
                      { key: 'tc', label: t('tc') },
                      { key: 'communityCertificate', label: t('communityCertificate') },
                      { key: 'incomeCertificate', label: t('incomeCertificate') },
                      { key: 'aadharCard', label: t('aadharCard') },
                      { key: 'photo', label: t('photo') },
                      { key: 'nativityCertificate', label: t('nativityCertificate') },
                    ].map(doc=>(
                      <div key={doc.key} className="flex items-center gap-1.5 p-2 rounded-[10px] bg-white/5 border border-white/10">
                        <span className={`h-5 w-5 rounded-full grid place-items-center text-[10px] ${student.documentNames?.[doc.key] || student.documents?.[doc.key] ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/50'}`}>{student.documentNames?.[doc.key] || student.documents?.[doc.key] ? '✓' : '○'}</span>
                        <span className="text-[10px] leading-tight">{doc.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-[10px] text-[#E8E2DB]/70">{t('secureDocs')} - {language==='ta' ? 'மாணவருக்கு மட்டும் தெரியும்' : 'Visible only to student'}</div>
                </div>
              </div>

              {/* Preferences & Dream Course */}
              <div className="rounded-[20px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-6">
                <h3 className="font-bold text-[#1A3263] flex items-center gap-2 text-[14px]"><Heart size={16} /> {t('myPreferences')} & {t('dreamCourse')}</h3>
                <div className="mt-4 space-y-3 text-[12px]">
                  <div className="flex justify-between border-b border-[#FAB95B]/20 pb-2"><span className="text-[#547792]">{t('labelCourse')}:</span><span className="font-bold bg-[#1A3263] text-[#FAB95B] px-2 py-1 rounded-full text-[11px]">{student.interestedCourse}</span></div>
                  <div className="flex justify-between border-b border-[#FAB95B]/20 pb-2"><span className="text-[#547792]">{t('interestedSubject')}:</span><span className="font-medium">{student.interestedSubject}</span></div>
                  <div className="flex justify-between border-b border-[#FAB95B]/20 pb-2"><span className="text-[#547792]">{t('careerGoal')}:</span><span className="font-medium">{student.careerGoal || 'Not set'}</span></div>
                  <div className="flex justify-between border-b border-[#FAB95B]/20 pb-2"><span className="text-[#547792]">{t('whyThisCourse')}:</span><span className="font-medium">{student.whyThisCourse || 'Not set'}</span></div>
                  <div className="flex justify-between border-b border-[#FAB95B]/20 pb-2"><span className="text-[#547792]">{t('labelDistrict')}:</span><span className="font-medium">{student.district} • {student.preferredDistrict} {t('preferredDistrict')}</span></div>
                  <div className="flex justify-between border-b border-[#FAB95B]/20 pb-2"><span className="text-[#547792]">{t('collegeType')}:</span><span className="font-medium">{student.collegeType}</span></div>
                  <div className="flex justify-between border-b border-[#FAB95B]/20 pb-2"><span className="text-[#547792]">{t('budgetRange')}:</span><span className="font-medium">{student.budgetRange || '1-2 Lakhs'}</span></div>
                  <div className="flex justify-between"><span className="text-[#547792]">{t('labelHostel')}:</span><span className="font-medium">{t('hostelRequired')}: {student.hostelRequired} | {t('transportRequired')}: {student.transportRequired}</span></div>
                </div>
              </div>

              {/* Top Colleges for Percentage */}
              <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
                <h3 className="font-bold text-[#1A3263] flex items-center gap-2 text-[14px]"><Trophy size={16} className="text-[#FAB95B]" /> {t('myTopColleges')} - {t('topCollegesForYou', { percentage: student.percentage })}</h3>
                <div className="mt-4 space-y-2">
                  {colleges.slice(0,3).map(c=>(
                    <div key={c.id} className="flex gap-3 p-3 rounded-[12px] bg-[#E8E2DB]/50 border">
                      <img src={c.branding.logo} className="h-10 w-10 rounded-[10px] object-cover bg-white border" alt="Logo" />
                      <div className="flex-1">
                        <div className="font-bold text-[12px] text-[#1A3263]">{c.name}</div>
                        <div className="text-[10px] text-[#547792]">{c.district} • {c.placements.percentage} {t('placement')} • {c.accreditation}</div>
                        <div className="text-[10px] mt-1"><span className="px-2 py-0.5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold">{language==='ta' ? `${student.percentage}% க்கு ${c.placements.percentage} பொருத்தம்` : `${c.placements.percentage} Match for ${student.percentage}%`}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[14px] bg-[#1A3263] text-white p-4 flex items-start gap-3">
              <div className="h-8 w-8 rounded-full bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold shrink-0">🌐</div>
              <div>
                <div className="font-bold text-[12px] text-[#FAB95B]">{t('properDetailsTamilEnglish')}</div>
                <div className="text-[11px] text-[#E8E2DB]/80 mt-1 leading-[1.5]">{language==='ta' ? 'இந்த பக்கத்தில் உள்ள அனைத்து மாணவர் விவரங்களும் - பெயர், மின்னஞ்சல், கைபேசி, பிறந்த தேதி, பாலினம், சமூகம், ஆதார், தந்தை பெயர், தாய் பெயர், வருமானம், முகவரி, கல்வி நிலை, பள்ளி, மதிப்பெண்கள், சதவீதம், தரம், ஆர்வமுள்ள பாடம், தொழில் இலக்கு, விருப்ப மாவட்டம், கல்லூரி வகை, விடுதி, போக்குவரத்து, ஆவணங்கள் - அனைத்தும் Toggle-ல் தமிழ் / English-ல் Proper-a மாறும். மாணவருக்கு மட்டும் இந்த Toggle தெரியும் - College Admin மற்றும் Platform Admin-க்கு தெரியாது.' : 'All student details on this page - name, email, mobile, DOB, gender, community, aadhar, father name, mother name, income, address, education level, school, marks, percentage, grade, interested course, career goal, preferred district, college type, hostel, transport, documents - all change properly in Tamil / English via toggle. This toggle is visible only for students - not for College Admin or Platform Admin.'}</div>
                <div className="mt-3"><StudentLanguageToggleAlways variant="pill" /></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: t('recentlyViewed'), value: recentlyViewedIds.length, icon: Clock, sub: t('recentlyViewedDesc') },
            { label: t('savedColleges'), value: saved.length, icon: Bookmark, sub: t('savedCollegesDesc') },
            { label: t('compareList'), value: compare.length, icon: GitCompare, sub: t('compareListDesc') },
            { label: t('myEnquiries'), value: JSON.parse(localStorage.getItem('tn_enquiries') || '[]').length, icon: MessageCircle, sub: t('myEnquiriesDesc') },
          ].map((stat,i)=>(
            <div key={i} className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-5 flex gap-4">
              <div className="h-11 w-11 rounded-[12px] bg-[#E8E2DB] border-2 border-[#FAB95B]/30 grid place-items-center text-[#1A3263]"><stat.icon size={20} /></div>
              <div>
                <div className="font-display text-[24px] font-bold text-[#1A3263]">{stat.value}</div>
                <div className="text-[11px] font-bold uppercase text-[#547792]">{stat.label}</div>
                <div className="text-[11px] text-[#547792]/70">{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-[1.6fr_1fr] gap-8">
          <div className="space-y-10">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Heart size={20} className="text-[#FAB95B]" /> {t('recommendedForYou')} - {t('basedOn', { course: student.interestedCourse })}</h2>
                <Link to="/search" className="text-[12px] font-bold text-[#547792] hover:text-[#1A3263]">{t('viewAll')}</Link>
              </div>
              <p className="text-[12px] text-[#547792] mt-1">{t('whyShown', { course: student.interestedCourse, district: student.preferredDistrict, type: student.collegeType, level: student.educationLevel })}</p>
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                {recommended.map(c=>(
                  <CollegeCard key={c.id} college={c} />
                ))}
              </div>
            </div>

            {recentlyViewedColleges.length>0 && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-[20px] font-bold text-[#1A3263] flex items-center gap-2"><Clock size={18} /> {t('recentlyViewedColleges')}</h2>
                  <button onClick={()=>{activityTracker.clearRecentlyViewed(); setRecentlyViewedIds([])}} className="text-[11px] font-bold px-3 py-1 rounded-full bg-white border">{t('clearHistory')}</button>
                </div>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  {recentlyViewedColleges.map(c=>(
                    <div key={c.id} className="flex gap-4 p-4 rounded-[16px] bg-white border-2 border-[#E8E2DB]">
                      <img src={c.branding.heroImage} className="h-16 w-16 rounded-[12px] object-cover border" alt="Real" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] truncate text-[#1A3263]">{c.name}</div>
                        <div className="text-[11px] text-[#547792] flex items-center gap-1 mt-1"><MapPin size={10} />{c.district} • {c.type}</div>
                        <div className="mt-2 flex gap-2">
                          <Link to={`/college/${c.slug}`} className="h-7 px-3 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold grid place-items-center">{t('view')}</Link>
                          <button onClick={()=>{activityTracker.removeFromRecentlyViewed(c.id); setRecentlyViewedIds(activityTracker.getRecentlyViewed())}} className="h-7 px-3 rounded-full bg-[#E8E2DB] text-[11px]">{t('remove')}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6">
              <h3 className="font-bold text-[#1A3263] flex items-center gap-2"><Bookmark size={18} className="text-[#FAB95B]" /> {t('savedColleges')}</h3>
              <div className="mt-4 space-y-3">
                {savedColleges.length===0 ? (
                  <div className="py-8 text-center text-[#547792]">
                    <Bookmark size={32} className="mx-auto opacity-30" />
                    <div className="text-[13px] mt-3">{t('noSaved')}</div>
                    <div className="text-[11px] mt-1">{t('saveHint')}</div>
                  </div>
                ) : savedColleges.map(c=>(
                  <div key={c.id} className="flex gap-3 p-3 rounded-[12px] bg-[#E8E2DB]/50 border">
                    <img src={c.branding.logo} className="h-10 w-10 rounded-[10px] object-cover bg-white border" alt="Logo" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[12px] truncate text-[#1A3263]">{c.shortName}</div>
                      <div className="text-[11px] text-[#547792]">{c.district}</div>
                    </div>
                    <Link to={`/college/${c.slug}`} className="h-8 px-3 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold grid place-items-center">{t('view')}</Link>
                  </div>
                ))}
              </div>
              <Link to="/student/saved" className="mt-4 w-full h-10 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] grid place-items-center font-bold text-[12px] text-[#1A3263]">{t('viewAllSaved')}</Link>
            </div>

            <div className="rounded-[24px] bg-[#1A3263] text-white p-6 border-2 border-[#1A3263]">
              <h3 className="font-bold text-[#FAB95B] flex items-center gap-2"><TrendingUp size={18} /> {t('yourActivity')}</h3>
              <div className="mt-4 space-y-3 text-[12px]">
                <div className="flex justify-between"><span className="text-[#E8E2DB]/70">{t('collegeViews')}</span><span className="font-bold text-[#FAB95B]">{activityTracker.getAllActivities().filter(a=>a.activity_type==='COLLEGE_VIEW').length}</span></div>
                <div className="flex justify-between"><span className="text-[#E8E2DB]/70">{t('courseViews')}</span><span className="font-bold">{activityTracker.getAllActivities().filter(a=>a.activity_type==='COURSE_VIEW').length}</span></div>
                <div className="flex justify-between"><span className="text-[#E8E2DB]/70">{t('savedActivity')}</span><span className="font-bold">{activityTracker.getAllActivities().filter(a=>a.activity_type==='SAVE').length}</span></div>
                <div className="flex justify-between"><span className="text-[#E8E2DB]/70">{t('enquiriesConsent')}</span><span className="font-bold text-[#FAB95B]">{activityTracker.getAllActivities().filter(a=>a.activity_type==='ENQUIRY').length}</span></div>
              </div>
              <div className="mt-4 p-3 rounded-[12px] bg-white/5 border border-white/10 text-[11px] leading-[1.5] text-[#E8E2DB]/70">
                {t('privacyNote')}
              </div>
            </div>

            <div className="rounded-[24px] bg-white border-2 border-[#FAB95B]/30 p-6">
              <h3 className="font-bold text-[#1A3263]">{t('navigation')}</h3>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { label: t('exploreCollegesNav'), href: "/search", icon: Search },
                  { label: t('coursesNav'), href: "/search?type=course", icon: BookOpen },
                  { label: t('compareNav'), href: "/student/compare", icon: GitCompare },
                  { label: t('myEnquiriesNav'), href: "/student/enquiries", icon: MessageCircle },
                ].map(item=>(
                  <Link key={item.label} to={item.href} className="flex items-center gap-2 p-3 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] hover:border-[#FAB95B] text-[12px] font-semibold text-[#1A3263]">
                    <item.icon size={14} /> {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-4 rounded-[12px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-3">
                <div className="text-[11px] font-bold text-[#1A3263]">🌐 {t('properDetailsTamilEnglish')}</div>
                <div className="text-[10px] text-[#1A3263]/80 mt-1">{language==='ta' ? 'மாணவர் விவரங்கள் Proper-a தமிழ் / English-ல் - Toggle-ல் மாறும் - College Admin, Platform Admin-க்கு தெரியாது' : 'Student details proper in Tamil / English - Changes via toggle - Not visible to College Admin, Platform Admin'}</div>
                <div className="mt-2"><StudentLanguageToggleAlways variant="pill" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
