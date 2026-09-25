package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Document {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    private String name; // Verification document
    private String type; // Affiliation, Accreditation, ID Proof
    private String fileUrl;
    private String fileName;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();

    public enum VerificationStatus {
        PENDING, UNDER_REVIEW, VERIFIED, REJECTED, NEEDS_CHANGES
    }
}
