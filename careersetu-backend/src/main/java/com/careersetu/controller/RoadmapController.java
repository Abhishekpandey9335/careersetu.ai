package com.careersetu.controller;

import com.careersetu.dto.roadmap.RoadmapDto;
import com.careersetu.exception.ApiResponse;
import com.careersetu.service.RoadmapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roadmaps")
@RequiredArgsConstructor
@Tag(name = "Roadmaps", description = "Pre-built and AI-generated career roadmaps")
public class RoadmapController {

    private final RoadmapService roadmapService;

    @GetMapping
    @Operation(summary = "Get popular roadmaps")
    public ResponseEntity<ApiResponse<List<RoadmapDto>>> getPopular() {
        return ResponseEntity.ok(ApiResponse.success(roadmapService.getPopular()));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get roadmap by slug")
    public ResponseEntity<ApiResponse<RoadmapDto>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(roadmapService.getBySlug(slug)));
    }
}
