package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gallery")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Gallery {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    private String albumName;
    private String category; // CAMPUS, BUILDINGS, DEPARTMENTS, LABS, LIBRARY, HOSTEL, SPORTS, CULTURAL, EVENTS, STUDENTS, ACHIEVEMENTS
    private String imageUrl;
    private String videoUrl;
    private String caption;
    private Integer displayOrder = 0;
    private LocalDateTime createdAt = LocalDateTime.now();
}
