/**
 * AI Counsellor Engine - bilingual (English / தமிழ் / Tanglish)
 * =============================================================
 * Understands natural questions about colleges and answers from live
 * platform data (backend-cloned colleges, courses, fees, hostels,
 * placements) + the Smart Recommender engine.
 *
 * Examples it understands:
 *   "85% ku enna college kedaikum?"        -> eligibility + recommendations
 *   "psg vs kct ethu better?"              -> side-by-side comparison
 *   "TCE hostel facility irukka?"          -> hostel details
 *   "PSG fees enna?"                       -> course fees list
 *   "B.E CSE irukura colleges ethana?"     -> colleges offering a course
 *   "scholarship details"                  -> scholarship guidance
 *   "how to apply TNEA?"                   -> admission process
 */
import { getPublicColleges } from './collegeStorage'
import { recommendColleges, getCutoffEstimate } from './recommender'
import { districts } from './colleges'

/* ---------------- language detection ---------------- */

const TAMIL_SCRIPT = /[\u0B80-\u0BFF]/
const TAMILISH_WORDS = /\b(enna|ethu|edhu|irukku|irukka|irukum|irukura|mudiyuma|kedaikum|kedaikumaa|kedaikura|venum|eppadi|ethana|theriyuma|romba|pannu|panradhu|panna|kudu|kudunga|sollu|sollunga|kelunga|kaelunga|paaru|varuma|vaendum)\b/i

function isTamil(text) {
  return TAMIL_SCRIPT.test(text) || TAMILISH_WORDS.test(text)
}

/* ---------------- entity extraction ---------------- */

const COLLEGE_KEYS = [
  { slug: 'psg-tech', keys: ['psg tech', 'psgtech', 'psg college of technology', 'psg'] },
  { slug: 'cit-coimbatore', keys: ['coimbatore institute', 'cit'] },
  { slug: 'kumaraguru-college', keys: ['kumaraguru', 'kct'] },
  { slug: 'thiyagarajar-engineering', keys: ['thiyagarajar', 'thiagarajar', 'thiyagaraja', 'thiagaraja', 'tce'] },
]

function findColleges(text, colleges) {
  const lower = ' ' + text.toLowerCase() + ' '
  const slugs = []
  COLLEGE_KEYS.forEach(({ slug, keys }) => {
    if (keys.some(k => lower.includes(k)) && !slugs.includes(slug)) slugs.push(slug)
  })
  // also match full college names
  colleges.forEach(c => {
    const n = (c.name || '').toLowerCase()
    if (n.length > 10 && lower.includes(n) && !slugs.includes(c.slug)) slugs.push(c.slug)
  })
  return slugs.map(slug => colleges.find(c => c.slug === slug)).filter(Boolean)
}

function findDistrict(text) {
  const lower = text.toLowerCase()
  return districts.find(d => lower.includes(d.toLowerCase())) || null
}

const COURSE_PATTERNS = [
  { label: 'Computer Science', re: /\bcse\b|computer science/i },
  { label: 'AI & Data Science', re: /artificial intelligence|\bai\b|data science|\baids\b/i },
  { label: 'IT', re: /\bit\b|information technology/i },
  { label: 'ECE', re: /\bece\b|electronics/i },
  { label: 'EEE', re: /\beee\b|electrical/i },
  { label: 'Mechanical', re: /mech/i },
  { label: 'Civil', re: /civil/i },
  { label: 'BCA', re: /\bbca\b/i },
  { label: 'MCA', re: /\bmca\b/i },
  { label: 'MBA', re: /\bmba\b/i },
  { label: 'Chemical', re: /chemical/i },
  { label: 'Biotechnology', re: /biotech/i },
]

function findCourse(text) {
  return COURSE_PATTERNS.find(p => p.re.test(text)) || null
}

/** Extract marks / cutoff. Handles "85%", "85 ku", "cutoff 185", plain "85". */
function findMarks(text) {
  let m = /(\d{1,3}(?:\.\d+)?)\s*%/.exec(text)
  if (m) {
    const v = parseFloat(m[1])
    if (v > 0 && v <= 100) return { value: v, type: 'percent' }
  }
  m = /(?:marks?|mark|cutoff|cut\s*off|percentage|score)\D{0,12}(\d{2,3})/i.exec(text)
  if (!m) m = /(\d{2,3})\s*(?:ku|kku|point|marks?)/i.exec(text)
  if (!m) m = /(?:^|\s)(\d{2,3})(?:\s|$)/.exec(text)
  if (m) {
    const v = parseFloat(m[1])
    if (v >= 120 && v <= 200) return { value: Math.round((v / 200) * 1000) / 10, type: 'tnea' }
    if (v >= 30 && v <= 100) return { value: v, type: 'percent' }
  }
  return null
}

