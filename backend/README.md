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
- About/Profile CMS: `GET /api/colleges/{slug}/about-sections` returns published blocks on verified public sites. College admins use `GET /api/colleges/{id}/about-sections/manage`, `POST /api/colleges/{id}/about-sections`, `PUT /api/colleges/{id}/about-sections/{sectionId}`, `PATCH /api/colleges/{id}/about-sections/{sectionId}/publication`, and `DELETE /api/colleges/{id}/about-sections/{sectionId}`. Supported section keys: `PROFILE`, `VISION_MISSION`, `MANAGEMENT_PROFILE`, `ORGANIZATIONAL_STRUCTURE`, `CENTER_OF_EXCELLENCE`, `ACCREDITATIONS`, `PROGRAMMES`, `PLACEMENTS`. New blocks are drafts until explicitly published; all writes are tenant-scoped.
- Image media: `POST /api/colleges/{id}/media` accepts a multipart field named `file` (valid JPEG/PNG/WebP, up to 8 MB) and returns a media URL; `GET /api/media/{mediaId}` serves verified-college images publicly and draft images only to the owning college admin/platform admin. Admins can list/delete with `GET /api/colleges/{id}/media/manage` and `DELETE /api/colleges/{id}/media/{mediaId}`. Files are stored outside the database under `APP_MEDIA_STORAGE_DIR` (default `backend/data/college-media`).
- Department CMS: college admins use `GET/POST/PUT/DELETE /api/colleges/{id}/departments` to manage their own department directory, plus `GET/PUT /api/colleges/{id}/departments/{departmentId}/page` to manage each department page and `PATCH /api/colleges/{id}/departments/{departmentId}/page/publication` to publish/unpublish it. New departments/pages start as drafts; publishing a page also publishes the department in the public Academics list. Public clients use `GET /api/public/colleges/{slug}/departments` and `GET /api/public/colleges/{slug}/departments/{departmentId}/page`. Only active, published departments/pages from verified colleges are exposed. Deleting a department also deletes matching `deptPages[departmentId]`.
- Department pages support hero/about image and text, overview paragraphs, vision/mission, regulations and curriculum documents by year, courses offered, labs, PEO/PO/PSO outcomes, HOD profile/photo/biography, faculty intro/link and optional member profiles, smart classrooms, teaching-and-learning resources, and additional custom sections. Images/documents can use uploaded `/api/media/{id}` URLs; each department page is college-scoped and independently draft/published.
- AICTE IDEA Lab CMS: college admins use `GET/PUT /api/colleges/{id}/idea-lab` for drafts and `PATCH /api/colleges/{id}/idea-lab/publication` with `{"published":true}` when ready. Public clients use `GET /api/public/colleges/{slug}/idea-lab`; only verified colleges' published pages are returned. The persisted page supports lab logo/about paragraphs, vision, numbered mission cards, objectives, team groups (chief mentor, faculty coordinators, tech gurus, student ambassadors), and equipment cards with uploaded photos and optional links.
- Research CMS: college admins use `GET/PUT /api/colleges/{id}/research-page` and `PATCH /api/colleges/{id}/research-page/publication`; public clients use `GET /api/public/colleges/{slug}/research-page`. The page stores a Research Policy banner/link, overview rows with nested year breakdowns, committee members/institutions/department clusters, yearly journal/conference/book statistics, seed-money and project tables, and department-cluster research facilities with lab photos and equipment lists. Public tables can be paginated with `GET /api/public/colleges/{slug}/research-page/tables/{tableKey}?page=0&size=10`, where tableKey is `overview`, `committee`, `publications`, `seed-money`, or `projects`.
- IQAC CMS: college admins use `GET/PUT /api/colleges/{id}/iqac-page` and `PATCH /api/colleges/{id}/iqac-page/publication`; public clients use `GET /api/public/colleges/{slug}/iqac-page`. Public IQAC members support pagination via `GET /api/public/colleges/{slug}/iqac-page/members?page=0&size=10`. The `iqacPage` content includes `pageTitle`, `about` (`title`, `imageUrl`, `paragraphs`), `functions` (`title`, `items` with `icon`, `title`, `description`), `members` (`title`, `rows` with `serialNumber`, `name`, `designation`), `aqar` and `minutes` (`title`, `documents` with `year`, `title`, `url`), and `resources` (ordered cards with `title`, optional `description`/`icon`, and year-labelled `documents`). Resources can represent Feedback Analysis and Action Taken Report, Institutional Distinctiveness, Best Practices, Student Satisfaction Survey, NIRF Ranking, NAAC, Audit Report, Approvals, and Undertaking. Draft writes clear publication state; publication validates the required About, functions, and member content and constrains all URLs to HTTP(S) or college media paths. Only verified, active, registered colleges' published IQAC pages are available publicly; generic public content endpoints return an empty object for unpublished IQAC pages and generic writes are blocked in favor of these CMS routes.
- Campus Life CMS: admins use `GET/PUT /api/colleges/{id}/campus-life` and `PATCH /api/colleges/{id}/campus-life/publication`. Public clients use `GET /api/public/colleges/{slug}/campus-life` for the menu and published content, or `GET /api/public/colleges/{slug}/campus-life/pages/{pageSlug}` for one active page. The `campusLifePage` structure holds a customizable menu title and ordered navigation items, plus pages with an intro, optional hero image and quote banner, and ordered `feature`, `clubList`, `societyList`, `celebrationList`, `eventShowcase`, or `gallery` sections. Feature sections support text, highlights, and required images on publication; event showcases include image-backed event descriptions and metrics. College admins upload JPEG, PNG, or WebP images up to 8 MB with `POST /api/colleges/{id}/media` (multipart field `file`), then place the returned `url` (for example `/api/media/123`) into hero, feature, society-logo, event, celebration, or gallery image fields. Uploaded media references must belong to the same college. Configure menu labels and page titles in the CMS; no institution-specific menu items are prefilled. Drafts remain hidden through generic public content endpoints, and published pages are only available for verified, active, registered colleges.
- `PATCH /api/platform-admin/colleges/{id}/verify` — persist verification status and audit fields.
- `GET/POST/PUT/DELETE /api/admin/college/{id}/courses` — relational course admin API; course changes are also synced into college content JSON.

