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

/* ------------------------------------------------------------------ *
 * Popular, well-known Tamil Nadu schools (real institutions, taken from
 * public district-wise school lists) - listed ahead of the generic
 * government-school entries so they show up first in the suggestions.
 * ------------------------------------------------------------------ */
export const POPULAR_SCHOOLS = [
  ...named('Coimbatore', [
    'Mani Higher Secondary School, Coimbatore',
    'Stanes Higher Secondary School, Coimbatore',
    'GKD Matriculation Higher Secondary School, Coimbatore',
    'PSG Sarvajana Higher Secondary School, Coimbatore',
    'Sri Baldevdas Kikani Vidyamandir High School, Coimbatore',
    'CSI Higher Secondary School, Coimbatore',
    "St. Joseph's Matriculation Higher Secondary School, Coimbatore",
    'Alvernia Matriculation Higher Secondary School, Coimbatore',
    'Carmel Garden Matriculation Higher Secondary School, Coimbatore',
    'Bharatiya Vidya Bhavan Matriculation Higher Secondary School, Coimbatore',
    'G. D. Naidu Matriculation Higher Secondary School, Coimbatore',
    'SBOA Matriculation Higher Secondary School, Coimbatore',
    'Ramakrishna Mission Vidyalaya, Coimbatore',
    'Chinmaya International Residential School, Coimbatore'
  ]),
  ...named('Salem', [
    'Cluny Matriculation Higher Secondary School, Salem',
    'Holy Cross Matriculation Higher Secondary School, Salem',
    'Sri Vidya Mandir Higher Secondary School, Meyyanur, Salem',
    'Little Flower Higher Secondary School, Salem',
    'Montfort Higher Secondary School, Yercaud',
    'Municipal Boys Higher Secondary School, Ammapet, Salem',
    'G.V. Higher Secondary School, Mettur Dam',
    'Jairam Public School, Salem'
  ]),
  ...named('Madurai', [
    'American College Higher Secondary School, Madurai',
    'Capron Hall Higher Secondary School, Madurai',
    'Fatima Matriculation Higher Secondary School, Madurai',
    'Maharishi Vidya Mandir, Madurai',
    'Dolphin Matriculation Higher Secondary School, Madurai'
  ]),
  ...named('Tiruchirappalli', [
    'Bishop Heber Higher Secondary School, Tiruchirappalli',
    'Holy Cross Higher Secondary School, Tiruchirappalli',
    "St. Joseph's Anglo-Indian Higher Secondary School, Tiruchirappalli",
    'National Higher Secondary School, Tiruchirappalli',
    "St. Anne's Girls Higher Secondary School, Tiruchirappalli"
  ]),
  ...named('Karur', [
    'Venus Matriculation Higher Secondary School, Karur',
    'Vivekananda Matriculation Higher Secondary School, Karur',
    'Vidya Mandir Matriculation Higher Secondary School, Karur'
  ]),
  ...named('Namakkal', [
    'Anna Nehru Matriculation Higher Secondary School, Namakkal',
    'Avvai KSR Matriculation School, Namakkal',
    'Bharath Matriculation School, Namakkal'
  ]),
  ...named('Nagapattinam', [
    'Modern Matriculation Higher Secondary School, Nagapattinam',
    'Nehru Matriculation Higher Secondary School, Nagapattinam'
  ]),
  ...named('Chennai', [
    'Don Bosco Matriculation Higher Secondary School, Egmore, Chennai',
    'Kendriya Vidyalaya, CLRI, Adyar, Chennai',
    'PSBB Senior Secondary School, Nungambakkam, Chennai'
  ]),
  ...named('Dindigul', [
    'MSP Solai Nadar Memorial Higher Secondary School, Dindigul',
    "St. Mary's Higher Secondary School, Dindigul",
    'Soundararaja Vidyalaya Higher Secondary School, Dindigul',
    "St. Joseph's Matriculation Higher Secondary School, Dindigul"
  ]),
  ...named('Tirunelveli', [
    'Caldwell Centenary Memorial Higher Secondary School, Idaiyangudi, Tirunelveli',
    'Chinmaya Vidyalaya Matriculation School, Palayamkottai'
  ]),
  ...named('Erode', [
    'Navarasam Matriculation Higher Secondary School, Erode',
    'Erode Hindu Matriculation Higher Secondary School, Erode',
    'Kongu Matriculation Higher Secondary School, Erode'
  ]),
  ...named('Dharmapuri', [
    'Paramveer Matriculation Higher Secondary School, Dharmapuri',
    'Sri Vidya Mandir Matriculation Higher Secondary School, Dharmapuri'
  ])
]

