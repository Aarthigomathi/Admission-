package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "analytics", indexes = {
    @Index(name = "idx_analytics_college", columnList = "college_id"),
    @Index(name = "idx_analytics_date", columnList = "date")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Analytics {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    private LocalDate date;

    @Builder.Default
    private Integer totalViews = 0;
    @Builder.Default
    private Integer totalStudentsViewed = 0;
    @Builder.Default
    private Integer courseViews = 0;
    @Builder.Default
    private Integer saves = 0;
    @Builder.Default
    private Integer comparisons = 0;
    @Builder.Default
    private Integer enquiries = 0;

    // Aggregated breakdowns stored as JSON strings for simplicity
    @Column(length = 2000)
    private String byEducationLevel; // JSON: {"12th":450, "Diploma":120}
    @Column(length = 2000)
    private String byDistrict; // JSON: {"Coimbatore":320, "Chennai":180}
    @Column(length = 2000)
    private String byCourse; // JSON: {"Computer Science":320, "Mechanical":180}
    @Column(length = 2000)
    private String byActivityType;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}