New colleges start with empty `departments` and `deptPages`, the `#1A3263 / #547792 / #FAB95B` brand palette, and the section keys documented in `CollegeContentService`. An explicit `registered` database flag defaults to false; signup is the path that marks a college registered. College, content, About/Profile, media, department, admin, and verification operations are scoped to registered colleges and checked against the signed-in user’s account.

An About block can be created as a draft with `{"sectionKey":"PROFILE","title":"College Profile","type":"RICH_TEXT","content":"College history and profile text","displayOrder":0}`. The Vision & Mission page supports structured `vision`, ordered `mission` bullet strings, and `coreValues` cards (`title`, `description`, optional safe icon name), plus editable headings. Example request body:

```json
{
  "sectionKey": "VISION_MISSION",
  "title": "Vision & Mission",
  "type": "STRUCTURED",
  "data": {
    "vision": "To become a leading institution through innovation and research.",
    "mission": ["Develop knowledgeable professionals.", "Work with industry on relevant research."],
    "coreValues": [
      {"title": "Excellence & Innovation", "description": "Encourage creative solutions.", "icon": "award"},
      {"title": "Integrity & Accountability", "description": "Uphold the highest ethical standards.", "icon": "shield-check"}
    ],
    "visionTitle": "Our Vision",
    "missionTitle": "Our Mission",
    "coreValuesTitle": "Core Values"
  },
  "displayOrder": 1
}
```

The response contains the same object under `data`; it is persisted in the college section record. Draft edits can be partial, but a structured Vision & Mission block must include vision text, at least one mission item, and at least one core value before it can be published.

For the Management Profile page, create a `MANAGEMENT_PROFILE` block with `data.profiles` as an ordered array. Each person supports `designation`, `name`, `biography` (plain text or an array of paragraphs), `imageUrl`, and `imagePosition` (`LEFT`, `RIGHT`, or `AUTO`); use the media upload API for college-managed portrait images. Example:

```json
{
  "sectionKey": "MANAGEMENT_PROFILE",
  "title": "Management Profile",
  "type": "STRUCTURED",
  "data": {
    "profiles": [
      {
        "designation": "CHAIRMAN",
        "name": "Dr. R. Vasanthakumar",
        "biography": ["Founder promoter and Chairman.", "A philanthropist and education leader."],
        "imageUrl": "/api/media/23",
        "imagePosition": "LEFT"
      },
      {
        "designation": "CHIEF EXECUTIVE OFFICER",
        "name": "Er. K. Murugaiah",
        "biography": ["Joined the Trust as Administrative Officer.", "Leads institutional development."],
        "imageUrl": "/api/media/24",
        "imagePosition": "RIGHT"
      }
    ]
  },
  "displayOrder": 2
}
```

Each management profile needs a designation, name, and biography before publishing. Images are optional; the client can alternate placement for `AUTO` or absent positions.

