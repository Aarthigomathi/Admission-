package com.tncolleges.platform.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.dto.CollegeResponse;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.model.Verification;
import com.tncolleges.platform.model.Notification;
import com.tncolleges.platform.repository.CollegeRepository;
import com.tncolleges.platform.repository.UserRepository;
import com.tncolleges.platform.repository.VerificationRepository;
import com.tncolleges.platform.repository.NotificationRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class CollegeService {
    private static final Pattern NON_SLUG = Pattern.compile("[^a-z0-9]+", Pattern.CASE_INSENSITIVE);
    private static final Pattern EMAIL = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private final CollegeRepository colleges;
    private final UserRepository users;
    private final VerificationRepository verifications;
    private final NotificationRepository notifications;
    private final CollegeContentService content;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper mapper;

    public CollegeService(CollegeRepository colleges, UserRepository users, VerificationRepository verifications,
                          NotificationRepository notifications, CollegeContentService content,
                          PasswordEncoder passwordEncoder, ObjectMapper mapper) {
        this.colleges = colleges;
        this.users = users;
        this.verifications = verifications;
        this.notifications = notifications;
        this.content = content;
        this.passwordEncoder = passwordEncoder;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> publicColleges(String district, String type, String search) {
        List<College> records;
        if (search != null && !search.isBlank()) records = colleges.searchByName(search.trim());
        else records = colleges.findAllByRegisteredTrueAndActiveTrueAndVerifiedTrueOrderByNameAsc();
        if (district != null && !district.isBlank() && !district.equalsIgnoreCase("All")) {
            records = records.stream().filter(c -> district.equalsIgnoreCase(c.getDistrict())).toList();
        }
        if (type != null && !type.isBlank() && !type.equalsIgnoreCase("All")) {
            records = records.stream().filter(c -> c.getType() != null && c.getType().toLowerCase(Locale.ROOT).contains(type.toLowerCase(Locale.ROOT))).toList();
        }
        return records.stream().map(c -> enriched(c, false)).toList();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> allForPlatformAdmin() {
        return colleges.findAllByRegisteredTrueOrderByCreatedAtDesc().stream().map(c -> enriched(c, true)).toList();
    }

    @Transactional(readOnly = true)
    public Optional<Map<String, Object>> publicBySlug(String slug) {
        return colleges.findBySlug(slug).filter(c -> c.isRegistered() && c.isActive() && c.isVerified()).map(c -> enriched(c, false));
    }

    @Transactional(readOnly = true)
    public Optional<Map<String, Object>> byId(Long id, boolean includeUnverified) {
        return colleges.findById(id)
                .filter(c -> c.isRegistered() && (includeUnverified || (c.isActive() && c.isVerified())))
                .map(c -> enriched(c, includeUnverified));
    }

    @Transactional
    public Map<String, Object> signup(Map<String, Object> request) {
        String name = requiredText(request, "name", "College name");
        String officialEmail = firstText(request, "email", "officialEmail", "collegeEmail", "adminEmail", "loginEmail");
        String username = firstText(request, "loginUsername", "adminUsername", "username", "email", "officialEmail", "collegeEmail", "adminEmail");
        String password = firstText(request, "loginPassword", "adminPassword", "password");
        if (officialEmail == null || !EMAIL.matcher(officialEmail.trim()).matches()) throw new IllegalArgumentException("A valid college email is required");
        if (username == null || username.isBlank()) throw new IllegalArgumentException("A login username is required");
        if (password == null || password.length() < 8) throw new IllegalArgumentException("Login password must contain at least 8 characters");
        officialEmail = officialEmail.trim().toLowerCase(Locale.ROOT);
        username = username.trim();
        if (users.existsByEmailIgnoreCase(officialEmail) || users.existsByUsernameIgnoreCase(username)
                || colleges.existsByEmailIgnoreCase(officialEmail) || colleges.existsByLoginUsernameIgnoreCase(username)) {
            throw new IllegalArgumentException("Email or login username is already registered");
        }

        College college = College.builder()
                .slug("new-college-" + UUID.randomUUID())
                .name(name)
                .shortName(text(request, "shortName"))
                .tagline(text(request, "tagline"))
                .email(officialEmail)
                .loginUsername(username)
                .phone(text(request, "phone"))
                .website(text(request, "website"))
                .address(text(request, "address"))
                .district(text(request, "district"))
                .city(text(request, "city"))
                .pincode(text(request, "pincode"))
                .type(text(request, "type"))
                .collegeType(text(request, "collegeType"))
                .affiliation(text(request, "affiliation"))
                .university(text(request, "university"))
                .established(integer(request.get("established")))
                .principalName(text(request, "principalName"))
                .verificationStatus(College.VerificationStatus.PENDING)
                .verified(false)
                .active(true)
                .registered(true)
                .build();
        college = colleges.saveAndFlush(college);
        college.setSlug(uniqueSlug(name, college.getId()));
        college = colleges.save(college);
        verifications.save(Verification.builder()
                .collegeId(college.getId())
                .status(Verification.VerificationStatus.PENDING)
                .createdAt(java.time.LocalDateTime.now())
                .build());

        User admin = User.builder()
                .email(officialEmail)
                .username(username)
                .password(passwordEncoder.encode(password))
                .fullName(firstText(request, "adminName", "fullName", "principalName") == null ? name + " Admin" : firstText(request, "adminName", "fullName", "principalName"))
                .phone(text(request, "phone"))
                .role(User.Role.COLLEGE_ADMIN)
                .collegeId(college.getId())
                .enabled(true)
                .build();
        users.save(admin);
        for (User platformAdmin : users.findAllByRoleIn(List.of(User.Role.PLATFORM_ADMIN, User.Role.SUPER_ADMIN))) {
            notifications.save(Notification.builder()
                    .userId(platformAdmin.getId())
                    .title("New college registration")
                    .message(name + " registered and is pending verification.")
                    .type("VERIFICATION")
                    .collegeId(college.getId())
                    .build());
        }

        Map<String, Object> supplied = new LinkedHashMap<>(request);
        if (request.get("customData") instanceof Map<?, ?> raw) {
            Map<String, Object> nested = mapper.convertValue(raw, new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {});
            supplied.putAll(nested);
        }
        content.initializeCollege(college.getId(), supplied);
        return enriched(college, true);
    }

    @Transactional
    public Map<String, Object> verify(Long collegeId, String requestedStatus, String remarks) {
        return verify(collegeId, requestedStatus, remarks, null);
    }

    @Transactional
    public Map<String, Object> verify(Long collegeId, String requestedStatus, String remarks, Long verifiedBy) {
        College college = colleges.findById(collegeId).filter(College::isRegistered)
                .orElseThrow(() -> new NoSuchElementException("Registered college not found"));
        College.VerificationStatus status;
        try { status = College.VerificationStatus.valueOf(requestedStatus == null ? "VERIFIED" : requestedStatus.trim().toUpperCase(Locale.ROOT)); }
        catch (IllegalArgumentException exception) { throw new IllegalArgumentException("Invalid verification status"); }
        College.VerificationStatus previousStatus = college.getVerificationStatus();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        college.setVerificationStatus(status);
        college.setVerified(status == College.VerificationStatus.VERIFIED);
        college.setUpdatedAt(now);
        colleges.save(college);
        Verification verification = verifications.findByCollegeId(collegeId)
                .orElseGet(() -> Verification.builder().collegeId(collegeId).createdAt(now).build());
        verification.setStatus(Verification.VerificationStatus.valueOf(status.name()));
        verification.setRemarks(remarks);
        verification.setVerifiedBy(verifiedBy);
        verification.setVerifiedAt(status == College.VerificationStatus.VERIFIED ? now : null);
        verification.setUpdatedAt(now);
        verifications.save(verification);
        if (previousStatus != status) {
            String statusMessage = "College verification status changed to " + status.name().replace('_', ' ').toLowerCase(Locale.ROOT) + ".";
            for (User collegeAdmin : users.findAllByCollegeIdAndRoleIn(collegeId, List.of(User.Role.COLLEGE_ADMIN, User.Role.COLLEGE_EDITOR))) {
                notifications.save(Notification.builder()
                        .userId(collegeAdmin.getId())
                        .title("College verification update")
                        .message(statusMessage)
                        .type("VERIFICATION")
                        .collegeId(collegeId)
                        .build());
            }
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("message", "College verification status updated");
        result.put("college_id", collegeId);
        result.put("verification_status", status.name());
        result.put("verified", college.isVerified());
        result.put("remarks", remarks == null ? "" : remarks);
        return result;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> enriched(College college, boolean includePrivateFields) {
        Map<String, Object> base = mapper.convertValue(CollegeResponse.from(college), new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {});
        Map<String, Object> result = new LinkedHashMap<>(base);
        Map<String, Object> custom = new LinkedHashMap<>(content.getAll(college.getId()));
        if (!includePrivateFields && custom.get("courses") instanceof List<?> courses) {
            custom.put("courses", courses.stream().filter(item -> {
                if (item instanceof Map<?, ?> map) return !Boolean.FALSE.equals(map.get("active"));
                return true;
            }).toList());
        }
        result.put("branding", custom.get("branding"));
        result.put("about", custom.get("about"));
        for (Map.Entry<String, Object> entry : custom.entrySet()) result.put(entry.getKey(), entry.getValue());
        result.put("customData", custom);
        if (includePrivateFields) {
            result.put("loginUsername", college.getLoginUsername());
            result.put("role", User.Role.COLLEGE_ADMIN.name());
        } else {
            result.remove("loginUsername");
        }
        // Passwords are never sent back, even in signup/admin response objects.
        result.remove("loginPassword");
        return result;
    }

    private String uniqueSlug(String name, Long id) {
        String base = NON_SLUG.matcher(name.trim().toLowerCase(Locale.ROOT)).replaceAll("-").replaceAll("^-|-$", "");
        if (base.isBlank()) base = "college";
        String suffix = String.valueOf(id);
        if (suffix.length() > 4) suffix = suffix.substring(suffix.length() - 4);
        String slug = base + "-" + suffix;
        int attempt = 1;
        while (colleges.existsBySlugIgnoreCase(slug)) slug = base + "-" + suffix + "-" + attempt++;
        return slug;
    }

    private String requiredText(Map<String, Object> map, String key, String label) {
        String value = text(map, key);
        if (value == null || value.isBlank()) throw new IllegalArgumentException(label + " is required");
        return value.trim();
    }

    private String firstText(Map<String, Object> map, String... keys) {
        for (String key : keys) {
            String value = text(map, key);
            if (value != null && !value.isBlank()) return value;
        }
        return null;
    }

    private String text(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value == null ? null : String.valueOf(value).trim();
    }

    private Integer integer(Object value) {
        if (value == null || String.valueOf(value).isBlank()) return null;
        try { return Integer.valueOf(String.valueOf(value)); }
        catch (NumberFormatException exception) { throw new IllegalArgumentException("Established year must be a number"); }
    }
}
