package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    private String title;
    private LocalDate date;
    private String time;
    private String venue;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String posterUrl;
    private String galleryUrl;
    private String registrationLink;
    private String contactInfo;
    private String category; // TECHNICAL, CULTURAL, SPORTS, WORKSHOP, SEMINAR, HACKATHON, CONFERENCE, ALUMNI, ADMISSION, WEBINAR
    private boolean featured = false;
    private boolean active = true;
    private LocalDateTime createdAt = LocalDateTime.now();
}
