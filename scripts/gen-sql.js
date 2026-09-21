/* Generates backend/src/main/resources/data.sql from js/data.js */
const fs = require('fs');
const path = require('path');
global.localStorage = { getItem: () => null, setItem: () => {} };
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const tail = `
;function esc(s){ s = String(s==null?'':s); return s.split("'").join("''"); }

/* ---- per-college departments: curated details first, then category template, then tags ---- */
function deptsOf(c){
  const d = COLLEGE_DETAILS[c.id];
  if(d && d.departments && d.departments.length) return d.departments.map(x=>x.name);
  const m = (typeof CAT_META !== 'undefined') && CAT_META[c.category];
  if(m && m.depts && m.depts.length) return m.depts.map(x=>x.name);
  return (c.tags||[]);
}

/* ---- per-college events: curated COLLEGE_EVENTS first, then category defaults ---- */
const EVENT_DEFAULTS = {
  "Engineering":["Annual Tech Fest & Hackathon","National-level Symposium","Industry Visits","Campus Placement Drive","Sports & Cultural Day"],
  "Arts & Science":["Annual Cultural Fest","Science Exhibition","NSS Community Camp","College Sports Day","Alumni Meet"],
  "Medical":["White Coat Ceremony","Free Health Camps","Medical Conferences","Sports & Cultural Day"],
  "Nursing":["Lamp Lighting Ceremony","Community Health Camps","Nurses Day Celebrations","Sports & Cultural Day"],
  "Teacher Training":["Teachers' Day Celebrations","School Internship Programme","Education Seminars","Annual Day"],
  "Polytechnic / ITI":["Project Expo","Skill Competitions","Industrial Visits","Sports Day"],
  "Law":["Moot Court Competitions","Legal Aid Camps","Law Seminars","Annual Day"],
  "Agriculture":["Harvest Festival (Pongal Expo)","Farm & Agri Tech Expo","Research Seminars","Sports Day"]
};
function eventsOf(c){
  const ev = COLLEGE_EVENTS[c.id];
  if(ev && ev.length) return ev.map(e=>e.title+" ("+e.d+" "+e.m+")");
  return EVENT_DEFAULTS[c.category] || ["Annual Day","Sports Day","Cultural Fest"];
}

let out = '-- auto-generated seed (run scripts/gen-sql.js to refresh)\\n';
out += 'INSERT IGNORE INTO district_stats (district,total,eng,arts,med,poly) VALUES\\n';
out += Object.entries(DISTRICT_STATS).map(function(e){ var k=e[0], d=e[1];
  return "('" + esc(k) + "'," + d[0] + "," + d[1] + "," + d[2] + "," + d[3] + "," + d[4] + ")";
}).join(",\\n") + ";\\n\\n";
out += 'INSERT IGNORE INTO colleges (slug,name,city,category,founded,rating,reviews_count,seats,fee,img,map_url,official,tags,one_liner,one_liner_ta,departments,events,hostel,library,sports,placements,youtube,instagram) VALUES\\n';
out += COLLEGES.map(function(c){
  const info = (typeof COLLEGE_INFO !== "undefined" && COLLEGE_INFO[c.id]) || {};
  return "('" + esc(c.id) + "','" + esc(c.name) + "','" + esc(c.city) + "','" + esc(c.category) + "'," + c.founded + "," + c.rating + "," + c.reviewsCount + ",'" + esc(c.seats) + "','" + esc(c.fee) + "','" + esc(c.img) + "','" + esc(c.map) + "','" + esc(c.official||'') + "','" + esc((c.tags||[]).join('|')) + "','" + esc(c.oneLiner) + "','" + esc(c.ta||'') + "','" + esc(deptsOf(c).join('|')) + "','" + esc(eventsOf(c).join('|')) + "','" + esc(info.hostel||'') + "','" + esc(info.library||'') + "','" + esc(info.sports||'') + "','" + esc(info.placements||'') + "','" + esc(c.youtube||'') + "','" + esc(c.instagram||'') + "')";
}).join(",\\n") + ";\\n";

/* ---- AISHE 2023-24 statewide overview ---- */
out += '\\nINSERT IGNORE INTO aishe_stats (cat,cat_ta,college_count,color,icon) VALUES\\n';
out += AISHE_STATS.cats.map(function(a){
  return "('" + esc(a.cat) + "','" + esc(a.ta) + "'," + a.count + ",'" + esc(a.color) + "','" + esc(a.ic) + "')";
}).join(",\\n") + ";\\n";

fs.writeFileSync(path.join(root, 'backend/src/main/resources/data.sql'), out);
console.log('data.sql written; colleges:', COLLEGES.length, 'districts:', Object.keys(DISTRICT_STATS).length, 'aishe total:', AISHE_STATS.total);
`;
new Function('fs', 'path', 'root', src + tail)(fs, path, root);
