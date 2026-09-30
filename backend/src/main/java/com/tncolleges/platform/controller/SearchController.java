package com.tncolleges.platform.controller;

import com.tncolleges.platform.dto.CourseResponse;
import com.tncolleges.platform.model.Course;
import com.tncolleges.platform.repository.CourseRepository;
import com.tncolleges.platform.service.CollegeService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {
    private final CollegeService collegeService;
    private final CourseRepository courseRepo;

    public SearchController(CollegeService collegeService, CourseRepository courseRepo) {
        this.collegeService = collegeService;
        this.courseRepo = courseRepo;
    }

    @GetMapping
    public Map<String, Object> search(@RequestParam String q,
                                      @RequestParam(required = false) String district,
                                      @RequestParam(required = false) String type) {
        List<Map<String, Object>> colleges = collegeService.publicColleges(district, type, q);
        List<Course> courses = courseRepo.searchByName(q);
        Map<String, Object> result = new HashMap<>();
        result.put("colleges", colleges);
        result.put("courses", courses.stream().limit(50).map(CourseResponse::from).collect(Collectors.toList()));
        result.put("totalColleges", colleges.size());
        result.put("totalCourses", courses.size());
        return result;
    }

    @GetMapping("/courses")
    public List<Map<String, Object>> searchCourses(@RequestParam String q) {
        return courseRepo.searchByName(q).stream().limit(30).map(course -> {
            Map<String, Object> map = new HashMap<>();
            map.put("course", CourseResponse.from(course));
            map.put("college", collegeService.byId(course.getCollege().getId(), false).orElse(Map.of()));
            map.put("collegeId", course.getCollege().getId());
            map.put("district", course.getCollege().getDistrict());
            return map;
        }).collect(Collectors.toList());
    }
}
