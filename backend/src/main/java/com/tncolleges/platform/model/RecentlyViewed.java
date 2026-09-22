package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recently_viewed")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecentlyViewed {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    @Column(name = "course_id")
    private Long courseId;

    @Builder.Default
    private LocalDateTime viewedAt = LocalDateTime.now();
}
