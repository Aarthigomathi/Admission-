package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "student_activity", indexes = {
    @Index(name = "idx_activity_student", columnList = "student_id"),
    @Index(name = "idx_activity_college", columnList = "college_id"),
    @Index(name = "idx_activity_type", columnList = "activity_type"),
    @Index(name = "idx_activity_date", columnList = "date")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentActivity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    @Column(name = "course_id")
    private Long courseId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime time;

    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false)
    private ActivityType activityType;

    // Privacy rule: personalInfoShared only true when ENQUIRY with consent
    @Builder.Default
    @Column(name = "personal_info_shared")
    private Boolean personalInfoShared = false;

    @Column(length = 1000)
    private String metadata; // JSON - collegeName, courseName, url, etc

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum ActivityType {
        COLLEGE_VIEW,
        COURSE_VIEW,
        SAVE,
        COMPARE,
        ENQUIRY,
        SEARCH,
        PROFILE_VIEW
    }
}
