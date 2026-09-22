/**
 * Generic profile-section CRUD.
 *
 * Every college-managed section (departments, courses, fees, faculty, hostels,
 * transport, library, sports, infrastructure, facilities, scholarships, events,
 * achievements, media, documents, placements, recruiters, internships) is
 * served by this one router, driven by the shared entity registry.
 */
import express from 'express';
import { ENTITIES, buildEntityPayload, decodeRow } from '../entities.js';
import { all, db, get, insert, now, remove, run, update } from '../db.js';
import { logActivity, emitToCollege, emitPublic } from '../realtime.js';
import { recomputeAndStore } from '../services/completeness.js';
import { requireCollege } from '../auth.js';

export const entitiesRouter = express.Router();
entitiesRouter.use(requireCollege);

const ENTITY_NAMES = Object.keys(ENTITIES);

function resolveEntity(req, res, next) {
  const entity = ENTITIES[req.params.entity];
  if (!entity) return res.status(404).json({ error: `Unknown section "${req.params.entity}"`, sections: ENTITY_NAMES });
  req.entityName = req.params.entity;
  req.entity = entity;
  return next();
}

function decode(name, row) {
  return row ? decodeRow(row, ENTITIES[name].fields) : row;
}

/** All sections for the signed-in college, in one call (dashboard bootstrap). */
entitiesRouter.get('/', (req, res) => {
  const out = {};
  for (const [name, entity] of Object.entries(ENTITIES)) {
    out[name] = all(`SELECT * FROM ${name} WHERE college_id = ? ORDER BY sort_order ASC, id DESC`, [req.college.id]).map((row) =>
      decode(name, row),
    );
  }
  res.json({ sections: out, schema: publicSchema() });
});

entitiesRouter.get('/schema', (_req, res) => res.json({ schema: publicSchema() }));

entitiesRouter.get('/:entity', resolveEntity, (req, res) => {
  const rows = all(`SELECT * FROM ${req.entityName} WHERE college_id = ? ORDER BY sort_order ASC, id DESC`, [req.college.id]);
  res.json({ entity: req.entityName, label: req.entity.plural, rows: rows.map((r) => decode(req.entityName, r)) });
});

entitiesRouter.get('/:entity/:id', resolveEntity, (req, res) => {
  const row = get(`SELECT * FROM ${req.entityName} WHERE id = ? AND college_id = ?`, [req.params.id, req.college.id]);
  if (!row) return res.status(404).json({ error: 'Record not found' });
  res.json({ row: decode(req.entityName, row) });
});

function mediaCoverHook(entityName, payload, collegeId) {
  if (entityName !== 'media' || Number(payload.is_cover) !== 1) return;
  run('UPDATE media SET is_cover = 0 WHERE college_id = ?', [collegeId]);
  run('UPDATE colleges SET cover_url = ?, updated_at = ? WHERE id = ?', [payload.url, now(), collegeId]);
}

entitiesRouter.post('/:entity', resolveEntity, (req, res) => {
  try {
    const payload = buildEntityPayload(req.entityName, req.body, { partial: false });
    const ts = now();
    const id = insert(req.entityName, {
      ...payload,
      college_id: req.college.id,
      sort_order: Number(req.body?.sort_order) || 0,
      is_published: req.body?.is_published === undefined || req.body?.is_published === '' ? 1 : Number(req.body.is_published) ? 1 : 0,
      created_at: ts,
      updated_at: ts,
    });
    mediaCoverHook(req.entityName, payload, req.college.id);
    const row = decode(req.entityName, get(`SELECT * FROM ${req.entityName} WHERE id = ?`, [id]));
    const completeness = recomputeAndStore(req.college.id);
    logActivity({
      collegeId: req.college.id,
      entity: req.entityName,
      action: 'created',
      message: `${req.entity.label} added: ${row.name || row.title || row.route_name || row.sport_name || row.course_name || row.company || 'record'}`,
      actor: 'college',
      meta: { id, entity: req.entityName },
    });
    res.status(201).json({ row, completeness, message: `${req.entity.label} saved` });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Could not save this record' });
  }
});

