package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.Comparison;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComparisonRepository extends JpaRepository<Comparison, Long> {
    long countByCollegeId(Long collegeId);
    long countByStudentId(Long studentId);
    java.util.List<Comparison> findByStudentIdOrderByComparedAtDesc(Long studentId);
    boolean existsByStudentIdAndCollegeId(Long studentId, Long collegeId);
    void deleteByStudentIdAndCollegeId(Long studentId, Long collegeId);
}
