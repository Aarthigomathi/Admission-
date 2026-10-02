package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.Course;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    @EntityGraph(attributePaths = {"college", "department"})
    List<Course> findByCollegeId(Long collegeId);

    @EntityGraph(attributePaths = {"college", "department"})
    List<Course> findByCollegeIdAndActiveTrue(Long collegeId);

    @EntityGraph(attributePaths = {"college", "department"})
    @Query("SELECT c FROM Course c WHERE c.active = true AND c.college.registered = true AND c.college.active = true AND c.college.verified = true AND (LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.degreeType) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Course> searchByName(String query);

    List<Course> findByDegreeTypeContainingIgnoreCase(String degreeType);
}