export const TN_SCHOOLS = [
  ...POPULAR_SCHOOLS,
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
/* ------------------------------------------------------------------ *
 * Popular Tamil Nadu colleges (real institutions: Anna University campuses,
 * government engineering colleges, arts & science colleges and deemed
 * universities) - district-first suggestions use these before the rest.
 * Source: public lists of Anna University affiliated / TN government colleges.
 * ------------------------------------------------------------------ */
export const POPULAR_COLLEGES = [
  ...named('Chennai', [
    'Madras Institute of Technology (MIT), Chromepet, Chennai',
    'Easwari Engineering College, Ramapuram, Chennai',
    'Loyola-ICAM College of Engineering and Technology, Chennai',
    'KCG College of Engineering, Chennai',
    'Meenakshi Sundararajan Engineering College, Kodambakkam',
    'Ethiraj College for Women, Chennai',
    "Queen Mary's College, Chennai"
  ]),
  ...named('Chengalpattu', [
    'B.S. Abdur Rahman Crescent Institute of Science and Technology, Vandalur',
    'SRM Valliammai Engineering College, Kattankulathur',
    'Sri Sairam Institute of Technology, West Tambaram',
    'Agni College of Technology, Thalambur'
  ]),
  ...named('Kancheepuram', ['University College of Engineering, Kanchipuram']),
  ...named('Tiruvallur', [
    'RMK Engineering College, Kavaraipettai',
    'Vel Tech Rangarajan Dr. Sagunthala R&D Institute of Science and Technology, Avadi'
  ]),
  ...named('Coimbatore', [
    'KPR Institute of Engineering and Technology, Coimbatore',
    'Sri Ramakrishna Engineering College, Coimbatore',
    'Karpagam College of Engineering, Coimbatore',
    'SNS College of Technology, Coimbatore',
    'Dr. Mahalingam College of Engineering and Technology, Pollachi',
    'Rathinam Technical Campus, Coimbatore',
    'V.S.B. College of Engineering Technical Campus, Coimbatore'
  ]),
  ...named('Erode', [
    'Government College of Engineering, Erode',
    'Erode Sengunthar Engineering College, Thudupathi'
  ]),
  ...named('Dharmapuri', ['Government College of Engineering, Dharmapuri']),
  ...named('Krishnagiri', ['Adhiyamaan College of Engineering, Hosur']),
  ...named('Namakkal', ['Mahendra Engineering College, Mallasamudram']),
  ...named('Tiruchirappalli', [
    'Saranathan College of Engineering, Tiruchirappalli',
    'Anna University (BIT Campus), Tiruchirappalli',
    'Indian Institute of Information Technology (IIIT), Tiruchirappalli'
  ]),
  ...named('Madurai', [
    'Anna University Campus, Madurai',
    'Velammal College of Engineering and Technology, Madurai',
    'Fatima College, Madurai'
  ]),
  ...named('Dindigul', ['Anna University Campus, Dindigul']),
  ...named('Sivaganga', ['Alagappa Chettiar College of Engineering and Technology, Karaikudi']),
  ...named('Virudhunagar', ['Sethu Institute of Technology, Kariapatti']),
  ...named('Thoothukudi', ['Anna University V.O. Chidambaranar College of Engineering, Thoothukudi']),
  ...named('Kanniyakumari', ['Noorul Islam Centre for Higher Education, Kumaracoil']),
  ...named('Cuddalore', [
    'Anna University Campus, Panruti',
    'CK College of Engineering and Technology, Cuddalore'
  ]),
  ...named('Viluppuram', [
    'Anna University College of Engineering, Viluppuram',
    'Anna University College of Engineering, Tindivanam'
  ]),
  ...named('Tiruvannamalai', ['University College of Engineering, Arni']),
  ...named('Ranipet', ['C. Abdul Hakeem College, Melvisharam']),
  ...named('Tirupathur', ['Sacred Heart College, Tirupattur']),
  ...named('Nagapattinam', [
    'Anna University Campus, Thirukkuvalai',
    'E.G.S. Pillay Arts and Science College, Nagapattinam'
  ]),
  ...named('Ariyalur', ['Anna University Campus, Ariyalur']),
  ...named('Ramanathapuram', [
    'Anna University Campus, Ramanathapuram',
    'Mohamed Sathak Engineering College, Kilakarai'
  ]),
  ...named('Mayiladuthurai', ['Dharmapuram Adhinam Arts College, Mayiladuthurai']),
  ...named('Tiruvarur', ['Central University of Tamil Nadu, Thiruvarur']),
  ...named('Kallakurichi', ['Government Arts and Science College, Kallakurichi']),
  ...named('Tirunelveli', ['Anna University Campus, Tirunelveli'])
]

export const TN_COLLEGES = [
  ...POPULAR_COLLEGES,
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
export function institutionSuggestions(level, district, limit = 400) {
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
