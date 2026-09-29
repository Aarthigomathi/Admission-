package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "careers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Career {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    private String jobTitle;
    private String department;
    private String qualification;
    private String experience;
    private String location;
    private LocalDate lastDate;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String applyLink;
    private String type; // FACULTY, NON_TEACHING, INTERNSHIP
    private boolean active = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
