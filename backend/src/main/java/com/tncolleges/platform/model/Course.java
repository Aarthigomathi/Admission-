package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses", indexes = {
    @Index(name = "idx_course_college", columnList = "college_id"),
    @Index(name = "idx_course_name", columnList = "name")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Course {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    private String name;
    private String degreeType; // B.E, B.Tech, BCA
    private String level; // UG, PG, PhD
    private String duration;
    private String eligibility;
    private String admissionProcess;
    private Integer intake;
    private String fees;
    @Column(columnDefinition = "TEXT")
    private String description;
    @Column(columnDefinition = "TEXT")
    private String curriculum;
    @Column(columnDefinition = "TEXT")
    private String careerOpportunities;
    private String brochureUrl;
    private String admissionLink;
    private String contactInfo;
    private String imageUrl;

    private boolean active = true;
    private boolean featured = false;
}
