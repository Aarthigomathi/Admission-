package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "accreditations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Accreditation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    private String name; // NAAC A++, NBA, ISO 9001:2015
    private String grade; // A++, A
    private String year;
    private String validTill;
    private String certificateUrl;
    private String imageUrl;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
