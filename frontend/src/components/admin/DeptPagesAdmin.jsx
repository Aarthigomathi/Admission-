import { useState, useEffect } from 'react'
import { Upload, ImageIcon, Link as LinkIcon, Plus, Trash2, ChevronDown } from 'lucide-react'
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

// The 5 KCE page sections - shared by the "add department" form and the edit form,
// so the whole department page can be filled in ONE form.
function PageContentFields({ f, set, deptName, numberedFrom = 1 }) {
  const n = numberedFrom
  return (
    <>
      <div className="rounded-[12px] bg-[#F4F1EB] border border-[#E8E2DB] p-4 space-y-4">
        <h4 className="text-[13px] font-extrabold text-[#1A3263]">{n}. Hero + About the Department</h4>
        <div><Label>Hero image (full width)</Label><ImgInput value={f.heroImage} onChange={v => set('heroImage', v)} /></div>
        <div><Label>About paragraphs (blank line between)</Label><textarea rows={5} className={taCls} value={f.aboutText} onChange={e => set('aboutText', e.target.value)} /></div>
        <div><Label>Infrastructure / more paragraphs (blank line between)</Label><textarea rows={5} className={taCls} value={f.infraText} onChange={e => set('infraText', e.target.value)} /></div>
      </div>

      <div className="rounded-[12px] bg-[#F4F1EB] border border-[#E8E2DB] p-4 space-y-4">
        <h4 className="text-[13px] font-extrabold text-[#1A3263]">{n + 1}. Vision &amp; Mission</h4>
        <div className="grid lg:grid-cols-2 gap-4">
          <div><Label>Vision image</Label><ImgInput value={f.visionImage} onChange={v => set('visionImage', v)} /></div>
          <div><Label>Mission image</Label><ImgInput value={f.missionImage} onChange={v => set('missionImage', v)} /></div>
        </div>
        <div><Label>Vision text</Label><textarea rows={3} className={taCls} value={f.visionText} onChange={e => set('visionText', e.target.value)} /></div>
        <div><Label>Mission points (one per line)</Label><textarea rows={4} className={taCls} value={f.missionBullets} onChange={e => set('missionBullets', e.target.value)} /></div>
      </div>

      <div className="rounded-[12px] bg-[#F4F1EB] border border-[#E8E2DB] p-4 space-y-4">
        <h4 className="text-[13px] font-extrabold text-[#1A3263]">{n + 2}. Regulations + Curriculum + Courses</h4>
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
          <div><Label>Courses (one per line)</Label><textarea rows={3} className={taCls} placeholder={'B.E. ' + (deptName || '')} value={f.courses} onChange={e => set('courses', e.target.value)} /></div>
        </div>
      </div>

      <div className="rounded-[12px] bg-[#F4F1EB] border border-[#E8E2DB] p-4 space-y-4">
        <h4 className="text-[13px] font-extrabold text-[#1A3263]">{n + 3}. Labs + PEO / PO / PSO</h4>
        <div><Label>Lab facilities (one per line)</Label><textarea rows={4} className={taCls} value={f.labs} onChange={e => set('labs', e.target.value)} /></div>
        <div className="grid lg:grid-cols-3 gap-4">
          <div><Label>PEO (one per line)</Label><textarea rows={4} className={taCls} value={f.peo} onChange={e => set('peo', e.target.value)} /></div>
          <div><Label>PO (one per line)</Label><textarea rows={4} className={taCls} value={f.po} onChange={e => set('po', e.target.value)} /></div>
          <div><Label>PSO (one per line)</Label><textarea rows={4} className={taCls} value={f.pso} onChange={e => set('pso', e.target.value)} /></div>
        </div>
      </div>

      <div className="rounded-[12px] bg-[#F4F1EB] border border-[#E8E2DB] p-4 space-y-4">
        <h4 className="text-[13px] font-extrabold text-[#1A3263]">{n + 4}. Faculty + Smart Classrooms + Teaching &amp; Learning</h4>
        <div><Label>Faculty (one per line: Name | Designation)</Label><textarea rows={4} className={taCls} placeholder={'Dr. A. Kumar | Professor\nDr. B. Devi | Associate Professor'} value={f.faculty} onChange={e => set('faculty', e.target.value)} /></div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div><Label>Smart classroom subjects (one per line)</Label><textarea rows={4} className={taCls} value={f.smartRooms} onChange={e => set('smartRooms', e.target.value)} /></div>
          <div><Label>Teaching &amp; learning links (one per line)</Label><textarea rows={4} className={taCls} value={f.teaching} onChange={e => set('teaching', e.target.value)} /></div>
        </div>
        <Hint>HOD profile section automatic-aa inga add panna department HOD details-va use panum (name, designation, photo).</Hint>
      </div>
    </>
  )
}

