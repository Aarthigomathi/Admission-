package com.tncolleges.platform.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.*;
import com.tncolleges.platform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StudentActivityService {
    private final StudentActivityRepository activities;
    private final CollegeRepository colleges;
    private final CourseRepository courses;
    private final UserRepository users;
    private final StudentRepository students;
    private final StudentEducationRepository education;
    private final CollegeContentService collegeContent;
    private final ObjectMapper mapper;

    public StudentActivityService(StudentActivityRepository activities, CollegeRepository colleges,
                                  CourseRepository courses, UserRepository users, StudentRepository students,
                                  StudentEducationRepository education, CollegeContentService collegeContent, ObjectMapper mapper) {
        this.activities = activities;
        this.colleges = colleges;
        this.courses = courses;
        this.users = users;
        this.students = students;
        this.education = education;
        this.collegeContent = collegeContent;
        this.mapper = mapper;
    }

    @Transactional
    public Map<String, Object> track(String email, Map<String, Object> payload) {
        User user = users.findByEmail(email).filter(u -> u.getRole() == User.Role.STUDENT)
                .orElseThrow(() -> new IllegalArgumentException("A student account is required"));
        Long collegeId = number(first(payload, "college_id", "collegeId"), "college_id");
        College college = colleges.findById(collegeId).filter(c -> c.isRegistered() && c.isActive() && c.isVerified())
                .orElseThrow(() -> new NoSuchElementException("Registered college not found"));
        String typeText = text(first(payload, "activity_type", "activityType"));
        StudentActivity.ActivityType type;
        try { type = StudentActivity.ActivityType.valueOf(typeText.toUpperCase(Locale.ROOT)); }
        catch (Exception exception) { throw new IllegalArgumentException("Unsupported activity type"); }
        boolean consent = Boolean.parseBoolean(String.valueOf(payload.getOrDefault("consent", false)));
        if (type == StudentActivity.ActivityType.ENQUIRY && !consent) {
            throw new IllegalArgumentException("Consent is required to record an enquiry activity");
        }
        Long courseId = optionalNumber(first(payload, "course_id", "courseId"));
        if (type == StudentActivity.ActivityType.COURSE_VIEW && courseId == null) {
            throw new IllegalArgumentException("course_id is required for a course view");
        }
        if (courseId != null) {
            Course course = courses.findById(courseId).orElse(null);
            if (course != null) {
                if (!Objects.equals(course.getCollege().getId(), collegeId)) throw new IllegalArgumentException("Course does not belong to the selected college");
                if (!course.isActive()) throw new IllegalArgumentException("Course is not active");
            } else {
                Map<String, Object> customCourse = findCustomCourse(collegeId, courseId);
                if (customCourse == null) throw new NoSuchElementException("Course not found for this college");
                if (Boolean.FALSE.equals(customCourse.get("active"))) throw new IllegalArgumentException("Course is not active");
            }
        }
        String metadata = sanitizeMetadata(payload.get("metadata"));
        LocalDateTime now = LocalDateTime.now();
        StudentActivity activity = activities.save(StudentActivity.builder()
                .studentId(user.getId())
                .collegeId(collegeId)
                .courseId(courseId)
                .date(now.toLocalDate())
                .time(now.toLocalTime())
                .createdAt(now)
                .activityType(type)
                .personalInfoShared(type == StudentActivity.ActivityType.ENQUIRY && consent)
                .metadata(metadata)
                .build());
        Map<String, Object> result = activityMap(activity);
        result.put("college_name", college.getName());
        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> aggregate(Long collegeId) {
        List<StudentActivity> rows = activities.findByCollegeIdOrderByCreatedAtDesc(collegeId);
        Set<Long> viewerIds = rows.stream()
                .filter(a -> a.getActivityType() == StudentActivity.ActivityType.COLLEGE_VIEW || a.getActivityType() == StudentActivity.ActivityType.COURSE_VIEW)
                .map(StudentActivity::getStudentId).collect(Collectors.toSet());
        long totalViews = count(rows, StudentActivity.ActivityType.COLLEGE_VIEW);
        long courseViews = count(rows, StudentActivity.ActivityType.COURSE_VIEW);
        Map<String, Long> byType = new LinkedHashMap<>();
        for (StudentActivity.ActivityType type : StudentActivity.ActivityType.values()) {
            long value = count(rows, type);
            if (value > 0) byType.put(type.name(), value);
        }
        Map<String, Long> byDate = rows.stream().collect(Collectors.groupingBy(
                row -> row.getDate().toString(), TreeMap::new, Collectors.counting()));
        Map<String, Long> byCourse = rows.stream()
                .filter(row -> row.getActivityType() == StudentActivity.ActivityType.COURSE_VIEW)
                .collect(Collectors.groupingBy(this::courseLabel, LinkedHashMap::new, Collectors.counting()));

        List<Student> profiles = viewerIds.isEmpty() ? List.of() : students.findAllByUser_IdIn(new ArrayList<>(viewerIds));
        Map<Long, Student> profileByUser = profiles.stream().filter(s -> s.getUser() != null)
                .collect(Collectors.toMap(s -> s.getUser().getId(), s -> s, (a, b) -> a));
        Map<String, Long> byDistrict = new TreeMap<>();
        for (Long userId : viewerIds) {
            Student student = profileByUser.get(userId);
            if (student != null && student.getDistrict() != null && !student.getDistrict().isBlank()) {
                byDistrict.merge(student.getDistrict(), 1L, Long::sum);
            }
        }
        List<Long> studentProfileIds = profiles.stream().map(Student::getId).toList();
        Map<String, Long> byEducation = new TreeMap<>();
        if (!studentProfileIds.isEmpty()) {
            education.findByStudent_IdIn(studentProfileIds).stream()
                    .filter(e -> e.getLevel() != null)
                    .forEach(e -> byEducation.merge(e.getLevel().name(), 1L, Long::sum));
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("college_id", collegeId);
        result.put("total_students_viewed", viewerIds.size());
        result.put("total_views", totalViews);
        result.put("total_course_views", courseViews);
        result.put("total_saved", count(rows, StudentActivity.ActivityType.SAVE));
        result.put("total_compared", count(rows, StudentActivity.ActivityType.COMPARE));
        result.put("total_enquiries", count(rows, StudentActivity.ActivityType.ENQUIRY));
        result.put("by_education", byEducation);
        result.put("by_district", byDistrict);
        result.put("by_course", byCourse);
        result.put("by_activity_type", byType);
        result.put("by_date", byDate);
        result.put("privacy_note", "Aggregated counts only. Student identity and browsing details are not exposed to colleges.");
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> byStudent(Long studentUserId) {
        return activities.findByStudentIdOrderByCreatedAtDesc(studentUserId).stream().map(this::activityMap).toList();
    }

    @Transactional(readOnly = true)
    public long totalActivities() {
        return activities.count();
    }

    private long count(List<StudentActivity> rows, StudentActivity.ActivityType type) {
        return rows.stream().filter(row -> row.getActivityType() == type).count();
    }

    private String courseLabel(StudentActivity row) {
        if (row.getCourseId() == null) return "Unknown course";
        Course relational = courses.findById(row.getCourseId()).orElse(null);
        if (relational != null) return relational.getName();
        Map<String, Object> custom = findCustomCourse(row.getCollegeId(), row.getCourseId());
        return custom == null ? "Course " + row.getCourseId() : String.valueOf(custom.getOrDefault("name", "Course " + row.getCourseId()));
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

    private Map<String, Object> activityMap(StudentActivity row) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", row.getId());
        result.put("college_id", row.getCollegeId());
        result.put("course_id", row.getCourseId());
        result.put("date", row.getDate().toString());
        result.put("time", row.getTime().toString());
        result.put("activity_type", row.getActivityType().name());
        result.put("personal_info_shared", Boolean.TRUE.equals(row.getPersonalInfoShared()));
        result.put("metadata", parseMetadata(row.getMetadata()));
        result.put("created_at", row.getCreatedAt().toString());
        return result;
    }

    private Object parseMetadata(String json) {
        if (json == null || json.isBlank()) return Map.of();
        try { return mapper.readValue(json, new TypeReference<Map<String, Object>>() {}); }
        catch (JsonProcessingException exception) { return Map.of(); }
    }

    private String sanitizeMetadata(Object value) {
        if (!(value instanceof Map<?, ?> rawMap)) return "{}";
        Object cleaned = sanitizeMetadataValue(rawMap, 0);
        try {
            String serialized = mapper.writeValueAsString(cleaned);
            return serialized.length() <= 1000 ? serialized : "{}";
        } catch (JsonProcessingException exception) { return "{}"; }
    }

    private Object sanitizeMetadataValue(Object value, int depth) {
        if (depth > 5) return null;
        if (value instanceof Map<?, ?> raw) {
            Map<String, Object> safe = new LinkedHashMap<>();
            for (Map.Entry<?, ?> entry : raw.entrySet()) {
                String key = String.valueOf(entry.getKey());
                String normalized = key.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
                if (key.length() > 80 || isPrivateMetadataKey(normalized)) continue;
                safe.put(key, sanitizeMetadataValue(entry.getValue(), depth + 1));
            }
            return safe;
        }
        if (value instanceof Collection<?> collection) {
            List<Object> safe = new ArrayList<>();
            for (Object item : collection) {
                if (safe.size() >= 50) break;
                safe.add(sanitizeMetadataValue(item, depth + 1));
            }
            return safe;
        }
        if (value instanceof String text) return text.length() > 250 ? text.substring(0, 250) : text;
        if (value instanceof Number || value instanceof Boolean || value == null) return value;
        return String.valueOf(value).substring(0, Math.min(String.valueOf(value).length(), 250));
    }

    private boolean isPrivateMetadataKey(String key) {
        return key.contains("name") || key.contains("email") || key.contains("phone") || key.contains("mobile")
                || key.contains("contact") || key.contains("studentid") || key.equals("userid")
                || key.contains("address") || key.equals("dob") || key.contains("birthdate");
    }

    private Object first(Map<String, Object> payload, String... keys) {
        for (String key : keys) if (payload.get(key) != null) return payload.get(key);
        return null;
    }

    private String text(Object value) {
        return value == null ? "" : String.valueOf(value).trim();
    }

    private Long number(Object value, String field) {
        try { return Long.valueOf(text(value)); }
        catch (NumberFormatException exception) { throw new IllegalArgumentException(field + " must be an integer"); }
    }

    private Long optionalNumber(Object value) {
        return value == null || text(value).isBlank() ? null : number(value, "course_id");
    }
}
