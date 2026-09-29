import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Check, GraduationCap, MapPin, BookOpen, Home, User, Mail, Phone, Lock, School, Award, Heart, Calendar, Users, FileText, Upload, Star, Trophy, TrendingUp, BadgeCheck, Building, Briefcase, IdCard, X, Calculator, Sparkles } from 'lucide-react'
import { getPublicColleges } from '../../lib/collegeStorage'
import { useLanguage } from '../../lib/languageContext'
import { StudentLanguageToggleAlways } from '../../components/student/LanguageToggle'

import { districts } from '../../lib/colleges'

const tamilNaduUniversities = [
  'Anna University', 'Bharathiar University', 'Bharathidasan University', 'University of Madras',
  'Madurai Kamaraj University', 'Alagappa University', 'Manonmaniam Sundaranar University',
  'Periyar University', 'Thiruvalluvar University', 'Annamalai University', 'Tamil Nadu Agricultural University',
  'Tamil Nadu Dr. M.G.R. Medical University', 'Tamil Nadu Teachers Education University',
  'Tamil Nadu Open University', 'Tamil University', 'Central University of Tamil Nadu',
  'SRM Institute of Science and Technology', 'Vellore Institute of Technology', 'SASTRA Deemed University',
  'Hindustan Institute of Technology and Science', 'Kalasalingam Academy of Research and Education',
  'Karunya Institute of Technology and Sciences', 'Amrita Vishwa Vidyapeetham'
]

const districtDirectory = {
  Coimbatore: { schools: ['PSG Sarvajana Higher Secondary School', 'Bharathi Matriculation Higher Secondary School', 'SBOA Matriculation and Higher Secondary School', 'Sri Ramakrishna Matriculation Higher Secondary School', 'Chinmaya Vidyalaya, Coimbatore', 'Kendriya Vidyalaya, Coimbatore', 'CS Academy, Coimbatore', 'SSVM World School', 'The Indian Public School, Coimbatore', 'Stanes Anglo Indian Higher Secondary School', 'Bharatiya Vidya Bhavan, Coimbatore', 'Manchester International School', 'Lisieux CMI International School', 'National Model Matriculation Higher Secondary School', 'Sri Ramakrishna Vidyalaya Matriculation Higher Secondary School'], colleges: ['PSG College of Technology', 'Coimbatore Institute of Technology', 'Kumaraguru College of Technology', 'Government College of Technology, Coimbatore', 'Sri Krishna College of Technology', 'Sri Krishna College of Engineering and Technology', 'Sri Ramakrishna Engineering College', 'Sri Ramakrishna Institute of Technology', 'PSG College of Arts & Science', 'Sri Krishna Arts and Science College', 'Hindusthan College of Engineering and Technology', 'Hindusthan College of Arts and Science', 'Rathinam College of Engineering and Technology', 'Karpagam College of Engineering', 'Karpagam Institute of Technology', 'SNS College of Technology', 'SNS College of Engineering', 'Nehru Institute of Engineering and Technology', 'Dr. N.G.P. Institute of Technology', 'Adithya Institute of Technology', 'Info Institute of Engineering', 'Park College of Engineering Technology', 'Karunya Institute of Technology and Sciences', 'Avinashilingam Institute for Home Science and Higher Education for Women', 'Government Arts College, Coimbatore', 'Kongunadu Arts and Science College', 'CMS College of Science and Commerce', 'Sri Ramakrishna Mission Vidyalaya College of Arts and Science', 'Amrita Vishwa Vidyapeetham, Coimbatore', 'Tamil Nadu Agricultural University, Coimbatore', 'Coimbatore Medical College', 'PSG Institute of Medical Sciences and Research', 'KMCH Institute of Health Sciences'] },
  Chennai: { schools: ['PSBB Senior Secondary School', 'DAV Boys Senior Secondary School', 'SBOA School and Junior College', 'Chettinad Vidyashram', 'The Hindu Senior Secondary School', 'Kendriya Vidyalaya, IIT Madras'], colleges: ['Anna University, Chennai', 'Madras Institute of Technology', 'Loyola College, Chennai', 'Madras Christian College', 'Stella Maris College, Chennai', 'Presidency College, Chennai', 'SSN College of Engineering', 'Sathyabama Institute of Science and Technology', 'Stanley Medical College, Chennai'] },
  Madurai: { schools: ['TVS Matriculation Higher Secondary School', 'Velammal Matriculation Higher Secondary School', 'SBOA Matriculation Higher Secondary School, Madurai', 'Kendriya Vidyalaya, Madurai'], colleges: ['Thiagarajar College of Engineering, Madurai', 'Madurai Kamaraj University', 'The Madura College', 'American College, Madurai'] },
  Tiruchirappalli: { schools: ['Campion Anglo-Indian Higher Secondary School', 'Montfort School, Tiruchirappalli', 'Kendriya Vidyalaya, Tiruchirappalli', 'RSK Higher Secondary School'], colleges: ['Bishop Heber College, Tiruchirappalli', 'National College, Tiruchirappalli', 'Bharathidasan University, Tiruchirappalli', 'Government College of Engineering, Tiruchirappalli'] },
  Salem: { schools: ['Montfort Anglo Indian Higher Secondary School', 'Holy Angels Matriculation Higher Secondary School', 'Kendriya Vidyalaya, Salem'], colleges: ['Government College of Engineering, Salem', 'Periyar University, Salem', 'Sona College of Technology, Salem', 'Sri Sarada College for Women, Salem'] },
  Tirunelveli: { schools: ['St. Johns Matriculation Higher Secondary School, Tirunelveli', 'Kendriya Vidyalaya, Tirunelveli'], colleges: ['Manonmaniam Sundaranar University, Tirunelveli', 'Government College of Engineering, Tirunelveli', 'St. Xavier’s College, Palayamkottai'] },
  Erode: { schools: ['Bharathi Matriculation Higher Secondary School, Erode', 'Vivekananda Matriculation Higher Secondary School, Erode'], colleges: ['Kongu Engineering College, Erode', 'Erode Sengunthar Engineering College', 'Bannari Amman Institute of Technology, Sathyamangalam'] },
  Vellore: { schools: ['Vellore Central School', 'Kendriya Vidyalaya, Vellore'], colleges: ['Vellore Institute of Technology', 'Christian Medical College, Vellore', 'Voorhees College, Vellore'] },
  Ariyalur: { schools: ['Government Higher Secondary School, Ariyalur', 'Kendriya Vidyalaya, Ariyalur'], colleges: [] },
  Chengalpattu: { schools: ['Government Higher Secondary School, Chengalpattu', 'Kendriya Vidyalaya, Chengalpattu'], colleges: [] },
  Cuddalore: { schools: ['St. Joseph’s Higher Secondary School, Cuddalore', 'Government Higher Secondary School, Cuddalore'], colleges: [] },
  Dharmapuri: { schools: ['Sri Vijay Vidyalaya, Dharmapuri', 'Government Higher Secondary School, Dharmapuri'], colleges: [] },
  Dindigul: { schools: ['St. Mary’s Higher Secondary School, Dindigul', 'Government Higher Secondary School, Dindigul'], colleges: [] },
  Kallakurichi: { schools: ['Government Higher Secondary School, Kallakurichi', 'Kendriya Vidyalaya, Kallakurichi'], colleges: [] },
  Kancheepuram: { schools: ['Sri Sankara Global Academy, Kanchipuram', 'Government Higher Secondary School, Kanchipuram'], colleges: [] },
  Kanniyakumari: { schools: ['St. Joseph’s Convent Higher Secondary School, Nagercoil', 'Government Higher Secondary School, Nagercoil'], colleges: [] },
  Karur: { schools: ['Cheran Matriculation Higher Secondary School, Karur', 'Government Higher Secondary School, Karur'], colleges: [] },
  Krishnagiri: { schools: ['Adhiyamaan Matriculation Higher Secondary School, Hosur', 'Maharishi Vidya Mandir, Hosur'], colleges: [] },
  Mayiladuthurai: { schools: ['Government Higher Secondary School, Mayiladuthurai', 'Kendriya Vidyalaya, Mayiladuthurai'], colleges: [] },
  Nagapattinam: { schools: ['Government Higher Secondary School, Nagapattinam', 'Kendriya Vidyalaya, Nagapattinam'], colleges: [] },
  Namakkal: { schools: ['K.S.R. Matriculation Higher Secondary School, Tiruchengode', 'Government Higher Secondary School, Namakkal'], colleges: [] },
  Nilgiris: { schools: ['Good Shepherd International School, Ooty', 'Kendriya Vidyalaya, Ooty'], colleges: [] },
  Perambalur: { schools: ['Government Higher Secondary School, Perambalur', 'Kendriya Vidyalaya, Perambalur'], colleges: [] },
  Pudukkottai: { schools: ['Government Higher Secondary School, Pudukkottai', 'Kendriya Vidyalaya, Pudukkottai'], colleges: [] },
  Ramanathapuram: { schools: ['Government Higher Secondary School, Ramanathapuram', 'Kendriya Vidyalaya, Ramanathapuram'], colleges: [] },
  Ranipet: { schools: ['Government Higher Secondary School, Ranipet', 'Kendriya Vidyalaya, Ranipet'], colleges: [] },
  Sivaganga: { schools: ['Chettinad Public School, Sivaganga', 'Government Higher Secondary School, Sivaganga'], colleges: [] },
  Tenkasi: { schools: ['Government Higher Secondary School, Tenkasi', 'Kendriya Vidyalaya, Tenkasi'], colleges: [] },
  Thanjavur: { schools: ['Sacred Heart Higher Secondary School, Thanjavur', 'Kendriya Vidyalaya, Thanjavur'], colleges: [] },
  Theni: { schools: ['Government Higher Secondary School, Theni', 'Kendriya Vidyalaya, Theni'], colleges: [] },
  Thoothukudi: { schools: ['Sakthi Vinayagar Hindu Vidyalaya, Thoothukudi', 'Government Higher Secondary School, Thoothukudi'], colleges: [] },
  Tirupathur: { schools: ['Government Higher Secondary School, Tirupathur', 'Kendriya Vidyalaya, Tirupathur'], colleges: [] },
  Tiruppur: { schools: ['Nanjappa Municipal Higher Secondary School, Tiruppur', 'Kendriya Vidyalaya, Tiruppur'], colleges: [] },
  Tiruvallur: { schools: ['Velammal New-Gen School, Tiruvallur', 'Kendriya Vidyalaya, Tiruvallur'], colleges: [] },
  Tiruvannamalai: { schools: ['Government Higher Secondary School, Tiruvannamalai', 'Kendriya Vidyalaya, Tiruvannamalai'], colleges: [] },
  Tiruvarur: { schools: ['Government Higher Secondary School, Tiruvarur', 'Kendriya Vidyalaya, Tiruvarur'], colleges: [] },
  Viluppuram: { schools: ['Government Higher Secondary School, Viluppuram', 'Kendriya Vidyalaya, Viluppuram'], colleges: [] },
  Virudhunagar: { schools: ['KVS Matriculation Higher Secondary School, Virudhunagar', 'Government Higher Secondary School, Virudhunagar'], colleges: [] }
}

