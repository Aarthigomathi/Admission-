import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, ImageIcon, Link as LinkIcon, Plus, ExternalLink, ArrowRight, CheckCircle2, GraduationCap, Layers } from 'lucide-react'
import { createNewCollegeFromSignup, getRegisteredColleges, saveCollegeDataSafe } from '../../lib/collegeStorage'

const inputCls = 'w-full h-10 px-3 rounded-[10px] border border-[#E8E2DB] bg-white text-[13px] text-[#1A3263] focus:outline-none focus:border-[#FAB95B]'
const taCls = 'w-full px-3 py-2.5 rounded-[10px] border border-[#E8E2DB] bg-white text-[13px] text-[#1A3263] leading-relaxed focus:outline-none focus:border-[#FAB95B]'

const DISTRICTS = ['Coimbatore', 'Chennai', 'Madurai', 'Trichy', 'Salem', 'Erode', 'Tirupur', 'Chengalpattu', 'Thanjavur', 'Vellore', 'Kanyakumari']
const COLLEGE_TYPES = ['Engineering', 'Arts & Science', 'Medical', 'Management', 'Law', 'Polytechnic']
const UNIVERSITIES = ['Anna University', 'Bharathiar University', 'TN Dr MGR Medical', 'University of Madras', 'Autonomous']

function Label({ children }) {
  return <div className="text-[11.5px] font-extrabold uppercase tracking-wide text-[#1A3263] mb-1.5">{children}</div>
}

function ImgInput({ value, onChange }) {
  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }
  return (
    <div className="flex items-center gap-3">
      <div className="h-12 w-16 shrink-0 rounded-[8px] border border-[#E8E2DB] bg-[#F4F1EB] grid place-items-center overflow-hidden">
        {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImageIcon size={16} className="text-[#547792]/50" />}
      </div>
      <label className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-[10px] bg-[#1A3263] text-[#FAB95B] text-[11px] font-extrabold cursor-pointer hover:bg-[#1A3263]/90">
        <Upload size={12} /> Upload
        <input type="file" accept="image/*" className="hidden" onChange={onFile} />
      </label>
      <div className="flex-1 relative">
        <LinkIcon size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#547792]/60" />
        <input value={value && !value.startsWith('data:') ? value : ''} placeholder="or paste image URL" className={inputCls + ' pl-7'} onChange={(e) => onChange(e.target.value)} />
      </div>
      {value ? <button onClick={() => onChange('')} className="h-9 px-3 rounded-[10px] border border-[#E8E2DB] text-[11px] font-bold text-[#547792]">Clear</button> : null}
    </div>
  )
}

const blankForm = () => ({
  collegeName: '', email: '', phone: '', website: '', address: '', district: 'Coimbatore', city: '', pincode: '',
  collegeType: 'Engineering', university: 'Anna University', establishedYear: '', principalName: '',
  username: '', password: '', logo: '', heroImage: ''
})

