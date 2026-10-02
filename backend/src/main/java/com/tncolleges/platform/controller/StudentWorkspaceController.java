package com.tncolleges.platform.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.StudentWorkspace;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.StudentWorkspaceRepository;
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
import java.util.Map;

@RestController
@RequestMapping("/api/students/me/workspace")
@PreAuthorize("hasRole('STUDENT')")
public class StudentWorkspaceController {
    private final StudentWorkspaceRepository workspaceRepo;
    private final UserRepository userRepo;
    private final ObjectMapper objectMapper;

    public StudentWorkspaceController(StudentWorkspaceRepository workspaceRepo, UserRepository userRepo, ObjectMapper objectMapper) {
        this.workspaceRepo = workspaceRepo;
        this.userRepo = userRepo;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public ResponseEntity<?> getWorkspace(@AuthenticationPrincipal UserDetails principal) {
        User user = userRepo.findByEmailIgnoreCase(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        StudentWorkspace workspace = workspaceRepo.findByUserId(user.getId()).orElse(null);
        if (workspace == null) return ResponseEntity.ok(Map.of("savedColleges", new Object[0], "comparedColleges", new Object[0]));
        Map<String, Object> result = new HashMap<>();
        result.put("savedColleges", parseArray(workspace.getSavedCollegesJson()));
        result.put("comparedColleges", parseArray(workspace.getComparedCollegesJson()));
        result.put("updatedAt", workspace.getUpdatedAt().toString());
        return ResponseEntity.ok(result);
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> saveWorkspace(@RequestBody Map<String, Object> payload,
                                           @AuthenticationPrincipal UserDetails principal) {
        User user = userRepo.findByEmailIgnoreCase(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Authentication required"));
        try {
            JsonNode saved = arrayOrEmpty(payload.get("savedColleges"));
            JsonNode compared = arrayOrEmpty(payload.get("comparedColleges"));
            StudentWorkspace workspace = workspaceRepo.findByUserId(user.getId())
                    .orElseGet(() -> StudentWorkspace.builder().userId(user.getId()).build());
            workspace.setSavedCollegesJson(objectMapper.writeValueAsString(saved));
            workspace.setComparedCollegesJson(objectMapper.writeValueAsString(compared));
            workspace.setUpdatedAt(LocalDateTime.now());
            workspaceRepo.save(workspace);
            return ResponseEntity.ok(Map.of("saved", true, "updatedAt", workspace.getUpdatedAt().toString()));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(Map.of("error", "savedColleges and comparedColleges must be JSON arrays"));
        }
    }

    private JsonNode arrayOrEmpty(Object value) {
        if (value == null) return objectMapper.createArrayNode();
        JsonNode node = objectMapper.valueToTree(value);
        if (!node.isArray()) throw new IllegalArgumentException("Expected a JSON array");
        return node;
    }

    private Object parseArray(String json) {
        try { return objectMapper.readTree(json); }
        catch (Exception ex) { return objectMapper.createArrayNode(); }
    }
}
