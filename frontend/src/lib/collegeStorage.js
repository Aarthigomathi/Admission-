import { colleges as staticColleges } from './colleges'

// Manage custom colleges registered via signup - their own data
// Automatic default college name kattama - only colleges that signup themselves show in public

const REGISTERED_KEY = 'tn_registered_colleges'
const COLLEGE_DATA_PREFIX = 'tn_college_data_'

export function getRegisteredColleges() {
  try {
    return JSON.parse(localStorage.getItem(REGISTERED_KEY) || '[]')
  } catch { return [] }
}

export function getPublicColleges() {
  // ONLY colleges that signed up via CollegeSignup - no default PSG etc
  const registered = getRegisteredColleges()
  return registered.map(c => enrichCollege(c))
}

export function getAllCollegesMerged() {
  // For admin & backwards compatibility - includes static + registered
  const registered = getRegisteredColleges()
  const map = new Map()
  staticColleges.forEach(c => map.set(c.id, enrichCollege(c)))
  registered.forEach(c => {
    map.set(c.id, enrichCollege(c))
  })
  return Array.from(map.values())
}

export function getAllCollegesForAdmin() {
  return getAllCollegesMerged()
}

export function getCollegeById(id) {
  // First check public (registered), then all
  const pub = getPublicColleges().find(c => String(c.id) === String(id))
  if (pub) return pub
  const all = getAllCollegesMerged()
  return all.find(c => String(c.id) === String(id))
}

export function getCollegeBySlug(slug) {
  const pub = getPublicColleges().find(c => c.slug === slug)
  if (pub) return pub
  const all = getAllCollegesMerged()
  return all.find(c => c.slug === slug)
}

export function enrichCollege(base) {
  const now = new Date().toISOString()
  // base may already be enriched, keep its data
  return {
    id: base.id,
    slug: base.slug || base.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0,50) || `college-${base.id}`,
    name: base.name || 'Unnamed College',
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
    updatedAt: base.updatedAt || now,
    branding: base.branding || {
      logo: '',
      heroImage: '',
      coverImage: '',
      colors: { primary: '#1A3263', secondary: '#547792', accent: '#FAB95B' },
      preset: 'engineering_blue'
    },
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
    quickInfo: base.quickInfo || { courses: (base.courses||[]).length, departments: (base.departments||[]).length, placement: 'N/A', campus: `${base.district}` },
    contact: base.contact || { phone: base.phone || '', email: base.email || '', address: `${base.address}, ${base.city}, ${base.district}` },
  }
}

export function saveCollegeData(collegeId, section, data) {
  const key = `${COLLEGE_DATA_PREFIX}${collegeId}`
  let existing = {}
  try { existing = JSON.parse(localStorage.getItem(key) || '{}') } catch {}
  existing[section] = data
  existing.updatedAt = new Date().toISOString()
  localStorage.setItem(key, JSON.stringify(existing))
  
  // Also update registered colleges list
  const registered = getRegisteredColleges()
  const idx = registered.findIndex(c => String(c.id) === String(collegeId))
  if (idx >= 0) {
    registered[idx] = { ...registered[idx], ...existing, id: collegeId, updatedAt: existing.updatedAt }
    // Ensure slug preserved
    if (!registered[idx].slug) registered[idx].slug = registered[idx].name?.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered))
  }
  // Notify
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('collegeRegistered'))
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
    tagline: `${formData.collegeName} - Excellence in Education`,
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
    established: Number(formData.establishedYear) || new Date().getFullYear(),
    principalName: formData.principalName,
    verificationStatus: 'PENDING',
    verified: false,
    role: 'COLLEGE_ADMIN',
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
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('collegeRegistered'))
  }
  return college
}

export function getProfileCompletion(college) {
  const custom = getCollegeCustomData(college.id)
  const checks = [
    !!college.branding?.logo || !!custom.branding?.logo,
    !!college.branding?.heroImage || !!custom.branding?.heroImage,
    !!custom.about?.fullText || !!college.about?.fullText,
    (custom.departments?.length > 0) || (college.departments?.length > 0),
    (custom.courses?.length > 0) || (college.courses?.length > 0),
    (custom.customFacilities?.length > 0),
    (custom.placements?.length > 0),
    (custom.events?.length > 0),
    (custom.gallery?.length > 0),
    !!college.principalName,
  ]
  const filled = checks.filter(Boolean).length
  return Math.round((filled / checks.length) * 100)
}
