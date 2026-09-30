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

    private String sectionKey; // about, vision, management, academics, admissions, examinations, research, campus, students, parents, alumni, careers, iic, library, placements, events, gallery, announcements, contact, helpdesk, custom
    private String title;
    @Column(columnDefinition = "TEXT")
    private String content;
    private String type; // TEXT, IMAGE, GALLERY, DEPARTMENT, COURSE, FACULTY, EVENT, ACHIEVEMENT, ANNOUNCEMENT, FAQ, CONTACT, VIDEO, DOCUMENT, CUSTOM

    private String imageUrl;
    private String videoUrl;
    private String documentUrl;
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
