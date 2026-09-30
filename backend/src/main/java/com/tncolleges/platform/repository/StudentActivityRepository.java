package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.StudentActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface StudentActivityRepository extends JpaRepository<StudentActivity, Long> {
    List<StudentActivity> findByCollegeIdOrderByCreatedAtDesc(Long collegeId);
    List<StudentActivity> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    long countByCollegeId(Long collegeId);
    long countByActivityType(StudentActivity.ActivityType activityType);
    long countByCollegeIdAndActivityType(Long collegeId, StudentActivity.ActivityType activityType);

    @Query(value = """
            SELECT a.student_id AS studentId,
                   a.college_id AS collegeId,
                   SUM(CASE WHEN a.activity_type = 'COLLEGE_VIEW' THEN 1 ELSE 0 END) AS collegeViews,
                   SUM(CASE WHEN a.activity_type = 'COURSE_VIEW' THEN 1 ELSE 0 END) AS courseViews,
                   MAX(a.created_at) AS lastVisitedAt
            FROM student_activity a
            JOIN colleges c ON c.id = a.college_id AND c.registered = TRUE
            JOIN users u ON u.id = a.student_id AND u.role = 'STUDENT'
            LEFT JOIN students s ON s.user_id = u.id
            WHERE a.activity_type IN ('COLLEGE_VIEW', 'COURSE_VIEW')
              AND (:collegeId IS NULL OR a.college_id = :collegeId)
              AND (:studentId IS NULL OR a.student_id = :studentId)
              AND (:fromTime IS NULL OR a.created_at >= :fromTime)
              AND (:toExclusive IS NULL OR a.created_at < :toExclusive)
              AND (:search IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(u.full_name) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(s.full_name) LIKE LOWER(CONCAT('%', :search, '%'))
                   OR LOWER(s.mobile) LIKE LOWER(CONCAT('%', :search, '%')))
            GROUP BY a.student_id, a.college_id
            ORDER BY MAX(a.created_at) DESC, a.student_id ASC, a.college_id ASC
            """,
            countQuery = """
            SELECT COUNT(*) FROM (
                SELECT a.student_id, a.college_id
                FROM student_activity a
                JOIN colleges c ON c.id = a.college_id AND c.registered = TRUE
                JOIN users u ON u.id = a.student_id AND u.role = 'STUDENT'
                LEFT JOIN students s ON s.user_id = u.id
                WHERE a.activity_type IN ('COLLEGE_VIEW', 'COURSE_VIEW')
                  AND (:collegeId IS NULL OR a.college_id = :collegeId)
                  AND (:studentId IS NULL OR a.student_id = :studentId)
                  AND (:fromTime IS NULL OR a.created_at >= :fromTime)
                  AND (:toExclusive IS NULL OR a.created_at < :toExclusive)
                  AND (:search IS NULL OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
                       OR LOWER(u.full_name) LIKE LOWER(CONCAT('%', :search, '%'))
                       OR LOWER(s.full_name) LIKE LOWER(CONCAT('%', :search, '%'))
                       OR LOWER(s.mobile) LIKE LOWER(CONCAT('%', :search, '%')))
                GROUP BY a.student_id, a.college_id
            ) visit_pairs
            """, nativeQuery = true)
    org.springframework.data.domain.Page<Object[]> findStudentCollegeVisits(
            @org.springframework.data.repository.query.Param("collegeId") Long collegeId,
            @org.springframework.data.repository.query.Param("studentId") Long studentId,
            @org.springframework.data.repository.query.Param("fromTime") java.time.LocalDateTime fromTime,
            @org.springframework.data.repository.query.Param("toExclusive") java.time.LocalDateTime toExclusive,
            @org.springframework.data.repository.query.Param("search") String search,
            org.springframework.data.domain.Pageable pageable);

    @Query("select count(distinct a.studentId) from StudentActivity a where a.collegeId = :collegeId")
    long countDistinctStudentsByCollegeId(@Param("collegeId") Long collegeId);

    @Query("select count(distinct a.studentId) from StudentActivity a where a.collegeId = :collegeId and a.activityType = :activityType")
    long countDistinctStudentsByCollegeIdAndActivityType(@Param("collegeId") Long collegeId,
                                                          @Param("activityType") StudentActivity.ActivityType activityType);
}
