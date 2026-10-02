package com.tncolleges.platform.service;

import com.tncolleges.platform.model.Student;
import com.tncolleges.platform.model.StudentEducation;
import com.tncolleges.platform.model.StudentPreferences;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.StudentEducationRepository;
import com.tncolleges.platform.repository.StudentPreferencesRepository;
import com.tncolleges.platform.repository.StudentRepository;
import com.tncolleges.platform.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Matches a student's marks, requested course, college type, and location with published programmes. */
@Service
public class CollegeRecommendationService {
    private static final Pattern FRACTION_MARKS = Pattern.compile("^\\s*(\\d+(?:\\.\\d+)?)\\s*(?:/|\\bof\\b|\\bout\\s+of\\b)\\s*(\\d+(?:\\.\\d+)?)\\s*$", Pattern.CASE_INSENSITIVE);
    private static final Pattern PERCENTAGE = Pattern.compile("(?<![\\d.])(\\d{1,3}(?:\\.\\d+)?)\\s*%", Pattern.CASE_INSENSITIVE);
    private static final Pattern NAMED_MINIMUM = Pattern.compile("(?:minimum|min|cutoff)(?:\\s+aggregate)?\\s*(?:marks?)?\\s*[:=]?\\s*(\\d{1,3}(?:\\.\\d+)?)", Pattern.CASE_INSENSITIVE);
    private static final Set<String> IGNORED_COURSE_WORDS = Set.of("in", "and", "the", "course", "degree", "engineering", "college");
    private static final Map<String, String> COURSE_ALIASES = Map.of(
            "cse", "computer science engineering",
            "cs", "computer science",
            "it", "information technology",
            "ece", "electronics communication",
            "eee", "electrical electronics",
            "mech", "mechanical");

    private final UserRepository users;
    private final StudentRepository students;
    private final StudentEducationRepository education;
    private final StudentPreferencesRepository preferences;
    private final CollegeService collegeService;

