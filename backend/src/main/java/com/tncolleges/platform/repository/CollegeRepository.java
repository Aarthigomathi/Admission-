package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.*;

public interface CollegeRepository extends JpaRepository<College, Long> {
    Optional<College> findBySlug(String slug);
    Optional<College> findByLoginUsernameIgnoreCase(String loginUsername);
    boolean existsBySlugIgnoreCase(String slug);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByLoginUsernameIgnoreCase(String loginUsername);

    List<College> findAllByRegisteredTrueAndActiveTrueOrderByNameAsc();
    List<College> findByDistrictIgnoreCaseAndRegisteredTrueAndActiveTrue(String district);
    List<College> findByTypeContainingIgnoreCaseAndRegisteredTrueAndActiveTrue(String type);
    List<College> findAllByRegisteredTrueOrderByCreatedAtDesc();

    @Query("SELECT c FROM College c WHERE c.registered = true AND c.active = true AND (LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.shortName) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<College> searchByName(String query);
}
