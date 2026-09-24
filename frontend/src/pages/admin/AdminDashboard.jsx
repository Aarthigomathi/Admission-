import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPublicColleges, getRegisteredColleges, getCollegeById, getCollegeCustomData, saveCollegeData, saveCollegeDataSafe, getProfileCompletion, findCollegeByLoginId } from '../../lib/collegeStorage'
import CollegeAnalytics from '../../components/admin/CollegeAnalytics'
import AboutPagesAdmin from '../../components/admin/AboutPagesAdmin.jsx'
import { 
 LayoutDashboard, Palette, Building2, GraduationCap, Users, Megaphone, Calendar, Image as ImageIcon, Trophy, Landmark, ShieldCheck, PhoneCall,
 FileText, Phone, Settings, Eye, Save, Upload, Plus, Trash2, Edit3, CheckCircle2, BarChart3, ExternalLink,
 Library, Home, Award, Beaker, Microscope, Shield, MapPin, Briefcase, BookOpen, Heart, Camera, Bell, Contact,
 Layers, FileCheck, Globe, UserCheck
} from 'lucide-react'

export default function AdminDashboard() {
 const [currentCollege, setCurrentCollege] = useState(null)
 const [activeSection, setActiveSection] = useState('dashboard')

 // Storage-safe save: images auto-compress; on quota, existing stores compacted & retried
 const saveSafe = (section, data) => {
  return saveCollegeDataSafe(selectedCollegeId, section, data).then(ok => {
    if (!ok) alert('Storage full - irukkura images-ellam auto-compress pannitom; innorum full-aa irundha photo-ku URL use pannunga')
    return ok
  })
 }
 const [customData, setCustomData] = useState({})
 const [isLoggedIn, setIsLoggedIn] = useState(false)
 const [loginUser, setLoginUser] = useState('')
 const [loginPass, setLoginPass] = useState('')
 const [selectedCollegeId, setSelectedCollegeId] = useState(null)

 // Forms
 const [deptForm, setDeptForm] = useState({ name: '', hod: '', hodDesignation: 'Head of Department', hodQualification: '', hodExperience: '', hodEmail: '', hodPhone: '', hodImage: '', hodDetailedBio: '', hodBio: '', hodResearch: '', hodPublications: '', hodAwards: '', facultyCount: '', description: '', image: '' })
 const [courseForm, setCourseForm] = useState({ degree: '', name: '', duration: '', fees: '', intake: '', eligibility: '' })
 const [facilityForm, setFacilityForm] = useState({ name: '', description: '', icon: '', image: '' })
 const [placementForm, setPlacementForm] = useState({ year: '', company: '', package: '', students: '', department: '', logo: '', description: '' })
 const [eventForm, setEventForm] = useState({ title: '', date: '', category: 'Cultural / Arts Events', description: '', image: '' })
 const [eventCategoryFilter, setEventCategoryFilter] = useState('All')
 const [galleryForm, setGalleryForm] = useState({ url: '', caption: '' })
 const [announcementForm, setAnnouncementForm] = useState({ title: '', date: '', category: '', description: '' })
 const [hostelForm, setHostelForm] = useState({ name: '', type: 'Boys', capacity: '', fees: '', facilities: '', description: '', images: [] })
 const [newHostelImageUrl, setNewHostelImageUrl] = useState('')
 const [accreditationForm, setAccreditationForm] = useState({ name: '', grade: '', year: '', validTill: '', agency: '', description: '', image: '' })
 const [researchForm, setResearchForm] = useState({ name: '', type: 'Centre of Excellence', funding: '', year: '', coordinator: '', description: '', facilities: '', achievements: '', image: '' })
 const [campusForm, setCampusForm] = useState({ title: '', area: '', description: '', environment: '', greenInitiatives: '', facilities: '', images: [] })
 const [newCampusImageUrl, setNewCampusImageUrl] = useState('')
 const [libraryForm, setLibraryForm] = useState({ totalBooks: '', journals: '', digitalResources: '', timings: '', librarian: '', description: '', facilities: '', image: '' })
 const [sportsForm, setSportsForm] = useState({ name: '', coach: '', description: '', facilities: '', achievements: '', image: '' })
 const [alumniForm, setAlumniForm] = useState({ name: '', designation: '', company: '', companyLogo: '', batch: '', image: '' })
 const [achievementForm, setAchievementForm] = useState({ title: '', image: '', description: '' })
 const [managementForm, setManagementForm] = useState({ name: '', designation: '', image: '', email: '', phone: '', description: '' })
 const [principalForm, setPrincipalForm] = useState({ name: '', designation: 'Principal', qualification: '', experience: '', image: '', message: '', detailedBio: '', email: '', phone: '', bio: '', research: '', publications: '', awards: '' })
 const [aboutForm, setAboutForm] = useState({ fullText: '', vision: '', mission: '' })
 const [brandingForm, setBrandingForm] = useState({ logo: '', heroImage: '', tagline: '', collegeImages: [], primary: '#1A3263', secondary: '#547792', accent: '#FAB95B' })
 const [newCollegeImageUrl, setNewCollegeImageUrl] = useState('')
 const [admissionForm, setAdmissionForm] = useState({ status: 'Open', academicYear: '2026-27', title: '', description: '', eligibility: '', process: '', applicationStart: '', applicationEnd: '', counsellingDate: '', lastDate: '', entranceExam: '', cutoff: '', fees: '', totalSeats: '', documents: '', quota: '', scholarships: '', applicationLink: '', brochureImage: '', contactPhone: '', contactEmail: '' })
 const [contactForm, setContactForm] = useState({ address: '', city: '', district: '', pincode: '', phone: '', phone2: '', email: '', admissionsEmail: '', website: '', officeHours: '', mapLink: '', contactPerson: '', contactDesignation: '', contactPhone: '', enquiryPhone: '', enquiryEmail: '', supportHours: '', fax: '', tollFree: '' })
 const [homeForm, setHomeForm] = useState({ tneaCode: '', eventDate: '', eventTime: '', chiefGuestName: '', chiefGuestTitle: '', chiefGuestPhoto: '', coordinators: '', convenors: '', partnerLogos: '', statPlacements: '', statCompanies: '', statMaxLpa: '', aboutImage: '', accreditationLogos: '', industryLogos: '', ugDesc: '', pgDesc: '', placementText: '', footerAbout: '' })
 const [settingsForm, setSettingsForm] = useState({ name: '', shortName: '', tagline: '', type: '', collegeType: '', university: '', affiliation: '', established: '', accreditation: '', email: '', phone: '', website: '', verificationStatus: '', maintenanceMode: false, showAdmissions: true, showPlacements: true, showEvents: true, loginUsername: '', loginPassword: '' })

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
    collegeImages: custom.branding?.collegeImages || fullCollege.branding?.collegeImages || [],
    tagline: custom.tagline || fullCollege.tagline || '',
    primary: custom.branding?.colors?.primary || '#1A3263',
    secondary: custom.branding?.colors?.secondary || '#547792',
    accent: custom.branding?.colors?.accent || '#FAB95B'
   })
   setHomeForm({
    tneaCode: custom.homePage?.tneaCode || fullCollege.homePage?.tneaCode || '',
    eventDate: custom.homePage?.eventDate || fullCollege.homePage?.eventDate || '',
    eventTime: custom.homePage?.eventTime || fullCollege.homePage?.eventTime || '',
    chiefGuestName: custom.homePage?.chiefGuestName || fullCollege.homePage?.chiefGuestName || '',
    chiefGuestTitle: custom.homePage?.chiefGuestTitle || fullCollege.homePage?.chiefGuestTitle || '',
    chiefGuestPhoto: custom.homePage?.chiefGuestPhoto || fullCollege.homePage?.chiefGuestPhoto || '',
    coordinators: (custom.homePage?.coordinators || fullCollege.homePage?.coordinators || []).join('\n'),
    convenors: (custom.homePage?.convenors || fullCollege.homePage?.convenors || []).join('\n'),
    partnerLogos: (custom.homePage?.partnerLogos || fullCollege.homePage?.partnerLogos || []).join('\n'),
    statPlacements: custom.homePage?.statPlacements || fullCollege.homePage?.statPlacements || '',
    statCompanies: custom.homePage?.statCompanies || fullCollege.homePage?.statCompanies || '',
    statMaxLpa: custom.homePage?.statMaxLpa || fullCollege.homePage?.statMaxLpa || '',
    aboutImage: custom.homePage?.aboutImage || fullCollege.homePage?.aboutImage || '',
    accreditationLogos: (custom.homePage?.accreditationLogos || fullCollege.homePage?.accreditationLogos || []).join('\n'),
    industryLogos: (custom.homePage?.industryLogos || fullCollege.homePage?.industryLogos || []).join('\n'),
    ugDesc: custom.homePage?.ugDesc || fullCollege.homePage?.ugDesc || '',
    pgDesc: custom.homePage?.pgDesc || fullCollege.homePage?.pgDesc || '',
    placementText: custom.homePage?.placementText || fullCollege.homePage?.placementText || '',
    footerAbout: custom.homePage?.footerAbout || fullCollege.homePage?.footerAbout || ''
   })
   setAboutForm({
    fullText: custom.about?.fullText || fullCollege.about?.fullText || '',
    vision: custom.about?.vision || fullCollege.about?.vision || '',
    mission: Array.isArray(custom.about?.mission) ? custom.about.mission.join('\n') : (custom.about?.mission || fullCollege.about?.mission?.join('\n') || '')
   })
   const principalData = custom.principal || custom.principalDetails || fullCollege.principal || {}
   if (principalData && (principalData.name || principalData.qualification)) {
     setPrincipalForm({
       name: principalData.name || fullCollege.principalName || '',
       qualification: principalData.qualification || '',
       experience: principalData.experience || '',
       image: principalData.image || '',
       message: principalData.message || '',
       email: principalData.email || '',
       phone: principalData.phone || ''
     })
   } else if (fullCollege.principalName) {
     setPrincipalForm(prev => ({ ...prev, name: fullCollege.principalName }))
   }
   if (custom.library) {
     setLibraryForm(custom.library)
   }
   if (custom.admissions) {
     setAdmissionForm({ status: custom.admissions.status || 'Open', academicYear: custom.admissions.academicYear || '2026-27', title: custom.admissions.title || '', description: custom.admissions.description || '', eligibility: custom.admissions.eligibility || '', process: custom.admissions.process || '', applicationStart: custom.admissions.applicationStart || '', applicationEnd: custom.admissions.applicationEnd || '', counsellingDate: custom.admissions.counsellingDate || '', lastDate: custom.admissions.lastDate || '', entranceExam: custom.admissions.entranceExam || '', cutoff: custom.admissions.cutoff || '', fees: custom.admissions.fees || '', totalSeats: custom.admissions.totalSeats || '', documents: custom.admissions.documents || '', quota: custom.admissions.quota || '', scholarships: custom.admissions.scholarships || '', applicationLink: custom.admissions.applicationLink || '', brochureImage: custom.admissions.brochureImage || '', contactPhone: custom.admissions.contactPhone || '', contactEmail: custom.admissions.contactEmail || '' })
   }
   if (custom.contactDetails || custom.contacts) {
     const cd = custom.contactDetails || custom.contacts || {}
     setContactForm({
       address: cd.address || fullCollege.address || '',
       city: cd.city || fullCollege.city || '',
       district: cd.district || fullCollege.district || '',
       pincode: cd.pincode || fullCollege.pincode || '',
       phone: cd.phone || fullCollege.phone || '',
       phone2: cd.phone2 || '',
       email: cd.email || fullCollege.email || '',
       admissionsEmail: cd.admissionsEmail || '',
       website: cd.website || fullCollege.website || '',
       officeHours: cd.officeHours || '',
       mapLink: cd.mapLink || '',
       contactPerson: cd.contactPerson || '',
       contactDesignation: cd.contactDesignation || '',
       contactPhone: cd.contactPhone || '',
       enquiryPhone: cd.enquiryPhone || '',
       enquiryEmail: cd.enquiryEmail || '',
       supportHours: cd.supportHours || '',
       fax: cd.fax || '',
       tollFree: cd.tollFree || ''
     })
   } else {
     setContactForm({
       address: fullCollege.address || '',
       city: fullCollege.city || '',
       district: fullCollege.district || '',
       pincode: fullCollege.pincode || '',
       phone: fullCollege.phone || '',
       phone2: '',
       email: fullCollege.email || '',
       admissionsEmail: '',
       website: fullCollege.website || '',
       officeHours: '',
       mapLink: '',
       contactPerson: '',
       contactDesignation: '',
       contactPhone: '',
       enquiryPhone: '',
       enquiryEmail: '',
       supportHours: '',
       fax: '',
       tollFree: ''
     })
   }
   if (custom.settings) {
     setSettingsForm({ ...settingsForm, ...custom.settings, loginUsername: fullCollege.loginUsername || settingsForm.loginUsername || '', loginPassword: fullCollege.loginPassword || settingsForm.loginPassword || '' })
   } else {
     setSettingsForm({
       name: fullCollege.name || '',
       shortName: fullCollege.shortName || '',
       tagline: custom.tagline || fullCollege.tagline || '',
       type: fullCollege.type || '',
       collegeType: fullCollege.collegeType || '',
       university: fullCollege.university || '',
       affiliation: fullCollege.affiliation || '',
       established: fullCollege.established || '',
       accreditation: fullCollege.accreditation || '',
       email: fullCollege.email || '',
       phone: fullCollege.phone || '',
       website: fullCollege.website || '',
       verificationStatus: fullCollege.verificationStatus || 'PENDING',
       maintenanceMode: false,
       showAdmissions: true,
       showPlacements: true,
       showEvents: true,
      loginUsername: fullCollege.loginUsername || '',
      loginPassword: fullCollege.loginPassword || ''
     })
   }
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
  if (!deptForm.hod) return alert("HOD name required")
  const list = customData.departments || []
  const newDept = { id: Date.now(), ...deptForm, createdAt: new Date().toISOString() }
  const updated = [...list, newDept]
  saveSafe('departments', updated)
  setCustomData({ ...customData, departments: updated })
  setDeptForm({ name: '', hod: '', hodDesignation: 'Head of Department', hodQualification: '', hodExperience: '', hodEmail: '', hodPhone: '', hodImage: '', hodDetailedBio: '', hodBio: '', hodResearch: '', hodPublications: '', hodAwards: '', facultyCount: '', description: '', image: '' })
  alert(`Department ${newDept.name} with HOD ${newDept.hod} added successfully`)
 }

 const handleAddCourse = () => {
  if (!courseForm.name) return alert("Course name required")
  const list = customData.courses || []
  const newCourse = { id: Date.now(), ...courseForm, createdAt: new Date().toISOString() }
  const updated = [...list, newCourse]
  saveSafe('courses', updated)
  setCustomData({ ...customData, courses: updated })
  setCourseForm({ degree: '', name: '', duration: '', fees: '', intake: '', eligibility: '' })
  alert(`Course ${newCourse.degree} - ${newCourse.name} added!`)
 }

 const handleAddFacility = () => {
  if (!facilityForm.name) return alert("Facility name required")
  const list = customData.customFacilities || []
  const updated = [...list, { id: Date.now(), ...facilityForm }]
  saveSafe('customFacilities', updated)
  setCustomData({ ...customData, customFacilities: updated })
  setFacilityForm({ name: '', description: '', icon: '', image: '' })
 }

 const handleAddPlacement = () => {
  if (!placementForm.company) return alert("Company required")
  const list = customData.placements || []
  const updated = [...list, { id: Date.now(), ...placementForm }]
  saveSafe('placements', updated)
  setCustomData({ ...customData, placements: updated })
  setPlacementForm({ year: '', company: '', package: '', students: '', department: '', logo: '', description: '' })
 }

 const handlePlacementLogoUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => setPlacementForm({ ...placementForm, logo: ev.target.result })
  reader.readAsDataURL(file)
 }

 const handleAddEvent = () => {
  if (!eventForm.title) return alert("Event title required")
  const list = customData.events || []
  const updated = [...list, { id: Date.now(), ...eventForm, createdAt: new Date().toISOString() }]
  saveSafe('events', updated)
  setCustomData({ ...customData, events: updated })
  setEventForm({ title: '', date: '', category: 'Cultural / Arts Events', description: '', image: '' })
  alert(`Event ${eventForm.title} added with image!`)
 }

 const handleEventImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => setEventForm({ ...eventForm, image: ev.target.result })
  reader.readAsDataURL(file)
 }

 const handleAddGallery = () => {
  if (!galleryForm.url) return alert("Image URL required - Real image from your campus")
  const list = customData.gallery || []
  const updated = [...list, { id: Date.now(), ...galleryForm }]
  saveSafe('gallery', updated)
  setCustomData({ ...customData, gallery: updated })
  setGalleryForm({ url: '', caption: '' })
 }

 const handleAddAnnouncement = () => {
  if (!announcementForm.title) return alert("Title required")
  const list = customData.announcements || []
  const updated = [...list, { id: Date.now(), ...announcementForm }]
  saveSafe('announcements', updated)
  setCustomData({ ...customData, announcements: updated })
  setAnnouncementForm({ title: '', date: '', category: '', description: '' })
 }

 const handleAddHostel = () => {
  if (!hostelForm.name) return alert("Hostel name required")
  const list = customData.hostels || []
  const updated = [...list, { id: Date.now(), ...hostelForm }]
  saveSafe('hostels', updated)
  setCustomData({ ...customData, hostels: updated })
  setHostelForm({ name: '', type: 'Boys', capacity: '', fees: '', facilities: '', description: '', images: [] })
  setNewHostelImageUrl('')
 }

 const handleAddHostelImage = () => {
  if (!newHostelImageUrl) return alert("Enter image URL")
  setHostelForm({ ...hostelForm, images: [...(hostelForm.images||[]), { id: Date.now(), url: newHostelImageUrl }] })
  setNewHostelImageUrl('')
 }

 const handleRemoveHostelImage = (id) => {
  setHostelForm({ ...hostelForm, images: (hostelForm.images||[]).filter(img => img.id !== id) })
 }

 const handleHostelImageUpload = (e) => {
  const files = Array.from(e.target.files || [])
  if ((hostelForm.images||[]).length + files.length > 10) return alert("Maximum 10 images allowed per hostel")
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      setHostelForm(prev => {
        if ((prev.images||[]).length >= 10) return prev
        return { ...prev, images: [...(prev.images||[]), { id: Date.now()+Math.random(), url: ev.target.result }] }
      })
    }
    reader.readAsDataURL(file)
  })
 }

 const handleAddAccreditation = () => {
  if (!accreditationForm.name) return alert("Accreditation name required")
  const list = customData.accreditations || []
  const updated = [...list, { id: Date.now(), ...accreditationForm }]
  saveSafe('accreditations', updated)
  setCustomData({ ...customData, accreditations: updated })
  setAccreditationForm({ name: '', grade: '', year: '', validTill: '', agency: '', description: '', image: '' })
 }

 const handleAccreditationImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => setAccreditationForm({ ...accreditationForm, image: ev.target.result })
  reader.readAsDataURL(file)
 }

 const handleAddResearch = () => {
  if (!researchForm.name) return alert("Research Centre name required")
  const list = customData.researchCentres || customData.research || []
  const updated = [...list, { id: Date.now(), ...researchForm, createdAt: new Date().toISOString() }]
  saveSafe('researchCentres', updated)
  saveSafe('research', updated)
  setCustomData({ ...customData, researchCentres: updated, research: updated })
  setResearchForm({ name: '', type: 'Centre of Excellence', funding: '', year: '', coordinator: '', description: '', facilities: '', achievements: '', image: '' })
  alert(`Research Centre ${researchForm.name} added!`)
 }

 const handleResearchImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => setResearchForm({ ...researchForm, image: ev.target.result })
  reader.readAsDataURL(file)
 }

 const handleAddCampus = () => {
  if (!campusForm.title) return alert("Campus title required")
  const list = customData.campusEnvironment || customData.campus || []
  const updated = [...list, { id: Date.now(), ...campusForm, createdAt: new Date().toISOString() }]
  saveSafe('campusEnvironment', updated)
  saveSafe('campus', updated)
  setCustomData({ ...customData, campusEnvironment: updated, campus: updated })
  setCampusForm({ title: '', area: '', description: '', environment: '', greenInitiatives: '', facilities: '', images: [] })
  setNewCampusImageUrl('')
  alert(`Campus ${campusForm.title} added!`)
 }

 const handleAddCampusImage = () => {
  if (!newCampusImageUrl) return alert("Enter image URL")
  setCampusForm({ ...campusForm, images: [...(campusForm.images||[]), { id: Date.now(), url: newCampusImageUrl }] })
  setNewCampusImageUrl('')
 }

 const handleRemoveCampusImage = (id) => {
  setCampusForm({ ...campusForm, images: (campusForm.images||[]).filter(img => img.id !== id) })
 }

 const handleCampusImageUpload = (e) => {
  const files = Array.from(e.target.files || [])
  if ((campusForm.images||[]).length + files.length > 10) return alert("Maximum 10 images allowed per campus entry")
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      setCampusForm(prev => {
        if ((prev.images||[]).length >= 10) return prev
        return { ...prev, images: [...(prev.images||[]), { id: Date.now()+Math.random(), url: ev.target.result }] }
      })
    }
    reader.readAsDataURL(file)
  })
 }

 const handleSaveLibrary = () => {
  if (!libraryForm.totalBooks && !libraryForm.description) return alert("Add at least books count or description")
  saveSafe('library', libraryForm)
  setCustomData({ ...customData, library: libraryForm })
  alert("Library details saved! Your college website updated")
 }

 const handleLibraryImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => setLibraryForm({ ...libraryForm, image: ev.target.result })
  reader.readAsDataURL(file)
 }

 const handleSaveSports = () => {
  if (!sportsForm.name && !sportsForm.description) return alert("Add sports name or description")
  const list = customData.sports || []
  const updated = [...list, { id: Date.now(), ...sportsForm, createdAt: new Date().toISOString() }]
  saveSafe('sports', updated)
  setCustomData({ ...customData, sports: updated })
  setSportsForm({ name: '', coach: '', description: '', facilities: '', achievements: '', image: '' })
  alert(`Sports ${sportsForm.name || 'details'} added!`)
 }

 // Compress uploaded images (canvas) so localStorage never hits quota - saves reliably
 const readImageCompressed = (file, cb, maxDim = 900, quality = 0.85) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target.result
    const img = new Image()
    img.onload = () => {
      try {
        const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1))
        if (scale === 1 && file.size < 250 * 1024) { cb(dataUrl); return }
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round((img.width || maxDim) * scale))
        canvas.height = Math.max(1, Math.round((img.height || maxDim) * scale))
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        cb(canvas.toDataURL('image/jpeg', quality))
      } catch { cb(dataUrl) }
    }
    img.onerror = () => cb(dataUrl)
    img.src = dataUrl
  }
  reader.readAsDataURL(file)
 }

 const handleAlumniImageUpload = (ev) => {
  const file = ev.target.files?.[0]
  if (!file) return
  readImageCompressed(file, (d) => setAlumniForm(prev => ({ ...prev, image: d })), 700)
  ev.target.value = ''
 }

 const handleAlumniLogoUpload = (ev) => {
  const file = ev.target.files?.[0]
  if (!file) return
  readImageCompressed(file, (d) => setAlumniForm(prev => ({ ...prev, companyLogo: d })), 300)
  ev.target.value = ''
 }

 const handleAchievementImageUpload = (ev) => {
  const file = ev.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => setAchievementForm(prev => ({ ...prev, image: e.target.result }))
  reader.readAsDataURL(file)
 }

 const handleSaveAlumni = () => {
  if (!alumniForm.name || !alumniForm.name.trim()) return alert("Alumni name add pannunga")
  if (!selectedCollegeId) return alert("College login first - pakkathula Login / college account select pannunga")
  const list = Array.isArray(customData.alumni) ? customData.alumni : []
  const entry = { id: Date.now(), name: alumniForm.name.trim(), designation: alumniForm.designation || '', company: alumniForm.company || '', companyLogo: alumniForm.companyLogo || '', batch: alumniForm.batch || '', image: alumniForm.image || '' }
  const updated = [...list, entry]
  try {
    saveSafe('alumni', updated)
  } catch (err) {
    return alert("Save aagala - storage full aagiduchu. Photo-ku URL use pannunga (upload vendam), apram try pannunga.")
  }
  setCustomData({ ...customData, alumni: updated })
  setAlumniForm({ name: '', designation: '', company: '', companyLogo: '', batch: '', image: '' })
  alert(`${entry.name} added to Alumni Success Stories - website la real-time aagum!`)
 }

 const handleSaveAchievement = () => {
  if (!achievementForm.title) return alert("Achievement title venum")
  const list = customData.achievements || []
  const updated = [...list, { id: Date.now(), ...achievementForm, createdAt: new Date().toISOString() }]
  saveSafe('achievements', updated)
  setCustomData({ ...customData, achievements: updated })
  setAchievementForm({ title: '', image: '', description: '' })
  alert("Student achievement added - website la real-time aagum!")
 }

 const handleSaveAdmissions = () => {
  if (!admissionForm.title && !admissionForm.description) return alert("Add at least title or description for Admissions")
  saveSafe('admissions', admissionForm)
  setCustomData({ ...customData, admissions: admissionForm })
  alert("Admissions details saved! Your college website updated real-time - " + admissionForm.title)
 }

 const handleAdmissionBrochureUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => setAdmissionForm({ ...admissionForm, brochureImage: ev.target.result })
  reader.readAsDataURL(file)
 }

 const handleSaveContact = () => {
  if (!contactForm.address && !contactForm.phone && !contactForm.email) return alert("Add at least address or phone or email")
  saveSafe('contactDetails', contactForm)
  saveSafe('contacts', contactForm)
  setCustomData({ ...customData, contactDetails: contactForm, contacts: contactForm })
  alert("Contact details saved! Real-time website updated - " + contactForm.phone)
 }

 const handleSaveSettings = () => {
  if (!settingsForm.name) return alert("College name required")
  saveSafe('settings', settingsForm)
  // Also update tagline and basic info in registered colleges
  const registered = JSON.parse(localStorage.getItem('tn_registered_colleges') || '[]')
  const idx = registered.findIndex(c => String(c.id) === String(selectedCollegeId))
  if (idx >= 0) {
    registered[idx] = { ...registered[idx], name: settingsForm.name, shortName: settingsForm.shortName, tagline: settingsForm.tagline, type: settingsForm.type, collegeType: settingsForm.collegeType, university: settingsForm.university, affiliation: settingsForm.affiliation, established: settingsForm.established, accreditation: settingsForm.accreditation, email: settingsForm.email, phone: settingsForm.phone, website: settingsForm.website, loginUsername: settingsForm.loginUsername, loginPassword: settingsForm.loginPassword, settings: settingsForm }
    localStorage.setItem('tn_registered_colleges', JSON.stringify(registered))
  }
  const current = JSON.parse(localStorage.getItem('tn_current_college') || '{}')
  if (String(current.id) === String(selectedCollegeId)) {
    const updatedCurrent = { ...current, name: settingsForm.name, shortName: settingsForm.shortName, tagline: settingsForm.tagline, type: settingsForm.type, collegeType: settingsForm.collegeType, university: settingsForm.university, affiliation: settingsForm.affiliation, established: settingsForm.established, accreditation: settingsForm.accreditation, email: settingsForm.email, phone: settingsForm.phone, website: settingsForm.website, loginUsername: settingsForm.loginUsername, loginPassword: settingsForm.loginPassword }
    localStorage.setItem('tn_current_college', JSON.stringify(updatedCurrent))
    setCurrentCollege(updatedCurrent)
  }
  setCustomData({ ...customData, settings: settingsForm, tagline: settingsForm.tagline })
  alert("Settings saved! Real-time website updated - " + settingsForm.name)
 }



 const handleSportsImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => setSportsForm({ ...sportsForm, image: ev.target.result })
  reader.readAsDataURL(file)
 }

 const handleAddManagement = () => {
  if (!managementForm.name) return alert("Name required")
  if (!managementForm.designation) return alert("Designation required")
  const list = customData.management || []
  const updated = [...list, { id: Date.now(), ...managementForm, createdAt: new Date().toISOString() }]
  saveSafe('management', updated)
  setCustomData({ ...customData, management: updated })
  setManagementForm({ name: '', designation: '', image: '', email: '', phone: '', description: '' })
  alert(`Management member ${managementForm.name} - ${managementForm.designation} added successfully!`)
 }

 const handleSavePrincipal = () => {
  if (!principalForm.name) return alert("Principal name required")
  saveSafe('principal', principalForm)
  saveSafe('principalDetails', principalForm)
  setCustomData({ ...customData, principal: principalForm, principalDetails: principalForm })
  alert(`Principal ${principalForm.name} details saved successfully! Will appear on your college website`)
 }

 const handleManagementImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => setManagementForm({ ...managementForm, image: ev.target.result })
  reader.readAsDataURL(file)
 }

 const handlePrincipalImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => setPrincipalForm({ ...principalForm, image: ev.target.result })
  reader.readAsDataURL(file)
 }

 const handleDeptHodImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => setDeptForm({ ...deptForm, hodImage: ev.target.result })
  reader.readAsDataURL(file)
 }

 const handleDeptImageUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => setDeptForm({ ...deptForm, image: ev.target.result })
  reader.readAsDataURL(file)
 }

 const handleSaveAbout = () => {
  saveSafe('about', {
   fullText: aboutForm.fullText,
   vision: aboutForm.vision,
   mission: aboutForm.mission.split('\n').filter(Boolean)
  })
  setCustomData({ ...customData, about: { fullText: aboutForm.fullText, vision: aboutForm.vision, mission: aboutForm.mission.split('\n') } })
  alert("About, Vision, Mission saved! Your college website updated - Your college content")
 }

 const handleSaveBranding = () => {
  const branding = {
   logo: brandingForm.logo,
   heroImage: brandingForm.heroImage,
   collegeImages: brandingForm.collegeImages || [],
   colors: { primary: brandingForm.primary, secondary: brandingForm.secondary, accent: brandingForm.accent },
   preset: 'custom'
  }
  saveSafe('branding', branding)
  saveSafe('tagline', brandingForm.tagline)
  setCustomData({ ...customData, branding, tagline: brandingForm.tagline })
  alert(`Branding saved successfully`)
 }

 const handleAddCollegeImage = () => {
  if (!newCollegeImageUrl) return alert("Enter image URL")
  if ((brandingForm.collegeImages||[]).length >= 10) return alert("Maximum 10 college images allowed")
  const updated = [...(brandingForm.collegeImages||[]), { id: Date.now(), url: newCollegeImageUrl, caption: `Campus Image ${(brandingForm.collegeImages||[]).length+1}` }]
  setBrandingForm({ ...brandingForm, collegeImages: updated })
  setNewCollegeImageUrl('')
 }

 const handleRemoveCollegeImage = (id) => {
  const updated = (brandingForm.collegeImages||[]).filter(img => img.id !== id)
  setBrandingForm({ ...brandingForm, collegeImages: updated })
 }

 const handleLogoUpload = (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    setBrandingForm({ ...brandingForm, logo: ev.target.result })
  }
  reader.readAsDataURL(file)
 }

 const handleCollegeImageUpload = (e) => {
  const files = Array.from(e.target.files || [])
  if ((brandingForm.collegeImages||[]).length + files.length > 10) return alert("Maximum 10 images allowed")
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      setBrandingForm(prev => {
        if ((prev.collegeImages||[]).length >= 10) return prev
        return { ...prev, collegeImages: [...(prev.collegeImages||[]), { id: Date.now()+Math.random(), url: ev.target.result, caption: `Campus Image ${(prev.collegeImages||[]).length+1}` }] }
      })
    }
    reader.readAsDataURL(file)
  })
 }

 const handleDelete = (section, id) => {
  const list = customData[section] || []
  const updated = list.filter(item => item.id !== id)
  saveSafe(section, updated)
  setCustomData({ ...customData, [section]: updated })
 }

 const handleAdminLogin = () => {
  const id = (loginUser || '').trim().toLowerCase()
  if (!id) return alert("Username / email enter pannunga")
  const college = findCollegeByLoginId(id)
  if (!college) return alert("College with this username not found.\n\nJust signed up? Below Quick Select use pannunga.")
  if (college.loginPassword && college.loginPassword !== loginPass) return alert('Wrong password for ' + college.name + '. Please try again.')
  localStorage.setItem('tn_current_college', JSON.stringify(college))
  setCurrentCollege(college)
  setSelectedCollegeId(college.id)
  setCustomData(getCollegeCustomData(college.id))
  setIsLoggedIn(true)
 }

 const lines = (t) => String(t || '').split('\n').map(x => x.trim()).filter(Boolean)
 const handleSaveHome = () => {
  const data = { ...homeForm, coordinators: lines(homeForm.coordinators), convenors: lines(homeForm.convenors), partnerLogos: lines(homeForm.partnerLogos).slice(0, 6), accreditationLogos: lines(homeForm.accreditationLogos).slice(0, 8), industryLogos: lines(homeForm.industryLogos).slice(0, 54) }
  saveSafe('homePage', data)
  setCustomData({ ...customData, homePage: data })
  alert('Home page setup saved! Website la real-time la update aagiduchu. Preview: college public page open pannunga.')
 }

 if (!isLoggedIn) {
  const allColleges = getPublicColleges()
  return (
   <div className="min-h-screen bg-[#E8E2DB] grid place-items-center p-6">
    <div className="w-full max-w-[560px] rounded-[28px] bg-white border-2 border-[#E8E2DB] shadow-[0_16px_48px_rgba(0,0,0,0.08)] p-8">
     <div className="h-12 w-12 rounded-[14px] bg-[#1A3263] text-[#FAB95B] border-2 border-[#FAB95B] grid place-items-center font-bold text-[20px] mx-auto">C</div>
     <h1 className="font-display text-[24px] font-bold text-center mt-6 text-[#1A3263]">College Admin Login</h1>
     <p className="text-[12px] text-[#547792] text-center mt-2">Login to your college admin portal</p>
     
     {allColleges.length===0 ? (
      <div className="mt-8 rounded-[20px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-8 text-center">
              <div className="font-bold text-[#1A3263] mt-4">No Colleges Registered</div>
       <div className="text-[12px] text-[#1A3263]/80 mt-2">Please register your college to get started</div>
       <div className="mt-6 flex gap-2 justify-center">
        <Link to="/college/signup" className="h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] inline-flex items-center justify-center">College Sign Up</Link>
        <Link to="/" className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[12px] inline-flex items-center justify-center">Home</Link>
       </div>
      </div>
     ) : (
     <div className="mt-8 space-y-4">
      <div>
       <label className="text-[11px] font-bold uppercase tracking-wide text-[#1A3263]">Username or College Email</label>
       <input value={loginUser} onChange={e=>setLoginUser(e.target.value)} placeholder="Your login username (e.g. thiagarajar_admin)" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] font-medium" />
      </div>
      <div>
       <label className="text-[11px] font-bold uppercase tracking-wide text-[#1A3263]">Password</label>
       <input type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} placeholder="Your login password" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px]" />
      </div>
      <button onClick={handleAdminLogin} className="w-full h-12 rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#1A3263] font-bold text-[14px]">Login to College Admin</button>
      <div className="flex items-center gap-3 py-1">
       <div className="flex-1 h-px bg-[#E8E2DB]"></div>
       <div className="text-[10px] font-bold uppercase text-[#547792]">or quick select</div>
       <div className="flex-1 h-px bg-[#E8E2DB]"></div>
      </div>
      <div>
       <label className="text-[11px] font-bold uppercase tracking-wide text-[#547792]">Quick Select (demo)</label>
       <select value={selectedCollegeId || ''} onChange={e=>setSelectedCollegeId(e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px] font-medium">
        <option value="">Select your college</option>
        {allColleges.map(c=>(
         <option key={c.id} value={c.id}>{c.name} - {c.district}</option>
        ))}
       </select>
       <button onClick={()=>{
       if (!selectedCollegeId) return alert("Select your college")
       const college = getCollegeById(selectedCollegeId)
       if (!college) return alert("College not found")
       localStorage.setItem('tn_current_college', JSON.stringify(college))
       setCurrentCollege(college)
       setCustomData(getCollegeCustomData(college.id))
       setIsLoggedIn(true)
      }} className="mt-3 w-full h-10 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[12px]">Quick Login Selected College</button>
      </div>
      <div className="text-[11px] text-[#547792] text-center leading-[1.5]">Signup panna create patta username + password la login pannunga. Credentials change panna Settings → Login Credentials</div>
     </div>
     )}

     <div className="mt-8 rounded-[16px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-4">
      <div className="text-[12px] font-bold text-[#1A3263]">What you can manage:</div>
      <div className="text-[11px] text-[#1A3263]/80 mt-2 leading-[1.6]">
       • College Logo, Campus Images<br/>
       • Departments with HOD<br/>
       • Courses<br/>
       • Facilities, Hostel, Library, Sports<br/>
       • Placements<br/>
       • Exam Details<br/>
       • Management, Principal, Accreditation<br/>
       • Events, Gallery, Announcements<br/>
       • Manage all college sections
      </div>
     </div>

     <div className="mt-4 flex gap-2">
      <Link to="/" className="flex-1 h-10 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[12px] grid place-items-center">← Platform Home</Link>
      <Link to="/college/signup" className="flex-1 h-10 rounded-full bg-[#FAB95B] border-2 border-[#FAB95B] text-[#1A3263] font-bold text-[12px] grid place-items-center">College Sign Up</Link>
     </div>
    </div>
   </div>
  )
 }

 const college = currentCollege
 const profileCompletion = getProfileCompletion(college)
 const allCustomData = customData

 const menu = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, count: `${profileCompletion}%` },
  { id: 'branding', label: 'College Logo & Branding', icon: Palette, badge: '', highlight: true },
  { id: 'about', label: 'About, Vision, Mission', icon: FileText, count: 'Full' },
  { id: 'management', label: 'Management & Trustees', icon: Users, count: `${(allCustomData.management||[]).length}` },
  { id: 'principal', label: 'Principal Details', icon: UserCheck, count: 'Add' },
  { id: 'departments', label: 'Departments with HOD', icon: Building2, count: `${(allCustomData.departments||[]).length} Depts`, highlight: true },
  { id: 'courses', label: 'Courses', icon: GraduationCap, count: `${(allCustomData.courses||[]).length} Courses`, highlight: true },
  { id: 'admissions', label: 'Admissions', icon: FileCheck },
  { id: 'examinations', label: 'Examinations', icon: FileText, highlight: true },
  { id: 'facilities', label: 'Facilities', icon: Layers, count: `${(allCustomData.customFacilities||[]).length}` },
  { id: 'hostel', label: 'Hostel', icon: Home, count: `${(allCustomData.hostels||[]).length}` },
  { id: 'placements', label: 'Placements', icon: Briefcase, count: `${(allCustomData.placements||[]).length} Records`, highlight: true },
  { id: 'research', label: 'Research & Centres', icon: Microscope, count: `${(allCustomData.researchCentres||allCustomData.research||[]).length}` },
  { id: 'accreditation', label: 'Accreditation', icon: Award, count: `${(allCustomData.accreditations||[]).length}` },
  { id: 'campus', label: 'Campus & Environment', icon: MapPin, count: `${(allCustomData.campusEnvironment||allCustomData.campus||[]).length}` },
  { id: 'library', label: 'Library', icon: Library, count: allCustomData.library ? 'Added' : '' },
  { id: 'sports', label: 'Sports', icon: Heart, count: `${(allCustomData.sports||[]).length}` },
  { id: 'alumni', label: 'Alumni Success Stories', icon: Award, count: `${(allCustomData.alumni||[]).length}` },
  { id: 'achievements', label: 'Student Achievements', icon: Trophy, count: `${(allCustomData.achievements||[]).length}`, highlight: true },
  { id: 'homepage', label: 'Home Page (KCE Layout)', icon: Home, highlight: true },
  { id: 'aboutpages', label: 'About Pages (KCE Layout)', icon: FileText, highlight: true },
  { id: 'events', label: 'Events', icon: Calendar, count: `${(allCustomData.events||[]).length}`, highlight: true },
  { id: 'gallery', label: 'Gallery', icon: Camera, count: `${(allCustomData.gallery||[]).length} Images`, highlight: true },
  { id: 'announcements', label: 'Announcements', icon: Bell, count: `${(allCustomData.announcements||[]).length}` },
  { id: 'contact', label: 'Contact', icon: Contact },
  { id: 'analytics', label: 'Analytics', icon: BarChart3,  },
  { id: 'settings', label: 'Settings', icon: Settings },
 ]

 return (
  <div className="min-h-screen bg-[#E8E2DB] flex">
   <aside className="hidden lg:flex w-[340px] shrink-0 bg-[#1A3263] text-white flex-col sticky top-0 h-screen border-r-4 border-[#FAB95B]">
    <div className="h-[72px] px-6 flex items-center gap-3 border-b border-white/10">
     <div className="h-9 w-9 rounded-[10px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold">C</div>
     <div className="flex-1 min-w-0">
      <div className="font-semibold text-[12px] leading-none truncate">{college.name}</div>
      <div className="text-[11px] text-[#FAB95B] truncate">ID {college.id} • {college.district} • {college.verificationStatus}</div>
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
       <div className="text-[11px] text-[#FAB95B] flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {college.verificationStatus} • {profileCompletion}% Complete</div>
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
     <button onClick={()=>{localStorage.removeItem('tn_current_college'); setIsLoggedIn(false)}} className="w-full h-9 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium">Logout - Secure</button>
     <div className="text-[10px] text-white/40 text-center">College ID: {college.id}</div>
    </div>
   </aside>

   <div className="flex-1 min-w-0">
    <div className="sticky top-0 z-20 h-[72px] bg-white/90 backdrop-blur-xl border-b-2 border-[#FAB95B]/30 px-6 lg:px-8 flex items-center justify-between gap-4">
     <div className="flex items-center gap-4">
      <h1 className="font-display text-[16px] font-bold capitalize text-[#1A3263]">{college.name} - {activeSection}</h1>
      <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAB95B]/20 text-[#1A3263] border-2 border-[#FAB95B]/30 text-[11px] font-bold uppercase"><CheckCircle2 size={12} /> {profileCompletion}% Complete</span>
     </div>
     <div className="flex items-center gap-2">
      <span className="hidden lg:flex items-center gap-2 text-[11px] text-[#547792]"><Shield size={12} /> College ID {college.id}</span>
      <button className="h-10 px-5 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[#1A3263] text-[12px] font-bold">Save Draft</button>
      <button className="h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#1A3263] text-[12px] font-bold flex items-center gap-2"><Save size={14} /> Publish</button>
     </div>
    </div>

    <div className="p-6 lg:p-8 max-w-[1200px]">
     {activeSection==='dashboard' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-[#1A3263] text-white p-8 border-2 border-[#1A3263] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#FAB95B]/10 rounded-full blur-[30px]" />
        <div className="relative">
         <h2 className="font-display text-[28px] font-bold text-[#FAB95B]">Welcome to {college.name}</h2>
         <p className="text-[13px] text-[#E8E2DB]/80 mt-3 leading-[1.6] max-w-[800px]">Welcome to your college administration portal - {college.name}. This is your official college dashboard where you can add and manage all your college information - Logo, campus images, departments, courses, facilities, placements, and complete college profile.</p>
         
         <div className="mt-8 grid md:grid-cols-4 gap-4">
          {[
           { label: "Profile", value: `${profileCompletion}%`, sub: `${(allCustomData.departments||[]).length} Depts, ${(allCustomData.courses||[]).length} Courses - You Added`, color: "bg-white/10 border-white/20" },
           { label: "College ID", value: college.id, sub: `Your Own - ${college.district}`, color: "bg-[#FAB95B] text-[#1A3263] border-[#FAB95B]" },
           { label: "Departments", value: (allCustomData.departments||[]).length, sub: "With HOD", color: "bg-white/5 border-white/10" },
           { label: "Verification", value: college.verificationStatus, sub: "Verification Status", color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300" },
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
         <h3 className="font-bold text-[#1A3263] flex items-center gap-2"><Building2 size={18} className="text-[#FAB95B]" /> College Preview</h3>
         <div className="mt-4 flex gap-4">
          {allCustomData.branding?.logo ? (
           <img src={allCustomData.branding.logo} className="h-16 w-16 rounded-[12px] object-cover border-2 border-[#FAB95B] bg-white" alt="Your Logo" />
          ) : (
           <div className="h-16 w-16 rounded-[12px] bg-[#E8E2DB] border-2 border-dashed border-[#1A3263]/20 grid place-items-center text-[#547792] text-[10px] font-bold text-center">College Logo</div>
          )}
          <div>
           <div className="font-bold text-[#1A3263]">{college.name}</div>
           <div className="text-[12px] text-[#547792]">{college.district} • {college.city} • {college.type} • ID {college.id}</div>
           <div className="text-[11px] text-[#1A3263]/60 mt-1">{allCustomData.tagline || college.tagline || 'Add tagline'}</div>
          </div>
         </div>
         {allCustomData.branding?.heroImage ? (
          <img src={allCustomData.branding.heroImage} className="mt-4 h-[160px] w-full rounded-[16px] object-cover border-2 border-[#E8E2DB]" alt="Your Campus" />
         ) : (
          <div className="mt-4 h-[160px] rounded-[16px] bg-[#E8E2DB] border-2 border-dashed border-[#1A3263]/20 grid place-items-center text-[#547792] text-[12px] font-bold">Campus Image </div>
         )}
         <div className="mt-4 flex gap-2">
          <Link to={`/college/${college.slug}`} className="flex-1 h-9 rounded-full bg-[#1A3263] text-[#FAB95B] text-[12px] font-bold grid place-items-center">Preview Website</Link>
         </div>
        </div>

        <div className="rounded-[20px] bg-white border-2 border-[#FAB95B]/30 p-6">
         <h3 className="font-bold text-[#1A3263]">College Management</h3>
         <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
          {[
           "✓ College Logo & Campus Images - ",
           "✓ Departments with HOD - ",
           "✓ Courses - ",
           "✓ Facilities - ",
           "✓ Placements - ",
           "✓ Hostel - ",
           "✓ Exam Details - ",
           "✓ Management & Principal",
           "✓ ",
           "✓ Events, Gallery, Announcements",
           "✓ ",
           "✓ ",
           "✓ ",
           "✓ "
          ].map(item=>(
           <div key={item} className="p-2 rounded-[8px] bg-[#E8E2DB]/50 border border-[#E8E2DB] text-[#1A3263] font-medium">{item}</div>
          ))}
         </div>
         <div className="mt-4 rounded-[12px] bg-[#1A3263] text-white p-3 text-[11px]">
          <span className="text-[#FAB95B] font-bold">Platform:</span> Official academic layout and navigation - Platform managed<br/>
          <span className="text-[#FAB95B] font-bold">College:</span> All college information - Logo, images, departments, courses, facilities, placements, exams, etc - Added by college
         </div>
        </div>
       </div>
      </div>
     )}

     {activeSection==='branding' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><ImageIcon className="text-[#FAB95B]" /> College Logo & Campus Images</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add your college logo and campus images</p>
        
        <div className="mt-8 grid lg:grid-cols-2 gap-8">
         <div className="space-y-6">
          <div className="rounded-[16px] bg-[#E8E2DB]/30 border-2 border-[#E8E2DB] p-5">
           <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><ImageIcon size={12} className="text-[#FAB95B]" /> College Logo</label>
           <div className="mt-3 flex gap-3">
            <input value={brandingForm.logo} onChange={e=>setBrandingForm({...brandingForm, logo: e.target.value})} placeholder="Paste logo URL https://yourcollege.edu/logo.png" className="flex-1 h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
            <label className="h-11 px-4 rounded-[12px] bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center gap-2 cursor-pointer hover:bg-[#1A3263]/90">
              <Upload size={14} /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
           </div>
           <div className="mt-4 rounded-[12px] border-2 border-dashed border-[#1A3263]/20 bg-white p-6 text-center">
            {brandingForm.logo ? (
             <div className="space-y-3">
              <img src={brandingForm.logo} className="h-24 w-24 rounded-[16px] mx-auto object-cover border-2 border-[#FAB95B] bg-white shadow" alt="Your Logo" />
              <div className="flex justify-center gap-2">
                <button onClick={()=>setBrandingForm({...brandingForm, logo: ''})} className="h-8 px-3 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold">Remove Logo</button>
              </div>
             </div>
            ) : (
             <div>
              <div className="h-24 w-24 rounded-[16px] bg-[#E8E2DB] border-2 border-dashed border-[#1A3263]/20 mx-auto grid place-items-center text-[#547792] text-[10px] font-bold">No Logo Yet</div>
              <div className="text-[11px] text-[#547792] mt-3">Upload your college logo</div>
             </div>
            )}
           </div>
          </div>

          <div>
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Tagline</label>
           <input value={brandingForm.tagline} onChange={e=>setBrandingForm({...brandingForm, tagline: e.target.value})} placeholder="e.g. Knowledge is Power" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px]" />
          </div>

          <div className="rounded-[16px] bg-[#1A3263] text-white p-5">
           <div className="font-bold text-[#FAB95B] text-[13px] flex items-center gap-2"><Eye size={14} /> Preview</div>
           <div className="mt-4 flex gap-3 items-center">
            {brandingForm.logo ? <img src={brandingForm.logo} className="h-12 w-12 rounded-[10px] object-cover border-2 border-[#FAB95B] bg-white" alt="Logo" /> : <div className="h-12 w-12 rounded-[10px] bg-white/10 border border-white/20 grid place-items-center text-[10px]">Logo</div>}
            <div>
             <div className="font-bold text-[14px]">{college.name}</div>
             <div className="text-[11px] text-[#FAB95B]">{brandingForm.tagline || 'Your tagline here'}</div>
             <div className="text-[10px] text-white/60 mt-1">{college.district} • {college.city}</div>
            </div>
           </div>
          </div>
         </div>

         <div className="space-y-5">
          <div className="rounded-[16px] bg-[#FAB95B]/10 border-2 border-[#FAB95B]/30 p-5">
           <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Camera size={12} className="text-[#FAB95B]" /> College Campus Images</label>
           <div className="text-[11px] text-[#1A3263]/70 mt-1">Add campus images for your college website</div>
           
           <div className="mt-4 flex gap-2">
            <input value={newCollegeImageUrl} onChange={e=>setNewCollegeImageUrl(e.target.value)} placeholder="Paste image URL https://yourcollege.edu/campus1.jpg" className="flex-1 h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
            <button onClick={handleAddCollegeImage} className="h-11 px-5 rounded-[12px] bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center gap-1.5"><Plus size={14} /> Add</button>
           </div>

           <div className="mt-3 flex gap-2">
            <label className="flex-1 h-11 px-4 rounded-[12px] bg-white border-2 border-dashed border-[#1A3263]/20 text-[#1A3263] font-bold text-[12px] flex items-center justify-center gap-2 cursor-pointer hover:border-[#FAB95B]">
              <Upload size={14} /> Upload Multiple (Up to 10)
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleCollegeImageUpload} />
            </label>
            <div className="h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[12px] flex items-center justify-center">
              {(brandingForm.collegeImages||[]).length}/10
            </div>
           </div>

           {(brandingForm.collegeImages||[]).length===0 ? (
            <div className="mt-4 rounded-[12px] bg-white border-2 border-dashed border-[#1A3263]/20 p-8 text-center">
                            <div className="font-bold text-[#1A3263] mt-3 text-[13px]">No campus images yet</div>
              <div className="text-[11px] text-[#547792] mt-2">Add campus images for your college</div>
              <div className="mt-3 grid grid-cols-3 gap-2 max-w-[300px] mx-auto">
                {[
                  "https://www.psgtech.edu/images/slider/foundationday_2026.jpg",
                  "https://www.psgtech.edu/images/slider/Orientation_2026.jpg",
                  "https://www.psgtech.edu/images/slider/TheConfluence-2026.jpg"
                ].map((demo,i)=>(
                  <img key={i} src={demo} className="h-16 w-full rounded-[8px] object-cover border border-[#E8E2DB]" alt="Demo" />
                ))}
              </div>
            </div>
           ) : (
            <div className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {(brandingForm.collegeImages||[]).map((img, idx)=>(
                  <div key={img.id} className="relative rounded-[12px] overflow-hidden border-2 border-[#E8E2DB] bg-white group">
                    <img src={img.url} className="h-[110px] w-full object-cover" alt={`Campus ${idx+1}`} />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px] font-bold">{idx+1}/{(brandingForm.collegeImages||[]).length}</div>
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button onClick={()=>handleRemoveCollegeImage(img.id)} className="h-6 w-6 rounded-full bg-red-500 text-white grid place-items-center hover:bg-red-600"><Trash2 size={10} /></button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <div className="text-[10px] font-bold text-white truncate">{img.caption || `Campus Image ${idx+1}`}</div>
                      <div className="text-[9px] text-white/70"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-[12px] bg-[#1A3263] text-white p-3">
                <div className="text-[11px] font-bold text-[#FAB95B] flex items-center gap-1.5"><Camera size={12} /> Preview</div>
                <div className="text-[10px] text-[#E8E2DB]/70 mt-1">Your website will display images in carousel</div>
              </div>
            </div>
           )}
          </div>

          <button onClick={handleSaveBranding} className="w-full h-12 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold border-2 border-[#FAB95B] flex items-center justify-center gap-2"><Save size={16} /> Save Logo & Images</button>
         </div>
        </div>
       </div>
      </div>
     )}

     {activeSection==='departments' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Building2 className="text-[#FAB95B]" /> Departments with HOD</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add departments with HOD information including image and biography</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
         <h4 className="font-display text-[18px] font-bold text-[#1A3263] flex items-center gap-2"><Plus size={18} /> Add New Department</h4>
         <div className="mt-2 text-[12px] text-[#547792]">Add department and HOD details - all fields support long text</div>
         
         <div className="mt-8 space-y-6">
          {/* Department Info */}
          <div className="space-y-4">
            <h5 className="font-bold text-[13px] uppercase tracking-wide text-[#1A3263] border-b-2 border-[#E8E2DB] pb-2">Department Information</h5>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
               <label className="text-[11px] font-bold uppercase text-[#1A3263]">Department Name *</label>
               <input value={deptForm.name} onChange={e=>setDeptForm({...deptForm, name: e.target.value})} placeholder="e.g. Computer Science and Engineering" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] font-medium transition-colors" />
              </div>
              <div>
               <label className="text-[11px] font-bold uppercase text-[#1A3263]">Faculty Count</label>
               <input value={deptForm.facultyCount} onChange={e=>setDeptForm({...deptForm, facultyCount: e.target.value})} placeholder="e.g. 25" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] transition-colors" />
              </div>
            </div>
            
            <div className="grid md:grid-cols-1 gap-5">
              <div>
               <label className="text-[11px] font-bold uppercase text-[#1A3263]">Department Image URL</label>
               <div className="mt-2 flex gap-3">
                <input value={deptForm.image} onChange={e=>setDeptForm({...deptForm, image: e.target.value})} placeholder="Paste department image URL - https://college.edu/cse.jpg" className="flex-1 h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                <label className="h-12 px-5 rounded-[14px] bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center gap-2 cursor-pointer hover:bg-[#1A3263]/90 transition-colors">
                  <Upload size={14} /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={handleDeptImageUpload} />
                </label>
               </div>
              </div>
              
              <div>
               <label className="text-[11px] font-bold uppercase text-[#1A3263]">Department Description - Laboratories, Facilities, Achievements - Large Field</label>
               <textarea value={deptForm.description} onChange={e=>setDeptForm({...deptForm, description: e.target.value})} placeholder="Enter detailed department description:&#10;&#10;• Laboratories: The Department of Information Technology provides well-equipped laboratories with latest systems, high-speed internet, advanced software tools&#10;• Facilities: Smart classrooms, seminar halls, research labs, project labs&#10;• Achievements: Department has won national awards, students placed in top companies, research publications&#10;• Vision of department, mission, programs offered, intake, etc&#10;&#10;You can write long paragraphs - this field supports unlimited text like principal biography" rows={8} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y leading-[1.7] min-h-[180px]" />
               <div className="text-[10px] text-[#547792] mt-2">This large field supports long text - write as much as you want about labs, facilities, achievements</div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 rounded-[16px] bg-[#1A3263] text-white">
            <div className="font-bold text-[14px] text-[#FAB95B] flex items-center gap-2"> HOD Details - Image + Biography</div>
            <div className="text-[11px] text-white/70 mt-1">Add HOD information with image and detailed biography - supports long text</div>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-[13px] uppercase tracking-wide text-[#1A3263] border-b-2 border-[#E8E2DB] pb-2">HOD Personal Information</h5>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
               <label className="text-[11px] font-bold uppercase text-[#1A3263]">HOD Name *</label>
               <input value={deptForm.hod} onChange={e=>setDeptForm({...deptForm, hod: e.target.value})} placeholder="e.g. Dr. Ramesh Kumar" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px] font-medium" />
              </div>
              <div>
               <label className="text-[11px] font-bold uppercase text-[#1A3263]">HOD Designation</label>
               <input value={deptForm.hodDesignation} onChange={e=>setDeptForm({...deptForm, hodDesignation: e.target.value})} placeholder="Head of Department" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
              </div>
              <div>
               <label className="text-[11px] font-bold uppercase text-[#1A3263]">HOD Qualification</label>
               <input value={deptForm.hodQualification} onChange={e=>setDeptForm({...deptForm, hodQualification: e.target.value})} placeholder="e.g. Ph.D, M.E CSE" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
              </div>
              <div>
               <label className="text-[11px] font-bold uppercase text-[#1A3263]">HOD Experience</label>
               <input value={deptForm.hodExperience} onChange={e=>setDeptForm({...deptForm, hodExperience: e.target.value})} placeholder="e.g. 15 years academic + 2 years industrial" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
              </div>
              <div>
               <label className="text-[11px] font-bold uppercase text-[#1A3263]">HOD Email</label>
               <input value={deptForm.hodEmail} onChange={e=>setDeptForm({...deptForm, hodEmail: e.target.value})} placeholder="hod@college.edu" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
              </div>
              <div>
               <label className="text-[11px] font-bold uppercase text-[#1A3263]">HOD Phone</label>
               <input value={deptForm.hodPhone} onChange={e=>setDeptForm({...deptForm, hodPhone: e.target.value})} placeholder="+91 98765 43210" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
              </div>
            </div>

            <div className="space-y-5">
              <div>
               <label className="text-[11px] font-bold uppercase text-[#1A3263]">HOD Image - Large Preview</label>
               <div className="mt-2 flex gap-3">
                <input value={deptForm.hodImage} onChange={e=>setDeptForm({...deptForm, hodImage: e.target.value})} placeholder="Paste HOD photo URL or upload - supports large images" className="flex-1 h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                <label className="h-12 px-5 rounded-[14px] bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center gap-2 cursor-pointer hover:bg-[#1A3263]/90">
                  <Upload size={14} /> Upload HOD Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleDeptHodImageUpload} />
                </label>
               </div>
               {deptForm.hodImage && (
                 <div className="mt-4 p-4 rounded-[14px] bg-[#E8E2DB]/30 border-2 border-[#E8E2DB] flex gap-4 items-center">
                   <img src={deptForm.hodImage} className="h-24 w-24 rounded-[14px] object-cover border-2 border-[#FAB95B] shadow" alt="HOD preview" />
                   <div>
                     <div className="font-bold text-[13px] text-[#1A3263]">{deptForm.hod || 'HOD Name'}</div>
                     <div className="text-[11px] text-[#547792]">{deptForm.hodDesignation}</div>
                     <div className="text-[11px] text-[#547792] mt-1">{deptForm.hodEmail}</div>
                   </div>
                 </div>
               )}
              </div>

              <div>
               <label className="text-[11px] font-bold uppercase text-[#1A3263]">HOD Detailed Biography - Large Field - Supports Long Text Like Principal</label>
               <textarea value={deptForm.hodDetailedBio} onChange={e=>setDeptForm({...deptForm, hodDetailedBio: e.target.value})} placeholder="Enter detailed HOD biography - you can write long text:&#10;&#10;Dr. Ramesh Kumar is currently working as Head of Department, Computer Science at College. He has 15 years of academic experience and 2 years of industrial experience.&#10;&#10;Qualification: Ph.D in Computer Science from Anna University, M.E from PSG Tech&#10;Research: Artificial Intelligence, Machine Learning, Data Science, IoT&#10;Publications: Published 85 papers in international journals, presented 60 papers in conferences&#10;Projects: Completed 12 government funded projects worth 5 Crores, 3 projects in progress worth 2 Crores&#10;Products: Developed 8 products, 5 technology transferred to industries&#10;Centres: Created 3 Centres of Excellence in collaboration with industries&#10;Awards: National Award for research, Best Teacher Award, etc&#10;Guidance: Guided 45 graduate projects, 5 PhD scholars, 4 currently pursuing&#10;Events: Keynote speaker in 120 programs, organized 40 conferences and workshops&#10;&#10;This field supports unlimited long text like principal detailed bio" rows={14} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y leading-[1.7] min-h-[280px]" />
               <div className="text-[10px] text-[#547792] mt-2">Large field - write detailed biography with research, publications, projects, awards - supports long paragraphs</div>
              </div>
            </div>
          </div>
         </div>

         <button onClick={handleAddDepartment} className="mt-8 h-12 px-8 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center gap-2 hover:bg-[#1A3263]/90 shadow-lg"><Plus size={18} /> Add Department</button>
        </div>

        <div className="mt-8">
         <h4 className="font-bold text-[#1A3263]">Departments - {(allCustomData.departments||[]).length}</h4>
         {(allCustomData.departments||[]).length===0 ? (
          <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed border-[#1A3263]/20">
                      <div className="font-bold text-[#1A3263] mt-3">No departments added yet</div>
           <div className="text-[12px] text-[#547792] mt-2">Add your departments with HOD information</div>
          </div>
         ) : (
          <div className="mt-4 space-y-4">
           {allCustomData.departments.map(dept=>(
            <div key={dept.id} className="rounded-[20px] bg-[#1A3263] border-2 border-[#1A3263] p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-white text-[14px]">{dept.name} <span className="text-[#FAB95B] text-[11px]">• {dept.facultyCount} Faculty</span></div>
                <button onClick={()=>handleDelete('departments', dept.id)} className="h-8 w-8 rounded-full bg-white/10 border border-white/20 grid place-items-center text-white hover:bg-red-500"><Trash2 size={12} /></button>
              </div>
              <div className="grid md:grid-cols-[100px_1fr] gap-4">
                {dept.hodImage ? <img src={dept.hodImage} className="h-[100px] w-[100px] rounded-[12px] object-cover border-2 border-[#FAB95B]/30 bg-white" alt={dept.hod} /> : <div className="h-[100px] w-[100px] rounded-[12px] bg-white/10 border border-white/20 grid place-items-center text-white font-bold text-[24px]">{dept.hod ? dept.hod[0] : dept.name[0]}</div>}
                <div>
                  <div className="font-bold text-[13px] text-white">{dept.hod}</div>
                  <div className="text-[11px] text-[#FAB95B] mt-1">{dept.hodDesignation || `HOD - ${dept.name}`}</div>
                  <div className="text-[11px] text-white/70 mt-1 break-all">{dept.hodEmail || 'hod@college.edu'} • {dept.hodPhone}</div>
                  <div className="text-[11px] text-white/60 mt-2 line-clamp-3">{dept.hodDetailedBio ? dept.hodDetailedBio.slice(0,200)+'...' : dept.description?.slice(0,200)}</div>
                </div>
              </div>
            </div>
           ))}
          </div>
         )}
        </div>

        {(allCustomData.departments||[]).length>0 && (
          <div className="mt-8 rounded-[20px] bg-[#1A3263] border-2 border-[#1A3263] p-6">
            <div className="text-center mb-6">
              <h4 className="font-display text-[18px] font-bold text-white inline-block relative">{allCustomData.departments[0]?.name || 'Department'}<span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-10 bg-[#FAB95B] rounded-full"></span></h4>
              <div className="text-[11px] text-white/60 mt-3">Preview of department display</div>
            </div>
            <div className="grid md:grid-cols-[200px_1fr] gap-6 max-w-[900px] mx-auto">
              <div className="text-center">
                {deptForm.hodImage || allCustomData.departments[0]?.hodImage ? <img src={deptForm.hodImage || allCustomData.departments[0]?.hodImage} className="w-full h-[220px] rounded-[12px] object-cover border-2 border-white/20 shadow-xl object-top" alt="HOD" /> : <div className="w-full h-[220px] rounded-[12px] bg-white/10 border-2 border-dashed border-white/20 grid place-items-center text-white/40 text-[11px]">HOD Image</div>}
                <div className="mt-3 font-bold text-[14px] text-white">{deptForm.hod || allCustomData.departments[0]?.hod || 'HOD Name'}</div>
                <div className="text-[12px] text-[#FAB95B] mt-1">{deptForm.hodDesignation || 'Head of Department'}</div>
                <div className="text-[11px] text-white/70 mt-2 break-all">{deptForm.hodEmail || allCustomData.departments[0]?.hodEmail || 'hod@college.edu'}</div>
              </div>
              <div className="rounded-[8px] bg-white p-5">
                <div className="text-[12px] leading-[1.7] text-[#1A3263]/80 whitespace-pre-wrap">{deptForm.hodDetailedBio || allCustomData.departments[0]?.hodDetailedBio || 'Detailed HOD biography will appear here'}</div>
              </div>
            </div>
          </div>
        )}
       </div>
      </div>
     )}

     {activeSection==='courses' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263]">Courses </h3>
        <p className="text-[12px] text-[#547792] mt-2">Add courses offered by your college</p>

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
         <button onClick={handleAddCourse} className="mt-6 h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] flex items-center gap-2"><Plus size={16} /> Add Course</button>
        </div>

        <div className="mt-8">
         <h4 className="font-bold text-[#1A3263]">Courses - {(allCustomData.courses||[]).length} </h4>
         {(allCustomData.courses||[]).length===0 ? (
          <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed border-[#1A3263]/20">
                      <div className="font-bold text-[#1A3263] mt-3">No courses added yet</div>
           <div className="text-[12px] text-[#547792] mt-2">Add courses for your college</div>
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
       <h3 className="font-bold text-[18px] text-[#1A3263]">Facilities</h3>
       <div className="mt-6 rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-5">
        <div className="grid md:grid-cols-2 gap-4">
         <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Facility Name *</label><input value={facilityForm.name} onChange={e=>setFacilityForm({...facilityForm, name: e.target.value})} placeholder="e.g. Central Library, Sports Complex, Environment" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
         <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Image URL</label><input value={facilityForm.image} onChange={e=>setFacilityForm({...facilityForm, image: e.target.value})} placeholder="Facility image URL" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
         <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Description</label><textarea value={facilityForm.description} onChange={e=>setFacilityForm({...facilityForm, description: e.target.value})} placeholder="Facility description - environment, placement, etc" rows={2} className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px] resize-none" /></div>
        </div>
        <button onClick={handleAddFacility} className="mt-4 h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">Add Facility</button>
       </div>
       <div className="mt-6 grid md:grid-cols-2 gap-4">
        {(allCustomData.customFacilities||[]).map(f=>(
         <div key={f.id} className="rounded-[16px] border-2 border-[#E8E2DB] p-4 flex gap-3">
          {f.image && <img src={f.image} className="h-16 w-16 rounded-[10px] object-cover border" alt="Facility" />}
          <div className="flex-1"><div className="font-bold text-[13px] text-[#1A3263]">{f.name}</div><div className="text-[11px] text-[#547792] mt-1">{f.description?.slice(0,100)}</div></div>
          <button onClick={()=>handleDelete('customFacilities', f.id)} className="h-8 w-8 rounded-full border-2 border-[#E8E2DB] grid place-items-center"><Trash2 size={12} /></button>
         </div>
        ))}
        {(allCustomData.customFacilities||[]).length===0 && <div className="col-span-2 py-8 text-center text-[#547792] text-[12px]">No facilities added yet</div>}
       </div>
      </div>
     )}

     {activeSection==='placements' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Briefcase className="text-[#FAB95B]" /> Placements with Company Logo</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add placement records with company logo - images odd pantra mathiri</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
         <h4 className="font-display text-[18px] font-bold text-[#1A3263] flex items-center gap-2"><Plus size={18} /> Add New Placement - Company Logo</h4>
         <div className="mt-2 text-[12px] text-[#547792]">Add company with logo, package, students - logo will show on college website</div>

         <div className="mt-8 space-y-6">
          <div className="space-y-4">
           <h5 className="font-bold text-[13px] uppercase tracking-wide text-[#1A3263] border-b-2 border-[#E8E2DB] pb-2">Company Information</h5>
           <div className="grid md:grid-cols-2 gap-5">
            <div>
             <label className="text-[11px] font-bold uppercase text-[#1A3263]">Company Name *</label>
             <input value={placementForm.company} onChange={e=>setPlacementForm({...placementForm, company: e.target.value})} placeholder="e.g. TCS, Infosys, Zoho, Google" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] font-medium transition-colors" />
            </div>
            <div>
             <label className="text-[11px] font-bold uppercase text-[#1A3263]">Year</label>
             <input value={placementForm.year} onChange={e=>setPlacementForm({...placementForm, year: e.target.value})} placeholder="e.g. 2024, 2025" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px] transition-colors" />
            </div>
            <div>
             <label className="text-[11px] font-bold uppercase text-[#1A3263]">Package</label>
             <input value={placementForm.package} onChange={e=>setPlacementForm({...placementForm, package: e.target.value})} placeholder="e.g. 6 LPA, 12 LPA, 8-12 LPA" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px] transition-colors" />
            </div>
            <div>
             <label className="text-[11px] font-bold uppercase text-[#1A3263]">Students Placed</label>
             <input value={placementForm.students} onChange={e=>setPlacementForm({...placementForm, students: e.target.value})} placeholder="e.g. 50, 120" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px] transition-colors" />
            </div>
            <div className="md:col-span-2">
             <label className="text-[11px] font-bold uppercase text-[#1A3263]">Department</label>
             <input value={placementForm.department} onChange={e=>setPlacementForm({...placementForm, department: e.target.value})} placeholder="e.g. CSE, All Departments, CSE + IT" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px] transition-colors" />
            </div>
           </div>
          </div>

          <div className="space-y-4">
           <h5 className="font-bold text-[13px] uppercase tracking-wide text-[#1A3263] border-b-2 border-[#E8E2DB] pb-2 flex items-center gap-2"><ImageIcon size={14} className="text-[#FAB95B]" /> Company Logo - Image Odd Pantra Mathiri</h5>
           <div>
            <label className="text-[11px] font-bold uppercase text-[#1A3263]">Company Logo - Upload or URL</label>
            <div className="mt-2 flex gap-3">
             <input value={placementForm.logo} onChange={e=>setPlacementForm({...placementForm, logo: e.target.value})} placeholder="Paste company logo URL - https://logo.com/tcs.png or upload" className="flex-1 h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
             <label className="h-12 px-5 rounded-[14px] bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center gap-2 cursor-pointer hover:bg-[#1A3263]/90 transition-colors">
               <Upload size={14} /> Upload Logo
               <input type="file" accept="image/*" className="hidden" onChange={handlePlacementLogoUpload} />
             </label>
            </div>
            {placementForm.logo && (
              <div className="mt-4 p-4 rounded-[14px] bg-[#E8E2DB]/30 border-2 border-[#E8E2DB] flex gap-4 items-center">
                <img src={placementForm.logo} className="h-20 w-20 rounded-[12px] object-contain border-2 border-[#FAB95B] bg-white shadow p-2" alt="Company logo preview" />
                <div>
                  <div className="font-bold text-[13px] text-[#1A3263]">{placementForm.company || 'Company Name'}</div>
                  <div className="text-[11px] text-[#547792]">{placementForm.package} • {placementForm.year}</div>
                  <div className="text-[10px] text-[#547792] mt-1">Logo preview - will show on college website</div>
                </div>
              </div>
            )}
           </div>
           <div>
            <label className="text-[11px] font-bold uppercase text-[#1A3263]">Placement Description (Optional) - Large Field</label>
            <textarea value={placementForm.description} onChange={e=>setPlacementForm({...placementForm, description: e.target.value})} placeholder="Add details about placement drive, roles offered, selection process, etc - large field supports long text" rows={4} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y leading-[1.7] min-h-[100px]" />
           </div>
          </div>
         </div>

         <button onClick={handleAddPlacement} className="mt-8 h-12 px-8 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center gap-2 hover:bg-[#1A3263]/90 shadow-lg"><Plus size={18} /> Add Placement with Logo</button>
        </div>

        <div className="mt-8">
         <h4 className="font-bold text-[#1A3263]">Placements - {(allCustomData.placements||[]).length} Records</h4>
         {(allCustomData.placements||[]).length===0 ? (
          <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed border-[#1A3263]/20">
                      <div className="font-bold text-[#1A3263] mt-3">No placement records yet</div>
           <div className="text-[12px] text-[#547792] mt-2">Add companies with logos - will display on college website with company logo</div>
          </div>
         ) : (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
           {(allCustomData.placements||[]).map(p=>(
            <div key={p.id} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] p-5 flex gap-4 hover:border-[#FAB95B]/40 transition-colors">
             {p.logo ? <img src={p.logo} className="h-16 w-16 rounded-[12px] object-contain border-2 border-[#E8E2DB] bg-white p-1.5 shrink-0" alt={p.company} /> : <div className="h-16 w-16 rounded-[12px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-bold text-[20px] shrink-0">{p.company[0]}</div>}
             <div className="flex-1 min-w-0">
              <div className="font-bold text-[13px] text-[#1A3263]">{p.company} - {p.year}</div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-full bg-[#FAB95B] text-[#1A3263] text-[10px] font-bold">{p.package}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[10px]">{p.students} students</span>
                {p.department && <span className="px-2 py-0.5 rounded-full bg-white border text-[10px]">{p.department}</span>}
              </div>
              {p.description && <div className="text-[11px] text-[#547792] mt-2 line-clamp-2">{p.description}</div>}
             </div>
             <button onClick={()=>handleDelete('placements', p.id)} className="h-8 w-8 rounded-full bg-white border-2 border-[#E8E2DB] grid place-items-center text-[#547792] hover:border-red-200 hover:text-red-600 shrink-0"><Trash2 size={12} /></button>
            </div>
           ))}
          </div>
         )}
        </div>
       </div>
      </div>
     )}

     {activeSection==='examinations' && (
      <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
       <h3 className="font-bold text-[18px] text-[#1A3263]">Examinations</h3>
       <p className="text-[12px] text-[#547792] mt-2">Add examination details for your college</p>
       
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
         <button className="mt-3 h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">Save Exam Details</button>
        </div>
       </div>

       <div className="mt-6 rounded-[16px] bg-[#1A3263] text-white p-5">
        <div className="font-bold text-[#FAB95B]">Examination Details</div>
        <div className="text-[11px] text-[#E8E2DB]/80 mt-2 leading-[1.6]">Manage examination notifications, timetable, results and academic calendar</div>
       </div>
      </div>
     )}

     {activeSection==='gallery' && (
      <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
       <h3 className="font-bold text-[18px] text-[#1A3263]">Gallery</h3>
       <div className="mt-6 rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-5">
        <div className="grid md:grid-cols-2 gap-4">
         <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Image URL</label><input value={galleryForm.url} onChange={e=>setGalleryForm({...galleryForm, url: e.target.value})} placeholder="Paste image URL" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
         <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Caption</label><input value={galleryForm.caption} onChange={e=>setGalleryForm({...galleryForm, caption: e.target.value})} placeholder="e.g. Main Building, Library, Hostel" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
        </div>
        <button onClick={handleAddGallery} className="mt-4 h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">Add Campus Image </button>
       </div>
       <div className="mt-6 grid md:grid-cols-3 gap-4">
        {(allCustomData.gallery||[]).map(img=>(
         <div key={img.id} className="rounded-[12px] overflow-hidden border-2 border-[#E8E2DB] bg-white">
          <img src={img.url} className="h-[140px] w-full object-cover" alt="Your Campus" />
          <div className="p-3 flex justify-between items-center"><span className="text-[11px] font-medium text-[#1A3263]">{img.caption}</span><button onClick={()=>handleDelete('gallery', img.id)} className="h-7 w-7 rounded-full border-2 border-[#E8E2DB] grid place-items-center"><Trash2 size={10} /></button></div>
         </div>
        ))}
        {(allCustomData.gallery||[]).length===0 && <div className="col-span-3 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed"><div className="text-3xl"></div><div className="font-bold text-[#1A3263] mt-3">No campus images added yet</div><div className="text-[11px] text-[#547792] mt-1">Add campus images for your college</div></div>}
       </div>
      </div>
     )}

     {activeSection==='hostel' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Home className="text-[#FAB95B]" /> Hostel with Images</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add hostel details with images - hostel la images odd pantra mathiri venum</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
         <h4 className="font-display text-[18px] font-bold text-[#1A3263] flex items-center gap-2"><Plus size={18} /> Add New Hostel - With Images</h4>
         <div className="mt-2 text-[12px] text-[#547792]">Add hostel info + upload multiple images - will show gallery on college website</div>

         <div className="mt-8 space-y-6">
          <div className="space-y-4">
           <h5 className="font-bold text-[13px] uppercase tracking-wide text-[#1A3263] border-b-2 border-[#E8E2DB] pb-2">Hostel Information</h5>
           <div className="grid md:grid-cols-2 gap-5">
            <div>
             <label className="text-[11px] font-bold uppercase text-[#1A3263]">Hostel Name *</label>
             <input value={hostelForm.name} onChange={e=>setHostelForm({...hostelForm, name: e.target.value})} placeholder="e.g. Boys Hostel A, Girls Hostel Main" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] font-medium transition-colors" />
            </div>
            <div>
             <label className="text-[11px] font-bold uppercase text-[#1A3263]">Type</label>
             <select value={hostelForm.type} onChange={e=>setHostelForm({...hostelForm, type: e.target.value})} className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px]">
              <option>Boys</option><option>Girls</option><option>Boys & Girls</option>
             </select>
            </div>
            <div>
             <label className="text-[11px] font-bold uppercase text-[#1A3263]">Capacity</label>
             <input value={hostelForm.capacity} onChange={e=>setHostelForm({...hostelForm, capacity: e.target.value})} placeholder="e.g. 200, 500 students" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px] transition-colors" />
            </div>
            <div>
             <label className="text-[11px] font-bold uppercase text-[#1A3263]">Fees</label>
             <input value={hostelForm.fees} onChange={e=>setHostelForm({...hostelForm, fees: e.target.value})} placeholder="e.g. 50000 per year, 60000 with mess" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px] transition-colors" />
            </div>
            <div className="md:col-span-2">
             <label className="text-[11px] font-bold uppercase text-[#1A3263]">Facilities</label>
             <input value={hostelForm.facilities} onChange={e=>setHostelForm({...hostelForm, facilities: e.target.value})} placeholder="e.g. WiFi, Mess, Gym, Library, RO Water, Hot Water, Study Room" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px] transition-colors" />
            </div>
            <div className="md:col-span-2">
             <label className="text-[11px] font-bold uppercase text-[#1A3263]">Hostel Description - Large Field</label>
             <textarea value={hostelForm.description} onChange={e=>setHostelForm({...hostelForm, description: e.target.value})} placeholder="Enter detailed hostel description:&#10;&#10;• Rooms: Well-furnished rooms with cot, table, chair, cupboard&#10;• Mess: Hygienic vegetarian & non-veg mess, 3 times food&#10;• Facilities: 24/7 WiFi, library, gym, indoor games, medical facility&#10;• Security: 24/7 security, CCTV, warden&#10;• Rules, timings, etc" rows={8} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y leading-[1.7] min-h-[180px]" />
            </div>
           </div>
          </div>

          <div className="space-y-4">
           <h5 className="font-bold text-[13px] uppercase tracking-wide text-[#1A3263] border-b-2 border-[#E8E2DB] pb-2 flex items-center gap-2"><Camera size={14} className="text-[#FAB95B]" /> Hostel Images - Multiple Images Odd Pantra Mathiri</h5>
           
           <div className="rounded-[16px] bg-[#FAB95B]/10 border-2 border-[#FAB95B]/30 p-5">
            <label className="text-[11px] font-bold uppercase text-[#1A3263]">Add Hostel Images - URL or Upload (Up to 10)</label>
            <div className="mt-3 flex gap-2">
             <input value={newHostelImageUrl} onChange={e=>setNewHostelImageUrl(e.target.value)} placeholder="Paste hostel image URL - https://college.edu/hostel1.jpg" className="flex-1 h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
             <button onClick={handleAddHostelImage} className="h-12 px-5 rounded-[14px] bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center gap-1.5"><Plus size={14} /> Add</button>
            </div>
            <div className="mt-3 flex gap-2">
             <label className="flex-1 h-12 px-4 rounded-[14px] bg-white border-2 border-dashed border-[#1A3263]/20 text-[#1A3263] font-bold text-[12px] flex items-center justify-center gap-2 cursor-pointer hover:border-[#FAB95B]">
               <Upload size={14} /> Upload Multiple Images ({(hostelForm.images||[]).length}/10)
               <input type="file" accept="image/*" multiple className="hidden" onChange={handleHostelImageUpload} />
             </label>
            </div>

            {(hostelForm.images||[]).length===0 ? (
             <div className="mt-4 rounded-[12px] bg-white border-2 border-dashed border-[#1A3263]/20 p-6 text-center">
               <div className="text-2xl"></div>
               <div className="text-[11px] text-[#547792] mt-2">No hostel images added yet - add room, mess, building photos</div>
             </div>
            ) : (
             <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
               {(hostelForm.images||[]).map((img, idx)=>(
                 <div key={img.id} className="relative rounded-[12px] overflow-hidden border-2 border-[#E8E2DB] bg-white group">
                   <img src={img.url} className="h-[110px] w-full object-cover" alt={`Hostel ${idx+1}`} />
                   <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px] font-bold">{idx+1}</div>
                   <button onClick={()=>handleRemoveHostelImage(img.id)} className="absolute top-2 right-2 h-6 w-6 rounded-full bg-red-500 text-white grid place-items-center hover:bg-red-600"><Trash2 size={10} /></button>
                 </div>
               ))}
             </div>
            )}
           </div>
          </div>
         </div>

         <button onClick={handleAddHostel} className="mt-8 h-12 px-8 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center gap-2 hover:bg-[#1A3263]/90 shadow-lg"><Plus size={18} /> Add Hostel with Images</button>
        </div>

        <div className="mt-8">
         <h4 className="font-bold text-[#1A3263]">Hostels - {(allCustomData.hostels||[]).length}</h4>
         {(allCustomData.hostels||[]).length===0 ? (
          <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed border-[#1A3263]/20">
                      <div className="font-bold text-[#1A3263] mt-3">No hostels added yet</div>
           <div className="text-[12px] text-[#547792] mt-2">Add hostel with images - will show gallery on college website</div>
          </div>
         ) : (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
           {(allCustomData.hostels||[]).map(h=>(
            <div key={h.id} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] overflow-hidden hover:border-[#FAB95B]/40 transition-colors">
             {(h.images && h.images.length>0) ? (
               <div className="grid grid-cols-3 gap-1 p-1 bg-[#E8E2DB]">
                 {h.images.slice(0,3).map((img, i)=>(
                   <img key={i} src={img.url || img} className="h-[80px] w-full object-cover rounded-[8px]" alt="Hostel" />
                 ))}
                 {h.images.length>3 && <div className="h-[80px] rounded-[8px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-bold text-[12px]">+{h.images.length-3} more</div>}
               </div>
             ) : null}
             <div className="p-4 flex justify-between gap-3">
              <div className="flex-1 min-w-0">
               <div className="font-bold text-[13px] text-[#1A3263]">{h.name} - {h.type}</div>
               <div className="mt-1 flex flex-wrap gap-1">
                 {h.capacity && <span className="px-2 py-0.5 rounded-full bg-[#E8E2DB] text-[10px]">Cap {h.capacity}</span>}
                 {h.fees && <span className="px-2 py-0.5 rounded-full bg-[#FAB95B]/20 text-[10px] font-bold">{h.fees}</span>}
                 {h.images && <span className="px-2 py-0.5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px]">{h.images.length} images</span>}
               </div>
               <div className="text-[11px] text-[#547792] mt-2">{h.facilities}</div>
               {h.description && <div className="text-[11px] text-[#1A3263]/60 mt-1 line-clamp-2">{h.description.slice(0,100)}</div>}
              </div>
              <button onClick={()=>handleDelete('hostels', h.id)} className="h-8 w-8 rounded-full border-2 border-[#E8E2DB] grid place-items-center shrink-0"><Trash2 size={12} /></button>
             </div>
            </div>
           ))}
          </div>
         )}
        </div>
       </div>
      </div>
     )}

     {activeSection==='about' && (
      <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
       <h3 className="font-bold text-[18px] text-[#1A3263]">About, Vision, Mission </h3>
       <div className="mt-6 space-y-5">
        <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">About College</label><textarea value={aboutForm.fullText} onChange={e=>setAboutForm({...aboutForm, fullText: e.target.value})} placeholder="Write about your college - history, campus, achievements" rows={6} className="mt-2 w-full p-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
        <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Vision</label><textarea value={aboutForm.vision} onChange={e=>setAboutForm({...aboutForm, vision: e.target.value})} placeholder="Your college vision" rows={2} className="mt-2 w-full p-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
        <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Mission - Each line new mission</label><textarea value={aboutForm.mission} onChange={e=>setAboutForm({...aboutForm, mission: e.target.value})} placeholder="Mission 1&#10;Mission 2&#10;Mission 3" rows={4} className="mt-2 w-full p-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
        <button onClick={handleSaveAbout} className="h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px]">Save About</button>
       </div>
      </div>
     )}

     {activeSection==='analytics' && (
      <CollegeAnalytics college={college} />
     )}

     {activeSection==='management' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Users size={22} className="text-[#FAB95B]" /> Management & Trustees - Real-Time Working</h3>
            <p className="text-[12px] text-[#547792] mt-2">Add management members - Chairman, Secretary, Trustees, Correspondent - image odu real-time website la theriyum</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold">{(allCustomData.management||[]).length} Members</span>
        </div>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
         <h4 className="font-display text-[18px] font-bold text-[#1A3263] flex items-center gap-2"><Plus size={18} /> Add New Management Member - Image + Details</h4>
         <div className="mt-6 grid md:grid-cols-2 gap-5">
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Name *</label><input value={managementForm.name} onChange={e=>setManagementForm({...managementForm, name: e.target.value})} placeholder="e.g. Dr. R. Kumar" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] font-bold" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Designation * - Chairman / Secretary / Trustee</label><input value={managementForm.designation} onChange={e=>setManagementForm({...managementForm, designation: e.target.value})} placeholder="e.g. Chairman, Secretary, Correspondent, Trustee" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] font-bold" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Email</label><input value={managementForm.email} onChange={e=>setManagementForm({...managementForm, email: e.target.value})} placeholder="chairman@yourcollege.edu" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Phone</label><input value={managementForm.phone} onChange={e=>setManagementForm({...managementForm, phone: e.target.value})} placeholder="+91 98765 43210" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div>
           <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><ImageIcon size={12} className="text-[#FAB95B]" /> Image - Upload or URL - Real-time</label>
           <div className="mt-2 flex gap-2">
            <input value={managementForm.image} onChange={e=>setManagementForm({...managementForm, image: e.target.value})} placeholder="Paste image URL or upload" className="flex-1 h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
            <label className="h-11 px-4 rounded-[12px] bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"><Upload size={12} /> Upload<input type="file" accept="image/*" className="hidden" onChange={handleManagementImageUpload} /></label>
           </div>
          </div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Description - Bio, Achievements</label><textarea value={managementForm.description} onChange={e=>setManagementForm({...managementForm, description: e.target.value})} placeholder="Short bio, education, achievements, message..." rows={3} className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y min-h-[80px]" /></div>
          {managementForm.image && (
            <div className="md:col-span-2">
              <div className="rounded-[12px] overflow-hidden border-2 border-[#E8E2DB] bg-[#E8E2DB]/30 p-2 flex gap-4 items-center">
                <img src={managementForm.image} className="h-20 w-20 rounded-[12px] object-cover border-2 border-white shadow" alt="Preview" />
                <div><div className="font-bold text-[13px] text-[#1A3263]">{managementForm.name || 'Preview'} - {managementForm.designation || 'Designation'}</div><div className="text-[11px] text-[#547792]">Image preview - will show on website Management section</div></div>
              </div>
            </div>
          )}
         </div>
         <button onClick={handleAddManagement} className="mt-8 h-12 px-8 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center gap-2 shadow hover:bg-[#1A3263]/90"><Plus size={18} /> Add Management Member - Real-time</button>
        </div>

        <div className="mt-8">
         <h4 className="font-bold text-[#1A3263]">Management - {(allCustomData.management||[]).length} Members Added</h4>
         {(allCustomData.management||[]).length===0 ? (
          <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed border-[#1A3263]/20">
                      <div className="font-bold text-[#1A3263] mt-3">No management members added yet</div>
           <div className="text-[12px] text-[#547792] mt-2">Add Chairman, Secretary, Trustees - image odu - real-time website la theriyum</div>
          </div>
         ) : (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
           {allCustomData.management.map(member=>(
            <div key={member.id} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] p-5 flex gap-4 hover:border-[#FAB95B]/40 transition-colors">
             {member.image ? <img src={member.image} className="h-20 w-20 rounded-[12px] object-cover border-2 border-[#E8E2DB] shrink-0" alt={member.name} /> : <div className="h-20 w-20 rounded-[12px] bg-[#E8E2DB] grid place-items-center text-[#1A3263] font-bold text-[20px]">{member.name[0]}</div>}
             <div className="flex-1 min-w-0">
              <div className="font-bold text-[14px] text-[#1A3263]">{member.name}</div>
              <div className="mt-1 inline-flex px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-bold">{member.designation}</div>
              <div className="text-[11px] text-[#547792] mt-2">{member.email} {member.phone ? `• ${member.phone}` : ''}</div>
              <div className="text-[11px] text-[#1A3263]/60 mt-1 line-clamp-2">{member.description}</div>
             </div>
             <button onClick={()=>handleDelete('management', member.id)} className="h-8 w-8 rounded-full bg-white border-2 border-[#E8E2DB] grid place-items-center text-[#547792] hover:border-red-200 hover:text-red-600 shrink-0"><Trash2 size={12} /></button>
            </div>
           ))}
          </div>
         )}
        </div>
       </div>
      </div>
     )}

     {activeSection==='principal' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><UserCheck size={22} className="text-[#FAB95B]" /> Principal Details</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add principal information for your college</p>

        <div className="mt-8 rounded-[20px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-6">
         <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><Edit3 size={16} /> Principal Information</h4>
         <div className="mt-2 text-[11px] text-[#547792]">Add principal biography including qualification, experience and achievements</div>
         <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Principal Name *</label>
           <input value={principalForm.name} onChange={e=>setPrincipalForm({...principalForm, name: e.target.value})} placeholder="e.g. Dr. L. Ashok Kumar" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
          </div>
          <div>
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Designation</label>
           <input value={principalForm.designation} onChange={e=>setPrincipalForm({...principalForm, designation: e.target.value})} placeholder="Principal" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
          </div>
          <div>
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Qualification</label>
           <input value={principalForm.qualification} onChange={e=>setPrincipalForm({...principalForm, qualification: e.target.value})} placeholder="e.g. Ph.D, Postdoctoral Research Fellow" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
          </div>
          <div>
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Experience</label>
           <input value={principalForm.experience} onChange={e=>setPrincipalForm({...principalForm, experience: e.target.value})} placeholder="e.g. 3 years industrial + 25 years academic" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
          </div>
          <div>
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Email</label>
           <input value={principalForm.email} onChange={e=>setPrincipalForm({...principalForm, email: e.target.value})} placeholder="principal@college.edu" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
          </div>
          <div>
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Phone</label>
           <input value={principalForm.phone} onChange={e=>setPrincipalForm({...principalForm, phone: e.target.value})} placeholder="+91 98765 43210" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
          </div>
          <div className="md:col-span-2">
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Principal Image</label>
           <div className="mt-2 flex gap-2">
            <input value={principalForm.image} onChange={e=>setPrincipalForm({...principalForm, image: e.target.value})} placeholder="Paste image URL or upload photo" className="flex-1 h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
            <label className="h-11 px-4 rounded-[12px] bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1.5 cursor-pointer">
              <Upload size={12} /> Upload
              <input type="file" accept="image/*" className="hidden" onChange={handlePrincipalImageUpload} />
            </label>
           </div>
          </div>
          <div className="md:col-span-2">
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Detailed Biography</label>
           <textarea value={principalForm.detailedBio} onChange={e=>setPrincipalForm({...principalForm, detailedBio: e.target.value})} placeholder="Enter detailed biography including qualification, experience, research, publications and achievements" rows={12} className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none leading-[1.6]" />
           <div className="text-[10px] text-[#547792] mt-1">Detailed biography will appear on college website</div>
          </div>
          <div className="md:col-span-2">
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Short Message (Optional)</label>
           <textarea value={principalForm.message} onChange={e=>setPrincipalForm({...principalForm, message: e.target.value})} placeholder="Short principal message" rows={2} className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" />
          </div>
         </div>
         <button onClick={handleSavePrincipal} className="mt-6 h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] flex items-center gap-2"><Save size={16} /> Save Principal</button>
        </div>

        <div className="mt-8 rounded-[20px] bg-[#1A3263] border-2 border-[#1A3263] p-6">
         <div className="text-center mb-6">
           <h4 className="font-display text-[20px] font-bold text-white inline-block relative">Principal<span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-10 bg-[#FAB95B] rounded-full"></span></h4>
         </div>
         <div className="grid md:grid-cols-[200px_1fr] gap-6 max-w-[900px] mx-auto">
          <div className="text-center">
            {principalForm.image ? <img src={principalForm.image} className="w-full h-[220px] rounded-[12px] object-cover border-2 border-white/20 shadow-xl" alt="Principal" /> : <div className="w-full h-[220px] rounded-[12px] bg-white/10 border-2 border-dashed border-white/20 grid place-items-center text-white/40 text-[11px]">Principal Image</div>}
            <div className="mt-3 font-bold text-[14px] text-white">{principalForm.name || 'Principal Name'}</div>
            <div className="text-[12px] text-[#FAB95B] mt-1">{principalForm.designation || 'Principal'}</div>
            <div className="text-[11px] text-white/70 mt-2 break-all">{principalForm.email || 'principal@college.edu'}</div>
          </div>
          <div className="rounded-[8px] bg-white p-5">
            <div className="text-[12px] leading-[1.7] text-[#1A3263]/80 whitespace-pre-wrap">{principalForm.detailedBio || principalForm.message || 'Detailed biography will appear here'}</div>
          </div>
         </div>
        </div>
       </div>
      </div>
     )}

     {activeSection==='research' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Microscope className="text-[#FAB95B]" /> Research & Centres</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add Research Centres, Centres of Excellence, Labs - with images real-time working</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
         <h4 className="font-display text-[18px] font-bold text-[#1A3263] flex items-center gap-2"><Plus size={18} /> Add Research Centre / Centre of Excellence</h4>
         <div className="mt-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
           <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Centre Name *</label><input value={researchForm.name} onChange={e=>setResearchForm({...researchForm, name: e.target.value})} placeholder="e.g. Centre for AI & Robotics, PSG-STEIN Centre" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] font-medium" /></div>
           <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Type</label><select value={researchForm.type} onChange={e=>setResearchForm({...researchForm, type: e.target.value})} className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[14px]"><option>Centre of Excellence</option><option>Research Centre</option><option>Advanced Lab</option><option>Innovation Centre</option><option>Incubation Centre</option></select></div>
           <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Funding / Sponsor</label><input value={researchForm.funding} onChange={e=>setResearchForm({...researchForm, funding: e.target.value})} placeholder="e.g. DST 50L, Industry sponsored" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
           <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Year Established</label><input value={researchForm.year} onChange={e=>setResearchForm({...researchForm, year: e.target.value})} placeholder="e.g. 2020" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
           <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Coordinator</label><input value={researchForm.coordinator} onChange={e=>setResearchForm({...researchForm, coordinator: e.target.value})} placeholder="e.g. Dr. Coordinator Name" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          </div>
          <div>
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Centre Image - Upload or URL</label>
           <div className="mt-2 flex gap-3">
            <input value={researchForm.image} onChange={e=>setResearchForm({...researchForm, image: e.target.value})} placeholder="Paste centre image URL" className="flex-1 h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
            <label className="h-12 px-5 rounded-[14px] bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center gap-2 cursor-pointer"><Upload size={14} /> Upload<input type="file" accept="image/*" className="hidden" onChange={handleResearchImageUpload} /></label>
           </div>
           {researchForm.image && <div className="mt-3"><img src={researchForm.image} className="h-24 w-full rounded-[12px] object-cover border-2 border-[#E8E2DB]" alt="Research preview" /></div>}
          </div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Description - Large Field</label><textarea value={researchForm.description} onChange={e=>setResearchForm({...researchForm, description: e.target.value})} placeholder="Enter detailed description: objectives, focus areas, research domains, collaboration with industries, projects..." rows={6} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y leading-[1.7] min-h-[140px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Facilities</label><textarea value={researchForm.facilities} onChange={e=>setResearchForm({...researchForm, facilities: e.target.value})} placeholder="Lab equipments, software, hardware, instruments..." rows={3} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Achievements</label><textarea value={researchForm.achievements} onChange={e=>setResearchForm({...researchForm, achievements: e.target.value})} placeholder="Projects completed, patents, publications, products developed, funding received..." rows={3} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y" /></div>
         </div>
         <button onClick={handleAddResearch} className="mt-8 h-12 px-8 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center gap-2"><Plus size={18} /> Add Research Centre</button>
        </div>

        <div className="mt-8">
         <h4 className="font-bold text-[#1A3263]">Research Centres - {(allCustomData.researchCentres||allCustomData.research||[]).length}</h4>
         {((allCustomData.researchCentres||allCustomData.research||[]).length===0) ? (
          <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed border-[#1A3263]/20"><div className="text-3xl"></div><div className="font-bold text-[#1A3263] mt-3">No research centres added yet</div><div className="text-[12px] text-[#547792] mt-2">Add your research centres with images</div></div>
         ) : (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
           {(allCustomData.researchCentres||allCustomData.research||[]).map(r=>(
            <div key={r.id} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] overflow-hidden hover:border-[#FAB95B]/40">
             {r.image && <img src={r.image} className="h-[140px] w-full object-cover" alt={r.name} />}
             <div className="p-4">
              <div className="flex justify-between"><div className="font-bold text-[13px] text-[#1A3263]">{r.name}</div><button onClick={()=>handleDelete('researchCentres', r.id)} className="h-7 w-7 rounded-full border-2 border-[#E8E2DB] grid place-items-center"><Trash2 size={10} /></button></div>
              <div className="mt-1 flex gap-1.5 flex-wrap"><span className="px-2 py-0.5 rounded-full bg-[#FAB95B] text-[#1A3263] text-[10px] font-bold">{r.type}</span>{r.year && <span className="px-2 py-0.5 rounded-full bg-[#E8E2DB] text-[10px]">{r.year}</span>}{r.funding && <span className="px-2 py-0.5 rounded-full bg-white border text-[10px]">{r.funding}</span>}</div>
              <div className="text-[11px] text-[#547792] mt-2 line-clamp-3">{r.description}</div>
             </div>
            </div>
           ))}
          </div>
         )}
        </div>
       </div>
      </div>
     )}

     {activeSection==='accreditation' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Award className="text-[#FAB95B]" /> Accreditation</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add NAAC, NBA, NIRF, UGC, AICTE accreditation details with certificate image</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
         <h4 className="font-display text-[18px] font-bold text-[#1A3263] flex items-center gap-2"><Plus size={18} /> Add Accreditation</h4>
         <div className="mt-6 grid md:grid-cols-2 gap-5">
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Accreditation Name *</label><input value={accreditationForm.name} onChange={e=>setAccreditationForm({...accreditationForm, name: e.target.value})} placeholder="e.g. NAAC, NBA, NIRF Ranking, ISO" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] font-medium" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Grade / Rank</label><input value={accreditationForm.grade} onChange={e=>setAccreditationForm({...accreditationForm, grade: e.target.value})} placeholder="e.g. A++, Rank 45, Tier 1" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Agency</label><input value={accreditationForm.agency} onChange={e=>setAccreditationForm({...accreditationForm, agency: e.target.value})} placeholder="e.g. UGC, AICTE, NBA" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Year</label><input value={accreditationForm.year} onChange={e=>setAccreditationForm({...accreditationForm, year: e.target.value})} placeholder="e.g. 2023" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Valid Till</label><input value={accreditationForm.validTill} onChange={e=>setAccreditationForm({...accreditationForm, validTill: e.target.value})} placeholder="e.g. 2028" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div className="md:col-span-1">
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Certificate Image</label>
           <div className="mt-2 flex gap-2">
            <input value={accreditationForm.image} onChange={e=>setAccreditationForm({...accreditationForm, image: e.target.value})} placeholder="Certificate URL" className="flex-1 h-12 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
            <label className="h-12 px-4 rounded-[12px] bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1 cursor-pointer"><Upload size={12} /> Upload<input type="file" accept="image/*" className="hidden" onChange={handleAccreditationImageUpload} /></label>
           </div>
          </div>
          <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Description</label><textarea value={accreditationForm.description} onChange={e=>setAccreditationForm({...accreditationForm, description: e.target.value})} placeholder="Details about accreditation, score, CGPA, validity..." rows={3} className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
         </div>
         <button onClick={handleAddAccreditation} className="mt-6 h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] flex items-center gap-2"><Plus size={16} /> Add Accreditation</button>
        </div>

        <div className="mt-8">
         <h4 className="font-bold text-[#1A3263]">Accreditations - {(allCustomData.accreditations||[]).length}</h4>
         {(allCustomData.accreditations||[]).length===0 ? (
          <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed"><div className="text-3xl"></div><div className="font-bold text-[#1A3263] mt-3">No accreditations added yet</div></div>
         ) : (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
           {(allCustomData.accreditations||[]).map(a=>(
            <div key={a.id} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] p-4 flex gap-3">
             {a.image ? <img src={a.image} className="h-16 w-16 rounded-[10px] object-cover border-2 border-[#E8E2DB]" alt={a.name} /> : <div className="h-16 w-16 rounded-[10px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-bold">{a.name[0]}</div>}
             <div className="flex-1"><div className="font-bold text-[13px] text-[#1A3263]">{a.name} - {a.grade}</div><div className="text-[11px] text-[#547792] mt-1">{a.agency} • {a.year} - {a.validTill}</div><div className="text-[11px] text-[#1A3263]/60 mt-1">{a.description?.slice(0,80)}</div></div>
             <button onClick={()=>handleDelete('accreditations', a.id)} className="h-8 w-8 rounded-full border-2 border-[#E8E2DB] grid place-items-center"><Trash2 size={12} /></button>
            </div>
           ))}
          </div>
         )}
        </div>
       </div>
      </div>
     )}

     {activeSection==='campus' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><MapPin className="text-[#FAB95B]" /> Campus & Environment</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add campus details, green campus, environment initiatives with images real-time</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
         <h4 className="font-display text-[18px] font-bold text-[#1A3263] flex items-center gap-2"><Plus size={18} /> Add Campus & Environment</h4>
         <div className="mt-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
           <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Campus Title *</label><input value={campusForm.title} onChange={e=>setCampusForm({...campusForm, title: e.target.value})} placeholder="e.g. Green Campus, Main Campus 45 Acres" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] font-medium" /></div>
           <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Area</label><input value={campusForm.area} onChange={e=>setCampusForm({...campusForm, area: e.target.value})} placeholder="e.g. 45 Acres, 10 Acres" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          </div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Description - Large Field</label><textarea value={campusForm.description} onChange={e=>setCampusForm({...campusForm, description: e.target.value})} placeholder="Campus description - buildings, infrastructure, location, connectivity..." rows={5} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y leading-[1.7] min-h-[120px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Environment & Green Campus</label><textarea value={campusForm.environment} onChange={e=>setCampusForm({...campusForm, environment: e.target.value})} placeholder="Green initiatives - tree plantation, rain water harvesting, solar power, waste management, plastic free campus..." rows={4} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Green Initiatives</label><textarea value={campusForm.greenInitiatives} onChange={e=>setCampusForm({...campusForm, greenInitiatives: e.target.value})} placeholder="Solar panels 100KW, 1000+ trees, STP plant, e-vehicles, paperless office..." rows={3} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Facilities in Campus</label><input value={campusForm.facilities} onChange={e=>setCampusForm({...campusForm, facilities: e.target.value})} placeholder="Canteen, Bank, ATM, Post Office, Dispensary, Transport..." className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>

          <div className="space-y-4">
           <h5 className="font-bold text-[13px] uppercase tracking-wide text-[#1A3263] border-b-2 border-[#E8E2DB] pb-2 flex items-center gap-2"><Camera size={14} className="text-[#FAB95B]" /> Campus Images - Multiple</h5>
           <div className="rounded-[16px] bg-[#FAB95B]/10 border-2 border-[#FAB95B]/30 p-5">
            <label className="text-[11px] font-bold uppercase text-[#1A3263]">Add Campus Images - URL or Upload (Up to 10)</label>
            <div className="mt-3 flex gap-2">
             <input value={newCampusImageUrl} onChange={e=>setNewCampusImageUrl(e.target.value)} placeholder="Paste campus image URL" className="flex-1 h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
             <button onClick={handleAddCampusImage} className="h-12 px-5 rounded-[14px] bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center gap-1.5"><Plus size={14} /> Add</button>
            </div>
            <div className="mt-3">
             <label className="flex-1 h-11 px-4 rounded-[12px] bg-white border-2 border-dashed border-[#1A3263]/20 text-[#1A3263] font-bold text-[12px] flex items-center justify-center gap-2 cursor-pointer hover:border-[#FAB95B]">
               <Upload size={14} /> Upload Multiple ({(campusForm.images||[]).length}/10)
               <input type="file" accept="image/*" multiple className="hidden" onChange={handleCampusImageUpload} />
             </label>
            </div>
            {(campusForm.images||[]).length>0 && (
             <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
               {(campusForm.images||[]).map((img, idx)=>(
                 <div key={img.id} className="relative rounded-[12px] overflow-hidden border-2 border-[#E8E2DB] bg-white"><img src={img.url} className="h-[100px] w-full object-cover" alt={`Campus ${idx+1}`} /><button onClick={()=>handleRemoveCampusImage(img.id)} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-500 text-white grid place-items-center"><Trash2 size={10} /></button></div>
               ))}
             </div>
            )}
           </div>
          </div>
         </div>
         <button onClick={handleAddCampus} className="mt-8 h-12 px-8 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center gap-2"><Plus size={18} /> Add Campus</button>
        </div>

        <div className="mt-8">
         <h4 className="font-bold text-[#1A3263]">Campus & Environment - {(allCustomData.campusEnvironment||allCustomData.campus||[]).length}</h4>
         {((allCustomData.campusEnvironment||allCustomData.campus||[]).length===0) ? (
          <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed"><div className="text-3xl"></div><div className="font-bold text-[#1A3263] mt-3">No campus details added yet</div></div>
         ) : (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
           {(allCustomData.campusEnvironment||allCustomData.campus||[]).map(c=>(
            <div key={c.id} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] overflow-hidden">
             {c.images && c.images.length>0 && <div className="grid grid-cols-3 gap-1 p-1 bg-[#E8E2DB]">{c.images.slice(0,3).map((img,i)=><img key={i} src={img.url||img} className="h-[70px] w-full object-cover rounded-[8px]" alt="Campus" />)}</div>}
             <div className="p-4 flex justify-between gap-3"><div className="flex-1"><div className="font-bold text-[13px] text-[#1A3263]">{c.title} {c.area && `• ${c.area}`}</div><div className="text-[11px] text-[#547792] mt-2 line-clamp-3">{c.description}</div><div className="text-[10px] text-[#1A3263]/60 mt-2">{c.facilities}</div></div><button onClick={()=>handleDelete('campusEnvironment', c.id)} className="h-8 w-8 rounded-full border-2 border-[#E8E2DB] grid place-items-center"><Trash2 size={12} /></button></div>
            </div>
           ))}
          </div>
         )}
        </div>
       </div>
      </div>
     )}

     {activeSection==='library' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Library className="text-[#FAB95B]" /> Library</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add library details with image - real-time working</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
         <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><BookOpen size={18} /> Library Information</h4>
         <div className="mt-6 grid md:grid-cols-2 gap-5">
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Total Books</label><input value={libraryForm.totalBooks} onChange={e=>setLibraryForm({...libraryForm, totalBooks: e.target.value})} placeholder="e.g. 50000, 2.6 Lakhs" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Journals</label><input value={libraryForm.journals} onChange={e=>setLibraryForm({...libraryForm, journals: e.target.value})} placeholder="e.g. 200 Journals, 1000 e-journals" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Digital Resources</label><input value={libraryForm.digitalResources} onChange={e=>setLibraryForm({...libraryForm, digitalResources: e.target.value})} placeholder="e.g. KOHA, Digital Library 100 systems" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Timings</label><input value={libraryForm.timings} onChange={e=>setLibraryForm({...libraryForm, timings: e.target.value})} placeholder="e.g. 8AM - 8PM" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Librarian</label><input value={libraryForm.librarian} onChange={e=>setLibraryForm({...libraryForm, librarian: e.target.value})} placeholder="Librarian name" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div className="md:col-span-2">
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Library Image</label>
           <div className="mt-2 flex gap-2">
            <input value={libraryForm.image} onChange={e=>setLibraryForm({...libraryForm, image: e.target.value})} placeholder="Library image URL" className="flex-1 h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
            <label className="h-12 px-4 rounded-[12px] bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1 cursor-pointer"><Upload size={12} /> Upload<input type="file" accept="image/*" className="hidden" onChange={handleLibraryImageUpload} /></label>
           </div>
           {libraryForm.image && <img src={libraryForm.image} className="mt-3 h-32 w-full rounded-[12px] object-cover border-2 border-[#E8E2DB]" alt="Library" />}
          </div>
          <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Description - Large Field</label><textarea value={libraryForm.description} onChange={e=>setLibraryForm({...libraryForm, description: e.target.value})} placeholder="Library description - sections, book bank, SWAYAM, digital learning, reference section, etc" rows={6} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y leading-[1.7] min-h-[140px]" /></div>
          <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Facilities</label><textarea value={libraryForm.facilities} onChange={e=>setLibraryForm({...libraryForm, facilities: e.target.value})} placeholder="Reading halls, digital library, OPAC, reprography, internet, discussion rooms..." rows={3} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y" /></div>
         </div>
         <button onClick={handleSaveLibrary} className="mt-8 h-12 px-8 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center gap-2"><Save size={16} /> Save Library Details</button>

         {allCustomData.library && (
          <div className="mt-8 rounded-[16px] bg-[#1A3263] text-white p-5">
           <div className="font-bold text-[#FAB95B]">Preview</div>
           <div className="mt-3 flex gap-4">
            {allCustomData.library.image && <img src={allCustomData.library.image} className="h-20 w-20 rounded-[10px] object-cover border-2 border-[#FAB95B]/30" alt="Library" />}
            <div><div className="font-bold text-[13px]">{allCustomData.library.totalBooks} Books • {allCustomData.library.journals}</div><div className="text-[11px] text-white/70 mt-1">{allCustomData.library.description?.slice(0,120)}</div></div>
           </div>
          </div>
         )}
        </div>
       </div>
      </div>
     )}

     {activeSection==='sports' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Heart className="text-[#FAB95B]" /> Sports</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add sports facilities with images - real-time working</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
         <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><Plus size={16} /> Add Sports / Game</h4>
         <div className="mt-6 grid md:grid-cols-2 gap-5">
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Sports Name *</label><input value={sportsForm.name} onChange={e=>setSportsForm({...sportsForm, name: e.target.value})} placeholder="e.g. Cricket, Football, Basketball, Indoor Games" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] font-medium" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Coach</label><input value={sportsForm.coach} onChange={e=>setSportsForm({...sportsForm, coach: e.target.value})} placeholder="Coach name" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div className="md:col-span-2">
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Sports Image</label>
           <div className="mt-2 flex gap-2">
            <input value={sportsForm.image} onChange={e=>setSportsForm({...sportsForm, image: e.target.value})} placeholder="Sports image URL" className="flex-1 h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
            <label className="h-12 px-4 rounded-[12px] bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1 cursor-pointer"><Upload size={12} /> Upload<input type="file" accept="image/*" className="hidden" onChange={handleSportsImageUpload} /></label>
           </div>
           {sportsForm.image && <img src={sportsForm.image} className="mt-3 h-32 w-full rounded-[12px] object-cover border-2 border-[#E8E2DB]" alt="Sports" />}
          </div>
          <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Description</label><textarea value={sportsForm.description} onChange={e=>setSportsForm({...sportsForm, description: e.target.value})} placeholder="Sports description, ground details, indoor stadium..." rows={4} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y" /></div>
          <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Facilities</label><input value={sportsForm.facilities} onChange={e=>setSportsForm({...sportsForm, facilities: e.target.value})} placeholder="Ground, equipment, gym, coaching..." className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Achievements</label><textarea value={sportsForm.achievements} onChange={e=>setSportsForm({...sportsForm, achievements: e.target.value})} placeholder="Tournaments won, university champions, players selected for state/national..." rows={3} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y" /></div>
         </div>
         <button onClick={handleSaveSports} className="mt-6 h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] flex items-center gap-2"><Plus size={16} /> Add Sports</button>
        </div>

        <div className="mt-8">
         <h4 className="font-bold text-[#1A3263]">Sports - {(allCustomData.sports||[]).length}</h4>
         {(allCustomData.sports||[]).length===0 ? (
          <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed"><div className="text-3xl"></div><div className="font-bold text-[#1A3263] mt-3">No sports added yet</div></div>
         ) : (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
           {(allCustomData.sports||[]).map(s=>(
            <div key={s.id} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] overflow-hidden">
             {s.image && <img src={s.image} className="h-[120px] w-full object-cover" alt={s.name} />}
             <div className="p-4 flex justify-between gap-3"><div className="flex-1"><div className="font-bold text-[13px] text-[#1A3263]">{s.name} {s.coach && `• Coach ${s.coach}`}</div><div className="text-[11px] text-[#547792] mt-1">{s.description?.slice(0,100)}</div></div><button onClick={()=>handleDelete('sports', s.id)} className="h-8 w-8 rounded-full border-2 border-[#E8E2DB] grid place-items-center"><Trash2 size={12} /></button></div>
            </div>
           ))}
          </div>
         )}
        </div>
       </div>
      </div>
     )}

     {activeSection==='alumni' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Award className="text-[#FAB95B]" /> Alumni Success Stories</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add alumni with photo, company, designation - website la KCE style cards ah real-time show aagum</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
         <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><Plus size={16} /> Add Alumni</h4>
         <div className="mt-6 grid md:grid-cols-2 gap-5">
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Alumni Name *</label><input value={alumniForm.name} onChange={e=>setAlumniForm({...alumniForm, name: e.target.value})} placeholder="e.g. J Vijay Shankar" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] font-medium" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Designation / Role</label><input value={alumniForm.designation} onChange={e=>setAlumniForm({...alumniForm, designation: e.target.value})} placeholder="e.g. Engineering Manager" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Company</label><input value={alumniForm.company} onChange={e=>setAlumniForm({...alumniForm, company: e.target.value})} placeholder="e.g. Oracle, Microsoft, Apple" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Company Logo (shows on top of photo)</label>
           <div className="mt-2 flex gap-2">
            <input value={alumniForm.companyLogo} onChange={e=>setAlumniForm({...alumniForm, companyLogo: e.target.value})} placeholder="Logo URL (or upload)" className="flex-1 h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
            <label className="h-12 px-4 rounded-[12px] bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1 cursor-pointer"><Upload size={12} /> Upload<input type="file" accept="image/*" className="hidden" onChange={handleAlumniLogoUpload} /></label>
           </div>
           {alumniForm.companyLogo && <img src={alumniForm.companyLogo} className="mt-3 h-8 w-auto object-contain" alt="Company logo" />}
          </div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Batch / Year</label><input value={alumniForm.batch} onChange={e=>setAlumniForm({...alumniForm, batch: e.target.value})} placeholder="e.g. 2019, ECE" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div className="md:col-span-2">
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Alumni Photo</label>
           <div className="mt-2 flex gap-2">
            <input value={alumniForm.image} onChange={e=>setAlumniForm({...alumniForm, image: e.target.value})} placeholder="Photo URL" className="flex-1 h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
            <label className="h-12 px-4 rounded-[12px] bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1 cursor-pointer"><Upload size={12} /> Upload<input type="file" accept="image/*" className="hidden" onChange={handleAlumniImageUpload} /></label>
           </div>
           {alumniForm.image && <img src={alumniForm.image} className="mt-3 h-28 w-28 rounded-[12px] object-cover object-top border-2 border-[#E8E2DB]" alt="Alumni" />}
          </div>
         </div>
         <button onClick={handleSaveAlumni} className="mt-6 h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] flex items-center gap-2"><Plus size={16} /> Add Alumni</button>
        </div>

        <div className="mt-8">
         <h4 className="font-bold text-[#1A3263]">Alumni - {(customData.alumni||[]).length}</h4>
         {(customData.alumni||[]).length===0 ? (
          <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed"><div className="text-3xl"></div><div className="font-bold text-[#1A3263] mt-3">No alumni added yet</div></div>
         ) : (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
           {(customData.alumni||[]).map(a=>(
            <div key={a.id} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] p-4 flex gap-4">
             {a.image ? <img src={a.image} className="h-16 w-16 rounded-[12px] object-cover object-top border-2 border-[#E8E2DB]" alt={a.name} /> : <div className="h-16 w-16 rounded-[12px] bg-[#E8E2DB] grid place-items-center text-[#1A3263] font-extrabold text-[20px]">{a.name?.[0]}</div>}
             <div className="flex-1 min-w-0"><div className="font-bold text-[13px] text-[#1A3263]">{a.name}</div><div className="text-[11px] text-[#547792] mt-1">{a.designation} {a.company ? `• ${a.company}` : ''}</div></div>
             <button onClick={()=>handleDelete('alumni', a.id)} className="h-8 w-8 rounded-full border-2 border-[#E8E2DB] grid place-items-center shrink-0"><Trash2 size={12} /></button>
            </div>
           ))}
          </div>
         )}
        </div>
       </div>
      </div>
     )}

    {activeSection==='achievements' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Trophy className="text-[#FAB95B]" /> Student Achievements</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add student achievements with poster/photo images - website la KCE style image cards ah real-time show aagum</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
         <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><Plus size={16} /> Add Achievement</h4>
         <div className="mt-6 grid md:grid-cols-2 gap-5">
          <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Achievement Title *</label><input value={achievementForm.title} onChange={e=>setAchievementForm({...achievementForm, title: e.target.value})} placeholder="e.g. Won the 2026 Best AI Awards, Taipei" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] font-medium" /></div>
          <div className="md:col-span-2">
           <label className="text-[11px] font-bold uppercase text-[#1A3263]">Achievement Poster / Photo</label>
           <div className="mt-2 flex gap-2">
            <input value={achievementForm.image} onChange={e=>setAchievementForm({...achievementForm, image: e.target.value})} placeholder="Poster image URL" className="flex-1 h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
            <label className="h-12 px-4 rounded-[12px] bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1 cursor-pointer"><Upload size={12} /> Upload<input type="file" accept="image/*" className="hidden" onChange={handleAchievementImageUpload} /></label>
           </div>
           {achievementForm.image && <img src={achievementForm.image} className="mt-3 h-40 w-full rounded-[12px] object-cover border-2 border-[#E8E2DB]" alt="Achievement" />}
          </div>
          <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Details</label><textarea value={achievementForm.description} onChange={e=>setAchievementForm({...achievementForm, description: e.target.value})} placeholder="What students achieved, where, when..." rows={3} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y" /></div>
         </div>
         <button onClick={handleSaveAchievement} className="mt-6 h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] flex items-center gap-2"><Plus size={16} /> Add Achievement</button>
        </div>

        <div className="mt-8">
         <h4 className="font-bold text-[#1A3263]">Achievements - {(customData.achievements||[]).length}</h4>
         {(customData.achievements||[]).length===0 ? (
          <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed"><div className="text-3xl"></div><div className="font-bold text-[#1A3263] mt-3">No achievements added yet</div></div>
         ) : (
          <div className="mt-4 grid md:grid-cols-2 gap-4">
           {(customData.achievements||[]).map(a=>(
            <div key={a.id} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] overflow-hidden">
             {a.image && <img src={a.image} className="h-[120px] w-full object-cover" alt={a.title} />}
             <div className="p-4 flex justify-between gap-3"><div className="flex-1 min-w-0"><div className="font-bold text-[13px] text-[#1A3263]">{a.title}</div><div className="text-[11px] text-[#547792] mt-1">{a.description?.slice(0,100)}</div></div><button onClick={()=>handleDelete('achievements', a.id)} className="h-8 w-8 rounded-full border-2 border-[#E8E2DB] grid place-items-center shrink-0"><Trash2 size={12} /></button></div>
            </div>
           ))}
          </div>
         )}
        </div>
       </div>
      </div>
     )}

    {activeSection==='events' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Calendar className="text-[#FAB95B]" /> Events - 5 Categories with Images</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add events category-wise: Cultural / Arts, Technical / Academic, Sports, College / Student, Social / Awareness - images odd pantra mathiri, details neenga odd pannalam</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
         <h4 className="font-display text-[18px] font-bold text-[#1A3263] flex items-center gap-2"><Plus size={18} /> Add New Event - Category + Image</h4>
         <div className="mt-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
           <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Event Title *</label><input value={eventForm.title} onChange={e=>setEventForm({...eventForm, title: e.target.value})} placeholder="e.g. College Day 2026, Teachers Day, Pongal Celebration" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[14px] font-medium" /></div>
           <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Date</label><input value={eventForm.date} onChange={e=>setEventForm({...eventForm, date: e.target.value})} placeholder="e.g. 2026-03-15" className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
           <div>
            <label className="text-[11px] font-bold uppercase text-[#1A3263]">Category * - 5 Types</label>
            <select value={eventForm.category} onChange={e=>setEventForm({...eventForm, category: e.target.value})} className="mt-2 w-full h-12 px-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] font-bold text-[#1A3263]">
              <option>Cultural / Arts Events</option>
              <option>Technical / Academic Events</option>
              <option>Sports Events</option>
              <option>College / Student Events</option>
              <option>Social / Awareness Events</option>
            </select>
            <div className="text-[10px] text-[#547792] mt-1">College Day, Teachers Day, etc category-wise</div>
           </div>
           <div>
            <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><ImageIcon size={12} className="text-[#FAB95B]" /> Event Image - Upload or URL</label>
            <div className="mt-2 flex gap-2">
             <input value={eventForm.image} onChange={e=>setEventForm({...eventForm, image: e.target.value})} placeholder="Paste image URL or upload" className="flex-1 h-12 px-4 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
             <label className="h-12 px-4 rounded-[12px] bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"><Upload size={12} /> Upload<input type="file" accept="image/*" className="hidden" onChange={handleEventImageUpload} /></label>
            </div>
           </div>
           <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Description - Large Field - Details neenga odd pannalam</label><textarea value={eventForm.description} onChange={e=>setEventForm({...eventForm, description: e.target.value})} placeholder="Enter full details: chief guest, venue, time, schedule, participants, activities, registration link, contact...&#10;&#10;Example: College Day 2026 will be celebrated on March 15th at Main Auditorium. Chief Guest Dr. APJ... All students must attend... Cultural programs..." rows={6} className="mt-2 w-full p-5 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y leading-[1.7] min-h-[140px]" /></div>
           {eventForm.image && (
             <div className="md:col-span-2">
               <div className="rounded-[12px] overflow-hidden border-2 border-[#E8E2DB] bg-[#E8E2DB]/30 p-2">
                 <img src={eventForm.image} className="h-[200px] w-full rounded-[10px] object-cover" alt="Event preview" />
                 <div className="text-[11px] text-[#547792] mt-2 text-center">Preview - {eventForm.category} - will show on college website</div>
               </div>
             </div>
           )}
          </div>
         </div>
         <button onClick={handleAddEvent} className="mt-8 h-12 px-8 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center gap-2"><Plus size={18} /> Add Event - {eventForm.category}</button>
        </div>

        <div className="mt-8">
         <div className="flex flex-wrap items-center justify-between gap-3">
           <h4 className="font-bold text-[#1A3263]">Events - {(allCustomData.events||[]).length} Total</h4>
           <div className="flex flex-wrap gap-2">
             {['All','Cultural / Arts Events','Technical / Academic Events','Sports Events','College / Student Events','Social / Awareness Events'].map(cat=>(
               <button key={cat} onClick={()=>setEventCategoryFilter(cat)} className={`px-3 py-1 rounded-full text-[11px] font-bold border-2 transition-colors ${eventCategoryFilter===cat ? 'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]' : 'bg-white text-[#1A3263] border-[#E8E2DB] hover:border-[#FAB95B]'}`}>{cat==='All' ? `All ${(allCustomData.events||[]).length}` : cat.split(' ')[0]}</button>
             ))}
           </div>
         </div>

         {(allCustomData.events||[]).length===0 ? (
          <div className="mt-4 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed"><div className="text-3xl"></div><div className="font-bold text-[#1A3263] mt-3">No events added yet</div><div className="text-[12px] text-[#547792] mt-2">Add category-wise: Cultural, Technical, Sports, College Day, Social Awareness with images</div></div>
         ) : (
          <div className="mt-6 space-y-8">
            {['Cultural / Arts Events','Technical / Academic Events','Sports Events','College / Student Events','Social / Awareness Events'].filter(cat=> eventCategoryFilter==='All' || eventCategoryFilter===cat).map(category=>{
              const catEvents = (allCustomData.events||[]).filter(ev=> (ev.category||'Cultural / Arts Events')===category)
              if (catEvents.length===0) return null
              return (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-1 w-8 bg-[#FAB95B] rounded-full"></div>
                    <h5 className="font-bold text-[14px] text-[#1A3263]">{category} - {catEvents.length}</h5>
                    <div className="flex-1 h-[1px] bg-[#E8E2DB]"></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {catEvents.map(ev=>(
                      <div key={ev.id} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] overflow-hidden hover:border-[#FAB95B]/40 transition-colors">
                        {ev.image && <img src={ev.image} className="h-[160px] w-full object-cover" alt={ev.title} />}
                        <div className="p-4 flex justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[13px] text-[#1A3263]">{ev.title}</div>
                            <div className="mt-1 flex gap-1.5 flex-wrap"><span className="px-2 py-0.5 rounded-full bg-[#E8E2DB] text-[10px]">{ev.date}</span><span className="px-2 py-0.5 rounded-full bg-[#FAB95B]/20 text-[#1A3263] text-[10px] font-bold">{ev.category}</span></div>
                            <div className="text-[11px] text-[#547792] mt-2 line-clamp-3">{ev.description}</div>
                          </div>
                          <button onClick={()=>handleDelete('events', ev.id)} className="h-8 w-8 rounded-full border-2 border-[#E8E2DB] grid place-items-center shrink-0 hover:border-red-300 hover:text-red-600"><Trash2 size={12} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
         )}
        </div>
       </div>
      </div>
     )}

     {activeSection==='aboutpages' && (
       <AboutPagesAdmin collegeId={selectedCollegeId} customData={customData} setCustomData={setCustomData} fullCollege={currentCollege} />
     )}

     {activeSection==='homepage' && (
      <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
       <h3 className="font-bold text-[18px] text-[#1A3263]">Home Page Setup - KCE Layout Fields</h3>
       <p className="text-[12px] text-[#547792] mt-2 leading-relaxed">Intha fields fill pannunga - college website home page la (KCE layout la) idha exact-a varum. Empty fields hide aagum (empty-safe). Banner image = Branding tab-la irukka Hero Image.</p>
       <div className="mt-6 space-y-8">
        <div>
         <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">1</span> Header - TNEA Code</h4>
         <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">TNEA Code</label><input value={homeForm.tneaCode} onChange={e=>setHomeForm({...homeForm, tneaCode: e.target.value})} placeholder="e.g. 2710 (optional)" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
         </div>
        </div>
        <div>
         <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">2</span> Hero Banner - Event Details</h4>
         <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Event Date</label><input value={homeForm.eventDate} onChange={e=>setHomeForm({...homeForm, eventDate: e.target.value})} placeholder="e.g. 23 SEP 2026" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Event Time</label><input value={homeForm.eventTime} onChange={e=>setHomeForm({...homeForm, eventTime: e.target.value})} placeholder="e.g. 10:00 AM" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Chief Guest Name</label><input value={homeForm.chiefGuestName} onChange={e=>setHomeForm({...homeForm, chiefGuestName: e.target.value})} placeholder="e.g. Mr. Kishore Nair" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Chief Guest Designation</label><input value={homeForm.chiefGuestTitle} onChange={e=>setHomeForm({...homeForm, chiefGuestTitle: e.target.value})} placeholder="e.g. Project Manager, National Inc." className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Chief Guest Photo (URL)</label><input value={homeForm.chiefGuestPhoto} onChange={e=>setHomeForm({...homeForm, chiefGuestPhoto: e.target.value})} placeholder="https://... photo url" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Partner Logos (1 URL per line, max 6)</label><textarea value={homeForm.partnerLogos} onChange={e=>setHomeForm({...homeForm, partnerLogos: e.target.value})} rows={3} placeholder="https://... logo1\nhttps://... logo2" className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Coordinators (Name - Role, one per line)</label><textarea value={homeForm.coordinators} onChange={e=>setHomeForm({...homeForm, coordinators: e.target.value})} rows={3} placeholder="Dr. Priya Kalyanasundaram - Prof. / SoMS\nProf. S. R. Ramya - AP / SoMS" className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Convenors (Name - Role, one per line)</label><textarea value={homeForm.convenors} onChange={e=>setHomeForm({...homeForm, convenors: e.target.value})} rows={3} placeholder="Dr. P. Karthigaikumar - Principal\nDr. S. Sophia - Dean-Academics" className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
         </div>
        </div>
        <div>
         <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">3</span> Home Stats (hero strip + Placement section)</h4>
         <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Placements (e.g. 1544)</label><input value={homeForm.statPlacements} onChange={e=>setHomeForm({...homeForm, statPlacements: e.target.value})} placeholder="e.g. 1544" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Companies (e.g. 232)</label><input value={homeForm.statCompanies} onChange={e=>setHomeForm({...homeForm, statCompanies: e.target.value})} placeholder="e.g. 232" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Max Salary LPA (e.g. 43)</label><input value={homeForm.statMaxLpa} onChange={e=>setHomeForm({...homeForm, statMaxLpa: e.target.value})} placeholder="e.g. 43" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
         </div>
        </div>
        <div>
         <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">4</span> About Us Section</h4>
         <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">About Photo (URL) - right side image</label><input value={homeForm.aboutImage} onChange={e=>setHomeForm({...homeForm, aboutImage: e.target.value})} placeholder="https://... campus building photo" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Accreditation Badges (1 URL per line, max 8)</label><textarea value={homeForm.accreditationLogos} onChange={e=>setHomeForm({...homeForm, accreditationLogos: e.target.value})} rows={3} placeholder="https://... naac logo\nhttps://... nba logo" className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">UG Description (Programmes panel)</label><textarea value={homeForm.ugDesc} onChange={e=>setHomeForm({...homeForm, ugDesc: e.target.value})} rows={3} placeholder="Optional - default text will be used if empty" className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
          <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">PG Description (Programmes panel)</label><textarea value={homeForm.pgDesc} onChange={e=>setHomeForm({...homeForm, pgDesc: e.target.value})} rows={3} placeholder="Optional - default text will be used if empty" className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
         </div>
         <div className="mt-4"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Placement &amp; Training Description</label><textarea value={homeForm.placementText} onChange={e=>setHomeForm({...homeForm, placementText: e.target.value})} rows={2} placeholder="Optional - default text will be used if empty" className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
        </div>
        <div>
         <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">5</span> Industry Logos (max 54 - 9x6 grid)</h4>
         <div className="mt-4"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Company Logo URLs (1 per line)</label><textarea value={homeForm.industryLogos} onChange={e=>setHomeForm({...homeForm, industryLogos: e.target.value})} rows={4} placeholder="https://... company1 logo\nhttps://... company2 logo (empty = company names from Placements section will show)" className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
        </div>
        <div>
         <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">6</span> Footer About Text</h4>
         <div className="mt-4"><textarea value={homeForm.footerAbout} onChange={e=>setHomeForm({...homeForm, footerAbout: e.target.value})} rows={3} placeholder="Optional - default: AICTE approval + affiliation + accreditation + ISO lines" className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-none" /></div>
        </div>
       </div>
       <div className="mt-8 pt-6 border-t-2 border-[#E8E2DB]">
        <button onClick={handleSaveHome} className="h-12 px-8 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px]">Save Home Page Setup - Real-time Update</button>
       </div>
      </div>
    )}

    {activeSection==='announcements' && (
      <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
       <h3 className="font-bold text-[18px] text-[#1A3263]">Announcements</h3>
       <div className="mt-6 rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-5">
        <div className="grid md:grid-cols-2 gap-4">
         <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Title *</label><input value={announcementForm.title} onChange={e=>setAnnouncementForm({...announcementForm, title: e.target.value})} placeholder="Announcement title" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
         <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Date</label><input value={announcementForm.date} onChange={e=>setAnnouncementForm({...announcementForm, date: e.target.value})} placeholder="Date" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px]" /></div>
         <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Description</label><textarea value={announcementForm.description} onChange={e=>setAnnouncementForm({...announcementForm, description: e.target.value})} placeholder="Announcement details" rows={2} className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] outline-none text-[13px] resize-none" /></div>
        </div>
        <button onClick={handleAddAnnouncement} className="mt-4 h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">Add Announcement</button>
       </div>
       <div className="mt-6 space-y-3">
        {(allCustomData.announcements||[]).map(an=>(
         <div key={an.id} className="rounded-[12px] border-2 border-[#E8E2DB] p-4 flex justify-between"><div><div className="font-bold text-[13px] text-[#1A3263]">{an.title}</div><div className="text-[11px] text-[#547792]">{an.date} • {an.description?.slice(0,80)}</div></div><button onClick={()=>handleDelete('announcements', an.id)} className="h-8 w-8 rounded-full border-2 border-[#E8E2DB] grid place-items-center"><Trash2 size={12} /></button></div>
        ))}
       </div>
      </div>
     )}

     {activeSection==='admissions' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><FileCheck className="text-[#FAB95B]" /> Admissions - Real-Time Working</h3>
            <p className="text-[12px] text-[#547792] mt-2">Add admission details - open/close status, dates, eligibility, process, fees, documents, cutoff - website la real-time update aagum</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${admissionForm.status==='Open' ? 'bg-green-100 text-green-700 border border-green-200' : admissionForm.status==='Closed' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-[#FAB95B]/20 text-[#1A3263] border border-[#FAB95B]/30'}`}>{admissionForm.status} • {admissionForm.academicYear}</span>
          </div>
        </div>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm space-y-8">
          <div>
            <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">1</span> Basic Info - Status & Title</h4>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Admission Status *</label><select value={admissionForm.status} onChange={e=>setAdmissionForm({...admissionForm, status: e.target.value})} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] font-bold"><option>Open</option><option>Closed</option><option>Upcoming</option></select></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Academic Year *</label><input value={admissionForm.academicYear} onChange={e=>setAdmissionForm({...admissionForm, academicYear: e.target.value})} placeholder="e.g. 2026-27" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Total Seats</label><input value={admissionForm.totalSeats} onChange={e=>setAdmissionForm({...admissionForm, totalSeats: e.target.value})} placeholder="e.g. 1200 Seats" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div className="md:col-span-3"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Admission Title *</label><input value={admissionForm.title} onChange={e=>setAdmissionForm({...admissionForm, title: e.target.value})} placeholder="e.g. Admissions Open 2026-27 - B.E / B.Tech / MBA / MCA" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[13px] font-bold" /></div>
              <div className="md:col-span-3"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Description - Large - College details</label><textarea value={admissionForm.description} onChange={e=>setAdmissionForm({...admissionForm, description: e.target.value})} placeholder="Enter full admission description: about admission, why join your college, highlights, NAAC grade, placements..." rows={5} className="mt-2 w-full p-4 rounded-[14px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] leading-[1.7] min-h-[120px] resize-y" /></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#FAB95B] text-[#1A3263] grid place-items-center text-[12px]">2</span> Important Dates - Real-time</h4>
            <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Application Start</label><input value={admissionForm.applicationStart} onChange={e=>setAdmissionForm({...admissionForm, applicationStart: e.target.value})} placeholder="e.g. 2026-03-01" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Application End</label><input value={admissionForm.applicationEnd} onChange={e=>setAdmissionForm({...admissionForm, applicationEnd: e.target.value})} placeholder="e.g. 2026-05-30" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Counselling Date</label><input value={admissionForm.counsellingDate} onChange={e=>setAdmissionForm({...admissionForm, counsellingDate: e.target.value})} placeholder="e.g. 2026-06-15" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Last Date</label><input value={admissionForm.lastDate} onChange={e=>setAdmissionForm({...admissionForm, lastDate: e.target.value})} placeholder="e.g. 2026-07-31" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#547792] text-white grid place-items-center text-[12px]">3</span> Eligibility, Process, Entrance, Cutoff</h4>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Eligibility Criteria</label><textarea value={admissionForm.eligibility} onChange={e=>setAdmissionForm({...admissionForm, eligibility: e.target.value})} placeholder="e.g. 10+2 with 50% PCM for B.E, Graduation 50% for MBA..." rows={4} className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Admission Process - Step by Step</label><textarea value={admissionForm.process} onChange={e=>setAdmissionForm({...admissionForm, process: e.target.value})} placeholder="1. Fill online application&#10;2. Submit documents&#10;3. Entrance / Merit&#10;4. Counselling&#10;5. Fee payment..." rows={4} className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Entrance Exam</label><input value={admissionForm.entranceExam} onChange={e=>setAdmissionForm({...admissionForm, entranceExam: e.target.value})} placeholder="e.g. TNEA / TANCET / JEE / Management Quota" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Cutoff Details</label><input value={admissionForm.cutoff} onChange={e=>setAdmissionForm({...admissionForm, cutoff: e.target.value})} placeholder="e.g. Cutoff 170+ for CSE, 160+ for ECE..." className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Fees Structure</label><input value={admissionForm.fees} onChange={e=>setAdmissionForm({...admissionForm, fees: e.target.value})} placeholder="e.g. 85,000 per year + hostel, scholarship available" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Quota Details</label><input value={admissionForm.quota} onChange={e=>setAdmissionForm({...admissionForm, quota: e.target.value})} placeholder="e.g. Govt 65% / Management 35%, SC/ST, BC/MBC reservation" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">4</span> Documents, Scholarships, Contact & Links</h4>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Documents Required - bullet list</label><textarea value={admissionForm.documents} onChange={e=>setAdmissionForm({...admissionForm, documents: e.target.value})} placeholder="• 10th Marksheet&#10;• 12th Marksheet&#10;• TC&#10;• Community Certificate&#10;• Aadhar&#10;• Photos..." rows={5} className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Scholarships Available</label><textarea value={admissionForm.scholarships} onChange={e=>setAdmissionForm({...admissionForm, scholarships: e.target.value})} placeholder="• Merit Scholarship&#10;• SC/ST Scholarship&#10;• First Graduate&#10;• Sports Quota..." rows={5} className="mt-2 w-full p-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px] resize-y" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Application Link (URL)</label><input value={admissionForm.applicationLink} onChange={e=>setAdmissionForm({...admissionForm, applicationLink: e.target.value})} placeholder="https://yourcollege.edu/admissions/apply" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Contact Phone</label><input value={admissionForm.contactPhone} onChange={e=>setAdmissionForm({...admissionForm, contactPhone: e.target.value})} placeholder="e.g. 0422-257 1234" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Contact Email</label><input value={admissionForm.contactEmail} onChange={e=>setAdmissionForm({...admissionForm, contactEmail: e.target.value})} placeholder="admissions@college.edu" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><ImageIcon size={12} className="text-[#FAB95B]" /> Brochure Image - Upload or URL</label>
                <div className="mt-2 flex gap-2">
                  <input value={admissionForm.brochureImage} onChange={e=>setAdmissionForm({...admissionForm, brochureImage: e.target.value})} placeholder="Paste brochure image URL or upload" className="flex-1 h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" />
                  <label className="h-11 px-4 rounded-[12px] bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1.5 cursor-pointer"><Upload size={12} /> Upload<input type="file" accept="image/*" className="hidden" onChange={handleAdmissionBrochureUpload} /></label>
                </div>
              </div>
              {admissionForm.brochureImage && (
                <div className="md:col-span-2">
                  <div className="rounded-[12px] overflow-hidden border-2 border-[#E8E2DB] bg-[#E8E2DB]/30 p-2">
                    <img src={admissionForm.brochureImage} className="h-[200px] w-full rounded-[10px] object-cover" alt="Brochure preview" />
                    <div className="text-[11px] text-[#547792] mt-2 text-center">Brochure preview - will show on website</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button onClick={handleSaveAdmissions} className="h-12 px-8 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center gap-2"><Save size={18} /> Save Admissions - Real-time Website Update</button>

          {customData.admissions && (
            <div className="mt-6 rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-5">
              <div className="font-bold text-[#1A3263] text-[13px]">Current Saved - {customData.admissions.title} • {customData.admissions.status} • {customData.admissions.academicYear}</div>
              <div className="text-[11px] text-[#547792] mt-1">Real-time la college website la theriyum - students can see admissions open</div>
            </div>
          )}
        </div>
       </div>
      </div>
     )}

     {activeSection==='contact' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Contact className="text-[#FAB95B]" /> Contact - Real-Time Working</h3>
        <p className="text-[12px] text-[#547792] mt-2">Add contact details - address, phone, email, office hours, map link, enquiry - website Contact section la real-time update aagum</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm space-y-8">
          <div>
            <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">1</span> Address & Location</h4>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Full Address *</label><input value={contactForm.address} onChange={e=>setContactForm({...contactForm, address: e.target.value})} placeholder="e.g. Peelamedu, Coimbatore - Main Campus Road" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">City</label><input value={contactForm.city} onChange={e=>setContactForm({...contactForm, city: e.target.value})} placeholder="e.g. Coimbatore" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">District</label><input value={contactForm.district} onChange={e=>setContactForm({...contactForm, district: e.target.value})} placeholder="e.g. Coimbatore" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Pincode</label><input value={contactForm.pincode} onChange={e=>setContactForm({...contactForm, pincode: e.target.value})} placeholder="e.g. 641004" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Google Map Link</label><input value={contactForm.mapLink} onChange={e=>setContactForm({...contactForm, mapLink: e.target.value})} placeholder="https://maps.google.com/?q=your college" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#FAB95B] text-[#1A3263] grid place-items-center text-[12px]">2</span> Phone & Email</h4>
            <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Phone *</label><input value={contactForm.phone} onChange={e=>setContactForm({...contactForm, phone: e.target.value})} placeholder="e.g. 0422-257 1234" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Phone 2</label><input value={contactForm.phone2} onChange={e=>setContactForm({...contactForm, phone2: e.target.value})} placeholder="e.g. 0422-257 5678" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Toll Free</label><input value={contactForm.tollFree} onChange={e=>setContactForm({...contactForm, tollFree: e.target.value})} placeholder="e.g. 1800-123-4567" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Email *</label><input value={contactForm.email} onChange={e=>setContactForm({...contactForm, email: e.target.value})} placeholder="info@college.edu" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Admissions Email</label><input value={contactForm.admissionsEmail} onChange={e=>setContactForm({...contactForm, admissionsEmail: e.target.value})} placeholder="admissions@college.edu" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Website</label><input value={contactForm.website} onChange={e=>setContactForm({...contactForm, website: e.target.value})} placeholder="https://yourcollege.edu" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Fax</label><input value={contactForm.fax} onChange={e=>setContactForm({...contactForm, fax: e.target.value})} placeholder="e.g. 0422-257 3833" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#547792] text-white grid place-items-center text-[12px]">3</span> Office Hours & Enquiry</h4>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Office Hours</label><input value={contactForm.officeHours} onChange={e=>setContactForm({...contactForm, officeHours: e.target.value})} placeholder="e.g. Mon-Sat 9AM-5PM" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Support Hours</label><input value={contactForm.supportHours} onChange={e=>setContactForm({...contactForm, supportHours: e.target.value})} placeholder="e.g. 24/7 Enquiry Support" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Contact Person</label><input value={contactForm.contactPerson} onChange={e=>setContactForm({...contactForm, contactPerson: e.target.value})} placeholder="e.g. Dr. Admin Officer" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Designation</label><input value={contactForm.contactDesignation} onChange={e=>setContactForm({...contactForm, contactDesignation: e.target.value})} placeholder="e.g. Administrative Officer" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Contact Person Phone</label><input value={contactForm.contactPhone} onChange={e=>setContactForm({...contactForm, contactPhone: e.target.value})} placeholder="e.g. 98765 43210" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Enquiry Phone</label><input value={contactForm.enquiryPhone} onChange={e=>setContactForm({...contactForm, enquiryPhone: e.target.value})} placeholder="e.g. 0422-434 1234" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Enquiry Email</label><input value={contactForm.enquiryEmail} onChange={e=>setContactForm({...contactForm, enquiryEmail: e.target.value})} placeholder="enquiry@college.edu" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
            </div>
          </div>

          <button onClick={handleSaveContact} className="h-12 px-8 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center gap-2"><Save size={18} /> Save Contact - Real-time Website Update</button>

          {customData.contactDetails && (
            <div className="mt-6 rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-5">
              <div className="font-bold text-[#1A3263] text-[13px]">Current Saved - {customData.contactDetails.phone} • {customData.contactDetails.email}</div>
              <div className="text-[11px] text-[#547792] mt-1">Real-time la college website Contact section la theriyum</div>
            </div>
          )}
        </div>
       </div>
      </div>
     )}

     {activeSection==='settings' && (
      <div className="space-y-6">
       <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
        <h3 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Settings className="text-[#FAB95B]" /> Settings - Real-Time Working</h3>
        <p className="text-[12px] text-[#547792] mt-2">Manage college profile, website settings, verification status - real-time update aagum</p>

        <div className="mt-8 rounded-[20px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm space-y-8">
          <div className="rounded-[16px] bg-[#1A3263] text-white p-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-bold text-[#FAB95B] text-[14px]">College ID {college.id} • {settingsForm.verificationStatus}</div>
              <div className="text-[12px] text-[#E8E2DB]/70 mt-1">Profile completion real-time tracking</div>
            </div>
            <div className="px-4 py-2 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[12px]">{settingsForm.verificationStatus} • Est. {settingsForm.established}</div>
          </div>

          <div>
            <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">1</span> College Profile - Basic Info</h4>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">College Name *</label><input value={settingsForm.name} onChange={e=>setSettingsForm({...settingsForm, name: e.target.value})} placeholder="Your College Name" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] focus:border-[#FAB95B] focus:bg-white outline-none text-[13px] font-bold" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Short Name</label><input value={settingsForm.shortName} onChange={e=>setSettingsForm({...settingsForm, shortName: e.target.value})} placeholder="e.g. PSG Tech" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Established Year</label><input value={settingsForm.established} onChange={e=>setSettingsForm({...settingsForm, established: e.target.value})} placeholder="e.g. 1951" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Tagline</label><input value={settingsForm.tagline} onChange={e=>setSettingsForm({...settingsForm, tagline: e.target.value})} placeholder="Excellence in Education" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">College Type</label><select value={settingsForm.type} onChange={e=>setSettingsForm({...settingsForm, type: e.target.value})} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]"><option>Engineering</option><option>Arts & Science</option><option>Medical</option><option>Management</option><option>Polytechnic</option><option>University</option><option>Other</option></select></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Management Type</label><select value={settingsForm.collegeType} onChange={e=>setSettingsForm({...settingsForm, collegeType: e.target.value})} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]"><option>Private</option><option>Government</option><option>Government Aided</option><option>Deemed University</option><option>Autonomous</option></select></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">University / Affiliation</label><input value={settingsForm.university} onChange={e=>setSettingsForm({...settingsForm, university: e.target.value})} placeholder="e.g. Anna University" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Accreditation</label><input value={settingsForm.accreditation} onChange={e=>setSettingsForm({...settingsForm, accreditation: e.target.value})} placeholder="e.g. NAAC A++ • NBA Accredited" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#FAB95B] text-[#1A3263] grid place-items-center text-[12px]">2</span> Contact & Website</h4>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Official Email</label><input value={settingsForm.email} onChange={e=>setSettingsForm({...settingsForm, email: e.target.value})} placeholder="info@college.edu" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Phone</label><input value={settingsForm.phone} onChange={e=>setSettingsForm({...settingsForm, phone: e.target.value})} placeholder="0422-257 1234" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div className="md:col-span-2"><label className="text-[11px] font-bold uppercase text-[#1A3263]">Website URL</label><input value={settingsForm.website} onChange={e=>setSettingsForm({...settingsForm, website: e.target.value})} placeholder="https://yourcollege.edu" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#547792] text-white grid place-items-center text-[12px]">3</span> Website Display Settings</h4>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <label className="flex items-center justify-between p-4 rounded-[12px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] cursor-pointer">
                <div><div className="font-bold text-[12px] text-[#1A3263]">Show Admissions</div><div className="text-[11px] text-[#547792]">Display admissions section</div></div>
                <input type="checkbox" checked={settingsForm.showAdmissions} onChange={e=>setSettingsForm({...settingsForm, showAdmissions: e.target.checked})} className="h-5 w-5 accent-[#1A3263]" />
              </label>
              <label className="flex items-center justify-between p-4 rounded-[12px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] cursor-pointer">
                <div><div className="font-bold text-[12px] text-[#1A3263]">Show Placements</div><div className="text-[11px] text-[#547792]">Display placements</div></div>
                <input type="checkbox" checked={settingsForm.showPlacements} onChange={e=>setSettingsForm({...settingsForm, showPlacements: e.target.checked})} className="h-5 w-5 accent-[#1A3263]" />
              </label>
              <label className="flex items-center justify-between p-4 rounded-[12px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] cursor-pointer">
                <div><div className="font-bold text-[12px] text-[#1A3263]">Show Events</div><div className="text-[11px] text-[#547792]">Display events</div></div>
                <input type="checkbox" checked={settingsForm.showEvents} onChange={e=>setSettingsForm({...settingsForm, showEvents: e.target.checked})} className="h-5 w-5 accent-[#1A3263]" />
              </label>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">4</span> Login Credentials - Username & Password</h4>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Login Username</label><input value={settingsForm.loginUsername} onChange={e=>setSettingsForm({...settingsForm, loginUsername: e.target.value})} placeholder="e.g. thiagarajar_admin" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
              <div><label className="text-[11px] font-bold uppercase text-[#1A3263]">Login Password</label><input value={settingsForm.loginPassword} onChange={e=>setSettingsForm({...settingsForm, loginPassword: e.target.value})} placeholder="Create / change password" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#FAB95B] outline-none text-[13px]" /></div>
            </div>
            <div className="mt-3 text-[11px] text-[#547792]">Save panna Login page la idha username + password la login aagum. College email um username-oda oru oru login ku work aagum.</div>
          </div>

          <button onClick={handleSaveSettings} className="h-12 px-8 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center gap-2"><Save size={18} /> Save Settings - Real-time Website Update</button>
        </div>
       </div>
      </div>
     )}

     {!['dashboard','branding','departments','courses','facilities','placements','examinations','gallery','hostel','about','analytics','management','principal','research','accreditation','campus','library','sports','alumni','achievements','events','announcements','admissions','contact','settings'].includes(activeSection) && (
      <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-12 text-center">
       <div className="h-16 w-16 rounded-[20px] bg-[#E8E2DB] border-2 border-[#E8E2DB] grid place-items-center mx-auto text-2xl"></div>
       <h3 className="font-bold text-[18px] mt-6 capitalize text-[#1A3263]">{activeSection} - Coming Soon - Your Own {activeSection}</h3>
       <p className="text-[13px] text-[#547792] mt-3 max-w-[600px] mx-auto leading-[1.6]">
        This section is for your college - {college.name} - ID {college.id}. Add your {activeSection} information.
       </p>
       <div className="mt-6 flex justify-center gap-2">
        <button className="h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[13px] font-bold">College ID {college.id}</button>
       </div>
      </div>
     )}
    </div>
   </div>
  </div>
 )
}
