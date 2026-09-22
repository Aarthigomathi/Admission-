import { useState } from 'react'
import { Link } from 'react-router-dom'
import { colleges } from '../../lib/colleges'
import { themePresets } from '../../lib/theme'
import { 
  LayoutDashboard, Palette, Building2, GraduationCap, Users, Megaphone, Calendar, Image as ImageIcon,
  FileText, Phone, HelpCircle, Settings, Eye, Save, Upload, Plus, GripVertical, Trash2, Edit3,
  CheckCircle2, AlertCircle, Clock, BarChart3, ExternalLink, Search
} from 'lucide-react'

export default function AdminDashboard() {
  const college = colleges[0] // Simulate logged in as PSG Tech admin (college_id 101)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [branding, setBranding] = useState(college.branding)
  const [selectedPreset, setSelectedPreset] = useState(college.branding.preset)

  const menu = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'branding', label: 'College Profile & Branding', icon: Palette, badge: '80%' },
    { id: 'home', label: 'Home Page', icon: Building2 },
    { id: 'about', label: 'About Us', icon: FileText },
    { id: 'management', label: 'Management & Principal', icon: Users },
    { id: 'academics', label: 'Academics & Departments', icon: GraduationCap },
    { id: 'courses', label: 'Courses', icon: GraduationCap, count: college.courses.length },
    { id: 'admissions', label: 'Admissions', icon: FileText },
    { id: 'examinations', label: 'Examinations', icon: FileText },
    { id: 'research', label: 'Research', icon: FileText },
    { id: 'campus', label: 'Campus & Facilities', icon: Building2 },
    { id: 'placements', label: 'Placements', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Calendar, count: college.events.length },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, count: college.announcements.length },
    { id: 'contact', label: 'Contact & Help Desk', icon: Phone },
    { id: 'custom', label: 'Custom Sections', icon: Plus },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#fbfaf8] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[300px] shrink-0 bg-white border-r border-[#ede9e3] flex-col sticky top-0 h-screen">
        <div className="h-[72px] px-6 flex items-center gap-3 border-b border-[#ede9e3]">
          <div className="h-9 w-9 rounded-[10px] bg-[#0f172a] text-white grid place-items-center font-bold">T</div>
          <div>
            <div className="font-semibold text-[13px] leading-none">College Admin</div>
            <div className="text-[11px] text-zinc-500">PSG Tech • ID 101</div>
          </div>
          <div className="ml-auto h-2 w-2 rounded-full bg-emerald-500" />
        </div>

        <div className="p-4">
          <div className="rounded-[16px] bg-[#fbfaf8] border p-3 flex gap-3">
            <img src={college.branding.logo} className="h-10 w-10 rounded-[10px] object-cover" />
            <div className="min-w-0">
              <div className="font-semibold text-[13px] truncate">{college.name}</div>
              <div className="text-[11px] text-zinc-500 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Verified • Live</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-3 py-2 space-y-1">
          {menu.map(item=>(
            <button
              key={item.id}
              onClick={()=>setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 h-10 rounded-[12px] text-[13px] font-medium transition-colors text-left ${activeSection===item.id?'bg-[#0f172a] text-white shadow':'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
            >
              <item.icon size={18} />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-bold">{item.badge}</span>}
              {item.count && <span className="px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 text-[11px] font-bold">{item.count}</span>}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-[#ede9e3]">
          <Link to={`/college/${college.slug}`} target="_blank" className="flex items-center justify-center gap-2 h-11 rounded-full bg-white border font-semibold text-[13px] hover:bg-zinc-50">
            <Eye size={16} /> Preview Website <ExternalLink size={14} />
          </Link>
          <div className="mt-3 text-[11px] text-zinc-400 text-center">College ID: 101 • Multi-tenant secured</div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-20 h-[72px] bg-white/80 backdrop-blur-xl border-b border-[#ede9e3] px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-display text-[20px] font-semibold capitalize">{activeSection.replace(/-/g,' ')}</h1>
            <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold uppercase"><CheckCircle2 size={12} /> Published • Live</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden lg:flex items-center gap-2 text-[12px] text-zinc-500"><Clock size={14} /> Last updated 2h ago</span>
            <button className="h-10 px-5 rounded-full bg-zinc-100 border text-[13px] font-semibold">Save Draft</button>
            <button className="h-10 px-5 rounded-full bg-[#0f172a] text-white text-[13px] font-semibold flex items-center gap-2"><Save size={16} /> Publish</button>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-[1200px]">
          {activeSection==='dashboard' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: "Profile Completion", value: "80%", sub: "Add management details", color: "bg-amber-50 border-amber-200" },
                  { label: "Website Views", value: "12.4k", sub: "+18% this week", color: "bg-white" },
                  { label: "Course Views", value: "3.2k", sub: "B.E CSE most viewed", color: "bg-white" },
                  { label: "Enquiries", value: "84", sub: "12 pending", color: "bg-emerald-50 border-emerald-200" },
                ].map((s,i)=>(
                  <div key={i} className={`rounded-[20px] border p-5 ${s.color}`}>
                    <div className="text-[11px] font-bold tracking-widest uppercase opacity-60">{s.label}</div>
                    <div className="font-display text-[28px] font-semibold mt-2">{s.value}</div>
                    <div className="text-[12px] opacity-70 mt-1">{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Preview card */}
              <div className="rounded-[24px] bg-white border p-6 flex flex-col lg:flex-row gap-6 items-start">
                <img src={college.branding.heroImage} className="h-[160px] w-full lg:w-[280px] rounded-[16px] object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[18px]">{college.name}</h3>
                    <span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-700">VERIFIED</span>
                  </div>
                  <p className="text-[13px] text-zinc-500 mt-2 max-w-[500px]">{college.about.overview.slice(0,160)}...</p>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/college/${college.slug}`} className="h-9 px-5 rounded-full bg-zinc-900 text-white text-[12px] font-semibold grid place-items-center">View Public Website</Link>
                    <button className="h-9 px-5 rounded-full bg-zinc-50 border text-[12px] font-semibold">Edit Home Page</button>
                  </div>
                </div>
                <div className="rounded-[16px] bg-amber-50 border border-amber-200 p-4 max-w-[280px]">
                  <div className="flex gap-2 text-amber-800 text-[13px] font-semibold"><AlertCircle size={16} /> Action Required</div>
                  <div className="text-[12px] text-amber-700/80 mt-2 leading-[1.5]">Add Management, Governing Council and Principal message to reach 100% profile completion and get higher visibility.</div>
                </div>
              </div>

              {/* Content builder demo */}
              <div className="rounded-[24px] bg-white border p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Home Page Sections • Drag to reorder</h3>
                  <button className="h-9 px-4 rounded-full bg-zinc-900 text-white text-[12px] font-semibold flex items-center gap-1.5"><Plus size={14} /> Add Section</button>
                </div>
                <div className="mt-6 space-y-3">
                  {[
                    { name: "Hero Section", status: "Published", type: "System" },
                    { name: "Quick Info Cards", status: "Published", type: "System" },
                    { name: "About College", status: "Published", type: "Content" },
                    { name: "Principal Message", status: "Published", type: "Content" },
                    { name: "Departments", status: "Published", type: "Dynamic" },
                    { name: "Featured Courses", status: "Published", type: "Dynamic" },
                    { name: "Campus Facilities", status: "Draft", type: "Content" },
                    { name: "Centre for Excellence in AI", status: "Published", type: "Custom" },
                  ].map((sec,i)=>(
                    <div key={i} className="group flex items-center gap-3 p-4 rounded-[14px] border bg-zinc-50/50 hover:bg-white hover:shadow-sm transition-all">
                      <GripVertical size={16} className="text-zinc-400 cursor-grab" />
                      <div className="h-9 w-9 rounded-[10px] bg-white border grid place-items-center text-zinc-600"><FileText size={16} /></div>
                      <div className="flex-1">
                        <div className="font-medium text-[13px]">{sec.name}</div>
                        <div className="text-[11px] text-zinc-500">{sec.type} • Last edited 2h ago</div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${sec.status==='Published'?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-amber-50 text-amber-700 border-amber-200'}`}>{sec.status}</span>
                      <button className="h-8 w-8 rounded-full bg-white border grid place-items-center hover:bg-zinc-50"><Edit3 size={14} /></button>
                      <button className="h-8 w-8 rounded-full bg-white border grid place-items-center hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection==='branding' && (
            <div className="space-y-8">
              <div className="rounded-[24px] bg-white border p-8">
                <h3 className="font-display text-[22px] font-semibold">College Branding System</h3>
                <p className="text-[13px] text-zinc-500 mt-2">Every college has its own visual identity while using same platform design system. No custom CSS/JS allowed.</p>

                <div className="mt-8 grid lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div>
                      <label className="text-[12px] font-bold tracking-wide uppercase">College Name</label>
                      <input defaultValue={college.name} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-zinc-50 border text-[14px] outline-none focus:border-zinc-900" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[12px] font-bold tracking-wide uppercase">Short Name</label>
                        <input defaultValue={college.shortName} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-zinc-50 border text-[14px]" />
                      </div>
                      <div>
                        <label className="text-[12px] font-bold tracking-wide uppercase">Established</label>
                        <input defaultValue={college.established} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-zinc-50 border text-[14px]" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[12px] font-bold tracking-wide uppercase">Tagline</label>
                      <input defaultValue={college.tagline} className="mt-2 w-full h-12 px-4 rounded-[12px] bg-zinc-50 border text-[14px]" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-[12px] font-bold tracking-wide uppercase">Primary Color</label>
                        <div className="mt-2 flex gap-2">
                          <input type="color" defaultValue={college.branding.colors.primary} className="h-12 w-12 rounded-[12px] border" />
                          <input defaultValue={college.branding.colors.primary} className="flex-1 h-12 px-3 rounded-[12px] bg-zinc-50 border text-[13px]" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[12px] font-bold tracking-wide uppercase">Secondary</label>
                        <div className="mt-2 flex gap-2">
                          <input type="color" defaultValue={college.branding.colors.secondary} className="h-12 w-12 rounded-[12px] border" />
                          <input defaultValue={college.branding.colors.secondary} className="flex-1 h-12 px-3 rounded-[12px] bg-zinc-50 border text-[13px]" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[12px] font-bold tracking-wide uppercase">Accent</label>
                        <div className="mt-2 flex gap-2">
                          <input type="color" defaultValue={college.branding.colors.accent} className="h-12 w-12 rounded-[12px] border" />
                          <input defaultValue={college.branding.colors.accent} className="flex-1 h-12 px-3 rounded-[12px] bg-zinc-50 border text-[13px]" />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[12px] font-bold tracking-wide uppercase">College Logo</label>
                        <div className="mt-2 rounded-[12px] border border-dashed p-6 text-center">
                          <img src={branding.logo} className="h-16 w-16 rounded-[12px] mx-auto object-cover" />
                          <button className="mt-3 h-8 px-4 rounded-full bg-zinc-900 text-white text-[12px] font-semibold inline-flex items-center gap-1"><Upload size={14} /> Upload New</button>
                        </div>
                      </div>
                      <div>
                        <label className="text-[12px] font-bold tracking-wide uppercase">Hero Image</label>
                        <div className="mt-2 rounded-[12px] border border-dashed overflow-hidden">
                          <img src={branding.heroImage} className="h-[88px] w-full object-cover" />
                          <div className="p-2 text-center"><button className="h-7 px-3 rounded-full bg-zinc-100 text-[11px] font-semibold">Change</button></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[12px] font-bold tracking-wide uppercase">Theme Presets • Professional layouts</label>
                    <div className="mt-3 grid gap-3">
                      {Object.entries(themePresets).map(([key, preset])=>(
                        <button
                          key={key}
                          onClick={()=>setSelectedPreset(key)}
                          className={`text-left p-4 rounded-[16px] border-2 transition-all ${selectedPreset===key?'border-zinc-900 bg-zinc-900 text-white shadow-lg':'bg-white border-zinc-200 hover:border-zinc-300'}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-semibold text-[14px]">{preset.name}</div>
                            <div className="flex gap-1">
                              <span className="h-5 w-5 rounded-full border-2 border-white shadow" style={{ background: preset.colors.primary }} />
                              <span className="h-5 w-5 rounded-full border-2 border-white shadow -ml-1" style={{ background: preset.colors.accent }} />
                            </div>
                          </div>
                          <div className={`text-[12px] mt-1 ${selectedPreset===key?'text-white/70':'text-zinc-500'}`}>{preset.description} • {preset.category}</div>
                        </button>
                      ))}
                    </div>

                    <div className="mt-8 rounded-[16px] bg-amber-50 border border-amber-200 p-4">
                      <div className="text-[12px] font-bold uppercase tracking-wide text-amber-800">Security Note</div>
                      <div className="text-[12px] leading-[1.5] text-amber-700 mt-1">College admins can only configure approved branding fields. Custom CSS/JS is blocked by platform. All changes go through verification workflow: Draft → Preview → Submit → Review → Publish.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection!=='dashboard' && activeSection!=='branding' && (
            <div className="rounded-[24px] bg-white border p-12 text-center">
              <div className="h-16 w-16 rounded-[20px] bg-zinc-50 border grid place-items-center mx-auto text-2xl">🚧</div>
              <h3 className="font-semibold text-[18px] mt-6 capitalize">{activeSection} CMS Module</h3>
              <p className="text-[13px] text-zinc-500 mt-2 max-w-[420px] mx-auto leading-[1.6]">
                This CMS module allows college admin (college_id: 101) to manage {activeSection}. 
                All data is isolated by college_id — PSG admin can never access CIT or KCT data. 
                Role-based access: COLLEGE_ADMIN, COLLEGE_EDITOR. Features: Add, Edit, Delete, Reorder, Draft, Preview, Publish.
              </p>
              <div className="mt-6 inline-flex gap-2">
                <button className="h-10 px-5 rounded-full bg-zinc-900 text-white text-[13px] font-semibold">+ Add New</button>
                <button className="h-10 px-5 rounded-full bg-zinc-50 border text-[13px] font-semibold">Import Data</button>
              </div>
              <div className="mt-8 grid md:grid-cols-3 gap-3 text-left max-w-[700px] mx-auto">
                {[
                  { title: "Drag & Drop Reordering", desc: "Reorder sections with handle" },
                  { title: "Multi-tenant Security", desc: "college_id isolation enforced" },
                  { title: "Verification Workflow", desc: "Draft → Preview → Publish" },
                ].map(f=>(
                  <div key={f.title} className="rounded-[14px] bg-zinc-50 border p-4">
                    <div className="font-semibold text-[12px]">{f.title}</div>
                    <div className="text-[11px] text-zinc-500 mt-1">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
