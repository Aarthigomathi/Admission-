import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api.js';
import { useAsync, useSocketEvent, useToast } from '../../hooks.jsx';
import { CollegeCard } from '../../components/college.jsx';
import { EmptyState, Layout, LiveFeed, SearchBox, Loader } from '../../components/ui.jsx';
import { compact, timeAgo } from '../../lib/format.js';

export default function Home() {
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const stats = useAsync(() => api.stats(), []);
  const featured = useAsync(() => api.colleges({ sort: 'featured', limit: 6 }), []);
  const newest = useAsync(() => api.colleges({ sort: 'newest', limit: 3 }), []);
  const recruiters = useAsync(() => api.topRecruiters(14), []);
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    api.liveSeats({ limit: 8 }).then((d) => setSeats(d.rows || [])).catch(() => {});
  }, []);

  useSocketEvent('stats:updated', (data) => stats.setData(data));
  useSocketEvent('seats:changed', (payload) => {
    setSeats((list) =>
      list.map((row) => (row.course_id === payload.courseId ? { ...row, available: payload.available, filled_seats: payload.filled, admission_status: payload.admissionStatus } : row)),
    );
  });
  useSocketEvent('college:data-changed', (payload) => {
    if (payload?.message) toast.live(payload.message);
  });

  const liveStats = stats.data;

  return (
    <Layout>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="eyebrow" style={{ color: '#8fb8ff' }}>
              Real-time admission portal
            </div>
            <h1>Find the right college and apply — with live seat availability.</h1>
            <p className="lede" style={{ color: '#c7d8ee' }}>
              Every college here publishes and maintains its own complete profile — courses, eligibility, fees, seats,
              placements, hostel, faculty, events and photos. Search, compare and apply in minutes.
            </p>
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder="Search colleges, courses or cities — e.g. computer science in Coimbatore"
              onSubmit={() => navigate(`/colleges?q=${encodeURIComponent(query)}`)}
            />
            <div className="row" style={{ gap: '0.5rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
              {['Computer Science', 'MBA', 'Mechanical', 'Nursing', 'Commerce'].map((tag) => (
                <Link key={tag} className="chip" to={`/colleges?q=${encodeURIComponent(tag)}`}>
                  {tag}
                </Link>
              ))}
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <b>{compact(liveStats?.colleges || 0)}</b>
                <span>Colleges live</span>
              </div>
              <div className="hero-stat">
                <b>{compact(liveStats?.courses || 0)}</b>
                <span>Courses</span>
              </div>
              <div className="hero-stat">
                <b>{compact(liveStats?.seatsAvailable || 0)}</b>
                <span>Seats available</span>
              </div>
              <div className="hero-stat">
                <b>{compact(liveStats?.departments || 0)}</b>
                <span>Departments</span>
              </div>
            </div>
          </div>

          <aside className="hero-panel">
            <LiveFeed limit={8} title="What colleges are updating right now" />
            <div className="row" style={{ gap: '0.5rem', marginTop: '0.8rem' }}>
              <Link className="btn btn-primary btn-sm" to="/colleges">
                Explore colleges
              </Link>
              <Link className="btn btn-outline btn-sm" to="/seats" style={{ background: 'transparent', color: '#eaf1fa', borderColor: 'rgba(255,255,255,0.3)' }}>
                Live seats
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* live seat board */}
      <section className="section-tight">
        <div className="container">
          <div className="card card-pad" style={{ marginTop: '-1.6rem', position: 'relative', zIndex: 2 }}>
            <div className="row-between" style={{ marginBottom: '0.7rem' }}>
              <h3 style={{ margin: 0 }}>
                <span className="dot dot-live" style={{ display: 'inline-block', marginRight: 8 }} />
                Live seat availability
              </h3>
              <Link className="btn btn-outline btn-sm" to="/seats">
                View all seats
              </Link>
            </div>
            {seats.length === 0 && <Loader label="Loading live seats…" />}
            <div className="ticker">
              {seats.map((row) => (
                <Link
                  key={`${row.college_id}-${row.course_id}`}
                  to={`/colleges/${row.college_slug}?tab=courses`}
                  className="card card-pad"
                  style={{ minWidth: 250, textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="small muted truncate">{row.college_name}</div>
                  <b className="clamp-2" style={{ display: 'block', margin: '0.2rem 0' }}>
                    {row.course_name}
                  </b>
                  <div className="row-between">
                    <span className={`badge ${row.available > 0 ? (row.available < 10 ? 'badge-amber' : 'badge-green') : 'badge-red'}`}>
                      {row.available > 0 ? `${row.available} seats left` : 'Full'}
                    </span>
                    <span className="small muted">of {row.intake_seats}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* featured colleges */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Featured institutions</div>
              <h2>Colleges with complete, up-to-date profiles</h2>
              <p>Profile completeness is scored on the data each college maintains — courses, fees, faculty, placements, hostel and media.</p>
            </div>
            <Link className="btn btn-outline" to="/colleges">
              See all colleges
            </Link>
          </div>
          {featured.loading && <Loader />}
          {featured.data?.rows?.length ? (
            <div className="grid-auto">
              {featured.data.rows.map((college) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          ) : (
            !featured.loading && <EmptyState title="No colleges published yet" hint="Colleges appear here as soon as they register and publish their profile." />
          )}
        </div>
      </section>

      {/* how it works */}
      <section className="section" style={{ background: '#fff', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">How it works</div>
              <h2>One platform, two sides — always in sync</h2>
            </div>
          </div>
          <div className="grid-2">
            <div className="card card-pad">
              <span className="badge badge-blue">For colleges</span>
              <h3 style={{ marginTop: '0.7rem' }}>Publish and maintain your profile</h3>
              <ol className="muted" style={{ paddingLeft: '1.1rem', display: 'grid', gap: '0.5rem' }}>
                <li>Register once with your official website — one verified login per college.</li>
                <li>Import details from your website, then add or edit all 18 sections any time.</li>
                <li>Update seat availability, fees and admission status — students see it instantly.</li>
                <li>Receive and manage enquiries and applications with real-time alerts.</li>
              </ol>
              <Link className="btn btn-primary" to="/college/register">
                Register your college
              </Link>
            </div>
            <div className="card card-pad">
              <span className="badge badge-green">For students</span>
              <h3 style={{ marginTop: '0.7rem' }}>Search, compare and apply</h3>
              <ol className="muted" style={{ paddingLeft: '1.1rem', display: 'grid', gap: '0.5rem' }}>
                <li>Search by course, city or college and filter by fees, hostel and level.</li>
                <li>Read the full profile — eligibility, fee structure, placements, hostel, faculty.</li>
                <li>Check live seat availability and admission status before you apply.</li>
                <li>Submit an enquiry or application and track its status in real time.</li>
              </ol>
              <Link className="btn btn-outline" to="/colleges">
                Start exploring
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* recruiters + newest */}
      <section className="section">
        <div className="container split">
          <div>
            <div className="section-head">
              <div>
                <div className="eyebrow">Recruiters</div>
                <h2>Companies hiring from these campuses</h2>
                <p>Aggregated from the recruiter information published by colleges.</p>
              </div>
            </div>
            <div className="card card-pad">
              <div className="chips">
                {(recruiters.data?.rows || []).map((r) => (
                  <span className="chip" key={r.name} title={`${r.colleges} colleges · ${r.offers || 0} offers`}>
                    🏢 {r.name}
                  </span>
                ))}
                {!recruiters.loading && !recruiters.data?.rows?.length && <span className="muted small">No recruiter data yet.</span>}
              </div>
            </div>
          </div>
          <div>
            <div className="section-head">
              <div>
                <div className="eyebrow">Newly added</div>
                <h2>Latest colleges</h2>
              </div>
            </div>
            <div className="stack-sm">
              {(newest.data?.rows || []).map((college) => (
                <Link key={college.id} className="card card-pad row" to={`/colleges/${college.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="stat-icon">🏫</div>
                  <div style={{ flex: 1 }}>
                    <b>{college.name}</b>
                    <div className="small muted">
                      {college.city}, {college.state} · updated {timeAgo(college.updated_at)}
                    </div>
                  </div>
                  <span className="badge badge-blue">{college.course_count} courses</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
