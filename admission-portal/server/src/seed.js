/**
 * Seed script — creates the demo colleges (with the single login account each),
 * their full profiles, and realistic applications / enquiries / activity so the
 * real-time dashboard and search have live data on first run.
 *
 *   npm run seed            # adds any missing demo colleges
 *   npm run seed -- --fresh # wipes all data and re-seeds
 */
import { db, get, insert, now, slugify } from './db.js';
import { hashPassword } from './auth.js';
import { ENTITIES } from './entities.js';
import { recomputeAndStore } from './services/completeness.js';
import { COLLEGE_SEEDS, STUDENT_NAMES, CITIES, BOARDS, CATEGORIES } from './seed/colleges.js';

const fresh = process.argv.includes('--fresh');
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (n) => new Date(Date.now() - n * 86_400_000 - randInt(0, 20) * 3_600_000).toISOString();

const SECTION_ORDER = Object.keys(ENTITIES);

if (fresh) {
  const tables = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
    .all()
    .map((r) => r.name);
  db.pragma('foreign_keys = OFF');
  for (const table of tables) db.prepare(`DELETE FROM ${table}`).run();
  db.pragma('foreign_keys = ON');
  console.log('  cleared existing data');
}

let created = 0;
let skipped = 0;

for (const seed of COLLEGE_SEEDS) {
  const slug = slugify(seed.college.name);
  const existing = get('SELECT * FROM colleges WHERE slug = ?', [slug]);
  if (existing) {
    skipped += 1;
    console.log(`  ↷ ${seed.college.name} already present (slug: ${slug})`);
    continue;
  }

  const ts = now();
  const collegeId = insert('colleges', {
    ...seed.college,
    slug,
    college_code: `COL-${randInt(10000, 99999)}`,
    highlights: JSON.stringify(seed.college.highlights || []),
    data_verified_at: null,
    verified: 0,
    featured: 0,
    status: 'published',
    published_at: ts,
    created_at: ts,
    updated_at: ts,
  });

  insert('college_accounts', {
    college_id: collegeId,
    username: seed.account.username,
    email: seed.account.email,
    password_hash: hashPassword(seed.account.password),
    full_name: seed.account.full_name,
    designation: seed.account.designation,
    role: 'college_admin',
    status: 'active',
    verification_method: 'official-website-email',
    password_changed_at: ts,
    created_at: ts,
    updated_at: ts,
  });

  const counts = {};
  for (const section of SECTION_ORDER) {
    const rows = seed[section];
    if (!Array.isArray(rows) || !rows.length) continue;
    rows.forEach((row, index) => {
      const payload = {};
      for (const field of ENTITIES[section].fields) {
        const value = row[field.name];
        if (value === undefined || value === null) continue;
        payload[field.name] =
          field.type === 'tags'
            ? JSON.stringify(Array.isArray(value) ? value : String(value).split(',').map((s) => s.trim()))
            : ['number', 'currency', 'percent'].includes(field.type)
              ? Number(value) || 0
              : field.type === 'boolean'
                ? value
                  ? 1
                  : 0
                : String(value);
      }
      insert(section, { ...payload, college_id: collegeId, sort_order: index, is_published: 1, created_at: ts, updated_at: ts });
    });
    counts[section] = rows.length;
  }

  // ---- applications ------------------------------------------------------
  const courses = db.prepare('SELECT * FROM courses WHERE college_id = ?').all(collegeId);
  const statuses = ['Submitted', 'Submitted', 'Submitted', 'Under Review', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Provisionally Selected', 'Confirmed', 'Waitlisted', 'Rejected'];
  const applicationCount = randInt(18, 34);
  for (let i = 0; i < applicationCount; i += 1) {
    const course = rand(courses);
    const name = rand(STUDENT_NAMES);
    const status = rand(statuses);
    const created = daysAgo(randInt(0, 29));
    const percentage = randInt(60, 96) + Math.random();
    insert('applications', {
      application_no: `APL-2026-${randInt(10000, 99999)}`,
      college_id: collegeId,
      course_id: course.id,
      course_name: course.name,
      student_name: name,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`,
      phone: `+91 9${randInt(100000000, 999999999)}`,
      dob: `200${randInt(4, 8)}-0${randInt(1, 9)}-${String(randInt(10, 28))}`,
      gender: rand(['Male', 'Female', 'Prefer not to say']),
      category: rand(CATEGORIES),
      board_university: rand(BOARDS),
      qualifying_exam: course.entrance_exams ? String(course.entrance_exams).split(',')[0] : 'Class 12 Board Examination',
      marks_obtained: `${randInt(600, 1180)} / 1200`,
      percentage: Math.round(percentage * 100) / 100,
      address: `${randInt(1, 120)}, ${rand(['Gandhi Street', 'Anna Nagar', 'MG Road', 'Bharathi Street', 'Kamaraj Road'])}`,
      city: rand(CITIES),
      state: 'Tamil Nadu',
      pincode: String(600000 + randInt(10000, 99999)).slice(0, 6),
      statement: 'I am keen to join this programme because of the academic reputation, faculty expertise, placement record and campus facilities described on the portal.',
      status,
      remarks:
        status === 'Interview Scheduled'
          ? 'Interview scheduled at the admission office. Please carry original certificates.'
          : status === 'Provisionally Selected'
            ? 'Provisionally selected. Confirm admission by paying the fee within 7 days.'
            : null,
      interview_date: status === 'Interview Scheduled' ? daysAgo(-randInt(1, 6)).slice(0, 10) : null,
      decision_date: ['Provisionally Selected', 'Confirmed', 'Waitlisted', 'Rejected'].includes(status) ? created : null,
      source: 'portal',
      created_at: created,
      updated_at: created,
    });
  }

  // ---- enquiries ---------------------------------------------------------
  const enquiryStatuses = ['New', 'New', 'In Progress', 'Responded', 'Closed'];
  const questions = [
    'What is the last date to submit the application for this programme?',
    'Is hostel accommodation available for first year students and what is the fee?',
    'Are there scholarships for students from economically weaker sections?',
    'Can you share the placement statistics for the last two years?',
    'What is the eligibility for lateral entry and is there any entrance examination?',
    'Do you provide transport facility from the city centre to the campus?',
    'Is there an evening or part-time option for working professionals?',
    'What documents are required at the time of admission?',
  ];
  const enquiryCount = randInt(10, 22);
  for (let i = 0; i < enquiryCount; i += 1) {
    const course = Math.random() > 0.3 ? rand(courses) : null;
    const name = rand(STUDENT_NAMES);
    const status = rand(enquiryStatuses);
    const created = daysAgo(randInt(0, 29));
    insert('enquiries', {
      college_id: collegeId,
      course_id: course?.id || null,
      course_name: course?.name || null,
      name,
      email: `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.com`,
      phone: `+91 8${randInt(100000000, 999999999)}`,
      city: rand(CITIES),
      message: rand(questions),
      status,
      response: status === 'Responded' ? 'Thank you for your interest. Our admission office has shared the details by email.' : null,
      responded_at: status === 'Responded' ? created : null,
      created_at: created,
      updated_at: created,
    });
  }

  // ---- live activity feed ------------------------------------------------
  const activity = [
    { entity: 'courses', action: 'updated', message: `${seed.college.name} updated course eligibility and admission criteria`, visibility: 'public' },
    { entity: 'courses', action: 'updated', message: `${seed.college.name} updated seat availability for its programmes`, visibility: 'public' },
    { entity: 'placements', action: 'updated', message: `${seed.college.name} published new placement records`, visibility: 'public' },
    { entity: 'media', action: 'updated', message: `${seed.college.name} added new campus photos to the gallery`, visibility: 'public' },
    { entity: 'college', action: 'imported', message: `${seed.college.name} synced details from its official website`, visibility: 'public' },
  ];
  activity.forEach((entry, index) => {
    insert('activity_log', {
      college_id: collegeId,
      entity: entry.entity,
      action: entry.action,
      message: entry.message,
      meta: '{"source":"seed"}',
      actor: 'college',
      visibility: entry.visibility,
      created_at: daysAgo(index * 2 + 1),
    });
  });

  // ---- seat movement history --------------------------------------------
  for (const course of courses.slice(0, 6)) {
    insert('seat_events', {
      college_id: collegeId,
      course_id: course.id,
      course_name: course.name,
      old_filled: Math.max(0, (course.filled_seats || 0) - randInt(1, 8)),
      new_filled: course.filled_seats || 0,
      available: Math.max(0, (course.intake_seats || 0) - (course.filled_seats || 0)),
      intake: course.intake_seats,
      action: 'seed',
      actor: 'admission-office',
      created_at: daysAgo(randInt(1, 12)),
    });
  }

  const completeness = recomputeAndStore(collegeId);
  db.prepare('UPDATE colleges SET updated_at = ? WHERE id = ?').run(daysAgo(0), collegeId);
  created += 1;
  console.log(
    `  ✓ ${seed.college.name.padEnd(38)} login: ${seed.account.username.padEnd(10)} sections: ${Object.values(counts).reduce((a, b) => a + b, 0)} rows, completeness ${completeness}%`,
  );
}

console.log(`\n  Seed complete — ${created} college(s) created, ${skipped} skipped.`);
console.log('  Demo college logins:');
for (const seed of COLLEGE_SEEDS) {
  console.log(`    ${seed.account.username.padEnd(10)} / ${seed.account.password.padEnd(16)} (${seed.college.name})`);
}
console.log('');
