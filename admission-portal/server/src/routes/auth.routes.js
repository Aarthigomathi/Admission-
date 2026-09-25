import express from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { all, get, insert, now, slugify, run } from '../db.js';
import { registerFailedAttempt, clearFailedAttempts, hashPassword, isLocked, passwordProblems, requireCollege, signToken, audit, verifyPassword } from '../auth.js';
import { logActivity, emitToCollege } from '../realtime.js';
import { computeCompleteness } from '../services/completeness.js';
import { importFromWebsite, normaliseUrl } from '../services/websiteImport.js';

export const authRouter = express.Router();

const authLimiter = rateLimit({
  windowMs: 60_000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please wait a minute and try again.' },
});

const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{2,31}$/;

function clientIp(req) {
  return (req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || '').trim();
}

/** Domains seen in the official website's published email addresses. */
function emailDomainsFrom(payload) {
  const set = new Set();
  for (const e of [...(payload.emails?.all || []), ...(payload.emails?.official || [])]) {
    const domain = String(e).split('@')[1];
    if (domain) set.add(domain.toLowerCase());
  }
  return [...set];
}

/**
 * Step 1 of registration — reads the college's official site and returns the
 * email domains that are trusted for that institution.
 */
authRouter.post('/verify-domain', authLimiter, async (req, res) => {
  try {
    const url = normaliseUrl(req.body?.website);
    const payload = await importFromWebsite(url.toString(), { maxPages: 2 });
    const domains = emailDomainsFrom(payload);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    if (!domains.includes(host) && !domains.some((d) => d.endsWith(`.${host}`) || host.endsWith(`.${d}`))) {
      domains.push(host);
    }
    res.json({
      website: url.origin,
      host,
      trustedDomains: domains,
      sampleEmails: payload.profile?.email ? [payload.profile.email] : [],
      collegeDraft: {
        name: payload.profile?.name || '',
        city: payload.profile?.city || '',
        state: payload.profile?.state || '',
        established_year: payload.profile?.established_year || null,
        type: payload.profile?.type || '',
        accreditation: payload.profile?.accreditation || '',
        logo_url: payload.profile?.logo_url || '',
        address: payload.profile?.address || '',
        phone: payload.profile?.phone || '',
        about: payload.profile?.about || '',
      },
      message: domains.length
        ? `Use an official email ending with ${domains.map((d) => `@${d}`).join(' or ')}.`
        : 'No official email domain could be read from that site. Use your official college email.',
    });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Website verification failed' });
  }
});

/**
 * Step 2 — create the college profile + its single login account.
 * Enforces: one account per college (by website host and by college_id UNIQUE).
 */
