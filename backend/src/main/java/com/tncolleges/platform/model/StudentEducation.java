package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_education")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentEducation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Enumerated(EnumType.STRING)
    private EducationLevel level; // 10th, 11th, 12th, Diploma, UG, PG

    private String schoolCollege;
    private String marks; // e.g. 450/500
    private String percentage; // e.g. 90%
    private String groupStream; // Computer Science, Biology, etc
    private String interestedSubject;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum EducationLevel {
        TENTH, ELEVENTH, TWELFTH, DIPLOMA, UG, PG
    }
}
