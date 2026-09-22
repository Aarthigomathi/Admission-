import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, '..');

export const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
export const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(ROOT, 'uploads');
export const CLIENT_DIST = path.resolve(ROOT, '..', 'client', 'dist');

for (const dir of [DATA_DIR, UPLOAD_DIR]) fs.mkdirSync(dir, { recursive: true });

/** JWT secret: taken from env, otherwise generated once and stored locally. */
function resolveJwtSecret() {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length >= 16) return process.env.JWT_SECRET;
  const file = path.join(DATA_DIR, '.jwt-secret');
  if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8').trim();
  const secret = crypto.randomBytes(48).toString('hex');
  fs.writeFileSync(file, secret, { mode: 0o600 });
  return secret;
}

export const config = {
  port: Number(process.env.PORT || 5000),
  host: process.env.HOST || '0.0.0.0',
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '12h',
  dbPath: process.env.DB_PATH || path.join(DATA_DIR, 'admissions.db'),
  uploadDir: UPLOAD_DIR,
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB || 8),
  /** When true, a new college account's email domain must match its website domain. */
  strictDomainCheck: process.env.STRICT_DOMAIN_CHECK === 'true',
  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  loginMaxAttempts: Number(process.env.LOGIN_MAX_ATTEMPTS || 5),
  lockoutMinutes: Number(process.env.LOGIN_LOCKOUT_MINUTES || 15),
};
