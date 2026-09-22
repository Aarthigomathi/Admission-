import { useEffect, useState } from 'react';
import { api } from '../../api.js';
import { useAuth, useToast } from '../../hooks.jsx';
import { Checkbox, Field, FileField, Loader, Select, TagsInput, TextArea, TextInput } from '../../components/ui.jsx';
import { COLLEGE_PROFILE_FIELDS } from '../../entities.js';
import { dateTimeLabel } from '../../lib/format.js';

const GROUPS = [
  { title: 'Identity & recognition', fields: ['name', 'short_name', 'type', 'ownership', 'established_year', 'affiliation', 'accreditation', 'accreditation_valid_till', 'approval_body', 'nirf_rank', 'ranking_source', 'motto'] },
  { title: 'About the college', fields: ['about', 'vision', 'mission', 'highlights'] },
  { title: 'Contact & location', fields: ['address', 'city', 'state', 'pincode', 'country', 'latitude', 'longitude', 'phone', 'alt_phone', 'email', 'admission_email', 'website', 'admissions_url', 'source_url'] },
  { title: 'Branding', fields: ['logo_url', 'cover_url'] },
  { title: 'Campus & scale', fields: ['campus_area', 'campus_area_acres', 'total_students', 'total_faculty', 'student_faculty_ratio', 'gender_ratio', 'hostel_available', 'transport_available'] },
  { title: 'Social media', fields: ['facebook', 'instagram', 'linkedin', 'youtube'] },
];

export default function ProfileEditor() {
  const { college, refresh } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!college) return;
    api
      .dashboard()
      .then((d) => setForm(d.college))
      .catch((err) => toast.error(err.message));
  }, [college, toast]);

  if (!form) return <Loader label="Loading your profile…" />;

  const fieldDef = (name) => COLLEGE_PROFILE_FIELDS.find((f) => f.name === name);
  const set = (name) => (value) => setForm((f) => ({ ...f, [name]: value }));

  const missingRequired = COLLEGE_PROFILE_FIELDS.filter((f) => f.required && !String(form[f.name] ?? '').trim());

  const save = async () => {
    setBusy(true);
    setErrors({});
    try {
      const payload = {};
      for (const field of COLLEGE_PROFILE_FIELDS) {
        payload[field.name] = form[field.name] ?? null;
      }
      const res = await api.updateProfile(payload);
      toast.success('College profile saved — students see the update immediately');
      await refresh();
      setForm(res.college);
    } catch (err) {
      toast.error(err.message);
      setErrors({ _form: err.message });
    } finally {
      setBusy(false);
    }
  };

  const renderField = (name) => {
    const field = fieldDef(name);
    if (!field) return null;
    const value = form[name];
    const span = ['text', 'textarea', 'image', 'file', 'tags'].includes(field.type) && ['about', 'vision', 'mission', 'address', 'highlights'].includes(name) ? 'col-span-2' : '';
    return (
      <Field key={name} label={field.label} hint={field.hint} required={field.required} className={span}>
        {field.type === 'textarea' ? (
          <TextArea value={value} onChange={set(name)} rows={name === 'about' ? 6 : 3} />
        ) : field.type === 'select' ? (
          <Select value={value} onChange={set(name)} options={field.options || []} placeholder="Select…" />
        ) : field.type === 'boolean' ? (
          <Checkbox checked={Boolean(value)} onChange={set(name)} label={field.label} />
        ) : field.type === 'tags' ? (
          <TagsInput value={Array.isArray(value) ? value : []} onChange={set(name)} />
        ) : field.type === 'image' ? (
          <FileField value={value} onChange={set(name)} kind="image" />
        ) : field.type === 'number' ? (
          <TextInput type="number" value={value ?? ''} onChange={set(name)} />
        ) : (
          <TextInput value={value ?? ''} onChange={set(name)} placeholder={field.hint} />
        )}
      </Field>
    );
  };

  return (
    <div className="stack">
      <div className="dash-head">
        <div>
          <div className="eyebrow">College profile</div>
          <h1>Institution details</h1>
          <p className="muted" style={{ margin: 0 }}>
            {form.verified ? (
              <>
                ✅ Confirmed by your college · last saved {dateTimeLabel(form.data_verified_at)}
              </>
            ) : (
              <>⏳ These details were imported from {form.source_url || 'your website'} and are not confirmed yet.</>
            )}
          </p>
        </div>
        <div className="row" style={{ gap: '0.5rem' }}>
          <a className="btn btn-outline btn-sm" href={`/colleges/${form.slug}`} target="_blank" rel="noreferrer">
            Preview public page ↗
          </a>
          <button className="btn btn-primary" onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </div>

      {errors._form && <div className="alert alert-error">⚠️ {errors._form}</div>}
      {missingRequired.length > 0 && (
        <div className="alert alert-warn">
          Required details missing: {missingRequired.map((f) => f.label).join(', ')}
        </div>
      )}

      <div className="card card-pad stack">
        {GROUPS.map((group) => (
          <div className="form-grid" key={group.title}>
            <div className="field-group-title">{group.title}</div>
            {group.fields.map(renderField)}
          </div>
        ))}
        <div className="form-actions">
          <button className="btn btn-primary btn-lg" onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </div>
    </div>
  );
}
