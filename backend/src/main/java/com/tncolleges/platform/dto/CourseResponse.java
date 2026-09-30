package com.tncolleges.platform.dto;

import com.tncolleges.platform.model.Course;

/** Course API representation uses relationship IDs instead of nested JPA entities. */
public record CourseResponse(
        Long id,
        Long collegeId,
        Long departmentId,
        String name,
        String degreeType,
        String level,
        String duration,
        String eligibility,
        String admissionProcess,
        Integer intake,
        String fees,
        String description,
        String curriculum,
        String careerOpportunities,
        String brochureUrl,
        String admissionLink,
        String contactInfo,
        String imageUrl,
        boolean active,
        boolean featured
) {
    public static CourseResponse from(Course course) {
        return new CourseResponse(
                course.getId(),
                course.getCollege() == null ? null : course.getCollege().getId(),
                course.getDepartment() == null ? null : course.getDepartment().getId(),
                course.getName(),
                course.getDegreeType(),
                course.getLevel(),
                course.getDuration(),
                course.getEligibility(),
                course.getAdmissionProcess(),
                course.getIntake(),
                course.getFees(),
                course.getDescription(),
                course.getCurriculum(),
                course.getCareerOpportunities(),
                course.getBrochureUrl(),
                course.getAdmissionLink(),
                course.getContactInfo(),
                course.getImageUrl(),
                course.isActive(),
                course.isFeatured()
        );
    }
}
