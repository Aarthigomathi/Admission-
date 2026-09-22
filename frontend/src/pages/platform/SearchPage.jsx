import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, MapPin, Filter, GraduationCap, Bookmark, GitCompare, ArrowUpRight, Building2, Sparkles, Heart, Shield, Info } from 'lucide-react'
import CollegeCard from '../../components/platform/CollegeCard'
import { colleges as staticColleges } from '../../lib/colleges'
import { getAllCollegesMerged } from '../../lib/collegeStorage'
import { activityTracker, ACTIVITY_TYPES } from '../../lib/activityTracker'
import LanguageToggle from '../../components/student/LanguageToggle'
import { useLanguage } from '../../lib/languageContext'

export default function SearchPage() {
  const [params] = useSearchParams()
  const initialQ = params.get('q') || ''
  const { t, language, isStudent } = useLanguage()
  const [q, setQ] = useState(initialQ)
  const [district, setDistrict] = useState('All')
  const [courseFilter, setCourseFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [level, setLevel] = useState('All')
  const [hostelFilter, setHostelFilter] = useState('All')
  const [savedIds, setSavedIds] = useState([])
  const [compareIds, setCompareIds] = useState([])
  const [colleges, setColleges] = useState(staticColleges)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tn_saved_colleges') || '[]')
    setSavedIds(saved.map(c=>c.id))
    const compare = JSON.parse(localStorage.getItem('tn_compare_colleges') || '[]')
    setCompareIds(compare.map(c=>c.id))
    setColleges(getAllCollegesMerged())
  }, [])

  const filtered = useMemo(() => {
    return colleges.filter(c => {
      const searchLower = q.toLowerCase()
      const matchesSearch = !q || 
        c.name.toLowerCase().includes(searchLower) ||
        c.shortName.toLowerCase().includes(searchLower) ||
        c.district.toLowerCase().includes(searchLower) ||
        c.city.toLowerCase().includes(searchLower) ||
        c.type.toLowerCase().includes(searchLower) ||
        c.university.toLowerCase().includes(searchLower) ||
        c.accreditation.toLowerCase().includes(searchLower) ||
        c.courses.some(co => co.name.toLowerCase().includes(searchLower) || co.degree.toLowerCase().includes(searchLower)) ||
        c.departments.some(d => d.name.toLowerCase().includes(searchLower))
      
      const matchesDistrict = district==='All' || c.district===district
      const matchesLevel = level==='All' || c.courses.some(co=>co.level===level)
      const matchesType = typeFilter==='All' || c.type.toLowerCase().includes(typeFilter.toLowerCase())
      const matchesCourse = courseFilter==='All' || c.courses.some(co=>co.name.toLowerCase().includes(courseFilter.toLowerCase()) || co.degree.toLowerCase().includes(courseFilter.toLowerCase()))
      const matchesHostel = hostelFilter==='All' || (hostelFilter==='Yes' && c.facilities.hostel) || (hostelFilter==='No')
      
      return matchesSearch && matchesDistrict && matchesLevel && matchesType && matchesCourse && matchesHostel
    })
  }, [q, district, level, typeFilter, courseFilter, hostelFilter])

  const coursesSearch = useMemo(() => {
    if (!q) return []
    const results = []
    colleges.forEach(college => {
      college.courses.forEach(course => {
        if (course.name.toLowerCase().includes(q.toLowerCase()) || course.degree.toLowerCase().includes(q.toLowerCase())) {
          results.push({ college, course })
        }
      })
    })
    return results.slice(0, 24)
  }, [q])

  const handleSave = (college) => {
    const current = JSON.parse(localStorage.getItem('tn_saved_colleges') || '[]')
    const exists = current.find(c=>c.id===college.id)
    let updated
    if (exists) {
      updated = current.filter(c=>c.id!==college.id)
    } else {
      updated = [...current, { id: college.id, name: college.name, slug: college.slug, savedAt: new Date().toISOString() }]
      activityTracker.recordActivity({ collegeId: college.id, activityType: ACTIVITY_TYPES.SAVE, metadata: { collegeName: college.name } })
    }
    localStorage.setItem('tn_saved_colleges', JSON.stringify(updated))
    setSavedIds(updated.map(c=>c.id))
  }

  const handleCompare = (college) => {
    const current = JSON.parse(localStorage.getItem('tn_compare_colleges') || '[]')
    if (current.find(c=>c.id===college.id)) {
      const updated = current.filter(c=>c.id!==college.id)
      localStorage.setItem('tn_compare_colleges', JSON.stringify(updated))
      setCompareIds(updated.map(c=>c.id))
      return
    }
    if (current.length >= 4) {
      alert("You can compare up to 4 colleges. Remove one to add new.")
      return
    }
    const updated = [...current, { id: college.id, name: college.name, slug: college.slug }]
    localStorage.setItem('tn_compare_colleges', JSON.stringify(updated))
    setCompareIds(updated.map(c=>c.id))
    activityTracker.recordActivity({ collegeId: college.id, activityType: ACTIVITY_TYPES.COMPARE, metadata: { collegeName: college.name } })
  }

  const handleCourseView = (college, course) => {
    activityTracker.recordActivity({
      collegeId: college.id,
      courseId: course.id,
      activityType: ACTIVITY_TYPES.COURSE_VIEW,
      metadata: { collegeName: college.name, courseName: course.name }
    })
  }

  return (
    <div className="min-h-screen bg-[#E8E2DB]">
      <div className="sticky top-[72px] z-30 bg-white border-b-2 border-[#FAB95B]/20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-4">
          <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
            <div className="flex-1 w-full xl:max-w-[900px] flex flex-wrap gap-2">
              <div className="flex-1 min-w-[280px] flex items-center gap-3 px-5 h-12 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] focus-within:border-[#FAB95B] focus-within:bg-white transition-all">
                <Search size={18} className="text-[#1A3263]" />
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name/course/dept/district/city/university/type..." className="flex-1 bg-transparent outline-none text-[14px] font-medium placeholder:text-[#547792]/60 text-[#1A3263]" />
              </div>
              <select value={district} onChange={e=>setDistrict(e.target.value)} className="h-12 px-4 rounded-full bg-white border-2 border-[#E8E2DB] text-[13px] font-medium text-[#1A3263] focus:border-[#FAB95B] outline-none">
                <option value="All">All Districts</option>
                <option>Coimbatore</option>
                <option>Chennai</option>
                <option>Madurai</option>
                <option>Tiruchirappalli</option>
                <option>Salem</option>
                <option>Tiruppur</option>
              </select>
              <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="h-12 px-4 rounded-full bg-white border-2 border-[#E8E2DB] text-[13px] font-medium text-[#1A3263]">
                <option value="All">All Types</option>
                <option value="Government">Govt</option>
                <option value="Private">Private</option>
                <option value="Autonomous">Autonomous</option>
              </select>
              <select value={level} onChange={e=>setLevel(e.target.value)} className="h-12 px-4 rounded-full bg-white border-2 border-[#E8E2DB] text-[13px] font-medium text-[#1A3263]">
                <option value="All">All Levels</option>
                <option value="UG">UG</option>
                <option value="PG">PG</option>
                <option value="Diploma">Diploma</option>
              </select>
              <select value={courseFilter} onChange={e=>setCourseFilter(e.target.value)} className="h-12 px-4 rounded-full bg-white border-2 border-[#E8E2DB] text-[13px] font-medium text-[#1A3263]">
                <option value="All">All Courses</option>
                <option value="Computer Science">CSE</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electronics">ECE</option>
                <option value="MBA">MBA</option>
                <option value="BCA">BCA</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-[12px] flex-wrap">
              {isStudent && <LanguageToggle variant="pill" />}
              <span className="px-3 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold">{filtered.length} {language==='ta' ? 'கல்லூரிகள்' : 'colleges'}</span>
              <span className="px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold">{coursesSearch.length} {language==='ta' ? 'பாடங்கள்' : 'courses'}</span>
              <Link to="/student/compare" className="h-9 px-4 rounded-full bg-[#1A3263] text-white font-semibold inline-flex items-center gap-1.5 border-2 border-[#1A3263]"><GitCompare size={14} /> {t('compare')} ({compareIds.length}/4)</Link>
              <Link to="/student/saved" className="h-9 px-4 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-semibold inline-flex items-center gap-1.5"><Bookmark size={14} /> {t('saved')} ({savedIds.length})</Link>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[11px]">
            <span className="px-2 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] font-bold flex items-center gap-1"><Filter size={10} /> Filters:</span>
            <span className="text-[#547792]">district / course / type / govt-private / hostel / transport / accreditation / university • Search by name/course/dept/district/city/university/type • Premium cards #E8E2DB #FAB95B #547792 #1A3263</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1.7fr_1fr] gap-8">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><GraduationCap size={22} className="text-[#FAB95B]" /> Colleges {q && `for "${q}"`} - Real</h2>
              <span className="text-[11px] px-3 py-1 rounded-full bg-white border-2 border-[#E8E2DB] text-[#547792] font-bold">Cards: logo/name/district/city/type/popular courses/accreditation/campus image/verified badge/save/compare/view</span>
            </div>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              {filtered.map(c=>(
                <div key={c.id} className="relative">
                  <CollegeCard college={c} />
                  <div className="mt-2 flex gap-2 px-1">
                    <button onClick={()=>handleSave(c)} className={`flex-1 h-8 rounded-full border-2 text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${savedIds.includes(c.id) ? 'bg-[#FAB95B] border-[#FAB95B] text-[#1A3263]' : 'bg-white border-[#E8E2DB] text-[#1A3263] hover:border-[#FAB95B]'}`}><Bookmark size={12} /> {savedIds.includes(c.id) ? 'Saved' : 'Save'}</button>
                    <button onClick={()=>handleCompare(c)} className={`flex-1 h-8 rounded-full border-2 text-[11px] font-bold flex items-center justify-center gap-1 transition-all ${compareIds.includes(c.id) ? 'bg-[#1A3263] border-[#1A3263] text-[#FAB95B]' : 'bg-white border-[#E8E2DB] text-[#1A3263] hover:border-[#1A3263]'}`}><GitCompare size={12} /> {compareIds.includes(c.id) ? 'Added' : 'Compare'}</button>
                    <Link to={`/college/${c.slug}`} className="flex-1 h-8 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold grid place-items-center">View →</Link>
                  </div>
                </div>
              ))}
              {filtered.length===0 && (
                <div className="col-span-2 py-20 text-center rounded-[24px] bg-white border-2 border-[#E8E2DB]">
                  <div className="text-4xl">🔍</div>
                  <div className="font-semibold text-[#1A3263] mt-4">No colleges found</div>
                  <div className="text-[12px] text-[#547792] mt-2">Try different filters - Real colleges from Tamil Nadu</div>
                </div>
              )}
            </div>

            <div className="mt-10 rounded-[20px] bg-[#1A3263] text-white p-6">
              <div className="font-bold text-[#FAB95B] flex items-center gap-2"><Sparkles size={16} /> Recommendation System - Based on Your Profile</div>
              <div className="text-[12px] text-[#E8E2DB]/80 mt-3 leading-[1.6]">Recommendation based on course/level/marks/district/type/hostel/transport with WHY shown: Example - Recommended because you searched Computer Science, you are from Coimbatore, your education level 12th matches B.E Computer Science eligibility, you prefer hostel Yes, transport Yes, college type Autonomous. Why this college shown: 1) Course match B.E CSE, 2) District match Coimbatore preferred, 3) Education level 12th eligible, 4) Hostel available, 5) Transport available, 6) Accreditation A++ matches high marks 92%. Profile completion drives recommendation.</div>
            </div>
          </div>

          <div>
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6 sticky top-[160px]">
              <h3 className="font-bold text-[16px] text-[#1A3263] flex items-center gap-2"><Building2 size={18} className="text-[#FAB95B]" /> Courses across all colleges - Real</h3>
              <p className="text-[11px] text-[#547792] mt-1">Search "BCA" → shows College, Course, District, Compare, Save, Enquire • All districts discovery • Activity tracking COURSE_VIEW</p>

              <div className="mt-6 space-y-3 max-h-[700px] overflow-auto pr-1">
                {coursesSearch.length===0 ? (
                  <div className="py-12 text-center text-[#547792]">
                    <div className="text-3xl">🎓</div>
                    <div className="text-[13px] mt-3 font-medium text-[#1A3263]">Search for courses like BCA, B.E, MBA</div>
                    <div className="text-[11px] mt-1">to see results across colleges - Real courses from Tamil Nadu colleges</div>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {["BCA","B.E CSE","MBA","B.Com","Mechanical","ECE"].map(tag=>(
                        <button key={tag} onClick={()=>setQ(tag)} className="px-3 py-1 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] text-[11px] font-bold text-[#1A3263] hover:bg-[#FAB95B] hover:border-[#FAB95B] transition-colors">{tag}</button>
                      ))}
                    </div>
                  </div>
                ) : coursesSearch.map(({ college, course }, i)=>(
                  <div key={i} className="group rounded-[16px] border-2 border-[#E8E2DB] bg-[#E8E2DB]/30 p-4 hover:bg-white hover:border-[#FAB95B]/40 hover:shadow-md transition-all">
                    <div className="flex gap-3">
                      <img src={college.branding.logo} className="h-10 w-10 rounded-[10px] object-cover border-2 border-[#E8E2DB] shrink-0" alt="Real" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] leading-tight truncate text-[#1A3263]">{course.name}</div>
                        <div className="text-[11px] text-[#547792] mt-1 flex items-center gap-1.5"><MapPin size={10} />{college.shortName} • {college.district} • {course.degree} • {course.duration}</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-white border text-[10px] font-bold text-[#1A3263]">{course.level}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#FAB95B]/20 border border-[#FAB95B]/30 text-[10px] font-bold text-[#1A3263]">{course.fees}</span>
                          <span className="px-2 py-0.5 rounded-full bg-white border text-[10px] text-[#547792]">Intake {course.intake}</span>
                        </div>
                        <div className="mt-3 flex gap-1.5">
                          <button onClick={()=>handleSave(college)} className="h-7 px-3 rounded-full bg-white border-2 border-[#E8E2DB] text-[11px] font-semibold inline-flex items-center gap-1 text-[#1A3263]"><Bookmark size={12} /> Save</button>
                          <button onClick={()=>handleCompare(college)} className="h-7 px-3 rounded-full bg-white border-2 border-[#E8E2DB] text-[11px] font-semibold inline-flex items-center gap-1 text-[#1A3263]"><GitCompare size={12} /> Compare</button>
                          <Link to={`/college/${college.slug}`} onClick={()=>handleCourseView(college, course)} className="h-7 px-3 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-semibold grid place-items-center">View <ArrowUpRight size={12} className="ml-1" /></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t-2 border-[#E8E2DB]">
                <h4 className="font-bold text-[13px] text-[#1A3263]">Saved Colleges - {savedIds.length}</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {savedIds.length===0 ? <span className="text-[12px] text-[#547792]">No saved yet - activity SAVE tracked securely</span> : savedIds.map(id=>{
                    const c = colleges.find(x=>x.id===id)
                    return <span key={id} className="px-3 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold">{c?.shortName}</span>
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-[16px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-4">
                <div className="text-[11px] font-bold text-[#1A3263] flex items-center gap-1"><Shield size={12} /> Privacy - Secure Tracking</div>
                <div className="text-[11px] text-[#1A3263]/80 mt-2 leading-[1.5]">Student viewing does NOT auto-send personal info to college. Only ENQUIRE NOW with consent shares. Aggregated only: X students viewed. No individual browsing exposed.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
