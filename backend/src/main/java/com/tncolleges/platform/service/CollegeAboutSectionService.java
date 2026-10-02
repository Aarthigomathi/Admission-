package com.tncolleges.platform.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.dto.AboutSectionResponse;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.CollegeSection;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.CollegeSectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.regex.Pattern;

/** Persists editable, publishable About/Profile blocks for each college. */
@Service
public class CollegeAboutSectionService {
    private static final Set<String> SECTION_KEYS = Set.of(
            "PROFILE", "VISION_MISSION", "MANAGEMENT_PROFILE", "ORGANIZATIONAL_STRUCTURE",
            "CENTER_OF_EXCELLENCE", "ACCREDITATIONS", "PROGRAMMES", "PLACEMENTS");
    private static final Set<String> CONTENT_TYPES = Set.of(
            "TEXT", "RICH_TEXT", "STRUCTURED", "IMAGE", "GALLERY", "VIDEO", "DOCUMENT", "CUSTOM");
    private static final Set<String> VISION_MISSION_FIELDS = Set.of(
            "vision", "mission", "coreValues", "visionTitle", "missionTitle", "coreValuesTitle");
    private static final Set<String> MANAGEMENT_PROFILE_FIELDS = Set.of("profiles");
    private static final Set<String> MANAGEMENT_PROFILE_ITEM_FIELDS = Set.of(
            "designation", "name", "biography", "imageUrl", "imagePosition");
    private static final Set<String> CENTER_OF_EXCELLENCE_FIELDS = Set.of("categories", "featuredCenters");
    private static final Set<String> CENTER_CATEGORY_FIELDS = Set.of("title", "partners");
    private static final Set<String> CENTER_PARTNER_FIELDS = Set.of("name", "logoUrl", "linkUrl");
    private static final Set<String> FEATURED_CENTER_FIELDS = Set.of(
            "title", "description", "imageUrl", "linkLabel", "linkUrl");
    private static final Set<String> ACCREDITATION_PAGE_FIELDS = Set.of(
            "accreditations", "recognitionStatement", "partnershipsIntro", "mousAndCenters",
            "electivesHeading", "electivesDescription", "electivePartners");
    private static final Set<String> ACCREDITATION_FIELDS = Set.of(
            "name", "logoUrl", "grade", "description", "linkLabel", "linkUrl", "departments");
    private static final Set<String> PARTNER_FIELDS = Set.of("name", "logoUrl", "caption", "linkUrl");
    private static final Pattern SAFE_URL = Pattern.compile("^(https?://|/api/media/)[^\\s]+$", Pattern.CASE_INSENSITIVE);
    private static final int MAX_CONTENT_LENGTH = 250_000;
    private static final int MAX_URL_LENGTH = 2_048;

    private final CollegeRepository colleges;
    private final CollegeSectionRepository sections;
    private final ObjectMapper objectMapper;

    public CollegeAboutSectionService(CollegeRepository colleges, CollegeSectionRepository sections, ObjectMapper objectMapper) {
        this.colleges = colleges;
        this.sections = sections;
        this.objectMapper = objectMapper;
    }

    @Transactional(readOnly = true)
    public List<AboutSectionResponse> listForAdmin(Long collegeId) {
        requireCollege(collegeId);
        return sections.findByCollege_IdOrderByDisplayOrderAscIdAsc(collegeId).stream()
                .map(section -> AboutSectionResponse.from(section, objectMapper)).toList();
    }

    @Transactional(readOnly = true)
    public List<AboutSectionResponse> listPublishedBySlug(String slug) {
        College college = colleges.findBySlug(slug)
                .filter(item -> item.isRegistered() && item.isActive() && item.isVerified())
                .orElseThrow(() -> new NoSuchElementException("Published college not found"));
        return sections.findByCollege_IdOrderByDisplayOrderAscIdAsc(college.getId()).stream()
                .filter(CollegeSection::isPublished)
                .map(section -> AboutSectionResponse.from(section, objectMapper)).toList();
    }

