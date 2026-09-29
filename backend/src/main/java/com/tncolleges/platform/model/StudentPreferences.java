package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_preferences")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentPreferences {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    private String interestedCourse; // B.E Computer Science etc
    private String preferredDistrict;
    
    @Enumerated(EnumType.STRING)
    private CollegeType collegeType; // Govt, Private, Autonomous, Any

    @Builder.Default
    private Boolean hostelRequired = false;
    @Builder.Default
    private Boolean transportRequired = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum CollegeType {
        GOVERNMENT, PRIVATE, AUTONOMOUS, ANY
    }
}
