import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { getCollegeBySlug, getCollegeCustomData, getPublicColleges } from '../../lib/collegeStorage'
import CollegeHeader from '../../components/college/CollegeHeader'
import AboutPages from '../../components/college/AboutPages.jsx'
import DeptPage from '../../components/college/DeptPage.jsx'
import { MapPin, Phone, Mail, BadgeCheck, Building2, GraduationCap, Users, User, Award, Image as ImageIcon, X, BookOpen, FlaskConical, Briefcase, Landmark, ShieldCheck, PhoneCall, Trophy, FileText, Calendar, CheckCircle, ClipboardList, Gift, Clock, Palette, Leaf, ChevronLeft, ChevronRight } from 'lucide-react'


function placementStats(placements) {
  if (Array.isArray(placements) && placements.length) {
    const total = placements.reduce((a, p) => a + (parseInt(p.students, 10) || 0), 0)
    const companies = placements.length
    let highest = ''
    let highestNum = 0
    placements.forEach(p => {
      const m = String(p.package || '').match(/[\d.]+/)
      if (m && parseFloat(m[0]) > highestNum) { highestNum = parseFloat(m[0]); highest = String(p.package) }
    })
    const recruiters = placements.map(p => p.company).filter(Boolean)
    return { total, companies, highest, highestNum, recruiters }
  }
  if (placements && typeof placements === 'object') {
    const recruiters = Array.isArray(placements.recruiters) ? placements.recruiters : []
    const m = String(placements.highest || '').match(/([\d.]+)/)
    return { total: placements.total || '', companies: recruiters.length, highest: placements.highest || '', highestNum: m ? parseFloat(m[1]) : 0, recruiters }
  }
  return { total: 0, companies: 0, highest: '', highestNum: 0, recruiters: [] }
}

function scrollId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

