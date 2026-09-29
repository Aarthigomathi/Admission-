package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Announcement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;
    private LocalDate date;
    private String attachmentUrl;
    private String linkUrl;
    private String category; // ADMISSION, EXAM, EVENT, SCHOLARSHIP, RECRUITMENT, HOLIDAY, NOTICE
    private LocalDate expiryDate;
    private boolean urgent = false;
    private boolean active = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
