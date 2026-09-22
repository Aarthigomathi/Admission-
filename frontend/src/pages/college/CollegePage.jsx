import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getCollegeBySlug, getCollegeCustomData, getPublicColleges } from '../../lib/collegeStorage'
import CollegeHeader from '../../components/college/CollegeHeader'
import { MapPin, Phone, Mail, BadgeCheck, Building2, GraduationCap, Users, Award, Image as ImageIcon } from 'lucide-react'


function CollegeHeroCarousel({ branding, college, customData }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  // Collect all college images: collegeImages array (up to 10) + heroImage fallback + gallery
  const collegeImages = branding.collegeImages || college.branding?.collegeImages || []
  const allImages = []
  // If collegeImages array exists, use it
  if (collegeImages.length > 0) {
    collegeImages.forEach(img => {
      if (img.url) allImages.push(img.url)
      else if (typeof img === 'string') allImages.push(img)
    })
  }
  // Fallback to heroImage if no collegeImages
  if (allImages.length === 0 && branding.heroImage) {
    allImages.push(branding.heroImage)
  }
  if (allImages.length === 0 && college.branding?.heroImage) {
    allImages.push(college.branding.heroImage)
  }

  useEffect(() => {
    if (allImages.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIdx(prev => (prev + 1) % allImages.length)
    }, 5000) // 5 sec oru time oru image auto swipe
    return () => clearInterval(interval)
  }, [allImages.length])

  if (allImages.length === 0) {
    return (
      <div className="relative h-[460px] overflow-hidden bg-[#1A3263]">
        <div className="h-full w-full bg-gradient-to-br from-[#1A3263] via-[#547792] to-[#1A3263] grid place-items-center">
          <div className="text-center text-white p-8">
            <div className="font-display text-[36px] font-bold">{college.name}</div>
            <div className="text-[14px] text-[#FAB95B] mt-2">{college.district} • {college.city} • Established {college.established}</div>
            <div className="text-[12px] text-white/60 mt-4 max-w-[500px]">{college.name} - Official Website</div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A3263]/90 via-[#1A3263]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
          <div className="mx-auto max-w-[1400px] flex gap-6 items-end">
            {branding.logo ? (
              <img src={branding.logo} className="h-20 w-20 rounded-[16px] object-cover border-4 border-[#FAB95B] bg-white shadow-xl" alt={`${college.name} Logo`} />
            ) : (
              <div className="h-20 w-20 rounded-[16px] bg-white border-4 border-[#FAB95B] grid place-items-center text-[#1A3263] font-bold text-[28px] shadow-xl">{college.name[0]}</div>
            )}
            <div className="text-white">
              <h1 className="font-display text-[32px] lg:text-[48px] font-bold leading-[0.9]">{college.name}</h1>
              <div className="text-[14px] text-[#FAB95B] mt-3 flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1"><MapPin size={14} /> {college.district} • {college.city}</span>
                <span className="px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[11px]">{college.verificationStatus} • Est. {college.established}</span>
              </div>
              <div className="text-[13px] text-white/80 mt-2">{customData.tagline || college.tagline || ''}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[460px] sm:h-[500px] lg:h-[520px] overflow-hidden bg-[#1A3263] group">
      {/* Images with fade transition */}
      {allImages.map((img, idx) => (
        <img
          key={idx}
          src={img}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${idx === currentIdx ? 'opacity-100' : 'opacity-0'}`}
          alt={`${college.name} Campus ${idx+1}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A3263]/90 via-[#1A3263]/30 to-transparent" />
      
      {/* Swipe indicators - dots */}
      {allImages.length > 1 && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {allImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all ${idx === currentIdx ? 'w-8 bg-[#FAB95B]' : 'w-2 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}

      {/* Image counter */}
      {allImages.length > 1 && (
        <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-black/40 backdrop-blur text-white text-[11px] font-bold border border-white/20 z-20">
          {currentIdx+1} / {allImages.length}
        </div>
      )}

      {/* College info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 z-10">
        <div className="mx-auto max-w-[1400px] flex gap-4 sm:gap-6 items-end">
          {branding.logo ? (
            <img src={branding.logo} className="h-16 w-16 sm:h-20 sm:w-20 rounded-[16px] object-cover border-4 border-[#FAB95B] bg-white shadow-xl shrink-0" alt={`${college.name} Logo`} />
          ) : (
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-[16px] bg-white border-4 border-[#FAB95B] grid place-items-center text-[#1A3263] font-bold text-[24px] sm:text-[28px] shadow-xl shrink-0">{college.name[0]}</div>
          )}
          <div className="text-white min-w-0 flex-1">
            <h1 className="font-display text-[24px] sm:text-[32px] lg:text-[48px] font-bold leading-[0.9] truncate sm:text-wrap">{college.name}</h1>
            <div className="text-[12px] sm:text-[14px] text-[#FAB95B] mt-2 sm:mt-3 flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={12} className="sm:hidden" /><MapPin size={14} className="hidden sm:block" /> {college.district} • {college.city}</span>
              <span className="px-2 sm:px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[10px] sm:text-[11px]">{college.verificationStatus} • Est. {college.established}</span>
            </div>
            <div className="text-[11px] sm:text-[13px] text-white/80 mt-1 sm:mt-2 truncate">{customData.tagline || college.tagline || ''}</div>
          </div>
        </div>
      </div>

      {/* Navigation arrows - visible on hover */}
      {allImages.length > 1 && (
        <>
          <button onClick={() => setCurrentIdx(prev => (prev - 1 + allImages.length) % allImages.length)} className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 backdrop-blur border border-white/20 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 z-20">‹</button>
          <button onClick={() => setCurrentIdx(prev => (prev + 1) % allImages.length)} className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 backdrop-blur border border-white/20 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/50 z-20">›</button>
        </>
      )}
    </div>
  )
}

function CustomCollegePage({ college, customData }) {
  const branding = customData.branding || college.branding || {}
  const departments = customData.departments || college.departments || []
  const courses = customData.courses || college.courses || []
  const facilities = customData.customFacilities || []
  const placements = customData.placements || []
  const gallery = customData.gallery || []
  const events = customData.events || []
  const announcements = customData.announcements || []
  const hostels = customData.hostels || []
  const about = customData.about || college.about || {}
  const management = customData.management || []
  const principal = customData.principal || customData.principalDetails || college.principal || null
  const principalFromStorage = customData.principalDetails || customData.principal

  const hasContent = (arr) => arr && arr.length > 0

  return (
    <div className="min-h-screen bg-[#E8E2DB]">
      <CollegeHeader college={{ ...college, branding: { ...college.branding, ...branding, logo: branding.logo || college.branding?.logo, heroImage: branding.heroImage || college.branding?.heroImage } }} />

      {/* Hero */}
      <CollegeHeroCarousel branding={branding} college={college} customData={customData} />

      {/* Quick Stats */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Departments", value: departments.length, sub: "With HOD", icon: Building2 },
            { label: "Courses", value: courses.length, sub: "Programs", icon: GraduationCap },
            { label: "Facilities", value: facilities.length, sub: "Campus Facilities", icon: Award },
            { label: "Placements", value: placements.length, sub: "Records", icon: Users },
          ].map((stat,i)=>(
            <div key={i} className="rounded-[16px] bg-white border-2 border-[#E8E2DB] p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[10px] bg-[#E8E2DB] border-2 border-[#FAB95B]/30 grid place-items-center text-[#1A3263]"><stat.icon size={18} /></div>
                <div>
                  <div className="font-display text-[22px] font-bold text-[#1A3263]">{stat.value}</div>
                  <div className="text-[10px] font-bold uppercase text-[#547792]">{stat.label}</div>
                  <div className="text-[11px] text-[#547792]/70">{stat.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-12 space-y-12">
        {/* About */}
        <section className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
          <h2 className="font-display text-[28px] font-bold text-[#1A3263]">About {college.name}</h2>
          {about.fullText ? (
            <p className="mt-4 text-[14px] leading-[1.7] text-[#1A3263]/80">{about.fullText}</p>
          ) : (
            <div className="mt-6 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed border-[#1A3263]/20">
              <div className="text-3xl">📝</div>
              <div className="font-bold text-[#1A3263] mt-3">About section not added yet</div>
              <div className="text-[12px] text-[#547792] mt-2">College admin can add about, vision, mission in Admin → About</div>
            </div>
          )}
          {about.vision && (
            <div className="mt-8 rounded-[16px] bg-[#1A3263] text-white p-6">
              <div className="font-bold text-[#FAB95B]">Vision</div>
              <div className="text-[13px] text-[#E8E2DB]/80 mt-2">{about.vision}</div>
            </div>
          )}
          {about.mission && about.mission.length>0 && (
            <div className="mt-4 rounded-[16px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-6">
              <div className="font-bold text-[#1A3263]">Mission</div>
              <div className="mt-3 space-y-2">
                {about.mission.map((m,i)=><div key={i} className="flex gap-2 text-[13px] text-[#1A3263]"><span className="h-5 w-5 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[10px] font-bold shrink-0">{i+1}</span>{m}</div>)}
              </div>
            </div>
          )}
        </section>

        {/* Principal Section */}
        <section className="rounded-[24px] bg-[#1A3263] border-2 border-[#1A3263] overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="font-display text-[28px] font-bold text-white inline-block relative">
                Principal
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-12 bg-[#FAB95B] rounded-full"></span>
              </h2>
            </div>
            
            {principal && principal.name ? (
              <div className="grid md:grid-cols-[280px_1fr] gap-6 lg:gap-8 max-w-[1200px] mx-auto">
                {/* Left - Principal Image */}
                <div className="text-center md:text-left">
                  <div className="rounded-[12px] overflow-hidden border-2 border-white/10 shadow-xl bg-white">
                    {principal.image ? (
                      <img src={principal.image} className="w-full h-[320px] object-cover object-top" alt={principal.name} />
                    ) : (
                      <div className="w-full h-[320px] bg-gradient-to-br from-[#E8E2DB] to-[#547792] grid place-items-center text-[#1A3263] font-bold text-[48px]">{principal.name[0]}</div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <div className="font-bold text-[16px] text-white">{principal.name}</div>
                    {principal.designation && <div className="text-[13px] text-[#FAB95B] mt-1">{principal.designation}</div>}
                    <div className="text-[13px] text-white/80 mt-2 font-medium break-all">{principal.email || 'principal [at] college [dot] edu'}</div>
                    {principal.phone && <div className="text-[12px] text-white/60 mt-1">{principal.phone}</div>}
                    {principal.qualification && <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-[#FAB95B]/20 border border-[#FAB95B]/30 text-[#FAB95B] text-[11px] font-bold">{principal.qualification}</div>}
                    {principal.experience && <div className="mt-2 text-[11px] text-white/60">{principal.experience}</div>}
                  </div>
                </div>

                {/* Right - Biography */}
                <div className="rounded-[8px] bg-white p-6 lg:p-8 shadow-xl">
                  <div className="text-[13px] lg:text-[14px] leading-[1.8] text-[#1A3263]/90 space-y-4">
                    {principal.detailedBio ? (
                      <div className="whitespace-pre-wrap">{principal.detailedBio}</div>
                    ) : (
                      <>
                        {principal.message && <p>{principal.message}</p>}
                        {principal.qualification && <p><span className="font-bold">Qualification:</span> {principal.qualification} {principal.experience ? `with ${principal.experience} of experience` : ''}.</p>}
                        {principal.bio && <p>{principal.bio}</p>}
                        {!principal.message && !principal.bio && !principal.detailedBio && (
                          <p>{principal.name} is currently working as Principal, {college.name}, {college.city}, {college.district}. {principal.qualification ? `He has ${principal.experience || 'extensive'} experience in academic and research.` : ''}</p>
                        )}
                      </>
                    )}
                    {/* If detailedBio not provided but we have separate fields, show combined */}
                    {principal.research && <p>{principal.research}</p>}
                    {principal.publications && <p>{principal.publications}</p>}
                    {principal.awards && <p>{principal.awards}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-[800px] mx-auto py-16 text-center rounded-[16px] bg-white/5 border-2 border-dashed border-white/20">
                <div className="text-4xl">👨‍🏫</div>
                <div className="font-bold text-white mt-4 text-[18px]">Principal</div>
                <div className="text-[13px] text-white/60 mt-2 max-w-[500px] mx-auto">Principal information will be updated soon</div>
              </div>
            )}
          </div>
        </section>

        {/* Management Section */}
        <section className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
          <h2 className="font-display text-[24px] font-bold text-[#1A3263] flex items-center gap-3"><Users className="text-[#FAB95B]" /> Management & Trustees - {management.length}</h2>
          {hasContent(management) ? (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {management.map(member=>(
                <div key={member.id} className="rounded-[16px] border-2 border-[#E8E2DB] p-5 flex gap-4 hover:border-[#FAB95B]/40 transition-colors">
                  {member.image ? <img src={member.image} className="h-16 w-16 rounded-[12px] object-cover border-2 border-[#E8E2DB] shrink-0" alt={member.name} /> : <div className="h-16 w-16 rounded-[12px] bg-[#E8E2DB] grid place-items-center text-[#1A3263] font-bold text-[20px]">{member.name[0]}</div>}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#1A3263]">{member.name}</div>
                    <div className="mt-1 inline-flex px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-bold">{member.designation}</div>
                    <div className="text-[11px] text-[#547792] mt-2">{member.email} {member.phone ? `• ${member.phone}` : ''}</div>
                    <div className="text-[11px] text-[#1A3263]/60 mt-1">{member.description}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">Management information will be updated soon</div>
          )}
        </section>

        {/* Departments */}
        <section className="space-y-6">
          <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6">
            <h2 className="font-display text-[24px] font-bold text-[#1A3263] flex items-center gap-3"><Building2 className="text-[#FAB95B]" /> Departments</h2>
          </div>

          {hasContent(departments) ? (
            <div className="space-y-6">
              {departments.map(dept=>(
                <div key={dept.id} className="rounded-[24px] bg-[#1A3263] border-2 border-[#1A3263] overflow-hidden">
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="font-display text-[24px] font-bold text-white inline-block relative">
                        {dept.name}
                        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-12 bg-[#FAB95B] rounded-full"></span>
                      </h3>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <span className="inline-flex px-3 py-1 rounded-full bg-[#FAB95B]/20 border border-[#FAB95B]/30 text-[#FAB95B] text-[11px] font-bold">HOD: {dept.hod}</span>
                        {dept.facultyCount && <span className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-[11px]">{dept.facultyCount} Faculty</span>}
                        {dept.hodQualification && <span className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/70 text-[11px]">{dept.hodQualification}</span>}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-[280px_1fr] gap-6 lg:gap-8 max-w-[1200px] mx-auto">
                      {/* Left - HOD Image */}
                      <div className="text-center md:text-left">
                        <div className="rounded-[12px] overflow-hidden border-2 border-white/10 shadow-xl bg-white">
                          {(dept.hodImage || dept.image) ? (
                            <img src={dept.hodImage || dept.image} className="w-full h-[320px] object-cover object-top" alt={dept.hod} />
                          ) : (
                            <div className="w-full h-[320px] bg-gradient-to-br from-[#E8E2DB] to-[#547792] grid place-items-center text-[#1A3263] font-bold text-[48px]">{dept.hod ? dept.hod[0] : dept.name[0]}</div>
                          )}
                        </div>
                        <div className="mt-4 text-center">
                          <div className="font-bold text-[16px] text-white">{dept.hod}</div>
                          <div className="text-[13px] text-[#FAB95B] mt-1">{dept.hodDesignation || `Head of Department - ${dept.name}`}</div>
                          <div className="text-[13px] text-white/80 mt-2 font-medium break-all">{dept.hodEmail || `${dept.hod ? dept.hod.toLowerCase().replace(/\s+/g,'') : 'hod'} [at] college [dot] edu`}</div>
                          {dept.hodPhone && <div className="text-[12px] text-white/60 mt-1">{dept.hodPhone}</div>}
                          {dept.hodQualification && <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-[#FAB95B]/20 border border-[#FAB95B]/30 text-[#FAB95B] text-[11px] font-bold">{dept.hodQualification}</div>}
                          {dept.hodExperience && <div className="mt-2 text-[11px] text-white/60">{dept.hodExperience}</div>}
                          {dept.facultyCount && <div className="mt-2 text-[11px] text-white/50">Faculty Count: {dept.facultyCount}</div>}
                        </div>
                      </div>

                      {/* Right - Biography */}
                      <div className="rounded-[8px] bg-white p-6 lg:p-8 shadow-xl">
                        <div className="text-[13px] lg:text-[14px] leading-[1.8] text-[#1A3263]/90 space-y-4">
                          {dept.hodDetailedBio ? (
                            <div className="whitespace-pre-wrap">{dept.hodDetailedBio}</div>
                          ) : dept.hodBio ? (
                            <div className="whitespace-pre-wrap">{dept.hodBio}</div>
                          ) : (
                            <>
                              {dept.description && <p><span className="font-bold">About {dept.name}:</span> {dept.description}</p>}
                              <p>{dept.hod} is currently working as {dept.hodDesignation || `Head of Department, ${dept.name}`} at {college.name}, {college.city}, {college.district}.</p>
                              {dept.facultyCount && <p><span className="font-bold">Department Strength:</span> {dept.facultyCount} faculty members with expertise in various domains of {dept.name}.</p>}
                            </>
                          )}
                          {dept.hodResearch && <p><span className="font-bold">Research:</span> {dept.hodResearch}</p>}
                          {dept.hodPublications && <p><span className="font-bold">Publications:</span> {dept.hodPublications}</p>}
                          {dept.hodAwards && <p><span className="font-bold">Awards:</span> {dept.hodAwards}</p>}
                        </div>

                        {/* Department extra info if bio exists */}
                        {dept.description && dept.hodDetailedBio && (
                          <div className="mt-8 pt-6 border-t-2 border-[#E8E2DB]">
                            <div className="font-bold text-[14px] text-[#1A3263] flex items-center gap-2"><Building2 size={16} className="text-[#FAB95B]" /> About {dept.name} Department</div>
                            <div className="text-[13px] text-[#547792] mt-3 leading-[1.7]">{dept.description}</div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {dept.facultyCount && <span className="px-3 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[11px] font-bold">Faculty: {dept.facultyCount}</span>}
                              {dept.image && <span className="px-3 py-1 rounded-full bg-[#FAB95B]/20 text-[#1A3263] text-[11px] font-bold">Dept Image Available</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8 py-16 text-center">
              <div className="text-4xl">🏛️</div>
              <div className="font-bold text-[#1A3263] mt-4 text-[18px]">Departments</div>
              <div className="text-[13px] text-[#547792] mt-2 max-w-[600px] mx-auto">Departments information will be updated soon</div>
            </div>
          )}
        </section>

        {/* Courses */}
        <section className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
          <h2 className="font-display text-[24px] font-bold text-[#1A3263] flex items-center gap-3"><GraduationCap className="text-[#FAB95B]" /> Courses - {courses.length}</h2>
          {hasContent(courses) ? (
            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {courses.map(course=>(
                <div key={course.id} className="rounded-[16px] border-2 border-[#E8E2DB] p-5 hover:border-[#FAB95B]/40 transition-colors">
                  <div className="font-bold text-[#1A3263]">{course.degree} - {course.name}</div>
                  <div className="text-[12px] text-[#547792] mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[11px]">{course.duration}</span>
                    <span className="px-2 py-1 rounded-full bg-[#FAB95B]/20 text-[#1A3263] text-[11px] font-bold">{course.fees}</span>
                    <span className="px-2 py-1 rounded-full bg-white border text-[11px]">Intake {course.intake}</span>
                  </div>
                  <div className="text-[11px] text-[#1A3263]/60 mt-2">Eligibility: {course.eligibility}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed">
              <div className="font-bold text-[#1A3263] mt-3">Courses</div>
              <div className="text-[12px] text-[#547792] mt-2">Courses information will be updated soon</div>
            </div>
          )}
        </section>

        {/* Facilities */}
        <section className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
          <h2 className="font-display text-[24px] font-bold text-[#1A3263]">Facilities - {facilities.length}</h2>
          {hasContent(facilities) ? (
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {facilities.map(f=>(
                <div key={f.id} className="rounded-[16px] border-2 border-[#E8E2DB] overflow-hidden">
                  {f.image && <img src={f.image} className="h-[140px] w-full object-cover" alt={f.name} />}
                  <div className="p-4"><div className="font-bold text-[#1A3263] text-[13px]">{f.name}</div><div className="text-[11px] text-[#547792] mt-1">{f.description}</div></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">Facilities information will be updated soon</div>
          )}
        </section>

        {/* Placements */}
        <section className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
          <h2 className="font-bold text-[20px] text-[#1A3263]">Placements - {placements.length} Records</h2>
          {hasContent(placements) ? (
            <div className="mt-6 space-y-3">
              {placements.map(p=>(
                <div key={p.id} className="flex items-center justify-between p-4 rounded-[12px] border-2 border-[#E8E2DB] bg-[#E8E2DB]/20">
                  <div><div className="font-bold text-[#1A3263] text-[13px]">{p.company} - {p.year}</div><div className="text-[11px] text-[#547792]">{p.package} • {p.students} students • {p.department}</div></div>
                  <span className="px-3 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold">{p.package}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-10 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed text-[12px] text-[#547792]">Placement information will be updated soon</div>
          )}
        </section>

        {/* Gallery */}
        <section className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8">
          <h2 className="font-bold text-[20px] text-[#1A3263] flex items-center gap-2"><ImageIcon className="text-[#FAB95B]" /> Gallery - {gallery.length} Images</h2>
          {hasContent(gallery) ? (
            <div className="mt-6 grid md:grid-cols-3 gap-4">
              {gallery.map(img=>(
                <div key={img.id} className="rounded-[12px] overflow-hidden border-2 border-[#E8E2DB]">
                  <img src={img.url} className="h-[180px] w-full object-cover" alt={img.caption} />
                  <div className="p-3 text-[11px] font-medium text-[#1A3263] bg-[#E8E2DB]/30">{img.caption}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 py-12 text-center rounded-[16px] bg-[#E8E2DB]/30 border-2 border-dashed">
              <div className="font-bold text-[#1A3263] mt-3">Gallery</div>
              <div className="text-[11px] text-[#547792] mt-1">Gallery will be updated soon</div>
            </div>
          )}
        </section>

        {/* Contact */}
        <section className="rounded-[24px] bg-[#1A3263] text-white p-8">
          <h2 className="font-display text-[24px] font-bold text-[#FAB95B]">Contact {college.name}</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6 text-[13px]">
            <div className="flex gap-3"><MapPin size={18} className="text-[#FAB95B] shrink-0" /><div><div className="font-bold text-[#FAB95B]">Address</div><div className="text-[#E8E2DB]/80 mt-1">{college.address}, {college.city}, {college.district} - {college.pincode}</div></div></div>
            <div className="flex gap-3"><Phone size={18} className="text-[#FAB95B] shrink-0" /><div><div className="font-bold text-[#FAB95B]">Phone</div><div className="text-[#E8E2DB]/80 mt-1">{college.phone}</div></div></div>
            <div className="flex gap-3"><Mail size={18} className="text-[#FAB95B] shrink-0" /><div><div className="font-bold text-[#FAB95B]">Email</div><div className="text-[#E8E2DB]/80 mt-1">{college.email}</div><div className="text-[#E8E2DB]/60 text-[11px] mt-1">{college.website}</div></div></div>
          </div>
        </section>
      </div>

      <footer className="bg-[#1A3263] text-white border-t-4 border-[#FAB95B] mt-12">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-10">
          <div className="flex flex-wrap justify-between gap-8">
            <div>
              <div className="flex gap-3">
                {branding.logo ? <img src={branding.logo} className="h-12 w-12 rounded-[12px] bg-white object-cover border-2 border-[#FAB95B]" alt="Logo" /> : <div className="h-12 w-12 rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold">{college.name[0]}</div>}
                <div><div className="font-bold">{college.name}</div><div className="text-[11px] text-[#FAB95B]">Est. {college.established} • {college.district}</div></div>
              </div>
              <div className="text-[11px] text-[#E8E2DB]/60 mt-4 max-w-[360px]">{college.name} - {college.district} - Official Website</div>
            </div>
            <div className="text-[11px] text-[#E8E2DB]/40">© 2026 {college.name} • All Rights Reserved</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function CollegePage() {
  const { slug } = useParams()
  const [college, setCollege] = useState(null)
  const [customData, setCustomData] = useState({})

  useEffect(() => {
    const found = getCollegeBySlug(slug)
    if (found) {
      setCollege(found)
      setCustomData(getCollegeCustomData(found.id))
    } else {
      // Also check public colleges
      const publicCols = getPublicColleges()
      const pubFound = publicCols.find(c => c.slug === slug)
      setCollege(pubFound || null)
      if (pubFound) setCustomData(getCollegeCustomData(pubFound.id))
    }
  }, [slug])

  if (!college) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#E8E2DB] p-8">
        <div className="text-center">
          <h1 className="font-display text-[32px] font-bold text-[#1A3263]">College not found</h1>
          <p className="text-[13px] text-[#547792] mt-2">College information not found</p>
          <Link to="/college/signup" className="mt-6 inline-flex h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-semibold">College Sign Up</Link>
        </div>
      </div>
    )
  }

  return <CustomCollegePage college={college} customData={customData} />
}
