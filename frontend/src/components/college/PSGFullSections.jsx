import { psgTechFullData } from '../../lib/psgtechFull'
import { Award, Building2, BookOpen, Users, GraduationCap, Beaker, Library, Home, Calendar, Trophy, MapPin, Phone, Mail, ExternalLink } from 'lucide-react'

export function PSGAboutFull() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-24">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] font-bold tracking-widest uppercase text-blue-800">
        100% From psgtech.edu/abtcllg.php • Govt Aided • Autonomous • Anna University • ISO 9001:2015
      </div>
      <h2 className="font-display text-[32px] lg:text-[44px] font-semibold leading-[0.95] tracking-tight mt-6" style={{ color: 'var(--c-primary)' }}>
        About PSG College of Technology - 100% Real Data
      </h2>
      
      <div className="mt-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
        <div className="prose prose-zinc max-w-none">
          <p className="text-[15px] leading-[1.8] text-zinc-700 whitespace-pre-line">{psgTechFullData.about.fullText}</p>
          
          <div className="mt-10 grid sm:grid-cols-2 gap-6">
            <div className="rounded-[20px] bg-zinc-50 border p-6">
              <div className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">Vision</div>
              <p className="mt-3 text-[14px] leading-[1.6] font-medium">{psgTechFullData.about.vision}</p>
            </div>
            <div className="rounded-[20px] bg-zinc-50 border p-6">
              <div className="text-[11px] font-bold tracking-widest uppercase text-zinc-400">Mission</div>
              <ul className="mt-3 space-y-2">
                {psgTechFullData.about.mission.map((m,i)=>(
                  <li key={i} className="text-[13px] leading-[1.5] flex gap-2"><span className="text-[var(--c-accent)]">•</span> {m}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-[24px] bg-white border p-8 shadow-sm">
            <h3 className="font-semibold text-[16px] flex items-center gap-2"><Award size={18} /> Autonomous Status & Accreditation</h3>
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4 text-[13px]">
              <div className="rounded-[12px] bg-zinc-50 p-4 border"><div className="font-bold">Autonomous Since</div><div className="text-zinc-600 mt-1">{psgTechFullData.about.autonomousSince}</div></div>
              <div className="rounded-[12px] bg-zinc-50 p-4 border"><div className="font-bold">Student Strength</div><div className="text-zinc-600 mt-1">{psgTechFullData.about.studentStrength} + {psgTechFullData.about.researchScholars} Scholars</div></div>
              <div className="rounded-[12px] bg-zinc-50 p-4 border"><div className="font-bold">Programmes</div><div className="text-zinc-600 mt-1">{psgTechFullData.about.ugProgrammes} UG + {psgTechFullData.about.pgProgrammes} PG, {psgTechFullData.about.accredited1997} accredited 1997 NBA</div></div>
              <div className="rounded-[12px] bg-zinc-50 p-4 border"><div className="font-bold">QIP Centre</div><div className="text-zinc-600 mt-1">Recognized QIP centre for PG & PhD, {psgTechFullData.about.visitingFaculty}+ visiting faculty</div></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[24px] bg-white border p-6 shadow-sm">
            <h4 className="font-semibold text-[14px] flex items-center gap-2"><Users size={16} /> Managing Trustees - PSG & Sons Charities Trust (1926)</h4>
            <div className="mt-4 space-y-2">
              {psgTechFullData.about.trustees.map((t,i)=>(
                <div key={i} className="flex gap-3 p-3 rounded-[12px] bg-zinc-50 border">
                  <div className="h-8 w-8 rounded-full bg-zinc-900 text-white grid place-items-center text-[12px] font-bold">{i+1}</div>
                  <div className="text-[13px] font-medium">{t}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] bg-white border p-6 shadow-sm">
            <h4 className="font-semibold text-[14px] flex items-center gap-2"><GraduationCap size={16} /> Principals History (10)</h4>
            <div className="mt-4 space-y-2">
              {psgTechFullData.about.principals.map((p,i)=>(
                <div key={i} className="flex gap-3 p-3 rounded-[12px] bg-zinc-50 border">
                  <div className="h-8 w-8 rounded-full bg-amber-100 border border-amber-200 grid place-items-center font-bold text-[12px]">{i+1}</div>
                  <div className="text-[13px]">{p}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] bg-zinc-900 text-white p-6">
            <h4 className="font-semibold text-[14px]">Alumni & Collaborations</h4>
            <p className="text-[12px] leading-[1.6] text-white/70 mt-3">Extremely proud of alumni - entrepreneurs, senior executives, CEOs, MDs, Chairmen abroad, Vice Chancellors in India, educational institutions established by alumni. Close interaction with R&D, higher learning India & abroad, Automotive, Aerospace, Defence, Textile, Machine Tools, Software, Consumer durables. MoU with research orgs & industries. Prestigious projects & International funding.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PSGProgrammesFull() {
  return (
    <section className="bg-[var(--c-surface)] border-y">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border text-[11px] font-bold tracking-widest uppercase">100% From psgtech.edu/placements/programmes.php • 63 Courses</div>
            <h2 className="font-display text-[32px] lg:text-[40px] font-semibold leading-[0.95] mt-4" style={{ color: 'var(--c-primary)' }}>All Programmes Offered - PSG Tech</h2>
            <p className="text-[13px] text-zinc-600 mt-3 max-w-[700px]">21 UG including BE/BTech/BSc and 24 PG including ME/MTech/MSc (5 year Integrated)/MSc (2 year)/MBA/MCA. Courses of Study & Detailed Syllabus PDFs for each programme.</p>
          </div>
        </div>

        {/* BE/BTech */}
        <div className="mt-12">
          <h3 className="font-semibold text-[18px] flex items-center gap-2"><BookOpen size={18} /> Bachelor of Engineering / Technology (20 Programmes)</h3>
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {psgTechFullData.programmes.be_btech.map((prog,i)=>(
              <div key={i} className="rounded-[20px] bg-white border p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <span className="px-3 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-bold">{prog.type}</span>
                  {prog.intake && <span className="px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">{prog.intake} seats</span>}
                </div>
                <h4 className="font-semibold text-[13px] leading-tight mt-4">{prog.name}</h4>
                <div className="mt-3 flex gap-2">
                  <a href={prog.link} target="_blank" className="h-8 px-3 rounded-full bg-zinc-50 border text-[11px] font-semibold inline-flex items-center gap-1">Details <ExternalLink size={10} /></a>
                  <button className="h-8 px-3 rounded-full bg-zinc-50 border text-[11px]">Courses of Study</button>
                  <button className="h-8 px-3 rounded-full bg-zinc-50 border text-[11px]">Syllabus</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ME/MTech */}
        <div className="mt-12">
          <h3 className="font-semibold text-[18px] flex items-center gap-2"><GraduationCap size={18} /> Master of Engineering / Technology (19 Programmes)</h3>
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
            {psgTechFullData.programmes.me_mtech.map((prog,i)=>(
              <div key={i} className="rounded-[16px] bg-white border p-4">
                <div className="text-[11px] font-bold px-2 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 inline-block">{prog.type}</div>
                <div className="font-medium text-[12px] mt-3 leading-tight">{prog.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MSc/MCA/MBA */}
        <div className="mt-12 grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-[16px]">M.Sc / MCA / MBA (9 Programmes)</h3>
            <div className="mt-4 space-y-2">
              {psgTechFullData.programmes.msc_mca_mba.map((prog,i)=>(
                <div key={i} className="flex items-center justify-between p-3 rounded-[12px] bg-white border">
                  <span className="text-[13px] font-medium">{prog.name}</span>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-zinc-100">{prog.duration}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[16px]">B.Sc + Ph.D / Research</h3>
            <div className="mt-4 space-y-2">
              {[...psgTechFullData.programmes.bsc, ...psgTechFullData.programmes.phd].map((prog,i)=>(
                <div key={i} className="flex items-center justify-between p-3 rounded-[12px] bg-white border">
                  <span className="text-[13px] font-medium">{prog.name}</span>
                  <span className="text-[11px] px-2 py-1 rounded-full bg-zinc-100">{prog.type}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[16px] bg-amber-50 border border-amber-200 p-4">
              <div className="text-[12px] font-bold text-amber-800">College Admin Can Add More</div>
              <div className="text-[11px] text-amber-700 mt-1">Future la colleges login panni programmes add pannalaam - BCA, BBA, new courses - UI unique-a, alignment correct-a varum</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PSGAdvancedCentresFull() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-20">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[11px] font-bold tracking-widest uppercase text-purple-800">
        19 Advanced Centres from abtcllg.php + 5 Industry CoEs • Real PSG Data
      </div>
      <h2 className="font-display text-[32px] lg:text-[40px] font-semibold leading-[0.95] mt-4" style={{ color: 'var(--c-primary)' }}>Advanced Centres & Research Infrastructure</h2>
      <p className="text-[13px] text-zinc-600 mt-3 max-w-[800px]">Several advanced centres set up with financial support from MHRD, DST, World Bank, Swiss Development Corporation, UNDP, TIFAC, Industry. Each department conducts at least one National/International Conference/Seminar/Workshop annually, 5 short term programmes for faculty with AICTE/ISTE funding.</p>

      <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {psgTechFullData.advancedCentres.map((centre,i)=>(
          <div key={i} className="group rounded-[20px] bg-white border p-6 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all">
            <div className="h-12 w-12 rounded-[14px] bg-zinc-50 border grid place-items-center text-[20px]">🏢</div>
            <h3 className="font-semibold text-[14px] leading-tight mt-5">{centre.name}</h3>
            <div className="mt-3">
              <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-medium">{centre.funding}</span>
            </div>
            <p className="text-[12px] text-zinc-600 mt-3 leading-[1.5]">{centre.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-[24px] bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-8">
        <h3 className="font-semibold text-[18px]">Custom Centres - College Can Add Any New Centre</h3>
        <p className="text-[13px] text-white/70 mt-3 leading-[1.6]">Example: If PSG wants to add "Centre for Foreign Languages" or "PSG-STEP Incubation Centre" or "Centre for Sustainable Development" - college admin login → Custom Sections → + Add Custom Section → Fill name, description, images, videos, documents, contact → Publish → Automatic-a website la unique UI la theriyum with correct alignment. Platform controls design system, college controls content. Future la 1000+ colleges ku same.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {["Centre for Foreign Languages", "PSG-STEP", "Alumni Startup Cell", "Centre for AI", "IIC Innovation"].map(name=>(
            <span key={name} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-[12px] font-medium">{name} - Can be added</span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PSGCampusFull() {
  return (
    <section className="bg-zinc-900 text-white">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-20">
        <h2 className="font-display text-[32px] lg:text-[44px] font-semibold leading-[0.9]">Campus Highlights - 100% Real from psgtech.edu</h2>
        
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="rounded-[24px] bg-white/[0.06] border border-white/10 p-8">
            <div className="h-12 w-12 rounded-[14px] bg-white/10 grid place-items-center text-[24px]">📚</div>
            <h3 className="font-semibold text-[18px] mt-6">Library - Est. 1951</h3>
            <p className="text-[13px] text-white/60 mt-3 leading-[1.6]">{psgTechFullData.campusFacilities.library.description} More than one lakh book volumes. Same year as college establishment.</p>
            <div className="mt-4 text-[11px] text-white/40">College can add more images - auto aligned</div>
          </div>
          <div className="rounded-[24px] bg-white/[0.06] border border-white/10 p-8">
            <div className="h-12 w-12 rounded-[14px] bg-white/10 grid place-items-center text-[24px]">🏠</div>
            <h3 className="font-semibold text-[18px] mt-6">Hostel</h3>
            <p className="text-[13px] text-white/60 mt-3 leading-[1.6]">{psgTechFullData.campusFacilities.hostel.description} 3000+ capacity, separate boys & girls.</p>
          </div>
          <div className="rounded-[24px] bg-white/[0.06] border border-white/10 p-8">
            <div className="h-12 w-12 rounded-[14px] bg-white/10 grid place-items-center text-[24px]">💼</div>
            <h3 className="font-semibold text-[18px] mt-6">Placement Office</h3>
            <p className="text-[13px] text-white/60 mt-3 leading-[1.6]">{psgTechFullData.campusFacilities.placement.description} {psgTechFullData.campusFacilities.placement.companies}+ companies. Top: {psgTechFullData.campusFacilities.placement.topRecruiters.slice(0,3).join(', ')} etc.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {psgTechFullData.campusFacilities.other.map(f=>(
            <span key={f} className="px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[13px]">{f} - College can add images</span>
          ))}
        </div>

        <div className="mt-12 rounded-[24px] bg-white text-black p-8">
          <h3 className="font-semibold text-[16px]">Campus - 45 Acres - Economically Utilized</h3>
          <p className="text-[13px] text-zinc-600 mt-2">College, Hostels, Staff Quarters, Play Fields and Gardens. 8km from Coimbatore Railway Station, 5km from Airport. Peelamedu, Avinashi Road.</p>
        </div>
      </div>
    </section>
  )
}

export function PSGEventsFull() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
      <h2 className="font-display text-[28px] font-semibold">Events from psgtech.edu Homepage Slider - Real Images</h2>
      <p className="text-[13px] text-zinc-500 mt-2">15 events from slider - Foundation Day 2026, Orientation 2026, Faculty Interaction, Research Conclave, Confluence, Award Ceremony, Voters Day, Viksit Bharat, ISRO etc.</p>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {psgTechFullData.eventsFromHomepage.map((ev,i)=>(
          <div key={i} className="group rounded-[24px] overflow-hidden border bg-white hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="h-[200px] overflow-hidden relative bg-zinc-100">
              <img src={ev.image} alt={ev.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold">Real PSG Image</div>
              {ev.date && <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-bold">{ev.date}</div>}
            </div>
            <div className="p-5">
              <h4 className="font-semibold text-[13px] leading-tight">{ev.title}</h4>
              {ev.description && <p className="text-[11px] text-zinc-500 mt-2 line-clamp-2">{ev.description}</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="font-semibold text-[18px]">Past Events & Achievements</h3>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {psgTechFullData.pastEvents.map((ev,i)=>(
            <div key={i} className="rounded-[20px] border bg-white p-6 flex gap-5">
              <img src={ev.image} className="h-20 w-20 rounded-[12px] object-cover shrink-0" />
              <div>
                <div className="font-semibold text-[13px] leading-tight">{ev.title}</div>
                {ev.date && <div className="text-[11px] text-zinc-500 mt-1">{ev.date}</div>}
                {ev.description && <div className="text-[11px] text-zinc-600 mt-2">{ev.description.slice(0,120)}...</div>}
                {ev.report && <a href={ev.report} target="_blank" className="mt-2 inline-flex text-[11px] font-bold text-blue-600 hover:underline">View Report →</a>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-[20px] bg-blue-50 border border-blue-200 p-6">
        <div className="font-semibold text-[13px] text-blue-800">College Admin - Image + Event Management</div>
        <div className="text-[12px] text-blue-700/80 mt-2 leading-[1.6]">College admin login pannitu Events add pannalaam - Title, Date, Venue, Description, Poster image upload, Gallery, Registration link, Contact, Category (Technical/Cultural/Sports/Workshop/Seminar/Hackathon/Conference/Alumni/Admission/Webinar). Add pannina udane public website la unique card UI la correct alignment la theriyum. Real PSG images maadiri.</div>
      </div>
    </section>
  )
}
