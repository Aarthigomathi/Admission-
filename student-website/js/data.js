/* ==========================================================================
   js/data.js — Demo college data (student website)
   Nijha project-la ithu backend-la irundhu varum. Student register panna
   udane intha college details-a paakuvanga.
   ========================================================================== */

const TN_DISTRICTS = [
  "Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli",
  "Vellore", "Erode", "Thanjavur", "Tiruppur", "Kanyakumari", "Karur", "Namakkal",
  "Dindigul", "Thoothukudi", "Virudhunagar", "Krishnagiri", "Viluppuram", "Theni", "Chengalpattu"
];

const IN_STATES = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana", "Puducherry", "Maharashtra", "Delhi", "Other"];

const COURSES_LIST = [
  "B.E Computer Science", "B.Tech AI & Data Science", "B.E ECE", "B.E Mechanical",
  "B.E Civil", "BCA", "B.Sc Computer Science", "B.Com", "BBA", "MBA", "M.E", "M.Sc"
];

const COLLEGES = [
  {
    id: "thiagarajar", short: "TCE", name: "Thiagarajar College of Engineering",
    district: "Madurai", area: "Thiruparankundram", type: "Aided (Autonomous)", estd: 1957,
    rating: 4.5, fee: "₹55K – ₹1.2L / yr", placement: "92%", highest: "₹24 LPA",
    hostel: true, courses: ["B.E CSE", "B.E ECE", "B.E Mechanical", "B.E Civil", "M.E"],
    about: "1957-la start aana Madurai-vin periya engineering college. Autonomous, NAAC A++, industry-sponsored labs. TNEA counselling top rank."
  },
  {
    id: "psgtech", short: "PSG", name: "PSG College of Technology",
    district: "Coimbatore", area: "Peelamedu", type: "Aided (Autonomous)", estd: 1951,
    rating: 4.7, fee: "₹60K – ₹1.5L / yr", placement: "95%", highest: "₹42 LPA",
    hostel: true, courses: ["B.E CSE", "B.Tech AI & DS", "B.E ECE", "B.E Mechanical", "MBA"],
    about: "Coimbatore-in top institution. Placement record semma, research centres + industry tie-up neraya."
  },
  {
    id: "cit", short: "CIT", name: "Coimbatore Institute of Technology",
    district: "Coimbatore", area: "Aerodrome", type: "Aided (Autonomous)", estd: 1956,
    rating: 4.4, fee: "₹58K – ₹1.3L / yr", placement: "90%", highest: "₹28 LPA",
    hostel: true, courses: ["B.E CSE", "B.E ECE", "B.E Civil", "M.E"],
    about: "1956 government-aided autonomous. Alumni network strong; practical learning-ku famous."
  },
  {
    id: "anna-univ", short: "AU", name: "Anna University (CEG Campus)",
    district: "Chennai", area: "Guindy", type: "State University", estd: 1794,
    rating: 4.6, fee: "₹35K – ₹70K / yr", placement: "93%", highest: "₹40 LPA",
    hostel: true, courses: ["B.E CSE", "B.E ECE", "B.E Mechanical", "B.E Civil", "M.E", "MBA"],
    about: "Tamil Nadu-in oldest technical university. CEG campus — heritage + research. TNEA central office."
  },
  {
    id: "nitchy", short: "NIT-T", name: "National Institute of Technology",
    district: "Tiruchirappalli", area: "Thuvakudi", type: "Institute of National Importance", estd: 1964,
    rating: 4.8, fee: "₹75K – ₹1.6L / yr", placement: "96%", highest: "₹52 LPA",
    hostel: true, courses: ["B.Tech CSE", "B.Tech ECE", "B.Tech Mechanical", "MBA", "M.Sc"],
    about: "NIRF-la top NIT. JEE Main score venum. 800 acre campus, Festember cultural fest."
  },
  {
    id: "loyola", short: "LC", name: "Loyola College",
    district: "Chennai", area: "Nungambakkam", type: "Autonomous (Jesuit)", estd: 1925,
    rating: 4.6, fee: "₹40K – ₹1L / yr", placement: "88%", highest: "₹18 LPA",
    hostel: true, courses: ["B.Sc CS", "B.Com", "BBA", "BCA", "M.Sc"],
    about: "Arts & science-la India top 10. NIRF ranked, media & commerce courses famous."
  },
  {
    id: "mcc", short: "MCC", name: "Madras Christian College",
    district: "Chengalpattu", area: "Tambaram", type: "Autonomous", estd: 1837,
    rating: 4.5, fee: "₹38K – ₹95K / yr", placement: "86%", highest: "₹16 LPA",
    hostel: true, courses: ["B.Sc", "B.Com", "BBA", "BCA", "M.Sc"],
    about: "1837-la start aana heritage college. 365 acre green campus, scrub jungle-ku periyar."
  },
  {
    id: "srm", short: "SRM", name: "SRM Institute of Science & Technology",
    district: "Chengalpattu", area: "Kattankulathur", type: "Deemed University", estd: 1985,
    rating: 4.3, fee: "₹2L – ₹3.5L / yr", placement: "91%", highest: "₹65 LPA",
    hostel: true, courses: ["B.Tech CSE", "B.Tech AI & DS", "B.Tech ECE", "MBA", "M.Sc"],
    about: "SRMJEEE entrance. Big campus, international collaborations, huge placement drives."
  },
  {
    id: "gce-salem", short: "GCE-S", name: "Government College of Engineering",
    district: "Salem", area: "Karuppur", type: "Government", estd: 1985,
    rating: 4.2, fee: "₹15K – ₹40K / yr", placement: "82%", highest: "₹12 LPA",
    hostel: true, courses: ["B.E CSE", "B.E ECE", "B.E Mechanical", "B.E Civil"],
    about: "Government college — fee romba kammi. Autonomous status, TNEA counselling-la easy access."
  },
  {
    id: "vit", short: "VIT", name: "Vellore Institute of Technology",
    district: "Vellore", area: "Katpadi", type: "Deemed University", estd: 1984,
    rating: 4.6, fee: "₹2L – ₹4L / yr", placement: "94%", highest: "₹62 LPA",
    hostel: true, courses: ["B.Tech CSE", "B.Tech AI & DS", "B.Tech ECE", "MBA"],
    about: "VITEEE entrance. 350+ acre campus, 40,000+ students, semester-abroad option."
  }
];
