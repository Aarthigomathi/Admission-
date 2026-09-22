import { Link, useLocation } from 'react-router-dom'
import { Search, MapPin, Bookmark, GitCompare, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function PlatformHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const loc = useLocation()
  const isCollegePage = loc.pathname.startsWith('/college/')

  if (isCollegePage) return null

  return (
    <header className="sticky top-0 z-50 border-b border-[#ede9e3] bg-[#fbfaf8]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[12px] bg-[#0f172a] text-white grid place-items-center font-display text-[20px] font-bold tracking-tight">T</div>
            <div className="leading-[0.9]">
              <div className="font-display text-[18px] font-semibold tracking-tight text-[#0f172a]">Tamil Nadu</div>
              <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#7a746e]">Colleges • Discover</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-white p-1 border border-[#ede9e3] shadow-sm">
            <Link to="/" className="px-5 h-9 grid place-items-center rounded-full text-[14px] font-medium bg-[#0f172a] text-white">Discover</Link>
            <Link to="/search" className="px-5 h-9 grid place-items-center rounded-full text-[14px] font-medium text-[#7a746e] hover:text-[#0f172a]">Colleges</Link>
            <Link to="/search?type=course" className="px-5 h-9 grid place-items-center rounded-full text-[14px] font-medium text-[#7a746e] hover:text-[#0f172a]">Courses</Link>
            <Link to="/compare" className="px-5 h-9 grid place-items-center rounded-full text-[14px] font-medium text-[#7a746e] hover:text-[#0f172a]">Compare</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <div className="flex items-center gap-1.5 rounded-full bg-white border border-[#ede9e3] px-3 h-10">
                <MapPin size={14} className="text-[#7a746e]" />
                <select className="bg-transparent text-[13px] font-medium outline-none text-[#0f172a]">
                  <option>Coimbatore</option>
                  <option>Chennai</option>
                  <option>Madurai</option>
                </select>
              </div>
            </div>
            <Link to="/search" className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-white border border-[#ede9e3] text-[#0f172a] hover:bg-zinc-50">
              <Search size={18} />
            </Link>
            <Link to="/saved" className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-white border border-[#ede9e3] text-[#0f172a]">
              <Bookmark size={18} />
            </Link>
            <Link to="/compare" className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-white border border-[#ede9e3] text-[#0f172a]">
              <GitCompare size={18} />
            </Link>
            <Link to="/admin" className="hidden md:inline-flex h-10 px-5 items-center justify-center rounded-full bg-[#0f172a] text-white text-[13px] font-semibold tracking-wide">College Login</Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden h-10 w-10 grid place-items-center rounded-full bg-white border border-[#ede9e3]">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#ede9e3] bg-white p-6 space-y-4">
          <Link to="/" className="block py-2 font-medium">Discover</Link>
          <Link to="/search" className="block py-2 font-medium">Colleges</Link>
          <Link to="/search?type=course" className="block py-2 font-medium">Courses</Link>
          <Link to="/compare" className="block py-2 font-medium">Compare</Link>
          <Link to="/admin" className="mt-4 inline-flex h-11 px-6 rounded-full bg-[#0f172a] text-white font-semibold">College Login</Link>
        </div>
      )}
    </header>
  )
}
