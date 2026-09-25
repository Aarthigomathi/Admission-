import {
  ChevronRight, ChevronsRight, Award, Briefcase, Globe2, Monitor, BookOpen, FileText,
  Wifi, ShieldCheck, Clock, Dumbbell, Utensils, Users, Bus, Check, ArrowUpRight, Medal
} from 'lucide-react'

/* ---------- helpers ---------- */

function Rich({ text, className = '' }) {
  const parts = String(text || '').split('**')
  return (
    <span className={className}>
      {parts.map((p, i) => (i % 2 === 1
        ? <strong key={i} className="font-extrabold text-[#FAB95B]">{p}</strong>
        : <span key={i}>{p}</span>))}
    </span>
  )
}

function LogoCell({ item, h = 'h-14', boxed = false }) {
  const inner = item.url ? (
    <img src={item.url} alt={item.name || 'logo'} className={`${h} w-auto max-w-[170px] object-contain`} />
  ) : (
    <span className="text-[15px] sm:text-[17px] font-extrabold tracking-tight text-[#547792] whitespace-nowrap">{item.name}</span>
  )
  if (!boxed) return <div className="px-5 py-3 flex items-center justify-center">{inner}</div>
  return <div className="bg-white border border-[#E8E2DB] rounded-[6px] px-6 py-5 grid place-items-center min-h-[86px]">{inner}</div>
}

const STAT_ICONS = [Award, Briefcase, Globe2, Monitor, BookOpen, FileText]
const LIFE_ICONS = [Globe2, Wifi, ShieldCheck, Clock, Dumbbell, Utensils, Users, Bus]

/* ---------- shared chrome ---------- */

function Banner({ title, onNavigate }) {
  return (
    <div className="bg-[#1A3263]">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-10 sm:py-12">
        <div className="flex items-center gap-2 text-[12.5px] font-semibold">
          <button onClick={() => onNavigate('home')} className="text-white/85 hover:text-[#FAB95B] transition-colors cursor-pointer">Home</button>
          <ChevronRight size={13} className="text-white/50" />
          <span className="text-[#FAB95B]">{title}</span>
        </div>
        <div className="mt-5 flex items-center gap-4">
          <span className="h-[5px] w-[64px] rounded-full bg-[#FAB95B]"></span>
          <h1 className="text-[30px] sm:text-[38px] font-extrabold text-white tracking-tight">{title}</h1>
        </div>
      </div>
    </div>
  )
}

function SideNav({ page, onNavigate, shortName }) {
  const items = [
    { id: 'about-profile', label: 'About ' + (shortName || 'College') },
    { id: 'about-vision', label: 'Vision & Mission' },
    { id: 'about-management', label: 'Management Profile' },
    { id: 'home', anchor: 'programmes', label: 'Programmes Offered' },
    { id: 'about-coe', label: 'Center of Excellence' },
    { id: 'about-accreditations', label: 'Accreditations' },
    { id: 'home', anchor: 'placements', label: 'Placement' },
  ]
  return (
    <aside className="w-full lg:w-[290px] shrink-0">
      <div className="lg:sticky lg:top-[150px]">
        <div className="h-[4px] w-full bg-[#FAB95B] rounded-full"></div>
        <div className="mt-2">
          {items.map((it, i) => {
            const active = !it.anchor && it.id === page
            return (
              <button
                key={i}
                onClick={() => onNavigate(it.id, it.anchor)}
                className={`w-full text-left px-4 py-[18px] border-b border-[#E8E2DB] text-[14.5px] transition-colors cursor-pointer ${active ? 'font-extrabold text-[#FAB95B]' : 'font-medium text-[#547792] hover:text-[#1A3263]'}`}
              >
                {it.label}
              </button>
            )
          })}
        </div>
      </div>
    </aside>
  )
}

function Shell({ page, titles, onNavigate, shortName, children }) {
  return (
    <div className="bg-[#F4F1EB]">
      <Banner title={titles[page] || 'About'} onNavigate={onNavigate} />
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-12 lg:py-16 flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
        <div className="flex-1 min-w-0 w-full">{children}</div>
        <SideNav page={page} onNavigate={onNavigate} shortName={shortName} />
      </div>
    </div>
  )
}

/* ---------- PROFILE ---------- */

