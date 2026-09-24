import { useEffect, useState } from 'react'
import { Eye, Bookmark, GitCompare, MessageCircle, Users, MapPin, GraduationCap, BarChart3, Download, FileText, Mail, Phone, Home, Search, Filter } from 'lucide-react'
import { activityTracker } from '../../lib/activityTracker'
import { generateCollegeInterestReport, downloadReportAsPDF } from '../../lib/reports'

export default function CollegeAnalytics({ college }) {
  const [agg, setAgg] = useState(null)
  const [visitors, setVisitors] = useState([])
  const [search, setSearch] = useState('')
  const [filterActivity, setFilterActivity] = useState('All')

  useEffect(() => {
    const data = activityTracker.getAggregatedInterestForCollege(college.id)
    setAgg(data)
    setVisitors(data.detailedVisitors || [])
  }, [college.id])

  const handleDownloadPDF = () => {
    const report = generateCollegeInterestReport(college, agg, "September 2026")
    downloadReportAsPDF(report)
  }

  const handleDownloadCSV = () => {
    activityTracker.downloadVisitorsAsCSV(college.id, college.shortName || college.name)
  }

  const handleDownloadDetailedPDF = () => {
    const visitorsList = filteredVisitors
    const html = `
      <html>
      <head><title>Visitors Report - ${college.name}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; background: #f8f9fa; color: #1A3263; }
        .header { background: #1A3263; color: #FAB95B; padding: 20px; border-radius: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; background: white; border-radius: 12px; overflow: hidden; }
        th { background: #1A3263; color: #FAB95B; padding: 12px; text-align: left; font-size: 11px; }
        td { padding: 10px; border-bottom: 1px solid #E8E2DB; font-size: 11px; }
        .badge { background: #FAB95B; color: #1A3263; padding: 2px 8px; border-radius: 20px; font-weight: bold; font-size: 10px; }
      </style>
      </head>
      <body>
        <div class="header">
          <h1>${college.name} - Visitor Report</h1>
          <p>College ID: ${college.id} • District: ${college.district} • Total Visitors: ${visitors.length} • Generated: ${new Date().toLocaleString()}</p>
        </div>
        <table>
          <tr><th>College ID</th><th>College Name</th><th>Student Name</th><th>Email</th><th>Mobile</th><th>District/City</th><th>Education</th><th>Interested Course</th><th>Visits</th><th>Last Visit</th><th>Activity</th></tr>
          ${visitorsList.map(v=>`<tr><td><span class="badge">ID ${v.college_id || college.id}</span></td><td><strong>${v.college_name || college.name}</strong></td><td><strong>${v.student_name}</strong><br>ID ${v.student_id}</td><td>${v.student_email}</td><td>${v.student_mobile}</td><td>${v.student_district}, ${v.student_city}<br><small>${v.student_address}</small></td><td>${v.student_educationLevel} - ${v.student_percentage}</td><td>${v.student_interestedCourse}</td><td><span class="badge">${v.total_visits} visits</span><br>${v.college_views} views, ${v.saves} saves, ${v.enquiries} enq</td><td>${v.last_visit_date} ${v.last_visit_time}</td><td>${v.last_activity}</td></tr>`).join('')}
        </table>
        <div style="margin-top:20px; padding:15px; background:white; border-radius:12px; border:2px solid #E8E2DB;">
          <strong>Summary:</strong> Total Visitors ${visitors.length} • Total Views ${agg?.totalViews} • Saves ${agg?.saved} • Enquiries ${agg?.enquiries} • College ID ${college.id}
        </div>
      </body>
      </html>
    `
    const win = window.open('', '_blank')
    win.document.write(html)
    win.document.close()
    win.print()
  }

  if (!agg) return <div className="p-8 text-[#547792]">Loading analytics - Your own college visitors...</div>

  const filteredVisitors = visitors.filter(v => {
    const matchSearch = !search || 
      v.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      v.student_email?.toLowerCase().includes(search.toLowerCase()) ||
      v.student_district?.toLowerCase().includes(search.toLowerCase()) ||
      v.student_city?.toLowerCase().includes(search.toLowerCase()) ||
      v.student_interestedCourse?.toLowerCase().includes(search.toLowerCase())
    const matchActivity = filterActivity === 'All' || v.last_activity === filterActivity
    return matchSearch && matchActivity
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-[22px] font-bold text-[#1A3263]">College Analytics - {college.name} - Analytics</h2>
          <div className="text-[11px] text-[#547792] mt-1">Detailed visitor analytics for your college - Secure and privacy protected</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleDownloadCSV} className="h-10 px-4 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[11px] flex items-center gap-1.5 border-2 border-[#FAB95B]"><Download size={14} /> Download CSV</button>
          <button onClick={handleDownloadDetailedPDF} className="h-10 px-4 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[11px] flex items-center gap-1.5"><FileText size={14} /> Download PDF</button>
          <button onClick={handleDownloadPDF} className="h-10 px-4 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[11px] flex items-center gap-1.5"> PDF Report</button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Total Visitors - Your College", value: agg.totalStudentsViewed, icon: Users, desc: "Unique students visited your college - Name Mail Address you can see" },
          { label: "Total Views - Your College", value: agg.totalViews, icon: Eye, desc: "College page views - Your own" },
          { label: "Saved - Your College", value: agg.saved, icon: Bookmark, desc: "Students saved your college - Details available" },
          { label: "Enquiries - Your College", value: agg.enquiries, icon: MessageCircle, desc: "Enquiries with consent - Full details" },
        ].map(stat=>(
          <div key={stat.label} className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-5">
            <div className="flex items-center justify-between">
              <stat.icon size={18} className="text-[#1A3263]" />
              <span className="text-[10px] font-bold uppercase text-[#547792]">{stat.label}</span>
            </div>
            <div className="font-display text-[28px] font-bold text-[#1A3263] mt-3">{stat.value}</div>
            <div className="text-[11px] text-[#547792] mt-1">{stat.desc}</div>
          </div>
        ))}
      </div>

      {/* Visitor Details Table - Name Mail Address */}
      <div className="rounded-[24px] bg-white border-2 border-[#FAB95B]/30 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-[18px] text-[#1A3263] flex items-center gap-2"><Users size={20} className="text-[#FAB95B]" /> Who Visited Your College List - Name, Email, Mobile, District, City, Address, Education, Course - Your Own College Visitors (Not PSG) - {filteredVisitors.length} Visitors</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-4 h-10 rounded-full bg-[#E8E2DB] border-2 border-[#E8E2DB]">
              <Search size={14} className="text-[#547792]" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, district, course..." className="bg-transparent outline-none text-[12px] w-[200px]" />
            </div>
            <select value={filterActivity} onChange={e=>setFilterActivity(e.target.value)} className="h-10 px-4 rounded-full bg-white border-2 border-[#E8E2DB] text-[11px] font-bold">
              <option value="All">All Activities</option>
              <option value="COLLEGE_VIEW">College Views</option>
              <option value="COURSE_VIEW">Course Views</option>
              <option value="SAVE">Saves</option>
              <option value="COMPARE">Compares</option>
              <option value="ENQUIRY">Enquiries</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-auto rounded-[16px] border-2 border-[#E8E2DB]">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="bg-[#1A3263] text-white">
                <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">College ID & Name</th>
                <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">Student Name</th>
                <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">Email & Mobile</th>
                <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">District / City / Address</th>
                <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">Education & Course Interest</th>
                <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">Visits - Your College</th>
                <th className="p-3 text-[11px] font-bold uppercase text-[#FAB95B]">Last Visit & Download</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              {filteredVisitors.length===0 ? (
                <tr><td colSpan={7} className="p-12 text-center">
                                    <div className="font-bold text-[#1A3263] mt-3">No visitors yet</div>
                  <div className="text-[11px] text-[#547792] mt-2">When students visit your college, their details will appear here</div>
                </td></tr>
              ) : filteredVisitors.map(visitor=>(
                <tr key={visitor.student_id} className="border-b border-[#E8E2DB] hover:bg-[#E8E2DB]/20 transition-colors">
                  <td className="p-3">
                    <div className="px-2 py-1 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px] font-bold inline-flex">ID: {visitor.college_id || college.id}</div>
                    <div className="font-bold text-[#1A3263] text-[12px] mt-2">{visitor.college_name || college.name}</div>
                    <div className="text-[10px] text-[#547792] mt-1"></div>
                    <div className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAB95B]/20 text-[#1A3263] font-bold inline-flex mt-2"></div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-[#1A3263]">{visitor.student_name}</div>
                    <div className="text-[11px] text-[#547792]">Student ID {visitor.student_id} • {visitor.student_schoolCollege}</div>
                    <div className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAB95B]/20 text-[#1A3263] font-bold inline-flex mt-1">{visitor.total_visits} visits your college</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-[11px]"><Mail size={12} className="text-[#547792]" /> {visitor.student_email}</div>
                    <div className="flex items-center gap-1 text-[11px] mt-1"><Phone size={12} className="text-[#547792]" /> {visitor.student_mobile}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 font-medium text-[#1A3263] text-[11px]"><MapPin size={12} className="text-[#FAB95B]" /> {visitor.student_district} • {visitor.student_city}</div>
                    <div className="text-[10px] text-[#547792] mt-1">{visitor.student_address}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-[#1A3263] text-[11px]">{visitor.student_educationLevel} - {visitor.student_percentage}</div>
                    <div className="mt-1 px-2 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[10px] font-bold inline-flex">{visitor.student_interestedCourse}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[9px] font-bold">{visitor.college_views} views</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#FAB95B]/20 text-[#1A3263] text-[9px]">{visitor.saves} saves</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[11px] font-medium text-[#1A3263]">{visitor.last_visit_date}</div>
                    <div className="text-[10px] text-[#547792]">{visitor.last_visit_time} • {visitor.last_activity}</div>
                    <div className="mt-2 flex gap-1">
                      <button onClick={()=>activityTracker.downloadVisitorsAsCSV(college.id, college.shortName)} className="h-7 px-2 rounded-full bg-[#FAB95B] text-[#1A3263] text-[9px] font-bold flex items-center gap-1"><Download size={10} /> CSV College ID Name</button>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="text-[10px] text-[#547792]">{visitor.total_visits} activities</div>
                    <div className="text-[10px] font-bold text-[#1A3263] mt-1"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={handleDownloadCSV} className="h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center gap-2"><Download size={16} /> Download All Visitors CSV</button>
          <button onClick={handleDownloadDetailedPDF} className="h-11 px-6 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold text-[12px] flex items-center gap-2"><FileText size={16} /> Download PDF Visitor Report - Your College ID {college.id}</button>
        </div>

        <div className="mt-6 rounded-[12px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-4">
          <div className="text-[11px] font-bold text-[#1A3263]">Yar Yaru Entha College Visit Pananga - Admin Pakkura Mathiri & Download - Your College</div>
          <div className="text-[11px] text-[#1A3263]/80 mt-2 leading-[1.5]">College Admin can see who visited your college with detailed information. Download as CSV and PDF for records. Secure college data isolation - only your college visitors are shown.</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
          <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><GraduationCap size={16} className="text-[#FAB95B]" /> By Education Level - Your Visitors</h4>
          <div className="mt-4 space-y-2">
            {Object.entries(agg.byEducation).map(([lvl, cnt])=>(
              <div key={lvl} className="flex justify-between text-[12px]"><span className="font-medium text-[#1A3263]">{lvl}</span><span className="font-bold text-[#547792]">{cnt}</span></div>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
          <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><MapPin size={16} className="text-[#FAB95B]" /> District - Your Visitors</h4>
          <div className="mt-4 space-y-2">
            {Object.entries(agg.byDistrict).map(([d,c])=>(
              <div key={d} className="flex justify-between text-[12px]"><span className="font-medium text-[#1A3263]">{d}</span><span className="font-bold text-[#547792]">{c}</span></div>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
          <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><BarChart3 size={16} className="text-[#FAB95B]" /> Activity - Your Visitors</h4>
          <div className="mt-4 space-y-2">
            {Object.entries(agg.byActivityType).map(([type, cnt])=>(
              <div key={type} className="flex justify-between text-[12px]"><span className="font-medium text-[#1A3263]">{type}</span><span className="font-bold text-[#547792]">{cnt}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
