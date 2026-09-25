import { useState } from 'react'
import { ChevronRight, ChevronsRight, Building2, ArrowRight, ChevronDown } from 'lucide-react'

function P({ text, className = 'text-[14px] leading-[1.9] text-[#547792]' }) {
  return <p className={className}>{text}</p>
}

function Banner({ dept, onNavigate }) {
  return (
    <div className="bg-[#1A3263]">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-10 sm:py-12">
        <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold">
          <button onClick={() => onNavigate('home')} className="text-white/85 hover:text-[#FAB95B] cursor-pointer">Home</button>
          <ChevronRight size={13} className="text-white/50" />
          <button onClick={() => onNavigate('home', 'departments')} className="text-white/85 hover:text-[#FAB95B] cursor-pointer">Academics</button>
          <ChevronRight size={13} className="text-white/50" />
          <span className="text-[#FAB95B]">Department of {dept.name}</span>
        </div>
        <div className="mt-5 flex items-center gap-4">
          <span className="h-[5px] w-[64px] rounded-full bg-[#FAB95B]"></span>
          <h1 className="text-[28px] sm:text-[36px] font-extrabold text-white tracking-tight">Department of {dept.name}</h1>
        </div>
      </div>
    </div>
  )
}

function DarkStrip({ title, image, rows }) {
  if (!title && rows.length === 0) return null
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[#12264B]">
        {image ? <img src={image} className="h-full w-full object-cover opacity-40" alt="" /> : null}
        <div className="absolute inset-0 bg-[#12264B]/70"></div>
      </div>
      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12 py-16 grid lg:grid-cols-2 gap-10 items-center">
        <h3 className="text-[28px] sm:text-[34px] font-extrabold text-white">{title}</h3>
        <div className="space-y-5">
          {rows.map((r, i) => (
            <div key={i} className="flex items-center gap-5">
              <span className="text-[14px] font-bold text-white">{r}</span>
              <span className="flex-1 h-px bg-white/60"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DeptPage({ dept, data, onNavigate }) {
  const [tab, setTab] = useState('peo')
  const d = data || {}
  const about = d.aboutText || []
  const infra = d.infraText || []
  const labs = d.labs || []
  const courses = d.courses || []
  const faculty = d.faculty || []
  const smart = d.smartRooms || []
  const teaching = d.teaching || []
  const objs = { peo: d.peo || [], po: d.po || [], pso: d.pso || [] }
  const hodBio = dept.hodDetailedBio || dept.hodBio || ''

  return (
    <div className="bg-[#F4F1EB]">
      <Banner dept={dept} onNavigate={onNavigate} />

      {/* Hero image + About card */}
      {(d.heroImage || about.length > 0) && (
        <div className="relative">
          {d.heroImage ? (
            <img src={d.heroImage} alt={'Department of ' + dept.name} className="w-full h-[340px] sm:h-[480px] object-cover" />
          ) : (
            <div className="w-full h-[200px] bg-[#547792]/20"></div>
          )}
          {about.length > 0 && (
            <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
              <div className="lg:w-[46%] lg:ml-auto lg:-mt-40 mb-10 bg-white/97 rounded-[6px] shadow-xl p-8 sm:p-10" style={{ backgroundColor: 'rgba(255,255,255,0.97)' }}>
                <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#1A3263]">About the Department</h2>
                <div className="mt-5 space-y-4">{about.map((t, i) => <P key={i} text={t} />)}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Infrastructure paragraphs */}
      {infra.length > 0 && (
        <div className="bg-[#547792]/10 py-14">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12 space-y-5">
            {infra.map((t, i) => <P key={i} text={t} />)}
          </div>
        </div>
      )}

      {/* Vision / Mission overlapping cards */}
      {(d.visionText || d.visionImage) && (
        <div className="py-16">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid lg:grid-cols-[1.1fr_1fr] items-center">
            {d.visionImage ? <img src={d.visionImage} alt="Vision" className="rounded-[14px] shadow-lg w-full h-[280px] sm:h-[360px] object-cover" /> : <div />}
            <div className="lg:-ml-24 mt-6 lg:mt-0 bg-white rounded-[14px] shadow-xl p-8 sm:p-10 relative z-10">
              <h3 className="text-[24px] sm:text-[28px] font-extrabold text-[#1A3263]">Our Vision</h3>
              <p className="mt-4 text-[14px] leading-[1.9] text-[#547792]">{d.visionText}</p>
            </div>
          </div>
        </div>
      )}
      {((d.missionBullets || []).length > 0 || d.missionImage) && (
        <div className="pb-16">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid lg:grid-cols-[1fr_1.1fr] items-center">
            <div className="order-2 lg:order-1 lg:-mr-24 mt-6 lg:mt-0 bg-white rounded-[14px] shadow-xl p-8 sm:p-10 relative z-10">
              <h3 className="text-[24px] sm:text-[28px] font-extrabold text-[#1A3263]">Our Mission</h3>
              <div className="mt-5 space-y-3.5">
                {(d.missionBullets || []).map((b, i) => (
                  <div key={i} className="flex gap-3">
                    <ChevronsRight size={16} className="shrink-0 mt-1 text-[#FAB95B]" />
                    <p className="text-[13.5px] leading-[1.8] text-[#547792]">{b}</p>
                  </div>
                ))}
              </div>
            </div>
            {d.missionImage ? <img src={d.missionImage} alt="Mission" className="order-1 lg:order-2 rounded-[14px] shadow-lg w-full h-[280px] sm:h-[360px] object-cover" /> : <div className="order-1 lg:order-2" />}
          </div>
        </div>
      )}

      {/* Regulations */}
      {(d.regulations || []).length > 0 && <DarkStrip title="Regulations" image={d.regulationsImage} rows={d.regulations} />}

      {/* Courses offered */}
      {(courses.length > 0 || d.coursesImage) && (
        <div className="py-16">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12 grid lg:grid-cols-2 gap-12 items-center">
            {d.coursesImage ? <img src={d.coursesImage} alt="Courses" className="w-full max-h-[380px] object-contain" /> : <div />}
            <div>
              <h3 className="text-[26px] sm:text-[30px] font-extrabold text-[#1A3263]">Courses Offered</h3>
              <div className="mt-7 flex flex-wrap gap-4">
                {courses.map((c, i) => (
                  <span key={i} className="px-7 py-3.5 rounded-[10px] bg-[#FAB95B]/30 text-[13.5px] font-bold text-[#1A3263]">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lab facilities */}
      {labs.length > 0 && (
        <div className="bg-[#547792]/10 py-16">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <h3 className="text-[26px] sm:text-[30px] font-extrabold text-[#1A3263]">Lab Facilities</h3>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {labs.map((l, i) => (
                <div key={i} className="rounded-[12px] bg-white shadow-sm overflow-hidden">
                  <div className="h-[6px] bg-[#FAB95B]"></div>
                  <div className="p-7 flex flex-col items-center text-center gap-4">
                    <span className="h-14 w-14 rounded-[12px] bg-[#547792]/15 grid place-items-center"><Building2 size={22} className="text-[#1A3263]" /></span>
                    <span className="text-[13.5px] font-semibold text-[#1A3263] leading-snug">{l}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PEO / PO / PSO */}
      {(objs.peo.length > 0 || objs.po.length > 0 || objs.pso.length > 0) && (
        <div className="py-16">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <div className="flex flex-wrap justify-center gap-4">
              {[['peo', 'Programme Educational Objectives'], ['po', 'Programme Outcomes'], ['pso', 'Program Specific Outcomes']].map(([k, label]) => (
                <button key={k} onClick={() => setTab(k)} className={`px-6 h-11 rounded-full text-[12px] font-bold tracking-wide inline-flex items-center gap-2 transition-colors cursor-pointer ${tab === k ? 'bg-[#1A3263] text-white shadow' : 'bg-white border border-[#547792]/40 text-[#1A3263] hover:border-[#FAB95B]'}`}>
                  <ChevronDown size={13} className={tab === k ? '' : '-rotate-90'} /> {label}
                </button>
              ))}
            </div>
            <h3 className="mt-12 text-[26px] sm:text-[30px] font-extrabold text-[#1A3263]">
              {tab === 'peo' ? 'Programme Educational Objectives' : tab === 'po' ? 'Programme Outcomes' : 'Program Specific Outcomes'}
            </h3>
            <div className="mt-8 space-y-5">
              {(objs[tab] || []).map((t, i) => (
                <div key={i} className="flex items-center gap-5 rounded-[12px] bg-white shadow-sm border-l-[5px] border-[#1A3263] px-6 py-5">
                  <span className="shrink-0 px-4 py-2 rounded-[10px] bg-gradient-to-br from-[#547792] to-[#1A3263] text-white text-[12px] font-extrabold">{tab.toUpperCase()}{i + 1}</span>
                  <span className="text-[13.5px] text-[#1A3263] leading-relaxed">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HOD Profile */}
      {dept.hod && (
        <div className="bg-[#547792]/10 py-16">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <h3 className="text-[26px] sm:text-[30px] font-extrabold text-[#1A3263]">HOD Profile</h3>
            <div className="mt-8 grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
              <div>
                <div className="text-[17px] font-extrabold text-[#1A3263]">{dept.hod}</div>
                <div className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#547792]">{dept.hodDesignation || 'Professor & Head'}</div>
                <div className="mt-5 space-y-4 text-[13.5px] leading-[1.9] text-[#547792]">
                  {hodBio ? hodBio.split(/\n\n|\n/).filter(Boolean).map((t, i) => <p key={i}><strong className="text-[#1A3263]">{dept.hod}</strong> {t}</p>) : null}
                  {dept.hodQualification ? <p><strong className="text-[#1A3263]">Qualification:</strong> {dept.hodQualification}</p> : null}
                  {dept.hodExperience ? <p><strong className="text-[#1A3263]">Experience:</strong> {dept.hodExperience}</p> : null}
                </div>
              </div>
              {dept.hodImage ? (
                <div className="bg-white rounded-[10px] shadow-lg p-2.5">
                  <img src={dept.hodImage} alt={dept.hod} className="w-full h-[380px] object-cover object-top rounded-[6px]" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Faculty */}
      {faculty.length > 0 && (
        <div className="py-16">
          <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
            <h3 className="text-[26px] sm:text-[30px] font-extrabold text-[#1A3263]">Faculty</h3>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {faculty.map((f, i) => (
                <div key={i} className="rounded-[12px] bg-white border border-[#E8E2DB] shadow-sm px-6 py-5">
                  <div className="text-[14px] font-extrabold text-[#1A3263]">{f.name}</div>
                  {f.role ? <div className="mt-1 text-[12px] text-[#547792] font-semibold">{f.role}</div> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Smart classrooms + Teaching & Learning */}
      {(smart.length > 0 || teaching.length > 0) && (
        <div className="bg-[#547792]/10 py-16">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12 space-y-14">
            {smart.length > 0 && (
              <div>
                <h3 className="text-center text-[24px] sm:text-[28px] font-extrabold text-[#1A3263]">Smart Class Rooms</h3>
                <div className="mt-9 grid md:grid-cols-2 gap-5">
                  {smart.map((s, i) => (
                    <div key={i} className="flex items-center justify-between rounded-full bg-white shadow-sm px-7 py-4">
                      <span className="text-[12.5px] font-bold uppercase tracking-wide text-[#1A3263]">{s}</span>
                      <ArrowRight size={15} className="text-[#547792]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {teaching.length > 0 && (
              <div>
                <h3 className="text-center text-[24px] sm:text-[28px] font-extrabold text-[#1A3263]">Teaching and Learning</h3>
                <div className="mt-9 grid md:grid-cols-2 gap-5">
                  {teaching.map((s, i) => (
                    <div key={i} className="flex items-center justify-between rounded-full bg-white shadow-sm px-7 py-4">
                      <span className="text-[13px] font-semibold text-[#1A3263]">{s}</span>
                      <ArrowRight size={15} className="text-[#547792]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Curriculum */}
      {(d.curriculum || []).length > 0 && <DarkStrip title="Curriculum" image={d.curriculumImage} rows={d.curriculum} />}
    </div>
  )
}
