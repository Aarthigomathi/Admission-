package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByCollegeIdOrderByGeneratedAtDesc(Long collegeId);
    Optional<Report> findByIdAndCollegeId(Long id, Long collegeId);
}
