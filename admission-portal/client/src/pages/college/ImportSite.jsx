import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import { useAuth, useToast } from '../../hooks.jsx';
import { Checkbox, Field, Loader, TextArea, TextInput } from '../../components/ui.jsx';
import { ENTITIES } from '../../entities.js';

const SECTION_KEYS = ['profile', 'departments', 'courses', 'placements', 'recruiters', 'hostels', 'transport', 'library', 'sports', 'facilities', 'scholarships', 'events', 'achievements', 'media'];

export default function ImportSite() {
  const { college, refresh } = useAuth();
  const toast = useToast();
  const [url, setUrl] = useState(college?.website || '');
  const [html, setHtml] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const [busy, setBusy] = useState(false);
  const [applying, setApplying] = useState(false);
  const [draft, setDraft] = useState(null);
  const [selected, setSelected] = useState(SECTION_KEYS);
  const [overwrite, setOverwrite] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const runImport = async () => {
    setBusy(true);
    setError('');
    setResult(null);
    try {
      const payload = showPaste && html.trim() ? { url: url || college?.website, html } : { url };
      const res = await api.importWebsite(payload);
      setDraft(res.draft);
      toast.success('Website analysed — review the draft below');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const apply = async () => {
    setApplying(true);
    setError('');
    try {
      const res = await api.applyImport({ draft, sections: selected, overwrite });
      setResult(res);
      toast.success(res.message);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setApplying(false);
    }
  };

  const toggle = (key) => setSelected((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]));

  return (
    <div className="stack">
      <div className="dash-head">
        <div>
          <div className="eyebrow">Import assistant</div>
          <h1>Fill your profile from your official website</h1>
          <p className="muted" style={{ margin: 0 }}>
            The portal reads the public pages of your website and prepares a draft — you review it, edit anything and
            then apply. Nothing is published until you confirm.
          </p>
        </div>
        <Link className="btn btn-outline btn-sm" to="/college/dashboard/profile">
          Edit profile manually
        </Link>
      </div>

      <div className="card card-pad stack">
        <div className="form-grid">
          <Field label="Official website URL" hint="We read the home page plus about, departments, courses, placements, hostel, library and gallery pages.">
            <TextInput value={url} onChange={setUrl} placeholder="https://www.yourcollege.edu.in" />
          </Field>
          <div className="row" style={{ alignItems: 'flex-end', gap: '0.6rem' }}>
            <button className="btn btn-primary" onClick={runImport} disabled={busy || (!url && !html)}>
              {busy ? 'Analysing website…' : 'Fetch & analyse'}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setShowPaste((v) => !v)}>
              {showPaste ? 'Hide paste option' : 'Site blocking bots? Paste page HTML'}
            </button>
          </div>
        </div>

        {showPaste && (
          <Field
            label="Paste your page HTML"
            hint="Open your college website, press Ctrl+U (or View source), copy everything and paste it here. The same extraction runs offline."
          >
            <TextArea value={html} onChange={setHtml} rows={5} placeholder="<html>…</html>" />
          </Field>
        )}

        {error && <div className="alert alert-error">⚠️ {error}</div>}
        <div className="alert alert-info small">
          We only read public pages, honour the website's terms, and never publish anything without your confirmation.
          Imported values keep a link to the source page.
        </div>
      </div>

      {busy && <Loader label="Reading your website…" />}

      {draft && !result && (
        <>
          <div className="card card-pad">
            <div className="row-between">
              <h3 style={{ margin: 0 }}>Draft ready</h3>
              <div className="row" style={{ gap: '0.4rem' }}>
                <span className="badge badge-blue">{draft.summary.pagesCrawled} page(s) read</span>
                <span className="badge badge-navy">{draft.pagesFound.length} section pages found</span>
              </div>
            </div>
            <div className="divider" />
            <div className="grid-4">
              {[
                ['Profile fields', draft.summary.profileFields],
                ['Departments', draft.summary.departments],
                ['Courses', draft.summary.courses],
                ['Recruiters', draft.summary.recruiters],
                ['Gallery images', draft.summary.media],
              ].map(([label, value]) => (
                <div className="stat" key={label}>
                  <div className="stat-label">{label}</div>
                  <div className="stat-value">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-pad">
            <h3>Collected profile details</h3>
            <dl className="kv">
              {Object.entries(draft.profile)
                .filter(([, v]) => v && typeof v !== 'object')
                .map(([key, value]) => (
                  <div className="kv-row" key={key}>
                    <dt>{key.replace(/_/g, ' ')}</dt>
                    <dd>{String(value).slice(0, 320)}</dd>
                  </div>
                ))}
              {draft.profile.social && Object.keys(draft.profile.social).length > 0 && (
                <div className="kv-row">
                  <dt>social</dt>
                  <dd>{Object.entries(draft.profile.social).map(([k, v]) => `${k}: ${v}`).join(' · ')}</dd>
                </div>
              )}
            </dl>
          </div>

          <div className="card card-pad">
            <h3>Sections to apply</h3>
            <p className="small muted">Choose what to add. Existing values are kept unless you tick “overwrite”.</p>
            <div className="grid-2">
              {SECTION_KEYS.map((key) => {
                const count = key === 'profile' ? Object.keys(draft.profile || {}).length : (draft[key] || []).length;
                return (
                  <div key={key} className="row-between" style={{ borderBottom: '1px dashed var(--line)', paddingBottom: '0.4rem' }}>
                    <Checkbox
                      checked={selected.includes(key)}
                      onChange={() => toggle(key)}
                      label={`${key === 'profile' ? 'College profile' : ENTITIES[key]?.plural || key} (${count})`}
                    />
                    {count > 0 && (
                      <button className="btn btn-ghost btn-sm" onClick={() => toggle(key)}>
                        {selected.includes(key) ? 'skip' : 'include'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="divider" />
            <Checkbox checked={overwrite} onChange={setOverwrite} label="Overwrite existing values with imported ones (otherwise only empty fields are filled)" />
            <div className="form-actions" style={{ marginTop: '1rem' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={apply}
                disabled={applying || (!selected.length && !overwrite)}
              >
                {applying ? 'Applying…' : `Apply ${selected.length} section(s) to my profile`}
              </button>
            </div>
          </div>
        </>
      )}

      {result && (
        <div className="card card-pad stack">
          <div className="alert alert-success">
            ✅ {result.message} — profile completeness is now <b>{result.completeness}%</b>.
          </div>
          <div className="grid-2">
            <div>
              <h4>Profile fields updated</h4>
              {result.applied.profile.length ? (
                <div className="chips">
                  {result.applied.profile.map((f) => (
                    <span className="chip" key={f}>
                      {f}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="small muted">No profile fields were changed (values already present).</p>
              )}
            </div>
            <div>
              <h4>Records added</h4>
              <ul className="small muted">
                {Object.entries(result.applied.entities).map(([key, count]) => (
                  <li key={key}>
                    {ENTITIES[key]?.plural || key}: <b>{count}</b>
                  </li>
                ))}
                {Object.keys(result.applied.entities).length === 0 && <li>No section records were added.</li>}
              </ul>
            </div>
          </div>
          <div className="row" style={{ gap: '0.5rem' }}>
            <Link className="btn btn-primary" to="/college/dashboard/profile">
              Review profile
            </Link>
            <Link className="btn btn-outline" to="/college/dashboard/section/courses">
              Review courses
            </Link>
            <a className="btn btn-ghost" href={`/colleges/${college?.slug}`} target="_blank" rel="noreferrer">
              See public page ↗
            </a>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setDraft(null);
                setResult(null);
              }}
            >
              Import again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
