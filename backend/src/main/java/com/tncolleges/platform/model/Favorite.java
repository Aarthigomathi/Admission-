package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "favorites", uniqueConstraints = @UniqueConstraint(name = "uk_favorite_user_college", columnNames = {"user_id", "college_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Favorite {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "college_id")
    private College college;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
