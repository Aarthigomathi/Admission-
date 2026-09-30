/**
 * Tamil Nadu education reference data for the signup wizard (frontend only).
 *
 * - Levels offered: 10th and 12th (school) plus Diploma / Undergraduate / Postgraduate.
 *   11th is intentionally NOT offered.
 * - School levels ask for a Tamil Nadu board; higher levels ask for a Tamil Nadu university
 *   (the student's own district is listed first).
 * - School / college name fields suggest real Tamil Nadu institutions, own district first.
 */

export const EDUCATION_LEVELS = ['10th', '12th', 'Diploma', 'Undergraduate', 'Postgraduate']
export const SCHOOL_LEVELS = ['10th', '12th']
export const HIGHER_LEVELS = ['Diploma', 'Undergraduate', 'Postgraduate']

export const isSchoolLevel = level => SCHOOL_LEVELS.includes(level)

/* ------------------------------------------------------------------ *
 * Boards (10th / 12th) - Tamil Nadu school boards & recognised curricula
 * ------------------------------------------------------------------ */
export const SCHOOL_BOARDS = [
  'Tamil Nadu State Board',
  'CBSE',
  'ICSE',
  'IB (International Baccalaureate)',
  'Cambridge (IGCSE / AS & A Level)',
  'Other Board'
]

/* ------------------------------------------------------------------ *
 * Universities - Tamil Nadu universities & deemed universities (Diploma / UG / PG)
 * ------------------------------------------------------------------ */
export const TN_UNIVERSITIES = [
  { name: 'Anna University, Chennai', district: 'Chennai' },
  { name: 'University of Madras, Chennai', district: 'Chennai' },
  { name: 'Indian Institute of Technology Madras, Chennai', district: 'Chennai' },
  { name: 'SRM Institute of Science and Technology, Chennai', district: 'Chennai' },
  { name: 'Tamil Nadu Dr. M.G.R. Medical University, Chennai', district: 'Chennai' },
  { name: 'Tamil Nadu Veterinary and Animal Sciences University, Chennai', district: 'Chennai' },
  { name: 'Tamil Nadu Teachers Education University, Chennai', district: 'Chennai' },
  { name: 'Bharathiar University, Coimbatore', district: 'Coimbatore' },
  { name: 'Tamil Nadu Agricultural University, Coimbatore', district: 'Coimbatore' },
  { name: 'Amrita Vishwa Vidyapeetham, Coimbatore', district: 'Coimbatore' },
  { name: 'Bharathidasan University, Tiruchirappalli', district: 'Tiruchirappalli' },
  { name: 'National Institute of Technology, Tiruchirappalli', district: 'Tiruchirappalli' },
  { name: 'Madurai Kamaraj University, Madurai', district: 'Madurai' },
  { name: 'Alagappa University, Karaikudi', district: 'Sivaganga' },
  { name: 'Manonmaniam Sundaranar University, Tirunelveli', district: 'Tirunelveli' },
  { name: 'Periyar University, Salem', district: 'Salem' },
  { name: 'Annamalai University, Chidambaram', district: 'Cuddalore' },
  { name: 'Tamil University, Thanjavur', district: 'Thanjavur' },
  { name: 'SASTRA Deemed University, Thanjavur', district: 'Thanjavur' },
  { name: 'Vellore Institute of Technology, Vellore', district: 'Vellore' },
  { name: 'Kalasalingam Academy of Research and Education, Krishnankoil', district: 'Virudhunagar' },
  { name: "Mother Teresa Women's University, Kodaikanal", district: 'Dindigul' },
  { name: 'Gandhigram Rural Institute, Gandhigram', district: 'Dindigul' },
  { name: 'Periyar Maniammai Institute of Science and Technology, Vallam', district: 'Thanjavur' },
  { name: 'Thiagarajar College of Engineering, Madurai', district: 'Madurai' }
]

export const OTHER_UNIVERSITY = 'Other University / Board'