    @Transactional
    public AboutSectionResponse create(Long collegeId, Map<String, Object> request) {
        College college = requireCollege(collegeId);
        String sectionKey = sectionKey(request.get("sectionKey"));
        String title = requiredText(request.get("title"), "title", 200);
        String type = contentType(request.get("type"));
        Integer order = displayOrder(request.get("displayOrder"), 0);
        if (request.containsKey("data") && request.containsKey("content")) {
            throw new IllegalArgumentException("Send either content or data, not both");
        }
        Object rawContent = request.containsKey("data") ? request.get("data") : request.get("content");
        if (request.containsKey("data")) type = "STRUCTURED";
        String content = sectionContent(sectionKey, type, rawContent);
        String imageUrl = url(request.get("imageUrl"), "imageUrl");
        String videoUrl = url(request.get("videoUrl"), "videoUrl");
        String documentUrl = url(request.get("documentUrl"), "documentUrl");
        String linkUrl = url(request.get("linkUrl"), "linkUrl");
        if (content.isBlank() && imageUrl.isBlank() && videoUrl.isBlank() && documentUrl.isBlank() && linkUrl.isBlank()) {
            throw new IllegalArgumentException("Add section content or at least one image, video, document, or link");
        }

        LocalDateTime now = LocalDateTime.now();
        CollegeSection section = CollegeSection.builder()
                .college(college)
                .sectionKey(sectionKey)
                .title(title)
                .content(content)
                .type(type)
                .imageUrl(imageUrl)
                .videoUrl(videoUrl)
                .documentUrl(documentUrl)
                .linkUrl(linkUrl)
                .displayOrder(order)
                .isPublished(false)
                .isDraft(true)
                .status("DRAFT")
                .createdAt(now)
                .updatedAt(now)
                .build();
        return AboutSectionResponse.from(sections.save(section), objectMapper);
    }

    @Transactional
    public AboutSectionResponse update(Long collegeId, Long sectionId, Map<String, Object> updates) {
        CollegeSection section = findManagedSection(collegeId, sectionId);
        if (updates.containsKey("sectionKey")) section.setSectionKey(sectionKey(updates.get("sectionKey")));
        if (updates.containsKey("title")) section.setTitle(requiredText(updates.get("title"), "title", 200));
        if (updates.containsKey("type")) section.setType(contentType(updates.get("type")));
        if (updates.containsKey("data") && updates.containsKey("content")) {
            throw new IllegalArgumentException("Send either content or data, not both");
        }
        if (updates.containsKey("data")) {
            section.setType("STRUCTURED");
            section.setContent(sectionContent(section.getSectionKey(), "STRUCTURED", updates.get("data")));
        } else if (updates.containsKey("content")) {
            section.setContent(sectionContent(section.getSectionKey(), section.getType(), updates.get("content")));
        }
        if (updates.containsKey("imageUrl")) section.setImageUrl(url(updates.get("imageUrl"), "imageUrl"));
        if (updates.containsKey("videoUrl")) section.setVideoUrl(url(updates.get("videoUrl"), "videoUrl"));
        if (updates.containsKey("documentUrl")) section.setDocumentUrl(url(updates.get("documentUrl"), "documentUrl"));
        if (updates.containsKey("linkUrl")) section.setLinkUrl(url(updates.get("linkUrl"), "linkUrl"));
        if (updates.containsKey("displayOrder")) section.setDisplayOrder(displayOrder(updates.get("displayOrder"), section.getDisplayOrder()));
        if (blank(section.getContent()) && blank(section.getImageUrl()) && blank(section.getVideoUrl())
                && blank(section.getDocumentUrl()) && blank(section.getLinkUrl())) {
            throw new IllegalArgumentException("Add section content or at least one image, video, document, or link");
        }
        section.setUpdatedAt(LocalDateTime.now());
        return AboutSectionResponse.from(sections.save(section), objectMapper);
    }

    @Transactional
    public AboutSectionResponse setPublished(Long collegeId, Long sectionId, boolean published) {
        CollegeSection section = findManagedSection(collegeId, sectionId);
        if (published && "STRUCTURED".equals(section.getType())) {
            Object data = parseStructuredData(section.getContent());
            if ("VISION_MISSION".equals(section.getSectionKey())) validateVisionMissionData(data, true);
            if ("MANAGEMENT_PROFILE".equals(section.getSectionKey())) validateManagementProfilesData(data, true);
            if ("CENTER_OF_EXCELLENCE".equals(section.getSectionKey())) validateCenterOfExcellenceData(data, true);
            if ("ACCREDITATIONS".equals(section.getSectionKey())) validateAccreditationPageData(data, true);
        }
        section.setPublished(published);
        section.setDraft(!published);
        section.setStatus(published ? "PUBLISHED" : "DRAFT");
        section.setUpdatedAt(LocalDateTime.now());
        return AboutSectionResponse.from(sections.save(section), objectMapper);
    }

