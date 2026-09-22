import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Mail, Phone, Globe, MapPin, Calendar, User, Lock, Upload, CheckCircle2, AlertCircle } from 'lucide-react'

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
    const college = {
      id: Date.now(),
      slug: formData.collegeName.toLowerCase().replace(/\s+/g, '-'),
      name: formData.collegeName,
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
      address: formData.address,
      district: formData.district,
      city: formData.city,
      pincode: formData.pincode,
      type: formData.collegeType,
      affiliation: formData.university,
      established: Number(formData.establishedYear),
      principalName: formData.principalName,
      verificationStatus: 'PENDING',
      verified: false,
      role: 'COLLEGE_ADMIN'
    }
    const colleges = JSON.parse(localStorage.getItem('tn_registered_colleges') || '[]')
    colleges.push(college)
    localStorage.setItem('tn_registered_colleges', JSON.stringify(colleges))
    localStorage.setItem('tn_current_college', JSON.stringify(college))
    alert(`College registered! Status: PENDING VERIFICATION. Platform Admin will review. College ID: ${college.id}`)
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-[#E8E2DB] flex">
      <div className="hidden lg:flex w-[460px] bg-[#1A3263] text-white p-10 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#FAB95B]" />
        <div>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-[14px] bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold text-[22px]">C</div>
            <div>
              <div className="font-display font-bold">College Registration</div>
              <div className="text-[11px] tracking-widest uppercase text-[#FAB95B]">For Tamil Nadu Colleges • Verified</div>
            </div>
          </div>

          <h1 className="font-display text-[36px] font-bold leading-[0.9] mt-16">Register your college and get your own beautiful website</h1>
          <p className="mt-6 text-[14px] leading-[1.6] text-[#E8E2DB]/70">One platform, thousands of individual college websites. Each college feels like its own official site. You control content, we control technology, security, design system. Your palette #E8E2DB #FAB95B #547792 #1A3263</p>

          <div className="mt-10 space-y-4">
            {[
              { title: "College gets verified badge", desc: "After admin review: Pending → Under Review → Verified" },
              { title: "Own admin dashboard", desc: "Manage logo, name, tagline, campus images, about, courses, departments, events, gallery" },
              { title: "Secure multi-tenant", desc: "College A can never access College B data - college_id isolation" },
              { title: "Student enquiries", desc: "Receive enquiries only when student gives consent - privacy protected" },
            ].map((item,i)=>(
              <div key={i} className="flex gap-3 p-4 rounded-[16px] bg-white/5 border border-white/10">
                <div className="h-8 w-8 rounded-full bg-[#FAB95B] text-[#1A3263] grid place-items-center font-bold text-[14px]">{i+1}</div>
                <div>
                  <div className="font-semibold text-[13px]">{item.title}</div>
                  <div className="text-[11px] text-white/60 mt-1">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-[11px] text-white/30">Secure • Verified • Production Ready</div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-[64px] border-b-2 border-[#1A3263]/10 bg-white px-6 lg:px-10 flex items-center justify-between">
          <div className="font-bold text-[#1A3263]">College Sign Up - Real Website</div>
          <Link to="/login" className="text-[13px] font-semibold text-[#1A3263]">Already registered? <span className="bg-[#1A3263] text-[#FAB95B] px-3 py-1 rounded-full ml-2">Login</span></Link>
        </div>

        <div className="flex-1 overflow-auto p-6 lg:p-10">
          <div className="max-w-[720px] mx-auto">
            <div className="rounded-[24px] bg-amber-50 border-2 border-[#FAB95B]/50 p-5 flex gap-4 mb-8">
              <AlertCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-[13px] text-amber-900">Verification Required - Real Website</div>
                <div className="text-[12px] text-amber-800/80 mt-1 leading-[1.5]">After registration, status will be PENDING VERIFICATION. Platform Admin reviews college details and documents. Only verified colleges get Verified badge. This ensures students see authentic information. Your college will have beautiful individual website like psgtech.edu but with modern premium design in #E8E2DB #FAB95B #547792 #1A3263</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[24px] bg-white border-2 border-[#E8E2DB] p-8 shadow-sm space-y-6">
              <h2 className="font-display text-[22px] font-bold text-[#1A3263]">College Registration - Official Details</h2>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Building2 size={12} className="text-[#FAB95B]" /> College Name *</label>
                <input required value={formData.collegeName} onChange={e=>updateField('collegeName', e.target.value)} placeholder="e.g. PSG College of Technology" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Mail size={12} className="text-[#FAB95B]" /> Official Email *</label>
                  <input required type="email" value={formData.email} onChange={e=>updateField('email', e.target.value)} placeholder="principal@college.edu" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Phone size={12} className="text-[#FAB95B]" /> Official Phone *</label>
                  <input required value={formData.phone} onChange={e=>updateField('phone', e.target.value)} placeholder="+91 422 257 2177" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Globe size={12} className="text-[#FAB95B]" /> Website</label>
                <input value={formData.website} onChange={e=>updateField('website', e.target.value)} placeholder="https://www.college.edu" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><MapPin size={12} className="text-[#FAB95B]" /> Address *</label>
                <textarea required value={formData.address} onChange={e=>updateField('address', e.target.value)} placeholder="Full address with pincode" rows={2} className="mt-2 w-full p-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px] resize-none" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263]">District *</label>
                  <select value={formData.district} onChange={e=>updateField('district', e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]">
                    <option>Coimbatore</option><option>Chennai</option><option>Madurai</option><option>Trichy</option><option>Salem</option><option>Erode</option>
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
                    <option>Engineering</option><option>Arts & Science</option><option>Medical</option><option>Management</option><option>Law</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263]">University / Affiliation</label>
                  <select value={formData.university} onChange={e=>updateField('university', e.target.value)} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]">
                    <option>Anna University</option><option>Bharathiar University</option><option>TN Dr MGR Medical</option><option>University of Madras</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Calendar size={12} className="text-[#FAB95B]" /> Established Year</label>
                  <input value={formData.establishedYear} onChange={e=>updateField('establishedYear', e.target.value)} placeholder="1951" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><User size={12} className="text-[#FAB95B]" /> Principal Name</label>
                  <input value={formData.principalName} onChange={e=>updateField('principalName', e.target.value)} placeholder="Dr. Principal Name" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Lock size={12} className="text-[#FAB95B]" /> Password *</label>
                  <input required type="password" value={formData.password} onChange={e=>updateField('password', e.target.value)} placeholder="Create password" className="mt-2 w-full h-12 px-4 rounded-[12px] bg-[#E8E2DB] border-2 border-[#E8E2DB] focus:border-[#1A3263] focus:bg-white outline-none text-[14px]" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-[#1A3263] flex items-center gap-1.5"><Upload size={12} className="text-[#FAB95B]" /> Verification Documents (Optional)</label>
                <div className="mt-2 rounded-[12px] border-2 border-dashed border-[#1A3263]/20 bg-[#E8E2DB]/50 p-6 text-center">
                  <Upload size={24} className="mx-auto text-[#547792]" />
                  <div className="text-[12px] font-semibold text-[#1A3263] mt-2">Upload AICTE, NAAC, UGC certificates, college ID proof</div>
                  <div className="text-[11px] text-[#547792] mt-1">Helps admin verify quickly - PDF, JPG up to 10MB</div>
                </div>
              </div>

              <button type="submit" className="w-full h-12 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-[#1A3263]/90">
                Register College - Pending Verification <CheckCircle2 size={18} />
              </button>

              <div className="text-[11px] text-[#547792] text-center leading-[1.5]">After registration, Platform Admin reviews in 24-48h. Statuses: Pending, Under Review, Verified (gets badge), Rejected, Needs Changes. Only verified colleges show Verified badge. Your college will have beautiful individual website with your content, our design system #E8E2DB #FAB95B #547792 #1A3263</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