export function universityNamesFor(district) {
  if (!district) return TN_UNIVERSITIES.map(u => u.name)
  const local = TN_UNIVERSITIES.filter(u => u.district === district).map(u => u.name)
  const rest = TN_UNIVERSITIES.filter(u => u.district !== district).map(u => u.name)
  return [...local, ...rest]
}

/** Board list for school levels, university list for Diploma / UG / PG. */
export function qualificationOptionsFor(level, district) {
  if (isSchoolLevel(level)) return SCHOOL_BOARDS
  return [...universityNamesFor(district), OTHER_UNIVERSITY]
}

/* ------------------------------------------------------------------ *
 * Tamil Nadu school names (10th / 12th)
 * ------------------------------------------------------------------ */
const GHSS = 'Government Higher Secondary School'
const GGHS = 'Government Girls Higher Secondary School'
const govt = (district, prefix, places) => places.map(place => ({ name: `${prefix}, ${place}`, district }))
const named = (district, names) => names.map(name => ({ name, district }))

export const TN_SCHOOLS = [
  ...named('Ariyalur', ['Government Higher Secondary School, Jayankondam', 'Government Higher Secondary School, Sendurai', 'Government Higher Secondary School, Udayarpalayam']),
  ...govt('Ariyalur', GHSS, ['Ariyalur']), ...govt('Ariyalur', GGHS, ['Ariyalur']),

  ...govt('Chengalpattu', GHSS, ['Chengalpattu', 'Tambaram', 'Madurantakam', 'Pallavaram', 'Thirukazhukundram']),

  ...named('Chennai', [
    'DAV Boys Senior Secondary School, Gopalapuram',
    'Padma Seshadri Bala Bhavan Sr. Sec. School, K.K. Nagar',
    'SBOA School & Junior College, Anna Nagar',
    'Chettinad Vidyashram, R.A. Puram',
    'Lady Andal Venkatasubba Rao Matric. Hr. Sec. School',
    "St. Bede's Anglo Indian Higher Secondary School",
    'P.S. Senior Secondary School, Mylapore'
  ]),
  ...govt('Chennai', GHSS, ['Saidapet', 'Nungambakkam']),

  ...named('Coimbatore', ['PSG Public Schools, Peelamedu']),
  ...govt('Coimbatore', GHSS, ['Sulur', 'Mettupalayam', 'Annur', 'Pollachi', 'Kinathukadavu']),
  ...govt('Coimbatore', GGHS, ['Coimbatore']),

  ...named('Cuddalore', ["St. Joseph's Higher Secondary School, Cuddalore"]),
  ...govt('Cuddalore', GHSS, ['Cuddalore', 'Neyveli', 'Panruti', 'Chidambaram', 'Vridhachalam']),

  ...govt('Dharmapuri', GHSS, ['Dharmapuri', 'Palacode', 'Harur', 'Pennagaram', 'Papparapatti']),
  ...govt('Dharmapuri', GGHS, ['Dharmapuri']),

  ...govt('Dindigul', GHSS, ['Dindigul', 'Palani', 'Oddanchatram', 'Batlagundu', 'Kodaikanal']),

  ...govt('Erode', GHSS, ['Erode', 'Bhavani', 'Gobichettipalayam', 'Sathyamangalam', 'Perundurai']),

  ...govt('Kallakurichi', GHSS, ['Kallakurichi', 'Sankarapuram', 'Chinnasalem', 'Ulundurpet', 'Thirukkoilur']),

  ...govt('Kancheepuram', GHSS, ['Kanchipuram', 'Sriperumbudur', 'Uthiramerur', 'Walajabad', 'Kundrathur']),

  ...named('Kanniyakumari', ['Scott Christian Higher Secondary School, Nagercoil']),
  ...govt('Kanniyakumari', GHSS, ['Nagercoil', 'Marthandam', 'Kuzhithurai', 'Thuckalay', 'Colachel']),

  ...govt('Karur', GHSS, ['Karur', 'Kulithalai', 'Aravakurichi', 'Krishnarayapuram', 'Pallapatti']),

  ...govt('Krishnagiri', GHSS, ['Krishnagiri', 'Hosur', 'Denkanikottai', 'Pochampalli', 'Uthangarai']),

  ...named('Madurai', [
    'TVS Matriculation Higher Secondary School, Madurai',
    'Sourashtra Girls Higher Secondary School, Madurai'
  ]),
  ...govt('Madurai', GHSS, ['Madurai', 'Melur', 'Usilampatti', 'Thirumangalam']),
  ...govt('Madurai', GGHS, ['Madurai']),

  ...govt('Mayiladuthurai', GHSS, ['Mayiladuthurai', 'Sirkazhi', 'Kuthalam', 'Tharangambadi', 'Kollidam']),
  ...govt('Nagapattinam', GHSS, ['Nagapattinam', 'Velankanni', 'Kilvelur', 'Vedaranyam', 'Thalaignayiru']),
  ...govt('Namakkal', GHSS, ['Namakkal', 'Rasipuram', 'Tiruchengode', 'Mohanur', 'Paramathi Velur']),

  ...named('Nilgiris', ['Breeks Memorial Anglo Indian Higher Secondary School, Ooty']),
  ...govt('Nilgiris', GHSS, ['Udhagamandalam', 'Coonoor', 'Kotagiri', 'Gudalur']),

  ...govt('Perambalur', GHSS, ['Perambalur', 'Kunnam', 'Veppanthattai', 'Alathur', 'Labbaikudikadu']),
  ...govt('Pudukkottai', GHSS, ['Pudukkottai', 'Aranthangi', 'Alangudi', 'Gandarvakottai', 'Illuppur']),
  ...govt('Ramanathapuram', GHSS, ['Ramanathapuram', 'Paramakudi', 'Rameswaram', 'Mudukulathur', 'Kamuthi']),
  ...govt('Ranipet', GHSS, ['Ranipet', 'Arakkonam', 'Arcot', 'Walajapet', 'Sholinghur']),

  ...govt('Salem', GHSS, ['Salem', 'Mettur', 'Attur', 'Omalur', 'Edappadi']),
  ...govt('Salem', GGHS, ['Salem']),

  ...named('Sivaganga', ['Alagappa Model Higher Secondary School, Karaikudi']),
  ...govt('Sivaganga', GHSS, ['Sivaganga', 'Karaikudi', 'Devakottai', 'Manamadurai']),

  ...govt('Tenkasi', GHSS, ['Tenkasi', 'Shenkottai', 'Sankarankovil', 'Kadayanallur', 'Courtallam']),
  ...govt('Thanjavur', GHSS, ['Thanjavur', 'Kumbakonam', 'Pattukkottai', 'Orathanadu', 'Thiruvaiyaru']),
  ...govt('Theni', GHSS, ['Theni', 'Periyakulam', 'Bodinayakanur', 'Cumbum', 'Andipatti']),
  ...govt('Thoothukudi', GHSS, ['Thoothukudi', 'Kovilpatti', 'Tiruchendur', 'Srivaikuntam', 'Kayalpattinam']),

  ...named('Tiruchirappalli', ['Campion Anglo-Indian Higher Secondary School, Tiruchirappalli']),
  ...govt('Tiruchirappalli', GHSS, ['Tiruchirappalli', 'Srirangam', 'Manapparai', 'Lalgudi']),

  ...govt('Tirunelveli', GHSS, ['Tirunelveli', 'Palayamkottai', 'Valliyoor', 'Nanguneri', 'Ambasamudram']),
  ...govt('Tirupathur', GHSS, ['Tirupathur', 'Vaniyambadi', 'Ambur', 'Jolarpettai', 'Natrampalli']),
  ...govt('Tiruppur', GHSS, ['Tiruppur', 'Avinashi', 'Dharapuram', 'Udumalaipettai', 'Palladam']),
  ...govt('Tiruvallur', GHSS, ['Tiruvallur', 'Avadi', 'Ponneri', 'Gummidipoondi', 'Poonamallee', 'Ambattur']),
  ...govt('Tiruvannamalai', GHSS, ['Tiruvannamalai', 'Arani', 'Chengam', 'Polur', 'Cheyyar']),
  ...govt('Tiruvarur', GHSS, ['Tiruvarur', 'Mannargudi', 'Thiruthuraipoondi', 'Nannilam', 'Valangaiman']),

  ...named('Vellore', ['Voorhees Higher Secondary School, Vellore']),
  ...govt('Vellore', GHSS, ['Vellore', 'Katpadi', 'Gudiyatham', 'Pernambut']),

  ...govt('Viluppuram', GHSS, ['Viluppuram', 'Tindivanam', 'Gingee', 'Vikravandi', 'Marakkanam']),
  ...govt('Virudhunagar', GHSS, ['Virudhunagar', 'Sivakasi', 'Rajapalayam', 'Aruppukottai', 'Srivilliputhur'])
]

