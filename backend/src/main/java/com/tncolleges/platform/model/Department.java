package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "departments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    private String name;
    private String code;
    private String hodName;
    private String hodPhoto;
    @Column(columnDefinition = "TEXT")
    private String about;

    private Integer facultyCount;
    private String icon;

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Course> courses = new ArrayList<>();

    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Faculty> faculties = new ArrayList<>();

    private boolean active = true;
    private Integer displayOrder = 0;
}