    public CollegeRecommendationService(UserRepository users, StudentRepository students,
                                        StudentEducationRepository education,
                                        StudentPreferencesRepository preferences,
                                        CollegeService collegeService) {
        this.users = users;
        this.students = students;
        this.education = education;
        this.preferences = preferences;
        this.collegeService = collegeService;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> recommend(String email, String requestedCourse, String requestedDistrict, String requestedType) {
        User user = users.findByEmail(email).filter(account -> account.getRole() == User.Role.STUDENT)
                .orElseThrow(() -> new IllegalArgumentException("Student account required"));
        Student student = students.findByUser_Id(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Complete your student profile before requesting recommendations"));
        List<StudentEducation> records = education.findByStudent_IdOrderByCreatedAtDesc(student.getId());
        StudentEducation marksRecord = selectMarksRecord(records);
        Double studentPercentage = marksRecord == null ? null : percentage(marksRecord.getPercentage(), marksRecord.getMarks());
        StudentPreferences saved = preferences.findByStudent_Id(student.getId()).orElse(null);

        String course = firstNonBlank(requestedCourse, saved == null ? null : saved.getInterestedCourse());
        String district = firstNonBlank(requestedDistrict,
                saved == null ? null : saved.getPreferredDistrict(), student.getDistrict());
        String type = firstNonBlank(requestedType, saved == null || saved.getCollegeType() == null
                ? null : saved.getCollegeType().name());
        return buildRecommendations(studentPercentage, marksRecord == null ? null : marksRecord.getLevel().name(),
                course, district, type, saved != null && Boolean.TRUE.equals(saved.getHostelRequired()),
                saved != null && Boolean.TRUE.equals(saved.getTransportRequired()));
    }

    /** Public, non-identifying preview used before a student creates an account. */
    @Transactional(readOnly = true)
    public Map<String, Object> preview(Map<String, Object> request) {
        Double studentPercentage = percentage(text(request.get("percentage")), text(request.get("marks")));
        return buildRecommendations(studentPercentage, text(request.get("educationLevel")),
                text(request.get("course")), text(request.get("district")), text(request.get("type")),
                Boolean.parseBoolean(String.valueOf(request.getOrDefault("hostelRequired", false))),
                Boolean.parseBoolean(String.valueOf(request.getOrDefault("transportRequired", false))));
    }

    private Map<String, Object> buildRecommendations(Double studentPercentage, String educationLevel,
                                                       String course, String district, String type,
                                                       boolean hostelRequired, boolean transportRequired) {
        if (district != null && (district.isBlank() || district.equalsIgnoreCase("ANY")
                || district.equalsIgnoreCase("ALL") || district.equalsIgnoreCase("ANY DISTRICT"))) district = null;
        if (type != null && (type.isBlank() || type.equalsIgnoreCase("ANY") || type.equalsIgnoreCase("ALL"))) type = null;
        List<Map<String, Object>> recommendations = new ArrayList<>();
        int belowCutoff = 0;
        for (Map<String, Object> college : collegeService.publicColleges(null, null, null)) {
            if (!matches(district, college.get("district")) || !matchesCollegeType(type, college)) continue;
            Object rawCourses = college.get("courses");
            if (!(rawCourses instanceof Collection<?> courseItems)) continue;
            List<Map<String, Object>> matchingCourses = new ArrayList<>();
            List<String> matchingCourseStatuses = new ArrayList<>();
            int bestScore = 0;
            for (Object rawCourse : courseItems) {
                if (!(rawCourse instanceof Map<?, ?> rawMap)) continue;
                Map<String, Object> programme = toStringMap(rawMap);
                if (Boolean.FALSE.equals(programme.get("active")) || !matchesCourse(course, programme)) continue;
                Double minimum = minimumPercentage(programme);
                String status;
                if (studentPercentage == null) {
                    status = "MARKS_REQUIRED";
                } else if (minimum == null) {
                    status = "CHECK_WITH_COLLEGE";
                } else if (studentPercentage + 0.0001 < minimum) {
                    belowCutoff++;
                    continue;
                } else {
                    status = "ELIGIBLE";
                }
                int score = (course == null ? 20 : 45)
                        + (district == null ? 0 : 25)
                        + ("ELIGIBLE".equals(status) ? 30 : "CHECK_WITH_COLLEGE".equals(status) ? 10 : 0);
                bestScore = Math.max(bestScore, score);
                programme.put("minimumPercentage", minimum);
                programme.put("studentPercentage", studentPercentage);
                programme.put("eligibilityStatus", status);
                matchingCourseStatuses.add(status);
                matchingCourses.add(programme);
            }
            if (matchingCourses.isEmpty()) continue;

            Map<String, Object> recommendation = new LinkedHashMap<>();
            recommendation.put("college", college);
            recommendation.put("matchingCourses", matchingCourses);
            recommendation.put("eligibilityStatus", overallStatus(matchingCourseStatuses));
            recommendation.put("matchScore", bestScore);
            List<String> reasons = new ArrayList<>();
            if (course != null) reasons.add("Matches your interested course: " + course);
            if (district != null) reasons.add("Located in your preferred district: " + district);
            if (studentPercentage != null && educationLevel != null) reasons.add("Matched using your " + educationLevel + " percentage");
            if (hostelRequired) reasons.add("Hostel preference saved; confirm availability with the college");
            if (transportRequired) reasons.add("Transport preference saved; confirm availability with the college");
            recommendation.put("matchReasons", reasons);
            recommendations.add(recommendation);
        }

        recommendations.sort(Comparator
                .comparingInt((Map<String, Object> item) -> ((Number) item.get("matchScore")).intValue()).reversed()
                .thenComparing(item -> String.valueOf(((Map<?, ?>) item.get("college")).get("name")), String.CASE_INSENSITIVE_ORDER));
        Map<String, Object> criteria = new LinkedHashMap<>();
        criteria.put("course", course == null ? "" : course);
        criteria.put("preferredDistrict", district == null ? "" : district);
        criteria.put("collegeType", type == null ? "ANY" : type);
        criteria.put("educationLevel", educationLevel == null ? "" : educationLevel);
        criteria.put("percentage", studentPercentage == null ? "" : studentPercentage);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("criteria", criteria);
        result.put("recommendations", recommendations);
        result.put("totalRecommendations", recommendations.size());
        result.put("excludedBelowMinimum", belowCutoff);
        result.put("notice", studentPercentage == null
                ? "Add your percentage or marks to get eligibility-based recommendations."
                : "Eligibility is estimated from the minimum percentage published for each programme; confirm final admission rules with the college.");
        return result;
    }

    private StudentEducation selectMarksRecord(List<StudentEducation> records) {
        return records.stream()
                .filter(record -> record.getLevel() == StudentEducation.EducationLevel.TWELFTH
                        || record.getLevel() == StudentEducation.EducationLevel.DIPLOMA)
                .findFirst()
                .orElseGet(() -> records.stream().findFirst().orElse(null));
    }

    private Double percentage(String percentage, String marks) {
        Double parsed = parseNumber(percentage);
        if (parsed != null && parsed >= 0 && parsed <= 100) return parsed;
        if (marks == null || marks.isBlank()) return null;
        Matcher fraction = FRACTION_MARKS.matcher(marks.trim());
        if (fraction.matches()) {
            double scored = Double.parseDouble(fraction.group(1));
            double total = Double.parseDouble(fraction.group(2));
            if (total <= 0 || scored < 0 || scored > total) return null;
            return scored * 100.0 / total;
        }
        parsed = parseNumber(marks);
        return parsed != null && parsed >= 0 && parsed <= 100 ? parsed : null;
    }

    private Double minimumPercentage(Map<String, Object> course) {
        for (String key : List.of("minimumPercentage", "minimum_percentage", "cutoffPercentage", "cutoff_percentage", "minPercentage")) {
            if (course.containsKey(key)) {
                Double value = parseNumber(course.get(key));
                if (value != null && value >= 0 && value <= 100) return value;
            }
        }
        Object eligibility = course.get("eligibility");
        if (eligibility == null) return null;
        String text = String.valueOf(eligibility);
        Matcher percentage = PERCENTAGE.matcher(text);
        if (percentage.find()) return parseNumber(percentage.group(1));
        Matcher named = NAMED_MINIMUM.matcher(text);
        return named.find() ? parseNumber(named.group(1)) : null;
    }

    private Double parseNumber(Object value) {
        if (value == null) return null;
        String valueText = String.valueOf(value).trim().replace("%", "");
        if (valueText.isBlank()) return null;
        try { return Double.parseDouble(valueText); }
        catch (NumberFormatException ignored) { return null; }
    }

    private boolean matchesCourse(String requested, Map<String, Object> course) {
        if (requested == null || requested.isBlank()) return true;
        String query = normalizeCourse(requested);
        String name = normalizeCourse(String.valueOf(course.getOrDefault("name", "")) + " "
                + String.valueOf(course.getOrDefault("degreeType", course.getOrDefault("degree", ""))) + " "
                + String.valueOf(course.getOrDefault("level", "")));
        if (query.isBlank() || name.isBlank()) return false;
        if (name.contains(query) || query.contains(name)) return true;
        Set<String> queryWords = words(query);
        Set<String> nameWords = words(name);
        if (queryWords.isEmpty()) return false;
        long overlap = queryWords.stream().filter(nameWords::contains).count();
        return overlap >= Math.max(1, (long) Math.ceil(queryWords.size() * 0.5));
    }

    private String normalizeCourse(String value) {
        String normalized = value == null ? "" : value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", " ").trim();
        StringJoiner expanded = new StringJoiner(" ");
        for (String token : normalized.split("\\s+")) expanded.add(COURSE_ALIASES.getOrDefault(token, token));
        return expanded.toString();
    }

    private Set<String> words(String value) {
        Set<String> result = new HashSet<>();
        for (String word : value.split("\\s+")) {
            if (word.length() > 1 && !IGNORED_COURSE_WORDS.contains(word)) result.add(word);
        }
        return result;
    }

    private boolean matches(String requested, Object actual) {
        if (requested == null || requested.isBlank() || requested.equalsIgnoreCase("ANY")
                || requested.equalsIgnoreCase("ALL") || requested.equalsIgnoreCase("ANY DISTRICT")) return true;
        if (actual == null) return false;
        return requested.trim().equalsIgnoreCase(String.valueOf(actual).trim());
    }

    private boolean matchesCollegeType(String requested, Map<String, Object> college) {
        if (requested == null || requested.isBlank() || requested.equalsIgnoreCase("ANY") || requested.equalsIgnoreCase("ALL")) return true;
        String value = String.valueOf(college.getOrDefault("collegeType", "")) + " " + String.valueOf(college.getOrDefault("type", ""));
        String expected = requested.toLowerCase(Locale.ROOT).replace('_', ' ');
        if (expected.equals("govt")) expected = "government";
        return value.toLowerCase(Locale.ROOT).contains(expected);
    }

    private String overallStatus(List<String> statuses) {
        if (statuses.contains("ELIGIBLE")) return "ELIGIBLE";
        if (statuses.contains("CHECK_WITH_COLLEGE")) return "CHECK_WITH_COLLEGE";
        return "MARKS_REQUIRED";
    }

    private Map<String, Object> toStringMap(Map<?, ?> source) {
        Map<String, Object> result = new LinkedHashMap<>();
        source.forEach((key, value) -> result.put(String.valueOf(key), value));
        return result;
    }

    private String firstNonBlank(String... values) {
        for (String value : values) if (value != null && !value.isBlank()) return value.trim();
        return null;
    }

    private String text(Object value) { return value == null ? null : String.valueOf(value).trim(); }
}
