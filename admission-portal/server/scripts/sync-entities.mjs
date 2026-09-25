/**
 * Generates client/src/entities.js from the server-side schema so the college
 * dashboard forms can never drift from the API validation rules.
 *
 *   node scripts/sync-entities.mjs   (run from the server folder)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COLLEGE_PROFILE_FIELDS, ENTITIES } from '../src/entities.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const target = path.resolve(__dirname, '..', '..', 'client', 'src', 'entities.js');

const banner = `/**
 * AUTO-GENERATED FILE — do not edit by hand.
 * Source of truth: server/src/entities.js
 * Regenerate with:  cd server && npm run sync:entities
 */
`;

const body = `${banner}
export const ENTITIES = ${JSON.stringify(ENTITIES, null, 2)};

export const COLLEGE_PROFILE_FIELDS = ${JSON.stringify(COLLEGE_PROFILE_FIELDS, null, 2)};

export const SECTION_ORDER = ${JSON.stringify(Object.keys(ENTITIES))};

export const SECTION_GROUPS = [
  { label: 'Academics', sections: ['departments', 'courses', 'fees', 'faculty'] },
  { label: 'Placements & Careers', sections: ['placements', 'recruiters', 'internships'] },
  { label: 'Campus Life', sections: ['hostels', 'transport', 'library', 'sports', 'infrastructure', 'facilities'] },
  { label: 'Students & Recognition', sections: ['scholarships', 'events', 'achievements'] },
  { label: 'Media & Documents', sections: ['media', 'documents'] },
];
`;

fs.writeFileSync(target, body);
console.log(`wrote ${target} (${Object.keys(ENTITIES).length} sections)`);
