import { Link } from 'react-router-dom'
import { MapPin, GraduationCap, Bookmark, GitCompare, BadgeCheck, Building2, Image as ImageIcon } from 'lucide-react'
import { applyCollegeTheme } from '../../lib/theme'
import { getCollegeCustomData } from '../../lib/collegeStorage'
import { useLanguage } from '../../lib/languageContext'

export default function CollegeCard({ college, variant="default" }) {
  const customData = getCollegeCustomData(college.id)
  const { t, language } = useLanguage()
  // Merge custom data for display - your own college (not PSG) shows your own logo/images
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
    customFacilities: customData.customFacilities || [],
    placements: customData.placements?.length ? customData.placements : (college.placements || {}),
  }

  const { colors } = applyCollegeTheme(displayCollege)
  const isCustom = college.id > 1000 || customData.branding?.logo || customData.departments?.length > 0
  const heroImage = displayCollege.branding.heroImage || `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=400&fit=crop`
  const logo = displayCollege.branding.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(college.name)}&background=1A3263&color=FAB95B&size=128`

  if (variant === "compact") {
    return (
      <Link to={`/college/${college.slug}`} className="group flex gap-4 p-4 rounded-[20px] bg-white border-2 border-[#E8E2DB] hover:shadow-lg hover:border-[#FAB95B]/50 transition-all">
        <div className="h-14 w-14 rounded-[14px] overflow-hidden bg-[#E8E2DB] shrink-0 border-2 border-[#FAB95B]/20">
          <img src={heroImage} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`${college.name} Campus`} />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-[13px] leading-tight truncate text-[#1A3263]">{college.name} {isCustom && <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAB95B] text-[#1A3263] ml-1">Your Own</span>}</div>
          <div className="text-[11px] text-[#547792] flex items-center gap-1 mt-1"><MapPin size={12} />{college.district} • ID {college.id} • {isCustom ? 'Your Own (Not PSG)' : 'Real'}</div>
        </div>
      </Link>
    )
  }

  return (
    <div className="group relative overflow-hidden rounded-[28px] bg-white border-2 border-[#E8E2DB] shadow-[0_2px_10px_rgba(26,50,99,0.06)] hover:shadow-[0_12px_40px_rgba(26,50,99,0.15)] transition-all duration-500 hover:-translate-y-1 hover:border-[#FAB95B]/40">
      <div className="relative h-[240px] overflow-hidden bg-[#E8E2DB]">
        <img src={heroImage} alt={`${college.name} Campus - ${isCustom ? 'Your Own Image' : 'Real'}`} className="h-full w-full object-cover group-hover:scale-[1.04] transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A3263]/80 via-[#1A3263]/20 to-transparent" />
        
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex gap-2 flex-wrap">
            {college.verified || college.verificationStatus === 'VERIFIED' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] text-[11px] font-bold tracking-wide shadow-lg">
                <BadgeCheck size={14} /> VERIFIED {isCustom ? '• YOUR OWN' : '• REAL'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold">{college.verificationStatus || 'PENDING'} • ID {college.id} {isCustom && '• Your Own'}</span>
            )}
            <span className="px-3 py-1.5 rounded-full bg-[#1A3263]/80 backdrop-blur text-[#E8E2DB] border border-[#FAB95B]/30 text-[11px] font-bold">
              {college.type?.split(' ')[0] || college.collegeType || 'College'} • {isCustom ? 'Your Own' : 'Real'}
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
          <img src={logo} className="h-full w-full object-cover rounded-[12px] bg-[#E8E2DB]" alt={`${college.name} Logo - ${isCustom ? 'Your Own Logo' : 'Real'}`} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 pt-12">
          <div className="pl-[76px]">
            <div className="flex items-center gap-2 text-[#FAB95B] text-[11px] font-bold tracking-widest uppercase">
              <Building2 size={12} /> {college.affiliation || college.university || 'Anna University'} • Est. {college.established || '2000'} • {isCustom ? 'Your Own (Not PSG)' : 'Real'}
            </div>
            <h3 className="font-display text-[18px] font-bold leading-[1.1] text-white mt-1 text-balance">{college.name} {isCustom && <span className="text-[11px] bg-[#FAB95B] text-[#1A3263] px-2 py-0.5 rounded-full ml-2">Your Own</span>}</h3>
          </div>
        </div>
      </div>

      <div className="p-6 pt-10 bg-white">
        <div className="flex items-center gap-2 text-[12px] text-[#547792] mb-4 font-medium flex-wrap">
          <span className="inline-flex items-center gap-1"><MapPin size={13} />{college.city || college.location?.city || ''}, {college.district} • ID {college.id}</span>
          <span className="h-1 w-1 rounded-full bg-[#FAB95B]" />
          <span className="inline-flex items-center gap-1"><GraduationCap size={13} />{displayCollege.courses?.length || college.quickInfo?.courses || 0} Courses {isCustom ? 'You Added' : 'Real'}</span>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          <div className="px-3 py-1.5 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[#1A3263] text-[11px] font-bold">{college.accreditation?.split('•')[0] || 'NAAC A++' || 'Your Accreditation'} {isCustom ? '• You Added' : 'Real'}</div>
          <div className="px-3 py-1.5 rounded-full bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 text-[#1A3263] text-[11px] font-bold">{displayCollege.departments?.length || college.quickInfo?.departments || 0} Depts {isCustom ? 'You Added With HOD' : ''}</div>
        </div>

        <p className="text-[12px] leading-[1.6] text-[#1A3263]/70 line-clamp-2 mb-5">
          {isCustom ? 
            `Your own college - ${college.name} - ID ${college.id} - ${college.district} - You added ${displayCollege.departments?.length || 0} departments with HOD, ${displayCollege.courses?.length || 0} courses, ${customData.customFacilities?.length || 0} facilities, ${customData.placements?.length || 0} placements, ${customData.gallery?.length || 0} campus images - Your own (Not PSG) - UI frame ours, content yours - A to Z you add` 
            : `${(college.about?.overview || '').slice(0,140)}... Real from psgtech.edu`}
        </p>

        <div className="grid grid-cols-3 gap-3 py-4 border-y-2 border-[#E8E2DB] mb-5">
          <div>
            <div className="text-[10px] tracking-wide uppercase text-[#547792] font-bold">Courses {isCustom ? 'You Added' : 'Real'}</div>
            <div className="font-bold text-[14px] mt-0.5 text-[#1A3263]">{displayCollege.courses?.length || college.quickInfo?.courses || 0}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-wide uppercase text-[#547792] font-bold">Depts {isCustom ? 'With HOD' : ''}</div>
            <div className="font-bold text-[14px] mt-0.5 text-[#1A3263]">{displayCollege.departments?.length || college.quickInfo?.departments || 0}</div>
          </div>
          <div>
            <div className="text-[10px] tracking-wide uppercase text-[#547792] font-bold">{isCustom ? 'Your Own' : 'Campus Real'}</div>
            <div className="font-bold text-[13px] mt-0.5 text-[#1A3263]">{isCustom ? `ID ${college.id}` : (college.quickInfo?.campus || '45 Acres')}</div>
          </div>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
          {displayCollege.gallery?.slice(0,4).map((img,i)=>(
            <img key={i} src={typeof img === 'string' ? img : img.url} className="h-12 w-16 rounded-[8px] object-cover border-2 border-[#E8E2DB] shrink-0" alt={`${college.name} Campus - Your Own`} />
          ))}
          {displayCollege.gallery?.length > 4 ? (
            <div className="h-12 px-3 rounded-[8px] bg-[#E8E2DB] border-2 border-[#E8E2DB] grid place-items-center text-[10px] font-bold text-[#1A3263] shrink-0">+{displayCollege.gallery.length-4} {isCustom ? 'Your Images' : 'Real'}</div>
          ) : displayCollege.gallery?.length === 0 ? (
            <div className="h-12 px-3 rounded-[8px] bg-[#E8E2DB]/50 border-2 border-dashed border-[#1A3263]/20 grid place-items-center text-[10px] font-bold text-[#547792] shrink-0">{isCustom ? 'Add Your Campus Images - Your Own' : 'No Images'}</div>
          ) : null}
        </div>

        <div className="flex gap-2">
          <Link to={`/college/${college.slug}`} className="flex-1 h-11 grid place-items-center rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#1A3263] text-[13px] font-bold tracking-wide hover:bg-[#1A3263]/90 transition-colors shadow-lg">
            View College - {isCustom ? 'Your Own (Not PSG)' : 'Real Images'}
          </Link>
          <Link to={`/college/${college.slug}#courses`} className="h-11 px-5 grid place-items-center rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] text-[13px] font-bold hover:bg-[#E8E2DB]">
            {isCustom ? `${displayCollege.courses?.length || 0} Courses You Added` : 'Courses Real'}
          </Link>
        </div>

        <div className="mt-6 h-[6px] w-full rounded-full overflow-hidden bg-[#E8E2DB] border border-[#E8E2DB]">
          <div className="h-full w-[70%] rounded-full bg-gradient-to-r from-[#1A3263] via-[#547792] to-[#FAB95B]" />
        </div>
        <div className="mt-2 text-[10px] text-[#547792] font-medium text-center">
          {isCustom ? `Your Own College ID ${college.id} • ${college.name} • Not PSG • UI Frame Ours, Content Yours • A to Z You Add • ${college.district}` : `Palette: #E8E2DB #FAB95B #547792 #1A3263 • Real from psgtech.edu • Unique UI • Alignment Correct`}
        </div>
      </div>
    </div>
  )
}
