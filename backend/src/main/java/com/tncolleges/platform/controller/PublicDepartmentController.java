package com.tncolleges.platform.controller;

import com.tncolleges.platform.service.DepartmentPageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/** Public, verified-college department directory and published page API. */
@RestController
@RequestMapping("/api/public/colleges/{slug}/departments")
public class PublicDepartmentController {
    private final DepartmentPageService departmentPages;

    public PublicDepartmentController(DepartmentPageService departmentPages) {
        this.departmentPages = departmentPages;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> list(@PathVariable String slug) {
        return ResponseEntity.ok(departmentPages.publicDepartments(slug));
    }

    @GetMapping("/{departmentId}/page")
    public ResponseEntity<Map<String, Object>> page(@PathVariable String slug, @PathVariable String departmentId) {
        return ResponseEntity.ok(departmentPages.publicPage(slug, departmentId));
    }
}
