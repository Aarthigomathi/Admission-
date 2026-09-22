import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import { useAuth, useToast } from '../../hooks.jsx';
import { Field, Loader, TextInput } from '../../components/ui.jsx';
import { dateTimeLabel, timeAgo } from '../../lib/format.js';

export default function Settings() {
  const { session, refresh } = useAuth();
  const toast = useToast();
  const [security, setSecurity] = useState(null);
  const [pwd, setPwd] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [busy, setBusy] = useState(false);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    api.security().then(setSecurity).catch(() => {});
    api.dashboard().then((d) => setInfo(d)).catch(() => {});
  }, []);

  const changePassword = async () => {
    setBusy(true);
    try {
      await api.changePassword(pwd);
      toast.success('Password updated — use the new password next time you sign in');
      setPwd({ current_password: '', new_password: '', confirm_password: '' });
      api.security().then(setSecurity).catch(() => {});
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const togglePublish = async () => {
    const next = info?.college?.status === 'published' ? 'draft' : 'published';
    try {
      const res = await api.publish(next);
      toast.success(res.message);
      const d = await api.dashboard();
      setInfo(d);
      await refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!info || !session) return <Loader label="Loading settings…" />;

  return (
    <div className="stack">
      <div className="dash-head">
        <div>
          <div className="eyebrow">Account</div>
          <h1>Settings &amp; security</h1>
          <p className="muted" style={{ margin: 0 }}>
            One account per college. Keep the credentials safe — this login controls everything students see.
          </p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card card-pad">
          <h3>Institution account</h3>
          <dl className="kv">
            <div className="kv-row">
              <dt>College</dt>
              <dd>
                <b>{info.college.name}</b>
                <div className="small muted">{info.college.website}</div>
              </dd>
            </div>
            <div className="kv-row">
              <dt>Login username</dt>
              <dd className="mono">{info.account.username}</dd>
            </div>
            <div className="kv-row">
              <dt>Official email</dt>
              <dd>{info.account.email}</dd>
            </div>
            <div className="kv-row">
              <dt>Contact person</dt>
              <dd>
                {info.account.full_name || '—'} {info.account.designation ? `· ${info.account.designation}` : ''}
              </dd>
            </div>
            <div className="kv-row">
              <dt>Last sign-in</dt>
              <dd>{dateTimeLabel(session.account?.last_login_at)}</dd>
            </div>
            <div className="kv-row">
              <dt>Listing status</dt>
              <dd>
                <span className={`badge ${info.college.status === 'published' ? 'badge-green' : 'badge-amber'}`}>
                  {info.college.status === 'published' ? 'Published to students' : 'Hidden (draft)'}
                </span>
              </dd>
            </div>
            <div className="kv-row">
              <dt>Profile completeness</dt>
              <dd>
                <b>{info.completeness.percentage}%</b>
              </dd>
            </div>
          </dl>
          <div className="row" style={{ gap: '0.5rem', marginTop: '0.6rem' }}>
            <button className="btn btn-outline btn-sm" onClick={togglePublish}>
              {info.college.status === 'published' ? 'Hide listing from students' : 'Publish listing to students'}
            </button>
            <a className="btn btn-ghost btn-sm" href={`/colleges/${info.college.slug}`} target="_blank" rel="noreferrer">
              Open public page ↗
            </a>
            <Link className="btn btn-ghost btn-sm" to="/college/dashboard/profile">
              Edit profile
            </Link>
          </div>
        </div>

        <div className="card card-pad stack">
          <h3>Change password</h3>
          <Field label="Current password" required>
            <TextInput type="password" value={pwd.current_password} onChange={(v) => setPwd((p) => ({ ...p, current_password: v }))} />
          </Field>
          <Field label="New password" required hint="8+ characters with uppercase, lowercase, number and special character">
            <TextInput type="password" value={pwd.new_password} onChange={(v) => setPwd((p) => ({ ...p, new_password: v }))} />
          </Field>
          <Field label="Confirm new password" required>
            <TextInput type="password" value={pwd.confirm_password} onChange={(v) => setPwd((p) => ({ ...p, confirm_password: v }))} />
          </Field>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={changePassword} disabled={busy || !pwd.current_password || !pwd.new_password}>
              {busy ? 'Updating…' : 'Update password'}
            </button>
          </div>
          <div className="alert alert-warn small">
            5 failed sign-in attempts lock the account for 15 minutes. All sign-in and password events are recorded
            below.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <h3 className="card-title">Security log — this account</h3>
          <span className="badge badge-navy">{security?.events?.length || 0} events</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-wrap" style={{ border: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Detail</th>
                  <th>IP address</th>
                  <th>When</th>
                </tr>
              </thead>
              <tbody>
                {(security?.events || []).map((event, i) => (
                  <tr key={i}>
                    <td>
                      <span className={`badge ${event.event.includes('failed') ? 'badge-red' : event.event.includes('success') ? 'badge-green' : 'badge-gray'}`}>
                        {event.event.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="small muted">{event.detail || '—'}</td>
                    <td className="small mono">{event.ip || '—'}</td>
                    <td className="small muted">{timeAgo(event.created_at)}</td>
                  </tr>
                ))}
                {!security?.events?.length && (
                  <tr>
                    <td colSpan={4} className="muted">
                      No security events recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
