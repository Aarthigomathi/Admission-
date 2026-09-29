package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.Course;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.CourseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "*")
public class SearchController {

    private final CollegeRepository collegeRepo;
    private final CourseRepository courseRepo;

    public SearchController(CollegeRepository collegeRepo, CourseRepository courseRepo) {
        this.collegeRepo = collegeRepo;
        this.courseRepo = courseRepo;
    }

    @GetMapping
    public Map<String, Object> search(@RequestParam String q,
                                      @RequestParam(required = false) String district,
                                      @RequestParam(required = false) String type) {
        List<College> colleges = collegeRepo.searchByName(q);
        List<Course> courses = courseRepo.searchByName(q);

        if (district != null && !district.equals("All")) {
            colleges = colleges.stream().filter(c -> district.equals(c.getDistrict())).collect(Collectors.toList());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("colleges", colleges);
        result.put("courses", courses.stream().limit(50).collect(Collectors.toList()));
        result.put("totalColleges", colleges.size());
        result.put("totalCourses", courses.size());
        return result;
    }

    @GetMapping("/courses")
    public List<Map<String, Object>> searchCourses(@RequestParam String q) {
        List<Course> courses = courseRepo.searchByName(q);
        return courses.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("course", c);
            map.put("college", c.getCollege());
            map.put("collegeId", c.getCollege().getId());
            map.put("district", c.getCollege().getDistrict());
            return map;
        }).limit(30).collect(Collectors.toList());
    }
}
