import { useState, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, MapPin, Filter, GraduationCap, Bookmark, GitCompare, ArrowUpRight } from 'lucide-react'
import CollegeCard from '../../components/platform/CollegeCard'
import { colleges } from '../../lib/colleges'

export default function SearchPage() {
  const [params] = useSearchParams()
  const initialQ = params.get('q') || ''
  const [q, setQ] = useState(initialQ)
  const [district, setDistrict] = useState('All')
  const [level, setLevel] = useState('All')
  const [saved, setSaved] = useState([])
  const [compare, setCompare] = useState([])

  const filtered = useMemo(() => {
    return colleges.filter(c => {
      const searchLower = q.toLowerCase()
      const matchesSearch = !q || 
        c.name.toLowerCase().includes(searchLower) ||
        c.shortName.toLowerCase().includes(searchLower) ||
        c.courses.some(co => co.name.toLowerCase().includes(searchLower) || co.degree.toLowerCase().includes(searchLower)) ||
        c.departments.some(d => d.name.toLowerCase().includes(searchLower))
      const matchesDistrict = district==='All' || c.district===district
      const matchesLevel = level==='All' || c.courses.some(co=>co.level===level)
      return matchesSearch && matchesDistrict && matchesLevel
    })
  }, [q, district, level])

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
    return results.slice(0, 20)
  }, [q])

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <div className="sticky top-[72px] z-30 bg-white border-b border-[#ede9e3]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full lg:max-w-[640px] flex gap-2">
              <div className="flex-1 flex items-center gap-3 px-5 h-12 rounded-full bg-[#fbfaf8] border border-[#ede9e3] focus-within:border-[#0f172a] focus-within:bg-white">
                <Search size={18} className="text-zinc-400" />
                <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search colleges, courses, departments..." className="flex-1 bg-transparent outline-none text-[14px] font-medium" />
              </div>
              <select value={district} onChange={e=>setDistrict(e.target.value)} className="h-12 px-4 rounded-full bg-white border border-[#ede9e3] text-[13px] font-medium">
                <option>All Districts</option>
                <option>Coimbatore</option>
                <option>Chennai</option>
                <option>Madurai</option>
              </select>
              <select value={level} onChange={e=>setLevel(e.target.value)} className="h-12 px-4 rounded-full bg-white border border-[#ede9e3] text-[13px] font-medium">
                <option value="All">All Levels</option>
                <option value="UG">UG</option>
                <option value="PG">PG</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-zinc-500">{filtered.length} colleges • {coursesSearch.length} courses found</span>
              <Link to="/compare" className="ml-2 h-9 px-4 rounded-full bg-zinc-900 text-white font-semibold inline-flex items-center gap-1.5"><GitCompare size={14} /> Compare ({compare.length})</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[1.7fr_1fr] gap-8">
          {/* Colleges */}
          <div>
            <h2 className="font-display text-[22px] font-semibold flex items-center gap-2"><GraduationCap size={22} /> Colleges {q && `for "${q}"`}</h2>
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              {filtered.map(c=>(
                <CollegeCard key={c.id} college={c} />
              ))}
            </div>
          </div>

          {/* Courses across colleges - Student requirement */}
          <div>
            <div className="rounded-[24px] bg-white border p-6 sticky top-[160px]">
              <h3 className="font-semibold text-[16px]">Courses across all colleges</h3>
              <p className="text-[12px] text-zinc-500 mt-1">Search "BCA" → shows College, Course, District, Compare, Save, Enquire</p>

              <div className="mt-6 space-y-3 max-h-[700px] overflow-auto pr-1">
                {coursesSearch.length===0 ? (
                  <div className="py-12 text-center text-zinc-400">
                    <div className="text-3xl">🎓</div>
                    <div className="text-[13px] mt-3">Search for courses like BCA, B.E, MBA to see results across colleges</div>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {["BCA","B.E CSE","MBA","B.Com"].map(tag=>(
                        <button key={tag} onClick={()=>setQ(tag)} className="px-3 py-1 rounded-full bg-zinc-50 border text-[12px] font-medium hover:bg-zinc-900 hover:text-white">{tag}</button>
                      ))}
                    </div>
                  </div>
                ) : coursesSearch.map(({ college, course }, i)=>(
                  <div key={i} className="group rounded-[16px] border bg-[#fbfaf8] p-4 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex gap-3">
                      <img src={college.branding.logo} className="h-10 w-10 rounded-[10px] object-cover border" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] leading-tight truncate">{course.name}</div>
                        <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1.5"><MapPin size={10} />{college.shortName} • {college.district} • {course.degree} • {course.duration}</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-white border text-[10px] font-bold">{course.level}</span>
                          <span className="px-2 py-0.5 rounded-full bg-white border text-[10px]">{course.fees}</span>
                          <span className="px-2 py-0.5 rounded-full bg-white border text-[10px]">Intake {course.intake}</span>
                        </div>
                        <div className="mt-3 flex gap-1.5">
                          <button onClick={()=>setSaved(s=>s.includes(college.id)?s:s.concat(college.id))} className="h-7 px-3 rounded-full bg-white border text-[11px] font-semibold inline-flex items-center gap-1"><Bookmark size={12} /> Save</button>
                          <button onClick={()=>setCompare(s=>s.includes(college.id)?s:s.concat(college.id))} className="h-7 px-3 rounded-full bg-white border text-[11px] font-semibold inline-flex items-center gap-1"><GitCompare size={12} /> Compare</button>
                          <Link to={`/college/${college.slug}`} className="h-7 px-3 rounded-full bg-zinc-900 text-white text-[11px] font-semibold grid place-items-center">View <ArrowUpRight size={12} className="ml-1" /></Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-[13px]">Saved Colleges</h4>
                <div className="mt-3 flex flex-wrap gap-2">
                  {saved.length===0 ? <span className="text-[12px] text-zinc-400">No saved yet</span> : saved.map(id=>{
                    const c = colleges.find(x=>x.id===id)
                    return <span key={id} className="px-3 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-medium">{c?.shortName}</span>
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