/* ------------------------------------------------------------------ *
 * Tamil Nadu college names (Diploma / UG / PG)
 * ------------------------------------------------------------------ */
export const TN_COLLEGES = [
  /* Chennai */
  ...named('Chennai', [
    'Anna University (CEG Campus), Guindy',
    'Indian Institute of Technology Madras',
    'University of Madras',
    'Loyola College, Chennai',
    'Stella Maris College, Chennai',
    'Presidency College, Chennai',
    'Madras Medical College, Chennai'
  ]),
  /* Chengalpattu */
  ...named('Chengalpattu', [
    'Madras Christian College, Tambaram',
    'SSN College of Engineering, Kalavakkam'
  ]),
  /* Coimbatore (names already used across the app) */
  ...named('Coimbatore', [
    'PSG College of Technology',
    'Coimbatore Institute of Technology',
    'Government College of Technology, Coimbatore',
    'Kumaraguru College of Technology',
    'PSG College of Arts & Science',
    'Sri Krishna Arts and Science College',
    'Coimbatore Medical College',
    'Tamil Nadu Agricultural University, Coimbatore',
    'Amrita School of Engineering, Coimbatore'
  ]),
  /* Madurai */
  ...named('Madurai', [
    'Thiagarajar College of Engineering, Madurai',
    'American College, Madurai',
    'Lady Doak College, Madurai',
    'Madurai Medical College',
    'Madurai Kamaraj University'
  ]),
  /* Tiruchirappalli */
  ...named('Tiruchirappalli', [
    'National Institute of Technology, Tiruchirappalli',
    "St. Joseph's College, Tiruchirappalli",
    'Bishop Heber College, Tiruchirappalli',
    'National College, Tiruchirappalli',
    'Bharathidasan University, Tiruchirappalli',
    'Government College of Engineering, Srirangam'
  ]),
  /* Salem */
  ...named('Salem', [
    'Government College of Engineering, Salem',
    'Sona College of Technology, Salem',
    'Periyar University, Salem',
    'Government Arts College, Salem'
  ]),
  /* Tirunelveli */
  ...named('Tirunelveli', [
    'Manonmaniam Sundaranar University, Tirunelveli',
    "St. Xavier's College, Palayamkottai",
    'Government College of Engineering, Tirunelveli'
  ]),
  /* Thanjavur */
  ...named('Thanjavur', [
    'SASTRA Deemed University, Thanjavur',
    'Periyar Maniammai Institute of Science and Technology, Vallam',
    'Rajah Serfoji Government College, Thanjavur',
    'Tamil University, Thanjavur'
  ]),
  /* Vellore */
  ...named('Vellore', [
    'Vellore Institute of Technology',
    'Christian Medical College, Vellore',
    'Voorhees College, Vellore',
    'Thanthai Periyar Government Institute of Technology, Vellore'
  ]),
  /* Erode */
  ...named('Erode', [
    'Kongu Engineering College, Perundurai',
    'Bannari Amman Institute of Technology, Sathyamangalam',
    'Vellalar College for Women, Erode'
  ]),
  /* Virudhunagar */
  ...named('Virudhunagar', [
    'Kalasalingam Academy of Research and Education, Krishnankoil',
    'Kamaraj College of Engineering and Technology, Virudhunagar',
    'Mepco Schlenk Engineering College, Sivakasi'
  ]),
  /* Dindigul */
  ...named('Dindigul', [
    'PSNA College of Engineering and Technology, Dindigul',
    'Gandhigram Rural Institute, Gandhigram'
  ]),
  /* Kancheepuram */
  ...named('Kancheepuram', ['Sri Venkateswara College of Engineering, Sriperumbudur']),
  /* Cuddalore */
  ...named('Cuddalore', [
    'Annamalai University, Chidambaram',
    "St. Joseph's College of Arts and Science, Cuddalore"
  ]),
  /* Kanniyakumari */
  ...named('Kanniyakumari', [
    'Scott Christian College, Nagercoil',
    'University College of Engineering, Nagercoil'
  ]),
  /* Karur */
  ...named('Karur', ['M. Kumarasamy College of Engineering, Karur']),
  /* Namakkal */
  ...named('Namakkal', ['K.S.R. College of Engineering, Tiruchengode']),
  /* Krishnagiri */
  ...named('Krishnagiri', ['Government College of Engineering, Bargur']),
  /* Dharmapuri */
  ...named('Dharmapuri', ['Periyar University PG Extension Centre, Dharmapuri']),
  /* Nilgiris */
  ...named('Nilgiris', ['Government Arts College, Udhagamandalam']),
  /* Theni */
  ...named('Theni', [
    'Government College of Engineering, Bodinayakanur',
    'Theni Kammavar Sangam College of Technology, Theni'
  ]),
  /* Tiruppur */
  ...named('Tiruppur', ['Chikkanna Government Arts College, Tiruppur']),
  /* Pudukkottai */
  ...named('Pudukkottai', ['Government College of Engineering, Gandarvakottai']),
  /* Sivaganga */
  ...named('Sivaganga', [
    'Alagappa University, Karaikudi',
    'Alagappa Government Arts College, Karaikudi'
  ]),
  /* Tenkasi */
  ...named('Tenkasi', ['Sri Paramakalyani College, Alwarkurichi']),
  /* Thoothukudi */
  ...named('Thoothukudi', ['V.O. Chidambaram College, Thoothukudi']),
  /* Tiruvannamalai */
  ...named('Tiruvannamalai', ['Arunai Engineering College, Tiruvannamalai']),
  /* Viluppuram */
  ...named('Viluppuram', [
    'Arignar Anna Government Arts College, Villupuram',
    'Mailam Engineering College, Mailam'
  ]),
  /* Perambalur */
  ...named('Perambalur', ['Thanthai Hans Roever College, Perambalur'])
]

const sourceFor = level => (isSchoolLevel(level) ? TN_SCHOOLS : TN_COLLEGES)

/** Institution names to offer in the datalist - the student's district first. */
export function institutionSuggestions(level, district, limit = 80) {
  const source = sourceFor(level)
  const local = source.filter(item => item.district === district)
  const rest = source.filter(item => item.district !== district)
  const seen = new Set()
  const names = []
  for (const item of [...local, ...rest]) {
    if (seen.has(item.name)) continue
    seen.add(item.name)
    names.push(item.name)
    if (names.length >= limit) break
  }
  return names
}

/** Short, clickable "popular in your district" list. */
export function districtHighlights(level, district, limit = 4) {
  const source = sourceFor(level)
  const local = [...new Set(source.filter(item => item.district === district).map(item => item.name))]
  if (local.length >= limit) return local.slice(0, limit)
  const extra = source.map(item => item.name).filter(name => !local.includes(name))
  return [...local, ...extra].slice(0, limit)
}
