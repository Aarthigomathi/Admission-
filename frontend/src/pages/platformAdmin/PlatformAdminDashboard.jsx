import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { colleges } from '../../lib/colleges'
import { activityTracker } from '../../lib/activityTracker'
import { generateCollegeInterestReport, downloadReportAsPDF } from '../../lib/reports'
import { Users, Building2, Eye, Bookmark, GitCompare, MessageCircle, BarChart3, FileText, Download, Award, TrendingUp, MapPin, GraduationCap, CheckCircle2, Clock, AlertCircle, Search, Filter } from 'lucide-react'

export default function PlatformAdminDashboard() {
  const [selectedCollege, setSelectedCollege] = useState(colleges[0])
  const [activities, setActivities] = useState([])
  const [students, setStudents] = useState([])

  useEffect(() => {
    setActivities(activityTracker.getAllActivities())
    setStudents(JSON.parse(localStorage.getItem('tn_students') || '[]'))
  }, [])

  const aggregated = activityTracker.getAggregatedInterestForCollege(selectedCollege.id)
  const allActivities = activityTracker.getAllActivities()

  const totalStats = {
    totalStudents: students.length,
    totalColleges: colleges.length,
    verifiedColleges: colleges.filter(c=>c.verified).length,
    pendingColleges: JSON.parse(localStorage.getItem('tn_registered_colleges') || '[]').length,
    totalCollegeViews: allActivities.filter(a=>a.activity_type==='COLLEGE_VIEW').length,
    totalCourseViews: allActivities.filter(a=>a.activity_type==='COURSE_VIEW').length,
    totalSaves: allActivities.filter(a=>a.activity_type==='SAVE').length,
    totalComparisons: allActivities.filter(a=>a.activity_type==='COMPARE').length,
    totalEnquiries: allActivities.filter(a=>a.activity_type==='ENQUIRY').length,
  }

  const handleGeneratePDF = () => {
    const report = generateCollegeInterestReport(selectedCollege, aggregated, "September 2026")
    downloadReportAsPDF(report)
  }

  return (
    <div className="min-h-screen bg-[#E8E2DB] flex">
      <aside className="hidden lg:flex w-[280px] bg-[#1A3263] text-white flex-col sticky top-0 h-screen border-r-4 border-[#FAB95B]">
        <div className="h-[72px] px-6 flex items-center gap-3 border-b border-white/10">
          <div className="h-10 w-10 rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold">P</div>
          <div>
            <div className="font-bold text-[13px]">Platform Admin</div>
            <div className="text-[11px] text-[#FAB95B]">Analytics & Reports • Secure</div>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-auto space-y-2">
          <div className="rounded-[12px] bg-white/5 border border-white/10 p-4">
            <div className="text-[11px] uppercase font-bold text-[#FAB95B]">Total Overview</div>
            <div className="mt-3 space-y-2 text-[12px]">
              <div className="flex justify-between"><span className="opacity-70">Students</span><span className="font-bold">{totalStats.totalStudents}</span></div>
              <div className="flex justify-between"><span className="opacity-70">Colleges</span><span className="font-bold">{totalStats.totalColleges}</span></div>
              <div className="flex justify-between"><span className="opacity-70">Verified</span><span className="font-bold text-[#FAB95B]">{totalStats.verifiedColleges}</span></div>
              <div className="flex justify-between"><span className="opacity-70">Pending</span><span className="font-bold text-amber-300">{totalStats.pendingColleges}</span></div>
            </div>
          </div>

          <div className="pt-4">
            <div className="text-[11px] font-bold uppercase opacity-40 px-3">Select College for Report</div>
            <div className="mt-3 space-y-1">
              {colleges.map(c=>(
                <button key={c.id} onClick={()=>setSelectedCollege(c)} className={`w-full text-left p-3 rounded-[12px] border text-[12px] transition-all ${selectedCollege.id===c.id?'bg-[#FAB95B] text-[#1A3263] border-[#FAB95B] font-bold':'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <div className="font-semibold truncate">{c.shortName}</div>
                  <div className="text-[11px] opacity-70 truncate">{c.district} • ID {c.id}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex h-10 rounded-full bg-white/10 border border-white/20 items-center justify-center text-[12px] font-semibold">← Back to Platform</Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-20 h-[72px] bg-white border-b-2 border-[#FAB95B]/30 px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-[20px] font-bold text-[#1A3263]">Platform Admin Dashboard - Analytics & PDF Reports</h1>
            <div className="text-[11px] text-[#547792]">Secure activity tracking • Privacy protected • Aggregated analytics • College-wise PDF reports • #E8E2DB #FAB95B #547792 #1A3263</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden lg:flex px-3 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold">SUPER_ADMIN • Secure</span>
            <button onClick={handleGeneratePDF} className="h-10 px-5 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold text-[13px] flex items-center gap-2"><FileText size={16} /> Generate PDF Report</button>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-[1400px]">
          {/* Total Stats */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: "Total Students", value: totalStats.totalStudents, icon: Users, color: "bg-white" },
              { label: "Total Colleges", value: totalStats.totalColleges, icon: Building2, color: "bg-white" },
              { label: "Verified", value: totalStats.verifiedColleges, icon: CheckCircle2, color: "bg-emerald-50 border-emerald-200" },
              { label: "College Views", value: totalStats.totalCollegeViews, icon: Eye, color: "bg-[#1A3263] text-white" },
              { label: "Saves", value: totalStats.totalSaves, icon: Bookmark, color: "bg-white" },
              { label: "Enquiries", value: totalStats.totalEnquiries, icon: MessageCircle, color: "bg-[#FAB95B] text-[#1A3263] border-[#FAB95B]" },
            ].map((stat,i)=>(
              <div key={i} className={`rounded-[20px] border-2 p-5 ${stat.color} ${stat.color.includes('bg-white')?'border-[#E8E2DB]':''}`}>
                <div className="flex items-center justify-between">
                  <stat.icon size={20} className={stat.color.includes('bg-[#1A3263]')?'text-[#FAB95B]': stat.color.includes('bg-[#FAB95B]')?'text-[#1A3263]':'text-[#1A3263]'} />
                  <span className="text-[10px] font-bold uppercase opacity-60">{stat.label}</span>
                </div>
                <div className="font-display text-[28px] font-bold mt-3">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Charts - College Views, Course Interest, District-wise */}
          <div className="mt-8 grid lg:grid-cols-2 gap-6">
            <div className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6">
              <h3 className="font-bold text-[#1A3263] flex items-center gap-2"><BarChart3 size={18} className="text-[#FAB95B]" /> Platform Activity Overview</h3>
              <div className="mt-6 space-y-4">
                {[
                  { label: "College Views", value: totalStats.totalCollegeViews, max: Math.max(totalStats.totalCollegeViews, 10), color: "bg-[#1A3263]" },
                  { label: "Course Views", value: totalStats.totalCourseViews, max: Math.max(totalStats.totalCourseViews, 10), color: "bg-[#547792]" },
                  { label: "Saves", value: totalStats.totalSaves, max: Math.max(totalStats.totalSaves, 10), color: "bg-[#FAB95B]" },
                  { label: "Comparisons", value: totalStats.totalComparisons, max: Math.max(totalStats.totalComparisons, 10), color: "bg-[#E8E2DB] border" },
                  { label: "Enquiries", value: totalStats.totalEnquiries, max: Math.max(totalStats.totalEnquiries, 10), color: "bg-[#1A3263]" },
                ].map(item=>(
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-32 text-[12px] font-semibold text-[#1A3263]">{item.label}</div>
                    <div className="flex-1 h-8 rounded-full bg-[#E8E2DB] overflow-hidden border">
                      <div className={`h-full rounded-full flex items-center justify-end pr-3 text-[11px] font-bold text-white ${item.color}`} style={{ width: `${Math.min((item.value/item.max)*100, 100)}%`, minWidth: item.value>0?'40px':'0' }}>
                        {item.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] bg-[#1A3263] text-white p-6 border-2 border-[#1A3263]">
              <h3 className="font-bold text-[#FAB95B]">Popular Colleges & Courses - Real Time</h3>
              <div className="mt-6 space-y-3">
                {colleges.slice(0,4).map(c=>{
                  const agg = activityTracker.getAggregatedInterestForCollege(c.id)
                  return (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-[12px] bg-white/5 border border-white/10">
                      <img src={c.branding.heroImage} className="h-10 w-10 rounded-[10px] object-cover border border-[#FAB95B]/30" alt="Real" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[12px] truncate">{c.shortName}</div>
                        <div className="text-[11px] opacity-60">{agg.totalViews} views • {agg.totalStudentsViewed} students • {agg.enquiries} enquiries</div>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-[#FAB95B] animate-pulse" />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* College-wise Interest - Selected College */}
          <div className="mt-8 rounded-[24px] bg-white border-2 border-[#FAB95B]/30 p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex gap-5">
                <img src={selectedCollege.branding.heroImage} className="h-20 w-20 rounded-[16px] object-cover border-2 border-[#FAB95B]" alt="Real" />
                <div>
                  <h2 className="font-display text-[24px] font-bold text-[#1A3263]">{selectedCollege.name}</h2>
                  <div className="text-[13px] text-[#547792] mt-1">{selectedCollege.district} • {selectedCollege.type} • ID {selectedCollege.id} • {selectedCollege.accreditation}</div>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[11px] font-bold">Total Students Viewed: {aggregated.totalStudentsViewed}</span>
                    <span className="px-3 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold">Views: {aggregated.totalViews}</span>
                    <span className="px-3 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-bold">Enquiries: {aggregated.enquiries} (consent only)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleGeneratePDF} className="h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[13px] flex items-center gap-2"><Download size={16} /> Download PDF Report</button>
                <Link to={`/college/${selectedCollege.slug}`} className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[13px] grid place-items-center">View College</Link>
              </div>
            </div>

            <div className="mt-10 grid lg:grid-cols-3 gap-8">
              <div className="rounded-[20px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-6">
                <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><GraduationCap size={16} className="text-[#FAB95B]" /> Education Level Interest</h4>
                <div className="mt-4 space-y-3">
                  {Object.entries(aggregated.byEducation).length===0 ? (
                    <div className="text-[12px] text-[#547792] py-4">No data yet - students viewing will appear here. Example: 12th, Diploma, UG, PG distribution.</div>
                  ) : Object.entries(aggregated.byEducation).map(([level, count])=>(
                    <div key={level} className="flex items-center gap-3">
                      <div className="w-20 text-[12px] font-semibold">{level}</div>
                      <div className="flex-1 h-6 rounded-full bg-white border overflow-hidden">
                        <div className="h-full bg-[#1A3263] rounded-full flex items-center justify-end pr-2 text-[10px] text-white font-bold" style={{ width: `${Math.min(count*20, 100)}%` }}>{count}</div>
                      </div>
                    </div>
                  ))}
                  {Object.entries(aggregated.byEducation).length===0 && (
                    <>
                      <div className="flex items-center gap-3 opacity-40"><div className="w-20 text-[12px]">12th</div><div className="flex-1 h-6 rounded-full bg-white border"><div className="h-full w-[60%] bg-[#1A3263] rounded-full" /></div></div>
                      <div className="flex items-center gap-3 opacity-40"><div className="w-20 text-[12px]">Diploma</div><div className="flex-1 h-6 rounded-full bg-white border"><div className="h-full w-[30%] bg-[#547792] rounded-full" /></div></div>
                      <div className="flex items-center gap-3 opacity-40"><div className="w-20 text-[12px]">UG</div><div className="flex-1 h-6 rounded-full bg-white border"><div className="h-full w-[80%] bg-[#FAB95B] rounded-full" /></div></div>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-[20px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-6">
                <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><MapPin size={16} className="text-[#FAB95B]" /> District-wise Interest</h4>
                <div className="mt-4 space-y-3">
                  {Object.entries(aggregated.byDistrict).length===0 ? (
                    <div className="text-[12px] text-[#547792] py-4">Example: Coimbatore 450, Chennai 320, Madurai 180, Tiruppur 120, Salem 90 - District distribution of students viewing this college.</div>
                  ) : Object.entries(aggregated.byDistrict).map(([dist, count])=>(
                    <div key={dist} className="flex items-center gap-3">
                      <div className="w-24 text-[12px] font-semibold truncate">{dist}</div>
                      <div className="flex-1 h-6 rounded-full bg-white border overflow-hidden">
                        <div className="h-full bg-[#547792] rounded-full flex items-center justify-end pr-2 text-[10px] text-white font-bold" style={{ width: `${Math.min(count*15, 100)}%` }}>{count}</div>
                      </div>
                    </div>
                  ))}
                  {Object.entries(aggregated.byDistrict).length===0 && (
                    <>
                      <div className="flex items-center gap-3 opacity-40"><div className="w-24 text-[12px]">Coimbatore</div><div className="flex-1 h-6 rounded-full bg-white border"><div className="h-full w-[70%] bg-[#547792] rounded-full" /></div></div>
                      <div className="flex items-center gap-3 opacity-40"><div className="w-24 text-[12px]">Chennai</div><div className="flex-1 h-6 rounded-full bg-white border"><div className="h-full w-[50%] bg-[#547792] rounded-full" /></div></div>
                    </>
                  )}
                </div>
              </div>

              <div className="rounded-[20px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-6">
                <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><BookOpen size={16} className="text-[#FAB95B]" /> Course Interest</h4>
                <div className="mt-4 space-y-2">
                  {Object.entries(aggregated.byCourse).length===0 ? (
                    <div className="text-[12px] text-[#547792]">Example: Computer Science 320, Mechanical 180, ECE 150, Civil 90, BCA 120, MBA 80 - Course-wise interest for this college.</div>
                  ) : Object.entries(aggregated.byCourse).map(([course, count])=>(
                    <div key={course} className="flex items-center gap-2 p-2 rounded-[10px] bg-white border">
                      <div className="flex-1 text-[11px] font-medium truncate text-[#1A3263]">{course}</div>
                      <span className="px-2 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[10px] font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[16px] bg-[#1A3263] text-white p-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center shrink-0"><Award size={20} /></div>
                <div>
                  <div className="font-bold text-[#FAB95B]">College-wise Student Interest Report - PDF Generation</div>
                  <div className="text-[12px] text-[#E8E2DB]/80 mt-2 leading-[1.6]">Platform Admin can generate PDF report for each college: College Student Interest Report - College name, Report Period September 2026, Summary Total Students Viewed, Total Views, Saves, Comparisons, Enquiries, Student Interest by Education Level, District, Course, Date, Activity. Includes charts, tables, Platform Logo, College Logo, Report Period, Summary, Charts, Tables, Generated Date, Page Number. Buttons: View Report, Generate PDF, Download PDF. Privacy: Do NOT expose individual browsing to colleges, only aggregated. Example: PSG Tech - 1245 students viewed, 3850 views, 320 saved, 145 compared, 82 enquiries.</div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={handleGeneratePDF} className="h-10 px-5 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[12px] flex items-center gap-2"><FileText size={14} /> View Report</button>
                    <button onClick={handleGeneratePDF} className="h-10 px-5 rounded-full bg-white text-[#1A3263] font-bold text-[12px] flex items-center gap-2"><Download size={14} /> Generate & Download PDF</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Admin College Management */}
          <div className="mt-8 rounded-[24px] bg-white border-2 border-[#E8E2DB] p-6">
            <h3 className="font-bold text-[#1A3263]">Platform Admin College Management - Verification</h3>
            <div className="mt-4 flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 h-10 rounded-full bg-[#E8E2DB] border">
                <Search size={14} className="text-[#547792]" />
                <input placeholder="Search colleges - real" className="flex-1 bg-transparent outline-none text-[12px]" />
              </div>
              <button className="h-10 px-4 rounded-full bg-white border-2 border-[#E8E2DB] text-[12px] font-bold">Filter</button>
            </div>
            <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {colleges.map(c=>{
                const agg = activityTracker.getAggregatedInterestForCollege(c.id)
                return (
                  <div key={c.id} className="rounded-[16px] border-2 border-[#E8E2DB] p-4 flex gap-3">
                    <img src={c.branding.heroImage} className="h-12 w-12 rounded-[12px] object-cover border" alt="Real" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[12px] truncate text-[#1A3263]">{c.name}</div>
                      <div className="text-[11px] text-[#547792]">{c.district} • {c.type} • {agg.totalStudentsViewed} students viewed</div>
                      <div className="mt-2 flex gap-1">
                        <span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">Verified</span>
                        <span className="px-2 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[10px]">{agg.totalViews} views</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-6 rounded-[16px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/40 p-5">
            <div className="text-[12px] font-bold text-[#1A3263]">🔒 Privacy & Security - Core Rule</div>
            <div className="text-[11px] text-[#1A3263]/80 mt-2 leading-[1.6]">If student simply views college page, DO NOT automatically send personal info to college. College should NOT get student name, phone, email, browsing history. Platform stores activity securely. Only when student explicitly clicks ENQUIRE NOW and agrees to share, relevant info sent to college. College analytics shows aggregated only: This month 1245 students viewed your college - NOT Student John viewed 10 times unless enquiry with consent. Student data belongs to platform and must be protected. Implemented in activityTracker.js with personalInfoShared flag.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BookOpen({ size, className }) {
  return <span className={className} style={{ fontSize: size }}>📚</span>
}
