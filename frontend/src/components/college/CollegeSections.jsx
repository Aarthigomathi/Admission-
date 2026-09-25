import { Link } from 'react-router-dom'
import { ArrowUpRight, GraduationCap, Users, Building2, Trophy, BookOpen, MapPin, Clock, Calendar, Award, ChevronRight, Play } from 'lucide-react'

export function HeroSection({ college }) {
  return (
    <div className="relative overflow-hidden bg-[#1a3263]">
      <div className="absolute inset-0">
        <img src={college.branding.heroImage} className="h-full w-full object-cover" alt={college.name} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3263]/90 via-[#1a3263]/60 to-[#547792]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a3263]/70 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-end min-h-[520px]">
          <div className="text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fab95b] text-[#1a3263] text-[11px] font-bold tracking-widest uppercase mb-6">
              <span className="h-2 w-2 rounded-full bg-[#1a3263] animate-pulse" />
              Admissions Open 2026-27 • {college.accreditation.split('•')[0].trim()}
            </div>

            <h1 className="font-display text-[42px] lg:text-[64px] font-bold leading-[0.95] tracking-tight max-w-[720px] text-white">
              {college.name}
            </h1>
            <p className="mt-4 text-[18px] leading-[1.4] text-[#e8e2db] max-w-[600px] font-light">
              {college.tagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="#programmes" className="inline-flex h-[48px] px-7 items-center justify-center rounded-full bg-white text-[#1a3263] text-[14px] font-bold hover:bg-[#e8e2db] transition-colors gap-2">
                Explore Programmes <ArrowUpRight size={18} />
              </Link>
              <Link to="#contact" className="inline-flex h-[48px] px-7 items-center justify-center rounded-full bg-[#fab95b] text-[#1a3263] text-[14px] font-bold hover:brightness-105 gap-2">
                Contact Us <ChevronRight size={18} />
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 lg:grid-cols-6 gap-6 border-t border-white/20 pt-8 max-w-[720px]">
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
            <div className="rounded-[24px] bg-white border border-[#e8e2db] p-6 shadow-[0_20px_60px_rgba(26,50,99,0.25)]">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="text-[11px] font-bold tracking-widest uppercase text-[#547792]">Principal</div>
                  <div className="mt-3 flex gap-3">
                    <img src={college.branding.logo} className="h-12 w-12 rounded-[12px] object-cover border bg-[#e8e2db]" alt="Logo" />
                    <div>
                      <div className="font-semibold text-[14px] leading-tight text-[#1a3263]">{college.leadership.principal.name}</div>
                      <div className="text-[12px] text-[#547792]">Principal</div>
                    </div>
                  </div>
                </div>
                <div className="h-9 w-9 rounded-full bg-[#1a3263] text-[#fab95b] grid place-items-center">
                  <BookOpen size={16} />
                </div>
              </div>
              <p className="text-[13px] leading-[1.6] text-[#1a3263]/80 italic">"{college.leadership.principal.message.slice(0,160)}..."</p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[14px] bg-[#e8e2db] p-4 border">
                  <div className="text-[10px] uppercase font-bold text-[#547792]">Highest Package</div>
                  <div className="text-[18px] font-bold mt-1 text-[#1a3263]">{college.placements.highest}</div>
                  <div className="text-[11px] text-[#547792]">Avg {college.placements.average}</div>
                </div>
                <div className="rounded-[14px] bg-[#e8e2db] p-4 border">
                  <div className="text-[10px] uppercase font-bold text-[#547792]">Top Recruiters</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {college.placements.recruiters.slice(0,3).map(r=>(
                      <span key={r} className="px-2 py-1 rounded-full bg-white border text-[10px] font-medium text-[#1a3263]">{r}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function QuickInfo({ college }) {
  const items = [
    { icon: GraduationCap, label: "Courses", value: college.quickInfo.courses, sub: "UG, PG, PhD", image: college.gallery[0] },
    { icon: Building2, label: "Departments", value: college.quickInfo.departments, sub: "Engineering & Science", image: college.gallery[1] },
    { icon: Users, label: "Faculty", value: college.quickInfo.faculty, sub: "PhD Holders", image: college.gallery[2] },
    { icon: Trophy, label: "Placement", value: college.quickInfo.placement, sub: `${college.placements.average} avg`, image: college.gallery[3] },
    { icon: MapPin, label: "Campus", value: college.quickInfo.campus, sub: college.location.city, image: college.gallery[4] },
    { icon: Award, label: "Accreditation", value: "NAAC A", sub: college.affiliation, image: college.gallery[5] },
  ]
  return (
    <div className="mx-auto max-w-[1600px] px-6 lg:px-8 -mt-8 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {items.map((it,i)=>(
          <div key={i} className="group rounded-[20px] bg-white border border-[#e8e2db] p-4 shadow-[0_4px_24px_rgba(26,50,99,0.06)] hover:shadow-[0_8px_32px_rgba(26,50,99,0.10)] hover:-translate-y-1 transition-all overflow-hidden">
            <div className="relative h-20 rounded-[12px] overflow-hidden mb-3">
              <img src={it.image} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" alt={it.label} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a3263]/60 to-transparent" />
              <div className="absolute bottom-2 left-2 h-7 w-7 rounded-[8px] bg-[#fab95b] text-[#1a3263] grid place-items-center">
                <it.icon size={14} />
              </div>
            </div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#547792]">{it.label}</div>
            <div className="text-[18px] font-bold mt-1 text-[#1a3263]">{it.value}</div>
            <div className="text-[11px] text-[#547792] mt-1">{it.sub}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AboutSection({ college }) {
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-24">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">
        <div>
          <div className="inline-flex px-3 py-1 rounded-full bg-[#e8e2db] border text-[11px] font-bold tracking-widest uppercase text-[#1a3263]">
            About {college.shortName}
          </div>
          <h2 className="font-display text-[36px] lg:text-[44px] font-semibold leading-[0.95] tracking-tight mt-6 text-[#1a3263]">
            Shaping future leaders through excellence in education and research.
          </h2>
          <p className="mt-6 text-[15px] leading-[1.7] text-[#1a3263]/70">{college.about.overview.slice(0,500)}...</p>

          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="rounded-[16px] bg-[#e8e2db] p-5 border">
              <div className="text-[11px] font-bold uppercase text-[#547792]">Vision</div>
              <p className="mt-2 text-[13px] leading-[1.6] text-[#1a3263]">{college.about.vision}</p>
            </div>
            <div className="rounded-[16px] bg-[#1a3263] p-5 border text-white">
              <div className="text-[11px] font-bold uppercase text-[#fab95b]">Mission</div>
              <p className="mt-2 text-[13px] leading-[1.6] text-[#e8e2db]">{typeof college.about.mission === 'string' ? college.about.mission.slice(0,200) : college.about.mission}</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[24px] overflow-hidden border-2 border-[#e8e2db] shadow-xl">
            <img src={college.branding.coverImage} className="h-[420px] w-full object-cover" alt="Campus" />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-[16px] bg-white border-2 border-[#fab95b] shadow-xl p-5 max-w-[300px]">
            <div className="text-[13px] font-semibold text-[#1a3263]">NIRF 67 Engineering, 84 Management</div>
            <div className="text-[11px] text-[#547792] mt-1">Among top 100 engineering colleges in India</div>
            <div className="mt-3 flex gap-2">
              <span className="px-2 py-1 rounded-full bg-[#1a3263] text-[#fab95b] text-[10px] font-bold">NIRF 2025</span>
              <span className="px-2 py-1 rounded-full bg-[#e8e2db] text-[#1a3263] text-[10px] font-bold">NAAC A • NBA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function DepartmentsSection({ college }) {
  return (
    <section id="departments" className="bg-[#e8e2db]/40 border-y border-[#e8e2db]">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
        <h2 className="font-display text-[32px] font-semibold text-[#1a3263]">Departments & Programmes</h2>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {college.departments.slice(0,6).map((dept, idx)=>(
            <div key={dept.id} className="group rounded-[20px] bg-white border border-[#e8e2db] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="h-32 overflow-hidden relative">
                <img src={college.gallery[idx % college.gallery.length]} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" alt={dept.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a3263]/70 to-transparent" />
                <div className="absolute top-3 left-3 h-10 w-10 rounded-[12px] bg-white border grid place-items-center text-[20px]">{dept.icon}</div>
                <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-[#fab95b] text-[#1a3263] text-[11px] font-bold">{dept.code}</span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-[15px] text-[#1a3263]">{dept.name}</h3>
                <div className="mt-2 text-[12px] text-[#547792]">HOD: {dept.hod} • {dept.faculty} Faculty</div>
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
    <section id="courses" className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
      <h2 className="font-display text-[32px] font-semibold text-[#1a3263]">Programmes Offered</h2>
      <div className="mt-8 grid lg:grid-cols-2 gap-4">
        {college.courses.slice(0,6).map((course, idx)=>(
          <div key={course.id} className="rounded-[20px] border border-[#e8e2db] bg-white p-5 flex gap-4 hover:shadow-md transition-all">
            <div className="hidden sm:block w-24 h-24 rounded-[12px] overflow-hidden bg-[#e8e2db] shrink-0">
              <img src={college.gallery[(idx+8) % college.gallery.length]} className="h-full w-full object-cover" alt={course.name} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[14px] text-[#1a3263]">{course.name}</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-full bg-[#e8e2db] text-[#1a3263] text-[11px]">{course.duration}</span>
                <span className="px-2 py-1 rounded-full bg-[#e8e2db] text-[#1a3263] text-[11px]">Intake {course.intake}</span>
                <span className="px-2 py-1 rounded-full bg-[#1a3263] text-[#fab95b] text-[11px] font-bold">{course.level}</span>
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
    <section className="bg-[#1a3263] text-white">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
        <h2 className="font-display text-[32px] font-semibold">Campus Life & Facilities</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {college.facilities.slice(0,3).map((f,i)=>(
            <div key={i} className="rounded-[20px] bg-white/5 border border-white/10 overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img src={college.gallery[(i+12) % college.gallery.length]} className="h-full w-full object-cover" alt={f.name} />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-[16px]">{f.name}</h3>
                <p className="text-[13px] text-white/60 mt-2">{f.description}</p>
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
    <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 bg-[#e8e2db]/20">
      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <h3 className="font-display text-[22px] font-semibold text-[#1a3263]">Latest Announcements</h3>
          <div className="mt-6 space-y-3">
            {college.announcements.slice(0,4).map(a=>(
              <div key={a.id} className="flex gap-4 p-4 rounded-[14px] bg-white border border-[#e8e2db]">
                <div className="h-10 w-10 rounded-[10px] bg-[#1a3263] text-[#fab95b] grid place-items-center shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#e8e2db] text-[#1a3263] text-[10px] font-bold">{a.category}</span>
                    <span className="text-[11px] text-[#547792]">{a.date}</span>
                  </div>
                  <div className="font-medium text-[13px] mt-2 text-[#1a3263]">{a.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-[22px] font-semibold text-[#1a3263]">Upcoming Events</h3>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {college.events.slice(0,2).map(ev=>(
              <div key={ev.id} className="rounded-[20px] overflow-hidden border bg-white">
                <div className="h-[160px] overflow-hidden">
                  <img src={ev.image} className="h-full w-full object-cover" alt={ev.title} />
                </div>
                <div className="p-4">
                  <div className="text-[11px] text-[#547792]">{ev.date} • {ev.venue}</div>
                  <h4 className="font-semibold text-[13px] mt-2 text-[#1a3263]">{ev.title}</h4>
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
    <section className="bg-white border-y border-[#e8e2db]">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
        <h2 className="font-display text-[28px] font-semibold text-[#1a3263]">Campus Gallery</h2>
        <p className="text-[12px] text-[#547792] mt-2">Real images from www.psgtech.edu</p>
        
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {college.gallery.slice(0,8).map((img,i)=>(
            <div key={i} className={`rounded-[16px] overflow-hidden border border-[#e8e2db] ${i===0?'lg:col-span-2 lg:row-span-2':''}`}>
              <img src={img} className="h-[200px] lg:h-full w-full object-cover hover:scale-105 transition-transform duration-700" alt="Campus" />
            </div>
          ))}
        </div>

        {college.videos && (
          <div className="mt-12">
            <h3 className="font-semibold text-[#1a3263]">Videos</h3>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              {college.videos.map((video, i)=>(
                <a key={i} href={video} target="_blank" className="rounded-[16px] border bg-[#e8e2db] p-4 hover:bg-[#fab95b]/20 transition-colors">
                  <div className="h-28 rounded-[10px] bg-[#1a3263] grid place-items-center text-[#fab95b]">
                    <Play size={24} />
                  </div>
                  <div className="mt-3 text-[12px] font-medium text-[#1a3263] truncate">{video}</div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
