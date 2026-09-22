import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { colleges } from '../../lib/colleges'
import { activityTracker } from '../../lib/activityTracker'
import CollegeCard from '../../components/platform/CollegeCard'
import { GraduationCap, Bookmark, GitCompare, Clock, Bell, Award, MapPin, TrendingUp, Eye, MessageCircle, Search, BookOpen, Heart } from 'lucide-react'

export default function StudentDashboard() {
  const [student, setStudent] = useState(null)
  const [recentlyViewedIds, setRecentlyViewedIds] = useState([])
  const [saved, setSaved] = useState([])
  const [compare, setCompare] = useState([])

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('tn_current_student') || 'null')
    setStudent(s)
    setRecentlyViewedIds(activityTracker.getRecentlyViewed())
    setSaved(JSON.parse(localStorage.getItem('tn_saved_colleges') || '[]'))
    setCompare(JSON.parse(localStorage.getItem('tn_compare_colleges') || '[]'))
  }, [])

  if (!student) {
    return (
      <div className="min-h-screen bg-[#E8E2DB] grid place-items-center p-6">
        <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-12 text-center max-w-[400px]">
          <h2 className="font-bold text-[#1A3263] text-[20px]">Please login as student</h2>
          <p className="text-[13px] text-[#547792] mt-2">Student dashboard requires login</p>
          <Link to="/login" className="mt-6 inline-flex h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold">Login</Link>
        </div>
      </div>
    )
  }

  const recentlyViewedColleges = recentlyViewedIds.map(id => colleges.find(c => c.id === id)).filter(Boolean)
  const recommended = colleges.filter(c => c.district === student.preferredDistrict || c.courses.some(co => co.name.includes(student.interestedCourse.split(' ')[0]))).slice(0,3)
  const savedColleges = saved.map(id => colleges.find(c => c.id === id)).filter(Boolean)

  return (
    <div className="min-h-screen bg-[#E8E2DB]">
      <div className="bg-[#1A3263] text-white border-b-4 border-[#FAB95B]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="font-display text-[32px] font-bold leading-[0.9]">Welcome, {student.fullName || 'Student'}! 👋</h1>
              <p className="mt-3 text-[14px] text-[#E8E2DB]/80 max-w-[600px]">Profile: {student.educationLevel} • {student.district} • Interested: {student.interestedCourse} • {student.groupStream} • {student.percentage} • Hostel: {student.hostelRequired} • Transport: {student.transportRequired}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-bold">{student.educationLevel}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px]">{student.district}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border text-[11px]">{student.interestedCourse}</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[11px] font-bold">Profile 100% Complete</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/search" className="h-11 px-6 rounded-full bg-white text-[#1A3263] font-bold text-[13px] flex items-center gap-2"><Search size={16} /> Explore Colleges</Link>
              <Link to="/student/saved" className="h-11 px-5 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[13px] flex items-center gap-2"><Bookmark size={16} /> Saved ({saved.length})</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: "Recently Viewed", value: recentlyViewedIds.length, icon: Clock, sub: "Colleges you viewed" },
            { label: "Saved Colleges", value: saved.length, icon: Bookmark, sub: "My saved list" },
            { label: "Compare List", value: compare.length, icon: GitCompare, sub: "For comparison" },
            { label: "My Enquiries", value: JSON.parse(localStorage.getItem('tn_enquiries') || '[]').length, icon: MessageCircle, sub: "With consent" },
          ].map((stat,i)=>(
            <div key={i} className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-5 flex gap-4">
              <div className="h-11 w-11 rounded-[12px] bg-[#E8E2DB] border-2 border-[#FAB95B]/30 grid place-items-center text-[#1A3263]"><stat.icon size={20} /></div>
              <div>
                <div className="font-display text-[24px] font-bold text-[#1A3263]">{stat.value}</div>
                <div className="text-[11px] font-bold uppercase text-[#547792]">{stat.label}</div>
                <div className="text-[11px] text-[#547792]/70">{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 grid lg:grid-cols-[1.6fr_1fr] gap-8">
          <div className="space-y-10">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2"><Heart size={20} className="text-[#FAB95B]" /> Recommended for You - Based on {student.interestedCourse}</h2>
                <Link to="/search" className="text-[12px] font-bold text-[#547792] hover:text-[#1A3263]">View All →</Link>
              </div>
              <p className="text-[12px] text-[#547792] mt-1">Why shown: Matches your selected {student.interestedCourse}, {student.preferredDistrict}, {student.collegeType} type, {student.educationLevel} level</p>
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                {recommended.map(c=>(
                  <CollegeCard key={c.id} college={c} />
                ))}
              </div>
            </div>

            {recentlyViewedColleges.length>0 && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-[20px] font-bold text-[#1A3263] flex items-center gap-2"><Clock size={18} /> Recently Viewed Colleges</h2>
                  <button onClick={()=>{activityTracker.clearRecentlyViewed(); setRecentlyViewedIds([])}} className="text-[11px] font-bold px-3 py-1 rounded-full bg-white border">Clear History</button>
                </div>
                <div className="mt-4 grid md:grid-cols-2 gap-4">
                  {recentlyViewedColleges.map(c=>(
                    <div key={c.id} className="flex gap-4 p-4 rounded-[16px] bg-white border-2 border-[#E8E2DB]">
                      <img src={c.branding.heroImage} className="h-16 w-16 rounded-[12px] object-cover border" alt="Real" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[13px] truncate text-[#1A3263]">{c.name}</div>
                        <div className="text-[11px] text-[#547792] flex items-center gap-1 mt-1"><MapPin size={10} />{c.district} • {c.type}</div>
                        <div className="mt-2 flex gap-2">
                          <Link to={`/college/${c.slug}`} className="h-7 px-3 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold grid place-items-center">View</Link>
                          <button onClick={()=>{activityTracker.removeFromRecentlyViewed(c.id); setRecentlyViewedIds(activityTracker.getRecentlyViewed())}} className="h-7 px-3 rounded-full bg-[#E8E2DB] text-[11px]">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6">
              <h3 className="font-bold text-[#1A3263] flex items-center gap-2"><Bookmark size={18} className="text-[#FAB95B]" /> Saved Colleges</h3>
              <div className="mt-4 space-y-3">
                {savedColleges.length===0 ? (
                  <div className="py-8 text-center text-[#547792]">
                    <Bookmark size={32} className="mx-auto opacity-30" />
                    <div className="text-[13px] mt-3">No saved colleges yet</div>
                    <div className="text-[11px] mt-1">Save colleges to see here - activity tracked securely</div>
                  </div>
                ) : savedColleges.map(c=>(
                  <div key={c.id} className="flex gap-3 p-3 rounded-[12px] bg-[#E8E2DB]/50 border">
                    <img src={c.branding.logo} className="h-10 w-10 rounded-[10px] object-cover bg-white border" alt="Logo" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[12px] truncate text-[#1A3263]">{c.shortName}</div>
                      <div className="text-[11px] text-[#547792]">{c.district}</div>
                    </div>
                    <Link to={`/college/${c.slug}`} className="h-8 px-3 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold grid place-items-center">View</Link>
                  </div>
                ))}
              </div>
              <Link to="/student/saved" className="mt-4 w-full h-10 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB] grid place-items-center font-bold text-[12px] text-[#1A3263]">View All Saved</Link>
            </div>

            <div className="rounded-[24px] bg-[#1A3263] text-white p-6 border-2 border-[#1A3263]">
              <h3 className="font-bold text-[#FAB95B] flex items-center gap-2"><TrendingUp size={18} /> Your Activity - Securely Tracked</h3>
              <div className="mt-4 space-y-3 text-[12px]">
                <div className="flex justify-between"><span className="text-[#E8E2DB]/70">College Views</span><span className="font-bold text-[#FAB95B]">{activityTracker.getAllActivities().filter(a=>a.activity_type==='COLLEGE_VIEW').length}</span></div>
                <div className="flex justify-between"><span className="text-[#E8E2DB]/70">Course Views</span><span className="font-bold">{activityTracker.getAllActivities().filter(a=>a.activity_type==='COURSE_VIEW').length}</span></div>
                <div className="flex justify-between"><span className="text-[#E8E2DB]/70">Saved</span><span className="font-bold">{activityTracker.getAllActivities().filter(a=>a.activity_type==='SAVE').length}</span></div>
                <div className="flex justify-between"><span className="text-[#E8E2DB]/70">Enquiries (with consent)</span><span className="font-bold text-[#FAB95B]">{activityTracker.getAllActivities().filter(a=>a.activity_type==='ENQUIRY').length}</span></div>
              </div>
              <div className="mt-4 p-3 rounded-[12px] bg-white/5 border border-white/10 text-[11px] leading-[1.5] text-[#E8E2DB]/70">
                🔒 Privacy: Your personal info NOT automatically shared to colleges when you view. Only when you click ENQUIRE NOW with consent, info shared. Activity tracked securely for recommendations.
              </div>
            </div>

            <div className="rounded-[24px] bg-white border-2 border-[#FAB95B]/30 p-6">
              <h3 className="font-bold text-[#1A3263]">Navigation</h3>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[
                  { label: "Explore Colleges", href: "/search", icon: Search },
                  { label: "Courses", href: "/search?type=course", icon: BookOpen },
                  { label: "Compare", href: "/student/compare", icon: GitCompare },
                  { label: "My Enquiries", href: "/student/enquiries", icon: MessageCircle },
                ].map(item=>(
                  <Link key={item.label} to={item.href} className="flex items-center gap-2 p-3 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] hover:border-[#FAB95B] text-[12px] font-semibold text-[#1A3263]">
                    <item.icon size={14} /> {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
