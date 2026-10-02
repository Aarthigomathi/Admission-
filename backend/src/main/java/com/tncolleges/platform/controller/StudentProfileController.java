package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.Student;
import com.tncolleges.platform.model.StudentEducation;
import com.tncolleges.platform.model.StudentPreferences;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.StudentEducationRepository;
import com.tncolleges.platform.repository.StudentPreferencesRepository;
import com.tncolleges.platform.repository.StudentRepository;
import com.tncolleges.platform.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/students/me")
@PreAuthorize("hasRole('STUDENT')")
public class StudentProfileController {
    private final UserRepository userRepo;
    private final StudentRepository studentRepo;
    private final StudentEducationRepository educationRepo;
    private final StudentPreferencesRepository preferencesRepo;

    public StudentProfileController(UserRepository userRepo, StudentRepository studentRepo,
                                    StudentEducationRepository educationRepo,
                                    StudentPreferencesRepository preferencesRepo) {
        this.userRepo = userRepo;
        this.studentRepo = studentRepo;
        this.educationRepo = educationRepo;
        this.preferencesRepo = preferencesRepo;
    }

    @GetMapping
    public ResponseEntity<?> getMyProfile(@AuthenticationPrincipal UserDetails principal) {
        User user = userRepo.findByEmailIgnoreCase(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        Student student = studentRepo.findByUserId(user.getId()).orElse(null);
        if (student == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(profilePayload(student));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> updateMyProfile(@RequestBody Map<String, Object> payload,
                                              @AuthenticationPrincipal UserDetails principal) {
        User user = userRepo.findByEmailIgnoreCase(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        Student student = studentRepo.findByUserId(user.getId()).orElse(null);
        if (student == null) return ResponseEntity.notFound().build();

        setIfPresent(payload, "fullName", student::setFullName);
        setIfPresent(payload, "mobile", student::setMobile);
        setIfPresent(payload, "parentMobile", student::setParentMobile);
        setIfPresent(payload, "parentName", student::setParentName);
        setIfPresent(payload, "dob", student::setDateOfBirth);
        setIfPresent(payload, "gender", student::setGender);
        setIfPresent(payload, "permanentAddress", student::setAddress);
        setIfPresent(payload, "pincode", student::setPincode);
        setIfPresent(payload, "state", student::setState);
        setIfPresent(payload, "district", student::setDistrict);
        setIfPresent(payload, "city", student::setCity);
        student.setUpdatedAt(LocalDateTime.now());
        studentRepo.save(student);
        if (payload.containsKey("fullName")) {
            user.setFullName(value(payload, "fullName"));
            userRepo.save(user);
        }

        StudentEducation education = educationRepo.findFirstByStudentIdOrderByCreatedAtDesc(student.getId())
                .orElseGet(() -> StudentEducation.builder().student(student).build());
        if (payload.containsKey("educationLevel")) education.setLevel(parseEducationLevel(value(payload, "educationLevel")));
        setIfPresent(payload, "schoolCollege", education::setSchoolCollege);
        setIfPresent(payload, "marks", education::setMarks);
        setIfPresent(payload, "percentage", education::setPercentage);
        setIfPresent(payload, "groupStream", education::setGroupStream);
        setIfPresent(payload, "interestedSubject", education::setInterestedSubject);
        educationRepo.save(education);

        StudentPreferences preferences = preferencesRepo.findByStudentId(student.getId())
                .orElseGet(() -> StudentPreferences.builder().student(student).build());
        setIfPresent(payload, "interestedCourse", preferences::setInterestedCourse);
        setIfPresent(payload, "preferredDistrict", preferences::setPreferredDistrict);
        if (payload.containsKey("collegeType")) preferences.setCollegeType(parseCollegeType(value(payload, "collegeType")));
        if (payload.containsKey("hostelRequired")) preferences.setHostelRequired(isYes(value(payload, "hostelRequired")));
        if (payload.containsKey("transportRequired")) preferences.setTransportRequired(isYes(value(payload, "transportRequired")));
        preferencesRepo.save(preferences);
        return ResponseEntity.ok(profilePayload(student));
    }

    private Map<String, Object> profilePayload(Student student) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", student.getId());
        data.put("fullName", student.getFullName());
        data.put("email", student.getEmail());
        data.put("mobile", student.getMobile());
        data.put("parentName", student.getParentName());
        data.put("parentMobile", student.getParentMobile());
        data.put("dob", student.getDateOfBirth());
        data.put("gender", student.getGender());
        data.put("permanentAddress", student.getAddress());
        data.put("pincode", student.getPincode());
        data.put("state", student.getState());
        data.put("district", student.getDistrict());
        data.put("city", student.getCity());
        StudentEducation education = educationRepo.findFirstByStudentIdOrderByCreatedAtDesc(student.getId()).orElse(null);
        if (education != null) {
            data.put("educationLevel", displayEducationLevel(education.getLevel()));
            data.put("schoolCollege", education.getSchoolCollege());
            data.put("marks", education.getMarks());
            data.put("percentage", education.getPercentage());
            data.put("groupStream", education.getGroupStream());
            data.put("interestedSubject", education.getInterestedSubject());
        }
        StudentPreferences preferences = preferencesRepo.findByStudentId(student.getId()).orElse(null);
        if (preferences != null) {
            data.put("interestedCourse", preferences.getInterestedCourse());
            data.put("preferredDistrict", preferences.getPreferredDistrict());
            data.put("collegeType", preferences.getCollegeType() == null ? "Any" : preferences.getCollegeType().name());
            data.put("hostelRequired", Boolean.TRUE.equals(preferences.getHostelRequired()) ? "Yes" : "No");
            data.put("transportRequired", Boolean.TRUE.equals(preferences.getTransportRequired()) ? "Yes" : "No");
        }
        return data;
    }

    private void setIfPresent(Map<String, Object> source, String key, java.util.function.Consumer<String> setter) {
        if (source.containsKey(key)) setter.accept(value(source, key));
    }
    private String value(Map<String, Object> source, String key) {
        Object raw = source.get(key);
        return raw == null ? "" : String.valueOf(raw).trim();
    }
    private boolean isYes(String value) { return "yes".equalsIgnoreCase(value) || "true".equalsIgnoreCase(value); }
    private StudentEducation.EducationLevel parseEducationLevel(String raw) {
        return switch (raw.toUpperCase(Locale.ROOT)) {
            case "10TH", "TENTH" -> StudentEducation.EducationLevel.TENTH;
            case "11TH", "ELEVENTH" -> StudentEducation.EducationLevel.ELEVENTH;
            case "12TH", "TWELFTH" -> StudentEducation.EducationLevel.TWELFTH;
            case "DIPLOMA" -> StudentEducation.EducationLevel.DIPLOMA;
            case "UG" -> StudentEducation.EducationLevel.UG;
            case "PG" -> StudentEducation.EducationLevel.PG;
            default -> null;
        };
    }
    private String displayEducationLevel(StudentEducation.EducationLevel level) {
        if (level == null) return "";
        return switch (level) {
            case TENTH -> "10th";
            case ELEVENTH -> "11th";
            case TWELFTH -> "12th";
            case DIPLOMA -> "Diploma";
            case UG -> "UG";
            case PG -> "PG";
        };
    }
    private StudentPreferences.CollegeType parseCollegeType(String raw) {
        String value = raw.toUpperCase(Locale.ROOT);
        if (value.contains("GOV")) return StudentPreferences.CollegeType.GOVERNMENT;
        if (value.contains("PRIVATE")) return StudentPreferences.CollegeType.PRIVATE;
        if (value.contains("AUTONOMOUS")) return StudentPreferences.CollegeType.AUTONOMOUS;
        return StudentPreferences.CollegeType.ANY;
    }
}
