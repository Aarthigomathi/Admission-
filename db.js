/**
 * db.js - SQLite setup using Node's built-in `node:sqlite` module (Node 22+).
 *
 * The database file is created automatically inside /data (git-ignored),
 * so no extra setup is needed - just run the server.
 *
 * Tables:
 *   users        - accounts created via sign up (scrypt password hashes)
 *   sessions     - login sessions (token cookie -> user)
 *   applications - student registration data (personal, academic,
 *                  certificates, registration number & status)
 */
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DATA_DIR = path.join(__dirname, 'data');
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, 'student-portal.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT NOT NULL,
    email         TEXT NOT NULL UNIQUE,
    phone         TEXT NOT NULL DEFAULT '',
    password_hash TEXT NOT NULL,
    created_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token      TEXT PRIMARY KEY,
    user_id    INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS applications (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id       INTEGER NOT NULL UNIQUE,

    -- personal details
    full_name        TEXT NOT NULL DEFAULT '',
    dob              TEXT NOT NULL DEFAULT '',
    gender           TEXT NOT NULL DEFAULT '',
    blood_group      TEXT NOT NULL DEFAULT '',
    community        TEXT NOT NULL DEFAULT '',
    religion         TEXT NOT NULL DEFAULT '',
    nationality      TEXT NOT NULL DEFAULT 'Indian',
    address          TEXT NOT NULL DEFAULT '',
    city             TEXT NOT NULL DEFAULT '',
    district         TEXT NOT NULL DEFAULT '',
    state            TEXT NOT NULL DEFAULT '',
    pincode          TEXT NOT NULL DEFAULT '',
    parent_name      TEXT NOT NULL DEFAULT '',
    parent_phone     TEXT NOT NULL DEFAULT '',
    parent_occupation TEXT NOT NULL DEFAULT '',

    -- academic details
    qualifying_exam    TEXT NOT NULL DEFAULT '',
    board              TEXT NOT NULL DEFAULT '',
    school_name        TEXT NOT NULL DEFAULT '',
    year_of_passing    TEXT NOT NULL DEFAULT '',
    exam_register_no   TEXT NOT NULL DEFAULT '',
    overall_percentage TEXT NOT NULL DEFAULT '',
    maths_mark         TEXT NOT NULL DEFAULT '',
    physics_mark       TEXT NOT NULL DEFAULT '',
    chemistry_mark     TEXT NOT NULL DEFAULT '',

    -- certificates (JSON: { photo: {...}, tc: {...}, marksheet: {...}, community: {...} })
    certificates TEXT NOT NULL DEFAULT '',

    -- registration
    registration_no TEXT,
    status          TEXT NOT NULL DEFAULT 'draft',   -- draft | registered
    submitted_at    TEXT,
    updated_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = { db, DATA_DIR };
