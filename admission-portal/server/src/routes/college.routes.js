/**
 * Authenticated college dashboard API: own profile, website import, live
 * admission operations (applications, enquiries, seats) and analytics.
 */
import express from 'express';
import { COLLEGE_PROFILE_FIELDS, ENTITIES, decodeRow, validatePayload } from '../entities.js';
import { all, get, insert, now, run, update } from '../db.js';
import { logActivity, emitToCollege, emitToApplication, emitPublic, publicStats } from '../realtime.js';
import { computeCompleteness, recomputeAndStore } from '../services/completeness.js';
import { importFromWebsite, normaliseUrl } from '../services/websiteImport.js';
import { requireCollege } from '../auth.js';

export const collegeRouter = express.Router();
collegeRouter.use(requireCollege);

const APPLICATION_STATUSES = [
  'Submitted',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Document Verification',
  'Provisionally Selected',
  'Confirmed',
  'Waitlisted',
  'Rejected',
];
const ENQUIRY_STATUSES = ['New', 'In Progress', 'Responded', 'Closed'];

function decodeCollege(college) {
  return decodeRow(college, COLLEGE_PROFILE_FIELDS);
}

function counts(collegeId) {
  const c = (sql, params = []) => get(sql, params).n;
  return {
    departments: c('SELECT COUNT(*) AS n FROM departments WHERE college_id = ?', [collegeId]),
    courses: c('SELECT COUNT(*) AS n FROM courses WHERE college_id = ?', [collegeId]),
    fees: c('SELECT COUNT(*) AS n FROM fees WHERE college_id = ?', [collegeId]),
    faculty: c('SELECT COUNT(*) AS n FROM faculty WHERE college_id = ?', [collegeId]),
    placements: c('SELECT COUNT(*) AS n FROM placements WHERE college_id = ?', [collegeId]),
    recruiters: c('SELECT COUNT(*) AS n FROM recruiters WHERE college_id = ?', [collegeId]),
    internships: c('SELECT COUNT(*) AS n FROM internships WHERE college_id = ?', [collegeId]),
    hostels: c('SELECT COUNT(*) AS n FROM hostels WHERE college_id = ?', [collegeId]),
    transport: c('SELECT COUNT(*) AS n FROM transport WHERE college_id = ?', [collegeId]),
    library: c('SELECT COUNT(*) AS n FROM library WHERE college_id = ?', [collegeId]),
    sports: c('SELECT COUNT(*) AS n FROM sports WHERE college_id = ?', [collegeId]),
    infrastructure: c('SELECT COUNT(*) AS n FROM infrastructure WHERE college_id = ?', [collegeId]),
    facilities: c('SELECT COUNT(*) AS n FROM facilities WHERE college_id = ?', [collegeId]),
    scholarships: c('SELECT COUNT(*) AS n FROM scholarships WHERE college_id = ?', [collegeId]),
    events: c('SELECT COUNT(*) AS n FROM events WHERE college_id = ?', [collegeId]),
    achievements: c('SELECT COUNT(*) AS n FROM achievements WHERE college_id = ?', [collegeId]),
    media: c('SELECT COUNT(*) AS n FROM media WHERE college_id = ?', [collegeId]),
    documents: c('SELECT COUNT(*) AS n FROM documents WHERE college_id = ?', [collegeId]),
    applications: c('SELECT COUNT(*) AS n FROM applications WHERE college_id = ?', [collegeId]),
    newApplications: c("SELECT COUNT(*) AS n FROM applications WHERE college_id = ? AND status = 'Submitted'", [collegeId]),
    enquiries: c('SELECT COUNT(*) AS n FROM enquiries WHERE college_id = ?', [collegeId]),
    newEnquiries: c("SELECT COUNT(*) AS n FROM enquiries WHERE college_id = ? AND status = 'New'", [collegeId]),
  };
}

