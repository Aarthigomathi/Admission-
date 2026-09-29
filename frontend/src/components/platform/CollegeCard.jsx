import { Link } from 'react-router-dom'
import { MapPin, GraduationCap, Bookmark, GitCompare, BadgeCheck, Building2 } from 'lucide-react'
import { getCollegeCustomData } from '../../lib/collegeStorage'

export default function CollegeCard({ college, variant="default" }) {
  const customData = getCollegeCustomData(college.id)
  const displayCollege = {
    ...college,
    branding: {
      logo: customData.branding?.logo || college.branding?.logo || '',
      heroImage: customData.branding?.heroImage || college.branding?.heroImage || '',
      ...college.branding,
      ...(customData.branding || {})
    },
    departments: customData.departments?.length ? customData.departments : (college.departments || []),
    courses: customData.courses?.length ? customData.courses : (college.courses || []),
    gallery: customData.gallery?.length ? customData.gallery.map(g=>g.url) : (college.gallery || []),
  }

  const heroImage = displayCollege.branding.heroImage || displayCollege.branding.coverImage || `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop`
  const logo = displayCollege.branding.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(college.name)}&background=1A3263&color=FAB95B&size=128`

  if (variant === "compact") {
    return (
      <Link to={`/college/${college.slug}`} className="group flex gap-4 p-4 rounded-[20px] bg-white border-2 border-[#E8E2DB] hover:shadow-lg hover:border-[#FAB95B]/50 transition-all">
        <div className="h-14 w-14 rounded-[14px] overflow-hidden bg-[#E8E2DB] shrink-0 border-2 border-[#FAB95B]/20">
          <img src={heroImage} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" alt={college.name} />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-[13px] leading-tight truncate text-[#1A3263]">{college.name}</div>
          <div className="text-[11px] text-[#547792] flex items-center gap-1 mt-1"><MapPin size={12} />{college.district} • {college.city}</div>
        </div>
      </Link>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-[28px] bg-white border-2 border-[#E8E2DB] shadow-[0_2px_10px_rgba(26,50,99,0.06)] hover:shadow-[0_12px_40px_rgba(26,50,99,0.15)] transition-all duration-500 hover:-translate-y-1 hover:border-[#FAB95B]/40">
      <div className="relative h-[240px] overflow-hidden bg-[#E8E2DB]">
        <img src={heroImage} alt={`${college.name} Campus`} className="h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A3263]/80 via-[#1A3263]/20 to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex gap-2 flex-wrap">
            {college.verified || college.verificationStatus === 'VERIFIED' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] text-[11px] font-bold tracking-wide shadow-lg">
                <BadgeCheck size={14} /> VERIFIED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur border text-[#1A3263] text-[10px] font-bold">{college.verificationStatus || 'PENDING'}</span>
            )}
            <span className="px-3 py-1.5 rounded-full bg-[#1A3263]/80 backdrop-blur text-[#E8E2DB] border border-[#FAB95B]/30 text-[11px] font-bold">
              {college.type?.split(' ')[0] || 'College'}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur hover:bg-[#FAB95B] text-[#1A3263] transition-colors border border-white/50">
              <Bookmark size={16} />
            </button>
            <button className="h-9 w-9 grid place-items-center rounded-full bg-white/90 backdrop-blur hover:bg-white text-[#1A3263] transition-colors">
              <GitCompare size={16} />
            </button>
          </div>
        </div>

        <div className="absolute -bottom-7 left-6 h-[64px] w-[64px] rounded-[18px] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.15)] border-2 border-[#FAB95B] overflow-hidden p-1">
          <img src={logo} className="h-full w-full object-cover rounded-[12px] bg-[#E8E2DB]" alt={`${college.name} Logo`} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 pt-12">
          <div className="pl-[76px]">
            <div className="flex items-center gap-2 text-[#FAB95B] text-[11px] font-bold tracking-widest uppercase">
              <Building2 size={12} /> {college.affiliation || college.university || 'Anna University'} • Est. {college.established || '2000'}
            </div>
            <h3 className="font-display text-[18px] font-bold leading-[1.1] text-white mt-1 text-balance">{college.name}</h3>
          </div>
        </div>
      </div>

      <div className="p-6 pt-10 bg-white">
        <div className="flex items-center gap-2 text-[12px] text-[#547792] mb-4 font-medium flex-wrap">
          <span className="inline-flex items-center gap-1"><MapPin size={13} />{college.city}, {college.district}</span>
          <span className="h-1 w-1 rounded-full bg-[#FAB95B]" />
          <span className="inline-flex items-center gap-1"><GraduationCap size={13} />{displayCollege.courses?.length || 0} Courses</span>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          <div className="px-3 py-1.5 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[#1A3263] text-[11px] font-bold">{college.accreditation?.split('•')[0] || 'NAAC A++'}</div>
          <div className="px-3 py-1.5 rounded-full bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 text-[#1A3263] text-[11px] font-bold">{displayCollege.departments?.length || 0} Departments</div>
        </div>

        <p className="text-[12px] leading-[1.6] text-[#1A3263]/70 line-clamp-2 mb-5">
          {customData.about?.fullText || college.about?.overview || `${college.name} located in ${college.district}, ${college.city} offering quality education with excellent placement records.`}
        </p>

        <div className="grid grid-cols-3 gap-3 py-4 border-y-2 border-[#E8E2DB] mb-5">
          <div>
            <div className="text-[10px] tracking-wide uppercase text-[#547792] font-bold">Courses</div>
            <div className="font-bold text-[14px] mt-0.5 text-[#1A3263]">{displayCollege.courses?.length || 0}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-wide uppercase text-[#547792] font-bold">Departments</div>
            <div className="font-bold text-[14px] mt-0.5 text-[#1A3263]">{displayCollege.departments?.length || 0}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-wide uppercase text-[#547792] font-bold">Campus</div>
            <div className="font-bold text-[13px] mt-0.5 text-[#1A3263]">{college.district}</div>
          </div>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
          {displayCollege.gallery?.slice(0,4).map((img,i)=>(
            <img key={i} src={typeof img === 'string' ? img : img.url} className="h-12 w-16 rounded-[8px] object-cover border-2 border-[#E8E2DB] shrink-0" alt="Campus" />
          ))}
          {displayCollege.gallery?.length > 4 && (
            <div className="h-12 px-3 rounded-[8px] bg-[#E8E2DB] border-2 border-[#E8E2DB] grid place-items-center text-[10px] font-bold text-[#1A3263] shrink-0">+{displayCollege.gallery.length-4}</div>
          )}
          {(!displayCollege.gallery || displayCollege.gallery.length===0) && (
            <div className="h-12 px-3 rounded-[8px] bg-[#E8E2DB]/50 border-2 border-dashed border-[#1A3263]/20 grid place-items-center text-[10px] font-bold text-[#547792] shrink-0">Campus Images</div>
          )}
        </div>

        <div className="flex gap-2">
          <Link to={`/college/${college.slug}`} className="flex-1 h-11 grid place-items-center rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#1A3263] text-[13px] font-bold tracking-wide hover:bg-[#1A3263]/90 transition-colors shadow-lg">
            View College
          </Link>
          <Link to={`/college/${college.slug}#courses`} className="h-11 px-5 grid place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] text-[13px] font-bold hover:bg-[#E8E2DB]">
            Courses
          </Link>
        </div>

        <div className="mt-6 h-[6px] w-full rounded-full overflow-hidden bg-[#E8E2DB] border border-[#E8E2DB]">
          <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-[#1A3263] via-[#547792] to-[#FAB95B]" />
        </div>
      </div>
    </div>
  )
}
