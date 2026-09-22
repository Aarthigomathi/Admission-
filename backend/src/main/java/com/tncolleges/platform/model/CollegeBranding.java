package com.tncolleges.platform.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "college_branding")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CollegeBranding {
    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "college_id")
    private College college;

    private String logoUrl;
    private String faviconUrl;
    private String heroImageUrl;
    private String coverImageUrl;

    private String primaryColor;
    private String secondaryColor;
    private String accentColor;

    private String preset; // engineering_blue, arts_maroon etc
    private String typographyOption;
    private String headerStyle;
    private String footerStyle;
    private String cardStyle;
    private String buttonStyle;
    private String homepageLayout;
}
