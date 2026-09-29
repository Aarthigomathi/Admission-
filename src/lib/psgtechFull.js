/**
 * 100% PSG College of Technology data from www.psgtech.edu
 * All sections, all programmes, all centres, all info
 * Source: https://www.psgtech.edu/ + /abtcllg.php + /placements/programmes.php
 */

export const psgTechFullData = {
  // From abtcllg.php
  about: {
    title: "About the College",
    fullText: `PSG College of Technology, is a Govt. Aided, Autonomous, Affiliated to Anna University and ISO 9001:2015 certified Institution. This is one of the foremost institutions founded by the PSG & Sons' Charities Trust (1926). The College was established in the year 1951 and the Founders wisely decided to locate it in the same campus as the PSG Industrial Institute for effective industry-institute interaction.

The PSG College of Technology is situated at about 8 km from Coimbatore Railway Station and 5 km from Airport. The campus is spread over 45 acres of land, economically utilized for the College, Hostels, Staff Quarters, Play Fields and Gardens.

PSG College of Technology, under the guidance of illustrious Managing Trustees Sri G R Govindarajulu, Dr G R Damodaran, Sri G Varadaraj, Sri G R Karthikeyan, Sri V. Rajan, Sri G.Rangaswamy and presently under Sri L Gopalakrishnan, all with foresight and far reaching vision, has been in the forefront of innovation in technical education. The founder Principal Dr G R Damodaran was instrumental in the planned growth of the institution from the humble beginnings in 1951 to the present status of a world-renowned technological institution. Dr G R Damodaran was succeeded by Dr R Subbayyan, Dr K Venkataraman, Dr A Shanmugasundaram, Dr S Subramanyan, Dr P Radhakrishnan, Dr S Vijayarangan, Dr R Rudramoorthy and Dr K Prakasan as Principal's. Presently Dr. G. Thilagavathi is Principal (FAC).

The College today has a student strength of about 8518 with 15 engineering and technology departments besides the computer applications, management sciences, basic sciences and humanities departments. The college offers 21 Undergraduate programmes including BE/BTech/BSc and 24 Postgraduate programmes including ME/MTech/MSc (5 year Integrated)/MSc (2 year)/MBA/MCA. Among the various Undergraduate and Postgraduate programmes offered by the college, as many as 18 programmes were accredited in the year 1997 itself by the National Board of Accreditation of AICTE. The departments are greatly benefited by the expertise of more than 15 visiting faculty from renowned institutions and industries. Each department conducts annually at least one National / International Conference / Seminar / Workshop for effective dissemination of state-of-art technologies and research findings for the benefit of teaching faculty and industries. On an average every year, five short term programmes on current topics of interest are conducted for the teaching faculty from other colleges with funding from AICTE / ISTE and other agencies.

More than 505 research scholars are pursuing research programmes leading to Ph D / MS / M Tech degrees and the college is a recognized QIP centre for Postgraduate and Ph D programmes.

The college is extremely proud of its alumni, a considerable number of them being entrepreneurs or senior executives in industries both within India and abroad. Some of them are holding prestigious positions like Chief Executive and Managing Director and also as Chairmen of various disciplines in universities abroad. A good number of our alumni occupied the position of Vice Chancellor in various reputed universities in India. A few educational institutions have also been established by our alumni.

The programmes of the college are recognized all over India and abroad. The college maintains close interaction with several R&D Institutions and institutions of higher learning in India and abroad, through institutional network programmes and collaborative research programmes. It also has close collaborative links with industries in the fields of Automotive, Aerospace, Defence, Textile, Machine Tools, Software Development and Consumer durables.

The college has been the recipient of several prestigious projects and International funding support. The college was conferred the AUTONOMOUS STATUS by the University of Madras in the academic year 1978-79, which is continued by the Bharathiar University and subsequently by Anna University. This enables the college to frame its own curricula, update syllabi and introduce new courses as and when needed. The college is empowered to administer its own evaluation system.

The college has signed MoU with research organizations and industries in order to promote closer interaction with other institutions in the areas of technology development, training of students, curriculum updating and development of state-of-art centres.`,
    vision: "PSG College of Technology aspires to be recognised as one of the leaders in engineering education, research and application of knowledge to benefit society.",
    mission: [
      "Provide world-class Engineering Education, foster Research and Development",
      "Evolve Innovative applications of Technology",
      "Encourage Entrepreneurship",
      "Ultimately mould young men and women capable of assuming Leadership of the society for the betterment of the country"
    ],
    trustees: [
      "Sri G R Govindarajulu",
      "Dr G R Damodaran (Founder Principal)",
      "Sri G Varadaraj",
      "Sri G R Karthikeyan",
      "Sri V. Rajan",
      "Sri G. Rangaswamy",
      "Presently Sri L Gopalakrishnan"
    ],
    principals: [
      "Dr G R Damodaran - Founder",
      "Dr R Subbayyan",
      "Dr K Venkataraman",
      "Dr A Shanmugasundaram",
      "Dr S Subramanyan",
      "Dr P Radhakrishnan",
      "Dr S Vijayarangan",
      "Dr R Rudramoorthy",
      "Dr K Prakasan",
      "Presently Dr G. Thilagavathi (FAC) / Dr P R Thyla (FAC) - as per latest"
    ],
    studentStrength: 8518,
    researchScholars: 505,
    departmentsCount: 15,
    ugProgrammes: 21,
    pgProgrammes: 24,
    accredited1997: 18,
    visitingFaculty: 15,
    qipCentre: true,
    autonomousSince: "1978-79 by University of Madras, continued by Bharathiar University, now Anna University"
  },

  // From placements/programmes.php - 100% programmes
  programmes: {
    be_btech: [
      { name: "B.E Automobile Engineering", code: "AUTO", duration: "4 Years", type: "BE", link: "https://www.psgtech.edu/placements/progr_detail.php?id=41", syllabus: "Automobile Engineering - Courses of Study" },
      { name: "B.E Biomedical Engineering", code: "BME", duration: "4 Years", type: "BE", link: "https://www.psgtech.edu/placements/progr_detail.php?id=47" },
      { name: "B.E Civil Engineering", code: "CIVIL", duration: "4 Years", type: "BE", link: "https://www.psgtech.edu/placements/progr_detail.php?id=17" },
      { name: "B.E Computer Science and Engineering", code: "CSE", duration: "4 Years", type: "BE", intake: 240, link: "https://www.psgtech.edu/placements/progr_detail.php?id=38" },
      { name: "B.E Computer Science and Engineering (AI and ML)", code: "CSE-AIML", duration: "4 Years", type: "BE", intake: 60, link: "https://www.psgtech.edu/placements/progr_detail.php?id=136" },
      { name: "B.E Electrical and Electronics Engineering", code: "EEE", duration: "4 Years", type: "BE", intake: 120, link: "https://www.psgtech.edu/placements/progr_detail.php?id=1" },
      { name: "B.E Electronics and Communication Engineering", code: "ECE", duration: "4 Years", type: "BE", intake: 120, link: "https://www.psgtech.edu/placements/progr_detail.php?id=90" },
      { name: "B.E Instrumentation and Control Engineering", code: "ICE", duration: "4 Years", type: "BE", link: "https://www.psgtech.edu/placements/progr_detail.php?id=73" },
      { name: "B.E Mechanical Engineering", code: "MECH", duration: "4 Years", type: "BE", intake: 120, link: "https://www.psgtech.edu/placements/progr_detail.php?id=97" },
      { name: "B.E Production Engineering", code: "PROD", duration: "4 Years", type: "BE", link: "https://www.psgtech.edu/placements/progr_detail.php?id=64" },
      { name: "B.E Robotics and Automation", code: "R&A", duration: "4 Years", type: "BE", link: "https://www.psgtech.edu/placements/progr_detail.php?id=32" },
      { name: "B.Tech Bio Technology", code: "BIOTECH", duration: "4 Years", type: "BTech", link: "https://www.psgtech.edu/placements/progr_detail.php?id=45" },
      { name: "B.Tech Fashion Technology", code: "FT", duration: "4 Years", type: "BTech", link: "https://www.psgtech.edu/placements/progr_detail.php?id=59" },
      { name: "B.Tech Information Technology", code: "IT", duration: "4 Years", type: "BTech", intake: 138, link: "https://www.psgtech.edu/placements/progr_detail.php?id=162" },
      { name: "B.Tech Textile Technology", code: "TEX", duration: "4 Years", type: "BTech", link: "https://www.psgtech.edu/placements/progr_detail.php?id=116" },
      { name: "B.E Metallurgical Engineering", code: "META", duration: "4 Years", type: "BE", link: "https://www.psgtech.edu/placements/progr_detail.php?id=83" },
      { name: "B.E Mechanical Engineering (Sandwich)", code: "MECH-SW", duration: "5 Years", type: "BE Sandwich", intake: 60 },
      { name: "B.E Electrical and Electronics Engineering (Sandwich)", code: "EEE-SW", duration: "5 Years", type: "BE Sandwich" },
      { name: "B.E Production Engineering (Sandwich)", code: "PROD-SW", duration: "5 Years", type: "BE Sandwich" },
      { name: "B.Tech Artificial Intelligence & Data Science", code: "AI-DS", duration: "4 Years", type: "BTech", intake: 120 },
    ],
    me_mtech: [
      { name: "M.E Automotive Engineering", type: "ME" },
      { name: "M.E Biometrics and Cybersecurity", type: "ME" },
      { name: "M.E Computer Science and Engineering", type: "ME" },
      { name: "M.E Control Systems", type: "ME" },
      { name: "M.E Embedded & Real-Time Systems", type: "ME" },
      { name: "M.E Engineering Design", type: "ME" },
      { name: "M.E Industrial Engineering", type: "ME" },
      { name: "M.E Industrial Metallurgy", type: "ME" },
      { name: "M.E Manufacturing Engineering", type: "ME" },
      { name: "M.E Power Electronics and Drives", type: "ME" },
      { name: "M.E Structural Engineering", type: "ME" },
      { name: "M.E VLSI Design", type: "ME" },
      { name: "M.E Infrastructural Engineering", type: "ME" },
      { name: "M.E Virtual Prototyping & Digital Manufacturing", type: "ME" },
      { name: "M.E Wireless Communication", type: "ME" },
      { name: "M.Tech Bio Technology", type: "MTech" },
      { name: "M.Tech Nano Science and Technology", type: "MTech" },
      { name: "M.Tech Information Technology", type: "MTech" },
      { name: "M.Tech Textile Technology", type: "MTech" },
    ],
    msc_mca_mba: [
      { name: "Master of Computer Applications (MCA)", duration: "2 Years", type: "MCA" },
      { name: "M.Sc Fashion Design & Merchandising - 5 Years Integrated", duration: "5 Years", type: "MSc Integrated" },
      { name: "M.Sc Applied Mathematics", duration: "2 Years", type: "MSc" },
      { name: "M.Sc Software Systems - 5 Years Integrated", duration: "5 Years", type: "MSc Integrated" },
      { name: "M.Sc Theoretical Computer Science - 5 Years Integrated", duration: "5 Years", type: "MSc Integrated" },
      { name: "M.Sc Data Science - 5 Years Integrated", duration: "5 Years", type: "MSc Integrated" },
      { name: "M.Sc Cyber Security - 5 Years Integrated", duration: "5 Years", type: "MSc Integrated" },
      { name: "MBA", duration: "2 Years", type: "MBA" },
      { name: "MBA Waste Management & Social Entrepreneurship", duration: "2 Years", type: "MBA" },
    ],
    bsc: [
      { name: "BSc Applied Science", duration: "3 Years", type: "BSc" },
      { name: "BSc Computer Systems and Design", duration: "3 Years", type: "BSc" },
    ],
    phd: [
      { name: "Ph.D - All Engineering Departments", type: "PhD" },
      { name: "MS (By Research)", type: "MS" },
      { name: "M.Tech (By Research)", type: "MTech Research" },
      { name: "QIP Centre for PG and PhD", type: "QIP" },
    ]
  },

  advancedCentres: [
    { name: "CAD/CAM/CIM Centre", funding: "MHRD, DST", description: "Computer Aided Design/Manufacturing" },
    { name: "Virtual Reality Centre", funding: "MHRD", description: "VR research and applications" },
    { name: "Virtual Instrumentation Centre", funding: "MHRD", description: "VI and LabVIEW" },
    { name: "Educational Technology Centre", funding: "MHRD", description: "EdTech and e-learning" },
    { name: "Centre for Non-Formal and Continuing Education", funding: "MHRD", description: "Continuing education" },
    { name: "PROJECT IMPACT Centre", funding: "World Bank, Swiss Development Corporation, Govt of India", description: "World Bank funded project" },
    { name: "UNDP Jute Project Centre", funding: "UNDP", description: "Jute technology" },
    { name: "TIFAC - CORE", funding: "DST, TIFAC", description: "Technology Information Forecasting and Assessment Council - Centre of Relevance and Excellence" },
    { name: "Rapid Prototyping and Manufacturing Centre", funding: "DST", description: "3D printing and rapid manufacturing" },
    { name: "Festo-PSG Centre for Pneumatic and Control Engineering", funding: "Festo, Germany", description: "Pneumatics and automation" },
    { name: "Metals Testing and Research Centre", funding: "Industry", description: "Metallurgical testing" },
    { name: "Industry Institute Partnership Cell (IIPC)", funding: "AICTE", description: "Industry collaboration" },
    { name: "CII - TDB TNET Centre", funding: "CII, TDB", description: "Technology Business Incubator" },
    { name: "PSG-TI Centre for Medical Electronics", funding: "Texas Instruments", description: "Medical electronics and healthcare tech" },
    { name: "PSG-Intel Centre of Excellence in VLSI System Design", funding: "Intel", description: "VLSI and high-performance computing" },
    { name: "PSG-FANUC Centre for Advanced CNC and Robotics", funding: "FANUC", description: "Industry 4.0, CNC, Robotics" },
    { name: "PSG-Adept Centre for Robotics", funding: "Adept", description: "Robotics and automation" },
    { name: "PSG-Prosun Centre of Excellence for Solar PV Systems", funding: "Prosun", description: "Solar energy" },
    { name: "PSG-Danfoss Centre for Excellence in Climate and Energy", funding: "Danfoss", description: "Climate and energy solutions" },
  ],

  // From homepage
  highlights: {
    iso: "ISO 9001:2015 certified",
    established: "1951 by PSG & Sons Charities Trust (1926)",
    campus: "45 acres, 8km from Railway Station, 5km from Airport, Peelamedu, Coimbatore",
    autonomous: "Since 1978-79 University of Madras, continued by Bharathiar University, now Anna University",
    studentStrength: 8518,
    researchScholars: 505,
    accreditation: "18 programmes accredited in 1997 by NBA AICTE",
    visitingFaculty: "15+ from renowned institutions and industries",
    alumni: "Entrepreneurs, senior executives, CEOs, MDs, Chairmen, Vice Chancellors, educational institutions established by alumni",
    collaborations: "R&D Institutions, higher learning in India and abroad, Automotive, Aerospace, Defence, Textile, Machine Tools, Software Development, Consumer durables",
    mou: "MoU with research organizations and industries for technology development, training, curriculum updating, state-of-art centres",
    funding: "Prestigious projects and International funding support"
  },

  campusFacilities: {
    library: {
      name: "Central Library",
      established: 1951,
      volumes: "More than one lakh book volumes",
      description: "Our Library was established in the year 1951. It holds more than one lakh book volumes."
    },
    hostel: {
      name: "Hostel",
      description: "Our College facilitate students an excellent Hostel facility to feel home away from home."
    },
    placement: {
      name: "Placement",
      description: "Placement Office facilitating campus recruitment for multinational and national organizations.",
      companies: 90,
      topRecruiters: ["ABB Limited", "Adobe Systems", "ACC Limited", "Microsoft", "Amazon", "Google", "TCS", "Infosys", "Zoho"]
    },
    other: ["Cafeteria", "Sports Complex", "Gym", "Hospital and Medical", "Labs", "Hall Facilities", "Staff Quarters", "Play Fields", "Gardens"]
  },

  // Events from homepage slider
  eventsFromHomepage: [
    { title: "Interactive Session with Prof. Sudhir K. Jain for Administrators, Faculty Members, and Students", image: "https://www.psgtech.edu/images/slider/Interactivesession_jains.jpg" },
    { title: "Foundation Day 2026", image: "https://www.psgtech.edu/images/slider/foundationday_2026.jpg" },
    { title: "Orientation Programme for First Year B.E./B.Tech. Students – 2026", image: "https://www.psgtech.edu/images/slider/Orientation_2026.jpg" },
    { title: "Faculty Interactive Session with Shri. Shyam Srinivasan, Former MD & CEO, Federal Bank; Advisory Committee Member, Reserve Bank of India; and Senior Advisor, TVS Capital Funds", image: "https://www.psgtech.edu/images/slider/Facultyinteraction_1.jpg" },
    { title: "Faculty Interactive Session with Prof. Govindan Rangarajan, Director, IISc Bengaluru", image: "https://www.psgtech.edu/images/slider/faculty_interaction_section.jpg" },
    { title: "Research Conclave 2026 – Inaugural and Valedictory Function", image: "https://www.psgtech.edu/images/slider/RC2026.jpg", date: "14-15 May 2026", description: "Relevant Applications of Knowledge through Scientific Research - dynamic platform for interdisciplinary collaboration, innovation, and dissemination of cutting-edge research" },
    { title: "Award Ceremony 2026 – Departments of Automobile, Civil, Mechanical, Metallurgical, and Production Engineering", image: "https://www.psgtech.edu/images/slider/AwardCeremony2026-AUT_Mech_MTL_PRO.jpg" },
    { title: "Award Ceremony 2026 – Departments of BME, BioTech, CSE and IT", image: "https://www.psgtech.edu/images/slider/AwardCeremony2026-BME-BioTech-CSEIT.jpg" },
    { title: "Award Ceremony 2026 – Science Stream", image: "https://www.psgtech.edu/images/slider/AwardCeremony2026-ScienceStream.jpg" },
    { title: "Award Ceremony 2026 – Electrical and Allied Engineering Programmes, held on 3 July 2026", image: "https://www.psgtech.edu/images/slider/AwardCeremony_2026_ElectricalAlliedEngineering.jpg", date: "3 July 2026" },
    { title: "The Confluence 2026 - Research, Innovation & Technology Summit held on Feb 7, 2026", image: "https://www.psgtech.edu/images/slider/TheConfluence-2026.jpg", date: "Feb 7, 2026" },
    { title: "National Voters’ Day Observed at PSG College of Technology on 25.01.2026 in the esteemed Presence of the District Collector, Coimbatore", image: "https://www.psgtech.edu/images/slider/votersDayImage_1.jpg", date: "25.01.2026" },
    { title: "Viksit Bharat @ 2047", image: "https://www.psgtech.edu/images/slider/viksit@2047_image.webp" },
    { title: "Dr. Dinesh Singh - Special talk on Education for the 21st Century", image: "https://www.psgtech.edu/images/slider/slider_Dinesh1.webp" },
    { title: "Students Interaction section with Dr K Sivan, Chairman, ISRO", image: "https://www.psgtech.edu/images/slider/slider_shivan1.webp" },
  ],

  pastEvents: [
    { title: "Teachers' Day Celebrations 2025", date: "5th Sep 2025", image: "https://www.psgtech.edu/images/TeachersDay2025.JPG" },
    { title: "PSG CT Triumphs at IISF Space India Hackathon 2023", description: "We excelled at the IISF 2023 and the Space India Hackathon organized by ISRO and other esteemed organizations, with two participant teams winning and securing runner-up positions", image: "https://www.psgtech.edu/images/slider/IISF.jpg", report: "https://www.psgtech.edu/files/general/IISF-Report.pdf" },
    { title: "Azadi Ka Amrit Mahotsav", date: "August 2022", description: "As per the proclamation from the Ministry of Education, Govt. of India, AICTE, Anna University, Chennai - PSG College of Technology has organised various events to make the students aware about the importance of Independence day", image: "https://www.psgtech.edu/images/amrit_mahotsav.jpg", link: "https://www.psgtech.edu/amritmahotsav/" },
    { title: "International Day of Yoga Celebration", date: "21 June 2026", description: "The International Yoga Day Celebration was organized with great enthusiasm at PSG College of Technology, Coimbatore, on the 21st June 2026", image: "https://www.psgtech.edu/images/yogaDay2026.jpg", report: "https://www.psgtech.edu/files/general/yogaday2026Report.pdf" },
  ]
}
