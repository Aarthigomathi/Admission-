import { useParams, Link } from 'react-router-dom'
import { useMemo, useState, useEffect } from 'react'
import { colleges as staticColleges } from '../../lib/colleges'
import { getCollegeBySlug, getCollegeCustomData } from '../../lib/collegeStorage'
import { applyCollegeTheme } from '../../lib/theme'
import CollegeHeader from '../../components/college/CollegeHeader'
import { HeroSection, QuickInfo, AboutSection, DepartmentsSection, CoursesSection, FacilitiesSection, AnnouncementsEvents, GallerySection } from '../../components/college/CollegeSections'
import { PSGAboutFull, PSGProgrammesFull, PSGAdvancedCentresFull, PSGCampusFull, PSGEventsFull } from '../../components/college/PSGFullSections'
import { MapPin, Phone, Mail, BadgeCheck, Building2, GraduationCap, Users, Award, Image as ImageIcon } from 'lucide-react'

function CustomCollegePage({ college, customData }) {
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

  const hasContent = (arr) => arr && arr.length > 0

  return (
    <div className="min-h-screen bg-[#E8E2DB]">
      <CollegeHeader college={{ ...college, branding: { ...college.branding, ...branding, logo: branding.logo || college.branding?.logo, heroImage: branding.heroImage || college.branding?.heroImage } }} />

      {/* Hero - Custom college own images */}
      <div className="relative h-[420px] overflow-hidden bg-[#1A3263]">
        {branding.heroImage ? (
          <img src={branding.heroImage} className="h-full w-full object-cover" alt={`${college.name} Campus - Your Own Image`} />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#1A3263] via-[#547792] to-[#FAB95B] grid place-items-center">
            <div className="text-center text-white p-8">
              <div className="text-5xl mb-4">🏛️</div>
              <div className="font-display text-[32px] font-bold">{college.name}</div>
              <div className="text-[14px] text-[#FAB95B] mt-2">{college.district} • {college.city} • ID {college.id} • Your Own College (Not PSG)</div>
              <div className="text-[12px] text-white/60 mt-4">Add your campus image in Admin → Branding → Campus Hero Image - Your own image, not PSG - UI frame ours, content yours</div>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A3263]/90 via-[#1A3263]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="mx-auto max-w-[1400px] flex gap-6 items-end">
            {branding.logo ? (
              <img src={branding.logo} className="h-20 w-20 rounded-[16px] object-cover border-4 border-[#FAB95B] bg-white shadow-xl" alt={`${college.name} Logo`} />
            ) : (
              <div className="h-20 w-20 rounded-[16px] bg-white border-4 border-[#FAB95B] grid place-items-center text-[#1A3263] font-bold text-[28px] shadow-xl">{college.name[0]}</div>
            )}
            <div className="text-white">
              <h1 className="font-display text-[32px] lg:text-[48px] font-bold leading-[0.9]">{college.name}</h1>
              <div className="text-[14px] text-[#FAB95B] mt-3 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={14} /> {college.district} • {college.city}</span>
                <span className="px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[11px]">{college.verificationStatus} • ID {college.id}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px]">Your Own College (Not PSG) • UI Frame Ours</span>
              </div>
              <div className="text-[13px] text-white/80 mt-2">{customData.tagline || college.tagline || 'Add tagline in Branding'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - Your own */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Departments You Added", value: departments.length, sub: "With HOD - You add", icon: Building2 },
            { label: "Courses You Added", value: courses.length, sub: "A to Z you add", icon: GraduationCap },
            { label: "Facilities You Added", value: facilities.length, sub: "Environment etc", icon: Award },
            { label: "Placements You Added", value: placements.length, sub: "Your placement data", icon: Users },
          ].map((stat,i)=>(
            <div key={i} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[10px] bg-[#E8E2DB] border-2 border-[#FAB95B]/30 grid place-items-center text-[#1A3263]"><stat.icon size={18} /></div>
                <div>
                  <div className="font-display text-[22px] font-bold text-[#1A3263]">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase text-[#547792]">{stat.label}</div>
                  <div className="text-[11px] text-[#547792]/70">{stat.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-12 space-y-12">
        {/* About - Your own */}
        <section className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
          <h2 className="font-display text-[28px] font-bold text-[#1A3263]">About {college.name} - Your Own About (Not PSG)</h2>
          {about.fullText ? (
            <p className="mt-4 text-[14px] leading-[1.7] text-[#547792]">{about.fullText}</p>
          ) : (
            <div className="mt-6 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed border-[#1A3263]/20">
              <div className="text-3xl">📝</div>
              <div className="font-bold text-[#1A3263] mt-3">No about yet - Add your college about</div>
              <div className="text-[12px] text-[#547792] mt-2">Go to Admin → About, Vision, Mission → Add your college story - Your own about, not PSG - UI frame ours, content yours</div>
            </div>
          )}
          {about.vision && (
            <div className="mt-8 rounded-[16px] bg-[#1A3263] text-white p-6">
              <div className="font-bold text-[#FAB95B]">Vision - Your Own Vision</div>
              <div className="text-[13px] text-[#E8E2DB]/80 mt-2">{about.vision}</div>
            </div>
          )}
          {about.mission && about.mission.length>0 && (
            <div className="mt-4 rounded-[16px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-6">
              <div className="font-bold text-[#1A3263]">Mission - Your Own Mission</div>
              <div className="mt-3 space-y-2">
                {about.mission.map((m,i)=><div key={i} className="flex gap-2 text-[13px] text-[#1A3263]"><span className="h-5 w-5 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[10px] font-bold shrink-0">{i+1}</span>{m}</div>)}
              </div>
            </div>
          )}
        </section>

        {/* Departments with HOD - Your own */}
        <section className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
          <h2 className="font-display text-[24px] font-bold text-[#1A3263] flex items-center gap-3"><Building2 className="text-[#FAB95B]" /> Departments with HOD - {departments.length} Departments You Added (Not PSG) - Each Dept HOD</h2>
          {hasContent(departments) ? (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {departments.map(dept=>(
                <div key={dept.id} className="rounded-[16px] border-2 border-[#E8E2DB] p-5 flex gap-4 hover:border-[#FAB95B]/40 transition-colors">
                  {dept.image ? <img src={dept.image} className="h-16 w-16 rounded-[12px] object-cover border-2 border-[#E8E2DB] shrink-0" alt={dept.name} /> : <div className="h-16 w-16 rounded-[12px] bg-[#E8E2DB] grid place-items-center text-[#1A3263] font-bold">{dept.name[0]}</div>}
                  <div>
                    <div className="font-bold text-[#1A3263]">{dept.name}</div>
                    <div className="mt-1 inline-flex px-3 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold">HOD: {dept.hod} - Each Dept HOD You Added</div>
                    <div className="text-[12px] text-[#547792] mt-2">Faculty: {dept.facultyCount} • {dept.description}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed">
              <div className="text-3xl">🏛️</div>
              <div className="font-bold text-[#1A3263] mt-3">No departments yet - Add departments with HOD</div>
              <div className="text-[12px] text-[#547792] mt-2">Oru oru departmentkkum HOD - Add in Admin → Departments with HOD - Your own departments, not PSG</div>
            </div>
          )}
        </section>

        {/* Courses - Your own */}
        <section className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
          <h2 className="font-display text-[24px] font-bold text-[#1A3263] flex items-center gap-3"><GraduationCap className="text-[#FAB95B]" /> Courses - {courses.length} Courses You Added (Not PSG) - A to Z You Add</h2>
          {hasContent(courses) ? (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {courses.map(course=>(
                <div key={course.id} className="rounded-[16px] border-2 border-[#E8E2DB] p-5 hover:border-[#FAB95B]/40 transition-colors">
                  <div className="font-bold text-[#1A3263]">{course.degree} - {course.name}</div>
                  <div className="text-[12px] text-[#547792] mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[11px]">{course.duration}</span>
                    <span className="px-2 py-1 rounded-full bg-[#FAB95B]/20 text-[#1A3263] text-[11px] font-bold">{course.fees}</span>
                    <span className="px-2 py-1 rounded-full bg-white border text-[11px]">Intake {course.intake}</span>
                  </div>
                  <div className="text-[11px] text-[#1A3263]/60 mt-2">Eligibility: {course.eligibility}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed">
              <div className="text-3xl">🎓</div>
              <div className="font-bold text-[#1A3263] mt-3">No courses yet - Add your courses A to Z</div>
              <div className="text-[12px] text-[#547792] mt-2">Add in Admin → Courses - Your own courses, not PSG - UI frame ours, content yours</div>
            </div>
          )}
        </section>

        {/* Facilities - Your own environment */}
        <section className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
          <h2 className="font-display text-[24px] font-bold text-[#1A3263]">Facilities - Environment, Labs, etc - {facilities.length} Facilities You Added - Your Own Environment (Not PSG)</h2>
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
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">No facilities yet - Add your environment, labs, facilities in Admin → Facilities - Your own environment, not PSG</div>
          )}
        </section>

        {/* Placements - Your own */}
        <section className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
          <h2 className="font-bold text-[20px] text-[#1A3263]">Placements - {placements.length} Records You Added - Your Own Placement Data (Not PSG)</h2>
          {hasContent(placements) ? (
            <div className="mt-6 space-y-3">
              {placements.map(p=>(
                <div key={p.id} className="flex items-center justify-between p-4 rounded-[12px] border-2 border-[#E8E2DB] bg-[#E8E2DB]/20">
                  <div><div className="font-bold text-[#1A3263] text-[13px]">{p.company} - {p.year}</div><div className="text-[11px] text-[#547792]">{p.package} • {p.students} students • {p.department}</div></div>
                  <span className="px-3 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold">{p.package}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">No placement records yet - Add your placement data in Admin → Placements - Your own placements, not PSG</div>
          )}
        </section>

        {/* Gallery - Your own campus images */}
        <section className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
          <h2 className="font-bold text-[20px] text-[#1A3263] flex items-center gap-2"><ImageIcon className="text-[#FAB95B]" /> Gallery - {gallery.length} Campus Images You Added - Your Own Images (Not PSG)</h2>
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
              <div className="text-3xl">🖼️</div>
              <div className="font-bold text-[#1A3263] mt-3">No campus images yet - Add your college images</div>
              <div className="text-[11px] text-[#547792] mt-1">Add in Admin → Gallery - Your environment, buildings, labs, hostel, library, sports - Your own images, not PSG - UI frame ours, content yours</div>
            </div>
          )}
        </section>

        {/* Contact */}
        <section className="rounded-[24px] bg-[#1A3263] text-white p-8">
          <h2 className="font-display text-[24px] font-bold text-[#FAB95B]">Contact {college.name} - Your Own Contact (Not PSG)</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6 text-[13px]">
            <div className="flex gap-3"><MapPin size={18} className="text-[#FAB95B] shrink-0" /><div><div className="font-bold text-[#FAB95B]">Address - Your Own</div><div className="text-[#E8E2DB]/80 mt-1">{college.address}, {college.city}, {college.district} - {college.pincode}</div></div></div>
            <div className="flex gap-3"><Phone size={18} className="text-[#FAB95B] shrink-0" /><div><div className="font-bold text-[#FAB95B]">Phone - Your Own</div><div className="text-[#E8E2DB]/80 mt-1">{college.phone}</div></div></div>
            <div className="flex gap-3"><Mail size={18} className="text-[#FAB95B] shrink-0" /><div><div className="font-bold text-[#FAB95B]">Email - Your Own</div><div className="text-[#E8E2DB]/80 mt-1">{college.email}</div><div className="text-[#E8E2DB]/60 text-[11px] mt-1">{college.website}</div></div></div>
          </div>
          <div className="mt-6 rounded-[12px] bg-white/5 border border-white/10 p-4 text-[11px] text-[#E8E2DB]/60">This is your own college website - {college.name} - ID {college.id} - Not PSG Tech - You added all content yourself A to Z - Logo, campus images, environment, departments with HOD, courses, facilities, placements, exams, etc - UI frame ours (header, sidebar, colors #E8E2DB #FAB95B #547792 #1A3263, layout), content yours - Whatever section you need - All sections you add yourself!</div>
        </section>
      </div>

      <footer className="bg-[#1A3263] text-white border-t-4 border-[#FAB95B] mt-12">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-10">
          <div className="flex flex-wrap justify-between gap-8">
            <div>
              <div className="flex gap-3">
                {branding.logo ? <img src={branding.logo} className="h-12 w-12 rounded-[12px] bg-white object-cover border-2 border-[#FAB95B]" alt="Logo" /> : <div className="h-12 w-12 rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold">{college.name[0]}</div>}
                <div><div className="font-bold">{college.name}</div><div className="text-[11px] text-[#FAB95B]">ID {college.id} • Your Own (Not PSG) • {college.district}</div></div>
              </div>
              <div className="text-[11px] text-[#E8E2DB]/60 mt-4 max-w-[360px]">Your own college website - Not PSG Tech - You added all content A to Z yourself - UI frame ours, content yours - Palette #E8E2DB #FAB95B #547792 #1A3263</div>
            </div>
            <div className="text-[11px] text-[#E8E2DB]/40">© 2026 {college.name} • Your Own Website • ID {college.id} • Not PSG • UI Frame Ours, Content Yours • A to Z You Add</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function CollegePage() {
  const { slug } = useParams()
  const [college, setCollege] = useState(null)
  const [customData, setCustomData] = useState({})
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const found = getCollegeBySlug(slug)
    if (found) {
      setCollege(found)
      setCustomData(getCollegeCustomData(found.id))
    } else {
      const staticFound = staticColleges.find(c => c.slug === slug)
      setCollege(staticFound || null)
    }
  }, [slug])

  if (!college) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#E8E2DB] p-8">
        <div className="text-center">
          <h1 className="font-display text-[32px] font-bold text-[#1A3263]">College not found - {slug}</h1>
          <p className="text-[13px] text-[#547792] mt-2">If you just registered, your college slug is {slug} - Go to Admin to add content - Your own college, not PSG</p>
          <Link to="/" className="mt-6 inline-flex h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-semibold">Back to Home - Your Own Colleges</Link>
        </div>
      </div>
    )
  }

  // Check if this is a custom college (registered via signup) - show custom page with empty states
  const isCustomCollege = college.id > 1000 || getCollegeCustomData(college.id) && Object.keys(getCollegeCustomData(college.id)).length > 0 || college.verificationStatus === 'PENDING'
  const custom = getCollegeCustomData(college.id)
  const hasCustomContent = custom && (custom.departments?.length > 0 || custom.courses?.length > 0 || custom.branding?.logo || custom.branding?.heroImage)

  // If custom college or has custom data, show custom page (your own, not PSG)
  if (isCustomCollege || hasCustomContent || college.id > 1000) {
    return <CustomCollegePage college={college} customData={custom} />
  }

  const theme = applyCollegeTheme(college)
  const isPSG = slug === 'psg-tech'

  return (
    <div className="college-theme min-h-screen bg-[#E8E2DB]/20" style={theme.style}>
      <CollegeHeader college={college} />

      <HeroSection college={college} />
      <QuickInfo college={college} />

      <div className="sticky top-[84px] lg:top-[121px] z-30 bg-white/90 backdrop-blur-xl border-y border-[#E8E2DB]">
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
              className={`whitespace-nowrap px-5 h-9 rounded-full text-[13px] font-semibold border transition-all ${activeTab===tab.id?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-white border-[#E8E2DB] text-[#547792] hover:border-[#1A3263] hover:text-[#1A3263]'}`}
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

      <section id="contact" className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
        <div className="rounded-[24px] bg-[#1A3263] text-white p-8 lg:p-10">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <h2 className="font-display text-[28px] font-semibold">Contact {college.shortName}</h2>
              <div className="mt-8 space-y-5">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center shrink-0"><MapPin size={18} /></div>
                  <div>
                    <div className="text-[11px] uppercase font-bold opacity-50">Address</div>
                    <div className="text-[13px] leading-[1.5] mt-1 opacity-90">{college.contact?.address || `${college.address}, ${college.city}`}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center shrink-0"><Phone size={18} /></div>
                  <div>
                    <div className="text-[11px] uppercase font-bold opacity-50">Phone</div>
                    <div className="text-[13px] mt-1">{college.contact?.phone || college.phone}</div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center shrink-0"><Mail size={18} /></div>
                  <div>
                    <div className="text-[11px] uppercase font-bold opacity-50">Email</div>
                    <div className="text-[13px] mt-1">{college.contact?.email || college.email}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-[20px] bg-white text-[#1A3263] p-6">
              <h3 className="font-semibold">Location - Your Own Campus</h3>
              <p className="text-[13px] text-[#547792] mt-2">{college.district} • {college.city} • ID {college.id} • Your own college location, not PSG</p>
              <div className="mt-4 h-48 rounded-[12px] bg-[#E8E2DB] border overflow-hidden">
                {college.gallery?.[0] ? <img src={college.gallery[0]} className="h-full w-full object-cover" alt="Map" /> : <div className="h-full w-full grid place-items-center text-[#547792] text-[12px]">Add campus image in Gallery - Your own image</div>}
              </div>
              <div className="mt-4 flex gap-2">
                <a href={`tel:${(college.contact?.phone || college.phone || '').split('/')[0]}`} className="flex-1 h-10 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[13px] font-semibold">Call Now</a>
                <a href={`mailto:${(college.contact?.email || college.email || '').split('/')[0]?.trim()}`} className="flex-1 h-10 rounded-full bg-[#E8E2DB] border text-[#1A3263] grid place-items-center text-[13px] font-semibold">Email</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#1A3263] text-white border-t-4 border-[#FAB95B]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10">
            <div>
              <div className="flex gap-3">
                <img src={college.branding?.logo || `https://ui-avatars.com/api/?name=${college.name}&background=1A3263&color=FAB95B`} className="h-12 w-12 rounded-[12px] bg-white object-cover" alt="Logo" />
                <div>
                  <div className="font-display font-semibold text-[16px] leading-tight">{college.name}</div>
                  <div className="text-[11px] opacity-60 mt-1">{college.tagline}</div>
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[10px] font-bold">
                    <BadgeCheck size={12} /> {college.verificationStatus || 'Verified'} • ID {college.id}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase opacity-40">Quick Links</div>
              <div className="mt-4 space-y-2 text-[13px] opacity-70">
                <div>About Us - Your Own</div><div>Departments with HOD - Your Own</div><div>Courses - Your Own</div><div>Placements - Your Own</div>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase opacity-40">Campus - Your Own</div>
              <div className="mt-4 space-y-2 text-[13px] opacity-70">
                <div>Facilities - Your Environment</div><div>Hostel - Your Hostel</div><div>Gallery - Your Images</div><div>Events - Your Events</div>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase opacity-40">Contact - Your Own</div>
              <div className="mt-4 space-y-2 text-[12px] opacity-70 leading-[1.5]">
                <div>{(college.address || college.contact?.address || '').slice(0,80)}...</div>
                <div>{(college.phone || college.contact?.phone || '').split('/')[0]}</div>
                <div>{(college.email || college.contact?.email || '').split('/')[0]}</div>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-4 text-[11px] opacity-50">
            <div>© 2026 {college.name} • ID {college.id} • Your Own College (Not PSG) • UI Frame Ours, Content Yours • A to Z You Add • #{college.district}</div>
            <div>Your own website - Not PSG - You added all content yourself - Logo, campus images, departments with HOD, courses, facilities, placements, exams, etc - UI frame ours, content yours</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