/** Dashboard bootstrap: profile + completeness checklist + counters. */
collegeRouter.get('/me', (req, res) => {
  const college = get('SELECT * FROM colleges WHERE id = ?', [req.college.id]);
  res.json({
    college: decodeCollege(college),
    account: {
      id: req.account.id,
      username: req.account.username,
      email: req.account.email,
      full_name: req.account.full_name,
      designation: req.account.designation,
      phone: req.account.phone,
      last_login_at: req.account.last_login_at,
    },
    completeness: computeCompleteness(college.id),
    counts: counts(college.id),
  });
});

/** Update the college's own profile (partial update supported). */
collegeRouter.put('/profile', (req, res) => {
  try {
    const payload = validatePayload(COLLEGE_PROFILE_FIELDS, req.body, { partial: true });
    if (req.body?.highlights !== undefined) {
      payload.highlights = validatePayload([COLLEGE_PROFILE_FIELDS.find((f) => f.name === 'highlights')], { highlights: req.body.highlights }).highlights;
    }
    payload.updated_at = now();
    payload.data_verified_at = now();
    payload.verified = 1;
    update('colleges', req.college.id, payload);
    const completeness = recomputeAndStore(req.college.id);
    const college = get('SELECT * FROM colleges WHERE id = ?', [req.college.id]);
    const changed = Object.keys(payload).filter((k) => !['updated_at', 'data_verified_at', 'verified'].includes(k));
    logActivity({
      collegeId: req.college.id,
      entity: 'college',
      action: 'updated',
      message: `${college.name} updated ${changed.length} profile detail${changed.length === 1 ? '' : 's'}`,
      actor: 'college',
      meta: { fields: changed.slice(0, 12) },
    });
    res.json({ college: decodeCollege(college), completeness, message: 'Profile updated' });
  } catch (err) {
    res.status(err.status || 400).json({ error: err.message || 'Could not update profile' });
  }
});

/** Quick compliance helper: which sections still need attention. */
collegeRouter.get('/completeness', (req, res) => {
  res.json(computeCompleteness(req.college.id));
});

/* ------------------------------------------------------------------ *
 * Official website import
 * ------------------------------------------------------------------ */

const IMPORT_SECTIONS = [
  'profile',
  'departments',
  'courses',
  'placements',
  'recruiters',
  'hostels',
  'transport',
  'library',
  'sports',
  'facilities',
  'scholarships',
  'events',
  'achievements',
  'media',
];

/** Read the official site and return a reviewable draft (nothing saved yet). */
collegeRouter.post('/website-import', async (req, res) => {
  try {
    const url = req.body?.url || req.college.website;
    const draft = await importFromWebsite(normaliseUrl(url).toString(), { maxPages: 10 });
    res.json({ draft, sections: IMPORT_SECTIONS, message: 'Draft ready for review' });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Import failed' });
  }
});

/**
 * Apply a reviewed draft to the live profile. `overwrite: true` replaces
 * existing values, otherwise only empty fields are filled.
 */
