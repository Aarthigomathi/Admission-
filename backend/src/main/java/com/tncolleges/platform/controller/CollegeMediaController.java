package com.tncolleges.platform.controller;

import com.tncolleges.platform.dto.CollegeMediaResponse;
import com.tncolleges.platform.security.CollegeAccessService;
import com.tncolleges.platform.service.CollegeMediaService;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RestController
public class CollegeMediaController {
    private final CollegeMediaService media;
    private final CollegeAccessService access;

    public CollegeMediaController(CollegeMediaService media, CollegeAccessService access) {
        this.media = media;
        this.access = access;
    }

    @PostMapping(path = "/api/colleges/{collegeId}/media", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@PathVariable Long collegeId,
                                    @RequestPart("file") MultipartFile file,
                                    @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        CollegeMediaResponse uploaded = media.upload(collegeId, file, user.getUsername());
        return ResponseEntity.status(201).body(uploaded);
    }

    @GetMapping("/api/colleges/{collegeId}/media/manage")
    public ResponseEntity<?> list(@PathVariable Long collegeId,
                                  @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        List<CollegeMediaResponse> results = media.listForCollege(collegeId);
        return ResponseEntity.ok(results);
    }

    @DeleteMapping("/api/colleges/{collegeId}/media/{mediaId}")
    public ResponseEntity<?> delete(@PathVariable Long collegeId, @PathVariable Long mediaId,
                                    @AuthenticationPrincipal UserDetails user) {
        if (!canManage(user, collegeId)) return forbidden();
        media.delete(collegeId, mediaId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/media/{mediaId}")
    public ResponseEntity<?> serve(@PathVariable Long mediaId,
                                   @AuthenticationPrincipal UserDetails user) {
        Long collegeId = media.getCollegeId(mediaId);
        boolean managerAccess = user != null && access.canManageCollege(user.getUsername(), collegeId);
        CollegeMediaService.MediaFile image = media.open(mediaId, managerAccess);
        MediaType contentType = MediaType.parseMediaType(image.contentType());
        ContentDisposition disposition = ContentDisposition.inline()
                .filename(image.originalName(), StandardCharsets.UTF_8).build();
        CacheControl cacheControl = image.publicAsset()
                ? CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic()
                : CacheControl.noStore().cachePrivate();
        return ResponseEntity.ok()
                .contentType(contentType)
                .cacheControl(cacheControl)
                .header(HttpHeaders.CONTENT_DISPOSITION, disposition.toString())
                .body(image.resource());
    }

    private boolean canManage(UserDetails user, Long collegeId) {
        return user != null && access.canManageCollege(user.getUsername(), collegeId);
    }

    private ResponseEntity<Map<String, String>> forbidden() {
        return ResponseEntity.status(403).body(Map.of("error", "You cannot manage media for this college"));
    }
}
