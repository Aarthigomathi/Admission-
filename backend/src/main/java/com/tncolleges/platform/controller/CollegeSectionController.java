package com.tncolleges.platform.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.CollegeSectionData;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.CollegeSectionDataRepository;
import com.tncolleges.platform.repository.CollegeRepository;
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
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/admin/college/{collegeId}/sections")
public class CollegeSectionController {
    private static final Pattern VALID_SECTION = Pattern.compile("[A-Za-z0-9_-]{1,80}");

    private final CollegeSectionDataRepository sectionRepo;
    private final CollegeRepository collegeRepo;
    private final UserRepository userRepo;
    private final ObjectMapper objectMapper;

    public CollegeSectionController(CollegeSectionDataRepository sectionRepo, CollegeRepository collegeRepo,
                                    UserRepository userRepo, ObjectMapper objectMapper) {
        this.sectionRepo = sectionRepo;
        this.collegeRepo = collegeRepo;
        this.userRepo = userRepo;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN','COLLEGE_EDITOR','PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> getSections(@PathVariable Long collegeId, @AuthenticationPrincipal UserDetails principal) {
        ResponseEntity<?> denied = authorizeCollege(collegeId, principal);
        if (denied != null) return denied;
        if (!collegeRepo.existsById(collegeId)) return ResponseEntity.notFound().build();
        Map<String, Object> result = new HashMap<>();
        for (CollegeSectionData section : sectionRepo.findAllByCollegeId(collegeId)) {
            try {
                result.put(section.getSectionKey(), objectMapper.readValue(section.getContent(), new TypeReference<Object>() {}));
            } catch (Exception ex) {
                result.put(section.getSectionKey(), section.getContent());
            }
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{sectionKey}")
    @Transactional
    @PreAuthorize("hasAnyRole('COLLEGE_ADMIN','COLLEGE_EDITOR','PLATFORM_ADMIN','SUPER_ADMIN')")
    public ResponseEntity<?> saveSection(@PathVariable Long collegeId, @PathVariable String sectionKey,
                                         @RequestBody SectionPayload payload,
                                         @AuthenticationPrincipal UserDetails principal) {
        ResponseEntity<?> denied = authorizeCollege(collegeId, principal);
        if (denied != null) return denied;
        if (!VALID_SECTION.matcher(sectionKey).matches()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid section key"));
        }
        if (!collegeRepo.existsById(collegeId)) return ResponseEntity.notFound().build();
        try {
            String content = objectMapper.writeValueAsString(payload.getContent());
            CollegeSectionData section = sectionRepo.findByCollegeIdAndSectionKey(collegeId, sectionKey)
                    .orElseGet(() -> CollegeSectionData.builder().collegeId(collegeId).sectionKey(sectionKey).build());
            section.setContent(content);
            section.setUpdatedAt(LocalDateTime.now());
            CollegeSectionData saved = sectionRepo.save(section);
            return ResponseEntity.ok(Map.of("collegeId", collegeId, "section", sectionKey, "updatedAt", saved.getUpdatedAt().toString()));
        } catch (JsonProcessingException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "Section data must be valid JSON"));
        }
    }

    private ResponseEntity<?> authorizeCollege(Long collegeId, UserDetails principal) {
        User user = userRepo.findByEmailIgnoreCase(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        boolean platformAdmin = user.getRole() == User.Role.PLATFORM_ADMIN || user.getRole() == User.Role.SUPER_ADMIN;
        if (!platformAdmin && !collegeId.equals(user.getCollegeId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You can only manage your own college"));
        }
        return null;
    }

    public static class SectionPayload {
        private Object content;
        public Object getContent() { return content; }
        public void setContent(Object content) { this.content = content; }
    }
}
