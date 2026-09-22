/**
 * Public / student API — search colleges, read full profiles, watch live seat
 * availability, submit enquiries and applications, track application status.
 */
import express from 'express';
import rateLimit from 'express-rate-limit';
import { ENTITIES, COLLEGE_PROFILE_FIELDS, decodeRow } from '../entities.js';
import { all, get, insert, now, run } from '../db.js';
import { logActivity, emitToCollege, emitToApplication, emitPublic, publicStats } from '../realtime.js';
import { getCollegeBundle } from '../services/completeness.js';

export const publicRouter = express.Router();

const submitLimiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many submissions from this device. Please try again shortly.' },
});

const PUBLIC_SECTIONS = {
  departments: 'Departments',
  courses: 'Courses',
  fees: 'Fee Structure',
  faculty: 'Faculty',
  placements: 'Placements',
  recruiters: 'Recruiters',
  internships: 'Internships',
  hostels: 'Hostels',
  transport: 'Transport',
  library: 'Library',
  sports: 'Sports',
  infrastructure: 'Infrastructure',
  facilities: 'Campus Facilities',
  scholarships: 'Scholarships',
  events: 'Events',
  achievements: 'Achievements',
  media: 'Photos & Videos',
  documents: 'Documents',
};

publicRouter.get('/stats', (_req, res) => res.json(publicStats()));

publicRouter.get('/meta', (_req, res) => {
  const uniq = (sql, params = []) => all(sql, params).map((r) => r.v).filter(Boolean);
  res.json({
    states: uniq('SELECT DISTINCT state AS v FROM colleges WHERE status = ? ORDER BY state', ['published']),
    cities: uniq('SELECT DISTINCT city AS v FROM colleges WHERE status = ? ORDER BY city', ['published']),
    types: uniq('SELECT DISTINCT type AS v FROM colleges WHERE type IS NOT NULL ORDER BY type'),
    levels: uniq('SELECT DISTINCT level AS v FROM courses WHERE level IS NOT NULL ORDER BY level'),
    streams: uniq('SELECT DISTINCT stream AS v FROM courses WHERE stream IS NOT NULL ORDER BY stream'),
    sectors: uniq('SELECT DISTINCT sector AS v FROM recruiters WHERE sector IS NOT NULL ORDER BY sector'),
    degrees: uniq('SELECT DISTINCT degree_type AS v FROM courses WHERE degree_type IS NOT NULL ORDER BY degree_type'),
    statuses: ['Open', 'Closing Soon', 'Few Seats Left', 'Closed', 'Coming Soon'],
    sections: PUBLIC_SECTIONS,
    stats: publicStats(),
  });
});

