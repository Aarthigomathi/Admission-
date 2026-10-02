package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "student_workspaces", uniqueConstraints = {
    @UniqueConstraint(name = "uk_student_workspace_user", columnNames = "user_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentWorkspace {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Lob
    @Builder.Default
    private String savedCollegesJson = "[]";

    @Lob
    @Builder.Default
    private String comparedCollegesJson = "[]";

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
