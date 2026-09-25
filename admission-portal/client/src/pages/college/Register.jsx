import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api.js';
import { useAuth, useToast } from '../../hooks.jsx';
import { Field, Layout, Select, TextArea, TextInput } from '../../components/ui.jsx';

const STEPS = ['Official website', 'College details', 'Login account'];

export default function CollegeRegister() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(0);
  const [website, setWebsite] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [match, setMatch] = useState(null);

  const [college, setCollege] = useState({
    college_name: '',
    type: 'Private',
    established_year: '',
    city: '',
    state: 'Tamil Nadu',
    address: '',
    phone: '',
    pincode: '',
    about: '',
  });
  const [account, setAccount] = useState({ username: '', email: '', full_name: '', designation: 'Admission Officer', password: '', confirm_password: '' });

  const setC = (key) => (value) => setCollege((c) => ({ ...c, [key]: value }));
  const setA = (key) => (value) => setAccount((a) => ({ ...a, [key]: value }));

  const verify = async () => {
    setVerifying(true);
    setError('');
    try {
      const data = await api.verifyDomain(website.trim());
      setVerifyResult(data);
      setCollege((c) => ({
        ...c,
        college_name: c.college_name || data.collegeDraft?.name || '',
        type: data.collegeDraft?.type || c.type,
        established_year: c.established_year || data.collegeDraft?.established_year || '',
        city: c.city || data.collegeDraft?.city || '',
        state: c.state || data.collegeDraft?.state || '',
        address: c.address || data.collegeDraft?.address || '',
        phone: c.phone || data.collegeDraft?.phone || '',
        pincode: c.pincode || data.collegeDraft?.pincode || '',
        about: c.about || data.collegeDraft?.about || '',
      }));
      setStep(1);
      toast.success(`Verified ${data.host} — ${data.trustedDomains.length} trusted email domain(s) found`);
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const checkEmail = (value) => {
    setA('email')(value);
    const domain = String(value).split('@')[1];
    if (!domain || !verifyResult) return setMatch(null);
    const ok = verifyResult.trustedDomains.some((d) => domain === d || domain.endsWith(`.${d}`) || d.endsWith(`.${domain}`));
    setMatch({ ok, domain });
  };

  const submit = async () => {
    setBusy(true);
    setError('');
    try {
      await register({
        website: verifyResult?.website || website,
        ...college,
        established_year: college.established_year ? Number(college.established_year) : null,
        ...account,
      });
      toast.success('College account created. Next: import or fill your profile.');
      navigate('/college/dashboard/import');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Layout>
      <section className="section">
        <div className="container-narrow">
          <div className="eyebrow">College registration</div>
          <h1 style={{ fontSize: '1.8rem' }}>Register your college — one account, one institution</h1>
          <p className="lede">
            Registration is verified against your official website: the portal reads the official email addresses
            published there and only accepts a login on that domain. This keeps one genuine account per college.
          </p>

          <div className="row" style={{ gap: '0.5rem', margin: '1.2rem 0' }}>
            {STEPS.map((label, i) => (
              <span key={label} className={`badge ${i === step ? 'badge-blue' : i < step ? 'badge-green' : 'badge-gray'}`}>
                {i < step ? '✔' : i + 1}. {label}
              </span>
            ))}
          </div>

          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <div className="card card-lg card-pad stack" style={{ marginTop: '1rem' }}>
            {step === 0 && (
              <>
                <Field label="Official college website" required hint="e.g. https://www.yourcollege.edu.in — we read only public pages">
                  <TextInput value={website} onChange={setWebsite} placeholder="https://www.yourcollege.edu.in" />
                </Field>
                <div className="alert alert-info small">
                  Nothing is published at this stage. The portal fetches your home page to confirm the institution and
                  to find the official email domains it will accept for your login.
                </div>
                <div className="form-actions">
                  <button className="btn btn-primary" onClick={verify} disabled={verifying || !website.trim()}>
                    {verifying ? 'Checking your website…' : 'Verify website →'}
                  </button>
                </div>
                {verifyResult && (
                  <div className="alert alert-success">
                    ✅ {verifyResult.message}
                    <div className="small" style={{ marginTop: '0.3rem' }}>
                      Detected: <b>{verifyResult.collegeDraft?.name || verifyResult.host}</b>
                      {verifyResult.collegeDraft?.city ? `, ${verifyResult.collegeDraft.city}` : ''}
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 1 && (
              <>
                <div className="alert alert-success small">
                  Trusted email domains: {verifyResult?.trustedDomains?.map((d) => `@${d}`).join(', ')}
                </div>
                <div className="form-grid">
                  <Field label="College name" required className="col-span-2">
                    <TextInput value={college.college_name} onChange={setC('college_name')} />
                  </Field>
                  <Field label="Institution type">
                    <Select
                      value={college.type}
                      onChange={setC('type')}
                      options={['Government', 'Government Aided', 'Private', 'Private Aided', 'Deemed University', 'Autonomous', 'Trust', 'Minority Institution']}
                    />
                  </Field>
                  <Field label="Established year">
                    <TextInput value={college.established_year} onChange={setC('established_year')} type="number" placeholder="e.g. 1998" />
                  </Field>
                  <Field label="City" required>
                    <TextInput value={college.city} onChange={setC('city')} />
                  </Field>
                  <Field label="State" required>
                    <TextInput value={college.state} onChange={setC('state')} />
                  </Field>
                  <Field label="PIN code">
                    <TextInput value={college.pincode} onChange={setC('pincode')} />
                  </Field>
                  <Field label="Phone">
                    <TextInput value={college.phone} onChange={setC('phone')} />
                  </Field>
                  <Field label="Address" className="col-span-2">
                    <TextArea value={college.address} onChange={setC('address')} rows={2} />
                  </Field>
                  <Field label="Short introduction" className="col-span-2" hint="You can refine this later, or import it automatically">
                    <TextArea value={college.about} onChange={setC('about')} rows={3} />
                  </Field>
                </div>
                <div className="form-actions">
                  <button className="btn btn-ghost" onClick={() => setStep(0)}>
                    ← Back
                  </button>
                  <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!college.college_name || !college.city || !college.state}>
                    Continue to login account →
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid-2" style={{ gap: '1rem' }}>
                  <Field label="Username" required hint="3–32 characters: letters, numbers, dot, underscore, hyphen">
                    <TextInput value={account.username} onChange={setA('username')} placeholder="e.g. yourcollege" />
                  </Field>
                  <Field
                    label="Official email"
                    required
                    hint={match ? (match.ok ? `✅ Verified domain (${match.domain})` : `⚠️ Not a verified domain — expected ${verifyResult?.trustedDomains?.[0]}`) : `Must end with ${verifyResult?.trustedDomains?.map((d) => `@${d}`).join(' or ')}`}
                    error={match && !match.ok ? 'This email is not on your college domain' : ''}
                  >
                    <TextInput value={account.email} onChange={checkEmail} type="email" placeholder={`you@${verifyResult?.trustedDomains?.[0] || 'yourcollege.edu.in'}`} />
                  </Field>
                  <Field label="Your name">
                    <TextInput value={account.full_name} onChange={setA('full_name')} placeholder="e.g. Dr. R. Kumar" />
                  </Field>
                  <Field label="Designation">
                    <TextInput value={account.designation} onChange={setA('designation')} />
                  </Field>
                  <Field label="Password" required hint="8+ characters with uppercase, lowercase, number and symbol">
                    <TextInput value={account.password} onChange={setA('password')} type="password" />
                  </Field>
                  <Field label="Confirm password" required>
                    <TextInput value={account.confirm_password} onChange={setA('confirm_password')} type="password" />
                  </Field>
                </div>

                <div className="alert alert-warn small">
                  Only one login account can exist per college. This account will control everything students see.
                </div>

                <div className="form-actions">
                  <button className="btn btn-ghost" onClick={() => setStep(1)}>
                    ← Back
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={submit}
                    disabled={busy || !account.username || !account.email || !account.password || (match && !match.ok)}
                  >
                    {busy ? 'Creating account…' : 'Create college account'}
                  </button>
                </div>
              </>
            )}
          </div>

          <p className="small muted" style={{ marginTop: '1rem' }}>
            Already registered? <Link to="/college/login">Sign in instead →</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