/** College search with filters used by the student explore page. */
publicRouter.get('/colleges', (req, res) => {
  const { q, state, city, type, level, stream, admission_status: admissionStatus, hostel, sort = 'featured', page = 1, limit = 12 } = req.query;
  const where = ["c.status = 'published'"];
  const params = [];

  if (q) {
    where.push(`(lower(c.name) LIKE ? OR lower(COALESCE(c.short_name,'')) LIKE ? OR lower(COALESCE(c.city,'')) LIKE ?
      OR lower(COALESCE(c.state,'')) LIKE ? OR lower(COALESCE(c.about,'')) LIKE ?
      OR EXISTS (SELECT 1 FROM courses co WHERE co.college_id = c.id AND co.is_published = 1 AND lower(co.name) LIKE ?)
      OR EXISTS (SELECT 1 FROM departments d WHERE d.college_id = c.id AND lower(d.name) LIKE ?))`);
    const like = `%${String(q).toLowerCase()}%`;
    params.push(like, like, like, like, like, like, like);
  }
  if (state) {
    where.push('lower(c.state) = lower(?)');
    params.push(state);
  }
  if (city) {
    where.push('lower(c.city) = lower(?)');
    params.push(city);
  }
  if (type) {
    where.push('lower(c.type) = lower(?)');
    params.push(type);
  }
  if (hostel === 'true') where.push('c.hostel_available = 1');
  if (level || stream || admissionStatus) {
    const sub = ['co.college_id = c.id', 'co.is_published = 1'];
    if (level) {
      sub.push('lower(co.level) = lower(?)');
      params.push(level);
    }
    if (stream) {
      sub.push('lower(co.stream) LIKE lower(?)');
      params.push(`%${stream}%`);
    }
    if (admissionStatus) {
      sub.push('co.admission_status = ?');
      params.push(admissionStatus);
    }
    where.push(`EXISTS (SELECT 1 FROM courses co WHERE ${sub.join(' AND ')})`);
  }

  const orderBy = {
    featured: 'c.featured DESC, c.profile_completeness DESC, c.name ASC',
    name: 'c.name ASC',
    newest: 'datetime(c.published_at) DESC, c.id DESC',
    seats: 'seats_available DESC',
    package: 'highest_package DESC NULLS LAST',
  }[sort] || 'c.featured DESC, c.name ASC';

  const perPage = Math.min(Number(limit) || 12, 48);
  const offset = (Math.max(Number(page) || 1, 1) - 1) * perPage;

  const base = `
    FROM colleges c WHERE ${where.join(' AND ')}`;
  const columns = `
    SELECT c.id, c.slug, c.name, c.short_name, c.type, c.city, c.state, c.logo_url, c.cover_url,
           c.established_year, c.accreditation, c.nirf_rank, c.campus_area, c.hostel_available, c.transport_available,
           c.profile_completeness, c.featured, c.updated_at,
           (SELECT COUNT(*) FROM courses co WHERE co.college_id = c.id AND co.is_published = 1) AS course_count,
           (SELECT COUNT(*) FROM departments d WHERE d.college_id = c.id) AS department_count,
           (SELECT COUNT(*) FROM faculty f WHERE f.college_id = c.id) AS faculty_count,
           (SELECT COUNT(*) FROM media m WHERE m.college_id = c.id) AS media_count,
           (SELECT COALESCE(SUM(co.intake_seats),0) FROM courses co WHERE co.college_id = c.id AND co.is_published = 1) AS seats_total,
           (SELECT COALESCE(SUM(co.filled_seats),0) FROM courses co WHERE co.college_id = c.id AND co.is_published = 1) AS seats_filled,
           (SELECT MAX(0, COALESCE(SUM(co.intake_seats),0) - COALESCE(SUM(co.filled_seats),0)) FROM courses co WHERE co.college_id = c.id AND co.is_published = 1) AS seats_available,
           (SELECT MAX(p.highest_package) FROM placements p WHERE p.college_id = c.id) AS highest_package,
           (SELECT MAX(p.average_package) FROM placements p WHERE p.college_id = c.id) AS average_package,
           (SELECT MAX(p.placement_percentage) FROM placements p WHERE p.college_id = c.id) AS placement_percentage,
           (SELECT MIN(co.application_deadline) FROM courses co WHERE co.college_id = c.id AND co.is_published = 1 AND co.application_deadline IS NOT NULL) AS next_deadline`;

  const total = get(`SELECT COUNT(*) AS n ${base}`, params).n;
  const rows = all(
    `${columns} ${base} ORDER BY ${orderBy} LIMIT ${perPage} OFFSET ${offset}`,
    params,
  );

  const data = rows.map((row) => ({
    ...row,
    seats_available: Math.max(0, (row.seats_total || 0) - (row.seats_filled || 0)),
    admission_open: Boolean(get('SELECT COUNT(*) AS n FROM courses co WHERE co.college_id = ? AND co.is_published = 1 AND co.admission_status IN (\'Open\',\'Closing Soon\',\'Few Seats Left\')', [row.id]).n),
  }));

  res.json({ rows: data, total, page: Number(page) || 1, pages: Math.max(1, Math.ceil(total / perPage)), stats: publicStats() });
});

