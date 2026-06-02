package com.careersetu.controller;

import com.careersetu.dto.subscription.CreateOrderRequest;
import com.careersetu.dto.subscription.VerifyPaymentRequest;
import com.careersetu.entity.Subscription;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.UserRepository;
import com.careersetu.service.SubscriptionService;
import com.careersetu.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/subscriptions")
@RequiredArgsConstructor
@Tag(name = "Subscriptions", description = "Premium subscription management via Razorpay")
@SecurityRequirement(name = "bearerAuth")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;
    private final UserRepository userRepository;

    private Long currentUserId() {
        return userRepository.findByEmail(SecurityUtil.getCurrentEmail()).orElseThrow().getId();
    }

    @PostMapping("/order")
    @Operation(summary = "Create a Razorpay order for MONTHLY (₹99) or YEARLY (₹799)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                subscriptionService.createOrder(currentUserId(), request)));
    }

    @PostMapping("/verify")
    @Operation(summary = "Verify Razorpay payment signature and activate premium")
    public ResponseEntity<ApiResponse<Void>> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request) {
        subscriptionService.verifyAndActivate(currentUserId(), request);
        return ResponseEntity.ok(ApiResponse.success("Premium activated successfully!", null));
    }

    @GetMapping("/history")
    @Operation(summary = "Get all subscription records for current user")
    public ResponseEntity<ApiResponse<List<Subscription>>> getHistory() {
        return ResponseEntity.ok(ApiResponse.success(
                subscriptionService.getUserSubscriptions(currentUserId())));
    }
}
