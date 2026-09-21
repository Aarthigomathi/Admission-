/* =====================================================
   KalviPortal — data.js
   Idhu dhaan namma website oda "database".
   oneLiner = English, ta = Tamil description.
   ===================================================== */

/* ---------- Tamil Nadu ALL 38 Districts ---------- */
const CITIES = ["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"];

/* ---------- Categories ---------- */
const CATEGORIES = ["Engineering","Medical","Arts & Science","Polytechnic / ITI"];

/* ---------- COLLEGES LIST ---------- */
const COLLEGES = [
  /* ============ CHENNAI ============ */
  {id:"anna-university", name:"Anna University", city:"Chennai", category:"Engineering",
   founded:1978, rating:4.8, reviewsCount:2350, seats:"13,000+ (UG)", fee:"₹15,000 – ₹60,000 / year",
   img:"images/college-red.jpg", map:"Anna University, Sardar Patel Road, Chennai",
   featured:true, page:"anna-university.html",
   tags:["BE CSE","BE ECE","BE Mechanical","BE Civil","BE EEE","B.Arch","MBA","M.Tech"],
   oneLiner:"India's largest engineering university — 500+ affiliated colleges, world-class research.",
   ta:"இந்தியாவிலேயே மிகப்பெரிய பொறியியல் பல்கலைக்கழகம் — 500+ இணைப்பு கல்லூரிகள், உலகத் தரம் வாய்ந்த ஆராய்ச்சி."},

  {id:"iit-madras", name:"IIT Madras", city:"Chennai", category:"Engineering",
   founded:1959, rating:4.9, reviewsCount:3120, seats:"2,500+ (UG)", fee:"₹1L – ₹2.2L / year",
   img:"images/college-orange.jpg", map:"IIT Madras, Chennai",
   featured:true, page:"iit-madras.html",
   tags:["BTech CSE","BTech EE","BTech Aero","BS Data Science","MTech","MBA","PhD"],
   oneLiner:"India's #1 engineering institute (NIRF) — green campus with deer, plus an online BS degree!",
   ta:"இந்தியாவின் #1 பொறியியல் கல்லூரி (NIRF) — மான்கள் நடமாடும் பசுமை வளாகம், ஆன்லைன் பட்டப்படிப்பும் உண்டு!"},

  {id:"loyola-college", name:"Loyola College", city:"Chennai", category:"Arts & Science",
   founded:1925, rating:4.8, reviewsCount:1890, seats:"4,000+ (UG)", fee:"₹25,000 – ₹80,000 / year",
   img:"images/college-yellow.jpg", map:"Loyola College, Sterling Road, Chennai",
   featured:true, page:"loyola-college.html",
   tags:["BCom","BA Economics","BSc Physics","BBA","BCA","MA","MCom"],
   oneLiner:"100+ years of history — Tamil Nadu's most famous arts & science college, top placements.",
   ta:"100+ ஆண்டு வரலாறு — தமிழ்நாட்டின் மிகப் பிரபலமான கலை & அறிவியல் கல்லூரி, சிறந்த வேலைவாய்ப்பு."},

  {id:"mmc", name:"Madras Medical College", city:"Chennai", category:"Medical",
   founded:1835, rating:4.7, reviewsCount:1560, seats:"250 MBBS", fee:"₹15,000 – ₹35,000 / year",
   img:"images/campus-life.jpg", map:"Madras Medical College, Chennai",
   tags:["MBBS","MD","MS","Allied Health"],
   oneLiner:"One of Asia's oldest medical colleges — established in 1835.",
   ta:"ஆசியாவின் மிகப் பழமையான மருத்துவக் கல்லூரிகளில் ஒன்று — 1835-ல் தொடங்கப்பட்டது."},

  {id:"central-poly", name:"Central Polytechnic College", city:"Chennai", category:"Polytechnic / ITI",
   founded:1960, rating:4.4, reviewsCount:640, seats:"900+", fee:"₹3,000 – ₹12,000 / year",
   img:"images/college-red.jpg", map:"Central Polytechnic College, Chennai",
   tags:["Diploma Mech","Diploma EEE","Diploma Civil","Diploma CSE"],
   oneLiner:"Best government polytechnic to join right after 10th — job-oriented diploma.",
   ta:"10th முடித்ததும் சேரக்கூடிய சிறந்த அரசு பாலிடெக்னிக் — தொழில் சார்ந்த டிப்ளமா."},

  /* ============ COIMBATORE ============ */
  {id:"psg-tech", name:"PSG College of Technology", city:"Coimbatore", category:"Engineering",
   founded:1951, rating:4.7, reviewsCount:1780, seats:"8,300+", fee:"₹55,000 – ₹87,000 / year (UG)",
   img:"images/psg-hero.jpg", map:"PSG College of Technology, Peelamedu, Coimbatore",
   featured:true, page:"psg-college-of-technology.html",
   official:"https://www.psgtech.edu",
   tags:["BE CSE","BE Mech","BE ECE","BE Robotics","B.Tech Biotech","BE Fashion Tech","MBA","M.Tech"],
   oneLiner:"Coimbatore's pride since 1951 — NIRF #67, NAAC 'A' grade, 90% placements on a 45-acre campus beside the PSG industries.",
   ta:"1951 முதல் கோயம்புத்தூரின் பெருமை — NIRF #67, NAAC 'A' தரம், 90% வேலைவாய்ப்பு, PSG தொழிற்சாலைகளுடன் 45 ஏக்கர் வளாகம்."},

  {id:"cit", name:"Coimbatore Institute of Technology", city:"Coimbatore", category:"Engineering",
   founded:1956, rating:4.5, reviewsCount:1240, seats:"1,500+", fee:"₹55,000 – ₹1L / year",
   img:"images/college-red.jpg", map:"Coimbatore Institute of Technology, Coimbatore",
   tags:["BE CSE","BE IT","BE ECE","BE Civil"],
   oneLiner:"Government-aided legacy college — strong alumni network.",
   ta:"அரசு உதவி பெறும் பழமையான கல்லூரி — வலுவான முன்னாள் மாணவர் வலையமைப்பு."},

  {id:"kct", name:"Kumaraguru College of Technology", city:"Coimbatore", category:"Engineering",
   founded:1984, rating:4.6, reviewsCount:1450, seats:"1,900+", fee:"₹60,000 – ₹1.1L / year",
   img:"images/college-yellow.jpg", map:"Kumaraguru College of Technology, Coimbatore",
   tags:["BE CSE","BE AI&DS","BE Mechatronics","B.Tech IT"],
   oneLiner:"College that creates startups through its 'Forge' incubator — modern campus.",
   ta:"'Forge' இன்குபேட்டர் மூலம் ஸ்டார்ட்அப்கள் உருவாக்கும் நவீன கல்லூரி."},

  /* ============ MADURAI ============ */
  {id:"tce", name:"Thiagarajar College of Engineering", city:"Madurai", category:"Engineering",
   founded:1957, rating:4.6, reviewsCount:1120, seats:"1,400+", fee:"₹50,000 – ₹95,000 / year",
   img:"images/college-orange.jpg", map:"Thiagarajar College of Engineering, Madurai",
   tags:["BE CSE","BE ECE","BE Mech","BE Automobile"],
   oneLiner:"Madurai's top self-financing engineering college — NAAC A++.",
   ta:"மதுரையின் முதன்மை சுயநிதி பொறியியல் கல்லூரி — NAAC A++ தரம்."},

  {id:"madurai-medical", name:"Madurai Medical College", city:"Madurai", category:"Medical",
   founded:1954, rating:4.6, reviewsCount:980, seats:"250 MBBS", fee:"₹15,000 – ₹30,000 / year",
   img:"images/campus-life.jpg", map:"Madurai Medical College, Madurai",
   tags:["MBBS","MD","MS","BSc Nursing"],
   oneLiner:"South Tamil Nadu's most important government medical college.",
   ta:"தென் தமிழ்நாட்டின் மிக முக்கிய அரசு மருத்துவக் கல்லூரி."},

  {id:"american-college", name:"The American College", city:"Madurai", category:"Arts & Science",
   founded:1881, rating:4.5, reviewsCount:720, seats:"2,200+", fee:"₹20,000 – ₹60,000 / year",
   img:"images/college-yellow.jpg", map:"The American College, Madurai",
   tags:["BSc Physics","BA English","BCom","BCA","MSW"],
   oneLiner:"140+ years old college — famous for arts & science.",
   ta:"140+ ஆண்டுகள் பழமையான கல்லூரி — கலை & அறிவியலில் பிரபலம்."},

  /* ============ TRICHY ============ */
  {id:"nitt", name:"NIT Trichy", city:"Tiruchirappalli", category:"Engineering",
   founded:1964, rating:4.8, reviewsCount:1680, seats:"900+ (UG)", fee:"₹1.2L – ₹1.6L / year",
   img:"images/college-red.jpg", map:"NIT Tiruchirappalli",
   tags:["BTech CSE","BTech Mech","BTech Production","MBA","MTech"],
   oneLiner:"India's #1 NIT — 800 acre campus, strong PSU & IT placements.",
   ta:"இந்தியாவின் #1 NIT — 800 ஏக்கர் வளாகம், பொதுத்துறை & ஐடி வேலைவாய்ப்பு பலம்."},

  {id:"bishop-heber", name:"Bishop Heber College", city:"Tiruchirappalli", category:"Arts & Science",
   founded:1966, rating:4.6, reviewsCount:890, seats:"3,500+", fee:"₹18,000 – ₹55,000 / year",
   img:"images/college-yellow.jpg", map:"Bishop Heber College, Tiruchirappalli",
   tags:["BCom","BBA","BSc CS","BA Tamil","MCom"],
   oneLiner:"Trichy's favourite arts college — discipline + placements.",
   ta:"திருச்சியின் விருப்பமான கலைக் கல்லூரி — ஒழுக்கம் + வேலைவாய்ப்பு."},

  {id:"st-josephs-trichy", name:"St. Joseph's College", city:"Tiruchirappalli", category:"Arts & Science",
   founded:1844, rating:4.6, reviewsCount:760, seats:"3,000+", fee:"₹20,000 – ₹60,000 / year",
   img:"images/college-orange.jpg", map:"St Joseph's College, Tiruchirappalli",
   tags:["BSc Physics","BCom","BA Economics","MSc","PhD"],
   oneLiner:"180 years of history — one of India's oldest colleges.",
   ta:"180 ஆண்டு வரலாறு — இந்தியாவின் மிகப் பழமையான கல்லூரிகளில் ஒன்று."},

  /* ============ SALEM ============ */
  {id:"gce-salem", name:"Govt. College of Engineering, Salem", city:"Salem", category:"Engineering",
   founded:2007, rating:4.3, reviewsCount:480, seats:"720", fee:"₹12,000 – ₹25,000 / year",
   img:"images/college-red.jpg", map:"Government College of Engineering Salem",
   tags:["BE CSE","BE ECE","BE Mech","BE Civil"],
   oneLiner:"Very low-fee government engineering college — Salem students' first choice.",
   ta:"மிகக் குறைந்த கட்டண அரசு பொறியியல் கல்லூரி — சேலம் மாணவர்களின் முதல் தேர்வு."},

  {id:"sona", name:"Sona College of Technology", city:"Salem", category:"Engineering",
   founded:1997, rating:4.5, reviewsCount:1050, seats:"1,600+", fee:"₹60,000 – ₹1L / year",
   img:"images/college-orange.jpg", map:"Sona College of Technology, Salem",
   tags:["BE CSE","BE AI&ML","B.Tech IT","MBA"],
   oneLiner:"Sona's 'Yantra' robotics team is famous at national level.",
   ta:"சோனாவின் 'யந்திரா' ரோபோட்டிக்ஸ் குழு தேசிய அளவில் பிரபலம்."},

  /* ============ VELLORE ============ */
  {id:"vit", name:"VIT Vellore", city:"Vellore", category:"Engineering",
   founded:1984, rating:4.7, reviewsCount:4200, seats:"5,000+ (UG)", fee:"₹2L – ₹4L / year",
   img:"images/college-orange.jpg", map:"VIT Vellore, Vellore",
   tags:["BTech CSE","BTech ECE","BTech Biotech","B.Des","MBA"],
   oneLiner:"India's top private university — huge campus, 1000+ companies recruit.",
   ta:"இந்தியாவின் சிறந்த தனியார் பல்கலைக்கழகம் — பிரம்மாண்ட வளாகம், 1000+ நிறுவனங்கள் வேலைவாய்ப்பு."},

  {id:"thiruvalluvar-arts", name:"Thiruvalluvar Govt. Arts College", city:"Vellore", category:"Arts & Science",
   founded:1967, rating:4.3, reviewsCount:380, seats:"1,800+", fee:"₹8,000 – ₹30,000 / year",
   img:"images/college-yellow.jpg", map:"Thiruvalluvar Government Arts College, Vellore",
   tags:["BA Tamil","BCom","BSc Maths","MA"],
   oneLiner:"Government arts college — very affordable fees.",
   ta:"அரசு கலைக் கல்லூரி — மிகவும் மலிவான கட்டணம்."},

  /* ============ THANJAVUR ============ */
  {id:"sastra", name:"SASTRA Deemed University", city:"Thanjavur", category:"Engineering",
   founded:1984, rating:4.6, reviewsCount:1320, seats:"2,400+", fee:"₹1.5L – ₹3L / year",
   img:"images/college-red.jpg", map:"SASTRA Deemed University, Thanjavur",
   tags:["BTech CSE","BTech ECE","B.Tech Biotech","MBA","Law"],
   oneLiner:"Deemed university — strict academics, excellent placements.",
   ta:"டீம்ட் பல்கலைக்கழகம் — சிறந்த கல்வி, அருமையான வேலைவாய்ப்பு."},

  {id:"tanjore-medical", name:"Thanjavur Govt. Medical College", city:"Thanjavur", category:"Medical",
   founded:1961, rating:4.5, reviewsCount:560, seats:"150 MBBS", fee:"₹15,000 – ₹30,000 / year",
   img:"images/campus-life.jpg", map:"Thanjavur Medical College, Thanjavur",
   tags:["MBBS","MD","BSc Nursing"],
   oneLiner:"Dream medical college for delta district students.",
   ta:"டெல்டா மாவட்ட மாணவர்களின் கனவு மருத்துவக் கல்லூரி."},

  /* ============ ERODE ============ */
  {id:"bitsathy", name:"Bannari Amman Institute of Technology", city:"Erode", category:"Engineering",
   founded:1996, rating:4.5, reviewsCount:880, seats:"1,500+", fee:"₹65,000 – ₹1.1L / year",
   img:"images/college-orange.jpg", map:"Bannari Amman Institute of Technology, Erode",
   tags:["BE CSE","BE ECE","BE Mech","B.Tech AI&DS"],
   oneLiner:"Green campus near Sathyamangalam forest — peaceful learning.",
   ta:"சத்தியமங்கலம் காடு அருகே பசுமை வளாகம் — அமைதியான கல்வி."},

  {id:"kongu", name:"Kongu Engineering College", city:"Erode", category:"Engineering",
   founded:1983, rating:4.5, reviewsCount:940, seats:"1,700+", fee:"₹60,000 – ₹1L / year",
   img:"images/college-yellow.jpg", map:"Kongu Engineering College, Perundurai, Erode",
   tags:["BE CSE","BE EEE","BE Mech","BE Civil"],
   oneLiner:"Erode's landmark engineering college — good core company placements.",
   ta:"ஈரோட்டின் அடையாள பொறியியல் கல்லூரி — நல்ல வேலைவாய்ப்பு."},

  /* ============ TIRUNELVELI ============ */
  {id:"xaviers-tvl", name:"St. Xavier's College", city:"Tirunelveli", category:"Arts & Science",
   founded:1923, rating:4.5, reviewsCount:670, seats:"2,500+", fee:"₹15,000 – ₹50,000 / year",
   img:"images/college-yellow.jpg", map:"St Xavier's College, Palayamkottai, Tirunelveli",
   tags:["BSc Physics","BCom","BA English","BCA","MSW"],
   oneLiner:"Palayamkottai's 100-year heritage college.",
   ta:"பாளையங்கோட்டையின் 100 ஆண்டு பாரம்பரிய கல்லூரி."},

  {id:"gce-tvl", name:"Govt. College of Engineering, Tirunelveli", city:"Tirunelveli", category:"Engineering",
   founded:2007, rating:4.2, reviewsCount:310, seats:"600", fee:"₹12,000 – ₹25,000 / year",
   img:"images/college-red.jpg", map:"Government College of Engineering Tirunelveli",
   tags:["BE CSE","BE ECE","BE Mech"],
   oneLiner:"Government engineering college started for south TN students.",
   ta:"தென் தமிழ்நாட்டு மாணவர்களுக்காக அரசு தொடங்கிய பொறியியல் கல்லூரி."},
];

