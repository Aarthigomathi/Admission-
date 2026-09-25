import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../../api.js';
import { useAsync, useSocketEvent, useToast } from '../../hooks.jsx';
import { ApplyModal, CollegeHighlights, EnquiryModal, Gallery, SeatTable } from '../../components/college.jsx';
import { BarList, Breadcrumbs, EmptyState, ErrorBox, Layout, Loader, Modal, Progress, Tabs } from '../../components/ui.jsx';
import { asArray, compact, dateLabel, initials, inr, num, pct, statusBadgeClass, timeAgo } from '../../lib/format.js';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'courses', label: 'Courses & seats' },
  { id: 'fees', label: 'Fees' },
  { id: 'placements', label: 'Placements' },
  { id: 'recruiters', label: 'Recruiters & internships' },
  { id: 'faculty', label: 'Faculty' },
  { id: 'campus', label: 'Hostel, transport & campus' },
  { id: 'life', label: 'Events, achievements & scholarships' },
  { id: 'gallery', label: 'Photos & videos' },
  { id: 'documents', label: 'Documents' },
];

export default function CollegeDetail() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const toast = useToast();
  const [tab, setTab] = useState(params.get('tab') || 'overview');
  const [applyCourse, setApplyCourse] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [enquiryCourse, setEnquiryCourse] = useState(null);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [courseDetail, setCourseDetail] = useState(null);

  const { data, loading, error, reload, setData } = useAsync(() => api.college(slug), [slug]);

  useEffect(() => {
    const next = params.get('tab');
    if (next && next !== tab) setTab(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const changeTab = (id) => {
    setTab(id);
    const next = new URLSearchParams(params);
    next.set('tab', id);
    setParams(next, { replace: true });
  };

  // ---- realtime: seats + profile changes -------------------------------
  useSocketEvent(
    'seats:changed',
    (payload) => {
      if (!data || payload.collegeId !== data.college.id) return;
      setData({
        ...data,
        courses: data.courses.map((c) =>
          c.id === payload.courseId ? { ...c, filled_seats: payload.filled, intake_seats: payload.intake, admission_status: payload.admissionStatus } : c,
        ),
        seatBoard: data.seatBoard.map((c) =>
          c.id === payload.courseId ? { ...c, filled_seats: payload.filled, available: payload.available, admission_status: payload.admissionStatus } : c,
        ),
        summary: { ...data.summary, lastUpdated: payload.at },
      });
      toast.live(`${payload.courseName}: ${payload.available} of ${payload.intake} seats available now`);
    },
    [data],
  );

  useSocketEvent(
    'college:data-changed',
    (payload) => {
      if (!data || payload.collegeId !== data.college.id) return;
      toast.live(`${payload.message} — refreshing details`);
      reload();
    },
    [data],
  );

  const openCourses = useMemo(
    () => (data?.courses || []).filter((c) => c.is_active !== 0 && c.admission_status !== 'Closed'),
    [data],
  );

  if (loading || !data?.college)
    return (
      <Layout>
        <div className="container">
          <Loader label="Loading college profile…" />
        </div>
      </Layout>
    );
  if (error)
    return (
      <Layout>
        <div className="container section">
          <ErrorBox error={error} onRetry={reload} />
          <Link className="btn btn-outline" to="/colleges" style={{ marginTop: '1rem' }}>
            ← Back to search
          </Link>
        </div>
      </Layout>
    );

  const c = data?.college;
  const summary = data?.summary;

  return (
    <Layout>
      <section style={{ background: '#fff', borderBottom: '1px solid var(--line)' }}>
        <div style={{ position: 'relative', height: 220, background: 'linear-gradient(135deg,#122c4a,#2563eb)', overflow: 'hidden' }}>
          {c.cover_url && <img src={c.cover_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => (e.currentTarget.style.display = 'none')} />}
        </div>
        <div className="container" style={{ position: 'relative', paddingBottom: '1.4rem' }}>
          <div className="row" style={{ alignItems: 'flex-end', marginTop: '-42px', gap: '1rem' }}>
            <div
              className="cc-logo"
              style={{ position: 'static', width: 88, height: 88, borderRadius: 20, display: 'grid', placeItems: 'center', background: '#fff', border: '4px solid #fff', boxShadow: 'var(--shadow)' }}
            >
              {c.logo_url ? <img src={c.logo_url} alt="" style={{ maxHeight: 70, objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} /> : initials(c.name)}
            </div>
            <div style={{ flex: 1, minWidth: 260 }}>
              <Breadcrumbs items={[{ label: 'Colleges', to: '/colleges' }, { label: c.name }]} />
              <h1 style={{ marginBottom: '0.3rem' }}>{c.name}</h1>
              <div className="row" style={{ gap: '0.45rem' }}>
                {c.type && <span className="badge badge-navy">{c.type}</span>}
                {c.established_year && <span className="badge">Est. {c.established_year}</span>}
                {c.accreditation && <span className="badge badge-blue">{c.accreditation}</span>}
                {c.nirf_rank && <span className="badge badge-amber">🏅 {c.nirf_rank}</span>}
                {c.verified ? (
                  <span className="badge badge-green" title="The college has confirmed these details">✔ College verified</span>
                ) : (
                  <span className="badge badge-amber" title="Imported from the official website; the college has not confirmed it yet">
                    ⏳ From official website — awaiting college confirmation
                  </span>
                )}
              </div>
              <div className="small muted" style={{ marginTop: '0.5rem' }}>
                📍 {[c.address, c.city, c.state, c.pincode].filter(Boolean).join(', ')}
              </div>
            </div>
            <div className="row" style={{ gap: '0.5rem' }}>
              <button className="btn btn-primary" onClick={() => { setApplyCourse(null); setShowApply(true); }} disabled={!openCourses.length}>
                Apply now
              </button>
              <button className="btn btn-outline" onClick={() => { setEnquiryCourse(null); setShowEnquiry(true); }}>
                Send enquiry
              </button>
              {c.website && (
                <a className="btn btn-ghost" href={c.website} target="_blank" rel="noreferrer">
                  Official site ↗
                </a>
              )}
            </div>
          </div>

          <div className="row" style={{ marginTop: '1.2rem', gap: '0.5rem' }}>
            <span className="badge badge-green">
              <span className="dot dot-live" /> {compact(summary.availableSeats)} seats available
            </span>
            <span className="badge badge-blue">{summary.courses} courses</span>
            <span className="badge">{summary.departments} departments</span>
            {summary.highestPackage ? <span className="badge badge-teal">Highest package {inr(summary.highestPackage, { compact: true })}</span> : null}
            {c.phone && (
              <a className="badge badge-navy" href={`tel:${c.phone}`}>
                📞 {c.phone}
              </a>
            )}
            {c.email && (
              <a className="badge badge-navy" href={`mailto:${c.email}`}>
                ✉️ {c.email}
              </a>
            )}
            <span className="badge" title="Last time the college updated its data">
              🔄 updated {timeAgo(summary.lastUpdated)}
            </span>
          </div>
        </div>
      </section>

      <div className="container section-tight">
        <div className="hscroll" style={{ paddingTop: '1.2rem' }}>
          <Tabs tabs={TABS} value={tab} onChange={changeTab} />
        </div>
      </div>

      <section className="section-tight" style={{ paddingBottom: '3rem' }}>
        <div className="container">
          {tab === 'overview' && <Overview data={data} onChangeTab={changeTab} />}
          {tab === 'courses' && (
            <div className="stack">
              <div className="split">
                <div className="stack">
                  <h2>Courses, eligibility &amp; live seats</h2>
                  <p className="muted" style={{ margin: 0 }}>
                    Seat numbers are updated by the college in real time. Click a course for the full admission
                    details, or apply directly.
                  </p>
                  <SeatTable
                    rows={data.seatBoard}
                    onApply={(row) => {
                      const course = data.courses.find((x) => x.id === row.id);
                      setApplyCourse(course);
                      setShowApply(true);
                    }}
                  />
                </div>
                <aside className="stack">
                  <div className="card card-pad">
                    <h4>Seat summary</h4>
                    <BarList
                      data={[
                        { status: 'Filled', n: summary.filledSeats },
                        { status: 'Available', n: summary.availableSeats },
                      ]}
                      total={summary.totalSeats}
                    />
                    <div className="divider" />
                    <div className="small muted">Total sanctioned intake: {num(summary.totalSeats)}</div>
                  </div>
                  <div className="card card-pad stack-sm">
                    <h4 style={{ margin: 0 }}>Quick apply</h4>
                    {openCourses.slice(0, 5).map((course) => (
                      <button
                        key={course.id}
                        className="btn btn-outline btn-sm"
                        style={{ justifyContent: 'space-between' }}
                        onClick={() => {
                          setApplyCourse(course);
                          setShowApply(true);
                        }}
                      >
                        <span className="truncate" style={{ maxWidth: 200 }}>
                          {course.name}
                        </span>
                        <span className="mono">{Math.max(0, (course.intake_seats || 0) - (course.filled_seats || 0))} left</span>
                      </button>
                    ))}
                    {!openCourses.length && <span className="small muted">Admissions are currently closed.</span>}
                  </div>
                </aside>
              </div>
            </div>
          )}
          {tab === 'fees' && <FeesTab data={data} />}
          {tab === 'placements' && <PlacementsTab data={data} />}
          {tab === 'recruiters' && <RecruitersTab data={data} />}
          {tab === 'faculty' && <FacultyTab data={data} />}
          {tab === 'campus' && <CampusTab data={data} />}
          {tab === 'life' && <LifeTab data={data} />}
          {tab === 'gallery' && (
            <div className="stack">
              <h2>Photos &amp; videos</h2>
              <Gallery items={data.media} />
            </div>
          )}
          {tab === 'documents' && <DocumentsTab data={data} />}
        </div>
      </section>

      {showApply && (
        <ApplyModal
          college={c}
          courses={data.courses}
          course={applyCourse}
          onClose={() => setShowApply(false)}
          onDone={() => reload()}
        />
      )}
      {showEnquiry && <EnquiryModal college={c} course={enquiryCourse} onClose={() => setShowEnquiry(false)} />}
      {courseDetail && (
        <Modal title={courseDetail.name} subtitle={`${c.name}`} onClose={() => setCourseDetail(null)} footer={<button className="btn btn-primary" onClick={() => setCourseDetail(null)}>Close</button>}>
          <CourseDetailBody course={courseDetail} onApply={() => { setCourseDetail(null); setApplyCourse(courseDetail); setShowApply(true); }} />
        </Modal>
      )}
    </Layout>
  );
}

/* ------------------------------------------------------------------ */
function Overview({ data, onChangeTab }) {
  const c = data.college;
  return (
    <div className="split">
      <div className="stack">
        <div className="card card-pad">
          <h3>About {c.short_name || c.name}</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{c.about || 'The college has not published an introduction yet.'}</p>
          {asArray(c.highlights).length ? (
            <div className="chips">
              {asArray(c.highlights).map((h) => (
                <span className="chip" key={h}>
                  ⭐ {h}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {(c.vision || c.mission) && (
          <div className="grid-2">
            {c.vision && (
              <div className="card card-pad">
                <h4>Vision</h4>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{c.vision}</p>
              </div>
            )}
            {c.mission && (
              <div className="card card-pad">
                <h4>Mission</h4>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{c.mission}</p>
              </div>
            )}
          </div>
        )}

        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Departments ({data.departmentStats.length})</h3>
            <button className="btn btn-outline btn-sm" onClick={() => onChangeTab('courses')}>
              View courses
            </button>
          </div>
          <div className="card-body">
            {data.departmentStats.length ? (
              <div className="grid-2" style={{ gap: '0.6rem' }}>
                {data.departmentStats.map((d) => (
                  <div key={d.id} className="card card-pad" style={{ boxShadow: 'none' }}>
                    <div className="row-between">
                      <b>{d.name}</b>
                      {d.code && <span className="badge badge-navy">{d.code}</span>}
                    </div>
                    <div className="small muted">
                      {[d.hod_name, d.faculty_count ? `${d.faculty_count} faculty` : null, `${d.course_count || 0} courses`]
                        .filter(Boolean)
                        .join(' · ') || 'Details to be updated by the college'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No departments listed yet" />
            )}
          </div>
        </div>

        {data.courses.length > 0 && (
          <div className="card">
            <div className="card-head">
              <h3 className="card-title">Popular courses</h3>
              <button className="btn btn-outline btn-sm" onClick={() => onChangeTab('courses')}>
                All {data.courses.length} courses
              </button>
            </div>
            <div className="card-body stack-sm">
              {data.courses.slice(0, 5).map((course) => (
                <div key={course.id} className="row-between">
                  <div>
                    <b>{course.name}</b>
                    <div className="small muted">
                      {[course.level, course.duration, course.eligibility?.slice(0, 70)].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <div className="row" style={{ gap: '0.4rem' }}>
                    <span className={`badge ${statusBadgeClass(course.admission_status)}`}>{course.admission_status}</span>
                    <span className="badge badge-green">{Math.max(0, (course.intake_seats || 0) - (course.filled_seats || 0))} seats</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="stack">
        <CollegeHighlights college={c} seatsSummary={data.summary} />
        <div className="card card-pad">
          <h4>Live updates from this college</h4>
          {data.updates?.length ? (
            <div className="timeline">
              {data.updates.map((u, i) => (
                <div className="timeline-item" key={i}>
                  <span className={`timeline-dot${i === 0 ? '' : ' pending'}`} />
                  <div>
                    <div style={{ fontSize: '0.9rem' }}>{u.message}</div>
                    <div className="small muted">{timeAgo(u.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="small muted" style={{ margin: 0 }}>
              No public updates yet.
            </p>
          )}
        </div>
        <div className="card card-pad">
          <h4>Contact</h4>
          <dl className="kv">
            <div className="kv-row">
              <dt>Admission office</dt>
              <dd>{c.admission_email || c.email || '—'}</dd>
            </div>
            <div className="kv-row">
              <dt>Phone</dt>
              <dd>{[c.phone, c.alt_phone].filter(Boolean).join(' / ') || '—'}</dd>
            </div>
            <div className="kv-row">
              <dt>Website</dt>
              <dd>
                {c.website ? (
                  <a href={c.website} target="_blank" rel="noreferrer">
                    {c.website.replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  '—'
                )}
              </dd>
            </div>
            <div className="kv-row">
              <dt>Campus</dt>
              <dd>{c.campus_area || '—'}</dd>
            </div>
            <div className="kv-row">
              <dt>Students / faculty</dt>
              <dd>
                {num(c.total_students)} / {num(c.total_faculty)}
                {c.student_faculty_ratio ? ` (${c.student_faculty_ratio})` : ''}
              </dd>
            </div>
            {c.source_url && (
              <div className="kv-row">
                <dt>Data source</dt>
                <dd>
                  <a href={c.source_url} target="_blank" rel="noreferrer">
                    Official website
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <div className="row" style={{ gap: '0.5rem', marginTop: '0.6rem' }}>
            {c.facebook && <a className="btn btn-ghost btn-sm" href={c.facebook} target="_blank" rel="noreferrer">Facebook</a>}
            {c.instagram && <a className="btn btn-ghost btn-sm" href={c.instagram} target="_blank" rel="noreferrer">Instagram</a>}
            {c.linkedin && <a className="btn btn-ghost btn-sm" href={c.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            {c.youtube && <a className="btn btn-ghost btn-sm" href={c.youtube} target="_blank" rel="noreferrer">YouTube</a>}
          </div>
        </div>
      </aside>
    </div>
  );
}

function CourseDetailBody({ course, onApply }) {
  const rows = [
    ['Level', course.level],
    ['Degree', course.degree_type],
    ['Stream', course.stream],
    ['Duration', course.duration],
    ['Mode', course.mode],
    ['Intake', course.intake_seats],
    ['Filled', course.filled_seats],
    ['Available', Math.max(0, (course.intake_seats || 0) - (course.filled_seats || 0))],
    ['Application fee', course.application_fee ? inr(course.application_fee) : null],
    ['Tuition fee (per year)', course.tuition_fee ? inr(course.tuition_fee) : null],
    ['Applications open', course.admission_start_date ? dateLabel(course.admission_start_date) : null],
    ['Application deadline', course.application_deadline ? dateLabel(course.application_deadline) : null],
    ['Entrance exams', asArray(course.entrance_exams).join(', ')],
    ['Accreditation', course.accreditation],
  ].filter(([, v]) => v !== null && v !== undefined && v !== '');
  return (
    <div className="stack">
      <dl className="kv">
        {rows.map(([k, v]) => (
          <div className="kv-row" key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div>
        <h4>Eligibility</h4>
        <p style={{ whiteSpace: 'pre-wrap' }}>{course.eligibility || 'Not specified'}</p>
        <h4>Admission criteria</h4>
        <p style={{ whiteSpace: 'pre-wrap' }}>{course.admission_criteria || 'Not specified'}</p>
        {course.selection_process && (
          <>
            <h4>Selection process</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{course.selection_process}</p>
          </>
        )}
        {course.highlights && (
          <>
            <h4>Highlights</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{course.highlights}</p>
          </>
        )}
      </div>
      <div className="row" style={{ gap: '0.5rem' }}>
        <button className="btn btn-primary" onClick={onApply}>
          Apply for this course
        </button>
        {course.syllabus_url && (
          <a className="btn btn-outline" href={course.syllabus_url} target="_blank" rel="noreferrer">
            Syllabus / details ↗
          </a>
        )}
      </div>
    </div>
  );
}

function FeesTab({ data }) {
  if (!data.fees.length) return <EmptyState icon="💰" title="No fee structure published" hint="The college has not added its fee details yet." />;
  return (
    <div className="stack">
      <h2>Fee structure</h2>
      <p className="muted">Fees are published by the college. Contact the admission office to confirm instalments and concessions.</p>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Academic year</th>
              <th className="num">Tuition</th>
              <th className="num">Hostel</th>
              <th className="num">Total</th>
              <th>Payment terms</th>
            </tr>
          </thead>
          <tbody>
            {data.fees.map((fee) => (
              <tr key={fee.id}>
                <td>
                  <b>{fee.course_name}</b>
                  {fee.scholarship_note && <div className="small muted clamp-2">{fee.scholarship_note}</div>}
                </td>
                <td>{fee.academic_year}</td>
                <td className="num">{inr(fee.tuition_fee)}</td>
                <td className="num">{inr(fee.hostel_fee)}</td>
                <td className="num">
                  <b>{inr(fee.total_fee)}</b>
                </td>
                <td className="small">{fee.payment_terms || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PlacementsTab({ data }) {
  if (!data.placements.length)
    return <EmptyState icon="📈" title="No placement records published" hint="Placement statistics appear here once the college adds them." />;
  return (
    <div className="stack">
      <h2>Placements</h2>
      <div className="grid-auto">
        {data.placements.map((p) => (
          <div className="card card-pad stack-sm" key={p.id}>
            <div className="row-between">
              <b>{p.academic_year}</b>
              <span className="badge badge-blue">{p.programme_level}</span>
            </div>
            <div className="grid-2" style={{ gap: '0.5rem' }}>
              <div>
                <div className="stat-label">Highest</div>
                <b style={{ fontSize: '1.15rem' }}>{inr(p.highest_package, { compact: true })}</b>
              </div>
              <div>
                <div className="stat-label">Average</div>
                <b style={{ fontSize: '1.15rem' }}>{inr(p.average_package, { compact: true })}</b>
              </div>
            </div>
            <div className="small muted">
              {num(p.students_placed)} of {num(p.students_graduated)} students placed
              {p.placement_percentage ? ` · ${pct(p.placement_percentage)}` : ''}
            </div>
            {p.placement_percentage ? <Progress value={p.placement_percentage} tone="progress-green" /> : null}
            <div className="small muted">
              {num(p.offers_made)} offers · {num(p.companies_visited)} companies
              {p.top_recruiter ? ` · top recruiter ${p.top_recruiter}` : ''}
            </div>
            {p.notes && <div className="small muted clamp-3">{p.notes}</div>}
            {p.source_url && (
              <a className="small" href={p.source_url} target="_blank" rel="noreferrer">
                Source ↗
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RecruitersTab({ data }) {
  return (
    <div className="stack">
      <h2>Recruiters &amp; internships</h2>
      {data.recruiters.length ? (
        <div className="grid-auto">
          {data.recruiters.map((r) => (
            <div className="card card-pad" key={r.id}>
              <div className="row-between">
                <div className="row" style={{ gap: '0.6rem' }}>
                  {r.logo_url ? <img src={r.logo_url} alt="" style={{ width: 34, height: 34, objectFit: 'contain' }} /> : <span className="stat-icon">🏢</span>}
                  <div>
                    <b>{r.name}</b>
                    <div className="small muted">
                      {[r.sector, r.visit_type, r.academic_year].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
                {r.is_top ? <span className="badge badge-amber">★ Top</span> : null}
              </div>
              <div className="row small muted" style={{ gap: '0.8rem', marginTop: '0.5rem' }}>
                {r.offers_made ? <span>📄 {r.offers_made} offers</span> : null}
                {r.avg_package ? <span>💰 avg {inr(r.avg_package, { compact: true })}</span> : null}
                {r.highest_package ? <span>🏆 up to {inr(r.highest_package, { compact: true })}</span> : null}
              </div>
              {r.description && <div className="small muted" style={{ marginTop: '0.4rem' }}>{r.description}</div>}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No recruiters listed" />
      )}

      {data.internships.length > 0 && (
        <>
          <h3 style={{ marginTop: '1rem' }}>Internships</h3>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Duration</th>
                  <th className="num">Stipend</th>
                  <th className="num">Students</th>
                  <th className="num">PPO offers</th>
                </tr>
              </thead>
              <tbody>
                {data.internships.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <b>{i.company}</b>
                      <div className="small muted">{i.academic_year}</div>
                    </td>
                    <td>{i.role || '—'}</td>
                    <td>{i.duration || '—'}</td>
                    <td className="num">{i.stipend ? `${inr(i.stipend)}/${(i.stipend_period || 'Per Month').toLowerCase().replace('per ', '')}` : '—'}</td>
                    <td className="num">{num(i.students_count)}</td>
                    <td className="num">{num(i.ppo_offers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function FacultyTab({ data }) {
  if (!data.faculty.length)
    return <EmptyState icon="👩‍🏫" title="Faculty details not published yet" hint="The college can add faculty members from its dashboard — students then see them here instantly." />;
  return (
    <div className="stack">
      <h2>Faculty</h2>
      <div className="grid-auto">
        {data.faculty.map((f) => (
          <div className="card card-pad" key={f.id}>
            <div className="row" style={{ gap: '0.7rem' }}>
              {f.photo_url ? (
                <img src={f.photo_url} alt="" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover' }} />
              ) : (
                <span className="stat-icon">{initials(f.name)}</span>
              )}
              <div>
                <b>{f.name}</b>
                <div className="small muted">{f.designation}</div>
              </div>
            </div>
            <div className="small muted" style={{ marginTop: '0.5rem' }}>
              {[f.department_name, f.qualification, f.specialization].filter(Boolean).join(' · ')}
            </div>
            <div className="row small muted" style={{ gap: '0.7rem', marginTop: '0.4rem' }}>
              {f.experience_years ? <span>{f.experience_years} yrs experience</span> : null}
              {f.publications ? <span>{f.publications} publications</span> : null}
              {f.is_hod ? <span className="badge badge-navy">HOD</span> : null}
            </div>
            {f.email && <div className="small muted">✉️ {f.email}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function CampusTab({ data }) {
  return (
    <div className="stack">
      <h2>Hostel, transport, library, sports &amp; facilities</h2>

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">🛏️ Hostels</h3>
            <span className="badge badge-blue">{data.hostels.length}</span>
          </div>
          <div className="card-body stack-sm">
            {data.hostels.length ? (
              data.hostels.map((h) => (
                <div key={h.id} className="card card-pad" style={{ boxShadow: 'none' }}>
                  <div className="row-between">
                    <b>{h.name}</b>
                    <span className="badge badge-navy">{h.gender}</span>
                  </div>
                  <div className="small muted">
                    {[h.capacity ? `Capacity ${h.capacity}` : null, h.fees_per_year ? `${inr(h.fees_per_year)}/year` : null, h.mess_type]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                  {asArray(h.amenities).length ? (
                    <div className="chips" style={{ marginTop: '0.4rem' }}>
                      {asArray(h.amenities).map((a) => (
                        <span className="chip" key={a}>
                          {a}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {h.description && <div className="small muted" style={{ marginTop: '0.4rem' }}>{h.description}</div>}
                </div>
              ))
            ) : (
              <p className="small muted">No hostel details published.</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3 className="card-title">📚 Library</h3>
          </div>
          <div className="card-body stack-sm">
            {data.library.length ? (
              data.library.map((l) => (
                <div key={l.id}>
                  <b>{l.name}</b>
                  <div className="small muted">
                    {[l.total_books ? `${num(l.total_books)} books` : null, l.journals ? `${num(l.journals)} journals` : null, l.e_journals ? `${num(l.e_journals)} e-journals` : null, l.seating_capacity ? `${num(l.seating_capacity)} seats` : null]
                      .filter(Boolean)
                      .join(' · ')}
                  </div>
                  {l.timings && <div className="small muted">🕐 {l.timings}</div>}
                  {asArray(l.digital_databases).length ? (
                    <div className="chips" style={{ marginTop: '0.35rem' }}>
                      {asArray(l.digital_databases).map((d) => (
                        <span className="chip" key={d}>
                          {d}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  {l.description && <p className="small muted" style={{ marginTop: '0.3rem' }}>{l.description}</p>}
                </div>
              ))
            ) : (
              <p className="small muted">No library details published.</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3 className="card-title">🚌 Transport</h3>
          </div>
          <div className="card-body stack-sm">
            {data.transport.length ? (
              data.transport.map((t) => (
                <div key={t.id}>
                  <div className="row-between">
                    <b>
                      {t.route_no ? `${t.route_no} · ` : ''}
                      {t.route_name}
                    </b>
                    {t.gps_tracking ? <span className="badge badge-green">GPS tracked</span> : null}
                  </div>
                  <div className="small muted">{t.stops}</div>
                  <div className="small muted">
                    {[t.fleet_count ? `${t.fleet_count} buses` : null, t.fee_per_year ? `${inr(t.fee_per_year)}/year` : null, t.timings].filter(Boolean).join(' · ')}
                  </div>
                </div>
              ))
            ) : (
              <p className="small muted">No transport routes published.</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3 className="card-title">🏅 Sports</h3>
          </div>
          <div className="card-body">
            {data.sports.length ? (
              <div className="chips">
                {data.sports.map((s) => (
                  <span className="chip" key={s.id} title={s.facilities}>
                    {s.category === 'Indoor' ? '🏸' : s.category === 'Gymnasium' ? '🏋️' : s.category === 'Aquatics' ? '🏊' : '🏏'} {s.sport_name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="small muted">No sports details published.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">🏗️ Infrastructure</h3>
          </div>
          <div className="card-body stack-sm">
            {data.infrastructure.length ? (
              data.infrastructure.map((i) => (
                <div key={i.id}>
                  <b>{i.name}</b>
                  <div className="small muted">
                    {[i.category, i.capacity ? `capacity ${i.capacity}` : null, i.area_sqft ? `${num(i.area_sqft)} sq.ft` : null, i.year_built].filter(Boolean).join(' · ')}
                  </div>
                </div>
              ))
            ) : (
              <p className="small muted">No infrastructure details published.</p>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">🧭 Campus facilities</h3>
          </div>
          <div className="card-body">
            {data.facilities.length ? (
              <div className="chips">
                {data.facilities.map((f) => (
                  <span className="chip" key={f.id}>
                    {f.available ? '✅' : '⛔'} {f.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="small muted">No facility list published.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LifeTab({ data }) {
  return (
    <div className="stack">
      <h2>Events, achievements &amp; scholarships</h2>
      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">🎉 Events</h3>
            <Link className="btn btn-ghost btn-sm" to="/colleges">
              {data.events.length} listed
            </Link>
          </div>
          <div className="card-body stack-sm">
            {data.events.length ? (
              data.events.map((e) => (
                <div key={e.id} className="card card-pad" style={{ boxShadow: 'none' }}>
                  <div className="row-between">
                    <b>{e.title}</b>
                    <span className={`badge ${e.status === 'Upcoming' ? 'badge-green' : 'badge-gray'}`}>{e.status}</span>
                  </div>
                  <div className="small muted">
                    {[e.category, dateLabel(e.start_date), e.end_date ? `to ${dateLabel(e.end_date)}` : null, e.venue].filter(Boolean).join(' · ')}
                  </div>
                  {e.description && <div className="small muted clamp-2">{e.description}</div>}
                </div>
              ))
            ) : (
              <p className="small muted">No events published.</p>
            )}
          </div>
        </div>

        <div className="stack">
          <div className="card">
            <div className="card-head">
              <h3 className="card-title">🏆 Achievements</h3>
            </div>
            <div className="card-body stack-sm">
              {data.achievements.length ? (
                data.achievements.map((a) => (
                  <div key={a.id}>
                    <div className="row-between">
                      <b>{a.title}</b>
                      {a.year && <span className="badge">{a.year}</span>}
                    </div>
                    <div className="small muted">
                      {[a.level, a.category, a.achieved_by, a.award_organisation].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                ))
              ) : (
                <p className="small muted">No achievements published.</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3 className="card-title">🎯 Scholarships</h3>
            </div>
            <div className="card-body stack-sm">
              {data.scholarships.length ? (
                data.scholarships.map((s) => (
                  <div key={s.id}>
                    <div className="row-between">
                      <b>{s.name}</b>
                      <span className="badge badge-blue">{s.category}</span>
                    </div>
                    <div className="small muted">
                      {[s.provider_type, s.amount ? inr(s.amount) : s.percent_value ? `${s.percent_value}% concession` : s.amount_type, s.deadline ? `apply by ${dateLabel(s.deadline)}` : null]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                    <div className="small muted clamp-2">{s.eligibility}</div>
                  </div>
                ))
              ) : (
                <p className="small muted">No scholarships published.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentsTab({ data }) {
  const docs = (data.documents || []).filter((d) => d.is_public !== 0);
  if (!docs.length) return <EmptyState icon="📄" title="No documents published" hint="Prospectus, brochures and disclosures appear here." />;
  return (
    <div className="stack">
      <h2>Documents &amp; links</h2>
      <div className="doc-list">
        {docs.map((d) => (
          <a className="doc" key={d.id} href={d.file_url} target="_blank" rel="noreferrer">
            <span className="stat-icon">📄</span>
            <div style={{ flex: 1 }}>
              <b>{d.title}</b>
              <div className="small muted">
                {[d.category, d.year, d.file_size_kb ? `${d.file_size_kb} KB` : null].filter(Boolean).join(' · ')}
              </div>
            </div>
            <span className="badge badge-blue">Open ↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