/** Full public profile of one college (every section, published rows only). */
publicRouter.get('/colleges/:slug', (req, res) => {
  const college = get("SELECT * FROM colleges WHERE slug = ? AND status = 'published'", [req.params.slug]);
  if (!college) return res.status(404).json({ error: 'College not found' });

  const bundle = getCollegeBundle(college.id, { publicOnly: true });
  const out = { college: decodeRow(bundle.college, COLLEGE_PROFILE_FIELDS) };
  for (const [name, entity] of Object.entries(ENTITIES)) {
    if (!PUBLIC_SECTIONS[name]) continue;
    out[name] = (bundle[name] || []).map((row) => decodeRow(row, entity.fields));
  }

  const seats = all(
    `SELECT id, name, level, stream, duration, intake_seats, filled_seats,
            MAX(0, COALESCE(intake_seats,0) - COALESCE(filled_seats,0)) AS available,
            admission_status, application_deadline, tuition_fee, eligibility
       FROM courses WHERE college_id = ? AND is_published = 1 ORDER BY available ASC, name ASC`,
    [college.id],
  );
  const departments = all(
    `SELECT d.*, (SELECT COUNT(*) FROM courses co WHERE co.college_id = d.college_id AND co.department_name = d.name AND co.is_published = 1) AS course_count
       FROM departments d WHERE d.college_id = ? ORDER BY d.sort_order, d.name`,
    [college.id],
  );

  out.seatBoard = seats;
  out.departmentStats = departments.map((d) => decodeRow(d, [...ENTITIES.departments.fields, { name: 'course_count', type: 'number' }]));
  out.summary = {
    totalSeats: seats.reduce((s, r) => s + (r.intake_seats || 0), 0),
    filledSeats: seats.reduce((s, r) => s + (r.filled_seats || 0), 0),
    availableSeats: seats.reduce((s, r) => s + (r.available || 0), 0),
    courses: seats.length,
    departments: departments.length,
    highestPackage: Math.max(0, ...(out.placements || []).map((p) => Number(p.highest_package) || 0)),
    averagePackage: Math.max(0, ...(out.placements || []).map((p) => Number(p.average_package) || 0)),
    media: (out.media || []).length,
    lastUpdated: college.updated_at,
  };
  out.updates = all(
    `SELECT entity, action, message, created_at FROM activity_log
      WHERE college_id = ? AND visibility = 'public' ORDER BY id DESC LIMIT 12`,
    [college.id],
  );
  res.json(out);
});

/** Live seat board across every college — powers the real-time availability page. */
publicRouter.get('/seats/live', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 60, 200);
  const rows = all(
    `SELECT co.id AS course_id, co.name AS course_name, co.level, co.intake_seats, co.filled_seats,
            MAX(0, COALESCE(co.intake_seats,0) - COALESCE(co.filled_seats,0)) AS available,
            co.admission_status, co.application_deadline, co.tuition_fee,
            c.id AS college_id, c.name AS college_name, c.slug AS college_slug, c.city, c.state, c.logo_url
       FROM courses co JOIN colleges c ON c.id = co.college_id
      WHERE co.is_published = 1 AND c.status = 'published'
      ORDER BY available ASC, co.name ASC LIMIT ?`,
    [limit],
  );
  res.json({ rows, stats: publicStats() });
});

/** Public activities feed (live updates ticker). */
publicRouter.get('/updates', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 25, 100);
  res.json({
    rows: all(
      `SELECT a.id, a.entity, a.action, a.message, a.created_at, a.college_id,
              c.name AS college_name, c.slug AS college_slug, c.city, c.state
         FROM activity_log a LEFT JOIN colleges c ON c.id = a.college_id
        WHERE a.visibility = 'public' ORDER BY a.id DESC LIMIT ?`,
      [limit],
    ),
  });
});