collegeRouter.post('/website-import/apply', (req, res) => {
  const draft = req.body?.draft;
  const selected = Array.isArray(req.body?.sections) && req.body.sections.length ? req.body.sections : IMPORT_SECTIONS;
  const overwrite = req.body?.overwrite === true;
  if (!draft) return res.status(400).json({ error: 'Import draft is required' });

  const college = get('SELECT * FROM colleges WHERE id = ?', [req.college.id]);
  const applied = { profile: [], entities: {} };

  if (selected.includes('profile') && draft.profile) {
    const patch = {};
    for (const [key, value] of Object.entries(draft.profile)) {
      if (!value || typeof value === 'object') continue;
      const field = COLLEGE_PROFILE_FIELDS.find((f) => f.name === key);
      if (!field) continue;
      const current = college[key];
      const isEmpty = current === null || current === undefined || String(current).trim() === '';
      if (!overwrite && !isEmpty) continue;
      try {
        const validated = validatePayload([field], { [key]: value }, { partial: true });
        Object.assign(patch, validated);
        applied.profile.push(key);
      } catch {
        /* skip invalid */
      }
    }
    patch.updated_at = now();
    patch.data_verified_at = now();
    update('colleges', req.college.id, patch);
  }

  for (const name of selected) {
    if (name === 'profile') continue;
    const rows = Array.isArray(draft[name]) ? draft[name] : null;
    if (!rows?.length || !ENTITIES[name]) continue;
    const ts = now();
    let inserted = 0;
    for (const raw of rows) {
      try {
        const payload = validatePayload(ENTITIES[name].fields, raw, { partial: true });
        if (!Object.keys(payload).length) continue;
        if (!overwrite) {
          // skip obvious duplicates by name-ish key
          const keyField = ENTITIES[name].fields.find((f) => f.required);
          if (keyField && payload[keyField.name]) {
            const dupe = get(`SELECT id FROM ${name} WHERE college_id = ? AND lower(COALESCE(${keyField.name}, '')) = lower(?)`, [
              req.college.id,
              String(payload[keyField.name]),
            ]);
            if (dupe) continue;
          }
        }
        insert(name, { ...payload, college_id: req.college.id, sort_order: inserted, is_published: 1, created_at: ts, updated_at: ts });
        inserted += 1;
      } catch {
        /* skip invalid row */
      }
    }
    applied.entities[name] = inserted;
  }

  const completeness = recomputeAndStore(req.college.id);
  logActivity({
    collegeId: req.college.id,
    entity: 'college',
    action: 'imported',
    message: `${college.name} synced details from its official website`,
    actor: 'college',
    meta: applied,
  });
  res.json({ applied, completeness, message: 'Draft applied to your live profile' });
});

/* ------------------------------------------------------------------ *
 * Admissions operations
 * ------------------------------------------------------------------ */

