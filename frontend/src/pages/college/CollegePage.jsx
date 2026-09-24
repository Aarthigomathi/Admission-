import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCollegeBySlug, getCollegeCustomData, getPublicColleges } from '../../lib/collegeStorage'
import CollegeHeader from '../../components/college/CollegeHeader'
import { MapPin, Phone, Mail, BadgeCheck, Building2, GraduationCap, Users, Award, Image as ImageIcon, X, BookOpen, FlaskConical, Briefcase, Landmark, ShieldCheck, PhoneCall, Trophy } from 'lucide-react'


function placementStats(placements) {
  const total = (placements || []).reduce((a, p) => a + (parseInt(p.students, 10) || 0), 0)
  const companies = (placements || []).length
  let highest = ''
  let highestNum = 0
  ;(placements || []).forEach(p => {
    const m = String(p.package || '').match(/[\d.]+/)
    if (m && parseFloat(m[0]) > highestNum) { highestNum = parseFloat(m[0]); highest = String(p.package) }
  })
  return { total, companies, highest, highestNum }
}

function scrollId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

function CollegeHero({ branding, college, placements, departments, courses, facilities }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const collegeImages = branding.collegeImages || college.branding?.collegeImages || []
  const allImages = []
  collegeImages.forEach(img => {
    if (img.url) allImages.push(img.url)
    else if (typeof img === 'string') allImages.push(img)
  })
  if (allImages.length === 0 && branding.heroImage) allImages.push(branding.heroImage)
  if (allImages.length === 0 && college.branding?.heroImage) allImages.push(college.branding.heroImage)

  useEffect(() => {
    if (allImages.length <= 1) return
    const interval = setInterval(() => setCurrentIdx(prev => (prev + 1) % allImages.length), 5000)
    return () => clearInterval(interval)
  }, [allImages.length])

  const stats = placementStats(placements)
  const heroStats = [
    { label: 'Departments', value: departments.length },
    { label: 'Programmes', value: courses.length },
    { label: 'Facilities', value: facilities.length },
    ...(stats.companies > 0 ? [{ label: 'Placements', value: stats.total || stats.companies }] : []),
  ]

  return (
    <div id="home" className="relative h-[540px] sm:h-[600px] lg:h-[660px] overflow-hidden bg-[#1A3263] group">
      {allImages.length > 0 ? allImages.map((img, idx) => (
        <img
          key={idx}
          src={img}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${idx === currentIdx ? 'opacity-100' : 'opacity-0'}`}
          alt={`${college.name} Campus ${idx+1}`}
        />
      )) : (
        <div className="h-full w-full bg-gradient-to-br from-[#1A3263] via-[#547792] to-[#1A3263]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A3263]/95 via-[#1A3263]/35 to-[#1A3263]/40" />

      {/* Top-right: placement stat tiles */}
      {stats.companies > 0 && (
        <div className="absolute top-5 right-4 sm:right-8 z-20 hidden md:flex gap-3">
          <div className="rounded-[14px] bg-[#1A3263]/85 backdrop-blur border border-white/15 px-5 py-4 text-center w-[150px]">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#FAB95B]">Placements</div>
            <div className="text-[30px] font-extrabold text-white leading-none mt-2">{stats.total || stats.companies}+</div>
            <div className="text-[10px] font-bold text-white/60 mt-2 uppercase">{stats.companies} companies</div>
          </div>
          <div className="rounded-[14px] bg-[#FAB95B] px-5 py-4 text-center w-[150px] shadow-xl">
            <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#1A3263]/70">Companies</div>
            <div className="text-[30px] font-extrabold text-[#1A3263] leading-none mt-2">{stats.companies}+</div>
            <div className="text-[10px] font-bold text-[#1A3263]/60 mt-2 uppercase">Visited campus</div>
          </div>
          {stats.highestNum > 0 && (
            <div className="rounded-[14px] bg-white px-5 py-4 text-center w-[150px] shadow-xl">
              <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#547792]">Highest Offer</div>
              <div className="text-[30px] font-extrabold text-[#1A3263] leading-none mt-2">{stats.highestNum}</div>
              <div className="text-[10px] font-bold text-[#547792]/80 mt-2 uppercase">LPA max</div>
            </div>
          )}
        </div>
      )}

      {/* Branding top-left */}
      <div className="absolute top-5 left-4 sm:left-8 z-20 max-w-[440px]">
        <div className="flex items-center gap-4">
          {branding.logo ? (
            <img src={branding.logo} className="h-16 w-16 sm:h-20 sm:w-20 rounded-[16px] object-cover border-4 border-[#FAB95B] bg-white shadow-xl shrink-0" alt={`${college.name} Logo`} />
          ) : (
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-[16px] bg-white border-4 border-[#FAB95B] grid place-items-center text-[#1A3263] font-extrabold text-[28px] shadow-xl shrink-0">{college.name?.[0] || 'C'}</div>
          )}
          <div className="min-w-0">
            <div className="text-white font-extrabold text-[22px] sm:text-[28px] leading-tight">{college.name}</div>
            <div className="text-[11px] sm:text-[12px] font-bold mt-1.5 flex items-center gap-2 flex-wrap">
              <span className="text-[#FAB95B]">{college.district} • {college.city}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#FAB95B] text-[#1A3263] text-[10px] font-extrabold">Est. {college.established}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left: white stat card */}
      <div className="absolute bottom-0 left-4 sm:left-8 z-20 w-[calc(100%-2rem)] sm:w-auto sm:max-w-[560px]">
        <div className="rounded-t-[20px] bg-white shadow-2xl px-4 sm:px-6 py-5 grid grid-cols-3 sm:grid-cols-4 divide-x divide-[#E8E2DB]">
          {heroStats.map((st, i) => (
            <div key={i} className="px-3 sm:px-4 text-center first:pl-0 last:pr-0">
              <div className="text-[24px] sm:text-[30px] font-extrabold text-[#1A3263] leading-none">{st.value}+</div>
              <div className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#547792] mt-2">{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom-right: CTA buttons */}
      <div className="absolute bottom-0 right-0 z-20 hidden lg:flex items-end gap-2 pr-8">
        {stats.companies > 0 && <button onClick={() => scrollId('placements')} className="h-11 px-5 rounded-t-[14px] bg-[#FAB95B] text-[#1A3263] text-[11px] font-extrabold uppercase tracking-wide shadow-xl hover:bg-[#FAB95B]/90 transition-colors">Placement</button>}
        <button onClick={() => scrollId('campus')} className="h-11 px-5 rounded-t-[14px] bg-[#1A3263]/80 backdrop-blur border border-white/15 text-white text-[11px] font-extrabold uppercase tracking-wide shadow-xl hover:bg-[#1A3263] transition-colors">Campus Life</button>
        <button onClick={() => scrollId('events')} className="h-11 px-5 rounded-t-[14px] bg-[#1A3263]/80 backdrop-blur border border-white/15 text-white text-[11px] font-extrabold uppercase tracking-wide shadow-xl hover:bg-[#1A3263] transition-colors">Events</button>
        <button onClick={() => scrollId('gallery')} className="h-11 px-5 rounded-t-[14px] bg-[#1A3263]/80 backdrop-blur border border-white/15 text-white text-[11px] font-extrabold uppercase tracking-wide shadow-xl hover:bg-[#1A3263] transition-colors">Gallery</button>
      </div>

      {/* carousel dots + arrows */}
      {allImages.length > 1 && (
        <>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {allImages.map((_, idx) => (
              <button key={idx} onClick={() => setCurrentIdx(idx)} className={`h-1.5 rounded-full transition-all ${idx === currentIdx ? 'w-7 bg-[#FAB95B]' : 'w-1.5 bg-white/50 hover:bg-white/80'}`} />
            ))}
          </div>
          <button onClick={() => setCurrentIdx(prev => (prev - 1 + allImages.length) % allImages.length)} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 backdrop-blur border border-white/20 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 z-20">‹</button>
          <button onClick={() => setCurrentIdx(prev => (prev + 1) % allImages.length)} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 backdrop-blur border border-white/20 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 z-20">›</button>
        </>
      )}
    </div>
  )
}

function CustomCollegePage({ college, customData }) {
  const [hodProfile, setHodProfile] = useState(null)
  const [progTab, setProgTab] = useState('All')
  const [selCourse, setSelCourse] = useState(null)
  const [selAchievement, setSelAchievement] = useState(null)
  const branding = customData.branding || college.branding || {}
  const departments = customData.departments || college.departments || []
  const courses = customData.courses || college.courses || []
  const facilities = customData.customFacilities || []
  const placements = customData.placements || []
  const gallery = customData.gallery || []
  const events = customData.events || []
  const announcements = customData.announcements || []
  const hostels = customData.hostels || []
  const about = customData.about || college.about || {}
  const management = customData.management || []
  const principal = customData.principal || customData.principalDetails || college.principal || null
  const researchCentres = customData.researchCentres || customData.research || []
  const accreditations = customData.accreditations || []
  const campusEnv = customData.campusEnvironment || customData.campus || []
  const library = customData.library || null
  const sports = customData.sports || []
  const admissions = customData.admissions || null
  const contactDetails = customData.contactDetails || customData.contacts || null
  const settings = customData.settings || null
  const alumni = customData.alumni || []
  const achievements = customData.achievements || []

  const hasContent = (arr) => arr && arr.length > 0

  // KCE-style page helpers
  const plStats = placementStats(placements)
  const isPGCourse = (c) => /(^|[^A-Z])M\.|mtech|m\.?sc\b|mba|mca|phd|m\.e/i.test(String(c.degree || ''))
  const ugcourses = courses.filter(c => !isPGCourse(c))
  const pgcourses = courses.filter(isPGCourse)
  const campusImages = (campusEnv[0]?.images || []).map(im => (typeof im === 'string' ? im : im.url)).filter(Boolean)
  const progBg = campusImages[0] || branding.heroImage || college.branding?.heroImage || ''
  const shortName = settings?.shortName || college.shortName || college.name?.split(' ')[0] || ''

  // HOD profile modal - close on Escape, lock body scroll while open
  useEffect(() => {
    if (!hodProfile) return
    const onKey = (e) => { if (e.key === 'Escape') setHodProfile(null) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [hodProfile])

  return (
    <div className="min-h-screen bg-[#E8E2DB]">
      <CollegeHeader college={{ ...college, branding: { ...college.branding, ...branding, logo: branding.logo || college.branding?.logo, heroImage: branding.heroImage || college.branding?.heroImage } }} />

      {/* Hero */}
      <CollegeHero branding={branding} college={college} placements={placements} departments={departments} courses={courses} facilities={facilities} />

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-12 space-y-12">
        {/* About - KCE style */}
        <section id="about" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <h2 className="text-[30px] sm:text-[36px] font-extrabold uppercase tracking-tight text-[#1A3263]">About Us</h2>
          <div className="mt-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-12 items-start">
            <div>
              {about.fullText ? (
                <p className="text-[14px] sm:text-[15px] leading-[1.9] text-[#1A3263]/80 whitespace-pre-wrap">{about.fullText}</p>
              ) : (
                <div className="py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed border-[#1A3263]/20">
                  <div className="text-3xl">📝</div>
                  <div className="font-bold text-[#1A3263] mt-3">About section not added yet</div>
                  <div className="text-[12px] text-[#547792] mt-2">College admin can add about, vision, mission in Admin → About</div>
                </div>
              )}
              {about.vision && (
                <div className="mt-6 rounded-[16px] bg-[#1A3263] text-white p-6">
                  <div className="font-extrabold text-[#FAB95B] uppercase text-[12px] tracking-[0.14em]">Vision</div>
                  <div className="text-[13px] text-[#E8E2DB]/85 mt-2 leading-[1.7]">{about.vision}</div>
                </div>
              )}
              {about.mission && about.mission.length>0 && (
                <div className="mt-4 rounded-[16px] bg-[#FAB95B]/15 border-2 border-[#FAB95B]/30 p-6">
                  <div className="font-extrabold text-[#1A3263] uppercase text-[12px] tracking-[0.14em]">Mission</div>
                  <div className="mt-3 space-y-2">
                    {about.mission.map((m,i)=><div key={i} className="flex gap-2.5 text-[13px] text-[#1A3263]"><span className="h-5 w-5 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[10px] font-bold shrink-0">{i+1}</span>{m}</div>)}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {campusImages[0] && <img src={campusImages[0]} className="w-full h-[280px] lg:h-[340px] object-cover rounded-[20px] border-2 border-[#E8E2DB]" alt={`${college.name} Campus`} />}
              {accreditations.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {accreditations.slice(0,6).map(acc => (
                    <div key={acc.id} className="rounded-[14px] border-2 border-[#E8E2DB] bg-white p-3 grid place-items-center h-[92px]">
                      {acc.image ? <img src={acc.image} className="max-h-[64px] max-w-full object-contain" alt={acc.name} /> : <div className="text-[10px] font-extrabold text-[#1A3263] text-center px-1 leading-tight">{acc.name}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Admissions - Real-time Working */}
        <section  id="admissions" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263] flex items-center gap-3"> Admissions {admissions ? `- ${admissions.academicYear}` : ''}</h2>
            {admissions && (
              <div className="flex gap-2">
                <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold border-2 ${admissions.status==='Open' ? 'bg-green-100 text-green-700 border-green-200' : admissions.status==='Closed' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-[#FAB95B]/20 text-[#1A3263] border-[#FAB95B]/30'}`}>{admissions.status} • {admissions.academicYear}</span>
                {admissions.totalSeats && <span className="px-3 py-1.5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold">{admissions.totalSeats}</span>}
              </div>
            )}
          </div>

          {admissions ? (
            <div className="mt-6 space-y-6">
              <div className="rounded-[20px] bg-[#1A3263] text-white p-6 lg:p-8">
                <div className="font-display text-[22px] font-bold text-[#FAB95B]">{admissions.title}</div>
                {admissions.description && <div className="text-[13px] text-[#E8E2DB]/90 mt-3 leading-[1.7] whitespace-pre-wrap">{admissions.description}</div>}
                {admissions.brochureImage && <img src={admissions.brochureImage} className="mt-6 rounded-[12px] h-[240px] w-full object-cover border-2 border-white/10" alt="Admissions Brochure" />}
              </div>

              {(admissions.applicationStart || admissions.applicationEnd || admissions.counsellingDate || admissions.lastDate) && (
                <div>
                  <h3 className="font-bold text-[16px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#FAB95B] text-[#1A3263] grid place-items-center text-[12px]">📅</span> Important Dates</h3>
                  <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {admissions.applicationStart && <div className="rounded-[12px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-4 text-center"><div className="text-[10px] font-bold uppercase text-[#547792]">Application Start</div><div className="font-bold text-[#1A3263] text-[13px] mt-1">{admissions.applicationStart}</div></div>}
                    {admissions.applicationEnd && <div className="rounded-[12px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-4 text-center"><div className="text-[10px] font-bold uppercase text-[#1A3263]">Application End</div><div className="font-bold text-[#1A3263] text-[13px] mt-1">{admissions.applicationEnd}</div></div>}
                    {admissions.counsellingDate && <div className="rounded-[12px] bg-[#1A3263] text-white p-4 text-center"><div className="text-[10px] font-bold uppercase text-[#FAB95B]">Counselling</div><div className="font-bold text-[13px] mt-1">{admissions.counsellingDate}</div></div>}
                    {admissions.lastDate && <div className="rounded-[12px] bg-white border-2 border-[#E8E2DB] p-4 text-center"><div className="text-[10px] font-bold uppercase text-[#547792]">Last Date</div><div className="font-bold text-[#1A3263] text-[13px] mt-1">{admissions.lastDate}</div></div>}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                {admissions.eligibility && (
                  <div className="rounded-[16px] border-2 border-[#E8E2DB] p-5 bg-white">
                    <div className="font-bold text-[13px] text-[#1A3263] flex items-center gap-2">✅ Eligibility Criteria</div>
                    <div className="text-[12px] text-[#1A3263]/80 mt-3 leading-[1.7] whitespace-pre-wrap">{admissions.eligibility}</div>
                  </div>
                )}
                {admissions.process && (
                  <div className="rounded-[16px] border-2 border-[#E8E2DB] p-5 bg-[#E8E2DB]/30">
                    <div className="font-bold text-[13px] text-[#1A3263] flex items-center gap-2">📝 Admission Process</div>
                    <div className="text-[12px] text-[#1A3263]/80 mt-3 leading-[1.7] whitespace-pre-wrap">{admissions.process}</div>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {admissions.fees && <div className="rounded-[12px] bg-white border-2 border-[#E8E2DB] p-4"><div className="text-[10px] font-bold uppercase text-[#547792]">Fees Structure</div><div className="font-bold text-[13px] text-[#1A3263] mt-1">{admissions.fees}</div></div>}
                {admissions.entranceExam && <div className="rounded-[12px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-4"><div className="text-[10px] font-bold uppercase text-[#1A3263]">Entrance Exam</div><div className="font-bold text-[13px] text-[#1A3263] mt-1">{admissions.entranceExam}</div></div>}
                {admissions.cutoff && <div className="rounded-[12px] bg-[#1A3263] text-white p-4"><div className="text-[10px] font-bold uppercase text-[#FAB95B]">Cutoff</div><div className="font-bold text-[13px] mt-1">{admissions.cutoff}</div></div>}
                {admissions.quota && <div className="rounded-[12px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-4"><div className="text-[10px] font-bold uppercase text-[#547792]">Quota / Reservation</div><div className="font-bold text-[13px] text-[#1A3263] mt-1">{admissions.quota}</div></div>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {admissions.documents && (
                  <div className="rounded-[16px] bg-white border-2 border-[#E8E2DB] p-6">
                    <div className="font-bold text-[14px] text-[#1A3263]">📄 Documents Required</div>
                    <div className="mt-4 space-y-2">
                      {admissions.documents.split('\n').filter(l=>l.trim()).map((line,i)=>{
                        const clean = line.replace(/^[•\-\*]\s*/, '').trim()
                        return <div key={i} className="flex gap-2.5 text-[12px] text-[#1A3263]/80 leading-[1.6]"><span className="h-1.5 w-1.5 rounded-full bg-[#547792] mt-[7px] shrink-0"></span><span>{clean}</span></div>
                      })}
                    </div>
                  </div>
                )}
                {admissions.scholarships && (
                  <div className="rounded-[16px] bg-[#FAB95B]/10 border-2 border-[#FAB95B]/30 p-6">
                    <div className="font-bold text-[14px] text-[#1A3263]">🎁 Scholarships</div>
                    <div className="mt-4 space-y-2">
                      {admissions.scholarships.split('\n').filter(l=>l.trim()).map((line,i)=>{
                        const clean = line.replace(/^[•\-\*]\s*/, '').trim()
                        return <div key={i} className="flex gap-2.5 text-[12px] text-[#1A3263]/80 leading-[1.6]"><span className="h-1.5 w-1.5 rounded-full bg-[#FAB95B] mt-[7px] shrink-0"></span><span>{clean}</span></div>
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-[16px] bg-[#1A3263] border-2 border-[#1A3263] p-6 flex flex-wrap items-center justify-between gap-4">
                <div className="text-white">
                  <div className="font-bold text-[#FAB95B]">Admission Enquiry</div>
                  <div className="text-[13px] text-[#E8E2DB]/80 mt-2 flex flex-wrap gap-4">
                    {admissions.contactPhone && <span>📞 {admissions.contactPhone}</span>}
                    {admissions.contactEmail && <span>✉️ {admissions.contactEmail}</span>}
                  </div>
                </div>
                <div className="flex gap-3">
                  {admissions.applicationLink && <a href={admissions.applicationLink} target="_blank" rel="noreferrer" className="h-11 px-6 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[13px] grid place-items-center">Apply Now →</a>}
                  <span className="h-11 px-5 rounded-full bg-white/10 border border-white/20 text-white text-[12px] font-bold grid place-items-center">ID {college.id} • {admissions.academicYear}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed border-[#1A3263]/20">
              <div className="text-3xl">🎓</div>
              <div className="font-bold text-[#1A3263] mt-3">Admissions - Real-time update pannalam</div>
              <div className="text-[12px] text-[#547792] mt-2 max-w-[500px] mx-auto">College admin can add admission status, dates, eligibility, process, fees, documents, cutoff, scholarships - students will see real-time on website</div>
              <div className="mt-4 inline-flex px-4 py-2 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold">Academic Year 2026-27 • Admissions Open / Closed</div>
            </div>
          )}
        </section>

        {/* Principal Section */}
        <section  id="principal" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-[#1A3263] border-2 border-[#1A3263] overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-[28px] font-extrabold uppercase tracking-tight text-white inline-block relative">
                Principal
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-12 bg-[#FAB95B] rounded-full"></span>
              </h2>
            </div>
            
            {principal && principal.name ? (
              <div className="grid md:grid-cols-[280px_1fr] gap-6 lg:gap-8 max-w-[1200px] mx-auto">
                {/* Left - Principal Image */}
                <div className="text-center md:text-left">
                  <div className="rounded-[12px] overflow-hidden border-2 border-white/10 shadow-xl bg-white">
                    {principal.image ? (
                      <img src={principal.image} className="w-full h-[320px] object-cover object-top" alt={principal.name} />
                    ) : (
                      <div className="w-full h-[320px] bg-gradient-to-br from-[#E8E2DB] to-[#547792] grid place-items-center text-[#1A3263] font-bold text-[48px]">{principal.name[0]}</div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <div className="font-bold text-[16px] text-white">{principal.name}</div>
                    {principal.designation && <div className="text-[13px] text-[#FAB95B] mt-1">{principal.designation}</div>}
                    <div className="text-[13px] text-white/80 mt-2 font-medium break-all">{principal.email || 'principal [at] college [dot] edu'}</div>
                    {principal.phone && <div className="text-[12px] text-white/60 mt-1">{principal.phone}</div>}
                    {principal.qualification && <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-[#FAB95B]/20 border border-[#FAB95B]/30 text-[#FAB95B] text-[11px] font-bold">{principal.qualification}</div>}
                    {principal.experience && <div className="mt-2 text-[11px] text-white/60">{principal.experience}</div>}
                  </div>
                </div>

                {/* Right - Biography */}
                <div className="rounded-[8px] bg-white p-6 lg:p-8 shadow-xl">
                  <div className="text-[13px] lg:text-[14px] leading-[1.8] text-[#1A3263]/90 space-y-4">
                    {principal.detailedBio ? (
                      <div className="whitespace-pre-wrap">{principal.detailedBio}</div>
                    ) : (
                      <>
                        {principal.message && <p>{principal.message}</p>}
                        {principal.qualification && <p><span className="font-bold">Qualification:</span> {principal.qualification} {principal.experience ? `with ${principal.experience} of experience` : ''}.</p>}
                        {principal.bio && <p>{principal.bio}</p>}
                        {!principal.message && !principal.bio && !principal.detailedBio && (
                          <p>{principal.name} is currently working as Principal, {college.name}, {college.city}, {college.district}. {principal.qualification ? `He has ${principal.experience || 'extensive'} experience in academic and research.` : ''}</p>
                        )}
                      </>
                    )}
                    {/* If detailedBio not provided but we have separate fields, show combined */}
                    {principal.research && <p>{principal.research}</p>}
                    {principal.publications && <p>{principal.publications}</p>}
                    {principal.awards && <p>{principal.awards}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-[800px] mx-auto py-16 text-center rounded-[16px] bg-white/5 border-2 border-dashed border-white/20">
                <div className="text-4xl">👨‍🏫</div>
                <div className="font-bold text-white mt-4 text-[18px]">Principal</div>
                <div className="text-[13px] text-white/60 mt-2 max-w-[500px] mx-auto">Principal information will be updated soon</div>
              </div>
            )}
          </div>
        </section>

        {/* Management Section */}
        <section  id="management" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263] flex items-center gap-3"><Users className="text-[#FAB95B]" /> Management & Trustees - {management.length}</h2>
          {hasContent(management) ? (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {management.map(member=>(
                <div key={member.id} className="rounded-[16px] border-2 border-[#E8E2DB] p-5 flex gap-4 hover:border-[#FAB95B]/40 transition-colors">
                  {member.image ? <img src={member.image} className="h-16 w-16 rounded-[12px] object-cover border-2 border-[#E8E2DB] shrink-0" alt={member.name} /> : <div className="h-16 w-16 rounded-[12px] bg-[#E8E2DB] grid place-items-center text-[#1A3263] font-bold text-[20px]">{member.name[0]}</div>}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#1A3263]">{member.name}</div>
                    <div className="mt-1 inline-flex px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-bold">{member.designation}</div>
                    <div className="text-[11px] text-[#547792] mt-2">{member.email} {member.phone ? `• ${member.phone}` : ''}</div>
                    <div className="text-[11px] text-[#1A3263]/60 mt-1">{member.description}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">Management information will be updated soon</div>
          )}
        </section>

        {/* Departments */}
        <section  id="departments" className="scroll-mt-[100px] lg:scroll-mt-[150px] space-y-6">
          <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6">
            <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263] flex items-center gap-3"><Building2 className="text-[#FAB95B]" /> Departments</h2>
          </div>

          {hasContent(departments) ? (
            <div className="space-y-6">
              {departments.map(dept=>(
                <div key={dept.id} className="rounded-[24px] bg-[#1A3263] border-2 border-[#1A3263] overflow-hidden">
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="font-display text-[24px] font-bold text-white inline-block relative">
                        {dept.name}
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-12 bg-[#FAB95B] rounded-full"></span>
                      </h3>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <span className="inline-flex px-3 py-1 rounded-full bg-[#FAB95B]/20 border border-[#FAB95B]/30 text-[#FAB95B] text-[11px] font-bold">HOD: {dept.hod}</span>
                        {dept.facultyCount && <span className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-[11px]">{dept.facultyCount} Faculty</span>}
                        {dept.hodQualification && <span className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-[11px]">{dept.hodQualification}</span>}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-[280px_1fr] gap-6 lg:gap-8 max-w-[1200px] mx-auto">
                      {/* Left - HOD Image (tap/click to read full profile) */}
                      <div className="text-center md:text-left">
                        <button type="button" onClick={() => setHodProfile(dept)} className="group relative block w-full cursor-pointer rounded-[12px] overflow-hidden border-2 border-white/10 shadow-xl bg-white focus:outline-none focus:ring-4 focus:ring-[#FAB95B]/60">
                          {(dept.hodImage || dept.image) ? (
                            <img src={dept.hodImage || dept.image} className="w-full h-[320px] object-cover object-top group-hover:scale-[1.03] transition-transform duration-300" alt={dept.hod} />
                          ) : (
                            <div className="w-full h-[320px] bg-gradient-to-br from-[#E8E2DB] to-[#547792] grid place-items-center text-[#1A3263] font-bold text-[48px]">{dept.hod ? dept.hod[0] : dept.name[0]}</div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#1A3263]/95 to-transparent flex items-end justify-center pb-2.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity pointer-events-none">
                            <span className="text-[#FAB95B] text-[11px] font-bold tracking-wide">Tap to read full bio →</span>
                          </div>
                        </button>
                        <div className="mt-4 text-center">
                          <div className="font-bold text-[16px] text-white">{dept.hod}</div>
                          <div className="text-[13px] text-[#FAB95B] mt-1">{dept.hodDesignation || `Head of Department - ${dept.name}`}</div>
                          <div className="text-[13px] text-white/80 mt-2 font-medium break-all">{dept.hodEmail || `${dept.hod ? dept.hod.toLowerCase().replace(/\s+/g,'') : 'hod'} [at] college [dot] edu`}</div>
                          {dept.hodPhone && <div className="text-[12px] text-white/60 mt-1">{dept.hodPhone}</div>}
                          {dept.hodQualification && <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-[#FAB95B]/20 border border-[#FAB95B]/30 text-[#FAB95B] text-[11px] font-bold">{dept.hodQualification}</div>}
                          {dept.hodExperience && <div className="mt-2 text-[11px] text-white/60">{dept.hodExperience}</div>}
                          {dept.facultyCount && <div className="mt-2 text-[11px] text-white/50">Faculty Count: {dept.facultyCount}</div>}
                        </div>
                      </div>

                      {/* Right - Biography */}
                      <div className="rounded-[8px] bg-white p-6 lg:p-8 shadow-xl">
                        <div className="text-[13px] lg:text-[14px] leading-[1.8] text-[#1A3263]/90 space-y-4">
                          {dept.hodDetailedBio ? (
                            <div className="whitespace-pre-wrap">{dept.hodDetailedBio}</div>
                          ) : dept.hodBio ? (
                            <div className="whitespace-pre-wrap">{dept.hodBio}</div>
                          ) : (
                            <>
                              {dept.description && <p><span className="font-bold">About {dept.name}:</span> {dept.description}</p>}
                              <p>{dept.hod} is currently working as {dept.hodDesignation || `Head of Department, ${dept.name}`} at {college.name}, {college.city}, {college.district}.</p>
                              {dept.facultyCount && <p><span className="font-bold">Department Strength:</span> {dept.facultyCount} faculty members with expertise in various domains of {dept.name}.</p>}
                            </>
                          )}
                          {dept.hodResearch && <p><span className="font-bold">Research:</span> {dept.hodResearch}</p>}
                          {dept.hodPublications && <p><span className="font-bold">Publications:</span> {dept.hodPublications}</p>}
                          {dept.hodAwards && <p><span className="font-bold">Awards:</span> {dept.hodAwards}</p>}
                        </div>

                        {/* Department extra info if bio exists */}
                        {dept.description && dept.hodDetailedBio && (
                          <div className="mt-8 pt-6 border-t-2 border-[#E8E2DB]">
                            <div className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><Building2 size={16} className="text-[#FAB95B]" /> About {dept.name} Department</div>
                            <div className="text-[13px] text-[#547792] mt-3 leading-[1.7]">{dept.description}</div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {dept.facultyCount && <span className="px-3 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[11px] font-bold">Faculty: {dept.facultyCount}</span>}
                              {dept.image && <span className="px-3 py-1 rounded-full bg-[#FAB95B]/20 text-[#1A3263] text-[11px] font-bold">Dept Image Available</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8 py-16 text-center">
              <div className="text-4xl">🏛️</div>
              <div className="font-bold text-[#1A3263] mt-4 text-[18px]">Departments</div>
              <div className="text-[13px] text-[#547792] mt-2 max-w-[600px] mx-auto">Departments information will be updated soon</div>
            </div>
          )}
        </section>

      </div>

      {/* Programmes for You - KCE dark section */}
      <section id="programmes" className="scroll-mt-[100px] lg:scroll-mt-[150px] relative bg-[#1A3263] py-14 sm:py-20 overflow-hidden">
        {progBg && <img src={progBg} className="absolute inset-0 h-full w-full object-cover opacity-25" alt="" />}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A3263]/85 via-[#1A3263]/60 to-[#1A3263]/95" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
          <h2 className="text-[30px] sm:text-[38px] font-extrabold uppercase tracking-tight text-white">Programmes <span className="text-[#FAB95B]">for You</span></h2>
          {hasContent(courses) ? (
            <div className="mt-10 grid lg:grid-cols-[360px_1fr] gap-6 lg:gap-10 items-start">
              <div className="rounded-[20px] bg-[#FAB95B] p-6 lg:p-7">
                {[['All', 'All Programmes'], ['UG', 'UG Programmes'], ['PG', 'PG Programmes']].map(([key, label]) => (
                  <button key={key} onClick={() => { setProgTab(key); setSelCourse(null) }} className={`block w-full text-left px-4 py-3 rounded-[12px] text-[15px] transition-colors ${progTab === key ? 'font-extrabold text-[#1A3263] underline underline-offset-4 decoration-2' : 'font-semibold text-[#1A3263]/70 hover:bg-[#1A3263]/5'}`}>
                    {label}
                  </button>
                ))}
                <p className="text-[12px] text-[#1A3263]/70 mt-4 leading-[1.7] px-2">Explore {shortName}'s programmes that combine academic excellence with practical learning, empowering students to build successful futures.</p>
              </div>
              <div className="space-y-8">
                {(progTab === 'All' || progTab === 'UG') && ugcourses.length > 0 && (
                  <div>
                    <h3 className="text-white font-extrabold uppercase text-[14px] tracking-[0.12em] mb-3">UG Programmes</h3>
                    <div className="space-y-1.5">
                      {ugcourses.map(c => (
                        <button key={c.id} onClick={() => setSelCourse(selCourse?.id === c.id ? null : c)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-left transition-colors ${selCourse?.id === c.id ? 'bg-white/15 border border-[#FAB95B]/50' : 'border border-transparent hover:bg-white/10'}`}>
                          <span className="text-[#FAB95B] font-bold text-[15px]">›</span>
                          <span className="text-[14px] font-semibold text-white flex-1">{c.degree} {c.name}</span>
                          {c.duration && <span className="text-[10px] font-bold text-white/50 hidden sm:block">{c.duration}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {(progTab === 'All' || progTab === 'PG') && pgcourses.length > 0 && (
                  <div>
                    <h3 className="text-white font-extrabold uppercase text-[14px] tracking-[0.12em] mb-3">PG Programmes</h3>
                    <div className="space-y-1.5">
                      {pgcourses.map(c => (
                        <button key={c.id} onClick={() => setSelCourse(selCourse?.id === c.id ? null : c)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-left transition-colors ${selCourse?.id === c.id ? 'bg-white/15 border border-[#FAB95B]/50' : 'border border-transparent hover:bg-white/10'}`}>
                          <span className="text-[#FAB95B] font-bold text-[15px]">›</span>
                          <span className="text-[14px] font-semibold text-white flex-1">{c.degree} {c.name}</span>
                          {c.duration && <span className="text-[10px] font-bold text-white/50 hidden sm:block">{c.duration}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {selCourse && (
                  <div className="rounded-[18px] bg-white/10 border border-white/15 p-5 sm:p-6">
                    <div className="font-extrabold text-[16px] text-white">{selCourse.degree} - {selCourse.name}</div>
                    <div className="mt-4 grid sm:grid-cols-3 gap-3">
                      <div className="rounded-[12px] bg-[#1A3263]/70 border border-white/10 p-3.5"><div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#FAB95B]">Duration</div><div className="text-white/85 mt-1 text-[12.5px] font-semibold">{selCourse.duration || '—'}</div></div>
                      <div className="rounded-[12px] bg-[#1A3263]/70 border border-white/10 p-3.5"><div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#FAB95B]">Fees</div><div className="text-white/85 mt-1 text-[12.5px] font-semibold">{selCourse.fees || '—'}</div></div>
                      <div className="rounded-[12px] bg-[#1A3263]/70 border border-white/10 p-3.5"><div className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#FAB95B]">Intake</div><div className="text-white/85 mt-1 text-[12.5px] font-semibold">{selCourse.intake || '—'}</div></div>
                    </div>
                    {selCourse.eligibility && <div className="mt-3.5 text-[12px] text-white/70 leading-[1.6]"><span className="font-extrabold text-[#FAB95B]">Eligibility:</span> {selCourse.eligibility}</div>}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8 py-14 text-center rounded-[20px] bg-white/5 border-2 border-dashed border-white/20">
              <div className="text-3xl">🎓</div>
              <div className="font-extrabold text-white mt-3 uppercase tracking-wide">Programmes</div>
              <div className="text-[12px] text-white/50 mt-2">Programmes information will be updated soon</div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-12 space-y-12">

        {/* Facilities */}
        <section  id="facilities" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263]">Facilities - {facilities.length}</h2>
          {hasContent(facilities) ? (
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {facilities.map(f=>(
                <div key={f.id} className="rounded-[16px] border-2 border-[#E8E2DB] overflow-hidden">
                  {f.image && <img src={f.image} className="h-[140px] w-full object-cover" alt={f.name} />}
                  <div className="p-4"><div className="font-bold text-[#1A3263] text-[13px]">{f.name}</div><div className="text-[11px] text-[#547792] mt-1">{f.description}</div></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">Facilities information will be updated soon</div>
          )}
        </section>

        {/* Research & Centres */}
        <section  id="centres" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263] flex items-center gap-3"> Research & Centres - {researchCentres.length}</h2>
          {hasContent(researchCentres) ? (
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              {researchCentres.map(rc=>(
                <div key={rc.id} className="rounded-[20px] border-2 border-[#E8E2DB] overflow-hidden bg-white hover:border-[#FAB95B]/40 transition-colors">
                  {rc.image && <img src={rc.image} className="h-[180px] w-full object-cover" alt={rc.name} />}
                  <div className="p-5">
                    <div className="font-bold text-[16px] text-[#1A3263]">{rc.name}</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-bold">{rc.type}</span>
                      {rc.year && <span className="px-3 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[11px]">{rc.year}</span>}
                      {rc.funding && <span className="px-3 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px]">{rc.funding}</span>}
                    </div>
                    {rc.coordinator && <div className="text-[12px] text-[#547792] mt-3"><span className="font-bold text-[#1A3263]">Coordinator:</span> {rc.coordinator}</div>}
                    {rc.description && <div className="text-[12px] text-[#1A3263]/80 mt-3 leading-[1.6]">{rc.description}</div>}
                    {rc.facilities && <div className="mt-3 rounded-[10px] bg-[#E8E2DB]/50 border border-[#E8E2DB] p-3 text-[11px] text-[#547792]"><span className="font-bold text-[#1A3263]">Facilities:</span> {rc.facilities}</div>}
                    {rc.achievements && <div className="mt-2 rounded-[10px] bg-[#1A3263] text-white p-3 text-[11px]"><span className="font-bold text-[#FAB95B]">Achievements:</span> <span className="text-[#E8E2DB]/80">{rc.achievements}</span></div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">Research centres information will be updated soon</div>
          )}
        </section>

        {/* Accreditation */}
        <section  id="accreditation" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263] flex items-center gap-3"> Accreditation - {accreditations.length}</h2>
          {hasContent(accreditations) ? (
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accreditations.map(acc=>(
                <div key={acc.id} className="rounded-[16px] border-2 border-[#FAB95B]/30 bg-[#FAB95B]/10 p-5 hover:border-[#FAB95B]/60 transition-colors">
                  <div className="flex gap-3">
                    {acc.image ? <img src={acc.image} className="h-16 w-16 rounded-[10px] object-cover border-2 border-white bg-white shadow" alt={acc.name} /> : <div className="h-16 w-16 rounded-[10px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-bold text-[20px]">{acc.name[0]}</div>}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-[14px] text-[#1A3263]">{acc.name}</div>
                      <div className="mt-1 inline-flex px-3 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold">{acc.grade}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 text-[11px] text-[#1A3263]/80">
                    {acc.agency && <div><span className="font-bold">Agency:</span> {acc.agency}</div>}
                    <div><span className="font-bold">Year:</span> {acc.year} {acc.validTill && `• Valid till ${acc.validTill}`}</div>
                    {acc.description && <div className="mt-2 text-[11px] leading-[1.5]">{acc.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">Accreditation information will be updated soon</div>
          )}
        </section>

        {/* Campus & Environment */}
        <section  id="campus" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263] flex items-center gap-3"> Campus & Environment - {campusEnv.length}</h2>
          {hasContent(campusEnv) ? (
            <div className="mt-6 space-y-6">
              {campusEnv.map(c=>(
                <div key={c.id} className="rounded-[20px] border-2 border-[#E8E2DB] overflow-hidden bg-white">
                  {c.images && c.images.length>0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1 bg-[#E8E2DB]">
                      {c.images.slice(0,4).map((img,i)=><img key={i} src={img.url||img} className="h-[140px] w-full object-cover rounded-[8px]" alt={c.title} />)}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="font-bold text-[18px] text-[#1A3263]">{c.title} {c.area && <span className="text-[#FAB95B]">• {c.area}</span>}</div>
                    {c.description && <div className="text-[13px] text-[#1A3263]/80 mt-3 leading-[1.7]">{c.description}</div>}
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      {c.environment && <div className="rounded-[12px] bg-[#1A3263] text-white p-4"><div className="font-bold text-[#FAB95B] text-[12px]">Environment</div><div className="text-[12px] text-[#E8E2DB]/80 mt-2 leading-[1.6]">{c.environment}</div></div>}
                      {c.greenInitiatives && <div className="rounded-[12px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-4"><div className="font-bold text-[#1A3263] text-[12px]">Green Initiatives</div><div className="text-[12px] text-[#1A3263]/80 mt-2 leading-[1.6]">{c.greenInitiatives}</div></div>}
                    </div>
                    {c.facilities && <div className="mt-4 text-[12px] text-[#547792]"><span className="font-bold text-[#1A3263]">Facilities:</span> {c.facilities}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">Campus & Environment information will be updated soon</div>
          )}
        </section>

        {/* Library */}
        <section  id="library" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263] flex items-center gap-3"> Library</h2>
          {library ? (
            <div className="mt-6 rounded-[20px] border-2 border-[#E8E2DB] overflow-hidden bg-white">
              <div className="grid md:grid-cols-[320px_1fr] gap-0">
                {library.image && <img src={library.image} className="h-[280px] md:h-full w-full object-cover" alt="Library" />}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {library.totalBooks && <div className="rounded-[12px] bg-[#1A3263] text-white p-4 text-center"><div className="font-bold text-[20px] text-[#FAB95B]">{library.totalBooks}</div><div className="text-[11px] text-white/70 uppercase">Books</div></div>}
                    {library.journals && <div className="rounded-[12px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-4 text-center"><div className="font-bold text-[14px] text-[#1A3263]">{library.journals}</div><div className="text-[11px] text-[#547792] uppercase">Journals</div></div>}
                  </div>
                  {library.digitalResources && <div className="mt-4 rounded-[10px] bg-[#E8E2DB]/50 p-3 text-[12px]"><span className="font-bold text-[#1A3263]">Digital:</span> {library.digitalResources}</div>}
                  {library.timings && <div className="mt-2 text-[12px] text-[#547792]"><span className="font-bold text-[#1A3263]">Timings:</span> {library.timings} {library.librarian && `• Librarian: ${library.librarian}`}</div>}
                  {library.description && <div className="text-[13px] text-[#1A3263]/80 mt-4 leading-[1.7]">{library.description}</div>}
                  {library.facilities && <div className="mt-3 rounded-[10px] bg-[#1A3263]/5 border border-[#E8E2DB] p-3 text-[11px] text-[#547792]"><span className="font-bold text-[#1A3263]">Facilities:</span> {library.facilities}</div>}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">Library information will be updated soon</div>
          )}
        </section>

        {/* Sports */}
        <section  id="sports" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263] flex items-center gap-3"> Sports - {sports.length}</h2>
          {hasContent(sports) ? (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {sports.map(s=>(
                <div key={s.id} className="rounded-[16px] border-2 border-[#E8E2DB] overflow-hidden bg-white hover:border-[#FAB95B]/40">
                  {s.image && <img src={s.image} className="h-[160px] w-full object-cover" alt={s.name} />}
                  <div className="p-4">
                    <div className="font-bold text-[14px] text-[#1A3263]">{s.name} {s.coach && <span className="text-[#547792] font-normal">• Coach {s.coach}</span>}</div>
                    {s.description && <div className="text-[12px] text-[#1A3263]/70 mt-2 leading-[1.6]">{s.description}</div>}
                    {s.facilities && <div className="mt-2 text-[11px] text-[#547792]"><span className="font-bold">Facilities:</span> {s.facilities}</div>}
                    {s.achievements && <div className="mt-2 rounded-[8px] bg-[#FAB95B]/20 p-2 text-[11px] text-[#1A3263]"><span className="font-bold">Achievements:</span> {s.achievements}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">Sports information will be updated soon</div>
          )}
        </section>

        {/* Hostel with Images */}
        <section  id="hostels" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263] flex items-center gap-3"> Hostel - {hostels.length}</h2>
          {hasContent(hostels) ? (
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              {hostels.map(h=>(
                <div key={h.id} className="rounded-[20px] border-2 border-[#E8E2DB] overflow-hidden bg-white hover:border-[#FAB95B]/40 transition-colors">
                  {(h.images && h.images.length>0) && (
                    <div className="relative">
                      <div className="grid grid-cols-3 gap-1 p-1 bg-[#E8E2DB]">
                        {h.images.slice(0,6).map((img, i)=>(
                          <img key={i} src={img.url || img} className="h-[110px] w-full object-cover rounded-[8px]" alt={`${h.name} ${i+1}`} />
                        ))}
                      </div>
                      {h.images.length>1 && <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px] font-bold">{h.images.length} Photos</div>}
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <div className="font-bold text-[16px] text-[#1A3263]">{h.name}</div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${h.type==='Girls' ? 'bg-pink-100 text-pink-700 border border-pink-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>{h.type}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {h.capacity && <span className="px-3 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[11px] font-bold">Capacity: {h.capacity}</span>}
                      {h.fees && <span className="px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-bold">{h.fees}</span>}
                    </div>
                    {h.facilities && <div className="mt-3 text-[12px] text-[#547792]"><span className="font-bold text-[#1A3263]">Facilities:</span> {h.facilities}</div>}
                    {h.description && (
                      <div className="mt-4 rounded-[12px] bg-[#E8E2DB]/50 border border-[#E8E2DB] p-4">
                        <div className="font-bold text-[11px] uppercase tracking-wide text-[#1A3263] mb-2">Hostel Details:</div>
                        <div className="space-y-2">
                          {h.description.split('\n').filter(l=>l.trim()).map((line, idx)=>{
                            const clean = line.replace(/^[•\-\*]\s*/, '').trim()
                            if (!clean) return null
                            return (
                              <div key={idx} className="flex gap-2.5 text-[12px] leading-[1.6] text-[#1A3263]/80">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#547792] mt-[7px] shrink-0"></span>
                                <span>{clean}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">Hostel information will be updated soon</div>
          )}
        </section>

      </div>

      {/* Placement & Training - KCE dark section */}
      <section id="placements" className="scroll-mt-[100px] lg:scroll-mt-[150px] relative bg-[#1A3263] py-14 sm:py-20 overflow-hidden">
        {progBg && <img src={progBg} className="absolute inset-0 h-full w-full object-cover opacity-20" alt="" />}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A3263]/95 via-[#1A3263]/80 to-[#1A3263]/95" />
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-[30px] sm:text-[38px] font-extrabold uppercase tracking-tight text-white">Placement & Training</h2>
              <p className="mt-5 text-[13.5px] leading-[1.9] text-[#E8E2DB]/80 max-w-[560px]">
                {hasContent(placements) ? `The placement cell of ${college.name} takes immense effort in guiding students for successful careers. The college is visited by ${plStats.companies}+ companies year after year and has a strong placement record with ${plStats.total}+ student placements.` : 'The placement cell takes immense effort in guiding students for their successful careers. Placement records will be updated by the college admin.'}
              </p>
              <button onClick={() => scrollId('placement-records')} className="mt-7 h-12 px-7 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#FAB95B]/90 transition-colors">View Records →</button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-[16px] bg-white/5 border border-white/15 p-5 text-center">
                <div className="text-[30px] sm:text-[36px] font-extrabold text-white leading-none">{plStats.total || plStats.companies}+</div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E8E2DB]/60 mt-3">Placements</div>
              </div>
              <div className="rounded-[16px] bg-white/5 border border-white/15 p-5 text-center">
                <div className="text-[30px] sm:text-[36px] font-extrabold text-white leading-none">{plStats.companies}+</div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#E8E2DB]/60 mt-3">Companies</div>
              </div>
              <div className="rounded-[16px] bg-[#FAB95B] p-5 text-center shadow-xl">
                <div className="text-[30px] sm:text-[36px] font-extrabold text-[#1A3263] leading-none">{plStats.highestNum || '—'}</div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#1A3263]/60 mt-3">LPA Max</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry & College - KCE logo grid */}
      {hasContent(placements) && (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <h2 className="text-center text-[26px] sm:text-[32px] font-extrabold uppercase tracking-tight text-[#1A3263]">Industry & {shortName}</h2>
            <div className="mt-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
              {placements.map(p => (
                <div key={p.id} className="h-[84px] rounded-[10px] border-2 border-[#E8E2DB] bg-white grid place-items-center p-3 hover:border-[#FAB95B]/60 transition-colors">
                  {p.logo ? <img src={p.logo} className="max-h-[52px] max-w-full object-contain" alt={p.company} /> : <div className="text-[11px] font-extrabold text-[#1A3263] text-center leading-tight px-1">{p.company}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 pt-12 space-y-12">
        {/* Placement Records */}
        <section id="placement-records" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-8">
          <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263]">Placement Records - {placements.length}</h2>
{hasContent(placements) ? (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {placements.map(p=>(
                <div key={p.id} className="flex gap-4 p-4 rounded-[16px] border-2 border-[#E8E2DB] bg-[#E8E2DB]/20 hover:border-[#FAB95B]/40 transition-colors">
                  {p.logo ? <img src={p.logo} className="h-16 w-16 rounded-[12px] object-contain bg-white border-2 border-[#E8E2DB] p-2 shrink-0" alt={p.company} /> : <div className="h-16 w-16 rounded-[12px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-bold text-[20px] shrink-0">{p.company[0]}</div>}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#1A3263] text-[14px]">{p.company}</div>
                    <div className="text-[11px] text-[#547792] mt-1 flex flex-wrap gap-1.5 items-center">
                      {p.year && <span className="px-2 py-0.5 rounded-full bg-white border text-[10px]">{p.year}</span>}
                      {p.package && <span className="px-2.5 py-0.5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px] font-bold">{p.package}</span>}
                      {p.students && <span className="px-2 py-0.5 rounded-full bg-[#FAB95B]/20 text-[#1A3263] text-[10px]">{p.students} students</span>}
                      {p.department && <span className="px-2 py-0.5 rounded-full bg-[#E8E2DB] text-[10px]">{p.department}</span>}
                    </div>
                    {p.description && <div className="text-[11px] text-[#1A3263]/60 mt-2 line-clamp-2">{p.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">Placement information will be updated soon</div>
          )}
        </section>

        {/* Gallery */}
        <section  id="gallery" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263] flex items-center gap-2"><ImageIcon className="text-[#FAB95B]" /> Gallery - {gallery.length} Images</h2>
          {hasContent(gallery) ? (
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {gallery.map(img=>(
                <div key={img.id} className="rounded-[12px] overflow-hidden border-2 border-[#E8E2DB]">
                  <img src={img.url} className="h-[180px] w-full object-cover" alt={img.caption} />
                  <div className="p-3 text-[11px] font-medium text-[#1A3263] bg-[#E8E2DB]/30">{img.caption}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed">
              <div className="font-bold text-[#1A3263] mt-3">Gallery</div>
              <div className="text-[11px] text-[#547792] mt-1">Gallery will be updated soon</div>
            </div>
          )}
        </section>

        {/* Alumni Success Stories - KCE style */}
        <section id="alumni" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10 overflow-hidden">
          <h2 className="text-center text-[30px] sm:text-[36px] font-extrabold uppercase tracking-tight text-[#1A3263]">Alumni Success Stories</h2>
          {hasContent(alumni) ? (
            <div className="mt-10 overflow-x-auto pb-6">
              <div className="flex justify-center items-center min-w-fit px-4">
                {alumni.slice(0, 7).map((a, i) => {
                  const arr = alumni.slice(0, 7)
                  const mid = Math.floor((arr.length - 1) / 2)
                  const dist = Math.abs(i - mid)
                  return (
                    <div key={a.id} className={`shrink-0 transition-all duration-300 ${i > 0 ? '-ml-4 sm:-ml-8' : ''}`} style={{ transform: `scale(${dist === 0 ? 1 : dist === 1 ? 0.92 : dist === 2 ? 0.84 : 0.76})`, zIndex: 20 - dist }}>
                      <div className="w-[190px] sm:w-[210px] rounded-[16px] overflow-hidden border-2 border-[#E8E2DB] bg-white shadow-xl hover:shadow-2xl transition-shadow">
                        <div className="relative h-[230px] sm:h-[270px] bg-[#E8E2DB]">
                          {a.image ? <img src={a.image} className="h-full w-full object-cover object-top grayscale" alt={a.name} /> : <div className="h-full w-full grid place-items-center bg-gradient-to-br from-[#E8E2DB] to-[#547792] text-[#1A3263] font-extrabold text-[44px]">{a.name?.[0] || 'A'}</div>}
                          {a.company && <div className="absolute top-3 right-3 px-2.5 py-1 rounded-[10px] bg-white/90 backdrop-blur text-[10px] font-extrabold text-[#1A3263] shadow">{a.company}</div>}
                        </div>
                        <div className="p-4 text-center">
                          <div className="font-extrabold text-[14px] text-[#1A3263] leading-tight">{a.name}</div>
                          {a.designation && <div className="text-[11px] font-bold text-[#547792] mt-1.5">{a.designation}</div>}
                          <div className="text-[10.5px] text-[#547792]/80 mt-1">{a.company}{a.batch ? ` • ${a.batch}` : ''}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="mt-8 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed">
              <div className="text-3xl">🎓</div>
              <div className="font-extrabold text-[#1A3263] mt-3 uppercase tracking-wide">Alumni Success Stories</div>
              <div className="text-[12px] text-[#547792] mt-2">Alumni will be updated soon</div>
            </div>
          )}
        </section>

        {/* Students Achievements - KCE style */}
        <section id="achievements" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <h2 className="text-[30px] sm:text-[36px] font-extrabold uppercase tracking-tight text-[#1A3263]">Students Achievements</h2>
          {hasContent(achievements) ? (
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {achievements.slice(0, 8).map(ach => (
                <div key={ach.id} onClick={() => setSelAchievement(ach)} className="relative rounded-[20px] overflow-hidden border-2 border-[#E8E2DB] h-[360px] group cursor-pointer">
                  {ach.image ? <img src={ach.image} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" alt={ach.title} /> : <div className="absolute inset-0 bg-gradient-to-br from-[#1A3263] to-[#547792] grid place-items-center text-[#FAB95B]"><Trophy size={44} /></div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A3263]/95 via-[#1A3263]/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="font-extrabold text-white text-[14px] leading-snug">{ach.title}</div>
                    <button onClick={(e) => { e.stopPropagation(); setSelAchievement(ach) }} className="mt-3 h-9 px-5 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-extrabold uppercase tracking-wide hover:bg-[#FAB95B]/90 transition-colors">Know More →</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed">
              <div className="text-3xl">🏆</div>
              <div className="font-extrabold text-[#1A3263] mt-3 uppercase tracking-wide">Students Achievements</div>
              <div className="text-[12px] text-[#547792] mt-2">Achievements will be updated soon</div>
            </div>
          )}
        </section>

        {/* Events with Images - 5 Categories */}
        <section  id="events" className="scroll-mt-[100px] lg:scroll-mt-[150px] rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-10">
          <h2 className="text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263] flex items-center gap-3"> Events - {events.length} - Category Wise</h2>
          <p className="text-[12px] text-[#547792] mt-2">Cultural, Technical, Sports, College Day, Social Awareness - details college neenga add pannalam</p>
          {hasContent(events) ? (
            <div className="mt-8 space-y-10">
              {['Cultural / Arts Events','Technical / Academic Events','Sports Events','College / Student Events','Social / Awareness Events'].map(cat=>{
                const catEvents = events.filter(ev=> (ev.category||'Cultural / Arts Events')===cat)
                if (catEvents.length===0) return null
                const icons = {
                  'Cultural / Arts Events': '🎭',
                  'Technical / Academic Events': '💻',
                  'Sports Events': '⚽',
                  'College / Student Events': '🎓',
                  'Social / Awareness Events': '🌱'
                }
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-[12px] bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[18px]">{icons[cat]||'📅'}</div>
                      <div>
                        <h3 className="font-display text-[18px] font-bold text-[#1A3263]">{cat}</h3>
                        <div className="text-[11px] text-[#547792]">{catEvents.length} events</div>
                      </div>
                      <div className="flex-1 h-[1px] bg-[#E8E2DB] ml-4"></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {catEvents.map(ev=>(
                        <div key={ev.id} className="rounded-[20px] border-2 border-[#E8E2DB] overflow-hidden bg-white hover:border-[#FAB95B]/40 transition-colors shadow-sm">
                          {ev.image && <img src={ev.image} className="h-[200px] w-full object-cover" alt={ev.title} />}
                          <div className="p-5">
                            <div className="font-bold text-[15px] text-[#1A3263]">{ev.title}</div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {ev.date && <span className="px-3 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[11px] font-bold">📅 {ev.date}</span>}
                              <span className="px-3 py-1 rounded-full bg-[#FAB95B]/20 text-[#1A3263] text-[10px] font-bold border border-[#FAB95B]/30">{ev.category}</span>
                            </div>
                            {ev.description && <div className="mt-3 text-[12px] text-[#1A3263]/80 leading-[1.7] whitespace-pre-wrap">{ev.description}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">
              <div className="text-3xl">📅</div>
              <div className="font-bold text-[#1A3263] mt-3">Events - 5 Categories</div>
              <div className="text-[11px] mt-2">Cultural / Arts, Technical / Academic, Sports, College / Student (College Day), Social / Awareness - College admin can add with images</div>
            </div>
          )}
        </section>

        {/* Latest News + Upcoming Events - KCE style */}
        <section className="grid lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">
          <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FAB95B] flex items-center gap-2"><span className="h-[2px] w-6 bg-[#FAB95B]"></span>Discover {shortName}</div>
                <h2 className="mt-2 text-[26px] sm:text-[30px] font-extrabold uppercase tracking-tight text-[#1A3263]">Latest News</h2>
              </div>
              {announcements.length > 0 && <span className="text-[14px] font-extrabold text-[#1A3263]">{String(announcements.length).padStart(2, '0')} News</span>}
            </div>
            {hasContent(announcements) ? (
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                {announcements.slice(0, 6).map((an, i) => (
                  <div key={i} className="rounded-[18px] border-2 border-[#E8E2DB] overflow-hidden hover:border-[#FAB95B]/50 transition-colors">
                    <div className="h-[110px] bg-gradient-to-br from-[#1A3263] to-[#547792] relative grid place-items-center">
                      <div className="text-center text-white px-4">
                        <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#FAB95B]">{an.category || 'Announcement'}</div>
                        {an.date && <div className="text-[11px] text-white/70 mt-1 font-semibold">{an.date}</div>}
                      </div>
                      <div className="absolute bottom-3 left-3 h-9 w-9 rounded-[10px] bg-[#FAB95B] grid place-items-center text-[#1A3263] font-extrabold text-[11px]">{String(i + 1).padStart(2, '0')}</div>
                    </div>
                    <div className="p-4">
                      <div className="font-bold text-[13.5px] text-[#1A3263] leading-snug">{an.title}</div>
                      {an.description && <div className="text-[11.5px] text-[#547792] mt-2 line-clamp-2 leading-[1.6]">{an.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">News & announcements will be updated soon</div>
            )}
          </div>
          <div className="rounded-[24px] bg-[#1A3263] p-6 sm:p-7">
            <h3 className="text-white font-extrabold uppercase tracking-tight text-[20px]">Upcoming Events</h3>
            <div className="mt-2 h-[3px] w-12 bg-[#FAB95B] rounded-full"></div>
            {hasContent(events) ? (
              <div className="mt-5 space-y-3.5">
                {events.slice(0, 5).map((ev, i) => {
                  const d = ev.date ? new Date(ev.date) : null
                  const valid = d && !isNaN(d.getTime())
                  return (
                    <div key={ev.id || i} className="flex gap-3 items-center">
                      <div className="h-[52px] w-[52px] rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center shrink-0 text-center leading-none py-1">
                        {valid ? (<><div className="text-[9px] font-extrabold uppercase">{d.toLocaleString('en', { month: 'short' })}</div><div className="text-[18px] font-extrabold mt-0.5">{d.getDate()}</div></>) : (<span className="text-[16px]">📅</span>)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[12.5px] font-bold text-white leading-snug line-clamp-2">{ev.title}</div>
                        {ev.date && <div className="text-[10.5px] text-[#FAB95B] font-semibold mt-1">{ev.date}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="mt-5 py-8 text-center rounded-[14px] bg-white/5 border-2 border-dashed border-white/15 text-[12px] text-white/50">Upcoming events will be updated soon</div>
            )}
          </div>
        </section>

      </div>

      {/* Quick Links - KCE style */}
      <section className="bg-white border-t-2 border-[#E8E2DB]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-9">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-[#E8E2DB] border-2 border-[#E8E2DB] rounded-[16px] overflow-hidden">
            {[
              { label: 'Vidya Lakshmi Portal', icon: Landmark, href: 'https://vidyalakshmi.gov.in' },
              { label: 'National Digital Library', icon: BookOpen, href: 'https://ndl.in' },
              { label: 'Anna University', icon: GraduationCap, href: 'https://annauniv.edu' },
              { label: 'Anti Ragging Committee', icon: ShieldCheck, href: 'https://antiraggingccimc.in' },
              { label: 'Admission Enquiries', icon: PhoneCall, href: '#admissions' },
            ].map((q, i) => (
              <a key={i} href={q.href} {...(q.href.startsWith('#') ? {} : { target: '_blank', rel: 'noreferrer' })}
                 onClick={(e) => { if (q.href.startsWith('#')) { e.preventDefault(); scrollId(q.href.slice(1)) } }}
                 className="flex flex-col items-center justify-center gap-3 py-6 text-center bg-white hover:bg-[#E8E2DB]/40 transition-colors">
                 <q.icon size={26} className="text-[#547792]" />
                 <span className="text-[12.5px] font-bold text-[#1A3263] leading-tight px-2">{q.label}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact - Full-bleed KCE style */}
      <section id="contact" className="scroll-mt-[100px] lg:scroll-mt-[150px] bg-[#1A3263] text-white py-14 border-t-4 border-[#FAB95B]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-[26px] font-bold text-[#FAB95B]">Contact {settings?.name || college.name}</h2>
            {contactDetails?.mapLink && <a href={contactDetails.mapLink} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[12px]">View on Map →</a>}
          </div>

          {contactDetails ? (
            <div className="mt-8 space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-[16px] bg-white/10 border border-white/20 p-5">
                  <div className="flex gap-3"><MapPin size={20} className="text-[#FAB95B] shrink-0" /><div><div className="font-bold text-[#FAB95B] text-[12px] uppercase">Address</div><div className="text-[#E8E2DB]/90 text-[13px] mt-2 leading-[1.6]">{contactDetails.address}{contactDetails.city ? `, ${contactDetails.city}` : ''}{contactDetails.district ? `, ${contactDetails.district}` : ''}{contactDetails.pincode ? ` - ${contactDetails.pincode}` : ''}</div>{contactDetails.officeHours && <div className="text-[11px] text-[#E8E2DB]/60 mt-3">🕒 {contactDetails.officeHours}</div>}</div></div>
                </div>
                <div className="rounded-[16px] bg-white/10 border border-white/20 p-5">
                  <div className="flex gap-3"><Phone size={20} className="text-[#FAB95B] shrink-0" /><div><div className="font-bold text-[#FAB95B] text-[12px] uppercase">Phone</div><div className="text-[#E8E2DB]/90 text-[13px] mt-2 space-y-1"><div>{contactDetails.phone}</div>{contactDetails.phone2 && <div>{contactDetails.phone2}</div>}{contactDetails.tollFree && <div className="text-[#FAB95B]">Toll Free: {contactDetails.tollFree}</div>}{contactDetails.fax && <div className="text-[#E8E2DB]/60 text-[11px]">Fax: {contactDetails.fax}</div>}</div></div></div>
                </div>
                <div className="rounded-[16px] bg-white/10 border border-white/20 p-5">
                  <div className="flex gap-3"><Mail size={20} className="text-[#FAB95B] shrink-0" /><div><div className="font-bold text-[#FAB95B] text-[12px] uppercase">Email & Web</div><div className="text-[#E8E2DB]/90 text-[13px] mt-2 space-y-1"><div>{contactDetails.email}</div>{contactDetails.admissionsEmail && <div className="text-[#FAB95B] text-[12px]">{contactDetails.admissionsEmail}</div>}<div className="text-[#E8E2DB]/60 text-[11px] mt-2">{contactDetails.website}</div></div></div></div>
                </div>
              </div>

              {(contactDetails.contactPerson || contactDetails.enquiryPhone || contactDetails.enquiryEmail) && (
                <div className="rounded-[16px] bg-white p-6 text-[#1A3263]">
                  <div className="font-bold text-[14px]">Enquiry & Contact Person</div>
                  <div className="mt-4 grid md:grid-cols-3 gap-6 text-[13px]">
                    {contactDetails.contactPerson && <div><div className="text-[11px] font-bold uppercase text-[#547792]">Contact Person</div><div className="font-bold text-[14px] mt-1">{contactDetails.contactPerson}</div>{contactDetails.contactDesignation && <div className="text-[12px] text-[#547792]">{contactDetails.contactDesignation}</div>}{contactDetails.contactPhone && <div className="text-[12px] mt-1">📞 {contactDetails.contactPhone}</div>}</div>}
                    {contactDetails.enquiryPhone && <div><div className="text-[11px] font-bold uppercase text-[#547792]">Enquiry Phone</div><div className="font-bold mt-1">{contactDetails.enquiryPhone}</div>{contactDetails.supportHours && <div className="text-[11px] text-[#547792] mt-1">{contactDetails.supportHours}</div>}</div>}
                    {contactDetails.enquiryEmail && <div><div className="text-[11px] font-bold uppercase text-[#547792]">Enquiry Email</div><div className="font-bold mt-1">{contactDetails.enquiryEmail}</div></div>}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[#E8E2DB]/70 text-[11px]">ID {college.id} • {settings?.established || college.established} • {settings?.accreditation || college.accreditation || ''}</span>
                {contactDetails.mapLink && <a href={contactDetails.mapLink} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-[#FAB95B]/20 border border-[#FAB95B]/30 text-[#FAB95B] text-[11px] font-bold">📍 Open in Google Maps</a>}
              </div>
            </div>
          ) : (
            <div className="mt-6 grid md:grid-cols-3 gap-6 text-[13px]">
              <div className="flex gap-3"><MapPin size={18} className="text-[#FAB95B] shrink-0" /><div><div className="font-bold text-[#FAB95B]">Address</div><div className="text-[#E8E2DB]/80 mt-1">{college.address}, {college.city}, {college.district} - {college.pincode}</div></div></div>
              <div className="flex gap-3"><Phone size={18} className="text-[#FAB95B] shrink-0" /><div><div className="font-bold text-[#FAB95B]">Phone</div><div className="text-[#E8E2DB]/80 mt-1">{college.phone}</div></div></div>
              <div className="flex gap-3"><Mail size={18} className="text-[#FAB95B] shrink-0" /><div><div className="font-bold text-[#FAB95B]">Email</div><div className="text-[#E8E2DB]/80 mt-1">{college.email}</div><div className="text-[#E8E2DB]/60 text-[11px] mt-1">{college.website}</div></div></div>
            </div>
          )}
          </div>
        </section>

      {/* HOD Full Profile Modal - opens when HOD image is tapped */}
      {hodProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6" onClick={() => setHodProfile(null)} role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-[#1A3263]/85 backdrop-blur-sm" />
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[760px] max-h-[92vh] overflow-y-auto rounded-[24px] bg-white shadow-2xl border-2 border-[#E8E2DB]">
            <button onClick={() => setHodProfile(null)} className="absolute top-4 right-4 z-10 h-10 w-10 grid place-items-center rounded-full bg-[#1A3263]/80 text-[#FAB95B] border border-[#FAB95B]/40 hover:bg-[#1A3263] transition-colors" aria-label="Close">
              <X size={18} />
            </button>

            <div className="bg-[#1A3263] p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
                <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-[20px] overflow-hidden border-4 border-[#FAB95B] bg-white shrink-0 shadow-xl">
                  {hodProfile.hodImage || hodProfile.image ? (
                    <img src={hodProfile.hodImage || hodProfile.image} className="h-full w-full object-cover object-top" alt={hodProfile.hod} />
                  ) : (
                    <div className="h-full w-full grid place-items-center bg-gradient-to-br from-[#E8E2DB] to-[#547792] text-[#1A3263] font-bold text-[40px]">{hodProfile.hod ? hodProfile.hod[0] : 'H'}</div>
                  )}
                </div>
                <div className="text-center sm:text-left flex-1 min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#FAB95B]">Head of Department</div>
                  <h3 className="font-display text-[24px] sm:text-[28px] font-bold text-white leading-tight mt-1">{hodProfile.hod || 'HOD'}</h3>
                  <div className="text-[13px] text-[#E8E2DB]/80 mt-1">{hodProfile.hodDesignation || 'Head of Department'}, {hodProfile.name}</div>
                  <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                    {hodProfile.hodQualification && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAB95B]/20 border border-[#FAB95B]/30 text-[#FAB95B] text-[11px] font-bold"><GraduationCap size={11} /> {hodProfile.hodQualification}</span>}
                    {hodProfile.hodExperience && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-[11px] font-bold"><Briefcase size={11} /> {hodProfile.hodExperience}</span>}
                    {hodProfile.facultyCount && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-[11px]"><Users size={11} /> {hodProfile.facultyCount} Faculty</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {(hodProfile.hodEmail || hodProfile.hodPhone) && (
                <div className="grid sm:grid-cols-2 gap-3">
                  {hodProfile.hodEmail && (
                    <a href={`mailto:${hodProfile.hodEmail.replace(/\[at\]/g,'@').replace(/\[dot\]/g,'.')}`} className="flex items-center gap-3 rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-4 hover:border-[#FAB95B]/50 transition-colors">
                      <div className="h-10 w-10 rounded-[12px] bg-[#1A3263] text-[#FAB95B] grid place-items-center shrink-0"><Mail size={16} /></div>
                      <div className="min-w-0"><div className="text-[10px] font-bold uppercase text-[#547792]">Email</div><div className="text-[12px] font-semibold text-[#1A3263] break-all">{hodProfile.hodEmail}</div></div>
                    </a>
                  )}
                  {hodProfile.hodPhone && (
                    <a href={`tel:${hodProfile.hodPhone}`} className="flex items-center gap-3 rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-4 hover:border-[#FAB95B]/50 transition-colors">
                      <div className="h-10 w-10 rounded-[12px] bg-[#1A3263] text-[#FAB95B] grid place-items-center shrink-0"><Phone size={16} /></div>
                      <div className="min-w-0"><div className="text-[10px] font-bold uppercase text-[#547792]">Phone</div><div className="text-[12px] font-semibold text-[#1A3263]">{hodProfile.hodPhone}</div></div>
                    </a>
                  )}
                </div>
              )}

              <div>
                <h4 className="font-display text-[18px] font-bold text-[#1A3263] flex items-center gap-2"><span className="h-5 w-1 rounded-full bg-[#FAB95B]"></span> Profile & Biography</h4>
                <div className="mt-3 rounded-[16px] bg-[#E8E2DB]/40 border-2 border-[#E8E2DB] p-5 text-[13.5px] leading-[1.85] text-[#1A3263]/85 whitespace-pre-wrap">
                  {hodProfile.hodDetailedBio || hodProfile.hodBio || (
                    <>
                      {hodProfile.description && <p><span className="font-bold text-[#1A3263]">About {hodProfile.name} Department:</span> {hodProfile.description}</p>}
                      <p className={hodProfile.description ? 'mt-3' : ''}>{hodProfile.hod} is currently working as {hodProfile.hodDesignation || `Head of Department, ${hodProfile.name}`} at {college.name}, {college.city}, {college.district}. {hodProfile.facultyCount ? `The department carries a faculty strength of ${hodProfile.facultyCount} members` : 'The department carries a dedicated faculty team'} with expertise across various specializations of {hodProfile.name}.</p>
                    </>
                  )}
                </div>
              </div>

              {hodProfile.hodResearch && (
                <div>
                  <h4 className="font-display text-[16px] font-bold text-[#1A3263] flex items-center gap-2"><FlaskConical size={15} className="text-[#547792]" /> Research</h4>
                  <p className="mt-2 text-[13px] leading-[1.8] text-[#1A3263]/80 whitespace-pre-wrap">{hodProfile.hodResearch}</p>
                </div>
              )}

              {hodProfile.hodPublications && (
                <div>
                  <h4 className="font-display text-[16px] font-bold text-[#1A3263] flex items-center gap-2"><BookOpen size={15} className="text-[#547792]" /> Publications</h4>
                  <p className="mt-2 text-[13px] leading-[1.8] text-[#1A3263]/80 whitespace-pre-wrap">{hodProfile.hodPublications}</p>
                </div>
              )}

              {hodProfile.hodAwards && (
                <div>
                  <h4 className="font-display text-[16px] font-bold text-[#1A3263] flex items-center gap-2"><Award size={15} className="text-[#547792]" /> Awards & Honours</h4>
                  <p className="mt-2 text-[13px] leading-[1.8] text-[#1A3263]/80 whitespace-pre-wrap">{hodProfile.hodAwards}</p>
                </div>
              )}

              {hodProfile.description && (hodProfile.hodDetailedBio || hodProfile.hodBio) && (
                <div className="rounded-[16px] bg-[#1A3263] text-white p-5">
                  <div className="font-bold text-[#FAB95B] text-[13px] flex items-center gap-2"><Building2 size={14} /> About {hodProfile.name} Department</div>
                  <p className="mt-2 text-[12.5px] leading-[1.8] text-[#E8E2DB]/85">{hodProfile.description}</p>
                </div>
              )}

              <button onClick={() => setHodProfile(null)} className="w-full h-12 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] hover:bg-[#1A3263]/90 transition-colors">Close Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement detail modal */}
      {selAchievement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6" onClick={() => setSelAchievement(null)} role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-[#1A3263]/85 backdrop-blur-sm" />
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[640px] max-h-[92vh] overflow-y-auto rounded-[24px] bg-white shadow-2xl border-2 border-[#E8E2DB]">
            <button onClick={() => setSelAchievement(null)} className="absolute top-4 right-4 z-10 h-10 w-10 grid place-items-center rounded-full bg-[#1A3263]/80 text-[#FAB95B] border border-[#FAB95B]/40 hover:bg-[#1A3263] transition-colors" aria-label="Close">
              <X size={18} />
            </button>
            {selAchievement.image && <img src={selAchievement.image} className="w-full h-[260px] sm:h-[320px] object-cover" alt={selAchievement.title} />}
            <div className="p-6 sm:p-8">
              <h3 className="text-[22px] sm:text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263]">{selAchievement.title}</h3>
              {selAchievement.description && <p className="mt-4 text-[13.5px] leading-[1.85] text-[#1A3263]/80 whitespace-pre-wrap">{selAchievement.description}</p>}
              <button onClick={() => setSelAchievement(null)} className="mt-6 w-full h-12 rounded-full bg-[#1A3263] text-[#FAB95B] font-extrabold text-[14px] hover:bg-[#1A3263]/90 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* KCE-style footer */}
      <footer className="bg-[#1A3263] text-white border-t-4 border-[#FAB95B]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
          <div className="py-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10">
            <h3 className="text-[22px] sm:text-[26px] font-extrabold uppercase tracking-tight">Placement Offers</h3>
            <button onClick={() => scrollId('placements')} className="h-11 px-6 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#FAB95B]/90 transition-colors">Know More →</button>
          </div>
          <div className="py-12 grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr] gap-10">
            <div>
              <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#FAB95B]">Quick Links</div>
              <div className="mt-5 space-y-3 text-[12.5px]">
                <a href="#home" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Home</a>
                <a href="#about" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">About Us</a>
                <a href="#programmes" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Programmes</a>
                <a href="#departments" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Departments</a>
                <a href="#facilities" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Facilities</a>
                <a href="#gallery" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Gallery</a>
              </div>
            </div>
            <div>
              <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#FAB95B]">Information About</div>
              <div className="mt-5 space-y-3 text-[12.5px]">
                <a href="#admissions" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Admissions</a>
                <a href="#placements" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Placements</a>
                <a href="#centres" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Research Centres</a>
                <a href="#campus" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Campus & Environment</a>
                <a href="#library" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Library</a>
                <a href="#hostels" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Hostels</a>
                <a href="#alumni" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Alumni Success Stories</a>
                <a href="#achievements" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Student Achievements</a>
              </div>
            </div>
            <div>
              <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#FAB95B]">Information For</div>
              <div className="mt-5 space-y-3 text-[12.5px]">
                <a href="#contact" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Admission Enquiry</a>
                <a href="#admissions" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Application</a>
                <a href="#events" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Events & Activities</a>
                <a href="#principal" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Principal</a>
                <a href="#management" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Management & Trustees</a>
                <a href="#contact" className="block text-[#E8E2DB]/75 hover:text-[#FAB95B] transition-colors">Contact Person</a>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                {branding.logo ? <img src={branding.logo} className="h-12 w-12 rounded-[12px] bg-white object-cover border-2 border-[#FAB95B]" alt="Logo" /> : <div className="h-12 w-12 rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-extrabold">{college.name?.[0] || 'C'}</div>}
                <div><div className="font-extrabold text-[15px]">{college.name}</div><div className="text-[10px] text-[#FAB95B] mt-0.5 font-bold">Est. {college.established} • {college.district}</div></div>
              </div>
              <div className="mt-5 space-y-3 text-[12px] text-[#E8E2DB]/75">
                <div className="flex gap-2.5"><MapPin size={14} className="text-[#FAB95B] shrink-0 mt-0.5" /><span>{(contactDetails?.address || college.address || '')}{(contactDetails?.city || college.city) ? `, ${contactDetails?.city || college.city}` : ''}, {college.district} - {contactDetails?.pincode || college.pincode}</span></div>
                <div className="flex gap-2.5"><Phone size={14} className="text-[#FAB95B] shrink-0 mt-0.5" /><span>{(contactDetails?.phone || college.phone || '').split('/')[0]}</span></div>
                <div className="flex gap-2.5"><Mail size={14} className="text-[#FAB95B] shrink-0 mt-0.5" /><span>{contactDetails?.email || college.email}</span></div>
              </div>
            </div>
          </div>
          <div className="py-5 border-t border-white/10 text-center text-[11px] text-white/40">© 2026 {college.name} • All Rights Reserved</div>
        </div>
      </footer>
    </div>
  )
}

export default function CollegePage() {
  const { slug } = useParams()
  const [college, setCollege] = useState(null)
  const [customData, setCustomData] = useState({})

  useEffect(() => {
    const found = getCollegeBySlug(slug)
    if (found) {
      setCollege(found)
      setCustomData(getCollegeCustomData(found.id))
    } else {
      // Also check public colleges
      const publicCols = getPublicColleges()
      const pubFound = publicCols.find(c => c.slug === slug)
      setCollege(pubFound || null)
      if (pubFound) setCustomData(getCollegeCustomData(pubFound.id))
    }
  }, [slug])

  if (!college) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#E8E2DB] p-8">
        <div className="text-center">
          <h1 className="font-display text-[32px] font-bold text-[#1A3263]">College not found</h1>
          <p className="text-[13px] text-[#547792] mt-2">College information not found</p>
          <Link to="/college/signup" className="mt-6 inline-flex h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-semibold">College Sign Up</Link>
        </div>
      </div>
    )
  }

  return <CustomCollegePage college={college} customData={customData} />
}
