package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "research")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Research {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    private String title;
    @Column(length = 2000)
    private String description;
    private String centreName; // Advanced Centre name
    private String facultyName;
    private String fundingAgency;
    private String year;
    private String imageUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
