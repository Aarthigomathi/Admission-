package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "placements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Placement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    private Integer year;
    private String companyName;
    private Integer studentsPlaced;
    private String highestPackage;
    private String averagePackage;
    private String department; // CSE, ECE etc
    private String imageUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
