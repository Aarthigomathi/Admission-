package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String title;
    @Column(length = 1000)
    private String message;
    private String type; // ENQUIRY, VERIFICATION, SYSTEM

    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "college_id")
    private Long collegeId; // Optional - related college

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
