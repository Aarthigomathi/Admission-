import React, { createContext, useContext, useState } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { STR } from './i18n.js';
import { user, logout } from './api.js';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Colleges from './pages/Colleges.jsx';
import Atlas from './pages/Atlas.jsx';
import College from './pages/College.jsx';

const LangCtx = createContext();
export const useLang = () => useContext(LangCtx);

export default function App() {
  const [lang, setLang] = useState(localStorage.getItem('kp_lang') || 'ta');
  const [authed, setAuthed] = useState(!!localStorage.getItem('kp_token'));
  const t = (k) => STR[lang][k] || STR.en[k] || k;
  const nav = useNavigate();

  const toggleLang = () => setLang(l => { const n = l === 'ta' ? 'en' : 'ta'; localStorage.setItem('kp_lang', n); return n; });
  const doLogout = () => { logout(); setAuthed(false); nav('/'); };

  return (
    <LangCtx.Provider value={{ lang, t }}>
      <nav className="nav">
        <Link to="/home" className="brand"><i className="fa-solid fa-graduation-cap"></i> {t('brand')}</Link>
        <div className="links">
          <Link to="/home">{t('home')}</Link>
          <Link to="/colleges">{t('colleges')}</Link>
          <Link to="/atlas">{t('atlas')}</Link>
        </div>
        <div className="right">
          <button className="chip" onClick={toggleLang}><i className="fa-solid fa-language"></i> {lang === 'ta' ? 'EN' : 'தமிழ்'}</button>
          {authed ? (
            <button className="chip" onClick={doLogout}><i className="fa-solid fa-right-from-bracket"></i> {t('logout')}</button>
          ) : (
            <Link to="/" className="chip gold">{t('signin')}</Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Login onAuthed={() => setAuthed(true)} />} />
        <Route path="/home" element={authed ? <Home /> : <Navigate to="/" />} />
        <Route path="/colleges" element={authed ? <Colleges /> : <Navigate to="/" />} />
        <Route path="/atlas" element={authed ? <Atlas /> : <Navigate to="/" />} />
        <Route path="/college/:slug" element={authed ? <College /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to={authed ? '/home' : '/'} />} />
      </Routes>

      <footer className="foot">
        <span><i className="fa-solid fa-graduation-cap"></i> {t('brand')} © 2026</span>
        <span>Spring Boot + React + MySQL</span>
      </footer>
    </LangCtx.Provider>
  );
}
