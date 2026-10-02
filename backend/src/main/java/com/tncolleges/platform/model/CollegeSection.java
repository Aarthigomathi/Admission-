package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "college_sections")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CollegeSection {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Column(name = "section_key", nullable = false, length = 64)
    private String sectionKey; // PROFILE, VISION_MISSION, MANAGEMENT_PROFILE, ORGANIZATIONAL_STRUCTURE, CENTER_OF_EXCELLENCE, ACCREDITATIONS, PROGRAMMES, PLACEMENTS
    @Column(length = 200)
    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    @Column(length = 32)
    private String type; // TEXT, RICH_TEXT, IMAGE, GALLERY, VIDEO, DOCUMENT, CUSTOM

    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    @Column(length = 2048)
    private String videoUrl;
    @Column(length = 2048)
    private String documentUrl;
    @Column(length = 2048)
    private String linkUrl;

    @Builder.Default
    private Integer displayOrder = 0;
    @Builder.Default
    private boolean isPublished = false;
    @Builder.Default
    private boolean isDraft = true;
    @Builder.Default
    private String status = "DRAFT"; // DRAFT, PENDING_REVIEW, PUBLISHED

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
