package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "college_section_data", uniqueConstraints = {
    @UniqueConstraint(name = "uk_college_section_data", columnNames = {"college_id", "section_key"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CollegeSectionData {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    @Column(name = "section_key", nullable = false, length = 80)
    private String sectionKey;

    @Lob
    @Column(nullable = false)
    private String content;

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
