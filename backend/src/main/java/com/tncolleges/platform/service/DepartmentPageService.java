package com.tncolleges.platform.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.repository.CollegeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

/** Validates and publishes college-scoped department pages stored in college content JSON. */
@Service
public class DepartmentPageService {
    private static final Set<String> PAGE_FIELDS = Set.of(
            "hero", "overview", "vision", "mission", "regulations", "coursesOffered", "laboratories",
            "outcomes", "hodProfile", "faculty", "smartClassRooms", "teachingAndLearning",
            "curriculum", "additionalSections");
    private static final Pattern SAFE_URL = Pattern.compile("^(https?://|/api/media/)[^\\s]+$", Pattern.CASE_INSENSITIVE);

    private final CollegeRepository colleges;
    private final CollegeContentService content;
    private final ObjectMapper mapper;

    public DepartmentPageService(CollegeRepository colleges, CollegeContentService content, ObjectMapper mapper) {
        this.colleges = colleges;
        this.content = content;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getForAdmin(Long collegeId, String departmentId) {
        requireDepartment(collegeId, departmentId);
        Map<String, Object> pages = pages(collegeId);
        Object page = pages.get(departmentId);
        if (page == null) return Map.of("published", false, "status", "DRAFT");
        return content.asMap(page);
    }

    @Transactional
    public Map<String, Object> saveDraft(Long collegeId, String departmentId, Object rawPage) {
        requireDepartment(collegeId, departmentId);
        Map<String, Object> page = asPageMap(rawPage);
        page.keySet().removeIf(key -> Set.of("published", "status", "updatedAt", "createdAt").contains(key));
        validatePage(page, false);
        page.put("published", false);
        page.put("status", "DRAFT");
        page.put("updatedAt", LocalDateTime.now().toString());
        content.saveDepartmentPage(collegeId, departmentId, page);
        content.setDepartmentPublished(collegeId, departmentId, false);
        return page;
    }

    @Transactional
    public Map<String, Object> setPublished(Long collegeId, String departmentId, boolean published) {
        requireDepartment(collegeId, departmentId);
        Map<String, Object> pages = pages(collegeId);
        Object rawPage = pages.get(departmentId);
        if (!(rawPage instanceof Map<?, ?>)) throw new NoSuchElementException("Department page not found");
        Map<String, Object> page = content.asMap(rawPage);
        if (published) validatePage(page, true);
        page.put("published", published);
        page.put("status", published ? "PUBLISHED" : "DRAFT");
        page.put("updatedAt", LocalDateTime.now().toString());
        content.saveDepartmentPage(collegeId, departmentId, page);
        content.setDepartmentPublished(collegeId, departmentId, published);
        return page;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> publicDepartments(String slug) {
        College college = verifiedCollege(slug);
        return content.publicDepartments(college.getId());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> publicPage(String slug, String departmentId) {
        College college = verifiedCollege(slug);
        return publicPage(college.getId(), departmentId);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> publicPage(Long collegeId, String departmentId) {
        College college = colleges.findById(collegeId)
                .filter(item -> item.isRegistered() && item.isActive() && item.isVerified())
                .orElseThrow(() -> new NoSuchElementException("Published college not found"));
        Map<String, Object> department = content.publicDepartments(college.getId()).stream()
                .filter(item -> Objects.equals(String.valueOf(item.get("id")), departmentId))
                .findFirst().orElseThrow(() -> new NoSuchElementException("Department not found"));
        Map<String, Object> pages = pages(college.getId());
        Object rawPage = pages.get(departmentId);
        if (!(rawPage instanceof Map<?, ?> page) || !Boolean.TRUE.equals(page.get("published"))) {
            throw new NoSuchElementException("Published department page not found");
        }
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("department", department);
        response.put("page", content.asMap(rawPage));
        return response;
    }

    private College verifiedCollege(String slug) {
        return colleges.findBySlug(slug)
                .filter(college -> college.isRegistered() && college.isActive() && college.isVerified())
                .orElseThrow(() -> new NoSuchElementException("Published college not found"));
    }

    private Map<String, Object> requireDepartment(Long collegeId, String departmentId) {
        return content.departments(collegeId).stream()
                .filter(item -> Objects.equals(String.valueOf(item.get("id")), departmentId))
                .findFirst().orElseThrow(() -> new NoSuchElementException("Department not found"));
    }

    private Map<String, Object> pages(Long collegeId) {
        Object value = content.getSection(collegeId, "deptPages");
        return value instanceof Map<?, ?> ? content.asMap(value) : new LinkedHashMap<>();
    }

    private Map<String, Object> asPageMap(Object raw) {
        if (!(raw instanceof Map<?, ?>)) throw new IllegalArgumentException("Department page must be a JSON object");
        return mapper.convertValue(raw, new TypeReference<>() { });
    }

    private void validatePage(Map<String, Object> page, boolean requireContent) {
        Set<String> metadata = Set.of("published", "status", "updatedAt", "createdAt");
        boolean hasContent = page.entrySet().stream()
                .filter(entry -> !metadata.contains(entry.getKey()))
                .anyMatch(entry -> hasActualContent(entry.getValue()));
        for (String key : page.keySet()) {
            if (!PAGE_FIELDS.contains(key) && !metadata.contains(key)) throw new IllegalArgumentException("Unsupported department page field: " + key);
        }
        if (page.containsKey("hero")) validateHero(page.get("hero"));
        if (page.containsKey("overview")) validateTextOrParagraphs(page.get("overview"), "overview", 30, 10_000);
        if (page.containsKey("vision")) requiredOrOptionalText(page.get("vision"), "vision", 20_000);
        if (page.containsKey("mission")) validateMission(page.get("mission"));
        if (page.containsKey("regulations")) validateDocumentsSection(page.get("regulations"), "regulations");
        if (page.containsKey("coursesOffered")) validateCourses(page.get("coursesOffered"));
        if (page.containsKey("laboratories")) validateLaboratories(page.get("laboratories"));
        if (page.containsKey("outcomes")) validateOutcomes(page.get("outcomes"));
        if (page.containsKey("hodProfile")) validateHod(page.get("hodProfile"));
        if (page.containsKey("faculty")) validateFaculty(page.get("faculty"));
        if (page.containsKey("smartClassRooms")) validateLinkList(page.get("smartClassRooms"), "smartClassRooms");
        if (page.containsKey("teachingAndLearning")) validateLinkList(page.get("teachingAndLearning"), "teachingAndLearning");
        if (page.containsKey("curriculum")) validateDocumentsSection(page.get("curriculum"), "curriculum");
        if (page.containsKey("additionalSections")) validateAdditionalSections(page.get("additionalSections"));
        if (requireContent && !hasContent) throw new IllegalArgumentException("Add department page content before publishing");
    }

    private boolean hasActualContent(Object value) {
        if (value instanceof String text) return !text.isBlank();
        if (value instanceof List<?> values) return values.stream().anyMatch(this::hasActualContent);
        if (value instanceof Map<?, ?> values) return values.values().stream().anyMatch(this::hasActualContent);
        return value != null;
    }

    private void validateHero(Object raw) {
        Map<?, ?> hero = object(raw, "hero");
        fields(hero, Set.of("title", "description", "imageUrl", "altText"), "hero");
        optionalText(hero.get("title"), "hero title", 200);
        optionalText(hero.get("altText"), "hero altText", 300);
        if (hero.containsKey("description")) validateTextOrParagraphs(hero.get("description"), "hero description", 30, 10_000);
        if (hero.containsKey("imageUrl")) mediaUrl(hero.get("imageUrl"), "hero imageUrl");
    }

    private void validateMission(Object raw) {
        Map<?, ?> mission = object(raw, "mission");
        fields(mission, Set.of("title", "items", "imageUrl"), "mission");
        optionalText(mission.get("title"), "mission title", 160);
        if (mission.containsKey("items")) textList(mission.get("items"), "mission items", 50, 5_000);
        if (mission.containsKey("imageUrl")) mediaUrl(mission.get("imageUrl"), "mission imageUrl");
    }

    private void validateDocumentsSection(Object raw, String field) {
        Map<?, ?> section = object(raw, field);
        fields(section, Set.of("backgroundImageUrl", "items"), field);
        if (section.containsKey("backgroundImageUrl")) mediaUrl(section.get("backgroundImageUrl"), field + " backgroundImageUrl");
        if (!section.containsKey("items")) return;
        List<?> items = list(section.get("items"), field + " items", 100);
        for (Object rawItem : items) {
            Map<?, ?> item = object(rawItem, field + " item");
            fields(item, Set.of("year", "title", "documentUrl", "linkUrl"), field + " item");
            optionalText(item.get("year"), "year", 40);
            optionalText(item.get("title"), "title", 200);
            if (item.containsKey("documentUrl")) mediaUrl(item.get("documentUrl"), "documentUrl");
            if (item.containsKey("linkUrl")) externalUrl(item.get("linkUrl"), "linkUrl");
        }
    }

    private void validateCourses(Object raw) {
        List<?> courses = list(raw, "coursesOffered", 100);
        for (Object item : courses) {
            if (item instanceof String name) {
                requiredText(name, "course name", 200);
                continue;
            }
            Map<?, ?> course = object(item, "course");
            fields(course, Set.of("name", "level", "duration", "courseId", "linkUrl"), "course");
            requiredText(course.get("name"), "course name", 200);
            optionalText(course.get("level"), "course level", 80);
            optionalText(course.get("duration"), "course duration", 80);
            optionalText(course.get("courseId"), "courseId", 80);
            if (course.containsKey("linkUrl")) externalUrl(course.get("linkUrl"), "course linkUrl");
        }
    }

    private void validateLaboratories(Object raw) {
        List<?> laboratories = list(raw, "laboratories", 100);
        for (Object item : laboratories) {
            Map<?, ?> lab = object(item, "laboratory");
            fields(lab, Set.of("name", "description", "imageUrl", "icon"), "laboratory");
            requiredText(lab.get("name"), "laboratory name", 200);
            if (lab.containsKey("description")) validateTextOrParagraphs(lab.get("description"), "laboratory description", 10, 5_000);
            if (lab.containsKey("imageUrl")) mediaUrl(lab.get("imageUrl"), "laboratory imageUrl");
            optionalText(lab.get("icon"), "laboratory icon", 80);
        }
    }

    private void validateOutcomes(Object raw) {
        Map<?, ?> outcomes = object(raw, "outcomes");
        fields(outcomes, Set.of("peos", "pos", "psos"), "outcomes");
        for (String key : List.of("peos", "pos", "psos")) {
            if (!outcomes.containsKey(key)) continue;
            List<?> items = list(outcomes.get(key), key, 100);
            for (Object rawItem : items) {
                Map<?, ?> item = object(rawItem, key + " item");
                fields(item, Set.of("code", "description"), key + " item");
                requiredText(item.get("code"), key + " code", 40);
                requiredText(item.get("description"), key + " description", 5_000);
            }
        }
    }

    private void validateHod(Object raw) {
        Map<?, ?> hod = object(raw, "hodProfile");
        fields(hod, Set.of("name", "designation", "qualification", "biography", "photoUrl"), "hodProfile");
        optionalText(hod.get("name"), "HOD name", 160);
        optionalText(hod.get("designation"), "HOD designation", 120);
        optionalText(hod.get("qualification"), "HOD qualification", 200);
        if (hod.containsKey("biography")) validateTextOrParagraphs(hod.get("biography"), "HOD biography", 30, 10_000);
        if (hod.containsKey("photoUrl")) mediaUrl(hod.get("photoUrl"), "HOD photoUrl");
    }

    private void validateFaculty(Object raw) {
        Map<?, ?> faculty = object(raw, "faculty");
        fields(faculty, Set.of("intro", "linkLabel", "linkUrl", "members"), "faculty");
        if (faculty.containsKey("intro")) validateTextOrParagraphs(faculty.get("intro"), "faculty intro", 10, 5_000);
        optionalText(faculty.get("linkLabel"), "faculty linkLabel", 100);
        if (faculty.containsKey("linkUrl")) externalUrl(faculty.get("linkUrl"), "faculty linkUrl");
        if (faculty.containsKey("members")) {
            List<?> members = list(faculty.get("members"), "faculty members", 200);
            for (Object rawMember : members) {
                Map<?, ?> member = object(rawMember, "faculty member");
                fields(member, Set.of("name", "designation", "photoUrl", "email", "bio", "qualification", "experience", "specialization", "isHod"), "faculty member");
                requiredText(member.get("name"), "faculty member name", 160);
                optionalText(member.get("designation"), "faculty designation", 120);
                optionalText(member.get("email"), "faculty email", 254);
                optionalText(member.get("qualification"), "faculty qualification", 200);
                optionalText(member.get("experience"), "faculty experience", 120);
                optionalText(member.get("specialization"), "faculty specialization", 300);
                if (member.containsKey("bio")) validateTextOrParagraphs(member.get("bio"), "faculty biography", 20, 5_000);
                if (member.containsKey("photoUrl")) mediaUrl(member.get("photoUrl"), "faculty photoUrl");
                if (member.containsKey("isHod") && !(member.get("isHod") instanceof Boolean)) {
                    throw new IllegalArgumentException("faculty member isHod must be true or false");
                }
            }
        }
    }

    private void validateLinkList(Object raw, String field) {
        List<?> items = list(raw, field, 100);
        for (Object item : items) {
            Map<?, ?> link = object(item, field + " item");
            fields(link, Set.of("title", "description", "linkUrl"), field + " item");
            requiredText(link.get("title"), field + " title", 200);
            if (link.containsKey("description")) optionalText(link.get("description"), field + " description", 1_000);
            if (link.containsKey("linkUrl")) externalUrl(link.get("linkUrl"), field + " linkUrl");
        }
    }

    private void validateAdditionalSections(Object raw) {
        List<?> items = list(raw, "additionalSections", 50);
        for (Object item : items) {
            Map<?, ?> section = object(item, "additional section");
            fields(section, Set.of("title", "content", "imageUrl", "linkUrl"), "additional section");
            requiredText(section.get("title"), "additional section title", 200);
            if (section.containsKey("content")) validateTextOrParagraphs(section.get("content"), "additional section content", 30, 10_000);
            if (section.containsKey("imageUrl")) mediaUrl(section.get("imageUrl"), "additional section imageUrl");
            if (section.containsKey("linkUrl")) externalUrl(section.get("linkUrl"), "additional section linkUrl");
        }
    }

    private void requiredOrOptionalText(Object raw, String field, int maxLength) {
        if (raw == null) return;
        if (raw instanceof String text) {
            if (text.length() > maxLength) throw new IllegalArgumentException(field + " is too long");
            return;
        }
        textList(raw, field, 30, maxLength);
    }

    private void validateTextOrParagraphs(Object raw, String field, int maxItems, int maxLength) {
        if (raw instanceof String text) {
            if (text.length() > maxLength * maxItems) throw new IllegalArgumentException(field + " is too long");
            return;
        }
        textList(raw, field, maxItems, maxLength);
    }

    private void textList(Object raw, String field, int maxItems, int maxLength) {
        List<?> values = list(raw, field, maxItems);
        for (Object value : values) requiredText(value, field + " item", maxLength);
    }

    private List<?> list(Object raw, String field, int maxItems) {
        if (!(raw instanceof List<?> values) || values.size() > maxItems) {
            throw new IllegalArgumentException(field + " must be a list containing at most " + maxItems + " items");
        }
        return values;
    }

    private Map<?, ?> object(Object raw, String field) {
        if (!(raw instanceof Map<?, ?> map)) throw new IllegalArgumentException(field + " must be an object");
        return map;
    }

    private void fields(Map<?, ?> object, Set<String> allowed, String label) {
        for (Object key : object.keySet()) {
            if (!(key instanceof String field) || !allowed.contains(field)) {
                throw new IllegalArgumentException("Unsupported " + label + " field: " + key);
            }
        }
    }

    private String requiredText(Object raw, String field, int maxLength) {
        if (!(raw instanceof String text) || text.isBlank() || text.trim().length() > maxLength) {
            throw new IllegalArgumentException(field + " is required and must be at most " + maxLength + " characters");
        }
        return text.trim();
    }

    private void optionalText(Object raw, String field, int maxLength) {
        if (raw == null) return;
        if (!(raw instanceof String text) || text.trim().length() > maxLength) {
            throw new IllegalArgumentException(field + " must be text of at most " + maxLength + " characters");
        }
    }

    private void mediaUrl(Object raw, String field) {
        String value = requiredText(raw, field, 2_048);
        if (!SAFE_URL.matcher(value).matches()) throw new IllegalArgumentException(field + " must be an http(s) or /api/media/ URL");
    }

    private void externalUrl(Object raw, String field) {
        String value = requiredText(raw, field, 2_048);
        if (!value.matches("^https?://[^\\s]+$")) throw new IllegalArgumentException(field + " must be an http(s) URL");
    }
}
