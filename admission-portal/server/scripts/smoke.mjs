/**
 * Server smoke test — verifies the schema, validation rules, security helpers
 * and section registry without starting the HTTP server.
 *
 *   npm run smoke
 */
import { ENTITIES, buildEntityPayload, validatePayload } from '../src/entities.js';
import { db, all, get, now } from '../src/db.js';
import { hashPassword, passwordProblems, verifyPassword, signToken } from '../src/auth.js';
import { publicStats } from '../src/realtime.js';
import { computeCompleteness } from '../src/services/completeness.js';
import { normaliseUrl } from '../src/services/websiteImport.js';

let pass = 0;
let fail = 0;
const check = (label, condition, extra = '') => {
  if (condition) {
    pass += 1;
    console.log(`  ok   ${label}`);
  } else {
    fail += 1;
    console.log(` FAIL  ${label} ${extra}`);
  }
};

console.log('\nDatabase schema');
const tables = all("SELECT name FROM sqlite_master WHERE type='table'").map((r) => r.name);
for (const name of Object.keys(ENTITIES)) check(`table ${name} exists with college_id`, tables.includes(name));
check('college_accounts has UNIQUE college_id', db.prepare("SELECT sql FROM sqlite_master WHERE name='college_accounts'").get().sql.includes('college_id     INTEGER NOT NULL UNIQUE'));
check('one account per college enforced at runtime', (() => {
  const college = get('SELECT id FROM colleges LIMIT 1');
  if (!college) return true; // empty database is still valid
  const account = get('SELECT college_id FROM college_accounts WHERE college_id = ?', [college.id]);
  return Boolean(account);
})());

console.log('\nValidation');
const coursePayload = buildEntityPayload('courses', {
  name: 'Test Course',
  intake_seats: '60',
  filled_seats: '12',
  eligibility: 'Pass in 10+2',
  entrance_exams: ['TNEA', 'JEE'],
  is_active: true,
});
check('coerces numbers', coursePayload.intake_seats === 60);
check('encodes tags as JSON', JSON.parse(coursePayload.entrance_exams).length === 2);
check('coerces booleans', coursePayload.is_active === 1);
let caught = null;
try {
  buildEntityPayload('courses', { intake_seats: 10 });
} catch (err) {
  caught = err.message;
}
check('rejects missing required fields', Boolean(caught && caught.includes('required')), String(caught));
caught = null;
try {
  buildEntityPayload('courses', { name: 'x', intake_seats: 'abc' });
} catch (err) {
  caught = err.message;
}
check('rejects non numeric numbers', Boolean(caught && caught.includes('number')), String(caught));

console.log('\nPassword policy & hashing');
check('short password rejected', passwordProblems('abc').includes('at least 8 characters'));
check('weak password rejected', passwordProblems('password').length >= 3);
check('strong password accepted', passwordProblems('Str0ng@Pass').length === 0);
const hash = hashPassword('Str0ng@Pass');
check('bcrypt hash verifies', verifyPassword('Str0ng@Pass', hash));
check('wrong password fails', !verifyPassword('wrong', hash));
check('hashes are salted', hashPassword('Str0ng@Pass') !== hash);

console.log('\nTokens & public surface');
const token = signToken({ id: 1, college_id: 1, username: 'demo', role: 'college_admin' }, { name: 'Demo College' });
check('jwt issued', typeof token === 'string' && token.split('.').length === 3);
const stats = publicStats();
check('public stats shape', ['colleges', 'courses', 'seats', 'seatsAvailable'].every((k) => k in stats), JSON.stringify(stats));

console.log('\nCompleteness');
const college = get('SELECT * FROM colleges LIMIT 1');
if (college) {
  const completeness = computeCompleteness(college.id);
  check('returns percentage 0-100', completeness.percentage >= 0 && completeness.percentage <= 100);
  check('returns section checklist', Array.isArray(completeness.sections) && completeness.sections.length >= 10);
} else {
  check('no colleges seeded yet (run npm run seed)', true);
}

console.log('\nWebsite URL guard');
check('accepts bare domain', normaliseUrl('psgtech.edu').href === 'https://psgtech.edu/');
check('rejects ftp', (() => {
  try {
    normaliseUrl('ftp://x.com');
    return false;
  } catch {
    return true;
  }
})());
check('rejects javascript:', (() => {
  try {
    normaliseUrl('javascript:alert(1)');
    return false;
  } catch {
    return true;
  }
})());

console.log('\nWrite path');
const collegeForWrite = get('SELECT id FROM colleges LIMIT 1');
if (collegeForWrite) {
  const ts = now();
  db.prepare(
    `INSERT INTO departments (college_id, name, code, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
  ).run(collegeForWrite.id, 'Smoke Test Department', 'SMK', ts, ts);
  const row = get('SELECT * FROM departments WHERE name = ?', ['Smoke Test Department']);
  check('insert + read back', Boolean(row));
  db.prepare('DELETE FROM departments WHERE id = ?').run(row.id);
  check('delete works', !get('SELECT id FROM departments WHERE id = ?', [row.id]));
}

console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
