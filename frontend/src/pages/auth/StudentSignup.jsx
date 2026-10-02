import { useState, useMemo, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Check, GraduationCap, MapPin, BookOpen, Home, User, Mail, Phone, Lock, School, Heart, Calendar, Users, FileText, Upload, BadgeCheck, IdCard, Calculator, Eye, Trash2, RefreshCw, Loader2, Image as ImageIcon, AlertTriangle } from 'lucide-react'
import {
  ACCEPTED_MIME, STUDENT_DOCUMENTS, prepareDocument, formatFileSize,
  hasFile, isPdfDoc, saveStudentDocumentsWithFallback, syncStudentDocumentCounters
} from '../../lib/studentDocuments'
import StudentDocumentPreview from '../../components/student/StudentDocumentPreview'
import {
  loadStudentSignupDraft, saveStudentSignupDraft, clearStudentSignupDraft,
  loadStudentSignupDraftFiles, saveStudentSignupDraftFile,
  removeStudentSignupDraftFile, clearStudentSignupDraftFiles
} from '../../lib/studentSignupDraft'
import { districts } from '../../lib/colleges'
import {
  EDUCATION_LEVELS, isSchoolLevel, qualificationOptionsFor,
  institutionSuggestions, districtHighlights
} from '../../lib/tnEducation'
import { useLanguage } from '../../lib/languageContext'
import { StudentLanguageToggleAlways } from '../../components/student/LanguageToggle'
import { api, isBackendUnavailable, saveAuthSession } from '../../lib/api'
import { hydrateStudentWorkspace } from '../../lib/studentWorkspace'

// Course options offered in the Dream Course picker (single source of truth)
const DREAM_COURSE_OPTIONS = [
  'B.E Computer Science',
  'B.Tech AI & Data Science',
  'B.E CSE AI & ML',
  'B.Tech Information Technology',
  'B.E Electronics and Communication',
  'B.E Mechanical',
  'B.E Civil',
  'BCA',
  'B.Sc Computer Science',
  'B.Com',
  'BBA',
  'MBBS',
  'MBA',
  'B.Sc Nursing',
  'LLB'
]

// Year of passing choices - latest year back to 2000
const LATEST_PASSING_YEAR = Math.max(new Date().getFullYear(), 2026)
const YEAR_OF_PASSING_OPTIONS = Array.from(
  { length: LATEST_PASSING_YEAR - 1999 },
  (_, i) => String(LATEST_PASSING_YEAR - i)
)

