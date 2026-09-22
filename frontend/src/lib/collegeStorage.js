import { colleges as staticColleges } from './colleges'

// Manage custom colleges registered via signup - their own data, not PSG
// UI frame is platform's, content is college's own - A to Z they add themselves

const REGISTERED_KEY = 'tn_registered_colleges'
const COLLEGE_DATA_PREFIX = 'tn_college_data_'

export function getRegisteredColleges() {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_KEY) || '[]')
  } catch { return [] }
}

export function getAllCollegesMerged() {
  const registered = getRegisteredColleges()
  // Merge static + registered, registered overrides if same id
  const map = new Map()
  staticColleges.forEach(c => map.set(c.id, c))
  registered.forEach(c => {
    // Ensure registered college has full structure with empty sections
    const existing = map.get(c.id)
    if (existing) {
      map.set(c.id, { ...existing, ...c })
    } else {
      map.set(c.id, enrichCollege(c))
    }
  })
  return Array.from(map.values())
}

export function getCollegeById(id) {
  const all = getAllCollegesMerged()
  return all.find(c => String(c.id) === String(id))
}

export function getCollegeBySlug(slug) {
  const all = getAllCollegesMerged()
  return all.find(c => c.slug === slug)
}

export function enrichCollege(base) {
  // Ensure every college has all A-Z sections empty ready for college to fill
  // Platform UI frame only, content college adds
  const now = new Date().toISOString()
  return {
    id: base.id,
    slug: base.slug || base.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `college-${base.id}`,
    name: base.name,
    shortName: base.shortName || base.name?.split(' ').slice(0,3).join(' ') || 'College',
    tagline: base.tagline || '',
    type: base.type || base.collegeType || 'Engineering',
    collegeType: base.collegeType || base.type || 'Private',
    district: base.district || 'Coimbatore',
    city: base.city || '',
    address: base.address || '',
    pincode: base.pincode || '',
    phone: base.phone || '',
    email: base.email || '',
    website: base.website || '',
    affiliation: base.affiliation || base.university || 'Anna University',
    university: base.university || base.affiliation || 'Anna University',
    accreditation: base.accreditation || '',
    established: base.established || new Date().getFullYear(),
    principalName: base.principalName || '',
    principal: base.principal || null,
    management: base.management || [],
    verificationStatus: base.verificationStatus || 'PENDING',
    verified: base.verified || false,
    active: true,
    createdAt: base.createdAt || now,
    updatedAt: now,
    // Branding - college can add logo, hero image, colors
    branding: base.branding || {
      logo: '',
      heroImage: '',
      coverImage: '',
      colors: { primary: '#1A3263', secondary: '#547792', accent: '#FAB95B' },
      preset: 'engineering_blue'
    },
    // A-Z sections - all empty initially, college adds themselves
    about: base.about || { fullText: '', vision: '', mission: [] },
    departments: base.departments || [],
    courses: base.courses || [],
    facilities: base.facilities || {},
    customFacilities: base.customFacilities || [],
    hostels: base.hostels || [],
    placements: base.placements || [],
    events: base.events || [],
    announcements: base.announcements || [],
    gallery: base.gallery || [],
    documents: base.documents || [],
    contacts: base.contacts || [],
    faculty: base.faculty || [],
    research: base.research || [],
    accreditations: base.accreditations || [],
    library: base.library || null,
    sports: base.sports || null,
    campus: base.campus || null,
    admissions: base.admissions || null,
    examinations: base.examinations || null,
    // For static colleges compatibility
    ...base,
  }
}

export function saveCollegeData(collegeId, section, data) {
  const key = `${COLLEGE_DATA_PREFIX}${collegeId}`
  const existing = JSON.parse(localStorage.getItem(key) || '{}')
  existing[section] = data
  existing.updatedAt = new Date().toISOString()
  localStorage.setItem(key, JSON.stringify(existing))
  
  // Also update registered colleges list if needed
  const registered = getRegisteredColleges()
  const idx = registered.findIndex(c => String(c.id) === String(collegeId))
  if (idx >= 0) {
    registered[idx] = { ...registered[idx], ...existing, id: collegeId }
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered))
  }
  return existing
}

export function getCollegeCustomData(collegeId) {
  const key = `${COLLEGE_DATA_PREFIX}${collegeId}`
  try {
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch { return {} }
}

export function createNewCollegeFromSignup(formData) {
  const id = Date.now()
  const slug = formData.collegeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0,50) + '-' + id.toString().slice(-4)
  const college = {
    id,
    slug,
    name: formData.collegeName,
    shortName: formData.collegeName.split(' ').slice(0,3).join(' '),
    tagline: '',
    email: formData.email,
    phone: formData.phone,
    website: formData.website,
    address: formData.address,
    district: formData.district,
    city: formData.city,
    pincode: formData.pincode,
    type: formData.collegeType,
    collegeType: formData.collegeType,
    affiliation: formData.university,
    university: formData.university,
    established: Number(formData.establishedYear),
    principalName: formData.principalName,
    verificationStatus: 'PENDING',
    verified: false,
    role: 'COLLEGE_ADMIN',
    // Empty A-Z - college will add themselves
    branding: {
      logo: '',
      heroImage: '',
      coverImage: '',
      colors: { primary: '#1A3263', secondary: '#547792', accent: '#FAB95B' },
      preset: 'engineering_blue'
    },
    about: { fullText: '', vision: '', mission: [] },
    departments: [],
    courses: [],
    facilities: {},
    customFacilities: [],
    hostels: [],
    placements: [],
    events: [],
    announcements: [],
    gallery: [],
    documents: [],
    contacts: [],
    faculty: [],
    research: [],
    accreditations: [],
    management: [],
    createdAt: new Date().toISOString()
  }
  const colleges = getRegisteredColleges()
  colleges.push(college)
  localStorage.setItem(REGISTERED_KEY, JSON.stringify(colleges))
  localStorage.setItem('tn_current_college', JSON.stringify(college))
  // Initialize empty custom data
  localStorage.setItem(`${COLLEGE_DATA_PREFIX}${id}`, JSON.stringify({
    branding: college.branding,
    about: college.about,
    departments: [],
    courses: [],
    customFacilities: [],
    hostels: [],
    placements: [],
    events: [],
    gallery: [],
    announcements: [],
    contacts: [],
    management: [],
    accreditations: [],
    research: []
  }))
  return college
}

export function getProfileCompletion(college) {
  const custom = getCollegeCustomData(college.id)
  const checks = [
    !!college.branding?.logo || !!custom.branding?.logo,
    !!college.branding?.heroImage || !!custom.branding?.heroImage,
    !!college.about?.fullText || !!custom.about?.fullText || (custom.about && custom.about.fullText),
    (college.departments?.length > 0) || (custom.departments?.length > 0),
    (college.courses?.length > 0) || (custom.courses?.length > 0),
    (college.customFacilities?.length > 0) || (custom.customFacilities?.length > 0),
    (college.placements?.length > 0) || (custom.placements?.length > 0),
    (college.events?.length > 0) || (custom.events?.length > 0),
    (college.gallery?.length > 0) || (custom.gallery?.length > 0),
    !!college.principalName,
  ]
  const filled = checks.filter(Boolean).length
  return Math.round((filled / checks.length) * 100)
}
