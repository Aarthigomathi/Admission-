/**
 * Headless integration test: renders the real UI in jsdom against the running
 * API server and asserts that seeded data actually reaches the screen.
 *
 *   npm run check:dom        (from the client folder; server must be running)
 */
const { JSDOM } = require('jsdom');
const path = require('node:path');

const BASE = process.env.API_BASE || 'http://127.0.0.1:5000';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: `${BASE}/`,
  pretendToBeVisual: true,
  resources: 'usable',
});

const { window } = dom;
globalThis.window = window;
globalThis.document = window.document;
globalThis.navigator = window.navigator;
globalThis.HTMLElement = window.HTMLElement;
globalThis.Node = window.Node;
globalThis.Element = window.Element;
globalThis.Event = window.Event;
globalThis.CustomEvent = window.CustomEvent;
globalThis.getComputedStyle = window.getComputedStyle.bind(window);
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
globalThis.localStorage = window.localStorage;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.localStorage.clear();

// route the app's relative requests to the running API server
const realFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = (input, init) => {
  const url = typeof input === 'string' ? new URL(input, BASE).toString() : input;
  return realFetch(url, init);
};

let pass = 0;
let fail = 0;
const results = [];

function check(label, condition, detail = '') {
  if (condition) {
    pass += 1;
    results.push(`  ok   ${label}`);
  } else {
    fail += 1;
    results.push(` FAIL  ${label}${detail ? ` → ${detail}` : ''}`);
  }
}

