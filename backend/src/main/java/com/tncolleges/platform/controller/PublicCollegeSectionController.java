package com.tncolleges.platform.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.CollegeSectionData;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.CollegeSectionDataRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/colleges/{slug}/sections")
public class PublicCollegeSectionController {
    private final CollegeRepository collegeRepo;
    private final CollegeSectionDataRepository sectionRepo;
    private final ObjectMapper objectMapper;

    public PublicCollegeSectionController(CollegeRepository collegeRepo, CollegeSectionDataRepository sectionRepo, ObjectMapper objectMapper) {
        this.collegeRepo = collegeRepo;
        this.sectionRepo = sectionRepo;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<?> getPublishedSections(@PathVariable String slug) {
        College college = collegeRepo.findBySlug(slug).orElse(null);
        if (college == null) return ResponseEntity.notFound().build();
        Map<String, Object> result = new HashMap<>();
        for (CollegeSectionData section : sectionRepo.findAllByCollegeId(college.getId())) {
            try {
                Object content = objectMapper.readValue(section.getContent(), new TypeReference<Object>() {});
                result.put(section.getSectionKey(), sanitize(content));
            } catch (Exception ex) {
                result.put(section.getSectionKey(), Map.of());
            }
        }
        return ResponseEntity.ok(result);
    }

    private Object sanitize(Object value) {
        if (value instanceof Map<?, ?> map) {
            Map<String, Object> safe = new HashMap<>();
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                String key = String.valueOf(entry.getKey());
                if (key.toLowerCase().matches(".*(password|secret|token|loginusername).*")) continue;
                safe.put(key, sanitize(entry.getValue()));
            }
            return safe;
        }
        if (value instanceof Iterable<?> items) {
            java.util.List<Object> safe = new java.util.ArrayList<>();
            for (Object item : items) safe.add(sanitize(item));
            return safe;
        }
        return value;
    }
}
