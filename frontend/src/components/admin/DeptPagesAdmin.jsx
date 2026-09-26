import { useState, useEffect } from 'react'
import { Upload, ImageIcon, Link as LinkIcon } from 'lucide-react'
import { saveCollegeDataSafe } from '../../lib/collegeStorage'

const inputCls = 'w-full h-10 px-3 rounded-[10px] border border-[#E8E2DB] bg-white text-[13px] text-[#1A3263] focus:outline-none focus:border-[#FAB95B]'
const taCls = 'w-full px-3 py-2.5 rounded-[10px] border border-[#E8E2DB] bg-white text-[13px] text-[#1A3263] leading-relaxed focus:outline-none focus:border-[#FAB95B]'

function Label({ children }) {
  return <div className="text-[11.5px] font-extrabold uppercase tracking-wide text-[#1A3263] mb-1.5">{children}</div>
}
function Hint({ children }) {
  return <div className="mt-1 text-[11px] text-[#547792]">{children}</div>
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

const blank = () => ({
  heroImage: '', aboutText: '', infraText: '', visionImage: '', visionText: '', missionImage: '', missionBullets: '',
  regulationsImage: '', regulations: '', coursesImage: '', courses: '', labs: '', peo: '', po: '', pso: '',
  faculty: '', smartRooms: '', teaching: '', curriculumImage: '', curriculum: '',
})

function fromStored(src) {
  const f = blank()
  if (!src) return f
  const B = (a) => (a || []).join('\n\n')
  const L = (a) => (a || []).join('\n')
  f.heroImage = src.heroImage || ''
  f.aboutText = B(src.aboutText)
  f.infraText = B(src.infraText)
  f.visionImage = src.visionImage || ''
  f.visionText = src.visionText || ''
  f.missionImage = src.missionImage || ''
  f.missionBullets = L(src.missionBullets)
  f.regulationsImage = src.regulationsImage || ''
  f.regulations = L(src.regulations)
  f.coursesImage = src.coursesImage || ''
  f.courses = L(src.courses)
  f.labs = L(src.labs)
  f.peo = L(src.peo)
  f.po = L(src.po)
  f.pso = L(src.pso)
  f.faculty = (src.faculty || []).map(x => x.name + (x.role ? ' | ' + x.role : '')).join('\n')
  f.smartRooms = L(src.smartRooms)
  f.teaching = L(src.teaching)
  f.curriculumImage = src.curriculumImage || ''
  f.curriculum = L(src.curriculum)
  return f
}

function toStored(f) {
  const B = (s) => String(s || '').split(/\n\s*\n/).map(x => x.trim()).filter(Boolean)
  const L = (s) => String(s || '').split('\n').map(x => x.trim()).filter(Boolean)
  return {
    heroImage: f.heroImage, aboutText: B(f.aboutText), infraText: B(f.infraText),
    visionImage: f.visionImage, visionText: f.visionText, missionImage: f.missionImage, missionBullets: L(f.missionBullets),
    regulationsImage: f.regulationsImage, regulations: L(f.regulations), coursesImage: f.coursesImage, courses: L(f.courses),
    labs: L(f.labs), peo: L(f.peo), po: L(f.po), pso: L(f.pso),
    faculty: L(f.faculty).map(line => { const [name, role] = line.split('|').map(x => (x || '').trim()); return { name: name || line, role: role || '' } }),
    smartRooms: L(f.smartRooms), teaching: L(f.teaching), curriculumImage: f.curriculumImage, curriculum: L(f.curriculum),
  }
}

export default function DeptPagesAdmin({ collegeId, customData, setCustomData, fullCollege }) {
  const departments = customData.departments || (fullCollege && fullCollege.departments) || []
  const [selId, setSelId] = useState(null)
  const [f, setF] = useState(blank())

  useEffect(() => {
    if (!selId && departments.length > 0) setSelId(String(departments[0].id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departments.length])

  useEffect(() => {
    const all = customData.deptPages || (fullCollege && fullCollege.deptPages) || {}
    setF(fromStored(all[selId] || all[String(selId)]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selId, collegeId])

  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }))
  const save = () => {
    const all = customData.deptPages || {}
    const next = { ...all, [selId]: toStored(f) }
    saveCollegeDataSafe(collegeId, 'deptPages', next).then(ok => {
      if (ok) { setCustomData({ ...customData, deptPages: next }); alert('Department page saved! Website-la real-time update aagum.') }
      else alert('Storage full - images-ku URL use pannunga')
    })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[16px] bg-[#1A3263] p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[16px] font-extrabold text-white">Department Pages (KCE Layout)</h2>
          <p className="text-[12px] text-white/60 mt-1">Each department gets the KCE department page: hero + about card, vision/mission cards, regulations, courses, labs, PEO/PO/PSO, HOD profile, faculty, smart classrooms, curriculum. HOD name + HOD photo website Academics card-la already irukka department details-aa use panum.</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selId || ''} onChange={e => setSelId(e.target.value)} className="h-11 px-4 rounded-[12px] bg-white text-[13px] font-bold text-[#1A3263] focus:outline-none">
            {departments.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
          </select>
          <button onClick={save} className="h-11 px-7 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#FAB95B]/90">Save</button>
        </div>
      </div>

      {departments.length === 0 ? (
        <div className="rounded-[16px] bg-white border border-[#E8E2DB] p-10 text-center text-[13px] text-[#547792]">First add departments in the "Departments with HOD" tab.</div>
      ) : (
        <>
          <div className="rounded-[16px] bg-white border border-[#E8E2DB] p-6 space-y-4">
            <h3 className="text-[15px] font-extrabold text-[#1A3263]">1. Hero + About the Department</h3>
            <div><Label>Hero image (full width)</Label><ImgInput value={f.heroImage} onChange={v => set('heroImage', v)} /></div>
            <div><Label>About paragraphs (blank line between)</Label><textarea rows={5} className={taCls} value={f.aboutText} onChange={e => set('aboutText', e.target.value)} /></div>
            <div><Label>Infrastructure / more paragraphs (blank line between)</Label><textarea rows={5} className={taCls} value={f.infraText} onChange={e => set('infraText', e.target.value)} /></div>
          </div>

          <div className="rounded-[16px] bg-white border border-[#E8E2DB] p-6 space-y-4">
            <h3 className="text-[15px] font-extrabold text-[#1A3263]">2. Vision & Mission</h3>
            <div className="grid lg:grid-cols-2 gap-4">
              <div><Label>Vision image</Label><ImgInput value={f.visionImage} onChange={v => set('visionImage', v)} /></div>
              <div><Label>Mission image</Label><ImgInput value={f.missionImage} onChange={v => set('missionImage', v)} /></div>
            </div>
            <div><Label>Vision text</Label><textarea rows={3} className={taCls} value={f.visionText} onChange={e => set('visionText', e.target.value)} /></div>
            <div><Label>Mission points (one per line)</Label><textarea rows={4} className={taCls} value={f.missionBullets} onChange={e => set('missionBullets', e.target.value)} /></div>
          </div>

          <div className="rounded-[16px] bg-white border border-[#E8E2DB] p-6 space-y-4">
            <h3 className="text-[15px] font-extrabold text-[#1A3263]">3. Regulations + Curriculum + Courses</h3>
            <div className="grid lg:grid-cols-2 gap-4">
              <div><Label>Regulations banner image</Label><ImgInput value={f.regulationsImage} onChange={v => set('regulationsImage', v)} /></div>
              <div><Label>Curriculum banner image</Label><ImgInput value={f.curriculumImage} onChange={v => set('curriculumImage', v)} /></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div><Label>Regulations (one per line: R2023...)</Label><textarea rows={3} className={taCls} value={f.regulations} onChange={e => set('regulations', e.target.value)} /></div>
              <div><Label>Curriculum rows (one per line)</Label><textarea rows={3} className={taCls} value={f.curriculum} onChange={e => set('curriculum', e.target.value)} /></div>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div><Label>Courses offered image (department graphic)</Label><ImgInput value={f.coursesImage} onChange={v => set('coursesImage', v)} /></div>
              <div><Label>Courses (one per line)</Label><textarea rows={3} className={taCls} placeholder={'B.E. ' + (departments.find(d => String(d.id) === String(selId))?.name || '')} value={f.courses} onChange={e => set('courses', e.target.value)} /></div>
            </div>
          </div>

          <div className="rounded-[16px] bg-white border border-[#E8E2DB] p-6 space-y-4">
            <h3 className="text-[15px] font-extrabold text-[#1A3263]">4. Labs + PEO / PO / PSO</h3>
            <div><Label>Lab facilities (one per line)</Label><textarea rows={4} className={taCls} value={f.labs} onChange={e => set('labs', e.target.value)} /></div>
            <div className="grid lg:grid-cols-3 gap-4">
              <div><Label>PEO (one per line)</Label><textarea rows={4} className={taCls} value={f.peo} onChange={e => set('peo', e.target.value)} /></div>
              <div><Label>PO (one per line)</Label><textarea rows={4} className={taCls} value={f.po} onChange={e => set('po', e.target.value)} /></div>
              <div><Label>PSO (one per line)</Label><textarea rows={4} className={taCls} value={f.pso} onChange={e => set('pso', e.target.value)} /></div>
            </div>
          </div>

          <div className="rounded-[16px] bg-white border border-[#E8E2DB] p-6 space-y-4">
            <h3 className="text-[15px] font-extrabold text-[#1A3263]">5. Faculty + Smart Classrooms + Teaching & Learning</h3>
            <div><Label>Faculty (one per line: Name | Designation)</Label><textarea rows={4} className={taCls} placeholder={'Dr. A. Kumar | Professor\nDr. B. Devi | Associate Professor'} value={f.faculty} onChange={e => set('faculty', e.target.value)} /></div>
            <div className="grid lg:grid-cols-2 gap-4">
              <div><Label>Smart classroom subjects (one per line)</Label><textarea rows={4} className={taCls} value={f.smartRooms} onChange={e => set('smartRooms', e.target.value)} /></div>
              <div><Label>Teaching & learning links (one per line)</Label><textarea rows={4} className={taCls} value={f.teaching} onChange={e => set('teaching', e.target.value)} /></div>
            </div>
            <Hint>HOD profile section automatic-aa "Departments with HOD" tab data-va irundhu varum (name, designation, photo, bio).</Hint>
          </div>

          <div className="flex justify-end">
            <button onClick={save} className="h-11 px-8 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#FAB95B]/90">Save Department Page</button>
          </div>
        </>
      )}
    </div>
  )
}
