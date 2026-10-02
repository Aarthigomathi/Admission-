import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check, ChevronUp, Mail, MapPin, Phone, Play, Send, X } from 'lucide-react'

const CAMPUS_IMAGE = '/images/karpagam-hero-campus-hd.png'
const CAMPUS_IMAGE_FALLBACK = '/images/karpagam-event-campus.jpg'
const KCE_LOGO = 'https://kce.ac.in/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FKCE-logo-color.4bf34a82.png&w=384&q=75'
const ADMISSION_POSTER = 'https://kce.ac.in/images/popup-image.jpeg'
const PROGRAMME_ART = 'https://admission.kce.ac.in/assets/img/programme.png'
const CAMPUS_VIDEO = 'https://www.youtube.com/watch?v=Y6mFRh3nPG0'
const CAMPUS_VIDEO_THUMBNAIL = 'https://img.youtube.com/vi/Y6mFRh3nPG0/hqdefault.jpg'
const APPLY_LINK = '/college/karpagam-college-of-engineering/apply'
const COLLEGE_HOME_LINK = '/college/karpagam-college-of-engineering'
const APPLICATIONS_KEY = 'tn_kce_admission_applications'
const APPLICATION_BACKGROUND = '/images/karpagam-admission-event-hd.jpg'

const ugCourses = [
  'B.E. Civil Engineering',
  'B.E. Computer Science and Engineering',
  'B.E. Computer Science and Engineering (CyberSecurity)',
  'B.E. Electronics and Communication Engineering',
  'B.E. Electrical and Electronics Engineering',
  'B.E. Electronics Engineering (VLSI Design and Technology)',
  'B.E. Mechanical Engineering',
  'B.Tech. Artificial Intelligence and Data Sciences',
  'B.Tech. Information Technology',
]

const pgCourses = [
  'MBA – Master of Business Administration',
  'MCA – Master of Computer Application',
]

const recruiters = [
  { name: 'accenture', style: 'font-extrabold tracking-tight text-[#4b246b]' },
  { name: 'TITAN', style: 'font-serif font-bold tracking-[0.2em] text-[#247474]' },
  { name: 'Capgemini', style: 'font-semibold text-[#1689a5]' },
  { name: 'HEXAWARE', style: 'font-extrabold tracking-tight text-[#2b5369]' },
  { name: 'ASHOK LEYLAND', style: 'font-bold text-[#33465c]' },
  { name: 'INDOSHELL', style: 'font-extrabold tracking-tight text-[#23364c]' },
  { name: 'NEEFAMIC', style: 'font-extrabold italic text-[#527d65]' },
  { name: 'PRESIDIO', style: 'font-semibold tracking-[0.12em] text-[#286478]' },
]

