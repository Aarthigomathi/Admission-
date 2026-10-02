package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.CollegeContent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CollegeContentRepository extends JpaRepository<CollegeContent, Long> {
    Optional<CollegeContent> findByCollegeIdAndSection(Long collegeId, String section);
    List<CollegeContent> findAllByCollegeId(Long collegeId);
    void deleteByCollegeIdAndSection(Long collegeId, String section);
}
