package com.tncolleges.platform.service;

import com.tncolleges.platform.model.*;
import com.tncolleges.platform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class EnquiryService {
    private static final Set<String> STATUSES = Set.of("New", "Contacted", "Follow-up", "Interested", "Closed");
    private final EnquiryRepository enquiries;
    private final CollegeRepository colleges;
    private final CourseRepository courses;
    private final UserRepository users;
    private final StudentRepository students;
    private final StudentEducationRepository education;
    private final NotificationRepository notifications;
    private final StudentActivityRepository activities;
    private final CollegeContentService collegeContent;

    public EnquiryService(EnquiryRepository enquiries, CollegeRepository colleges, CourseRepository courses,
                          UserRepository users, StudentRepository students, StudentEducationRepository education,
                          NotificationRepository notifications, StudentActivityRepository activities,
                          CollegeContentService collegeContent) {
        this.enquiries = enquiries;
        this.colleges = colleges;
        this.courses = courses;
        this.users = users;
        this.students = students;
        this.education = education;
        this.notifications = notifications;
        this.activities = activities;
        this.collegeContent = collegeContent;
    }

    @Transactional
    public Map<String, Object> create(String authenticatedEmail, Map<String, Object> payload) {
        if (!Boolean.parseBoolean(String.valueOf(payload.getOrDefault("consent", false)))) {
            throw new IllegalArgumentException("Consent is required before sharing contact information with a college");
        }
        User user = users.findByEmail(authenticatedEmail)
                .filter(u -> u.getRole() == User.Role.STUDENT)
                .orElseThrow(() -> new IllegalArgumentException("A student account is required to send an enquiry"));
        Long collegeId = number(required(payload, "college_id", "collegeId"), "college_id");
        College college = colleges.findById(collegeId)
                .filter(c -> c.isRegistered() && c.isActive())
                .orElseThrow(() -> new NoSuchElementException("Registered college not found"));

        Long courseId = optionalNumber(first(payload, "course_id", "courseId"));
        String courseName = firstText(payload, "course", "course_name", "courseName", "courseInterested");
        if (courseId != null) {
            Course course = courses.findById(courseId).orElse(null);
            if (course != null) {
                if (!Objects.equals(course.getCollege().getId(), collegeId)) throw new IllegalArgumentException("Course does not belong to the selected college");
                if (!course.isActive()) throw new IllegalArgumentException("Course is not active");
                if (courseName == null) courseName = course.getName();
            } else {
                Map<String, Object> customCourse = findCustomCourse(collegeId, courseId);
                if (customCourse == null) throw new NoSuchElementException("Course not found for this college");
                if (Boolean.FALSE.equals(customCourse.get("active"))) throw new IllegalArgumentException("Course is not active");
                if (courseName == null) courseName = firstText(customCourse, "name", "courseName");
            }
        }
        String message = firstText(payload, "question", "message");
        if (message == null) throw new IllegalArgumentException("Enquiry question is required");

        Student profile = students.findByUser_Id(user.getId()).orElse(null);
        Enquiry enquiry = Enquiry.builder()
                .college(college)
                .studentId(user.getId())
                .courseId(courseId)
                .consentGiven(true)
                .name(profile != null ? profile.getFullName() : user.getFullName())
                .email(user.getEmail())
                .phone(profile != null && profile.getMobile() != null ? profile.getMobile() : user.getPhone())
                .courseInterested(courseName)
                .contactMethod(Optional.ofNullable(firstText(payload, "contact_method", "contactMethod")).orElse("Email"))
                .message(message)
                .status("New")
                .createdAt(LocalDateTime.now())
                .build();
        enquiry = enquiries.save(enquiry);
        activities.save(StudentActivity.builder()
                .studentId(user.getId())
                .collegeId(collegeId)
                .courseId(courseId)
                .date(enquiry.getCreatedAt().toLocalDate())
                .time(enquiry.getCreatedAt().toLocalTime())
                .activityType(StudentActivity.ActivityType.ENQUIRY)
                .personalInfoShared(true)
                .metadata("{}")
                .createdAt(enquiry.getCreatedAt())
                .build());
        notifyCollegeAdmins(college, enquiry);
        return toMap(enquiry, false);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> byCollege(Long collegeId) {
        return enquiries.findByCollege_IdOrderByCreatedAtDesc(collegeId).stream().map(e -> toMap(e, true)).toList();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> byStudent(Long studentUserId) {
        return enquiries.findByStudentIdOrderByCreatedAtDesc(studentUserId).stream().map(e -> toMap(e, false)).toList();
    }

    @Transactional
    public Map<String, Object> updateStatus(Long enquiryId, String status, String updatedByEmail, boolean platformAdmin) {
        if (status == null || !STATUSES.contains(status.trim())) throw new IllegalArgumentException("Unsupported enquiry status");
        Enquiry enquiry = enquiries.findById(enquiryId).orElseThrow(() -> new NoSuchElementException("Enquiry not found"));
        if (!platformAdmin) {
            Long collegeId = enquiry.getCollege().getId();
            boolean canUpdate = users.findByEmail(updatedByEmail)
                    .filter(user -> (user.getRole() == User.Role.COLLEGE_ADMIN || user.getRole() == User.Role.COLLEGE_EDITOR)
                            && Objects.equals(user.getCollegeId(), collegeId))
                    .isPresent();
            if (!canUpdate) throw new org.springframework.security.access.AccessDeniedException("You cannot update this enquiry");
        }
        String previousStatus = enquiry.getStatus();
        enquiry.setStatus(status.trim());
        enquiry.setUpdatedAt(LocalDateTime.now());
        Enquiry saved = enquiries.save(enquiry);
        if (!Objects.equals(previousStatus, saved.getStatus())) {
            notifications.save(Notification.builder()
                    .userId(saved.getStudentId())
                    .title("Enquiry status updated")
                    .message(saved.getCollege().getName() + " updated your enquiry to " + saved.getStatus() + ".")
                    .type("ENQUIRY_STATUS")
                    .collegeId(saved.getCollege().getId())
                    .build());
        }
        return toMap(saved, false);
    }

    private void notifyCollegeAdmins(College college, Enquiry enquiry) {
        List<User> admins = users.findAllByCollegeIdAndRoleIn(college.getId(), List.of(User.Role.COLLEGE_ADMIN, User.Role.COLLEGE_EDITOR));
        for (User admin : admins) {
            notifications.save(Notification.builder()
                    .userId(admin.getId())
                    .title("New student enquiry")
                    .message("A student sent an enquiry about " + Optional.ofNullable(enquiry.getCourseInterested()).orElse(college.getName()))
                    .type("ENQUIRY")
                    .collegeId(college.getId())
                    .build());
        }
    }

    private Map<String, Object> toMap(Enquiry enquiry, boolean includeStudentDetails) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", enquiry.getId());
        if (!includeStudentDetails) result.put("student_id", enquiry.getStudentId());
        result.put("college_id", enquiry.getCollege().getId());
        result.put("college_name", enquiry.getCollege().getName());
        result.put("course_id", enquiry.getCourseId());
        result.put("course", enquiry.getCourseInterested());
        result.put("course_interest", enquiry.getCourseInterested());
        result.put("question", enquiry.getMessage());
        result.put("contact_method", enquiry.getContactMethod());
        result.put("status", enquiry.getStatus());
        result.put("consent_given", enquiry.isConsentGiven());
        result.put("personal_info_shared", enquiry.isConsentGiven());
        result.put("date", enquiry.getCreatedAt().toLocalDate().toString());
        result.put("time", enquiry.getCreatedAt().toLocalTime().toString());
        result.put("created_at", enquiry.getCreatedAt().toString());
        if (enquiry.getUpdatedAt() != null) result.put("updated_at", enquiry.getUpdatedAt().toString());
        if (includeStudentDetails && enquiry.isConsentGiven()) {
            result.put("student_name", enquiry.getName());
            result.put("student_email", enquiry.getEmail());
            result.put("student_phone", enquiry.getPhone());
            students.findByUser_Id(enquiry.getStudentId()).ifPresent(student -> {
                result.put("student_district", student.getDistrict());
                result.put("student_education", education.findByStudent_IdOrderByCreatedAtDesc(student.getId()).stream()
                        .findFirst().map(item -> item.getLevel() == null ? null : item.getLevel().name()).orElse(null));
            });
        }
        return result;
    }

    private Map<String, Object> findCustomCourse(Long collegeId, Long courseId) {
        Object saved = collegeContent.getSection(collegeId, "courses");
        if (!(saved instanceof List<?> list)) return null;
        for (Object item : list) {
            if (item instanceof Map<?, ?> map && Objects.equals(String.valueOf(map.get("id")), String.valueOf(courseId))) {
                return collegeContent.asMap(item);
            }
        }
        return null;
    }

    private Object first(Map<String, Object> payload, String... keys) {
        for (String key : keys) if (payload.get(key) != null) return payload.get(key);
        return null;
    }

    private String firstText(Map<String, Object> payload, String... keys) {
        Object value = first(payload, keys);
        if (value == null) return null;
        String text = String.valueOf(value).trim();
        return text.isEmpty() ? null : text;
    }

    private Object required(Map<String, Object> payload, String... keys) {
        Object value = first(payload, keys);
        if (value == null || String.valueOf(value).isBlank()) throw new IllegalArgumentException(keys[0] + " is required");
        return value;
    }

    private Long number(Object value, String field) {
        try { return Long.valueOf(String.valueOf(value)); }
        catch (NumberFormatException exception) { throw new IllegalArgumentException(field + " must be an integer"); }
    }

    private Long optionalNumber(Object value) {
        return value == null || String.valueOf(value).isBlank() ? null : number(value, "course_id");
    }
}
