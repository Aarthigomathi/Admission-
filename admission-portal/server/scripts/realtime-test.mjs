/**
 * Realtime end-to-end check.
 *
 * Proves that a change made through the REST API reaches connected clients over
 * socket.io without a refresh:
 *   1. application status change  → college room + the student's tracking room
 *   2. seat count change          → public room (every student watching seats)
 *   3. new enquiry (student side) → college room
 *   4. new application (student)  → college room + public room
 *
 *   npm run test:realtime        (server must be running)
 */
const BASE = process.env.API_BASE || 'http://127.0.0.1:5000';
const { io } = await import('socket.io-client');

let pass = 0;
let fail = 0;
const log = (ok, label, detail = '') => {
  if (ok) pass += 1;
  else fail += 1;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${detail && !ok ? ` → ${detail}` : ''}`);
};

const api = async (path, { method = 'GET', body, token } = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { error: text.slice(0, 120) };
  }
  return { status: res.status, data };
};

const connect = (label) =>
  new Promise((resolve, reject) => {
    const socket = io(BASE, { transports: ['websocket'] });
    const timer = setTimeout(() => reject(new Error(`${label}: socket never connected`)), 6000);
    socket.on('connect', () => {
      clearTimeout(timer);
      resolve(socket);
    });
    socket.on('connect_error', (err) => {
      clearTimeout(timer);
      reject(new Error(`${label}: ${err.message}`));
    });
  });

/** Resolve with the first payload for `event`, or null after `ms`. */
const waitFor = (socket, event, ms = 4000) =>
  new Promise((resolve) => {
    const timer = setTimeout(() => {
      socket.off(event, handler);
      resolve(null);
    }, ms);
    function handler(payload) {
      clearTimeout(timer);
      socket.off(event, handler);
      resolve(payload ?? {});
    }
    socket.on(event, handler);
  });

const login = await api('/api/auth/login', { method: 'POST', body: { identifier: 'psgtech', password: 'PSG@Login2026' } });
const token = login.data.token;
log(Boolean(token), 'college login works', login.data.error);

const applications = await api('/api/college/applications', { token });
const sample = applications.data.rows?.[0];
log(Boolean(sample), 'college has applications to move through the pipeline');

/* ---------------- rooms ---------------- */
const collegeSocket = await connect('college');
const sessionWait = waitFor(collegeSocket, 'college:session', 4000);
collegeSocket.emit('college:join', login.data.college.id);
const studentSocket = await connect('student');
studentSocket.emit('track:join', sample.application_no);
studentSocket.emit('portal:hello');
const publicSocket = await connect('public');

const sessionAck = await sessionWait;
log(Boolean(sessionAck), 'college room join acknowledged', 'no college:session event');

/* ---------------- 1. application status change ---------------- */
const nextStatus = sample.status === 'Under Review' ? 'Shortlisted' : 'Under Review';
const collegeEvent = waitFor(collegeSocket, 'application:updated');
const trackEvent = waitFor(studentSocket, 'application:status');
const updated = await api(`/api/college/applications/${sample.id}`, {
  method: 'PUT',
  body: { status: nextStatus, note: 'Realtime verification' },
  token,
});
log(updated.status === 200, 'status update accepted by the API', JSON.stringify(updated.data).slice(0, 120));
const collegePayload = await collegeEvent;
const trackPayload = await trackEvent;
log(Boolean(collegePayload), 'college dashboard received application:updated');
log(Boolean(trackPayload), "student's tracking page received application:status");
log(trackPayload?.applicationNo === sample.application_no, 'tracking event carries the right application', JSON.stringify(trackPayload).slice(0, 120));
log(trackPayload?.status === nextStatus, 'tracking event carries the new status', JSON.stringify(trackPayload).slice(0, 120));

/* ---------------- 2. seat change → public room ---------------- */
const seatStats = await api('/api/college/stats', { token });
const course = seatStats.data.seatBoard?.[0];
const target = Math.min(course.intake_seats, course.filled_seats + 1);
const seatEvent = waitFor(publicSocket, 'seats:changed');
const statsEventWait = waitFor(publicSocket, 'stats:updated');
const seatUpdate = await api('/api/college/seats', { method: 'POST', body: { course_id: course.id, filled_seats: target }, token });
log(seatUpdate.status === 200, 'seat update accepted by the API', JSON.stringify(seatUpdate.data).slice(0, 120));
const seatPayload = await seatEvent;
log(Boolean(seatPayload), 'public room received seats:changed');
log(Number(seatPayload?.available) === course.intake_seats - target, 'seat event carries recalculated availability', JSON.stringify(seatPayload).slice(0, 140));
const statsEvent = await statsEventWait;
log(Boolean(statsEvent), 'public room received refreshed stats', JSON.stringify(statsEvent).slice(0, 100));

/* ---------------- 3. enquiry from the student side ---------------- */
const enquiryEvent = waitFor(collegeSocket, 'enquiry:created');
const enquiry = await api('/api/public/enquiries', {
  method: 'POST',
  body: {
    college_id: login.data.college.id,
    name: 'Realtime Check',
    email: `rt-${Date.now()}@example.com`,
    phone: '+91 90000 00000',
    message: 'Automated realtime verification enquiry.',
  },
});
log(enquiry.status === 200 || enquiry.status === 201, 'student enquiry accepted', JSON.stringify(enquiry.data).slice(0, 140));
const enquiryPayload = await enquiryEvent;
log(Boolean(enquiryPayload), 'college dashboard received enquiry:created live');

/* ---------------- 4. application from the student side ---------------- */
const courseForApply = seatStats.data.seatBoard.find((c) => c.available > 1) || course;
const applyEvent = waitFor(collegeSocket, 'application:created');
const apply = await api('/api/public/applications', {
  method: 'POST',
  body: {
    college_id: login.data.college.id,
    course_id: courseForApply.id,
    student_name: 'Realtime Applicant',
    email: `rt-apply-${Date.now()}@example.com`,
    phone: '+91 90000 00001',
    category: 'General',
    board: 'State Board',
    percentage: 88.4,
  },
});
log(apply.status === 200 || apply.status === 201, 'student application accepted', JSON.stringify(apply.data).slice(0, 140));
const applyPayload = await applyEvent;
log(Boolean(applyPayload), 'college dashboard received application:created live');

/* ---------------- cleanup: restore seeded state ---------------- */
await api(`/api/college/applications/${sample.id}`, { method: 'PUT', body: { status: sample.status }, token });
await api('/api/college/seats', { method: 'POST', body: { course_id: course.id, filled_seats: course.filled_seats }, token });

collegeSocket.close();
studentSocket.close();
publicSocket.close();

console.log(`\n  ${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
