package com.tncolleges.platform.controller;

import com.tncolleges.platform.security.CollegeAccessService;
import com.tncolleges.platform.service.CampusLifePageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class CampusLifePageController {
    private final CampusLifePageService campusLife;
    private final CollegeAccessService access;

    public CampusLifePageController(CampusLifePageService campusLife, CollegeAccessService access) {
        this.campusLife = campusLife;
        this.access = access;
    }

    @GetMapping("/api/colleges/{collegeId}/campus-life")
    public ResponseEntity<?> getForAdmin(@PathVariable Long collegeId, @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        return ResponseEntity.ok(campusLife.getForAdmin(collegeId));
    }

    @PutMapping("/api/colleges/{collegeId}/campus-life")
    public ResponseEntity<?> saveDraft(@PathVariable Long collegeId, @RequestBody Object page, @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        return ResponseEntity.ok(campusLife.saveDraft(collegeId, page));
    }

    @PatchMapping("/api/colleges/{collegeId}/campus-life/publication")
    public ResponseEntity<?> setPublication(@PathVariable Long collegeId, @RequestBody Map<String, Object> request,
                                            @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        Object published = request.get("published");
        if (!(published instanceof Boolean value)) return ResponseEntity.badRequest().body(Map.of("error", "published must be true or false"));
        return ResponseEntity.ok(campusLife.setPublished(collegeId, value));
    }

    @GetMapping("/api/public/colleges/{slug}/campus-life")
    public ResponseEntity<?> getPublic(@PathVariable String slug) {
        return ResponseEntity.ok(campusLife.getPublic(slug));
    }

    @GetMapping("/api/public/colleges/{slug}/campus-life/pages/{pageSlug}")
    public ResponseEntity<?> getPublicPage(@PathVariable String slug, @PathVariable String pageSlug) {
        return ResponseEntity.ok(campusLife.getPublicPage(slug, pageSlug));
    }

    private boolean canManage(UserDetails user, Long collegeId) {
        return user != null && access.canManageCollege(user.getUsername(), collegeId);
    }
    private ResponseEntity<Map<String, String>> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You cannot manage this college's Campus Life content"));
    }
}
