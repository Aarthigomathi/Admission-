/* Generates backend/src/main/resources/data.sql from js/data.js */
const fs = require('fs');
const path = require('path');
global.localStorage = { getItem: () => null, setItem: () => {} };
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'js/data.js'), 'utf8');
const tail = `
;function esc(s){ s = String(s==null?'':s); return s.split("'").join("''"); }
let out = '-- auto-generated seed (run scripts/gen-sql.js to refresh)\\n';
out += 'INSERT IGNORE INTO district_stats (district,total,eng,arts,med,poly) VALUES\\n';
out += Object.entries(DISTRICT_STATS).map(function(e){ var k=e[0], d=e[1];
  return "('" + esc(k) + "'," + d[0] + "," + d[1] + "," + d[2] + "," + d[3] + "," + d[4] + ")";
}).join(",\\n") + ";\\n\\n";
out += 'INSERT IGNORE INTO colleges (slug,name,city,category,founded,rating,reviews_count,seats,fee,img,map_url,official,tags,one_liner,one_liner_ta) VALUES\\n';
out += COLLEGES.map(function(c){
  return "('" + esc(c.id) + "','" + esc(c.name) + "','" + esc(c.city) + "','" + esc(c.category) + "'," + c.founded + "," + c.rating + "," + c.reviewsCount + ",'" + esc(c.seats) + "','" + esc(c.fee) + "','" + esc(c.img) + "','" + esc(c.map) + "','" + esc(c.official||'') + "','" + esc((c.tags||[]).join('|')) + "','" + esc(c.oneLiner) + "','" + esc(c.ta||'') + "')";
}).join(",\\n") + ";\\n";
fs.writeFileSync(path.join(root, 'backend/src/main/resources/data.sql'), out);
console.log('data.sql written; colleges:', COLLEGES.length, 'districts:', Object.keys(DISTRICT_STATS).length);
`;
new Function('fs', 'path', src + tail)(fs, path);
