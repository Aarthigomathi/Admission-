package com.tncolleges.platform.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.CollegeSection;

import java.time.LocalDateTime;

/** Stable API representation for college About/Profile page blocks. */
public record AboutSectionResponse(
        Long id,
        Long collegeId,
        String sectionKey,
        String title,
        String content,
        Object data,
        String type,
        String imageUrl,
        String videoUrl,
        String documentUrl,
        String linkUrl,
        Integer displayOrder,
        boolean published,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static AboutSectionResponse from(CollegeSection section, ObjectMapper objectMapper) {
        Object data = null;
        if ("STRUCTURED".equalsIgnoreCase(section.getType()) && section.getContent() != null && !section.getContent().isBlank()) {
            try {
                data = objectMapper.readValue(section.getContent(), Object.class);
            } catch (JsonProcessingException exception) {
                throw new IllegalStateException("Stored structured About data is invalid", exception);
            }
        }
        return new AboutSectionResponse(
                section.getId(),
                section.getCollege() == null ? null : section.getCollege().getId(),
                section.getSectionKey(),
                section.getTitle(),
                section.getContent(),
                data,
                section.getType(),
                section.getImageUrl(),
                section.getVideoUrl(),
                section.getDocumentUrl(),
                section.getLinkUrl(),
                section.getDisplayOrder(),
                section.isPublished(),
                section.getStatus(),
                section.getCreatedAt(),
                section.getUpdatedAt()
        );
    }
}
