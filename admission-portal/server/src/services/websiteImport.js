/**
 * Official-website importer.
 *
 * A college signs in, enters its official website URL, and the portal reads the
 * public pages of that site and pre-fills the profile: contact details, about /
 * vision / mission text, departments, courses, facilities, hostel, transport,
 * library, sports, images and more. Everything lands in the dashboard as a
 * *draft* that the college reviews, edits and then applies — nothing is written
 * to the live profile until the college confirms it.
 */
import * as cheerio from 'cheerio';
import dns from 'node:dns/promises';
import net from 'node:net';

const UA =
  'Mozilla/5.0 (compatible; AdmissionPortalBot/1.0; +https://example.edu/bot) AppleWebKit/537.36 Chrome/120 Safari/537.36';

const PAGE_HINTS = {
  about: ['about', 'about-us', 'aboutus', 'profile', 'overview', 'institution'],
  vision: ['vision-mission', 'vision', 'mission'],
  departments: ['department', 'departments', 'academic-departments', 'faculty'],
  courses: ['course', 'courses', 'programme', 'program', 'academics', 'admission', 'admissions'],
  fees: ['fee', 'fees', 'fee-structure', 'tuition'],
  placements: ['placement', 'placements', 'career', 'training-placement'],
  hostel: ['hostel', 'hostels', 'accommodation', 'residence'],
  transport: ['transport', 'bus', 'buses', 'travel'],
  library: ['library', 'central-library', 'learning-resource'],
  sports: ['sport', 'sports', 'physical-education', 'gym'],
  facilities: ['facilit', 'infrastructure', 'campus', 'amenities'],
  faculty: ['faculty', 'staff', 'professor'],
  contact: ['contact', 'contact-us', 'reach', 'location', 'how-to-reach'],
  gallery: ['gallery', 'photo', 'photos', 'media', 'campus-tour'],
  scholarships: ['scholarship', 'scholarships', 'financial-aid'],
  events: ['event', 'events', 'news'],
  achievements: ['achievement', 'achievements', 'awards', 'ranking', 'accreditation'],
};

const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1', 'metadata.google.internal'];

/** Block SSRF into private / loopback ranges. */
async function assertPublicHost(hostname) {
  if (BLOCKED_HOSTS.includes(hostname.toLowerCase())) throw new Error('This host is not allowed');
  const records = await dns.lookup(hostname, { all: true }).catch(() => []);
  if (!records.length) throw new Error(`Could not resolve ${hostname}`);
  for (const { address } of records) {
    const type = net.isIP(address);
    if (type === 4) {
      const [a, b] = address.split('.').map(Number);
      const priv =
        a === 10 || a === 127 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254) || a === 0;
      if (priv) throw new Error('This host is not allowed');
    } else if (type === 6) {
      const lower = address.toLowerCase();
      if (lower === '::1' || lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe80')) {
        throw new Error('This host is not allowed');
      }
    }
  }
  return records;
}

export function normaliseUrl(input) {
  let value = String(input || '').trim();
  if (!value) throw new Error('Website URL is required');
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) value = `https://${value}`;
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only http and https websites are supported');
  return url;
}

