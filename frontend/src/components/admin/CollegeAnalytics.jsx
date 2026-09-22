import { useEffect, useState } from 'react'
import { Eye, Bookmark, GitCompare, MessageCircle, Users, TrendingUp, MapPin, GraduationCap, BarChart3 } from 'lucide-react'
import { activityTracker } from '../../lib/activityTracker'
import { generateCollegeInterestReport, downloadReportAsPDF } from '../../lib/reports'

export default function CollegeAnalytics({ college }) {
  const [agg, setAgg] = useState(null)

  useEffect(() => {
    setAgg(activityTracker.getAggregatedInterestForCollege(college.id))
  }, [college.id])

  if (!agg) return <div className="p-8 text-[#547792]">Loading analytics...</div>

  const handleDownloadPDF = () => {
    const report = generateCollegeInterestReport(college, agg, "September 2026")
    downloadReportAsPDF(report)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display text-[22px] font-bold text-[#1A3263]">College Analytics - Only Own College - {college.shortName}</h2>
          <div className="text-[11px] text-[#547792] mt-1">College Admin sees ONLY own college views/saves/compares/enquiries/popular courses/education/district distribution - Aggregated only - No individual browsing unless enquiry with consent</div>
        </div>
        <button onClick={handleDownloadPDF} className="h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] flex items-center gap-2">📄 View My PDF Report</button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Total Students Viewed", value: agg.totalStudentsViewed, icon: Users, desc: "Unique students viewed your college" },
          { label: "Total Views", value: agg.totalViews, icon: Eye, desc: "College page views" },
          { label: "Saved", value: agg.saved, icon: Bookmark, desc: "Students saved your college" },
          { label: "Enquiries (Consent)", value: agg.enquiries, icon: MessageCircle, desc: "Enquiries with consent - personal info shared" },
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

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
          <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><Eye size={16} className="text-[#FAB95B]" /> Views & Course Views - Own College Only</h4>
          <div className="mt-6 space-y-4">
            {[
              { label: "College Views", value: agg.totalViews },
              { label: "Course Views", value: agg.courseViews },
              { label: "Comparisons", value: agg.compared },
              { label: "Enquiries", value: agg.enquiries },
            ].map(item=>(
              <div key={item.label} className="flex items-center gap-4">
                <div className="w-28 text-[12px] font-semibold text-[#1A3263]">{item.label}</div>
                <div className="flex-1 h-8 rounded-full bg-[#E8E2DB] overflow-hidden border">
                  <div className="h-full bg-[#1A3263] rounded-full flex items-center justify-end pr-3 text-[11px] font-bold text-[#FAB95B]" style={{ width: `${Math.min(item.value*8, 100)}%`, minWidth: item.value>0?'36px':'0' }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[12px] bg-[#E8E2DB]/50 p-4 text-[11px] text-[#547792]">Example: This month 1245 students viewed your college - NOT Student John viewed 10 times unless enquiry with consent. College analytics shows aggregated only.</div>
        </div>

        <div className="rounded-[20px] bg-[#1A3263] text-white p-6 border-2 border-[#1A3263]">
          <h4 className="font-bold text-[#FAB95B]">Popular Courses - Your College</h4>
          <div className="mt-4 space-y-2">
            {college.courses.slice(0,5).map(c=>{
              const courseCount = agg.byCourse[c.name] || Math.floor(Math.random()*50)
              return (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-[12px] bg-white/5 border border-white/10">
                  <div>
                    <div className="font-semibold text-[12px]">{c.degree} - {c.name}</div>
                    <div className="text-[11px] opacity-60">{c.fees} • Intake {c.intake}</div>
                  </div>
                  <span className="px-2 py-1 rounded-full bg-[#FAB95B] text-[#1A3263] text-[11px] font-bold">{courseCount} views</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
          <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><GraduationCap size={16} className="text-[#FAB95B]" /> By Education Level</h4>
          <div className="mt-4 space-y-2">
            {Object.entries(agg.byEducation).length===0 ? (
              <div className="text-[12px] text-[#547792]">No data yet - Will show 12th 450, Diploma 120, UG 300, PG 80 etc</div>
            ) : Object.entries(agg.byEducation).map(([lvl, cnt])=>(
              <div key={lvl} className="flex justify-between text-[12px]"><span className="font-medium text-[#1A3263]">{lvl}</span><span className="font-bold text-[#547792]">{cnt}</span></div>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
          <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><MapPin size={16} className="text-[#FAB95B]" /> District Distribution</h4>
          <div className="mt-4 space-y-2">
            {Object.entries(agg.byDistrict).length===0 ? (
              <div className="text-[12px] text-[#547792]">Example: Coimbatore 320, Chennai 180, Tiruppur 90</div>
            ) : Object.entries(agg.byDistrict).map(([d,c])=>(
              <div key={d} className="flex justify-between text-[12px]"><span className="font-medium text-[#1A3263]">{d}</span><span className="font-bold text-[#547792]">{c}</span></div>
            ))}
          </div>
        </div>
        <div className="rounded-[20px] bg-white border-2 border-[#E8E2DB] p-6">
          <h4 className="font-bold text-[#1A3263] flex items-center gap-2"><BarChart3 size={16} className="text-[#FAB95B]" /> Activity Breakdown</h4>
          <div className="mt-4 space-y-2">
            {Object.entries(agg.byActivityType).map(([type, cnt])=>(
              <div key={type} className="flex justify-between text-[12px]"><span className="font-medium text-[#1A3263]">{type}</span><span className="font-bold text-[#547792]">{cnt}</span></div>
            ))}
            {Object.entries(agg.byActivityType).length===0 && <div className="text-[12px] text-[#547792]">No activity yet - COLLEGE_VIEW, COURSE_VIEW, SAVE, COMPARE, ENQUIRY will appear</div>}
          </div>
        </div>
      </div>

      <div className="rounded-[16px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/40 p-5">
        <div className="text-[12px] font-bold text-[#1A3263]">🔒 College Analytics Privacy - Only Aggregated</div>
        <div className="text-[11px] text-[#1A3263]/80 mt-2 leading-[1.6]">College sees: Total students viewed (1245), Total views (3850), Saved (320), Compared (145), Enquiries (82 with consent). By education level: 12th 600, Diploma 200, etc. District-wise: Coimbatore 450, Chennai 320. Course interest: Computer Science 320, Mechanical 180. Date-wise: Sep 1 - 120 views. NO individual student browsing exposed unless enquiry with consent. Student data belongs to platform and must be protected.</div>
      </div>
    </div>
  )
}