function ProfilePage({ d, college, about, campusImages, branding, courses, shortName }) {
  const paras = (d.paragraphs && d.paragraphs.length ? d.paragraphs : [about.fullText, about.overview, about.history].filter(Boolean))
  const card = d.cardText || []
  const img = d.image || campusImages[0] || branding.heroImage || college.branding?.heroImage || ''
  const highlights = d.highlights || []
  const stats = d.stats || []
  const life = d.campusLife || []
  return (
    <div>
      <h2 className="text-[28px] sm:text-[34px] font-extrabold text-[#1A3263] tracking-tight">{d.heading || ('About ' + college.name)}</h2>
      <div className="mt-7 space-y-5">
        {paras.map((p, i) => (
          <p key={i} className="text-[14.5px] leading-[1.95] text-[#547792]"><Rich text={p} /></p>
        ))}
      </div>

      {(img || card.length > 0) && (
        <div className="mt-12 grid md:grid-cols-[0.9fr_1.1fr] gap-8 items-stretch">
          {img ? (
            <div className="relative">
              <img src={img} alt={college.name} className="w-full h-[340px] sm:h-[430px] object-cover rounded-[22px] rounded-br-[70px] shadow-sm" />
              <div className="absolute bottom-0 right-0 h-[74px] w-[86px] bg-white rounded-tl-[26px] rounded-br-[22px] grid place-items-center">
                {branding.logo ? <img src={branding.logo} className="h-9 w-9 object-contain" alt="logo" /> : <span className="text-[22px] font-extrabold text-[#1A3263]">{(shortName || 'C')[0]}</span>}
              </div>
            </div>
          ) : <div />}
          {card.length > 0 && (
            <div className="bg-[#ECE7DF] rounded-[18px] p-8 sm:p-10 space-y-5">
              {card.map((p, i) => (
                <p key={i} className="text-[14px] leading-[1.9] text-[#547792]"><Rich text={p} /></p>
              ))}
            </div>
          )}
        </div>
      )}

      {highlights.length > 0 && (
        <div className="mt-14">
          <h3 className="text-[26px] sm:text-[30px] font-extrabold text-[#1A3263]">Highlights</h3>
          <div className="mt-7 space-y-4">
            {highlights.map((h, i) => (
              <div key={i} className={`flex items-center gap-4 rounded-[12px] bg-white shadow-sm border border-[#E8E2DB] border-l-[5px] ${i % 2 === 0 ? 'border-l-[#FAB95B]' : 'border-l-[#1A3263]'} px-5 py-4`}>
                <span className={`h-10 w-10 shrink-0 rounded-[10px] grid place-items-center ${i % 2 === 0 ? 'bg-[#FAB95B]/15 text-[#1A3263]' : 'bg-[#1A3263]/8 text-[#1A3263]'}`}>
                  <ChevronsRight size={17} />
                </span>
                <span className="text-[13.5px] font-semibold text-[#1A3263] leading-relaxed">{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(d.whyHeading || stats.length > 0) && (
        <div className="mt-14 rounded-[24px] bg-white border border-[#E8E2DB] p-8 sm:p-11">
          <div className="flex items-center gap-3">
            <span className="h-[2px] w-7 bg-[#FAB95B]"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FAB95B]">Why {shortName || 'Us'}?</span>
          </div>
          <h3 className="mt-4 text-[26px] sm:text-[32px] font-extrabold text-[#1A3263] tracking-tight">{d.whyHeading || 'Your Campus. Your Opportunities.'}</h3>
          {d.whyText ? <p className="mt-4 max-w-[640px] text-[14px] leading-[1.9] text-[#547792]">{d.whyText}</p> : null}
          {stats.length > 0 && (
            <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {stats.slice(0, 6).map((s, i) => {
                const Icon = STAT_ICONS[i % STAT_ICONS.length]
                return (
                  <div key={i} className="relative overflow-hidden rounded-[14px] bg-white border border-[#E8E2DB] shadow-sm p-5 flex items-center gap-4">
                    <span className="h-12 w-12 shrink-0 rounded-[12px] bg-[#FAB95B]/20 grid place-items-center"><Icon size={20} className="text-[#FAB95B]" /></span>
                    <div>
                      <div className="text-[26px] leading-none font-extrabold text-[#FAB95B]">{s.value}</div>
                      <div className="mt-1.5 text-[12.5px] font-extrabold text-[#1A3263] leading-snug">{s.label}</div>
                    </div>
                    <span className="absolute -bottom-3 right-2 text-[64px] font-extrabold text-[#1A3263]/5 select-none pointer-events-none">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                )
              })}
            </div>
          )}

          {life.length > 0 && (
            <div className="mt-9 rounded-[20px] bg-[#12264B] p-7 sm:p-9" style={{ backgroundColor: '#142B57' }}>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#FAB95B]">Beyond Academics</div>
              <h4 className="mt-2 text-[22px] sm:text-[26px] font-extrabold text-white">Everything You Need for Campus Life</h4>
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {life.slice(0, 8).map((c, i) => {
                  const Icon = LIFE_ICONS[i % LIFE_ICONS.length]
                  return (
                    <div key={i} className="rounded-[12px] bg-white/5 border border-white/10 p-4 flex items-center gap-3">
                      <span className="h-10 w-10 shrink-0 rounded-[10px] bg-[#FAB95B]/15 grid place-items-center"><Icon size={17} className="text-[#FAB95B]" /></span>
                      <span className="text-[12.5px] font-extrabold text-white leading-snug">{c}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {courses.length > 0 && (
        <div className="mt-16">
          <h3 className="text-center text-[28px] sm:text-[32px] font-extrabold text-[#1A3263]">Programmes</h3>
          <div className="mt-9 flex flex-wrap justify-center gap-x-4 gap-y-4">
            {courses.map((c, i) => (
              <span key={i} className="relative inline-flex items-center rounded-full bg-[#547792]/15 overflow-hidden">
                <span className="absolute left-4 top-0 bottom-0 w-7 bg-[#547792]/20 -skew-x-[20deg]"></span>
                <span className="relative px-9 py-3 text-[13px] font-bold text-[#1A3263]">{[c.degree, c.name].filter(Boolean).join(' ')}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- VISION & MISSION ---------- */

function VisionPage({ d, about }) {
  const vision = d.visionText || about.vision || ''
  const bullets = d.missionBullets || (about.mission ? String(about.mission).split(/[,]/).map(s => s.trim()).filter(Boolean) : [])
  const values = d.coreValues || []
  return (
    <div>
      {vision && (
        <div className="relative rounded-[16px] bg-white shadow-sm border border-[#E8E2DB] p-8 sm:p-11 overflow-hidden">
          <span className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-b from-[#FAB95B] to-[#1A3263]"></span>
          <span className="inline-block px-5 py-1.5 rounded-full bg-[#FAB95B]/20 text-[12px] font-bold text-[#1A3263]">Vision</span>
          <h3 className="mt-5 text-[26px] sm:text-[30px] font-extrabold text-[#1A3263]">Our Vision</h3>
          <p className="mt-5 text-[14.5px] leading-[2] text-[#547792]">{vision}</p>
        </div>
      )}
      {bullets.length > 0 && (
        <div className="mt-9 relative rounded-[16px] bg-white shadow-sm border border-[#E8E2DB] p-8 sm:p-11 overflow-hidden">
          <span className="absolute left-0 top-0 bottom-0 w-[6px] bg-gradient-to-b from-[#FAB95B] to-[#1A3263]"></span>
          <span className="inline-block px-5 py-1.5 rounded-full bg-[#FAB95B]/20 text-[12px] font-bold text-[#1A3263]">Mission</span>
          <h3 className="mt-5 text-[26px] sm:text-[30px] font-extrabold text-[#1A3263]">Our Mission</h3>
          <div className="mt-6 space-y-4">
            {bullets.map((b, i) => (
              <div key={i} className="flex gap-3">
                <ChevronsRight size={17} className="shrink-0 mt-1 text-[#FAB95B]" />
                <p className="text-[14px] leading-[1.9] text-[#547792]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {values.length > 0 && (
        <div className="mt-14">
          <h3 className="text-[26px] sm:text-[30px] font-extrabold text-[#1A3263]">Core Values</h3>
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <div key={i} className="rounded-[16px] bg-[#547792]/10 p-8">
                <Medal size={42} className="text-[#1A3263]" />
                <h4 className="mt-5 text-[16.5px] font-extrabold uppercase text-[#1A3263] leading-snug">{v.title}</h4>
                <p className="mt-3 text-[13.5px] leading-[1.85] text-[#547792]">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- MANAGEMENT ---------- */

function ManagementPage({ list }) {
  if (!list || list.length === 0) return <p className="text-[14px] text-[#547792]">Management profiles will appear here once the college adds them from the dashboard.</p>
  return (
    <div>
      {list.map((m, i) => (
        <div key={i}>
          {i > 0 && <div className="border-t border-[#E8E2DB] my-12"></div>}
          <div className={`grid md:grid-cols-[280px_1fr] gap-8 items-start ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}>
            <div className="md:[direction:ltr]">
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="w-full max-w-[280px] h-[300px] object-cover object-top border-l-[5px] border-[#1A3263]" />
              ) : (
                <div className="w-full max-w-[280px] h-[300px] grid place-items-center bg-[#547792]/15 border-l-[5px] border-[#1A3263] text-[54px] font-extrabold text-[#1A3263]">{(m.name || 'P')[0]}</div>
              )}
            </div>
            <div className="md:[direction:ltr]">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#547792]">{m.role}</div>
              <h3 className="mt-2 text-[26px] sm:text-[30px] font-extrabold text-[#1A3263]">{m.name}</h3>
              <div className="mt-5 space-y-4">
                {(m.bio || []).map((p, j) => (
                  <p key={j} className="text-[14px] leading-[1.95] text-[#547792]"><Rich text={p} /></p>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------- ORG STRUCTURE ---------- */

function OrgPage({ d }) {
  if (!d.chartImage) return <p className="text-[14px] text-[#547792]">The organizational structure chart will appear here once the college uploads it from the dashboard.</p>
  return (
    <div className="bg-white rounded-[12px] border border-[#E8E2DB] p-4 sm:p-8">
      <img src={d.chartImage} alt="Organizational Structure" className="w-full max-w-[1150px] mx-auto object-contain" />
    </div>
  )
}

/* ---------- CENTER OF EXCELLENCE ---------- */

function CoePage({ d }) {
  const cats = d.categories || []
  const inn = d.innovation || {}
  return (
    <div>
      {cats.map((c, i) => (
        <div key={i} className={i > 0 ? 'mt-16' : ''}>
          <h3 className="text-center text-[24px] sm:text-[28px] font-extrabold text-[#1A3263]">{c.title}</h3>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            {(c.logos || []).map((l, j) => <LogoCell key={j} item={l} />)}
          </div>
        </div>
      ))}
      {(inn.title || (inn.text || []).length > 0 || inn.image) && (
        <div className="mt-16 -mx-6 lg:-mx-12 bg-[#547792]/10 py-14">
          <div className="px-6 lg:px-12 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-[26px] sm:text-[30px] font-extrabold text-[#1A3263] leading-snug">{inn.title}</h3>
              <div className="mt-6 space-y-4">
                {(inn.text || []).map((p, i) => (
                  <p key={i} className="text-[14px] leading-[1.9] text-[#547792]">{p}</p>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1A3263] hover:text-[#547792] cursor-pointer">Know More <ArrowUpRight size={14} /></span>
            </div>
            {inn.image ? <img src={inn.image} alt={inn.title || 'Innovation Centre'} className="w-full h-[320px] sm:h-[400px] object-cover rounded-[14px] shadow-md" /> : <div />}
          </div>
        </div>
      )}
      {cats.length === 0 && !inn.title && <p className="text-[14px] text-[#547792]">Centres of excellence will appear here once the college adds them from the dashboard.</p>}
    </div>
  )
}

/* ---------- ACCREDITATIONS ---------- */

function AccredPage({ d, college }) {
  const naac = { logo: d.naacLogo, title: d.naacTitle || 'NAAC (National Assessment And Accreditation Council)', text: d.naacText || ((college.accreditation || '') ? college.name + ' is accredited by ' + college.accreditation + '.' : '') }
  const nba = { logo: d.nbaLogo, title: d.nbaTitle || 'NBA (National Board Of Accreditation)', text: d.nbaText || (college.name + ' is accredited by NBA for the following departments:'), items: d.nbaItems || [] }
  const mous = d.mous || []
  const electives = d.electives || []
  return (
    <div>
      <div className="rounded-[14px] bg-[#547792]/10 grid md:grid-cols-2 overflow-hidden">
        <div className="p-8 sm:p-12 border-b md:border-b-0 md:border-r border-[#547792]/15">
          <div className="inline-block bg-white px-6 py-5 rounded-[4px] shadow-sm">
            {naac.logo ? <img src={naac.logo} className="h-16 w-auto object-contain" alt="NAAC" /> : <Award size={44} className="text-[#1A3263]" />}
          </div>
          <h3 className="mt-7 text-[24px] sm:text-[27px] font-extrabold text-[#1A3263] leading-snug">{naac.title}</h3>
          <p className="mt-5 text-[14px] leading-[1.9] text-[#547792]">{naac.text}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1A3263]">For more Informations <ArrowUpRight size={14} /></span>
        </div>
        <div className="p-8 sm:p-12">
          <div className="inline-block bg-white px-6 py-5 rounded-[4px] shadow-sm">
            {nba.logo ? <img src={nba.logo} className="h-16 w-auto object-contain" alt="NBA" /> : <Medal size={44} className="text-[#1A3263]" />}
          </div>
          <h3 className="mt-7 text-[24px] sm:text-[27px] font-extrabold text-[#1A3263] leading-snug">{nba.title}</h3>
          <p className="mt-5 text-[14px] leading-[1.9] text-[#547792]">{nba.text}</p>
          {nba.items.length > 0 && (
            <div className="mt-5 space-y-3">
              {nba.items.map((it, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="h-6 w-6 shrink-0 rounded-full bg-[#FAB95B] grid place-items-center"><Check size={13} className="text-white" strokeWidth={3} /></span>
                  <span className="text-[14px] font-semibold text-[#1A3263]">{it}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {(d.companiesHeading || mous.length > 0) && (
        <div className="mt-16">
          {d.companiesHeading ? <h3 className="text-center text-[24px] sm:text-[30px] font-extrabold text-[#1A3263] leading-snug">{d.companiesHeading}</h3> : null}
          {d.mouIntro ? <p className="mt-5 text-center text-[14px] text-[#547792]">{d.mouIntro}</p> : null}
          {mous.length > 0 && (
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-8">
              {mous.map((m, i) => (
                <div key={i} className="w-[210px] text-center">
                  <LogoCell item={{ name: m.name, url: m.url }} boxed />
                  <div className="mt-3 text-[13px] font-medium text-[#547792] leading-snug">{m.caption || m.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {electives.length > 0 && (
        <div className="mt-16">
          <h3 className="text-center text-[24px] sm:text-[30px] font-extrabold text-[#1A3263]">{d.electivesTitle || 'Electives'}</h3>
          {d.electivesIntro ? <p className="mt-4 text-center text-[14px] text-[#547792]">{d.electivesIntro}</p> : null}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8 items-center">
            {electives.map((l, i) => <LogoCell key={i} item={l} h="h-12" />)}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- root ---------- */

const TITLES = {
  'about-profile': 'Profile',
  'about-vision': 'Vision & Mission',
  'about-management': 'Management Profile',
  'about-org': 'Organizational Structure',
  'about-coe': 'Center of Excellence',
  'about-accreditations': 'Accreditations',
}

export default function AboutPages(props) {
  const { page, college, branding, about, aboutPages, managementList, courses, campusImages, shortName, onNavigate } = props
  const d = (key, fb = {}) => (aboutPages && aboutPages[key]) || fb
  return (
    <Shell page={page} titles={TITLES} onNavigate={onNavigate} shortName={shortName}>
      {page === 'about-profile' && <ProfilePage d={d('profile')} college={college} about={about} campusImages={campusImages} branding={branding} courses={courses} shortName={shortName} />}
      {page === 'about-vision' && <VisionPage d={d('vision')} about={about} />}
      {page === 'about-management' && <ManagementPage list={managementList} />}
      {page === 'about-org' && <OrgPage d={d('org')} />}
      {page === 'about-coe' && <CoePage d={d('coe')} />}
      {page === 'about-accreditations' && <AccredPage d={d('acc')} college={college} />}
    </Shell>
  )
}
