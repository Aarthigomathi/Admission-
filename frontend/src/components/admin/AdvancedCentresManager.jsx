import { useState } from 'react'
import { Plus, Edit3, Trash2, Building2, ExternalLink, Award } from 'lucide-react'
import { psgTechFullData } from '../../lib/psgtechFull'

export default function AdvancedCentresManager() {
  const [centres, setCentres] = useState(psgTechFullData.advancedCentres)
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] bg-white border p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-[22px] font-semibold">Advanced Centres & Research Facilities - 100% from psgtech.edu</h3>
            <p className="text-[13px] text-zinc-500 mt-2">All centres from abtcllg.php - CAD/CAM/CIM, Virtual Reality, TIFAC-CORE, Festo-PSG, etc + Industry CoEs like TI, Intel, FANUC, Danfoss, Prosun. College admin can add custom centres like "Centre for Foreign Languages" - auto appears on website.</p>
          </div>
          <button onClick={()=>setShowAdd(!showAdd)} className="h-11 px-6 rounded-full bg-zinc-900 text-white text-[13px] font-bold flex items-center gap-2"><Plus size={16} /> Add Centre</button>
        </div>

        {showAdd && (
          <div className="mt-6 rounded-[20px] bg-zinc-50 border p-6 animate-fadeIn">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide">Centre Name</label>
                <input placeholder="e.g. Centre for Foreign Languages" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border text-[13px]" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide">Funding / Partner</label>
                <input placeholder="e.g. MHRD, DST, Industry name" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border text-[13px]" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wide">Description</label>
                <textarea placeholder="What does this centre do? Facilities, research areas..." rows={3} className="mt-2 w-full p-4 rounded-[12px] bg-white border text-[13px] resize-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide">Icon (Emoji)</label>
                <input placeholder="🔬" className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border text-[13px]" />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wide">Images</label>
                <input type="file" multiple className="mt-2 w-full h-11 px-4 rounded-[12px] bg-white border text-[13px] pt-2" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="h-10 px-6 rounded-full bg-zinc-900 text-white text-[12px] font-bold">Save Centre - Will appear uniquely on website</button>
              <button onClick={()=>setShowAdd(false)} className="h-10 px-6 rounded-full bg-white border text-[12px] font-semibold">Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {centres.map((centre, i) => (
          <div key={i} className="group rounded-[20px] bg-white border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className="flex items-start justify-between">
              <div className="h-12 w-12 rounded-[14px] bg-zinc-50 border grid place-items-center text-[22px]">🏢</div>
              <div className="flex gap-1">
                <button className="h-8 w-8 rounded-full bg-zinc-50 border grid place-items-center hover:bg-zinc-900 hover:text-white"><Edit3 size={14} /></button>
                <button className="h-8 w-8 rounded-full bg-zinc-50 border grid place-items-center hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
            <h4 className="font-semibold text-[13px] leading-tight mt-4">{centre.name}</h4>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-medium">{centre.funding}</span>
            </div>
            <p className="text-[12px] text-zinc-600 leading-[1.5] mt-3">{centre.description}</p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-zinc-400">
              <Building2 size={12} /> Added by College • Auto aligned on public site
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-[20px] bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-[12px] bg-amber-400 text-black grid place-items-center shrink-0"><Award size={20} /></div>
          <div>
            <div className="font-semibold text-[14px]">Custom Sections Power - Important!</div>
            <div className="text-[12px] text-amber-800/80 mt-2 leading-[1.6]">If college has section that does not exist in default platform (e.g. "Centre for Foreign Languages", "PSG-STEP Incubation", "Alumni Startup Cell"), admin can click <b>+ Add Custom Section</b> → fill Section Name, Title, Description, Images, Videos, Documents, Contact, Links → <b>automatic-a college website la theriyum</b>. UI unique-a irukkum, alignment correct-a irukkum, platform controls design. Future la 1000+ colleges add pannalum same flow.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