/* ---------------- response helpers ---------------- */

function collegeLine(c) {
  const courses = (c.courses || []).length
  return `${c.name} (${c.district}) • Est. ${c.established} • ${c.accreditation || 'NAAC'} • ${courses} courses`
}

function feesOf(c) {
  const courses = (c.courses || []).slice(0, 5)
  if (!courses.length) return null
  return courses.map(co => `• ${co.name} — ${co.fees || 'Contact college'}`).join('\n')
}

function hostelsOf(c) {
  const list = Array.isArray(c.hostels) ? c.hostels : []
  if (!list.length) {
    const f = (c.facilities || []).find(x => /hostel/i.test(x?.name || x || ''))
    return f ? `• Hostel available: ${f.description || f.name}` : null
  }
  return list.slice(0, 3).map(h => `• ${h.name} (${h.type}) — capacity ${h.capacity || '—'}, ${h.fees || 'fees on request'}`).join('\n')
}

function placementsOf(c) {
  const list = Array.isArray(c.placements) ? c.placements : []
  if (list.length) {
    const total = list.reduce((a, p) => a + (parseInt(p.students, 10) || 0), 0)
    const best = list.reduce((a, p) => (parseFloat(String(p.package).replace(/[^\d.]/g, '')) > parseFloat(String(a.package).replace(/[^\d.]/g, '')) ? p : a), list[0])
    const companies = list.map(p => p.company).filter(Boolean).slice(0, 5).join(', ')
    return `• ${total}+ offers from ${list.length} top recruiters\n• Highest package: ${best.package} (${best.company})\n• Recruiters: ${companies}`
  }
  const pct = c.quickInfo?.placement
  return pct ? `• Placement rate: ${pct} (as shared by the college)` : null
}

function compareTwo(a, b) {
  const line = (c) => `${c.shortName || c.name}: Est. ${c.established} • ${c.accreditation || '—'} • ${(c.courses || []).length} courses • ${c.district}`
  let verdict = 'Both are excellent choices!'
  const nirf = (c) => { const m = /NIRF\s*(\d+)/i.exec(c.accreditation || ''); return m ? parseInt(m[1], 10) : null }
  const na = nirf(a), nb = nirf(b)
  if (na && nb && na !== nb) {
    const better = na < nb ? a : b
    verdict = `${better.shortName} ranks higher nationally (NIRF ${Math.min(na, nb)} vs ${Math.max(na, nb)}).`
  }
  return `📊 ${a.name}\n${line(a)}\n\n📊 ${b.name}\n${line(b)}\n\n💡 ${verdict}`
}

/* ---------------- main entry ---------------- */

