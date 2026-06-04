package com.careersetu.controller;

import com.careersetu.entity.PremiumPurchase;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.UserRepository;
import com.careersetu.service.PremiumService;
import com.careersetu.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/premium")
@RequiredArgsConstructor
@Tag(name = "Premium PDF", description = "PDF purchase and access management")
@SecurityRequirement(name = "bearerAuth")
public class PremiumController {

    private final PremiumService premiumService;
    private final UserRepository userRepository;

    private Long currentUserId() {
        return userRepository.findByEmail(SecurityUtil.getCurrentEmail()).orElseThrow().getId();
    }

    // ─── USER ENDPOINTS ──────────────────────────────────────────────

    /**
     * Submit UPI payment proof for a PDF
     * Body: { pdfType, upiTransactionId, screenshotUrl }
     */
    @PostMapping("/purchase")
    @Operation(summary = "Submit UPI payment for PDF access")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitPurchase(
            @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(ApiResponse.success(
                premiumService.submitPurchaseRequest(
                        currentUserId(),
                        request.get("pdfType"),
                        request.get("upiTransactionId"),
                        request.get("screenshotUrl")
                )));
    }

    /**
     * Get current user's PDF access status
     * Returns map: { HR_CONTACTS: "APPROVED"/"PENDING"/"LOCKED", DSA_SHEET: ..., ... }
     */
    @GetMapping("/access")
    @Operation(summary = "Get user's PDF access status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyAccess() {
        return ResponseEntity.ok(ApiResponse.success(
                premiumService.getUserPdfAccess(currentUserId())));
    }

    // ─── ADMIN ENDPOINTS ─────────────────────────────────────────────

    @GetMapping("/admin/purchases")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: Get all PDF purchases")
    public ResponseEntity<ApiResponse<List<PremiumPurchase>>> getAllPurchases(
            @RequestParam(required = false, defaultValue = "ALL") String status) {
        return ResponseEntity.ok(ApiResponse.success(
                premiumService.getAllPurchases(status)));
    }

    @PutMapping("/admin/purchases/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: Approve PDF purchase and grant access")
    public ResponseEntity<ApiResponse<Map<String, Object>>> approvePurchase(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                premiumService.approvePurchase(id)));
    }

    @PutMapping("/admin/purchases/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: Reject PDF purchase")
    public ResponseEntity<ApiResponse<Map<String, Object>>> rejectPurchase(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(
                premiumService.rejectPurchase(id)));
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin: PDF purchase stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPdfStats() {
        return ResponseEntity.ok(ApiResponse.success(
                premiumService.getPdfStats()));
    }
}