    @Transactional
    public void delete(Long collegeId, Long sectionId) {
        sections.delete(findManagedSection(collegeId, sectionId));
    }

    private CollegeSection findManagedSection(Long collegeId, Long sectionId) {
        requireCollege(collegeId);
        return sections.findByIdAndCollege_Id(sectionId, collegeId)
                .orElseThrow(() -> new NoSuchElementException("About section not found for this college"));
    }

    private College requireCollege(Long collegeId) {
        return colleges.findById(collegeId).filter(College::isRegistered)
                .orElseThrow(() -> new NoSuchElementException("Registered college not found"));
    }

    private String sectionKey(Object raw) {
        if (raw == null) throw new IllegalArgumentException("sectionKey is required");
        String normalized = String.valueOf(raw).trim().toUpperCase(Locale.ROOT)
                .replaceAll("[\\s-]+", "_");
        if (!SECTION_KEYS.contains(normalized)) {
            throw new IllegalArgumentException("sectionKey must be one of: " + String.join(", ", SECTION_KEYS));
        }
        return normalized;
    }

    private String contentType(Object raw) {
        String type = raw == null || String.valueOf(raw).isBlank()
                ? "TEXT" : String.valueOf(raw).trim().toUpperCase(Locale.ROOT).replace('-', '_').replace(' ', '_');
        if (!CONTENT_TYPES.contains(type)) throw new IllegalArgumentException("Unsupported About section type");
        return type;
    }

    private String requiredText(Object raw, String field, int maxLength) {
        if (!(raw instanceof String text)) throw new IllegalArgumentException(field + " must be text");
        String value = text.trim();
        if (value.isBlank()) throw new IllegalArgumentException(field + " is required");
        if (value.length() > maxLength) throw new IllegalArgumentException(field + " must be at most " + maxLength + " characters");
        return value;
    }

    private String sectionContent(String sectionKey, String type, Object raw) {
        if ("STRUCTURED".equals(type)) {
            Object data = raw instanceof String text ? parseStructuredData(text) : raw;
            if (!(data instanceof Map<?, ?>)) {
                throw new IllegalArgumentException("Structured About data must be a JSON object");
            }
            if ("VISION_MISSION".equals(sectionKey)) validateVisionMissionData(data, false);
            if ("MANAGEMENT_PROFILE".equals(sectionKey)) validateManagementProfilesData(data, false);
            if ("CENTER_OF_EXCELLENCE".equals(sectionKey)) validateCenterOfExcellenceData(data, false);
            if ("ACCREDITATIONS".equals(sectionKey)) validateAccreditationPageData(data, false);
            try {
                String json = objectMapper.writeValueAsString(data);
                if (json.length() > MAX_CONTENT_LENGTH) throw new IllegalArgumentException("data exceeds the maximum supported length");
                return json;
            } catch (JsonProcessingException exception) {
                throw new IllegalArgumentException("Structured About data must be valid JSON");
            }
        }
        if (raw != null && !(raw instanceof String)) {
            throw new IllegalArgumentException("Send text content as a string; use type STRUCTURED for JSON objects");
        }
        String value = raw == null ? "" : (String) raw;
        if (value.length() > MAX_CONTENT_LENGTH) throw new IllegalArgumentException("content exceeds the maximum supported length");
        return value;
    }

    private Object parseStructuredData(String json) {
        try {
            return objectMapper.readValue(json, Object.class);
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException("Structured content must be valid JSON");
        }
    }

