import { useParams, Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { colleges } from '../../lib/colleges'
import { applyCollegeTheme } from '../../lib/theme'
import CollegeHeader from '../../components/college/CollegeHeader'
import { HeroSection, QuickInfo, AboutSection, DepartmentsSection, CoursesSection, FacilitiesSection, AnnouncementsEvents, GallerySection } from '../../components/college/CollegeSections'
import { MapPin, Phone, Mail, ArrowUpRight, BadgeCheck, GraduationCap, Users, Building2, Bookmark, Share2, MessageCircle, ExternalLink } from 'lucide-react'
import CollegeCard from '../../components/platform/CollegeCard'

export default function CollegePage() {
  const { slug } = useParams()
  const college = useMemo(() => colleges.find(c => c.slug === slug), [slug])
  const [activeTab, setActiveTab] = useState('overview')

  if (!college) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#fbfaf8] p-8">
        <div className="text-center">
          <h1 className="font-display text-[32px] font-bold">College not found</h1>
          <p className="text-zinc-500 mt-2">The college slug "{slug}" doesn't exist.</p>
          <Link to="/" className="mt-6 inline-flex h-11 px-6 rounded-full bg-zinc-900 text-white font-semibold">Back to Discovery</Link>
        </div>
      </div>
    )
  }

  const theme = applyCollegeTheme(college)
  const similar = colleges.filter(c=>c.id!==college.id).slice(0,3)

  return (
    <div className="college-theme min-h-screen bg-white" style={theme.style}>
      <CollegeHeader college={college} />

      {/* Hero */}
      <HeroSection college={college} />
      <QuickInfo college={college} />

      {/* Sub Nav */}
      <div className="sticky top-[84px] lg:top-[121px] z-30 bg-white/80 backdrop-blur-xl border-y border-zinc-100">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-8 h-[56px] flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'about', label: 'About' },
            { id: 'departments', label: 'Departments' },
            { id: 'courses', label: 'Courses' },
            { id: 'facilities', label: 'Campus' },
            { id: 'placements', label: 'Placements' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'contact', label: 'Contact' },
          ].map(tab=>(
            <button 
              key={tab.id}
              onClick={()=>{setActiveTab(tab.id); document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}}
              className={`whitespace-nowrap px-5 h-9 rounded-full text-[13px] font-semibold border transition-all ${activeTab===tab.id?'bg-[var(--c-primary)] text-white border-[var(--c-primary)]':'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-900 hover:text-zinc-900'}`}
            >
              {tab.label}
            </button>
          ))}
          <div className="ml-auto hidden lg:flex items-center gap-2">
            <button className="h-9 w-9 grid place-items-center rounded-full bg-zinc-50 border"><Bookmark size={16} /></button>
            <button className="h-9 w-9 grid place-items-center rounded-full bg-zinc-50 border"><Share2 size={16} /></button>
            <Link to={`/college/${college.slug}/admissions`} className="h-9 px-5 grid place-items-center rounded-full bg-[var(--c-accent)] text-black text-[12px] font-bold">Enquire Now</Link>
          </div>
        </div>
      </div>

      <div id="overview" />
      <AboutSection college={college} />

      <div id="departments" />
      <DepartmentsSection college={college} />

      <div id="courses" />
      <CoursesSection college={college} />

      <div id="facilities" />
      <FacilitiesSection college={college} />

      <AnnouncementsEvents college={college} />

      <div id="gallery" />
      <GallerySection college={college} />

      {/* Custom Sections */}
      {college.customSections?.length>0 && (
        <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
          <h2 className="font-display text-[28px] font-semibold">Special Centres</h2>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {college.customSections.map(cs=>(
              <div key={cs.id} className="rounded-[24px] border bg-white p-7">
                <div className="text-[28px]">{cs.icon}</div>
                <h3 className="font-semibold text-[18px] mt-4">{cs.title}</h3>
                <p className="text-[13px] text-zinc-600 mt-2">{cs.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
          <div className="rounded-[28px] bg-zinc-900 text-white p-8 lg:p-10">
            <h2 className="font-display text-[32px] font-semibold leading-[0.95]">Get in touch with {college.shortName}</h2>
            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <div className="h-11 w-11 rounded-full bg-white/10 grid place-items-center shrink-0"><MapPin size={18} /></div>
                <div>
                  <div className="text-[12px] uppercase tracking-wide font-bold opacity-50">Address</div>
                  <div className="text-[14px] leading-[1.5] mt-1 opacity-90">{college.contact.address}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-11 w-11 rounded-full bg-white/10 grid place-items-center shrink-0"><Phone size={18} /></div>
                <div>
                  <div className="text-[12px] uppercase tracking-wide font-bold opacity-50">Phone</div>
                  <div className="text-[14px] mt-1">{college.contact.phone} • Admissions: {college.contact.admissions}</div>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-11 w-11 rounded-full bg-white/10 grid place-items-center shrink-0"><Mail size={18} /></div>
                <div>
                  <div className="text-[12px] uppercase tracking-wide font-bold opacity-50">Email</div>
                  <div className="text-[14px] mt-1">{college.contact.email}</div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3">
              <a href={`tel:${college.contact.phone}`} className="h-12 rounded-full bg-white text-black grid place-items-center font-semibold text-[13px]">Call Now</a>
              <a href={`mailto:${college.contact.email}`} className="h-12 rounded-full bg-white/10 border border-white/20 grid place-items-center font-semibold text-[13px]">Email Us</a>
            </div>
          </div>

          <div className="rounded-[28px] border bg-white p-8">
            <h3 className="font-semibold text-[18px]">Quick Enquiry</h3>
            <p className="text-[13px] text-zinc-500 mt-1">Get admission guidance from {college.shortName}</p>
            <form className="mt-6 space-y-4" onSubmit={e=>e.preventDefault()}>
              <input placeholder="Full Name" className="w-full h-12 px-4 rounded-[12px] bg-zinc-50 border outline-none focus:border-zinc-900 text-[14px]" />
              <input placeholder="Email / Phone" className="w-full h-12 px-4 rounded-[12px] bg-zinc-50 border outline-none focus:border-zinc-900 text-[14px]" />
              <select className="w-full h-12 px-4 rounded-[12px] bg-zinc-50 border outline-none text-[14px]">
                <option>Select Course Interested</option>
                {college.courses.map(c=><option key={c.id}>{c.name}</option>)}
              </select>
              <textarea placeholder="Your message" rows={3} className="w-full p-4 rounded-[12px] bg-zinc-50 border outline-none focus:border-zinc-900 text-[14px] resize-none" />
              <button className="w-full h-12 rounded-full bg-[var(--c-primary)] text-white font-semibold text-[14px]">Submit Enquiry</button>
              <div className="text-[11px] text-zinc-400 text-center">By submitting, you agree to our privacy policy. College will contact you directly.</div>
            </form>
          </div>
        </div>
      </section>

      {/* Similar Colleges */}
      <section className="bg-[#fbfaf8] border-t">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-[28px] font-semibold">Similar Colleges</h2>
              <p className="text-[13px] text-zinc-500 mt-1">Students who viewed {college.shortName} also viewed</p>
            </div>
            <Link to="/search" className="hidden lg:flex items-center gap-1 text-[13px] font-semibold">Explore all <ArrowUpRight size={16} /></Link>
          </div>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map(c=>(
              <CollegeCard key={c.id} college={c} />
            ))}
          </div>
        </div>
      </section>

      {/* College Footer - Platform controls design, college controls content */}
      <footer className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-14">
          <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12">
            <div>
              <div className="flex gap-4">
                <img src={college.branding.logo} className="h-14 w-14 rounded-[14px] object-cover" />
                <div>
                  <div className="font-display font-semibold text-[18px] leading-tight">{college.name}</div>
                  <div className="text-[12px] opacity-60 mt-1">{college.tagline}</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-bold uppercase">
                    <BadgeCheck size={12} /> Verified College
                  </div>
                </div>
              </div>
              <p className="mt-6 text-[13px] leading-[1.6] opacity-60 max-w-[380px]">{college.about.overview.slice(0,180)}...</p>
              <div className="mt-6 flex gap-2">
                <a href="#" className="h-9 w-9 rounded-full bg-white/10 grid place-items-center hover:bg-white/20">in</a>
                <a href="#" className="h-9 w-9 rounded-full bg-white/10 grid place-items-center hover:bg-white/20">ig</a>
                <a href="#" className="h-9 w-9 rounded-full bg-white/10 grid place-items-center hover:bg-white/20">yt</a>
                <a href="#" className="h-9 w-9 rounded-full bg-white/10 grid place-items-center hover:bg-white/20">f</a>
              </div>
            </div>

            <div>
              <div className="text-[11px] font-bold tracking-widest uppercase opacity-40">Quick Links</div>
              <div className="mt-5 space-y-3 text-[13px] opacity-80">
                <div>About Us</div><div>Admissions 2026</div><div>Departments</div><div>Courses</div><div>Placements</div><div>Research</div>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-widest uppercase opacity-40">Campus</div>
              <div className="mt-5 space-y-3 text-[13px] opacity-80">
                <div>Library</div><div>Hostel</div><div>Sports</div><div>Transport</div><div>Gallery</div><div>Contact</div>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold tracking-widest uppercase opacity-40">Contact</div>
              <div className="mt-5 space-y-3 text-[13px] opacity-80 leading-[1.5]">
                <div>{college.contact.address}</div>
                <div>{college.contact.phone}</div>
                <div>{college.contact.email}</div>
              </div>
              <Link to="/" className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase opacity-50 hover:opacity-100">
                <ExternalLink size={12} /> Back to Platform
              </Link>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/10 flex flex-wrap justify-between gap-4 text-[12px]">
            <div className="opacity-50">© 2026 {college.name}. All rights reserved. • Last updated: March 2026 • College Provided • Verified</div>
            <div className="flex items-center gap-2 opacity-60">
              <span>Powered by</span>
              <span className="px-2.5 py-1 rounded-full bg-white text-black font-bold text-[11px] tracking-wide">Tamil Nadu Colleges Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