function CourseGroup({ title, courses }) {
  return (
    <div>
      <h3 className="bg-[#f5e9e1] px-3 py-2 text-[15px] font-semibold uppercase text-[#111827]">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {courses.map((course) => (
          <li key={course} className="flex items-start gap-3 text-[14px] leading-6 text-[#151923] sm:text-[15px]">
            <span className="mt-[3px] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#24aa68] text-white">
              <Check size={13} strokeWidth={3} aria-hidden="true" />
            </span>
            <span>{course}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BrandWordmark({ name, style }) {
  return (
    <div className="flex h-[74px] items-center justify-center border border-slate-200 bg-white px-2 text-center shadow-[0_1px_4px_rgba(15,23,42,0.06)] sm:h-[86px]">
      <span className={`text-[12px] sm:text-[14px] ${style}`}>{name}</span>
    </div>
  )
}

function AdmissionPosterFallback({ onApply }) {
  return (
    <div className="flex min-h-[min(76vh,680px)] w-[min(88vw,460px)] flex-col items-center justify-center bg-white px-8 py-10 text-center">
      <div className="text-[13px] font-bold tracking-[0.22em] text-[#d35d21]">KARPAGAM COLLEGE OF ENGINEERING</div>
      <div className="mt-8 text-[14px] font-semibold uppercase tracking-[0.2em] text-[#24477b]">Admissions Open</div>
      <h2 className="mt-3 text-[36px] font-extrabold leading-tight text-[#17233b] sm:text-[44px]">Design your engineering future</h2>
      <p className="mt-4 text-[15px] leading-6 text-slate-600">Explore undergraduate and postgraduate programmes at KCE.</p>
      <Link to={APPLY_LINK} onClick={onApply} className="mt-8 inline-flex min-h-12 items-center justify-center bg-[#f36c17] px-7 text-[14px] font-bold text-white">Apply Now</Link>
    </div>
  )
}

const referralOptions = [
  'College Admission Portal', 'Google Search', 'KCE Official Website',
  'Social Media (Instagram / Facebook)', 'YouTube', 'WhatsApp',
  'Friend / Family', 'KCE Student / Alumni', 'School / Career Counsellor',
  'Career Camp / Education Fair / School Visit', 'Other'
]

const emptyApplication = {
  name: '', email: '', gender: '', state: '', districtCity: '', referralSources: [], otherReferral: ''
}

function KarpagamApplicationForm() {
  const [formData, setFormData] = useState(emptyApplication)
  const [formError, setFormError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData(previous => ({ ...previous, [name]: value }))
    setFormError('')
    setSubmitted(false)
  }

  const toggleReferral = (source) => {
    setFormData(previous => ({
      ...previous,
      referralSources: previous.referralSources.includes(source)
        ? previous.referralSources.filter(item => item !== source)
        : [...previous.referralSources, source]
    }))
    setFormError('')
    setSubmitted(false)
  }

  const clearForm = () => {
    setFormData({ ...emptyApplication, referralSources: [] })
    setFormError('')
    setSubmitted(false)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (formData.referralSources.length === 0) {
      setFormError('Select at least one option for how you heard about KCE.')
      return
    }

    const application = { ...formData, id: Date.now(), submittedAt: new Date().toISOString() }
    try {
      const saved = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]')
      const applications = Array.isArray(saved) ? saved : []
      localStorage.setItem(APPLICATIONS_KEY, JSON.stringify([...applications, application]))
      setFormError('')
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setFormError('Could not save this form in the browser. Please try again.')
    }
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-fixed px-4 pb-10 sm:px-6"
      style={{ backgroundImage: `linear-gradient(rgba(9, 22, 38, 0.58), rgba(9, 22, 38, 0.64)), url("${APPLICATION_BACKGROUND}")` }}
    >
      <header className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 py-5 sm:py-7">
        <Link to={COLLEGE_HOME_LINK} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to Karpagam College website" className="flex items-center gap-3 rounded-[12px] bg-white px-4 py-2.5 shadow-lg">
          <span className="grid h-10 w-10 place-items-center rounded-[10px] bg-[#1A3263] text-[18px] font-extrabold text-[#FAB95B]">K</span>
          <span className="text-[11px] font-bold leading-tight tracking-wide text-[#1A3263] sm:text-[13px]">KARPAGAM COLLEGE<br />OF ENGINEERING</span>
        </Link>
        <Link to={COLLEGE_HOME_LINK} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex h-10 items-center gap-2 rounded-full border border-white/60 bg-[#101f31]/50 px-4 text-[12px] font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[#1A3263] sm:h-11 sm:px-5 sm:text-[13px]">
          <ArrowLeft size={15} /> <span>College website</span>
        </Link>
      </header>

      <div className="mx-auto max-w-[760px] space-y-3 sm:space-y-4">
        <section className="overflow-hidden rounded-[8px] border-t-[8px] border-[#247a36] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e96e2c]">Admissions 2026–2027</p>
            <h1 className="mt-2 text-[24px] font-semibold leading-tight text-[#202124] sm:text-[32px]">Karpagam College of Engineering (KCE)</h1>
            <p className="mt-2 text-[14px] text-[#5f6368] sm:text-[15px]">Admission enquiry form</p>
            <div className="mt-5 border-t border-[#dadce0] pt-4 text-[12px] leading-5 text-[#5f6368] sm:text-[13px]">
              <span className="font-semibold text-[#d93025]">*</span> Indicates required question
            </div>
          </div>
        </section>

        {submitted && (
          <div role="status" className="rounded-[12px] border border-emerald-200 bg-emerald-50 px-5 py-4 text-[13px] font-semibold text-emerald-800 shadow-sm">
            Your enquiry details are saved in this browser. This demo form is not connected to KCE’s admission system.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <section className="rounded-[8px] bg-white px-5 py-5 shadow-[0_8px_28px_rgba(0,0,0,0.12)] sm:px-8 sm:py-6">
            <label htmlFor="kce-application-name" className="block text-[14px] font-medium text-[#202124] sm:text-[16px]">Name <span className="text-[#d93025]">*</span></label>
            <input id="kce-application-name" name="name" value={formData.name} onChange={updateField} required autoComplete="name" className="mt-4 h-10 w-full max-w-[440px] border-0 border-b border-[#dadce0] bg-transparent px-0 text-[14px] text-[#202124] outline-none placeholder:text-[#777] focus:border-b-2 focus:border-[#1a73e8]" placeholder="Your answer" />
          </section>

          <section className="rounded-[8px] bg-white px-5 py-5 shadow-[0_8px_28px_rgba(0,0,0,0.12)] sm:px-8 sm:py-6">
            <label htmlFor="kce-application-email" className="block text-[14px] font-medium text-[#202124] sm:text-[16px]">Email address <span className="text-[#d93025]">*</span></label>
            <input id="kce-application-email" name="email" type="email" value={formData.email} onChange={updateField} required autoComplete="email" className="mt-4 h-10 w-full max-w-[440px] border-0 border-b border-[#dadce0] bg-transparent px-0 text-[14px] text-[#202124] outline-none placeholder:text-[#777] focus:border-b-2 focus:border-[#1a73e8]" placeholder="Your answer" />
            <p className="mt-2 text-[11px] text-[#70757a]">Your email is kept with this enquiry and is not shown publicly.</p>
          </section>

          <fieldset aria-labelledby="kce-application-gender-label" className="rounded-[8px] bg-white px-5 py-5 shadow-[0_8px_28px_rgba(0,0,0,0.12)] sm:px-8 sm:py-6">
            <p id="kce-application-gender-label" className="text-[14px] font-medium text-[#202124] sm:text-[16px]">Gender <span className="text-[#d93025]">*</span></p>
            <div className="mt-4 space-y-3">
              {['Female', 'Male', 'Other'].map(option => (
                <label key={option} className="flex min-h-8 cursor-pointer items-center gap-3 text-[13px] text-[#3c4043] sm:text-[14px]">
                  <input type="radio" name="gender" value={option} checked={formData.gender === option} onChange={updateField} required className="h-[18px] w-[18px] accent-[#1a73e8]" />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          <section className="rounded-[8px] bg-white px-5 py-5 shadow-[0_8px_28px_rgba(0,0,0,0.12)] sm:px-8 sm:py-6">
            <label htmlFor="kce-application-state" className="block text-[14px] font-medium text-[#202124] sm:text-[16px]">State <span className="text-[#d93025]">*</span></label>
            <input id="kce-application-state" name="state" value={formData.state} onChange={updateField} required autoComplete="address-level1" className="mt-4 h-10 w-full max-w-[440px] border-0 border-b border-[#dadce0] bg-transparent px-0 text-[14px] text-[#202124] outline-none placeholder:text-[#777] focus:border-b-2 focus:border-[#1a73e8]" placeholder="Your answer" />
          </section>

          <section className="rounded-[8px] bg-white px-5 py-5 shadow-[0_8px_28px_rgba(0,0,0,0.12)] sm:px-8 sm:py-6">
            <label htmlFor="kce-application-district" className="block text-[14px] font-medium text-[#202124] sm:text-[16px]">District or City <span className="text-[#d93025]">*</span></label>
            <input id="kce-application-district" name="districtCity" value={formData.districtCity} onChange={updateField} required autoComplete="address-level2" className="mt-4 h-10 w-full max-w-[440px] border-0 border-b border-[#dadce0] bg-transparent px-0 text-[14px] text-[#202124] outline-none placeholder:text-[#777] focus:border-b-2 focus:border-[#1a73e8]" placeholder="Your answer" />
          </section>

          <fieldset aria-labelledby="kce-application-referral-label" className="rounded-[8px] bg-white px-5 py-5 shadow-[0_8px_28px_rgba(0,0,0,0.12)] sm:px-8 sm:py-6">
            <p id="kce-application-referral-label" className="text-[14px] font-medium leading-6 text-[#202124] sm:text-[16px]">How did you know about our college? <span className="text-[#d93025]">*</span></p>
            <p className="mt-1 text-[11px] text-[#70757a] sm:text-[12px]">Select all that apply.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {referralOptions.map(option => (
                <label key={option} className="flex min-h-9 cursor-pointer items-center gap-3 rounded-[6px] px-1 text-[12px] text-[#3c4043] hover:bg-[#f7f9fc] sm:text-[13px]">
                  <input type="checkbox" checked={formData.referralSources.includes(option)} onChange={() => toggleReferral(option)} className="h-[18px] w-[18px] shrink-0 accent-[#1a73e8]" />
                  {option}
                </label>
              ))}
            </div>
            {formData.referralSources.includes('Other') && (
              <input name="otherReferral" value={formData.otherReferral} onChange={updateField} aria-label="Other referral source" className="mt-3 h-10 w-full max-w-[440px] border-0 border-b border-[#dadce0] bg-transparent px-0 text-[13px] outline-none focus:border-b-2 focus:border-[#1a73e8]" placeholder="Please specify" />
            )}
            {formError && <p role="alert" className="mt-4 rounded-[8px] bg-red-50 px-3 py-2 text-[12px] text-red-700">{formError}</p>}
          </fieldset>

          <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-2">
            <button type="submit" className="inline-flex h-11 items-center gap-2 rounded-[5px] bg-[#247a36] px-6 text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#1c642c]">
              <Send size={15} /> Submit
            </button>
            <button type="button" onClick={clearForm} className="h-10 px-2 text-[12px] font-medium text-[#247a36] hover:underline">Clear form</button>
          </div>
        </form>

        <p className="px-2 text-center text-[11px] leading-5 text-white/90 drop-shadow sm:text-[12px]">Preview only: entries are stored in this browser and are not sent to the college. Do not enter sensitive information.</p>
      </div>
    </main>
  )
}

export default function KarpagamCollegeHome({ section }) {
  const [popupOpen, setPopupOpen] = useState(false)
  const [popupSeen, setPopupSeen] = useState(false)
  const [posterFailed, setPosterFailed] = useState(false)
  const [logoFailed, setLogoFailed] = useState(false)
  const [campusImage, setCampusImage] = useState(CAMPUS_IMAGE)
  const [showBackToTop, setShowBackToTop] = useState(false)

  const dismissPopup = () => {
    setPopupOpen(false)
    setPopupSeen(true)
  }

  const handleApplyClick = () => {
    dismissPopup()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const previousTitle = document.title
    document.title = section === 'apply'
      ? 'Apply to Karpagam College of Engineering | 2026–2027'
      : 'Karpagam College of Engineering | Admissions 2026–2027'
    return () => {
      document.title = previousTitle
    }
  }, [section])

  useEffect(() => {
    if (section === 'apply') return undefined
    const timeout = window.setTimeout(() => setPopupOpen(true), 2000)
    return () => window.clearTimeout(timeout)
  }, [section])

  useEffect(() => {
    if (!popupOpen) return undefined
    const previousOverflow = document.body.style.overflow
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setPopupOpen(false)
        setPopupSeen(true)
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [popupOpen])

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 420)
    updateBackToTop()
    window.addEventListener('scroll', updateBackToTop, { passive: true })
    return () => window.removeEventListener('scroll', updateBackToTop)
  }, [])

  const fallBackCampusImage = (event) => {
    if (!String(event.currentTarget.src).endsWith(CAMPUS_IMAGE_FALLBACK)) {
      setCampusImage(CAMPUS_IMAGE_FALLBACK)
    }
  }

  if (section === 'apply') return <KarpagamApplicationForm />

  return (
    <main className="min-h-screen overflow-x-hidden bg-white font-sans text-[#111827]">
      <section id="home" className="relative isolate flex min-h-[680px] items-center overflow-hidden bg-[#202b35] sm:min-h-[740px] lg:min-h-[780px]">
        <img
          src={campusImage}
          onError={fallBackCampusImage}
          alt="Karpagam College of Engineering campus"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,23,33,0.7)_0%,rgba(18,25,34,0.64)_46%,rgba(18,25,34,0.52)_100%)]" />
        <header className="absolute inset-x-0 top-0 z-10">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-5 sm:px-8 sm:py-7 lg:px-12">
            <a href="#home" aria-label="Karpagam College of Engineering home" className="flex h-[74px] w-[220px] items-center justify-center rounded-[4px] bg-white px-3 shadow-lg sm:h-[88px] sm:w-[288px]">
              {logoFailed ? (
                <span className="text-center text-[12px] font-extrabold leading-tight tracking-[0.12em] text-[#17406b] sm:text-[15px]">KARPAGAM<br />COLLEGE OF ENGINEERING</span>
              ) : (
                <img src={KCE_LOGO} onError={() => setLogoFailed(true)} alt="Karpagam College of Engineering" className="max-h-full w-full object-contain" />
              )}
            </a>
            <div className="flex shrink-0 items-center gap-2 sm:gap-5">
              <Link to={APPLY_LINK} onClick={handleApplyClick} className="inline-flex h-10 items-center justify-center border border-[#f07832] px-3 text-[12px] font-medium text-white transition hover:bg-[#f07832] sm:h-[52px] sm:min-w-[142px] sm:px-5 sm:text-[16px]">Apply Now</Link>
              <a href="tel:+919150099891" className="inline-flex h-10 items-center justify-center border border-[#f07832] px-3 text-[12px] font-medium text-white transition hover:bg-[#f07832] sm:h-[52px] sm:min-w-[110px] sm:px-5 sm:text-[16px]">Call Us</a>
            </div>
          </div>
        </header>

        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 px-5 pb-12 pt-36 sm:px-8 lg:grid-cols-2 lg:px-12">
          <div className="hidden lg:block" />
          <div className="max-w-[650px] text-white lg:justify-self-end">
            <p className="text-[17px] font-medium tracking-wide text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.72)] sm:text-[21px]">Admissions Open for 2026–2027</p>
            <h1 className="mt-4 text-[42px] font-medium leading-[1.08] tracking-[-0.035em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.72)] sm:text-[58px] lg:text-[64px]">Design Your<br className="hidden sm:block" /> Engineering Future<br className="hidden sm:block" /> With KCE</h1>
            {popupSeen && (
              <div data-testid="hero-cta-actions" className="mt-8 flex flex-wrap gap-3 sm:gap-7 lg:justify-end">
                <Link to={APPLY_LINK} onClick={handleApplyClick} className="inline-flex h-[54px] min-w-[154px] items-center justify-center rounded-[6px] bg-[#ff6813] px-7 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:bg-[#e95604] hover:shadow-xl">Apply Now</Link>
                <a href="tel:+919150099891" className="inline-flex h-[54px] min-w-[138px] items-center justify-center rounded-[6px] bg-[#20ad62] px-7 text-[15px] font-bold text-white shadow-[0_10px_28px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:bg-[#188b4d] hover:shadow-xl">Call Us</a>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#f8e9e2] py-14 sm:py-[66px]">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
          <h2 className="text-center text-[34px] font-medium tracking-tight text-[#e96e2c] sm:text-[42px]">About Us</h2>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.04fr_1fr] lg:gap-14">
            <a href={CAMPUS_VIDEO} target="_blank" rel="noreferrer" aria-label="Watch Karpagam College of Engineering campus video on YouTube" className="group relative block aspect-video overflow-hidden bg-[#17243a] shadow-sm">
              <img src={CAMPUS_VIDEO_THUMBNAIL} alt="Karpagam College of Engineering campus video" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#061329]/70 via-transparent to-[#061329]/15" />
              <div className="absolute inset-y-0 left-0 flex w-[48%] flex-col justify-center bg-[#ed002e]/90 px-5 text-white sm:px-8">
                <span className="text-[25px] font-extrabold sm:text-[32px]">KCE</span>
                <span className="mt-2 text-[14px] font-semibold leading-tight sm:text-[19px]">Creating the Future Engineers<br />Explore Beyond Books</span>
                <span className="mt-4 inline-flex w-fit bg-[#ffd21c] px-3 py-1 text-[12px] font-extrabold text-[#151515] sm:text-[15px]">Explore Our Campus!</span>
              </div>
              <span className="absolute left-1/2 top-1/2 grid h-[58px] w-[76px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[15px] bg-[#ff0033] text-white shadow-xl transition group-hover:scale-110">
                <Play size={26} fill="currentColor" strokeWidth={0} aria-hidden="true" />
              </span>
              <span className="absolute bottom-4 right-4 text-[12px] font-semibold text-white drop-shadow">Watch on ▶ YouTube</span>
            </a>
            <div className="lg:pl-1">
              <h3 className="text-[22px] font-medium text-[#171923] sm:text-[25px]">Welcome To KCE</h3>
              <p className="mt-3 text-[15px] leading-[1.75] text-[#70757d] sm:text-[16px]">The Karpagam College of Engineering, established in the Year 2000, is an Autonomous institution, Approved by AICTE, New Delhi and Affiliated to Anna University, Chennai. The college offers various Under Graduate and Post Graduate Engineering programmes.</p>
              <p className="mt-6 text-[15px] leading-[1.75] text-[#70757d] sm:text-[16px]">The College is accredited by NAAC with ‘A+’ Grade, TCS and Wipro with 4500 students and 426 teaching and non-teaching staff members, Karpagam College of Engineering strives to impart quality education and an excellent career start to all its students.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="programmes" className="bg-[#080e20] py-12 text-white sm:py-14">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
          <h2 className="text-center text-[34px] font-medium tracking-tight sm:text-[42px]">Programmes</h2>
          <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
            <div className="rounded-[10px] bg-white p-6 text-[#111827] shadow-xl sm:p-8 lg:p-10">
              <CourseGroup title="UG Courses" courses={ugCourses} />
              <div className="mt-7">
                <CourseGroup title="PG Courses" courses={pgCourses} />
              </div>
            </div>
            <div className="flex min-h-[260px] items-center justify-center px-2 sm:min-h-[350px] lg:min-h-[490px]">
              <img src={PROGRAMME_ART} alt="Ideas and learning illustration" className="max-h-[440px] w-full max-w-[530px] object-contain" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      <section id="admissions" className="bg-gradient-to-r from-[#0d4ca2] to-[#0758c4] py-10 text-white sm:py-12">
        <div className="mx-auto flex max-w-[1360px] flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <h2 className="text-[30px] font-medium sm:text-[34px]">Admissions Open</h2>
            <p className="mt-2 text-[16px] sm:text-[18px]">Begin your academic journey at Karpagam College of Engineering</p>
          </div>
          <Link to={APPLY_LINK} onClick={handleApplyClick} className="inline-flex h-[54px] min-w-[172px] items-center justify-center bg-[#20ad62] px-7 text-[15px] font-bold text-white transition hover:bg-[#188b4d]">Apply Now</Link>
        </div>
      </section>

      <section id="recruiters" className="bg-white py-12 sm:py-14">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
          <h2 className="text-center text-[32px] font-medium tracking-tight text-[#e96e2c] sm:text-[40px]">Our Prominent Recruiters</h2>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5 lg:grid-cols-8">
            {recruiters.map((recruiter) => <BrandWordmark key={recruiter.name} {...recruiter} />)}
          </div>
        </div>
      </section>

      <footer id="admission-support-line" className="bg-[#f8e9e2] py-12 sm:py-14">
        <div className="mx-auto grid grid-cols-1 gap-8 max-w-[1360px] px-5 text-center sm:grid-cols-3 sm:gap-5 sm:px-8 md:gap-6 lg:px-12">
          <div className="flex flex-col items-center">
            <MapPin size={28} fill="#ef4358" className="text-[#ef4358]" aria-hidden="true" />
            <h2 className="mt-2 text-[18px] font-medium text-[#181a23]">Address</h2>
            <p className="mt-5 max-w-[270px] text-[16px] leading-[1.65] text-[#74777e]">Myleripalayam Village,<br />Othakkal Mandapam Post,<br />Coimbatore – 641032,<br />Tamil Nadu, India.</p>
          </div>
          <div className="flex flex-col items-center">
            <Phone size={27} fill="#ef4358" className="text-[#ef4358]" aria-hidden="true" />
            <h2 className="mt-2 text-[18px] font-medium text-[#181a23]">Admission Support Line</h2>
            <a href="tel:+919150099891" className="mt-5 text-[16px] text-[#74777e] transition hover:text-[#d65226]">91500 99891</a>
          </div>
          <div className="flex flex-col items-center">
            <Mail size={28} fill="#ef4358" className="text-[#ef4358]" aria-hidden="true" />
            <h2 className="mt-2 text-[18px] font-medium text-[#181a23]">Email ID</h2>
            <a href="mailto:info@kce.ac.in" className="mt-5 text-[16px] text-[#74777e] transition hover:text-[#d65226]">info@kce.ac.in</a>
          </div>
        </div>
      </footer>

      {showBackToTop && (
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" className="fixed bottom-5 right-5 z-30 grid h-11 w-11 place-items-center rounded-full bg-[#13b6a6] text-white shadow-lg transition hover:bg-[#0e9e91] sm:bottom-7 sm:right-7">
          <ChevronUp size={21} aria-hidden="true" />
        </button>
      )}

      {popupOpen && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) dismissPopup()
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-cover bg-center px-4 py-5"
          style={{ backgroundImage: `linear-gradient(rgba(7, 15, 27, 0.66), rgba(7, 15, 27, 0.66)), url("${campusImage}")` }}
        >
          <div role="dialog" aria-modal="true" aria-label="Karpagam College of Engineering admission announcement" onClick={dismissPopup} className="relative my-auto max-h-[90dvh] max-w-[92vw] cursor-pointer overflow-hidden rounded-[10px] bg-white shadow-[0_24px_90px_rgba(0,0,0,0.4)]">
            <button type="button" onClick={dismissPopup} aria-label="Close admission popup" className="absolute right-2 top-2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/95 text-[#17233b] shadow-md transition hover:bg-[#f36c17] hover:text-white">
              <X size={22} aria-hidden="true" />
            </button>
            {posterFailed ? (
              <AdmissionPosterFallback onApply={handleApplyClick} />
            ) : (
              <img src={ADMISSION_POSTER} alt="Karpagam College of Engineering admission enquiry. Tap to view Apply Now and Call Us options." onError={() => setPosterFailed(true)} className="block max-h-[88dvh] w-auto max-w-[92vw] object-contain" />
            )}
          </div>
        </div>
      )}
    </main>
  )
}
