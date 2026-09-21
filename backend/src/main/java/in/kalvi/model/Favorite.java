package in.kalvi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "favorites", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "college_slug"}))
public class Favorite {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "user_id", nullable = false)
    public Long userId;

    @Column(name = "college_slug", nullable = false)
    public String collegeSlug;
}