const universityColleges = {
  'Anna University': ['PSG College of Technology', 'Coimbatore Institute of Technology', 'Government College of Technology, Coimbatore', 'Kumaraguru College of Technology', 'Sri Krishna College of Technology', 'Sri Krishna College of Engineering and Technology', 'Sri Ramakrishna Engineering College', 'Thiagarajar College of Engineering, Madurai', 'SSN College of Engineering', 'Rajalakshmi Engineering College', 'Sri Sairam Engineering College', 'Saveetha Engineering College', 'Velammal Engineering College', 'Government College of Engineering, Salem', 'Government College of Engineering, Tirunelveli'],
  'Bharathiar University': ['PSG College of Arts & Science', 'Sri Krishna Arts and Science College', 'Kongunadu Arts and Science College', 'Government Arts College, Coimbatore', 'CMS College of Science and Commerce', 'Sri Ramakrishna Mission Vidyalaya College of Arts and Science'],
  'Bharathidasan University': ['Bishop Heber College, Tiruchirappalli', 'National College, Tiruchirappalli', 'St. Joseph’s College, Tiruchirappalli', 'Bharathidasan University Constituent College'],
  'University of Madras': ['Loyola College, Chennai', 'Madras Christian College', 'Stella Maris College, Chennai', 'Presidency College, Chennai', 'Women’s Christian College, Chennai', 'The New College, Chennai'],
  'Madurai Kamaraj University': ['The American College, Madurai', 'Thiagarajar College, Madurai', 'The Madura College', 'Lady Doak College, Madurai'],
  'Alagappa University': ['Alagappa Government Arts College, Karaikudi', 'Kendriya Electrotechnical Institute, Karaikudi'],
  'Periyar University': ['Sona College of Technology, Salem', 'Government Arts College, Salem', 'Sri Sarada College for Women, Salem'],
  'Manonmaniam Sundaranar University': ['Government College of Engineering, Tirunelveli', 'St. Xavier’s College, Palayamkottai', 'Sarah Tucker College, Tirunelveli'],
  'Tamil Nadu Agricultural University': ['Agricultural College and Research Institute, Coimbatore', 'Agricultural College and Research Institute, Madurai', 'Anbil Dharmalingam Agricultural College, Tiruchirappalli'],
  'Tamil Nadu Dr. M.G.R. Medical University': ['Coimbatore Medical College', 'Stanley Medical College, Chennai', 'Madras Medical College', 'Christian Medical College, Vellore', 'Government Medical College, Omandurar'],
  'Vellore Institute of Technology': ['VIT, Vellore', 'VIT Chennai'],
  'SRM Institute of Science and Technology': ['SRM Institute of Science and Technology, Kattankulathur', 'SRM Institute of Science and Technology, Ramapuram'],
  'Amrita Vishwa Vidyapeetham': ['Amrita School of Engineering, Coimbatore', 'Amrita School of Medicine, Coimbatore']
}

