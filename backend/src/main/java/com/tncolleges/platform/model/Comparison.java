package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comparisons", uniqueConstraints = @UniqueConstraint(name = "uk_comparison_student_college", columnNames = {"student_id", "college_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Comparison {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    @Builder.Default
    private LocalDateTime comparedAt = LocalDateTime.now();
}
