# 🎓 AdmissionPortal

A college admission portal with a **home page**, **login**, **signup** and a
**dashboard** — built with plain HTML/CSS/JS on the front end and a
**zero-dependency Node.js** server on the back end.

## Features

- 🏠 **Home page** — hero, courses, stats, why-us, contact sections
- 📝 **Sign up** — name, email, phone, password with validation (client + server)
- 🔐 **Login / Logout** — session cookie auth (HttpOnly, 7 days)
- 👤 **Dashboard** — protected page showing the user's profile and admission steps
- 🔒 **Secure** — passwords hashed with `scrypt`, sessions stored in SQLite

## Requirements

- **Node.js 22+** (uses the built-in `node:sqlite` module — no npm install needed)

## Run

```bash
npm start        # or: node server.js
```

Then open **http://localhost:3000**

## Project structure

```
├── server.js            # HTTP server + auth API (signup/login/logout/me)
├── db.js                # SQLite setup (users + sessions tables)
├── data/                # runtime database (auto-created, git-ignored)
└── public/
    ├── index.html       # home page
    ├── login.html       # login page
    ├── signup.html      # sign up page
    ├── dashboard.html   # protected dashboard
    ├── css/style.css    # shared styles
    ├── js/              # page scripts (auth, navbar, dashboard)
    └── images/          # hero illustration
```

## API

| Method | Route          | Description                          |
| ------ | -------------- | ------------------------------------ |
| POST   | `/api/signup`  | Create account → logs the user in    |
| POST   | `/api/login`   | Log in (sets session cookie)         |
| POST   | `/api/logout`  | Log out                              |
| GET    | `/api/me`      | Current user (`ok: false` if guest)  |

`GET /dashboard.html` redirects to the login page when there is no session.
