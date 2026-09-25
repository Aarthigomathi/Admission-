import { useCallback, useEffect, useState } from 'react';
import { api, downloadApplicationsCsv } from '../../api.js';
import { useSocketEvent, useToast } from '../../hooks.jsx';
import { BarList, DataTable, ErrorBox, Field, FilterInput, Loader, Modal, Select, Tabs, TextArea, StatCard } from '../../components/ui.jsx';
import { dateLabel, num, statusBadgeClass, timeAgo } from '../../lib/format.js';

const STATUSES = ['Submitted', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Document Verification', 'Provisionally Selected', 'Confirmed', 'Waitlisted', 'Rejected'];

export default function Applications() {
  const toast = useToast();
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: '', remarks: '', interview_date: '' });
  const [busy, setBusy] = useState(false);
  const [newCount, setNewCount] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await api.applications({ status, q: search });
      setData(res);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [status, search]);

  useEffect(() => {
    load();
  }, [load]);

  useSocketEvent('application:created', (row) => {
    setNewCount((n) => n + 1);
    load();
  });
  useSocketEvent('application:updated', () => load());

  const openDetail = (row) => {
    setSelected(row);
    setForm({ status: row.status, remarks: row.remarks || '', interview_date: row.interview_date || '' });
  };

  const save = async () => {
    setBusy(true);
    try {
      const res = await api.updateApplication(selected.id, form);
      toast.success(res.message);
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (error) return <ErrorBox error={error} onRetry={load} />;
  if (!data) return <Loader label="Loading applications…" />;

  const tabs = [{ id: 'All', label: 'All', count: data.rows.length }, ...STATUSES.map((s) => ({ id: s, label: s, count: data.summary.find((x) => x.status === s)?.n || 0 }))];

  return (
    <div className="stack">
      <div className="dash-head">
        <div>
          <div className="eyebrow">Admissions</div>
          <h1>Applications</h1>
          <p className="muted" style={{ margin: 0 }}>
            Applications arrive here instantly. Update the status and the student sees it live on their tracking page.
          </p>
        </div>
        <div className="row" style={{ gap: '0.5rem' }}>
          {newCount > 0 && <span className="badge badge-green">+{newCount} new since you opened this page</span>}
          <button className="btn btn-outline btn-sm" onClick={() => downloadApplicationsCsv().catch((e) => toast.error(e.message))}>
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid-4">
        <StatCard label="Total applications" value={num(data.rows.length, '0')} icon="📝" />
        <StatCard label="Awaiting review" value={num(data.summary.find((s) => s.status === 'Submitted')?.n || 0, '0')} icon="⏳" tone="var(--amber-soft)" />
        <StatCard label="Shortlisted / interview" value={num((data.summary.find((s) => s.status === 'Shortlisted')?.n || 0) + (data.summary.find((s) => s.status === 'Interview Scheduled')?.n || 0), '0')} icon="🗓️" />
        <StatCard label="Confirmed" value={num(data.summary.find((s) => s.status === 'Confirmed')?.n || 0, '0')} icon="✅" tone="var(--green-soft)" />
      </div>

      <div className="card card-pad">
        <div className="hscroll" style={{ marginBottom: '0.8rem' }}>
          <Tabs tabs={tabs} value={status} onChange={setStatus} />
        </div>
        <FilterInput value={search} onChange={setSearch} placeholder="Search by name, email, phone or application number…" />
      </div>

      <div className="grid-2">
        <div className="card card-pad">
          <h4>Status distribution</h4>
          <BarList data={data.summary} labelKey="status" />
        </div>
        <div className="card card-pad">
          <h4>Applications per course</h4>
          <BarList
            data={Object.entries(
              data.rows.reduce((acc, row) => {
                acc[row.course_name || 'Unspecified'] = (acc[row.course_name || 'Unspecified'] || 0) + 1;
                return acc;
              }, {}),
            )
              .map(([course_name, n]) => ({ course_name, n }))
              .sort((a, b) => b.n - a.n)
              .slice(0, 8)}
            labelKey="course_name"
          />
        </div>
      </div>

      <DataTable
        rows={data.rows}
        onRowClick={openDetail}
        columns={[
          { key: 'application_no', label: 'Application', render: (r) => <b className="mono">{r.application_no}</b> },
          {
            key: 'student_name',
            label: 'Applicant',
            render: (r) => (
              <>
                <b>{r.student_name}</b>
                <div className="small muted">{r.email}</div>
              </>
            ),
          },
          { key: 'phone', label: 'Phone' },
          { key: 'course_name', label: 'Course', render: (r) => <span className="clamp-2">{r.course_name}</span> },
          { key: 'percentage', label: 'Marks', align: 'right', render: (r) => (r.percentage ? `${r.percentage}%` : r.marks_obtained || '—') },
          { key: 'category', label: 'Category' },
          { key: 'created_at', label: 'Received', render: (r) => <span title={dateLabel(r.created_at)}>{timeAgo(r.created_at)}</span> },
          { key: 'status', label: 'Status', render: (r) => <span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span> },
        ]}
        empty="No applications yet"
        actions={(row) => (
          <button className="btn btn-outline btn-sm" onClick={() => openDetail(row)}>
            Open
          </button>
        )}
      />

      {selected && (
        <Modal
          title={`${selected.student_name} · ${selected.application_no}`}
          subtitle={selected.course_name}
          size="wide"
          onClose={() => setSelected(null)}
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setSelected(null)} disabled={busy}>
                Close
              </button>
              <button className="btn btn-primary" onClick={save} disabled={busy}>
                {busy ? 'Saving…' : 'Update application'}
              </button>
            </>
          }
        >
          <div className="split" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
            <div className="stack">
              <dl className="kv">
                <div className="kv-row">
                  <dt>Email / phone</dt>
                  <dd>
                    {selected.email} · {selected.phone}
                  </dd>
                </div>
                <div className="kv-row">
                  <dt>Date of birth / gender</dt>
                  <dd>
                    {selected.dob ? dateLabel(selected.dob) : '—'} · {selected.gender || '—'}
                  </dd>
                </div>
                <div className="kv-row">
                  <dt>Category</dt>
                  <dd>{selected.category || '—'}</dd>
                </div>
                <div className="kv-row">
                  <dt>Board / university</dt>
                  <dd>{selected.board_university || '—'}</dd>
                </div>
                <div className="kv-row">
                  <dt>Qualifying exam</dt>
                  <dd>{selected.qualifying_exam || '—'}</dd>
                </div>
                <div className="kv-row">
                  <dt>Marks</dt>
                  <dd>
                    {selected.marks_obtained || '—'} {selected.percentage ? `(${selected.percentage}%)` : ''}
                  </dd>
                </div>
                <div className="kv-row">
                  <dt>Address</dt>
                  <dd>
                    {[selected.address, selected.city, selected.state, selected.pincode].filter(Boolean).join(', ') || '—'}
                  </dd>
                </div>
                <div className="kv-row">
                  <dt>Submitted</dt>
                  <dd>{dateLabel(selected.created_at)}</dd>
                </div>
              </dl>
              {selected.statement && (
                <div>
                  <h4>Applicant statement</h4>
                  <p className="small" style={{ whiteSpace: 'pre-wrap' }}>{selected.statement}</p>
                </div>
              )}
            </div>

            <div className="stack">
              <Field label="Status">
                <Select value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v }))} options={STATUSES} />
              </Field>
              <Field label="Interview / counselling date">
                <input className="input" type="date" value={form.interview_date || ''} onChange={(e) => setForm((f) => ({ ...f, interview_date: e.target.value }))} />
              </Field>
              <Field label="Remarks shown to the student">
                <TextArea rows={5} value={form.remarks} onChange={(v) => setForm((f) => ({ ...f, remarks: v }))} />
              </Field>
              <div className="alert alert-info small">
                Changing the status sends a live update to the student's tracking page and to their application
                notification.
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
