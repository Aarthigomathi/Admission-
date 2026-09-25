import Database from 'better-sqlite3';
import { config } from './config.js';
import { buildSchema } from './schema.js';

export const db = new Database(config.dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.exec(buildSchema());

export const now = () => new Date().toISOString();

export function run(sql, params = []) {
  return db.prepare(sql).run(...(Array.isArray(params) ? params : [params]));
}
export function get(sql, params = []) {
  return db.prepare(sql).get(...(Array.isArray(params) ? params : [params]));
}
export function all(sql, params = []) {
  return db.prepare(sql).all(...(Array.isArray(params) ? params : [params]));
}

/** Insert an object into a table using only known columns. */
export function insert(table, data) {
  const keys = Object.keys(data);
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`;
  const info = db.prepare(sql).run(...keys.map((k) => data[k]));
  return Number(info.lastInsertRowid);
}

/** Update a row by id, restricted to the owning college when given. */
export function update(table, id, data, collegeId = null) {
  const keys = Object.keys(data);
  if (!keys.length) return 0;
  const sql = `UPDATE ${table} SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ?${collegeId ? ' AND college_id = ?' : ''}`;
  const params = [...keys.map((k) => data[k]), id, ...(collegeId ? [collegeId] : [])];
  return db.prepare(sql).run(...params).changes;
}

export function remove(table, id, collegeId = null) {
  const sql = `DELETE FROM ${table} WHERE id = ?${collegeId ? ' AND college_id = ?' : ''}`;
  return db.prepare(sql).run(...(collegeId ? [id, collegeId] : [id])).changes;
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}
