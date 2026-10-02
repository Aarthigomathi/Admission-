package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/** Stores one editable college website section as JSON, preserving the frontend's flexible section shape. */
@Entity
@Table(name = "college_content", uniqueConstraints = @UniqueConstraint(name = "uk_college_content_section", columnNames = {"college_id", "section_key"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CollegeContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    @Column(name = "section_key", nullable = false, length = 80)
    private String section;

    @Lob
    @Column(name = "content_json", nullable = false)
    private String data;

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
