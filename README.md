# 🎓 KalviPortal — Tamil Nadu Education Research Portal

Oru **complete** education research portal:

**Sign Up (ooru + level)** → **Home** → **10th / 12th / PG** → **Courses** → **Colleges (unga ooru FIRST!)** → **Campus pages** → **Google Maps + Reviews**

🌐 Full **Tamil / English** support — default **தமிழ்**! · 🔴🟠🟡 Rich warm red-orange-yellow design

---

## 🚀 Epdi run pannurathu?

Terminal open panni:

```bash
python3 -m http.server 8080
```

Browser la: **http://localhost:8080**
(Or just `index.html` ah double-click panni open pannalam!)

---

## 📁 File Structure — step by step

```
Admission-/
│
├── index.html               👉 PAGE 1 — Sign Up / Sign In
│                               name, email, password, ooru, level
│                               (top-right la language toggle!)
│
├── home.html                👉 PAGE 2 — Home dashboard
│                               • 10th / 12th / PG cards
│                               • Unga ooru colleges FIRST
│                               • Featured 3 campuses
│                               • City-wise strip
│                               • Course Finder Quiz
│
├── courses.html             👉 PAGE 3 — Course guide
│                               ?level=10 / ?level=12 / ?level=pg
│                               (duration, eligibility, jobs, colleges link)
│
├── colleges.html            👉 PAGE 4 — All colleges directory
│                               search, city filter, category filter,
│                               favourites ❤️, compare ⚖️ (up to 3)
│
├── anna-university.html     🟥 Featured #1 — RED theme (split hero UI)
├── iit-madras.html          🟧 Featured #2 — ORANGE theme (full hero UI)
├── loyola-college.html      🟨 Featured #3 — YELLOW theme (center hero UI)
│
├── css/
│   └── style.css            🎨 Full design — rich gradients, bold fonts,
│                               dark mode, animations, lang toggle style
│
├── js/
│   ├── data.js              💾 DATABASE — colleges, courses (Tamil+English),
│   │                          reviews, events. Ethu add pannalum INGA dhaan!
│   ├── i18n.js              🌐 LANGUAGE SYSTEM — 150+ strings in Tamil &
│   │                          English dictionaries
│   ├── app.js               ⚙️ Common — navbar, footer, reviews, favourites,
│   │                          compare, dark mode, toasts
│   ├── auth.js              🔐 Signup / Sign In logic
│   ├── home.js              🏠 Home page logic
│   ├── courses.js           📖 Courses page logic
│   ├── colleges.js          🏫 Colleges page logic
│   └── college.js           🎓 Featured campus pages shared logic
│
└── images/                  🖼️ AI-generated warm-tone images
    ├── hero.jpg             → Home + login hero
    ├── college-red.jpg      → Anna University
    ├── college-orange.jpg   → IIT Madras
    ├── college-yellow.jpg   → Loyola College
    ├── events.jpg           → Cultural fest / events
    └── campus-life.jpg      → Library / campus life
```

---

## ✨ Full Features List

| # | Feature | Detail |
|---|---------|--------|
| 1 | 🌐 Language toggle | Navbar la தமிழ் / English — touch panna full site maarum. Default = தமிழ் |
| 2 | 🔐 Auth | Signup la ooru + level keypadangal; data browser localStorage la save |
| 3 | 📍 Ooru priority | Signup la sonna ooru colleges ellaa pages layum FIRST |
| 4 | 🏫 Directory | 25 colleges, 9 TN cities, 4 categories |
| 5 | 📖 Courses | 32 courses — 10th/12th/PG wise, Tamil la descriptions & jobs |
| 6 | 🧭 Quiz | Course Finder Quiz — 3 questions, instant suggestion |
| 7 | ⚖️ Compare | Up to 3 colleges side-by-side (fees, rating, seats...) |
| 8 | ❤️ Favourites | Colleges save pannalam, "Saved only" filter |
| 9 | ⭐ Reviews | Read + add reviews (localStorage la save) |
| 10 | 🗺️ Maps | Every college ku Google Maps embed + directions (no API key!) |
| 11 | 🌙 Dark mode | Toggle button navbar la |
| 12 | 📱 Responsive | Mobile / tablet / desktop full ah work aagum |

---

## 🌐 Language system epdi work aagudhu?

- `js/i18n.js` la `en:{}` & `ta:{}` dictionaries irukku.
- HTML la `data-i18n="key"` vecha element automatic ah translate aagum.
- JS-rendered content (cards, modals) `t("key")` use pannum.
- Toggle touch panna → `setLang()` → localStorage save → page reload.
- **Pudhu text add pannum pothu `en` & `ta` rendu la um add pannunga!**

City names Tamil la automatically maarum: Chennai → சென்னை, Coimbatore → கோயம்புத்தூர்...

---

## ➕ Pudhu college epdi add pannurathu?

`js/data.js` → `COLLEGES` array la oru object add pannunga:

```js
{id:"my-college", name:"My College", city:"Chennai", category:"Engineering",
 founded:2000, rating:4.5, reviewsCount:100, seats:"500", fee:"₹50,000 / year",
 img:"images/college-red.jpg", map:"My College, Chennai",
 tags:["BE CSE","BE ECE"],
 oneLiner:"English description here!",
 ta:"இங்கே தமிழ் விளக்கம் எழுதுங்கள்!"},
```

Avlo dhaan — colleges page la automatic ah varum! 🎉

---

Made with ❤️ for Tamil Nadu students · KalviPortal © 2026