    private void validateVisionMissionData(Object raw, boolean requireComplete) {
        if (!(raw instanceof Map<?, ?> data)) {
            throw new IllegalArgumentException("Vision and Mission data must be a JSON object");
        }
        for (Object key : data.keySet()) {
            if (!(key instanceof String field) || !VISION_MISSION_FIELDS.contains(field)) {
                throw new IllegalArgumentException("Unsupported Vision and Mission data field: " + key);
            }
        }

        boolean hasContent = false;
        if (data.containsKey("vision")) {
            String vision = optionalText(data.get("vision"), "vision", 10_000);
            hasContent |= !vision.isBlank();
        }
        if (data.containsKey("mission")) {
            Object rawMissions = data.get("mission");
            if (!(rawMissions instanceof List<?> missions) || missions.size() > 30) {
                throw new IllegalArgumentException("mission must be a list containing at most 30 items");
            }
            for (Object item : missions) requiredText(item, "mission item", 3_000);
            hasContent |= !missions.isEmpty();
        }
        if (data.containsKey("coreValues")) {
            Object rawValues = data.get("coreValues");
            if (!(rawValues instanceof List<?> values) || values.size() > 24) {
                throw new IllegalArgumentException("coreValues must be a list containing at most 24 items");
            }
            for (Object rawValue : values) {
                if (!(rawValue instanceof Map<?, ?> value)) {
                    throw new IllegalArgumentException("Each core value must contain a title and description");
                }
                requiredText(value.get("title"), "core value title", 160);
                requiredText(value.get("description"), "core value description", 2_000);
                Object icon = value.get("icon");
                if (icon != null && !optionalText(icon, "core value icon", 64).matches("[A-Za-z0-9_-]*")) {
                    throw new IllegalArgumentException("core value icon must be a simple icon name");
                }
            }
            hasContent |= !values.isEmpty();
        }
        for (String titleField : List.of("visionTitle", "missionTitle", "coreValuesTitle")) {
            if (data.containsKey(titleField)) optionalText(data.get(titleField), titleField, 120);
        }
        if (!hasContent) throw new IllegalArgumentException("Add vision, mission items, or core values");
        if (requireComplete) {
            if (!(data.get("vision") instanceof String vision) || vision.isBlank()) {
                throw new IllegalArgumentException("Add the vision text before publishing this section");
            }
            if (!(data.get("mission") instanceof List<?> missions) || missions.isEmpty()) {
                throw new IllegalArgumentException("Add at least one mission item before publishing this section");
            }
            if (!(data.get("coreValues") instanceof List<?> values) || values.isEmpty()) {
                throw new IllegalArgumentException("Add at least one core value before publishing this section");
            }
        }
    }

    private void validateManagementProfilesData(Object raw, boolean requireComplete) {
        if (!(raw instanceof Map<?, ?> data)) {
            throw new IllegalArgumentException("Management Profile data must be a JSON object");
        }
        for (Object key : data.keySet()) {
            if (!(key instanceof String field) || !MANAGEMENT_PROFILE_FIELDS.contains(field)) {
                throw new IllegalArgumentException("Unsupported Management Profile data field: " + key);
            }
        }
        Object rawProfiles = data.get("profiles");
        if (!(rawProfiles instanceof List<?> profiles) || profiles.size() > 50) {
            throw new IllegalArgumentException("profiles must be a list containing at most 50 people");
        }
        if (requireComplete && profiles.isEmpty()) {
            throw new IllegalArgumentException("Add at least one management profile before publishing this section");
        }
        for (Object rawProfile : profiles) {
            if (!(rawProfile instanceof Map<?, ?> profile)) {
                throw new IllegalArgumentException("Each management profile must be a JSON object");
            }
            for (Object key : profile.keySet()) {
                if (!(key instanceof String field) || !MANAGEMENT_PROFILE_ITEM_FIELDS.contains(field)) {
                    throw new IllegalArgumentException("Unsupported management profile field: " + key);
                }
            }
            if (profile.containsKey("designation")) optionalText(profile.get("designation"), "designation", 120);
            if (profile.containsKey("name")) optionalText(profile.get("name"), "name", 160);
            if (profile.containsKey("biography")) validateBiography(profile.get("biography"));
            if (profile.containsKey("imageUrl")) {
                String imageUrl = optionalText(profile.get("imageUrl"), "imageUrl", MAX_URL_LENGTH);
                url(imageUrl, "imageUrl");
            }
            if (profile.containsKey("imagePosition")) {
                String position = optionalText(profile.get("imagePosition"), "imagePosition", 16).toUpperCase(Locale.ROOT);
                if (!Set.of("LEFT", "RIGHT", "AUTO").contains(position)) {
                    throw new IllegalArgumentException("imagePosition must be LEFT, RIGHT, or AUTO");
                }
            }
            if (requireComplete) {
                requiredText(profile.get("designation"), "designation", 120);
                requiredText(profile.get("name"), "name", 160);
                if (!hasBiography(profile.get("biography"))) {
                    throw new IllegalArgumentException("Add biography text for each management profile before publishing");
                }
            }
        }
    }

