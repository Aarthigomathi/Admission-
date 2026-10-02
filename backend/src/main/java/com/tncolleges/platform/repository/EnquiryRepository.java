package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<Enquiry> findByCollege_IdOrderByCreatedAtDesc(Long collegeId);
    long countByCollege_Id(Long collegeId);
}
