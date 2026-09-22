import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Sparkles, GraduationCap, Users, Building2, ArrowUpRight, Star, SlidersHorizontal, Image as ImageIcon, Shield, FileText, BarChart3, Bookmark, GitCompare, MessageCircle } from 'lucide-react'
import CollegeCard from '../../components/platform/CollegeCard'
import { colleges as staticColleges } from '../../lib/colleges'
import { getAllCollegesMerged } from '../../lib/collegeStorage'

export default function PlatformHome() {
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('All')
  const [type, setType] = useState('All')
  const [colleges, setColleges] = useState(staticColleges)

  useEffect(() => {
    setColleges(getAllCollegesMerged())
  }, [])

  const filtered = colleges.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.courses.some(co=>co.name.toLowerCase().includes(search.toLowerCase()))
    const matchDist = district==='All' || c.district===district
    const matchType = type==='All' || c.type.toLowerCase().includes(type.toLowerCase())
    return matchSearch && matchDist && matchType
  })

  return (
    <div className="min-h-screen bg-[#E8E2DB]">
      <div className="relative overflow-hidden border-b-2 border-[#FAB95B]/30 bg-[#E8E2DB]">
        <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_-20%,#ffffff_0%,#E8E2DB_60%)]" />
        <div className="absolute top-20 right-[10%] h-[400px] w-[400px] rounded-full bg-[#FAB95B]/30 blur-[80px]" />
        <div className="absolute top-40 left-[5%] h-[300px] w-[300px] rounded-full bg-[#547792]/20 blur-[60px]" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1A3263] via-[#547792] to-[#FAB95B]" />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 pt-14 pb-16">
          <div className="max-w-[900px]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A3263] border-2 border-[#FAB95B] shadow-sm text-[11px] font-bold tracking-wide text-[#FAB95B]">
              <span className="h-2 w-2 rounded-full bg-[#FAB95B] animate-pulse" />
              Premium • Secure • Three Roles STUDENT/COLLEGE/PLATFORM_ADMIN • Activity Tracking • PDF Reports • #E8E2DB #FAB95B #547792 #1A3263
            </div>

            <h1 className="font-display text-[48px] lg:text-[84px] font-[700] leading-[0.9] tracking-[-0.03em] mt-8 text-[#1A3263] text-balance">
              Tamil Nadu's
              <span className="font-serif italic font-[400] tracking-tight text-[#547792]"> most trusted </span>
              college discovery platform.
            </h1>
            <p className="mt-6 text-[18px] lg:text-[20px] leading-[1.5] text-[#1A3263]/70 max-w-[700px]">
              Centralized discovery across all districts. Students <span className="font-bold text-[#1A3263]">SIGN UP & discover</span>, Colleges <span className="font-bold text-[#1A3263]">SIGN UP & add/manage own info</span>, Platform <span className="font-bold text-[#1A3263]">securely collects activity & generates college-wise PDF reports</span>. Premium SaaS feel.
            </p>

            <div className="mt-10 rounded-[28px] bg-white border-2 border-[#FAB95B]/30 shadow-[0_12px_40px_rgba(26,50,99,0.12)] p-2 flex flex-col lg:flex-row gap-2 max-w-[840px]">
              <div className="flex-1 flex items-center gap-3 px-5 h-[56px] rounded-[20px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus-within:bg-white focus-within:border-[#1A3263] transition-colors">
                <Search size={20} className="text-[#547792] shrink-0" />
                <input 
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                  placeholder="Search name/course/dept/district/city/university/type..." 
                  className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-[#547792]/60 font-medium text-[#1A3263]"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-4 h-[56px] rounded-[20px] bg-[#E8E2DB] border-2 border-[#E8E2DB]">
                  <MapPin size={16} className="text-[#547792]" />
                  <select value={district} onChange={e=>setDistrict(e.target.value)} className="bg-transparent outline-none text-[13px] font-bold text-[#1A3263]">
                    <option value="All">All Districts - TN</option>
                    <option>Coimbatore</option>
                    <option>Chennai</option>
                    <option>Madurai</option>
                  </select>
                </div>
                <Link to={`/search?q=${search}`} className="h-[56px] px-8 grid place-items-center rounded-[20px] bg-[#1A3263] text-[#FAB95B] border-2 border-[#1A3263] text-[14px] font-bold tracking-wide hover:bg-[#1A3263]/90 transition-colors shrink-0 shadow-lg">
                  Search Real
                </Link>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#547792]">Popular - Real:</span>
              {["B.E CSE", "BCA", "MBA", "B.Com", "Mechanical", "ECE"].map(tag=>(
                <button key={tag} onClick={()=>setSearch(tag)} className="px-4 h-8 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] text-[13px] font-bold hover:border-[#FAB95B] hover:bg-[#FAB95B] hover:text-[#1A3263] transition-colors">
                  {tag}
                </button>
              ))}
              <span className="ml-2 text-[12px] font-bold text-[#1A3263]">{filtered.length} colleges • Real images from psgtech.edu</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/student/signup" className="h-11 px-6 rounded-full bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] font-bold text-[13px] inline-flex items-center gap-2"><GraduationCap size={16} /> Student Sign Up - Multi Step</Link>
              <Link to="/college/signup" className="h-11 px-6 rounded-full bg-[#1A3263] text-[#FAB95B] border-2 border-[#FAB95B] font-bold text-[13px] inline-flex items-center gap-2"><Building2 size={16} /> College Sign Up - Verification</Link>
              <Link to="/login" className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] font-bold text-[13px] inline-flex items-center gap-2"><Shield size={16} /> Login - 3 Roles</Link>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-[900px]">
            {[
              { label: "Colleges", value: "6,247", sub: "All districts", color: "bg-white border-[#FAB95B]/30" },
              { label: "Students", value: "12.5k+", sub: "Secure tracking", color: "bg-white border-[#E8E2DB]" },
              { label: "Verified", value: "380+", sub: "Verified badge", color: "bg-[#1A3263] text-white border-[#1A3263]" },
              { label: "PDF Reports", value: "450+", sub: "College-wise", color: "bg-[#FAB95B] text-[#1A3263] border-[#FAB95B]" },
            ].map((s,i)=>(
              <div key={i} className={`rounded-[20px] border-2 p-5 flex gap-4 shadow-sm ${s.color}`}>
                <div className="h-11 w-11 rounded-[12px] bg-[#E8E2DB] border-2 border-[#FAB95B]/30 grid place-items-center text-[#1A3263]">
                  <Building2 size={20} />
                </div>
                <div>
                  <div className="font-display text-[22px] font-bold leading-none">{s.value}</div>
                  <div className="text-[11px] font-bold tracking-wide uppercase mt-1 opacity-80">{s.label}</div>
                  <div className="text-[11px] opacity-60">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[20px] bg-white border-2 border-[#FAB95B]/20 p-4">
            <div className="text-[11px] font-bold uppercase tracking-wide text-[#1A3263] mb-3 flex items-center gap-2"><ImageIcon size={12} className="text-[#FAB95B]" /> Real Images from www.psgtech.edu - 26 images + 3 videos - No AI - Official site</div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[
                "https://www.psgtech.edu/images/slider/foundationday_2026.jpg",
                "https://www.psgtech.edu/images/slider/Orientation_2026.jpg",
                "https://www.psgtech.edu/images/slider/TheConfluence-2026.jpg",
                "https://www.psgtech.edu/images/slider/RC2026.jpg",
                "https://www.psgtech.edu/images/TeachersDay2025.JPG",
                "https://library.psgtech.ac.in/images/logos/about_img_1694408630.jpg",
              ].map((img,i)=>(
                <img key={i} src={img} className="h-20 w-32 rounded-[12px] object-cover border-2 border-[#E8E2DB] shrink-0" alt="Real PSG" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-[72px] z-30 backdrop-blur-xl bg-[#E8E2DB]/90 border-b-2 border-[#FAB95B]/20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { label: "All Real", value: "All" },
              { label: "Engineering Real", value: "Engineering" },
              { label: "Arts & Science", value: "Arts" },
              { label: "Management", value: "Management" },
              { label: "Medical", value: "Medical" },
            ].map(f=>(
              <button 
                key={f.label} 
                onClick={()=>setType(f.value)}
                className={`whitespace-nowrap px-5 h-9 rounded-full text-[13px] font-bold border-2 transition-all ${type===f.value?'bg-[#1A3263] text-[#FAB95B] border-[#1A3263] shadow-lg':'bg-white border-[#E8E2DB] text-[#547792] hover:border-[#FAB95B] hover:text-[#1A3263]'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase text-[#547792]">Palette:</span>
            <div className="flex gap-1">
              <span className="h-6 w-6 rounded-full border-2 border-white shadow" style={{ background: '#E8E2DB' }} title="#E8E2DB" />
              <span className="h-6 w-6 rounded-full border-2 border-white shadow -ml-1" style={{ background: '#FAB95B' }} title="#FAB95B" />
              <span className="h-6 w-6 rounded-full border-2 border-white shadow -ml-1" style={{ background: '#547792' }} title="#547792" />
              <span className="h-6 w-6 rounded-full border-2 border-white shadow -ml-1" style={{ background: '#1A3263' }} title="#1A3263" />
            </div>
          </div>
        </div>
      </div>

      {/* Three Roles Section */}
      <div className="bg-white border-b-2 border-[#E8E2DB]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-16">
          <div className="max-w-[800px]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 text-[11px] font-bold uppercase text-[#1A3263]"><Shield size={12} /> Three Roles - Secure - Role Based Auth</div>
            <h2 className="font-display text-[36px] lg:text-[48px] font-bold leading-[0.95] tracking-tight mt-6 text-[#1A3263]">Student, College, Platform Admin - Complete flows with secure tracking</h2>
          </div>

          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            <div className="rounded-[24px] bg-[#E8E2DB]/50 border-2 border-[#E8E2DB] p-8">
              <div className="h-12 w-12 rounded-[14px] bg-[#1A3263] text-[#FAB95B] grid place-items-center"><GraduationCap /></div>
              <h3 className="font-bold text-[18px] mt-6 text-[#1A3263]">Student - Discover & Track</h3>
              <div className="text-[13px] text-[#547792] mt-3 leading-[1.6] space-y-2">
                <div>• Multi-step signup: Basic (name/email/mobile/password/district/city), Education (level 10th-PG/school/marks/percentage/groupStream/interestedSubject), Preferences (interestedCourse/preferredDistrict/collegeType/hostel/transport)</div>
                <div>• Dashboard: welcome, profile completion 100%, recommended based on interestedCourse/district, recentlyViewed, saved, compare, enquiries, activity summary secure</div>
                <div>• Discovery: powerful search name/course/dept/district/city/university/type + filters</div>
                <div>• Save, Compare 2-4 table, Enquiry with consent, Recently Viewed, Recommendation why shown</div>
              </div>
              <Link to="/student/signup" className="mt-6 inline-flex h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">Student Sign Up →</Link>
            </div>

            <div className="rounded-[24px] bg-[#1A3263] text-white border-2 border-[#1A3263] p-8">
              <div className="h-12 w-12 rounded-[14px] bg-[#FAB95B] text-[#1A3263] grid place-items-center"><Building2 /></div>
              <h3 className="font-bold text-[18px] mt-6 text-[#FAB95B]">College - Manage Own</h3>
              <div className="text-[13px] text-[#E8E2DB]/80 mt-3 leading-[1.6] space-y-2">
                <div>• Signup: name/official email/phone/website/address/district/city/pincode/type/university/established/principal + docs upload → PENDING VERIFICATION</div>
                <div>• Statuses: Pending, Under Review, Verified, Rejected, Needs Changes - only verified badge</div>
                <div>• Admin Dashboard: Dashboard/Profile/Branding/About/Management/Principal/Departments/Courses/Admissions/Examinations/Research/Accreditation/Campus/Facilities/Hostel/Library/Placements/Alumni/Careers/IIC/Events/Gallery/Announcements/Documents/Contact/Social/Settings</div>
                <div>• Add/Edit/Delete/Upload/Draft/Publish every record college_id isolation - Own college only</div>
                <div>• Analytics: only own college views/saves/compares/enquiries/popular courses/education/district - aggregated only</div>
              </div>
              <Link to="/college/signup" className="mt-6 inline-flex h-10 px-5 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[12px]">College Sign Up →</Link>
            </div>

            <div className="rounded-[24px] bg-white border-2 border-[#FAB95B]/30 p-8">
              <div className="h-12 w-12 rounded-[14px] bg-[#FAB95B] text-[#1A3263] border-2 border-[#FAB95B] grid place-items-center"><BarChart3 /></div>
              <h3 className="font-bold text-[18px] mt-6 text-[#1A3263]">Platform Admin - Analytics & PDF</h3>
              <div className="text-[13px] text-[#547792] mt-3 leading-[1.6] space-y-2">
                <div>• Totals: Students/Colleges/Verified/Pending/Views/Course Views/Saves/Comparisons/Enquiries</div>
                <div>• Charts: College Views, Course Interest, District-wise, Education Level, Popular Colleges/Courses</div>
                <div>• College-wise interest aggregated: Total Students Viewed/Views/Saved/Compared/Enquiries + by education/district/course - no individual browsing</div>
                <div>• PDF Report per college: logo, name, period, summary, charts tables, generated date/page number, View/Generate/Download</div>
                <div>• College Management approve/reject/verify/request changes/view info/analytics/PDF</div>
              </div>
              <Link to="/platform-admin" className="mt-6 inline-flex h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">Platform Admin →</Link>
            </div>
          </div>

          <div className="mt-8 rounded-[20px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-6">
            <div className="font-bold text-[#1A3263] flex items-center gap-2"><Shield size={16} /> 🔒 Privacy & Security - Core Rule - Student Activity Tracking</div>
            <div className="text-[12px] text-[#1A3263]/80 mt-3 leading-[1.6]">Record student_id/college_id/course_id/date/time/activity_type COLLEGE_VIEW/COURSE_VIEW/SAVE/COMPARE/ENQUIRY. If student simply views college page, DO NOT automatically send personal info to college. College should NOT get student name, phone, email, browsing history. Platform stores activity securely. Only when student explicitly clicks ENQUIRE NOW and agrees to share, relevant info sent to college. College analytics shows aggregated only: This month 1245 students viewed your college - NOT Student John viewed 10 times unless enquiry with consent. Student data belongs to platform and must be protected. Implemented in activityTracker.js with personalInfoShared flag and backend StudentActivity.java.</div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-[28px] font-bold tracking-tight text-[#1A3263]">Featured Colleges - Real Images - Premium Cards #E8E2DB #FAB95B #547792 #1A3263</h2>
          <Link to="/search" className="hidden lg:inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1A3263] hover:gap-2 transition-all">View all Real <ArrowUpRight size={16} /></Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(college=>(
            <CollegeCard key={college.id} college={college} />
          ))}
        </div>
      </div>

      <div className="border-t-2 border-[#FAB95B]/20 bg-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-20">
          <div className="max-w-[720px]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1A3263] border-2 border-[#FAB95B] text-[11px] font-bold tracking-widest uppercase text-[#FAB95B]">
              <Sparkles size={12} /> How It Works - Complete Flows - Production Ready
            </div>
            <h2 className="font-display text-[36px] lg:text-[48px] font-bold leading-[0.95] tracking-tight mt-6 text-[#1A3263]">
              Student, College, Platform - <br/>Secure tracking & PDF reports. <br/><span className="text-[#547792]">Premium SaaS.</span>
            </h2>
          </div>

          <div className="mt-16 grid lg:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Student Flow - Multi-step Signup", desc: "Landing → Signup (Basic: fullName/email/mobile/password/district/city, Education: level 10th-Postgrad/school/marks/percentage/groupStream/interestedSubject, Preferences: interestedCourse/preferredDistrict/collegeType/hostel/transport) → Profile → Dashboard (welcome, profile completion, recommended, recentlyViewed, saved, compare, enquiries) → Search (name/course/dept/district/city/university/type + filters) → View College (full profile real images + Save/Compare/Enquire) → Courses → Save/Compare/Enquire → Tracking (student_id/college_id/date/time/activity_type)", color: "bg-[#E8E2DB] border-[#FAB95B]/30" },
              { step: "02", title: "College Flow - Verification & CMS", desc: "Landing → Signup (name/official email/phone/website/address/district/city/pincode/type/university/established/principal + docs upload) → Details → Verification (PENDING, Under Review, Verified, Rejected, Needs Changes - only verified badge) → Admin Dashboard (Dashboard/Profile/Branding/About/Management/Principal/Departments/Courses/Admissions/Examinations/Research/Accreditation/Campus/Facilities/Hostel/Library/Placements/Alumni/Careers/IIC/Events/Gallery/Announcements/Documents/Contact/Social/Settings with Add/Edit/Delete/Upload/Draft/Publish every record college_id) → Add info/courses/depts/events/gallery → Publish → Manage → Analytics own college only", color: "bg-[#FAB95B]/20 border-[#FAB95B]" },
              { step: "03", title: "Platform Admin Flow - Analytics & PDF", desc: "Login → Dashboard (totals students/colleges/verified/pending/views/course views/saves/compares/enquiries + charts college views/course interest/district-wise/education-level/popular colleges/courses) → Manage Students (totals/education/district/courses/activity protecting sensitive) / Manage Colleges (approve/reject/verify/request changes/view info/analytics/PDF) → Verify Colleges → Monitor → View Interest Aggregated → Generate PDF Report (logo, name, period, summary, charts tables, generated date/page number, View/Generate/Download) - College-wise Student Interest Report", color: "bg-white border-[#547792]/20" },
            ].map(item=>(
              <div key={item.step} className={`rounded-[28px] border-2 p-8 ${item.color}`}>
                <div className="h-12 w-12 rounded-[14px] bg-[#1A3263] text-[#FAB95B] border-2 border-[#FAB95B] grid place-items-center font-display font-bold text-[18px]">{item.step}</div>
                <h3 className="font-bold text-[16px] leading-tight mt-6 text-[#1A3263]">{item.title}</h3>
                <p className="text-[12px] leading-[1.6] text-[#1A3263]/70 mt-3">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-[#1A3263] text-white border-t-4 border-[#FAB95B]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-16">
          <div className="flex flex-wrap justify-between gap-12">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-display font-bold border-2 border-[#E8E2DB]">T</div>
                <div className="leading-tight">
                  <div className="font-display text-[18px] font-semibold text-white">Tamil Nadu Colleges</div>
                  <div className="text-[11px] tracking-widest uppercase text-[#FAB95B]">Premium • Secure • #E8E2DB #FAB95B #547792 #1A3263</div>
                </div>
              </div>
              <p className="mt-6 max-w-[360px] text-[13px] leading-[1.6] text-[#E8E2DB]/70">Complete modern premium Tamil Nadu College Discovery Platform - centralized discovery across all districts. Three roles STUDENT/COLLEGE/PLATFORM_ADMIN role-based auth. Student multi-step signup, College self-service CMS, Platform Admin analytics & PDF reports. Privacy protected.</p>
              <div className="mt-4 flex gap-2">
                <span className="h-8 w-8 rounded-full border-2 border-white" style={{ background: '#E8E2DB' }} />
                <span className="h-8 w-8 rounded-full border-2 border-white" style={{ background: '#FAB95B' }} />
                <span className="h-8 w-8 rounded-full border-2 border-white" style={{ background: '#547792' }} />
                <span className="h-8 w-8 rounded-full border-2 border-white" style={{ background: '#1A3263' }} />
              </div>
            </div>
            <div className="flex gap-16 text-[13px]">
              <div>
                <div className="font-bold tracking-wide uppercase text-[11px] text-[#FAB95B]">Student - Real</div>
                <div className="mt-4 space-y-3 text-[#E8E2DB]/80">
                  <Link to="/student/signup" className="block hover:text-[#FAB95B]">Student Sign Up - Multi Step</Link>
                  <Link to="/student/dashboard" className="block hover:text-[#FAB95B]">Student Dashboard</Link>
                  <Link to="/search" className="block hover:text-[#FAB95B]">Explore Colleges</Link>
                  <Link to="/student/saved" className="block hover:text-[#FAB95B]">Saved Colleges</Link>
                  <Link to="/student/compare" className="block hover:text-[#FAB95B]">Compare 2-4</Link>
                </div>
              </div>
              <div>
                <div className="font-bold tracking-wide uppercase text-[11px] text-[#FAB95B]">College - Secure</div>
                <div className="mt-4 space-y-3 text-[#E8E2DB]/80">
                  <Link to="/college/signup" className="block hover:text-[#FAB95B]">College Sign Up - Verification</Link>
                  <Link to="/admin" className="block hover:text-[#FAB95B]">College Admin - Manage Own</Link>
                  <Link to="/platform-admin" className="block hover:text-[#FAB95B]">Platform Admin - PDF Reports</Link>
                  <Link to="/login" className="block hover:text-[#FAB95B]">Login - 3 Roles</Link>
                </div>
              </div>
              <div>
                <div className="font-bold tracking-wide uppercase text-[11px] text-[#FAB95B]">Colors - Palette</div>
                <div className="mt-4 space-y-2 text-[12px] text-[#E8E2DB]/80">
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#E8E2DB' }} /> #E8E2DB Beige BG</div>
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#FAB95B' }} /> #FAB95B Gold CTA</div>
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#547792' }} /> #547792 Slate Secondary</div>
                  <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: '#1A3263' }} /> #1A3263 Navy Primary</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-[#FAB95B]/20 flex flex-wrap justify-between gap-4 text-[11px] text-[#E8E2DB]/60">
            <div>© 2026 Tamil Nadu College Discovery Platform • Complete Premium Production System • Three Roles STUDENT/COLLEGE/PLATFORM_ADMIN • Secure Activity Tracking • PDF Reports • #E8E2DB #FAB95B #547792 #1A3263</div>
            <div>Student Signup Multi-step • College Signup Verification • Platform Admin Analytics • College Analytics Own Only • Save Compare Enquiry Consent Only • Recommendation Why Shown • Recently Viewed • Premium SaaS</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
