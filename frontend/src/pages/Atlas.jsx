import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useLang } from '../App.jsx';
import { CITY_TA } from '../i18n.js';

export default function Atlas() {
  const { lang, t } = useLang();
  const [rows, setRows] = useState([]);
  useEffect(() => { api.districts().then(setRows).catch(() => {}); }, []);
  const sorted = [...rows].sort((a, b) => b.total - a.total);
  const total = rows.reduce((s, d) => s + d.total, 0);

  return (
    <div className="wrap">
      <div className="atlas-head">
        <div>
          <h2><i className="fa-solid fa-map"></i> {t('atlas')}</h2>
          <p>{lang === 'ta' ? 'ஒவ்வொரு மாவட்டத்திலும் எத்தனை கல்லூரிகள் — பிரிவு வாரியாக.' : 'District-wise college counts by category.'}</p>
        </div>
        <div className="atlas-total"><b>{total.toLocaleString('en-IN')}</b><span>{t('total_word')}</span></div>
      </div>
      <div className="legend">
        <span><i className="dot e"></i>{t('eng')}</span>
        <span><i className="dot a"></i>{t('arts')}</span>
        <span><i className="dot m"></i>{t('med')}</span>
        <span><i className="dot p"></i>{t('poly')}</span>
      </div>
      <div className="atlas-grid">
        {sorted.map(d => (
          <div key={d.id} className="dcard">
            <div className="dtop">
              <h3>{lang === 'ta' ? (CITY_TA[d.district] || d.district) : d.district}</h3>
              <b>{d.total}</b>
            </div>
            <div className="dbar">
              <span className="e" style={{ width: (d.eng / d.total) * 100 + '%' }}></span>
              <span className="a" style={{ width: (d.arts / d.total) * 100 + '%' }}></span>
              <span className="m" style={{ width: (d.med / d.total) * 100 + '%' }}></span>
              <span className="p" style={{ width: (d.poly / d.total) * 100 + '%' }}></span>
            </div>
            <div className="dnums">
              <span>{t('eng')} <b>{d.eng}</b></span>
              <span>{t('arts')} <b>{d.arts}</b></span>
              <span>{t('med')} <b>{d.med}</b></span>
              <span>{t('poly')} <b>{d.poly}</b></span>
            </div>
            <Link className="btn sm" to={`/colleges?city=${encodeURIComponent(d.district)}`}>{t('explore')} <i className="fa-solid fa-arrow-right"></i></Link>
          </div>
        ))}
      </div>
      <p className="approx"><i className="fa-solid fa-circle-info"></i> {t('approx')}</p>
    </div>
  );
}