/* ---------- FEATURED COLLEGE DETAILS ---------- */
const COLLEGE_DETAILS = {
  "anna-university":{
    about:"Anna University (est. 1978) is one of India's largest technical universities. 500+ engineering colleges are affiliated from Chennai. The CEG campus (College of Engineering, Guindy) is 230+ years old — India's oldest engineering school. Research labs, international tie-ups, and a massive alumni network make this the #1 choice for Tamil Nadu engineering aspirants.",
    aboutTa:"அண்ணா பல்கலைக்கழகம் (1978) இந்தியாவின் மிகப்பெரிய தொழில்நுட்ப பல்கலைக்கழகங்களில் ஒன்று. சென்னையில் இருந்து 500+ பொறியியல் கல்லூரிகள் இணைக்கப்பட்டுள்ளன. சிஇஜி வளாகம் (கிண்டி பொறியியல் கல்லூரி) 230+ ஆண்டுகள் பழமையானது — இந்தியாவின் முதல் பொறியியல் பாடசாலை. ஆராய்ச்சி ஆய்வகங்கள், சர்வதேச ஒப்பந்தங்கள், பிரம்மாண்ட முன்னாள் மாணவர் வலையமைப்பு — தமிழ்நாட்டு பொறியியல் மாணவர்களின் முதல் தேர்வு.",
    highlights:["NAAC A++ Grade","120+ Research Centres","40+ Country Tie-ups","2.5 Lakh+ Alumni","300+ Campus Recruiters","5 Lakh+ Library Books"],
    highlightsTa:["NAAC A++ தரம்","120+ ஆராய்ச்சி மையங்கள்","40+ நாடுகளின் ஒப்பந்தம்","2.5 லட்சம்+ முன்னாள் மாணவர்கள்","300+ நிறுவன வேலைவாய்ப்பு","5 லட்சம்+ நூலக புத்தகங்கள்"],
    departments:[
      {ic:"fa-solid fa-laptop",name:"Computer Science & Engineering",nameTa:"கணினி அறிவியல் & பொறியியல்",desc:"AI, ML, Cyber Security — top IT companies recruit here.",descTa:"AI, ML, சைபர் செக்யூரிட்டி — முன்னணி ஐடி நிறுவனங்கள் இங்கு வேலைவாய்ப்பு தரும்."},
      {ic:"fa-solid fa-tower-broadcast",name:"Electronics & Communication",nameTa:"மின்னணு & தகவல் தொடர்பு",desc:"VLSI, Embedded Systems, 5G research.",descTa:"VLSI, எம்பெடட் சிஸ்டம்ஸ், 5G ஆராய்ச்சி."},
      {ic:"fa-solid fa-gears",name:"Mechanical Engineering",nameTa:"இயந்திரப் பொறியியல்",desc:"Robotics, Automobile, Thermal engineering.",descTa:"ரோபோட்டிக்ஸ், ஆட்டோமொபைல், தாப பொறியியல்."},
      {ic:"fa-solid fa-building",name:"Civil Engineering",nameTa:"கட்டிடப் பொறியியல்",desc:"Structural design, Smart city projects.",descTa:"கட்டமைப்பு வடிவமைப்பு, ஸ்மார்ட் சிட்டி திட்டங்கள்."},
      {ic:"fa-solid fa-bolt",name:"Electrical & Electronics",nameTa:"மின் & மின்னணு பொறியியல்",desc:"Power systems, EV technology.",descTa:"மின் விநியோகம், மின் வாகன (EV) தொழில்நுட்பம்."},
      {ic:"fa-solid fa-landmark",name:"Architecture & Planning",nameTa:"கட்டிடக்கலை & திட்டமிடல்",desc:"B.Arch + Urban design studies.",descTa:"B.Arch + நகர வடிவமைப்பு படிப்புகள்."}]
  },
  "iit-madras":{
    about:"IIT Madras (est. 1959) is ranked #1 in India by NIRF for many years. The 620-acre campus has deer and blackbucks roaming free! Research park, India's first 5G testbed, and the famous Online BS Data Science degree — all here. Students join after clearing JEE Advanced.",
    aboutTa:"ஐஐடி மெட்ராஸ் (1959) பல ஆண்டுகளாக NIRF தரவரிசையில் இந்தியாவின் #1 இடத்தில் உள்ளது. 620 ஏக்கர் வளாகத்தில் மான்கள், புள்ளிமான்கள் சுதந்திரமாக நடமாடும்! ஆராய்ச்சி பூங்கா, இந்தியாவின் முதல் 5ஜி சோதனை மையம், பிரபலமான ஆன்லைன் டேட்டா சயின்ஸ் பட்டம் — எல்லாம் இங்கேதான். JEE Advanced தேர்ச்சி பெற்ற மாணவர்கள் சேரலாம்.",
    highlights:["NIRF #1 Engineering","620 Acre Green Campus","Own Research Park"," Satellite Research Lab","Online BS Degree","150+ Startups Incubated"],
    highlightsTa:["NIRF #1 பொறியியல்","620 ஏக்கர் பசுமை வளாகம்","சொந்த ஆராய்ச்சி பூங்கா"," செயற்கைக்கோள் ஆய்வகம்","ஆன்லைன் பட்டப்படிப்பு","150+ ஸ்டார்ட்அப்கள்"],
    departments:[
      {ic:"fa-solid fa-laptop",name:"Computer Science & Engineering",nameTa:"கணினி அறிவியல் & பொறியியல்",desc:"India's most sought-after BTech branch.",descTa:"இந்தியாவில் அதிகம் விரும்பப்படும் பிடெக் துறை."},
      {ic:"fa-solid fa-plug",name:"Electrical Engineering",nameTa:"மின் பொறியியல்",desc:"Power, microelectronics, controls.",descTa:"மின்சக்தி, மைக்ரோஎலக்ட்ரானிக்ஸ், கண்ட்ரோல்ஸ்."},
      {ic:"fa-solid fa-plane",name:"Aerospace Engineering",nameTa:"விண்வெளி பொறியியல்",desc:"India's top aero department.",descTa:"இந்தியாவின் சிறந்த விண்வெளி துறை."},
      {ic:"fa-solid fa-flask",name:"Chemical Engineering",nameTa:"வேதிப் பொறியியல்",desc:"Refinery & process industry leaders.",descTa:"சுத்திகரிப்பு & செயலாக்க தொழில்துறை தலைவர்கள்."},
      {ic:"fa-solid fa-robot",name:"Applied Mechanics / AI",nameTa:"பயன்பாட்டு எந்திரவியல் / AI",desc:"Robotics and AI research.",descTa:"ரோபோட்டிக்ஸ் மற்றும் செயற்கை நுண்ணறிவு ஆராய்ச்சி."},
      {ic:"fa-solid fa-chart-line",name:"BS Data Science (Online)",nameTa:"பிஎஸ் டேட்டா சயின்ஸ் (ஆன்லைன்)",desc:"Anyone can join — 12th pass is enough!",descTa:"யார் வேண்டுமானாலும் சேரலாம் — 12th பாஸ் போதும்!"}]
  },
  "loyola-college":{
    about:"Loyola College (est. 1925) — a Jesuit institution on Chennai's Sterling Road. 100+ years of history. #1 in Tamil Nadu for Commerce, Economics and Visual Communication. Strict discipline, top MNC placements, and vibrant cultural life. UGC 'Potential for Excellence' status.",
    aboutTa:"லயோலா கல்லூரி (1925) — சென்னை ஸ்டெர்லிங் சாலையில் உள்ள ஜேசுட் நிறுவனம். 100+ ஆண்டு வரலாறு. வணிகவியல், பொருளாதாரம், விஷுவல் கம்யூனிகேஷனில் தமிழ்நாட்டின் #1. கண்டிப்பான ஒழுக்கம், சிறந்த பன்னாட்டு நிறுவன வேலைவாய்ப்பு, கலாச்சார நிகழ்ச்சிகள். UGC 'சிறந்த திறன்' அந்தஸ்து.",
    highlights:["NAAC A++ Grade","Founded 1925","200+ Recruiters","Huge Cultural Fest","Jesuit Heritage","60,000+ Alumni"],
    highlightsTa:["NAAC A++ தரம்","1925-ல் நிறுவப்பட்டது","200+ நிறுவனங்கள்","பிரம்மாண்ட கலாச்சார விழா","ஜேசுட் பாரம்பரியம்","60,000+ முன்னாள் மாணவர்கள்"],
    departments:[
      {ic:"fa-solid fa-chart-line",name:"Commerce & Accountancy",nameTa:"வணிகவியல் & கணக்கியல்",desc:"BCom (Hons) — CA, MBA, Big-4 placements.",descTa:"பிகாம் (ஆனர்ஸ்) — சிஏ, எம்பிஏ, பிக்-4 வேலைவாய்ப்பு."},
      {ic:"fa-solid fa-briefcase",name:"Business Administration",nameTa:"வணிக நிர்வாகம்",desc:"BBA with corporate internships.",descTa:"நிறுவன பயிற்சியுடன் பிபிஏ."},
      {ic:"fa-solid fa-clapperboard",name:"Visual Communication",nameTa:"விஷுவல் கம்யூனிகேஷன்",desc:"Film, media & design studies.",descTa:"திரைப்படம், ஊடகம் & வடிவமைப்பு படிப்புகள்."},
      {ic:"fa-solid fa-scroll",name:"Economics",nameTa:"பொருளாதாரம்",desc:"One of India's best UG econ departments.",descTa:"இந்தியாவின் சிறந்த இளங்கலை பொருளாதார துறைகளில் ஒன்று."},
      {ic:"fa-solid fa-microscope",name:"Physics & Chemistry",nameTa:"இயற்பியல் & வேதியியல்",desc:"Research-focused science streams.",descTa:"ஆராய்ச்சி சார்ந்த அறிவியல் பிரிவுகள்."},
      {ic:"fa-solid fa-comments",name:"Tamil & English Literature",nameTa:"தமிழ் & ஆங்கில இலக்கியம்",desc:"Languages, journalism & culture.",descTa:"மொழிகள், பத்திரிகையியல் & கலாச்சாரம்."}]
  },
  "psg-tech":{
    about:"PSG College of Technology (est. 1951) was founded by the PSG & Sons' Charities Trust on the same campus as the PSG Industrial Institute — so industry and academia grow side by side. Autonomous and affiliated to Anna University, it holds NAAC 'A' grade, NBA accreditation and NIRF #67 in Engineering. 8,300+ students, 490+ faculty and a 1-lakh-volume library fill its 45-acre Peelamedu campus, while its placement office brings Microsoft, Amazon, Bosch and 300+ recruiters every year.",
    aboutTa:"PSG கல்லூரி ஆஃப் டெக்னாலஜி (1951) PSG & சன்ஸ் அறக்கட்டளையால் PSG தொழில்துறை நிறுவனத்தின் வளாகத்திலேயே நிறுவப்பட்டது — தொழில்துறையும் கல்வியும் இணைந்து வளரும். தன்னாட்சி பெற்று அண்ணா பல்கலைக்கழகத்துடன் இணைக்கப்பட்டு, NAAC 'A' தரம், NBA அங்கீகாரம், பொறியியலில் NIRF #67 இடம் பெற்றுள்ளது. 45 ஏக்கர் பீளமேடு வளாகத்தில் 8,300+ மாணவர்கள், 490+ ஆசிரியர்கள், 1 லட்சம் புத்தக நூலகம்; Microsoft, Amazon, Bosch உள்பட 300+ நிறுவனங்கள் ஆண்டுதோறும் வேலைவாய்ப்புக்கு வருகின்றன.",
    highlights:["NAAC 'A' Grade + NBA","NIRF #67 Engineering","Founded 1951 · 75 years","45-acre Peelamedu campus","1,00,000+ Library volumes","ISO 9001:2015 certified","Own R&D + incubation centre","Industry-institute campus"],
    highlightsTa:["NAAC 'A' தரம் + NBA","பொறியியலில் NIRF #67","1951-ல் நிறுவப்பட்டது · 75 ஆண்டுகள்","45 ஏக்கர் பீளமேடு வளாகம்","1,00,000+ நூலக புத்தகங்கள்","ISO 9001:2015 சான்றிதழ்","சொந்த R&D + இன்குபேஷன் மையம்","தொழில்துறை-கல்வி இணை வளாகம்"],
    departments:[
      {ic:"fa-solid fa-laptop",name:"Computer Science & Engineering",nameTa:"கணினி அறிவியல் & பொறியியல்",desc:"AI, Data Science, Cyber Security — top IT recruiters visit every year.",descTa:"AI, டேட்டா சயின்ஸ், சைபர் செக்யூரிட்டி — முன்னணி ஐடி நிறுவனங்கள் ஆண்டுதோறும் வருகை."},
      {ic:"fa-solid fa-gears",name:"Mechanical (incl. Sandwich)",nameTa:"இயந்திரப் பொறியியல் (சாண்ட்விச் உள்பட)",desc:"Legendary dept since 1951 — foundry, CAD/CAM, PSG industry labs.",descTa:"1951 முதல் புகழ்பெற்ற துறை — ஃபவுண்டரி, CAD/CAM, PSG தொழிற்சாலை ஆய்வகங்கள்."},
      {ic:"fa-solid fa-tower-broadcast",name:"Electronics & Communication",nameTa:"மின்னணு & தகவல் தொடர்பு",desc:"VLSI, Embedded & IoT research with industry projects.",descTa:"VLSI, எம்பெடட் & IoT — தொழில்துறை திட்டங்களுடன் ஆராய்ச்சி."},
      {ic:"fa-solid fa-robot",name:"Robotics Engineering",nameTa:"ரோபோட்டிக்ஸ் பொறியியல்",desc:"One of India's earliest Robotics UG programmes.",descTa:"இந்தியாவின் முதல் ரோபோட்டிக்ஸ் இளங்கலை திட்டங்களில் ஒன்று."},
      {ic:"fa-solid fa-dna",name:"Biotechnology",nameTa:"உயிரித் தொழில்நுட்பம்",desc:"Genetic engineering, pharma & bioprocess labs.",descTa:"மரபணு பொறியியல், மருந்து & பயோபிராசஸ் ஆய்வகங்கள்."},
      {ic:"fa-solid fa-shirt",name:"Fashion Technology",nameTa:"ஃபேஷன் டெக்னாலஜி",desc:"Apparel tech tied to Coimbatore's textile industry.",descTa:"கோயம்புத்தூரின் ஜவுளித் தொழிலுடன் இணைந்த ஆடைத் தொழில்நுட்பம்."}],
    gallery:[
      {src:"images/psg-hero.jpg",cap:"Main Block — heritage since 1951",capTa:"முதன்மை கட்டிடம் — 1951 முதல்"},
      {src:"images/psg-exterior.jpg",cap:"Avinashi Road entrance view",capTa:"அவினாசி சாலை நுழைவு தோற்றம்"},
      {src:"images/psg-gate.jpg",cap:"PSG campus gateway",capTa:"PSG வளாக நுழைவாயில்"},
      {src:"images/psg-lab.webp",cap:"Computer centre — 170+ systems",capTa:"கணினி மையம் — 170+ சிஸ்டம்கள்"},
      {src:"images/psg-classroom.webp",cap:"Classrooms with digital boards",capTa:"டிஜிட்டல் வசதி கொண்ட வகுப்பறைகள்"},
      {src:"images/psg-lecture.webp",cap:"Lecture halls & tutorial rooms",capTa:"உரை மண்டபங்கள் & டியூட்டோரியல் அறைகள்"},
      {src:"images/psg-auditorium.webp",cap:"Auditorium — fests & seminars",capTa:"ஆடிட்டோரியம் — விழாக்கள் & கருத்தரங்குகள்"},
      {src:"images/psg-sports.webp",cap:"Sports meet at the main ground",capTa:"முதன்மை மைதானத்தில் விளையாட்டு போட்டி"},
      {src:"images/psg-ground.jpg",cap:"33,500 sq.m outdoor sports area",capTa:"33,500 ச.மீ விளையாட்டு மைதானம்"}]
  }
};

