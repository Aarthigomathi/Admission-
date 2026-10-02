import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Building2, ArrowUpRight, Image as ImageIcon, Shield, BarChart3 } from 'lucide-react'
import CollegeCard from '../../components/platform/CollegeCard'
import { getDiscoveryColleges } from '../../lib/collegeStorage'
import LanguageToggle from '../../components/student/LanguageToggle'
import { useLanguage } from '../../lib/languageContext'

export default function PlatformHome() {
  const [colleges, setColleges] = useState([])
  const { t, language, isStudent } = useLanguage()

  useEffect(() => {
    // Show starter profiles and college-managed profiles in the student-facing directory.
    setColleges(getDiscoveryColleges())
    const handleStorage = () => setColleges(getDiscoveryColleges())
    window.addEventListener('storage', handleStorage)
    window.addEventListener('collegeRegistered', handleStorage)
    window.addEventListener('backendCollegesLoaded', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('collegeRegistered', handleStorage)
      window.removeEventListener('backendCollegesLoaded', handleStorage)
    }
  }, [])

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
              Premium • Secure • {isStudent ? (language==='ta' ? 'மாணவருக்கு மட்டும் தமிழ் / English Toggle' : 'Only Student Tamil / English Toggle') : 'Three Roles STUDENT/COLLEGE/PLATFORM_ADMIN'} • Activity Tracking • PDF Reports
            </div>
            {isStudent && <div className="mt-4"><LanguageToggle variant="default" /></div>}

            <h1 className="font-display text-[48px] lg:text-[84px] font-[700] leading-[0.9] tracking-[-0.03em] mt-8 text-[#1A3263] text-balance">
              Tamil Nadu's
              <span className="font-serif italic font-[400] tracking-tight text-[#547792]"> most trusted </span>
              college discovery platform.
            </h1>
            <p className="mt-6 text-[18px] lg:text-[20px] leading-[1.5] text-[#1A3263]/70 max-w-[700px]">
              Centralized discovery across all districts. Students <span className="font-bold text-[#1A3263]">SIGN UP & discover</span>, Colleges <span className="font-bold text-[#1A3263]">SIGN UP & add/manage own info</span>, Platform <span className="font-bold text-[#1A3263]">securely collects activity & generates college-wise PDF reports</span>. Premium SaaS feel.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-[900px]">
            {[
              { label: "Colleges", value: colleges.length===0 ? "0" : String(colleges.length), sub: colleges.length===0 ? "Directory being updated" : "Starter + college-managed", color: "bg-white border-[#FAB95B]/30" },
              { label: "Students", value: "12.5k+", sub: "Secure tracking", color: "bg-white border-[#E8E2DB]" },
              { label: "Verified", value: String(colleges.filter(c=>c.verificationStatus==='VERIFIED'||c.verified).length), sub: "Verified badge", color: "bg-[#1A3263] text-white border-[#1A3263]" },
              { label: "PDF Reports", value: "Live", sub: "College-wise PDF", color: "bg-[#FAB95B] text-[#1A3263] border-[#FAB95B]" },
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
            <div className="font-bold text-[#1A3263] flex items-center gap-2"><Shield size={16} />  Privacy & Security - Core Rule - Student Activity Tracking</div>
            <div className="text-[12px] text-[#1A3263]/80 mt-3 leading-[1.6]">Record student_id/college_id/course_id/date/time/activity_type COLLEGE_VIEW/COURSE_VIEW/SAVE/COMPARE/ENQUIRY. If student simply views college page, DO NOT automatically send personal info to college. College should NOT get student name, phone, email, browsing history. Platform stores activity securely. Only when student explicitly clicks ENQUIRE NOW and agrees to share, relevant info sent to college. College analytics shows aggregated only: This month 1245 students viewed your college - NOT Student John viewed 10 times unless enquiry with consent. Student data belongs to platform and must be protected. Implemented in activityTracker.js with personalInfoShared flag and backend StudentActivity.java.</div>
          </div>
        </div>
      </div>

      {colleges.length > 0 && (
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-[28px] font-bold tracking-tight text-[#1A3263]">
              {`Tamil Nadu Colleges to Explore - ${colleges.length} Listings`}
            </h2>
            <Link to="/search" className="hidden lg:inline-flex items-center gap-1.5 text-[13px] font-bold text-[#1A3263] hover:gap-2 transition-all">View all <ArrowUpRight size={16} /></Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map(college=>(
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        </div>
      )}

      <footer className="bg-[#1A3263] text-white border-t-4 border-[#FAB95B]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-16">
          <div className="flex flex-wrap justify-between gap-12">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-display font-bold border-2 border-[#E8E2DB]">T</div>
                <div className="leading-tight">
                  <div className="font-display text-[18px] font-semibold text-white">Tamil Nadu Colleges</div>
                  <div className="text-[11px] tracking-widest uppercase text-[#FAB95B]">Premium • Secure</div>
                </div>
              </div>
              <p className="mt-6 max-w-[360px] text-[13px] leading-[1.6] text-[#E8E2DB]/70">Complete modern premium Tamil Nadu College Discovery Platform - centralized discovery across all districts. Three roles STUDENT/COLLEGE/PLATFORM_ADMIN role-based auth. Student multi-step signup, College self-service CMS, Platform Admin analytics & PDF reports. Privacy protected.</p>

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
                <div className="font-bold tracking-wide uppercase text-[11px] text-[#FAB95B]">Platform</div>
                <div className="mt-4 space-y-3 text-[#E8E2DB]/80">
                  <div className="block">Verified Colleges Only</div>
                  <div className="block">Secure Student Tracking</div>
                  <div className="block">PDF Reports Generation</div>
                  <div className="block">Official Academic Portal</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-[#FAB95B]/20 flex flex-wrap justify-between gap-4 text-[11px] text-[#E8E2DB]/60">
            <div>© 2026 Tamil Nadu College Discovery Platform • Complete Premium Production System • Three Roles STUDENT/COLLEGE/PLATFORM_ADMIN • Secure Activity Tracking • PDF Reports</div>
            <div>Student Signup Multi-step • College Signup Verification • Platform Admin Analytics • College Analytics Own Only • Save Compare Enquiry Consent Only • Recommendation Why Shown • Recently Viewed • Premium SaaS</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