For the Center of Excellence reference page, `CENTER_OF_EXCELLENCE` structured data supports ordered `categories` containing partner logos, plus `featuredCenters` with descriptions, photos, and optional “Know More” links:

```json
{
  "sectionKey": "CENTER_OF_EXCELLENCE",
  "title": "Center of Excellence",
  "type": "STRUCTURED",
  "data": {
    "categories": [
      {
        "title": "Circuit Engineering",
        "partners": [
          {"name": "QNX", "logoUrl": "/api/media/31"},
          {"name": "HCLTech", "logoUrl": "/api/media/32"},
          {"name": "NI LabVIEW", "logoUrl": "/api/media/33"}
        ]
      },
      {
        "title": "Computing Sciences",
        "partners": [
          {"name": "Oracle Academy", "logoUrl": "/api/media/34", "linkUrl": "https://academy.oracle.com"}
        ]
      }
    ],
    "featuredCenters": [
      {
        "title": "Karpagam Innovation and Skill Development Centre",
        "description": ["Mentorship, funding guidance and incubation support.", "Startup workshops and prototype development."],
        "imageUrl": "/api/media/35",
        "linkLabel": "Know More",
        "linkUrl": "https://example.edu/innovation"
      }
    ]
  },
  "displayOrder": 3
}
```

Before publication, each category needs a title and at least one partner with a name and logo; featured centers need a title and description. Upload logos and photos through the college media API.

The `ACCREDITATIONS` section stores the accreditation cards, department-level coverage, MoUs/Centres of Excellence logo grid, and elective-industry partners in the same editable structured format. Example:

```json
{
  "sectionKey": "ACCREDITATIONS",
  "title": "Accreditations",
  "type": "STRUCTURED",
  "data": {
    "accreditations": [
      {
        "name": "NAAC (National Assessment And Accreditation Council)",
        "grade": "A+",
        "logoUrl": "/api/media/41",
        "description": "Accredited by NAAC with A+ Grade.",
        "linkLabel": "For more Information",
        "linkUrl": "https://example.edu/naac"
      },
      {
        "name": "NBA (National Board Of Accreditation)",
        "logoUrl": "/api/media/42",
        "description": "Accredited by NBA for the following departments:",
        "departments": ["Information Technology", "Mechanical Engineering", "Electronics and Communication Engineering"]
      }
    ],
    "recognitionStatement": "The College is accredited by companies like TCS and Wipro.",
    "partnershipsIntro": "We also have active MoUs & Centres of Excellence such as",
    "mousAndCenters": [
      {"name": "Infosys Campus Connect", "logoUrl": "/api/media/43"},
      {"name": "EMC Academic Alliance Centre", "logoUrl": "/api/media/44"}
    ],
    "electivesHeading": "Electives",
    "electivesDescription": "35+ industry collaborated electives in association with",
    "electivePartners": [
      {"name": "Zoho", "logoUrl": "/api/media/45"},
      {"name": "Accenture", "logoUrl": "/api/media/46"}
    ]
  },
  "displayOrder": 4
}
```

Each accreditation requires a name, logo, and description before publication. Partner/elective logo tiles require a name and logo; NBA department names are returned in the submitted order. Publish through the publication route with `{"published":true}` when complete. The public endpoint returns only published blocks, ordered by `displayOrder` and ID; drafts are never included.

A department must first be created under its college. It is created as a draft; then save a page draft with `PUT /api/colleges/{collegeId}/departments/{departmentId}/page` and publish it with `PATCH /api/colleges/{collegeId}/departments/{departmentId}/page/publication` and `{"published":true}`. Example department page payload:

```json
{
  "hero": {
    "title": "About the Department",
    "description": "The department overview and areas of study.",
    "imageUrl": "/api/media/61"
  },
  "overview": ["Department infrastructure and laboratories.", "Faculty research and industry collaboration."],
  "mission": {
    "title": "Our Mission",
    "items": ["Build strong technical knowledge.", "Develop socially responsible engineers."],
    "imageUrl": "/api/media/62"
  },
  "regulations": {"items": [{"year": "R2023", "title": "Regulations 2023", "documentUrl": "/api/media/63"}]},
  "coursesOffered": [{"name": "B.E. Civil Engineering", "level": "UG", "duration": "4 years"}],
  "laboratories": [{"name": "Strength of Materials Laboratory", "icon": "building"}],
  "outcomes": {
    "peos": [{"code": "PEO1", "description": "Solve civil engineering problems."}],
    "pos": [{"code": "PO1", "description": "Apply engineering knowledge."}],
    "psos": [{"code": "PSO1", "description": "Use civil design tools."}]
  },
  "hodProfile": {"name": "Dr. R. Lakshmi", "designation": "Professor & Head", "biography": ["Department head profile."], "photoUrl": "/api/media/64"},
  "faculty": {"intro": "Distinguished faculty with industry and research experience.", "linkLabel": "View Faculty", "linkUrl": "https://example.edu/faculty"},
  "smartClassRooms": [{"title": "Mechanics of Solids II", "linkUrl": "https://example.edu/classroom"}],
  "teachingAndLearning": [{"title": "Course Development Through YouTube and Blogs", "linkUrl": "https://example.edu/learning"}],
  "curriculum": {"items": [{"year": "R2023", "documentUrl": "/api/media/65"}]}
}
```