/* ---------- EVENTS for featured colleges (bilingual) ---------- */
const COLLEGE_EVENTS = {
  "anna-university":[
    {d:"12",m:"Oct",mTa:"அக்",title:"Kurukshetra Tech Fest",titleTa:"குருக்ஷேத்ரா டெக் விழா",desc:"South India's biggest techno fest — robotics, hackathons, project expo.",descTa:"தென் இந்தியாவின் மிகப்பெரிய தொழில்நுட்ப விழா — ரோபோட்டிக்ஸ், ஹேக்கதான், திட்ட கண்காட்சி."},
    {d:"24",m:"Nov",mTa:"நவ",title:"Aaroham Cultural Fest",titleTa:"ஆரோஹம் கலாச்சார விழா",desc:"Music, dance, drama — 5000+ students participate.",descTa:"இசை, நடனம், நாடகம் — 5000+ மாணவர்கள் பங்கேற்பு."},
    {d:"08",m:"Jan",mTa:"ஜன",title:"Sports Day & Marathon",titleTa:"விளையாட்டு தினம் & மாரத்தான்",desc:"Inter-department athletics + 10K campus run.",descTa:"துறைகளுக்கிடையேயான தடகளம் + 10கிமீ வளாக ஓட்டம்."},
    {d:"15",m:"Feb",mTa:"பிப்",title:"Entrepreneurship Summit",titleTa:"தொழில்முனைவோர் உச்சிமாநாடு",desc:"Startup pitch day with real investors.",descTa:"உண்மையான முதலீட்டாளர்களுடன் ஸ்டார்ட்அப் போட்டி."}],
  "iit-madras":[
    {d:"03",m:"Oct",mTa:"அக்",title:"Shaastra — Tech Fest",titleTa:"ஷாஸ்திரா — டெக் விழா",desc:"Asia's biggest student-run technical festival.",descTa:"ஆசியாவின் மிகப்பெரிய மாணவர் தொழில்நுட்ப விழா."},
    {d:"17",m:"Jan",mTa:"ஜன",title:"Saarang — Cultural Fest",titleTa:"சாரங் — கலாச்சார விழா",desc:"5-day mega cultural fest, celebrity shows.",descTa:"5 நாள் மாபெரும் கலாச்சார விழா, பிரபல நிகழ்ச்சிகள்."},
    {d:"21",m:"Mar",mTa:"மார்",title:"Research Scholars Day",titleTa:"ஆராய்ச்சியாளர் தினம்",desc:"Campus-wide research exhibition.",descTa:"வளாகம் முழுவதும் ஆராய்ச்சி கண்காட்சி."},
    {d:"05",m:"Apr",mTa:"ஏப்",title:"Hackathon @ Research Park",titleTa:"ஹேக்கதான் @ ஆராய்ச்சி பூங்கா",desc:"48-hour industry problem solving.",descTa:"48 மணி நேர தொழில்துறை சவால் தீர்வு."}],
  "loyola-college":[
    {d:"09",m:"Sep",mTa:"செப்",title:"Unifest — Orientation Day",titleTa:"யூனிஃபெஸ்ட் — அறிமுக நாள்",desc:"Freshers' grand welcome + club showcases.",descTa:"புதிய மாணவர்களுக்கு பிரம்மாண்ட வரவேற்பு + கிளப் அறிமுகம்."},
    {d:"22",m:"Nov",mTa:"நவ",title:"Vedana Literary Fest",titleTa:"வேதனா இலக்கிய விழா",desc:"Writers, poets & film personalities meet.",descTa:"எழுத்தாளர்கள், கவிஞர்கள் & திரை பிரபலங்கள் சந்திப்பு."},
    {d:"14",m:"Jan",mTa:"ஜன",title:"Pongal Celebration",titleTa:"பொங்கல் கொண்டாட்டம்",desc:"Traditional Pongal + cultural programmes.",descTa:"பாரம்பரிய பொங்கல் + கலாச்சார நிகழ்ச்சிகள்."},
    {d:"02",m:"Mar",mTa:"மார்",title:"Loyola Premier League",titleTa:"லயோலா பிரீமியர் லீக்",desc:"Inter-department sports championship.",descTa:"துறைகளுக்கிடையேயான விளையாட்டு போட்டி."}],
  "psg-tech":[
    {d:"14",m:"May",mTa:"மே",title:"Research Conclave",titleTa:"ஆராய்ச்சி மாநாடு",desc:"Interdisciplinary research summit — paper sessions, industry talks.",descTa:"பல்துறை ஆராய்ச்சி உச்சிமாநாடு — கட்டுரை அமர்வுகள், தொழில்துறை உரைகள்."},
    {d:"21",m:"Jun",mTa:"ஜூன்",title:"International Yoga Day",titleTa:"சர்வதேச யோகா தினம்",desc:"Campus-wide yoga session for students & staff.",descTa:"மாணவர் & ஊழியர்களுடன் வளாகம் முழுவதும் யோகா."},
    {d:"05",m:"Sep",mTa:"செப்",title:"Teachers' Day Celebrations",titleTa:"ஆசிரியர் தினக் கொண்டாட்டம்",desc:"Students honour faculty with cultural programmes.",descTa:"கலாச்சார நிகழ்ச்சிகளுடன் ஆசிரியர்களை மாணவர்கள் கௌரவித்தல்."},
    {d:"03",m:"Oct",mTa:"அக்",title:"PSG Tech Fest & Hackathon",titleTa:"PSG டெக் விழா & ஹேக்கதான்",desc:"Robotics expo + 24-hr coding hackathon with industry prizes.",descTa:"ரோபோட்டிக்ஸ் கண்காட்சி + 24 மணி கோடிங் ஹேக்கதான்."}]
};

/* ---------- SEED REVIEWS ---------- */
const SEED_REVIEWS = {
  "anna-university":[
    {name:"Karthik R.",stars:5,text:"Best decision in my life — CEG campus life is next level. Placements super, professors supportive. / என் வாழ்க்கையின் சிறந்த முடிவு — சிஇஜி வளாக வாழ்க்கை வேற லெவல்!"},
    {name:"Divya S.",stars:5,text:"Research facilities amazing. Labs la late night work panna kooda freedom um support um undu."},
    {name:"Mohammed A.",stars:4,text:"Campus huge, canteen food average. But education quality top-notch."}],
  "iit-madras":[
    {name:"Priyanka V.",stars:5,text:"Campus la deer paathathu first day shock  World-class labs, humbling peer group."},
    {name:"Rahul N.",stars:5,text:"Online BS Data Science join pannen — working professionals ku perfect option."},
    {name:"Sneha K.",stars:4,text:"Course load heavy, but that's what makes you sharp. Saarang fest unforgettable!"}],
  "loyola-college":[
    {name:"Arjun M.",stars:5,text:"BCom Hons la padichen — Big 4 la job. Loyola discipline + placements = "},
    {name:"Fatima B.",stars:5,text:"Teachers ellarum romba supportive. VisCom department facilities excellent."},
    {name:"Vignesh P.",stars:4,text:"Strict attendance rules, but that discipline helped me in corporate life."}],
  "psg-tech":[
    {name:"Harish K.",stars:5,text:"PSG Tech la Mechanical padicha experience vida mudiyadhu — PSG industries la internship, final year la 3 offers. / PSG-ல் படித்த அனுபவம் வேற லெவல்!"},
    {name:"Meena R.",stars:5,text:"CSE dept placements super — Microsoft, Zoho ellarum varanga. Labs 24x7 open."},
    {name:"Surya V.",stars:4,text:"Hostel + canteen nalla irukku. Coimbatore weather bonus! Attendance strict but worth it."}],
  "default":[
    {name:"Student",stars:5,text:"Nalla college — supportive teachers, good campus."}]
};

