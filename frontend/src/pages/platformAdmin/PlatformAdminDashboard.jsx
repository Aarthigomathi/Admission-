import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPublicColleges, getAllCollegesMerged } from '../../lib/collegeStorage'
import { activityTracker } from '../../lib/activityTracker'
import { generateCollegeInterestReport, downloadReportAsPDF } from '../../lib/reports'
import { Users, Building2, Eye, Bookmark, GitCompare, MessageCircle, FileText, Download, Award, MapPin, Search, Mail, Phone, Home } from 'lucide-react'

export default function PlatformAdminDashboard() {
  const [colleges, setColleges] = useState([])
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [activities, setActivities] = useState([])
  const [students, setStudents] = useState([])
  const [allVisitors, setAllVisitors] = useState([])
  const [searchVisitor, setSearchVisitor] = useState('')

  useEffect(() => {
    const publicCols = getPublicColleges()
    setColleges(publicCols)
    if (publicCols.length>0) setSelectedCollege(publicCols[0])
    setActivities(activityTracker.getAllActivities())
    setStudents(JSON.parse(localStorage.getItem('tn_students') || '[]'))
    setAllVisitors(activityTracker.getAllDetailedVisitors())
    if (activityTracker.getAllActivities().length === 0) {
      activityTracker.seedDemoVisitors()
      setTimeout(() => {
        setActivities(activityTracker.getAllActivities())
        setAllVisitors(activityTracker.getAllDetailedVisitors())
      }, 500)
    }
    const handle = () => {
      const pc = getPublicColleges()
      setColleges(pc)
      if (pc.length>0 && !selectedCollege) setSelectedCollege(pc[0])
    }
    window.addEventListener('collegeRegistered', handle)
    window.addEventListener('storage', handle)
    return () => {
      window.removeEventListener('collegeRegistered', handle)
      window.removeEventListener('storage', handle)
    }
  }, [])

  const aggregated = selectedCollege ? activityTracker.getAggregatedInterestForCollege(selectedCollege.id) : { totalStudentsViewed:0, totalViews:0, detailedVisitors: [] }
  const allActivities = activityTracker.getAllActivities()
  const detailedVisitorsForSelected = selectedCollege ? activityTracker.getDetailedVisitorsForCollege(selectedCollege.id) : []

  const totalStats = {
    totalStudents: students.length,
    totalColleges: colleges.length,
    verifiedColleges: colleges.filter(c=>c.verified || c.verificationStatus==='VERIFIED').length,
    pendingColleges: colleges.filter(c=>c.verificationStatus==='PENDING').length,
    totalCollegeViews: allActivities.filter(a=>a.activity_type==='COLLEGE_VIEW').length,
    totalCourseViews: allActivities.filter(a=>a.activity_type==='COURSE_VIEW').length,
    totalSaves: allActivities.filter(a=>a.activity_type==='SAVE').length,
    totalComparisons: allActivities.filter(a=>a.activity_type==='COMPARE').length,
    totalEnquiries: allActivities.filter(a=>a.activity_type==='ENQUIRY').length,
  }

  const handleGeneratePDF = () => {
    if (!selectedCollege) return
    const report = generateCollegeInterestReport(selectedCollege, aggregated, new Date().toLocaleDateString())
    downloadReportAsPDF(report)
  }

  const handleDownloadAllVisitorsCSV = () => {
    activityTracker.downloadVisitorsAsCSV(null, 'all_colleges')
  }

  const handleDownloadCollegeVisitorsCSV = () => {
    if (!selectedCollege) return
    activityTracker.downloadVisitorsAsCSV(selectedCollege.id, selectedCollege.shortName)
  }

  const filteredAllVisitors = allVisitors.filter(v => {
    if (!searchVisitor) return true
    const s = searchVisitor.toLowerCase()
    return v.student_name?.toLowerCase().includes(s) || v.student_email?.toLowerCase().includes(s) || v.student_district?.toLowerCase().includes(s) || v.college_name?.toLowerCase().includes(s)
  })

  if (colleges.length===0) {
    return (
      <div className="min-h-screen bg-[#E8E2DB] flex">
        <aside className="hidden lg:flex w-[300px] bg-[#1A3263] text-white flex-col sticky top-0 h-screen border-r-4 border-[#FAB95B]">
          <div className="h-[72px] px-6 flex items-center gap-3 border-b border-white/10">
            <div className="h-10 w-10 rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold">P</div>
            <div><div className="font-bold text-[13px]">Platform Admin</div><div className="text-[11px] text-[#FAB95B]">No Default Colleges</div></div>
          </div>
          <div className="p-6">
            <div className="text-[11px] text-white/60">No colleges registered yet - Colleges need to signup via /college/signup and add details themselves. No default PSG.</div>
            <Link to="/college/signup" className="mt-4 flex h-10 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[12px] items-center justify-center">College Sign Up</Link>
            <Link to="/" className="mt-2 flex h-10 rounded-full bg-white/10 border border-white/20 items-center justify-center text-[12px]">Back to Platform</Link>
          </div>
        </aside>
        <div className="flex-1 grid place-items-center p-12">
          <div className="rounded-[28px] bg-white border-2 border-[#FAB95B]/30 p-12 text-center max-w-[600px]">
            <div className="h-16 w-16 rounded-[20px] bg-[#E8E2DB] grid place-items-center mx-auto text-2xl">🏛️</div>
            <h2 className="font-display text-[24px] font-bold text-[#1A3263] mt-6">No Colleges Registered Yet - No Default Colleges</h2>
            <p className="text-[13px] text-[#547792] mt-3 leading-[1.6]">Automatic default college name kattama - Platform la default PSG illa. College signup panni avunga college details - logo, campus images, environment, placement, facilities, exam details, departments with HOD, courses - ellam avangale add pannuvanga. Aprom thaan admin la varum.</p>
            <div className="mt-6 flex justify-center gap-2">
              <Link to="/college/signup" className="h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] inline-flex items-center gap-2"><Building2 size={14} /> College Sign Up</Link>
              <Link to="/" className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[12px] inline-flex items-center gap-2">Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E8E2DB] flex">
      <aside className="hidden lg:flex w-[300px] bg-[#1A3263] text-white flex-col sticky top-0 h-screen border-r-4 border-[#FAB95B]">
        <div className="h-[72px] px-6 flex items-center gap-3 border-b border-white/10">
          <div className="h-10 w-10 rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold">P</div>
          <div><div className="font-bold text-[13px]">Platform Admin</div><div className="text-[11px] text-[#FAB95B]">{colleges.length} Colleges Added Themselves</div></div>
        </div>
        <div className="p-4 flex-1 overflow-auto space-y-3">
          <div className="rounded-[12px] bg-white/5 border border-white/10 p-4">
            <div className="text-[11px] uppercase font-bold text-[#FAB95B]">Overview - Only Registered Colleges</div>
            <div className="mt-3 space-y-2 text-[12px]">
              <div className="flex justify-between"><span className="opacity-70">Students</span><span className="font-bold">{totalStats.totalStudents}</span></div>
              <div className="flex justify-between"><span className="opacity-70">Colleges</span><span className="font-bold">{totalStats.totalColleges}</span></div>
              <div className="flex justify-between"><span className="opacity-70">Pending</span><span className="font-bold text-amber-300">{totalStats.pendingColleges}</span></div>
              <div className="flex justify-between"><span className="opacity-70">Verified</span><span className="font-bold text-emerald-300">{totalStats.verifiedColleges}</span></div>
            </div>
            <button onClick={handleDownloadAllVisitorsCSV} className="mt-4 w-full h-9 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[11px] flex items-center justify-center gap-1"><Download size={12} /> Download All Visitors CSV</button>
          </div>
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase opacity-40 px-3">Colleges Added Themselves</div>
            <div className="mt-3 space-y-1 max-h-[400px] overflow-auto pr-1">
              {colleges.map(c=>{
                const agg = activityTracker.getAggregatedInterestForCollege(c.id)
                return (
                  <button key={c.id} onClick={()=>setSelectedCollege(c)} className={`w-full text-left p-3 rounded-[12px] border text-[12px] transition-all ${selectedCollege?.id===c.id?'bg-[#FAB95B] text-[#1A3263] border-[#FAB95B] font-bold':'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <div className="font-semibold truncate">{c.name} - ID {c.id}</div>
                    <div className="text-[11px] opacity-70 truncate">{c.district} • {agg.totalStudentsViewed} visitors • {agg.totalViews} views</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link to="/" className="flex h-10 rounded-full bg-white/10 border border-white/20 items-center justify-center text-[12px] font-semibold">← Back to Platform</Link>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-20 h-[72px] bg-white border-b-2 border-[#FAB95B]/30 px-6 lg:px-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-[18px] font-bold text-[#1A3263]">Platform Admin - Only Colleges That Signed Up Themselves - {colleges.length} Colleges</h1>
            <div className="text-[11px] text-[#547792]">No default PSG - Only colleges that signup via /college/signup and add details A-Z themselves appear - Automatic default college name kattama</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleGeneratePDF} className="h-10 px-5 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold text-[12px] flex items-center gap-2"><FileText size={16} /> PDF Report - {selectedCollege?.shortName}</button>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-[1600px]">
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { label: "Total Students", value: totalStats.totalStudents, icon: Users, color: "bg-white" },
              { label: "Total Colleges", value: totalStats.totalColleges, icon: Building2, color: "bg-white" },
              { label: "College Views", value: totalStats.totalCollegeViews, icon: Eye, color: "bg-[#1A3263] text-white" },
              { label: "Saves", value: totalStats.totalSaves, icon: Bookmark, color: "bg-white" },
              { label: "Enquiries", value: totalStats.totalEnquiries, icon: MessageCircle, color: "bg-[#FAB95B] text-[#1A3263] border-[#FAB95B]" },
            ].map((stat,i)=>(
              <div key={i} className={`rounded-[20px] border-2 p-4 ${stat.color} ${stat.color.includes('bg-white')?'border-[#E8E2DB]':''}`}>
                <div className="flex items-center justify-between">
                  <stat.icon size={18} />
                  <span className="text-[10px] font-bold uppercase opacity-60">{stat.label}</span>
                </div>
                <div className="font-display text-[24px] font-bold mt-2">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[24px] bg-white border-2 border-[#FAB95B]/30 p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="font-bold text-[18px] text-[#1A3263] flex items-center gap-2"><Users size={20} className="text-[#FAB95B]" /> All Visitors - {filteredAllVisitors.length} Logs - Only Registered Colleges</h3>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-4 h-10 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB]">
                  <Search size={14} className="text-[#547792]" />
                  <input value={searchVisitor} onChange={e=>setSearchVisitor(e.target.value)} placeholder="Search name, email, college..." className="bg-transparent outline-none text-[12px] w-[220px]" />
                </div>
                <button onClick={handleDownloadAllVisitorsCSV} className="h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1.5"><Download size={14} /> CSV</button>
              </div>
            </div>
            <div className="mt-6 overflow-auto rounded-[16px] border-2 border-[#E8E2DB] max-h-[500px]">
              <table className="w-full text-left min-w-[1000px]">
                <thead className="sticky top-0 bg-[#1A3263] text-white z-10">
                  <tr>
                    <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">Student</th>
                    <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">Contact</th>
                    <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">Location</th>
                    <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">Course Interest</th>
                    <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">College Visited</th>
                    <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">Activity</th>
                  </tr>
                </thead>
                <tbody className="text-[11px]">
                  {filteredAllVisitors.slice(0,100).map((v, idx)=>(
                    <tr key={idx} className="border-b border-[#E8E2DB] hover:bg-[#E8E2DB]/20">
                      <td className="p-3"><div className="font-bold text-[#1A3263]">{v.student_name}</div><div className="text-[10px] text-[#547792]">ID {v.student_id}</div></td>
                      <td className="p-3"><div className="flex items-center gap-1"><Mail size={10} /> {v.student_email}</div><div className="flex items-center gap-1 mt-1"><Phone size={10} /> {v.student_mobile}</div></td>
                      <td className="p-3"><div className="flex items-center gap-1"><MapPin size={10} className="text-[#FAB95B]" /> {v.student_district} • {v.student_city}</div><div className="text-[10px] text-[#547792]">{v.student_address}</div></td>
                      <td className="p-3"><div className="px-2 py-0.5 rounded-full bg-[#E8E2DB] inline-flex">{v.student_interestedCourse}</div></td>
                      <td className="p-3"><div className="font-bold text-[#1A3263]">{v.college_name}</div><div className="text-[10px] text-[#547792]">ID {v.college_id}</div></td>
                      <td className="p-3"><span className="px-2 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px] font-bold">{v.activity_type}</span><div className="text-[10px] text-[#547792] mt-1">{v.date} {v.time}</div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedCollege && (
            <div className="mt-8 rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div className="flex gap-4">
                  <img src={selectedCollege.branding?.logo || `https://ui-avatars.com/api/?name=${selectedCollege.name}&background=1A3263&color=FAB95B`} className="h-16 w-16 rounded-[14px] object-cover border-2 border-[#FAB95B]" alt="College" />
                  <div>
                    <h2 className="font-display text-[20px] font-bold text-[#1A3263]">{selectedCollege.name} - {detailedVisitorsForSelected.length} Visitors</h2>
                    <div className="text-[12px] text-[#547792] mt-1">{selectedCollege.district} • {selectedCollege.city} • {selectedCollege.type} • {selectedCollege.verificationStatus}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleDownloadCollegeVisitorsCSV} className="h-10 px-5 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[11px] flex items-center gap-1.5"><Download size={14} /> CSV</button>
                  <button onClick={handleGeneratePDF} className="h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1.5"><Download size={14} /> PDF Report</button>
                </div>
              </div>
              <div className="mt-6 text-[12px] text-[#547792]">College added by college itself via signup - ID {selectedCollege.id} - Departments {(getPublicColleges().find(c=>c.id===selectedCollege.id)?.departments||[]).length}, Courses {(getPublicColleges().find(c=>c.id===selectedCollege.id)?.courses||[]).length} - Added A-Z themselves - UI frame ours, content theirs</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
