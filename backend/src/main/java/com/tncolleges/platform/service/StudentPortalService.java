package com.tncolleges.platform.service;

import com.tncolleges.platform.model.*;
import com.tncolleges.platform.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class StudentPortalService {
    private final UserRepository users;
    private final StudentRepository students;
    private final StudentEducationRepository education;
    private final StudentPreferencesRepository preferences;
    private final FavoriteRepository favorites;
    private final ComparisonRepository comparisons;
    private final StudentActivityRepository activities;
    private final CollegeRepository colleges;
    private final CollegeService collegeService;

    public StudentPortalService(UserRepository users, StudentRepository students, StudentEducationRepository education,
                                StudentPreferencesRepository preferences, FavoriteRepository favorites,
                                ComparisonRepository comparisons, StudentActivityRepository activities,
                                CollegeRepository colleges, CollegeService collegeService) {
        this.users = users;
        this.students = students;
        this.education = education;
        this.preferences = preferences;
        this.favorites = favorites;
        this.comparisons = comparisons;
        this.activities = activities;
        this.colleges = colleges;
        this.collegeService = collegeService;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> profile(String email) {
        Student student = getStudent(email);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", student.getId());
        result.put("userId", student.getUser().getId());
        result.put("fullName", student.getFullName());
        result.put("email", student.getEmail());
        result.put("mobile", student.getMobile());
        result.put("address", student.getAddress());
        result.put("district", student.getDistrict());
        result.put("city", student.getCity());
        result.put("profileCompletion", calculateCompletion(student));
        result.put("createdAt", student.getCreatedAt());
        result.put("updatedAt", student.getUpdatedAt());
        return result;
    }

    @Transactional
    public Map<String, Object> updateProfile(String email, Map<String, Object> updates) {
        Student student = getStudent(email);
        if (updates.containsKey("fullName")) student.setFullName(text(updates.get("fullName")));
        if (updates.containsKey("mobile")) student.setMobile(text(updates.get("mobile")));
        if (updates.containsKey("address")) student.setAddress(text(updates.get("address")));
        if (updates.containsKey("district")) student.setDistrict(text(updates.get("district")));
        if (updates.containsKey("city")) student.setCity(text(updates.get("city")));
        if (student.getFullName() == null || student.getFullName().isBlank()) throw new IllegalArgumentException("Full name is required");
        student.setUpdatedAt(LocalDateTime.now());
        student.setProfileCompletion(calculateCompletion(student));
        students.save(student);
        return profile(email);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> education(String email) {
        Student student = getStudent(email);
        return education.findByStudent_IdOrderByCreatedAtDesc(student.getId()).stream().map(this::educationMap).toList();
    }

    @Transactional
    public Map<String, Object> saveEducation(String email, Long educationId, Map<String, Object> body) {
        Student student = getStudent(email);
        StudentEducation record = educationId == null ? StudentEducation.builder().student(student).build()
                : education.findById(educationId).filter(item -> item.getStudent().getId().equals(student.getId()))
                .orElseThrow(() -> new NoSuchElementException("Education record not found"));
        Object level = body.get("level");
        if (level != null) record.setLevel(parseEducationLevel(String.valueOf(level)));
        if (body.containsKey("schoolCollege")) record.setSchoolCollege(text(body.get("schoolCollege")));
        if (body.containsKey("marks")) record.setMarks(text(body.get("marks")));
        if (body.containsKey("percentage")) record.setPercentage(text(body.get("percentage")));
        if (body.containsKey("groupStream")) record.setGroupStream(text(body.get("groupStream")));
        if (body.containsKey("interestedSubject")) record.setInterestedSubject(text(body.get("interestedSubject")));
        if (record.getLevel() == null) throw new IllegalArgumentException("Education level is required");
        record = education.save(record);
        student.setUpdatedAt(LocalDateTime.now());
        students.save(student);
        return educationMap(record);
    }

    @Transactional
    public void deleteEducation(String email, Long educationId) {
        Student student = getStudent(email);
        StudentEducation item = education.findById(educationId)
                .filter(record -> record.getStudent().getId().equals(student.getId()))
                .orElseThrow(() -> new NoSuchElementException("Education record not found"));
        education.delete(item);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getPreferences(String email) {
        Student student = getStudent(email);
        StudentPreferences value = preferences.findByStudent_Id(student.getId()).orElse(null);
        if (value == null) return Map.of("interestedCourse", "", "preferredDistrict", "", "collegeType", "ANY", "hostelRequired", false, "transportRequired", false);
        return preferenceMap(value);
    }

    @Transactional
    public Map<String, Object> savePreferences(String email, Map<String, Object> body) {
        Student student = getStudent(email);
        StudentPreferences value = preferences.findByStudent_Id(student.getId())
                .orElseGet(() -> StudentPreferences.builder().student(student).build());
        if (body.containsKey("interestedCourse")) value.setInterestedCourse(text(body.get("interestedCourse")));
        if (body.containsKey("preferredDistrict")) value.setPreferredDistrict(text(body.get("preferredDistrict")));
        if (body.containsKey("collegeType")) value.setCollegeType(parseCollegeType(String.valueOf(body.get("collegeType"))));
        if (body.containsKey("hostelRequired")) value.setHostelRequired(Boolean.parseBoolean(String.valueOf(body.get("hostelRequired"))));
        if (body.containsKey("transportRequired")) value.setTransportRequired(Boolean.parseBoolean(String.valueOf(body.get("transportRequired"))));
        return preferenceMap(preferences.save(value));
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> savedColleges(String email) {
        User user = getUser(email);
        return favorites.findByUser_IdOrderByCreatedAtDesc(user.getId()).stream()
                .filter(favorite -> favorite.getCollege() != null && favorite.getCollege().isRegistered())
                .map(favorite -> collegeService.byId(favorite.getCollege().getId(), false).orElse(null))
                .filter(Objects::nonNull).toList();
    }

    @Transactional
    public void saveCollege(String email, Long collegeId) {
        User user = getUser(email);
        College college = registeredCollege(collegeId);
        if (!favorites.existsByUser_IdAndCollege_Id(user.getId(), collegeId)) {
            favorites.save(Favorite.builder().user(user).college(college).build());
            recordActivity(user.getId(), collegeId, StudentActivity.ActivityType.SAVE);
        }
    }

    @Transactional
    public void unsaveCollege(String email, Long collegeId) {
        User user = getUser(email);
        favorites.deleteByUser_IdAndCollege_Id(user.getId(), collegeId);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> comparisons(String email) {
        User user = getUser(email);
        return comparisons.findByStudentIdOrderByComparedAtDesc(user.getId()).stream()
                .map(Comparison::getCollegeId).distinct()
                .map(id -> collegeService.byId(id, false).orElse(null))
                .filter(Objects::nonNull).toList();
    }

    @Transactional
    public void compareCollege(String email, Long collegeId) {
        User user = getUser(email);
        registeredCollege(collegeId);
        if (!comparisons.existsByStudentIdAndCollegeId(user.getId(), collegeId)) {
            comparisons.save(Comparison.builder().studentId(user.getId()).collegeId(collegeId).build());
            recordActivity(user.getId(), collegeId, StudentActivity.ActivityType.COMPARE);
        }
    }

    @Transactional
    public void removeComparison(String email, Long collegeId) {
        User user = getUser(email);
        comparisons.deleteByStudentIdAndCollegeId(user.getId(), collegeId);
    }

    private void recordActivity(Long studentId, Long collegeId, StudentActivity.ActivityType type) {
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        activities.save(StudentActivity.builder().studentId(studentId).collegeId(collegeId)
                .date(now.toLocalDate()).time(now.toLocalTime()).createdAt(now).activityType(type)
                .personalInfoShared(false).metadata("{}").build());
    }

    private Student getStudent(String email) {
        User user = getUser(email);
        return students.findByUser_Id(user.getId()).orElseGet(() -> students.save(Student.builder()
                .user(user).fullName(Optional.ofNullable(user.getFullName()).orElse("Student"))
                .email(user.getEmail()).mobile(user.getPhone()).build()));
    }

    private User getUser(String email) {
        return users.findByEmail(email).filter(user -> user.getRole() == User.Role.STUDENT)
                .orElseThrow(() -> new IllegalArgumentException("Student account required"));
    }

    private College registeredCollege(Long id) {
        return colleges.findById(id).filter(college -> college.isRegistered() && college.isActive() && college.isVerified())
                .orElseThrow(() -> new NoSuchElementException("Registered college not found"));
    }

    private int calculateCompletion(Student student) {
        int filled = 0;
        if (student.getFullName() != null && !student.getFullName().isBlank()) filled++;
        if (student.getEmail() != null && !student.getEmail().isBlank()) filled++;
        if (student.getMobile() != null && !student.getMobile().isBlank()) filled++;
        if (student.getAddress() != null && !student.getAddress().isBlank()) filled++;
        if (student.getDistrict() != null && !student.getDistrict().isBlank()) filled++;
        if (student.getCity() != null && !student.getCity().isBlank()) filled++;
        return (int) Math.round(filled * 100.0 / 6.0);
    }

    private Map<String, Object> educationMap(StudentEducation item) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", item.getId());
        result.put("level", item.getLevel() == null ? null : item.getLevel().name());
        result.put("schoolCollege", item.getSchoolCollege());
        result.put("marks", item.getMarks());
        result.put("percentage", item.getPercentage());
        result.put("groupStream", item.getGroupStream());
        result.put("interestedSubject", item.getInterestedSubject());
        result.put("createdAt", item.getCreatedAt());
        return result;
    }

    private Map<String, Object> preferenceMap(StudentPreferences item) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("interestedCourse", item.getInterestedCourse());
        result.put("preferredDistrict", item.getPreferredDistrict());
        result.put("collegeType", item.getCollegeType() == null ? "ANY" : item.getCollegeType().name());
        result.put("hostelRequired", Boolean.TRUE.equals(item.getHostelRequired()));
        result.put("transportRequired", Boolean.TRUE.equals(item.getTransportRequired()));
        return result;
    }

    private StudentEducation.EducationLevel parseEducationLevel(String value) {
        return switch (value.trim().toUpperCase(Locale.ROOT).replace(" ", "")) {
            case "10TH", "TENTH", "10" -> StudentEducation.EducationLevel.TENTH;
            case "11TH", "ELEVENTH", "11" -> StudentEducation.EducationLevel.ELEVENTH;
            case "12TH", "TWELFTH", "12" -> StudentEducation.EducationLevel.TWELFTH;
            case "DIPLOMA" -> StudentEducation.EducationLevel.DIPLOMA;
            case "UG", "UNDERGRADUATE" -> StudentEducation.EducationLevel.UG;
            case "PG", "POSTGRADUATE" -> StudentEducation.EducationLevel.PG;
            default -> throw new IllegalArgumentException("Unsupported education level");
        };
    }

    private StudentPreferences.CollegeType parseCollegeType(String value) {
        return switch (value.trim().toUpperCase(Locale.ROOT)) {
            case "GOVT", "GOVERNMENT" -> StudentPreferences.CollegeType.GOVERNMENT;
            case "GOVERNMENT AIDED", "GOVERNMENT_AIDED" -> StudentPreferences.CollegeType.GOVERNMENT_AIDED;
            case "PRIVATE" -> StudentPreferences.CollegeType.PRIVATE;
            case "AUTONOMOUS" -> StudentPreferences.CollegeType.AUTONOMOUS;
            case "ANY" -> StudentPreferences.CollegeType.ANY;
            default -> throw new IllegalArgumentException("Unsupported college type preference");
        };
    }

    private String text(Object value) { return value == null ? null : String.valueOf(value).trim(); }
}