export default function StudentSignup() {
  const navigate = useNavigate()
  const [initialDraft] = useState(() => loadStudentSignupDraft())
  const [step, setStep] = useState(() => initialDraft?.step || 1)
  const { t, language } = useLanguage()

  const [formData, setFormData] = useState(() => {
    const defaults = {
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
    fatherMobile: '',
    motherMobile: '',
    alternateMobile: '',
    annualIncome: '',
    maritalStatus: 'Single',
    permanentAddress: '',
    pincode: '',
    state: 'Tamil Nadu',
    educationLevel: '12th',
    schoolCollege: '',
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
    }
    const draftData = initialDraft?.formData || {}
    return {
      ...defaults,
      ...draftData,
      password: '',
      documents: { ...defaults.documents, ...(draftData.documents || {}) },
      documentNames: { ...defaults.documentNames, ...(draftData.documentNames || {}) }
    }
  })

  const updateField = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  // Keep the in-progress form on this device so a refresh does not erase it.
  const [draftStatus, setDraftStatus] = useState(initialDraft ? 'saved' : 'saving')
  const [draftFileError, setDraftFileError] = useState(false)
  const [draftFilesReady, setDraftFilesReady] = useState(false)
  const touchedDocKeysRef = useRef(new Set())

  // Real certificate files are stored in IndexedDB while signup is in progress.
  const [docFiles, setDocFiles] = useState({})
  const [docBusy, setDocBusy] = useState('')
  const [docError, setDocError] = useState('')
  const [docPreview, setDocPreview] = useState(null)

  useEffect(() => {
    const result = saveStudentSignupDraft({ step, formData })
    const nextStatus = result.ok ? 'saved' : 'error'
    queueMicrotask(() => setDraftStatus(nextStatus))
  }, [formData, step])

  useEffect(() => {
    let active = true
    const savedFiles = initialDraft
      ? loadStudentSignupDraftFiles()
      : clearStudentSignupDraftFiles().then(() => ({}))
    savedFiles.then(restoredFiles => {
      if (!active) return

      setDocFiles(current => {
        const restored = { ...restoredFiles }
        touchedDocKeysRef.current.forEach(key => { delete restored[key] })
        return { ...restored, ...current }
      })
      setFormData(current => {
        const documents = { ...current.documents }
        const documentNames = { ...current.documentNames }
        STUDENT_DOCUMENTS.forEach(({ key }) => {
          if (touchedDocKeysRef.current.has(key)) return
          const file = restoredFiles[key]
          documents[key] = file ? { name: file.name, uploadedAt: file.uploadedAt || '' } : null
          documentNames[key] = file?.name || ''
        })
        return { ...current, documents, documentNames }
      })
    }).catch(() => {
      if (!active) return
      setDraftFileError(true)
      setDocError('Could not restore saved documents / சேமித்த ஆவணங்களை மீட்டெடுக்க முடியவில்லை. Please upload those files again / கோப்புகளை மீண்டும் பதிவேற்றவும்.')
    }).finally(() => {
      if (active) setDraftFilesReady(true)
    })

    return () => { active = false }
  }, [initialDraft])

  const handleDocFile = async (docKey, file) => {
    if (!file) return
    setDocBusy(docKey)
    setDocError('')
    try {
      const payload = await prepareDocument(file)
      touchedDocKeysRef.current.add(docKey)
      const saved = await saveStudentSignupDraftFile(docKey, payload)
      setDocFiles(prev => ({ ...prev, [docKey]: payload }))
      updateDocName(docKey, payload.name)
      if (saved.ok) {
        setDraftFileError(false)
        setDraftStatus('saved')
      } else {
        setDraftFileError(true)
        setDraftStatus('error')
        setDocError(language==='ta'
          ? 'கோப்பு இப்போது பயன்படுத்தலாம்; ஆனால் இந்த சாதனத்தில் சேமிக்க முடியவில்லை. இந்தப் பக்கத்தை மூடாதீர்கள்.'
          : 'The file is available for now, but could not be saved on this device. Please keep this page open.')
      }
    } catch (error) {
      const reason = error?.message
      setDocError(reason === 'too-large'
        ? (language==='ta' ? 'கோப்பு மிகப் பெரியது - 4MB க்கு கீழ் இருக்க வேண்டும்' : 'That file is too large - keep it under 4 MB')
        : reason === 'unsupported'
          ? (language==='ta' ? 'PDF, JPG, PNG மட்டும்' : 'Only PDF, JPG, PNG and WEBP are supported')
          : (language==='ta' ? 'கோப்பை படிக்க முடியவில்லை' : 'Could not read that file'))
    } finally {
      setDocBusy('')
    }
  }

  const removeDoc = async docKey => {
    touchedDocKeysRef.current.add(docKey)
    const removed = await removeStudentSignupDraftFile(docKey)
    if (!removed.ok) {
      setDraftFileError(true)
      setDraftStatus('error')
      setDocError(language==='ta'
        ? 'கோப்பை சேமிப்பிலிருந்து நீக்க முடியவில்லை. பக்கத்தை refresh செய்ய வேண்டாம்.'
        : 'Could not remove the saved file. Please do not refresh this page yet.')
      return
    }
    setDocFiles(prev => { const next = { ...prev }; delete next[docKey]; return next })
    updateDocName(docKey, '')
    setDraftFileError(false)
    setDraftStatus('saved')
  }
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
    else total = '1000'
    // school levels -> TN board, higher levels -> TN university; keep the choice when it still applies
    const options = qualificationOptionsFor(level, formData.district)
    const board = options.includes(formData.board) ? formData.board : options[0]
    const newData = { ...formData, educationLevel: level, totalMarks: total, board }
    if (formData.marksObtained) {
      const { percentage, grade } = calculatePercentage(formData.marksObtained, total)
      newData.percentage = percentage
      newData.grade = grade
    }
    setFormData(newData)
  }

  /* ---- Tamil Nadu education helpers (step 3) ---- */
  const schoolLevel = isSchoolLevel(formData.educationLevel)
  const qualificationOptions = useMemo(
    () => qualificationOptionsFor(formData.educationLevel, formData.district),
    [formData.educationLevel, formData.district]
  )
  const institutionNames = useMemo(
    () => institutionSuggestions(formData.educationLevel, formData.district),
    [formData.educationLevel, formData.district]
  )
  const institutionPicks = useMemo(
    () => districtHighlights(formData.educationLevel, formData.district, 3),
    [formData.educationLevel, formData.district]
  )
  const shortInstitution = (name) => name
    .replace('Government Girls Higher Secondary School, ', 'GGHSS ')
    .replace('Government Higher Secondary School, ', 'GHSS ')

  const handleSubmit = async () => {
    const normalizedEmail = String(formData.email || '').trim().toLowerCase()
    let storedStudents = []
    try {
      const parsedStudents = JSON.parse(localStorage.getItem('tn_students') || '[]')
      storedStudents = Array.isArray(parsedStudents) ? parsedStudents : []
    } catch { /* recover gracefully from malformed local storage */ }
    const existingStudent = storedStudents.find(student => String(student.email || '').trim().toLowerCase() === normalizedEmail)
    if (existingStudent) {
      alert('An account with this email already exists. Please log in to open your saved details; you can edit them from your student profile.')
      navigate(`/login?role=student&email=${encodeURIComponent(normalizedEmail)}`)
      return
    }

    let backendSession = null
    try {
      backendSession = await api.register({
        email: normalizedEmail,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.mobile,
        role: 'STUDENT',
        studentProfile: {
          fullName: formData.fullName,
          mobile: formData.mobile,
          parentMobile: formData.fatherMobile || formData.parentMobile,
          fatherName: formData.fatherName,
          dob: formData.dob,
          gender: formData.gender,
          permanentAddress: formData.permanentAddress,
          pincode: formData.pincode,
          state: formData.state,
          district: formData.district,
          city: formData.city,
          educationLevel: formData.educationLevel,
          schoolCollege: formData.schoolCollege,
          marks: `${formData.marksObtained}/${formData.totalMarks}`,
          percentage: formData.percentage,
          groupStream: formData.groupStream,
          interestedSubject: formData.interestedSubject,
          interestedCourse: formData.interestedCourse,
          preferredDistrict: formData.preferredDistrict,
          collegeType: formData.collegeType,
          hostelRequired: formData.hostelRequired,
          transportRequired: formData.transportRequired
        }
      })
      saveAuthSession(backendSession)
    } catch (error) {
      if (!isBackendUnavailable(error)) {
        if (error.status === 409) {
          alert(error.message)
          navigate(`/login?role=student&email=${encodeURIComponent(normalizedEmail)}`)
        } else {
          setDocError(error.message || 'Registration could not be completed. Please try again.')
        }
        return
      }
    }

    const { password: signupPassword, ...safeFormData } = formData
    const student = {
      id: backendSession?.studentId ?? Date.now(),
      ...safeFormData,
      password: backendSession ? undefined : signupPassword,
      email: normalizedEmail,
      role: 'STUDENT',
      profileCompletion: 100,
      marks: `${formData.marksObtained}/${formData.totalMarks}`,
      fullName: formData.fullName,
      mobile: formData.mobile,
      parentMobile: formData.fatherMobile || formData.parentMobile || '',
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
    const saved = saveStudentDocumentsWithFallback(student.id, docFiles)
    if (!saved.ok) {
      setDocError(language==='ta'
        ? 'ஆவணங்களை சேமிக்க முடியவில்லை. இடத்தை விடுவித்து மீண்டும் முயற்சிக்கவும்; உங்கள் பதிவு விவரங்கள் சேமிக்கப்பட்டுள்ளன.'
        : 'Could not save the documents. Free some device storage and try again; your signup details are still saved.')
      setStep(3)
      return
    }

    localStorage.setItem('tn_current_student', JSON.stringify(student))
    storedStudents.push(student)
    localStorage.setItem('tn_students', JSON.stringify(storedStudents))
    if (backendSession) hydrateStudentWorkspace()
    syncStudentDocumentCounters(student.id, saved.docs)
    clearStudentSignupDraft()
    await clearStudentSignupDraftFiles()
    navigate('/student/dashboard#recommended-colleges')
  }

  const steps = [
    { id: 1, title: language==='ta' ? 'அடிப்படை விவரங்கள் & கனவு பாடம்' : 'Basic Details & Dream Course', icon: Heart, desc: language==='ta' ? 'பெயர், மின்னஞ்சல், கைபேசி, மாவட்டம், நகரம், கனவு பாடம்' : 'Name, Email, Mobile, District, City, Dream Course' },
    { id: 2, title: language==='ta' ? 'தனிப்பட்ட & குடும்ப விவரங்கள்' : 'Personal & Family Details', icon: Users, desc: 'DOB, Gender, Parents, Aadhar, Address' },
    { id: 3, title: language==='ta' ? 'கல்வி & ஆவணங்கள்' : 'Education & Documents', icon: FileText, desc: 'Marks, percentage and original documents' },
    { id: 4, title: language==='ta' ? 'கல்லூரி விருப்பங்கள்' : 'College Preferences', icon: GraduationCap, desc: language==='ta' ? 'மாவட்டம், கல்லூரி வகை, பட்ஜெட்' : 'Choose district, college type and budget' },
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
              <div className="text-[11px] tracking-widest uppercase text-[#FAB95B]">{language==='ta' ? 'மாணவர் பதிவு - 5 படிகள்' : 'Student Sign Up - 5 Guided Steps'}</div>
            </div>
          </div>

          <div className="mt-10">
            <h1 className="font-display text-[28px] font-bold leading-[0.95]">{language==='ta' ? 'உங்கள் கனவு பாடத்திற்கு ஏற்ற கல்லூரி.' : 'The right college for your dream course.'}</h1>
            <p className="mt-4 text-[13px] leading-[1.6] text-[#E8E2DB]/70">{language==='ta' ? 'ஐந்து எளிய படிகளில் பதிவு செய்யுங்கள். கணக்கை உருவாக்கியதும், உங்கள் கனவு பாடத்திற்கும் விருப்பங்களுக்கும் பொருந்தும் கல்லூரிகளைப் பாருங்கள்.' : 'Sign up in five guided steps. After you create your account, you’ll see colleges matched to your dream course and preferences.'}</p>
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
              <div className="text-[10px] mt-2 font-bold">{language==='ta' ? 'கணக்கை உருவாக்கியதும் பொருத்தமான கல்லூரிகள் காட்டப்படும்.' : 'Matching colleges will appear after you create your account.'}</div>
            </div>
          )}
        </div>
        <div className="text-[10px] text-white/40">5-Step Guided Signup • Tamil / English</div>
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
                <span className="text-[10px] font-bold text-[#547792]">Language:</span>
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

        <div className="px-4 lg:px-10 pt-3">
          <p role="status" className={`max-w-[760px] mx-auto text-[11px] ${draftStatus==='error' || draftFileError ? 'text-red-700' : 'text-[#547792]'}`}>
            {!draftFilesReady
              ? (language==='ta' ? 'சேமித்த விவரங்களையும் ஆவணங்களையும் மீட்டெடுக்கிறோம்…' : 'Restoring your saved details and files…')
              : draftStatus==='error' || draftFileError
                ? (language==='ta' ? 'தானாகச் சேமிக்க முடியவில்லை. இந்தப் பக்கத்தை திறந்தே வைத்திருந்து மீண்டும் முயற்சிக்கவும்.' : 'Could not auto-save on this device. Keep this page open and try again.')
                : (language==='ta' ? 'உங்கள் விவரங்களும் ஆவணங்களும் இந்தச் சாதனத்தில் தானாகச் சேமிக்கப்படும். பாதுகாப்புக்காக கடவுச்சொல் சேமிக்கப்படாது.' : 'Your details and files auto-save on this device. Passwords are not saved for security.')}
          </p>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-[760px] mx-auto">

            {step===1 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#547792]">{language==='ta' ? 'படி 1 / 5' : 'Step 1 of 5'}</div>
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] mt-1.5">{language==='ta' ? 'அடிப்படை விவரங்கள்' : 'Basic details'}</h2>
                  <p className="text-[12px] text-[#547792] mt-1">{language==='ta' ? 'உங்கள் விவரங்களையும், நீங்கள் படிக்க விரும்பும் கனவு பாடத்தையும் உள்ளிடுங்கள். இவற்றை பின்னர் சுயவிவரப் பக்கத்தில் திருத்தலாம்.' : 'Enter your details and the dream course you want to pursue. Everything here can be edited later from your profile.'}</p>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-5">
                  <div>
                    <div className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5 mb-3"><User size={12} className="text-[#547792]" /> {language==='ta' ? 'அடிப்படை தகவல்' : 'Basic Information'}</div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5"><User size={12} className="text-[#547792]" /> {t('fullName')} * - {t('asPerAadhar')}</label>
                        <input value={formData.fullName} onChange={e=>updateField('fullName', e.target.value)} placeholder={language==='ta' ? 'ஆதார் படி முழு பெயர்' : 'Enter full name as per Aadhar'} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px] text-[#1A3263]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5"><Mail size={12} className="text-[#547792]" /> {t('email')} *</label>
                        <input type="email" value={formData.email} onChange={e=>updateField('email', e.target.value)} placeholder="student@email.com" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5"><Phone size={12} className="text-[#547792]" /> {t('mobile')} *</label>
                        <input value={formData.mobile} onChange={e=>updateField('mobile', e.target.value)} placeholder="+91 98765 43210" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5"><Lock size={12} className="text-[#547792]" /> {t('password')} *</label>
                        <input type="password" value={formData.password} onChange={e=>updateField('password', e.target.value)} placeholder={language==='ta' ? 'வலுவான கடவுச்சொல்' : 'Strong password'} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5"><MapPin size={12} className="text-[#547792]" /> {t('district')} *</label>
                        <select value={formData.district} onChange={e=>updateField('district', e.target.value)} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px] font-medium">
                          {districts.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5"><MapPin size={12} className="text-[#547792]" /> {t('city')} *</label>
                        <input value={formData.city} onChange={e=>updateField('city', e.target.value)} placeholder={language==='ta' ? 'நகரத்தை உள்ளிடவும்' : 'Enter your city'} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="dreamCourse" className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5"><BookOpen size={12} className="text-[#547792]" /> {language==='ta' ? 'கனவு பாடம் - என்ன படிக்க விரும்புகிறீர்கள்?' : 'Dream Course - What would you like to study?'} *</label>
                        <select
                          id="dreamCourse"
                          required
                          value={formData.interestedCourse}
                          onChange={e=>updateField('interestedCourse', e.target.value)}
                          className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border-2 border-[#547792]/40 focus:border-[#1A3263] outline-none text-[13px] font-medium text-[#1A3263]"
                        >
                          {DREAM_COURSE_OPTIONS.map(course => <option key={course}>{course}</option>)}
                        </select>
                        <p className="text-[11px] text-[#547792] mt-1.5 leading-[1.5]">
                          {language==='ta'
                            ? 'இது உங்கள் இலக்குக்கு ஏற்ற கல்லூரிகளை பொருத்த உதவும். சுயவிவரப் பக்கத்தில் எப்போது வேண்டுமானாலும் மாற்றலாம்.'
                            : 'Used to match colleges against your goal. You can update this anytime from your profile.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm">
                    <div className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5 mb-4">
                      <BookOpen size={12} className="text-[#547792]" /> {language==='ta' ? 'படிப்பு விருப்பங்கள்' : 'Study Preferences'}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792]">{language==='ta' ? 'ஆர்வமுள்ள பாடம் / பிரிவு' : 'Subject / Stream'}</label>
                        <input value={formData.interestedSubject} onChange={e=>updateField('interestedSubject', e.target.value)} placeholder={language==='ta' ? 'கணினி அறிவியல், உயிரியல்' : 'Computer Science, Biology'} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792]">{language==='ta' ? 'தொழில் இலக்கு' : 'Career Goal'}</label>
                        <input value={formData.careerGoal} onChange={e=>updateField('careerGoal', e.target.value)} placeholder={language==='ta' ? 'மென்பொருள் பொறியாளர், மருத்துவர்' : 'Software Engineer, Doctor'} className="mt-2 w-full h-11 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[13px]" />
                      </div>
                    </div>

                    <div className="mt-4 rounded-[12px] bg-[#E8E2DB]/60 border-l-2 border-[#547792] px-4 py-3">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#547792]">{language==='ta' ? 'சுருக்கம்' : 'Summary'}</div>
                      <div className="text-[11.5px] leading-[1.55]">
                        <div className="text-[#1A3263]/80 mt-1.5">
                          {language==='ta'
                            ? `${formData.city || 'உங்கள் நகரம்'}, ${formData.district} - ${formData.interestedCourse} படிக்க விரும்புகிறீர்கள். கணக்கை உருவாக்கியதும், இதற்கு ஏற்ற கல்லூரிகள் காட்டப்படும்.`
                            : `Based in ${formData.city || 'your city'}, ${formData.district}, aiming for ${formData.interestedCourse}. Matching colleges will be shown after account creation.`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={()=>setStep(2)} disabled={!formData.fullName || !formData.email || !formData.mobile || !formData.city || !formData.interestedCourse} className="w-full h-12 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#1A3263]/90 disabled:opacity-50">
                  {language==='ta' ? 'தொடர்க - படி 2 / 5' : 'Continue - Step 2 of 5'} <ArrowRight size={18} />
                </button>
                <div className="text-[11px] text-center text-[#547792]">{language==='ta' ? 'படி 1 / 5 - அடிப்படை விவரங்கள் & கனவு பாடம்' : 'Step 1 of 5 - Basic details and your dream course'}</div>
              </div>
            )}

            {step===2 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Users size={20} className="text-[#547792]" /> {language==='ta' ? 'தனிப்பட்ட & குடும்ப விவரங்கள்' : 'Personal & Family Details'}</h2>
                  <p className="text-[11px] text-[#547792] mt-1">{language==='ta' ? 'முழு தகவல் - வேறு என்ன தகவல் வேண்டுமோ அது' : 'Complete profile - Full information'}</p>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-5">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792] flex items-center gap-1"><Calendar size={10} className="text-[#FAB95B]" /> {t('dob')} *</label>
                      <input type="date" value={formData.dob} onChange={e=>updateField('dob', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('gender')} *</label>
                      <select value={formData.gender} onChange={e=>updateField('gender', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>{t('male')}</option><option>{t('female')}</option><option>{t('other')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('bloodGroup')}</label>
                      <select value={formData.bloodGroup} onChange={e=>updateField('bloodGroup', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>O+</option><option>O-</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('nationality')}</label>
                      <input value={formData.nationality} onChange={e=>updateField('nationality', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('religion')}</label>
                      <select value={formData.religion} onChange={e=>updateField('religion', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Hindu</option><option>Muslim</option><option>Christian</option><option>Sikh</option><option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('community')} *</label>
                      <select value={formData.community} onChange={e=>updateField('community', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>OC</option><option>BC</option><option>BCM</option><option>MBC</option><option>DNC</option><option>SC</option><option>SCA</option><option>ST</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('caste')}</label>
                      <input value={formData.caste} onChange={e=>updateField('caste', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792] flex items-center gap-1"><IdCard size={10} className="text-[#FAB95B]" /> {t('aadharNumber')} *</label>
                      <input value={formData.aadharNumber} onChange={e=>updateField('aadharNumber', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('annualIncome')}</label>
                      <select value={formData.annualIncome} onChange={e=>updateField('annualIncome', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Below 1 Lakh</option><option>1-2 Lakhs</option><option>2-5 Lakhs</option><option>5-8 Lakhs</option><option>Above 8 Lakhs</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E2DB]">
                    <div className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5"><Users size={12} className="text-[#547792]" /> {t('familyInfo')}</div>
                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792]">{t('fatherName')} *</label>
                        <input value={formData.fatherName} onChange={e=>updateField('fatherName', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792]">{t('motherName')} *</label>
                        <input value={formData.motherName} onChange={e=>updateField('motherName', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792]">{t('fatherOccupation')}</label>
                        <input value={formData.fatherOccupation} onChange={e=>updateField('fatherOccupation', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792]">{t('motherOccupation')}</label>
                        <input value={formData.motherOccupation} onChange={e=>updateField('motherOccupation', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-[11px] font-semibold text-[#547792]">{t('parentMobile')} *</div>
                        <div className="mt-2 space-y-3">
                          <div>
                            <label className="text-[11px] font-semibold text-[#547792]">{t('fatherMobile')} *</label>
                            <input type="tel" value={formData.fatherMobile} onChange={e=>updateField('fatherMobile', e.target.value)} placeholder="+91 98765 43210" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-[#547792]">{t('motherMobile')} *</label>
                            <input type="tel" value={formData.motherMobile} onChange={e=>updateField('motherMobile', e.target.value)} placeholder="+91 98765 43210" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792]">{t('alternateMobile')}</label>
                        <input type="tel" value={formData.alternateMobile} onChange={e=>updateField('alternateMobile', e.target.value)} placeholder="+91 98765 43210" className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E2DB]">
                    <div className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5"><Home size={12} className="text-[#547792]" /> {t('addressInfo')}</div>
                    <div className="grid md:grid-cols-3 gap-4 mt-3">
                      <div className="md:col-span-2">
                        <label className="text-[11px] font-semibold text-[#547792]">{t('permanentAddress')} *</label>
                        <input value={formData.permanentAddress} onChange={e=>updateField('permanentAddress', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-[#547792]">{t('pincode')} *</label>
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
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><FileText size={20} className="text-[#547792]" /> {language==='ta' ? 'கல்வி & அசல் ஆவணங்கள்' : 'Education & Original Documents'}</h2>
                  <p className="text-[11px] text-[#547792] mt-1">{language==='ta' ? 'மதிப்பெண்களை உள்ளிடவும் - சதவீதம் தானாக கணக்கிடப்படும். அசல் ஆவணங்களை கீழே பதிவேற்றவும்.' : 'Enter your marks and the percentage is calculated automatically. Upload your original documents below.'}</p>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5"><GraduationCap size={12} className="text-[#547792]" /> {t('educationLevel')} *</label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {EDUCATION_LEVELS.map(level=>(
                          <button key={level} onClick={()=>handleEducationLevelChange(level)} className={`h-10 rounded-[10px] border-2 text-[11px] font-semibold transition-all ${formData.educationLevel===level?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B]'}`}>{level}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{schoolLevel ? (language==='ta' ? 'கல்வி வாரியம்' : 'Board of Education') : (language==='ta' ? 'பல்கலைக்கழகம்' : 'University')}</label>
                      <select value={qualificationOptions.includes(formData.board) ? formData.board : qualificationOptions[0]} onChange={e=>updateField('board', e.target.value)} className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        {qualificationOptions.map(option=>(<option key={option}>{option}</option>))}
                      </select>
                      <div className="text-[10px] text-[#547792] mt-1.5">
                        {schoolLevel
                          ? (language==='ta' ? 'தமிழ்நாடு பள்ளி வாரியங்கள்' : 'Tamil Nadu school boards')
                          : (language==='ta' ? 'தமிழ்நாடு பல்கலைக்கழகங்கள் - உங்கள் மாவட்டம் முதலில்' : `Tamil Nadu universities${formData.district ? ` - ${formData.district} first` : ''}`)}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5"><School size={12} className="text-[#547792]" /> {schoolLevel ? (language==='ta' ? 'பள்ளி பெயர்' : 'School Name') : (language==='ta' ? 'கல்லூரி / நிறுவனம்' : 'College / Institution Name')} *</label>
                      <input
                        list="tnInstitutionSuggestions"
                        value={formData.schoolCollege}
                        onChange={e=>updateField('schoolCollege', e.target.value)}
                        placeholder={schoolLevel ? (language==='ta' ? 'உ.ம்: GHSS, சூலூர்' : 'Ex: Government Higher Secondary School, Sulur') : (language==='ta' ? 'உ.ம்: PSG College of Technology' : 'Ex: PSG College of Technology')}
                        className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]"
                      />
                      <datalist id="tnInstitutionSuggestions">
                        {institutionNames.map(name=>(<option key={name} value={name} />))}
                      </datalist>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-semibold text-[#547792]">{formData.district ? `${formData.district}:` : (schoolLevel ? 'Tamil Nadu schools:' : 'Tamil Nadu colleges:')}</span>
                        {institutionPicks.map(name=>(
                          <button
                            type="button"
                            key={name}
                            onClick={()=>updateField('schoolCollege', name)}
                            title={name}
                            className="px-2.5 py-1 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[10px] font-semibold text-[#1A3263] hover:border-[#FAB95B] max-w-[220px] truncate"
                          >{shortInstitution(name)}</button>
                        ))}
                      </div>
                      <div className="text-[10px] text-[#547792] mt-1.5">
                        {schoolLevel
                          ? (language==='ta' ? 'தமிழ்நாடு பள்ளிகளின் பெயர்கள் - type பண்ணி தேர்வு செய்யலாம்' : 'Tamil Nadu school names - type to search or pick a suggestion')
                          : (language==='ta' ? 'தமிழ்நாடு கல்லூரி பெயர்கள் - type பண்ணி தேர்வு செய்யலாம்' : 'Tamil Nadu college names - type to search or pick a suggestion')}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('yearOfPassing')}</label>
                      <select value={formData.yearOfPassing} onChange={e=>updateField('yearOfPassing', e.target.value)} className="mt-2 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        {YEAR_OF_PASSING_OPTIONS.map(year => <option key={year}>{year}</option>)}
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
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">{t('totalMarks')} * - {formData.educationLevel} = {formData.totalMarks}</label>
                        <input value={formData.totalMarks} onChange={e=>handleMarksChange('totalMarks', e.target.value)} className="mt-1 w-full h-11 px-3 rounded-[10px] bg-white text-[#1A3263] border-2 border-[#FAB95B] outline-none text-[13px] font-bold" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#FAB95B]">{t('percentage')} %</label>
                        <div className="mt-1 w-full h-11 px-3 rounded-[10px] bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] grid place-items-center font-bold text-[16px]">
                          {formData.percentage ? `${formData.percentage}% - ${formData.grade}` : 'Enter marks to calculate %'}
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
                    <div className="text-[11px] text-[#547792] mt-1">
                      {language==='ta'
                        ? 'புகைப்படம் அல்லது PDF, கோப்பு ஒன்றுக்கு 4 MB-க்கு கீழ். சமர்ப்பிப்பதற்கு முன் "பார்வை" மூலம் சரிபார்க்கவும்.'
                        : 'Photo or PDF, under 4 MB per file. Use "View" to check a document before submitting.'}
                    </div>
                    {docError && (
                      <div className="mt-3 rounded-[12px] bg-red-50 border-2 border-red-200 px-3 py-2 text-[11.5px] font-medium text-red-700 flex items-center gap-2">
                        <AlertTriangle size={13} /> {docError}
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-3 mt-4">
                      {STUDENT_DOCUMENTS.map(meta => {
                        const savedDoc = docFiles[meta.key]
                        const isBusy = docBusy === meta.key
                        const uploaded = !!savedDoc || !!formData.documentNames[meta.key]
                        return (
                          <div key={meta.key} className={`rounded-[14px] border-2 p-3 ${uploaded ? 'bg-[#FAB95B]/20 border-[#FAB95B]' : 'bg-[#E8E2DB]/50 border-[#E8E2DB]'}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="text-[11px] font-semibold text-[#547792] flex items-center gap-1">
                                  {t(meta.labelKey)} {meta.required && <span>*</span>}
                                  {uploaded && <Check size={12} className="text-green-600 shrink-0" />}
                                </div>
                                <div className="text-[10px] text-[#547792]">{meta.desc}</div>
                                {uploaded && (
                                  <div className="text-[10px] font-bold text-[#1A3263] mt-1 flex items-center gap-1.5 min-w-0">
                                    {isPdfDoc(savedDoc) ? <FileText size={10} className="shrink-0" /> : <ImageIcon size={10} className="shrink-0" />}
                                    <span className="truncate max-w-[150px]">{savedDoc?.name || formData.documentNames[meta.key]}</span>
                                    {savedDoc && <span className="font-medium text-[#547792] shrink-0">{formatFileSize(savedDoc.size)}</span>}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <label className={`h-7 px-3 rounded-full text-[10px] font-bold grid place-items-center cursor-pointer ${uploaded ? 'bg-white border-2 border-[#E8E2DB] text-[#1A3263]' : 'bg-[#1A3263] text-[#FAB95B]'}`}>
                                  <span className="flex items-center gap-1.5">
                                    {isBusy ? <Loader2 size={11} className="animate-spin" /> : uploaded ? <RefreshCw size={11} /> : <Upload size={11} />}
                                    {isBusy ? (language==='ta' ? 'படிக்கிறது' : 'Reading') : uploaded ? (language==='ta' ? 'மாற்று' : 'Replace') : 'Upload'}
                                  </span>
                                  <input
                                    type="file"
                                    accept={ACCEPTED_MIME}
                                    className="hidden"
                                    disabled={isBusy}
                                    onChange={e => { const file = e.target.files?.[0]; if (file) handleDocFile(meta.key, file); e.target.value = '' }}
                                  />
                                </label>
                                {uploaded && (
                                  <div className="flex items-center gap-1">
                                    {hasFile(savedDoc) && (
                                      <button type="button" onClick={()=>setDocPreview({ doc: savedDoc, key: meta.key })} title={language==='ta' ? 'பார்' : 'View'} aria-label="View document" className="h-6 w-6 grid place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B]">
                                        <Eye size={11} />
                                      </button>
                                    )}
                                    <button type="button" onClick={()=>removeDoc(meta.key)} title={language==='ta' ? 'நீக்கு' : 'Remove'} aria-label="Remove document" className="h-6 w-6 grid place-items-center rounded-full bg-red-500 text-white">
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {docPreview && (
                  <StudentDocumentPreview
                    doc={docPreview.doc}
                    docKey={docPreview.key}
                    label={t(STUDENT_DOCUMENTS.find(d => d.key === docPreview.key)?.labelKey || docPreview.key)}
                    onClose={()=>setDocPreview(null)}
                  />
                )}

                <div className="flex gap-3">
                  <button onClick={()=>setStep(2)} className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-semibold text-[12px] flex items-center gap-2"><ArrowLeft size={16} /> Back</button>
                  <button onClick={()=>setStep(4)} disabled={!formData.marksObtained || !formData.totalMarks} className="flex-1 h-11 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center justify-center gap-2 disabled:opacity-50">{language==='ta' ? 'தொடர்க - கல்லூரி விருப்பங்கள்' : 'Continue - College Preferences'} <ArrowRight size={16} /></button>
                </div>
              </div>
            )}

            {step===4 && (
              <div className="space-y-5 animate-fadeIn">
                <div>
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><GraduationCap size={20} className="text-[#547792]" /> {language==='ta' ? 'உங்கள் கல்லூரி விருப்பங்கள்' : 'Your College Preferences'}</h2>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('preferredDistrict')}</label>
                      <select value={formData.preferredDistrict} onChange={e=>updateField('preferredDistrict', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Any District</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('collegeType')}</label>
                      <select value={formData.collegeType} onChange={e=>updateField('collegeType', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Any</option><option>Government</option><option>Private</option><option>Autonomous</option><option>Government Aided</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('budgetRange')}</label>
                      <select value={formData.budgetRange} onChange={e=>updateField('budgetRange', e.target.value)} className="mt-1 w-full h-10 px-3 rounded-[10px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[12px]">
                        <option>Below 50K</option><option>50K - 1 Lakh</option><option>1-2 Lakhs</option><option>2-3 Lakhs</option><option>Above 3 Lakhs</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('scholarshipNeeded')}</label>
                      <div className="mt-1 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('scholarshipNeeded', opt)} className={`flex-1 h-10 rounded-[10px] border-2 text-[11px] font-semibold ${formData.scholarshipNeeded===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792] flex items-center gap-1.5"><Home size={12} className="text-[#547792]" /> {t('hostelRequired')}</label>
                      <div className="mt-1 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('hostelRequired', opt)} className={`flex-1 h-10 rounded-[10px] border-2 text-[11px] font-semibold ${formData.hostelRequired===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-[#547792]">{t('transportRequired')}</label>
                      <div className="mt-1 flex gap-2">
                        {['Yes','No'].map(opt=>(
                          <button key={opt} onClick={()=>updateField('transportRequired', opt)} className={`flex-1 h-10 rounded-[10px] border-2 text-[11px] font-semibold ${formData.transportRequired===opt?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263]':'bg-[#E8E2DB] border-[#E8E2DB] text-[#1A3263]'}`}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t-2 border-[#E8E2DB]">
                    <div className="rounded-[16px] bg-[#E8E2DB]/60 border-2 border-[#E8E2DB] p-4 flex items-start gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-[12px] bg-[#1A3263] text-[#FAB95B] grid place-items-center"><GraduationCap size={18} /></div>
                      <div>
                        <div className="font-bold text-[12px] text-[#1A3263]">{language==='ta' ? 'கல்லூரி பரிந்துரைகள் கணக்கு உருவாக்கிய பிறகு கிடைக்கும்' : 'Your matched colleges will appear after account creation'}</div>
                        <p className="text-[11px] text-[#547792] mt-1 leading-[1.5]">{language==='ta' ? 'உங்கள் மதிப்பெண்கள், கனவு பாடம் மற்றும் மாவட்ட விருப்பத்தின் அடிப்படையில் கல்லூரிகள் பரிந்துரைக்கப்படும்.' : 'We’ll use your marks, dream course and preferred district to rank colleges once your account is created.'}</p>
                      </div>
                    </div>
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
                  <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><BadgeCheck size={20} className="text-[#547792]" /> {t('reviewDetails')}</h2>
                </div>

                <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6 shadow-sm space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 text-[11px]">
                    <div className="space-y-2">
                      <div className="font-bold text-[#1A3263] text-[12px]">{language==='ta' ? 'அடிப்படை விவரங்கள் & கனவு பாடம்' : 'Basic Details & Dream Course'}</div>
                      <div><span className="text-[#547792]">Name:</span> <span className="font-bold text-[#1A3263]">{formData.fullName}</span></div>
                      <div><span className="text-[#547792]">City:</span> <span className="font-bold text-[#1A3263]">{formData.city}</span> · <span className="text-[#547792]">Dream Course:</span> <span className="font-bold bg-[#FAB95B] px-2 py-0.5 rounded-full">{formData.interestedCourse}</span></div>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-[#1A3263] text-[12px]">Marks &amp; Percentage</div>
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