/** Student enquiry. */
publicRouter.post('/enquiries', submitLimiter, (req, res) => {
  const body = req.body || {};
  const errors = [];
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const phone = String(body.phone || '').trim();
  const message = String(body.message || '').trim();
  if (name.length < 2) errors.push('Your name is required');
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) errors.push('A valid email is required');
  if (phone && !/^[\d+\-\s()]{8,18}$/.test(phone)) errors.push('Phone number looks invalid');
  if (message.length < 10) errors.push('Please write at least 10 characters in your enquiry');

  const college = get("SELECT * FROM colleges WHERE id = ? AND status = 'published'", [body.college_id]);
  if (!college) errors.push('Select a valid college');
  if (errors.length) return res.status(400).json({ error: errors.join('. ') });

  const course = body.course_id ? get('SELECT * FROM courses WHERE id = ? AND college_id = ?', [body.course_id, college.id]) : null;
  const ts = now();
  const id = insert('enquiries', {
    college_id: college.id,
    course_id: course?.id || null,
    course_name: course?.name || body.course_name || null,
    name,
    email,
    phone: phone || null,
    city: String(body.city || '').trim() || null,
    message,
    status: 'New',
    created_at: ts,
    updated_at: ts,
  });
  const row = get('SELECT * FROM enquiries WHERE id = ?', [id]);
  emitToCollege(college.id, 'enquiry:created', { ...row, college_name: college.name });
  logActivity({
    collegeId: college.id,
    entity: 'enquiries',
    action: 'created',
    message: `New enquiry from ${name}${course ? ` about ${course.name}` : ''}`,
    actor: 'student',
    visibility: 'private',
    meta: { enquiryId: id },
  });
  emitPublic('stats:updated', publicStats());
  res.status(201).json({ row, message: `Your enquiry has been sent to ${college.name}. They will contact you at ${email}.` });
});

/** Admission application. */
publicRouter.post('/applications', submitLimiter, (req, res) => {
  const body = req.body || {};
  const errors = [];
  const college = get("SELECT * FROM colleges WHERE id = ? AND status = 'published'", [body.college_id]);
  if (!college) errors.push('Select a valid college');
  const course = body.course_id && college ? get('SELECT * FROM courses WHERE id = ? AND college_id = ?', [body.course_id, college.id]) : null;
  if (!course) errors.push('Select the course you are applying for');

  const studentName = String(body.student_name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const phone = String(body.phone || '').trim();
  if (studentName.length < 2) errors.push('Applicant name is required');
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(email)) errors.push('A valid email is required');
  if (!/^[\d+\-\s()]{10,18}$/.test(phone)) errors.push('A valid phone number is required');
  const percentage = body.percentage === undefined || body.percentage === '' ? null : Number(body.percentage);
  if (percentage !== null && (!Number.isFinite(percentage) || percentage < 0 || percentage > 100)) errors.push('Percentage must be between 0 and 100');

  if (!errors.length) {
    if (course.admission_status === 'Closed') errors.push(`Admissions for ${course.name} are closed`);
    const available = Math.max(0, (course.intake_seats || 0) - (course.filled_seats || 0));
    const duplicate = get(
      `SELECT application_no FROM applications WHERE college_id = ? AND course_id = ? AND lower(email) = ?
        AND datetime(created_at) >= datetime('now', '-60 days')`,
      [college.id, course.id, email],
    );
    if (duplicate) {
      return res.status(409).json({
        error: `An application for ${course.name} already exists for ${email} (${duplicate.application_no}). Track it on the status page.`,
      });
    }
    const ts = now();
    const applicationNo = `APL-${new Date().getFullYear()}-${String(Math.floor(10000 + Math.random() * 89999))}`;
    const status = available > 0 ? 'Submitted' : 'Waitlisted';
    const id = insert('applications', {
      application_no: applicationNo,
      college_id: college.id,
      course_id: course.id,
      course_name: course.name,
      student_name: studentName,
      email,
      phone,
      dob: body.dob || null,
      gender: body.gender || null,
      category: body.category || null,
      board_university: body.board_university || null,
      qualifying_exam: body.qualifying_exam || null,
      marks_obtained: body.marks_obtained || null,
      percentage,
      address: body.address || null,
      city: body.city || null,
      state: body.state || null,
      pincode: body.pincode || null,
      documents: Array.isArray(body.documents) ? JSON.stringify(body.documents) : body.documents || null,
      statement: body.statement || null,
      status,
      source: 'portal',
      created_at: ts,
      updated_at: ts,
    });

    const row = get('SELECT * FROM applications WHERE id = ?', [id]);
    emitToCollege(college.id, 'application:created', { ...row, college_name: college.name });
    logActivity({
      collegeId: college.id,
      entity: 'applications',
      action: 'created',
      message: `New application ${applicationNo} received for ${course.name}`,
      actor: 'student',
      visibility: 'private',
      meta: { applicationNo, courseId: course.id },
    });
    emitPublic('stats:updated', publicStats());
    return res.status(201).json({
      application: { application_no: row.application_no, status: row.status, course_name: row.course_name, created_at: row.created_at },
      college: { name: college.name, slug: college.slug, email: college.admission_email || college.email, phone: college.phone },
      availableSeats: available,
      message:
        available > 0
          ? `Application ${applicationNo} submitted to ${college.name}.`
          : `Seats for ${course.name} are currently full — your application is on the waitlist.`,
    });
  }
  return res.status(400).json({ error: errors.join('. ') });
});

