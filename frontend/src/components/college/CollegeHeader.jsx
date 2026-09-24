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
      label: "About Us",
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
    { label: "Research Centres", id: "centres" },
    { label: "Campus", id: "campus" },
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

  return (
    <div className="sticky top-0 z-40 w-full">
            {/* Top Bar - Real official info only - safe for custom colleges */}
      <div className="hidden lg:block bg-[#1a3263] text-white text-[12px] border-b-2 border-[#fab95b]">
        <div className="mx-auto max-w-[1600px] px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 opacity-90"><Phone size={12} />{(college.contact?.phone || college.phone || '').split('/')[0] || 'Contact'}</span>
            <span className="flex items-center gap-2 opacity-90"><Mail size={12} />{(college.contact?.email || college.email || '').split('/')[0].trim() || 'Email'}</span>
            <span className="flex items-center gap-2 opacity-90 hidden xl:flex"><MapPin size={12} />{college.location?.city || college.city || college.district || 'Location'} • {college.district || ''}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="opacity-80">{college.affiliation || college.university || ''} {college.accreditation ? `| ${(college.accreditation || '').split('•')[0]}` : ''}</span>
          </div>
        </div>
      </div>

      <header className="bg-white border-b-2 border-[#e8e2db] shadow-sm">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-8">
          <div className="flex h-[76px] items-center justify-between gap-6">
            <a href="#home" onClick={(e) => { e.preventDefault(); goSection('home') }} className="flex items-center gap-3 min-w-0 cursor-pointer">
              <div className="h-[52px] w-[52px] rounded-[14px] overflow-hidden border-2 border-[#e8e2db] bg-[#e8e2db] shadow-sm shrink-0">
                {college.branding?.logo ? <img src={college.branding.logo} alt={college.name} className="h-full w-full object-cover" /> : <div className="h-full w-full grid place-items-center bg-[#1A3263] text-[#FAB95B] font-bold text-[18px]">{college.name?.[0] || 'C'}</div>}
              </div>
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-[17px] lg:text-[19px] font-bold tracking-tight truncate text-[#1a3263]">
                    {college.name}
                  </h1>
                  <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e8e2db] text-[#1a3263] border text-[10px] font-bold">
                    <BadgeCheck size={10} /> Govt Aided • Autonomous
                  </span>
                </div>
                <div className="text-[11px] font-medium text-[#547792] truncate max-w-[360px]">{college.tagline} • Est. {college.established}</div>
              </div>
            </a>

            <nav className="hidden xl:flex items-center gap-1">
              {navigation.map((item) => (
                <div key={item.label} className="relative" onMouseEnter={() => item.children && setActiveDropdown(item.label)} onMouseLeave={() => setActiveDropdown(null)}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => { e.preventDefault(); goSection(item.id) }}
                    className="flex items-center gap-1 px-4 h-9 rounded-full text-[13px] font-semibold text-[#1a3263] hover:bg-[#e8e2db] transition-colors"
                  >
                    {item.label}
                    {item.children && <ChevronDown size={14} className={`transition-transform ${activeDropdown===item.label?'rotate-180':''}`} />}
                  </a>
                  {item.children && activeDropdown===item.label && (
                    <div className="absolute top-full left-0 mt-2 w-[240px] rounded-[16px] bg-white border-2 border-[#e8e2db] shadow-xl p-2">
                      {item.children.map(child => (
                        <a key={child.label} href={`#${child.id}`} onClick={(e) => { e.preventDefault(); goSection(child.id) }} className="flex px-4 py-2.5 rounded-[12px] text-[13px] font-medium text-[#1a3263] hover:bg-[#e8e2db]">
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link to="/admin" className="hidden lg:inline-flex h-9 px-4 items-center justify-center gap-1.5 rounded-full bg-[#e8e2db] border text-[#1a3263] text-[12px] font-semibold hover:bg-[#fab95b]/20">
                <LayoutDashboard size={13} /> Admin
              </Link>
              <a href="#contact" onClick={(e) => { e.preventDefault(); goSection('contact') }} className="hidden lg:inline-flex h-10 px-5 items-center justify-center rounded-full bg-[#1a3263] text-[#fab95b] text-[13px] font-bold">
                Contact
              </a>
              <button onClick={()=>setMobileOpen(!mobileOpen)} className="xl:hidden h-10 w-10 grid place-items-center rounded-full bg-[#1a3263] text-[#fab95b]">
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="xl:hidden border-t-2 border-[#e8e2db] bg-white">
            <div className="p-4 space-y-1">
              {navigation.map(item=>(
                <a key={item.label} href={`#${item.id}`} onClick={(e)=>{e.preventDefault(); goSection(item.id)}} className="flex px-4 py-3 rounded-[12px] hover:bg-[#e8e2db] font-medium text-[#1a3263] text-[14px]">
                  {item.label}
                </a>
              ))}
              <Link to="/admin" className="mt-4 flex h-11 items-center justify-center gap-2 rounded-full bg-[#e8e2db] border text-[#1a3263] font-semibold"><LayoutDashboard size={15} /> Admin Dashboard</Link>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
