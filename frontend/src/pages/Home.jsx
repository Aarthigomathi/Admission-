import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, user } from '../api.js';
import { useLang } from '../App.jsx';
import { CITY_TA } from '../i18n.js';

export default function Home() {
  const { lang, t } = useLang();
  const [stats, setStats] = useState([]);
  const [near, setNear] = useState([]);
  const me = user();

  useEffect(() => {
    api.districts().then(setStats).catch(() => {});
    if (me?.city) api.colleges({ city: me.city }).then(l => setNear(l.slice(0, 3))).catch(() => {});
  }, []);

  const total = stats.reduce((s, d) => s + d.total, 0);

  return (
    <div className="wrap">
      <section className="hero">
        <span className="kicker">{lang === 'ta' ? 'தமிழ்நாட்டின் கல்வி ஆய்வு போர்டல்' : "Tamil Nadu's Education Research Portal"}</span>
        <h1>{t('hero_t')}</h1>
        <p>{t('hero_sub')}</p>
        <div className="hero-btns">
          <Link className="btn gold" to="/colleges"><i className="fa-solid fa-building-columns"></i> {t('explore')}</Link>
          <Link className="btn ghost" to="/atlas"><i className="fa-solid fa-map"></i> {t('open_atlas')}</Link>
        </div>
        <div className="stat-row">
          <div><b>{total.toLocaleString('en-IN')}</b><span>{t('total_word')}</span></div>
          <div><b>38</b><span>{lang === 'ta' ? 'மாவட்டங்கள்' : 'districts'}</span></div>
          <div><b>8</b><span>{lang === 'ta' ? 'படிப்பு பிரிவுகள்' : 'study categories'}</span></div>
        </div>
      </section>

      {near.length > 0 && (
        <section>
          <h2><i className="fa-solid fa-location-dot"></i> {lang === 'ta' ? `${CITY_TA[me.city] || me.city} கல்லூரிகள்` : `Colleges in ${me.city}`}</h2>
          <div className="cards">
            {near.map(c => (
              <Link key={c.id} className="card" to={`/college/${c.slug}`}>
                <img src={'/' + c.img} alt={c.name} onError={e => { e.target.src = '/images/hero.jpg'; }} />
                <div className="card-body">
                  <span className="cat">{c.category}</span>
                  <h3>{c.name}</h3>
                  <small>★ {c.rating} · {lang === 'ta' ? (CITY_TA[c.city] || c.city) : c.city}</small>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