The saved draft is not public. Once published, the public directory and page are available under `/api/public/colleges/{slug}/departments` and `/api/public/colleges/{slug}/departments/{departmentId}/page`. Department deletion also removes that department's stored page content.

An AICTE IDEA Lab page is saved as a draft with `PUT /api/colleges/{collegeId}/idea-lab` and published separately. Its JSON fields are `aboutLab` (`logoUrl`, `paragraphs`), `vision`, ordered `missions` and `objectives` cards (`title`, `description`), `team` (`chiefMentor`, `facultyCoordinators`, `techGurus`, `studentAmbassadors`), and `infrastructure` (`eyebrow`, `title`, `description`, ordered `equipment` cards with `name`, `imageUrl`, optional `description`/`linkUrl`). Team profiles accept name, designation, department, college, email/phone, photo URL, and bio. A page cannot be published until it has the about copy and logo, vision, at least one mission and objective, a chief mentor, and at least one equipment item with an image. Public access is `GET /api/public/colleges/{slug}/idea-lab`.

A Research page draft can be saved with `PUT /api/colleges/{collegeId}/research-page`, then published through `/api/colleges/{collegeId}/research-page/publication`. For example, `overview` is `{ "title": "Research Overview", "rows": [{ "serialNumber": 1, "description": "No of Ph.D. Faculty Members", "details": 96 }, { "serialNumber": 3, "description": "Number of Ph.D.s Produced", "details": "-", "breakdown": [{ "period": "2023-2024", "details": 7 }] }] }`. The `publications.rows` entries contain `calendarYear`, `journalPublications`, `conferencePublications`, and `bookChapterPublications`; `seedMoney` and `researchProjects` rows contain `academicYear`, `projectCount`, and `amountInLakhs`. `researchCommittee.rows` contains member details, designation, institution, and department cluster. `researchFacilities.clusters` groups facility/lab cards and equipment items by department code. The public full page is available only after verification and publication, and large tables have page/size query parameters as documented above.

An IQAC draft can be saved through `PUT /api/colleges/{collegeId}/iqac-page` and published separately through `PATCH /api/colleges/{collegeId}/iqac-page/publication` with `{"published":true}`. A representative payload shape is:

```json
{
  "pageTitle": "IQAC",
  "about": {"title": "About IQAC", "imageUrl": "/api/media/91", "paragraphs": ["First paragraph", "Second paragraph"]},
  "functions": {"title": "Functions of the IQAC", "items": [{"icon": "quality", "title": "Quality benchmarks", "description": "Develop and apply benchmarks."}]},
  "members": {"title": "IQAC Members", "rows": [{"serialNumber": 1, "name": "Name", "designation": "Chairperson"}]},
  "aqar": {"title": "Annual Quality Assurance Report (AQAR)", "documents": [{"year": "2023-24", "title": "AQAR 2023-24", "url": "https://example.test/aqar.pdf"}]},
  "minutes": {"title": "Minutes of the Meeting", "documents": [{"year": "2023-24", "title": "Minutes 2023-24", "url": "https://example.test/minutes.pdf"}]},
  "resources": [{"title": "Feedback Analysis and Action Taken Report", "documents": [{"year": "2023-24", "title": "Feedback Analysis", "url": "https://example.test/feedback.pdf"}]}]
}
```

Images may use HTTP(S) URLs or `/api/media/` paths; linked documents must use HTTP(S) or `/api/media/` paths. About paragraphs, function cards, and at least one complete member row are required to publish. When provided, year-specific document links require a year, title, and URL. Public member pagination returns standard `page`, `size`, `totalElements`, `totalPages`, and `content` fields, with a maximum page size of 100.

