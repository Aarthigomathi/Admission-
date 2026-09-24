import { useState, useEffect } from 'react'
import { Upload, Trash2, Plus, ImageIcon, Link as LinkIcon } from 'lucide-react'
import { saveCollegeDataSafe } from '../../lib/collegeStorage'

const inputCls = 'w-full h-10 px-3 rounded-[10px] border border-[#E8E2DB] bg-white text-[13px] text-[#1A3263] focus:outline-none focus:border-[#FAB95B]'
const taCls = 'w-full px-3 py-2.5 rounded-[10px] border border-[#E8E2DB] bg-white text-[13px] text-[#1A3263] leading-relaxed focus:outline-none focus:border-[#FAB95B]'

function Label({ children }) {
  return <div className="text-[11.5px] font-extrabold uppercase tracking-wide text-[#1A3263] mb-1.5">{children}</div>
}
function Hint({ children }) {
  return <div className="mt-1 text-[11px] text-[#547792]">{children}</div>
}

function ImgInput({ value, onChange, label = 'Image' }) {
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
      {value ? <button onClick={() => onChange('')} className="h-9 w-9 shrink-0 grid place-items-center rounded-[10px] border border-[#E8E2DB] text-[#547792] hover:text-red-500" title="Remove"><Trash2 size={14} /></button> : null}
      <span className="hidden">{label}</span>
    </div>
  )
}

