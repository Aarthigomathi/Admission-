package com.tncolleges.platform.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.CollegeContent;
import com.tncolleges.platform.repository.CollegeContentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CollegeContentService {
    private static final List<String> SECTIONS = List.of(
            "about", "aboutPages", "branding", "departments", "deptPages", "homePage", "tagline", "courses",
            "admissions", "admissionProcess", "contactDetails", "contacts", "faculty", "placements", "careers",
            "events", "announcements", "news", "gallery", "documents", "campus", "campusEnvironment", "library",
            "sports", "hostels", "facilities", "customFacilities", "studentServices", "transport", "clubs", "alumni",
            "achievements", "awards", "testimonials", "scholarships", "management", "principal", "principalDetails",
            "research", "researchCentres", "accreditations", "rankings", "committees", "faqs", "importantLinks",
            "socialLinks", "grievance", "antiRagging", "settings", "updatedAt"
    );

    private static final Set<String> ARRAY_SECTIONS = Set.of(
            "departments", "courses", "contacts", "faculty", "placements", "careers", "events", "announcements",
            "news", "gallery", "documents", "hostels", "customFacilities", "studentServices", "clubs", "alumni",
            "achievements", "awards", "testimonials", "scholarships", "research", "researchCentres", "accreditations",
            "rankings", "committees", "faqs", "importantLinks", "socialLinks", "grievance", "antiRagging"
    );

    private final CollegeContentRepository repository;
    private final ObjectMapper objectMapper;

    public CollegeContentService(CollegeContentRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public List<String> sections() {
        return SECTIONS;
    }

    public boolean supports(String section) {
        return SECTIONS.contains(section);
    }

    @Transactional(readOnly = true)
    public Object getSection(Long collegeId, String section) {
        return repository.findByCollegeIdAndSection(collegeId, section)
                .map(content -> read(content.getData()))
                .orElseGet(() -> defaultValue(section));
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAll(Long collegeId) {
        Map<String, Object> result = new LinkedHashMap<>();
        for (CollegeContent content : repository.findAllByCollegeId(collegeId)) {
            result.put(content.getSection(), read(content.getData()));
        }
        for (String section : SECTIONS) result.putIfAbsent(section, defaultValue(section));
        return result;
    }

    @Transactional
    public Object saveSection(Long collegeId, String section, Object data) {
        if (!supports(section)) throw new IllegalArgumentException("Unsupported college content section: " + section);
        CollegeContent content = repository.findByCollegeIdAndSection(collegeId, section)
                .orElseGet(() -> CollegeContent.builder().collegeId(collegeId).section(section).build());
        Object savedData = data == null ? defaultValue(section) : data;
        if ("branding".equals(section)) savedData = mergeBranding(savedData);
        content.setData(write(savedData));
        LocalDateTime now = LocalDateTime.now();
        content.setUpdatedAt(now);
        repository.save(content);
        if (!"updatedAt".equals(section)) {
            CollegeContent timestamp = repository.findByCollegeIdAndSection(collegeId, "updatedAt")
                    .orElseGet(() -> CollegeContent.builder().collegeId(collegeId).section("updatedAt").build());
            timestamp.setData(write(now.toString()));
            timestamp.setUpdatedAt(now);
            repository.save(timestamp);
        }
        return savedData;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> departments(Long collegeId) {
        Object value = getSection(collegeId, "departments");
        if (!(value instanceof List<?> list)) return new ArrayList<>();
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object item : list) result.add(asMap(item));
        return result;
    }

    @Transactional
    public Map<String, Object> addDepartment(Long collegeId, Map<String, Object> department) {
        List<Map<String, Object>> departments = departments(collegeId);
        Map<String, Object> created = new LinkedHashMap<>(department);
        created.putIfAbsent("id", System.currentTimeMillis());
        if (created.get("name") == null || String.valueOf(created.get("name")).isBlank()) {
            throw new IllegalArgumentException("Department name is required");
        }
        if (departments.stream().anyMatch(existing -> Objects.equals(String.valueOf(existing.get("id")), String.valueOf(created.get("id"))))) {
            throw new IllegalArgumentException("Department id already exists");
        }
        created.putIfAbsent("createdAt", LocalDateTime.now().toString());
        departments.add(created);
        saveSection(collegeId, "departments", departments);
        return created;
    }

    @Transactional
    public Map<String, Object> updateDepartment(Long collegeId, String departmentId, Map<String, Object> updates) {
        List<Map<String, Object>> departments = departments(collegeId);
        Map<String, Object> current = departments.stream()
                .filter(item -> Objects.equals(String.valueOf(item.get("id")), departmentId))
                .findFirst().orElseThrow(() -> new NoSuchElementException("Department not found"));
        Object stableId = current.getOrDefault("id", departmentId);
        current.putAll(updates);
        current.put("id", stableId);
        if (current.get("name") == null || String.valueOf(current.get("name")).isBlank()) {
            throw new IllegalArgumentException("Department name is required");
        }
        saveSection(collegeId, "departments", departments);
        return current;
    }

    @Transactional
    public void deleteDepartment(Long collegeId, String departmentId) {
        List<Map<String, Object>> departments = departments(collegeId);
        boolean removed = departments.removeIf(item -> Objects.equals(String.valueOf(item.get("id")), departmentId));
        if (!removed) throw new NoSuchElementException("Department not found");
        saveSection(collegeId, "departments", departments);
        Object currentPages = getSection(collegeId, "deptPages");
        Map<String, Object> pages = currentPages instanceof Map<?, ?> ? asMap(currentPages) : new LinkedHashMap<>();
        pages.remove(departmentId);
        saveSection(collegeId, "deptPages", pages);
    }

    @Transactional
    public Object saveDepartmentPage(Long collegeId, String departmentId, Object page) {
        boolean exists = departments(collegeId).stream()
                .anyMatch(department -> Objects.equals(String.valueOf(department.get("id")), departmentId));
        if (!exists) throw new NoSuchElementException("Department not found");
        Object currentPages = getSection(collegeId, "deptPages");
        Map<String, Object> pages = currentPages instanceof Map<?, ?> ? asMap(currentPages) : new LinkedHashMap<>();
        pages.put(departmentId, page);
        saveSection(collegeId, "deptPages", pages);
        return page;
    }

    @Transactional
    public void initializeCollege(Long collegeId, Map<String, ?> suppliedSections) {
        for (String section : SECTIONS) {
            Object value = suppliedSections != null && suppliedSections.containsKey(section)
                    ? suppliedSections.get(section)
                    : defaultValue(section);
            if ("branding".equals(section)) value = mergeBranding(value);
            if ("departments".equals(section)) value = List.of();
            if ("deptPages".equals(section)) value = Map.of();
            saveSection(collegeId, section, value);
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> asMap(Object value) {
        if (value instanceof Map<?, ?> map) return (Map<String, Object>) map;
        return objectMapper.convertValue(value, new TypeReference<Map<String, Object>>() {});
    }

    private Object mergeBranding(Object supplied) {
        Map<String, Object> branding = new LinkedHashMap<>();
        branding.put("logo", "");
        branding.put("heroImage", "");
        branding.put("coverImage", "");
        branding.put("collegeImages", List.of());
        branding.put("preset", "engineering_blue");
        Map<String, Object> colors = new LinkedHashMap<>();
        colors.put("primary", "#1A3263");
        colors.put("secondary", "#547792");
        colors.put("accent", "#FAB95B");
        if (supplied instanceof Map<?, ?> map) {
            map.forEach((key, value) -> {
                if (!"colors".equals(String.valueOf(key))) branding.put(String.valueOf(key), value);
            });
            Object suppliedColors = map.get("colors");
            if (suppliedColors instanceof Map<?, ?> suppliedMap) {
                suppliedMap.forEach((key, value) -> colors.put(String.valueOf(key), value));
            }
        }
        branding.put("colors", colors);
        return branding;
    }

    private Object defaultValue(String section) {
        if ("departments".equals(section) || ARRAY_SECTIONS.contains(section)) return List.of();
        if ("deptPages".equals(section)) return Map.of();
        if ("tagline".equals(section)) return "";
        if ("about".equals(section)) return Map.of("fullText", "", "vision", "", "mission", List.of());
        if ("updatedAt".equals(section)) return LocalDateTime.now().toString();
        if ("branding".equals(section)) return Map.of(
                "logo", "", "heroImage", "", "coverImage", "", "collegeImages", List.of(),
                "colors", Map.of("primary", "#1A3263", "secondary", "#547792", "accent", "#FAB95B"),
                "preset", "engineering_blue");
        return Map.of();
    }

    private Object read(String json) {
        try {
            return objectMapper.readValue(json, Object.class);
        } catch (JsonProcessingException exception) {
            throw new IllegalStateException("Stored college content is not valid JSON", exception);
        }
    }

    private String write(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException exception) {
            throw new IllegalArgumentException("College content cannot be serialized as JSON", exception);
        }
    }
}
