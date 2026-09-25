import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, joinTrackRoom } from '../../api.js';
import { useSocketEvent } from '../../hooks.jsx';
import { EmptyState, ErrorBox, Field, Layout, Loader, TextInput } from '../../components/ui.jsx';
import { dateLabel, dateTimeLabel, statusBadgeClass, timeAgo } from '../../lib/format.js';

const STAGES = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Provisionally Selected', 'Confirmed'];

export default function TrackStatus() {
  const [params, setParams] = useSearchParams();
  const [applicationNo, setApplicationNo] = useState(params.get('application_no') || '');
  const [email, setEmail] = useState(params.get('email') || '');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [live, setLive] = useState('');

  const search = async (appNo = applicationNo, mail = email) => {
    if (!appNo && !mail) {
      setError('Enter your application number or the email you applied with.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await api.track({ application_no: appNo, email: mail });
      setRows(data.rows || []);
      (data.rows || []).forEach((row) => joinTrackRoom(row.application_no));
      const next = new URLSearchParams();
      if (appNo) next.set('application_no', appNo);
      if (mail) next.set('email', mail);
      setParams(next, { replace: true });
    } catch (err) {
      setError(err.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get('application_no') || params.get('email')) search(params.get('application_no') || '', params.get('email') || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useSocketEvent('application:status', (payload) => {
    setRows((list) =>
      list.map((row) => (row.application_no === payload.applicationNo ? { ...row, status: payload.status, remarks: payload.remarks, interview_date: payload.interviewDate } : row)),
    );
    setLive(`Status updated to “${payload.status}” by ${payload.collegeName} · ${timeAgo(payload.at)}`);
  });

  return (
    <Layout>
      <section className="section-tight" style={{ background: '#fff', borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ paddingTop: '1.8rem' }}>
          <div className="eyebrow">Application tracking</div>
          <h1 style={{ fontSize: '1.9rem' }}>Where is my application?</h1>
          <p className="muted">Enter the application number you received (or your registered email) to see the live status.</p>
          <div className="card card-pad" style={{ maxWidth: 780 }}>
            <div className="form-grid">
              <Field label="Application number" hint="Format: APL-2026-12345">
                <TextInput value={applicationNo} onChange={setApplicationNo} placeholder="APL-2026-12345" />
              </Field>
              <Field label="Registered email" hint="You can use either field">
                <TextInput value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
              </Field>
            </div>
            <div className="row" style={{ marginTop: '0.8rem' }}>
              <button className="btn btn-primary" onClick={() => search()} disabled={loading}>
                {loading ? 'Checking…' : 'Check status'}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setApplicationNo('');
                  setEmail('');
                  setRows([]);
                  setError('');
                  setParams(new URLSearchParams(), { replace: true });
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight" style={{ paddingBottom: '3rem' }}>
        <div className="container">
          <ErrorBox error={error} />
          {live && <div className="alert alert-success" style={{ marginTop: '1rem' }}>📡 {live}</div>}
          {loading && <Loader label="Looking up your application…" />}

          {!loading && rows.map((row) => (
            <div className="card card-pad" key={row.id} style={{ marginTop: '1.2rem' }}>
              <div className="row-between">
                <div>
                  <div className="small muted">{row.college_name}</div>
                  <h3 style={{ marginBottom: '0.2rem' }}>{row.course_name}</h3>
                  <div className="small muted">
                    Application <b className="mono">{row.application_no}</b> · submitted {dateLabel(row.created_at)}
                  </div>
                </div>
                <div className="right">
                  <span className={`badge badge-lg ${statusBadgeClass(row.status)}`}>{row.status}</span>
                  <div className="small muted" style={{ marginTop: '0.3rem' }}>
                    Applicant: {row.student_name}
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div className="grid-2">
                <div>
                  <h4>Progress</h4>
                  <div className="timeline">
                    {STAGES.map((stage, i) => {
                      const currentIndex = STAGES.indexOf(row.status);
                      const done = currentIndex >= i && currentIndex !== -1;
                      const special = ['Waitlisted', 'Rejected'].includes(row.status);
                      return (
                        <div className="timeline-item" key={stage}>
                          <span className={`timeline-dot ${done && !special ? 'done' : 'pending'}`} />
                          <div>
                            <b style={{ color: done ? 'var(--ink)' : 'var(--muted)' }}>{stage}</b>
                            {row.status === stage && <div className="small muted">current stage</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {['Waitlisted', 'Rejected'].includes(row.status) && (
                    <div className={`alert ${row.status === 'Waitlisted' ? 'alert-warn' : 'alert-error'}`} style={{ marginTop: '0.7rem' }}>
                      {row.status === 'Waitlisted'
                        ? 'Seats were full when you applied — you are on the waitlist and will be contacted if a seat opens up.'
                        : 'The college has closed this application. Contact the admission office for details.'}
                    </div>
                  )}
                </div>
                <div>
                  <h4>Details</h4>
                  <dl className="kv">
                    <div className="kv-row">
                      <dt>Interview date</dt>
                      <dd>{row.interview_date ? dateLabel(row.interview_date) : 'Not scheduled'}</dd>
                    </div>
                    <div className="kv-row">
                      <dt>Remarks from college</dt>
                      <dd>{row.remarks || '—'}</dd>
                    </div>
                    <div className="kv-row">
                      <dt>Email</dt>
                      <dd>{row.email}</dd>
                    </div>
                    <div className="kv-row">
                      <dt>Phone</dt>
                      <dd>{row.phone}</dd>
                    </div>
                    <div className="kv-row">
                      <dt>Admission office</dt>
                      <dd>
                        {row.admission_email || row.college_email}
                        {row.college_phone ? ` · ${row.college_phone}` : ''}
                      </dd>
                    </div>
                    <div className="kv-row">
                      <dt>College</dt>
                      <dd>
                        <Link to={`/colleges/${row.college_slug}`}>View college profile</Link>
                      </dd>
                    </div>
                  </dl>

                  {row.timeline?.length > 0 && (
                    <>
                      <h4 style={{ marginTop: '1rem' }}>Activity</h4>
                      <div className="timeline">
                        {row.timeline.map((t, i) => (
                          <div className="timeline-item" key={i}>
                            <span className="timeline-dot" />
                            <div>
                              <div style={{ fontSize: '0.9rem' }}>{t.message}</div>
                              <div className="small muted">{dateTimeLabel(t.created_at)}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {!loading && !rows.length && !error && (
            <EmptyState
              icon="🔎"
              title="No application loaded yet"
              hint="Enter your application number or registered email above. Updates appear here live as the college processes your application."
              action={
                <Link className="btn btn-outline" to="/colleges">
                  Explore colleges
                </Link>
              }
            />
          )}
        </div>
      </section>
    </Layout>
  );
}
