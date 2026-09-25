/* ==========================================================================
   1. data.js  —  IDHU THAAN "DATABASE" FILE
   --------------------------------------------------------------------------
   Idhula thaan Tamil Nadu 38 district, 55 college, 50+ course, event details
   ellame irukku. Website-la variable-la irundhu thaan ella page-um padikkum.
   Pudhu college add panna venumnaa — keezha COLLEGES array-la oru block add
   pannunga. Avlo thaan!
   ========================================================================== */

/* ---------------------- 1.1 TAMIL NADU 38 DISTRICTS ---------------------- */
const DISTRICTS = [
  { name: "Ariyalur",         ta: "அரியலூர்",         lat: 11.1400, lng: 79.0800 },
  { name: "Chengalpattu",     ta: "செங்கல்பட்டு",     lat: 12.6800, lng: 79.9800 },
  { name: "Chennai",          ta: "சென்னை",           lat: 13.0827, lng: 80.2707 },
  { name: "Coimbatore",       ta: "கோயம்புத்தூர்",    lat: 11.0168, lng: 76.9558 },
  { name: "Cuddalore",        ta: "கடலூர்",           lat: 11.7480, lng: 79.7714 },
  { name: "Dharmapuri",       ta: "தர்மபுரி",         lat: 12.1270, lng: 78.1580 },
  { name: "Dindigul",         ta: "திண்டுக்கல்",       lat: 10.3624, lng: 77.9695 },
  { name: "Erode",            ta: "ஈரோடு",            lat: 11.3410, lng: 77.7172 },
  { name: "Kallakurichi",     ta: "கள்ளக்குறிச்சி",   lat: 11.7380, lng: 78.9600 },
  { name: "Kanchipuram",      ta: "காஞ்சிபுரம்",       lat: 12.8342, lng: 79.7036 },
  { name: "Kanyakumari",      ta: "கன்னியாகுமரி",     lat: 8.1833,  lng: 77.4119 },
  { name: "Karur",            ta: "கரூர்",            lat: 10.9601, lng: 78.0766 },
  { name: "Krishnagiri",      ta: "கிருஷ்ணகிரி",      lat: 12.5186, lng: 78.2137 },
  { name: "Madurai",          ta: "மதுரை",            lat: 9.9252,  lng: 78.1198 },
  { name: "Mayiladuthurai",   ta: "மயிலாடுதுறை",      lat: 11.1018, lng: 79.6529 },
  { name: "Nagapattinam",     ta: "நாகப்பட்டினம்",    lat: 10.7659, lng: 79.8449 },
  { name: "Namakkal",         ta: "நாமக்கல்",         lat: 11.2189, lng: 78.1677 },
  { name: "Nilgiris",         ta: "நீலகிரி",          lat: 11.4102, lng: 76.6950 },
  { name: "Perambalur",       ta: "பெரம்பலூர்",        lat: 11.2333, lng: 78.8833 },
  { name: "Pudukkottai",      ta: "புதுக்கோட்டை",     lat: 10.3833, lng: 78.8001 },
  { name: "Ramanathapuram",   ta: "ராமநாதபுரம்",      lat: 9.3639,  lng: 78.8395 },
  { name: "Ranipet",          ta: "ராணிப்பேட்டை",     lat: 12.9249, lng: 79.3300 },
  { name: "Salem",            ta: "சேலம்",            lat: 11.6643, lng: 78.1460 },
  { name: "Sivaganga",        ta: "சிவகங்கை",         lat: 9.8433,  lng: 78.4809 },
  { name: "Tenkasi",          ta: "தென்காசி",         lat: 8.9600,  lng: 77.3152 },
  { name: "Thanjavur",        ta: "தஞ்சாவூர்",        lat: 10.7870, lng: 79.1378 },
  { name: "Theni",            ta: "தேனி",             lat: 10.0104, lng: 77.4768 },
  { name: "Thoothukudi",      ta: "தூத்துக்குடி",      lat: 8.7642,  lng: 78.1348 },
  { name: "Tiruchirappalli",  ta: "திருச்சிராப்பள்ளி", lat: 10.7905, lng: 78.7047 },
  { name: "Tirunelveli",      ta: "திருநெல்வேலி",     lat: 8.7139,  lng: 77.7567 },
  { name: "Tirupathur",       ta: "திருப்பத்தூர்",     lat: 12.4954, lng: 78.5678 },
  { name: "Tiruppur",         ta: "திருப்பூர்",        lat: 11.1085, lng: 77.3411 },
  { name: "Tiruvallur",       ta: "திருவள்ளூர்",       lat: 13.1439, lng: 79.9094 },
  { name: "Tiruvannamalai",   ta: "திருவண்ணாமலை",     lat: 12.2253, lng: 79.0747 },
  { name: "Tiruvarur",        ta: "திருவாரூர்",        lat: 10.7724, lng: 79.6368 },
  { name: "Vellore",          ta: "வேலூர்",           lat: 12.9165, lng: 79.1325 },
  { name: "Viluppuram",       ta: "விழுப்புரம்",       lat: 11.9401, lng: 79.4861 },
  { name: "Virudhunagar",     ta: "விருதுநகர்",        lat: 9.5851,  lng: 77.9578 }
];

/* ------------------------- 1.2 COLOUR THEMES (UI) ------------------------
   Ovvoru college-kkum oru theme. Ivai CSS variables-a maathi ovvoru college
   page-um VERU MAATHIRI theriyum (colour + layout).
   MUKKIYAM: moonu main college-ku RED, ORANGE, YELLOW (user sonna colors) */
const THEMES = {
  red:    { c1: "#E2372B", c2: "#8E0E05", accent: "#FFC93C", soft: "#FEECEA" },
  orange: { c1: "#F97316", c2: "#B23C00", accent: "#FFD166", soft: "#FFF1E3" },
  yellow: { c1: "#F4B400", c2: "#A97600", accent: "#E2372B", soft: "#FFFAE6" },
  green:  { c1: "#128C4A", c2: "#065C2E", accent: "#FFC93C", soft: "#E9F7EF" },
  blue:   { c1: "#1B6FD1", c2: "#0B3E7F", accent: "#FFC93C", soft: "#EAF2FD" },
  indigo: { c1: "#4F46E5", c2: "#2A238F", accent: "#FFD166", soft: "#EFEEFE" },
  purple: { c1: "#8338B5", c2: "#4B1E6B", accent: "#FFC93C", soft: "#F6EDFB" },
  teal:   { c1: "#0E9384", c2: "#075F55", accent: "#FFD166", soft: "#E7F6F4" },
  maroon: { c1: "#9E2A2B", c2: "#5C1415", accent: "#FFC93C", soft: "#FBEDED" }
};

/* ---------------------------------- 1.3 KINDS ---------------------------
   Oru college enna maathiri college-oo (engineering / arts / medical ...)
   Adha vechu thaan yaaru enna course padikka mudiyum-ngaradhu decide aagum. */
const KIND_LABEL = {
  engineering: "Engineering & Technology",
  arts: "Arts & Science",
  medical: "Medical & Health Sciences",
  management: "Management Studies",
  polytechnic: "Polytechnic / ITI",
  agri: "Agriculture & Veterinary",
  law: "Law",
  research: "Research & PG Studies"
};

