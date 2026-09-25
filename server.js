/**
 * Student Portal - server.js
 *
 * Zero-dependency Node.js server (needs Node 22+ for the built-in `node:sqlite`).
 *
 *  - Serves the static site from /public
 *  - Auth API:
 *      POST /api/signup   create an account (scrypt-hashed password)
 *      POST /api/login    log in, sets an HttpOnly session cookie
 *      POST /api/logout   destroy the current session
 *      GET  /api/me       current logged-in user (or ok: false)
 *  - Registration API (login required):
 *      GET  /api/application             full application + progress
 *      POST /api/application/personal    save personal details
 *      POST /api/application/academic    save academic details
 *      POST /api/application/certificates  upload certificates (multipart)
 *      POST /api/application/register    final submit -> registration number
 *  - /dashboard.html is protected: visitors without a session are
 *    redirected to the login page.
 *
 * Start with:  npm start   (or: node server.js)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { db, DATA_DIR } = require('./db');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

/* ------------------------------ helpers ------------------------------ */

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify(payload));
}

function redirect(res, to) {
  res.writeHead(302, { Location: to });
  res.end();
}

/** Read the raw request body as a Buffer (with a size limit). */
function readRawBody(req, limit = 100 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > limit) {
        reject(new Error('Request body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

/** Read and parse a JSON request body. */
async function readJsonBody(req) {
  const raw = await readRawBody(req, 100 * 1024);
  if (!raw.length) return {};
  return JSON.parse(raw.toString('utf8'));
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function parseCookies(header = '') {
  const cookies = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > -1) {
      cookies[part.slice(0, idx).trim()] = safeDecode(part.slice(idx + 1).trim());
    }
  }
  return cookies;
}

/* ----------------------------- passwords ----------------------------- */

/** Hash a password with scrypt. Returns "salt:hash" (both hex). */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/** Constant-time check of a password against a stored "salt:hash". */
function verifyPassword(password, stored) {
  const [salt, expectedHex] = String(stored).split(':');
  if (!salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, 'hex');
  const actual = crypto.scryptSync(password, salt, expected.length);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

/* ------------------------------ sessions ----------------------------- */

const SESSION_COOKIE = 'student_portal_session';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days, in seconds

function createSession(res, userId) {
  const token = crypto.randomBytes(32).toString('hex');
  db.prepare(
    `INSERT INTO sessions (token, user_id, expires_at)
     VALUES (?, ?, datetime('now', '+7 days'))`
  ).run(token, userId);

  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE}`
  );
}

function destroySession(req, res) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (token) db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
  );
}

/** Returns the logged-in user (or null) for the request's session cookie. */
function getSessionUser(req) {
  const token = parseCookies(req.headers.cookie)[SESSION_COOKIE];
  if (!token) return null;
  return (
    db
      .prepare(
        `SELECT u.id, u.name, u.email, u.phone, u.created_at
           FROM sessions s
           JOIN users u ON u.id = s.user_id
          WHERE s.token = ? AND s.expires_at > datetime('now')`
      )
      .get(token) || null
  );
}

// Housekeeping: delete expired sessions once an hour.
setInterval(() => {
  db.prepare(`DELETE FROM sessions WHERE expires_at <= datetime('now')`).run();
}, 60 * 60 * 1000).unref();

/* ------------------------- multipart parsing -------------------------- */

/**
 * Minimal multipart/form-data parser (zero-dependency).
 * Splits the body on the boundary and returns [{ name, filename, content }].
 */
function parseMultipart(buffer, boundary) {
  const parts = [];
  const delimiter = Buffer.from('--' + boundary);
  const CRLF = Buffer.from('\r\n');

  let pos = buffer.indexOf(delimiter);
  while (pos !== -1) {
    const next = buffer.indexOf(delimiter, pos + delimiter.length);
    if (next === -1) break;

    let segment = buffer.slice(pos + delimiter.length, next);
    if (segment.slice(0, 2).equals(CRLF)) segment = segment.slice(2);
    if (segment.slice(-2).equals(CRLF)) segment = segment.slice(0, -2);

    const headerEnd = segment.indexOf('\r\n\r\n');
    if (headerEnd !== -1) {
      const headers = segment.slice(0, headerEnd).toString('utf8');
      parts.push({
        name: /name="([^"]*)"/i.exec(headers)?.[1] || '',
        filename: /filename="([^"]*)"/i.exec(headers)?.[1] || '',
        content: segment.slice(headerEnd + 4),
      });
    }
    pos = next;
  }
  return parts;
}

/* --------------------------- applications ----------------------------- */

function getOrCreateApplication(userId) {
  const existing = db.prepare('SELECT * FROM applications WHERE user_id = ?').get(userId);
  if (existing) return existing;
  try {
    db.prepare('INSERT INTO applications (user_id) VALUES (?)').run(userId);
  } catch {
    /* someone else created it first - fall through and re-read */
  }
  return db.prepare('SELECT * FROM applications WHERE user_id = ?').get(userId);
}

function parseCertificates(app) {
  try {
    return JSON.parse(app.certificates || '{}');
  } catch {
    return {};
  }
}

/** Which sections of the application are complete. */
function completeness(app) {
  const certs = parseCertificates(app);
  return {
    personal: Boolean(
      app.full_name && app.dob && app.gender && app.community &&
      app.address && app.city && app.district && app.state &&
      /^\d{6}$/.test(app.pincode || '') &&
      app.parent_name && app.parent_phone
    ),
    academic: Boolean(
      app.qualifying_exam && app.board && app.school_name &&
      app.year_of_passing && app.exam_register_no &&
      String(app.overall_percentage || '') !== ''
    ),
    certificates: Boolean(certs.photo && certs.tc && certs.marksheet),
  };
}

function applicationJson(app) {
  return {
    personal: {
      fullName: app.full_name,
      dob: app.dob,
      gender: app.gender,
      bloodGroup: app.blood_group,
      community: app.community,
      religion: app.religion,
      nationality: app.nationality,
      address: app.address,
      city: app.city,
      district: app.district,
      state: app.state,
      pincode: app.pincode,
      parentName: app.parent_name,
      parentPhone: app.parent_phone,
      parentOccupation: app.parent_occupation,
    },
    academic: {
      qualifyingExam: app.qualifying_exam,
      board: app.board,
      schoolName: app.school_name,
      yearOfPassing: app.year_of_passing,
      examRegisterNo: app.exam_register_no,
      overallPercentage: app.overall_percentage,
      mathsMark: app.maths_mark,
      physicsMark: app.physics_mark,
      chemistryMark: app.chemistry_mark,
    },
    certificates: parseCertificates(app),
    status: app.status,
    registrationNo: app.registration_no,
    submittedAt: app.submitted_at,
    progress: completeness(app),
  };
}

/* ----------------------------- validation ----------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\-\s]{7,15}$/;

function validateSignup(body = {}) {
  const errors = {};
  const values = {
    name: String(body.name || '').trim(),
    email: String(body.email || '').trim().toLowerCase(),
    phone: String(body.phone || '').trim(),
    password: String(body.password || ''),
    confirmPassword: String(body.confirmPassword || ''),
  };

  if (values.name.length < 2 || values.name.length > 60) {
    errors.name = 'Please enter your full name (2-60 characters).';
  }
  if (!EMAIL_RE.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!PHONE_RE.test(values.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return { errors, values };
}

function validatePersonal(body = {}) {
  const errors = {};
  const str = (k) => String(body[k] ?? '').trim();
  const values = {
    fullName: str('fullName'),
    dob: str('dob'),
    gender: str('gender'),
    bloodGroup: str('bloodGroup'),
    community: str('community'),
    religion: str('religion'),
    nationality: str('nationality') || 'Indian',
    address: str('address'),
    city: str('city'),
    district: str('district'),
    state: str('state'),
    pincode: str('pincode'),
    parentName: str('parentName'),
    parentPhone: str('parentPhone'),
    parentOccupation: str('parentOccupation'),
  };

  if (values.fullName.length < 2 || values.fullName.length > 80) {
    errors.fullName = 'Enter your full name.';
  }
  const dob = values.dob ? new Date(values.dob) : null;
  if (!values.dob || Number.isNaN(dob.getTime()) || dob > new Date()) {
    errors.dob = 'Enter a valid date of birth.';
  }
  if (!['Male', 'Female', 'Other'].includes(values.gender)) {
    errors.gender = 'Select your gender.';
  }
  if (!['', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].includes(values.bloodGroup)) {
    errors.bloodGroup = 'Invalid blood group.';
  }
  if (!['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST', 'Other'].includes(values.community)) {
    errors.community = 'Select your community.';
  }
  if (values.religion.length > 40) errors.religion = 'Too long.';
  if (values.nationality.length > 40) errors.nationality = 'Too long.';
  if (values.address.length < 5 || values.address.length > 250) {
    errors.address = 'Enter your full address.';
  }
  if (!values.city) errors.city = 'Enter your city / town.';
  if (!values.district) errors.district = 'Enter your district.';
  if (!values.state) errors.state = 'Enter your state.';
  if (!/^\d{6}$/.test(values.pincode)) {
    errors.pincode = 'Enter a 6-digit pincode.';
  }
  if (values.parentName.length < 2) {
    errors.parentName = 'Enter parent / guardian name.';
  }
  if (!PHONE_RE.test(values.parentPhone)) {
    errors.parentPhone = 'Enter a valid phone number.';
  }
  if (values.parentOccupation.length > 60) errors.parentOccupation = 'Too long.';

  return { errors, values };
}

function validateAcademic(body = {}) {
  const errors = {};
  const str = (k) => String(body[k] ?? '').trim();
  const values = {
    qualifyingExam: str('qualifyingExam'),
    board: str('board'),
    schoolName: str('schoolName'),
    yearOfPassing: str('yearOfPassing'),
    examRegisterNo: str('examRegisterNo'),
    overallPercentage: str('overallPercentage'),
    mathsMark: str('mathsMark'),
    physicsMark: str('physicsMark'),
    chemistryMark: str('chemistryMark'),
  };

  if (!['HSC (12th)', 'SSLC (10th)', 'Diploma', 'Other'].includes(values.qualifyingExam)) {
    errors.qualifyingExam = 'Select your qualifying exam.';
  }
  if (values.board.length < 2) {
    errors.board = 'Enter your board (e.g. State Board, CBSE).';
  }
  if (values.schoolName.length < 3) {
    errors.schoolName = 'Enter your school name.';
  }
  const year = parseInt(values.yearOfPassing, 10);
  if (!year || year < 1990 || year > 2027) {
    errors.yearOfPassing = 'Select year of passing.';
  }
  if (values.examRegisterNo.length < 2) {
    errors.examRegisterNo = 'Enter your exam register number.';
  }
  const pct = parseFloat(values.overallPercentage);
  if (!values.overallPercentage || Number.isNaN(pct) || pct < 0 || pct > 100) {
    errors.overallPercentage = 'Enter a percentage between 0 and 100.';
  }
  for (const [field, label] of [
    ['mathsMark', 'Maths'],
    ['physicsMark', 'Physics'],
    ['chemistryMark', 'Chemistry'],
  ]) {
    if (values[field] !== '') {
      const mark = parseFloat(values[field]);
      if (Number.isNaN(mark) || mark < 0 || mark > 100) {
        errors[field] = `${label} mark must be between 0 and 100.`;
      }
    }
  }

  return { errors, values };
}

/* ------------------------------- routes ------------------------------- */

async function handleSignup(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { ok: false, message: 'Invalid request body.' });
  }

  const { errors, values } = validateSignup(body);

  if (!errors.email) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(values.email);
    if (existing) errors.email = 'An account with this email already exists. Try logging in.';
  }

  if (Object.keys(errors).length > 0) {
    return sendJson(res, 400, { ok: false, errors });
  }

  const info = db
    .prepare('INSERT INTO users (name, email, phone, password_hash) VALUES (?, ?, ?, ?)')
    .run(values.name, values.email, values.phone, hashPassword(values.password));

  createSession(res, Number(info.lastInsertRowid));

  sendJson(res, 201, {
    ok: true,
    user: { name: values.name, email: values.email, phone: values.phone },
  });
}

async function handleLogin(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { ok: false, message: 'Invalid request body.' });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    return sendJson(res, 401, { ok: false, message: 'Invalid email or password.' });
  }

  createSession(res, user.id);

  sendJson(res, 200, {
    ok: true,
    user: { name: user.name, email: user.email, phone: user.phone },
  });
}

function handleLogout(req, res) {
  destroySession(req, res);
  sendJson(res, 200, { ok: true });
}

function handleMe(req, res) {
  const user = getSessionUser(req);
  if (!user) return sendJson(res, 200, { ok: false });
  sendJson(res, 200, {
    ok: true,
    user: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.created_at,
    },
  });
}

/** Guard for registration routes: returns the user or sends a 401. */
function requireUser(req, res) {
  const user = getSessionUser(req);
  if (!user) {
    sendJson(res, 401, { ok: false, message: 'Please log in first.' });
    return null;
  }
  return user;
}

function handleGetApplication(res, user) {
  const app = getOrCreateApplication(user.id);
  sendJson(res, 200, {
    ok: true,
    user: { name: user.name, email: user.email, phone: user.phone },
    application: applicationJson(app),
  });
}

async function handlePersonal(req, res, user) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { ok: false, message: 'Invalid request body.' });
  }

  const { errors, values } = validatePersonal(body);
  if (Object.keys(errors).length > 0) return sendJson(res, 400, { ok: false, errors });

  const app = getOrCreateApplication(user.id);
  db.prepare(
    `UPDATE applications SET
       full_name=?, dob=?, gender=?, blood_group=?, community=?, religion=?,
       nationality=?, address=?, city=?, district=?, state=?, pincode=?,
       parent_name=?, parent_phone=?, parent_occupation=?,
       updated_at=datetime('now')
     WHERE id=?`
  ).run(
    values.fullName, values.dob, values.gender, values.bloodGroup, values.community,
    values.religion, values.nationality, values.address, values.city, values.district,
    values.state, values.pincode, values.parentName, values.parentPhone,
    values.parentOccupation, app.id
  );

  sendJson(res, 200, { ok: true });
}

async function handleAcademic(req, res, user) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    return sendJson(res, 400, { ok: false, message: 'Invalid request body.' });
  }

  const { errors, values } = validateAcademic(body);
  if (Object.keys(errors).length > 0) return sendJson(res, 400, { ok: false, errors });

  const app = getOrCreateApplication(user.id);
  db.prepare(
    `UPDATE applications SET
       qualifying_exam=?, board=?, school_name=?, year_of_passing=?,
       exam_register_no=?, overall_percentage=?, maths_mark=?, physics_mark=?,
       chemistry_mark=?, updated_at=datetime('now')
     WHERE id=?`
  ).run(
    values.qualifyingExam, values.board, values.schoolName, values.yearOfPassing,
    values.examRegisterNo, values.overallPercentage, values.mathsMark,
    values.physicsMark, values.chemistryMark, app.id
  );

  sendJson(res, 200, { ok: true });
}

/* Certificate upload limits */
const ALLOWED_CERT_FIELDS = ['photo', 'tc', 'marksheet', 'community'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;      // 5 MB per file
const MAX_UPLOAD_TOTAL = 25 * 1024 * 1024;  // 25 MB per request

async function handleCertificates(req, res, user) {
  const contentType = req.headers['content-type'] || '';
  const boundaryMatch = /boundary=(.+)$/i.exec(contentType);
  if (!boundaryMatch) {
    return sendJson(res, 400, { ok: false, message: 'Expected multipart form data.' });
  }
  const boundary = boundaryMatch[1].trim().replace(/^"|"$/g, '');

  const expectedLength = Number(req.headers['content-length'] || 0);
  if (expectedLength > MAX_UPLOAD_TOTAL) {
    return sendJson(res, 413, { ok: false, message: 'Upload too large (max 25 MB total).' });
  }

  let buffer;
  try {
    buffer = await readRawBody(req, MAX_UPLOAD_TOTAL);
  } catch {
    return sendJson(res, 413, { ok: false, message: 'Upload too large (max 25 MB total).' });
  }

  const parts = parseMultipart(buffer, boundary);
  if (!parts.length) {
    return sendJson(res, 400, { ok: false, message: 'No files received.' });
  }

  const app = getOrCreateApplication(user.id);
  const certs = parseCertificates(app);
  const errors = {};

  for (const part of parts) {
    if (!ALLOWED_CERT_FIELDS.includes(part.name)) continue;
    if (!part.filename) continue; // empty file input

    const ext = path.extname(part.filename).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      errors[part.name] = 'Only PDF, JPG or PNG files are allowed.';
      continue;
    }
    if (part.content.length === 0) {
      errors[part.name] = 'The file is empty.';
      continue;
    }
    if (part.content.length > MAX_FILE_SIZE) {
      errors[part.name] = 'File must be under 5 MB.';
      continue;
    }

    const userDir = path.join(UPLOAD_DIR, String(user.id));
    fs.mkdirSync(userDir, { recursive: true });

    // Remove any previous version of this certificate, then save.
    for (const old of fs.readdirSync(userDir)) {
      if (old.startsWith(part.name + '.')) {
        try { fs.unlinkSync(path.join(userDir, old)); } catch { /* ignore */ }
      }
    }

    const savedName = part.name + ext;
    fs.writeFileSync(path.join(userDir, savedName), part.content);

    certs[part.name] = {
      originalName: path.basename(part.filename),
      savedName,
      size: part.content.length,
      uploadedAt: new Date().toISOString(),
    };
  }

  db.prepare(
    `UPDATE applications SET certificates=?, updated_at=datetime('now') WHERE id=?`
  ).run(JSON.stringify(certs), app.id);

  sendJson(res, 200, {
    ok: true,
    certificates: certs,
    ...(Object.keys(errors).length ? { errors } : {}),
  });
}

async function handleRegister(req, res, user) {
  const app = getOrCreateApplication(user.id);

  if (app.status === 'registered') {
    return sendJson(res, 200, {
      ok: true,
      already: true,
      application: applicationJson(app),
    });
  }

  const progress = completeness(app);
  if (!progress.personal || !progress.academic || !progress.certificates) {
    const missing = [];
    if (!progress.personal) missing.push('Personal details');
    if (!progress.academic) missing.push('Academic details');
    if (!progress.certificates) missing.push('Certificates');
    return sendJson(res, 400, {
      ok: false,
      message: 'Complete these sections before registering: ' + missing.join(', ') + '.',
      missing,
    });
  }

  const registrationNo = `SP${new Date().getFullYear()}-${String(app.id).padStart(4, '0')}`;
  db.prepare(
    `UPDATE applications
        SET status='registered', registration_no=?, submitted_at=datetime('now')
      WHERE id=?`
  ).run(registrationNo, app.id);

  const updated = db.prepare('SELECT * FROM applications WHERE id = ?').get(app.id);
  sendJson(res, 201, { ok: true, application: applicationJson(updated) });
}

/* ---------------------------- static files --------------------------- */

function notFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(
    `<!doctype html><html><head><title>404 - Not found</title></head>
     <body style="font-family:system-ui,sans-serif;padding:4rem 1rem;text-align:center;color:#1e293b">
       <h1 style="font-size:3.5rem">404</h1>
       <p>That page could not be found.</p>
       <p><a href="/" style="color:#4f46e5">&larr; Back to home</a></p>
     </body></html>`
  );
}

function sendFileFromDisk(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) return notFound(res);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  });
}

function serveStatic(res, pathname) {
  const clean = path.normalize(pathname).replace(/^([/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, clean);

  // Prevent path traversal, e.g. "/../server.js".
  if (!filePath.startsWith(PUBLIC_DIR + path.sep)) return notFound(res);

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return notFound(res);
    sendFileFromDisk(res, filePath);
  });
}

/* ------------------------------- server ------------------------------ */

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = safeDecode(url.pathname);

  try {
    // ---- auth API ----
    if (pathname === '/api/signup' && req.method === 'POST') return await handleSignup(req, res);
    if (pathname === '/api/login' && req.method === 'POST') return await handleLogin(req, res);
    if (pathname === '/api/logout' && req.method === 'POST') return handleLogout(req, res);
    if (pathname === '/api/me' && req.method === 'GET') return handleMe(req, res);

    // ---- registration API (login required) ----
    if (pathname === '/api/application' && req.method === 'GET') {
      const user = requireUser(req, res);
      if (user) handleGetApplication(res, user);
      return;
    }
    if (pathname === '/api/application/personal' && req.method === 'POST') {
      const user = requireUser(req, res);
      if (user) return await handlePersonal(req, res, user);
      return;
    }
    if (pathname === '/api/application/academic' && req.method === 'POST') {
      const user = requireUser(req, res);
      if (user) return await handleAcademic(req, res, user);
      return;
    }
    if (pathname === '/api/application/certificates' && req.method === 'POST') {
      const user = requireUser(req, res);
      if (user) return await handleCertificates(req, res, user);
      return;
    }
    if (pathname === '/api/application/register' && req.method === 'POST') {
      const user = requireUser(req, res);
      if (user) return await handleRegister(req, res, user);
      return;
    }
    if (pathname.startsWith('/api/')) {
      return sendJson(res, 404, { ok: false, message: 'Unknown API route.' });
    }

    // ---- pages ----
    if (req.method !== 'GET' && req.method !== 'HEAD') return notFound(res);

    if (pathname === '/' || pathname === '/index.html') {
      return sendFileFromDisk(res, path.join(PUBLIC_DIR, 'index.html'));
    }

    // Dashboard is only for logged-in users.
    if (pathname === '/dashboard.html') {
      if (!getSessionUser(req)) return redirect(res, '/login.html');
      return sendFileFromDisk(res, path.join(PUBLIC_DIR, 'dashboard.html'));
    }

    // ---- static assets (css / js / images) ----
    serveStatic(res, pathname);
  } catch (err) {
    console.error(`[${new Date().toISOString()}]`, err);
    if (!res.headersSent) {
      sendJson(res, 500, { ok: false, message: 'Something went wrong. Please try again.' });
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Student Portal is running -> http://localhost:${PORT}`);
});
