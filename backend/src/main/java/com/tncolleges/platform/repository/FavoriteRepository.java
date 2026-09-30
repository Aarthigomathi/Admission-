package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    long countByCollege_Id(Long collegeId);
    long countByUser_Id(Long userId);
    java.util.List<Favorite> findByUser_IdOrderByCreatedAtDesc(Long userId);
    boolean existsByUser_IdAndCollege_Id(Long userId, Long collegeId);
    void deleteByUser_IdAndCollege_Id(Long userId, Long collegeId);
}
