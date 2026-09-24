import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ChevronDown, BadgeCheck, MapPin, Phone, Mail, LayoutDashboard } from 'lucide-react'

export default function CollegeHeader({ college }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  // Every id below exists on CollegePage.jsx as <section id="...">
  const navigation = [
    { label: "Home", id: "home" },
    {
      label: "About",
      id: "about",
      children: [
        { label: "About College", id: "about" },
        { label: "Vision & Mission", id: "about" },
        { label: "Managing Trustees", id: "management" },
        { label: "Principals", id: "principal" },
      ]
    },
    { label: "Programmes", id: "programmes" },
    { label: "Departments", id: "departments" },
    { label: "Research", id: "centres" },
    { label: "Campus", id: "campus" },
    { label: "Placements", id: "placements" },
    { label: "Events", id: "events" },
    { label: "Gallery", id: "gallery" },
    { label: "Contact", id: "contact" },
  ]

  // Smooth scroll to the section on the page (works on touch + click)
  const goSection = (id) => {
    setMobileOpen(false)
    setActiveDropdown(null)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', `#${id}`)
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const phone = (college.contact?.phone || college.phone || '').split('/')[0].trim()
  const email = (college.contact?.email || college.email || '').split('/')[0].trim()

  return (
    <div className="sticky top-0 z-40 w-full shadow-sm">
      {/* White top bar - logo + contact (KCE style) */}
      <div className="bg-white border-b border-[#E8E2DB]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between gap-6">
            <a href="#home" onClick={(e) => { e.preventDefault(); goSection('home') }} className="flex items-center gap-3 min-w-0 cursor-pointer">
              <div className="h-[50px] w-[50px] rounded-[14px] overflow-hidden border-2 border-[#e8e2db] bg-[#e8e2db] shadow-sm shrink-0">
                {college.branding?.logo ? <img src={college.branding.logo} alt={college.name} className="h-full w-full object-cover" /> : <div className="h-full w-full grid place-items-center bg-[#1A3263] text-[#FAB95B] font-extrabold text-[18px]">{college.name?.[0] || 'C'}</div>}
              </div>
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-[17px] lg:text-[19px] tracking-tight truncate text-[#1a3263]">
                    {college.name}
                  </h1>
                  <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e8e2db] text-[#1a3263] border text-[10px] font-extrabold">
                    <BadgeCheck size={10} /> {college.accreditation?.split('•')[0]?.trim() || 'Accredited'}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-[#547792] truncate max-w-[380px]">{college.tagline} • Est. {college.established}</div>
              </div>
            </a>

            <div className="hidden md:flex items-center gap-6 text-[#1a3263] shrink-0">
              {phone && <span className="flex items-center gap-2 text-[12px] font-bold"><Phone size={14} className="text-[#FAB95B]" />{phone}</span>}
              {email && <span className="flex items-center gap-2 text-[12px] font-bold hidden xl:flex"><Mail size={14} className="text-[#FAB95B]" />{email}</span>}
              <Link to="/admin" className="h-10 px-5 inline-flex items-center justify-center gap-1.5 rounded-full bg-[#1a3263] text-[#fab95b] text-[12px] font-extrabold hover:bg-[#1a3263]/90 transition-colors">
                <LayoutDashboard size={14} /> Admin
              </Link>
              <a href="#contact" onClick={(e) => { e.preventDefault(); goSection('contact') }} className="h-10 px-5 inline-flex items-center justify-center rounded-full bg-[#fab95b] text-[#1a3263] text-[12px] font-extrabold hover:bg-[#fab95b]/90 transition-colors">
                Contact
              </a>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="xl:hidden h-10 w-10 grid place-items-center rounded-full bg-[#1a3263] text-[#fab95b]">
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden h-10 w-10 grid place-items-center rounded-full bg-[#1a3263] text-[#fab95b]">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Full-width navy nav bar (KCE style) */}
      <nav className="bg-[#1a3263] hidden xl:block">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-8">
          <div className="flex items-center gap-0.5">
            {navigation.map((item) => (
              <div key={item.label} className="relative" onMouseEnter={() => item.children && setActiveDropdown(item.label)} onMouseLeave={() => setActiveDropdown(null)}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => { e.preventDefault(); goSection(item.id) }}
                  className="flex items-center gap-1 px-4 lg:px-5 h-[52px] text-[13px] font-bold text-white/90 hover:text-[#fab95b] transition-colors"
                >
                  {item.label}
                  {item.children && <ChevronDown size={13} className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />}
                </a>
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-0 w-[240px] rounded-b-[14px] bg-white border-2 border-t-0 border-[#e8e2db] shadow-xl p-2">
                    {item.children.map(child => (
                      <a key={child.label} href={`#${child.id}`} onClick={(e) => { e.preventDefault(); goSection(child.id) }} className="block px-4 py-2.5 rounded-[10px] text-[13px] font-semibold text-[#1a3263] hover:bg-[#e8e2db]">
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
        <div className="xl:hidden bg-[#1a3263] border-t border-white/10">
          <div className="p-4 space-y-1">
            {navigation.map(item => (
              <a key={item.label} href={`#${item.id}`} onClick={(e) => { e.preventDefault(); goSection(item.id) }} className="flex px-4 py-3 rounded-[12px] hover:bg-white/10 font-bold text-white text-[14px]">
                {item.label}
              </a>
            ))}
            <Link to="/admin" className="mt-3 flex h-11 items-center justify-center gap-2 rounded-full bg-[#fab95b] text-[#1a3263] font-extrabold text-[13px]">
              <LayoutDashboard size={15} /> Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
