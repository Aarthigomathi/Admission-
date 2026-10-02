package com.tncolleges.platform.controller;

import com.tncolleges.platform.service.CollegeRecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {
    private final CollegeRecommendationService recommendationService;

    public RecommendationController(CollegeRecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    /** Preview uses only non-identifying marks and search preferences before signup. */
    @PostMapping("/preview")
    public ResponseEntity<?> preview(@RequestBody Map<String, Object> request) {
        return ResponseEntity.ok(recommendationService.preview(request));
    }
}
