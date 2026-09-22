import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getPublicColleges } from '../../lib/collegeStorage'
import { activityTracker } from '../../lib/activityTracker'
import CollegeCard from '../../components/platform/CollegeCard'
import { GraduationCap, Bookmark, GitCompare, Clock, MapPin, TrendingUp, MessageCircle, Search, BookOpen, Heart, User, Award, FileText, Edit3 } from 'lucide-react'
import { useLanguage } from '../../lib/languageContext'
import { StudentLanguageToggleAlways } from '../../components/student/LanguageToggle'

export default function StudentDashboard() {
  const [student, setStudent] = useState(null)
  const [recentlyViewedIds, setRecentlyViewedIds] = useState([])
  const [saved, setSaved] = useState([])
  const [compare, setCompare] = useState([])
  const [colleges, setColleges] = useState([])
  const { t, language } = useLanguage()
  const [showFullDetails, setShowFullDetails] = useState(false)

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('tn_current_student') || 'null')
    setStudent(s)
    setRecentlyViewedIds(activityTracker.getRecentlyViewed())
    setSaved(JSON.parse(localStorage.getItem('tn_saved_colleges') || '[]'))
    setCompare(JSON.parse(localStorage.getItem('tn_compare_colleges') || '[]'))
    setColleges(getPublicColleges())
    const handle = () => setColleges(getPublicColleges())
    window.addEventListener('collegeRegistered', handle)
    window.addEventListener('storage', handle)
    return () => {
      window.removeEventListener('collegeRegistered', handle)
      window.removeEventListener('storage', handle)
    }
  }, [])

  const recommended = useMemo(() => {
    if (!student) return []
    const preferredDistrict = student.preferredDistrict || 'Coimbatore'
    const interestedCourse = student.interestedCourse || ''
    if (colleges.length===0) return []
    let filtered = [...colleges]
    filtered.sort((a, b) => {
      const aPref = a.district.toLowerCase() === preferredDistrict.toLowerCase() ? 1 : 0
      const bPref = b.district.toLowerCase() === preferredDistrict.toLowerCase() ? 1 : 0
      if (bPref !== aPref) return bPref - aPref
      const aCourse = interestedCourse ? ((a.courses||[]).some(c => c.name.toLowerCase().includes(interestedCourse.split(' ')[0].toLowerCase())) ? 1 : 0) : 0
      const bCourse = interestedCourse ? ((b.courses||[]).some(c => c.name.toLowerCase().includes(interestedCourse.split(' ')[0].toLowerCase())) ? 1 : 0) : 0
      if (bCourse !== aCourse) return bCourse - aCourse
      return (b.established||0) - (a.established||0)
    })
    return filtered.slice(0,4)
  }, [student, colleges])

  const recentlyViewedColleges = useMemo(() => {
    return recentlyViewedIds.map(id => colleges.find(c => String(c.id) === String(id))).filter(Boolean)
  }, [recentlyViewedIds, colleges])

  const savedColleges = useMemo(() => {
    return saved.map(item => {
      const id = typeof item === 'object' ? item.id : item
      return colleges.find(c => String(c.id) === String(id))
    }).filter(Boolean)
  }, [saved, colleges])

  const docsCount = useMemo(() => {
    if (!student) return 0
    return student.documentsUploaded || Object.values(student.documentNames || {}).filter(Boolean).length || 0
  }, [student])

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

  return (
    <div className="min-h-screen bg-[#E8E2DB]">
      <div className="bg-white border-b-2 border-[#E8E2DB] sticky top-0 z-40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-[10px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-bold">T</div>
            <div className="hidden md:block leading-[0.9]">
              <div className="font-bold text-[14px] text-[#1A3263]">Tamil Nadu Colleges</div>
              <div className="text-[10px] text-[#547792]">{language==='ta' ? 'மாணவர் பகுதி - தமிழ் / English' : 'Student Area - Tamil / English'} • {t('language')}: {language==='ta' ? 'தமிழ்' : 'English'}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
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
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <button onClick={()=>setShowFullDetails(!showFullDetails)} className="h-10 px-5 rounded-full bg-white text-[#1A3263] font-bold text-[12px] flex items-center gap-2">
                  <User size={14} /> {showFullDetails ? (language==='ta' ? 'விவரங்களை மறை' : 'Hide Full Details') : (language==='ta' ? 'முழு விவரங்களை பார்' : t('viewProfile'))}
                </button>
                <Link to="/student/profile" className="inline-flex h-10 px-5 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[12px] items-center gap-2 border-2 border-[#FAB95B]"><Edit3 size={14} /> {language==='ta' ? 'விவரங்களை திருத்து' : 'Edit Details'}</Link>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link to="/search" className="h-11 px-6 rounded-full bg-white text-[#1A3263] font-bold text-[13px] flex items-center gap-2"><Search size={16} /> {t('exploreCollegesNav')}</Link>
              <Link to="/student/saved" className="h-11 px-5 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[13px] flex items-center gap-2"><Bookmark size={16} /> {t('saved')} ({saved.length})</Link>
            </div>
          </div>
        </div>
      </div>

      {showFullDetails && (
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8">
          <div className="rounded-[24px] bg-white border-2 border-[#FAB95B]/30 p-8 shadow-sm">
            <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><User size={22} className="text-[#FAB95B]" /> {t('studentDetails')}</h2>
            <div className="mt-6 grid lg:grid-cols-2 gap-6">
              <div className="rounded-[20px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-6">
                <h3 className="font-bold text-[#1A3263] text-[14px]">{t('basicInfo')} & {t('personalFamily')}</h3>
                <div className="mt-4 space-y-2 text-[12px]">
                  <div className="flex justify-between border-b pb-2"><span className="text-[#547792]">{t('labelFullName')}:</span><span className="font-bold text-[#1A3263]">{student.fullName}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#547792]">{t('labelEmail')}:</span><span>{student.email}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#547792]">{t('labelMobile')}:</span><span>{student.mobile}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#547792]">{t('labelCommunity')}:</span><span className="font-bold">{student.community}</span></div>
                  <div className="flex justify-between"><span className="text-[#547792]">{t('labelAddress')}:</span><span className="text-right max-w-[200px]">{student.permanentAddress || `${student.city}, ${student.district}`}</span></div>
                </div>
              </div>
              <div className="rounded-[20px] bg-white border-2 border-[#1A3263]/10 p-6">
                <h3 className="font-bold text-[#1A3263] text-[14px]">{t('educationInfo')} & {t('myMarks')}</h3>
                <div className="mt-4 space-y-2 text-[12px]">
                  <div className="flex justify-between border-b pb-2"><span className="text-[#547792]">{t('labelEducation')}:</span><span className="font-bold">{student.educationLevel}</span></div>
                  <div className="flex justify-between border-b pb-2"><span className="text-[#547792]">{t('labelSchool')}:</span><span>{student.schoolCollege}</span></div>
                  <div className="flex justify-between border-b pb-2 items-center"><span className="text-[#547792]">{t('labelPercentage')}:</span><span className="font-bold px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263]">{student.percentage}% - {student.grade}</span></div>
                  <div className="flex justify-between"><span className="text-[#547792]">{t('labelCourse')}:</span><span className="font-bold bg-[#1A3263] text-[#FAB95B] px-2 py-1 rounded-full text-[11px]">{student.interestedCourse}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8">
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
                <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Heart size={20} className="text-[#FAB95B]" /> {t('recommendedForYou')} - {student.preferredDistrict} Colleges First</h2>
                <Link to="/search" className="text-[12px] font-bold text-[#547792] hover:text-[#1A3263]">{t('viewAll')}</Link>
              </div>
              <p className="text-[12px] text-[#547792] mt-1">If you select Chennai, Chennai colleges matching your {student.percentage}% - {student.interestedCourse} will show first - {colleges.length} colleges added by colleges themselves</p>
              
              {colleges.length===0 ? (
                <div className="mt-6 rounded-[20px] bg-white border-2 border-[#FAB95B]/30 p-10 text-center">
                  <div className="text-4xl">🏛️</div>
                  <div className="font-bold text-[#1A3263] mt-4">No Colleges Yet - Colleges Need to Signup & Add Themselves</div>
                  <div className="text-[12px] text-[#547792] mt-2 max-w-[400px] mx-auto">Automatic default college name kattama - Platform la default college illa. College signup panni avanga details add pannina aprom thaan colleges varum. Be first to invite colleges!</div>
                  <Link to="/college/signup" className="mt-4 inline-flex h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">Invite College to Sign Up</Link>
                </div>
              ) : (
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  {recommended.map(c=>(
                    <CollegeCard key={c.id} college={c} />
                  ))}
                </div>
              )}
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
                      <img src={c.branding?.heroImage || `https://ui-avatars.com/api/?name=${c.name}`} className="h-16 w-16 rounded-[12px] object-cover border" alt="Campus" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] truncate text-[#1A3263]">{c.name}</div>
                        <div className="text-[11px] text-[#547792] flex items-center gap-1 mt-1"><MapPin size={10} />{c.district} • {c.city}</div>
                        <div className="mt-2 flex gap-2">
                          <Link to={`/college/${c.slug}`} className="h-7 px-3 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold grid place-items-center">{t('view')}</Link>
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
                    <div className="text-[11px] mt-1">{colleges.length===0 ? 'No colleges yet to save' : t('saveHint')}</div>
                  </div>
                ) : savedColleges.map(c=>(
                  <div key={c.id} className="flex gap-3 p-3 rounded-[12px] bg-[#E8E2DB]/50 border">
                    <img src={c.branding?.logo || `https://ui-avatars.com/api/?name=${c.name}`} className="h-10 w-10 rounded-[10px] object-cover bg-white border" alt="Logo" />
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
                <div className="flex justify-between"><span className="text-[#E8E2DB]/70">{t('savedActivity')}</span><span className="font-bold">{activityTracker.getAllActivities().filter(a=>a.activity_type==='SAVE').length}</span></div>
                <div className="flex justify-between"><span className="text-[#E8E2DB]/70">{t('enquiriesConsent')}</span><span className="font-bold text-[#FAB95B]">{activityTracker.getAllActivities().filter(a=>a.activity_type==='ENQUIRY').length}</span></div>
              </div>
              <div className="mt-4 p-3 rounded-[12px] bg-white/5 border border-white/10 text-[11px] leading-[1.5] text-[#E8E2DB]/70">
                {t('privacyNote')}
              </div>
            </div>

            <div className="rounded-[24px] bg-white border-2 border-[#FAB95B]/30 p-6">
              <h3 className="font-bold text-[#1A3263]">Quick Links</h3>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link to="/search" className="flex items-center gap-2 p-3 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] hover:border-[#FAB95B] text-[12px] font-semibold text-[#1A3263]"><Search size={14} /> Explore Colleges</Link>
                <Link to="/student/profile" className="flex items-center gap-2 p-3 rounded-[12px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 text-[12px] font-semibold text-[#1A3263]"><Edit3 size={14} /> Edit Details</Link>
              </div>
              <div className="mt-4 rounded-[12px] bg-[#E8E2DB]/50 border p-3 text-[11px] text-[#547792]">
                No default colleges - Only colleges that signup via /college/signup and add details A-Z themselves appear. Chennai filter: preferredDistrict Chennai na Chennai colleges first matching your details.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
