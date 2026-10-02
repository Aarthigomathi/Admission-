package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.*;
import com.tncolleges.platform.repository.*;
import com.tncolleges.platform.security.JwtService;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepo;
    private final StudentRepository studentRepo;
    private final StudentEducationRepository educationRepo;
    private final StudentPreferencesRepository preferencesRepo;
    private final CollegeRepository collegeRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthController(UserRepository userRepo, StudentRepository studentRepo,
                         StudentEducationRepository educationRepo, StudentPreferencesRepository preferencesRepo,
                         CollegeRepository collegeRepo, PasswordEncoder passwordEncoder,
                         JwtService jwtService, AuthenticationManager authManager) {
        this.userRepo = userRepo;
        this.studentRepo = studentRepo;
        this.educationRepo = educationRepo;
        this.preferencesRepo = preferencesRepo;
        this.collegeRepo = collegeRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        String email = clean(req.getEmail()).toLowerCase(Locale.ROOT);
        String password = clean(req.getPassword());
        if (email.isBlank() || password.length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "A valid email and a password of at least 8 characters are required."));
        }
        if (userRepo.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "An account with this email already exists."));
        }

        User.Role role;
        try {
            role = parseRegistrationRole(req.getRole());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
        String username = clean(req.getUsername());
        if (!username.isBlank() && userRepo.existsByUsernameIgnoreCase(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "This username is already in use."));
        }

        User user = User.builder()
                .email(email)
                .username(username.isBlank() ? null : username)
                .password(passwordEncoder.encode(password))
                .fullName(firstNonBlank(req.getFullName(), email))
                .phone(clean(req.getPhone()))
                .role(role)
                .enabled(true)
                .build();
        user = userRepo.save(user);

        Student student = null;
        College college = null;
        if (role == User.Role.STUDENT) {
            Map<String, Object> profile = req.getStudentProfile() == null ? Map.of() : req.getStudentProfile();
            student = Student.builder()
                    .user(user)
                    .fullName(firstNonBlank(value(profile, "fullName"), req.getFullName(), email))
                    .email(email)
                    .mobile(firstNonBlank(value(profile, "mobile"), req.getPhone()))
                    .parentName(value(profile, "fatherName"))
                    .parentMobile(firstNonBlank(value(profile, "fatherMobile"), value(profile, "parentMobile")))
                    .dateOfBirth(value(profile, "dob"))
                    .gender(value(profile, "gender"))
                    .address(value(profile, "permanentAddress"))
                    .pincode(value(profile, "pincode"))
                    .state(value(profile, "state"))
                    .district(value(profile, "district"))
                    .city(value(profile, "city"))
                    .profileCompletion(100)
                    .build();
            student = studentRepo.save(student);

            String educationLevel = value(profile, "educationLevel");
            StudentEducation.EducationLevel parsedLevel = parseEducationLevel(educationLevel);
            if (parsedLevel != null) {
                educationRepo.save(StudentEducation.builder()
                        .student(student)
                        .level(parsedLevel)
                        .schoolCollege(value(profile, "schoolCollege"))
                        .marks(value(profile, "marks"))
                        .percentage(value(profile, "percentage"))
                        .groupStream(value(profile, "groupStream"))
                        .interestedSubject(value(profile, "interestedSubject"))
                        .build());
            }
            preferencesRepo.save(StudentPreferences.builder()
                    .student(student)
                    .interestedCourse(value(profile, "interestedCourse"))
                    .preferredDistrict(value(profile, "preferredDistrict"))
                    .collegeType(parseCollegeType(value(profile, "collegeType")))
                    .hostelRequired(isYes(value(profile, "hostelRequired")))
                    .transportRequired(isYes(value(profile, "transportRequired")))
                    .build());
        } else if (role == User.Role.COLLEGE_ADMIN) {
            Map<String, Object> profile = req.getCollegeProfile() == null ? Map.of() : req.getCollegeProfile();
            String name = firstNonBlank(value(profile, "collegeName"), value(profile, "name"));
            if (name.isBlank()) return ResponseEntity.badRequest().body(Map.of("error", "College name is required."));
            String slugBase = slugify(name);
            String slug = slugBase + "-" + UUID.randomUUID().toString().substring(0, 8);
            college = collegeRepo.save(College.builder()
                    .slug(slug)
                    .name(name)
                    .shortName(firstNonBlank(value(profile, "shortName"), name))
                    .tagline(name + " - Excellence in Education")
                    .type(value(profile, "collegeType"))
                    .collegeType(value(profile, "collegeType"))
                    .district(value(profile, "district"))
                    .city(value(profile, "city"))
                    .address(value(profile, "address"))
                    .pincode(value(profile, "pincode"))
                    .phone(firstNonBlank(value(profile, "phone"), req.getPhone()))
                    .email(email)
                    .website(value(profile, "website"))
                    .affiliation(value(profile, "university"))
                    .university(value(profile, "university"))
                    .established(parseInteger(value(profile, "establishedYear")))
                    .principalName(value(profile, "principalName"))
                    .verificationStatus(College.VerificationStatus.PENDING)
                    .verified(false)
                    .active(true)
                    .build());
            user.setCollegeId(college.getId());
            user = userRepo.save(user);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(sessionPayload(user, student, college));
    }

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String loginId = firstNonBlank(req.getLoginId(), req.getEmail()).trim();
        if (loginId.isBlank() || req.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email/username and password are required."));
        }
        User user = userRepo.findByLoginId(loginId).orElse(null);
        if (user == null || !user.isEnabled()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email/username or password."));
        }
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), req.getPassword()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email/username or password."));
        }

        if (req.getRole() != null && !roleMatches(req.getRole(), user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "This account does not have the selected role."));
        }
        user.setLastLogin(java.time.LocalDateTime.now());
        userRepo.save(user);
        Student student = studentRepo.findByUserId(user.getId()).orElse(null);
        College college = user.getCollegeId() == null ? null : collegeRepo.findById(user.getCollegeId()).orElse(null);
        return ResponseEntity.ok(sessionPayload(user, student, college));
    }

    private Map<String, Object> sessionPayload(User user, Student student, College college) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("collegeId", user.getCollegeId() == null ? "" : user.getCollegeId().toString());
        claims.put("userId", user.getId().toString());
        String token = jwtService.generateToken(user.getEmail(), claims);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole().name());
        response.put("userId", user.getId());
        response.put("studentId", student == null ? null : student.getId());
        response.put("collegeId", user.getCollegeId());
        response.put("email", user.getEmail());
        response.put("username", user.getUsername());
        response.put("fullName", user.getFullName() == null ? "" : user.getFullName());
        if (student != null) response.put("student", studentPayload(student));
        if (college != null) response.put("college", collegePayload(college));
        return response;
    }

    private Map<String, Object> studentPayload(Student student) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", student.getId());
        data.put("userId", student.getUser() == null ? null : student.getUser().getId());
        data.put("fullName", student.getFullName());
        data.put("email", student.getEmail());
        data.put("mobile", student.getMobile());
        data.put("parentMobile", student.getParentMobile());
        data.put("district", student.getDistrict());
        data.put("city", student.getCity());
        data.put("address", student.getAddress());
        data.put("pincode", student.getPincode());
        data.put("state", student.getState());
        data.put("role", "STUDENT");
        data.put("profileCompletion", student.getProfileCompletion());
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

    private Map<String, Object> collegePayload(College college) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", college.getId());
        data.put("backendId", college.getId());
        data.put("slug", college.getSlug());
        data.put("name", college.getName());
        data.put("shortName", college.getShortName());
        data.put("tagline", college.getTagline());
        data.put("type", college.getType());
        data.put("collegeType", college.getCollegeType());
        data.put("district", college.getDistrict());
        data.put("city", college.getCity());
        data.put("address", college.getAddress());
        data.put("pincode", college.getPincode());
        data.put("phone", college.getPhone());
        data.put("email", college.getEmail());
        data.put("website", college.getWebsite());
        data.put("university", college.getUniversity());
        data.put("affiliation", college.getAffiliation());
        data.put("established", college.getEstablished());
        data.put("principalName", college.getPrincipalName());
        data.put("verificationStatus", college.getVerificationStatus().name());
        data.put("verified", college.isVerified());
        data.put("role", "COLLEGE_ADMIN");
        return data;
    }

    private User.Role parseRegistrationRole(String rawRole) {
        String role = clean(rawRole).toUpperCase(Locale.ROOT);
        if (role.equals("STUDENT")) return User.Role.STUDENT;
        if (role.equals("COLLEGE_ADMIN") || role.equals("COLLEGE")) return User.Role.COLLEGE_ADMIN;
        throw new IllegalArgumentException("Self-registration is limited to student and college accounts.");
    }

    private boolean roleMatches(String requested, User.Role actual) {
        String role = requested.toUpperCase(Locale.ROOT).replace('-', '_');
        return switch (role) {
            case "STUDENT" -> actual == User.Role.STUDENT;
            case "COLLEGE", "COLLEGE_ADMIN" -> actual == User.Role.COLLEGE_ADMIN || actual == User.Role.COLLEGE_EDITOR;
            case "ADMIN", "PLATFORM_ADMIN" -> actual == User.Role.PLATFORM_ADMIN || actual == User.Role.SUPER_ADMIN;
            default -> false;
        };
    }

    private StudentEducation.EducationLevel parseEducationLevel(String raw) {
        return switch (clean(raw).toUpperCase(Locale.ROOT)) {
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
        String value = clean(raw).toUpperCase(Locale.ROOT);
        if (value.contains("GOV")) return StudentPreferences.CollegeType.GOVERNMENT;
        if (value.contains("PRIVATE")) return StudentPreferences.CollegeType.PRIVATE;
        if (value.contains("AUTONOMOUS")) return StudentPreferences.CollegeType.AUTONOMOUS;
        return StudentPreferences.CollegeType.ANY;
    }

    private boolean isYes(String value) {
        return "YES".equalsIgnoreCase(clean(value)) || "TRUE".equalsIgnoreCase(clean(value));
    }

    private String slugify(String value) {
        String slug = value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        return slug.isBlank() ? "college" : slug;
    }

    private Integer parseInteger(String value) {
        try { return Integer.valueOf(value); } catch (Exception ex) { return null; }
    }

    private String value(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value == null ? "" : String.valueOf(value).trim();
    }

    private String firstNonBlank(String... values) {
        for (String value : values) if (value != null && !value.isBlank()) return value.trim();
        return "";
    }

    private String clean(String value) {
        return value == null ? "" : value.trim();
    }

    @Getter @Setter
    public static class RegisterRequest {
        private String email;
        private String username;
        private String password;
        private String fullName;
        private String phone;
        private String role;
        private Map<String, Object> studentProfile;
        private Map<String, Object> collegeProfile;
    }

    @Getter @Setter
    public static class LoginRequest {
        private String email;
        private String loginId;
        private String password;
        private String role;
    }
}
