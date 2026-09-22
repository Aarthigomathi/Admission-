package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "college_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CollegeProfile {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "college_id")
    private College college;

    @Column(columnDefinition = "TEXT")
    private String about;

    @Column(columnDefinition = "TEXT")
    private String vision;

    @Column(columnDefinition = "TEXT")
    private String mission;

    @Column(columnDefinition = "TEXT")
    private String history;

    @Column(columnDefinition = "TEXT")
    private String objectives;

    private String address;
    private String city;
    private Double latitude;
    private Double longitude;

    private String phone;
    private String email;
    private String admissionsPhone;
    private String website;

    private String principalName;
    private String principalPhoto;
    @Column(columnDefinition = "TEXT")
    private String principalMessage;

    private Integer totalCourses;
    private Integer totalDepartments;
    private Integer totalFaculty;
    private Integer totalStudents;
    private String placementPercentage;
    private String campusSize;
}
