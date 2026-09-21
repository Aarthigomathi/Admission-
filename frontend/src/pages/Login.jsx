import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setUser, setToken, user } from '../api.js';
import { useLang } from '../App.jsx';
import { CITY_TA } from '../i18n.js';

export default function Login({ onAuthed }) {
  const { lang, t } = useLang();
  const nav = useNavigate();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '', city: 'Coimbatore' });
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const r = mode === 'login' ? await api.login(f) : await api.signup(f);
      setToken(r.token); setUser({ name: r.name, city: r.city });
      onAuthed(); nav('/home');
    } catch (ex) { setErr(ex.message); }
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo"><i className="fa-solid fa-graduation-cap"></i> {t('brand')}</div>
        <h2>{mode === 'login' ? t('login_t') : t('signup_t')}</h2>
        {mode === 'signup' && (
          <>
            <label>{t('name')}<input required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></label>
            <label>{t('district')}
              <select value={f.city} onChange={e => setF({ ...f, city: e.target.value })}>
                {Object.keys(CITY_TA).map(c => <option key={c} value={c}>{lang === 'ta' ? CITY_TA[c] : c}</option>)}
              </select>
            </label>
          </>
        )}
        <label>{t('email')}<input type="email" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></label>
        <label>{t('password')}<input type="password" required value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></label>
        {err && <p className="err">{err}</p>}
        <button className="btn gold" type="submit">{mode === 'login' ? t('signin') : t('signup')}</button>
        <button type="button" className="linklike" onClick={() => setMode(m => m === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? t('no_account') : t('have_account')}
        </button>
      </form>
    </div>
  );
}