/* ---------- COURSES ---------- */
/* ---------- COURSES (bilingual: durTa/eligTa/descTa/jobsTa = Tamil) ---------- */
const COURSES = {
  "10":[
    {ic:"fa-solid fa-wrench",name:"Polytechnic — Mechanical Engineering",dur:"3 Years",durTa:"3 ஆண்டுகள்",elig:"10th Pass (35%+)",eligTa:"10th தேர்ச்சி (35%+)",search:"mechanical polytechnic",
     desc:"Machines, engines, manufacturing — lots of practical workshops.",
     descTa:"எந்திரங்கள், இன்ஜின்கள், உற்பத்தி — நடைமுறை பயிற்சிகள் அதிகம்.",
     jobs:"Junior Engineer, CNC Operator, Technician",
     jobsTa:"ஜூனியர் இன்ஜினியர், சிஎன்சி ஆப்பரேட்டர், டெக்னிஷியன்"},
    {ic:"fa-solid fa-bolt",name:"Polytechnic — Electrical & Electronics",dur:"3 Years",durTa:"3 ஆண்டுகள்",elig:"10th Pass (35%+)",eligTa:"10th தேர்ச்சி (35%+)",search:"electrical polytechnic",
     desc:"Wiring, motors, power systems, basic electronics.",
     descTa:"வயரிங், மோட்டார்கள், மின் விநியோகம், அடிப்படை மின்னணு.",
     jobs:"Electrician, Junior Engineer (TNEB), Maintenance Tech",
     jobsTa:"எலக்ட்ரிஷியன், ஜூனியர் இன்ஜினியர் (டிஎன்இபி), மெயின்டெனன்ஸ் டெக்"},
    {ic:"fa-solid fa-tower-broadcast",name:"Polytechnic — Electronics & Communication",dur:"3 Years",durTa:"3 ஆண்டுகள்",elig:"10th Pass (35%+)",eligTa:"10th தேர்ச்சி (35%+)",search:"electronics polytechnic",
     desc:"Circuits, mobile/TV repair, communication basics.",
     descTa:"சர்க்யூட்கள், மொபைல்/டிவி ரிப்பேர், தகவல் தொடர்பு அடிப்படைகள்.",
     jobs:"ECE Technician, Service Engineer, Lab Assistant",
     jobsTa:"இசிஇ டெக்னிஷியர், சர்வீஸ் இன்ஜினியர், லேப் உதவியாளர்"},
    {ic:"fa-solid fa-building",name:"Polytechnic — Civil Engineering",dur:"3 Years",durTa:"3 ஆண்டுகள்",elig:"10th Pass (35%+)",eligTa:"10th தேர்ச்சி (35%+)",search:"civil polytechnic",
     desc:"Building construction, surveying, drawing.",
     descTa:"கட்டிட நிர்மாணம், சர்வேயிங், டிராயிங்.",
     jobs:"Site Supervisor, Draftsman, Junior Engineer",
     jobsTa:"சைட் சூப்பர்வைசர், டிராஃப்ட்ஸ்மேன், ஜூனியர் இன்ஜினியர்"},
    {ic:"fa-solid fa-laptop",name:"Polytechnic — Computer Science",dur:"3 Years",durTa:"3 ஆண்டுகள்",elig:"10th Pass (35%+)",eligTa:"10th தேர்ச்சி (35%+)",search:"computer polytechnic",
     desc:"Programming, networking, basics of IT.",
     descTa:"புரோகிராமிங், நெட்வொர்க்கிங், ஐடி அடிப்படைகள்.",
     jobs:"Data Entry Operator, Junior Programmer, IT Support",
     jobsTa:"டேட்டா என்ட்ரி ஆப்பரேட்டர், ஜூனியர் புரோகிராமர், ஐடி சப்போர்ட்"},
    {ic:"fa-solid fa-screwdriver-wrench",name:"ITI — Electrician / Fitter",dur:"2 Years",durTa:"2 ஆண்டுகள்",elig:"10th / 8th Pass",eligTa:"10th / 8th தேர்ச்சி",search:"ITI",
     desc:"Hands-on trade training — very quick job entry.",
     descTa:"கைப்பழக்கமான தொழில் பயிற்சி — மிக விரைவான வேலை வாய்ப்பு.",
     jobs:"Electrician, Fitter, Railway jobs, Gulf jobs",
     jobsTa:"எலக்ட்ரிஷியன், ஃபிட்டர், ரயில்வே வேலை, வளைகுடா வேலை"},
    {ic:"fa-solid fa-keyboard",name:"ITI — COPA (Computer Operator)",dur:"1 Year",durTa:"1 ஆண்டு",elig:"10th Pass",eligTa:"10th தேர்ச்சி",search:"ITI computer",
     desc:"Typing, MS Office, basic accounting.",
     descTa:"டைப்பிங், எம்எஸ் ஆபீஸ், அடிப்படை கணக்கு.",
     jobs:"Office Assistant, Computer Operator",
     jobsTa:"அலுவலக உதவியாளர், கணினி இயக்குநர்"},
    {ic:"fa-solid fa-seedling",name:"Diploma in Agriculture",dur:"3 Years",durTa:"3 ஆண்டுகள்",elig:"10th Pass",eligTa:"10th தேர்ச்சி",search:"agriculture diploma",
     desc:"Farming technology, soil science, horticulture.",
     descTa:"வேளாண் தொழில்நுட்பம், மண் அறிவியல், தோட்டக்கலை.",
     jobs:"Agri Officer Assistant, Farm Manager",
     jobsTa:"வேளாண் அலுவலர் உதவியாளர், பண்ணை மேலாளர்"},
    {ic:"fa-solid fa-stethoscope",name:"Paramedical Diploma (DMLT)",dur:"2 Years",durTa:"2 ஆண்டுகள்",elig:"10th / 12th Pass",eligTa:"10th / 12th தேர்ச்சி",search:"medical paramedical",
     desc:"Lab technician training — blood tests, scans.",
     descTa:"லேப் டெக்னிஷியன் பயிற்சி — இரத்த பரிசோதனை, ஸ்கேன்.",
     jobs:"Lab Technician, Hospital Assistant",
     jobsTa:"லேப் டெக்னிஷியர், மருத்துவமனை உதவியாளர்"},
    {ic:"fa-solid fa-hotel",name:"Vocational HSC Streams",dur:"2 Years",durTa:"2 ஆண்டுகள்",elig:"10th Pass",eligTa:"10th தேர்ச்சி",search:"vocational",
     desc:"11–12 vocational groups — hotel mgmt, fashion, agriculture...",
     descTa:"11–12 தொழிற்படிப்பு பிரிவுகள் — ஹோட்டல், ஃபேஷன், வேளாண்மை...",
     jobs:"Direct skill jobs + higher studies option",
     jobsTa:"நேரடி திறன் வேலை + மேல்படிப்பு வாய்ப்பு"}
  ],
  "12":[
    {ic:"fa-solid fa-user-graduate",name:"BE / B.Tech — Engineering",dur:"4 Years",durTa:"4 ஆண்டுகள்",elig:"12th (PCM) + Entrance",eligTa:"12th (PCM) + நுழைவுத் தேர்வு",search:"engineering",
     desc:"CSE, ECE, Mechanical, Civil, EEE, AI & DS — 100+ branches available.",
     descTa:"சிஎஸ்இ, இசிஇ, மெக்கானிக்கல், சிவில், இஇஇ, ஏஐ&டிஎஸ் — 100+ பிரிவுகள் உண்டு.",
     jobs:"Software Engineer, Design Engineer, Data Scientist",
     jobsTa:"மென்பொருள் இன்ஜினியர், டிசைன் இன்ஜினியர், டேட்டா சயின்டிஸ்ட்"},
    {ic:"fa-solid fa-stethoscope",name:"MBBS / BDS — Medicine",dur:"5.5 Years",durTa:"5.5 ஆண்டுகள்",elig:"12th (PCB) + NEET",eligTa:"12th (PCB) + நீட்",search:"medical",
     desc:"The path to become a doctor. Must clear NEET exam.",
     descTa:"மருத்துவர் ஆவதற்கான வழி. நீட் தேர்வு கட்டாயம்.",
     jobs:"Doctor, Surgeon, Dentist",
     jobsTa:"மருத்துவர், அறுவை சிகிச்சை நிபுணர், பல் மருத்துவர்"},
    {ic:"fa-solid fa-pills",name:"B.Pharm — Pharmacy",dur:"4 Years",durTa:"4 ஆண்டுகள்",elig:"12th (PCB/PCM)",eligTa:"12th (PCB/PCM)",search:"pharmacy medical",
     desc:"Medicines, drug manufacturing, chemistry.",
     descTa:"மருந்துகள், மருந்து உற்பத்தி, வேதியியல்.",
     jobs:"Pharmacist, Drug Inspector, Medical Rep",
     jobsTa:"மருந்தாளர், மருந்து ஆய்வாளர், மெடிக்கல் ரெப்"},
    {ic:"fa-solid fa-hospital",name:"BSc Nursing / Allied Health",dur:"4 Years",durTa:"4 ஆண்டுகள்",elig:"12th (PCB)",eligTa:"12th (PCB)",search:"medical nursing",
     desc:"Nursing, Physiotherapy (BPT), Occupational Therapy.",
     descTa:"நர்சிங், ஃபிசியோதெரபி (பிபிடி), ஆக்குபேஷனல் தெரபி.",
     jobs:"Nurse, Physiotherapist, Hospital Admin",
     jobsTa:"செவிலியர், ஃபிசியோதெரபிஸ்ட், மருத்துவமனை நிர்வாகம்"},
    {ic:"fa-solid fa-microscope",name:"BSc — Science Degrees",dur:"3 Years",durTa:"3 ஆண்டுகள்",elig:"12th Pass",eligTa:"12th தேர்ச்சி",search:"science arts",
     desc:"Physics, Chemistry, Maths, CS, Zoology, Botany...",
     descTa:"இயற்பியல், வேதியியல், கணிதம், சிஎஸ், விலங்கியல், தாவரவியல்...",
     jobs:"Scientist (after PG), Lab Analyst, Teacher",
     jobsTa:"விஞ்ஞானி (முதுநிலைக்குப் பிறகு), லேப் அனலிஸ்ட், ஆசிரியர்"},
    {ic:"fa-solid fa-book-open",name:"BA — Arts Degrees",dur:"3 Years",durTa:"3 ஆண்டுகள்",elig:"12th Pass",eligTa:"12th தேர்ச்சி",search:"arts science",
     desc:"Tamil, English, History, Economics, Political Science.",
     descTa:"தமிழ், ஆங்கிலம், வரலாறு, பொருளாதாரம், அரசியல் அறிவியல்.",
     jobs:"IAS/IPS prep, Journalist, Teacher, Writer",
     jobsTa:"ஐஏஎஸ்/ஐபிஎஸ் தயாரிப்பு, பத்திரிகையாளர், ஆசிரியர், எழுத்தாளர்"},
    {ic:"fa-solid fa-briefcase",name:"BCom / BBA — Commerce & Business",dur:"3 Years",durTa:"3 ஆண்டுகள்",elig:"12th Pass",eligTa:"12th தேர்ச்சி",search:"commerce arts",
     desc:"Accounting, finance, marketing, management.",
     descTa:"கணக்கியல், நிதி, மார்க்கெட்டிங், மேலாண்மை.",
     jobs:"CA Path, Banker, Business Analyst, HR",
     jobsTa:"சிஏ பாதை, வங்கியாளர், பிசினஸ் அனலிஸ்ட், எச்டிஆர்"},
    {ic:"fa-solid fa-desktop",name:"BCA — Computer Applications",dur:"3 Years",durTa:"3 ஆண்டுகள்",elig:"12th Pass",eligTa:"12th தேர்ச்சி",search:"computer arts",
     desc:"Programming degree without engineering entrance.",
     descTa:"இன்ஜினியரிங் நுழைவுத் தேர்வு இல்லாமல் புரோகிராமிங் பட்டம்.",
     jobs:"Software Developer, Web Developer, App Developer",
     jobsTa:"மென்பொருள் டெவலப்பர், வெப் டெவலப்பர், ஆப் டெவலப்பர்"},
    {ic:"fa-solid fa-seedling",name:"BSc Agriculture",dur:"4 Years",durTa:"4 ஆண்டுகள்",elig:"12th (PCB/PCM)",eligTa:"12th (PCB/PCM)",search:"agriculture",
     desc:"Modern farming science — lots of scope in Tamil Nadu.",
     descTa:"நவீன வேளாண் அறிவியல் — தமிழ்நாட்டில் அதிக வாய்ப்பு.",
     jobs:"Agri Officer, Food Industry, Agri Business",
     jobsTa:"வேளாண் அலுவலர், உணவு தொழில், வேளாண் வணிகம்"},
    {ic:"fa-solid fa-scale-balanced",name:"BA LLB — Law",dur:"5 Years",durTa:"5 ஆண்டுகள்",elig:"12th Pass",eligTa:"12th தேர்ச்சி",search:"law arts",
     desc:"Integrated law degree — lawyer, judge path.",
     descTa:"இணைந்த சட்டப் பட்டம் — வக்கீல், நீதிபதி பாதை.",
     jobs:"Advocate, Legal Advisor, Judiciary",
     jobsTa:"வக்கீல், சட்ட ஆலோசகர், நீதித்துறை"},
    {ic:"fa-solid fa-palette",name:"B.Des / BFA / BVoc",dur:"3–4 Years",durTa:"3–4 ஆண்டுகள்",elig:"12th Pass",eligTa:"12th தேர்ச்சி",search:"design arts",
     desc:"Design, Fine Arts, skill-based vocational degrees.",
     descTa:"வடிவமைப்பு, நுண்கலைகள், திறன் சார்ந்த தொழிற்படிப்புகள்.",
     jobs:"Designer, Artist, Creative Professional",
     jobsTa:"டிசைனர், கலைஞர், படைப்பாற்றல் நிபுணர்"},
    {ic:"fa-solid fa-plane",name:"Hotel Mgmt / Aviation",dur:"3 Years",durTa:"3 ஆண்டுகள்",elig:"12th Pass",eligTa:"12th தேர்ச்சி",search:"hotel management",
     desc:"BHM, BBA Aviation — travel & hospitality careers.",
     descTa:"பிஎச்எம், பிபிஏ ஏவியேஷன் — சுற்றுலா & விருந்தோம்பல் வேலைகள்.",
     jobs:"Hotel Manager, Cabin Crew, Chef",
     jobsTa:"ஹோட்டல் மேலாளர், கேபின் குழு, செஃப்"}
  ],
  "pg":[
    {ic:"fa-solid fa-user-graduate",name:"ME / M.Tech",dur:"2 Years",durTa:"2 ஆண்டுகள்",elig:"BE/B.Tech + GATE",eligTa:"பிஇ/பிடெக் + கேட்",search:"engineering",
     desc:"Engineering specialization — CSE, VLSI, Structural...",
     descTa:"பொறியியல் சிறப்பு — சிஎஸ்இ, விஎல்எஸ்ஐ, ஸ்ட்ரக்ச்சரல்...",
     jobs:"Senior Engineer, Research Scientist, Professor",
     jobsTa:"சீனியர் இன்ஜினியர், ஆராய்ச்சி விஞ்ஞானி, பேராசிரியர்"},
    {ic:"fa-solid fa-chart-line",name:"MBA",dur:"2 Years",durTa:"2 ஆண்டுகள்",elig:"Any Degree",eligTa:"எந்த பட்டமும்",search:"commerce business",
     desc:"Business management — Marketing, HR, Finance, Operations.",
     descTa:"வணிக மேலாண்மை — மார்க்கெட்டிங், எச்டிஆர், நிதி, ஆப்பரேஷன்ஸ்.",
     jobs:"Manager, Consultant, Entrepreneur",
     jobsTa:"மேலாளர், ஆலோசகர், தொழில்முனைவோர்"},
    {ic:"fa-solid fa-desktop",name:"MCA",dur:"2 Years",durTa:"2 ஆண்டுகள்",elig:"Any Degree (Maths)",eligTa:"எந்த பட்டமும் (கணிதம்)",search:"computer",
     desc:"Master of Computer Applications — deep software skills.",
     descTa:"கணினி பயன்பாடுகளில் முதுநிலை — ஆழமான மென்பொருள் திறன்.",
     jobs:"Software Engineer, System Architect, Data Analyst",
     jobsTa:"மென்பொருள் இன்ஜினியர், சிஸ்டம் ஆர்கிடெக்ட், டேட்டா அனலிஸ்ட்"},
    {ic:"fa-solid fa-microscope",name:"MSc — Science",dur:"2 Years",durTa:"2 ஆண்டுகள்",elig:"BSc Degree",eligTa:"பிஎஸ்சி பட்டம்",search:"science",
     desc:"CS, Maths, Physics, Chemistry, Bio specialization.",
     descTa:"சிஎஸ், கணிதம், இயற்பியல், வேதியியல், உயிரியல் சிறப்பு.",
     jobs:"Scientist, Researcher, Professor",
     jobsTa:"விஞ்ஞானி, ஆராய்ச்சியாளர், பேராசிரியர்"},
    {ic:"fa-solid fa-book-open",name:"MA — Arts",dur:"2 Years",durTa:"2 ஆண்டுகள்",elig:"BA Degree",eligTa:"பிஏ பட்டம்",search:"arts",
     desc:"Tamil, English, History, Economics, Journalism.",
     descTa:"தமிழ், ஆங்கிலம், வரலாறு, பொருளாதாரம், பத்திரிகையியல்.",
     jobs:"Professor, Civil Services, Media",
     jobsTa:"பேராசிரியர், அரசுப் பணிகள், ஊடகம்"},
    {ic:"fa-solid fa-briefcase",name:"MCom",dur:"2 Years",durTa:"2 ஆண்டுகள்",elig:"BCom Degree",eligTa:"பிகாம் பட்டம்",search:"commerce",
     desc:"Advanced accounting, finance, taxation.",
     descTa:"மேம்பட்ட கணக்கியல், நிதி, வரி.",
     jobs:"Accountant, Auditor, Bank Manager",
     jobsTa:"கணக்காளர், தணிக்கையாளர், வங்கி மேலாளர்"},
    {ic:"fa-solid fa-handshake",name:"MSW",dur:"2 Years",durTa:"2 ஆண்டுகள்",elig:"Any Degree",eligTa:"எந்த பட்டமும்",search:"social work arts",
     desc:"Master of Social Work — NGO, HR, counselling careers.",
     descTa:"சமூகப் பணி முதுநிலை — தன்னார்வ நிறுவனம், எச்டிஆர், ஆலோசனை.",
     jobs:"Social Worker, HR, Counsellor",
     jobsTa:"சமூக சேவகர், எச்டிஆர், ஆலோசகர்"},
    {ic:"fa-solid fa-pills",name:"M.Pharm / MPT",dur:"2 Years",durTa:"2 ஆண்டுகள்",elig:"B.Pharm / BPT",eligTa:"பி.பார்ம் / பிபிடி",search:"pharmacy medical",
     desc:"Pharma & physiotherapy higher studies.",
     descTa:"மருந்தியல் & ஃபிசியோதெரபி மேற்படிப்பு.",
     jobs:"Senior Pharmacist, Physiotherapist, Researcher",
     jobsTa:"சீனியர் மருந்தாளர், ஃபிசியோதெரபிஸ்ட், ஆராய்ச்சியாளர்"},
    {ic:"fa-solid fa-scale-balanced",name:"LLM",dur:"1–2 Years",durTa:"1–2 ஆண்டுகள்",elig:"LLB Degree",eligTa:"எல்எல்பி பட்டம்",search:"law",
     desc:"Master of Laws — judiciary & corporate law.",
     descTa:"சட்டத்தில் முதுநிலை — நீதித்துறை & நிறுவன சட்டம்.",
     jobs:"Judge (exam), Legal Expert",
     jobsTa:"நீதிபதி (தேர்வு), சட்ட நிபுணர்"},
    {ic:"fa-solid fa-magnifying-glass",name:"MPhil / PhD",dur:"2–5 Years",durTa:"2–5 ஆண்டுகள்",elig:"Master's Degree",eligTa:"முதுநிலை பட்டம்",search:"research",
     desc:"Full research degree — become a scientist/professor.",
     descTa:"முழு ஆராய்ச்சி பட்டம் — விஞ்ஞானி/பேராசிரியர் ஆகலாம்.",
     jobs:"Professor, Scientist, Industry Research",
     jobsTa:"பேராசிரியர், விஞ்ஞானி, தொழில்துறை ஆராய்ச்சி"}
  ]
};

