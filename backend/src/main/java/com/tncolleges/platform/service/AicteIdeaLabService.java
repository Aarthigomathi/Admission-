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

/** Draft/publish CMS for a college's AICTE IDEA Lab page. */
@Service
public class AicteIdeaLabService {
    private static final Set<String> PAGE_FIELDS = Set.of(
            "pageTitle", "aboutLab", "vision", "missions", "objectives", "team", "infrastructure");
    private static final Set<String> PERSON_FIELDS = Set.of(
            "name", "designation", "department", "collegeName", "email", "phone", "photoUrl", "bio");
    private static final Pattern MEDIA_URL = Pattern.compile("^(https?://|/api/media/)[^\\s]+$", Pattern.CASE_INSENSITIVE);
    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private final CollegeRepository colleges;
    private final CollegeContentService content;
    private final ObjectMapper mapper;

    public AicteIdeaLabService(CollegeRepository colleges, CollegeContentService content, ObjectMapper mapper) {
        this.colleges = colleges;
        this.content = content;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getForAdmin(Long collegeId) {
        requireRegisteredCollege(collegeId);
        Object value = content.getSection(collegeId, "aicteIdeaLab");
        if (!(value instanceof Map<?, ?>)) return Map.of("published", false, "status", "DRAFT");
        return content.asMap(value);
    }

    @Transactional
    public Map<String, Object> saveDraft(Long collegeId, Object rawPage) {
        requireRegisteredCollege(collegeId);
        Map<String, Object> page = asPage(rawPage);
        page.keySet().removeIf(key -> Set.of("published", "status", "updatedAt", "createdAt").contains(key));
        validate(page, false);
        page.put("published", false);
        page.put("status", "DRAFT");
        page.put("updatedAt", LocalDateTime.now().toString());
        content.saveSection(collegeId, "aicteIdeaLab", page);
        return page;
    }

    @Transactional
    public Map<String, Object> setPublished(Long collegeId, boolean published) {
        requireRegisteredCollege(collegeId);
        Object value = content.getSection(collegeId, "aicteIdeaLab");
        if (!(value instanceof Map<?, ?>)) throw new NoSuchElementException("AICTE IDEA Lab page not found");
        Map<String, Object> page = content.asMap(value);
        if (published) validate(page, true);
        page.put("published", published);
        page.put("status", published ? "PUBLISHED" : "DRAFT");
        page.put("updatedAt", LocalDateTime.now().toString());
        content.saveSection(collegeId, "aicteIdeaLab", page);
        return page;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublic(String slug) {
        College college = colleges.findBySlug(slug)
                .filter(item -> item.isRegistered() && item.isActive() && item.isVerified())
                .orElseThrow(() -> new NoSuchElementException("Published college not found"));
        Map<String, Object> page = content.publishedAicteIdeaLab(college.getId());
        if (page.isEmpty()) throw new NoSuchElementException("Published AICTE IDEA Lab page not found");
        return page;
    }

    private College requireRegisteredCollege(Long collegeId) {
        return colleges.findById(collegeId).filter(College::isRegistered)
                .orElseThrow(() -> new NoSuchElementException("Registered college not found"));
    }

    private Map<String, Object> asPage(Object raw) {
        if (!(raw instanceof Map<?, ?>)) throw new IllegalArgumentException("AICTE IDEA Lab page must be a JSON object");
        return mapper.convertValue(raw, new TypeReference<>() { });
    }

    private void validate(Map<String, Object> page, boolean requireComplete) {
        Set<String> metadata = Set.of("published", "status", "updatedAt", "createdAt");
        for (String key : page.keySet()) {
            if (!PAGE_FIELDS.contains(key) && !metadata.contains(key)) {
                throw new IllegalArgumentException("Unsupported AICTE IDEA Lab page field: " + key);
            }
        }
        if (page.containsKey("pageTitle")) text(page.get("pageTitle"), "pageTitle", 160, false);
        if (page.containsKey("aboutLab")) validateAbout(page.get("aboutLab"));
        if (page.containsKey("vision")) text(page.get("vision"), "vision", 20_000, false);
        if (page.containsKey("missions")) validateCards(page.get("missions"), "missions", 30, requireComplete);
        if (page.containsKey("objectives")) validateCards(page.get("objectives"), "objectives", 50, requireComplete);
        if (page.containsKey("team")) validateTeam(page.get("team"), requireComplete);
        if (page.containsKey("infrastructure")) validateInfrastructure(page.get("infrastructure"), requireComplete);
        if (requireComplete) {
            Map<?, ?> about = map(page.get("aboutLab"), "aboutLab");
            if (!hasParagraphs(about.get("paragraphs"))) {
                throw new IllegalArgumentException("Add About IDEA Lab paragraphs before publishing");
            }
            if (!(about.get("logoUrl") instanceof String logoUrl) || logoUrl.isBlank()) {
                throw new IllegalArgumentException("Add the IDEA Lab logo before publishing");
            }
            if (!(page.get("vision") instanceof String vision) || vision.isBlank()) {
                throw new IllegalArgumentException("Add the IDEA Lab vision before publishing");
            }
            if (!(page.get("missions") instanceof List<?> missions) || missions.isEmpty()) {
                throw new IllegalArgumentException("Add at least one IDEA Lab mission before publishing");
            }
            if (!(page.get("objectives") instanceof List<?> objectives) || objectives.isEmpty()) {
                throw new IllegalArgumentException("Add at least one IDEA Lab objective before publishing");
            }
            Map<?, ?> team = map(page.get("team"), "team");
            if (!(team.get("chiefMentor") instanceof Map<?, ?>)) {
                throw new IllegalArgumentException("Add the IDEA Lab chief mentor before publishing");
            }
            Map<?, ?> infrastructure = map(page.get("infrastructure"), "infrastructure");
            if (!(infrastructure.get("equipment") instanceof List<?> equipment) || equipment.isEmpty()) {
                throw new IllegalArgumentException("Add at least one IDEA Lab equipment item before publishing");
            }
        }
    }

    private void validateAbout(Object raw) {
        Map<?, ?> about = map(raw, "aboutLab");
        fields(about, Set.of("logoUrl", "paragraphs"), "aboutLab");
        if (about.containsKey("logoUrl")) optionalMediaUrl(about.get("logoUrl"), "aboutLab logoUrl", false);
        if (about.containsKey("paragraphs")) paragraphs(about.get("paragraphs"), "aboutLab paragraphs", 20, 10_000);
    }

    private void validateCards(Object raw, String field, int maxItems, boolean requireComplete) {
        List<?> items = list(raw, field, maxItems);
        for (Object rawItem : items) {
            Map<?, ?> item = map(rawItem, field + " item");
            fields(item, Set.of("title", "description"), field + " item");
            text(item.get("title"), field + " title", 240, requireComplete);
            text(item.get("description"), field + " description", 5_000, requireComplete);
        }
        if (requireComplete && items.isEmpty()) throw new IllegalArgumentException("Add at least one " + field + " item before publishing");
    }

    private void validateTeam(Object raw, boolean requireComplete) {
        Map<?, ?> team = map(raw, "team");
        fields(team, Set.of("chiefMentor", "facultyCoordinators", "techGurus", "studentAmbassadors"), "team");
        if (team.containsKey("chiefMentor")) validatePerson(team.get("chiefMentor"), "chiefMentor", requireComplete);
        for (String group : List.of("facultyCoordinators", "techGurus", "studentAmbassadors")) {
            if (!team.containsKey(group)) continue;
            for (Object person : list(team.get(group), group, 100)) validatePerson(person, group + " person", requireComplete);
        }
        if (requireComplete && !(team.get("chiefMentor") instanceof Map<?, ?>)) {
            throw new IllegalArgumentException("Add the IDEA Lab chief mentor before publishing");
        }
    }

    private void validatePerson(Object raw, String label, boolean requireComplete) {
        Map<?, ?> person = map(raw, label);
        fields(person, PERSON_FIELDS, label);
        text(person.get("name"), label + " name", 160, requireComplete);
        for (String field : List.of("designation", "department", "collegeName")) {
            if (person.containsKey(field)) text(person.get(field), label + " " + field, 200, false);
        }
        if (person.containsKey("email")) {
            String email = text(person.get("email"), label + " email", 254, false);
            if (!email.isBlank() && !EMAIL.matcher(email).matches()) throw new IllegalArgumentException(label + " email must be valid");
        }
        if (person.containsKey("phone")) {
            String phone = text(person.get("phone"), label + " phone", 32, false);
            if (!phone.isBlank() && !phone.matches("[+0-9() .-]+")) throw new IllegalArgumentException(label + " phone contains invalid characters");
        }
        if (person.containsKey("photoUrl")) optionalMediaUrl(person.get("photoUrl"), label + " photoUrl", false);
        if (person.containsKey("bio")) text(person.get("bio"), label + " bio", 10_000, false);
    }

    private void validateInfrastructure(Object raw, boolean requireComplete) {
        Map<?, ?> infrastructure = map(raw, "infrastructure");
        fields(infrastructure, Set.of("eyebrow", "title", "description", "equipment"), "infrastructure");
        for (String field : List.of("eyebrow", "title", "description")) {
            if (infrastructure.containsKey(field)) text(infrastructure.get(field), "infrastructure " + field, field.equals("description") ? 2_000 : 200, false);
        }
        if (infrastructure.containsKey("equipment")) {
            for (Object rawItem : list(infrastructure.get("equipment"), "equipment", 100)) {
                Map<?, ?> item = map(rawItem, "equipment item");
                fields(item, Set.of("name", "description", "imageUrl", "linkUrl", "displayOrder"), "equipment item");
                text(item.get("name"), "equipment name", 200, requireComplete);
                if (item.containsKey("description")) text(item.get("description"), "equipment description", 2_000, false);
                optionalMediaUrl(item.get("imageUrl"), "equipment imageUrl", requireComplete);
                optionalExternalUrl(item.get("linkUrl"), "equipment linkUrl");
                if (item.containsKey("displayOrder")) integer(item.get("displayOrder"), "equipment displayOrder", 0, 10_000);
            }
        }
    }

    private void paragraphs(Object raw, String field, int maxItems, int maxLength) {
        List<?> values = list(raw, field, maxItems);
        for (Object value : values) text(value, field + " item", maxLength, true);
    }

    private boolean hasParagraphs(Object raw) {
        return raw instanceof List<?> values && values.stream().anyMatch(value -> value instanceof String text && !text.isBlank());
    }

    private Map<?, ?> map(Object raw, String field) {
        if (!(raw instanceof Map<?, ?> value)) throw new IllegalArgumentException(field + " must be an object");
        return value;
    }

    private void fields(Map<?, ?> object, Set<String> allowed, String label) {
        for (Object key : object.keySet()) {
            if (!(key instanceof String field) || !allowed.contains(field)) throw new IllegalArgumentException("Unsupported " + label + " field: " + key);
        }
    }

    private List<?> list(Object raw, String field, int maxItems) {
        if (!(raw instanceof List<?> values) || values.size() > maxItems) throw new IllegalArgumentException(field + " must be a list containing at most " + maxItems + " items");
        return values;
    }

    private String text(Object raw, String field, int maxLength, boolean required) {
        if (raw == null) {
            if (required) throw new IllegalArgumentException(field + " is required");
            return "";
        }
        if (!(raw instanceof String value) || value.trim().length() > maxLength || (required && value.isBlank())) {
            throw new IllegalArgumentException(field + " must be text" + (required ? " and cannot be blank" : "") + " (maximum " + maxLength + " characters)");
        }
        return value.trim();
    }

    private void optionalMediaUrl(Object raw, String field, boolean required) {
        if (raw == null || (raw instanceof String value && value.isBlank())) {
            if (required) throw new IllegalArgumentException(field + " is required");
            return;
        }
        mediaUrl(raw, field);
    }

    private void mediaUrl(Object raw, String field) {
        String value = text(raw, field, 2_048, true);
        if (!MEDIA_URL.matcher(value).matches()) throw new IllegalArgumentException(field + " must be an http(s) or /api/media/ URL");
    }

    private void optionalExternalUrl(Object raw, String field) {
        if (raw == null || (raw instanceof String value && value.isBlank())) return;
        externalUrl(raw, field);
    }

    private void externalUrl(Object raw, String field) {
        String value = text(raw, field, 2_048, true);
        if (!value.matches("^https?://[^\\s]+$")) throw new IllegalArgumentException(field + " must be an http(s) URL");
    }

    private void integer(Object raw, String field, int minimum, int maximum) {
        try {
            int value = Integer.parseInt(String.valueOf(raw));
            if (value < minimum || value > maximum) throw new NumberFormatException();
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException(field + " must be between " + minimum + " and " + maximum);
        }
    }
}
