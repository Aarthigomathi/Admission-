package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.StudentActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StudentActivityRepository extends JpaRepository<StudentActivity, Long> {
    List<StudentActivity> findByStudentIdOrderByCreatedAtDesc(Long studentId);
    List<StudentActivity> findByCollegeIdOrderByCreatedAtDesc(Long collegeId);
    long countByCollegeIdAndActivityType(Long collegeId, StudentActivity.ActivityType activityType);
    long countByActivityType(StudentActivity.ActivityType activityType);
    @org.springframework.data.jpa.repository.Query("select count(distinct a.studentId) from StudentActivity a where a.collegeId = ?1 and a.activityType = ?2")
    long countDistinctStudentsByCollegeIdAndActivityType(Long collegeId, StudentActivity.ActivityType activityType);
}
