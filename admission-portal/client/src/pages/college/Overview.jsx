import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, downloadApplicationsCsv } from '../../api.js';
import { useSocketEvent, useToast } from '../../hooks.jsx';
import { BarList, DataTable, EmptyState, ErrorBox, Field, Loader, MiniBars, Modal, StatCard, TextInput } from '../../components/ui.jsx';
import { inr, num, pct, statusBadgeClass, timeAgo } from '../../lib/format.js';

export default function Overview() {
  const toast = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [seatEdit, setSeatEdit] = useState(null);
  const [seatValue, setSeatValue] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api
      .statsDashboard()
      .then((d) => {
        setData(d);
        setError(null);
      })
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useSocketEvent('seats:changed', load);
  useSocketEvent('activity:new', load);

  const saveSeats = async () => {
    if (!seatEdit) return;
    setBusy(true);
    try {
      const res = await api.updateSeats({ course_id: seatEdit.id, filled_seats: Number(seatValue) });
      toast.success(res.message);
      setSeatEdit(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (error) return <ErrorBox error={error} onRetry={load} />;
  if (!data) return <Loader label="Loading your dashboard…" />;

  const { counts, completeness, byStatus, byCourse, applicationsTrend, enquiriesTrend, seatBoard, seats, placementByYear, recruiterStats, recentActivity } = data;

  return (
    <div className="stack">
      <div className="dash-head">
        <div>
          <div className="eyebrow">Dashboard</div>
          <h1>Admissions overview</h1>
          <p className="muted" style={{ margin: 0 }}>
            Live snapshot of your profile, seats and student activity.
          </p>
        </div>
        <div className="row" style={{ gap: '0.5rem' }}>
          <button className="btn btn-outline btn-sm" onClick={load}>
            Refresh
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => downloadApplicationsCsv().catch((e) => toast.error(e.message))}>
            Export applications (CSV)
          </button>
          <Link className="btn btn-primary btn-sm" to="/college/dashboard/import">
            Update profile
          </Link>
        </div>
      </div>

      <div className="grid-4">
        <StatCard label="Applications" value={num(counts.applications, '0')} icon="📝" sub={`${counts.newApplications} awaiting review`} />
        <StatCard label="Enquiries" value={num(counts.enquiries, '0')} icon="💬" sub={`${counts.newEnquiries} new`} />
        <StatCard label="Courses published" value={num(counts.courses, '0')} icon="🎓" sub={`${counts.departments} departments`} />
        <StatCard label="Seats available" value={num(seats.available, '0')} icon="🪑" sub={`of ${seats.intake} sanctioned`} tone="var(--green-soft)" />
      </div>

      <div className="split">
        <div className="stack">
          <div className="card">
            <div className="card-head">
              <h3 className="card-title">Seat availability — update instantly</h3>
              <span className="badge badge-green">
                <span className="dot dot-live" /> students see changes live
              </span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {seatBoard.length ? (
                <div className="table-wrap" style={{ border: 0 }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Course</th>
                        <th className="num">Intake</th>
                        <th className="num">Filled</th>
                        <th className="num">Available</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Update seats</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seatBoard.map((course) => (
                        <tr key={course.id}>
                          <td>
                            <b>{course.name}</b>
                            <div className="small muted">{course.level}</div>
                          </td>
                          <td className="num">{course.intake_seats ?? 0}</td>
                          <td className="num">{course.filled_seats ?? 0}</td>
                          <td className="num" style={{ color: course.available > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
                            {course.available}
                          </td>
                          <td>
                            <span className={`badge ${statusBadgeClass(course.admission_status)}`}>{course.admission_status || 'Open'}</span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => {
                                  setSeatEdit({ ...course });
                                  setSeatValue(String(course.filled_seats ?? 0));
                                }}
                              >
                                Update
                              </button>
                              <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/college/dashboard/section/courses`)}>
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No courses added yet" hint="Add courses to start receiving applications." action={<Link className="btn btn-primary" to="/college/dashboard/section/courses">Add a course</Link>} />
              )}
            </div>
          </div>

          <div className="grid-2">
            <div className="card card-pad">
              <h4>Applications — last 14 days</h4>
              <MiniBars data={applicationsTrend} />
              <div className="divider" />
              <BarList data={byStatus} labelKey="status" />
            </div>
            <div className="card card-pad">
              <h4>Applications by course</h4>
              {byCourse.length ? <BarList data={byCourse} labelKey="course_name" /> : <p className="small muted">No applications yet.</p>}
              <div className="divider" />
              <h4>Enquiries — last 14 days</h4>
              <MiniBars data={enquiriesTrend} height={70} />
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3 className="card-title">Latest applications</h3>
              <Link className="btn btn-outline btn-sm" to="/college/dashboard/applications">
                Manage all
              </Link>
            </div>
            <div className="card-body">
              <DataTable
                rows={recentApplications(data)}
                columns={[
                  { key: 'application_no', label: 'Application', render: (r) => <b className="mono">{r.application_no}</b> },
                  { key: 'student_name', label: 'Applicant' },
                  { key: 'course_name', label: 'Course', render: (r) => <span className="clamp-2">{r.course_name}</span> },
                  { key: 'created_at', label: 'Received', render: (r) => timeAgo(r.created_at) },
                  { key: 'status', label: 'Status', render: (r) => <span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span> },
                ]}
                empty="No applications received yet"
              />
            </div>
          </div>
        </div>

        <aside className="stack">
          <div className="card card-pad">
            <div className="row-between">
              <h4 style={{ margin: 0 }}>Profile completeness</h4>
              <b>{completeness.percentage}%</b>
            </div>
            <div className="divider" />
            <div className="stack-sm">
              {completeness.sections.map((section) => (
                <div key={section.key}>
                  <div className="row-between small">
                    <span>
                      {section.complete ? '✅' : '⬜'} {section.label}
                    </span>
                    <span className="muted">
                      {section.count !== undefined && section.entities ? `${section.count}` : section.complete ? 'done' : 'pending'}
                    </span>
                  </div>
                  {!section.complete && (
                    <Link
                      className="small"
                      to={section.entities ? `/college/dashboard/section/${section.entities.split('|')[0]}` : '/college/dashboard/profile'}
                    >
                      Add now →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <h4>Placements on record</h4>
            {placementByYear.length ? (
              <dl className="kv">
                {placementByYear.map((p) => (
                  <div className="kv-row" key={p.academic_year}>
                    <dt>{p.academic_year}</dt>
                    <dd>
                      {inr(p.highest_package, { compact: true })} highest · {inr(p.average_package, { compact: true })} avg
                      {p.placement_percentage ? ` · ${pct(p.placement_percentage)} placed` : ''}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="small muted">
                No placement records yet — <Link to="/college/dashboard/section/placements">add them</Link> so students see your packages.
              </p>
            )}
            {recruiterStats.length > 0 && (
              <>
                <div className="divider" />
                <h4>Recruiters by sector</h4>
                <BarList data={recruiterStats} labelKey="sector" />
              </>
            )}
          </div>

          <div className="card card-pad">
            <div className="row-between">
              <h4 style={{ margin: 0 }}>Recent activity</h4>
              <span className="badge badge-green">
                <span className="dot dot-live" /> live
              </span>
            </div>
            <div className="divider" />
            <div className="feed feed-light" style={{ maxHeight: 260 }}>
              {recentActivity.map((a) => (
                <div className="feed-item" key={a.id}>
                  <span>{a.entity === 'applications' ? '📝' : a.entity === 'enquiries' ? '💬' : a.entity === 'courses' ? '🎓' : '📌'}</span>
                  <div style={{ flex: 1 }}>
                    <div>{a.message}</div>
                    <div className="small muted">{timeAgo(a.created_at)}</div>
                  </div>
                </div>
              ))}
              {!recentActivity.length && <div className="small muted">No activity yet.</div>}
            </div>
          </div>

          <div className="card card-pad stack-sm">
            <h4 style={{ margin: 0 }}>Media &amp; documents</h4>
            <div className="row-between small">
              <span>🖼️ Photos &amp; videos</span>
              <span className="badge badge-blue">{counts.media}</span>
            </div>
            <div className="row-between small">
              <span>📄 Documents</span>
              <span className="badge badge-blue">{counts.documents}</span>
            </div>
            <Link className="btn btn-outline btn-sm" to="/college/dashboard/section/media">
              Manage gallery
            </Link>
          </div>
        </aside>
      </div>

      {seatEdit && (
        <Modal
          title={`Update seats — ${seatEdit.name}`}
          subtitle="Students see the new availability immediately on the portal."
          onClose={() => setSeatEdit(null)}
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setSeatEdit(null)} disabled={busy}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={saveSeats} disabled={busy}>
                {busy ? 'Saving…' : 'Publish update'}
              </button>
            </>
          }
        >
          <div className="stack">
            <div className="grid-2">
              <div className="stat">
                <div className="stat-label">Sanctioned intake</div>
                <div className="stat-value">{seatEdit.intake_seats}</div>
              </div>
              <div className="stat">
                <div className="stat-label">Currently available</div>
                <div className="stat-value">{seatEdit.available}</div>
              </div>
            </div>
            <Field label="Seats filled so far" hint="Enter the total number of seats filled (including confirmed admissions)">
              <TextInput type="number" min="0" max={seatEdit.intake_seats} value={seatValue} onChange={setSeatValue} />
            </Field>
            <div className="alert alert-info small">
              Available after update: <b>{Math.max(0, (seatEdit.intake_seats || 0) - (Number(seatValue) || 0))}</b> of{' '}
              {seatEdit.intake_seats}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function recentApplications(data) {
  // the overview reuses the applications endpoint shape returned by /college/stats
  return data.latestApplications || data.recentApplications || [];
}
