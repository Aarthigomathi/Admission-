import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles, GraduationCap, MapPin, Target, Building2, BadgeCheck, Home,
  AlertTriangle, SlidersHorizontal, ArrowUpRight, Trophy, Info,
} from 'lucide-react'
import { recommendColleges } from '../../lib/recommender'
import { districts } from '../../lib/colleges'

const REASON_ICONS = {
  graduation: GraduationCap,
  mapPin: MapPin,
  target: Target,
  building: Building2,
  badge: BadgeCheck,
  home: Home,
  alert: AlertTriangle,
}

const COURSE_SUGGESTIONS = [
  'B.E Computer Science',
  'B.Tech Artificial Intelligence & Data Science',
  'B.E Mechanical Engineering',
  'B.E Electronics & Communication',
  'BCA',
  'B.Sc Computer Science',
  'MBA',
  'M.E Computer Science',
]

export default function SmartRecommendations({ student, colleges, onUpdateStudent }) {
  const [showEditor, setShowEditor] = useState(false)
  const [prefs, setPrefs] = useState({
    percentage: student?.percentage || '',
    preferredDistrict: student?.preferredDistrict || student?.district || 'Coimbatore',
    interestedCourse: student?.interestedCourse || '',
    groupStream: student?.groupStream || '',
    collegeType: student?.collegeType || 'Any',
    hostelRequired: student?.hostelRequired || 'No',
  })
  const [saved, setSaved] = useState(false)

  const recommendations = useMemo(
    () => recommendColleges(prefs, colleges).slice(0, 6),
    [prefs, colleges]
  )

  const set = (key, value) => { setPrefs(p => ({ ...p, [key]: value })); setSaved(false) }

  const savePrefs = () => {
    if (!student) return
    const updated = { ...student, ...prefs }
    try {
      localStorage.setItem('tn_current_student', JSON.stringify(updated))
      const arr = JSON.parse(localStorage.getItem('tn_students') || '[]')
      const i = arr.findIndex(x => x.email === student.email)
      if (i >= 0) {
        arr[i] = { ...arr[i], ...prefs }
        localStorage.setItem('tn_students', JSON.stringify(arr))
      }
    } catch { /* storage full - preferences still active for this session */ }
    onUpdateStudent?.(updated)
    setSaved(true)
    setShowEditor(false)
  }

  const inputCls = 'h-10 w-full rounded-full border-2 border-[#E8E2DB] bg-white px-4 text-[13px] font-medium text-[#1A3263] outline-none focus:border-[#FAB95B]'
  const labelCls = 'text-[10px] font-bold uppercase tracking-wide text-[#547792]'

  return (
    <div>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-display text-[22px] font-bold text-[#1A3263] flex items-center gap-2">
          <Sparkles size={20} className="text-[#FAB95B]" />
          Smart Recommendations — Why Each College Is Shown
        </h2>
        <button
          onClick={() => setShowEditor(s => !s)}
          className="h-9 px-4 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px] inline-flex items-center gap-1.5 border-2 border-[#1A3263] hover:bg-[#547792] transition-colors"
        >
          <SlidersHorizontal size={14} /> {showEditor ? 'Close Preferences' : 'Edit My Preferences'}
        </button>
      </div>
      <p className="text-[12px] text-[#547792] mt-1">
        Ranked by your marks vs typical cutoff, preferred district, interested course/stream, college type & hostel need — every card explains exactly why it appeared.
      </p>

      {showEditor && (
        <div className="mt-4 rounded-[24px] bg-white border-2 border-[#FAB95B]/40 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal size={16} className="text-[#FAB95B]" />
            <h3 className="font-bold text-[14px] text-[#1A3263]">Your Preferences — recommendations update live</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>12th Marks %</label>
              <input
                type="number" min="0" max="100" step="0.1"
                value={prefs.percentage}
                onChange={e => set('percentage', e.target.value)}
                placeholder="e.g. 88"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Preferred District</label>
              <select value={prefs.preferredDistrict} onChange={e => set('preferredDistrict', e.target.value)} className={inputCls}>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Interested Course</label>
              <input
                list="course-suggestions"
                value={prefs.interestedCourse}
                onChange={e => set('interestedCourse', e.target.value)}
                placeholder="e.g. B.E Computer Science"
                className={inputCls}
              />
              <datalist id="course-suggestions">
                {COURSE_SUGGESTIONS.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label className={labelCls}>Stream (12th Group)</label>
              <input
                value={prefs.groupStream}
                onChange={e => set('groupStream', e.target.value)}
                placeholder="e.g. Computer Science"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>College Type</label>
              <select value={prefs.collegeType} onChange={e => set('collegeType', e.target.value)} className={inputCls}>
                <option value="Any">Any</option>
                <option value="Govt">Government</option>
                <option value="Private">Private</option>
                <option value="Autonomous">Autonomous</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Hostel Needed</label>
              <select value={prefs.hostelRequired} onChange={e => set('hostelRequired', e.target.value)} className={inputCls}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <button onClick={savePrefs} className="h-10 px-6 rounded-full bg-[#FAB95B] text-[#1A3263] font-bold text-[13px] border-2 border-[#FAB95B] hover:bg-[#FAB95B]/90">
              Save to My Profile
            </button>
            {saved && <span className="text-[12px] font-bold text-emerald-600">Saved ✓</span>}
            <span className="text-[11px] text-[#547792] flex items-center gap-1"><Info size={12} /> Cutoffs are typical TNEA-style demo estimates.</span>
          </div>
        </div>
      )}

      {colleges.length === 0 ? (
        <div className="mt-6 rounded-[20px] bg-white border-2 border-[#FAB95B]/30 p-10 text-center">
          <div className="font-bold text-[#1A3263] mt-2">No Colleges Yet</div>
          <div className="text-[12px] text-[#547792] mt-2 max-w-[400px] mx-auto">Recommendations appear as soon as college data is available.</div>
          <Link to="/college/signup" className="mt-4 inline-flex h-10 px-5 rounded-full bg-[#1A3263] text-[#FAB95B] font-bold text-[12px]">Invite College to Sign Up</Link>
        </div>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {recommendations.map((rec, i) => {
            const c = rec.college
            const isTop = i === 0
            return (
              <div key={c.id} className={`relative rounded-[24px] bg-white border-2 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${isTop ? 'border-[#FAB95B]' : 'border-[#E8E2DB]'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 min-w-0">
                    <img
                      src={c.branding?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=1A3263&color=FAB95B&size=96`}
                      className="h-12 w-12 rounded-[12px] object-cover border-2 border-[#E8E2DB] bg-white shrink-0"
                      alt={`${c.name} logo`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {isTop && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAB95B] text-[#1A3263] text-[10px] font-bold">
                            <Trophy size={10} /> BEST MATCH
                          </span>
                        )}
                        {(c.verified || c.verificationStatus === 'VERIFIED') && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1A3263] text-[#FAB95B] text-[10px] font-bold">
                            <BadgeCheck size={10} /> VERIFIED
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-[15px] leading-tight text-[#1A3263] mt-1 truncate">{c.name}</div>
                      <div className="text-[11px] text-[#547792] flex items-center gap-1 mt-0.5">
                        <MapPin size={11} /> {c.city || c.district}, {c.district} • Est. {c.established}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className={`font-display text-[24px] font-bold leading-none ${rec.matchScore >= 70 ? 'text-[#1A3263]' : rec.matchScore >= 40 ? 'text-[#547792]' : 'text-[#B45309]'}`}>
                      {rec.matchScore}%
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-wide text-[#547792]">match</div>
                  </div>
                </div>

                <div className="mt-3 h-[8px] w-full rounded-full bg-[#E8E2DB] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#1A3263] via-[#547792] to-[#FAB95B]"
                    style={{ width: `${rec.matchScore}%` }}
                  />
                </div>

                <div className="mt-4">
                  <div className="text-[10px] font-bold uppercase tracking-wide text-[#547792] flex items-center gap-1">
                    <Sparkles size={11} className="text-[#FAB95B]" /> Why this is shown
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {rec.reasons.length === 0 && (
                      <span className="text-[11px] text-[#547792]">Set your preferences above to see match reasons.</span>
                    )}
                    {rec.reasons.slice(0, 4).map((r, j) => {
                      const Icon = REASON_ICONS[r.icon] || Info
                      const isWarning = r.type === 'warning'
                      return (
                        <span
                          key={j}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-semibold border ${isWarning
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-[#FAB95B]/15 border-[#FAB95B]/30 text-[#1A3263]'}`}
                        >
                          <Icon size={11} className={isWarning ? 'text-red-500' : 'text-[#1A3263]'} /> {r.label}
                        </span>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t-2 border-[#E8E2DB] pt-3 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full bg-[#E8E2DB] text-[#1A3263] text-[10.5px] font-bold border border-[#E8E2DB]">
                      Typical cutoff ~{rec.cutoff}%
                    </span>
                    {rec.eligible === true && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 text-[10.5px] font-bold">Eligible ✓</span>
                    )}
                    {rec.eligible === false && (
                      <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10.5px] font-bold">Below cutoff</span>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-white border border-[#E8E2DB] text-[#547792] text-[10.5px] font-bold">
                      {(c.courses || []).length} courses
                    </span>
                  </div>
                  <Link
                    to={`/college/${c.slug}`}
                    className="h-8 px-4 rounded-full bg-[#1A3263] text-[#FAB95B] text-[11px] font-bold inline-flex items-center gap-1 hover:bg-[#547792] transition-colors"
                  >
                    View College <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
