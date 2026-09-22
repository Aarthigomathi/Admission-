import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../../api.js';
import { useSocketEvent, useToast } from '../../hooks.jsx';
import {
  Checkbox,
  ConfirmDialog,
  DataTable,
  EmptyState,
  ErrorBox,
  Field,
  FileField,
  FilterInput,
  Loader,
  Modal,
  Select,
  TagsInput,
  TextArea,
  TextInput,
} from '../../components/ui.jsx';
import { ENTITIES } from '../../entities.js';
import { dateLabel, inr, statusBadgeClass } from '../../lib/format.js';

const TITLE_KEY = {
  courses: 'name',
  departments: 'name',
  faculty: 'name',
  fees: 'course_name',
  placements: 'academic_year',
  recruiters: 'name',
  internships: 'company',
  hostels: 'name',
  transport: 'route_name',
  library: 'name',
  sports: 'sport_name',
  infrastructure: 'name',
  facilities: 'name',
  scholarships: 'name',
  events: 'title',
  achievements: 'title',
  media: 'title',
  documents: 'title',
};

export default function SectionManager() {
  const { section } = useParams();
  const entity = ENTITIES[section];
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formError, setFormError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.sectionRows(section);
      setRows(data.rows || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [section]);

  useEffect(() => {
    if (entity) {
      load();
      setEditing(null);
      setForm({});
    }
  }, [section, entity, load]);

  useSocketEvent('college:data-changed', (payload) => {
    if (payload?.entity === section) load();
  });

  const columns = useMemo(() => {
    if (!entity) return [];
    const listed = entity.fields.filter((f) => f.list).slice(0, 5);
    const cols = listed.map((field) => ({
      key: field.name,
      label: field.label,
      align: ['number', 'currency', 'percent'].includes(field.type) ? 'right' : undefined,
      render: (row) => {
        const value = row[field.name];
        if (value === null || value === undefined || value === '') return <span className="muted">—</span>;
        if (field.type === 'boolean') return value ? '✅' : '—';
        if (field.type === 'currency') return inr(value);
        if (field.type === 'percent') return `${value}%`;
        if (field.type === 'date') return dateLabel(value);
        if (field.type === 'select') {
          const cls = ['admission_status', 'status'].includes(field.name) ? statusBadgeClass(value) : 'badge-gray';
          return <span className={`badge ${cls}`}>{value}</span>;
        }
        if (field.type === 'tags') return <span className="small">{(Array.isArray(value) ? value : []).slice(0, 3).join(', ') || '—'}</span>;
        if (field.name === 'url' || field.name === 'file_url' || field.name === 'image_url' || field.name === 'logo_url') {
          return (
            <a href={value} target="_blank" rel="noreferrer" className="small">
              open ↗
            </a>
          );
        }
        const text = String(value);
        return <span className={text.length > 48 ? 'clamp-2' : ''}>{text.length > 90 ? `${text.slice(0, 90)}…` : text}</span>;
      },
    }));
    return cols;
  }, [entity]);


  const filtered = useMemo(() => {
    if (!search) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(q));
  }, [rows, search]);

  if (!entity) {
    return (
      <EmptyState
        icon="❓"
        title="Unknown section"
        hint="Pick a section from the sidebar."
        action={
          <Link className="btn btn-outline" to="/college/dashboard">
            Back to overview
          </Link>
        }
      />
    );
  }

  const openCreate = () => {
    const initial = {};
    for (const field of entity.fields) {
      if (field.default !== undefined) initial[field.name] = field.default;
      if (field.type === 'boolean') initial[field.name] = initial[field.name] ?? 0;
      if (field.type === 'select' && field.default) initial[field.name] = field.default;
    }
    setForm(initial);
    setFormError('');
    setEditing({ __new: true });
  };

  const openEdit = (row) => {
    setForm({ ...row });
    setFormError('');
    setEditing(row);
  };

  const setField = (name, type) => (value) => setForm((f) => ({ ...f, [name]: value }));

  const submit = async () => {
    const missing = entity.fields.filter((f) => f.required && !String(form[f.name] ?? '').trim());
    if (missing.length) {
      setFormError(`Please fill: ${missing.map((f) => f.label).join(', ')}`);
      return;
    }
    setBusy(true);
    setFormError('');
    try {
      if (editing.__new) {
        const res = await api.createRow(section, form);
        toast.success(res.message);
      } else {
        const res = await api.updateRow(section, editing.id, form);
        toast.success(res.message);
      }
      setEditing(null);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async () => {
    setBusy(true);
    try {
      const res = await api.deleteRow(section, confirmDelete.id);
      toast.success(res.message);
      setConfirmDelete(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const togglePublished = async (row) => {
    try {
      await api.updateRow(section, row.id, { is_published: row.is_published ? 0 : 1 });
      toast.success(row.is_published ? 'Hidden from students' : 'Now visible to students');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const seatSummary = section === 'courses' ? rows.reduce((acc, r) => ({ intake: acc.intake + (r.intake_seats || 0), filled: acc.filled + (r.filled_seats || 0) }), { intake: 0, filled: 0 }) : null;

  return (
    <div className="stack">
      <div className="dash-head">
        <div>
          <div className="eyebrow">
            {entity.icon} Profile section
          </div>
          <h1>{entity.plural}</h1>
          <p className="muted" style={{ margin: 0 }}>
            {entity.description}
          </p>
        </div>
        <div className="row" style={{ gap: '0.5rem' }}>
          <FilterInput value={search} onChange={setSearch} placeholder="Search in this section…" />
          <button className="btn btn-primary" onClick={openCreate}>
            + Add {entity.label.toLowerCase()}
          </button>
        </div>
      </div>

      {seatSummary && (
        <div className="row" style={{ gap: '0.5rem' }}>
          <span className="badge badge-blue">Total intake: {seatSummary.intake}</span>
          <span className="badge badge-green">Available: {Math.max(0, seatSummary.intake - seatSummary.filled)}</span>
          <span className="badge badge-navy">Filled: {seatSummary.filled}</span>
          <span className="small muted">Update the “Seats filled” field of a course — students see it live.</span>
        </div>
      )}

      <ErrorBox error={error} onRetry={load} />
      {loading ? (
        <Loader label={`Loading ${entity.plural.toLowerCase()}…`} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={entity.icon}
          title={`No ${entity.plural.toLowerCase()} added yet`}
          hint={`Add your first ${entity.label.toLowerCase()} or import it from your official website.`}
          action={
            <div className="row" style={{ justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={openCreate}>
                + Add {entity.label.toLowerCase()}
              </button>
              <Link className="btn btn-outline" to="/college/dashboard/import">
                Import from website
              </Link>
            </div>
          }
        />
      ) : (
        <DataTable
          rows={filtered}
          columns={columns}
          empty={`No ${entity.plural.toLowerCase()} yet`}
          actions={(row) => (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => openEdit(row)}>
                Edit
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => togglePublished(row)} title={row.is_published ? 'Hide from students' : 'Show to students'}>
                {row.is_published ? '👁️' : '🚫'}
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(row)}>
                Delete
              </button>
            </>
          )}
        />
      )}

      {editing && (
        <Modal
          title={editing.__new ? `Add ${entity.label.toLowerCase()}` : `Edit ${entity.label.toLowerCase()}`}
          subtitle={`${entity.plural} · changes are visible to students immediately`}
          size="wide"
          onClose={() => setEditing(null)}
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setEditing(null)} disabled={busy}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submit} disabled={busy}>
                {busy ? 'Saving…' : editing.__new ? `Save ${entity.label.toLowerCase()}` : 'Save changes'}
              </button>
            </>
          }
        >
          <div className="stack">
            {formError && <div className="alert alert-error">⚠️ {formError}</div>}
            <div className="form-grid">
              {entity.fields.map((field) => {
                const wide = ['textarea', 'tags', 'image', 'file'].includes(field.type);
                return (
                  <Field
                    key={field.name}
                    label={field.label}
                    hint={field.hint}
                    required={field.required}
                    className={wide ? 'col-span-2' : ''}
                  >
                    {field.type === 'textarea' ? (
                      <TextArea value={form[field.name]} onChange={setField(field.name)} rows={3} />
                    ) : field.type === 'select' ? (
                      <Select value={form[field.name]} onChange={setField(field.name)} options={field.options || []} placeholder="Select…" />
                    ) : field.type === 'boolean' ? (
                      <Checkbox checked={Boolean(form[field.name])} onChange={setField(field.name)} label={field.label} />
                    ) : field.type === 'tags' ? (
                      <TagsInput value={Array.isArray(form[field.name]) ? form[field.name] : []} onChange={setField(field.name)} hint={field.hint} />
                    ) : field.type === 'image' ? (
                      <FileField value={form[field.name]} onChange={setField(field.name)} kind="image" hint={field.hint} />
                    ) : field.type === 'file' ? (
                      <FileField value={form[field.name]} onChange={setField(field.name)} kind="document" hint={field.hint} />
                    ) : field.type === 'number' || field.type === 'currency' || field.type === 'percent' ? (
                      <TextInput type="number" step="any" value={form[field.name] ?? ''} onChange={setField(field.name)} />
                    ) : field.type === 'date' ? (
                      <TextInput type="date" value={form[field.name] ?? ''} onChange={setField(field.name)} />
                    ) : (
                      <TextInput
                        value={form[field.name] ?? ''}
                        onChange={setField(field.name)}
                        placeholder={field.type === 'url' ? 'https://…' : field.hint}
                        type={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : 'text'}
                      />
                    )}
                  </Field>
                );
              })}
            </div>
            <Checkbox
              checked={Boolean(form.is_published ?? 1)}
              onChange={(v) => setForm((f) => ({ ...f, is_published: v ? 1 : 0 }))}
              label="Visible to students on the public profile"
            />
          </div>
        </Modal>
      )}

      {confirmDelete && (
        <ConfirmDialog
          title={`Delete this ${entity.label.toLowerCase()}?`}
          message={`“${confirmDelete[TITLE_KEY[section]] || confirmDelete.name || confirmDelete.title || 'this record'}” will be removed from your public profile. This cannot be undone.`}
          confirmLabel="Delete"
          busy={busy}
          onConfirm={doDelete}
          onClose={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
