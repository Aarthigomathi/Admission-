package com.tncolleges.platform.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.dto.CourseResponse;
import com.tncolleges.platform.model.Course;
import com.tncolleges.platform.repository.CourseRepository;
import com.tncolleges.platform.service.CollegeService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    private final CollegeService collegeService;
    private final CourseRepository courseRepo;
    private final ObjectMapper objectMapper;

    public SearchController(CollegeService collegeService, CourseRepository courseRepo, ObjectMapper objectMapper) {
        this.collegeService = collegeService;
        this.courseRepo = courseRepo;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public Map<String, Object> search(@RequestParam String q,
                                      @RequestParam(required = false) String district,
                                      @RequestParam(required = false) String type) {
        List<Map<String, Object>> colleges = collegeService.publicColleges(district, type, q);
        List<Map<String, Object>> courseMatches = coursesMatching(q, district, type);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("colleges", colleges);
        result.put("courses", courseMatches.stream().limit(50).toList());
        result.put("totalColleges", colleges.size());
        result.put("totalCourses", courseMatches.size());
        return result;
    }

    @GetMapping("/courses")
    public List<Map<String, Object>> searchCourses(@RequestParam String q,
                                                   @RequestParam(required = false) String district,
                                                   @RequestParam(required = false) String type) {
        return coursesMatching(q, district, type).stream().limit(30).toList();
    }

    private List<Map<String, Object>> coursesMatching(String query, String district, String type) {
        List<Map<String, Object>> result = new ArrayList<>();
        Set<String> seen = new HashSet<>();
        String normalized = query == null ? "" : query.trim().toLowerCase(Locale.ROOT);
        for (Course course : courseRepo.searchByName(normalized)) {
            Long collegeId = course.getCollege().getId();
            Map<String, Object> college = collegeService.byId(collegeId, false).orElse(null);
            if (college == null || !matchesFilters(college, district, type)) continue;
            Map<String, Object> dto = objectMapper.convertValue(CourseResponse.from(course), new TypeReference<Map<String, Object>>() {});
            String key = collegeId + ":" + dto.get("id");
            if (!seen.add(key)) continue;
            result.add(courseSearchResult(dto, college, collegeId));
        }
        for (Map<String, Object> college : collegeService.publicColleges(null, null, null)) {
            if (!matchesFilters(college, district, type)) continue;
            Object courses = college.get("courses");
            if (!(courses instanceof List<?> items)) continue;
            for (Object item : items) {
                if (!(item instanceof Map<?, ?> raw)) continue;
                Map<String, Object> course = objectMapper.convertValue(raw, new TypeReference<Map<String, Object>>() {});
                Object name = course.get("name");
                Object degree = course.get("degreeType");
                boolean matches = name != null && String.valueOf(name).toLowerCase(Locale.ROOT).contains(normalized)
                        || degree != null && String.valueOf(degree).toLowerCase(Locale.ROOT).contains(normalized);
                if (!matches) continue;
                if (Boolean.FALSE.equals(course.get("active"))) continue;
                Object collegeId = college.get("id");
                course.putIfAbsent("collegeId", collegeId);
                String key = collegeId + ":" + course.get("id");
                if (!seen.add(key)) continue;
                result.add(courseSearchResult(course, college, collegeId));
            }
        }
        result.sort(Comparator.comparing(item -> {
            Object course = item.get("course");
            if (course instanceof Map<?, ?> map) {
                Object name = map.get("name");
                return name == null ? "" : String.valueOf(name);
            }
            return "";
        }, String.CASE_INSENSITIVE_ORDER));
        return result;
    }

    private Map<String, Object> courseSearchResult(Map<String, Object> course, Map<String, Object> college, Object collegeId) {
        Map<String, Object> item = new LinkedHashMap<>();
        item.put("course", course);
        item.put("college", college);
        item.put("collegeId", collegeId);
        item.put("district", college.get("district"));
        return item;
    }

    private boolean matchesFilters(Map<String, Object> college, String district, String type) {
        Object collegeDistrict = college.get("district");
        if (district != null && !district.isBlank() && !district.equalsIgnoreCase("All")
                && (collegeDistrict == null || !district.equalsIgnoreCase(String.valueOf(collegeDistrict)))) return false;
        Object collegeType = college.get("type");
        return type == null || type.isBlank() || type.equalsIgnoreCase("All")
                || (collegeType != null && String.valueOf(collegeType).toLowerCase(Locale.ROOT).contains(type.toLowerCase(Locale.ROOT)));
    }
}