(async () => {
  const { renderRoute, textOf } = await import(path.resolve(__dirname, '..', 'dist-dom', 'jsdom-check.js'));

  // ---- login through the real API to obtain a college session ----------
  const login = await realFetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ identifier: 'psgtech', password: 'PSG@Login2026' }),
  }).then((r) => r.json());

  check('API login returns a token', Boolean(login.token), login.error);
  const token = login.token;

  // ---- public API surface ----------------------------------------------
  const meta = await realFetch(`${BASE}/api/public/meta`).then((r) => r.json());
  check('meta returns filter facets', Array.isArray(meta.states) && meta.states.length > 0 && Array.isArray(meta.levels), JSON.stringify(meta).slice(0, 140));
  check('meta lists the 18 profile sections', Object.keys(meta.sections || {}).length === 18, Object.keys(meta.sections || {}).length);
  const search = await realFetch(`${BASE}/api/public/colleges?q=psg&limit=5`).then((r) => r.json());
  check('college search matches by name', (search.rows || []).some((r) => r.slug === 'psg-college-of-technology'), JSON.stringify(search).slice(0, 140));
  const missing = await realFetch(`${BASE}/api/public/colleges/not-a-real-college`);
  check('unknown college slug returns 404', missing.status === 404, missing.status);
  const live = await realFetch(`${BASE}/api/public/seats/live?limit=50`).then((r) => r.json());
  check('live seat feed returns published courses', (live.rows || []).length > 0, JSON.stringify(live).slice(0, 120));
  const liveSeatsWithToken = await realFetch(`${BASE}/api/public/seats/live?limit=2`).then((r) => r.json());
  check('live seat rows expose availability', typeof liveSeatsWithToken.rows?.[0]?.available === 'number', JSON.stringify(liveSeatsWithToken.rows?.[0] || {}).slice(0, 140));

  // ---- student side -----------------------------------------------------
  let html = await renderRoute('/', null, { settleMs: 1400 });
  let text = textOf(html);
  check('home hero renders', text.includes('Find the right college'), text.slice(0, 120));
  check('home shows live stats', /\d/.test(text) && text.includes('Colleges live'));
  check('home lists seeded colleges', text.includes('PSG College of Technology'), text.slice(0, 200));
  check('home shows recruiter chips', text.includes('TCS') || text.includes('Infosys'));
  check('realtime badge present', html.includes('Live'));

  html = await renderRoute('/colleges', null, { settleMs: 1200 });
  text = textOf(html);
  check('explore page renders filters', text.includes('Search') && text.includes('Institution type'));
  check('explore lists colleges', text.includes('Vellore Institute of Technology') || text.includes('PSG College of Technology'));
  check('explore shows seat counts', text.includes('seats available'));

  html = await renderRoute('/colleges/psg-college-of-technology', null, { settleMs: 1400 });
  text = textOf(html);
  check('college page shows name', text.includes('PSG College of Technology'));
  check('college page shows accreditation', text.includes('NAAC'));
  check('college page shows tabs', text.includes('Courses & seats') && text.includes('Placements'));
  check('college page shows about text', text.includes('PSG & Sons') || text.includes('1951'));
  check(
    'imported profile is marked unconfirmed until the college saves it',
    text.includes('awaiting college confirmation'),
    text.slice(0, 200),
  );
  check('college page shows every tab', text.includes('Courses & seats') && text.includes('Placements') && text.includes('Documents'), text.slice(0, 200));
  check('college page shows contact', text.includes('principal@psgtech.edu') || text.includes('2572177'));

  html = await renderRoute('/colleges/vellore-institute-of-technology?tab=placements', null, { settleMs: 1400 });
  text = textOf(html);
  check('placements tab renders records', text.includes('Vellore Institute of Technology'));
  check('imported college warns it is unconfirmed', text.includes('awaiting college confirmation'), text.slice(0, 200));

  html = await renderRoute('/seats', null, { settleMs: 1400 });
  text = textOf(html);
  check('live seats page renders', text.includes('Live seat availability'));
  check('live seats lists courses', /B\.Tech|B\.E\.|MBA|M\.Com/.test(text));

  // ---- college dashboard ------------------------------------------------
  html = await renderRoute('/college/dashboard', token, { settleMs: 1800 });
  text = textOf(html);
  check('dashboard renders overview', text.includes('Admissions overview'), text.slice(0, 160));
  check('dashboard shows counters', text.includes('Applications') && text.includes('Enquiries'));
  check('dashboard shows seat board', text.includes('Seat availability'));
  check('dashboard shows completeness checklist', text.includes('Profile completeness'));
  check('dashboard shows latest applications', /APL-2026-\d+/.test(text));
  check('dashboard sidebar has sections', text.includes('Departments') && text.includes('Hostels'));

  html = await renderRoute('/college/dashboard/applications', token, { settleMs: 1800 });
  text = textOf(html);
  check('applications page lists rows', /APL-2026-\d+/.test(text));
  check('applications page shows status tabs', text.includes('Under Review') || text.includes('Shortlisted'));
  check('applications page shows export', text.includes('Export CSV'));

  html = await renderRoute('/college/dashboard/enquiries', token, { settleMs: 1600 });
  text = textOf(html);
  check('enquiries page renders', text.includes('Enquiries') && text.includes('Student'), text.slice(0, 160));

  html = await renderRoute('/college/dashboard/section/courses', token, { settleMs: 1800 });
  text = textOf(html);
  check('courses manager renders schema table', text.includes('Courses & Admissions') || text.includes('Courses'));
  check('courses manager shows intake totals', text.includes('Total intake'));
  check('courses manager shows seeded course', text.includes('Computer Science'));

  html = await renderRoute('/college/dashboard/section/media', token, { settleMs: 1600 });
  text = textOf(html);
  check('media manager renders', text.includes('Photos & Videos'));

  html = await renderRoute('/college/dashboard/profile', token, { settleMs: 1800 });
  text = textOf(html);
  check('profile editor renders fields', text.includes('Institution details') && text.includes('Accreditation'));
  check('profile editor shows saved state', text.includes('Visio') || text.includes('confirmed') || text.includes('imported from'));

  html = await renderRoute('/college/dashboard/import', token, { settleMs: 1400 });
  text = textOf(html);
  check('import assistant renders', text.includes('Import assistant') && text.includes('official website'));

  html = await renderRoute('/college/dashboard/settings', token, { settleMs: 1600 });
  text = textOf(html);
  check('settings renders account + security', text.includes('Settings & security') && text.includes('Change password'));

  // ---- tracking --------------------------------------------------------
  const applications = await realFetch(`${BASE}/api/college/applications`, { headers: { authorization: `Bearer ${token}` } }).then((r) => r.json());
  const sample = applications.rows?.[0];
  check('applications API returns rows', Boolean(sample), JSON.stringify(applications).slice(0, 120));
  if (sample) {
    html = await renderRoute(`/track?application_no=${sample.application_no}`, null, { settleMs: 1800 });
    text = textOf(html);
    check('tracking page finds the application', text.includes(sample.application_no));
    check('tracking page shows progress stages', text.includes('Under Review') && text.includes('Confirmed'));
    check('tracking page shows applicant', text.includes(sample.student_name.split(' ')[0]));
  }

  // ---- realtime --------------------------------------------------------
  const stats = await realFetch(`${BASE}/api/college/stats`, { headers: { authorization: `Bearer ${token}` } }).then((r) => r.json());
  const seatCourse = stats.seatBoard?.[0];
  const toScore = seatCourse ? Math.min(seatCourse.intake_seats, seatCourse.filled_seats + 3) : 0;
  const seatUpdate = await realFetch(`${BASE}/api/college/seats`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ course_id: seatCourse?.id, filled_seats: toScore }),
  }).then((r) => r.json());
  check(
    'seat update published through API',
    typeof seatUpdate.available === 'number' && seatUpdate.available === seatCourse.intake_seats - toScore,
    JSON.stringify(seatUpdate).slice(0, 140),
  );

  // restore the seeded seat count so repeat runs stay stable
  if (seatCourse) {
    await realFetch(`${BASE}/api/college/seats`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify({ course_id: seatCourse.id, filled_seats: seatCourse.filled_seats }),
    }).then((r) => r.json());
  }

  console.log(results.join('\n'));
  console.log(`\n  ${pass} passed, ${fail} failed\n`);
  process.exit(fail ? 1 : 0);
})().catch((err) => {
  console.log(results.join('\n'));
  console.error('\n  harness error:', err);
  process.exit(1);
});
