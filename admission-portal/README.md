# CampusConnect — Real-time College Admission Portal

A complete, from-scratch admission platform with two sides:

- **Colleges** get one secure login each, and manage their complete profile — every
  section a student would look for on an official college website.
- **Students** search and explore colleges, see live seat availability, compare
  placements and fees, open enquiries, apply, and track an application as its status
  changes — all in real time, without refreshing.

```
admission-portal/
├── server/          Express 5 + SQLite API, auth, uploads, website importer, socket.io
└── client/          Vite + React 19 single-page app (student portal + college dashboard)
```

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | React 19, React Router 7, Vite 8, Recharts, plain CSS design system |
| Backend | Node 22, Express 5 (ESM) |
| Database | SQLite via better-sqlite3 (WAL), schema generated from one entity registry |
| Auth | bcrypt (12 rounds) + JWT (12 h) for colleges, rate-limited + lockout |
| Realtime | socket.io rooms (`college:<id>`, `public`, `app:<APPLICATION_NO>`) |
| Uploads | multer → `/uploads`, images and documents, served statically |

## Quick start

```bash
cd server
npm install
npm run seed            # creates 4 demo colleges with a full profile each
npm start               # API + built SPA on http://localhost:5000
```

Frontend development (hot reload, proxies /api, /uploads and /socket.io to :5000):

```bash
cd client
npm install
npm run dev             # http://localhost:5173
```

Production-style single port (builds the client, then serves API + SPA together):

```bash
cd server && npm run start:prod
```

### Demo college logins

| College | Username | Password |
| --- | --- | --- |
| PSG College of Technology | `psgtech` | `PSG@Login2026` |
| Vellore Institute of Technology | `vit` | `VIT@Login2026` |
| Loyola College | `loyola` | `Loyola@Login2026` |
| Indian Institute of Technology Madras | `iitm` | `IITM@Login2026` |

Each college has exactly one account (`college_accounts.college_id` is `UNIQUE`), and
no college can see or edit another college's data.

## What a college can manage (18 sections)

Identity and profile · About, vision & mission · Departments · Courses & admissions ·
Fee structure · Faculty · Placements · Recruiters · Internships · Hostels · Transport ·
Library · Sports · Infrastructure · Campus facilities · Scholarships · Events ·
Achievements · Photos & videos · Documents & brochures

Any of it can be added, edited, deleted or re-published at any time; seat counts and
admission status can be updated from the dashboard in one click.

### Website import assistant

`Dashboard → Import from website` fetches the college's official pages, parses them,
shows a per-section preview of what it found, and applies the selection to the profile.
It also accepts pasted page source, which is how the importer is exercised offline.

## What a student can do

- Search & explore with filters (state, city, type, level, stream, admission status, hostel).
- Open a full college profile: courses with eligibility/criteria/fees/seats, placements
  and recruiters, campus life, gallery and documents.
- Watch **live seat availability** across every published course.
- Send an **enquiry** or submit an **admission application** for a course.
- **Track** an application by number (and e-mail) and see each stage update live.

## Real-time behaviour

| Trigger | Event | Reaches |
| --- | --- | --- |
| Application status change | `application:status` | that student's tracking room |
| Application status change | `application:updated` | the owning college dashboard |
| New application / enquiry | `application:created`, `enquiry:created` | college room |
| Seat count or admission status updated | `seats:changed`, `stats:updated` | every open public page |
| Any section saved | `college:data-changed`, `activity:new` | college + public live feed |
| Seat count updated | `stats:updated` | portal-wide counters refresh |
| — | `stats:updated` heartbeat every 20 s | keeps open pages current |

`socket.io` shares the HTTP port, and the client joins `college:<id>` when a college
signs in and `app:<APPLICATION_NO>` when a student opens a tracking link.

## Verification

From `server/`:

```bash
npm run smoke          # schema, validation, auth guards, write path   (40 checks)
npm run test:import    # website parser, offline HTML mode             (24 checks)
npm run test:realtime  # socket.io room delivery end-to-end            (16 checks)
```

From `client/` (server must be running):

```bash
npm run lint           # eslint, 0 problems
npm run check:render   # renders all 16 routes server-side
npm run check:dom      # jsdom: mounts the real app against the live API (49 checks)
```

## API surface

```
POST /api/auth/register | login | logout        GET /api/auth/me
GET  /api/public/stats | meta | updates | recruiters/top | seats/live
GET  /api/public/colleges?q=&state=&city=&type=&level=&stream=&admission_status=
GET  /api/public/colleges/:slug        POST /api/public/applications | enquiries
GET  /api/public/applications/track?application_no=&email=
GET  /api/college/me | stats | applications | applications.csv | enquiries | security
PUT  /api/college/me | applications/:id | enquiries/:id | seats | profile
GET/POST/PUT/DELETE /api/college/entities/:section[/:id]
POST /api/college/uploads          (multipart, field `file`, ≤6 files, ≤8 MB each)
POST /api/college/website-import | /website-import/apply
GET  /api/health
```

Application statuses: Submitted, Under Review, Shortlisted, Interview Scheduled,
Document Verification, Provisionally Selected, Confirmed, Waitlisted, Rejected.
Enrolment states: Open, Closing Soon, Few Seats Left, Closed, Coming Soon.

## Notes

- Seed data (colleges, courses, placements, recruiters, …) was compiled from each
  institution's real official website; colleges seeded as unverified show
  "awaiting college confirmation" until they save their profile.
- The four demo photographs in `client/public/media/` are generated images used as
  placeholder campus photography for the demo college.
- `client/src/entities.js` is generated from `server/src/entities.js` by
  `npm run sync:entities` — never edit it by hand.
