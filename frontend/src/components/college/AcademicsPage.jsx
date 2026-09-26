import { ChevronRight, GraduationCap, ArrowRight, Building2 } from 'lucide-react'

// Academics page - lists ONLY the departments that have a Department Page saved
// from the admin "Department Pages (KCE Layout)" tab.
export default function AcademicsPage({ departments = [], deptPages = {}, onNavigate }) {
  const pageFor = (dept) => deptPages[String(dept.id)] || deptPages[dept.id] || null
  const list = departments || []

  return (
    <div className="bg-white">
      <div className="bg-[#1A3263]">
        <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-10 sm:py-12">
          <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold">
            <button onClick={() => onNavigate('home')} className="text-white/85 hover:text-[#FAB95B] cursor-pointer">Home</button>
            <ChevronRight size={13} className="text-white/50" />
            <span className="text-[#FAB95B]">Academics</span>
          </div>
          <div className="mt-5 flex items-center gap-4">
            <span className="h-[5px] w-[64px] rounded-full bg-[#FAB95B]"></span>
            <h1 className="text-[28px] sm:text-[36px] font-extrabold text-white tracking-tight">Academics</h1>
          </div>
          <p className="mt-4 max-w-[720px] text-[13.5px] leading-[1.9] text-[#E8E2DB]/80">
            Each department below is published from the Department Pages section of the college dashboard - hero image, about, vision and mission, courses, laboratories and faculty.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-6 lg:px-12 py-12 sm:py-16">
        {list.length === 0 ? (
          <div className="rounded-[20px] border-2 border-dashed border-[#E8E2DB] bg-[#F4F1EB] py-16 text-center">
            <GraduationCap size={34} className="mx-auto text-[#547792]/50" />
            <div className="mt-4 font-extrabold text-[16px] text-[#1A3263]">No departments added yet</div>
            <div className="mx-auto mt-2 max-w-[520px] text-[12.5px] leading-[1.8] text-[#547792]">
              Admin dashboard-la <b>Department Pages (KCE Layout)</b> tab-ku poni, <b>Add Department</b> click panni unga department-ah add pannunga - appuram content fill panni save pannunga.
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-[22px] sm:text-[26px] font-extrabold uppercase tracking-tight text-[#1A3263]">Departments</h2>
              <div className="text-[12px] font-extrabold uppercase tracking-wide text-[#547792]">{list.length} Published</div>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map(dept => {
                const page = pageFor(dept) || {}
                const photo = page.heroImage || dept.hodImage || dept.image || ''
                const about = (Array.isArray(page.aboutText) ? page.aboutText : []).filter(Boolean)
                return (
                  <div key={dept.id} className="group flex flex-col overflow-hidden rounded-[20px] border border-[#E8E2DB] bg-white transition-all hover:-translate-y-1 hover:shadow-xl">
                    <button type="button" onClick={() => onNavigate('dept-' + dept.id)} className="relative block h-[210px] w-full overflow-hidden bg-[#E8E2DB] text-left" title={'Open Department of ' + (dept.name || '')}>
                      {photo ? (
                        <img src={photo} alt={dept.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#E8E2DB] to-[#547792] text-[46px] font-extrabold text-[#1A3263]">{(dept.name || 'D')[0]}</div>
                      )}
                      <span className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1A3263]/85 to-transparent" />
                      <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#FAB95B] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#1A3263]">View Department</span>
                    </button>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-[15px] font-extrabold leading-snug text-[#1A3263]">Department of {dept.name}</h3>
                      {dept.hod ? (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden rounded-full border border-[#E8E2DB] bg-[#F4F1EB] text-[10px] font-extrabold text-[#1A3263]">
                            {dept.hodImage ? <img src={dept.hodImage} alt={dept.hod} className="h-full w-full object-cover" /> : (dept.hod || 'H')[0]}
                          </span>
                          <span className="min-w-0 truncate text-[12px] font-bold text-[#1A3263]">{dept.hod}</span>
                        </div>
                      ) : null}
                      {dept.hodDesignation ? <div className="mt-1 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-[#547792]">{dept.hodDesignation}</div> : null}
                      {about.length > 0 ? <p className="mt-3 line-clamp-3 text-[12.5px] leading-[1.8] text-[#547792]">{about[0]}</p> : null}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {Array.isArray(page.courses) && page.courses.length > 0 ? <span className="rounded-full bg-[#E8E2DB] px-2.5 py-1 text-[10.5px] font-bold text-[#1A3263]">{page.courses.length} Courses</span> : null}
                        {Array.isArray(page.labs) && page.labs.length > 0 ? <span className="rounded-full bg-[#E8E2DB] px-2.5 py-1 text-[10.5px] font-bold text-[#1A3263]">{page.labs.length} Labs</span> : null}
                        {Array.isArray(page.faculty) && page.faculty.length > 0 ? <span className="rounded-full bg-[#1A3263] px-2.5 py-1 text-[10.5px] font-bold text-[#FAB95B]">{page.faculty.length} Faculty</span> : null}
                      </div>
                      <button type="button" onClick={() => onNavigate('dept-' + dept.id)} className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border-2 border-[#1A3263] text-[12px] font-extrabold text-[#1A3263] transition-colors hover:bg-[#1A3263] hover:text-[#FAB95B]">
                        <Building2 size={13} /> Read More <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
