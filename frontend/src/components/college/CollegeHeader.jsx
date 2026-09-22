import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Search, Menu, X, Bell, ChevronDown, BadgeCheck, MapPin, Phone, Mail } from 'lucide-react'

export default function CollegeHeader({ college }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

  const navigation = [
    { label: "Home", href: `/college/${college.slug}`, hasContent: true },
    { 
      label: "About Us", 
      href: `/college/${college.slug}/about`,
      hasContent: true,
      children: [
        { label: "About College", href: "about" },
        { label: "Vision & Mission", href: "about#vision" },
        { label: "Management", href: "about#management" },
        { label: "Principal", href: "about#principal" },
        { label: "History", href: "about#history" },
      ]
    },
    { 
      label: "Academics", 
      href: `/college/${college.slug}/academics`,
      hasContent: college.departments?.length > 0,
      children: college.departments?.map(d => ({ label: d.name, href: `academics#${d.code}` })) || []
    },
    { label: "Admissions", href: `/college/${college.slug}/admissions`, hasContent: true, badge: "2026" },
    { label: "Examinations", href: `/college/${college.slug}/examinations`, hasContent: true },
    { label: "Research", href: `/college/${college.slug}/research`, hasContent: true },
    { label: "Campus", href: `/college/${college.slug}/campus`, hasContent: true },
    { label: "Placements", href: `/college/${college.slug}/placements`, hasContent: true },
    { label: "Students", href: `/college/${college.slug}/students`, hasContent: true },
    { label: "Alumni", href: `/college/${college.slug}/alumni`, hasContent: true },
    { label: "Contact", href: `/college/${college.slug}/contact`, hasContent: true },
  ].filter(n => n.hasContent)

  return (
    <div className="college-theme sticky top-0 z-40 w-full">
      {/* Top Bar */}
      <div className="hidden lg:block text-white text-[12px]" style={{ background: 'var(--c-primary)' }}>
        <div className="mx-auto max-w-[1600px] px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 opacity-90"><Phone size={12} />{college.contact.phone}</span>
            <span className="flex items-center gap-2 opacity-90"><Mail size={12} />{college.contact.email}</span>
            <span className="flex items-center gap-2 opacity-90"><MapPin size={12} />{college.location.address}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="opacity-80">Affiliated to {college.affiliation} | {college.accreditation}</span>
            <Link to="/" className="px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-colors">← Back to Platform</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-black/[0.06] shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-8">
          <div className="flex h-[84px] items-center justify-between gap-6">
            {/* Logo + Name */}
            <Link to={`/college/${college.slug}`} className="flex items-center gap-4 min-w-0">
              <div className="h-[56px] w-[56px] rounded-[16px] overflow-hidden border border-black/5 shadow-sm shrink-0">
                <img src={college.branding.logo} alt={college.name} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-[18px] lg:text-[20px] font-bold tracking-tight truncate" style={{ color: 'var(--c-primary)' }}>
                    {college.name}
                  </h1>
                  {college.verified && (
                    <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
                      <BadgeCheck size={12} /> Verified
                    </span>
                  )}
                </div>
                <div className="text-[12px] font-medium tracking-wide text-zinc-500 truncate max-w-[380px]">{college.tagline} • {college.location.city}</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden xl:flex items-center gap-1">
              {navigation.slice(0,8).map((item) => (
                <div key={item.label} className="relative" onMouseEnter={() => item.children && setActiveDropdown(item.label)} onMouseLeave={() => setActiveDropdown(null)}>
                  <Link 
                    to={item.href}
                    className={`flex items-center gap-1 px-3.5 h-9 rounded-full text-[13px] font-semibold tracking-wide transition-colors ${location.pathname === item.href ? 'bg-[var(--c-primary)] text-white' : 'text-zinc-700 hover:bg-zinc-100'}`}
                  >
                    {item.label}
                    {item.badge && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[var(--c-accent)] text-black text-[10px] font-bold">{item.badge}</span>}
                    {item.children && <ChevronDown size={14} className={`transition-transform ${activeDropdown===item.label?'rotate-180':''}`} />}
                  </Link>

                  {/* Mega dropdown */}
                  {item.children && activeDropdown===item.label && (
                    <div className="absolute top-full left-0 mt-2 w-[280px] rounded-[20px] bg-white border border-zinc-100 shadow-[0_16px_48px_rgba(0,0,0,0.12)] p-2 animate-fadeIn">
                      {item.children.map(child => (
                        <Link key={child.label} to={`${item.href.split('#')[0]}#${child.label.toLowerCase().replace(/\s+/g,'-')}`} className="flex px-4 py-2.5 rounded-[12px] text-[13px] font-medium text-zinc-700 hover:bg-zinc-50 hover:text-[var(--c-primary)]">
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {navigation.length > 8 && (
                <div className="relative" onMouseEnter={()=>setActiveDropdown('More')} onMouseLeave={()=>setActiveDropdown(null)}>
                  <button className="px-3.5 h-9 rounded-full text-[13px] font-semibold text-zinc-700 hover:bg-zinc-100 flex items-center gap-1">
                    More <ChevronDown size={14} />
                  </button>
                  {activeDropdown==='More' && (
                    <div className="absolute right-0 top-full mt-2 w-[240px] rounded-[20px] bg-white border border-zinc-100 shadow-xl p-2">
                      {navigation.slice(8).map(i=>(
                        <Link key={i.label} to={i.href} className="flex px-4 py-2.5 rounded-[12px] text-[13px] font-medium hover:bg-zinc-50">{i.label}</Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="hidden lg:grid h-10 w-10 place-items-center rounded-full bg-zinc-50 border border-zinc-200 hover:bg-zinc-100">
                <Search size={18} />
              </button>
              <button className="hidden lg:grid h-10 w-10 place-items-center rounded-full bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <Link to={`/college/${college.slug}/admissions`} className="hidden lg:inline-flex h-11 px-6 items-center justify-center rounded-full text-white text-[13px] font-bold tracking-wide shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:brightness-110 transition-all" style={{ background: 'var(--c-primary)' }}>
                Admission 2026
              </Link>
              <button onClick={()=>setMobileOpen(!mobileOpen)} className="xl:hidden h-11 w-11 grid place-items-center rounded-full bg-zinc-900 text-white">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-zinc-100 bg-white">
            <div className="p-6 space-y-1 max-h-[70vh] overflow-auto">
              {navigation.map(item=>(
                <Link key={item.label} to={item.href} onClick={()=>setMobileOpen(false)} className="flex items-center justify-between px-4 py-3 rounded-[14px] hover:bg-zinc-50 font-medium">
                  {item.label}
                  {item.badge && <span className="px-2 py-1 rounded-full bg-amber-400 text-black text-[11px] font-bold">{item.badge}</span>}
                </Link>
              ))}
              <div className="pt-4 flex gap-2">
                <Link to={`/college/${college.slug}/admissions`} className="flex-1 h-12 grid place-items-center rounded-full text-white font-bold" style={{ background: 'var(--c-primary)' }}>Admission 2026</Link>
                <Link to="/" className="h-12 px-6 grid place-items-center rounded-full bg-zinc-100 font-semibold">Platform</Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  )
}