const blankDeptForm = () => ({ name: '', hod: '', hodDesignation: 'Head of Department', hodQualification: '', hodExperience: '', hodEmail: '', hodPhone: '', hodImage: '', facultyCount: '' })

export default function DeptPagesAdmin({ collegeId, customData, setCustomData, fullCollege }) {
  // Only the departments this college added itself - template/default ones are never shown
  const departments = Array.isArray(customData.departments) ? customData.departments : []
  const [selId, setSelId] = useState(null)
  const [f, setF] = useState(blank())
  const [deptForm, setDeptForm] = useState(blankDeptForm())
  const [showAdd, setShowAdd] = useState(false)

  // if the selected department was deleted, fall back to the first one
  useEffect(() => {
    if (departments.length === 0) { if (selId !== null) setSelId(null); return }
    if (!selId || !departments.some(d => String(d.id) === String(selId))) setSelId(String(departments[0].id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departments.length, selId])

  useEffect(() => {
    const all = customData.deptPages || (fullCollege && fullCollege.deptPages) || {}
    setF(fromStored(all[selId] || all[String(selId)]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selId, collegeId])

  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }))

  const openAdd = () => {
    setDeptForm(blankDeptForm())
    setF(blank())
    setShowAdd(true)
  }

  const persistDepartments = (list, extra = {}) => {
    const merged = { ...customData, departments: list, ...extra }
    setCustomData(merged)
    saveCollegeDataSafe(collegeId, 'departments', list)
    if (extra.deptPages) saveCollegeDataSafe(collegeId, 'deptPages', extra.deptPages)
  }

  // One form: department + HOD details AND the whole KCE page content are saved together
  const addDepartment = () => {
    const name = (deptForm.name || '').trim()
    if (!name) return alert('Department name required')
    const list = customData.departments || []
    const id = Date.now()
    const dept = { id, createdAt: new Date().toISOString(), ...deptForm, name }
    const pages = { ...(customData.deptPages || {}), [id]: toStored(f) }
    persistDepartments([...list, dept], { deptPages: pages })
    setDeptForm(blankDeptForm())
    setF(blank())
    setShowAdd(false)
    setSelId(String(id))
    alert(`Department ${name} added + page content saved - Academics page-la live aagiduchu`)
  }

  const clearAllDepartments = () => {
    if (departments.length === 0) return
    if (!window.confirm(`Delete ALL ${departments.length} department(s) and their page content? Nee add panra department mattum vaanganum-na idha use pannunga.`)) return
    persistDepartments([], { deptPages: {} })
    setSelId(null)
    alert('All departments deleted - ippo Add Department click panni unga department-ah add pannunga')
  }

  const deleteDepartment = (id) => {
    const dept = departments.find(d => String(d.id) === String(id))
    if (!dept) return
    if (!window.confirm(`Delete "${dept.name}"? Adhoda department page content-um delete aagum.`)) return
    const list = (customData.departments || []).filter(d => String(d.id) !== String(id))
    const pages = { ...(customData.deptPages || {}) }
    delete pages[String(id)]
    delete pages[id]
    persistDepartments(list, { deptPages: pages })
    alert(`Department ${dept.name} deleted - website Academics la irundhu remove aagiduchu`)
  }
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
          <p className="text-[12px] text-white/60 mt-1">Each department gets the KCE department page: hero + about card, vision/mission cards, regulations, courses, labs, PEO/PO/PSO, HOD profile, faculty, smart classrooms, curriculum. <b>Add Department</b> click pannuna ellam ore form-la kedaikum - department + HOD + page content ellam oru thadava save aagum. Nee add panna department maathrum website Academics page-la varum.</p>
        </div>
        <button onClick={openAdd} className="h-11 px-6 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#FAB95B]/90 inline-flex items-center gap-2"><Plus size={15} /> Add Department</button>
        <div className="flex items-center gap-3">
          <select value={selId || ''} onChange={e => setSelId(e.target.value)} className="h-11 px-4 rounded-[12px] bg-white text-[13px] font-bold text-[#1A3263] focus:outline-none">
            {departments.map(d => <option key={d.id} value={String(d.id)}>{d.name}</option>)}
          </select>
          <button onClick={save} className="h-11 px-7 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#FAB95B]/90">Save</button>
        </div>
      </div>

      {showAdd ? (
        <div className="rounded-[16px] bg-white border-2 border-[#FAB95B]/40 p-6 space-y-5">
          <div>
            <h3 className="text-[15px] font-extrabold text-[#1A3263]">Add New Department - full KCE page ore form-la</h3>
            <p className="mt-1 text-[11.5px] text-[#547792]">Department name * kooda HOD details + page content ellam inga fill pannalam. Empty-aa vittaalum department add aagum - content appuram keela irukka edit form-la fill pannalam.</p>
          </div>

          <div className="rounded-[12px] bg-[#1A3263]/5 border border-[#E8E2DB] p-4 space-y-4">
            <h4 className="text-[13px] font-extrabold text-[#1A3263]">Department + HOD</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Department Name *</Label><input className={inputCls} value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} placeholder="e.g. Information Technology" /></div>
              <div><Label>Faculty Count</Label><input className={inputCls} value={deptForm.facultyCount} onChange={e => setDeptForm({ ...deptForm, facultyCount: e.target.value })} placeholder="e.g. 25" /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>HOD Name</Label><input className={inputCls} value={deptForm.hod} onChange={e => setDeptForm({ ...deptForm, hod: e.target.value })} placeholder="e.g. Dr. C. Deisy" /></div>
              <div><Label>HOD Designation</Label><input className={inputCls} value={deptForm.hodDesignation} onChange={e => setDeptForm({ ...deptForm, hodDesignation: e.target.value })} placeholder="Head of Department" /></div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>HOD Qualification</Label><input className={inputCls} value={deptForm.hodQualification} onChange={e => setDeptForm({ ...deptForm, hodQualification: e.target.value })} placeholder="e.g. Ph.D, M.E IT" /></div>
              <div><Label>HOD Experience</Label><input className={inputCls} value={deptForm.hodExperience} onChange={e => setDeptForm({ ...deptForm, hodExperience: e.target.value })} placeholder="e.g. 15 years" /></div>
            </div>
            <div><Label>HOD Photo (Academics card + department page HOD profile)</Label><ImgInput value={deptForm.hodImage} onChange={v => setDeptForm({ ...deptForm, hodImage: v })} /></div>
          </div>

          <PageContentFields f={f} set={set} deptName={deptForm.name} />

          <div className="flex flex-wrap gap-3">
            <button onClick={addDepartment} className="h-11 px-7 rounded-full bg-[#1A3263] text-[#FAB95B] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#1A3263]/90 inline-flex items-center gap-2"><Plus size={15} /> Add Department &amp; Save Page</button>
            <button onClick={() => setShowAdd(false)} className="h-11 px-6 rounded-full bg-white border-2 border-[#E8E2DB] text-[12px] font-bold text-[#1A3263]">Cancel</button>
          </div>
        </div>
      ) : null}

      <div className="rounded-[16px] bg-white border border-[#E8E2DB] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-[15px] font-extrabold text-[#1A3263]">Departments - {departments.length}</h3>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[11.5px] text-[#547792]">Inga add panna department maathrum website Academics page-la varum</span>
            {departments.length > 0 ? (
              <button onClick={clearAllDepartments} className="h-8 px-3 rounded-full bg-white border-2 border-red-200 text-[11px] font-bold text-red-500 hover:bg-red-50 inline-flex items-center gap-1.5"><Trash2 size={12} /> Delete All</button>
            ) : null}
          </div>
        </div>
        {departments.length === 0 ? (
          <div className="mt-4 py-10 text-center rounded-[12px] bg-[#F4F1EB] border-2 border-dashed border-[#E8E2DB]">
            <div className="font-bold text-[13px] text-[#1A3263]">No departments added yet</div>
            <div className="mt-2 text-[12px] text-[#547792]">Mela irukka <b>Add Department</b> click panni unga department-ah add pannunga - department + HOD + page content ellam ore form-la kedaikum.</div>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {departments.map(d => (
              <div key={d.id} className="flex flex-wrap items-center gap-3 rounded-[12px] border border-[#E8E2DB] bg-[#F4F1EB] p-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[8px] border border-[#E8E2DB] bg-white grid place-items-center text-[14px] font-extrabold text-[#1A3263]">
                  {d.hodImage ? <img src={d.hodImage} alt={d.hod} className="h-full w-full object-cover" /> : (d.name || 'D')[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-extrabold text-[#1A3263]">{d.name}</div>
                  <div className="mt-0.5 truncate text-[11px] text-[#547792]">{d.hod || 'HOD not set'}{d.hodDesignation ? ' \u2022 ' + d.hodDesignation : ''}{d.facultyCount ? ' \u2022 ' + d.facultyCount + ' Faculty' : ''}</div>
                </div>
                <button onClick={() => setSelId(String(d.id))} className={`h-9 px-4 rounded-full text-[11.5px] font-bold ${String(selId) === String(d.id) ? 'bg-[#1A3263] text-[#FAB95B]' : 'bg-white border-2 border-[#E8E2DB] text-[#1A3263]'}`}>{String(selId) === String(d.id) ? 'Editing' : 'Edit Page'}</button>
                <button onClick={() => deleteDepartment(d.id)} className="h-9 w-9 shrink-0 grid place-items-center rounded-full bg-white border-2 border-red-200 text-red-500 hover:bg-red-50" title={'Delete ' + (d.name || 'department')}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {departments.length === 0 ? (
        <div className="rounded-[16px] bg-white border border-[#E8E2DB] p-10 text-center text-[13px] text-[#547792]">Add a department above to start filling its page.</div>
      ) : (
        <>
          <div className="rounded-[16px] bg-white border border-[#E8E2DB] p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-extrabold text-[#1A3263]">Edit Department Page - {departments.find(d => String(d.id) === String(selId))?.name || ''}</h3>
                <p className="mt-1 text-[11.5px] text-[#547792]">Content maathrum edit panna - department add/delete panna mela irukka Departments list use pannunga.</p>
              </div>
              <button onClick={() => setShowAdd(v => !v)} className="h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[12px] font-extrabold inline-flex items-center gap-2"><Plus size={14} /> Add Another Department</button>
            </div>
            <PageContentFields f={f} set={set} deptName={departments.find(d => String(d.id) === String(selId))?.name} />
            <div className="flex justify-end">
              <button onClick={save} className="h-11 px-8 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#FAB95B]/90">Save Department Page</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