function Group({ n, title, children }) {
  return (
    <div className="rounded-[16px] bg-white border border-[#E8E2DB] p-6">
      <div className="flex items-center gap-2.5 mb-5">
        <span className="h-7 w-7 rounded-full bg-[#FAB95B] text-[#1A3263] grid place-items-center text-[12px] font-extrabold">{n}</span>
        <h3 className="text-[15px] font-extrabold text-[#1A3263]">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

const blankForm = () => ({
  profile: { heading: '', paragraphs: '', cardText: '', image: '', highlights: '', whyHeading: '', whyText: '', stats: '', campusLife: '' },
  vision: { visionText: '', missionBullets: '', coreValues: '' },
  management: [],
  org: { chartImage: '' },
  coe: { categories: [], innovation: { title: '', text: '', image: '' } },
  acc: { naacLogo: '', naacTitle: '', naacText: '', nbaLogo: '', nbaTitle: '', nbaText: '', nbaItems: '', companiesHeading: '', mouIntro: '', mous: [], electivesTitle: '', electivesIntro: '', electives: [] },
})

function fromStored(src) {
  const f = blankForm()
  if (!src) return f
  const p = src.profile || {}
  f.profile = {
    heading: p.heading || '',
    paragraphs: (p.paragraphs || []).join('\n\n'),
    cardText: (p.cardText || []).join('\n\n'),
    image: p.image || '',
    highlights: (p.highlights || []).join('\n'),
    whyHeading: p.whyHeading || '',
    whyText: p.whyText || '',
    stats: (p.stats || []).map(s => s.value + ' | ' + s.label).join('\n'),
    campusLife: (p.campusLife || []).join('\n'),
  }
  const v = src.vision || {}
  f.vision = {
    visionText: v.visionText || '',
    missionBullets: (v.missionBullets || []).join('\n'),
    coreValues: (v.coreValues || []).map(c => c.title + '\n' + c.text).join('\n\n'),
  }
  f.management = (src.management || []).map(m => ({ role: m.role || '', name: m.name || '', photo: m.photo || '', bioText: (m.bio || []).join('\n\n') }))
  f.org = { chartImage: (src.org || {}).chartImage || '' }
  const c = src.coe || {}
  f.coe = {
    categories: (c.categories || []).map(cat => ({ title: cat.title || '', logos: (cat.logos || []).map(l => ({ name: l.name || '', url: l.url || '' })) })),
    innovation: { title: (c.innovation || {}).title || '', text: ((c.innovation || {}).text || []).join('\n\n'), image: (c.innovation || {}).image || '' },
  }
  const a = src.acc || {}
  f.acc = { ...f.acc, ...a, nbaItems: (a.nbaItems || []).join('\n'), mous: (a.mous || []).map(m => ({ ...m })), electives: (a.electives || []).map(l => ({ ...l })) }
  return f
}

function toStored(f) {
  const L = (s) => String(s || '').split('\n').map(x => x.trim()).filter(Boolean)
  const B = (s) => String(s || '').split(/\n\s*\n/).map(x => x.trim()).filter(Boolean)
  return {
    profile: {
      heading: f.profile.heading,
      paragraphs: B(f.profile.paragraphs),
      cardText: B(f.profile.cardText),
      image: f.profile.image,
      highlights: L(f.profile.highlights),
      whyHeading: f.profile.whyHeading,
      whyText: f.profile.whyText,
      stats: L(f.profile.stats).map(line => { const [value, label] = line.split('|').map(s => (s || '').trim()); return { value: value || '', label: label || value || '' } }),
      campusLife: L(f.profile.campusLife),
    },
    vision: {
      visionText: f.vision.visionText,
      missionBullets: L(f.vision.missionBullets),
      coreValues: B(f.vision.coreValues).map(block => { const idx = block.indexOf('\n'); return idx === -1 ? { title: block, text: '' } : { title: block.slice(0, idx).trim(), text: block.slice(idx + 1).trim() } }),
    },
    management: f.management.map(m => ({ role: m.role, name: m.name, photo: m.photo, bio: B(m.bioText) })),
    org: { chartImage: f.org.chartImage },
    coe: {
      categories: f.coe.categories.map(c => ({ title: c.title, logos: c.logos.filter(l => l.name || l.url) })),
      innovation: { title: f.coe.innovation.title, text: B(f.coe.innovation.text), image: f.coe.innovation.image },
    },
    acc: { ...f.acc, nbaItems: L(f.acc.nbaItems), mous: f.acc.mous.filter(m => m.name || m.url), electives: f.acc.electives.filter(l => l.name || l.url) },
  }
}

export default function AboutPagesAdmin({ collegeId, customData, setCustomData, fullCollege }) {
  const [f, setF] = useState(blankForm())

  useEffect(() => {
    const src = customData.aboutPages || (fullCollege && fullCollege.aboutPages) || null
    setF(fromStored(src))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeId])

  const set = (fn) => setF(prev => fn(structuredClone(prev)))
  const save = () => {
    const data = toStored(f)
    saveCollegeDataSafe(collegeId, 'aboutPages', data).then(ok => {
      if (ok) {
        setCustomData({ ...customData, aboutPages: data })
        alert('About pages saved! The college About section now shows this content in the KCE layout.')
      } else {
        alert('Storage full - images-ku URL use pannunga')
      }
    })
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[16px] bg-[#1A3263] p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[16px] font-extrabold text-white">About Pages (KCE Layout)</h2>
          <p className="text-[12px] text-white/60 mt-1">Profile, Vision & Mission, Management, Org Structure, Center of Excellence, Accreditations - same layout as the home page, your content. Use **text** for bold highlights. Every image slot supports upload or URL.</p>
        </div>
        <button onClick={save} className="h-11 px-7 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#FAB95B]/90">Save About Pages</button>
      </div>

      <Group n="1" title="Profile (About College)">
        <div><Label>Page heading (leave blank for automatic About title)</Label><input className={inputCls} value={f.profile.heading} onChange={e => set(d => { d.profile.heading = e.target.value })} /></div>
        <div><Label>Introduction paragraphs</Label><textarea rows={7} className={taCls} value={f.profile.paragraphs} onChange={e => set(d => { d.profile.paragraphs = e.target.value })} /><Hint>One paragraph per blank line. Wrap key phrases in **double stars** to make them bold highlights.</Hint></div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div><Label>Campus photo (beside text card)</Label><ImgInput value={f.profile.image} onChange={v => set(d => { d.profile.image = v })} /></div>
          <div><Label>"Why college" heading + line</Label>
            <input className={inputCls} placeholder="Your Campus. Your Opportunities." value={f.profile.whyHeading} onChange={e => set(d => { d.profile.whyHeading = e.target.value })} />
            <input className={inputCls + ' mt-2'} placeholder="Short supporting line" value={f.profile.whyText} onChange={e => set(d => { d.profile.whyText = e.target.value })} />
          </div>
        </div>
        <div><Label>Right card paragraphs</Label><textarea rows={4} className={taCls} value={f.profile.cardText} onChange={e => set(d => { d.profile.cardText = e.target.value })} /></div>
        <div><Label>Highlights (one per line)</Label><textarea rows={5} className={taCls} value={f.profile.highlights} onChange={e => set(d => { d.profile.highlights = e.target.value })} /></div>
        <div><Label>Stat cards (one per line: value | label, max 6)</Label><textarea rows={4} className={taCls} placeholder={'15+ | Centres of Excellence\n100% | ICT Enabled Classrooms'} value={f.profile.stats} onChange={e => set(d => { d.profile.stats = e.target.value })} /></div>
        <div><Label>Campus life chips (one per line, max 8)</Label><textarea rows={4} className={taCls} placeholder={'Wi-Fi Enabled Campus\n24/7 Lab Access'} value={f.profile.campusLife} onChange={e => set(d => { d.profile.campusLife = e.target.value })} /></div>
      </Group>

      <Group n="2" title="Vision & Mission + Core Values">
        <div><Label>Vision text</Label><textarea rows={3} className={taCls} value={f.vision.visionText} onChange={e => set(d => { d.vision.visionText = e.target.value })} /></div>
        <div><Label>Mission points (one per line)</Label><textarea rows={4} className={taCls} value={f.vision.missionBullets} onChange={e => set(d => { d.vision.missionBullets = e.target.value })} /></div>
        <div><Label>Core values (block per value: first line TITLE, next lines description, blank line between)</Label><textarea rows={6} className={taCls} value={f.vision.coreValues} onChange={e => set(d => { d.vision.coreValues = e.target.value })} /></div>
      </Group>

      <Group n="3" title="Management Profile (Chairman / CEO / Principal...)">
        {f.management.map((m, i) => (
          <div key={i} className="rounded-[12px] border border-[#E8E2DB] bg-[#F4F1EB] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-extrabold text-[#547792]">Member {i + 1}</span>
              <button onClick={() => set(d => { d.management.splice(i, 1) })} className="h-8 px-3 rounded-[8px] text-[11px] font-bold text-red-500 border border-red-200 bg-white inline-flex items-center gap-1"><Trash2 size={12} /> Remove</button>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Role label</Label><input className={inputCls} placeholder="CHAIRMAN" value={m.role} onChange={e => set(d => { d.management[i].role = e.target.value })} /></div>
              <div><Label>Full name</Label><input className={inputCls} value={m.name} onChange={e => set(d => { d.management[i].name = e.target.value })} /></div>
            </div>
            <div><Label>Photo</Label><ImgInput value={m.photo} onChange={v => set(d => { d.management[i].photo = v })} /></div>
            <div><Label>Profile text</Label><textarea rows={4} className={taCls} value={m.bioText} onChange={e => set(d => { d.management[i].bioText = e.target.value })} /></div>
          </div>
        ))}
        <button onClick={() => set(d => { d.management.push({ role: '', name: '', photo: '', bioText: '' }) })} className="h-10 px-5 rounded-[10px] bg-[#1A3263] text-[#FAB95B] text-[12px] font-extrabold inline-flex items-center gap-1.5"><Plus size={14} /> Add Member</button>
      </Group>

      <Group n="4" title="Organizational Structure (chart image)">
        <ImgInput value={f.org.chartImage} onChange={v => set(d => { d.org.chartImage = v })} label="Org chart" />
        <Hint>Upload your org chart as a single image - it is displayed full width on the page.</Hint>
      </Group>

      <Group n="5" title="Center of Excellence + Innovation Centre">
        {f.coe.categories.map((c, i) => (
          <div key={i} className="rounded-[12px] border border-[#E8E2DB] bg-[#F4F1EB] p-4 space-y-3">
            <div className="flex items-center gap-3 justify-between">
              <input className={inputCls} placeholder="Category title (e.g. Computing Sciences)" value={c.title} onChange={e => set(d => { d.coe.categories[i].title = e.target.value })} />
              <button onClick={() => set(d => { d.coe.categories.splice(i, 1) })} className="h-9 w-9 shrink-0 grid place-items-center rounded-[8px] text-red-500 border border-red-200 bg-white"><Trash2 size={14} /></button>
            </div>
            {c.logos.map((l, j) => (
              <div key={j} className="flex items-center gap-3">
                <input className={inputCls} placeholder="Partner name" value={l.name} onChange={e => set(d => { d.coe.categories[i].logos[j].name = e.target.value })} />
                <div className="flex-1"><ImgInput value={l.url} onChange={v => set(d => { d.coe.categories[i].logos[j].url = v })} /></div>
                <button onClick={() => set(d => { d.coe.categories[i].logos.splice(j, 1) })} className="h-9 w-9 shrink-0 grid place-items-center rounded-[8px] text-red-500 border border-red-200 bg-white"><Trash2 size={13} /></button>
              </div>
            ))}
            <button onClick={() => set(d => { d.coe.categories[i].logos.push({ name: '', url: '' }) })} className="h-9 px-4 rounded-[8px] bg-white border border-[#E8E2DB] text-[11.5px] font-bold text-[#1A3263] inline-flex items-center gap-1"><Plus size={12} /> Add Logo</button>
          </div>
        ))}
        <button onClick={() => set(d => { d.coe.categories.push({ title: '', logos: [{ name: '', url: '' }] }) })} className="h-10 px-5 rounded-[10px] bg-[#1A3263] text-[#FAB95B] text-[12px] font-extrabold inline-flex items-center gap-1.5"><Plus size={14} /> Add Category</button>
        <div className="pt-3 border-t border-[#E8E2DB] space-y-3">
          <Label>Innovation / Skill Development Centre</Label>
          <input className={inputCls} placeholder="Centre title" value={f.coe.innovation.title} onChange={e => set(d => { d.coe.innovation.title = e.target.value })} />
          <textarea rows={4} className={taCls} placeholder="Centre description paragraphs (blank line between)" value={f.coe.innovation.text} onChange={e => set(d => { d.coe.innovation.text = e.target.value })} />
          <ImgInput value={f.coe.innovation.image} onChange={v => set(d => { d.coe.innovation.image = v })} label="Innovation photo" />
        </div>
      </Group>

      <Group n="6" title="Accreditations, MoUs & Electives">
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label>NAAC block</Label>
            <ImgInput value={f.acc.naacLogo} onChange={v => set(d => { d.acc.naacLogo = v })} label="NAAC logo" />
            <input className={inputCls} placeholder="NAAC title" value={f.acc.naacTitle} onChange={e => set(d => { d.acc.naacTitle = e.target.value })} />
            <textarea rows={2} className={taCls} placeholder="NAAC text" value={f.acc.naacText} onChange={e => set(d => { d.acc.naacText = e.target.value })} />
          </div>
          <div className="space-y-3">
            <Label>NBA block</Label>
            <ImgInput value={f.acc.nbaLogo} onChange={v => set(d => { d.acc.nbaLogo = v })} label="NBA logo" />
            <input className={inputCls} placeholder="NBA title" value={f.acc.nbaTitle} onChange={e => set(d => { d.acc.nbaTitle = e.target.value })} />
            <textarea rows={2} className={taCls} placeholder="NBA intro text" value={f.acc.nbaText} onChange={e => set(d => { d.acc.nbaText = e.target.value })} />
            <textarea rows={3} className={taCls} placeholder={'Accredited departments (one per line)\nComputer Science and Engineering'} value={f.acc.nbaItems} onChange={e => set(d => { d.acc.nbaItems = e.target.value })} />
          </div>
        </div>
        <div><Label>Company accreditation heading</Label><input className={inputCls} value={f.acc.companiesHeading} onChange={e => set(d => { d.acc.companiesHeading = e.target.value })} /></div>
        <div><Label>MoU intro line</Label><input className={inputCls} value={f.acc.mouIntro} onChange={e => set(d => { d.acc.mouIntro = e.target.value })} /></div>
        <Label>MoU / Centre logos with captions</Label>
        {f.acc.mous.map((m, i) => (
          <div key={i} className="flex flex-col sm:flex-row items-stretch gap-3">
            <input className={inputCls} placeholder="Name" value={m.name} onChange={e => set(d => { d.acc.mous[i].name = e.target.value })} />
            <input className={inputCls} placeholder="Caption below logo" value={m.caption} onChange={e => set(d => { d.acc.mous[i].caption = e.target.value })} />
            <div className="flex-1"><ImgInput value={m.url} onChange={v => set(d => { d.acc.mous[i].url = v })} /></div>
            <button onClick={() => set(d => { d.acc.mous.splice(i, 1) })} className="h-9 w-9 shrink-0 grid place-items-center rounded-[8px] text-red-500 border border-red-200 bg-white"><Trash2 size={13} /></button>
          </div>
        ))}
        <button onClick={() => set(d => { d.acc.mous.push({ name: '', caption: '', url: '' }) })} className="h-9 px-4 rounded-[8px] bg-white border border-[#E8E2DB] text-[11.5px] font-bold text-[#1A3263] inline-flex items-center gap-1"><Plus size={12} /> Add MoU</button>
        <div className="pt-3 border-t border-[#E8E2DB] grid sm:grid-cols-2 gap-3">
          <div><Label>Electives heading</Label><input className={inputCls} value={f.acc.electivesTitle} onChange={e => set(d => { d.acc.electivesTitle = e.target.value })} /></div>
          <div><Label>Electives intro line</Label><input className={inputCls} value={f.acc.electivesIntro} onChange={e => set(d => { d.acc.electivesIntro = e.target.value })} /></div>
        </div>
        <Label>Elective partner logos</Label>
        {f.acc.electives.map((l, i) => (
          <div key={i} className="flex items-center gap-3">
            <input className={inputCls} placeholder="Partner name" value={l.name} onChange={e => set(d => { d.acc.electives[i].name = e.target.value })} />
            <div className="flex-1"><ImgInput value={l.url} onChange={v => set(d => { d.acc.electives[i].url = v })} /></div>
            <button onClick={() => set(d => { d.acc.electives.splice(i, 1) })} className="h-9 w-9 shrink-0 grid place-items-center rounded-[8px] text-red-500 border border-red-200 bg-white"><Trash2 size={13} /></button>
          </div>
        ))}
        <button onClick={() => set(d => { d.acc.electives.push({ name: '', url: '' }) })} className="h-9 px-4 rounded-[8px] bg-white border border-[#E8E2DB] text-[11.5px] font-bold text-[#1A3263] inline-flex items-center gap-1"><Plus size={12} /> Add Elective Partner</button>
      </Group>

      <div className="flex justify-end">
        <button onClick={save} className="h-11 px-8 rounded-full bg-[#FAB95B] text-[#1A3263] text-[12px] font-extrabold uppercase tracking-wide hover:bg-[#FAB95B]/90">Save About Pages</button>
      </div>
    </div>
  )
}
