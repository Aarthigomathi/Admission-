import { Link } from 'react-router-dom'
import { ArrowUpRight, GraduationCap, Users, Building2, Trophy, BookOpen, MapPin, Clock, Calendar, Award, ChevronRight, Play } from 'lucide-react'

export function HeroSection({ college }) {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={college.branding.heroImage} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-end min-h-[520px]">
          {/* Left */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-[11px] font-bold tracking-widest uppercase mb-6">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Admissions Open 2026-27 • {college.accreditation}
            </div>

            <h1 className="font-display text-[40px] lg:text-[64px] font-bold leading-[0.95] tracking-tight text-balance max-w-[720px]">
              {college.name}
            </h1>
            <p className="mt-4 text-[18px] lg:text-[20px] leading-[1.4] text-white/80 max-w-[600px] font-light">
              {college.tagline} — {college.about.overview.slice(0,160)}...
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="#courses" className="inline-flex h-[52px] px-8 items-center justify-center rounded-full bg-white text-black text-[14px] font-bold tracking-wide hover:bg-zinc-100 transition-colors gap-2">
                Explore Courses <ArrowUpRight size={18} />
              </Link>
              <Link to={`/college/${college.slug}/admissions`} className="inline-flex h-[52px] px-8 items-center justify-center rounded-full bg-[var(--c-accent)] text-black text-[14px] font-bold tracking-wide hover:brightness-105 gap-2">
                Admissions 2026 <ChevronRight size={18} />
              </Link>
              <button className="inline-flex h-[52px] px-6 items-center justify-center rounded-full bg-white/10 backdrop-blur border border-white/20 text-white text-[14px] font-semibold hover:bg-white/15 gap-2">
                <Play size={16} /> Virtual Tour
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 lg:grid-cols-6 gap-6 border-t border-white/15 pt-8 max-w-[720px]">
              {[
                { k: "Est.", v: college.established },
                { k: "Courses", v: college.quickInfo.courses },
                { k: "Depts", v: college.quickInfo.departments },
                { k: "Faculty", v: college.quickInfo.faculty },
                { k: "Placement", v: college.quickInfo.placement },
                { k: "Campus", v: college.quickInfo.campus },
              ].map(i=>(
                <div key={i.k}>
                  <div className="text-[11px] uppercase tracking-widest font-bold text-white/50">{i.k}</div>
                  <div className="text-[18px] font-semibold mt-1">{i.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Card */}
          <div className="hidden lg:block">
            <div className="rounded-[28px] bg-white/95 backdrop-blur-xl border border-white/20 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-[12px] font-bold tracking-widest uppercase text-zinc-400">Principal's Message</div>
                  <div className="mt-3 flex gap-4">
                    <img src={college.leadership.principal.photo} className="h-14 w-14 rounded-[14px] object-cover" />
                    <div>
                      <div className="font-semibold text-[15px] leading-tight">{college.leadership.principal.name}</div>
                      <div className="text-[12px] text-zinc-500">Principal</div>
                    </div>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-zinc-900 text-white grid place-items-center">
                  <BookOpen size={18} />
                </div>
              </div>
              <p className="text-[14px] leading-[1.6] text-zinc-700 italic">"{college.leadership.principal.message.slice(0,180)}..."</p>

              <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-2 gap-4">
                <div className="rounded-[16px] bg-zinc-50 p-4">
                  <div className="text-[11px] uppercase tracking-wide font-bold text-zinc-400">Highest Package</div>
                  <div className="text-[20px] font-bold mt-1" style={{ color: 'var(--c-primary)' }}>{college.placements.highest}</div>
                  <div className="text-[12px] text-zinc-500 mt-1">Avg {college.placements.average}</div>
                </div>
                <div className="rounded-[16px] bg-zinc-50 p-4">
                  <div className="text-[11px] uppercase tracking-wide font-bold text-zinc-400">Recruiters</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {college.placements.recruiters.slice(0,4).map(r=>(
                      <span key={r} className="px-2 py-1 rounded-full bg-white border text-[11px] font-medium">{r}</span>
                    ))}
                  </div>
                </div>
              </div>

              <Link to={`/college/${college.slug}/about`} className="mt-6 flex items-center justify-center gap-2 h-11 rounded-full bg-zinc-900 text-white text-[13px] font-semibold">
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
    { icon: GraduationCap, label: "Courses", value: college.quickInfo.courses, sub: "UG, PG, PhD" },
    { icon: Building2, label: "Departments", value: college.quickInfo.departments, sub: "Engineering & Science" },
    { icon: Users, label: "Faculty", value: college.quickInfo.faculty, sub: "PhD Holders 78%" },
    { icon: Trophy, label: "Placement", value: college.quickInfo.placement, sub: `${college.placements.average} avg` },
    { icon: MapPin, label: "Campus", value: college.quickInfo.campus, sub: college.location.city },
    { icon: Award, label: "Accreditation", value: college.accreditation.split('•')[0].trim(), sub: college.affiliation },
  ]
  return (
    <div className="mx-auto max-w-[1600px] px-6 lg:px-8 -mt-8 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {items.map((it,i)=>(
          <div key={i} className="group rounded-[20px] bg-white border border-black/[0.06] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
            <div className="h-10 w-10 rounded-[12px] bg-[var(--c-surface)] grid place-items-center text-[var(--c-primary)] group-hover:bg-[var(--c-primary)] group-hover:text-white transition-colors">
              <it.icon size={20} />
            </div>
            <div className="mt-4 text-[11px] font-bold tracking-widest uppercase text-zinc-400">{it.label}</div>
            <div className="text-[20px] font-bold tracking-tight mt-1">{it.value}</div>
            <div className="text-[12px] text-zinc-500 mt-1">{it.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AboutSection({ college }) {
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-24">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20 items-start">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--c-surface)] border text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--c-primary)', borderColor: 'var(--c-primary)/15' }}>
            About {college.shortName}
          </div>
          <h2 className="font-display text-[36px] lg:text-[48px] font-semibold leading-[0.95] tracking-tight mt-6 text-balance" style={{ color: 'var(--c-primary)' }}>
            Shaping future leaders through excellence in education & research.
          </h2>
          <p className="mt-6 text-[16px] leading-[1.7] text-zinc-600 max-w-[600px]">{college.about.overview}</p>

          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            <div className="rounded-[20px] bg-zinc-50 p-6 border">
              <div className="text-[12px] font-bold tracking-widest uppercase text-zinc-400">Vision</div>
              <p className="mt-3 text-[14px] leading-[1.6] font-medium">{college.about.vision}</p>
            </div>
            <div className="rounded-[20px] bg-zinc-50 p-6 border">
              <div className="text-[12px] font-bold tracking-widest uppercase text-zinc-400">Mission</div>
              <p className="mt-3 text-[14px] leading-[1.6] font-medium">{college.about.mission}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[28px] overflow-hidden border shadow-xl">
            <img src={college.branding.coverImage} className="h-[420px] w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-[20px] bg-white border shadow-[0_16px_40px_rgba(0,0,0,0.12)] p-6 max-w-[320px]">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-amber-400 grid place-items-center text-black font-bold">“</div>
              <div className="text-[13px] font-semibold leading-tight">Ranked among top 100 engineering colleges in India by NIRF</div>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-bold">NIRF 2025</span>
              <span className="px-3 py-1 rounded-full bg-zinc-100 text-[11px] font-bold">NAAC A++</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function DepartmentsSection({ college }) {
  return (
    <section id="departments" className="bg-[var(--c-surface)] border-y">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">Academics</div>
            <h2 className="font-display text-[32px] lg:text-[40px] font-semibold leading-[0.95] mt-3" style={{ color: 'var(--c-primary)' }}>Departments & Programmes</h2>
          </div>
          <Link to={`/college/${college.slug}/academics`} className="inline-flex h-11 px-6 items-center gap-2 rounded-full bg-zinc-900 text-white text-[13px] font-semibold">
            View All Departments <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {college.departments.map(dept=>(
            <div key={dept.id} className="group rounded-[24px] bg-white border p-7 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all">
              <div className="flex items-start justify-between">
                <div className="h-14 w-14 rounded-[16px] bg-zinc-50 border grid place-items-center text-[28px]">{dept.icon}</div>
                <span className="px-3 py-1 rounded-full bg-zinc-50 border text-[11px] font-bold tracking-wide">{dept.code}</span>
              </div>
              <h3 className="font-semibold text-[18px] leading-tight mt-6">{dept.name}</h3>
              <div className="mt-3 text-[13px] text-zinc-500">HOD: {dept.hod} • {dept.faculty} Faculty • {dept.courses} Courses</div>
              <div className="mt-6 flex gap-2">
                <span className="text-[12px] font-semibold text-[var(--c-primary)] group-hover:gap-2 flex items-center gap-1 transition-all">Explore <ChevronRight size={14} /></span>
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
    <section id="courses" className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">Programmes</div>
          <h2 className="font-display text-[32px] lg:text-[40px] font-semibold leading-[0.95] mt-3" style={{ color: 'var(--c-primary)' }}>Courses Offered</h2>
        </div>
        <div className="flex gap-2">
          <button className="h-10 px-5 rounded-full bg-zinc-900 text-white text-[13px] font-semibold">All</button>
          <button className="h-10 px-5 rounded-full bg-zinc-50 border text-[13px] font-semibold">UG</button>
          <button className="h-10 px-5 rounded-full bg-zinc-50 border text-[13px] font-semibold">PG</button>
        </div>
      </div>

      <div className="mt-10 grid lg:grid-cols-2 gap-5">
        {college.courses.map(course=>(
          <div key={course.id} className="group rounded-[24px] border bg-white p-6 lg:p-7 flex gap-6 hover:shadow-lg transition-all">
            <div className="hidden sm:grid h-14 w-14 rounded-[14px] bg-[var(--c-surface)] place-items-center text-[var(--c-primary)] font-bold text-[12px] border shrink-0">
              {course.degree}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-semibold text-[16px] leading-tight">{course.name}</h3>
                <span className="shrink-0 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold">{course.level}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
                <span className="px-3 py-1 rounded-full bg-zinc-50 border">{course.duration}</span>
                <span className="px-3 py-1 rounded-full bg-zinc-50 border">Intake: {course.intake}</span>
                <span className="px-3 py-1 rounded-full bg-zinc-50 border">{course.fees}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Link to={`/college/${college.slug}/admissions`} className="h-9 px-4 grid place-items-center rounded-full bg-zinc-900 text-white text-[12px] font-semibold">Apply Now</Link>
                <button className="h-9 px-4 grid place-items-center rounded-full bg-zinc-50 border text-[12px] font-semibold">Brochure</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function FacilitiesSection({ college }) {
  return (
    <section className="bg-zinc-900 text-white">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <h2 className="font-display text-[32px] lg:text-[44px] font-semibold leading-[0.9]">Campus Life &<br/>Facilities</h2>
          <p className="max-w-[420px] text-[14px] leading-[1.6] text-white/60">World-class infrastructure designed for holistic development, innovation and student well-being.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {college.facilities.map((f,i)=>(
            <div key={i} className="group rounded-[24px] bg-white/[0.06] border border-white/10 p-7 hover:bg-white/[0.08] transition-colors">
              <div className="text-[32px]">{f.icon}</div>
              <h3 className="font-semibold text-[18px] mt-5">{f.name}</h3>
              <p className="text-[13px] leading-[1.6] text-white/60 mt-2">{f.description}</p>
              <div className="mt-6 inline-flex items-center gap-1 text-[12px] font-semibold tracking-wide text-white/80 group-hover:text-white">Explore <ArrowUpRight size={14} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AnnouncementsEvents({ college }) {
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-20">
      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10">
        {/* Announcements */}
        <div className="rounded-[28px] border bg-white p-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[22px] font-semibold">Latest Announcements</h3>
            <Link to="#" className="text-[12px] font-bold tracking-wide uppercase text-zinc-500 hover:text-black">View All</Link>
          </div>
          <div className="mt-6 space-y-3">
            {college.announcements.map(a=>(
              <div key={a.id} className="group flex gap-4 p-4 rounded-[16px] hover:bg-zinc-50 border border-transparent hover:border-zinc-100 transition-colors">
                <div className="h-12 w-12 rounded-[12px] bg-zinc-900 text-white grid place-items-center shrink-0">
                  <Calendar size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${a.urgent?'bg-red-50 text-red-700 border-red-200':'bg-zinc-50 text-zinc-600 border-zinc-200'}`}>{a.category}</span>
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1"><Clock size={10} />{a.date}</span>
                  </div>
                  <div className="font-medium text-[14px] leading-tight mt-2 group-hover:text-[var(--c-primary)]">{a.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-[22px] font-semibold">Upcoming Events</h3>
            <Link to="#" className="h-9 px-4 grid place-items-center rounded-full bg-zinc-900 text-white text-[12px] font-semibold">All Events</Link>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {college.events.map(ev=>(
              <div key={ev.id} className="group rounded-[24px] overflow-hidden border bg-white hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="h-[180px] overflow-hidden relative">
                  <img src={ev.image} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold uppercase">{ev.category}</div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[12px] text-zinc-500"><Calendar size={12} />{ev.date} • {ev.venue}</div>
                  <h4 className="font-semibold text-[15px] leading-tight mt-2">{ev.title}</h4>
                </div>
              </div>
            ))}
            {college.events.length===0 && (
              <div className="col-span-2 rounded-[24px] border border-dashed p-12 text-center text-zinc-400">
                No upcoming events. Check back soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function GallerySection({ college }) {
  return (
    <section className="bg-[var(--c-surface)] border-y">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-[28px] font-semibold">Campus Gallery</h2>
          <Link to="#" className="text-[12px] font-bold uppercase tracking-wide">View Full Gallery</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {college.gallery.map((img,i)=>(
            <div key={i} className={`group relative overflow-hidden rounded-[20px] ${i===0?'lg:col-span-2 lg:row-span-2':''}`}>
              <img src={img} className="h-[200px] lg:h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