function BrandIcon({ name, size = 15, className = '' }) {
  const paths = {
    facebook: 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z',
    instagram: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.4-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z',
    x: 'M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82L5 21.75H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z',
    youtube: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12z',
    linkedin: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z'
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><path d={paths[name]} /></svg>
}

function KceHero({ college, branding, homePage, plStats, shortName, campusImages }) {
  const banner = homePage.bannerImage || branding.heroImage || college.branding?.heroImage || campusImages[0] || ''
  const statPl = homePage.statPlacements || plStats.total || ''
  const statCo = homePage.statCompanies || plStats.companies || ''
  const statLpa = homePage.statMaxLpa || (plStats.highestNum ? String(plStats.highestNum) : String(plStats.highest || '').replace(/[^\d.]/g, ''))
  const coord = (homePage.coordinators || []).slice(0, 4)
  const conv = (homePage.convenors || []).slice(0, 4)
  const partners = (homePage.partnerLogos || []).slice(0, 6)
  const dateParts = (homePage.eventDate || '').split(' ')
  const cta = [
    { label: 'Placement', id: 'placements' },
    { label: 'Campus Tour', id: 'campus' },
    { label: 'Campus Life', id: 'events' },
    { label: 'Center of Excellence', id: 'centres' },
  ]
  return (
    <div id="home" className="relative bg-[#1A3263]">
      {/* Event banner */}
      <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
        {banner ? (
          <img src={banner} className="absolute inset-0 h-full w-full object-cover object-center" alt={college.name + ' banner'} />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A3263] via-[#547792] to-[#1A3263]"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A3263]/60 via-transparent to-[#1A3263]/20"></div>

        {/* Partner logos - top right */}
        {partners.length > 0 && (
          <div className="absolute top-4 right-4 sm:right-10 z-20 flex flex-wrap justify-end gap-2 max-w-[600px]">
            {partners.map((p, i) => (
              <div key={i} className="h-11 min-w-[60px] px-3 rounded-[8px] bg-white/95 shadow-md flex items-center justify-center overflow-hidden">
                <img src={p} className="h-8 max-w-[92px] object-contain" alt="" />
              </div>
            ))}
          </div>
        )}

        {/* Date card - bottom left */}
        {homePage.eventDate && (
          <div className="absolute bottom-6 left-4 sm:left-10 z-20">
            <div className="rounded-[16px] bg-white shadow-2xl px-6 py-4 text-center min-w-[170px]">
              <div className="text-[36px] sm:text-[42px] font-extrabold text-[#1A3263] leading-none">{dateParts[0] || ''}</div>
              <div className="text-[15px] font-extrabold text-[#1A3263] mt-0.5">{dateParts.slice(1).join(' ')}</div>
              {homePage.eventTime ? <div className="mt-2 text-[12px] font-extrabold text-[#FAB95B] tracking-wide">TIME : {homePage.eventTime}</div> : null}
            </div>
          </div>
        )}

        {/* Chief guest card */}
        {homePage.chiefGuestName && (
          <div className="absolute bottom-6 left-[240px] sm:left-[calc(50%-260px)] z-20 hidden md:block">
            <div className="rounded-[16px] bg-white shadow-2xl p-4 w-[195px] text-center">
              <div className="h-[125px] w-full rounded-[10px] overflow-hidden bg-[#E8E2DB]">
                {homePage.chiefGuestPhoto ? (
                  <img src={homePage.chiefGuestPhoto} className="h-full w-full object-cover object-top" alt={homePage.chiefGuestName} />
                ) : (
                  <div className="h-full w-full grid place-items-center text-[#547792] font-extrabold text-[30px]">{homePage.chiefGuestName[0]}</div>
                )}
              </div>
              <div className="mt-3 inline-block px-3.5 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[9px] font-extrabold uppercase tracking-[0.08em]">Chief Guest</div>
              <div className="mt-2 text-[13px] font-extrabold text-[#1A3263] leading-tight">{homePage.chiefGuestName}</div>
              {homePage.chiefGuestTitle ? <div className="mt-1 text-[10.5px] text-[#547792] font-semibold leading-tight">{homePage.chiefGuestTitle}</div> : null}
            </div>
          </div>
        )}

        {/* Coordinators / Convenors card - bottom right */}
        {(coord.length > 0 || conv.length > 0) && (
          <div className="absolute bottom-6 right-4 sm:right-10 z-20 hidden xl:block">
            <div className="rounded-[16px] bg-white/95 backdrop-blur shadow-2xl p-5 w-[420px] grid grid-cols-2 gap-5">
              {coord.length > 0 && (
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#FAB95B]">Coordinators</div>
                  <div className="mt-2.5 space-y-2.5">
                    {coord.map((c, i) => (
                      <div key={i}>
                        <div className="text-[12px] font-extrabold text-[#1A3263] leading-tight">{c.split(' - ')[0]}</div>
                        {c.split(' - ')[1] ? <div className="text-[10px] text-[#547792] font-semibold">{c.split(' - ')[1]}</div> : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {conv.length > 0 && (
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#FAB95B]">Convenors</div>
                  <div className="mt-2.5 space-y-2.5">
                    {conv.map((c, i) => (
                      <div key={i}>
                        <div className="text-[12px] font-extrabold text-[#1A3263] leading-tight">{c.split(' - ')[0]}</div>
                        {c.split(' - ')[1] ? <div className="text-[10px] text-[#547792] font-semibold">{c.split(' - ')[1]}</div> : null}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* White stats strip + navy CTA buttons */}
      <div className="bg-white border-b border-[#E8E2DB]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-8 py-4 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center divide-x divide-[#E8E2DB]">
            {statPl !== '' && (
              <div className="px-5 sm:px-8 first:pl-0 text-center">
                <div className="text-[26px] sm:text-[34px] font-extrabold text-[#FAB95B] leading-none">{statPl}+</div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#547792] mt-1.5">Placements</div>
              </div>
            )}
            {statCo !== '' && (
              <div className="px-5 sm:px-8 text-center">
                <div className="text-[26px] sm:text-[34px] font-extrabold text-[#FAB95B] leading-none">{statCo}+</div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#547792] mt-1.5">Companies</div>
              </div>
            )}
            {statLpa !== '' && (
              <div className="px-5 sm:px-8 last:pr-0 text-center">
                <div className="text-[26px] sm:text-[34px] font-extrabold text-[#FAB95B] leading-none">{statLpa}</div>
                <div className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#547792] mt-1.5">LPA - Max Salary</div>
              </div>
            )}
          </div>
          <div className="flex-1"></div>
          <div className="flex flex-wrap gap-2">
            {cta.map(b => (
              <button key={b.label} onClick={() => scrollId(b.id)} className="h-10 px-4 sm:px-5 rounded-[10px] bg-[#1A3263] text-white text-[10.5px] sm:text-[11px] font-extrabold uppercase tracking-[0.08em] hover:bg-[#1A3263]/85 transition-colors">{b.label}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function CompanyMark({ logo, company }) {
  const [failed, setFailed] = useState(false)
  if (!logo && !company) return null
  return (
    <div className="absolute top-3.5 right-3.5 flex items-center justify-center">
      {logo && !failed ? (
        <img src={logo} onError={() => setFailed(true)} className="h-6 max-w-[92px] w-auto object-contain [filter:drop-shadow(0_0_3px_rgba(255,255,255,0.95))_drop-shadow(0_0_6px_rgba(255,255,255,0.7))]" alt={company || 'company'} />
      ) : (
        <span className="text-[11.5px] font-extrabold tracking-wide text-[#1A3263] [text-shadow:0_0_4px_rgba(255,255,255,0.95),0_0_8px_rgba(255,255,255,0.8)]">{company}</span>
      )}
    </div>
  )
}

function AlumniCarousel({ alumni }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (alumni.length <= 1) return
    const t = setInterval(() => setIdx(i => (i + 1) % alumni.length), 8000)
    return () => clearInterval(t)
  }, [alumni.length])
  const n = alumni.length
  if (n === 0) return null
  // wheel adapts to any alumni count: 2 alumni = 2-card wheel, 9+ = full ring
  const vis = Math.min(n, 11)
  const startOff = -Math.floor((vis - 1) / 2)
  const offsets = Array.from({ length: vis }, (_, i) => startOff + i)
  const sizes = {
    '-5': 'w-[126px] h-[182px]', '-4': 'w-[148px] h-[212px]', '-3': 'w-[176px] h-[252px]', '-2': 'w-[206px] h-[298px]', '-1': 'w-[246px] h-[358px]',
    '0': 'w-[300px] h-[430px]',
    '1': 'w-[246px] h-[358px]', '2': 'w-[206px] h-[298px]', '3': 'w-[176px] h-[252px]', '4': 'w-[148px] h-[212px]', '5': 'w-[126px] h-[182px]',
  }
  const margs = {
    '-5': 'mr-[-70px]', '-4': 'mr-[-64px]', '-3': 'mr-[-56px]', '-2': 'mr-[-46px]', '-1': 'mr-[-36px]',
    '0': 'mx-[-8px]',
    '1': 'ml-[-36px]', '2': 'ml-[-46px]', '3': 'ml-[-56px]', '4': 'ml-[-64px]', '5': 'ml-[-70px]',
  }
  const zix = { '-5': 'z-0', '-4': 'z-0', '-3': 'z-10', '-2': 'z-20', '-1': 'z-20', '0': 'z-30', '1': 'z-20', '2': 'z-20', '3': 'z-10', '4': 'z-0', '5': 'z-0' }
  const fade = {
    '-5': 'grayscale opacity-30', '-4': 'grayscale opacity-40', '-3': 'grayscale opacity-55', '-2': 'grayscale opacity-70', '-1': 'grayscale opacity-90',
    '0': '',
    '1': 'grayscale opacity-90', '2': 'grayscale opacity-70', '3': 'grayscale opacity-55', '4': 'grayscale opacity-40', '5': 'grayscale opacity-30',
  }
  const nameSize = { '-5': 'text-[8px]', '-4': 'text-[9px]', '-3': 'text-[10px]', '-2': 'text-[11px]', '-1': 'text-[13px]', '0': 'text-[18px]', '1': 'text-[13px]', '2': 'text-[11px]', '3': 'text-[10px]', '4': 'text-[9px]', '5': 'text-[8px]' }
  const subSize = { '-5': 'text-[7px]', '-4': 'text-[8px]', '-3': 'text-[9px]', '-2': 'text-[9.5px]', '-1': 'text-[10.5px]', '0': 'text-[12.5px]', '1': 'text-[10.5px]', '2': 'text-[9.5px]', '3': 'text-[9px]', '4': 'text-[8px]', '5': 'text-[7px]' }
  return (
    <div className="mt-12 pb-10 flex items-end justify-center select-none overflow-x-clip w-full">
      {offsets.map(off => {
        const a = alumni[(idx + off + n * 5) % n]
        const isCenter = off === 0
        return (
          <div key={off} onClick={() => { if (!isCenter) setIdx((idx + off + n) % n) }} className={`relative text-center transition-all duration-[2400ms] ease-[cubic-bezier(0.22,0.61,0.36,1)] ${zix[String(off)]} ${margs[String(off)]} ${!isCenter ? 'cursor-pointer' : ''} ${Math.abs(off) >= 4 ? 'hidden xl:block' : Math.abs(off) >= 3 ? 'hidden lg:block' : ''}`}>
            <div className={`${sizes[String(off)]} rounded-[20px] overflow-hidden shadow-2xl bg-white relative ${fade[String(off)]}`}>
              {a.image ? <img src={a.image} className="h-full w-full object-cover object-top" alt={a.name} /> : <div className="h-full w-full bg-[#E8E2DB] grid place-items-center text-[#547792] font-extrabold text-[34px]">{a.name ? a.name[0] : ''}</div>}
              <CompanyMark logo={a.companyLogo} company={a.company} />
            </div>
            <div className={`mt-3.5 font-extrabold text-[#FAB95B] ${nameSize[String(off)]}`}>{a.name}</div>
            <div className={`text-[#547792] font-semibold mt-0.5 ${subSize[String(off)]}`}>{a.designation}{a.company ? ' ' + a.company : ''}</div>
          </div>
        )
      })}
    </div>
  )
}

function FooterLinkCol({ title, links }) {
  return (
    <div>
      <div className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-[#FAB95B]">{title}</div>
      <div className="mt-5 space-y-3 text-[12.5px]">
        {links.map((l, i) => (
          <a key={i} href="#" onClick={e => e.preventDefault()} className="block text-white/70 hover:text-[#FAB95B] transition-colors">{l}</a>
        ))}
      </div>
    </div>
  )
}

function CustomCollegePage({ college, customData }) {
  const [hodProfile, setHodProfile] = useState(null)
  const [progTab, setProgTab] = useState('All')
  const [selCourse, setSelCourse] = useState(null)
  const [selAchievement, setSelAchievement] = useState(null)
  const [achPage, setAchPage] = useState(0)
  const [newsPage, setNewsPage] = useState(0)
  const [sitePage, setSitePage] = useState('home')
  const pendingAnchor = useRef(null)

  const navigateSite = (page, anchor) => {
    if (!page || page === 'home') {
      if (!anchor || anchor === 'home') {
        pendingAnchor.current = null
        setSitePage('home')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        pendingAnchor.current = anchor
        setSitePage('home')
      }
    } else {
      setSitePage(page)
      window.scrollTo({ top: 0 })
    }
  }
  const branding = customData.branding || college.branding || {}
  const departments = customData.departments || college.departments || []
  const courses = customData.courses || college.courses || []
  const facilities = customData.customFacilities || []
  const placements = customData.placements || college.placements || []
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
  const alumni = customData.alumni || college.alumni || []
  const achievements = customData.achievements || []
  const homePage = customData.homePage || college.homePage || {}
  const aboutPages = customData.aboutPages || college.aboutPages || {}
  const leadership = college.leadership || {}
  const deptPages = customData.deptPages || college.deptPages || {}
  const activeDept = sitePage && sitePage.startsWith('dept-') ? (departments.find(dp => String(dp.id) === sitePage.slice(5)) || null) : null
    const mgmtBase = (Array.isArray(aboutPages.management) && aboutPages.management.length > 0) ? aboutPages.management : [
    ...(leadership.management || customData.management || []).map(m => ({ role: m.role || '', name: m.name || '', photo: m.photo || '', bio: m.bio || (m.details ? [m.details] : []) })),
    ...((principal || leadership.principal) ? [{ role: 'Principal', name: (principal || leadership.principal).name || '', photo: (principal || leadership.principal).photo || '', bio: (principal || leadership.principal).message ? [(principal || leadership.principal).message] : [] }] : []),
  ]
  const newsList = (Array.isArray(customData.news) && customData.news.length > 0 ? customData.news : (events.length > 0 ? events : announcements)).map(n => ({ title: n.title || '', date: n.date || '', image: n.image || '', link: n.link || '' }))
  const footerLinksData = customData.footerLinks || college.footerLinks || null

  const hasContent = (arr) => arr && arr.length > 0

  // KCE-style page helpers
  const plStats = placementStats(placements)
  const isPGCourse = (c) => /(^|[^A-Z])M\.|mtech|m\.?sc\b|mba|mca|phd|m\.e/i.test(String(c.degree || ''))
  const ugcourses = courses.filter(c => !isPGCourse(c))
  const pgcourses = courses.filter(isPGCourse)
  const campusImages = (campusEnv[0]?.images || []).map(im => (typeof im === 'string' ? im : im.url)).filter(Boolean)
  const progBg = campusImages[0] || branding.heroImage || college.branding?.heroImage || ''
  const shortName = settings?.shortName || college.shortName || college.name?.split(' ')[0] || ''

  // KCE home layout derived data
  const aboutImg = homePage.aboutImage || branding.aboutImage || campusImages[0] || branding.heroImage || college.branding?.heroImage || ''
  const statPl = homePage.statPlacements || plStats.total || ''
  const statCo = homePage.statCompanies || plStats.companies || ''
  const statLpa = homePage.statMaxLpa || (plStats.highestNum ? String(plStats.highestNum) : String(plStats.highest || '').replace(/[^\d.]/g, ''))
  const industryItems = (Array.isArray(customData.industryLogos) && customData.industryLogos.length > 0 ? customData.industryLogos.map(l => (typeof l === 'string' ? { name: '', url: l } : l)) : (plStats.recruiters || []).map(n => ({ name: n, url: '' })))
  const quickLinks = [
    { label: 'Vidya Lakshmi Portal', icon: 'user', href: 'https://vidyalakshmi.gov.in' },
    { label: 'National Digital Library', icon: 'book', href: 'https://ndl.in' },
    { label: 'Student Alumni', icon: 'cap', href: '#alumni' },
    { label: 'Anti Ragging Committee', icon: 'users', href: 'https://antiraggingccimc.in' },
    { label: 'Admission Enquiries', icon: 'landmark', href: '#contact' },
  ]

  const achPages = Math.max(1, Math.ceil(achievements.length / 4))
  const newsPages = Math.max(1, Math.ceil(newsList.length / 2))
  const upcomingList = [...(events.length > 0 ? events : announcements)].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4)

  // After returning to home from an about page, scroll to the pending anchor section
  useEffect(() => {
    if (sitePage !== 'home' || !pendingAnchor.current) return
    const id = pendingAnchor.current
    pendingAnchor.current = null
    const t = setTimeout(() => {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 90)
    return () => clearTimeout(t)
  }, [sitePage])

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
      <CollegeHeader college={{ ...college, settings: settings, branding: { ...college.branding, ...branding, logo: branding.logo || college.branding?.logo, heroImage: branding.heroImage || college.branding?.heroImage } }} homePage={homePage} currentPage={sitePage} onNavigate={navigateSite} departments={departments} />

      {sitePage === 'home' ? (<>
      {/* Hero - KCE event banner */}
      <KceHero college={college} branding={branding} homePage={homePage} plStats={plStats} shortName={shortName} campusImages={campusImages} />

      {/* ABOUT US - KCE layout */}
      <section id="about" className="scroll-mt-[100px] lg:scroll-mt-[150px] bg-white">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-14 sm:py-20">
          <h2 className="text-[30px] sm:text-[38px] font-extrabold uppercase tracking-tight text-[#1A3263]">About Us</h2>
          <div className="mt-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-[14.5px] sm:text-[15px] leading-[1.95] text-[#547792]">{about.fullText || 'College introduction will appear here once the college adds it from the dashboard.'}</p>
              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-4 items-center">
                {(homePage.accreditationLogos || []).length > 0 ? (
                  homePage.accreditationLogos.slice(0, 8).map((l, i) => (
                    <img key={i} src={l} className="h-12 sm:h-14 w-auto object-contain grayscale opacity-80" alt={'Accreditation ' + (i + 1)} />
                  ))
                ) : (
                  (settings?.accreditation || college.accreditation || 'NAAC • NBA • ISO 9001:2015').split('•').map(t => t.trim()).filter(Boolean).slice(0, 8).map((t, i) => (
                    <div key={i} className="h-12 px-5 flex items-center rounded-full border-2 border-[#E8E2DB] text-[11px] font-extrabold uppercase tracking-wide text-[#547792]">{t}</div>
                  ))
                )}
              </div>
              <button onClick={() => scrollId('management')} className="mt-10 h-11 px-8 rounded-full bg-[#FAB95B] text-[#1A3263] text-[13px] font-extrabold inline-flex items-center gap-2 hover:bg-[#FAB95B]/90 transition-colors">Read More <span>→</span></button>
            </div>
            <div className="relative lg:mt-4">
              <div className="rounded-[28px] overflow-hidden shadow-xl aspect-[4/3] bg-[#E8E2DB]">
                {aboutImg ? <img src={aboutImg} className="h-full w-full object-cover" alt={college.name + ' campus'} /> : null}
              </div>
              <div className="absolute -bottom-5 -left-5 h-24 w-24 rounded-[20px] bg-white shadow-xl grid place-items-center border border-[#E8E2DB]">
                <span className="text-[30px] font-extrabold text-[#1A3263]">{(shortName || college.name || 'C')[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMMES FOR YOU - KCE dark layout */}
      <section id="programmes" className="scroll-mt-[100px] lg:scroll-mt-[150px] relative bg-[#1A3263] overflow-hidden">
        {progBg ? <img src={progBg} className="absolute inset-0 h-full w-full object-cover opacity-15" alt="" /> : null}
        <div className="absolute inset-0 bg-[#1A3263]/90"></div>
        <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12 pt-14 sm:pt-20 pb-28 sm:pb-36">
          <h2 className="text-[30px] sm:text-[38px] font-extrabold uppercase tracking-tight text-white">Programmes For You</h2>
          <div className="mt-10 grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-14 items-start">
            <div className="relative rounded-[20px] bg-[#FAB95B] p-6 sm:p-8 shadow-2xl min-h-[380px]">
              <button onClick={() => { setProgTab('All'); setSelCourse(null) }} className={`block w-full text-left px-4 py-3 rounded-[12px] text-[15px] transition-colors ${progTab === 'All' ? 'font-extrabold text-white underline underline-offset-4 decoration-2' : 'font-bold text-[#1A3263]/75 hover:bg-[#1A3263]/5'}`}>› All Programmes</button>
              <div className="mt-3">
                <button onClick={() => { setProgTab('UG'); setSelCourse(null) }} className={`block w-full text-left px-4 py-2 rounded-[12px] text-[15px] transition-colors ${progTab === 'UG' ? 'font-extrabold text-white underline underline-offset-4 decoration-2' : 'font-bold text-[#1A3263]/75 hover:bg-[#1A3263]/5'}`}>› UG Programmes</button>
                {progTab !== 'PG' ? (
                  <p className="mt-2.5 px-4 text-[12.5px] leading-[1.75] text-[#1A3263]/75">{homePage.ugDesc || ('Explore ' + shortName + ' undergraduate programmes that combine academic excellence with practical learning, empowering students to build successful futures.')}</p>
                ) : null}
              </div>
              <div className="mt-5">
                <button onClick={() => { setProgTab('PG'); setSelCourse(null) }} className={`block w-full text-left px-4 py-2 rounded-[12px] text-[15px] transition-colors ${progTab === 'PG' ? 'font-extrabold text-white underline underline-offset-4 decoration-2' : 'font-bold text-[#1A3263]/75 hover:bg-[#1A3263]/5'}`}>› PG Programmes</button>
                {progTab === 'PG' || progTab === 'All' ? (
                  <p className="mt-2.5 px-4 text-[12.5px] leading-[1.75] text-[#1A3263]/75">{homePage.pgDesc || ('At ' + shortName + ', our postgraduate programmes are crafted to foster intellectual growth, research excellence, and professional advancement.')}</p>
                ) : null}
              </div>
              <div className="mt-10 px-4 text-[44px] font-extrabold text-white/15 select-none">{(shortName || 'C')[0]}</div>
            </div>
            <div className="space-y-9">
              {(progTab === 'All' || progTab === 'UG') && (
                <div>
                  <h3 className="text-white font-extrabold text-[19px]">UG Programmes</h3>
                  <div className="mt-4 space-y-2.5">
                    {ugcourses.length > 0 ? ugcourses.map(c => (
                      <div key={c.id} className="flex items-center gap-3 text-[14.5px] text-white/90">
                        <span className="text-[#FAB95B] font-bold">›</span>
                        <span className="font-semibold">{c.degree}{c.name ? ' ' + c.name : ''}{c.nba ? ' *' : ''}</span>
                      </div>
                    )) : <div className="text-white/50 text-[13px]">UG programmes will appear here once added</div>}
                  </div>
                </div>
              )}
              {(progTab === 'All' || progTab === 'PG') && (
                <div>
                  <h3 className="text-white font-extrabold text-[19px]">PG Programmes</h3>
                  <div className="mt-4 space-y-2.5">
                    {pgcourses.length > 0 ? pgcourses.map(c => (
                      <div key={c.id} className="flex items-center gap-3 text-[14.5px] text-white/90">
                        <span className="text-[#FAB95B] font-bold">›</span>
                        <span className="font-semibold">{c.degree}{c.name ? ' ' + c.name : ''}{c.nba ? ' *' : ''}</span>
                      </div>
                    )) : <div className="text-white/50 text-[13px]">PG programmes will appear here once added</div>}
                  </div>
                </div>
              )}
              <div className="text-white/50 text-[12px] font-semibold">* Accredited by NBA</div>
            </div>
          </div>
        </div>
        <svg className="absolute bottom-0 left-0 w-full h-[64px] block" viewBox="0 0 1440 64" preserveAspectRatio="none"><path d="M0,64 L0,8 Q720,76 1440,8 L1440,64 Z" fill="#ffffff" /></svg>
      </section>

      {/* ALUMNI SUCCESS STORIES - KCE overlapping carousel */}
      <section id="alumni" className="scroll-mt-[100px] lg:scroll-mt-[150px] bg-[#F4F2EE] overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 pt-14 sm:pt-16">
          <h2 className="text-center text-[28px] sm:text-[34px] font-extrabold uppercase tracking-tight text-[#1A3263]">Alumni Success Stories</h2>
        </div>
        {alumni.length > 0 ? (
          <AlumniCarousel alumni={alumni} />
        ) : (
          <div className="mx-auto max-w-[1600px] px-6 pb-10 mt-12 text-center text-[13px] text-[#547792]">Alumni success stories will appear here once the college adds them</div>
        )}
      </section>

      {/* STUDENTS ACHIEVEMENTS - KCE tall cards */}
      <section id="achievements" className="scroll-mt-[100px] lg:scroll-mt-[150px] bg-white">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-14 sm:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[28px] sm:text-[34px] font-extrabold uppercase tracking-tight text-[#1A3263]">Students Achievements</h2>
            {achievements.length > 1 && (
              <div className="flex gap-2.5">
                <button onClick={() => setAchPage(p => (p - 1 + achPages) % achPages)} className="h-11 w-11 rounded-full border-2 border-[#E8E2DB] text-[#1A3263] grid place-items-center hover:border-[#FAB95B] hover:text-[#FAB95B] transition-colors" aria-label="Previous"><ChevronLeft size={18} /></button>
                <button onClick={() => setAchPage(p => (p + 1) % achPages)} className="h-11 w-11 rounded-full border-2 border-[#E8E2DB] text-[#1A3263] grid place-items-center hover:border-[#FAB95B] hover:text-[#FAB95B] transition-colors" aria-label="Next"><ChevronRight size={18} /></button>
              </div>
            )}
          </div>
          {achievements.length > 0 ? (
            <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {achievements.slice(achPage * 4, achPage * 4 + 4).map((a, i) => (
                <div key={a.id || i} className="relative h-[430px] rounded-[20px] overflow-hidden shadow-lg group">
                  {a.image ? (
                    <img src={a.image} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" alt={a.title} />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1A3263] to-[#547792]"></div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent pt-24"></div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div className="text-white font-extrabold text-[16px] leading-snug min-h-[48px]">{a.title}</div>
                    <button onClick={() => setSelAchievement(a)} className="mt-4 w-full h-11 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold flex items-center justify-center gap-2 hover:bg-[#FAB95B]/90 transition-colors">Know More <span>→</span></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-10 py-12 text-center text-[13px] text-[#547792]">Student achievements will appear here once the college adds them</div>
          )}
        </div>
      </section>

      {/* LATEST NEWS + UPCOMING EVENTS - KCE layout */}
      <section id="news" className="scroll-mt-[100px] lg:scroll-mt-[150px] bg-white border-t border-[#E8E2DB]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-14 sm:py-16">
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FAB95B] flex items-center gap-2.5"><span className="h-[3px] w-8 bg-[#FAB95B] inline-block"></span>Discover {shortName || 'College'}</div>
                  <h2 className="mt-2 text-[28px] sm:text-[34px] font-extrabold uppercase tracking-tight text-[#1A3263]">Latest News</h2>
                </div>
                {newsList.length > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="text-[15px] font-extrabold text-[#1A3263]">{String(newsPage + 1).padStart(2, '0')} <span className="text-[#547792]/60">/ {String(newsList.length).padStart(2, '0')}</span></span>
                    <button onClick={() => setNewsPage(p => (p - 1 + newsPages) % newsPages)} className="h-10 w-10 rounded-full border-2 border-[#E8E2DB] text-[#1A3263] grid place-items-center hover:border-[#FAB95B] hover:text-[#FAB95B] transition-colors" aria-label="Previous"><ChevronLeft size={16} /></button>
                    <button onClick={() => setNewsPage(p => (p + 1) % newsPages)} className="h-10 w-10 rounded-full border-2 border-[#E8E2DB] text-[#1A3263] grid place-items-center hover:border-[#FAB95B] hover:text-[#FAB95B] transition-colors" aria-label="Next"><ChevronRight size={16} /></button>
                  </div>
                )}
              </div>
              {newsList.length > 0 ? (
                <div className="mt-8 grid sm:grid-cols-2 gap-6">
                  {newsList.slice(newsPage * 2, newsPage * 2 + 2).map((n, i) => {
                    const d = new Date(n.date)
                    const day = isNaN(d.getTime()) ? '' : String(d.getDate()).padStart(2, '0')
                    const mon = isNaN(d.getTime()) ? '' : d.toLocaleString('en', { month: 'short' }).toUpperCase()
                    return (
                      <div key={n.id || i} className="rounded-[16px] bg-white border border-[#E8E2DB] shadow-md overflow-hidden">
                        <div className="relative h-[225px] bg-[#E8E2DB]">
                          {n.image ? <img src={n.image} className="h-full w-full object-cover" alt={n.title} /> : <div className="h-full w-full bg-gradient-to-br from-[#1A3263] to-[#547792]"></div>}
                          {day && (
                            <div className="absolute bottom-3 left-3 rounded-[10px] bg-[#1A3263] px-3.5 py-2 text-center shadow-lg">
                              <div className="text-[16px] font-extrabold text-white leading-none">{day}</div>
                              <div className="text-[8.5px] font-extrabold text-[#FAB95B] tracking-[0.1em] mt-0.5">{mon}</div>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <div className="text-[16px] font-extrabold text-[#1A3263] leading-snug">{n.title}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="mt-10 py-14 text-center text-[13px] text-[#547792]">News will appear here once the college adds it</div>
              )}
              <button onClick={() => scrollId('events')} className="mt-8 h-12 px-8 rounded-full bg-[#FAB95B] text-[#1A3263] text-[13px] font-extrabold inline-flex items-center gap-2 hover:bg-[#FAB95B]/90 transition-colors">View All News <span>→</span></button>
            </div>
            <div className="rounded-[20px] bg-[#1A3263] p-6 sm:p-7 shadow-xl">
              <h3 className="text-white font-extrabold text-[21px]">Upcoming Events</h3>
              <div className="mt-5 space-y-0">
                {upcomingList.length > 0 ? upcomingList.map((e, i) => {
                  const d = new Date(e.date)
                  const day = isNaN(d.getTime()) ? '' : String(d.getDate()).padStart(2, '0')
                  const mon = isNaN(d.getTime()) ? '' : d.toLocaleString('en', { month: 'short' }).toUpperCase()
                  return (
                    <div key={e.id || i} className="flex items-start gap-3.5 py-4 border-b border-white/10 last:border-0">
                      <div className="w-[46px] h-[46px] rounded-[10px] bg-white/10 grid place-items-center text-center shrink-0">
                        <div><div className="text-[8.5px] font-extrabold text-[#FAB95B] tracking-[0.1em] leading-none">{mon}</div><div className="text-[16px] font-extrabold text-white leading-tight">{day}</div></div>
                      </div>
                      <div className="text-[12.5px] font-semibold text-white/85 leading-snug pt-1">{e.title}</div>
                    </div>
                  )
                }) : <div className="py-8 text-center text-[12px] text-white/50">Upcoming events will appear here</div>}
              </div>
              <button onClick={() => scrollId('events')} className="mt-5 w-full h-11 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold flex items-center justify-center gap-2 hover:bg-[#FAB95B]/90 transition-colors">More News <span>→</span></button>
            </div>
          </div>
        </div>
      </section>

      {/* PLACEMENT & TRAINING - KCE dark layout */}
      <section id="placements" className="scroll-mt-[100px] lg:scroll-mt-[150px] relative bg-[#1A3263] overflow-hidden">
        {progBg ? <img src={progBg} className="absolute inset-0 h-full w-full object-cover opacity-15" alt="" /> : null}
        <div className="absolute inset-0 bg-[#1A3263]/92"></div>
        <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12 py-14 sm:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h2 className="text-[28px] sm:text-[34px] font-extrabold text-white">Placement &amp; Training</h2>
            <p className="mt-5 text-[14px] leading-[1.95] text-white/75 max-w-[540px]">{homePage.placementText || 'The placement cell takes immense effort in guiding the students for their successful career. The college has active MoUs & Centers of Excellence with various industries. The college is visited by multinational companies year after year and has a strong placement record.'}</p>
            <button onClick={() => scrollId('placement-records')} className="mt-8 h-11 px-8 rounded-full bg-[#FAB95B] text-[#1A3263] text-[13px] font-extrabold inline-flex items-center gap-2 hover:bg-[#FAB95B]/90 transition-colors">Know More <span>→</span></button>
          </div>
          <div className="rounded-[20px] bg-white/5 border border-white/15 backdrop-blur-sm p-4 grid grid-cols-3 gap-4">
            <div className="rounded-[14px] bg-[#1A3263] border border-white/10 py-7 sm:py-9 text-center">
              <div className="text-[30px] sm:text-[40px] font-extrabold text-white leading-none">{statPl}<span className="text-[20px] sm:text-[24px]">+</span></div>
              <div className="mt-3 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-white/60">Placements</div>
            </div>
            <div className="rounded-[14px] bg-[#1A3263] border border-white/10 py-7 sm:py-9 text-center">
              <div className="text-[30px] sm:text-[40px] font-extrabold text-white leading-none">{statCo}<span className="text-[20px] sm:text-[24px]">+</span></div>
              <div className="mt-3 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-white/60">Companies</div>
            </div>
            <div className="rounded-[14px] bg-[#FAB95B] py-7 sm:py-9 text-center">
              <div className="text-[30px] sm:text-[40px] font-extrabold text-[#1A3263] leading-none">{statLpa}</div>
              <div className="mt-3 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-[#1A3263]/60">LPA - Max Salary</div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRY & COLLEGE - KCE logo grid */}
      {industryItems.length > 0 && (
        <section id="industry" className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <h2 className="text-center text-[28px] sm:text-[32px] font-extrabold uppercase tracking-tight text-[#1A3263]">Industry &amp; {shortName || 'College'}</h2>
            <div className="mt-9 grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2.5">
              {industryItems.slice(0, 54).map((it, i) => (
                <div key={i} className="h-[74px] rounded-[10px] border border-[#E8E2DB] bg-white grid place-items-center p-3 overflow-hidden hover:border-[#FAB95B]/60 transition-colors">
                  {it.url ? <img src={it.url} className="max-h-full max-w-full object-contain" alt={it.name || ('Industry ' + (i + 1))} /> : <span className="text-[10.5px] font-extrabold text-[#1A3263]/60 text-center leading-tight">{it.name}</span>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* QUICK LINKS ROW - KCE style */}
      <section className="bg-white border-t border-[#E8E2DB]">
        <div className="mx-auto max-w-[1250px] px-4 sm:px-6 py-7">
          <div className="flex flex-wrap items-stretch justify-center divide-x divide-[#E8E2DB]">
            {quickLinks.map(q => {
              const Icon = q.icon === 'user' ? User : q.icon === 'book' ? BookOpen : q.icon === 'cap' ? GraduationCap : q.icon === 'users' ? Users : Landmark
              return (
                <a key={q.label} href={q.href} target={q.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" onClick={e => { if (!q.href.startsWith('http')) { e.preventDefault(); scrollId(q.href.replace('#', '')) } }} className="flex flex-col items-center gap-2.5 px-5 sm:px-10 py-2 group">
                  <Icon size={27} className="text-[#1A3263] group-hover:text-[#FAB95B] transition-colors" strokeWidth={1.8} />
                  <span className="text-[12.5px] font-bold text-[#1A3263] whitespace-nowrap group-hover:text-[#FAB95B] transition-colors">{q.label}</span>
                </a>
              )
            })}
          </div>
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

      </>) : activeDept ? (
        <DeptPage dept={activeDept} data={deptPages[String(activeDept.id)] || deptPages[activeDept.id] || {}} onNavigate={navigateSite} campusImages={campusImages} branding={branding} />
      ) : (
        <AboutPages
          page={sitePage}
          college={college}
          branding={branding}
          homePage={homePage}
          aboutPages={aboutPages}
          about={about}
          managementList={mgmtBase}
          courses={courses}
          campusImages={campusImages}
          shortName={shortName}
          onNavigate={navigateSite}
        />
      )}

      {/* KCE-style footer */}
      <footer id="contact" className="scroll-mt-[120px] bg-[#1A3263] text-white">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
          <div className="py-8 flex flex-wrap items-center justify-between gap-4">
            <h3 className="text-[24px] sm:text-[28px] font-extrabold">Placement Offers</h3>
            <button onClick={() => scrollId('placements')} className="h-11 px-7 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#FAB95B]/90 transition-colors">Know More <span>→</span></button>
          </div>
          <div className="border-t border-white/10 pt-10 pb-14 grid sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.5fr] gap-x-10 gap-y-10">
            <FooterLinkCol title="Quick Links" links={(footerLinksData && footerLinksData.quick) || ['Policies and Regulations', 'AICTE Extension of Approval', 'Anna University Provisional Affiliation', 'Anna University - Permanent Affiliation', 'Mandatory Disclosure', 'Accreditation Status', 'Statutory', 'Non-Statutory', 'Undertaking', 'Institute Strategic Plan', 'Audit Report', 'Handbook on Basics of Cyber Hygiene']} />
            <FooterLinkCol title="Information About" links={(footerLinksData && footerLinksData.about) || ['Academic Calendar', 'Sports Facilities', 'E-FACILITY', (shortName || 'College') + '-Help Desk', 'Online Feedback 1', 'Online Feedback 2', 'Course End Survey', 'Online Payment']} />
            <FooterLinkCol title="Information For" links={(footerLinksData && footerLinksData.for) || ['Applications FAQ', 'Hostel', 'Blog', 'Admission Enquiry', 'Careers']} />
            <div>
              <div className="flex items-center gap-3.5">
                {branding.logo ? (
                  <img src={branding.logo} className="h-14 w-14 rounded-[12px] bg-white object-cover shrink-0" alt={college.name} />
                ) : (
                  <div className="h-14 w-14 rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-extrabold text-[22px] shrink-0">{(college.name || 'C')[0]}</div>
                )}
                <div className="min-w-0">
                  <div className="font-extrabold text-[16px] leading-tight">{college.name}</div>
                  {settings?.tagline ? <div className="text-[10px] text-[#FAB95B] mt-1 font-semibold tracking-wide">{settings.tagline}</div> : null}
                </div>
              </div>
              <div className="mt-5 text-[10.5px] leading-[1.75] text-white/60 whitespace-pre-line">{homePage.footerAbout || ('Approved by AICTE and Affiliated to ' + (college.affiliation || college.university || 'Anna University') + '\n' + (college.accreditation || 'Accredited Institution') + '\n(An ISO 9001:2015 and ISO 14001:2015 Certified Institution)')}</div>
              <div className="mt-6 space-y-3.5 text-[12.5px] text-white/80">
                <div className="flex gap-3"><MapPin size={15} className="text-[#FAB95B] shrink-0 mt-0.5" /><span>{(contactDetails?.address || college.address || '') + (contactDetails?.city || college.city ? ', ' + (contactDetails?.city || college.city) : '')}{college.district ? ', ' + college.district : ''} - {(contactDetails?.pincode || college.pincode || '')}{(contactDetails?.state || '') ? ', ' + contactDetails.state + ', India' : ', India'}</span></div>
                <div className="flex gap-3"><Phone size={15} className="text-[#FAB95B] shrink-0 mt-0.5" /><span>{(contactDetails?.phone || college.phone || '').split('/')[0].trim()}{(contactDetails?.phone2 || '') ? ', ' + contactDetails.phone2 : ''}</span></div>
                <div className="flex gap-3"><Mail size={15} className="text-[#FAB95B] shrink-0 mt-0.5" /><span>{contactDetails?.email || (college.contact && college.contact.email) || college.email}</span></div>
              </div>
              <div className="mt-5 flex gap-4">
                <a href="#" className="text-[#FAB95B] hover:text-white transition-colors" aria-label="Facebook"><BrandIcon name="facebook" /></a>
                <a href="#" className="text-[#FAB95B] hover:text-white transition-colors" aria-label="Instagram"><BrandIcon name="instagram" /></a>
                <a href="#" className="text-[#FAB95B] hover:text-white transition-colors" aria-label="X"><BrandIcon name="x" size={14} /></a>
                <a href="#" className="text-[#FAB95B] hover:text-white transition-colors" aria-label="YouTube"><BrandIcon name="youtube" /></a>
                <a href="#" className="text-[#FAB95B] hover:text-white transition-colors" aria-label="LinkedIn"><BrandIcon name="linkedin" /></a>
              </div>
              <div className="mt-5 text-[11px] text-white/50">Copyright {new Date().getFullYear()} © {shortName || college.name}. All Rights Reserved.</div>
            </div>
          </div>
        </div>
        {/* College name watermark */}
        <div className="overflow-hidden leading-none select-none pointer-events-none">
          <div className="text-center text-[17vw] font-extrabold uppercase tracking-tighter text-[#152B52] -mb-[3.5vw] whitespace-nowrap">{shortName || (college.name || 'COLLEGE').split(' ')[0]}</div>
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
