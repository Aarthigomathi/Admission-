package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.CollegeMedia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CollegeMediaRepository extends JpaRepository<CollegeMedia, Long> {
    Optional<CollegeMedia> findByIdAndCollege_Id(Long id, Long collegeId);
    List<CollegeMedia> findAllByCollege_IdOrderByCreatedAtDesc(Long collegeId);
}
