package com.tncolleges.platform.dto;

import com.tncolleges.platform.model.College;

import java.time.LocalDateTime;

/** A flat API representation that never exposes JPA relationship graphs. */
public record CollegeResponse(
        Long id,
        String slug,
        String name,
        String shortName,
        String tagline,
        String type,
        String collegeType,
        String district,
        String city,
        String address,
        String pincode,
        String phone,
        String email,
        String website,
        String affiliation,
        String university,
        String accreditation,
        Integer established,
        String principalName,
        String managementName,
        College.VerificationStatus verificationStatus,
        boolean verified,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static CollegeResponse from(College college) {
        return new CollegeResponse(
                college.getId(),
                college.getSlug(),
                college.getName(),
                college.getShortName(),
                college.getTagline(),
                college.getType(),
                college.getCollegeType(),
                college.getDistrict(),
                college.getCity(),
                college.getAddress(),
                college.getPincode(),
                college.getPhone(),
                college.getEmail(),
                college.getWebsite(),
                college.getAffiliation(),
                college.getUniversity(),
                college.getAccreditation(),
                college.getEstablished(),
                college.getPrincipalName(),
                college.getManagementName(),
                college.getVerificationStatus(),
                college.isVerified(),
                college.isActive(),
                college.getCreatedAt(),
                college.getUpdatedAt()
        );
    }
}
