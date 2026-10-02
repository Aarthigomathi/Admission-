package com.tncolleges.platform.dto;

import com.tncolleges.platform.model.CollegeMedia;

import java.time.LocalDateTime;

public record CollegeMediaResponse(
        Long id,
        Long collegeId,
        String originalName,
        String contentType,
        long size,
        String url,
        LocalDateTime createdAt
) {
    public static CollegeMediaResponse from(CollegeMedia media) {
        return new CollegeMediaResponse(media.getId(), media.getCollege().getId(), media.getOriginalName(),
                media.getContentType(), media.getSize(), "/api/media/" + media.getId(), media.getCreatedAt());
    }
}
