package in.kalvi.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(name = "college_slug", nullable = false)
    public String collegeSlug;

    @Column(nullable = false)
    public String name;

    @Column(nullable = false)
    public int stars;

    @Column(length = 1000)
    public String text;

    public LocalDateTime createdAt = LocalDateTime.now();
}