authRouter.post('/register', authLimiter, async (req, res) => {
  const body = req.body || {};
  const problems = [];
  try {
    const url = normaliseUrl(body.website);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const email = String(body.email || '').trim().toLowerCase();
    const username = String(body.username || '').trim().toLowerCase();
    const collegeName = String(body.college_name || '').trim();
    const password = String(body.password || '');

    if (!collegeName || collegeName.length < 3) problems.push('A valid college name is required');
    if (!USERNAME_RE.test(username)) {
      problems.push('Username must be 3-32 characters (letters, numbers, dot, underscore or hyphen)');
    }
    if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) problems.push('A valid official email address is required');
    const weak = passwordProblems(password);
    if (weak.length) problems.push(`Password must contain ${weak.join(', ')}`);
    if (body.password !== body.confirm_password) problems.push('Passwords do not match');
    if (problems.length) return res.status(400).json({ error: problems.join('. ') });

    // ---- one login account per college -------------------------------------
    const existingCollege = get('SELECT * FROM colleges WHERE lower(website) LIKE ? OR slug = ?', [`%${host}%`, slugify(collegeName)]);
    if (existingCollege) {
      const existingAccount = get('SELECT id FROM college_accounts WHERE college_id = ?', [existingCollege.id]);
      if (existingAccount) {
        return res.status(409).json({
          error: `An account already exists for ${existingCollege.name}. Each college can have only one login. Please sign in or contact the portal administrator.`,
        });
      }
    }
    if (get('SELECT id FROM college_accounts WHERE username = ?', [username])) {
      return res.status(409).json({ error: 'That username is already taken' });
    }
    if (get('SELECT id FROM college_accounts WHERE email = ?', [email])) {
      return res.status(409).json({ error: 'That email is already registered' });
    }

    // ---- official-domain verification -------------------------------------
    let verification = { verified: false, method: 'official-website' };
    let draft = {};
    try {
      const payload = await importFromWebsite(url.toString(), { maxPages: 2 });
      const domains = emailDomainsFrom(payload);
      if (!domains.includes(host)) domains.push(host);
      const emailDomain = email.split('@')[1];
      const matches = domains.some((d) => d === emailDomain || emailDomain.endsWith(`.${d}`) || d.endsWith(`.${emailDomain}`));
      verification = {
        verified: matches,
        method: 'official-website-email',
        trustedDomains: domains,
      };
      draft = payload.profile || {};
    } catch {
      verification = { verified: false, method: 'unverified', note: 'Website could not be read during registration' };
    }

    if (!verification.verified && config.strictDomainCheck) {
      return res.status(400).json({
        error: `Your email must be on your college's official domain (${(verification.trustedDomains || [host]).join(', ')}). Registration with ${email} was rejected.`,
      });
    }

    // ---- write college + account ------------------------------------------
    const slugBase = slugify(collegeName) || host.replace(/\./g, '-');
    let slug = slugBase;
    let n = 2;
    while (get('SELECT id FROM colleges WHERE slug = ?', [slug])) slug = `${slugBase}-${n++}`;

    const ts = now();
    const collegeId = insert('colleges', {
      slug,
      college_code: `COL-${String(Date.now()).slice(-6)}`,
      name: collegeName,
      type: String(body.type || draft.type || 'Private').slice(0, 60),
      established_year: Number(body.established_year || draft.established_year) || null,
      accreditation: String(body.accreditation || draft.accreditation || '').slice(0, 200) || null,
      affiliation: draft.affiliation || null,
      about: String(body.about || draft.about || '').slice(0, 6000) || null,
      vision: draft.vision || null,
      mission: draft.mission || null,
      address: String(body.address || draft.address || '').slice(0, 500) || null,
      city: String(body.city || draft.city || '').slice(0, 80) || null,
      state: String(body.state || draft.state || '').slice(0, 80) || null,
      pincode: String(body.pincode || draft.pincode || '').slice(0, 12) || null,
      country: 'India',
      phone: String(body.phone || draft.phone || '').slice(0, 40) || null,
      email,
      admission_email: email,
      website: url.origin,
      logo_url: draft.logo_url || null,
      cover_url: draft.cover_url || null,
      source_url: url.origin,
      status: 'published',
      published_at: ts,
      created_at: ts,
      updated_at: ts,
    });

    const accountId = insert('college_accounts', {
      college_id: collegeId,
      username,
      email,
      password_hash: hashPassword(password),
      full_name: String(body.full_name || '').trim() || null,
      designation: String(body.designation || 'Admission Officer').trim(),
      phone: String(body.phone || '').slice(0, 40) || null,
      role: 'college_admin',
      status: 'active',
      verification_method: verification.method,
      password_changed_at: ts,
      created_at: ts,
      updated_at: ts,
    });

    const college = get('SELECT * FROM colleges WHERE id = ?', [collegeId]);
    const account = get('SELECT * FROM college_accounts WHERE id = ?', [accountId]);
    computeCompleteness(collegeId);

    audit({ collegeId, accountId, username, event: 'register', detail: `Created college account for ${collegeName}`, ip: clientIp(req), userAgent: req.headers['user-agent'] });
    logActivity({
      collegeId,
      entity: 'college',
      action: 'created',
      message: `${collegeName} joined the admission portal`,
      actor: 'college',
      visibility: 'public',
      meta: { verified: verification.verified },
    });

    const token = signToken(account, college);
    res.status(201).json({
      token,
      account: { id: account.id, username: account.username, email: account.email, full_name: account.full_name, designation: account.designation, role: account.role },
      college: { id: college.id, slug: college.slug, name: college.name, website: college.website, city: college.city, state: college.state },
      verification,
      message: 'College account created. Complete your profile to go live for students.',
    });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

/** Login — accepts username or official email. */
authRouter.post('/login', authLimiter, (req, res) => {
  const identifier = String(req.body?.identifier || req.body?.username || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!identifier || !password) return res.status(400).json({ error: 'Username and password are required' });

  const account = get('SELECT * FROM college_accounts WHERE lower(username) = ? OR lower(email) = ?', [identifier, identifier]);
  if (!account) {
    audit({ username: identifier, event: 'login_failed', detail: 'Unknown account', ip: clientIp(req), userAgent: req.headers['user-agent'] });
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  if (account.status !== 'active') {
    audit({ collegeId: account.college_id, accountId: account.id, username: account.username, event: 'login_blocked', detail: `status=${account.status}`, ip: clientIp(req) });
    return res.status(403).json({ error: 'This account has been suspended. Contact the portal administrator.' });
  }
  if (isLocked(account)) {
    return res.status(423).json({
      error: `Too many failed attempts. This account is locked until ${new Date(account.locked_until).toLocaleTimeString()}.`,
    });
  }
  if (!verifyPassword(password, account.password_hash)) {
    const { attempts, lockedUntil } = registerFailedAttempt(account);
    audit({ collegeId: account.college_id, accountId: account.id, username: account.username, event: 'login_failed', detail: `attempt ${attempts}`, ip: clientIp(req), userAgent: req.headers['user-agent'] });
    return res.status(401).json({
      error: lockedUntil
        ? `Invalid credentials. Account locked for ${config.lockoutMinutes} minutes.`
        : `Invalid username or password. ${config.loginMaxAttempts - attempts} attempt(s) left.`,
    });
  }

  clearFailedAttempts(account.id);
  run('UPDATE college_accounts SET last_login_at = ?, last_login_ip = ?, updated_at = ? WHERE id = ?', [now(), clientIp(req), now(), account.id]);
  const college = get('SELECT * FROM colleges WHERE id = ?', [account.college_id]);
  const token = signToken(account, college);
  audit({ collegeId: account.college_id, accountId: account.id, username: account.username, event: 'login_success', ip: clientIp(req), userAgent: req.headers['user-agent'] });
  emitToCollege(account.college_id, 'college:session', { at: now(), username: account.username });

  res.json({
    token,
    account: { id: account.id, username: account.username, email: account.email, full_name: account.full_name, designation: account.designation, role: account.role, last_login_at: account.last_login_at },
    college: { id: college.id, slug: college.slug, name: college.name, website: college.website, logo_url: college.logo_url, city: college.city, state: college.state },
    completeness: computeCompleteness(college.id),
  });
});

/** Current session. */
authRouter.get('/me', requireCollege, (req, res) => {
  const college = req.college;
  res.json({
    account: {
      id: req.account.id,
      username: req.account.username,
      email: req.account.email,
      full_name: req.account.full_name,
      designation: req.account.designation,
      phone: req.account.phone,
      role: req.account.role,
      last_login_at: req.account.last_login_at,
    },
    college: { id: college.id, slug: college.slug, name: college.name, website: college.website, logo_url: college.logo_url, status: college.status },
    completeness: computeCompleteness(college.id),
  });
});

authRouter.post('/change-password', requireCollege, (req, res) => {
  const { current_password: current, new_password: next, confirm_password: confirm } = req.body || {};
  if (!verifyPassword(String(current || ''), req.account.password_hash)) {
    audit({ collegeId: req.college.id, accountId: req.account.id, username: req.account.username, event: 'password_change_failed', ip: clientIp(req) });
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  const weak = passwordProblems(String(next || ''));
  if (weak.length) return res.status(400).json({ error: `New password must contain ${weak.join(', ')}` });
  if (next !== confirm) return res.status(400).json({ error: 'New passwords do not match' });
  if (next === current) return res.status(400).json({ error: 'New password must be different from the current password' });

  run('UPDATE college_accounts SET password_hash = ?, password_changed_at = ?, updated_at = ? WHERE id = ?', [
    hashPassword(String(next)),
    now(),
    now(),
    req.account.id,
  ]);
  audit({ collegeId: req.college.id, accountId: req.account.id, username: req.account.username, event: 'password_changed', ip: clientIp(req) });
  res.json({ message: 'Password updated successfully' });
});

authRouter.post('/logout', requireCollege, (req, res) => {
  audit({ collegeId: req.college.id, accountId: req.account.id, username: req.account.username, event: 'logout', ip: clientIp(req) });
  res.json({ message: 'Signed out' });
});

/** Security overview for the signed-in college (their own audit trail). */
authRouter.get('/security', requireCollege, (req, res) => {
  const events = all(
    `SELECT event, detail, ip, created_at FROM auth_audit WHERE college_id = ? ORDER BY id DESC LIMIT 25`,
    [req.college.id],
  );
  res.json({ events, account: { username: req.account.username, last_login_at: req.account.last_login_at, last_login_ip: req.account.last_login_ip, password_changed_at: req.account.password_changed_at } });
});
