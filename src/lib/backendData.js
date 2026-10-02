/**
 * ============================================================================
 * BACKEND DATA CLONE (1:1 with the Spring Boot backend)
 * ============================================================================
 * This file is a faithful clone of the seed data the backend creates on
 * startup (backend/src/main/java/com/tncolleges/platform/config/DataInitializer.java)
 * and mirrors the JSON field names of the REST API entities
 * (College.java, Course.java, User.java).
 *
 * - When the Spring Boot backend IS running (localhost:8080), api.js fetches
 *   live data from /api/... and this clone is only a fallback.
 * - When the backend is NOT running (e.g. this preview), the frontend is
 *   fully powered by this cloned data.
 *
 * Backend credentials (same as DataInitializer console output):
 *   Super Admin   superadmin@tncolleges.com / superadmin123
 *   PSG Tech      admin@psgtech.ac.in        / psg123
 *   CIT           admin@cit.edu.in           / cit123
 *   KCT           admin@kct.ac.in            / kct123
 *   TCE Madurai   admin@tce.edu.in           / tce123
 *   Student       student@test.com           / student123
 */

// College entities (colleges table) - ids follow H2 auto-increment from 1
export const backendColleges = [
  {
    id: 1,
    slug: 'psg-tech',
    name: 'PSG College of Technology',
    shortName: 'PSG Tech',
    tagline: 'Empowering Innovation Since 1951',
    type: 'Autonomous Engineering College',
    collegeType: 'Autonomous',
    district: 'Coimbatore',
    city: 'Coimbatore',
    affiliation: 'Anna University',
    university: 'Anna University',
    accreditation: 'NAAC A++ • NBA • NIRF 67',
    established: 1951,
    verified: true,
    verificationStatus: 'VERIFIED',
    active: true,
    createdAt: '2026-01-01T09:00:00',
    updatedAt: '2026-01-01T09:00:00',
    // Course entities (courses table) - exactly the 3 courses seeded for PSG
    courses: [
      { id: 1, collegeId: 1, name: 'B.E. Computer Science and Engineering', degreeType: 'B.E', level: 'UG', duration: '4 Years', fees: '₹2,20,000/year', intake: 180, active: true },
      { id: 2, collegeId: 1, name: 'B.Tech Artificial Intelligence & Data Science', degreeType: 'B.Tech', level: 'UG', duration: '4 Years', fees: '₹2,50,000/year', intake: 120, active: true },
      { id: 3, collegeId: 1, name: 'BCA', degreeType: 'BCA', level: 'UG', duration: '3 Years', fees: '₹65,000/year', intake: 120, active: true },
    ],
  },
  {
    id: 2,
    slug: 'cit-coimbatore',
    name: 'Coimbatore Institute of Technology',
    shortName: 'CIT',
    tagline: 'Knowledge is Power',
    type: 'Government Aided Autonomous',
    collegeType: 'Government',
    district: 'Coimbatore',
    city: 'Coimbatore',
    affiliation: 'Anna University',
    university: 'Anna University',
    accreditation: 'NAAC A+ • NBA • NIRF 102',
    established: 1956,
    verified: true,
    verificationStatus: 'VERIFIED',
    active: true,
    createdAt: '2026-01-01T09:00:00',
    updatedAt: '2026-01-01T09:00:00',
    courses: [], // DataInitializer seeds courses only for PSG Tech
  },
  {
    id: 3,
    slug: 'kumaraguru-college',
    name: 'Kumaraguru College of Technology',
    shortName: 'KCT',
    tagline: 'Character is Life',
    type: 'Autonomous Private',
    collegeType: 'Private',
    district: 'Coimbatore',
    city: 'Coimbatore',
    affiliation: 'Anna University',
    university: 'Anna University',
    accreditation: 'NAAC A++ • NBA • NIRF 89',
    established: 1984,
    verified: true,
    verificationStatus: 'VERIFIED',
    active: true,
    createdAt: '2026-01-01T09:00:00',
    updatedAt: '2026-01-01T09:00:00',
    courses: [], // DataInitializer seeds courses only for PSG Tech
  },
  {
    id: 4,
    slug: 'thiyagarajar-engineering',
    name: 'Thiyagarajar College of Engineering',
    shortName: 'TCE Madurai',
    tagline: 'Excellence in Engineering Education Since 1957',
    type: 'Government Aided Autonomous',
    collegeType: 'Autonomous',
    district: 'Madurai',
    city: 'Madurai',
    address: 'Thiruparankundram, Madurai - 625015',
    pincode: '625015',
    phone: '0452 248 2249',
    email: 'admissions@tce.edu',
    website: 'https://www.tce.edu',
    affiliation: 'Anna University',
    university: 'Anna University',
    accreditation: 'NAAC A+ • NBA • AICTE',
    established: 1957,
    principalName: 'Dr. V. Karthikeyan',
    verified: true,
    verificationStatus: 'VERIFIED',
    active: true,
    createdAt: '2026-01-01T09:00:00',
    updatedAt: '2026-01-01T09:00:00',
    branding: {
      logo: '',
      heroImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=500&fit=crop',
      coverImage: '',
      colors: { primary: '#1A3263', secondary: '#547792', accent: '#FAB95B' },
      preset: 'engineering_blue',
    },
    about: {
      overview: 'Thiyagarajar College of Engineering (TCE), Madurai is a government-aided autonomous institution founded in 1957 by Shri Karumuttu Thiagarajan Chettiar. Spread over a serene 140-acre campus at the foot of Thiruparankundram hill, TCE offers UG, PG and research programmes in engineering, technology and management, affiliated to Anna University. Known for its strong industry connect, research centres and rural-innovation focus, TCE has produced generations of engineers serving across the globe.',
      vision: 'To be a centre of excellence in technical education and research, producing competent professionals with ethical values who serve society.',
      mission: [
        'Impart quality technical education with state-of-the-art infrastructure',
        'Promote research, innovation and entrepreneurship among students',
        'Strengthen industry-institute interaction for employability',
        'Instil discipline, ethics and social responsibility',
      ],
    },
    departments: [
      { id: 1, name: 'Computer Science and Engineering', code: 'CSE', hod: 'Dr. S. Rajalakshmi', courses: 3, faculty: 34, icon: '' },
      { id: 2, name: 'Electronics and Communication Engineering', code: 'ECE', hod: 'Dr. M. Ganesh', courses: 2, faculty: 30, icon: '' },
      { id: 3, name: 'Electrical and Electronics Engineering', code: 'EEE', hod: 'Dr. P. Ramesh', courses: 1, faculty: 22, icon: '' },
      { id: 4, name: 'Mechanical Engineering', code: 'MECH', hod: 'Dr. K. Balamurugan', courses: 1, faculty: 32, icon: '' },
      { id: 5, name: 'Civil Engineering', code: 'CIVIL', hod: 'Dr. R. Selvaraj', courses: 1, faculty: 24, icon: '' },
      { id: 6, name: 'Information Technology', code: 'IT', hod: 'Dr. T. Deepa', courses: 1, faculty: 18, icon: '' },
      { id: 7, name: 'Chemical Engineering', code: 'CHEM', hod: 'Dr. N. Loganathan', courses: 1, faculty: 16, icon: '' },
      { id: 8, name: 'School of Management Studies', code: 'MBA', hod: 'Dr. A. Meenakshi', courses: 2, faculty: 20, icon: '' },
    ],
    courses: [
      { id: 1, collegeId: 4, name: 'B.E. Computer Science and Engineering', degree: 'B.E', degreeType: 'B.E', dept: 'CSE', level: 'UG', duration: '4 Years', fees: '₹65,000/year', intake: 180, eligibility: '12th with Maths, Physics, Chemistry via TNEA counselling', active: true },
      { id: 2, collegeId: 4, name: 'B.E. Electronics and Communication Engineering', degree: 'B.E', degreeType: 'B.E', dept: 'ECE', level: 'UG', duration: '4 Years', fees: '₹65,000/year', intake: 120, eligibility: '12th PCM via TNEA', active: true },
      { id: 3, collegeId: 4, name: 'B.E. Electrical and Electronics Engineering', degree: 'B.E', degreeType: 'B.E', dept: 'EEE', level: 'UG', duration: '4 Years', fees: '₹60,000/year', intake: 60, eligibility: '12th PCM via TNEA', active: true },
      { id: 4, collegeId: 4, name: 'B.E. Mechanical Engineering', degree: 'B.E', degreeType: 'B.E', dept: 'MECH', level: 'UG', duration: '4 Years', fees: '₹60,000/year', intake: 120, eligibility: '12th PCM via TNEA', active: true },
      { id: 5, collegeId: 4, name: 'B.E. Civil Engineering', degree: 'B.E', degreeType: 'B.E', dept: 'CIVIL', level: 'UG', duration: '4 Years', fees: '₹60,000/year', intake: 60, eligibility: '12th PCM via TNEA', active: true },
      { id: 6, collegeId: 4, name: 'B.Tech. Information Technology', degree: 'B.Tech', degreeType: 'B.Tech', dept: 'IT', level: 'UG', duration: '4 Years', fees: '₹65,000/year', intake: 60, eligibility: '12th PCM via TNEA', active: true },
      { id: 7, collegeId: 4, name: 'B.Tech. Chemical Engineering', degree: 'B.Tech', degreeType: 'B.Tech', dept: 'CHEM', level: 'UG', duration: '4 Years', fees: '₹58,000/year', intake: 40, eligibility: '12th PCM/B via TNEA', active: true },
      { id: 8, collegeId: 4, name: 'M.E. Computer Science and Engineering', degree: 'M.E', degreeType: 'M.E', dept: 'CSE', level: 'PG', duration: '2 Years', fees: '₹70,000/year', intake: 24, eligibility: 'B.E/B.Tech + TANCET/GATE', active: true },
      { id: 9, collegeId: 4, name: 'MBA', degree: 'MBA', degreeType: 'MBA', dept: 'MBA', level: 'PG', duration: '2 Years', fees: '₹75,000/year', intake: 120, eligibility: 'Any degree + TANCET', active: true },
      { id: 10, collegeId: 4, name: 'MCA', degree: 'MCA', degreeType: 'MCA', dept: 'CSE', level: 'PG', duration: '2 Years', fees: '₹60,000/year', intake: 60, eligibility: 'Any degree with Maths + TANCET', active: true },
    ],
    facilities: [
      { name: 'Central Library', icon: '', description: '1.2 lakh volumes, IEEE/Springer e-journals, digital library, 24/7 reading hall' },
      { name: 'Hostels', icon: '', description: '4 blocks (3 gents + 1 ladies), 2,400+ students capacity, hygienic mess, gym' },
      { name: 'Sports Complex', icon: '', description: '400m track, cricket ground, indoor stadium, basketball/badminton courts, fitness centre' },
      { name: 'Innovation & Incubation Centre', icon: '', description: 'Student startup incubation, 3D printing lab, IoT lab, seed funding support' },
      { name: 'Health Centre', icon: '', description: '24/7 medical care with resident doctor, ambulance on campus' },
      { name: 'Transport', icon: '', description: '40+ buses covering Madurai city and nearby towns' },
      { name: 'Wi-Fi Campus', icon: '', description: 'Gigabit fibre backbone, campus-wide Wi-Fi, 1 Gbps NKN connectivity' },
      { name: 'Placement Cell', icon: '', description: 'Dedicated training on aptitude, coding and soft skills from 2nd year onwards' },
    ],
    hostels: [
      { id: 1, name: 'Gents Hostel Block A & B', type: 'Boys', capacity: 1400, fees: '₹85,000/year (incl. mess)', facilities: 'Wi-Fi, gym, reading room, indoor games', description: 'For UG students, 2-sharing rooms with study tables' },
      { id: 2, name: 'Gents Hostel Block C', type: 'Boys', capacity: 600, fees: '₹90,000/year (incl. mess)', facilities: 'Wi-Fi, gym, laundry', description: 'For PG students and research scholars' },
      { id: 3, name: 'Ladies Hostel', type: 'Girls', capacity: 700, fees: '₹85,000/year (incl. mess)', facilities: 'Wi-Fi, gym, warden, 24/7 security', description: 'Safe, secure premises with CCTV surveillance and lady wardens' },
    ],
    placements: [
      { id: 1, year: '2025', company: 'TCS', package: '4.5 LPA', students: 42, department: 'All branches', logo: '', description: 'Ninja profile offers' },
      { id: 2, year: '2025', company: 'Infosys', package: '4.2 LPA', students: 30, department: 'All branches', logo: '', description: 'Systems engineer role' },
      { id: 3, year: '2025', company: 'Zoho', package: '8.5 LPA', students: 12, department: 'CSE / IT', logo: '', description: 'Member technical staff' },
      { id: 4, year: '2025', company: 'Cognizant', package: '4.75 LPA', students: 35, department: 'All branches', logo: '', description: 'GenC next offers' },
      { id: 5, year: '2025', company: 'Amazon', package: '18 LPA', students: 3, department: 'CSE', logo: '', description: 'SDE-1 role' },
    ],
  },
]

