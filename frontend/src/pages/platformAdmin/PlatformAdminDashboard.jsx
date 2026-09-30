import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Building2, Download, Eye, FileText, GraduationCap, LoaderCircle, MessageCircle, ShieldCheck, Users } from 'lucide-react'

function readAdminSession() {
  try {
    const admin = JSON.parse(localStorage.getItem('tn_platform_admin') || 'null')
    const token = localStorage.getItem('tn_auth_token')
    return token && ['PLATFORM_ADMIN', 'SUPER_ADMIN'].includes(admin?.role) ? { admin, token } : null
  } catch {
    return null
  }
}

async function apiRequest(path, token, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) }
  })
  const body = response.headers.get('content-type')?.includes('application/json')
    ? await response.json()
    : null
  if (!response.ok) throw new Error(body?.error || `Request failed (${response.status})`)
  return body
}

export default function PlatformAdminDashboard() {
  const session = useMemo(readAdminSession, [])
  const [colleges, setColleges] = useState([])
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [stats, setStats] = useState(null)
  const [interest, setInterest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reporting, setReporting] = useState(false)

  const loadDashboard = useCallback(async () => {
    if (!session) return
    setLoading(true)
    setError('')
    try {
      const [dashboard, registeredColleges] = await Promise.all([
        apiRequest('/api/platform-admin/dashboard', session.token),
        apiRequest('/api/platform-admin/colleges', session.token)
      ])
      setStats(dashboard)
      setColleges(Array.isArray(registeredColleges) ? registeredColleges : [])
      setSelectedCollege(current => current || registeredColleges?.[0] || null)
    } catch (loadError) {
      setError(loadError.message || 'Could not load platform analytics.')
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => { loadDashboard() }, [loadDashboard])

  useEffect(() => {
    if (!session || !selectedCollege?.id) {
      setInterest(null)
      return
    }
    let cancelled = false
    apiRequest(`/api/platform-admin/college/${selectedCollege.id}/interest`, session.token)
      .then(value => { if (!cancelled) setInterest(value) })
      .catch(() => { if (!cancelled) setInterest(null) })
    return () => { cancelled = true }
  }, [session, selectedCollege?.id])

  const generateReport = async () => {
    if (!selectedCollege || !session) return
    setReporting(true)
    setError('')
    try {
      const generated = await apiRequest(`/api/platform-admin/college/${selectedCollege.id}/report/generate`, session.token, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ period: 'All time' })
      })
      const report = generated?.report
      if (!report?.file_url) throw new Error('The report was created, but no download URL was returned.')
      const pdf = await fetch(report.file_url, { headers: { Authorization: `Bearer ${session.token}` } })
      if (!pdf.ok) throw new Error('Report created, but PDF download failed.')
      const url = URL.createObjectURL(await pdf.blob())
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = report.file_name || `college-${selectedCollege.id}-report.pdf`
      anchor.click()
      URL.revokeObjectURL(url)
    } catch (reportError) {
      setError(reportError.message || 'Could not generate report.')
    } finally {
      setReporting(false)
    }
  }

  if (!session) return <Navigate to="/login" replace />

  const cards = [
    { label: 'Students', value: stats?.total_students ?? 0, icon: GraduationCap },
    { label: 'Registered colleges', value: stats?.total_colleges ?? 0, icon: Building2 },
    { label: 'College views', value: stats?.total_college_views ?? 0, icon: Eye },
    { label: 'Enquiries', value: stats?.total_enquiries ?? 0, icon: MessageCircle }
  ]

  return (
    <main className="min-h-screen bg-[#E8E2DB] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] bg-[#1A3263] p-6 text-white shadow-lg sm:p-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#FAB95B]"><ShieldCheck size={15} /> Platform administration</div>
            <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Platform overview</h1>
            <p className="mt-2 text-sm text-white/70">Live backend data • College accounts receive aggregate visitor analytics only</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/platform-admin/student-visits" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#FAB95B] px-5 text-sm font-bold text-[#1A3263] hover:brightness-105"><Users size={16} /> Student visit register</Link>
            <button onClick={generateReport} disabled={!selectedCollege || reporting} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50">{reporting ? <LoaderCircle size={16} className="animate-spin" /> : <FileText size={16} />} Generate report</button>
          </div>
        </header>

        {error && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-[20px] border border-[#1A3263]/10 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-[#547792]"><span>{label}</span><Icon size={18} className="text-[#FAB95B]" /></div>
              <div className="mt-2 text-3xl font-bold text-[#1A3263]">{loading ? '—' : Number(value).toLocaleString()}</div>
            </div>
          ))}
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(280px,0.8fr)_minmax(0,1.5fr)]">
          <div className="rounded-[20px] border border-[#1A3263]/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="font-bold text-[#1A3263]">College verification</h2><p className="mt-1 text-xs text-[#547792]">Registered colleges and current status</p></div>
              <button onClick={loadDashboard} aria-label="Refresh dashboard" className="rounded-full border border-[#1A3263]/15 px-3 py-2 text-xs font-semibold text-[#1A3263] hover:border-[#FAB95B]">Refresh</button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-amber-50 p-4"><div className="text-xs text-amber-800">Pending</div><div className="mt-1 text-xl font-bold text-amber-900">{stats?.pending_colleges ?? 0}</div></div>
              <div className="rounded-xl bg-emerald-50 p-4"><div className="text-xs text-emerald-800">Verified</div><div className="mt-1 text-xl font-bold text-emerald-900">{stats?.verified_colleges ?? 0}</div></div>
            </div>
            <div className="mt-4 max-h-[420px] space-y-2 overflow-y-auto">
              {loading ? <div className="py-8 text-center text-sm text-[#547792]">Loading colleges…</div> : colleges.length ? colleges.map(college => {
                const active = selectedCollege?.id === college.id
                return <button key={college.id} onClick={() => setSelectedCollege(college)} className={`w-full rounded-xl border p-3 text-left transition ${active ? 'border-[#FAB95B] bg-amber-50' : 'border-[#1A3263]/10 hover:border-[#547792]/40'}`}>
                  <div className="flex items-start justify-between gap-2"><span className="font-semibold text-[#1A3263]">{college.name}</span><span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${college.verificationStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{college.verificationStatus || 'PENDING'}</span></div>
                  <div className="mt-1 text-xs text-[#547792]">{[college.district, college.city].filter(Boolean).join(' • ') || 'Location not provided'}</div>
                </button>
              }) : <div className="rounded-xl bg-[#E8E2DB]/60 p-5 text-center text-sm text-[#547792]">No college registrations found.</div>}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#1A3263]/10 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div><p className="text-xs font-bold uppercase tracking-wide text-[#547792]">Selected college • aggregate only</p><h2 className="mt-1 text-xl font-bold text-[#1A3263]">{selectedCollege?.name || 'Select a college'}</h2><p className="mt-1 text-sm text-[#547792]">{[selectedCollege?.district, selectedCollege?.city].filter(Boolean).join(' • ')}</p></div>
              {selectedCollege && <button onClick={generateReport} disabled={reporting} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#1A3263] px-4 text-xs font-bold text-[#FAB95B] disabled:opacity-50">{reporting ? <LoaderCircle size={15} className="animate-spin" /> : <Download size={15} />} PDF report</button>}
            </div>
            {selectedCollege ? <>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Unique students viewed', interest?.total_students_viewed ?? 0],
                  ['College views', interest?.total_views ?? 0],
                  ['Course views', interest?.total_course_views ?? 0],
                  ['Enquiries', interest?.total_enquiries ?? 0]
                ].map(([label, value]) => <div key={label} className="rounded-xl bg-[#E8E2DB]/50 p-4"><div className="text-xs text-[#547792]">{label}</div><div className="mt-1 text-xl font-bold text-[#1A3263]">{Number(value).toLocaleString()}</div></div>)}
              </div>
              <div className="mt-5 rounded-xl border border-[#FAB95B]/40 bg-amber-50/50 p-4 text-xs leading-5 text-[#547792]">{interest?.privacy_note || 'Student names and individual visit histories are not exposed to college accounts.'}</div>
            </> : <div className="mt-8 rounded-xl bg-[#E8E2DB]/50 p-8 text-center text-sm text-[#547792]">Choose a registered college to see its aggregate interest.</div>}
          </div>
        </section>

        <section className="mt-5 rounded-[20px] border border-[#FAB95B]/40 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="font-bold text-[#1A3263]">Confidential student visit register</h2><p className="mt-1 text-xs text-[#547792]">Only platform administrators can view student identities and college-by-college visit details.</p></div>
            <Link to="/platform-admin/student-visits" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#FAB95B] px-4 text-xs font-bold text-[#1A3263]"><Users size={15} /> View visit records</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
