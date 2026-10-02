package com.tncolleges.platform.controller;

import com.tncolleges.platform.dto.AboutSectionResponse;
import com.tncolleges.platform.security.CollegeAccessService;
import com.tncolleges.platform.service.CollegeAboutSectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/colleges")
public class CollegeAboutSectionController {
    private final CollegeAboutSectionService aboutSections;
    private final CollegeAccessService access;

    public CollegeAboutSectionController(CollegeAboutSectionService aboutSections, CollegeAccessService access) {
        this.aboutSections = aboutSections;
        this.access = access;
    }

    /** Published About/Profile blocks for a public, verified college website. */
    @GetMapping("/{slug}/about-sections")
    public ResponseEntity<List<AboutSectionResponse>> publicSections(@PathVariable String slug) {
        return ResponseEntity.ok(aboutSections.listPublishedBySlug(slug));
    }

    /** Draft and published blocks visible only to admins who manage this college. */
    @GetMapping("/{collegeId}/about-sections/manage")
    public ResponseEntity<?> manageList(@PathVariable Long collegeId,
                                        @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        return ResponseEntity.ok(aboutSections.listForAdmin(collegeId));
    }

    @PostMapping("/{collegeId}/about-sections")
    public ResponseEntity<?> create(@PathVariable Long collegeId,
                                    @RequestBody Map<String, Object> request,
                                    @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        return ResponseEntity.status(HttpStatus.CREATED).body(aboutSections.create(collegeId, request));
    }

    @PutMapping("/{collegeId}/about-sections/{sectionId}")
    public ResponseEntity<?> update(@PathVariable Long collegeId, @PathVariable Long sectionId,
                                    @RequestBody Map<String, Object> updates,
                                    @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        return ResponseEntity.ok(aboutSections.update(collegeId, sectionId, updates));
    }

    @PatchMapping("/{collegeId}/about-sections/{sectionId}/publication")
    public ResponseEntity<?> setPublication(@PathVariable Long collegeId, @PathVariable Long sectionId,
                                            @RequestBody Map<String, Object> request,
                                            @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        Object published = request.get("published");
        if (!(published instanceof Boolean value)) {
            return ResponseEntity.badRequest().body(Map.of("error", "published must be true or false"));
        }
        return ResponseEntity.ok(aboutSections.setPublished(collegeId, sectionId, value));
    }

    @DeleteMapping("/{collegeId}/about-sections/{sectionId}")
    public ResponseEntity<?> delete(@PathVariable Long collegeId, @PathVariable Long sectionId,
                                    @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        aboutSections.delete(collegeId, sectionId);
        return ResponseEntity.noContent().build();
    }

    private boolean canManage(UserDetails user, Long collegeId) {
        return user != null && access.canManageCollege(user.getUsername(), collegeId);
    }

    private ResponseEntity<Map<String, String>> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You cannot manage this college's About sections"));
    }
}
