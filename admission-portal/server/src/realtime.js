/**
 * Real-time layer (Socket.IO).
 *
 * Rooms
 *   college:<id>   – the owning college dashboard (private updates)
 *   public         – every student browsing the portal
 *   app:<no>       – a student tracking one application
 *
 * Events pushed to clients
 *   college:data-changed   { collegeId, entity, action, message, at }
 *   seats:changed          { collegeId, courseId, available, intake, admissionStatus }
 *   application:created    (college room)
 *   application:status     (tracking room + public room)
 *   enquiry:created        (college room)
 *   stats:updated          (public room)
 */
import { Server } from 'socket.io';
import { all, get, now } from './db.js';
import { config } from './config.js';

let io = null;

export function initRealtime(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
    path: '/socket.io',
  });

  io.on('connection', (socket) => {
    socket.join('public');

    socket.on('college:join', (collegeId, cb) => {
      if (!collegeId) return;
      socket.join(`college:${collegeId}`);
      // acknowledge so the dashboard can confirm it is wired to live updates
      const college = get('SELECT id, name, slug, status FROM colleges WHERE id = ?', [collegeId]);
      const payload = { collegeId, college: college || null, at: now() };
      socket.emit('college:session', payload);
      if (typeof cb === 'function') cb(payload);
    });
    socket.on('track:join', (applicationNo) => {
      if (applicationNo) socket.join(`app:${String(applicationNo).toUpperCase()}`);
    });
    socket.on('portal:hello', (cb) => {
      if (typeof cb === 'function') cb({ ok: true, at: now() });
    });
  });

  // periodic public heartbeat so open student pages always show live state
  setInterval(() => {
    if (!io) return;
    io.to('public').emit('stats:updated', publicStats());
  }, 20_000);

  return io;
}

export function ioInstance() {
  return io;
}

export function emitToCollege(collegeId, event, payload) {
  io?.to(`college:${collegeId}`).emit(event, payload);
}

export function emitPublic(event, payload) {
  io?.to('public').emit(event, payload);
}

export function emitToApplication(applicationNo, event, payload) {
  io?.to(`app:${String(applicationNo).toUpperCase()}`).emit(event, payload);
}

/** Fire a data-change event to everyone who needs it. */
export function broadcastChange({ collegeId, entity, action = 'updated', message, meta = {} }) {
  const payload = { collegeId, entity, action, message, at: now(), ...meta };
  if (collegeId) emitToCollege(collegeId, 'college:data-changed', payload);
  emitPublic('college:data-changed', {
    ...payload,
    college: get('SELECT id, name, slug, city, state FROM colleges WHERE id = ?', [collegeId]) || null,
  });
  emitPublic('stats:updated', publicStats());
}

/** Record an activity entry (drives the live feed on both sides). */
export function logActivity({ collegeId, entity, action, message, actor = 'college', visibility = 'public', meta = {} }) {
  const info = get(
    `INSERT INTO activity_log (college_id, entity, action, message, meta, actor, visibility, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
    [collegeId, entity, action, message, JSON.stringify(meta), actor, visibility, now()],
  );
  const row = get(
    `SELECT a.*, c.name AS college_name, c.slug AS college_slug
       FROM activity_log a LEFT JOIN colleges c ON c.id = a.college_id
      WHERE a.id = ?`,
    [info.id],
  );
  broadcastChange({ collegeId, entity, action, message, meta });
  emitToCollege(collegeId, 'activity:new', row);
  if (visibility === 'public') emitPublic('activity:new', row);
  return row;
}

export function publicStats() {
  const colleges = get('SELECT COUNT(*) AS n FROM colleges WHERE status = ?', ['published']).n;
  const courses = get('SELECT COUNT(*) AS n FROM courses WHERE is_published = 1').n;
  const seats = get(
    `SELECT COALESCE(SUM(intake_seats), 0) AS intake,
            COALESCE(SUM(filled_seats), 0) AS filled
       FROM courses WHERE is_published = 1`,
  );
  const departments = get('SELECT COUNT(*) AS n FROM departments').n;
  const applications = get('SELECT COUNT(*) AS n FROM applications').n;
  const states = all('SELECT DISTINCT state FROM colleges WHERE state IS NOT NULL AND status = ?', ['published']).length;
  return {
    colleges,
    courses,
    departments,
    states,
    applications,
    seats: seats.intake,
    seatsFilled: seats.filled,
    seatsAvailable: Math.max(0, (seats.intake || 0) - (seats.filled || 0)),
    at: now(),
  };
}

export const realtimeEnabled = () => Boolean(io) && config.nodeEnv !== 'test';
