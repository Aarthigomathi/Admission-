package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "facilities")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Facility {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "college_id", nullable = false)
    private Long collegeId; // College-specific has college_id - isolation

    private String name;
    @Column(length = 1000)
    private String description;
    private String icon;
    private String imageUrl;

    @Builder.Default
    private Boolean isPublished = true;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