export default function AddCollegeAdmin({ onCreated, onOpenCollege }) {
  const [form, setForm] = useState(blankForm)
  const [confirmPass, setConfirmPass] = useState('')
  const [err, setErr] = useState('')
  const [created, setCreated] = useState(null)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const validate = () => {
    if (!form.collegeName.trim()) return 'College name venum'
    if (!form.email.trim()) return 'College email venum'
    if (!form.phone.trim()) return 'Phone number venum'
    if (!form.address.trim()) return 'Address venum'
    if (!form.city.trim()) return 'City venum'
    if (!form.pincode.trim()) return 'Pincode venum'
    if (!form.username.trim()) return 'Login username venum - ithu college admin login-ku use aagum'
    if (form.password.length < 4) return 'Password kavanam 4 characters aagave venum'
    if (form.password !== confirmPass) return 'Password mattum confirm password same illai'
    const existing = getRegisteredColleges().some(c => String(c.loginUsername || '').toLowerCase() === form.username.trim().toLowerCase())
    if (existing) return 'Itha username already use aagiduchu - vere username kudunga'
    return ''
  }

  const submit = async () => {
    const e = validate()
    setErr(e)
    if (e) return
    const college = createNewCollegeFromSignup(form)
    if (form.logo || form.heroImage) {
      await saveCollegeDataSafe(college.id, 'branding', {
        logo: form.logo || '',
        heroImage: form.heroImage || '',
        coverImage: form.heroImage || '',
        collegeImages: [],
        colors: { primary: '#1A3263', secondary: '#547792', accent: '#FAB95B' },
        preset: 'engineering_blue'
      })
    }
    setCreated(college)
    setForm(blankForm)
    setConfirmPass('')
    if (onCreated) onCreated(college)
  }

  const colleges = getRegisteredColleges()

  return (
    <div className="space-y-5">
      <div className="rounded-[16px] bg-[#1A3263] p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[16px] font-extrabold text-white">Add College - New College Website</h2>
          <p className="text-[12px] text-white/60 mt-1 leading-relaxed max-w-[720px]">Orea college signup pannunga - oru college oru website. Add panna udane college admin dashboard + <b>/college/&lt;slug&gt;</b> website create aagum. Academics KCE layout-la varuvathukku add panna college Department Pages tab-la content fill pannanum.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-white/10 text-[#FAB95B] text-[11px] font-extrabold">{colleges.length} Colleges</span>
        </div>
      </div>

      {created ? (
        <div className="rounded-[16px] bg-white border-2 border-emerald-300 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-100 grid place-items-center text-emerald-700"><CheckCircle2 size={20} /></div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-extrabold text-[#1A3263]">{created.name} created!</h3>
              <div className="mt-1 text-[12px] text-[#547792] leading-relaxed">
                College ID: <b>{created.id}</b> &nbsp;•&nbsp; Website: <b>/college/{created.slug}</b> &nbsp;•&nbsp; Login username: <b>{created.loginUsername}</b> &nbsp;•&nbsp; Status: PENDING (verification-ku platform admin paakkum)
              </div>
            </div>
          </div>
          <div className="rounded-[12px] bg-[#F4F1EB] border border-[#E8E2DB] p-4">
            <div className="text-[12px] font-extrabold text-[#1A3263]">Ippo enna panna vendum (Academics kce.ac.in maathiri varuvathukku):</div>
            <ol className="mt-2 space-y-1.5 text-[11.5px] text-[#547792] leading-relaxed list-decimal pl-4">
              <li><b>Department Pages (KCE Layout)</b> tab → <b>Add Department</b> → department name + HOD name + HOD photo</li>
              <li>Department page content fill pannunga - hero, about, vision/mission, regulations, courses, labs, PEO/PO/PSO, faculty, curriculum (images upload pannalam)</li>
              <li><b>Save Department Page</b> → college website <b>Academics</b> menu-la athu kce.ac.in maathiri varum</li>
              <li>College Logo &amp; Branding + Home Page (KCE Layout) fill panniduvungal</li>
            </ol>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onCreated && onCreated(created)} className="h-11 px-6 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#FAB95B]/90 inline-flex items-center gap-2"><Layers size={15} /> Open This College Dashboard</button>
            <Link to={`/college/${created.slug}`} target="_blank" className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] text-[12px] font-bold inline-flex items-center gap-2">View Website <ExternalLink size={13} /></Link>
            <button onClick={() => setCreated(null)} className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] text-[12px] font-bold inline-flex items-center gap-2"><Plus size={15} /> Add Another College</button>
          </div>
        </div>
      ) : null}

      {created ? null : (
        <div className="rounded-[16px] bg-white border border-[#E8E2DB] p-6 space-y-6">
          <div>
            <h3 className="text-[14px] font-extrabold text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">1</span> College Details</h3>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div><Label>College Name *</Label><input className={inputCls} value={form.collegeName} onChange={e => set('collegeName', e.target.value)} placeholder="e.g. Kalaignar Karunanidhi College" /></div>
              <div><Label>College Email *</Label><input type="email" className={inputCls} value={form.email} onChange={e => set('email', e.target.value)} placeholder="principal@yourcollege.edu" /></div>
              <div><Label>Phone *</Label><input className={inputCls} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" /></div>
              <div><Label>Website</Label><input className={inputCls} value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://www.yourcollege.edu" /></div>
            </div>
            <div className="mt-4"><Label>Address *</Label><textarea rows={2} className={taCls} value={form.address} onChange={e => set('address', e.target.value)} placeholder="Full college address" /></div>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div><Label>District *</Label><select className={inputCls} value={form.district} onChange={e => set('district', e.target.value)}>{DISTRICTS.map(d => <option key={d}>{d}</option>)}</select></div>
              <div><Label>City *</Label><input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} placeholder="City" /></div>
              <div><Label>Pincode *</Label><input className={inputCls} value={form.pincode} onChange={e => set('pincode', e.target.value)} placeholder="641004" /></div>
            </div>
            <div className="mt-4 grid md:grid-cols-3 gap-4">
              <div><Label>College Type</Label><select className={inputCls} value={form.collegeType} onChange={e => set('collegeType', e.target.value)}>{COLLEGE_TYPES.map(d => <option key={d}>{d}</option>)}</select></div>
              <div><Label>University / Affiliation</Label><select className={inputCls} value={form.university} onChange={e => set('university', e.target.value)}>{UNIVERSITIES.map(d => <option key={d}>{d}</option>)}</select></div>
              <div><Label>Established Year</Label><input className={inputCls} value={form.establishedYear} onChange={e => set('establishedYear', e.target.value)} placeholder="2000" /></div>
            </div>
            <div className="mt-4"><Label>Principal Name</Label><input className={inputCls} value={form.principalName} onChange={e => set('principalName', e.target.value)} placeholder="Dr. Principal Name" /></div>
          </div>

          <div>
            <h3 className="text-[14px] font-extrabold text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">2</span> College Admin Login</h3>
            <p className="mt-2 text-[11.5px] text-[#547792]">Itha credentials college admin use panni login panni thanniya thaniya content fill pannuvanga.</p>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div><Label>Login Username *</Label><input className={inputCls} value={form.username} onChange={e => set('username', e.target.value)} placeholder="e.g. kce_admin" /></div>
              <div><Label>Password *</Label><input type="password" className={inputCls} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 4 characters" /></div>
              <div><Label>Confirm Password *</Label><input type="password" className={inputCls} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Repeat password" /></div>
            </div>
          </div>

          <div>
            <h3 className="text-[14px] font-extrabold text-[#1A3263] flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-[#1A3263] text-[#FAB95B] grid place-items-center text-[12px]">3</span> Logo &amp; Images (optional - Branding tab-la podhum)</h3>
            <div className="mt-4 space-y-4">
              <div><Label>College Logo</Label><ImgInput value={form.logo} onChange={v => set('logo', v)} /></div>
              <div><Label>Hero Image (website banner)</Label><ImgInput value={form.heroImage} onChange={v => set('heroImage', v)} /></div>
            </div>
          </div>

          {err ? <div className="rounded-[12px] bg-red-50 border-2 border-red-200 px-4 py-3 text-[12px] font-bold text-red-600">{err}</div> : null}

          <div className="flex flex-wrap gap-3">
            <button onClick={submit} className="h-11 px-7 rounded-full bg-[#1A3263] text-[#FAB95B] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#1A3263]/90 inline-flex items-center gap-2"><Plus size={15} /> Create College Website</button>
            <button onClick={() => { setForm(blankForm); setConfirmPass(''); setErr('') }} className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[12px] font-bold text-[#1A3263]">Reset</button>
            <Link to="/college/signup" className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] text-[12px] font-bold inline-flex items-center gap-2">Full Signup Form (college self-register) <ArrowRight size={13} /></Link>
          </div>
        </div>
      )}

      <div className="rounded-[16px] bg-white border border-[#E8E2DB] p-6">
        <h3 className="text-[15px] font-extrabold text-[#1A3263]">All Colleges - {colleges.length}</h3>
        <p className="mt-1 text-[11.5px] text-[#547792]">Orea college thaniyaana dashboard + website. Open panni content fill pannungal.</p>
        {colleges.length === 0 ? (
          <div className="mt-4 py-8 text-center rounded-[12px] bg-[#F4F1EB] border-2 border-dashed border-[#E8E2DB] text-[12px] text-[#547792]">Innum college illa - mela irukka form fill panni Create College Website click pannunga.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {colleges.map(c => (
              <div key={c.id} className="flex flex-wrap items-center gap-3 rounded-[12px] border border-[#E8E2DB] bg-[#F4F1EB] p-3">
                <div className="h-11 w-11 shrink-0 rounded-[10px] bg-[#1A3263] text-[#FAB95B] grid place-items-center font-extrabold overflow-hidden">
                  {c.branding?.logo ? <img src={c.branding.logo} alt="" className="h-full w-full object-cover" /> : (c.name || 'C')[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-extrabold text-[#1A3263]">{c.name}</div>
                  <div className="mt-0.5 truncate text-[11px] text-[#547792]">ID {c.id} • {c.city || c.district} • {c.verificationStatus} • {Array.isArray(c.departments) ? c.departments.length : 0} Departments</div>
                </div>
                <button onClick={() => onOpenCollege && onOpenCollege(c)} className="h-9 px-4 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11.5px] font-bold">Open Dashboard</button>
                <Link to={`/college/${c.slug}`} target="_blank" className="h-9 px-4 rounded-full bg-white border-2 border-[#E8E2DB] text-[#1A3263] text-[11.5px] font-bold inline-flex items-center gap-1.5">Website <ExternalLink size={12} /></Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[16px] bg-[#FAB95B]/15 border-2 border-[#FAB95B]/40 p-5">
        <div className="text-[13px] font-extrabold text-[#1A3263] flex items-center gap-2"><GraduationCap size={16} /> Orea college-um KCE Academics layout</div>
        <div className="mt-2 text-[11.5px] text-[#1A3263]/80 leading-relaxed">
          College create pannathum <b>departments empty</b>-a irukkum - template/default department varathu. Department Pages tab-la department add pannum pothu <b>kce.ac.in</b>-la irukka maathiri About the Department, Vision, Mission, Regulations, Courses Offered, Lab Facilities, PEO/PO/PSO, Faculty, Smart Class Rooms, Teaching &amp; Learning, Curriculum ellam form-il veenum - adhe Academics page-la UI + color same-a varum.
        </div>
      </div>
    </div>
  )
}