const directorySuggestions = (district, type) => {
  const local = districtDirectory[district]?.[type] || []
  const fallback = type === 'schools' ? [`Government Higher Secondary School, ${district}`, `Government Girls Higher Secondary School, ${district}`, `Kendriya Vidyalaya, ${district}`] : [`Government Arts and Science College, ${district}`, `Government College of Engineering, ${district}`]
  return [...new Set([...local, ...fallback])]
}
export default function StudentSignup() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const { t, language } = useLanguage()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    district: 'Coimbatore',
    city: '',
    interestedCourse: 'B.E Computer Science',
    interestedSubject: 'Computer Science',
    careerGoal: '',
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    nationality: 'Indian',
    religion: 'Hindu',
    community: 'BC',
    caste: '',
    aadharNumber: '',
    fatherName: '',
    motherName: '',
    fatherOccupation: '',
    motherOccupation: '',
    parentMobile: '',
    alternateMobile: '',
    annualIncome: '',
    maritalStatus: 'Single',
    permanentAddress: '',
    pincode: '',
    state: 'Tamil Nadu',
    educationLevel: '12th',
    schoolCollege: '',
    university: 'Anna University',
    board: 'Tamil Nadu State Board',
    yearOfPassing: '2024',
    marksObtained: '',
    totalMarks: '',
    percentage: '',
    grade: '',
    cutoff: '',
    groupStream: 'Computer Science',
    medium: 'English',
    documents: {
      tenthMarksheet: null,
      twelfthMarksheet: null,
      tc: null,
      communityCertificate: null,
      incomeCertificate: null,
      aadharCard: null,
      photo: null,
      nativityCertificate: null,
      firstGraduateCertificate: null,
      specialReservation: null
    },
    documentNames: {
      tenthMarksheet: '',
      twelfthMarksheet: '',
      tc: '',
      communityCertificate: '',
      incomeCertificate: '',
      aadharCard: '',
      photo: '',
      nativityCertificate: '',
      firstGraduateCertificate: '',
      specialReservation: ''
    },
    preferredDistrict: 'Coimbatore',
    collegeType: 'Any',
    hostelRequired: 'No',
    transportRequired: 'No',
    budgetRange: '1-2 Lakhs',
    scholarshipNeeded: 'No'
  })

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))
  const updateDocName = (docKey, fileName) => setFormData(prev => ({
    ...prev,
    documentNames: { ...prev.documentNames, [docKey]: fileName },
    documents: { ...prev.documents, [docKey]: fileName ? { name: fileName, uploadedAt: new Date().toISOString() } : null }
  }))

  const calculatePercentage = (obtained, total) => {
    const obt = parseFloat(obtained)
    const tot = parseFloat(total)
    if (!isNaN(obt) && !isNaN(tot) && tot > 0) {
      const perc = (obt / tot) * 100
      const rounded = perc.toFixed(2)
      let grade = ''
      if (perc >= 90) grade = 'Outstanding - A+'
      else if (perc >= 80) grade = 'Excellent - A'
      else if (perc >= 70) grade = 'Very Good - B+'
      else if (perc >= 60) grade = 'Good - B'
      else if (perc >= 50) grade = 'Average - C'
      else grade = 'Pass'
      return { percentage: rounded, grade }
    }
    return { percentage: '', grade: '' }
  }

  const handleMarksChange = (field, value) => {
    const newData = { ...formData, [field]: value }
    if (field === 'marksObtained' || field === 'totalMarks') {
      const obt = field === 'marksObtained' ? value : formData.marksObtained
      const tot = field === 'totalMarks' ? value : formData.totalMarks
      const { percentage, grade } = calculatePercentage(obt, tot)
      newData.percentage = percentage
      newData.grade = grade
    }
    if (field === 'marksObtained' && value.includes('/')) {
      const parts = value.split('/')
      if (parts.length === 2) {
        const obt = parts[0].trim()
        const tot = parts[1].trim()
        const { percentage, grade } = calculatePercentage(obt, tot)
        newData.marksObtained = obt
        newData.totalMarks = tot
        newData.percentage = percentage
        newData.grade = grade
      }
    }
    setFormData(newData)
  }

  const handleEducationLevelChange = (level) => {
    let total = ''
    if (level === '10th') total = '500'
    else if (level === '12th') total = '600'
    else if (level === 'Diploma') total = '1000'
    else if (level === 'Undergraduate') total = '1000'
    else total = ''
    const newData = { ...formData, educationLevel: level, totalMarks: total }
    if (formData.marksObtained) {
      const { percentage, grade } = calculatePercentage(formData.marksObtained, total)
      newData.percentage = percentage
      newData.grade = grade
    }
    setFormData(newData)
  }

  const topCollegesByPercentage = useMemo(() => {
    const perc = parseFloat(formData.percentage) || 0
    let filtered = getPublicColleges()
    if (filtered.length===0) return []
    filtered = [...filtered].sort((a, b) => {
      const placeA = parseInt(a.placements?.percentage || 0)
      const placeB = parseInt(b.placements?.percentage || 0)
      if (placeB !== placeA) return placeB - placeA
      return (b.established||0) - (a.established||0)
    })
    if (perc >= 90) {
      return filtered.slice(0, 6).map(c => ({ ...c, eligibilityMatch: 'Excellent Match - 90%+ Eligible for Top Colleges', matchPercent: 95, reason: `Your ${perc}% is outstanding - You are eligible for ${c.shortName} top rated college with ${c.placements.percentage} placement` }))
    } else if (perc >= 80) {
      return filtered.slice(0, 6).map(c => ({ ...c, eligibilityMatch: 'Very Good Match - 80%+ Eligible', matchPercent: 85, reason: `Your ${perc}% is very good - ${c.shortName} recommends ${formData.interestedCourse} with ${c.placements.percentage} placement` }))
    } else if (perc >= 70) {
      return filtered.slice(0, 6).map(c => ({ ...c, eligibilityMatch: 'Good Match - 70%+ Eligible', matchPercent: 75, reason: `Your ${perc}% is good - ${c.shortName} has courses for your percentage - ${c.placements.percentage} placement` }))
    } else if (perc >= 60) {
      return filtered.slice(0, 6).map(c => ({ ...c, eligibilityMatch: 'Eligible - 60%+ Colleges', matchPercent: 65, reason: `Your ${perc}% - You can apply to ${c.shortName} - ${c.placements.percentage} placement, scholarship available` }))
    } else if (perc > 0) {
      return filtered.slice(0, 6).map(c => ({ ...c, eligibilityMatch: 'Eligible - Apply with counselling', matchPercent: 55, reason: `Your ${perc}% - Don't worry, ${c.shortName} has options - Contact admission` }))
    }
    return filtered.slice(0, 4).map(c => ({ ...c, eligibilityMatch: 'Top Rated Colleges in Tamil Nadu', matchPercent: 80, reason: `${c.shortName} - ${c.placements.percentage} placement - ${c.accreditation}` }))
  }, [formData.percentage, formData.interestedCourse])

  const handleSubmit = () => {
    const student = {
      id: Date.now(),
      ...formData,
      role: 'STUDENT',
      profileCompletion: 100,
      marks: `${formData.marksObtained}/${formData.totalMarks}`,
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      district: formData.district,
      city: formData.city,
      educationLevel: formData.educationLevel,
      schoolCollege: formData.schoolCollege,
      groupStream: formData.groupStream,
      interestedCourse: formData.interestedCourse,
      interestedSubject: formData.interestedSubject,
      preferredDistrict: formData.preferredDistrict,
      collegeType: formData.collegeType,
      hostelRequired: formData.hostelRequired,
      transportRequired: formData.transportRequired,
      documentsUploaded: Object.keys(formData.documentNames).filter(k => formData.documentNames[k]).length,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('tn_current_student', JSON.stringify(student))
    const students = JSON.parse(localStorage.getItem('tn_students') || '[]')
    students.push(student)
    localStorage.setItem('tn_students', JSON.stringify(students))
    localStorage.setItem(`tn_student_docs_${student.id}`, JSON.stringify(formData.documentNames))
    navigate('/student/dashboard')
  }

  const steps = [
    { id: 1, title: language==='ta' ? 'அடிப்படை & கனவு பாடம்' : 'Basic & Dream Course', icon: Heart, desc: language==='ta' ? 'பெயர், மின்னஞ்சல், கைபேசி, மாவட்டம், நகரம், அதற்கு கீழே கனவு பாடம்' : 'Name, Email, Mobile, District, City, Below City Dream Course' },
    { id: 2, title: language==='ta' ? 'தனிப்பட்ட & குடும்ப விவரங்கள்' : 'Personal & Family Details', icon: Users, desc: 'DOB, Gender, Parents, Aadhar, Address' },
    { id: 3, title: language==='ta' ? 'கல்வி & ஆவணங்கள்' : 'Education & Documents', icon: FileText, desc: 'Marks Auto %, Percentage, Original Documents' },
    { id: 4, title: language==='ta' ? 'விருப்பங்கள் & சிறந்த கல்லூரிகள்' : 'Preferences & Top Colleges', icon: Trophy, desc: 'Your % ku etha top colleges' },
    { id: 5, title: language==='ta' ? 'சரிபார்ப்பு & சமர்ப்பி' : 'Review & Submit', icon: BadgeCheck, desc: 'Verify all info and create account' }
  ]

  return (
    <div className="min-h-screen bg-[#E8E2DB] flex">
      <div className="hidden lg:flex w-[440px] bg-[#1A3263] text-white p-8 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#FAB95B] via-[#547792] to-[#E8E2DB]" />
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-[14px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold text-[22px]">T</div>
            <div>
              <div className="font-display font-bold text-[18px]">Tamil Nadu Colleges</div>
              <div className="text-[11px] tracking-widest uppercase text-[#FAB95B]">{language==='ta' ? 'மாணவர் பதிவு - கல்வி விருப்பம்' : 'Student Sign Up • Academic Interest'}</div>
            </div>
          </div>

          <div className="mt-10">
            <h1 className="font-display text-[28px] font-bold leading-[0.95]">{language==='ta' ? 'உங்கள் கல்வி விருப்பம்' : 'Your Academic Interest'}</h1>
            <p className="mt-4 text-[13px] leading-[1.6] text-[#E8E2DB]/70">{language==='ta' ? 'நீங்கள் என்ன படிக்க விரும்புகிறீர்கள்? உங்கள் நகரம் மற்றும் பாட விருப்பத்தைப் பயன்படுத்தி பொருத்தமான கல்லூரிகளைக் காட்டுவோம்.' : 'What would you like to study? We’ll use your city and course interest to show relevant colleges.'}</p>
          </div>

          <div className="mt-8 space-y-3">
            {steps.map(s => (
              <div key={s.id} className={`flex gap-3 p-3 rounded-[14px] border transition-all ${step===s.id?'bg-white/10 border-[#FAB95B]/50':'bg-white/5 border-white/10 opacity-60'}`}>
                <div className={`h-9 w-9 rounded-[10px] grid place-items-center shrink-0 ${step===s.id?'bg-[#FAB95B] text-[#1A3263]': step>s.id ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white'}`}>
                  {step>s.id ? <Check size={16} /> : <s.icon size={16} />}
                </div>
                <div>
                  <div className="font-semibold text-[12px] flex items-center gap-2">Step {s.id}: {s.title} {step>s.id && <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500 text-white">Done</span>}</div>
                  <div className="text-[10px] text-white/60 mt-1 leading-[1.3]">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {formData.percentage && (
            <div className="mt-6 rounded-[16px] bg-[#FAB95B] text-[#1A3263] p-4">
              <div className="flex items-center gap-2 font-bold text-[13px]"><Calculator size={16} /> Auto Percentage: {formData.percentage}%</div>
              <div className="text-[11px] mt-1">{formData.grade} - {formData.marksObtained}/{formData.totalMarks}</div>
              <div className="text-[10px] mt-2 font-bold">Top Colleges for {formData.percentage}%:</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {topCollegesByPercentage.slice(0,3).map(c=>(
                  <span key={c.id} className="px-2 py-0.5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[9px] font-bold">{c.shortName} {c.placements.percentage}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="text-[10px] text-white/40">City → Dream Course Below • Tamil / English</div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-[64px] border-b-2 border-[#1A3263]/10 bg-white/80 backdrop-blur px-6 lg:px-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="lg:hidden h-9 w-9 rounded-[10px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-bold">T</div>
            <div className="hidden lg:flex items-center gap-3 text-[12px]">
              <span className="text-[#547792]">Step {step} of 5</span>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i=>(
                  <div key={i} className={`h-2 w-10 rounded-full transition-all ${i===step?'bg-[#1A3263] w-14': i<step?'bg-[#FAB95B]':'bg-[#E8E2DB] border'}`} />
                ))}
              </div>
              <div className="ml-3 flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#547792]"> City → Dream Course Below:</span>
                <StudentLanguageToggleAlways variant="pill" />
              </div>
            </div>
            <span className="lg:hidden font-bold text-[#1A3263] text-[13px] flex items-center gap-2">Step {step}: {steps[step-1].title} <StudentLanguageToggleAlways variant="compact" /></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex"><StudentLanguageToggleAlways variant="pill" /></div>
            <Link to="/login" className="text-[12px] font-semibold text-[#1A3263]">Have account? <span className="text-[#FAB95B] bg-[#1A3263] px-3 py-1 rounded-full ml-1">Login</span></Link>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-[760px] mx-auto">

            {step===1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[24px] font-bold text-[#1A3263] flex items-center gap-2"><Heart size={22} className="text-[#FAB95B]" /> {language==='ta' ? 'அடிப்படை தகவல் - உங்கள் கல்வி விருப்பம்' : 'Basic Information - Your Academic Interest'}</h2>
                  <p className="text-[12px] text-[#547792] mt-1">{language==='ta' ? 'நீங்கள் என்ன படிக்க விரும்புகிறீர்கள்? உங்கள் நகரம் மற்றும் பாட விருப்பத்தைப் பயன்படுத்தி பொருத்தமான கல்லூரிகளைக் காட்டுவோம்.' : 'What would you like to study? We’ll use your city and course interest to show relevant colleges.'}</p>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-5">
                  <div>
                    <div className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5 mb-3"><User size={12} className="text-[#FAB95B]" /> {language==='ta' ? 'அடிப்படை தகவல்' : 'Basic Information'}</div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><User size={12} className="text-[#FAB95B]" /> {t('fullName')} * - {t('asPerAadhar')}</label>
                        <input value={formData.fullName} onChange={e=>updateField('fullName', e.target.value)} placeholder={language==='ta' ? 'ஆதார் படி முழு பெயர்' : 'Enter full name as per Aadhar'} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px] text-[#1A3263]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Mail size={12} className="text-[#FAB95B]" /> {t('email')} *</label>
                        <input type="email" value={formData.email} onChange={e=>updateField('email', e.target.value)} placeholder="student@email.com" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Phone size={12} className="text-[#FAB95B]" /> {t('mobile')} *</label>
                        <input value={formData.mobile} onChange={e=>updateField('mobile', e.target.value)} placeholder="+91 98765 43210" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Lock size={12} className="text-[#FAB95B]" /> {t('password')} *</label>
                        <input type="password" value={formData.password} onChange={e=>updateField('password', e.target.value)} placeholder={language==='ta' ? 'வலுவான கடவுச்சொல்' : 'Strong password'} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><MapPin size={12} className="text-[#FAB95B]" /> {t('district')} *</label>
                        <select value={formData.district} onChange={e=>updateField('district', e.target.value)} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px] font-medium">
                          {districts.map(item => <option key={item}>{item}</option>)}<option>Tirunelveli</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><MapPin size={12} className="text-[#FAB95B]" /> {t('city')} *</label>
                        <input value={formData.city} onChange={e=>updateField('city', e.target.value)} placeholder={language==='ta' ? 'நகரத்தை உள்ளிடவும்' : 'Enter city'} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px] border-b-4 border-b-[#FAB95B]" />
                        <div className="text-[10px] text-[#FAB95B] font-bold mt-1">↓ {language==='ta' ? 'City க்கு கீழே கனவு பாடம்' : 'Below City - Dream Course'} ↓</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[16px] bg-[#FAB95B]/10 border-2 border-[#FAB95B]/40 p-5">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-[#1A3263]"><Sparkles size={16} className="text-[#FAB95B]" /> {language==='ta' ? 'என்ன படிக்க ஆசைப்படுகிறாய்? - கனவு பாடம் - City க்கு கீழே' : 'What do you want to study? - Dream Course - Below City'} <span className="px-2 py-0.5 rounded-full bg-[#FAB95B] text-[#1A3263] text-[10px]">{language==='ta' ? 'City க்கு கீழே' : 'Below City'} *</span></div>
                    <div className="text-[11px] text-[#547792] mt-1">{language==='ta' ? 'நீங்கள் என்ன படிக்க விரும்புகிறீர்கள்? உங்கள் நகரம் மற்றும் பாட விருப்பத்தைப் பயன்படுத்தி பொருத்தமான கல்லூரிகளைக் காட்டுவோம்.' : 'What would you like to study? We’ll use your city and course interest to show relevant colleges.'}</div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="md:col-span-2">
                        <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><BookOpen size={12} className="text-[#FAB95B]" /> {language==='ta' ? 'ஆர்வமுள்ள பாடம் - என்ன படிக்க ஆசைப்படுகிறாய்?' : 'Interested Course - What do you want to study?'} *</label>
                        <select value={formData.interestedCourse} onChange={e=>updateField('interestedCourse', e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-white border-2 border-[#FAB95B] focus:border-[#1A3263] outline-none text-[13px] font-bold text-[#1A3263] shadow-sm">
                          <option>B.E Computer Science</option><option>B.Tech AI & Data Science</option><option>B.E CSE AI & ML</option><option>B.Tech Information Technology</option><option>B.E Electronics and Communication</option><option>B.E Mechanical</option><option>B.E Civil</option><option>BCA</option><option>B.Sc Computer Science</option><option>B.Com</option><option>BBA</option><option>MBBS</option><option>MBA</option><option>B.Sc Nursing</option><option>LLB</option>
                        </select>
                        <div className="text-[10px] text-[#1A3263] font-bold mt-1 bg-[#FAB95B]/20 px-2 py-1 rounded-full inline-flex"> City ({formData.city || 'Your City'}) → Dream Course: {formData.interestedCourse}</div>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263]">{language==='ta' ? 'ஆர்வமுள்ள பாடம் / பிரிவு' : 'Interested Subject / Stream'}</label>
                        <input value={formData.interestedSubject} onChange={e=>updateField('interestedSubject', e.target.value)} placeholder={language==='ta' ? 'கணினி அறிவியல், உயிரியல்' : 'Computer Science, Biology'} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#1A3263] outline-none text-[13px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-[#1A3263]">{language==='ta' ? 'தொழில் இலக்கு - என்ன ஆக வேண்டும்?' : 'Career Goal - What you want to become?'}</label>
                        <input value={formData.careerGoal} onChange={e=>updateField('careerGoal', e.target.value)} placeholder={language==='ta' ? 'மென்பொருள் பொறியாளர், மருத்துவர்' : 'Software Engineer, Doctor'} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#E8E2DB] focus:border-[#1A3263] outline-none text-[13px]" />
                      </div>
                    </div>

                  </div>
                </div>

                <button onClick={()=>setStep(2)} disabled={!formData.fullName || !formData.email || !formData.mobile || !formData.city || !formData.interestedCourse} className="w-full h-12 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#1A3263]/90 disabled:opacity-50">
                  {language==='ta' ? `தொடர்க - ${formData.city} → ${formData.interestedCourse}` : `Continue - ${formData.city || 'City'} → ${formData.interestedCourse}`} <ArrowRight size={18} />
                </button>
                <div className="text-[11px] text-center text-[#547792]"> {language==='ta' ? 'Flow: பெயர் → மின்னஞ்சல் → கைபேசி → கடவுச்சொல் → மாவட்டம் → நகரம் → அதற்கு கீழே கனவு பாடம்' : 'Flow: Name → Email → Mobile → Password → District → City → Immediately Below City Dream Course'}</div>
              </div>
            )}

            {step===2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Users size={20} className="text-[#FAB95B]" /> {language==='ta' ? 'தனிப்பட்ட & குடும்ப விவரங்கள்' : 'Personal & Family Details'}</h2>
                  <p className="text-[11px] text-[#547792] mt-1">{language==='ta' ? 'முழு தகவல் - வேறு என்ன தகவல் வேண்டுமோ அது' : 'Complete profile - Full information'}</p>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-5">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263] flex items-center gap-1"><Calendar size={10} className="text-[#FAB95B]" /> {t('dob')} *</label>
                      <input type="date" value={formData.dob} onChange={e=>updateField('dob', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('gender')} *</label>
                      <select value={formData.gender} onChange={e=>updateField('gender', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>{t('male')}</option><option>{t('female')}</option><option>{t('other')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('bloodGroup')}</label>
                      <select value={formData.bloodGroup} onChange={e=>updateField('bloodGroup', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('nationality')}</label>
                      <input value={formData.nationality} onChange={e=>updateField('nationality', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('religion')}</label>
                      <select value={formData.religion} onChange={e=>updateField('religion', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Hindu</option><option>Muslim</option><option>Christian</option><option>Sikh</option><option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('community')} *</label>
                      <select value={formData.community} onChange={e=>updateField('community', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>OC</option><option>BC</option><option>BCM</option><option>MBC</option><option>DNC</option><option>SC</option><option>SCA</option><option>ST</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('caste')}</label>
                      <input value={formData.caste} onChange={e=>updateField('caste', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263] flex items-center gap-1"><IdCard size={10} className="text-[#FAB95B]" /> {t('aadharNumber')} *</label>
                      <input value={formData.aadharNumber} onChange={e=>updateField('aadharNumber', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('annualIncome')}</label>
                      <select value={formData.annualIncome} onChange={e=>updateField('annualIncome', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Below 1 Lakh</option><option>1-2 Lakhs</option><option>2-5 Lakhs</option><option>5-8 Lakhs</option><option>Above 8 Lakhs</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E2DB]">
                    <div className="text-[11px] font-bold text-[#1A3263] flex items-center gap-1.5"><Users size={12} className="text-[#FAB95B]" /> {t('familyInfo')}</div>
                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('fatherName')} *</label>
                        <input value={formData.fatherName} onChange={e=>updateField('fatherName', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('motherName')} *</label>
                        <input value={formData.motherName} onChange={e=>updateField('motherName', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('fatherOccupation')}</label>
                        <input value={formData.fatherOccupation} onChange={e=>updateField('fatherOccupation', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('motherOccupation')}</label>
                        <input value={formData.motherOccupation} onChange={e=>updateField('motherOccupation', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('parentMobile')} *</label>
                        <input value={formData.parentMobile} onChange={e=>updateField('parentMobile', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('alternateMobile')}</label>
                        <input value={formData.alternateMobile} onChange={e=>updateField('alternateMobile', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E2DB]">
                    <div className="text-[11px] font-bold text-[#1A3263] flex items-center gap-1.5"><Home size={12} className="text-[#FAB95B]" /> {t('addressInfo')}</div>
                    <div className="grid md:grid-cols-3 gap-4 mt-3">
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('permanentAddress')} *</label>
                        <input value={formData.permanentAddress} onChange={e=>updateField('permanentAddress', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('pincode')} *</label>
                        <input value={formData.pincode} onChange={e=>updateField('pincode', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={()=>setStep(1)} className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-semibold text-[12px] flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
                  <button onClick={()=>setStep(3)} className="flex-1 h-11 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center justify-center gap-2">Continue to Education & Docs <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {step===3 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><FileText size={20} className="text-[#FAB95B]" /> {language==='ta' ? 'கல்வி & அசல் ஆவணங்கள்' : 'Education & Original Documents'}</h2>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><GraduationCap size={12} className="text-[#FAB95B]" /> {t('educationLevel')} *</label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {['10th','12th','Diploma','Undergraduate','Postgraduate'].map(level=>(
                          <button key={level} onClick={()=>handleEducationLevelChange(level)} className={`h-10 rounded-[10px] border-2 text-[11px] font-semibold transition-all ${formData.educationLevel===level?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B]'}`}>{level}</button>
                        ))}
                      </div>
                    </div>
                    {['10th', '12th'].includes(formData.educationLevel) ? (
                      <>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('board')}</label>
                          <select value={formData.board} onChange={e=>updateField('board', e.target.value)} className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                            <option>Tamil Nadu State Board</option><option>CBSE</option><option>ICSE</option><option>ISC</option><option>NIOS</option><option>Anglo-Indian Board</option><option>Matriculation</option><option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><School size={12} className="text-[#FAB95B]" /> School Name *</label>
                          <input list="tn-schools" value={formData.schoolCollege} onChange={e=>updateField('schoolCollege', e.target.value)} placeholder="Search or enter school name" className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#1A3263]">University / Institution *</label>
                          <select value={formData.university} onChange={e=>updateField('university', e.target.value)} className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                            {tamilNaduUniversities.map(university => <option key={university}>{university}</option>)}
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><School size={12} className="text-[#FAB95B]" /> College Name *</label>
                          <input list="tn-colleges" value={formData.schoolCollege} onChange={e=>updateField('schoolCollege', e.target.value)} placeholder="Search or enter college name" className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                        </div>
                      </>
                    )}
                    <datalist id="tn-schools">
                      {directorySuggestions(formData.district, 'schools').map(school => <option key={school} value={school} />)}
                    </datalist>
                    <datalist id="tn-colleges">
                      {[...(universityColleges[formData.university] || []), ...directorySuggestions(formData.district, 'colleges'), ...tamilNaduUniversities].filter((institution, index, all) => all.indexOf(institution) === index).map(institution => <option key={institution} value={institution} />)}
                    </datalist>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('yearOfPassing')}</label>
                      <select value={formData.yearOfPassing} onChange={e=>updateField('yearOfPassing', e.target.value)} className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        {Array.from({ length: 27 }, (_, index) => String(2026 - index)).map(year => <option key={year}>{year}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="rounded-[16px] bg-[#1A3263] text-white p-5">
                    <div className="flex items-center gap-2 font-bold text-[13px] text-[#FAB95B]"><Calculator size={16} /> {t('marksAuto')}</div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">{t('marksObtained')} *</label>
                        <input value={formData.marksObtained} onChange={e=>handleMarksChange('marksObtained', e.target.value)} placeholder="540 or 450/500" className="mt-1 w-full h-11 px-3 rounded-[10px] bg-white text-[#1A3263] border-2 border-[#FAB95B] outline-none text-[13px] font-bold" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">{t('totalMarks')} * {formData.totalMarks ? `- ${formData.educationLevel} = ${formData.totalMarks}` : ''}</label>
                        <input value={formData.totalMarks} onChange={e=>handleMarksChange('totalMarks', e.target.value)} className="mt-1 w-full h-11 px-3 rounded-[10px] bg-white text-[#1A3263] border-2 border-[#FAB95B] outline-none text-[13px] font-bold" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">{t('percentage')} %</label>
                        <div className="mt-1 w-full h-11 px-3 rounded-[10px] bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] grid place-items-center font-bold text-[16px]">
                          {formData.percentage ? `${formData.percentage}% - ${formData.grade}` : 'Enter marks - Auto %'}
                        </div>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">{t('groupStream')}</label>
                        <select value={formData.groupStream} onChange={e=>updateField('groupStream', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-white text-[#1A3263] border-2 border-[#E8E2DB] outline-none text-[12px]">
                          <option>Computer Science</option><option>Biology</option><option>Commerce</option><option>Arts</option><option>Mechanical</option><option>ECE</option><option>Civil</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">{t('cutoff')}</label>
                        <input value={formData.cutoff} onChange={e=>updateField('cutoff', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-white text-[#1A3263] border-2 border-[#E8E2DB] outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">{t('medium')}</label>
                        <select value={formData.medium} onChange={e=>updateField('medium', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-white text-[#1A3263] border-2 border-[#E8E2DB] outline-none text-[12px]">
                          <option>English</option><option>Tamil</option><option>Other</option>
                        </select>
                      </div>
                    </div>
                    {formData.percentage && (
                      <div className="mt-4 rounded-[12px] bg-white text-[#1A3263] p-3">
                        <div className="text-[11px] font-bold"> {t('autoPercentResult')}:</div>
                        <div className="text-[12px] mt-1">{formData.marksObtained} / {formData.totalMarks} = <span className="font-bold">{formData.percentage}%</span> - {formData.grade}</div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 font-bold text-[14px] text-[#1A3263]"><Upload size={18} className="text-[#FAB95B]" /> {t('originalDocs')} - {t('documents')}</div>
                    <div className="grid md:grid-cols-2 gap-3 mt-4">
                      {[
                        { key: 'tenthMarksheet', label: `${t('tenthMarksheet')} *`, desc: 'SSLC Original', required: true, icon: '' },
                        { key: 'twelfthMarksheet', label: `${t('twelfthMarksheet')} *`, desc: 'HSC Original', required: true, icon: '' },
                        { key: 'tc', label: `${t('tc')} *`, desc: 'School/College TC', required: true, icon: '' },
                        { key: 'communityCertificate', label: `${t('communityCertificate')} *`, desc: 'BC/MBC/SC/ST', required: true, icon: '' },
                        { key: 'incomeCertificate', label: t('incomeCertificate'), desc: 'For scholarship', required: false, icon: '' },
                        { key: 'aadharCard', label: `${t('aadharCard')} *`, desc: 'ID Proof', required: true, icon: '' },
                        { key: 'photo', label: `${t('photo')} *`, desc: 'Recent Photo', required: true, icon: '' },
                        { key: 'nativityCertificate', label: t('nativityCertificate'), desc: 'TN Nativity', required: false, icon: '' },
                        { key: 'firstGraduateCertificate', label: t('firstGraduateCertificate'), desc: 'First graduate', required: false, icon: '' },
                        { key: 'specialReservation', label: t('specialReservation'), desc: 'Sports/PH', required: false, icon: '' },
                      ].map(doc=>(
                        <div key={doc.key} className={`rounded-[14px] border-2 p-3 ${formData.documentNames[doc.key] ? 'bg-[#FAB95B]/20 border-[#FAB95B]' : 'bg-[#E8E2DB]/50 border-[#E8E2DB]'} `}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex gap-2">
                              <span className="text-[16px]">{doc.icon}</span>
                              <div>
                                <div className="text-[11px] font-bold text-[#1A3263] flex items-center gap-1">{doc.label} {formData.documentNames[doc.key] && <Check size={12} className="text-green-600" />}</div>
                                <div className="text-[10px] text-[#547792]">{doc.desc}</div>
                                {formData.documentNames[doc.key] && <div className="text-[10px] font-bold text-[#1A3263] mt-1">✓ {formData.documentNames[doc.key]}</div>}
                              </div>
                            </div>
                            {formData.documentNames[doc.key] ? (
                              <button onClick={()=>updateDocName(doc.key, '')} className="h-6 w-6 rounded-full bg-red-500 text-white grid place-items-center"><X size={12} /></button>
                            ) : (
                              <label className="h-7 px-3 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px] font-bold grid place-items-center cursor-pointer">
                                Upload
                                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>{
                                  const file = e.target.files?.[0]
                                  if(file) updateDocName(doc.key, file.name)
                                }} />
                              </label>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={()=>setStep(2)} className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-semibold text-[12px] flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
                  <button onClick={()=>setStep(4)} disabled={!formData.marksObtained || !formData.totalMarks} className="flex-1 h-11 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center justify-center gap-2 disabled:opacity-50">Continue - Top Colleges for {formData.percentage || 'Your'}% <Trophy size={16} /></button>
                </div>
              </div>
            )}

            {step===4 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Trophy size={20} className="text-[#FAB95B]" /> {language==='ta' ? `உங்கள் ${formData.percentage}% க்கான விருப்பங்கள் & சிறந்த கல்லூரிகள்` : `Preferences & Top Colleges for Your ${formData.percentage}%`}</h2>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('preferredDistrict')}</label>
                      <select value={formData.preferredDistrict} onChange={e=>updateField('preferredDistrict', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        {districts.map(item => <option key={item}>{item}</option>)}<option>Any District</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('collegeType')}</label>
                      <select value={formData.collegeType} onChange={e=>updateField('collegeType', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Any</option><option>Government</option><option>Private</option><option>Autonomous</option><option>Government Aided</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('budgetRange')}</label>
                      <select value={formData.budgetRange} onChange={e=>updateField('budgetRange', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Below 50K</option><option>50K - 1 Lakh</option><option>1-2 Lakhs</option><option>2-3 Lakhs</option><option>Above 3 Lakhs</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('scholarshipNeeded')}</label>
                      <div className="mt-1 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('scholarshipNeeded', opt)} className={`flex-1 h-10 rounded-[10px] border-2 text-[11px] font-semibold ${formData.scholarshipNeeded===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Home size={12} className="text-[#FAB95B]" /> {t('hostelRequired')}</label>
                      <div className="mt-1 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('hostelRequired', opt)} className={`flex-1 h-10 rounded-[10px] border-2 text-[11px] font-semibold ${formData.hostelRequired===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-[#1A3263]">{t('transportRequired')}</label>
                      <div className="mt-1 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('transportRequired', opt)} className={`flex-1 h-10 rounded-[10px] border-2 text-[11px] font-semibold ${formData.transportRequired===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-[#E8E2DB]">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 font-bold text-[14px] text-[#1A3263]"><Star size={18} className="text-[#FAB95B]" /> {t('topRatedColleges')} {formData.percentage}% - {formData.interestedCourse}</div>
                      <div className="px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-bold">{formData.percentage}% - {topCollegesByPercentage.length} Matched</div>
                    </div>
                    {topCollegesByPercentage.length===0 ? (
                      <div className="mt-4 rounded-[16px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-8 text-center">
                                                <div className="font-bold text-[#1A3263] mt-3">No Colleges Registered Yet - No Default Colleges</div>
                        <div className="text-[11px] text-[#1A3263]/80 mt-2">Automatic default college name kattama - Platform la ippa colleges illa. Colleges signup panni avunga details add panna apram ungalukku matched colleges kaattum. First college /college/signup la register pannanum.</div>
                        <div className="text-[11px] text-[#547792] mt-2">Your {formData.percentage}% eligible - Once colleges register, top matches for {formData.interestedCourse} will appear here based on placement %.</div>
                      </div>
                    ) : (
                    <div className="grid md:grid-cols-2 gap-3 mt-4">
                      {topCollegesByPercentage.map(college=>(
                        <div key={college.id} className="rounded-[16px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-4 hover:border-[#FAB95B] transition-colors">
                          <div className="flex gap-3">
                            <img src={college.branding?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(college.name)}&background=1A3263&color=FAB95B`} alt={college.shortName} className="h-12 w-12 rounded-[10px] object-cover border-2 border-[#FAB95B] bg-white" />
                            <div className="flex-1">
                              <div className="font-bold text-[#1A3263] text-[13px]">{college.name}</div>
                              <div className="text-[10px] text-[#547792]">{college.district} • {college.type}</div>
                              <div className="text-[10px] font-bold text-[#1A3263] mt-1">{college.placements?.percentage || '—'} {t('placement')}</div>
                            </div>
                            <div className="px-2 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px] font-bold">{college.matchPercent}% Match</div>
                          </div>
                          <div className="mt-3 rounded-[10px] bg-white border border-[#E8E2DB] p-2.5">
                            <div className="text-[10px] font-bold text-[#1A3263]">{college.eligibilityMatch}</div>
                            <div className="text-[10px] text-[#547792] mt-1">{college.reason}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={()=>setStep(3)} className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-semibold text-[12px] flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
                  <button onClick={()=>setStep(5)} className="flex-1 h-11 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold text-[12px] flex items-center justify-center gap-2">Review & Submit <Check size={16} /></button>
                </div>
              </div>
            )}

            {step===5 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><BadgeCheck size={20} className="text-[#FAB95B]" /> {t('reviewDetails')}</h2>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-[11px]">
                    <div className="space-y-2">
                      <div className="font-bold text-[#1A3263] text-[12px]">Basic & Dream - City → Dream Course Below</div>
                      <div><span className="text-[#547792]">Name:</span> <span className="font-bold text-[#1A3263]">{formData.fullName}</span></div>
                      <div><span className="text-[#547792]">City:</span> {formData.city} → <span className="font-bold bg-[#FAB95B] px-2 py-0.5 rounded-full">{formData.interestedCourse}</span> - Below City</div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-[#1A3263] text-[12px]">Marks Auto %</div>
                      <div><span className="text-[#547792]">Marks:</span> <span className="font-bold">{formData.marksObtained}/{formData.totalMarks}</span></div>
                      <div><span className="text-[#547792]">Percentage:</span> <span className="font-bold text-[#1A3263] bg-[#FAB95B] px-3 py-1 rounded-full">{formData.percentage}% - {formData.grade}</span></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={()=>setStep(4)} className="h-12 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-semibold text-[13px] flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
                  <button onClick={handleSubmit} className="flex-1 h-12 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold text-[13px] flex items-center justify-center gap-2">
                    Create Account & Discover Top Colleges for {formData.percentage}% <Check size={18} />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
