package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "colleges")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class College {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // college_id 101, 102 etc but auto

    @Column(nullable = false, unique = true)
    private String slug; // psg-tech

    @Column(nullable = false)
    private String name;

    private String shortName;
    private String tagline;
    private String type; // Engineering, Arts & Science
    private String district;
    private String affiliation;
    private String accreditation;
    private Integer established;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    private boolean verified = false;
    private boolean active = true;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToOne(mappedBy = "college", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CollegeProfile profile;

    @OneToOne(mappedBy = "college", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private CollegeBranding branding;

    @OneToMany(mappedBy = "college", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Department> departments = new ArrayList<>();

    @OneToMany(mappedBy = "college", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Course> courses = new ArrayList<>();

    public enum VerificationStatus {
        PENDING, UNDER_REVIEW, VERIFIED, REJECTED, NEEDS_CHANGES
    }
}
