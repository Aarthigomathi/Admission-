# Tamil Nadu College Discovery Platform — Backend

This repository is now backend-only. The frontend directories have been removed; web and mobile clients can integrate with the Spring Boot REST API documented in [`backend/README.md`](backend/README.md).

## Stack

- Java 17+ and Spring Boot 3
- Spring Data JPA; H2 for local development, configurable MySQL for deployments
- JWT authentication and role/college-scoped authorization
- Persistent college CMS content, About/Profile sections, media, student records, recommendations, activity, enquiries, and platform analytics

## Start

From `backend/`, configure a private Base64 JWT secret and run the API:

```bash
export APP_JWT_SECRET="$(openssl rand -base64 48)"
./mvnw spring-boot:run
```

Run tests with `./mvnw clean test`. Local database and uploaded college media are stored under `backend/data/` by default and are ignored by Git. Set `APP_MEDIA_STORAGE_DIR` to choose another persistent media directory in deployment.

## College About/Profile CMS

The backend supports ordered, editable and publishable About/Profile blocks with these section keys:

- `PROFILE`
- `VISION_MISSION`
- `MANAGEMENT_PROFILE`
- `ORGANIZATIONAL_STRUCTURE`
- `CENTER_OF_EXCELLENCE`
- `ACCREDITATIONS`
- `PROGRAMMES`
- `PLACEMENTS`

College admins can create drafts, edit, reorder, publish/unpublish, and delete blocks. Vision & Mission supports structured vision text, an ordered mission bullet list, and core-value cards with title, description, and optional icon key. Management Profile supports an ordered people list with designation, name, paragraph biographies, portrait image URL, and left/right/automatic image placement. Center of Excellence supports grouped categories with partner logos and featured centers with rich descriptions, images, and CTA links. Accreditations supports body/grade/logo cards, department lists, MoU/Centre logos, recognition text, and elective-industry partner logos. Each college can also manage an independent department directory and structured department pages for about/vision/mission, regulations, courses, labs, PEO/PO/PSO outcomes, HOD/faculty, classrooms, teaching links, and curriculum. Department pages are draft/published separately; public clients see active published departments only. AICTE IDEA Lab pages support lab overview/logo, vision, mission cards, objectives, grouped team profiles, and equipment with photos and links; they also use draft/publish controls. Research pages support research policy links, overview/year-breakdown tables, committees, publication/seed-funding/project statistics, and department-grouped facilities/equipment, with public pagination for tables. IQAC pages support an illustrated About section, function cards, a paginated member directory, AQAR and meeting-minute links, and year-specific report/resource cards. Campus Life pages support customizable navigation, multiple page slugs, introduction copy, quote and hero banners, alternating feature sections, categorized club lists, professional society profiles (acronym, logo, department, activities, and coordinator), celebration schedules with optional date labels and event photos, major-event showcases with stats/metric cards, link cards, and image galleries. These college-scoped CMSs use draft/publish controls and expose only published content for verified colleges; their labels and content are configurable per college. Image uploads use a protected multipart endpoint; only valid JPEG, PNG, and WebP images up to 8 MB are accepted. Public image access is limited to verified colleges.

See `backend/README.md` for setup, API routes, request shapes, privacy boundaries, and verification details.
