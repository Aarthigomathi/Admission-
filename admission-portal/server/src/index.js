import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { config, CLIENT_DIST } from './config.js';
import './db.js';
import { initRealtime } from './realtime.js';
import { authRouter } from './routes/auth.routes.js';
import { collegeRouter } from './routes/college.routes.js';
import { entitiesRouter } from './routes/entities.routes.js';
import { publicRouter } from './routes/public.routes.js';
import { uploadsRouter } from './routes/uploads.routes.js';

const app = express();
app.set('trust proxy', 1); // the platform proxy terminates TLS in front of us

app.use(
  helmet({
    contentSecurityPolicy: false, // Vite dev server + media hot-linked from college websites
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    frameguard: false, // allow the app to be embedded in preview panes
  }),
);

const DEV_ORIGIN_RE = /^http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|\d+\.\d+\.\d+\.\d+):\d+$/;
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (config.corsOrigins.includes(origin)) return cb(null, true);
      if (DEV_ORIGIN_RE.test(origin)) return cb(null, true);
      if (/\.e2b\.app$/.test(new URL(origin).hostname)) return cb(null, true);
      return cb(null, config.nodeEnv !== 'production');
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// uploaded files (images, brochures, documents)
app.use(
  '/uploads',
  express.static(config.uploadDir, {
    maxAge: '1h',
    setHeaders(res) {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Access-Control-Allow-Origin', '*');
    },
  }),
);

app.get('/api/health', (_req, res) =>
  res.json({
    ok: true,
    service: 'college-admission-portal',
    time: new Date().toISOString(),
    env: config.nodeEnv,
    realtime: true,
  }),
);

app.use('/api/auth', authRouter);
app.use('/api/college/entities', entitiesRouter);
app.use('/api/college/uploads', uploadsRouter);
app.use('/api/college', collegeRouter);
app.use('/api/public', publicRouter);

app.use('/api', (_req, res) => res.status(404).json({ error: 'Endpoint not found' }));

// Serve the built SPA when it exists (single-port production mode)
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) return next();
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong on the server' });
});

const server = http.createServer(app);
initRealtime(server);

server.listen(config.port, config.host, () => {
  console.log(`\n  College Admission Portal API ready`);
  console.log(`  → http://localhost:${config.port}/api/health`);
  console.log(`  → database: ${config.dbPath}`);
  console.log(`  → uploads:  ${config.uploadDir}`);
  console.log(`  → realtime: socket.io on the same port\n`);
});

export { app, server };
