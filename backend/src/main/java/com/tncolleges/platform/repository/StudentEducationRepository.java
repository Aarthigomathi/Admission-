package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.StudentEducation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentEducationRepository extends JpaRepository<StudentEducation, Long> {
    List<StudentEducation> findByStudent_IdIn(List<Long> studentIds);
    List<StudentEducation> findByStudent_IdOrderByCreatedAtDesc(Long studentId);
}
