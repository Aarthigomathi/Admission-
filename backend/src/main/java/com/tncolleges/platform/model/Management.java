package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "management")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Management {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    private String name;
    private String role; // Trustee, Secretary, Chairman, Dean, Registrar etc
    private String category; // MANAGEMENT, GOVERNING_COUNCIL, LEADERSHIP, DEAN etc
    private String photoUrl;
    private String email;
    private String phone;
    @Column(columnDefinition = "TEXT")
    private String description;
    private Integer displayOrder = 0;
}
