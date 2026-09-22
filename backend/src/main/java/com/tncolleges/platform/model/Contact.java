package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contacts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Contact {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    private String office; // Principal office, General enquiry, Admissions etc
    private String personName;
    private String designation;
    private String email;
    private String phone;
    private String officeTiming;
    private String location;
    private Integer displayOrder = 0;
}