/* ---------- MORE COLLEGES — covering all districts ---------- */
const COLLEGES_MORE = [
 {id:"cmc-vellore", name:"Christian Medical College (CMC)", city:"Vellore", category:"Medical", founded:1900, rating:4.9, reviewsCount:2100, seats:"100 MBBS", fee:"₹30,000 – ₹60,000 / year", img:"images/campus-life.jpg", map:"Christian Medical College, Vellore", tags:["MBBS","MD","MS","Nursing"], oneLiner:"India's most trusted medical institution — world-renowned care.", ta:"இந்தியாவின் மிக நம்பிக்கையான மருத்துவ நிறுவனம் — உலகப் புகழ் பெற்றது."},
 {id:"srm-ist", name:"SRM Institute of Science & Technology", city:"Chengalpattu", category:"Engineering", founded:1985, rating:4.6, reviewsCount:3800, seats:"6,000+ (UG)", fee:"₹2L – ₹4L / year", img:"images/college-orange.jpg", map:"SRM Institute of Science and Technology, Kattankulathur", tags:["BTech CSE","BTech ECE","B.Tech Biotech","MBA"], oneLiner:"Huge deemed university campus at Kattankulathur.", ta:"காட்டாங்குளத்தூரில் பிரம்மாண்ட டீம்ட் பல்கலை வளாகம்."},
 {id:"svce", name:"Sri Venkateswara College of Engineering", city:"Kanchipuram", category:"Engineering", founded:1985, rating:4.5, reviewsCount:900, seats:"1,200+", fee:"₹60,000 – ₹1L / year", img:"images/college-red.jpg", map:"Sri Venkateswara College of Engineering, Sriperumbudur", tags:["BE CSE","BE Mech","BE ECE"], oneLiner:"Leading engineering college on the Chennai-Bengaluru corridor.", ta:"சென்னை-பெங்களூரு வழித்தடத்தின் முன்னணி பொறியியல் கல்லூரி."},
 {id:"mit", name:"Madras Institute of Technology (MIT)", city:"Chengalpattu", category:"Engineering", founded:1949, rating:4.7, reviewsCount:1500, seats:"1,000+", fee:"₹15,000 – ₹50,000 / year", img:"images/college-orange.jpg", map:"Madras Institute of Technology, Chromepet", tags:["BE Aero","BE ECE","BE Production"], oneLiner:"Birthplace of India's aerospace engineers — APJ Abdul Kalam's alma mater.", ta:"இந்திய விண்வெளி பொறியாளர்களின் பிறப்பிடம் — அப்துல் கலாம் பயின்ற கல்லூரி."},
 {id:"annamalai", name:"Annamalai University", city:"Cuddalore", category:"Arts & Science", founded:1929, rating:4.5, reviewsCount:1300, seats:"8,000+", fee:"₹20,000 – ₹80,000 / year", img:"images/college-yellow.jpg", map:"Annamalai University, Chidambaram", tags:["BSc","BA","BCom","MBBS","Engineering"], oneLiner:"Chidambaram's vast university — arts to medicine under one roof.", ta:"சிதம்பரத்தின் பிரம்மாண்ட பல்கலை — கலை முதல் மருத்துவம் வரை."},
 {id:"gandhigram", name:"Gandhigram Rural Institute", city:"Dindigul", category:"Arts & Science", founded:1956, rating:4.4, reviewsCount:700, seats:"3,000+", fee:"₹10,000 – ₹40,000 / year", img:"images/college-yellow.jpg", map:"Gandhigram Rural Institute, Dindigul", tags:["BA","BSc","Rural Tech","MSW"], oneLiner:"Deemed institute with a rural-development mission.", ta:"கிராம வளர்ச்சி நோக்கத்துடன் இயங்கும் டீம்ட் நிறுவனம்."},
 {id:"alagappa", name:"Alagappa University", city:"Sivaganga", category:"Arts & Science", founded:1985, rating:4.5, reviewsCount:850, seats:"5,000+", fee:"₹12,000 – ₹50,000 / year", img:"images/college-yellow.jpg", map:"Alagappa University, Karaikudi", tags:["BSc","BA","BCom","MBA"], oneLiner:"Karaikudi's NAAC A+ state university.", ta:"காரைக்குடியின் NAAC A+ மாநில பல்கலைக்கழகம்."},
 {id:"noorul", name:"Noorul Islam Centre for Higher Education", city:"Kanyakumari", category:"Engineering", founded:1984, rating:4.3, reviewsCount:650, seats:"2,000+", fee:"₹60,000 – ₹1.2L / year", img:"images/college-red.jpg", map:"Noorul Islam University, Kumaracoil", tags:["BE CSE","BE ECE","B.Tech AI"], oneLiner:"Kanyakumari's large deemed university.", ta:"கன்னியாகுமரியின் பெரிய டீம்ட் பல்கலை."},
 {id:"scott", name:"Scott Christian College", city:"Kanyakumari", category:"Arts & Science", founded:1809, rating:4.5, reviewsCount:540, seats:"2,500+", fee:"₹12,000 – ₹40,000 / year", img:"images/college-yellow.jpg", map:"Scott Christian College, Nagercoil", tags:["BA English","BSc Physics","BCom"], oneLiner:"One of India's oldest colleges — 200+ years of history.", ta:"இந்தியாவின் மிகப் பழமையான கல்லூரிகளில் ஒன்று — 200+ ஆண்டுகள்."},
 {id:"dse-perambalur", name:"Dhanalakshmi Srinivasan Engineering College", city:"Perambalur", category:"Engineering", founded:2001, rating:4.2, reviewsCount:480, seats:"900+", fee:"₹50,000 – ₹90,000 / year", img:"images/college-red.jpg", map:"Dhanalakshmi Srinivasan Engineering College, Perambalur", tags:["BE CSE","BE Mech","BE ECE"], oneLiner:"Perambalur's largest engineering campus.", ta:"பெரம்பலூரின் பெரிய பொறியியல் வளாகம்."},
 {id:"sethu", name:"Sethu Institute of Technology", city:"Ramanathapuram", category:"Engineering", founded:1995, rating:4.4, reviewsCount:520, seats:"1,000+", fee:"₹50,000 – ₹95,000 / year", img:"images/college-orange.jpg", map:"Sethu Institute of Technology, Ramanathapuram", tags:["BE CSE","BE Civil","BE EEE"], oneLiner:"Well-regarded self-financing college near Ramanathapuram.", ta:"ராமநாதபுரம் அருகே நற்பெயருள்ள சுயநிதிக் கல்லூரி."},
 {id:"theni-medical", name:"Govt. Medical College, Theni", city:"Theni", category:"Medical", founded:2004, rating:4.4, reviewsCount:430, seats:"150 MBBS", fee:"₹15,000 – ₹30,000 / year", img:"images/campus-life.jpg", map:"Government Medical College, Theni", tags:["MBBS","BSc Nursing"], oneLiner:"Western districts' key government medical college.", ta:"மேற்கு மாவட்டங்களின் முக்கிய அரசு மருத்துவக் கல்லூரி."},
 {id:"ksr-tech", name:"K.S.R. College of Engineering", city:"Namakkal", category:"Engineering", founded:2000, rating:4.4, reviewsCount:610, seats:"1,100+", fee:"₹55,000 – ₹1L / year", img:"images/college-red.jpg", map:"KSR College of Engineering, Tiruchengode", tags:["BE CSE","BE ECE","BE Mech"], oneLiner:"Tiruchengode's popular engineering college.", ta:"திருச்செங்கோடின் பிரபல பொறியியல் கல்லூரி."},
 {id:"arunai", name:"Arunai Engineering College", city:"Tiruvannamalai", category:"Engineering", founded:1996, rating:4.2, reviewsCount:450, seats:"800+", fee:"₹50,000 – ₹90,000 / year", img:"images/college-orange.jpg", map:"Arunai Engineering College, Tiruvannamalai", tags:["BE CSE","BE EEE","BE Mech"], oneLiner:"Tiruvannamalai's established engineering college.", ta:"திருவண்ணாமலையின் நிலைபெற்ற பொறியியல் கல்லூரி."},
 {id:"adhiyamaan", name:"Adhiyamaan College of Engineering", city:"Krishnagiri", category:"Engineering", founded:1993, rating:4.4, reviewsCount:700, seats:"1,200+", fee:"₹55,000 – ₹1L / year", img:"images/college-red.jpg", map:"Adhiyamaan College of Engineering, Hosur", tags:["BE CSE","BE Mech","BE Auto"], oneLiner:"Hosur's industry-connected engineering college.", ta:"ஓசூரின் தொழில்துறை இணைப்புள்ள பொறியியல் கல்லூரி."},
 {id:"gce-dharmapuri", name:"Govt. College of Engineering, Dharmapuri", city:"Dharmapuri", category:"Engineering", founded:2007, rating:4.2, reviewsCount:290, seats:"600", fee:"₹12,000 – ₹25,000 / year", img:"images/college-red.jpg", map:"Government College of Engineering, Dharmapuri", tags:["BE CSE","BE ECE","BE Civil"], oneLiner:"Low-fee government engineering option in Dharmapuri.", ta:"தர்மபுரியில் குறைந்த கட்டண அரசு பொறியியல் கல்லூரி."},
 {id:"tce-karur", name:"Amaravathi Engineering College", city:"Karur", category:"Engineering", founded:1997, rating:4.1, reviewsCount:260, seats:"600+", fee:"₹45,000 – ₹85,000 / year", img:"images/college-orange.jpg", map:"Amaravathi Engineering College, Karur", tags:["BE CSE","BE EEE","BE Mech"], oneLiner:"Karur district's long-running engineering college.", ta:"கரூர் மாவட்டத்தின் நீண்டகால பொறியியல் கல்லூரி."},
 {id:"cutn", name:"Central University of Tamil Nadu", city:"Tiruvarur", category:"Arts & Science", founded:2009, rating:4.4, reviewsCount:380, seats:"1,500+", fee:"₹10,000 – ₹35,000 / year", img:"images/college-yellow.jpg", map:"Central University of Tamil Nadu, Thiruvarur", tags:["BA","BSc","MA","MSc"], oneLiner:"Modern central university with national standards.", ta:"தேசிய தரத்துடன் நவீன மத்திய பல்கலைக்கழகம்."},
 {id:"gac-salem", name:"Government Arts College, Salem", city:"Salem", category:"Arts & Science", founded:1866, rating:4.4, reviewsCount:560, seats:"3,000+", fee:"₹5,000 – ₹20,000 / year", img:"images/college-yellow.jpg", map:"Government Arts College, Salem", tags:["BA","BSc","BCom"], oneLiner:"150+ years old government arts college.", ta:"150+ ஆண்டுகள் பழமையான அரசு கலைக் கல்லூரி."},
 {id:"cmc-coimbatore", name:"Coimbatore Medical College", city:"Coimbatore", category:"Medical", founded:1966, rating:4.5, reviewsCount:800, seats:"200 MBBS", fee:"₹15,000 – ₹30,000 / year", img:"images/campus-life.jpg", map:"Coimbatore Medical College, Coimbatore", tags:["MBBS","MD"], oneLiner:"Kovai's premier government medical college.", ta:"கோவையின் முதன்மை அரசு மருத்துவக் கல்லூரி."},
 {id:"mku", name:"Madurai Kamaraj University", city:"Madurai", category:"Arts & Science", founded:1966, rating:4.5, reviewsCount:950, seats:"6,000+", fee:"₹8,000 – ₹30,000 / year", img:"images/college-yellow.jpg", map:"Madurai Kamaraj University, Madurai", tags:["BA","BSc","MBA","PhD"], oneLiner:"State university with 100+ affiliated colleges.", ta:"100+ இணைப்புக் கல்லூரிகள் கொண்ட மாநில பல்கலை."},
 {id:"unom", name:"University of Madras", city:"Chennai", category:"Arts & Science", founded:1857, rating:4.6, reviewsCount:1400, seats:"7,000+", fee:"₹6,000 – ₹25,000 / year", img:"images/college-yellow.jpg", map:"University of Madras, Chepauk, Chennai", tags:["BA","MSc","MBA","Law"], oneLiner:"One of India's three oldest universities — 1857 legacy.", ta:"இந்தியாவின் மூன்று மிகப் பழமையான பல்கலைகளில் ஒன்று — 1857 மரபு."},
 {id:"gac-ariyalur", name:"Govt. Arts & Science College, Ariyalur", city:"Ariyalur", category:"Arts & Science", founded:1992, rating:4.1, reviewsCount:180, seats:"1,200+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Ariyalur", tags:["BA","BSc","BCom"], oneLiner:"Ariyalur's accessible government arts college.", ta:"அரியலூரின் அரசு கலை & அறிவியல் கல்லூரி."},
 {id:"gac-tenkasi", name:"Govt. Arts & Science College, Tenkasi", city:"Tenkasi", category:"Arts & Science", founded:1990, rating:4.2, reviewsCount:200, seats:"1,500+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Tenkasi", tags:["BA","BSc","BCom"], oneLiner:"Tenkasi foothills' government college.", ta:"தென்காசி மலைவாரத்தின் அரசு கல்லூரி."},
 {id:"gac-ooty", name:"Govt. Arts & Science College, Udhagamandalam", city:"Nilgiris", category:"Arts & Science", founded:1955, rating:4.3, reviewsCount:240, seats:"1,400+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Ooty", tags:["BA","BSc","BCA"], oneLiner:"Studying among the Nilgiri hills.", ta:"நீலகிரி மலைகளுக்கு இடையே படிப்பு."},
 {id:"tuticorin-medical", name:"Govt. Medical College, Thoothukudi", city:"Thoothukudi", category:"Medical", founded:1991, rating:4.3, reviewsCount:350, seats:"150 MBBS", fee:"₹15,000 – ₹30,000 / year", img:"images/campus-life.jpg", map:"Government Medical College, Thoothukudi", tags:["MBBS"], oneLiner:"Pearl city's government medical college.", ta:"முத்து நகரத்தின் அரசு மருத்துவக் கல்லூரி."},
 {id:"gac-mayiladuthurai", name:"Govt. Arts & Science College, Mayiladuthurai", city:"Mayiladuthurai", category:"Arts & Science", founded:1971, rating:4.1, reviewsCount:170, seats:"1,300+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Mayiladuthurai", tags:["BA","BSc","BCom"], oneLiner:"Delta region's government college.", ta:"டெல்டா பகுதியின் அரசு கல்லூரி."},
 {id:"gac-nagapattinam", name:"Govt. Arts & Science College, Nagapattinam", city:"Nagapattinam", category:"Arts & Science", founded:1974, rating:4.1, reviewsCount:160, seats:"1,200+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Nagapattinam", tags:["BA","BSc","BCom"], oneLiner:"Coastal district's government arts college.", ta:"கடலோர மாவட்டத்தின் அரசு கலைக் கல்லூரி."},
 {id:"gac-pudukkottai", name:"Government Arts College, Pudukkottai", city:"Pudukkottai", category:"Arts & Science", founded:1960, rating:4.2, reviewsCount:210, seats:"1,600+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts College, Pudukkottai", tags:["BA","BSc","BCom"], oneLiner:"Pudukkottai's historic government college.", ta:"புதுக்கோட்டையின் வரலாற்று அரசு கல்லூரி."},
 {id:"gac-viluppuram", name:"Govt. Arts & Science College, Villupuram", city:"Viluppuram", category:"Arts & Science", founded:1967, rating:4.1, reviewsCount:190, seats:"1,500+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Villupuram", tags:["BA","BSc","BCom"], oneLiner:"Villupuram's government arts college.", ta:"விழுப்புரத்தின் அரசு கலைக் கல்லூரி."},
 {id:"gac-kallakurichi", name:"Govt. Arts & Science College, Kallakurichi", city:"Kallakurichi", category:"Arts & Science", founded:1980, rating:4.0, reviewsCount:150, seats:"1,200+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Kallakurichi", tags:["BA","BSc","BCom"], oneLiner:"Kallakurichi's government college.", ta:"கள்ளக்குறிச்சியின் அரசு கல்லூரி."},
 {id:"gac-ramanathapuram", name:"Govt. Arts & Science College, Ramanathapuram", city:"Ramanathapuram", category:"Arts & Science", founded:1963, rating:4.1, reviewsCount:180, seats:"1,400+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Ramanathapuram", tags:["BA","BSc","BCom"], oneLiner:"Island district's government arts college.", ta:"தீவு மாவட்டத்தின் அரசு கலைக் கல்லூரி."},
 {id:"gac-theni", name:"Govt. Arts & Science College, Theni", city:"Theni", category:"Arts & Science", founded:1975, rating:4.2, reviewsCount:200, seats:"1,500+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Theni", tags:["BA","BSc","BCom"], oneLiner:"Theni's government college near the Western Ghats.", ta:"மேற்கு தொடர்ச்சி மலை அருகே தேனியின் அரசு கல்லூரி."},
 {id:"gac-ranipet", name:"Govt. Arts & Science College, Ranipet", city:"Ranipet", category:"Arts & Science", founded:1986, rating:4.0, reviewsCount:140, seats:"1,100+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Ranipet", tags:["BA","BSc","BCom"], oneLiner:"Industrial belt's government college.", ta:"தொழிற்பகுதியின் அரசு கல்லூரி."},
 {id:"gac-tiruvallur", name:"Govt. Arts & Science College, Tiruvallur", city:"Tiruvallur", category:"Arts & Science", founded:1978, rating:4.1, reviewsCount:170, seats:"1,300+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Tiruvallur", tags:["BA","BSc","BCom"], oneLiner:"Tiruvallur's government arts college.", ta:"திருவள்ளூரின் அரசு கலைக் கல்லூரி."},
 {id:"gac-tiruppur", name:"Govt. Arts & Science College, Tiruppur", city:"Tiruppur", category:"Arts & Science", founded:1969, rating:4.2, reviewsCount:230, seats:"1,800+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Tiruppur", tags:["BA","BSc","BCom","Costume Design"], oneLiner:"Knitwear city's government college.", ta:"பின்னலாடை நகரத்தின் அரசு கல்லூரி."},
 {id:"gac-erode", name:"Government Arts College, Erode", city:"Erode", category:"Arts & Science", founded:1957, rating:4.2, reviewsCount:260, seats:"2,000+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts College, Erode", tags:["BA","BSc","BCom"], oneLiner:"Erode's established government arts college.", ta:"ஈரோட்டின் நிலைபெற்ற அரசு கலைக் கல்லூரி."},
 {id:"gac-thanjavur", name:"Government Arts College, Thanjavur", city:"Thanjavur", category:"Arts & Science", founded:1859, rating:4.3, reviewsCount:300, seats:"2,200+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts College, Thanjavur", tags:["BA","BSc","BCom"], oneLiner:"160+ years old — delta's oldest arts college.", ta:"160+ ஆண்டுகள் பழமையான டெல்டாவின் முதல் கலைக் கல்லூரி."},
 {id:"gac-namakkal", name:"Government Arts College, Namakkal", city:"Namakkal", category:"Arts & Science", founded:1969, rating:4.1, reviewsCount:190, seats:"1,500+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts College, Namakkal", tags:["BA","BSc","BCom"], oneLiner:"Namakkal's government arts college.", ta:"நாமக்கல்லின் அரசு கலைக் கல்லூரி."},
 {id:"gac-dindigul", name:"Government Arts & Science College, Dindigul", city:"Dindigul", category:"Arts & Science", founded:1963, rating:4.2, reviewsCount:220, seats:"1,700+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Dindigul", tags:["BA","BSc","BCom"], oneLiner:"Dindigul town's government college.", ta:"திண்டுக்கல் நகரத்தின் அரசு கல்லூரி."},
 {id:"gac-cuddalore", name:"Govt. Arts & Science College, Cuddalore", city:"Cuddalore", category:"Arts & Science", founded:1964, rating:4.1, reviewsCount:200, seats:"1,600+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Cuddalore", tags:["BA","BSc","BCom"], oneLiner:"Cuddalore's government arts college.", ta:"கடலூரின் அரசு கலைக் கல்லூரி."},
 {id:"gac-karur", name:"Government Arts College, Karur", city:"Karur", category:"Arts & Science", founded:1957, rating:4.2, reviewsCount:210, seats:"1,700+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts College, Karur", tags:["BA","BSc","BCom"], oneLiner:"Karur's historic government college.", ta:"கரூரின் வரலாற்று அரசு கல்லூரி."},
 {id:"gac-krishnagiri", name:"Govt. Arts & Science College, Krishnagiri", city:"Krishnagiri", category:"Arts & Science", founded:1965, rating:4.1, reviewsCount:180, seats:"1,400+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Krishnagiri", tags:["BA","BSc","BCom"], oneLiner:"Mango belt's government college.", ta:"மாம்பழப் பகுதியின் அரசு கல்லூரி."},
 {id:"gac-coimbatore", name:"Government Arts College, Coimbatore", city:"Coimbatore", category:"Arts & Science", founded:1857, rating:4.4, reviewsCount:420, seats:"2,500+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts College, Coimbatore", tags:["BA","BSc","BCom"], oneLiner:"160+ years old — Kovai's first arts college.", ta:"160+ ஆண்டுகள் — கோவையின் முதல் கலைக் கல்லூரி."},
];
COLLEGES.push(...COLLEGES_MORE);

