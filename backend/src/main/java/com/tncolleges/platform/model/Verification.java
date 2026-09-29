package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Verification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "college_id", nullable = false, unique = true)
    private Long collegeId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VerificationStatus status = VerificationStatus.PENDING;

    @Column(length = 1000)
    private String remarks; // Reason for rejection or needs changes

    private Long verifiedBy; // Platform admin user id
    private LocalDateTime verifiedAt;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    public enum VerificationStatus {
        PENDING, UNDER_REVIEW, VERIFIED, REJECTED, NEEDS_CHANGES
    }
}
