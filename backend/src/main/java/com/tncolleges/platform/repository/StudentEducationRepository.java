package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.StudentEducation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentEducationRepository extends JpaRepository<StudentEducation, Long> {
    Optional<StudentEducation> findFirstByStudentIdOrderByCreatedAtDesc(Long studentId);
}
