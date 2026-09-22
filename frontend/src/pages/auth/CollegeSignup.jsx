import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Mail, Phone, Globe, MapPin, Calendar, User, Lock, Upload, CheckCircle2, AlertCircle, Sparkles, Image as ImageIcon, Award, Users, BookOpen } from 'lucide-react'
import { createNewCollegeFromSignup } from '../../lib/collegeStorage'

export default function CollegeSignup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    collegeName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    district: 'Coimbatore',
    city: '',
    pincode: '',
    collegeType: 'Engineering',
    university: 'Anna University',
    establishedYear: '2000',
    principalName: '',
    password: ''
  })

  const updateField = (f, v) => setFormData(p => ({ ...p, [f]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const college = createNewCollegeFromSignup(formData)
    alert(`College registered! ID: ${college.id} - Status: PENDING VERIFICATION. Platform Admin will review in 24-48h. After login, you can add your full college information A to Z yourself - logo, campus images, environment, placement, facilities, exam details, departments with HOD, etc. UI frame is ours, content is yours.`)
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-[#E8E2DB] flex">
      <div className="hidden lg:flex w-[480px] bg-[#1A3263] text-white p-10 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#FAB95B]" />
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-[14px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold text-[22px]">C</div>
            <div>
              <div className="font-display font-bold">College Registration - Own Website</div>
              <div className="text-[11px] tracking-widest uppercase text-[#FAB95B]">A to Z You Add Yourself • Our UI Frame Only</div>
            </div>
          </div>

          <h1 className="font-display text-[34px] font-bold leading-[0.9] mt-12">Register your college and build your own website - A to Z you add</h1>
          <p className="mt-4 text-[13px] leading-[1.6] text-[#E8E2DB]/70">After signup, you login and you add everything yourself: college logo, campus images, environment, placement, facilities, exam details, each department with HOD, courses, admissions, hostel, library, sports, research, accreditation, events, gallery, announcements, contact - full A to Z. Our UI frame only is ours, content full your control. Palette #E8E2DB #FAB95B #547792 #1A3263</p>

          <div className="mt-8 space-y-3">
            {[
              { title: "After signup - Your own empty website", desc: "Not PSG - Your college empty, you add logo, images, departments, courses, facilities, placements, exam details A to Z", icon: Building2 },
              { title: "Add College Logo & Campus Images", desc: "Branding: logo, hero image, cover, colors primary #1A3263 secondary #547792 accent #FAB95B, tagline", icon: ImageIcon },
              { title: "Add Departments with HOD", desc: "Each department: name, HOD name, faculty count, labs, description, image - You add as many as you want", icon: Users },
              { title: "Add Facilities, Placements, Exams", desc: "Environment, placement records, facilities, hostel, library, sports, exam details, research centres, accreditation - All sections you add", icon: Award },
              { title: "Verification: Pending → Verified", desc: "After you add, platform admin reviews. Only verified gets badge. Students see authentic info", icon: CheckCircle2 },
            ].map((item,i)=>(
              <div key={i} className="flex gap-3 p-3 rounded-[14px] bg-white/5 border border-white/10">
                <div className="h-8 w-8 rounded-[10px] bg-[#FAB95B] text-[#1A3263] grid place-items-center shrink-0"><item.icon size={14} /></div>
                <div>
                  <div className="font-semibold text-[12px]">{item.title}</div>
                  <div className="text-[11px] text-white/60 mt-1 leading-[1.4]">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-[10px] text-white/30">UI Frame Ours • Content Yours • A to Z You Add • #E8E2DB #FAB95B #547792 #1A3263 • Secure college_id isolation</div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-[64px] border-b-2 border-[#1A3263]/10 bg-white px-6 lg:px-10 flex items-center justify-between">
          <div className="font-bold text-[#1A3263] flex items-center gap-2"><Building2 size={18} className="text-[#FAB95B]" /> College Sign Up - Own A to Z Website</div>
          <Link to="/login" className="text-[13px] font-semibold text-[#1A3263]">Already registered? <span className="bg-[#1A3263] text-[#FAB95B] px-3 py-1 rounded-full ml-2">Login</span></Link>
        </div>

        <div className="flex-1 overflow-auto p-6 lg:p-10">
          <div className="max-w-[720px] mx-auto">
            <div className="rounded-[20px] bg-[#1A3263] text-white p-5 flex gap-4 mb-8 border-2 border-[#1A3263]">
              <div className="h-10 w-10 rounded-[12px] bg-[#FAB95B] text-[#1A3263] grid place-items-center shrink-0"><Sparkles size={18} /></div>
              <div>
                <div className="font-bold text-[13px] text-[#FAB95B]">After Signup - Your Own College Website (Not PSG) - You Add A to Z</div>
                <div className="text-[12px] text-[#E8E2DB]/80 mt-1 leading-[1.5]">Naa college signup panna apram direct ah PSG college varuthu enakku antha mathiri venam - Fixed! Inime college signup panna apram avunga login panna apram avunga colleges information college eh add pantra mathiri environment, placement, college logo, college image, facilities, placements, exam details, oru oru departmentkkum HOD antha mathiri college oda overall A to Z information college eh add pantra mathiri. Namma UI frame mattumtha nammatha irukkanum ennan add pannanumo athala avungaley add pannattum enna section venumoo ellamey - Done! Your college empty initially, you add everything yourself. UI frame ours, content yours.</div>
              </div>
            </div>

            <div className="rounded-[16px] bg-amber-50 border-2 border-[#FAB95B]/50 p-4 flex gap-3 mb-6">
              <AlertCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-[12px] text-amber-900">What you can add after login - Full A to Z</div>
                <div className="text-[11px] text-amber-800/80 mt-1 leading-[1.5]">College Logo, Campus Images, Environment, Placement Records, Facilities, Hostel, Library, Sports, Exam Details, Departments with HOD, Courses, Admissions, Management, Principal, Research Centres, Accreditation, Events, Gallery, Announcements, Contact, Social, Documents, Careers, IIC, Alumni, Custom Sections - Anything you want - All sections you add yourself - UI frame only ours - #E8E2DB #FAB95B #547792 #1A3263</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm space-y-5">
              <h2 className="font-display text-[22px] font-bold text-[#1A3263]">College Registration - Official Details - Your Own Website Starts Here</h2>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Building2 size={12} className="text-[#FAB95B]" /> College Name *</label>
                <input required value={formData.collegeName} onChange={e=>updateField('collegeName', e.target.value)} placeholder="e.g. Your College Name - After signup you add full info yourself" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Mail size={12} className="text-[#FAB95B]" /> Official Email *</label>
                  <input required type="email" value={formData.email} onChange={e=>updateField('email', e.target.value)} placeholder="principal@yourcollege.edu" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Phone size={12} className="text-[#FAB95B]" /> Official Phone *</label>
                  <input required value={formData.phone} onChange={e=>updateField('phone', e.target.value)} placeholder="+91 98765 43210" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Globe size={12} className="text-[#FAB95B]" /> Website</label>
                <input value={formData.website} onChange={e=>updateField('website', e.target.value)} placeholder="https://www.yourcollege.edu" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><MapPin size={12} className="text-[#FAB95B]" /> Address *</label>
                <textarea required value={formData.address} onChange={e=>updateField('address', e.target.value)} placeholder="Full address - After login you add environment, facilities, hostel, etc yourself" rows={2} className="mt-2 w-full p-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px] resize-none" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263]">District *</label>
                  <select value={formData.district} onChange={e=>updateField('district', e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]">
                    <option>Coimbatore</option><option>Chennai</option><option>Madurai</option><option>Trichy</option><option>Salem</option><option>Erode</option><option>Tirupur</option><option>Chengalpattu</option><option>Thanjavur</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263]">City *</label>
                  <input required value={formData.city} onChange={e=>updateField('city', e.target.value)} placeholder="City" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263]">Pincode *</label>
                  <input required value={formData.pincode} onChange={e=>updateField('pincode', e.target.value)} placeholder="641004" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263]">College Type</label>
                  <select value={formData.collegeType} onChange={e=>updateField('collegeType', e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]">
                    <option>Engineering</option><option>Arts & Science</option><option>Medical</option><option>Management</option><option>Law</option><option>Polytechnic</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263]">University / Affiliation</label>
                  <select value={formData.university} onChange={e=>updateField('university', e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]">
                    <option>Anna University</option><option>Bharathiar University</option><option>TN Dr MGR Medical</option><option>University of Madras</option><option>Autonomous</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Calendar size={12} className="text-[#FAB95B]" /> Established Year</label>
                  <input value={formData.establishedYear} onChange={e=>updateField('establishedYear', e.target.value)} placeholder="2000" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><User size={12} className="text-[#FAB95B]" /> Principal Name</label>
                  <input value={formData.principalName} onChange={e=>updateField('principalName', e.target.value)} placeholder="Dr. Principal Name - You add full principal details after login" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Lock size={12} className="text-[#FAB95B]" /> Password *</label>
                  <input required type="password" value={formData.password} onChange={e=>updateField('password', e.target.value)} placeholder="Create password" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Upload size={12} className="text-[#FAB95B]" /> Verification Documents (Optional - Upload after login also)</label>
                <div className="mt-2 rounded-[12px] border-2 border-dashed border-[#1A3263]/20 bg-[#E8E2DB]/50 p-6 text-center">
                  <Upload size={24} className="mx-auto text-[#547792]" />
                  <div className="text-[12px] font-semibold text-[#1A3263] mt-2">Upload AICTE, NAAC, UGC certificates, college ID proof</div>
                  <div className="text-[11px] text-[#547792] mt-1">After login you can add more documents, logo, campus images, environment, placement, facilities, exam details, department HOD etc - Full A to Z</div>
                </div>
              </div>

              <button type="submit" className="w-full h-12 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#1A3263]/90">
                Register College - Your Own Website A to Z You Add <CheckCircle2 size={18} />
              </button>

              <div className="rounded-[12px] bg-[#FAB95B]/20 border-2 border-[#FAB95B]/30 p-4">
                <div className="text-[11px] font-bold text-[#1A3263]">After Registration - What Happens?</div>
                <div className="text-[11px] text-[#1A3263]/80 mt-2 leading-[1.5]">1. Status PENDING VERIFICATION 2. You login → Your own college dashboard (NOT PSG - Your college empty) 3. You add A to Z: Logo, Campus Images, Environment, Placement, Facilities, Hostel, Library, Sports, Exam Details, Departments with HOD, Courses, Admissions, Management, Principal, Research, Accreditation, Events, Gallery, Announcements, Contact, Social, Documents, Careers, IIC, Alumni, Custom Sections - Whatever section you need 4. Our UI frame only ours, content yours 5. Preview → Publish → Live! Students discover your college - Palette #E8E2DB #FAB95B #547792 #1A3263</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