    private void validateCenterOfExcellenceData(Object raw, boolean requireComplete) {
        if (!(raw instanceof Map<?, ?> data)) {
            throw new IllegalArgumentException("Center of Excellence data must be a JSON object");
        }
        for (Object key : data.keySet()) {
            if (!(key instanceof String field) || !CENTER_OF_EXCELLENCE_FIELDS.contains(field)) {
                throw new IllegalArgumentException("Unsupported Center of Excellence data field: " + key);
            }
        }
        List<?> categories = List.of();
        List<?> featuredCenters = List.of();
        if (data.containsKey("categories")) {
            if (!(data.get("categories") instanceof List<?> values) || values.size() > 40) {
                throw new IllegalArgumentException("categories must be a list containing at most 40 groups");
            }
            categories = values;
        }
        if (data.containsKey("featuredCenters")) {
            if (!(data.get("featuredCenters") instanceof List<?> values) || values.size() > 30) {
                throw new IllegalArgumentException("featuredCenters must be a list containing at most 30 items");
            }
            featuredCenters = values;
        }
        boolean hasContent = false;
        for (Object rawCategory : categories) {
            if (!(rawCategory instanceof Map<?, ?> category)) {
                throw new IllegalArgumentException("Each center category must be a JSON object");
            }
            assertAllowedFields(category, CENTER_CATEGORY_FIELDS, "center category");
            if (category.containsKey("title")) optionalText(category.get("title"), "category title", 160);
            List<?> partners = List.of();
            if (category.containsKey("partners")) {
                if (!(category.get("partners") instanceof List<?> values) || values.size() > 50) {
                    throw new IllegalArgumentException("Each category partners field must contain at most 50 items");
                }
                partners = values;
            }
            hasContent |= !partners.isEmpty();
            for (Object rawPartner : partners) {
                if (!(rawPartner instanceof Map<?, ?> partner)) {
                    throw new IllegalArgumentException("Each partner logo must be a JSON object");
                }
                assertAllowedFields(partner, CENTER_PARTNER_FIELDS, "partner logo");
                if (partner.containsKey("name")) optionalText(partner.get("name"), "partner name", 160);
                if (partner.containsKey("logoUrl")) {
                    String logoUrl = optionalText(partner.get("logoUrl"), "logoUrl", MAX_URL_LENGTH);
                    url(logoUrl, "logoUrl");
                }
                if (partner.containsKey("linkUrl")) safeExternalLink(partner.get("linkUrl"), "partner linkUrl");
                if (requireComplete) {
                    requiredText(partner.get("name"), "partner name", 160);
                    String logoUrl = requiredText(partner.get("logoUrl"), "partner logoUrl", MAX_URL_LENGTH);
                    url(logoUrl, "partner logoUrl");
                }
            }
            if (requireComplete) {
                requiredText(category.get("title"), "category title", 160);
                if (partners.isEmpty()) throw new IllegalArgumentException("Each published category must contain at least one partner logo");
            }
        }
        for (Object rawFeature : featuredCenters) {
            if (!(rawFeature instanceof Map<?, ?> feature)) {
                throw new IllegalArgumentException("Each featured center must be a JSON object");
            }
            assertAllowedFields(feature, FEATURED_CENTER_FIELDS, "featured center");
            if (feature.containsKey("title")) optionalText(feature.get("title"), "featured center title", 200);
            if (feature.containsKey("description")) validateParagraphText(feature.get("description"), "featured center description");
            if (feature.containsKey("imageUrl")) {
                String imageUrl = optionalText(feature.get("imageUrl"), "featured center imageUrl", MAX_URL_LENGTH);
                url(imageUrl, "featured center imageUrl");
            }
            if (feature.containsKey("linkLabel")) optionalText(feature.get("linkLabel"), "linkLabel", 80);
            if (feature.containsKey("linkUrl")) safeExternalLink(feature.get("linkUrl"), "featured center linkUrl");
            if (requireComplete) {
                requiredText(feature.get("title"), "featured center title", 200);
                if (!hasParagraphText(feature.get("description"))) {
                    throw new IllegalArgumentException("Add a description for each featured center before publishing");
                }
            }
            hasContent = true;
        }
        if (!hasContent) throw new IllegalArgumentException("Add a center category with partner logos or a featured center");
        if (requireComplete && categories.isEmpty() && featuredCenters.isEmpty()) {
            throw new IllegalArgumentException("Add a category or featured center before publishing");
        }
    }

