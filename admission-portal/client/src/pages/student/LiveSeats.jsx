import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import { useAsync, useSocketEvent, useToast } from '../../hooks.jsx';
import { EnquiryModal } from '../../components/college.jsx';
import { EmptyState, ErrorBox, Field, Layout, Loader, Select, FilterInput, StatCard } from '../../components/ui.jsx';
import { compact, dateLabel, statusBadgeClass } from '../../lib/format.js';

export default function LiveSeats() {
  const toast = useToast();
  const meta = useAsync(() => api.meta(), []);
  const [filters, setFilters] = useState({ q: '', level: '', state: '' });
  const [rows, setRows] = useState([]);
  const [flash, setFlash] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [enquiry, setEnquiry] = useState(null);
  const pending = useRef(new Map());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.liveSeats({ limit: 200 });
      setRows(data.rows || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useSocketEvent('seats:changed', (payload) => {
    setRows((list) =>
      list.map((row) => (row.course_id === payload.courseId ? { ...row, available: payload.available, filled_seats: payload.filled, admission_status: payload.admissionStatus } : row)),
    );
    setFlash(payload.courseId);
    setTimeout(() => setFlash(null), 1600);
    const key = `${payload.collegeId}:${payload.courseId}`;
    const last = pending.current.get(key) || 0;
    if (Date.now() - last > 15_000) {
      pending.current.set(key, Date.now());
      toast.live(`${payload.collegeName} · ${payload.courseName}: ${payload.available} seats available`);
    }
  });

  const visible = rows.filter((row) => {
    if (onlyAvailable && row.available <= 0) return false;
    if (filters.level && row.level !== filters.level) return false;
    if (filters.state && row.state !== filters.state) return false;
    if (filters.q) {
      const hay = `${row.course_name} ${row.college_name} ${row.city} ${row.state}`.toLowerCase();
      if (!hay.includes(filters.q.toLowerCase())) return false;
    }
    return true;
  });

  const totals = visible.reduce(
    (acc, row) => ({
      intake: acc.intake + (row.intake_seats || 0),
      filled: acc.filled + (row.filled_seats || 0),
      available: acc.available + (row.available || 0),
    }),
    { intake: 0, filled: 0, available: 0 },
  );

  return (
    <Layout>
      <section className="section-tight" style={{ background: '#fff', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ paddingTop: '1.6rem' }}>
          <div className="section-head">
            <div>
              <div className="eyebrow">Realtime</div>
              <h1 style={{ fontSize: '1.8rem' }}>
                <span className="dot dot-live" style={{ display: 'inline-block', marginRight: 10 }} />
                Live seat availability
              </h1>
              <p className="muted" style={{ margin: 0 }}>
                Every seat update made by a college appears here instantly — no refresh needed.
              </p>
            </div>
            <Link className="btn btn-outline" to="/colleges">
              Browse colleges
            </Link>
          </div>

          <div className="grid-4" style={{ marginTop: '1rem' }}>
            <StatCard label="Courses tracked" value={visible.length} icon="🎓" />
            <StatCard label="Sanctioned intake" value={compact(totals.intake)} icon="🪑" />
            <StatCard label="Seats filled" value={compact(totals.filled)} icon="✅" />
            <StatCard label="Seats available" value={compact(totals.available)} icon="📣" tone="var(--green-soft)" sub="updated live" />
          </div>

          <div className="card card-pad" style={{ marginTop: '1rem' }}>
            <div className="form-grid-3">
              <Field label="Search course or college">
                <FilterInput value={filters.q} onChange={(v) => setFilters((f) => ({ ...f, q: v }))} placeholder="e.g. computer science" />
              </Field>
              <Field label="State">
                <Select value={filters.state} onChange={(v) => setFilters((f) => ({ ...f, state: v }))} placeholder="All states" options={meta.data?.states || []} />
              </Field>
              <Field label="Level">
                <Select value={filters.level} onChange={(v) => setFilters((f) => ({ ...f, level: v }))} placeholder="All levels" options={meta.data?.levels || []} />
              </Field>
            </div>
            <div className="row" style={{ marginTop: '0.6rem' }}>
              <label className="checkbox">
                <input type="checkbox" checked={onlyAvailable} onChange={(e) => setOnlyAvailable(e.target.checked)} />
                <span>Show only courses with seats available</span>
              </label>
              <div className="spacer" />
              <button className="btn btn-outline btn-sm" onClick={load} disabled={loading}>
                {loading ? 'Refreshing…' : 'Refresh now'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingBottom: '3rem' }}>
        <div className="container">
          <ErrorBox error={error} onRetry={load} />
          {loading && !rows.length && <Loader label="Loading seat data…" />}
          {!loading && !visible.length && <EmptyState icon="🪑" title="No courses match those filters" hint="Try clearing the search or level filter." />}

          {visible.length > 0 && (
            <div className="card" style={{ marginTop: '1.2rem' }}>
              <div className="seat-row" style={{ background: '#f8fafc', borderBottom: '1px solid var(--line)' }}>
                <div className="stat-label">Course &amp; college</div>
                <div className="center stat-label">Intake</div>
                <div className="center stat-label">Filled</div>
                <div className="center stat-label">Available</div>
                <div className="center stat-label">Status</div>
                <div className="right stat-label">Action</div>
              </div>
              {visible.map((row) => {
                const tone = row.available <= 0 ? 'danger' : row.available / (row.intake_seats || 1) <= 0.15 ? 'warn' : '';
                return (
                  <div className={`seat-row${flash === row.course_id ? ' flash' : ''}`} key={`${row.college_id}-${row.course_id}`}>
                    <div>
                      <b>{row.course_name}</b>
                      <div className="small muted">
                        <Link to={`/colleges/${row.college_slug}?tab=courses`}>{row.college_name}</Link>
                        {row.city ? ` · ${row.city}` : ''} {row.state ? `, ${row.state}` : ''}
                      </div>
                      <div className={`seat-bar ${tone}`}>
                        <span style={{ width: `${row.intake_seats ? Math.min(100, (row.filled_seats / row.intake_seats) * 100) : 0}%` }} />
                      </div>
                    </div>
                    <div className="center mono">{row.intake_seats}</div>
                    <div className="center mono">{row.filled_seats}</div>
                    <div className="center mono" style={{ color: row.available > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                      {row.available}
                    </div>
                    <div className="center">
                      <span className={`badge ${statusBadgeClass(row.admission_status)}`}>{row.admission_status}</span>
                      {row.application_deadline && <div className="small muted">by {dateLabel(row.application_deadline)}</div>}
                    </div>
                    <div className="right">
                      <button className="btn btn-sm btn-outline" onClick={() => setEnquiry(row)}>
                        Enquire
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {enquiry && (
        <EnquiryModal
          college={{ id: enquiry.college_id, name: enquiry.college_name, email: 'admission office', phone: '' }}
          course={{ id: enquiry.course_id, name: enquiry.course_name }}
          onClose={() => setEnquiry(null)}
        />
      )}
    </Layout>
  );
}