// User entities (users table) - passwords in plain text ONLY because this is
// a dev seed clone; the real backend stores BCrypt hashes.
export const backendUsers = [
  { id: 1, email: 'superadmin@tncolleges.com', password: 'superadmin123', fullName: 'Super Admin', role: 'SUPER_ADMIN', collegeId: null, enabled: true },
  { id: 2, email: 'admin@psgtech.ac.in', password: 'psg123', fullName: 'PSG Tech Admin', role: 'COLLEGE_ADMIN', collegeId: 1, enabled: true },
  { id: 3, email: 'admin@cit.edu.in', password: 'cit123', fullName: 'CIT Admin', role: 'COLLEGE_ADMIN', collegeId: 2, enabled: true },
  { id: 4, email: 'admin@kct.ac.in', password: 'kct123', fullName: 'KCT Admin', role: 'COLLEGE_ADMIN', collegeId: 3, enabled: true },
  { id: 5, email: 'admin@tce.edu.in', password: 'tce123', fullName: 'TCE Madurai Admin', role: 'COLLEGE_ADMIN', collegeId: 4, enabled: true },
  { id: 6, email: 'student@test.com', password: 'student123', fullName: 'Test Student', role: 'STUDENT', collegeId: null, enabled: true },
]

/**
 * Preview branding - the backend's CollegeBranding entity exists but
 * DataInitializer does not seed it yet. These are the official images already
 * referenced by this repo (src/lib/colleges.js) so the cloned data preview
 * looks like the real thing. Remove once colleges upload branding via the CMS.
 */
export const backendBranding = {
  'psg-tech': {
    logo: 'https://www.psgtech.edu/images/psgtech-logo.png',
    heroImage: 'https://www.psgtech.edu/images/slider/foundationday_2026.jpg',
    coverImage: 'https://www.psgtech.edu/images/slider/TheConfluence-2026.jpg',
    colors: { primary: '#1A3263', secondary: '#547792', accent: '#FAB95B' },
    preset: 'psg_real',
  },
}
