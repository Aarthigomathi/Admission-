/**
 * Smart College Recommender - "Why this college is shown"
 * ========================================================
 * Scores every college against the student profile and returns a ranked list
 * with human-readable reasons (marks vs cutoff, district, course/stream match,
 * college type, verification, hostel need).
 *
 * Cutoffs are DEMO estimates (TNEA-style typical qualifying percentages).
 * When the backend exposes real cutoff data, replace getCutoffEstimate().
 */

// Typical cutoff % by college slug - demo estimates for the backend-cloned colleges
const DEMO_CUTOFFS = {
  'psg-tech': 85,
  'cit-coimbatore': 80,
  'kumaraguru-college': 75,
  'thiyagarajar-engineering': 78,
}

/** Typical qualifying percentage for a college (demo estimate) */
export function getCutoffEstimate(college) {
  if (DEMO_CUTOFFS[college.slug] != null) return DEMO_CUTOFFS[college.slug]
  // Heuristic fallback: NIRF rank inside the accreditation string
  const nirf = /NIRF\s*(\d+)/i.exec(college.accreditation || '')
  if (nirf) {
    const rank = parseInt(nirf[1], 10)
    if (rank <= 50) return 88
    if (rank <= 100) return 82
    if (rank <= 200) return 76
  }
  return 70
}

// Weights (sum = 100 -> natural match percentage)
const WEIGHTS = {
  course: 35,
  district: 25,
  homeDistrict: 15,
  marks: 20,
  type: 10,
  verified: 5,
  hostel: 5,
}

const STOPWORDS = new Set([
  'b.e', 'b.tech', 'be', 'btech', 'b.sc', 'm.e', 'm.tech', 'm.sc', 'mba', 'mca', 'bca',
  'of', 'and', 'in', 'the', 'for', 'a', 'an', '&', 'with', 'my', 'course', 'interested',
  'engineering', 'technology', 'studies', 'study',
])

// Common shorthand -> full words used in course names
const ALIASES = {
  ai: 'artificial intelligence',
  aiml: 'artificial intelligence',
  ml: 'machine learning',
  cs: 'computer science',
  cse: 'computer science',
  it: 'information technology',
  ds: 'data science',
}

function tokenize(...texts) {
  const tokens = new Set()
  texts.filter(Boolean).forEach(text => {
    String(text).toLowerCase().split(/[^a-z0-9]+/).forEach(raw => {
      const t = raw.trim()
      if (!t || STOPWORDS.has(t) || t.length < 2) return
      tokens.add(t)
      if (ALIASES[t]) ALIASES[t].split(' ').forEach(w => tokens.add(w))
    })
  })
  return Array.from(tokens)
}

function courseHaystacks(college) {
  const courses = Array.isArray(college.courses) ? college.courses : []
  const depts = Array.isArray(college.departments) ? college.departments : []
  return courses.map(c =>
    `${c.name || ''} ${c.degree || c.degreeType || ''} ${c.dept || ''}`.toLowerCase()
  ).concat(depts.map(d => `${d.name || ''} ${d.code || ''}`.toLowerCase()))
}

function hasHostel(college) {
  if (Array.isArray(college.hostels) && college.hostels.length > 0) return true
  if (Array.isArray(college.facilities)) {
    return college.facilities.some(f => /hostel/i.test(f?.name || f || ''))
  }
  return false
}

function typeMatches(pref, college) {
  const hay = `${college.collegeType || ''} ${college.type || ''}`.toLowerCase()
  if (pref === 'Govt') return /govt|government/.test(hay)
  if (pref === 'Private') return /private/.test(hay)
  if (pref === 'Autonomous') return /autonomous/.test(hay)
  return false
}

/**
 * @param {object} student  { percentage, preferredDistrict, district, interestedCourse, groupStream, collegeType, hostelRequired }
 * @param {Array}  colleges enriched college list
 * @returns Array<{ college, matchScore, reasons, cutoff, eligible, matchedCourse }> sorted by matchScore desc
 */
