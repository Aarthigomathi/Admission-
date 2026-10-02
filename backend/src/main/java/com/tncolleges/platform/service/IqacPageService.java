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

/** College-scoped IQAC page CMS with draft/publication controls and public member pagination. */
@Service
public class IqacPageService {
    private static final Set<String> PAGE_FIELDS = Set.of("pageTitle", "about", "functions", "members", "aqar", "minutes", "resources");
    private static final Pattern URL = Pattern.compile("^(https?://|/api/media/)[^\\s]+$", Pattern.CASE_INSENSITIVE);
    private final CollegeRepository colleges;
    private final CollegeContentService content;
    private final ObjectMapper mapper;

    public IqacPageService(CollegeRepository colleges, CollegeContentService content, ObjectMapper mapper) {
        this.colleges = colleges;
        this.content = content;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getForAdmin(Long collegeId) {
        requireCollege(collegeId);
        Object stored = content.getSection(collegeId, "iqacPage");
        if (stored instanceof Map<?, ?> map && !map.isEmpty()) return content.asMap(stored);
        return Map.of("published", false, "status", "DRAFT");
    }

    @Transactional
    public Map<String, Object> saveDraft(Long collegeId, Object raw) {
        requireCollege(collegeId);
        if (!(raw instanceof Map<?, ?>)) throw new IllegalArgumentException("IQAC page must be a JSON object");
        Map<String, Object> page = mapper.convertValue(raw, new TypeReference<>() { });
        page.keySet().removeIf(key -> Set.of("published", "status", "updatedAt", "createdAt").contains(key));
        validate(page, false);
        page.put("published", false);
        page.put("status", "DRAFT");
        page.put("updatedAt", LocalDateTime.now().toString());
        content.saveSection(collegeId, "iqacPage", page);
        return page;
    }

    @Transactional
    public Map<String, Object> setPublished(Long collegeId, boolean published) {
        requireCollege(collegeId);
        Object stored = content.getSection(collegeId, "iqacPage");
        if (!(stored instanceof Map<?, ?>)) throw new NoSuchElementException("IQAC page not found");
        Map<String, Object> page = content.asMap(stored);
        if (published) validate(page, true);
        page.put("published", published);
        page.put("status", published ? "PUBLISHED" : "DRAFT");
        page.put("updatedAt", LocalDateTime.now().toString());
        content.saveSection(collegeId, "iqacPage", page);
        return page;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublic(String slug) {
        College college = verifiedCollege(slug);
        Map<String, Object> page = content.publishedIqacPage(college.getId());
        if (page.isEmpty()) throw new NoSuchElementException("Published IQAC page not found");
        return page;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublicMembers(String slug, int page, int size) {
        if (page < 0) throw new IllegalArgumentException("page must be zero or greater");
        if (size < 1 || size > 100) throw new IllegalArgumentException("size must be between 1 and 100");
        Map<String, Object> iqac = getPublic(slug);
        Map<?, ?> section = iqac.get("members") instanceof Map<?, ?> map ? map : Map.of();
        List<?> rows = section.get("rows") instanceof List<?> list ? list : List.of();
        int total = rows.size();
        int pages = total == 0 ? 0 : (int) Math.ceil((double) total / size);
        long start = (long) page * size;
        int from = start >= total ? total : (int) start;
        int to = Math.min(from + size, total);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("title", section.containsKey("title") ? section.get("title") : "IQAC Members");
        result.put("content", rows.subList(from, to));
        result.put("page", page);
        result.put("size", size);
        result.put("totalElements", total);
        result.put("totalPages", pages);
        result.put("first", page == 0);
        result.put("last", pages == 0 || page >= pages - 1);
        result.put("hasNext", page + 1 < pages);
        result.put("hasPrevious", page > 0 && pages > 0);
        return result;
    }

    private void validate(Map<String, Object> page, boolean complete) {
        for (String key : page.keySet()) if (!PAGE_FIELDS.contains(key) && !Set.of("published", "status", "updatedAt", "createdAt").contains(key))
            throw new IllegalArgumentException("Unsupported IQAC page field: " + key);
        if (page.containsKey("pageTitle")) text(page.get("pageTitle"), "pageTitle", 160, false);
        if (page.containsKey("about")) validateAbout(page.get("about"), complete);
        if (page.containsKey("functions")) validateCards(page.get("functions"), "functions", complete);
        if (page.containsKey("members")) validateMembers(page.get("members"), complete);
        if (page.containsKey("aqar")) validateDocuments(page.get("aqar"), "aqar", complete);
        if (page.containsKey("minutes")) validateDocuments(page.get("minutes"), "minutes", complete);
        if (page.containsKey("resources")) validateResources(page.get("resources"), complete);
        if (complete) {
            if (!(page.get("pageTitle") instanceof String title) || title.isBlank()) throw new IllegalArgumentException("Add an IQAC page title before publishing");
            validateAbout(page.get("about"), true);
            validateMembers(page.get("members"), true);
            validateCards(page.get("functions"), "functions", true);
        }
    }

    private void validateAbout(Object raw, boolean complete) {
        Map<?, ?> about = object(raw, "about");
        fields(about, Set.of("title", "imageUrl", "paragraphs"), "about");
        if (about.containsKey("title")) text(about.get("title"), "about title", 200, complete);
        if (about.containsKey("imageUrl")) url(about.get("imageUrl"), "about imageUrl", false);
        if (about.containsKey("paragraphs")) {
            List<?> paragraphs = list(about.get("paragraphs"), "about paragraphs", 50);
            for (Object item : paragraphs) text(item, "about paragraph", 5_000, complete);
            if (complete && paragraphs.isEmpty()) throw new IllegalArgumentException("Add at least one IQAC about paragraph before publishing");
        } else if (complete) throw new IllegalArgumentException("Add IQAC about paragraphs before publishing");
    }

    private void validateCards(Object raw, String name, boolean complete) {
        Map<?, ?> section = object(raw, name);
        fields(section, Set.of("title", "items"), name);
        if (section.containsKey("title")) text(section.get("title"), name + " title", 200, complete);
        if (section.containsKey("items")) {
            List<?> items = list(section.get("items"), name + " items", 200);
            for (Object item : items) {
                Map<?, ?> card = object(item, name + " item");
                fields(card, Set.of("icon", "title", "description"), name + " item");
                if (card.containsKey("icon")) text(card.get("icon"), name + " icon", 100, false);
                text(card.get("title"), name + " item title", 200, complete);
                if (card.containsKey("description")) text(card.get("description"), name + " item description", 2_000, false);
            }
            if (complete && items.isEmpty()) throw new IllegalArgumentException("Add at least one " + name + " item before publishing");
        } else if (complete) throw new IllegalArgumentException("Add " + name + " items before publishing");
    }

    private void validateMembers(Object raw, boolean complete) {
        Map<?, ?> section = object(raw, "members");
        fields(section, Set.of("title", "rows"), "members");
        if (section.containsKey("title")) text(section.get("title"), "members title", 200, complete);
        if (section.containsKey("rows")) {
            List<?> rows = list(section.get("rows"), "members rows", 500);
            for (int i = 0; i < rows.size(); i++) {
                Map<?, ?> row = object(rows.get(i), "member row");
                fields(row, Set.of("serialNumber", "name", "designation"), "member row");
                if (row.containsKey("serialNumber")) scalarText(row.get("serialNumber"), "member serialNumber", 40);
                text(row.get("name"), "member name", 200, complete);
                text(row.get("designation"), "member designation", 200, complete);
            }
            if (complete && rows.isEmpty()) throw new IllegalArgumentException("Add at least one IQAC member before publishing");
        } else if (complete) throw new IllegalArgumentException("Add IQAC member rows before publishing");
    }

    private void validateDocuments(Object raw, String name, boolean complete) {
        Map<?, ?> section = object(raw, name);
        fields(section, Set.of("title", "documents"), name);
        if (section.containsKey("title")) text(section.get("title"), name + " title", 200, complete);
        if (section.containsKey("documents")) for (Object rawDoc : list(section.get("documents"), name + " documents", 500)) validateDocument(rawDoc, name + " document", complete);
    }

    private void validateResources(Object raw, boolean complete) {
        List<?> resources = list(raw, "resources", 100);
        for (Object rawResource : resources) {
            Map<?, ?> resource = object(rawResource, "resource");
            fields(resource, Set.of("title", "description", "icon", "documents"), "resource");
            text(resource.get("title"), "resource title", 200, complete);
            if (resource.containsKey("description")) text(resource.get("description"), "resource description", 2_000, false);
            if (resource.containsKey("icon")) text(resource.get("icon"), "resource icon", 100, false);
            if (resource.containsKey("documents")) for (Object doc : list(resource.get("documents"), "resource documents", 500)) validateDocument(doc, "resource document", complete);
        }
    }

    private void validateDocument(Object raw, String name, boolean complete) {
        Map<?, ?> document = object(raw, name);
        fields(document, Set.of("year", "title", "label", "url"), name);
        if (document.containsKey("year") || complete) text(document.get("year"), name + " year", 20, complete);
        text(document.get("title"), name + " title", 200, complete);
        if (document.containsKey("label")) text(document.get("label"), name + " label", 120, false);
        url(document.get("url"), name + " url", complete);
    }

    private void url(Object value, String field, boolean required) {
        if (value == null && !required) return;
        if (!required && value instanceof String optional && optional.isBlank()) return;
        if (!(value instanceof String s) || s.isBlank() || s.length() > 2048 || !URL.matcher(s).matches())
            throw new IllegalArgumentException(field + " must be an http(s) or /api/media/ URL");
    }

    private void scalarText(Object value, String field, int max) {
        if (!(value instanceof String) && !(value instanceof Number)) throw new IllegalArgumentException(field + " must be text or a number");
        if (String.valueOf(value).length() > max) throw new IllegalArgumentException(field + " must have at most " + max + " characters");
    }

    private void text(Object value, String field, int max, boolean required) {
        if (value == null && !required) return;
        if (!(value instanceof String s) || (required && s.isBlank()) || s.length() > max)
            throw new IllegalArgumentException(field + " must be text" + (required ? " and not blank" : "") + " with at most " + max + " characters");
    }

    private Map<?, ?> object(Object value, String field) {
        if (!(value instanceof Map<?, ?> map)) throw new IllegalArgumentException(field + " must be a JSON object");
        return map;
    }
    private List<?> list(Object value, String field, int max) {
        if (!(value instanceof List<?> list) || list.size() > max) throw new IllegalArgumentException(field + " must be an array with at most " + max + " entries");
        return list;
    }
    private void fields(Map<?, ?> map, Set<String> allowed, String path) {
        for (Object key : map.keySet()) if (!(key instanceof String s) || !allowed.contains(s)) throw new IllegalArgumentException("Unsupported " + path + " field: " + key);
    }
    private College requireCollege(Long id) {
        return colleges.findById(id).filter(College::isRegistered).orElseThrow(() -> new NoSuchElementException("Registered college not found"));
    }
    private College verifiedCollege(String slug) {
        return colleges.findBySlug(slug).filter(c -> c.isRegistered() && c.isActive() && c.isVerified())
                .orElseThrow(() -> new NoSuchElementException("Published college not found"));
    }
}