async function fetchPage(url, timeoutMs = 12_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const type = res.headers.get('content-type') || '';
    if (!type.includes('html')) return null;
    const html = await res.text();
    return { html: html.slice(0, 900_000), finalUrl: res.url || url };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function textOf($, el) {
  return $(el).text().replace(/\s+/g, ' ').trim();
}

function absolute(href, base) {
  try {
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

/** Collect internal links, grouped by which section they probably belong to. */
function mapLinks($, baseUrl) {
  const origin = new URL(baseUrl).origin;
  const groups = {};
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    const url = absolute(href, baseUrl);
    if (!url || !url.startsWith(origin)) return;
    const clean = url.split('#')[0];
    if (clean.length > 400) return;
    const haystack = `${clean}`.toLowerCase();
    for (const [key, hints] of Object.entries(PAGE_HINTS)) {
      if (hints.some((h) => haystack.includes(h))) {
        groups[key] = groups[key] || new Set();
        groups[key].add(clean);
        break;
      }
    }
  });
  return Object.fromEntries(Object.entries(groups).map(([k, set]) => [k, [...set].slice(0, 3)]));
}

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const PHONE_RE = /(?:\+91[\s-]?)?(?:0?\d{2,4}[\s-]?)?\d{6,8}\b/g;

function pickEmails(text) {
  const all = (text.match(EMAIL_RE) || []).map((e) => e.toLowerCase());
  const bad = /(example|sentry|wixpress|schema|noreply|no-reply|domain\.com)/i;
  const unique = [...new Set(all.filter((e) => !bad.test(e)))];
  const official = unique.filter((e) => /(principal|admission|admissions|office|info|registrar|dean|contact|hod|admin)/i.test(e));
  return { all: unique.slice(0, 8), official: (official.length ? official : unique).slice(0, 4) };
}

function pickPhones(text) {
  const matches = (text.match(PHONE_RE) || [])
    .map((p) => p.replace(/[^\d+]/g, ''))
    .filter((p) => p.replace(/\D/g, '').length >= 10 && p.replace(/\D/g, '').length <= 13);
  return [...new Set(matches)].slice(0, 4);
}

function parseListItems($, $scope) {
  const items = [];
  $scope.find('li, h3, h4, td, .card, article').each((_, el) => {
    const t = textOf($, el);
    if (t.length > 4 && t.length < 120) items.push(t);
  });
  return [...new Set(items)];
}

function sectionText($, keywords) {
  const wanted = keywords.map((k) => k.toLowerCase());
  let best = '';
  $('section, div, article').each((_, el) => {
    const $el = $(el);
    const heading = textOf($, $el.find('h1, h2, h3').first());
    if (!heading) return;
    if (!wanted.some((k) => heading.toLowerCase().includes(k))) return;
    const t = textOf($, $el);
    if (t.length > best.length && t.length < 6000) best = t;
  });
  return best;
}

function extractProfileSnippets($) {
  const out = { about: '', vision: '', mission: '' };
  const welcome = sectionText($, ['welcome', 'about', 'about us', 'about the college', 'introduction', 'overview']);
  if (welcome) out.about = welcome.replace(/\s*(more\.\.\.|read more|more)\s*$/i, '').trim();
  const vmText = sectionText($, ['vision', 'mission', 'vision & mission', 'vision and mission']);
  if (vmText) {
    const visionMatch = vmText.match(/vision[:\s-]*(.{40,900}?)(?=mission|$)/i);
    const missionMatch = vmText.match(/mission[:\s-]*(.{40,1200})/i);
    if (visionMatch) out.vision = visionMatch[1].trim();
    if (missionMatch) out.mission = missionMatch[1].trim();
  }
  return out;
}

function extractStructured($, baseUrl) {
  const data = {
    name: '',
    type: '',
    established: null,
    accreditation: '',
    affiliation: '',
    addressLines: [],
    city: '',
    state: '',
    pincode: '',
    logo: '',
    cover: '',
    images: [],
    social: {},
    emails: { all: [], official: [] },
    phones: [],
    highlights: [],
  };

  // JSON-LD first (most reliable)
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).contents().text() || '{}');
      const nodes = Array.isArray(parsed) ? parsed : parsed['@graph'] ? parsed['@graph'] : [parsed];
      for (const node of nodes) {
        if (!node || typeof node !== 'object') continue;
        const type = String(node['@type'] || '').toLowerCase();
        if (!/college|university|school|organization|educational/.test(type)) continue;
        if (node.name && !data.name) data.name = String(node.name).trim();
        if (node.logo) data.logo = typeof node.logo === 'string' ? node.logo : node.logo.url || data.logo;
        if (node.image) data.cover = typeof node.image === 'string' ? node.image : node.image.url || data.cover;
        if (node.telephone) data.phones.push(String(node.telephone));
        if (node.email) data.emails.all.push(String(node.email));
        const addr = node.address;
        if (addr && typeof addr === 'object') {
          const line = [addr.streetAddress, addr.addressLocality, addr.addressRegion, addr.postalCode].filter(Boolean).join(', ');
          if (line) data.addressLines.push(line);
          if (addr.addressLocality) data.city = addr.addressLocality;
          if (addr.addressRegion) data.state = addr.addressRegion;
          if (addr.postalCode) data.pincode = String(addr.postalCode);
        }
        if (node.sameAs) [].concat(node.sameAs).forEach((l) => {
          if (/facebook/.test(l)) data.social.facebook = l;
          if (/instagram/.test(l)) data.social.instagram = l;
          if (/linkedin/.test(l)) data.social.linkedin = l;
          if (/youtube|youtu\.be/.test(l)) data.social.youtube = l;
        });
      }
    } catch {
      /* ignore malformed JSON-LD */
    }
  });

  if (!data.name) {
    const og = $('meta[property="og:site_name"]').attr('content') || $('meta[property="og:title"]').attr('content');
    data.name = (og || textOf($, $('title').first()) || textOf($, $('h1').first()) || '')
      .split(/[|\-–]/)[0]
      .trim();
  }
  if (!data.logo) {
    const icon = $('link[rel~="icon"]').attr('href') || $('link[rel="apple-touch-icon"]').attr('href');
    if (icon) data.logo = icon;
  }
  if (!data.cover) data.cover = $('meta[property="og:image"]').attr('content') || '';

  // social links from anchors
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    if (/facebook\.com/.test(href) && !data.social.facebook) data.social.facebook = href;
    if (/instagram\.com/.test(href) && !data.social.instagram) data.social.instagram = href;
    if (/linkedin\.com/.test(href) && !data.social.linkedin) data.social.linkedin = href;
    if (/youtube\.com|youtu\.be/.test(href) && !data.social.youtube) data.social.youtube = href;
  });

  // images
  const seen = new Set();
  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
    const alt = textOf($, el) || $(el).attr('alt') || '';
    if (!src) return;
    if (/\.(svg|gif)$/i.test(src)) return;
    if (/logo|icon|sprite|banner-ad|pixel/i.test(src + alt)) return;
    const absoluteSrc = absolute(src, baseUrl);
    if (!absoluteSrc || seen.has(absoluteSrc)) return;
    seen.add(absoluteSrc);
    if (data.images.length < 14) data.images.push({ url: absoluteSrc, alt: alt.slice(0, 120) });
  });

  const bodyText = $('body').text().replace(/\s+/g, ' ');
  data.emails = pickEmails(bodyText);
  data.phones = [...new Set([...data.phones, ...pickPhones(bodyText)])].slice(0, 4);

  // established year / type / accreditation
  const estMatch = bodyText.match(/(?:established|founded|since)\s*(?:in)?\s*(1[89]\d{2}|20\d{2})/i);
  if (estMatch) data.established = Number(estMatch[1]);
  if (/deemed\s+to\s+be\s+university|deemed university/i.test(bodyText)) data.type = 'Deemed University';
  else if (/government[- ]aided/i.test(bodyText)) data.type = 'Government Aided';
  else if (/autonomous/i.test(bodyText)) data.type = 'Autonomous';
  else if (/\bgovernment\b/i.test(bodyText)) data.type = 'Government';
  else if (/\bprivate\b/i.test(bodyText)) data.type = 'Private';

  const naac = bodyText.match(/NAAC[^.]{0,80}/i);
  if (naac) data.accreditation = naac[0].trim();
  const aff = bodyText.match(/affiliated\s+to\s+([A-Z][A-Za-z .,&()]{4,70})/);
  if (aff) data.affiliation = aff[1].trim().replace(/[.,]$/, '');
  const nirf = bodyText.match(/NIRF[^.]{0,70}/i);
  if (nirf) data.highlights.push(nirf[0].trim());
  const rank = bodyText.match(/ranked?\s+(?:among)?\s*[^.]{0,60}/i);
  if (rank) data.highlights.push(rank[0].trim());

  return data;
}