/* =========================== 1.4 COURSES (50+) ========================= */
/* level: "10th" | "12th" | "PG"  —  user entha level-oo adha vechu filter aagum */
const COURSES = [
  /* ---------------- AFTER 10th (Diploma / ITI / Skill) ---------------- */
  { id:"dip-cse", name:"Diploma in Computer Engineering", level:"10th", stream:"Engineering", kinds:["polytechnic"], years:"3 Years", elig:"10th Pass (min 35% in Maths & Science)", via:"TN Polytechnic Counselling (DoTE)", fee:"₹6,000 – ₹40,000 / year", jobs:["Junior Software Developer","Network Technician","CAD Operator"], salary:"₹1.8L – ₹3.6L", img:"images/programmes/prog-engineering.jpg", popular:true },
  { id:"dip-mech", name:"Diploma in Mechanical Engineering", level:"10th", stream:"Engineering", kinds:["polytechnic"], years:"3 Years", elig:"10th Pass", via:"TN Polytechnic Counselling (DoTE)", fee:"₹6,000 – ₹35,000 / year", jobs:["Machine Operator","Production Supervisor","QA Inspector"], salary:"₹1.8L – ₹3.4L", img:"images/programmes/prog-engineering.jpg" },
  { id:"dip-ece", name:"Diploma in Electronics & Communication", level:"10th", stream:"Engineering", kinds:["polytechnic"], years:"3 Years", elig:"10th Pass", via:"TN Polytechnic Counselling (DoTE)", fee:"₹6,000 – ₹35,000 / year", jobs:["Electronics Technician","PCB Assembler","Service Engineer"], salary:"₹1.8L – ₹3.4L", img:"images/programmes/prog-engineering.jpg" },
  { id:"dip-eee", name:"Diploma in Electrical & Electronics", level:"10th", stream:"Engineering", kinds:["polytechnic"], years:"3 Years", elig:"10th Pass", via:"TN Polytechnic Counselling (DoTE)", fee:"₹6,000 – ₹35,000 / year", jobs:["Electrical Supervisor","Lineman","Maintenance Tech"], salary:"₹1.8L – ₹3.5L", img:"images/programmes/prog-engineering.jpg" },
  { id:"dip-civil", name:"Diploma in Civil Engineering", level:"10th", stream:"Engineering", kinds:["polytechnic"], years:"3 Years", elig:"10th Pass", via:"TN Polytechnic Counselling (DoTE)", fee:"₹6,000 – ₹35,000 / year", jobs:["Site Supervisor","Surveyor","Draftsman"], salary:"₹1.8L – ₹3.6L", img:"images/programmes/prog-engineering.jpg", popular:true },
  { id:"dip-agri", name:"Diploma in Agriculture", level:"10th", stream:"Agriculture", kinds:["polytechnic","agri"], years:"2 Years", elig:"10th Pass", via:"Polytechnic / TNAU Counselling", fee:"₹5,000 – ₹25,000 / year", jobs:["Agriculture Officer Asst","Farm Supervisor","Agri Input Dealer"], salary:"₹1.8L – ₹3.2L", img:"images/programmes/prog-arts.jpg" },
  { id:"iti-electrician", name:"ITI Electrician", level:"10th", stream:"Vocational", kinds:["polytechnic"], years:"2 Years", elig:"10th Pass (min 35%)", via:"ITI Online Counselling (DET)", fee:"₹4,000 – ₹25,000 total", jobs:["Licensed Electrician","Wiring Technician","Apprentice"], salary:"₹1.6L – ₹3.0L", img:"images/programmes/prog-diploma.jpg", popular:true },
  { id:"iti-trades", name:"ITI Trades (Fitter / Welder / Machinist / Turner)", level:"10th", stream:"Vocational", kinds:["polytechnic"], years:"1 – 2 Years", elig:"10th Pass (8th pass for some trades)", via:"ITI Online Counselling (DET)", fee:"₹3,000 – ₹20,000 total", jobs:["Fitter","Welder","CNC Machinist","Apprentice"], salary:"₹1.5L – ₹3.2L", img:"images/programmes/prog-diploma.jpg" },
  { id:"dip-health", name:"Diploma in Healthcare Assistant / Patient Care", level:"10th", stream:"Paramedical", kinds:["medical","polytechnic"], years:"1 – 2 Years", elig:"10th Pass", via:"Institute Level / Paramedical Counselling", fee:"₹15,000 – ₹60,000 / year", jobs:["Patient Care Assistant","Hospital Attendant","Home Health Aide"], salary:"₹1.8L – ₹3.2L", img:"images/programmes/prog-medical.jpg" },
  { id:"dip-hotel", name:"Diploma in Hotel Management & Catering", level:"10th", stream:"Vocational", kinds:["arts","polytechnic"], years:"3 Years", elig:"10th Pass", via:"Institute Level Admission", fee:"₹20,000 – ₹80,000 / year", jobs:["Commis Chef","Front Office Asst","F&B Service"], salary:"₹2.0L – ₹3.6L", img:"images/programmes/prog-business.jpg" },
  { id:"dip-fashion", name:"Diploma in Fashion & Textile Design", level:"10th", stream:"Vocational", kinds:["arts","polytechnic"], years:"2 – 3 Years", elig:"10th Pass", via:"Institute Level Admission", fee:"₹18,000 – ₹70,000 / year", jobs:["Pattern Maker","Garment QA","Textile Designer"], salary:"₹1.8L – ₹3.4L", img:"images/programmes/prog-arts.jpg" },

  /* ---------------- AFTER 12th (Degree / Professional) ---------------- */
  { id:"be-cse", name:"B.E. Computer Science & Engineering", level:"12th", stream:"Engineering", kinds:["engineering"], years:"4 Years", elig:"12th with Maths, Physics, Chemistry (min 50%)", via:"TNEA Single Window Counselling", fee:"₹40,000 – ₹1,60,000 / year", jobs:["Software Engineer","Data Analyst","Cloud Engineer"], salary:"₹3.5L – ₹8.0L", img:"images/programmes/prog-engineering.jpg", popular:true },
  { id:"be-aiml", name:"B.Tech Artificial Intelligence & Data Science", level:"12th", stream:"Engineering", kinds:["engineering"], years:"4 Years", elig:"12th with Maths (min 50%)", via:"TNEA Counselling", fee:"₹45,000 – ₹1,75,000 / year", jobs:["AI Engineer","Data Scientist","ML Engineer"], salary:"₹4.0L – ₹9.0L", img:"images/programmes/prog-engineering.jpg", popular:true },
  { id:"be-ece", name:"B.E. Electronics & Communication Engineering", level:"12th", stream:"Engineering", kinds:["engineering"], years:"4 Years", elig:"12th with Maths, Physics, Chemistry", via:"TNEA Counselling", fee:"₹40,000 – ₹1,50,000 / year", jobs:["VLSI Engineer","Embedded Developer","Telecom Engineer"], salary:"₹3.2L – ₹7.0L", img:"images/programmes/prog-engineering.jpg" },
  { id:"be-mech", name:"B.E. Mechanical Engineering", level:"12th", stream:"Engineering", kinds:["engineering"], years:"4 Years", elig:"12th with Maths, Physics, Chemistry", via:"TNEA Counselling", fee:"₹40,000 – ₹1,40,000 / year", jobs:["Design Engineer","Production Engineer","Automobile Engineer"], salary:"₹3.0L – ₹6.5L", img:"images/programmes/prog-engineering.jpg" },
  { id:"be-civil", name:"B.E. Civil Engineering", level:"12th", stream:"Engineering", kinds:["engineering"], years:"4 Years", elig:"12th with Maths, Physics, Chemistry", via:"TNEA Counselling", fee:"₹40,000 – ₹1,30,000 / year", jobs:["Site Engineer","Structural Designer","Quantity Surveyor"], salary:"₹2.8L – ₹6.0L", img:"images/programmes/prog-engineering.jpg" },
  { id:"be-eee", name:"B.E. Electrical & Electronics Engineering", level:"12th", stream:"Engineering", kinds:["engineering"], years:"4 Years", elig:"12th with Maths, Physics, Chemistry", via:"TNEA Counselling", fee:"₹40,000 – ₹1,40,000 / year", jobs:["Power Engineer","TANGEDCO AE","Automation Engineer"], salary:"₹3.0L – ₹6.5L", img:"images/programmes/prog-engineering.jpg" },
  { id:"barch", name:"B.Arch (Architecture)", level:"12th", stream:"Engineering", kinds:["engineering"], years:"5 Years", elig:"12th with Maths + NATA / JEE Paper-2", via:"NATA Qualified + Counselling", fee:"₹60,000 – ₹1,80,000 / year", jobs:["Architect","Urban Planner","Interior Designer"], salary:"₹3.0L – ₹7.0L", img:"images/programmes/prog-engineering.jpg" },
  { id:"bsc-cs", name:"B.Sc Computer Science", level:"12th", stream:"Science", kinds:["arts"], years:"3 Years", elig:"12th Pass (any group, Maths preferred)", via:"College Direct / State Counselling", fee:"₹8,000 – ₹60,000 / year", jobs:["Programmer","Testing Engineer","Support Analyst"], salary:"₹2.4L – ₹5.0L", img:"images/programmes/prog-arts.jpg", popular:true },
  { id:"bsc-ai", name:"B.Sc Artificial Intelligence & Data Science", level:"12th", stream:"Science", kinds:["arts"], years:"3 Years", elig:"12th Pass with Maths / Computer Science", via:"College Direct Admission", fee:"₹15,000 – ₹75,000 / year", jobs:["Data Analyst","Python Developer","BI Executive"], salary:"₹2.8L – ₹5.5L", img:"images/programmes/prog-arts.jpg" },
  { id:"bsc-data", name:"B.Sc Data Science & Business Analytics", level:"12th", stream:"Science", kinds:["arts","management"], years:"3 Years", elig:"12th Pass with Maths", via:"College Direct Admission", fee:"₹20,000 – ₹90,000 / year", jobs:["Analyst","MIS Executive","Junior Data Engineer"], salary:"₹2.8L – ₹5.8L", img:"images/programmes/prog-business.jpg" },
  { id:"bsc-physical", name:"B.Sc Physics / Chemistry / Mathematics", level:"12th", stream:"Science", kinds:["arts"], years:"3 Years", elig:"12th with Science group", via:"College Direct / Counselling", fee:"₹5,000 – ₹45,000 / year", jobs:["Lab Assistant","Teaching","B.Ed Path","Bank Exams"], salary:"₹2.2L – ₹4.5L", img:"images/programmes/prog-arts.jpg" },
  { id:"bsc-life", name:"B.Sc Botany / Zoology / Microbiology", level:"12th", stream:"Science", kinds:["arts"], years:"3 Years", elig:"12th with Biology", via:"College Direct Admission", fee:"₹6,000 – ₹50,000 / year", jobs:["Lab Technician","Research Assistant","Pharma QA"], salary:"₹2.2L – ₹4.6L", img:"images/programmes/prog-medical.jpg" },
  { id:"bcom", name:"B.Com / B.Com (Computer Applications)", level:"12th", stream:"Commerce", kinds:["arts","management"], years:"3 Years", elig:"12th Pass (Commerce preferred)", via:"College Direct / Counselling", fee:"₹6,000 – ₹55,000 / year", jobs:["Accountant","GST Practitioner","Bank Staff","Tally Executive"], salary:"₹2.2L – ₹4.8L", img:"images/programmes/prog-business.jpg", popular:true },
  { id:"bba", name:"B.B.A Business Administration", level:"12th", stream:"Management", kinds:["arts","management"], years:"3 Years", elig:"12th Pass (any group)", via:"College Direct / Counselling", fee:"₹15,000 – ₹1,00,000 / year", jobs:["Business Executive","Sales Officer","HR Trainee"], salary:"₹2.4L – ₹5.2L", img:"images/programmes/prog-business.jpg" },
  { id:"bca", name:"B.C.A Computer Applications", level:"12th", stream:"Science", kinds:["arts"], years:"3 Years", elig:"12th Pass with Maths / CS", via:"College Direct Admission", fee:"₹12,000 – ₹70,000 / year", jobs:["Web Developer","App Developer","IT Support"], salary:"₹2.4L – ₹5.0L", img:"images/programmes/prog-arts.jpg" },
  { id:"ba-lang", name:"B.A. English / Tamil / History", level:"12th", stream:"Arts", kinds:["arts"], years:"3 Years", elig:"12th Pass (any group)", via:"College Direct / Counselling", fee:"₹4,000 – ₹40,000 / year", jobs:["Content Writer","Teacher","Civil Service Prep","BPO"], salary:"₹2.0L – ₹4.2L", img:"images/programmes/prog-arts.jpg" },
  { id:"bsw", name:"B.S.W Social Work", level:"12th", stream:"Arts", kinds:["arts"], years:"3 Years", elig:"12th Pass (any group)", via:"College Direct Admission", fee:"₹8,000 – ₹45,000 / year", jobs:["NGO Field Worker","Community Officer","CSR Executive"], salary:"₹2.0L – ₹4.0L", img:"images/programmes/prog-arts.jpg" },
  { id:"bsc-nursing", name:"B.Sc Nursing", level:"12th", stream:"Medical", kinds:["medical"], years:"4 Years", elig:"12th with Physics, Chemistry, Biology (min 45%)", via:"TN Health Counselling / NEET", fee:"₹25,000 – ₹1,50,000 / year", jobs:["Staff Nurse","ICU Nurse","Nurse Educator","Abroad Nurse"], salary:"₹3.0L – ₹7.0L", img:"images/programmes/prog-medical.jpg", popular:true },
  { id:"bpharm", name:"B.Pharm (Pharmacy)", level:"12th", stream:"Medical", kinds:["medical"], years:"4 Years", elig:"12th with PCB / PCM (min 45%)", via:"TN Pharmacy Counselling", fee:"₹30,000 – ₹1,40,000 / year", jobs:["Hospital Pharmacist","Drug Inspector","Production Chemist"], salary:"₹2.8L – ₹6.0L", img:"images/programmes/prog-medical.jpg" },
  { id:"bpt", name:"B.P.T Physiotherapy", level:"12th", stream:"Medical", kinds:["medical"], years:"4.5 Years", elig:"12th with PCB (min 50%)", via:"TN Health Counselling", fee:"₹40,000 – ₹1,60,000 / year", jobs:["Physiotherapist","Sports Rehab","Home Care Therapist"], salary:"₹3.0L – ₹6.5L", img:"images/programmes/prog-medical.jpg" },
  { id:"bsc-allied", name:"B.Sc Allied Health Sciences (MLT / Radiology / OT Tech)", level:"12th", stream:"Paramedical", kinds:["medical"], years:"3 – 4 Years", elig:"12th with PCB", via:"TN Health Counselling", fee:"₹25,000 – ₹1,20,000 / year", jobs:["Lab Technologist","Radiographer","OT Technician"], salary:"₹2.6L – ₹5.5L", img:"images/programmes/prog-medical.jpg" },
  { id:"bsc-agri", name:"B.Sc Agriculture / Horticulture", level:"12th", stream:"Agriculture", kinds:["agri"], years:"4 Years", elig:"12th with PCB / PCM (min 55%)", via:"TNAU Single Window Counselling", fee:"₹15,000 – ₹1,00,000 / year", jobs:["Agriculture Officer","Agri Scientist","Bank Agri Officer"], salary:"₹3.0L – ₹6.5L", img:"images/programmes/prog-arts.jpg" },
  { id:"bvsc", name:"B.V.Sc & A.H (Veterinary Science)", level:"12th", stream:"Agriculture", kinds:["agri"], years:"5.5 Years", elig:"12th with PCB + NEET", via:"NEET + Veterinary Counselling", fee:"₹20,000 – ₹1,20,000 / year", jobs:["Veterinary Doctor","Dairy Officer","Pet Clinic"], salary:"₹3.5L – ₹7.5L", img:"images/programmes/prog-medical.jpg" },
  { id:"ballb", name:"B.A. LL.B (5-Year Integrated Law)", level:"12th", stream:"Law", kinds:["law"], years:"5 Years", elig:"12th Pass (min 45%) + CLAT / TN Law Entrance", via:"CLAT / TN Dr. Ambedkar Law University", fee:"₹25,000 – ₹2,00,000 / year", jobs:["Advocate","Legal Associate","Judicial Service Prep"], salary:"₹3.0L – ₹8.0L", img:"images/programmes/prog-business.jpg" },
  { id:"bhm", name:"B.Sc Hotel & Catering Management", level:"12th", stream:"Vocational", kinds:["arts"], years:"3 Years", elig:"12th Pass (any group)", via:"Institute Level Admission", fee:"₹30,000 – ₹1,20,000 / year", jobs:["Hotel Manager Trainee","Chef","Cruise Line Staff"], salary:"₹2.4L – ₹5.0L", img:"images/programmes/prog-business.jpg" },
  { id:"bdes", name:"B.Des Fashion / Interior Design", level:"12th", stream:"Vocational", kinds:["arts"], years:"4 Years", elig:"12th Pass + Design Aptitude", via:"NIFT / NID / Institute Entrance", fee:"₹60,000 – ₹2,20,000 / year", jobs:["Fashion Designer","Interior Designer","Merchandiser"], salary:"₹2.8L – ₹6.5L", img:"images/programmes/prog-arts.jpg" },

  /* ------------------------- AFTER UG (PG Courses) ------------------------ */
  { id:"me-cse", name:"M.E. / M.Tech Computer Science & Engineering", level:"PG", stream:"Engineering", kinds:["engineering"], years:"2 Years", elig:"B.E / B.Tech in CSE / IT / ECE", via:"TANCET / GATE Counselling", fee:"₹25,000 – ₹1,50,000 / year", jobs:["Research Engineer","Senior Developer","Assistant Professor"], salary:"₹4.0L – ₹9.0L", img:"images/programmes/prog-pg.jpg", popular:true },
  { id:"me-branches", name:"M.E. Structural / Thermal / Power Systems", level:"PG", stream:"Engineering", kinds:["engineering"], years:"2 Years", elig:"Relevant B.E / B.Tech", via:"TANCET / GATE", fee:"₹25,000 – ₹1,30,000 / year", jobs:["Design Engineer","Consultant","PSU AE"], salary:"₹3.8L – ₹8.0L", img:"images/programmes/prog-pg.jpg" },
  { id:"mba", name:"M.B.A (Finance / HR / Marketing / Analytics)", level:"PG", stream:"Management", kinds:["management","arts"], years:"2 Years", elig:"Any UG Degree (min 50%)", via:"TANCET / CAT + Counselling", fee:"₹30,000 – ₹3,00,000 / year", jobs:["Manager Trainee","Business Analyst","HR Executive"], salary:"₹4.0L – ₹12.0L", img:"images/programmes/prog-business.jpg", popular:true },
  { id:"mca", name:"M.C.A Master of Computer Applications", level:"PG", stream:"Science", kinds:["arts","engineering"], years:"2 Years", elig:"Any UG with Maths at +2 or UG level", via:"TANCET Counselling", fee:"₹25,000 – ₹1,20,000 / year", jobs:["Software Engineer","System Analyst","Full Stack Dev"], salary:"₹3.6L – ₹8.0L", img:"images/programmes/prog-pg.jpg" },
  { id:"msc-cs", name:"M.Sc Computer Science / Data Science", level:"PG", stream:"Science", kinds:["arts"], years:"2 Years", elig:"B.Sc CS / Maths / BCA", via:"University Counselling / Direct", fee:"₹12,000 – ₹80,000 / year", jobs:["Data Analyst","Lecturer","ML Associate"], salary:"₹3.2L – ₹7.0L", img:"images/programmes/prog-pg.jpg" },
  { id:"msc-physical", name:"M.Sc Physics / Chemistry / Mathematics", level:"PG", stream:"Science", kinds:["arts","research"], years:"2 Years", elig:"Relevant B.Sc Degree", via:"University Counselling / Direct", fee:"₹8,000 – ₹60,000 / year", jobs:["Assistant Professor","CSIR Research Fellow","Lab Scientist"], salary:"₹3.0L – ₹6.5L", img:"images/programmes/prog-pg.jpg" },
  { id:"msc-life", name:"M.Sc Botany / Zoology / Biotechnology", level:"PG", stream:"Science", kinds:["arts","research"], years:"2 Years", elig:"Relevant B.Sc Degree", via:"University Counselling / Direct", fee:"₹10,000 – ₹65,000 / year", jobs:["Research Associate","Pharma QC","Biotech Executive"], salary:"₹3.0L – ₹6.0L", img:"images/programmes/prog-medical.jpg" },
  { id:"mcom", name:"M.Com / M.Com (Computer Applications)", level:"PG", stream:"Commerce", kinds:["arts","management"], years:"2 Years", elig:"B.Com / BBA / BBM", via:"University Counselling / Direct", fee:"₹8,000 – ₹60,000 / year", jobs:["Accountant","Audit Assistant","Commerce Lecturer","Bank Exams"], salary:"₹3.0L – ₹6.0L", img:"images/programmes/prog-business.jpg" },
  { id:"ma-lang", name:"M.A. English / Tamil / History", level:"PG", stream:"Arts", kinds:["arts","research"], years:"2 Years", elig:"Relevant UG Degree", via:"University Counselling / Direct", fee:"₹6,000 – ₹45,000 / year", jobs:["Lecturer","Content Head","Civil Service Prep","Translator"], salary:"₹2.8L – ₹6.0L", img:"images/programmes/prog-arts.jpg" },
  { id:"msw", name:"M.S.W Master of Social Work", level:"PG", stream:"Arts", kinds:["arts"], years:"2 Years", elig:"Any UG Degree", via:"University Counselling / Direct", fee:"₹15,000 – ₹80,000 / year", jobs:["Medical Social Worker","CSR Manager","NGO Programme Officer"], salary:"₹3.0L – ₹6.5L", img:"images/programmes/prog-arts.jpg" },
  { id:"med", name:"M.Ed (Master of Education)", level:"PG", stream:"Education", kinds:["arts","research"], years:"2 Years", elig:"B.Ed Degree", via:"University Counselling", fee:"₹12,000 – ₹70,000 / year", jobs:["School Head","Teacher Educator","B.Ed Lecturer"], salary:"₹3.0L – ₹6.5L", img:"images/programmes/prog-arts.jpg" },
  { id:"msc-nursing", name:"M.Sc Nursing (Community / Medical-Surgical)", level:"PG", stream:"Medical", kinds:["medical"], years:"2 Years", elig:"B.Sc Nursing + 1 yr experience", via:"TN Health Counselling", fee:"₹40,000 – ₹1,80,000 / year", jobs:["Nursing Tutor","Ward In-charge","Clinical Instructor"], salary:"₹3.6L – ₹7.5L", img:"images/programmes/prog-medical.jpg" },
  { id:"mpharm", name:"M.Pharm (Pharmaceutics / Pharmacology)", level:"PG", stream:"Medical", kinds:["medical"], years:"2 Years", elig:"B.Pharm (min 55%)", via:"TN Pharmacy Counselling / GPAT", fee:"₹45,000 – ₹1,80,000 / year", jobs:["Formulation Scientist","QA / QC Manager","Medical Writer"], salary:"₹3.5L – ₹8.0L", img:"images/programmes/prog-medical.jpg" },
  { id:"msc-agri", name:"M.Sc Agriculture / Horticulture", level:"PG", stream:"Agriculture", kinds:["agri"], years:"2 Years", elig:"B.Sc Agriculture / Horticulture", via:"TNAU / ICAR Counselling", fee:"₹20,000 – ₹90,000 / year", jobs:["Agri Officer","Scientist","Research Fellow"], salary:"₹3.5L – ₹7.5L", img:"images/programmes/prog-arts.jpg" },
  { id:"llm", name:"LL.M (Constitutional / Corporate Law)", level:"PG", stream:"Law", kinds:["law"], years:"2 Years", elig:"B.L / B.A. LL.B", via:"University Direct / Entrance", fee:"₹30,000 – ₹2,00,000 / year", jobs:["Corporate Counsel","Legal Researcher","Lecturer"], salary:"₹4.0L – ₹10.0L", img:"images/programmes/prog-business.jpg" },
  { id:"msc-allied", name:"M.Sc Allied Health / Public Health", level:"PG", stream:"Paramedical", kinds:["medical"], years:"2 Years", elig:"Relevant UG in Health Sciences", via:"University Counselling", fee:"₹35,000 – ₹1,50,000 / year", jobs:["Epidemiologist","Hospital Administrator","Public Health Officer"], salary:"₹3.5L – ₹7.5L", img:"images/programmes/prog-medical.jpg" },
  { id:"mphil-phd", name:"M.Phil / Ph.D (Research Programmes)", level:"PG", stream:"Research", kinds:["research","arts","engineering"], years:"1 – 3 Years", elig:"PG Degree with 55% + Entrance / NET", via:"University Research Entrance Test", fee:"₹10,000 – ₹80,000 / year", jobs:["Assistant Professor","Scientist","Research Consultant"], salary:"₹3.6L – ₹9.0L", img:"images/programmes/prog-pg.jpg" }
];

