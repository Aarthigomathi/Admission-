package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.Verification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VerificationRepository extends JpaRepository<Verification, Long> {
    Optional<Verification> findByCollegeId(Long collegeId);
}
