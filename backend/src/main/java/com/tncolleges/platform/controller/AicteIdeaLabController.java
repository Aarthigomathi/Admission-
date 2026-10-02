package com.tncolleges.platform.controller;

import com.tncolleges.platform.security.CollegeAccessService;
import com.tncolleges.platform.service.AicteIdeaLabService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AicteIdeaLabController {
    private final AicteIdeaLabService ideaLab;
    private final CollegeAccessService access;

    public AicteIdeaLabController(AicteIdeaLabService ideaLab, CollegeAccessService access) {
        this.ideaLab = ideaLab;
        this.access = access;
    }

    @GetMapping("/api/colleges/{collegeId}/idea-lab")
    public ResponseEntity<?> getForAdmin(@PathVariable Long collegeId,
                                         @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        return ResponseEntity.ok(ideaLab.getForAdmin(collegeId));
    }

    @PutMapping("/api/colleges/{collegeId}/idea-lab")
    public ResponseEntity<?> saveDraft(@PathVariable Long collegeId, @RequestBody Object page,
                                       @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        return ResponseEntity.ok(ideaLab.saveDraft(collegeId, page));
    }

    @PatchMapping("/api/colleges/{collegeId}/idea-lab/publication")
    public ResponseEntity<?> setPublication(@PathVariable Long collegeId,
                                            @RequestBody Map<String, Object> request,
                                            @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        Object published = request.get("published");
        if (!(published instanceof Boolean value)) {
            return ResponseEntity.badRequest().body(Map.of("error", "published must be true or false"));
        }
        return ResponseEntity.ok(ideaLab.setPublished(collegeId, value));
    }

    @GetMapping("/api/public/colleges/{slug}/idea-lab")
    public ResponseEntity<?> getPublic(@PathVariable String slug) {
        return ResponseEntity.ok(ideaLab.getPublic(slug));
    }

    private boolean canManage(UserDetails user, Long collegeId) {
        return user != null && access.canManageCollege(user.getUsername(), collegeId);
    }

    private ResponseEntity<Map<String, String>> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You cannot manage this college's AICTE IDEA Lab page"));
    }
}