entitiesRouter.put('/:entity/:id', resolveEntity, (req, res) => {
  try {
    const existing = get(`SELECT * FROM ${req.entityName} WHERE id = ? AND college_id = ?`, [req.params.id, req.college.id]);
    if (!existing) return res.status(404).json({ error: 'Record not found' });
    const payload = buildEntityPayload(req.entityName, req.body, { partial: true });
    if (req.body?.is_published !== undefined) payload.is_published = Number(req.body.is_published) ? 1 : 0;
    if (req.body?.sort_order !== undefined) payload.sort_order = Number(req.body.sort_order) || 0;
    payload.updated_at = now();
    update(req.entityName, req.params.id, payload, req.college.id);
    mediaCoverHook(req.entityName, { ...payload }, req.college.id);
    const row = decode(req.entityName, get(`SELECT * FROM ${req.entityName} WHERE id = ?`, [req.params.id]));
    const completeness = recomputeAndStore(req.college.id);

    // live seat movement gets its own broadcast for students watching courses
    if (req.entityName === 'courses' && ('filled_seats' in payload || 'intake_seats' in payload || 'admission_status' in payload)) {
      const intake = Number(row.intake_seats) || 0;
      const filled = Number(row.filled_seats) || 0;
      emitPublic('seats:changed', {
        collegeId: req.college.id,
        collegeName: req.college.name,
        courseId: row.id,
        courseName: row.name,
        intake,
        filled,
        available: Math.max(0, intake - filled),
        admissionStatus: row.admission_status,
        at: now(),
      });
    }

    logActivity({
      collegeId: req.college.id,
      entity: req.entityName,
      action: 'updated',
      message: `${req.entity.label} updated: ${row.name || row.title || row.route_name || row.sport_name || row.course_name || row.company || 'record'}`,
      actor: 'college',
      meta: { id: row.id },
    });
    res.json({ row, completeness, message: `${req.entity.label} updated` });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Could not update this record' });
  }
});

entitiesRouter.delete('/:entity/:id', resolveEntity, (req, res) => {
  const existing = get(`SELECT * FROM ${req.entityName} WHERE id = ? AND college_id = ?`, [req.params.id, req.college.id]);
  if (!existing) return res.status(404).json({ error: 'Record not found' });
  remove(req.entityName, req.params.id, req.college.id);
  const completeness = recomputeAndStore(req.college.id);
  logActivity({
    collegeId: req.college.id,
    entity: req.entityName,
    action: 'deleted',
    message: `${req.entity.label} removed: ${existing.name || existing.title || existing.route_name || 'record'}`,
    actor: 'college',
    meta: { id: Number(req.params.id) },
  });
  res.json({ ok: true, completeness, message: `${req.entity.label} deleted` });
});

/** Bulk insert — used by the website importer and by bulk uploads. */
entitiesRouter.post('/:entity/bulk', resolveEntity, (req, res) => {
  const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];
  if (!rows.length) return res.status(400).json({ error: 'No rows supplied' });
  const mode = req.body?.mode === 'replace' ? 'replace' : 'append';
  if (mode === 'replace') run(`DELETE FROM ${req.entityName} WHERE college_id = ?`, [req.college.id]);

  const ts = now();
  const inserted = [];
  const failed = [];

  db.transaction(() => {
    for (const row of rows) {
      try {
        const payload = buildEntityPayload(req.entityName, row, { partial: true });
        const id = insert(req.entityName, {
          ...payload,
          college_id: req.college.id,
          sort_order: inserted.length,
          is_published: 1,
          created_at: ts,
          updated_at: ts,
        });
        inserted.push(id);
      } catch (err) {
        failed.push({ row, error: err.message });
      }
    }
  })();

  const completeness = recomputeAndStore(req.college.id);
  logActivity({
    collegeId: req.college.id,
    entity: req.entityName,
    action: 'bulk',
    message: `${inserted.length} ${req.entity.plural.toLowerCase()} added to the profile`,
    actor: 'college',
    meta: { inserted: inserted.length, failed: failed.length },
  });
  res.status(201).json({
    inserted: inserted.length,
    failed: failed.slice(0, 10),
    completeness,
    message: `${inserted.length} record(s) added${failed.length ? `, ${failed.length} skipped` : ''}`,
  });
});

function publicSchema() {
  return Object.fromEntries(
    Object.entries(ENTITIES).map(([name, entity]) => [
      name,
      { label: entity.label, plural: entity.plural, icon: entity.icon, order: entity.order, description: entity.description, fields: entity.fields },
    ]),
  );
}
