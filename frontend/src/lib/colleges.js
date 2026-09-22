export const colleges = [
  {
    id: 101,
    slug: "psg-tech",
    name: "PSG College of Technology",
    shortName: "PSG Tech",
    tagline: "Empowering Innovation Since 1951",
    type: "Autonomous Engineering College",
    district: "Coimbatore",
    affiliation: "Anna University",
    accreditation: "NAAC A++ • NBA • NIRF 67",
    established: 1951,
    verified: true,
    branding: {
      preset: "engineering_blue",
      colors: {
        primary: "#0a1931",
        secondary: "#1e3a5f",
        accent: "#ffcc00",
      },
      logo: "https://images.unsplash.com/photo-1592285897572-ce1be04a3f3a?w=200&h=200&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&h=900&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&h=600&fit=crop",
    },
    location: {
      address: "Peelamedu, Coimbatore - 641004",
      city: "Coimbatore",
      lat: 11.024,
      lng: 77.002,
    },
    quickInfo: {
      courses: 48,
      departments: 15,
      faculty: 450,
      students: 8500,
      placement: "96%",
      campus: "45 Acres"
    },
    about: {
      overview: "PSG College of Technology, an ISO 9001:2015 certified institution is one of the foremost institutions founded by the PSG & Sons' Charities Trust (1926). The College was established in the year 1951 and the Founders wisely decided to locate it in the same campus as the PSG Industrial Institute for effective industry-institute interaction.",
      vision: "To achieve excellence in education and research and nurture engineers with ethics and social responsibility.",
      mission: "To provide quality education, foster research and innovation, and develop professionals with global competence.",
      history: "Founded in 1951 by G.R. Govindarajulu and G. Varadaraj, PSG Tech has grown to become one of India's premier engineering institutions."
    },
    leadership: {
      principal: {
        name: "Dr. K. Prakasan",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        message: "At PSG Tech, we believe in nurturing not just engineers but leaders who will shape the future of technology with ethics and innovation. Our industry-aligned curriculum and world-class research facilities prepare students for global challenges."
      },
      management: [
        { name: "Shri L. Gopalakrishnan", role: "Managing Trustee", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop" },
        { name: "Dr. R. Rudramoorthy", role: "Director", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop" },
      ]
    },
    departments: [
      { id: 1, name: "Computer Science and Engineering", code: "CSE", hod: "Dr. V. Mahesh", courses: 5, faculty: 32, icon: "💻" },
      { id: 2, name: "Mechanical Engineering", code: "MECH", hod: "Dr. S. Ramesh", courses: 4, faculty: 45, icon: "⚙️" },
      { id: 3, name: "Electronics and Communication", code: "ECE", hod: "Dr. K. Priya", courses: 4, faculty: 38, icon: "📡" },
      { id: 4, name: "Electrical and Electronics", code: "EEE", hod: "Dr. M. Kumar", courses: 3, faculty: 28, icon: "⚡" },
      { id: 5, name: "Civil Engineering", code: "CIVIL", hod: "Dr. A. Sharma", courses: 3, faculty: 25, icon: "🏗️" },
    ],
    courses: [
      { id: 1, name: "B.E. Computer Science and Engineering", degree: "B.E", dept: "CSE", duration: "4 Years", intake: 180, fees: "₹2,20,000/year", eligibility: "12th with 60% PCM", level: "UG" },
      { id: 2, name: "B.Tech Artificial Intelligence & Data Science", degree: "B.Tech", dept: "CSE", duration: "4 Years", intake: 120, fees: "₹2,50,000/year", eligibility: "12th with 65% PCM", level: "UG" },
      { id: 3, name: "M.E. Computer Science", degree: "M.E", dept: "CSE", duration: "2 Years", intake: 36, fees: "₹1,20,000/year", eligibility: "B.E/B.Tech with 60%", level: "PG" },
      { id: 4, name: "B.E. Mechanical Engineering", degree: "B.E", dept: "MECH", duration: "4 Years", intake: 120, fees: "₹2,00,000/year", eligibility: "12th with 60% PCM", level: "UG" },
    ],
    facilities: [
      { name: "Central Library", icon: "📚", description: "2.5 Lakh volumes, digital library, 24/7 access" },
      { name: "Hostels", icon: "🏠", description: "Separate hostels for boys & girls, 3000+ capacity" },
      { name: "Sports Complex", icon: "⚽", description: "Olympic size pool, indoor stadium, gym" },
      { name: "Research Centers", icon: "🔬", description: "15 CoEs, 50+ labs, industry collaborations" },
    ],
    placements: {
      highest: "₹54 LPA",
      average: "₹8.5 LPA",
      recruiters: ["Microsoft", "Amazon", "Google", "TCS", "Infosys", "Zoho"],
      percentage: 96
    },
    announcements: [
      { id: 1, title: "Admission Open 2026-27 for B.E/B.Tech", date: "2026-02-15", category: "Admission", urgent: true },
      { id: 2, title: "End Semester Examination Timetable Published", date: "2026-03-10", category: "Examination" },
      { id: 3, title: "International Conference on AI - IC AI 2026", date: "2026-04-05", category: "Events" },
    ],
    events: [
      { id: 1, title: "Kriya 2026 - National Level Tech Fest", date: "2026-03-20", venue: "Main Campus", category: "Technical", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop" },
      { id: 2, title: "Entrepreneurship Summit", date: "2026-03-25", venue: "Auditorium", category: "Workshop", image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1498243793694-111165e63a46?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop",
    ],
    contact: {
      phone: "+91 422 257 2177",
      email: "principal@psgtech.ac.in",
      admissions: "+91 422 257 2177 ext 450",
      address: "Post Box No: 1611, Peelamedu, Coimbatore - 641004"
    },
    social: {
      website: "https://psgtech.edu",
      linkedin: "#",
      instagram: "#",
      youtube: "#"
    },
    customSections: [
      { id: 1, title: "Centre for Excellence in AI", description: "Industry 4.0 ready research centre with Nvidia DGX", icon: "🤖" }
    ]
  },
  {
    id: 102,
    slug: "cit-coimbatore",
    name: "Coimbatore Institute of Technology",
    shortName: "CIT",
    tagline: "Knowledge is Power",
    type: "Government Aided Autonomous",
    district: "Coimbatore",
    affiliation: "Anna University",
    accreditation: "NAAC A+ • NBA • NIRF 102",
    established: 1956,
    verified: true,
    branding: {
      preset: "royal_purple",
      colors: {
        primary: "#2d1b69",
        secondary: "#44337a",
        accent: "#ffd700",
      },
      logo: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=200&h=200&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1498243793694-111165e63a46?w=1600&h=900&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&h=600&fit=crop",
    },
    location: {
      address: "Civil Aerodrome Post, Coimbatore - 641014",
      city: "Coimbatore",
      lat: 11.032,
      lng: 77.026,
    },
    quickInfo: {
      courses: 32,
      departments: 10,
      faculty: 280,
      students: 5200,
      placement: "92%",
      campus: "28 Acres"
    },
    about: {
      overview: "Coimbatore Institute of Technology (CIT) is a government-aided autonomous engineering college located in Coimbatore, Tamil Nadu. Founded in 1956 by V. Rangaswamy Naidu Educational Trust, CIT has been a pioneer in technical education.",
      vision: "To be a centre of excellence in technical education and research",
      mission: "To produce competent engineers with ethical values",
      history: "Established in 1956, CIT was one of the first private engineering colleges in Tamil Nadu."
    },
    leadership: {
      principal: {
        name: "Dr. A. Rajeswari",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
        message: "CIT stands for quality, commitment and competence. Our legacy of 70 years speaks of our dedication to engineering excellence."
      },
      management: [
        { name: "Prof. R. Venkataswamy", role: "Chairman", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop" },
      ]
    },
    departments: [
      { id: 1, name: "Computer Science", code: "CSE", hod: "Dr. S. Karthik", courses: 3, faculty: 22, icon: "💻" },
      { id: 2, name: "Mechanical", code: "MECH", hod: "Dr. R. Kumar", courses: 3, faculty: 30, icon: "⚙️" },
      { id: 3, name: "Civil Engineering", code: "CIVIL", hod: "Dr. L. Meena", courses: 2, faculty: 18, icon: "🏗️" },
    ],
    courses: [
      { id: 1, name: "B.E. Computer Science", degree: "B.E", dept: "CSE", duration: "4 Years", intake: 120, fees: "₹85,000/year", eligibility: "TNEA", level: "UG" },
      { id: 2, name: "B.E. Mechanical", degree: "B.E", dept: "MECH", duration: "4 Years", intake: 120, fees: "₹85,000/year", eligibility: "TNEA", level: "UG" },
    ],
    facilities: [
      { name: "Library", icon: "📚", description: "1.2 Lakh books, e-journals" },
      { name: "Hostel", icon: "🏠", description: "Govt aided hostel facilities" },
      { name: "Sports", icon: "🏏", description: "Large playground, indoor games" },
    ],
    placements: {
      highest: "₹28 LPA",
      average: "₹6.2 LPA",
      recruiters: ["TCS", "Wipro", "L&T", "Cognizant"],
      percentage: 92
    },
    announcements: [
      { id: 1, title: "TNEA Counselling 2026 Schedule Released", date: "2026-03-01", category: "Admission", urgent: true },
    ],
    events: [
      { id: 1, title: "Tech Symposium 2026", date: "2026-04-10", venue: "CIT Campus", category: "Technical", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=400&fit=crop" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1498243793694-111165e63a46?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
    ],
    contact: {
      phone: "+91 422 257 4071",
      email: "principal@cit.edu.in",
      admissions: "+91 422 257 4072",
      address: "Civil Aerodrome Post, Coimbatore - 641014"
    },
    social: { website: "https://cit.edu.in", linkedin: "#", instagram: "#", youtube: "#" },
    customSections: []
  },
  {
    id: 103,
    slug: "kumaraguru-college",
    name: "Kumaraguru College of Technology",
    shortName: "KCT",
    tagline: "Character is Life",
    type: "Autonomous Private",
    district: "Coimbatore",
    affiliation: "Anna University",
    accreditation: "NAAC A++ • NBA • NIRF 89",
    established: 1984,
    verified: true,
    branding: {
      preset: "forest_green",
      colors: {
        primary: "#0a3d2e",
        secondary: "#14543f",
        accent: "#f0c040",
      },
      logo: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&h=200&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&h=900&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&h=600&fit=crop",
    },
    location: {
      address: "Athipalayam Road, Chinnavedampatti, Coimbatore - 641049",
      city: "Coimbatore",
      lat: 11.077,
      lng: 77.033,
    },
    quickInfo: {
      courses: 42,
      departments: 14,
      faculty: 380,
      students: 6800,
      placement: "94%",
      campus: "150 Acres"
    },
    about: {
      overview: "Kumaraguru College of Technology (KCT), Coimbatore is a private Engineering College started in 1984 under the auspices of Ramanandha Adigalar Foundation. It is located in a sprawling 150-acre campus with excellent infrastructure.",
      vision: "To become a leader in education, training and research",
      mission: "To provide quality education and promote research",
      history: "Founded in 1984, KCT has emerged as one of the top engineering colleges in Tamil Nadu."
    },
    leadership: {
      principal: {
        name: "Dr. M. Ezhilarasi",
        photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
        message: "At KCT, we focus on holistic development - academic excellence with strong ethical foundation. Our green campus nurtures innovation."
      },
      management: [
        { name: "Shri Shankar Vanavarayar", role: "Joint Correspondent", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop" },
      ]
    },
    departments: [
      { id: 1, name: "Computer Science", code: "CSE", hod: "Dr. R. Deepa", courses: 4, faculty: 35, icon: "💻" },
      { id: 2, name: "Biotechnology", code: "BIO", hod: "Dr. K. Suresh", courses: 2, faculty: 18, icon: "🧬" },
      { id: 3, name: "Aeronautical", code: "AERO", hod: "Dr. P. Karthik", courses: 2, faculty: 20, icon: "✈️" },
    ],
    courses: [
      { id: 1, name: "B.E. CSE", degree: "B.E", dept: "CSE", duration: "4 Years", intake: 180, fees: "₹1,80,000/year", eligibility: "12th 60%", level: "UG" },
      { id: 2, name: "B.Tech Biotechnology", degree: "B.Tech", dept: "BIO", duration: "4 Years", intake: 60, fees: "₹1,80,000/year", eligibility: "12th 60%", level: "UG" },
    ],
    facilities: [
      { name: "KCT Library", icon: "📚", description: "Modern library with 1.8 lakh volumes" },
      { name: "Green Campus", icon: "🌳", description: "150 acres lush green, carbon neutral initiatives" },
      { name: "Garage", icon: "🏎️", description: "Student racing team, SAE clubs" },
    ],
    placements: {
      highest: "₹42 LPA",
      average: "₹7.2 LPA",
      recruiters: ["Zoho", "TCS", "Infosys", "Bosch"],
      percentage: 94
    },
    announcements: [
      { id: 1, title: "KCT Admission 2026 Open - Apply Now", date: "2026-02-20", category: "Admission", urgent: true },
    ],
    events: [
      { id: 1, title: "Yugam 2026 - Cultural Fest", date: "2026-03-15", venue: "KCT Campus", category: "Cultural", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1562774053-701939374585?w=800&h=600&fit=crop",
    ],
    contact: {
      phone: "+91 422 266 1100",
      email: "info@kct.ac.in",
      admissions: "+91 422 266 1122",
      address: "Athipalayam Road, Coimbatore - 641049"
    },
    social: { website: "https://kct.ac.in", linkedin: "#", instagram: "#", youtube: "#" },
    customSections: [
      { id: 1, title: "KCT Garage", description: "Award winning student racing team", icon: "🏁" },
      { id: 2, title: "I-Cell", description: "Innovation & Entrepreneurship Cell", icon: "💡" }
    ]
  },
  {
    id: 104,
    slug: "psg-cas",
    name: "PSG College of Arts & Science",
    shortName: "PSG CAS",
    tagline: "Excellence in Arts and Science Education",
    type: "Autonomous Arts & Science",
    district: "Coimbatore",
    affiliation: "Bharathiar University",
    accreditation: "NAAC A++ • NIRF 11",
    established: 1947,
    verified: true,
    branding: {
      preset: "arts_maroon",
      colors: {
        primary: "#4a0f1c",
        secondary: "#7a1f32",
        accent: "#c9a86a",
      },
      logo: "https://images.unsplash.com/photo-1498243793694-111165e63a46?w=200&h=200&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&h=900&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&h=600&fit=crop",
    },
    location: {
      address: "Civil Aerodrome Post, Coimbatore - 641014",
      city: "Coimbatore",
      lat: 11.03,
      lng: 77.02,
    },
    quickInfo: {
      courses: 68,
      departments: 22,
      faculty: 520,
      students: 11200,
      placement: "88%",
      campus: "50 Acres"
    },
    about: {
      overview: "PSG College of Arts and Science was founded in the year 1947 by the PSG & Sons Charities Trust. It is one of the premier institutions in Tamil Nadu with a long history of academic excellence.",
      vision: "To be a centre of excellence in higher education",
      mission: "To impart quality education in Arts and Science",
      history: "Established in 1947, PSG CAS is one of the oldest arts colleges in Coimbatore."
    },
    leadership: {
      principal: {
        name: "Dr. D. Brindha",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
        message: "We nurture creativity, critical thinking and cultural values. Our students excel in both academics and extracurriculars."
      },
      management: []
    },
    departments: [
      { id: 1, name: "Computer Science", code: "CS", hod: "Dr. A. Kumar", courses: 6, faculty: 28, icon: "💻" },
      { id: 2, name: "Commerce", code: "COM", hod: "Dr. S. Priya", courses: 8, faculty: 35, icon: "📊" },
      { id: 3, name: "English Literature", code: "ENG", hod: "Dr. R. Lakshmi", courses: 4, faculty: 18, icon: "📖" },
    ],
    courses: [
      { id: 1, name: "B.Sc Computer Science", degree: "B.Sc", dept: "CS", duration: "3 Years", intake: 120, fees: "₹45,000/year", eligibility: "12th Pass", level: "UG" },
      { id: 2, name: "B.Com", degree: "B.Com", dept: "COM", duration: "3 Years", intake: 180, fees: "₹35,000/year", eligibility: "12th Pass", level: "UG" },
      { id: 3, name: "BCA", degree: "BCA", dept: "CS", duration: "3 Years", intake: 120, fees: "₹50,000/year", eligibility: "12th with Maths", level: "UG" },
    ],
    facilities: [
      { name: "Library", icon: "📚", description: "2 lakh books, rare collections" },
      { name: "Auditorium", icon: "🎭", description: "2000 capacity, cultural events" },
    ],
    placements: { highest: "₹18 LPA", average: "₹4.5 LPA", recruiters: ["TCS", "Infosys", "Wipro"], percentage: 88 },
    announcements: [
      { id: 1, title: "UG Admission 2026 Open", date: "2026-03-05", category: "Admission", urgent: true },
    ],
    events: [
      { id: 1, title: "Literary Fest 2026", date: "2026-03-18", venue: "Main Hall", category: "Cultural", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop",
    ],
    contact: {
      phone: "+91 422 257 2177",
      email: "principal@psgcas.ac.in",
      admissions: "+91 422 257 2222",
      address: "Avinashi Road, Coimbatore - 641014"
    },
    social: { website: "https://psgcas.ac.in", linkedin: "#", instagram: "#", youtube: "#" },
    customSections: []
  },
  {
    id: 105,
    slug: "sri-krishna-arts",
    name: "Sri Krishna Arts and Science College",
    shortName: "SKASC",
    tagline: "Knowledge, Love and Service",
    type: "Autonomous Arts & Science",
    district: "Coimbatore",
    affiliation: "Bharathiar University",
    accreditation: "NAAC A+ • NIRF 45",
    established: 1997,
    verified: true,
    branding: {
      preset: "corporate_slate",
      colors: {
        primary: "#111827",
        secondary: "#1f2937",
        accent: "#f59e0b",
      },
      logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1498243793694-111165e63a46?w=1600&h=900&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&h=600&fit=crop",
    },
    location: {
      address: "Sugunapuram, Kuniamuthur, Coimbatore - 641008",
      city: "Coimbatore",
      lat: 11.01,
      lng: 76.95,
    },
    quickInfo: {
      courses: 45,
      departments: 18,
      faculty: 320,
      students: 7500,
      placement: "90%",
      campus: "18 Acres"
    },
    about: {
      overview: "Sri Krishna Arts and Science College is an autonomous institution established in 1997, known for its academic excellence and industry connect.",
      vision: "To be a globally recognized institution",
      mission: "To provide holistic education",
      history: "Founded in 1997 by VLB Trust"
    },
    leadership: {
      principal: {
        name: "Dr. K. Sundararaman",
        photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
        message: "We prepare students for global careers with strong foundation in values."
      },
      management: []
    },
    departments: [
      { id: 1, name: "BCA", code: "BCA", hod: "Dr. M. Priya", courses: 3, faculty: 22, icon: "💻" },
      { id: 2, name: "Management", code: "MBA", hod: "Dr. R. Suresh", courses: 4, faculty: 18, icon: "📈" },
    ],
    courses: [
      { id: 1, name: "BCA", degree: "BCA", dept: "BCA", duration: "3 Years", intake: 240, fees: "₹65,000/year", eligibility: "12th Pass", level: "UG" },
      { id: 2, name: "BBA", degree: "BBA", dept: "MBA", duration: "3 Years", intake: 120, fees: "₹55,000/year", eligibility: "12th Pass", level: "UG" },
    ],
    facilities: [
      { name: "Placement Cell", icon: "💼", description: "Dedicated training & placement" },
    ],
    placements: { highest: "₹22 LPA", average: "₹5.2 LPA", recruiters: ["Amazon", "TCS", "Accenture"], percentage: 90 },
    announcements: [{ id: 1, title: "Admission 2026 Open for BCA/BBA", date: "2026-02-28", category: "Admission", urgent: true }],
    events: [],
    gallery: ["https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=600&fit=crop"],
    contact: { phone: "+91 422 267 8400", email: "info@skasc.ac.in", admissions: "+91 422 267 8401", address: "Kuniamuthur, Coimbatore" },
    social: { website: "https://skasc.ac.in", linkedin: "#", instagram: "#", youtube: "#" },
    customSections: []
  },
  {
    id: 106,
    slug: "coimbatore-medical",
    name: "Coimbatore Medical College",
    shortName: "CMC",
    tagline: "Service to Humanity Through Medicine",
    type: "Government Medical College",
    district: "Coimbatore",
    affiliation: "TN Dr. MGR Medical University",
    accreditation: "NMC • NAAC A",
    established: 1966,
    verified: true,
    branding: {
      preset: "medical_teal",
      colors: {
        primary: "#0c4a6e",
        secondary: "#075985",
        accent: "#06b6d4",
      },
      logo: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop",
      heroImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&h=900&fit=crop",
      coverImage: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1600&h=600&fit=crop",
    },
    location: {
      address: "Avinashi Road, Peelamedu, Coimbatore - 641014",
      city: "Coimbatore",
      lat: 11.02,
      lng: 77.01,
    },
    quickInfo: {
      courses: 18,
      departments: 22,
      faculty: 280,
      students: 1200,
      placement: "100%",
      campus: "35 Acres"
    },
    about: {
      overview: "Coimbatore Medical College is a premier government medical institution established in 1966, attached to Coimbatore Medical College Hospital.",
      vision: "To be a centre of excellence in medical education",
      mission: "To produce competent doctors with compassion",
      history: "Established in 1966, CMC has served Tamil Nadu for over 50 years."
    },
    leadership: {
      principal: {
        name: "Dr. A. Nirmala",
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
        message: "We are committed to producing doctors who serve with skill and compassion."
      },
      management: []
    },
    departments: [
      { id: 1, name: "General Medicine", code: "MED", hod: "Dr. R. Kumar", courses: 2, faculty: 18, icon: "🩺" },
      { id: 2, name: "Surgery", code: "SURG", hod: "Dr. S. Meena", courses: 2, faculty: 15, icon: "🏥" },
    ],
    courses: [
      { id: 1, name: "MBBS", degree: "MBBS", dept: "MED", duration: "5.5 Years", intake: 150, fees: "₹15,000/year", eligibility: "NEET", level: "UG" },
      { id: 2, name: "MD General Medicine", degree: "MD", dept: "MED", duration: "3 Years", intake: 12, fees: "₹25,000/year", eligibility: "NEET PG", level: "PG" },
    ],
    facilities: [
      { name: "Hospital", icon: "🏥", description: "1200 bedded teaching hospital" },
      { name: "Library", icon: "📚", description: "Medical library with 30k books" },
    ],
    placements: { highest: "-", average: "-", recruiters: ["Govt Hospitals", "Private Hospitals"], percentage: 100 },
    announcements: [{ id: 1, title: "NEET PG Counselling 2026", date: "2026-03-12", category: "Admission" }],
    events: [],
    gallery: ["https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop"],
    contact: { phone: "+91 422 257 4375", email: "deancmc@tn.gov.in", admissions: "+91 422 257 4376", address: "Avinashi Road, Coimbatore" },
    social: { website: "https://cmc.co.in", linkedin: "#", instagram: "#", youtube: "#" },
    customSections: []
  }
]

export const districts = ["Coimbatore", "Chennai", "Madurai", "Trichy", "Salem", "Tirunelveli", "Erode", "Tirupur"]
export const collegeTypes = ["Engineering", "Arts & Science", "Medical", "Management", "Law", "Agriculture"]
export const courseTypes = ["B.E", "B.Tech", "B.Sc", "BCA", "BBA", "B.Com", "M.E", "MBA", "MBBS", "M.Sc"]
