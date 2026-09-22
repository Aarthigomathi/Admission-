import { createContext, useContext, useState, useEffect } from 'react'

const translations = {
  en: {
    // Common
    welcome: "Welcome",
    student: "Student",
    dashboard: "Dashboard",
    explore: "Explore Colleges",
    saved: "Saved",
    compare: "Compare",
    enquiries: "Enquiries",
    profile: "Profile",
    search: "Search",
    login: "Login",
    logout: "Logout",
    // Student Dashboard
    welcomeStudent: "Welcome, {name}! 👋",
    profileInfo: "Profile: {level} • {district} • Interested: {course} • {stream} • {percentage} • Hostel: {hostel} • Transport: {transport}",
    recentlyViewed: "Recently Viewed",
    recentlyViewedDesc: "Colleges you viewed",
    savedColleges: "Saved Colleges",
    savedCollegesDesc: "My saved list",
    compareList: "Compare List",
    compareListDesc: "For comparison",
    myEnquiries: "My Enquiries",
    myEnquiriesDesc: "With consent",
    recommendedForYou: "Recommended for You",
    basedOn: "Based on {course}",
    whyShown: "Why shown: Matches your selected {course}, {district}, {type} type, {level} level",
    viewAll: "View All →",
    recentlyViewedColleges: "Recently Viewed Colleges",
    clearHistory: "Clear History",
    view: "View",
    remove: "Remove",
    noSaved: "No saved colleges yet",
    saveHint: "Save colleges to see here - activity tracked securely",
    viewAllSaved: "View All Saved",
    yourActivity: "Your Activity - Securely Tracked",
    collegeViews: "College Views",
    courseViews: "Course Views",
    savedActivity: "Saved",
    enquiriesConsent: "Enquiries (with consent)",
    privacyNote: "🔒 Privacy: Your personal info NOT automatically shared to colleges when you view. Only when you click ENQUIRE NOW with consent, info shared. Activity tracked securely for recommendations.",
    navigation: "Navigation",
    exploreCollegesNav: "Explore Colleges",
    coursesNav: "Courses",
    compareNav: "Compare",
    myEnquiriesNav: "My Enquiries",
    // Search
    searchColleges: "Search Colleges",
    filters: "Filters",
    district: "District",
    course: "Course",
    collegeType: "College Type",
    // College Card
    save: "Save",
    compareBtn: "Compare",
    viewDetails: "View Details",
    verified: "Verified",
    placement: "Placement",
    // Language Toggle
    language: "Language",
    english: "English",
    tamil: "தமிழ்",
    tamilEnglishToggle: "தமிழ் / English",
    // Student specific
    profileComplete: "Profile 100% Complete",
    topCollegesForYou: "Top Colleges for Your {percentage}%",
    originalDocs: "Original Documents",
    autoPercentage: "Auto Percentage",
    dreamCourse: "Dream Course - What you want to study",
    // Home
    homeTitle: "Discover Your Dream College in Tamil Nadu",
    homeSubtitle: "Across all districts - Premium trusted platform",
    // General
    allDistricts: "All Districts - TN",
    home: "Home",
    courses: "Courses"
  },
  ta: {
    welcome: "வரவேற்கிறோம்",
    student: "மாணவர்",
    dashboard: "டாஷ்போர்டு",
    explore: "கல்லூரிகளை ஆராயுங்கள்",
    saved: "சேமித்தவை",
    compare: "ஒப்பிடுக",
    enquiries: "விசாரணைகள்",
    profile: "சுயவிவரம்",
    search: "தேடு",
    login: "உள்நுழை",
    logout: "வெளியேறு",
    welcomeStudent: "வரவேற்கிறோம், {name}! 👋",
    profileInfo: "சுயவிவரம்: {level} • {district} • ஆர்வம்: {course} • {stream} • {percentage} • விடுதி: {hostel} • போக்குவரத்து: {transport}",
    recentlyViewed: "சமீபத்தில் பார்த்தவை",
    recentlyViewedDesc: "நீங்கள் பார்த்த கல்லூரிகள்",
    savedColleges: "சேமித்த கல்லூரிகள்",
    savedCollegesDesc: "எனது சேமிப்பு பட்டியல்",
    compareList: "ஒப்பீட்டு பட்டியல்",
    compareListDesc: "ஒப்பிடுவதற்கு",
    myEnquiries: "எனது விசாரணைகள்",
    myEnquiriesDesc: "ஒப்புதலுடன்",
    recommendedForYou: "உங்களுக்கு பரிந்துரைக்கப்பட்டவை",
    basedOn: "{course} அடிப்படையில்",
    whyShown: "ஏன் காட்டப்பட்டது: நீங்கள் தேர்ந்தெடுத்த {course}, {district}, {type} வகை, {level} நிலைக்கு பொருந்துகிறது",
    viewAll: "அனைத்தையும் பார் →",
    recentlyViewedColleges: "சமீபத்தில் பார்த்த கல்லூரிகள்",
    clearHistory: "வரலாற்றை அழி",
    view: "பார்",
    remove: "நீக்கு",
    noSaved: "இன்னும் சேமிக்கப்பட்ட கல்லூரிகள் இல்லை",
    saveHint: "இங்கே பார்க்க கல்லூரிகளை சேமிக்கவும் - செயல்பாடு பாதுகாப்பாக கண்காணிக்கப்படுகிறது",
    viewAllSaved: "சேமித்த அனைத்தையும் பார்",
    yourActivity: "உங்கள் செயல்பாடு - பாதுகாப்பாக கண்காணிக்கப்படுகிறது",
    collegeViews: "கல்லூரி பார்வைகள்",
    courseViews: "பாட பார்வைகள்",
    savedActivity: "சேமித்தவை",
    enquiriesConsent: "விசாரணைகள் (ஒப்புதலுடன்)",
    privacyNote: "🔒 தனியுரிமை: நீங்கள் பார்க்கும்போது உங்கள் தனிப்பட்ட தகவல் கல்லூரிகளுக்கு தானாக பகிரப்படாது. நீங்கள் ஒப்புதலுடன் ENQUIRE NOW கிளிக் செய்யும்போது மட்டுமே தகவல் பகிரப்படும்.",
    navigation: "வழிசெலுத்தல்",
    exploreCollegesNav: "கல்லூரிகளை ஆராயுங்கள்",
    coursesNav: "பாடங்கள்",
    compareNav: "ஒப்பிடுக",
    myEnquiriesNav: "எனது விசாரணைகள்",
    searchColleges: "கல்லூரிகளை தேடுங்கள்",
    filters: "வடிகட்டிகள்",
    district: "மாவட்டம்",
    course: "பாடம்",
    collegeType: "கல்லூரி வகை",
    save: "சேமி",
    compareBtn: "ஒப்பிடு",
    viewDetails: "விவரங்களை பார்",
    verified: "சரிபார்க்கப்பட்டது",
    placement: "வேலைவாய்ப்பு",
    language: "மொழி",
    english: "English",
    tamil: "தமிழ்",
    tamilEnglishToggle: "தமிழ் / English",
    profileComplete: "சுயவிவரம் 100% முடிந்தது",
    topCollegesForYou: "உங்கள் {percentage}% க்கான சிறந்த கல்லூரிகள்",
    originalDocs: "அசல் ஆவணங்கள்",
    autoPercentage: "தானியங்கி சதவீதம்",
    dreamCourse: "கனவு பாடம் - நீங்கள் என்ன படிக்க விரும்புகிறீர்கள்",
    homeTitle: "தமிழ்நாட்டில் உங்கள் கனவு கல்லூரியை கண்டறியுங்கள்",
    homeSubtitle: "அனைத்து மாவட்டங்களிலும் - பிரீமியம் நம்பகமான தளம்",
    allDistricts: "அனைத்து மாவட்டங்களும் - தமிழ்நாடு",
    home: "முகப்பு",
    courses: "பாடங்கள்"
  }
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('tn_student_language') || 'en'
    } catch {
      return 'en'
    }
  })

  const setLanguage = (lang) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('tn_student_language', lang)
    } catch {}
  }

  const t = (key, params = {}) => {
    const langPack = translations[language] || translations.en
    let text = langPack[key] || translations.en[key] || key
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v)
    })
    return text
  }

  // Check if current user is student - only for student we enable toggle UI, but translation works for all
  const [isStudent, setIsStudent] = useState(false)
  useEffect(() => {
    const checkStudent = () => {
      try {
        const s = localStorage.getItem('tn_current_student')
        setIsStudent(!!s)
      } catch {
        setIsStudent(false)
      }
    }
    checkStudent()
    window.addEventListener('storage', checkStudent)
    const interval = setInterval(checkStudent, 1000)
    return () => {
      window.removeEventListener('storage', checkStudent)
      clearInterval(interval)
    }
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isStudent, translations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
