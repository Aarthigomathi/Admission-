package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "hostels")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Hostel {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    private String name; // Boys Hostel, Girls Hostel
    private String type; // Boys, Girls
    private Integer capacity;
    private String facilities; // JSON or comma separated
    private String fees; // e.g. 50000 per year
    private String imageUrl;

    @Builder.Default
    private Boolean isPublished = true;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
