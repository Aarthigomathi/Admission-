package com.tncolleges.platform.controller;

import com.tncolleges.platform.security.CollegeAccessService;
import com.tncolleges.platform.service.ResearchPageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class ResearchPageController {
    private final ResearchPageService researchPages;
    private final CollegeAccessService access;

    public ResearchPageController(ResearchPageService researchPages, CollegeAccessService access) {
        this.researchPages = researchPages;
        this.access = access;
    }

    @GetMapping("/api/colleges/{collegeId}/research-page")
    public ResponseEntity<?> getForAdmin(@PathVariable Long collegeId,
                                         @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        return ResponseEntity.ok(researchPages.getForAdmin(collegeId));
    }

    @PutMapping("/api/colleges/{collegeId}/research-page")
    public ResponseEntity<?> saveDraft(@PathVariable Long collegeId, @RequestBody Object page,
                                       @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        return ResponseEntity.ok(researchPages.saveDraft(collegeId, page));
    }

    @PatchMapping("/api/colleges/{collegeId}/research-page/publication")
    public ResponseEntity<?> setPublication(@PathVariable Long collegeId,
                                            @RequestBody Map<String, Object> request,
                                            @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        Object published = request.get("published");
        if (!(published instanceof Boolean value)) {
            return ResponseEntity.badRequest().body(Map.of("error", "published must be true or false"));
        }
        return ResponseEntity.ok(researchPages.setPublished(collegeId, value));
    }

    @GetMapping("/api/public/colleges/{slug}/research-page")
    public ResponseEntity<?> getPublic(@PathVariable String slug) {
        return ResponseEntity.ok(researchPages.getPublic(slug));
    }

    @GetMapping("/api/public/colleges/{slug}/research-page/tables/{tableKey}")
    public ResponseEntity<?> getTable(@PathVariable String slug, @PathVariable String tableKey,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(researchPages.getPublicTable(slug, tableKey, page, size));
    }

    private boolean canManage(UserDetails user, Long collegeId) {
        return user != null && access.canManageCollege(user.getUsername(), collegeId);
    }

    private ResponseEntity<Map<String, String>> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You cannot manage this college's research page"));
    }
}
