# 🎓 Student Portal

An online student registration portal — students sign up / log in, enter their
**personal details** and **academic details**, **upload certificates** and
**register online** to get an instant registration number.

Built with plain HTML/CSS/JS on the front end and a **zero-dependency Node.js**
server on the back end (SQLite via Node 22's built-in `node:sqlite` module).

## Features

- 🏠 **Home page** — hero, how-it-works, courses, stats, contact
- 📝 **Sign up** — name, email, phone, password (client + server validation)
- 🔐 **Login / Logout** — session cookie auth (HttpOnly, 7 days)
- 🧙 **Registration wizard (dashboard)**
  1. **Personal details** — name, DOB, community, address, parent details …
  2. **Academic details** — qualifying exam, board, school, marks …
  3. **Certificate upload** — photo, TC, marksheet (PDF/JPG/PNG, max 5 MB each)
  4. **Review & register** — confirm and submit → registration number (e.g. `SP2026-0001`)
- 🔒 **Secure** — scrypt password hashing, session tokens in SQLite, protected routes

## Requirements

- **Node.js 22+** (uses the built-in `node:sqlite` module — no npm install needed)

## Run

```bash
npm start        # or: node server.js
```

Then open **http://localhost:3000**

### Run in VS Code

1. Install [Node.js 22+](https://nodejs.org) and [VS Code](https://code.visualstudio.com)
2. Open the project folder in VS Code (**File → Open Folder**)
3. Open the terminal (`` Ctrl+` ``)
4. Run `npm start` — no `npm install` needed!
5. Open http://localhost:3000 in your browser

## Project structure

```
├── server.js            # HTTP server + auth & registration API
├── db.js                # SQLite setup (users, sessions, applications)
├── data/                # runtime DB + uploads (auto-created, git-ignored)
└── public/
    ├── index.html       # home page
    ├── login.html       # login page
    ├── signup.html      # sign up page
    ├── dashboard.html   # registration wizard (protected)
    ├── css/style.css    # premium beige/navy/gold design system
    ├── js/              # page scripts (auth, navbar, wizard)
    └── images/          # hero illustration
```

## API

| Method | Route                            | Description                              |
| ------ | -------------------------------- | ---------------------------------------- |
| POST   | `/api/signup`                    | Create account → logs the user in        |
| POST   | `/api/login`                     | Log in (sets session cookie)             |
| POST   | `/api/logout`                    | Log out                                  |
| GET    | `/api/me`                        | Current user (`ok: false` if guest)      |
| GET    | `/api/application`               | Full application + progress (login req.) |
| POST   | `/api/application/personal`      | Save personal details                    |
| POST   | `/api/application/academic`      | Save academic details                    |
| POST   | `/api/application/certificates`  | Upload certificates (multipart)          |
| POST   | `/api/application/register`      | Final submit → registration number       |

`GET /dashboard.html` redirects to the login page when there is no session.