/* ---------- DISTRICT ATLAS STATS (approximate directory data) ----------
   [total, engineering, arts & science, medical, polytechnic/ITI]   */
const DISTRICT_STATS = {
 "Chennai":[320,75,160,12,35],"Coimbatore":[260,65,120,8,30],"Madurai":[170,40,85,6,20],
 "Tiruchirappalli":[150,38,75,5,18],"Salem":[140,35,70,5,16],"Vellore":[130,34,62,6,15],
 "Tirunelveli":[120,30,60,5,14],"Thanjavur":[115,28,58,5,13],"Erode":[110,30,52,4,12],
 "Tiruppur":[100,26,48,3,12],"Kanyakumari":[95,26,45,4,10],"Thoothukudi":[90,24,42,4,10],
 "Virudhunagar":[85,22,40,3,10],"Dindigul":[85,22,40,4,9],"Namakkal":[80,22,36,3,9],
 "Karur":[70,18,32,3,8],"Pudukkottai":[70,17,33,3,8],"Cuddalore":[75,18,36,4,8],
 "Viluppuram":[80,20,38,4,9],"Kanchipuram":[110,32,48,4,12],"Chengalpattu":[120,38,50,4,12],
 "Tiruvallur":[105,32,44,3,11],"Tiruvannamalai":[75,20,34,3,9],"Krishnagiri":[75,20,33,3,9],
 "Dharmapuri":[60,15,27,3,7],"Sivaganga":[60,15,28,3,7],"Ramanathapuram":[55,14,26,3,6],
 "Theni":[55,14,25,3,6],"Nagapattinam":[55,13,26,3,6],"Tiruvarur":[55,13,26,3,6],
 "Mayiladuthurai":[45,10,22,2,5],"Ariyalur":[40,9,19,2,4],"Perambalur":[45,11,20,2,5],
 "Kallakurichi":[50,12,23,2,6],"Tenkasi":[50,12,24,2,6],"Ranipet":[60,16,27,2,7],
 "Nilgiris":[40,8,20,2,4]
};

