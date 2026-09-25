import { importFromWebsite, __testables } from '../src/services/websiteImport.js';

const fixture = `<!doctype html><html><head>
<title>Sunrise Institute of Technology | Engineering College in Salem</title>
<link rel="icon" href="/assets/logo.png">
<meta property="og:image" content="/images/campus-hero.jpg">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"CollegeOrUniversity","name":"Sunrise Institute of Technology",
"url":"https://www.sunrise.edu.in","logo":"/assets/logo.png","telephone":"+91 427 233 4455","email":"admissions@sunrise.edu.in",
"address":{"@type":"PostalAddress","streetAddress":"12 Omalur Main Road, Fairlands","addressLocality":"Salem","addressRegion":"Tamil Nadu","postalCode":"636016"},
"sameAs":["https://www.facebook.com/sunrise","https://www.linkedin.com/company/sunrise"]}</script>
</head><body>
<h1>Welcome to Sunrise Institute of Technology</h1>
<p>Sunrise Institute of Technology was established in 1998 and is affiliated to Anna University, Chennai. The college is accredited with NAAC 'A' grade and approved by AICTE. It is an autonomous institution located in Salem.</p>
<section><h2>Vision</h2><p>To be a centre of excellence producing competent engineers with ethical values for the service of society and industry.</p>
<h2>Mission</h2><p>To impart quality technical education, promote research and innovation, and nurture entrepreneurship among students through industry collaboration and continuous learning.</p></section>
<section><h2>Departments</h2><ul><li>Department of Computer Science and Engineering</li><li>Department of Electronics and Communication Engineering</li><li>Department of Mechanical Engineering</li><li>Department of Civil Engineering</li></ul></section>
<section><h2>Courses Offered</h2><table><tr><td>B.E. Computer Science and Engineering</td><td>4 Years</td><td>120 seats</td></tr>
<tr><td>B.E. Mechanical Engineering</td><td>4 Years</td><td>60 seats</td></tr></table></section>
<section><h2>Placements</h2><p>The highest package offered was 22 LPA and the average package was 4.5 LPA. 480 students placed and 96 companies visited the campus. Placement percentage 88%.</p>
<p>Recruiters include TCS, Infosys, Zoho, Cognizant and Bosch.</p></section>
<img src="/images/campus1.jpg" alt="Campus building">
<img src="/images/lab.jpg" alt="Computer laboratory">
<img src="/images/logo.png" alt="Logo">
<address>12 Omalur Main Road, Fairlands, Salem 636016, Tamil Nadu, India</address>
<a href="mailto:principal@sunrise.edu.in">principal@sunrise.edu.in</a>
<a href="/about-us">About Us</a><a href="/departments">Departments</a><a href="/placements">Placements</a>
<a href="https://www.facebook.com/sunrise">Facebook</a><a href="https://www.instagram.com/sunrisecollege">Instagram</a>
<p>Contact: +91 427 233 4455 / 94433 12345</p>
</body></html>`;

const draft = await importFromWebsite('https://www.sunrise.edu.in/', { html: fixture });
const checks = [
  ['name', draft.profile.name?.includes('Sunrise')],
  ['established from text', draft.profile.established_year === 1998],
  ['type autonomous', draft.profile.type === 'Autonomous'],
  ['accreditation NAAC', /NAAC/i.test(draft.profile.accreditation || '')],
  ['affiliation Anna University', /Anna University/i.test(draft.profile.affiliation || '')],
  ['phone from JSON-LD', (draft.profile.phone || '').includes('233')],
  ['email official', /@sunrise\.edu\.in/.test(draft.profile.email || '')],
  ['address', /Omalur|Fairlands/.test(draft.profile.address || '')],
  ['pincode', draft.profile.pincode === '636016'],
  ['city', /Salem/i.test(draft.profile.city || '')],
  ['state', /Tamil Nadu/i.test(draft.profile.state || '')],
  ['logo absolute', draft.profile.logo_url === 'https://www.sunrise.edu.in/assets/logo.png'],
  ['cover absolute', draft.profile.cover_url === '/images/campus-hero.jpg'],
  ['vision', /centre of excellence/i.test(draft.profile.vision || '')],
  ['mission', /quality technical education/i.test(draft.profile.mission || '')],
  ['about', /established in 1998/i.test(draft.profile.about || '')],
  ['facebook', /facebook/.test(draft.profile.social.facebook || '')],
  ['departments >= 4', draft.departments.length >= 4],
  ['courses >= 2', draft.courses.length >= 2],
  ['course eligibility captured', (draft.courses[0]?.eligibility || '').includes('120')],
  ['highest package crore/lakh math', draft.placements?.highest_package === 2200000],
  ['average package', draft.placements?.average_package === 450000],
  ['recruiters', draft.recruiters.map(r => r.name).join(',')],
  ['media images', draft.media.length],
];
let pass = 0;
for (const [label, ok] of checks) {
  const isOk = typeof ok === 'boolean' ? ok : Boolean(ok);
  if (isOk) pass++;
  console.log(isOk ? '  ok  ' : ' FAIL ', label, typeof ok === 'boolean' ? '' : `→ ${ok}`);
}
console.log(`\n  ${pass}/${checks.length} importer checks passed`);
console.log('  draft summary:', JSON.stringify(draft.summary));
