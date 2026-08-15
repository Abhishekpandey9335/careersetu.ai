package com.careersetu.controller;

import com.careersetu.entity.Subscription;
import com.careersetu.entity.User;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.*;
import com.careersetu.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin-only dashboard and analytics")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final StudyMaterialRepository studyMaterialRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionService subscriptionService;

    @GetMapping("/stats")
    @Operation(summary = "Platform-wide stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers",           userRepository.count());
        stats.put("totalJobs",            jobRepository.count());
        stats.put("totalStudyMaterials",  studyMaterialRepository.count());
        stats.put("totalSubscriptions",   subscriptionRepository.count());
        stats.put("activeSubscriptions",  subscriptionRepository.countByStatus(Subscription.SubscriptionStatus.ACTIVE));
        stats.put("pendingSubscriptions", subscriptionRepository.countByStatus(Subscription.SubscriptionStatus.PENDING));
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = users.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("name", u.getName());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            map.put("isPremium", u.isPremium());
            map.put("phone", u.getPhone());
            map.put("createdAt", u.getCreatedAt());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @GetMapping("/subscriptions")
    @Operation(summary = "Get all subscriptions")
    public ResponseEntity<ApiResponse<List<Subscription>>> getAllSubscriptions(
            @RequestParam(required = false) String status) {
        List<Subscription> subs;
        if (status != null) {
            subs = subscriptionRepository.findByStatus(
                    Subscription.SubscriptionStatus.valueOf(status.toUpperCase()));
        } else {
            subs = subscriptionRepository.findAllByOrderByCreatedAtDesc();
        }
        return ResponseEntity.ok(ApiResponse.success(subs));
    }

    @PutMapping("/subscriptions/{id}/approve")
    @Operation(summary = "Approve a subscription")
    public ResponseEntity<ApiResponse<Map<String, Object>>> approveSubscription(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.approveSubscription(id)));
    }

    @PutMapping("/subscriptions/{id}/reject")
    @Operation(summary = "Reject a subscription")
    public ResponseEntity<ApiResponse<Map<String, Object>>> rejectSubscription(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(subscriptionService.rejectSubscription(id)));
    }
}