/** Application status tracking (used by the student status page). */
publicRouter.get('/applications/track', (req, res) => {
  const applicationNo = String(req.query.application_no || '').trim().toUpperCase();
  const email = String(req.query.email || '').trim().toLowerCase();
  if (!applicationNo && !email) return res.status(400).json({ error: 'Enter your application number or registered email' });
  const where = [];
  const params = [];
  if (applicationNo) {
    where.push('lower(a.application_no) = ?');
    params.push(applicationNo.toLowerCase());
  }
  if (email) {
    where.push('lower(a.email) = ?');
    params.push(email);
  }
  const rows = all(
    `SELECT a.*, c.name AS college_name, c.slug AS college_slug, c.email AS college_email,
            c.admission_email, c.phone AS college_phone, c.city, c.state, c.logo_url
       FROM applications a JOIN colleges c ON c.id = a.college_id
      WHERE ${where.join(applicationNo && email ? ' AND ' : ' OR ')}
      ORDER BY a.id DESC LIMIT 20`,
    params,
  );
  if (!rows.length) return res.status(404).json({ error: 'No application found for those details' });
  const timeline = (applicationId) =>
    all(
      `SELECT action, message, created_at FROM activity_log
        WHERE entity = 'applications' AND visibility = 'private' AND college_id = ?
          AND message LIKE ? ORDER BY id ASC`,
      [rows[0].college_id, `%${rows.find((r) => r.id === applicationId)?.application_no}%`],
    );
  res.json({
    rows: rows.map((row) => ({ ...row, timeline: timeline(row.id), availableSeats: null })),
  });
});

/** Course-level detail (deep link from search results). */
publicRouter.get('/colleges/:slug/courses/:courseId', (req, res) => {
  const college = get("SELECT * FROM colleges WHERE slug = ? AND status = 'published'", [req.params.slug]);
  if (!college) return res.status(404).json({ error: 'College not found' });
  const course = get('SELECT * FROM courses WHERE id = ? AND college_id = ? AND is_published = 1', [req.params.courseId, college.id]);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  const fees = all('SELECT * FROM fees WHERE college_id = ? AND course_name = ? ORDER BY academic_year DESC', [college.id, course.name]);
  const recruiters = all('SELECT name, sector, offers_made, avg_package FROM recruiters WHERE college_id = ? ORDER BY offers_made DESC LIMIT 10', [
    college.id,
  ]);
  res.json({
    course: decodeRow(course, ENTITIES.courses.fields),
    college: { id: college.id, name: college.name, slug: college.slug, city: college.city, state: college.state, logo_url: college.logo_url },
    fees,
    recruiters,
    available: Math.max(0, (course.intake_seats || 0) - (course.filled_seats || 0)),
  });
});

/** Top recruiters across the portal (marketing / comparison widget). */
publicRouter.get('/recruiters/top', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 24, 100);
  res.json({
    rows: all(
      `SELECT r.name, r.sector, r.logo_url, COUNT(DISTINCT r.college_id) AS colleges,
              SUM(COALESCE(r.offers_made,0)) AS offers, MAX(r.avg_package) AS best_avg_package
         FROM recruiters r JOIN colleges c ON c.id = r.college_id
        WHERE c.status = 'published' GROUP BY lower(r.name) ORDER BY offers DESC, colleges DESC LIMIT ?`,
      [limit],
    ),
  });
});
