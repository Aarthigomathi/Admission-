# Backend (Spring Boot)

## Requirements

- JDK 17 (install a full JDK, not only a JRE)
- Internet access the first time you run the Maven Wrapper so it can download Maven and project dependencies

You do **not** need to install Maven globally; use the checked-in wrapper.

## Start locally

Linux/macOS/Git Bash:

```bash
cd backend
java -version
./mvnw clean test
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
cd backend
java -version
.\mvnw.cmd clean test
.\mvnw.cmd spring-boot:run
```

The API listens on `http://localhost:8080` by default. For a different port, run `./mvnw spring-boot:run -Dspring-boot.run.arguments=--server.port=8081` (Windows: `.\\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"`). The development profile uses in-memory H2; college/content/user changes are lost when the process stops. H2 console: `/h2-console`, JDBC URL `jdbc:h2:mem:tn_colleges`, username `sa`, blank password.

## College CMS API

- `POST /api/colleges/signup` — creates a college and its `COLLEGE_ADMIN` user; starts `PENDING` and never returns the password.
- `POST /api/auth/login` — accepts `email`, `loginId`, or `username`; login identifiers may be slash/comma-separated.
- `GET /api/colleges` and `GET /api/colleges/{slug}` — only active, registered colleges (including pending registrations, with `verified: false` until approval); no template colleges are seeded.
- `GET/PUT /api/colleges/{id}/content/{section}` — stores section JSON in `college_content`; edits require the owning college admin/editor or platform admin.
- `GET/POST/PUT/DELETE /api/colleges/{id}/departments` — department JSON CRUD. Deleting a department also removes its `deptPages` entry.
- `GET/PUT /api/colleges/{id}/departments/{departmentId}/page` — department page JSON.
- `GET /api/platform-admin/colleges` and `PATCH /api/platform-admin/colleges/{id}/verify` — list pending/registered colleges and persist verification status; platform-admin JWT required.

New signups start with `departments: []`, `deptPages: {}`, and the KCE palette (`#1A3263`, `#547792`, `#FAB95B`). All supported custom sections are stored as JSON records, so the frontend's nested page data is preserved. The development bootstrap creates `superadmin@tncolleges.com / superadmin123` and `student@test.com / student123`; no example colleges are seeded.

## Verification and limitations

Tests cover H2 table creation, pending signup, default section values, username login lookup, department/page deletion behavior, and verification-to-public-list flow. Run `./mvnw clean test` before using the frontend. Student activity, enquiries, and several analytics/report endpoints are still demonstration implementations; production deployment also needs a persistent database, environment-managed JWT secrets, production CORS settings, and integration/security tests.
