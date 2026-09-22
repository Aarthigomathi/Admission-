/**
 * Database schema.
 *
 * Core tables (colleges, accounts, applications, enquiries, activity) are
 * declared explicitly; every profile section table is generated from the
 * shared entity registry so the API, the DDL and the dashboard UI can never
 * drift apart.
 */
import { ENTITIES, sqlTypeFor } from './entities.js';

export const CORE_TABLES = `
CREATE TABLE IF NOT EXISTS colleges (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  slug                  TEXT UNIQUE NOT NULL,
  college_code          TEXT UNIQUE,
  name                  TEXT NOT NULL,
  short_name            TEXT,
  type                  TEXT,
  ownership             TEXT,
  established_year      INTEGER,
  affiliation           TEXT,
  accreditation         TEXT,
  accreditation_valid_till TEXT,
  approval_body         TEXT,
  nirf_rank             TEXT,
  ranking_source        TEXT,
  motto                 TEXT,
  about                 TEXT,
  vision                TEXT,
  mission               TEXT,
  highlights            TEXT,
  address               TEXT,
  city                  TEXT,
  state                 TEXT,
  pincode               TEXT,
  country               TEXT DEFAULT 'India',
  latitude              REAL,
  longitude             REAL,
  phone                 TEXT,
  alt_phone             TEXT,
  email                 TEXT,
  admission_email       TEXT,
  website               TEXT,
  admissions_url        TEXT,
  facebook              TEXT,
  instagram             TEXT,
  linkedin              TEXT,
  youtube               TEXT,
  logo_url              TEXT,
  cover_url             TEXT,
  campus_area           TEXT,
  campus_area_acres     REAL,
  total_students        INTEGER,
  total_faculty         INTEGER,
  student_faculty_ratio TEXT,
  gender_ratio          TEXT,
  hostel_available      INTEGER DEFAULT 0,
  transport_available   INTEGER DEFAULT 0,
  source_url            TEXT,
  data_verified_at      TEXT,
  verified              INTEGER DEFAULT 0,
  featured              INTEGER DEFAULT 0,
  profile_completeness  INTEGER DEFAULT 0,
  status                TEXT DEFAULT 'published',
  published_at          TEXT,
  created_at            TEXT NOT NULL,
  updated_at            TEXT NOT NULL
);

-- ONE account per college: college_id is UNIQUE as well as username/email.
CREATE TABLE IF NOT EXISTS college_accounts (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id     INTEGER NOT NULL UNIQUE REFERENCES colleges(id) ON DELETE CASCADE,
  username       TEXT NOT NULL UNIQUE,
  email          TEXT NOT NULL UNIQUE,
  password_hash  TEXT NOT NULL,
  full_name      TEXT,
  designation    TEXT,
  phone          TEXT,
  role           TEXT NOT NULL DEFAULT 'college_admin',
  status         TEXT NOT NULL DEFAULT 'active',
  verification_method TEXT,
  failed_attempts INTEGER DEFAULT 0,
  locked_until   TEXT,
  last_login_at  TEXT,
  last_login_ip  TEXT,
  password_changed_at TEXT,
  created_at     TEXT NOT NULL,
  updated_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS auth_audit (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id  INTEGER,
  account_id  INTEGER,
  username    TEXT,
  event       TEXT NOT NULL,
  detail      TEXT,
  ip          TEXT,
  user_agent  TEXT,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS applications (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  application_no    TEXT NOT NULL UNIQUE,
  college_id        INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  course_id         INTEGER,
  course_name       TEXT,
  student_name      TEXT NOT NULL,
  email             TEXT NOT NULL,
  phone             TEXT NOT NULL,
  dob               TEXT,
  gender            TEXT,
  category          TEXT,
  board_university  TEXT,
  qualifying_exam   TEXT,
  marks_obtained    TEXT,
  percentage        REAL,
  address           TEXT,
  city              TEXT,
  state             TEXT,
  pincode           TEXT,
  documents         TEXT,
  statement         TEXT,
  status            TEXT NOT NULL DEFAULT 'Submitted',
  remarks           TEXT,
  interview_date    TEXT,
  decision_date     TEXT,
  source            TEXT,
  created_at        TEXT NOT NULL,
  updated_at        TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS enquiries (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id   INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
  course_id    INTEGER,
  course_name  TEXT,
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  city         TEXT,
  message      TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'New',
  response     TEXT,
  responded_at TEXT,
  created_at   TEXT NOT NULL,
  updated_at   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activity_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id  INTEGER,
  entity      TEXT,
  action      TEXT,
  message     TEXT NOT NULL,
  meta        TEXT,
  actor       TEXT,
  visibility  TEXT DEFAULT 'public',
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS seat_events (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id    INTEGER NOT NULL,
  course_id     INTEGER NOT NULL,
  course_name   TEXT,
  old_filled    INTEGER,
  new_filled    INTEGER,
  available     INTEGER,
  intake        INTEGER,
  action        TEXT,
  actor         TEXT,
  created_at    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_apps_college ON applications(college_id);
CREATE INDEX IF NOT EXISTS idx_apps_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_enq_college ON enquiries(college_id);
CREATE INDEX IF NOT EXISTS idx_activity_college ON activity_log(college_id);
CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);
CREATE INDEX IF NOT EXISTS idx_colleges_city ON colleges(city);
`;

/** Build CREATE TABLE for a profile section from its entity definition. */
function entityTable(name, entity) {
  // sort_order / is_published are always present on section tables
  const cols = entity.fields
    .filter((f) => !['sort_order', 'is_published', 'created_at', 'updated_at'].includes(f.name))
    .map((f) => `  ${f.name.padEnd(22)} ${sqlTypeFor(f)}`);
  return `CREATE TABLE IF NOT EXISTS ${name} (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  college_id            INTEGER NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
${cols.join(',\n')},
  sort_order            INTEGER DEFAULT 0,
  is_published          INTEGER DEFAULT 1,
  created_at            TEXT NOT NULL,
  updated_at            TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_${name}_college ON ${name}(college_id);
`;
}

export function buildSchema() {
  const entityDdl = Object.entries(ENTITIES)
    .map(([name, entity]) => entityTable(name, entity))
    .join('\n');
  return `${CORE_TABLES}\n${entityDdl}`;
}