export function recommendColleges(student = {}, colleges = []) {
  const marks = parseFloat(student.percentage)
  const hasMarks = !Number.isNaN(marks) && marks > 0
  const preferredDistrict = (student.preferredDistrict || '').trim().toLowerCase()
  const homeDistrict = (student.district || '').trim().toLowerCase()
  const typePref = (student.collegeType || 'Any').trim()
  const hostelNeeded = /yes|true/i.test(student.hostelRequired || '')
  const tokens = tokenize(student.interestedCourse, student.groupStream)

  const results = colleges.map(college => {
    const reasons = []
    let score = 0

    // 1. Course / stream match (interested course takes priority over stream)
    let matchedCourse = null
    if (tokens.length > 0) {
      const haystacks = courseHaystacks(college)
      const courseTokens = tokenize(student.interestedCourse)
      const streamTokens = tokenize(student.groupStream)
      const courseHit = courseTokens.find(tok => haystacks.some(h => h.includes(tok)))
      const streamHit = streamTokens.find(tok => haystacks.some(h => h.includes(tok)))
      if (courseHit || streamHit) {
        const hitToken = courseHit || streamHit
        matchedCourse = (college.courses || []).find(c =>
          `${c.name} ${c.degree || c.degreeType || ''} ${c.dept || ''}`.toLowerCase().includes(hitToken)
        ) || null
        const matchedDept = (college.departments || []).find(d =>
          `${d.name || ''} ${d.code || ''}`.toLowerCase().includes(hitToken)
        ) || null
        score += WEIGHTS.course
        if (matchedCourse) {
          reasons.push({
            type: 'course',
            icon: 'graduation',
            label: courseHit
              ? `Offers ${matchedCourse.name} — your interested course`
              : `${student.groupStream} stream courses available — e.g. ${matchedCourse.name}`,
          })
        } else if (matchedDept) {
          reasons.push({
            type: 'course',
            icon: 'graduation',
            label: `${matchedDept.name} department — matches your interest`,
          })
        } else {
          reasons.push({
            type: 'course',
            icon: 'graduation',
            label: courseHit
              ? 'Your interested course area is available here'
              : `${student.groupStream} stream courses available`,
          })
        }
      }
    }

    // 2. District preferences
    const collegeDistrict = (college.district || '').toLowerCase()
    if (preferredDistrict && collegeDistrict === preferredDistrict) {
      score += WEIGHTS.district
      reasons.push({ type: 'district', icon: 'mapPin', label: `${college.district} — your preferred district` })
    } else if (homeDistrict && collegeDistrict === homeDistrict) {
      score += WEIGHTS.homeDistrict
      reasons.push({ type: 'district', icon: 'mapPin', label: `${college.district} — same as your home district` })
    }

    // 3. Marks vs typical cutoff
    const cutoff = getCutoffEstimate(college)
    let eligible = null
    if (hasMarks) {
      if (marks >= cutoff) {
        score += WEIGHTS.marks
        eligible = true
        reasons.push({ type: 'marks', icon: 'target', label: `Your ${marks}% clears the typical cutoff (~${cutoff}%)` })
      } else {
        score -= 15
        eligible = false
        reasons.push({ type: 'warning', icon: 'alert', label: `Your ${marks}% is below the typical cutoff (~${cutoff}%)` })
      }
    }

    // 4. College type preference
    if (typePref !== 'Any' && typeMatches(typePref, college)) {
      score += WEIGHTS.type
      reasons.push({ type: 'type', icon: 'building', label: `${typePref} college — matches your preference` })
    }

    // 5. Verification & accreditation
    const isVerified = college.verified || college.verificationStatus === 'VERIFIED'
    if (isVerified) {
      score += WEIGHTS.verified
      const accred = (college.accreditation || '').split('•')[0].trim()
      reasons.push({ type: 'verified', icon: 'badge', label: `Verified platform listing${accred ? ` • ${accred}` : ''}` })
    }

    // 6. Hostel need
    if (hostelNeeded && hasHostel(college)) {
      score += WEIGHTS.hostel
      reasons.push({ type: 'hostel', icon: 'home', label: 'Hostel facility available — matches your need' })
    }

    const matchScore = Math.max(5, Math.min(100, Math.round(score)))
    return { college, matchScore, reasons, cutoff, eligible, matchedCourse }
  })

  results.sort((a, b) => (b.matchScore - a.matchScore) || ((b.college.established || 0) - (a.college.established || 0)))
  return results
}
