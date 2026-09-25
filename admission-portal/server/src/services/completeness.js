import { COMPLETENESS_SECTIONS } from '../entities.js';
import { all, get, now, run } from '../db.js';

const BASE_REQUIRED = ['name', 'about', 'address', 'city', 'state', 'phone', 'email', 'website'];
const ABOUT_REQUIRED = ['vision', 'mission'];
const CONTACT_REQUIRED = ['pincode', 'admission_email'];
const BRANDING_REQUIRED = ['logo_url', 'cover_url'];

function hasAll(college, keys) {
  return keys.every((k) => college[k] !== null && college[k] !== undefined && String(college[k]).trim() !== '');
}

/**
 * Weighted profile-completeness score plus a per-section checklist that the
 * college dashboard shows as "what to fill next".
 */
export function computeCompleteness(collegeId) {
  const college = get('SELECT * FROM colleges WHERE id = ?', [collegeId]);
  if (!college) return { percentage: 0, sections: [] };

  const checks = {
    base: hasAll(college, BASE_REQUIRED) && Boolean(college.established_year) && Boolean(college.type),
    about: hasAll(college, ABOUT_REQUIRED),
    contact: hasAll(college, CONTACT_REQUIRED) && Boolean(college.latitude && college.longitude),
    branding: hasAll(college, BRANDING_REQUIRED),
  };

  const sections = COMPLETENESS_SECTIONS.map((section) => {
    let done = 0;
    let count = 0;
    if (section.entity) {
      const names = section.entity.split('|');
      count = names.reduce((sum, name) => sum + get(`SELECT COUNT(*) AS n FROM ${name} WHERE college_id = ?`, [collegeId]).n, 0);
      done = Math.min(count, section.min || 1);
      const ok = count >= (section.min || 1);
      return {
        key: section.key,
        label: section.label,
        weight: section.weight,
        complete: ok,
        count,
        needed: section.min || 1,
        entities: names,
      };
    }
    return { key: section.key, label: section.label, weight: section.weight, complete: Boolean(checks[section.key]), count: 0 };
  });

  const totalWeight = COMPLETENESS_SECTIONS.reduce((sum, s) => sum + s.weight, 0);
  const earned = sections.reduce((sum, s) => sum + (s.complete ? s.weight : 0), 0);
  const percentage = Math.round((earned / totalWeight) * 100);
  return { percentage, sections };
}

export function recomputeAndStore(collegeId) {
  const { percentage } = computeCompleteness(collegeId);
  run('UPDATE colleges SET profile_completeness = ?, updated_at = ? WHERE id = ?', [percentage, now(), collegeId]);
  return percentage;
}

/** Rich single-college payload used by both the student page and dashboard preview. */
export function getCollegeBundle(collegeId, { publicOnly = false } = {}) {
  const college = get('SELECT * FROM colleges WHERE id = ?', [collegeId]);
  if (!college) return null;
  const entityNames = [
    'departments',
    'courses',
    'fees',
    'faculty',
    'placements',
    'recruiters',
    'internships',
    'hostels',
    'transport',
    'library',
    'sports',
    'infrastructure',
    'facilities',
    'scholarships',
    'events',
    'achievements',
    'media',
    'documents',
  ];
  const data = {};
  for (const name of entityNames) {
    const rows = all(
      `SELECT * FROM ${name} WHERE college_id = ?${publicOnly ? ' AND is_published = 1' : ''} ORDER BY sort_order ASC, id DESC`,
      [collegeId],
    );
    data[name] = rows;
  }
  return { college, ...data };
}
