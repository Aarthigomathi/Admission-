package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "college_media", indexes = {
        @Index(name = "idx_college_media_college", columnList = "college_id,created_at")
}, uniqueConstraints = @UniqueConstraint(name = "uk_college_media_stored_name", columnNames = "stored_name"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CollegeMedia {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Column(name = "original_name", nullable = false, length = 255)
    private String originalName;

    @Column(name = "stored_name", nullable = false, length = 80)
    private String storedName;

    @Column(name = "content_type", nullable = false, length = 64)
    private String contentType;

    @Column(nullable = false)
    private long size;

    @Column(name = "uploaded_by", length = 255)
    private String uploadedBy;

    @Builder.Default
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
