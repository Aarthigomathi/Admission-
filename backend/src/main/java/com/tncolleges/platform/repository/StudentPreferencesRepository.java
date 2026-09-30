package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.StudentPreferences;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StudentPreferencesRepository extends JpaRepository<StudentPreferences, Long> {
    Optional<StudentPreferences> findByStudent_Id(Long studentId);
}
