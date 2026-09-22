import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../api.js';
import { useAsync, useSocketEvent, useToast } from '../../hooks.jsx';
import { CollegeCard } from '../../components/college.jsx';
import { Checkbox, EmptyState, ErrorBox, Field, Layout, Loader, Select, FilterInput } from '../../components/ui.jsx';
import { compact } from '../../lib/format.js';

const SORTS = [
  { value: 'featured', label: 'Recommended' },
  { value: 'seats', label: 'Most seats available' },
  { value: 'package', label: 'Highest package' },
  { value: 'name', label: 'College name (A–Z)' },
  { value: 'newest', label: 'Recently updated' },
];

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const meta = useAsync(() => api.meta(), []);

  const filters = useMemo(
    () => ({
      q: params.get('q') || '',
      state: params.get('state') || '',
      city: params.get('city') || '',
      type: params.get('type') || '',
      level: params.get('level') || '',
      admission_status: params.get('admission_status') || '',
      hostel: params.get('hostel') === 'true',
      sort: params.get('sort') || 'featured',
      page: Number(params.get('page') || 1),
      limit: 9,
    }),
    [params],
  );

  const results = useAsync(() => api.colleges({ ...filters, hostel: filters.hostel ? 'true' : '' }), [params.toString()]);
  const [rows, setRows] = useState([]);
  const flashUntil = useRef(0);
  const reloadTimer = useRef();

  useEffect(() => {
    if (results.data?.rows) setRows(results.data.rows);
  }, [results.data]);

  const setFilter = useCallback(
    (key, value) => {
      const next = new URLSearchParams(params);
      if (value === '' || value === false || value === undefined) next.delete(key);
      else next.set(key, value === true ? 'true' : value);
      if (key !== 'page') next.delete('page');
      setParams(next, { replace: true });
    },
    [params, setParams],
  );

  // live refreshes when a college changes seats or profile data
  const scheduleReload = useCallback(() => {
    clearTimeout(reloadTimer.current);
    reloadTimer.current = setTimeout(() => results.reload(), 700);
  }, [results]);

  useSocketEvent('seats:changed', (payload) => {
    setRows((list) =>
      list.map((college) =>
        college.id === payload.collegeId
          ? { ...college, seats_filled: college.seats_filled + (payload.filled - (college.__lastFilled?.[payload.courseId] ?? payload.filled)), __lastFilled: { ...(college.__lastFilled || {}), [payload.courseId]: payload.filled } }
          : college,
      ),
    );
    if (Date.now() > flashUntil.current) {
      flashUntil.current = Date.now() + 8000;
      toast.live(`${payload.collegeName}: ${payload.courseName} → ${payload.available} seats available`);
    }
    scheduleReload();
  });

  useSocketEvent('college:data-changed', scheduleReload);

  const clearAll = () => setParams(new URLSearchParams(), { replace: true });
  const activeCount = ['q', 'state', 'city', 'type', 'level', 'admission_status'].filter((k) => filters[k]).length + (filters.hostel ? 1 : 0);

  return (
    <Layout>
      <section className="section-tight" style={{ background: '#fff', borderBottom: '1px solid var(--line)', paddingBottom: '1.6rem' }}>
        <div className="container" style={{ paddingTop: '1.4rem' }}>
          <div className="section-head" style={{ marginBottom: '1rem' }}>
            <div>
              <div className="eyebrow">Explore colleges</div>
              <h1 style={{ fontSize: '1.8rem' }}>Search {compact(results.data?.stats?.colleges || 0)} live college profiles</h1>
              <p className="muted" style={{ margin: 0 }}>
                Filters search college details and their courses — results update live as colleges change their data.
              </p>
            </div>
            <span className="badge badge-green">
              <span className="dot dot-live" /> Live · {results.data?.total ?? 0} matching
            </span>
          </div>

          <div className="card card-pad">
            <div className="form-grid">
              <Field label="Search">
                <FilterInput value={filters.q} onChange={(v) => setFilter('q', v)} placeholder="College, course, city…" delay={400} />
              </Field>
              <Field label="State">
                <Select value={filters.state} onChange={(v) => setFilter('state', v)} placeholder="All states" options={meta.data?.states || []} />
              </Field>
              <Field label="City">
                <Select value={filters.city} onChange={(v) => setFilter('city', v)} placeholder="All cities" options={meta.data?.cities || []} />
              </Field>
              <Field label="Institution type">
                <Select value={filters.type} onChange={(v) => setFilter('type', v)} placeholder="Any type" options={meta.data?.types || []} />
              </Field>
              <Field label="Course level">
                <Select value={filters.level} onChange={(v) => setFilter('level', v)} placeholder="Any level" options={meta.data?.levels || []} />
              </Field>
              <Field label="Admission status">
                <Select
                  value={filters.admission_status}
                  onChange={(v) => setFilter('admission_status', v)}
                  placeholder="Any status"
                  options={meta.data?.statuses || []}
                />
              </Field>
              <Field label="Sort by">
                <Select value={filters.sort} onChange={(v) => setFilter('sort', v)} options={SORTS} />
              </Field>
              <div className="row" style={{ alignItems: 'flex-end', gap: '1rem' }}>
                <Checkbox checked={filters.hostel} onChange={(v) => setFilter('hostel', v)} label="Hostel available" />
                {activeCount > 0 && (
                  <button className="btn btn-ghost btn-sm" onClick={clearAll}>
                    Clear {activeCount} filter{activeCount > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ErrorBox error={results.error} onRetry={results.reload} />
          {results.loading && rows.length === 0 && <Loader label="Searching colleges…" />}

          {!results.loading && rows.length === 0 && (
            <EmptyState
              icon="🔍"
              title="No colleges matched those filters"
              hint="Try a different course name, remove a filter, or clear the search."
              action={
                <button className="btn btn-outline" onClick={clearAll}>
                  Clear filters
                </button>
              }
            />
          )}

          <div className="grid-auto">
            {rows.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>

          {results.data?.pages > 1 && (
            <div className="row" style={{ justifyContent: 'center', marginTop: '1.6rem' }}>
              <button className="btn btn-outline btn-sm" disabled={filters.page <= 1} onClick={() => setFilter('page', filters.page - 1)}>
                ← Previous
              </button>
              <span className="small muted">
                Page {filters.page} of {results.data.pages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                disabled={filters.page >= results.data.pages}
                onClick={() => setFilter('page', filters.page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