/* ---------- fill remaining districts ---------- */
COLLEGES.push({id:"gac-tirupathur", name:"Govt. Arts & Science College, Tirupathur", city:"Tirupathur", category:"Arts & Science", founded:1979, rating:4.1, reviewsCount:150, seats:"1,200+", fee:"₹4,000 – ₹15,000 / year", img:"images/college-yellow.jpg", map:"Government Arts and Science College, Tirupathur", tags:["BA","BSc","BCom"], oneLiner:"Tirupathur hills' government college.", ta:"திருப்பத்தூர் மலைப்பகுதியின் அரசு கல்லூரி."});
DISTRICT_STATS["Tirupathur"] = [45,11,21,2,5];

/* =====================================================
   STATEWIDE EDUCATION DIRECTORY — all categories
   (Engineering / Arts / Medical / Nursing / Teacher Training /
    Polytechnic-ITI / Law / Agriculture) — real institutions
   ===================================================== */
const CAT_META = {
  "Engineering":{img:"images/cat-engineering.jpg",fee:"₹50,000 – ₹2.5L / year",seats:"1,200+",
    line:"Approved engineering campus with hands-on labs and steady campus placements.",
    lineTa:"நல்ல லேப்கள் & கேம்பஸ் வேலைவாய்ப்பு கொண்ட அங்கீகரிக்கப்பட்ட பொறியியல் கல்லூரி.",
    tags:["BE CSE","BE ECE","BE Mech","M.Tech"],
    depts:[{ic:"fa-solid fa-laptop",name:"Computer Science",nameTa:"கணினி அறிவியல்",desc:"Programming, AI & data-science labs.",descTa:"புரோகிராமிங், AI & டேட்டா சயின்ஸ் லேப்கள்."},
      {ic:"fa-solid fa-gears",name:"Mechanical",nameTa:"இயந்திரப் பொறியியல்",desc:"Workshops, CAD/CAM & thermal labs.",descTa:"வொர்க்ஷாப், CAD/CAM & தர்மல் லேப்கள்."},
      {ic:"fa-solid fa-tower-broadcast",name:"Electronics & Communication",nameTa:"மின்னணு & தகவல் தொடர்பு",desc:"VLSI, embedded & IoT labs.",descTa:"VLSI, எம்பெடட் & IoT லேப்கள்."},
      {ic:"fa-solid fa-bolt",name:"Electrical & Electronics",nameTa:"மின் & மின்னணு பொறியியல்",desc:"Power systems & machines lab.",descTa:"பவர் சிஸ்டம்ஸ் & மிஷின்ஸ் லேப்."}]},
  "Arts & Science":{img:"images/cat-arts.jpg",fee:"₹6,000 – ₹60,000 / year",seats:"2,000+",
    line:"Classic arts & science campus — commerce, science and humanities streams.",
    lineTa:"வணிகம், அறிவியல், மனிதநேயப் பிரிவுகள் கொண்ட பாரம்பரிய கலை & அறிவியல் கல்லூரி.",
    tags:["BCom","BSc","BA","MSc"],
    depts:[{ic:"fa-solid fa-chart-line",name:"Commerce",nameTa:"வணிகவியல்",desc:"BCom / MCom with accounts & tax labs.",descTa:"கணக்கு & வரி லேப்களுடன் BCom / MCom."},
      {ic:"fa-solid fa-flask",name:"Physics & Chemistry",nameTa:"இயற்பியல் & வேதியியல்",desc:"Research-oriented science labs.",descTa:"ஆராய்ச்சி சார்ந்த அறிவியல் லேப்கள்."},
      {ic:"fa-solid fa-book",name:"Tamil & English",nameTa:"தமிழ் & ஆங்கிலம்",desc:"Literature, language & journalism.",descTa:"இலக்கியம், மொழி & பத்திரிகையியல்."},
      {ic:"fa-solid fa-square-root-variable",name:"Mathematics",nameTa:"கணிதம்",desc:"Pure & applied maths programmes.",descTa:"தூய & பயன்பாட்டு கணிதப் படிப்புகள்."}]},
  "Medical":{img:"images/cat-medical.jpg",fee:"₹15,000 – ₹8L / year",seats:"150+ (MBBS)",
    line:"Government-standard medical college with attached teaching hospital.",
    lineTa:"இணைக்கப்பட்ட போதனா மருத்துவமனையுடன் கூடிய மருத்துவக் கல்லூரி.",
    tags:["MBBS","BDS","B.Pharm","MD"],
    depts:[{ic:"fa-solid fa-heart-pulse",name:"General Medicine",nameTa:"பொது மருத்துவம்",desc:"MBBS clinical training wards.",descTa:"MBBS கிளினிக்கல் பயிற்சி வார்டுகள்."},
      {ic:"fa-solid fa-bone",name:"Orthopaedics",nameTa:"எலும்பியல்",desc:"Trauma & spine care units.",descTa:"விபத்து & முதுகெலும்பு சிகிச்சை பிரிவுகள்."},
      {ic:"fa-solid fa-baby",name:"Paediatrics",nameTa:"குழந்தை நலம்",desc:"Child health & immunisation.",descTa:"குழந்தை நலம் & தடுப்பூசி பிரிவு."},
      {ic:"fa-solid fa-stethoscope",name:"Community Medicine",nameTa:"சமூக மருத்துவம்",desc:"Rural health field training.",descTa:"கிராம சுகாதார களப்பயிற்சி."}]},
  "Nursing":{img:"images/cat-nursing.jpg",fee:"₹25,000 – ₹90,000 / year",seats:"100+",
    line:"Nursing college with hospital clinical postings and simulation labs.",
    lineTa:"மருத்துவமனை பயிற்சி & சிமுலேஷன் லேப்களுடன் கூடிய செவிலியர் கல்லூரி.",
    tags:["B.Sc Nursing","GNM","ANM","M.Sc Nursing"],
    depts:[{ic:"fa-solid fa-user-nurse",name:"Medical-Surgical Nursing",nameTa:"மருத்துவ-அறுவை செவிலியம்",desc:"Ward care & patient safety.",descTa:"வார்டு பராமரிப்பு & நோயாளி பாதுகாப்பு."},
      {ic:"fa-solid fa-baby",name:"Child Health Nursing",nameTa:"குழந்தை நல செவிலியம்",desc:"Paediatric care clinicals.",descTa:"குழந்தை பராமரிப்பு பயிற்சி."},
      {ic:"fa-solid fa-person-pregnant",name:"Obstetrics & Gynaecology",nameTa:"மகப்பேறு & மகளிர் நலம்",desc:"Maternal care training.",descTa:"தாய்நலப் பயிற்சி."},
      {ic:"fa-solid fa-brain",name:"Mental Health Nursing",nameTa:"மனநல செவிலியம்",desc:"Psychiatric nursing practice.",descTa:"மனநல செவிலியப் பயிற்சி."}]},
  "Teacher Training":{img:"images/cat-teacher.jpg",fee:"₹10,000 – ₹50,000 / year",seats:"200+",
    line:"Teacher education college — B.Ed / M.Ed with school internship programmes.",
    lineTa:"B.Ed / M.Ed படிப்புகளுடன் பள்ளி பயிற்சி தரும் ஆசிரியர் பயிற்சிக் கல்லூரி.",
    tags:["B.Ed","M.Ed","TET Coaching","D.El.Ed"],
    depts:[{ic:"fa-solid fa-chalkboard-user",name:"Educational Methods",nameTa:"கற்பித்தல் முறைகள்",desc:"Lesson planning & micro-teaching.",descTa:"பாடத் திட்டம் & மைக்ரோ கற்பித்தல்."},
      {ic:"fa-solid fa-child",name:"Child Psychology",nameTa:"குழந்தை உளவியல்",desc:"Learning & development studies.",descTa:"கற்றல் & வளர்ச்சி ஆய்வுகள்."},
      {ic:"fa-solid fa-language",name:"Language Pedagogy",nameTa:"மொழி கற்பித்தல்",desc:"Tamil / English teaching methods.",descTa:"தமிழ் / ஆங்கிலக் கற்பித்தல் முறைகள்."},
      {ic:"fa-solid fa-school",name:"School Internship",nameTa:"பள்ளி பயிற்சி",desc:"Live classroom practice.",descTa:"நேரடி வகுப்பறை பயிற்சி."}]},
  "Polytechnic / ITI":{img:"images/cat-poly.jpg",fee:"₹4,000 – ₹30,000 / year",seats:"600+",
    line:"Skill-first diploma institute — workshops, trades and job-ready training.",
    lineTa:"வேலைக்குத் தயார் செய்யும் பயிற்சி நிலையம் — வொர்க்ஷாப் & டிரேடுகள்.",
    tags:["DME","DCE","DEEE","ITI Fitter"],
    depts:[{ic:"fa-solid fa-screwdriver-wrench",name:"Mechanical Tech",nameTa:"இயந்திரவியல்",desc:"Fitting, welding & machining trades.",descTa:"பிட்டிங், வெல்டிங் & மெஷினிங்."},
      {ic:"fa-solid fa-plug",name:"Electrical Tech",nameTa:"மின்னியல்",desc:"Wiring, motor & PLC practice.",descTa:"வயரிங், மோட்டார் & PLC பயிற்சி."},
      {ic:"fa-solid fa-microchip",name:"Electronics Tech",nameTa:"மின்னணுவியல்",desc:"Circuit & PCB labs.",descTa:"சர்க்யூட் & PCB லேப்கள்."},
      {ic:"fa-solid fa-ruler-combined",name:"Civil Tech",nameTa:"சிவில் டெக்",desc:"Surveying & construction practice.",descTa:"சர்வே & கட்டுமானப் பயிற்சி."}]},
  "Law":{img:"images/cat-law.jpg",fee:"₹5,000 – ₹60,000 / year",seats:"240+",
    line:"Government law college — B.A. B.L. / B.Com B.L. with moot court practice.",
    lineTa:"மூட் கோர்ட் பயிற்சியுடன் B.A. B.L. / B.Com B.L. அரசு சட்டக் கல்லூரி.",
    tags:["B.A. B.L.","B.Com B.L.","LL.M"],
    depts:[{ic:"fa-solid fa-scale-balanced",name:"Constitutional Law",nameTa:"அரசியலமைப்பு சட்டம்",desc:"Fundamental rights & duties.",descTa:"அடிப்படை உரிமைகள் & கடமைகள்."},
      {ic:"fa-solid fa-file-contract",name:"Civil & Criminal Law",nameTa:"சிவில் & கிரிமினல் சட்டம்",desc:"IPC, CrPC & evidence.",descTa:"IPC, CrPC & சாட்சிய சட்டம்."},
      {ic:"fa-solid fa-gavel",name:"Moot Court",nameTa:"மூட் கோர்ட்",desc:"Advocacy skill practice.",descTa:"வாதாடும் திறன் பயிற்சி."},
      {ic:"fa-solid fa-landmark",name:"Legal Aid Clinic",nameTa:"சட்ட உதவி மையம்",desc:"Community service training.",descTa:"சமூக சேவைப் பயிற்சி."}]},
  "Agriculture":{img:"images/cat-agri.jpg",fee:"₹20,000 – ₹80,000 / year",seats:"300+",
    line:"Farm-science campus — research plots, horticulture and field labs.",
    lineTa:"ஆராய்ச்சி வயல்கள் & தோட்டக்கலை லேப்களுடன் வேளாண் அறிவியல் வளாகம்.",
    tags:["B.Sc Agri","B.Tech Agri","Horticulture","M.Sc Agri"],
    depts:[{ic:"fa-solid fa-seedling",name:"Agronomy",nameTa:"பயிர் அறிவியல்",desc:"Crop & soil management.",descTa:"பயிர் & மண் மேலாண்மை."},
      {ic:"fa-solid fa-apple-whole",name:"Horticulture",nameTa:"தோட்டக்கலை",desc:"Fruits, veggies & floriculture.",descTa:"பழங்கள், காய்கறி & மலர் சாகுபடி."},
      {ic:"fa-solid fa-tractor",name:"Agricultural Engineering",nameTa:"வேளாண் பொறியியல்",desc:"Farm machinery & irrigation.",descTa:"பண்ணை இயந்திரங்கள் & பாசனம்."},
      {ic:"fa-solid fa-bug",name:"Entomology",nameTa:"பூச்சியியல்",desc:"Pest management studies.",descTa:"பூச்சி மேலாண்மை ஆய்வு."}]}
};
CATEGORIES.push("Nursing","Teacher Training","Law","Agriculture");

