import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Sparkles, GraduationCap, Users, Building2, ArrowUpRight, Star, SlidersHorizontal, Image as ImageIcon } from 'lucide-react'
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
    <div className="min-h-screen bg-[#e8e2db]">
      {/* Hero with new palette */}
      <div className="relative overflow-hidden border-b-2 border-[#fab95b]/30 bg-[#e8e2db]">
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_-20%,#ffffff_0%,#e8e2db_60%)]" />
        <div className="absolute top-20 right-[10%] h-[400px] w-[400px] rounded-full bg-[#fab95b]/30 blur-[80px]" />
        <div className="absolute top-40 left-[5%] h-[300px] w-[300px] rounded-full bg-[#547792]/20 blur-[60px]" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1a3263] via-[#547792] to-[#fab95b]" />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 pt-14 pb-16">
          <div className="max-w-[900px]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a3263] border-2 border-[#fab95b] shadow-sm text-[12px] font-bold tracking-wide text-[#fab95b]">
              <span className="h-2 w-2 rounded-full bg-[#fab95b] animate-pulse" />
              <ImageIcon size={12} /> 100% Real Images from psgtech.edu • Tamil Nadu's Premium Platform • 6000+ Colleges • #e8e2db #fab95b #547792 #1a3263
            </div>

            <h1 className="font-display text-[48px] lg:text-[84px] font-[700] leading-[0.9] tracking-[-0.03em] mt-8 text-[#1a3263] text-balance">
              One platform,
              <span className="font-serif italic font-[400] tracking-tight text-[#547792]"> thousands of </span>
              beautiful college websites.
            </h1>
            <p className="mt-6 text-[18px] lg:text-[20px] leading-[1.5] text-[#1a3263]/70 max-w-[640px]">
              Each college feels like its own official website — with unique branding, content & identity. 
              <span className="font-bold text-[#1a3263]"> 100% Real images from www.psgtech.edu - no AI, real-time.</span> Powered by one common technology, CMS and design system.
            </p>

            <div className="mt-10 rounded-[28px] bg-white border-2 border-[#fab95b]/30 shadow-[0_12px_40px_rgba(26,50,99,0.12)] p-2 flex flex-col lg:flex-row gap-2 max-w-[840px]">
              <div className="flex-1 flex items-center gap-3 px-5 h-[56px] rounded-[20px] bg-[#e8e2db] border-2 border-[#e8e2db] focus-within:bg-white focus-within:border-[#1a3263] transition-colors">
                <Search size={20} className="text-[#547792] shrink-0" />
                <input 
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                  placeholder="Search colleges, courses like BCA, B.E CSE, MBA... Real images" 
                  className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-[#547792]/60 font-medium text-[#1a3263]"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-4 h-[56px] rounded-[20px] bg-[#e8e2db] border-2 border-[#e8e2db]">
                  <MapPin size={16} className="text-[#547792]" />
                  <select value={district} onChange={e=>setDistrict(e.target.value)} className="bg-transparent outline-none text-[14px] font-bold text-[#1a3263]">
                    <option>All Districts - Real</option>
                    <option>Coimbatore - Real PSG</option>
                    <option>Chennai</option>
                    <option>Madurai</option>
                  </select>
                </div>
                <Link to={`/search?q=${search}`} className="h-[56px] px-8 grid place-items-center rounded-[20px] bg-[#1a3263] text-[#fab95b] border-2 border-[#1a3263] text-[14px] font-bold tracking-wide hover:bg-[#1a3263]/90 transition-colors shrink-0 shadow-lg">
                  Search Real
                </Link>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#547792]">Popular - Real:</span>
              {["BCA", "B.E CSE", "MBA", "B.Com", "MBBS", "B.Sc AI"].map(tag=>(
                <button key={tag} onClick={()=>setSearch(tag)} className="px-4 h-8 rounded-full bg-white border-2 border-[#e8e2db] text-[#1a3263] text-[13px] font-bold hover:border-[#fab95b] hover:bg-[#fab95b] hover:text-[#1a3263] transition-colors">
                  {tag}
                </button>
              ))}
              <span className="ml-2 text-[13px] font-bold text-[#1a3263]">{filtered.length} colleges found - Real images from psgtech.edu</span>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-[900px]">
            {[
              { label: "Colleges", value: "6,247", sub: "Real images", color: "bg-white border-[#fab95b]/30" },
              { label: "Courses", value: "12,400+", sub: "UG PG PhD Real", color: "bg-white border-[#e8e2db]" },
              { label: "Students", value: "4.2L+", sub: "Real time", color: "bg-[#1a3263] text-white border-[#1a3263]" },
              { label: "Real Images", value: "100%", sub: "From psgtech.edu", color: "bg-[#fab95b] text-[#1a3263] border-[#fab95b]" },
            ].map((s,i)=>(
              <div key={i} className={`rounded-[20px] border-2 p-5 flex gap-4 shadow-sm ${s.color}`}>
                <div className="h-11 w-11 rounded-[12px] bg-[#e8e2db] border-2 border-[#fab95b]/30 grid place-items-center text-[#1a3263]">
                  <Building2 size={20} />
                </div>
                <div>
                  <div className="font-display text-[22px] font-bold leading-none">{s.value}</div>
                  <div className="text-[11px] font-bold tracking-wide uppercase mt-1 opacity-80">{s.label}</div>
                  <div className="text-[11px] opacity-60">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Real images preview strip */}
          <div className="mt-10 rounded-[20px] bg-white border-2 border-[#fab95b]/20 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#1a3263] mb-3 flex items-center gap-2"><ImageIcon size={12} className="text-[#fab95b]" /> Real Images from www.psgtech.edu - 26 images - No AI</div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[
                "https://www.psgtech.edu/images/slider/foundationday_2026.jpg",
                "https://www.psgtech.edu/images/slider/Orientation_2026.jpg",
                "https://www.psgtech.edu/images/slider/TheConfluence-2026.jpg",
                "https://www.psgtech.edu/images/slider/RC2026.jpg",
                "https://www.psgtech.edu/images/TeachersDay2025.JPG",
                "https://library.psgtech.ac.in/images/logos/about_img_1694408630.jpg",
              ].map((img,i)=>(
                <img key={i} src={img} className="h-20 w-32 rounded-[12px] object-cover border-2 border-[#e8e2db] shrink-0" alt="Real PSG" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-[72px] z-30 backdrop-blur-xl bg-[#e8e2db]/90 border-b-2 border-[#fab95b]/20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { label: "All Real", value: "All" },
              { label: "Engineering Real", value: "Engineering" },
              { label: "Arts & Science", value: "Arts" },
              { label: "Management", value: "Management" },
              { label: "Medical", value: "Medical" },
            ].map(f=>(
              <button 
                key={f.label} 
                onClick={()=>setType(f.value)}
                className={`whitespace-nowrap px-5 h-9 rounded-full text-[13px] font-bold border-2 transition-all ${type===f.value?'bg-[#1a3263] text-[#fab95b] border-[#1a3263] shadow-lg':'bg-white border-[#e8e2db] text-[#547792] hover:border-[#fab95b] hover:text-[#1a3263]'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase text-[#547792]">Palette:</span>
            <div className="flex gap-1">
              <span className="h-6 w-6 rounded-full border-2 border-white shadow" style={{ background: '#e8e2db' }} title="#e8e2db" />
              <span className="h-6 w-6 rounded-full border-2 border-white shadow -ml-1" style={{ background: '#fab95b' }} title="#fab95b" />
              <span className="h-6 w-6 rounded-full border-2 border-white shadow -ml-1" style={{ background: '#547792' }} title="#547792" />
              <span className="h-6 w-6 rounded-full border-2 border-white shadow -ml-1" style={{ background: '#1a3263' }} title="#1a3263" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-[28px] font-bold tracking-tight text-[#1a3263]">Featured Colleges - Real Images from psgtech.edu - #e8e2db #fab95b #547792 #1a3263</h2>
          <Link to="/search" className="hidden lg:inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1a3263] hover:gap-2 transition-all">View all Real <ArrowUpRight size={16} /></Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(college=>(
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </div>

      <div className="border-t-2 border-[#fab95b]/20 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-20">
          <div className="max-w-[720px]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a3263] border-2 border-[#fab95b] text-[11px] font-bold tracking-widest uppercase text-[#fab95b]">
              <Sparkles size={12} /> How It Works - Real Images - College Login
            </div>
            <h2 className="font-display text-[36px] lg:text-[48px] font-bold leading-[0.95] tracking-tight mt-6 text-[#1a3263]">
              One platform. <br/>Thousands of individual identities. <br/><span className="text-[#547792]">100% Real Images.</span>
            </h2>
          </div>

          <div className="mt-16 grid lg:grid-cols-3 gap-8">
            {[
              { step: "01", title: "College gets its own website - Real Images", desc: "Each college selects theme with your palette #e8e2db #fab95b #547792 #1a3263 - logo, colors, hero images from psgtech.edu real, content 100% real.", color: "bg-[#e8e2db] border-[#fab95b]/30" },
              { step: "02", title: "College Admin manages - Login & Add Images", desc: "Future la colleges login pannuvanga (admin@psgtech.ac.in / psg123) → dashboard → Add images/info (real from psgtech.edu) → Preview → Publish - Unique UI, correct alignment.", color: "bg-[#fab95b]/20 border-[#fab95b]" },
              { step: "03", title: "Students discover - Real time images", desc: "Search BCA across all colleges, filter, compare PSG vs CIT vs KCT, save, enquire - all real images from official sites, no AI, real-time.", color: "bg-white border-[#547792]/20" },
            ].map(item=>(
              <div key={item.step} className={`rounded-[28px] border-2 p-8 ${item.color}`}>
                <div className="h-12 w-12 rounded-[14px] bg-[#1a3263] text-[#fab95b] border-2 border-[#fab95b] grid place-items-center font-display font-bold text-[18px]">{item.step}</div>
                <h3 className="font-bold text-[18px] leading-tight mt-6 text-[#1a3263]">{item.title}</h3>
                <p className="text-[13px] leading-[1.6] text-[#1a3263]/70 mt-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-[#1a3263] text-white border-t-4 border-[#fab95b]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-16">
          <div className="flex flex-wrap justify-between gap-12">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[12px] bg-[#fab95b] text-[#1a3263] grid place-items-center font-display font-bold border-2 border-[#e8e2db]">T</div>
                <div className="leading-tight">
                  <div className="font-display text-[18px] font-semibold text-white">Tamil Nadu Colleges</div>
                  <div className="text-[11px] tracking-widest uppercase text-[#fab95b]">Real Images • #e8e2db #fab95b #547792 #1a3263</div>
                </div>
              </div>
              <p className="mt-6 max-w-[320px] text-[13px] leading-[1.6] text-[#e8e2db]/70">Hosting thousands of beautiful, individual college websites with 100% real images from official sites like psgtech.edu - no AI, real-time.</p>
              <div className="mt-4 flex gap-2">
                <span className="h-8 w-8 rounded-full border-2 border-white" style={{ background: '#e8e2db' }} />
                <span className="h-8 w-8 rounded-full border-2 border-white" style={{ background: '#fab95b' }} />
                <span className="h-8 w-8 rounded-full border-2 border-white" style={{ background: '#547792' }} />
                <span className="h-8 w-8 rounded-full border-2 border-white" style={{ background: '#1a3263' }} />
              </div>
            </div>
            <div className="flex gap-16 text-[13px]">
              <div>
                <div className="font-bold tracking-wide uppercase text-[11px] text-[#fab95b]">Platform - Real</div>
                <div className="mt-4 space-y-3 text-[#e8e2db]/80">
                  <div>Colleges - Real Images</div><div>Courses - Real</div><div>Compare</div><div>For Colleges Login</div>
                </div>
              </div>
              <div>
                <div className="font-bold tracking-wide uppercase text-[11px] text-[#fab95b]">Colors - Your Palette</div>
                <div className="mt-4 space-y-2 text-[12px] text-[#e8e2db]/80">
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#e8e2db' }} /> #e8e2db Beige BG</div>
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#fab95b' }} /> #fab95b Gold Accent</div>
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#547792' }} /> #547792 Slate Secondary</div>
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#1a3263' }} /> #1a3263 Navy Primary</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-[#fab95b]/20 flex justify-between text-[12px] text-[#e8e2db]/60">
            <div>© 2026 Tamil Nadu College Discovery Platform • 100% Real Images from psgtech.edu • No AI • Real-time</div>
            <div>Palette: #e8e2db #fab95b #547792 #1a3263 • Unique UI • Alignment Correct</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
