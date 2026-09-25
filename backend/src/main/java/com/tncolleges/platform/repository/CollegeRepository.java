package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.*;

public interface CollegeRepository extends JpaRepository<College, Long> {
    Optional<College> findBySlug(String slug);
    List<College> findByDistrict(String district);
    List<College> findByTypeContainingIgnoreCase(String type);
    List<College> findByVerifiedTrue();
    
    @Query("SELECT c FROM College c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.shortName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<College> searchByName(String query);
}
