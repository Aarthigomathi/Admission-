package com.tncolleges.platform.service;

import com.tncolleges.platform.model.*;
import com.tncolleges.platform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlatformAnalyticsService {
    private final CollegeRepository colleges;
    private final UserRepository users;
    private final StudentRepository students;
    private final StudentEducationRepository education;
    private final StudentActivityRepository activities;
    private final EnquiryRepository enquiries;
    private final CourseRepository courses;
    private final CollegeContentService collegeContent;

    public PlatformAnalyticsService(CollegeRepository colleges, UserRepository users, StudentRepository students,
                                    StudentEducationRepository education, StudentActivityRepository activities,
                                    EnquiryRepository enquiries, CourseRepository courses, CollegeContentService collegeContent) {
        this.colleges = colleges;
        this.users = users;
        this.students = students;
        this.education = education;
        this.activities = activities;
        this.enquiries = enquiries;
        this.courses = courses;
        this.collegeContent = collegeContent;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> dashboard() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("total_students", users.countByRole(User.Role.STUDENT));
        stats.put("total_colleges", colleges.countByRegisteredTrueAndActiveTrue());
        stats.put("verified_colleges", colleges.countByRegisteredTrueAndVerificationStatus(College.VerificationStatus.VERIFIED));
        stats.put("pending_colleges", colleges.countByRegisteredTrueAndVerificationStatus(College.VerificationStatus.PENDING));
        stats.put("total_college_views", activities.countByActivityType(StudentActivity.ActivityType.COLLEGE_VIEW));
        stats.put("total_course_views", activities.countByActivityType(StudentActivity.ActivityType.COURSE_VIEW));
        stats.put("total_saves", activities.countByActivityType(StudentActivity.ActivityType.SAVE));
        stats.put("total_comparisons", activities.countByActivityType(StudentActivity.ActivityType.COMPARE));
        stats.put("total_enquiries", enquiries.count());
        stats.put("generated_at", LocalDateTime.now().toString());
        return stats;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> collegeViewsChart() {
        List<Map<String, Object>> output = new ArrayList<>();
        for (College college : colleges.findAllByRegisteredTrueAndActiveTrueAndVerifiedTrueOrderByNameAsc()) {
            List<StudentActivity> rows = activities.findByCollegeIdOrderByCreatedAtDesc(college.getId());
            long views = rows.stream().filter(a -> a.getActivityType() == StudentActivity.ActivityType.COLLEGE_VIEW).count();
            long distinct = rows.stream().filter(a -> a.getActivityType() == StudentActivity.ActivityType.COLLEGE_VIEW)
                    .map(StudentActivity::getStudentId).distinct().count();
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("college_id", college.getId());
            item.put("college_name", college.getName());
            item.put("short_name", college.getShortName());
            item.put("district", college.getDistrict());
            item.put("views", views);
            item.put("students_viewed", distinct);
            output.add(item);
        }
        return output;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> courseInterestChart() {
        Map<Long, Map<Long, Long>> counts = new LinkedHashMap<>();
        for (StudentActivity activity : activities.findAll()) {
            if (activity.getActivityType() != StudentActivity.ActivityType.COURSE_VIEW || activity.getCourseId() == null) continue;
            counts.computeIfAbsent(activity.getCollegeId(), ignored -> new LinkedHashMap<>())
                    .merge(activity.getCourseId(), 1L, Long::sum);
        }
        List<Map<String, Object>> output = new ArrayList<>();
        for (Map.Entry<Long, Map<Long, Long>> collegeEntry : counts.entrySet()) {
            College college = colleges.findById(collegeEntry.getKey()).filter(College::isRegistered).orElse(null);
            if (college == null) continue;
            for (Map.Entry<Long, Long> courseEntry : collegeEntry.getValue().entrySet()) {
                Course relational = courses.findById(courseEntry.getKey()).filter(course -> course.getCollege() != null
                        && college.getId().equals(course.getCollege().getId())).orElse(null);
                String courseName = relational == null ? customCourseName(college.getId(), courseEntry.getKey()) : relational.getName();
                if (courseName == null) courseName = "Course " + courseEntry.getKey();
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("course_id", courseEntry.getKey());
                item.put("course", courseName);
                item.put("college_id", college.getId());
                item.put("interest", courseEntry.getValue());
                output.add(item);
            }
        }
        output.sort(Comparator.comparingLong(row -> -((Number) row.get("interest")).longValue()));
        return output;
    }

    private String customCourseName(Long collegeId, Long courseId) {
        Object value = collegeContent.getSection(collegeId, "courses");
        if (!(value instanceof List<?> list)) return null;
        for (Object item : list) {
            if (item instanceof Map<?, ?> map && Objects.equals(String.valueOf(map.get("id")), String.valueOf(courseId))) {
                Object name = map.get("name");
                return name == null ? null : String.valueOf(name);
            }
        }
        return null;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> districtWiseInterest() {
        Set<Long> viewerIds = activities.findAll().stream()
                .filter(a -> a.getActivityType() == StudentActivity.ActivityType.COLLEGE_VIEW || a.getActivityType() == StudentActivity.ActivityType.COURSE_VIEW)
                .map(StudentActivity::getStudentId).collect(Collectors.toSet());
        if (viewerIds.isEmpty()) return Map.of();
        List<Student> profiles = students.findAllByUser_IdIn(new ArrayList<>(viewerIds));
        Map<String, Long> result = new TreeMap<>();
        profiles.stream().filter(s -> s.getDistrict() != null && !s.getDistrict().isBlank())
                .forEach(s -> result.merge(s.getDistrict(), 1L, Long::sum));
        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> educationLevelInterest() {
        Set<Long> viewerIds = activities.findAll().stream()
                .filter(a -> a.getActivityType() == StudentActivity.ActivityType.COLLEGE_VIEW || a.getActivityType() == StudentActivity.ActivityType.COURSE_VIEW)
                .map(StudentActivity::getStudentId).collect(Collectors.toSet());
        if (viewerIds.isEmpty()) return Map.of();
        List<Long> profileIds = students.findAllByUser_IdIn(new ArrayList<>(viewerIds)).stream().map(Student::getId).toList();
        Map<String, Long> result = new TreeMap<>();
        if (!profileIds.isEmpty()) education.findByStudent_IdIn(profileIds).stream().filter(e -> e.getLevel() != null)
                .forEach(e -> result.merge(e.getLevel().name(), 1L, Long::sum));
        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> studentVisitAudit(Long collegeId, Long studentId, java.time.LocalDate from,
                                                  java.time.LocalDate to, String search, int requestedPage, int requestedSize) {
        if (from != null && to != null && to.isBefore(from)) throw new IllegalArgumentException("to date must be on or after from date");
        int pageNumber = Math.max(0, requestedPage);
        int pageSize = Math.max(1, Math.min(requestedSize, 100));
        java.time.LocalDateTime fromTime = from == null ? null : from.atStartOfDay();
        java.time.LocalDateTime toExclusive = to == null ? null : to.plusDays(1).atStartOfDay();
        String normalizedSearch = search == null || search.isBlank() ? null : search.trim();
        org.springframework.data.domain.Page<Object[]> page =
                activities.findStudentCollegeVisits(collegeId, studentId, fromTime, toExclusive, normalizedSearch,
                        org.springframework.data.domain.PageRequest.of(pageNumber, pageSize));

        List<Object[]> visitRows = page.getContent();
        List<Long> userIds = visitRows.stream().map(row -> asLong(row[0])).distinct().toList();
        List<Long> collegeIds = visitRows.stream().map(row -> asLong(row[1])).distinct().toList();
        Map<Long, User> userById = new HashMap<>();
        users.findAllById(userIds).forEach(user -> userById.put(user.getId(), user));
        List<Student> profiles = userIds.isEmpty() ? List.of() : students.findAllByUser_IdIn(userIds);
        Map<Long, Student> profileByUserId = new HashMap<>();
        profiles.stream().filter(profile -> profile.getUser() != null)
                .forEach(profile -> profileByUserId.put(profile.getUser().getId(), profile));
        Map<Long, College> collegeById = new HashMap<>();
        colleges.findAllById(collegeIds).forEach(college -> collegeById.put(college.getId(), college));
        Map<Long, StudentEducation> latestEducation = new HashMap<>();
        List<Long> profileIds = profiles.stream().map(Student::getId).toList();
        if (!profileIds.isEmpty()) {
            for (StudentEducation item : education.findByStudent_IdIn(profileIds)) {
                StudentEducation previous = latestEducation.get(item.getStudent().getId());
                if (previous == null || (item.getCreatedAt() != null && previous.getCreatedAt() != null
                        && item.getCreatedAt().isAfter(previous.getCreatedAt()))) {
                    latestEducation.put(item.getStudent().getId(), item);
                }
            }
        }

        List<Map<String, Object>> content = new ArrayList<>();
        for (Object[] row : visitRows) {
            Long studentUserId = asLong(row[0]);
            Long visitedCollegeId = asLong(row[1]);
            User user = userById.get(studentUserId);
            College college = collegeById.get(visitedCollegeId);
            if (user == null || college == null || !college.isRegistered()) continue;
            Student profile = profileByUserId.get(studentUserId);
            StudentEducation latest = profile == null ? null : latestEducation.get(profile.getId());
            long collegeViews = asLong(row[2]);
            long courseViews = asLong(row[3]);
            Map<String, Object> record = new LinkedHashMap<>();
            record.put("student_id", user.getId());
            record.put("student_name", profile != null && profile.getFullName() != null ? profile.getFullName() : user.getFullName());
            record.put("student_email", profile != null && profile.getEmail() != null ? profile.getEmail() : user.getEmail());
            record.put("student_phone", profile != null && profile.getMobile() != null ? profile.getMobile() : user.getPhone());
            record.put("student_district", profile == null ? null : profile.getDistrict());
            record.put("student_city", profile == null ? null : profile.getCity());
            record.put("student_profile_completion", profile == null ? null : profile.getProfileCompletion());
            record.put("education_level", latest == null || latest.getLevel() == null ? null : latest.getLevel().name());
            record.put("education_school_college", latest == null ? null : latest.getSchoolCollege());
            record.put("education_marks", latest == null ? null : latest.getMarks());
            record.put("education_percentage", latest == null ? null : latest.getPercentage());
            record.put("education_group_stream", latest == null ? null : latest.getGroupStream());
            record.put("education_interested_subject", latest == null ? null : latest.getInterestedSubject());
            record.put("college_id", college.getId());
            record.put("college_name", college.getName());
            record.put("college_slug", college.getSlug());
            record.put("college_district", college.getDistrict());
            record.put("college_views", collegeViews);
            record.put("course_views", courseViews);
            record.put("total_views", collegeViews + courseViews);
            record.put("last_visited_at", asLocalDateTime(row[4]));
            content.add(record);
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("content", content);
        result.put("page", pageNumber);
        result.put("size", pageSize);
        result.put("total_elements", page.getTotalElements());
        result.put("total_pages", page.getTotalPages());
        result.put("privacy_note", "Identifiable visit records are restricted to platform administrators and are never returned to college accounts.");
        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> collegeInterest(Long collegeId) {
        College college = colleges.findById(collegeId).filter(College::isRegistered)
                .orElseThrow(() -> new NoSuchElementException("Registered college not found"));
        List<StudentActivity> rows = activities.findByCollegeIdOrderByCreatedAtDesc(collegeId);
        Set<Long> viewers = rows.stream().filter(a -> a.getActivityType() == StudentActivity.ActivityType.COLLEGE_VIEW || a.getActivityType() == StudentActivity.ActivityType.COURSE_VIEW)
                .map(StudentActivity::getStudentId).collect(Collectors.toSet());
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("college_id", collegeId);
        result.put("college_name", college.getName());
        result.put("total_students_viewed", viewers.size());
        result.put("total_views", count(rows, StudentActivity.ActivityType.COLLEGE_VIEW));
        result.put("total_course_views", count(rows, StudentActivity.ActivityType.COURSE_VIEW));
        result.put("total_saved", count(rows, StudentActivity.ActivityType.SAVE));
        result.put("total_compared", count(rows, StudentActivity.ActivityType.COMPARE));
        result.put("total_enquiries", enquiries.countByCollege_Id(collegeId));
        result.put("by_activity_type", activityBreakdown(rows));
        result.put("by_date", rows.stream().collect(Collectors.groupingBy(a -> a.getDate().toString(), TreeMap::new, Collectors.counting())));
        result.put("privacy_note", "Aggregated counts only; student identity and browsing details are private.");
        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> studentSummary() {
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("total_students", users.countByRole(User.Role.STUDENT));
        summary.put("by_education", educationLevelInterest());
        summary.put("by_district", districtWiseInterest());
        summary.put("by_course", courseInterestChart());
        summary.put("privacy_note", "Aggregate statistics only. Student names, email addresses, phone numbers, and individual browsing histories are not included.");
        return summary;
    }

    private long asLong(Object value) {
        return value instanceof Number number ? number.longValue() : 0L;
    }

    private LocalDateTime asLocalDateTime(Object value) {
        if (value instanceof LocalDateTime timestamp) return timestamp;
        if (value instanceof java.sql.Timestamp timestamp) return timestamp.toLocalDateTime();
        if (value instanceof java.util.Date timestamp) return new java.sql.Timestamp(timestamp.getTime()).toLocalDateTime();
        return value == null ? null : LocalDateTime.parse(String.valueOf(value).replace(' ', 'T'));
    }

    private long count(List<StudentActivity> rows, StudentActivity.ActivityType type) {
        return rows.stream().filter(row -> row.getActivityType() == type).count();
    }

    private Map<String, Long> activityBreakdown(List<StudentActivity> rows) {
        Map<String, Long> result = new LinkedHashMap<>();
        for (StudentActivity.ActivityType type : StudentActivity.ActivityType.values()) {
            long count = count(rows, type);
            if (count > 0) result.put(type.name(), count);
        }
        return result;
    }
}
