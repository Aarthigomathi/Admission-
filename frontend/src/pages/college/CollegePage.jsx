import { useParams, Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { colleges } from '../../lib/colleges'
import { applyCollegeTheme } from '../../lib/theme'
import CollegeHeader from '../../components/college/CollegeHeader'
import { HeroSection, QuickInfo, AboutSection, DepartmentsSection, CoursesSection, FacilitiesSection, AnnouncementsEvents, GallerySection } from '../../components/college/CollegeSections'
import { PSGAboutFull, PSGProgrammesFull, PSGAdvancedCentresFull, PSGCampusFull, PSGEventsFull } from '../../components/college/PSGFullSections'
import { MapPin, Phone, Mail, BadgeCheck } from 'lucide-react'

export default function CollegePage() {
  const { slug } = useParams()
  const college = useMemo(() => colleges.find(c => c.slug === slug), [slug])
  const [activeTab, setActiveTab] = useState('overview')

  if (!college) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#e8e2db] p-8">
        <div className="text-center">
          <h1 className="font-display text-[32px] font-bold text-[#1a3263]">College not found</h1>
          <Link to="/" className="mt-6 inline-flex h-11 px-6 rounded-full bg-[#1a3263] text-[#fab95b] font-semibold">Back to Home</Link>
        </div>
      </div>
    )
  }

  const theme = applyCollegeTheme(college)
  const isPSG = slug === 'psg-tech'

  return (
    <div className="college-theme min-h-screen bg-[#e8e2db]/20" style={theme.style}>
      <CollegeHeader college={college} />

      <HeroSection college={college} />
      <QuickInfo college={college} />

      <div className="sticky top-[84px] lg:top-[121px] z-30 bg-white/90 backdrop-blur-xl border-y border-[#e8e2db]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-8 h-[56px] flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'about', label: 'About' },
            { id: 'programmes', label: 'Programmes' },
            { id: 'departments', label: 'Departments' },
            { id: 'centres', label: 'Research Centres' },
            { id: 'facilities', label: 'Campus' },
            { id: 'events', label: 'Events' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'contact', label: 'Contact' },
          ].map(tab=>(
            <button 
              key={tab.id}
              onClick={()=>{setActiveTab(tab.id); document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' })}}
              className={`whitespace-nowrap px-5 h-9 rounded-full text-[13px] font-semibold border transition-all ${activeTab===tab.id?'bg-[#1a3263] text-[#fab95b] border-[#1a3263]':'bg-white border-[#e8e2db] text-[#547792] hover:border-[#1a3263] hover:text-[#1a3263]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isPSG ? (
        <>
          <div id="about" />
          <PSGAboutFull />
          <div id="programmes" />
          <PSGProgrammesFull />
          <div id="departments" />
          <DepartmentsSection college={college} />
          <div id="centres" />
          <PSGAdvancedCentresFull />
          <div id="facilities" />
          <PSGCampusFull />
          <div id="events" />
          <PSGEventsFull />
          <AnnouncementsEvents college={college} />
          <div id="gallery" />
          <GallerySection college={college} />
        </>
      ) : (
        <>
          <AboutSection college={college} />
          <DepartmentsSection college={college} />
          <CoursesSection college={college} />
          <FacilitiesSection college={college} />
          <AnnouncementsEvents college={college} />
          <GallerySection college={college} />
        </>
      )}

      {/* Contact - Clean real official */}
      <section id="contact" className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
        <div className="rounded-[24px] bg-[#1a3263] text-white p-8 lg:p-10">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h2 className="font-display text-[28px] font-semibold">Contact {college.shortName}</h2>
              <div className="mt-8 space-y-5">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center shrink-0"><MapPin size={18} /></div>
                  <div>
                    <div className="text-[11px] uppercase font-bold opacity-50">Address</div>
                    <div className="text-[13px] leading-[1.5] mt-1 opacity-90">{college.contact.address}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center shrink-0"><Phone size={18} /></div>
                  <div>
                    <div className="text-[11px] uppercase font-bold opacity-50">Phone</div>
                    <div className="text-[13px] mt-1">{college.contact.phone}</div>
                    <div className="text-[12px] opacity-70 mt-1">{college.contact.admissions}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center shrink-0"><Mail size={18} /></div>
                  <div>
                    <div className="text-[11px] uppercase font-bold opacity-50">Email</div>
                    <div className="text-[13px] mt-1">{college.contact.email}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[20px] bg-white text-[#1a3263] p-6">
              <h3 className="font-semibold">Location</h3>
              <p className="text-[13px] text-[#547792] mt-2">8 km from Coimbatore Railway Station, 5 km from Airport, Peelamedu, Avinashi Road, Coimbatore - 641004</p>
              <div className="mt-4 h-48 rounded-[12px] bg-[#e8e2db] border overflow-hidden">
                <img src={college.gallery[0]} className="h-full w-full object-cover" alt="Map" />
              </div>
              <div className="mt-4 flex gap-2">
                <a href={`tel:${college.contact.phone.split('/')[0]}`} className="flex-1 h-10 rounded-full bg-[#1a3263] text-[#fab95b] grid place-items-center text-[13px] font-semibold">Call Now</a>
                <a href={`mailto:${college.contact.email.split('/')[0].trim()}`} className="flex-1 h-10 rounded-full bg-[#e8e2db] border text-[#1a3263] grid place-items-center text-[13px] font-semibold">Email</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Clean official */}
      <footer className="bg-[#1a3263] text-white border-t-4 border-[#fab95b]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
            <div>
              <div className="flex gap-3">
                <img src={college.branding.logo} className="h-12 w-12 rounded-[12px] bg-white object-cover" alt="Logo" />
                <div>
                  <div className="font-display font-semibold text-[16px] leading-tight">{college.name}</div>
                  <div className="text-[11px] opacity-60 mt-1">{college.tagline}</div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#fab95b] text-[#1a3263] text-[10px] font-bold">
                    <BadgeCheck size={12} /> Govt Aided • Autonomous • ISO 9001:2015
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[12px] leading-[1.6] opacity-60 max-w-[360px]">{college.about.overview.slice(0,160)}...</p>
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase opacity-40">Quick Links</div>
              <div className="mt-4 space-y-2 text-[13px] opacity-70">
                <div>About Us</div><div>Programmes</div><div>Departments</div><div>Research Centres</div><div>Placements</div>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase opacity-40">Campus</div>
              <div className="mt-4 space-y-2 text-[13px] opacity-70">
                <div>Library</div><div>Hostel</div><div>Sports</div><div>Gallery</div><div>Events</div>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase opacity-40">Contact</div>
              <div className="mt-4 space-y-2 text-[12px] opacity-70 leading-[1.5]">
                <div>{college.contact.address.slice(0,80)}...</div>
                <div>{college.contact.phone.split('/')[0]}</div>
                <div>{college.contact.email.split('/')[0]}</div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-4 text-[11px] opacity-50">
            <div>© 2026 {college.name}. All rights reserved. • Affiliated to {college.affiliation} • {college.accreditation}</div>
            <div>www.psgtech.edu • Real images from official website</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
