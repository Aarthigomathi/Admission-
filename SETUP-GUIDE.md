# 📋 Step-by-Step Setup Guide
### New Branch → Backend with Data → Frontend — on your own computer

This guide is written specifically for this repository (**Tamil Nadu College Discovery Platform**).

| Part | Technology | Folder | Port |
|---|---|---|---|
| Backend | Spring Boot 3.2.5 (Java 17) + H2/MySQL | `backend/` | 8080 |
| Frontend | React 19 + Vite + Tailwind CSS | `frontend/` | 5173 |

---

## Step 0 — Install the required tools (one time only)

Run each command in your terminal. If a command prints a version, that tool is already installed.

| Tool | Check command | Get it from | Needed for |
|---|---|---|---|
| Git | `git --version` | [git-scm.com](https://git-scm.com) | Branches & cloning |
| Java JDK **17+** | `java -version` | [adoptium.net](https://adoptium.net) (Temurin 17) | Backend |
| Maven **3.8+** | `mvn -version` | [maven.apache.org/download](https://maven.apache.org/download.cgi) | Backend |
| Node.js **18+** | `node -v` | [nodejs.org](https://nodejs.org) | Frontend |

> 💡 **Windows users:** use *Git Bash* (comes with Git) or *PowerShell* for all commands.
> 💡 **Alternative to Maven:** you can skip installing Maven and run the backend from **IntelliJ IDEA** (free Community edition) — open the `backend` folder and click ▶ on `PlatformApplication`.

---

## Step 1 — Clone the repository (this downloads the backend AND frontend)

```bash
git clone https://github.com/Aarthigomathi/Admission-.git
cd Admission-
```

✅ **Check:** run `ls` (Mac/Linux) or `dir` (Windows). You should see `backend/` and `frontend/` folders.

> Cloning copies the **whole repository** — backend code, frontend code, and all history — to your computer.

---

## Step 2 — Create your new branch

```bash
# Start from the latest main branch
git switch main
git pull origin main

# Create AND switch to your new branch (choose a meaningful name)
git switch -c feature/backend-updates
```

✅ **Check:** `git branch` — your new branch has a `*` next to it.

### 🎯 Important concept — you do NOT need to copy the backend manually

A Git branch is **already a full independent copy of everything** — backend + frontend.

- Your new branch contains the complete backend. Change any file in `backend/` freely.
- Nothing you do on this branch affects `main` until you merge it.
- Others can work on `main` (or their own branches) without touching your work.

So "cloning the backend into a new branch" happens **automatically** the moment you create the branch. 🙂

---

## Step 3 — Run the backend (its data loads automatically)

Open a terminal **in the repository folder**:

```bash
cd backend
mvn spring-boot:run
```

- The **first run downloads dependencies** — this takes a few minutes. Wait for:
  `Started PlatformApplication in x.xxx seconds`
- The database needs **no setup**: for development the backend uses an **H2 in-memory database**, and `DataInitializer.java` **automatically inserts sample data** (PSG College of Technology, Coimbatore Institute of Technology, courses, users) on every startup.

✅ **Check the data** — open this URL in your browser:

```
http://localhost:8080/api/colleges
```

You should see JSON with the list of seeded colleges. 🎉

<details>
<summary>🔎 Useful backend URLs (click to expand)</summary>

| URL | What it shows |
|---|---|
| `http://localhost:8080/api/colleges` | All colleges (public) |
| `http://localhost:8080/api/colleges/psg-tech` | One college by slug |
| `http://localhost:8080/api/colleges/psg-tech/courses` | Courses of a college |
| `http://localhost:8080/h2-console` | Database browser |

For the H2 console: JDBC URL = `jdbc:h2:mem:tn_colleges`, User = `sa`, Password = *(empty)*.
</details>

> ⚠️ **Data resets on every restart** — that is normal. H2 is *in-memory* (dev mode). To keep data permanently, switch to MySQL by editing `backend/src/main/resources/application.yml` (the MySQL lines are there, commented out — swap the comments).
>
> ⚠️ **IntelliJ users:** File → Open → select the `backend` folder → wait for import → run `PlatformApplication`.

**Keep this terminal open.** The backend must keep running while you use the frontend.

---

## Step 4 — Run the existing frontend

Open a **second terminal** (leave the backend running in the first one):

```bash
cd Admission-
cd frontend
npm install      # first time only — downloads React, Vite, Tailwind, etc.
npm run dev
```

✅ **Check:** Vite prints

```
VITE v8.3.0  ready in xxx ms
➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser — your app is running. 🎉

> 💡 This repo also has a duplicate copy of the frontend at the **root** (`src/`, `package.json`). Use the **`frontend/` folder** — it is the organised one.

---

## Step 5 — (When you're ready) Connect the frontend to the backend

Right now the frontend uses **mock data** from files in `frontend/src/lib/` (e.g. `colleges.js`, `collegeStorage.js`). To show **real backend data**, fetch it from the API.

**Option A — call the backend directly** (works immediately, backend already allows it):

```jsx
import { useState, useEffect } from "react";

export default function CollegeList() {
  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/colleges")
      .then((res) => res.json())
      .then((data) => setColleges(data))
      .catch((err) => console.error("Backend not reachable:", err));
  }, []);

  return (
    <ul>
      {colleges.map((c) => <li key={c.id}>{c.name}</li>)}
    </ul>
  );
}
```

**Option B — cleaner, use a Vite proxy** so you write `fetch("/api/colleges")`:

Add this inside `server: { }` in `frontend/vite.config.js`:

```js
proxy: {
  "/api": "http://localhost:8080",
},
```

Full example:

```js
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
    proxy: {
      "/api": "http://localhost:8080",
    },
    headers: { "X-Frame-Options": "ALLOWALL" },
  },
})
```

Then restart `npm run dev`.

**Login example (JWT):** `POST http://localhost:8080/api/auth/login` returns a token — attach it as a header for protected endpoints:

```js
fetch("http://localhost:8080/api/admin/my-college", {
  headers: { Authorization: `Bearer ${token}` },
});
```

---

## Step 6 — Save your work (commit & push)

While working on your branch:

```bash
git status                        # see what changed
git add .                         # stage all changes (or: git add <file>)
git commit -m "Describe what you changed"
git push -u origin feature/backend-updates   # first push only
```

After the first push, later pushes are just `git push`.

---

## Step 7 — Open a Pull Request (merge into main)

1. Push your branch (Step 6).
2. Go to **https://github.com/Aarthigomathi/Admission-** — GitHub shows a **"Compare & pull request"** button for your branch.
3. Click it, write a description, and create the PR.
4. When it's reviewed/approved, click **"Merge pull request"** — your backend/frontend changes land in `main`.

*(Or from the terminal: `gh pr create` if you have the GitHub CLI installed.)*

---

## 🔁 Your daily workflow (quick reference)

```bash
git switch feature/backend-updates   # go to your branch
git pull origin main                 # stay up to date with teammates

# Terminal 1                          # Terminal 2
cd backend                           cd frontend
mvn spring-boot:run                  npm run dev
# → http://localhost:8080            # → http://localhost:5173

# ...make changes...
git add . && git commit -m "message" && git push
```

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| `'mvn' is not recognized` / `command not found` | Install Maven, or run the backend from IntelliJ IDEA |
| `Unsupported class file major version` / Java errors | You need **JDK 17+** — check `java -version` |
| `Port 8080 was already in use` | Another app uses 8080. Close it, or change `server.port` in `backend/src/main/resources/application.yml` |
| Backend data is gone after restart | Normal — H2 in-memory resets. Switch to MySQL config in `application.yml` for permanent data |
| `npm: command not found` | Install Node.js 18+ from nodejs.org |
| `npm install` fails with weird errors | Delete `node_modules` and `package-lock.json` in `frontend/`, then `npm install` again |
| Page loads but no data / network error | The backend isn't running. Start it first (Step 3), then refresh |
| `git push` rejected | Run `git pull origin main`, resolve conflicts if any, then push again |
| Login returns 401/403 | Those endpoints need a valid JWT token (see Step 5) — or you used wrong credentials |

---

## ✅ Final checklist

- [ ] Git, JDK 17, Maven, Node.js installed
- [ ] Repository cloned
- [ ] New branch created (`git switch -c <name>`)
- [ ] Backend runs → `http://localhost:8080/api/colleges` shows colleges
- [ ] Frontend runs → `http://localhost:5173` shows the app
- [ ] Changes committed & pushed to your branch
- [ ] Pull request opened to `main`