/* ============================ 1.5 EVENTS =============================== */
const EVENTS = [
  { title:"Kalaivizha – Cultural Festival", college:"Various Arts Colleges", date:"Feb 2026", img:"images/events/event-culturals.jpg", tag:"Cultural", desc:"Dance, music, drama and food stalls — TN college cultural season." },
  { title:"Anveshan – Technical Symposium", college:"Engineering Colleges", date:"Mar 2026", img:"images/events/event-techfest.jpg", tag:"Technical", desc:"Paper presentation, robotics, hackathon and project expo." },
  { title:"Annual Sports Meet", college:"All Colleges", date:"Jan 2026", img:"images/events/event-sports.jpg", tag:"Sports", desc:"Athletics, kabaddi, volleyball and inter-department tournaments." },
  { title:"Convocation & Graduation Day", college:"Universities", date:"Apr 2026", img:"images/events/event-graduation.jpg", tag:"Graduation", desc:"Degree distribution, gold medals and alumni meet." }
];

/* ======================== 1.6 THE 55 COLLEGES =========================
   kinds     -> enna enna department irukku
   theme     -> AI college-ukkum thani colour (UI veru veru maathiri theriyum)
   featured  -> home page-la RED / ORANGE / YELLOW block-a varum
   ---------------------------------------------------------------------- */
