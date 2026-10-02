package com.tncolleges.platform.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.CollegeMediaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

/** College-scoped Campus Life CMS for navigation, feature sections, club lists, and galleries. */
@Service
public class CampusLifePageService {
    private static final Set<String> PAGE_FIELDS = Set.of("menuTitle", "navigationItems", "pages");
    private static final Pattern SLUG = Pattern.compile("^[a-z0-9]+(?:-[a-z0-9]+)*$");
    private static final Pattern URL = Pattern.compile("^(https?://|/api/media/)[^\\s]+$", Pattern.CASE_INSENSITIVE);
    private final CollegeRepository colleges;
    private final CollegeMediaRepository media;
    private final CollegeContentService content;
    private final ObjectMapper mapper;

    public CampusLifePageService(CollegeRepository colleges, CollegeMediaRepository media, CollegeContentService content, ObjectMapper mapper) {
        this.colleges = colleges;
        this.media = media;
        this.content = content;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getForAdmin(Long collegeId) {
        requireRegistered(collegeId);
        Object stored = content.getSection(collegeId, "campusLifePage");
        if (stored instanceof Map<?, ?> map && !map.isEmpty()) return content.asMap(stored);
        return Map.of("published", false, "status", "DRAFT", "menuTitle", "Life @ Campus", "navigationItems", List.of(), "pages", List.of());
    }

    @Transactional
    public Map<String, Object> saveDraft(Long collegeId, Object raw) {
        requireRegistered(collegeId);
        if (!(raw instanceof Map<?, ?>)) throw new IllegalArgumentException("Campus Life content must be a JSON object");
        Map<String, Object> page = mapper.convertValue(raw, new TypeReference<>() { });
        page.keySet().removeIf(key -> Set.of("published", "status", "updatedAt", "createdAt").contains(key));
        validate(page, false);
        validateCollegeMediaReferences(collegeId, page);
        page.put("published", false);
        page.put("status", "DRAFT");
        page.put("updatedAt", LocalDateTime.now().toString());
        content.saveSection(collegeId, "campusLifePage", page);
        return page;
    }

    @Transactional
    public Map<String, Object> setPublished(Long collegeId, boolean published) {
        requireRegistered(collegeId);
        Object stored = content.getSection(collegeId, "campusLifePage");
        if (!(stored instanceof Map<?, ?> map) || map.isEmpty()) throw new NoSuchElementException("Campus Life content not found");
        Map<String, Object> page = content.asMap(stored);
        if (published) {
            validate(page, true);
            validateCollegeMediaReferences(collegeId, page);
        }
        page.put("published", published);
        page.put("status", published ? "PUBLISHED" : "DRAFT");
        page.put("updatedAt", LocalDateTime.now().toString());
        content.saveSection(collegeId, "campusLifePage", page);
        return page;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublic(String collegeSlug) {
        College college = verifiedCollege(collegeSlug);
        Map<String, Object> page = content.publishedCampusLifePage(college.getId());
        if (page.isEmpty()) throw new NoSuchElementException("Published Campus Life content not found");
        Object navigation = page.get("navigationItems");
        if (navigation instanceof List<?> items) {
            page.put("navigationItems", items.stream()
                    .filter(item -> item instanceof Map<?, ?> map && !Boolean.FALSE.equals(map.get("active")))
                    .sorted(Comparator.comparingInt(item -> displayOrder(item)))
                    .toList());
        }
        Object rawPages = page.get("pages");
        if (rawPages instanceof List<?> pages) {
            page.put("pages", pages.stream()
                    .filter(item -> item instanceof Map<?, ?> map && !Boolean.FALSE.equals(map.get("active")))
                    .toList());
        }
        return page;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPublicPage(String collegeSlug, String pageSlug) {
        Map<String, Object> contentPage = getPublic(collegeSlug);
        Object pagesValue = contentPage.get("pages");
        if (pagesValue instanceof List<?> pages) {
            for (Object value : pages) {
                if (value instanceof Map<?, ?> page && pageSlug.equals(page.get("slug")) && !Boolean.FALSE.equals(page.get("active"))) {
                    Map<String, Object> result = new LinkedHashMap<>();
                    result.put("menuTitle", contentPage.getOrDefault("menuTitle", "Life @ Campus"));
                    result.put("navigationItems", contentPage.getOrDefault("navigationItems", List.of()));
                    result.put("page", value);
                    return result;
                }
            }
        }
        throw new NoSuchElementException("Campus Life page not found");
    }

    private boolean hasVisualAsset(Map<?, ?> page) {
        if (nonBlank(page.get("heroImageUrl"))) return true;
        if (page.get("quoteBanner") instanceof Map<?, ?> quote && nonBlank(quote.get("imageUrl"))) return true;
        if (!(page.get("sections") instanceof List<?> sections)) return false;
        for (Object value : sections) {
            if (!(value instanceof Map<?, ?> section)) continue;
            if (nonBlank(section.get("imageUrl"))) return true;
            if (section.get("images") instanceof List<?> images && !images.isEmpty()) return true;
            if (section.get("items") instanceof List<?> items) {
                for (Object item : items) {
                    if (item instanceof Map<?, ?> map && (nonBlank(map.get("imageUrl")) || nonBlank(map.get("logoUrl")))) return true;
                }
            }
        }
        return false;
    }

    private boolean nonBlank(Object value) {
        return value instanceof String text && !text.isBlank();
    }

    private void validateCollegeMediaReferences(Long collegeId, Object value) {
        validateCollegeMediaReferences(collegeId, null, value);
    }

    private void validateCollegeMediaReferences(Long collegeId, String field, Object value) {
        if (value instanceof Map<?, ?> map) {
            map.forEach((key, child) -> validateCollegeMediaReferences(collegeId, String.valueOf(key), child));
            return;
        }
        if (value instanceof List<?> list) {
            list.forEach(child -> validateCollegeMediaReferences(collegeId, field, child));
            return;
        }
        if (value instanceof String url && field != null && field.toLowerCase(Locale.ROOT).endsWith("url") && url.startsWith("/api/media/")) {
            java.util.regex.Matcher matcher = Pattern.compile("^/api/media/([0-9]+)$").matcher(url);
            if (!matcher.matches()) throw new IllegalArgumentException(field + " must reference a valid uploaded image");
            Long mediaId = Long.valueOf(matcher.group(1));
            if (media.findByIdAndCollege_Id(mediaId, collegeId).isEmpty())
                throw new IllegalArgumentException(field + " must reference an image uploaded for this college");
        }
    }

    private void validate(Map<String, Object> page, boolean complete) {
        for (String key : page.keySet()) if (!PAGE_FIELDS.contains(key) && !Set.of("published", "status", "updatedAt", "createdAt").contains(key))
            throw new IllegalArgumentException("Unsupported Campus Life field: " + key);
        if (page.containsKey("menuTitle")) text(page.get("menuTitle"), "menuTitle", 100, complete);
        if (page.containsKey("navigationItems")) validateNavigation(page.get("navigationItems"), complete);
        if (page.containsKey("pages")) validatePages(page.get("pages"));
        if (complete) {
            if (!(page.get("menuTitle") instanceof String title) || title.isBlank()) throw new IllegalArgumentException("Add a navigation title before publishing");
            List<?> nav = list(page.get("navigationItems"), "navigationItems", 50);
            if (nav.stream().noneMatch(item -> item instanceof Map<?, ?> map && !Boolean.FALSE.equals(map.get("active"))))
                throw new IllegalArgumentException("Add at least one active navigation item before publishing");
            List<?> pages = list(page.get("pages"), "pages", 100);
            if (pages.isEmpty()) throw new IllegalArgumentException("Add at least one Campus Life page before publishing");
            for (Object rawPage : pages) {
                boolean active = !(rawPage instanceof Map<?, ?> map) || !Boolean.FALSE.equals(map.get("active"));
                validatePage(rawPage, active);
            }
        }
    }

    private void validateNavigation(Object raw, boolean complete) {
        List<?> items = list(raw, "navigationItems", 50);
        Set<String> slugs = new HashSet<>();
        for (Object value : items) {
            Map<?, ?> item = object(value, "navigation item");
            fields(item, Set.of("title", "slug", "active", "displayOrder"), "navigation item");
            boolean active = !(Boolean.FALSE.equals(item.get("active")));
            text(item.get("title"), "navigation item title", 100, complete && active);
            slug(item.get("slug"), "navigation item slug", complete && active);
            if (item.get("slug") != null && !slugs.add(String.valueOf(item.get("slug")))) throw new IllegalArgumentException("Navigation slugs must be unique");
            if (item.containsKey("active") && !(item.get("active") instanceof Boolean)) throw new IllegalArgumentException("navigation item active must be true or false");
            if (item.containsKey("displayOrder")) integer(item.get("displayOrder"), "navigation item displayOrder", 0, 10000);
        }
    }

    private void validatePages(Object raw) {
        List<?> pages = list(raw, "pages", 100);
        Set<String> slugs = new HashSet<>();
        for (Object value : pages) {
            Map<?, ?> page = object(value, "page");
            slug(page.get("slug"), "page slug", false);
            if (page.get("slug") != null && !slugs.add(String.valueOf(page.get("slug")))) throw new IllegalArgumentException("Campus Life page slugs must be unique");
            validatePage(value, false);
        }
    }

    private void validatePage(Object raw, boolean complete) {
        Map<?, ?> page = object(raw, "page");
        fields(page, Set.of("slug", "title", "active", "heroImageUrl", "intro", "quoteBanner", "sections"), "page");
        slug(page.get("slug"), "page slug", complete);
        text(page.get("title"), "page title", 160, complete);
        if (page.containsKey("active") && !(page.get("active") instanceof Boolean)) throw new IllegalArgumentException("page active must be true or false");
        if (page.containsKey("heroImageUrl")) url(page.get("heroImageUrl"), "heroImageUrl", false);
        if (page.containsKey("intro")) validateIntro(page.get("intro"), complete);
        else if (complete) throw new IllegalArgumentException("Add an introduction to each published page");
        if (page.containsKey("quoteBanner")) validateQuote(page.get("quoteBanner"), complete);
        if (page.containsKey("sections")) {
            List<?> sections = list(page.get("sections"), "sections", 50);
            for (Object section : sections) validateSection(section, complete);
            if (complete && sections.isEmpty()) throw new IllegalArgumentException("Add page sections before publishing");
            if (complete && !hasVisualAsset(page)) throw new IllegalArgumentException("Add at least one image to this Campus Life page before publishing");
        } else if (complete) throw new IllegalArgumentException("Add page sections before publishing");
    }

    private void validateIntro(Object raw, boolean complete) {
        Map<?, ?> intro = object(raw, "intro");
        fields(intro, Set.of("title", "paragraphs"), "intro");
        text(intro.get("title"), "intro title", 200, complete);
        if (intro.containsKey("paragraphs")) {
            List<?> paragraphs = list(intro.get("paragraphs"), "intro paragraphs", 30);
            for (Object paragraph : paragraphs) text(paragraph, "intro paragraph", 5000, complete);
            if (complete && paragraphs.isEmpty()) throw new IllegalArgumentException("Add at least one introduction paragraph");
        } else if (complete) throw new IllegalArgumentException("Add introduction paragraphs");
    }

    private void validateQuote(Object raw, boolean complete) {
        Map<?, ?> quote = object(raw, "quoteBanner");
        fields(quote, Set.of("quote", "imageUrl", "attribution"), "quoteBanner");
        text(quote.get("quote"), "quote", 500, complete);
        if (quote.containsKey("imageUrl")) url(quote.get("imageUrl"), "quote imageUrl", false);
        if (quote.containsKey("attribution")) text(quote.get("attribution"), "quote attribution", 160, false);
    }

    private void validateSection(Object raw, boolean complete) {
        Map<?, ?> section = object(raw, "section");
        Object rawType = section.get("type");
        if (!(rawType instanceof String type) || !Set.of("feature", "clubList", "societyList", "celebrationList", "eventShowcase", "gallery").contains(type))
            throw new IllegalArgumentException("section type must be feature, clubList, societyList, celebrationList, eventShowcase, or gallery");
        Set<String> allowed = new HashSet<>(Set.of("type", "title", "subtitle", "description", "paragraphs", "dateLabel", "imageUrl", "imagePosition", "highlights", "stats", "items", "images"));
        fields(section, allowed, "section");
        text(section.get("title"), "section title", 200, complete);
        if (section.containsKey("subtitle")) text(section.get("subtitle"), "section subtitle", 200, false);
        if (section.containsKey("description")) text(section.get("description"), "section description", 3000, false);
        if (section.containsKey("dateLabel")) text(section.get("dateLabel"), "section dateLabel", 100, false);
        if (section.containsKey("paragraphs")) for (Object p : list(section.get("paragraphs"), "section paragraphs", 30)) text(p, "section paragraph", 5000, complete);
        if (section.containsKey("imageUrl")) url(section.get("imageUrl"), "section imageUrl", false);
        if (section.containsKey("imagePosition")) {
            Object position = section.get("imagePosition");
            if (!(position instanceof String value) || !Set.of("left", "right", "background").contains(value)) throw new IllegalArgumentException("imagePosition must be left, right, or background");
        }
        if (section.containsKey("highlights")) for (Object h : list(section.get("highlights"), "highlights", 50)) text(h, "highlight", 300, complete);
        if (section.containsKey("stats")) validateMetrics(section.get("stats"), complete);
        if ("feature".equals(type) && complete && (!(section.get("paragraphs") instanceof List<?> paragraphs) || paragraphs.isEmpty()))
            throw new IllegalArgumentException("Add descriptive paragraphs to each feature section");
        if ("feature".equals(type) && complete && (!(section.get("imageUrl") instanceof String image) || image.isBlank()))
            throw new IllegalArgumentException("Add an image to each feature section");
        if ("eventShowcase".equals(type) && complete) {
            if (!(section.get("imageUrl") instanceof String image) || image.isBlank()) throw new IllegalArgumentException("Add an event showcase image");
            boolean hasCopy = section.get("description") instanceof String description && !description.isBlank()
                    || section.get("paragraphs") instanceof List<?> paragraphs && !paragraphs.isEmpty();
            if (!hasCopy) throw new IllegalArgumentException("Add event showcase description text");
        }
        if ("clubList".equals(type)) validateClubItems(section.get("items"), complete);
        if ("societyList".equals(type)) validateSocieties(section.get("items"), complete);
        if ("celebrationList".equals(type)) validateCelebrations(section.get("items"), complete);
        if ("gallery".equals(type)) validateImages(section.get("images"), complete);
    }

    private void validateClubItems(Object raw, boolean complete) {
        if (raw == null && !complete) return;
        List<?> items = list(raw, "club items", 500);
        if (complete && items.isEmpty()) throw new IllegalArgumentException("Add at least one club to this section");
        for (Object value : items) {
            Map<?, ?> item = object(value, "club item");
            fields(item, Set.of("title", "category", "url"), "club item");
            text(item.get("title"), "club title", 200, complete);
            if (item.containsKey("category")) text(item.get("category"), "club category", 100, false);
            if (item.containsKey("url")) url(item.get("url"), "club url", false);
        }
    }

    private void validateMetrics(Object raw, boolean complete) {
        for (Object value : list(raw, "event metrics", 30)) {
            Map<?, ?> metric = object(value, "event metric");
            fields(metric, Set.of("value", "label", "icon"), "event metric");
            text(metric.get("value"), "metric value", 50, complete);
            text(metric.get("label"), "metric label", 160, complete);
            if (metric.containsKey("icon")) text(metric.get("icon"), "metric icon", 100, false);
        }
    }

    private void validateCelebrations(Object raw, boolean complete) {
        if (raw == null && !complete) return;
        List<?> items = list(raw, "celebrations", 300);
        if (complete && items.isEmpty()) throw new IllegalArgumentException("Add at least one campus celebration");
        Set<String> names = new HashSet<>();
        for (Object value : items) {
            Map<?, ?> event = object(value, "celebration");
            fields(event, Set.of("name", "description", "dateLabel", "category", "imageUrl", "url", "displayOrder"), "celebration");
            text(event.get("name"), "celebration name", 160, complete);
            if (event.get("name") instanceof String name && !name.isBlank() && !names.add(name.trim().toLowerCase(Locale.ROOT)))
                throw new IllegalArgumentException("Celebration names must be unique within a page");
            if (event.containsKey("description")) text(event.get("description"), "celebration description", 3000, false);
            if (event.containsKey("dateLabel")) text(event.get("dateLabel"), "celebration dateLabel", 100, false);
            if (event.containsKey("category")) text(event.get("category"), "celebration category", 100, false);
            if (event.containsKey("imageUrl")) url(event.get("imageUrl"), "celebration imageUrl", false);
            if (event.containsKey("url")) externalUrl(event.get("url"), "celebration url");
            if (event.containsKey("displayOrder")) integer(event.get("displayOrder"), "celebration displayOrder", 0, 10000);
        }
    }

    private void validateSocieties(Object raw, boolean complete) {
        if (raw == null && !complete) return;
        List<?> items = list(raw, "societies", 300);
        if (complete && items.isEmpty()) throw new IllegalArgumentException("Add at least one professional society");
        Set<String> names = new HashSet<>();
        for (Object value : items) {
            Map<?, ?> society = object(value, "professional society");
            fields(society, Set.of("name", "acronym", "description", "department", "logoUrl", "websiteUrl", "activities", "coordinatorName", "coordinatorDesignation", "displayOrder"), "professional society");
            text(society.get("name"), "society name", 160, complete);
            if (society.containsKey("name") && society.get("name") instanceof String name && !name.isBlank() && !names.add(name.trim().toLowerCase(Locale.ROOT)))
                throw new IllegalArgumentException("Professional society names must be unique within a page");
            if (society.containsKey("acronym")) text(society.get("acronym"), "society acronym", 30, false);
            if (society.containsKey("description")) text(society.get("description"), "society description", 3000, complete);
            if (society.containsKey("department")) text(society.get("department"), "society department", 120, false);
            if (society.containsKey("logoUrl")) url(society.get("logoUrl"), "society logoUrl", false);
            if (society.containsKey("websiteUrl")) externalUrl(society.get("websiteUrl"), "society websiteUrl");
            if (society.containsKey("activities")) {
                List<?> activities = list(society.get("activities"), "society activities", 100);
                for (Object activity : activities) text(activity, "society activity", 300, complete);
            }
            if (society.containsKey("coordinatorName")) text(society.get("coordinatorName"), "society coordinatorName", 160, false);
            if (society.containsKey("coordinatorDesignation")) text(society.get("coordinatorDesignation"), "society coordinatorDesignation", 120, false);
            if (society.containsKey("displayOrder")) integer(society.get("displayOrder"), "society displayOrder", 0, 10000);
        }
    }

    private void externalUrl(Object value, String field) {
        if (value == null || value instanceof String s && s.isBlank()) return;
        if (!(value instanceof String s) || s.length() > 2048 || !Pattern.compile("^https?://[^\\s]+$", Pattern.CASE_INSENSITIVE).matcher(s).matches())
            throw new IllegalArgumentException(field + " must be an http(s) URL");
    }

    private void validateImages(Object raw, boolean complete) {
        if (raw == null && !complete) return;
        List<?> images = list(raw, "images", 500);
        if (complete && images.isEmpty()) throw new IllegalArgumentException("Add at least one gallery image");
        for (Object value : images) {
            Map<?, ?> image = object(value, "gallery image");
            fields(image, Set.of("url", "alt", "caption"), "gallery image");
            url(image.get("url"), "gallery image url", complete);
            if (image.containsKey("alt")) text(image.get("alt"), "gallery image alt", 250, false);
            if (image.containsKey("caption")) text(image.get("caption"), "gallery image caption", 500, false);
        }
    }

    private int displayOrder(Object value) {
        if (value instanceof Map<?, ?> map && map.get("displayOrder") instanceof Number order) return order.intValue();
        return 0;
    }
    private void slug(Object value, String field, boolean required) {
        if (value == null && !required) return;
        if (!required && value instanceof String s && s.isBlank()) return;
        if (!(value instanceof String s) || s.length() > 100 || !SLUG.matcher(s).matches()) throw new IllegalArgumentException(field + " must contain lowercase letters, numbers, and hyphens only");
    }
    private void url(Object value, String field, boolean required) {
        if (value == null && !required) return;
        if (!required && value instanceof String s && s.isBlank()) return;
        if (!(value instanceof String s) || s.isBlank() || s.length() > 2048 || !URL.matcher(s).matches()) throw new IllegalArgumentException(field + " must be an http(s) or /api/media/ URL");
    }
    private void text(Object value, String field, int max, boolean required) {
        if (value == null && !required) return;
        if (!(value instanceof String s) || (required && s.isBlank()) || s.length() > max) throw new IllegalArgumentException(field + " must be text" + (required ? " and not blank" : "") + " with at most " + max + " characters");
    }
    private int integer(Object value, String field, int min, int max) {
        if (!(value instanceof Number number)) throw new IllegalArgumentException(field + " must be a number");
        int result = number.intValue();
        if (result < min || result > max || number.doubleValue() != result) throw new IllegalArgumentException(field + " must be between " + min + " and " + max);
        return result;
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
    private College requireRegistered(Long id) {
        return colleges.findById(id).filter(College::isRegistered).orElseThrow(() -> new NoSuchElementException("Registered college not found"));
    }
    private College verifiedCollege(String slug) {
        return colleges.findBySlug(slug).filter(c -> c.isRegistered() && c.isActive() && c.isVerified()).orElseThrow(() -> new NoSuchElementException("Published college not found"));
    }
}
