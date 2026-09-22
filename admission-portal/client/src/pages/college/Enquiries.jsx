import { useCallback, useEffect, useState } from 'react';
import { api } from '../../api.js';
import { useSocketEvent, useToast } from '../../hooks.jsx';
import { DataTable, ErrorBox, Field, FilterInput, Loader, Modal, Select, StatCard, Tabs, TextArea } from '../../components/ui.jsx';
import { dateTimeLabel, num, statusBadgeClass, timeAgo } from '../../lib/format.js';

const STATUSES = ['New', 'In Progress', 'Responded', 'Closed'];

export default function Enquiries() {
  const toast = useToast();
  const [status, setStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ status: 'In Progress', response: '' });
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await api.enquiries({ status });
      setData(res);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [status]);

  useEffect(() => {
    load();
  }, [load]);

  useSocketEvent('enquiry:created', () => load());
  useSocketEvent('enquiry:updated', () => load());

  const open = (row) => {
    setSelected(row);
    setForm({ status: row.status === 'New' ? 'In Progress' : row.status, response: row.response || '' });
  };

  const save = async () => {
    setBusy(true);
    try {
      const res = await api.updateEnquiry(selected.id, form);
      toast.success(res.message);
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const sendMailto = () => {
    const subject = `Re: Your enquiry about ${selected.course_name || 'admissions'}`;
    window.location.href = `mailto:${selected.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(form.response || '')}`;
  };

  if (error) return <ErrorBox error={error} onRetry={load} />;
  if (!data) return <Loader label="Loading enquiries…" />;

  const rows = search
    ? data.rows.filter((r) => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()))
    : data.rows;
  const tabs = [{ id: 'All', label: 'All', count: data.rows.length }, ...STATUSES.map((s) => ({ id: s, label: s, count: data.summary.find((x) => x.status === s)?.n || 0 }))];

  return (
    <div className="stack">
      <div className="dash-head">
        <div>
          <div className="eyebrow">Student communication</div>
          <h1>Enquiries</h1>
          <p className="muted" style={{ margin: 0 }}>
            Questions students send from your profile. Reply by email or mark them as responded.
          </p>
        </div>
      </div>

      <div className="grid-4">
        <StatCard label="Total enquiries" value={num(data.rows.length, '0')} icon="💬" />
        <StatCard label="New" value={num(data.summary.find((s) => s.status === 'New')?.n || 0, '0')} icon="🆕" tone="var(--primary-soft)" />
        <StatCard label="In progress" value={num(data.summary.find((s) => s.status === 'In Progress')?.n || 0, '0')} icon="✍️" tone="var(--amber-soft)" />
        <StatCard label="Responded" value={num(data.summary.find((s) => s.status === 'Responded')?.n || 0, '0')} icon="✅" tone="var(--green-soft)" />
      </div>

      <div className="card card-pad">
        <div className="hscroll" style={{ marginBottom: '0.8rem' }}>
          <Tabs tabs={tabs} value={status} onChange={setStatus} />
        </div>
        <FilterInput value={search} onChange={setSearch} placeholder="Search enquiries by name, email or message…" />
      </div>

      <DataTable
        rows={rows}
        onRowClick={open}
        columns={[
          {
            key: 'name',
            label: 'Student',
            render: (r) => (
              <>
                <b>{r.name}</b>
                <div className="small muted">
                  {r.email} {r.phone ? `· ${r.phone}` : ''}
                </div>
              </>
            ),
          },
          { key: 'course_name', label: 'About', render: (r) => r.course_name || 'General' },
          { key: 'message', label: 'Message', render: (r) => <span className="clamp-2">{r.message}</span> },
          { key: 'created_at', label: 'Received', render: (r) => <span title={dateTimeLabel(r.created_at)}>{timeAgo(r.created_at)}</span> },
          { key: 'status', label: 'Status', render: (r) => <span className={`badge ${statusBadgeClass(r.status)}`}>{r.status}</span> },
        ]}
        empty="No enquiries yet"
        actions={(row) => (
          <button className="btn btn-outline btn-sm" onClick={() => open(row)}>
            Respond
          </button>
        )}
      />

      {selected && (
        <Modal
          title={`Enquiry from ${selected.name}`}
          subtitle={[selected.course_name, selected.city].filter(Boolean).join(' · ')}
          onClose={() => setSelected(null)}
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setSelected(null)} disabled={busy}>
                Close
              </button>
              <button className="btn btn-outline" onClick={sendMailto} disabled={busy}>
                Reply by email
              </button>
              <button className="btn btn-primary" onClick={save} disabled={busy}>
                {busy ? 'Saving…' : 'Save'}
              </button>
            </>
          }
        >
          <div className="stack">
            <div className="alert alert-info" style={{ display: 'block' }}>
              <b>Student's question:</b>
              <div style={{ marginTop: '0.3rem' }}>{selected.message}</div>
              <div className="small muted" style={{ marginTop: '0.4rem' }}>
                Received {dateTimeLabel(selected.created_at)} · {selected.email} {selected.phone ? `· ${selected.phone}` : ''}
              </div>
            </div>
            <Field label="Status">
              <Select value={form.status} onChange={(v) => setForm((f) => ({ ...f, status: v }))} options={STATUSES} />
            </Field>
            <Field label="Your response" hint="Saved against the enquiry so your team can see what was communicated">
              <TextArea rows={5} value={form.response} onChange={(v) => setForm((f) => ({ ...f, response: v }))} />
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}
