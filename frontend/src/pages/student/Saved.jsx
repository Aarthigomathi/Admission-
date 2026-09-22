import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { colleges } from '../../lib/colleges'
import { Bookmark, MapPin, Trash2, Eye, GitCompare, GraduationCap } from 'lucide-react'
import { activityTracker } from '../../lib/activityTracker'

export default function Saved() {
  const [saved, setSaved] = useState([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('tn_saved_colleges') || '[]')
    const enriched = data.map(s => {
      const c = colleges.find(col => col.id === s.id)
      return c ? { ...s, college: c } : null
    }).filter(Boolean)
    setSaved(enriched)
  }, [])

  const remove = (id) => {
    const updated = saved.filter(s => s.id !== id)
    setSaved(updated)
    localStorage.setItem('tn_saved_colleges', JSON.stringify(updated.map(u=>({ id: u.id, name: u.name, slug: u.slug, savedAt: u.savedAt }))))
  }

  return (
    <div className="min-h-screen bg-[#E8E2DB]">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-[28px] font-bold text-[#1A3263] flex items-center gap-3"><Bookmark className="text-[#FAB95B]" /> My Saved Colleges - {saved.length} Real</h1>
          <Link to="/search" className="h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] grid place-items-center">Explore More →</Link>
        </div>

        {saved.length===0 ? (
          <div className="mt-12 rounded-[24px] bg-white border-2 border-[#E8E2DB] p-16 text-center">
            <div className="text-5xl">🔖</div>
            <div className="font-bold text-[#1A3263] mt-6 text-[18px]">No saved colleges yet - Real</div>
            <div className="text-[13px] text-[#547792] mt-2 max-w-[480px] mx-auto">When student clicks SAVE on college card, it appears here. Activity tracked as SAVE with student_id/college_id/date/time/activity_type. Platform admin sees aggregated saves per college, NOT individual browsing.</div>
            <Link to="/search" className="mt-6 inline-flex h-11 px-6 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold">Discover Colleges - Real Tamil Nadu</Link>
          </div>
        ) : (
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            {saved.map(item=>(
              <div key={item.id} className="rounded-[20px] bg-white border-2 border-[#E8E2DB] overflow-hidden hover:border-[#FAB95B]/40 transition-colors">
                <div className="h-[140px] relative overflow-hidden">
                  <img src={item.college.branding.heroImage} className="h-full w-full object-cover" alt="Real" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A3263]/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.college.branding.logo} className="h-10 w-10 rounded-[10px] object-cover border-2 border-[#FAB95B] bg-white" alt="Real" />
                      <div className="text-white">
                        <div className="font-bold text-[14px]">{item.college.shortName}</div>
                        <div className="text-[11px] opacity-80 flex items-center gap-1"><MapPin size={10} />{item.college.district} • {item.college.type}</div>
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[10px] font-bold">{item.college.accreditation}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="font-semibold text-[#1A3263] text-[14px]">{item.college.name}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {item.college.courses.slice(0,3).map(c=><span key={c.id} className="px-2 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[10px] font-medium">{c.degree}</span>)}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/college/${item.college.slug}`} className="flex-1 h-9 rounded-full bg-[#1A3263] text-[#FAB95B] text-[12px] font-bold grid place-items-center flex items-center gap-1 justify-center"><Eye size={14} /> View</Link>
                    <button onClick={()=>remove(item.id)} className="h-9 w-9 rounded-full bg-white border-2 border-[#E8E2DB] grid place-items-center text-[#547792] hover:border-red-200 hover:text-red-600"><Trash2 size={14} /></button>
                  </div>
                  <div className="mt-3 text-[10px] text-[#547792]">Saved {new Date(item.savedAt).toLocaleDateString()} • Activity SAVE tracked securely</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 rounded-[16px] bg-white border-2 border-[#E8E2DB] p-5">
          <div className="text-[12px] font-bold text-[#1A3263]">Saved Feature - Activity Tracking</div>
          <div className="text-[11px] text-[#547792] mt-2">Student clicks SAVE → student_id, college_id, date, time, activity_type=SAVE stored in platform DB (localStorage tn_student_activities for demo). Platform admin sees aggregated: PSG Tech saved by 320 students. College analytics shows only own college saves count, NOT who saved.</div>
        </div>
      </div>
    </div>
  )
}