    private void validateAccreditationPageData(Object raw, boolean requireComplete) {
        if (!(raw instanceof Map<?, ?> data)) {
            throw new IllegalArgumentException("Accreditations data must be a JSON object");
        }
        assertAllowedFields(data, ACCREDITATION_PAGE_FIELDS, "Accreditations page");
        for (String field : List.of("recognitionStatement", "partnershipsIntro", "electivesHeading", "electivesDescription")) {
            if (data.containsKey(field)) optionalText(data.get(field), field, 2_000);
        }

        List<?> accreditations = listField(data, "accreditations", 30);
        List<?> mousAndCenters = listField(data, "mousAndCenters", 100);
        List<?> electivePartners = listField(data, "electivePartners", 100);
        boolean hasContent = !accreditations.isEmpty() || !mousAndCenters.isEmpty() || !electivePartners.isEmpty();

        for (Object rawAccreditation : accreditations) {
            if (!(rawAccreditation instanceof Map<?, ?> accreditation)) {
                throw new IllegalArgumentException("Each accreditation must be a JSON object");
            }
            assertAllowedFields(accreditation, ACCREDITATION_FIELDS, "accreditation");
            if (accreditation.containsKey("name")) optionalText(accreditation.get("name"), "accreditation name", 200);
            if (accreditation.containsKey("logoUrl")) {
                String logoUrl = optionalText(accreditation.get("logoUrl"), "accreditation logoUrl", MAX_URL_LENGTH);
                url(logoUrl, "accreditation logoUrl");
            }
            if (accreditation.containsKey("grade")) optionalText(accreditation.get("grade"), "grade", 80);
            if (accreditation.containsKey("description")) validateParagraphText(accreditation.get("description"), "accreditation description");
            if (accreditation.containsKey("linkLabel")) optionalText(accreditation.get("linkLabel"), "linkLabel", 80);
            if (accreditation.containsKey("linkUrl")) safeExternalLink(accreditation.get("linkUrl"), "accreditation linkUrl");
            List<?> departments = listField(accreditation, "departments", 100);
            for (Object department : departments) requiredText(department, "accredited department", 160);
            if (requireComplete) {
                requiredText(accreditation.get("name"), "accreditation name", 200);
                String logoUrl = requiredText(accreditation.get("logoUrl"), "accreditation logoUrl", MAX_URL_LENGTH);
                url(logoUrl, "accreditation logoUrl");
                if (!hasParagraphText(accreditation.get("description"))) {
                    throw new IllegalArgumentException("Add a description for each accreditation before publishing");
                }
            }
        }
        validatePartnerList(mousAndCenters, "MoU or Centre of Excellence", requireComplete);
        validatePartnerList(electivePartners, "elective partner", requireComplete);

        if (!hasContent) throw new IllegalArgumentException("Add at least one accreditation, MoU/Centre, or elective partner");
    }

    private List<?> listField(Map<?, ?> data, String field, int maxItems) {
        if (!data.containsKey(field)) return List.of();
        Object raw = data.get(field);
        if (!(raw instanceof List<?> values) || values.size() > maxItems) {
            throw new IllegalArgumentException(field + " must be a list containing at most " + maxItems + " items");
        }
        return values;
    }

