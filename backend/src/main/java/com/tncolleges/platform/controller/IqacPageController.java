package com.tncolleges.platform.controller;

import com.tncolleges.platform.security.CollegeAccessService;
import com.tncolleges.platform.service.IqacPageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class IqacPageController {
    private final IqacPageService iqacPages;
    private final CollegeAccessService access;

    public IqacPageController(IqacPageService iqacPages, CollegeAccessService access) {
        this.iqacPages = iqacPages;
        this.access = access;
    }

    @GetMapping("/api/colleges/{collegeId}/iqac-page")
    public ResponseEntity<?> getForAdmin(@PathVariable Long collegeId, @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        return ResponseEntity.ok(iqacPages.getForAdmin(collegeId));
    }

    @PutMapping("/api/colleges/{collegeId}/iqac-page")
    public ResponseEntity<?> saveDraft(@PathVariable Long collegeId, @RequestBody Object page, @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        return ResponseEntity.ok(iqacPages.saveDraft(collegeId, page));
    }

    @PatchMapping("/api/colleges/{collegeId}/iqac-page/publication")
    public ResponseEntity<?> setPublication(@PathVariable Long collegeId, @RequestBody Map<String, Object> request,
                                            @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        Object published = request.get("published");
        if (!(published instanceof Boolean value)) return ResponseEntity.badRequest().body(Map.of("error", "published must be true or false"));
        return ResponseEntity.ok(iqacPages.setPublished(collegeId, value));
    }

    @GetMapping("/api/public/colleges/{slug}/iqac-page")
    public ResponseEntity<?> getPublic(@PathVariable String slug) {
        return ResponseEntity.ok(iqacPages.getPublic(slug));
    }

    @GetMapping("/api/public/colleges/{slug}/iqac-page/members")
    public ResponseEntity<?> getMembers(@PathVariable String slug, @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(iqacPages.getPublicMembers(slug, page, size));
    }

    private boolean canManage(UserDetails user, Long collegeId) {
        return user != null && access.canManageCollege(user.getUsername(), collegeId);
    }
    private ResponseEntity<Map<String, String>> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "You cannot manage this college's IQAC page"));
    }
}
