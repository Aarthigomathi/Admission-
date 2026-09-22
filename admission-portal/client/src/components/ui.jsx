import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth, useLiveStatus, useSocketEvent, useToast } from '../hooks.jsx';
import { compact, timeAgo } from '../lib/format.js';

/* ------------------------------------------------------------------ *
 * Layout
 * ------------------------------------------------------------------ */
export function Layout({ children, wide = false }) {
  return (
    <div className="app">
      <Navbar />
      <main className={wide ? '' : ''}>{children}</main>
      <Footer />
    </div>
  );
}

export function Navbar() {
  const { session, logout } = useAuth();
  const live = useLiveStatus();
  const navigate = useNavigate();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          <span className="brand-logo">🎓</span>
          <span>
            CampusConnect
            <div style={{ fontFamily: 'var(--font)', fontSize: '0.7rem', fontWeight: 500, color: 'var(--muted)' }}>
              College Admission Portal
            </div>
          </span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/colleges" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Explore colleges
          </NavLink>
          <NavLink to="/seats" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Live seat availability
          </NavLink>
          <NavLink to="/track" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Track application
          </NavLink>
          {session && (
            <NavLink to="/college/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              College dashboard
            </NavLink>
          )}
        </nav>

        <div className="spacer" />

        <span className={`badge ${live ? 'badge-green' : 'badge-gray'}`} title={live ? 'Realtime updates connected' : 'Reconnecting…'}>
          <span className={`dot ${live ? 'dot-live' : ''}`} /> {live ? 'Live' : 'Offline'}
        </span>

        {session ? (
          <div className="row" style={{ gap: '0.4rem' }}>
            <Link className="btn btn-outline btn-sm" to="/college/dashboard">
              {session.college?.name?.slice(0, 22) || 'Dashboard'}
            </Link>
            <button
              className="btn btn-ghost btn-sm"
              onClick={async () => {
                await logout();
                navigate('/');
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="row" style={{ gap: '0.4rem' }}>
            <Link className="btn btn-outline btn-sm" to="/college/login">
              College login
            </Link>
            <Link className="btn btn-primary btn-sm" to="/college/register">
              Register college
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export function Footer() {
  const stats = useStats();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ color: '#fff' }}>
              <span className="brand-logo">🎓</span> CampusConnect
            </div>
            <p style={{ marginTop: '0.8rem', fontSize: '0.9rem' }}>
              A real-time admission platform where colleges publish and maintain their complete profile and students
              search, compare, track seat availability and apply — all from one place.
            </p>
            <div className="row" style={{ gap: '0.5rem', fontSize: '0.85rem' }}>
              <span className="badge badge-green">
                <span className="dot dot-live" /> {compact(stats?.colleges || 0)} colleges live
              </span>
              <span className="badge badge-blue">{compact(stats?.seatsAvailable || 0)} seats available</span>
            </div>
          </div>
          <div>
            <h4>For students</h4>
            <ul>
              <li>
                <Link to="/colleges">Search colleges</Link>
              </li>
              <li>
                <Link to="/seats">Live seat availability</Link>
              </li>
              <li>
                <Link to="/track">Track your application</Link>
              </li>
              <li>
                <Link to="/colleges?sort=package">Highest package colleges</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>For colleges</h4>
            <ul>
              <li>
                <Link to="/college/register">Register your college</Link>
              </li>
              <li>
                <Link to="/college/login">College sign in</Link>
              </li>
              <li>
                <Link to="/college/dashboard">Manage profile</Link>
              </li>
              <li>
                <Link to="/track">Admission enquiries</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Platform</h4>
            <ul>
              <li>One verified login per college</li>
              <li>18 profile sections</li>
              <li>Realtime seat &amp; status updates</li>
              <li>
                <a href="/api/health" target="_blank" rel="noreferrer">
                  System status
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} CampusConnect — built as a demonstration admission portal.</span>
          <span>
            College details are maintained by each college from its official website and are marked accordingly.
          </span>
        </div>
      </div>
    </footer>
  );
}

let statsCache = null;
export function useStats() {
  const [stats, setStats] = useState(statsCache);
  useEffect(() => {
    let alive = true;
    api
      .stats()
      .then((data) => {
        statsCache = data;
        if (alive) setStats(data);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  useSocketEvent('stats:updated', setStats);
  return stats;
}

/* ------------------------------------------------------------------ *
 * Primitive components
 * ------------------------------------------------------------------ */
export function Loader({ label = 'Loading…' }) {
  return (
    <div className="loading-block">
      <div className="spinner" />
      <span>{label}</span>
    </div>
  );
}

export function ErrorBox({ error, onRetry }) {
  if (!error) return null;
  return (
    <div className="alert alert-error">
      <span>⚠️</span>
      <div style={{ flex: 1 }}>
        {String(error)}
        {onRetry && (
          <>
            {' '}
            <button className="btn btn-sm btn-outline" style={{ marginLeft: '0.6rem' }} onClick={onRetry}>
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ icon = '🗂️', title, hint, action }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <h4 style={{ marginBottom: '0.2rem' }}>{title}</h4>
      {hint && <p className="small">{hint}</p>}
      {action}
    </div>
  );
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={value === tab.id}
          className={`tab${value === tab.id ? ' tab-active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {tab.count !== undefined && tab.count !== null && <span className="muted"> · {tab.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Modal({ title, subtitle, onClose, children, footer, size = 'normal' }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={`modal${size === 'wide' ? ' modal-wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <div>
            <h3>{title}</h3>
            {subtitle && <div className="small muted">{subtitle}</div>}
          </div>
          <button className="close-x" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title = 'Are you sure?', message, confirmLabel = 'Confirm', onConfirm, onClose, danger = true, busy }) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-outline" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm} disabled={busy}>
            {busy ? 'Working…' : confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ margin: 0 }}>{message}</p>
    </Modal>
  );
}

export function StatCard({ label, value, sub, icon, tone }) {
  return (
    <div className="stat">
      <div className="row" style={{ gap: '0.6rem', alignItems: 'flex-start' }}>
        {icon && <div className="stat-icon" style={tone ? { background: tone } : undefined}>{icon}</div>}
        <div style={{ flex: 1 }}>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
          {sub && <div className="stat-sub">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

export function ProgressRing({ value = 0, label, size = 'normal' }) {
  return (
    <div className={`ring${size === 'lg' ? ' ring-lg' : ''}`} style={{ '--value': Math.max(0, Math.min(100, value)) }}>
      <b>{value}%</b>
      {label && <span className="small muted">{label}</span>}
    </div>
  );
}

export function Progress({ value, tone = '' }) {
  return (
    <div className={`progress ${tone}`}>
      <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Form fields
 * ------------------------------------------------------------------ */
export function Field({ label, hint, error, required, children, className = '' }) {
  return (
    <label className={`field ${className}`}>
      {label && (
        <span className="field-label">
          {label} {required && <span className="req">*</span>}
        </span>
      )}
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  );
}

export function TextInput({ value, onChange, ...rest }) {
  return <input className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />;
}

export function TextArea({ value, onChange, rows = 4, ...rest }) {
  return <textarea className="textarea" rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} />;
}

export function Select({ value, onChange, options = [], placeholder, ...rest }) {
  return (
    <select className="select" value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest}>
      {(placeholder || !rest.multiple) && <option value="">{placeholder || 'Select…'}</option>}
      {options.map((opt) => {
        const val = typeof opt === 'string' ? opt : opt.value;
        const lbl = typeof opt === 'string' ? opt : opt.label;
        return (
          <option key={val} value={val}>
            {lbl}
          </option>
        );
      })}
    </select>
  );
}

export function Checkbox({ checked, onChange, label }) {
  return (
    <label className="checkbox">
      <input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export function TagsInput({ value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('');
  const list = Array.isArray(value) ? value : String(value || '').split(',').filter(Boolean);
  const add = (raw) => {
    const parts = String(raw)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) onChange([...new Set([...list, ...parts])]);
    setDraft('');
  };
  return (
    <div>
      <div className="row" style={{ gap: '0.4rem', marginBottom: list.length ? '0.5rem' : 0 }}>
        {list.map((tag, i) => (
          <span className="chip" key={`${tag}-${i}`}>
            {tag}
            <button
              type="button"
              className="close-x"
              style={{ width: 20, height: 20, marginLeft: 6, fontSize: '0.7rem' }}
              onClick={() => onChange(list.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <input
        className="input"
        value={draft}
        placeholder={placeholder || 'Type and press Enter (comma separated allowed)'}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add(draft);
          }
          if (e.key === 'Backspace' && !draft && list.length) onChange(list.slice(0, -1));
        }}
        onBlur={() => draft && add(draft)}
      />
    </div>
  );
}

/** File upload field (images & documents) with preview and manual URL entry. */
export function FileField({ value, onChange, kind = 'image', hint }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  const toast = useToast();
  const accept = kind === 'image' ? 'image/*' : '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt';

  const send = async (file) => {
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const res = await api.upload(file);
      onChange(res.file.url);
      toast.success(`Uploaded ${res.file.name}`);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stack-sm">
      <div
        className={`upload-drop${drag ? ' drag' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          send(e.dataTransfer.files?.[0]);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e) => {
            send(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <div className="small muted" style={{ marginBottom: '0.4rem' }}>
          {busy ? 'Uploading…' : `Drag & drop or choose a ${kind === 'image' ? 'photo' : 'document'} (max 8 MB)`}
        </div>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? 'Uploading…' : `Choose ${kind === 'image' ? 'image' : 'file'}`}
        </button>
      </div>
      <input className="input" placeholder="…or paste an image / file URL" value={value || ''} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
      {kind === 'image' && value && <img className="preview-img" src={value} alt="Preview" onError={(e) => (e.currentTarget.style.display = 'none')} />}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Live pieces
 * ------------------------------------------------------------------ */
export function LiveFeed({ limit = 12, title = 'Live updates', light = false, className = '' }) {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    api.updates(limit).then((d) => setRows(d.rows || [])).catch(() => {});
  }, [limit]);

  useSocketEvent('activity:new', (row) => {
    if (!row || row.visibility !== 'public') return;
    setRows((list) => [row, ...list].slice(0, limit));
  });

  return (
    <div className={className}>
      <div className="row-between" style={{ marginBottom: '0.6rem' }}>
        <h4 style={{ margin: 0, color: light ? undefined : '#fff' }}>
          <span className="dot dot-live" style={{ display: 'inline-block', marginRight: 8 }} />
          {title}
        </h4>
        <span className="small muted">{rows.length} recent</span>
      </div>
      <div className={`feed${light ? ' feed-light' : ''}`}>
        {rows.length === 0 && <div className="small muted">Waiting for activity…</div>}
        {rows.map((row) => (
          <div className="feed-item" key={row.id}>
            <span>📌</span>
            <div style={{ flex: 1 }}>
              <div>{row.message}</div>
              <div className="small muted">
                {row.college_slug ? <Link to={`/colleges/${row.college_slug}`}>{row.college_name}</Link> : 'Portal'} ·{' '}
                {timeAgo(row.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SeatPill({ available, intake }) {
  const ratio = intake ? available / intake : 0;
  const cls = available <= 0 ? 'badge-red' : ratio <= 0.15 ? 'badge-amber' : 'badge-green';
  return (
    <span className={`badge ${cls}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {available > 0 ? `${available} of ${intake} seats` : 'Seats full'}
    </span>
  );
}

export function SearchBox({ value, onChange, onSubmit, placeholder, action }) {
  return (
    <form
      className="hero-search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value);
      }}
    >
      <span style={{ alignSelf: 'center', paddingLeft: '0.6rem' }}>🔍</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label="Search" />
      {action || (
        <button className="btn btn-primary" type="submit">
          Search
        </button>
      )}
    </form>
  );
}

/** Debounced filter input for list pages. */
export function FilterInput({ value, onChange, placeholder, delay = 400 }) {
  const [local, setLocal] = useState(value || '');
  const timer = useRef();
  useEffect(() => setLocal(value || ''), [value]);
  return (
    <input
      className="input"
      value={local}
      placeholder={placeholder}
      onChange={(e) => {
        const next = e.target.value;
        setLocal(next);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => onChange(next), delay);
      }}
    />
  );
}

export function Breadcrumbs({ items = [] }) {
  return (
    <div className="breadcrumb">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`}>
          {item.to ? <Link to={item.to}>{item.label}</Link> : item.label}
          {i < items.length - 1 && ' ›'}
        </span>
      ))}
    </div>
  );
}

export function DataTable({ columns, rows, empty = 'No records yet', rowKey = (r) => r.id, actions, onRowClick, flashKey }) {
  const [flashed, setFlashed] = useState(null);
  useEffect(() => {
    if (flashKey === undefined || flashKey === null) return;
    setFlashed(flashKey);
    const t = setTimeout(() => setFlashed(null), 1500);
    return () => clearTimeout(t);
  }, [flashKey]);

  if (!rows?.length) return <EmptyState title={empty} hint="Add your first record to see it here." />;

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.align === 'right' ? 'num' : ''}>
                {col.label}
              </th>
            ))}
            {actions && <th style={{ textAlign: 'right' }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={flashed && flashed === rowKey(row) ? 'flash' : ''}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              style={onRowClick ? { cursor: 'pointer' } : undefined}
            >
              {columns.map((col) => (
                <td key={col.key} className={col.align === 'right' ? 'num' : ''}>
                  {col.render ? col.render(row) : row[col.key] ?? '—'}
                </td>
              ))}
              {actions && (
                <td>
                  <div className="table-actions">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Small sparkline-style bar chart (no external dependency). */
export function MiniBars({ data = [], valueKey = 'n', labelKey = 'day', height = 90 }) {
  const max = useMemo(() => Math.max(1, ...data.map((d) => Number(d[valueKey]) || 0)), [data, valueKey]);
  if (!data.length) return <div className="small muted">No data for the last 14 days yet.</div>;
  return (
    <div className="row" style={{ alignItems: 'flex-end', gap: 4, height, overflowX: 'auto' }} aria-hidden>
      {data.map((d, i) => (
        <div key={`${d[labelKey]}-${i}`} style={{ flex: 1, minWidth: 14, textAlign: 'center' }} title={`${d[labelKey]}: ${d[valueKey]}`}>
          <div
            style={{
              height: `${Math.max(6, ((Number(d[valueKey]) || 0) / max) * (height - 22))}px`,
              background: 'linear-gradient(180deg, var(--primary), #6366f1)',
              borderRadius: 6,
            }}
          />
          <div className="small muted" style={{ fontSize: '0.62rem' }}>
            {String(d[labelKey]).slice(-2)}
          </div>
        </div>
      ))}
    </div>
  );
}

export function BarList({ data = [], valueKey = 'n', labelKey = 'status', total, money = false }) {
  const sum = total ?? data.reduce((s, d) => s + (Number(d[valueKey]) || 0), 0);
  if (!data.length) return <div className="small muted">Nothing to show yet.</div>;
  return (
    <div className="stack-sm">
      {data.map((row) => {
        const value = Number(row[valueKey]) || 0;
        const share = sum ? Math.round((value / sum) * 100) : 0;
        return (
          <div key={row[labelKey]}>
            <div className="row-between small">
              <span>{row[labelKey]}</span>
              <span className="mono">
                {money ? compact(value) : value} {!money && <span className="muted">({share}%)</span>}
              </span>
            </div>
            <Progress value={share} />
          </div>
        );
      })}
    </div>
  );
}