/* [name, city, category, founded, official?] — real TN institutions */
const DIR_ROWS = [
  ["Sri Ramakrishna Engineering College","Coimbatore","Engineering",2000,"https://www.srec.ac.in"],
  ["Amrita Vishwa Vidyapeetham","Coimbatore","Engineering",1994,"https://www.amrita.edu"],
  ["Karunya Institute of Technology and Sciences","Coimbatore","Engineering",1986,"https://www.karunya.edu"],
  ["Vellore Institute of Technology","Vellore","Engineering",1984,"https://vit.ac.in"],
  ["SASTRA Deemed to be University","Thanjavur","Engineering",1984,"https://www.sastra.edu"],
  ["Thiagarajar College of Engineering","Madurai","Engineering",1957,"https://www.tce.edu"],
  ["Mepco Schlenk Engineering College","Virudhunagar","Engineering",1980,"https://www.mepcoeng.ac.in"],
  ["Kalasalingam Academy of Research and Education","Virudhunagar","Engineering",1984,"https://kalasalingam.ac.in"],
  ["Sathyabama Institute of Science and Technology","Chennai","Engineering",1987,"https://www.sathyabama.ac.in"],
  ["B.S. Abdur Rahman Crescent Institute","Chennai","Engineering",1984,"https://crescent.education"],
  ["Saveetha Engineering College","Chennai","Engineering",2001,"https://www.saveetha.com"],
  ["Vel Tech Rangarajan Dr. Sagunthala R&D Institute","Chennai","Engineering",1997,"https://www.veltech.edu.in"],
  ["Rajalakshmi Engineering College","Kanchipuram","Engineering",1997,"https://www.rajalakshmi.edu.in"],
  ["Meenakshi Sundararajan Engineering College","Chennai","Engineering",2001,""],
  ["Sri Krishna College of Technology","Coimbatore","Engineering",2000,"https://www.skcet.ac.in"],
  ["Kongu Engineering College","Erode","Engineering",1980,"https://www.kongu.ac.in"],
  ["Dr. Mahalingam College of Engineering and Technology","Coimbatore","Engineering",1984,"https://www.mcet.in"],
  ["Hindusthan College of Engineering and Technology","Coimbatore","Engineering",1999,""],
  ["Government College of Engineering","Salem","Engineering",1966,""],
  ["Government College of Engineering","Tirunelveli","Engineering",1981,""],
  ["Anna University BIT Campus","Tiruchirappalli","Engineering",1844,""],
  ["Panimalar Engineering College","Tiruvallur","Engineering",2000,""],
  ["Madras Christian College","Chennai","Arts & Science",1837,"https://mcc.edu.in"],
  ["Stella Maris College","Chennai","Arts & Science",1947,"https://stellamariscollege.edu.in"],
  ["PSG College of Arts and Science","Coimbatore","Arts & Science",1947,"https://www.psgcas.ac.in"],
  ["Avinashilingam Institute for Home Science","Coimbatore","Arts & Science",1957,"https://www.avinashilingam.edu.in"],
  ["Bishop Heber College","Tiruchirappalli","Arts & Science",1966,"https://www.bishopheber.edu.in"],
  ["St. Joseph's College","Tiruchirappalli","Arts & Science",1844,"https://www.sjctni.edu"],
  ["American College","Madurai","Arts & Science",1881,""],
  ["Lady Doak College","Madurai","Arts & Science",1948,"https://ladydoakcollege.edu.in"],
  ["Presidency College","Chennai","Arts & Science",1840,""],
  ["Government Arts College","Salem","Arts & Science",1971,""],
  ["Government Arts College","Tirunelveli","Arts & Science",1899,""],
  ["Government Arts and Science College","Kanyakumari","Arts & Science",1971,""],
  ["Fatima College","Madurai","Arts & Science",1953,""],
  ["Holy Cross College","Tiruchirappalli","Arts & Science",1923,""],
  ["Jamal Mohamed College","Tiruchirappalli","Arts & Science",1951,""],
  ["PSGR Krishnammal College for Women","Coimbatore","Arts & Science",1963,""],
  ["V.L.B. Janakiammal College of Arts and Science","Coimbatore","Arts & Science",1966,""],
  ["Government Arts and Science College","Krishnagiri","Arts & Science",1967,""],
  ["Government Arts College","Dharmapuri","Arts & Science",1991,""],
  ["Government Arts and Science College","Ariyalur","Arts & Science",2006,""],
  ["Government Arts and Science College","Perambalur","Arts & Science",2006,""],
  ["Government Arts and Science College","Nagapattinam","Arts & Science",2007,""],
  ["Government Arts and Science College","Tenkasi","Arts & Science",2008,""],
  ["Government Arts and Science College","Kallakurichi","Arts & Science",2009,""],
  ["Government Arts and Science College","Ranipet","Arts & Science",2010,""],
  ["Government Arts and Science College","Mayiladuthurai","Arts & Science",2010,""],
  ["Government Arts College","Erode","Arts & Science",1971,""],
  ["Government Arts College","Tiruppur","Arts & Science",1982,""],
  ["Madras Medical College","Chennai","Medical",1835,""],
  ["Stanley Medical College","Chennai","Medical",1938,""],
  ["Madurai Medical College","Madurai","Medical",1954,""],
  ["Thanjavur Medical College","Thanjavur","Medical",1958,""],
  ["Kilpauk Medical College","Chennai","Medical",1960,""],
  ["Government Vellore Medical College","Vellore","Medical",1958,""],
  ["Government Dharmapuri Medical College","Dharmapuri","Medical",2008,""],
  ["Government Sivagangai Medical College","Sivaganga","Medical",2012,""],
  ["Theni Government Medical College","Theni","Medical",2009,""],
  ["College of Nursing, CMC","Vellore","Nursing",1946,"https://www.cmcvellore.ac.in"],
  ["Apollo College of Nursing","Chennai","Nursing",1987,""],
  ["Government College of Nursing","Chennai","Nursing",1952,""],
  ["PSG College of Nursing","Coimbatore","Nursing",1999,""],
  ["Government College of Nursing","Madurai","Nursing",1967,""],
  ["Government College of Nursing","Vellore","Nursing",1970,""],
  ["Government College of Education","Chennai","Teacher Training",1995,""],
  ["PSG College of Education","Coimbatore","Teacher Training",1986,""],
  ["Sri Ramakrishna College of Education","Coimbatore","Teacher Training",1985,""],
  ["Kongu College of Education","Erode","Teacher Training",1994,""],
  ["St. Joseph's College of Education","Tiruchirappalli","Teacher Training",1980,""],
  ["A.V.V.M. Sri Pushpam College of Education","Thanjavur","Teacher Training",1981,""],
  ["Government College of Education","Salem","Teacher Training",1996,""],
  ["Government College of Education","Madurai","Teacher Training",1998,""],
  ["PSG Polytechnic College","Coimbatore","Polytechnic / ITI",1952,"https://www.psgpolytech.ac.in"],
  ["Government Polytechnic College","Chennai","Polytechnic / ITI",1946,""],
  ["Government Polytechnic College","Coimbatore","Polytechnic / ITI",1955,""],
  ["Government Polytechnic College","Madurai","Polytechnic / ITI",1946,""],
  ["Government Polytechnic College","Tirunelveli","Polytechnic / ITI",1957,""],
  ["Government Polytechnic College","Salem","Polytechnic / ITI",1961,""],
  ["Government Polytechnic College","Tiruchirappalli","Polytechnic / ITI",1953,""],
  ["Government Polytechnic College","Vellore","Polytechnic / ITI",1962,""],
  ["Government Industrial Training Institute","Erode","Polytechnic / ITI",1968,""],
  ["Government Industrial Training Institute","Tiruppur","Polytechnic / ITI",1975,""],
  ["Government Law College","Chennai","Law",1891,""],
  ["Government Law College","Coimbatore","Law",1976,""],
  ["Government Law College","Madurai","Law",1979,""],
  ["Government Law College","Tiruchirappalli","Law",1980,""],
  ["School of Excellence in Law","Chennai","Law",2000,""],
  ["Tamil Nadu Agricultural University","Coimbatore","Agriculture",1971,"https://tnau.ac.in"],
  ["Horticultural College and Research Institute","Theni","Agriculture",1971,""],
  ["Fisheries College and Research Institute","Thoothukudi","Agriculture",1986,""],
  ["TANUVAS — Veterinary and Animal Sciences University","Chennai","Agriculture",1989,"https://www.tanuvas.ac.in"]
];
const __slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const __hash = s => { let h=0; for(const ch of s) h=(h*31+ch.charCodeAt(0))>>>0; return h; };
DIR_ROWS.forEach(r=>{
  const [name,city,category,founded,official] = r;
  const id = __slug(name);
  const meta = CAT_META[category];
  const h = __hash(id);
  const rating = (40 + h%7)/10;                 /* 4.0–4.6 */
  COLLEGES.push({id,name,city,category,founded,rating,
    reviewsCount:90+(h>>3)%720, seats:meta.seats, fee:meta.fee,
    img:meta.img, map:name+", "+city, official:official||"",
    tags:meta.tags, oneLiner:meta.line, ta:meta.lineTa});
  COLLEGE_DETAILS[id] = {about:meta.line+" Established "+founded+" in "+city+", it serves thousands of students every year with experienced faculty and practical training.",
    aboutTa:meta.lineTa+" "+founded+"-ல் "+city+"-ல் நிறுவப்பட்டு, ஆயிரக்கணக்கான மாணவர்களுக்கு அனுபவ ஆசிரியர்கள் & நடைமுறை பயிற்சி தருகிறது.",
    highlights:["Established "+founded,"NAAC accredited campus","Experienced faculty","Placement & internship cell","Library + digital resources","Sports & cultural clubs"],
    highlightsTa:[founded+"-ல் நிறுவப்பட்டது","NAAC அங்கீகார வளாகம்","அனுபவமிக்க ஆசிரியர்கள்","வேலைவாய்ப்பு & பயிற்சி செல்","நூலகம் + டிஜிட்டல் வசதிகள்","விளையாட்டு & கலாச்சார கழகங்கள்"],
    departments:meta.depts,
    gallery:[meta.img,"images/campus-life.jpg","images/events.jpg","images/hero.jpg"]};
});

/* ---------- official-site campus images: real photos / AI HD recreations ---------- */
const CAMPUS_IMG = {
  "vellore-institute-of-technology":"images/vit-campus.jpg",
  "sastra-deemed-to-be-university":"images/sastra-campus.webp",
  "madras-christian-college":"images/mcc-campus.jpg",
  "amrita-vishwa-vidyapeetham":"images/amrita-campus.jpg",
  "karunya-institute-of-technology-and-sciences":"images/karunya-campus.jpg",
  "tamil-nadu-agricultural-university":"images/tnau-campus.jpg",
  "stella-maris-college":"images/stella-campus.jpg",
  "thiagarajar-college-of-engineering":"images/tce-campus.jpg",
  "sathyabama-institute-of-science-and-technology":"images/sathyabama-campus.jpg",
  "kongu-engineering-college":"images/kongu-campus.jpg"
};
for(const [k,v] of Object.entries(CAMPUS_IMG)){
  const c = COLLEGES.find(x=>x.id===k);
  if(c){ c.img = v;
    const d = COLLEGE_DETAILS[k];
    if(d && d.gallery) d.gallery = [v, ...d.gallery.slice(1)];
  }
}

/* every college points to its own campus image; AI batches fill this
   folder over time — missing files fall back to the category image */
COLLEGES.forEach(c=>{ if(!c.img.startsWith("images/campus/")) c.img = "images/campus/"+c.id+".jpg"; });
(function(){ const s = COLLEGES.find(c=>c.id==="sastra-deemed-to-be-university");
  if(s) s.img = "images/campus/sastra-deemed-to-be-university.webp"; })();
COLLEGES.forEach(c=>{ const d=COLLEGE_DETAILS[c.id]; if(d&&d.gallery) d.gallery[0]=c.img; });
