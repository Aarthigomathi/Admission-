import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ChevronDown, Phone, Mail, LayoutDashboard } from 'lucide-react'

function BrandIcon({ name, size = 15, className = '' }) {
  const paths = {
    facebook: 'M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z',
    instagram: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.4-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z',
    x: 'M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82L5 21.75H1.68l7.73-8.84L1.25 2.25h6.83l4.71 6.23zm-1.16 17.52h1.83L7.08 4.13H5.12z',
    youtube: 'M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81zM9.55 15.57V8.43L15.82 12z',
    linkedin: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0z'
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><path d={paths[name]} /></svg>
}

export default function CollegeHeader({ college, homePage }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const shortName = (college.settings?.shortName || college.shortName || college.name?.split(' ')[0] || 'College')

  // KCE-style nav - every id exists on CollegePage.jsx
  const navigation = [
    { label: 'Home', id: 'home' },
    {
      label: 'About', id: 'about',
      children: [
        { label: 'About College', id: 'about' },
        { label: 'Vision & Mission', id: 'about' },
        { label: 'Managing Trustees', id: 'management' },
        { label: 'Principals', id: 'principal' },
      ],
    },
    {
      label: 'Academics', id: 'departments',
      children: [
        { label: 'Departments', id: 'departments' },
        { label: 'Programmes', id: 'programmes' },
        { label: 'Library', id: 'library' },
        { label: 'IQAC', id: 'accreditation' },
      ],
    },
    { label: 'AICTE IDEA Lab', id: 'centres' },
    { label: 'Research', id: 'centres' },
    { label: 'IQAC', id: 'accreditation' },
    {
      label: 'Life @ ' + shortName, id: 'campus',
      children: [
        { label: 'Campus & Environment', id: 'campus' },
        { label: 'Hostels', id: 'hostels' },
        { label: 'Sports', id: 'sports' },
        { label: 'Gallery', id: 'gallery' },
      ],
    },
    {
      label: 'Placement', id: 'placements',
      children: [
        { label: 'Placements', id: 'placements' },
        { label: 'Industry & ' + shortName, id: 'industry' },
        { label: 'Placement Records', id: 'placement-records' },
        { label: 'Alumni', id: 'alumni' },
      ],
    },
    {
      label: 'Media', id: 'news',
      children: [
        { label: 'Latest News', id: 'news' },
        { label: 'Events', id: 'events' },
        { label: 'Student Achievements', id: 'achievements' },
      ],
    },
    {
      label: 'Examinations', id: 'admissions',
      children: [
        { label: 'Admissions', id: 'admissions' },
        { label: 'Examination Schedule', id: 'admissions' },
      ],
    },
    { label: 'Contact', id: 'contact' },
  ]

  const goSection = (id) => {
    setMobileOpen(false)
    setActiveDropdown(null)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (window.history && window.history.replaceState) window.history.replaceState(null, '', '#' + id)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const phone = ((college.contact && college.contact.phone) || college.phone || '').split('/')[0].trim()
  const email = (((college.contact && college.contact.email) || college.email || '').split(' / ')[0]).split('/')[0].trim()
  const tneaCode = homePage?.tneaCode || college.tneaCode || ''
  const badges = (homePage?.accreditationLogos || []).slice(0, 2)

  return (
    <div className="sticky top-0 z-40 w-full shadow-md">
      {/* White top bar - logo + TNEA code + contact (KCE style) */}
      <div className="bg-white border-b border-[#E8E2DB]">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="flex h-[76px] lg:h-[84px] items-center gap-4">
            {/* Logo + name + tagline + badges */}
            <a href="#home" onClick={(e) => { e.preventDefault(); goSection('home') }} className="flex items-center gap-3 min-w-0 cursor-pointer shrink-0">
              <div className="h-[52px] w-[52px] rounded-[12px] overflow-hidden border-2 border-[#E8E2DB] bg-[#E8E2DB] shrink-0">
                {college.branding?.logo ? <img src={college.branding.logo} alt={college.name} className="h-full w-full object-cover" /> : <div className="h-full w-full grid place-items-center bg-[#1A3263] text-[#FAB95B] font-extrabold text-[20px]">{(college.name || 'C')[0]}</div>}
              </div>
              <div className="min-w-0 leading-tight hidden sm:block">
                <div className="font-extrabold text-[16px] lg:text-[19px] tracking-tight text-[#1A3263] truncate max-w-[330px]">{college.name}</div>
                {college.tagline ? <div className="text-[9px] lg:text-[10px] font-bold text-[#547792] tracking-[0.14em] uppercase mt-0.5 truncate max-w-[330px]">{college.tagline}</div> : null}
              </div>
              <div className="hidden xl:flex items-center gap-2 ml-2">
                {badges.length > 0 ? badges.map((b, i) => (
                  <img key={i} src={b} className="h-11 w-auto object-contain" alt={'badge ' + (i + 1)} />
                )) : (
                  <span className="h-11 px-3 flex items-center rounded-[8px] border-2 border-[#E8E2DB] text-[10px] font-extrabold uppercase tracking-wide text-[#547792]">NAAC A+</span>
                )}
              </div>
            </a>

            {/* TNEA code - center */}
            {tneaCode ? (
              <div className="hidden lg:flex flex-1 flex-col items-center justify-center">
                <div className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#1A3263]">TNEA Code</div>
                <div className="text-[26px] font-extrabold text-[#FAB95B] leading-none mt-0.5">{tneaCode}</div>
              </div>
            ) : (
              <div className="flex-1"></div>
            )}

            {/* Contact + socials + admin */}
            <div className="hidden md:flex items-center gap-4 lg:gap-5 text-[#1A3263] shrink-0">
              {phone ? <span className="flex items-center gap-2 text-[12px] font-extrabold"><Phone size={14} className="text-[#FAB95B]" />{phone}</span> : null}
              {phone ? <span className="h-6 w-px bg-[#E8E2DB]"></span> : null}
              {email ? (
                <>
                  <span className="hidden xl:flex items-center gap-2 text-[12px] font-extrabold"><Mail size={14} className="text-[#FAB95B]" />{email}</span>
                  <span className="hidden xl:block h-6 w-px bg-[#E8E2DB]"></span>
                </>
              ) : null}
              <span className="hidden 2xl:flex items-center gap-3">
                <a href="#" className="text-[#1A3263] hover:text-[#FAB95B] transition-colors" aria-label="Facebook"><BrandIcon name="facebook" /></a>
                <a href="#" className="text-[#1A3263] hover:text-[#FAB95B] transition-colors" aria-label="Instagram"><BrandIcon name="instagram" /></a>
                <a href="#" className="text-[#1A3263] hover:text-[#FAB95B] transition-colors" aria-label="X"><BrandIcon name="x" size={14} /></a>
                <a href="#" className="text-[#1A3263] hover:text-[#FAB95B] transition-colors" aria-label="YouTube"><BrandIcon name="youtube" /></a>
              </span>
              <Link to="/admin" className="h-9 px-4 inline-flex items-center gap-1.5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-extrabold hover:bg-[#1A3263]/90 transition-colors">
                <LayoutDashboard size={13} /> Admin
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden h-10 w-10 grid place-items-center rounded-full bg-[#1A3263] text-[#FAB95B]" aria-label="Menu">
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden h-10 w-10 grid place-items-center rounded-full bg-[#1A3263] text-[#FAB95B] shrink-0" aria-label="Menu">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Gold nav bar (KCE style) */}
      <nav className="bg-[#FAB95B] hidden lg:block">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-0.5">
            {navigation.map((item) => (
              <div key={item.label} className="relative" onMouseEnter={() => item.children && setActiveDropdown(item.label)} onMouseLeave={() => setActiveDropdown(null)}>
                <a
                  href={'#' + item.id}
                  onClick={(e) => { e.preventDefault(); goSection(item.id) }}
                  className={`flex items-center gap-1.5 px-3.5 lg:px-4 h-[46px] text-[12px] lg:text-[12.5px] font-extrabold uppercase tracking-[0.03em] transition-colors ${item.id === 'home' ? 'bg-[#1A3263] text-[#FAB95B]' : 'text-[#1A3263] hover:bg-[#1A3263]/10'}`}
                >
                  {item.label}
                  {item.children ? <ChevronDown size={12} className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} /> : null}
                </a>
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-0 w-[248px] rounded-b-[14px] bg-white border-2 border-t-0 border-[#E8E2DB] shadow-xl p-2 z-50">
                    {item.children.map(child => (
                      <a key={child.label} href={'#' + child.id} onClick={(e) => { e.preventDefault(); goSection(child.id) }} className="block px-4 py-2.5 rounded-[10px] text-[12.5px] font-bold text-[#1A3263] hover:bg-[#E8E2DB] transition-colors">
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#1A3263] border-t border-[#FAB95B]/30 max-h-[70vh] overflow-y-auto">
          <div className="p-4 space-y-1">
            {navigation.map(item => (
              <a key={item.label} href={'#' + item.id} onClick={(e) => { e.preventDefault(); goSection(item.id) }} className="flex px-4 py-3 rounded-[12px] hover:bg-white/10 font-extrabold text-white text-[13px] uppercase tracking-wide">
                {item.label}
              </a>
            ))}
            <Link to="/admin" className="mt-3 flex h-11 items-center justify-center gap-2 rounded-full bg-[#FAB95B] text-[#1A3263] font-extrabold text-[12px]">
              <LayoutDashboard size={15} /> Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
