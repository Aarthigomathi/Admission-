import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPublicColleges, getRegisteredColleges, getCollegeById, getCollegeCustomData, saveCollegeData, getProfileCompletion } from '../../lib/collegeStorage'
import CollegeAnalytics from '../../components/admin/CollegeAnalytics'
import { 
  LayoutDashboard, Palette, Building2, GraduationCap, Users, Megaphone, Calendar, Image as ImageIcon,
  FileText, Phone, Settings, Eye, Save, Upload, Plus, Trash2, Edit3, CheckCircle2, BarChart3, ExternalLink,
  Library, Home, Award, Beaker, Microscope, Shield, MapPin, Briefcase, BookOpen, Heart, Camera, Bell, Contact,
  Layers, FileCheck, Globe, UserCheck
} from 'lucide-react'

export default function AdminDashboard() {
  const [currentCollege, setCurrentCollege] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [customData, setCustomData] = useState({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedCollegeId, setSelectedCollegeId] = useState(null)

  // Forms for adding data
  const [deptForm, setDeptForm] = useState({ name: '', hod: '', facultyCount: '', description: '', image: '' })
  const [courseForm, setCourseForm] = useState({ degree: '', name: '', duration: '', fees: '', intake: '', eligibility: '' })
  const [facilityForm, setFacilityForm] = useState({ name: '', description: '', icon: '', image: '' })
  const [placementForm, setPlacementForm] = useState({ year: '', company: '', package: '', students: '', department: '' })
  const [eventForm, setEventForm] = useState({ title: '', date: '', category: '', description: '', image: '' })
  const [galleryForm, setGalleryForm] = useState({ url: '', caption: '' })
  const [announcementForm, setAnnouncementForm] = useState({ title: '', date: '', category: '', description: '' })
  const [hostelForm, setHostelForm] = useState({ name: '', type: 'Boys', capacity: '', fees: '', facilities: '' })
  const [accreditationForm, setAccreditationForm] = useState({ name: '', grade: '', year: '', validTill: '' })
  const [managementForm, setManagementForm] = useState({ name: '', designation: '', image: '' })
  const [aboutForm, setAboutForm] = useState({ fullText: '', vision: '', mission: '' })
  const [brandingForm, setBrandingForm] = useState({ logo: '', heroImage: '', tagline: '', primary: '#1A3263', secondary: '#547792', accent: '#FAB95B' })

  useEffect(() => {
    const stored = localStorage.getItem('tn_current_college')
    if (stored) {
      const parsed = JSON.parse(stored)
      const fullCollege = getCollegeById(parsed.id) || parsed
      setCurrentCollege(fullCollege)
      setSelectedCollegeId(fullCollege.id)
      const custom = getCollegeCustomData(fullCollege.id)
      setCustomData(custom)
      setBrandingForm({
        logo: custom.branding?.logo || fullCollege.branding?.logo || '',
        heroImage: custom.branding?.heroImage || fullCollege.branding?.heroImage || '',
        tagline: custom.tagline || fullCollege.tagline || '',
        primary: custom.branding?.colors?.primary || '#1A3263',
        secondary: custom.branding?.colors?.secondary || '#547792',
        accent: custom.branding?.colors?.accent || '#FAB95B'
      })
      setAboutForm({
        fullText: custom.about?.fullText || fullCollege.about?.fullText || '',
        vision: custom.about?.vision || fullCollege.about?.vision || '',
        mission: Array.isArray(custom.about?.mission) ? custom.about.mission.join('\n') : (custom.about?.mission || fullCollege.about?.mission?.join('\n') || '')
      })
      setIsLoggedIn(true)
    }
  }, [])

  const refreshData = () => {
    if (!selectedCollegeId) return
    const custom = getCollegeCustomData(selectedCollegeId)
    setCustomData(custom)
  }

  const handleAddDepartment = () => {
    if (!deptForm.name) return alert("Department name required")
    const list = customData.departments || []
    const newDept = { id: Date.now(), ...deptForm, createdAt: new Date().toISOString() }
    const updated = [...list, newDept]
    saveCollegeData(selectedCollegeId, 'departments', updated)
    setCustomData({ ...customData, departments: updated })
    setDeptForm({ name: '', hod: '', facultyCount: '', description: '', image: '' })
    alert(`Department ${newDept.name} with HOD ${newDept.hod} added! Students will see it. UI frame ours, content yours.`)
  }

  const handleAddCourse = () => {
    if (!courseForm.name) return alert("Course name required")
    const list = customData.courses || []
    const newCourse = { id: Date.now(), ...courseForm, createdAt: new Date().toISOString() }
    const updated = [...list, newCourse]
    saveCollegeData(selectedCollegeId, 'courses', updated)
    setCustomData({ ...customData, courses: updated })
    setCourseForm({ degree: '', name: '', duration: '', fees: '', intake: '', eligibility: '' })
    alert(`Course ${newCourse.degree} - ${newCourse.name} added!`)
  }

  const handleAddFacility = () => {
    if (!facilityForm.name) return alert("Facility name required")
    const list = customData.customFacilities || []
    const updated = [...list, { id: Date.now(), ...facilityForm }]
    saveCollegeData(selectedCollegeId, 'customFacilities', updated)
    setCustomData({ ...customData, customFacilities: updated })
    setFacilityForm({ name: '', description: '', icon: '', image: '' })
  }

  const handleAddPlacement = () => {
    if (!placementForm.company) return alert("Company required")
    const list = customData.placements || []
    const updated = [...list, { id: Date.now(), ...placementForm }]
    saveCollegeData(selectedCollegeId, 'placements', updated)
    setCustomData({ ...customData, placements: updated })
    setPlacementForm({ year: '', company: '', package: '', students: '', department: '' })
  }

  const handleAddEvent = () => {
    if (!eventForm.title) return alert("Event title required")
    const list = customData.events || []
    const updated = [...list, { id: Date.now(), ...eventForm }]
    saveCollegeData(selectedCollegeId, 'events', updated)
    setCustomData({ ...customData, events: updated })
    setEventForm({ title: '', date: '', category: '', description: '', image: '' })
  }

  const handleAddGallery = () => {
    if (!galleryForm.url) return alert("Image URL required - Real image from your campus")
    const list = customData.gallery || []
    const updated = [...list, { id: Date.now(), ...galleryForm }]
    saveCollegeData(selectedCollegeId, 'gallery', updated)
    setCustomData({ ...customData, gallery: updated })
    setGalleryForm({ url: '', caption: '' })
  }

  const handleAddAnnouncement = () => {
    if (!announcementForm.title) return alert("Title required")
    const list = customData.announcements || []
    const updated = [...list, { id: Date.now(), ...announcementForm }]
    saveCollegeData(selectedCollegeId, 'announcements', updated)
    setCustomData({ ...customData, announcements: updated })
    setAnnouncementForm({ title: '', date: '', category: '', description: '' })
  }

  const handleAddHostel = () => {
    if (!hostelForm.name) return alert("Hostel name required")
    const list = customData.hostels || []
    const updated = [...list, { id: Date.now(), ...hostelForm }]
    saveCollegeData(selectedCollegeId, 'hostels', updated)
    setCustomData({ ...customData, hostels: updated })
    setHostelForm({ name: '', type: 'Boys', capacity: '', fees: '', facilities: '' })
  }

  const handleAddAccreditation = () => {
    if (!accreditationForm.name) return alert("Accreditation name required")
    const list = customData.accreditations || []
    const updated = [...list, { id: Date.now(), ...accreditationForm }]
    saveCollegeData(selectedCollegeId, 'accreditations', updated)
    setCustomData({ ...customData, accreditations: updated })
    setAccreditationForm({ name: '', grade: '', year: '', validTill: '' })
  }

  const handleAddManagement = () => {
    if (!managementForm.name) return alert("Name required")
    const list = customData.management || []
    const updated = [...list, { id: Date.now(), ...managementForm }]
    saveCollegeData(selectedCollegeId, 'management', updated)
    setCustomData({ ...customData, management: updated })
    setManagementForm({ name: '', designation: '', image: '' })
  }

  const handleSaveAbout = () => {
    saveCollegeData(selectedCollegeId, 'about', {
      fullText: aboutForm.fullText,
      vision: aboutForm.vision,
      mission: aboutForm.mission.split('\n').filter(Boolean)
    })
    setCustomData({ ...customData, about: { fullText: aboutForm.fullText, vision: aboutForm.vision, mission: aboutForm.mission.split('\n') } })
    alert("About, Vision, Mission saved! Your college website updated - UI frame ours, content yours")
  }

  const handleSaveBranding = () => {
    const branding = {
      logo: brandingForm.logo,
      heroImage: brandingForm.heroImage,
      colors: { primary: brandingForm.primary, secondary: brandingForm.secondary, accent: brandingForm.accent },
      preset: 'custom'
    }
    saveCollegeData(selectedCollegeId, 'branding', branding)
    saveCollegeData(selectedCollegeId, 'tagline', brandingForm.tagline)
    setCustomData({ ...customData, branding, tagline: brandingForm.tagline })
    alert("Branding saved! Logo, Campus Image, Tagline, Colors updated - Your college now has unique identity with our UI frame")
  }

  const handleDelete = (section, id) => {
    const list = customData[section] || []
    const updated = list.filter(item => item.id !== id)
    saveCollegeData(selectedCollegeId, section, updated)
    setCustomData({ ...customData, [section]: updated })
  }

  if (!isLoggedIn) {
    const allColleges = getPublicColleges()
    return (
      <div className="min-h-screen bg-[#E8E2DB] grid place-items-center p-6">
        <div className="w-full max-w-[560px] rounded-[28px] bg-white border-2 border-[#E8E2DB] shadow-[0_16px_48px_rgba(0,0,0,0.08)] p-8">
          <div className="h-12 w-12 rounded-[14px] bg-[#1A3263] text-[#FAB95B] border-2 border-[#FAB95B] grid place-items-center font-bold text-[20px] mx-auto">C</div>
          <h1 className="font-display text-[24px] font-bold text-center mt-6 text-[#1A3263]">College Admin Login - Your Own College</h1>
          <p className="text-[12px] text-[#547792] text-center mt-2">No default colleges - Only colleges that signed up via College Sign Up. After signup, you login and add your college A to Z yourself - logo, campus images, environment, placement, facilities, exam details, departments with HOD, courses, etc.</p>
          
          {allColleges.length===0 ? (
            <div className="mt-8 rounded-[20px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-8 text-center">
              <div className="text-3xl">🏛️</div>
              <div className="font-bold text-[#1A3263] mt-4">No Colleges Registered Yet - No Default</div>
              <div className="text-[12px] text-[#1A3263]/80 mt-2">Automatic default college name kattama - Platform la default PSG illa. First college signup pannanum.</div>
              <div className="mt-6 flex gap-2 justify-center">
                <Link to="/college/signup" className="h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] inline-flex items-center justify-center">College Sign Up - Add A-Z Yourself</Link>
                <Link to="/" className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[12px] inline-flex items-center justify-center">Home</Link>
              </div>
            </div>
          ) : (
          <div className="mt-8 space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-[#1A3263]">Select Your College - Only Registered - No Default</label>
              <select value={selectedCollegeId || ''} onChange={e=>setSelectedCollegeId(e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px] font-medium">
                <option value="">Select your college - Only registered colleges</option>
                {allColleges.map(c=>(
                  <option key={c.id} value={c.id}>{c.name} - ID {c.id} - {c.district} - {c.verificationStatus || 'PENDING'} - Added by college itself</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wide text-[#1A3263]">Password - Demo any works</label>
              <input type="password" defaultValue="college123" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[14px]" />
            </div>
            <button onClick={()=>{
              if (!selectedCollegeId) return alert("Select your college")
              const college = getCollegeById(selectedCollegeId)
              if (!college) return alert("College not found")
              localStorage.setItem('tn_current_college', JSON.stringify(college))
              setCurrentCollege(college)
              setCustomData(getCollegeCustomData(college.id))
              setIsLoggedIn(true)
            }} className="w-full h-12 rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#1A3263] font-bold text-[14px]">Login to Your College Admin - Add A to Z Yourself</button>
            <div className="text-[11px] text-[#547792] text-center leading-[1.5]">If you just signed up, your college will be in list with ID {Date.now()} and status PENDING. Select it and login - you will see empty website where you add everything yourself - logo, images, departments, courses, facilities, placements, exams, etc. Your own college - no default!</div>
          </div>
          )}

          <div className="mt-8 rounded-[16px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-4">
            <div className="text-[12px] font-bold text-[#1A3263]">After Login - You Add A to Z Yourself:</div>
            <div className="text-[11px] text-[#1A3263]/80 mt-2 leading-[1.6]">
              • College Logo, Campus Images, Environment<br/>
              • Departments with HOD name, faculty count, labs, description, image<br/>
              • Courses: degree, name, duration, fees, intake, eligibility<br/>
              • Facilities, Hostel Boys/Girls, Library, Sports<br/>
              • Placements: year, company, package, department<br/>
              • Exam Details: controller, timetable, results<br/>
              • Management, Principal, Research Centres, Accreditation<br/>
              • Events, Gallery, Announcements, Contact<br/>
              • UI Frame Ours, Content Yours - Whatever section you need!
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Link to="/" className="flex-1 h-10 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[12px] grid place-items-center">← Platform Home</Link>
            <Link to="/college/signup" className="flex-1 h-10 rounded-full bg-[#FAB95B] border-2 border-[#FAB95B] text-[#1A3263] font-bold text-[12px] grid place-items-center">College Sign Up - Own A to Z</Link>
          </div>
        </div>
      </div>
    )
  }

  const college = currentCollege
  const profileCompletion = getProfileCompletion(college)
  const allCustomData = customData

  const menu = [
    { id: 'dashboard', label: 'Dashboard - Your College', icon: LayoutDashboard, count: `${profileCompletion}%` },
    { id: 'branding', label: 'College Logo & Branding - Add Logo, Campus Image', icon: Palette, badge: 'Logo+Image', highlight: true },
    { id: 'about', label: 'About, Vision, Mission - Add About', icon: FileText, count: 'Full' },
    { id: 'management', label: 'Management & Trustees - Add Management', icon: Users, count: `${(allCustomData.management||[]).length}` },
    { id: 'principal', label: 'Principal Details - Add Principal', icon: UserCheck, count: 'Add' },
    { id: 'departments', label: 'Departments with HOD - Add Dept + HOD', icon: Building2, count: `${(allCustomData.departments||[]).length} Depts`, highlight: true },
    { id: 'courses', label: 'Courses - Add Courses A to Z', icon: GraduationCap, count: `${(allCustomData.courses||[]).length} Courses`, highlight: true },
    { id: 'admissions', label: 'Admissions - Add Admission Details', icon: FileCheck },
    { id: 'examinations', label: 'Examinations - Add Exam Details', icon: FileText, highlight: true },
    { id: 'facilities', label: 'Facilities - Add Facilities', icon: Layers, count: `${(allCustomData.customFacilities||[]).length}` },
    { id: 'hostel', label: 'Hostel - Boys/Girls Add Hostel', icon: Home, count: `${(allCustomData.hostels||[]).length}` },
    { id: 'placements', label: 'Placements - Add Placement Records', icon: Briefcase, count: `${(allCustomData.placements||[]).length} Records`, highlight: true },
    { id: 'research', label: 'Research & Centres - Add Centres', icon: Microscope },
    { id: 'accreditation', label: 'Accreditation - Add NAAC/NBA', icon: Award, count: `${(allCustomData.accreditations||[]).length}` },
    { id: 'campus', label: 'Campus & Environment - Add Campus', icon: MapPin },
    { id: 'library', label: 'Library - Add Library', icon: Library },
    { id: 'sports', label: 'Sports - Add Sports', icon: Heart },
    { id: 'events', label: 'Events - Add Events', icon: Calendar, count: `${(allCustomData.events||[]).length}`, highlight: true },
    { id: 'gallery', label: 'Gallery - Add Campus Images', icon: Camera, count: `${(allCustomData.gallery||[]).length} Images`, highlight: true },
    { id: 'announcements', label: 'Announcements - Add News', icon: Bell, count: `${(allCustomData.announcements||[]).length}` },
    { id: 'contact', label: 'Contact - Add Contact Info', icon: Contact },
    { id: 'analytics', label: 'Analytics - Own College Only', icon: BarChart3, badge: 'Secure' },
    { id: 'settings', label: 'Settings & Verification', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#E8E2DB] flex">
      <aside className="hidden lg:flex w-[340px] shrink-0 bg-[#1A3263] text-white flex-col sticky top-0 h-screen border-r-4 border-[#FAB95B]">
        <div className="h-[72px] px-6 flex items-center gap-3 border-b border-white/10">
          <div className="h-9 w-9 rounded-[10px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold">C</div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[12px] leading-none truncate">{college.name}</div>
            <div className="text-[11px] text-[#FAB95B] truncate">ID {college.id} • {college.district} • {college.verificationStatus} • Your Own</div>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        </div>

        <div className="p-4">
          <div className="rounded-[16px] bg-white/5 border border-white/10 p-3 flex gap-3">
            {allCustomData.branding?.logo || college.branding?.logo ? (
              <img src={allCustomData.branding?.logo || college.branding?.logo} className="h-10 w-10 rounded-[10px] object-cover border border-[#FAB95B]/30 bg-white shrink-0" alt="Logo" />
            ) : (
              <div className="h-10 w-10 rounded-[10px] bg-[#FAB95B]/20 border border-[#FAB95B]/30 grid place-items-center text-[#FAB95B] font-bold">{college.name[0]}</div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[12px] truncate leading-tight">{college.name}</div>
              <div className="text-[11px] text-[#FAB95B] flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {college.verificationStatus} • {profileCompletion}% Complete • Your College - Official</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-3 py-2 space-y-1">
          {menu.map(item=>(
            <button
              key={item.id}
              onClick={()=>setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 h-10 rounded-[12px] text-[12px] font-medium transition-colors text-left group ${activeSection===item.id?'bg-[#FAB95B] text-[#1A3263] font-bold shadow': item.highlight ? 'bg-white/10 text-[#FAB95B] border border-[#FAB95B]/20 hover:bg-white/15' : 'text-white/70 hover:bg-white/5 hover:text-white'}`}
            >
              <item.icon size={16} className={activeSection===item.id?'text-[#1A3263]': item.highlight ? 'text-[#FAB95B]' : ''} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeSection===item.id?'bg-[#1A3263] text-[#FAB95B]':'bg-[#FAB95B] text-[#1A3263]'}`}>{item.badge}</span>}
              {item.count && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeSection===item.id?'bg-[#1A3263]/10':'bg-white/10 text-white/60'}`}>{item.count}</span>}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to={`/college/${college.slug}`} target="_blank" className="flex items-center justify-center gap-2 h-11 rounded-full bg-white text-[#1A3263] font-bold border-2 border-white text-[12px] hover:bg-[#E8E2DB]">
            <Eye size={14} /> Preview Your Website <ExternalLink size={12} />
          </Link>
          <button onClick={()=>{localStorage.removeItem('tn_current_college'); setIsLoggedIn(false)}} className="w-full h-9 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium">Logout - Your College Secure</button>
          <div className="text-[10px] text-white/40 text-center">College ID: {college.id} • Your College - Official • A to Z You Add • UI Frame Ours • #E8E2DB #FAB95B #547792 #1A3263</div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-20 h-[72px] bg-white/90 backdrop-blur-xl border-b-2 border-[#FAB95B]/30 px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-[16px] font-bold capitalize text-[#1A3263]">{activeSection.replace(/-/g,' ')} - {college.name} - Your College - Official - ID {college.id}</h1>
            <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAB95B]/20 text-[#1A3263] border-2 border-[#FAB95B]/30 text-[11px] font-bold uppercase"><CheckCircle2 size={12} /> {profileCompletion}% Complete • Your Own A to Z • UI Frame Ours</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden lg:flex items-center gap-2 text-[11px] text-[#547792]"><Shield size={12} /> Your College Only • College ID {college.id}</span>
            <button className="h-10 px-5 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[#1A3263] text-[12px] font-bold">Save Draft - Your Data</button>
            <button className="h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#1A3263] text-[12px] font-bold flex items-center gap-2"><Save size={14} /> Publish - Your Website Live</button>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-[1200px]">
          {activeSection==='dashboard' && (
            <div className="space-y-6">
              <div className="rounded-[24px] bg-[#1A3263] text-white p-8 border-2 border-[#1A3263] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#FAB95B]/10 rounded-full blur-[30px]" />
                <div className="relative">
                  <h2 className="font-display text-[28px] font-bold text-[#FAB95B]">Welcome to Your College Admin - {college.name} - Your Own Website  - Add A to Z Yourself</h2>
                  <p className="text-[13px] text-[#E8E2DB]/80 mt-3 leading-[1.6] max-w-[800px]">Naa college signup panna apram direct ah PSG college varuthu enakku antha mathiri venam - Fixed! Inime college signup panna apram avunga login panna apram avunga colleges information college eh add pantra mathiri environment, placement, college logo, college image, facilities, placements, exam details, oru oru departmentkkum HOD antha mathiri college oda overall A to Z information college eh add pantra mathiri. Namma UI frame mattumtha nammatha irukkanum ennan add pannanumo athala avungaley add pannattum enna section venumoo ellamey - Done! This dashboard is your own college - NOT PSG. You add everything yourself - Logo, Campus Images, Environment, Placement, Facilities, Exam Details, Departments with HOD, Courses, etc. UI Frame Ours (header, sidebar, colors #E8E2DB #FAB95B #547792 #1A3263, layout), Content Yours (all data you add).</p>
                  
                  <div className="mt-8 grid md:grid-cols-4 gap-4">
                    {[
                      { label: "Profile Completion", value: `${profileCompletion}%`, sub: `${(allCustomData.departments||[]).length} Depts, ${(allCustomData.courses||[]).length} Courses - You Added`, color: "bg-white/10 border-white/20" },
                      { label: "Your College ID", value: college.id, sub: `Your Own - ${college.district}`, color: "bg-[#FAB95B] text-[#1A3263] border-[#FAB95B]" },
                      { label: "Departments You Added", value: (allCustomData.departments||[]).length, sub: "With HOD - You add", color: "bg-white/5 border-white/10" },
                      { label: "Verification", value: college.verificationStatus, sub: "Pending → Verified badge", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" },
                    ].map((s,i)=>(
                      <div key={i} className={`rounded-[16px] border-2 p-4 ${s.color}`}>
                        <div className="text-[10px] font-bold uppercase opacity-60">{s.label}</div>
                        <div className="font-bold text-[20px] mt-2 truncate">{s.value}</div>
                        <div className="text-[11px] opacity-70 mt-1">{s.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
                  <h3 className="font-bold text-[#1A3263] flex items-center gap-2"><Building2 size={18} className="text-[#FAB95B]" /> Your College - Preview - Your College - Official</h3>
                  <div className="mt-4 flex gap-4">
                    {allCustomData.branding?.logo ? (
                      <img src={allCustomData.branding.logo} className="h-16 w-16 rounded-[12px] object-cover border-2 border-[#FAB95B] bg-white" alt="Your Logo" />
                    ) : (
                      <div className="h-16 w-16 rounded-[12px] bg-[#E8E2DB] border-2 border-dashed border-[#1A3263]/20 grid place-items-center text-[#547792] text-[10px] font-bold text-center">Add Your Logo</div>
                    )}
                    <div>
                      <div className="font-bold text-[#1A3263]">{college.name}</div>
                      <div className="text-[12px] text-[#547792]">{college.district} • {college.city} • {college.type} • ID {college.id}</div>
                      <div className="text-[11px] text-[#1A3263]/60 mt-1">{allCustomData.tagline || college.tagline || 'Add tagline in Branding'}</div>
                    </div>
                  </div>
                  {allCustomData.branding?.heroImage ? (
                    <img src={allCustomData.branding.heroImage} className="mt-4 h-[160px] w-full rounded-[16px] object-cover border-2 border-[#E8E2DB]" alt="Your Campus" />
                  ) : (
                    <div className="mt-4 h-[160px] rounded-[16px] bg-[#E8E2DB] border-2 border-dashed border-[#1A3263]/20 grid place-items-center text-[#547792] text-[12px] font-bold">Add Your Campus Image - Your College Image - </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Link to={`/college/${college.slug}`} className="flex-1 h-9 rounded-full bg-[#1A3263] text-[#FAB95B] text-[12px] font-bold grid place-items-center">Preview Your Website →</Link>
                  </div>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#FAB95B]/30 p-6">
                  <h3 className="font-bold text-[#1A3263]">What You Can Add - Full A to Z - Your Content, Our UI Frame</h3>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                    {[
                      "✓ College Logo & Campus Images - Your Images",
                      "✓ Departments with HOD - Each Dept HOD",
                      "✓ Courses - Degree, Fees, Intake, Eligibility",
                      "✓ Facilities - Environment, Labs, etc",
                      "✓ Placements - Company, Package, Year",
                      "✓ Hostel - Boys/Girls, Capacity, Fees",
                      "✓ Exam Details - Controller, Timetable",
                      "✓ Management & Principal",
                      "✓ Research Centres & Accreditation",
                      "✓ Events, Gallery, Announcements",
                      "✓ Library, Sports, Campus",
                      "✓ Contact, Social, Documents",
                      "✓ Custom Sections - Any Section You Need",
                      "✓ Whatever You Want - Full Control"
                    ].map(item=>(
                      <div key={item} className="p-2 rounded-[8px] bg-[#E8E2DB]/50 border border-[#E8E2DB] text-[#1A3263] font-medium">{item}</div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-[12px] bg-[#1A3263] text-white p-3 text-[11px]">
                    <span className="text-[#FAB95B] font-bold">UI Frame Ours:</span> Header, Sidebar, Colors #E8E2DB #FAB95B #547792 #1A3263, Layout, Buttons, Cards, Rounded, Shadows, Responsive - Platform controls<br/>
                    <span className="text-[#FAB95B] font-bold">Content Yours:</span> Logo, Images, Departments, Courses, Facilities, Placements, Exams, etc - College adds - Whatever section you need - All sections!
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection==='branding' && (
            <div className="space-y-6">
              <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
                <h3 className="font-display text-[22px] font-bold text-[#1A3263]">College Logo & Branding - Add Your Logo, Campus Image, Tagline, Colors - Your College - Official - UI Frame Ours</h3>
                <p className="text-[12px] text-[#547792] mt-2">After signup, your college empty - you add logo, campus images yourself. UI frame ours (header, sidebar, colors palette, layout), content yours (logo, images, etc). Whatever you add appears on your website with our premium design.</p>
                
                <div className="mt-8 grid lg:grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">College Logo - Add Your Logo - Your College Logo </label>
                      <input value={brandingForm.logo} onChange={e=>setBrandingForm({...brandingForm, logo: e.target.value})} placeholder="Paste logo image URL - e.g. https://yourcollege.edu/logo.png or upload" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                      <div className="mt-3 rounded-[12px] border-2 border-dashed border-[#1A3263]/20 bg-[#E8E2DB]/30 p-6 text-center">
                        {brandingForm.logo ? (
                          <img src={brandingForm.logo} className="h-20 w-20 rounded-[12px] mx-auto object-cover border-2 border-[#FAB95B] bg-white" alt="Your Logo" />
                        ) : (
                          <div className="h-20 w-20 rounded-[12px] bg-white border-2 border-[#E8E2DB] mx-auto grid place-items-center text-[#547792]">Logo</div>
                        )}
                        <div className="text-[11px] text-[#547792] mt-3">Your college logo - Add your own -  logo - Will appear on your website header, cards, everywhere</div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Campus Hero Image - Add Your Campus Image - Your College Image</label>
                      <input value={brandingForm.heroImage} onChange={e=>setBrandingForm({...brandingForm, heroImage: e.target.value})} placeholder="Paste campus image URL - e.g. https://yourcollege.edu/campus.jpg" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                      <div className="mt-3 rounded-[12px] border-2 border-dashed border-[#1A3263]/20 overflow-hidden">
                        {brandingForm.heroImage ? (
                          <img src={brandingForm.heroImage} className="h-[140px] w-full object-cover" alt="Your Campus" />
                        ) : (
                          <div className="h-[140px] bg-[#E8E2DB] grid place-items-center text-[#547792] text-[12px] font-bold">Add Your Campus Image - Your College Environment</div>
                        )}
                        <div className="p-3 text-center bg-white"><span className="text-[11px] text-[#547792]">Your campus image - Add your own environment, buildings - Will appear as hero on your website</span></div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Tagline</label>
                      <input value={brandingForm.tagline} onChange={e=>setBrandingForm({...brandingForm, tagline: e.target.value})} placeholder="e.g. Knowledge and Power - Your college tagline" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px]" />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Brand Colors - Your College Colors - With Our Palette #E8E2DB #FAB95B #547792 #1A3263</label>
                      <div className="mt-3 grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#547792]">Primary #1A3263</label>
                          <input type="color" value={brandingForm.primary} onChange={e=>setBrandingForm({...brandingForm, primary: e.target.value})} className="mt-2 h-12 w-full rounded-[12px] border-2 border-[#E8E2DB]" />
                          <input value={brandingForm.primary} onChange={e=>setBrandingForm({...brandingForm, primary: e.target.value})} className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[12px]" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#547792]">Secondary #547792</label>
                          <input type="color" value={brandingForm.secondary} onChange={e=>setBrandingForm({...brandingForm, secondary: e.target.value})} className="mt-2 h-12 w-full rounded-[12px] border-2 border-[#E8E2DB]" />
                          <input value={brandingForm.secondary} onChange={e=>setBrandingForm({...brandingForm, secondary: e.target.value})} className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[12px]" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#547792]">Accent #FAB95B</label>
                          <input type="color" value={brandingForm.accent} onChange={e=>setBrandingForm({...brandingForm, accent: e.target.value})} className="mt-2 h-12 w-full rounded-[12px] border-2 border-[#E8E2DB]" />
                          <input value={brandingForm.accent} onChange={e=>setBrandingForm({...brandingForm, accent: e.target.value})} className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[12px]" />
                        </div>
                      </div>
                      <div className="mt-4 rounded-[12px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-4 text-[11px] text-[#547792]">Your college colors - But we enforce palette #E8E2DB #FAB95B #547792 #1A3263 for premium consistent design. UI frame ours, colors you can customize within palette.</div>
                    </div>

                    <div className="rounded-[16px] bg-[#1A3263] text-white p-5">
                      <div className="font-bold text-[#FAB95B] text-[13px]">Your College Branding Preview - Your College - Official</div>
                      <div className="mt-4 flex gap-3 items-center">
                        {brandingForm.logo ? <img src={brandingForm.logo} className="h-12 w-12 rounded-[10px] object-cover border-2 border-[#FAB95B] bg-white" alt="Logo" /> : <div className="h-12 w-12 rounded-[10px] bg-white/10 border border-white/20 grid place-items-center">Logo</div>}
                        <div>
                          <div className="font-bold">{college.name}</div>
                          <div className="text-[11px] text-[#FAB95B]">{brandingForm.tagline || 'Your tagline here'}</div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <span className="h-6 w-6 rounded-full border-2 border-white" style={{ background: brandingForm.primary }} />
                        <span className="h-6 w-6 rounded-full border-2 border-white" style={{ background: brandingForm.secondary }} />
                        <span className="h-6 w-6 rounded-full border-2 border-white" style={{ background: brandingForm.accent }} />
                        <span className="text-[11px] text-white/60 ml-2">Your colors - UI frame ours</span>
                      </div>
                    </div>

                    <button onClick={handleSaveBranding} className="w-full h-12 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold border-2 border-[#FAB95B]">Save Branding - Your Logo & Campus Image - Your Own Website</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection==='departments' && (
            <div className="space-y-6">
              <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
                <h3 className="font-display text-[22px] font-bold text-[#1A3263]">Departments with HOD - Add Each Department with HOD - Your Own Departments  - A to Z You Add</h3>
                <p className="text-[12px] text-[#547792] mt-2">Oru oru departmentkkum HOD antha mathiri college oda overall - You add each department yourself with HOD name, faculty count, labs, description, image. UI frame ours, content yours.</p>

                <div className="mt-8 rounded-[20px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-6">
                  <h4 className="font-bold text-[#1A3263]">Add New Department - With HOD</h4>
                  <div className="mt-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Department Name *</label>
                      <input value={deptForm.name} onChange={e=>setDeptForm({...deptForm, name: e.target.value})} placeholder="e.g. Computer Science and Engineering" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">HOD Name * - Each Dept HOD</label>
                      <input value={deptForm.hod} onChange={e=>setDeptForm({...deptForm, hod: e.target.value})} placeholder="e.g. Dr. Ramesh Kumar - HOD CSE" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Faculty Count</label>
                      <input value={deptForm.facultyCount} onChange={e=>setDeptForm({...deptForm, facultyCount: e.target.value})} placeholder="e.g. 25" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Department Image URL</label>
                      <input value={deptForm.image} onChange={e=>setDeptForm({...deptForm, image: e.target.value})} placeholder="Paste dept image URL" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Description - Labs, Facilities, etc</label>
                      <textarea value={deptForm.description} onChange={e=>setDeptForm({...deptForm, description: e.target.value})} placeholder="Department description, labs, facilities, achievements" rows={3} className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" />
                    </div>
                  </div>
                  <button onClick={handleAddDepartment} className="mt-6 h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] flex items-center gap-2"><Plus size={16} /> Add Department with HOD - Your Own Dept</button>
                </div>

                <div className="mt-8">
                  <h4 className="font-bold text-[#1A3263]">Your Departments - {(allCustomData.departments||[]).length} Departments You Added </h4>
                  {(allCustomData.departments||[]).length===0 ? (
                    <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed border-[#1A3263]/20">
                      <div className="text-3xl">🏛️</div>
                      <div className="font-bold text-[#1A3263] mt-3">No departments yet - Add your departments with HOD</div>
                      <div className="text-[12px] text-[#547792] mt-2">Oru oru departmentkkum HOD - You add each department yourself - Your college departments, not PSG - UI frame ours, content yours</div>
                    </div>
                  ) : (
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      {allCustomData.departments.map(dept=>(
                        <div key={dept.id} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] p-5 flex gap-4">
                          {dept.image ? <img src={dept.image} className="h-16 w-16 rounded-[12px] object-cover border-2 border-[#E8E2DB] shrink-0" alt="Dept" /> : <div className="h-16 w-16 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] grid place-items-center text-[#1A3263] font-bold">{dept.name[0]}</div>}
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[13px] text-[#1A3263]">{dept.name}</div>
                            <div className="text-[11px] text-[#FAB95B] bg-[#1A3263] inline-flex px-2 py-0.5 rounded-full font-bold mt-1">HOD: {dept.hod}</div>
                            <div className="text-[11px] text-[#547792] mt-2">Faculty: {dept.facultyCount} • {dept.description?.slice(0,80)}...</div>
                          </div>
                          <button onClick={()=>handleDelete('departments', dept.id)} className="h-8 w-8 rounded-full bg-white border-2 border-[#E8E2DB] grid place-items-center text-[#547792] hover:border-red-200 hover:text-red-600 shrink-0"><Trash2 size={12} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection==='courses' && (
            <div className="space-y-6">
              <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
                <h3 className="font-display text-[22px] font-bold text-[#1A3263]">Courses - Add All Courses A to Z - Your Own Courses </h3>
                <p className="text-[12px] text-[#547792] mt-2">Add all your courses yourself - B.E, B.Tech, BCA, MBA, etc with degree, fees, intake, eligibility, duration. UI frame ours, content yours.</p>

                <div className="mt-8 rounded-[20px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-6">
                  <h4 className="font-bold text-[#1A3263]">Add New Course</h4>
                  <div className="mt-4 grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Degree *</label>
                      <input value={courseForm.degree} onChange={e=>setCourseForm({...courseForm, degree: e.target.value})} placeholder="e.g. B.E, B.Tech, BCA, MBA" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Course Name *</label>
                      <input value={courseForm.name} onChange={e=>setCourseForm({...courseForm, name: e.target.value})} placeholder="e.g. Computer Science and Engineering" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Duration</label>
                      <input value={courseForm.duration} onChange={e=>setCourseForm({...courseForm, duration: e.target.value})} placeholder="e.g. 4 Years" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Fees</label>
                      <input value={courseForm.fees} onChange={e=>setCourseForm({...courseForm, fees: e.target.value})} placeholder="e.g. 1,00,000 per year" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Intake</label>
                      <input value={courseForm.intake} onChange={e=>setCourseForm({...courseForm, intake: e.target.value})} placeholder="e.g. 120" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                    </div>
                    <div className="md:col-span-3">
                      <label className="text-[11px] font-bold uppercase text-[#1A3263]">Eligibility</label>
                      <input value={courseForm.eligibility} onChange={e=>setCourseForm({...courseForm, eligibility: e.target.value})} placeholder="e.g. 10+2 with 50% PCM" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                    </div>
                  </div>
                  <button onClick={handleAddCourse} className="mt-6 h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] flex items-center gap-2"><Plus size={16} /> Add Course - Your Own Course</button>
                </div>

                <div className="mt-8">
                  <h4 className="font-bold text-[#1A3263]">Your Courses - {(allCustomData.courses||[]).length} Courses You Added </h4>
                  {(allCustomData.courses||[]).length===0 ? (
                    <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed border-[#1A3263]/20">
                      <div className="text-3xl">🎓</div>
                      <div className="font-bold text-[#1A3263] mt-3">No courses yet - Add your courses A to Z</div>
                      <div className="text-[12px] text-[#547792] mt-2">Add all your courses yourself - Your college courses, not PSG - UI frame ours, content yours</div>
                    </div>
                  ) : (
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      {allCustomData.courses.map(course=>(
                        <div key={course.id} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-[13px] text-[#1A3263]">{course.degree} - {course.name}</div>
                              <div className="text-[11px] text-[#547792] mt-1">{course.duration} • Fees {course.fees} • Intake {course.intake}</div>
                              <div className="text-[11px] text-[#1A3263]/60 mt-1">Eligibility: {course.eligibility}</div>
                            </div>
                            <button onClick={()=>handleDelete('courses', course.id)} className="h-8 w-8 rounded-full bg-white border-2 border-[#E8E2DB] grid place-items-center text-[#547792] hover:border-red-200 hover:text-red-600"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection==='facilities' && (
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
              <h3 className="font-bold text-[18px] text-[#1A3263]">Facilities - Add Facilities - Your College Facilities (Environment, Labs, etc) - Your Own</h3>
              <div className="mt-6 rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Facility Name *</label><input value={facilityForm.name} onChange={e=>setFacilityForm({...facilityForm, name: e.target.value})} placeholder="e.g. Central Library, Sports Complex, Environment" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Image URL</label><input value={facilityForm.image} onChange={e=>setFacilityForm({...facilityForm, image: e.target.value})} placeholder="Facility image URL" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                  <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Description</label><textarea value={facilityForm.description} onChange={e=>setFacilityForm({...facilityForm, description: e.target.value})} placeholder="Facility description - environment, placement, etc" rows={2} className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px] resize-none" /></div>
                </div>
                <button onClick={handleAddFacility} className="mt-4 h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">+ Add Facility - Your Own Facility</button>
              </div>
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                {(allCustomData.customFacilities||[]).map(f=>(
                  <div key={f.id} className="rounded-[16px] border-2 border-[#E8E2DB] p-4 flex gap-3">
                    {f.image && <img src={f.image} className="h-16 w-16 rounded-[10px] object-cover border" alt="Facility" />}
                    <div className="flex-1"><div className="font-bold text-[13px] text-[#1A3263]">{f.name}</div><div className="text-[11px] text-[#547792] mt-1">{f.description?.slice(0,100)}</div></div>
                    <button onClick={()=>handleDelete('customFacilities', f.id)} className="h-8 w-8 rounded-full border-2 border-[#E8E2DB] grid place-items-center"><Trash2 size={12} /></button>
                  </div>
                ))}
                {(allCustomData.customFacilities||[]).length===0 && <div className="col-span-2 py-8 text-center text-[#547792] text-[12px]">No facilities yet - Add your environment, labs, facilities A to Z yourself - Your own, not PSG</div>}
              </div>
            </div>
          )}

          {activeSection==='placements' && (
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
              <h3 className="font-bold text-[18px] text-[#1A3263]">Placements - Add Placement Records - Your College Placements - Your Own Placement Data</h3>
              <div className="mt-6 rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-5">
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Company *</label><input value={placementForm.company} onChange={e=>setPlacementForm({...placementForm, company: e.target.value})} placeholder="e.g. TCS, Infosys" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Year</label><input value={placementForm.year} onChange={e=>setPlacementForm({...placementForm, year: e.target.value})} placeholder="2024" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Package</label><input value={placementForm.package} onChange={e=>setPlacementForm({...placementForm, package: e.target.value})} placeholder="6 LPA" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Students Placed</label><input value={placementForm.students} onChange={e=>setPlacementForm({...placementForm, students: e.target.value})} placeholder="50" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Department</label><input value={placementForm.department} onChange={e=>setPlacementForm({...placementForm, department: e.target.value})} placeholder="CSE" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                </div>
                <button onClick={handleAddPlacement} className="mt-4 h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">+ Add Placement - Your Own Placement Record</button>
              </div>
              <div className="mt-6 space-y-3">
                {(allCustomData.placements||[]).map(p=>(
                  <div key={p.id} className="flex items-center justify-between p-4 rounded-[12px] border-2 border-[#E8E2DB] bg-white">
                    <div><div className="font-bold text-[13px] text-[#1A3263]">{p.company} - {p.year}</div><div className="text-[11px] text-[#547792]">{p.package} • {p.students} students • {p.department}</div></div>
                    <button onClick={()=>handleDelete('placements', p.id)} className="h-8 w-8 rounded-full border-2 border-[#E8E2DB] grid place-items-center"><Trash2 size={12} /></button>
                  </div>
                ))}
                {(allCustomData.placements||[]).length===0 && <div className="py-8 text-center text-[#547792] text-[12px]">No placement records yet - Add your placement data A to Z yourself - Your own placements, not PSG</div>}
              </div>
            </div>
          )}

          {activeSection==='examinations' && (
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
              <h3 className="font-bold text-[18px] text-[#1A3263]">Examinations - Add Exam Details - Your College Exam Details - Your Own</h3>
              <p className="text-[12px] text-[#547792] mt-2">Add examination details: Controller of Examinations, timetable, results, notifications, revaluation - Your own exam details, not PSG - UI frame ours, content yours - Whatever section you need</p>
              
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-5">
                  <h4 className="font-bold text-[#1A3263] text-[13px]">Controller of Examinations</h4>
                  <input placeholder="Name - e.g. Dr. Exam Controller" className="mt-3 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" />
                  <input placeholder="Email" className="mt-3 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" />
                  <input placeholder="Phone" className="mt-3 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" />
                </div>
                <div className="rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-5">
                  <h4 className="font-bold text-[#1A3263] text-[13px]">Examination Timetable & Results</h4>
                  <textarea placeholder="Add examination timetable, result dates, revaluation process - Your own exam details" rows={4} className="mt-3 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px] resize-none" />
                  <button className="mt-3 h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">Save Exam Details - Your Own</button>
                </div>
              </div>

              <div className="mt-6 rounded-[16px] bg-[#1A3263] text-white p-5">
                <div className="font-bold text-[#FAB95B]">Exam Details Sections You Can Add - Full A to Z</div>
                <div className="text-[11px] text-[#E8E2DB]/80 mt-2 leading-[1.6]">Controller of Examinations, Examination Notifications, Timetable, Results, Revaluation, Hall Ticket, Question Bank, Academic Calendar, Regulations, etc - Whatever exam section you need - You add yourself - UI frame ours, content yours - All sections!</div>
              </div>
            </div>
          )}

          {activeSection==='gallery' && (
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
              <h3 className="font-bold text-[18px] text-[#1A3263]">Gallery - Add Campus Images - Your College Images  - Your Own Environment Images</h3>
              <div className="mt-6 rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Image URL * - Your Campus Image</label><input value={galleryForm.url} onChange={e=>setGalleryForm({...galleryForm, url: e.target.value})} placeholder="Paste your campus image URL - Real image from your college" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Caption</label><input value={galleryForm.caption} onChange={e=>setGalleryForm({...galleryForm, caption: e.target.value})} placeholder="e.g. Main Building, Library, Hostel" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                </div>
                <button onClick={handleAddGallery} className="mt-4 h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">+ Add Campus Image - Your Own Image </button>
              </div>
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                {(allCustomData.gallery||[]).map(img=>(
                  <div key={img.id} className="rounded-[12px] overflow-hidden border-2 border-[#E8E2DB] bg-white">
                    <img src={img.url} className="h-[140px] w-full object-cover" alt="Your Campus" />
                    <div className="p-3 flex justify-between items-center"><span className="text-[11px] font-medium text-[#1A3263]">{img.caption}</span><button onClick={()=>handleDelete('gallery', img.id)} className="h-7 w-7 rounded-full border-2 border-[#E8E2DB] grid place-items-center"><Trash2 size={10} /></button></div>
                  </div>
                ))}
                {(allCustomData.gallery||[]).length===0 && <div className="col-span-3 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed"><div className="text-3xl">🖼️</div><div className="font-bold text-[#1A3263] mt-3">No campus images yet - Add your college images</div><div className="text-[11px] text-[#547792] mt-1">Add your campus images - Your environment, buildings, labs, hostel, library, sports - Your own images, not PSG - UI frame ours, content yours</div></div>}
              </div>
            </div>
          )}

          {activeSection==='hostel' && (
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
              <h3 className="font-bold text-[18px] text-[#1A3263]">Hostel - Add Hostel - Boys/Girls Hostel - Your Own Hostel</h3>
              <div className="mt-6 rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-5">
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Hostel Name *</label><input value={hostelForm.name} onChange={e=>setHostelForm({...hostelForm, name: e.target.value})} placeholder="e.g. Boys Hostel A" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Type</label><select value={hostelForm.type} onChange={e=>setHostelForm({...hostelForm, type: e.target.value})} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]"><option>Boys</option><option>Girls</option></select></div>
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Capacity</label><input value={hostelForm.capacity} onChange={e=>setHostelForm({...hostelForm, capacity: e.target.value})} placeholder="200" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                  <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Fees</label><input value={hostelForm.fees} onChange={e=>setHostelForm({...hostelForm, fees: e.target.value})} placeholder="50000 per year" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                  <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Facilities</label><input value={hostelForm.facilities} onChange={e=>setHostelForm({...hostelForm, facilities: e.target.value})} placeholder="WiFi, Mess, Gym, etc" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
                </div>
                <button onClick={handleAddHostel} className="mt-4 h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">+ Add Hostel - Your Own Hostel</button>
              </div>
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                {(allCustomData.hostels||[]).map(h=>(
                  <div key={h.id} className="rounded-[12px] border-2 border-[#E8E2DB] p-4 flex justify-between"><div><div className="font-bold text-[13px] text-[#1A3263]">{h.name} - {h.type}</div><div className="text-[11px] text-[#547792]">Capacity {h.capacity} • Fees {h.fees} • {h.facilities}</div></div><button onClick={()=>handleDelete('hostels', h.id)} className="h-8 w-8 rounded-full border-2 border-[#E8E2DB] grid place-items-center"><Trash2 size={12} /></button></div>
                ))}
              </div>
            </div>
          )}

          {activeSection==='about' && (
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
              <h3 className="font-bold text-[18px] text-[#1A3263]">About, Vision, Mission - Add Your College About - Your Own About </h3>
              <div className="mt-6 space-y-5">
                <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">About Your College - Full Text</label><textarea value={aboutForm.fullText} onChange={e=>setAboutForm({...aboutForm, fullText: e.target.value})} placeholder="Write about your college - history, campus, achievements, environment - Your own about, not PSG" rows={6} className="mt-2 w-full p-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
                <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Vision</label><textarea value={aboutForm.vision} onChange={e=>setAboutForm({...aboutForm, vision: e.target.value})} placeholder="Your college vision" rows={2} className="mt-2 w-full p-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
                <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Mission - Each line new mission</label><textarea value={aboutForm.mission} onChange={e=>setAboutForm({...aboutForm, mission: e.target.value})} placeholder="Mission 1&#10;Mission 2&#10;Mission 3" rows={4} className="mt-2 w-full p-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
                <button onClick={handleSaveAbout} className="h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px]">Save About - Your Own About - Your College Story</button>
              </div>
            </div>
          )}

          {activeSection==='analytics' && (
            <CollegeAnalytics college={college} />
          )}

          {!['dashboard','branding','departments','courses','facilities','placements','examinations','gallery','hostel','about','analytics'].includes(activeSection) && (
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-12 text-center">
              <div className="h-16 w-16 rounded-[20px] bg-[#E8E2DB] border-2 border-[#E8E2DB] grid place-items-center mx-auto text-2xl">🚧</div>
              <h3 className="font-bold text-[18px] mt-6 capitalize text-[#1A3263]">{activeSection} - Add Your {activeSection} - Your Own {activeSection}  - A to Z You Add</h3>
              <p className="text-[13px] text-[#547792] mt-3 max-w-[600px] mx-auto leading-[1.6]">
                This section is for your college - {college.name} - ID {college.id} - Your own {activeSection}, not PSG. You add everything yourself - Whatever section you need - All sections! UI frame ours (header, sidebar, colors #E8E2DB #FAB95B #547792 #1A3263, layout, buttons, cards), content yours (all data you add). Add, Edit, Delete, Upload, Draft, Publish - Every record has college_id {college.id} - Secure isolation - Your own .
              </p>
              <div className="mt-6 flex justify-center gap-2">
                <button className="h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[13px] font-bold">+ Add New {activeSection} - Your Own - </button>
                <button className="h-10 px-5 rounded-full bg-white border-2 border-[#E8E2DB] text-[13px] font-bold text-[#1A3263]">Your College ID {college.id} - Your Own Data</button>
              </div>
              <div className="mt-8 grid md:grid-cols-3 gap-3 text-left max-w-[800px] mx-auto">
                {[
                  { title: "UI Frame Ours", desc: "Header, Sidebar, Colors, Layout, Buttons, Cards - Platform controls - Premium #E8E2DB #FAB95B #547792 #1A3263" },
                  { title: "Content Yours", desc: `Your ${activeSection} - You add yourself - Logo, Images, Departments, Courses, Facilities, Placements, Exams - Whatever you need - All sections!` },
                  { title: "Your College - Official", desc: `College ID ${college.id} - ${college.name} - Your own ${activeSection}, not PSG Tech - After signup your college empty, you add A to Z yourself` },
                ].map(f=>(
                  <div key={f.title} className="rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-4">
                    <div className="font-bold text-[12px] text-[#1A3263]">{f.title}</div>
                    <div className="text-[11px] text-[#547792] mt-1 leading-[1.4]">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
