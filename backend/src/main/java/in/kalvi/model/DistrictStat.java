package in.kalvi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "district_stats")
public class DistrictStat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true)
    public String district;

    public int total;
    public int eng;
    public int arts;
    public int med;
    public int poly;
}
