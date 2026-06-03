package com.careersetu.controller;

import com.careersetu.entity.Subscription;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.UserRepository;
import com.careersetu.service.SubscriptionService;
import com.careersetu.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    private Long currentUserId() {
        return userRepository.findByEmail(SecurityUtil.getCurrentEmail()).orElseThrow().getId();
    }

    @PostMapping("/upi-request")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitUpiRequest(
            @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(ApiResponse.success(
                subscriptionService.submitUpiRequest(
                        currentUserId(),
                        request.get("plan"),
                        request.get("transactionId"),
                        request.get("screenshotUrl")
                )));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<Subscription>>> getHistory() {
        return ResponseEntity.ok(ApiResponse.success(
                subscriptionService.getUserSubscriptions(currentUserId())));
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatus() {
        return ResponseEntity.ok(ApiResponse.success(
                subscriptionService.getUserSubscriptionStatus(currentUserId())));
    }
}