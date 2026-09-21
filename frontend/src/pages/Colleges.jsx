import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, imgSrc } from '../api.js';
import { useLang } from '../App.jsx';
import { CITY_TA } from '../i18n.js';

export default function Colleges() {
  const { lang, t } = useLang();
  const [list, setList] = useState([]);
  const [city, setCity] = useState('');
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    const params = {};
    if (city) params.city = city;
    if (cat) params.category = cat;
    if (q) params.q = q;
    api.colleges(params).then(setList).catch(() => setList([]));
  }, [city, cat, q]);

  const cats = ['Engineering', 'Arts & Science', 'Medical', 'Nursing', 'Teacher Training', 'Polytechnic / ITI', 'Law', 'Agriculture'];

  return (
    <div className="wrap">
      <h2><i className="fa-solid fa-building-columns"></i> {t('colleges')}</h2>
      <div className="filter">
        <input placeholder={t('search_ph')} value={q} onChange={e => setQ(e.target.value)} />
        <select value={city} onChange={e => setCity(e.target.value)}>
          <option value="">{t('all_cities')}</option>
          {Object.keys(CITY_TA).map(c => <option key={c} value={c}>{lang === 'ta' ? CITY_TA[c] : c}</option>)}
        </select>
        <select value={cat} onChange={e => setCat(e.target.value)}>
          <option value="">{t('all_cats')}</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <p className="count">{list.length} {t('found')}</p>
      <div className="cards">
        {list.map(c => (
          <div key={c.id} className="card">
            <Link to={`/college/${c.slug}`}>
              <img src={imgSrc(c.img)} alt={c.name} loading="lazy" onError={e => { e.target.src = '/images/hero.jpg'; }} />
            </Link>
            <div className="card-body">
              <span className="cat">{c.category}</span>
              <h3>{c.name}</h3>
              <p className="oner">{lang === 'ta' && c.oneLinerTa ? c.oneLinerTa : c.oneLiner}</p>
              <small>★ {c.rating} · {lang === 'ta' ? (CITY_TA[c.city] || c.city) : c.city} · {c.founded}</small>
              <div className="card-actions">
                <Link className="btn sm" to={`/college/${c.slug}`}><i className="fa-solid fa-eye"></i> {t('view')}</Link>
                {c.official && <a className="btn sm ghost" href={c.official} target="_blank" rel="noreferrer"><i className="fa-solid fa-arrow-up-right-from-square"></i> {t('official')}</a>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
