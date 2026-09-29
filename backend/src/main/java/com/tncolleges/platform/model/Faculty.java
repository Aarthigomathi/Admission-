package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "faculty")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Faculty {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    private String name;
    private String designation;
    private String photoUrl;
    private String email;
    private String phone;
    @Column(columnDefinition = "TEXT")
    private String bio;
    private String qualification;
    private String experience;
    private String specialization;
    private boolean isHod = false;
    private Integer displayOrder = 0;
}