export function getCounsellorReply(rawText) {
  const text = String(rawText || '').trim()
  const lower = text.toLowerCase()
  const ta = isTamil(text)
  const colleges = getPublicColleges()
  const L = (tam, eng) => (ta ? tam : eng)

  // greetings
  if (/^(hi|hii|hey|hello|hai|vanakkam|vanakam|good (morning|afternoon|evening))\b/i.test(lower) || lower === 'hi' || /vanakkam/.test(lower)) {
    return {
      text: L(
        'Vanakkam! 🙏 Naan unga AI Counsellor.\n\nKekkalam:\n• "85% ku enna college kedaikum?"\n• "PSG vs KCT ethu better?"\n• "TCE hostel facility irukka?"\n• "PSG fees enna?"\n\nEthavathu kelunga! 😊',
        'Vanakkam! 🙏 I\'m your AI Counsellor.\n\nAsk me anything:\n• "Which college for 85%?"\n• "PSG vs KCT — which is better?"\n• "Does TCE have hostel?"\n• "What are PSG fees?"\n\nWhat would you like to know? 😊'
      ),
      chips: ta ? ['85% ku enna college?', 'PSG vs KCT'] : ['Which college for 85%?', 'PSG vs KCT'],
    }
  }

  // thanks
  if (/thank|nandri|nanri|thanks/.test(lower)) {
    return { text: L('Nandri! 😊 Innum kelunga — naan help pannuven!', 'Happy to help! 😊 Ask me anything else about colleges, fees or admissions.') }
  }

  // scholarship
  if (/scholar|first graduate|firstgraduate|fee concession|உதவித்தொகை/.test(lower)) {
    return {
      text: L(
        '🎓 Scholarship-vaga kedaikura vellai:\n\n• First Graduate — Tamil Nadu govt fee concession (mudhal thalaipokku)\n• Community scholarships — BC / MBC / SC / ST post-matric schemes\n• Merit scholarships — college level (high cutoff)\n• Sports quota — district/state level players\n• Private trusts & NGOs\n\nApply: college admission time-la community certificate + income certificate ready vaikkunga. Exact amount ku college office kettunga!',
        '🎓 Scholarships you can explore:\n\n• First Graduate — TN govt fee concession (first in family to graduate)\n• Community scholarships — BC / MBC / SC / ST post-matric schemes\n• Merit scholarships — offered by colleges for high scores\n• Sports quota — for district/state level players\n• Private trusts & NGOs\n\nTip: keep community certificate + income certificate ready during admission. Contact the college office for exact amounts!'
      ),
      chips: ['TNEA apply eppadi?', 'TCE fees enna?'],
    }
  }

  // admission / TNEA
  if (/tnea|apply|application|admission process|counselling|how to join|eppadi join|சேர/.test(lower)) {
    return {
      text: L(
        '📝 Engineering admission (TNEA) steps:\n\n1. 12th mudichadhum — tneaonline.org la register pannunga (May-June)\n2. Marks upload pannunga — random number assign aagum\n3. Choice filling — college + branch priority order kudunga\n4. Counselling call — rank based oru call varum\n5. Seat confirm panni, college la join pannunga 🎉\n\nManagement quota ku directly college kettunga.',
        '📝 Engineering admission (TNEA) steps:\n\n1. After 12th results — register at tneaonline.org (May-June)\n2. Upload marks — a random number is assigned\n3. Choice filling — set your college + branch priority order\n4. Counselling call — based on your rank\n5. Confirm seat and join the college 🎉\n\nFor management quota, contact the college directly.'
      ),
      chips: ['85% ku enna college?', 'Scholarship details'],
    }
  }

  // compare two colleges
  const matched = findColleges(text, colleges)
  if ((matched.length >= 2) || (matched.length === 1 && /vs\b|versus|compare|better/.test(lower) && matched.length === 2)) {
    if (matched.length >= 2) {
      return { text: compareTwo(matched[0], matched[1]), chips: [`${matched[0].shortName} fees enna?`, `${matched[1].shortName} placement eppdi?`] }
    }
  }

  // fees
  if (matched.length >= 1 && /fee|fees|cost|amount|money|kasu|price|கட்டண/.test(lower)) {
    const c = matched[0]
    const fees = feesOf(c)
    return {
      text: fees
        ? L(`💸 ${c.name} — course-wise fees:\n\n${fees}\n\nNote: hostel + other charges separate.`, `💸 ${c.name} — course-wise fees:\n\n${fees}\n\nNote: hostel and other charges are separate.`)
        : L(`${c.name} fees details ithu varaikkum add aagala — college website paarunga.`, `${c.name} fee details are not added yet — please check the college website.`),
    }
  }

  // hostel
  if (matched.length >= 1 && /hostel|hostal|stay|accommodation|room|தங்க/.test(lower)) {
    const c = matched[0]
    const h = hostelsOf(c)
    return {
      text: h
        ? L(`🏠 ${c.name} — hostel facilities:\n\n${h}`, `🏠 ${c.name} — hostel facilities:\n\n${h}`)
        : L(`${c.name} hostel details add aagala — college office kettunga.`, `${c.name} hostel details are not added yet — please contact the college office.`),
    }
  }

  // placement
  if (matched.length >= 1 && /placement|package|lpa|salary|job|recruit|company|வேலை/.test(lower)) {
    const c = matched[0]
    const p = placementsOf(c)
    return {
      text: p ? `💼 ${c.name} — placements:\n\n${p}` : L(`${c.name} placement details varaikkum add aagala.`, `${c.name} placement details are not added yet.`),
    }
  }

  // eligibility / marks -> recommender
  const marks = findMarks(text)
  if (marks) {
    const district = findDistrict(text)
    const course = findCourse(text)
    const recs = recommendColleges(
      {
        percentage: String(marks.value),
        preferredDistrict: district || '',
        district: district || '',
        interestedCourse: course ? course.label : '',
        groupStream: '',
        collegeType: 'Any',
        hostelRequired: 'No',
      },
      colleges
    )
    const top = recs.slice(0, 3)
    const head = marks.type === 'tnea'
      ? L(`🎯 Un TNEA cutoff ${Math.round(marks.value * 2)}/200 (~${marks.value}%) — top colleges:`, `🎯 Your TNEA cutoff ${Math.round(marks.value * 2)}/200 (~${marks.value}%) — top colleges:`)
      : L(`🎯 Un ${marks.value}% ku best colleges${district ? ` (${district})` : ''}:`, `🎯 Best colleges for your ${marks.value}%${district ? ` in ${district}` : ''}:`)
    const body = top.map((r, i) => {
      const chance = r.eligible === false
        ? (ta ? `⚠️ konjam tough — cutoff ~${r.cutoff}%` : `⚠️ a bit tough — cutoff ~${r.cutoff}%`)
        : (ta ? `✅ chance adhigama irukku — cutoff ~${r.cutoff}%` : `✅ high chance — cutoff ~${r.cutoff}%`)
      return `${i + 1}. ${r.college.name} (${r.college.district})\n    ${chance}`
    }).join('\n')
    return {
      text: `${head}\n\n${body}\n\n${L('Student dashboard-la Smart Recommendations paathu "Why shown" reasons um paarunga!', 'Open the Smart Recommendations on the student dashboard to see full "why shown" reasons!')}`,
      chips: top.slice(0, 2).map(r => `${r.college.shortName} fees enna?`),
    }
  }

  // course search
  const course = findCourse(text)
  if (course) {
    const offering = colleges.filter(c => (c.courses || []).some(co => `${co.name} ${co.degree || ''}`.toLowerCase().includes(course.label.toLowerCase().split(' ')[0])))
    if (offering.length) {
      const list = offering.map(c => `• ${c.name} (${c.district}) — ${(c.courses || []).filter(co => co.name.toLowerCase().includes(course.label.toLowerCase().split(' ')[0])).slice(0, 1).map(co => co.name)[0] || course.label}`).join('\n')
      return {
        text: L(`📚 "${course.label}" course irukura colleges:\n\n${list}`, `📚 Colleges offering "${course.label}":\n\n${list}`),
        chips: offering.slice(0, 2).map(c => `${c.shortName} details kudu`),
      }
    }
  }

  // single college info
  if (matched.length === 1) {
    const c = matched[0]
    const top3 = (c.courses || []).slice(0, 3).map(co => `• ${co.name}`).join('\n')
    return {
      text: L(
        `🏛️ ${c.name}\n${collegeLine(c)}\n\nPopular courses:\n${top3 || 'Courses add aagala'}\n\nHostel, fees, placement, cutoff — ethu ketalum sollren!`,
        `🏛️ ${c.name}\n${collegeLine(c)}\n\nPopular courses:\n${top3 || 'Courses not added yet'}\n\nAsk me about its hostel, fees, placements or cutoff!`
      ),
      chips: [`${c.shortName} fees enna?`, `${c.shortName} hostel irukka?`, `${c.shortName} placement eppdi?`],
    }
  }

  // platform info
  if (/platform|how.*work|about this site|yaaru|who built/.test(lower)) {
    return {
      text: L(
        'ℹ️ Idhu Tamil Nadu College Discovery Platform:\n\n• Students — signup, search, compare, enquire\n• Colleges — signup, own profile manage pannuvanga\n• Platform — verification + analytics + PDF reports\n\nNaan AI Counsellor — college, fees, cutoff, hostel, placement doubts ku answer pannuven!',
        'ℹ️ This is the Tamil Nadu College Discovery Platform:\n\n• Students — sign up, discover, compare, enquire\n• Colleges — sign up and manage their own profiles\n• Platform — verification, analytics and PDF reports\n\nI\'m the AI Counsellor — ask me about colleges, fees, cutoffs, hostels and placements!'
      ),
    }
  }

  // fallback
  return {
    text: L(
      '🤔 Athu purila — konjam clear-aa kelunga. Naan idhu maari kelvi ku answer pannuven:\n\n• "85% ku enna college kedaikum?"\n• "PSG vs KCT ethu better?"\n• "TCE hostel irukka?"\n• "PSG fees enna?"\n• "Scholarship details"',
      '🤔 I didn\'t quite get that — try asking like this:\n\n• "Which college for 85%?"\n• "PSG vs KCT — which is better?"\n• "Does TCE have hostel?"\n• "What are PSG fees?"\n• "Scholarship details"'
    ),
    chips: ['85% ku enna college?', 'PSG vs KCT', 'Scholarship details'],
  }
}

export const CHAT_SUGGESTIONS = [
  '85% ku enna college?',
  'PSG vs KCT',
  'TCE hostel irukka?',
  'PSG fees enna?',
  'Scholarship details',
  'TNEA apply eppadi?',
]