    private void validatePartnerList(List<?> partners, String label, boolean requireComplete) {
        for (Object rawPartner : partners) {
            if (!(rawPartner instanceof Map<?, ?> partner)) {
                throw new IllegalArgumentException("Each " + label + " must be a JSON object");
            }
            assertAllowedFields(partner, PARTNER_FIELDS, label);
            if (partner.containsKey("name")) optionalText(partner.get("name"), label + " name", 200);
            if (partner.containsKey("logoUrl")) {
                String logoUrl = optionalText(partner.get("logoUrl"), label + " logoUrl", MAX_URL_LENGTH);
                url(logoUrl, label + " logoUrl");
            }
            if (partner.containsKey("caption")) optionalText(partner.get("caption"), "caption", 300);
            if (partner.containsKey("linkUrl")) safeExternalLink(partner.get("linkUrl"), label + " linkUrl");
            if (requireComplete) {
                requiredText(partner.get("name"), label + " name", 200);
                String logoUrl = requiredText(partner.get("logoUrl"), label + " logoUrl", MAX_URL_LENGTH);
                url(logoUrl, label + " logoUrl");
            }
        }
    }

    private void assertAllowedFields(Map<?, ?> object, Set<String> allowed, String label) {
        for (Object key : object.keySet()) {
            if (!(key instanceof String field) || !allowed.contains(field)) {
                throw new IllegalArgumentException("Unsupported " + label + " field: " + key);
            }
        }
    }

    private void validateParagraphText(Object raw, String field) {
        if (raw instanceof String text) {
            if (text.length() > 100_000) throw new IllegalArgumentException(field + " must be at most 100000 characters");
            return;
        }
        if (raw instanceof List<?> paragraphs && paragraphs.size() <= 30) {
            for (Object paragraph : paragraphs) requiredText(paragraph, field + " paragraph", 10_000);
            return;
        }
        throw new IllegalArgumentException(field + " must be text or a list of up to 30 text paragraphs");
    }

    private boolean hasParagraphText(Object raw) {
        if (raw instanceof String text) return !text.isBlank();
        return raw instanceof List<?> paragraphs && !paragraphs.isEmpty();
    }

    private void safeExternalLink(Object raw, String field) {
        String value = optionalText(raw, field, MAX_URL_LENGTH);
        if (!value.isBlank() && !Pattern.matches("^https?://[^\\s]+$", value)) {
            throw new IllegalArgumentException(field + " must be an http(s) URL");
        }
    }

    private void validateBiography(Object raw) {
        if (raw instanceof String text) {
            if (text.length() > 100_000) throw new IllegalArgumentException("biography must be at most 100000 characters");
            return;
        }
        if (raw instanceof List<?> paragraphs && paragraphs.size() <= 30) {
            for (Object paragraph : paragraphs) requiredText(paragraph, "biography paragraph", 10_000);
            return;
        }
        throw new IllegalArgumentException("biography must be text or a list of up to 30 text paragraphs");
    }

    private boolean hasBiography(Object raw) {
        if (raw instanceof String text) return !text.isBlank();
        return raw instanceof List<?> paragraphs && !paragraphs.isEmpty();
    }

    private String optionalText(Object raw, String field, int maxLength) {
        if (raw != null && !(raw instanceof String)) throw new IllegalArgumentException(field + " must be text");
        String value = raw == null ? "" : ((String) raw).trim();
        if (value.length() > maxLength) throw new IllegalArgumentException(field + " must be at most " + maxLength + " characters");
        return value;
    }

    private String url(Object raw, String field) {
        String value = raw == null ? "" : String.valueOf(raw).trim();
        if (value.isBlank()) return "";
        if (value.length() > MAX_URL_LENGTH || !SAFE_URL.matcher(value).matches()) {
            throw new IllegalArgumentException(field + " must be an http(s) URL or an /api/media/ URL");
        }
        return value;
    }

    private boolean blank(String value) { return value == null || value.isBlank(); }

    private Integer displayOrder(Object raw, Integer fallback) {
        if (raw == null || String.valueOf(raw).isBlank()) return fallback == null ? 0 : fallback;
        try {
            int value = Integer.parseInt(String.valueOf(raw));
            if (value < 0 || value > 10_000) throw new NumberFormatException();
            return value;
        } catch (NumberFormatException exception) {
            throw new IllegalArgumentException("displayOrder must be between 0 and 10000");
        }
    }
}
