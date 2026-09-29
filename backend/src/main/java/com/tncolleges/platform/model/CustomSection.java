package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "custom_sections")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomSection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    private String sectionName; // Centre for Foreign Languages
    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String images; // JSON array or comma separated
    private String videos;
    private String documents;
    private String contactInfo;
    private String links;
    private String icon;
    private Integer displayOrder = 0;
    private boolean active = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
