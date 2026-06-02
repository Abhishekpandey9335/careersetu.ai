package com.careersetu.controller;

import com.careersetu.dto.company.CompanyDetailDto;
import com.careersetu.dto.company.CompanySummaryDto;
import com.careersetu.dto.company.CreateCompanyRequest;
import com.careersetu.exception.ApiResponse;
import com.careersetu.security.JwtUtil;
import com.careersetu.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
@Tag(name = "Companies", description = "Company explorer with prep info and readiness score")
public class CompanyController {

    private final CompanyService companyService;
    private final JwtUtil jwtUtil;

    @GetMapping
    @Operation(summary = "Search companies")
    public ResponseEntity<ApiResponse<Page<CompanySummaryDto>>> searchCompanies(
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                companyService.searchCompanies(industry, search, page, size)));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get company details with optional readiness score")
    public ResponseEntity<ApiResponse<CompanyDetailDto>> getCompany(
            @PathVariable String slug,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = extractUserId(authHeader);
        return ResponseEntity.ok(ApiResponse.success(companyService.getBySlug(slug, userId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a company (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<CompanyDetailDto>> createCompany(
            @Valid @RequestBody CreateCompanyRequest request) {
        return ResponseEntity.status(201).body(
                ApiResponse.success("Company created", companyService.createCompany(request)));
    }

    private Long extractUserId(String authHeader) {
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.isTokenValid(token)) {
                return jwtUtil.extractUserId(token);
            }
        }
        return null;
    }
}
