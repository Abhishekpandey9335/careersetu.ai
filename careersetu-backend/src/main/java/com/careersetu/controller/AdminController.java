package com.careersetu.controller;

import com.careersetu.entity.Subscription;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin-only dashboard and analytics")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final JobRepository jobRepository;
    private final StudyMaterialRepository studyMaterialRepository;
    private final SubscriptionRepository subscriptionRepository;

    @GetMapping("/stats")
    @Operation(summary = "Platform-wide stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "totalUsers",          userRepository.count(),
                "totalExams",          examRepository.count(),
                "totalJobs",           jobRepository.count(),
                "totalStudyMaterials", studyMaterialRepository.count(),
                "totalSubscriptions",  subscriptionRepository.count(),
                "activeSubscriptions", subscriptionRepository.countByStatus(Subscription.SubscriptionStatus.ACTIVE)
        )));
    }
}
