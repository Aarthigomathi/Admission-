package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enquiries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Enquiry {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "college_id")
    private College college;

    private String name;
    private String email;
    private String phone;
    private String courseInterested;
    private String message;
    private String status = "PENDING"; // PENDING, CONTACTED, CLOSED
    private LocalDateTime createdAt = LocalDateTime.now();
}
