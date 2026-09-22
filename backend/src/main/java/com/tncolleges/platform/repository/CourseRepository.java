package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByCollegeId(Long collegeId);
    List<Course> findByCollegeIdAndActiveTrue(Long collegeId);
    
    @Query("SELECT c FROM Course c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.degreeType) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Course> searchByName(String query);

    List<Course> findByDegreeTypeContainingIgnoreCase(String degreeType);
}
