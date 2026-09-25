import express from 'express';
import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { config } from '../config.js';
import { requireCollege } from '../auth.js';
import { logActivity } from '../realtime.js';

export const uploadsRouter = express.Router();

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/csv',
  'text/plain',
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase().slice(0, 8).replace(/[^.a-z0-9]/g, '');
    const base = path
      .basename(file.originalname || 'file', ext)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'file';
    cb(null, `${base}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString('hex')}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.maxUploadMb * 1024 * 1024, files: 6 },
  fileFilter: (_req, file, cb) => {
    if (IMAGE_TYPES.includes(file.mimetype) || DOC_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new Error(`Unsupported file type ${file.mimetype}. Upload images (JPG, PNG, WEBP, GIF) or documents (PDF, DOC, XLS, PPT, CSV).`));
  },
});

function publicUrl(file) {
  return `/uploads/${file.filename}`;
}

/** Single (or multi) file upload used by every image/document field. */
uploadsRouter.post('/', requireCollege, upload.array('file', 6), (req, res) => {
  const files = req.files || [];
  if (!files.length) return res.status(400).json({ error: 'No file received' });
  const rows = files.map((f) => ({
    url: publicUrl(f),
    name: f.originalname,
    size: f.size,
    size_kb: Math.round(f.size / 1024),
    mimetype: f.mimetype,
    kind: IMAGE_TYPES.includes(f.mimetype) ? 'image' : 'document',
  }));
  logActivity({
    collegeId: req.college.id,
    entity: 'media',
    action: 'upload',
    message: `${rows.length} file(s) uploaded to the college profile`,
    actor: 'college',
    meta: { files: rows.map((r) => ({ name: r.name, size: r.size })) },
  });
  res.status(201).json({ files: rows, file: rows[0], message: `${rows.length} file(s) uploaded` });
});

/** Multer / file-size errors surface as JSON instead of HTML. */
uploadsRouter.use((err, _req, res, _next) => {
  const message =
    err?.code === 'LIMIT_FILE_SIZE'
      ? `File is larger than ${config.maxUploadMb} MB`
      : err?.message || 'Upload failed';
  res.status(400).json({ error: message });
});

export { IMAGE_TYPES, DOC_TYPES };
