import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Sparkles, GraduationCap, Users, Building2, ArrowUpRight, Star, TrendingUp, Filter, SlidersHorizontal } from 'lucide-react'
import CollegeCard from '../../components/platform/CollegeCard'
import { colleges } from '../../lib/colleges'

export default function PlatformHome() {
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('All')
  const [type, setType] = useState('All')

  const filtered = colleges.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.courses.some(co=>co.name.toLowerCase().includes(search.toLowerCase()))
    const matchDist = district==='All' || c.district===district
    const matchType = type==='All' || c.type.toLowerCase().includes(type.toLowerCase())
    return matchSearch && matchDist && matchType
  })

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#ede9e3]">
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_-20%,#fff_0%,#fbfaf8_60%)]" />
        <div className="absolute top-20 right-[10%] h-[400px] w-[400px] rounded-full bg-amber-100/50 blur-[80px]" />
        <div className="absolute top-40 left-[5%] h-[300px] w-[300px] rounded-full bg-blue-100/60 blur-[60px]" />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 pt-14 pb-16">
          <div className="max-w-[900px]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#ede9e3] shadow-sm text-[12px] font-semibold tracking-wide">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Tamil Nadu's Premium College Discovery Platform • 6000+ Colleges
            </div>

            <h1 className="font-display text-[48px] lg:text-[84px] font-[600] leading-[0.9] tracking-[-0.03em] mt-8 text-[#0f172a] text-balance">
              One platform,
              <span className="font-serif italic font-[400] tracking-tight"> thousands of </span>
              beautiful college websites.
            </h1>
            <p className="mt-6 text-[18px] lg:text-[20px] leading-[1.5] text-[#7a746e] max-w-[640px]">
              Each college feels like its own official website — with unique branding, content & identity. 
              Powered by one common technology, CMS and design system.
            </p>

            {/* Search Bar - Premium */}
            <div className="mt-10 rounded-[28px] bg-white border border-[#ede9e3] shadow-[0_12px_40px_rgba(0,0,0,0.06)] p-2 flex flex-col lg:flex-row gap-2 max-w-[840px]">
              <div className="flex-1 flex items-center gap-3 px-5 h-[56px] rounded-[20px] bg-[#fbfaf8] border border-[#ede9e3] focus-within:bg-white focus-within:border-[#0f172a] transition-colors">
                <Search size={20} className="text-[#7a746e] shrink-0" />
                <input 
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                  placeholder="Search colleges, courses like BCA, B.E CSE, MBA..." 
                  className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-[#a8a29e] font-medium"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-4 h-[56px] rounded-[20px] bg-[#fbfaf8] border border-[#ede9e3]">
                  <MapPin size={16} className="text-[#7a746e]" />
                  <select value={district} onChange={e=>setDistrict(e.target.value)} className="bg-transparent outline-none text-[14px] font-medium">
                    <option>All Districts</option>
                    <option>Coimbatore</option>
                    <option>Chennai</option>
                    <option>Madurai</option>
                  </select>
                </div>
                <Link to={`/search?q=${search}`} className="h-[56px] px-8 grid place-items-center rounded-[20px] bg-[#0f172a] text-white text-[14px] font-bold tracking-wide hover:bg-black transition-colors shrink-0">
                  Search
                </Link>
              </div>
            </div>

            {/* Quick filters */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="text-[12px] font-bold tracking-widest uppercase text-[#a8a29e]">Popular:</span>
              {["BCA", "B.E CSE", "MBA", "B.Com", "MBBS", "B.Sc AI"].map(tag=>(
                <button key={tag} onClick={()=>setSearch(tag)} className="px-4 h-8 rounded-full bg-white border border-[#ede9e3] text-[13px] font-medium hover:border-[#0f172a] hover:bg-[#0f172a] hover:text-white transition-colors">
                  {tag}
                </button>
              ))}
              <span className="ml-2 text-[13px] text-[#7a746e]">{filtered.length} colleges found</span>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-[900px]">
            {[
              { icon: Building2, label: "Colleges", value: "6,247", sub: "Across Tamil Nadu" },
              { icon: GraduationCap, label: "Courses", value: "12,400+", sub: "UG, PG, PhD" },
              { icon: Users, label: "Students", value: "4.2L+", sub: "Active learners" },
              { icon: Star, label: "Verified", value: "100%", sub: "Authentic info" },
            ].map((s,i)=>(
              <div key={i} className="rounded-[20px] bg-white border border-[#ede9e3] p-5 flex gap-4">
                <div className="h-11 w-11 rounded-[12px] bg-[#fbfaf8] border grid place-items-center">
                  <s.icon size={20} />
                </div>
                <div>
                  <div className="font-display text-[22px] font-semibold leading-none">{s.value}</div>
                  <div className="text-[12px] font-bold tracking-wide uppercase text-[#7a746e] mt-1">{s.label}</div>
                  <div className="text-[11px] text-[#a8a29e]">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[72px] z-30 backdrop-blur-xl bg-[#fbfaf8]/80 border-b border-[#ede9e3]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { label: "All", value: "All" },
              { label: "Engineering", value: "Engineering" },
              { label: "Arts & Science", value: "Arts" },
              { label: "Management", value: "Management" },
              { label: "Medical", value: "Medical" },
            ].map(f=>(
              <button 
                key={f.label} 
                onClick={()=>setType(f.value)}
                className={`whitespace-nowrap px-5 h-9 rounded-full text-[13px] font-semibold border transition-all ${type===f.value?'bg-[#0f172a] text-white border-[#0f172a] shadow':'bg-white border-[#ede9e3] text-[#7a746e] hover:border-[#0f172a] hover:text-[#0f172a]'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[12px] font-medium text-[#7a746e]">Sort by:</span>
            <select className="h-9 px-3 rounded-full bg-white border border-[#ede9e3] text-[13px] font-medium">
              <option>Recommended</option>
              <option>Highest Placement</option>
              <option>Lowest Fees</option>
              <option>Top Rated</option>
            </select>
            <button className="h-9 w-9 grid place-items-center rounded-full bg-white border border-[#ede9e3]"><SlidersHorizontal size={16} /></button>
          </div>
        </div>
      </div>

      {/* College Grid */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-[28px] font-semibold tracking-tight">Featured Colleges in Coimbatore</h2>
          <Link to="/search" className="hidden lg:inline-flex items-center gap-1.5 text-[13px] font-semibold hover:gap-2 transition-all">View all <ArrowUpRight size={16} /></Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(college=>(
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>

        {filtered.length===0 && (
          <div className="py-24 text-center">
            <div className="mx-auto max-w-[400px] rounded-[28px] bg-white border p-12">
              <div className="h-16 w-16 rounded-full bg-zinc-100 grid place-items-center mx-auto text-2xl">🔍</div>
              <h3 className="font-semibold mt-6">No colleges found</h3>
              <p className="text-[14px] text-zinc-500 mt-2">Try adjusting search or filters</p>
              <button onClick={()=>{setSearch(''); setDistrict('All'); setType('All')}} className="mt-6 h-10 px-6 rounded-full bg-zinc-900 text-white text-[13px] font-semibold">Clear Filters</button>
            </div>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="border-t border-[#ede9e3] bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-20">
          <div className="max-w-[720px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold tracking-widest uppercase text-amber-800">
              <Sparkles size={12} /> How It Works
            </div>
            <h2 className="font-display text-[36px] lg:text-[48px] font-semibold leading-[0.95] tracking-tight mt-6">
              One platform. <br/>Thousands of individual identities.
            </h2>
          </div>

          <div className="mt-16 grid lg:grid-cols-3 gap-8">
            {[
              { step: "01", title: "College gets its own website", desc: "Each college selects a premium theme preset — Academic Blue, Heritage Maroon, Corporate Slate etc — and customizes logo, colors, hero images, content.", color: "bg-blue-50" },
              { step: "02", title: "College Admin manages everything", desc: "Departments, courses, faculty, events, gallery, announcements, admissions, placements — all via our CMS. Drag-drop, preview, publish.", color: "bg-amber-50" },
              { step: "03", title: "Students discover & compare", desc: "Search BCA across all colleges, filter by district, compare PSG vs CIT vs KCT, save favourites, enquire — all in one platform.", color: "bg-emerald-50" },
            ].map(item=>(
              <div key={item.step} className={`rounded-[28px] border p-8 ${item.color} border-black/5`}>
                <div className="h-12 w-12 rounded-[14px] bg-white border grid place-items-center font-display font-bold text-[18px]">{item.step}</div>
                <h3 className="font-semibold text-[20px] leading-tight mt-6">{item.title}</h3>
                <p className="text-[14px] leading-[1.6] text-zinc-600 mt-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0f172a] text-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-16">
          <div className="flex flex-wrap justify-between gap-12">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[12px] bg-white text-black grid place-items-center font-display font-bold">T</div>
                <div className="leading-tight">
                  <div className="font-display text-[18px] font-semibold">Tamil Nadu Colleges</div>
                  <div className="text-[11px] tracking-widest uppercase opacity-60">Discover Platform</div>
                </div>
              </div>
              <p className="mt-6 max-w-[320px] text-[13px] leading-[1.6] opacity-60">Hosting thousands of beautiful, individual college websites on one common platform, CMS and design system.</p>
            </div>
            <div className="flex gap-16 text-[13px]">
              <div>
                <div className="font-semibold tracking-wide uppercase text-[11px] opacity-40">Platform</div>
                <div className="mt-4 space-y-3 opacity-80">
                  <div>Colleges</div><div>Courses</div><div>Compare</div><div>For Colleges</div>
                </div>
              </div>
              <div>
                <div className="font-semibold tracking-wide uppercase text-[11px] opacity-40">Legal</div>
                <div className="mt-4 space-y-3 opacity-80">
                  <div>Privacy</div><div>Terms</div><div>Contact</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/10 flex justify-between text-[12px] opacity-50">
            <div>© 2026 Tamil Nadu College Discovery Platform</div>
            <div>Made with excellence for Tamil Nadu education</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
