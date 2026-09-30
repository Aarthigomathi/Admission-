# Backend — Tamil Nadu College Discovery Platform

Spring Boot 3 / Java 17+ REST API. You can use an installed Maven 3.9+ (`mvn`) or the checked-in Maven Wrapper.

## Run locally

Set a unique Base64-encoded JWT secret before starting the API. It is deliberately required; no known fallback signing key is shipped.

PowerShell:

```powershell
cd backend
$bytes = [byte[]]::new(48)
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($bytes)
$rng.Dispose()
$env:APP_JWT_SECRET = [Convert]::ToBase64String($bytes)
mvn clean test
mvn spring-boot:run
```

Bash:

```bash
cd backend
export APP_JWT_SECRET="$(openssl rand -base64 48)"
mvn clean test
mvn spring-boot:run
```

Default API URL: `http://localhost:8080`. To use port 8081, add `--server.port=8081` to the Spring Boot run arguments. Local development uses a file-backed H2 database at `backend/data/tn_colleges`, so data survives application restarts. Tests explicitly use an isolated in-memory H2 database. The optional H2 console is disabled by default; set `H2_CONSOLE_ENABLED=true` for local inspection, then use `/h2-console` with the configured JDBC URL, username `sa`, and blank password.

Bootstrap accounts are disabled unless credentials are provided via environment variables. For local verification workflows, configure `APP_BOOTSTRAP_ADMIN_EMAIL` and a strong `APP_BOOTSTRAP_ADMIN_PASSWORD`; optional demo-student credentials use `APP_BOOTSTRAP_STUDENT_EMAIL` and `APP_BOOTSTRAP_STUDENT_PASSWORD`. PowerShell example (use private local values, not shared or production credentials):

```powershell
$env:APP_BOOTSTRAP_ADMIN_EMAIL = "admin@example.test"
$env:APP_BOOTSTRAP_ADMIN_PASSWORD = "replace-with-a-unique-strong-password"
$env:APP_BOOTSTRAP_STUDENT_EMAIL = "student@example.test"
$env:APP_BOOTSTRAP_STUDENT_PASSWORD = "replace-with-another-unique-password"
.\mvnw.cmd spring-boot:run
```

The initializer creates only explicitly configured bootstrap accounts; without bootstrap environment variables, it creates no user accounts. It does **not** seed template colleges. Do not reuse development credentials in production.

## Main API

### College CMS
- `POST /api/colleges/signup` — register a college and its college-admin login. The record begins `PENDING` / `verified:false`; passwords are BCrypt-hashed and never returned.
- `POST /api/auth/login` — accepts `email`, `loginId`, or `username`; login ID candidates can be slash/comma separated.
- `GET /api/colleges`, `GET /api/colleges/{slug}`, `GET /api/colleges/{slug}/courses` — active, registered, verified colleges only. Pending registrations stay private until platform verification; public lists never include unregistered/template records.
- `GET/PUT /api/colleges/{id}/content/{section}` and `GET /api/colleges/{id}/content` — persist nested section JSON in `college_content`.
- `GET/POST/PUT/DELETE /api/colleges/{id}/departments` and `GET/PUT /api/colleges/{id}/departments/{departmentId}/page` — department content CRUD; deleting a department also deletes `deptPages[id]`.
- `PATCH /api/platform-admin/colleges/{id}/verify` — persist verification status and audit fields.
- `GET/POST/PUT/DELETE /api/admin/college/{id}/courses` — relational course admin API; course changes are also synced into college content JSON.

New colleges start with empty `departments` and `deptPages`, the `#1A3263 / #547792 / #FAB95B` brand palette, and the section keys documented in `CollegeContentService`. An explicit `registered` database flag defaults to false; signup is the path that marks a college registered. College, content, department, admin, and verification operations are scoped to registered colleges and checked against the signed-in user’s account.

### Students, activity, and enquiries
- `POST /api/auth/register` creates the user and student profile; student profile routes are under `/api/students/me` (profile, education, preferences, saved colleges, comparisons).
- `POST /api/activity/track` stores authenticated student activity. Client-supplied student IDs are ignored; metadata is stripped of direct contact identifiers.
- `GET /api/activity/college/{id}/aggregated` returns persisted, aggregate-only analytics to that college’s admins/platform admins.
- `POST /api/enquiries` requires an authenticated student and explicit consent. Enquiry status/list routes are under `/api/enquiries`; contact details are only exposed on consented enquiries to the owning college.
- `GET /api/notifications` and read routes return notifications belonging to the authenticated account only. Enquiry status changes notify the student.

### Platform administration
Dashboard counters and charts read persisted colleges, users, activities, and enquiries. `GET /api/platform-admin/student-visits` provides a paginated, filterable student-to-college visit register (student contact/profile details, visit counts, and last visit) for platform admins only; filters include `collegeId`, `studentId`, `from`, `to`, and `search`. College-facing analytics remain aggregate-only. Interest reports are saved to the database and downloadable as generated PDF snapshots. Student dashboard endpoints expose only the authenticated student’s own activity.

## Verification

Run `mvn clean test` from `backend/` (or `./mvnw clean test` / `mvnw.cmd clean test` if the wrapper distribution is available). The test suite covers H2 schema creation, signup/default content, excluding unverified and unregistered colleges from public lists, username login, consent-based enquiries, private activity metadata, department/page deletion, verification notifications, platform-wide visit register access for platform admins only, and registered-college verification flow.

Before production, configure a managed MySQL database using `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, and `SPRING_DATASOURCE_DRIVER=com.mysql.cj.jdbc.Driver`; use an environment-provided strong `APP_JWT_SECRET`, optional strong bootstrap credentials, restricted frontend CORS origins, schema migrations/backups, rate limiting, and deployment-grade security/privacy review. The frontend uses the public-college, authentication, content, activity, dashboard, and audit APIs through the Vite `/api` proxy.