function cleanText(text, max = 1200) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/**
 * Main entry point: crawl the official site and return a structured draft.
 */
export async function importFromWebsite(rawUrl, { maxPages = 10, html = null } = {}) {
  const url = normaliseUrl(rawUrl);
  let home;
  let crawl = true;

  if (html) {
    // offline mode: the college pasted their page source (also used for sites
    // that block automated requests)
    home = { html: String(html).slice(0, 900_000), finalUrl: url.toString() };
    crawl = false;
  } else {
    await assertPublicHost(url.hostname);
    home = await fetchPage(url.toString());
    if (!home) throw new Error('Could not reach that website. Check the URL and try again.');
  }

  const $home = cheerio.load(home.html);
  const structured = extractStructured($home, home.finalUrl);
  const snippets = extractProfileSnippets($home);
  const homeText = cleanText($home('body').text(), 4000);
  const links = mapLinks($home, home.finalUrl);

  const visited = new Set([home.finalUrl]);
  const pages = {};
  const queue = [];
  for (const [key, urls] of Object.entries(links)) queue.push([key, urls[0]]);

  for (const [key, pageUrl] of crawl ? queue.slice(0, maxPages) : []) {
    if (!pageUrl || visited.has(pageUrl)) continue;
    visited.add(pageUrl);
    // eslint-disable-next-line no-await-in-loop
    const page = await fetchPage(pageUrl);
    if (!page) continue;
    const $$ = cheerio.load(page.html);
    pages[key] = { url: page.finalUrl, text: cleanText($$('body').text(), 6000), $: $$ };
  }

  const draft = { source: url.origin, pagesFound: Object.keys(pages), fetchedAt: new Date().toISOString() };

  draft.profile = {
    name: structured.name || '',
    type: structured.type || '',
    established_year: structured.established || null,
    accreditation: structured.accreditation || '',
    affiliation: structured.affiliation || '',
    logo_url: structured.logo ? absolute(structured.logo, home.finalUrl) || '' : '',
    cover_url: structured.cover || '',
    website: url.origin,
    phone: structured.phones[0] || '',
    email: structured.emails.official[0] || structured.emails.all[0] || '',
    social: structured.social,
    highlights: [...new Set(structured.highlights)].slice(0, 6),
    source_url: home.finalUrl,
  };

  // address
  const addressText =
    structured.addressLines[0] ||
    ($home('address').length ? cleanText($home('address').first().text(), 300) : '') ||
    (pages.contact ? cleanText(pages.contact.text, 300) : '');
  if (addressText) {
    draft.profile.address = addressText;
    const pin = addressText.match(/\b(\d{6})\b/);
    if (pin) draft.profile.pincode = pin[1];
  }
  draft.profile.city = structured.city || '';
  draft.profile.state = structured.state || '';

  // about / vision / mission
  const aboutText = snippets.about || (pages.about ? cleanText(pages.about.text, 2500) : homeText);
  if (aboutText) {
    draft.profile.about = aboutText;
    if (!draft.profile.city) {
      const cityMatch = aboutText.match(/(?:located|situated)\s+(?:at|in)\s+([A-Z][A-Za-z]+)/);
      if (cityMatch) draft.profile.city = cityMatch[1];
    }
  }
  if (snippets.vision) draft.profile.vision = snippets.vision;
  if (snippets.mission) draft.profile.mission = snippets.mission;

  if (!draft.profile.vision && pages.vision) {
    const v = pages.vision.text.match(/vision[:\s-]*(.{40,900}?)(?=mission|$)/i);
    const m = pages.vision.text.match(/mission[:\s-]*(.{40,1200})/i);
    if (v) draft.profile.vision = v[1].trim();
    if (m) draft.profile.mission = m[1].trim();
  }

  // ---- section extraction (dedicated page first, home page as fallback) --
  const homePage = { url: home.finalUrl, text: homeText, $: $home, isHome: true };
  const pickPage = (key) => pages[key] || homePage;

  const DEGREE_RE = /\b(B\.?E|B\.?Tech|M\.?E|M\.?Tech|MBA|MCA|M\.?Com|M\.?Sc|M\.?A|B\.?Com|B\.?Sc|B\.?A|BBA|BCA|B\.?Arch|B\.?Des|B\.?Pharm|M\.?Pharm|B\.?Ed|LLB|LLM|MSW|MPhil|Ph\.?D|Diploma|PG Diploma|Integrated)\b/i;
  const DEPT_RE = /\b(department|dept\.?|school) (of|for)\b/i;

  // departments -----------------------------------------------------------
  const deptSources = [pages.departments, homePage].filter(Boolean);
  let depNames = [];
  for (const source of deptSources) {
    const items = parseListItems(source.$, source.$('body'));
    const found = items.filter((item) => DEPT_RE.test(item) && item.length < 120 && !/^(department|departments)$/i.test(item));
    if (found.length > depNames.length) depNames = found;
    if (found.length >= 3) break;
  }
  if (!depNames.length) depNames = [...new Set(collectTokens(homeText, ['department of', 'dept. of']))].slice(0, 30);
  draft.departments = [...new Set(depNames)]
    .filter((n) => !/^(home|about|contact|login|menu|read more|click here)$/i.test(n))
    .slice(0, 30)
    .map((name) => ({ name: cleanText(name, 120), source_url: home.finalUrl }));

  // courses ---------------------------------------------------------------
  const courseRows = [];
  for (const source of [pages.courses, homePage].filter(Boolean)) {
    const $c = source.$;
    $c('table tr').each((_, tr) => {
      const cells = $c(tr).find('td, th').map((__, td) => cleanText($c(td).text(), 160)).get().filter(Boolean);
      const label = cells.join(' ');
      if (cells.length >= 2 && DEGREE_RE.test(label)) courseRows.push({ name: cells[0], detail: cells.slice(1).join(' | ') });
    });
    for (const item of parseListItems($c, $c('body'))) {
      if (item.length < 8 || item.length > 160) continue;
      if (!DEGREE_RE.test(item)) continue;
      if (/^(courses|programmes|programs)$/i.test(item)) continue;
      courseRows.push({ name: item, detail: '' });
    }
    if (courseRows.length >= 2) break;
  }
  const courseMap = new Map();
  for (const row of courseRows) {
    const key = row.name.toLowerCase();
    const previous = courseMap.get(key);
    if (!previous || (row.detail || '').length > (previous.detail || '').length) courseMap.set(key, row);
  }
  draft.courses = [...courseMap.values()].slice(0, 30).map((c) => ({
    name: cleanText(c.name, 140),
    eligibility: c.detail ? cleanText(c.detail, 300) : '',
    source_url: home.finalUrl,
  }));

  // placements ------------------------------------------------------------
  const placementPage = pages.placements || pages.career || null;
  const placementText = placementPage ? placementPage.text : homeText;
  if (/package|placed|placement|recruit|recruiter|offer/i.test(placementText)) {
    draft.placements = {
      highest_package: matchNumber(placementText, [
        /(?:highest|max(?:imum)?)\s*(?:package|salary|ctc)[^\d]{0,24}([\d.,]+)\s*(lpa|lakhs?|lac|crore|crores?|cr)?/i,
        /([\d.,]+)\s*(?:lpa|lakhs?|crore|crores?)\s*(?:is\s*)?the\s*highest/i,
      ]),
      average_package: matchNumber(placementText, [
        /(?:average|avg|mean)\s*(?:package|salary|ctc)[^\d]{0,24}([\d.,]+)\s*(lpa|lakhs?|lac)?/i,
        /([\d.,]+)\s*(?:lpa|lakhs?)\s*(?:is\s*)?the\s*average/i,
      ]),
      students_placed: matchNumber(placementText, [/([\d,]{2,6})\s*(?:students|offers)?\s*placed/i, /placed[^\d]{0,24}([\d,]{2,6})/i]),
      companies_visited: matchNumber(placementText, [/([\d,]{2,5})\s*(?:\+)?\s*(?:companies|recruiters|organisations|organizations)/i]),
      placement_percentage: matchNumber(placementText, [/placement[^\d]{0,30}(\d{1,3}(?:\.\d+)?)\s*%/i]),
      notes: cleanText(placementText, 900),
      source_url: placementPage ? placementPage.url : home.finalUrl,
    };
  } else {
    draft.placements = null;
  }

  // recruiters ------------------------------------------------------------
  const recruiterText = [placementText, pages.courses?.text, homeText].filter(Boolean).join(' ');
  const known = [
    'TCS', 'Infosys', 'Wipro', 'Cognizant', 'Accenture', 'Capgemini', 'HCL', 'Tech Mahindra', 'IBM', 'Amazon',
    'Microsoft', 'Google', 'Deloitte', 'EY', 'KPMG', 'PwC', 'L&T', 'Bosch', 'Caterpillar', 'TVS', 'Ashok Leyland',
    'Hyundai', 'Zoho', 'Freshworks', 'Ford', 'Renault Nissan', 'PayPal', 'Qualcomm', 'Nvidia', 'Oracle', 'SAP',
    'Adobe', 'Goldman Sachs', 'Texas Instruments', 'Bain & Company', 'Cisco', 'Intel', 'Samsung', 'Honeywell',
  ];
  draft.recruiters = known
    .filter((c) => new RegExp(`\\b${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(recruiterText))
    .slice(0, 30)
    .map((name) => ({ name, source_url: placementPage ? placementPage.url : home.finalUrl }));

  // hostels / transport / library / sports / facilities / scholarships
  const simpleFrom = (key, extra = {}) => {
    const page = pages[key] || (['hostel', 'transport', 'library', 'sports'].includes(key) ? homePage : null);
    if (!page) return [];
    const lines = parseListItems(page.$, page.$('body'))
      .filter((l) => l.length > 3 && l.length < 120)
      .slice(0, 12);
    return lines.map((name) => ({ name, source_url: page.url, ...extra }));
  };

  draft.hostels = simpleFrom('hostel').map((h) => ({
    name: h.name,
    description: `Imported from ${h.source_url}`,
  }));
  draft.transport = simpleFrom('transport').map((t) => ({ route_name: t.name, description: `Imported from ${t.source_url}` }));
  draft.library = simpleFrom('library').map((l) => ({ name: l.name }));
  draft.sports = simpleFrom('sports').map((s) => ({ sport_name: s.name }));
  draft.facilities = simpleFrom('facilities').map((f) => ({ name: f.name }));
  draft.scholarships = simpleFrom('scholarships').map((s) => ({ name: s.name, eligibility: 'See official website' }));
  draft.events = simpleFrom('events').map((e) => ({ title: e.name, status: 'Upcoming' }));
  draft.achievements = simpleFrom('achievements').map((a) => ({ title: a.name }));

  // gallery images from home + gallery page
  const galleryImages = [...structured.images];
  if (pages.gallery) {
    pages.gallery.$('img').each((_, el) => {
      const src = pages.gallery.$(el).attr('src') || pages.gallery.$(el).attr('data-src');
      const url2 = src && absolute(src, pages.gallery.url);
      if (url2 && galleryImages.length < 24 && !galleryImages.some((g) => g.url === url2)) {
        galleryImages.push({ url: url2, alt: '' });
      }
    });
  }
  draft.media = galleryImages.map((img, index) => ({
    title: img.alt || `${draft.profile.name || 'Campus'} photo ${index + 1}`,
    type: 'Image',
    category: 'Campus',
    url: img.url,
    sort_order: index,
  }));

  draft.generatedAt = new Date().toISOString();
  draft.summary = {
    profileFields: Object.values(draft.profile).filter((v) => v && typeof v === 'string' && v.trim()).length,
    departments: draft.departments.length,
    courses: draft.courses.length,
    recruiters: draft.recruiters.length,
    media: draft.media.length,
    pagesCrawled: draft.pagesFound.length + 1,
  };
  return draft;
}

function collectTokens(text, keywords) {
  const found = [];
  for (const keyword of keywords) {
    const re = new RegExp(`${keyword}\\s*(?:of|in)?\\s*([A-Z][A-Za-z&.,\\- ]{3,60})`, 'g');
    let m;
    while ((m = re.exec(text))) {
      found.push(m[1].replace(/\s+/g, ' ').trim().replace(/[.,]$/, ''));
    }
  }
  return found;
}

function matchNumber(text, regexes) {
  for (const re of regexes) {
    const m = text.match(re);
    if (m) {
      const raw = (m[1] || '').replace(/,/g, '');
      const n = Number(raw);
      if (!Number.isFinite(n)) continue;
      const unit = (m[2] || '').toLowerCase();
      if (/crore|cr$/.test(unit)) return n * 10_000_000;
      if (/lpa|lakh|lac/.test(unit)) return n * 100_000;
      return n;
    }
  }
  return null;
}

export const __testables = { assertPublicHost, extractStructured, normaliseUrl, matchNumber };
