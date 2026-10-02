package com.tncolleges.platform.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.repository.CollegeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

/** College-scoped research page CMS with validated datasets and public pagination. */
@Service
public class ResearchPageService {
    private static final Set<String> PAGE_FIELDS = Set.of(
            "pageTitle", "policy", "overview", "researchCommittee", "publications",
            "seedMoney", "researchProjects", "researchFacilities", "note");
    private static final Pattern MEDIA_URL = Pattern.compile("^(https?://|/api/media/)[^\\s]+$", Pattern.CASE_INSENSITIVE);

    private final CollegeRepository colleges;
    private final CollegeContentService content;
    private final ObjectMapper mapper;

    public ResearchPageService(CollegeRepository colleges, CollegeContentService content, ObjectMapper mapper) {
        this.colleges = colleges;
        this.content = content;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getForAdmin(Long collegeId) {
        requireRegisteredCollege(collegeId);
        Object value = content.getSection(collegeId, "researchPage");
        return value instanceof Map<?, ?> ? content.asMap(value) : Map.of("published", false, "status", "DRAFT");
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
        content.saveSection(collegeId, "researchPage", page);
        return page;
    }

    @Transactional
    public Map<String, Object> setPublished(Long collegeId, boolean published) {
        requireRegisteredCollege(collegeId);
        Object value = content.getSection(collegeId, "researchPage");
        if (!(value instanceof Map<?, ?>)) throw new NoSuchElementException("Research page not found");
        Map<String, Object> page = content.asMap(value);
        if (published) validate(page, true);
        page.put("published", published);
        page.put("status", published ? "PUBLISHED" : "DRAFT");
        page.put("updatedAt", LocalDateTime.now().toString());
        content.saveSection(collegeId, "researchPage", page);
        return page;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublic(String slug) {
        College college = verifiedCollege(slug);
        Map<String, Object> page = content.publishedResearchPage(college.getId());
        if (page.isEmpty()) throw new NoSuchElementException("Published research page not found");
        return page;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublicTable(String slug, String tableKey, int pageNumber, int pageSize) {
        if (pageNumber < 0) throw new IllegalArgumentException("page must be zero or greater");
        if (pageSize < 1 || pageSize > 100) throw new IllegalArgumentException("size must be between 1 and 100");
        Map<String, Object> researchPage = getPublic(slug);
        String sectionKey = switch (tableKey) {
            case "overview" -> "overview";
            case "committee" -> "researchCommittee";
            case "publications" -> "publications";
            case "seed-money" -> "seedMoney";
            case "projects" -> "researchProjects";
            default -> throw new IllegalArgumentException("Unsupported research table; use overview, committee, publications, seed-money, or projects");
        };
        Object rawSection = researchPage.get(sectionKey);
        Map<?, ?> section = rawSection instanceof Map<?, ?> map ? map : Map.of();
        Object rawRows = section.get("rows");
        List<?> rows = rawRows instanceof List<?> list ? list : List.of();
        int total = rows.size();
        int totalPages = total == 0 ? 0 : (int) Math.ceil((double) total / pageSize);
        long fromLong = (long) pageNumber * pageSize;
        int from = fromLong >= total ? total : (int) fromLong;
        int to = Math.min(from + pageSize, total);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("tableKey", tableKey);
        response.put("title", section.containsKey("title") ? section.get("title") : "");
        response.put("content", rows.subList(from, to));
        response.put("page", pageNumber);
        response.put("size", pageSize);
        response.put("totalElements", total);
        response.put("totalPages", totalPages);
        response.put("first", pageNumber == 0);
        response.put("last", totalPages == 0 || pageNumber >= totalPages - 1);
        response.put("hasNext", pageNumber + 1 < totalPages);
        response.put("hasPrevious", pageNumber > 0 && totalPages > 0);
        return response;
    }

    private College verifiedCollege(String slug) {
        return colleges.findBySlug(slug)
                .filter(college -> college.isRegistered() && college.isActive() && college.isVerified())
                .orElseThrow(() -> new NoSuchElementException("Published college not found"));
    }

    private College requireRegisteredCollege(Long collegeId) {
        return colleges.findById(collegeId).filter(College::isRegistered)
                .orElseThrow(() -> new NoSuchElementException("Registered college not found"));
    }

    private Map<String, Object> asPage(Object raw) {
        if (!(raw instanceof Map<?, ?>)) throw new IllegalArgumentException("Research page must be a JSON object");
        return mapper.convertValue(raw, new TypeReference<>() { });
    }

    private void validate(Map<String, Object> page, boolean requireComplete) {
        Set<String> metadata = Set.of("published", "status", "updatedAt", "createdAt");
        for (String field : page.keySet()) {
            if (!PAGE_FIELDS.contains(field) && !metadata.contains(field)) throw new IllegalArgumentException("Unsupported research page field: " + field);
        }
        if (page.containsKey("pageTitle")) text(page.get("pageTitle"), "pageTitle", 160, false);
        if (page.containsKey("note")) text(page.get("note"), "note", 2_000, false);
        if (page.containsKey("policy")) validatePolicy(page.get("policy"), requireComplete);
        if (page.containsKey("overview")) validateOverview(page.get("overview"), requireComplete);
        if (page.containsKey("researchCommittee")) validateCommittee(page.get("researchCommittee"), requireComplete);
        if (page.containsKey("publications")) validatePublications(page.get("publications"), requireComplete);
        if (page.containsKey("seedMoney")) validateAnnualStats(page.get("seedMoney"), "seedMoney", requireComplete);
        if (page.containsKey("researchProjects")) validateAnnualStats(page.get("researchProjects"), "researchProjects", requireComplete);
        if (page.containsKey("researchFacilities")) validateFacilities(page.get("researchFacilities"), requireComplete);
        if (requireComplete) {
            if (!(page.get("pageTitle") instanceof String title) || title.isBlank()) throw new IllegalArgumentException("Add a research page title before publishing");
            Map<?, ?> policy = object(page.get("policy"), "policy");
            requiredText(policy.get("title"), "research policy title", 200);
            requiredText(policy.get("linkUrl"), "research policy linkUrl", 2_048);
            Map<?, ?> overview = object(page.get("overview"), "overview");
            List<?> rows = list(overview.get("rows"), "overview rows", 500);
            if (rows.isEmpty()) throw new IllegalArgumentException("Add at least one research overview row before publishing");
        }
    }

    private void validatePolicy(Object raw, boolean requireComplete) {
        Map<?, ?> policy = object(raw, "policy");
        fields(policy, Set.of("title", "description", "backgroundImageUrl", "linkLabel", "linkUrl"), "policy");
        if (policy.containsKey("title")) text(policy.get("title"), "policy title", 200, requireComplete);
        if (policy.containsKey("description")) text(policy.get("description"), "policy description", 2_000, false);
        if (policy.containsKey("backgroundImageUrl")) optionalMediaUrl(policy.get("backgroundImageUrl"), "policy backgroundImageUrl");
        if (policy.containsKey("linkLabel")) text(policy.get("linkLabel"), "policy linkLabel", 100, false);
        if (policy.containsKey("linkUrl")) externalUrl(policy.get("linkUrl"), "policy linkUrl", requireComplete);
    }

    private void validateOverview(Object raw, boolean requireComplete) {
        Map<?, ?> overview = object(raw, "overview");
        fields(overview, Set.of("title", "rows"), "overview");
        if (overview.containsKey("title")) text(overview.get("title"), "overview title", 200, requireComplete);
        if (overview.containsKey("rows")) {
            for (Object rawRow : list(overview.get("rows"), "overview rows", 500)) {
                Map<?, ?> row = object(rawRow, "overview row");
                fields(row, Set.of("serialNumber", "description", "details", "breakdown"), "overview row");
                if (row.containsKey("serialNumber")) scalarText(row.get("serialNumber"), "serialNumber", 40);
                text(row.get("description"), "overview description", 500, requireComplete);
                if (row.containsKey("details")) scalarText(row.get("details"), "overview details", 160);
                if (row.containsKey("breakdown")) {
                    for (Object rawItem : list(row.get("breakdown"), "overview breakdown", 100)) {
                        Map<?, ?> item = object(rawItem, "overview breakdown item");
                        fields(item, Set.of("period", "details"), "overview breakdown item");
                        text(item.get("period"), "breakdown period", 80, requireComplete);
                        scalarText(item.get("details"), "breakdown details", 160);
                    }
                }
            }
        }
    }

    private void validateCommittee(Object raw, boolean requireComplete) {
        Map<?, ?> committee = object(raw, "researchCommittee");
        fields(committee, Set.of("title", "academicYear", "rows"), "researchCommittee");
        if (committee.containsKey("title")) text(committee.get("title"), "committee title", 200, requireComplete);
        if (committee.containsKey("academicYear")) text(committee.get("academicYear"), "committee academicYear", 40, false);
        if (committee.containsKey("rows")) {
            for (Object rawRow : list(committee.get("rows"), "committee rows", 1_000)) {
                Map<?, ?> row = object(rawRow, "committee row");
                fields(row, Set.of("serialNumber", "memberDetails", "designation", "institution", "departmentCluster"), "committee row");
                if (row.containsKey("serialNumber")) scalarText(row.get("serialNumber"), "serialNumber", 40);
                text(row.get("memberDetails"), "memberDetails", 300, requireComplete);
                text(row.get("designation"), "designation", 300, requireComplete);
                text(row.get("institution"), "institution", 400, requireComplete);
                text(row.get("departmentCluster"), "departmentCluster", 200, requireComplete);
            }
        }
    }

    private void validatePublications(Object raw, boolean requireComplete) {
        Map<?, ?> table = object(raw, "publications");
        fields(table, Set.of("title", "rows"), "publications");
        if (table.containsKey("title")) text(table.get("title"), "publications title", 200, requireComplete);
        if (table.containsKey("rows")) {
            for (Object rawRow : list(table.get("rows"), "publication rows", 500)) {
                Map<?, ?> row = object(rawRow, "publication row");
                fields(row, Set.of("calendarYear", "journalPublications", "conferencePublications", "bookChapterPublications"), "publication row");
                text(row.get("calendarYear"), "calendarYear", 40, requireComplete);
                for (String field : List.of("journalPublications", "conferencePublications", "bookChapterPublications")) {
                    scalarText(row.get(field), field, 80);
                }
            }
        }
    }

    private void validateAnnualStats(Object raw, String field, boolean requireComplete) {
        Map<?, ?> table = object(raw, field);
        fields(table, Set.of("title", "rows"), field);
        if (table.containsKey("title")) text(table.get("title"), field + " title", 200, requireComplete);
        if (table.containsKey("rows")) {
            for (Object rawRow : list(table.get("rows"), field + " rows", 500)) {
                Map<?, ?> row = object(rawRow, field + " row");
                fields(row, Set.of("academicYear", "projectCount", "amountInLakhs"), field + " row");
                text(row.get("academicYear"), "academicYear", 40, requireComplete);
                scalarText(row.get("projectCount"), "projectCount", 80);
                scalarText(row.get("amountInLakhs"), "amountInLakhs", 80);
            }
        }
    }

    private void validateFacilities(Object raw, boolean requireComplete) {
        Map<?, ?> section = object(raw, "researchFacilities");
        fields(section, Set.of("title", "clusters"), "researchFacilities");
        if (section.containsKey("title")) text(section.get("title"), "researchFacilities title", 240, requireComplete);
        if (!section.containsKey("clusters")) return;
        for (Object rawCluster : list(section.get("clusters"), "research facility clusters", 50)) {
            Map<?, ?> cluster = object(rawCluster, "research facility cluster");
            fields(cluster, Set.of("code", "title", "imageUrl", "facilities"), "research facility cluster");
            text(cluster.get("code"), "cluster code", 80, requireComplete);
            text(cluster.get("title"), "cluster title", 160, requireComplete);
            if (cluster.containsKey("imageUrl")) optionalMediaUrl(cluster.get("imageUrl"), "cluster imageUrl");
            if (cluster.containsKey("facilities")) {
                for (Object rawFacility : list(cluster.get("facilities"), "cluster facilities", 100)) {
                    Map<?, ?> facility = object(rawFacility, "research facility");
                    fields(facility, Set.of("name", "description", "imageUrl", "items"), "research facility");
                    text(facility.get("name"), "facility name", 200, requireComplete);
                    if (facility.containsKey("description")) text(facility.get("description"), "facility description", 2_000, false);
                    if (facility.containsKey("imageUrl")) optionalMediaUrl(facility.get("imageUrl"), "facility imageUrl");
                    if (facility.containsKey("items")) {
                        for (Object item : list(facility.get("items"), "facility items", 500)) text(item, "facility item", 500, requireComplete);
                    }
                }
            }
        }
    }

    private Map<?, ?> object(Object raw, String field) {
        if (!(raw instanceof Map<?, ?> map)) throw new IllegalArgumentException(field + " must be an object");
        return map;
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

    private String requiredText(Object raw, String field, int maxLength) {
        return text(raw, field, maxLength, true);
    }

    private void scalarText(Object raw, String field, int maxLength) {
        if (raw == null) return;
        if (!(raw instanceof String || raw instanceof Number) || String.valueOf(raw).length() > maxLength) {
            throw new IllegalArgumentException(field + " must be a short text or number");
        }
    }

    private void optionalMediaUrl(Object raw, String field) {
        if (raw == null || (raw instanceof String value && value.isBlank())) return;
        String value = requiredText(raw, field, 2_048);
        if (!MEDIA_URL.matcher(value).matches()) throw new IllegalArgumentException(field + " must be an http(s) or /api/media/ URL");
    }

    private void externalUrl(Object raw, String field, boolean required) {
        if (raw == null || (raw instanceof String value && value.isBlank())) {
            if (required) throw new IllegalArgumentException(field + " is required");
            return;
        }
        String value = requiredText(raw, field, 2_048);
        if (!value.matches("^https?://[^\\s]+$")) throw new IllegalArgumentException(field + " must be an http(s) URL");
    }
}
