import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, useToast } from '../../hooks.jsx';
import { Field, Layout, TextInput } from '../../components/ui.jsx';

export default function CollegeLogin() {
  const { login, session } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e?.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await login(identifier.trim(), password);
      toast.success(`Welcome back, ${data.college.name}`);
      navigate('/college/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const quickFill = (username, pwd) => {
    setIdentifier(username);
    setPassword(pwd);
    setError('');
  };

  return (
    <Layout>
      <section className="section">
        <div className="container-narrow split" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="card card-lg card-pad">
            <div className="eyebrow">College sign in</div>
            <h1 style={{ fontSize: '1.7rem' }}>One verified login per college</h1>
            <p className="muted">
              Use the single account created for your institution to manage the college profile, courses, seats,
              applications and enquiries.
            </p>

            {session && (
              <div className="alert alert-info">
                You are already signed in as <b>{session.college?.name}</b>.{' '}
                <Link to="/college/dashboard">Go to dashboard →</Link>
              </div>
            )}
            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <form className="stack" onSubmit={submit}>
              <Field label="Username or official email" required>
                <TextInput value={identifier} onChange={setIdentifier} placeholder="e.g. principal@yourcollege.edu.in" autoComplete="username" />
              </Field>
              <Field label="Password" required>
                <TextInput value={password} onChange={setPassword} type="password" placeholder="••••••••" autoComplete="current-password" />
              </Field>
              <button className="btn btn-primary btn-lg" type="submit" disabled={busy}>
                {busy ? 'Signing in…' : 'Sign in to dashboard'}
              </button>
            </form>

            <div className="divider" />
            <p className="small muted" style={{ marginBottom: '0.6rem' }}>
              No account yet? A college can register once with its official website —{' '}
              <Link to="/college/register">register your college →</Link>
            </p>
            <div className="alert alert-warn small">
              Security: 5 failed attempts lock the account for 15 minutes. Every sign-in attempt is logged.
            </div>
          </div>

          <div className="stack">
            <div className="card card-pad">
              <h4>Demo college accounts</h4>
              <p className="small muted">
                These seeded accounts are created by <code>npm run seed</code> from the institutions' publicly published
                details, so you can explore the college side immediately.
              </p>
              <div className="stack-sm">
                {[
                  ['psgtech', 'PSG@Login2026', 'PSG College of Technology'],
                  ['vit', 'VIT@Login2026', 'Vellore Institute of Technology'],
                  ['loyola', 'Loyola@Login2026', 'Loyola College, Chennai'],
                  ['iitm', 'IITM@Login2026', 'IIT Madras'],
                ].map(([user, pass, name]) => (
                  <button key={user} className="btn btn-outline btn-sm" style={{ justifyContent: 'space-between' }} onClick={() => quickFill(user, pass)}>
                    <span>
                      {user} <span className="muted">/ {pass}</span>
                    </span>
                    <span className="small muted">{name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card card-pad">
              <h4>What you can manage</h4>
              <ul className="small muted" style={{ paddingLeft: '1.1rem', display: 'grid', gap: '0.3rem' }}>
                <li>18 profile sections — courses, fees, faculty, hostel, transport, library, sports, events, media…</li>
                <li>Live seat availability and admission status</li>
                <li>Applications with status workflow and CSV export</li>
                <li>Student enquiries with replies</li>
                <li>Official-website import assistant</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
