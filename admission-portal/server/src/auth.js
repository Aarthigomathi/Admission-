import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { get, now, run } from './db.js';

const ROUNDS = 12;

export function hashPassword(password) {
  return bcrypt.hashSync(password, ROUNDS);
}
export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}

export function signToken(account, college) {
  return jwt.sign(
    {
      sub: account.id,
      collegeId: account.college_id,
      username: account.username,
      role: account.role,
      collegeName: college?.name,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn, issuer: 'admission-portal' },
  );
}

export function audit({ collegeId = null, accountId = null, username = null, event, detail = null, ip = null, userAgent = null }) {
  run(
    `INSERT INTO auth_audit (college_id, account_id, username, event, detail, ip, user_agent, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [collegeId, accountId, username, event, detail, ip, userAgent, now()],
  );
}

/** Password policy shared by registration and password change. */
export function passwordProblems(password) {
  const problems = [];
  if (typeof password !== 'string' || password.length < 8) problems.push('at least 8 characters');
  if (!/[A-Z]/.test(password || '')) problems.push('one uppercase letter');
  if (!/[a-z]/.test(password || '')) problems.push('one lowercase letter');
  if (!/[0-9]/.test(password || '')) problems.push('one number');
  if (!/[^A-Za-z0-9]/.test(password || '')) problems.push('one special character');
  return problems;
}

export function isLocked(account) {
  return Boolean(account?.locked_until && new Date(account.locked_until) > new Date());
}

export function registerFailedAttempt(account) {
  const attempts = (account.failed_attempts || 0) + 1;
  const lockedUntil =
    attempts >= config.loginMaxAttempts
      ? new Date(Date.now() + config.lockoutMinutes * 60_000).toISOString()
      : null;
  run('UPDATE college_accounts SET failed_attempts = ?, locked_until = ? WHERE id = ?', [
    lockedUntil ? 0 : attempts,
    lockedUntil,
    account.id,
  ]);
  return { attempts, lockedUntil };
}

export function clearFailedAttempts(accountId) {
  run('UPDATE college_accounts SET failed_attempts = 0, locked_until = NULL WHERE id = ?', [accountId]);
}

/** Express middleware: only authenticated college accounts. */
export function requireCollege(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    const payload = jwt.verify(token, config.jwtSecret, { issuer: 'admission-portal' });
    const account = get('SELECT * FROM college_accounts WHERE id = ?', [payload.sub]);
    if (!account || account.status !== 'active') {
      return res.status(401).json({ error: 'Account is not active' });
    }
    const college = get('SELECT * FROM colleges WHERE id = ?', [account.college_id]);
    if (!college) return res.status(401).json({ error: 'College not found' });
    req.account = account;
    req.college = college;
    return next();
  } catch {
    return res.status(401).json({ error: 'Session expired, please sign in again' });
  }
}
