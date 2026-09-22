# Tamil Nadu College Discovery Platform

> **"One platform that hosts thousands of beautiful, individual college websites."**

A premium, modern, responsive platform where every college feels like its own official website — while sharing the same underlying technology, database, security and CMS.

**Live Preview:** Frontend runs on Vite + React, Backend on Spring Boot.

---

## 🌟 Core Concept

This is **NOT** a simple college listing website.

```
Our Platform
 ├── PSG College of Technology (psg-tech) - Engineering Blue theme
 ├── PSG College of Arts & Science (psg-cas) - Heritage Maroon theme
 ├── Coimbatore Institute of Technology (cit) - Royal Purple theme
 ├── Kumaraguru College (kct) - Forest Green theme
 ├── Sri Krishna Arts (skasc) - Corporate Slate theme
 ├── Coimbatore Medical College (cmc) - Healthcare Teal theme
 └── Thousands of Colleges...
```

- **Platform controls:** UI framework, component system, security, database, responsive behavior, design system, templates, CMS functionality
- **Each college controls:** logo, name, tagline, colours, campus images, about, management, departments, courses, admissions, examinations, research, campus info, facilities, hostel, library, sports, placements, alumni, careers, IIC, events, gallery, announcements, contact, help desk, social media, documents, videos, custom sections

A student visiting `/college/psg-tech` feels like visiting PSG Tech's own website. Visiting `/college/cit` feels like CIT's own website. Behind the scenes — same platform, same backend, same database, same CMS.

---

## 🎨 Design System

### Premium Academic Styling
- Modern typography: Fraunces (display) + Plus Jakarta Sans (body) + Instrument Serif (accent)
- Spacious layouts, premium cards, subtle shadows, rounded corners (20-28px)
- Elegant animations, large campus photography, clean navigation
- Mobile-first responsive, accessible UI
- No generic dashboard look — each college feels independent

### College Branding System
Each college configures:
- Logo, Favicon, College Name, Short Name, Tagline
- Primary, Secondary, Accent colours
- Hero Image, Cover Image
- Typography option, Header style, Footer style, Card style, Button style, Homepage layout

**Theme Presets:**
- `engineering_blue` - Academic Blue, modern layout, research focused
- `arts_maroon` - Elegant maroon/gold, cultural layout (Heritage)
- `corporate_slate` - Modern corporate for B-schools
- `medical_teal` - Clean blue/green healthcare layout
- `royal_purple` - Prestigious university feel
- `forest_green` - Natural, grounded, sustainable (KCT style)

Colleges select a preset and customise approved fields. **No arbitrary CSS/JS allowed** — platform enforces design system integrity.

---

## 🏗️ Architecture

### Frontend: React + Vite + Tailwind CSS v4
```
frontend/
├── src/
│   ├── lib/
│   │   ├── colleges.js      # Mock database with 6 colleges full data
│   │   └── theme.js         # Theme presets & branding system
│   ├── components/
│   │   ├── ui/              # Premium Button, Badge etc
│   │   ├── platform/        # PlatformHeader, CollegeCard, Search
│   │   └── college/         # CollegeHeader, Hero, Sections
│   ├── pages/
│   │   ├── platform/        # Home (discovery), Search, Compare
│   │   ├── college/         # CollegePage - dynamic individual website
│   │   └── admin/           # College Admin CMS Dashboard
│   └── App.jsx              # Routing
```

**Key Features:**
- **Platform Home:** Hero with search, stats, featured colleges, how-it-works, premium college cards
- **College Website Renderer:** Applies `college.branding` CSS variables → unique identity
  - Header: Top bar with contact, main header with logo + dynamic mega menu (hides empty sections)
  - Hero: Full-bleed campus image, logo, verified badge, Explore/Admissions buttons, principal card
  - Quick Info: 6 cards (courses, depts, faculty, placement, campus, accreditation)
  - Dynamic sections: About, Departments, Courses, Facilities, Announcements, Events, Gallery, Custom Centres, Contact, Similar Colleges
  - Footer: Platform design, college content, subtle "Powered by" branding
- **College Discovery:** Search colleges/courses, filter by district/type/level, save, compare, enquire
- **Admin Dashboard:** Sidebar with all CMS modules, profile completion, preview, drag-drop section ordering, branding editor with theme presets, verification workflow

### Backend: Spring Boot 3.2 + MySQL + Spring Security + JWT
```
backend/
├── src/main/java/com/tncolleges/platform/
│   ├── model/               # Full data model with college_id FK
│   │   ├── College, CollegeProfile, CollegeBranding
│   │   ├── Department, Course, Faculty
│   │   ├── Management, CollegeSection, CustomSection
│   │   ├── Event, Announcement, Gallery
│   │   ├── Contact, Career, Enquiry, Favorite, User
│   ├── repository/          # JPA repositories
│   ├── security/            # JWT, RBAC, Multi-tenant filter
│   ├── controller/          # REST APIs
│   │   ├── CollegeController - public college APIs
│   │   ├── SearchController - search across colleges/courses
│   │   ├── AuthController - login/register with JWT + college_id
│   │   └── AdminController - multi-tenant secured CMS
│   └── config/              # DataInitializer with seed colleges
```

**Multi-Tenant Security (Critical):**
- Every college-specific table has `college_id` FK
- Example: PSG Tech = college_id 101, CIT = 102, KCT = 103
- PSG admin (header `X-College-Id: 101`) can ONLY manage 101 — enforced in AdminController
- CIT admin attempting to access 101 → 403 Forbidden
- Roles: SUPER_ADMIN, COLLEGE_ADMIN, COLLEGE_EDITOR, STUDENT, PARENT, PUBLIC_USER
- JWT includes `collegeId` and `role` claims
- Frontend sends `X-College-Id` + `X-User-Role` headers, backend validates

