package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.CollegeSectionData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CollegeSectionDataRepository extends JpaRepository<CollegeSectionData, Long> {
    List<CollegeSectionData> findAllByCollegeId(Long collegeId);
    Optional<CollegeSectionData> findByCollegeIdAndSectionKey(Long collegeId, String sectionKey);
}
