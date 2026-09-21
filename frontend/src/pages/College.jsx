import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api, user, imgSrc } from '../api.js';
import { useLang } from '../App.jsx';
import { CITY_TA } from '../i18n.js';

export default function College() {
  const { slug } = useParams();
  const { lang, t } = useLang();
  const [c, setC] = useState(null);
  const [revs, setRevs] = useState([]);
  const [stars, setStars] = useState(5);
  const [text, setText] = useState('');
  const me = user();

  useEffect(() => {
    api.college(slug).then(setC).catch(() => {});
    api.reviews(slug).then(setRevs).catch(() => {});
  }, [slug]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.addReview(slug, { name: me?.name || 'Student', stars, text });
      setText('');
      api.reviews(slug).then(setRevs);
    } catch (ex) { alert(ex.message); }
  };

  if (!c) return <div className="wrap"><p>…</p></div>;

  const depts = (c.departments || '').split('|').filter(Boolean);
  const events = (c.events || '').split('|').filter(Boolean);
  const officialHref = c.official
    ? c.official
    : `https://www.google.com/search?q=${encodeURIComponent(c.name + ' ' + c.city + ' official website')}`;

  return (
    <div>
      <div className="c-hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(13,27,63,.25), rgba(10,20,46,.92)), url('${imgSrc(c.img)}')` }}>
        <div className="wrap">
          <span className="cat gold">{c.category}</span>
          <h1>{c.name}</h1>
          <p>{lang === 'ta' && c.oneLinerTa ? c.oneLinerTa : c.oneLiner}</p>
          <div className="facts">
            <div><b>{c.founded}</b><span>{t('established')}</span></div>
            <div><b>{c.rating}</b><span>{t('rating_l')}</span></div>
            <div><b>{c.seats}</b><span>{t('seats_l')}</span></div>
            <div><b>{lang === 'ta' ? (CITY_TA[c.city] || c.city) : c.city}</b><span>{t('location_l')}</span></div>
          </div>
          <div className="hero-btns">
            <a className="btn gold" href={officialHref} target="_blank" rel="noreferrer">
              <i className="fa-solid fa-arrow-up-right-from-square"></i> {c.official ? t('official') : t('find_official')}
            </a>
            <a className="btn ghost" target="_blank" rel="noreferrer"
               href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.mapUrl)}`}>
              <i className="fa-solid fa-map-location-dot"></i> {t('directions')}</a>
          </div>
        </div>
      </div>

      {(depts.length > 0 || events.length > 0) && (
        <div className="wrap">
          <div className="two-col">
            {depts.length > 0 && (
              <section>
                <h2><i className="fa-solid fa-building-columns"></i> {t('depts')}</h2>
                <div className="chips">
                  {depts.map((d, i) => <span key={i} className="chip">{d}</span>)}
                </div>
              </section>
            )}
            {events.length > 0 && (
              <section>
                <h2><i className="fa-solid fa-calendar-days"></i> {t('events')}</h2>
                <ul className="evlist">
                  {events.map((ev, i) => (
                    <li key={i}><i className="fa-solid fa-star gold-ic"></i> {ev}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      )}

      <div className="wrap two-col">
        <section>
          <h2>{t('reviews')}</h2>
          {revs.length === 0 && <p className="muted">{lang === 'ta' ? 'இன்னும் கருத்துகள் இல்லை.' : 'No reviews yet.'}</p>}
          {revs.map(r => (
            <div key={r.id} className="rev">
              <div className="rev-top"><b>{r.name}</b><span>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span></div>
              <p>{r.text}</p>
            </div>
          ))}
          <form className="rev-form" onSubmit={submit}>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(n => (
                <button type="button" key={n} className={n <= stars ? 'on' : ''} onClick={() => setStars(n)}>★</button>
              ))}
            </div>
            <textarea rows={3} placeholder={t('rev_ph')} value={text} onChange={e => setText(e.target.value)} required></textarea>
            <button className="btn gold" type="submit"><i className="fa-solid fa-star"></i> {t('submit')}</button>
          </form>
        </section>

        <section>
          <h2>{t('map_t')}</h2>
          <div className="map">
            <iframe title="map" src={`https://www.google.com/maps?q=${encodeURIComponent(c.mapUrl)}&output=embed`} loading="lazy"></iframe>
          </div>
          <div className="fee-box">
            <b>{t('seats_l')}:</b> {c.seats}<br />
            <b>{lang === 'ta' ? 'கட்டணம்' : 'Fees'}:</b> {c.fee}<br />
            <b>{lang === 'ta' ? 'படிப்புகள்' : 'Courses'}:</b> {(c.tags || '').split('|').join(', ')}
          </div>
        </section>
      </div>
    </div>
  );
}