const COLLEGES = [
  { id:"anna-university", name:"Anna University", short:"Anna Univ", district:"Chennai", area:"Guindy", type:"Government", estd:1978, rating:4.6, reviews:12840, lat:13.0105, lng:80.2355, kinds:["engineering","management","research"], theme:"red", featured:"red", img:"images/colleges/campus-red.jpg", hostel:true, website:"https://www.annauniv.edu", about:"Tamil Nadu-in mudhanmaiyaana technical university. 1978-la College of Engineering Guindy-ai sernthu uruvaanathu. Engineering, Technology mattum illama Management, Architecture, Research-um irukku. TNEA counselling-oda head office ivide thaan." },
  { id:"psg-tech", name:"PSG College of Technology", short:"PSG Tech", district:"Coimbatore", area:"Peelamedu", type:"Aided (Autonomous)", estd:1951, rating:4.7, reviews:7320, lat:11.0248, lng:76.9944, kinds:["engineering","management","research"], theme:"orange", featured:"orange", img:"images/colleges/campus-orange.jpg", hostel:true, website:"https://www.psgtech.edu", about:"Coimbatore-in perumai. 1951-la start aana ivlo college industry connection-ku famous. PSG Tech-oda placement record Tamil Nadu-la top-la varum. Autonomous status, NBA accredited, NIRF rank-la thodarndhu irukku." },
  { id:"american-college", name:"The American College", short:"American College", district:"Madurai", area:"Tallakulam", type:"Aided (Autonomous)", estd:1881, rating:4.6, reviews:5130, lat:9.9280, lng:78.1100, kinds:["arts","management","research"], theme:"yellow", featured:"yellow", img:"images/colleges/campus-yellow.jpg", hostel:true, website:"https://www.americancollege.edu.in", about:"1881-la start aana 140+ years pazhaya college. Madurai-la arts & science padikka best. Big clock tower, azhagana green campus. Tamil literature, science, commerce ellathukum periyar. 'Purple' theriyum... aana ivanga main colour yellow-gold." },
  { id:"iit-madras", name:"IIT Madras", short:"IITM", district:"Chennai", area:"Adyar", type:"Institute of National Importance", estd:1959, rating:4.8, reviews:9820, lat:12.9915, lng:80.2337, kinds:["engineering","research","management"], theme:"indigo", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://www.iitm.ac.in", about:"India-vin no.1 engineering institute (NIRF-la year-a year-a first). Deer park-ku ulla irukku. B.Tech-kku JEE Advanced venum. Research, startup incubation-la world class." },
  { id:"madras-medical-college", name:"Madras Medical College", short:"MMC", district:"Chennai", area:"Park Town", type:"Government", estd:1835, rating:4.7, reviews:6210, lat:13.0820, lng:80.2750, kinds:["medical"], theme:"teal", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.mmc.tn.gov.in", about:"1835-la start aana India-vin second oldest medical college. NEET score venum. Government hospital attached, so clinical exposure semma. MBBS, Nursing, Pharmacy, Allied Health ellame irukku." },
  { id:"loyola-chennai", name:"Loyola College", short:"Loyola", district:"Chennai", area:"Nungambakkam", type:"Aided (Autonomous)", estd:1925, rating:4.5, reviews:8150, lat:13.0658, lng:80.2324, kinds:["arts","management","research"], theme:"maroon", img:"images/colleges/campus-yellow.jpg", hostel:true, website:"https://www.loyolacollege.edu", about:"Chennai-la arts & science-ku periyar. 1925-la start. NIRF arts college ranking-la top 10. Commerce, Economics, Visual Communication popular. Campus-la big auditorium, library 2 lakh+ books." },
  { id:"srm-kattankulathur", name:"SRM Institute of Science & Technology", short:"SRM", district:"Chengalpattu", area:"Kattankulathur", type:"Deemed University", estd:1985, rating:4.3, reviews:11250, lat:12.8231, lng:80.0444, kinds:["engineering","management","medical","research"], theme:"blue", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://www.srmist.edu.in", about:"250 acres campus, engineering + medical + management ellame oru campus-la. SRMJEEE entrance venum. Foreign exchange programmes, big placement drive — 1000+ companies varum." },
  { id:"mcc-tambaram", name:"Madras Christian College", short:"MCC", district:"Chengalpattu", area:"Tambaram", type:"Aided (Autonomous)", estd:1837, rating:4.4, reviews:5980, lat:12.9204, lng:80.1237, kinds:["arts","research"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.mcc.edu.in", about:"1837-la start aana Asia-vin oldest colleges-la onnu. 365 acre forest campus — deer, peacock ellame free-a thiriyum! Arts, Science, Commerce + Wildlife Biology course-ku famous." },
  { id:"cit-coimbatore", name:"Coimbatore Institute of Technology", short:"CIT", district:"Coimbatore", area:"Civil Aerodrome Post", type:"Aided (Autonomous)", estd:1956, rating:4.4, reviews:4320, lat:11.0137, lng:76.9811, kinds:["engineering"], theme:"blue", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://www.cit.edu.in", about:"1956-la start aana government-aided autonomous engineering college. Coimbatore industry-ku close-a irukkuradhunala internship opportunities neraya. TNEA counselling-la top choice." },
  { id:"gct-coimbatore", name:"Government College of Technology", short:"GCT", district:"Coimbatore", area:"Thadagam Road", type:"Government", estd:1945, rating:4.3, reviews:3870, lat:11.0168, lng:76.9558, kinds:["engineering","polytechnic"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.gct.ac.in", about:"1945-la start aana government engineering college. Fees romba kammi — private college-oda 1/4 thaan. Merit-la TNEA seat kidaikum. Mechanical, Civil, EEE-la pazhaya reputation." },
  { id:"bharathiar-university", name:"Bharathiar University", short:"BU", district:"Coimbatore", area:"Marudhamalai Road", type:"State University", estd:1982, rating:4.3, reviews:4450, lat:11.0400, lng:76.8800, kinds:["arts","management","research"], theme:"purple", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.b-u.ac.in", about:"1982-la start aana state university. 100+ affiliated colleges. PG courses (M.Sc, M.Com, MBA, MCA) + research programmes periyar. Marudhamalai malai adivaram-la azhagana campus." },
  { id:"tamil-nadu-agri-university", name:"Tamil Nadu Agricultural University", short:"TNAU", district:"Coimbatore", area:"Lawley Road", type:"State University", estd:1971, rating:4.5, reviews:3980, lat:11.0125, lng:76.9360, kinds:["agri","research"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://tnau.ac.in", about:"India-vin best agriculture universities-la onnu. B.Sc Agriculture, Horticulture, Forestry, B.V.Sc ellame. ICAR-oda recognised. Campus-la research farm, dairy unit, botanical garden irukku." },
  { id:"karunya-institute", name:"Karunya Institute of Technology & Sciences", short:"Karunya", district:"Coimbatore", area:"Karunya Nagar", type:"Deemed University", estd:1986, rating:4.1, reviews:5210, lat:10.9360, lng:76.7460, kinds:["engineering","management","medical"], theme:"blue", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://www.karunya.edu", about:"Siruvani malai adivaram-la 700 acre campus. Engineering, Management, Agriculture, Nursing ellame. Karunya Entrance Examination (KEE) venum. Green campus-ku award vaangiyirukku." },
  { id:"thiagarajar-engg", name:"Thiagarajar College of Engineering", short:"TCE", district:"Madurai", area:"Thiruparankundram", type:"Aided (Autonomous)", estd:1957, rating:4.5, reviews:4830, lat:9.9206, lng:78.0652, kinds:["engineering"], theme:"blue", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://www.tce.edu", about:"1957-la start aana Madurai-vin periya engineering college. Autonomous, NBA + NAAC A++. Industry sponsored labs, innovation centre. TNEA counselling-la top rank." },
  { id:"madurai-kamaraj-university", name:"Madurai Kamaraj University", short:"MKU", district:"Madurai", area:"Palkalai Nagar", type:"State University", estd:1966, rating:4.2, reviews:5120, lat:9.9190, lng:78.1200, kinds:["arts","research","management"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://mkuniversity.ac.in", about:"1966-la start. 100+ colleges affiliated. PG, M.Phil, Ph.D research-ku periyar. Palkalai Nagar campus-la separate departments, library, hostel ellame irukku." },
  { id:"lady-doak-college", name:"Lady Doak College (Women)", short:"Lady Doak", district:"Madurai", area:"Tallakulam", type:"Aided (Autonomous)", estd:1948, rating:4.5, reviews:3620, lat:9.9371, lng:78.1226, kinds:["arts","management"], theme:"purple", img:"images/colleges/campus-yellow.jpg", hostel:true, website:"https://www.ladydoakcollege.edu.in", about:"Pengalukku mattum — 1948-la start aana women's college. Arts, Science, Commerce + gender studies-ku periyar. Semester abroad programme irukku. Campus semma safe & peaceful." },
  { id:"nit-tiruchirappalli", name:"National Institute of Technology Tiruchirappalli", short:"NIT Trichy", district:"Tiruchirappalli", area:"Thuvakudi", type:"Institute of National Importance", estd:1964, rating:4.8, reviews:6740, lat:10.7602, lng:78.8148, kinds:["engineering","management","research"], theme:"indigo", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://www.nitt.edu", about:"JEE Main score venum. India-vin top 10 NIT-la onnu (NIRF-la NIT-களில் first). 800 acre campus. Fest 'Festember' Tamil Nadu-la periya cultural fest." },
  { id:"st-josephs-trichy", name:"St. Joseph's College", short:"SJC Trichy", district:"Tiruchirappalli", area:"College Road", type:"Aided (Autonomous)", estd:1844, rating:4.5, reviews:4910, lat:10.8203, lng:78.6872, kinds:["arts","research"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.sjctni.edu", about:"1844-la start aana 180+ years pazhaya college. Trichy-la arts & science padikka best choice. Science research, NCC/NSS, sports ellathukum periyar. NAAC A++." },
  { id:"bharathidasan-university", name:"Bharathidasan University", short:"BDU", district:"Tiruchirappalli", area:"Palkalaiperur", type:"State University", estd:1982, rating:4.2, reviews:4110, lat:10.8203, lng:78.6930, kinds:["arts","research","management"], theme:"yellow", img:"images/colleges/campus-yellow.jpg", hostel:true, website:"https://www.bdu.ac.in", about:"Tamil poet Bharathidasan peyar-la 1982-la start aana university. 150+ affiliated colleges. PG & research courses periyar. Kailasapuram campus." },
  { id:"gce-salem", name:"Government College of Engineering, Salem", short:"GCE Salem", district:"Salem", area:"Karuppur", type:"Government", estd:1985, rating:4.2, reviews:2980, lat:11.7180, lng:78.0780, kinds:["engineering"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.gcesalem.edu.in", about:"Government college so fee romba kammi. 1985-la start. TNEA counselling-la Salem region students-ku easy access. Autonomous status." },
  { id:"periyar-university", name:"Periyar University", short:"Periyar Univ", district:"Salem", area:"Periyar Palkalai Nagar", type:"State University", estd:1997, rating:4.1, reviews:3260, lat:11.7180, lng:78.0780, kinds:["arts","research"], theme:"orange", img:"images/colleges/campus-orange.jpg", hostel:true, website:"https://www.periyaruniversity.ac.in", about:"1997-la start aana university. 100+ affiliated colleges in Salem, Namakkal, Dharmapuri, Krishnagiri. PG, M.Phil, Ph.D-ku periyar." },
  { id:"sona-college", name:"Sona College of Technology", short:"Sona", district:"Salem", area:"Suramangalam", type:"Private (Autonomous)", estd:1997, rating:4.2, reviews:3540, lat:11.6680, lng:78.1230, kinds:["engineering","management"], theme:"blue", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://www.sonatech.ac.in", about:"Salem-la top private engineering college. Sona Group industries-oda strong tie-up. Placement training 2nd year-la irundhe start aagum. NBA accredited." },
  { id:"vit-vellore", name:"Vellore Institute of Technology", short:"VIT", district:"Vellore", area:"Katpadi", type:"Deemed University", estd:1984, rating:4.6, reviews:15640, lat:12.9692, lng:79.1559, kinds:["engineering","management","research"], theme:"indigo", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://vit.ac.in", about:"VITEEE entrance venum. India-vin periya private engineering university. 350+ acre campus, 40,000+ students. Full semester abroad programme, big placement (avg package high)." },
  { id:"cmc-vellore", name:"Christian Medical College", short:"CMC Vellore", district:"Vellore", area:"Ida Scudder Road", type:"Aided (Minority)", estd:1900, rating:4.8, reviews:7240, lat:12.9236, lng:79.1358, kinds:["medical"], theme:"teal", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.cmch-vellore.edu", about:"1900-la Ida Scudder start panna hospital + college. India-vin best medical institutions-la onnu. NEET + counselling venum. Nursing, Allied Health, MBBS, PG ellame irukku." },
  { id:"ms-university-tirunelveli", name:"Manonmaniam Sundaranar University", short:"MSU", district:"Tirunelveli", area:"Abishekapatti", type:"State University", estd:1990, rating:4.1, reviews:3480, lat:8.7106, lng:77.7567, kinds:["arts","research"], theme:"purple", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.msuniv.ac.in", about:"1990-la start aana university. Tirunelveli, Kanyakumari, Tenkasi district colleges ellame affiliated. PG & research courses periyar." },
  { id:"gce-tirunelveli", name:"Government College of Engineering, Tirunelveli", short:"GCE Tirunelveli", district:"Tirunelveli", area:"Palayamkottai", type:"Government", estd:1981, rating:4.2, reviews:2740, lat:8.7275, lng:77.7204, kinds:["engineering"], theme:"blue", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://www.gcetly.ac.in", about:"1981-la start aana government engineering college. Fee kammi, hostel irukku. TNEA counselling-la southern districts students-ku main choice." },
  { id:"st-xaviers-palayamkottai", name:"St. Xavier's College", short:"St. Xavier's", district:"Tirunelveli", area:"Palayamkottai", type:"Aided (Autonomous)", estd:1923, rating:4.4, reviews:3860, lat:8.7130, lng:77.7390, kinds:["arts","research"], theme:"yellow", img:"images/colleges/campus-yellow.jpg", hostel:true, website:"https://www.stxavierspalayamkottai.com", about:"1923-la start aana college. Tamil literature & science-ku periyar. India-vin top arts colleges list-la idam pidithirukku. Big library, NSS activities strong." },
  { id:"annamalai-university", name:"Annamalai University", short:"Annamalai", district:"Cuddalore", area:"Annamalai Nagar, Chidambaram", type:"State University", estd:1929, rating:4.3, reviews:6120, lat:11.3900, lng:79.7100, kinds:["engineering","arts","medical","management","agri","research"], theme:"orange", img:"images/colleges/campus-orange.jpg", hostel:true, website:"https://www.annamalaiuniversity.ac.in", about:"1929-la start aana periya residential university. 1000+ acre campus, oru oor-e campus maathiri. Engineering, Arts, Science, Agriculture, Dentistry, Pharmacy ellame irukku. Distance education-um famous." },
  { id:"avc-college-mayiladuthurai", name:"A.V.C. College (Autonomous)", short:"AVC College", district:"Mayiladuthurai", area:"Mannampandal", type:"Aided (Autonomous)", estd:1955, rating:4.2, reviews:2340, lat:11.1018, lng:79.6529, kinds:["arts","management","research"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.avccollege.net", about:"1955-la start aana college, Cauvery delta region-la arts & science-ku periyar. Agriculture surroundings-la irukkuradhunala Botany, Zoology strong." },
  { id:"ksr-college-technology", name:"KSR College of Technology", short:"KSRCT", district:"Namakkal", area:"Tiruchengode", type:"Private (Autonomous)", estd:1994, rating:4.0, reviews:3120, lat:11.3680, lng:77.8760, kinds:["engineering","management"], theme:"maroon", img:"images/colleges/campus-red.jpg", hostel:true, website:"https://www.ksrct.ac.in", about:"Tiruchengode-la periya engineering college group. Autonomous status, NBA accredited. Bus facility Namakkal, Salem, Erode ellathukum irukku." },
  { id:"kongu-engineering-college", name:"Kongu Engineering College", short:"Kongu", district:"Erode", area:"Perundurai", type:"Private (Autonomous)", estd:1984, rating:4.3, reviews:4210, lat:11.2730, lng:77.6060, kinds:["engineering","management"], theme:"blue", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://www.kongu.ac.in", about:"Erode-la top engineering college. 1984-la start. Autonomous, NBA + NAAC. Kongu group-oda industries tie-up, placement training strong." },
  { id:"alagappa-university", name:"Alagappa University", short:"Alagappa", district:"Sivaganga", area:"Karaikudi", type:"State University", estd:1985, rating:4.2, reviews:3560, lat:10.0705, lng:78.7900, kinds:["arts","management","research"], theme:"purple", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.alagappauniversity.ac.in", about:"1985-la Dr. RM. Alagappa Chettiar trust-la start aana university. Karaikudi-la periyar. Science, Arts, Management + distance education. NAAC A+." },
  { id:"sastra-thanjavur", name:"SASTRA Deemed University", short:"SASTRA", district:"Thanjavur", area:"Thirumalaisamudram", type:"Deemed University", estd:1984, rating:4.5, reviews:5890, lat:10.7867, lng:79.0625, kinds:["engineering","management","arts","research"], theme:"orange", img:"images/colleges/campus-orange.jpg", hostel:true, website:"https://www.sastra.edu", about:"Thanjavur-la periya deemed university. Engineering + Law + Management + Arts ellame. JEE Main / SASTRA entrance venum. Research output top-la irukku." },
  { id:"central-university-tn", name:"Central University of Tamil Nadu", short:"CUTN", district:"Tiruvarur", area:"Neelakudi, Thiruvarur", type:"Central University", estd:2009, rating:4.4, reviews:2890, lat:10.8100, lng:79.7200, kinds:["arts","research","management"], theme:"teal", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://cutn.ac.in", about:"2009-la start aana central university. CUET entrance venum. Integrated M.Sc, M.A, MBA, research programmes. Fee kammi, hostel + scholarship facility irukku." },
  { id:"voc-college-thoothukudi", name:"V.O. Chidambaram College", short:"VOC College", district:"Thoothukudi", area:"Palayamkottai Road", type:"Aided (Autonomous)", estd:1951, rating:4.3, reviews:3010, lat:8.8100, lng:78.1500, kinds:["arts","research","polytechnic"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.voccollege.ac.in", about:"1951-la start aana college. Thoothukudi region-la arts, science, commerce-ku periyar. Fisheries & marine related courses-um irukku (kadal pakkathula irukkuradhunala)." },
  { id:"holy-cross-college-nagercoil", name:"Holy Cross College (Women)", short:"Holy Cross", district:"Kanyakumari", area:"Nagercoil", type:"Aided (Autonomous)", estd:1953, rating:4.4, reviews:2760, lat:8.1830, lng:77.4300, kinds:["arts","management"], theme:"purple", img:"images/colleges/campus-yellow.jpg", hostel:true, website:"https://www.holycrossngl.edu.in", about:"1953-la start aana women's college. Kanyakumari district-la pengalukku best arts & science college. NAAC A+. Hostel, library, placement cell strong." },
  { id:"govt-arts-dindigul", name:"Government Arts College, Dindigul", short:"GAC Dindigul", district:"Dindigul", area:"Nagal Nagar", type:"Government", estd:1965, rating:4.0, reviews:1980, lat:10.3624, lng:77.9695, kinds:["arts","polytechnic"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.gacdindigul.ac.in", about:"1965-la start aana government arts college. Fee romba kammi (₹1,000-க்கும் கீழே irukkalaam). B.A, B.Sc, B.Com ellame irukku. Local students-ku best." },
  { id:"govt-arts-karur", name:"Government Arts College (Autonomous), Karur", short:"GAC Karur", district:"Karur", area:"Thanthonimalai", type:"Government", estd:1962, rating:4.0, reviews:1760, lat:10.9601, lng:78.0766, kinds:["arts","polytechnic"], theme:"yellow", img:"images/colleges/campus-yellow.jpg", hostel:true, website:"https://www.gackarur.ac.in", about:"1962-la start aana government college, ippo autonomous. Karur region students-ku arts & science-ku easy & cheap option. PG courses-um irukku." },
  { id:"adhiyamaan-krishnagiri", name:"Adhiyamaan College of Engineering", short:"Adhiyamaan", district:"Krishnagiri", area:"Dr. MGR Nagar, Hosur", type:"Private (Autonomous)", estd:1987, rating:4.1, reviews:2540, lat:12.7380, lng:77.8280, kinds:["engineering","management"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.adhiyamaan.ac.in", about:"Hosur-la periya engineering college. Bangalore-kku pakkathula irukkuradhunala IT & auto industry internship chance neraya. Autonomous, NBA accredited." },
  { id:"govt-arts-dharmapuri", name:"Government Arts College, Dharmapuri", short:"GAC Dharmapuri", district:"Dharmapuri", area:"Dharmapuri", type:"Government", estd:1964, rating:4.0, reviews:1640, lat:12.1270, lng:78.1580, kinds:["arts","polytechnic"], theme:"orange", img:"images/colleges/campus-orange.jpg", hostel:true, website:"https://www.gacdharmapuri.ac.in", about:"Government arts college — fee kammi, hostel facility. B.A, B.Sc, B.Com, BBA ellame irukku. Dharmapuri & Krishnagiri students-ku main option." },
  { id:"govt-arts-ooty", name:"Government Arts College, Udhagamandalam", short:"GAC Ooty", district:"Nilgiris", area:"Udhagamandalam", type:"Government", estd:1965, rating:4.1, reviews:1420, lat:11.4102, lng:76.6950, kinds:["arts","research"], theme:"teal", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.gacooty.ac.in", about:"Ooty-la irukku — India-vin most scenic campus-ல ஒன்னு! Malai, thodi, kaatru ellame. Botany, Zoology, Tourism related courses-ku best environment." },
  { id:"govt-poly-ariyalur", name:"Government Polytechnic College, Ariyalur", short:"GPT Ariyalur", district:"Ariyalur", area:"Ariyalur", type:"Government", estd:1985, rating:3.9, reviews:980, lat:11.1400, lng:79.0800, kinds:["polytechnic"], theme:"orange", img:"images/colleges/campus-orange.jpg", hostel:true, website:"https://www.dte.tn.gov.in", about:"10th mudicha students-ku diploma padikka government polytechnic. Fee romba kammi. Diploma mudicha lateral entry-a B.E 2nd year-la sernthu kollalaam — ithu periya advantage!" },
  { id:"dhanalakshmi-perambalur", name:"Dhanalakshmi Srinivasan Engineering College", short:"DSEC", district:"Perambalur", area:"Perambalur", type:"Private (Autonomous)", estd:2001, rating:4.0, reviews:2210, lat:11.2333, lng:78.8833, kinds:["engineering","management"], theme:"blue", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://www.dsec.ac.in", about:"Perambalur-la private engineering college. Autonomous status. Trichy-Perambalur area students-ku convenient. Bus facility ellaa pakkam-um irukku." },
  { id:"govt-arts-pudukkottai", name:"Government Arts College, Pudukkottai", short:"GAC Pudukkottai", district:"Pudukkottai", area:"Pudukkottai", type:"Government", estd:1965, rating:3.9, reviews:1320, lat:10.3833, lng:78.8001, kinds:["arts","polytechnic"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.gacpudukkottai.ac.in", about:"Government arts college with very low fees. Arts, Science, Commerce UG + PG courses. Rural students-ku higher education access kidaikkum." },
  { id:"alagappa-gac-ramanathapuram", name:"Alagappa Government Arts College", short:"AGAC Ramanathapuram", district:"Ramanathapuram", area:"Ramanathapuram", type:"Government", estd:1947, rating:4.0, reviews:1560, lat:9.3639, lng:78.8395, kinds:["arts"], theme:"yellow", img:"images/colleges/campus-yellow.jpg", hostel:true, website:"https://www.agacrmd.ac.in", about:"1947-la start aana pazhaya government college. Ramanathapuram students-ku arts & science padikka main option. Library & hostel irukku." },
  { id:"govt-poly-ranipet", name:"Government Polytechnic College, Ranipet", short:"GPT Ranipet", district:"Ranipet", area:"Ranipet", type:"Government", estd:1980, rating:3.9, reviews:1120, lat:12.9249, lng:79.3300, kinds:["polytechnic"], theme:"maroon", img:"images/colleges/campus-red.jpg", hostel:true, website:"https://www.dte.tn.gov.in", about:"Ranipet-la government polytechnic. 10th mudicha diploma (Diploma in Engineering) padikkalaam. Ranipet industrial area-la irukkuradhunala job chance neraya." },
  { id:"govt-poly-tirupathur", name:"Government Polytechnic College, Tirupathur", short:"GPT Tirupathur", district:"Tirupathur", area:"Tirupathur", type:"Government", estd:1985, rating:3.9, reviews:940, lat:12.4954, lng:78.5678, kinds:["polytechnic"], theme:"blue", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://www.dte.tn.gov.in", about:"Tirupathur-la government polytechnic college. Diploma in Mechanical, EEE, Civil, CSE branches irukku. Hostel facility irukku." },
  { id:"govt-arts-kallakurichi", name:"Government Arts College, Kallakurichi", short:"GAC Kallakurichi", district:"Kallakurichi", area:"Kallakurichi", type:"Government", estd:2013, rating:3.9, reviews:860, lat:11.7380, lng:78.9600, kinds:["arts","polytechnic"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.gackallakurichi.ac.in", about:"Pudhusa start aana government arts college. Fee kammi, UG courses neraya. Kalvarayan malai area students-ku college access." },
  { id:"egs-pillay-nagapattinam", name:"E.G.S. Pillay Engineering College", short:"EGS Pillay", district:"Nagapattinam", area:"Nagore", type:"Private (Autonomous)", estd:1995, rating:4.0, reviews:1980, lat:10.7659, lng:79.8449, kinds:["engineering","management"], theme:"teal", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.egspec.org", about:"Nagapattinam-la private engineering college. Autonomous. Nagore pakkathula irukkuradhunala coastal area students-ku convenient. Placement cell active." },
  { id:"kamaraj-virudhunagar", name:"Kamaraj College of Engineering & Technology", short:"KCET", district:"Virudhunagar", area:"Virudhunagar", type:"Private (Autonomous)", estd:1998, rating:4.1, reviews:2260, lat:9.5851, lng:77.9578, kinds:["engineering","management"], theme:"orange", img:"images/colleges/campus-orange.jpg", hostel:true, website:"https://www.kamarajengg.edu.in", about:"Virudhunagar-la engineering college. Autonomous, NBA accredited. Sivakasi, Virudhunagar, Madurai students ellam inge padikkiranga." },
  { id:"govt-poly-tenkasi", name:"Government Polytechnic College, Tenkasi", short:"GPT Tenkasi", district:"Tenkasi", area:"Tenkasi", type:"Government", estd:1985, rating:3.9, reviews:880, lat:8.9600, lng:77.3152, kinds:["polytechnic"], theme:"purple", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.dte.tn.gov.in", about:"Tenkasi-la government polytechnic. 10th mudicha students-ku diploma courses. Hostel irukku, fee romba kammi." },
  { id:"govt-arts-tiruvannamalai", name:"Government Arts College, Tiruvannamalai", short:"GAC TVM", district:"Tiruvannamalai", area:"Tiruvannamalai", type:"Government", estd:1966, rating:4.0, reviews:1480, lat:12.2253, lng:79.0747, kinds:["arts","polytechnic"], theme:"yellow", img:"images/colleges/campus-yellow.jpg", hostel:true, website:"https://www.gactvm.ac.in", about:"Tiruvannamalai-la government arts college. Girivalam path-ku pakkathula. Arts, Science, Commerce UG + PG courses. Fee kammi." },
  { id:"arignar-anna-gac-villupuram", name:"Arignar Anna Government Arts College", short:"AAGAC Villupuram", district:"Viluppuram", area:"Villupuram", type:"Government", estd:1966, rating:4.0, reviews:1620, lat:11.9401, lng:79.4861, kinds:["arts","polytechnic"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.aagacvpm.ac.in", about:"Villupuram-la government arts college. Tamil literature & History-ku periyar. PG courses-um irukku. Hostel facility available." },
  { id:"scsvmv-kanchipuram", name:"SCSVMV Deemed University", short:"SCSVMV", district:"Kanchipuram", area:"Enathur", type:"Deemed University", estd:1993, rating:4.2, reviews:2410, lat:12.8342, lng:79.7036, kinds:["engineering","arts","research"], theme:"maroon", img:"images/colleges/campus-red.jpg", hostel:true, website:"https://www.kanchiuniv.ac.in", about:"Sri Chandrasekharendra Saraswathi Viswa Mahavidyalaya — Kanchipuram-la Deemed University. Engineering, Sanskrit, Arts, Management ellame. Campus-la temple + cultural atmosphere." },
  { id:"govt-poly-tiruvallur", name:"Government Polytechnic College, Tiruvallur", short:"GPT Tiruvallur", district:"Tiruvallur", area:"Tiruvallur", type:"Government", estd:1980, rating:3.9, reviews:1040, lat:13.1439, lng:79.9094, kinds:["polytechnic"], theme:"blue", img:"images/colleges/campus-blue.jpg", hostel:true, website:"https://www.dte.tn.gov.in", about:"Tiruvallur-la government polytechnic. Chennai pakkathula irukkuradhunala industry exposure neraya. Diploma mudicha lateral entry B.E chance." },
  { id:"chikkanna-tiruppur", name:"Chikkanna Government Arts College", short:"CGAC Tiruppur", district:"Tiruppur", area:"Tiruppur", type:"Government", estd:1967, rating:4.0, reviews:1710, lat:11.1085, lng:77.3411, kinds:["arts","polytechnic"], theme:"orange", img:"images/colleges/campus-orange.jpg", hostel:true, website:"https://www.cgactiruppur.ac.in", about:"Tiruppur-la government arts college. Knitwear city-la irukkuradhunala Textile & Commerce courses useful. UG + PG courses irukku." },
  { id:"govt-arts-theni", name:"Government Arts College, Theni", short:"GAC Theni", district:"Theni", area:"Theni", type:"Government", estd:1965, rating:3.9, reviews:1180, lat:10.0104, lng:77.4768, kinds:["arts","polytechnic"], theme:"green", img:"images/colleges/campus-green.jpg", hostel:true, website:"https://www.gactheni.ac.in", about:"Theni-la government arts college. Cardamom hills pakkathula. Agriculture related surroundings-la irukkuradhunala Botany, Zoology strong. Fee kammi." },
  { id:"ambedkar-law-college", name:"Dr. Ambedkar Government Law College", short:"Govt Law College", district:"Chennai", area:"Poonamallee", type:"Government", estd:1899, rating:4.3, reviews:2610, lat:13.0489, lng:80.0950, kinds:["law"], theme:"maroon", img:"images/colleges/campus-red.jpg", hostel:true, website:"https://www.tn.gov.in", about:"1899-la start aana Tamil Nadu-vin pazhaya law college. B.A. LL.B (5 year) + LL.M. CLAT / entrance exam venum. Judges, senior advocates neraya ividey padithavanga." }
];

/* ======================= 1.7 HELPER SUB-ROUTINES =======================
   Keela irukira functions COLLEGES data-vukku thaevaiyaana details
   (facilities, placement, reviews, about) automatic-a add pannum. */

/* Distance kanakku — Haversine formula (latitude/longitude-vechu km-l distance) */
function distanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
}

/* Oru college-ku available-aana courses (kinds match aagum courses) */
function coursesForCollege(college, level) {
  return COURSES.filter(c =>
    c.kinds.some(k => college.kinds.includes(k)) && (!level || c.level === level));
}

/* Oru course-a padikka evanga college irukku */
function collegesForCourse(course) {
  return COLLEGES
    .filter(col => col.kinds.some(k => course.kinds.includes(k)))
    .sort((a, b) => b.rating - a.rating);
}

function themeOf(college) { return THEMES[college.theme] || THEMES.red; }
function findCollege(id) { return COLLEGES.find(c => c.id === id); }
function districtInfo(name) { return DISTRICTS.find(d => d.name === name); }

/* Facilities — kinds-ai paathu automatic-a build aagum */
function facilitiesFor(college) {
  const base = ["Digital Library", "Wi-Fi Campus", "Canteen", "Sports Ground", "NSS / NCC", "Medical Room"];
  const map = {
    engineering: ["Workshops & Labs", "Innovation / Incubation Centre", "CAD & Simulation Lab", "Placement Cell"],
    arts: ["Auditorium", "Language Lab", "Commerce Lab", "Career Guidance Cell"],
    medical: ["Attached Hospital", "Clinical Skills Lab", "Anatomy Museum", "Nursing Lab"],
    management: ["Business Analytics Lab", "Placement Training", "Industry Visits"],
    polytechnic: ["Trade Workshops", "Industry Training", "Apprenticeship Support"],
    agri: ["Research Farm", "Dairy Unit", "Botanical Garden", "Soil Testing Lab"],
    law: ["Moot Court Hall", "Law Library", "Legal Aid Clinic"],
    research: ["Research Park", "Central Instrumentation Lab", "Scholar Hostel"]
  };
  college.kinds.forEach(k => { if (map[k]) base.push(...map[k]); });
  if (college.hostel) base.push("Boys & Girls Hostel");
  return [...new Set(base)];
}

/* Placement details — kind-ai vechu realistic-a kanakku */
function placementFor(college) {
  const seed = college.id.length + college.estd;
  const bump = (seed % 5) * 0.15;
  const table = {
    engineering: { avg: 4.2, high: 22 }, arts: { avg: 2.6, high: 8 },
    medical: { avg: 3.6, high: 14 }, management: { avg: 3.8, high: 16 },
    polytechnic: { avg: 2.4, high: 6 }, agri: { avg: 3.2, high: 10 },
    law: { avg: 3.4, high: 12 }, research: { avg: 4.0, high: 15 }
  };
  const key = college.kinds[0];
  const t = table[key] || table.arts;
  const recruiters = {
    engineering: ["TCS", "Infosys", "Zoho", "Cognizant", "L&T", "Bosch", "Ford"],
    arts: ["Wipro", "HDFC Bank", "ICICI Prudential", "Deloitte Support", "Sutherland"],
    medical: ["Apollo Hospitals", "Fortis", "Govt. Health Dept.", "Kauvery Hospital", "AIIMS"],
    management: ["HDFC Bank", "Deloitte", "Byju's", "Muthoot Finance", "Amazon Seller Services"],
    polytechnic: ["TVS Motors", "Ashok Leyland", "MRF", "Sundaram Fasteners", "Lucas TVS"],
    agri: ["TNAU", "Agri Dept.", "UPL", "Coromandel", "NABARD"],
    law: ["Law Firms", "Legal Process Outsourcing", "Advocate Chambers", "Banks Legal Cell"],
    research: ["CSIR Labs", "DRDO", "ISRO Units", "Universities", "Pharma R&D"]
  };
  const rate = Math.min(98, Math.max(45, Math.round(62 + (college.rating - 4) * 35 + (seed % 7))));
  return {
    avgPackage: (t.avg + bump).toFixed(1) + " LPA",
    highPackage: (t.high + bump * 4).toFixed(0) + " LPA",
    placementRate: rate,
    topRecruiters: recruiters[key] || recruiters.arts
  };
}

/* Reviews — each college-kku automatic-a 3 reviews create aagum.
   Featured colleges-ku hand-written review irukku.                    */
const REVIEW_NAMES = ["Karthik R.", "Priya Dharshini", "Mohammed Ashiq", "Sangeetha M.", "Vignesh Kumar",
  "Divya Bharathi", "Arun Prakash", "Nithya Sri", "Hari Haran", "Kavya Lakshmi", "Jeeva Nandhan", "Revathi S."];
const REVIEW_TEXT = [
  "Faculty romba helpful. Practical class-la neraya neram lab-la iruppom. Placement training 2nd year-la irundhe start aaguthu.",
  "Fee ku etha value kidaikum. Library, Wi-Fi ellam nalla maintain pannirukanga. Hostel food innum konjam improve panna venum.",
  "Campus atmosphere super. Kultuval function, sports ellam active-a nadakkum. Seniors support romba nalla irukku.",
  "Industrial visit & internship chance nalla kidaikum. Staff ellam doubt kekkum pothu clear-a explain pannuvanga.",
  "Placement-la top companies varum. Aptitude & communication training compulsory-a irukku — adhu romba useful.",
  "Local students-ku best option. Bus facility pakkathu village ellathukum irukku. Attendance strict-a maintain pannuvanga.",
  "Naan join pannapo konjam bayama irundhuchu, aana professor-ngal romba support pannanga. Club activities-la kalandhuten.",
  "Research lab & projects-ku nalla support irukku. Final year-la paper presentation panna encourage pannuvanga."
];
const REVIEW_TITLES = ["Good college for the fees", "Best in the region", "Placement oriented", "Campus life super",
  "Faculty support", "Worth joining", "Practical exposure", "Safe for girls"];
function reviewsFor(college) {
  if (college.id === "anna-university") return [
    { name:"Karthik R.", course:"B.E. CSE, 2024", rating:5, title:"Tamil Nadu-in best technical campus", text:"TNEA counselling-la CEG campus kidaichuthu. Professors ellam research side strong. Coding club, hackathon ellam active. Placement-la product companies neraya varum." },
    { name:"Priya Dharshini", course:"M.E. Structural Engg, 2023", rating:4, title:"PG-ku nalla option", text:"Guindy campus-la irukkuradhunala industry seminars & internship neraya kidaikkum. Hostel konjam pazhaya building, aana maintenance okay." },
    { name:"Mohammed Ashiq", course:"B.Tech IT, 2022", rating:4, title:"Good exposure, city life", text:"Chennai city-la irukkuradhunala internship and part-time project chance neraya. Fest 'Kurukshetra' semma." }
  ];
  if (college.id === "psg-tech") return [
    { name:"Sangeetha M.", course:"B.E. ECE, 2024", rating:5, title:"Industry connection vera level", text:"PSG group industries irukkuradhunala internship easy-a kidaikum. Lab facility, equipment ellam top class. Attendance strict, aana adhu than nallathu." },
    { name:"Vignesh Kumar", course:"B.Tech AI&DS, 2025", rating:5, title:"Coding culture super", text:"First year-la irundhe coding club join panniten. Seniors & alumni mentor pannuvanga. Placement training 3rd year-la full swing." },
    { name:"Nithya Sri", course:"MBA, 2023", rating:4, title:"Management studies nalla irukku", text:"Case study based teaching. Company visits neraya. Canteen & hostel food quality paravailla." }
  ];
  if (college.id === "american-college") return [
    { name:"Hari Haran", course:"B.Sc Chemistry, 2024", rating:5, title:"140 years heritage campus", text:"Clock tower, koraiyila pathukkal, semma atmosphere. Professor-ngal romba knowledgeable. Sports & culturals-ku neraya chance." },
    { name:"Kavya Lakshmi", course:"B.Com, 2023", rating:5, title:"Commerce-ku best in Madurai", text:"Commerce department strong. CA / CS coaching classes evening-la nadakkum. Library-la commerce journals neraya irukku." },
    { name:"Arun Prakash", course:"B.A. Tamil, 2022", rating:4, title:"Tamil literature-ku periyar", text:"Tamil department-la pazhaya manuscripts, seminar ellam nadakkum. Hostel facility konjam upgrade pannanum." }
  ];
  const seed = college.id.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0);
  const pick = (arr, n) => arr[(seed + n) % arr.length];
  const r = college.rating;
  return [0, 1, 2].map(i => ({
    name: pick(REVIEW_NAMES, i * 3 + 1),
    course: (coursesForCollege(college)[i % Math.max(1, coursesForCollege(college).length)] || { name: "UG Course" }).name + ", 202" + (2 + (i % 3)),
    rating: Math.max(3, Math.min(5, Math.round(r) - (i === 2 ? 1 : 0))),
    title: pick(REVIEW_TITLES, i * 2 + 1),
    text: pick(REVIEW_TEXT, i * 5 + 3)
  }));
}

/* About text — college-ku special about illainaa automatic-a build aagum */
function aboutFor(college) {
  if (college.about) return college.about;
  return `${college.name} is a ${college.type.toLowerCase()} institution in ${college.area}, ${college.district} district, established in ${college.estd}. ` +
    `Idhu ${college.kinds.map(k => KIND_LABEL[k]).join(", ")} department-களில் courses offer pannuthu. ` +
    `Tamil Nadu-la ${college.district} area students-ku higher education access kidaikka oru nalla option. ` +
    `Rating ${college.rating}/5 — ${college.reviews.toLocaleString("en-IN")} student reviews.`;
}

/* ===================== 1.8 COLLEGE-VUKKU SEARCH ===================== */
function searchColleges(opts = {}) {
  const { q = "", district = "", kinds = [], level = "", maxFee = 0, hostel = false,
          minRating = 0, sort = "rating", userLat = null, userLng = null } = opts;
  const text = q.trim().toLowerCase();
  let list = COLLEGES.map(c => ({ ...c, _dist: (userLat != null ? distanceKm(userLat, userLng, c.lat, c.lng) : null) }));

  if (text) list = list.filter(c =>
    (c.name + " " + c.short + " " + c.district + " " + c.area + " " + c.type + " " +
     coursesForCollege(c).map(x => x.name).join(" ")).toLowerCase().includes(text));
  if (district) list = list.filter(c => c.district === district);
  if (kinds.length) list = list.filter(c => kinds.some(k => c.kinds.includes(k)));
  if (level) list = list.filter(c => coursesForCollege(c, level).length > 0);
  if (minRating) list = list.filter(c => c.rating >= minRating);
  if (hostel) list = list.filter(c => c.hostel);
  if (maxFee) list = list.filter(c => feeBand(c) <= maxFee);

  const sorters = {
    rating: (a, b) => b.rating - a.rating,
    name: (a, b) => a.name.localeCompare(b.name),
    fee: (a, b) => feeBand(a) - feeBand(b),
    estd: (a, b) => a.estd - b.estd,
    nearby: (a, b) => (a._dist ?? 1e9) - (b._dist ?? 1e9)
  };
  return list.sort(sorters[sort] || sorters.rating);
}

/* College fee band — courses-la irukkura fee-la irundhu rough category */
function feeBand(college) {
  const c = coursesForCollege(college);
  const gov = /Government|Aided|Institute|State|Central/.test(college.type);
  if (gov) return c.some(x => x.level === "PG") ? 2 : 1;
  return c.some(x => x.level === "PG") ? 3 : 2;   /* 1=low, 2=medium, 3=high */
}
const FEE_LABEL = { 1: "Low (₹0 – ₹40K/yr)", 2: "Medium (₹40K – ₹1L/yr)", 3: "High (₹1L+/yr)" };

/* ==========================================================================
   1.8 STUDENT PORTAL DATA  (portal.html-ku matthum)
   --------------------------------------------------------------------------
   Admission+ = college SERCH panna (admission-ku MUNNADI).
   Student Portal = college-la SERNTHA piragu student-oda daily life:
   attendance, marks, timetable, fees, announcements.
   Ippo ithu DEMO data — nijha college-la ithu backend-la irundhu varum.
   ========================================================================== */

/* ---------------------- 1.8.1 STUDENT PROFILE (DEMO) -------------------- */
const PORTAL = {
  student: {
    name: "Demo Student",
    roll: "24CS1023",
    regNo: "311624104023",
    dept: "B.E. Computer Science & Engineering",
    year: "II Year",
    sem: "Semester 3",
    section: "A",
    batch: "2024 – 2028",
    mentor: "Dr. K. Revathi",
    college: "Coimbatore Institute of Technology (Demo Campus)",
    proctorRoom: "CS Block — Room 204",
    blood: "O +ve"
  },

  /* ------------------ 1.8.2 SUBJECTS + ATTENDANCE + CIA MARKS -----------
     att% = present/total. cia = CIA-1, CIA-2, CIA-3 (out of 50)           */
  subjects: [
    { code: "CS301", name: "Data Structures",        staff: "Dr. K. Revathi",   credits: 4, present: 46, total: 50, cia: [41, 39, null], type: "Theory" },
    { code: "CS302", name: "Database Systems",       staff: "Prof. M. Karthik", credits: 4, present: 40, total: 48, cia: [36, 38, null], type: "Theory" },
    { code: "CS303", name: "Operating Systems",      staff: "Dr. S. Anand",     credits: 3, present: 33, total: 45, cia: [28, 31, null], type: "Theory" },
    { code: "CS304", name: "Computer Networks",      staff: "Prof. R. Divya",   credits: 3, present: 42, total: 47, cia: [35, 37, null], type: "Theory" },
    { code: "MA301", name: "Discrete Mathematics",   staff: "Dr. P. Meena",     credits: 4, present: 44, total: 49, cia: [40, 42, null], type: "Theory" },
    { code: "HS301", name: "Professional English",   staff: "Ms. J. Farhana",   credits: 2, present: 21, total: 22, cia: [44, 45, null], type: "Theory" },
    { code: "CS305", name: "DS & DBMS Laboratory",   staff: "Prof. M. Karthik", credits: 2, present: 14, total: 14, cia: [47, 48, null], type: "Lab" }
  ],

  /* ------------------------- 1.8.3 SEM RESULTS -------------------------- */
  sems: [
    { sem: "Sem 1", gpa: 8.10, credits: 22, status: "All clear" },
    { sem: "Sem 2", gpa: 8.74, credits: 23, status: "All clear" }
  ],

  /* ------------------------- 1.8.4 WEEK TIMETABLE ------------------------
     p = period number. Dashboard innikki (today) class-a kaatum.          */
  timetable: {
    times: ["08:45 – 09:35", "09:35 – 10:25", "10:45 – 11:35", "11:35 – 12:25", "01:20 – 02:10", "02:10 – 03:00", "03:10 – 04:00"],
    days: {
      Monday:    ["CS301", "MA301", "CS302", "HS301", "CS305 (Lab)", "CS305 (Lab)", "Library"],
      Tuesday:   ["CS303", "CS301", "MA301", "CS304", "CS302", "Mentor Hour", "Sports"],
      Wednesday: ["CS302", "CS304", "CS303", "MA301", "CS305 (Lab)", "CS305 (Lab)", "—"],
      Thursday:  ["MA301", "CS303", "HS301", "CS301", "CS304", "Placement Training", "—"],
      Friday:    ["CS304", "CS302", "CS301", "CS303", "Mini Project", "Mini Project", "—"],
      Saturday:  ["Skill Club", "Skill Club", "—", "—", "—", "—", "—"]
    }
  },

  /* --------------------------- 1.8.5 FEES -------------------------------- */
  fees: {
    year: "2026 – 27",
    items: [
      { name: "Tuition Fee (Year 2)", amount: 55000, paid: true,  receipt: "RCP/2026/1182", date: "02 Jul 2026" },
      { name: "Hostel + Mess Fee",    amount: 38500, paid: true,  receipt: "RCP/2026/1204", date: "06 Jul 2026" },
      { name: "Semester 3 Exam Fee",  amount: 4200,  paid: false, due: "30 Sep 2026" },
      { name: "Bus Route 7 (Avinashi)", amount: 12000, paid: false, due: "05 Oct 2026" }
    ]
  },

  /* ------------------------ 1.8.6 ANNOUNCEMENTS -------------------------- */
  announce: [
    { pin: true, tag: "Exam",      date: "24 Sep 2026", title: "CIA-3 timetable released",
      text: "CIA-3 exams Oct 6-la thodangum. Hall ticket exam cell-la irundhu Oct 1-ku appuram download pannalaam." },
    { pin: true, tag: "Placement", date: "23 Sep 2026", title: "Infosys campus drive — Oct 14",
      text: "2028 batch eligible. Resume Placement Cell-ku Oct 5-ku munnadi submit pannanum." },
    { pin: false, tag: "Culturals", date: "20 Sep 2026", title: "CIT Fest '26 — registrations open",
      text: "Dance, music, short film, coding contest. Dept coordinator kitta register pannunga." },
    { pin: false, tag: "Library",  date: "18 Sep 2026", title: "New arrivals: GATE / GRE corner",
      text: "Central library 2nd floor-la competitive exam corner open aagiduchu." },
    { pin: false, tag: "Holiday",  date: "15 Sep 2026", title: "Oct 2 — Gandhi Jayanthi holiday",
      text: "College leave. Hostel mess afternoon mattum work aagum." }
  ],

  /* ------------------------- 1.8.7 NEXT EXAM ----------------------------- */
  nextExam: { name: "CIA-3 (Internal Test 3)", start: "06 Oct 2026", days: 11 }
};
