/**
 * Admission Portal - server.js
 *
 * Zero-dependency Node.js server (needs Node 22+ for the built-in `node:sqlite`).
 *
 *  - Serves the static site from /public
 *  - Auth API:
 *      POST /api/signup   create an account (scrypt-hashed password)
 *      POST /api/login    log in, sets an HttpOnly session cookie
 *      POST /api/logout   destroy the current session
 *      GET  /api/me       current logged-in user (or ok: false)
 *  - /dashboard.html is protected: visitors without a session are
 *    redirected to the login page.
 *
 * Start with:  npm start   (or: node server.js)
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { db } = require('./db');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

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

/** Read and parse a JSON request body (max ~100 KB). */
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
      if (raw.length > 100 * 1024) {
        reject(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

function parseCookies(header = '') {
  const cookies = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > -1) {
      cookies[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
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

const SESSION_COOKIE = 'admission_session';
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

/* ----------------------------- validation ---------------------------- */

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

/* ------------------------------- routes ------------------------------ */

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
  const pathname = decodeURIComponent(url.pathname);

  try {
    // ---- API ----
    if (pathname === '/api/signup' && req.method === 'POST') return await handleSignup(req, res);
    if (pathname === '/api/login' && req.method === 'POST') return await handleLogin(req, res);
    if (pathname === '/api/logout' && req.method === 'POST') return handleLogout(req, res);
    if (pathname === '/api/me' && req.method === 'GET') return handleMe(req, res);
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
  console.log(`Admission Portal is running -> http://localhost:${PORT}`);
});
