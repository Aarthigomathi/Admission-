package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.StudentWorkspace;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentWorkspaceRepository extends JpaRepository<StudentWorkspace, Long> {
    Optional<StudentWorkspace> findByUserId(Long userId);
}