Campus Life content is saved as one college-scoped draft so the navigation and linked pages can be reviewed and published together. For a clubs page, configure a navigation item such as `{ "title": "Campus Clubs", "slug": "campus-clubs", "active": true, "displayOrder": 0 }`, and a matching page with `slug`, `title`, `intro: { "title", "paragraphs": [] }`, optional `heroImageUrl` and `quoteBanner`, plus ordered `sections`. A feature section has `{ "type": "feature", "title", "paragraphs": [], "imageUrl", "imagePosition": "left|right|background", "highlights": [] }`; a clubs list uses `{ "type": "clubList", "title", "items": [{ "title", "category" }] }`; professional organizations use `{ "type": "societyList", "title", "items": [{ "name", "acronym", "description", "department", "logoUrl", "websiteUrl", "activities", "coordinatorName", "coordinatorDesignation", "displayOrder" }] }` so each society's branding, chapter details, events, and coordinator can be managed separately; a celebration schedule uses `{ "type": "celebrationList", "title", "items": [{ "name", "description", "dateLabel", "category", "imageUrl", "url", "displayOrder" }] }` for festival names, annual/date labels, descriptions, and optional photos or event links; an `eventShowcase` section can present each major event with subtitle, event description, date label, image, image placement, and metric cards (`stats: [{ "value", "label", "icon" }]`); a photo gallery uses `{ "type": "gallery", "title", "images": [{ "url", "alt", "caption" }] }`. Menu labels, categories, and content are provided by each college; no sample institution branding or menu is seeded.

### Students, activity, and enquiries
- `POST /api/auth/register` creates the user and student profile, including address/contact details; student profile routes are under `/api/students/me` (profile, education/marks, preferences, saved colleges, comparisons).
- `POST /api/recommendations/preview` returns non-identifying preview matches before signup. Authenticated students can use `GET /api/students/me/recommendations`; saved marks, course, preferred district, and college type are used automatically. College courses can publish `minimumPercentage` (0-100) for eligibility matching; courses below that minimum are excluded, while programmes without a published cutoff are clearly marked for confirmation.
- `POST /api/activity/track` stores authenticated student activity. Client-supplied student IDs are ignored; metadata is stripped of direct contact identifiers.
- `GET /api/activity/college/{id}/aggregated` returns persisted, aggregate-only analytics to that college’s admins/platform admins.
- `POST /api/enquiries` requires an authenticated student and explicit consent. Enquiry status/list routes are under `/api/enquiries`; contact details are only exposed on consented enquiries to the owning college.
- `GET /api/notifications` and read routes return notifications belonging to the authenticated account only. Enquiry status changes notify the student.

### Platform administration
Dashboard counters and charts read persisted colleges, users, activities, and enquiries. `GET /api/platform-admin/student-visits` provides a paginated, filterable student-to-college visit register (student contact/profile details, visit counts, and last visit) for platform admins only; filters include `collegeId`, `studentId`, `from`, `to`, and `search`. College-facing analytics remain aggregate-only. Interest reports are saved to the database and downloadable as generated PDF snapshots. Student dashboard endpoints expose only the authenticated student’s own activity.

## Verification

Run `mvn clean test` from `backend/` (or `./mvnw clean test` / `mvnw.cmd clean test` if the wrapper distribution is available). The test suite covers H2 schema creation, signup/default content, excluding unverified and unregistered colleges from public lists, username login, consent-based enquiries, private activity metadata, marks/course/district recommendations and minimum-cutoff exclusion, department/page deletion, verification notifications, platform-wide visit register access for platform admins only, registered-college verification, department draft/publication and public-page privacy, department page sections for outcomes/HOD/labs/curriculum, AICTE IDEA Lab draft/publication and grouped team/equipment content, Research page draft/publication and public table pagination, IQAC page draft/publication, verified-public filtering, and public member pagination, Campus Life CMS navigation, club/society directories, celebration schedules, event showcases/metrics, gallery validation, and publication privacy, About/Profile draft and publication behavior, image serving, structured Vision & Mission/Core Values, Management Profile entries, grouped Center of Excellence partner logos and featured centers, and structured accreditation/MoU/elective content.

Before production, configure a managed MySQL database using `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, and `SPRING_DATASOURCE_DRIVER=com.mysql.cj.jdbc.Driver`; use an environment-provided strong `APP_JWT_SECRET`, optional strong bootstrap credentials, restricted frontend CORS origins, schema migrations/backups, rate limiting, and deployment-grade security/privacy review. This backend is independently usable by any web or mobile client; the college CMS APIs are exposed under `/api/colleges` and require bearer-token authentication for management writes.
