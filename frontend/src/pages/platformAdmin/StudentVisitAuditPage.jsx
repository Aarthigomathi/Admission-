import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Download, Eye, LoaderCircle, Search, ShieldCheck, Users } from 'lucide-react'

const PAGE_SIZE = 25

function getAdminSession() {
  try {
    const admin = JSON.parse(localStorage.getItem('tn_platform_admin') || 'null')
    const token = localStorage.getItem('tn_auth_token')
    const allowed = ['PLATFORM_ADMIN', 'SUPER_ADMIN'].includes(admin?.role)
    return allowed && token ? { admin, token } : null
  } catch {
    return null
  }
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

function escapeCsv(value) {
  const text = value == null ? '' : String(value)
  return `"${text.replaceAll('"', '""')}"`
}

export default function StudentVisitAuditPage() {
  const session = useMemo(getAdminSession, [])
  const [colleges, setColleges] = useState([])
  const [rows, setRows] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [collegeId, setCollegeId] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadPage = useCallback(async (pageNumber = page) => {
    if (!session) return
    setLoading(true)
    setError('')
    const params = new URLSearchParams({ page: String(pageNumber), size: String(PAGE_SIZE) })
    if (search) params.set('search', search)
    if (collegeId) params.set('collegeId', collegeId)
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    try {
      const response = await fetch(`/api/platform-admin/student-visits?${params.toString()}`, {
        headers: { Authorization: `Bearer ${session.token}` }
      })
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(body.error || (response.status === 403 ? 'Platform administrator access required.' : 'Could not load visit records.'))
      setRows(Array.isArray(body.content) ? body.content : [])
      setPage(Number(body.page ?? pageNumber))
      setTotalPages(Number(body.total_pages ?? 0))
      setTotalElements(Number(body.total_elements ?? 0))
    } catch (requestError) {
      setRows([])
      setError(requestError.message || 'Could not connect to the backend.')
    } finally {
      setLoading(false)
    }
  }, [session, page, search, collegeId, from, to])

  useEffect(() => {
    if (!session) return
    let cancelled = false
    fetch('/api/platform-admin/colleges', {
      headers: { Authorization: `Bearer ${session.token}` }
    }).then(async response => {
      if (!response.ok) return []
      const body = await response.json()
      return Array.isArray(body) ? body : []
    }).then(items => {
      if (!cancelled) setColleges(items)
    }).catch(() => {
      if (!cancelled) setColleges([])
    })
    return () => { cancelled = true }
  }, [session])

  useEffect(() => {
    loadPage(page)
  }, [loadPage, page])

  const applyFilters = (event) => {
    event.preventDefault()
    setPage(0)
    setSearch(searchInput.trim())
  }

  const exportCurrentPage = () => {
    const headers = ['student_id', 'student_name', 'student_email', 'student_phone', 'student_address', 'student_district', 'student_city', 'education_level', 'college_id', 'college_name', 'college_district', 'college_views', 'course_views', 'total_views', 'last_visited_at']
    const lines = [headers.join(','), ...rows.map(row => headers.map(key => escapeCsv(row[key])).join(','))]
    const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `student-college-visits-page-${page + 1}.csv`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  if (!session) return <Navigate to="/login" replace />

  return (
    <main className="min-h-screen bg-[#E8E2DB] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1500px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <Link to="/platform-admin" className="inline-flex h-10 items-center gap-2 rounded-full border border-[#1A3263]/15 bg-white px-4 text-sm font-semibold text-[#1A3263] hover:border-[#FAB95B]">
            <ArrowLeft size={16} /> Admin dashboard
          </Link>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1A3263] px-4 py-2 text-xs font-semibold text-white">
            <ShieldCheck size={15} className="text-[#FAB95B]" /> Platform-admin private data
          </div>
        </div>

        <section className="rounded-[24px] bg-[#1A3263] p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#FAB95B]">Confidential • Platform administrators only</p>
              <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Student college visits</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/75">See which registered colleges each student viewed, with visit totals and the latest visit time. College accounts receive aggregate analytics only.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
              <div className="flex items-center gap-2 text-xs text-white/70"><Users size={15} /> Matching student-college records</div>
              <div className="mt-1 text-2xl font-bold text-[#FAB95B]">{totalElements.toLocaleString()}</div>
            </div>
          </div>
        </section>

        <form onSubmit={applyFilters} className="mt-5 grid gap-3 rounded-[20px] border border-[#1A3263]/10 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-[minmax(220px,1.4fr)_minmax(180px,1fr)_170px_170px_auto] xl:items-end">
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#1A3263]">Find student</span>
            <span className="flex h-11 items-center gap-2 rounded-xl border border-[#1A3263]/15 px-3 focus-within:border-[#FAB95B]">
              <Search size={16} className="shrink-0 text-[#547792]" />
              <input value={searchInput} onChange={event => setSearchInput(event.target.value)} placeholder="Name, email, or phone" className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#1A3263]">College</span>
            <select value={collegeId} onChange={event => { setCollegeId(event.target.value); setPage(0) }} className="h-11 w-full rounded-xl border border-[#1A3263]/15 bg-white px-3 text-sm text-[#1A3263] outline-none focus:border-[#FAB95B]">
              <option value="">All registered colleges</option>
              {colleges.map(college => <option key={college.id} value={college.id}>{college.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#1A3263]">From</span>
            <span className="flex h-11 items-center gap-2 rounded-xl border border-[#1A3263]/15 px-3">
              <CalendarDays size={15} className="text-[#547792]" />
              <input type="date" value={from} onChange={event => { setFrom(event.target.value); setPage(0) }} className="min-w-0 bg-transparent text-sm outline-none" />
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-bold text-[#1A3263]">To</span>
            <span className="flex h-11 items-center gap-2 rounded-xl border border-[#1A3263]/15 px-3">
              <CalendarDays size={15} className="text-[#547792]" />
              <input type="date" value={to} onChange={event => { setTo(event.target.value); setPage(0) }} className="min-w-0 bg-transparent text-sm outline-none" />
            </span>
          </label>
          <button type="submit" className="h-11 rounded-xl bg-[#FAB95B] px-5 text-sm font-bold text-[#1A3263] hover:brightness-95">Apply filters</button>
        </form>

        <section className="mt-5 overflow-hidden rounded-[20px] border border-[#1A3263]/10 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1A3263]/10 px-5 py-4">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-[#1A3263]"><Eye size={18} className="text-[#FAB95B]" /> Visit register</h2>
              <p className="mt-1 text-xs text-[#547792]">Student details are visible here only to authenticated platform admins.</p>
            </div>
            <button type="button" onClick={exportCurrentPage} disabled={!rows.length} className="inline-flex h-10 items-center gap-2 rounded-full border border-[#1A3263]/15 px-4 text-xs font-bold text-[#1A3263] enabled:hover:border-[#FAB95B] disabled:cursor-not-allowed disabled:opacity-40">
              <Download size={14} /> Export this page
            </button>
          </div>

          {error && <div role="alert" className="m-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] border-collapse text-left">
              <thead className="bg-[#1A3263] text-white">
                <tr>{['Student', 'Contact & location', 'Education', 'College visited', 'Views', 'Last visited'].map(label => <th key={label} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#FAB95B]">{label}</th>)}</tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="px-4 py-14 text-center text-sm text-[#547792]"><span className="inline-flex items-center gap-2"><LoaderCircle size={17} className="animate-spin" /> Loading private visit records…</span></td></tr>
                ) : rows.length ? rows.map(row => (
                  <tr key={`${row.student_id}-${row.college_id}`} className="border-b border-[#E8E2DB] align-top last:border-0 hover:bg-[#E8E2DB]/30">
                    <td className="px-4 py-4"><div className="font-bold text-[#1A3263]">{row.student_name || 'Student'}</div><div className="mt-1 text-xs text-[#547792]">ID {row.student_id}</div></td>
                    <td className="px-4 py-4 text-xs leading-5 text-[#1A3263]"><div>{row.student_email || '—'}</div><div>{row.student_phone || '—'}</div><div className="text-[#547792]">{[row.student_address, row.student_city, row.student_district].filter(Boolean).join(', ') || '—'}</div></td>
                    <td className="px-4 py-4 text-xs leading-5 text-[#1A3263]"><div>{row.education_level || '—'}</div><div className="text-[#547792]">{row.education_group_stream || row.education_school_college || '—'}</div><div className="text-[#547792]">{row.education_percentage || row.education_marks || ''}</div></td>
                    <td className="px-4 py-4"><div className="font-semibold text-[#1A3263]">{row.college_name}</div><div className="mt-1 text-xs text-[#547792]">{[row.college_district, row.college_slug].filter(Boolean).join(' • ')}</div></td>
                    <td className="px-4 py-4 text-xs leading-5 text-[#1A3263]"><div><strong>{row.total_views}</strong> total</div><div className="text-[#547792]">College {row.college_views} • Courses {row.course_views}</div></td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-[#547792]">{formatDate(row.last_visited_at)}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="px-4 py-14 text-center text-sm text-[#547792]">{error ? 'No records loaded.' : 'No student visits match these filters.'}</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1A3263]/10 px-5 py-4">
            <span className="text-xs text-[#547792]">Page {totalPages ? page + 1 : 0} of {totalPages} • {totalElements.toLocaleString()} records</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPage(value => Math.max(0, value - 1))} disabled={page <= 0 || loading} className="inline-flex h-9 items-center gap-1 rounded-full border border-[#1A3263]/15 px-4 text-xs font-semibold text-[#1A3263] disabled:opacity-40"><ChevronLeft size={15} /> Previous</button>
              <button type="button" onClick={() => setPage(value => Math.min(totalPages - 1, value + 1))} disabled={loading || page + 1 >= totalPages} className="inline-flex h-9 items-center gap-1 rounded-full border border-[#1A3263]/15 px-4 text-xs font-semibold text-[#1A3263] disabled:opacity-40">Next <ChevronRight size={15} /></button>
            </div>
          </div>
        </section>
        <p className="mx-auto mt-4 max-w-4xl text-center text-[11px] leading-5 text-[#547792]">This register is confidential. Colleges receive aggregate analytics only; do not download or share student-level data except for an authorized platform-administration purpose.</p>
      </div>
    </main>
  )
}
