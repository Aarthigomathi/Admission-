import { Link, useLocation } from 'react-router-dom'
import { Search, MapPin, Bookmark, GitCompare, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function PlatformHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const loc = useLocation()
  const isCollegePage = loc.pathname.startsWith('/college/')

  if (isCollegePage) return null

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[#fab95b]/30 bg-[#e8e2db]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[12px] bg-[#1a3263] text-[#fab95b] grid place-items-center font-display text-[20px] font-bold tracking-tight border-2 border-[#fab95b]">T</div>
            <div className="leading-[0.9]">
              <div className="font-display text-[18px] font-semibold tracking-tight text-[#1a3263]">Tamil Nadu</div>
              <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#547792]">Colleges • Real Images • #e8e2db #fab95b #547792 #1a3263</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 rounded-full bg-white p-1 border-2 border-[#e8e2db] shadow-sm">
            <Link to="/" className="px-5 h-9 grid place-items-center rounded-full text-[14px] font-medium bg-[#1a3263] text-[#fab95b]">Discover Real</Link>
            <Link to="/search" className="px-5 h-9 grid place-items-center rounded-full text-[14px] font-medium text-[#547792] hover:text-[#1a3263]">Colleges</Link>
            <Link to="/search?type=course" className="px-5 h-9 grid place-items-center rounded-full text-[14px] font-medium text-[#547792] hover:text-[#1a3263]">Courses</Link>
            <Link to="/compare" className="px-5 h-9 grid place-items-center rounded-full text-[14px] font-medium text-[#547792] hover:text-[#1a3263]">Compare</Link>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <div className="flex items-center gap-1.5 rounded-full bg-white border-2 border-[#e8e2db] px-3 h-10">
                <MapPin size={14} className="text-[#547792]" />
                <select className="bg-transparent text-[13px] font-medium outline-none text-[#1a3263]">
                  <option>Coimbatore - Real</option>
                  <option>Chennai</option>
                  <option>Madurai</option>
                </select>
              </div>
            </div>
            <Link to="/search" className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-white border-2 border-[#e8e2db] text-[#1a3263] hover:bg-[#e8e2db]">
              <Search size={18} />
            </Link>
            <Link to="/saved" className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-white border-2 border-[#e8e2db] text-[#1a3263]">
              <Bookmark size={18} />
            </Link>
            <Link to="/compare" className="hidden md:grid h-10 w-10 place-items-center rounded-full bg-white border-2 border-[#e8e2db] text-[#1a3263]">
              <GitCompare size={18} />
            </Link>
            <Link to="/admin" className="hidden md:inline-flex h-10 px-6 items-center justify-center rounded-full bg-[#1a3263] text-[#fab95b] border-2 border-[#fab95b] text-[13px] font-bold tracking-wide hover:bg-[#1a3263]/90">College Login - Real Images</Link>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden h-10 w-10 grid place-items-center rounded-full bg-white border-2 border-[#e8e2db] text-[#1a3263]">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t-2 border-[#e8e2db] bg-[#e8e2db] p-6 space-y-4">
          <Link to="/" className="block py-2 font-medium text-[#1a3263]">Discover Real</Link>
          <Link to="/search" className="block py-2 font-medium text-[#1a3263]">Colleges - Real Images</Link>
          <Link to="/search?type=course" className="block py-2 font-medium text-[#1a3263]">Courses</Link>
          <Link to="/compare" className="block py-2 font-medium text-[#1a3263]">Compare</Link>
          <Link to="/admin" className="mt-4 inline-flex h-11 px-6 rounded-full bg-[#1a3263] text-[#fab95b] border-2 border-[#fab95b] font-bold">College Login - Real Images</Link>
        </div>
      )}
    </header>
  )
}
