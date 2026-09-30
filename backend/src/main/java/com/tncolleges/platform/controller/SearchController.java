package com.tncolleges.platform.controller;

import com.tncolleges.platform.dto.CollegeResponse;
import com.tncolleges.platform.dto.CourseResponse;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.Course;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.CourseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

        if (district != null && !district.equalsIgnoreCase("All")) {
            colleges = colleges.stream()
                    .filter(college -> district.equalsIgnoreCase(college.getDistrict()))
                    .collect(Collectors.toList());
        }
        if (type != null && !type.equalsIgnoreCase("All")) {
            colleges = colleges.stream()
                    .filter(college -> college.getType() != null && college.getType().toLowerCase().contains(type.toLowerCase()))
                    .collect(Collectors.toList());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("colleges", colleges.stream().map(CollegeResponse::from).collect(Collectors.toList()));
        result.put("courses", courses.stream().limit(50).map(CourseResponse::from).collect(Collectors.toList()));
        result.put("totalColleges", colleges.size());
        result.put("totalCourses", courses.size());
        return result;
    }

    @GetMapping("/courses")
    public List<Map<String, Object>> searchCourses(@RequestParam String q) {
        List<Course> courses = courseRepo.searchByName(q);
        return courses.stream().limit(30).map(course -> {
            Map<String, Object> map = new HashMap<>();
            map.put("course", CourseResponse.from(course));
            map.put("college", CollegeResponse.from(course.getCollege()));
            map.put("collegeId", course.getCollege().getId());
            map.put("district", course.getCollege().getDistrict());
            return map;
        }).collect(Collectors.toList());
    }
}
