import { psgTechFullData } from '../../lib/psgtechFull'
import { Award, Users, GraduationCap, BookOpen, ExternalLink, Play } from 'lucide-react'

export function PSGAboutFull() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16 lg:py-20">
      <div className="inline-flex px-3 py-1 rounded-full bg-[#e8e2db] border text-[11px] font-bold tracking-widest uppercase text-[#1a3263]">
        About the College • Govt Aided • Autonomous • Anna University • ISO 9001:2015
      </div>
      <h2 className="font-display text-[32px] lg:text-[40px] font-semibold leading-[0.95] mt-4 text-[#1a3263]">
        About PSG College of Technology
      </h2>
      
      <div className="mt-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
        <div>
          <p className="text-[14px] leading-[1.8] text-[#1a3263]/80 whitespace-pre-line">{psgTechFullData.about.fullText.slice(0,1200)}...</p>
          
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="rounded-[16px] bg-[#e8e2db] p-5 border">
              <div className="text-[11px] font-bold uppercase text-[#547792]">Vision</div>
              <p className="mt-2 text-[13px] leading-[1.6] text-[#1a3263]">{psgTechFullData.about.vision}</p>
            </div>
            <div className="rounded-[16px] bg-[#1a3263] text-white p-5">
              <div className="text-[11px] font-bold uppercase text-[#fab95b]">Mission</div>
              <ul className="mt-2 space-y-1">
                {psgTechFullData.about.mission.map((m,i)=>(
                  <li key={i} className="text-[12px] leading-[1.5] text-[#e8e2db]">• {m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[20px] bg-white border border-[#e8e2db] p-5">
            <h4 className="font-semibold text-[14px] text-[#1a3263] flex items-center gap-2"><Users size={16} className="text-[#fab95b]" /> Managing Trustees</h4>
            <div className="mt-3 space-y-2">
              {psgTechFullData.about.trustees.slice(0,5).map((t,i)=>(
                <div key={i} className="text-[12px] p-2 rounded-[10px] bg-[#e8e2db] text-[#1a3263]">{t}</div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] bg-white border border-[#e8e2db] p-5">
            <h4 className="font-semibold text-[14px] text-[#1a3263] flex items-center gap-2"><Award size={16} className="text-[#fab95b]" /> Principals</h4>
            <div className="mt-3 space-y-2">
              {psgTechFullData.about.principals.slice(0,5).map((p,i)=>(
                <div key={i} className="text-[12px] p-2 rounded-[10px] bg-[#e8e2db] text-[#1a3263]">{p}</div>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] bg-[#1a3263] text-white p-5">
            <div className="text-[13px] font-semibold text-[#fab95b]">Student Strength & Research</div>
            <div className="text-[12px] text-[#e8e2db] mt-2 leading-[1.6]">{psgTechFullData.about.studentStrength} students, {psgTechFullData.about.researchScholars} research scholars, {psgTechFullData.about.ugProgrammes} UG, {psgTechFullData.about.pgProgrammes} PG programmes, QIP centre, 15+ visiting faculty.</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PSGProgrammesFull() {
  return (
    <section className="bg-[#e8e2db]/40 border-y border-[#e8e2db]">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
        <h2 className="font-display text-[32px] font-semibold text-[#1a3263]">Programmes Offered</h2>
        <p className="text-[13px] text-[#547792] mt-2">21 UG and 24 PG programmes • As per psgtech.edu/placements/programmes.php</p>

        <div className="mt-10">
          <h3 className="font-semibold text-[16px] text-[#1a3263] flex items-center gap-2"><BookOpen size={18} className="text-[#fab95b]" /> B.E / B.Tech Programmes</h3>
          <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {psgTechFullData.programmes.be_btech.slice(0,9).map((prog,i)=>(
              <div key={i} className="rounded-[14px] bg-white border border-[#e8e2db] p-4">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 rounded-full bg-[#1a3263] text-[#fab95b] text-[10px] font-bold">{prog.type}</span>
                  {prog.intake && <span className="text-[11px] text-[#547792]">{prog.intake} seats</span>}
                </div>
                <div className="font-medium text-[13px] mt-3 text-[#1a3263]">{prog.name}</div>
                {prog.link && <a href={prog.link} target="_blank" className="mt-2 inline-flex text-[11px] text-[#547792] hover:text-[#1a3263]">View Details <ExternalLink size={10} className="ml-1" /></a>}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-[15px] text-[#1a3263]">M.E / M.Tech</h3>
            <div className="mt-3 grid grid-cols-1 gap-2">
              {psgTechFullData.programmes.me_mtech.slice(0,8).map((prog,i)=>(
                <div key={i} className="p-3 rounded-[10px] bg-white border border-[#e8e2db] text-[12px] text-[#1a3263]">{prog.name}</div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-[15px] text-[#1a3263]">M.Sc / MCA / MBA / B.Sc / PhD</h3>
            <div className="mt-3 space-y-2">
              {[...psgTechFullData.programmes.msc_mca_mba.slice(0,5), ...psgTechFullData.programmes.bsc].map((prog,i)=>(
                <div key={i} className="p-3 rounded-[10px] bg-white border border-[#e8e2db] flex justify-between text-[12px] text-[#1a3263]">
                  <span>{prog.name}</span><span className="text-[#547792]">{prog.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function PSGAdvancedCentresFull() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
      <h2 className="font-display text-[28px] font-semibold text-[#1a3263]">Advanced Centres & Research Facilities</h2>
      <p className="text-[13px] text-[#547792] mt-2">19 centres with support from MHRD, DST, World Bank, UNDP, Industry</p>

      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {psgTechFullData.advancedCentres.slice(0,9).map((centre,i)=>(
          <div key={i} className="rounded-[16px] bg-white border border-[#e8e2db] p-5">
            <h3 className="font-semibold text-[13px] text-[#1a3263]">{centre.name}</h3>
            <div className="mt-2 px-2 py-1 rounded-full bg-[#e8e2db] text-[#1a3263] text-[10px] inline-block">{centre.funding}</div>
            <p className="text-[11px] text-[#547792] mt-2">{centre.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PSGCampusFull() {
  return (
    <section className="bg-[#1a3263] text-white">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
        <h2 className="font-display text-[28px] font-semibold">Campus Facilities</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-5">
          <div className="rounded-[16px] bg-white/5 border border-white/10 p-6">
            <h3 className="font-semibold">Library - Est. 1951</h3>
            <p className="text-[13px] text-white/60 mt-2">{psgTechFullData.campusFacilities.library.volumes} • Digital Library 122 computers • KOHA system • 2.60 Lakh books, 13053 CDs/DVDs, 195 journals, 1078 e-journals</p>
          </div>
          <div className="rounded-[16px] bg-white/5 border border-white/10 p-6">
            <h3 className="font-semibold">Hostel</h3>
            <p className="text-[13px] text-white/60 mt-2">{psgTechFullData.campusFacilities.hostel.description}</p>
          </div>
          <div className="rounded-[16px] bg-white/5 border border-white/10 p-6">
            <h3 className="font-semibold">Placement</h3>
            <p className="text-[13px] text-white/60 mt-2">{psgTechFullData.campusFacilities.placement.description} 90+ companies.</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {psgTechFullData.campusFacilities.other.map(f=>(
            <span key={f} className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[12px]">{f}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PSGEventsFull() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 lg:px-8 py-16">
      <h2 className="font-display text-[24px] font-semibold text-[#1a3263]">Events & Achievements</h2>
      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {psgTechFullData.eventsFromHomepage.slice(0,6).map((ev,i)=>(
          <div key={i} className="rounded-[16px] overflow-hidden border border-[#e8e2db] bg-white">
            <div className="h-[180px] overflow-hidden bg-[#e8e2db]">
              <img src={ev.image} className="h-full w-full object-cover" alt={ev.title} />
            </div>
            <div className="p-4">
              <div className="font-medium text-[13px] text-[#1a3263] leading-tight">{ev.title}</div>
              {ev.date && <div className="text-[11px] text-[#547792] mt-2">{ev.date}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
