package com.careersetu.controller;

import com.careersetu.dto.HomepageDto;
import com.careersetu.exception.ApiResponse;
import com.careersetu.service.HomepageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
@Tag(name = "Homepage", description = "Aggregated data for the homepage")
public class HomepageController {

    private final HomepageService homepageService;

    @GetMapping
    @Operation(summary = "Get all homepage data in a single call")
    public ResponseEntity<ApiResponse<HomepageDto>> getHomepage() {
        return ResponseEntity.ok(ApiResponse.success(homepageService.getHomepageData()));
    }
}
