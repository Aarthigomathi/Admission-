# Tamil Nadu College Admission Portal

A single VS Code workspace containing the React/Vite frontend and Spring Boot API. The portal provides student discovery, saved/compare colleges, enquiries, student profiles, college admin content management, and platform-admin views.

## Project layout

```text
student-portal/
├── frontend/               React 19 + Vite app
│   ├── .env.example
│   ├── package.json
│   └── src/
├── backend/                Spring Boot 3.2 / Java 17 API
│   ├── .env.example
│   ├── pom.xml
│   └── src/
├── .vscode/                Optional VS Code tasks/extensions
├── .gitignore
└── README.md
```

The Vite dev server proxies `/api` to Spring Boot at `http://localhost:8080`, so the browser does not need a separate API URL or CORS setup for local development. The backend uses a persistent H2 database by default; MySQL is optional.

## Requirements for Windows

Install these once:

- **Visual Studio Code**
- **Node.js 22 LTS** (or Node 20.19+)
- **JDK 17**
- **Apache Maven 3.9+**

After installing, open a new PowerShell window and confirm `node --version`, `npm --version`, `java -version`, and `mvn -version` work. In VS Code, install the recommended **Extension Pack for Java** if you want Java navigation and debugging.

## Run it in VS Code (Windows)

1. Extract the ZIP, then open the extracted **`student-portal`** folder in VS Code (`File → Open Folder`). Do not open only `frontend` or only `backend`.
2. Open a VS Code terminal in the project root. Create local environment files from the supplied templates (the commands are safe to run again):

   ```powershell
   if (!(Test-Path .\backend\.env)) { Copy-Item .\backend\.env.example .\backend\.env }
   if (!(Test-Path .\frontend\.env)) { Copy-Item .\frontend\.env.example .\frontend\.env }
   ```

3. **Terminal 1 — install/start the backend:**

   ```powershell
   cd .\backend
   mvn dependency:resolve
   mvn spring-boot:run
   ```

   The API starts on `http://localhost:8080`. On the first start, the backend creates its tables and seeds demo colleges and accounts. Keep this terminal open.

4. **Terminal 2 — install/start the frontend:**

   ```powershell
   cd .\frontend
   npm ci
   npm run dev
   ```

   Open the URL printed by Vite, normally **http://localhost:5173**. Keep this terminal open too. Start the backend before trying login, registration, or server-backed saves.

5. To stop either server, focus its terminal and press **Ctrl+C**.

### VS Code tasks

Use **Terminal → Run Task** and choose `Backend: Spring Boot (8080)` and `Frontend: Vite (5173)` to launch each server from VS Code. They run in separate terminals; start both.

## API and database configuration

- Frontend configuration: `frontend/.env.example` (`VITE_API_BASE_URL=/api`). Keep the relative `/api` URL when using the Vite proxy.
- Backend configuration: `backend/.env.example` (port, database URL/credentials, JWT secret and H2 console setting). Copy it to `backend/.env` before starting.
- Default database: **H2 file database**, stored under `backend/data/tn_colleges.mv.db`; no separate database installation is required. H2 console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/tn_colleges`, user `sa`, blank password by default).
- To use MySQL instead, create a database, then set `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, and `DB_DRIVER=com.mysql.cj.jdbc.Driver` in `backend/.env`. Example URL: `jdbc:mysql://localhost:3306/tn_colleges?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC`.
- `APP_JWT_SECRET` in the example is a **development-only** secret. Generate a new secret and update `.env` before any deployment. Never commit `.env` or production credentials.
- Health check: `http://localhost:8080/api/health`.

### Seeded development logins

Use the seeded accounts only for local development; change/remove them before deployment.

| Role | Email / username | Password |
|---|---|---|
| Student | `demo.student@tncolleges.in` | `demo1234` |
| College admin (PSG Tech) | `admin@psgtech.ac.in` or `psg_admin` | `psg123` |
| Platform admin | `admin@tncolleges.in` or `platform_admin` | `admin1234` |
| Super admin | `superadmin@tncolleges.com` or `superadmin` | `superadmin123` |

New student and college-admin registrations are stored in the backend when it is running. Saved/compare lists, enquiries, student profile updates, college CMS sections, and activity events use the API; the frontend also keeps local browser data for offline/demo continuity. College public content is served from the API after it is saved/published through the college admin workflow.

## Useful commands

```powershell
# Frontend tests and production build
cd .\frontend
npm test
npm run build

# Backend compile/package (requires Java 17 and Maven)
cd ..\backend
mvn clean verify
```

The production frontend output is generated in `frontend/dist/`. Do not copy `node_modules`, `dist`, Maven `target`, local `.env` files, H2 database files, or log files into a source ZIP.

## Troubleshooting

- **Port 8080 is already in use:** stop the other backend, or set `SERVER_PORT=8081` in `backend/.env` and update `frontend/vite.config.js` proxy target to match.
- **Port 5173 is already in use:** Vite prints an alternate URL; open that URL. The API proxy still targets the backend configured in `frontend/vite.config.js`.
- **Login says the API is unavailable:** confirm the backend terminal is running and `http://localhost:8080/api/health` returns `{"status":"UP",...}`. Also check `frontend/vite.config.js` proxy target.
- **A stale local H2 schema causes errors after pulling a database/model change:** stop the backend, back up and remove `backend/data/tn_colleges.mv.db` plus its companion trace/lock files, then restart. This resets local demo data; do not do this if you need to preserve it.
