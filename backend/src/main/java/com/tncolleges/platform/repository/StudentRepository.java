package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByEmailIgnoreCase(String email);
}
