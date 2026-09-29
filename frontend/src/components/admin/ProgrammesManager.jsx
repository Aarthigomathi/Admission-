import { useState } from 'react'
import { Plus, Edit3, Trash2, GripVertical, BookOpen, Award, Clock, Users, Search, Filter } from 'lucide-react'
import { psgTechFullData } from '../../lib/psgtechFull'

export default function ProgrammesManager({ college }) {
  const [activeCategory, setActiveCategory] = useState('be_btech')
  const [search, setSearch] = useState('')
  const [programmes, setProgrammes] = useState(psgTechFullData.programmes)

  const categories = [
    { id: 'be_btech', label: 'B.E / B.Tech', count: programmes.be_btech.length, icon: '' },
    { id: 'me_mtech', label: 'M.E / M.Tech', count: programmes.me_mtech.length, icon: '' },
    { id: 'msc_mca_mba', label: 'M.Sc / MCA / MBA', count: programmes.msc_mca_mba.length, icon: '' },
    { id: 'bsc', label: 'B.Sc', count: programmes.bsc.length, icon: '' },
    { id: 'phd', label: 'Ph.D / Research', count: programmes.phd.length, icon: '' },
  ]

  const currentList = programmes[activeCategory] || []
  const filtered = currentList.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[24px] bg-white border p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-[22px] font-semibold">Programmes Manager - 100% PSG Tech Structure</h3>
            <p className="text-[13px] text-zinc-500 mt-2 max-w-[600px]">All programmes from <a href="https://www.psgtech.edu/placements/programmes.php/1000" target="_blank" className="underline">psgtech.edu/placements/programmes.php</a> - 21 UG + 24 PG + PhD. College admin can add/edit/delete, with Courses of Study & Detailed Syllabus links.</p>
          </div>
          <button className="h-11 px-6 rounded-full bg-zinc-900 text-white text-[13px] font-bold flex items-center gap-2"><Plus size={16} /> Add Programme</button>
        </div>

        {/* Category Tabs */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 h-11 rounded-full border text-[13px] font-semibold transition-all ${activeCategory===cat.id?'bg-zinc-900 text-white border-zinc-900 shadow-lg':'bg-white border-zinc-200 hover:border-zinc-900'}`}
            >
              <span>{cat.icon}</span> {cat.label} <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${activeCategory===cat.id?'bg-white/20':'bg-zinc-100'}`}>{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mt-6 flex gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 h-11 rounded-full bg-zinc-50 border">
            <Search size={16} className="text-zinc-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Search ${categories.find(c=>c.id===activeCategory)?.label} programmes...`} className="flex-1 bg-transparent outline-none text-[13px]" />
          </div>
          <button className="h-11 w-11 grid place-items-center rounded-full bg-white border"><Filter size={16} /></button>
        </div>
      </div>

      {/* Programmes Grid - Unique UI per college */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((prog, i) => (
          <div key={i} className="group rounded-[20px] bg-white border p-5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="h-11 w-11 rounded-[12px] bg-zinc-50 border grid place-items-center text-[18px]"></div>
              <div className="flex items-center gap-1">
                <button className="h-8 w-8 rounded-full bg-zinc-50 border grid place-items-center hover:bg-zinc-900 hover:text-white"><Edit3 size={14} /></button>
                <button className="h-8 w-8 rounded-full bg-zinc-50 border grid place-items-center hover:bg-red-50 hover:text-red-600 hover:border-red-200"><Trash2 size={14} /></button>
                <div className="h-8 w-8 rounded-full bg-zinc-50 border grid place-items-center cursor-grab"><GripVertical size={14} /></div>
              </div>
            </div>
            
            <h4 className="font-semibold text-[14px] leading-tight mt-4">{prog.name}</h4>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-bold">{prog.type}</span>
              {prog.code && <span className="px-2.5 py-1 rounded-full bg-zinc-50 border text-[11px] font-medium">{prog.code}</span>}
              {prog.duration && <span className="px-2.5 py-1 rounded-full bg-zinc-50 border text-[11px] flex items-center gap-1"><Clock size={10} />{prog.duration}</span>}
              {prog.intake && <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-1"><Users size={10} />{prog.intake} seats</span>}
            </div>

            <div className="mt-4 flex gap-2">
              {prog.link && <a href={prog.link} target="_blank" className="h-8 px-3 rounded-full bg-white border text-[11px] font-semibold inline-flex items-center gap-1 hover:bg-zinc-900 hover:text-white">Details <BookOpen size={12} /></a>}
              <button className="h-8 px-3 rounded-full bg-zinc-50 border text-[11px] font-semibold">Courses of Study</button>
              <button className="h-8 px-3 rounded-full bg-zinc-50 border text-[11px] font-semibold">Syllabus PDF</button>
            </div>

            <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">Added by College Admin • Visible on public site</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[20px] bg-emerald-50 border border-emerald-200 p-5">
        <div className="font-semibold text-[13px] text-emerald-800 flex items-center gap-2"><Award size={16} /> College Admin Power</div>
        <div className="text-[12px] text-emerald-700/80 mt-2 leading-[1.6]">Colleges login pannitu intha programmes-a add/edit pannalaam. Add panna udane public website la <b>unique UI with correct alignment</b> la automatic-a theriyum. Platform controls card design, grid, typography - college cannot break layout. Future la 1000+ colleges add pannalum same system work aagum. Images, syllabus PDFs, intake, fees ellam college-eh manage pannalaam.</div>
      </div>
    </div>
  )
}
