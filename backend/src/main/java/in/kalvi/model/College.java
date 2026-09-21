package in.kalvi.model;

import jakarta.persistence.*;

@Entity
@Table(name = "colleges")
public class College {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true)
    public String slug;

    @Column(nullable = false, length = 200)
    public String name;

    @Column(nullable = false)
    public String city;

    @Column(nullable = false)
    public String category;

    public int founded;
    public double rating;

    @Column(name = "reviews_count")
    public int reviewsCount;

    public String seats;
    public String fee;
    public String img;

    @Column(name = "map_url", length = 300)
    public String mapUrl;

    public String official;
    public String tags;

    @Column(length = 500)
    public String oneLiner;

    @Column(length = 500)
    public String oneLinerTa;

    @Column(length = 1200)
    public String departments;   /* '|' separated department names */

    @Column(length = 600)
    public String events;        /* '|' separated annual events */

    /* verified facility info (from official websites; empty = not yet verified) */
    @Column(length = 500)
    public String hostel;

    @Column(length = 500)
    public String library;

    @Column(length = 500)
    public String sports;

    @Column(length = 500)
    public String placements;

    @Column(length = 200)
    public String youtube;       /* verified official channel/video */

    @Column(length = 200)
    public String instagram;     /* verified official account */

    @Column(name = "inst_type", length = 40)
    public String instType;      /* Autonomous / Government / University / Deemed / Affiliated */
}
