package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;
    private String phone;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Role role = Role.PUBLIC_USER;

    // Multi-tenant: college_id for COLLEGE_ADMIN, COLLEGE_EDITOR
    private Long collegeId;

    private boolean enabled = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime lastLogin;

    public enum Role {
        STUDENT,
        COLLEGE_ADMIN,
        COLLEGE_EDITOR,
        PLATFORM_ADMIN,
        SUPER_ADMIN, // legacy alias for PLATFORM_ADMIN
        PARENT,
        PUBLIC_USER
    }
}
