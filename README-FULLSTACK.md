# KalviPortal — Full-Stack (Spring Boot + React + MySQL)

Tamil Nadu education research portal — 155+ colleges, 38 districts atlas,
reviews, favourites, bilingual (Tamil default / English).

```
Admission-/
├── backend/    → Spring Boot 3 REST API (port 8085) + MySQL
├── frontend/   → React 18 (Vite, port 5173)
├── images/     → campus images (served by backend at /images/**)
├── *.html      → legacy static version (still works standalone)
└── js/, css/   → legacy static version files
```

## 1️⃣ Install (one time)

| Tool | Where |
|---|---|
| **JDK 17** | https://adoptium.net → LTS 17 → install (tick "set JAVA_HOME") |
| **Maven** | https://maven.apache.org/download.cgi → extract → add `bin` to PATH |
| **MySQL 8** | https://dev.mysql.com/downloads/installer → install (remember root password) |
| **Node 18+** | https://nodejs.org → LTS |
| **VS Code** | https://code.visualstudio.com |

## 2️⃣ MySQL database

Open **MySQL Command Line** (or Workbench) and run:

```sql
CREATE DATABASE kalviportal;
```

If your MySQL root password is **not** `root`, edit
`backend/src/main/resources/application.properties`:

```
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

(Tables + 155 colleges + 38 district stats are created & seeded
automatically on first backend start.)

## 3️⃣ Run backend (terminal 1)

```
cd backend
mvn spring-boot:run
```

First run downloads dependencies (~2 min). You should see
`Started KalviApplication` — API is at `http://localhost:8085`.

## 4️⃣ Run frontend (terminal 2)

```
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** → Sign Up → explore! 🎉

## API quick test

```
http://localhost:8085/api/colleges?city=Coimbatore
http://localhost:8085/api/stats/districts
```

## Notes
- JWT auth: signup/login return a token; reviews & favourites need login.
- Legacy static site still runs from the repo root (`python -m http.server 8080` or Live Server).
