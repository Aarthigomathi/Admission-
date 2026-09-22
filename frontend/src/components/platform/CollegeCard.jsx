import { Link } from 'react-router-dom'
import { MapPin, GraduationCap, Bookmark, GitCompare, BadgeCheck, Building2 } from 'lucide-react'
import { applyCollegeTheme } from '../../lib/theme'

export default function CollegeCard({ college, variant="default" }) {
  const { colors } = applyCollegeTheme(college)

  if (variant === "compact") {
    return (
      <Link to={`/college/${college.slug}`} className="group flex gap-4 p-4 rounded-[20px] bg-white border border-[#f1f1ef] hover:shadow-lg transition-all">
        <div className="h-14 w-14 rounded-[14px] overflow-hidden bg-zinc-100 shrink-0">
          <img src={college.branding.heroImage} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-[14px] leading-tight truncate">{college.name}</div>
          <div className="text-[12px] text-zinc-500 flex items-center gap-1 mt-1"><MapPin size={12} />{college.district}</div>
        </div>
      </Link>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-[28px] bg-white border border-[#f1f1ef] shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] transition-all duration-500 hover:-translate-y-1">
      {/* Cover */}
      <div className="relative h-[220px] overflow-hidden">
        <img src={college.branding.heroImage} alt={college.name} className="h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        
        {/* Top badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex gap-2">
            {college.verified && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur text-[11px] font-bold tracking-wide text-emerald-700 border border-white/50">
                <BadgeCheck size={14} /> VERIFIED
              </span>
            )}
            <span className="px-3 py-1.5 rounded-full bg-black/30 backdrop-blur text-[11px] font-semibold text-white border border-white/20">
              {college.type.split(' ')[0]}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur hover:bg-white transition-colors">
              <Bookmark size={16} />
            </button>
            <button className="h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur hover:bg-white transition-colors">
              <GitCompare size={16} />
            </button>
          </div>
        </div>

        {/* Logo */}
        <div className="absolute -bottom-7 left-6 h-[64px] w-[64px] rounded-[18px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-[#f1f1ef] overflow-hidden p-1">
          <img src={college.branding.logo} className="h-full w-full object-cover rounded-[12px]" />
        </div>

        {/* Title over image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pt-12">
          <div className="pl-[76px]">
            <div className="flex items-center gap-2 text-white/80 text-[11px] font-semibold tracking-widest uppercase">
              <Building2 size={12} /> {college.affiliation} • Est. {college.established}
            </div>
            <h3 className="font-display text-[22px] font-semibold leading-[1.1] text-white mt-1 text-balance">{college.name}</h3>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 pt-8">
        <div className="flex items-center gap-2 text-[13px] text-zinc-500 mb-4">
          <span className="inline-flex items-center gap-1"><MapPin size={13} />{college.location.city}, {college.district}</span>
          <span className="h-1 w-1 rounded-full bg-zinc-300" />
          <span className="inline-flex items-center gap-1"><GraduationCap size={13} />{college.quickInfo.courses} Courses</span>
        </div>

        <div className="flex gap-2 mb-5">
          <div className="px-3 py-1.5 rounded-full bg-[#fbfaf8] border border-[#ede9e3] text-[12px] font-medium">{college.accreditation.split('•')[0]}</div>
          <div className="px-3 py-1.5 rounded-full bg-[#fbfaf8] border border-[#ede9e3] text-[12px] font-medium">{college.quickInfo.placement} Placement</div>
        </div>

        <p className="text-[13px] leading-[1.6] text-zinc-600 line-clamp-2 mb-5">{college.about.overview.slice(0,140)}...</p>

        <div className="grid grid-cols-3 gap-3 py-4 border-y border-zinc-100 mb-5">
          <div>
            <div className="text-[11px] tracking-wide uppercase text-zinc-400 font-semibold">Courses</div>
            <div className="font-semibold text-[14px] mt-0.5">{college.quickInfo.courses}</div>
          </div>
          <div>
            <div className="text-[11px] tracking-wide uppercase text-zinc-400 font-semibold">Avg. Package</div>
            <div className="font-semibold text-[14px] mt-0.5">{college.placements.average}</div>
          </div>
          <div>
            <div className="text-[11px] tracking-wide uppercase text-zinc-400 font-semibold">Campus</div>
            <div className="font-semibold text-[14px] mt-0.5">{college.quickInfo.campus}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to={`/college/${college.slug}`} className="flex-1 h-11 grid place-items-center rounded-full bg-[#0f172a] text-white text-[13px] font-semibold tracking-wide hover:bg-black transition-colors">
            View College
          </Link>
          <Link to={`/college/${college.slug}#courses`} className="h-11 px-5 grid place-items-center rounded-full bg-white border border-zinc-200 text-[13px] font-semibold hover:bg-zinc-50">
            Courses
          </Link>
        </div>

        {/* Color accent line */}
        <div className="mt-6 h-[4px] w-full rounded-full overflow-hidden bg-zinc-100">
          <div className="h-full w-[60%] rounded-full" style={{ background: colors.primary }} />
        </div>
      </div>
    </div>
  )
}