**Verification System:**
- Statuses: PENDING, UNDER_REVIEW, VERIFIED, REJECTED, NEEDS_CHANGES
- Workflow: Save Draft → Preview (looks exactly like public site) → Submit for Verification → Platform Admin Review → Publish
- Badges: "Verified College", "College Provided", "Last Updated"

---

## 📚 Complete Feature Coverage (as per spec)

### College Website Sections
- [x] Header with dynamic navigation (hides empty), mega menus, verified badge
- [x] Home: Hero with campus image, quick info cards, dynamic sections (only show if content exists)
- [x] About Us: About, History, Vision, Mission, Management, Governing Council, Principal Message etc — admin can add/edit/delete/reorder
- [x] Academics: Programmes, Departments (individual pages), Courses, Faculty, HODs, Calendar, Library, Labs, Research
- [x] Courses: Dynamic CRUD, search across all colleges, filters, compare, save, enquire
- [x] Admissions: Dynamic 2026, UG/PG, eligibility, process, dates, fees, docs, FAQs, Last Updated
- [x] Examinations: Controller, notifications, timetable, results, revaluation etc
- [x] Research: Centres, publications, patents, funded projects, PhD
- [x] Accreditation: NAAC, NBA, NIRF year-wise documents
- [x] Campus: Overview, Map, Infrastructure, Hostel, Sports, etc + Virtual Tour
- [x] Students, Parents, Alumni, Careers (job postings), IIC, Library
- [x] Events: Categories (Technical, Cultural, Sports, Workshop...), poster, gallery, registration
- [x] Gallery: Albums (Campus, Buildings, Departments...), image upload, video links
- [x] Announcements: Category, expiry, attachment, urgent flag
- [x] Contact: Multiple offices with person, designation, email, phone, timing
- [x] Help Desk: Structured queries (Fee, Exam, Scholarship...), Call/Email/WhatsApp/Enquire
- [x] Footer: Platform design, college content, address, social, map, subtle platform branding

### College Admin CMS
- [x] Dashboard: Profile completion, preview, pending/published, enquiries, views
- [x] Sidebar: All modules listed in spec
- [x] Content Builder: + Add Section (About, Text, Image, Gallery, Dept, Course, Faculty, Event...), Add/Edit/Delete/Reorder/Draft/Preview/Publish, drag-drop
- [x] Custom Sections: + Add Custom Section (e.g., "Centre for Foreign Languages") → auto appears on site
- [x] Branding Editor: Logo, colours, hero image, theme presets, typography, header/footer/card/button styles, homepage layout
- [x] Preview: Looks exactly like public website

### Student Platform
- [x] Search colleges, courses, filter by district/type, view college websites, save, compare, enquire, view events, nearby/similar colleges
- [x] Search "BCA" shows College, Course, District, College type, Course details, Compare, Save, Enquire
- [x] Similar Colleges, Nearby Colleges, Other Colleges Offering This Course, Recently Viewed

---

## 🚀 Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

### Backend
```bash
cd backend
# Requires Java 17, Maven
# For dev: uses H2 in-memory (no MySQL needed)
# For prod: configure MySQL in application.yml
mvn spring-boot:run
# http://localhost:8080
# H2 console: http://localhost:8080/h2-console
```

**Seed Users:**
- Super Admin: superadmin@tncolleges.com / superadmin123
- PSG Tech Admin (college_id 1): admin@psgtech.ac.in / psg123
- CIT Admin (college_id 2): admin@cit.edu.in / cit123
- KCT Admin (college_id 3): admin@kct.ac.in / kct123
- Student: student@test.com / student123

---

## 🔐 API Endpoints

```
Public:
GET  /api/colleges?search=&district=&type=
GET  /api/colleges/{slug}
GET  /api/colleges/{slug}/courses
GET  /api/search?q=BCA
GET  /api/search/courses?q=BCA

Auth:
POST /api/auth/register {email, password, fullName, role, collegeId}
POST /api/auth/login {email, password} -> {token, role, collegeId}

Admin (JWT + X-College-Id + X-User-Role headers, RBAC enforced):
GET  /api/admin/college/{collegeId}
PUT  /api/admin/college/{collegeId}/branding
POST /api/admin/college/{collegeId}/courses
GET  /api/admin/analytics/{collegeId}
```

Multi-tenant check: If `X-College-Id: 101` tries to access `/api/admin/college/102` → 403.

---

## 🎯 Premium UI Highlights

- **College Cards:** Cover image with gradient, logo overlap, verified badge, stats, accent line, hover lift & shadow
- **College Hero:** Full-bleed image with double gradient, principal message card with glassmorphism, stats bar
- **Platform Home:** Radial gradients, blur orbs, search bar with focus states, filter pills, stats
- **Admin Dashboard:** 300px sidebar, sticky top bar, drag handles, status badges, preview CTA
- **Responsive:** Mobile-first, hamburger menu, stacked grids, touch-friendly

---

## 📦 Project Structure
```
Admission-/
├── frontend/          # React + Vite premium UI
├── backend/           # Spring Boot multi-tenant API
└── README.md
```

---

## 💡 Philosophy

> Platform is COMMON. Technology is COMMON. Database is COMMON. CMS is COMMON. But public-facing college experience must feel INDIVIDUAL.

PSG Tech should look like PSG Tech. CIT should look like CIT. KCT should look like KCT. Each college has unique visual identity without breaking website using custom CSS/code.

**Tamil Nadu College Discovery Platform — 2026**
