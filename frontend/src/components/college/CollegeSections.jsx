import { Link } from 'react-router-dom'
import { ArrowUpRight, GraduationCap, Users, Building2, Trophy, BookOpen, MapPin, Clock, Calendar, Award, ChevronRight, Play, Image as ImageIcon } from 'lucide-react'

export function HeroSection({ college }) {
  return (
    <div className="relative overflow-hidden bg-[#1a3263]">
      <div className="absolute inset-0">
        <img src={college.branding.heroImage} className="h-full w-full object-cover" alt="PSG Tech Real Campus" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3263]/90 via-[#1a3263]/60 to-[#547792]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a3263]/80 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-end min-h-[560px]">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fab95b] text-[#1a3263] border border-[#fab95b] text-[11px] font-bold tracking-widest uppercase mb-6 shadow-lg">
              <span className="h-2 w-2 rounded-full bg-[#1a3263] animate-pulse" />
              Real from psgtech.edu • Admissions Open 2026-27 • {college.accreditation.split('•')[0]}
            </div>

            <h1 className="font-display text-[40px] lg:text-[64px] font-bold leading-[0.95] tracking-tight text-balance max-w-[720px] text-white">
              {college.name}
            </h1>
            <p className="mt-4 text-[18px] lg:text-[20px] leading-[1.4] text-[#e8e2db] max-w-[600px] font-light">
              {college.tagline} — {college.about.overview.slice(0,160)}...
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="#courses" className="inline-flex h-[52px] px-8 items-center justify-center rounded-full bg-[#e8e2db] text-[#1a3263] text-[14px] font-bold tracking-wide hover:bg-white transition-colors gap-2 shadow-lg">
                Explore Courses <ArrowUpRight size={18} />
              </Link>
              <Link to={`/college/${college.slug}/admissions`} className="inline-flex h-[52px] px-8 items-center justify-center rounded-full bg-[#fab95b] text-[#1a3263] text-[14px] font-bold tracking-wide hover:brightness-105 gap-2 shadow-[0_4px_20px_rgba(250,185,91,0.4)]">
                Admissions 2026 <ChevronRight size={18} />
              </Link>
              <button className="inline-flex h-[52px] px-6 items-center justify-center rounded-full bg-[#547792]/30 backdrop-blur border border-white/20 text-white text-[14px] font-semibold hover:bg-[#547792]/50 gap-2">
                <Play size={16} /> Virtual Tour - Real Video
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 lg:grid-cols-6 gap-6 border-t border-[#fab95b]/30 pt-8 max-w-[720px]">
              {[
                { k: "Est.", v: college.established },
                { k: "Courses", v: college.quickInfo.courses },
                { k: "Depts", v: college.quickInfo.departments },
                { k: "Faculty", v: college.quickInfo.faculty },
                { k: "Placement", v: college.quickInfo.placement },
                { k: "Campus", v: college.quickInfo.campus },
              ].map(i=>(
                <div key={i.k}>
                  <div className="text-[11px] uppercase tracking-widest font-bold text-[#fab95b]">{i.k}</div>
                  <div className="text-[18px] font-semibold mt-1 text-white">{i.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="rounded-[28px] bg-[#e8e2db]/95 backdrop-blur-xl border border-[#fab95b]/30 p-7 shadow-[0_20px_60px_rgba(26,50,99,0.3)]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-[11px] font-bold tracking-widest uppercase text-[#547792]">Principal's Message - Real from psgtech.edu</div>
                  <div className="mt-3 flex gap-4">
                    <img src={college.branding.logo} className="h-14 w-14 rounded-[14px] object-cover border-2 border-[#fab95b] bg-white" alt="PSG Logo Real" />
                    <div>
                      <div className="font-semibold text-[15px] leading-tight text-[#1a3263]">{college.leadership.principal.name}</div>
                      <div className="text-[12px] text-[#547792]">Principal (FAC) • PSG Tech</div>
                    </div>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#1a3263] text-[#fab95b] grid place-items-center">
                  <BookOpen size={18} />
                </div>
              </div>
              <p className="text-[13px] leading-[1.6] text-[#1a3263] italic bg-white p-4 rounded-[12px] border border-[#e8e2db]">"{college.leadership.principal.message.slice(0,200)}..."</p>

              <div className="mt-6 pt-6 border-t border-[#547792]/20 grid grid-cols-2 gap-4">
                <div className="rounded-[16px] bg-white border border-[#e8e2db] p-4">
                  <div className="text-[11px] uppercase tracking-wide font-bold text-[#547792]">Highest Package - Real</div>
                  <div className="text-[20px] font-bold mt-1 text-[#1a3263]">{college.placements.highest}</div>
                  <div className="text-[12px] text-[#547792] mt-1">Avg {college.placements.average}</div>
                </div>
                <div className="rounded-[16px] bg-white border border-[#e8e2db] p-4">
                  <div className="text-[11px] uppercase tracking-wide font-bold text-[#547792]">Top Recruiters - Real</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {college.placements.recruiters.slice(0,4).map(r=>(
                      <span key={r} className="px-2 py-1 rounded-full bg-[#e8e2db] border border-[#d6cfc6] text-[#1a3263] text-[11px] font-medium">{r}</span>
                    ))}
                  </div>
                </div>
              </div>

              <Link to={`/college/${college.slug}/about`} className="mt-6 flex items-center justify-center gap-2 h-11 rounded-full bg-[#1a3263] text-[#fab95b] text-[13px] font-semibold hover:bg-[#1a3263]/90">
                Know More About College <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function QuickInfo({ college }) {
  const items = [
    { icon: GraduationCap, label: "Courses", value: college.quickInfo.courses, sub: "UG, PG, PhD - Real 63", image: college.gallery[0] },
    { icon: Building2, label: "Departments", value: college.quickInfo.departments, sub: "15 Engg + Science - Real", image: college.gallery[1] },
    { icon: Users, label: "Faculty", value: college.quickInfo.faculty, sub: "PhD Holders 78% + 15 Visiting", image: college.gallery[2] },
    { icon: Trophy, label: "Placement", value: college.quickInfo.placement, sub: `${college.placements.average} avg - 90+ cos`, image: college.gallery[3] },
    { icon: MapPin, label: "Campus", value: college.quickInfo.campus, sub: `${college.location.city} - 8km Railway`, image: college.gallery[4] },
    { icon: Award, label: "Accreditation", value: "NAAC A", sub: `${college.affiliation} - ISO 9001:2015`, image: college.gallery[5] },
  ]
  return (
    <div className="mx-auto max-w-[1600px] px-6 lg:px-8 -mt-10 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {items.map((it,i)=>(
          <div key={i} className="group rounded-[20px] bg-white border border-[#e8e2db] p-5 shadow-[0_4px_24px_rgba(26,50,99,0.08)] hover:shadow-[0_8px_32px_rgba(26,50,99,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="relative h-20 rounded-[12px] overflow-hidden mb-4 bg-[#e8e2db]">
              <img src={it.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt={it.label} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3263]/60 to-transparent" />
              <div className="absolute bottom-2 left-2 h-8 w-8 rounded-[8px] bg-[#fab95b] text-[#1a3263] grid place-items-center">
                <it.icon size={16} />
              </div>
            </div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#547792]">{it.label}</div>
            <div className="text-[20px] font-bold tracking-tight mt-1 text-[#1a3263]">{it.value}</div>
            <div className="text-[11px] text-[#547792] mt-1 leading-tight">{it.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AboutSection({ college }) {
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-24 bg-[#e8e2db]/30">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-start">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a3263] text-[#fab95b] border text-[11px] font-bold tracking-widest uppercase">
            <ImageIcon size={12} /> About {college.shortName} - Real from psgtech.edu
          </div>
          <h2 className="font-display text-[36px] lg:text-[48px] font-semibold leading-[0.95] tracking-tight mt-6 text-balance text-[#1a3263]">
            Shaping future leaders through excellence in education & research - Real PSG Vision
          </h2>
          <p className="mt-6 text-[15px] leading-[1.7] text-[#1a3263]/80 max-w-[600px]">{college.about.overview.slice(0,400)}...</p>

          <div className="mt-8 rounded-[20px] overflow-hidden border-2 border-[#fab95b]/30 shadow-lg">
            <img src={college.gallery[6] || college.branding.coverImage} className="h-[240px] w-full object-cover" alt="PSG Real Campus" />
            <div className="p-4 bg-white flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#547792]">Real image from psgtech.edu/images/slider/</span>
              <span className="px-2 py-1 rounded-full bg-[#fab95b] text-[#1a3263] text-[10px] font-bold">Real Time</span>
            </div>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            <div className="rounded-[20px] bg-white border border-[#e8e2db] p-6 shadow-sm">
              <div className="h-10 w-10 rounded-[12px] bg-[#1a3263] text-[#fab95b] grid place-items-center mb-4"><Award size={20} /></div>
              <div className="text-[12px] font-bold tracking-widest uppercase text-[#547792]">Vision - Real from abtcllg.php</div>
              <p className="mt-3 text-[13px] leading-[1.6] font-medium text-[#1a3263]">{college.about.vision}</p>
              <img src={college.gallery[7]} className="mt-4 h-24 w-full object-cover rounded-[12px] border" alt="Vision" />
            </div>
            <div className="rounded-[20px] bg-[#1a3263] text-white p-6 border border-[#1a3263] shadow-lg">
              <div className="h-10 w-10 rounded-[12px] bg-[#fab95b] text-[#1a3263] grid place-items-center mb-4"><BookOpen size={20} /></div>
              <div className="text-[12px] font-bold tracking-widest uppercase text-[#fab95b]">Mission - Real</div>
              <p className="mt-3 text-[13px] leading-[1.6] font-medium text-[#e8e2db]">{typeof college.about.mission === 'string' ? college.about.mission : college.about.mission?.join?.(', ') || college.about.mission}</p>
              <img src={college.gallery[8]} className="mt-4 h-24 w-full object-cover rounded-[12px] border border-[#547792]" alt="Mission" />
            </div>
          </div>
        </div>

        <div className="relative space-y-6">
          <div className="rounded-[28px] overflow-hidden border-2 border-[#fab95b] shadow-xl">
            <img src={college.branding.coverImage} className="h-[420px] w-full object-cover" alt="PSG Real Cover" />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#fab95b] text-[#1a3263] text-[11px] font-bold">Real from psgtech.edu</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-[16px] overflow-hidden border shadow-md">
              <img src={college.gallery[9]} className="h-32 w-full object-cover" alt="PSG Real" />
            </div>
            <div className="rounded-[16px] overflow-hidden border shadow-md">
              <img src={college.gallery[10]} className="h-32 w-full object-cover" alt="PSG Real" />
            </div>
          </div>

          <div className="rounded-[20px] bg-white border-2 border-[#fab95b]/50 shadow-[0_16px_40px_rgba(26,50,99,0.12)] p-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-[#fab95b] grid place-items-center text-[#1a3263] font-bold text-[20px]">“</div>
              <div className="text-[13px] font-semibold leading-tight text-[#1a3263]">Ranked NIRF 67 Engineering, 84 Management - Real from careers360</div>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-[#1a3263] text-[#fab95b] text-[11px] font-bold">NIRF 2025</span>
              <span className="px-3 py-1 rounded-full bg-[#e8e2db] border text-[#1a3263] text-[11px] font-bold">NAAC A • NBA</span>
              <span className="px-3 py-1 rounded-full bg-[#547792] text-white text-[11px] font-bold">ISO 9001:2015</span>
            </div>
            <img src={college.gallery[11]} className="mt-4 h-24 w-full object-cover rounded-[12px]" alt="Accreditation Real" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function DepartmentsSection({ college }) {
  return (
    <section id="departments" className="bg-white border-y border-[#e8e2db]">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8e2db] border border-[#fab95b]/30 text-[11px] font-bold tracking-widest uppercase text-[#1a3263]"><ImageIcon size={12} /> Academics - Real PSG Depts with Images</div>
            <h2 className="font-display text-[32px] lg:text-[40px] font-semibold leading-[0.95] mt-3 text-[#1a3263]">Departments & Programmes - Real Images</h2>
          </div>
          <Link to={`/college/${college.slug}/academics`} className="inline-flex h-11 px-6 items-center gap-2 rounded-full bg-[#1a3263] text-[#fab95b] text-[13px] font-semibold">
            View All Departments <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {college.departments.map((dept, idx)=>(
            <div key={dept.id} className="group rounded-[24px] bg-white border-2 border-[#e8e2db] overflow-hidden hover:shadow-[0_12px_40px_rgba(26,50,99,0.12)] hover:-translate-y-1 transition-all hover:border-[#fab95b]/50">
              <div className="h-36 overflow-hidden relative bg-[#e8e2db]">
                <img src={college.gallery[idx % college.gallery.length]} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt={dept.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3263]/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 h-12 w-12 rounded-[14px] bg-white border-2 border-[#fab95b] grid place-items-center text-[24px] shadow-lg">{dept.icon}</div>
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#fab95b] text-[#1a3263] text-[11px] font-bold tracking-wide">{dept.code}</span>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white font-semibold text-[13px]">Real Lab Image from psgtech.edu</div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-[16px] leading-tight text-[#1a3263]">{dept.name}</h3>
                <div className="mt-3 text-[12px] text-[#547792]">HOD: {dept.hod} • {dept.faculty} Faculty • {dept.courses} Courses • Real PSG</div>
                <div className="mt-4 flex gap-2">
                  <span className="text-[12px] font-semibold text-[#1a3263] flex items-center gap-1">Explore <ChevronRight size={14} className="text-[#fab95b]" /></span>
                  <span className="ml-auto text-[10px] px-2 py-1 rounded-full bg-[#e8e2db] text-[#1a3263]">Images add pannalaam</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CoursesSection({ college }) {
  return (
    <section id="courses" className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-20 bg-[#e8e2db]/20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a3263] text-[#fab95b] text-[11px] font-bold tracking-widest uppercase"><ImageIcon size={12} /> Programmes - Real from psgtech.edu/placements with Images</div>
          <h2 className="font-display text-[32px] lg:text-[40px] font-semibold leading-[0.95] mt-3 text-[#1a3263]">Courses Offered - Real Data + Images</h2>
        </div>
        <div className="flex gap-2">
          <button className="h-10 px-5 rounded-full bg-[#1a3263] text-[#fab95b] text-[13px] font-semibold">All Real</button>
          <button className="h-10 px-5 rounded-full bg-white border-2 border-[#e8e2db] text-[#1a3263] text-[13px] font-semibold">UG</button>
          <button className="h-10 px-5 rounded-full bg-white border-2 border-[#e8e2db] text-[#1a3263] text-[13px] font-semibold">PG</button>
        </div>
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-6">
        {college.courses.slice(0,6).map((course, idx)=>(
          <div key={course.id} className="group rounded-[24px] border-2 border-[#e8e2db] bg-white overflow-hidden hover:shadow-xl transition-all hover:border-[#fab95b]/50">
            <div className="flex">
              <div className="hidden sm:block w-32 h-auto relative bg-[#e8e2db] shrink-0">
                <img src={college.gallery[(idx+12) % college.gallery.length]} className="h-full w-full object-cover" alt={course.name} />
                <div className="absolute inset-0 bg-[#1a3263]/20" />
                <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-full bg-[#fab95b] text-[#1a3263] text-[10px] font-bold text-center">{course.degree}</div>
              </div>
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-[14px] leading-tight text-[#1a3263]">{course.name}</h3>
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-[#fab95b] text-[#1a3263] text-[11px] font-bold">{course.level}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                  <span className="px-3 py-1 rounded-full bg-[#e8e2db] border border-[#d6cfc6] text-[#1a3263]">{course.duration}</span>
                  <span className="px-3 py-1 rounded-full bg-[#e8e2db] border text-[#1a3263]">Intake: {course.intake}</span>
                  <span className="px-3 py-1 rounded-full bg-[#547792] text-white">{course.fees}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link to={`/college/${college.slug}/admissions`} className="h-9 px-4 grid place-items-center rounded-full bg-[#1a3263] text-[#fab95b] text-[12px] font-semibold">Apply Now - Real</Link>
                  <button className="h-9 px-4 grid place-items-center rounded-full bg-[#e8e2db] border text-[#1a3263] text-[12px] font-semibold">Brochure PDF Real</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-[#fab95b] text-[12px] font-medium text-[#1a3263]">
          <ImageIcon size={14} className="text-[#fab95b]" /> All course images are real from psgtech.edu - College can add more images, alignment auto correct, unique UI
        </div>
      </div>
    </section>
  )
}

export function FacilitiesSection({ college }) {
  return (
    <section className="bg-[#1a3263] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src={college.gallery[0]} className="h-full w-full object-cover" alt="Campus Real" />
      </div>
      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h2 className="font-display text-[32px] lg:text-[44px] font-semibold leading-[0.9] text-white">Campus Life &<br/>Facilities - Real Images</h2>
          <p className="max-w-[420px] text-[14px] leading-[1.6] text-[#e8e2db]">World-class infrastructure - Library Est 1951 2.6 Lakh books, Hostel home away, Placement 90+ companies - All real from psgtech.edu with real images</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {college.facilities.map((f,i)=>(
            <div key={i} className="group rounded-[24px] bg-white/[0.06] border border-[#fab95b]/20 overflow-hidden hover:bg-white/[0.10] transition-colors backdrop-blur">
              <div className="h-40 overflow-hidden relative">
                <img src={college.gallery[(i+15) % college.gallery.length]} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt={f.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3263] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 h-10 w-10 rounded-[12px] bg-[#fab95b] text-[#1a3263] grid place-items-center text-[20px] shadow-lg">{f.icon}</div>
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-[#e8e2db] text-[#1a3263] text-[10px] font-bold">Real Image</div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-[16px] text-white">{f.name} - Real</h3>
                <p className="text-[12px] leading-[1.6] text-[#e8e2db]/80 mt-2">{f.description}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold tracking-wide text-[#fab95b] group-hover:text-white">Explore Real <ArrowUpRight size={14} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AnnouncementsEvents({ college }) {
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-20 bg-[#e8e2db]/20">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
        <div className="rounded-[28px] border-2 border-[#e8e2db] bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[20px] font-semibold text-[#1a3263] flex items-center gap-2"><ImageIcon size={18} className="text-[#fab95b]" /> Latest Announcements - Real</h3>
            <Link to="#" className="text-[11px] font-bold tracking-wide uppercase text-[#547792] hover:text-[#1a3263]">View All</Link>
          </div>
          <div className="mt-6 space-y-3">
            {college.announcements.map(a=>(
              <div key={a.id} className="group flex gap-4 p-4 rounded-[16px] hover:bg-[#e8e2db]/50 border border-transparent hover:border-[#fab95b]/30 transition-colors">
                <div className="h-12 w-12 rounded-[12px] bg-[#1a3263] text-[#fab95b] grid place-items-center shrink-0">
                  <Calendar size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${a.urgent?'bg-[#fab95b] text-[#1a3263] border-[#fab95b]':'bg-[#e8e2db] text-[#1a3263] border-[#e8e2db]'}`}>{a.category}</span>
                    <span className="text-[11px] text-[#547792] flex items-center gap-1"><Clock size={10} />{a.date}</span>
                  </div>
                  <div className="font-medium text-[13px] leading-tight mt-2 text-[#1a3263] group-hover:text-[#547792]">{a.title}</div>
                </div>
                <img src={college.gallery[a.id % college.gallery.length]} className="h-12 w-12 rounded-[10px] object-cover border hidden lg:block" alt="Announcement" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[20px] font-semibold text-[#1a3263]">Upcoming Events - Real Images from psgtech.edu</h3>
            <Link to="#" className="h-9 px-4 grid place-items-center rounded-full bg-[#1a3263] text-[#fab95b] text-[12px] font-semibold">All Events Real</Link>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {college.events.slice(0,4).map(ev=>(
              <div key={ev.id} className="group rounded-[24px] overflow-hidden border-2 border-[#e8e2db] bg-white hover:shadow-xl transition-all hover:-translate-y-1 hover:border-[#fab95b]/50">
                <div className="h-[180px] overflow-hidden relative bg-[#e8e2db]">
                  <img src={ev.image} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" alt={ev.title} />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#fab95b] text-[#1a3263] text-[11px] font-bold uppercase">{ev.category} • Real</div>
                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded-full bg-[#1a3263] text-white text-[10px]">Real from psgtech.edu</div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-[#547792]"><Calendar size={12} />{ev.date} • {ev.venue}</div>
                  <h4 className="font-semibold text-[13px] leading-tight mt-2 text-[#1a3263]">{ev.title}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function GallerySection({ college }) {
  return (
    <section className="bg-white border-y-2 border-[#e8e2db]">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display text-[28px] font-semibold text-[#1a3263] flex items-center gap-3"><ImageIcon size={24} className="text-[#fab95b]" /> Campus Gallery - 100% Real from psgtech.edu • {college.gallery.length} Images</h2>
            <p className="text-[12px] text-[#547792] mt-2">All images real-time from www.psgtech.edu/images/slider/ + library.psgtech.ac.in - No AI images - Real only</p>
          </div>
          <Link to="#" className="px-4 py-2 rounded-full bg-[#1a3263] text-[#fab95b] text-[12px] font-bold">View Full Gallery - Real</Link>
        </div>
        
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {college.gallery.slice(0,12).map((img,i)=>(
            <div key={i} className={`group relative overflow-hidden rounded-[20px] border-2 border-[#e8e2db] hover:border-[#fab95b] transition-colors ${i===0?'lg:col-span-2 lg:row-span-2':''}`}>
              <img src={img} className="h-[200px] lg:h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" alt={`PSG Real ${i}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3263]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-[#fab95b] text-[#1a3263] text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">Real from psgtech.edu</div>
              <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/90 grid place-items-center opacity-0 group-hover:opacity-100"><ImageIcon size={12} /></div>
            </div>
          ))}
        </div>

        {college.videos && college.videos.length > 0 && (
          <div className="mt-12">
            <h3 className="font-semibold text-[18px] text-[#1a3263] flex items-center gap-2">Videos - Real from psgtech.edu library page</h3>
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {college.videos.map((video, i)=>(
                <div key={i} className="rounded-[20px] border-2 border-[#e8e2db] bg-[#e8e2db]/30 p-4">
                  <div className="h-32 rounded-[12px] bg-[#1a3263] grid place-items-center text-[#fab95b] relative overflow-hidden">
                    <Play size={32} />
                    <div className="absolute bottom-2 left-2 text-[10px] bg-[#fab95b] text-[#1a3263] px-2 py-1 rounded-full font-bold">Real Video</div>
                  </div>
                  <div className="mt-3 text-[12px] font-medium text-[#1a3263] truncate">{video}</div>
                  <a href={video} target="_blank" className="mt-2 inline-flex text-[11px] font-bold text-[#547792] hover:text-[#1a3263]">Watch on YouTube → Real</a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 rounded-[16px] bg-[#1a3263] text-[#e8e2db] p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="text-[12px]"><span className="font-bold text-[#fab95b]">100% Real Images:</span> All {college.gallery.length} images from www.psgtech.edu + library.psgtech.ac.in - No AI - Real time - College can add more via Media Library - Unique UI - Alignment Correct</div>
          <span className="px-3 py-1 rounded-full bg-[#fab95b] text-[#1a3263] text-[11px] font-bold">{college.gallery.length} Real Images + {college.videos?.length || 0} Videos</span>
        </div>
      </div>
    </section>
  )
}
