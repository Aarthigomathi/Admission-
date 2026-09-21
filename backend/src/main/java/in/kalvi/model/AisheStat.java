package in.kalvi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "aishe_stats")
public class AisheStat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true, length = 200)
    public String cat;

    @Column(name = "cat_ta", length = 200)
    public String catTa;

    @Column(name = "college_count")
    public int collegeCount;

    @Column(length = 20)
    public String color;

    @Column(length = 60)
    public String icon;
}