collegeRouter.get('/applications', (req, res) => {
  const { status, q, course } = req.query;
  const params = [req.college.id];
  let sql = 'SELECT * FROM applications WHERE college_id = ?';
  if (status && status !== 'All') {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (course) {
    sql += ' AND course_name = ?';
    params.push(course);
  }
  if (q) {
    sql += ' AND (lower(student_name) LIKE ? OR lower(email) LIKE ? OR lower(application_no) LIKE ? OR phone LIKE ?)';
    const like = `%${String(q).toLowerCase()}%`;
    params.push(like, like, like, `%${q}%`);
  }
  sql += ' ORDER BY datetime(created_at) DESC LIMIT 500';
  const rows = all(sql, params);
  const summary = all('SELECT status, COUNT(*) AS n FROM applications WHERE college_id = ? GROUP BY status', [req.college.id]);
  res.json({ rows, summary, statuses: APPLICATION_STATUSES, total: rows.length });
});

collegeRouter.put('/applications/:id', (req, res) => {
  const application = get('SELECT * FROM applications WHERE id = ? AND college_id = ?', [req.params.id, req.college.id]);
  if (!application) return res.status(404).json({ error: 'Application not found' });
  const { status, remarks, interview_date: interviewDate } = req.body || {};
  if (status && !APPLICATION_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${APPLICATION_STATUSES.join(', ')}` });
  }
  const patch = { updated_at: now() };
  if (status) patch.status = status;
  if (remarks !== undefined) patch.remarks = String(remarks).slice(0, 2000);
  if (interviewDate !== undefined) patch.interview_date = interviewDate || null;
  if (status && ['Provisionally Selected', 'Confirmed', 'Waitlisted', 'Rejected'].includes(status)) patch.decision_date = now();

  update('applications', application.id, patch, req.college.id);
  const row = get('SELECT * FROM applications WHERE id = ?', [application.id]);

  emitToApplication(row.application_no, 'application:status', {
    applicationNo: row.application_no,
    status: row.status,
    remarks: row.remarks,
    interviewDate: row.interview_date,
    collegeName: req.college.name,
    at: now(),
  });
  emitToCollege(req.college.id, 'application:updated', row);
  logActivity({
    collegeId: req.college.id,
    entity: 'applications',
    action: 'status',
    message: `${row.application_no} moved to "${row.status}"`,
    actor: 'college',
    visibility: 'private',
    meta: { applicationNo: row.application_no, status: row.status },
  });
  res.json({ row, message: `Application updated to ${row.status}` });
});

collegeRouter.get('/applications.csv', (req, res) => {
  const rows = all('SELECT * FROM applications WHERE college_id = ? ORDER BY datetime(created_at) DESC', [req.college.id]);
  const cols = [
    'application_no', 'student_name', 'email', 'phone', 'course_name', 'gender', 'category',
    'board_university', 'qualifying_exam', 'marks_obtained', 'percentage', 'city', 'state', 'status', 'created_at',
  ];
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => escape(r[c])).join(','))].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${req.college.slug}-applications.csv"`);
  res.send(csv);
});

collegeRouter.get('/enquiries', (req, res) => {
  const { status } = req.query;
  const params = [req.college.id];
  let sql = 'SELECT * FROM enquiries WHERE college_id = ?';
  if (status && status !== 'All') {
    sql += ' AND status = ?';
    params.push(status);
  }
  sql += ' ORDER BY datetime(created_at) DESC LIMIT 500';
  res.json({
    rows: all(sql, params),
    summary: all('SELECT status, COUNT(*) AS n FROM enquiries WHERE college_id = ? GROUP BY status', [req.college.id]),
    statuses: ENQUIRY_STATUSES,
  });
});

collegeRouter.put('/enquiries/:id', (req, res) => {
  const enquiry = get('SELECT * FROM enquiries WHERE id = ? AND college_id = ?', [req.params.id, req.college.id]);
  if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
  const { status, response } = req.body || {};
  if (status && !ENQUIRY_STATUSES.includes(status)) return res.status(400).json({ error: `Status must be one of: ${ENQUIRY_STATUSES.join(', ')}` });
  const patch = { updated_at: now() };
  if (status) patch.status = status;
  if (response !== undefined) {
    patch.response = String(response).slice(0, 4000);
    patch.responded_at = now();
  }
  update('enquiries', enquiry.id, patch, req.college.id);
  const row = get('SELECT * FROM enquiries WHERE id = ?', [enquiry.id]);
  emitToCollege(req.college.id, 'enquiry:updated', row);
  logActivity({
    collegeId: req.college.id,
    entity: 'enquiries',
    action: 'status',
    message: `Enquiry from ${row.name} set to "${row.status}"`,
    actor: 'college',
    visibility: 'private',
  });
  res.json({ row, message: 'Enquiry updated' });
});

/** One-tap seat update — instantly reflected on the student side. */
collegeRouter.post('/seats', (req, res) => {
  const { course_id: courseId, filled_seats: filled, intake_seats: intake, admission_status: admissionStatus } = req.body || {};
  const course = get('SELECT * FROM courses WHERE id = ? AND college_id = ?', [courseId, req.college.id]);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const patch = { updated_at: now() };
  if (filled !== undefined) patch.filled_seats = Math.max(0, Math.min(Number(filled) || 0, Number(intake ?? course.intake_seats) || 0));
  if (intake !== undefined) patch.intake_seats = Math.max(0, Number(intake) || 0);
  if (admissionStatus) patch.admission_status = admissionStatus;
  update('courses', course.id, patch, req.college.id);
  const row = get('SELECT * FROM courses WHERE id = ?', [course.id]);
  const available = Math.max(0, (row.intake_seats || 0) - (row.filled_seats || 0));

  insert('seat_events', {
    college_id: req.college.id,
    course_id: row.id,
    course_name: row.name,
    old_filled: course.filled_seats,
    new_filled: row.filled_seats,
    available,
    intake: row.intake_seats,
    action: 'update',
    actor: req.account.username,
    created_at: now(),
  });

  emitPublic('seats:changed', {
    collegeId: req.college.id,
    collegeName: req.college.name,
    courseId: row.id,
    courseName: row.name,
    intake: row.intake_seats,
    filled: row.filled_seats,
    available,
    admissionStatus: row.admission_status,
    at: now(),
  });
  // keep the portal-wide counters (home page, explore filters) in step
  emitPublic('stats:updated', publicStats());
  logActivity({
    collegeId: req.college.id,
    entity: 'courses',
    action: 'seats',
    message: `${row.name}: ${available} of ${row.intake_seats} seats available`,
    actor: 'college',
    meta: { courseId: row.id, available },
  });
  recomputeAndStore(req.college.id);
  res.json({ course: decodeRow(row, ENTITIES.courses.fields), available, message: `Seats updated — ${available} of ${row.intake_seats} available` });
});

/** Dashboard analytics. */
collegeRouter.get('/stats', (req, res) => {
  const collegeId = req.college.id;
  const byStatus = all('SELECT status, COUNT(*) AS n FROM applications WHERE college_id = ? GROUP BY status ORDER BY n DESC', [collegeId]);
  const byCourse = all(
    `SELECT COALESCE(course_name, 'Unspecified') AS course_name, COUNT(*) AS n
       FROM applications WHERE college_id = ? GROUP BY course_name ORDER BY n DESC LIMIT 8`,
    [collegeId],
  );
  const applicationsTrend = all(
    `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS n FROM applications
      WHERE college_id = ? AND datetime(created_at) >= datetime('now', '-13 days')
      GROUP BY day ORDER BY day ASC`,
    [collegeId],
  );
  const enquiriesTrend = all(
    `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS n FROM enquiries
      WHERE college_id = ? AND datetime(created_at) >= datetime('now', '-13 days')
      GROUP BY day ORDER BY day ASC`,
    [collegeId],
  );
  const seatBoard = all(
    `SELECT id, name, level, intake_seats, filled_seats,
            MAX(0, COALESCE(intake_seats,0) - COALESCE(filled_seats,0)) AS available,
            admission_status
       FROM courses WHERE college_id = ? AND is_published = 1 ORDER BY available ASC, name ASC`,
    [collegeId],
  );
  const placementByYear = all(
    'SELECT academic_year, highest_package, average_package, students_placed, placement_percentage FROM placements WHERE college_id = ? ORDER BY academic_year DESC LIMIT 6',
    [collegeId],
  );
  const recentActivity = all(
    'SELECT * FROM activity_log WHERE college_id = ? ORDER BY id DESC LIMIT 12',
    [collegeId],
  );
  const recruiterStats = all(
    'SELECT sector, COUNT(*) AS n FROM recruiters WHERE college_id = ? GROUP BY sector ORDER BY n DESC',
    [collegeId],
  );

  const latestApplications = all(
    'SELECT * FROM applications WHERE college_id = ? ORDER BY datetime(created_at) DESC LIMIT 6',
    [collegeId],
  );

  res.json({
    counts: counts(collegeId),
    completeness: computeCompleteness(collegeId),
    latestApplications,
    byStatus,
    byCourse,
    applicationsTrend,
    enquiriesTrend,
    seatBoard,
    placementByYear,
    recruiterStats,
    recentActivity,
    seats: {
      intake: seatBoard.reduce((s, r) => s + (r.intake_seats || 0), 0),
      filled: seatBoard.reduce((s, r) => s + (r.filled_seats || 0), 0),
      available: seatBoard.reduce((s, r) => s + (r.available || 0), 0),
    },
    portal: publicStats(),
  });
});

collegeRouter.get('/activity', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 200);
  res.json({ rows: all('SELECT * FROM activity_log WHERE college_id = ? ORDER BY id DESC LIMIT ?', [req.college.id, limit]) });
});

/** Publish / unpublish the college listing for students. */
collegeRouter.post('/publish', (req, res) => {
  const status = req.body?.status === 'draft' ? 'draft' : 'published';
  update('colleges', req.college.id, { status, published_at: status === 'published' ? now() : null, updated_at: now() });
  logActivity({
    collegeId: req.college.id,
    entity: 'college',
    action: status,
    message: status === 'published' ? `${req.college.name} is now visible to students` : `${req.college.name} hidden from students`,
    actor: 'college',
    visibility: 'public',
  });
  emitPublic('stats:updated', publicStats());
  res.json({ status, message: status === 'published' ? 'Your college is live for students' : 'Your listing is now hidden' });
});
