package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.CollegeSection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CollegeSectionRepository extends JpaRepository<CollegeSection, Long> {
    List<CollegeSection> findByCollege_IdOrderByDisplayOrderAscIdAsc(Long collegeId);
    Optional<CollegeSection> findByIdAndCollege_Id(Long id, Long collegeId);
}
